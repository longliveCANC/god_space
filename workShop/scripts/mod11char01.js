 (function() {
    // ============================================================
    // 1. 基础配置与 CSS (Mod11)
    // ============================================================
    const ORB_ID = 'page-character-orb'; // 请确认这是那个小球的ID
    const MODAL_ID = 'page-character-modal';

    const css = `
    :root {
        --mod11-bg: #121212;
        --mod11-text: #e0e0e0;
        --mod11-accent: #4a90e2;
    }
    /* 强制全屏 */
    #${MODAL_ID} .modal-content {
        background: var(--mod11-bg) !important;
        width: 100vw !important;
        height: 100vh !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        top: 0 !important;
        left: 0 !important;
        position: fixed !important;
        display: flex !important;
        flex-direction: column !important;
    }
    /* 我们的容器 */
    #mod11-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--mod11-text);
        font-family: sans-serif;
    }
    .mod11-close {
        position: absolute;
        top: 20px;
        right: 30px;
        font-size: 40px;
        cursor: pointer;
        color: var(--mod11-text);
        z-index: 100;
    }
    .mod11-data-display {
        font-size: 20px;
        margin-top: 20px;
        color: var(--mod11-accent);
    }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // ============================================================
    // 2. 状态管理 (单例模式)
    // ============================================================
    // 我们用这个对象来缓存 DOM 节点，避免每次都 document.getElementById
    const UI_CACHE = {
        isInitialized: false,
        root: null,
        nameDisplay: null, // 缓存名字显示的节点
        timeDisplay: null  // 缓存时间显示的节点
    };

    // ============================================================
    // 3. 初始化函数 (只运行一次)
    // ============================================================
    function initInterface() {
        console.log("Mod11: 正在构建 DOM 骨架...");
        const modal = document.getElementById(MODAL_ID);
        const content = modal.querySelector('.modal-content');

        // 1. 清空旧界面
        content.innerHTML = '';

        // 2. 创建关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.className = 'mod11-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            modal.classList.remove('active');
        };

        // 3. 创建主容器
        const container = document.createElement('div');
        container.id = 'mod11-container';
        container.innerHTML = `
            <h1>全屏重构界面</h1>
            <div class="mod11-data-display">
                角色: <span id="mod11-name-slot">加载中...</span>
            </div>
            <div class="mod11-data-display">
                更新时间: <span id="mod11-time-slot">--:--:--</span>
            </div>
        `;

        // 4. 组装
        content.appendChild(closeBtn);
        content.appendChild(container);

        // 5. 缓存关键节点引用 (性能优化的关键！)
        UI_CACHE.root = container;
        UI_CACHE.nameDisplay = document.getElementById('mod11-name-slot');
        UI_CACHE.timeDisplay = document.getElementById('mod11-time-slot');
        UI_CACHE.isInitialized = true;
    }

    // ============================================================
    // 4. 覆盖 Orb 点击事件 (只负责显示)
    // ============================================================
    function overrideOrbClick() {
        const orb = document.getElementById(ORB_ID);
        if (!orb) {
            console.error("Mod11: 找不到 Orb 元素，ID可能有误");
            return;
        }

        // 克隆节点以移除原有的所有事件监听器 (暴力覆盖)
        const newOrb = orb.cloneNode(true);
        orb.parentNode.replaceChild(newOrb, orb);

        // 绑定我们的点击事件
        newOrb.addEventListener('click', function() {
            console.log("Mod11: Orb 被点击，打开界面");
            const modal = document.getElementById(MODAL_ID);

            // 如果还没初始化 DOM，这时候初始化
            if (!UI_CACHE.isInitialized) {
                initInterface();
            }

            modal.style.display = 'block';
            modal.classList.add('active');
        });
    }

    // ============================================================
    // 5. 覆盖数据更新函数 (只负责更新数据)
    // ============================================================
    window.GameAPI.populateCharacterPage = function(playData, statData, assaData) {
        // 如果界面还没初始化（用户还没点过 Orb），我们就不更新 DOM，节省性能
        // 或者你也可以选择在这里强制初始化，看需求
        if (!UI_CACHE.isInitialized) {
            return;
        }

        // 性能优化：直接操作缓存的节点，而不是查询 DOM
        if (statData && statData.user) {
            UI_CACHE.nameDisplay.textContent = statData.user.name;
        }

        // 只是为了演示数据在流动
        UI_CACHE.timeDisplay.textContent = new Date().toLocaleTimeString();

        // 这里后续会写很多逻辑，比如：
        // if (playData.hp !== lastHp) UI_CACHE.hpBar.style.width = ...
    };

    // ============================================================
    // 启动脚本
    // ============================================================
    overrideOrbClick();
    console.log("Mod11: 系统已就绪。Orb 点击已接管，数据更新已挂载。");

})();
