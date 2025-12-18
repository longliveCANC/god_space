 
 

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
            // 启动时应用一次主题
            this.syncTheme();
            // 监听窗口点击，如果用户在设置页改了主题并保存到localStorage，我们需要感知（由于同域下storage事件不触发当前tab，我们用setInterval轮询更稳）
            setInterval(() => this.syncTheme(), 1500);
        }

        // ============ 主题引擎 ============
        syncTheme() {
            // 确保 GameAPI 可用
            if (!window.GameAPI || typeof window.GameAPI.getThemeVar !== 'function') return;

            // 获取动态颜色，如果获取失败则使用默认兜底色
            const currentTheme = {
                '--primary-color': window.GameAPI.getThemeVar('--primary-color') || '#00faff',
                '--secondary-color': window.GameAPI.getThemeVar('--secondary-color') || '#7affff',
                '--text-color': window.GameAPI.getThemeVar('--text-color') || '#e6f1ff',
                '--text-secondary-color': window.GameAPI.getThemeVar('--text-secondary-color') || '#a8c0e1',
                '--container-bg-color': window.GameAPI.getThemeVar('--container-bg-color') || 'rgba(10, 25, 47, 0.85)',
                '--border-color': window.GameAPI.getThemeVar('--border-color') || 'rgba(0, 250, 255, 0.3)',
                '--glow-color': window.GameAPI.getThemeVar('--glow-color') || 'rgba(0, 250, 255, 0.5)',
                '--background-color': window.GameAPI.getThemeVar('--background-color') || '#0a192f'
            };

            // 应用样式到各个独立容器
            const applyTo = (element) => {
                if (!element) return;
                Object.entries(currentTheme).forEach(([key, val]) => {
                    element.style.setProperty(key, val);
                });
            };

            // 1. 应用到主窗口
            applyTo(this.container);

            // 2. 应用到悬浮球
            applyTo(this.floater);

            // 3. 应用到记忆回廊 (因为它是独立的 DOM 节点)
            if (this.memoryGallery && this.memoryGallery.panel) {
                applyTo(this.memoryGallery.panel);
            }
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

            // 4. 主界面 (保持原有结构)
            this.container = document.createElement('div');
            this.container.className = 'mod01-overlay';
            this.container.innerHTML = `
                <div class="mod01-window">
                    <div class="mod01-header">
                        <div class="mod01-title">CHARACTER ARCHIVES</div>

                        <div style="display:flex; gap:15px;">
                             <div class="mod01-mem-toggle" style="cursor:pointer; opacity:0.7; font-size:12px;">[ENTER GALLERY]</div>
                             <div class="mod01-close">[CLOSE]</div>
                        </div>
                    </div>
                    <div class="mod01-body">
                        <div class="mod01-sidebar" id="mod01-list-root"></div>
                        <div class="mod01-detail" id="mod01-detail-root"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(this.container);

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
            if(data.外貌) basicInfo.innerHTML += `<div class="mod01-desc-box">${data.外貌}</div>`;
            else basicInfo.innerHTML += `<div class="mod01-desc-box">...</div>`;
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
                this.renderMemoriesPaged(root, data.关键记忆);
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
            // 3. 其他字段 (行为链、目标等)
            const ignores = ['当前想法', '当前状态',"想法","人物状态"];
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
 
         // --- 修改 3：记忆分页 (顶部 + 极速跳转) ---
        renderMemoriesPaged(container, memObj) {
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

            // 容器 (Memory Items)
            const cloud = document.createElement('div');
            cloud.className = 'mod01-mem-cloud';
            cloud.style.minHeight = "120px";

            // 控制器容器 (放在上面！)
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

            // 渲染列表 Action
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
                    chip.innerHTML = `<span style="opacity:0.5;font-size:10px;margin-right:4px;">#${item.id}</span> ${content} ${tagsHtml}`;

                    // 动画
                    chip.animate([{opacity:0, paddingLeft:'10px'}, {opacity:1, paddingLeft:'12px'}], {duration: 250});
                    cloud.appendChild(chip);
                });
            };

            // 组装顺序：先放控制器(如果有多页)，再放内容容器
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

            // Init
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
            // 1. 查找或创建立绘容器 (挂载在 mod01-body 下，而不是 detail 下，以实现固定效果)
            const bodyEl = this.container.querySelector('.mod01-body');
            let cgContainer = bodyEl.querySelector('.mod01-cg-container');

            // 如果不存在则创建
            if (!cgContainer) {
                cgContainer = document.createElement('div');
                cgContainer.className = 'mod01-cg-container';
                cgContainer.innerHTML = '<img class="mod01-cg-image" src="" />';
                // 插入到 sidebar 后面，detail 前面 (或者直接 append，CSS z-index 会控制层级)
                bodyEl.appendChild(cgContainer);
            }

            const cgImg = cgContainer.querySelector('.mod01-cg-image');

            // 切换角色时先隐藏，避免闪烁旧图
            cgContainer.style.opacity = '0';

            // 获取数据源 (兼容 window.GameAPI.assaData)
            const assaData = window.GameAPI ? window.GameAPI.assaData : null;
            const imgMap = assaData ? assaData.img_map : null;
            // 远程映射表通常在 window.npcImageMap
            const remoteMap = window.npcImageMap || {};

            if (!imgMap || !imgMap[displayName]) {
                console.log(`[Nova] 未找到 ${displayName} 的立绘映射`);
                return;
            }

            const imageNameStr = String(imgMap[displayName]);
            let imageBlob = null;

            try {
                // 1. 查本地库
                if (window.imageDB) {
                    imageBlob = await window.imageDB.get('CustomNpcs', imageNameStr);
                }

                // 2. 查远程
                if (!imageBlob) {
                    const imageUrl = remoteMap[imageNameStr];
                    if (imageUrl) {
                        // 查远程缓存
                        if (window.imageDB) {
                            imageBlob = await window.imageDB.get('RemoteCache', imageUrl);
                        }
                        // 下载
                        if (!imageBlob) {
                            const res = await fetch(imageUrl);
                            if (res.ok) {
                                const blob = await res.blob();
                                imageBlob = new Blob([blob], { type: 'image/png' });
                                if (window.imageDB) {
                                    await window.imageDB.set('RemoteCache', imageUrl, imageBlob);
                                }
                            }
                        }
                    }
                }

                if (imageBlob) {
                    // Blob 转 DataURL
                    const reader = new FileReader();
                    reader.readAsDataURL(imageBlob);
                    reader.onloadend = async () => {
                        const rawUrl = reader.result;

                        // 调用去背魔法 (enablePixelation = false 表示不像素化，只去背)
                        // targetHeight 设为窗口高度的 80% 左右
                        const targetH = window.innerHeight * 0.85;

                        try {
                            // 确保 createPixelatedCharaImage 已定义
                            if (window.createPixelatedCharaImage) {
                                // 参数: url, height, pixelSize(忽略), enablePixelation(false)
                                const processedUrl = await window.createPixelatedCharaImage(rawUrl, targetH, 1, false);
                                cgImg.src = processedUrl;
                            } else {
                                cgImg.src = rawUrl; // 降级
                            }

                            // 图片加载完成后显示
                            cgImg.onload = () => {
                                cgContainer.style.opacity = '1';
                            };
                        } catch (e) {
                            console.error("立绘处理失败", e);
                            cgImg.src = rawUrl;
                            cgContainer.style.opacity = '1';
                        }
                    };
                }

            } catch (e) {
                console.error("[Nova] 立绘加载流程异常", e);
            }
        }
    }

    // 启动系统
    window.novaNpcSystemv2 = new NovaNPCSystemV2();
    console.log("Nova: v2.0 系统已挂载。尽情创造吧，我的孩子。");

})();
