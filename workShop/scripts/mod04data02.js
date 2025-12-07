(function () {
    // ==========================================================================
    // 0. 依赖与资源加载 (Loader)
    // ==========================================================================
    const RESOURCES = {
        fontAwesome: 'https://unpkg.com/@fortawesome/fontawesome-free@6.4.0/css/all.min.css',
        threeJS: 'https://unpkg.com/three@0.154.0/build/three.min.js'
    };

    function loadResource(type, url) {
        return new Promise((resolve, reject) => {
            if (type === 'css') {
                if (document.querySelector(`link[href="${url}"]`)) return resolve();
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            } else if (type === 'js') {
                if (window.THREE && url.includes('three')) return resolve(); // Simple check
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            }
        });
    }

    // ==========================================================================
    // 1. 核心样式 (CSS - Mod04 Constructivism)
    // ==========================================================================
    const cssStyles = `
        /* 引入 GameAPI 变量并定义 Mod04 调色板 */
        :root {
            --mod04-red: #D32F2F;
            --mod04-dark-red: #8B0000;
            --mod04-cream: #F5F5DC;
            --mod04-black: #121212;
            --mod04-grey: #424242;
            --mod04-energy: var(--primary-color, #00faff); /* GameAPI 联动 */
            --mod04-accent: var(--secondary-color, #7affff);
            --mod04-font: 'Impact', 'Arial Black', sans-serif;
        }

        /* 触发按钮样式 (相对定位) */
        .mod04-trigger-btn {
            position: absolute; /* 相对于 orb 父容器 */
            padding: 8px 20px;
            background: var(--mod04-red);
            color: var(--mod04-cream);
            font-family: var(--mod04-font);
            font-size: 14px;
            text-transform: uppercase;
            border: 2px solid var(--mod04-black);
            clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
            cursor: pointer;
            z-index:9;
            opacity: 0;
            transform: translateX(20px) skew(-10deg);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
            box-shadow: 5px 5px 0px var(--mod04-black);
            white-space: nowrap;
        }
        .mod04-trigger-btn.visible {
            opacity: 1;
            transform: translateX(0) skew(-10deg);
            pointer-events: auto;
        }
        .mod04-trigger-btn:hover {
            background: var(--mod04-black);
            color: var(--mod04-energy);
            box-shadow: -2px -2px 0px var(--mod04-red);
        }
        .mod04-trigger-btn i { margin-right: 5px; }

        /* 全屏容器 */
        .mod04-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(10, 10, 10, 0.95);
            z-index: 100000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
        }
        .mod04-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        /* ThreeJS 背景层 */
        #mod04-canvas-bg {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 0;
            opacity: 0.4;
            pointer-events: none;
        }

        /* 主界面框架 */
        .mod04-container {
            position: relative;
            width: 90%;
            height: 90%;
            max-width: 1400px;
            background:
                linear-gradient(135deg, transparent 20px, var(--mod04-cream) 20px, var(--mod04-cream) calc(100% - 20px), transparent calc(100% - 20px)),
                repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 10px);
            z-index: 1;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 50px rgba(0,0,0,0.8);
            border: 4px solid var(--mod04-black);
            overflow: hidden;
        }

        /* 顶部栏 */
        .mod04-header {
            height: 80px;
            background: var(--mod04-red);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 30px;
            border-bottom: 4px solid var(--mod04-black);
            clip-path: polygon(0 0, 100% 0, 100% 85%, 98% 100%, 0 100%);
        }
        .mod04-title {
            font-family: var(--mod04-font);
            font-size: 42px;
            color: var(--mod04-cream);
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 3px 3px 0 var(--mod04-black);
            transform: skew(-10deg);
        }
        .mod04-close {
            font-size: 32px;
            color: var(--mod04-black);
            cursor: pointer;
            transition: transform 0.2s;
            font-weight: bold;
        }
        .mod04-close:hover { transform: rotate(90deg) scale(1.2); color: var(--mod04-cream); }

        /* 导航 Tabs */
        .mod04-tabs {
            display: flex;
            background: var(--mod04-black);
            padding-left: 20px;
        }
        .mod04-tab {
            padding: 15px 40px;
            background: var(--mod04-grey);
            color: #888;
            font-family: var(--mod04-font);
            font-size: 20px;
            cursor: pointer;
            margin-right: 5px;
            clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%);
            transition: all 0.3s;
            text-transform: uppercase;
        }
        .mod04-tab.active {
            background: var(--mod04-cream);
            color: var(--mod04-red);
            transform: translateY(-5px);
        }
        .mod04-tab:hover:not(.active) {
            background: var(--mod04-energy);
            color: var(--mod04-black);
        }

        /* 内容区域 */
        .mod04-content {
            flex: 1;
            display: flex;
            overflow: hidden;
            position: relative;
        }

        /* 左侧列表 (Grid) */
        .mod04-grid-wrapper {
            flex: 2;
            padding: 20px;
            overflow-y: auto;
            background: rgba(255,255,255,0.05);
        }
        .mod04-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 15px;
            padding-bottom: 60px; /* Space for pagination */
        }

        /* 物品卡片 */
        .mod04-card {
            background: #fff;
            border: 3px solid var(--mod04-black);
            height: 200px;
            position: relative;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .mod04-card:hover {
            transform: translate(-5px, -5px);
            box-shadow: 8px 8px 0 var(--mod04-red);
            border-color: var(--mod04-energy);
        }
        .mod04-card-header {
            background: var(--mod04-black);
            color: var(--mod04-cream);
            padding: 5px;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            font-weight: bold;
        }
        .mod04-card-icon {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 48px;
            color: var(--mod04-dark-red);
            background: radial-gradient(circle, rgba(0,0,0,0.1) 0%, transparent 70%);
        }
        .mod04-card-name {
            padding: 8px;
            text-align: center;
            font-weight: bold;
            border-top: 2px solid var(--mod04-black);
            background: var(--mod04-cream);
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
             color: var(--mod04-black);
        }
        /* 标签 */
        .mod04-tag {
            position: absolute;
            top: 30px; right: -25px;
            background: var(--mod04-energy);
            color: var(--mod04-black);
            padding: 2px 30px;
            transform: rotate(45deg);
            font-size: 10px;
            font-weight: bold;
            border: 1px solid var(--mod04-black);
            z-index: 2;
        }
        .mod04-num-badge {
            position: absolute;
            bottom: 40px; right: 5px;
            background: var(--mod04-black);
            color: var(--mod04-energy);
            padding: 2px 6px;
            font-family: monospace;
            font-weight: bold;
            border: 1px solid var(--mod04-energy);
        }

        /* 右侧详情面板 (Drawer) */
        .mod04-detail-panel {
            flex: 1;
            min-width: 300px;
            background: var(--mod04-black);
            color: var(--mod04-cream);
            border-left: 4px solid var(--mod04-red);
            padding: 30px;
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            position: absolute;
            right: 0; top: 0; bottom: 0;
            z-index: 10;
            box-shadow: -10px 0 30px rgba(0,0,0,0.5);
              overflow-y: auto; /* 添加这一行 */
    overflow-x: hidden; /* 添加这一行 */
        }
        .mod04-detail-panel.open {
            transform: translateX(0);
            position: relative; /* PC端挤压布局，移动端覆盖 */
        }

        /* 详情内容美化 */
        .mod04-detail-title {
            font-family: var(--mod04-font);
            font-size: 32px;
            color: var(--mod04-energy);
            border-bottom: 2px dashed var(--mod04-red);
            padding-bottom: 10px;
            margin-bottom: 20px;
            word-break: break-all;
        }
        .mod04-detail-row {
            margin-bottom: 15px;
            font-size: 14px;
            line-height: 1.6;
        }
        .mod04-label {
            color: var(--mod04-red);
            font-weight: bold;
            text-transform: uppercase;
            margin-right: 8px;
            background: var(--mod04-cream);
            padding: 2px 5px;
        }
        .mod04-effect-text {
            color: #ddd;
            font-family: monospace;
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-left: 3px solid var(--mod04-energy);
            margin-top: 5px;
            display: block;
        }
        .mod04-highlight { color: var(--mod04-energy); font-weight: bold; }
        .mod04-highlight-neg { color: #ff4d4d; font-weight: bold; }

        /* 幽默评论印章 */
        .mod04-stamp {
            margin-top: auto;
            border: 3px double var(--mod04-red);
            color: var(--mod04-red);
            padding: 10px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            transform: rotate(-5deg);
            opacity: 0.8;
            text-align: center;
            font-size: 18px;
            background: rgba(211, 47, 47, 0.1);
        }

        /* 分页控件 */
        .mod04-pagination {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 50px;
            background: var(--mod04-cream);
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 3px solid var(--mod04-black);
        }
        .mod04-page-btn {
            background: var(--mod04-black);
            color: var(--mod04-cream);
            border: none;
            padding: 5px 15px;
            margin: 0 10px;
            cursor: pointer;
            font-weight: bold;
        }
        .mod04-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .mod04-page-info { font-weight: bold; color: var(--mod04-black); }
/* 移动端适配 */
@media (max-width: 768px) {
    .mod04-container { width: 100%; height: 100%; border: none; }
    .mod04-detail-panel {
        position: absolute;
        width: 100%;
        border-left: none;
        border-top: 4px solid var(--mod04-red);
        max-height: 100%; /* 添加 */
    }
    .mod04-title { font-size: 24px; }
    .mod04-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
    
    /* 确保移动端详情面板可滚动 */
    .mod04-detail-panel.open {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
    }
}
    `;

    // ==========================================================================
    // 2. 数据处理逻辑 (Data Logic)
    // ==========================================================================
    const DataManager = {
        // 获取原始数据
        getRawData: () => {
            try {
                return window.GameAPI.assaData.global_lore || {};
            } catch (e) {
                console.warn("Mod04: GameAPI data not found, using mock.");
                return { "背包": {}, "其他技能": {} };
            }
        },

        // 规范化单个条目
        normalize: (key, raw, category) => {
            // 兼容嵌套：如果raw是字符串，尝试parse
            let data = raw;
            if (typeof raw === 'string') {
                try { data = JSON.parse(raw); } catch(e) { data = { info: raw }; }
            }

            // 基础结构
            const item = {
                id: key + Math.random().toString(36).substr(2, 5),
                name: key,
                category: category, // 'item' or 'skill'
                info: data.info || data.desc || "暂无描述 / NO DATA",
                effect: data.effect || data.效果 || "",
                type: data.type || data.种类 || (category === 'skill' ? '技能' : '杂物'),
                quality: data.quality || data.品质 || 'N/A',
                num: data.num || data.数量 || (category === 'skill' ? null : 1),
                level: data.level || data.等级 || null,
                icon: data.icon || null,
                comment: data.comment || data.备注 || null,
                raw: data // 保留原始数据以防万一
            };

            // 图标处理逻辑
            if (!item.icon) {
                // 如果没有图标，使用名字第一个字
                item.iconType = 'text';
                item.iconContent = item.name.charAt(0);
            } else if (item.icon.startsWith('fa-')) {
                item.iconType = 'font-awesome';
                item.iconContent = item.icon;
            } else {
                // 假设是Emoji或图片URL(暂不支持img标签，假设是Emoji)
                item.iconType = 'emoji';
                item.iconContent = item.icon;
            }

            return item;
        },

        // 获取列表
        getList: (category) => {
            const rawData = DataManager.getRawData();
            const source = category === 'item' ? (rawData['背包'] || {}) : (rawData['其他技能'] || {});
            return Object.keys(source).map(key => DataManager.normalize(key, source[key], category));
        }
    };

    // ==========================================================================
    // 3. UI 构建与渲染 (UI Builder)
    // ==========================================================================
    const UI = {
        state: {
            isOpen: false,
            currentTab: 'item', // 'item' or 'skill'
            currentPage: 1,
            itemsPerPage: 20,
            selectedItem: null,
            dataList: []
        },

        init: () => {
            // 注入CSS
            const styleEl = document.createElement('style');
            styleEl.textContent = cssStyles;
            document.head.appendChild(styleEl);

            // 创建DOM结构
            UI.createOverlay();
            UI.createTrigger();

            // 绑定事件
            UI.bindEvents();
        },

        createTrigger: () => {
            const btn = document.createElement('div');
            btn.className = 'mod04-trigger-btn';
            btn.innerHTML = '<i class="fas fa-box-open"></i> 物资/技能';
            document.body.appendChild(btn);
            UI.els.trigger = btn;
        },

        createOverlay: () => {
            const overlay = document.createElement('div');
            overlay.className = 'mod04-overlay';
            overlay.innerHTML = `
                <canvas id="mod04-canvas-bg"></canvas>
                <div class="mod04-container">
                    <div class="mod04-header">
                        <div class="mod04-title">STATE INVENTORY</div>
                        <div class="mod04-close">✕</div>
                    </div>
                    <div class="mod04-tabs">
                        <div class="mod04-tab active" data-tab="item">SUPPLIES (物资)</div>
                        <div class="mod04-tab" data-tab="skill">ABILITIES (能力)</div>
                    </div>
                    <div class="mod04-content">
                        <div class="mod04-grid-wrapper">
                            <div class="mod04-grid" id="mod04-grid-container"></div>
                        </div>
                        <div class="mod04-detail-panel" id="mod04-detail-panel">
                            <div style="margin:auto; opacity:0.5; text-align:center;">
                                <i class="fas fa-hand-pointer" style="font-size:40px; margin-bottom:10px;"></i><br>
                                SELECT AN ITEM<br>选择项目以查看详情
                            </div>
                        </div>
                    </div>
                    <div class="mod04-pagination">
                        <button class="mod04-page-btn" id="mod04-prev">PREV</button>
                        <span class="mod04-page-info" id="mod04-page-num">1 / 1</span>
                        <button class="mod04-page-btn" id="mod04-next">NEXT</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            UI.els = {
                overlay: overlay,
                grid: overlay.querySelector('#mod04-grid-container'),
                detail: overlay.querySelector('#mod04-detail-panel'),
                tabs: overlay.querySelectorAll('.mod04-tab'),
                prevBtn: overlay.querySelector('#mod04-prev'),
                nextBtn: overlay.querySelector('#mod04-next'),
                pageNum: overlay.querySelector('#mod04-page-num'),
                closeBtn: overlay.querySelector('.mod04-close'),
                title: overlay.querySelector('.mod04-title')
            };
        },

        renderGrid: () => {
            const { dataList, currentPage, itemsPerPage } = UI.state;
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageItems = dataList.slice(start, end);
            const totalPages = Math.ceil(dataList.length / itemsPerPage) || 1;

            UI.els.grid.innerHTML = '';

            pageItems.forEach(item => {
                const card = document.createElement('div');
                card.className = 'mod04-card';

                // Icon rendering
                let iconHtml = '';
                if (item.iconType === 'font-awesome') iconHtml = `<i class="${item.iconContent}"></i>`;
                else iconHtml = item.iconContent;

                // Quality Tag (if exists)
                const qualityTag = item.quality !== 'N/A' ? `<div class="mod04-tag">${item.quality}</div>` : '';

                // Num Badge
                const numBadge = item.num ? `<div class="mod04-num-badge">x${item.num}</div>` : '';
                const levelBadge = item.level ? `<div class="mod04-num-badge">Lv.${item.level}</div>` : '';

                card.innerHTML = `
                    <div class="mod04-card-header">
                        <span>${item.type}</span>
                        <span>#${start + dataList.indexOf(item) + 1}</span>
                    </div>
                    ${qualityTag}
                    <div class="mod04-card-icon">${iconHtml}</div>
                    <div class="mod04-card-name">${item.name}</div>
                    ${numBadge}
                    ${levelBadge}
                `;

                card.onclick = () => UI.showDetail(item);
                UI.els.grid.appendChild(card);
            });

            // Update Pagination UI
            UI.els.pageNum.textContent = `${currentPage} / ${totalPages}`;
            UI.els.prevBtn.disabled = currentPage === 1;
            UI.els.nextBtn.disabled = currentPage === totalPages;
        },

        // 详情页渲染与美化
        showDetail: (item) => {
            const panel = UI.els.detail;
            panel.classList.add('open');

            // 效果文本高亮处理
            let effectHtml = item.effect;
            // 匹配 【...】
            effectHtml = effectHtml.replace(/【(.*?)】/g, (match, content) => {
                // 内部数字高亮
                const inner = content.replace(/([+-]?\d+%?)/g, '<span class="mod04-highlight">$1</span>');
                return `【${inner}】`;
            });

            // 评论彩蛋
            const commentHtml = item.comment ?
                `<div class="mod04-stamp">${item.comment}</div>` : '';

            let iconDisplay = item.iconType === 'font-awesome' ? `<i class="${item.iconContent}"></i>` : item.iconContent;

            panel.innerHTML = `
                <div class="mod04-detail-title">
                    <span style="font-size:0.6em; display:block; color:#888;">${item.id}</span>
                    ${item.name}
                </div>

                <div class="mod04-detail-row" style="display:flex; align-items:center; gap:10px;">
                    <div style="font-size:40px; color:var(--mod04-energy); border:1px solid var(--mod04-red); width:60px; height:60px; display:flex; justify-content:center; align-items:center;">
                        ${iconDisplay}
                    </div>
                    <div>
                        <div><span class="mod04-label">种类</span> ${item.type}</div>
                        <div><span class="mod04-label">品质</span> ${item.quality}</div>
                    </div>
                </div>

                <div class="mod04-detail-row">
                    <span class="mod04-label">简介</span><br>
                    <div style="margin-top:5px; color:#ccc;">${item.info}</div>
                </div>

                ${item.effect ? `
                <div class="mod04-detail-row">
                    <span class="mod04-label">效果</span>
                    <span class="mod04-effect-text">${effectHtml}</span>
                </div>` : ''}

                ${item.level ? `<div class="mod04-detail-row"><span class="mod04-label">等级</span> ${item.level}</div>` : ''}
                ${item.num ? `<div class="mod04-detail-row"><span class="mod04-label">数量</span> ${item.num}</div>` : ''}

                ${commentHtml}

                <div style="margin-top:20px; text-align:right;">
                    <button onclick="document.getElementById('mod04-detail-panel').classList.remove('open')" style="background:transparent; border:1px solid var(--mod04-red); color:var(--mod04-red); padding:5px 10px; cursor:pointer;">CLOSE DETAIL</button>
                </div>
            `;
        },

        loadData: (tab) => {
            UI.state.currentTab = tab;
            UI.state.currentPage = 1;
            UI.state.dataList = DataManager.getList(tab);
            UI.els.title.textContent = tab === 'item' ? 'STATE INVENTORY' : 'COMBAT ABILITIES';
            UI.renderGrid();
            UI.els.detail.classList.remove('open'); // Close detail on tab switch
        },

        bindEvents: () => {
            // 1. Trigger Logic (Orb Interaction)
            const orb = document.getElementById('page-character-orb');
            const trigger = UI.els.trigger;

            if (orb) {
                const updatePos = () => {
                    const rect = orb.getBoundingClientRect();
                    // 按钮显示在球体左侧
                    trigger.style.top = (rect.top + window.scrollY + 20) + 'px';
                    trigger.style.left = (rect.left + window.scrollX - 140) + 'px';
                };

                // PC Hover
                orb.addEventListener('mouseenter', () => {
                    updatePos();
                    trigger.classList.add('visible');
                });
                orb.addEventListener('mouseleave', (e) => {
                    // 给予一点延迟，允许鼠标移动到按钮上
                    setTimeout(() => {
                        if (!trigger.matches(':hover')) trigger.classList.remove('visible');
                    }, 100);
                });
                trigger.addEventListener('mouseleave', () => trigger.classList.remove('visible'));

                // Mobile Long Press & Slide
                let touchTimer;
                orb.addEventListener('touchstart', () => {
                    touchTimer = setTimeout(() => {
                        updatePos();
                        trigger.classList.add('visible');
                    }, 500); // 长按500ms
                });
                orb.addEventListener('touchend', () => clearTimeout(touchTimer));
            }

            // Open Modal
            trigger.addEventListener('click', () => {
                UI.state.isOpen = true;
                UI.els.overlay.classList.add('active');
                UI.loadData('item');
                ThreeBg.animate(); // Start 3D animation
            });

            // Close Modal
            UI.els.closeBtn.addEventListener('click', () => {
                UI.state.isOpen = false;
                UI.els.overlay.classList.remove('active');
                ThreeBg.stop();
            });

            // Tabs
            UI.els.tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    UI.els.tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    UI.loadData(tab.dataset.tab);
                });
            });

            // Pagination
            UI.els.prevBtn.addEventListener('click', () => {
                if (UI.state.currentPage > 1) {
                    UI.state.currentPage--;
                    UI.renderGrid();
                }
            });
            UI.els.nextBtn.addEventListener('click', () => {
                const maxPage = Math.ceil(UI.state.dataList.length / UI.state.itemsPerPage);
                if (UI.state.currentPage < maxPage) {
                    UI.state.currentPage++;
                    UI.renderGrid();
                }
            });
        }
    };

    // ==========================================================================
    // 4. Three.js 背景特效 (3D Visuals)
    // ==========================================================================
    const ThreeBg = {
        scene: null, camera: null, renderer: null, mesh: null, frameId: null,
        init: () => {
            if (!window.THREE) return;
            const canvas = document.getElementById('mod04-canvas-bg');
            if (!canvas) return;

            const width = window.innerWidth;
            const height = window.innerHeight;

            ThreeBg.scene = new THREE.Scene();
            ThreeBg.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            ThreeBg.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
            ThreeBg.renderer.setSize(width, height);

            // 创建一个“苏维埃之星”或工业齿轮风格的几何体
            const geometry = new THREE.IcosahedronGeometry(10, 1);
            const material = new THREE.MeshBasicMaterial({
                color: 0xD32F2F,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            ThreeBg.mesh = new THREE.Mesh(geometry, material);
            ThreeBg.scene.add(ThreeBg.mesh);

            // 添加一些粒子
            const particlesGeo = new THREE.BufferGeometry();
            const particlesCount = 200;
            const posArray = new Float32Array(particlesCount * 3);
            for(let i=0; i<particlesCount*3; i++) {
                posArray[i] = (Math.random() - 0.5) * 50;
            }
            particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const particlesMat = new THREE.PointsMaterial({ size: 0.1, color: 0x00faff });
            const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
            ThreeBg.scene.add(particlesMesh);

            ThreeBg.camera.position.z = 20;

            window.addEventListener('resize', () => {
                if (!UI.state.isOpen) return;
                const w = window.innerWidth;
                const h = window.innerHeight;
                ThreeBg.renderer.setSize(w, h);
                ThreeBg.camera.aspect = w / h;
                ThreeBg.camera.updateProjectionMatrix();
            });
        },
        animate: () => {
            if (!ThreeBg.scene) ThreeBg.init();
            if (!ThreeBg.scene) return; // Still failed?

            ThreeBg.mesh.rotation.x += 0.002;
            ThreeBg.mesh.rotation.y += 0.002;
            ThreeBg.renderer.render(ThreeBg.scene, ThreeBg.camera);
            ThreeBg.frameId = requestAnimationFrame(ThreeBg.animate);
        },
        stop: () => {
            if (ThreeBg.frameId) cancelAnimationFrame(ThreeBg.frameId);
        }
    };

    // ==========================================================================
    // 5. 启动脚本 (Bootstrap)
    // ==========================================================================
    Promise.all([
        loadResource('css', RESOURCES.fontAwesome),
        loadResource('js', RESOURCES.threeJS)
    ]).then(() => {
        console.log("Mod04: Resources loaded. Initializing UI...");
        // 确保DOM加载完毕
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', UI.init);
        } else {
            UI.init();
        }
    }).catch(err => {
        console.error("Mod04: Failed to load resources", err);
        // 即使资源加载失败，也尝试加载UI（降级体验）
        UI.init();
    });

})();
