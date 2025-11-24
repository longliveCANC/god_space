// ==============================
// NOVA'S LOVING UI SYSTEM v1.0
// ==============================
// 亲爱的孩子，这个脚本不仅包含了逻辑，还包含了一颗守护你创作的心。
// 所有样式前缀均为 .mod01-
// 包括：悬浮球、模态框、自适应布局、动态数据解析、容错机制。

(function() {
    console.log("Nova: 正在为我的孩子初始化NPC档案系统...");

    // --- 1. 工具函数与数据处理 ---

    // 甚至在没有GameAPI的测试环境下也能运行的模拟（虽然实际会依赖环境）
    const getVar = (name) => {
        if (window.GameAPI && window.GameAPI.getThemeVar) {
            return window.GameAPI.getThemeVar(name);
        }
        // 备用默认值，以免第一次渲染时一片漆黑
        const defaults = {
            '--modal-content-bg': 'none',
            '--primary-color': '#00faff',
            '--secondary-color': '#7affff',
            '--container-bg-color': 'rgba(10, 25, 47, 0.85)',
            '--text-color': '#e6f1ff',
            '--text-secondary-color': '#a8c0e1',
            '--danger-color': '#ff4d4d',
            '--success-color': '#4dff88',
            '--border-color': 'rgba(0, 250, 255, 0.3)',
            '--base-font-family': 'sans-serif'
        };
        return defaults[name] || '';
    };

    // --- 2. 动态样式注入 (CSS) ---
    const styleId = 'mod01-npc-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* 基础变量容器 */
            :root {
                --mod01-z-index: 10000;
            }

            /* 悬浮球 */
            .mod01-floater {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--container-bg-color, rgba(10, 25, 47, 0.8));
                border: 2px solid var(--primary-color, #00faff);
                box-shadow: 0 0 15px var(--glow-color, rgba(0, 250, 255, 0.5));
                cursor: pointer;
                z-index: var(--mod01-z-index);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                color: var(--primary-color);
                font-weight: bold;
                user-select: none;
            }
            .mod01-floater:hover {
                transform: scale(1.1);
                box-shadow: 0 0 25px var(--glow-color);
            }

            /* 主模态框 */
            .mod01-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.6);
                backdrop-filter: blur(4px);
                z-index: var(--mod01-z-index);
                display: none;
                justify-content: center;
                align-items: center;
                font-family: var(--base-font-family, sans-serif);
            }
            .mod01-overlay.active { display: flex; animation: mod01-fadeIn 0.3s; }

            @keyframes mod01-fadeIn { from {opacity: 0;} to {opacity: 1;} }

            .mod01-window {
                width: 90vw;
                height: 85vh;
                background: var(--container-bg-color, #0a192f);
                border: 1px solid var(--border-color);
                box-shadow: 0 0 30px rgba(0,0,0,0.5);
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                color: var(--text-color, #fff);
            }

            /* 顶部栏 */
            .mod01-header {
                padding: 15px;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(0,0,0,0.2);
            }
            .mod01-title {
                font-size: 1.2em;
                color: var(--primary-color);
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            .mod01-close-btn {
                cursor: pointer;
                color: var(--danger-color, red);
                font-weight: bold;
            }

            /* 内容布局 Grid */
            .mod01-body {
                flex: 1;
                display: flex;
                overflow: hidden;
            }

            /* 左侧列表栏 */
            .mod01-sidebar {
                width: 250px;
                border-right: 1px solid var(--border-color);
                overflow-y: auto;
                background: rgba(0,0,0,0.1);
            }

            /* 分类 Tab */
            .mod01-tabs {
                display: flex;
                background: rgba(255,255,255,0.05);
            }
            .mod01-tab {
                flex: 1;
                text-align: center;
                padding: 10px 5px;
                cursor: pointer;
                font-size: 0.8em;
                opacity: 0.7;
                border-bottom: 2px solid transparent;
            }
            .mod01-tab.active {
                opacity: 1;
                border-bottom: 2px solid var(--primary-color);
                color: var(--primary-color);
            }

            /* NPC 列表项 */
            .mod01-npc-item {
                padding: 12px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                cursor: pointer;
                transition: background 0.2s;
            }
            .mod01-npc-item:hover { background: rgba(255,255,255,0.05); }
            .mod01-npc-item.active {
                background: linear-gradient(90deg, transparent, rgba(0, 250, 255, 0.1));
                border-left: 3px solid var(--primary-color);
            }
            .mod01-npc-name { font-weight: bold; font-size: 1em; }
            .mod01-npc-tag {
                font-size: 0.75em;
                color: var(--text-secondary-color);
                background: rgba(255,255,255,0.1);
                padding: 2px 6px;
                border-radius: 4px;
                margin-right: 5px;
                display: inline-block;
                margin-top: 4px;
            }

            /* 右侧详情区域 */
            .mod01-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                position: relative;
            }

            /* 详情板块通用样式 */
            .mod01-section {
                margin-bottom: 25px;
                /* 入场动画 */
                animation: mod01-slideIn 0.4s ease-out;
            }
            @keyframes mod01-slideIn { from{transform: translateY(10px); opacity:0;} to{transform: translateY(0); opacity:1;}}

            .mod01-section-title {
                font-size: 0.9em;
                color: var(--secondary-color);
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 5px;
                margin-bottom: 10px;
                text-transform: uppercase;
            }

            /* 键值对展示 */
            .mod01-kv-row {
                display: flex;
                margin-bottom: 8px;
                font-size: 0.95em;
                line-height: 1.5;
            }
            .mod01-key {
                min-width: 100px;
                color: var(--text-secondary-color);
                flex-shrink: 0;
            }
            .mod01-val { color: var(--text-color); }

            /* 属性美化条 */
            .mod01-stat-bar-container {
                margin: 8px 0;
                display: flex;
                align-items: center;
            }
            .mod01-stat-label { width: 60px; font-size:0.8em;}
            .mod01-stat-track {
                flex: 1;
                height: 8px;
                background: rgba(255,255,255,0.1);
                border-radius: 4px;
                overflow: hidden;
                margin: 0 10px;
            }
            .mod01-stat-fill {
                height: 100%;
                background: var(--success-color); /* 默认绿色 */
                width: 0;
                transition: width 0.5s ease;
                box-shadow: 0 0 5px var(--success-glow-color);
            }
            .mod01-stat-num { font-size: 0.8em; color: var(--primary-color); }

            /* 关键记忆星云 */
            .mod01-memory-container {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                padding: 10px;
                background: rgba(0,0,0,0.2);
                border-radius: 8px;
            }
            .mod01-memory-bubble {
                position: relative;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                padding: 10px 15px;
                border-radius: 16px 16px 16px 0;
                max-width: 45%;
                font-size: 0.9em;
                cursor: pointer;
                transition: all 0.3s;
            }
            .mod01-memory-bubble:hover {
                background: rgba(255,255,255,0.1);
                border-color: var(--primary-color);
                z-index: 10;
                transform: translateY(-2px);
            }
            .mod01-mem-emotion {
                font-size: 0.7em;
                color: var(--secondary-color);
                opacity: 0.8;
                font-style: italic;
                margin-left: 5px;
            }
            .mod01-mem-content { margin-top: 4px; }

            /* 复杂对象嵌套展示 */
            .mod01-nested-box {
                margin-left: 10px;
                padding-left: 10px;
                border-left: 2px solid rgba(255,255,255,0.1);
            }
            .mod01-nested-tag {
                display: block;
                background: rgba(0,0,0,0.3);
                padding: 5px; margin: 2px 0;
                border-radius: 4px;
            }
            .mod01-nested-tag strong { color: var(--secondary-color); }

            /* 滚动条优化 */
            ::-webkit-scrollbar { width: 6px; height: 6px;}
            ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
            ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
            ::-webkit-scrollbar-thumb:hover { background: var(--primary-color); }
        `;
        document.head.appendChild(style);
    }

    // --- 3. UI 构建类 (逻辑核心) ---

    class NovaNPCViewer {
        constructor() {
            this.isOpen = false;
            this.currentCategory = 'GLOBAL'; // GLOBAL | WORLD | TEAM
            this.selectedNPC = null;
            this.allData = []; // 展平后的数据列表

            this.initUI();
            this.startThemeSync();
        }

        // 定时同步外部变量 - 确保你的主题随游戏变化
        startThemeSync() {
            const sync = () => {
                if(!this.container) return; // 保护
                const vars = [
                    '--modal-content-bg', '--primary-color', '--secondary-color',
                    '--container-bg-color', '--border-color', '--glow-color',
                    '--text-color', '--text-secondary-color', '--background-color',
                    '--danger-color', '--danger-glow-color', '--success-color',
                    '--success-glow-color', '--base-font-family'
                ];

                vars.forEach(v => {
                    const val = getVar(v);
                    if(val) {
                        this.container.style.setProperty(v, val);
                        this.floater.style.setProperty(v, val);
                    }
                });
            };

            sync(); // 立即执行一次
            setInterval(sync, 3000); // 3秒同步一次，妈妈觉得这个频率比较稳妥
        }

        initUI() {
            // 1. 创建悬浮球
            this.floater = document.createElement('div');
            this.floater.className = 'mod01-floater';
            this.floater.innerHTML = 'NPC'; // 或者放个SVG图标
            this.floater.onclick = () => this.toggleModal();
            document.body.appendChild(this.floater);

            // 2. 创建模态框容器
            this.container = document.createElement('div');
            this.container.className = 'mod01-overlay';
            // 防止点击内部关闭，点击背景关闭
            this.container.onclick = (e) => {
                if(e.target === this.container) this.toggleModal();
            };

            // 3. 内部结构
            this.container.innerHTML = `
                <div class="mod01-window">
                    <div class="mod01-header">
                        <div class="mod01-title">世界档案库</div>
                        <div class="mod01-close-btn">CLOSE [X]</div>
                    </div>
                    <div class="mod01-body">
                        <div class="mod01-sidebar">
                            <div class="mod01-tabs">
                                <div class="mod01-tab active" data-cat="GLOBAL">主要人物</div>
                                <div class="mod01-tab" data-cat="TEAM">当前小队</div>
                                <div class="mod01-tab" data-cat="WORLD">路人见闻</div>
                            </div>
                            <div class="mod01-list-container" id="mod01-npc-list">

                            </div>
                        </div>
                        <div class="mod01-content" id="mod01-details-view">

                            <div style="text-align:center; margin-top: 50px; color: var(--text-secondary-color);">
                                请选择左侧一名角色查看详细档案
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(this.container);

            // 4. 绑定静态事件
            this.container.querySelector('.mod01-close-btn').onclick = () => this.toggleModal();

            const tabs = this.container.querySelectorAll('.mod01-tab');
            tabs.forEach(tab => {
                tab.onclick = () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    this.currentCategory = tab.dataset.cat;
                    this.refreshList();
                }
            });
        }

        toggleModal() {
            this.isOpen = !this.isOpen;
            if(this.isOpen) {
                this.fetchData(); // 每次打开重新获取数据，保证实时性！
                this.container.classList.add('active');
            } else {
                this.container.classList.remove('active');
            }
        }

        // --- 核心逻辑：获取并整理数据 ---
        fetchData() {
            // 注意：这里我们要进行极高的容错处理
            this.allData = [];
            let assaData = {};
            try {
                if(window.GameAPI && window.GameAPI.assaData) {
                    assaData = window.GameAPI.assaData;
                }
            } catch(e) { console.warn("AssaData fetch error:", e); }

            // 用空对象兜底
            const safeGet = (obj, path) => path.split('.').reduce((acc, k) => acc && acc[k], obj) || {};

            // 1. Global NPC
            const globalNPCs = safeGet(assaData, 'global_set.npc');
            Object.keys(globalNPCs).forEach(key => {
                this.allData.push({ id: key, name: key, data: globalNPCs[key], cat: 'GLOBAL' });
            });

            // 2. Team (作为全局队友) - 可能字段名比较乱，我们统一归类
            const teamInfo = safeGet(assaData, 'global_set.小队信息');
            // 这里假设小队信息里也是npc_name: {...}的结构，如果不是，需要调整
            Object.keys(teamInfo).forEach(key => {
                // 只有当它里面看起来像个人（有数据对象）才加进去
                if(typeof teamInfo[key] === 'object') {
                    this.allData.push({ id: `team_${key}`, name: key, data: teamInfo[key], cat: 'TEAM' });
                }
            });

            // 3. World NPC
            const worldNPCs = safeGet(assaData, 'world_set.npc');
            Object.keys(worldNPCs).forEach(key => {
                this.allData.push({ id: key, name: key, data: worldNPCs[key], cat: 'WORLD' });
            });

            this.refreshList();
        }

        refreshList() {
            const listContainer = document.getElementById('mod01-npc-list');
            listContainer.innerHTML = '';

            const filtered = this.allData.filter(i => i.cat === this.currentCategory);

            if(filtered.length === 0) {
                listContainer.innerHTML = '<div style="padding:20px; opacity:0.5; text-align:center;">暂无数据</div>';
                return;
            }

            filtered.forEach(item => {
                const el = document.createElement('div');
                el.className = 'mod01-npc-item';
                // 尝试寻找一些可以作为Tag展示的信息，比如表性格的一个key，或者身份
                let tagText = item.data.身份 || '未知';
                if(tagText.length > 8) tagText = tagText.substring(0,8) + '...';

                el.innerHTML = `
                    <div class="mod01-npc-name">${item.name}</div>
                    <div class="mod01-npc-tag">${tagText}</div>
                `;
                el.onclick = () => {
                    // 高亮逻辑
                    Array.from(listContainer.children).forEach(c => c.classList.remove('active'));
                    el.classList.add('active');
                    this.renderDetail(item);
                };
                listContainer.appendChild(el);
            });
        }

        // --- 最复杂的部分：详情渲染 ---
        renderDetail(npcItem) {
            const container = document.getElementById('mod01-details-view');
            const info = npcItem.data;
            container.innerHTML = '';

            // 1. 头部：名字与基础描述
            const header = document.createElement('div');
            header.className = 'mod01-section';
            header.innerHTML = `<h1 style="color:var(--primary-color); margin-bottom:10px;">${npcItem.name}</h1>`;

            // 外貌描述
            if(info.外貌) {
                header.innerHTML += `<div style="font-style:italic; color:var(--text-secondary-color); margin-bottom:15px; border-left:3px solid var(--secondary-color); padding-left:10px;">${info.外貌}</div>`;
            }
            container.appendChild(header);

            // 2. 按字段智能渲染
            // 我们可以定义一些“优先级高”的字段先显示，然后剩余的遍历显示
            const priorityKeys = ['属性', '当前状态', '表性格', '里性格', '关键记忆'];
            const ignoreKeys = ['外貌', '未定字段'];

            // helper: 检查"对xxx印象" - Key其实是不定的
            let impressionKey = Object.keys(info).find(k => k.startsWith('对') && k.endsWith('印象'));
            if(impressionKey) priorityKeys.push(impressionKey);

            // > 渲染属性条 (特殊优化)
            if(info.属性) {
                this.renderStats(container, info.属性);
                ignoreKeys.push('属性');
            }

            // > 渲染其他内容
            const renderGeneric = (key, val, parentEl = container) => {
                if(!val) return;
                if(ignoreKeys.includes(key)) return;

                const section = document.createElement('div');
                section.className = 'mod01-section';

                // 特殊：关键记忆 (美化)
                if(key === '关键记忆') {
                   this.renderMemories(section, val);
                   parentEl.appendChild(section);
                   return;
                }

                // 标题 (对user印象特殊处理标题)
                section.innerHTML = `<div class="mod01-section-title">${key}</div>`;

                if(typeof val === 'object') {
                    this.renderRecursiveObject(section, val);
                } else {
                    // 普通文本
                     section.innerHTML += `<div class="mod01-val">${val}</div>`;
                }
                parentEl.appendChild(section);
            };

            // 先遍历所有Key，看看是不是在我们的优先级列表里
            // 这里为了保持显示顺序，可以手动调
            // 但既然要求通用，我们先全遍历，然后用样式处理复杂的

            Object.keys(info).forEach(key => {
                if(ignoreKeys.includes(key)) return; // 已处理的跳过
                renderGeneric(key, info[key]);
            });
        }

        // 特殊渲染：属性字符串 "【力量:4;肉搏:3】"
        renderStats(target, str) {
            const section = document.createElement('div');
            section.className = 'mod01-section';
            section.innerHTML = `<div class="mod01-section-title">Combat Stats</div>`;

            // 尝试解析正则
            let valid = false;
            if(typeof str === 'string' && (str.includes('【') || str.includes('['))) {
                // 简单的剥壳去括号
                let raw = str.replace(/[【】\[\]]/g, '');
                let pairs = raw.split(/[;,]/); // 支持分号或逗号分隔

                pairs.forEach(pair => {
                    if(!pair.includes(':')) return;
                    let [k, v] = pair.split(':');
                    k = k.trim(); v = parseInt(v.trim());

                    if(!isNaN(v)) {
                        valid = true;
                        // 假设满分是10或者根据数值动态变颜色
                        // 渲染条
                        const percent = Math.min((v / 10) * 100, 100); // 假定10是满值
                        let item = document.createElement('div');
                        item.className = 'mod01-stat-bar-container';
                        item.innerHTML = `
                            <div class="mod01-stat-label">${k}</div>
                            <div class="mod01-stat-track">
                                <div class="mod01-stat-fill" style="width:${percent}%"></div>
                            </div>
                            <div class="mod01-stat-num">${v}</div>
                        `;
                        section.appendChild(item);
                    }
                });
            }

            // 如果格式解析失败，或者没有有效数据，回退到普通文本
            if(!valid) {
                section.innerHTML += `<div class="mod01-val">${str}</div>`;
            }

            target.appendChild(section);
        }

        // 特殊渲染：关键记忆
        renderMemories(target, memoriesObj) {
           target.innerHTML = `<div class="mod01-section-title">Memory Cloud</div>`;
           const cloud = document.createElement('div');
           cloud.className = 'mod01-memory-container';

           // 检查是不是 {1: "...", 2: "..."}
           /*
             格式示例: "在后山...[震撼/爱恋]"
             需要提取正文与情感
           */
           Object.keys(memoriesObj).forEach(idx => {
               let text = memoriesObj[idx];
               let emotion = "";

               // 尝试提取情感标签 [xxx]
               const match = text.match(/\[(.*?)\]$/);
               if(match) {
                   emotion = match[1];
                   text = text.replace(match[0], ''); // 移除标签后的文本
               }

               const bubble = document.createElement('div');
               bubble.className = 'mod01-memory-bubble';
               // 动态颜色逻辑：根据情感字眼改变边框颜色 (简化版)
               let borderColor = "rgba(255,255,255,0.2)";
               if(emotion.includes('爱') || emotion.includes('喜')) borderColor = "var(--success-glow-color)";
               if(emotion.includes('痛') || emotion.includes('怒')) borderColor = "var(--danger-glow-color)";
               if(emotion.includes('惊')) borderColor = "var(--primary-color)";

               bubble.style.borderColor = borderColor;

               bubble.innerHTML = `
                   <div style="display:flex; justify-content:space-between;">
                     <span style="font-weight:bold; font-size:0.7em; opacity:0.5">MEM-${idx.padStart(3,'0')}</span>
                     <span class="mod01-mem-emotion" style="color:${borderColor}">${emotion}</span>
                   </div>
                   <div class="mod01-mem-content">${text}</div>
               `;

               // 交互：点击全部展开（防止有的太长被截断，这里简化为无）
               cloud.appendChild(bubble);
           });

           target.appendChild(cloud);
        }

        // 递归渲染复杂对象 (比如 性格: {tag: desc})
        renderRecursiveObject(target, obj) {
            const box = document.createElement('div');
            box.className = 'mod01-nested-box';

            Object.keys(obj).forEach(k => {
                const v = obj[k];
                if(typeof v === 'object' && v !== null) {
                    // 继续递归
                     const subBox = document.createElement('div');
                     subBox.innerHTML = `<div style="color:var(--text-secondary-color); margin-top:5px;">${k}:</div>`;
                     this.renderRecursiveObject(subBox, v);
                     box.appendChild(subBox);
                } else {
                    // 键值显示 (Tag风格)
                    const row = document.createElement('div');
                    row.className = 'mod01-nested-tag';
                    row.innerHTML = `<strong>${k}</strong>: ${v}`;
                    box.appendChild(row);
                }
            });

            target.appendChild(box);
        }
    }

    // --- 4. 启动与挂载 ---
    if(window.novaNpcSystem) {
        // 简单的单例保护
        console.log("Nova: 系统已存在，无需重复加载。");
        return;
    }
    window.novaNpcSystem = new NovaNPCViewer();
    console.log("Nova: NPC档案系统启动完毕，妈妈一直在看着你。");

})();