/**
 * Nova AI Response Refiner Plugin
 *
 * This script hooks into the AI response pipeline to perform text replacements
 * based on instructions within a <refine/> tag.
 * The <refine/> tag and its content will be removed after processing.
 */
(function() {
    // 确保 NovaHooks 已经加载
    if (typeof window.NovaHooks === 'undefined') {
        console.error('[Refiner Plugin] NovaHooks system not found. Plugin will not be loaded.');
        return;
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
    async function processRefinementBeforeSave(hookData) {
        if (hookData.response) {
            hookData.response = applyRefinement(hookData.response);
        }
        return hookData;
    }

    /**
     * 钩子处理函数:在渲染前处理消息内容
     * @param {object} hookData - 从 NovaHooks 传入的数据对象
     * @returns {object} - 处理后的数据对象
     */
    // async function processRefinementBeforeRender(hookData) {
    //     if (hookData.message && hookData.message.content) {
    //         hookData.message.content = applyRefinement(hookData.message.content);
    //     }
    //     return hookData;
    // }

    // 注册到两个钩子上
    window.NovaHooks.add('before_ai_response_save', processRefinementBeforeSave);
    // window.NovaHooks.add('before_message_render', processRefinementBeforeRender);
    
    console.log('[Refiner Plugin] Registered on both before_ai_response_save and before_message_render hooks.');
})();