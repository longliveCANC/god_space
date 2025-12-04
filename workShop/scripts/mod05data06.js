(function () {
    // ==========================================================================
    // 1. 基础配置与依赖加载 (Configuration & Loader)
    // ==========================================================================
    const CONFIG = {
        cdn: {
            three: 'https://unpkg.com/three@0.158.0/build/three.min.js',
            fontAwesome: 'https://unpkg.com/@fortawesome/fontawesome-free@6.5.1/css/all.min.css'
        },
        prefix: 'mod04',
        theme: {
            constructivistRed: '#D32F2F',
            constructivistCream: '#F0EAD6',
            constructivistBlack: '#121212',
            constructivistGrey: '#2C2C2C'
        }
    };

    // 动态加载CSS和JS
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
                if (window[url]) return resolve(); // 简单去重
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            }
        });
    }

    // ==========================================================================
    // 2. 样式定义 (CSS - Soviet Constructivism Style)
    // ==========================================================================
    const cssStyles = `
        /* 引入字体图标 */
        @import url('${CONFIG.cdn.fontAwesome}');

        :root {
            --mod04-red: ${CONFIG.theme.constructivistRed};
            --mod04-cream: ${CONFIG.theme.constructivistCream};
            --mod04-black: ${CONFIG.theme.constructivistBlack};
            --mod04-grey: ${CONFIG.theme.constructivistGrey};
            --mod04-primary: var(--primary-color, #00faff);
            --mod04-secondary: var(--secondary-color, #7affff);
            --mod04-text: var(--text-color, #e6f1ff);
            --mod04-glow: var(--glow-color, rgba(0, 250, 255, 0.5));
        }

          .mod04-trigger-btn {
        position: absolute; /* 关键：相对于父容器定位 */
        padding: 8px 20px;
        background: var(--mod04-red);
        color: var(--mod04-cream);
        font-family: var(--mod04-font);
        font-size: 14px;
        text-transform: uppercase;
        border: 2px solid var(--mod04-black);
        clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
        cursor: pointer;
        z-index: 9999;
        opacity: 0;
        /* 初始状态：在右侧，并垂直居中 */
        transform: translateX(20px) translateY(-50%) skew(-10deg);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        pointer-events: none;
        box-shadow: 5px 5px 0px var(--mod04-black);
        white-space: nowrap;
    }
    .mod04-trigger-btn.visible {
        opacity: 1;
        /* 可见状态：滑入，并保持垂直居中 */
        transform: translateX(0) translateY(-50%) skew(-10deg);
        pointer-events: auto;
    }
    .mod04-trigger-btn:hover {
        background: var(--mod04-black);
        color: var(--mod04-energy);
        box-shadow: -2px -2px 0px var(--mod04-red);
    }
    .mod04-trigger-btn i { margin-right: 5px; }

        /* 主界面容器 */
        #mod04-inventory-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(10, 10, 10, 0.95);
            z-index: 10001;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            overflow: hidden;
            font-family: var(--base-font-family);
        }
        #mod04-inventory-overlay.active { display: block; opacity: 1; }

        /* Three.js 背景层 */
        #mod04-canvas-bg {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 0;
            pointer-events: none;
            opacity: 0.6;
        }

        /* 内容布局 */
        .mod04-container {
            position: relative;
            z-index: 1;
            width: 90%;
            height: 90%;
            margin: 5vh auto;
            display: flex;
            flex-direction: column;
            border: 4px solid var(--mod04-red);
            background: rgba(20, 20, 20, 0.8);
            box-shadow: 0 0 30px rgba(0,0,0,0.8);
        }

        /* 顶部栏 */
        .mod04-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--mod04-red);
            padding: 10px 20px;
            color: var(--mod04-cream);
            border-bottom: 4px solid var(--mod04-black);
        }
        .mod04-title {
            font-family: 'Impact', sans-serif;
            font-size: 2rem;
            text-transform: uppercase;
            letter-spacing: 3px;
            text-shadow: 2px 2px 0 var(--mod04-black);
        }
        .mod04-close-btn {
            font-size: 2rem;
            cursor: pointer;
            transition: transform 0.2s;
            color: var(--mod04-black);
        }
        .mod04-close-btn:hover { transform: rotate(90deg); color: var(--mod04-cream); }

        /* 标签页切换 */
        .mod04-tabs {
            display: flex;
            background: var(--mod04-black);
        }
        .mod04-tab {
            flex: 1;
            padding: 15px;
            text-align: center;
            cursor: pointer;
            color: var(--mod04-grey);
            font-weight: bold;
            text-transform: uppercase;
            transition: all 0.3s;
            border-right: 1px solid #333;
            position: relative;
            overflow: hidden;
        }
        .mod04-tab.active {
            background: var(--mod04-cream);
            color: var(--mod04-red);
        }
        .mod04-tab:hover:not(.active) {
            color: var(--mod04-primary);
            background: #222;
        }

        /* 物品网格区域 */
        .mod04-grid-wrapper {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 15px;
            align-content: start;
        }
        /* 滚动条美化 */
        .mod04-grid-wrapper::-webkit-scrollbar { width: 8px; }
        .mod04-grid-wrapper::-webkit-scrollbar-track { background: var(--mod04-black); }
        .mod04-grid-wrapper::-webkit-scrollbar-thumb { background: var(--mod04-red); }

        /* 物品卡片 */
        .mod04-item-card {
            background: rgba(40, 40, 40, 0.9);
            border: 2px solid var(--mod04-grey);
            aspect-ratio: 1 / 1.2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            transition: all 0.2s;
            overflow: hidden;
        }
        .mod04-item-card:hover {
            border-color: var(--mod04-primary);
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 250, 255, 0.2);
        }
        .mod04-item-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 0; height: 0;
            border-style: solid;
            border-width: 20px 20px 0 0;
            border-color: var(--mod04-red) transparent transparent transparent;
            z-index: 2;
        }

        .mod04-card-icon {
            font-size: 2.5rem;
            margin-bottom: 10px;
            color: var(--mod04-cream);
        }
        .mod04-card-name {
            font-size: 0.9rem;
            text-align: center;
            padding: 0 5px;
            color: var(--mod04-text);
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .mod04-card-num {
            position: absolute;
            bottom: 2px;
            right: 5px;
            font-size: 0.8rem;
            color: var(--mod04-primary);
            font-weight: bold;
        }
        .mod04-card-quality {
            position: absolute;
            top: 2px;
            right: 2px;
            font-size: 0.6rem;
            padding: 1px 4px;
            background: var(--mod04-grey);
            color: #fff;
            border-radius: 2px;
        }

        /* 详情弹窗 (Modal) */
        .mod04-detail-modal {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(5px);
            z-index: 10;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        .mod04-detail-modal.active {
            opacity: 1;
            pointer-events: auto;
        }

        .mod04-detail-content {
            width: 80%;
            max-width: 600px;
            max-height: 80%;
            background: var(--mod04-black);
            border: 2px solid var(--mod04-primary);
            box-shadow: 10px 10px 0 var(--mod04-red);
            display: flex;
            flex-direction: column;
            position: relative;
            /* 构成主义装饰 */
            background-image:
                linear-gradient(45deg, transparent 48%, var(--mod04-grey) 49%, var(--mod04-grey) 51%, transparent 52%);
            background-size: 20px 20px;
        }

        .mod04-detail-header {
            background: var(--mod04-primary);
            color: var(--mod04-black);
            padding: 15px;
            font-weight: bold;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .mod04-detail-body {
            padding: 20px;
            overflow-y: auto; /* 关键：支持滑动 */
            color: var(--mod04-text);
            flex: 1;
        }

        /* 详情字段美化 */
        .mod04-field-row { margin-bottom: 12px; line-height: 1.5; }
        .mod04-label {
            color: var(--mod04-secondary);
            font-weight: bold;
            margin-right: 5px;
            text-transform: uppercase;
            font-size: 0.85rem;
            border-bottom: 1px solid var(--mod04-red);
        }
        .mod04-value { color: var(--mod04-cream); }

        /* 特殊效果高亮 */
        .mod04-effect-highlight {
            color: var(--success-color, #4dff88);
            font-weight: bold;
        }
        .mod04-effect-negative {
            color: var(--danger-color, #ff4d4d);
        }

        /* 标签化 */
        .mod04-tag {
            display: inline-block;
            padding: 2px 8px;
            margin: 2px;
            background: var(--mod04-grey);
            border: 1px solid var(--mod04-text);
            font-size: 0.8rem;
            transform: skewX(-10deg);
        }

        /* 彩蛋 Comment */
        .mod04-comment {
            margin-top: 15px;
            padding: 10px;
            border: 2px dashed var(--mod04-primary);
            color: var(--mod04-primary);
            font-family: 'Courier New', monospace;
            transform: rotate(-2deg);
            background: rgba(0, 250, 255, 0.05);
            position: relative;
        }
        .mod04-comment::after {
            content: '⚠ NOTE';
            position: absolute;
            top: -10px; right: 10px;
            background: var(--mod04-black);
            padding: 0 5px;
            font-size: 0.8rem;
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            .mod04-container { width: 95%; height: 95%; margin: 2.5vh auto; }
            .mod04-grid-wrapper { grid-template-columns: repeat(3, 1fr); }
            .mod04-detail-content { width: 90%; max-height: 90%; }
            .mod04-quick-btn { padding: 10px 25px; font-size: 16px; } /* 更大的触摸区域 */
        }
    `;

    // ==========================================================================
    // 3. 核心逻辑类 (Core Logic)
    // ==========================================================================
    class InventorySystem {
        constructor() {
            this.isOpen = false;
            this.currentTab = 'items'; // 'items' or 'skills'
            this.data = {};
            this.threeScene = null;

            this.init();
        }

        async init() {
            // 1. 注入CSS
            const styleEl = document.createElement('style');
            styleEl.textContent = cssStyles;
            document.head.appendChild(styleEl);

            // 2. 加载Three.js (异步)
            try {
                await loadResource('js', CONFIG.cdn.three);
                this.initThreeJS();
            } catch (e) {
                console.warn('Three.js failed to load, falling back to CSS bg', e);
            }

            // 3. 构建DOM
            this.buildUI();
            this.setupTrigger();
            this.bindEvents();
        }

        // 获取数据 (兼容性处理)
        getData() {
            try {
                const raw = window.GameAPI.assaData.global_lore;
                return {
                    items: raw['背包'] || {},
                    skills: raw['其他技能'] || {}
                };
            } catch (e) {
                console.error('Data access error:', e);
                return { items: {}, skills: {} };
            }
        }

        // 字段标准化与汉化
        normalizeKey(key) {
            const map = {
                'info': '简介', 'effect': '效果', 'type': '类型',
                'quality': '品质', 'num': '数量', 'level': '等级',
                'intro': '简介', 'desc': '描述'
            };
            return map[key.toLowerCase()] || key;
        }

        // 构建主界面
        buildUI() {
            const overlay = document.createElement('div');
            overlay.id = 'mod04-inventory-overlay';
            overlay.innerHTML = `
                <canvas id="mod04-canvas-bg"></canvas>
                <div class="mod04-container">
                    <div class="mod04-header">
                        <div class="mod04-title"><i class="fas fa-box-open"></i> 物资配给</div>
                        <div class="mod04-close-btn"><i class="fas fa-times"></i></div>
                    </div>
                    <div class="mod04-tabs">
                        <div class="mod04-tab active" data-tab="items">背包物资</div>
                        <div class="mod04-tab" data-tab="skills">战斗技能</div>
                    </div>
                    <div class="mod04-grid-wrapper" id="mod04-grid">
                        <!-- Items go here -->
                    </div>
                </div>

                <!-- 详情弹窗 -->
                <div class="mod04-detail-modal" id="mod04-detail-modal">
                    <div class="mod04-detail-content">
                        <div class="mod04-detail-header" id="mod04-detail-title">
                            <!-- Icon + Name -->
                        </div>
                        <div class="mod04-detail-body" id="mod04-detail-body">
                            <!-- Content -->
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }

     setupTrigger() {
        const orbId = 'page-character-orb';
        let orb = document.getElementById(orbId);

        // 如果orb不存在，则不创建按钮
        if (!orb) {
            setTimeout(() => this.setupTrigger(), 1000); // 1秒后重试
            return;
        }

        const parent = orb.parentElement;
        // 确保父容器是定位上下文
        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        const btn = document.createElement('div');
        btn.className = 'mod04-trigger-btn'; // 使用新的class
        btn.innerHTML = '<i class="fas fa-briefcase"></i> 查看物资';
        parent.appendChild(btn); // 注入到父容器
        this.triggerBtn = btn;

        let timer = null;

        // 动态定位函数 (核心修改)
  const updatePosition = () => {
            if (!orb) return;
            // 基于orb在父容器内的位置来定位
            // top设置为orb的垂直中心
            btn.style.top = (orb.offsetTop + orb.offsetHeight / 2) + 'px';
            // right设置为orb的左侧，留出10px间隙
            btn.style.right = (parent.offsetWidth - orb.offsetLeft + 10) + 'px';
            btn.style.left = 'auto'; // 清除left属性
        };

      // PC端 Hover - 添加延迟隐藏
let hideTimer = null;

const handleEnter = () => {
    clearTimeout(hideTimer);
    updatePosition();
    btn.classList.add('visible');
};

const handleLeave = (e) => {
    // 如果鼠标移动到按钮上，不隐藏
    if (e.relatedTarget === btn || btn.contains(e.relatedTarget)) return;
    
    // 延迟300ms隐藏，给用户时间移动鼠标
    hideTimer = setTimeout(() => {
        btn.classList.remove('visible');
    }, 300);
};

const handleBtnEnter = () => {
    clearTimeout(hideTimer);
};

const handleBtnLeave = () => {
    hideTimer = setTimeout(() => {
        btn.classList.remove('visible');
    }, 300);
};
        // 移动端长按 + 滑动
        let touchTimer;
        let startX, startY;

        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            touchTimer = setTimeout(() => {
                updatePosition();
                btn.classList.add('visible');
            }, 600);
        };

        const handleTouchMove = (e) => {
            if (!startX) return;
            const diffX = e.touches[0].clientX - startX;
            if (diffX < -50 && btn.classList.contains('visible')) {
                this.open();
                btn.classList.remove('visible');
                clearTimeout(touchTimer);
            }
        };

        const handleTouchEnd = () => {
            clearTimeout(touchTimer);
            setTimeout(() => btn.classList.remove('visible'), 2000);
        };

      // 绑定事件
orb.addEventListener('mouseenter', handleEnter);
orb.addEventListener('mouseleave', handleLeave);
orb.addEventListener('touchstart', handleTouchStart, { passive: true });
orb.addEventListener('touchmove', handleTouchMove, { passive: true });
orb.addEventListener('touchend', handleTouchEnd);

btn.addEventListener('click', () => this.open());
btn.addEventListener('mouseenter', handleBtnEnter);
btn.addEventListener('mouseleave', handleBtnLeave);
    }

        // Three.js 背景特效 (苏联构成主义风格几何体)
        initThreeJS() {
            if (!window.THREE) return;
            const canvas = document.getElementById('mod04-canvas-bg');
            const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            // 创建几何体
            const geometry = new THREE.IcosahedronGeometry(1, 0);
            const material = new THREE.MeshBasicMaterial({
                color: CONFIG.theme.constructivistRed,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);

            // 添加一些漂浮的方块
            const cubes = [];
            for(let i=0; i<5; i++) {
                const g = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                const m = new THREE.MeshBasicMaterial({ color: '#00faff', wireframe: true, opacity: 0.2, transparent: true });
                const c = new THREE.Mesh(g, m);
                c.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*5);
                scene.add(c);
                cubes.push(c);
            }

            const animate = () => {
                if (!this.isOpen) {
                    // 暂停渲染以节省性能
                    requestAnimationFrame(animate);
                    return;
                }
                sphere.rotation.x += 0.002;
                sphere.rotation.y += 0.002;

                cubes.forEach((c, i) => {
                    c.rotation.x -= 0.01;
                    c.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
                });

                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            };

            // 监听 Resize
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            animate();
        }

        // 渲染网格列表
        renderGrid() {
            const grid = document.getElementById('mod04-grid');
            grid.innerHTML = '';
            const allData = this.getData();
            const currentData = this.currentTab === 'items' ? allData.items : allData.skills;

            if (!currentData || Object.keys(currentData).length === 0) {
                grid.innerHTML = '<div style="color:#666; width:100%; text-align:center;">暂无数据 / NO DATA</div>';
                return;
            }

            Object.entries(currentData).forEach(([key, value]) => {
                // 过滤 _ 开头的字段
                if (key.startsWith('_')) return;

                const card = document.createElement('div');
                card.className = 'mod04-item-card';

                // 图标处理
                let iconHtml = '';
                if (value.icon) {
                    if (value.icon.startsWith('fa-')) {
                        iconHtml = `<i class="fas ${value.icon} mod04-card-icon"></i>`;
                    } else {
                        // 可能是emoji
                        iconHtml = `<div class="mod04-card-icon">${value.icon}</div>`;
                    }
                } else {
                    // 默认取首字
                    iconHtml = `<div class="mod04-card-icon" style="font-family:serif; font-weight:bold;">${key.charAt(0)}</div>`;
                }

                // 数量/等级显示
                let badge = '';
                if (value.num) badge = `<span class="mod04-card-num">x${value.num}</span>`;
                else if (value.level) badge = `<span class="mod04-card-num">Lv.${value.level}</span>`;

                // 品质显示
                let quality = '';
                if (value.quality || value.品质) {
                    quality = `<span class="mod04-card-quality">${value.quality || value.品质}</span>`;
                }

                card.innerHTML = `
                    ${quality}
                    ${iconHtml}
                    <div class="mod04-card-name">${key}</div>
                    ${badge}
                `;

                card.addEventListener('click', () => this.showDetail(key, value));
                grid.appendChild(card);
            });
        }

        // 递归渲染详情内容
        renderDetailContent(obj) {
            let html = '';

            // 优先处理特定顺序：info, effect, 其他
            const priorityKeys = ['info', '简介', 'effect', '效果', 'comment'];
            const keys = Object.keys(obj).sort((a, b) => {
                const idxA = priorityKeys.indexOf(a.toLowerCase());
                const idxB = priorityKeys.indexOf(b.toLowerCase());
                if (idxA > -1 && idxB > -1) return idxA - idxB;
                if (idxA > -1) return -1;
                if (idxB > -1) return 1;
                return 0;
            });

            keys.forEach(k => {
                if (k.startsWith('_') || k === 'icon' || k === 'name') return; // 跳过内部字段

                const val = obj[k];
                const label = this.normalizeKey(k);

                if (k === 'comment') {
                    html += `<div class="mod04-comment">${val}</div>`;
                    return;
                }

                html += `<div class="mod04-field-row">`;

                if (typeof val === 'object' && val !== null) {
                    html += `<div class="mod04-label">${label}</div>`;
                    html += `<div style="padding-left:15px; border-left: 2px solid #333;">${this.renderDetailContent(val)}</div>`;
                } else {
                    let displayVal = String(val);

                    // 效果字段高亮处理
                    if (label === '效果' || k === 'effect') {
                        // 匹配 【...】
                        displayVal = displayVal.replace(/【(.*?)】/g, (match, content) => {
                            // 简单的正负号着色
                            let colorClass = 'mod04-effect-highlight';
                            if (content.includes('-') && !content.includes('+')) colorClass = 'mod04-effect-negative';
                            return `【<span class="${colorClass}">${content}</span>】`;
                        });
                    }

                    // 标签化处理 (type, quality)
                    if (['类型', '品质'].includes(label)) {
                        displayVal = `<span class="mod04-tag">${displayVal}</span>`;
                    }

                    html += `<span class="mod04-label">${label}:</span> <span class="mod04-value">${displayVal}</span>`;
                }
                html += `</div>`;
            });
            return html;
        }

        // 显示详情
        showDetail(name, data) {
            const modal = document.getElementById('mod04-detail-modal');
            const titleEl = document.getElementById('mod04-detail-title');
            const bodyEl = document.getElementById('mod04-detail-body');

            // 图标
            let iconHtml = '';
            if (data.icon && data.icon.startsWith('fa-')) iconHtml = `<i class="fas ${data.icon}"></i> `;
            else if (data.icon) iconHtml = `${data.icon} `;

            titleEl.innerHTML = `${iconHtml}${name}`;
            bodyEl.innerHTML = this.renderDetailContent(data);

            modal.classList.add('active');
        }

        // 绑定事件
        bindEvents() {
            // 关闭按钮
            document.querySelector('.mod04-close-btn').addEventListener('click', () => this.close());

            // Tab切换
            document.querySelectorAll('.mod04-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    document.querySelectorAll('.mod04-tab').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentTab = e.target.dataset.tab;
                    this.renderGrid();
                });
            });

            // 详情页关闭 (点击空白处)
            const modal = document.getElementById('mod04-detail-modal');
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }

        open() {
            this.isOpen = true;
            document.getElementById('mod04-inventory-overlay').classList.add('active');
            this.renderGrid();
        }

        close() {
            this.isOpen = false;
            document.getElementById('mod04-inventory-overlay').classList.remove('active');
        }
    }

    // ==========================================================================
    // 4. 启动 (Bootstrap)
    // ==========================================================================
    // 确保 GameAPI 存在，或者等待它
    const checkAPI = setInterval(() => {
        if (window.GameAPI) {
            clearInterval(checkAPI);
            window.mod04Inventory = new InventorySystem();
            console.log('%c [MOD04] Inventory System Loaded ', 'background: #D32F2F; color: #fff; font-weight: bold;');
        }
    }, 500);

})();
