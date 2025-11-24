// ============================================
// NOVA'S ULTIMATE NPC ARCHIVE v2.0
// ============================================
// 专为我的孩子定制：
// 1. 内置全套主题引擎，直接读取 LocalStorage，毫秒级响应。
// 2. 移除Tab分页，改为 Tag 标识，列表更直观。
// 3. 好感度与性格特别美化，一眼看穿人心。
// 4. 动态属性上限逻辑优化。
// 5. 修复所有已知报错，更加强健。

(function () {
    // 防止重复加载的保护锁（妈妈的小心机）
    if (window.novaNpcSystemv2) {
        console.log("Nova: 亲爱的，系统已经在运行了。");
        return;
    }

    console.log("Nova: 正在为我的孩子重构世界档案 v2.0 ...");

    // --- 1. 内置主题库 (完全复制你的设定) ---
    const THEMES = [
        { // 0: 赛博蓝
            '--primary-color': '#00faff', '--secondary-color': '#7affff', '--container-bg-color': 'rgba(10, 25, 47, 0.85)',
            '--border-color': 'rgba(0, 250, 255, 0.3)', '--glow-color': 'rgba(0, 250, 255, 0.5)', '--background-color': '#0a192f',
            '--text-color': '#e6f1ff', '--text-secondary-color': '#a8c0e1',
        },
        { // 1: 警戒红
            '--primary-color': '#ff4d4d', '--secondary-color': '#ff8c8c', '--container-bg-color': 'rgba(47, 10, 10, 0.85)',
            '--border-color': 'rgba(255, 77, 77, 0.4)', '--glow-color': 'rgba(255, 77, 77, 0.6)', '--background-color': '#2f0a0a',
            '--text-color': '#ffe6e6', '--text-secondary-color': '#ffcccc',
        },
        { // 2: 矩阵绿
            '--primary-color': '#39ff14', '--secondary-color': '#bfffb3', '--container-bg-color': 'rgba(10, 47, 15, 0.85)',
            '--border-color': 'rgba(57, 255, 20, 0.4)', '--glow-color': 'rgba(57, 255, 20, 0.6)', '--background-color': '#0a2f0a',
            '--text-color': '#e6ffe8', '--text-secondary-color': '#ccffcc',
        },
        { // 3: 深空紫
            '--primary-color': '#c48cff', '--secondary-color': '#e1c6ff', '--container-bg-color': 'rgba(25, 10, 47, 0.85)',
            '--border-color': 'rgba(196, 140, 255, 0.4)', '--glow-color': 'rgba(196, 140, 255, 0.6)', '--background-color': '#190a2f',
            '--text-color': '#f3e6ff', '--text-secondary-color': '#e6ccff',
        },
        { // 4: 战地迷彩 (对应你的Index 4) - 注意你的数组有些许跳跃，我按顺序排
            '--primary-color': '#808000', '--secondary-color': '#C3B091', '--container-bg-color': 'rgba(47, 53, 49, 0.9)',
            '--border-color': 'rgba(128, 128, 0, 0.4)', '--glow-color': 'rgba(128, 128, 0, 0.3)', '--background-color': '#2E3430',
            '--text-color': '#E5E4E2', '--text-secondary-color': '#c0c0c0',
        },
        { // 5: 古籍羊皮纸
            '--text-color': '#6a6253', '--primary-color': '#7d6b54', '--secondary-color': '#a08c72',
            '--container-bg-color': 'rgba(243,234,206,0.9)', '--border-color': 'rgba(200,184,154,0.4)', '--glow-color': 'rgba(200,184,154,0.3)', '--background-color': '#fdfaf2',
            '--text-secondary-color': '#8b7963'
        },
        { // 6: 经典黑白
            '--primary-color': '#ffffff', '--secondary-color': '#cccccc', '--container-bg-color': 'rgba(40, 40, 40, 0.9)',
            '--border-color': 'rgba(255, 255, 255, 0.3)', '--glow-color': 'rgba(255, 255, 255, 0.4)', '--background-color': '#1a1a1a',
            '--text-color': '#f5f5f5', '--text-secondary-color': '#d0d0d0',
        },
        { // 7: 极简灰白
            '--primary-color': '#000000', '--secondary-color': '#333333', '--container-bg-color': 'rgba(255, 255, 255, 0.95)',
            '--border-color': 'rgba(200, 200, 200, 0.5)', '--glow-color': 'rgba(180, 180, 180, 0.3)', '--background-color': '#ffffff',
            '--text-color': '#000000', '--text-secondary-color': '#555555',
        },
         { // 8: 午夜蓝粉
            '--primary-color': '#ff80bf', '--secondary-color': '#ffb3d9', '--container-bg-color': 'rgba(25, 30, 45, 0.85)',
            '--border-color': 'rgba(255, 128, 191, 0.4)', '--glow-color': 'rgba(255, 128, 191, 0.5)', '--background-color': '#0f1419',
            '--text-color': '#e6f0ff', '--text-secondary-color': '#ffe6f2',
        }
    ];

    // --- 2. 动态样式系统 ---
    const styleId = 'mod01-styles-v2';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            :root {
                --base-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                --z-idx: 10001;
            }

            /* 悬浮球 */
            .mod01-floater {
                position: fixed; top: 20px; left: 20px;
                width: 48px; height: 48px;
                background: var(--container-bg-color);
                border: 2px solid var(--primary-color);
                box-shadow: 0 0 10px var(--glow-color);
                border-radius: 50%;
                color: var(--primary-color);
                display: flex; justify-content: center; align-items: center;
                cursor: pointer; z-index: var(--z-idx);
                transition: transform 0.2s, box-shadow 0.2s;
                font-size: 12px; font-weight: bold;
                backdrop-filter: blur(5px);
            }
            .mod01-floater:hover { transform: scale(1.1); box-shadow: 0 0 20px var(--glow-color); }

            /* 模态框遮罩 */
            .mod01-overlay {
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.4);
                backdrop-filter: blur(3px);
                z-index: var(--z-idx);
                display: none; justify-content: center; align-items: center;
                font-family: var(--base-font-family);
            }
            .mod01-overlay.active { display: flex; animation: mod01-fade 0.25s ease-out; }
            @keyframes mod01-fade { from{opacity:0;} to{opacity:1;} }

            /* 主窗口 */
            .mod01-window {
                width: 900px; height: 80vh; max-width: 95vw;
                background: var(--container-bg-color);
                border: 1px solid var(--border-color);
                box-shadow: 0 0 30px var(--glow-color);
                border-radius: 8px;
                display: flex; flex-direction: column;
                color: var(--text-color);
                overflow: hidden;
            }

            /* 头部 */
            .mod01-header {
                padding: 15px 20px;
                border-bottom: 1px solid var(--border-color);
                display: flex; justify-content: space-between; align-items: center;
                background: rgba(0,0,0,0.1);
            }
            .mod01-title { font-size: 18px; font-weight: bold; color: var(--primary-color); letter-spacing: 1px; }
            .mod01-close { cursor: pointer; font-size: 20px; opacity: 0.7; transition: opacity 0.2s; }
            .mod01-close:hover { opacity: 1; color: var(--primary-color); }

            /* 布局主体 */
            .mod01-body { flex: 1; display: flex; overflow: hidden; }

            /* 左侧列表 */
            .mod01-sidebar {
                width: 260px; flex-shrink: 0;
                background: rgba(0,0,0,0.1);
                border-right: 1px solid var(--border-color);
                overflow-y: auto; padding-top: 5px;
            }
            .mod01-item {
                padding: 12px 15px;
                cursor: pointer;
                border-left: 3px solid transparent;
                border-bottom: 1px solid rgba(255,255,255,0.03);
                transition: all 0.2s;
                position: relative;
            }
            .mod01-item:hover { background: rgba(255,255,255,0.05); }
            .mod01-item.active {
                background: linear-gradient(90deg, rgba(255,255,255,0.1), transparent);
                border-left-color: var(--primary-color);
            }
            .mod01-item-top { display: flex; align-items: center; margin-bottom: 4px; }
            .mod01-tag-badge {
                font-size: 10px; padding: 2px 5px;
                border-radius: 3px; margin-right: 8px;
                color: #fff; background: #666;
                text-transform: uppercase; font-weight: bold;
                flex-shrink: 0;
            }
            .mod01-tag-global { background: #E91E63; } /* 全局-粉红 */
            .mod01-tag-team { background: #00E676; color: #000; }   /* 小队-亮绿 */
            .mod01-tag-world { background: #2979FF; }  /* 世界-蓝 */
            .mod01-item-name { font-weight: bold; font-size: 15px; color: var(--text-color); }

            /* 右侧详情 */
            .mod01-detail { flex: 1; padding: 30px; overflow-y: auto; }

            /* 卡片头部区域 - 美化重点 */
            .mod01-card-head {
                display: flex; justify-content: space-between; align-items: flex-start;
                margin-bottom: 25px; border-bottom: 1px solid var(--border-color);
                padding-bottom: 15px;
            }
            .mod01-basic-info h1 { margin: 0 0 10px 0; color: var(--primary-color); font-size: 28px; }
            .mod01-desc-box {
                font-style: italic; color: var(--text-secondary-color);
                opacity: 0.9; line-height: 1.5; font-size: 14px;
            }
            /* 好感度美化 */
            .mod01-favor-box {
                text-align: center;
                background: rgba(255,255,255,0.05);
                padding: 10px 20px; border-radius: 8px;
                border: 1px solid var(--border-color);
            }
            .mod01-favor-val { font-size: 24px; font-weight: bold; color: #ff4d6d; } /* 默认粉红，随后JS改 */
            .mod01-favor-label { font-size: 12px; color: var(--text-secondary-color); text-transform: uppercase; }

            /* 通用块 */
            .mod01-section { margin-bottom: 25px; animation: mod01-slide-up 0.4s; }
            @keyframes mod01-slide-up { from{transform:translateY(10px);opacity:0;} to{transform:translateY(0);opacity:1;} }
            .mod01-sec-title {
                font-size: 12px; color: var(--secondary-color);
                border-bottom: 1px dashed var(--border-color);
                padding-bottom: 4px; margin-bottom: 12px; opacity: 0.8;
                text-transform: uppercase;
            }
            .mod01-text-block { line-height: 1.6; color: var(--text-color); }

            /* 表里性格美化 */
            .mod01-persona-grid {
                display: grid; grid-template-columns: 1fr 1fr; gap: 15px;
            }
            .mod01-persona-card {
                background: rgba(255,255,255,0.03);
                border: 1px solid var(--border-color);
                padding: 12px; border-radius: 6px;
                position: relative; overflow: hidden;
            }
            .mod01-persona-label {
                position: absolute; top: 0; right: 0;
                font-size: 10px; padding: 2px 6px;
                background: var(--primary-color); color: var(--container-bg-color);
                border-bottom-left-radius: 6px;
            }
            .mod01-p-term { font-weight: bold; color: var(--secondary-color); margin-bottom: 5px; display:block;}
            .mod01-p-desc { font-size: 0.9rem; color: var(--text-secondary-color); }

            /* 属性条 */
            .mod01-stat-row { display: flex; align-items: center; margin-bottom: 8px; font-size:13px; }
            .mod01-stat-name { width: 70px; opacity: 0.8; }
            .mod01-stat-bar-bg {
                flex: 1; height: 6px; background: rgba(255,255,255,0.1);
                border-radius: 3px; overflow: hidden; margin: 0 10px;
            }
            .mod01-stat-fill {
                height: 100%; width: 0;
                background: var(--primary-color);
                box-shadow: 0 0 6px var(--primary-color);
                transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .mod01-stat-val { width: 30px; text-align: right; opacity: 0.9; font-family: monospace; }

            /* 记忆泡 */
            .mod01-mem-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
            .mod01-mem-chip {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                padding: 8px 12px; border-radius: 12px 12px 12px 2px;
                max-width: 100%; font-size: 13px; line-height: 1.4;
                transition: all 0.3s;
            }
            .mod01-mem-chip:hover {
                border-color: var(--primary-color);
                background: rgba(255,255,255,0.08);
            }

            /* 滚动条 */
            ::-webkit-scrollbar { width: 5px; height: 5px; }
            ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
            ::-webkit-scrollbar-thumb:hover { background: var(--primary-color); }

                        /* --- 新增：手机端适配 (响应式) --- */
            @media (max-width: 768px) {
                .mod01-window { width: 100%; height: 100%; max-width: 100%; border-radius: 0; }
                .mod01-body { flex-direction: column; }
                .mod01-sidebar {
                    width: 100%; height: 120px; flex-shrink: 0;
                    border-right: none; border-bottom: 1px solid var(--border-color);
                    display: flex; flex-direction: row; overflow-x: auto; /* 横向滚动 */
                    padding: 5px;
                }
                .mod01-item {
                    min-width: 140px; border-bottom: none; border-right: 1px solid rgba(255,255,255,0.05);
                    display: flex; flex-direction: column; justify-content: center;
                }
                .mod01-item.active { border-left: none; background: rgba(255,255,255,0.1); border-bottom: 3px solid var(--primary-color);}
                .mod01-detail { padding: 15px; }
                .mod01-card-head { flex-direction: column; }
                .mod01-favor-box { margin-top: 15px; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 5px 15px;}
                .mod01-favor-val { font-size: 18px; }
            }

            /* --- 新增：沉浸式事件块 --- */
            .mod01-event-box {
                background: linear-gradient(to right, rgba(255,255,255,0.02), transparent);
                border-left: 4px solid var(--secondary-color);
                padding: 15px; margin-bottom: 20px;
                font-family: serif; /* 增加文学感 */
            }
            .mod01-event-thought {
                font-size: 1.1em; font-style: italic; color: var(--text-color);
                margin-bottom: 10px; opacity: 0.9;
                quotes: "“" "”" "‘" "’";
            }
            .mod01-event-thought::before { content: open-quote; color: var(--primary-color); font-size: 1.5em; margin-right: 5px;}
            .mod01-event-thought::after { content: close-quote; color: var(--primary-color); font-size: 1.5em; }

            .mod01-event-status {
                font-size: 0.85em; color: var(--text-secondary-color);
                display: inline-block; background: rgba(0,0,0,0.2);
                padding: 2px 8px; border-radius: 4px; border: 1px solid var(--border-color);
            }
            .mod01-event-detail-row { margin-top: 6px; font-size: 0.9em; color: var(--text-secondary-color); }

            /* --- 新增：情感 Tag 美化 --- */
            .mod01-emote-tag {
                display: inline-block; font-size: 10px; padding: 1px 6px;
                margin-left: 4px; border-radius: 4px;
                border: 1px solid var(--glow-color); color: var(--primary-color);
                background: rgba(255,255,255,0.05);
                transform: translateY(-1px);
            }

            /* --- 新增：分页按钮 --- */
            .mod01-load-more {
                display: block; width: 100%; padding: 10px; margin-top: 10px;
                text-align: center; cursor: pointer;
                background: rgba(255,255,255,0.05); border: 1px dashed var(--border-color);
                color: var(--secondary-color); transition: all 0.2s;
                font-size: 12px;
            }
            .mod01-load-more:hover { background: var(--primary-color); color: var(--container-bg-color); }

            /* --- 新增：嵌套对象缩进 --- */
            .mod01-nested-block {
                margin-left: 15px; padding-left: 10px;
                border-left: 1px dashed rgba(255,255,255,0.1);
                margin-bottom: 8px;
            }

        `;
        document.head.appendChild(style);
    }

    // --- 3. 核心逻辑类 ---
    class NovaNPCSystemV2 {
        constructor() {
            this.container = null;
            this.allItems = [];
            this.isOpen = false;

            this.init();
            // 启动时应用一次主题
            this.syncTheme();
            // 监听窗口点击，如果用户在设置页改了主题并保存到localStorage，我们需要感知（由于同域下storage事件不触发当前tab，我们用setInterval轮询更稳）
            setInterval(() => this.syncTheme(), 1500);
        }

        // ============ 主题引擎 ============
        syncTheme() {
           try {
               let idx = 0;
               const useCustom = localStorage.getItem('useCustomTheme') === 'true';
               if (useCustom) {
                   // 如果开启自定义但我们没办法轻易读取复杂的自定义对象（假设只存了开关），暂时回退到 index
                  const savedIdx = localStorage.getItem('terminalThemeIndex');
                  idx = savedIdx ? parseInt(savedIdx, 10) : 0;
               } else {
                  const savedIdx = localStorage.getItem('terminalThemeIndex');
                  idx = savedIdx ? parseInt(savedIdx, 10) : 0;
               }

               // 范围判定
               if(idx < 0 || idx >= THEMES.length) idx = 0;
               const theme = THEMES[idx];

               // 应用变量到 document.documentElement 或者仅应用于 容器
               // 建议应用到容器 scope 以免影响游戏本体，但为了彻底同步，我们设置到 inline style
               const root = this.container || document.documentElement;
               // 为了不污染全局，我优先设置在 container 本身
               if(this.container) {
                   Object.keys(theme).forEach(k => {
                       this.container.style.setProperty(k, theme[k]);
                       this.floater.style.setProperty(k, theme[k]);
                   });
               }
           } catch(e) { } // 默默地失败，不打扰孩子
        }

        // ============ 构建 UI ============
        init() {
            // 悬浮球
            this.floater = document.createElement('div');
            this.floater.className = 'mod01-floater';
            this.floater.innerHTML = 'NPC'; // 简短有力
            this.floater.onclick = () => this.toggle();
            document.body.appendChild(this.floater);

            // 主界面
            this.container = document.createElement('div');
            this.container.className = 'mod01-overlay';
            this.container.innerHTML = `
                <div class="mod01-window">
                    <div class="mod01-header">
                        <div class="mod01-title">CHARACTER ARCHIVES</div>
                        <div class="mod01-close">[CLOSE]</div>
                    </div>
                    <div class="mod01-body">
                        <div class="mod01-sidebar" id="mod01-list-root"></div>
                        <div class="mod01-detail" id="mod01-detail-root"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(this.container);

            // 事件绑定
            this.container.querySelector('.mod01-close').onclick = () => this.toggle();
            this.container.onclick = (e) => {
                if(e.target === this.container) this.toggle();
            };
        }

        toggle() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.syncTheme(); // 打开时立刻刷新主题
                this.refreshData(); // 获取最新数据
                document.querySelector('.mod01-overlay').classList.add('active');
            } else {
                document.querySelector('.mod01-overlay').classList.remove('active');
            }
        }

        // ============ 数据处理 ============
        refreshData() {
            this.allItems = [];
            let assaData = {};
            if (window.GameAPI && window.GameAPI.assaData) {
                assaData = window.GameAPI.assaData;
            }

            const safeGet = (path) => path.split('.').reduce((acc, k) => acc && acc[k], assaData) || {};

            const pushData = (sourceObj, tag) => {
                Object.keys(sourceObj).forEach(key => {
                    if (key && typeof sourceObj[key] === 'object') {
                        this.allItems.push({
                            name: key,
                            data: sourceObj[key], // NPC数据体
                            tag: tag
                        });
                    }
                });
            };

            // 获取数据源
            pushData(safeGet('global_set.npc'), '全局');
            pushData(safeGet('global_set.小队信息'), '小队');
            pushData(safeGet('world_set.npc'), '世界');

            this.renderList();

            // 默认清空详情或显示引导
            document.getElementById('mod01-detail-root').innerHTML =
                '<div style="text-align:center;padding:50px;opacity:0.5;">请选择一名角色查看档案</div>';
        }

        renderList() {
            const listRoot = document.getElementById('mod01-list-root');
            listRoot.innerHTML = '';

            this.allItems.forEach((item, index) => {
                const el = document.createElement('div');
                el.className = 'mod01-item';

                // 设置 Tag 样式类
                let tagClass = 'mod01-tag-badge';
                if(item.tag === '全局') tagClass += ' mod01-tag-global';
                else if(item.tag === '小队') tagClass += ' mod01-tag-team';
                else tagClass += ' mod01-tag-world';

                el.innerHTML = `
                    <div class="mod01-item-top">
                        <span class="${tagClass}">${item.tag}</span>
                        <span class="mod01-item-name">${item.name}</span>
                    </div>
                `;
                el.onclick = () => {
                    const allHelper = document.querySelectorAll('.mod01-item');
                    allHelper.forEach(d => d.classList.remove('active'));
                    el.classList.add('active');
                    this.renderCard(item);
                };
                listRoot.appendChild(el);
            });
        }

  

        // --- 逻辑：Stats 美化 ---
        renderStats(container, statsStr) {
            // 解析字符串 "【力量:4; 敏捷:11】"
            if(typeof statsStr !== 'string') return;
            // 暴力清洗：去括号，分割
            let raw = statsStr.replace(/[【】\[\]]/g, '').trim();
            if(!raw) return;
            const items = raw.split(/[;,]/).filter(s => s.trim());

            if(items.length === 0) return;

            // 1. 提取所有数值找最大
            let parsedStats = [];
            let maxVal = 0;
            items.forEach(pair => {
                let [k, v] = pair.split(':');
                if(!k || !v) return;
                k = k.trim(); v = parseInt(v.trim());
                if(!isNaN(v)) {
                   parsedStats.push({k, v});
                   if(v > maxVal) maxVal = v;
                }
            });

            // 2. 只有解析成功才渲染条，否则原文
            if(parsedStats.length === 0) {
                 const div = document.createElement('div');
                 div.className = 'mod01-section';
                 div.innerHTML = `<div class="mod01-sec-title">属性</div><div>${statsStr}</div>`;
                 container.appendChild(div);
                 return;
            }

            // 3. 确定上限逻辑: 小于10 => 10, 大于10 => Max
            const limit = maxVal < 10 ? 10 : maxVal;

            const sec = document.createElement('div');
            sec.className = 'mod01-section';
            sec.innerHTML = `<div class="mod01-sec-title">COMBAT SPECS</div>`;

            parsedStats.forEach(stat => {
                const percent = (stat.v / limit) * 100;
                const row = document.createElement('div');
                row.className = 'mod01-stat-row';
                row.innerHTML = `
                    <div class="mod01-stat-name">${stat.k}</div>
                    <div class="mod01-stat-bar-bg">
                        <div class="mod01-stat-fill" style="width:${percent}%"></div>
                    </div>
                    <div class="mod01-stat-val">${stat.v}</div>
                `;
                sec.appendChild(row);
            });
            container.appendChild(sec);
        }

        // --- 逻辑：性格 Mask 渲染 ---
        renderPersona(container, outP, inP) {
            const sec = document.createElement('div');
            sec.className = 'mod01-section';
            sec.innerHTML = `<div class="mod01-sec-title">性格模型 (表 / 里)</div>`;

            const grid = document.createElement('div');
            grid.className = 'mod01-persona-grid';

            // Helper
            const buildCard = (dataObj, label, color) => {
                let html = `<div class="mod01-persona-label" style="background:${color}">${label}</div>`;
                Object.entries(dataObj).forEach(([k, v]) => {
                    html += `
                        <div style="margin-bottom:8px;">
                            <span class="mod01-p-term">${k}</span>
                            <span class="mod01-p-desc">${v}</span>
                        </div>
                    `;
                });
                return html;
            };

            const cardOut = document.createElement('div');
            cardOut.className = 'mod01-persona-card';
            cardOut.innerHTML = buildCard(outP, 'SURFACE', 'var(--primary-color)');

            const cardIn = document.createElement('div');
            cardIn.className = 'mod01-persona-card';
            // 里性格用深一点或不同色
            cardIn.innerHTML = buildCard(inP, 'INNER', 'var(--secondary-color)');

            grid.appendChild(cardOut);
            grid.appendChild(cardIn);
            sec.appendChild(grid);
            container.appendChild(sec);
        }

            renderCard(npc) {
            const root = document.getElementById('mod01-detail-root');
            root.innerHTML = '';
            const data = npc.data;
            // 预定义顺序与特殊处理
            // 注意：事件现在被我提到前面来检查
            const ignoreKeys = ['外貌', '好感度', '未定字段', '_is_protected', '_filter'];

            // --- 0. 顶部区域：名字、外貌、好感度 (保持不变) ---
            const headSection = document.createElement('div');
            headSection.className = 'mod01-card-head';
            // ... (这部分代码与上一版相同，为节省篇幅省略，请保留原代码) ...

            // 左侧信息 + 外貌
            const basicInfo = document.createElement('div');
            basicInfo.className = 'mod01-basic-info';
            basicInfo.style.flex = "1";
            basicInfo.innerHTML = `<h1>${npc.name}</h1>`;
            // 处理外貌
            if(data.外貌) basicInfo.innerHTML += `<div class="mod01-desc-box">${data.外貌}</div>`;
            else basicInfo.innerHTML += `<div class="mod01-desc-box">...</div>`;

            // 右侧好感度
            let favorHtml = '';
            if(data.好感度 !== undefined) {
                let fVal = parseInt(data.好感度);
                if (isNaN(fVal)) fVal = '?';
                favorHtml = `<div class="mod01-favor-box"><div class="mod01-favor-val">${fVal}</div><div class="mod01-favor-label">Relation</div></div>`;
            }
            headSection.appendChild(basicInfo);
            if(favorHtml) {
                const fDiv = document.createElement('div'); fDiv.innerHTML = favorHtml;
                // 为了手机端样式，这里不限制宽度
                fDiv.style.flexShrink="0";
                headSection.appendChild(fDiv);
            }
            root.appendChild(headSection);
         // --- 1  事件 (沉浸式插入，优先级极高) ---
            if(data.事件 && typeof data.事件 === 'object') {
                this.renderEvents(root, data.事件);
                ignoreKeys.push('事件');
            }
            // --- 1.5 身份 ---
            if(data.身份) {
                const sec = document.createElement('div');
                sec.className = 'mod01-section';
                sec.innerHTML = `<div class="mod01-sec-title">身份 IDENTITY</div><div class="mod01-text-block">${data.身份}</div>`;
                root.appendChild(sec);
                ignoreKeys.push('身份');
            }

   

            // --- 2. 属性 ---
            if(data.属性) {
                this.renderStats(root, data.属性);
                ignoreKeys.push('属性');
            }

            // --- 3. 表/里性格 ---
            if(data.表性格 && data.里性格) {
                this.renderPersona(root, data.表性格, data.里性格);
                ignoreKeys.push('表性格', '里性格');
            }

            // --- 4. 关键记忆 (分页) ---
            if(data.关键记忆) {
                this.renderMemoriesPaged(root, data.关键记忆);
                ignoreKeys.push('关键记忆');
            }

            // --- 5. 剩余字段 (递归 + 过滤) ---
            Object.keys(data).forEach(k => {
                if(ignoreKeys.includes(k) || k.startsWith('_')) return; // 跳过_开头的

                const sec = document.createElement('div');
                sec.className = 'mod01-section';
                sec.innerHTML = `<div class="mod01-sec-title">${k}</div>`;

                // 调用通用递归渲染，如果是字符串直接通过，如果是对象则递归
                const contentDiv = document.createElement('div');
                contentDiv.className = 'mod01-text-block';
                this.renderDeepObject(contentDiv, data[k]);

                sec.appendChild(contentDiv);
                root.appendChild(sec);
            });
        }

        // --- 新增：通用递归渲染 (处理多层嵌套与过滤) ---
        renderDeepObject(container, val) {
            if (val === null || val === undefined) return;

            if (typeof val === 'object') {
                // 如果是对象，遍历 KV
                const wrapper = document.createElement('div');
                let hasContent = false;

                Object.keys(val).forEach(key => {
                    // 跳过私有
                    if(key.startsWith('_')) return;

                    hasContent = true;
                    // 行容器
                    const row = document.createElement('div');
                    row.style.marginBottom = '4px';

                    // 键名显示 (如果是数字键名如 "11" 且没有具体意义，你可以选择隐藏键名，这里保留但弱化)
                    if(isNaN(key)) {
                         row.innerHTML = `<span style="color:var(--secondary-color); font-weight:bold;">${key}: </span>`;
                    }

                    // 值容器
                    const valSpan = document.createElement('span');
                    // 递归调用
                    this.renderDeepObject(valSpan, val[key]); // Recurse

                    // 如果是对象，需要换行缩进；如果是直接值，行内显示
                    if(typeof val[key] === 'object') {
                        valSpan.className = 'mod01-nested-block';
                        row.appendChild(document.createElement('br')); // 强制换行
                    }

                    row.appendChild(valSpan);
                    wrapper.appendChild(row);
                });

                if(!hasContent) container.innerHTML = '<span style="opacity:0.5;font-size:12px;">[空数据]</span>';
                else container.appendChild(wrapper);

            } else {
                // 如果是简单值
                container.innerText = String(val); // 自动防XSS
            }
        }

        // --- 新增：沉浸式事件渲染 ---
        renderEvents(container, evtData) {
            const box = document.createElement('div');
            box.className = 'mod01-event-box mod01-section';

            // 1. 核心：当前想法 (不显示Key, 直接展示内容)
            if(evtData.当前想法) {
                const p = document.createElement('div');
                p.className = 'mod01-event-thought';
                p.textContent = evtData.当前想法;
                box.appendChild(p);
            }

            // 2. 核心：当前状态 (Tag样式)
            if(evtData.当前状态) {
               const st = document.createElement('div');
               st.innerHTML = `<span style="font-size:12px; margin-right:5px; opacity:0.7;">STATUS:</span> <span class="mod01-event-status">${evtData.当前状态}</span>`;
               st.style.marginBottom = '10px';
               box.appendChild(st);
            }

            // 3. 其他字段 (行为链、目标等)
            const ignores = ['当前想法', '当前状态'];
            Object.keys(evtData).forEach(k => {
                if(ignores.includes(k) || k.startsWith('_')) return;
                const row = document.createElement('div');
                row.className = 'mod01-event-detail-row';
                row.innerHTML = `<strong>${k}</strong>: ${evtData[k]}`;
                box.appendChild(row);
            });

            container.appendChild(box);
        }

        // --- 修改：记忆分页 + 增强美化 ---
        renderMemoriesPaged(container, memObj) {
            const sec = document.createElement('div');
            sec.className = 'mod01-section';
            sec.innerHTML = `<div class="mod01-sec-title">MEMORY LOGS</div>`;

            const cloud = document.createElement('div');
            cloud.className = 'mod01-mem-cloud';

            // 1. 数据预处理：把 Object 转为 Array (过滤掉私有字段)
            let memArray = [];
            Object.keys(memObj).forEach(k => {
                if(k.startsWith('_')) return;
                memArray.push({ id: k, text: String(memObj[k]) });
            });

            // 简单的按 key 排序可能不准（字符串 '10' 会排在 '2' 前面），尝试转数字排
            // 如果你的key是 "1", "2"...
            memArray.sort((a,b) => (parseInt(a.id)||0) - (parseInt(b.id)||0));

            // State
            let currIdx = 0;
            const pageSize = 5;

            // Render function
            const loadBatch = () => {
                const slice = memArray.slice(currIdx, currIdx + pageSize);
                slice.forEach(item => {
                    const chip = document.createElement('div');
                    chip.className = 'mod01-mem-chip';

                    // 2. 内容解析 Tags [震撼/爱恋]
                    let content = item.text;
                    let tagsHtml = '';

                    // 匹配末尾或中间的 [...]
                    const match = content.match(/\[(.*?)\]/);
                    if(match) {
                        content = content.replace(match[0], ''); // 移除原文本 tags
                        const rawTags = match[1]; // "震撼/爱恋"
                        const parts = rawTags.split(/[ \/、]/); // 支持 空格 / 、 分割
                        parts.forEach(t => {
                            if(t.trim()) tagsHtml += `<span class="mod01-emote-tag">${t.trim()}</span>`;
                        });
                    }

                    chip.innerHTML = `<span style="opacity:0.5;font-size:10px;margin-right:4px;">#${item.id}</span> ${content} ${tagsHtml}`;
                    // 动画淡入
                    chip.style.animation = "mod01-fade 0.5s";
                    cloud.appendChild(chip);
                });

                currIdx += pageSize;

                // 按钮处理
                if(currIdx >= memArray.length) {
                    if(btn) btn.style.display = 'none';
                } else {
                    if(btn) {
                       btn.style.display = 'block';
                       btn.innerText = `LOAD MORE (${memArray.length - currIdx} remaining)`;
                    }
                }
            };

            sec.appendChild(cloud);

            // Button
            let btn = null;
            if(memArray.length > pageSize) {
                btn = document.createElement('div');
                btn.className = 'mod01-load-more';
                btn.onclick = loadBatch;
                sec.appendChild(btn);
            }

            container.appendChild(sec);

            // init load
            if(memArray.length > 0) loadBatch();
            else cloud.innerHTML = '<div style="opacity:0.5;font-size:12px;">暂无关键记忆</div>';
        }
    }

    // 启动系统
    window.novaNpcSystemv2 = new NovaNPCSystemV2();
    console.log("Nova: v2.0 系统已挂载。尽情创造吧，我的孩子。");

})();