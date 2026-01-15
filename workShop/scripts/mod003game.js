(function () {
 // --- Mod16 轮盘通用管理器 (增强版 - 请复制到所有脚本头部) ---
window.Mod16WheelManager = window.Mod16WheelManager || (function() {
    const CONTAINER_ID = 'mod16-wheel-container';
    const ORB_ID = 'world-book-orb';

    // 1. 注入增强版 CSS
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
                position: fixed;
                /* 保持容器尺寸，但逻辑判定范围会比这个大 */
                width: 150px; height: 150px;
                z-index: 999; pointer-events: none;
                opacity: 0; transition: opacity 0.3s, transform 0.3s;
                transform: translateX(30px);
            }
            #mod16-wheel-container.visible {
                opacity: 1; transform: translateX(0); pointer-events: auto;
            }
            .mod16-wheel-body {
                width: 100%; height: 100%; position: relative;
                display: flex; align-items: center; justify-content: center;
            }
            /* 增加一个隐形的背景圆，填补按钮之间的空隙，防止鼠标在缝隙中时轮盘消失 */
            .mod16-wheel-body::before {
                content: ''; position: absolute;
                width: 260px; height: 260px; /* 比按钮展开范围稍大 */
                border-radius: 50%;
                background: transparent;
                z-index: -1;
            }
            .mod16-wheel-btn {
                background: var(--mod16-bg);
                border: 1px solid var(--mod16-primary);
                color: var(--mod16-primary);
                font-family: var(--mod16-font);
                font-size: 12px; font-weight: bold;
                cursor: pointer;
                position: absolute;
                width: 70px; height: 70px;
                border-radius: 50%;
                display: flex; flex-direction: column;
                align-items: center; justify-content: center;
                transition: all 0.2s;
                transform-origin: 110px 50%;
                left: -35px;
                transform: rotate(var(--mod16-angle, 0deg)) scale(1);
            }
            .mod16-wheel-btn:hover {
                color: #fff; background: var(--mod16-primary);
                box-shadow: 0 0 15px var(--mod16-primary);
                z-index: 10;
                transform: rotate(var(--mod16-angle, 0deg)) scale(1.15);
            }
            .mod16-wheel-icon { font-size: 20px; margin-bottom: 2px; display:block; }
            .mod16-btn-content { pointer-events: none; transition: transform 0.2s; }
        `;
        document.head.appendChild(style);
    }

    // 2. 重新计算布局
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
            if (content) {
                content.style.transform = `rotate(${-angle}deg)`;
            }
        });
    }

    // 3. 确保容器存在
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

    // 4. 触发逻辑 (核心修改部分)
    function setupTriggers(wheel) {
        let isHoveringOrb = false;
        let isHoveringWheel = false;

        const updatePosition = () => {
            const orb = document.getElementById(ORB_ID);
            if (!orb) return;
            const rect = orb.getBoundingClientRect();
            const wheelContainer = document.getElementById(CONTAINER_ID);

            // 调整位置，确保轮盘中心与 Orb 距离适中
            const rotationRadius = 80;
            const orbWidth = rect.width;

            wheel.style.left = (rect.left - rotationRadius - (orbWidth / 2)) + 'px';
            wheel.style.top = (rect.top + (rect.height / 2) - (wheelContainer.offsetHeight / 2)) + 'px';
        };

        const showWheel = () => {
            updatePosition();
            wheel.classList.add('visible');
        };

        const hideWheel = () => {
            setTimeout(() => {
                if (!isHoveringOrb && !isHoveringWheel) wheel.classList.remove('visible');
            }, 150); // 稍微增加一点消失延迟，容错率更高
        };

        document.addEventListener('mousemove', (e) => {
            const orb = document.getElementById(ORB_ID);
            if (!orb) return;

            const orbRect = orb.getBoundingClientRect();
            const wheelRect = wheel.getBoundingClientRect();

            // Orb 的缓冲范围
            const orbBuffer = 20;

            // 【核心修改】：大幅增加轮盘的判定范围 (Buffer)
            // 之前是 0，现在设为 80px，这意味着鼠标只要在轮盘容器外 80px 以内，都不会消失
            // 这能覆盖按钮伸出去的部分以及按钮圆心外侧
            const wheelBuffer = 80;

            const inOrb = (e.clientX >= orbRect.left - orbBuffer && e.clientX <= orbRect.right + orbBuffer &&
                           e.clientY >= orbRect.top - orbBuffer && e.clientY <= orbRect.bottom + orbBuffer);

            // 使用 wheelBuffer 扩大判定矩形
            const inWheel = (e.clientX >= wheelRect.left - wheelBuffer &&
                             e.clientX <= wheelRect.right + wheelBuffer &&
                             e.clientY >= wheelRect.top - wheelBuffer &&
                             e.clientY <= wheelRect.bottom + wheelBuffer);

            if (inOrb) { isHoveringOrb = true; showWheel(); } else { isHoveringOrb = false; }
            if (inWheel) { isHoveringWheel = true; } else { isHoveringWheel = false; }

            if (!isHoveringOrb && !isHoveringWheel) hideWheel();
        });

        window.addEventListener('resize', () => {
            if(wheel.classList.contains('visible')) updatePosition();
        });
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
    // 1. CSS 样式注入 (使用 mod003 前缀)
    // ==========================================================================
    const style = document.createElement('style');
    style.textContent = `
        /* 引入宿主环境变量 */
        .mod003-dashboard-container {
            font-family: var(--base-font-family);
            color: var(--text-color);
            line-height: 1.4;
            box-sizing: border-box;
        }

        .mod003-dashboard-container * {
            box-sizing: border-box;
        }

        /* 模态框遮罩 */
        .mod003-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .mod003-modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        /* 主面板 */
        .mod003-dashboard {
            width: 90%;
            max-width: 1200px;
            height: 85vh;
            background: var(--container-bg-color);
            border: 1px solid var(--border-color);
            
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }

        /* 装饰性扫描线 */
        .mod003-dashboard::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, transparent 50%, rgba(0, 250, 255, 0.02) 51%);
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 1;
        }

        /* 头部 */
        .mod003-header {
            padding: 15px 25px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(0, 250, 255, 0.05);
        }

        .mod003-title {
            font-size: 24px;
            font-weight: bold;
            color: var(--primary-color);
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 10px var(--glow-color);
        }

        .mod003-close-btn {
            background: transparent;
            border: 1px solid var(--danger-color);
            color: var(--danger-color);
            padding: 5px 15px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
        }

        .mod003-close-btn:hover {
            background: var(--danger-color);
            color: #000;
            box-shadow: 0 0 10px var(--danger-glow-color);
        }

        /* 内容滚动区 */
        .mod003-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 20px;
        }

        /* 滚动条样式 */
        .mod003-content::-webkit-scrollbar {
            width: 8px;
        }
        .mod003-content::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.3);
        }
        .mod003-content::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 4px;
        }

        /* 左侧栏：概览 */
        .mod003-sidebar {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        /* 右侧栏：详情 */
        .mod003-main-view {
            display: flex;
            flex-direction: column;
            gap: 20px;
             min-width: 0; /* <--- 【新增】关键：防止 Grid 布局被内部的长 Tab 撑开 */
        }

        /* 通用卡片 */
        .mod003-card {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(168, 192, 225, 0.1);
            padding: 15px;
            position: relative;
        }

        .mod003-card::before {
            content: "";
            position: absolute;
            top: -1px;
            left: -1px;
            width: 10px;
            height: 10px;
            border-top: 2px solid var(--primary-color);
            border-left: 2px solid var(--primary-color);
        }
        .mod003-card::after {
            content: "";
            position: absolute;
            bottom: -1px;
            right: -1px;
            width: 10px;
            height: 10px;
            border-bottom: 2px solid var(--primary-color);
            border-right: 2px solid var(--primary-color);
        }

        .mod003-section-title {
            font-size: 16px;
            color: var(--secondary-color);
            margin-bottom: 15px;
            border-bottom: 1px dashed rgba(168, 192, 225, 0.2);
            padding-bottom: 5px;
            display: flex;
            align-items: center;
        }

        .mod003-section-title::before {
            content: "";
            display: inline-block;
            width: 6px;
            height: 6px;
            background: var(--primary-color);
            margin-right: 8px;
           
        }

        /* 数据行 */
        .mod003-data-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .mod003-label {
            color: var(--text-secondary-color);
        }

        .mod003-value {
            color: var(--text-color);
            font-family: monospace;
            font-size: 1.1em;
        }

        /* 进度条容器 */
        .mod003-progress-bg {
            width: 100%;
            height: 6px;
            background: rgba(255,255,255,0.1);
            margin-top: 4px;
            position: relative;
        }

        .mod003-progress-fill {
            height: 100%;
            background: var(--primary-color);
       
            transition: width 0.5s ease;
        }

        /* 双向进度条 (用于 -100 到 100) */
        .mod003-bi-progress-container {
            display: flex;
            align-items: center;
            width: 100%;
            height: 20px;
            position: relative;
            margin-top: 5px;
            background: rgba(0,0,0,0.2);
        }

        .mod003-bi-midline {
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 1px;
            background: var(--text-secondary-color);
            z-index: 2;
        }

        .mod003-bi-bar {
            height: 6px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            transition: width 0.5s ease;
        }

        .mod003-bi-bar.positive {
            left: 50%;
            background: var(--success-color);
            box-shadow: 0 0 5px var(--success-glow-color);
        }

        .mod003-bi-bar.negative {
            right: 50%;
            background: var(--danger-color);
            box-shadow: 0 0 5px var(--danger-glow-color);
        }

        /* 游戏列表 */
        .mod003-game-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
        }

        .mod003-game-card {
            border: 1px solid var(--border-color);
            background: rgba(0, 250, 255, 0.02);
            padding: 15px;
            transition: transform 0.2s;
        }

        .mod003-game-card:hover {
            background: rgba(0, 250, 255, 0.05);
            transform: translateY(-2px);
        }

        .mod003-game-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 5px;
        }

        .mod003-game-title {
            color: var(--primary-color);
            font-weight: bold;
        }

        .mod003-game-status {
            font-size: 12px;
            padding: 2px 6px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
        }

        .mod003-tag {
            display: inline-block;
            font-size: 12px;
            color: #000;
            background: var(--secondary-color);
            padding: 1px 4px;
            margin-right: 4px;
            font-weight: bold;
        }

        .mod003-sub-group {
            margin-left: 10px;
            padding-left: 10px;
            border-left: 1px solid rgba(255,255,255,0.1);
            margin-bottom: 10px;
        }

        .mod003-empty-msg {
            text-align: center;
            color: var(--text-secondary-color);
            padding: 20px;
            font-style: italic;
        }

        
        /* 允许卡片高度根据内容自动撑开，但限制最大高度以免撑破布局 */
        .mod003-game-card {
            border: 1px solid var(--border-color);
            background: rgba(0, 250, 255, 0.02);
            padding: 15px;
            transition: transform 0.2s;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: 500px; /* 限制卡片最大高度 */
            overflow: hidden;  /* 内部滚动 */
        }

        /* 通用滚动文本框 */
        .mod003-scroll-box {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            color: var(--text-secondary-color);

            /* 关键：处理换行符和自动换行 */
            white-space: pre-wrap;
            word-break: break-all;

            /* 关键：启用垂直滚动 */
            max-height: 120px;
            overflow-y: auto;
        }

        /* 针对滚动框的滚动条美化 */
        .mod003-scroll-box::-webkit-scrollbar {
            width: 4px;
        }
        .mod003-scroll-box::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
        }
        .mod003-scroll-box::-webkit-scrollbar-thumb {
            background: var(--secondary-color);
            border-radius: 2px;
        }

        .mod003-field-title {
            font-size: 11px;
            color: var(--primary-color);
            margin-bottom: 4px;
            opacity: 0.8;
            font-weight: bold;
        }
                    /* --- 新增：游戏详情页专用样式 --- */

        /* 顶部选项卡容器 */
        .mod003-game-tabs {
            display: flex;
            overflow-x: auto;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            margin-bottom: 20px;
            padding-bottom: 0;
             max-width: 100%;     /* <--- 【新增】确保不超过父容器宽度 */
            touch-action: pan-x; /* <--- 【新增】告诉浏览器这里只处理横向滑动，不触发页面级滑动 */
        }

        .mod003-game-tabs::-webkit-scrollbar { height: 4px; }

        /* 单个选项卡 */
        .mod003-game-tab {
            padding: 10px 20px;
            cursor: pointer;
            color: var(--text-secondary-color);
            border-bottom: 2px solid transparent;
            transition: all 0.3s;
            white-space: nowrap;
            font-weight: bold;
            opacity: 0.6;
            flex-shrink: 0; /* <--- 【新增】禁止标签被压缩，确保触发横向滚动条 */
        }

        .mod003-game-tab:hover {
            background: rgba(255,255,255,0.05);
            color: var(--text-color);
            opacity: 1;
        }

        .mod003-game-tab.active {
            color: var(--primary-color);
            border-bottom: 2px solid var(--primary-color);
            background: linear-gradient(to top, rgba(0, 250, 255, 0.1), transparent);
            opacity: 1;
        }

        /* 游戏详情容器（默认隐藏，激活显示） */
        .mod003-game-detail-panel {
            display: none;
            animation: mod003-fade-in 0.3s ease;
        }
        .mod003-game-detail-panel.active {
            display: block;
        }

        @keyframes mod003-fade-in {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* 游戏类型标签 */
        .mod003-game-tags {
            display: flex;
            gap: 8px;
            margin: 10px 0;
            flex-wrap: wrap;
        }
        .mod003-game-tag {
            font-size: 12px;
            padding: 2px 8px;
            border: 1px solid var(--secondary-color);
            color: var(--secondary-color);
            border-radius: 2px;
            background: rgba(0,0,0,0.3);
        }

        /* 市场数据网格 */
        .mod003-kv-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            background: rgba(0,0,0,0.2);
            padding: 15px;
            border: 1px solid rgba(255,255,255,0.05);
            margin-bottom: 20px;
        }
        .mod003-kv-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px dashed rgba(255,255,255,0.1);
            padding-bottom: 5px;
        }

        /* 社区热议样式 */
        .mod003-chat-group {
            margin-bottom: 15px;
            border-left: 2px solid var(--secondary-color);
            padding-left: 15px;
            background: linear-gradient(to right, rgba(255,255,255,0.02), transparent);
        }
        .mod003-chat-title {
            font-weight: bold;
            color: var(--text-color);
            margin-bottom: 5px;
            font-size: 14px;
        }
        .mod003-chat-list {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .mod003-chat-item {
            font-size: 12px;
            color: var(--text-secondary-color);
            background: rgba(0,0,0,0.3);
            padding: 5px 8px;
            border-radius: 4px;
        }
        .mod003-chat-id {
            color: var(--primary-color);
            margin-right: 5px;
            font-weight: bold;
        }
        /* --- 新增：折叠面板样式 --- */
        .mod003-collapse-header {
            cursor: pointer;
            position: relative;
            transition: background 0.2s;
            padding-right: 30px; /* 给箭头留位置 */
            user-select: none;   /* 防止双击选中文字 */
        }

        .mod003-collapse-header:hover {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
        }

        /* 折叠状态的箭头 (默认向右 ▶) */
        .mod003-collapse-header::after {
            content: '▶';
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            color: var(--secondary-color);
            transition: transform 0.3s ease;
        }

        /* 展开状态的箭头 (向下 ▼) */
        .mod003-collapse-header.active::after {
            transform: translateY(-50%) rotate(90deg);
        }

        /* 内容区域 (默认隐藏) */
        .mod003-collapse-content {
            display: none;
            overflow: hidden;
        }

        /* 内容区域激活状态 */
        .mod003-collapse-content.active {
            display: block;
            animation: mod003-slide-down 0.3s ease;
        }

        @keyframes mod003-slide-down {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        /* --- 新增：嵌套对象与置顶信息样式 --- */

        /* 置顶核心数据栏 */
        .mod003-top-info {
            background: rgba(0, 250, 255, 0.05);
            border: 1px solid rgba(0, 250, 255, 0.2);
            border-radius: 4px;
            padding: 12px;
            margin-bottom: 15px;
        }

        .mod003-summary-text {
            font-size: 13px;
            color: var(--text-color);
            line-height: 1.5;
            margin-bottom: 10px;
            font-style: italic;
        }

        .mod003-quick-stats {
            display: flex;
            gap: 20px;
            border-top: 1px dashed rgba(255,255,255,0.1);
            padding-top: 8px;
        }

        /* 嵌套对象容器 */
        .mod003-nested-group {
            margin-left: 12px;
            padding-left: 12px;
            border-left: 2px solid rgba(255, 255, 255, 0.05);
            margin-bottom: 10px;
            margin-top: 5px;
        }

        .mod003-nested-title {
            font-size: 12px;
            color: var(--secondary-color);
            font-weight: bold;
            margin-bottom: 5px;
            opacity: 0.9;
        }

    `;
    document.head.appendChild(style);

    // ==========================================================================
    // 2. 核心逻辑与 UI 构建
    // ==========================================================================

    // 安全获取数据的辅助函数
    function getCoreData() {
        try {
            if (typeof assaSettingsData === 'undefined') return null;

            // 假设 assaSettingsData 可能直接包含 global_lore，或者它本身就是个大对象
            // 根据提示，我们需要获取 global_lore.core
            // 这里做一个深度查找的尝试
            let coreData = null;

            if (assaSettingsData.global_lore && assaSettingsData.global_lore.core) {
                coreData = assaSettingsData.global_lore.core;
            } else if (assaSettingsData['global_lore.core']) {
                coreData = assaSettingsData['global_lore.core'];
            } else {
                // 如果 assaSettingsData 本身就是那个结构
                coreData = assaSettingsData;
            }

            // 如果 coreData 是字符串（因为 memory.load 有时存的是字符串），尝试解析
            if (typeof coreData === 'string') {
                try {
                    return JSON.parse(coreData);
                } catch (e) {
                    console.error('Mod003: JSON parse failed', e);
                    return null;
                }
            }

            return coreData;
        } catch (e) {
            console.error('Mod003: Error accessing data', e);
            return null;
        }
    }

    // 渲染双向进度条 (-100 到 100)
    function createBiDirectionalBar(value) {
        const val = parseFloat(value) || 0;
        const width = Math.min(Math.abs(val) / 2, 50); // 最大50%宽度
        const isPositive = val >= 0;

        return `
            <div class="mod003-bi-progress-container">
                <div class="mod003-bi-midline"></div>
                <div class="mod003-bi-bar ${isPositive ? 'positive' : 'negative'}"
                     style="width: ${width}%;"></div>
            </div>
            <div style="text-align: center; font-size: 12px; margin-top: 2px; color: ${isPositive ? 'var(--success-color)' : 'var(--danger-color)'}">
                ${val > 0 ? '+' : ''}${val}
            </div>
        `;
    }

    // 渲染普通进度条 (0 到 100)
    function createProgressBar(value, max = 100) {
        const val = parseFloat(value) || 0;
        const percent = Math.min((val / max) * 100, 100);
        return `
            <div class="mod003-data-row">
                <span class="mod003-value" style="font-size: 12px;">${val} / ${max}</span>
            </div>
            <div class="mod003-progress-bg">
                <div class="mod003-progress-fill" style="width: ${percent}%"></div>
            </div>
        `;
    }

    // 构建 HTML 内容
    function buildDashboardContent() {
        const data = getCoreData();
        if (!data) return `<div class="mod003-empty-msg">系统离线：无法读取 assaSettingsData 或 global_lore.core 数据流。</div>`;

        let html = '';

        // --- 左侧栏 ---
        let sidebarHtml = '';

        // 1. 当前项目
        sidebarHtml += `
            <div class="mod003-card">
                <div class="mod003-section-title">当前开发序列</div>
                <div style="font-size: 18px; color: var(--primary-color); text-align: center; padding: 10px 0; border: 1px solid var(--border-color); background: rgba(0,0,0,0.2);">
                    ${data['当前项目'] || data['当前项目名称'] || '无挂起项目'}
                </div>
            </div>
        `;

        // 2. 声望系统
        if (data['声望']) {
            sidebarHtml += `<div class="mod003-card"><div class="mod003-section-title">声望矩阵</div>`;

            ['国内', '海外'].forEach(region => {
                if (data['声望'][region]) {
                    sidebarHtml += `<div style="margin-top:10px; color:var(--secondary-color); font-size:12px;">[ ${region} ]</div>`;
                    const rData = data['声望'][region];
                    for (let key in rData) {
                        sidebarHtml += `
                            <div style="margin-top: 5px;">
                                <div class="mod003-data-row" style="margin-bottom:0;">
                                    <span class="mod003-label">${key}</span>
                                </div>
                                ${createProgressBar(rData[key], 100)}
                            </div>
                        `;
                    }
                }
            });
            sidebarHtml += `</div>`;
        }

        // 3. 平台关系
        if (data['平台关系']) {
            sidebarHtml += `<div class="mod003-card"><div class="mod003-section-title">平台链接度</div>`;
            for (let platform in data['平台关系']) {
                sidebarHtml += `
                    <div style="margin-top: 8px;">
                        <div class="mod003-data-row" style="margin-bottom:0;">
                            <span class="mod003-label">${platform}</span>
                        </div>
                        ${createProgressBar(data['平台关系'][platform], 100)}
                    </div>
                `;
            }
            sidebarHtml += `</div>`;
        }

        // --- 右侧栏 ---
        let mainHtml = '';

        // 4. 业界影响 (复杂展示)
        if (data['业界'] || data['业界影响']) {
            const industryData = data['业界'] || data['业界影响'];
            mainHtml += `<div class="mod003-card"><div class="mod003-section-title">业界认知模型</div>`;

            // 遍历 国内/海外
            mainHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">`;

            for (let region in industryData) {
                mainHtml += `<div><h4 style="color:var(--primary-color); border-bottom:1px solid var(--border-color); margin-bottom:10px;">${region}</h4>`;
                const rData = industryData[region];

                // 遍历 驱动类型 (数值驱动/体验驱动/商业模式)
                for (let type in rData) {
                    mainHtml += `<div class="mod003-sub-group"><div style="color:var(--text-secondary-color); font-size:13px; margin-bottom:5px;">:: ${type}</div>`;
                    const tData = rData[type];

                    // 遍历具体指标 (市场认知/模仿意愿/或商业模式下的子项)
                    for (let metric in tData) {
                        // 处理嵌套的商业模式 (买断制/免费内购)
                        if (typeof tData[metric] === 'object') {
                            mainHtml += `<div style="margin-left:10px; margin-bottom:5px; font-size:12px; color:var(--text-secondary-color);">${metric}</div>`;
                            for (let subMetric in tData[metric]) {
                                mainHtml += `
                                    <div style="display:flex; align-items:center; justify-content:space-between; font-size:12px; padding-left:15px;">
                                        <span>${subMetric}</span>
                                        <div style="width: 100px;">${createBiDirectionalBar(tData[metric][subMetric])}</div>
                                    </div>
                                `;
                            }
                        } else {
                            // 普通指标
                            mainHtml += `
                                <div style="display:flex; align-items:center; justify-content:space-between; font-size:12px;">
                                    <span>${metric}</span>
                                    <div style="width: 100px;">
                                        ${metric.includes('认知') ? createBiDirectionalBar(tData[metric]) : createProgressBar(tData[metric], 100)}
                                    </div>
                                </div>
                            `;
                        }
                    }
                    mainHtml += `</div>`;
                }
                mainHtml += `</div>`;
            }
            mainHtml += `</div></div>`;
        }

   // 5. 游戏作品库
         // 5. 游戏作品库 (Tab 切换版)
        if (data['游戏作品']) {
            mainHtml += `<div class="mod003-card" style="margin-top: 20px; min-height: 500px;">
                <div class="mod003-section-title">产品数据库</div>`;

            const gameNames = Object.keys(data['游戏作品']);

            if (gameNames.length === 0) {
                mainHtml += `<div class="mod003-empty-msg">暂无游戏数据</div></div>`;
            } else {
                // 1. 生成顶部 Tabs
                mainHtml += `<div class="mod003-game-tabs">`;
                gameNames.forEach((name, index) => {
                     if (name.startsWith('_')) return;
                    const activeClass = index === 0 ? 'active' : '';
                    // 添加 data-target 属性用于 JS 切换
                    mainHtml += `<div class="mod003-game-tab ${activeClass}" data-target="game-panel-${index}">${name}</div>`;
                });
                mainHtml += `</div>`;

                // 2. 生成内容面板
                         gameNames.forEach((name, index) => {
                    const game = data['游戏作品'][name];
                    const activeClass = index === 0 ? 'active' : '';
                    const design = game['设计文档'] || {};
                    const market = game['市场数据'] || {};

                    // 1. 提取置顶数据 (摘要、玩家数、在线数)
                    const coreSummary = design['核心设定摘要'] || '暂无核心设定摘要';
                    const totalPlayers = market['玩家数量'] || 0;
                    const onlinePlayers = market['实时在线人数'] || 0;

                    // 2. 处理类型标签
                    let tagsHtml = '';
                    if (game['类型']) {
                        tagsHtml = `<div class="mod003-game-tags">` +
                            game['类型'].split(/;|；/).map(t => t.trim()).filter(t=>t).map(t => `<span class="mod003-game-tag">${t}</span>`).join('') +
                            `</div>`;
                    }

                    // 3. 递归处理设计文档 (支持嵌套对象，并跳过已置顶的摘要)
              function renderDesignRecursive(obj) {
                        let html = '';
                        for (let key in obj) {
                            if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

                            // --- 新增：过滤掉以 _ 开头的字段 ---
                            if (key.startsWith('_')) continue;
                            // --------------------------------

                            if (key === '核心设定摘要') continue; // 跳过已置顶的字段

                            const val = obj[key];

                            if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                                // 如果是嵌套对象，递归渲染
                                html += `
                                    <div class="mod003-nested-group">
                                        <div class="mod003-nested-title">:: ${key}</div>
                                        ${renderDesignRecursive(val)}
                                    </div>
                                `;
                            } else {
                                // 如果是普通值 (字符串/数字等)
                                let content = String(val).replace(/\\n/g, '\n');
                                if (content.trim() !== "") {
                                    html += `
                                        <div style="margin-bottom: 8px;">
                                            <div class="mod003-field-title">:: ${key}</div>
                                            <div class="mod003-scroll-box">${content}</div>
                                        </div>`;
                                }
                            }
                        }
                        return html;
                    }

                    const designContentHtml = renderDesignRecursive(design);

                    // 构建设计文档折叠面板
                    const designSectionHtml = `
                        <div style="margin-top:15px;">
                            <div class="mod003-section-title mod003-collapse-header">
                                设计文档详情
                                <span style="font-size:12px; font-weight:normal; opacity:0.5; margin-left:10px;">(点击展开)</span>
                            </div>
                            <div class="mod003-collapse-content">
                                <div style="padding-top:10px;">${designContentHtml || '<div class="mod003-empty-msg" style="padding:10px;">无额外详细文档</div>'}</div>
                            </div>
                        </div>
                    `;

                    // 4. 处理市场数据 (全量展示)
                    let marketHtml = `<div class="mod003-kv-grid">`;
                    const marketFields = [
                        {k: '商业模式', l: '商业模式'},
                        {k: '定价', l: '定价', pre: '$'},
                        {k: '平台抽成', l: '平台抽成', suf: '%'},
                        {k: '已发布海外版', l: '海外版', fmt: v => v ? 'YES' : 'NO'},
                        {k: '销量', l: '销量'},
                        {k: '总收入', l: '总收入', pre: '$', color: 'var(--primary-color)'},
                        // 注意：玩家数量和在线人数已置顶，但这里保留一份作为详细数据也无妨，或者你可以注释掉
                        {k: '内购收入', l: '内购收入', pre: '$'},
                        {k: 'ARPU', l: 'ARPU', pre: '$'},
                        {k: '其他收入', l: '其他收入', pre: '$'}
                    ];

                    marketFields.forEach(field => {
                        let val = market[field.k];
                        if (val !== undefined && val !== null) {
                            if (field.fmt) val = field.fmt(val);
                            else val = (field.pre || '') + val + (field.suf || '');
                            const colorStyle = field.color ? `style="color:${field.color}"` : '';
                            marketHtml += `
                                <div class="mod003-kv-item">
                                    <span class="mod003-label">${field.l}</span>
                                    <span class="mod003-value" ${colorStyle}>${val}</span>
                                </div>`;
                        }
                    });
                    marketHtml += `</div>`;

                    // 构建市场数据折叠面板 (默认折叠)
                    const marketSectionHtml = `
                        <div style="margin-top:10px;">
                            <div class="mod003-section-title mod003-collapse-header">
                                市场表现数据
                                <span style="font-size:12px; font-weight:normal; opacity:0.5; margin-left:10px;">(点击展开)</span>
                            </div>
                            <div class="mod003-collapse-content">
                                ${marketHtml}
                            </div>
                        </div>
                    `;

                    // 5. 处理社区热议
                    let communityHtml = '';
                    const topics = market['社区热议'] || {};
                    if (Object.keys(topics).length > 0) {
                        communityHtml += `<div style="margin-top:15px;"><div class="mod003-field-title">:: 社区舆情监控</div>`;
                        for (let topicTitle in topics) {
                               if (topicTitle.startsWith('_')) continue;
                            const comments = topics[topicTitle] || [];
                            const commentsList = Array.isArray(comments) ? comments.map(c => {
                                const splitIdx = c.indexOf(':');
                                let uId = 'User'; let uMsg = c;
                                if(splitIdx > -1) { uId = c.substring(0, splitIdx); uMsg = c.substring(splitIdx + 1); }
                                return `<div class="mod003-chat-item"><span class="mod003-chat-id">[${uId}]</span>${uMsg}</div>`;
                            }).join('') : '';
                            communityHtml += `<div class="mod003-chat-group"><div class="mod003-chat-title"># ${topicTitle}</div><div class="mod003-chat-list">${commentsList}</div></div>`;
                        }
                        communityHtml += `</div>`;
                    }

                    // 6. 组装最终面板
                    mainHtml += `
                        <div id="game-panel-${index}" class="mod003-game-detail-panel ${activeClass}">
                            <div class="mod003-game-header" style="border:none; margin-bottom:5px;">
                                <span class="mod003-game-title" style="font-size:22px;">${name}</span>
                                <span class="mod003-game-status">${game['状态']}</span>
                            </div>
                            ${tagsHtml}


                            <div class="mod003-top-info">
                                <div class="mod003-summary-text">“${coreSummary}”</div>
                                <div class="mod003-quick-stats">
                                    <div class="mod003-data-row" style="gap:10px; margin:0;">
                                        <span class="mod003-label">玩家总数</span>
                                        <span class="mod003-value">${totalPlayers}</span>
                                    </div>
                                    <div class="mod003-data-row" style="gap:10px; margin:0;">
                                        <span class="mod003-label">实时在线</span>
                                        <span class="mod003-value" style="color:var(--success-color)">● ${onlinePlayers}</span>
                                    </div>
                                </div>
                            </div>

                            ${designSectionHtml}
                            ${marketSectionHtml}
                            ${communityHtml}
                        </div>
                    `;
                });


                mainHtml += `</div>`; // Close card
            }
        }


        // 组装
        html = `
            <div class="mod003-sidebar">${sidebarHtml}</div>
            <div class="mod003-main-view">${mainHtml}</div>
        `;

        return html;
    }

    // 显示模态框
    function showModal() {
        // 检查是否已存在
        let modal = document.getElementById('mod003-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'mod003-modal';
            modal.className = 'mod003-modal-overlay mod003-dashboard-container';
            modal.innerHTML = `
                <div class="mod003-dashboard">
                    <div class="mod003-header">
                        <div class="mod003-title">数据监测<span style="font-size:12px; opacity:0.5;">v3.0</span></div>
                        <button class="mod003-close-btn" id="mod003-close-btn">关闭系统</button>
                    </div>
                    <div class="mod003-content" id="mod003-content-area">

                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // 绑定关闭事件
            document.getElementById('mod003-close-btn').onclick = closeModal;
            modal.onclick = (e) => {
                if (e.target === modal) closeModal();
            };
        }

        // 刷新数据
        const contentArea = document.getElementById('mod003-content-area');
        contentArea.innerHTML = buildDashboardContent();
  const tabs = contentArea.querySelectorAll('.mod003-game-tab');
        const panels = contentArea.querySelectorAll('.mod003-game-detail-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 1. 移除所有激活状态
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));

                // 2. 激活当前点击的 Tab
                tab.classList.add('active');

                // 3. 显示对应的面板
                const targetId = tab.getAttribute('data-target');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });

               const collapseHeaders = contentArea.querySelectorAll('.mod003-collapse-header');

        collapseHeaders.forEach(header => {
            header.addEventListener('click', () => {
                // 1. 切换标题的激活状态 (旋转箭头)
                header.classList.toggle('active');

                // 2. 找到紧跟在标题后的内容容器
                const content = header.nextElementSibling;
                if (content && content.classList.contains('mod003-collapse-content')) {
                    // 3. 切换内容的显示/隐藏
                    content.classList.toggle('active');
                }
            });
        });
        // 激活显示
        // 强制重绘以触发 transition
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    }

    // 关闭模态框
    function closeModal() {
        const modal = document.getElementById('mod003-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    // ==========================================================================
    // 3. 注册按钮 (Mod16WheelManager)
    // ==========================================================================
    function initExtraMod() {
        if (window.Mod16WheelManager) {
            window.Mod16WheelManager.addButton(
                'mod003-data-btn',  // 唯一 ID
                '₩',               // 图标 (这里用通用图表符，内部UI不使用emoji)
                '核心数据',          // 按钮文字
                () => {
                    showModal();
                    console.log('Mod003: Dashboard opened');
                }
            );
        } else {
            // 如果 Manager 还没加载，重试
            setTimeout(initExtraMod, 100);
        }
    }

    // 启动
    initExtraMod();

})();
