 (function() {
    'use strict';

    // 确保只执行一次
    if (document.querySelector('.mod21-floating-ball')) {
        console.log('[MOD21] Assistant IIFE already loaded. Aborting.');
        return;
    }
    console.log('[MOD21] Initializing Assistant IIFE...');

    // 1. --- CSS样式注入 ---
    const style = document.createElement('style');
    style.textContent = `
        /* ... (CSS代码与之前版本相同，此处省略以保持简洁) ... */
        :root {
            --modal-content-bg: none; /* 默认透明 */
            --primary-color: #00faff;
            --secondary-color: #7affff;
            --base-line-height: 1.7;
            --base-font-size: 19px;
            --base-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; /* 默认字体 */
            --container-bg-color: rgba(10, 25, 47, 0.75);
            --border-color: rgba(0, 250, 255, 0.3);
            --glow-color: rgba(0, 250, 255, 0.5);
            --text-color: #e6f1ff;
            --text-secondary-color: #a8c0e1;
            --background-color: rgba(10, 25, 47);
            --danger-color: #ff4d4d;
            --danger-glow-color: rgba(255, 77, 77, 0.5);
            --success-color: #4dff88;
            --success-glow-color: rgba(77, 255, 136, 0.5);
        }

        .mod21-floating-ball {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 50px;
            height: 50px;
            background-color: var(--container-bg-color);
            border: 2px solid var(--border-color);
            border-radius: 50%;
            cursor: grab;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9998;
            user-select: none;
            transition: background-color 0.3s, border-color 0.3s;
        }

        .mod21-floating-ball:hover {
            background-color: rgba(10, 25, 47, 0.9);
            border-color: var(--primary-color);
        }

        .mod21-ball-icon {
            font-size: 24px;
            color: var(--primary-color);
            font-family: var(--base-font-family);
            font-weight: bold;
        }

        .mod21-main-container {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 600px;
            height: 70vh;
            background-color: var(--container-bg-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            z-index: 9999;
            display: none;
            flex-direction: column;
            font-family: var(--base-font-family);
            backdrop-filter: blur(5px);
        }

        .mod21-header {
            padding: 10px;
            background-color: rgba(0,0,0,0.2);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .mod21-header-title {
            color: var(--text-color);
            font-size: 16px;
            font-weight: bold;
        }

        .mod21-close-button {
            background: none;
            border: none;
            color: var(--text-secondary-color);
            font-size: 24px;
            cursor: pointer;
            line-height: 1;
        }

        .mod21-close-button:hover {
            color: var(--primary-color);
        }

        .mod21-api-selector {
            width: 100%;
            padding: 8px;
            background-color: var(--background-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-family: var(--base-font-family);
        }

        .mod21-display-screen {
            flex-grow: 1;
            overflow-y: auto;
            padding: 15px;
            color: var(--text-color);
            font-size: var(--base-font-size);
            line-height: var(--base-line-height);
            background-color: rgba(0,0,0,0.1);
            word-wrap: break-word;
            white-space: pre-wrap; /* 更好地显示换行 */
        }

        .mod21-input-area {
            display: flex;
            padding: 10px;
            border-top: 1px solid var(--border-color);
        }

        .mod21-text-input {
            flex-grow: 1;
            padding: 10px;
            background-color: var(--background-color);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            color: var(--text-color);
            font-size: 16px;
            margin-right: 10px;
            resize: none;
        }

        .mod21-send-button {
            padding: 10px 20px;
            background-color: var(--primary-color);
            color: var(--background-color);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s;
        }

        .mod21-send-button:hover {
            background-color: var(--secondary-color);
        }

        .mod21-send-button:disabled {
            background-color: var(--text-secondary-color);
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

    // 2. --- HTML元素创建 ---
    const floatingBall = document.createElement('div');
    floatingBall.className = 'mod21-floating-ball';
    floatingBall.innerHTML = `<span class="mod21-ball-icon">AI</span>`;

    const mainContainer = document.createElement('div');
    mainContainer.className = 'mod21-main-container';
    mainContainer.innerHTML = `
        <div class="mod21-header">
            <span class="mod21-header-title">AI Assistant</span>
            <select class="mod21-api-selector"></select>
            <button class="mod21-close-button">×</button>
        </div>
        <div class="mod21-display-screen"></div>
        <div class="mod21-input-area">
            <textarea class="mod21-text-input" rows="2" placeholder="输入消息..."></textarea>
            <button class="mod21-send-button">发送</button>
        </div>
    `;

    document.body.appendChild(floatingBall);
    document.body.appendChild(mainContainer);

    // 3. --- 获取元素引用 ---
    const closeButton = mainContainer.querySelector('.mod21-close-button');
    const apiSelector = mainContainer.querySelector('.mod21-api-selector');
    const displayScreen = mainContainer.querySelector('.mod21-display-screen');
    const textInput = mainContainer.querySelector('.mod21-text-input');
    const sendButton = mainContainer.querySelector('.mod21-send-button');

    let isGenerating = false;
    const generationId = 'mod21_assistant_generation';

    // 4. --- 功能逻辑实现 ---

    // API加载逻辑
     function loadApiOptions() {
        const currentValue = localStorage.getItem('mod21_selected_api') || 'default';
        let html = `<option value="default" ${currentValue === 'default' ? 'selected' : ''}>Default (Main)</option>`;
        html += `<option value="custom_v2" ${currentValue === 'custom_v2' ? 'selected' : ''}>API 2 (Legacy)</option>`;

        try {
            const pool = JSON.parse(localStorage.getItem('nova_multi_api_pool') || '{}');
            Object.keys(pool).forEach(id => {
                const name = pool[id].name || `Custom API (${id})`;
                const isSelected = currentValue === id ? 'selected' : '';
                html += `<option value="${id}" ${isSelected}>${name}</option>`;
            });
        } catch (e) {
            console.error("[MOD21] Error loading API pool", e);
        }
        apiSelector.innerHTML = html;
    }

    apiSelector.addEventListener('change', () => {
        localStorage.setItem('mod21_selected_api', apiSelector.value);
    });

    let isDragging = false;
    let offsetX, offsetY;
    let clickPrevented = false;

    floatingBall.addEventListener('mousedown', (e) => {
        isDragging = true;
        clickPrevented = false;
        floatingBall.style.cursor = 'grabbing';
        offsetX = e.clientX - floatingBall.getBoundingClientRect().left;
        offsetY = e.clientY - floatingBall.getBoundingClientRect().top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        clickPrevented = true; // If mouse moves, it's a drag, not a click
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        const rect = floatingBall.getBoundingClientRect();
        newX = Math.max(0, Math.min(newX, window.innerWidth - rect.width));
        newY = Math.max(0, Math.min(newY, window.innerHeight - rect.height));
        floatingBall.style.left = `${newX}px`;
        floatingBall.style.top = `${newY}px`;
        floatingBall.style.right = 'auto';
        floatingBall.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            floatingBall.style.cursor = 'grab';
        }
    });

    floatingBall.addEventListener('click', (e) => {
        if (clickPrevented) {
            e.stopPropagation();
            return;
        }
        mainContainer.style.display = 'flex';
        floatingBall.style.display = 'none';
        loadApiOptions();
    });

    closeButton.addEventListener('click', () => {
        mainContainer.style.display = 'none';
        floatingBall.style.display = 'flex';
    });


    async function handleSend() {
        if (isGenerating) {
            console.log('[MOD21] User requested to stop generation.');
            if (typeof stopGenerationById === 'function') {
                stopGenerationById(generationId);
            } else {
                console.error('[MOD21] stopGenerationById function is not available.');
                alert("中断功能当前不可用。");
            }
            return;
        }

        const userInput = textInput.value.trim();
        if (!userInput) return;

        console.log('[MOD21] Starting new generation...');
        isGenerating = true;
        sendButton.textContent = '中断';
        sendButton.disabled = false;
        displayScreen.textContent = '正在请求AI响应...'; // 初始提示
        textInput.value = '';
        textInput.disabled = true;

        try {
            console.log('[MOD21] Assembling prompt...');
            const promptPrompts = await assembleComplexPrompt({
                targetBookNames: ['x-ext-聊天群'],
                continuationText: '',
                excludedBookNames:['小蝌蚪找妈妈', 'x-dlc'],
                ignoreGlobalInjects: true
            });

            if (!promptPrompts || promptPrompts.length === 0) {
                throw new Error("提示词组装失败或为空。");
            }
            console.log('[MOD21] Prompt assembled:', JSON.stringify(promptPrompts));

            let customApiConfig = null;
            const selectedApiId = apiSelector.value;
            console.log(`[MOD21] Selected API: ${selectedApiId}`);
            if (selectedApiId !== 'default' && selectedApiId !== 'custom_v2') {
                // ... (API配置逻辑与之前相同) ...
            }

            const generateConfig = {
                generation_id: generationId,
                should_stream: true,
                should_silence: true,
                overrides: {
                    world_info_before: '',
                    persona_description: '',
                    char_description: '',
                    char_personality: '',
                    scenario: '',
                    world_info_after: '',
                    dialogue_examples: '',
                    chat_history: { prompts: [] }
                },
                user_input: userInput,
                max_chat_history: 0,
                ordered_prompts: promptPrompts
            };

            if (customApiConfig) {
                generateConfig.custom_api = customApiConfig;
                console.log('[MOD21] Using custom API config:', customApiConfig);
            }

            console.log('[MOD21] Calling generateRaw with config:', generateConfig);
            await generateRaw(generateConfig);

        } catch (error) {
            console.error("[MOD21] Error during generation setup:", error);
            displayScreen.innerHTML = `<p style="color: var(--danger-color);">发生错误: ${error.message}</p>`;
            // 出错时重置状态
            isGenerating = false;
            sendButton.textContent = '发送';
            sendButton.disabled = false;
            textInput.disabled = false;
        }
    }

    sendButton.addEventListener('click', handleSend);
    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    // 5. --- 事件监听 ---
    let streamStarted = false;

    // 监听生成开始
    eventOn(iframe_events.GENERATION_STARTED, (id) => {
        if (id === generationId) {
            console.log(`[MOD21] Event: GENERATION_STARTED for id: ${id}. Clearing screen for new content.`);
            streamStarted = true;
            displayScreen.textContent = ''; // 在收到第一个token前清空屏幕
        }
    });

    // 主要监听增量事件
    eventOn(iframe_events.STREAM_TOKEN_RECEIVED_INCREMENTALLY, (incremental_text, id) => {
        if (id === generationId) {
            // 第一次收到token时，streamStarted应为true
            if (!streamStarted) {
                console.warn(`[MOD21] Received stream token for ${id} but GENERATION_STARTED was not detected first.`);
                displayScreen.textContent = ''; // 预防性清空
                streamStarted = true;
            }
            console.log(`[MOD21] Event: STREAM_TOKEN_RECEIVED_INCREMENTALLY for id: ${id}, chunk: "${incremental_text}"`);
            displayScreen.textContent += incremental_text;
            displayScreen.scrollTop = displayScreen.scrollHeight;
        }
    });

    // (可选) 同时监听完整文本事件用于调试
    eventOn(iframe_events.STREAM_TOKEN_RECEIVED_FULLY, (full_text, id) => {
        if (id === generationId) {
            // 这个日志可以帮助你看到完整文本是如何增长的
            console.log(`[MOD21] Debug Event: STREAM_TOKEN_RECEIVED_FULLY for id: ${id}, full length: ${full_text.length}`);
        }
    });


    // 监听生成结束
    eventOn(iframe_events.GENERATION_ENDED, (final_text, id) => {
        if (id === generationId) {
            console.log(`[MOD21] Event: GENERATION_ENDED for id: ${id}. Final text length: ${final_text?.length || 0}.`);
            // 只有当 isGenerating 为 true 时才重置，避免多次触发
            if (isGenerating) {
                isGenerating = false;
                streamStarted = false;
                sendButton.textContent = '发送';
                sendButton.disabled = false;
                textInput.disabled = false;

                // 最终确认显示内容，以防流式有遗漏
                if (final_text) {
                    displayScreen.textContent = final_text;
                    displayScreen.scrollTop = displayScreen.scrollHeight;
                }
                console.log(`[MOD21] Generation process for ${id} fully completed and UI reset.`);
            } else {
                 console.log(`[MOD21] GENERATION_ENDED for ${id} received, but isGenerating was already false. Likely stopped by user.`);
                 // 确保UI在被中断后也是正确的状态
                 sendButton.textContent = '发送';
                 sendButton.disabled = false;
                 textInput.disabled = false;
                 streamStarted = false;
            }
        }
    });

    // 初始化
    console.log('[MOD21] IIFE setup complete. Loading API options...');
    loadApiOptions();

})();