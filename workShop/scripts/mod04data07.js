(function () {
    'use strict';

    // ==========================================================================
    // 1. 资源加载与基础配置
    // ==========================================================================

    // 动态加载 FontAwesome (如果环境中没有)
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/@fortawesome/fontawesome-free@6.4.0/css/all.min.css';
        document.head.appendChild(link);
    }

    // 汉化映射表
    const I18N_MAP = {
        'info': '简介',
        'effect': '效果',
        'type': '种类',
        'quality': '品质',
        'num': '数量',
        'level': '等级',
        'name': '名称',
        'desc': '描述'
    };

    // 辅助函数：获取 GameAPI 变量
    const getVar = (name, defaultVal) => {
        if (window.GameAPI && window.GameAPI.getThemeVar) {
            const val = window.GameAPI.getThemeVar(name);
            return val ? val : defaultVal;
        }
        return defaultVal;
    };

    // ==========================================================================
    // 2. CSS 样式系统 (Mod04)
    // ==========================================================================
    const styleId = 'mod04-inventory-style';
    if (document.getElementById(styleId)) document.getElementById(styleId).remove();

    const css = `
        :root {
            /* 核心变量映射 */
            --mod04-primary: ${getVar('--primary-color', '#00faff')};
            --mod04-secondary: ${getVar('--secondary-color', '#7affff')};
            --mod04-bg: rgba(10, 15, 25, 0.95);
            --mod04-text: ${getVar('--text-color', '#e6f1ff')};
            --mod04-border: rgba(255, 255, 255, 0.8); /* 漫画风：高亮白边 */
            --mod04-ink: #000000;
            --mod04-font: "Noto Serif SC", "SimSun", serif; /* 衬线体更有漫画感 */
        }

        /* 全局重置 */
        .mod04-wrapper * {
            box-sizing: border-box;
            scrollbar-width: thin;
            scrollbar-color: var(--mod04-primary) transparent;
        }

        /* 1. 快速入口按钮 */
        .mod04-quick-btn {
            position: fixed;
            padding: 8px 20px;
            background: #000;
            border: 2px solid var(--mod04-primary);
            border-right: 6px solid var(--mod04-primary);
            color: var(--mod04-primary);
            font-family: var(--mod04-font);
            font-size: 14px;
            font-weight: 900;
            letter-spacing: 2px;
            cursor: pointer;
            z-index: 99999;
            opacity: 0;
            transform: translateX(-20px) skewX(-10deg);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
            box-shadow: 0 0 10px rgba(0, 250, 255, 0.2);
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .mod04-quick-btn.visible {
            opacity: 1;
            transform: translateX(0) skewX(-10deg);
            pointer-events: auto;
        }
        .mod04-quick-btn:hover {
            background: var(--mod04-primary);
            color: #000;
            padding-right: 30px;
            box-shadow: 0 0 25px var(--mod04-primary);
        }
        .mod04-quick-btn i { font-size: 1.2em; }

        /* 2. 主界面全屏容器 */
        .mod04-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: var(--mod04-bg);
            z-index: 100000;
            display: flex;
            flex-direction: column;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease;
            backdrop-filter: blur(5px);
            font-family: var(--mod04-font);
            overflow: hidden;
        }
        .mod04-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        /* 背景特效：漫画速度线/墨迹 */
        .mod04-bg-effect {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background:
                radial-gradient(circle at 50% 50%, transparent 0%, #000 120%),
                repeating-linear-gradient(90deg, transparent 0, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px);
            z-index: -1;
            pointer-events: none;
        }

        /* 顶部导航 */
        .mod04-header {
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--mod04-border);
            background: linear-gradient(to right, rgba(0,0,0,0.8), transparent);
        }
        .mod04-title {
            font-size: 32px;
            color: var(--mod04-text);
            text-shadow: 2px 2px 0px var(--mod04-primary);
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 4px;
        }
        .mod04-close-btn {
            font-size: 32px;
            color: var(--mod04-text);
            cursor: pointer;
            transition: transform 0.3s;
        }
        .mod04-close-btn:hover {
            transform: rotate(90deg) scale(1.2);
            color: var(--mod04-primary);
        }

        /* 标签页切换 */
        .mod04-tabs {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
        }
        .mod04-tab {
            padding: 10px 30px;
            border: 1px solid var(--mod04-text);
            color: var(--mod04-text);
            cursor: pointer;
            font-size: 18px;
            transition: all 0.3s;
            background: rgba(0,0,0,0.5);
            clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%);
        }
        .mod04-tab.active {
            background: var(--mod04-primary);
            color: #000;
            border-color: var(--mod04-primary);
            font-weight: bold;
            transform: scale(1.1);
        }

        /* 内容网格区 */
        .mod04-content {
            flex: 1;
            overflow-y: auto;
            padding: 40px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 25px;
            perspective: 1000px; /* 3D透视 */
        }

        /* 物品卡片 */
        .mod04-card {
            position: relative;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid var(--mod04-text);
            padding: 15px;
            cursor: pointer;
            transition: transform 0.1s ease-out, box-shadow 0.3s;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 200px;
            transform-style: preserve-3d;
            overflow: hidden;
        }
        /* 漫画风格：粗糙的阴影 */
        .mod04-card::after {
            content: '';
            position: absolute;
            top: 4px; left: 4px;
            width: 100%; height: 100%;
            border: 2px solid var(--mod04-primary);
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .mod04-card:hover {
            background: rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 15px var(--mod04-primary);
            z-index: 10;
        }
        .mod04-card:hover::after {
            opacity: 1;
        }

        .mod04-card-icon {
            font-size: 48px;
            margin-bottom: 15px;
            color: var(--mod04-primary);
            text-shadow: 0 0 10px rgba(0, 250, 255, 0.5);
            transition: transform 0.3s;
        }
        .mod04-card:hover .mod04-card-icon {
            transform: scale(1.2) rotate(5deg);
        }

        .mod04-card-name {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 1px solid rgba(255,255,255,0.3);
            width: 100%;
            padding-bottom: 5px;
        }

        .mod04-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            justify-content: center;
            font-size: 12px;
        }
        .mod04-tag {
            padding: 2px 6px;
            background: #000;
            border: 1px solid var(--mod04-secondary);
            color: var(--mod04-secondary);
            border-radius: 2px;
        }
        .mod04-tag.num {
            background: var(--mod04-primary);
            color: #000;
            border-color: var(--mod04-primary);
            font-weight: bold;
        }

        /* 详情抽屉/弹窗 */
        .mod04-detail-modal {
            position: fixed;
            top: 0; right: 0;
            width: 500px;
            max-width: 90vw;
            height: 100%;
            background: rgba(15, 20, 30, 0.98);
            border-left: 4px solid var(--mod04-primary);
            box-shadow: -10px 0 50px rgba(0,0,0,0.8);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
            z-index: 100001;
            display: flex;
            flex-direction: column;
            padding: 0;
        }
        .mod04-detail-modal.active {
            transform: translateX(0);
        }

        .mod04-detail-header {
            padding: 30px;
            background: linear-gradient(to bottom, rgba(0, 250, 255, 0.1), transparent);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            gap: 20px;
        }
        .mod04-detail-icon {
            font-size: 64px;
            color: var(--mod04-primary);
            filter: drop-shadow(0 0 10px var(--mod04-primary));
        }
        .mod04-detail-title {
            font-size: 28px;
            font-weight: bold;
            color: #fff;
        }

        .mod04-detail-body {
            flex: 1;
            overflow-y: auto;
            padding: 30px;
            font-size: 16px;
            line-height: 1.6;
            color: #ccc;
        }

        /* 详情内容美化 */
        .mod04-field {
            margin-bottom: 15px;
            border-left: 2px solid var(--mod04-secondary);
            padding-left: 10px;
            background: rgba(255,255,255,0.02);
            padding: 10px;
        }
        .mod04-field-label {
            color: var(--mod04-primary);
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 4px;
            display: block;
        }
        .mod04-field-value {
            color: #fff;
            white-space: pre-wrap; /* 兼容长文本换行 */
            word-break: break-all;
        }

        /* 特殊字段美化 */
        .mod04-effect-text {
            color: #ffeb3b; /* 效果高亮 */
            font-family: monospace;
        }

        /* 彩蛋 Comment */
        .mod04-comment {
            margin-top: 30px;
            padding: 15px;
            background: #fff;
            color: #000;
            font-family: "Comic Sans MS", cursive, sans-serif;
            transform: rotate(-2deg);
            box-shadow: 3px 3px 0 rgba(0,0,0,0.5);
            position: relative;
            border: 2px solid #000;
        }
        .mod04-comment::before {
            content: 'NOTE';
            position: absolute;
            top: -10px; left: 10px;
            background: var(--mod04-primary);
            padding: 2px 5px;
            font-size: 10px;
            font-weight: bold;
            border: 1px solid #000;
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            .mod04-content {
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                padding: 15px;
                gap: 15px;
            }
            .mod04-detail-modal {
                width: 100%;
                border-left: none;
            }
            .mod04-header {
                padding: 15px;
            }
            .mod04-title { font-size: 20px; }
            .mod04-quick-btn {
                right: 10px !important; /* 强制覆盖 */
                top: 50% !important;
            }
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // ==========================================================================
    // 3. 核心逻辑类
    // ==========================================================================

    class InventoryMod {
        constructor() {
            this.isOpen = false;
            this.currentTab = 'items'; // 'items' or 'skills'
            this.data = { items: [], skills: [] };
            this.orb = document.getElementById('page-character-orb');

            if (!this.orb) {
                console.warn('Mod04: 未找到 #page-character-orb，脚本可能加载过早。');
                // 简单的重试机制
                setTimeout(() => new InventoryMod(), 1000);
                return;
            }

            this.initUI();
            this.initTrigger();
        }

        // 获取数据
        fetchData() {
            try {
                // 兼容 GameAPI 写法
                const rawData = window.GameAPI && window.GameAPI.assaData ? window.GameAPI.assaData : {};
                const lore = rawData.global_lore || {};

                // 解析背包
                this.data.items = this.normalizeData(lore['背包'] || {});
                // 解析技能
                this.data.skills = this.normalizeData(lore['其他技能'] || {});

            } catch (e) {
                console.error('Mod04: 数据读取失败', e);
                this.data = { items: [], skills: [] };
            }
        }

        // 数据标准化：将 Object 转为 Array，并处理 Key
        normalizeData(obj) {
            return Object.entries(obj).map(([key, value]) => {
                // 如果 value 是字符串（简单的键值对），尝试转对象
                let itemData = typeof value === 'object' ? { ...value } : { info: value };

                // 确保有 name
                if (!itemData.name) itemData.name = key;

                // 处理 Icon: 如果没有 icon 字段，尝试用 name 的第一个字
                if (!itemData.icon) {
                    itemData.iconText = itemData.name.substring(0, 1);
                } else if (itemData.icon.startsWith('fa-')) {
                    itemData.iconClass = itemData.icon;
                } else {
                    // 可能是 emoji 或其他字符
                    itemData.iconText = itemData.icon;
                }

                return itemData;
            }).filter(item => !item.name.startsWith('_')); // 过滤 _ 开头
        }

        // 初始化 UI 结构
        initUI() {
            // 1. 主容器
            this.overlay = document.createElement('div');
            this.overlay.className = 'mod04-overlay';
            this.overlay.innerHTML = `
                <div class="mod04-bg-effect"></div>
                <div class="mod04-header">
                    <div class="mod04-title">INVENTORY / 物品与技能</div>
                    <div class="mod04-close-btn"><i class="fas fa-times"></i></div>
                </div>
                <div class="mod04-tabs">
                    <div class="mod04-tab active" data-type="items">物品 ITEMS</div>
                    <div class="mod04-tab" data-type="skills">技能 SKILLS</div>
                </div>
                <div class="mod04-content" id="mod04-grid"></div>

                <!-- 详情抽屉 -->
                <div class="mod04-detail-modal" id="mod04-detail">
                    <div class="mod04-detail-header">
                        <div class="mod04-detail-icon"></div>
                        <div class="mod04-detail-title"></div>
                    </div>
                    <div class="mod04-detail-body"></div>
                </div>
            `;
            document.body.appendChild(this.overlay);

            // 2. 绑定事件
            this.overlay.querySelector('.mod04-close-btn').onclick = () => this.close();

            // 点击遮罩层关闭详情，或者关闭整个界面
            this.overlay.addEventListener('click', (e) => {
                const detail = document.getElementById('mod04-detail');
                if (detail.classList.contains('active') && !detail.contains(e.target) && !e.target.closest('.mod04-card')) {
                    // 如果详情打开且点击了外部 -> 关闭详情
                    this.closeDetail();
                    e.stopPropagation();
                } else if (e.target === this.overlay) {
                    // 点击最外层空白 -> 关闭整个界面
                    this.close();
                }
            });

            // Tab 切换
            this.overlay.querySelectorAll('.mod04-tab').forEach(tab => {
                tab.onclick = () => {
                    this.overlay.querySelectorAll('.mod04-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    this.currentTab = tab.dataset.type;
                    this.renderGrid();
                };
            });
        }

        // 初始化触发器 (Orb 交互)
        initTrigger() {
            this.triggerBtn = document.createElement('div');
            this.triggerBtn.className = 'mod04-quick-btn';
            this.triggerBtn.innerHTML = '<i class="fas fa-box-open"></i> <span>背包/技能</span>';
            document.body.appendChild(this.triggerBtn);

            // 触发逻辑
            const showBtn = () => {
                const rect = this.orb.getBoundingClientRect();
                // 计算位置：Orb 左侧
                this.triggerBtn.style.top = (rect.top + rect.height / 2 - 20) + 'px';
                this.triggerBtn.style.left = (rect.left - 140) + 'px'; // 假设按钮宽约120

                // 移动端修正
                if (window.innerWidth < 768) {
                    this.triggerBtn.style.left = 'auto';
                    this.triggerBtn.style.right = '80px';
                }

                this.triggerBtn.classList.add('visible');
            };

            const hideBtn = () => {
                // 延迟隐藏，给用户时间移动鼠标到按钮上
                setTimeout(() => {
                    if (!this.triggerBtn.matches(':hover') && !this.orb.matches(':hover')) {
                        this.triggerBtn.classList.remove('visible');
                    }
                }, 300);
            };

            // PC: Hover
            this.orb.addEventListener('mouseenter', showBtn);
            this.orb.addEventListener('mouseleave', hideBtn);
            this.triggerBtn.addEventListener('mouseleave', hideBtn);

            // Mobile: Long Press / Slide
            let touchTimer;
            this.orb.addEventListener('touchstart', () => {
                touchTimer = setTimeout(showBtn, 500); // 长按500ms显示
            });
            this.orb.addEventListener('touchend', () => clearTimeout(touchTimer));

            // 点击按钮打开
            this.triggerBtn.onclick = () => this.open();
        }

        open() {
            this.fetchData();
            this.renderGrid();
            this.overlay.classList.add('active');
            this.isOpen = true;
        }

        close() {
            this.overlay.classList.remove('active');
            this.closeDetail();
            this.isOpen = false;
        }

        closeDetail() {
            document.getElementById('mod04-detail').classList.remove('active');
        }

        // 渲染网格列表
        renderGrid() {
            const container = document.getElementById('mod04-grid');
            container.innerHTML = '';

            const list = this.data[this.currentTab];

            if (list.length === 0) {
                container.innerHTML = '<div style="color:#fff; width:100%; text-align:center; grid-column: 1/-1;">暂无数据 / NO DATA</div>';
                return;
            }

            list.forEach(item => {
                const card = document.createElement('div');
                card.className = 'mod04-card';

                // 图标处理
                let iconHtml = '';
                if (item.iconClass) {
                    iconHtml = `<i class="${item.iconClass}"></i>`;
                } else {
                    iconHtml = `<span>${item.iconText || '?'}</span>`;
                }

                // 标签处理 (Quality, Type, Num)
                let tagsHtml = '';
                if (item.quality) tagsHtml += `<span class="mod04-tag">${item.quality}</span>`;
                if (item.type) tagsHtml += `<span class="mod04-tag">${item.type}</span>`;
                if (item.num !== undefined) tagsHtml += `<span class="mod04-tag num">x${item.num}</span>`;
                if (item.level) tagsHtml += `<span class="mod04-tag">Lv.${item.level}</span>`;

                card.innerHTML = `
                    <div class="mod04-card-icon">${iconHtml}</div>
                    <div class="mod04-card-name">${item.name}</div>
                    <div class="mod04-tags">${tagsHtml}</div>
                `;

                // 3D Tilt Effect (鼠标移动视差)
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
                    const rotateY = ((x - centerX) / centerX) * 10;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                });

                card.onclick = () => this.showDetail(item);
                container.appendChild(card);
            });
        }

        // 显示详情
        showDetail(item) {
            const detail = document.getElementById('mod04-detail');
            const iconEl = detail.querySelector('.mod04-detail-icon');
            const titleEl = detail.querySelector('.mod04-detail-title');
            const bodyEl = detail.querySelector('.mod04-detail-body');

            // 设置头部
            if (item.iconClass) {
                iconEl.innerHTML = `<i class="${item.iconClass}"></i>`;
            } else {
                iconEl.innerHTML = item.iconText || item.name[0];
            }
            titleEl.textContent = item.name;

            // 递归渲染内容
            let contentHtml = '';

            // 优先渲染特定字段顺序
            const priorityKeys = ['info', 'effect', 'comment'];

            // 1. 渲染 Info
            if (item.info) {
                contentHtml += this.renderField('简介', item.info);
            }

            // 2. 渲染 Effect (特殊高亮)
            if (item.effect) {
                // 简单的正则替换，高亮【】内的内容
                let effectText = typeof item.effect === 'string' ? item.effect : JSON.stringify(item.effect);
                effectText = effectText.replace(/【(.*?)】/g, '<span class="mod04-effect-text">【$1】</span>');
                contentHtml += this.renderField('效果', effectText, true);
            }

            // 3. 渲染其他所有字段 (排除已渲染的和内部字段)
            Object.keys(item).forEach(key => {
                if (['name', 'icon', 'iconClass', 'iconText', 'info', 'effect', 'comment'].includes(key)) return;
                if (key.startsWith('_')) return;

                const label = I18N_MAP[key] || key; // 汉化 Key
                let val = item[key];

                if (typeof val === 'object') val = JSON.stringify(val, null, 2);

                contentHtml += this.renderField(label, val);
            });

            // 4. 彩蛋 Comment
            if (item.comment) {
                contentHtml += `<div class="mod04-comment">${item.comment}</div>`;
            }

            bodyEl.innerHTML = contentHtml;
            detail.classList.add('active');
        }

        renderField(label, value, isHtml = false) {
            return `
                <div class="mod04-field">
                    <span class="mod04-field-label">${label}</span>
                    <div class="mod04-field-value">${isHtml ? value : this.escapeHtml(String(value))}</div>
                </div>
            `;
        }

        escapeHtml(text) {
            if (!text) return '';
            return text
                .replace(/&/g, "&")
                .replace(/</g, "<")
                .replace(/>/g, ">")
                .replace(/"/g, "\"")
                .replace(/'/g, "'");
        }
    }

    // 启动
    // 确保 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new InventoryMod());
    } else {
        new InventoryMod();
    }

})();
