(function() {
    console.log("[Mod] 全局数据调试器正在加载...");

    // ---------------------------------------------------------
    // 1. 定义专属 CSS 样式 (包含按钮动画和弹窗样式)
    // ---------------------------------------------------------
    const styles = `
        /* 悬浮球按钮 */
        .novamod-debug-ball {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #00f260 0%, #0575e6 100%);
            border-radius: 50%;
            box-shadow: 0 4px 15px rgba(5, 117, 230, 0.4);
            cursor: pointer;
            z-index: 9999; /* 确保在最上层 */
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 2px solid rgba(255,255,255,0.2);
            user-select: none;
        }

        .novamod-debug-ball:hover {
            transform: scale(1.1) rotate(90deg);
            box-shadow: 0 8px 25px rgba(5, 117, 230, 0.6);
        }

        .novamod-debug-ball::after {
            content: "{ }";
            color: white;
            font-weight: bold;
            font-family: monospace;
            font-size: 18px;
        }

        /* 弹窗遮罩 */
        .novamod-debug-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            z-index: 10000;
            display: none; /* 默认隐藏 */
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .novamod-debug-overlay.active {
            display: flex;
            opacity: 1;
        }

        /* 弹窗主要内容区 */
        .novamod-debug-modal {
            width: 80%;
            max-width: 800px;
            height: 70vh;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }

        .novamod-debug-overlay.active .novamod-debug-modal {
            transform: translateY(0);
        }

        /* 弹窗头部 */
        .novamod-debug-header {
            padding: 15px 20px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #222;
            border-radius: 12px 12px 0 0;
        }

        .novamod-debug-title {
            color: #00f260;
            font-weight: bold;
            font-size: 1.1rem;
        }

        .novamod-debug-close {
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            font-size: 20px;
            transition: color 0.2s;
        }

        .novamod-debug-close:hover {
            color: #fff;
        }

        /* JSON 内容展示区 */
        .novamod-debug-content {
            flex: 1;
            padding: 20px;
            overflow: auto;
            background: #0d0d0d;
            color: #cfcfcf;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 14px;
            white-space: pre-wrap; /* 允许换行 */
            word-break: break-all;
            margin: 0;
            border-radius: 0 0 12px 12px;
        }

        /* 滚动条美化 */
        .novamod-debug-content::-webkit-scrollbar {
            width: 8px;
        }
        .novamod-debug-content::-webkit-scrollbar-thumb {
            background: #333;
            border-radius: 4px;
        }
        .novamod-debug-content::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    `;

    // ---------------------------------------------------------
    // 2. 注入 CSS 到页面
    // ---------------------------------------------------------
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // ---------------------------------------------------------
    // 3. 创建 DOM 元素
    // ---------------------------------------------------------

    // 创建按钮
    const btn = document.createElement('div');
    btn.className = 'novamod-debug-ball';
    btn.title = "点击查看 assaSettingsData";
    document.body.appendChild(btn);

    // 创建弹窗结构
    const overlay = document.createElement('div');
    overlay.className = 'novamod-debug-overlay';
    overlay.innerHTML = `
        <div class="novamod-debug-modal">
            <div class="novamod-debug-header">
                <span class="novamod-debug-title">Current Global Data (assaSettingsData)</span>
                <button class="novamod-debug-close">×</button>
            </div>
            <pre class="novamod-debug-content" id="novamod-json-display"></pre>
        </div>
    `;
    document.body.appendChild(overlay);

    // 获取内部元素引用
    const closeBtn = overlay.querySelector('.novamod-debug-close');
    const contentArea = document.getElementById('novamod-json-display');

    // ---------------------------------------------------------
    // 4. 绑定交互逻辑
    // ---------------------------------------------------------

    // 打开弹窗
    btn.addEventListener('click', () => {
        // 获取实时数据，如果没有定义则显示提示
        let dataToShow = "Error: window.assaSettingsData is undefined.";

        if (window.assaSettingsData) {
            try {
                // 格式化 JSON，缩进2空格
                dataToShow = JSON.stringify(window.assaSettingsData, null, 2);
            } catch (e) {
                dataToShow = "Error parsing JSON: " + e.message;
            }
        }

        contentArea.textContent = dataToShow;
        overlay.classList.add('active');
    });

    // 关闭弹窗 (点击关闭按钮)
    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    // 关闭弹窗 (点击背景遮罩)
    // 注意：要在 overlay 上监听，并确保没有点到 modal 内容
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });

    console.log("[Mod] 全局数据调试器加载完毕！");
})();