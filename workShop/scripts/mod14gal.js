 
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
 

  
    
})();
 