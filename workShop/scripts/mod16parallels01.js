(function() {

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


    // 1. 防止重复初始化
    // 1. 防止重复初始化 (修正版)
    // 不要检查 container 是否存在，因为其他脚本可能已经创建了它
    if (window.Mod16WorldInfoLoaded) return;
    window.Mod16WorldInfoLoaded = true;

    // 2. 样式定义 (CSS)
    const style = document.createElement('style');
    style.textContent = `
        /* --- 基础变量与动画 --- */
        :root {
            --mod16-primary: var(--primary-color, #00faff);
            --mod16-secondary: var(--secondary-color, #7affff);
            --mod16-bg: var(--container-bg-color, rgba(10, 25, 47, 0.95));
            --mod16-border: var(--border-color, rgba(0, 250, 255, 0.3));
            --mod16-text: var(--text-color, #e6f1ff);
            --mod16-text-dim: var(--text-secondary-color, #a8c0e1);
            --mod16-danger: var(--danger-color, #ff4d4d);
            --mod16-success: var(--success-color, #4dff88);
            --mod16-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        @keyframes mod16-slide-in {
            from { opacity: 0; transform: translateX(20px) scale(0.9); }
            to { opacity: 1; transform: translateX(0) scale(1); }
        }

        @keyframes mod16-fade-in {
            from { opacity: 0; backdrop-filter: blur(0px); }
            to { opacity: 1; backdrop-filter: blur(4px); }
        }

        @keyframes mod16-scanline {
            0% { background-position: 0% 0%; }
            100% { background-position: 0% 100%; }
        }

 #mod16-wheel-container {
    position: fixed;
    /* 增大尺寸以容纳弧形布局 */
    width: 150px;
    height: 150px;
    z-index: 999;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    /* 初始隐藏状态 */
    transform: translateX(30px);
}

#mod16-wheel-container.visible {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
}

.mod16-wheel-body {
    width: 100%;
    height: 100%;
    /* 保持半透明背景，但移除边框和形状，让按钮自由定位 */
    background: transparent;
    border: none;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
   

  

        .mod16-wheel-icon {
            font-size: 24px;
            display: block;
        }

        /* --- 模态框 --- */
        .mod16-modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: mod16-fade-in 0.3s forwards;
        }

        .mod16-modal-content {
            width: 90%;
            max-width: 900px;
            height: 85vh;
            background: var(--mod16-bg);
            border: 1px solid var(--mod16-border);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 250, 255, 0.05);
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            font-family: var(--mod16-font);
            color: var(--mod16-text);
            /* 扫描线背景 */
            background-image: linear-gradient(rgba(0, 250, 255, 0.03) 1px, transparent 1px);
            background-size: 100% 4px;
        }

        .mod16-header {
            padding: 20px;
            border-bottom: 1px solid var(--mod16-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(0, 0, 0, 0.3);
        }

        .mod16-title {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 2px;
            color: var(--mod16-primary);
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .mod16-close-btn {
            background: none;
            border: 1px solid var(--mod16-border);
            color: var(--mod16-text-dim);
            padding: 5px 15px;
            cursor: pointer;
            transition: 0.2s;
        }
        .mod16-close-btn:hover {
            background: var(--mod16-danger);
            color: white;
            border-color: var(--mod16-danger);
        }

        .mod16-body {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: grid;
            grid-template-columns: 1fr;
            gap: 25px;
        }

        @media (min-width: 768px) {
            .mod16-body {
                grid-template-columns: repeat(2, 1fr); /* 平板/PC 双列 */
            }
            .mod16-section-full {
                grid-column: span 2;
            }
        }

        /* --- 通用卡片样式 --- */
        .mod16-section {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 15px;
            position: relative;
        }

        .mod16-section-title {
            font-size: 16px;
            color: var(--mod16-secondary);
            margin-bottom: 15px;
            border-left: 3px solid var(--mod16-secondary);
            padding-left: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* --- 新闻模块 --- */
        .mod16-news-item {
            margin-bottom: 12px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.2);
            border-left: 2px solid var(--mod16-text-dim);
            transition: all 0.2s;
            cursor: pointer;
            position: relative;
        }
        .mod16-news-item:hover {
            
            border-left-color: var(--mod16-primary);
        }
        .mod16-news-title {
            font-weight: bold;
            color: var(--mod16-text);
            margin-bottom: 5px;
            display: block;
        }
        .mod16-news-content {
            font-size: 13px;
            color: var(--mod16-text-dim);
            line-height: 1.4;
        }
        .mod16-news-source {
            display: inline-block;
            font-size: 10px;
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 6px;
            border-radius: 2px;
            margin-top: 5px;
            color: var(--mod16-secondary);
        }
        .mod16-new-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--mod16-danger);
            color: white;
            font-size: 10px;
            padding: 2px 5px;
            border-radius: 2px;
            font-weight: bold;
            box-shadow: 0 0 5px var(--mod16-danger);
            animation: mod16-pulse 2s infinite;
        }
        @keyframes mod16-pulse {
            0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; }
        }
        .mod16-click-hint {
            font-size: 10px;
            color: var(--mod16-primary);
            opacity: 0;
            transition: opacity 0.2s;
            float: right;
        }
        .mod16-news-item:hover .mod16-click-hint {
            opacity: 1;
        }

        /* --- 平行事件模块 --- */
        .mod16-event-card {
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            background: rgba(0, 0, 0, 0.2);
        }
        .mod16-event-header {
            padding: 10px;
            background: rgba(255, 255, 255, 0.03);
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .mod16-event-name {
            font-weight: bold;
            color: var(--mod16-primary);
        }
        .mod16-status-tag {
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 10px;
            border: 1px solid currentColor;
        }
        .mod16-status-active { color: var(--mod16-success); box-shadow: 0 0 5px rgba(77, 255, 136, 0.2); }
        .mod16-status-pending { color: var(--mod16-text-dim); }
        .mod16-status-ended { color: var(--mod16-danger); }

        .mod16-event-body {
            padding: 10px;
        }
        .mod16-event-desc {
            font-size: 13px;
            color: var(--mod16-text-dim);
            margin-bottom: 10px;
            font-style: italic;
        }

        /* 时间轴 */
        .mod16-timeline {
            position: relative;
            padding-left: 15px;
            margin-top: 10px;
            border-left: 1px dashed var(--mod16-border);
            max-height: 150px;
            overflow-y: auto;
        }
        .mod16-timeline-item {
            position: relative;
            margin-bottom: 10px;
        }
        .mod16-timeline-item::before {
            content: '';
            position: absolute;
            left: -19px;
            top: 6px;
            width: 7px;
            height: 7px;
            background: var(--mod16-secondary);
            border-radius: 50%;
        }
        .mod16-time-label {
            font-size: 11px;
            color: var(--mod16-primary);
            font-family: monospace;
        }
        .mod16-time-content {
            font-size: 13px;
            color: var(--mod16-text);
        }
        .mod16-next-update {
            margin-top: 10px;
            font-size: 11px;
            color: var(--mod16-text-dim);
            text-align: right;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 5px;
        }

        /* --- 角色细节模块 --- */
        .mod16-npc-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
        }
        .mod16-npc-card {
            background: rgba(255, 255, 255, 0.03);
            padding: 10px;
            border: 1px solid transparent;
            transition: 0.2s;
        }
        .mod16-npc-card:hover {
            border-color: var(--mod16-border);
            background: rgba(255, 255, 255, 0.05);
        }
        .mod16-npc-name {
            font-weight: bold;
            color: var(--mod16-secondary);
            margin-bottom: 5px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 2px;
        }
        .mod16-npc-fact {
            font-size: 12px;
            color: var(--mod16-text-dim);
            margin-bottom: 4px;
            display: flex;
            gap: 5px;
        }
        .mod16-npc-fact::before {
            content: '>';
            color: var(--mod16-primary);
        }

        /* 滚动条美化 */
        .mod16-body::-webkit-scrollbar, .mod16-timeline::-webkit-scrollbar {
            width: 6px;
        }
        .mod16-body::-webkit-scrollbar-track, .mod16-timeline::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
        }
        .mod16-body::-webkit-scrollbar-thumb, .mod16-timeline::-webkit-scrollbar-thumb {
            background: var(--mod16-border);
            border-radius: 3px;
        }

 

 

/* --- 新增：书签化渲染样式 --- */
     .mod16-bookmark-section {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 0; /* 移除内边距，让Tab贴边 */
            display: flex;
            flex-direction: column;
            height: 100%; /* 占满高度 */

            /* 核心修复：强制跨两列 (针对PC端 Grid 布局) */
            grid-column: 1 / -1;
        }
         .mod16-bookmark-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 0; /* 紧凑排列 */
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid var(--mod16-border);
            padding: 0 10px;
        }

        .mod16-bookmark-tab {
            padding: 12px 20px;
            cursor: pointer;
            transition: 0.2s;
            border-bottom: 2px solid transparent;
            font-size: 14px;
            color: var(--mod16-text-dim);
            opacity: 0.7;
        }

        .mod16-bookmark-tab:hover {
            background: rgba(255, 255, 255, 0.05);
            opacity: 1;
        }

        .mod16-bookmark-tab.active {
            color: var(--mod16-primary);
            border-bottom-color: var(--mod16-primary);
            background: linear-gradient(to top, rgba(0, 250, 255, 0.1), transparent);
            opacity: 1;
            font-weight: bold;
        }

        .mod16-bookmark-content {
            display: none;
            padding: 20px;
            overflow-y: auto;
            /* 增加底部空间 */
            padding-bottom: 40px;
        }

        .mod16-bookmark-content.active {
            display: block;
            animation: mod16-fade-in 0.3s ease;
        }
.mod16-bookmark-content {
    display: none; /* 默认隐藏 */
    max-height: 400px; /* 限制最大高度 */
    overflow-y: auto;
    padding-right: 10px; /* 为滚动条留出空间 */
}

.mod16-bookmark-content.active {
    display: block;
}

/* 针对不同内容的美化 */
.mod16-bookmark-content pre {
    white-space: pre-wrap; /* 自动换行 */
    word-wrap: break-word;
    background: rgba(0,0,0,0.2);
    padding: 10px;
    border-radius: 4px;
    font-family: monospace;
    color: var(--mod16-text-dim);
}

  /* 每一行数据 */
        .mod16-info-row {
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.6;
        }

        /* 键 (Key) */
        .mod16-info-key {
            color: var(--mod16-secondary);
            font-weight: 600;
            margin-right: 8px;
            display: inline-block;
            opacity: 0.9;
        }
        /* 键的装饰符 */
        .mod16-info-key::after {
            content: ':';
            margin-left: 2px;
            opacity: 0.5;
        }

        /* 值 (Value) - 文本 */
        .mod16-info-value {
            color: var(--mod16-text);
            word-break: break-word; /* 防止长文本撑破 */
        }

        /* 嵌套容器 (Object/Array) */
        .mod16-info-group {
            margin-top: 5px;
            margin-bottom: 15px;
            margin-left: 12px; /* 缩进 */
            padding-left: 12px;
            border-left: 2px solid rgba(0, 250, 255, 0.15); /* 左侧装饰线 */
            background: rgba(0, 0, 0, 0.1); /* 轻微背景区分层级 */
            padding-top: 8px;
            padding-bottom: 8px;
            border-radius: 0 4px 4px 0;
        }

        /* 嵌套容器的标题 (如果是对象里的对象) */
        .mod16-group-title {
            font-size: 13px;
            color: var(--mod16-text-dim);
            margin-bottom: 5px;
            font-family: monospace;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.8;
        }

        /* 纯文本大段落优化 */
        .mod16-long-text {
            white-space: pre-wrap;
            color: var(--mod16-text-dim);
            background: rgba(255, 255, 255, 0.03);
            padding: 10px;
            border-radius: 4px;
            margin-top: 5px;
            border: 1px dashed rgba(255, 255, 255, 0.1);
        }

        
    `;
    document.head.appendChild(style);

    // 3. 核心逻辑类
    class Mod16WorldInfo {
        constructor() {
            this.orbId = 'world-book-orb';
            this.wheelId = 'mod16-wheel-container';
            this.init();
        }

  init() {
            // 使用管理器添加三个基础按钮
            // 注意：这里不再需要 createWheel() 的复杂 DOM 操作

            if (window.Mod16WheelManager) {
                window.Mod16WheelManager.addButton(
                    'mod16-open-btn',
                    '◈',
                    '世界事件',
                    () => this.openModal('world-events')
                );

                window.Mod16WheelManager.addButton(
                    'mod16-intel-btn',
                    '⌬',
                    '情报',
                    () => this.openModal('intelligence')
                );

                window.Mod16WheelManager.addButton(
                    'mod16-memo-btn',
                    '✎',
                    '备忘录',
                    () => this.openModal('memo')
                );
            }
        }

        // 获取数据 (Robustness)
        getData() {
            try {
                const assa = window.GameAPI.assaData;
                if (!assa) return null;

                // 优先查找 global_lore，其次 world_lore
                let settings = null;
                if (assa.global_lore && assa.global_lore.settings && assa.global_lore.settings['世界事件']) {
                    settings = assa.global_lore.settings['世界事件'];
                } else if (assa.world_lore && assa.world_lore.settings && assa.world_lore.settings['世界事件']) {
                    settings = assa.world_lore.settings['世界事件'];
                }

                return settings;
            } catch (e) {
                console.warn('Mod16: Error fetching data', e);
                return null;
            }
        }

        // 检查是否有更新 (New! Badge)
        checkUpdate(pathKey) {
            try {
                const batch = window.GameAPI.collectedBatchOps;
                if (!Array.isArray(batch)) return false;

                // 检查路径中是否包含特定关键字
                return batch.some(op =>
                    op.type === 'set_status' &&
                    op.path &&
                    op.path.includes(pathKey)
                );
            } catch (e) {
                return false;
            }
        }

         // (原 openModal 方法)
        openModal(type = 'world-events') { // 接收一个类型参数
            // 创建模态框结构 (这部分不变)
            const overlay = document.createElement('div');
            overlay.className = 'mod16-modal-overlay';
            const content = document.createElement('div');
            content.className = 'mod16-modal-content';

            // 根据类型确定标题
            let title = '世界事件';
            if (type === 'intelligence') title = '情报档案';
            if (type === 'memo') title = '备忘录';

            content.innerHTML = `
                <div class="mod16-header">
                    <div class="mod16-title">
                        <span style="color:var(--mod16-secondary)">///</span>${title}
                    </div>
                    <button class="mod16-close-btn">CLOSE [X]</button>
                </div>
                <div class="mod16-body" id="mod16-content-body">

                </div>
            `;
            overlay.appendChild(content);
            document.body.appendChild(overlay);

            const body = content.querySelector('#mod16-content-body');

            // 根据类型调用不同的渲染方法
            if (type === 'world-events') {
                const data = this.getData();
                if (!data) {
                    body.innerHTML = `<div style="padding:20px; color:var(--mod16-text-dim)">暂无世界情报数据...</div>`;
                } else {
                    this.renderNews(body, data['今日新闻']);
                    this.renderEvents(body, data['平行事件']);
                    this.renderDetails(body, data['角色细节']);
                }
            } else if (type === 'intelligence') {
                this.renderIntelligence(body);
            } else if (type === 'memo') {
                this.renderMemo(body);
            }

            // 关闭逻辑 (不变)
            const close = () => document.body.removeChild(overlay);
            content.querySelector('.mod16-close-btn').addEventListener('click', close);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) close();
            });
        }


        // 渲染新闻
        // 渲染新闻
        renderNews(container, newsData) {
            if (!newsData || typeof newsData !== 'object') return;

            const section = document.createElement('div');
            section.className = 'mod16-section';

            const hasUpdate = this.checkUpdate('今日新闻');
            const badgeHtml = hasUpdate ? `<span class="mod16-new-badge">NEW!</span>` : '';

            let html = `
                <div class="mod16-section-title">
                    <span> // 本地新闻</span>
                    ${badgeHtml}
                </div>
            `;

            // 遍历新闻数据
            Object.entries(newsData).forEach(([key, value]) => {
                let title, content, source;
                let contentStr = ''; // 用于统一处理 "from"

                // --- 新增/修改逻辑：判断数据格式 ---
                if (typeof value === 'object' && value !== null) {
                    // 格式1: 新格式，值为对象 {title, content, source}
                    if (value.title && value.content) {
                        title = value.title;
                        content = value.content;
                        source = value.source || '未知来源';
                    }
                    // 格式3: 最新的格式，值为只有一个键值对的对象 { "标题": "内容 from 来源" }
                    else if (Object.keys(value).length === 1) {
                        title = Object.keys(value)[0];
                        contentStr = value[title];
                    }
                    // 如果对象格式不匹配，则跳过
                    else {
                        return;
                    }
                }
                // 格式2: 旧格式，值为字符串 "内容 from 来源"
                else if (typeof value === 'string') {
                    title = key; // 旧格式下，键就是标题
                    contentStr = value;
                }
                // 如果所有格式都不匹配，则跳过此条目
                else {
                    return;
                }

                // --- 统一处理 contentStr ---
                if (contentStr) {
                    if (contentStr.includes('from')) {
                        const parts = contentStr.split('from');
                        content = parts[0].trim();
                        source = parts[1].trim();
                    } else {
                        content = contentStr;
                        source = '未知来源';
                    }
                }
                // --- 处理结束 ---


                // 使用解析出的变量构建HTML (这部分保持不变)
                html += `
                    <div class="mod16-news-item" data-title="${title}">
                        ${hasUpdate ? '<div class="mod16-new-badge" style="right:5px; top:5px; position:absolute; transform:scale(0.8)">UPD</div>' : ''}
                        <span class="mod16-news-title">${title}</span>
                        <div class="mod16-news-content">${content}</div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span class="mod16-news-source">来源: ${source}</span>
                            <span class="mod16-click-hint">点击查看详情 ▶</span>
                        </div>
                    </div>
                `;
            });

            section.innerHTML = html;
            container.appendChild(section);

            // 绑定新闻点击事件 (这部分保持不变)
            section.querySelectorAll('.mod16-news-item').forEach(item => {
                item.addEventListener('click', () => {
                    const title = item.getAttribute('data-title');
                    const userName = window.GameAPI.userName || '玩家';

                    if (window.GameAPI && typeof window.GameAPI.triggerassa === 'function') {
                        window.GameAPI.triggerassa(`/setinput <${userName}尝试查看新闻「${title}」>`);
                    }

                    if (window.worldHelper && typeof window.worldHelper.showNovaAlert === 'function') {
                        window.worldHelper.showNovaAlert(`正在检索新闻档案: ${title}...`);
                    } else {
                        alert(`正在检索新闻档案: ${title}...`);
                    }
                });
            });
        }



        // 渲染平行事件
        renderEvents(container, eventsData) {
            if (!eventsData || typeof eventsData !== 'object') return;

            const section = document.createElement('div');
            section.className = 'mod16-section';
            section.innerHTML = `<div class="mod16-section-title"> // 平行事件</div>`;

            Object.entries(eventsData).forEach(([eventName, data]) => {
                if (typeof data !== 'object') return;
   eventName = data.name || data.名称 ||eventName;
                const status = data['状态'] || '未知';
                let statusClass = 'mod16-status-pending';
                if (status === '进行中') statusClass = 'mod16-status-active';
                if (status === '已结束') statusClass = 'mod16-status-ended';

                // 构建时间轴
                let timelineHtml = '';
                if (data['进展'] && typeof data['进展'] === 'object') {
                    // 排序时间 (简单按key字符串排序，如果格式严格可以更复杂)
                    const times = Object.keys(data['进展']);
                    times.forEach(time => {
                        timelineHtml += `
                            <div class="mod16-timeline-item">
                                <div class="mod16-time-label">${time}</div>
                                <div class="mod16-time-content">${data['进展'][time]}</div>
                            </div>
                        `;
                    });
                }

                const card = document.createElement('div');
                card.className = 'mod16-event-card';
                card.innerHTML = `
                    <div class="mod16-event-header">
                        <span class="mod16-event-name">${eventName}</span>
                        <span class="mod16-status-tag ${statusClass}">${status}</span>
                    </div>
                    <div class="mod16-event-body">
                        <div class="mod16-event-desc">${data['简介'] || '暂无简介'}</div>
                        <div class="mod16-timeline">
                            ${timelineHtml || '<div style="color:gray; font-size:12px;">暂无进展记录</div>'}
                        </div>
                        <div class="mod16-next-update">
                            下次更新: ${data['下次更新时间'] || '待定'}
                        </div>
                    </div>
                `;
                section.appendChild(card);
            });

            container.appendChild(section);
        }

        // 渲染角色细节
        renderDetails(container, detailsData) {
            if (!detailsData || typeof detailsData !== 'object') return;

            const section = document.createElement('div');
            section.className = 'mod16-section mod16-section-full'; // 跨两列
            section.innerHTML = `<div class="mod16-section-title"> // 角色细节档案</div>`;

            const grid = document.createElement('div');
            grid.className = 'mod16-npc-grid';

            Object.entries(detailsData).forEach(([npcName, facts]) => {
                if (typeof facts !== 'object') return;

                let factsHtml = '';
                Object.values(facts).forEach(fact => {
                    factsHtml += `<div class="mod16-npc-fact">${fact}</div>`;
                });

                const card = document.createElement('div');
                card.className = 'mod16-npc-card';
                card.innerHTML = `
                    <div class="mod16-npc-name">${npcName}</div>
                    <div>${factsHtml}</div>
                `;
                grid.appendChild(card);
            });

            section.appendChild(grid);
            container.appendChild(section);
        }

                // --- 新增方法 ---

        // 渲染情报
        renderIntelligence(container) {
            try {
                const assa = window.GameAPI.assaData;
                if (!assa) throw new Error('No assaData');

                let intelData = {};
                if (assa.global_lore && assa.global_lore.settings) {
                    intelData = {...intelData, ...assa.global_lore.settings};
                }
                if (assa.world_lore && assa.world_lore.settings) {
                    intelData = {...intelData, ...assa.world_lore.settings};
                }

                // 过滤掉指定字段
                const excludedKeys = ['群聊', '世界事件', '角色关系'];
                const filteredKeys = Object.keys(intelData).filter(key => !excludedKeys.includes(key));

                if (filteredKeys.length === 0) {
                    container.innerHTML = `<div style="padding:20px; color:var(--mod16-text-dim)">暂无情报数据...</div>`;
                    return;
                }

                // 使用通用书签渲染器
                this.renderAsBookmarks(container, intelData, filteredKeys);

            } catch (e) {
                console.warn('Mod16: Error fetching intelligence data', e);
                container.innerHTML = `<div style="padding:20px; color:var(--mod16-danger)">读取情报数据失败。</div>`;
            }
        }

        // 渲染备忘录
        renderMemo(container) {
            try {
                const memoData = window.GameAPI.assaData.global_lore?.['备忘录'];
                if (!memoData || Object.keys(memoData).length === 0) {
                    container.innerHTML = `<div style="padding:20px; color:var(--mod16-text-dim)">备忘录为空...</div>`;
                    return;
                }

                // 使用通用书签渲染器
                this.renderAsBookmarks(container, memoData, Object.keys(memoData));

            } catch (e) {
                console.warn('Mod16: Error fetching memo data', e);
                container.innerHTML = `<div style="padding:20px; color:var(--mod16-danger)">读取备忘录数据失败。</div>`;
            }
        }

        // 通用的书签化渲染函数 (核心)
   // (原 renderAsBookmarks 方法 - 完全重写)
        renderAsBookmarks(container, data, keys) {
            const section = document.createElement('div');
            section.className = 'mod16-bookmark-section';

            const tabsContainer = document.createElement('div');
            tabsContainer.className = 'mod16-bookmark-tabs';

            const contentsContainer = document.createElement('div');
            // 让内容区域自适应剩余高度
            contentsContainer.style.flex = '1';
            contentsContainer.style.overflow = 'hidden'; // 内部滚动

            keys.forEach((key, index) => {
                // 1. 创建 Tab
                const tab = document.createElement('div');
                tab.className = 'mod16-bookmark-tab';
                tab.textContent = key;
                tab.dataset.target = `mod16-content-${index}`;
                tabsContainer.appendChild(tab);

                // 2. 创建内容面板
                const content = document.createElement('div');
                content.className = 'mod16-bookmark-content';
                content.id = `mod16-content-${index}`;

                const value = data[key];

                // 调用递归渲染函数
                content.innerHTML = this.formatDataRecursive(value);

                contentsContainer.appendChild(content);

                // 默认激活第一个
                if (index === 0) {
                    tab.classList.add('active');
                    content.classList.add('active');
                }
            });

            section.appendChild(tabsContainer);
            section.appendChild(contentsContainer);
            container.appendChild(section);

            // Tab 切换逻辑
            tabsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('mod16-bookmark-tab')) {
                    tabsContainer.querySelectorAll('.mod16-bookmark-tab').forEach(t => t.classList.remove('active'));
                    contentsContainer.querySelectorAll('.mod16-bookmark-content').forEach(c => c.classList.remove('active'));

                    e.target.classList.add('active');
                    const targetId = e.target.dataset.target;
                    document.getElementById(targetId).classList.add('active');
                }
            });
        }

        // --- 新增：递归数据格式化器 (核心) ---
        formatDataRecursive(data, isRoot = true) {
            if (data === null || data === undefined) {
                return '<span style="color:gray; font-style:italic">无数据</span>';
            }

            // 1. 处理字符串 (如果是长文本，特殊处理)
            if (typeof data === 'string') {
                // 如果包含换行符，或者长度超过50，视为长文本段落
                if (data.includes('\n') || data.length > 50) {
                    return `<div class="mod16-long-text">${data}</div>`;
                }
                return `<span class="mod16-info-value">${data}</span>`;
            }

            // 2. 处理基本类型 (数字、布尔)
            if (typeof data !== 'object') {
                return `<span class="mod16-info-value" style="color:var(--mod16-primary)">${data}</span>`;
            }

            // 3. 处理数组
            if (Array.isArray(data)) {
                if (data.length === 0) return '<span style="color:gray">[]</span>';

                // 如果是纯字符串数组，用逗号连接更简洁？或者列表？这里选择列表
                let html = `<div class="mod16-info-group">`;
                data.forEach((item, index) => {
                    html += `
                        <div class="mod16-info-row">
                            <span class="mod16-info-key" style="font-size:12px; opacity:0.6">[${index + 1}]</span>
                            ${this.formatDataRecursive(item, false)}
                        </div>
                    `;
                });
                html += `</div>`;
                return html;
            }

            // 4. 处理对象 (核心逻辑)
            // 这里的逻辑是：直接展开所有 Key: Value
            let html = isRoot ? '' : `<div class="mod16-info-group">`;

            Object.entries(data).forEach(([key, value]) => {
                // 判断值是否是复杂对象，决定是否换行显示
                const isComplex = typeof value === 'object' && value !== null;

                html += `<div class="mod16-info-row">`;

                // 键名
                html += `<span class="mod16-info-key">${key}</span>`;

                // 如果是复杂对象，标题后换行，然后渲染内容
                if (isComplex) {
                    // 递归调用
                    html += this.formatDataRecursive(value, false);
                } else {
                    // 简单值，直接跟在后面
                    html += this.formatDataRecursive(value, false);
                }

                html += `</div>`;
            });

            html += isRoot ? '' : `</div>`;
            return html;
        }

    }

    // 4. 启动
    // 确保DOM加载完毕或直接执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new Mod16WorldInfo());
    } else {
        new Mod16WorldInfo();
    }
 
})();