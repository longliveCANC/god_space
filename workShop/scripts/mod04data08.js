(function() {
    // ==========================================================================
    // 1. 基础配置与资源加载
    // ==========================================================================
    const CONFIG = {
        prefix: 'mod04',
        orbId: 'page-character-orb',
        itemsPerPage: 12, // 每页显示数量
        faUrl: 'https://unpkg.com/@fortawesome/fontawesome-free@6.4.0/css/all.min.css'
    };

    // 注入 FontAwesome
    if (!document.querySelector(`link[href="${CONFIG.faUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = CONFIG.faUrl;
        document.head.appendChild(link);
    }

    // 字段映射字典 (兼容中英文)
    const KEY_MAP = {
        'info': '简介',
        'effect': '效果',
        'type': '种类',
        'quality': '品质',
        'num': '数量',
        'level': '等级',
        'intro': '介绍',
        'desc': '描述'
    };

    // ==========================================================================
    // 2. CSS 样式 (哥特式彩窗风格)
    // ==========================================================================
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --mod04-primary: #d4af37; /* 金色 */
            --mod04-glass-bg: rgba(10, 10, 16, 0.92);
            --mod04-glass-red: rgba(120, 20, 30, 0.6);
            --mod04-glass-blue: rgba(20, 30, 100, 0.6);
            --mod04-glass-purple: rgba(60, 20, 80, 0.6);
            --mod04-lead: #1a1a1a; /* 铅条黑 */
            --mod04-text: #e0e0e0;
            --mod04-font: 'Cinzel', 'Times New Roman', serif;
            --mod04-z-index: 100000;
        }

        /* 1. 快速入口按钮 (基于你的要求微调) */
        .mod04-quick-btn {
            position: fixed;
            padding: 8px 20px;
            /* 位置将由JS动态计算，默认为隐藏 */
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid var(--mod04-primary);
            border-left: none; /* 贴合左侧视觉 */
            color: var(--mod04-primary);
            font-family: var(--mod04-font);
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 2px;
            cursor: pointer;
            z-index: 9;
            opacity: 0;
            transform: translateX(-20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            clip-path: polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%);
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
            text-transform: uppercase;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .mod04-quick-btn.visible {
            opacity: 1;
            transform: translateX(0);
            pointer-events: auto;
        }
        .mod04-quick-btn:hover {
            background: var(--mod04-primary);
            color: #000;
            padding-left: 25px;
            box-shadow: 0 0 25px var(--mod04-primary);
        }

        /* 2. 全屏主容器 */
        .mod04-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(8px);
            z-index: var(--mod04-z-index);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease;
        }
        .mod04-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        /* 3. 彩窗面板 */
        .mod04-panel {
            width: 90%;
            max-width: 1000px;
            height: 85%;
            background: var(--mod04-glass-bg);
            border: 4px solid var(--mod04-lead);
            box-shadow:
                0 0 0 2px var(--mod04-primary),
                inset 0 0 30px rgba(0,0,0,0.8),
                0 0 50px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            border-radius: 8px 8px 0 0;
            /* 哥特尖顶装饰 */
            clip-path: polygon(
                0 20px, 20px 0, 50% 0, calc(100% - 20px) 0, 100% 20px,
                100% 100%, 0 100%
            );
        }

        /* 顶部导航栏 */
        .mod04-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 30px;
            background: linear-gradient(to bottom, #222, #111);
            border-bottom: 2px solid var(--mod04-primary);
        }
        .mod04-title {
            font-family: var(--mod04-font);
            color: var(--mod04-primary);
            font-size: 24px;
            text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        .mod04-tabs {
            display: flex;
            gap: 10px;
        }
        .mod04-tab {
            background: transparent;
            border: 1px solid var(--mod04-primary);
            color: var(--mod04-primary);
            padding: 5px 15px;
            cursor: pointer;
            transition: all 0.3s;
            font-family: var(--mod04-font);
        }
        .mod04-tab.active, .mod04-tab:hover {
            background: var(--mod04-primary);
            color: #000;
        }
        .mod04-close {
            font-size: 24px;
            color: #fff;
            cursor: pointer;
            transition: transform 0.3s;
        }
        .mod04-close:hover {
            transform: rotate(90deg);
            color: var(--mod04-primary);
        }

        /* 内容区域 */
        .mod04-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 15px;
            /* 自定义滚动条 */
            scrollbar-width: thin;
            scrollbar-color: var(--mod04-primary) #111;
        }
        .mod04-content::-webkit-scrollbar { width: 8px; }
        .mod04-content::-webkit-scrollbar-track { background: #111; }
        .mod04-content::-webkit-scrollbar-thumb { background: var(--mod04-primary); }

        /* 物品卡片 (彩窗碎片) */
        .mod04-item-card {
            position: relative;
            background: linear-gradient(135deg, rgba(30,30,30,0.8), rgba(10,10,10,0.9));
            border: 2px solid var(--mod04-lead);
            height: 180px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
            overflow: hidden;
        }
        .mod04-item-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%);
            background-size: 200% 200%;
            transition: background-position 0.5s;
        }
        .mod04-item-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            border-color: var(--mod04-primary);
        }
        .mod04-item-card:hover::before {
            background-position: 100% 100%;
        }

        /* 物品品质颜色边框 */
        .mod04-quality-bg {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 5px;
        }

        .mod04-icon-box {
            font-size: 40px;
            margin-bottom: 10px;
            color: #ddd;
            text-shadow: 0 0 10px rgba(255,255,255,0.3);
            z-index: 2;
        }
        .mod04-item-name {
            font-size: 14px;
            text-align: center;
            color: var(--mod04-primary);
            padding: 0 10px;
            z-index: 2;
            font-weight: bold;
        }
        .mod04-item-count {
            position: absolute;
            bottom: 5px;
            right: 5px;
            font-size: 12px;
            background: #000;
            color: #fff;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #555;
        }

        /* 详情弹窗 (抽屉式/覆盖式) */
        .mod04-detail-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(3px);
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
            width: 100%;
            max-width: 400px;
            height: 100%;
            background: #111;
            border-left: 4px solid var(--mod04-primary);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            display: flex;
            flex-direction: column;
            box-shadow: -10px 0 30px rgba(0,0,0,0.8);
        }
        .mod04-detail-overlay.active .mod04-detail-panel {
            transform: translateX(0);
        }

        .mod04-detail-header {
            padding: 20px;
            background: var(--mod04-glass-red);
            border-bottom: 2px solid var(--mod04-lead);
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .mod04-detail-icon {
            font-size: 48px;
            color: #fff;
            filter: drop-shadow(0 0 5px gold);
        }
        .mod04-detail-title-box {
            flex: 1;
        }
        .mod04-detail-name {
            font-size: 20px;
            color: var(--mod04-primary);
            font-weight: bold;
            margin-bottom: 5px;
        }
        .mod04-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }
        .mod04-tag {
            font-size: 10px;
            padding: 2px 6px;
            border: 1px solid #555;
            border-radius: 2px;
            color: #aaa;
            text-transform: uppercase;
        }
        .mod04-tag.quality { border-color: gold; color: gold; }
        .mod04-tag.type { border-color: cyan; color: cyan; }

        .mod04-detail-body {
            flex: 1;
            padding: 20px;
            overflow-y: auto; /* 内部滑动 */
            color: #ccc;
            font-size: 14px;
            line-height: 1.6;
        }

        /* 详情字段美化 */
        .mod04-field-block {
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #333;
        }
        .mod04-field-label {
            color: var(--mod04-primary);
            font-size: 12px;
            margin-bottom: 4px;
            opacity: 0.8;
        }
        .mod04-field-value {
            word-break: break-word;
        }

        /* Effect 高亮 */
        .mod04-effect-highlight {
            color: #ff6b6b;
            font-weight: bold;
            background: rgba(255, 107, 107, 0.1);
            padding: 0 4px;
            border-radius: 3px;
        }
        .mod04-bracket-highlight {
            color: #4ecdc4;
        }

        /* Comment 彩蛋 */
        .mod04-comment-egg {
            margin-top: 20px;
            padding: 15px;
            background: #fffbe6;
            color: #333;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            transform: rotate(-2deg);
            box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
            position: relative;
            border: 1px solid #ccc;
        }
        .mod04-comment-egg::before {
            content: '📌';
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
        }

        /* 分页器 */
        .mod04-pagination {
            padding: 10px;
            display: flex;
            justify-content: center;
            gap: 10px;
            background: rgba(0,0,0,0.5);
        }
        .mod04-page-btn {
            background: #222;
            border: 1px solid #444;
            color: #fff;
            padding: 5px 10px;
            cursor: pointer;
        }
        .mod04-page-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        /* 嵌套JSON展示 */
        .mod04-nested-obj {
            margin-left: 10px;
            border-left: 2px solid #333;
            padding-left: 10px;
        }

        @media (max-width: 768px) {
            .mod04-panel {
                width: 100%;
                height: 100%;
                border: none;
                border-radius: 0;
                clip-path: none;
            }
            .mod04-detail-panel {
                max-width: 100%;
            }
            .mod04-quick-btn {
                right: 10px !important; /* 手机端强制靠右 */
                top: 50% !important;
            }
        }
    `;
    document.head.appendChild(style);

    // ==========================================================================
    // 3. 核心逻辑类
    // ==========================================================================
    class Mod04Inventory {
        constructor() {
            this.isOpen = false;
            this.currentTab = 'backpack'; // backpack | skill
            this.currentPage = 1;
            this.allItems = [];
            this.filteredItems = [];

            this.initDOM();
            this.bindOrbTrigger();
        }

        // 获取数据 (使用 getter 模拟)
        getData() {
            try {
                // 兼容 AssaData 路径
                const rawData = window.GameAPI && window.GameAPI.assaData ? window.GameAPI.assaData.global_lore : {};
                return rawData;
            } catch (e) {
                console.error("Mod04: Failed to load data", e);
                return {};
            }
        }

        // 初始化 DOM 结构
        initDOM() {
            // 1. 快速入口按钮
            this.quickBtn = document.createElement('div');
            this.quickBtn.className = 'mod04-quick-btn';
            this.quickBtn.innerHTML = '<i class="fas fa-dungeon"></i> 物品 / 技能';
            document.body.appendChild(this.quickBtn);

            // 2. 主界面 Overlay
            this.overlay = document.createElement('div');
            this.overlay.className = 'mod04-overlay';
            this.overlay.innerHTML = `
                <div class="mod04-panel">
                    <div class="mod04-header">
                        <div class="mod04-title">INVENTORY & SKILLS</div>
                        <div class="mod04-tabs">
                            <button class="mod04-tab active" data-type="backpack">背包</button>
                            <button class="mod04-tab" data-type="skill">技能</button>
                        </div>
                        <div class="mod04-close"><i class="fas fa-times"></i></div>
                    </div>
                    <div class="mod04-content" id="mod04-list-container">
                        <!-- 列表内容 -->
                    </div>
                    <div class="mod04-pagination">
                        <button class="mod04-page-btn" id="mod04-prev">Prev</button>
                        <span id="mod04-page-info" style="color:#fff; align-self:center;">1 / 1</span>
                        <button class="mod04-page-btn" id="mod04-next">Next</button>
                    </div>

                    <!-- 详情页 Overlay (内部) -->
                    <div class="mod04-detail-overlay" id="mod04-detail-overlay">
                        <div class="mod04-detail-panel">
                            <div class="mod04-detail-header">
                                <div class="mod04-detail-icon" id="d-icon"></div>
                                <div class="mod04-detail-title-box">
                                    <div class="mod04-detail-name" id="d-name"></div>
                                    <div class="mod04-tags" id="d-tags"></div>
                                </div>
                            </div>
                            <div class="mod04-detail-body" id="d-body">
                                <!-- 详细字段 -->
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(this.overlay);

            // 绑定内部事件
            this.overlay.querySelector('.mod04-close').addEventListener('click', () => this.close());

            // 点击 Overlay 空白处关闭 (需要判断 target)
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.close();
            });

            // 详情页关闭
            const detailOverlay = this.overlay.querySelector('#mod04-detail-overlay');
            detailOverlay.addEventListener('click', (e) => {
                if (e.target === detailOverlay) {
                    detailOverlay.classList.remove('active');
                }
            });

            // Tab 切换
            this.overlay.querySelectorAll('.mod04-tab').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.overlay.querySelectorAll('.mod04-tab').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentTab = e.target.dataset.type;
                    this.currentPage = 1;
                    this.renderList();
                });
            });

            // 分页
            this.overlay.querySelector('#mod04-prev').addEventListener('click', () => this.changePage(-1));
            this.overlay.querySelector('#mod04-next').addEventListener('click', () => this.changePage(1));

            // 快速入口点击
            this.quickBtn.addEventListener('click', () => this.open());
        }

        // 绑定 Orb 触发逻辑
        bindOrbTrigger() {
            const checkOrb = setInterval(() => {
                const orb = document.getElementById(CONFIG.orbId);
                if (orb) {
                    clearInterval(checkOrb);
                    this.initOrbEvents(orb);
                }
            }, 1000);
        }

initOrbEvents(orb) {
    let hideTimer = null; // 添加延迟定时器

    // PC: Hover - 添加延迟逻辑
    const handleOrbEnter = () => {
        clearTimeout(hideTimer);
        this.showQuickBtn(orb);
    };

    const handleOrbLeave = (e) => {
        // 如果鼠标移到了按钮上，不隐藏
        if (e.relatedTarget === this.quickBtn || this.quickBtn.contains(e.relatedTarget)) {
            return;
        }
        // 延迟500ms隐藏
        hideTimer = setTimeout(() => {
            this.hideQuickBtn();
        }, 500);
    };

    const handleBtnEnter = () => {
        clearTimeout(hideTimer);
    };

    const handleBtnLeave = (e) => {
        // 如果鼠标移回orb，不隐藏
        if (e.relatedTarget === orb) {
            return;
        }
        // 延迟500ms隐藏
        hideTimer = setTimeout(() => {
            this.hideQuickBtn();
        }, 500);
    };

    // 绑定事件
    orb.addEventListener('mouseenter', handleOrbEnter);
    orb.addEventListener('mouseleave', handleOrbLeave);
    this.quickBtn.addEventListener('mouseenter', handleBtnEnter);
    this.quickBtn.addEventListener('mouseleave', handleBtnLeave);

    // Mobile: Long Press
    let pressTimer;
    const startPress = (e) => {
        pressTimer = setTimeout(() => {
            this.showQuickBtn(orb);
        }, 600); // 600ms 长按
    };
    const cancelPress = () => {
        clearTimeout(pressTimer);
    };

    orb.addEventListener('touchstart', startPress, {passive: true});
    orb.addEventListener('touchend', cancelPress);
    orb.addEventListener('touchmove', cancelPress);
}

        showQuickBtn(orb) {
            const rect = orb.getBoundingClientRect();
            // 计算位置：Orb 左侧
            // 注意：prompt css 给了 right: 70px fixed。
            // 为了兼容动态位置，我们这里动态设置 top，right 保持 CSS 设定或者动态计算
            // 简单起见，我们让它出现在 Orb 的左边，垂直居中

            // 如果是 PC，跟随 Orb；如果是 Mobile，可能 Orb 位置固定
            const top = rect.top + (rect.height / 2) - 20; // 20 is half btn height approx
            const right = window.innerWidth - rect.left + 10; // 距离屏幕右边的距离

            this.quickBtn.style.top = `${top}px`;
            this.quickBtn.style.right = `${right}px`;
            this.quickBtn.classList.add('visible');
        }

        hideQuickBtn() {
            this.quickBtn.classList.remove('visible');
        }

        // 打开界面
        open() {
            this.isOpen = true;
            this.overlay.classList.add('active');
            this.loadDataAndRender();
        }

        close() {
            this.isOpen = false;
            this.overlay.classList.remove('active');
            this.overlay.querySelector('#mod04-detail-overlay').classList.remove('active');
        }

        // 数据处理与渲染
        loadDataAndRender() {
            const data = this.getData();
            const backpack = data['背包'] || {};
            const skills = data['其他技能'] || {};

            // 转换为数组并预处理
            const process = (obj, type) => {
                return Object.entries(obj).map(([key, val]) => {
                    // 过滤 _ 开头的 key
                    const cleanVal = {};
                    Object.keys(val).forEach(k => {
                        if (!k.startsWith('_')) cleanVal[k] = val[k];
                    });
                    return {
                        _id: key, // 原始 key 作为名字
                        _type: type,
                        ...cleanVal
                    };
                });
            };

            this.allItems = {
                backpack: process(backpack, 'item'),
                skill: process(skills, 'skill')
            };

            this.renderList();
        }

        renderList() {
            const container = document.getElementById('mod04-list-container');
            container.innerHTML = '';

            const list = this.allItems[this.currentTab] || [];
            const totalPages = Math.ceil(list.length / CONFIG.itemsPerPage) || 1;

            if (this.currentPage > totalPages) this.currentPage = totalPages;
            if (this.currentPage < 1) this.currentPage = 1;

            // 更新分页 UI
            document.getElementById('mod04-page-info').innerText = `${this.currentPage} / ${totalPages}`;
            document.getElementById('mod04-prev').disabled = this.currentPage === 1;
            document.getElementById('mod04-next').disabled = this.currentPage === totalPages;

            // 切片
            const start = (this.currentPage - 1) * CONFIG.itemsPerPage;
            const end = start + CONFIG.itemsPerPage;
            const pageItems = list.slice(start, end);

            pageItems.forEach(item => {
                const card = this.createItemCard(item);
                container.appendChild(card);
            });
        }

        changePage(delta) {
            this.currentPage += delta;
            this.renderList();
        }

        // 创建单个物品卡片
        createItemCard(item) {
            const div = document.createElement('div');
            div.className = 'mod04-item-card';

            // 图标处理
            let iconHtml = '';
            const iconVal = item.icon;
            if (iconVal && typeof iconVal === 'string') {
                if (iconVal.startsWith('fa-')) {
                    iconHtml = `<i class="fas ${iconVal}"></i>`;
                } else {
                    // Emoji 或其他字符
                    iconHtml = `<span>${iconVal}</span>`;
                }
            } else {
                // 默认取名字第一个字
                iconHtml = `<span>${item._id.charAt(0)}</span>`;
            }

            // 品质颜色条 (如果有 quality 字段)
            let qualityColor = 'transparent';
            // 这里可以根据 quality 文本做简单的颜色映射，暂时用透明

            div.innerHTML = `
                <div class="mod04-quality-bg" style="background:${qualityColor}"></div>
                <div class="mod04-icon-box">${iconHtml}</div>
                <div class="mod04-item-name">${item._id}</div>
                ${item.num ? `<div class="mod04-item-count">x${item.num}</div>` : ''}
            `;

            div.addEventListener('click', () => this.showDetail(item, iconHtml));
            return div;
        }

        // 显示详情
        showDetail(item, iconHtml) {
            const detailOverlay = document.getElementById('mod04-detail-overlay');
            const dIcon = document.getElementById('d-icon');
            const dName = document.getElementById('d-name');
            const dTags = document.getElementById('d-tags');
            const dBody = document.getElementById('d-body');

            dIcon.innerHTML = iconHtml;
            dName.innerText = item._id;
            dTags.innerHTML = '';
            dBody.innerHTML = '';

            // 标签化处理 (Quality, Type, Level)
            ['quality', 'type', 'level', '品质', '种类', '等级'].forEach(key => {
                if (item[key]) {
                    const tag = document.createElement('span');
                    tag.className = `mod04-tag ${key}`;
                    tag.innerText = item[key];
                    dTags.appendChild(tag);
                }
            });

            // 渲染主体内容
            // 过滤掉已经展示在 Header 的字段 (_id, _type, icon, quality, type, level, num)
            const ignoreKeys = ['_id', '_type', 'icon', 'quality', 'type', 'level', 'num', '品质', '种类', '等级', '数量'];

            // 特殊处理 Comment
            if (item.comment) {
                const egg = document.createElement('div');
                egg.className = 'mod04-comment-egg';
                egg.innerText = item.comment;
                dBody.appendChild(egg);
            }

            // 递归渲染剩余字段
            const renderObject = (obj, container) => {
                Object.entries(obj).forEach(([k, v]) => {
                    if (ignoreKeys.includes(k) || k === 'comment') return;
                    if (k.startsWith('_')) return;

                    const fieldBlock = document.createElement('div');
                    fieldBlock.className = 'mod04-field-block';

                    // 键名汉化
                    const labelText = KEY_MAP[k.toLowerCase()] || k;

                    const label = document.createElement('div');
                    label.className = 'mod04-field-label';
                    label.innerText = labelText;
                    fieldBlock.appendChild(label);

                    const valueDiv = document.createElement('div');
                    valueDiv.className = 'mod04-field-value';

                    if (typeof v === 'object' && v !== null) {
                        valueDiv.classList.add('mod04-nested-obj');
                        renderObject(v, valueDiv);
                    } else {
                        // 特殊处理 Effect 字段
                        if (k === 'effect' || k === '效果') {
                            valueDiv.innerHTML = this.formatEffect(String(v));
                        } else {
                            valueDiv.innerText = String(v);
                        }
                    }
                    fieldBlock.appendChild(valueDiv);
                    container.appendChild(fieldBlock);
                });
            };

            renderObject(item, dBody);

            detailOverlay.classList.add('active');
        }

        // Effect 文本美化
        formatEffect(text) {
            // 匹配 【...】 或 [...]
            // 并在内部匹配 数字 或 +/-数字
            // 示例: 【hp+50】 -> 高亮整个括号，或者高亮数字

            // 策略：将 【...】 整体包裹，然后内部数字再包裹
            return text.replace(/([【\[])(.*)([】\]])/g, (match, p1, p2, p3) => {
                // p2 是括号内部内容
                const inner = p2.replace(/([+\-]?\d+%?)/g, '<span class="mod04-effect-highlight">$1</span>');
                return `<span class="mod04-bracket-highlight">${p1}</span>${inner}<span class="mod04-bracket-highlight">${p3}</span>`;
            });
        }
    }

    // ==========================================================================
    // 4. 启动
    // ==========================================================================
    // 确保 DOM 加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new Mod04Inventory());
    } else {
        new Mod04Inventory();
    }

})();
