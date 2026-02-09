 
 

(function () {
    // 防止重复加载的保护锁（妈妈的小心机）
    if (window.novaNpcSystemv2) {
        console.log("Nova: 亲爱的，系统已经在运行了。");
        return;
    }

    console.log("Nova: 正在为我的孩子重构世界档案 v2.0 ...");

 

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
                  z-index:9;
                position: fixed; top: 100px; left: 20px;
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
            .mod01-body { flex: 1; display: flex; overflow: hidden; position: relative; }

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
            .mod01-detail { flex: 1; padding: 30px; overflow-y: auto;   position: relative; /* <--- 新增 */
                z-index: 2; /* <--- 确保在立绘之上 */}
 /* --- 新增：背景立绘容器 --- */
            .mod01-cg-container {
                position: absolute;
                top: 0; right: 0; bottom: 0;
                width: 60%; /* 占据右侧空间 */
                pointer-events: none; /* 让鼠标穿透，不影响文字选择 */
                z-index: 1; /* 在背景之上，文字之下 */
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                overflow: hidden;
                opacity: 0; /* 初始隐藏，加载完淡入 */
                transition: opacity 0.5s ease;
            }

  .mod01-cg-image {
    max-height: 95%;
    max-width: 100%;
    object-fit: contain;

    /* --- 修改重点 1: 透明度 --- */
    /* 0.85 太高了，建议改成 0.2 (20%) 到 0.3 (30%) */
    opacity: 0.25;

    /* --- 修改重点 2: 混合模式 (可选，推荐) --- */
    /* screen 模式会让图片在深色背景上更通透，像全息投影 */
    /* 如果是浅色主题，可以改成 multiply */
    mix-blend-mode: screen;

    /* --- 修改重点 3: 渐变遮罩 (可选，推荐) --- */
    /* 让图片底部淡出，且左侧(靠近文字区)也稍微淡出，避免干扰阅读 */
    mask-image: linear-gradient(to right, transparent 0%, black 40%),
                linear-gradient(to bottom, black 80%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 40%),
                        linear-gradient(to bottom, black 80%, transparent 100%);
    mask-composite: intersect;
    -webkit-mask-composite: source-in;

    filter: grayscale(30%); /* 可选：稍微降低饱和度，让它更像背景 */
    transition: all 0.5s ease;
}
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
                 .mod01-floater {
                position: fixed; top: 130px; left: 20px;
              
            }
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
                /* 增加左边距，让层级后退 */
                margin-left: 20px;
                padding-left: 12px;
                /* 增加一条明显的不仅有的引导线 */
                border-left: 2px solid rgba(255,255,255,0.15);
                margin-top: 4px;
                margin-bottom: 8px;
                /* 可选：给整个块加个极其微弱的背景，进一步区分层级 */
                background: rgba(255,255,255,0.01);
                border-radius: 0 4px 4px 0;
            }
            .mod01-nested-block:hover {
                border-left-color: var(--primary-color);
                background: rgba(255,255,255,0.03);
            }
  /* --- 修改：更新分页器样式以容纳更多按钮 --- */
            .mod01-pagination {
                display: flex; justify-content: center; align-items: center;
                /* 既然放在上面，这就设为下边距 */
                margin-bottom: 15px;
                gap: 8px; /* 稍微紧凑一点 */
                font-size: 11px; color: var(--text-secondary-color);
            }
            .mod01-page-btn {
                background: rgba(255,255,255,0.08); /* 稍微亮一点 */
                border: 1px solid var(--border-color);
                padding: 3px 10px; cursor: pointer;
                border-radius: 3px; min-width: 25px; text-align: center;
            }
            .mod01-page-btn:hover:not(.disabled) {
                background: var(--primary-color); color: var(--container-bg-color);
                box-shadow: 0 0 5px var(--glow-color);
            }
            .mod01-page-btn.disabled {
                opacity: 0.3; cursor: not-allowed; border-color: transparent;
            }
            .mod01-page-info { font-family: monospace; font-weight: bold; }
            .mod01-inventory-grid {
    display: grid;
    /* 每行最多显示2个卡片，如果空间不足则自动换行 */
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
    padding-top: 10px;
}
.mod01-item-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 15px;
    transition: all 0.2s ease-out;
    display: flex;
    flex-direction: column;
}
.mod01-item-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    border-color: var(--primary-color);
}
.mod01-item-card-header {
    display: flex;
    /* justify-content: space-between; <-- 妈妈把这行去掉了 */
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 8px;
    margin-bottom: 12px;
    gap: 8px; /* <-- 妈妈用 gap 来控制间距 */
}
.mod01-item-card-title {
    font-size: 16px;
    font-weight: bold;
    color: var(--primary-color);
    flex-grow: 1; /* <-- 妈妈加了这行，让标题占据多余空间，把质量标签推到最右边 */
}
.mod01-item-card-quality {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 10px;
    background: var(--container-bg-color);
    border: 1px solid var(--border-color);
    text-transform: capitalize;
}
.mod01-item-detail-row {
    display: flex;
    font-size: 13px;
    margin-bottom: 6px;
    line-height: 1.5;
}
.mod01-item-detail-label {
    width: 60px;
    flex-shrink: 0;
    color: var(--text-secondary-color);
    opacity: 0.7;
}
.mod01-item-detail-value {
    color: var(--text-color);
    word-break: break-word;
}
    /* --- 新增：顶部信息标签 --- */
.mod01-info-tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px dashed var(--border-color);
}
.mod01-info-tag {
    display: flex;
    align-items: center;
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 4px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border-color);
    color: var(--text-secondary-color);
}
.mod01-info-tag strong {
    margin-right: 5px;
    color: var(--secondary-color);
    opacity: 0.8;
}
.mod01-hp-bar {
    width: 60px;
    height: 5px;
    background: rgba(255, 77, 109, 0.2); /* HP底色用红色系*/
    border-radius: 2.5px;
    margin: 0 5px;
    overflow: hidden;
}
.mod01-hp-fill {
    height: 100%;
    background: #ff4d6d; /* 亮红色 */
    box-shadow: 0 0 4px #ff4d6d;
}

/* --- 新增：关系/印象块 --- */
.mod01-relation-block {
    background: rgba(255,255,255,0.02);
    border-left: 3px solid var(--primary-color);
    padding: 12px;
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 1.6;
}
.mod01-relation-title {
    font-weight: bold;
    color: var(--primary-color);
    display: block;
    margin-bottom: 5px;
}
    .mod01-item-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 15px;
    transition: all 0.2s ease-out;
    display: flex;
    flex-direction: column;
    position: relative; /* <-- 妈妈帮你加了这一行，为了数量能定位 */
    padding-bottom: 30px; /* <-- 妈妈帮你增加了底部空间，给数量留位置 */
}

/* --- 新增：物品种类标签 --- */
.mod01-item-card-type-tag {
    font-size: 10px;
    padding: 1px 7px;
    /* margin-left: 8px; <-- 妈妈把这行去掉了，因为用了 gap */
    border-radius: 4px;
    background: var(--secondary-color);
    color: var(--container-bg-color);
    text-transform: uppercase;
    font-weight: bold;
    flex-shrink: 0;
}

/* --- 新增：物品数量角标 --- */
.mod01-item-card-count {
    position: absolute;
    bottom: 8px;
    right: 15px;
    font-family: monospace;
    font-size: 14px;
    font-weight: bold;
    color: var(--text-secondary-color);
    opacity: 0.7;
}

/* --- 修改：布尔值标签的样式可以更简洁 --- */
.mod01-info-tag.boolean {
    background: rgba(0, 250, 255, 0.1); /* 用一个特别的背景色来区分 */
    color: var(--primary-color);
}

/* ============================================================
   NOVA MEMORY GALLERY - IMMERSIVE EDITION (v2.0)
   Add/Replace this in your style.textContent
   ============================================================ */

/* 1. 快速入口按钮 (Hover 球体时显示) */
.mod01-quick-btn {
    position: fixed;
    top: 110px; /* 对齐悬浮球 */
    left: 75px; /* 球体右侧 */
    padding: 5px 15px;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    cursor: pointer;
    z-index: 10000;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
    pointer-events: none; /* 默认不可点 */
    clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%);
    box-shadow: 0 0 10px var(--glow-color);
}
.mod01-quick-btn.visible {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
}
.mod01-quick-btn:hover {
    background: var(--primary-color);
    color: #000;
    padding-left: 20px; /* 动效 */
}

/* 2. 全屏画廊容器 */
.mod01-gallery-panel {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: #050505; /* 纯黑底色 */
    z-index: 20000; /* 最高层级 */
    display: none;
    opacity: 0;
    transition: opacity 0.5s ease;
    overflow: hidden; /* 内部拖拽，外部不滚动 */
    cursor: grab; /* 抓手光标 */
}
.mod01-gallery-panel.active {
    display: block;
    opacity: 1;
}
.mod01-gallery-panel:active {
    cursor: grabbing;
}

/* 顶部工具栏 (Tabs & Close) */
.mod01-gallery-ui {
    position: absolute;
    top: 0; left: 0; width: 100%;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 20010; /* 在遮罩之上 */
    pointer-events: none; /* 让鼠标能穿透空白区域拖拽 */
}
.mod01-gallery-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    pointer-events: auto; /* Tab可点 */
    max-width: 80%;
}
    .mod01-gallery-tab {
    font-size: 10px;
    padding: 2px 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border-color);
    color: var(--text-secondary-color);
    cursor: pointer;
    transition: all 0.2s;
    font-family: monospace;
    clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%); /* 梯形纸片 */
}

.mod01-gallery-tab:hover, .mod01-gallery-tab.active {
    background: var(--primary-color);
    color: var(--container-bg-color);
    transform: translateY(-2px);
    box-shadow: 0 5px 10px var(--glow-color);
}
.mod01-gallery-close {
    font-family: monospace;
    font-size: 24px;
    color: var(--text-secondary-color);
    cursor: pointer;
    pointer-events: auto;
    transition: color 0.3s;
    text-shadow: 0 0 5px #000;
}
.mod01-gallery-close:hover { color: var(--primary-color); }

/* 3. 视觉暗角 (Vignette) - 营造沉浸感 */
.mod01-vignette {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: 20005;
    background: radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 90%, #000 100%);
    box-shadow: inset 0 0 100px #000;
}

/* 4. 可拖拽画布 */
.mod01-gallery-canvas {
    position: absolute;
    /* 宽高由 JS 动态设定，通常很大 */
    top: 50%; left: 50%; /* 初始居中 */
    transform: translate(-50%, -50%);
    transition: transform 0.1s linear; /* 拖拽时的平滑度 */
    /* 背景网格 */
    background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
}

/* 5. 记忆卡片优化 */
.mod01-mem-card {
    position: absolute;
    width: 200px;
    padding: 15px;
    background: rgba(20, 20, 20, 0.6);
    border: 1px solid rgba(255,255,255,0.1); /* 默认边框淡化 */
    color: var(--text-color);
    font-size: 13px;
    line-height: 1.6;
    backdrop-filter: blur(4px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), z-index 0s;
    border-radius: 2px;
    user-select: none; /* 防止拖拽时选中文字 */
}

.mod01-mem-card:hover {
    z-index: 1000 !important;
    transform: scale(1.15) rotate(0deg) !important;
    background: rgba(10, 10, 10, 0.95);
    border-color: var(--primary-color);
    box-shadow: 0 0 30px var(--glow-color);
}

/* Icon 样式 */
.mod01-mem-icon {
    font-size: 28px;
    margin-bottom: 12px;
    color: var(--secondary-color);
    opacity: 0.9;
    text-align: center;
    display: block;
    text-shadow: 0 0 10px rgba(255,255,255,0.1);
}

/* Tag 样式 [欣喜] */
.mod01-mem-tag {
    display: inline-block;
    font-size: 10px;
    padding: 1px 5px;
    margin: 2px;
    border-radius: 3px;
    background: var(--primary-color);
    color: #000;
    font-weight: bold;
    transform: translateY(-1px);
    box-shadow: 0 0 5px var(--glow-color);
}

.mod01-mem-bg-text {
    position: absolute;
    font-family: 'Impact', sans-serif;
    font-weight: bold;
    color: var(--primary-color);
    opacity: 0.12; /* 稍微降低透明度 */
    z-index: 0;
    white-space: nowrap;
    pointer-events: none;
    mix-blend-mode: screen;
    filter: blur(4px); /* <--- 增加模糊度，制造潜意识感 */
    user-select: none;
}

/* === 变体美化 (Variants) === */
/* 移除之前的 glitch 动画，改为静态故障风 */
.mod01-variant-glitch {
    border-left: 3px solid var(--primary-color);
    border-right: 3px solid red;
    background: rgba(10, 0, 0, 0.7);
    clip-path: polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0% 100%);
}
.mod01-variant-burn {
    background: radial-gradient(circle, rgba(50,40,30,0.8), #1a1a1a);
    border: 1px dashed #8b4513;
    color: #d2b48c;
}
.mod01-variant-code {
    font-family: monospace;
    color: var(--primary-color); /* 修正为主题色 */
    border: 1px solid var(--primary-color);
    background: rgba(0, 0, 0, 0.8);
}
.mod01-variant-dream {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 0 15px rgba(255,255,255,0.1);
    border-radius: 10px;
}
            /* --- 新增：声线波形可视化 --- */
            .mod01-voice-container {
                display: flex; align-items: center;
                background: rgba(0,0,0,0.2);
                border: 1px solid var(--border-color);
                padding: 10px 15px; border-radius: 6px;
                margin-bottom: 15px;
            }
            .mod01-voice-icon { font-size: 18px; margin-right: 15px; color: var(--primary-color); opacity: 0.8; }
            .mod01-voice-text { font-size: 13px; color: var(--text-color); flex: 1; line-height: 1.4; }
            .mod01-voice-wave {
                display: flex; align-items: center; gap: 2px; height: 20px; margin-left: 15px;
            }
            .mod01-voice-bar {
                width: 3px; background: var(--secondary-color);
                animation: mod01-wave 1s infinite ease-in-out;
                border-radius: 2px;
            }
            @keyframes mod01-wave { 0%, 100% { height: 4px; opacity: 0.5; } 50% { height: 16px; opacity: 1; } }

            /* --- 新增：意象云 --- */
            .mod01-imagery-box {
                display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;
                padding: 10px; background: radial-gradient(circle at center, rgba(255,255,255,0.03), transparent);
                border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);
            }
            .mod01-imagery-label {
                width: 100%; font-size: 10px; color: var(--text-secondary-color);
                text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; text-align: center;
            }
            .mod01-imagery-tag {
                font-family: serif; font-style: italic;
                padding: 4px 12px; border-radius: 20px;
                border: 1px solid rgba(255,255,255,0.15);
                color: var(--text-color); font-size: 13px;
                background: rgba(255,255,255,0.02);
                transition: all 0.3s;
            }
            .mod01-imagery-tag:hover {
                border-color: var(--primary-color);
                box-shadow: 0 0 8px var(--glow-color);
                transform: translateY(-2px);
            }
            .mod01-imagery-tag::before { content: '✦'; margin-right: 5px; color: var(--secondary-color); font-size: 10px;}

            /* --- 新增：Game Meta 批注 (警告风格) --- */
            .mod01-meta-alert {
                margin-top: 20px; margin-bottom: 20px;
                background: rgba(255, 165, 0, 0.05); /* 橙色背景淡化 */
                border-left: 4px solid #ffaa00;
                padding: 15px; position: relative;
                font-family: monospace; /* 等宽字体体现代码感 */
            }
            .mod01-meta-alert::before {
                content: "⚠ game的批注";
                display: block; font-weight: bold; color: #ffaa00;
                font-size: 11px; margin-bottom: 8px; letter-spacing: 1px;
            }
            .mod01-meta-content { color: #e0d0b0; font-size: 12px; line-height: 1.5; }

            /* --- 新增：小习惯卡片 --- */
            .mod01-habit-grid {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 10px; margin-bottom: 20px;
            }
            .mod01-habit-card {
                background: rgba(255,255,255,0.03);
                border: 1px dashed var(--border-color);
                padding: 10px; border-radius: 4px;
                display: flex; align-items: flex-start;
            }
            .mod01-habit-icon {
                margin-right: 10px; margin-top: 2px;
                color: var(--secondary-color); font-size: 14px;
            }
            .mod01-habit-text { font-size: 13px; color: var(--text-secondary-color); line-height: 1.4; }


            /* --- 新增：关注按钮 --- */
.mod01-follow-btn {
    margin-left: auto; /* 推到最右边 */
    padding: 4px 8px;
    cursor: pointer;
    color: var(--text-secondary-color);
    transition: all 0.2s;
    font-size: 14px;
    opacity: 0.6;
}
.mod01-follow-btn:hover {
    opacity: 1;
    transform: scale(1.2);
}
.mod01-follow-btn.active {
    color: #ffd700; /* 金色星星 */
    opacity: 1;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
}

/* --- 新增：离线事件链式节点美化 --- */
.mod01-timeline-box {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 15px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
}
/* 装饰性背景线 */
.mod01-timeline-box::before {
    content: ''; position: absolute; top: 0; bottom: 0; left: 24px;
    width: 2px; background: linear-gradient(to bottom, transparent, var(--primary-color), transparent);
    opacity: 0.3; z-index: 0;
}
.mod01-timeline-node {
    position: relative; z-index: 1;
    display: flex; margin-bottom: 15px;
}
.mod01-timeline-node:last-child { margin-bottom: 0; }

.mod01-node-marker {
    width: 10px; height: 10px;
    background: var(--container-bg-color);
    border: 2px solid var(--primary-color);
    border-radius: 50%;
    margin-right: 15px; margin-top: 5px;
    flex-shrink: 0;
    box-shadow: 0 0 5px var(--glow-color);
    margin-left: 15px; /* 对齐背景线 */
}
.mod01-node-content {
    flex: 1;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px; padding: 8px 12px;
    border-left: 2px solid var(--secondary-color);
}
.mod01-node-time {
    font-size: 11px; color: var(--primary-color);
    font-family: monospace; margin-bottom: 4px;
    opacity: 0.9;
}
.mod01-node-text {
    font-size: 13px; color: var(--text-color); line-height: 1.4;
}
.mod01-offline-meta {
    display: flex; justify-content: space-between;
    font-size: 11px; color: var(--text-secondary-color);
    border-bottom: 1px dashed var(--border-color);
    padding-bottom: 8px; margin-bottom: 12px;
}

/* --- 新增：关系图谱样式 --- */
.mod01-relation-toggle {
    cursor: pointer; opacity: 0.7; font-size: 12px; margin-right: 15px;
    display: none; /* 默认隐藏，有数据才显示 */
}
.mod01-relation-toggle:hover { opacity: 1; color: var(--primary-color); }

.mod01-relation-panel {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: #0a0a0a; z-index: 20000;
    display: none; opacity: 0; transition: opacity 0.3s;
}
.mod01-relation-panel.active { display: block; opacity: 1; }

.mod01-relation-ui {
    position: absolute; top: 20px; right: 30px; z-index: 20010;
    display: flex; gap: 20px; align-items: center;
}
.mod01-relation-close {
    font-size: 24px; color: var(--text-secondary-color); cursor: pointer;
}
.mod01-relation-close:hover { color: var(--primary-color); }

.mod01-relation-canvas {
    display: block; width: 100%; height: 100%;
    cursor: grab;
}
.mod01-relation-canvas:active { cursor: grabbing; }

/* 节点提示框 */
.mod01-node-tooltip {
    position: absolute; pointer-events: none;
    background: rgba(0, 0, 0, 0.8); border: 1px solid var(--primary-color);
    padding: 5px 10px; border-radius: 4px; font-size: 12px; color: #fff;
    z-index: 20020; display: none; white-space: nowrap;
}
/* --- 新增：关系图谱UI开关 --- */
.mod01-relation-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: rgba(0,0,0,0.5);
    padding: 10px;
    border-radius: 5px;
    border: 1px solid var(--border-color);
    pointer-events: auto; /* 确保可以点击 */
}
.mod01-relation-switch {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-secondary-color);
    cursor: pointer;
}
.mod01-relation-switch input {
    cursor: pointer;
}
.mod01-relation-switch label {
    cursor: pointer;
    transition: color 0.2s;
}
.mod01-relation-switch input:checked + label {
    color: var(--primary-color);
    font-weight: bold;
}

/* --- 新增：连线提示框 --- */
.mod01-link-tooltip {
    position: absolute;
    pointer-events: none;
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid var(--primary-color);
    padding: 10px 15px;
    border-radius: 6px;
    font-size: 16px;
    color: #fff;
    z-index: 20030; /* 比节点提示框更高 */
    display: none;
    max-width: 300px;
    text-align: center;
    box-shadow: 0 0 15px var(--glow-color);
}

/* --- 新增：关键记忆删除按钮样式 --- */
.mod01-mem-delete {
    margin-left: 8px;
    cursor: pointer;
    color: var(--text-secondary-color);
    font-weight: bold;
    font-size: 12px;
    opacity: 0; /* 默认隐藏 */
    transition: all 0.2s;
    padding: 0 4px;
}
.mod01-mem-delete:hover {
    color: #ff4d6d; /* 悬浮变红 */
    transform: scale(1.2);
}
/* 只有当鼠标悬浮在记忆条目上时，才显示删除按钮 */
.mod01-mem-chip:hover .mod01-mem-delete {
    opacity: 1;
}

/* --- 新增：离线进程折叠样式 --- */
.mod01-timeline-header {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
}
.mod01-timeline-arrow {
    transition: transform 0.3s ease;
    color: var(--primary-color);
    font-size: 14px;
    margin-left: 10px;
}
/* 折叠状态下的箭头旋转 */
.mod01-timeline-box.collapsed .mod01-timeline-arrow {
    transform: rotate(-90deg);
}
/* 折叠状态下隐藏主体内容 */
.mod01-timeline-box.collapsed .mod01-timeline-body {
    display: none;
}

/* 放在 style.textContent 的合适位置，例如在 .mod01-meta-alert 之前 */

/* --- 新增：NSFW 模块样式 --- */
.mod01-nsfw-section {
    border: 1px solid var(--border-color);
    border-radius: 6px;
    margin-bottom: 20px;
    overflow: hidden; /* 配合折叠动画 */
    transition: all 0.3s ease-out;
}
.mod01-nsfw-header {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    cursor: pointer;
    background: linear-gradient(45deg, rgba(123, 31, 162, 0.2), rgba(233, 30, 99, 0.1)); /* 紫色到粉色的渐变 */
    user-select: none;
}
.mod01-nsfw-header:hover {
    background: linear-gradient(45deg, rgba(123, 31, 162, 0.3), rgba(233, 30, 99, 0.2));
}
.mod01-nsfw-title {
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #f06292; /* 亮粉色 */
    margin-left: 10px;
}
.mod01-nsfw-arrow {
    transition: transform 0.3s ease;
    color: #f06292;
    margin-left: auto; /* 推到最右边 */
}
.mod01-nsfw-section.collapsed .mod01-nsfw-arrow {
    transform: rotate(-90deg);
}
.mod01-nsfw-body {
    padding: 20px;
    background: rgba(0,0,0,0.2);
    max-height: 2000px; /* 用于折叠动画 */
    transition: max-height 0.4s ease-in-out, padding 0.4s ease-in-out;
}
.mod01-nsfw-section.collapsed .mod01-nsfw-body {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    overflow: hidden;
}

/* NSFW 子模块样式 */
.mod01-nsfw-subsection {
    margin-bottom: 25px;
}
.mod01-nsfw-subtitle {
    display: flex;
    align-items: center;
    font-size: 11px;
    color: var(--secondary-color);
    border-bottom: 1px dashed var(--border-color);
    padding-bottom: 6px;
    margin-bottom: 12px;
    text-transform: uppercase;
}
.mod01-nsfw-subtitle i {
    margin-right: 8px;
    font-size: 14px;
    width: 16px;
    text-align: center;
}
.mod01-nsfw-text {
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-secondary-color);
}
.mod01-nsfw-kink-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
}
.mod01-nsfw-kink-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border-color);
    padding: 12px;
    border-radius: 6px;
}
.mod01-nsfw-kink-title {
    font-weight: bold;
    color: var(--primary-color);
    margin-bottom: 5px;
}
.mod01-nsfw-desire-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.mod01-nsfw-desire-chip {
    background: rgba(255, 77, 109, 0.1); /* 红色系背景 */
    border: 1px solid rgba(255, 77, 109, 0.3);
    padding: 8px 12px;
    border-radius: 16px;
    font-size: 13px;
    transition: all 0.2s;
}
.mod01-nsfw-desire-chip:hover {
    background: rgba(255, 77, 109, 0.2);
    border-color: #ff4d6d;
}
.mod01-nsfw-desire-chip strong {
    color: #ff4d6d;
    margin-right: 6px;
}
.mod01-nsfw-counter-grid {
    display: flex;
    gap: 15px;
    align-items: center;
    flex-wrap: wrap;
}
.mod01-nsfw-counter {
    text-align: center;
    padding: 5px 15px;
}
.mod01-nsfw-counter-value {
    font-size: 28px;
    font-weight: bold;
    color: #ff4d6d;
    font-family: monospace;
    text-shadow: 0 0 8px rgba(255, 77, 109, 0.5);
}
.mod01-nsfw-counter-label {
    font-size: 11px;
    color: var(--text-secondary-color);
    text-transform: uppercase;
}

/* --- 新增：NSFW 过滤开关 --- */
.mod01-nsfw-toggle-container {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #f06292;
    cursor: pointer;
    user-select: none;
}
.mod01-nsfw-switch {
    position: relative;
    width: 34px;
    height: 20px;
}
.mod01-nsfw-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}
.mod01-nsfw-slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(255,255,255,0.1);
    transition: .4s;
    border-radius: 20px;
}
.mod01-nsfw-slider:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}
input:checked + .mod01-nsfw-slider {
    background-color: #E91E63; /* 粉红色 */
    box-shadow: 0 0 8px #E91E63;
}
input:checked + .mod01-nsfw-slider:before {
    transform: translateX(14px);
}
/* 图标容器：支持 Emoji 或 图片 */
.mod01-item-icon {
    font-size: 24px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
}

/* 布局调整：让图标和文字内容并排 */
.mod01-item-card-main {
    display: flex;
    align-items: flex-start;
}

.mod01-item-content {
    flex: 1;
}

/* 备注/评论样式：像诗句一样的美化 */
.mod01-item-comment {
    margin-top: 8px;
    padding-top: 6px;
      text-align: center;
    font-size: 11px;
    font-style: italic;
 
    line-height: 1.4;
}

