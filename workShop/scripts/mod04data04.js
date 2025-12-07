(function () {
    // ==========================================================================
    // 1. 基础配置与工具 (Setup & Utils)
    // ==========================================================================
    const MOD_PREFIX = 'mod04';
    const ORB_ID = 'page-character-orb';

    // 获取 GameAPI 变量或回退默认值
    const getVar = (name, def) => {
        if (window.GameAPI && window.GameAPI.getThemeVar) {
            return window.GameAPI.getThemeVar(name) || def;
        }
        return def;
    };

    // 核心配色方案 (融合了 GameAPI 和 赛博超市风格)
    const COLORS = {
        primary: getVar('--primary-color', '#00faff'),
        secondary: getVar('--secondary-color', '#7affff'),
        text: getVar('--text-color', '#e6f1ff'),
        bg: getVar('--background-color', 'rgba(10, 25, 47)'),
        glow: getVar('--glow-color', 'rgba(0, 250, 255, 0.5)'),
        danger: '#ff0055', // 强调色：故障红
        warning: '#ffee00', // 强调色：促销黄
        cardBg: 'rgba(0, 0, 0, 0.85)',
        gridLine: 'rgba(255, 255, 255, 0.1)'
    };

    // 注入 CSS
    const style = document.createElement('style');
    style.innerHTML = `
        /* ==================== 全局变量与重置 ==================== */
        :root {
            --${MOD_PREFIX}-primary: ${COLORS.primary};
            --${MOD_PREFIX}-secondary: ${COLORS.secondary};
            --${MOD_PREFIX}-text: ${COLORS.text};
            --${MOD_PREFIX}-bg: ${COLORS.bg};
            --${MOD_PREFIX}-danger: ${COLORS.danger};
            --${MOD_PREFIX}-warning: ${COLORS.warning};
            --${MOD_PREFIX}-card-bg: ${COLORS.cardBg};
        }

        .${MOD_PREFIX}-hidden { display: none !important; }
        .${MOD_PREFIX}-noscroll { overflow: hidden !important; }

        /* ==================== 触发按钮 (Orb Trigger) ==================== */
        .${MOD_PREFIX}-trigger-btn {
            position: fixed;
            z-index: 9999;
            background: var(--${MOD_PREFIX}-bg);
            border: 1px solid var(--${MOD_PREFIX}-primary);
            color: var(--${MOD_PREFIX}-primary);
            padding: 5px 10px;
            font-family: 'Courier New', monospace;
            font-weight: 900;
            font-size: 12px;
            text-transform: uppercase;
            cursor: pointer;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s, transform 0.3s, clip-path 0.2s;
            clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);
            box-shadow: 2px 2px 0px var(--${MOD_PREFIX}-secondary);
            white-space: nowrap;
        }
.${MOD_PREFIX}-trigger-btn.visible {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(10px); /* 改为向右浮动 */
}
        .${MOD_PREFIX}-trigger-btn:hover {
            background: var(--${MOD_PREFIX}-primary);
            color: #000;
            clip-path: polygon(0 0, 100% 0, 100% 100%, 10% 100%);
            box-shadow: -2px 2px 0px var(--${MOD_PREFIX}-danger);
        }
        /* 移动端适配：按钮更大 */
        @media (max-width: 768px) {
            .${MOD_PREFIX}-trigger-btn {
                padding: 10px 20px;
                font-size: 14px;
            }
        }

        /* ==================== 主界面 (Main Modal) ==================== */
        .${MOD_PREFIX}-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(5, 5, 10, 0.95);
            backdrop-filter: blur(5px);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            font-family: "Segoe UI", "Roboto", sans-serif;
            color: var(--${MOD_PREFIX}-text);
            overflow: hidden;
            animation: ${MOD_PREFIX}-fadeIn 0.3s ease-out;
            /* 网格背景纹理 */
            background-image:
                linear-gradient(var(--${MOD_PREFIX}-grid-bg) 1px, transparent 1px),
                linear-gradient(90deg, var(--${MOD_PREFIX}-grid-bg) 1px, transparent 1px);
            background-size: 40px 40px;
        }

        /* 顶部导航栏 */
        .${MOD_PREFIX}-header {
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            border-bottom: 2px solid var(--${MOD_PREFIX}-primary);
            background: rgba(0,0,0,0.5);
            box-shadow: 0 0 15px var(--${MOD_PREFIX}-primary);
        }
        .${MOD_PREFIX}-title {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 2px 2px 0px var(--${MOD_PREFIX}-danger);
            position: relative;
        }
        .${MOD_PREFIX}-title::after {
            content: "V.1.0";
            font-size: 10px;
            position: absolute;
            bottom: -5px;
            right: -20px;
            color: var(--${MOD_PREFIX}-warning);
        }

        /* 关闭按钮 */
        .${MOD_PREFIX}-close {
            width: 40px; height: 40px;
            border: 2px solid var(--${MOD_PREFIX}-danger);
            color: var(--${MOD_PREFIX}-danger);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            transition: 0.2s;
            background: #000;
        }
        .${MOD_PREFIX}-close:hover {
            background: var(--${MOD_PREFIX}-danger);
            color: #fff;
            transform: rotate(90deg);
        }

        /* 标签页切换 */
        .${MOD_PREFIX}-tabs {
            display: flex;
            gap: 10px;
            padding: 10px 20px;
            background: rgba(0,0,0,0.3);
        }
        .${MOD_PREFIX}-tab {
            padding: 8px 20px;
            border: 1px solid var(--${MOD_PREFIX}-secondary);
            color: var(--${MOD_PREFIX}-secondary);
            cursor: pointer;
            font-size: 14px;
            text-transform: uppercase;
            transition: 0.3s;
            clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%);
        }
        .${MOD_PREFIX}-tab.active {
            background: var(--${MOD_PREFIX}-secondary);
            color: #000;
            font-weight: bold;
            clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);
        }

        /* 内容区域 */
        .${MOD_PREFIX}-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); /* 响应式网格 */
            gap: 15px;
            perspective: 1000px; /* 3D透视 */
        }

        /* ==================== 物品卡片 (Item Card) ==================== */
        .${MOD_PREFIX}-card {
            background: var(--${MOD_PREFIX}-card-bg);
            border: 1px solid var(--${MOD_PREFIX}-primary);
            height: 220px;
            position: relative;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            overflow: hidden;
        }
        .${MOD_PREFIX}-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 10px 20px rgba(0, 250, 255, 0.2);
            border-color: var(--${MOD_PREFIX}-warning);
            z-index: 10;
        }

        /* 卡片装饰线条 */
        .${MOD_PREFIX}-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 2px;
            background: linear-gradient(90deg, var(--${MOD_PREFIX}-primary), transparent);
        }

        /* 图标区域 */
        .${MOD_PREFIX}-card-icon {
            flex: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: var(--${MOD_PREFIX}-text);
            background: radial-gradient(circle, rgba(0,250,255,0.1) 0%, transparent 70%);
        }

        /* 数量标签 (像超市打折贴纸) */
        .${MOD_PREFIX}-card-num {
            position: absolute;
            top: 5px; right: 5px;
            background: var(--${MOD_PREFIX}-warning);
            color: #000;
            font-weight: 900;
            padding: 2px 6px;
            font-size: 12px;
            transform: rotate(15deg);
            box-shadow: 1px 1px 3px rgba(0,0,0,0.5);
            border-radius: 2px;
        }

        /* 信息区域 */
        .${MOD_PREFIX}-card-info {
            flex: 1;
            padding: 10px;
            background: rgba(0,0,0,0.6);
            border-top: 1px dashed var(--${MOD_PREFIX}-secondary);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .${MOD_PREFIX}-card-name {
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .${MOD_PREFIX}-card-type {
            font-size: 10px;
            color: var(--${MOD_PREFIX}-secondary);
            text-transform: uppercase;
            opacity: 0.8;
        }

        /* 品质边框颜色映射 */
        .${MOD_PREFIX}-quality-common { border-color: #aaa; }
        .${MOD_PREFIX}-quality-rare { border-color: #00faff; box-shadow: inset 0 0 10px rgba(0,250,255,0.2); }
        .${MOD_PREFIX}-quality-epic { border-color: #d000ff; box-shadow: inset 0 0 10px rgba(208,0,255,0.2); }
        .${MOD_PREFIX}-quality-legendary { border-color: #ffaa00; box-shadow: inset 0 0 10px rgba(255,170,0,0.2); }

        /* ==================== 详情弹窗 (Detail Drawer) ==================== */
        .${MOD_PREFIX}-detail-overlay {
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            justify-content: flex-end; /* 右侧滑出 */
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
            z-index: 10001;
        }
        .${MOD_PREFIX}-detail-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .${MOD_PREFIX}-detail-panel {
            width: 400px;
            max-width: 90vw;
            height: 100%;
            background: #0a0a10;
            border-left: 4px solid var(--${MOD_PREFIX}-primary);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            box-shadow: -10px 0 30px rgba(0,0,0,0.8);
            /* 票据风格背景 */
            background-image: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 19px,
                rgba(0, 250, 255, 0.05) 20px
            );
        }
        .${MOD_PREFIX}-detail-overlay.active .${MOD_PREFIX}-detail-panel {
            transform: translateX(0);
        }

.${MOD_PREFIX}-detail-header {
    padding: 20px;
    background: var(--${MOD_PREFIX}-primary);
    color: #000;
    position: relative; /* 新增 */
}
.${MOD_PREFIX}-detail-close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    background: #000;
    color: var(--${MOD_PREFIX}-danger);
    border: 2px solid var(--${MOD_PREFIX}-danger);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
    transition: 0.2s;
}
.${MOD_PREFIX}-detail-close:hover {
    background: var(--${MOD_PREFIX}-danger);
    color: #fff;
    transform: rotate(90deg);
}
        .${MOD_PREFIX}-detail-title {
            font-size: 24px;
            font-weight: 900;
            margin-bottom: 5px;
        }
        .${MOD_PREFIX}-detail-meta {
            font-family: monospace;
            font-size: 12px;
            display: flex;
            gap: 10px;
        }

        .${MOD_PREFIX}-detail-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
            font-family: 'Courier New', monospace; /* 打印机字体 */
        }

        .${MOD_PREFIX}-field-block {
            margin-bottom: 20px;
            border-bottom: 1px dashed #333;
            padding-bottom: 10px;
        }
            .${MOD_PREFIX}-comment-block {
    background: rgba(255, 238, 0, 0.05);
    border-left: 3px solid var(--${MOD_PREFIX}-warning);
    padding: 15px;
    margin: 15px 0;
    font-style: italic;
    color: var(--${MOD_PREFIX}-warning);
    position: relative;
}
.${MOD_PREFIX}-comment-block::before {
    content: '"';
    font-size: 40px;
    position: absolute;
    top: -10px;
    left: 10px;
    opacity: 0.3;
}
        .${MOD_PREFIX}-field-label {
            color: var(--${MOD_PREFIX}-secondary);
            font-size: 12px;
            margin-bottom: 5px;
            display: block;
        }
        .${MOD_PREFIX}-field-value {
            color: #fff;
            font-size: 14px;
            line-height: 1.5;
        }

        /* 特殊字段美化 */
        .${MOD_PREFIX}-effect-highlight {
            color: var(--${MOD_PREFIX}-warning);
            font-weight: bold;
            background: rgba(255, 238, 0, 0.1);
            padding: 0 2px;
        }
        .${MOD_PREFIX}-bracket-highlight {
            color: var(--${MOD_PREFIX}-danger);
        }

        /* 动画 */
        @keyframes ${MOD_PREFIX}-fadeIn {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
        }

        /* 滚动条美化 */
        .${MOD_PREFIX}-content::-webkit-scrollbar,
        .${MOD_PREFIX}-detail-body::-webkit-scrollbar {
            width: 8px;
        }
        .${MOD_PREFIX}-content::-webkit-scrollbar-thumb,
        .${MOD_PREFIX}-detail-body::-webkit-scrollbar-thumb {
            background: var(--${MOD_PREFIX}-primary);
            border-radius: 4px;
        }
        .${MOD_PREFIX}-content::-webkit-scrollbar-track,
        .${MOD_PREFIX}-detail-body::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);

    // ==========================================================================
    // 2. 数据处理逻辑 (Data Logic)
    // ==========================================================================

    // 字段映射表 (兼容中英文)
    const KEY_MAP = {
        'info': 'info', '介绍': 'info', 'desc': 'info',
        'effect': 'effect', '效果': 'effect',
        'type': 'type', '种类': 'type', '类型': 'type',
        'quality': 'quality', '品质': 'quality',
        'num': 'num', '数量': 'num', 'count': 'num',
        'level': 'level', '等级': 'level',
        'icon': 'icon'
    };

    // 规范化单个物品数据
    function normalizeItem(key, rawData) {
        let item = { _id: key, _raw: rawData };

        // 如果 rawData 是字符串，直接作为 info
        if (typeof rawData === 'string') {
            item.info = rawData;
            return item;
        }

        // 遍历对象
        for (let k in rawData) {
            let lowerK = k.toLowerCase();
            let mappedKey = KEY_MAP[lowerK] || k; // 如果不在映射表中，保留原key
            item[mappedKey] = rawData[k];
        }

        // 默认值处理
        item.name = item.name || key; // 使用key作为名字如果没名字
        item.num = item.num !== undefined ? item.num : (item.type === 'skill' ? '∞' : 1);

        return item;
    }

    // 获取数据源
    function getDataSource() {
        const lore = window.GameAPI?.assaData?.global_lore || {};
        return {
            items: lore['背包'] || lore['items'] || {},
            skills: lore['其他技能'] || lore['skills'] || {}
        };
    }

    // 解析图标
    function getIconHtml(item) {
        if (item.icon) {
            if (item.icon.startsWith('fa-')) {
                return `<i class="fa ${item.icon}"></i>`; // 假设外部有 FontAwesome
            }
            return item.icon; // 可能是 emoji
        }
        // 默认图标生成逻辑
        if (item.type && item.type.includes('药')) return '💊';
        if (item.type && item.type.includes('书')) return '📖';
        if (item.effect) return '⚡';
        return '📦';
    }

// 解析效果文本 (高亮数值)
function parseEffectText(text) {
    if (!text) return '无特殊效果';
    // 转义 HTML 特殊字符,防止注入
    text = String(text).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // 1. 高亮 【】
    let html = text.replace(/【(.*?)】/g, `<span class="${MOD_PREFIX}-bracket-highlight">【$1】</span>`);
    // 2. 高亮 数值 (+50, -10, 50%)
    html = html.replace(/([+\-±]?\d+(?:\.\d+)?%?)/g, `<span class="${MOD_PREFIX}-effect-highlight">$1</span>`);
    return html;
}

    // ==========================================================================
    // 3. UI 构建与渲染 (UI Rendering)
    // ==========================================================================

    let currentCategory = 'items'; // 'items' or 'skills'

    function createUI() {
        // 移除旧的
        const old = document.querySelector(`.${MOD_PREFIX}-overlay`);
        if (old) old.remove();

        const overlay = document.createElement('div');
        overlay.className = `${MOD_PREFIX}-overlay`;

        // HTML 结构
        overlay.innerHTML = `
            <div class="${MOD_PREFIX}-header">
                <div class="${MOD_PREFIX}-title">INVENTORY</div>
                <div class="${MOD_PREFIX}-close">×</div>
            </div>
            <div class="${MOD_PREFIX}-tabs">
                <div class="${MOD_PREFIX}-tab active" data-cat="items">物资 (ITEMS)</div>
                <div class="${MOD_PREFIX}-tab" data-cat="skills">能力 (SKILLS)</div>
            </div>
            <div class="${MOD_PREFIX}-content" id="${MOD_PREFIX}-grid">
                <!-- 卡片将在这里生成 -->
            </div>

            <!-- 详情侧边栏 -->
            <div class="${MOD_PREFIX}-detail-overlay" id="${MOD_PREFIX}-detail-modal">
     <div class="${MOD_PREFIX}-detail-panel">
    <div class="${MOD_PREFIX}-detail-header">
        <div class="${MOD_PREFIX}-detail-close" id="${MOD_PREFIX}-detail-close">×</div>
        <div class="${MOD_PREFIX}-detail-title" id="d-title"></div>
        <div class="${MOD_PREFIX}-detail-meta" id="d-meta"></div>
    </div>
                    <div class="${MOD_PREFIX}-detail-body" id="d-body"></div>
                    <div style="padding:20px; text-align:center; border-top:1px solid #333; color:#666; font-size:10px;">
                        CLICK OUTSIDE TO CLOSE
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.classList.add(`${MOD_PREFIX}-noscroll`);

        // 绑定事件
        overlay.querySelector(`.${MOD_PREFIX}-close`).onclick = closeUI;

        const tabs = overlay.querySelectorAll(`.${MOD_PREFIX}-tab`);
        tabs.forEach(tab => {
            tab.onclick = () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentCategory = tab.dataset.cat;
                renderGrid();
            };
        });

        // 点击详情遮罩关闭详情
        const detailOverlay = document.getElementById(`${MOD_PREFIX}-detail-modal`);
        detailOverlay.onclick = (e) => {
            if (e.target === detailOverlay) {
                detailOverlay.classList.remove('active');
            }
        };
// 新增:关闭按钮事件
document.getElementById(`${MOD_PREFIX}-detail-close`).onclick = () => {
    detailOverlay.classList.remove('active');
};
        renderGrid();
    }

    function closeUI() {
        const overlay = document.querySelector(`.${MOD_PREFIX}-overlay`);
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
        document.body.classList.remove(`${MOD_PREFIX}-noscroll`);
    }

    function renderGrid() {
        const grid = document.getElementById(`${MOD_PREFIX}-grid`);
        grid.innerHTML = '';

        const data = getDataSource();
        const sourceObj = data[currentCategory];

        if (!sourceObj || Object.keys(sourceObj).length === 0) {
            grid.innerHTML = `<div style="color:#666; text-align:center; width:100%; padding:50px;">NO DATA FOUND / 数据丢失</div>`;
            return;
        }

        Object.keys(sourceObj).forEach(key => {
            const item = normalizeItem(key, sourceObj[key]);
            const card = document.createElement('div');

            // 确定品质颜色类
            let qualityClass = '';
            if (item.quality) {
                if (['rare', '稀有', '蓝'].some(x => String(item.quality).includes(x))) qualityClass = `${MOD_PREFIX}-quality-rare`;
                else if (['epic', '史诗', '紫'].some(x => String(item.quality).includes(x))) qualityClass = `${MOD_PREFIX}-quality-epic`;
                else if (['legendary', '传说', '金'].some(x => String(item.quality).includes(x))) qualityClass = `${MOD_PREFIX}-quality-legendary`;
                else qualityClass = `${MOD_PREFIX}-quality-common`;
            }

            card.className = `${MOD_PREFIX}-card ${qualityClass}`;

            // 卡片内容
            card.innerHTML = `
                ${item.num ? `<div class="${MOD_PREFIX}-card-num">x${item.num}</div>` : ''}
                <div class="${MOD_PREFIX}-card-icon">${getIconHtml(item)}</div>
                <div class="${MOD_PREFIX}-card-info">
                    <div class="${MOD_PREFIX}-card-name">${item.name}</div>
                    <div class="${MOD_PREFIX}-card-type">${item.type || 'UNKNOWN'}</div>
                </div>
            `;

            card.onclick = () => showDetail(item);
            grid.appendChild(card);
        });
    }

    function showDetail(item) {
        const modal = document.getElementById(`${MOD_PREFIX}-detail-modal`);
        const title = document.getElementById('d-title');
        const meta = document.getElementById('d-meta');
        const body = document.getElementById('d-body');

        title.innerText = item.name;
        meta.innerHTML = `
            <span>TYPE: ${item.type || 'N/A'}</span>
            <span>QTY: ${item.num || '1'}</span>
            <span>LV: ${item.level || '-'}</span>
        `;

        // 构建详情内容
        let html = '';

        // 1. 效果 (Effect) - 优先展示
        if (item.effect) {
            html += `
                <div class="${MOD_PREFIX}-field-block">
                    <span class="${MOD_PREFIX}-field-label">/// EFFECT (效果)</span>
                    <div class="${MOD_PREFIX}-field-value">${item.effect}</div>
                </div>
            `;
        }

        // 2. 描述 (Info)
        if (item.info) {
            html += `
                <div class="${MOD_PREFIX}-field-block">
                    <span class="${MOD_PREFIX}-field-label">/// INFO (描述)</span>
                    <div class="${MOD_PREFIX}-field-value">${item.info}</div>
                </div>
            `;
        }
        // 新增: 2.5. 评论 (Comment)
if (item.comment) {
    html += `
        <div class="${MOD_PREFIX}-comment-block">
            <span class="${MOD_PREFIX}-field-label">/// COMMENT (备注)</span>
            <div class="${MOD_PREFIX}-field-value">${item.comment}</div>
        </div>
    `;
}
let otherKeys = Object.keys(item).filter(k => 
    !k.startsWith('_') && // 过滤下划线开头的键
    !['name', 'info', 'effect', 'type', 'num', 'level', 'icon', 'quality', 'comment'].includes(k)
);
         if (otherKeys.length > 0) {
            html += `<div class="${MOD_PREFIX}-field-block"><span class="${MOD_PREFIX}-field-label">/// METADATA (元数据)</span>`;
            otherKeys.forEach(k => {
                let val = item[k];
                if (typeof val === 'object') val = JSON.stringify(val);
                html += `<div style="font-size:12px; color:#888;">[${k}]: ${val}</div>`;
            });
            html += `</div>`;
        }

        body.innerHTML = html;
        modal.classList.add('active');
    }

    // ==========================================================================
    // 4. 触发器逻辑 (Trigger Logic)
    // ==========================================================================

    function initTrigger() {
        const orb = document.getElementById(ORB_ID);
        if (!orb) {
            console.warn(`[${MOD_PREFIX}] Orb #${ORB_ID} not found. Retrying in 1s...`);
            setTimeout(initTrigger, 1000);
            return;
        }

        // 创建按钮
        const btn = document.createElement('div');
        btn.className = `${MOD_PREFIX}-trigger-btn`;
        btn.innerText = "OPEN_INV >>";
        document.body.appendChild(btn);

        // 按钮点击事件
        btn.onclick = (e) => {
            e.stopPropagation(); // 防止点穿
            createUI();
        };

        // 更新按钮位置的函数
 const updatePosition = () => {
    const rect = orb.getBoundingClientRect();
    // 放在球体左侧,垂直居中
    btn.style.top = (rect.top + rect.height / 2 - 15) + 'px';
    btn.style.left = (rect.left - btn.offsetWidth - 10) + 'px'; // 改为左侧
};
        // 显示/隐藏逻辑
        let hideTimer;
        const showBtn = () => {
            clearTimeout(hideTimer);
            updatePosition();
            btn.classList.add('visible');
        };
        const hideBtn = () => {
            hideTimer = setTimeout(() => {
                btn.classList.remove('visible');
            }, 300); // 稍微延迟消失，方便鼠标移过去
        };

        // PC端交互
        orb.addEventListener('mouseenter', showBtn);
        orb.addEventListener('mouseleave', () => {
            // 如果鼠标移到了按钮上，不要隐藏
            setTimeout(() => {
                if (!btn.matches(':hover')) hideBtn();
            }, 50);
        });
        btn.addEventListener('mouseenter', showBtn);
        btn.addEventListener('mouseleave', hideBtn);

        // 移动端交互 (长按/点击)
        let touchTimer;
        orb.addEventListener('touchstart', (e) => {
            touchTimer = setTimeout(showBtn, 500); // 长按500ms显示
        });
        orb.addEventListener('touchend', () => {
            clearTimeout(touchTimer);
        });

        // 监听滚动以更新位置 (因为orb可能是fixed也可能是absolute)
        window.addEventListener('scroll', () => {
            if (btn.classList.contains('visible')) updatePosition();
        });
    }

    // ==========================================================================
    // 5. 启动 (Bootstrap)
    // ==========================================================================

    console.log(`%c [${MOD_PREFIX}] System Loaded`, `color:${COLORS.primary}; background:#000; padding:4px;`);
    initTrigger();

})();
