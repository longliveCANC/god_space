(function() {
    // 1. 确保基础环境
    if (typeof window.NovaHooks === 'undefined') {
        console.error('[CharSystem] NovaHooks not found.');
        return;
    }

    // 初始化存储对象 (如果不存在)
    window.assaSettingsData = window.assaSettingsData || {};
    window.assaSettingsData.forms = window.assaSettingsData.forms || {};

    /**
     * 解析 AI 返回的混合文本
     * 提取 <CharForm> 标签，存储数据，并返回清洗后的文本
     */
    function parseAndStoreCharacterData(text) {
        // 正则匹配 <CharForm> 及其属性和内容
        // 捕获组: 1=name, 2=desc, 3=content
        const formRegex = /<CharForm\s+name="([^"]+)"\s+desc="([^"]+)">([\s\S]*?)<\/CharForm>/g;

        let match;
        let hasUpdate = false;
        let cleanText = text;

        // 循环匹配所有形态（支持一次生成多个形态）
        while ((match = formRegex.exec(text)) !== null) {
            const [fullTag, formName, formDesc, innerContent] = match;

            // 1. 提取 Slot JSON
            const slotMatch = innerContent.match(/<CharSlot>([\s\S]*?)<\/CharSlot>/);
            let slotData = {};
            if (slotMatch) {
                try {
                    slotData = JSON.parse(slotMatch[1].trim());
                } catch (e) {
                    console.error(`[CharSystem] JSON Parse Error in ${formName}:`, e);
                }
            }

            // 2. 提取 Code
            const codeMatch = innerContent.match(/<CharCode>([\s\S]*?)<\/CharCode>/);
            const codeStr = codeMatch ? codeMatch[1].trim() : "";

            // 3. 存入 assaSettingsData
            // 结构: assaData.forms['形态名']
            window.assaSettingsData.forms[formName] = {
                desc: formDesc,
                slots: slotData,
                code: codeStr,
                timestamp: Date.now()
            };

            hasUpdate = true;
            console.log(`[CharSystem] Saved form: ${formName}`);

            // 4. 从显示的文本中移除整个标签
            cleanText = cleanText.replace(fullTag, '');
        }

        if (hasUpdate && window.GameAPI && window.GameAPI.showUpdateNotification) {
            window.GameAPI.showUpdateNotification(`[System] 已捕获角色形态数据`);
        }

        return cleanText.trim();
    }

    // ============================================================
    // 钩子注册
    // ============================================================

    // 钩子 1: 保存前处理 (解析并存储，存入数据库的是清洗后的文本)
    window.NovaHooks.add('before_ai_response_save', async (hookData) => {
        if (hookData.response) {
            hookData.response = parseAndStoreCharacterData(hookData.response);
        }
        return hookData;
    });

    // 钩子 2: 渲染前处理 (防止历史记录中的标签未被清洗显示出来)
    window.NovaHooks.add('before_message_render', async (hookData) => {
        if (hookData.message && hookData.message.content) {
            // 这里我们只做清洗，不重复存储，以免重复触发逻辑
             hookData.response = parseAndStoreCharacterData(hookData.message.content);
        }
        return hookData;
    });

    console.log("[CharSystem] Parser Plugin Loaded.");
})();
(function() {
    // ============================================================
    // 1. 基础配置与 CSS
    // ============================================================
    const ORB_ID = 'page-character-orb';
    const MODAL_ID = 'page-character-modal';

    const css = `
    /* 模态框基础设置 - 强制全屏透明 */
    #${MODAL_ID} .modal-content {
        background: transparent !important; /* 透明背景 */
        box-shadow: none !important;
        border: none !important;
        width: 100vw !important;
        height: 100vh !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        top: 0 !important;
        left: 0 !important;
        position: fixed !important;
    }

    /* 我们的主容器 */
    #mod11-container {
        width: 100%;
        height: 100%;
        position: relative;
        pointer-events: none; /* 让点击穿透空白区域 */
    }

    /* AI 绘图区域 - 必须允许点击交互 */
    #mod11-canvas-layer {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* 关闭按钮 */
    .mod11-close {
        position: absolute;
        top: 20px;
        right: 30px;
        font-size: 40px;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.6);
        z-index: 1000;
        pointer-events: auto;
        transition: color 0.3s;
    }
    .mod11-close:hover { color: #fff; }

    /* 底部形态切换栏 */
    #mod11-controls {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        z-index: 1000;
        pointer-events: auto;
    }
    .mod11-btn {
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #ddd;
        padding: 8px 16px;
        cursor: pointer;
        border-radius: 4px;
        backdrop-filter: blur(4px);
        transition: all 0.2s;
    }
    .mod11-btn:hover, .mod11-btn.active {
        background: rgba(255, 255, 255, 0.2);
        border-color: #fff;
        color: #fff;
    }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // ============================================================
    // 2. 状态管理
    // ============================================================
    const UI_CACHE = {
        isInitialized: false,
        canvasLayer: null,
        controlsLayer: null,
        currentForm: null
    };

    // ============================================================
    // 3. 核心逻辑：执行 AI 代码
    // ============================================================
    function executeCharacterCode(code, container) {
        try {
            // 清空容器
            container.innerHTML = '';

            // 创建一个函数，将 container 作为参数传入
            // 这样 AI 的代码里就可以直接使用 'container' 变量
            const runVisuals = new Function('container', code);

            runVisuals(container);
            console.log("Mod11: AI 代码执行成功");
        } catch (err) {
            console.error("Mod11: AI 代码执行失败", err);
            container.innerHTML = `<div style="color:red; text-align:center;">渲染错误: ${err.message}</div>`;
        }
    }

    // ============================================================
    // 4. 初始化与渲染
    // ============================================================
    function initInterface() {
        const modal = document.getElementById(MODAL_ID);
        const content = modal.querySelector('.modal-content');
        content.innerHTML = ''; // 清空原有内容

        // 1. 关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.className = 'mod11-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            modal.classList.remove('active');
            // 关闭时清空画布，停止可能的动画消耗
            if(UI_CACHE.canvasLayer) UI_CACHE.canvasLayer.innerHTML = '';
        };

        // 2. 主容器
        const container = document.createElement('div');
        container.id = 'mod11-container';

        // 3. 画布层 (AI 在这里画画)
        const canvasLayer = document.createElement('div');
        canvasLayer.id = 'mod11-canvas-layer';

        // 4. 控制层 (切换形态)
        const controlsLayer = document.createElement('div');
        controlsLayer.id = 'mod11-controls';

        container.appendChild(canvasLayer);
        container.appendChild(controlsLayer);
        content.appendChild(closeBtn);
        content.appendChild(container);

        UI_CACHE.canvasLayer = canvasLayer;
        UI_CACHE.controlsLayer = controlsLayer;
        UI_CACHE.isInitialized = true;
    }

    function renderControls() {
        const forms = window.assaSettingsData?.forms || {};
        const names = Object.keys(forms);
        const controls = UI_CACHE.controlsLayer;

        controls.innerHTML = ''; // 清空按钮

        if (names.length === 0) {
            controls.innerHTML = '<span style="color:#888">暂无形态数据</span>';
            return;
        }

        names.forEach(name => {
            const btn = document.createElement('button');
            btn.className = 'mod11-btn';
            btn.innerText = name;
            if (name === UI_CACHE.currentForm) btn.classList.add('active');

            btn.onclick = () => {
                UI_CACHE.currentForm = name;
                // 更新按钮状态
                Array.from(controls.children).forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                // 执行代码
                const formData = forms[name];
                if (formData && formData.code) {
                    executeCharacterCode(formData.code, UI_CACHE.canvasLayer);
                }
            };
            controls.appendChild(btn);
        });

        // 如果当前没有选中的，默认选第一个
        if (!UI_CACHE.currentForm && names.length > 0) {
            UI_CACHE.currentForm = names[0];
            // 触发点击
            controls.children[0].click();
        }
    }

    // ============================================================
    // 5. 覆盖 Orb 点击事件
    // ============================================================
    function overrideOrbClick() {
        const orb = document.getElementById(ORB_ID);
        if (!orb) return;

        const newOrb = orb.cloneNode(true);
        orb.parentNode.replaceChild(newOrb, orb);

        newOrb.addEventListener('click', function() {
            const modal = document.getElementById(MODAL_ID);

            if (!UI_CACHE.isInitialized) {
                initInterface();
            }

            modal.style.display = 'block';
            modal.classList.add('active');

            // 每次打开时重新渲染控制条（可能有新形态）
            renderControls();
        });
    }

    // 启动
    overrideOrbClick();
    console.log("Mod11: 动态角色展示系统已就绪。");

})();