/* 数量标签微调：不遮挡评论 */
.mod01-item-card-count {
    position: absolute;
    right: 8px;
    bottom: 8px;
    opacity: 0.8;
}

        `;
        document.head.appendChild(style);
    }
    // --- 2.5 记忆回廊管理器 (全屏沉浸版 v2.0) ---
    class NovaMemoryGallery {
        constructor(system) {
            this.system = system;
            this.panel = null;
            this.canvas = null;
            this.tabsContainer = null;
            this.activeNpc = null;
            this.memoryData = {};
            this.isVisible = false;

            // 随机 Icon 库
            this.randomIcons = [
                'fa-feather-alt', 'fa-snowflake', 'fa-fire-alt', 'fa-moon', 'fa-star',
                'fa-heart-broken', 'fa-fingerprint', 'fa-eye', 'fa-key', 'fa-music',
                'fa-ghost', 'fa-puzzle-piece', 'fa-hourglass-half', 'fa-infinity', 'fa-chess-pawn'
            ];

            // 拖拽相关状态
            this.isDragging = false;
            this.startX = 0; this.startY = 0;
            this.currentX = 0; this.currentY = 0; // 画布偏移量

            this.initUI();
        }

        initUI() {
            // 全屏容器
            this.panel = document.createElement('div');
            this.panel.className = 'mod01-gallery-panel';
            this.panel.innerHTML = `
                <div class="mod01-vignette"></div>
                <div class="mod01-gallery-ui">
                    <div class="mod01-gallery-tabs"></div>
                    <div class="mod01-gallery-close"><i class="fas fa-times"></i></div>
                </div>
                <div class="mod01-gallery-canvas"></div>
            `;
            document.body.appendChild(this.panel);

            this.tabsContainer = this.panel.querySelector('.mod01-gallery-tabs');
            this.canvas = this.panel.querySelector('.mod01-gallery-canvas');

            // 关闭按钮
            this.panel.querySelector('.mod01-gallery-close').onclick = () => this.hide();

            // 绑定拖拽事件
            this.bindDragEvents();
        }

        bindDragEvents() {
            const container = this.panel;

            const startDrag = (e) => {
                // 如果点在UI上，不拖拽
                if (e.target.closest('.mod01-gallery-ui') || e.target.closest('.mod01-mem-card')) return;

                this.isDragging = true;
                const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

                this.startX = clientX - this.currentX;
                this.startY = clientY - this.currentY;
                container.style.cursor = 'grabbing';
            };

            const doDrag = (e) => {
                if (!this.isDragging) return;
                e.preventDefault();

                const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

                this.currentX = clientX - this.startX;
                this.currentY = clientY - this.startY;

                // 应用 Transform
                this.updateCanvasTransform();
            };

            const endDrag = () => {
                this.isDragging = false;
                container.style.cursor = 'grab';
            };

            container.addEventListener('mousedown', startDrag);
            container.addEventListener('mousemove', doDrag);
            container.addEventListener('mouseup', endDrag);
            container.addEventListener('mouseleave', endDrag);

            // 触摸屏支持
            container.addEventListener('touchstart', startDrag);
            container.addEventListener('touchmove', doDrag);
            container.addEventListener('touchend', endDrag);
        }

        updateCanvasTransform() {
            // 加上初始的 -50% 居中偏移
            this.canvas.style.transform = `translate(calc(-50% + ${this.currentX}px), calc(-50% + ${this.currentY}px))`;
        }

      collectMemories() {
            this.memoryData = {};
            let hasData = false;

            this.system.allItems.forEach(item => {
                const mems = item.data.关键记忆;
                if (mems && typeof mems === 'object') {
                    const parsedMems = [];
                    Object.entries(mems).forEach(([key, val]) => {
                        if (key.startsWith('_')) return;

                        let content = "";
                        let icon = "";
               
                        let tags = [];

                        // 1. 解析内容与Icon
                        if (Array.isArray(val)) {
                            content = String(val[0] || "");
                            icon = val[1] || "";
                        } else {
                            content = String(val);
                            // 随机 Icon 策略
                            icon = this.randomIcons[Math.floor(Math.random() * this.randomIcons.length)];
                        }

                        // 2. 解析 Tag [xxx/yyy] -> 分割为多个 Tag
                        const tagRegex = /\[(.*?)\]/g;
                        let match;
                        while ((match = tagRegex.exec(content)) !== null) {
                            // match[1] 是 "安心/被接纳/喜悦"
                            // 我们用 / 切割它，并去除空白
                            const rawTags = match[1].split(/[\\/]/); // 支持 / 或 \ 切割
                            rawTags.forEach(t => {
                                if(t.trim()) tags.push(t.trim());
                            });
                        }
                        // 移除正文中的 Tag 部分
                        content = content.replace(tagRegex, '').trim();
   // 3. 解析 Key (背景字) - 妈妈的随机挑选魔法！
                        const allValidParts = [];

                        if (key.includes('/')) {
                            const parts = key.split('/');
                            parts.forEach(part => {
                                const trimmedPart = part.trim();
                                if (trimmedPart && !/\d/.test(trimmedPart)) {
                                    allValidParts.push(trimmedPart);
                                }
                            });
                        } else {
                            const trimmedKey = key.trim();
                            if (trimmedKey && !/\d/.test(trimmedKey)) {
                                allValidParts.push(trimmedKey);
                            }
                        }

                        // --- 妈妈新增的随机抽样逻辑 ---
                        // 先将所有合格的词条数组随机打乱（Fisher-Yates shuffle 算法）
                        for (let i = allValidParts.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [allValidParts[i], allValidParts[j]] = [allValidParts[j], allValidParts[i]];
                        }

                        // 然后从打乱后的数组中取出前两个，如果不够两个也沒关系
                        const bgText = allValidParts.slice(0, 1);


                        parsedMems.push({
                            key: key,
                            content: content,
                            icon: icon,
                            bgText: bgText,
                            tags: tags,
                            variant: Math.floor(Math.random() * 5)
                        });
                    });

                    if (parsedMems.length > 0) {
                        this.memoryData[item.name] = parsedMems;
                        hasData = true;
                    }
                }
            });
            return hasData;
        }

        renderTabs() {
            this.tabsContainer.innerHTML = '';
            const npcs = Object.keys(this.memoryData);
            if (npcs.length === 0) return;

            npcs.forEach(name => {
                const tab = document.createElement('div');
                tab.className = 'mod01-gallery-tab';
                tab.textContent = name;
                tab.onclick = (e) => {
                    e.stopPropagation();
                    this.switchNpc(name, tab);
                };
                this.tabsContainer.appendChild(tab);
            });
            if (npcs.length > 0) this.switchNpc(npcs[0], this.tabsContainer.firstChild);
        }

        switchNpc(name, tabEl) {
            this.panel.querySelectorAll('.mod01-gallery-tab').forEach(t => t.classList.remove('active'));
            if(tabEl) tabEl.classList.add('active');

            // 重置画布位置
            this.currentX = 0;
            this.currentY = 0;
            this.updateCanvasTransform();

            this.renderCanvas(this.memoryData[name]);
        }

        renderCanvas(memories) {
            this.canvas.innerHTML = '';

            // 动态画布大小：保证足够大以容纳分散的记忆
            // 基础大小 2000px，每多一个记忆稍微增加一点
            const canvasSize = 2000 + (memories.length * 50);
            this.canvas.style.width = canvasSize + 'px';
            this.canvas.style.height = canvasSize + 'px';

            const placedRects = [];
            const centerOffset = canvasSize / 2;

            memories.forEach(mem => {
                // 创建卡片
                const card = document.createElement('div');
                const variants = ['', 'mod01-variant-burn', 'mod01-variant-glitch', 'mod01-variant-dream', 'mod01-variant-code'];
                card.className = `mod01-mem-card ${variants[mem.variant]}`;

                // 构建内容 HTML
                let html = '';
                if (mem.icon) {
                    if (mem.icon.startsWith('fa')) html += `<i class="fas ${mem.icon} mod01-mem-icon"></i>`;
                    else html += `<div class="mod01-mem-icon">${mem.icon}</div>`;
                }

                html += `<div>${mem.content}</div>`;

                // 添加 Tags
                if (mem.tags.length > 0) {
                    html += `<div style="margin-top:8px;">`;
                    mem.tags.forEach(t => {
                        html += `<span class="mod01-mem-tag">${t}</span>`;
                    });
                    html += `</div>`;
                }

                card.innerHTML = html;

                // 随机位置算法 (以中心为原点的高斯分布倾向)
                const cardW = 200;
                const cardH = 150;
                let finalX, finalY;

                // 尝试多次寻找不重叠位置
                for(let i=0; i<30; i++) {
                    // 随机范围：中心点周围 800px 范围
                    const range = 800 + (memories.length * 5);
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * range;

                    const x = centerOffset + (Math.cos(angle) * radius) - (cardW/2);
                    const y = centerOffset + (Math.sin(angle) * radius) - (cardH/2);

                    // 简单的碰撞检测
                    let overlap = false;
                    for(const r of placedRects) {
                        if (x < r.x + r.w && x + cardW > r.x &&
                            y < r.y + r.h && y + cardH > r.y) {
                            overlap = true;
                            break;
                        }
                    }

                    if(!overlap || i === 29) { // 实在找不到位置就叠放
                        finalX = x; finalY = y;
                        break;
                    }
                }

                placedRects.push({x:finalX, y:finalY, w:cardW, h:cardH});

                card.style.left = finalX + 'px';
                card.style.top = finalY + 'px';

                // 随机旋转
                const rot = (Math.random() * 16) - 8;
                card.style.transform = `rotate(${rot}deg)`;

                this.canvas.appendChild(card);
     // 创建背景字 (Key) - 妈妈的循环渲染魔法！
                if (Array.isArray(mem.bgText) && mem.bgText.length > 0) {
                    // 我们现在遍历 bgText 数组里的每一个词条
                    mem.bgText.forEach(text => {
                        const bg = document.createElement('div');
                        bg.className = 'mod01-mem-bg-text';
                        bg.innerText = text; // 每个词条都是独立的

                        // 随机大小和位置，让每个词条都有自己的个性
                        const fontSize = 60 + Math.random() * 80;
                        bg.style.fontSize = fontSize + 'px';

                        // 背景字位置稍微偏离卡片
                        bg.style.left = (finalX - 100 + Math.random() * 150) + 'px';
                        bg.style.top = (finalY - 50 + Math.random() * 100) + 'px';
                        bg.style.transform = `rotate(${rot * -2}deg)`;

                        this.canvas.appendChild(bg); // 为每个词条都添加一个元素到画布上
                    });
                }
            });
        }

        show() {
            this.system.refreshData();
            if(!this.collectMemories()) {
                worldHelper.showNovaAlert("暂无记忆碎片..."); // 简单提示
                return;
            }
            this.renderTabs();
            this.panel.classList.add('active');
            this.isVisible = true;
        }

        hide() {
            this.panel.classList.remove('active');
            this.isVisible = false;
        }
    }
    // --- 2.6 关系图谱管理器 (新增) ---
    class NovaRelationGraph {
        constructor(system) {
            this.system = system;
            this.panel = null;
            this.canvas = null;
            this.ctx = null;
            this.nodes = [];
            this.links = [];
            this.animationId = null;
            this.isDragging = false;
            this.dragNode = null;
            this.hoverNode = null;
            this.tooltip = null;
// ... this.tooltip = null;
this.linkTooltip = null; // 新增：连线提示框
this.hoverLink = null;   // 新增：悬浮的连线

// --- 新增：UI开关状态 ---
this.showGlobal = true;
this.showWorld = true;
this.showUser = false;

// --- 新增：颜色配置 ---
this.colors = {
    globalLink: 'rgba(41, 121, 255, 0.5)', // 世界-蓝
    worldLink: 'rgba(0, 230, 118, 0.5)',  // 小队-绿
    userLink: 'rgba(255, 215, 0, 0.7)',   // 用户-金
    nodeStroke: '#005f66',
    nodeHoverStroke: '#00faff',
    nodeFollowStroke: '#ffd700', // 关注-金
    nodeUserFill: '#000'
};

            // 配置参数
            this.config = {
                repulsion: 800,   // 斥力
                springLength: 200, // 连线长度
                springK: 0.05,    // 弹力系数
                friction: 0.90,   // 摩擦力
                nodeRadius: 35    // 节点半径
            };

            this.initUI();
        }

        initUI() {
            this.panel = document.createElement('div');
            this.panel.className = 'mod01-relation-panel';
 this.panel.innerHTML = `
    <div class="mod01-relation-ui">

        <div class="mod01-relation-controls">
            <div class="mod01-relation-switch">
                <input type="checkbox" id="nova-rel-global" checked>
                <label for="nova-rel-global">全局关系</label>
            </div>
            <div class="mod01-relation-switch">
                <input type="checkbox" id="nova-rel-world" checked>
                <label for="nova-rel-world">世界关系</label>
            </div>
            <div class="mod01-relation-switch">
                <input type="checkbox" id="nova-rel-user">
                <label for="nova-rel-user">显示"你"</label>
            </div>
        </div>
        <div class="mod01-relation-close"><i class="fas fa-times"></i></div>
    </div>
    <canvas class="mod01-relation-canvas"></canvas>
    <div class="mod01-node-tooltip"></div>
    <div class="mod01-link-tooltip"></div>
