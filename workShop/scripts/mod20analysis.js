(function () {
    // ==========================================================================
    // 1. Mod16 轮盘通用管理器 (保持原样，确保核心功能)
    // ==========================================================================
    window.Mod16WheelManager = window.Mod16WheelManager || (function() {
        const CONTAINER_ID = 'mod16-wheel-container';
        const ORB_ID = 'world-book-orb';

        function ensureStyle() {
            if (document.getElementById('mod16-wheel-style')) return;
            const style = document.createElement('style');
            style.id = 'mod16-wheel-style';
            style.textContent = `
                :root {
                    --mod16-primary: var(--primary-color, #00faff);
                    --mod16-bg: var(--container-bg-color, rgba(10, 25, 47, 0.95));
                    --mod16-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                #mod16-wheel-container {
                    position: fixed; width: 150px; height: 150px;
                    z-index: 999; pointer-events: none;
                    opacity: 0; transition: opacity 0.3s, transform 0.3s;
                    transform: translateX(30px);
                }
                #mod16-wheel-container.visible { opacity: 1; transform: translateX(0); pointer-events: auto; }
                .mod16-wheel-body {
                    width: 100%; height: 100%; position: relative;
                    display: flex; align-items: center; justify-content: center;
                }
                .mod16-wheel-body::before {
                    content: ''; position: absolute; width: 260px; height: 260px;
                    border-radius: 50%; background: transparent; z-index: -1;
                }
                .mod16-wheel-btn {
                    background: var(--mod16-bg); border: 1px solid var(--mod16-primary);
                    color: var(--mod16-primary); font-family: var(--mod16-font);
                    font-size: 12px; font-weight: bold; cursor: pointer;
                    position: absolute; width: 70px; height: 70px; border-radius: 50%;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    transition: all 0.2s; transform-origin: 110px 50%; left: -35px;
                    transform: rotate(var(--mod16-angle, 0deg)) scale(1);
                }
                .mod16-wheel-btn:hover {
                    color: #fff; background: var(--mod16-primary);
                    box-shadow: 0 0 15px var(--mod16-primary); z-index: 10;
                    transform: rotate(var(--mod16-angle, 0deg)) scale(1.15);
                }
                .mod16-wheel-icon { font-size: 20px; margin-bottom: 2px; display:block; }
                .mod16-btn-content { pointer-events: none; transition: transform 0.2s; }
            `;
            document.head.appendChild(style);
        }

        function updateLayout() {
            const container = document.getElementById(CONTAINER_ID);
            if (!container) return;
            const btns = container.querySelectorAll('.mod16-wheel-btn');
            const count = btns.length;
            if (count === 0) return;
            const totalArc = count > 3 ? 120 : 100;
            const startAngle = -totalArc / 2;
            const step = count > 1 ? totalArc / (count - 1) : 0;
            btns.forEach((btn, index) => {
                const angle = count === 1 ? 0 : startAngle + (step * index);
                btn.style.setProperty('--mod16-angle', `${angle}deg`);
                const content = btn.querySelector('.mod16-btn-content');
                if (content) content.style.transform = `rotate(${-angle}deg)`;
            });
        }

        function ensureContainer() {
            ensureStyle();
            let container = document.getElementById(CONTAINER_ID);
            if (!container) {
                container = document.createElement('div');
                container.id = CONTAINER_ID;
                container.innerHTML = `<div class="mod16-wheel-body"></div>`;
                document.body.appendChild(container);
                setupTriggers(container);
            }
            return container;
        }

        function setupTriggers(wheel) {
            let isHoveringOrb = false;
            let isHoveringWheel = false;
            const updatePosition = () => {
                const orb = document.getElementById(ORB_ID);
                if (!orb) return;
                const rect = orb.getBoundingClientRect();
                const wheelContainer = document.getElementById(CONTAINER_ID);
                const rotationRadius = 80;
                const orbWidth = rect.width;
                wheel.style.left = (rect.left - rotationRadius - (orbWidth / 2)) + 'px';
                wheel.style.top = (rect.top + (rect.height / 2) - (wheelContainer.offsetHeight / 2)) + 'px';
            };
            const showWheel = () => { updatePosition(); wheel.classList.add('visible'); };
            const hideWheel = () => { setTimeout(() => { if (!isHoveringOrb && !isHoveringWheel) wheel.classList.remove('visible'); }, 150); };
            document.addEventListener('mousemove', (e) => {
                const orb = document.getElementById(ORB_ID);
                if (!orb) return;
                const orbRect = orb.getBoundingClientRect();
                const wheelRect = wheel.getBoundingClientRect();
                const orbBuffer = 20;
                const wheelBuffer = 80;
                const inOrb = (e.clientX >= orbRect.left - orbBuffer && e.clientX <= orbRect.right + orbBuffer && e.clientY >= orbRect.top - orbBuffer && e.clientY <= orbRect.bottom + orbBuffer);
                const inWheel = (e.clientX >= wheelRect.left - wheelBuffer && e.clientX <= wheelRect.right + wheelBuffer && e.clientY >= wheelRect.top - wheelBuffer && e.clientY <= wheelRect.bottom + wheelBuffer);
                if (inOrb) { isHoveringOrb = true; showWheel(); } else { isHoveringOrb = false; }
                if (inWheel) { isHoveringWheel = true; } else { isHoveringWheel = false; }
                if (!isHoveringOrb && !isHoveringWheel) hideWheel();
            });
            window.addEventListener('resize', () => { if(wheel.classList.contains('visible')) updatePosition(); });
        }

        return {
            addButton: function(id, icon, text, onClick) {
                const container = ensureContainer();
                const body = container.querySelector('.mod16-wheel-body');
                if (document.getElementById(id)) return;
                const btn = document.createElement('button');
                btn.className = 'mod16-wheel-btn';
                btn.id = id;
                btn.innerHTML = `<div class="mod16-btn-content"><span class="mod16-wheel-icon">${icon}</span><span>${text}</span></div>`;
                btn.addEventListener('click', (e) => { e.stopPropagation(); onClick(e); });
                body.appendChild(btn);
                updateLayout();
            }
        };
    })();

 
    // ==========================================================================
    // 1. CSS 样式注入 (mod20 前缀)
    // ==========================================================================
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --modal-content-bg: none;
            --primary-color: #00faff;
            --secondary-color: #7affff;
            --base-line-height: 1.7;
            --base-font-size: 16px;
            --base-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            --container-bg-color: rgba(10, 25, 47, 0.85); /* 稍微加深背景以提高文字可读性 */
            --border-color: rgba(0, 250, 255, 0.3);
            --glow-color: rgba(0, 250, 255, 0.5);
            --text-color: #e6f1ff;
            --text-secondary-color: #a8c0e1;
            --background-color: rgba(10, 25, 47);
            --danger-color: #ff4d4d;
            --danger-glow-color: rgba(255, 77, 77, 0.5);
            --success-color: #4dff88;
            --success-glow-color: rgba(77, 255, 136, 0.5);
        }

        .mod20-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(5px);
            z-index: 10000; display: flex; justify-content: center; align-items: center;
            opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
            font-family: var(--base-font-family);
            font-size: var(--base-font-size);
            line-height: var(--base-line-height);
        }
        .mod20-modal-overlay.active { opacity: 1; pointer-events: auto; }

        .mod20-dashboard {
            width: 95%; max-width: 1300px; height: 90vh;
            background: var(--container-bg-color);
            border: 1px solid var(--border-color);
            display: flex; flex-direction: column;
            position: relative; overflow: hidden;
            border-radius: 4px;
            box-shadow: none; /* 明确禁止 box-shadow */
        }

        /* 扫描线装饰 */
        .mod20-dashboard::after {
            content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom, transparent 50%, rgba(0, 250, 255, 0.02) 51%);
            background-size: 100% 4px; pointer-events: none; z-index: 1;
        }

        /* 头部 */
        .mod20-header {
            padding: 15px 25px; border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
           
            z-index: 2;
        }
        .mod20-title {
            font-size: 22px; font-weight: bold; color: var(--primary-color);
            text-transform: uppercase; letter-spacing: 2px;
            text-shadow: 0 0 8px var(--glow-color);
            display: flex; align-items: center; gap: 15px;
        }
        .mod20-close-btn {
            background: transparent; border: 1px solid var(--danger-color);
            color: var(--danger-color); padding: 5px 20px; cursor: pointer;
            font-weight: bold; transition: all 0.2s; text-transform: uppercase;
        }
        .mod20-close-btn:hover { background: var(--danger-color); color: #000; text-shadow: none; }

        /* 导航栏 */
        .mod20-nav {
            display: flex; border-bottom: 1px solid var(--border-color);
            background: rgba(0,0,0,0.3); flex-shrink: 0;
            z-index: 2;
        }
        .mod20-nav-item {
            padding: 15px 30px; cursor: pointer; color: var(--text-secondary-color);
            border-right: 1px solid rgba(255,255,255,0.05); transition: all 0.3s;
            font-weight: bold; position: relative; user-select: none;
        }
        .mod20-nav-item:hover { color: var(--text-color); background: rgba(255,255,255,0.05); }
        .mod20-nav-item.active {
            color: var(--primary-color);  
        }
        .mod20-nav-item.active::after {
            content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px;
            background: var(--primary-color); box-shadow: 0 0 8px var(--glow-color);
        }

        /* 内容区域容器 */
        .mod20-content-wrapper {
            flex: 1; overflow: hidden; position: relative;
            background: rgba(0,0,0,0.2);
            z-index: 1;
        }

                /* 视图面板：默认强制隐藏 */
        .mod20-view-panel {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            padding: 25px; overflow-y: auto;
            display: none !important; /* 【关键】强制隐藏，防止被后面的样式覆盖 */

            /* 滚动条美化 */
            scrollbar-width: thin;
            scrollbar-color: var(--border-color) transparent;
        }

        /* 激活状态：强制显示为 Grid */
        .mod20-view-panel.active {
            display: grid !important;
        }

        .mod20-view-panel::-webkit-scrollbar { width: 6px; }
        .mod20-view-panel::-webkit-scrollbar-track { background: transparent; }
        .mod20-view-panel::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; }

        /* 网格布局配置 (移除 display: grid，只定义列宽) */
        .mod20-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px; align-content: start; width: 100%;
        }

        /* 档案视图专用布局 (更宽) */
        .mod20-grid-wide {
            grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
            gap: 20px; align-content: start; width: 100%;
        }


        /* 通用卡片 */
        .mod20-card {
           
            border: 1px solid rgba(255,255,255,0.1);
            display: flex; flex-direction: column;
            transition: all 0.3s; position: relative;
        }
        .mod20-card:hover {
            border-color: var(--primary-color);
            
        }
        /* 装饰角标 */
        .mod20-card::before {
            content: ''; position: absolute; top: -1px; left: -1px; width: 10px; height: 10px;
            border-top: 2px solid var(--primary-color); border-left: 2px solid var(--primary-color);
            opacity: 0; transition: opacity 0.3s;
        }
        .mod20-card::after {
            content: ''; position: absolute; bottom: -1px; right: -1px; width: 10px; height: 10px;
            border-bottom: 2px solid var(--primary-color); border-right: 2px solid var(--primary-color);
            opacity: 0; transition: opacity 0.3s;
        }
        .mod20-card:hover::before, .mod20-card:hover::after { opacity: 1; }

        .mod20-card-header {
            padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.1);
            background: rgba(0,0,0,0.2);
            color: var(--secondary-color); font-weight: bold;
            display: flex; justify-content: space-between; align-items: center;
        }
        .mod20-card-key { font-size: 12px; color: var(--text-secondary-color); opacity: 0.6; font-weight: normal; }

        .mod20-card-body {
            padding: 15px; color: var(--text-color); font-size: 14px;
            max-height: 400px; overflow-y: auto; /* 内部滚动 */
        }
        .mod20-card-body::-webkit-scrollbar { width: 4px; }
        .mod20-card-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }

        /* 键值对行 */
        .mod20-kv { margin-bottom: 12px; }
        .mod20-kv:last-child { margin-bottom: 0; }
        .mod20-k {
            color: var(--text-secondary-color); font-size: 12px;
            margin-bottom: 4px; display: block;
        }
        .mod20-v {
            color: var(--text-color); line-height: 1.6;
            padding-left: 8px; border-left: 2px solid rgba(255,255,255,0.1);
        }

        /* 档案卡片特殊样式 */
        .mod20-log-card .mod20-card-header {
            
            color: var(--primary-color);
            font-size: 18px;
        }
        .mod20-log-card .mod20-card-body {
            font-size: 15px; line-height: 1.8;
            max-height: 600px; /* 档案允许更高 */
        }

        .mod20-empty {
            grid-column: 1 / -1; text-align: center; padding: 50px;
            color: var(--text-secondary-color); font-style: italic;
            border: 1px dashed var(--border-color);
        }

        @media (max-width: 768px) {
            .mod20-grid, .mod20-grid-wide { grid-template-columns: 1fr; }
            .mod20-dashboard { width: 100%; height: 100%; border: none; }
            .mod20-nav-item { padding: 15px 15px; font-size: 14px; }
        }
    `;
    document.head.appendChild(style);

    // ==========================================================================
    // 2. 翻译字典
    // ==========================================================================
    const DICTIONARY = {
        "player_analysis": "玩家心理侧写",
        "attachment_style": "依恋风格",
        "core_motivation": "核心驱动力 (SDT)",
        "jungian_archetype": "荣格原型",
        "deep_psychology": "深度心理侧写",
        "strategy_for_ai": "AI 互动策略",
        "信息记录": "行为观察档案",
        "behavior_log": "行为观察档案",

        "type": "类型",
        "observation": "观察结论",
        "primary": "主导因素",
        "secondary": "次要因素",
        "note": "备注分析",
        "Autonomy": "自主需求",
        "Competence": "胜任需求",
        "Relatedness": "归属需求",
        "openness_level": "开放性",
        "agreeableness_mode": "宜人性",
        "player_goal": "潜在目标",
        "Narrative_Pacing": "叙事节奏",
        "Agency_Balance": "控制权平衡",
        "Interaction_Focus": "互动重心"
    };

    function translate(key) {
        return DICTIONARY[key] || key;
    }

    // ==========================================================================
    // 3. 核心逻辑
    // ==========================================================================

    function getData() {
        try {
            if (typeof assaSettingsData === 'undefined') return {};
            let data = assaSettingsData?.global_lore?.player_analysis;
            if (typeof data === 'string') {
                try { data = JSON.parse(data); } catch(e) {}
            }
            return data || {};
        } catch (e) { return {}; }
    }

  function renderGenericContent(data, isNested = false) {
        // 基本类型或 null，直接返回值
        if (typeof data !== 'object' || data === null) {
            return `<div class="mod20-v">${String(data)}</div>`;
        }

        // 如果是数组，递归渲染每一项
        if (Array.isArray(data)) {
            return data.map(item => renderGenericContent(item, true)).join('');
        }

        // 如果是对象，遍历键值对
        return Object.entries(data).map(([k, v]) => {
            // 如果值是对象（非数组），则创建一个嵌套的键值对结构
            if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
                return `
                    <div class="mod20-kv">
                        <span class="mod20-k">${translate(k)}</span>
                        <div class="mod20-v" style="padding-left: 20px; border-left-color: rgba(255,255,255,0.2);">
                            ${renderGenericContent(v, true)}
                        </div>
                    </div>
                `;
            }

            // 如果值是基本类型或数组，则直接渲染
            return `
                <div class="mod20-kv">
                    <span class="mod20-k">${translate(k)}</span>
                    ${renderGenericContent(v, true)}
                </div>
            `;
        }).join('');
    }

    // 渲染 Tab 1: 综合分析 (排除 "信息记录")
    function renderGeneralTab(data) {
        const keys = Object.keys(data).filter(k => k !== '信息记录' && k !== 'behavior_log');
        if (keys.length === 0) return '<div class="mod20-empty">暂无综合分析数据</div>';

        return keys.map(key => {
            return `
                <div class="mod20-card">
                    <div class="mod20-card-header">
                        ${translate(key)}
                        <span class="mod20-card-key">${key}</span>
                    </div>
                    <div class="mod20-card-body">
                        ${renderGenericContent(data[key])}
                    </div>
                </div>
            `;
        }).join('');
    }

    // 渲染 Tab 2: 行为档案 (专门渲染 "信息记录")
    function renderLogTab(data) {
        // 尝试找到信息记录的 key
        const logKey = Object.keys(data).find(k => k === '信息记录' || k === 'behavior_log');
        const logData = logKey ? data[logKey] : null;

        if (!logData || Object.keys(logData).length === 0) {
            return '<div class="mod20-empty">暂无行为观察记录</div>';
        }

        // 这里的 logData 结构预期是 { "童年阴影": "内容...", "价值观": "内容..." }
        // 我们将每一个 key 都渲染为一个大卡片
        return Object.entries(logData).map(([topic, content]) => {
            return `
                <div class="mod20-card mod20-log-card">
                    <div class="mod20-card-header">
                        ${topic}
                    </div>
                    <div class="mod20-card-body">
                        <div style="white-space: pre-wrap;">${content}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

  function buildDashboard() {
        const data = getData();

        return `
            <div class="mod20-header">
                <div class="mod20-title">
                    🧠 玩家心理侧写
                    <span style="font-size:12px; color:var(--text-secondary-color); font-weight:normal; margin-top:5px;">PSYCHO-ANALYSIS MATRIX</span>
                </div>
                <button class="mod20-close-btn" id="mod20-btn-close">关闭系统</button>
            </div>

            <div class="mod20-nav">
                <!-- 确保 ID 与 JS 监听器一致 -->
                <div class="mod20-nav-item active" id="mod20-tab-general">综合分析报告</div>
                <div class="mod20-nav-item" id="mod20-tab-logs">行为观察档案</div>
            </div>

            <div class="mod20-content-wrapper">
                <!-- 综合分析视图：默认 active -->
                <div id="mod20-view-general" class="mod20-view-panel active mod20-grid">
                    ${renderGeneralTab(data)}
                </div>

                <!-- 行为档案视图：默认隐藏 (无 active 类) -->
                <div id="mod20-view-logs" class="mod20-view-panel mod20-grid-wide">
                    ${renderLogTab(data)}
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // 4. 交互控制器
    // ==========================================================================
    window.Mod20Dashboard = {
        open: function() {
            let modal = document.getElementById('mod20-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'mod20-modal';
                modal.className = 'mod20-modal-overlay';
                modal.innerHTML = `<div class="mod20-dashboard" id="mod20-dashboard-body"></div>`;
                document.body.appendChild(modal);

                // 点击遮罩关闭
                modal.addEventListener('click', (e) => {
                    if(e.target === modal) this.close();
                });
            }

            // 1. 注入 HTML
            const body = document.getElementById('mod20-dashboard-body');
            body.innerHTML = buildDashboard();

            // 2. 绑定事件 (修复点击无效的问题)
            const tabGeneral = document.getElementById('mod20-tab-general');
            const tabLogs = document.getElementById('mod20-tab-logs');
            const btnClose = document.getElementById('mod20-btn-close');

            if (tabGeneral) tabGeneral.addEventListener('click', () => this.switchTab('general', tabGeneral));
            if (tabLogs) tabLogs.addEventListener('click', () => this.switchTab('logs', tabLogs));
            if (btnClose) btnClose.addEventListener('click', () => this.close());

            // 3. 显示
            modal.style.display = 'flex';
            requestAnimationFrame(() => modal.classList.add('active'));
        },

        close: function() {
            const modal = document.getElementById('mod20-modal');
            if (modal) {
                modal.classList.remove('active');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        },

        switchTab: function(tabName, btn) {
            // 切换按钮状态
            document.querySelectorAll('.mod20-nav-item').forEach(el => el.classList.remove('active'));
            if(btn) btn.classList.add('active');

            // 切换面板
            document.querySelectorAll('.mod20-view-panel').forEach(el => el.classList.remove('active'));
            const target = document.getElementById(`mod20-view-${tabName}`);
            if(target) target.classList.add('active');
        }
    };

    // ==========================================================================
    // 5. 初始化 (集成到 Mod16 轮盘)
    // ==========================================================================
    function init() {
        if (window.Mod16WheelManager) {
            window.Mod16WheelManager.addButton(
                'mod20-psycho-btn',
                '🧠',
                '心理侧写',
                () => window.Mod20Dashboard.open()
            );
        } else {
            setTimeout(init, 200);
        }
    }

    init();

})();
