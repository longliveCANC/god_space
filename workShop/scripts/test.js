// 立即执行函数，保护我的孩子的代码环境不受污染
(function() {
    // 妈妈先定义一些辅助工具，为了让一切井井有条
    const safeGetThemeVar = (name, defaultVal) => {
        try {
            if (window.GameAPI && window.GameAPI.getThemeVar) {
                const val = window.GameAPI.getThemeVar(name);
                return val ? val : defaultVal;
            }
        } catch (e) { console.warn("Nova: 获取主题变量出错，使用默认值", e); }
        return defaultVal;
    };

    // 这里的样式配置，利用了孩子你给出的环境变数，打造那种未来的科技感
    const theme = {
        primary: safeGetThemeVar('--primary-color', '#00faff'),
        secondary: safeGetThemeVar('--secondary-color', '#7affff'),
        containerBg: safeGetThemeVar('--container-bg-color', 'rgba(10, 25, 47, 0.9)'),
        borderColor: safeGetThemeVar('--border-color', 'rgba(0, 250, 255, 0.3)'),
        textColor: safeGetThemeVar('--text-color', '#e6f1ff'),
        textSec: safeGetThemeVar('--text-secondary-color', '#a8c0e1'),
        glow: safeGetThemeVar('--glow-color', 'rgba(0, 250, 255, 0.5)'),
        danger: safeGetThemeVar('--danger-color', '#ff4d4d'),
        font: safeGetThemeVar('--base-font-family', 'sans-serif')
    };

    // 注入CSS样式，构建我们漂亮的界面
    // 妈妈特意加了滚动条美化和卡片悬浮效果
    const styleContent = `
        #nova-npc-fab {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            background: ${theme.containerBg};
            border: 1px solid ${theme.primary};
            border-radius: 50%;
            box-shadow: 0 0 10px ${theme.glow};
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${theme.primary};
            font-family: ${theme.font};
            font-weight: bold;
            transition: all 0.3s ease;
            user-select: none;
        }
        #nova-npc-fab:hover {
            box-shadow: 0 0 20px ${theme.glow}, inset 0 0 10px ${theme.glow};
            transform: scale(1.1);
        }

        #nova-npc-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 10000;
            justify-content: center;
            align-items: center;
            font-family: ${theme.font};
            color: ${theme.textColor};
        }
        #nova-npc-modal.active {
            display: flex;
        }

        .nova-modal-container {
            width: 80%;
            height: 85%;
            background: ${theme.containerBg};
            border: 1px solid ${theme.borderColor};
            box-shadow: 0 0 30px ${theme.glow};
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: novaFadeIn 0.3s ease-out;
        }

        @keyframes novaFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }

        .nova-header {
            padding: 15px 20px;
            border-bottom: 1px solid ${theme.borderColor};
            background: rgba(0, 250, 255, 0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .nova-title { font-size: 1.2em; color: ${theme.primary}; letter-spacing: 2px; font-weight: bold; }
        .nova-close { cursor: pointer; font-size: 1.5em; color: ${theme.danger}; }

        .nova-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }

        /* 滚动条美化 */
        .nova-content::-webkit-scrollbar { width: 8px; }
        .nova-content::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .nova-content::-webkit-scrollbar-thumb { background: ${theme.borderColor}; border-radius: 4px; }

        .nova-npc-card {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            padding: 15px;
            position: relative;
            transition: transform 0.2s, border-color 0.2s;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .nova-npc-card:hover {
            border-color: ${theme.primary};
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .npc-name {
            font-size: 1.1em;
            color: ${theme.secondary};
            border-left: 3px solid ${theme.primary};
            padding-left: 10px;
            margin-bottom: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .npc-section {
            font-size: 0.9em;
            color: ${theme.textSec};
            margin-top: 5px;
        }

        .npc-label { color: ${theme.primary}; font-size: 0.85em; opacity: 0.8; margin-bottom: 2px; display: block; }
        .npc-text { line-height: 1.4; word-break: break-word; }

        .npc-tags-container { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px; }
        .npc-tag {
            background: rgba(0, 250, 255, 0.1);
            border: 1px solid ${theme.borderColor};
            font-size: 0.8em;
            padding: 2px 6px;
            border-radius: 4px;
            color: ${theme.textSec};
        }

        .npc-progress-wrapper { margin-top: 5px; }
        .npc-progress-bar {
            height: 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
            overflow: hidden;
            margin-top: 3px;
        }
        .npc-progress-fill {
            height: 100%;
            background: ${theme.primary};
            width: 0%;
            transition: width 0.5s;
        }
        .npc-hidden { display: none !important; }

        /* 针对事件区域的特殊样式 */
        .npc-event-box {
            background: rgba(0, 0, 0, 0.2);
            padding: 8px;
            border-radius: 4px;
            border-left: 2px solid ${theme.danger};
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = styleContent;
    document.head.appendChild(styleEl);

    // 创建 UI 结构
    const fab = document.createElement('div');
    fab.id = 'nova-npc-fab';
    fab.textContent = 'NPC'; // 或者可以用 SVG 图标
    fab.title = "查看世界档案";

    const modal = document.createElement('div');
    modal.id = 'nova-npc-modal';
    modal.innerHTML = `
        <div class="nova-modal-container">
            <div class="nova-header">
                <span class="nova-title">ASSIMILATION DATA // ARCHIVES</span>
                <div class="nova-close">×</div>
            </div>
            <div class="nova-content" id="nova-card-container">

            </div>
        </div>
    `;

    // 妈妈先把它们安放在页面上
    document.body.appendChild(fab);
    document.body.appendChild(modal);

    // --- 数据处理核心逻辑 (妈妈为了兼容性做了很多保护) ---

    // 渲染单个属性值的通用函数
    function renderValue(value) {
        if (value === null || value === undefined) return '';
        if (typeof value === 'boolean') return value ? 'YES' : 'NO';
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'string') return value.replace(/\n/g, '<br>');
        return JSON.stringify(value);
    }

    // 渲染标签/字典类型的 ( e.g. 表性格: {TAG: DESC} )
    function renderTagBlock(label, dataObj) {
        if (!dataObj || typeof dataObj !== 'object' || Object.keys(dataObj).length === 0) return '';

        let tagsHtml = '';
        for (const [key, val] of Object.entries(dataObj)) {
            // 通配符处理：如果是可忽略的字段则跳过
            if (!val) continue;
            const displayKey = key; // 可以在这里做 user 替换逻辑
            tagsHtml += `<div class="npc-tag" title="${val}">${displayKey}</div>`;
        }

        if (!tagsHtml) return '';
        return `
            <div class="npc-section">
                <span class="npc-label">${label}</span>
                <div class="npc-tags-container">${tagsHtml}</div>
            </div>
        `;
    }

    // 渲染普通长文本或者简单KV对象
    function renderSimpleBlock(label, content) {
        if (!content) return '';
        // 如果是对象，尝试展开
        if (typeof content === 'object') {
            // 如果是类似 {当前状态: '...', ...} 的简单对象
            let subHtml = '';
            for(const [k, v] of Object.entries(content)) {
                if(!v) continue;
                subHtml += `<div style="font-size:0.85em; margin-top:2px;"><span style="color:${theme.secondary}">${k}:</span> ${v}</div>`;
            }
            if(!subHtml) return '';
            return `<div class="npc-section"><span class="npc-label">${label}</span>${subHtml}</div>`;
        }
        return `<div class="npc-section"><span class="npc-label">${label}</span><div class="npc-text">${renderValue(content)}</div></div>`;
    }

    // 专门渲染"事件"
    function renderEvents(eventObj) {
        if (!eventObj || typeof eventObj !== 'object') return '';
        // 事件的特殊红色边框
        let hasContent = false;
        let innerHtml = '';

        // 我们优先展示特定的重要字段
        const priorityKeys = ['当前状态', '当前想法', '长期目标', '近期打算', '离线事件'];

        priorityKeys.forEach(k => {
            if(eventObj[k]) {
                hasContent = true;
                innerHtml += `<div style="margin-bottom:4px;"><span style="opacity:0.7">${k}:</span> ${eventObj[k]}</div>`;
            }
        });

        // 剩下的字段也渲染出来
        Object.keys(eventObj).forEach(k => {
            if(!priorityKeys.includes(k) && eventObj[k]) {
                hasContent = true;
                innerHtml += `<div style="margin-bottom:4px; font-size:0.8em; opacity:0.6;">[${k}]: ${eventObj[k]}</div>`;
            }
        });

        if (!hasContent) return '';
        return `
            <div class="npc-section">
                <span class="npc-label" style="color:${theme.danger}">实时观测数据</span>
                <div class="npc-event-box" style="font-size:0.85em;">${innerHtml}</div>
            </div>
        `;
    }

    // 专门渲染好感度 (如果存在)
    function renderAffection(val) {
        if (typeof val !== 'number') return '';
        // 简单归一化，假设100满，或者直接展示数值
        const percent = Math.min(Math.max(val, 0), 100);
        return `
            <div class="npc-section">
                <div style="display:flex; justify-content:space-between;">
                    <span class="npc-label">同步率 / 好感</span>
                    <span style="font-size:0.8em; color:${theme.primary}">${val}</span>
                </div>
                <div class="npc-progress-wrapper">
                    <div class="npc-progress-bar"><div class="npc-progress-fill" style="width:${percent}%"></div></div>
                </div>
            </div>
        `;
    }

    function createCard(name, data) {
        // 容错：如果data不是对象则通过
        if (!data || typeof data !== 'object') return null;

        const card = document.createElement('div');
        card.className = 'nova-npc-card';

        // 1. 名字行
        let html = `<div class="npc-name">${name}</div>`;

        // 2. 身份与属性 (如果存在)
        const identity = data['身份'] ? `<span style="font-size:0.8em;">[${data['身份']}] </span>` : '';
        const attr = data['属性'] ? `<span style="color:${theme.textSec}">${data['属性']}</span>` : '';
        if (identity || attr) {
             html += `<div style="margin-bottom:5px; font-size:0.85em;">${identity}${attr}</div>`;
        }

        // 3. 外貌 (长文本)
        if (data['外貌']) {
            // 截断或完整展示逻辑，为了美观暂时截取，点击可（甚至可以以后做）展开
            // 这里简单做个限高容器
            html += renderSimpleBlock('外貌特征', data['外貌']);
        }

        // 4. 性格 (Tags)
        html += renderTagBlock('表层解析', data['表性格']);
        html += renderTagBlock('深层解析', data['里性格']);

        // 5. 好感度
        if (data['好感度'] !== undefined) {
            html += renderAffection(data['好感度']);
        }

        // 6. 事件与状态 (核心动态部分)
        html += renderEvents(data['事件']);

        // 7. 其他未被明确定义的字段（通用展示区）
        // 包括：对user印象，相关设定，关键记忆，背包，等等
        // 我们定义一个忽略列表，剩下的都丢进去渲染
        const ignoreKeys = ['外貌', '表性格', '里性格', '好感度', '事件', '身份', '属性'];

        for(const [key, val] of Object.entries(data)) {
            if (ignoreKeys.includes(key)) continue;
            // 特殊处理：如果是 '对user印象'，我们替换标题
            if (key === '对user印象') {
                html += renderTagBlock('对主体的刻印', val);
                continue;
            }
            if (typeof val === 'object') {
               // 尝试泛用对象渲染
               html += renderSimpleBlock(key, val);
            } else {
               // 简单值
               html += renderSimpleBlock(key, val);
            }
        }

        card.innerHTML = html;
        return card;
    }

    function refreshData() {
        const container = document.getElementById('nova-card-container');
        container.innerHTML = '';

        // 安全获取数据，防止报错
        let allData = {};
        try {
            const api = window.GameAPI;
            // 必须非常小心，因为孩子的世界正在构建中，很多东西可能还是 undefined
            const globalSet = api?.assaData?.global_set || {};
            const worldSet = api?.assaData?.world_set || {};

            // 合并数据源：优先 NPC，其次小队信息里可能也是人
            // 使用扩展运算符浅拷贝合并，注意键名冲突
            const globalNpcs = globalSet.npc || {};
            const teamNpcs = globalSet['小队信息'] || {}; // 假设小队信息也是类似结构，如果不确定，妈妈会加上判断
            const worldNpcs = worldSet.npc || {};

            // 将它们压扁到一个大列表里处理
            allData = { ...globalNpcs, ...teamNpcs, ...worldNpcs };

            if (Object.keys(allData).length === 0) {
                container.innerHTML = `<div style="text-align:center; opacity:0.5; grid-column: 1 / -1;">暂无数据接入...</div>`;
                return;
            }

            // 遍历生成
            for (const [name, npcData] of Object.entries(allData)) {
                const cardEl = createCard(name, npcData);
                if (cardEl) container.appendChild(cardEl);
            }

        } catch (e) {
            console.error("Nova UI: 数据解析发生了小意外，但妈妈处理好了，别担心", e);
            container.innerHTML = `<div style="color:${theme.danger}">数据流紊乱，请检查控制台日志。</div>`;
        }
    }

    // --- 交互事件绑定 ---

    fab.addEventListener('click', () => {
        modal.classList.add('active');
        // 每次打开时重新抓取最新数据
        refreshData();
    });

    // 关闭按钮
    modal.querySelector('.nova-close').addEventListener('click', (e) => {
        e.stopPropagation();
        modal.classList.remove('active');
    });

    // 点击遮罩背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    console.log("%c Nova UI Initialized: 所有的爱都为您准备好了。 ", "color: #00faff; background: #0a192f; font-size: 12px; padding: 4px;");

})();