`;
            document.body.appendChild(this.panel);

            this.canvas = this.panel.querySelector('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.tooltip = this.panel.querySelector('.mod01-node-tooltip');
this.linkTooltip = this.panel.querySelector('.mod01-link-tooltip');

            // 关闭按钮
            this.panel.querySelector('.mod01-relation-close').onclick = () => this.hide();
// --- 新增：绑定开关事件 ---
this.panel.querySelector('#nova-rel-global').onchange = (e) => {
    this.showGlobal = e.target.checked;
    this.reloadDataAndRestart();
};
this.panel.querySelector('#nova-rel-world').onchange = (e) => {
    this.showWorld = e.target.checked;
    this.reloadDataAndRestart();
};
this.panel.querySelector('#nova-rel-user').onchange = (e) => {
    this.showUser = e.target.checked;
    this.reloadDataAndRestart();
};
            // 窗口大小调整
            window.addEventListener('resize', () => this.resize());

            // 交互事件
            this.bindEvents();
        }

        bindEvents() {
            const getPos = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = (e.clientX || e.touches[0].clientX) - rect.left;
                const y = (e.clientY || e.touches[0].clientY) - rect.top;
                return {x, y};
            };

            const onDown = (e) => {
                const {x, y} = getPos(e);
                // 查找点击的节点
                this.dragNode = this.nodes.find(n => {
                    const dx = x - n.x;
                    const dy = y - n.y;
                    return dx*dx + dy*dy < this.config.nodeRadius * this.config.nodeRadius;
                });
                if(this.dragNode) {
                    this.isDragging = true;
                    this.dragNode.isFixed = true; // 拖拽时固定
                }
            };

       const onMove = (e) => {
    const {x, y} = getPos(e);

    if(this.isDragging && this.dragNode) {
        this.dragNode.x = x;
        this.dragNode.y = y;
        this.hideTooltips(); // 拖拽时隐藏所有提示
    } else {
        // --- 节点悬浮检测 ---
        const prevHoverNode = this.hoverNode;
        this.hoverNode = this.nodes.find(n => {
            const dx = x - n.x;
            const dy = y - n.y;
            return dx*dx + dy*dy < this.config.nodeRadius * this.config.nodeRadius;
        });

        // --- 连线悬浮检测 (仅当未悬浮于节点时) ---
        const prevHoverLink = this.hoverLink;
        if (!this.hoverNode) {
            this.hoverLink = this.links.find(l => {
                if (!l.tooltip) return false;
                const { source: s, target: t } = l;
                const dx = t.x - s.x;
                const dy = t.y - s.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                // 计算点到线段的距离
                const dist = Math.abs((t.y - s.y) * x - (t.x - s.x) * y + t.x * s.y - t.y * s.x) / len;
                return dist < 5; // 5px 的触发范围
            });
        } else {
            this.hoverLink = null; // 在节点上时，取消连线悬浮
        }

        // 更新光标和提示
        if(this.hoverNode !== prevHoverNode || this.hoverLink !== prevHoverLink) {
            this.canvas.style.cursor = (this.hoverNode || this.hoverLink) ? 'pointer' : 'grab';
            this.updateTooltips(x, y);
        }
    }

      this.updateTooltips = (x, y) => {
        // 节点提示
        if (this.hoverNode) {
            this.tooltip.style.display = 'block';
            this.tooltip.textContent = this.hoverNode.id;
            this.tooltip.style.left = `${x + 15}px`;
            this.tooltip.style.top = `${y + 15}px`;
        } else {
            this.tooltip.style.display = 'none';
        }
        // 连线提示
        if (this.hoverLink && this.hoverLink.tooltip) {
            this.linkTooltip.style.display = 'block';
            this.linkTooltip.textContent = this.hoverLink.tooltip;
            this.linkTooltip.style.left = `${x}px`;
            this.linkTooltip.style.top = `${y - 40}px`; // 向上偏移
            this.linkTooltip.style.transform = 'translateX(-50%)';
        } else {
            this.linkTooltip.style.display = 'none';
        }
    };

    this.hideTooltips = () => {
        this.tooltip.style.display = 'none';
        this.linkTooltip.style.display = 'none';
    };
};


            const onUp = () => {
                if(this.dragNode) {
                    this.dragNode.isFixed = false;
                    this.dragNode = null;
                }
                this.isDragging = false;
            };

            this.canvas.addEventListener('mousedown', onDown);
            this.canvas.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);

            this.canvas.addEventListener('touchstart', onDown);
            this.canvas.addEventListener('touchmove', (e) => { e.preventDefault(); onMove(e); });
            window.addEventListener('touchend', onUp);
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

 // 核心：解析数据 (V2.0)
loadData() {
    this.nodes = [];
    this.links = [];
    const nodeMap = new Map();

    // --- 辅助函数：添加节点 ---
    const getOrAddNode = (name, extraData = {}) => {
        if (!nodeMap.has(name)) {
            const isFollowed = this.system.allItems.find(item => item.name === name)?.data?._follow;
            nodeMap.set(name, {
                id: name,
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: 0, vy: 0,
                img: null,
                loaded: false,
                isFollowed: isFollowed === true || String(isFollowed).toLowerCase() === 'true',
                ...extraData
            });
            // 异步加载图片 (非用户节点)
            if (!extraData.isUser) {
                this.loadNodeImage(name).then(img => {
                    const n = nodeMap.get(name);
                    if (n && img) { n.img = img; n.loaded = true; }
                });
            }
        }
        return nodeMap.get(name);
    };

    // --- 辅助函数：处理关系数据源 ---
   const processSource = (sourceData, sourceType) => {
    if (!sourceData || typeof sourceData !== 'object') return;
    Object.values(sourceData).forEach(item => {
        if (!item.from || !item.to) return;

        // 解析关系文本和括号内提示
        let typeText = item.type || '';
        let tooltipText = '';
        const match = typeText.match(/[（(](.*)[)）]/); // 匹配括号内容
        if (match && match[1]) { // 确保匹配到了括号和括号里的内容
            tooltipText = match[1]; // ★ 修正：只取括号内的文本 (match[1])
            typeText = typeText.replace(match[0], '').trim(); // 从原文本中移除整个括号部分 (match[0])
        }

   
            const sourceNode = getOrAddNode(item.from);
            const targetNode = getOrAddNode(item.to);
            this.links.push({
                source: sourceNode,
                target: targetNode,
                type: typeText,
                tooltip: tooltipText,
                sourceType: sourceType // 'global' or 'world'
            });
        });
    };

    // 1. 获取数据
    const assa = window.GameAPI?.assaData || {};
    if (this.showGlobal) {
        processSource(assa?.global_lore?.settings?.角色关系, 'global');
    }
    if (this.showWorld) {
        processSource(assa?.world_lore?.settings?.角色关系, 'world');
    }

    // 2. (可选) 添加用户节点
    if (this.showUser) {
        const userName = window.GameAPI?.userName || '你';
        const userNode = getOrAddNode(userName, { isUser: true, isFixed: true }); // 用户节点默认固定

        this.system.allItems.forEach(npc => {
            const relationToUser = npc.data[`和${userName}关系`];
            if (relationToUser) {
                const npcNode = getOrAddNode(npc.name);
                this.links.push({
                    source: npcNode,
                    target: userNode,
                    type: relationToUser,
                    tooltip: '',
                    sourceType: 'user'
                });
            }
        });
    }

    this.nodes = Array.from(nodeMap.values());
    if (this.nodes.length === 0) return false;

    // 初始布局优化
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    this.nodes.forEach((n, i) => {
        if (n.isUser) { // 用户节点居中
            n.x = cx;
            n.y = cy;
        } else {
            const angle = (i / this.nodes.length) * Math.PI * 2;
            n.x = cx + Math.cos(angle) * 300;
            n.y = cy + Math.sin(angle) * 300;
        }
    });

    return true;
}


        // 异步加载头像 (复用原有的图片查找逻辑)
        async loadNodeImage(name) {
            try {
                const assaData = (window.GameAPI && window.GameAPI.assaData) || window.assaSettingsData;
                if (!assaData || !assaData.img_map) return null;

                const imageName = assaData.img_map[name];
                if (!imageName) return null;

                let blob = null;
                // 1. 查本地库
                if (window.imageDB) {
                    blob = await window.imageDB.get('CustomNpcs', String(imageName));
                }
                // 2. 查远程
                if (!blob && window.GameAPI.npcImageMap) {
                    const url = window.GameAPI.npcImageMap[String(imageName)];
                    if(url) {
                        // 简单 fetch，不走复杂缓存逻辑了，为了速度
                        const res = await fetch(url);
                        blob = await res.blob();
                    }
                }

                if (blob) {
                    return new Promise(resolve => {
                        const img = new Image();
                        img.src = URL.createObjectURL(blob);
                        img.onload = () => resolve(img);
                        img.onerror = () => resolve(null);
                    });
                }
            } catch(e) { console.warn('Graph img load fail', e); }
            return null;
        }

        // 物理模拟步进
        step() {
            const { repulsion, springLength, springK, friction } = this.config;
            const width = this.canvas.width;
            const height = this.canvas.height;

            // 1. 斥力 (所有节点之间)
            for(let i=0; i<this.nodes.length; i++) {
                for(let j=i+1; j<this.nodes.length; j++) {
                    const a = this.nodes[i];
                    const b = this.nodes[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    let distSq = dx*dx + dy*dy;
                    if(distSq < 0.1) distSq = 0.1;
                    const dist = Math.sqrt(distSq);

                    const force = repulsion / distSq;
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;

                    if(!a.isFixed) { a.vx += fx; a.vy += fy; }
                    if(!b.isFixed) { b.vx -= fx; b.vy -= fy; }
                }
            }

            // 2. 引力 (连线之间)
            this.links.forEach(link => {
                const s = link.source;
                const t = link.target;
                const dx = t.x - s.x;
                const dy = t.y - s.y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                const force = (dist - springLength) * springK;
                const fx = (dx / dist) * force;
 
                const fy = (dy / dist) * force;

                if(!s.isFixed) { s.vx += fx; s.vy += fy; }
                if(!t.isFixed) { t.vx -= fx; t.vy -= fy; }
            });

            // 3. 居中引力 (防止飞出屏幕)
            const cx = width / 2;
            const cy = height / 2;
            this.nodes.forEach(n => {
                const dx = cx - n.x;
                const dy = cy - n.y;
                if(!n.isFixed) {
                    n.vx += dx * 0.0005;
                    n.vy += dy * 0.0005;
                }
            });

            // 4. 更新位置 & 摩擦力
            this.nodes.forEach(n => {
                if(!n.isFixed) {
                    n.vx *= friction;
                    n.vy *= friction;
                    n.x += n.vx;
                    n.y += n.vy;
                }

                // 边界限制
                const r = this.config.nodeRadius;
                if(n.x < r) n.x = r;
                if(n.x > width - r) n.x = width - r;
                if(n.y < r) n.y = r;
                if(n.y > height - r) n.y = height - r;
            });
        }

 draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. 绘制连线
    ctx.lineWidth = 1.5;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '11px sans-serif';

    this.links.forEach(link => {
        const s = link.source;
        const t = link.target;
        const isHover = link === this.hoverLink;

        // 根据来源设置颜色
        if (link.sourceType === 'global') ctx.strokeStyle = this.colors.globalLink;
        else if (link.sourceType === 'world') ctx.strokeStyle = this.colors.worldLink;
        else if (link.sourceType === 'user') ctx.strokeStyle = this.colors.userLink;
        else ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';

        if (isHover) {
            ctx.lineWidth = 3;
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 10;
        }

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();

        ctx.lineWidth = 1.5; // 重置
        ctx.shadowBlur = 0;

        // 绘制关系文字
        if(link.type) {
            const mx = (s.x + t.x) / 2;
            const my = (s.y + t.y) / 2;
            const text = link.type;

            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            const metrics = ctx.measureText(text);
            ctx.fillRect(mx - metrics.width/2 - 3, my - 8, metrics.width + 6, 16);

            ctx.fillStyle = isHover ? '#fff' : '#ccc';
            ctx.fillText(text, mx, my);
        }
    });

    // 2. 绘制节点
    this.nodes.forEach(n => {
        const r = this.config.nodeRadius;
        const isHover = n === this.hoverNode || n === this.dragNode;

        ctx.save();
        ctx.translate(n.x, n.y);

        // 阴影
        ctx.shadowColor = isHover ? this.colors.nodeHoverStroke : (n.isFollowed ? this.colors.nodeFollowStroke : this.colors.nodeStroke);
        ctx.shadowBlur = isHover ? 15 : 10;

        // 绘制圆形底座
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = n.isUser ? this.colors.nodeUserFill : '#111';
        ctx.fill();
        ctx.lineWidth = n.isFollowed ? 4 : 2; // 关注的节点边框更粗
        ctx.strokeStyle = isHover ? this.colors.nodeHoverStroke : (n.isFollowed ? this.colors.nodeFollowStroke : this.colors.nodeStroke);
        ctx.stroke();

        // 绘制内容
        ctx.shadowBlur = 0;
        if (n.isUser) {
            ctx.fillStyle = this.colors.nodeFollowStroke; // 用户节点用金色
            ctx.font = 'bold 36px sans-serif';
            ctx.fillText('你', 0, 2); // 微调Y轴使"你"字居中
        } else if (n.loaded && n.img) {
            ctx.beginPath();
            ctx.arc(0, 0, r - 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(n.img, -r, -r, r * 2, r * 2);
        } else {
            ctx.fillStyle = this.colors.nodeHoverStroke;
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText(n.id.charAt(0), 0, 0);
        }

        ctx.restore();

        // 绘制名字标签
        // ctx.fillStyle = isHover ? '#fff' : '#ddd';
        // ctx.font = '13px sans-serif';
        // ctx.textAlign = 'center';
        // ctx.fillText(n.id, n.x, n.y + r + 15);
    });
}


        loop() {
            if(!this.isActive) return;
            this.step();
            this.draw();
            this.animationId = requestAnimationFrame(() => this.loop());
        }

 
 
show() {
    // --- 新增：同步主题颜色 ---
    if (window.GameAPI && window.GameAPI.getThemeVar) {
        this.colors.nodeStroke = window.GameAPI.getThemeVar('--primary-color') || '#005f66';
        this.colors.nodeHoverStroke = window.GameAPI.getThemeVar('--secondary-color') || '#00faff';
        this.colors.globalLink = `${window.GameAPI.getThemeVar('--secondary-color') || '#2979FF'}80`;
        this.colors.worldLink = `${window.GameAPI.getThemeVar('--primary-color') || '#00E676'}80`;
    }

    this.resize();
    const hasData = this.loadData();
    
    // 显示面板（无论是否有数据）
    this.panel.classList.add('active');
    this.isActive = true;
    
    if (hasData) {
        // 有数据则启动物理模拟动画
        this.loop();
    } else {
        // 没有数据：显示空界面提示
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawEmptyState();
    }
}

// 新增：绘制空界面的方法
drawEmptyState() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 绘制背景
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);
    
    // 绘制暗角效果
    const gradient = ctx.createRadialGradient(w/2, h/2, w/3, w/2, h/2, w);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    // 绘制提示信息
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 图标
    ctx.font = 'bold 60px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillText('⊙', w/2, h/2 - 60);
    
    // 标题
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('暂无关系数据', w/2, h/2 + 20);
    
    // 副文本
    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillText('请在"全局关系"或"世界关系"中添加角色关系', w/2, h/2 + 60);
    ctx.fillText('或勾选"显示"你"以查看与用户的关系', w/2, h/2 + 90);
    
    // 装饰线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w/2 - 150, h/2 + 120);
    ctx.lineTo(w/2 + 150, h/2 + 120);
    ctx.stroke();
}
reloadDataAndRestart() {
    cancelAnimationFrame(this.animationId);
    const hasData = this.loadData();
    if (hasData) {
        this.loop();
    } else {
        // 如果没有数据了，清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

        hide() {
            this.panel.classList.remove('active');
            this.isActive = false;
            cancelAnimationFrame(this.animationId);
        }
    }

    // --- 3. 核心逻辑类 ---
    class NovaNPCSystemV2 {
          KEY_MAP = {
        "info": "简介", "effect": "属性", "type": "种类",
        "quality": "质量", "num": "数量", "level": "等级", "status": "状态"
    };

    // 识别是否为物品列表的助手
    isInventory(obj) {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false;
        const values = Object.values(obj);
        if (values.length === 0) return false;
        const firstItem = values[0];
        if (typeof firstItem !== 'object' || firstItem === null) return false;
        const keys = Object.keys(firstItem);
        // 如果物品的属性中，有两个以上是我们定义的映射键，就认为是物品列表
        const knownKeys = Object.keys(this.KEY_MAP);
        let matchCount = 0;
        for (const key of keys) {
            if (knownKeys.includes(key)) matchCount++;
        }
        return matchCount >= 2; // 至少匹配两项才算，避免误判
    }
        constructor() {
            this.container = null;
            this.allItems = [];
            this.isOpen = false;

            this.init();
  
        }

 

        // ============ 构建 UI ============
   init() {
   if (window.imageDB) window.imageDB.init();
            // 1. 悬浮球
            this.floater = document.createElement('div');
            this.floater.className = 'mod01-floater';
            this.floater.innerHTML = '<i class="fas fa-brain"></i> NPC'; // 脑子图标

            // 2. 快速进入按钮 (新增)
            this.quickBtn = document.createElement('div');
            this.quickBtn.className = 'mod01-quick-btn';
            this.quickBtn.innerHTML = '<i class="fas fa-project-diagram"></i> 记忆回廊';

            document.body.appendChild(this.floater);
            document.body.appendChild(this.quickBtn);

            // 3. 事件绑定
            // Hover 逻辑：显示快速入口
            let hideTimer;
            const showBtn = () => {
                clearTimeout(hideTimer);
                this.quickBtn.classList.add('visible');
            };
            const hideBtn = () => {
                hideTimer = setTimeout(() => {
                    this.quickBtn.classList.remove('visible');
                }, 300); // 留一点时间给鼠标移动过去
            };

            this.floater.addEventListener('mouseenter', showBtn);
            this.floater.addEventListener('mouseleave', hideBtn);

            this.quickBtn.addEventListener('mouseenter', showBtn); // 移到按钮上也不消失
            this.quickBtn.addEventListener('mouseleave', hideBtn);

            // Click 逻辑
            this.floater.onclick = () => this.toggle(); // 点击球 -> 主界面
            this.quickBtn.onclick = () => {             // 点击按钮 -> 记忆回廊
                if(this.memoryGallery) this.memoryGallery.show();
            };
    // --- 3. 事件绑定 (修改部分：添加拖拽逻辑) ---
     // --- 3. 事件绑定 (修改版：同步移动快速入口) ---
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    this.floater.addEventListener('mousedown', (e) => {
        isDragging = false;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = this.floater.offsetLeft;
        initialTop = this.floater.offsetTop;

        const onMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                isDragging = true;
                const newLeft = initialLeft + dx;
                const newTop = initialTop + dy;

                // 移动悬浮球
                this.floater.style.left = `${newLeft}px`;
                this.floater.style.top = `${newTop}px`;
                this.floater.style.right = 'auto';

                // --- 新增：同步移动快速进入按钮 ---
                if (this.quickBtn) {
                    this.quickBtn.style.left = `${newLeft + 55}px`; // 保持在球右侧
                    this.quickBtn.style.top = `${newTop + 10}px`;
                }
            }
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
this.floater.addEventListener('touchstart', (e) => {
    isDragging = false;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    initialLeft = this.floater.offsetLeft;
    initialTop = this.floater.offsetTop;

    const onTouchMove = (moveEvent) => {
        const moveTouch = moveEvent.touches[0];
        const dx = moveTouch.clientX - startX;
        const dy = moveTouch.clientY - startY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            isDragging = true;
            moveEvent.preventDefault(); // 阻止页面滚动
            const newLeft = initialLeft + dx;
            const newTop = initialTop + dy;

            this.floater.style.left = `${newLeft}px`;
            this.floater.style.top = `${newTop}px`;
            this.floater.style.right = 'auto';

            if (this.quickBtn) {
                this.quickBtn.style.left = `${newLeft + 55}px`;
                this.quickBtn.style.top = `${newTop + 10}px`;
            }
        }
    };

    const onTouchEnd = () => {
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
}, { passive: false });
    // 修改点击判定
    this.floater.onclick = (e) => {
        if (isDragging) return;
        this.toggle();
    };
            // 4. 主界面 (保持原有结构)
            this.container = document.createElement('div');
            this.container.className = 'mod01-overlay';
            this.container.innerHTML = `
                <div class="mod01-window">
                    <div class="mod01-header">
                        <div class="mod01-title">角色档案</div>

                        <div style="display:flex; gap:15px;">
                        <div class="mod01-relation-toggle">[关系图谱]</div>
                             <div class="mod01-mem-toggle" style="cursor:pointer; opacity:0.7; font-size:12px;">[记忆回廊]</div>
                             <div class="mod01-close">[X]</div>
                        </div>
                    </div>
                    <div class="mod01-body">
                        <div class="mod01-sidebar" id="mod01-list-root"></div>
                        <div class="mod01-detail" id="mod01-detail-root"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(this.container);
 this.container.querySelector('.mod01-relation-toggle').onclick = () => {
    this.refreshData(); // ★ 新增：在打开图谱前刷新一次数据
    this.toggle(); // 关闭主窗口
    if(this.relationGraph) this.relationGraph.show(); // 打开图谱
};

            this.container.querySelector('.mod01-close').onclick = () => this.toggle();
            this.container.querySelector('.mod01-mem-toggle').onclick = () => {
                this.toggle();
                if(this.memoryGallery) this.memoryGallery.show();
            };
            this.container.onclick = (e) => {
                if(e.target === this.container) this.toggle();
            };

            // 5. 初始化记忆回廊
            this.memoryGallery = new NovaMemoryGallery(this);
             this.relationGraph = new NovaRelationGraph(this);
        }

        toggle() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
      
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
               const relationBtn = this.container.querySelector('.mod01-relation-toggle');
            const relationData = assaData?.global_lore?.settings?.角色关系 || assaData?.world_lore?.settings?.角色关系;

       relationBtn.style.display = 'block';

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
            pushData(safeGet('global_lore.npc'), '全局');
            pushData(safeGet('global_lore.小队信息'), '小队');
            pushData(safeGet('world_lore.npc'), '世界');

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

    // 设置 Tag 样式类 (保持原样)
    let tagClass = 'mod01-tag-badge';
    if(item.tag === '全局') tagClass += ' mod01-tag-global';
    else if(item.tag === '小队') tagClass += ' mod01-tag-team';
    else tagClass += ' mod01-tag-world';

    // --- 修改开始：判断关注状态 ---
    // 兼容 boolean true 和 string "true"
    const isFollow = item.data._follow === true || String(item.data._follow).toLowerCase() === 'true';
    const starClass = isFollow ? 'mod01-follow-btn active' : 'mod01-follow-btn';
    const starIcon = isFollow ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';

    el.innerHTML = `
        <div class="mod01-item-top">
            <span class="${tagClass}">${item.tag}</span>
            <span class="mod01-item-name">${item.name}</span>
            <div class="${starClass}" title="关注/取消关注">${starIcon}</div>
        </div>
    `;

    // 绑定点击卡片事件 (查看详情)
    el.onclick = (e) => {
        const allHelper = document.querySelectorAll('.mod01-item');
        allHelper.forEach(d => d.classList.remove('active'));
        el.classList.add('active');
        this.renderCard(item);
    };

    // --- 新增：绑定关注按钮点击事件 ---
    const btn = el.querySelector('.mod01-follow-btn');
    btn.onclick = async (e) => {
        e.stopPropagation(); // 防止触发卡片查看

        // 1. 计算新状态
        const newStatus = !isFollow;

        // 2. 乐观更新 UI (立刻变色，不等回调)
        if (newStatus) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-star"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-star"></i>';
        }
        // 更新本地缓存数据，防止点击详情后再切回来状态重置
        item.data._follow = newStatus;

        // 3. 构建路径
        // 根据 item.tag 还原路径 (参考 refreshData 中的逻辑)
        let pathPrefix = '';
        if (item.tag === '全局') pathPrefix = `global_lore.npc.${item.name}`;
        else if (item.tag === '小队') pathPrefix = `global_lore.小队信息.${item.name}`;
        else pathPrefix = `world_lore.npc.${item.name}`;

        const finalPath = `${pathPrefix}._follow`;

        // 4. 发送指令
        const commandString = `/setinput <updateMemory>\nmemory('${finalPath}','${newStatus}')\n</updateMemory>`;
        console.log(`[Nova] 切换关注状态: ${item.name} -> ${newStatus}`);

        if (window.GameAPI && window.GameAPI.triggerassa) {
            await window.GameAPI.triggerassa(commandString);
            if(window.worldHelper && window.worldHelper.processUpdateMemoryCommands) {
                await window.worldHelper.processUpdateMemoryCommands(commandString, -1);
            }
        }
    };
    // --- 修改结束 ---

    listRoot.appendChild(el);
});

        }

  

   renderStats(container, statsData) {
    // 递归收集所有可渲染的属性
    const collectStats = (obj, prefix = '') => {
        let result = [];
        
        if (typeof obj === 'string') {
            // 原有的字符串解析逻辑(向后兼容)
            let raw = obj.replace(/[【】\[\]]/g, '').trim();
            if (!raw) return result;
            const items = raw.split(/[;,]/).filter(s => s.trim());
            
            items.forEach(pair => {
                let [k, v] = pair.split(':');
                if (!k || !v) return;
                k = k.trim();
                const numVal = parseFloat(v.trim());
                
                result.push({
                    key: prefix ? `${prefix}.${k}` : k,
                    value: v.trim(),
                    numValue: isNaN(numVal) ? null : numVal,
                    isNumeric: !isNaN(numVal)
                });
            });
        } else if (typeof obj === 'object' && obj !== null) {
            // 新增:递归处理对象
            Object.entries(obj).forEach(([key, value]) => {
                if (key.startsWith('_')) return; // 过滤私有字段
                
                const fullKey = prefix ? `${prefix}.${key}` : key;
                
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    // 递归处理嵌套对象
                    result = result.concat(collectStats(value, fullKey));
                } else {
                    // 叶子节点
                    const numVal = parseFloat(value);
                    result.push({
                        key: fullKey,
                        value: String(value),
                        numValue: isNaN(numVal) ? null : numVal,
                        isNumeric: !isNaN(numVal)
                    });
                }
            });
        }
        
        return result;
    };
    
    const allStats = collectStats(statsData);
    
    if (allStats.length === 0) return;
    
    // 找出所有数值型属性的最大值,用于确定进度条上限
    const numericStats = allStats.filter(s => s.isNumeric);
    let maxVal = 0;
    numericStats.forEach(s => {
        if (s.numValue > maxVal) maxVal = s.numValue;
    });
    
    // 确定上限逻辑: 小于10 => 10, 大于10 => Max
    const limit = maxVal < 10 ? 10 : maxVal;
    
    const sec = document.createElement('div');
    sec.className = 'mod01-section';
    sec.innerHTML = `<div class="mod01-sec-title">COMBAT SPECS</div>`;
    
    allStats.forEach(stat => {
        const row = document.createElement('div');
        row.className = 'mod01-stat-row';
        
        if (stat.isNumeric) {
            // 数值型:显示进度条
            const percent = (stat.numValue / limit) * 100;
            row.innerHTML = `
                <div class="mod01-stat-name">${stat.key}</div>
                <div class="mod01-stat-bar-bg">
                    <div class="mod01-stat-fill" style="width:${percent}%"></div>
                </div>
                <div class="mod01-stat-val">${stat.numValue}</div>
            `;
        } else {
            // 文本型:直接显示
            row.innerHTML = `
                <div class="mod01-stat-name">${stat.key}</div>
                <div style="flex:1; margin: 0 10px; color: var(--text-secondary-color); font-size:13px;">
                    ${stat.value}
                </div>
            `;
        }
        
        sec.appendChild(row);
    });
    
    container.appendChild(sec);
}

  // --- 修改 1：性格 Mask 渲染 (修复私有字段显示的问题) ---
        renderPersona(container, outP, inP) {
            const sec = document.createElement('div');
            sec.className = 'mod01-section';
            sec.innerHTML = `<div class="mod01-sec-title">性格模型 (表 / 里)</div>`;

            const grid = document.createElement('div');
            grid.className = 'mod01-persona-grid';

            // Helper: 只有这里改动了，加入了过滤
            const buildCard = (dataObj, label, color) => {
                let html = `<div class="mod01-persona-label" style="background:${color}">${label}</div>`;

                Object.entries(dataObj).forEach(([k, v]) => {
                    if (k.startsWith('_')) return; // <--- 关键修改：过滤掉_开头的字段！

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
  this.loadCG(npc.name);
            // --- 妈妈帮你更新了忽略列表 ---
            const ignoreKeys = ['外貌', '好感度', '未定字段', '_is_protected', '_filter', '性别', '年龄', 'hp','game批注','nsfw'];


            // --- 0. 顶部区域：名字、外貌、好感度 (这部分保持不变) ---
            const headSection = document.createElement('div');
            headSection.className = 'mod01-card-head';
            const basicInfo = document.createElement('div');
            basicInfo.className = 'mod01-basic-info';
            basicInfo.style.flex = "1";
            basicInfo.innerHTML = `<h1>${npc.name}</h1>`;
     if(data.外貌) {
    if (typeof data.外貌 === 'string') {
        // 原有逻辑：直接显示字符串
        basicInfo.innerHTML += `<div class="mod01-desc-box">${data.外貌}</div>`;
    } else if (typeof data.外貌 === 'object' && data.外貌 !== null) {
        // 新增逻辑：对象形式的外貌，分类展示
        let appearanceHtml = '<div class="mod01-desc-box">';
        
        Object.entries(data.外貌).forEach(([key, value]) => {
            if(key.startsWith('_')) return; // 过滤私有字段
            
            // 为每个子项添加标签样式
            appearanceHtml += `
                <div style="margin-bottom: 6px;">
                    <span style="color: var(--secondary-color); font-weight: bold; font-size: 11px; text-transform: uppercase; margin-right: 6px;">${key}:</span>
                    <span style="opacity: 0.95;">${value}</span>
                </div>
            `;
        });
        
        appearanceHtml += '</div>';
        basicInfo.innerHTML += appearanceHtml;
    }
} else {
    basicInfo.innerHTML += `<div class="mod01-desc-box">...</div>`;
}
            let favorHtml = '';
            if(data.好感度 !== undefined) {
                let fVal = parseInt(data.好感度);
                if (isNaN(fVal)) fVal = '?';
                favorHtml = `<div class="mod01-favor-box"><div class="mod01-favor-val">${fVal}</div><div class="mod01-favor-label">Relation</div></div>`;
            }
            headSection.appendChild(basicInfo);
            if(favorHtml) {
                const fDiv = document.createElement('div'); fDiv.innerHTML = favorHtml;
                fDiv.style.flexShrink="0";
                headSection.appendChild(fDiv);
            }
            root.appendChild(headSection);

            // --- 顶部信息标签容器 ---
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'mod01-info-tags-container';
            root.appendChild(tagsContainer);

            // --- 已有标签渲染 (性别, 年龄, HP) ---
            if (data.性别) {
                tagsContainer.innerHTML += `<div class="mod01-info-tag"><strong>性别:</strong> ${data.性别}</div>`;
            }
            if (data.年龄) {
                tagsContainer.innerHTML += `<div class="mod01-info-tag"><strong>年龄:</strong> ${data.年龄}</div>`;
            }
            if (data.hp && typeof data.hp === 'string' && data.hp.includes('/')) {
                const [current, max] = data.hp.split('/').map(n => parseInt(n.trim()));
                if (!isNaN(current) && !isNaN(max) && max > 0) {
                    const percent = (current / max) * 100;
                    tagsContainer.innerHTML += `
                        <div class="mod01-info-tag">
                            <strong>HP:</strong> ${current}/${max}
                            <div class="mod01-hp-bar"><div class="mod01-hp-fill" style="width: ${percent}%"></div></div>
                        </div>
                    `;
                } else {
                     tagsContainer.innerHTML += `<div class="mod01-info-tag"><strong>HP:</strong> ${data.hp}</div>`;
                }
            }

            // --- ★ 妈妈的新魔法：自动渲染布尔值为 true 的标签 ---
            Object.entries(data).forEach(([key, value]) => {
                 if( key.startsWith('_')) return;
                // 如果值是 true (布尔值或字符串) 并且我们还没处理过它
                if ((value === true || String(value).toLowerCase() === 'true') && !ignoreKeys.includes(key)) {

                    // 创建一个漂亮的标签
                    tagsContainer.innerHTML += `<div class="mod01-info-tag boolean">${key}</div>`;
                    // 告诉后面的代码不要再重复渲染这个字段了
                    ignoreKeys.push(key);
                }
            });

   // --- 新增美化 1：声线 (Voice) ---
            if (data.声线) {
                const voiceBox = document.createElement('div');
                voiceBox.className = 'mod01-voice-container';
                // 生成随机高度的波形条
                let barsHtml = '';
                for(let i=0; i<8; i++) {
                    const h = 4 + Math.random() * 12;
                    const delay = Math.random() * 1;
                    barsHtml += `<div class="mod01-voice-bar" style="height:${h}px; animation-delay:${delay}s"></div>`;
                }
                voiceBox.innerHTML = `
                    <div class="mod01-voice-icon"><i class="fas fa-microphone-alt"></i></div>
                    <div class="mod01-voice-text">
                        <div style="font-size:10px; color:var(--secondary-color); margin-bottom:2px;">声线</div>
                        ${data.声线}
                    </div>
                    <div class="mod01-voice-wave">${barsHtml}</div>
                `;
                // 插入位置：放在标签容器之后，主内容之前
                tagsContainer.insertAdjacentElement('afterend', voiceBox);
                ignoreKeys.push('声线');
            }

            // --- 新增美化 2：意象 (Imagery) ---
            if (data.意象) {
                const imgBox = document.createElement('div');
                imgBox.className = 'mod01-imagery-box';
                imgBox.innerHTML = `<div class="mod01-imagery-label">ABSTRACT IMAGERY</div>`;

                // 支持中文或英文分号切割
                const images = String(data.意象).split(/[;；]/).filter(s => s.trim());
                images.forEach(img => {
                    const tag = document.createElement('span');
                    tag.className = 'mod01-imagery-tag';
                    tag.innerText = img.trim();
                    imgBox.appendChild(tag);
                });

                // 插入位置：放在声线之后（如果存在）或者标签之后
                const refNode = root.querySelector('.mod01-voice-container') || tagsContainer;
                refNode.insertAdjacentElement('afterend', imgBox);
                ignoreKeys.push('意象');
            }

            // --- 事件 (沉浸式插入，这部分逻辑不变) ---
            if(data.事件 && typeof data.事件 === 'object') {
                this.renderEvents(root, data.事件);
                ignoreKeys.push('事件');
            }

            if(data.离线事件 && typeof data.离线事件 === 'object') {
    this.renderOfflineEvents(root, data.离线事件);
    ignoreKeys.push('离线事件');
}

            // --- 新增美化 3：小习惯 (Habits) ---
            // 放在“事件”或“身份”之前，作为人物细节补充
            if (data.小习惯) {
                const sec = document.createElement('div');
                sec.className = 'mod01-section';
                sec.innerHTML = `<div class="mod01-sec-title">小习惯</div>`;

                const grid = document.createElement('div');
                grid.className = 'mod01-habit-grid';

                // 尝试智能分割：如果是分号分隔，或者换行分隔
                let habits = [];
                const rawHabit = String(data.小习惯);
                if (rawHabit.includes(';') || rawHabit.includes('；')) {
                    habits = rawHabit.split(/[;；]/);
                } else if (rawHabit.includes('\n')) {
                    habits = rawHabit.split('\n');
                } else {
                    // 如果是一整段话，尝试按句号分割，或者直接作为一条
                    habits = [rawHabit];
                }

                habits.forEach(h => {
                    if(!h.trim()) return;
                    grid.innerHTML += `
                        <div class="mod01-habit-card">
                            <div class="mod01-habit-icon"><i class="far fa-check-circle"></i></div>
                            <div class="mod01-habit-text">${h.trim()}</div>
                        </div>
                    `;
                });

                sec.appendChild(grid);
                // 插入到 root 的当前末尾 (通常在 Header/Tags/Voice/Imagery 之后)
                root.appendChild(sec);
                ignoreKeys.push('小习惯');
            }

              if (data.nsfw) {
                this.renderNsfw(root, data.nsfw, data.事件);
                ignoreKeys.push('nsfw'); // 确保不会被通用逻辑再次渲染
            }




            // --- 身份 (这部分逻辑不变) ---
            if(data.身份) {
                const sec = document.createElement('div');
                sec.className = 'mod01-section';
                sec.innerHTML = `<div class="mod01-sec-title">身份 IDENTITY</div><div class="mod01-text-block">${data.身份}</div>`;
                root.appendChild(sec);
                ignoreKeys.push('身份');
            }
            // --- 妈妈的改动：用正则表达式查找并渲染关系/印象 ---
            const relationRegex = /(和.+关系)$/;
            Object.keys(data).forEach(key => {
                if(relationRegex.test(key)) {
                    const relationBlock = document.createElement('div');
                    relationBlock.className = 'mod01-relation-block';
                    relationBlock.innerHTML = `
                        <span class="mod01-relation-title">${key}</span>
                        <span>${data[key]}</span>
                    `;
                    // 我们把它插在标签容器后面，主内容前面
                    // tagsContainer.insertAdjacentElement('afterend', relationBlock);
  root.appendChild(relationBlock);
                    ignoreKeys.push(key); // 处理完就加到忽略列表里
                }
            });
            // --- 属性 (这部分逻辑不变) ---
            if(data.属性) {
                this.renderStats(root, data.属性);
                ignoreKeys.push('属性');
            }

            // --- 表/里性格 (这部分逻辑不变) ---
            if(data.表性格 && data.里性格) {
                this.renderPersona(root, data.表性格, data.里性格);
                ignoreKeys.push('表性格', '里性格');
            }

            // --- 关键记忆 (分页) (这部分逻辑不变) ---
            if(data.关键记忆) {
               this.renderMemoriesPaged(root, data.关键记忆, npc.name, npc.tag);
                ignoreKeys.push('关键记忆');
            }

     

          Object.keys(data).forEach(k => {
                const value = data[k];
                // ★ 妈妈的重点修改：_ 开头的字段是最高优先级，直接跳过
                if (k.startsWith('_')) return;

                // 然后再检查其他忽略条件
                if(ignoreKeys.includes(k) || value === false || String(value).toLowerCase() === 'false') return;

                const sec = document.createElement('div');
                sec.className = 'mod01-section';

                if (this.isInventory(value)) {
                    this.renderInventoryPaged(sec, value, k);
                } else {
                    sec.innerHTML = `<div class="mod01-sec-title">${k}</div>`;
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'mod01-text-block';
                    this.renderDeepObject(contentDiv, value);
                    sec.appendChild(contentDiv);
                }

                root.appendChild(sec);
            });

                        // --- 新增美化 4：Game Meta 批注 ---
            // 这是一个特殊的 Meta 字段，我们把它放在显眼的位置，或者所有属性的最下方作为“开发者注脚”
            // 这里选择放在最下方，但在通用循环之前
            if (data.game批注) {
                const metaBox = document.createElement('div');
                metaBox.className = 'mod01-meta-alert';
                metaBox.innerHTML = `<div class="mod01-meta-content">${data.game批注}</div>`;
                root.appendChild(metaBox);
                ignoreKeys.push('game批注');
            }
        }

        // 在 NovaNPCSystemV2 类中，可以放在 renderCard 之后
        renderNsfw(container, nsfwData, eventData) {
            const isNsfwFiltered = window.novaNsfwFilterActive === true;
            const sec = document.createElement('div');
            sec.className = 'mod01-nsfw-section mod01-section';
            // 过滤模式下默认展开，否则默认折叠
            if (!isNsfwFiltered) {
                sec.classList.add('collapsed');
            }

            let bodyHtml = '';
            const renderedKeys = [];

            // 1. 渲染性器信息 (阴茎/小穴)
            const genitalKey = Object.keys(nsfwData).find(k => k.includes('阴茎信息') || k.includes('小穴信息'));
            if (genitalKey) {
                const icon = genitalKey.includes('阴茎') ? '🍆' : '🍑';
                let statusText = '';
                if (eventData && eventData.性器状态) {
                    statusText = `<span style="font-size: 12px; color: var(--primary-color); margin-left: 10px;">(${eventData.性器状态})</span>`;
                }
                bodyHtml += `
                    <div class="mod01-nsfw-subsection">
                        <div class="mod01-nsfw-subtitle"><i class="fas fa-venus-mars"></i>${icon} ${genitalKey} ${statusText}</div>
                        <p class="mod01-nsfw-text">${nsfwData[genitalKey]}</p>
                    </div>
                `;
                renderedKeys.push(genitalKey);
            }
            if (nsfwData.胸部信息) {
                bodyHtml += `
                    <div class="mod01-nsfw-subsection">
                        <div class="mod01-nsfw-subtitle"><i class="fas fa-book-dead"></i> 胸部信息</div>
                        <p class="mod01-nsfw-text">${nsfwData.胸部信息}</p>
                    </div>
                `;
                renderedKeys.push('胸部信息');
            }
            // 2. 渲染性癖
            if (nsfwData.性癖) {
                let kinkContent = '';
                if (typeof nsfwData.性癖 === 'string') {
                    kinkContent = `<p class="mod01-nsfw-text">${nsfwData.性癖}</p>`;
                } else if (typeof nsfwData.性癖 === 'object') {
                    kinkContent += '<div class="mod01-nsfw-kink-grid">';
                    Object.entries(nsfwData.性癖).forEach(([k, v]) => {
                        kinkContent += `
                            <div class="mod01-nsfw-kink-card">
                                <div class="mod01-nsfw-kink-title">${k}</div>
                                <div class="mod01-nsfw-text" style="font-size:13px;">${v}</div>
                            </div>
                        `;
                    });
                    kinkContent += '</div>';
                }
                bodyHtml += `
                    <div class="mod01-nsfw-subsection">
                        <div class="mod01-nsfw-subtitle"><i class="fas fa-heart"></i> 性癖</div>
                        ${kinkContent}
                    </div>
                `;
                renderedKeys.push('性癖');
            }

            // 3. 渲染性经验
            if (nsfwData.性经验) {
                bodyHtml += `
                    <div class="mod01-nsfw-subsection">
                        <div class="mod01-nsfw-subtitle"><i class="fas fa-book-dead"></i> 性经验</div>
                        <p class="mod01-nsfw-text">${nsfwData.性经验}</p>
                    </div>
                `;
                renderedKeys.push('性经验');
            }

            // 4. 渲染性渴望度
            if (nsfwData.性渴望度) {
                let desireContent = '';
                if (typeof nsfwData.性渴望度 === 'string') {
                    desireContent = `<p class="mod01-nsfw-text">${nsfwData.性渴望度}</p>`;
                } else if (typeof nsfwData.性渴望度 === 'object') {
                    if (nsfwData.性渴望度.总体) {
                        desireContent += `<p class="mod01-nsfw-text" style="margin-bottom:15px;">${nsfwData.性渴望度.总体}</p>`;
                    }
                    if (nsfwData.性渴望度.部位 && typeof nsfwData.性渴望度.部位 === 'object') {
                        desireContent += '<div class="mod01-nsfw-desire-grid">';
                        Object.entries(nsfwData.性渴望度.部位).forEach(([k, v]) => {
                            desireContent += `<div class="mod01-nsfw-desire-chip"><strong>${k}:</strong> <em>“${v}”</em></div>`;
                        });
                        desireContent += '</div>';
                    }
                }
                bodyHtml += `
                    <div class="mod01-nsfw-subsection">
                        <div class="mod01-nsfw-subtitle"><i class="fas fa-fire-alt"></i> 性渴望度</div>
                        ${desireContent}
                    </div>
                `;
                renderedKeys.push('性渴望度');
            }

            // 5. 动态渲染所有数值类型的字段 (如内射次数)
            const counterItems = [];
            Object.entries(nsfwData).forEach(([key, value]) => {
                if (typeof value === 'number' && !renderedKeys.includes(key)) {
                    counterItems.push({ key, value });
                    renderedKeys.push(key);
                }
            });
            if (counterItems.length > 0) {
                let countersHtml = '<div class="mod01-nsfw-counter-grid">';
                counterItems.forEach(item => {
                    countersHtml += `
                        <div class="mod01-nsfw-counter">
                            <div class="mod01-nsfw-counter-value">${item.value}</div>
                            <div class="mod01-nsfw-counter-label">${item.key}</div>
                        </div>
                    `;
                });
                countersHtml += '</div>';
                bodyHtml += `
                    <div class="mod01-nsfw-subsection">
                        <div class="mod01-nsfw-subtitle"><i class="fas fa-sort-numeric-up-alt"></i> 数据统计</div>
                        ${countersHtml}
                    </div>
                `;
            }

            // 6. 默认递归渲染其他未知字段
            Object.keys(nsfwData).forEach(key => {
                if (!renderedKeys.includes(key) && !key.startsWith('_')) {
                    const val = nsfwData[key];
                    bodyHtml += `<div class="mod01-nsfw-subsection">`;
                    bodyHtml += `<div class="mod01-nsfw-subtitle"><i class="fas fa-question-circle"></i> ${key}</div>`;
                    const contentDiv = document.createElement('div');
                    this.renderDeepObject(contentDiv, val);
                    bodyHtml += contentDiv.outerHTML;
                    bodyHtml += `</div>`;
                }
            });

            // 组装最终HTML
            sec.innerHTML = `
                <div class="mod01-nsfw-header">
                    <i class="fas fa-exclamation-triangle" style="color:#E91E63;"></i>
                    <span class="mod01-nsfw-title">❤ NSFW ❤</span>
                    <i class="fas fa-chevron-down mod01-nsfw-arrow"></i>
                </div>
                <div class="mod01-nsfw-body">${bodyHtml}</div>
            `;

            // 绑定折叠事件
            sec.querySelector('.mod01-nsfw-header').onclick = () => {
                sec.classList.toggle('collapsed');
            };

            container.appendChild(sec);
        }

        renderOfflineEvents(container, offlineData) {
            const box = document.createElement('div');
            box.className = 'mod01-timeline-box mod01-section';

            // 1. 顶部元数据 (作为 Header，点击可折叠)
            const status = offlineData.状态 || '未知';
            const nextUpdate = offlineData.下次更新时间 || '未定';
            const intro = offlineData.简介 || '';

            // Header HTML
            const headerHtml = `
                <div class="mod01-timeline-header">
                    <div class="mod01-offline-meta" style="border-bottom:none; margin-bottom:0; padding-bottom:0; flex:1;">
                        <span><i class="fas fa-satellite-dish"></i> 离线进程</span>
                        <span style="color:var(--primary-color); margin-left:10px;">[${status}]</span>
                    </div>
                    <i class="fas fa-chevron-down mod01-timeline-arrow"></i>
                </div>
            `;

            // Body HTML (包含简介、进展、底部)
            let bodyContentHtml = '';

            if(intro) {
                bodyContentHtml += `<div style="font-style:italic; opacity:0.8; margin:10px 0 15px 0; font-size:12px;">“${intro}”</div>`;
            }

            // 进展链条渲染
            let nodesHtml = '';
            if (offlineData.进展 && typeof offlineData.进展 === 'object') {
                const entries = Object.entries(offlineData.进展);
                entries.forEach(([time, content]) => {
                    const formattedContent = String(content).replace(/->/g, ' <span style="color:var(--primary-color); font-weight:bold;">→</span> ');
                    nodesHtml += `
                        <div class="mod01-timeline-node">
                            <div class="mod01-node-marker"></div>
                            <div class="mod01-node-content">
                                <div class="mod01-node-time">${time}</div>
                                <div class="mod01-node-text">${formattedContent}</div>
                            </div>
                        </div>
                    `;
                });
            } else {
                nodesHtml = '<div style="opacity:0.5; font-size:12px; padding-left:20px; margin-top:10px;">暂无进展记录</div>';
            }
            bodyContentHtml += nodesHtml;

            // 底部：下次更新预告
            if(nextUpdate) {
                bodyContentHtml += `
                    <div style="margin-top:15px; padding-top:10px; border-top:1px dashed var(--border-color); font-size:11px; text-align:right; opacity:0.7;">
                        <i class="far fa-clock"></i> 下次更新: ${nextUpdate}
                    </div>
                `;
            }

            // 组装 HTML
            box.innerHTML = `
                ${headerHtml}
                <div class="mod01-timeline-body">
                    ${bodyContentHtml}
                </div>
            `;

            // 绑定点击事件实现折叠
            const headerEl = box.querySelector('.mod01-timeline-header');
            headerEl.onclick = () => {
                box.classList.toggle('collapsed');
            };

            container.appendChild(box);
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
  if(evtData.想法) {
                const p = document.createElement('div');
                p.className = 'mod01-event-thought';
                p.textContent = evtData.想法;
                box.appendChild(p);
            }
            // 2. 核心：当前状态 (Tag样式)
            if(evtData.当前状态) {
               const st = document.createElement('div');
               st.innerHTML = `<span style="font-size:12px; margin-right:5px; opacity:0.7;">STATUS:</span> <span class="mod01-event-status">${evtData.当前状态}</span>`;
               st.style.marginBottom = '10px';
               box.appendChild(st);
            }
         if(evtData.人物状态) {
               const st = document.createElement('div');
               st.innerHTML = `<span style="font-size:12px; margin-right:5px; opacity:0.7;">STATUS:</span> <span class="mod01-event-status">${evtData.人物状态}</span>`;
               st.style.marginBottom = '10px';
               box.appendChild(st);
            }
                     if(evtData.buff) {
               const st = document.createElement('div');
               st.innerHTML = `<span class="mod01-event-status">${evtData.buff}</span>`;
               st.style.marginBottom = '10px';
               box.appendChild(st);
            }
            // 3. 其他字段 (行为链、目标等)
            const ignores = ['当前想法', '当前状态',"想法","人物状态","buff"];
            Object.keys(evtData).forEach(k => {
                if(ignores.includes(k) || k.startsWith('_')) return;
                const row = document.createElement('div');
                row.className = 'mod01-event-detail-row';
                row.innerHTML = `<strong>${k}</strong>: ${evtData[k]}`;
                box.appendChild(row);
            });

            container.appendChild(box);
        }

 renderInventoryPaged(container, invData, title) {
    container.innerHTML = `<div class="mod01-sec-title">${title}</div>`;

    // 过滤掉 _ 开头的私有数据
    const itemsArray = Object.entries(invData)
        .filter(([key, val]) => !key.startsWith('_') && typeof val === 'object')
        .map(([name, data]) => ({ name, data }));

    if (itemsArray.length === 0) {
        container.innerHTML += '<div style="opacity:0.5;font-size:12px;">此区域暂无物品</div>';
        return;
    }

    const pageSize = 1;
    let currentPage = 1;
    const totalPages = Math.ceil(itemsArray.length / pageSize);

    const grid = document.createElement('div');
    grid.className = 'mod01-inventory-grid';

    const controlBar = document.createElement('div');
    controlBar.className = 'mod01-pagination';

    const renderPage = () => {
        grid.innerHTML = '';
        const startIndex = (currentPage - 1) * pageSize;
        const slice = itemsArray.slice(startIndex, startIndex + pageSize);

        slice.forEach(item => {
            const card = document.createElement('div');
            card.className = 'mod01-item-card';

            let detailsHtml = '';
            // ★ 新增：将 icon 和 comment 加入特殊键位，不参与常规行列渲染
            const specialKeys = ['quality', 'type', 'num', 'icon', 'comment'];

            Object.entries(item.data).forEach(([key, value]) => {
                if (key.startsWith('_') || specialKeys.includes(key)) return;
                const label = this.KEY_MAP[key] || key;
                detailsHtml += `
                    <div class="mod01-item-detail-row">
                        <span class="mod01-item-detail-label">${label}:</span>
                        <span class="mod01-item-detail-value">${value}</span>
                    </div>
                `;
            });

            // ★ 核心修改：组装增强版 HTML 结构
            card.innerHTML = `
                <div class="mod01-item-card-main">
                    ${item.data.icon ? `<div class="mod01-item-icon">${item.data.icon}</div>` : ''}
                    <div class="mod01-item-content">
                        <div class="mod01-item-card-header">
                            <span class="mod01-item-card-title">${item.name}</span>
                            ${item.data.type ? `<span class="mod01-item-card-type-tag">${item.data.type}</span>` : ''}
                            ${item.data.quality ? `<span class="mod01-item-card-quality" data-q="${item.data.quality}">${item.data.quality}</span>` : ''}
                        </div>
                        <div class="mod01-item-card-details">${detailsHtml}</div>
                    </div>
                </div>
                ${item.data.comment ? `<div class="mod01-item-comment">“ ${item.data.comment} ”</div>` : ''}
                ${item.data.num ? `<div class="mod01-item-card-count">x${item.data.num}</div>` : ''}
            `;
            grid.appendChild(card);
        });
    };

    // 分页控制器逻辑 (保持不变)
    if (totalPages > 1) {
        const createBtn = (text, onClick) => {
            const btn = document.createElement('div');
            btn.className = 'mod01-page-btn';
            btn.innerText = text;
            btn.onclick = onClick;
            return btn;
        };
        const btnFirst = createBtn('<<', () => changePage(1));
        const btnPrev  = createBtn('<',  () => changePage(currentPage - 1));
        const pageInfo = document.createElement('div');
        pageInfo.className = 'mod01-page-info';
        const btnNext  = createBtn('>',  () => changePage(currentPage + 1));
        const btnLast  = createBtn('>>', () => changePage(totalPages));

        const updateControls = () => {
            pageInfo.innerText = `${currentPage} / ${totalPages}`;
            const setDis = (btn, cond) => cond ? btn.classList.add('disabled') : btn.classList.remove('disabled');
            setDis(btnFirst, currentPage <= 1); setDis(btnPrev, currentPage <= 1);
            setDis(btnNext, currentPage >= totalPages); setDis(btnLast, currentPage >= totalPages);
        };

        const changePage = (target) => {
            if (target < 1 || target > totalPages) return;
            currentPage = target;
            renderPage();
            updateControls();
        };

        controlBar.appendChild(btnFirst); controlBar.appendChild(btnPrev); controlBar.appendChild(pageInfo);
        controlBar.appendChild(btnNext); controlBar.appendChild(btnLast);
        container.appendChild(controlBar);
        updateControls();
    }

    container.appendChild(grid);
    renderPage();
}
 
       // --- 修改：接收 npcName 和 npcTag 参数 ---
        renderMemoriesPaged(container, memObj, npcName, npcTag) {
            const sec = document.createElement('div');
            sec.className = 'mod01-section';
            sec.innerHTML = `<div class="mod01-sec-title">MEMORY LOGS</div>`;

            // 1. 数据展平与过滤
            let memArray = [];
            Object.keys(memObj).forEach(k => {
                if(k.startsWith('_')) return;
                memArray.push({ id: k, text: String(memObj[k]) });
            });
            // 排序 (数字序优先)
            memArray.sort((a,b) => (parseInt(a.id)||0) - (parseInt(b.id)||0));

            // 分页核心变量
            const pageSize = 5;
            let currentPage = 1;
            const totalPages = Math.ceil(memArray.length / pageSize);

            // 容器
            const cloud = document.createElement('div');
            cloud.className = 'mod01-mem-cloud';
            cloud.style.minHeight = "120px";

            // 控制器容器
            const controlBar = document.createElement('div');
            controlBar.className = 'mod01-pagination';

            // --- 按钮逻辑 ---
            const createBtn = (text, onClick) => {
                const btn = document.createElement('div');
                btn.className = 'mod01-page-btn';
                btn.innerText = text;
                btn.onclick = onClick;
                return btn;
            };

            const btnFirst = createBtn('<<', () => changePage(1));
            const btnPrev  = createBtn('<',  () => changePage(currentPage - 1));
            const pageInfo = document.createElement('div');
            pageInfo.className = 'mod01-page-info';
            const btnNext  = createBtn('>',  () => changePage(currentPage + 1));
            const btnLast  = createBtn('>>', () => changePage(totalPages));

            // 更新状态
            const updateControls = () => {
                pageInfo.innerText = `${currentPage} / ${totalPages || 1}`;

                // 通用禁用逻辑 helper
                const setDis = (btn, condition) => {
                    if(condition) btn.classList.add('disabled');
                    else btn.classList.remove('disabled');
                };

                setDis(btnFirst, currentPage <= 1);
                setDis(btnPrev,  currentPage <= 1);
                setDis(btnNext,  currentPage >= totalPages);
                setDis(btnLast,  currentPage >= totalPages);
            };

            // 翻页 Action
            const changePage = (targetPage) => {
                if(targetPage < 1 || targetPage > totalPages) return;
                currentPage = targetPage;
                renderPage();
                updateControls();
            };

            // --- 重点修改：renderPage 内部 ---
            const renderPage = () => {
                cloud.innerHTML = '';
                if (memArray.length === 0) {
                    cloud.innerHTML = '<div style="opacity:0.5;font-size:12px;">此区域暂无记录</div>';
                    return;
                }
                const startIndex = (currentPage - 1) * pageSize;
                const endIndex = Math.min(startIndex + pageSize, memArray.length);
                const slice = memArray.slice(startIndex, endIndex);

                slice.forEach(item => {
                    const chip = document.createElement('div');
                    chip.className = 'mod01-mem-chip';

                    let content = item.text;
                    let tagsHtml = '';
                    const match = content.match(/\[(.*?)\]/);
                    if(match) {
                        content = content.replace(match[0], '');
                        const rawTags = match[1];
                        const parts = rawTags.split(/[ \/、]/);
                        parts.forEach(t => {
                            if(t.trim()) tagsHtml += `<span class="mod01-emote-tag">${t.trim()}</span>`;
                        });
                    }

                    // 1. 构建基础内容
                    chip.innerHTML = `<span style="opacity:0.5;font-size:10px;margin-right:4px;">#${item.id}</span> ${content} ${tagsHtml}`;

                    // 2. 创建删除按钮 (X)
                    const delBtn = document.createElement('span');
                    delBtn.className = 'mod01-mem-delete';
                    delBtn.innerText = '✕'; // 或者用 fontawesome: <i class="fas fa-times"></i>
                    delBtn.title = "删除此记忆";

                    // 3. 删除逻辑
                    delBtn.onclick = async (e) => {
                        e.stopPropagation(); // 防止触发其他点击事件

                        // UI 上立刻移除
                        chip.style.opacity = '0';
                        setTimeout(() => chip.remove(), 200);

                        // 构建路径
                        let pathPrefix = '';
                        if (npcTag === '全局') pathPrefix = `global_lore.npc.${npcName}`;
                        else if (npcTag === '小队') pathPrefix = `global_lore.小队信息.${npcName}`;
                        else pathPrefix = `world_lore.npc.${npcName}`;

                        const fullPath = `${pathPrefix}.关键记忆`;

                        // 构建指令
                        const commandString = `/setinput <updateMemory>\ndelete('${fullPath}','${item.id}')\n</updateMemory>`;

                        console.log(`[Nova] 删除记忆: ${fullPath}`);

                        // 执行指令
                        if (window.GameAPI && window.GameAPI.triggerassa) {
                            await triggerassa(commandString);
                            if(window.worldHelper && window.worldHelper.processUpdateMemoryCommands) {
                                await window.worldHelper.processUpdateMemoryCommands(commandString, -1);
                            }
                        }
                    };

                    chip.appendChild(delBtn);

                    // 动画
                    chip.animate([{opacity:0, paddingLeft:'10px'}, {opacity:1, paddingLeft:'12px'}], {duration: 250});
                    cloud.appendChild(chip);
                });
            };

            // ... (后续组装代码保持不变) ...
            if (totalPages > 1) {
                controlBar.appendChild(btnFirst);
                controlBar.appendChild(btnPrev);
                controlBar.appendChild(pageInfo);
                controlBar.appendChild(btnNext);
                controlBar.appendChild(btnLast);
                sec.appendChild(controlBar);
            }
            sec.appendChild(cloud);
            container.appendChild(sec);

            if(memArray.length > 0) {
                renderPage();
                updateControls();
            } else {
                cloud.innerHTML = '<div style="opacity:0.5;font-size:12px;">暂无关键记忆</div>';
            }
        }

        // --- 修改 4：通用递归渲染 (增加清晰的结构视图) ---
 // --- 修改 4：通用递归渲染 (增加清晰的结构视图) ---
renderDeepObject(container, val) {
    if (val === null || val === undefined) return;

    if (typeof val === 'object') {
        const wrapper = document.createElement('div');
        // 这里加个类名用于CSS控制缩进
        wrapper.className = 'mod01-nested-block';

        let hasContent = false;
        Object.keys(val).forEach(key => {
            if(key.startsWith('_')) return;
            hasContent = true;

            const row = document.createElement('div');
            // 增加一点行间距，看每一行更清楚
            row.style.marginBottom = '6px';
            row.style.position = 'relative';

            // --- 妈妈的汉化魔法在这里 ---
            // 键名，优先从 KEY_MAP 中查找汉化
            const displayKey = this.KEY_MAP[key] || key;
            let keyHtml = `<span style="color:var(--secondary-color); font-weight:bold; margin-right:5px;">${displayKey}:</span>`;
            if(isNaN(key)) row.innerHTML = keyHtml;

            // 值容器
            const valSpan = document.createElement('span');

            // 如果值依然是对象，就不在这里显示内容，而是让它在新的一行渲染
            if (typeof val[key] === 'object' && val[key] !== null) {
                // 递归调用，wrapper将再次产生缩进
                this.renderDeepObject(valSpan, val[key]);
                // 对象的话，我们让它另起一行
                valSpan.style.display = "block";
                // 一个小小的连接符或提示（可选）
                if(isNaN(key)) {
                    // 只有当有Key显示的时候，才需要换行；如果是纯数组索引，直接渲染
                }
            } else {
                // 简单值
                this.renderDeepObject(valSpan, val[key]);
            }

            row.appendChild(valSpan);
            wrapper.appendChild(row);
        });

        if(!hasContent) container.innerHTML += '<span style="opacity:0.5;font-size:12px;"> [空]</span>';
        else container.appendChild(wrapper);

    } else {
        // 简单值直接渲染
        container.innerText = String(val);
    }
}

  async loadCG(displayName) {
            console.log(`[Nova][CG-LOG] 尝试为 '${displayName}' 加载立绘...`);

            // 1. 查找或创建立绘容器
            const bodyEl = this.container.querySelector('.mod01-body');
            let cgContainer = bodyEl.querySelector('.mod01-cg-container');
            if (!cgContainer) {
                cgContainer = document.createElement('div');
                cgContainer.className = 'mod01-cg-container';
                cgContainer.innerHTML = '<img class="mod01-cg-image" src="" />';
                bodyEl.appendChild(cgContainer);
            }
            const cgImg = cgContainer.querySelector('.mod01-cg-image');
            cgContainer.style.opacity = '0'; // 切换时先隐藏

            try {
                // 2. 基础数据源检查 (兼容 assaData 和 assaSettingsData)
                const assaData = (window.GameAPI && window.GameAPI.assaData) || window.assaSettingsData;
                if (!assaData || !assaData.img_map) {
                    console.log('[Nova][CG-LOG] 状态：数据源(assaData/img_map) 尚未准备好。');
                    return;
                }

                const imageName = assaData.img_map[displayName];
                if (!imageName) {
                    console.log(`[Nova][CG-LOG] 状态：在映射表中未找到角色 '${displayName}'`);
                    return;
                }
                const imageNameStr = String(imageName);
                let imageBlob = null;

                // 3. 尝试从本地库获取 (CustomNpcs)
                if (window.imageDB) {
                    try {
                        imageBlob = await window.imageDB.get('CustomNpcs', imageNameStr);
                        if (imageBlob) console.log(`[Nova][CG-LOG] ✨ 本地库命中: ${imageNameStr}`);
                    } catch (e) { console.warn('[Nova][CG-LOG] 本地库读取异常', e); }
                }

                // 4. 如果本地没有，尝试从远程获取
                if (!imageBlob) {
                    const remoteMap = window.GameAPI.npcImageMap;
                    if (!remoteMap) {
                        console.error('[Nova][CG-LOG] 错误：npcImageMap 未定义，无法检索远程资源');
                    } else {
                        const imageUrl = remoteMap[imageNameStr];
                        if (imageUrl) {
                            console.log(`[Nova][CG-LOG] 发现远程URL: ${imageUrl}`);
                            // 4.1 查远程缓存
                            if (window.imageDB) {
                                try {
                                    imageBlob = await window.imageDB.get('RemoteCache', imageUrl);
                                } catch (e) { console.warn('[Nova][CG-LOG] 远程缓存读取失败'); }
                            }

                            // 4.2 执行下载
                            if (!imageBlob) {
                                console.log(`[Nova][CG-LOG] 缓存未命中，开始下载...`);
                                const res = await fetch(imageUrl);
                                if (res.ok) {
                                    const originalBlob = await res.blob();
                                    imageBlob = new Blob([originalBlob], { type: 'image/png' });
                                    if (window.imageDB) {
                                        await window.imageDB.set('RemoteCache', imageUrl, imageBlob);
                                        console.log(`[Nova][CG-LOG] 下载成功并存入缓存`);
                                    }
                                } else {
                                    console.error(`[Nova][CG-LOG] 下载失败: ${res.status}`);
                                }
                            }
                        } else {
                            console.log(`[Nova][CG-LOG] 远程映射表中无此Key: ${imageNameStr}`);
                        }
                    }
                }

                // 5. 图片处理与显示
                if (imageBlob) {
                    const reader = new FileReader();
                    reader.readAsDataURL(imageBlob);
                    reader.onloadend = async () => {
                        const stableImageUrl = reader.result;
                        try {
                            // 这里的参数参考了你提供的 getPixelationSettings 逻辑
                            // 如果没有动态设置函数，则默认不像素化，高度取窗口 85%
                            const targetH = window.innerHeight * 0.85;
                            if (window.createPixelatedCharaImage) {
                                const processedUrl = await window.createPixelatedCharaImage(stableImageUrl, targetH, 1, false);
                                cgImg.src = processedUrl;
                            } else {
                                cgImg.src = stableImageUrl;
                            }

                            cgImg.onload = () => {
                                cgContainer.style.opacity = '1';
                                console.log(`[Nova][CG-LOG] ✅ 立绘渲染成功: ${displayName}`);
                            };
                        } catch (pixelError) {
                            console.error(`[Nova][CG-LOG] 像素化处理失败:`, pixelError);
                            cgImg.src = stableImageUrl;
                            cgContainer.style.opacity = '1';
                        }
                    };
                } else {
                    console.error(`[Nova][CG-LOG] 流程结束，未能获取到任何图片数据。`);
                }

            } catch (error) {
                console.error(`[Nova][CG-LOG] 加载立绘时发生未捕获异常:`, error);
            }
        }
    }

    // 启动系统
    window.novaNpcSystemv2 = new NovaNPCSystemV2();
 //美化


  
(function() {
    // ============================================================
    // 1. 样式定义 (CSS) - Mod14
    // ============================================================
    const styleId = 'mod14-galgame-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* --- 基础设置 --- */
            #chat-display-area {
                overflow: hidden !important;
                position: relative;
            }
 #load-more-btn {
    display: none !important;
}
            #options-module-container { display: none !important; }

            /* --- 舞台容器 --- */
            .mod14-stage-wrapper {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                z-index: 100;
                pointer-events: none;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                padding-bottom: 10px;
                font-family: var(--base-font-family, "Microsoft YaHei", sans-serif);
                font-size: var(--base-font-size, 16px);
                line-height: var(--base-line-height, 1.5);
                overflow: hidden;
            }

            /* --- 立绘层 --- */
            .mod14-cg-layer {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                z-index: 5; /* 在背景之上，对话框之下 */
                display: flex;
                justify-content: center;
                align-items: flex-end;
                pointer-events: auto; /* 允许点击立绘 */
            }

            .mod14-cg-image {
                max-height: 90%;
                max-width: 90%;
                object-fit: contain;
                transition: opacity 0.4s ease-in-out, transform 0.4s ease;
                /* 去除白底的核心魔法 */
         
                opacity: 0;
            }

             .mod14-options-layer {
                position: absolute;
                bottom: 36%; /* 位于对话框上方 */
                left: 0;
                width: 100%;
                max-height: 50%;
                z-index: 20;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                padding: 20px;
                overflow-y: auto;

                /* ---  --- */
                /* 默认隐藏，但允许动画播放 */
                opacity: 0;
                pointer-events: none; /* 隐藏时不可交互 */

                /* 隐藏滚动条但允许滚动 */
                scrollbar-width: none;
            }
            /* --- 用于控制显示/隐藏和动画的类 --- */
            .mod14-options-layer.show {
                opacity: 1;
                pointer-events: auto; /* 显示时可交互 */
                animation: mod14-slide-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .mod14-options-layer.hide {
                opacity: 0;
                pointer-events: none;
                animation: mod14-slide-down-fade-out 0.3s ease-out forwards;
            }

            .mod14-options-layer::-webkit-scrollbar { display: none; }

            /* --- 选项卡片样式 (移植自你的代码) --- */
            .mod14-choice-card {
                background: var(--container-bg-color, rgba(10, 25, 47, 0.9));
                border: 1px solid var(--border-color, #00faff);
                color: var(--text-color, #e6f1ff);
                padding: 10px 15px;
                width: 90%;
                max-width: 600px;
                border-radius: 8px;
                cursor: pointer;
                backdrop-filter: blur(5px);
                transition: all 0.2s ease;
                position: relative;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                flex-shrink: 0; /* 防止被压缩 */
            }
            .mod14-choice-card.focused, .mod14-choice-card:active {
                background: var(--primary-color, #00faff);
                color: #000;
                transform: scale(1.02);
                box-shadow: 0 0 15px var(--glow-color, rgba(0, 250, 255, 0.5));
            }
            .mod14-choice-card .tags-container {
                display: flex; gap: 5px; margin-bottom: 5px; flex-wrap: wrap;
            }
            .mod14-choice-card .tag {
             
                padding: 2px 6px; border-radius: 4px; font-size: 0.8em;
               
            }
            .mod14-choice-card .description { margin: 0; font-size: 1em; }

            /* --- 对话框容器 --- */
            .mod14-dialogue-box {
                position: relative;
                z-index: 10;
                width: 96%;
                margin: 0 auto;
                min-height: 180px;
                max-height: 35%;
                background: var(--container-bg-color, rgba(10, 25, 47, 0.85));
                border: 1px solid var(--border-color, rgba(0, 250, 255, 0.3));
                box-shadow: 0 -5px 20px rgba(0,0,0,0.5);
                border-radius: 8px;
                padding: 25px 25px 20px 25px;
                pointer-events: auto;
                display: flex;
                flex-direction: column;
                backdrop-filter: blur(10px);
            }

            /* 名字标签 */
            .mod14-name-tag {
                position: absolute;
                top: -16px; left: 20px;
                background: var(--primary-color, #00faff);
                color: #000;
                padding: 2px 15px;
                font-weight: bold;
                font-size: 1.1em;
                border-radius: 4px;
                transform: skewX(-15deg);
                display: none;
                box-shadow: 0 2px 5px rgba(0,0,0,0.5);
            }
            .mod14-name-text { display: block; transform: skewX(15deg); }

            /* 文本内容 */
            .mod14-text-content {
                color: var(--text-color, #e6f1ff);
                white-space: pre-wrap;
                flex-grow: 1;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
                overflow-y: auto;
            }

            .mod14-text-content i, .mod14-text-content em {
    color: var(--text-secondary-color);
    font-style: italic;
    position: relative;
}

            /* --- 功能按钮区 --- */

            /* 附件闪烁图标 (左上角) */
            .mod14-attachment-icon {
                position: absolute;
                top: -20px;
                right: 20px; /* 放在右上角或者左上角 */
                width: 40px; height: 40px;
                background: var(--secondary-color, #7affff);
                border: 2px solid #fff;
                border-radius: 50%;
                display: flex; justify-content: center; align-items: center;
                cursor: pointer;
                box-shadow: 0 0 10px var(--glow-color);
                animation: mod14-pulse 1.5s infinite;
                z-index: 15;
                display: none; /* 默认隐藏 */
                font-size: 20px;
            }
            @keyframes mod14-pulse {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 250, 255, 0.7); }
                70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(0, 250, 255, 0); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 250, 255, 0); }
            }

 .mod14-back-btn {
    position: absolute;
    bottom: 0; left: 0;
    width: 33%; /* 占据左下角三分之一 */
    height: 33%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    padding: 15px 20px;
    cursor: pointer;
    opacity: 0.5;
    transition: all 0.2s;
    z-index: 20;
}
.mod14-back-btn::after {
    content: '';
    width: 0; height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 12px solid var(--text-secondary-color, #a8c0e1);
    animation: mod14-bounce-reverse 1s infinite;
}
.mod14-back-btn:hover::after {
    border-bottom-color: var(--primary-color, #00faff);
}
     
            @keyframes mod14-bounce-reverse {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
     

            /* 下一步指示器 (右下角) */
            .mod14-next-indicator {
                position: absolute;
                bottom: 10px; right: 15px;
                width: 0; height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 12px solid var(--primary-color, #00faff);
                animation: mod14-bounce 1s infinite;
                opacity: 0;
            }
            .mod14-next-indicator.active { opacity: 1; }
            @keyframes mod14-bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(5px); }
            }
@keyframes mod14-fade-out {
    0% { opacity: 1; }
    100% { opacity: 0; }
}

.mod14-attachment-modal.closing {
    animation: mod14-fade-out 0.3s ease-out forwards;
    pointer-events: none; /* 退场时禁止再次点击 */
}
            /* --- 全屏附件模态框 --- */
            .mod14-attachment-modal {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                
                z-index: 2000;
                display: none;
                justify-content: center;
                align-items: center;
                padding: 20px;
                backdrop-filter: blur(5px);
                 background: rgba(0, 0, 0, 0.6);
                       animation: mod14-fade-in 0.3s ease-out forwards;
            }
                .mod14-modal-content {
                width: 95%; height: 90%;

                /* 内容容器背景透明 */
                background: transparent;
                box-shadow: none; /* 去除阴影以适应透明背景 */

                border-radius: 8px;
                overflow: hidden;
                position: relative;
            }
    
            /* 隐藏右上角的 X 关闭按钮 */
            .mod14-modal-close {
                display: none !important;
            }

            .mod14-dummy-bubble { display: none; }

                  /* --- 控制面板 --- */
      .mod14-control-panel {
                position: absolute;
                top: 10px;
                right: 60px;
                left: auto;
                z-index: 50;
                display: flex;
                gap: 8px;
                opacity: 0;
                transition: opacity 0.3s ease;

                /* 允许面板自身接收鼠标事件，否则无法触发 hover */
                pointer-events: auto;

                /* 增加透明内边距，扩大鼠标感应范围（即“附近”区域） */
                padding: 20px;
                margin: -20px;
            }

            /* 仅保留面板自身的悬浮显示，移除 .mod14-stage-wrapper:hover 的触发 */
            .mod14-control-panel:hover {
                opacity: 1;
            }

        @keyframes mod14-slide-up {
                0% { transform: translateY(30px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
            @keyframes mod14-fade-in {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
            /* --- 新增的退场动画 --- */
            @keyframes mod14-slide-down-fade-out {
                0% {
                    transform: translateY(0);
                    opacity: 1;
                }
                100% {
                    transform: translateY(30px);
                    opacity: 0;
                }
            }
       
            .mod14-ctrl-btn {
                background: var(--container-bg-color); /* 纯变量 */
                border: 1px solid var(--primary-color); /* 纯变量 */
                color: var(--primary-color); /* 纯变量 */
                padding: 4px 10px;
                font-size: 12px;
                cursor: pointer;
                border-radius: 4px;
                backdrop-filter: blur(4px);
                user-select: none;
            }
            .mod14-ctrl-btn.active {
                background: var(--primary-color);
                color: var(--bg-color, #000);
                box-shadow: 0 0 8px var(--primary-color);
            }
            .mod14-ctrl-btn:hover {
                background: var(--border-color);
            }
.mod14-cg-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.mod14-cg-display-img {
    display: block;
    /* 核心需求：防止宽高超出，等比例缩放 */
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;

    /* 核心需求：防止太窄/太小 (根据需求设定一个最小值，或者利用 flex 居中即可) */
    min-width: 300px;
    min-height: 200px;

    box-shadow: 0 0 20px rgba(0,0,0,0.8);
    border-radius: 4px;
}
.mod14-settings-modal {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 3000;
    display: none;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
}
 .mod14-settings-content {
    background: var(--container-bg-color, #1a1a2e);
    border: 1px solid var(--primary-color, #00faff);
    color: var(--text-color, #fff);
    min-width: 600px; /* 【保留】设定一个基准宽度以优化布局 */
    max-width: 90%;
    max-height: 80%;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px; 

    overflow-y: auto;
}
.mod14-settings-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}
.mod14-settings-row label {
    flex-shrink: 0;
    font-weight: bold;
}
.mod14-settings-input, .mod14-settings-select {
    flex-grow: 1;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #444;
    color: #fff;
    padding: 5px;
    border-radius: 4px;
}
.mod14-settings-btn {
    background: var(--primary-color);
    color: #000;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;
}
.mod14-settings-btn:hover {
    filter: brightness(1.2);
}
.mod14-settings-btn.secondary {
    background: transparent;
    border: 1px solid var(--text-secondary-color);
    color: var(--text-secondary-color);
}

/* --- 美化的开关样式 (Toggle Switch) --- */
.mod14-toggle-switch {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 24px;
}
.mod14-toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}
.mod14-slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #444; /* 关闭时的颜色 */
    transition: .4s;
    border-radius: 24px;
    border: 1px solid #666;
}
.mod14-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}
/* 选中状态 */
.mod14-toggle-switch input:checked + .mod14-slider {
    background-color: var(--primary-color, #00faff);
    border-color: var(--primary-color, #00faff);
}
.mod14-toggle-switch input:checked + .mod14-slider:before {
    transform: translateX(22px);
    background-color: #000; /* 开关圆点的颜色 */
}
 .mod14-voicemap-header { /* 新增：折叠标题 */
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 10px 5px;
    border-top: 2px solid #555;
    margin-top: 15px;
    user-select: none;
}
.mod14-voicemap-header::after { /* 新增：折叠箭头 */
    content: '▲';
    transition: transform 0.3s ease;
    font-size: 0.8em;
}
.mod14-voicemap-header.collapsed::after { /* 新增：折叠后的箭头状态 */
    transform: rotate(180deg);
}
.mod14-voicemap-container {
    /* max-height: 450px; */ /* 【移除】不再限制自身高度 */
    /* overflow-y: auto; */   /* 【移除】不再自己处理滚动 */
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: all 0.4s ease-in-out;
    overflow: hidden;
    flex-shrink: 0; /* 【关键新增】防止在flex布局中被压缩 */
}
.mod14-voicemap-container.collapsed { /* 新增：折叠后的容器状态 */
    max-height: 0;
    padding-top: 0;
    margin-top: 0;
    border-top: none;
    opacity: 0;
}
.mod14-voicemap-pagination { /* 新增：分页容器样式 */
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 10px;
    user-select: none;
}
.mod14-page-btn { /* 新增：分页按钮样式 */
    cursor: pointer;
    padding: 2px 8px;
    border-radius: 4px;
    background: rgba(255,255,255,0.1);
}
.mod14-page-btn:hover {
    background: var(--primary-color);
    color: #000;
}
.mod14-page-info { /* 新增：页码信息样式 */
    font-size: 0.9em;
}
.mod14-voicemap-item {
    display: grid;
    grid-template-columns: 120px 1fr; /* 简化为两列 */
    gap: 10px;
    align-items: center;
    background: rgba(0,0,0,0.2);
    padding: 8px;
    border-radius: 4px;
    border-left: 3px solid #555;
}
.mod14-voicemap-item.is-custom {
    border-left-color: var(--primary-color);
}
.mod14-voicemap-charname {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.mod14-voicemap-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}
        `;
        document.head.appendChild(style);
    }

    // ============================================================
    // 2. 核心逻辑类：GalgameManager
    // ============================================================
    class GalgameManager {
        constructor() {
            this.queue = []; // 待播放队列
            this.historyStack = []; // 已播放历史 (用于回溯)
             this.activeCG = { name: null, imgId: null }; 
            this.isTyping = false;
            this.currentText = '';
            this.typingTimer = null;
                this.isShowingModal = false; // 新增：标记模态框是否显示
            this.ui = null;
  this.isAuto = false;      // 自动播放
        this.autoTimer = null;    // 自动播放倒计时
        this.isSkipping = false;  // 正在快进/跳过
            // 状态
            this.voiceMapPagination = {
    currentPage: 1,
    itemsPerPage: 5,
    allNpcs: []
};
            this.currentChunk = null; // 当前正在显示的数据块
            this.pendingOptions = null; // 待显示的选项
 // 在 constructor() 内部
this.ttsConfig = {
    enabled: localStorage.getItem('mod14_tts_enabled') === 'true',
    apiEndpoint: localStorage.getItem('mod14_tts_endpoint') || 'http://127.0.0.1:9880',
    version: localStorage.getItem('mod14_tts_version') || 'v2',
    defaultModel: localStorage.getItem('mod14_tts_default_model') || '',
    speed: parseFloat(localStorage.getItem('mod14_tts_speed')) || 1.0,
    emotion: localStorage.getItem('mod14_tts_emotion') || '中立',
    refLang: localStorage.getItem('mod14_tts_ref_lang') || '中文',     // 参考音频语言
    textLang: localStorage.getItem('mod14_tts_text_lang') || '多语种混合', // <--- 新增：文本语言
    captureMode: localStorage.getItem('mod14_tts_capture_mode') || 'quotes_bracket',
    filterStart: localStorage.getItem('mod14_tts_filter_start') || '<answer>',
    filterEnd: localStorage.getItem('mod14_tts_filter_end') || '</answer>',
    
};
this.ttsConfig.useDefaultOnMissing = localStorage.getItem('mod14_tts_use_default') === 'true'; // 新增配置
   

this.audioCache = {}; // { textHash: AudioBlob }
    this.activeDownloads = 0;
    this.maxConcurrentDownloads = 2; // 允许同时下载的数量（并行）
    this.currentAudio = new Audio();
    this.currentAudio.onended = () => { console.log('[GalTTS] Playback ended'); };
    this.currentAudio.onerror = (e) => { console.error('[GalTTS] Audio error', e); };

            this.initUI();
           
            // this.syncTheme();
            // window.addEventListener('resize', () => this.syncTheme());

         document.addEventListener('keydown', (e) => {
                // 避免在输入框打字时触发
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                if (e.code === 'Space' || e.code === 'ArrowRight') {
                    e.preventDefault(); // 防止空格滚动页面
                    this.handleInteraction();
                } else if (e.code === 'ArrowLeft') {
                    e.preventDefault();
                    this.handleBackStep();
                }
            });
this.scanAndSyncExpressions();
      
        }

 async populateVoiceMap() {
    const listContainer = this.ui.settingsModal.querySelector('#mod14-voicemap-list');
    if (!listContainer) return;

    listContainer.innerHTML = '<p style="text-align:center; opacity:0.7;">正在加载声线列表...</p>';

    const voiceMap = (window.assaSettingsData && window.assaSettingsData.voice_map) ||
                     (window.GameAPI && window.GameAPI.assaData && window.GameAPI.assaData.voice_map) || {};

    // 将 voiceMap 转换为数组以便分页
    this.voiceMapPagination.allNpcs = Object.keys(voiceMap).sort();
    this.voiceMapPagination.currentPage = 1; // 重置到第一页

    // 预先获取一次模型列表
    const baseModels = await this.fetchTTSModels();

    // 渲染当前页
    this.renderVoiceMapPage(baseModels);
}
 renderVoiceMapPage(baseModels) {
    const { currentPage, itemsPerPage, allNpcs } = this.voiceMapPagination;
    const listContainer = this.ui.settingsModal.querySelector('#mod14-voicemap-list');
    const paginationContainer = this.ui.settingsModal.querySelector('#mod14-voicemap-pagination');
    const voiceMap = (window.assaSettingsData && window.assaSettingsData.voice_map) ||
                     (window.GameAPI && window.GameAPI.assaData && window.GameAPI.assaData.voice_map) || {};

    listContainer.innerHTML = ''; // 清空当前列表

    if (allNpcs.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; opacity:0.7;">声线映射(voice_map)为空。</p>';
        paginationContainer.style.display = 'none';
        return;
    }

    const totalPages = Math.ceil(allNpcs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageNpcs = allNpcs.slice(startIndex, endIndex);

    pageNpcs.forEach(charName => {
        const config = voiceMap[charName];
        // 【修改 1】新增 refLang 变量初始化
        let model = '', version = '', textLang = '', refLang = '', emotion = '';
        let isCustom = false;

        if (typeof config === 'string') {
            model = config;
        } else if (typeof config === 'object' && config !== null) {
            model = config.model || '';
            version = config.version || '';
            textLang = config.textLang || '';
            // 【修改 2】提取 refLang
            refLang = config.refLang || '';
            emotion = config.emotion || '';
            isCustom = true;
        }

        const item = document.createElement('div');
        item.className = `mod14-voicemap-item ${isCustom ? 'is-custom' : ''}`;
        item.dataset.charName = charName;

        const modelOptions = [...new Set([model, ...baseModels])]
            .filter(Boolean)
            .map(m => `<option value="${m}" ${m === model ? 'selected' : ''}>${m}</option>`).join('');

        // 【修改 3】在 innerHTML 中添加 参考音频(refLang) 的下拉框
        item.innerHTML = `
            <span class="mod14-voicemap-charname" title="${charName}">${charName}</span>
            <div class="mod14-voicemap-details">
                <select class="mod14-settings-select vm-model">
                    <option value="">-- 选择模型 --</option>
                    ${modelOptions}
                </select>
                <input type="text" class="mod14-settings-input vm-emotion" placeholder="情感(默认中立)" value="${emotion}">
                <select class="mod14-settings-select vm-version">
                    <option value="">默认版本</option>
                    <option value="v2" ${version === 'v2' ? 'selected' : ''}>v2</option>
                    <option value="v3" ${version === 'v3' ? 'selected' : ''}>v3</option>
                    <option value="v4" ${version === 'v4' ? 'selected' : ''}>v4</option>
                </select>
                <select class="mod14-settings-select vm-textlang">
                    <option value="">默认文本语言</option>
                    <option value="多语种混合" ${textLang === '多语种混合' ? 'selected' : ''}>多语种混合</option>
                    <option value="中文" ${textLang === '中文' ? 'selected' : ''}>中文</option>
                    <option value="日语" ${textLang === '日语' ? 'selected' : ''}>日语</option>
                    <option value="英语" ${textLang === '英语' ? 'selected' : ''}>英语</option>
                </select>
                <select class="mod14-settings-select vm-reflang">
                    <option value="">默认参考语种</option>
                    <option value="中文" ${refLang === '中文' ? 'selected' : ''}>中文</option>
                    <option value="日语" ${refLang === '日语' ? 'selected' : ''}>日语</option>
                    <option value="英语" ${refLang === '英语' ? 'selected' : ''}>英语</option>
                </select>
            </div>
        `;
        listContainer.appendChild(item);

        const modelSelect = item.querySelector('.vm-model');
        modelSelect.addEventListener('mousedown', async (e) => {
            if (e.button !== 0) return;
            const currentValue = modelSelect.value;
            modelSelect.innerHTML = '<option>刷新中...</option>';
            const latestModels = await this.fetchTTSModels();
            const newOptions = [...new Set([currentValue, ...latestModels])]
                .filter(Boolean)
                .map(m => `<option value="${m}" ${m === currentValue ? 'selected' : ''}>${m}</option>`).join('');
            modelSelect.innerHTML = `<option value="">-- 选择模型 --</option>${newOptions}`;
            modelSelect.value = currentValue;
        });
    });

    // 渲染分页控件 (保持不变)
    if (totalPages > 1) {
        paginationContainer.style.display = 'flex';
        paginationContainer.innerHTML = `
            <span class="mod14-page-btn" id="mod14-prev-page">上一页</span>
            <span class="mod14-page-info">第 ${currentPage} / ${totalPages} 页</span>
            <span class="mod14-page-btn" id="mod14-next-page">下一页</span>
        `;

        paginationContainer.querySelector('#mod14-prev-page').onclick = () => {
            if (this.voiceMapPagination.currentPage > 1) {
                this.voiceMapPagination.currentPage--;
                this.renderVoiceMapPage(baseModels);
            }
        };
        paginationContainer.querySelector('#mod14-next-page').onclick = () => {
            if (this.voiceMapPagination.currentPage < totalPages) {
                this.voiceMapPagination.currentPage++;
                this.renderVoiceMapPage(baseModels);
            }
        };
    } else {
        paginationContainer.style.display = 'none';
    }
}
saveVoiceMap() {
    const items = this.ui.voiceMapModal.querySelectorAll('.mod14-voicemap-item');
    const newVoiceMap = {};

    items.forEach(item => {
        const charName = item.dataset.charName;
        const model = item.querySelector('.vm-model').value;
        const version = item.querySelector('.vm-version').value;
        const textLang = item.querySelector('.vm-textlang').value;
        const emotion = item.querySelector('.vm-emotion').value;

        // 如果所有自定义项都为空，且模型也为空，则跳过此条目
        if (!model && !version && !textLang && !emotion) {
            return;
        }

        // 如果只有模型，没有其他自定义项，则存为简单字符串
        if (model && !version && !textLang && !emotion) {
            newVoiceMap[charName] = model;
        } else { // 否则存为对象
            newVoiceMap[charName] = {
                model: model,
                version: version,
                textLang: textLang,
                emotion: emotion
            };
        }
    });

    const command = `memory("voice_map", ${JSON.stringify(newVoiceMap)});`;
    const fullCommand = `/setinput <updateMemory>${command}</updateMemory>`;

    if (window.GameAPI && window.GameAPI.triggerassa) {
        window.GameAPI.triggerassa(fullCommand);
        showNovaAlert("声线映射已发送更新指令！");
        this.closeVoiceMap();
    } else {
        console.error("无法发送指令: GameAPI.triggerassa 未定义");
        alert("发送指令失败，请检查控制台。");
    }
}
 saveTTSConfig() {
    // 1. 保存全局配置到 localStorage (保持不变)
    localStorage.setItem('mod14_tts_enabled', this.ttsConfig.enabled);
    localStorage.setItem('mod14_tts_endpoint', this.ttsConfig.apiEndpoint);
    localStorage.setItem('mod14_tts_version', this.ttsConfig.version);
    localStorage.setItem('mod14_tts_default_model', this.ttsConfig.defaultModel);
    localStorage.setItem('mod14_tts_speed', this.ttsConfig.speed);
    localStorage.setItem('mod14_tts_emotion', this.ttsConfig.emotion);
    localStorage.setItem('mod14_tts_ref_lang', this.ttsConfig.refLang);
    localStorage.setItem('mod14_tts_text_lang', this.ttsConfig.textLang);
    localStorage.setItem('mod14_tts_capture_mode', this.ttsConfig.captureMode);
    localStorage.setItem('mod14_tts_filter_start', this.ttsConfig.filterStart);
    localStorage.setItem('mod14_tts_filter_end', this.ttsConfig.filterEnd);
    localStorage.setItem('mod14_tts_use_default', this.ttsConfig.useDefaultOnMissing);

    // 2. 从当前显示的 DOM 中获取修改过的数据
    const items = this.ui.settingsModal.querySelectorAll('.mod14-voicemap-item');
    const currentUpdates = {};
    items.forEach(item => {
        const charName = item.dataset.charName;
        currentUpdates[charName] = {
            model: item.querySelector('.vm-model').value,
            version: item.querySelector('.vm-version').value,
            textLang: item.querySelector('.vm-textlang').value,
            // 【修改 4】获取 refLang 的值
            refLang: item.querySelector('.vm-reflang').value,
            emotion: item.querySelector('.vm-emotion').value,
        };
    });

    // 3. 合并修改到完整的 voice_map
    const originalVoiceMap = (window.assaSettingsData && window.assaSettingsData.voice_map) ||
                             (window.GameAPI && window.GameAPI.assaData && window.GameAPI.assaData.voice_map) || {};
    const newVoiceMap = { ...originalVoiceMap };
    let hasChanges = false;

    for (const charName in currentUpdates) {
        const update = currentUpdates[charName];
        // 只有在模型被选中的情况下才记录
        if (update.model) {
            hasChanges = true;
            // 【修改 5】判断条件加入 refLang，如果只有模型，存为字符串；否则存为对象
            if (!update.version && !update.textLang && !update.refLang && !update.emotion) {
                newVoiceMap[charName] = update.model;
            } else { // 否则存为对象
                newVoiceMap[charName] = {
                    model: update.model,
                    version: update.version,
                    textLang: update.textLang,
                  
                    refLang: update.refLang,
                    emotion: update.emotion
                };
            }
        } else {
            // 如果模型被清空，则从 voice_map 中移除该角色
            if (newVoiceMap.hasOwnProperty(charName)) {
                delete newVoiceMap[charName];
                hasChanges = true;
            }
        }
    }

    // 4. 如果 voice_map 有内容或有变动，则发送更新指令 (保持不变)
    if (hasChanges) {
        const command = `memory("voice_map", ${JSON.stringify(newVoiceMap)});`;
        const fullCommand = `/setinput <updateMemory>${command}</updateMemory>`;

        if (window.GameAPI && window.GameAPI.triggerassa) {
            window.GameAPI.triggerassa(fullCommand);
            showNovaAlert("声线映射已发送更新指令！");
        } else {
            console.error("无法发送指令: GameAPI.triggerassa 未定义");
            alert("发送指令失败，请检查控制台。");
        }
    }
}


    async fetchTTSModels() {
        try {
            const url = `${this.ttsConfig.apiEndpoint.replace(/\/$/, '')}/models`;
            console.log('[GalTTS] Fetching models from:', url);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ version: this.ttsConfig.version })
            });
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            const models = Object.keys(data.models || {});

            // 更新变量系统
            if (window.TavernHelper && window.TavernHelper.insertOrAssignVariables) {
                await window.TavernHelper.insertOrAssignVariables({
                    'available_models': JSON.stringify(models)
                }, { type: 'chat' });
                console.log('[GalTTS] Models synced to variable [available_models]');
            }

            return models;
        } catch (e) {
            console.error('[GalTTS] Failed to fetch models:', e);
            alert('获取模型失败，请检查API地址和版本');
            return [];
        }
    }

    cleanTextForTTS(text) {
        if (!text) return "";

        // 1. 标签过滤
        let clean = text;
        if (this.ttsConfig.filterStart && this.ttsConfig.filterEnd) {
            const s = this.ttsConfig.filterStart;
            const e = this.ttsConfig.filterEnd;
            const sIdx = clean.indexOf(s);
            const eIdx = clean.indexOf(e);
            if (sIdx !== -1 && eIdx !== -1 && eIdx > sIdx) {
                clean = clean.substring(sIdx + s.length, eIdx);
            }
        }

        // 2. 括号过滤 (英文和中文)
        clean = clean.replace(/\（.*?\）/g, '').replace(/\(.*?\)/g, '');

        if (this.ttsConfig.captureMode.startsWith('quotes')) {
    const quotes = [];
    let regex;

    // 根据模式选择不同的正则表达式
    switch (this.ttsConfig.captureMode) {
        case 'quotes_double':
            regex = /“([^”]+?)”/g;
            break;
        case 'quotes_bracket':
            regex = /「([^」]+?)」/g;
            break;
        case 'quotes_any':
        default: // 默认为两者都识别
            regex = /「([^」]+?)」|“([^”]+?)”/g;
            break;
    }

    let match;
    while ((match = regex.exec(clean)) !== null) {
        // match[1] 对应 「」，match[2] 对应 “”，取其中有值的一个
        quotes.push(match[1] || match[2]);
    }
    clean = quotes.join('，'); // 用逗号连接多段对话
}

return clean.trim();
}
getCharacterModel(charName) {
    const voiceMap = (window.assaSettingsData && window.assaSettingsData.voice_map) ||
                     (window.GameAPI && window.GameAPI.assaData && window.GameAPI.assaData.voice_map) || {};

    let modelConfig = null;

    if (charName && voiceMap[charName]) {
        const config = voiceMap[charName];
        if (typeof config === 'string') {
            // 兼容旧版： "角色名": "模型名"
            modelConfig = { model: config };
        } else if (typeof config === 'object' && config.model) {
            // 新版： "角色名": { model: "模型名", ... }
            modelConfig = config;
        }
    }

    // 如果找到了角色特定配置，则使用它
    if (modelConfig) {
        return {
            model: modelConfig.model,
            version: modelConfig.version || this.ttsConfig.version,
            textLang: modelConfig.textLang || this.ttsConfig.textLang,
            refLang: modelConfig.refLang || this.ttsConfig.refLang,
            emotion: modelConfig.emotion || this.ttsConfig.emotion,
        };
    }

    // 如果没找到，根据开关决定是否使用默认模型
    if (this.ttsConfig.useDefaultOnMissing) {
        return {
            model: this.ttsConfig.defaultModel,
            version: this.ttsConfig.version,
            textLang: this.ttsConfig.textLang,
            refLang: this.ttsConfig.refLang,
            emotion: this.ttsConfig.emotion,
        };
    }

    // 既没找到，又不让用默认的，则返回 null
    return null;
}

 async preloadAudio(chunk) {
    // 如果设置为仅捕获对话，但当前块是旁白（没有名字），则直接跳过
    if (this.ttsConfig.captureMode.startsWith('quotes') && !chunk.name) {
        return;
    }

    const textToRead = this.cleanTextForTTS(chunk.text);
    if (!textToRead) return;

    const cacheKey = `${chunk.name || 'Default'}_${textToRead}`; // 使用 chunk.name

    if (this.audioCache[cacheKey]) {
        chunk.audioBlob = this.audioCache[cacheKey];
        return;
    }

 

    const modelConfig = this.getCharacterModel(chunk.name);

// 如果返回 null，说明此角色不应发声
if (!modelConfig || !modelConfig.model) {
    return;
}

try {
    const baseUrl = this.ttsConfig.apiEndpoint.replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/infer_single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text: textToRead,
            model_name: modelConfig.model, // 使用配置中的模型
            text_lang: modelConfig.textLang, // 使用配置中的文本语言
            prompt_text_lang: modelConfig.refLang, // 使用配置中的参考语言
            version: modelConfig.version, // 使用配置中的版本
            dl_url: baseUrl,
            emotion: modelConfig.emotion, // 使用配置中的情感
            speed_facter: this.ttsConfig.speed, // 语速保持全局
            batch_size: 1,
            media_type: "wav",
            parallel_infer: true,
            text_split_method: "按标点符号切"
        })
    });

        if (!response.ok) throw new Error('TTS Gen Error');
        const data = await response.json();

        if (data.audio_url) {
            const audioRes = await fetch(data.audio_url);
            const blob = await audioRes.blob();
            this.audioCache[cacheKey] = blob;
            chunk.audioBlob = blob;
        }
    } catch (e) {
        console.error('[GalTTS] Download failed:', e);
    }
}

    playAudioForChunk(chunk) {
        if (!this.ttsConfig.enabled || !chunk.audioBlob) return;

        try {
            const url = URL.createObjectURL(chunk.audioBlob);
            this.currentAudio.src = url;
            this.currentAudio.play();
        } catch (e) {
            console.error('[GalTTS] Play failed:', e);
        }
    }
 async handleCGEvent(cgName) {
    console.log(`[Galgame] 触发 CG: ${cgName}`);
    const searchKey = `cg-${cgName}`;
    let imageSrc = '';

    // 1. 查找图片 (本地库 -> 远程映射)
    try {
        if (window.imageDB) {
            const blob = await window.imageDB.get('CustomNpcs', searchKey);
            if (blob) imageSrc = URL.createObjectURL(blob);
        }
        if (!imageSrc && window.GameAPI && window.GameAPI.npcImageMap && window.GameAPI.npcImageMap[searchKey]) {
            imageSrc = window.GameAPI.npcImageMap[searchKey];
        }
    } catch (e) { console.error(e); }

    if (!imageSrc) {
        console.warn(`[Galgame] 未找到 CG: ${searchKey}`);
        this.playNextChunk();
        return;
    }

    // 2. 构建 HTML
    // 注意：onclick="event.stopPropagation()" 防止点击图片时触发 body 的关闭事件
    const htmlContent = `
        <div style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;">
            <img src="${imageSrc}" class="mod14-cg-display-img" onclick="event.stopPropagation()" />
        </div>
    `;

    this.currentAttachmentsContent = htmlContent;
    // 传入 'cg' 标记，用于在 showAttachmentModal 里做特殊处理 (如果需要)
    this.showAttachmentModal(true);
}
    toggleOptionsLayer(show) {
            if (!this.ui || !this.ui.optionsLayer) return;
            const layer = this.ui.optionsLayer;

            if (show) {
                layer.classList.remove('hide');
                layer.classList.add('show');
            } else {
                // 只有在选项区当前可见时才播放退场动画
                if (layer.classList.contains('show')) {
                    layer.classList.remove('show');
                    layer.classList.add('hide');
                }
            }
        }
           buildFullCommand(descriptionText, tags) {
            let fullCommand = `/send ${descriptionText}`;

         
            if (!tags || tags.length === 0) {
                return fullCommand;
            }

            // 只有在存在标签时才添加检定属性指令
            const attributes = tags.join(';');
            const updateVariableCmd = `set_status('检定属性', 'old_value_placeholder', '${attributes}');`;

            // 将 updateMemory 指令块附加到主指令后面
            fullCommand += `\n<updateMemory>\n${updateVariableCmd}\n</updateMemory>`;

            return fullCommand;
        }
 // --- 新增：章节切换逻辑 ---
    async navigateChapter(direction) {
        // direction: -1 (上一章), 1 (下一章)

        // 1. 确定当前参考消息
        let referenceMsg = null;
        if (this.currentChunk) referenceMsg = this.currentChunk.originalMsg;
        else if (this.queue.length > 0) referenceMsg = this.queue[0].originalMsg;

        // 如果还没开始播放，取历史最后一条
        const history = window.GameAPI.conversationHistory;
        if (!referenceMsg && history.length > 0) referenceMsg = history[history.length - 1];
        if (!referenceMsg) return;

        let currentIndex = history.indexOf(referenceMsg);
        if (currentIndex === -1) return;

        // 2. 寻找目标消息 (跳过 User)
        let targetIndex = currentIndex + direction;

        // 循环查找直到找到非 User 消息或越界
        while (targetIndex >= 0 && targetIndex < history.length) {
            if (history[targetIndex].role !== 'user') {
                break; // 找到了
            }
            targetIndex += direction;
        }

        // 3. 检查是否有效
        if (targetIndex < 0 || targetIndex >= history.length) {
            console.log('[Galgame] 没有更多章节了');
            return;
        }

        const targetMsg = history[targetIndex];

        // 4. 执行跳转
        console.log(`[Galgame] 跳转章节: ${currentIndex} -> ${targetIndex}`);

        // 停止当前动作
        clearInterval(this.typingTimer);
        this.isTyping = false;
        this.queue = [];
        this.toggleOptionsLayer(false); // 隐藏选项

        // 加载目标消息
        await window.worldHelper.createMessageBubble(targetMsg, 'chat', true);

        // 播放
        this.playNextChunk();
    }

 async scanAndSyncExpressions() {
    // 稍微延迟以确保 GameAPI 和 imageDB 就绪
    await new Promise(r => setTimeout(r, 2000));

    const assaData = (window.GameAPI && window.GameAPI.assaData) || window.assaSettingsData;

    // 初始化空数据
    let expressionMap = {};
    let cgList = []; // 用于存储 CG 列表

    // 即使缺少数据源，我们也尝试存一个空对象，防止 EJS 报错
    if (!window.imageDB || !window.TavernHelper) {
        console.log('[Galgame] 无法扫描：缺少必要的数据源或工具。');
        await window.TavernHelper.insertOrAssignVariables(
            {
                'available_expressions_json': '{}',
                'available_cgs_json': '[]' // 
            },
            { type: 'chat' }
        );
        return;
    }

    try {
        const imgMap = assaData ? assaData.img_map : {};
        let allKeys = [];

        // 尝试获取 CustomNpcs 库中的所有图片键值
        if (typeof window.imageDB.keys === 'function') {
            allKeys = await window.imageDB.keys('CustomNpcs');
        } else {
            console.warn('[Galgame] imageDB 不支持 keys() 方法。');
            return;
        }

        if (allKeys && allKeys.length > 0) {
            // 1. 扫描差分 (原有逻辑)
            for (const [charName, baseCode] of Object.entries(imgMap)) {
                if (!baseCode) continue;
                const prefix = `${baseCode}-`;
                const variants = allKeys
                    .filter(key => String(key).startsWith(prefix))
                    .map(key => String(key).substring(prefix.length));
                if (variants.length > 0) {
                    expressionMap[charName] = variants;
                }
            }

            // ============================================================
            // 2. 扫描 CG
            // ============================================================
            // 筛选出以 "cg-" 开头的图片，并去掉前缀
            cgList = allKeys
                .filter(key => String(key).startsWith('cg-'))
                .map(key => String(key).substring(3)); // 去掉 "cg-" (3个字符)

            console.log('[Galgame] CG 扫描结果:', cgList);
            // ============================================================
        }

        // 3. 更新变量 (同时存入差分和 CG)
        await window.TavernHelper.insertOrAssignVariables(
            {
                'available_expressions_json': JSON.stringify(expressionMap),
                'available_cgs_json': JSON.stringify(cgList) // 存入 CG 列表
            },
            { type: 'chat' }
        );

    } catch (e) {
        console.error('[Galgame] 扫描资源时发生错误:', e);
    }
}

         initUI() {
            
            // 如果舞台已存在，则不再重新创建，直接返回
            if (document.querySelector('.mod14-stage-wrapper')) {
                console.log('[Galgame] UI already initialized.');
                return;
            }

            const parent = document.getElementById('chat-display-area');
            if (!parent) return;

            const stage = document.createElement('div');
            stage.className = 'mod14-stage-wrapper';

            // 1. 立绘层
            const cgLayer = document.createElement('div');
            cgLayer.className = 'mod14-cg-layer';
            cgLayer.innerHTML = '<img class="mod14-cg-image" src="" />';

            // 2. 选项层
            const optionsLayer = document.createElement('div');
            optionsLayer.className = 'mod14-options-layer';
           
            // 3. 对话框
            const dialogueBox = document.createElement('div');
            dialogueBox.className = 'mod14-dialogue-box';

            // 内部组件
            const nameTag = document.createElement('div');
            nameTag.className = 'mod14-name-tag';
            nameTag.innerHTML = '<span class="mod14-name-text"></span>';

            const textContent = document.createElement('div');
            textContent.className = 'mod14-text-content';

            const nextIndicator = document.createElement('div');
            nextIndicator.className = 'mod14-next-indicator';

            const backBtn = document.createElement('div');
            backBtn.className = 'mod14-back-btn';
            backBtn.innerHTML = ''; // 向上箭头
            backBtn.title = '回溯上一句';
            backBtn.onclick = (e) => {
                e.stopPropagation();
                this.handleBackStep();
            };

            const attachmentIcon = document.createElement('div');
            attachmentIcon.className = 'mod14-attachment-icon';
            attachmentIcon.innerHTML = '📦'; // 物品/详情图标
            attachmentIcon.title = '查看详情';
            attachmentIcon.onclick = (e) => {
                e.stopPropagation();
                this.showAttachmentModal();
            };

            dialogueBox.appendChild(nameTag);
            dialogueBox.appendChild(attachmentIcon);
            dialogueBox.appendChild(textContent);
            dialogueBox.appendChild(backBtn);
            dialogueBox.appendChild(nextIndicator);

            // 4. 全屏模态框
           // 4. 全屏模态框
            const modal = document.createElement('div');
            modal.className = 'mod14-attachment-modal';
            modal.innerHTML = `
                <div class="mod14-modal-content">
                    <button class="mod14-modal-close">关闭</button>
                    <div class="mod14-iframe-container" style="width:100%;height:100%;"></div>
                </div>
            `;
       this.closeAttachmentModal = () => {
                if (!this.ui.modal || this.ui.modal.style.display === 'none') return;

                // 添加退场动画类
                this.ui.modal.classList.add('closing');

                setTimeout(() => {
                    this.ui.modal.style.display = 'none';
                    this.ui.modal.classList.remove('closing');
                    this.isShowingModal = false;

   
        const hasRenderedOptions = this.ui.optionsLayer && this.ui.optionsLayer.children.length > 0;

                    if (this.queue.length === 0 && (this.pendingOptions || hasRenderedOptions)) {
                        this.toggleOptionsLayer(true);
                    }
                    // ============================================================

                    // 检查是否需要自动播放下一个
                    if (this.ui.modal.dataset.isAutoPlayFlow === 'true') {
                        this.ui.modal.dataset.isAutoPlayFlow = 'false';
                        setTimeout(() => this.playNextChunk(), 100);
                    }
                }, 300); // 对应 CSS 动画时长
            };

// 绑定点击事件
modal.onclick = (e) => {
    if (e.target === modal) this.closeAttachmentModal();
};
modal.querySelector('.mod14-modal-close').onclick = () => this.closeAttachmentModal();


      const controlPanel = document.createElement('div');
    controlPanel.className = 'mod14-control-panel';

    // 1. 设置按钮 (新增)
    const settingsBtn = document.createElement('div');
    settingsBtn.className = 'mod14-ctrl-btn';
    settingsBtn.textContent = 'TTS设置';
    settingsBtn.onclick = (e) => { e.stopPropagation(); this.openTTSSettings(); };

    // 2. 上一章按钮
    const prevChapBtn = document.createElement('div');
            prevChapBtn.className = 'mod14-ctrl-btn';
            prevChapBtn.textContent = '上一章';
            prevChapBtn.title = '上一章';
            prevChapBtn.onclick = (e) => { e.stopPropagation(); this.navigateChapter(-1); };

            // 原有：Auto
            const autoBtn = document.createElement('div');
            autoBtn.className = 'mod14-ctrl-btn';
            autoBtn.textContent = '自动播放';
            autoBtn.onclick = (e) => { e.stopPropagation(); this.toggleAuto(autoBtn); };

            // 原有：Skip
            const skipBtn = document.createElement('div');
            skipBtn.className = 'mod14-ctrl-btn';
            skipBtn.textContent = '跳过';
            skipBtn.onclick = (e) => { e.stopPropagation(); this.skipToLatest(); };

            // 新增：下一章按钮
            const nextChapBtn = document.createElement('div');
            nextChapBtn.className = 'mod14-ctrl-btn';
            nextChapBtn.textContent = '下一章';
            nextChapBtn.title = '下一章';
            nextChapBtn.onclick = (e) => { e.stopPropagation(); this.navigateChapter(1); };
controlPanel.appendChild(settingsBtn);
            controlPanel.appendChild(prevChapBtn);
            controlPanel.appendChild(autoBtn);
            controlPanel.appendChild(skipBtn);
            controlPanel.appendChild(nextChapBtn);

 

        controlPanel.appendChild(autoBtn);
        controlPanel.appendChild(skipBtn);

        // 将面板添加到 stage (建议放在 dialogueBox 之前或之后都可以，只要在 stage 内)
        stage.appendChild(controlPanel);
            // 组装
            stage.appendChild(cgLayer);
            stage.appendChild(optionsLayer);
            stage.appendChild(dialogueBox);
            document.body.appendChild(modal); // 模态框挂在 body 上以确保全屏
            parent.appendChild(stage);

            

           // 将事件绑定移到这里，确保只绑定一次
            this.ui = {
                stage, cgLayer, cgImg: cgLayer.querySelector('.mod14-cg-image'),
                optionsLayer, dialogueBox, nameTag, nameText: nameTag.querySelector('.mod14-name-text'),
                textContent, nextIndicator, attachmentIcon, modal,
                iframeContainer: modal.querySelector('.mod14-iframe-container'),
                autoBtn: autoBtn, // 将按钮也存起来
                skipBtn: skipBtn
            };
              // 绑定交互事件
            dialogueBox.addEventListener('click', (e) => {
                if (e.target.closest('.mod14-back-btn') || e.target.closest('.mod14-attachment-icon')) return;
                this.handleInteraction();
            });
            backBtn.onclick = (e) => { e.stopPropagation(); this.handleBackStep(); };
            attachmentIcon.onclick = (e) => { e.stopPropagation(); this.showAttachmentModal(); };
            autoBtn.onclick = (e) => { e.stopPropagation(); this.toggleAuto(this.ui.autoBtn); };
            skipBtn.onclick = (e) => { e.stopPropagation(); this.skipToLatest(); };

            // 绑定模态框关闭事件
            const closeModal = () => {
                this.ui.modal.style.display = 'none';
                this.isShowingModal = false;
                // 检查关闭时是否需要自动播放下一个
                if (this.ui.modal.dataset.isAutoPlayFlow === 'true') {
                    this.ui.modal.dataset.isAutoPlayFlow = 'false'; // 重置标记
                    setTimeout(() => this.playNextChunk(), 100);
                }
            };
            this.ui.modal.querySelector('.mod14-modal-close').onclick = closeModal;
            this.ui.modal.onclick = (e) => {
                if (e.target === this.ui.modal) closeModal();
            };

            const settingsModal = document.createElement('div');
    settingsModal.className = 'mod14-settings-modal';
 
 
 settingsModal.innerHTML = `
    <div class="mod14-settings-content">
        <h3 style="margin:0; border-bottom:1px solid #444; padding-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
            TTS 配置
            <label class="mod14-toggle-switch" title="启用/禁用 TTS">
                <input type="checkbox" id="mod14-tts-enable" ${this.ttsConfig.enabled ? 'checked' : ''}>
                <span class="mod14-slider"></span>
            </label>
        </h3>

        <!-- 全局设置部分 -->
        <div class="mod14-settings-row">
            <label>API 地址</label>
            <input type="text" class="mod14-settings-input" id="mod14-tts-api" value="${this.ttsConfig.apiEndpoint}">
        </div>
        <div class="mod14-settings-row">
            <label>API 版本</label>
            <select class="mod14-settings-select" id="mod14-tts-version">
                <option value="v2" ${this.ttsConfig.version==='v2'?'selected':''}>v2</option>
                <option value="v3" ${this.ttsConfig.version==='v3'?'selected':''}>v3</option>
                <option value="v4" ${this.ttsConfig.version==='v4'?'selected':''}>v4</option>
            </select>
        </div>
        <div class="mod14-settings-row">
            <button class="mod14-settings-btn" id="mod14-tts-fetch" style="width:100%">刷新/获取可用模型</button>
        </div>
        <div class="mod14-settings-row">
            <label>默认模型</label>
            <select class="mod14-settings-select" id="mod14-tts-model">
                <option value="${this.ttsConfig.defaultModel}">${this.ttsConfig.defaultModel || '未选择'}</option>
            </select>
        </div>
        <div class="mod14-settings-row">
            <label>文本语言</label>
            <select class="mod14-settings-select" id="mod14-tts-textlang">
                <option value="多语种混合" ${this.ttsConfig.textLang==='多语种混合'?'selected':''}>多语种混合</option>
                <option value="中文" ${this.ttsConfig.textLang==='中文'?'selected':''}>中文</option>
                <option value="日语" ${this.ttsConfig.textLang==='日语'?'selected':''}>日语</option>
                <option value="英语" ${this.ttsConfig.textLang==='英语'?'selected':''}>英语</option>
            </select>
        </div>
        <div class="mod14-settings-row">
            <label>参考音频语言</label>
            <select class="mod14-settings-select" id="mod14-tts-reflang">
                <option value="中文" ${this.ttsConfig.refLang==='中文'?'selected':''}>中文</option>
                <option value="日语" ${this.ttsConfig.refLang==='日语'?'selected':''}>日语</option>
                <option value="英语" ${this.ttsConfig.refLang==='英语'?'selected':''}>英语</option>
            </select>
        </div>
        <div class="mod14-settings-row">
            <label>语速</label>
            <input type="number" class="mod14-settings-input" id="mod14-tts-speed" step="0.1" value="${this.ttsConfig.speed}">
        </div>
        <div class="mod14-settings-row">
            <label title="当角色没有配置专属声线时，是否使用上方设置的默认模型。">未配置角色使用默认</label>
            <label class="mod14-toggle-switch">
                <input type="checkbox" id="mod14-tts-use-default" ${this.ttsConfig.useDefaultOnMissing ? 'checked' : ''}>
                <span class="mod14-slider"></span>
            </label>
        </div>
        <div class="mod14-settings-row">
            <label>捕获模式</label>
            <select class="mod14-settings-select" id="mod14-tts-capture">
                <option value="all" ${this.ttsConfig.captureMode==='all'?'selected':''}>全部文本</option>
                <option value="quotes_double" ${this.ttsConfig.captureMode==='quotes_double'?'selected':''}>仅对话 (“”)</option>
                <option value="quotes_bracket" ${this.ttsConfig.captureMode==='quotes_bracket'?'selected':''}>仅对话 (「」)</option>
                <option value="quotes_any" ${this.ttsConfig.captureMode==='quotes_any'?'selected':''}>仅对话 (两者)</option>
            </select>
        </div>

           <!-- 声线管理部分 -->
        <div class="mod14-voicemap-header collapsed" id="mod14-voicemap-toggle">
            <h4 style="margin:0;">NPC 音色设置 (点击展开/收起)</h4>
        </div>
        <div class="mod14-voicemap-container collapsed" id="mod14-voicemap-list-wrapper">
             <div id="mod14-voicemap-list">
                <!-- 角色条目将动态生成在这里 -->
             </div>
             <div class="mod14-voicemap-pagination" id="mod14-voicemap-pagination" style="display: none;">
                <!-- 分页按钮将动态生成在这里 -->
             </div>
        </div>

        <!-- 底部按钮 -->
        <div style="margin-top:auto; display:flex; justify-content:flex-end; gap:10px; padding-top:10px; border-top:1px solid #444;">
            <button class="mod14-settings-btn secondary" id="mod14-tts-cancel">取消</button>
            <button class="mod14-settings-btn" id="mod14-tts-save">保存配置</button>
        </div>
    </div>
`;
    document.body.appendChild(settingsModal);
    this.ui.settingsModal = settingsModal;
     // 新增：绑定折叠事件
    const voiceMapToggle = settingsModal.querySelector('#mod14-voicemap-toggle');
    const voiceMapContainer = settingsModal.querySelector('#mod14-voicemap-list-wrapper');
    voiceMapToggle.addEventListener('click', () => {
        voiceMapToggle.classList.toggle('collapsed');
        voiceMapContainer.classList.toggle('collapsed');
    });
 settingsModal.addEventListener('click', (event) => {
        // 检查点击事件的目标是否是模态框背景本身
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    // 绑定设置事件
    settingsModal.querySelector('#mod14-tts-cancel').onclick = () => { settingsModal.style.display = 'none'; };
 settingsModal.querySelector('#mod14-tts-save').onclick = () => {
    // 更新内存中的 ttsConfig 对象
    this.ttsConfig.enabled = settingsModal.querySelector('#mod14-tts-enable').checked;
    this.ttsConfig.apiEndpoint = settingsModal.querySelector('#mod14-tts-api').value;
    this.ttsConfig.version = settingsModal.querySelector('#mod14-tts-version').value;
    this.ttsConfig.defaultModel = settingsModal.querySelector('#mod14-tts-model').value;
    this.ttsConfig.textLang = settingsModal.querySelector('#mod14-tts-textlang').value;
    this.ttsConfig.refLang = settingsModal.querySelector('#mod14-tts-reflang').value;
    this.ttsConfig.speed = parseFloat(settingsModal.querySelector('#mod14-tts-speed').value);
    this.ttsConfig.useDefaultOnMissing = settingsModal.querySelector('#mod14-tts-use-default').checked;
    this.ttsConfig.captureMode = settingsModal.querySelector('#mod14-tts-capture').value;

    // 调用统一的保存方法
    this.saveTTSConfig();

    settingsModal.style.display = 'none';
    showNovaAlert("TTS配置已保存");
};
    settingsModal.querySelector('#mod14-tts-fetch').onclick = async (e) => {
        const btn = e.target;
        btn.textContent = '获取中...';
        // 临时更新 version 以便 fetch 使用
        this.ttsConfig.version = settingsModal.querySelector('#mod14-tts-version').value;
        this.ttsConfig.apiEndpoint = settingsModal.querySelector('#mod14-tts-api').value;

        const models = await this.fetchTTSModels();
        const select = settingsModal.querySelector('#mod14-tts-model');
        select.innerHTML = '';
        models.forEach(m => {
            select.add(new Option(m, m, false, m === this.ttsConfig.defaultModel));
        });
        btn.textContent = '刷新/获取模型列表';
    };
}

// 辅助方法：打开设置
openTTSSettings() {
    if (this.ui.settingsModal) {
        this.ui.settingsModal.style.display = 'flex';
        this.populateVoiceMap(); // 打开时自动加载声线列表
    }
}
       

        syncTheme() {
            if (!this.ui || !window.GameAPI) return;
            const getVar = window.GameAPI.getThemeVar;
            const theme = {
                '--primary-color': getVar('--primary-color') || '#00faff',
                '--secondary-color': getVar('--secondary-color') || '#7affff',
                '--text-color': getVar('--text-color') || '#e6f1ff',
                '--text-secondary-color': getVar('--text-secondary-color') || '#a8c0e1',
                '--container-bg-color': getVar('--container-bg-color') || 'rgba(10, 25, 47, 0.85)',
                '--border-color': getVar('--border-color') || 'rgba(0, 250, 255, 0.3)',
                '--glow-color': getVar('--glow-color') || 'rgba(0, 250, 255, 0.5)',
                '--base-font-family': getVar('--base-font-family') || '"Microsoft YaHei", sans-serif',
                '--base-font-size': getVar('--base-font-size') || '16px',
                '--base-line-height': getVar('--base-line-height') || '1.5'
            };
            Object.entries(theme).forEach(([k, v]) => this.ui.stage.style.setProperty(k, v));
        }

        // --- 核心流程 ---

     enqueueMessage(msg, rawContent, extractedOptions = []) {
    // 重绘时的智能过滤：
    // 如果正在重绘(isBulkRendering)，且还没遇到刚才正在读的那条消息，
    // 那么这条消息肯定是旧历史，直接丢弃，不加入队列。
    if (this.isBulkRendering) {
        if (msg !== this.savedState?.originalMsg && !this.hasReachedCurrentMsg) {
            return;
        }
        // 一旦遇到了当前消息，标记一下，后续的消息（以及当前消息）都允许通过
        this.hasReachedCurrentMsg = true;
    }
    if (msg.role === 'user') return;

    const msgId = msg === this.lastEnqueuedMsg ? 'SAME_MSG' : Date.now();
    if (msg === this.lastEnqueuedMsg && this.queue.length > 0) {
        // 简单的去重
    }
    this.lastEnqueuedMsg = msg;

    let processedContent = rawContent;
    const htmlPlaceholders = {};
    let placeholderIndex = 0;

    // --- 新增：富文本 UI 占位符 (用于保护 msg 和 group_chat 生成的 HTML) ---
    const richUiPlaceholders = {};
    let richUiIndex = 0;

    // 辅助函数：生成并保存富文本占位符
    const protectRichUi = (htmlContent) => {
        const key = `###RICH_UI_BLOCK_${richUiIndex}###`;
        richUiPlaceholders[key] = htmlContent;
        richUiIndex++;
        return key; // 返回占位符，而不是 HTML
    };

    const userNickname = window.currentGameData?.user?.nick_name || '你';

    // 1.1 保护 <html> 和 ```代码块``` (保持原样)
     processedContent = processedContent.replace(/<html>([\s\S]*?)<\/html>|```(\w*)\n([\s\S]*?)\n```/gs, (match, htmlBlock, lang, markdownBlock) => {
        const placeholder = `HTMLCONTENTPLACEHOLDER${placeholderIndex}`;

        // ============================================================
        // 【修改开始】修复 HTML 标签被剥离导致无法识别为附件的问题
        // ============================================================
        let rawHtml = '';

        // 如果 htmlBlock 不为 undefined，说明正则匹配到了第一部分(<html>...</html>)
        // 此时必须使用 match (即包含 <html> 标签的完整字符串)，而不是 htmlBlock (仅包含内部内容)
        if (htmlBlock !== undefined) {
            rawHtml = match;
        }
        // 否则是代码块匹配
        else if (markdownBlock) {
            rawHtml = `<pre><code class="language-${lang || ''}">${markdownBlock.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
        }
      if (!rawHtml) return match;
        htmlPlaceholders[placeholder] = rawHtml;
        placeholderIndex++;
        return placeholder;
    });
    // 1.2 解析 <msg> -> 转换为 HTML 后立即用占位符保护
  processedContent = processedContent.replace(/<msg>([^|]+)\|([^|]+)\|([\s\S]*?)<\/msg>/gs, (match, sender, receiver, msgContent) => {
        // 【修改点】将最后一个参数由 true 改为 false
        // 这样 renderPrivateMsgToHtml 才会生成包含 BGM 信息的隐藏 div (js-music-autoplay-trigger)
        // 从而让下方的 bgmMatch 正则能提取到歌曲信息
        const html = window.worldHelper.renderPrivateMsgToHtml(sender.trim(), receiver.trim(), msgContent, userNickname, false);
        return protectRichUi(html);
    });

    // 1.3 解析 <group_chat> -> 转换为 HTML 后立即用占位符保护
    processedContent = processedContent.replace(/<group_chat\s+name="([^"]*)">([\s\S]*?)<\/group_chat>/gs, (match, groupName, chatContent) => {
        let groupChatHtml = `<div class="group-chat-separator">群聊: ${groupName.trim()}</div>`;
        if (typeof chatContent === 'string') {
            const lines = chatContent.trim().split('\n');
            for (const line of lines) {
                const cleanedLine = line.trim();
                if (!cleanedLine || cleanedLine.startsWith('summary|')) continue;
                const messageMatch = cleanedLine.match(/^([^|]+)\|([\s\S]*)/);
                if (messageMatch) {
                    groupChatHtml += window.worldHelper.renderGroupChatToHtml(messageMatch[1].trim(), messageMatch[2].trim(), userNickname);
                }
            }
        }
        return protectRichUi(groupChatHtml);
    });

    // 1.4 恢复 HTML 占位符 (保持原样，用于处理 <html> 标签)
    for (const placeholder in htmlPlaceholders) {
        processedContent = processedContent.replace(placeholder, htmlPlaceholders[placeholder]);
    }

    // --- 步骤2: 分块逻辑 ---
    const history = window.GameAPI.conversationHistory;
    const isRealLastMsg = (history && history.length > 0 && msg === history[history.length - 1]);

    const attachmentRegex = /<html>([\s\S]*?)<\/html>|<details>([\s\S]*?)<\/details>/gi;
    const attachmentMatch = processedContent.match(attachmentRegex);

    // 定义一个通用的文本分块处理函数
  const processTextLines = (textToProcess) => {
        const lines = textToProcess.split('\n');
        lines.forEach((line) => {
            let trimmed = line.trim();
            if (!trimmed) return;
            if (trimmed.startsWith('<') && trimmed.endsWith('>') &&
                !/^<(em|strong|span|p|div|b|i|u|s|font)/i.test(trimmed)) {
                return;
            }
 if (trimmed.toLowerCase().startsWith('cg|')) {
            const cgName = trimmed.substring(3).trim(); // 获取 cg| 后面的内容
            if (cgName) {
                this.queue.push({
                    type: 'cg_event', // 标记为 CG 事件
                    cgName: cgName,   // 图片名
                    text: '',
                    name: '系统',
                    attachments: [],
                    isAttachmentDisplay: false,
                    isLast: false,
                    options: [],
                    isRealLastMsg: isRealLastMsg,
                    originalMsg: msg
                });
            }
            return; // 拦截成功，跳过后续常规解析
        }
            let name = '';
            let text = trimmed;
            let expression = null; // 用于存储差分/表情

            // 检查是否包含富文本占位符
            let isRichContent = false;
            // 简单的检查：如果这一行包含我们生成的占位符 key
            for (const key in richUiPlaceholders) {
                if (text.includes(key)) {
                    text = text.replace(key, richUiPlaceholders[key]); // 恢复为完整的 HTML
                    isRichContent = true;
                }
            }
   const cleanLine = trimmed.replace(/｜/g, '|');
            const firstPipeIndex = cleanLine.indexOf('|');

            // 检查是否有竖线，且竖线位置靠前（避免误判长句中的竖线）
            if (!isRichContent && firstPipeIndex > 0 && firstPipeIndex < 30) {

   
                const match3 = cleanLine.match(/^([^|]+)\|([^|]+)\|([\s\S]*)$/);

                if (match3) {
                    // 命中三段式
                    name = match3[1].trim().replace(/-/g, '');
                    expression = match3[2].trim();
                    text = match3[3].trim();

                    // 【调试日志】让你在控制台确认解析结果
                    console.log(`[Galgame] 解析成功(3段): 名字=[${name}], 差分=[${expression}]`);
                } else {
                    // 尝试匹配二段式：名字|内容
                    const match2 = cleanLine.match(/^([^|]+)\|([\s\S]*)$/);
                    if (match2) {
                        // 命中二段式
                        name = match2[1].trim().replace(/-/g, '');
                        text = match2[2].trim();
                        // expression 保持为 null
                    } else {
                        // 有竖线但格式不对，当作普通文本处理
                        if (trimmed.startsWith('(') || trimmed.startsWith('（')) name = '';
                        else name = (msg.name || '').replace(/-/g, '');
                    }
                }
            } else {
                // 没有竖线，走默认逻辑
                if (trimmed.startsWith('(') || trimmed.startsWith('（')) {
                    name = '';
                } else {
                    name = (msg.name || '').replace(/-/g, '');
                }
            }
 
 const chunk = {
                name,
                text,
                expression, // 存入队列
                attachments: [],
                isAttachmentDisplay: false,
                isRichContent: isRichContent,
                isLast: false,
                options: [],
                isRealLastMsg: isRealLastMsg,
                originalMsg: msg
            };
            this.queue.push(chunk);

          
 if (!this.currentChunk && this.queue.length === 1) {
    this.preloadAudio(chunk);
}
        });
    };
     const splitRegex = /(<html>[\s\S]*?<\/html>|<details>[\s\S]*?<\/details>)/gi;
    const parts = processedContent.split(splitRegex);

    parts.forEach(part => {
        // 跳过空字符串
        if (!part) return;

        // 检查这一部分是否是 HTML/附件
        if (/^(<html>[\s\S]*?<\/html>|<details>[\s\S]*?<\/details>)$/i.test(part)) {
              const chunk = {
                name: msg.name || '系统',
                text: '', // 附件块没有文本，不发TTS
                attachments: [part],
                isAttachmentDisplay: true,
                isLast: false,
                options: [],
                isRealLastMsg: isRealLastMsg,
                originalMsg: msg
            };
            this.queue.push(chunk);
            // 附件块不需要TTS
        } else {
            processTextLines(part); // processTextLines 内部已经修改好了
        }
    });

        

    // --- 步骤3: 后处理 (设置最后一个块的属性) ---
    if (this.queue.length > 0) {
        const lastChunk = this.queue[this.queue.length - 1];
        if (lastChunk.originalMsg === msg) {
            lastChunk.isLast = true;
            lastChunk.options = extractedOptions;
        }
    } else if (extractedOptions.length > 0) {
        this.queue.push({
            name: '系统',
            text: '请做出选择...',
            attachments: [],
            isAttachmentDisplay: false,
            isLast: true,
            options: extractedOptions,
            isRealLastMsg: isRealLastMsg,
            originalMsg: msg
        });
    }
      try {
        // 1. 并不检查 rawContent，而是检查所有生成的富文本占位符内容
        // 因为 BGM 触发器是在 renderPrivateMsgToHtml 中生成的，存在 placeholders 里
        const allHtmlContent = Object.values(richUiPlaceholders).join('') + Object.values(htmlPlaceholders).join('');

        // 使用正则直接提取信息，比创建 DOM 更快且能匹配到占位符中的内容
        // 匹配格式: class="js-music-autoplay-trigger" ... data-song="..."
        const bgmMatch = allHtmlContent.match(/class="js-music-autoplay-trigger"[\s\S]*?data-song="([^"]*)"[\s\S]*?data-artist="([^"]*)"[\s\S]*?data-dom-id="([^"]*)"/);

        if (bgmMatch) {
            const song = bgmMatch[1];
            const artist = bgmMatch[2];
            const domId = bgmMatch[3];

            console.log(`[Galgame] 检测到 BGM 请求: ${song} (ID: ${domId})，正在等待 DOM 就绪...`);

            // 2. 启动轮询机制 (最多等待 2 秒)
            let attempts = 0;
            const maxAttempts = 20; // 20次 * 100ms = 2秒

            const checkTimer = setInterval(() => {
                attempts++;

                // 检查播放器 DOM 元素是否已挂载到页面上
                // 这一点很重要，因为 GlobalChatAudio 通常需要获取该元素来更新进度条
                const elementExists = document.getElementById(domId) || document.querySelector(`[data-dom-id="${domId}"]`);

                if (window.GlobalChatAudio && elementExists) {
                    // 成功：元素存在且音频引擎就绪
                    clearInterval(checkTimer);
                    console.log('[Galgame] BGM 元素就绪，开始播放。');
                    window.GlobalChatAudio.playMusic(song, artist, domId, true);
                } else if (attempts >= maxAttempts) {
                    // 超时：强制尝试播放（防止因 DOM 问题导致完全没声音）
                    clearInterval(checkTimer);
                    console.warn('[Galgame] BGM 等待超时，尝试强制播放。');
                    if (window.GlobalChatAudio) {
                        window.GlobalChatAudio.playMusic(song, artist, domId, true);
                    }
                }
            }, 100); // 每 100ms 检查一次
        }
    } catch (e) {
        console.error('[Galgame] BGM 解析/播放逻辑异常:', e);
    }
    if (!this.isTyping && this.ui.optionsLayer.classList.contains('show') && !this.isShowingModal && !this.isBulkRendering) {
        this.playNextChunk();
    }
    this.processAudioQueue();
}
 processAudioQueue() {
        if (!this.ttsConfig.enabled) return;

        // 循环填满并发槽位
        while (this.activeDownloads < this.maxConcurrentDownloads) {
            // 1. 在队列中找到第一个：有文本 + 没音频 + 没在下载 的块
            const target = this.queue.find(c =>
                c.text &&
                !c.audioBlob &&
                !c.isPreloading &&
                !c.isAttachmentDisplay
            );

            // 2. 如果没有待下载的任务，停止调度
            if (!target) break;

            // 3. 启动下载任务
            this.activeDownloads++;
            target.isPreloading = true; // 抢占标记，防止被重复选中

            // 异步调用，不等待结果，直接进入下一次循环填补下一个槽位
            this.preloadAudio(target).finally(() => {
                this.activeDownloads--;
                // 任务结束（无论成功失败），立刻触发下一次调度，形成闭环
                this.processAudioQueue();
            });
        }
    }
        parseRawOptions(text) {
            // 兼容你的 generateChoices 逻辑：非空行，或数字开头
            return text.split('\n').filter(line => line.trim() && (/^\d+\.\s*/.test(line.trim()) || !/^\s*$/.test(line.trim())));
        }

        isCurrentlyLastMessage(msg) {
    if (!msg) return false;
    const history = window.GameAPI.conversationHistory;
    if (!history || history.length === 0) return false;
    
    // 从当前消息往后查找，看是否还有AI消息
    const currentIndex = history.indexOf(msg);
    if (currentIndex === -1) return false;
    
    for (let i = currentIndex + 1; i < history.length; i++) {
        if (history[i].role !== 'user') {
            return false; // 找到后续AI消息，说明不是最后一条
        }
    }
    return true; // 后面只有user消息或没有消息
}

handleInteraction() {
    // 防止回溯时点击
    if (this.isBacktracking) return;

    // 如果正在打字，瞬间完成
    if (this.isTyping) {
        this.finishTyping();
        return;
    }

    // 更安全的选项层检查
    const isOptionsVisible = this.ui.optionsLayer.classList.contains('show');

    if (isOptionsVisible && this.queue.length === 0) {
        // 【关键修改】实时检查是否真的是最后一条消息
        if (this.currentChunk && !this.isCurrentlyLastMessage(this.currentChunk.originalMsg)) {
            console.log('[Galgame] 检测到后续消息，跳过选项继续播放');
            this.toggleOptionsLayer(false);
            // 尝试加载下一条消息
            this.navigateChapter(1); // 跳到下一章
            return;
        }
        return; // 确实是最后一条，必须选
    }

    // 如果选项层显示但队列里还有东西，强制隐藏选项层继续播放
    if (isOptionsVisible && this.queue.length > 0) {
        this.toggleOptionsLayer(false);
    }

    if (this.queue.length > 0) {
        this.playNextChunk();
    }
}

  toggleAuto(btn) {
        this.isAuto = !this.isAuto;
        if (this.isAuto) {
            btn.classList.add('active');
            // 如果当前不在打字且没有选项，触发下一步
            if (!this.isTyping && this.ui.optionsLayer.classList.contains('show')) {
                this.handleInteraction();
            }
        } else {
            btn.classList.remove('active');
            clearTimeout(this.autoTimer);
        }
    }
 async skipToLatest() {
        const history = window.GameAPI.conversationHistory;
        if (!history || history.length === 0) return;

        console.log('[Galgame] 正在寻找最近的有效剧情...');

        // 1. 强制重置 UI 和状态 (防止卡死)
        clearInterval(this.typingTimer);
        clearTimeout(this.autoTimer);
        if (this.ui && this.ui.optionsLayer) this.toggleOptionsLayer(false);
        if (this.ui && this.ui.nextIndicator) this.ui.nextIndicator.classList.remove('active');

        this.isBulkRendering = false;
        this.hasReachedCurrentMsg = false;
        this.savedState = null;
        this.lastEnqueuedMsg = null;
        this.isSkipping = true;
        this.isTyping = true; // 加锁
        this.queue = [];
 
        // 2. 【核心修复】从后往前找，找到第一条非 User 的消息
        // 这样即使最后一条是你发的，它也会跳到 AI 回复的上一条
        let targetIndex = history.length - 1;
        while (targetIndex >= 0) {
            const msg = history[targetIndex];
            // 排除用户消息，且排除被隐藏的消息(如果有的话)
            if (msg.role !== 'user') {
                break;
            }
            targetIndex--;
        }

        if (targetIndex < 0) {
            console.warn('[Galgame] 未找到任何 AI 消息');
            this.isTyping = false;
            this.isSkipping = false;

            return;
        }

        const targetMsg = history[targetIndex];
        console.log(`[Galgame] 锁定目标消息索引: ${targetIndex}, 角色: ${targetMsg.role}`);

        // 3. 检查是否已经在显示这条消息的最后部分
        if (this.currentChunk &&
            this.currentChunk.originalMsg === targetMsg &&
            this.currentChunk.isLast) {
             console.log('[Galgame] 已在最新处');
             this.finishTyping();
             this.isTyping = false;
             setTimeout(() => { this.isSkipping = false; }, 100);
             return;
        }

        // 4. 解析目标消息
        await window.worldHelper.createMessageBubble(targetMsg, 'chat', true);

  // 5. 执行播放
        this.isTyping = false; // 解锁

        if (this.queue.length > 0) {
            // --- 【修改开始】 ---
            // 原逻辑：只保留最后一块，清空其余的 -> 导致回溯时中间层丢失
            // 新逻辑：将中间的块直接推入历史栈，模拟“已读”状态

            const finalChunk = this.queue.pop(); // 取出最后一块作为当前展示目标

            // 将剩余在队列中的块（即中间过程块）全部转移到历史栈
            while (this.queue.length > 0) {
                const skippedChunk = this.queue.shift();
                this.historyStack.push(skippedChunk);
            }

            // 将最后一块放回队列头部，准备播放
            this.queue.push(finalChunk);
            this.playNextChunk();
            
        } else {
            // 如果这条 AI 消息解析出来也是空的（比如纯指令），尝试递归找上一条？
            // 这里简单处理：提示无法跳过
            console.warn('[Galgame] 目标消息解析为空 (可能是纯指令或被过滤)');
            this.finishTyping();
        }

        setTimeout(() => { this.isSkipping = false; }, 200);
    }
   async handleBackStep() {
        // 防止快速点击导致的逻辑混乱
        if (this.isBacktracking) return;
        this.isBacktracking = true;

        // 1. 停止当前打字机
        clearInterval(this.typingTimer);
        this.isTyping = false;

        // 2. 处理当前块：从“正在阅读”变为“待阅读”
        if (this.currentChunk) {
            // A. 把它放回"未来队列"的最前端，这样再次点击下一步时能看到它
            this.queue.unshift(this.currentChunk);

            // B. 【关键修复】从历史栈顶移除这个“当前块”
            // 因为 playNextChunk 播放时把 currentChunk 推入了 stack。
            // 如果不移除，下面 stack.pop() 拿到的还是 currentChunk，导致原地重播。
            if (this.historyStack.length > 0) {
                // 双重保险：只有当栈顶确实是 currentChunk 时才移除
                if (this.historyStack[this.historyStack.length - 1] === this.currentChunk) {
                    this.historyStack.pop();
                }
            }

            this.currentChunk = null;
        }

        // 3. 检查历史栈
 if (this.historyStack.length === 0) {
    // 历史栈为空,尝试加载更早的消息
    const success = await this.loadPreviousMessage();
    if (!success) {
        console.log('已到达历史记录起点');
        // 【关键修复】如果到头了,把刚才放回队列的 currentChunk 重新播放出来
        if (this.queue.length > 0) {
            const restoredChunk = this.queue.shift();
            this.currentChunk = restoredChunk;
            this.historyStack.push(restoredChunk); // 重新入栈
            this.renderChunkState(restoredChunk);
            this.finishTyping(); // 直接显示完整内容
        }
        this.isBacktracking = false;
        return;
    }
}
        // 4. 从历史栈中取出上一块
        // 此时栈顶就是我们要回退到的目标块
        const prevChunk = this.historyStack.pop();

        // 5. 隐藏选项层 (防止回退时选项还卡在屏幕上)
        this.toggleOptionsLayer(false);

        // 6. 播放上一块
        this.currentChunk = prevChunk;

        // 【关键修复】保持栈的一致性
        // 因为 prevChunk 现在变成了“当前正在阅读的块”，它应该留在栈顶。
        // 之前 pop 出来是为了获取它，现在要把它放回去，表示“它在当前屏幕上”。
        this.historyStack.push(prevChunk);

        // 渲染逻辑
        this.renderChunkState(prevChunk);

        this.isBacktracking = false;
    }

    // 新增：辅助方法，用于从 conversationHistory 加载上一条消息
      async loadPreviousMessage() {
        let referenceMsg = null;
        if (this.queue.length > 0) referenceMsg = this.queue[0].originalMsg;
        else if (this.currentChunk) referenceMsg = this.currentChunk.originalMsg;

        if (!referenceMsg) return false;

        const history = window.GameAPI.conversationHistory;
        let currentIndex = history.indexOf(referenceMsg);

        if (currentIndex <= 0) return false;

        // --- 修改：向前查找直到找到非 User 消息 ---
        let prevIndex = currentIndex - 1;
        while (prevIndex >= 0 && history[prevIndex].role === 'user') {
            prevIndex--;
        }

        if (prevIndex < 0) return false; // 找不到更早的 AI 消息了

        const prevMsg = history[prevIndex];
 
        const tempQueueBackup = [...this.queue];
        this.queue = []; // 临时清空

        // 调用拦截后的 createMessageBubble，它会调用 galManager.enqueueMessage 填充 this.queue
        await window.worldHelper.createMessageBubble(prevMsg, 'chat', true);

       

        const newChunks = [...this.queue];
        this.historyStack.push(...newChunks);

        // 恢复原来的队列
        this.queue = tempQueueBackup;

        return true;
    }
   renderChunkState(chunk) {
        // UI 重置
        this.ui.nextIndicator.classList.remove('active');
        this.ui.textContent.innerHTML = '';

        clearTimeout(this.autoTimer);

        // 传入 expression 参数
        this.updateSpeaker(chunk.name, chunk.expression);

    this.isTyping = true;
    this.currentText = chunk.text; // 这里的 text 包含 HTML 标签

    // 如果是跳过模式，直接显示全部
    if (this.isSkipping) {
        this.finishTyping();
        return;
    }

    // 如果是富文本内容（如短信、群聊界面），直接渲染，不使用打字机
    if (chunk.isRichContent) {
        this.ui.textContent.innerHTML = this.currentText;
        // 稍微延迟一点结束，让 DOM 有时间渲染，避免闪烁
        setTimeout(() => {
            this.finishTyping();
        }, 50);
        return;
    }

    // --- 以下是原有的打字机逻辑 ---

    // 解析 HTML 为 Token 数组
    const tokens = this.currentText.match(/<[^>]+>|[^<]/g) || [];

    let tokenIndex = 0;
    let currentHTML = '';

    clearInterval(this.typingTimer);

    this.typingTimer = setInterval(() => {
        if (tokenIndex < tokens.length) {
            const token = tokens[tokenIndex];
            currentHTML += token;
            this.ui.textContent.innerHTML = currentHTML;

            if (token.startsWith('<')) {
                tokenIndex++;
                while(tokenIndex < tokens.length && tokens[tokenIndex].startsWith('<')) {
                    currentHTML += tokens[tokenIndex];
                    this.ui.textContent.innerHTML = currentHTML;
                    tokenIndex++;
                }
            } else {
                tokenIndex++;
            }
        } else {
            this.finishTyping();
        }
    }, 30); // 打字速度
}

 
playNextChunk() {
  if (this.queue.length === 0) return;

        const chunk = this.queue.shift();
        this.currentChunk = chunk;

        // 播放时再次触发一下下载队列，确保如果之前卡住了能重新激活
        this.processAudioQueue();

        // 渲染文本
        if (chunk.isAttachmentDisplay) {
            this.currentAttachmentsContent = chunk.attachments.join('<br><hr><br>');
            this.showAttachmentModal(true);
        } else {
            this.renderChunkState(chunk);
        }

        // 【核心】音频播放逻辑
        if (this.ttsConfig.enabled) {
            if (chunk.audioBlob) {
                // 情况A：有音频 -> 打断上一句，播放新的
                try {
                    const url = URL.createObjectURL(chunk.audioBlob);
                    this.currentAudio.pause();
                    this.currentAudio.src = url;
                    this.currentAudio.currentTime = 0;
                    this.currentAudio.play().catch(e => {});
                } catch (e) { console.error(e); }
            } else {
                // 情况B：无音频 (没下载完 或 旁白) -> 【什么都不做】
                // 保持上一句的音频继续播放，直到它自然结束，或者遇到下一句有音频的块
                // console.log('[GalTTS] 保持背景/留白');
            }
        }

    this.historyStack.push(chunk);
 if (chunk.type === 'cg_event') {
        this.handleCGEvent(chunk.cgName);
        return; // 暂停播放，等待用户关闭 CG
    }
    // 【关键修改】根据 isAttachmentDisplay 标记决定行为
    if (chunk.isAttachmentDisplay) {
        // 如果是贴脸展示块，直接显示模态框
        this.currentAttachmentsContent = chunk.attachments.join('<br><hr><br>');
        this.showAttachmentModal(true); // 传入 true 表示是自动播放流程
    } else {
        // 否则，走正常的打字机渲染流程
        this.renderChunkState(chunk);
    }
}
  finishTyping() {
        clearInterval(this.typingTimer);
        this.ui.textContent.innerHTML = this.currentText;
        this.isTyping = false;

        // --- 修改：需求2 - 只有在最后一条消息的时候，才显示选项和停止下一步 ---
        // 判断条件：是当前消息的最后一块 && 有选项 && 是全局历史的最后一条消息
        if (this.currentChunk.isLast &&
            this.currentChunk.options &&
            this.currentChunk.options.length > 0 &&
            this.currentChunk.isRealLastMsg) { // <--- 关键判断

            this.renderOptions(this.currentChunk.options);
            // 选项出现时，自动播放暂停
        } else {
            // 如果不是最后一条，或者没有选项，显示下一步指示器，允许继续
            this.ui.nextIndicator.classList.add('active');

            // --- 处理自动播放 ---
            if (this.isAuto) {
                const readTime = Math.min(5000, Math.max(1000, this.currentText.length * 20));
                this.autoTimer = setTimeout(() => {
                    this.handleInteraction();
                }, readTime);
            }
        }
    }
  updateSpeaker(name, expression) {
            if (name && name !== '旁白' && name !== '系统') {
                this.ui.nameText.textContent = name;
                this.ui.nameTag.style.display = 'block';
                // 传递 expression 给 loadCG
                this.loadCG(name, expression);
            } else {
                this.ui.nameTag.style.display = 'none';
                // 旁白不清除立绘
            }
        }
   async loadCG(displayName, expression = null) {
            // 1. 获取数据源
            const assaData = (window.GameAPI && window.GameAPI.assaData) || window.assaSettingsData;
            const cgImg = this.ui.cgImg;

            // 2. 【关键修复】先检查数据源是否存在
            // 必须先确保 img_map 存在，才能进行后续的 ID 计算，否则会报 "reading '玄弥' of undefined"
            if (!assaData || !assaData.img_map) {
                // console.log('[Nova][CG-LOG] 数据源尚未准备好，跳过立绘加载。');
                this.activeCG = { name: null, imgId: null };
                cgImg.style.opacity = '0';
                return;
            }

            // 3. 计算资源 ID (此时已确保 img_map 存在，安全)
            // 获取基础映射 (例如 "玄弥" -> "xm")
            const baseMapId = displayName ? assaData.img_map[displayName] : null;

            // 如果这个角色在映射表中不存在，直接隐藏并返回
            if (!baseMapId) {
                // console.log(`[Nova][CG-LOG] 角色 '${displayName}' 未配置立绘映射。`);
                cgImg.style.opacity = '0';
                return;
            }

            // 构建最终 ID (处理差分)
            let finalImageId = baseMapId;
            if (baseMapId && expression) {
                finalImageId = `${baseMapId}-${expression}`;
            }
            const imageNameStr = finalImageId ? String(finalImageId) : null;

            // 4. 检查内存缓存
            // 确保缓存容器已初始化
            if (!this.processedImageCache) this.processedImageCache = {};

            if (imageNameStr && this.processedImageCache[imageNameStr]) {
                // 更新当前状态
                this.activeCG = { name: displayName, imgId: imageNameStr };
                console.log(`[Nova][CG-LOG] ⚡ 内存缓存命中: ${imageNameStr}`);

                // 直接使用缓存的 URL
                cgImg.src = this.processedImageCache[imageNameStr];
                cgImg.style.opacity = '1';
                return;
            }

            // 5. 检查是否需要重新加载 (防止重复请求同一张图)
            if (this.activeCG.name === displayName && this.activeCG.imgId === imageNameStr) {
                return;
            }

            // 6. 更新激活状态，准备开始异步加载
            this.activeCG = { name: displayName, imgId: imageNameStr };
            const currentRequest = { ...this.activeCG };

            console.log(`[Nova][CG-LOG] 请求加载: '${displayName}' (ID: ${imageNameStr})`);
            cgImg.style.opacity = '0'; // 加载期间先隐藏

            try {
                let imageBlob = null;

                // 7. 本地库检查 (CustomNpcs)
                if (window.imageDB) {
                    try {
                        imageBlob = await window.imageDB.get('CustomNpcs', imageNameStr);
                        if (imageBlob) console.log(`[Nova][CG-LOG] ✨ 本地库命中: ${imageNameStr}`);
                    } catch (e) { console.warn('[Nova][CG-LOG] 本地库读取异常', e); }
                }

                // 8. 远程资源获取
                if (!imageBlob) {
                    const remoteMap = window.GameAPI.npcImageMap;
                    if (remoteMap && remoteMap[imageNameStr]) {
                        const imageUrl = remoteMap[imageNameStr];

                        // 8.1 远程缓存检查
                        if (window.imageDB) {
                            try {
                                imageBlob = await window.imageDB.get('RemoteCache', imageUrl);
                            } catch (e) {}
                        }

                        // 8.2 下载
                        if (!imageBlob) {
                            const res = await fetch(imageUrl);
                            if (res.ok) {
                                const originalBlob = await res.blob();
                                imageBlob = new Blob([originalBlob], { type: 'image/png' });
                                if (window.imageDB) {
                                    await window.imageDB.set('RemoteCache', imageUrl, imageBlob);
                                }
                            }
                        }
                    }
                }

                // 9. 图片处理 (去白边/像素化) 并存入内存缓存
                if (imageBlob) {
                    const reader = new FileReader();
                    reader.readAsDataURL(imageBlob);
                    reader.onloadend = async () => {
                        // 检查请求是否已过期 (用户可能点得很快，已经切到下一句了)
                        if (this.activeCG.name !== currentRequest.name || this.activeCG.imgId !== currentRequest.imgId) {
                            return;
                        }

                        const stableImageUrl = reader.result;
                        try {
                            const targetH = window.innerHeight * 0.85;
                            // 调用去白边/像素化处理
                            const finalUrl = window.createPixelatedCharaImage
                                ? await window.createPixelatedCharaImage(stableImageUrl, targetH, 1, false)
                                : stableImageUrl;

                            // 处理完成后，存入内存缓存
                            if (imageNameStr) {
                                this.processedImageCache[imageNameStr] = finalUrl;
                            }

                            cgImg.src = finalUrl;
                            cgImg.onload = () => {
                                cgImg.style.opacity = '1';
                            };
                        } catch (pixelError) {
                            console.error(`[Nova][CG-LOG] 图片处理失败:`, pixelError);
                            cgImg.src = stableImageUrl;
                            cgImg.style.opacity = '1';
                        }
                    };
                } else {
                    // 没找到图片，保持隐藏
                }

            } catch (error) {
                console.error(`[Nova][CG-LOG] 加载立绘异常:`, error);
            }
        }
 
        // --- 选项渲染 (移植逻辑) ---
        renderOptions(options) {
            const container = this.ui.optionsLayer;
            container.innerHTML = '';
            const tagRegex = /\[([^\]]+)\]/g;

            options.forEach(optionText => {
                if (typeof optionText !== 'string') optionText = optionText.label || JSON.stringify(optionText);
                if (!optionText.trim()) return;

                const card = document.createElement('div');
                card.className = 'mod14-choice-card';

                // 解析标签
                const tags = [];
                let match;
                while ((match = tagRegex.exec(optionText)) !== null) tags.push(match[1].trim());
                const descriptionText = optionText.replace(tagRegex, '').replace(/^\s*\d+\.\s*/, '').trim();

                // 构建 DOM
                const tagsDiv = document.createElement('div');
                tagsDiv.className = 'tags-container';
                tags.forEach(t => {
                    const span = document.createElement('span');
                    span.className = 'tag';
                    span.textContent = t;
                    tagsDiv.appendChild(span);
                });

                const descP = document.createElement('p');
                descP.className = 'description';
                descP.innerHTML = descriptionText;

                card.appendChild(tagsDiv);
                card.appendChild(descP);

                // 交互逻辑 (长按/点击)
                let pressTimer;
                let isLongPress = false;

     const startPress = () => {
                    if (card.classList.contains('disabled')) return;
                    isLongPress = false;
                    pressTimer = setTimeout(() => {
                        isLongPress = true;
                        card.classList.add('long-press-fired');

                        // 【修改点】长按置入的指令也需要包含标签信息
                        // 我们构建完整指令，然后移除 /send 部分
                        const fullCommand = this.buildFullCommand(descriptionText, tags);
                        const setInputCommand = fullCommand.replace('/send ', '/setinput ');

                        this.executeChoice(setInputCommand, card, '[ 指令已置入 ]', true);
                        setTimeout(() => card.classList.remove('long-press-fired'), 100);
                    }, 500);
                };
                const endPress = () => clearTimeout(pressTimer);

                card.onmousedown = startPress; card.onmouseup = endPress; card.onmouseleave = endPress;
                card.ontouchstart = startPress; card.ontouchend = endPress;

      card.onclick = () => {
                    if (isLongPress || card.classList.contains('disabled')) return;

                    // 第一次点击聚焦，第二次发送
                    if (card.classList.contains('focused')) {
                        // 【修改点】调用 buildFullCommand 来构建完整指令
                        const fullCommand = this.buildFullCommand(descriptionText, tags);
                        this.executeChoice(fullCommand, card, '已抉择');
                    } else {
                        container.querySelectorAll('.focused').forEach(c => c.classList.remove('focused'));
                        card.classList.add('focused');
                    }
                };

                container.appendChild(card);
            });

             this.toggleOptionsLayer(true);
            this.ui.nextIndicator.classList.remove('active');
        }

        executeChoice(cmd, card, successText, keepUi = false) {
            if (window.GameAPI && window.GameAPI.triggerassa) {
                window.GameAPI.triggerassa(cmd);
            } else {
                console.log('[Galgame] Send:', cmd);
            }
            card.querySelector('.description').textContent = successText;
            if (!keepUi) {
        this.toggleOptionsLayer(false);
            }
        }
 // showAttachmentModal
          showAttachmentModal(isAutoPlayFlow = false) {
            if (!this.currentAttachmentsContent || !this.ui || !this.ui.modal) return;

            this.isShowingModal = true;
 this.toggleOptionsLayer(false);
            // 使用 dataset 传递状态，而不是在闭包里
            this.ui.modal.dataset.isAutoPlayFlow = isAutoPlayFlow;

            const container = this.ui.iframeContainer;
            container.innerHTML = ''; // 清空旧内容

            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.background = 'transparent';

           iframe.srcdoc = `
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    /* 滚动条样式优化 */
                    ::-webkit-scrollbar { width: 6px; }
                    ::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); }
                    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 3px; }

                    body {
                        margin: 0;
                        padding: 0;
                        width: 100vw;
                        height: 100vh;
                        overflow: hidden;
                        background: transparent;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: relative; /* 确保关闭按钮绝对定位相对于 body */
                    }

                    /* --- 新增：右上角关闭按钮样式 --- */
                    .mod14-internal-close {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        width: 40px;
                        height: 40px;
                        background: rgba(0, 0, 0, 0.5);
                        border: 2px solid rgba(255, 255, 255, 0.6);
                        border-radius: 50%;
                        color: #fff;
                        font-family: sans-serif;
                        font-size: 24px;
                        line-height: 36px; /* 垂直居中微调 */
                        text-align: center;
                        cursor: pointer;
                        z-index: 10000;
                        transition: all 0.2s ease;
                        user-select: none;
                        backdrop-filter: blur(4px);
                    }
                    .mod14-internal-close:hover {
                        background: rgba(200, 50, 50, 0.8);
                        border-color: #fff;
                        transform: scale(1.1);
                        box-shadow: 0 0 10px rgba(255,0,0,0.5);
                    }

                    /* CG 图片样式注入 */
                    .mod14-cg-display-img {
                        display: block;
                        max-width: 100%;
                        max-height: 100%;
                        width: auto;
                        height: auto;
                        object-fit: contain;
                        min-width: 200px;
                        min-height: 200px;
                        box-shadow: 0 0 20px rgba(0,0,0,0.8);
                        border-radius: 4px;
                    }

                    /* 非 CG 内容的样式兼容 */
                    body > *:not(div) { padding: 20px; color: #fff; }
                  </style>
                </head>
                <body>
                    <!-- 新增：关闭按钮 -->
                    <div class="mod14-internal-close" onclick="window.parent.galManager.closeAttachmentModal()">×</div>

                    <!-- 内容区域 -->
                    ${this.currentAttachmentsContent}
                </body>
                </html>
            `;
            container.appendChild(iframe);

              // 重置动画并显示
            this.ui.modal.style.animation = 'none';
            this.ui.modal.offsetHeight; /* trigger reflow */
            this.ui.modal.style.animation = 'mod14-fade-in 0.3s ease-out forwards';
            this.ui.modal.style.display = 'flex';
        }
  
    }

    // ============================================================
    // 3. 拦截 createMessageBubble
    // ============================================================
      let galManager = null;
window.GameAPI.displayEventTag =  function(){

    console.log("拦截了事件展示desu");
}
 window.worldHelper.createMessageBubble = async function(msg, mode = 'chat', is_from_render = false) {
        if (!galManager) {
            galManager = new GalgameManager();
            window.galManager = galManager; // <--- 关键修复：让 iframe 能通过 window.parent.galManager 访问到它
        }
    
    if (!galManager.ui && !document.querySelector('.mod14-stage-wrapper')) {
        galManager.initUI();
        // galManager.syncTheme();
    }

    let hookData = { message: msg };
    if (window.NovaHooks) hookData = await NovaHooks.trigger('before_message_render', hookData);

    // 1. 获取原始文本
    let rawContent = String(hookData.message.content || '');

    // 2. 提取 <options>
    let extractedOptions = [];
    const optRegex = /<options>((?:(?!<options>)[\s\S])*?)<\/options>/gs;
    rawContent = rawContent.replace(optRegex, (match, optContent) => {
        const trimmedOpt = optContent.trim();
        if (trimmedOpt.startsWith('[') || trimmedOpt.startsWith('{')) {
            try { extractedOptions = JSON.parse(trimmedOpt); }
            catch(e) { extractedOptions = galManager.parseRawOptions(trimmedOpt); }
        } else {
            extractedOptions = galManager.parseRawOptions(trimmedOpt);
        }
        return '';
    });

    // 3. 移除其他无关的顶层标签
    rawContent = rawContent
        .replace(/<loc&time>[\s\S]*?<\/loc&time>/gs, '')
        .replace(/<battle>[\s\S]*?<\/battle>/gs, '')
        .replace(/<battle_log>[\s\S]*?<\/battle_log>/gs, '')
        .replace(/<forum_threads>[\s\S]*?<\/forum_threads>/gs, '')
        .replace(/<shop_item>[\s\S]*?<\/shop_item>/gs, '')
        .replace(/<表现总结>[\s\S]*?<\/表现总结>/gs, '');

    const htmlProtectionMap = {};
    let htmlProtIndex = 0;
   rawContent = rawContent.replace(/<html>[\s\S]*?<\/html>|<details[\s\S]*?<\/details>/gi, (match) => {
        const key = `###HTML_PROTECTED_BLOCK_${htmlProtIndex++}###`;
        htmlProtectionMap[key] = match;
        return key;
    });
            // 步骤1：提前处理引号、Markdown 并进行通用格式化
  rawContent = rawContent.replace(/<html>[\s\S]*?<\/html>|“/g, function(match) {
    if (match.startsWith('<html>')) return match;
    return '<span class="dialogue-quote">“';
})
.replace(/<html>[\s\S]*?<\/html>|”/g, function(match) {
    if (match.startsWith('<html>')) return match;
    return '”</span>';
})
.replace(/<html>[\s\S]*?<\/html>|「/g, function(match) {
    if (match.startsWith('<html>')) return match;
    return '<span class="dialogue-quote">「';
})
.replace(/<html>[\s\S]*?<\/html>|」/g, function(match) {
    if (match.startsWith('<html>')) return match;
    return '」</span>';
})
.replace(/<html>[\s\S]*?<\/html>|\*\*(.+?)\*\*/g, function(match, p1) {
    if (match.startsWith('<html>')) return match;
    return '<strong>' + p1 + '</strong>';
})
.replace(/<html>[\s\S]*?<\/html>|\*(.+?)\*/g, function(match, p1) {
    if (match.startsWith('<html>')) return match;
    return '<em>' + p1 + '</em>';
});

    rawContent = formatAsTavernRegexedString(
        rawContent,
        'ai_output',
        'display',
        { depth: -1 } // 阅读模式固定深度为 -1
    );
        let renderHookData = {
        content: rawContent,
        
    };
    renderHookData = await NovaHooks.trigger('before_final_render', renderHookData);
    rawContent = renderHookData.content;
    for (const key in htmlProtectionMap) {
        rawContent = rawContent.replace(key, htmlProtectionMap[key]);
    }

    // 4. 将格式化后的内容和选项交给 Manager 处理
    // 注意：这里不再需要 formatAsTavernRegexedString 和各种 replace，因为这些都在 enqueueMessage 内部处理了
    galManager.enqueueMessage(msg, rawContent, extractedOptions);

    // 5. 返回一个空的、不可见的元素，以欺骗原始调用流程
    const dummy = document.createElement('div');
    dummy.className = 'mod14-dummy-bubble';
    dummy.style.display = 'none';
    return dummy;
};

    console.log('[Nova] Mod14 Galgame Engine (Refined) Loaded.');

        // ============================================================
    // 4. 拦截核心渲染函数 (新增部分)
    // ============================================================
    // 保存原始函数引用
    const originalRenderHistory = window.worldHelper.renderHistory;

   window.worldHelper.renderHistory = async function(is_entry = false) {
        console.log("[Galgame] 拦截 renderHistory，正在保护舞台状态...");

        const chatArea = document.getElementById('chat-display-area');
        const stage = document.querySelector('.mod14-stage-wrapper');

        // A. 暂存舞台 (防止被清空)
        if (stage && chatArea && chatArea.contains(stage)) {
            stage.remove();
        }

        // B. 【核心修改】快照当前状态
        if (galManager) {
            galManager.isBulkRendering = true;      // 开启重绘模式
            galManager.hasReachedCurrentMsg = false; // 重置“是否遇到当前消息”的标记

            // 记录当前正在读的块 (如果存在)
            if (galManager.currentChunk) {
                galManager.savedState = {
                    originalMsg: galManager.currentChunk.originalMsg, // 哪条消息
                    text: galManager.currentChunk.text,               // 哪段文字
                    // 如果是最后一块且有选项，记录一下，恢复时可能需要重新触发选项渲染
                    wasLast: galManager.currentChunk.isLast
                };
            } else {
                galManager.savedState = null;
            }

            galManager.queue = []; // 清空队列，准备重新接收(经过筛选的)数据
        }

        // C. 执行原逻辑 (这会触发大量的 enqueueMessage)
        if (originalRenderHistory) {
            await originalRenderHistory.apply(this, arguments);
        }

        // D. 恢复舞台
        if (chatArea) {
            if (stage) {
                chatArea.appendChild(stage);
            } else if (galManager) {
                galManager.initUI();
                // galManager.syncTheme();
            }
        }

        // E. 【核心修改】恢复阅读进度
        if (galManager) {
            galManager.isBulkRendering = false; // 关闭重绘模式

            if (galManager.savedState) {
                // 在新生成的队列中，寻找内容匹配的块
                // 因为我们之前过滤了旧消息，所以队列里现在装的应该是 [当前消息的重绘版, 未来消息...]
                const matchIndex = galManager.queue.findIndex(c =>
                    c.originalMsg === galManager.savedState.originalMsg &&
                    c.text === galManager.savedState.text
                );

                if (matchIndex !== -1) {
                    // 找到了！
                    // 1. 把匹配块之前的块都扔掉（因为它们是当前消息中已经读过的部分）
                    // 注意：这里我们不把它们加回 historyStack，避免回溯时重复
                    galManager.queue.splice(0, matchIndex);

                    // 2. 取出这个块作为当前块
                    const restoredChunk = galManager.queue.shift();
                    galManager.currentChunk = restoredChunk;

                    // 3. 重新渲染它 (无打字机效果，瞬间显示)
                    // 这样如果新版消息加了HTML/选项，这里也会包含在 restoredChunk 里
                    galManager.renderChunkState(restoredChunk);
                    galManager.finishTyping(); // 强制结束打字，直接显示全文

                    console.log("[Galgame] 成功恢复阅读进度。");
                } else {
                    // 没找到完全匹配的（可能是文本被修改了），退而求其次
                    // 播放队列里的第一个块（也就是当前消息的开头）
                    console.log("[Galgame] 未找到精确匹配的块，重置到当前消息开头。");
                    if (galManager.queue.length > 0) {
                        galManager.playNextChunk();
                    }
                }
            } else {
                // 如果之前没在读任何东西，就尝试播放新的
                if (galManager.queue.length > 0) {
                    galManager.playNextChunk();
                }
            }
        }
    };

 

     // 保存原始函数引用
    const originalRenderNewMessages = window.renderNewMessages;

    // 覆盖 renderNewMessages
    window.renderNewMessages = async function(newMessages) {
        console.log("[Galgame] 拦截 renderNewMessages...");
    if (galManager) {
        // 使用 setTimeout 0 将其放入宏任务队列，避免阻塞当前的渲染主线程
        setTimeout(() => {
            console.log("[Galgame] 触发后台差分扫描...");
            galManager.scanAndSyncExpressions();
        }, 0);
    }
          if (galManager && galManager.ui && galManager.ui.optionsLayer) {
            galManager.toggleOptionsLayer(false);
        }

        const chatArea = document.getElementById('chat-display-area');
        //  在原函数执行前，先获取舞台引用
        // 如果这时候去取，它还在 DOM 里，或者是 galManager.ui.stage
        let stage = document.querySelector('.mod14-stage-wrapper');

        // 如果 DOM 里找不到，但 Manager 里有，就用 Manager 里的（防止意外丢失）
        if (!stage && galManager && galManager.ui) {
            stage = galManager.ui.stage;
        }

        //  保护现场：先把舞台从 DOM 拿出来
        // 这样原函数操作 DOM 时（比如清空或重排）就不会伤害到舞台元素
        if (stage && chatArea && chatArea.contains(stage)) {
            stage.remove();
        }

        
        if (originalRenderNewMessages) {
            await originalRenderNewMessages.apply(this, arguments);
        }

        //  恢复现场：把舞台放回去 (放在最上面)
        if (chatArea && stage) {
            chatArea.appendChild(stage);
        }
    };
 

    //单独美化

      // 监听最终渲染前的钩子
    window.NovaHooks.add('before_final_render', function(hookData) {
        if (!hookData?.content) return hookData;

        let content = hookData.content;
        const heartRegex = /<heart>([\s\S]*?)<\/heart>/g;
        const matches = [...content.matchAll(heartRegex)];

        if (matches.length > 0) {
            const lastMatch = matches[matches.length - 1];
            const rawContent = lastMatch[1].trim();
            const fullMatch = lastMatch[0];

            // --- 解析内容 ---
            const lines = rawContent.split('\n');
            let timeStr = "";
            let charStr = "";
            let bodyStr = "";

            if (lines.length >= 1) timeStr = lines[0].trim();
            if (lines.length >= 2) charStr = lines[1].trim();
            if (lines.length > 2) bodyStr = lines.slice(2).join('\n').trim();

            // 容错处理
            if (!charStr && !bodyStr) {
                bodyStr = timeStr;
                timeStr = "Unknown Time";
                charStr = "Mystery";
            }

            const uniqueId = 'letter-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

            // --- 构建 HTML ---
            const beautifiedHtml = `<html>
<head>
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Ma+Shan+Zheng&family=Long+Cang&display=swap" rel="stylesheet">
    <style>
        :root {
            --env-color: #f3e6d3;
            --env-shadow: #dccab0;
            --paper-color: #fffdf7;
            --text-color: #2c2218;
        }

        body {
            margin: 0;
            padding: 10px;
            font-family: sans-serif;
            background: transparent;
            /* 允许滚动，防止内容被截断 */
            overflow-y: auto;
            overflow-x: hidden;
        }

        /* 容器 */
        .letter-container {
            position: relative;
            width: 100%;
            max-width: 550px;
            margin: 40px auto;
            perspective: 1000px;
            /* 初始高度适应信封，打开后由JS或内容撑开 */
            min-height: 300px;
            transition: all 0.5s ease;
        }

        /* 信封外壳 */
        .envelope {
            position: relative;
            width: 100%;
            height: 280px;
            background: transparent; /* 背景透明，由部件组成 */
            transform: rotate(-3deg); /* 初始倾斜 */
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            z-index: 10;
            user-select: none;
        }

        .envelope:hover {
            transform: rotate(-1deg) scale(1.01);
        }

        /* 打开状态：信封扶正 */
        .letter-container.open .envelope {
            transform: rotate(0deg);
            cursor: default;
        }

        /* 信封各个部件 */
        .env-part {
            position: absolute;
            transition: all 0.5s ease;
        }

        /* 信封背景 */
        .env-bg {
            top: 0; left: 0; width: 100%; height: 100%;
            background: var(--env-color);
            border-radius: 6px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1;
        }

        /* 底部盖子 */
        .flap-bottom {
            bottom: 0; left: 0; width: 100%; height: 60%;
            background: #e6d5be;
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
            z-index: 20;
        }

        /* 左右盖子 */
        .flap-side-left {
            top: 0; left: 0; width: 50%; height: 100%;
            background: #ebdcc8;
            clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            z-index: 19;
        }
        .flap-side-right {
            top: 0; right: 0; width: 50%; height: 100%;
            background: #ebdcc8;
            clip-path: polygon(100% 0%, 0% 50%, 100% 100%);
            z-index: 19;
        }

        /* 顶部盖子 (活动的) */
        .flap-top {
            top: 0; left: 0; width: 100%; height: 55%;
            background: var(--env-color);
            clip-path: polygon(0% 0%, 50% 100%, 100% 0%);
            transform-origin: top;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 21;
            filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
        }

        /* 打开时：顶部盖子翻开 */
        .letter-container.open .flap-top {
            transform: rotateX(180deg);
            z-index: 1; /* 翻到后面去 */
        }

        /* 打开时：其他信封部件变淡并下移，让位给信纸 */
        .letter-container.open .env-bg,
        .letter-container.open .flap-bottom,
        .letter-container.open .flap-side-left,
        .letter-container.open .flap-side-right {
            opacity: 0.4; /* 变淡而不是完全消失 */
            transform: translateY(50px);
            pointer-events: none;
        }

        /* 火漆印章 */
        .wax-seal {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -20%);
            width: 55px; height: 55px;
            background: radial-gradient(circle at 30% 30%, #c0392b, #922b21);
            border-radius: 50%;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            z-index: 30;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255,255,255,0.9);
            font-family: serif;
            font-size: 28px;
            border: 2px dashed rgba(0,0,0,0.15);
            transition: all 0.3s ease;
        }

        .letter-container.open .wax-seal {
            opacity: 0;
            transform: translate(-50%, -20%) scale(1.5);
            pointer-events: none;
        }

        /* --- 信纸 --- */
        .paper {
            position: absolute;
            top: 10px; left: 5%;
            width: 90%;
            height: 90%; /* 初始高度 */
            background: var(--paper-color);
            padding: 25px 30px;
            box-sizing: border-box;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 5; /* 初始在信封内部 */
            opacity: 0; /* 初始不可见，或者微露 */
            transform: translateY(20px);

            /* 纹理 */
            background-image: repeating-linear-gradient(var(--paper-color) 0px, var(--paper-color) 28px, #e8e8e8 29px);
            line-height: 29px;
            overflow: hidden;
        }

        /* 信纸打开状态 */
        .letter-container.open .paper {
            position: relative; /* 关键：变为相对定位，撑开父容器高度 */
            top: 0; left: 0;
            width: 100%;
            height: auto; /* 高度自适应内容 */
            min-height: 400px;
            opacity: 1;
            transform: translateY(-20px); /* 稍微向上浮出 */
            z-index: 100; /* 覆盖在一切之上 */
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            border-radius: 2px;
        }

        .paper-content {
            font-family: 'Long Cang', 'Ma Shan Zheng', 'Caveat', cursive;
            color: var(--text-color);
            font-size: 19px;
            white-space: pre-wrap;
            word-wrap: break-word;
            position: relative;
            z-index: 2;
        }

        .paper-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 8px;
            margin-bottom: 20px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            color: #8a7f75;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .paper-footer {
            margin-top: 40px;
            text-align: right;
            font-family: 'Caveat', cursive;
            font-size: 24px;
            color: #5d4037;
        }

        /* 邮戳 */
        .stamp {
            position: absolute;
            bottom: 30px; right: 20px;
            width: 90px; height: 90px;
            border: 3px double rgba(192, 57, 43, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(-20deg);
            color: rgba(192, 57, 43, 0.3);
            font-weight: bold;
            font-size: 14px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 1s 0.5s;
        }
        .letter-container.open .stamp { opacity: 1; }

        /* 深色模式适配 */
        @media (prefers-color-scheme: dark) {
            :root {
                --env-color: #3e3b36;
                --paper-color: #e6dfd3; /* 稍微暗一点的纸色，保护眼睛 */
                --text-color: #1a1a1a;
            }
            .paper {
                background-image: repeating-linear-gradient(var(--paper-color) 0px, var(--paper-color) 28px, #d1c8ba 29px);
            }
        }
    </style>
</head>
<body>

    <div class="letter-container" id="${uniqueId}">
        <!-- 信封整体 -->
        <div class="envelope" onclick="openLetter('${uniqueId}')">

            <!-- 信封部件 -->
            <div class="env-part env-bg"></div>
            <div class="env-part flap-side-left"></div>
            <div class="env-part flap-side-right"></div>
            <div class="env-part flap-bottom"></div>

            <!-- 信纸 (初始在信封内) -->
            <div class="paper">
                <div class="paper-header">
                    <span>${timeStr}</span>
                    <span>FROM: ${charStr}</span>
                </div>
                <div class="paper-content">${bodyStr}</div>
                <div class="paper-footer">
                    Yours,<br>${charStr}
                </div>
                <div class="stamp">CONFIDENTIAL</div>
            </div>

            <!-- 顶部盖子和火漆 -->
            <div class="env-part flap-top"></div>
            <div class="wax-seal">❤</div>
        </div>
    </div>

    <script>
        function openLetter(id) {
            const container = document.getElementById(id);
            if (container && !container.classList.contains('open')) {
                container.classList.add('open');

                // 简单的音效模拟或震动（如果支持）
                if (navigator.vibrate) navigator.vibrate(20);
            }
        }
    </script>
</body>
</html>`;

            // 替换内容
            const lastIndex = content.lastIndexOf(fullMatch);
            content = content.substring(0, lastIndex) +
                     beautifiedHtml +
                     content.substring(lastIndex + fullMatch.length);

            hookData.content = content;
        }
        return hookData;
    });
})();
 
})();
