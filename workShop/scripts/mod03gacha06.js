(function() {
    // ==========================================
    // 0. 依赖配置与动态加载
    // ==========================================
    const THREE_CDN = "https://unpkg.com/three@0.160.0/build/three.module.js";
    const ADDONS_CDN = "https://unpkg.com/three@0.160.0/examples/jsm/";

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
    // 1. 样式注入 (CSS - mod03 Namespace)
    // ==========================================
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Press+Start+2P&display=swap');

        /* 核心容器 */
        #mod03-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #000; z-index: 9999; display: none;
            font-family: 'DotGothic16', sans-serif;
            image-rendering: pixelated; /* 强制像素化渲染 */
        }
        #mod03-overlay.active { display: block; }

        /* 画布层 */
        #mod03-canvas-container {
            width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 1;
            background: radial-gradient(circle at center, #1a1a2e 0%, #000000 100%);
        }

        /* CRT 扫描线特效层 */
        #mod03-crt-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 5;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
        }

        /* UI 层 */
        #mod03-ui-layer {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10;
            pointer-events: none; display: flex; flex-direction: column; justify-content: space-between;
            padding: 20px; box-sizing: border-box;
        }

        /* 通用 RPG 窗口样式 */
        .mod03-rpg-window {
            background: #000;
            border: 4px solid #fff;
            border-radius: 4px;
            box-shadow:
                inset 0 0 0 4px #000, /* 内黑边 */
                0 0 0 4px #000;       /* 外黑边 */
            padding: 15px;
            color: #fff;
            position: relative;
            pointer-events: auto;
        }
        /* 装饰性边角 */
        .mod03-rpg-window::after {
            content: ''; position: absolute; top: -4px; left: -4px; right: -4px; bottom: -4px;
            border: 2px solid #fff; pointer-events: none;
        }

        /* 顶部消息框 */
        .mod03-message-box {
            width: 80%; margin: 20px auto 0; text-align: left;
            font-size: 1.5rem; line-height: 1.6; min-height: 80px;
            text-shadow: 2px 2px 0 #333;
        }
        .mod03-cursor {
            display: inline-block; width: 10px; height: 20px; background: #fff;
            animation: mod03-blink 0.8s infinite; vertical-align: middle; margin-left: 5px;
        }

        /* 底部指令菜单 */
        .mod03-command-menu {
            align-self: flex-end;
            width: 300px;
            margin-bottom: 40px;
            margin-right: 40px;
            display: flex; flex-direction: column; gap: 10px;
        }

        .mod03-cmd-btn {
            background: transparent; border: none; color: #fff;
            font-family: 'Press Start 2P', cursive; /* 标题字体 */
            font-size: 1rem; text-align: left; padding: 10px 20px;
            cursor: pointer; position: relative; text-transform: uppercase;
            transition: transform 0.1s;
        }
        .mod03-cmd-btn:hover, .mod03-cmd-btn:focus {
            color: #ffeb3b; text-shadow: 2px 2px 0 #b71c1c;
            transform: translateX(10px);
        }
        /* 选中时的箭头 */
        .mod03-cmd-btn:hover::before {
            content: '▶'; position: absolute; left: -15px; top: 10px; color: #fff;
            animation: mod03-bounce 0.5s infinite alternate;
        }
        .mod03-cmd-btn:disabled { color: #555; cursor: not-allowed; transform: none; }
        .mod03-cmd-btn:disabled::before { display: none; }

        /* 物品详情弹窗 (模仿装备栏) */
        #mod03-item-detail {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 320px; max-height: 70vh;
            display: none; z-index: 20;
            display: flex; flex-direction: column;
        }

        .mod03-detail-header {
            border-bottom: 2px dashed #fff; padding-bottom: 10px; margin-bottom: 10px;
            text-align: center;
        }
        .mod03-detail-name { color: #ffeb3b; font-size: 1.4rem; margin-bottom: 5px; font-family: 'Press Start 2P'; line-height: 1.4;}
        .mod03-detail-meta { font-size: 0.9rem; color: #aaa; display: flex; justify-content: space-between; }

        .mod03-detail-content {
            overflow-y: auto; padding-right: 5px; flex-grow: 1;
            /* 自定义滚动条 */
            scrollbar-width: thin; scrollbar-color: #fff #000;
        }
        .mod03-detail-content::-webkit-scrollbar { width: 8px; }
        .mod03-detail-content::-webkit-scrollbar-track { background: #000; }
        .mod03-detail-content::-webkit-scrollbar-thumb { background: #fff; border: 2px solid #000; }

        .mod03-detail-desc { font-size: 1.1rem; line-height: 1.5; margin-bottom: 15px; }
        .mod03-detail-stats { color: #4fc3f7; font-size: 0.9rem; font-family: monospace; white-space: pre-wrap; }

        .mod03-close-detail {
            margin-top: 15px; background: #fff; color: #000; border: none;
            padding: 10px; font-family: 'Press Start 2P'; cursor: pointer;
            text-align: center;
        }
        .mod03-close-detail:hover { background: #ffeb3b; }

        /* 动画定义 */
        @keyframes mod03-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes mod03-bounce { from { transform: translateX(0); } to { transform: translateX(-5px); } }
        @keyframes mod03-shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .mod03-shake-anim { animation: mod03-shake 0.5s; }

        /* 移动端适配 */
        @media (max-width: 768px) {
            .mod03-command-menu { width: 90%; margin: 0 auto 20px auto; align-self: center; }
            .mod03-message-box { width: 90%; font-size: 1rem; }
            .mod03-cmd-btn { font-size: 0.8rem; padding: 15px; border: 1px solid #333; margin-bottom: 5px; background: rgba(0,0,0,0.8); }
            .mod03-cmd-btn:hover::before { display: none; } /* 移动端移除hover箭头 */
            #mod03-item-detail { width: 90%; }
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 2. DOM 结构构建
    // ==========================================
    const overlay = document.createElement('div');
    overlay.id = 'mod03-overlay';
    overlay.innerHTML = `
        <div id="mod03-canvas-container"></div>
        <div id="mod03-crt-overlay"></div>
        <div id="mod03-ui-layer">
            <div class="mod03-rpg-window mod03-message-box">
       <span id="mod03-msg-text">野生的宝箱出现了！</span><span class="mod03-cursor"></span>
            </div>

            <div class="mod03-rpg-window mod03-command-menu" id="mod03-controls">
              <div style="position:absolute; top:-25px; left:10px; background:#000; padding:0 5px; color:#aaa; font-size:0.8rem;">指令</div>
              <button id="mod03-btn-single" class="mod03-cmd-btn">▶ 召唤 (1次)</button>
<button id="mod03-btn-ten" class="mod03-cmd-btn">▶ 召唤 (10次)</button>
<button id="mod03-btn-confirm" class="mod03-cmd-btn" style="display:none;">▶ 收集战利品</button>
<button id="mod03-btn-close" class="mod03-cmd-btn">▶ 逃跑</button>
            </div>
        </div>

        <div id="mod03-item-detail" class="mod03-rpg-window" style="display:none;">
            <div class="mod03-detail-header">
                <div id="mod03-detail-name" class="mod03-detail-name"></div>
                <div class="mod03-detail-meta">
                    <span id="mod03-detail-type"></span>
                    <span id="mod03-detail-price"></span>
                </div>
            </div>
            <div class="mod03-detail-content">
                <div id="mod03-detail-desc" class="mod03-detail-stats"></div>
                <div style="margin: 10px 0; border-top: 1px solid #333;"></div>
                <div id="mod03-detail-flavor" class="mod03-detail-desc" style="color:#ccc; font-style:italic;"></div>
            </div>
          <button id="mod03-close-detail" class="mod03-close-detail">关闭</button>
        </div>
    `;
    document.body.appendChild(overlay);

    // ==========================================
    // 3. 逻辑核心 (Three.js + DQ Style)
    // ==========================================
    import('three').then(async (THREE) => {
        const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
        const TWEEN = (await import('three/addons/libs/tween.module.js')).default;

        // --- 变量定义 ---
        let scene, camera, renderer, controls;
        let chestGroup, chestLid, chestBase;
        let particles = [];
        let lootMeshes = [];
        let isAnimating = false;
        let currentResults = [];
        let animationFrameId;

        // 游戏状态文本
 const MSG_IDLE = "野生的宝箱出现了！\n请下指令？";
const MSG_OPENING = "你咏唱了开启之咒...\n宝箱开始颤抖！";
const MSG_RESULT = "发现了宝物！";
const MSG_POOR = "MP(点数)不足！";

        const container = document.getElementById('mod03-canvas-container');
        const msgEl = document.getElementById('mod03-msg-text');

        // --- 辅助：打字机效果 ---
        function typeText(text, speed = 30) {
            msgEl.innerText = "";
            let i = 0;
            function type() {
                if (i < text.length) {
                    msgEl.innerText += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            type();
        }

        // --- 辅助：程序化生成像素纹理 ---
        function createPixelTexture(colorMain, colorEdge) {
            const size = 64;
            const canvas = document.createElement('canvas');
            canvas.width = size; canvas.height = size;
            const ctx = canvas.getContext('2d');

            // 填充主色
            ctx.fillStyle = colorMain; ctx.fillRect(0,0,size,size);

            // 绘制像素噪点
            for(let i=0; i<40; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                const x = Math.floor(Math.random()*8)*8;
                const y = Math.floor(Math.random()*8)*8;
                ctx.fillRect(x, y, 8, 8);
            }

            // 绘制边框 (模拟体素边缘)
            ctx.strokeStyle = colorEdge; ctx.lineWidth = 8;
            ctx.strokeRect(0,0,size,size);

            const tex = new THREE.CanvasTexture(canvas);
            tex.magFilter = THREE.NearestFilter; // 关键：像素化滤镜
            tex.minFilter = THREE.NearestFilter;
            return tex;
        }

        // --- 初始化场景 ---
        function initScene() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x110b29); // 深紫色夜空
            scene.fog = new THREE.Fog(0x110b29, 10, 40);

            // 摄像机：稍微俯视，模拟经典 RPG 视角
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 6, 12);
            camera.lookAt(0, 1, 0);

            renderer = new THREE.WebGLRenderer({ antialias: false }); // 关闭抗锯齿以获得更锐利的像素感
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio); // 限制像素比以保持复古感
            container.appendChild(renderer.domElement);

            // 灯光
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            const dirLight = new THREE.DirectionalLight(0xffd700, 1.5);
            dirLight.position.set(5, 10, 7);
            scene.add(dirLight);

            // 创建对象
            createFloor();
            createVoxelChest();

            // 监听
            window.addEventListener('resize', onWindowResize);
            container.addEventListener('click', onCanvasClick);

            typeText(MSG_IDLE);
        }

        function createFloor() {
            const size = 64;
            const canvas = document.createElement('canvas');
            canvas.width = size; canvas.height = size;
            const ctx = canvas.getContext('2d');
            // 棋盘格地板
            ctx.fillStyle = '#222'; ctx.fillRect(0,0,64,64);
            ctx.fillStyle = '#333'; ctx.fillRect(0,0,32,32); ctx.fillRect(32,32,32,32);

            const tex = new THREE.CanvasTexture(canvas);
            tex.magFilter = THREE.NearestFilter;
            tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(10, 10);

            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(40, 40),
                new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 })
            );
            plane.rotation.x = -Math.PI / 2;
            scene.add(plane);
        }

        function createVoxelChest() {
            chestGroup = new THREE.Group();

            const texRed = createPixelTexture('#b71c1c', '#5f0a0a'); // 红箱子
            const texGold = createPixelTexture('#ffeb3b', '#f57f17'); // 金边

            // 材质数组
            const matRed = new THREE.MeshStandardMaterial({ map: texRed });
            const matGold = new THREE.MeshStandardMaterial({ map: texGold });

            // 1. 箱体 (Base)
            chestBase = new THREE.Group();
            const baseGeo = new THREE.BoxGeometry(3, 1.5, 2);
            const baseMesh = new THREE.Mesh(baseGeo, matRed);
            baseMesh.position.y = 0.75;
            chestBase.add(baseMesh);

            // 锁扣
            const lockMesh = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.1), matGold);
            lockMesh.position.set(0, 1.2, 1.01);
            chestBase.add(lockMesh);

            // 2. 箱盖 (Lid) - 关键点在于旋转轴
            chestLid = new THREE.Group();
            const lidGeo = new THREE.BoxGeometry(3, 0.5, 2);
            const lidMesh = new THREE.Mesh(lidGeo, matRed);
            lidMesh.position.set(0, 0.25, 0); // 相对 Lid 组的中心
            chestLid.add(lidMesh);

            // 盖子上的拱形装饰 (简化为方块堆叠)
            const topGeo = new THREE.BoxGeometry(2.6, 0.4, 1.6);
            const topMesh = new THREE.Mesh(topGeo, matRed);
            topMesh.position.set(0, 0.7, 0);
            chestLid.add(topMesh);

            // 盖子位置调整：旋转轴在箱子后方
            chestLid.position.set(0, 1.5, -1);
            // 修正盖子模型的偏移，使其看起来盖在箱子上
            lidMesh.position.z = 1;
            topMesh.position.z = 1;

            chestGroup.add(chestBase);
            chestGroup.add(chestLid);
            scene.add(chestGroup);
        }

        // --- 物品卡片 (3D 像素板) ---
        function createLootItem(item, index, total) {
            const tierInfo = getTierInfo(item[1]);

            // 创建 Canvas 纹理作为卡面
            const w = 256, h = 300;
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');

            // 背景
            ctx.fillStyle = '#000'; ctx.fillRect(0,0,w,h);
            // 边框
            ctx.strokeStyle = tierInfo.color; ctx.lineWidth = 10;
            ctx.strokeRect(5,5,w-10,h-10);

            // 稀有度颜色块
            ctx.fillStyle = tierInfo.color;
            ctx.fillRect(20, 20, w-40, 100);

            // 问号或图标
            ctx.fillStyle = '#000'; ctx.font = '60px "Press Start 2P"'; ctx.textAlign = 'center';
            ctx.fillText("?", w/2, 90);

            // 文本
            ctx.fillStyle = '#fff'; ctx.font = '20px "Press Start 2P"';
            // 名字自动换行处理略，简化显示
      ctx.fillText("物品", w/2, 160);
ctx.fillStyle = tierInfo.color; ctx.font = '16px monospace';
ctx.fillText(`等级 ${tierInfo.tier}`, w/2, 200);

            const tex = new THREE.CanvasTexture(canvas);
            tex.magFilter = THREE.NearestFilter;

            const geo = new THREE.BoxGeometry(1.5, 2, 0.1);
            const mat = new THREE.MeshBasicMaterial({ map: tex });
            const mesh = new THREE.Mesh(geo, mat);

            // 存储数据
            mesh.userData = { item, tierInfo, originalPos: null };

            // 初始位置：在箱子里
            mesh.position.set(0, 1, 0);
            mesh.scale.set(0.1, 0.1, 0.1);
            mesh.visible = false;

            scene.add(mesh);
            lootMeshes.push(mesh);

            // 动画：弹出
            const angle = (index / total) * Math.PI * 2;
            const radius = total === 1 ? 0 : 3.5;
            const targetX = Math.cos(angle) * radius;
            const targetZ = Math.sin(angle) * radius + 2; // 稍微靠前
            const targetY = 2.5 + (index % 2) * 0.5;

            setTimeout(() => {
                mesh.visible = true;
                // 抛物线跳跃
                new TWEEN.Tween(mesh.position)
                    .to({ x: targetX, y: targetY, z: targetZ }, 800)
                    .easing(TWEEN.Easing.Back.Out)
                    .onComplete(() => {
                        mesh.userData.originalPos = mesh.position.clone();
                        // 翻转显示真名 (重新绘制 Canvas)
                        updateLootTexture(mesh, item, tierInfo);
                    })
                    .start();

                new TWEEN.Tween(mesh.scale)
                    .to({ x: 1, y: 1, z: 1 }, 600)
                    .start();

                // 旋转特效
                new TWEEN.Tween(mesh.rotation)
                    .to({ y: Math.PI * 2 }, 800)
                    .start();

            }, index * 150 + 500);
        }

        function updateLootTexture(mesh, item, tierInfo) {
            const canvas = mesh.material.map.image;
            const ctx = canvas.getContext('2d');
            const w = 256, h = 300;

            ctx.fillStyle = '#000'; ctx.fillRect(0,0,w,h);
            ctx.strokeStyle = tierInfo.color; ctx.lineWidth = 10; ctx.strokeRect(5,5,w-10,h-10);

            // 名字区域
            ctx.fillStyle = tierInfo.color; ctx.fillRect(15, 15, w-30, 50);
            ctx.fillStyle = '#000'; ctx.font = '20px "Press Start 2P"'; ctx.textAlign = 'center';

            // 名字截断
            let name = item[0];
            if(name.length > 10) name = name.substring(0,9) + ".";
            ctx.fillText(name, w/2, 50);

            // 详情
            ctx.fillStyle = '#fff'; ctx.font = '18px monospace';
            ctx.fillText(item[2], w/2, 100); // Type

            ctx.fillStyle = '#ffeb3b'; ctx.font = '24px "Press Start 2P"';
            ctx.fillText(item[1], w/2, 150); // PTS

            ctx.fillStyle = '#aaa'; ctx.font = '14px monospace';
            // 简单的描述预览
       ctx.fillText("点击查看详情", w/2, 250);

            mesh.material.map.needsUpdate = true;
        }

        function getTierInfo(price) {
            if (price >= 8000) return { color: '#ffd700', tier: 'S' }; // Gold
            if (price >= 1000) return { color: '#ff4500', tier: 'A' }; // Orange
            if (price >= 200)  return { color: '#d000f0', tier: 'B' }; // Purple
            if (price >= 80)   return { color: '#00bfff', tier: 'C' }; // Blue
            return { color: '#ffffff', tier: 'D' }; // White
        }

        // --- 粒子爆炸 (像素块) ---
        function createExplosion(color) {
            const geo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const mat = new THREE.MeshBasicMaterial({ color: color });

            for(let i=0; i<30; i++) {
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(0, 1.5, 0);

                const velocity = new THREE.Vector3(
                    (Math.random()-0.5) * 0.5,
                    Math.random() * 0.5 + 0.2,
                    (Math.random()-0.5) * 0.5
                );

                scene.add(mesh);
                particles.push({ mesh, velocity, life: 60 });
            }
        }

        // --- 交互逻辑 ---
        async function startGacha(count) {
            if(isAnimating) return;

            // 1. 积分检查
            const GACHA_CONFIG = { singleCost: 160, tenCost: 1440 };
            const cost = count === 1 ? GACHA_CONFIG.singleCost : GACHA_CONFIG.tenCost;
            let currentPoints = 0;
            try {
                if (window.GameAPI && window.GameAPI.playCharacterData) {
                    currentPoints = window.GameAPI.playCharacterData.货币段.积分[0];
                } else {
                    currentPoints = 999999;
                }
            } catch (e) {}

            if (currentPoints < cost) {
                typeText(MSG_POOR);
                // 震动 UI
                document.getElementById('mod03-controls').classList.add('mod03-shake-anim');
                setTimeout(()=>document.getElementById('mod03-controls').classList.remove('mod03-shake-anim'), 500);
                return;
            }

            // 2. 获取数据
            if (window.GameAPI && window.GameAPI.performGacha) {
                currentResults = await window.GameAPI.performGacha(count);
            } else {
                return;
            }

            if (!currentResults || currentResults.length === 0) return;

            // 3. 开始动画
            isAnimating = true;
            typeText(MSG_OPENING);

            // 隐藏按钮
            document.getElementById('mod03-btn-single').style.display = 'none';
            document.getElementById('mod03-btn-ten').style.display = 'none';
            document.getElementById('mod03-btn-close').style.display = 'none';

            // 箱子震动
            const shakeTween = new TWEEN.Tween(chestGroup.rotation)
                .to({ z: 0.1 }, 50)
                .yoyo(true)
                .repeat(10)
                .onComplete(() => {
                    // 开箱
                    new TWEEN.Tween(chestLid.rotation)
                        .to({ x: -Math.PI / 1.8 }, 500) // 打开盖子
                        .easing(TWEEN.Easing.Bounce.Out)
                        .onComplete(() => {
                            // 粒子爆发
                            createExplosion(0xffd700);
                            createExplosion(0xffffff);

                            // 生成物品
                            currentResults.forEach((item, i) => {
                                createLootItem(item, i, currentResults.length);
                            });

                            typeText(MSG_RESULT);

                            // 显示确认按钮
                            setTimeout(() => {
                                document.getElementById('mod03-btn-confirm').style.display = 'block';
                                isAnimating = false;
                            }, currentResults.length * 150 + 1000);
                        })
                        .start();
                })
                .start();
        }

        async function confirmAndReset() {
            // 结算
            if (window.GameAPI && typeof window.processGachaRewards === 'function') {
                await window.processGachaRewards(currentResults);
            }

            // 清理场景
            lootMeshes.forEach(m => {
                new TWEEN.Tween(m.scale).to({x:0,y:0,z:0}, 300).start();
                setTimeout(() => scene.remove(m), 300);
            });
            lootMeshes = [];

            // 关箱子
            new TWEEN.Tween(chestLid.rotation).to({ x: 0 }, 500).start();

            // UI 复位
            document.getElementById('mod03-btn-confirm').style.display = 'none';
            document.getElementById('mod03-btn-single').style.display = 'block';
            document.getElementById('mod03-btn-ten').style.display = 'block';
            document.getElementById('mod03-btn-close').style.display = 'block';
            document.getElementById('mod03-item-detail').style.display = 'none';

            typeText(MSG_IDLE);
        }

        function onCanvasClick(e) {
            if(isAnimating) return;
            const mouse = new THREE.Vector2(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1
            );
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(lootMeshes);

            if(intersects.length > 0) {
                const obj = intersects[0].object;
                showDetail(obj.userData.item, obj.userData.tierInfo);
            }
        }

        function showDetail(item, tier) {
            const el = document.getElementById('mod03-item-detail');
            document.getElementById('mod03-detail-name').innerText = item[0];
            document.getElementById('mod03-detail-name').style.color = tier.color;
            document.getElementById('mod03-detail-type').innerText = item[2];
            document.getElementById('mod03-detail-price').innerText = `${item[1]} G`;
            document.getElementById('mod03-detail-desc').innerText = item[4]; // 属性
            document.getElementById('mod03-detail-flavor').innerText = item[5]; // 描述

            el.style.display = 'flex';
        }

        function onWindowResize() {
            if(!camera) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate(time) {
            animationFrameId = requestAnimationFrame(animate);
            TWEEN.update(time);

            // 粒子物理
            for(let i=particles.length-1; i>=0; i--) {
                const p = particles[i];
                p.mesh.position.add(p.velocity);
                p.velocity.y -= 0.02; // 重力
                p.life--;
                if(p.life <= 0) {
                    scene.remove(p.mesh);
                    particles.splice(i, 1);
                }
            }

            // 物品浮动
            lootMeshes.forEach((m, i) => {
                if(m.visible && m.userData.originalPos) {
                    m.position.y = m.userData.originalPos.y + Math.sin(time * 0.003 + i) * 0.1;
                    m.rotation.y += 0.01;
                }
            });

            renderer.render(scene, camera);
        }

        // --- 启动与关闭 ---
        function openGachaSystem() {
            document.getElementById('mod03-overlay').classList.add('active');
            if(!renderer) {
                initScene();
                animate();
            } else {
                if(!animationFrameId) animate();
            }
        }

        function closeGachaSystem() {
            document.getElementById('mod03-overlay').classList.remove('active');
        }

        // --- 绑定事件 ---
        document.getElementById('mod03-btn-single').addEventListener('click', () => startGacha(1));
        document.getElementById('mod03-btn-ten').addEventListener('click', () => startGacha(10));
        document.getElementById('mod03-btn-confirm').addEventListener('click', confirmAndReset);
        document.getElementById('mod03-btn-close').addEventListener('click', closeGachaSystem);
        document.getElementById('mod03-close-detail').addEventListener('click', () => {
            document.getElementById('mod03-item-detail').style.display = 'none';
        });

        // 外部入口
        const entryBtn = document.getElementById('enter-gacha01-btn');
        if(entryBtn) {
            entryBtn.style.display = 'block';
            // 移除旧的监听器 (如果需要) 并添加新的
            const newBtn = entryBtn.cloneNode(true);
            entryBtn.parentNode.replaceChild(newBtn, entryBtn);
            newBtn.addEventListener('click', openGachaSystem);
        }

    });
})();
