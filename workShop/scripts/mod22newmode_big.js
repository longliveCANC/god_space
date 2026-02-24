(function() {
    'use strict';

    // --- 步骤 1: 检查是否为新游戏，这是执行所有操作的前提 ---
    const isNewGame = (typeof conversationHistory !== 'undefined' && conversationHistory.length !== 0);

    if (isNewGame) {
        console.log("检测到已有对话历史，不加载自定义开局覆盖层。");
        return; // 如果不是新游戏，则终止脚本，不执行任何操作。
    }

    console.log("检测到新游戏，开始加载自定义开局覆盖层...");

    // --- 步骤 2: 定义并注入CSS以彻底隐藏原始页面 ---
    const styles = `
        #page-0, #page-1, #page-2,   #top-hud, #bottom-hud {
            display: none !important;
            visibility: hidden !important;
        }
        #mod22-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(0, 0, 0, 0.7); display: flex;
            justify-content: center; align-items: center; flex-direction: column;
            z-index: 9999; padding: 20px; box-sizing: border-box;
            opacity: 1; transition: opacity 0.5s ease-out;
        }
        #mod22-overlay.mod22-hidden {
            opacity: 0;
            pointer-events: none; /* 隐藏后不可交互 */
        }
        #mod22-input {
            width: 80%; max-width: 600px; padding: 15px 20px; font-size: 1.2em;
            color: #E0E0E0; background-color: #2C2C2C; border: 2px solid #4A90E2;
            border-radius: 8px; text-align: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            outline: none; transition: all 0.3s ease;
        }
        #mod22-input::placeholder { color: #777; }
        #mod22-input:focus { border-color: #81C784; box-shadow: 0 0 20px rgba(74, 144, 226, 0.5); }
        #mod22-submit-btn {
            margin-top: 20px; padding: 10px 25px; font-size: 1em; color: #FFFFFF;
            background-color: #4A90E2; border: none; border-radius: 5px;
            cursor: pointer; transition: background-color 0.3s ease, opacity 0.3s ease;
        }
        #mod22-submit-btn:hover { background-color: #357ABD; }
        #mod22-submit-btn:disabled { background-color: #555; cursor: not-allowed; opacity: 0.7; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    console.log("CSS注入成功：已隐藏原始页面并定义了新UI样式。");

    // --- 步骤 3: 创建并插入新的UI元素 ---
    const overlay = document.createElement('div');
    overlay.id = 'mod22-overlay';
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'mod22-input';
    input.placeholder = '在此处输入您的开局指令...';
    const submitBtn = document.createElement('button');
    submitBtn.id = 'mod22-submit-btn';
    submitBtn.textContent = '确认开启';
    overlay.appendChild(input);
    overlay.appendChild(submitBtn);
    document.body.appendChild(overlay);
    console.log("新UI创建成功：已将自定义输入框和按钮插入页面。");

    // --- 步骤 4: 定义新的、适配的指令发送函数 ---
    async function mod22_sendCommand(command, button) {
        if (button.disabled) return;

        // --- 新增逻辑：立刻开始隐藏覆盖层 ---
        
        overlay.classList.add('mod22-hidden');
        // 在动画结束后彻底移除，以释放资源
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
                console.log("覆盖层已从DOM中移除。");
            }
        }, 500); // 这里的延迟应与CSS中的transition时间匹配

        button.disabled = true;
        button.textContent = `[ 指令发送中... ]`;

        try {
            const finalSlashCommand = `/setinput ${command}`;
          
            await triggerassa(finalSlashCommand);
             
   conversationHistory.push({ role: 'assistant', content: '[系统提示:等待用户输入要求...]' });
 
            await saveHistory();
            worldHelper.renderHistory();
  
        } catch (e) {
            console.error("[mod22] ❌ 发送指令时发生严重错误:", e);
            toastr.error("指令发送失败，请检查控制台获取详细信息。");
        }
    }

    // --- 步骤 5: 为新按钮绑定发送函数 ---
    submitBtn.addEventListener('click', () => {
        const command = input.value.trim();
        if (command) {
            mod22_sendCommand(command, submitBtn);
        } else {
            toastr.warning("请输入开局指令后再点击确认。");
        }
    });

    console.log("初始化完成：自定义开局覆盖层已准备就绪。");

})();
