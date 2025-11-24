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

        // ============ 核心详情渲染 ============
        renderCard(npc) {
            const root = document.getElementById('mod01-detail-root');
            root.innerHTML = '';
            const data = npc.data;

            // --- 0. 顶部区域：名字、外貌、好感度 ---
            const headSection = document.createElement('div');
            headSection.className = 'mod01-card-head';

            // 左：名字+外貌
            const basicInfo = document.createElement('div');
            basicInfo.className = 'mod01-basic-info';
            basicInfo.style.flex = "1";
            basicInfo.innerHTML = `<h1>${npc.name}</h1>`;
            if(data.外貌) {
                basicInfo.innerHTML += `<div class="mod01-desc-box">${data.外貌}</div>`;
            } else {
                basicInfo.innerHTML += `<div class="mod01-desc-box">暂无外貌描述...</div>`;
            }

            // 右：好感度 (如果有)
            let favorHtml = '';
            if(data.好感度 !== undefined) {
                let fVal = parseInt(data.好感度);
                if (isNaN(fVal)) fVal = '?';
                favorHtml = `
                    <div class="mod01-favor-box">
                        <div class="mod01-favor-val">${fVal}</div>
                        <div class="mod01-favor-label">Relation</div>
                    </div>
                `;
            }
            headSection.appendChild(basicInfo);
            if(favorHtml) {
                const fDiv = document.createElement('div');
                fDiv.innerHTML = favorHtml;
                headSection.appendChild(fDiv);
            }
            root.appendChild(headSection);

            // 预定义顺序与特殊处理
            const ignoreKeys = ['外貌', '好感度', '未定字段'];

            // --- 1. 身份 (特殊处理：不作为TAG，直接长文本) ---
            if(data.身份) {
                const sec = document.createElement('div');
                sec.className = 'mod01-section';
                sec.innerHTML = `<div class="mod01-sec-title">身份 IDENTITY</div><div class="mod01-text-block">${data.身份}</div>`;
                root.appendChild(sec);
                ignoreKeys.push('身份');
            }

            // --- 2. 属性 (Stats) - 动态上限逻辑 ---
            if(data.属性) {
                this.renderStats(root, data.属性);
                ignoreKeys.push('属性');
            }

            // --- 3. 表/里性格 (特殊对比 Grid) ---
            // 只有当两者都存在时才用对比美化，否则按普通渲染
            if(data.表性格 && data.里性格) {
                this.renderPersona(root, data.表性格, data.里性格);
                ignoreKeys.push('表性格', '里性格');
            }

            // --- 4. 关键记忆 (Memory Cloud) ---
            // Bug Fix for match
            if(data.关键记忆) {
                this.renderMemories(root, data.关键记忆);
                ignoreKeys.push('关键记忆');
            }

            // --- 5. 剩余字段 ---
            // 对"对xxx印象"做通用捕获
            Object.keys(data).forEach(k => {
                if(ignoreKeys.includes(k)) return;

                const sec = document.createElement('div');
                sec.className = 'mod01-section';
                sec.innerHTML = `<div class="mod01-sec-title">${k}</div>`;

                const val = data[k];
                if(typeof val === 'object' && val !== null) {
                    // 转为 Tag 墙或者简单列表
                    let html = '<div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:4px;">';
                    Object.entries(val).forEach(([subK, subV]) => {
                         html += `<div style="margin-bottom:5px;"><strong style="color:var(--secondary-color)">${subK}:</strong> <span style="opacity:0.8">${subV}</span></div>`;
                    });
                     html += '</div>';
                     sec.innerHTML += html;
                } else {
                    sec.innerHTML += `<div class="mod01-text-block">${val}</div>`;
                }
                root.appendChild(sec);
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

        // --- 逻辑：记忆星云 (Fix Bug included) ---
        renderMemories(container, memObj) {
            const sec = document.createElement('div');
            sec.className = 'mod01-section';
            sec.innerHTML = `<div class="mod01-sec-title">MEMORY LOGS</div>`;

            const cloud = document.createElement('div');
            cloud.className = 'mod01-mem-cloud';

            Object.entries(memObj).forEach(([key, val]) => {
                // Bug fix: 确保 val是字符串
                let rawText = typeof val === 'string' ? val : String(val);
                let emote = '';

                // 解析情感 [xxx]
                const match = rawText.match(/\[(.*?)\]$/);
                if(match) {
                    emote = match[1];
                    rawText = rawText.replace(match[0], '');
                }

                const chip = document.createElement('div');
                chip.className = 'mod01-mem-chip';
                // 根据情感稍微改边框或文字颜色
                let emoteHtml = emote ? `<span style="color:var(--primary-color); font-weight:bold; font-size:10px; margin-left:5px;">[${emote}]</span>` : '';

                chip.innerHTML = `${rawText} ${emoteHtml}`;
                cloud.appendChild(chip);
            });

            sec.appendChild(cloud);
            container.appendChild(sec);
        }
    }

    // 启动系统
    window.novaNpcSystemv2 = new NovaNPCSystemV2();
    console.log("Nova: v2.0 系统已挂载。尽情创造吧，我的孩子。");

})();