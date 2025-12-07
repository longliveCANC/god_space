(function () {
    'use strict';

    // ==========================================================================
    // 1. 资源加载与基础配置
    // ==========================================================================

    // 引入 FontAwesome (unpkg源)
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://unpkg.com/@fortawesome/fontawesome-free@6.4.0/css/all.min.css';
        document.head.appendChild(faLink);
    }

    // 字段汉化映射
    const KEY_MAP = {
        'info': '简介',
        'effect': '效果',
        'type': '类型',
        'quality': '品质',
        'num': '数量',
        'level': '等级',
        'name': '名称'
    };

    // ==========================================================================
    // 2. CSS 样式 (Mod04 Pokedex Theme)
    // ==========================================================================
    const css = `
        :root {
            --mod04-primary: #ffcb05; /* 皮卡丘黄 */
            --mod04-dex-red: #dc0a2d; /* 图鉴红 */
            --mod04-dex-dark: #8b0000; /* 深红 */
            --mod04-screen-bg: #232323; /* 屏幕黑 */
            --mod04-screen-blue: #51adcf; /* 屏幕蓝 */
            --mod04-text-green: #4caf50;
            --mod04-font: "Consolas", "Monaco", "Courier New", monospace;
            --mod04-glass: rgba(255, 255, 255, 0.1);
        }

        /* 快速入口按钮 */
        .mod04-quick-btn {
            position: fixed;
            padding: 8px 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid var(--mod04-primary);
            border-right: 6px solid var(--mod04-primary);
            color: var(--mod04-primary);
            font-family: var(--mod04-font);
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 1px;
            cursor: pointer;
            z-index: 9;
            opacity: 0;
            transform: translateX(-20px);
            transition: opacity 0.3s, transform 0.3s;
            pointer-events: none;
            clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%);
            box-shadow: -5px 0 15px rgba(255, 203, 5, 0.3);
            white-space: nowrap;
        }
        .mod04-quick-btn.visible {
            opacity: 1;
            transform: translateX(0);
            pointer-events: auto;
        }
        .mod04-quick-btn:hover {
            background: var(--mod04-primary);
            color: #000;
            box-shadow: 0 0 20px var(--mod04-primary);
        }

        /* 全屏容器 */
        .mod04-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.85);
            z-index: 100000;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        .mod04-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        /* 图鉴主体 */
        .mod04-pokedex {
            width: 90%;
            max-width: 1000px;
            height: 85vh;
            background: var(--mod04-dex-red);
            border-radius: 15px;
            box-shadow:
                inset 0 0 20px rgba(0,0,0,0.5),
                0 10px 30px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
            border: 4px solid #000;
        }

        /* 顶部装饰 */
        .mod04-dex-header {
            height: 60px;
            background: var(--mod04-dex-red);
            border-bottom: 4px solid #000;
            display: flex;
            align-items: center;
            padding: 0 20px;
            box-shadow: 0 5px 5px rgba(0,0,0,0.2);
            position: relative;
        }
        .mod04-lens-big {
            width: 40px;
            height: 40px;
            background: radial-gradient(circle at 30% 30%, #44d0ff, #005f8c);
            border-radius: 50%;
            border: 3px solid #fff;
            box-shadow: 0 0 10px #44d0ff;
            margin-right: 15px;
        }
        .mod04-lens-small {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 1px solid #000;
            margin-right: 5px;
        }
        .mod04-lens-red { background: #ff0000; }
        .mod04-lens-yellow { background: #ffff00; }
        .mod04-lens-green { background: #00ff00; }

        .mod04-close-btn {
            margin-left: auto;
            background: #000;
            color: #fff;
            border: none;
            width: 30px;
            height: 30px;
            font-weight: bold;
            cursor: pointer;
            clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
        }
        .mod04-close-btn:hover { background: #444; }

        /* 内容区域 */
        .mod04-dex-body {
            flex: 1;
            display: flex;
            padding: 20px;
            gap: 20px;
            overflow: hidden;
        }

        /* 左侧列表区 */
        .mod04-list-container {
            flex: 1;
            background: var(--mod04-screen-bg);
            border-radius: 10px 10px 10px 30px;
            border: 4px solid #000;
            display: flex;
            flex-direction: column;
            padding: 15px;
            position: relative;
        }

        /* 标签切换 */
        .mod04-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        .mod04-tab {
            flex: 1;
            padding: 8px;
            background: #444;
            color: #888;
            text-align: center;
            cursor: pointer;
            font-family: var(--mod04-font);
            font-weight: bold;
            border: 2px solid #000;
            clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%);
            transition: all 0.2s;
        }
        .mod04-tab.active {
            background: var(--mod04-screen-blue);
            color: #000;
            box-shadow: 0 0 10px var(--mod04-screen-blue);
        }

        /* 物品网格 */
        .mod04-grid {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            grid-auto-rows: 100px;
            gap: 10px;
            overflow-y: auto;
            padding-right: 5px;
        }
        .mod04-grid::-webkit-scrollbar { width: 6px; }
        .mod04-grid::-webkit-scrollbar-thumb { background: var(--mod04-dex-red); border-radius: 3px; }

        .mod04-item-card {
            background: #333;
            border: 2px solid #555;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            transition: transform 0.2s, border-color 0.2s;
        }
        .mod04-item-card:hover {
            transform: scale(1.05);
            border-color: var(--mod04-primary);
            box-shadow: 0 0 10px rgba(255, 203, 5, 0.3);
        }
        .mod04-item-icon {
            font-size: 32px;
            margin-bottom: 5px;
            color: #fff;
        }
        .mod04-item-name {
            font-size: 10px;
            color: #ccc;
            text-align: center;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0 4px;
            font-family: var(--mod04-font);
        }
        .mod04-item-badge {
            position: absolute;
            top: 2px;
            right: 2px;
            background: var(--mod04-dex-red);
            color: white;
            font-size: 9px;
            padding: 1px 4px;
            border-radius: 4px;
        }

        /* 分页控件 */
        .mod04-pagination {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            align-items: center;
        }
        .mod04-page-btn {
            background: #000;
            color: var(--mod04-primary);
            border: 1px solid var(--mod04-primary);
            padding: 5px 15px;
            cursor: pointer;
            font-family: var(--mod04-font);
        }
        .mod04-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        /* 详情弹窗 (内部) */
        .mod04-detail-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            z-index: 10;
            display: flex;
            justify-content: flex-end; /* 右侧滑出 */
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        .mod04-detail-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .mod04-detail-panel {
            width: 400px;
            max-width: 90%;
            height: 100%;
            background: #f0f0f0;
            border-left: 5px solid #000;
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: -10px 0 30px rgba(0,0,0,0.5);
        }
        .mod04-detail-overlay.active .mod04-detail-panel {
            transform: translateX(0);
        }

        .mod04-detail-header {
            background: var(--mod04-dex-dark);
            color: white;
            padding: 15px;
            display: flex;
            align-items: center;
            border-bottom: 4px solid var(--mod04-primary);
        }
        .mod04-detail-title {
            font-size: 18px;
            font-weight: bold;
            font-family: var(--mod04-font);
            flex: 1;
        }
        .mod04-detail-close {
            background: transparent;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
        }

        .mod04-detail-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto; /* 关键：支持滑动 */
            font-family: var(--mod04-font);
            background:
                linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%),
                linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 2px, 3px 100%;
        }

        /* 详情字段美化 */
        .mod04-field-group {
            margin-bottom: 15px;
            border-bottom: 1px dashed #ccc;
            padding-bottom: 10px;
        }
        .mod04-label {
            display: inline-block;
            background: #333;
            color: #fff;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            margin-right: 8px;
            margin-bottom: 4px;
        }
        .mod04-value {
            color: #333;
            font-size: 14px;
            line-height: 1.5;
            word-break: break-all;
        }

        /* 特殊标签 */
        .mod04-tag {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            margin-right: 5px;
            border: 1px solid #000;
        }
        .mod04-tag-quality { background: #ffd700; color: #000; }
        .mod04-tag-type { background: #87ceeb; color: #000; }
        .mod04-tag-num { background: #ff6b6b; color: #fff; }

        /* Effect 高亮 */
        .mod04-effect-highlight {
            color: #d32f2f;
            font-weight: bold;
            background: rgba(211, 47, 47, 0.1);
            padding: 0 4px;
            border-radius: 3px;
        }

        /* 彩蛋 Comment */
        .mod04-comment {
            margin-top: 20px;
            background: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 10px;
            border-radius: 5px;
            font-style: italic;
            position: relative;
        }
        .mod04-comment::before {
            content: "💡";
            margin-right: 5px;
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            .mod04-pokedex {
                width: 100%;
                height: 100%;
                border-radius: 0;
                border: none;
            }
            .mod04-detail-panel {
                width: 100%;
                border-left: none;
            }
            .mod04-grid {
                grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
            }
        }
    `;

    // ==========================================================================
    // 3. 核心逻辑类
    // ==========================================================================
    class PokedexMod {
        constructor() {
            this.isOpen = false;
            this.currentTab = '背包'; // '背包' or '其他技能'
            this.currentPage = 1;
            this.itemsPerPage = 20;
            this.dataList = [];

            this.init();
        }

        init() {
            this.injectStyles();
            this.createDOM();
            this.bindTrigger();
            console.log('Mod04 Pokedex Loaded.');
        }

        injectStyles() {
            const styleEl = document.createElement('style');
            styleEl.textContent = css;
            document.head.appendChild(styleEl);
        }

        // 获取数据 (兼容性处理)
        getData() {
            try {
                // 尝试从 GameAPI 获取，如果不存在则尝试直接访问全局变量
                const apiData = window.GameAPI && window.GameAPI.assaData;
                const rawData = apiData ? apiData : (window.assaData || {});
                return rawData.global_lore || {};
            } catch (e) {
                console.error('Mod04: Failed to load data', e);
                return {};
            }
        }

        createDOM() {
            // 1. 快速入口按钮
            this.triggerBtn = document.createElement('div');
            this.triggerBtn.className = 'mod04-quick-btn';
            this.triggerBtn.innerHTML = '<i class="fas fa-microchip"></i> DATA LINK';
            document.body.appendChild(this.triggerBtn);

            // 2. 主界面
            const overlay = document.createElement('div');
            overlay.className = 'mod04-overlay';
            overlay.innerHTML = `
                <div class="mod04-pokedex">
                    <div class="mod04-dex-header">
                        <div class="mod04-lens-big"></div>
                        <div class="mod04-lens-small mod04-lens-red"></div>
                        <div class="mod04-lens-small mod04-lens-yellow"></div>
                        <div class="mod04-lens-small mod04-lens-green"></div>
                        <div style="font-family:var(--mod04-font); font-weight:bold; margin-left:10px; color:#fff; text-shadow:1px 1px 0 #000;">POKÉDEX OS v4.0</div>
                        <button class="mod04-close-btn">X</button>
                    </div>
                    <div class="mod04-dex-body">
                        <div class="mod04-list-container">
                            <div class="mod04-tabs">
                                <div class="mod04-tab active" data-type="背包">ITEMS</div>
                                <div class="mod04-tab" data-type="其他技能">SKILLS</div>
                            </div>
                            <div class="mod04-grid" id="mod04-grid-area"></div>
                            <div class="mod04-pagination">
                                <button class="mod04-page-btn" id="mod04-prev">PREV</button>
                                <span id="mod04-page-info" style="color:var(--mod04-primary); font-family:var(--mod04-font)">1 / 1</span>
                                <button class="mod04-page-btn" id="mod04-next">NEXT</button>
                            </div>
                        </div>
                    </div>

                    <!-- 详情抽屉 -->
                    <div class="mod04-detail-overlay">
                        <div class="mod04-detail-panel">
                            <div class="mod04-detail-header">
                                <div class="mod04-detail-title">Unknown</div>
                                <button class="mod04-detail-close"><i class="fas fa-times"></i></button>
                            </div>
                            <div class="mod04-detail-content"></div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
            this.overlay = overlay;
            this.gridArea = overlay.querySelector('#mod04-grid-area');
            this.detailOverlay = overlay.querySelector('.mod04-detail-overlay');
            this.detailContent = overlay.querySelector('.mod04-detail-content');
            this.detailTitle = overlay.querySelector('.mod04-detail-title');

            // 绑定内部事件
            this.bindUIEvents();
        }

        bindTrigger() {
            const getOrb = () => document.getElementById('page-character-orb');
            let timer = null;

            // 辅助：定位按钮
            const positionBtn = (orb) => {
                const rect = orb.getBoundingClientRect();
                // 按钮在 Orb 左侧，垂直居中
                this.triggerBtn.style.top = (rect.top + rect.height / 2 - 20) + 'px';
                this.triggerBtn.style.left = (rect.left - 140) + 'px'; // 假设按钮宽约120px
                this.triggerBtn.classList.add('visible');
            };

            const hideBtn = () => {
                this.triggerBtn.classList.remove('visible');
            };

            // 轮询绑定 Orb (因为 Orb 可能是动态生成的)
            const checkOrb = setInterval(() => {
                const orb = getOrb();
                if (orb && !orb.dataset.mod04Bound) {
                    orb.dataset.mod04Bound = "true";

                    // PC: Hover
                    orb.addEventListener('mouseenter', () => positionBtn(orb));
                    orb.addEventListener('mouseleave', (e) => {
                        // 如果移向了按钮，不隐藏
                        setTimeout(() => {
                            if (!this.triggerBtn.matches(':hover')) hideBtn();
                        }, 100);
                    });

                    // 按钮本身的 Hover 保持显示
                    this.triggerBtn.addEventListener('mouseenter', () => this.triggerBtn.classList.add('visible'));
                    this.triggerBtn.addEventListener('mouseleave', hideBtn);

                    // Mobile: Long Press
                    let pressTimer;
                    orb.addEventListener('touchstart', (e) => {
                        pressTimer = setTimeout(() => {
                            positionBtn(orb);
                        }, 600); // 600ms 长按
                    }, {passive: true});

                    orb.addEventListener('touchend', () => clearTimeout(pressTimer));
                    orb.addEventListener('touchmove', () => clearTimeout(pressTimer));
                }
            }, 1000);

            // 点击按钮打开界面
            this.triggerBtn.addEventListener('click', () => this.open());
        }

        bindUIEvents() {
            // 关闭主界面
            this.overlay.querySelector('.mod04-close-btn').addEventListener('click', () => this.close());

            // 切换 Tab
            const tabs = this.overlay.querySelectorAll('.mod04-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    this.currentTab = tab.dataset.type;
                    this.currentPage = 1;
                    this.refreshList();
                });
            });

            // 分页
            this.overlay.querySelector('#mod04-prev').addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderGrid();
                }
            });
            this.overlay.querySelector('#mod04-next').addEventListener('click', () => {
                const maxPage = Math.ceil(this.dataList.length / this.itemsPerPage);
                if (this.currentPage < maxPage) {
                    this.currentPage++;
                    this.renderGrid();
                }
            });

            // 关闭详情页 (点击遮罩或关闭按钮)
            this.detailOverlay.addEventListener('click', (e) => {
                if (e.target === this.detailOverlay) this.closeDetail();
            });
            this.overlay.querySelector('.mod04-detail-close').addEventListener('click', () => this.closeDetail());
        }

        open() {
            this.isOpen = true;
            this.overlay.classList.add('active');
            this.refreshList();
        }

        close() {
            this.isOpen = false;
            this.overlay.classList.remove('active');
            this.closeDetail();
        }

        // 刷新数据列表
        refreshList() {
            const lore = this.getData();
            const rawObj = lore[this.currentTab] || {};

            // 转换为数组并过滤
            this.dataList = Object.entries(rawObj)
                .filter(([key, val]) => !key.startsWith('_')) // 过滤 _ 开头
                .map(([key, val]) => {
                    // 兼容：如果 val 是字符串，尝试转对象，或者包装成对象
                    let itemData = val;
                    if (typeof val !== 'object') {
                        itemData = { info: val };
                    }
                    // 确保有 name
                    itemData.name = itemData.name || key;
                    return itemData;
                });

            this.renderGrid();
        }

        // 渲染网格
        renderGrid() {
            this.gridArea.innerHTML = '';
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            const pageData = this.dataList.slice(start, end);
            const maxPage = Math.ceil(this.dataList.length / this.itemsPerPage) || 1;

            // 更新分页信息
            this.overlay.querySelector('#mod04-page-info').textContent = `${this.currentPage} / ${maxPage}`;
            this.overlay.querySelector('#mod04-prev').disabled = this.currentPage === 1;
            this.overlay.querySelector('#mod04-next').disabled = this.currentPage >= maxPage;

            pageData.forEach(item => {
                const card = document.createElement('div');
                card.className = 'mod04-item-card';

                // 图标处理
                const iconHtml = this.getIconHtml(item);

                // 数量角标
                let badge = '';
                if (item.num || item.数量) {
                    badge = `<div class="mod04-item-badge">${item.num || item.数量}</div>`;
                }

                card.innerHTML = `
                    <div class="mod04-item-icon">${iconHtml}</div>
                    <div class="mod04-item-name">${item.name}</div>
                    ${badge}
                `;

                card.addEventListener('click', () => this.openDetail(item));
                this.gridArea.appendChild(card);
            });
        }

        // 获取图标 HTML
        getIconHtml(item) {
            const icon = item.icon;
            if (icon) {
                if (icon.startsWith('fa-')) {
                    return `<i class="fas ${icon}"></i>`;
                } else {
                    // 可能是 emoji 或其他字符
                    return `<span>${icon}</span>`;
                }
            }
            // 默认取名字第一个字
            return `<span>${item.name.charAt(0)}</span>`;
        }

        // 打开详情
        openDetail(item) {
            this.detailTitle.textContent = item.name;
            this.detailContent.innerHTML = ''; // 清空

            // 递归渲染内容
            this.renderDetailContent(item, this.detailContent);

            this.detailOverlay.classList.add('active');
        }

        closeDetail() {
            this.detailOverlay.classList.remove('active');
        }

        // 递归渲染详情内容
        renderDetailContent(data, container) {
            // 预定义顺序
            const priorityKeys = ['info', '简介', 'effect', '效果', 'type', '类型', 'quality', '品质', 'num', '数量', 'level', '等级'];

            // 排序 keys
            const keys = Object.keys(data).sort((a, b) => {
                const idxA = priorityKeys.indexOf(a);
                const idxB = priorityKeys.indexOf(b);
                if (idxA > -1 && idxB > -1) return idxA - idxB;
                if (idxA > -1) return -1;
                if (idxB > -1) return 1;
                return 0;
            });

            keys.forEach(key => {
                if (key.startsWith('_') || key === 'name' || key === 'icon') return; // 跳过内部字段和已显示的标题

                const value = data[key];
                if (!value) return;

                const group = document.createElement('div');
                group.className = 'mod04-field-group';

                // 标签名汉化
                const labelText = KEY_MAP[key] || key;

                // 特殊字段处理
                if (key === 'comment') {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'mod04-comment';
                    commentDiv.textContent = value;
                    container.appendChild(commentDiv);
                    return;
                }

                // 标签化字段
                if (['quality', '品质', 'type', '类型', 'num', '数量'].includes(key)) {
                    const tagClass = key.includes('quality') || key.includes('品质') ? 'mod04-tag-quality' :
                                     key.includes('num') || key.includes('数量') ? 'mod04-tag-num' : 'mod04-tag-type';

                    group.innerHTML = `<span class="mod04-label">${labelText}</span> <span class="mod04-tag ${tagClass}">${value}</span>`;
                    container.appendChild(group);
                    return;
                }

                // Effect 特殊高亮
                if (key === 'effect' || key === '效果') {
                    let html = String(value);
                    // 匹配 【...】 并高亮
                    html = html.replace(/【(.*?)】/g, '<span class="mod04-effect-highlight">【$1】</span>');
                    group.innerHTML = `<div class="mod04-label">${labelText}</div><div class="mod04-value">${html}</div>`;
                    container.appendChild(group);
                    return;
                }

                // 普通字段或嵌套对象
                if (typeof value === 'object' && value !== null) {
                    group.innerHTML = `<div class="mod04-label">${labelText}</div>`;
                    const subContainer = document.createElement('div');
                    subContainer.style.paddingLeft = '15px';
                    subContainer.style.borderLeft = '2px solid #ccc';
                    this.renderDetailContent(value, subContainer);
                    group.appendChild(subContainer);
                } else {
                    group.innerHTML = `<span class="mod04-label">${labelText}</span><span class="mod04-value">${value}</span>`;
                }

                container.appendChild(group);
            });
        }
    }

    // ==========================================================================
    // 4. 启动
    // ==========================================================================
    // 确保 DOM 加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new PokedexMod());
    } else {
        new PokedexMod();
    }

})();
