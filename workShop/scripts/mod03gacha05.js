(function() {
    // ==========================================
    // 0. 依赖与配置
    // ==========================================
    // 引入 canvas-confetti 用于轻量级庆祝特效
    const CONFETTI_CDN = "https://unpkg.com/canvas-confetti@1.6.0/dist/confetti.module.mjs";

    // ==========================================
    // 1. 样式注入 (CSS - Mod03 Namespace)
    // ==========================================
    const theme = {
        primary: window.GameAPI?.getThemeVar('--primary-color') || '#00faff',
        bg: '#ff0000', // 疯狂红
        yellow: '#fff200', // 爆炸黄
        black: '#1a1a1a',
        white: '#ffffff'
    };

    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bangers&family=Noto+Sans+SC:wght@900&display=swap');

        /* 核心容器 */
        #mod03-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: ${theme.black}; z-index: 9999; display: none;
            font-family: 'Anton', 'Noto Sans SC', sans-serif;
            overflow: hidden;
            user-select: none;
        }
        #mod03-overlay.active { display: flex; flex-direction: column; }

        /* 动态放射背景 */
        .mod03-sunburst {
            position: absolute; top: 50%; left: 50%;
            width: 200vmax; height: 200vmax;
            background: repeating-conic-gradient(
                from 0deg,
                #ff0000 0deg 15deg,
                #ff3333 15deg 30deg
            );
            transform: translate(-50%, -50%);
            animation: mod03-spin 20s linear infinite;
            z-index: 0;
            opacity: 0.8;
        }

        /* 噪点纹理 (模拟廉价印刷纸质感) */
        .mod03-noise {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E");
            pointer-events: none; z-index: 1;
            mix-blend-mode: multiply;
        }

        /* UI 层 */
        #mod03-ui-layer {
            position: relative; z-index: 10; width: 100%; height: 100%;
            display: flex; flex-direction: column;
            box-sizing: border-box;
        }

        /* 顶部标题 - 固定在顶部 */
        .mod03-header {
            text-align: center;
            transform: rotate(-2deg);
            padding: 20px;
            flex-shrink: 0;
        }
        .mod03-title-box {
            display: inline-block;
            background: ${theme.yellow};
            color: #ff0000;
            padding: 10px 40px;
            border: 5px solid #000;
            box-shadow: 10px 10px 0px #000;
            font-size: 3rem;
            line-height: 1;
            text-transform: uppercase;
            animation: mod03-pulse 0.5s infinite alternate;
        }
        .mod03-subtitle {
            background: #000; color: #fff;
            display: inline-block; padding: 5px 20px;
            font-size: 1.2rem; transform: rotate(2deg) translateY(-10px);
            border: 2px solid #fff;
        }

        /* 物品展示区 (货架) - 可滚动区域 */
        #mod03-shelf-container {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 20px;
            box-sizing: border-box;
        }

        #mod03-shelf {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-content: flex-start;
            gap: 15px;
            perspective: 1000px;
            min-height: 100%;
        }

        /* 单个商品卡片 (优惠券风格) */
        .mod03-card {
            width: 160px; height: 240px;
            background: #fff;
            border: 4px dashed #000;
            position: relative;
            display: flex; flex-direction: column;
            align-items: center;
            padding: 10px; box-sizing: border-box;
            transform: scale(0); /* 初始隐藏 */
            transition: transform 0.2s;
            cursor: pointer;
            background-image: radial-gradient(#eee 10%, transparent 10%);
            background-size: 10px 10px;
            flex-shrink: 0;
        }
        .mod03-card:hover { transform: scale(1.1) rotate(2deg) !important; z-index: 20; }

        /* 稀有度边框特效 */
        .mod03-card[data-tier="5"] { border: 5px solid #ffd700; box-shadow: 0 0 20px #ffd700; animation: mod03-shake 2s infinite; }
        .mod03-card[data-tier="4"] { border: 4px solid #ff00ff; }

        .mod03-card-img {
            width: 100%; height: 100px;
            background: #333;
            margin-bottom: 10px;
            display: flex; align-items: center; justify-content: center;
            color: #fff; font-size: 2rem;
            border: 2px solid #000;
        }
        .mod03-card-name {
            font-size: 1rem; font-weight: 900; text-align: center;
            line-height: 1.1; color: #000;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .mod03-card-price {
            margin-top: auto;
            background: #ff0000; color: ${theme.yellow};
            padding: 2px 10px; font-size: 1.2rem;
            transform: rotate(-5deg);
            border: 2px solid #000;
            box-shadow: 3px 3px 0 #000;
        }
        /* 爆炸贴纸 (NEW/HOT) */
        .mod03-sticker {
            position: absolute; top: -15px; right: -15px;
            width: 50px; height: 50px;
            background: ${theme.yellow};
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 0.8rem; color: #ff0000; font-weight: bold;
            border: 2px solid #000;
            transform: rotate(15deg);
            z-index: 5;
        }
        /* 遮罩层 (未翻开状态) */
        .mod03-mystery-cover {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: repeating-linear-gradient(45deg, #000, #000 10px, #333 10px, #333 20px);
            display: flex; align-items: center; justify-content: center;
            color: #fff; font-size: 3rem; z-index: 10;
            transition: opacity 0.3s;
        }
        .mod03-mystery-cover.revealed { opacity: 0; pointer-events: none; }

        /* 控制区 - 固定在底部 */
        .mod03-controls {
            display: flex; justify-content: center; gap: 20px;
            padding: 20px;
            flex-shrink: 0;
            background: linear-gradient(to top, ${theme.black} 80%, transparent);
        }
 .mod03-btn {
    background: #fff; color: #000;
    border: 4px solid #000;
    padding: 15px 30px;
    font-family: 'Bangers', cursive;
    font-size: 1.5rem; letter-spacing: 2px;
    cursor: pointer;
    box-shadow: 8px 8px 0px #000;
    transition: all 0.1s;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
}
.mod03-btn span {
    color: #000;
}
        .mod03-btn:active { transform: translate(4px, 4px); box-shadow: 4px 4px 0px #000; }
        .mod03-btn:hover { background: ${theme.yellow}; }
        .mod03-btn.primary { background: #ff0000; color: ${theme.yellow}; }
        .mod03-btn:disabled { filter: grayscale(100%); cursor: not-allowed; }

        /* 关闭按钮 */
        #mod03-close {
            position: absolute; top: 20px; right: 20px;
            width: 50px; height: 50px; background: #000; color: #fff;
            border: none; font-size: 2rem; cursor: pointer;
            clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);
            z-index: 100;
        }
        #mod03-close:hover { background: #ff0000; transform: scale(1.1); }

        /* 详情弹窗 (营养成分表风格) */
        #mod03-detail-modal {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 90%; max-width: 400px;
            background: #fff; border: 6px solid #000;
            padding: 0; display: none; z-index: 200;
            box-shadow: 20px 20px 0 rgba(0,0,0,0.5);
            font-family: 'Noto Sans SC', sans-serif;
            max-height: 80vh; flex-direction: column;
        }
        .mod03-detail-header {
            background: #000; color: #fff; padding: 15px;
            font-size: 1.5rem; font-weight: 900; text-transform: uppercase;
            border-bottom: 4px solid #000;
        }
        .mod03-detail-content {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }
        .mod03-detail-row {
        color:black;
            display: flex; justify-content: space-between;
            border-bottom: 2px solid #000; padding: 8px 0;
            font-weight: bold;
        }
        .mod03-desc-box {
         color:black;
            margin-top: 15px; padding: 10px;
            background: #eee; border: 2px solid #000;
            font-size: 0.9rem; line-height: 1.5;
            white-space: pre-wrap;
        }
        .mod03-detail-close {
            width: 100%; padding: 15px;
            background: #ff0000; color: #fff; border: none;
            font-size: 1.2rem; font-weight: bold; cursor: pointer;
            border-top: 4px solid #000;
        }

        /* 动画定义 */
        @keyframes mod03-spin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes mod03-pulse { 0% { transform: scale(1); } 100% { transform: scale(1.05); } }
        @keyframes mod03-shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
        @keyframes mod03-stamp { 0% { transform: scale(3); opacity: 0; } 50% { transform: scale(0.8); opacity: 1; } 70% { transform: scale(1.1); } 100% { transform: scale(1); } }

        /* 移动端适配 */
        @media (max-width: 768px) {
            .mod03-title-box { font-size: 2rem; padding: 5px 20px; }
            .mod03-card { width: 130px; height: 200px; }
            .mod03-controls { flex-direction: column; align-items: center; gap: 10px; }
            .mod03-btn { width: 80%; font-size: 1.2rem; padding: 10px; }
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 2. DOM 结构构建
    // ==========================================
    const overlay = document.createElement('div');
    overlay.id = 'mod03-overlay';
    overlay.innerHTML = `
        <div class="mod03-sunburst"></div>
        <div class="mod03-noise"></div>

        <div id="mod03-ui-layer">
            <button id="mod03-close">✕</button>

            <div class="mod03-header">
                <div class="mod03-title-box">疯狂大促销!</div>
                <br>
                <div class="mod03-subtitle">全场清仓!</div>
            </div>

            <div id="mod03-shelf-container">
                <div id="mod03-shelf"></div>
            </div>

            <div class="mod03-controls">
                <div id="mod03-start-btns" style="display:flex; gap:10px; width:100%; justify-content:center;">
                    <button id="mod03-btn-single" class="mod03-btn">
                        快速购买<br><span style="font-size:0.8rem">160 积分</span>
                    </button>
                    <button id="mod03-btn-ten" class="mod03-btn primary">
                        批量订购<br><span style="font-size:0.8rem">1440 积分</span>
                    </button>
                </div>
                <button id="mod03-btn-confirm" class="mod03-btn primary" style="display:none;">打印小票</button>
            </div>
        </div>

        <div id="mod03-detail-modal">
            <div class="mod03-detail-header">商品详情</div>
            <div class="mod03-detail-content">
                <div class="mod03-detail-row">
                    <span>商品名称</span>
                    <span id="mod03-det-name" style="color:#ff0000"></span>
                </div>
                <div class="mod03-detail-row">
                    <span>价值</span>
                    <span id="mod03-det-price"></span>
                </div>
                <div class="mod03-detail-row">
                    <span>类型</span>
                    <span id="mod03-det-type"></span>
                </div>
                <div class="mod03-desc-box" id="mod03-det-desc"></div>
                <div style="margin-top:10px; font-size:0.7rem; color:#666; text-align:center;">
                    * 实际效果可能因个人运气而异
                </div>
            </div>
            <button class="mod03-detail-close">关闭</button>
        </div>
    `;
    document.body.appendChild(overlay);

    // ==========================================
    // 3. 逻辑核心
    // ==========================================
    let isAnimating = false;
    let currentResults = [];
    let confettiModule = null;

    // 动态加载 Confetti
    import(CONFETTI_CDN).then((module) => {
        confettiModule = module.default;
    });

    // 辅助:获取稀有度颜色/等级
    function getTierInfo(price) {
        if (price >= 8000) return { tier: 5, label: "大奖" };
        if (price >= 1000) return { tier: 4, label: "超值" };
        if (price >= 200)  return { tier: 3, label: "稀有" };
        if (price >= 80)   return { tier: 2, label: "特价" };
        return { tier: 1, label: "促销" };
    }

    // 核心:开始抽卡
    async function startGacha(count) {
        if (isAnimating) return;

        // 1. 积分检查
        const GACHA_CONFIG = { singleCost: 160, tenCost: 1440 };
        const cost = count === 1 ? GACHA_CONFIG.singleCost : GACHA_CONFIG.tenCost;
        let currentPoints = 0;
        try {
            if (window.GameAPI && window.GameAPI.playCharacterData) {
                currentPoints = window.GameAPI.playCharacterData.货币段.积分[0];
            } else {
                currentPoints = 999999; // Fallback
            }
        } catch (e) { console.error(e); }

        if (currentPoints < cost) {
            alert(`积分不足!\n需要: ${cost} 积分`);
            return;
        }

        // 2. 获取数据
        if (window.GameAPI && window.GameAPI.performGacha) {
            currentResults = await window.GameAPI.performGacha(count);
        } else {
            console.error("API 缺失"); return;
        }

        if (!currentResults || currentResults.length === 0) return;

        // 3. 开始动画流程
        isAnimating = true;
        document.getElementById('mod03-start-btns').style.display = 'none';
        const shelf = document.getElementById('mod03-shelf');
        shelf.innerHTML = ''; // 清空货架

        // 滚动到顶部
        document.getElementById('mod03-shelf-container').scrollTop = 0;

        // 逐个生成卡片
        let delay = 0;
        currentResults.forEach((item, index) => {
            const tier = getTierInfo(item[1]);
            const card = document.createElement('div');
            card.className = 'mod03-card';
            card.dataset.tier = tier.tier;
            card.style.transitionDelay = `${index * 0.1}s`; // 级联入场

            // 卡片内容
            card.innerHTML = `
                <div class="mod03-sticker">${tier.label}</div>
                <div class="mod03-mystery-cover">?</div>
                <div class="mod03-card-img">${item[0][0]}</div>
                <div class="mod03-card-name">${item[0]}</div>
                <div class="mod03-card-price">¥${item[1]}</div>
            `;

            // 绑定点击详情
            card.addEventListener('click', () => {
                if (!card.querySelector('.mod03-mystery-cover.revealed')) return; // 未翻开不能看详情
                showDetail(item);
            });

            shelf.appendChild(card);

            // 动画序列
            setTimeout(() => {
                card.style.transform = `scale(1) rotate(${Math.random() * 6 - 3}deg)`; // 随机微旋转入场

                // 自动翻开 (模拟盖章效果)
                setTimeout(() => {
                    const cover = card.querySelector('.mod03-mystery-cover');
                    cover.classList.add('revealed');
                    card.style.animation = 'mod03-stamp 0.3s ease-out forwards';

                    // 如果是高稀有度,触发纸屑
                    if (tier.tier >= 4 && confettiModule) {
                        const rect = card.getBoundingClientRect();
                        const x = (rect.left + rect.width / 2) / window.innerWidth;
                        const y = (rect.top + rect.height / 2) / window.innerHeight;
                        confettiModule({
                            particleCount: 50, spread: 60, origin: { x, y },
                            colors: ['#ff0000', '#ffd700', '#ffffff'],
                            zIndex: 10001
                        });
                    }
                }, 500 + (index * 200)); // 依次翻开

            }, 100);
        });

        // 动画结束,显示确认按钮
        setTimeout(() => {
            isAnimating = false;
            document.getElementById('mod03-btn-confirm').style.display = 'block';
            document.querySelector('.mod03-title-box').innerText = "结账完成!";
        }, 1000 + (currentResults.length * 200));
    }

    // 显示详情
    function showDetail(item) {
        const modal = document.getElementById('mod03-detail-modal');
        document.getElementById('mod03-det-name').innerText = item[0];
        document.getElementById('mod03-det-price').innerText = item[1] + " 积分";
        document.getElementById('mod03-det-type').innerText = item[2];
        document.getElementById('mod03-det-desc').innerText = item[5] + "\n\n" + item[4]; // 描述 + 属性

        modal.style.display = 'flex'; // 使用 flex 布局以支持内部滚动
    }

    // 确认并重置
    async function confirmAndReset() {
        // 结算逻辑
        if (window.GameAPI && typeof window.processGachaRewards === 'function') {
            await window.processGachaRewards(currentResults);
        }

        // UI 重置
        const shelf = document.getElementById('mod03-shelf');
        const cards = shelf.querySelectorAll('.mod03-card');

        // 离场动画:像收据一样被撕掉/飞走
        cards.forEach((c, i) => {
            c.style.transition = 'all 0.5s ease-in';
            c.style.transform = 'translateY(100vh) rotate(20deg)';
            c.style.opacity = '0';
        });

        setTimeout(() => {
            shelf.innerHTML = '';
            document.getElementById('mod03-btn-confirm').style.display = 'none';
            document.getElementById('mod03-start-btns').style.display = 'flex';
            document.querySelector('.mod03-title-box').innerText = "疯狂大促销!";
            document.getElementById('mod03-detail-modal').style.display = 'none';
        }, 500);
    }

    // ==========================================
    // 4. 事件绑定与入口
    // ==========================================
    document.getElementById('mod03-btn-single').addEventListener('click', () => startGacha(1));
    document.getElementById('mod03-btn-ten').addEventListener('click', () => startGacha(10));
    document.getElementById('mod03-btn-confirm').addEventListener('click', confirmAndReset);
    document.getElementById('mod03-close').addEventListener('click', () => {
        document.getElementById('mod03-overlay').classList.remove('active');
    });
    document.querySelector('.mod03-detail-close').addEventListener('click', () => {
        document.getElementById('mod03-detail-modal').style.display = 'none';
    });

    // 外部入口
    const entryBtn = document.getElementById('enter-gacha01-btn');
    if (entryBtn) {
        const newBtn = entryBtn.cloneNode(true);
        entryBtn.parentNode.replaceChild(newBtn, entryBtn);
        newBtn.style.display = 'block';
        newBtn.innerText = "进入折扣卖场";
        newBtn.addEventListener('click', () => {
            document.getElementById('mod03-overlay').classList.add('active');
        });
    }

})();