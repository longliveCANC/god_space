 
 

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
            const ignoreKeys = ['外貌', '好感度', '未定字段', '_is_protected', '_filter', '性别', '年龄', 'hp','game批注'];


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

            // ★ 妈妈的重点修改：在数据转换时就过滤掉 _ 开头的
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
                    const specialKeys = ['quality', 'type', 'num'];

                    Object.entries(item.data).forEach(([key, value]) => {
                         // ★ 妈妈的重点修改：再次确认过滤 _ 字段
                         if (key.startsWith('_') || specialKeys.includes(key)) return;
                        const label = this.KEY_MAP[key] || key;
                        detailsHtml += `
                            <div class="mod01-item-detail-row">
                                <span class="mod01-item-detail-label">${label}:</span>
                                <span class="mod01-item-detail-value">${value}</span>
                            </div>
                        `;
                    });

                    // ★ 妈妈的重点修改：调整了HTML结构，让种类紧跟名字
                    card.innerHTML = `
                        <div class="mod01-item-card-header">
                            <span class="mod01-item-card-title">${item.name}</span>
                            ${item.data.type ? `<span class="mod01-item-card-type-tag">${item.data.type}</span>` : ''}
                            ${item.data.quality ? `<span class="mod01-item-card-quality">${item.data.quality}</span>` : ''}
                        </div>
                        <div class="mod01-item-card-details">${detailsHtml}</div>
                        ${item.data.num ? `<div class="mod01-item-card-count">x${item.data.num}</div>` : ''}
                    `;
                    grid.appendChild(card);
                });
            };

            // 分页控制器逻辑 (这部分保持不变)
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

                    // 键名
                    let keyHtml = `<span style="color:var(--secondary-color); font-weight:bold; margin-right:5px;">${key}:</span>`;
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
    console.log("Nova: v2.0 系统已挂载。尽情创造吧，我的孩子。");

})();
