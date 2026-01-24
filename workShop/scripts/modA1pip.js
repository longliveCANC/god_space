(function () {
    // =================================================================
    // 1. 核心配置与状态管理
    // =================================================================
    const STORAGE_KEY = 'Nova_Pipeline_Config';
    const TAVERN_VAR_KEY = 'nova_pipeline_config';

    // 默认配置
    const DEFAULT_CONFIG = [
        {
            id: 0,
            name: "Pre-Processing",
            ex_batches: []
        },
        {
            id: 1,
            name: "Main Chat",
            ex_batches: [
                {
                    id: 0,
                    name: "Standard Generation",
                    enabled: true,
                    render: false,
                    type: 'chat',
                    api_config: 'default',
                    processing_msg: "回应你的行动中..."
                }
            ]
        },
        {
            id: 2,
            name: "Memory Update",
            ex_batches: [
                {
                    id: 0,
                    name: "Memory Analysis",
                    enabled: true,
                    render: false,
                    type: 'memory',
                    bound_worldbooks: ['小蝌蚪找妈妈', 'x-mod', 'x-dlc'],
                    api_config: 'custom_v2',
                    processing_msg: "正在分析记忆变更..."
                }
            ]
        },
        {
            id: 3,
            name: "Deep Summary",
            ex_batches: [
                {
                    id: 0,
                    name: "Chapter Summary",
                    enabled: false,
                    render: false,
                    type: 'extension',
                    bound_worldbooks: ['自动摘要-规则书', '剧情梳理-Mod'],
                    api_config: 'default',
                    processing_msg: "正在撰写章节摘要..."
                }
            ]
        }
    ];

    // 当前运行时的配置副本
    let currentPipelineConfig = null;

    // --- 数据同步层 ---

     // --- 数据同步层 ---

     // 初始化：优先级 LocalStorage > Chat Variables > Memory > Default
    async function initConfig() {
        try {
            let loadedConfig = null;
            let source = 'Default';

            // 1. 尝试从 LocalStorage 获取 (最高优先级)
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                loadedConfig = JSON.parse(stored);
                source = 'LocalStorage';
            }

            // 2. 如果本地没有，尝试从 Chat Variables 获取
            if (!loadedConfig && typeof TavernHelper !== 'undefined') {
                const chatVars = await TavernHelper.getVariables({ type: 'chat' });
                if (chatVars && chatVars[TAVERN_VAR_KEY]) {
                    loadedConfig = chatVars[TAVERN_VAR_KEY];
                    source = 'Chat Variables';
                }
            }

            // 3. 如果 Chat 也没有，检查内存中是否已有有效配置
            if (!loadedConfig && typeof BATCH_PIPELINE_CONFIG !== 'undefined' && Array.isArray(BATCH_PIPELINE_CONFIG)) {
                loadedConfig = BATCH_PIPELINE_CONFIG;
                source = 'Memory';
            }

            // 4. 应用配置到全局变量
            if (loadedConfig) {
                BATCH_PIPELINE_CONFIG = loadedConfig;
            } else {
                // 兜底：使用默认配置
                BATCH_PIPELINE_CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            }

            // 5. 【关键修改】直接引用全局对象，不再深拷贝
            // 这样编辑器内的修改会直接作用于 BATCH_PIPELINE_CONFIG
            currentPipelineConfig = BATCH_PIPELINE_CONFIG;
   // 5. 【关键】加载后立即同步回 Tavern Variables
        if (typeof TavernHelper !== 'undefined' && TavernHelper.insertOrAssignVariables) {
            try {
                await TavernHelper.insertOrAssignVariables(
                    { [TAVERN_VAR_KEY]: currentPipelineConfig },
                    { type: 'chat' }
                );
            } catch (e) {
                console.warn("[Nova Pipeline] Failed to sync to Chat Variables:", e);
            }
        }

        console.log(`[Nova Pipeline] Config initialized from: ${source}`);
    } catch (e) {
        console.error("[Nova Pipeline Editor] Init Error:", e);
        // 出错兜底
        BATCH_PIPELINE_CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        currentPipelineConfig = BATCH_PIPELINE_CONFIG;
    }
}

    // 保存：持久化到 LocalStorage 和 Tavern 变量
    async function saveConfig() {
        try {
        BATCH_PIPELINE_CONFIG = currentPipelineConfig;
            // 2. LocalStorage (保存到浏览器缓存)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPipelineConfig));

            // 3. Tavern Variables (保存到当前对话存档，随存档携带)
            if (typeof TavernHelper !== 'undefined' && TavernHelper.insertOrAssignVariables) {
                await TavernHelper.insertOrAssignVariables(
                    { [TAVERN_VAR_KEY]: currentPipelineConfig },
                    { type: 'chat' }
                );
            }

            // await initDisplay(false);

            console.log("[Nova Pipeline Editor] Configuration persisted to Storage and Chat Variables.");
        } catch (e) {
            console.error("[Nova Pipeline Editor] Save Error:", e);
            if(typeof showNovaAlert === 'function') showNovaAlert("保存配置失败，请检查控制台");
        }
    }

    // 获取当前环境可用的世界书列表
    function getAvailableWorldbooks() {
        const list = new Set();
        try {
            // 1. 角色绑定的
            if (typeof getCharWorldbookNames === 'function') {
                const charBooks = getCharWorldbookNames('current');
                if (charBooks) {
                    if (charBooks.primary) list.add(charBooks.primary);
                    if (Array.isArray(charBooks.additional)) {
                        charBooks.additional.forEach(b => list.add(b));
                    }
                }
            }
            // 2. 全局绑定的
            if (typeof getGlobalWorldbookNames === 'function') {
                const globalBooks = getGlobalWorldbookNames();
                if (Array.isArray(globalBooks)) {
                    globalBooks.forEach(b => list.add(b));
                }
            }
        } catch (e) {
            console.warn("获取可用世界书列表失败:", e);
        }
        return Array.from(list);
    }

        // 内部独立的确认弹窗函数
    function showConfirmModal(title, message, onConfirm, onCancel) {
        // 1. 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000; /* 确保高于编辑器的 9999 */
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(2px);
            opacity: 0;
            transition: opacity 0.2s ease;
            font-family: var(--base-font-family);
        `;

        // 2. 创建弹窗主体
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: var(--container-bg-color);
            border: 1px solid var(--primary-color);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            max-width: 90%;
            display: flex;
            flex-direction: column;
            gap: 15px;
            transform: scale(0.95);
            transition: transform 0.2s ease;
        `;

        // 3. 标题
        const titleEl = document.createElement('div');
        titleEl.textContent = title;
        titleEl.style.cssText = `
            font-size: 18px;
            font-weight: bold;
            color: var(--primary-color);
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 10px;
        `;

        // 4. 消息内容
        const msgEl = document.createElement('div');
        msgEl.innerHTML = message;
        msgEl.style.cssText = `
            font-size: 14px;
            color: var(--text-color);
            line-height: 1.5;
        `;

        // 5. 按钮容器
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 10px;
        `;

        // 6. 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = `
            padding: 6px 16px;
            background: transparent;
            border: 1px solid var(--text-secondary-color);
            color: var(--text-secondary-color);
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        cancelBtn.onmouseover = () => { cancelBtn.style.borderColor = 'var(--text-color)'; cancelBtn.style.color = 'var(--text-color)'; };
        cancelBtn.onmouseout = () => { cancelBtn.style.borderColor = 'var(--text-secondary-color)'; cancelBtn.style.color = 'var(--text-secondary-color)'; };

        // 7. 确认按钮
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '确认';
        confirmBtn.style.cssText = `
            padding: 6px 16px;
            background: var(--primary-color);
            border: 1px solid var(--primary-color);
            color: #000;
            font-weight: bold;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        confirmBtn.onmouseover = () => { confirmBtn.style.opacity = '0.8'; };
        confirmBtn.onmouseout = () => { confirmBtn.style.opacity = '1'; };

        // 8. 事件处理
        const close = () => {
            overlay.style.opacity = '0';
            modal.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 200);
        };

        cancelBtn.onclick = () => {
            close();
            if (onCancel) onCancel();
        };

        confirmBtn.onclick = () => {
            close();
            if (onConfirm) onConfirm();
        };

        // 9. 组装
        btnContainer.appendChild(cancelBtn);
        btnContainer.appendChild(confirmBtn);
        modal.appendChild(titleEl);
        modal.appendChild(msgEl);
        modal.appendChild(btnContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 10. 触发动画
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        });
    }

    // =================================================================
    // 2. 样式注入 (CSS)
    // =================================================================
    function injectStyles() {
        if (document.getElementById('modA1-styles')) return;

        const style = document.createElement('style');
        style.id = 'modA1-styles';
        style.textContent = `
            /* 全屏模态框容器 */
            .modA1-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: var(--background-color); /* 使用全局变量 */
                z-index: 9999;
                display: flex;
                flex-direction: column;
                font-family: var(--base-font-family);
                color: var(--text-color);
                backdrop-filter: blur(5px);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .modA1-overlay.active {
                opacity: 1;
                pointer-events: auto;
            }

            /* 头部 */
            .modA1-header {
                padding: 20px 40px;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(0,0,0,0.2);
            }

            .modA1-title {
                font-size: 24px;
                font-weight: bold;
                color: var(--primary-color);
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            /* 内容滚动区 */
            .modA1-content {
                flex: 1;
                overflow-y: auto;
                padding: 40px;
                display: flex;
                flex-direction: column;
                gap: 30px;
                max-width: 1200px;
                margin: 0 auto;
                width: 100%;
                box-sizing: border-box;
            }

            /* Batch 容器 */
            .modA1-batch-container {
                border-left: 2px solid var(--border-color);
                padding-left: 20px;
                position: relative;
                margin-bottom: 20px;
            }

            .modA1-batch-header {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 15px;
            }

            .modA1-batch-id {
                background: var(--primary-color);
                color: #000;
                font-weight: bold;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 14px;
            }

            .modA1-batch-name-input {
                font-size: 18px;
                color: var(--secondary-color);
                background: transparent;
                border: none;
                border-bottom: 1px dashed var(--border-color);
                padding: 2px 5px;
                width: 300px;
            }
            .modA1-batch-name-input:focus {
                outline: none;
                border-bottom: 1px solid var(--primary-color);
            }

            /* ExBatch 卡片网格 */
            .modA1-exbatch-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 20px;
            }

            /* ExBatch 卡片 */
            .modA1-card {
                background: var(--container-bg-color);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                transition: transform 0.2s, background 0.2s;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }

            .modA1-card:hover {
                background: rgba(15, 35, 60, 0.9);
                transform: translateY(-2px);
                border-color: var(--glow-color);
            }

            .modA1-card.locked {
                border-color: rgba(255, 255, 255, 0.1);
                opacity: 0.9;
                background: rgba(10, 20, 30, 0.6);
            }

            /* 表单元素 */
            .modA1-form-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .modA1-label {
                font-size: 12px;
                color: var(--text-secondary-color);
                text-transform: uppercase;
            }

            .modA1-input, .modA1-select {
                background: rgba(0,0,0,0.3);
                border: 1px solid var(--border-color);
                color: var(--text-color);
                padding: 8px;
                border-radius: 4px;
                font-family: monospace;
                width: 100%;
                box-sizing: border-box;
            }

            .modA1-input:focus, .modA1-select:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 5px var(--glow-color);
            }

            .modA1-input:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                border-style: dashed;
            }

            /* 开关 Toggle */
            .modA1-toggle-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }

            .modA1-toggle {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 20px;
            }
            .modA1-toggle input { opacity: 0; width: 0; height: 0; }
            .modA1-slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: #333;
                transition: .4s;
                border-radius: 20px;
            }
            .modA1-slider:before {
                position: absolute;
                content: "";
                height: 14px;
                width: 14px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            input:checked + .modA1-slider { background-color: var(--success-color); }
            input:checked + .modA1-slider:before { transform: translateX(20px); }
            input:disabled + .modA1-slider { background-color: #555; cursor: not-allowed; }

            /* 按钮 */
            .modA1-btn {
                padding: 8px 16px;
                border: 1px solid var(--primary-color);
                background: transparent;
                color: var(--primary-color);
                cursor: pointer;
                border-radius: 4px;
                font-weight: bold;
                transition: all 0.2s;
            }
            .modA1-btn:hover {
                background: var(--primary-color);
                color: #000;
            }
            .modA1-btn-danger {
                border-color: var(--danger-color);
                color: var(--danger-color);
            }
            .modA1-btn-danger:hover {
                background: var(--danger-color);
                color: #fff;
            }
            .modA1-btn-add {
                border-style: dashed;
                opacity: 0.7;
                width: 100%;
                padding: 15px;
                color: var(--text-secondary-color);
                border-color: var(--text-secondary-color);
            }
            .modA1-btn-add:hover {
                opacity: 1;
                
                border-color: var(--primary-color);
            }

            /* 标签输入区域 */
            .modA1-tags-container {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                background: rgba(0,0,0,0.3);
                padding: 5px;
                border-radius: 4px;
                border: 1px solid var(--border-color);
                min-height: 36px;
            }
            .modA1-tag {
                background: rgba(0, 250, 255, 0.2);
                color: var(--primary-color);
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .modA1-tag-remove {
                cursor: pointer;
                font-weight: bold;
            }
            .modA1-tag-input {
                background: transparent;
                border: none;
                color: white;
                flex: 1;
                min-width: 60px;
                outline: none;
            }

            /* 滚动条美化 */
            .modA1-content::-webkit-scrollbar { width: 8px; }
            .modA1-content::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
            .modA1-content::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }

                        /* --- 布局调整 --- */
            .modA1-body {
                display: flex;
                height: calc(100vh - 80px); /* 减去头部高度 */
                overflow: hidden;
            }

            /* 左侧编辑器区域 */
            .modA1-editor-area {
                flex: 3;
                overflow-y: auto;
                padding: 30px;
                border-right: 1px solid var(--border-color);
            }

            /* 右侧仓库区域 (参考 mod07) */
            .modA1-sidebar {
                flex: 1;
                min-width: 300px;
                background: rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                border-left: 1px solid var(--border-color);
            }

            .modA1-sidebar-header {
                padding: 15px;
                font-weight: bold;
                background: rgba(255, 255, 255, 0.05);
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .modA1-sidebar-content {
                flex: 1;
                overflow-y: auto;
                padding: 15px;
            }

            /* 仓库卡片样式 */
            .modA1-store-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid transparent;
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: 0.2s;
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 10px;
                align-items: center;
            }

            .modA1-store-card:hover {
                border-color: var(--primary-color);
                background: rgba(0, 250, 255, 0.05);
                transform: translateX(-2px);
            }

            .modA1-card-title {
                font-weight: bold;
                color: var(--primary-color);
                margin-bottom: 4px;
                font-size: 14px;
            }

            .modA1-card-desc {
                font-size: 12px;
                color: var(--text-secondary-color);
            }

            .modA1-tag-source {
                font-size: 10px;
                padding: 2px 4px;
                border-radius: 3px;
                background: rgba(255, 183, 77, 0.2);
                color: #ffb74d;
                margin-left: 5px;
            }
            /* --- 移动端适配 (悬浮球抽屉) --- */
            .modA1-drawer-toggle {
                display: none; /* PC端隐藏 */
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--primary-color);
                color: #000;
                border: none;
                box-shadow: 0 4px 15px rgba(0, 250, 255, 0.4);
                z-index: 10002;
                font-size: 24px;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s;
            }
            .modA1-drawer-toggle:active {
                transform: scale(0.9);
            }

            @media (max-width: 768px) {
                .modA1-body {
                    flex-direction: column;
                }

                /* 编辑器占满全屏 */
                .modA1-editor-area {
                    border-right: none;
                    width: 100%;
                    padding: 15px; /* 手机端减少内边距 */
                }

                /* 侧边栏变为抽屉 */
                .modA1-sidebar {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 85%;
                    max-width: 320px;
                    height: 100%;
                    background: var(--background-color); /* 确保不透明 */
                    border-left: 1px solid var(--primary-color);
                    box-shadow: -10px 0 30px rgba(0,0,0,0.5);
                    transform: translateX(100%); /* 默认移出屏幕 */
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 10001;
                }

                .modA1-sidebar.open {
                    transform: translateX(0); /* 滑入 */
                }

                /* 显示悬浮球 */
                .modA1-drawer-toggle {
                    display: flex;
                }

                /* 遮罩层 (可选，点击空白关闭) */
                .modA1-sidebar-backdrop {
                    position: fixed; top:0; left:0; width:100%; height:100%;
                    background: rgba(0,0,0,0.5); z-index: 10000;
                    display: none;
                }
                .modA1-sidebar-backdrop.active { display: block; }
            }

        `;
        document.head.appendChild(style);
    }

    // =================================================================
    // 3. UI 构建与逻辑
    // =================================================================

        // =================================================================
    // 3.5 仓库核心逻辑 (Deep Merge & IO)
    // =================================================================

    const PIPELINE_LOCAL_KEY = 'Nova_Pipeline_Local_Templates';

    // --- 深度合并逻辑 ---
    // 规则：
    // 1. 数组 (Batches/ExBatches) 按 ID 匹配。存在的合并，不存在的追加。
    // 2. 数组 (Bound Worldbooks) 取并集 (Union)。
    // 3. 基础类型 (String, Boolean) 覆盖。
    function deepMergePipeline(target, source) {
        if (!Array.isArray(source)) return target;

        source.forEach(sourceBatch => {
            // 1. 在目标中寻找对应的 Batch
            let targetBatch = target.find(b => b.id === sourceBatch.id);

            if (!targetBatch) {
                // 如果不存在，直接深拷贝追加
                target.push(JSON.parse(JSON.stringify(sourceBatch)));
                return;
            }

            // 2. 合并 Batch 属性 (Name)
            if (sourceBatch.name) targetBatch.name = sourceBatch.name;

            // 3. 处理 ExBatches
            if (sourceBatch.ex_batches && Array.isArray(sourceBatch.ex_batches)) {
                sourceBatch.ex_batches.forEach(sourceEx => {
                    let targetEx = targetBatch.ex_batches.find(ex => ex.id === sourceEx.id);

                    if (!targetEx) {
                        // 追加新的 ExBatch
                        targetBatch.ex_batches.push(JSON.parse(JSON.stringify(sourceEx)));
                    } else {
                        // 合并现有 ExBatch
                        // 基础字段覆盖
                        if (sourceEx.name !== undefined) targetEx.name = sourceEx.name;
                        if (sourceEx.enabled !== undefined) targetEx.enabled = sourceEx.enabled;
                        if (sourceEx.render !== undefined) targetEx.render = sourceEx.render;
                        if (sourceEx.api_config !== undefined) targetEx.api_config = sourceEx.api_config;
                        if (sourceEx.processing_msg !== undefined) targetEx.processing_msg = sourceEx.processing_msg;

                        // 世界书列表取并集 (去重)
                        if (sourceEx.bound_worldbooks && Array.isArray(sourceEx.bound_worldbooks)) {
                            const existingSet = new Set(targetEx.bound_worldbooks || []);
                            sourceEx.bound_worldbooks.forEach(wb => existingSet.add(wb));
                            targetEx.bound_worldbooks = Array.from(existingSet);
                        }
                         if (sourceEx.excluded_worldbooks && Array.isArray(sourceEx.excluded_worldbooks)) {
                            const existingSet = new Set(targetEx.excluded_worldbooks || []);
                            sourceEx.excluded_worldbooks.forEach(wb => existingSet.add(wb));
                            targetEx.excluded_worldbooks = Array.from(existingSet);
                        }
                    }
                });
            }
        });
        return target;
    }

    // --- 本地模板管理 ---
    function getLocalPipelineTemplates() {
        try {
            return JSON.parse(localStorage.getItem(PIPELINE_LOCAL_KEY) || '{}');
        } catch (e) { return {}; }
    }

    function saveLocalPipelineTemplate(name, config) {
        const current = getLocalPipelineTemplates();
        current[name] = {
            desc: `本地保存于 ${new Date().toLocaleString()}`,
            config: JSON.parse(JSON.stringify(config)), // 保存快照
            timestamp: Date.now()
        };
        localStorage.setItem(PIPELINE_LOCAL_KEY, JSON.stringify(current));
    }

    function deleteLocalPipelineTemplate(name) {
        const current = getLocalPipelineTemplates();
        delete current[name];
        localStorage.setItem(PIPELINE_LOCAL_KEY, JSON.stringify(current));
    }

    // --- 世界书扫描逻辑 ---
    async function scanWorldbookConfigs() {
        const templates = [];
        try {
            // 获取所有绑定的世界书名称
            const charBooks = typeof getCharWorldbookNames === 'function' ? getCharWorldbookNames('current') : { additional: [] };
            const globalBooks = typeof getGlobalWorldbookNames === 'function' ? getGlobalWorldbookNames() : [];
            const currentChatBook = typeof getChatWorldbookName === 'function' ? getChatWorldbookName('current') : null;

            const allBooks = new Set([
                ...globalBooks,
                ...(charBooks.additional || []),
                charBooks.primary,
                currentChatBook
            ].filter(Boolean));

            for (const bookName of allBooks) {
                try {
                    const entries = await getLorebookEntries(bookName);
                    // 寻找 comment 为 [batchconfig] 的条目
                    const configEntries = entries.filter(e => e.comment === '[batchconfig]' && e.content);

                    configEntries.forEach(entry => {
                        try {
                            const json = JSON.parse(entry.content);
                            // 简单的格式校验：必须是数组且包含 id
                            if (Array.isArray(json) && json.length > 0 && json[0].id !== undefined) {
                                templates.push({
                                    name: json.name || `${bookName} 配置`, // 支持 json 根对象带 name 属性，或者用书名
                                    desc: `来源: ${bookName} (UID:${entry.uid})`,
                                    source: bookName,
                                    config: json
                                });
                            } else if (json.config && Array.isArray(json.config)) {
                                // 支持 { name: "...", config: [...] } 格式
                                templates.push({
                                    name: json.name || `${bookName} 配置`,
                                    desc: json.desc || `来源: ${bookName}`,
                                    source: bookName,
                                    config: json.config
                                });
                            }
                        } catch (parseErr) {
                            console.warn(`解析世界书 ${bookName} 配置失败:`, parseErr);
                        }
                    });
                } catch (e) { console.warn(`读取世界书 ${bookName} 失败`); }
            }
        } catch (err) {
            console.error("扫描世界书配置出错:", err);
        }
        return templates;
    }

    // --- 导出逻辑 ---
    function exportConfig() {
        const exportObj = {
            name: "Nova Pipeline Export " + new Date().toLocaleDateString(),
            desc: "玩家导出的 Pipeline 配置",
            config: currentPipelineConfig
        };

        const jsonStr = JSON.stringify(exportObj, null, 2);

        // 创建简单的复制弹窗
        const overlay = document.createElement('div');
        overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10001;display:flex;justify-content:center;align-items:center;";
        overlay.innerHTML = `
            <div style="background:var(--container-bg-color);padding:20px;border:1px solid var(--primary-color);width:500px;border-radius:8px;">
                <h3 style="color:var(--primary-color);margin-top:0;">📤 导出配置</h3>
                <p style="font-size:12px;color:var(--text-secondary-color);">请复制下方内容，在世界书中新建条目，<b>备注(Comment)</b> 填写 <span style="color:var(--success-color);user-select:all;">[batchconfig]</span></p>
                <textarea style="width:100%;height:200px;background:rgba(0,0,0,0.3);color:#fff;border:1px solid var(--border-color);font-family:monospace;">${jsonStr}</textarea>
                <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:10px;">
                    <button class="modA1-btn" id="modA1-export-close">关闭</button>
                    <button class="modA1-btn" id="modA1-export-copy">复制</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('#modA1-export-close').onclick = () => overlay.remove();
        overlay.querySelector('#modA1-export-copy').onclick = () => {
            overlay.querySelector('textarea').select();
            document.execCommand('copy');
            if(typeof showNovaAlert === 'function') showNovaAlert('已复制到剪贴板');
            overlay.remove();
        };
    }


    let modalElement = null;
    function createPipelineEditor() {
        if (modalElement) return modalElement;

        modalElement = document.createElement('div');
        modalElement.className = 'modA1-overlay';
        modalElement.innerHTML = `
            <div class="modA1-header">
                <div class="modA1-title">多异步管线</div> <!-- 手机端标题缩短一点 -->
                <div style="display:flex; gap:10px;">
                    <button class="modA1-btn" id="modA1-save-btn">保存并应用</button>
                    <button class="modA1-btn modA1-btn-danger" id="modA1-close-btn">关闭</button>
                </div>
            </div>

            <div class="modA1-body">
                <!-- 左侧：编辑器 -->
                <div class="modA1-editor-area" id="modA1-content-area"></div>

                <!-- 手机端遮罩层 -->
                <div class="modA1-sidebar-backdrop" id="modA1-backdrop"></div>

                <!-- 右侧：Pip 仓库 (手机端为抽屉) -->
                <div class="modA1-sidebar" id="modA1-sidebar">
                    <div class="modA1-sidebar-header">
                        <span>管线仓库</span>
                        <button class="modA1-btn" style="padding:2px 8px; font-size:12px;" id="modA1-export-btn">导出配置文本</button>
                    </div>
                    <div class="modA1-sidebar-content" id="modA1-store-area"></div>
                </div>
            </div>

            <!-- 悬浮球 -->
            <button class="modA1-drawer-toggle" id="modA1-drawer-btn">📦</button>
        `;

        document.body.appendChild(modalElement);

        // --- 事件绑定 ---

        // 1. 顶部按钮
        modalElement.querySelector('#modA1-close-btn').onclick = () => modalElement.classList.remove('active');
        modalElement.querySelector('#modA1-save-btn').onclick = async () => {
            await saveConfig();
            if(typeof showNovaAlert === 'function') showNovaAlert('配置已保存');
            modalElement.classList.remove('active');
        };
        modalElement.querySelector('#modA1-export-btn').onclick = exportConfig;

        // 2. 悬浮球与抽屉逻辑
        const sidebar = modalElement.querySelector('#modA1-sidebar');
        const backdrop = modalElement.querySelector('#modA1-backdrop');
        const drawerBtn = modalElement.querySelector('#modA1-drawer-btn');

        const toggleDrawer = () => {
            sidebar.classList.toggle('open');
            backdrop.classList.toggle('active');
        };

        drawerBtn.onclick = toggleDrawer;
        backdrop.onclick = toggleDrawer; // 点击遮罩关闭

        // 3. 点击编辑器区域时，如果是手机端且抽屉打开，则关闭抽屉
        modalElement.querySelector('#modA1-content-area').onclick = () => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                toggleDrawer();
            }
        };

        return modalElement;
    }


    async function renderStoreContent() {
        const container = document.getElementById('modA1-store-area');
        if (!container) return;
        container.innerHTML = '';

        // --- A. 本地保存区 ---
        const localHeader = document.createElement('div');
        localHeader.style.cssText = "color:var(--text-secondary-color); font-size:12px; margin-bottom:5px; font-weight:bold;";
        localHeader.textContent = "💾 本地模板";
        container.appendChild(localHeader);

        // 保存输入框
        const saveDiv = document.createElement('div');
        saveDiv.style.cssText = "display:flex; gap:5px; margin-bottom:15px;";
        saveDiv.innerHTML = `
            <input type="text" id="modA1-local-name" class="modA1-input" placeholder="模板名称..." style="padding:4px;">
            <button class="modA1-btn" id="modA1-local-save" style="padding:4px 8px;">+</button>
        `;
        container.appendChild(saveDiv);

        // 绑定保存事件
        saveDiv.querySelector('#modA1-local-save').onclick = () => {
            const name = document.getElementById('modA1-local-name').value.trim();
            if (!name) return;
            saveLocalPipelineTemplate(name, currentPipelineConfig);
            document.getElementById('modA1-local-name').value = '';
            renderStoreContent(); // 刷新
        };

        // 渲染本地列表
        const localTemplates = getLocalPipelineTemplates();
        Object.keys(localTemplates).forEach(key => {
            const tmpl = localTemplates[key];
            const card = document.createElement('div');
            card.className = 'modA1-store-card';
            card.innerHTML = `
                <div>
                    <div class="modA1-card-title">${key}</div>
                    <div class="modA1-card-desc">${tmpl.desc}</div>
                </div>
                <button class="modA1-btn modA1-btn-danger" style="padding:2px 6px; font-size:10px;">🗑️</button>
            `;

            // 点击卡片：加载 (覆盖)
            card.onclick = (e) => {
                if (e.target.tagName === 'BUTTON') return; // 忽略删除按钮
                // if(confirm(`确定要加载快照 "${key}" 吗？这将完全覆盖当前配置。`)) {
                    currentPipelineConfig = JSON.parse(JSON.stringify(tmpl.config));
                    renderEditorContent();
                    if(typeof showNovaAlert === 'function') showNovaAlert(`已加载快照: ${key}`);
                // }
            };

            // 删除按钮
            card.querySelector('button').onclick = () => {
                // if(confirm(`删除快照 "${key}"?`)) {
                    deleteLocalPipelineTemplate(key);
                    renderStoreContent();
                // }
            };
            container.appendChild(card);
        });

        // --- B. 世界书导入区 ---
        const wbHeader = document.createElement('div');
        wbHeader.style.cssText = "color:var(--text-secondary-color); font-size:12px; margin: 15px 0 5px 0; font-weight:bold; border-top:1px solid var(--border-color); padding-top:10px;";
        wbHeader.textContent = "🌍 世界书模板";
        container.appendChild(wbHeader);

        const loading = document.createElement('div');
        loading.textContent = "正在扫描世界书...";
        loading.style.cssText = "font-size:12px; color:var(--text-secondary-color); font-style:italic;";
        container.appendChild(loading);

        // 异步扫描
        const wbTemplates = await scanWorldbookConfigs();
        container.removeChild(loading);

        if (wbTemplates.length === 0) {
            const empty = document.createElement('div');
            empty.textContent = "未找到带有 [batchconfig] 的条目。";
            empty.style.cssText = "font-size:12px; color:var(--text-secondary-color); padding:10px;";
            container.appendChild(empty);
        } else {
            wbTemplates.forEach(tmpl => {
                const card = document.createElement('div');
                card.className = 'modA1-store-card';
                card.innerHTML = `
                    <div>
                        <div class="modA1-card-title">
                            ${tmpl.name}
                            <span class="modA1-tag-source">${tmpl.source}</span>
                        </div>
                        <div class="modA1-card-desc">${tmpl.desc}</div>
                    </div>
                    <div style="font-size:18px; color:var(--success-color);">⬇️</div>
                `;

                // 点击卡片：Deep Merge
                card.onclick = () => {
                    // if(confirm(`确定要合并配置 "${tmpl.name}" 吗？\n这将更新现有ID的配置并添加新的配置，不会删除现有内容。`)) {
                        deepMergePipeline(currentPipelineConfig, tmpl.config);
                        renderEditorContent();
                        if(typeof showNovaAlert === 'function') showNovaAlert(`配置 "${tmpl.name}" 已合并成功！`);
                
                };
                container.appendChild(card);
            });
        }
    }

    // 渲染整个列表
    function renderEditorContent() {
        const container = document.getElementById('modA1-content-area');
        if (!container) return;
        container.innerHTML = '';

        currentPipelineConfig.forEach((batch, batchIndex) => {
            const batchEl = document.createElement('div');
            batchEl.className = 'modA1-batch-container';

            // Batch 头部 (名称可编辑)
            const headerDiv = document.createElement('div');
            headerDiv.className = 'modA1-batch-header';

            const idSpan = document.createElement('span');
            idSpan.className = 'modA1-batch-id';
            idSpan.textContent = `Batch ${batch.id}`;

            const nameInput = document.createElement('input');
            nameInput.className = 'modA1-batch-name-input';
            nameInput.value = batch.name;
            nameInput.oninput = (e) => { batch.name = e.target.value; };

            headerDiv.appendChild(idSpan);
            headerDiv.appendChild(nameInput);

            // 只有 Batch > 2 才允许删除整个 Batch
            if (batch.id > 2) {
                const delBatchBtn = document.createElement('button');
                delBatchBtn.className = 'modA1-btn modA1-btn-danger';
                delBatchBtn.style.cssText = "padding:2px 6px; font-size:12px; margin-left:auto;";
                delBatchBtn.textContent = '删除 Batch';
                delBatchBtn.onclick = () => {
                    if(typeof showConfirmModal === 'function') {
                        showConfirmModal('删除批次', '确定要删除整个批次及其所有子流程吗？', () => {
                            currentPipelineConfig.splice(batchIndex, 1);
                            renderEditorContent();
                        });
                    }
                };
                headerDiv.appendChild(delBatchBtn);
            }

            batchEl.appendChild(headerDiv);

            // ExBatch 网格
            const grid = document.createElement('div');
            grid.className = 'modA1-exbatch-grid';
            grid.id = `modA1-grid-${batchIndex}`;

            // 渲染 ExBatches
            batch.ex_batches.forEach((exBatch, exIndex) => {
                const card = createExBatchCard(batch, batchIndex, exBatch, exIndex);
                grid.appendChild(card);
            });

            // 添加 ExBatch 按钮
            const addBtn = document.createElement('button');
            addBtn.className = 'modA1-btn modA1-btn-add';
            addBtn.textContent = '+ 添加扩展流程 (ExBatch)';
            addBtn.onclick = () => addNewExBatch(batchIndex);
            grid.appendChild(addBtn);

            batchEl.appendChild(grid);
            container.appendChild(batchEl);
        });

        // 添加 Batch 按钮
        const addBatchBtn = document.createElement('button');
        addBatchBtn.className = 'modA1-btn modA1-btn-add';
        addBatchBtn.style.marginTop = '20px';
        addBatchBtn.textContent = '+ 添加新批次 (New Batch)';
        addBatchBtn.onclick = addNewBatch;
        container.appendChild(addBatchBtn);
    }
 function getApiOptionsHTML(currentValue) {
        // 1. 基础选项
        let html = `<option value="default" ${currentValue === 'default' ? 'selected' : ''}>Default (Main)</option>`;
        html += `<option value="custom_v2" ${currentValue === 'custom_v2' ? 'selected' : ''}>API 2 (Legacy)</option>`;

        // 2. 从 API 池加载动态选项
        try {
            const pool = JSON.parse(localStorage.getItem('nova_multi_api_pool') || '{}');
            Object.keys(pool).forEach(id => {
                const name = pool[id].name || `Custom API (${id})`;
                const isSelected = currentValue === id ? 'selected' : '';
                html += `<option value="${id}" ${isSelected}>${name}</option>`;
            });
        } catch (e) {
            console.error("Error loading API pool", e);
        }

        return html;
    }
     // 创建单个 ExBatch 卡片
    function createExBatchCard(batch, batchIndex, exBatch, exIndex) {
        const card = document.createElement('div');

        // 判定是否为核心锁定流程 (禁止删除/禁用的流程)
        const isLocked = (batch.id === 1 && exBatch.id === 0) || (batch.id === 2 && exBatch.id === 0);

        // 判定是否允许编辑世界书 (非锁定节点 OR Batch 2 核心节点)
        const allowWbEdit = !isLocked || (batch.id === 2 && exBatch.id === 0);

        card.className = `modA1-card ${isLocked ? 'locked' : ''}`;

        // 1. 头部：ID + 开关 (锁定状态下开关禁用)
        const headerRow = document.createElement('div');
        headerRow.style.cssText = "display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid var(--border-color); padding-bottom:10px;";

        headerRow.innerHTML = `
            <div style="font-weight:bold; color:var(--primary-color);">Ex ${exBatch.id}</div>
            <div style="display:flex; gap:15px;">
                <div style="display:flex; align-items:center; gap:5px;">
                    <span class="modA1-label">启用</span>
                    <label class="modA1-toggle">
                        <input type="checkbox" ${exBatch.enabled ? 'checked' : ''} class="modA1-input-enable" ${isLocked ? 'disabled' : ''}>
                        <span class="modA1-slider"></span>
                    </label>
                </div>
                <div style="display:flex; align-items:center; gap:5px;">
                    <span class="modA1-label">渲染</span>
                    <label class="modA1-toggle">
                        <input type="checkbox" ${exBatch.render ? 'checked' : ''} class="modA1-input-render" ${isLocked ? 'disabled' : ''}>
                        <span class="modA1-slider"></span>
                    </label>
                </div>
            </div>
        `;

        if (!isLocked) {
            headerRow.querySelector('.modA1-input-enable').onchange = (e) => { exBatch.enabled = e.target.checked; };
            headerRow.querySelector('.modA1-input-render').onchange = (e) => { exBatch.render = e.target.checked; };
        }
        card.appendChild(headerRow);

        // 2. 名称 (Name) - 锁定时只读
        card.appendChild(createInputGroup('流程名称', exBatch.name, (val) => exBatch.name = val, isLocked));

        // 3. 处理消息 (Processing Msg) - 始终可编辑
        card.appendChild(createInputGroup('处理提示语 (Flavor Text)', exBatch.processing_msg || '', (val) => exBatch.processing_msg = val));

        // 4. API 配置
        const isMainChatCore = (batch.id === 1 && exBatch.id === 0);
        if (!isMainChatCore) {
            const apiGroup = document.createElement('div');
            apiGroup.className = 'modA1-form-group';
            apiGroup.innerHTML = `
                <span class="modA1-label">API 配置</span>
                <select class="modA1-select">
                    ${getApiOptionsHTML(exBatch.api_config)}
                </select>
            `;
            apiGroup.querySelector('select').onchange = (e) => { exBatch.api_config = e.target.value; };
            card.appendChild(apiGroup);
        }

        // === 5. 世界书配置区域 (绑定 & 排除) ===
        // 只要 allowWbEdit 为 true，就显示这部分
        if (allowWbEdit) {
            // --- 辅助函数：创建标签输入区域 ---
            const createTagInputSection = (labelText, dataArrayKey, placeholderColor = 'var(--primary-color)') => {
                const group = document.createElement('div');
                group.className = 'modA1-form-group';

                // 确保数组存在
                if (!exBatch[dataArrayKey]) exBatch[dataArrayKey] = [];

                // 标题行 + 快捷选择
                const header = document.createElement('div');
                header.style.cssText = "display:flex; justify-content:space-between; align-items:center;";
                header.innerHTML = `<span class="modA1-label">${labelText}</span>`;

                const quickSelect = document.createElement('select');
                quickSelect.className = 'modA1-select';
                quickSelect.style.cssText = "width:auto; padding:2px; font-size:12px; height:24px;";
                quickSelect.innerHTML = `<option value="">+ 快速添加...</option>`;

                getAvailableWorldbooks().forEach(book => {
                    const opt = document.createElement('option');
                    opt.value = book;
                    opt.textContent = book;
                    quickSelect.appendChild(opt);
                });
                header.appendChild(quickSelect);
                group.appendChild(header);

                // 标签容器
                const tagsContainer = document.createElement('div');
                tagsContainer.className = 'modA1-tags-container';

                const renderTags = () => {
                    // 清理旧标签 (保留 input)
                    Array.from(tagsContainer.children).forEach(child => {
                        if (!child.classList.contains('modA1-tag-input')) tagsContainer.removeChild(child);
                    });
                    const input = tagsContainer.querySelector('.modA1-tag-input');

                    exBatch[dataArrayKey].forEach((wb, idx) => {
                        const tag = document.createElement('span');
                        tag.className = 'modA1-tag';
                        // 排除列表用红色系，绑定列表用默认色
                        if (dataArrayKey === 'excluded_worldbooks') {
                            tag.style.background = 'rgba(255, 80, 80, 0.2)';
                            tag.style.color = '#ff8080';
                        }
                        tag.innerHTML = `${wb} <span class="modA1-tag-remove">×</span>`;
                        tag.querySelector('.modA1-tag-remove').onclick = () => {
                            exBatch[dataArrayKey].splice(idx, 1);
                            renderTags();
                        };
                        tagsContainer.insertBefore(tag, input);
                    });
                };

                // 添加逻辑
                const addTag = (val) => {
                    if (val && !exBatch[dataArrayKey].includes(val)) {
                        exBatch[dataArrayKey].push(val);
                        renderTags();
                    }
                };

                quickSelect.onchange = (e) => {
                    addTag(e.target.value);
                    e.target.value = "";
                };

                const tagInput = document.createElement('input');
                tagInput.className = 'modA1-tag-input';
                tagInput.placeholder = '输入前缀并回车...';
                tagInput.onkeydown = (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(tagInput.value.trim());
                        tagInput.value = '';
                    }
                };

                tagsContainer.appendChild(tagInput);
                renderTags(); // 初始渲染
                group.appendChild(tagsContainer);
                return group;
            };

            // 5.1 渲染绑定列表
            card.appendChild(createTagInputSection('✅ 绑定世界书 (包含)', 'bound_worldbooks'));

            // 5.2 渲染排除列表 (新增)
            card.appendChild(createTagInputSection('⛔ 排除世界书 (屏蔽)', 'excluded_worldbooks'));
        }

        // === 6. 删除按钮 (仅非锁定节点显示) ===
        if (!isLocked) {
            const delBtn = document.createElement('button');
            delBtn.className = 'modA1-btn modA1-btn-danger';
            delBtn.style.marginTop = '10px';
            delBtn.textContent = '删除此流程';
            delBtn.onclick = () => {
                if(typeof showConfirmModal === 'function') {
                    showConfirmModal('删除确认', '确定要删除这个扩展流程吗？', () => {
                        currentPipelineConfig[batchIndex].ex_batches.splice(exIndex, 1);
                        renderEditorContent();
                    });
                }
            };
            card.appendChild(delBtn);
        } else {
            // 锁定状态下的提示
            const lockedHint = document.createElement('div');
            lockedHint.style.cssText = "font-size:12px; color:var(--text-secondary-color); font-style:italic; margin-top:10px; text-align:center;";
            if (batch.id === 2 && exBatch.id === 0) {
                lockedHint.textContent = "核心记忆节点：仅可修改世界书规则与API";
            } else {
                lockedHint.textContent = "核心流程配置已锁定";
            }
            card.appendChild(lockedHint);
        }

        return card;
    }



    // 辅助：创建输入框组
    function createInputGroup(label, value, onChange, disabled = false) {
        const div = document.createElement('div');
        div.className = 'modA1-form-group';
        div.innerHTML = `<span class="modA1-label">${label}</span>`;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'modA1-input';
        input.value = value;
        input.disabled = disabled;
        input.oninput = (e) => onChange(e.target.value);
        div.appendChild(input);
        return div;
    }

    // --- 操作逻辑 ---

    function addNewExBatch(batchIndex) {
        const batch = currentPipelineConfig[batchIndex];
        const newId = batch.ex_batches.length > 0
            ? Math.max(...batch.ex_batches.map(b => b.id)) + 1
            : 0;

        batch.ex_batches.push({
            id: newId,
            name: "New Extension Process",
            enabled: true,
            render: false,
            type: 'extension',
            bound_worldbooks: [],
            api_config: 'default',
            processing_msg: "正在处理扩展内容..."
        });
        renderEditorContent();
    }

    function addNewBatch() {
        const newId = currentPipelineConfig.length > 0
            ? Math.max(...currentPipelineConfig.map(b => b.id)) + 1
            : 0;

        currentPipelineConfig.push({
            id: newId,
            name: "New Pipeline Batch",
            ex_batches: []
        });
        renderEditorContent();
    }

    // =================================================================
    // 4. 注入入口按钮
    // =================================================================

    function injectSettingsUI() {
        // 寻找目标容器：游戏设置页面的容器
        const targetContainer = document.querySelector('#settings-page-game .settings-container');

        if (!targetContainer) {
            setTimeout(injectSettingsUI, 1000);
            return;
        }

        if (document.getElementById('nova-pipeline-settings-ui')) return;

        const settingDiv = document.createElement('div');
        settingDiv.id = 'nova-pipeline-settings-ui';
        settingDiv.className = 'setting-item-column';
        settingDiv.style.cssText = `
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 15px;
            margin-bottom: 15px;
        `;

        settingDiv.innerHTML = `
            <label style="color: var(--primary-color); font-weight: bold; margin-bottom: 10px; display:block;">
                多异步管线配置
            </label>
            <div style="font-size: 12px; color: var(--text-secondary-color); margin-bottom: 10px;">
                可视化管理多步异步生成流程、API分配及世界书绑定。
            </div>
            <button id="nova-open-editor-btn" class="menu_button" style="width: 100%;">
                打开可视化编辑器
            </button>
        `;

        // 插入到容器的最前面
        targetContainer.insertBefore(settingDiv, targetContainer.firstChild);

        // 绑定打开事件
        document.getElementById('nova-open-editor-btn').onclick = () => {
            initConfig().then(() => {
                const modal = createPipelineEditor();
                renderEditorContent();
                renderStoreContent(); // <--- 新增这一行
                modal.classList.add('active');
            });
        };

        console.log('[Nova Pipeline] Settings UI injected.');
    }

    // =================================================================
    // 5. 启动
    // =================================================================

    // 注入样式
    injectStyles();

    // 尝试初始化数据
    initConfig();

    // 开始尝试注入UI
    injectSettingsUI();

})();
