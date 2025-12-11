(function() {
    // ==========================================
    // 0. 配置与资源预加载
    // ==========================================
    const PIXEL_FONT_URL = "https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;700&family=Press+Start+2P&display=swap";

    // 动态加载字体
    if (!document.querySelector(`link[href="${PIXEL_FONT_URL}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = PIXEL_FONT_URL;
        document.head.appendChild(link);
    }

    // 获取主题色
    const theme = {
        primary: (window.GameAPI && window.GameAPI.getThemeVar('--primary-color')) || '#00faff',
        secondary: (window.GameAPI && window.GameAPI.getThemeVar('--secondary-color')) || '#7affff',
        bg: '#0a0a10',
        gold: '#ffd700',
        crimson: '#dc143c',
        purple: '#9b59b6',
        blue: '#3498db',
        grey: '#7f8c8d'
    };

    // ==========================================
    // 1. 样式注入 (CSS - Pixel Art Style)
    // ==========================================
    const style = document.createElement('style');
    style.textContent = `
        /* 全局重置与字体 */
        .mod03-pixel-font { font-family: 'Pixelify Sans', sans-serif; }
        .mod03-header-font { font-family: 'Press Start 2P', cursive; }

        /* 遮罩层 */
        #mod03-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: ${theme.bg}; z-index: 9999; display: none;
            opacity: 0; transition: opacity 0.3s ease;
            overflow: hidden; user-select: none;
            image-rendering: pixelated; /* 关键：像素化渲染 */
        }
        #mod03-overlay.active { display: block; opacity: 1; }

        /* CRT 扫描线效果 */
        #mod03-crt-layer {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 2px, 3px 100%;
            box-shadow: inset 0 0 100px rgba(0,0,0,0.9);
        }

        /* 背景 Canvas */
        #mod03-bg-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }

        /* UI 层 */
        #mod03-ui-layer {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10;
            display: flex; flex-direction: column; justify-content: space-between; padding: 20px;
            box-sizing: border-box; pointer-events: none;
        }

        /* 顶部标题 */
        .mod03-header {
            text-align: center; margin-top: 20px; pointer-events: auto;
            text-shadow: 4px 4px 0px #000; color: #fff;
            transform: translateY(-50px); transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .mod03-header.show { transform: translateY(0); }
        .mod03-header h1 { font-size: 2rem; margin: 0; color: ${theme.gold}; -webkit-text-stroke: 1px #000; }
        .mod03-header .subtitle { font-size: 0.8rem; color: ${theme.secondary}; letter-spacing: 2px; margin-top: 5px; }

        /* 关闭按钮 */
        #mod03-close-btn {
            position: absolute; top: 20px; right: 20px; pointer-events: auto;
            background: #000; border: 4px solid #fff; color: #fff;
            width: 40px; height: 40px; font-size: 20px; cursor: pointer;
            box-shadow: 4px 4px 0px #000; transition: transform 0.1s;
            display: flex; align-items: center; justify-content: center;
        }
        #mod03-close-btn:active { transform: translate(4px, 4px); box-shadow: 0 0 0; }

        /* 核心水晶 (Idle 状态) */
        #mod03-core-container {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 100px; height: 100px; pointer-events: auto; cursor: pointer;
            z-index: 20; transition: all 0.5s;
        }
        .mod03-crystal {
            width: 60px; height: 60px; background: ${theme.primary};
            margin: 20px auto; transform: rotate(45deg);
            border: 4px solid #fff; box-shadow: 0 0 20px ${theme.primary}, inset 0 0 10px #fff;
            animation: mod03-float 3s ease-in-out infinite;
            position: relative;
        }
        .mod03-crystal::after {
            content: ''; position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px;
            border: 2px dashed ${theme.secondary}; opacity: 0.5;
            animation: mod03-spin 10s linear infinite;
        }
        #mod03-core-text {
            text-align: center; color: #fff; font-size: 0.8rem; margin-top: 20px;
            text-shadow: 2px 2px 0 #000; opacity: 0.8; animation: mod03-pulse 1.5s infinite;
        }

        /* 抽卡结果网格 */
        #mod03-results-grid {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px;
            width: 90%; max-width: 1000px; z-index: 15; pointer-events: none;
        }

        /* 卡片样式 */
        .mod03-card {
            perspective: 1000px; width: 100%; aspect-ratio: 3/4;
            position: relative; cursor: pointer; pointer-events: auto;
            opacity: 0; transform: scale(0.5); transition: transform 0.2s;
        }
        .mod03-card:hover { transform: scale(1.05) translateY(-5px) !important; z-index: 20; }
        .mod03-card-inner {
            position: relative; width: 100%; height: 100%; text-align: center;
            transition: transform 0.6s; transform-style: preserve-3d;
        }
        .mod03-card.flipped .mod03-card-inner { transform: rotateY(180deg); }

        .mod03-card-front, .mod03-card-back {
            position: absolute; width: 100%; height: 100%;
            backface-visibility: hidden; border: 4px solid #000;
            box-shadow: 4px 4px 0px rgba(0,0,0,0.5);
            background: #1a1a1a; display: flex; flex-direction: column;
            justify-content: center; align-items: center;
        }

        /* 卡背 */
        .mod03-card-front { background: #222; border-color: #444; color: #666; }
        .mod03-card-front::before { content: '?'; font-size: 3rem; font-family: 'Press Start 2P'; opacity: 0.2; }

        /* 卡面 */
        .mod03-card-back { transform: rotateY(180deg); padding: 10px; box-sizing: border-box; justify-content: space-between; }
        .mod03-card-bg {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.2; z-index: 0;
            background-size: cover; filter: contrast(1.2) brightness(0.8);
        }
        .mod03-card-content { z-index: 1; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
        .mod03-rarity-badge {
            align-self: flex-end; padding: 2px 6px; font-size: 0.6rem; color: #000; font-weight: bold;
            box-shadow: 2px 2px 0 rgba(0,0,0,0.5);
        }
        .mod03-item-name {
            font-size: 0.9rem; color: #fff; text-shadow: 2px 2px 0 #000;
            word-break: break-all; line-height: 1.2; margin-bottom: 5px;
        }
        .mod03-item-type { font-size: 0.6rem; color: #aaa; text-transform: uppercase; letter-spacing: 1px; }
        .mod03-item-stats { font-size: 0.6rem; color: ${theme.primary}; margin-top: 5px; border-top: 1px dashed #555; padding-top: 5px; }

        /* 底部控制栏 */
        .mod03-controls {
            text-align: center; margin-bottom: 30px; pointer-events: auto;
            display: flex; justify-content: center; gap: 20px;
            transform: translateY(100px); transition: transform 0.5s;
        }
        .mod03-controls.show { transform: translateY(0); }

        .mod03-btn {
            background: #222; color: #fff; border: 4px solid #fff;
            padding: 15px 30px; font-size: 1rem; cursor: pointer;
            font-family: 'Press Start 2P', cursive;
            box-shadow: 6px 6px 0px #000; transition: all 0.1s;
            position: relative; overflow: hidden;
        }
        .mod03-btn:hover { background: #fff; color: #000; transform: translate(-2px, -2px); box-shadow: 8px 8px 0px #000; }
        .mod03-btn:active { transform: translate(4px, 4px); box-shadow: 0 0 0; }
        .mod03-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }

        /* 详情弹窗 */
        #mod03-detail-modal {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 80%; max-width: 400px; background: #111; border: 4px solid #fff;
            padding: 20px; z-index: 100; display: none; box-shadow: 10px 10px 0 #000;
            text-align: left; pointer-events: auto;
        }
        #mod03-detail-modal h2 { color: ${theme.gold}; margin: 0 0 10px 0; font-size: 1.2rem; text-shadow: 2px 2px 0 #000; }
        #mod03-detail-desc { font-size: 0.9rem; color: #ccc; line-height: 1.6; margin-bottom: 20px; border-left: 4px solid ${theme.primary}; padding-left: 10px; }
        #mod03-detail-close { float: right; background: transparent; border: 2px solid #555; color: #555; cursor: pointer; padding: 5px 10px; }
        #mod03-detail-close:hover { border-color: #fff; color: #fff; }

        /* 动画关键帧 */
        @keyframes mod03-float { 0%, 100% { transform: rotate(45deg) translateY(0); } 50% { transform: rotate(45deg) translateY(-10px); } }
        @keyframes mod03-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes mod03-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes mod03-shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }

        /* 响应式适配 */
        @media (max-width: 800px) {
            #mod03-results-grid {
                grid-template-columns: repeat(2, 1fr);
                overflow-y: auto; max-height: 60vh; padding-right: 5px;
                align-content: start;
            }
            .mod03-header h1 { font-size: 1.2rem; }
            .mod03-btn { padding: 10px 15px; font-size: 0.8rem; }
            #mod03-core-container { transform: translate(-50%, -40%); }
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 2. DOM 结构构建
    // ==========================================
    const overlay = document.createElement('div');
    overlay.id = 'mod03-overlay';
    overlay.innerHTML = `
        <canvas id="mod03-bg-canvas"></canvas>
        <div id="mod03-crt-layer"></div>

        <div id="mod03-ui-layer">
            <button id="mod03-close-btn" class="mod03-header-font">X</button>

            <div class="mod03-header mod03-header-font show">
                <h1>ETERNAL SUMMON</h1>
                <div class="subtitle">PIXEL ART EDITION</div>
            </div>

            <div id="mod03-core-container">
                <div class="mod03-crystal"></div>
                <div id="mod03-core-text" class="mod03-pixel-font">READY</div>
            </div>

            <div id="mod03-results-grid"></div>

            <div class="mod03-controls show">
                <div id="mod03-start-btns" style="display:flex; gap:10px;">
                    <button id="mod03-btn-single" class="mod03-btn">1x </button>
                    <button id="mod03-btn-ten" class="mod03-btn">10x </button>
                </div>
                <button id="mod03-btn-confirm" class="mod03-btn" style="display:none;">收下</button>
            </div>
        </div>

        <div id="mod03-detail-modal" class="mod03-pixel-font">
            <h2 id="mod03-detail-name" class="mod03-header-font"></h2>
            <div id="mod03-detail-desc"></div>
            <button id="mod03-detail-close">CLOSE</button>
        </div>
    `;
    document.body.appendChild(overlay);

    // ==========================================
    // 3. 逻辑核心 (Canvas 粒子 + 交互)
    // ==========================================

    // --- 变量定义 ---
    const canvas = document.getElementById('mod03-bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let isAnimating = false;
    let currentResults = [];

    // --- 辅助函数：稀有度颜色 ---
    function getTierConfig(price) {
        if (price >= 8000) return { color: theme.gold, bg: '#4a4000', label: 'UR' };
        if (price >= 1000) return { color: theme.crimson, bg: '#4a0000', label: 'SSR' };
        if (price >= 200)  return { color: theme.purple, bg: '#2d004a', label: 'SR' };
        if (price >= 80)   return { color: theme.blue, bg: '#001a4a', label: 'R' };
        return { color: theme.grey, bg: '#1a1a1a', label: 'N' };
    }

    // --- 粒子系统 ---
    class Particle {
        constructor(x, y, type) {
            this.x = x; this.y = y;
            this.type = type; // 'bg', 'charge', 'explode'
            this.size = Math.random() * 3 + 1;

            if (type === 'bg') {
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.life = 1000;
                this.color = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
            } else if (type === 'charge') {
                const angle = Math.atan2(window.innerHeight/2 - y, window.innerWidth/2 - x);
                const speed = Math.random() * 15 + 5;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.life = 30;
                this.color = theme.primary;
            } else if (type === 'explode') {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 10 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.life = 60;
                this.color = [theme.gold, theme.primary, '#fff'][Math.floor(Math.random()*3)];
                this.drag = 0.95;
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;

            if (this.type === 'explode') {
                this.vx *= this.drag;
                this.vy *= this.drag;
                this.size *= 0.95;
            }
        }

        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size); // 绘制方形粒子
        }
    }

    function initParticles() {
        particles = [];
        for(let i=0; i<100; i++) {
            particles.push(new Particle(Math.random()*canvas.width, Math.random()*canvas.height, 'bg'));
        }
    }

    function spawnChargeParticles() {
        for(let i=0; i<20; i++) {
            // 从屏幕边缘生成
            let x, y;
            if(Math.random() > 0.5) {
                x = Math.random() > 0.5 ? 0 : canvas.width;
                y = Math.random() * canvas.height;
            } else {
                x = Math.random() * canvas.width;
                y = Math.random() > 0.5 ? 0 : canvas.height;
            }
            particles.push(new Particle(x, y, 'charge'));
        }
    }

    function spawnExplosion(color) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        for(let i=0; i<150; i++) {
            const p = new Particle(cx, cy, 'explode');
            p.color = i % 2 === 0 ? color : '#fff';
            particles.push(p);
        }
    }

    function renderLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制背景星空
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw(ctx);
            if (p.life <= 0) particles.splice(i, 1);
        }

        // 维持背景粒子数量
        if (particles.filter(p => p.type === 'bg').length < 100) {
            particles.push(new Particle(Math.random()*canvas.width, Math.random()*canvas.height, 'bg'));
        }

        animationId = requestAnimationFrame(renderLoop);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // --- 抽卡逻辑 ---
    async function startGacha(count) {
        if(isAnimating) return;

        // 1. 检查积分
        const GACHA_CONFIG = { singleCost: 160, tenCost: 1440 };
        const cost = count === 1 ? GACHA_CONFIG.singleCost : GACHA_CONFIG.tenCost;
        let currentPoints = 0;
        try {
            if (window.GameAPI && window.GameAPI.playCharacterData) {
                currentPoints = window.GameAPI.playCharacterData.货币.积分[0];
            } else {
                currentPoints = 999999; // Fallback
            }
        } catch (e) { console.error(e); }

        if (currentPoints < cost) {
            if(window.worldHelper) window.worldHelper.showNovaAlert(`积分不足！需要: ${cost}`);
            else alert(`积分不足！需要: ${cost}`);
            return;
        }

        // 2. 获取数据
        if (window.GameAPI && window.GameAPI.performGacha) {
            currentResults = await window.GameAPI.performGacha(count);
        } else {
            console.error("GameAPI not found"); return;
        }

        if (!currentResults || currentResults.length === 0) return;

        // 3. 开始动画流程
        isAnimating = true;
        const core = document.getElementById('mod03-core-container');
        const ui = document.getElementById('mod03-ui-layer');
        const controls = document.querySelector('.mod03-controls');

        controls.classList.remove('show');
        document.getElementById('mod03-core-text').innerText = "CHARGING...";

        // 阶段 A: 蓄力 (Charge)
        let chargeTimer = setInterval(spawnChargeParticles, 50);
        core.style.animation = "mod03-shake 0.5s infinite"; // 剧烈震动

        // 计算最高稀有度颜色
        let maxPrice = 0;
        currentResults.forEach(r => maxPrice = Math.max(maxPrice, r[1]));
        const maxTier = getTierConfig(maxPrice);

        setTimeout(() => {
            // 阶段 B: 爆炸 (Explosion)
            clearInterval(chargeTimer);
            core.style.display = 'none'; // 隐藏核心
            spawnExplosion(maxTier.color);

            // 屏幕闪白
            const flash = document.createElement('div');
            flash.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;z-index:999;transition:opacity 0.5s;`;
            document.body.appendChild(flash);
            setTimeout(() => { flash.style.opacity = 0; setTimeout(()=>flash.remove(), 500); }, 50);

            // 阶段 C: 展示卡片 (Reveal)
            showCards(currentResults);

        }, 1500);
    }

    function showCards(results) {
        const grid = document.getElementById('mod03-results-grid');
        grid.innerHTML = '';

        results.forEach((item, index) => {
            const tier = getTierConfig(item[1]);
            const card = document.createElement('div');
            card.className = 'mod03-card mod03-pixel-font';
            card.innerHTML = `
                <div class="mod03-card-inner">
                    <div class="mod03-card-front"></div>
                    <div class="mod03-card-back" style="border-color: ${tier.color}; box-shadow: 0 0 15px ${tier.color}40;">
                        <div class="mod03-card-bg" style="background-color: ${tier.bg}"></div>
                        <div class="mod03-card-content">
                            <div class="mod03-rarity-badge" style="background:${tier.color}">${tier.label}</div>
                            <div style="margin-top:auto;">
                                <div class="mod03-item-name">${item[0]}</div>
                                <div class="mod03-item-type">${item[2]}</div>
                                <div class="mod03-item-stats">${item[4].substring(0, 20)}...</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // 点击翻转详情
            card.addEventListener('click', () => {
                if(card.classList.contains('flipped')) {
                    showDetail(item, tier);
                } else {
                    card.classList.add('flipped');
                }
            });

            grid.appendChild(card);

            // 依次入场动画
            setTimeout(() => {
                card.style.opacity = 1;
                card.style.transform = 'scale(1)';
            }, index * 100);
        });

        // 自动翻转所有卡片
        setTimeout(() => {
            const cards = document.querySelectorAll('.mod03-card');
            cards.forEach((c, i) => {
                setTimeout(() => c.classList.add('flipped'), i * 150);
            });

            // 显示确认按钮
            setTimeout(() => {
                document.getElementById('mod03-start-btns').style.display = 'none';
                document.getElementById('mod03-btn-confirm').style.display = 'inline-block';
                document.querySelector('.mod03-controls').classList.add('show');
                isAnimating = false;
            }, results.length * 150 + 500);

        }, 1000);
    }

    function showDetail(item, tier) {
        const modal = document.getElementById('mod03-detail-modal');
        document.getElementById('mod03-detail-name').innerText = item[0];
        document.getElementById('mod03-detail-name').style.color = tier.color;
        document.getElementById('mod03-detail-desc').innerHTML = `
            <p style="color:#fff; margin-bottom:5px;">${item[2]} | ${item[1]} PTS</p>
            <p>${item[5]}</p>
            <p style="color:${theme.primary}; font-size:0.8rem;">${item[4]}</p>
        `;
        modal.style.display = 'block';
    }

    async function confirmAndReset() {
        // 结算逻辑
        if (window.GameAPI && typeof window.processGachaRewards === 'function') {
            try { await window.processGachaRewards(currentResults); }
            catch (e) { console.error(e); }
        }

        // UI 重置
        const grid = document.getElementById('mod03-results-grid');
        const cards = grid.querySelectorAll('.mod03-card');

        // 卡片飞出动画
        cards.forEach((c, i) => {
            c.style.transition = 'all 0.5s';
            c.style.transform = 'translateY(100vh) rotate(20deg)';
            c.style.opacity = 0;
        });

        setTimeout(() => {
            grid.innerHTML = '';
            document.getElementById('mod03-core-container').style.display = 'block';
            document.getElementById('mod03-core-container').style.animation = '';
            document.getElementById('mod03-core-text').innerText = "READY";

            document.getElementById('mod03-btn-confirm').style.display = 'none';
            document.getElementById('mod03-start-btns').style.display = 'flex';
            document.querySelector('.mod03-controls').classList.add('show');
        }, 600);
    }

    // --- 系统控制 ---
    function openSystem() {
        document.getElementById('mod03-overlay').classList.add('active');
        resizeCanvas();
        initParticles();
        renderLoop();
    }

    function closeSystem() {
        document.getElementById('mod03-overlay').classList.remove('active');
        cancelAnimationFrame(animationId);
    }

    // ==========================================
    // 4. 事件绑定
    // ==========================================
    window.addEventListener('resize', resizeCanvas);

    document.getElementById('mod03-btn-single').addEventListener('click', () => startGacha(1));
    document.getElementById('mod03-btn-ten').addEventListener('click', () => startGacha(10));
    document.getElementById('mod03-btn-confirm').addEventListener('click', confirmAndReset);
    document.getElementById('mod03-close-btn').addEventListener('click', closeSystem);

    document.getElementById('mod03-detail-close').addEventListener('click', () => {
        document.getElementById('mod03-detail-modal').style.display = 'none';
    });

    // 外部入口
    const entryBtn = document.getElementById('enter-gacha01-btn');
    if(entryBtn) {
        entryBtn.style.display = 'block';
        // 移除旧的监听器 (如果需要) 并添加新的
        const newBtn = entryBtn.cloneNode(true);
        entryBtn.parentNode.replaceChild(newBtn, entryBtn);
        newBtn.addEventListener('click', openSystem);
    }

})();
