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
                // overflow: hidden !important;
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
                background: rgba(0,0,0,0.3);
                padding: 2px 6px; border-radius: 4px; font-size: 0.8em;
                border: 1px solid rgba(255,255,255,0.2);
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
                bottom: 15px; right: 80px; /* 位置调整 */
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
            }
            .mod14-modal-content {
                width: 95%; height: 90%;
                background: #fff;
                border-radius: 8px;
                overflow: hidden;
                position: relative;
            }
            .mod14-modal-close {
                position: absolute;
                top: 10px; right: 10px;
                background: red; color: white;
                border: none; padding: 5px 10px;
                cursor: pointer; z-index: 10;
                border-radius: 4px;
            }

            .mod14-dummy-bubble { display: none; }

              .mod14-control-panel {
                position: absolute;
                top: 10px; left: 10px;
                z-index: 50;
                display: flex;
                gap: 8px;
                opacity: 0; /* 默认隐藏 */
                transition: opacity 0.3s ease;
                pointer-events: none; /* 隐藏时不阻挡点击 */
            }
            /* 鼠标移入左上角区域时显示 */
            .mod14-stage-wrapper:hover .mod14-control-panel,
            .mod14-control-panel:hover {
                opacity: 1;
                pointer-events: auto;
            }

        /* --- 控制面板 --- */
            .mod14-control-panel {
                position: absolute;
                top: 10px; left: 10px;
                z-index: 50;
                display: flex;
                gap: 8px;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }
            .mod14-stage-wrapper:hover .mod14-control-panel,
            .mod14-control-panel:hover {
                opacity: 1;
                pointer-events: auto;
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
            this.isTyping = false;
            this.currentText = '';
            this.typingTimer = null;
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
        }

        initUI() {
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


             // --- 新增：控制面板 ---
        const controlPanel = document.createElement('div');
        controlPanel.className = 'mod14-control-panel';

        // 按钮1: Auto (自动播放)
        const autoBtn = document.createElement('div');
        autoBtn.className = 'mod14-ctrl-btn';
        autoBtn.textContent = 'AUTO';
        autoBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggleAuto(autoBtn);
        };

        // 按钮2: Skip (跳到最新/快进)
        const skipBtn = document.createElement('div');
        skipBtn.className = 'mod14-ctrl-btn';
        skipBtn.textContent = 'SKIP';
        skipBtn.onclick = (e) => {
            e.stopPropagation();
            this.skipToLatest();
        };

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

            // 交互
            dialogueBox.addEventListener('click', (e) => {
                // 如果点击的是按钮，不触发下一步
                if (e.target.closest('.mod14-back-btn') || e.target.closest('.mod14-attachment-icon')) return;
                this.handleInteraction();
            });

            this.ui = {
                stage, cgLayer, cgImg: cgLayer.querySelector('.mod14-cg-image'),
                optionsLayer, dialogueBox, nameTag, nameText: nameTag.querySelector('.mod14-name-text'),
                textContent, nextIndicator, attachmentIcon, modal,
                iframeContainer: modal.querySelector('.mod14-iframe-container')
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
        // 简单的去重 ID：消息对象引用 + 内容长度
        // 如果是 renderHistory 导致的重复调用，这能拦截大部分
        const msgId = msg === this.lastEnqueuedMsg ? 'SAME_MSG' : Date.now();
        if (msg === this.lastEnqueuedMsg && this.queue.length > 0) {
             // 如果是同一条消息被重复调用（例如流式传输更新），这里可能需要更复杂的逻辑
             // 暂时假设 renderHistory 是分块的，不会对同一 msg 调两次
        }
        this.lastEnqueuedMsg = msg;

        // ... (原有的提取附件逻辑保持不变) ...
        // 注意：这里不再提取 <options>，因为参数里传进来了

        let content = rawContent;
        const attachments = [];
        // ... (原有的 HTML/Details 提取逻辑) ...
        const specialRegex = /<html>([\s\S]*?)<\/html>|<details>([\s\S]*?)<\/details>/gi;
        content = content.replace(specialRegex, (m, htmlContent, detailsContent) => {
            attachments.push(htmlContent || detailsContent);
            return '{{ATTACHMENT_MARKER}}';
        });

        // 分块逻辑
        const lines = content.split('\n');
        let currentAttachmentIndex = 0;
        let createdChunks = 0;

        lines.forEach((line, index) => {
            let trimmed = line.trim();
            if (!trimmed) return;

            // --- 新增修改开始：过滤掉被 <> 包裹的整行内容 ---
            // 例如 <game>, <battle_start>, <turn_1> 等
            // 注意：这会过滤掉所有以 < 开头并以 > 结尾的单行内容
            if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
                // 可以在这里加个 console.log 确认过滤了什么
                // console.log('Skipping tag line:', trimmed);
                return;
            }
            let chunkAttachments = [];
            if (trimmed.includes('{{ATTACHMENT_MARKER}}')) {
                const count = (trimmed.match(/{{ATTACHMENT_MARKER}}/g) || []).length;
                for(let i=0; i<count; i++) {
                    if (attachments[currentAttachmentIndex]) {
                        chunkAttachments.push(attachments[currentAttachmentIndex]);
                        currentAttachmentIndex++;
                    }
                }
                trimmed = trimmed.replace(/{{ATTACHMENT_MARKER}}/g, '');
            }

            // ... (原有的名字解析逻辑) ...
            let name = '';
            let text = trimmed;
            if (trimmed.includes('|') && trimmed.indexOf('|') < 20) {
                const p = trimmed.split('|');
                name = p[0].trim();
                text = p.slice(1).join('|').trim();
            } else if (msg.role === 'user') {
                name = window.currentGameData?.user?.nick_name || '你';
            } else {
                if (trimmed.startsWith('(') || trimmed.startsWith('（')) name = '';
                else name = msg.name || '';
            }

            this.queue.push({
                name, text,
                attachments: chunkAttachments,
                isLast: false,
                // 只有最后一个块才携带选项
                options: [],
                 originalMsg: msg // <--- 新增：绑定原始消息对象，用于查找上一条
            });
            createdChunks++;
        });

        // 将选项挂载到刚才生成的最后一个块上
        if (createdChunks > 0) {
            const lastChunk = this.queue[this.queue.length - 1];
            lastChunk.isLast = true;
            lastChunk.options = extractedOptions; // 使用传入的选项
        } else if (extractedOptions.length > 0) {
            // 只有选项没有文本的情况
            this.queue.push({
                name: '系统',
                text: '请做出选择...',
                options: extractedOptions,
                isLast: true
            });
        }

        // 自动播放
        if (!this.isTyping && this.ui.optionsLayer.style.display === 'none') {
            this.playNextChunk();
        }
    }

        parseRawOptions(text) {
            // 兼容你的 generateChoices 逻辑：非空行，或数字开头
            return text.split('\n').filter(line => line.trim() && (/^\d+\.\s*/.test(line.trim()) || !/^\s*$/.test(line.trim())));
        }

        handleInteraction() {
            if (this.isTyping) {
                this.finishTyping();
                return;
            }
            if (this.ui.optionsLayer.style.display !== 'none') return; // 必须选选项

            if (this.queue.length > 0) {
                this.playNextChunk();
            } else {
                // 队列空了，且没有选项显示中 -> 等待
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
             this.finishTyping();
             setTimeout(() => { this.isSkipping = false; }, 100);
             return;
        }

        console.log('[Galgame] Skipping to latest message...');

        // 5. 重新解析最后一条消息
        // 注意：这里我们临时借用 createMessageBubble 来填充 queue
        await window.worldHelper.createMessageBubble(lastMsg, 'chat', true);

        // 6. 【关键修改】合并所有块，确保显示完整消息
        if (this.queue.length > 0) {
            // 提取所有文本并合并
            const fullText = this.queue.map(c => c.text).join('');
            // 获取最后一个块（包含选项和附件信息）
            const lastChunk = this.queue[this.queue.length - 1];
            // 合并所有附件
            const allAttachments = this.queue.flatMap(c => c.attachments || []);

            // 创建一个合并后的超级块
            const mergedChunk = {
                name: lastChunk.name, // 沿用最后一块的名字
                text: fullText,       // 完整文本
                attachments: allAttachments,
                options: lastChunk.options, // 选项
                isLast: true,
                originalMsg: lastMsg
            };

            this.queue = [mergedChunk]; // 队列只剩这一个完整块
            this.playNextChunk(); // 播放 (由于 isSkipping=true，会瞬间完成)
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

        // 2. 如果当前有正在显示的块，把它放回"未来队列"的最前端
        if (this.currentChunk) {
            this.queue.unshift(this.currentChunk);
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
        const prevChunk = this.historyStack.pop();

        // 5. 隐藏选项层 (防止回退时选项还卡在屏幕上)
        this.ui.optionsLayer.style.display = 'none';

        // 6. 播放上一块
        // 注意：这里我们手动设置 currentChunk 并调用渲染，而不是走 playNextChunk
        // 因为 playNextChunk 会把 chunk 再次 push 进 historyStack，导致死循环
        this.currentChunk = prevChunk;

        // 渲染逻辑复用 playNextChunk 的一部分，但不推入 history
        this.renderChunkState(prevChunk);

        this.isBacktracking = false;
    }

    // 新增：辅助方法，用于从 conversationHistory 加载上一条消息
    async loadPreviousMessage() {
        // 获取当前队列头部的消息（如果队列为空，尝试用刚才被回退的 currentChunk）
        // 我们需要找到"当前正在读的这条消息"在全局历史中的位置
        let referenceMsg = null;
        if (this.queue.length > 0) referenceMsg = this.queue[0].originalMsg;
        else if (this.currentChunk) referenceMsg = this.currentChunk.originalMsg;

        if (!referenceMsg) return false;

        const history = window.GameAPI.conversationHistory;
        const currentIndex = history.indexOf(referenceMsg);

        if (currentIndex <= 0) return false; // 已经是第一条了

        const prevMsg = history[currentIndex - 1];

        // 使用 createMessageBubble 的逻辑重新解析这条旧消息
        // 但我们需要拦截它，不让它直接渲染 DOM，而是只获取 chunks
        // 这里我们手动调用解析逻辑 (简化版，复用 enqueueMessage 的解析部分会比较复杂，
        // 建议直接调用 createMessageBubble 但传入一个特殊标记，或者我们把解析逻辑抽离)

        // 为了简单且复用现有逻辑，我们模拟一次解析：
        // 注意：这里假设 createMessageBubble 已经被我们拦截并挂载了 galManager
        // 我们临时清空 queue，让 createMessageBubble 把 chunks 填进去，然后我们把这些 chunks 转移到 historyStack

        const tempQueueBackup = [...this.queue];
        this.queue = []; // 临时清空

        // 调用拦截后的 createMessageBubble，它会调用 galManager.enqueueMessage 填充 this.queue
        await window.worldHelper.createMessageBubble(prevMsg, 'chat', true);

        // 现在 this.queue 里装的是 prevMsg 的所有 chunks (顺序是 1,2,3)
        // 我们需要把它们放入 historyStack (顺序应该是 1,2,3，这样 pop 出来是 3)
        // 这样点击"上一步"时，会先看到 3，再点看到 2...

        const newChunks = [...this.queue];
        this.historyStack.push(...newChunks);

        // 恢复原来的队列
        this.queue = tempQueueBackup;

        return true;
    }

  renderChunkState(chunk) {
        // UI 重置
        this.ui.nextIndicator.classList.remove('active');
        this.ui.textContent.innerHTML = ''; // 清空 HTML
        this.ui.attachmentIcon.style.display = 'none';
        clearTimeout(this.autoTimer); // 清除自动播放等待

        // 更新名字 & 立绘
        this.updateSpeaker(chunk.name);

        // 处理附件
        if (chunk.attachments && chunk.attachments.length > 0) {
            this.ui.attachmentIcon.style.display = 'flex';
            this.currentAttachmentsContent = chunk.attachments.join('<br><hr><br>');
        }

        // --- HTML 打字机逻辑 ---
        this.isTyping = true;
        this.currentText = chunk.text; // 这里的 text 包含 HTML 标签

        // 如果是跳过模式，直接显示全部
        if (this.isSkipping) {
            this.finishTyping();
            return;
        }

        // 解析 HTML 为 Token 数组
        // 正则含义：匹配 <...> 标签，或者 任意非 < 字符
        const tokens = this.currentText.match(/<[^>]+>|[^<]/g) || [];

        let tokenIndex = 0;
        let currentHTML = '';

        clearInterval(this.typingTimer);

        this.typingTimer = setInterval(() => {
            if (tokenIndex < tokens.length) {
                const token = tokens[tokenIndex];
                currentHTML += token;
                this.ui.textContent.innerHTML = currentHTML;

                // 如果当前 token 是标签（以 < 开头），不计入打字延迟，立即处理下一个
                // 这样标签会瞬间渲染，不会把 < s p a n > 一个个打出来
                if (token.startsWith('<')) {
                    // 循环处理连续的标签 (如 </span><br><span>)
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
        this.historyStack.push(chunk); // 正常播放时，存入历史

        this.renderChunkState(chunk);
    }
  finishTyping() {
        clearInterval(this.typingTimer);
        this.ui.textContent.innerHTML = this.currentText; // 确保最终 HTML 完整
        this.isTyping = false;

        // 如果有选项且是最后一句，显示选项
        if (this.currentChunk.isLast && this.currentChunk.options && this.currentChunk.options.length > 0) {
            this.renderOptions(this.currentChunk.options);
            // 选项出现时，自动播放暂停，等待用户选择
        } else {
            this.ui.nextIndicator.classList.add('active');

            // --- 处理自动播放 ---
            if (this.isAuto) {
                // 根据文本长度计算阅读时间，最少 1 秒，最多 5 秒
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
        // 避免重复加载同一张图
        if (!displayName || this.ui.cgImg.dataset.charName === displayName) return;

        console.log(`[Nova][CG-LOG] 尝试为 '${displayName}' 加载立绘...`);
        const cgImg = this.ui.cgImg;

        // 切换时先隐藏，等待加载完成
        cgImg.style.opacity = '0';

        try {
            // 1. 基础数据源检查
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

            // 2. 尝试从本地库获取 (CustomNpcs)
            if (window.imageDB) {
                try {
                    imageBlob = await window.imageDB.get('CustomNpcs', imageNameStr);
                    if (imageBlob) console.log(`[Nova][CG-LOG] ✨ 本地库命中: ${imageNameStr}`);
                } catch (e) { console.warn('[Nova][CG-LOG] 本地库读取异常', e); }
            }

            // 3. 如果本地没有，尝试从远程获取
            if (!imageBlob) {
                const remoteMap = window.GameAPI.npcImageMap;
                if (!remoteMap) {
                    console.error('[Nova][CG-LOG] 错误：npcImageMap 未定义');
                } else {
                    const imageUrl = remoteMap[imageNameStr];
                    if (imageUrl) {
                        // 3.1 查远程缓存
                        if (window.imageDB) {
                            try {
                                imageBlob = await window.imageDB.get('RemoteCache', imageUrl);
                            } catch (e) { console.warn('[Nova][CG-LOG] 远程缓存读取失败'); }
                        }

                        // 3.2 执行下载
                        if (!imageBlob) {
                            console.log(`[Nova][CG-LOG] 缓存未命中，开始下载...`);
                            const res = await fetch(imageUrl);
                            if (res.ok) {
                                const originalBlob = await res.blob();
                                imageBlob = new Blob([originalBlob], { type: 'image/png' });
                                if (window.imageDB) {
                                    await window.imageDB.set('RemoteCache', imageUrl, imageBlob);
                                }
                            } else {
                                console.error(`[Nova][CG-LOG] 下载失败: ${res.status}`);
                            }
                        }
                    }
                }
            }

            // 4. 图片处理与显示 (还原您的逻辑)
            if (imageBlob) {
                const reader = new FileReader();
                reader.readAsDataURL(imageBlob);
                reader.onloadend = async () => {
                    const stableImageUrl = reader.result;
                    try {
                        // 还原：使用 createPixelatedCharaImage 或直接显示
                        const targetH = window.innerHeight * 0.85;
                        if (window.createPixelatedCharaImage) {
                            const processedUrl = await window.createPixelatedCharaImage(stableImageUrl, targetH, 1, false);
                            cgImg.src = processedUrl;
                        } else {
                            cgImg.src = stableImageUrl;
                        }

                        // 记录当前角色名
                        cgImg.dataset.charName = displayName;

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
                console.error(`[Nova][CG-LOG] 未能获取到图片数据。`);
                // 没图时保持透明或清空
                cgImg.dataset.charName = '';
            }

        } catch (error) {
            console.error(`[Nova][CG-LOG] 加载立绘时发生未捕获异常:`, error);
        }
    }

 processImageTransparent(imgSrc) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // 允许跨域处理
            img.src = imgSrc;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;

                // 遍历像素，去除白色背景
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    // 阈值可调，这里设为 240
                    if (r > 240 && g > 240 && b > 240) {
                        data[i + 3] = 0; // Alpha设为0
                    }
                }

                ctx.putImageData(imgData, 0, 0);
                resolve(canvas.toDataURL());
            };
            img.onerror = () => resolve(imgSrc); // 失败则返回原图
        });
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
                        // 执行置入指令
                        const cmd = `/setinput ${descriptionText}`; // 简化版
                        this.executeChoice(cmd, card, '[ 指令已置入 ]', true);
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
                        this.executeChoice(`/send ${descriptionText}`, card, '已抉择');
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

        showAttachmentModal() {
            if (!this.currentAttachmentsContent) return;
            const container = this.ui.iframeContainer;
            container.innerHTML = '';

            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.background = '#fff';

            // 简单的 iframe 渲染
            this.ui.modal.style.display = 'flex';
            iframe.srcdoc = `
                <!DOCTYPE html>
                <html>
                <head><style>body{font-family:sans-serif;padding:20px;line-height:1.6;}</style></head>
                <body>${this.currentAttachmentsContent}</body>
                </html>
            `;
            container.appendChild(iframe);
        }
    }

    // ============================================================
    // 3. 拦截 createMessageBubble
    // ============================================================
      let galManager = null;

    window.worldHelper.createMessageBubble = async function(msg, mode = 'chat', is_from_render = false) {
        if (!galManager) galManager = new GalgameManager();
        if (!document.querySelector('.mod14-stage-wrapper')) {
            galManager.initUI();
            galManager.syncTheme();
        }

        let hookData = { message: msg };
        if (window.NovaHooks) hookData = await NovaHooks.trigger('before_message_render', hookData);

        // 1. 获取原始文本
        let rawContent = String(hookData.message.content || '');

        // 2. 【关键修改】在此处提取 <options>，防止被 formatAsTavernRegexedString 吞掉
        let extractedOptions = [];
        const optRegex = /<options>([\s\S]*?)<\/options>/gs;

        // 提取并从 rawContent 中移除 options 标签
        rawContent = rawContent.replace(optRegex, (match, optContent) => {
            // 尝试解析选项内容
            const trimmedOpt = optContent.trim();
            if (trimmedOpt.startsWith('[') || trimmedOpt.startsWith('{')) {
                try {
                    extractedOptions = JSON.parse(trimmedOpt);
                } catch(e) {
                    extractedOptions = galManager.parseRawOptions(trimmedOpt);
                }
            } else {
                extractedOptions = galManager.parseRawOptions(trimmedOpt);
            }
            return ''; // 替换为空字符串
        });

        // 3. 移除其他完全无关的标签 (Battle, Shop 等)
        rawContent = rawContent
            .replace(/<battle>(?:(?!<battle>)[\s\S])*?<\/battle>/gs, '')
            .replace(/<battle_log>(?:(?!<battle_log>)[\s\S])*?<\/battle_log>/gs, '')
            .replace(/<shop_item>(?:(?!<shop_item>)[\s\S])*?<\/shop_item>/gs, '');

        // 4. 调用格式化工具 (现在 options 已经被提走了，不会干扰，也不会被误删)
        // 注意：formatAsTavernRegexedString 可能会处理引号等，我们传入处理后的 rawContent
        let formattedContent = formatAsTavernRegexedString(
            rawContent,
            msg.role === 'user' ? 'user_input' : 'ai_output',
            'display',
            { depth: -1 }
        );
  formattedContent = formattedContent.replace(/<html>[\s\S]*?<\/html>|“/g, function(match) {
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
        // 5. 将处理好的 文本 和 选项 分别传给 Manager
        galManager.enqueueMessage(msg, formattedContent, extractedOptions);

        const dummy = document.createElement('div');
        dummy.className = 'mod14-dummy-bubble';
        dummy.style.display = 'none';
        return dummy;
    };

    console.log('[Nova] Mod14 Galgame Engine (Refined) Loaded.');
})();