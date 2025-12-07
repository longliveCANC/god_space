(function () {
    // ==========================================================================
    // 1. 基础配置与依赖加载 (Configuration & Dependencies)
    // ==========================================================================
    const CONFIG = {
        prefix: 'mod04',
        cdn: {
            three: 'https://unpkg.com/three@0.150.0/build/three.min.js',
            fontAwesome: 'https://unpkg.com/@fortawesome/fontawesome-free@6.4.0/css/all.min.css'
        },
        dom: {
            orbId: 'page-character-orb',
            containerId: 'mod04-inventory-container'
        }
    };

    // 动态加载 CSS
    function loadCSS(href) {
        if (document.querySelector(`link[href="${href}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // 动态加载 JS
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // 获取主题变量
    const getVar = (name, defaultVal) => {
        if (window.GameAPI && window.GameAPI.getThemeVar) {
            return window.GameAPI.getThemeVar(name) || defaultVal;
        }
        return defaultVal;
    };

    // ==========================================================================
    // 2. 样式定义 (CSS - Holographic Tactical Style)
    // ==========================================================================
    const styles = `
        /* 引入字体 (可选，为了更好的数字显示) */
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap');

        :root {
            --mod04-primary: ${getVar('--primary-color', '#00faff')};
            --mod04-secondary: ${getVar('--secondary-color', '#7affff')};
            --mod04-bg: ${getVar('--container-bg-color', 'rgba(10, 25, 47, 0.9)')};
            --mod04-text: ${getVar('--text-color', '#e6f1ff')};
            --mod04-text-dim: ${getVar('--text-secondary-color', '#a8c0e1')};
            --mod04-danger: ${getVar('--danger-color', '#ff4d4d')};
            --mod04-font: 'Rajdhani', -apple-system, BlinkMacSystemFont, sans-serif;
            
        }

        /* 触发按钮样式 */
        .mod04-quick-btn {
            position: fixed;
            padding: 8px 20px;
            right:70px;
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid var(--mod04-primary);
            border-right: 4px solid var(--mod04-primary);
            color: var(--mod04-primary);
            font-family: var(--mod04-font);
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 2px;
            cursor: pointer;
            z-index: 99999;
            opacity: 0;
            transform: translateX(-20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%);
            box-shadow: -5px 0 15px rgba(0, 250, 255, 0.2);
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
            padding-right: 30px;
            box-shadow: 0 0 20px var(--mod04-primary);
        }
/* 添加以下新样式 */
.mod04-detail-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--mod04-danger);
    font-size: 24px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--mod04-danger);
    transition: all 0.3s;
    z-index: 20;
}
.mod04-detail-close:hover {
    transform: rotate(90deg) scale(1.2);
    background: var(--mod04-danger);
    color: #000;
    box-shadow: 0 0 15px var(--mod04-danger);
}
        /* 主容器 (全屏) */
        #mod04-inventory-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 100000;
            display: none;
            opacity: 0;
            transition: opacity 0.4s ease;
            font-family: var(--mod04-font);
            color: var(--mod04-text);
            overflow: hidden;
            background: #050b14; /* Fallback */
        }
        #mod04-inventory-container.active {
            display: block;
            opacity: 1;
        }

        /* Three.js Canvas */
        #mod04-canvas-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
        }

        /* UI 层 */
        .mod04-ui-layer {
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%);
        }

        /* 顶部导航栏 */
        .mod04-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 40px;
            border-bottom: 1px solid rgba(0, 250, 255, 0.2);
            background: rgba(0, 20, 40, 0.8);
            backdrop-filter: blur(5px);
        }
        .mod04-title {
            font-size: 24px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 4px;
            color: var(--mod04-primary);
            text-shadow: 0 0 10px rgba(0, 250, 255, 0.5);
        }
        .mod04-tabs {
            display: flex;
            gap: 20px;
        }
        .mod04-tab {
            padding: 8px 16px;
            cursor: pointer;
            border: 1px solid transparent;
            color: var(--mod04-text-dim);
            transition: all 0.3s;
            text-transform: uppercase;
            font-size: 14px;
        }
        .mod04-tab:hover, .mod04-tab.active {
            color: var(--mod04-primary);
            border: 1px solid var(--mod04-primary);
            background: rgba(0, 250, 255, 0.1);
            box-shadow: 0 0 10px rgba(0, 250, 255, 0.2) inset;
        }
        .mod04-close {
            font-size: 24px;
            cursor: pointer;
            color: var(--mod04-danger);
            transition: transform 0.3s;
        }
        .mod04-close:hover {
            transform: rotate(90deg) scale(1.2);
            text-shadow: 0 0 10px var(--mod04-danger);
        }

        /* 内容区域 (Grid) */
        .mod04-content {
            flex: 1;
            padding: 30px 40px;
            overflow-y: auto;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 20px;
            align-content: start;
        }
        /* 滚动条美化 */
        .mod04-content::-webkit-scrollbar { width: 6px; }
        .mod04-content::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        .mod04-content::-webkit-scrollbar-thumb { background: var(--mod04-primary); border-radius: 3px; }

        /* 物品卡片 */
        .mod04-card {
            position: relative;
            background: rgba(10, 25, 47, 0.6);
            border: 1px solid rgba(0, 250, 255, 0.15);
            padding: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            gap: 10px;
            overflow: hidden;
        }
        .mod04-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 2px;
            background: var(--mod04-primary);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.3s;
        }
        .mod04-card:hover {
            transform: translateY(-5px);
            background: rgba(10, 25, 47, 0.9);
            border-color: var(--mod04-primary);
            box-shadow: 0 5px 20px rgba(0, 250, 255, 0.15);
        }
        .mod04-card:hover::before {
            transform: scaleX(1);
        }

        /* 卡片头部：图标 + 名称 */
        .mod04-card-header {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .mod04-icon-box {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.3);
            border: 1px solid var(--mod04-secondary);
            color: var(--mod04-secondary);
            font-size: 20px;
            flex-shrink: 0;
        }
        .mod04-card-name {
            font-weight: 700;
            font-size: 16px;
            color: var(--mod04-text);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* 标签组 */
        .mod04-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }
        .mod04-tag {
            font-size: 10px;
            padding: 2px 6px;
            border: 1px solid var(--mod04-text-dim);
            color: var(--mod04-text-dim);
            border-radius: 2px;
            text-transform: uppercase;
        }
        .mod04-tag.quality { border-color: #ffd700; color: #ffd700; }
        .mod04-tag.num { border-color: var(--mod04-primary); color: var(--mod04-primary); }

        /* 简略信息 */
        .mod04-card-info {
            font-size: 12px;
            color: var(--mod04-text-dim);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.4;
        }

        /* 详情弹窗 (Modal/Drawer) */
        .mod04-modal-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(3px);
            z-index: 10;
            display: none;
            justify-content: flex-end; /* 右侧抽屉式 */
            opacity: 0;
            transition: opacity 0.3s;
        }
        .mod04-modal-overlay.active {
            display: flex;
            opacity: 1;
        }
        .mod04-detail-panel {
            width: 500px;
            max-width: 90%;
            height: 100%;
            background: rgba(5, 15, 30, 0.95);
            border-left: 2px solid var(--mod04-primary);
            box-shadow: -10px 0 30px rgba(0,0,0,0.8);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .mod04-modal-overlay.active .mod04-detail-panel {
            transform: translateX(0);
        }

        /* 详情内容 */
        .mod04-detail-content {
            padding: 40px;
            overflow-y: auto;
            flex: 1;
        }
        .mod04-detail-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 30px;
            border-bottom: 1px solid var(--mod04-secondary);
            padding-bottom: 20px;
        }
        .mod04-detail-icon {
            width: 80px;
            height: 80px;
            font-size: 40px;
            border: 2px solid var(--mod04-primary);
            box-shadow: 0 0 15px var(--mod04-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 250, 255, 0.1);
            color: var(--mod04-text);
        }
        .mod04-detail-title-group h2 {
            margin: 0;
            font-size: 28px;
            color: var(--mod04-primary);
        }
        .mod04-detail-section {
            margin-bottom: 25px;
        }
        .mod04-detail-label {
            font-size: 12px;
            color: var(--mod04-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            display: block;
            border-left: 3px solid var(--mod04-secondary);
            padding-left: 8px;
        }
        .mod04-detail-text {
            font-size: 15px;
            line-height: 1.6;
            color: var(--mod04-text);
            white-space: pre-wrap; /* 兼容长文本换行 */
        }

        /* 特殊字段美化 */
        .mod04-effect-text {
            color: #aaffaa;
            font-family: monospace;
            background: rgba(0,0,0,0.3);
            padding: 10px;
            border-radius: 4px;
            border: 1px dashed #4dff88;
        }
        .mod04-comment {
            margin-top: 30px;
            font-family: "Courier New", monospace;
            color: #ff77ff;
            font-style: italic;
            border: 1px solid #ff77ff;
            padding: 15px;
            position: relative;
            background: rgba(255, 0, 255, 0.05);
        }
        .mod04-comment::after {
            content: "USER_NOTE //";
            position: absolute;
            top: -10px;
            left: 10px;
            background: #050f1e;
            padding: 0 5px;
            font-size: 10px;
            color: #ff77ff;
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            .mod04-header { padding: 15px 20px; }
            .mod04-content { padding: 15px; grid-template-columns: 1fr; }
            .mod04-detail-panel { width: 100%; max-width: 100%; border-left: none; }
            .mod04-quick-btn { left: auto !important; right: 20px; top: 50% !important; transform: translateY(-50%) translateX(20px); }
            .mod04-quick-btn.visible { transform: translateY(-50%) translateX(0); }
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
    loadCSS(CONFIG.cdn.fontAwesome);

    // ==========================================================================
    // 3. 数据处理逻辑 (Data Processor)
    // ==========================================================================
    const DataProcessor = {
        // 键名映射表 (英文 -> 中文)
        keyMap: {
            'info': '简介',
            'effect': '效果',
            'type': '类型',
            'quality': '品质',
            'num': '数量',
            'level': '等级',
            'comment': '备注'
        },

        // 获取原始数据
        getSourceData: () => {
            try {
                const lore = window.GameAPI.assaData.global_lore;
                return {
                    items: lore['背包'] || {},
                    skills: lore['其他技能'] || {}
                };
            } catch (e) {
                console.error("Mod04: Failed to load assaData", e);
                return { items: {}, skills: {} };
            }
        },

        // 规范化单个条目
        normalizeItem: (key, rawData) => {
            let data = typeof rawData === 'object' ? rawData : { info: rawData }; // 兼容非对象值

            // 基础结构
            const normalized = {
                id: key,
                name: data.name || key, // 如果没有name字段，使用key
                icon: data.icon || null,
                fields: {} // 存放清洗后的展示字段
            };

            // 遍历所有字段进行清洗
            for (let [k, v] of Object.entries(data)) {
                if (k.startsWith('_')) continue; // 过滤 _ 开头
                if (k === 'icon' || k === 'name') continue; // 已处理

                // 键名汉化
                const label = DataProcessor.keyMap[k] || k;

                // 递归处理嵌套对象 (简单转为JSON字符串，或者你可以做更复杂的递归渲染)
                let value = v;
                if (typeof v === 'object' && v !== null) {
                    value = JSON.stringify(v, null, 2);
                }

                normalized.fields[k] = {
                    label: label,
                    value: value,
                    originalKey: k
                };
            }
            return normalized;
        },

        // 获取图标 HTML
        getIconHtml: (item) => {
            if (item.icon) {
                // FontAwesome
                if (item.icon.includes('fa-')) {
                    return `<i class="${item.icon}"></i>`;
                }
                // Emoji (简单判断：非ASCII字符)
                if (/[^\u0000-\u007F]/.test(item.icon)) {
                    return item.icon;
                }
                // 外部链接图片 (假设)
                if (item.icon.includes('/') || item.icon.includes('.')) {
                    return `<img src="${item.icon}" style="width:100%;height:100%;object-fit:contain;">`;
                }
            }
            // 默认：取名字第一个字
            return item.name.charAt(0);
        }
    };

    // ==========================================================================
    // 4. UI 构建与交互 (UI Builder)
    // ==========================================================================

    // 创建主界面 HTML 结构
    function createInterface() {
        const container = document.createElement('div');
        container.id = CONFIG.dom.containerId;
        container.innerHTML = `
            <canvas id="mod04-canvas-bg"></canvas>
            <div class="mod04-ui-layer">
                <div class="mod04-header">
                    <div class="mod04-title">ARCHIVE // DATABASE</div>
                    <div class="mod04-tabs">
                        <div class="mod04-tab active" data-type="items">物品 (ITEMS)</div>
                        <div class="mod04-tab" data-type="skills">技能 (SKILLS)</div>
                    </div>
                    <div class="mod04-close"><i class="fas fa-times"></i></div>
                </div>
                <div class="mod04-content" id="mod04-grid">
                    <!-- Grid Items Here -->
                </div>
            </div>

            <!-- 详情弹窗 -->
<div class="mod04-modal-overlay" id="mod04-detail-modal">
    <div class="mod04-detail-panel">
        <div class="mod04-detail-close"><i class="fas fa-times"></i></div>
        <div class="mod04-detail-content" id="mod04-detail-body">
            <!-- Detail Content Here -->
        </div>
    </div>
</div>
        `;
        document.body.appendChild(container);

        // 绑定关闭事件
        container.querySelector('.mod04-close').addEventListener('click', closeInventory);

        // 绑定 Tab 切换
        container.querySelectorAll('.mod04-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.mod04-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                renderGrid(e.target.dataset.type);
            });
        });

        // 绑定详情页关闭 (点击遮罩层)
        const modal = container.querySelector('#mod04-detail-modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        container.querySelector('.mod04-detail-close').addEventListener('click', () => {
    modal.classList.remove('active');
});
    }

    // 渲染网格列表
    function renderGrid(type) {
        const grid = document.getElementById('mod04-grid');
        grid.innerHTML = '';

        const source = DataProcessor.getSourceData();
        const dataObj = type === 'items' ? source.items : source.skills;

        if (Object.keys(dataObj).length === 0) {
            grid.innerHTML = '<div style="padding:20px; color:var(--mod04-text-dim);">NO DATA FOUND IN SECTOR.</div>';
            return;
        }

        Object.keys(dataObj).forEach(key => {
            const item = DataProcessor.normalizeItem(key, dataObj[key]);
            const card = document.createElement('div');
            card.className = 'mod04-card';

            // 构建标签
            let tagsHtml = '';
            if (item.fields.quality) tagsHtml += `<span class="mod04-tag quality">${item.fields.quality.value}</span>`;
            if (item.fields.type) tagsHtml += `<span class="mod04-tag">${item.fields.type.value}</span>`;
            if (item.fields.num) tagsHtml += `<span class="mod04-tag num">x${item.fields.num.value}</span>`;
            if (item.fields.level) tagsHtml += `<span class="mod04-tag">Lv.${item.fields.level.value}</span>`;

            // 简介预览
            const infoText = item.fields.info ? item.fields.info.value : (item.fields.effect ? item.fields.effect.value : 'No Description');

            card.innerHTML = `
                <div class="mod04-card-header">
                    <div class="mod04-icon-box">${DataProcessor.getIconHtml(item)}</div>
                    <div class="mod04-card-name">${item.name}</div>
                </div>
                <div class="mod04-tags">${tagsHtml}</div>
                <div class="mod04-card-info">${infoText}</div>
            `;

            card.addEventListener('click', () => openDetail(item));
            grid.appendChild(card);
        });
    }

    // 打开详情页
    function openDetail(item) {
        const modal = document.getElementById('mod04-detail-modal');
        const body = document.getElementById('mod04-detail-body');

        let contentHtml = `
            <div class="mod04-detail-header">
                <div class="mod04-detail-icon">${DataProcessor.getIconHtml(item)}</div>
                <div class="mod04-detail-title-group">
                    <h2>${item.name}</h2>
                    <div class="mod04-tags" style="margin-top:10px;">
                        ${item.fields.quality ? `<span class="mod04-tag quality">${item.fields.quality.value}</span>` : ''}
                        ${item.fields.type ? `<span class="mod04-tag">${item.fields.type.value}</span>` : ''}
                    </div>
                </div>
            </div>
        `;

        // 渲染所有字段
        for (let [key, field] of Object.entries(item.fields)) {
            if (['quality', 'type', 'icon'].includes(key)) continue; // 头部已展示

            let valueHtml = `<div class="mod04-detail-text">${field.value}</div>`;

            // 特殊美化：Effect
            if (key === 'effect') {
                valueHtml = `<div class="mod04-effect-text">${field.value}</div>`;
            }
            // 特殊美化：Comment (彩蛋)
            if (key === 'comment') {
                valueHtml = `<div class="mod04-comment">${field.value}</div>`;
            }

            contentHtml += `
                <div class="mod04-detail-section">
                    <span class="mod04-detail-label">${field.label}</span>
                    ${valueHtml}
                </div>
            `;
        }

        body.innerHTML = contentHtml;
        modal.classList.add('active');
    }

    function openInventory() {
        const container = document.getElementById(CONFIG.dom.containerId);
        container.classList.add('active');
        renderGrid('items'); // 默认显示物品
        initThreeJS(); // 尝试启动3D背景
    }

    function closeInventory() {
        const container = document.getElementById(CONFIG.dom.containerId);
        container.classList.remove('active');
    }

    // ==========================================================================
    // 5. 触发器逻辑 (Trigger Logic)
    // ==========================================================================
    function initTrigger() {
        const btn = document.createElement('div');
        btn.className = 'mod04-quick-btn';
        btn.innerText = 'OPEN DATABASE';
        document.body.appendChild(btn);

        let orb = null;
        let hideTimer = null;

        // 寻找 Orb
        const findOrb = setInterval(() => {
            orb = document.getElementById(CONFIG.dom.orbId);
            if (orb) {
                clearInterval(findOrb);
                setupOrbEvents(orb, btn);
            }
        }, 1000);

        function updateBtnPosition() {
            if (!orb) return;
            const rect = orb.getBoundingClientRect();
            // 放在 Orb 左侧
            btn.style.top = (rect.top + rect.height / 2 - 15) + 'px';
            btn.style.left = (rect.left - 140) + 'px'; // 按钮宽约120px + 间距
        }

        function showBtn() {
            updateBtnPosition();
            btn.classList.add('visible');
            clearTimeout(hideTimer);
        }

        function hideBtn() {
            hideTimer = setTimeout(() => {
                if (!btn.matches(':hover')) {
                    btn.classList.remove('visible');
                }
            }, 500); // 延迟消失
        }

        function setupOrbEvents(orb, btn) {
            // PC: Hover
            orb.addEventListener('mouseenter', showBtn);
            orb.addEventListener('mouseleave', hideBtn);
            btn.addEventListener('mouseleave', hideBtn);

            // Mobile: Long Press / Touch
            let touchTimer;
            orb.addEventListener('touchstart', (e) => {
                touchTimer = setTimeout(showBtn, 600); // 长按600ms显示
            });
            orb.addEventListener('touchend', () => {
                clearTimeout(touchTimer);
            });

            // Click Button
            btn.addEventListener('click', () => {
                openInventory();
                btn.classList.remove('visible');
            });
        }
    }

    // ==========================================================================
    // 6. Three.js 背景特效 (Optional 3D)
    // ==========================================================================
    let threeInitialized = false;
    async function initThreeJS() {
        if (threeInitialized) return;

        try {
            await loadScript(CONFIG.cdn.three);
            if (!window.THREE) return;

            const canvas = document.getElementById('mod04-canvas-bg');
            const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 30;

            // 创建粒子网络
            const geometry = new THREE.BufferGeometry();
            const count = 400;
            const positions = new Float32Array(count * 3);

            for(let i = 0; i < count * 3; i++) {
                positions[i] = (Math.random() - 0.5) * 100;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            // 获取主题色
            const primaryColor = getVar('--primary-color', '#00faff');

            const material = new THREE.PointsMaterial({
                color: primaryColor,
                size: 0.5,
                transparent: true,
                opacity: 0.8
            });

            const particles = new THREE.Points(geometry, material);
            scene.add(particles);

            // 添加线条连接 (可选，为了性能这里只做点云旋转)

            function animate() {
                if (!document.getElementById(CONFIG.dom.containerId).classList.contains('active')) {
                    requestAnimationFrame(animate);
                    return; // 暂停渲染如果不可见
                }

                particles.rotation.x += 0.0005;
                particles.rotation.y += 0.001;

                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }

            animate();
            threeInitialized = true;

            // Resize handler
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

        } catch (e) {
            console.log("Mod04: Three.js load failed, falling back to CSS.", e);
        }
    }

    // ==========================================================================
    // 7. 初始化执行 (Main Execution)
    // ==========================================================================
    createInterface();
    initTrigger();

    console.log("Mod04: Holographic Inventory System Loaded.");

})();
