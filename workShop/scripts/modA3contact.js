(function () {
    'use strict';

    // 🔴 配置区域
    const SERVER_URL = "ws://106.55.104.134:6677";

    // 状态管理
    const State = {
        socket: null,
        isConnected: false,
        currentRole: null, // 'host' | 'client'
        roomId: null,
        myInfo: { name: '', desc: '' },
        players: [] // [{name, isReady, isHost}]
    };

    // 1. 注入 CSS (使用指定变量)
    const style = document.createElement('style');
    style.innerHTML = `
        /* 联机模态框 */
        .mp-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--container-bg-color);
            border: 1px solid var(--border-color);
            box-shadow: 0 0 15px var(--glow-color);
            padding: 25px;
            z-index: 9999;
            border-radius: 8px;
            width: 400px;
            color: var(--text-color);
            font-family: var(--base-font-family);
            backdrop-filter: blur(5px);
        }

        .mp-modal h3 {
            color: var(--primary-color);
            text-align: center;
            margin-top: 0;
            margin-bottom: 20px;
            text-shadow: 0 0 5px var(--glow-color);
            font-size: 1.2em;
        }

        /* 按钮通用 */
        .mp-btn {
            background: rgba(0, 250, 255, 0.1);
            color: var(--primary-color);
            border: 1px solid var(--border-color);
            padding: 10px 15px;
            cursor: pointer;
            margin: 8px 0;
            width: 100%;
            font-size: var(--base-font-size);
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .mp-btn:hover {
            background: var(--glow-color);
            color: #000;
            box-shadow: 0 0 15px var(--glow-color);
        }

        .mp-btn.danger {
            border-color: var(--danger-color);
            color: var(--danger-color);
        }
        .mp-btn.danger:hover {
            background: var(--danger-glow-color);
            color: #fff;
            box-shadow: 0 0 15px var(--danger-glow-color);
        }

        .mp-input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            background: rgba(0, 0, 0, 0.3);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            box-sizing: border-box;
            font-size: var(--base-font-size);
        }
        .mp-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 5px var(--glow-color);
        }

        /* 玩家列表 (模态框内) */
        .mp-player-list {
            margin: 15px 0;
            max-height: 150px;
            overflow-y: auto;
            border: 1px solid var(--border-color);
            padding: 5px;
            background: rgba(0,0,0,0.2);
        }
        .mp-player-item {
            padding: 5px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
        }
        .mp-player-item span.ready { color: var(--success-color); }
        .mp-player-item span.not-ready { color: var(--text-secondary-color); }

        /* 悬浮球容器 */
        #mp-floating-container {
            position: fixed;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 9000;
            pointer-events: none; /* 容器穿透 */
        }

        /* 悬浮球 */
        .mp-ball {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--container-bg-color);
            border: 2px solid var(--border-color);
            color: var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            pointer-events: auto; /* 球体可点击 */
            box-shadow: 0 0 10px var(--glow-color);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .mp-ball:hover {
            transform: scale(1.1);
        }

        /* OK 状态遮罩 */
        .mp-ball.is-ready::after {
            content: "OK";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: var(--success-glow-color);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            backdrop-filter: blur(2px);
        }

        .mp-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--border-color), transparent);
            margin: 15px 0;
        }
    `;
    document.head.appendChild(style);

    // 创建悬浮球容器
    const floatContainer = document.createElement('div');
    floatContainer.id = 'mp-floating-container';
    document.body.appendChild(floatContainer);

    const Multiplayer = {
        init: function() {
            this.injectSettingsButton();
            this.hookHostStream();
        },

        // 注入设置按钮
        injectSettingsButton: function() {
            const observer = new MutationObserver(() => {
                const settingsContainer = document.querySelector('#settings-page-game .settings-container');
                if (settingsContainer && !document.getElementById('open-mp-lobby-btn')) {
                    const btnContainer = document.createElement('div');
                    btnContainer.className = 'setting-item';
                    btnContainer.style.cssText = 'margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px;';
                    btnContainer.innerHTML = `<label style="color:var(--text-color)">多人联机</label><button id="open-mp-lobby-btn" class="control-btn-special">🌐 联机大厅</button>`;
                    settingsContainer.insertBefore(btnContainer, settingsContainer.firstChild);

                    document.getElementById('open-mp-lobby-btn').addEventListener('click', (e) => {
                        e.preventDefault();
                        this.renderLobby();
                    });
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        },

        // 渲染联机大厅 (根据当前状态动态显示)
        renderLobby: function() {
            const old = document.querySelector('.mp-modal');
            if (old) old.remove();

            const modal = document.createElement('div');
            modal.className = 'mp-modal';

            let contentHtml = '';

            if (State.roomId) {
                // 已在房间内
                contentHtml = `
                    <h3>当前房间: ${State.roomId}</h3>
                    <div style="text-align:center; margin-bottom:10px; color:var(--secondary-color)">
                        身份: ${State.currentRole === 'host' ? '房主 (HOST)' : '玩家 (CLIENT)'}
                    </div>
                    <div class="mp-player-list" id="mp-lobby-list">
                        <!-- 玩家列表动态填充 -->
                    </div>
                    <div class="mp-divider"></div>
                    ${State.currentRole === 'host'
                        ? `<button id="mp-dissolve-btn" class="mp-btn danger">🚫 解散房间</button>`
                        : `<button id="mp-leave-btn" class="mp-btn danger">🚪 退出房间</button>`
                    }
                `;
            } else {
                // 未加入房间
                contentHtml = `
                    <h3>SYSTEM LINK</h3>
                    <div id="mp-controls">
                        <button id="mp-create-btn" class="mp-btn">我是房主 (HOST)</button>
                        <div class="mp-divider"></div>
                        <input type="text" id="mp-room-id" class="mp-input" placeholder="输入房间号 (ROOM ID)">
                        <button id="mp-join-btn" class="mp-btn">我是玩家 (CLIENT)</button>
                    </div>
                `;
            }

            modal.innerHTML = `
                ${contentHtml}
                <div id="mp-status-text" style="text-align:center; margin-top:10px; color:var(--text-secondary-color)"></div>
                <button id="mp-close-btn" class="mp-btn" style="margin-top:15px; border-color:var(--text-secondary-color); color:var(--text-secondary-color)">关闭窗口</button>
            `;
            document.body.appendChild(modal);

            // 绑定事件
            document.getElementById('mp-close-btn').onclick = () => modal.remove();

            if (State.roomId) {
                this.updateLobbyPlayerList(); // 立即填充列表
                if (State.currentRole === 'host') {
                    document.getElementById('mp-dissolve-btn').onclick = () => this.sendAction('dissolve_room');
                } else {
                    document.getElementById('mp-leave-btn').onclick = () => this.sendAction('leave_room');
                }
            } else {
                document.getElementById('mp-create-btn').onclick = () => this.connect('host');
                document.getElementById('mp-join-btn').onclick = () => {
                    const rid = document.getElementById('mp-room-id').value;
                    if (!rid) return showNovaAlert('请输入房间号');
                    this.connect('client', rid);
                };
            }
        },

        // 更新大厅内的玩家列表 DOM
        updateLobbyPlayerList: function() {
            const listContainer = document.getElementById('mp-lobby-list');
            if (!listContainer) return;

            listContainer.innerHTML = State.players.map(p => `
                <div class="mp-player-item">
                    <span>${p.name} ${p.isHost ? '👑' : ''}</span>
                    <span class="${p.isReady ? 'ready' : 'not-ready'}">${p.isReady ? 'OK' : '...'}</span>
                </div>
            `).join('');
        },

        // 渲染左侧悬浮球
        renderFloatingBalls: function() {
            const container = document.getElementById('mp-floating-container');
            if (!container) return;

            // 如果不在房间，清空
            if (!State.roomId) {
                container.innerHTML = '';
                return;
            }

            container.innerHTML = State.players.map(p => {
                const firstChar = p.name.charAt(0).toUpperCase();
                const readyClass = p.isReady ? 'is-ready' : '';
                // 只有自己的球可以点击
                const isMine = p.name === State.myInfo.name;
                const clickAttr = isMine ? 'data-mine="true"' : '';

                return `<div class="mp-ball ${readyClass}" ${clickAttr} title="${p.name}">${firstChar}</div>`;
            }).join('');

            // 绑定点击事件
            const myBall = container.querySelector('[data-mine="true"]');
            if (myBall) {
                myBall.addEventListener('click', () => {
                    this.sendAction('toggle_ready');
                });
            }
        },

        // 连接逻辑
        connect: async function(role, roomId = null) {
            const statusDiv = document.getElementById('mp-status-text');
            if (statusDiv) statusDiv.innerText = '正在连接服务器...';

            // 获取用户信息
            let playerName = (typeof SillyTavern !== 'undefined' && SillyTavern.name1) ? SillyTavern.name1 : "User";
            let playerDesc = "";
            try {
                const descElem = document.getElementById('persona_description');
                if (descElem) playerDesc = descElem.value;
                else playerDesc = await evalTemplate('<%= persona_description %>');
            } catch (e) {}

            State.myInfo = { name: playerName, desc: playerDesc };

            // 客户端警告
            if (role === 'client') {
                const confirm = await new Promise(resolve => {
                    showConfirmModal('数据上传警告',
                        `即将连接至房间 [${roomId}]。\n您的ID [${playerName}] 及当前角色设定将被上传至主机。\n是否确认授权？`,
                        () => resolve(true),
                        () => resolve(false)
                    );
                });
                if (!confirm) {
                    if (statusDiv) statusDiv.innerText = '操作已取消';
                    return;
                }
            }

            // 初始化 WebSocket
            try {
                State.socket = new WebSocket(SERVER_URL);
            } catch (e) {
                showNovaAlert("WebSocket 初始化失败");
                return;
            }

            State.socket.onopen = () => {
                if (statusDiv) statusDiv.innerText = '握手成功...';
                const payload = { playerInfo: State.myInfo };
                if (role === 'host') {
                    State.socket.send(JSON.stringify({ type: 'create_room', ...payload }));
                } else {
                    State.socket.send(JSON.stringify({ type: 'join_room', roomId: roomId, ...payload }));
                }
            };

            State.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleSocketMessage(data);
            };

            State.socket.onclose = () => {
                this.resetState();
                showNovaAlert('联机服务已断开');
            };
        },

        sendAction: function(type, data = {}) {
            if (State.socket && State.socket.readyState === WebSocket.OPEN) {
                State.socket.send(JSON.stringify({ type, ...data }));
            }
        },

        resetState: function() {
            State.socket = null;
            State.roomId = null;
            State.currentRole = null;
            State.players = [];
            this.renderFloatingBalls(); // 清空球

            // 如果大厅开着，刷新它
            if (document.querySelector('.mp-modal')) {
                this.renderLobby();
            }
        },

        handleSocketMessage: function(data) {
            switch (data.type) {
                case 'room_created':
                    State.currentRole = 'host';
                    State.roomId = data.roomId;
                    showNovaAlert(`房间 ${data.roomId} 已创建`);
                    this.renderLobby(); // 刷新大厅界面
                    break;

                case 'joined_success':
                    State.currentRole = 'client';
                    State.roomId = data.roomId;
                    showNovaAlert(`成功加入房间 ${data.roomId}`);
                    this.hijackClientSendButton();
                    this.renderLobby(); // 刷新大厅界面
                    break;

                case 'room_update':
                    // 核心：更新玩家列表和状态
                    State.players = data.players;
                    this.updateLobbyPlayerList(); // 更新大厅列表
                    this.renderFloatingBalls();   // 更新悬浮球
                    break;

                case 'room_dissolved':
                    showNovaAlert('房间已解散');
                    if (State.socket) State.socket.close();
                    this.resetState();
                    break;

                case 'client_msg':
                    if (State.currentRole === 'host') this.handleHostReceiveMsg(data);
                    break;

                case 'host_stream':
                    if (State.currentRole === 'client') this.handleClientReceiveStream(data);
                    break;

                case 'error':
                    showNovaAlert(`错误: ${data.message}`);
                    if (document.getElementById('mp-status-text')) {
                        document.getElementById('mp-status-text').innerText = data.message;
                    }
                    break;
            }
        },

        // 客户端接收流：空函数
        handleClientReceiveStream: function(data) {
            // 按照需求，此处逻辑留空，之后再做
        },

        // 房主接收消息
        handleHostReceiveMsg: function(data) {
            const playerName = data.sender.name;
            const clientText = data.content;
            const hostInputElem = document.getElementById('user-input');
            const hostOriginalInput = hostInputElem ? hostInputElem.value : "";
            const combinedText = `${hostOriginalInput}\n"${playerName}": ${clientText}`;

            if (typeof triggerassa === 'function') {
                triggerassa(`/setinput ${combinedText}`);
                showNovaAlert(`收到 ${playerName} 的数据`);
            }
        },

        // 劫持客户端发送按钮
        hijackClientSendButton: function() {
            const sendBtn = document.getElementById('send-button');
            if (!sendBtn) return;
            // 防止重复劫持
            if (sendBtn.getAttribute('data-hijacked')) return;

            const newBtn = sendBtn.cloneNode(true);
            sendBtn.parentNode.replaceChild(newBtn, sendBtn);
            newBtn.id = 'send-button';
            newBtn.setAttribute('data-hijacked', 'true');

            newBtn.addEventListener('click', async () => {
                const inputArea = document.getElementById('user-input');
                let text = inputArea ? inputArea.value : "";
                if (!text.trim()) return;

                if (State.socket && State.socket.readyState === WebSocket.OPEN) {
                    this.sendAction('client_msg', { content: text });
                    if (inputArea) inputArea.value = '';
                    toastr.info("指令已上传至主机");
                } else {
                    showNovaAlert("未连接到主机");
                }
            });
        },

        // Hook 房主流
        hookHostStream: function() {
            if (!window.originalNovaStreamHook) {
                window.originalNovaStreamHook = window.novaStreamHook;
            }
            window.novaStreamHook = (data) => {
                if (window.originalNovaStreamHook) window.originalNovaStreamHook(data);
                // 只有房主才广播
                if (State.currentRole === 'host' && State.socket && State.socket.readyState === WebSocket.OPEN) {
                    this.sendAction('host_stream', { text: data.text });
                }
            };
        }
    };

    Multiplayer.init();
})();