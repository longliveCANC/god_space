(function() {
    // 确保 NovaHooks 已经加载
    if (typeof window.NovaHooks === 'undefined') {
        console.error('[Summary Plugin] NovaHooks system not found. Plugin will not be loaded.');
        return;
    }

    

 async function processSummaryBeforeSave(hookData) {
    if (hookData.response) {
        // 使用正则表达式匹配所有 <summary>...</summary> 标签
        const summaryTagRegex = /<summary>([\s\S]*?)<\/summary>/g;
        const matches = [...hookData.response.matchAll(summaryTagRegex)];

        if (matches.length > 0) {
            // 获取最后一个匹配
            const lastMatch = matches[matches.length - 1];
            const summaryContent = lastMatch[1];

            // 去掉换行符
            const cleanedContent = summaryContent.replace(/\n/g, '').trim();

            // 构建命令字符串
            const commandString = `memory('summary.small.小摘要','${cleanedContent}')`;

            // 执行命令
            try {
                await window.worldHelper.processUpdateMemoryCommands(commandString, -1);
                console.log('[Summary Plugin] UpdateMemory command executed successfully.');
            } catch (error) {
                console.error('[Summary Plugin] Failed to execute updateMemory command:', error);
            }

            // 构建 updateMemory 标签并添加到文本末尾
            const updateMemoryTag = `<updateMemory>${commandString}</updateMemory>`;
            hookData.response = hookData.response + '\n' + updateMemoryTag;
            
            console.log('[Summary Plugin] Summary tag processed and updateMemory added.');
        }
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