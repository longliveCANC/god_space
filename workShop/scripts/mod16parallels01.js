(function() {
    // 1. 防止重复初始化
    if (document.getElementById('mod16-wheel-container')) {
        console.log('Mod16 World Info already initialized.');
        return;
    }

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

        /* --- 触发器转盘 (左半圆) --- */
        #mod16-wheel-container {
            position: fixed;
            width: 100px; /* 半圆宽度 */
            height: 200px; /* 半圆高度 */
            z-index: 999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
            display: flex;
            align-items: center;
            justify-content: flex-end;
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
            background: rgba(10, 25, 47, 0.85);
            border: 1px solid var(--mod16-primary);
            border-right: none; /* 贴合右侧 */
            border-radius: 100px 0 0 100px; /* 左半圆 */
        
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* 装饰性线条 */
        .mod16-wheel-body::before {
            content: '';
            position: absolute;
            right: 0;
            top: 10%;
            bottom: 10%;
            width: 2px;
            background: var(--mod16-primary);
            box-shadow: 0 0 8px var(--mod16-primary);
        }

        .mod16-wheel-btn {
            background: transparent;
            border: none;
            color: var(--mod16-primary);
            font-family: var(--mod16-font);
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            padding: 10px;
            text-align: center;
            transition: all 0.2s;
            text-shadow: 0 0 5px var(--mod16-primary);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        }

        .mod16-wheel-btn:hover {
            color: #fff;
            transform: scale(1.1);
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
            this.createWheel();
            this.setupTrigger();
        }

        // 创建转盘DOM
        createWheel() {
            const container = document.createElement('div');
            container.id = this.wheelId;
            container.innerHTML = `
                <div class="mod16-wheel-body">
                    <button class="mod16-wheel-btn" id="mod16-open-btn">
                        <span class="mod16-wheel-icon">◈</span>
                        <span>世界<br>事件</span>
                    </button>
                </div>
            `;
            document.body.appendChild(container);

            // 绑定点击事件
            document.getElementById('mod16-open-btn').addEventListener('click', (e) => {
                e.stopPropagation(); // 防止冒泡
                this.openModal();
            });
        }

        // 设置触发逻辑 (Hover & Long Press)
        setupTrigger() {
            const wheel = document.getElementById(this.wheelId);
            let timer = null;
            let isHoveringOrb = false;
            let isHoveringWheel = false;

            const updatePosition = () => {
                const orb = document.getElementById(this.orbId);
                if (!orb) return;
                const rect = orb.getBoundingClientRect();
                // 定位在 Orb 左侧，垂直居中
                // wheel width is 100px.
                wheel.style.top = (rect.top + rect.height / 2 - 100) + 'px'; // 100 is half of wheel height
                wheel.style.left = (rect.left - 100 - 10) + 'px'; // 10px gap
            };

            const showWheel = () => {
                updatePosition();
                wheel.classList.add('visible');
            };

            const hideWheel = () => {
                // 只有当既不在Orb上也不在Wheel上时才隐藏
                setTimeout(() => {
                    if (!isHoveringOrb && !isHoveringWheel) {
                        wheel.classList.remove('visible');
                    }
                }, 100);
            };

            // PC端 Hover 逻辑
            document.addEventListener('mousemove', (e) => {
                const orb = document.getElementById(this.orbId);
                if (!orb) return;

                const orbRect = orb.getBoundingClientRect();
                const wheelRect = wheel.getBoundingClientRect();
                const buffer = 20; // 容错区域

                // 检查是否在 Orb 区域
                const inOrb = (
                    e.clientX >= orbRect.left - buffer &&
                    e.clientX <= orbRect.right + buffer &&
                    e.clientY >= orbRect.top - buffer &&
                    e.clientY <= orbRect.bottom + buffer
                );

                // 检查是否在 Wheel 区域
                const inWheel = (
                    e.clientX >= wheelRect.left &&
                    e.clientX <= wheelRect.right &&
                    e.clientY >= wheelRect.top &&
                    e.clientY <= wheelRect.bottom
                );

                if (inOrb) {
                    isHoveringOrb = true;
                    showWheel();
                } else {
                    isHoveringOrb = false;
                }

                if (inWheel) {
                    isHoveringWheel = true;
                } else {
                    isHoveringWheel = false;
                }

                if (!isHoveringOrb && !isHoveringWheel) {
                    hideWheel();
                }
            });

            // 移动端长按逻辑
            document.addEventListener('touchstart', (e) => {
                const orb = document.getElementById(this.orbId);
                if (e.target === orb || orb.contains(e.target)) {
                    timer = setTimeout(() => {
                        showWheel();
                    }, 600); // 600ms 长按
                }
            }, { passive: true });

            document.addEventListener('touchend', () => {
                clearTimeout(timer);
            });

            // 窗口大小改变时更新位置
            window.addEventListener('resize', () => {
                if(wheel.classList.contains('visible')) updatePosition();
            });
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

        // 打开模态框
        openModal() {
            const data = this.getData();

            // 创建模态框结构
            const overlay = document.createElement('div');
            overlay.className = 'mod16-modal-overlay';

            const content = document.createElement('div');
            content.className = 'mod16-modal-content';

            // 头部
            content.innerHTML = `
                <div class="mod16-header">
                    <div class="mod16-title">
                        <span style="color:var(--mod16-secondary)">///</span>世界事件
                    </div>
                    <button class="mod16-close-btn">CLOSE [X]</button>
                </div>
                <div class="mod16-body" id="mod16-content-body">
                    <!-- 内容动态注入 -->
                </div>
            `;

            overlay.appendChild(content);
            document.body.appendChild(overlay);

            // 渲染内容
            const body = content.querySelector('#mod16-content-body');
            if (!data) {
                body.innerHTML = `<div style="padding:20px; color:var(--mod16-text-dim)">暂无世界情报数据...</div>`;
            } else {
                this.renderNews(body, data['今日新闻']);
                this.renderEvents(body, data['平行事件']);
                this.renderDetails(body, data['角色细节']);
            }

            // 关闭逻辑
            const close = () => document.body.removeChild(overlay);
            content.querySelector('.mod16-close-btn').addEventListener('click', close);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) close();
            });
        }

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

            Object.entries(newsData).forEach(([title, contentStr]) => {
                if (typeof contentStr !== 'string') return;

                // 切割 from
                let content = contentStr;
                let source = '未知来源';
                if (contentStr.includes('from')) {
                    const parts = contentStr.split('from');
                    content = parts[0].trim();
                    source = parts[1].trim();
                }

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

            // 绑定新闻点击事件
            section.querySelectorAll('.mod16-news-item').forEach(item => {
                item.addEventListener('click', () => {
                    const title = item.getAttribute('data-title');
                    const userName = window.GameAPI.userName || '玩家';

                    // 触发游戏内逻辑
                    if (window.GameAPI && typeof window.GameAPI.triggerassa === 'function') {
                        window.GameAPI.triggerassa(`/setinput <${userName}尝试查看新闻「${title}」>`);
                    }

                    // 弹窗提示
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
                            NEXT UPDATE: ${data['下次更新时间'] || '待定'}
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
    }

    // 4. 启动
    // 确保DOM加载完毕或直接执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new Mod16WorldInfo());
    } else {
        new Mod16WorldInfo();
    }

})();