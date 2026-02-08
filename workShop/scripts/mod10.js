(function() {
       if (typeof window.NovaHooks === 'undefined') {
        console.error('[Refiner Plugin] NovaHooks system not found. Plugin will not be loaded.');
        return;
    }
    if (typeof window.GameAPI === 'undefined' || typeof window.GameAPI.showUpdateNotification !== 'function') {
        console.error('[Refiner Plugin] GameAPI.showUpdateNotification function not found. Notification feature will be disabled.');
    }

    function parseRefineJson(rawContent) {
        try {
            let jsonString = rawContent.replace(/```json\s*/g, '').replace(/\s*```/g, '').trim();
            const parsed = JSON.parse(jsonString);
            if (Array.isArray(parsed)) {
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

    function formatInstructionsForNotification(instructions) {
        let notificationContent = '[astro]内容已润色：';
        for (const original in instructions) {
            if (Object.hasOwnProperty.call(instructions, original)) {
                const corrected = instructions[original];
                notificationContent += `“${original}” 已修正为 “${corrected}”`;
            }
        }
        return notificationContent;
    }

    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * 净化文本，移除所有已知的指令标签，只留下可能的小说正文。
     * @param {string} text - 原始文本
     * @returns {string} - 净化后的文本
     */
    function purifyTextForJudgment(text) {
        if (!text) return "";
        return text
            .replace(/<refine>[\s\S]*?<\/refine>/g, '')      // 移除所有 refine 块
            .replace(/<!--[\s\S]*?-->/g, '')               // 移除所有 HTML 注释块
            .replace(/<options>[\s\S]*?<\/options>/g, '')   // 移除 options 块
            .replace(/<statusAnalyze>[\s\S]*?<\/statusAnalyze>/g, '') // 移除 statusAnalyze 块
            .replace(/<loreAnalyze>[\s\S]*?<\/loreAnalyze>/g, '')     // 移除 loreAnalyze 块
            .replace(/<updateMemory>[\s\S]*?<\/updateMemory>/g, '') // 移除 updateMemory 块
            .trim();
    }


    /**
     * 钩子处理函数:在保存前处理 AI 响应 (净化判断版)
     */
    async function processRefinementBeforeSave(hookData) {
        console.log('[Refiner DEBUG] Hook triggered. Initial response length:', hookData.response?.length);
        let currentResponse = hookData.response;
        const refineTagRegex = /<refine>([\s\S]*?)<\/refine>(?![\s\S]*<refine>)/;
        const match = currentResponse.match(refineTagRegex);

        if (match && match[1]) {
            console.log('[Refiner DEBUG] Successfully matched the LAST <refine> block.');
            const refineInstructions = parseRefineJson(match[1]);

            if (refineInstructions) {
                console.log('[Refiner DEBUG] Instructions parsed successfully.');

                // 移除refine标签，得到用于后续处理的当前响应
                let processedCurrentResponse = currentResponse.replace(refineTagRegex, '').trim();

                const history = hookData.context.history;
                const lastAiMessage = history.slice().reverse().find(m => m.role === 'assistant');

                // --- 核心修正：使用净化后的文本进行判断 ---
                const purifiedCurrentResponse = purifyTextForJudgment(processedCurrentResponse);
                const purifiedHistoryContent = lastAiMessage ? purifyTextForJudgment(lastAiMessage.content) : "";

                console.log('[Refiner DEBUG] Purified current response for judgment:', `"${purifiedCurrentResponse}"`);
                console.log('[Refiner DEBUG] Purified history content for judgment:', `"${purifiedHistoryContent.substring(0, 100)}..."`);

                let tempContent = "";
                let target = null;

                const hasInstructionForCurrent = Object.keys(refineInstructions).some(key => new RegExp(escapeRegExp(key), 'g').test(purifiedCurrentResponse));
                const hasInstructionForHistory = Object.keys(refineInstructions).some(key => new RegExp(escapeRegExp(key), 'g').test(purifiedHistoryContent));

                if (hasInstructionForCurrent) {
                    target = 'current';
                    tempContent = processedCurrentResponse; // 注意：修改时要用未净化的版本
                    console.log('[Refiner DEBUG] Target identified: CURRENT response.');
                } else if (hasInstructionForHistory) {
                    target = 'history';
                    tempContent = lastAiMessage.content; // 注意：修改时要用未净化的版本
                    console.log('[Refiner DEBUG] Target identified: HISTORY message.');
                } else {
                    console.warn('[Refiner DEBUG] No target found. None of the instructions match the purified current response or history.');
                }
                // --- 判断逻辑修正结束 ---

                if (target) {
                    let modificationCount = 0;
                    console.log('[Refiner DEBUG] Starting replacement loop. Initial tempContent length:', tempContent.length);
                    for (const originalText in refineInstructions) {
                        if (Object.hasOwnProperty.call(refineInstructions, originalText)) {
                            const replacementText = refineInstructions[originalText];
                            try {
                                const searchRegex = new RegExp(escapeRegExp(originalText), 'g');
                                if (searchRegex.test(tempContent)) {
                                    tempContent = tempContent.replace(searchRegex, replacementText);
                                    modificationCount++;
                                }
                            } catch (e) {
                                console.error('[Refiner Plugin] Regex error or replace failed for:', originalText, e);
                            }
                        }
                    }
                    console.log('[Refiner DEBUG] Replacement loop finished.');

                    if (target === 'current') {
                        processedCurrentResponse = tempContent;
                    } else if (target === 'history') {
                        lastAiMessage.content = tempContent;
                        if (lastAiMessage.swipes && lastAiMessage.swipes.length > 0) {
                            const swipeIndex = lastAiMessage.currentSwipeIndex !== undefined ? lastAiMessage.currentSwipeIndex : (lastAiMessage.swipes.length - 1);
                            lastAiMessage.swipes[swipeIndex] = tempContent;
                        }
                    }

                    if (modificationCount > 0) {
                        if (window.GameAPI && typeof window.GameAPI.showUpdateNotification === 'function') {
                            const notificationMessage = formatInstructionsForNotification(refineInstructions);
                            window.GameAPI.showUpdateNotification(notificationMessage);
                        }
                        console.log(`[Refiner Plugin] Applied ${modificationCount} corrections.`);
                    }
                }

                hookData.response = processedCurrentResponse;
                console.log('[Refiner DEBUG] Hook finished. Final hookData.response length:', hookData.response.length);
            }
        } else {
            console.warn('[Refiner DEBUG] No <refine> block found using the final regex.');
        }

        return hookData;
    }

    window.NovaHooks.add('before_ai_response_save', processRefinementBeforeSave);
    console.log('[Refiner Plugin] Registered ONLY on before_ai_response_save hook (Purify-Judgment Version).');
})();
