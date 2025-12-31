(function() {
    // 1. 基础检查
    if (typeof window.NovaHooks === 'undefined') {
        console.error('[Mod13 ContentExtractor] NovaHooks not found.');
        return;
    }

    // 2. 默认配置与持久化
    const STORAGE_KEY = 'mod13_extractor_settings';
    let settings = {
        startTag: '<build>',
        endTag: '</build>',
        shouldDelete: true,
        lastContent: '暂无捕获内容'
    };

    // 从本地读取配置
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
        try {
            settings = { ...settings, ...JSON.parse(savedSettings) };
        } catch (e) {
            console.error('[Mod13] Failed to load settings', e);
        }
    }

    const saveSettings = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    };

    // 3. 核心逻辑：内容提取
 function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

   // 修改点：增加 isSavePhase 参数
    function processMessage(text, isSavePhase = false) {
        if (!text) return text;

        let startPattern = settings.startTag === '(无标签)' ? '^' : escapeRegExp(settings.startTag);
        let endPattern = escapeRegExp(settings.endTag);

        const regex = new RegExp(`${startPattern}([\\s\\S]*?)${endPattern}`, 'm');
        const match = text.match(regex);

        if (match) {
            // 修改点：控制 UI 更新时机
            // 1. 如果是保存阶段 (isSavePhase=true)，说明是刚生成的最新消息，必须更新 UI。
            // 2. 如果未开启删除 (!settings.shouldDelete)，说明历史记录里保留了标签，浏览历史时允许更新 UI。
            // 3. 反之，如果开启了删除且处于渲染阶段，说明扫描到的是漏网的旧消息，忽略它，防止覆盖最新内容。
            if (isSavePhase || !settings.shouldDelete) {
                settings.lastContent = match[1].trim();
                ui.updateContent(settings.lastContent);
            }

            // 如果开启了删除功能
            if (settings.shouldDelete) {
                return text.replace(regex, '').trim();
            }
        }
        return text;
    }

    // 4. UI 类
    class ExtractorUI {
        constructor() {
            this.createStyles();
            this.createFloater();
            this.createPanel();
            this.initDraggable();
            this.syncTheme();

            // 定期同步主题（防止游戏切换主题后颜色没变）
            setInterval(() => this.syncTheme(), 2000);

            // 在 setInterval(() => this.syncTheme(), 2000); 之后添加：
document.addEventListener('mousedown', (e) => {
    if (this.panel.style.display === 'flex' &&
        !this.panel.contains(e.target) &&
        !this.floater.contains(e.target)) {
        this.togglePanel(false);
    }
});
// 适配手机触摸点击外部
document.addEventListener('touchstart', (e) => {
    if (this.panel.style.display === 'flex' &&
        !this.panel.contains(e.target) &&
        !this.floater.contains(e.target)) {
        this.togglePanel(false);
    }
}, { passive: true });
        }

        createStyles() {
            const style = document.createElement('style');
            style.innerHTML = `
                .mod13-floater {
                    position: fixed;
                    right: 20px;
                    top: 20%;
                    width: 45px;
                    height: 45px;
                    background: var(--container-bg-color);
                    border: 1px solid var(--primary-color);
                    border-radius: 50%;
                    cursor: grab;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 10px var(--glow-color);
                    transition: transform 0.2s;
                    user-select: none;
                }
                .mod13-floater:hover { transform: scale(1.1); }
                .mod13-floater:active { cursor: grabbing; }
                .mod13-floater svg { width: 24px; height: 24px; fill: var(--primary-color); }

                .mod13-panel {
                    position: fixed;
                    right: 80px;
                    top: 20%;
                    width: 320px;
                    max-height: 500px;
                        max-width: calc(100vw - 40px); /* 适配手机宽度 */
    max-height: 70vh; /* 适配高度，防止遮挡全部屏幕 */
                    background: var(--container-bg-color);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    display: none;
                    flex-direction: column;
                    z-index: 9998;
                    backdrop-filter: blur(10px);
                    color: var(--text-color);
                    font-family: sans-serif;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                }

                .mod13-header {
                    padding: 10px 15px;
                    background: rgba(0,0,0,0.2);
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: bold;
                    font-size: 14px;
                }

                .mod13-content-area {
                    padding: 15px;
                    overflow-y: auto;
                    font-size: 13px;
                    line-height: 1.5;
                    white-space: pre-wrap;
                    flex-grow: 1;
                    max-height: 300px;
                }

                .mod13-settings-area {
                    padding: 15px;
                    border-top: 1px solid var(--border-color);
                    background: rgba(0,0,0,0.1);
                    display: none;
                }

                .mod13-input-group { margin-bottom: 10px; }
                .mod13-input-group label { display: block; font-size: 12px; color: var(--text-secondary-color); margin-bottom: 4px; }
                .mod13-input-group input {
                    width: 100%;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid var(--border-color);
                    color: var(--text-color);
                    padding: 4px 8px;
                    border-radius: 4px;
                    box-sizing: border-box;
                }

                .mod13-btn {
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 4px;
                    border: 1px solid var(--primary-color);
                    background: transparent;
                    color: var(--primary-color);
                    font-size: 12px;
                }
                .mod13-btn:hover { background: var(--primary-color); color: #000; }

                .mod13-tab-btn { cursor: pointer; opacity: 0.7; font-size: 12px; }
                .mod13-tab-btn:hover { opacity: 1; }
            `;
            document.head.appendChild(style);
        }

        createFloater() {
            this.floater = document.createElement('div');
            this.floater.className = 'mod13-floater';
            this.floater.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z"/></svg>`;
            document.body.appendChild(this.floater);

            this.floater.onclick = (e) => {
                if (this.isDragging) return;
                this.togglePanel();
            };
        }

        createPanel() {
            this.panel = document.createElement('div');
            this.panel.className = 'mod13-panel';
            this.panel.innerHTML = `
                <div class="mod13-header">
                    <span>cot提取器</span>
                    <div style="display:flex; gap:10px;">
                        <span class="mod13-tab-btn" id="mod13-toggle-set">设置</span>
                        <span class="mod13-tab-btn" id="mod13-close">关闭</span>
                    </div>
                </div>
                <div class="mod13-content-area" id="mod13-display">${settings.lastContent}</div>
                <div class="mod13-settings-area" id="mod13-settings">
                    <div class="mod13-input-group">
                        <label>起始标签 (输入 "(无标签)" 代表从头开始)</label>
                        <input type="text" id="mod13-start-tag" value="${settings.startTag}">
                    </div>
                    <div class="mod13-input-group">
                        <label>结束标签</label>
                        <input type="text" id="mod13-end-tag" value="${settings.endTag}">
                    </div>
                    <div class="mod13-input-group" style="display:flex; align-items:center; gap:8px;">
                        <input type="checkbox" id="mod13-del-check" ${settings.shouldDelete ? 'checked' : ''} style="width:auto;">
                        <label style="margin:0">从原文中删除捕获内容</label>
                    </div>
                    <button class="mod13-btn" id="mod13-save-btn">保存配置</button>
                </div>
            `;
            document.body.appendChild(this.panel);

            // 事件绑定
            this.panel.querySelector('#mod13-close').onclick = () => this.togglePanel(false);
            this.panel.querySelector('#mod13-toggle-set').onclick = () => {
                const s = this.panel.querySelector('#mod13-settings');
                s.style.display = s.style.display === 'block' ? 'none' : 'block';
            };
            this.panel.querySelector('#mod13-save-btn').onclick = () => {
                settings.startTag = this.panel.querySelector('#mod13-start-tag').value;
                settings.endTag = this.panel.querySelector('#mod13-end-tag').value;
                settings.shouldDelete = this.panel.querySelector('#mod13-del-check').checked;
                saveSettings();
                worldHelper.showNovaAlert('配置已保存');
            };
        }

        updateContent(text) {
            const display = this.panel.querySelector('#mod13-display');
            if (display) display.innerText = text;
        }

 togglePanel(show) {
    const isVisible = show !== undefined ? show : this.panel.style.display === 'none';
    this.panel.style.display = isVisible ? 'flex' : 'none';

    if (isVisible) {
        const rect = this.floater.getBoundingClientRect();
        const panelWidth = 320; // 对应CSS中的宽度

        // 计算 Top，防止下方溢出
        let targetTop = rect.top;
        if (targetTop + 400 > window.innerHeight) {
            targetTop = window.innerHeight - 420;
        }

        // 计算 Right，防止左侧溢出
        let targetRight = window.innerWidth - rect.left + 10;
        if (window.innerWidth - targetRight < panelWidth) {
            targetRight = window.innerWidth - panelWidth - 20;
        }

        this.panel.style.top = Math.max(10, targetTop) + 'px';
        this.panel.style.right = Math.max(10, targetRight) + 'px';
    }
}

 initDraggable() {
    let x = 0, y = 0, startX = 0, startY = 0;
    this.isDragging = false;

    const onStart = (e) => {
        const point = e.touches ? e.touches[0] : e;
        startX = point.clientX;
        startY = point.clientY;
        const rect = this.floater.getBoundingClientRect();
        x = startX - rect.left;
        y = startY - rect.top;

        if (e.touches) {
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onEnd);
        } else {
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
        }
    };

    const onMove = (e) => {
        this.isDragging = true;
        if (e.cancelable) e.preventDefault(); // 阻止手机端滚动
        const point = e.touches ? e.touches[0] : e;
        let newX = point.clientX - x;
        let newY = point.clientY - y;

        // 边界限制
        newX = Math.max(0, Math.min(window.innerWidth - 45, newX));
        newY = Math.max(0, Math.min(window.innerHeight - 45, newY));

        this.floater.style.left = newX + 'px';
        this.floater.style.top = newY + 'px';
        this.floater.style.right = 'auto';
    };

    const onEnd = (e) => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        const point = e.changedTouches ? e.changedTouches[0] : e;
        if (Math.abs(point.clientX - startX) < 5 && Math.abs(point.clientY - startY) < 5) {
            this.isDragging = false;
        } else {
            setTimeout(() => this.isDragging = false, 50);
        }
    };

    this.floater.addEventListener('mousedown', onStart);
    this.floater.addEventListener('touchstart', onStart, { passive: false });
}

        syncTheme() {
            if (!window.GameAPI || typeof window.GameAPI.getThemeVar !== 'function') return;

            const currentTheme = {
                '--primary-color': window.GameAPI.getThemeVar('--primary-color') || '#00faff',
                '--secondary-color': window.GameAPI.getThemeVar('--secondary-color') || '#7affff',
                '--text-color': window.GameAPI.getThemeVar('--text-color') || '#e6f1ff',
                '--text-secondary-color': window.GameAPI.getThemeVar('--text-secondary-color') || '#a8c0e1',
                '--container-bg-color': window.GameAPI.getThemeVar('--container-bg-color') || 'rgba(10, 25, 47, 0.85)',
                '--border-color': window.GameAPI.getThemeVar('--border-color') || 'rgba(0, 250, 255, 0.3)',
                '--glow-color': window.GameAPI.getThemeVar('--glow-color') || 'rgba(0, 250, 255, 0.5)',
                '--background-color': window.GameAPI.getThemeVar('--background-color') || '#0a192f'
            };

            const applyTo = (element) => {
                if (!element) return;
                Object.entries(currentTheme).forEach(([key, val]) => {
                    element.style.setProperty(key, val);
                });
            };

            applyTo(this.panel);
            applyTo(this.floater);
        }
    }

    // 5. 实例化 UI
    const ui = new ExtractorUI();

    // 6. 钩子处理
     async function handleHook(hookData) {
        // 处理保存前的响应 (这是最新生成的内容，传入 true)
        if (hookData.response) {
            hookData.response = processMessage(hookData.response, true);
        }
        // 处理渲染前的消息 (这是历史渲染，传入 false)
        if (hookData.message && hookData.message.content) {
            hookData.message.content = processMessage(hookData.message.content, false);
        }
        return hookData;
    }

    window.NovaHooks.add('before_ai_response_save', handleHook);
    window.NovaHooks.add('before_message_render', handleHook);

    console.log('[Mod13] Content Extractor Plugin Loaded.');
})();