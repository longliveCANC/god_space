(function() {
    // ==========================================
    // 0. 依赖加载 (GSAP 动画库)
    // ==========================================
    const GSAP_CDN = "https://unpkg.com/gsap@3.12.5/dist/gsap.min.js";

    if (!document.querySelector(`script[src="${GSAP_CDN}"]`)) {
        const script = document.createElement('script');
        script.src = GSAP_CDN;
        document.head.appendChild(script);
    }

    // ==========================================
    // 1. 样式注入 (CSS - mod03)
    // ==========================================
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@500;700&display=swap');

        /* --- 容器与遮罩 --- */
        #mod03-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at center, #1a0b2e 0%, #000000 100%);
            z-index: 9999; display: none; opacity: 0;
            font-family: 'Rajdhani', sans-serif;
            overflow: hidden;
            user-select: none;
        }
        #mod03-overlay.active { display: flex; opacity: 1; transition: opacity 0.3s ease; }

        /* --- 背景装饰 --- */
        .mod03-bg-grid {
            position: absolute; top: 0; left: 0; width: 200%; height: 200%;
            background-image:
                linear-gradient(rgba(255, 0, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 40px 40px;
            transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px);
            animation: mod03-grid-move 20s linear infinite;
            z-index: 0;
            pointer-events: none;
        }
        @keyframes mod03-grid-move { 0% { transform: perspective(500px) rotateX(60deg) translateY(0); } 100% { transform: perspective(500px) rotateX(60deg) translateY(40px); } }

        /* --- 主机体 (Slot Machine Frame) --- */
 #mod03-machine-container {
    position: relative; z-index: 10;
    width: 90%; max-width: 1200px;
    height: auto; /* 改为 auto，移除固定高度 */
    margin: auto;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding-bottom: 120px; /* 为底部按钮预留空间 */
}
        /* 顶部招牌 */
        .mod03-header {
            text-align: center; margin-bottom: 20px;
            text-transform: uppercase; letter-spacing: 5px;
            color: #fff; text-shadow: 0 0 10px #f0f, 0 0 20px #f0f, 0 0 40px #f0f;
            font-family: 'Orbitron', sans-serif; font-weight: 900; font-size: 3rem;
            border: 4px solid #fff; padding: 10px 40px;
            border-radius: 10px;
            background: rgba(0,0,0,0.5);
            box-shadow: inset 0 0 20px #f0f;
            position: relative;
        }
        .mod03-header::before { content:''; position:absolute; top:-10px; left:10px; width:10px; height:10px; background:#fff; border-radius:50%; box-shadow:0 0 10px #fff; animation: mod03-blink 1s infinite; }
        .mod03-header::after { content:''; position:absolute; top:-10px; right:10px; width:10px; height:10px; background:#fff; border-radius:50%; box-shadow:0 0 10px #fff; animation: mod03-blink 1s infinite 0.5s; }

        /* 滚轮区域 */
        #mod03-reels-viewport {
            display: grid;
            grid-template-columns: repeat(5, 1fr); /* 默认5列 */
            gap: 15px;
            padding: 20px;
            background: #000;
            border: 8px solid #333;
            border-radius: 15px;
            box-shadow:
                0 0 0 4px #000,
                0 0 0 8px #d4af37, /* 金边 */
                0 0 30px rgba(212, 175, 55, 0.5),
                inset 0 0 50px #000;
            width: 100%;
            max-height: 60vh;
            overflow: hidden;
            position: relative;
        }

        /* 滚轮遮罩光效 */
        #mod03-reels-viewport::after {
            content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.9) 100%);
            pointer-events: none; z-index: 20;
        }

        /* 单个滚轮轨道 */
        .mod03-reel-track {
            position: relative;
            height: 200px; /* 可视高度 */
            background: #111;
            border: 2px solid #444;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: inset 0 0 10px #000;
        }

        /* 滚轮内容条带 */
        .mod03-reel-strip {
            position: absolute; top: 0; left: 0; width: 100%;
            /* 初始位置让第一个元素居中 */
        }

        /* 滚轮内的卡片 */
        .mod03-card {
            height: 200px; /* 必须与 track 高度一致 */
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            padding: 10px; box-sizing: border-box;
            border-bottom: 1px dashed #333;
            background: #151515;
            color: #fff;
            text-align: center;
            position: relative;
        }

        /* 稀有度边框与光效 */
        .mod03-card[data-tier="5"] { border: 2px solid #ffd700; box-shadow: inset 0 0 20px #ffd700; background: rgba(255, 215, 0, 0.1); }
        .mod03-card[data-tier="4"] { border: 2px solid #ff00ff; box-shadow: inset 0 0 20px #ff00ff; background: rgba(255, 0, 255, 0.1); }
        .mod03-card[data-tier="3"] { border: 2px solid #00ffff; box-shadow: inset 0 0 20px #00ffff; background: rgba(0, 255, 255, 0.1); }
        .mod03-card[data-tier="2"] { border: 1px solid #4a6b8a; }

        .mod03-card-icon { font-size: 2rem; margin-bottom: 10px; filter: drop-shadow(0 0 5px currentColor); }
        .mod03-card-name { font-size: 0.9rem; font-weight: bold; line-height: 1.2; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
        .mod03-card-type { font-size: 0.7rem; color: #888; margin-top: 5px; text-transform: uppercase; }

        /* 模糊效果 (转动时添加) */
        .mod03-blur { filter: blur(4px); }

.mod03-controls {
    margin-top: 30px;
    display: flex; gap: 20px;
    background: #222;
    padding: 15px 30px;
    border-radius: 50px;
    border: 4px solid #555;
    box-shadow: 0 10px 20px rgba(0,0,0,0.8);
    position: relative;
    flex-shrink: 0; /* 防止被压缩 */
}
        /* 按钮样式 */
        .mod03-btn {
            background: linear-gradient(180deg, #ff4444 0%, #990000 100%);
            border: none; border-radius: 50%;
            width: 80px; height: 80px;
            color: #fff; font-family: 'Orbitron', sans-serif; font-weight: bold; font-size: 1rem;
            cursor: pointer;
            box-shadow: 0 5px 0 #550000, 0 10px 10px rgba(0,0,0,0.5);
            transition: transform 0.1s, box-shadow 0.1s;
            text-shadow: 0 2px 2px rgba(0,0,0,0.5);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            line-height: 1.1;
        }
        .mod03-btn:active { transform: translateY(5px); box-shadow: 0 0 0 #550000, inset 0 5px 10px rgba(0,0,0,0.5); }
        .mod03-btn:disabled { filter: grayscale(100%); cursor: not-allowed; transform: none; box-shadow: none; opacity: 0.5; }

        .mod03-btn.green { background: linear-gradient(180deg, #44ff44 0%, #009900 100%); box-shadow: 0 5px 0 #005500, 0 10px 10px rgba(0,0,0,0.5); color: #003300; }
        .mod03-btn.green:active { box-shadow: 0 0 0 #005500, inset 0 5px 10px rgba(0,0,0,0.5); }

        .mod03-btn span { font-size: 0.7rem; opacity: 0.8; }

        /* 关闭按钮 */
        #mod03-close {
            position: absolute; top: 20px; right: 20px;
            background: transparent; border: 2px solid #555; color: #555;
            width: 40px; height: 40px; border-radius: 50%;
            font-size: 24px; cursor: pointer; z-index: 100;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.3s;
        }
        #mod03-close:hover { border-color: #f00; color: #f00; box-shadow: 0 0 10px #f00; }

#mod03-detail-modal {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0);
    width: 90%; /* 改为响应式宽度 */
    max-width: 400px; /* 添加最大宽度 */
    max-height: 80vh; /* 添加最大高度 */
    overflow-y: auto; /* 允许滚动 */
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid #d4af37;
    padding: 20px; color: #fff; z-index: 200;
    text-align: center;
    box-shadow: 0 0 50px rgba(212, 175, 55, 0.3);
    pointer-events: none; opacity: 0;
}
    #mod03-detail-desc {
    word-wrap: break-word; /* 强制长单词换行 */
    overflow-wrap: break-word;
    white-space: pre-wrap; /* 保留换行并自动换行 */
}

#mod03-detail-stats {
    word-wrap: break-word;
    overflow-wrap: break-word;
}
        #mod03-detail-modal.show { pointer-events: auto; opacity: 1; transform: translate(-50%, -50%) scale(1); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        /* 动画关键帧 */
        @keyframes mod03-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        /* --- 响应式适配 --- */
        @media (max-width: 768px) {
            .mod03-header { font-size: 1.8rem; padding: 5px 20px; width: 80%; }

            /* 手机端改为 2列布局，或者单列滚动 */
            #mod03-reels-viewport {
                grid-template-columns: repeat(2, 1fr); /* 手机端两列 */
                max-height: 50vh;
                overflow-y: auto; /* 允许内部滚动如果溢出 */
                gap: 10px;
                padding: 10px;
            }

            /* 十连抽时，手机端可能需要显示更多行 */
            #mod03-reels-viewport.ten-pull {
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(5, 1fr); /* 5行2列 = 10 */
                height: 60vh;
            }

            .mod03-reel-track { height: 120px; } /* 手机端卡片变矮 */
            .mod03-card { height: 120px; padding: 5px; }
            .mod03-card-icon { font-size: 1.5rem; margin-bottom: 2px; }
            .mod03-card-name { font-size: 0.8rem; }

            .mod03-controls { padding: 10px 20px; gap: 10px; width: 90%; justify-content: center; }
            .mod03-btn { width: 60px; height: 60px; font-size: 0.8rem; }
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 2. DOM 结构构建
    // ==========================================
    const overlay = document.createElement('div');
    overlay.id = 'mod03-overlay';
    overlay.innerHTML = `
        <div class="mod03-bg-grid"></div>
        <button id="mod03-close">✕</button>

        <div id="mod03-machine-container">
            <div class="mod03-header">JACKPOT GACHA</div>

            <div id="mod03-reels-viewport">

                <div style="grid-column: 1/-1; text-align: center; color: #666; padding-top: 80px;">
                    INSERT COIN TO START
                </div>
            </div>

            <div class="mod03-controls">
                <button id="mod03-btn-single" class="mod03-btn">
                    SPIN<span>160 PTS</span>
                </button>
                <button id="mod03-btn-ten" class="mod03-btn">
                    AUTO<span>1440 PTS</span>
                </button>
                <button id="mod03-btn-confirm" class="mod03-btn green" style="display:none; width: 100px; border-radius: 10px;">
                    COLLECT
                </button>
            </div>
        </div>

        <div id="mod03-detail-modal">
            <h2 id="mod03-detail-name" style="color:#d4af37; margin:0;"></h2>
            <div id="mod03-detail-type" style="color:#888; font-size:0.8rem; margin:5px 0;"></div>
            <p id="mod03-detail-desc" style="font-style:italic; color:#ccc; font-size:0.9rem;"></p>
            <div id="mod03-detail-stats" style="color:#0ff; font-size:0.8rem; margin-top:10px;"></div>
            <button id="mod03-detail-close" style="margin-top:15px; background:transparent; border:1px solid #fff; color:#fff; padding:5px 15px; cursor:pointer;">CLOSE</button>
        </div>
    `;
    document.body.appendChild(overlay);

    // ==========================================
    // 3. 逻辑核心
    // ==========================================
    let isAnimating = false;
    let currentResults = [];
    const viewport = document.getElementById('mod03-reels-viewport');

    // 辅助：获取稀有度颜色
    function getTierInfo(price) {
        if (price >= 8000) return { color: '#ffd700', tier: 5, icon: '👑' };
        if (price >= 1000) return { color: '#ff00ff', tier: 4, icon: '💎' };
        if (price >= 200)  return { color: '#00ffff', tier: 3, icon: '💠' };
        if (price >= 80)   return { color: '#4a6b8a', tier: 2, icon: '📦' };
        return { color: '#555555', tier: 1, icon: '🗑️' };
    }

    // 生成单个卡片的 HTML
    function createCardHTML(item, isDummy = false) {
        // item: [name, price, type, id, stats, desc]
        // 如果是 dummy，随机生成一些看起来像垃圾的内容
        let name, tier, icon;

        if (isDummy) {
            const dummies = [
                {n: "Empty Can", p: 10}, {n: "Broken Sword", p: 50}, {n: "Old Coin", p: 5},
                {n: "Rust", p: 1}, {n: "Glitch", p: 100}, {n: "777", p: 500}
            ];
            const d = dummies[Math.floor(Math.random() * dummies.length)];
            name = d.n;
            tier = getTierInfo(d.p);
            icon = "?";
        } else {
            name = item[0];
            tier = getTierInfo(item[1]);
            icon = tier.icon;
        }

        return `
            <div class="mod03-card" data-tier="${tier.tier}" style="color:${tier.color}">
                <div class="mod03-card-icon">${icon}</div>
                <div class="mod03-card-name">${name}</div>
                ${!isDummy ? `<div class="mod03-card-type">${item[2]}</div>` : ''}
            </div>
        `;
    }

    // 核心：开始抽奖
    async function startGacha(count) {
        if (isAnimating) return;

        // 1. 检查积分
        const GACHA_CONFIG = { singleCost: 160, tenCost: 1440 };
        const cost = count === 1 ? GACHA_CONFIG.singleCost : GACHA_CONFIG.tenCost;
        let currentPoints = 0;
        try {
            if (window.GameAPI && window.GameAPI.playCharacterData) {
                currentPoints = window.GameAPI.playCharacterData.货币段.积分[0];
            } else {
                currentPoints = 999999; // Fallback
            }
        } catch (e) {}

        if (currentPoints < cost) {
            if(typeof worldHelper !== 'undefined') worldHelper.showNovaAlert(`INSUFFICIENT FUNDS\nREQ: ${cost}`);
            else alert("积分不足");
            return;
        }

        // 2. 获取数据
        if (window.GameAPI && window.GameAPI.performGacha) {
            currentResults = await window.GameAPI.performGacha(count);
        } else {
            // 模拟数据用于测试
            currentResults = Array(count).fill(0).map((_,i) => [`Item ${i}`, Math.random()*10000, "Weapon", "001", "ATK+10", "Desc"]);
        }

        if (!currentResults || currentResults.length === 0) return;

        // 3. 准备 UI
        isAnimating = true;
        document.getElementById('mod03-btn-single').style.display = 'none';
        document.getElementById('mod03-btn-ten').style.display = 'none';
        document.getElementById('mod03-btn-confirm').style.display = 'none';

        // 清空并重置视口布局
        viewport.innerHTML = '';
        viewport.className = count === 10 ? 'ten-pull' : '';

        // 根据数量调整网格
        if (count === 1) {
            viewport.style.gridTemplateColumns = "1fr"; // 单抽居中大显示
            viewport.style.gridTemplateRows = "1fr";
        } else {
            // 手机端在 CSS 里处理了，这里主要处理 PC
            if (window.innerWidth > 768) {
                viewport.style.gridTemplateColumns = "repeat(5, 1fr)";
                viewport.style.gridTemplateRows = "repeat(2, 1fr)";
            }
        }

        // 4. 生成滚轮 (Reels)
        const reels = [];
        const cardHeight = window.innerWidth > 768 ? 200 : 120; // 对应 CSS 高度

        currentResults.forEach((item, index) => {
            const track = document.createElement('div');
            track.className = 'mod03-reel-track';

            const strip = document.createElement('div');
            strip.className = 'mod03-reel-strip';

            // 构建条带：前面放一堆假数据，最后一个是真数据
            let stripHTML = '';
            const dummyCount = 10 + Math.floor(Math.random() * 5); // 随机转动圈数

            for(let i=0; i<dummyCount; i++) {
                stripHTML += createCardHTML(null, true);
            }
            // 放入真结果
            stripHTML += createCardHTML(item, false);

            strip.innerHTML = stripHTML;
            track.appendChild(strip);
            viewport.appendChild(track);

            reels.push({
                el: strip,
                targetY: -(dummyCount * cardHeight), // 向上移动的高度
                item: item
            });

            // 点击查看详情事件
            track.addEventListener('click', () => {
                if (!isAnimating) showDetail(item);
            });
        });

        // 5. 执行 GSAP 动画
        if (typeof gsap !== 'undefined') {
            reels.forEach((reel, i) => {
                // 初始模糊
                gsap.set(reel.el, { filter: "blur(0px)" });

                // 动画序列
                const tl = gsap.timeline();

                // 1. 加速阶段 (模糊)
                tl.to(reel.el, {
                    y: reel.targetY * 0.8, // 移动大部分距离
                    duration: 1 + (i * 0.2), // 依次停下
                    ease: "power2.in",
                    onStart: () => gsap.to(reel.el, { filter: "blur(4px)", duration: 0.2 })
                });

                // 2. 减速急停 (回弹效果)
                tl.to(reel.el, {
                    y: reel.targetY,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)", // 机械回弹感
                    onStart: () => gsap.to(reel.el, { filter: "blur(0px)", duration: 0.1 }),
                    onComplete: () => {
                        // 播放音效提示 (视觉代替)
                        const track = reel.el.parentElement;
                        track.style.boxShadow = "inset 0 0 30px #fff";
                        setTimeout(() => track.style.boxShadow = "inset 0 0 10px #000", 200);

                        // 如果是高稀有度，添加闪光
                        const tier = getTierInfo(reel.item[1]);
                        if (tier.tier >= 4) {
                            track.style.border = `2px solid ${tier.color}`;
                            track.style.boxShadow = `0 0 20px ${tier.color}`;
                        }
                    }
                });
            });

            // 动画总时长结束后显示确认按钮
            const totalDuration = (1 + (reels.length * 0.2) + 0.5) * 1000;
            setTimeout(() => {
                isAnimating = false;
                const btn = document.getElementById('mod03-btn-confirm');
                btn.style.display = 'flex';
                gsap.fromTo(btn, {scale: 0}, {scale: 1, duration: 0.5, ease: "back.out"});
            }, totalDuration);

        } else {
            // Fallback if GSAP fails
            console.error("GSAP not loaded");
            isAnimating = false;
        }
    }

    // 确认并结算
    async function confirmAndReset() {
        // 结算逻辑
        if (window.GameAPI && typeof window.processGachaRewards === 'function') {
            try {
                await window.processGachaRewards(currentResults);
            } catch (e) { console.error(e); }
        }

        // UI 重置
        const btn = document.getElementById('mod03-btn-confirm');
        gsap.to(btn, { scale: 0, duration: 0.2, onComplete: () => {
            btn.style.display = 'none';
            document.getElementById('mod03-btn-single').style.display = 'flex';
            document.getElementById('mod03-btn-ten').style.display = 'flex';

            // 清空滚轮
            viewport.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #666; padding-top: 80px;">READY FOR NEXT SPIN</div>';
        }});
    }

    // 显示详情
    function showDetail(item) {
        const modal = document.getElementById('mod03-detail-modal');
        const tier = getTierInfo(item[1]);

        document.getElementById('mod03-detail-name').innerText = item[0];
        document.getElementById('mod03-detail-name').style.color = tier.color;
        document.getElementById('mod03-detail-type').innerText = `[${item[2]}] Value: ${item[1]}`;
        document.getElementById('mod03-detail-desc').innerText = item[5] || "No description.";
        document.getElementById('mod03-detail-stats').innerText = item[4] || "";

        modal.classList.add('show');
    }

    // ==========================================
    // 4. 事件绑定
    // ==========================================
    document.getElementById('mod03-btn-single').addEventListener('click', () => startGacha(1));
    document.getElementById('mod03-btn-ten').addEventListener('click', () => startGacha(10));
    document.getElementById('mod03-btn-confirm').addEventListener('click', confirmAndReset);

    document.getElementById('mod03-close').addEventListener('click', () => {
        document.getElementById('mod03-overlay').classList.remove('active');
    });

    document.getElementById('mod03-detail-close').addEventListener('click', () => {
        document.getElementById('mod03-detail-modal').classList.remove('show');
    });

    // 外部入口
    const entryBtn = document.getElementById('enter-gacha01-btn');
    if(entryBtn) {
        entryBtn.style.display = 'block';
        // 移除旧的监听器 (如果需要完全替换，最好是克隆节点)
        const newBtn = entryBtn.cloneNode(true);
        entryBtn.parentNode.replaceChild(newBtn, entryBtn);

        newBtn.addEventListener('click', () => {
            document.getElementById('mod03-overlay').classList.add('active');
        });
    }

})();
