 (function() {
        // ==========================================
        // 0. 依赖配置与动态加载
        // ==========================================
        const THREE_CDN = "https://unpkg.com/three@0.160.0/build/three.module.js";
        const ADDONS_CDN = "https://unpkg.com/three@0.160.0/examples/jsm/";

        // 动态注入 Import Map 以支持模块化加载
        if (!document.querySelector('script[type="importmap"]')) {
            const im = document.createElement('script');
            im.type = "importmap";
            im.textContent = JSON.stringify({
                "imports": {
                    "three": THREE_CDN,
                    "three/addons/": ADDONS_CDN
                }
            });
            document.head.appendChild(im);
        }

        // ==========================================
        // 1. 样式注入 (CSS)
        // ==========================================
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap');

            #gacha-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: #000; z-index: 9999; display: none; opacity: 0;
                transition: opacity 0.5s ease; font-family: 'Cinzel', 'Noto Serif SC', serif;
            }
            #gacha-overlay.active { display: block; opacity: 1; }

            #gacha-canvas-container { width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 1; }

            #gacha-ui-layer {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10;
                pointer-events: none; display: flex; flex-direction: column; justify-content: space-between; padding: 20px; box-sizing: border-box;
            }

            /* 关闭按钮 */
            #gacha-close-btn {
                position: absolute; top: 20px; right: 20px; pointer-events: auto;
                background: transparent; border: 1px solid rgba(212, 175, 55, 0.5); color: #d4af37;
                width: 40px; height: 40px; border-radius: 50%; font-size: 20px; cursor: pointer;
                display: flex; align-items: center; justify-content: center; transition: all 0.3s;
                z-index: 100;
            }
            #gacha-close-btn:hover { background: #d4af37; color: #000; transform: rotate(90deg); }

            .gacha-header { text-align: center; color: #d4af37; text-shadow: 0 0 10px rgba(212, 175, 55, 0.5); margin-top: 40px; }
            .gacha-header h1 { margin: 0; font-size: 2.5rem; letter-spacing: 5px; }

            .gacha-controls { text-align: center; margin-bottom: 50px; pointer-events: auto; height: 60px; }

            .gacha-btn {
                background: rgba(0, 0, 0, 0.6); border: 2px solid #d4af37; color: #d4af37;
                padding: 15px 40px; font-size: 1.2rem; font-family: 'Cinzel', serif; cursor: pointer;
                transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 2px;
                margin: 0 10px; box-shadow: 0 0 15px rgba(0,0,0,0.8); position: relative; overflow: hidden;
            }
            .gacha-btn:hover { background: #d4af37; color: #000; box-shadow: 0 0 20px #d4af37; }
            .gacha-btn:disabled { opacity: 0.3; cursor: not-allowed; filter: grayscale(100%); }

            /* 详情弹窗 */
            #gacha-item-detail {
             max-height: 60vh;
    overflow-y: auto;
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 300px; background: rgba(10, 10, 15, 0.95); border: 1px solid #d4af37;
                padding: 20px; color: #fff; display: none; pointer-events: auto;
                box-shadow: 0 0 30px rgba(0,0,0,0.9); text-align: center; z-index: 20;
            }
            #gacha-item-detail h2 { color: #d4af37; margin: 0 0 10px 0; font-size: 1.5rem; }
            #gacha-item-detail .type { color: #888; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 10px; }
            #gacha-item-detail .desc { font-size: 0.9rem; color: #ccc; margin: 15px 0; font-style: italic; }
            #gacha-close-detail { background: transparent; border: 1px solid #555; color: #888; padding: 5px 15px; cursor: pointer; margin-top: 10px;}
            #gacha-close-detail:hover { border-color: #fff; color: #fff; }

            @media (max-width: 800px) {
                .gacha-header h1 { font-size: 1.8rem; }
                .gacha-btn { padding: 10px 20px; font-size: 1rem; }
            }
        `;
        document.head.appendChild(style);

        // ==========================================
        // 2. DOM 结构构建
        // ==========================================
        const overlay = document.createElement('div');
        overlay.id = 'gacha-overlay';
        overlay.innerHTML = `
            <div id="gacha-canvas-container"></div>
            <div id="gacha-ui-layer">
                <button id="gacha-close-btn">✕</button>
                <div class="gacha-header">
                   
                    <div style="font-size: 0.8rem; color: #666;">GOTHIC STAINED GLASS</div>
                </div>
                <div class="gacha-controls">
                    <div id="gacha-start-btns">
                        <button id="gacha-btn-single" class="gacha-btn">单次祈愿</button>
                        <button id="gacha-btn-ten" class="gacha-btn">十连祈愿</button>
                    </div>
                    <button id="gacha-btn-confirm" class="gacha-btn" style="display:none;">确认收下</button>
                </div>
            </div>
            <div id="gacha-item-detail">
                <h2 id="gacha-detail-name"></h2>
                <div id="gacha-detail-type" class="type"></div>
                <div id="gacha-detail-desc" class="desc"></div>
                <div id="gacha-detail-stats" style="color:#aaddff; font-size:0.85rem;"></div>
                <button id="gacha-close-detail">关闭</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // ==========================================
        // 3. 逻辑核心 (Three.js + 交互)
        // ==========================================
        const theme = {
            primary: GameAPI.getThemeVar('--primary-color') || '#00faff',
            secondary: GameAPI.getThemeVar('--secondary-color') || '#7affff',
            text: GameAPI.getThemeVar('--text-color') || '#e6f1ff',
            textSecondary: GameAPI.getThemeVar('--text-secondary-color') || '#a8c0e1',
            bg: GameAPI.getThemeVar('--container-bg-color') || 'rgba(10, 25, 47, 0.85)',
            border: GameAPI.getThemeVar('--border-color') || 'rgba(0, 250, 255, 0.3)',
            glow: GameAPI.getThemeVar('--glow-color') || 'rgba(0, 250, 255, 0.5)',
            inputBg: 'rgba(0, 0, 0, 0.4)',
        };
        // 动态导入 Three.js
        import('three').then(async (THREE) => {
            const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
            const { EffectComposer } = await import('three/addons/postprocessing/EffectComposer.js');
            const { RenderPass } = await import('three/addons/postprocessing/RenderPass.js');
            const { UnrealBloomPass } = await import('three/addons/postprocessing/UnrealBloomPass.js');
            const TWEEN = (await import('three/addons/libs/tween.module.js')).default;

            // --- 变量定义 ---
            let scene, camera, renderer, composer, controls;
            let gachaCore, ambientParticles, ambientMaterial;
            let cards = [];
            let particles = [];
            let isAnimating = false;
            let currentResults = []; // 暂存抽奖结果
            let animationFrameId;

            const container = document.getElementById('gacha-canvas-container');
            const defaultAmbientColor = new THREE.Color(theme.primary);

            // --- 初始化场景 ---
            function initScene() {
                scene = new THREE.Scene();
                scene.fog = new THREE.FogExp2(0x000000, 0.02);

                camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.set(0, 2, 12);

                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.toneMapping = THREE.ReinhardToneMapping;
                container.appendChild(renderer.domElement);

                // 后处理
                const renderScene = new RenderPass(scene, camera);
                const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
                bloomPass.threshold = 0.1; bloomPass.strength = 1.5; bloomPass.radius = 0.5;
                composer = new EffectComposer(renderer);
                composer.addPass(renderScene);
                composer.addPass(bloomPass);

                // 灯光
                scene.add(new THREE.AmbientLight(0x404040, 1.5));
                const pl = new THREE.PointLight(0xffaa00, 2, 50); pl.position.set(0, 5, 5); scene.add(pl);
                const bl = new THREE.PointLight(0x0044ff, 3, 30); bl.position.set(0, -10, 0); scene.add(bl);

                const spotLight = new THREE.SpotLight(0xffffff, 3, 20, Math.PI / 6, 0.2);
                spotLight.position.set(0, 0, 5);
                spotLight.target.position.set(0, 0, 0);
                camera.add(spotLight); camera.add(spotLight.target);
                scene.add(camera);

                controls = new OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true; controls.dampingFactor = 0.05;
                controls.maxPolarAngle = Math.PI / 1.5; controls.minDistance = 5; controls.maxDistance = 20;

                // 创建对象
                createBackground();
                createGachaCore();
                createAmbientParticles();

                // 监听点击
                window.addEventListener('resize', onWindowResize);
                container.addEventListener('click', onCanvasClick);
            }

            // --- 辅助函数：稀有度 ---
            function getTierInfo(price) {
                if (price >= 8000) return { color: '#ffd700', hex: 0xffd700, tier: 5 };
                if (price >= 1000) return { color: '#ff4500', hex: 0xff4500, tier: 4 };
                if (price >= 200)  return { color: '#9b59b6', hex: 0x9b59b6, tier: 3 };
                if (price >= 80)   return { color: '#4a6b8a', hex: 0x4a6b8a, tier: 2 };
                return { color: '#555555', hex: 0x555555, tier: 1 };
            }

            // --- 3D 对象构建 ---
            function createBackground() {
                const geo = new THREE.CylinderGeometry(30, 30, 60, 32, 1, true);
                geo.scale(-1, 1, 1);
                const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#000'; ctx.fillRect(0,0,512,512);
                for(let i=0; i<50; i++) {
                    ctx.fillStyle = `hsla(${Math.random()*360}, 70%, 50%, 0.1)`;
                    ctx.fillRect(Math.random()*512, Math.random()*512, Math.random()*100, Math.random()*200);
                }
                const mat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, opacity: 0.3, side: THREE.BackSide, blending: THREE.AdditiveBlending });
                const bg = new THREE.Mesh(geo, mat);
                scene.add(bg);
                // 简单动画挂载在对象上
                bg.userData.update = () => { bg.rotation.y += 0.0005; };
            }

     function createGachaCore() {
            // 获取 CSS 变量中的颜色
            const rootStyles = getComputedStyle(document.documentElement);
            const primaryColor = new THREE.Color(theme.primary);
            const secondaryColor = new THREE.Color(theme.secondary);

            // 创建一个组来容纳所有部件
            gachaCore = new THREE.Group();

            // 1. 内核：明艳的多面体水晶 (Icosahedron)
            // 使用 MeshPhysicalMaterial 模拟玻璃/水晶质感
            const crystalGeo = new THREE.IcosahedronGeometry(1.5, 0); // 参数0表示不细分，保持多面体棱角
            const crystalMat = new THREE.MeshPhysicalMaterial({
                color: primaryColor,       // 基础色
                emissive: secondaryColor,    // 自发光颜色
                emissiveIntensity: 0.1,    // 发光强度
                metalness: 0.1,
                roughness: 0.1,
                transmission: 0.6,         // 透光度 (关键：模拟玻璃)
                thickness: 2.0,            // 介质厚度
                ior: 0,                  // 折射率
                flatShading: true,         // 开启平面着色，强调棱角
                side: THREE.DoubleSide
            });
            const crystal = new THREE.Mesh(crystalGeo, crystalMat);
            gachaCore.add(crystal);

            // 2. 内层包裹：金色金属线框 (模拟彩窗的铅条/金边)
            // 使用稍大一点的几何体 + 线框材质
            const cageGeo = new THREE.IcosahedronGeometry(1.55, 0);
            const cageMat = new THREE.MeshStandardMaterial({
                color: 0xd4af37,           // 金色
                metalness: 1.0,
                roughness: 0.2,
                wireframe: true,           // 开启线框模式
                emissive: 0xd4af37,
                emissiveIntensity: 0.2
            });
            const cage = new THREE.Mesh(cageGeo, cageMat);
            gachaCore.add(cage);

            // 3. 外层装饰：悬浮的尖刺结构 (Octahedron)
            // 增加哥特式的尖锐感，反向旋转的装饰层
            const outerGeo = new THREE.OctahedronGeometry(2.2, 0);
            const outerMat = new THREE.MeshBasicMaterial({
                color: primaryColor,
                wireframe: true,
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending // 叠加混合，产生光晕感
            });
            const outerShell = new THREE.Mesh(outerGeo, outerMat);

            // 给外壳一个独立的旋转动画引用，或者直接加到group里
            // 为了视觉复杂性，我们把它加到group里，但稍微旋转一下初始角度
            outerShell.rotation.z = Math.PI / 4;
            gachaCore.add(outerShell);

            // 4. 核心光源：让水晶从内部发光
            const coreLight = new THREE.PointLight(primaryColor, 5, 10);
            gachaCore.add(coreLight);

            scene.add(gachaCore);
        }
  

            function createAmbientParticles() {
                const count = 300;
                const geo = new THREE.BufferGeometry();
                const pos = [], speeds = [], offsets = [];
                for(let i=0; i<count; i++) {
                    pos.push((Math.random()-0.5)*40, (Math.random()-0.5)*30-10, (Math.random()-0.5)*30);
                    speeds.push(Math.random()*0.05+0.02);
                    offsets.push(Math.random()*Math.PI*2);
                }
                geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
                ambientMaterial = new THREE.PointsMaterial({ color: defaultAmbientColor, size: 0.1, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
                ambientParticles = new THREE.Points(geo, ambientMaterial);
                ambientParticles.userData = { speeds, offsets };
                scene.add(ambientParticles);
            }

            function createCardTexture(item, isFront) {
                const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 800;
                const ctx = canvas.getContext('2d');
                const tier = getTierInfo(item[1]);
                const color = tier.color;

                ctx.fillStyle = '#050505'; ctx.fillRect(0,0,512,800);
                ctx.strokeStyle = color; ctx.lineWidth = 20; ctx.lineJoin = 'round';

                // 尖顶路径
                ctx.beginPath(); ctx.moveTo(20, 780); ctx.lineTo(492, 780); ctx.lineTo(492, 500);
                ctx.quadraticCurveTo(256, 800, 20, 500); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(10, 790); ctx.lineTo(502, 790); ctx.lineTo(502, 200);
                ctx.quadraticCurveTo(256, -50, 10, 200); ctx.closePath(); ctx.stroke();

                if(!isFront) {
                    ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 20;
                    ctx.font = 'bold 100px Cinzel'; ctx.textAlign = 'center'; ctx.fillText("?", 256, 480);
                } else {
                    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(40, 150, 432, 600);
                    ctx.shadowColor = color; ctx.shadowBlur = 15; ctx.fillStyle = '#fff';
                    ctx.font = 'bold 42px Noto Serif SC'; ctx.textAlign = 'center'; ctx.fillText(item[0], 256, 250);
                    ctx.shadowBlur = 0; ctx.fillStyle = color; ctx.font = '30px Cinzel'; ctx.fillText(item[2], 256, 310);
                    ctx.fillStyle = '#d4af37'; ctx.font = '24px Cinzel'; ctx.fillText(`${item[1]} PTS`, 256, 350);
                    ctx.fillStyle = '#eee'; ctx.font = '26px Noto Serif SC';
                    const txt = item[4];
                    if(txt.length > 12) { ctx.fillText(txt.substring(0,12), 256, 500); ctx.fillText(txt.substring(12), 256, 540); }
                    else ctx.fillText(txt, 256, 500);
                }
                return new THREE.CanvasTexture(canvas);
            }

            function createCardMesh(item) {
                const boxGeo = new THREE.BoxGeometry(2, 3.5, 0.05);
                const alphaCanvas = document.createElement('canvas'); alphaCanvas.width = 512; alphaCanvas.height = 800;
                const actx = alphaCanvas.getContext('2d');
                actx.fillStyle = '#000'; actx.fillRect(0,0,512,800); actx.fillStyle = '#fff';
                actx.beginPath(); actx.moveTo(10, 790); actx.lineTo(502, 790); actx.lineTo(502, 200);
                actx.quadraticCurveTo(256, -50, 10, 200); actx.fill();
                const alphaMap = new THREE.CanvasTexture(alphaCanvas);

                const frontTex = createCardTexture(item, false);
                const realFrontTex = createCardTexture(item, true);

                const matFace = new THREE.MeshStandardMaterial({ map: frontTex, alphaMap: alphaMap, transparent: true, alphaTest: 0.5, roughness: 0.4, metalness: 0.1, emissive: 0xffffff, emissiveMap: frontTex, emissiveIntensity: 0.1 });
                const matBack = matFace.clone();
                const matInv = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });

                const card = new THREE.Mesh(boxGeo, [matInv, matInv, matInv, matInv, matFace, matBack]);
                card.userData = { item, isFlipped: false, frontTexture: realFrontTex, backTexture: frontTex, tierInfo: getTierInfo(item[1]) };
                return card;
            }

            function createExplosion(pos, colorHex) {
                const geo = new THREE.BufferGeometry();
                const posArr = [], velArr = [];
                for(let i=0; i<100; i++) {
                    posArr.push(pos.x, pos.y, pos.z);
                    const theta = Math.random()*Math.PI*2, phi = Math.acos(2*Math.random()-1), spd = Math.random()*0.2+0.05;
                    velArr.push(spd*Math.sin(phi)*Math.cos(theta), spd*Math.sin(phi)*Math.sin(theta), spd*Math.cos(phi));
                }
                geo.setAttribute('position', new THREE.Float32BufferAttribute(posArr, 3));
                const mesh = new THREE.Points(geo, new THREE.PointsMaterial({ color: colorHex, size: 0.2, transparent: true, blending: THREE.AdditiveBlending }));
                scene.add(mesh);
                particles.push({ mesh, velocities: velArr, age: 0 });
            }

            // --- 交互逻辑 ---
   async function startGacha(count) {
                if(isAnimating) return;

                // --- 新增：货币检查逻辑 ---
                const GACHA_CONFIG = { singleCost: 160, tenCost: 1440 };
                const cost = count === 1 ? GACHA_CONFIG.singleCost : GACHA_CONFIG.tenCost;

                let currentPoints = 0;
                // 安全获取积分
                try {
                    if (window.GameAPI && window.GameAPI.playCharacterData) {
                        currentPoints = window.GameAPI.playCharacterData.货币段.积分[0];
                    } else {
                        console.warn("无法读取 playCharacterData，跳过积分检查");
                        currentPoints = 999999; // 调试模式或获取失败时允许抽卡
                    }
                } catch (e) {
                    console.error("积分数据结构错误", e);
                }

                if (currentPoints < cost) {
                     worldHelper.showNovaAlert(`积分不足！\n当前积分: ${currentPoints}\n需要积分: ${cost}`);
                    return; // 终止抽卡
                }
                // -------------------------

                // 1. 获取数据 (调用 GameAPI)
                if (window.GameAPI && window.GameAPI.performGacha) {
                
                    currentResults =  await window.GameAPI.performGacha(count);
                } else {
                    console.error("GameAPI.performGacha not found");
                    return;
                }

                if (!currentResults || currentResults.length === 0) {
                     worldHelper.showNovaAlert("未获取到抽奖数据");
                    return;
                }

                isAnimating = true;
                document.getElementById('gacha-start-btns').style.display = 'none';

                // ... (后续动画代码保持不变，从 let maxTier = 0 开始 ...)
                let maxTier = 0, maxColor = 0xffffff;
                currentResults.forEach(i => { const t = getTierInfo(i[1]); if(t.tier > maxTier) { maxTier = t.tier; maxColor = t.hex; }});

                new TWEEN.Tween(ambientMaterial.color).to(new THREE.Color(maxColor), 2000).start();

                // 核心旋转爆炸
                new TWEEN.Tween(gachaCore.rotation).to({ y: gachaCore.rotation.y + 20, x: gachaCore.rotation.x + 10 }, 2000).easing(TWEEN.Easing.Quadratic.In).start();
                new TWEEN.Tween(gachaCore.scale).to({ x: 0.1, y: 0.1, z: 0.1 }, 1800).easing(TWEEN.Easing.Back.In).start();

                new TWEEN.Tween(camera.position).to({ z: 5 }, 1500).easing(TWEEN.Easing.Cubic.InOut).onComplete(() => {
                    createExplosion(new THREE.Vector3(0,0,0), maxColor);
                    gachaCore.visible = false;
                    spawnCards(currentResults);
                }).start();
            }

            function spawnCards(results) {
                const count = results.length;
                const radius = count === 1 ? 0 : (count <= 5 ? 3 : 5);

                results.forEach((item, i) => {
                    const card = createCardMesh(item);
                    scene.add(card);
                    cards.push(card);

                    const angle = (i/count)*Math.PI*2;
                    const tx = count===1 ? 0 : Math.cos(angle)*radius;
                    const ty = count===1 ? 0 : Math.sin(angle)*radius*0.5;
                    const tz = (i%2)*0.1;

                    card.position.set(0,0,0); card.scale.set(0,0,0); card.rotation.set(0, Math.PI, 0);

                    new TWEEN.Tween(card.position).to({ x: tx, y: ty, z: tz }, 1000).easing(TWEEN.Easing.Elastic.Out).delay(i*50).start();
                    new TWEEN.Tween(card.scale).to({ x: 1, y: 1, z: 1 }, 800).delay(i*50).start();
                    new TWEEN.Tween(card.rotation).to({ y: 0 }, 1000).delay(i*50).onComplete(() => {
                        card.userData.originalPos = card.position.clone();
                        if(i === count-1) setTimeout(flipAllCards, 500);
                    }).start();
                });

                new TWEEN.Tween(camera.position).to({ x: 0, y: 0, z: count === 1 ? 8 : 14 }, 1500).easing(TWEEN.Easing.Cubic.Out).start();
            }

            function flipAllCards() {
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        new TWEEN.Tween(card.rotation).to({ y: Math.PI*2 }, 500).onStart(() => {
                            setTimeout(() => {
                                card.material[4].map = card.userData.frontTexture;
                                card.material[4].emissiveMap = card.userData.frontTexture;
                                card.material[4].emissiveIntensity = 0.3;
                                card.material[4].needsUpdate = true;
                            }, 250);
                        }).onComplete(() => {
                            card.userData.isFlipped = true;
                            if(i === cards.length-1) {
                                isAnimating = false;
                                document.getElementById('gacha-btn-confirm').style.display = 'inline-block';
                                // 自动聚焦随机一张
                                if(cards.length > 0) focusCard(cards[Math.floor(Math.random()*cards.length)]);
                            }
                        }).start();
                    }, i*300);
                });
            }

            function focusCard(card) {
                new TWEEN.Tween(camera.position).to({ x: card.position.x, y: card.position.y, z: card.position.z + 6 }, 800).easing(TWEEN.Easing.Cubic.Out).start();
            }

        async function confirmAndReset() {
                // --- 新增：结算与扣费逻辑 ---
                const count = currentResults.length;
                const GACHA_CONFIG = { singleCost: 160, tenCost: 1440 };
                const cost = count === 1 ? GACHA_CONFIG.singleCost : GACHA_CONFIG.tenCost;

                if (window.GameAPI) {
                    // 1. 前端立刻扣除积分 (更新显示)
                    // try {
                    //     if(window.GameAPI.playCharacterData && window.GameAPI.playCharacterData.货币段) {
                    //         window.GameAPI.playCharacterData.货币段.积分[0] -= cost;
                    //         console.log(`前端积分已扣除: -${cost}`);
                    //     }
                    // } catch (e) { console.error("前端扣费失败:", e); }

                    // 2. 调用结算函数 (处理物品入库和后端记忆)
                    try {
                        // 优先尝试通过 API 调用
                 if (typeof window.processGachaRewards === 'function') {
                            await window.processGachaRewards(currentResults);
                        } else {
                            console.error("无法找到 processGachaRewards 函数，请检查接口挂载");
                        }
                    } catch (e) {
                        console.error("结算过程发生错误:", e);
                    }
                }
                // -------------------------

                // 3. 视觉重置 (保持不变)
                document.getElementById('gacha-btn-confirm').style.display = 'none';
                document.getElementById('gacha-item-detail').style.display = 'none';

                // 卡片消失
                cards.forEach(c => new TWEEN.Tween(c.scale).to({x:0,y:0,z:0}, 300).start());

                setTimeout(() => {
                    cards.forEach(c => { scene.remove(c); c.geometry.dispose(); });
                    cards = [];

                    // 核心重现
                    gachaCore.visible = true;
                    gachaCore.scale.set(1,1,1);
                    gachaCore.rotation.set(0,0,0);

                    // 相机复位
                    new TWEEN.Tween(camera.position).to({ x: 0, y: 2, z: 12 }, 1000).start();
                    new TWEEN.Tween(ambientMaterial.color).to(defaultAmbientColor, 1000).start();

                    // 按钮复位
                    document.getElementById('gacha-start-btns').style.display = 'block';
                }, 350);
            }

            function onCanvasClick(e) {
                if(e.target.closest('button') || e.target.closest('#gacha-item-detail')) return;
                const mouse = new THREE.Vector2((e.clientX/window.innerWidth)*2-1, -(e.clientY/window.innerHeight)*2+1);
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(cards);
                if(intersects.length > 0) {
                    const card = intersects[0].object;
                    if(card.userData.isFlipped) {
                        focusCard(card);
                        showDetail(card);
                    }
                }
            }

            function showDetail(card) {
                const item = card.userData.item;
                const tier = card.userData.tierInfo;
                const el = document.getElementById('gacha-item-detail');
                document.getElementById('gacha-detail-name').innerText = item[0];
                document.getElementById('gacha-detail-name').style.color = tier.color;
                document.getElementById('gacha-detail-type').innerText = `${item[2]} | ${item[1]} PTS`;
                document.getElementById('gacha-detail-desc').innerText = item[5];
                document.getElementById('gacha-detail-stats').innerText = item[4];
                el.style.display = 'block'; el.style.opacity = 0;
                new TWEEN.Tween(el.style).to({opacity:1}, 300).start();
            }

            function onWindowResize() {
                if(!camera) return;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                composer.setSize(window.innerWidth, window.innerHeight);
            }

            function animate(time) {
                animationFrameId = requestAnimationFrame(animate);
                TWEEN.update(time);
                if(controls) controls.update();

                if(gachaCore && gachaCore.visible) {
                    gachaCore.rotation.y += 0.01; gachaCore.rotation.z += 0.005;
                }

                // 粒子更新
                for(let i=particles.length-1; i>=0; i--) {
                    const p = particles[i];
                    const pos = p.mesh.geometry.attributes.position.array;
                    for(let j=0; j<p.velocities.length; j+=3) {
                        pos[j] += p.velocities[j]; pos[j+1] += p.velocities[j+1]; pos[j+2] += p.velocities[j+2];
                    }
                    p.mesh.geometry.attributes.position.needsUpdate = true;
                    p.age++; p.mesh.material.opacity = 1 - (p.age/60);
                    if(p.age>60) { scene.remove(p.mesh); particles.splice(i,1); }
                }

                // 环境粒子
                if(ambientParticles) {
                    const pos = ambientParticles.geometry.attributes.position.array;
                    const speeds = ambientParticles.userData.speeds;
                    const offsets = ambientParticles.userData.offsets;
                    for(let i=0; i<pos.length/3; i++) {
                        pos[i*3+1] += speeds[i];
                        const t = time*0.001 + offsets[i];
                        pos[i*3] += Math.sin(t)*0.02; pos[i*3+2] += Math.cos(t)*0.02;
                        if(pos[i*3+1] > 15) {
                            pos[i*3+1] = -15; pos[i*3] = (Math.random()-0.5)*40; pos[i*3+2] = (Math.random()-0.5)*30;
                        }
                    }
                    ambientParticles.geometry.attributes.position.needsUpdate = true;
                    ambientParticles.rotation.y += 0.001;
                }

                // 卡片浮动
                cards.forEach((c, i) => {
                    if(!isAnimating && c.userData.originalPos) c.position.y = c.userData.originalPos.y + Math.sin(time*0.002+i)*0.1;
                });

                // 场景背景更新
                scene.children.forEach(c => { if(c.userData.update) c.userData.update(); });

                if(composer) composer.render();
            }

            // --- 启动与关闭 ---
            function openGachaSystem() {
                document.getElementById('gacha-overlay').classList.add('active');
                if(!renderer) {
                    initScene();
                    animate();
                } else {
                    // 重新开始渲染循环（如果之前停止了）
                    if(!animationFrameId) animate();
                }
            }

            function closeGachaSystem() {
                document.getElementById('gacha-overlay').classList.remove('active');
                // 可选：暂停渲染以节省性能
                // cancelAnimationFrame(animationFrameId);
                // animationFrameId = null;
            }

            // --- 绑定按钮事件 ---
            document.getElementById('gacha-btn-single').addEventListener('click', () => startGacha(1));
            document.getElementById('gacha-btn-ten').addEventListener('click', () => startGacha(10));
            document.getElementById('gacha-btn-confirm').addEventListener('click', confirmAndReset);
            document.getElementById('gacha-close-detail').addEventListener('click', () => {
                document.getElementById('gacha-item-detail').style.display = 'none';
                new TWEEN.Tween(camera.position).to({ x: 0, y: 0, z: cards.length === 1 ? 8 : 14 }, 800).start();
            });

            // 外部入口按钮
            const entryBtn = document.getElementById('enter-gacha01-btn');
            if(entryBtn) {
                entryBtn.style.display = 'block';
                entryBtn.addEventListener('click', openGachaSystem);}

            // 关闭按钮
            document.getElementById('gacha-close-btn').addEventListener('click', closeGachaSystem);

        }); // End of Three.js import
    })();

    // ==========================================
    // 模拟 GameAPI (集成时请删除此部分)
    // ==========================================
    // if (!window.GameAPI) {
    //     window.GameAPI = {
    //         performGacha: function(count) {
    //             console.log(`[API] Performing gacha for ${count} items.`);
    //             const pool = [
    //                 ["情绪调色盘", 8800, "技能", {D:1}, "【dp+1;能量池-30】", "短暂影响目标的某种情绪。"],
    //                 ["破碎的圣像", 200, "素材", {}, "【制作材料】", "沾染了旧日气息的石块。"],
    //                 ["以太药剂", 500, "消耗品", {HP:50}, "【恢复HP】", "散发着微光的蓝色液体。"],
    //                 ["黑曜石匕首", 1200, "武器", {ATK:15}, "【攻击力+15】", "通体漆黑，在月光下也不会反光。"],
    //                 ["生锈的齿轮", 50, "垃圾", {}, "【无】", "没什么用的工业废料。"]
    //             ];
    //             const results = [];
    //             for(let i=0; i<count; i++) results.push(pool[Math.floor(Math.random()*pool.length)]);
    //             return results;
    //         },
    //         processGachaRewards: async function(results) {
    //             console.log("[API] Processing rewards:", results);
    //             return new Promise(resolve => setTimeout(resolve, 500)); // 模拟异步保存
    //         }
    //     };
    // }