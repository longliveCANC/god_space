(function () {
    // ==========================================================================
    // 0. 资源加载与环境准备
    // ==========================================================================
    const RESOURCE_BASE = 'https://unpkg.com';

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${url}"]`)) return resolve();
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function loadCSS(url) {
        if (document.querySelector(`link[href="${url}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    }

    // 加载 FontAwesome (用于图标)
    loadCSS(`${RESOURCE_BASE}/@fortawesome/fontawesome-free@6.4.0/css/all.min.css`);

    // ==========================================================================
    // 1. 样式定义 (CSS) - Mod04 Prefix
    // ==========================================================================
    const styleId = 'mod04-inventory-style';
    if (document.getElementById(styleId)) document.getElementById(styleId).remove();

    const css = `
        :root {
            --mod04-bg: #0a0a0a;
            --mod04-fg: #e0e0e0;
            --mod04-primary: ${window.GameAPI?.getThemeVar('--primary-color') || '#00faff'};
            --mod04-secondary: ${window.GameAPI?.getThemeVar('--secondary-color') || '#7affff'};
            --mod04-danger: #ff4d4d;
            --mod04-border: 2px solid var(--mod04-fg);
            --mod04-font: "Courier New", Courier, monospace;
        }

        /* 触发按钮 */
        .mod04-quick-btn {
            position: fixed;
            padding: 8px 16px;
            background: var(--mod04-bg);
            border: 1px solid var(--mod04-primary);
            color: var(--mod04-primary);
            font-family: var(--mod04-font);
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            z-index: 9;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s, transform 0.3s;
            box-shadow: 4px 4px 0px var(--mod04-primary);
            text-transform: uppercase;
            white-space: nowrap;
        }
        .mod04-quick-btn.visible {
            opacity: 1;
            pointer-events: auto;
            transform: translateX(0);
        }
        .mod04-quick-btn:hover {
            background: var(--mod04-primary);
            color: var(--mod04-bg);
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px var(--mod04-fg);
        }

        /* 主容器 */
        #mod04-container {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(10, 10, 10, 0.95);
            z-index: 100000;
            display: none;
            flex-direction: column;
            font-family: var(--mod04-font);
            color: var(--mod04-fg);
            overflow: hidden;
        }
        #mod04-container.active { display: flex; }

        /* ThreeJS 背景层 */
        #mod04-canvas-bg {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: -1;
            opacity: 0.3;
            pointer-events: none;
        }

        /* 顶部导航 */
        .mod04-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 2px dashed var(--mod04-fg);
            background: rgba(0,0,0,0.5);
        }
        .mod04-title {
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 2px 2px 0 var(--mod04-primary);
        }
        .mod04-close-btn {
            font-size: 24px;
            cursor: pointer;
            color: var(--mod04-danger);
            transition: transform 0.2s;
        }
        .mod04-close-btn:hover { transform: scale(1.2) rotate(90deg); }

        /* 标签页切换 */
        .mod04-tabs {
            display: flex;
            gap: 10px;
            padding: 10px 20px;
            background: repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 10px, #0a0a0a 10px, #0a0a0a 20px);
        }
        .mod04-tab {
            padding: 5px 15px;
            border: 1px solid var(--mod04-fg);
            cursor: pointer;
            background: var(--mod04-bg);
        }
        .mod04-tab.active {
            background: var(--mod04-fg);
            color: var(--mod04-bg);
            font-weight: bold;
            box-shadow: 3px 3px 0 var(--mod04-primary);
        }

        /* 内容网格区域 */
        .mod04-grid-wrapper {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            position: relative;
        }
        .mod04-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 15px;
            padding-bottom: 60px;
        }

        /* 物品卡片 */
        .mod04-item-card {
            border: 1px solid var(--mod04-fg);
            background: rgba(0,0,0,0.8);
            padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
            aspect-ratio: 1 / 1.2;
        }
        .mod04-item-card:hover {
            border-color: var(--mod04-primary);
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 250, 255, 0.2);
        }
        .mod04-icon-box {
            font-size: 32px;
            margin-bottom: 10px;
            color: var(--mod04-secondary);
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .mod04-item-name {
            font-size: 12px;
            text-align: center;
            word-break: break-all;
            line-height: 1.2;
        }
        .mod04-tag-corner {
            position: absolute;
            top: 2px;
            right: 2px;
            font-size: 10px;
            background: var(--mod04-fg);
            color: var(--mod04-bg);
            padding: 0 4px;
        }

        /* 详情弹窗 (Overlay) */
        .mod04-detail-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(2px);
            z-index: 100010;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        .mod04-detail-overlay.visible {
            opacity: 1;
            pointer-events: auto;
        }

        /* 详情内容框 */
        .mod04-detail-modal {
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            background: var(--mod04-bg);
            border: 2px solid var(--mod04-primary);
            box-shadow: 10px 10px 0 rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            transform: scale(0.9);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            overflow: hidden; /* 内部滚动 */
        }
        .mod04-detail-overlay.visible .mod04-detail-modal {
            transform: scale(1);
        }

        .mod04-detail-header {
            padding: 15px;
            background: var(--mod04-primary);
            color: var(--mod04-bg);
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .mod04-detail-body {
            padding: 20px;
            overflow-y: auto; /* 关键：支持滑动 */
            -webkit-overflow-scrolling: touch;
        }

        /* 详情字段美化 */
        .mod04-field-row {
            margin-bottom: 12px;
            border-bottom: 1px dotted #333;
            padding-bottom: 8px;
        }
        .mod04-label {
            color: var(--mod04-secondary);
            font-size: 0.9em;
            margin-bottom: 4px;
            display: block;
            text-transform: uppercase;
        }
        .mod04-value {
            color: var(--mod04-fg);
            line-height: 1.5;
            white-space: pre-wrap;
        }

        /* 特殊效果高亮 */
        .mod04-effect-highlight {
            color: #aaffaa;
            background: rgba(0, 255, 0, 0.1);
            padding: 0 2px;
            border-radius: 2px;
        }

        /* 彩蛋 Comment */
        .mod04-comment {
            margin-top: 20px;
            padding: 10px;
            border: 1px dashed var(--mod04-danger);
            color: var(--mod04-danger);
            font-style: italic;
            font-size: 0.9em;
            position: relative;
            animation: mod04-glitch 3s infinite;
        }
        @keyframes mod04-glitch {
            0% { opacity: 1; transform: translateX(0); }
            98% { opacity: 1; transform: translateX(0); }
            99% { opacity: 0.8; transform: translateX(2px); }
            100% { opacity: 1; transform: translateX(0); }
        }

        /* 标签组 */
        .mod04-tags {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
            margin-bottom: 10px;
        }
        .mod04-tag {
            font-size: 10px;
            padding: 2px 6px;
            border: 1px solid var(--mod04-fg);
            border-radius: 10px;
        }

        /* 滚动条美化 */
        .mod04-grid-wrapper::-webkit-scrollbar,
        .mod04-detail-body::-webkit-scrollbar {
            width: 6px;
        }
        .mod04-grid-wrapper::-webkit-scrollbar-thumb,
        .mod04-detail-body::-webkit-scrollbar-thumb {
            background: var(--mod04-primary);
        }
        .mod04-grid-wrapper::-webkit-scrollbar-track,
        .mod04-detail-body::-webkit-scrollbar-track {
            background: #111;
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            .mod04-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); }
            .mod04-detail-modal { width: 95%; max-height: 85vh; }
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // ==========================================================================
    // 2. 核心逻辑类
    // ==========================================================================
    class Mod04Inventory {
        constructor() {
            this.isOpen = false;
            this.currentTab = 'items'; // 'items' or 'skills'
            this.data = {};
            this.threeScene = null;

            this.init();
        }

        async init() {
            // 加载 Three.js
            try {
                await loadScript(`${RESOURCE_BASE}/three@0.150.0/build/three.min.js`);
            } catch (e) {
                console.warn('Three.js failed to load, falling back to 2D mode.');
            }

            this.createDOM();
            this.bindTrigger();
            this.bindEvents();
        }

        // 获取数据 (兼容性处理)
        getData() {
            const rawData = window.GameAPI?.assaData?.global_lore || {};
            return {
                items: rawData['背包'] || {},
                skills: rawData['其他技能'] || {}
            };
        }

        createDOM() {
            // 1. 触发按钮
            this.triggerBtn = document.createElement('div');
            this.triggerBtn.className = 'mod04-quick-btn';
            this.triggerBtn.innerHTML = '<i class="fas fa-box-open"></i> INVENTORY';
            document.body.appendChild(this.triggerBtn);

            // 2. 主界面
            const container = document.createElement('div');
            container.id = 'mod04-container';
            container.innerHTML = `
                <div id="mod04-canvas-bg"></div>
                <div class="mod04-header">
                    <div class="mod04-title">System.Data_Log</div>
                    <div class="mod04-close-btn"><i class="fas fa-times"></i></div>
                </div>
                <div class="mod04-tabs">
                    <div class="mod04-tab active" data-tab="items">ITEMS [背包]</div>
                    <div class="mod04-tab" data-tab="skills">SKILLS [技能]</div>
                </div>
                <div class="mod04-grid-wrapper">
                    <div class="mod04-grid" id="mod04-content-grid"></div>
                </div>
            `;
            document.body.appendChild(container);
            this.container = container;
            this.grid = container.querySelector('#mod04-content-grid');

            // 3. 详情弹窗
            this.detailOverlay = document.createElement('div');
            this.detailOverlay.className = 'mod04-detail-overlay';
            this.detailOverlay.innerHTML = `
                <div class="mod04-detail-modal">
                    <div class="mod04-detail-header">
                        <span id="mod04-detail-icon"></span>
                        <span id="mod04-detail-title"></span>
                    </div>
                    <div class="mod04-detail-body" id="mod04-detail-content">
                        <!-- Content injected here -->
                    </div>
                </div>
            `;
            document.body.appendChild(this.detailOverlay);
        }

        // 绑定触发器逻辑 (PC Hover / Mobile Long Press)
        bindTrigger() {
            const orb = document.getElementById('page-character-orb');
            if (!orb) {
                console.warn('Mod04: #page-character-orb not found. Retrying in 1s...');
                setTimeout(() => this.bindTrigger(), 1000);
                return;
            }

            // 更新按钮位置
            const updatePos = () => {
                const rect = orb.getBoundingClientRect();
                // 按钮在球体左侧，垂直居中
                this.triggerBtn.style.top = `${rect.top + rect.height/2 - 15}px`;
                this.triggerBtn.style.left = `${rect.left - 110}px`; // 假设按钮宽约100px
            };

            // PC: Hover
            orb.addEventListener('mouseenter', () => {
                updatePos();
                this.triggerBtn.classList.add('visible');
            });

            // 鼠标离开球体和按钮时隐藏
            let hideTimer;
            const hide = () => {
                hideTimer = setTimeout(() => {
                    this.triggerBtn.classList.remove('visible');
                }, 300);
            };
            const cancelHide = () => clearTimeout(hideTimer);

            orb.addEventListener('mouseleave', hide);
            this.triggerBtn.addEventListener('mouseenter', cancelHide);
            this.triggerBtn.addEventListener('mouseleave', hide);

            // Mobile: Long Press & Slide logic (简化为长按显示)
            let touchTimer;
            orb.addEventListener('touchstart', (e) => {
                touchTimer = setTimeout(() => {
                    updatePos();
                    this.triggerBtn.classList.add('visible');
                }, 600); // 600ms 长按
            }, {passive: true});

            orb.addEventListener('touchend', () => clearTimeout(touchTimer));
            orb.addEventListener('touchmove', () => clearTimeout(touchTimer));

            // 点击按钮打开
            this.triggerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.open();
            });
        }

        bindEvents() {
            // 关闭按钮
            this.container.querySelector('.mod04-close-btn').addEventListener('click', () => this.close());

            // 切换 Tab
            this.container.querySelectorAll('.mod04-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    this.container.querySelectorAll('.mod04-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    this.currentTab = tab.dataset.tab;
                    this.renderGrid();
                });
            });

            // 详情页关闭 (点击空白处)
            this.detailOverlay.addEventListener('click', (e) => {
                if (e.target === this.detailOverlay) {
                    this.closeDetail();
                }
            });
        }

        // ======================================================================
        // 3. 渲染逻辑
        // ======================================================================

        // 字段映射与标准化
        normalizeItem(key, rawItem) {
            // 常见字段映射表
            const map = {
                'info': ['info', '简介', 'desc', 'description'],
                'effect': ['effect', '效果', '特效'],
                'type': ['type', '种类', '类型', 'category'],
                'quality': ['quality', '品质', '等级', 'rank'],
                'num': ['num', '数量', 'count', 'amount'],
                'level': ['level', '等级', 'lv'],
                'icon': ['icon', '图标']
            };

            const normalized = { _raw: rawItem, _key: key };

            // 遍历 rawItem 的所有 key，尝试匹配
            for (const [rawKey, rawVal] of Object.entries(rawItem)) {
                if (rawKey.startsWith('_')) continue; // 过滤私有字段

                let matched = false;
                for (const [stdKey, aliases] of Object.entries(map)) {
                    if (aliases.includes(rawKey.toLowerCase())) {
                        normalized[stdKey] = rawVal;
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    // 未知字段保留原名
                    normalized[rawKey] = rawVal;
                }
            }
            return normalized;
        }

        getIconHtml(item, name) {
            if (item.icon) {
                if (item.icon.startsWith('fa-')) {
                    return `<i class="fas ${item.icon}"></i>`;
                }
                // 假设是 Emoji 或其他字符
                return item.icon;
            }
            // 默认取名字第一个字
            return name.charAt(0);
        }

        renderGrid() {
            this.grid.innerHTML = '';
            const allData = this.getData();
            const source = allData[this.currentTab]; // items or skills

            if (!source || Object.keys(source).length === 0) {
                this.grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:50px;">NO DATA FOUND / 数据丢失</div>';
                return;
            }

            Object.entries(source).forEach(([key, val]) => {
                if (key.startsWith('_')) return;

                const item = this.normalizeItem(key, val);
                const card = document.createElement('div');
                card.className = 'mod04-item-card';

                // 右上角标签 (优先显示数量，其次品质)
                let tag = '';
                if (item.num) tag = `x${item.num}`;
                else if (item.quality) tag = item.quality;
                else if (item.level) tag = `Lv.${item.level}`;

                card.innerHTML = `
                    ${tag ? `<div class="mod04-tag-corner">${tag}</div>` : ''}
                    <div class="mod04-icon-box">${this.getIconHtml(item, key)}</div>
                    <div class="mod04-item-name">${key}</div>
                `;

                card.addEventListener('click', () => this.openDetail(key, item));
                this.grid.appendChild(card);
            });
        }

        // ======================================================================
        // 4. 详情页渲染 (核心难点：递归与美化)
        // ======================================================================
        openDetail(name, item) {
            const iconEl = document.getElementById('mod04-detail-icon');
            const titleEl = document.getElementById('mod04-detail-title');
            const contentEl = document.getElementById('mod04-detail-content');

            iconEl.innerHTML = this.getIconHtml(item, name);
            titleEl.textContent = name;
            contentEl.innerHTML = '';

            // 1. 顶部标签组 (Type, Quality, Level, Num)
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'mod04-tags';
            ['type', 'quality', 'level', 'num'].forEach(field => {
                if (item[field]) {
                    const tag = document.createElement('span');
                    tag.className = 'mod04-tag';
                    // 汉化 key
                    const labelMap = {type:'类型', quality:'品质', level:'等级', num:'数量'};
                    tag.textContent = `${labelMap[field] || field}: ${item[field]}`;
                    tagsDiv.appendChild(tag);
                }
            });
            contentEl.appendChild(tagsDiv);

            // 2. 递归渲染所有字段
            const renderValue = (val) => {
                if (typeof val === 'object' && val !== null) {
                    let html = '<div style="padding-left:10px; border-left:1px solid #333;">';
                    for (const [k, v] of Object.entries(val)) {
                        if (k.startsWith('_')) continue;
                        html += `<div class="mod04-label" style="font-size:0.8em">${k}</div>`;
                        html += `<div class="mod04-value">${renderValue(v)}</div>`;
                    }
                    html += '</div>';
                    return html;
                }
                // 文本处理
                let str = String(val);
                // Effect 正则高亮 【...】
                str = str.replace(/【(.*?)】/g, '<span class="mod04-effect-highlight">【$1】</span>');
                return str;
            };

            // 优先渲染 Info 和 Effect
            const priorityKeys = ['info', 'effect'];
            priorityKeys.forEach(key => {
                if (item[key]) {
                    const row = document.createElement('div');
                    row.className = 'mod04-field-row';
                    row.innerHTML = `
                        <span class="mod04-label">${key === 'info' ? '简介 / INFO' : '效果 / EFFECT'}</span>
                        <div class="mod04-value">${renderValue(item[key])}</div>
                    `;
                    contentEl.appendChild(row);
                }
            });

            // 渲染剩余字段 (排除已渲染的和特殊字段)
            const exclude = ['_raw', '_key', 'icon', 'comment', ...priorityKeys, 'type', 'quality', 'num', 'level'];

            Object.entries(item).forEach(([k, v]) => {
                if (exclude.includes(k)) return;
                const row = document.createElement('div');
                row.className = 'mod04-field-row';
                row.innerHTML = `
                    <span class="mod04-label">${k}</span>
                    <div class="mod04-value">${renderValue(v)}</div>
                `;
                contentEl.appendChild(row);
            });

            // 3. 彩蛋 Comment
            if (item.comment) {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'mod04-comment';
                commentDiv.innerHTML = `// NOTE: ${item.comment}`;
                contentEl.appendChild(commentDiv);
            }

            this.detailOverlay.classList.add('visible');
        }

        closeDetail() {
            this.detailOverlay.classList.remove('visible');
        }

        // ======================================================================
        // 5. Three.js 背景效果
        // ======================================================================
        initThreeJS() {
            if (!window.THREE || this.threeScene) return;

            const container = document.getElementById('mod04-canvas-bg');
            const width = window.innerWidth;
            const height = window.innerHeight;

            const scene = new THREE.Scene();
            // 雾化效果，让远处融入背景
            scene.fog = new THREE.FogExp2(0x0a0a0a, 0.002);

            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.z = 30;

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);

            // 创建一个线框球体 (Cyberpunk Globe)
            const geometry = new THREE.IcosahedronGeometry(15, 2);
            const wireframe = new THREE.WireframeGeometry(geometry);
            const material = new THREE.LineBasicMaterial({
                color: getComputedStyle(document.documentElement).getPropertyValue('--mod04-primary').trim() || 0x00faff,
                transparent: true,
                opacity: 0.3
            });
            const sphere = new THREE.LineSegments(wireframe, material);
            scene.add(sphere);

            // 粒子系统
            const particlesGeo = new THREE.BufferGeometry();
            const particleCount = 500;
            const posArray = new Float32Array(particleCount * 3);
            for(let i=0; i<particleCount*3; i++) {
                posArray[i] = (Math.random() - 0.5) * 100;
            }
            particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const particlesMat = new THREE.PointsMaterial({
                size: 0.1,
                color: getComputedStyle(document.documentElement).getPropertyValue('--mod04-secondary').trim() || 0x7affff
            });
            const particles = new THREE.Points(particlesGeo, particlesMat);
            scene.add(particles);

            this.threeScene = { scene, camera, renderer, sphere, particles };

            const animate = () => {
                if (!this.isOpen) return; // 只有打开时才渲染，节省性能
                requestAnimationFrame(animate);

                sphere.rotation.x += 0.001;
                sphere.rotation.y += 0.002;
                particles.rotation.y -= 0.0005;

                renderer.render(scene, camera);
            };

            // 窗口大小改变
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            this.threeAnimate = animate;
        }

        open() {
            this.isOpen = true;
            this.container.classList.add('active');
            this.renderGrid();

            // 延迟初始化 ThreeJS 以确保 DOM 准备好且不阻塞初次点击
            if (!this.threeScene) {
                setTimeout(() => {
                    this.initThreeJS();
                    if(this.threeAnimate) this.threeAnimate();
                }, 100);
            } else {
                this.threeAnimate();
            }
        }

        close() {
            this.isOpen = false;
            this.container.classList.remove('active');
            this.closeDetail();
        }
    }

    // ==========================================================================
    // 6. 启动
    // ==========================================================================
    // 确保 GameAPI 存在，或者等待它
    const checkAPI = setInterval(() => {
        if (window.GameAPI) {
            clearInterval(checkAPI);
            window.mod04Inventory = new Mod04Inventory();
            console.log('Mod04 Inventory System Loaded.');
        }
    }, 500);

})();
