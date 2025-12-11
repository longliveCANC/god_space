(function() {
    // ==========================================
    // 0. 依赖加载 (GSAP - 动画引擎)
    // ==========================================
    const GSAP_CDN = "https://unpkg.com/gsap@3.12.5/dist/gsap.min.js";

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    // ==========================================
    // 1. 样式注入 (CSS - Mod03 Constructivism)
    // ==========================================
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Russo+One&display=swap');

        :root {
            --mod03-red: #D92525;
            --mod03-black: #1A1A1A;
            --mod03-cream: #F0EAD6;
            --mod03-grey: #4A4A4A;
            --mod03-gold: #FFD700;
            --mod03-accent: var(--primary-color, #00faff); /* 游戏主色调作为点缀 */
        }

        /* 基础容器 */
        #mod03-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: var(--mod03-cream);
            z-index: 9999; display: none; opacity: 0;
            font-family: 'Oswald', sans-serif;
            overflow: hidden;
            color: var(--mod03-black);
        }
        #mod03-overlay.active { display: block; }

        /* 噪点纹理层 */
        .mod03-noise {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E");
            pointer-events: none; z-index: 2; mix-blend-mode: multiply;
        }

        /* 背景几何装饰 */
        .mod03-bg-shape {
            position: absolute; pointer-events: none; z-index: 1;
        }
        .mod03-circle-big {
            width: 80vh; height: 80vh; border-radius: 50%;
            background: var(--mod03-red);
            top: -20vh; right: -20vh;
        }
        .mod03-bar-diagonal {
            width: 200%; height: 200px; background: var(--mod03-black);
            transform: rotate(-45deg); top: 40%; left: -50%;
        }

        /* UI 层 */
        #mod03-ui-layer {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 10; display: flex; flex-direction: column;
            justify-content: space-between; padding: 40px; box-sizing: border-box;
        }

        /* 标题区域 */
        .mod03-header {
            text-transform: uppercase;
            transform: skewX(-10deg);
        }
        .mod03-header h1 {
            font-family: 'Russo One', sans-serif;
            font-size: 4rem; margin: 0; line-height: 0.9;
            color: var(--mod03-black);
            text-shadow: 5px 5px 0px var(--mod03-red);
        }
        .mod03-header .sub {
            font-size: 1.2rem; background: var(--mod03-black); color: var(--mod03-cream);
            display: inline-block; padding: 5px 15px; margin-top: 10px;
            letter-spacing: 2px;
        }

        /* 核心动画区域 (海报中心) */
        #mod03-stage {
            flex-grow: 1; position: relative;
            display: flex; align-items: center; justify-content: center;
            perspective: 1000px;
        }

        /* 结果网格 */
        #mod03-results-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 15px;
            width: 90%; max-width: 1200px;
            display: none; /* 初始隐藏 */
        }

        /* 卡片样式 */
        .mod03-card {
            background: var(--mod03-cream);
            border: 4px solid var(--mod03-black);
            aspect-ratio: 3/5;
            position: relative;
            cursor: pointer;
            transition: transform 0.2s;
            transform-style: preserve-3d;
            box-shadow: 10px 10px 0px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .mod03-card:hover { transform: translateY(-10px) scale(1.05); z-index: 20; }

        .mod03-card-inner {
            display: flex; flex-direction: column; height: 100%;
            padding: 10px; box-sizing: border-box;
        }
        .mod03-card-tier {
            height: 10px; width: 100%; margin-bottom: 10px;
        }
        .mod03-card-img-placeholder {
            flex-grow: 1; background: var(--mod03-black);
            display: flex; align-items: center; justify-content: center;
            color: var(--mod03-cream); font-size: 2rem; font-weight: bold;
            clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
        }
        .mod03-card-name {
            font-weight: 700; font-size: 1rem; margin-top: 10px;
            text-transform: uppercase; line-height: 1.1;
            border-bottom: 2px solid var(--mod03-black);
        }
        .mod03-card-type {
            font-size: 0.7rem; color: var(--mod03-grey); margin-top: 5px;
            display: flex; justify-content: space-between;
        }

        /* 稀有度颜色 */
        .tier-5 { background: var(--mod03-gold); color: var(--mod03-black) !important; }
        .tier-4 { background: var(--mod03-red); }
        .tier-3 { background: var(--mod03-accent); }
        .tier-2 { background: var(--mod03-grey); }
        .tier-1 { background: #ccc; }

        /* 控制按钮组 */
        .mod03-controls {
            display: flex; justify-content: center; gap: 20px;
            pointer-events: auto;
        }
        .mod03-btn {
            background: var(--mod03-black); color: var(--mod03-cream);
            border: none; padding: 15px 40px;
            font-family: 'Russo One', sans-serif; font-size: 1.5rem;
            text-transform: uppercase; cursor: pointer;
            clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
            transition: all 0.2s; position: relative;
        }
        .mod03-btn:hover {
            background: var(--mod03-red); color: #fff;
            transform: translate(-5px, -5px);
            box-shadow: 5px 5px 0px var(--mod03-black);
        }
        .mod03-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }

        .mod03-close {
            position: absolute; top: 30px; right: 30px;
            width: 50px; height: 50px; background: var(--mod03-red);
            color: #fff; border: none; font-size: 2rem; font-weight: bold;
            cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center;
            transition: transform 0.3s; z-index: 100;
        }
        .mod03-close:hover { transform: rotate(90deg) scale(1.1); }

        /* 详情弹窗 (侧滑式) */
        #mod03-detail-panel {
            position: absolute; top: 0; right: 0; width: 400px; height: 100%;
            background: var(--mod03-black); color: var(--mod03-cream);
            z-index: 50; transform: translateX(100%);
            display: flex; flex-direction: column;
            border-left: 10px solid var(--mod03-red);
            box-shadow: -20px 0 50px rgba(0,0,0,0.5);
        }
        .mod03-detail-content {
            padding: 40px; overflow-y: auto; flex-grow: 1;
        }
        .mod03-detail-content::-webkit-scrollbar { width: 6px; }
        .mod03-detail-content::-webkit-scrollbar-thumb { background: var(--mod03-red); }

        .mod03-detail-title {
            font-family: 'Russo One'; font-size: 2.5rem; line-height: 1;
            border-bottom: 4px solid var(--mod03-red); padding-bottom: 20px; margin-bottom: 20px;
        }
        .mod03-detail-meta {
            display: flex; gap: 10px; margin-bottom: 30px; font-size: 0.9rem; color: #888;
        }
        .mod03-detail-desc {
            font-size: 1.1rem; line-height: 1.6; color: #ccc;
            white-space: pre-wrap;
        }
        .mod03-detail-close {
            padding: 20px; background: var(--mod03-grey); border: none;
            color: #fff; font-family: 'Oswald'; font-size: 1.2rem; cursor: pointer;
            text-transform: uppercase;
        }
        .mod03-detail-close:hover { background: var(--mod03-red); }

        /* 动画元素：齿轮 */
        .mod03-gear {
            position: absolute; width: 300px; height: 300px;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231A1A1A'%3E%3Cpath d='M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.63c-.04.34-.07.67-.07 1 0 .33.03.66.07.97l-2.11 1.66c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z'/%3E%3C/svg%3E") no-repeat center;
            opacity: 0.1; z-index: 0;
        }

        /* 移动端适配 */
        @media (max-width: 800px) {
            .mod03-header h1 { font-size: 2.5rem; }
            #mod03-results-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; overflow-y: auto; max-height: 60vh; padding-bottom: 20px; }
            .mod03-card { aspect-ratio: 1/1.2; }
            .mod03-btn { padding: 10px 20px; font-size: 1rem; }
            #mod03-detail-panel { width: 100%; }
            .mod03-circle-big { width: 40vh; height: 40vh; }
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 2. DOM 结构构建
    // ==========================================
    const overlay = document.createElement('div');
    overlay.id = 'mod03-overlay';
    overlay.innerHTML = `
        <div class="mod03-noise"></div>


        <div class="mod03-bg-shape mod03-circle-big"></div>
        <div class="mod03-bg-shape mod03-bar-diagonal"></div>
        <div class="mod03-gear" style="top: 20%; left: 10%;"></div>
        <div class="mod03-gear" style="bottom: 10%; right: 10%; transform: scale(1.5);"></div>

        <div id="mod03-ui-layer">
            <button class="mod03-close" id="mod03-close-btn">✕</button>

            <div class="mod03-header">
                <h1>SUPPLY DROP</h1>
                <div class="sub">STATE DISTRIBUTION CENTER // 03</div>
            </div>

            <div id="mod03-stage">

                <div id="mod03-intro-text" style="text-align:center; font-size: 2rem; font-weight:bold; color: var(--mod03-black); transform: rotate(-5deg);">
                    <span style="background:var(--mod03-red); color:#fff; padding: 5px 20px;">AWAITING</span><br>
                    REQUISITION ORDER
                </div>


                <div id="mod03-results-grid"></div>
            </div>

            <div class="mod03-controls">
                <div id="mod03-start-btns">
                    <button id="mod03-btn-single" class="mod03-btn">REQUISITION x1</button>
                    <button id="mod03-btn-ten" class="mod03-btn">REQUISITION x10</button>
                </div>
                <button id="mod03-btn-confirm" class="mod03-btn" style="display:none;">CONFIRM RECEIPT</button>
            </div>
        </div>


        <div id="mod03-detail-panel">
            <div class="mod03-detail-content">
                <div id="mod03-detail-title" class="mod03-detail-title"></div>
                <div class="mod03-detail-meta">
                    <span id="mod03-detail-type"></span>
                    <span id="mod03-detail-price"></span>
                </div>
                <div id="mod03-detail-desc" class="mod03-detail-desc"></div>
            </div>
            <button class="mod03-detail-close" id="mod03-close-detail">CLOSE FILE</button>
        </div>
    `;
    document.body.appendChild(overlay);

    // ==========================================
    // 3. 逻辑核心
    // ==========================================

    loadScript(GSAP_CDN).then(() => {
        // GSAP Loaded
        initGachaSystem();
    });

    function initGachaSystem() {
        const ui = {
            overlay: document.getElementById('mod03-overlay'),
            closeBtn: document.getElementById('mod03-close-btn'),
            stage: document.getElementById('mod03-stage'),
            intro: document.getElementById('mod03-intro-text'),
            grid: document.getElementById('mod03-results-grid'),
            btns: document.getElementById('mod03-start-btns'),
            confirmBtn: document.getElementById('mod03-btn-confirm'),
            detailPanel: document.getElementById('mod03-detail-panel'),
            detailTitle: document.getElementById('mod03-detail-title'),
            detailType: document.getElementById('mod03-detail-type'),
            detailPrice: document.getElementById('mod03-detail-price'),
            detailDesc: document.getElementById('mod03-detail-desc'),
            closeDetail: document.getElementById('mod03-close-detail'),
            gears: document.querySelectorAll('.mod03-gear')
        };

        let currentResults = [];
        let isAnimating = false;

        // 辅助：稀有度颜色
        function getTierClass(price) {
            if (price >= 8000) return 'tier-5';
            if (price >= 1000) return 'tier-4';
            if (price >= 200)  return 'tier-3';
            if (price >= 80)   return 'tier-2';
            return 'tier-1';
        }

        // 动画：背景齿轮旋转
        gsap.to(ui.gears, { rotation: 360, duration: 20, repeat: -1, ease: "none" });

        // --- 核心流程 ---

        async function startGacha(count) {
            if (isAnimating) return;

            // 1. 检查积分 (逻辑复用)
            const GACHA_CONFIG = { singleCost: 160, tenCost: 1440 };
            const cost = count === 1 ? GACHA_CONFIG.singleCost : GACHA_CONFIG.tenCost;
            let currentPoints = 0;
            try {
                if (window.GameAPI && window.GameAPI.playCharacterData) {
                    currentPoints = window.GameAPI.playCharacterData.货币.积分[0];
                } else {
                    currentPoints = 999999;
                }
            } catch (e) {}

            if (currentPoints < cost) {
                if(typeof worldHelper !== 'undefined') worldHelper.showNovaAlert(`INSUFFICIENT FUNDS\nREQ: ${cost}`);
                else alert(`积分不足！需要: ${cost}`);
                return;
            }

            // 2. 获取数据
            if (window.GameAPI && window.GameAPI.performGacha) {
                currentResults = await window.GameAPI.performGacha(count);
            } else {
                // 模拟数据用于测试
                currentResults = Array(count).fill(0).map((_,i) => [`Item ${i}`, 100 * (i+1), "Material", "ID", "Description text here...", "Flavor text"]);
            }

            if (!currentResults || currentResults.length === 0) return;

            isAnimating = true;

            // 3. 播放抽卡动画 (Constructivism Style)
            playPullAnimation(count);
        }

        function playPullAnimation(count) {
            // UI 状态切换
            ui.btns.style.display = 'none';
            ui.intro.style.display = 'none';
            ui.grid.innerHTML = '';
            ui.grid.style.display = 'grid';

            const tl = gsap.timeline();

            // 阶段 1: 警报/准备
            tl.to(ui.overlay, { backgroundColor: '#D92525', duration: 0.1, repeat: 3, yoyo: true }) // 红色闪烁
              .to(ui.overlay, { backgroundColor: '#F0EAD6', duration: 0.2 });

            // 阶段 2: 几何切割转场
            const curtain = document.createElement('div');
            curtain.style.cssText = `position:absolute; top:0; left:0; width:0%; height:100%; background:#1A1A1A; z-index:20;`;
            ui.stage.appendChild(curtain);

            tl.to(curtain, { width: '100%', duration: 0.4, ease: "power4.in" })
              .add(() => {
                  // 在黑幕下生成卡片 DOM
                  generateCards(currentResults);
              })
              .to(curtain, { left: '100%', width: '0%', duration: 0.4, ease: "power4.out", delay: 0.2 })
              .add(() => curtain.remove());

            // 阶段 3: 卡片进场 (盖章式/流水线式)
            tl.add(() => {
                const cards = document.querySelectorAll('.mod03-card');
                gsap.fromTo(cards,
                    { y: -100, opacity: 0, rotationX: 45 },
                    {
                        y: 0, opacity: 1, rotationX: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "back.out(1.7)",
                        onComplete: () => {
                            isAnimating = false;
                            ui.confirmBtn.style.display = 'inline-block';
                        }
                    }
                );
            });
        }

        function generateCards(items) {
            items.forEach((item, index) => {
                const tierClass = getTierClass(item[1]);
                const card = document.createElement('div');
                card.className = 'mod03-card';
                card.innerHTML = `
                    <div class="mod03-card-inner">
                        <div class="mod03-card-tier ${tierClass}"></div>
                        <div class="mod03-card-img-placeholder">
                            ${item[0].charAt(0)}
                        </div>
                        <div class="mod03-card-name">${item[0]}</div>
                        <div class="mod03-card-type">
                            <span>${item[2]}</span>
                            <span>${item[1]} PTS</span>
                        </div>
                    </div>
                `;

                // 点击查看详情
                card.addEventListener('click', () => showDetail(item, tierClass));
                ui.grid.appendChild(card);
            });
        }

        function showDetail(item, tierClass) {
            ui.detailTitle.innerText = item[0];
            ui.detailTitle.style.color = tierClass === 'tier-5' ? 'var(--mod03-gold)' : (tierClass === 'tier-4' ? 'var(--mod03-red)' : '#fff');
            ui.detailType.innerText = `TYPE: ${item[2]}`;
            ui.detailPrice.innerText = `VALUE: ${item[1]}`;

            // 组合描述文本：属性 + 描述
            let fullDesc = "";
            if(item[4]) fullDesc += `[STATS]\n${item[4]}\n\n`;
            if(item[5]) fullDesc += `[ARCHIVE]\n${item[5]}`;
            ui.detailDesc.innerText = fullDesc || "No Data Available.";

            gsap.to(ui.detailPanel, { x: '0%', duration: 0.4, ease: "power3.out" });
        }

        function hideDetail() {
            gsap.to(ui.detailPanel, { x: '100%', duration: 0.3, ease: "power3.in" });
        }

        async function confirmAndReset() {
            // 结算逻辑
            if (window.GameAPI) {
                try {
                    if (typeof window.processGachaRewards === 'function') {
                        await window.processGachaRewards(currentResults);
                    }
                } catch (e) { console.error(e); }
            }

            // 视觉重置
            ui.confirmBtn.style.display = 'none';
            hideDetail();

            // 卡片离场动画
            const cards = document.querySelectorAll('.mod03-card');
            gsap.to(cards, {
                y: 100, opacity: 0, duration: 0.3, stagger: 0.05,
                onComplete: () => {
                    ui.grid.innerHTML = '';
                    ui.grid.style.display = 'none';
                    ui.intro.style.display = 'block';

                    // 标语进场
                    gsap.fromTo(ui.intro, { scale: 0, rotation: -180 }, { scale: 1, rotation: -5, duration: 0.5, ease: "back.out" });

                    ui.btns.style.display = 'block';
                }
            });
        }

        // --- 事件绑定 ---
        ui.btns.querySelector('#mod03-btn-single').onclick = () => startGacha(1);
        ui.btns.querySelector('#mod03-btn-ten').onclick = () => startGacha(10);
        ui.confirmBtn.onclick = confirmAndReset;
        ui.closeDetail.onclick = hideDetail;
        ui.closeBtn.onclick = () => {
            gsap.to(ui.overlay, { opacity: 0, duration: 0.3, onComplete: () => {
                ui.overlay.classList.remove('active');
            }});
        };

        // 外部入口
        const entryBtn = document.getElementById('enter-gacha01-btn');
        if(entryBtn) {
            entryBtn.style.display = 'block';
            entryBtn.addEventListener('click', () => {
                ui.overlay.classList.add('active');
                gsap.to(ui.overlay, { opacity: 1, duration: 0.5 });
            });
        }
    }

})();
