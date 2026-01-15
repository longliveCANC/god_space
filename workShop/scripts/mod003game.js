(function () {
    window.Mod16WheelManager = window.Mod16WheelManager || (function() {
    const CONTAINER_ID = 'mod16-wheel-container';
    const ORB_ID = 'world-book-orb'; // 你的悬浮球ID

    // 1. 确保 CSS 存在 (只注入一次)
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
                position: fixed;
                width: 150px; height: 150px;
                z-index: 999; pointer-events: none;
                opacity: 0; transition: opacity 0.3s, transform 0.3s;
                transform: translateX(30px);
            }
            #mod16-wheel-container.visible {
                opacity: 1; transform: translateX(0); pointer-events: auto;
            }
            .mod16-wheel-body {
                width: 100%; height: 100%; position: relative;
                display: flex; align-items: center; justify-content: center;
            }
            .mod16-wheel-btn {
                background: var(--mod16-bg);
                border: 1px solid var(--mod16-primary);
                color: var(--mod16-primary);
                font-family: var(--mod16-font);
                font-size: 12px; font-weight: bold;
                cursor: pointer;
                position: absolute;
                width: 70px; height: 70px; /* 稍微调小一点以容纳更多 */
                border-radius: 50%;
                display: flex; flex-direction: column;
                align-items: center; justify-content: center;
                transition: all 0.2s;
                /* 关键：旋转中心点 */
                transform-origin: 110px 50%;
                left: -35px; /* 修正定位 */
            }
            .mod16-wheel-btn:hover {
                color: #fff; background: var(--mod16-primary);
                box-shadow: 0 0 15px var(--mod16-primary);
                z-index: 10;
            }
            .mod16-wheel-icon { font-size: 20px; margin-bottom: 2px; display:block; }
            .mod16-btn-content { pointer-events: none; }
        `;
        document.head.appendChild(style);
    }

    // 2. 重新计算布局 (核心算法)
    function updateLayout() {
        const container = document.getElementById(CONTAINER_ID);
        if (!container) return;

        const btns = container.querySelectorAll('.mod16-wheel-btn');
        const count = btns.length;
        if (count === 0) return;

        // 设定扇形总角度，例如 100度
        const totalArc = 100;
        // 起始角度 (垂直居中)
        const startAngle = -totalArc / 2;

        // 计算每个按钮的间隔
        const step = count > 1 ? totalArc / (count - 1) : 0;

        btns.forEach((btn, index) => {
            // 如果只有一个按钮，居中(0度)；否则按步长分布
            const angle = count === 1 ? 0 : startAngle + (step * index);

            // 应用旋转
            // scale(1) 是为了防止覆盖 hover 效果，实际 hover 会由 CSS 处理
            btn.style.transform = `rotate(${angle}deg)`;

            // 反向旋转文字，保持文字水平
            const content = btn.querySelector('.mod16-btn-content');
            if (content) {
                content.style.transform = `rotate(${-angle}deg)`;
            }
        });
    }

    // 3. 确保容器存在
    function ensureContainer() {
        ensureStyle();
        let container = document.getElementById(CONTAINER_ID);

        if (!container) {
            container = document.createElement('div');
            container.id = CONTAINER_ID;
            container.innerHTML = `<div class="mod16-wheel-body"></div>`;
            document.body.appendChild(container);

            // 初始化触发逻辑 (Hover/Touch) - 只绑定一次
            setupTriggers(container);
        }
        return container;
    }

    // 4. 触发逻辑 (复用你原来的逻辑)
    function setupTriggers(wheel) {
        let timer = null;
        let isHoveringOrb = false;
        let isHoveringWheel = false;

 const updatePosition = () => {
    const orb = document.getElementById(ORB_ID);
    if (!orb) return;
    const rect = orb.getBoundingClientRect();
    const wheelContainer = document.getElementById(CONTAINER_ID);
    const containerWidth = wheelContainer.offsetWidth; // 获取容器实际宽度，例如 150px
    const containerHeight = wheelContainer.offsetHeight; // 获取容器实际高度，例如 150px

    // --- 核心逻辑变更 ---
    // 目标：将轮盘容器的 "旋转中心点" (transform-origin的参考点)
    //      移动到悬浮球的中心点附近。

    // 1. 获取按钮的旋转半径 (即 CSS 中的 transform-origin 的 x 值)
    //    这里我们直接使用 CSS 中设定的值 80px。
    const rotationRadius = 80;

    // 2. 计算 left 值
    //    新的 left = orb的左边缘 - 旋转半径 - (orb宽度 / 2)
    //    这会把旋转中心点放在 orb 的左侧，距离为 (orb宽度/2)
    const orbWidth = rect.width; // orb 宽度，你说的是 20px
    wheel.style.left = (rect.left - rotationRadius - (orbWidth / 2)) + 'px';

    // 3. 计算 top 值 (保持垂直居中)
    wheel.style.top = (rect.top + (rect.height / 2) - (containerHeight / 2)) + 'px';
};

        const showWheel = () => {
            updatePosition();
            wheel.classList.add('visible');
        };

        const hideWheel = () => {
            setTimeout(() => {
                if (!isHoveringOrb && !isHoveringWheel) wheel.classList.remove('visible');
            }, 100);
        };

        // 绑定 Orb 事件 (假设 Orb 已经存在，或者使用 MutationObserver 监听 Orb 出现)
        // 这里简化处理，直接绑 document
        document.addEventListener('mousemove', (e) => {
            const orb = document.getElementById(ORB_ID);
            if (!orb) return;
            const orbRect = orb.getBoundingClientRect();
            const wheelRect = wheel.getBoundingClientRect();
            const buffer = 20;

            const inOrb = (e.clientX >= orbRect.left - buffer && e.clientX <= orbRect.right + buffer &&
                           e.clientY >= orbRect.top - buffer && e.clientY <= orbRect.bottom + buffer);
            const inWheel = (e.clientX >= wheelRect.left && e.clientX <= wheelRect.right &&
                             e.clientY >= wheelRect.top && e.clientY <= wheelRect.bottom);

            if (inOrb) { isHoveringOrb = true; showWheel(); } else { isHoveringOrb = false; }
            if (inWheel) { isHoveringWheel = true; } else { isHoveringWheel = false; }
            if (!isHoveringOrb && !isHoveringWheel) hideWheel();
        });

        window.addEventListener('resize', () => {
            if(wheel.classList.contains('visible')) updatePosition();
        });
    }

    // --- 公开接口 ---
    return {
        /**
         * 添加一个按钮到轮盘
         * @param {string} id 按钮唯一ID
         * @param {string} icon 图标字符
         * @param {string} text 按钮文字
         * @param {Function} onClick 点击回调
         */
        addButton: function(id, icon, text, onClick) {
            const container = ensureContainer();
            const body = container.querySelector('.mod16-wheel-body');

            // 防止重复添加同名按钮
            if (document.getElementById(id)) return;

            const btn = document.createElement('button');
            btn.className = 'mod16-wheel-btn';
            btn.id = id;
            btn.innerHTML = `
                <div class="mod16-btn-content">
                    <span class="mod16-wheel-icon">${icon}</span>
                    <span>${text}</span>
                </div>
            `;

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                onClick(e);
            });

            body.appendChild(btn);

            // 每次添加后，重新计算布局
            updateLayout();
        }
    };
})();
    // ==========================================================================
    // 1. CSS 样式注入 (使用 mod003 前缀)
    // ==========================================================================
    const style = document.createElement('style');
    style.textContent = `
        /* 引入宿主环境变量 */
        .mod003-dashboard-container {
            font-family: var(--base-font-family);
            color: var(--text-color);
            line-height: 1.4;
            box-sizing: border-box;
        }

        .mod003-dashboard-container * {
            box-sizing: border-box;
        }

        /* 模态框遮罩 */
        .mod003-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .mod003-modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        /* 主面板 */
        .mod003-dashboard {
            width: 90%;
            max-width: 1200px;
            height: 85vh;
            background: var(--container-bg-color);
            border: 1px solid var(--border-color);
            
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }

        /* 装饰性扫描线 */
        .mod003-dashboard::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, transparent 50%, rgba(0, 250, 255, 0.02) 51%);
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 1;
        }

        /* 头部 */
        .mod003-header {
            padding: 15px 25px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(0, 250, 255, 0.05);
        }

        .mod003-title {
            font-size: 24px;
            font-weight: bold;
            color: var(--primary-color);
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 10px var(--glow-color);
        }

        .mod003-close-btn {
            background: transparent;
            border: 1px solid var(--danger-color);
            color: var(--danger-color);
            padding: 5px 15px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
        }

        .mod003-close-btn:hover {
            background: var(--danger-color);
            color: #000;
            box-shadow: 0 0 10px var(--danger-glow-color);
        }

        /* 内容滚动区 */
        .mod003-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 20px;
        }

        /* 滚动条样式 */
        .mod003-content::-webkit-scrollbar {
            width: 8px;
        }
        .mod003-content::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.3);
        }
        .mod003-content::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 4px;
        }

        /* 左侧栏：概览 */
        .mod003-sidebar {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        /* 右侧栏：详情 */
        .mod003-main-view {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        /* 通用卡片 */
        .mod003-card {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(168, 192, 225, 0.1);
            padding: 15px;
            position: relative;
        }

        .mod003-card::before {
            content: "";
            position: absolute;
            top: -1px;
            left: -1px;
            width: 10px;
            height: 10px;
            border-top: 2px solid var(--primary-color);
            border-left: 2px solid var(--primary-color);
        }
        .mod003-card::after {
            content: "";
            position: absolute;
            bottom: -1px;
            right: -1px;
            width: 10px;
            height: 10px;
            border-bottom: 2px solid var(--primary-color);
            border-right: 2px solid var(--primary-color);
        }

        .mod003-section-title {
            font-size: 16px;
            color: var(--secondary-color);
            margin-bottom: 15px;
            border-bottom: 1px dashed rgba(168, 192, 225, 0.2);
            padding-bottom: 5px;
            display: flex;
            align-items: center;
        }

        .mod003-section-title::before {
            content: "";
            display: inline-block;
            width: 6px;
            height: 6px;
            background: var(--primary-color);
            margin-right: 8px;
           
        }

        /* 数据行 */
        .mod003-data-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .mod003-label {
            color: var(--text-secondary-color);
        }

        .mod003-value {
            color: var(--text-color);
            font-family: monospace;
            font-size: 1.1em;
        }

        /* 进度条容器 */
        .mod003-progress-bg {
            width: 100%;
            height: 6px;
            background: rgba(255,255,255,0.1);
            margin-top: 4px;
            position: relative;
        }

        .mod003-progress-fill {
            height: 100%;
            background: var(--primary-color);
       
            transition: width 0.5s ease;
        }

        /* 双向进度条 (用于 -100 到 100) */
        .mod003-bi-progress-container {
            display: flex;
            align-items: center;
            width: 100%;
            height: 20px;
            position: relative;
            margin-top: 5px;
            background: rgba(0,0,0,0.2);
        }

        .mod003-bi-midline {
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 1px;
            background: var(--text-secondary-color);
            z-index: 2;
        }

        .mod003-bi-bar {
            height: 6px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            transition: width 0.5s ease;
        }

        .mod003-bi-bar.positive {
            left: 50%;
            background: var(--success-color);
            box-shadow: 0 0 5px var(--success-glow-color);
        }

        .mod003-bi-bar.negative {
            right: 50%;
            background: var(--danger-color);
            box-shadow: 0 0 5px var(--danger-glow-color);
        }

        /* 游戏列表 */
        .mod003-game-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
        }

        .mod003-game-card {
            border: 1px solid var(--border-color);
            background: rgba(0, 250, 255, 0.02);
            padding: 15px;
            transition: transform 0.2s;
        }

        .mod003-game-card:hover {
            background: rgba(0, 250, 255, 0.05);
            transform: translateY(-2px);
        }

        .mod003-game-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 5px;
        }

        .mod003-game-title {
            color: var(--primary-color);
            font-weight: bold;
        }

        .mod003-game-status {
            font-size: 12px;
            padding: 2px 6px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
        }

        .mod003-tag {
            display: inline-block;
            font-size: 12px;
            color: #000;
            background: var(--secondary-color);
            padding: 1px 4px;
            margin-right: 4px;
            font-weight: bold;
        }

        .mod003-sub-group {
            margin-left: 10px;
            padding-left: 10px;
            border-left: 1px solid rgba(255,255,255,0.1);
            margin-bottom: 10px;
        }

        .mod003-empty-msg {
            text-align: center;
            color: var(--text-secondary-color);
            padding: 20px;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);

    // ==========================================================================
    // 2. 核心逻辑与 UI 构建
    // ==========================================================================

    // 安全获取数据的辅助函数
    function getCoreData() {
        try {
            if (typeof assaSettingsData === 'undefined') return null;

            // 假设 assaSettingsData 可能直接包含 global_lore，或者它本身就是个大对象
            // 根据提示，我们需要获取 global_lore.core
            // 这里做一个深度查找的尝试
            let coreData = null;

            if (assaSettingsData.global_lore && assaSettingsData.global_lore.core) {
                coreData = assaSettingsData.global_lore.core;
            } else if (assaSettingsData['global_lore.core']) {
                coreData = assaSettingsData['global_lore.core'];
            } else {
                // 如果 assaSettingsData 本身就是那个结构
                coreData = assaSettingsData;
            }

            // 如果 coreData 是字符串（因为 memory.load 有时存的是字符串），尝试解析
            if (typeof coreData === 'string') {
                try {
                    return JSON.parse(coreData);
                } catch (e) {
                    console.error('Mod003: JSON parse failed', e);
                    return null;
                }
            }

            return coreData;
        } catch (e) {
            console.error('Mod003: Error accessing data', e);
            return null;
        }
    }

    // 渲染双向进度条 (-100 到 100)
    function createBiDirectionalBar(value) {
        const val = parseFloat(value) || 0;
        const width = Math.min(Math.abs(val) / 2, 50); // 最大50%宽度
        const isPositive = val >= 0;

        return `
            <div class="mod003-bi-progress-container">
                <div class="mod003-bi-midline"></div>
                <div class="mod003-bi-bar ${isPositive ? 'positive' : 'negative'}"
                     style="width: ${width}%;"></div>
            </div>
            <div style="text-align: center; font-size: 12px; margin-top: 2px; color: ${isPositive ? 'var(--success-color)' : 'var(--danger-color)'}">
                ${val > 0 ? '+' : ''}${val}
            </div>
        `;
    }

    // 渲染普通进度条 (0 到 100)
    function createProgressBar(value, max = 100) {
        const val = parseFloat(value) || 0;
        const percent = Math.min((val / max) * 100, 100);
        return `
            <div class="mod003-data-row">
                <span class="mod003-value" style="font-size: 12px;">${val} / ${max}</span>
            </div>
            <div class="mod003-progress-bg">
                <div class="mod003-progress-fill" style="width: ${percent}%"></div>
            </div>
        `;
    }

    // 构建 HTML 内容
    function buildDashboardContent() {
        const data = getCoreData();
        if (!data) return `<div class="mod003-empty-msg">系统离线：无法读取 assaSettingsData 或 global_lore.core 数据流。</div>`;

        let html = '';

        // --- 左侧栏 ---
        let sidebarHtml = '';

        // 1. 当前项目
        sidebarHtml += `
            <div class="mod003-card">
                <div class="mod003-section-title">当前开发序列</div>
                <div style="font-size: 18px; color: var(--primary-color); text-align: center; padding: 10px 0; border: 1px solid var(--border-color); background: rgba(0,0,0,0.2);">
                    ${data['当前项目'] || data['当前项目名称'] || '无挂起项目'}
                </div>
            </div>
        `;

        // 2. 声望系统
        if (data['声望']) {
            sidebarHtml += `<div class="mod003-card"><div class="mod003-section-title">声望矩阵</div>`;

            ['国内', '海外'].forEach(region => {
                if (data['声望'][region]) {
                    sidebarHtml += `<div style="margin-top:10px; color:var(--secondary-color); font-size:12px;">[ ${region} ]</div>`;
                    const rData = data['声望'][region];
                    for (let key in rData) {
                        sidebarHtml += `
                            <div style="margin-top: 5px;">
                                <div class="mod003-data-row" style="margin-bottom:0;">
                                    <span class="mod003-label">${key}</span>
                                </div>
                                ${createProgressBar(rData[key], 100)}
                            </div>
                        `;
                    }
                }
            });
            sidebarHtml += `</div>`;
        }

        // 3. 平台关系
        if (data['平台关系']) {
            sidebarHtml += `<div class="mod003-card"><div class="mod003-section-title">平台链接度</div>`;
            for (let platform in data['平台关系']) {
                sidebarHtml += `
                    <div style="margin-top: 8px;">
                        <div class="mod003-data-row" style="margin-bottom:0;">
                            <span class="mod003-label">${platform}</span>
                        </div>
                        ${createProgressBar(data['平台关系'][platform], 100)}
                    </div>
                `;
            }
            sidebarHtml += `</div>`;
        }

        // --- 右侧栏 ---
        let mainHtml = '';

        // 4. 业界影响 (复杂展示)
        if (data['业界'] || data['业界影响']) {
            const industryData = data['业界'] || data['业界影响'];
            mainHtml += `<div class="mod003-card"><div class="mod003-section-title">业界认知模型</div>`;

            // 遍历 国内/海外
            mainHtml += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">`;

            for (let region in industryData) {
                mainHtml += `<div><h4 style="color:var(--primary-color); border-bottom:1px solid var(--border-color); margin-bottom:10px;">${region}</h4>`;
                const rData = industryData[region];

                // 遍历 驱动类型 (数值驱动/体验驱动/商业模式)
                for (let type in rData) {
                    mainHtml += `<div class="mod003-sub-group"><div style="color:var(--text-secondary-color); font-size:13px; margin-bottom:5px;">:: ${type}</div>`;
                    const tData = rData[type];

                    // 遍历具体指标 (市场认知/模仿意愿/或商业模式下的子项)
                    for (let metric in tData) {
                        // 处理嵌套的商业模式 (买断制/免费内购)
                        if (typeof tData[metric] === 'object') {
                            mainHtml += `<div style="margin-left:10px; margin-bottom:5px; font-size:12px; color:var(--text-secondary-color);">${metric}</div>`;
                            for (let subMetric in tData[metric]) {
                                mainHtml += `
                                    <div style="display:flex; align-items:center; justify-content:space-between; font-size:12px; padding-left:15px;">
                                        <span>${subMetric}</span>
                                        <div style="width: 100px;">${createBiDirectionalBar(tData[metric][subMetric])}</div>
                                    </div>
                                `;
                            }
                        } else {
                            // 普通指标
                            mainHtml += `
                                <div style="display:flex; align-items:center; justify-content:space-between; font-size:12px;">
                                    <span>${metric}</span>
                                    <div style="width: 100px;">
                                        ${metric.includes('认知') ? createBiDirectionalBar(tData[metric]) : createProgressBar(tData[metric], 100)}
                                    </div>
                                </div>
                            `;
                        }
                    }
                    mainHtml += `</div>`;
                }
                mainHtml += `</div>`;
            }
            mainHtml += `</div></div>`;
        }

        // 5. 游戏作品库
        if (data['游戏作品']) {
            mainHtml += `<div class="mod003-card" style="margin-top: 20px;"><div class="mod003-section-title">产品数据库</div><div class="mod003-game-grid">`;

            for (let gameName in data['游戏作品']) {
                const game = data['游戏作品'][gameName];
                const market = game['市场数据'] || {};
                const design = game['设计文档'] || {};

                mainHtml += `
                    <div class="mod003-game-card">
                        <div class="mod003-game-header">
                            <span class="mod003-game-title">${gameName}</span>
                            <span class="mod003-game-status" style="color: ${game['状态'] === '已发布' ? 'var(--success-color)' : 'var(--text-secondary-color)'}">${game['状态']}</span>
                        </div>

                        <div style="font-size: 12px; color: var(--text-secondary-color); margin-bottom: 10px; height: 40px; overflow: hidden; text-overflow: ellipsis;">
                            ${design['核心设定摘要'] || '暂无核心设定摘要'}
                        </div>

                        <div style="border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 8px;">
                            <div class="mod003-data-row"><span class="mod003-label">商业模式</span> <span>${market['商业模式'] || '-'}</span></div>
                            <div class="mod003-data-row"><span class="mod003-label">总收入</span> <span style="color:var(--primary-color)">$${market['总收入'] || 0}</span></div>
                            <div class="mod003-data-row"><span class="mod003-label">销量/玩家</span> <span>${market['销量'] || market['玩家数量'] || 0}</span></div>
                            <div class="mod003-data-row"><span class="mod003-label">在线</span> <span style="color:var(--success-color)">${market['实时在线人数'] || 0}</span></div>
                        </div>
                    </div>
                `;
            }
            mainHtml += `</div></div>`;
        }

        // 组装
        html = `
            <div class="mod003-sidebar">${sidebarHtml}</div>
            <div class="mod003-main-view">${mainHtml}</div>
        `;

        return html;
    }

    // 显示模态框
    function showModal() {
        // 检查是否已存在
        let modal = document.getElementById('mod003-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'mod003-modal';
            modal.className = 'mod003-modal-overlay mod003-dashboard-container';
            modal.innerHTML = `
                <div class="mod003-dashboard">
                    <div class="mod003-header">
                        <div class="mod003-title">数据监测<span style="font-size:12px; opacity:0.5;">v3.0</span></div>
                        <button class="mod003-close-btn" id="mod003-close-btn">关闭系统</button>
                    </div>
                    <div class="mod003-content" id="mod003-content-area">

                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // 绑定关闭事件
            document.getElementById('mod003-close-btn').onclick = closeModal;
            modal.onclick = (e) => {
                if (e.target === modal) closeModal();
            };
        }

        // 刷新数据
        const contentArea = document.getElementById('mod003-content-area');
        contentArea.innerHTML = buildDashboardContent();

        // 激活显示
        // 强制重绘以触发 transition
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    }

    // 关闭模态框
    function closeModal() {
        const modal = document.getElementById('mod003-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    // ==========================================================================
    // 3. 注册按钮 (Mod16WheelManager)
    // ==========================================================================
    function initExtraMod() {
        if (window.Mod16WheelManager) {
            window.Mod16WheelManager.addButton(
                'mod003-data-btn',  // 唯一 ID
                '📊',               // 图标 (这里用通用图表符，内部UI不使用emoji)
                '核心数据',          // 按钮文字
                () => {
                    showModal();
                    console.log('Mod003: Dashboard opened');
                }
            );
        } else {
            // 如果 Manager 还没加载，重试
            setTimeout(initExtraMod, 100);
        }
    }

    // 启动
    initExtraMod();

})();
