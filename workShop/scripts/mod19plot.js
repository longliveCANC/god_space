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
    // 2. CSS 样式注入 (mod19 前缀)
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
            --container-bg-color: rgba(10, 25, 47, 0.95);
            --border-color: rgba(0, 250, 255, 0.3);
            --glow-color: rgba(0, 250, 255, 0.5);
            --text-color: #e6f1ff;
            --text-secondary-color: #a8c0e1;
            --background-color: rgba(10, 25, 47);
            --danger-color: #ff4d4d;
            --danger-glow-color: rgba(255, 77, 77, 0.5);
            --success-color: #4dff88;
            --success-glow-color: rgba(77, 255, 136, 0.5);
            --warning-color: #ffd700;
        }

        .mod19-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(5px);
            z-index: 9999; display: flex; justify-content: center; align-items: center;
            opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
            font-family: var(--base-font-family);
        }
        .mod19-modal-overlay.active { opacity: 1; pointer-events: auto; }

        .mod19-dashboard {
            width: 95%; max-width: 1200px; height: 90vh;
            background: var(--container-bg-color);
            border: 1px solid var(--border-color);
            border-radius: 4px; display: flex; flex-direction: column;
            overflow: hidden; position: relative;
            box-shadow: 0 0 20px rgba(0, 250, 255, 0.1);
        }
        /* 扫描线特效 */
        .mod19-dashboard::after {
            content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom, transparent 50%, rgba(0, 250, 255, 0.02) 51%);
            background-size: 100% 4px; pointer-events: none; z-index: 1;
        }

        .mod19-header {
            padding: 15px 20px; border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
            background: rgba(0, 250, 255, 0.05);
        }
        .mod19-title {
            font-size: 20px; font-weight: bold; color: var(--primary-color);
            text-transform: uppercase; letter-spacing: 2px;
            text-shadow: 0 0 8px var(--glow-color);
        }
        .mod19-close-btn {
            background: transparent; border: 1px solid var(--danger-color);
            color: var(--danger-color); padding: 5px 15px; cursor: pointer;
            font-weight: bold; transition: all 0.2s;
        }
        .mod19-close-btn:hover { background: var(--danger-color); color: #000; }

        /* 顶部导航 Tabs */
        .mod19-nav-tabs {
            display: flex; border-bottom: 1px solid rgba(255,255,255,0.1);
            background: rgba(0,0,0,0.2);
        }
        .mod19-nav-tab {
            padding: 12px 25px; cursor: pointer; color: var(--text-secondary-color);
            border-bottom: 2px solid transparent; transition: all 0.3s; font-weight: bold;
        }
        .mod19-nav-tab:hover { color: var(--text-color); background: rgba(255,255,255,0.05); }
        .mod19-nav-tab.active {
            color: var(--primary-color); border-bottom: 2px solid var(--primary-color);
            background: linear-gradient(to top, rgba(0, 250, 255, 0.1), transparent);
        }

        /* 内容区域 */
        .mod19-content-container { flex: 1; overflow: hidden; position: relative; }
        .mod19-view-panel {
            display: none; width: 100%; height: 100%;
            animation: mod19-fade-in 0.3s ease;
        }
 .mod19-view-panel.active {
    display: flex; /* 使用 flex 来激活面板 */
    flex-direction: column; /* 确保内部元素能正确布局 */
}

/* 剧情线视图布局 */
.mod19-story-layout {
    width: 100%;
    height: 100%;
    display: flex; /* 保持 flex 布局 */
}
/* 关键修复：让侧边栏和主视图可以独立滚动 */
.mod19-sidebar {
    width: 280px;
    border-right: 1px solid var(--border-color);
    overflow-y: auto; /* 允许侧边栏在内容过多时滚动 */
    background: rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    flex-shrink: 0; /* 防止侧边栏被压缩 */
}
       .mod19-main-view {
    flex: 1;
    overflow-y: auto; /* 允许主内容区在时间轴过长时滚动 */
    padding: 20px;
    position: relative;
}
        /* 剧情线列表项 */
        .mod19-story-item {
            padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05);
            cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent;
        }
        .mod19-story-item:hover { background: rgba(255,255,255,0.05); }
        .mod19-story-item.active {
            background: rgba(0, 250, 255, 0.05);
            border-left: 3px solid var(--primary-color);
        }
        .mod19-story-title { font-weight: bold; color: var(--text-color); margin-bottom: 5px; }
        .mod19-story-meta { font-size: 12px; color: var(--text-secondary-color); display: flex; justify-content: space-between; }

        /* 状态标签 */
        .mod19-tag {
            font-size: 10px; padding: 2px 6px; border-radius: 2px;
            border: 1px solid currentColor; font-weight: bold;
        }
        .mod19-tag.main { color: var(--primary-color); }
        .mod19-tag.side { color: var(--secondary-color); }
        .mod19-tag.hidden { color: #bd93f9; }
        .mod19-tag.status-done { color: var(--success-color); }
        .mod19-tag.status-ing { color: var(--warning-color); }
        .mod19-tag.status-wait { color: var(--text-secondary-color); }

        /* 时间轴样式 */
        .mod19-timeline {
            position: relative; padding-left: 30px; max-width: 800px; margin: 0 auto;
        }
        .mod19-timeline::before {
            content: ''; position: absolute; left: 0; top: 0; bottom: 0;
            width: 2px; background: rgba(0, 250, 255, 0.2);
        }
        .mod19-event-node {
            position: relative; margin-bottom: 30px;
            background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255,255,255,0.1);
            padding: 15px; border-radius: 4px;
        }
        .mod19-event-node::before {
            content: ''; position: absolute; left: -35px; top: 15px;
            width: 12px; height: 12px; border-radius: 50%;
            background: var(--container-bg-color); border: 2px solid var(--primary-color);
            box-shadow: 0 0 5px var(--primary-color);
        }
        .mod19-event-node.done::before { background: var(--primary-color); }
        .mod19-event-header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 5px;
        }
        .mod19-event-title { font-size: 16px; font-weight: bold; color: var(--text-color); }
        .mod19-significance {
            font-size: 12px; color: var(--warning-color); margin-bottom: 8px;
            font-style: italic; display: flex; align-items: center;
        }
        .mod19-significance::before { content: '⚠'; margin-right: 5px; }
        .mod19-outcome {
            background: rgba(0, 250, 255, 0.05); padding: 8px;
            border-left: 2px solid var(--secondary-color);
            font-size: 13px; color: var(--text-secondary-color);
        }

        /* 伏笔网格视图 */
  .mod19-grid-view {
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    overflow-y: auto; /* 确保垂直方向可滚动 */
    width: 100%;
    height: 100%; /* 明确高度，这是计算滚动的关键 */
    align-content: flex-start; /* 防止网格项在垂直方向上拉伸 */
}
        .mod19-card {
            background: rgba(0,0,0,0.3); border: 1px solid var(--border-color);
            padding: 15px; display: flex; flex-direction: column; gap: 10px;
            transition: transform 0.2s;
        }
        .mod19-card:hover { transform: translateY(-2px); background: rgba(0, 250, 255, 0.02); }
        .mod19-card-title { font-weight: bold; color: var(--secondary-color); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; }
        .mod19-card-row { font-size: 12px; color: var(--text-secondary-color); }
        .mod19-card-val { color: var(--text-color); margin-left: 5px; }
        .mod19-truth-box {
            margin-top: auto; padding: 10px; background: rgba(0,0,0,0.5);
            border: 1px dashed var(--border-color); font-size: 13px;
            color: var(--text-secondary-color); min-height: 60px;
        }
        .mod19-revealed { color: var(--success-color); border-color: var(--success-color); }

        /* 移动端适配 */
        @media (max-width: 768px) {
            .mod19-story-layout { flex-direction: column; }
            .mod19-sidebar {
                width: 100%; height: 120px; flex-shrink: 0;
                flex-direction: row; overflow-x: auto; overflow-y: hidden;
                border-right: none; border-bottom: 1px solid var(--border-color);
            }
            .mod19-story-item {
                width: 200px; flex-shrink: 0; border-left: none; border-bottom: 3px solid transparent;
                display: flex; flex-direction: column; justify-content: center;
            }
            .mod19-story-item.active { border-left: none; border-bottom: 3px solid var(--primary-color); }
            .mod19-timeline { padding-left: 20px; }
            .mod19-event-node::before { left: -26px; width: 10px; height: 10px; }
        }

        @keyframes mod19-fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .mod19-empty-msg { text-align: center; color: var(--text-secondary-color); padding: 40px; font-style: italic; }
    `;
    document.head.appendChild(style);

    // ==========================================================================
    // 3. 核心逻辑
    // ==========================================================================

    // 获取数据
    function getPlotData() {
        try {
            if (typeof assaSettingsData === 'undefined') return null;
            // 尝试获取 global_lore.plot
            let plotData = assaSettingsData?.global_lore?.plot;

            // 兼容性处理：如果数据是字符串，尝试解析
            if (typeof plotData === 'string') {
                try { plotData = JSON.parse(plotData); } catch(e) { console.error('JSON Parse Error', e); }
            }
            return plotData || {};
        } catch (e) {
            console.error('Mod19: Data access error', e);
            return {};
        }
    }

    // 渲染剧情线侧边栏
    function renderStorylinesSidebar(storylines, activeKey) {
        if (!storylines || Object.keys(storylines).length === 0) return '<div class="mod19-empty-msg">暂无剧情线</div>';

        return Object.entries(storylines).map(([key, data]) => {
            const isActive = key === activeKey ? 'active' : '';
            const typeClass = data.type === '主线' ? 'main' : (data.type === '暗线' ? 'hidden' : 'side');
            const statusClass = data.status === '已完成' ? 'status-done' : (data.status === '进行中' ? 'status-ing' : 'status-wait');

            return `
                <div class="mod19-story-item ${isActive}" onclick="window.Mod19Dashboard.switchStory('${key}')">
                    <div class="mod19-story-title">${key}</div>
                    <div class="mod19-story-meta">
                        <span class="mod19-tag ${typeClass}">${data.type || '未知'}</span>
                        <span class="mod19-tag ${statusClass}">${data.status || '未开始'}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 渲染剧情线详情（时间轴）
    function renderStorylineDetail(storylineKey, storylineData) {
        if (!storylineData || !storylineData.events) return '<div class="mod19-empty-msg">此剧情线暂无事件记录</div>';

        const events = storylineData.events;
        // 尝试排序：虽然对象无序，但通常我们希望按插入顺序。
        // 如果没有时间戳，只能依赖 Object.entries 的遍历顺序（通常是插入顺序）。
        const eventHtml = Object.entries(events).map(([evtKey, evt]) => {
            const isDone = evt.status === '已完成';
            const statusTag = isDone ? '<span class="mod19-tag status-done">已完成</span>' : '<span class="mod19-tag status-ing">进行中</span>';

            return `
                <div class="mod19-event-node ${isDone ? 'done' : ''}">
                    <div class="mod19-event-header">
                        <span class="mod19-event-title">${evtKey}</span>
                        ${statusTag}
                    </div>
                    ${evt.significance ? `<div class="mod19-significance">${evt.significance}</div>` : ''}
                    <div style="margin-bottom:8px; color:var(--text-secondary-color); font-size:14px;">
                        ${evt.summary || evtKey}
                    </div>
                    ${evt.outcome ? `<div class="mod19-outcome"><strong>结果：</strong>${evt.outcome}</div>` : ''}
                    ${evt.linksTo ? `<div style="margin-top:5px; font-size:12px; color:var(--secondary-color);">🔗 关联：${evt.linksTo}</div>` : ''}
                </div>
            `;
        }).join('');

        return `
            <div style="margin-bottom: 20px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
                <h2 style="color:var(--primary-color); margin:0;">${storylineKey}</h2>
                <div style="color:var(--text-secondary-color); font-size:13px; margin-top:5px;">
                    当前进度：${storylineData.currentEvent || '无'}
                    ${storylineData.triggeredBy ? ` | 触发源：${storylineData.triggeredBy}` : ''}
                </div>
            </div>
            <div class="mod19-timeline">
                ${eventHtml}
            </div>
        `;
    }

    // 渲染伏笔网格
    function renderForeshadows(foreshadows) {
        if (!foreshadows || Object.keys(foreshadows).length === 0) return '<div class="mod19-empty-msg">暂无伏笔记录</div>';

        return Object.entries(foreshadows).map(([key, data]) => {
            const isRevealed = data.isRevealed === true || data.isRevealed === "true";

            return `
                <div class="mod19-card">
                    <div class="mod19-card-title">${key}</div>
                    <div class="mod19-card-row">埋下于: <span class="mod19-card-val">${data.plantedIn || '?'}</span></div>
                    <div class="mod19-card-row">状态: <span class="mod19-card-val" style="color:${isRevealed ? 'var(--success-color)' : 'var(--warning-color)'}">${isRevealed ? '已揭示' : '未解之谜'}</span></div>
                    <div class="mod19-truth-box ${isRevealed ? 'mod19-revealed' : ''}">
                        ${isRevealed ? (data.truth || '真相已揭示，但记录为空') : '？？？'}
                    </div>
                    ${isRevealed && data.revealEvent ? `<div class="mod19-card-row" style="margin-top:5px; font-size:10px;">揭示事件: ${data.revealEvent}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    // 构建主界面
    function buildDashboard() {
        const data = getPlotData();
        const storylines = data.storylines || {};
        const foreshadows = data.foreshadows || {};

        // 默认选中第一个剧情线
        const firstStoryKey = Object.keys(storylines)[0] || null;

        // 挂载到全局以便交互
        window.Mod19DashboardState = {
            storylines,
            foreshadows,
            activeStory: firstStoryKey
        };

        return `
            <div class="mod19-header">
                <div class="mod19-title">剧情脉络分析 <span style="font-size:12px; opacity:0.5;">PLOT ANALYZER</span></div>
                <button class="mod19-close-btn" onclick="window.Mod19Dashboard.close()">关闭</button>
            </div>
            <div class="mod19-nav-tabs">
                <div class="mod19-nav-tab active" onclick="window.Mod19Dashboard.switchTab('story', this)">剧情线</div>
                <div class="mod19-nav-tab" onclick="window.Mod19Dashboard.switchTab('fore', this)">伏笔与悬念</div>
            </div>
              <div class="mod19-content-container">
                <!-- 剧情线视图 -->
                <div id="mod19-view-story" class="mod19-view-panel active">
                    <div class="mod19-story-layout">
                        <div class="mod19-sidebar" id="mod19-story-list">
                            ${renderStorylinesSidebar(storylines, firstStoryKey)}
                        </div>
                        <div class="mod19-main-view" id="mod19-story-detail">
                            ${firstStoryKey ? renderStorylineDetail(firstStoryKey, storylines[firstStoryKey]) : '<div class="mod19-empty-msg">请选择或创建剧情线</div>'}
                        </div>
                    </div>
                </div>

                <!-- 伏笔视图 -->
                <div id="mod19-view-fore" class="mod19-view-panel">
                    <div class="mod19-grid-view">
                        ${renderForeshadows(foreshadows)}
                    </div>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // 4. 交互控制器
    // ==========================================================================
    window.Mod19Dashboard = {
        open: function() {
            let modal = document.getElementById('mod19-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'mod19-modal';
                modal.className = 'mod19-modal-overlay';
                modal.innerHTML = `<div class="mod19-dashboard" id="mod19-dashboard-body"></div>`;
                document.body.appendChild(modal);

                // 点击遮罩关闭
                modal.onclick = (e) => { if(e.target === modal) this.close(); };
            }

            document.getElementById('mod19-dashboard-body').innerHTML = buildDashboard();
            modal.style.display = 'flex';
            requestAnimationFrame(() => modal.classList.add('active'));
        },

        close: function() {
            const modal = document.getElementById('mod19-modal');
            if (modal) {
                modal.classList.remove('active');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        },

        switchTab: function(tabName, btnElement) {
            // 1. 切换 Tab 按钮的激活状态
            document.querySelectorAll('.mod19-nav-tab').forEach(t => t.classList.remove('active'));
            btnElement.classList.add('active');

            // 2. 隐藏所有的视图面板
            document.querySelectorAll('.mod19-view-panel').forEach(p => p.classList.remove('active'));

            // 3. 根据传入的 tabName (例如 'story' 或 'fore') 找到并显示对应的面板
            const targetPanel = document.getElementById(`mod19-view-${tabName}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            } else {
                console.error(`Mod19 Error: Cannot find panel with ID 'mod19-view-${tabName}'`);
            }
        },

        switchStory: function(key) {
            const state = window.Mod19DashboardState;
            if (!state || !state.storylines[key]) return;

            state.activeStory = key;

            // 更新侧边栏高亮
            const listContainer = document.getElementById('mod19-story-list');
            listContainer.innerHTML = renderStorylinesSidebar(state.storylines, key);

            // 更新详情页
            const detailContainer = document.getElementById('mod19-story-detail');
            detailContainer.innerHTML = renderStorylineDetail(key, state.storylines[key]);
        }
    };

    // ==========================================================================
    // 5. 初始化入口
    // ==========================================================================
    function init() {
        if (window.Mod16WheelManager) {
            window.Mod16WheelManager.addButton(
                'mod19-plot-btn',
                '⚛', // 原子符号，代表剧情原子化
                '剧情脉络',
                () => {
                    window.Mod19Dashboard.open();
                    console.log('Mod19: Plot Dashboard opened');
                }
            );
        } else {
            setTimeout(init, 100);
        }
    }

    init();

})();