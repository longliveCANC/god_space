 

 (function() {
    // 确保 NovaHooks 和 GameAPI 已经加载
    if (typeof window.NovaHooks === 'undefined') {
        console.error('[Refiner Plugin] NovaHooks system not found. Plugin will not be loaded.');
        return;
    }
    if (typeof window.GameAPI === 'undefined' || typeof window.GameAPI.showUpdateNotification !== 'function') {
        console.error('[Refiner Plugin] GameAPI.showUpdateNotification function not found. Notification feature will be disabled.');
    }

    /**
     * 解析 <refine/> 标签内的 JSON 数据。
     * @param {string} rawContent - 包含 JSON 的原始字符串
     * @returns {object | null} - 解析后的 JSON 对象或 null
     */
    function parseRefineJson(rawContent) {
        try {
            // 移除可选的 ```json ... ``` 代码块标记（包括换行符）
            let jsonString = rawContent.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim();
            const parsed = JSON.parse(jsonString);

            // 兼容两种格式：
            // 1. 数组格式: [{original: "...", corrected: "..."}]
            // 2. 对象格式: {"original": "corrected"}
            if (Array.isArray(parsed)) {
                // 将数组格式转换为对象格式
                const result = {};
                parsed.forEach(item => {
                    if (item.original && item.corrected) {
                        result[item.original] = item.corrected;
                    }
                });
                return result;
            }

            return parsed;
        } catch (error) {
            console.error('[Refiner Plugin] Failed to parse JSON inside <refine/> tag:', error);
            console.error('[Refiner Plugin] Raw content was:', rawContent);
            return null;
        }
    }

    /**
     * 将润色指令格式化为通知内容。
     * @param {object} instructions - 润色指令对象
     * @returns {string} - 格式化后的 HTML 字符串
     */
    function formatInstructionsForNotification(instructions) {
        let notificationContent = '[astro]内容已润色：';
        for (const original in instructions) {
            if (Object.hasOwnProperty.call(instructions, original)) {
                const corrected = instructions[original];
                // 使用 HTML 编码以防止 XSS 攻击
                notificationContent += `“${original}” 已修正为 “${corrected}”`;
            }
        }
        return notificationContent;
    }

    /**
     * 对文本应用润色指令
     * @param {string} text - 要处理的文本
     * @returns {string} - 处理后的文本
     */
    function applyRefinement(text) {
        // 使用正则表达式匹配 <refine>...</refine> 标签
        const refineTagRegex = /<refine>([\s\S]*?)<\/refine>/;
        const match = text.match(refineTagRegex);

        if (match && match[1]) {
            const refineInstructions = parseRefineJson(match[1]);

            if (refineInstructions) {
                console.log('[Refiner Plugin] Found refinement instructions. Applying changes...');

                // 新增功能：显示通知
                if (window.GameAPI && typeof window.GameAPI.showUpdateNotification === 'function') {
                    const notificationMessage = formatInstructionsForNotification(refineInstructions);
                    window.GameAPI.showUpdateNotification(notificationMessage);
                    console.log('[Refiner Plugin] Displayed refinement notification.');
                }

                // 1. 在应用替换规则之前，先将 <refine> 标签从文本中移除
                let processedText = text.replace(refineTagRegex, '').trim();

                // 2. 遍历 JSON 对象，执行文本替换
                for (const originalText in refineInstructions) {
                    if (Object.hasOwnProperty.call(refineInstructions, originalText)) {
                        const replacementText = refineInstructions[originalText];
                        // 使用 new RegExp 创建正则表达式，'g' 标志确保替换所有出现的实例
                        const searchRegex = new RegExp(originalText, 'g');
                        processedText = processedText.replace(searchRegex, replacementText);
                    }
                }

                console.log('[Refiner Plugin] Refinement complete.');
                return processedText;
            }
        }

        return text;
    }

    /**
     * 钩子处理函数:在保存前处理 AI 响应
     * @param {object} hookData - 从 NovaHooks 传入的数据对象
     * @returns {object} - 处理后的数据对象
     */
 /**
     * 钩子处理函数:在保存前处理 AI 响应
     * 兼容模式 + 优化版：只匹配最后一个 <refine> 标签对，防止贪婪匹配。
     * @param {object} hookData - 从 NovaHooks 传入的数据对象
     * @returns {object} - 处理后的数据对象
     */
   async function processRefinementBeforeSave(hookData) {
        let currentResponse = hookData.response;
        const refineTagRegex = /<refine>([\s\S]*?)<\/refine>\s*$/;
        const match = currentResponse.match(refineTagRegex);

        if (match && match[1]) {
            const refineInstructions = parseRefineJson(match[1]);

            if (refineInstructions) {
                console.log('[Refiner Plugin] Last refinement instruction block found.');

                let processedCurrentResponse = currentResponse.replace(refineTagRegex, '').trim();
                const history = hookData.context.history;
                const lastAiMessage = history.slice().reverse().find(m => m.role === 'assistant');
                let modificationCount = 0;

                // --- 核心修复逻辑 ---
                // 1. 创建一个临时的、可修改的文本变量
                let tempContent = "";
                let target = null; // 'current' 或 'history'

                // 2. 判断我们的目标文本是当前响应还是一步历史
                if (Object.keys(refineInstructions).some(key => new RegExp(key, 'g').test(processedCurrentResponse))) {
                    tempContent = processedCurrentResponse;
                    target = 'current';
                } else if (lastAiMessage && Object.keys(refineInstructions).some(key => new RegExp(key, 'g').test(lastAiMessage.content))) {
                    tempContent = lastAiMessage.content;
                    target = 'history';
                }

                // 3. 如果找到了目标，就在临时变量上执行所有替换
                if (target) {
                    for (const originalText in refineInstructions) {
                        if (Object.hasOwnProperty.call(refineInstructions, originalText)) {
                            const replacementText = refineInstructions[originalText];
                            try {
                                const searchRegex = new RegExp(originalText, 'g');
                                // 始终在 tempContent 上操作，避免链式替换问题
                                if (searchRegex.test(tempContent)) {
                                    tempContent = tempContent.replace(searchRegex, replacementText);
                                    modificationCount++;
                                }
                            } catch (e) {
                                console.warn('[Refiner Plugin] Regex error or replace failed for:', originalText, e);
                            }
                        }
                    }

                    // 4. 循环结束后，一次性将结果写回
                    if (target === 'current') {
                        processedCurrentResponse = tempContent;
                    } else if (target === 'history') {
                        lastAiMessage.content = tempContent;
                        // 同步更新 Swipes
                        if (lastAiMessage.swipes && lastAiMessage.swipes.length > 0) {
                            const swipeIndex = lastAiMessage.currentSwipeIndex !== undefined ? lastAiMessage.currentSwipeIndex : (lastAiMessage.swipes.length - 1);
                            lastAiMessage.swipes[swipeIndex] = tempContent;
                        }
                    }
                }
                // --- 修复逻辑结束 ---


                // 5. 显示通知
                if (modificationCount > 0 && window.GameAPI && typeof window.GameAPI.showUpdateNotification === 'function') {
                    const notificationMessage = formatInstructionsForNotification(refineInstructions);
                    window.GameAPI.showUpdateNotification(notificationMessage);
                    console.log(`[Refiner Plugin] Applied ${modificationCount} corrections.`);
                }

                // 6. 将处理后的文本赋值回 hookData
                hookData.response = processedCurrentResponse;
            }
        }

        return hookData;
    }
     async function processRefinementBeforeRender(hookData) {
        if (hookData.message && hookData.message.content) {
            hookData.message.content = applyRefinement(hookData.message.content);
        }
        return hookData;
    }

    // 注册到两个钩子上
    window.NovaHooks.add('before_ai_response_save', processRefinementBeforeSave);
    window.NovaHooks.add('before_message_render', processRefinementBeforeRender);

    console.log('[Refiner Plugin] Registered on before_ai_response_save hook.');
})();

 