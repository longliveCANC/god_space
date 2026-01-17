(function() {
    // 1. 基础检查
    if (typeof window.NovaHooks === 'undefined') {
        console.error('[Summary Plugin] NovaHooks system not found. Plugin will not be loaded.');
        return;
    }

    // 2. 配置管理
    const STORAGE_KEY = 'nova_summary_plugin_settings';
    // 默认配置
    let settings = {
        startTag: '<summary>',
        endTag: '</summary>'
    };

    // 从本地存储加载配置
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
        try {
            settings = { ...settings, ...JSON.parse(savedSettings) };
        } catch (e) {
            console.error('[Summary Plugin] Failed to load settings', e);
        }
    }

    const saveSettings = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    };

    // 3. 核心逻辑：处理 AI 回复
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    async function processSummaryBeforeSave(hookData) {
        if (hookData.response) {
            // 动态读取当前配置的标签
            const sTag = settings.startTag;
            const eTag = settings.endTag;

            if (!sTag || !eTag) return hookData;

                 // 注意：去掉了 'g' 标志，因为我们只需要最后这一个匹配
            const pattern = `[\\s\\S]*${escapeRegExp(sTag)}([\\s\\S]*?)${escapeRegExp(eTag)}`;
            const summaryTagRegex = new RegExp(pattern);

            // 使用 match 而不是 matchAll
            const match = hookData.response.match(summaryTagRegex);

            const timeString = `${SafeGetValue(window.GameAPI.statData?.user?.current_location)}-${SafeGetValue(window.GameAPI.statData?.纪年)}-${SafeGetValue(window.GameAPI.statData?.日期)}-${SafeGetValue(window.GameAPI.statData?.时间)}`;

            if (match) {
                // match[1] 就是我们要的标签中间的内容
                const summaryContent = match[1];
                // 去掉换行符
                const cleanedContent = summaryContent.replace(/\n/g, '|').trim();

                // 构建命令字符串
                const commandString = `memory('summary.small.${timeString}','${cleanedContent}')`;

                // 执行命令
                try {
                    if (window.worldHelper && window.worldHelper.processUpdateMemoryCommands) {
                        await window.worldHelper.processUpdateMemoryCommands(commandString, -1);
                        console.log('[Summary Plugin] UpdateMemory command executed successfully.');
                    }
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

    // 4. UI 注入逻辑：动态插入到游戏设置菜单
    function injectSettingsUI() {
        // 寻找目标容器：游戏设置页面的容器
        const targetContainer = document.querySelector('#settings-page-game .settings-container');

        if (!targetContainer) {
            // 如果还没加载出来，延迟重试
            setTimeout(injectSettingsUI, 1000);
            return;
        }

        // 防止重复注入
        if (document.getElementById('summary-plugin-settings-ui')) return;

        // 创建设置区域的 DOM
        const settingDiv = document.createElement('div');
        settingDiv.id = 'summary-plugin-settings-ui';
        settingDiv.className = 'setting-item-column';
        // 样式模仿原有的 CSS
        settingDiv.style.cssText = `
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 15px;
            margin-bottom: 15px;
        `;

        settingDiv.innerHTML = `
            <label style="color: var(--primary-color); font-weight: bold; margin-bottom: 10px; display:block;">AI 自动摘要配置 (Summary Plugin)</label>
            <div style="display: flex; gap: 10px;">
                <div style="flex: 1;">
                    <span style="font-size: 12px; color: var(--text-secondary-color); display: block; margin-bottom: 4px;">摘要起始标签</span>
                    <input type="text" id="plugin-summary-start" value="${settings.startTag}"
                        style="width: 100%; background: var(--background-color); border: 1px solid var(--border-color); color: var(--text-color); padding: 6px; border-radius: 4px; font-family: monospace;">
                </div>
                <div style="flex: 1;">
                    <span style="font-size: 12px; color: var(--text-secondary-color); display: block; margin-bottom: 4px;">摘要结束标签</span>
                    <input type="text" id="plugin-summary-end" value="${settings.endTag}"
                        style="width: 100%; background: var(--background-color); border: 1px solid var(--border-color); color: var(--text-color); padding: 6px; border-radius: 4px; font-family: monospace;">
                </div>
            </div>
            <div style="margin-top: 8px; font-size: 12px; color: var(--text-secondary-color); opacity: 0.8;">
                * 插件会自动提取 AI 回复中位于这两个标签之间的内容，并执行 memory 更新命令。
            </div>
        `;

        // 插入到容器的最前面
        targetContainer.insertBefore(settingDiv, targetContainer.firstChild);

        // 绑定事件
        const startInput = settingDiv.querySelector('#plugin-summary-start');
        const endInput = settingDiv.querySelector('#plugin-summary-end');

        const updateSettings = () => {
            settings.startTag = startInput.value;
            settings.endTag = endInput.value;
            saveSettings();
        };

        startInput.addEventListener('input', updateSettings);
        endInput.addEventListener('input', updateSettings);

        console.log('[Summary Plugin] Settings UI injected into Game Settings page.');
    }

// 新增：处理消息渲染前的摘要检测
async function processSummaryBeforeRender(hookData) {
    // 检查历史记录
    if (typeof conversationHistory === 'undefined' || conversationHistory.length === 0) {
        return hookData;
    }

    const latestHistoryEntry = conversationHistory[conversationHistory.length - 1];
    
    // 只检查 AI 消息
    if (latestHistoryEntry.role !== 'assistant') {
        return hookData;
    }

    const messageContent = latestHistoryEntry.content || "";
    const sTag = settings.startTag;
    const eTag = settings.endTag;

    if (!sTag || !eTag) return hookData;

    // 检测是否存在至少一对完整的摘要标签
    const pattern = `${escapeRegExp(sTag)}[\\s\\S]*?${escapeRegExp(eTag)}`;
    const summaryRegex = new RegExp(pattern);

    if (summaryRegex.test(messageContent)) {
        // 发现摘要标签，插入占位符
        if (typeof collectedBatchOps !== 'undefined' && Array.isArray(collectedBatchOps)) {
            collectedBatchOps.push({
                type: 'memory',
                path: 'summary.small',
                key: '_',
                value: '_'
            });
            console.log('[Summary Plugin] Summary tag detected in history, placeholder inserted.');
        }
    }
    return hookData;
}
window.NovaHooks.add('before_message_render', processSummaryBeforeRender);
    // 5. 注册钩子并启动 UI
    window.NovaHooks.add('before_ai_response_save', processSummaryBeforeSave);

    // 等待 DOM 加载完成后注入 UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectSettingsUI);
    } else {
        injectSettingsUI();
    }

    console.log('[Summary Plugin] Loaded.');
})();