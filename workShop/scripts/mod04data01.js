(function () {
    // ==========================================================================
    // 1. 基础配置与依赖加载
    // ==========================================================================
    const CONFIG = {
        cdn: {
            three: 'https://unpkg.com/three@0.158.0/build/three.min.js',
            fontAwesome: 'https://unpkg.com/@fortawesome/fontawesome-free@6.5.1/css/all.min.css'
        },
        prefix: 'mod04',
        pageSize: 24 // 每页显示数量
    };

    // 动态加载依赖
    function loadResource(type, url) {
        return new Promise((resolve, reject) => {
            if (type === 'script') {
                if (window.THREE && url.includes('three')) return resolve(); // 已存在
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            } else if (type === 'css') {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                document.head.appendChild(link);
                resolve();
            }
        });
    }

    // ==========================================================================
    // 2. 样式定义 (CSS) - Steam库 x 赛博朋克风格
    // ==========================================================================
    const styles = `
        /* 引入字体 */
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap');

        :root {
            --mod04-primary: ${window.GameAPI?.getThemeVar('--primary-color') || '#00faff'};
            --mod04-secondary: ${window.GameAPI?.getThemeVar('--secondary-color') || '#7affff'};
            --mod04-bg: rgba(10, 25, 47, 0.95);
            --mod04-card-bg: rgba(20, 40, 70, 0.6);
            --mod04-text: #e6f1ff;
            --mod04-text-dim: #8892b0;
            --mod04-border: rgba(0, 250, 255, 0.2);
            --mod04-glow: 0 0 10px rgba(0, 250, 255, 0.3);
            --mod04-font: 'Rajdhani', -apple-system, BlinkMacSystemFont, sans-serif;
               --mod04-canvas-bg: ${window.GameAPI?.getThemeVar('--container-bg-color') || '#020c1b'};
        }

        /* 触发按钮 */
        .mod04-trigger-btn {
            position: fixed;
            padding: 8px 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid var(--mod04-primary);
            border-right: 4px solid var(--mod04-primary);
            color: var(--mod04-primary);
            font-family: var(--mod04-font);
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 2px;
            cursor: pointer;
            z-index: 9;
            opacity: 0;
            transform: translateX(20px); /* 从右往左 */
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%);
            box-shadow: var(--mod04-glow);
            white-space: nowrap;
        }
        .mod04-trigger-btn.visible {
            opacity: 1;
            transform: translateX(0);
            pointer-events: auto;
        }
        .mod04-trigger-btn:hover {
            background: var(--mod04-primary);
            color: #000;
            padding-right: 30px;
            text-shadow: none;
        }

        /* 主容器 */
        #mod04-container {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 100000;
            display: none;
            opacity: 0;
            transition: opacity 0.3s;
            font-family: var(--mod04-font);
            color: var(--mod04-text);
            overflow: hidden;
        }
        #mod04-container.active {
            display: flex;
            opacity: 1;
        }

        /* ThreeJS 背景 */
        #mod04-canvas-bg {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: -1;
            background: radial-gradient(circle at center, #112240 0%, #020c1b 100%);
        }

        /* 布局结构 */
        .mod04-layout {
            display: flex;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(5px);
        }

        /* 左侧导航栏 */
        .mod04-sidebar {
            width: 250px;
            background: rgba(2, 12, 27, 0.8);
            border-right: 1px solid var(--mod04-border);
            display: flex;
            flex-direction: column;
            padding: 20px;
            flex-shrink: 0;
        }
        .mod04-logo {
            font-size: 24px;
            font-weight: bold;
            color: var(--mod04-primary);
            margin-bottom: 40px;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: var(--mod04-glow);
        }
        .mod04-nav-item {
            padding: 15px;
            margin-bottom: 10px;
            cursor: pointer;
            color: var(--mod04-text-dim);
            transition: 0.3s;
            border-left: 3px solid transparent;
            font-size: 18px;
        }
        .mod04-nav-item:hover, .mod04-nav-item.active {
            color: var(--mod04-text);
            background: linear-gradient(90deg, rgba(0, 250, 255, 0.1), transparent);
            border-left-color: var(--mod04-primary);
        }

        /* 主内容区 */
        .mod04-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 20px 40px;
            overflow: hidden;
            position: relative;
        }

        /* 顶部栏 */
        .mod04-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--mod04-border);
            padding-bottom: 10px;
        }
        .mod04-title {
            font-size: 32px;
            font-weight: bold;
        }
        .mod04-close-btn {
            font-size: 24px;
            cursor: pointer;
            color: var(--mod04-text-dim);
            transition: 0.3s;
        }
        .mod04-close-btn:hover {
            color: #ff4d4d;
            transform: rotate(90deg);
        }

        /* 物品网格 */
        .mod04-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 20px;
            overflow-y: auto;
            padding-right: 10px;
            padding-bottom: 50px;
        }
        /* 滚动条美化 */
        .mod04-grid::-webkit-scrollbar, .mod04-detail-content::-webkit-scrollbar {
            width: 6px;
        }
        .mod04-grid::-webkit-scrollbar-thumb, .mod04-detail-content::-webkit-scrollbar-thumb {
            background: var(--mod04-primary);
            border-radius: 3px;
        }

        /* 物品卡片 */
        .mod04-card {
            background: var(--mod04-card-bg);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 4px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
            overflow: hidden;
        }
        .mod04-card:hover {
            transform: translateY(-5px);
            border-color: var(--mod04-primary);
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            background: rgba(30, 60, 100, 0.8);
        }
        .mod04-card-icon {
            font-size: 40px;
            margin-bottom: 15px;
            color: var(--mod04-secondary);
            text-shadow: 0 0 10px rgba(122, 255, 255, 0.5);
        }
        .mod04-card-name {
            font-size: 14px;
            text-align: center;
            font-weight: 600;
            line-height: 1.2;
            margin-bottom: 5px;
        }
        .mod04-card-tag {
            position: absolute;
            top: 5px;
            right: 5px;
            font-size: 10px;
            background: var(--mod04-primary);
            color: #000;
            padding: 2px 4px;
            border-radius: 2px;
            font-weight: bold;
        }
        .mod04-card-num {
            font-size: 12px;
            color: var(--mod04-text-dim);
        }

        /* 分页控件 */
        .mod04-pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
            padding-top: 10px;
        }
        .mod04-page-btn {
            background: transparent;
            border: 1px solid var(--mod04-border);
            color: var(--mod04-text);
            padding: 5px 10px;
            cursor: pointer;
        }
        .mod04-page-btn:hover, .mod04-page-btn.active {
            background: var(--mod04-primary);
            color: #000;
        }

        /* 详情弹窗 (Steam 游戏详情页风格) */
        .mod04-detail-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(2, 12, 27, 0.95);
            z-index: 10;
            display: flex;
            flex-direction: column;
            transform: translateY(100%);
            transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .mod04-detail-overlay.active {
            transform: translateY(0);
        }
        .mod04-detail-header {
            height: 200px;
            background: linear-gradient(to bottom, rgba(0,250,255,0.1), rgba(2,12,27,1));
            display: flex;
            align-items: flex-end;
            padding: 30px;
            position: relative;
            border-bottom: 1px solid var(--mod04-border);
        }
        .mod04-detail-icon-large {
            font-size: 80px;
            margin-right: 30px;
            color: var(--mod04-primary);
            filter: drop-shadow(0 0 15px var(--mod04-primary));
        }
        .mod04-detail-title-group h1 {
            font-size: 48px;
            margin: 0;
            line-height: 1;
            color: #fff;
        }
        .mod04-detail-close {
            position: absolute;
            top: 20px; right: 20px;
            font-size: 30px;
            cursor: pointer;
            color: var(--mod04-text-dim);
        }

        .mod04-detail-body {
            flex: 1;
            display: flex;
            overflow: hidden;
        }
        .mod04-detail-content {
            flex: 2;
            padding: 30px;
            overflow-y: auto;
            font-size: 16px;
            line-height: 1.6;
        }
        .mod04-detail-sidebar {
            flex: 1;
            background: rgba(0,0,0,0.2);
            padding: 30px;
            border-left: 1px solid rgba(255,255,255,0.1);
            overflow-y: auto;
        }

        /* 详情页组件 */
        .mod04-section-title {
            font-size: 14px;
            color: var(--mod04-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 5px;
        }
        .mod04-tag-cloud {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
        }
        .mod04-tag {
            background: rgba(0, 250, 255, 0.1);
            border: 1px solid var(--mod04-border);
            padding: 4px 8px;
            font-size: 12px;
            color: var(--mod04-secondary);
        }
        .mod04-desc-text {
            margin-bottom: 20px;
            color: #ccc;
        }
        .mod04-effect-box {
            background: rgba(77, 255, 136, 0.1);
            border-left: 3px solid #4dff88;
            padding: 15px;
            margin: 15px 0;
            color: #aaffcc;
        }

        /* 彩蛋评论样式 */
        .mod04-comment-box {
            margin-top: 30px;
            background: #fff;
            color: #000;
            padding: 15px;
            transform: rotate(-1deg);
            box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
            font-family: 'Courier New', monospace;
            position: relative;
        }
        .mod04-comment-box::before {
            content: "USER NOTE";
            position: absolute;
            top: -10px; left: 10px;
            background: #ff4d4d;
            color: white;
            padding: 2px 5px;
            font-size: 10px;
            font-weight: bold;
        }

        /* 嵌套JSON展示 */
        .mod04-json-tree {
            margin-left: 10px;
            font-size: 14px;
            color: var(--mod04-text-dim);
        }
        .mod04-json-key { color: var(--mod04-secondary); }

        /* 移动端适配 */
        @media (max-width: 768px) {
            .mod04-layout { flex-direction: column; }
            .mod04-sidebar {
                width: 100%;
                flex-direction: row;
                padding: 10px;
                height: 60px;
                align-items: center;
                justify-content: space-between;
            }
            .mod04-logo { font-size: 18px; margin: 0; }
            .mod04-nav-item { font-size: 14px; padding: 5px 10px; margin: 0; border-left: none; border-bottom: 2px solid transparent; }
            .mod04-nav-item.active { border-bottom-color: var(--mod04-primary); background: none; }

            .mod04-main { padding: 10px; }
            .mod04-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
            .mod04-card { padding: 10px; }
            .mod04-card-icon { font-size: 24px; }

            .mod04-detail-header { height: 120px; padding: 15px; }
            .mod04-detail-icon-large { font-size: 50px; margin-right: 15px; }
            .mod04-detail-title-group h1 { font-size: 24px; }
            .mod04-detail-body { flex-direction: column; overflow-y: auto; }
            .mod04-detail-content, .mod04-detail-sidebar { overflow: visible; flex: none; }
        }
    `;

    // ==========================================================================
    // 3. 数据处理逻辑
    // ==========================================================================
    const DataManager = {
        // 字段汉化映射
        keyMap: {
            'info': '简介', 'effect': '效果', 'type': '类型',
            'quality': '品质', 'num': '数量', 'level': '等级',
            'intro': '介绍', 'desc': '描述'
        },

        getData() {
            // 安全获取数据
            const rawData = window.GameAPI?.assaData?.global_lore || {};
            return {
                items: rawData['背包'] || {},
                skills: rawData['其他技能'] || {}
            };
        },

        // 格式化数据为统一数组
        formatData(sourceObj, category) {
            const list = [];
            for (const [key, value] of Object.entries(sourceObj)) {
                if (key.startsWith('_')) continue; // 过滤隐藏字段

                // 尝试解析嵌套
                let itemData = typeof value === 'string' ? { info: value } : { ...value };

                // 确保有名字
                itemData.name = itemData.name || key;

                // 处理图标
                itemData.displayIcon = this.getIcon(itemData);

                // 处理效果文本
                if (itemData.effect) {
                    itemData.effect = this.parseEffect(itemData.effect, itemData);
                }

                list.push(itemData);
            }
            return list;
        },

        getIcon(item) {
            if (item.icon) {
                // FontAwesome
                if (item.icon.startsWith('fa-')) return `<i class="fas ${item.icon}"></i>`;
                // Emoji (简单判断)
                if (/\p{Emoji}/u.test(item.icon)) return item.icon;
            }
            // 默认取名字第一个字
            return item.name.charAt(0);
        },

        parseEffect(effectStr, item) {
            if (!effectStr) return '';
            // 替换 ${num}
            const numVal = item.num || item.level || 0;
            return effectStr.replace(/\$\{num\}/g, numVal);
        },

        translateKey(key) {
            return this.keyMap[key.toLowerCase()] || key;
        }
    };

    // ==========================================================================
    // 4. UI 构建与交互
    // ==========================================================================
    class InventoryUI {
        constructor() {
            this.state = {
                activeTab: 'items', // 'items' or 'skills'
                currentPage: 1,
                data: [],
                filteredData: []
            };
            this.init();
        }

        async init() {
            // 加载资源
            await loadResource('css', CONFIG.cdn.fontAwesome);
            await loadResource('script', CONFIG.cdn.three);

            // 注入样式
            const styleEl = document.createElement('style');
            styleEl.textContent = styles;
            document.head.appendChild(styleEl);

            // 构建DOM
            this.buildDOM();
            this.setupTrigger();
            this.setupThreeJS();
            this.bindEvents();
        }

        buildDOM() {
            const html = `
                <div id="mod04-container">
                    <div id="mod04-canvas-bg"></div>
                    <div class="mod04-layout">
                        <div class="mod04-sidebar">
                            <div class="mod04-logo"><i class="fas fa-database"></i>ARCHIVE</div>
                            <div class="mod04-nav-item active" data-tab="items"><i class="fas fa-box-open"></i> 物品背包</div>
                            <div class="mod04-nav-item" data-tab="skills"><i class="fas fa-bolt"></i> 技能列表</div>
                        </div>
                        <div class="mod04-main">
                            <div class="mod04-header">
                                <div class="mod04-title" id="mod04-view-title">物品清单</div>
                                <div class="mod04-close-btn"><i class="fas fa-times"></i></div>
                            </div>
                            <div class="mod04-grid" id="mod04-grid"></div>
                            <div class="mod04-pagination" id="mod04-pagination"></div>
                        </div>
                    </div>

                    <!-- 详情抽屉 -->
                    <div class="mod04-detail-overlay" id="mod04-detail">
                        <div class="mod04-detail-header">
                            <div class="mod04-detail-close"><i class="fas fa-times"></i></div>
                            <div class="mod04-detail-icon-large" id="d-icon"></div>
                            <div class="mod04-detail-title-group">
                                <h1 id="d-name">Item Name</h1>
                                <div class="mod04-tag-cloud" id="d-tags-top"></div>
                            </div>
                        </div>
                        <div class="mod04-detail-body">
                            <div class="mod04-detail-content" id="d-content"></div>
                            <div class="mod04-detail-sidebar" id="d-sidebar"></div>
                        </div>
                    </div>
                </div>
                <div class="mod04-trigger-btn" id="mod04-trigger">查看图鉴</div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);

            this.els = {
                container: document.getElementById('mod04-container'),
                grid: document.getElementById('mod04-grid'),
                pagination: document.getElementById('mod04-pagination'),
                detail: document.getElementById('mod04-detail'),
                trigger: document.getElementById('mod04-trigger'),
                title: document.getElementById('mod04-view-title')
            };
        }

        setupTrigger() {
            const orbId = 'page-character-orb';
            const triggerBtn = this.els.trigger;
            let timer = null;

            // 核心逻辑：定位按钮
            const updatePosition = () => {
                const orb = document.getElementById(orbId);
                if (!orb) return;
                const rect = orb.getBoundingClientRect();
                // 按钮在球体左侧，垂直居中
                triggerBtn.style.top = (rect.top + rect.height/2 - 20) + 'px';
                triggerBtn.style.left = (rect.left - 120) + 'px'; // 假设按钮宽约100px
            };

            // PC端 Hover
            document.addEventListener('mousemove', (e) => {
                const orb = document.getElementById(orbId);
                if (!orb) return;

                const rect = orb.getBoundingClientRect();
                // 扩大一点判定范围
                const isHover = (
                    e.clientX >= rect.left - 50 &&
                    e.clientX <= rect.right + 50 &&
                    e.clientY >= rect.top - 50 &&
                    e.clientY <= rect.bottom + 50
                );

                if (isHover) {
                    updatePosition();
                    triggerBtn.classList.add('visible');
                } else if (!triggerBtn.matches(':hover')) {
                    triggerBtn.classList.remove('visible');
                }
            });

            // 移动端长按
            document.addEventListener('touchstart', (e) => {
                const orb = document.getElementById(orbId);
                if (e.target === orb || orb.contains(e.target)) {
                    timer = setTimeout(() => {
                        updatePosition();
                        triggerBtn.classList.add('visible');
                    }, 600); // 600ms 长按
                }
            }, {passive: true});

            document.addEventListener('touchend', () => {
                clearTimeout(timer);
            });

            // 按钮点击
            triggerBtn.addEventListener('click', () => this.open());
        }

        setupThreeJS() {
            if (!window.THREE) return;
            const container = document.getElementById('mod04-canvas-bg');
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true });

            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);

            // 创建粒子系统 (模拟数据流)
            const geometry = new THREE.BufferGeometry();
            const count = 1000;
            const positions = new Float32Array(count * 3);
            for(let i=0; i<count*3; i++) {
                positions[i] = (Math.random() - 0.5) * 20;
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // 获取主题色并转换为十六进制数值
const primaryColor = window.GameAPI?.getThemeVar('--primary-color') || '#00faff';
const hexColor = parseInt(primaryColor.replace('#', ''), 16);

const material = new THREE.PointsMaterial({
    size: 0.05,
    color: hexColor,
    transparent: true,
    opacity: 0.6
});

            const particles = new THREE.Points(geometry, material);
            scene.add(particles);
            camera.position.z = 5;

            const animate = () => {
                if (this.els.container.style.display !== 'none') {
                    requestAnimationFrame(animate);
                    particles.rotation.y += 0.002;
                    particles.rotation.x += 0.001;
                    renderer.render(scene, camera);
                }
            };

            this.threeAnim = animate;
        }

        loadData(tab) {
            this.state.activeTab = tab;
            this.state.currentPage = 1;
            const raw = DataManager.getData();
            this.state.data = DataManager.formatData(raw[tab], tab);
            this.renderGrid();

            // 更新UI状态
            document.querySelectorAll('.mod04-nav-item').forEach(el => {
                el.classList.toggle('active', el.dataset.tab === tab);
            });
            this.els.title.innerText = tab === 'items' ? '物品背包' : '技能列表';
        }

        renderGrid() {
            const { data, currentPage } = this.state;
            const start = (currentPage - 1) * CONFIG.pageSize;
            const end = start + CONFIG.pageSize;
            const pageData = data.slice(start, end);

            this.els.grid.innerHTML = pageData.map((item, index) => `
                <div class="mod04-card" data-idx="${start + index}">
                    ${item.num ? `<div class="mod04-card-tag">x${item.num}</div>` : ''}
                    ${item.level ? `<div class="mod04-card-tag">Lv.${item.level}</div>` : ''}
                    <div class="mod04-card-icon">${item.displayIcon}</div>
                    <div class="mod04-card-name">${item.name}</div>
                    ${item.quality ? `<div class="mod04-card-num" style="color:${this.getQualityColor(item.quality)}">${item.quality}</div>` : ''}
                </div>
            `).join('');

            this.renderPagination(Math.ceil(data.length / CONFIG.pageSize));
        }

        getQualityColor(q) {
            if(/金|Legend|S/.test(q)) return '#ffd700';
            if(/紫|Epic|A/.test(q)) return '#b19cd9';
            if(/蓝|Rare|B/.test(q)) return '#00faff';
            return '#8892b0';
        }

        renderPagination(totalPages) {
            if (totalPages <= 1) {
                this.els.pagination.innerHTML = '';
                return;
            }
            let html = '';
            for (let i = 1; i <= totalPages; i++) {
                html += `<button class="mod04-page-btn ${i === this.state.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            this.els.pagination.innerHTML = html;
        }

        openDetail(item) {
            const d = this.els.detail;

            // 填充头部
            document.getElementById('d-icon').innerHTML = item.displayIcon;
            document.getElementById('d-name').innerText = item.name;

            // 顶部标签
            const tags = [];
            if(item.type) tags.push(item.type);
            if(item.quality) tags.push(item.quality);
            document.getElementById('d-tags-top').innerHTML = tags.map(t => `<span class="mod04-tag">${t}</span>`).join('');

            // 主要内容构建
            let contentHtml = '';

            // 简介
            if (item.info || item.intro || item.desc) {
                contentHtml += `<div class="mod04-section-title">简介</div>`;
                contentHtml += `<div class="mod04-desc-text">${item.info || item.intro || item.desc}</div>`;
            }

            // 效果 (高亮显示)
            if (item.effect) {
                contentHtml += `<div class="mod04-effect-box">
                    <i class="fas fa-magic"></i> <strong>效果:</strong> ${item.effect}
                </div>`;
            }

            // 彩蛋评论
            if (item.comment) {
                contentHtml += `<div class="mod04-comment-box">${item.comment}</div>`;
            }

            document.getElementById('d-content').innerHTML = contentHtml;

            // 侧边栏 (显示所有其他属性)
            let sidebarHtml = `<div class="mod04-section-title">详细参数</div>`;
            sidebarHtml += this.renderJsonTree(item);
            document.getElementById('d-sidebar').innerHTML = sidebarHtml;

            d.classList.add('active');
        }

        renderJsonTree(obj, level = 0) {
            let html = '';
            const ignore = ['name', 'info', 'intro', 'desc', 'effect', 'comment', 'displayIcon', 'icon'];

            for (const [key, val] of Object.entries(obj)) {
                if (ignore.includes(key) && level === 0) continue;
                if (key.startsWith('_')) continue;

                const cnKey = DataManager.translateKey(key);

                if (typeof val === 'object' && val !== null) {
                    html += `<div class="mod04-json-tree" style="margin-left:${level*10}px">
                        <span class="mod04-json-key">${cnKey}:</span>
                        ${this.renderJsonTree(val, level + 1)}
                    </div>`;
                } else {
                    html += `<div class="mod04-json-tree" style="margin-left:${level*10}px">
                        <span class="mod04-json-key">${cnKey}:</span> <span style="color:#fff">${val}</span>
                    </div>`;
                }
            }
            return html;
        }

        bindEvents() {
            // 切换Tab
            document.querySelectorAll('.mod04-nav-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.loadData(e.currentTarget.dataset.tab);
                });
            });

            // 关闭主界面
            document.querySelector('.mod04-close-btn').addEventListener('click', () => this.close());

            // 分页点击
            this.els.pagination.addEventListener('click', (e) => {
                if (e.target.classList.contains('mod04-page-btn')) {
                    this.state.currentPage = parseInt(e.target.dataset.page);
                    this.renderGrid();
                }
            });

            // 物品点击
            this.els.grid.addEventListener('click', (e) => {
                const card = e.target.closest('.mod04-card');
                if (card) {
                    const idx = parseInt(card.dataset.idx);
                    this.openDetail(this.state.data[idx]);
                }
            });

            // 关闭详情页 (点击X 或 点击遮罩空白处)
            const closeDetail = () => this.els.detail.classList.remove('active');
            document.querySelector('.mod04-detail-close').addEventListener('click', closeDetail);

            // 详情页点击空白退出 (针对手机端优化)
            this.els.detail.addEventListener('click', (e) => {
                // 如果点击的是header或者body的背景区域，而不是内容区域
                if (e.target === this.els.detail || e.target.classList.contains('mod04-detail-header')) {
                    closeDetail();
                }
            });
        }

        open() {
            this.els.container.classList.add('active');
            this.loadData('items');
            if (this.threeAnim) this.threeAnim();
        }

        close() {
            this.els.container.classList.remove('active');
            this.els.detail.classList.remove('active');
        }
    }

    // ==========================================================================
    // 5. 启动
    // ==========================================================================
    // 确保DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new InventoryUI());
    } else {
        new InventoryUI();
    }

})();
