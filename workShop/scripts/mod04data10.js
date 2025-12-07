(function () {
    console.log("Initializing MOD04: Zelda Style Inventory...");

    // ==========================================================================
    // 1. 资源加载与基础配置
    // ==========================================================================

    // 加载 FontAwesome (如果环境中没有)
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://unpkg.com/@fortawesome/fontawesome-free@6.4.0/css/all.min.css';
        document.head.appendChild(fa);
    }

    // 模拟 GameAPI (如果不存在，防止报错，实际环境中会使用宿主提供的)
    if (typeof window.GameAPI === 'undefined') {
        window.GameAPI = {
            get assaData() { return window.assaData || {}; },
            getThemeVar: (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()
        };
    }

    // 字段汉化映射
    const KEY_MAP = {
        'info': '简介',
        'effect': '效果',
        'type': '种类',
        'quality': '品质',
        'num': '数量',
        'level': '等级',
        'source': '来源',
        'desc': '描述'
    };

    // ==========================================================================
    // 2. CSS 样式注入 (Zelda BOTW 风格)
    // ==========================================================================
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --mod04-primary: #00d2ff; /* 希卡蓝 */
            --mod04-gold: #c8b68e;    /* 塞尔达金 */
            --mod04-bg: rgba(10, 10, 12, 0.95);
            --mod04-panel-bg: rgba(20, 20, 25, 0.8);
            --mod04-text: #f0f0f0;
            --mod04-font: "Cinzel", "Times New Roman", serif; /* 标题字体 */
            --mod04-font-body: "Segoe UI", sans-serif;
        }

        /* 1. 快速入口按钮 (基于你的要求微调) */
        .mod04-quick-btn {
            position: fixed;
            padding: 8px 20px;
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid var(--mod04-primary);
            border-right: 4px solid var(--mod04-primary);
            color: var(--mod04-primary);
            font-family: var(--mod04-font-body);
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 2px;
            cursor: pointer;
            z-index: 9;
            opacity: 0;
            transform: translateX(-20px);
            transition: opacity 0.3s, transform 0.3s;
            pointer-events: none;
            clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%);
            box-shadow: -5px 0 15px rgba(0, 210, 255, 0.2);
            text-transform: uppercase;
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

        /* 2. 全屏容器 */
        #mod04-inventory-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: var(--mod04-bg);
            z-index: 100000;
            display: none;
            flex-direction: column;
            color: var(--mod04-text);
            font-family: var(--mod04-font-body);
            backdrop-filter: blur(5px);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        #mod04-inventory-overlay.active {
            display: flex;
            opacity: 1;
        }

        /* 3. 顶部导航栏 */
        .mod04-header {
            height: 80px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 40px;
            border-bottom: 1px solid rgba(200, 182, 142, 0.3);
            background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
        }
        .mod04-tabs {
            display: flex;
            gap: 30px;
        }
        .mod04-tab {
            font-family: var(--mod04-font);
            font-size: 24px;
            color: #888;
            cursor: pointer;
            position: relative;
            transition: color 0.3s;
            text-transform: uppercase;
        }
        .mod04-tab.active {
            color: var(--mod04-gold);
            text-shadow: 0 0 10px rgba(200, 182, 142, 0.5);
        }
        .mod04-tab.active::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--mod04-gold);
            box-shadow: 0 0 8px var(--mod04-gold);
        }
        .mod04-close-btn {
            font-size: 32px;
            color: var(--mod04-text);
            cursor: pointer;
            transition: transform 0.3s;
        }
        .mod04-close-btn:hover {
            transform: rotate(90deg);
            color: var(--mod04-primary);
        }

        /* 4. 主内容区 (Grid + Detail) */
        .mod04-content {
            flex: 1;
            display: flex;
            overflow: hidden;
            position: relative;
        }

        /* 左侧网格 */
        .mod04-grid-container {
            flex: 1;
            padding: 40px;
            overflow-y: auto;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
            grid-auto-rows: 90px;
            gap: 15px;
            align-content: start;
        }
        /* 滚动条美化 */
        .mod04-grid-container::-webkit-scrollbar { width: 6px; }
        .mod04-grid-container::-webkit-scrollbar-thumb { background: var(--mod04-gold); border-radius: 3px; }

        /* 物品格子 */
        .mod04-item-slot {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            position: relative;
            transition: all 0.2s;
            border-radius: 4px;
        }
        .mod04-item-slot:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: var(--mod04-primary);
            box-shadow: 0 0 10px rgba(0, 210, 255, 0.3);
            transform: scale(1.05);
        }
        .mod04-item-slot.selected {
            border: 2px solid var(--mod04-gold);
            box-shadow: 0 0 15px var(--mod04-gold);
            background: rgba(200, 182, 142, 0.1);
        }
        .mod04-item-icon {
            font-size: 36px;
            color: #ddd;
        }
        .mod04-item-count {
            position: absolute;
            bottom: 2px;
            right: 5px;
            font-size: 12px;
            color: var(--mod04-primary);
            font-weight: bold;
            text-shadow: 1px 1px 0 #000;
        }

        /* 右侧详情面板 (抽屉式) */
        .mod04-detail-panel {
            width: 400px;
            background: linear-gradient(to left, rgba(0,0,0,0.9), rgba(0,0,0,0.6));
            border-left: 1px solid rgba(255,255,255,0.1);
            padding: 40px;
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            overflow-y: auto; /* 支持滑动 */
            box-shadow: -10px 0 30px rgba(0,0,0,0.5);
        }
        .mod04-detail-panel.open {
            transform: translateX(0);
        }

        /* 详情内容美化 */
        .mod04-detail-header {
            border-bottom: 2px solid var(--mod04-gold);
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .mod04-detail-title {
            font-family: var(--mod04-font);
            font-size: 32px;
            color: var(--mod04-gold);
            margin: 0;
        }
        .mod04-detail-tags {
            display: flex;
            gap: 10px;
            margin-top: 10px;
            flex-wrap: wrap;
        }
        .mod04-tag {
            padding: 2px 8px;
            border: 1px solid #555;
            border-radius: 4px;
            font-size: 12px;
            color: #aaa;
            background: rgba(0,0,0,0.5);
        }
        .mod04-tag.quality { border-color: var(--mod04-gold); color: var(--mod04-gold); }
        .mod04-tag.type { border-color: var(--mod04-primary); color: var(--mod04-primary); }

        .mod04-detail-body {
            font-size: 16px;
            line-height: 1.6;
            color: #ccc;
        }
        .mod04-field-row {
            margin-bottom: 12px;
            padding: 8px;
            background: rgba(255,255,255,0.03);
            border-radius: 4px;
        }
        .mod04-field-key {
            color: var(--mod04-primary);
            font-weight: bold;
            margin-right: 8px;
        }

        /* 特殊效果高亮 */
        .mod04-effect-highlight {
            color: #ff6b6b; /* 红色表示数值变化 */
            font-weight: bold;
        }
        .mod04-effect-buff {
            color: #4cd137; /* 绿色表示增益 */
        }

        /* 幽默评论彩蛋 */
        .mod04-comment-egg {
            margin-top: 30px;
            padding: 15px;
            border-left: 3px solid var(--mod04-primary);
            background: rgba(0, 210, 255, 0.05);
            font-style: italic;
            color: #aaa;
            font-size: 14px;
            position: relative;
        }
        .mod04-comment-egg::before {
            content: '"';
            font-size: 40px;
            position: absolute;
            top: -10px;
            left: 5px;
            color: rgba(0, 210, 255, 0.2);
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            .mod04-header { padding: 0 20px; height: 60px; }
            .mod04-tab { font-size: 18px; }
            .mod04-grid-container { padding: 20px; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); grid-auto-rows: 70px; }
            .mod04-detail-panel {
                width: 100%;
                background: rgba(10, 10, 12, 0.98);
                z-index: 100001; /* 覆盖在Grid之上 */
            }
            .mod04-item-icon { font-size: 28px; }
        }

        /* 装饰性纹理 */
        .mod04-bg-pattern {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image: radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.8) 100%);
            pointer-events: none;
            z-index: -1;
        }
    `;
    document.head.appendChild(style);

    // ==========================================================================
    // 3. 核心逻辑类
    // ==========================================================================

    class ZeldaInventory {
        constructor() {
            this.currentCategory = '背包'; // 默认显示背包
            this.items = {};
            this.skills = {};
            this.initUI();
            this.initTrigger();
        }

        // 获取数据
        getData() {
            try {
                const lore = window.GameAPI.assaData.global_lore || {};
                this.items = lore['背包'] || {};
                this.skills = lore['其他技能'] || {};
            } catch (e) {
                console.error("MOD04: Failed to load data", e);
            }
        }

        // 初始化 UI 结构
        initUI() {
            const overlay = document.createElement('div');
            overlay.id = 'mod04-inventory-overlay';
            overlay.innerHTML = `
                <div class="mod04-bg-pattern"></div>
                <div class="mod04-header">
                    <div class="mod04-tabs">
                        <div class="mod04-tab active" data-cat="背包">物品</div>
                        <div class="mod04-tab" data-cat="其他技能">技能</div>
                    </div>
                    <div class="mod04-close-btn"><i class="fas fa-times"></i></div>
                </div>
                <div class="mod04-content">
                    <div class="mod04-grid-container" id="mod04-grid"></div>
                    <div class="mod04-detail-panel" id="mod04-detail">
                        <!-- 详情内容动态填充 -->
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            // 绑定事件
            overlay.querySelector('.mod04-close-btn').addEventListener('click', () => this.close());

            // Tab 切换
            overlay.querySelectorAll('.mod04-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    overlay.querySelectorAll('.mod04-tab').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentCategory = e.target.dataset.cat;
                    this.renderGrid();
                });
            });

            // 点击空白处关闭详情页 (在移动端特别重要)
            const contentArea = overlay.querySelector('.mod04-content');
            const detailPanel = overlay.querySelector('#mod04-detail');

            contentArea.addEventListener('click', (e) => {
                // 如果点击的是 Grid 区域且不是 Item，或者点击的是遮罩层
                if (e.target.classList.contains('mod04-grid-container') || e.target.classList.contains('mod04-content')) {
                    this.hideDetails();
                }
            });
        }

        // 初始化触发器 (Orb)
        initTrigger() {
            const orb = document.getElementById('page-character-orb');
            if (!orb) {
                console.warn("MOD04: Orb element not found, retrying in 1s...");
                setTimeout(() => this.initTrigger(), 1000);
                return;
            }

            const btn = document.createElement('div');
            btn.className = 'mod04-quick-btn';
            btn.innerHTML = '<i class="fas fa-suitcase"></i> 打开背包';
            document.body.appendChild(btn);

            const showBtn = () => {
                const rect = orb.getBoundingClientRect();
                // 动态计算位置：在 Orb 左侧
                btn.style.top = (rect.top + rect.height / 2 - 20) + 'px';
                btn.style.left = (rect.left - 140) + 'px'; // 按钮宽度约120px + 间距
                btn.classList.add('visible');
            };

            const hideBtn = () => {
                // 稍微延迟隐藏，方便鼠标移过去
                setTimeout(() => {
                    if (!btn.matches(':hover') && !orb.matches(':hover')) {
                        btn.classList.remove('visible');
                    }
                }, 300);
            };

            // PC: Hover
            orb.addEventListener('mouseenter', showBtn);
            orb.addEventListener('mouseleave', hideBtn);
            btn.addEventListener('mouseleave', hideBtn);

            // Mobile: Long Press
            let pressTimer;
            orb.addEventListener('touchstart', (e) => {
                pressTimer = setTimeout(() => {
                    showBtn();
                }, 600); // 长按 600ms
            });
            orb.addEventListener('touchend', () => clearTimeout(pressTimer));
            orb.addEventListener('touchmove', () => clearTimeout(pressTimer));

            // Click Button
            btn.addEventListener('click', () => {
                this.open();
                btn.classList.remove('visible');
            });
        }

        open() {
            this.getData();
            document.getElementById('mod04-inventory-overlay').classList.add('active');
            this.renderGrid();
        }

        close() {
            document.getElementById('mod04-inventory-overlay').classList.remove('active');
            this.hideDetails();
        }

        // 渲染网格
        renderGrid() {
            const grid = document.getElementById('mod04-grid');
            grid.innerHTML = '';
            this.hideDetails();

            const data = this.currentCategory === '背包' ? this.items : this.skills;
            const keys = Object.keys(data);

            if (keys.length === 0) {
                grid.innerHTML = '<div style="color:#666; width:100%; text-align:center; padding-top:50px;">空空如也...</div>';
                return;
            }

            keys.forEach(key => {
                // 过滤 _ 开头的字段
                if (key.startsWith('_')) return;

                const item = data[key];
                const slot = document.createElement('div');
                slot.className = 'mod04-item-slot';

                // 图标处理
                let iconHtml = '';
                if (item.icon) {
                    if (item.icon.startsWith('fa-')) {
                        iconHtml = `<i class="fas ${item.icon} mod04-item-icon"></i>`;
                    } else {
                        // 可能是 Emoji 或其他字符
                        iconHtml = `<span class="mod04-item-icon" style="font-size:28px;">${item.icon}</span>`;
                    }
                } else {
                    // 默认取名字第一个字
                    iconHtml = `<span class="mod04-item-icon" style="font-family:var(--mod04-font);">${key.charAt(0)}</span>`;
                }

                // 数量标签
                let numHtml = '';
                if (item.num && item.num > 1) {
                    numHtml = `<span class="mod04-item-count">x${item.num}</span>`;
                }

                slot.innerHTML = `${iconHtml}${numHtml}`;
                slot.addEventListener('click', (e) => {
                    // 移除其他选中状态
                    grid.querySelectorAll('.mod04-item-slot').forEach(s => s.classList.remove('selected'));
                    slot.classList.add('selected');
                    this.showDetails(key, item);
                    e.stopPropagation(); // 防止冒泡关闭详情
                });

                grid.appendChild(slot);
            });
        }

        // 显示详情
        showDetails(name, data) {
            const panel = document.getElementById('mod04-detail');

            // 1. 构建头部
            let tagsHtml = '';
            if (data.quality) tagsHtml += `<span class="mod04-tag quality">${data.quality}</span>`;
            if (data.type) tagsHtml += `<span class="mod04-tag type">${data.type}</span>`;
            if (data.level) tagsHtml += `<span class="mod04-tag">Lv.${data.level}</span>`;

            // 2. 构建主体 (递归处理)
            let bodyHtml = this.renderObjectRecursive(data);

            // 3. 彩蛋处理
            let eggHtml = '';
            if (data.comment) {
                eggHtml = `<div class="mod04-comment-egg">${data.comment}</div>`;
            }

            panel.innerHTML = `
                <div class="mod04-detail-header">
                    <h2 class="mod04-detail-title">${name}</h2>
                    <div class="mod04-detail-tags">${tagsHtml}</div>
                </div>
                <div class="mod04-detail-body">
                    ${bodyHtml}
                    ${eggHtml}
                </div>
            `;

            panel.classList.add('open');
        }

        hideDetails() {
            document.getElementById('mod04-detail').classList.remove('open');
        }

        // 递归渲染对象，处理特殊字段
        renderObjectRecursive(obj, depth = 0) {
            let html = '';
            // 已经特殊处理过的字段，不再在通用列表中显示
            const skipKeys = ['icon', 'comment', 'quality', 'type', 'level', 'num', 'name'];

            for (let key in obj) {
                if (key.startsWith('_') || skipKeys.includes(key)) continue;

                const val = obj[key];
                const label = KEY_MAP[key] || key; // 汉化 Key

                if (typeof val === 'object' && val !== null) {
                    // 嵌套对象
                    html += `
                        <div class="mod04-field-row" style="margin-left:${depth * 10}px">
                            <div class="mod04-field-key">${label}:</div>
                            ${this.renderObjectRecursive(val, depth + 1)}
                        </div>
                    `;
                } else {
                    // 普通值
                    let displayVal = val;

                    // 特殊美化：Effect 字段
                    if (key === 'effect') {
                        displayVal = this.formatEffect(val);
                    }

                    html += `
                        <div class="mod04-field-row" style="margin-left:${depth * 10}px">
                            <span class="mod04-field-key">${label}:</span>
                            <span style="color:#ddd;">${displayVal}</span>
                        </div>
                    `;
                }
            }
            return html;
        }

        // 效果文本美化解析
        formatEffect(text) {
            if (typeof text !== 'string') return text;

            // 匹配 【...】
            return text.replace(/【(.*?)】/g, (match, content) => {
                // 尝试高亮数值 (+50, -10, ±5)
                let styledContent = content.replace(/([+\-±]\d+%?)/g, '<span class="mod04-effect-highlight">$1</span>');

                // 尝试高亮属性名 (简单匹配中文或英文单词)
                // 这里简单处理，将分号分隔的部分分开
                return `【${styledContent}】`;
            });
        }
    }

    // 启动
    window.mod04Inventory = new ZeldaInventory();

})();
