(function() {
    // 确保 NovaHooks 已经加载
    if (typeof window.NovaHooks === 'undefined') {
        console.error('[Summary Plugin] NovaHooks system not found. Plugin will not be loaded.');
        return;
    }

    /**
     * 提取最后一个 <summary/> 标签的内容并转换为 updateMemory 格式
     * @param {string} text - 要处理的文本
     * @returns {string} - 处理后的文本
     */
    function processSummaryTag(text) {
        // 使用正则表达式匹配所有 <summary>...</summary> 标签
        const summaryTagRegex = /<summary>([\s\S]*?)<\/summary>/g;
        const matches = [...text.matchAll(summaryTagRegex)];

        if (matches.length > 0) {
            // 获取最后一个匹配
            const lastMatch = matches[matches.length - 1];
            const summaryContent = lastMatch[1];

            // 去掉换行符
            const cleanedContent = summaryContent.replace(/\n/g, '').trim();

            // 构建 updateMemory 标签
            const updateMemoryTag = `<updateMemory>memory('summary.small.小摘要','${cleanedContent}')</updateMemory>`;

            // 将 updateMemory 标签添加到文本末尾
            const processedText = text + '\n' + updateMemoryTag;

            console.log('[Summary Plugin] Summary tag processed and updateMemory added.');
            return processedText;
        }

        return text;
    }

    /**
     * 钩子处理函数:在保存前处理 AI 响应
     * @param {object} hookData - 从 NovaHooks 传入的数据对象
     * @returns {object} - 处理后的数据对象
     */
    async function processSummaryBeforeSave(hookData) {
        if (hookData.response) {
            hookData.response = processSummaryTag(hookData.response);
        }
        return hookData;
    }

    /**
     * 钩子处理函数:在渲染前处理消息
     * @param {object} hookData - 从 NovaHooks 传入的数据对象
     * @returns {object} - 处理后的数据对象
     */
    // async function processSummaryBeforeRender(hookData) {
    //     if (hookData.message && hookData.message.content) {
    //         hookData.message.content = processSummaryTag(hookData.message.content);
    //     }
    //     return hookData;
    // }

    // 注册到两个钩子上
    window.NovaHooks.add('before_ai_response_save', processSummaryBeforeSave);
    // window.NovaHooks.add('before_message_render', processSummaryBeforeRender);

    console.log('[Summary Plugin] Registered on hooks.');
})();