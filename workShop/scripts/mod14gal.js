 
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

            /* --- 选项层 (垂直滚动) --- */
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
                pointer-events: auto;
                /* 隐藏滚动条但允许滚动 */
                scrollbar-width: none;

                     animation: mod14-slide-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .mod14-options-layer::-webkit-scrollbar { display: none; }

            /* --- 选项卡片样式 (移植自你的代码) --- */
            .mod14-choice-card {
                background: var(--mod14-container-bg-color, rgba(10, 25, 47, 0.9));
                border: 1px solid var(--mod14-border-color, #00faff);
                color: var(--mod14-text-color, #e6f1ff);
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
                background: var(--mod14-primary-color, #00faff);
                color: #000;
                transform: scale(1.02);
                box-shadow: 0 0 15px var(--mod14-glow-color, rgba(0, 250, 255, 0.5));
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
                background: var(--mod14-container-bg-color, rgba(10, 25, 47, 0.85));
                border: 1px solid var(--mod14-border-color, rgba(0, 250, 255, 0.3));
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
                background: var(--mod14-primary-color, #00faff);
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
                color: var(--mod14-text-color, #e6f1ff);
                white-space: pre-wrap;
                flex-grow: 1;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
                overflow-y: auto;
            }

            /* --- 功能按钮区 --- */

            /* 附件闪烁图标 (左上角) */
            .mod14-attachment-icon {
                position: absolute;
                top: -20px;
                right: 20px; /* 放在右上角或者左上角 */
                width: 40px; height: 40px;
                background: var(--mod14-secondary-color, #7affff);
                border: 2px solid #fff;
                border-radius: 50%;
                display: flex; justify-content: center; align-items: center;
                cursor: pointer;
                box-shadow: 0 0 10px var(--mod14-glow-color);
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

            /* 回溯按钮 (左下角) */
           .mod14-back-btn {
                position: absolute;
                bottom: 15px; left: 20px; /* 位置调整 */
                width: 0; height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-bottom: 12px solid var(--mod14-text-secondary-color, #a8c0e1); /* 向上箭头 */
                cursor: pointer;
                opacity: 0.5;
                transition: all 0.2s;
                animation: mod14-bounce-reverse 1s infinite;
                z-index: 20;
            }
            .mod14-back-btn:hover {
                border-bottom-color: var(--mod14-primary-color, #00faff);
                opacity: 1;
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
                border-top: 12px solid var(--mod14-primary-color, #00faff);
                animation: mod14-bounce 1s infinite;
                opacity: 0;
            }
            .mod14-next-indicator.active { opacity: 1; }
            @keyframes mod14-bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(5px); }
            }

            /* --- 全屏附件模态框 --- */
            .mod14-attachment-modal {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.85);
                z-index: 2000;
                display: none;
                justify-content: center;
                align-items: center;
                padding: 20px;
                backdrop-filter: blur(5px);
                       animation: mod14-fade-in 0.3s ease-out forwards;
            }
                .mod14-modal-content {
                width: 95%; height: 90%;

                /* 【修改】内容容器背景透明 */
                background: transparent;
                box-shadow: none; /* 去除阴影以适应透明背景 */

                border-radius: 8px;
                overflow: hidden;
                position: relative;
            }
    
            /* 【修改】隐藏右上角的 X 关闭按钮 */
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

                /* 【修改】允许面板自身接收鼠标事件，否则无法触发 hover */
                pointer-events: auto;

                /* 【新增】增加透明内边距，扩大鼠标感应范围（即“附近”区域） */
                padding: 20px;
                margin: -20px;
            }

            /* 【修改】仅保留面板自身的悬浮显示，移除 .mod14-stage-wrapper:hover 的触发 */
            .mod14-control-panel:hover {
                opacity: 1;
            }

            /* 【新增】动画关键帧 */
            @keyframes mod14-slide-up {
                0% { transform: translateY(30px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
            @keyframes mod14-fade-in {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }

       
            .mod14-ctrl-btn {
                background: var(--mod14-container-bg-color); /* 纯变量 */
                border: 1px solid var(--mod14-primary-color); /* 纯变量 */
                color: var(--mod14-primary-color); /* 纯变量 */
                padding: 4px 10px;
                font-size: 12px;
                cursor: pointer;
                border-radius: 4px;
                backdrop-filter: blur(4px);
                user-select: none;
            }
            .mod14-ctrl-btn.active {
                background: var(--mod14-primary-color);
                color: var(--mod14-bg-color, #000);
                box-shadow: 0 0 8px var(--mod14-primary-color);
            }
            .mod14-ctrl-btn:hover {
                background: var(--mod14-border-color);
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
            this.currentChunk = null; // 当前正在显示的数据块
            this.pendingOptions = null; // 待显示的选项

            this.initUI();
            this.syncTheme();
            window.addEventListener('resize', () => this.syncTheme());

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
        }

           buildFullCommand(descriptionText, tags) {
            let fullCommand = `/send ${descriptionText}`;

            // 如果没有标签，直接返回 /send 指令
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
        this.ui.optionsLayer.style.display = 'none'; // 隐藏选项

        // 加载目标消息
        await window.worldHelper.createMessageBubble(targetMsg, 'chat', true);

        // 播放
        this.playNextChunk();
    }
         initUI() {
            // 【修改】如果舞台已存在，则不再重新创建，直接返回
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
            optionsLayer.style.display = 'none';

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
            modal.onclick = (e) => {
                if (e.target === modal) modal.style.display = 'none';
            };
            modal.querySelector('.mod14-modal-close').onclick = () => modal.style.display = 'none';


       // --- 修改：控制面板 ---
            const controlPanel = document.createElement('div');
            controlPanel.className = 'mod14-control-panel';

            // 新增：上一章按钮
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

            

           // 【修改】将事件绑定移到这里，确保只绑定一次
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
        }

        syncTheme() {
            if (!this.ui || !window.GameAPI) return;
            const getVar = window.GameAPI.getThemeVar;
            const theme = {
                '--mod14-primary-color': getVar('--primary-color') || '#00faff',
                '--mod14-secondary-color': getVar('--secondary-color') || '#7affff',
                '--mod14-text-color': getVar('--text-color') || '#e6f1ff',
                '--mod14-text-secondary-color': getVar('--text-secondary-color') || '#a8c0e1',
                '--mod14-container-bg-color': getVar('--container-bg-color') || 'rgba(10, 25, 47, 0.85)',
                '--mod14-border-color': getVar('--border-color') || 'rgba(0, 250, 255, 0.3)',
                '--mod14-glow-color': getVar('--glow-color') || 'rgba(0, 250, 255, 0.5)',
                '--base-font-family': getVar('--base-font-family') || '"Microsoft YaHei", sans-serif',
                '--base-font-size': getVar('--base-font-size') || '16px',
                '--base-line-height': getVar('--base-line-height') || '1.5'
            };
            Object.entries(theme).forEach(([k, v]) => this.ui.stage.style.setProperty(k, v));
        }

        // --- 核心流程 ---

     enqueueMessage(msg, rawContent, extractedOptions = []) {
    // 【新增】重绘时的智能过滤：
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
        const rawHtml = htmlBlock || (markdownBlock ? `<pre><code class="language-${lang || ''}">${markdownBlock.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>` : '');
        if (!rawHtml) return match;
        htmlPlaceholders[placeholder] = rawHtml;
        placeholderIndex++;
        return placeholder;
    });

    // 1.2 解析 <msg> -> 【修改】转换为 HTML 后立即用占位符保护
  processedContent = processedContent.replace(/<msg>([^|]+)\|([^|]+)\|([\s\S]*?)<\/msg>/gs, (match, sender, receiver, msgContent) => {
        // 【修改点】将最后一个参数由 true 改为 false
        // 这样 renderPrivateMsgToHtml 才会生成包含 BGM 信息的隐藏 div (js-music-autoplay-trigger)
        // 从而让下方的 bgmMatch 正则能提取到歌曲信息
        const html = window.worldHelper.renderPrivateMsgToHtml(sender.trim(), receiver.trim(), msgContent, userNickname, false);
        return protectRichUi(html);
    });

    // 1.3 解析 <group_chat> -> 【修改】转换为 HTML 后立即用占位符保护
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
            let name = '';
            let text = trimmed;

            // 【新增】检查是否包含富文本占位符
            let isRichContent = false;
            // 简单的检查：如果这一行包含我们生成的占位符 key
            for (const key in richUiPlaceholders) {
                if (text.includes(key)) {
                    text = text.replace(key, richUiPlaceholders[key]); // 恢复为完整的 HTML
                    isRichContent = true;
                }
            }

            if (!isRichContent && trimmed.includes('|') && trimmed.indexOf('|') < 20) {
                const p = trimmed.split('|');
                name = p[0].trim();
                text = p.slice(1).join('|').trim();
            } else {
                if (trimmed.startsWith('(') || trimmed.startsWith('（')) name = '';
                else name = msg.name || '';
            }

            this.queue.push({
                name,
                text,
                attachments: [],
                isAttachmentDisplay: false,
                isRichContent: isRichContent, // 【新增】标记为富文本
                isLast: false,
                options: [],
                isRealLastMsg: isRealLastMsg,
                originalMsg: msg
            });
        });
    };

    if (attachmentMatch) {
        this.queue.push({
            name: msg.name || '系统',
            text: '',
            attachments: attachmentMatch,
            isAttachmentDisplay: true,
            isLast: false,
            options: [],
            isRealLastMsg: isRealLastMsg,
            originalMsg: msg
        });

        const remainingText = processedContent.replace(attachmentRegex, '').trim();
        if (remainingText) {
            processTextLines(remainingText);
        }

    } else {
        processTextLines(processedContent);
    }

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
    if (!this.isTyping && this.ui.optionsLayer.style.display === 'none' && !this.isShowingModal && !this.isBulkRendering) {
        this.playNextChunk();
    }
}

        parseRawOptions(text) {
            // 兼容你的 generateChoices 逻辑：非空行，或数字开头
            return text.split('\n').filter(line => line.trim() && (/^\d+\.\s*/.test(line.trim()) || !/^\s*$/.test(line.trim())));
        }

   handleInteraction() {
            // 【修复】如果在回溯加载中，禁止交互，防止触发 playNextChunk 导致当前句重播
            if (this.isBacktracking) return;

            if (this.isTyping) {
                this.finishTyping();
                return;
            }
            if (this.ui.optionsLayer.style.display !== 'none') return; // 必须选选项

            if (this.queue.length > 0) {
                this.playNextChunk();
            } else {
                // 队列空了
            }
        }
  toggleAuto(btn) {
        this.isAuto = !this.isAuto;
        if (this.isAuto) {
            btn.classList.add('active');
            // 如果当前不在打字且没有选项，触发下一步
            if (!this.isTyping && this.ui.optionsLayer.style.display === 'none') {
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

        // 1. 标记跳过状态 (这将使 renderChunkState 瞬间完成打字)
        this.isSkipping = true;

        // 2. 停止当前所有动作
        clearInterval(this.typingTimer);
        this.isTyping = false;
        this.queue = []; // 清空待播放队列

        // 3. 获取最后一条消息
        const lastMsg = history[history.length - 1];

        // 4. 检查：如果我们已经在显示最后一条消息的最后一段，就不用重载了
        if (this.currentChunk && this.currentChunk.originalMsg === lastMsg && this.currentChunk.isLast) {
             this.finishTyping(); // 确保当前内容完全显示
             // 延迟重置跳过状态
             setTimeout(() => { this.isSkipping = false; }, 100);
             return;
        }

        console.log('[Galgame] Skipping to latest message...');

        // 5. 重新解析最后一条消息，填充 this.queue
        await window.worldHelper.createMessageBubble(lastMsg, 'chat', true);

        // 6. 【关键修改】直接播放队列中的最后一个块
        if (this.queue.length > 0) {
            // 从队列中取出最后一块
            const finalChunk = this.queue.pop();

            // 清空队列，确保只播放最后一块
            this.queue = [];

            // 将最后一块设置为当前要播放的块并立即播放
            // 我们直接调用 playNextChunk，但因为队列是空的，它只会播放我们手动添加的这一块
            this.queue.push(finalChunk);
            this.playNextChunk();
        }

        // 7. 稍微延迟后重置跳过状态
        setTimeout(() => {
            this.isSkipping = false;
        }, 200);
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
            // 历史栈为空，尝试加载更早的消息
            const success = await this.loadPreviousMessage();
            if (!success) {
                console.log('已到达历史记录起点');
                // 如果没有更早的消息，且刚才把 currentChunk 放回去了，需要重新把它拿出来显示（否则界面会空）
                if (this.queue.length > 0) {
                    this.playNextChunk();
                }
                this.isBacktracking = false;
                return;
            }
        }

        // 4. 从历史栈中取出上一块
        // 此时栈顶就是我们要回退到的目标块
        const prevChunk = this.historyStack.pop();

        // 5. 隐藏选项层 (防止回退时选项还卡在屏幕上)
        this.ui.optionsLayer.style.display = 'none';

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

    // 更新名字 & 立绘
    this.updateSpeaker(chunk.name);

    this.isTyping = true;
    this.currentText = chunk.text; // 这里的 text 包含 HTML 标签

    // 如果是跳过模式，直接显示全部
    if (this.isSkipping) {
        this.finishTyping();
        return;
    }

    // 【新增】如果是富文本内容（如短信、群聊界面），直接渲染，不使用打字机
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
    this.historyStack.push(chunk);

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

        updateSpeaker(name) {
            if (name && name !== '旁白' && name !== '系统') {
                this.ui.nameText.textContent = name;
                this.ui.nameTag.style.display = 'block';
                this.loadCG(name);
            } else {
                this.ui.nameTag.style.display = 'none';
                // 旁白不清除立绘
            }
        }
 async loadCG(displayName) {
    // 【关键修正】将 assaData 的获取移入函数内部，确保每次都获取最新数据
    const assaData = (window.GameAPI && window.GameAPI.assaData) || window.assaSettingsData;
    const cgImg = this.ui.cgImg;

    // 1. 数据源检查
    if (!assaData || !assaData.img_map) {
        console.log('[Nova][CG-LOG] 数据源(assaData/img_map) 尚未准备好。');
        // 如果没有数据源，也应该隐藏立绘
        this.activeCG = { name: null, imgId: null };
        cgImg.style.opacity = '0';
        return;
    }

    // 2. 获取资源映射 ID
    const imageName = displayName ? assaData.img_map[displayName] : null;
    const imageNameStr = imageName ? String(imageName) : null;

    // 3. 核心判断：检查请求的资源是否与当前激活的资源相同
    if (this.activeCG.name === displayName && this.activeCG.imgId === imageNameStr) {
        return; // 角色和资源ID都一样，无需任何操作
    }

    // 4. 更新激活状态，表示我们“意图”加载这个新立绘
    this.activeCG = { name: displayName, imgId: imageNameStr };
    const currentRequest = { ...this.activeCG }; // 捕获本次请求的状态

    // 如果没有有效的资源ID，直接隐藏并返回
    if (!imageNameStr) {
        cgImg.style.opacity = '0';
        console.log(`[Nova][CG-LOG] 角色 '${displayName}' 无有效立绘，已隐藏。`);
        return;
    }

    console.log(`[Nova][CG-LOG] 请求加载: '${displayName}' (ID: ${imageNameStr})`);

    // 切换时先隐藏
    cgImg.style.opacity = '0';

    try {
        let imageBlob = null;

        // 5. 缓存检查 (本地库优先)
        if (window.imageDB) {
            try {
                imageBlob = await window.imageDB.get('CustomNpcs', imageNameStr);
                if (imageBlob) console.log(`[Nova][CG-LOG] ✨ 本地库命中: ${imageNameStr}`);
            } catch (e) { console.warn('[Nova][CG-LOG] 本地库读取异常', e); }
        }

        // 6. 远程资源获取 (如果本地没有)
        if (!imageBlob) {
            const remoteMap = window.GameAPI.npcImageMap;
            if (remoteMap && remoteMap[imageNameStr]) {
                const imageUrl = remoteMap[imageNameStr];
                console.log(`[Nova][CG-LOG] 发现远程URL: ${imageUrl}`);

                // 6.1 检查远程缓存
                if (window.imageDB) {
                    try {
                        imageBlob = await window.imageDB.get('RemoteCache', imageUrl);
                        if (imageBlob) console.log(`[Nova][CG-LOG] 远程缓存命中: ${imageUrl}`);
                    } catch (e) { console.warn('[Nova][CG-LOG] 远程缓存读取失败'); }
                }

                // 6.2 执行下载 (如果缓存没有)
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

        // 7. 图片处理与显示
        if (imageBlob) {
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onloadend = async () => {
                if (this.activeCG.name !== currentRequest.name || this.activeCG.imgId !== currentRequest.imgId) {
                    console.log(`[Nova][CG-LOG] 渲染被中断：已有新的立绘请求。`);
                    return;
                }

                const stableImageUrl = reader.result;
                try {
                    const targetH = window.innerHeight * 0.85;
                    const finalUrl = window.createPixelatedCharaImage
                        ? await window.createPixelatedCharaImage(stableImageUrl, targetH, 1, false)
                        : stableImageUrl;

                    cgImg.src = finalUrl;
                    cgImg.onload = () => {
                        cgImg.style.opacity = '1';
                        console.log(`[Nova][CG-LOG] ✅ 立绘渲染成功: ${displayName}`);
                    };
                } catch (pixelError) {
                    console.error(`[Nova][CG-LOG] 图片处理失败:`, pixelError);
                    cgImg.src = stableImageUrl;
                    cgImg.style.opacity = '1';
                }
            };
        } else {
            console.error(`[Nova][CG-LOG] 流程结束，未能获取到 '${displayName}' 的任何图片数据。`);
        }

    } catch (error) {
        console.error(`[Nova][CG-LOG] 加载立绘时发生未捕获异常:`, error);
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

            container.style.display = 'flex';
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
                this.ui.optionsLayer.style.pointerEvents = 'none';
                setTimeout(() => {
                    this.ui.optionsLayer.style.display = 'none';
                    this.ui.optionsLayer.style.pointerEvents = 'auto';
                }, 800);
            }
        }
 // 【修改】showAttachmentModal
          showAttachmentModal(isAutoPlayFlow = false) {
            if (!this.currentAttachmentsContent || !this.ui || !this.ui.modal) return;

            this.isShowingModal = true;

            // 【修改】使用 dataset 传递状态，而不是在闭包里
            this.ui.modal.dataset.isAutoPlayFlow = isAutoPlayFlow;

            const container = this.ui.iframeContainer;
            container.innerHTML = ''; // 清空旧内容

            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.background = 'transparent';

            // 注入HTML内容
            iframe.srcdoc = `
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    /* 滚动条样式优化 (可选) */
                    ::-webkit-scrollbar { width: 6px; }
                    ::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); }
                    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 3px; }

                    body {
                        font-family: "Microsoft YaHei", sans-serif;
                        padding: 20px;
                        line-height: 1.6;
                        background: transparent; /* 透明背景 */
                        color: #fff; /* 白字 */
                        text-shadow: 0 1px 2px rgba(0,0,0,0.8); /* 增加文字阴影提高可读性 */
                    }
                    img { max-width: 100%; height: auto; border-radius: 4px; }
                    details {
                        border: 1px solid rgba(255,255,255,0.3);
                        border-radius: 4px;
                        padding: 10px;
                        margin-bottom: 10px;
                        background: rgba(0,0,0,0.2);
                    }
                    summary { font-weight: bold; cursor: pointer; color: #00faff; }
                  </style>
                </head>
                <body>${this.currentAttachmentsContent}</body>
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
    if (!galManager) galManager = new GalgameManager();

    // 【修改点 1】: 只有当 galManager.ui 不存在，且 DOM 中也没有舞台时，才初始化。
    // 这样当 renderHistory 临时移除 DOM 时，因为 galManager.ui 还在内存里，就不会重复创建。
    if (!galManager.ui && !document.querySelector('.mod14-stage-wrapper')) {
        galManager.initUI();
        galManager.syncTheme();
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
                galManager.syncTheme();
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

        const chatArea = document.getElementById('chat-display-area');
        // 【关键修改 1】在原函数执行前，先获取舞台引用
        // 如果这时候去取，它还在 DOM 里，或者是 galManager.ui.stage
        let stage = document.querySelector('.mod14-stage-wrapper');

        // 如果 DOM 里找不到，但 Manager 里有，就用 Manager 里的（防止意外丢失）
        if (!stage && galManager && galManager.ui) {
            stage = galManager.ui.stage;
        }

        // 【关键修改 2】保护现场：先把舞台从 DOM 拿出来
        // 这样原函数操作 DOM 时（比如清空或重排）就不会伤害到舞台元素
        if (stage && chatArea && chatArea.contains(stage)) {
            stage.remove();
        }

        // 执行原逻辑 (添加用户气泡、清理旧气泡等)
        if (originalRenderNewMessages) {
            await originalRenderNewMessages.apply(this, arguments);
        }

        // 【关键修改 3】恢复现场：把舞台放回去 (放在最上面)
        if (chatArea && stage) {
            chatArea.appendChild(stage);
        }
    };
})();