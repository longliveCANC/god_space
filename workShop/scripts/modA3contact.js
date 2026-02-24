( function () {
    'use strict';

    // 🔴 配置区域
    const SERVER_URL = "ws://106.55.104.134:6677";
 const HEARTBEAT_INTERVAL = 2000; // 每 2 秒发送一次心跳
    const HEARTBEAT_TIMEOUT = 1000;  // 1 秒内没收到心跳回复就认为超时
    const RECONNECT_INTERVAL = 1000; // 重连间隔缩短为 1 秒
    // 状态管理
    const State = {
          publicRooms: [],
        socket: null,
        isConnected: false,
        currentRole: null, // 'host' | 'client'
        roomId: null,
        myInfo: { name: '', desc: '' },
        players: [], // [{name, isReady, isHost}]
            isCommandPanelEnabled: false,  
        commandPanelContent: ""  ,    
         chatHistory: [],  
        isChatMode: false,  
        hostIsEditing: false, 
         isCommandModalActive: false,  
         isGracefulDisconnect: false, // [新增] 是否为主动断开
        reconnectAttempts: 0, // [新增] 重连尝试次数
        maxReconnectAttempts: 5, // [新增] 最大重连次数
        reconnectInterval: RECONNECT_INTERVAL,
        lastConnectionInfo: { role: null, roomId: null },

        // [优化] 心跳相关状态
        heartbeatIntervalId: null, // 客户端发送心跳的定时器
        heartbeatTimeoutId: null,  // 等待服务器响应的定时器
        isReconnecting: false,
    };
window.MultiplayerState = {
        isClient: function() {
            // 当角色是 'client' 并且处于连接状态时，返回 true
            return State.currentRole !== 'host' ;
        },
         isConnected: function() {
            // 当角色是 'client' 并且处于连接状态时，返回 true
            return State.isConnected;
        },
        getMyInfo: function() {
            return State.myInfo;
        }
    };
    // 1. 注入 CSS (使用指定变量)
    const style = document.createElement('style');
    style.innerHTML = `
        /* 联机模态框 */
        .mp-modal {
            position: fixed;
            
            
            
            border: 1px solid var(--border-color);
           
            padding: 25px;
            z-index: 9999;
            border-radius: 8px;
            min-width: 300px;
            max-width: 400px;
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
          
        }

        .mp-btn.danger {
            border-color: var(--danger-color);
            color: var(--danger-color);
        }
        .mp-btn.danger:hover {
            background: var(--danger-glow-color);
            color: #fff;
            
        }

        .mp-input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
             
            color: var(--text-color);
            border: 1px solid var(--border-color);
            box-sizing: border-box;
            font-size: var(--base-font-size);
        }
        .mp-input:focus {
            outline: none;
            border-color: var(--primary-color);
            
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
            
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .mp-ball:hover {
            transform: scale(1.1);
        }
      
        .mp-shout-bubble {
            position: absolute; /* 相对于 #mp-floating-container 定位 */
            /* left 和 top 将由 JS 动态设置 */
            transform: translateY(-50%); /* 垂直居中 */
            background: rgba(20, 20, 20, 0.85);
            backdrop-filter: blur(4px);
            color: #fff;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            font-size: 14px;
            width: max-content; 
            max-width: 80vw;
            white-space: pre-wrap; /* 允许内容过长时换行 */
            word-break: break-all;
            opacity: 0;
            animation: mp-shout-fade 0.5s forwards;
            pointer-events: none;
            z-index: 9999;
        }

        @keyframes mp-shout-fade {
            from { opacity: 0; transform: translateY(-50%) translateX(-10px); }
            to { opacity: 1; transform: translateY(-50%) translateX(0); }
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

         /* 玩家简介弹窗 */
        #mp-bio-popup {
            position: fixed;
          
            top: 50%;
            transform: translateY(-50%);
            min-width: 400px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            background: var(--container-bg-color);
            border: 1px solid var(--border-color);
            
            color: var(--text-color);
            padding: 20px;
            border-radius: 8px;
            z-index: 9500;
            font-family: var(--base-font-family);
            line-height: var(--base-line-height);
            animation: mp-fade-in 0.3s ease-out;
            backdrop-filter:blur(2px);
        }
        #mp-bio-popup h4 {
            color: var(--primary-color);
            margin-top: 0;
            text-align: center;
        }
        #mp-bio-popup p {
            white-space: pre-wrap; /* 保持换行 */
            color: var(--text-secondary-color);
        }
        @keyframes mp-fade-in {
            from { opacity: 0; transform: translateY(-50%) scale(0.95); }
            to { opacity: 1; transform: translateY(-50%) scale(1); }
        }

         .mp-ball.is-me {
            border-color: var(--success-color);
            color: var(--success-color);
             
        }
             #mp-mode-switch {
            margin-right: 5px;
            padding: 0 10px;
            cursor: pointer;
            border: 1px solid var(--border-color);
            background: var(--container-bg-color);
            color: var(--text-color);
            border-radius: 4px;
            font-weight: bold;
            min-width: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #mp-mode-switch.chat-mode {
            background: var(--secondary-color); /* 区分颜色 */
            color: #fff;
            border-color: var(--secondary-color);
        }

        /* [新增] 聊天记录列表区域 */
        .mp-chat-history-container {
            margin-top: 15px;
            border-top: 1px solid var(--border-color);
            padding-top: 10px;
            max-height: 300px;
            overflow-y: auto;
        }
        .mp-chat-item {
            margin-bottom: 8px;
            padding: 5px 8px;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.2);
            font-size: 0.9em;
        }
        .mp-chat-item .sender {
            font-weight: bold;
            color: var(--primary-color);
            margin-right: 5px;
        }
        .mp-chat-item .content {
            color: var(--text-color);
            word-break: break-word;
        }

        /* [新增] 悬浮球上的编辑状态标识 (...) */
        .mp-ball .editing-dot {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 20px;
            line-height: 10px;
            color: #ffcc00; /* 醒目颜色 */
            animation: blink 1.5s infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }

     .mp-chat-bubble {
            position: absolute;
            transform: translateY(-50%);
            /* 使用 --glow-color 作为背景，这是 primary-color 的半透明版本 */
            background: var(--glow-color);
            backdrop-filter: blur(5px); /* 稍微增强模糊效果 */
            /* 文字颜色使用深色以保证在亮背景上的可读性 */
            color: #000;
            font-weight: bold; /* 加粗以增强对比度 */
            padding: 8px 12px;
            /* 圆角和喊话气泡做一点区分，例如左下角为直角 */
            border-radius: 6px 6px 6px 0;
            /* 边框使用更亮、更实的 --secondary-color */
            border: 1px solid var(--secondary-color);
            font-size: 14px;
            width: max-content;
            max-width: 80vw;
            white-space: pre-wrap;
            word-break: break-all;
            opacity: 0;
            animation: mp-shout-fade 0.5s forwards;
            pointer-events: none;
            z-index: 9999;
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
             this.hookPipelineSync();  
             this.monitorHostCommandArea();
             this.observeCommandModal();  
            this.hijackTriggerAssa();  
        },
 observeCommandModal: function() {
            const modal = document.getElementById('command-modal');
            if (!modal) return;

            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        const isNowActive = modal.classList.contains('active');
                        // 将状态存入 State，供 triggerassa 使用
                        State.isCommandModalActive = isNowActive;

                        // [可选] 也可以在这里广播编辑状态给其他玩家
                        if (State.currentRole === 'host') {
                            this.sendAction('host_edit_status', { isEditing: isNowActive });
                        }
                    }
                });
            });

            observer.observe(modal, { attributes: true });
        },
 startHeartbeat: function() {
            this.stopHeartbeat(); // 先确保旧的定时器已清除

            State.heartbeatIntervalId = setInterval(() => {
                if (State.socket && State.socket.readyState === WebSocket.OPEN) {
                    // 发送心跳包
                    State.socket.send(JSON.stringify({ type: 'ping' }));

                    // 设置一个超时计时器，如果服务器在指定时间内没有响应 pong，就认为连接断开
                    State.heartbeatTimeoutId = setTimeout(() => {
                        console.warn('[Heartbeat] 服务器心跳响应超时！立即触发重连...');
                        if (State.socket) {
                            // 不要调用 close()，因为我们想立即重连，而不是等待 onclose 事件
                            // 直接调用 handleDisconnectOrReconnect 来处理
                            this.handleDisconnectOrReconnect();
                        }
                    }, HEARTBEAT_TIMEOUT);

                } else {
                    // 如果在心跳间隔时就发现连接已断开，也立即触发重连
                    console.warn('[Heartbeat] 检测到 WebSocket 状态异常，立即触发重连...');
                    this.handleDisconnectOrReconnect();
                }
            }, HEARTBEAT_INTERVAL);
        },

        // [优化] 停止心跳
        stopHeartbeat: function() {
            clearInterval(State.heartbeatIntervalId);
            clearTimeout(State.heartbeatTimeoutId);
            State.heartbeatIntervalId = null;
            State.heartbeatTimeoutId = null;
        },

 handleDisconnectOrReconnect: function() {
    // 1. 如果是主动断开，则不进行重连
    if (State.isGracefulDisconnect) {
        this.resetState();
        showNovaAlert('联机服务已断开');
        return;
    }

    // 2. [核心] 如果已经在重连过程中，则立即返回，防止重复执行
    if (State.isReconnecting) {
        console.log('[Reconnect] 已在重连流程中，忽略本次触发。');
        return;
    }

    // 3. 锁上状态，开始重连流程
    State.isReconnecting = true;
    this.stopHeartbeat(); // 停止心跳，防止干扰
    State.isConnected = false;
    if (State.socket) {
        State.socket.onclose = null; // 清理旧的监听器
        State.socket.onerror = null;
        State.socket.close(); // 确保旧连接被关闭
        State.socket = null;
    }
    this.renderFloatingBalls(); // 更新UI

    // 4. 检查重连次数
    if (State.reconnectAttempts < State.maxReconnectAttempts) {
        State.reconnectAttempts++;
        showNovaAlert(`连接丢失！1秒后进行第 ${State.reconnectAttempts} 次重连...`);

        // [关键修复] 使用 setTimeout 确保 connect 调用在下一个事件循环中，并且只执行一次
        setTimeout(() => {
            console.log(`[Reconnect] 执行第 ${State.reconnectAttempts} 次重连尝试...`);
            this.connect(State.lastConnectionInfo.role, State.lastConnectionInfo.roomId, true);
        }, State.reconnectInterval);

    } else {
        showNovaAlert('重连失败，请检查网络后手动重新连接。');
        this.resetState(); // 耗尽所有重连次数后，彻底重置状态
    }
},

 
        // [修改] 劫持 triggerassa 以实现追加逻辑
        hijackTriggerAssa: function() {
            if (typeof window.triggerassa === 'function' && !window.originalTriggerAssa) {
                window.originalTriggerAssa = window.triggerassa;

                window.triggerassa = (text) => {
                    // 条件：我是房主，并且令小盒是打开的
                    if (State.currentRole === 'host' && State.isCommandModalActive) {
                        const commandArea = document.getElementById('command-edit-area');
                        if (commandArea) {
                            const currentVal = commandArea.value;
                            const newContent = text.replace(/^\/setinput\s+/, '');

                            commandArea.value = currentVal + (currentVal ? '\n' : '') + newContent;
                            commandArea.dispatchEvent(new Event('input')); // 触发更新
                            showNovaAlert('收到新数据，已追加到令小盒');
                        } else {
                            window.originalTriggerAssa(text); // 降级处理
                        }
                    } else {
                        // 否则执行原有逻辑
                        window.originalTriggerAssa(text);
                    }
                };
            }
        },
         monitorHostCommandArea: function() {
            const commandArea = document.getElementById('command-edit-area');
            if (!commandArea) return;

            let debounceTimer;
            commandArea.addEventListener('input', () => {
                // 只有房主且看板开启时才发送更新
                if (State.currentRole !== 'host' || !State.isCommandPanelEnabled) {
                    return;
                }

                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.sendAction('update_command_panel', { content: commandArea.value });
                }, 250); // 使用防抖，避免过于频繁地发送
            });
        },
  hookPipelineSync: function() {
            // 定义一个全局钩子，供 handleSend 在 finally 阶段调用
            window.novaSyncHook = (data) => {
                // 1. 仅房主触发
                if (State.currentRole !== 'host' || !State.socket || State.socket.readyState !== WebSocket.OPEN) {
                    return;
                }

                console.log('[Multiplayer] 接收到流水线完成信号 (Direct Hook)，准备同步最终历史...');

                // 2. 获取最后一条消息
                if (typeof conversationHistory !== 'undefined' && conversationHistory.length > 0) {
                    const lastMessage = conversationHistory[conversationHistory.length - 1];

                    // 3. 确保最后一条是 AI 的回复 (assistant)
                    if (lastMessage && lastMessage.role === 'assistant') {
                        // 4. 广播这条最终确定的消息
                        this.sendAction('host_history_sync', { message: lastMessage });
                        console.log('[Multiplayer] 已广播最终AI回复。');
                        this.sendAction('unready_all');
                    }
                }
            };

            console.log('[Multiplayer] 已成功挂载 novaSyncHook。');
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
 async renderLobby() {
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
                        身份: ${State.currentRole === 'host' ? '房主' : '玩家'}
                    </div>
                    <div class="mp-player-list" id="mp-lobby-list">
                        <!-- 玩家列表动态填充 -->
                    </div>
                    <div class="mp-divider"></div>
                    ${State.currentRole === 'host'
                        ? `
                            <button id="mp-toggle-panel-btn" class="mp-btn">${State.isCommandPanelEnabled ? '✅ 关闭公屏' : '⬜️ 开启公屏'}</button>
                            <button id="mp-dissolve-btn" class="mp-btn danger">🚫 解散房间</button>
                          `
                        : `
                            <button id="mp-sync-data-btn" class="mp-btn">🔄 一键同步</button>
                            <button id="mp-leave-btn" class="mp-btn danger">🚪 退出房间</button>
                          ` // [修改] 为玩家添加“一键同步”按钮
                    }
                `;
            } else {
                // 未加入房间
                    const publicRoomsHtml = `
                    <div class="mp-divider"></div>
                    <h4 style="text-align:center; color:var(--secondary-color); margin: 15px 0;">公开房间列表</h4>
                    <div id="mp-public-rooms-list" style="max-height: 200px; overflow-y: auto; border: 1px solid var(--border-color); padding: 5px;">
                        <!-- 公开房间将在这里动态渲染 -->
                    </div>
                `;

                contentHtml = `
                    <h3>SYSTEM LINK</h3>
                    <div id="mp-controls">
                        <button id="mp-create-btn" class="mp-btn">我要建房</button>
                        <div class="mp-divider"></div>
                        <input type="text" id="mp-room-id" class="mp-input" placeholder="输入房间号加入私有房间">
                        <button id="mp-join-btn" class="mp-btn">我要进房</button>
                    </div>
                    ${publicRoomsHtml} <!-- 插入公开房间列表 -->
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
                this.updateLobbyPlayerList();
                if (State.currentRole === 'host') {
                    document.getElementById('mp-dissolve-btn').onclick = () => {
                        // [修改] 增加主动断开标志
                        State.isGracefulDisconnect = true;
                        this.sendAction('dissolve_room');
                        if (State.socket) State.socket.close();
                    };

                    document.getElementById('mp-toggle-panel-btn').onclick = () => {
                        const newIsEnabledState = !State.isCommandPanelEnabled;
                        this.sendAction('toggle_command_panel', { isEnabled: newIsEnabledState });

                        if (newIsEnabledState) {
                            const commandArea = document.getElementById('command-edit-area');
                            if (commandArea) {
                                this.sendAction('update_command_panel', { content: commandArea.value });
                            }
                        }
                    };

                } else { // 玩家的按钮事件
                    // [新增] 玩家同步按钮的事件处理
                    document.getElementById('mp-sync-data-btn').onclick = async () => {
                        const confirmSync = await new Promise(resolve => {
                            createConfirmModal('确认同步',
                                `此操作将用主机的游戏数据覆盖您当前的进度（包括角色卡、世界设定、历史记录等），此过程不可逆！\n\n是否确认同步？`,
                                () => resolve(true),
                                () => resolve(false)
                            );
                        });
                        if (confirmSync) {
                            showNovaAlert('已向主机发送同步请求，请稍候...');
                            this.sendAction('request_full_sync');
                        }
                    };

                    document.getElementById('mp-leave-btn').onclick = () => {
                        // [修改] 增加主动断开标志
                        State.isGracefulDisconnect = true;
                        this.sendAction('leave_room');
                        if (State.socket) {
                            State.socket.close();
                        }
                    };
                }
            }  else {
                // 修改：为“我要建房”按钮添加新逻辑
                document.getElementById('mp-create-btn').onclick = () => this.showCreateRoomOptions();
                document.getElementById('mp-join-btn').onclick = () => {
                    const rid = document.getElementById('mp-room-id').value;
                    if (!rid) return showNovaAlert('请输入房间号');
                    this.connect('client', rid);
                };
                // 新增：渲染公开房间列表并请求更新
                this.renderPublicRoomsList();
                this.sendAction('request_public_rooms');
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
 showCreateRoomOptions: async function() {
            const old = document.querySelector('.mp-modal');
            if (old) old.remove();

            const modal = document.createElement('div');
            modal.className = 'mp-modal';
            modal.innerHTML = `
                <h3>创建房间</h3>
                <input type="text" id="mp-room-title" class="mp-input" placeholder="房间标题 (公开时显示)">
                <textarea id="mp-room-remark" class="mp-input" placeholder="房间备注 (公开时显示)" rows="3"></textarea>
                <div class="mp-divider"></div>
                <button id="mp-create-private-btn" class="mp-btn">创建私有房间</button>
                <button id="mp-create-public-btn" class="mp-btn" style="border-color: var(--success-color); color: var(--success-color);">创建公开房间</button>
                <div class="mp-divider"></div>
                <button id="mp-back-to-lobby-btn" class="mp-btn" style="border-color:var(--text-secondary-color); color:var(--text-secondary-color)">返回</button>
            `;
            document.body.appendChild(modal);

            document.getElementById('mp-back-to-lobby-btn').onclick = () => this.renderLobby();

            const createAction = async (isPublic) => {
                const title = document.getElementById('mp-room-title').value;
                const remark = document.getElementById('mp-room-remark').value;

                if (isPublic) {
                    const confirmPublic = await new Promise(resolve => {
                        createConfirmModal('隐私警告',
                            `创建公开房间会将您的部分游戏设定（如角色简介）和本次的聊天记录共享给其他玩家。<br><br>请确认您了解并接受此风险。`,
                            () => resolve(true),
                            () => resolve(false)
                        );
                    });
                    if (!confirmPublic) return;
                }
                // 注意：connect 函数需要修改以接收这些新参数
                this.connect('host', null, false, { isPublic, title, remark });
            };

            document.getElementById('mp-create-private-btn').onclick = () => createAction(false);
            document.getElementById('mp-create-public-btn').onclick = () => createAction(true);
        },

        // 新增：渲染公开房间列表的DOM
        renderPublicRoomsList: function() {
            const listContainer = document.getElementById('mp-public-rooms-list');
            if (!listContainer) return;

            if (State.publicRooms.length === 0) {
                listContainer.innerHTML = '<div style="text-align:center; color:var(--text-secondary-color); padding: 10px;">当前没有公开的房间</div>';
                return;
            }

            listContainer.innerHTML = State.publicRooms.map(room => `
                <div style="border-bottom: 1px solid var(--border-color); padding: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: var(--primary-color);">${room.title}</strong> (${room.playerCount}人)
                        <div style="font-size: 0.9em; color: var(--text-secondary-color);">${room.remark}</div>
                        <div style="font-size: 0.8em; color: #888;">房主: ${room.hostName} | ID: ${room.id}</div>
                    </div>
                    <button class="mp-btn" style="width: auto; padding: 5px 10px; margin: 0;" data-room-id="${room.id}">加入</button>
                </div>
            `).join('');

            // 为所有新的“加入”按钮绑定事件
            listContainer.querySelectorAll('button[data-room-id]').forEach(btn => {
                btn.onclick = () => {
                    const roomId = btn.getAttribute('data-room-id');
                    this.connect('client', roomId);
                };
            });
        },
  renderFloatingBalls: function() {
            const container = document.getElementById('mp-floating-container');
            if (!container) return;

            if (!State.roomId) {
                container.innerHTML = '';
                return;
            }

             let commandPanelBallHtml = '';
             if (State.isCommandPanelEnabled) {
                // [修改] 增加编辑状态显示
                const editingIndicator = State.hostIsEditing ? '<span class="editing-dot">...</span>' : '';

                commandPanelBallHtml = `
                    <div class="mp-ball" id="mp-command-panel-ball" title="主机指令看板">
                        ⌘ ${editingIndicator}
                    </div>
                    <div class="mp-divider" style="margin: -5px 0;"></div>
                `;
            }

            const sortedPlayers = [...State.players].sort((a, b) => {
                if (a.name === State.myInfo.name) return -1;
                if (b.name === State.myInfo.name) return 1;
                return a.name.localeCompare(b.name);
            });

            // 🔴 修改: 将看板球和玩家球组合
            container.innerHTML = commandPanelBallHtml + sortedPlayers.map(p => {
                const isMine = p.name === State.myInfo.name;
                const firstChar = isMine ? '你' : p.name.charAt(0).toUpperCase();
                const readyClass = p.isReady ? 'is-ready' : '';
                const mineClass = isMine ? 'is-me' : '';
                const clickAttr = isMine ? 'data-mine="true"' : '';

                return `<div class="mp-ball ${readyClass} ${mineClass}" ${clickAttr} data-player-name="${p.name}" title="${p.name}">${firstChar}</div>`;
            }).join('');

            // 🔴 新增: 为看板球绑定事件
            const panelBall = document.getElementById('mp-command-panel-ball');
            if (panelBall) {
                panelBall.addEventListener('click', () => {
                    this.showPlayerBio('__COMMAND_PANEL__'); // 使用特殊名称来显示看板
                });
            }

            container.querySelectorAll('.mp-ball[data-player-name]').forEach(ball => {
                ball.addEventListener('click', (e) => {
                    const targetBall = e.currentTarget;
                    if (targetBall.dataset.mine === 'true') {
                        this.sendAction('toggle_ready');
                    } else {
                        const playerName = targetBall.dataset.playerName;
                        this.showPlayerBio(playerName);
                    }
                });
            });
        },
       
  showPlayerBio: function(playerName) {
            const oldPopup = document.getElementById('mp-bio-popup');
            if (oldPopup) oldPopup.remove();

            const popup = document.createElement('div');
            popup.id = 'mp-bio-popup';
            document.body.appendChild(popup);

             if (playerName === '__COMMAND_PANEL__') {
                // 看板模式：显示加载中，并请求数据
                popup.innerHTML = `
                    <h4>主机指令看板</h4>
                    <div id="mp-panel-content" style="white-space: pre-wrap; min-height: 50px; color: var(--text-secondary-color);">
                        正在从主机获取最新数据...
                    </div>
                    <div class="mp-divider"></div>
                    <h4>房间对话记录</h4>
                    <div id="mp-chat-list" class="mp-chat-history-container">
                        <!-- 聊天记录将在这里渲染 -->
                    </div>
                `;

                this.updateChatHistoryDOM();

                // [修改] 发送获取 localStorage 的请求
                this.sendAction('fetch_storage_content');

            } else {
                // 普通玩家简介模式 (保持不变)
                const player = State.players.find(p => p.name === playerName);
                if (!player) return;
                popup.innerHTML = `
                    <h4>${player.name}</h4>
                    <p>${player.desc || '该用户没有留下简介。'}</p>
                `;
            }

            // 关闭逻辑
            setTimeout(() => {
                const closeHandler = (e) => {
                    if (!popup.contains(e.target)) {
                        popup.remove();
                        document.body.removeEventListener('click', closeHandler);
                    }
                };
                document.body.addEventListener('click', closeHandler);
            }, 100);
        },

        // [新增] 更新弹窗内的看板内容
        updatePanelContentDOM: function(content) {
            const container = document.getElementById('mp-panel-content');
            if (container) {
                container.textContent = content || "（看板当前无内容）";
                container.style.color = "var(--text-color)";
            }
        },

        // [新增] 更新弹窗内的聊天列表
        updateChatHistoryDOM: function() {
            const list = document.getElementById('mp-chat-list');
            if (!list) return;

            list.innerHTML = State.chatHistory.map(msg => {
                const time = new Date(msg.timestamp).toLocaleTimeString();
                return `
                    <div class="mp-chat-item">
                        <span style="font-size:0.8em; color:#666;">[${time}]</span>
                        <span class="sender">${msg.senderName}:</span>
                        <span class="content">${msg.content}</span>
                    </div>
                `;
            }).reverse().join(''); // 最新的在上面
        },

async connect(role, roomId = null, isReconnect = false, extraOptions = {}) {
    // 1. 如果不是重连（即首次连接），则初始化所有状态
    if (!isReconnect) {
        State.isGracefulDisconnect = false;
        State.isReconnecting = false; // 重置重连锁
        State.reconnectAttempts = 0;  // 重置尝试次数
        State.lastConnectionInfo = { role, roomId }; // 保存连接信息
        const statusDiv = document.getElementById('mp-status-text');
        if (statusDiv) statusDiv.innerText = '正在连接服务器...';

        let playerName = "User";
        if (typeof SillyTavern !== 'undefined' && SillyTavern.name1) {
            playerName = SillyTavern.name1;
        }

        let playerDesc = "No description.";
        try {
            const descElem = document.getElementById('persona_description');
            if (descElem) playerDesc = descElem.value;
            else playerDesc = await EjsTemplate.evalTemplate('');
        } catch (e) { console.warn("简介获取失败", e); }

        State.myInfo = { name: playerName, desc: playerDesc };

        if (role === 'client') {
            const confirm = await new Promise(resolve => {
                createConfirmModal('数据上传警告',
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
    }

    // 2. 初始化 WebSocket
    try {
        console.log(`[Connect] 尝试连接到 ${SERVER_URL}...`);
        State.socket = new WebSocket(SERVER_URL);
    } catch (e) {
        console.error("WebSocket 初始化失败:", e);
        State.isReconnecting = false;
        this.handleDisconnectOrReconnect();
        return;
    }

    // 3. 绑定事件处理器
    State.socket.onopen = () => {
        console.log('[onopen] WebSocket 连接成功！');
        State.isConnected = true;
        State.reconnectAttempts = 0;
        State.isReconnecting = false; // 解锁！

        if (isReconnect) {
            showNovaAlert('联机服务已重新连接！');
        } else {
            const statusDiv = document.getElementById('mp-status-text');
            if (statusDiv) statusDiv.innerText = '握手成功...';
        }

        // [关键修复] 在发送前再次检查连接状态
        if (State.socket.readyState === WebSocket.OPEN) {
                    const payload = { playerInfo: State.myInfo };
                    const currentRole = State.lastConnectionInfo.role;
                    const targetRoomId = State.lastConnectionInfo.roomId;

                    if (currentRole === 'host') {
                        // 修改：合并 extraOptions
                        const createPayload = { type: 'create_room', ...payload, ...extraOptions };
                        if (targetRoomId) {
                            createPayload.roomId = targetRoomId;
                        }
                        State.socket.send(JSON.stringify(createPayload));
                    } else { // client
                        State.socket.send(JSON.stringify({ type: 'join_room', roomId: targetRoomId, ...payload }));
                    }

                    this.startHeartbeat();
                } else {
            console.warn('[onopen] 连接在 onopen 回调执行期间关闭，重新触发重连。');
            // 如果状态已经不是 OPEN，说明连接瞬间又断了，需要重新走重连逻辑
            this.handleDisconnectOrReconnect();
        }
    };

    State.socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'pong') {
            clearTimeout(State.heartbeatTimeoutId);
            return;
        }
        await this.handleSocketMessage(data);
    };

    State.socket.onclose = (event) => {
        console.log(`[onclose] WebSocket 连接已关闭。 Code: ${event.code}`);
        State.isReconnecting = false;
        this.handleDisconnectOrReconnect();
    };

    State.socket.onerror = (err) => {
        console.error('[onerror] WebSocket 发生错误:', err);
        State.isReconnecting = false;
        this.handleDisconnectOrReconnect();
    };
},
 sendAction: function(type, data = {}) {
            // 如果 socket 不存在或连接已断开
            if (!State.socket || State.socket.readyState !== WebSocket.OPEN) {
                console.warn(`[sendAction] 尝试发送 '${type}' 失败，连接已断开。立即触发重连...`);
                showNovaAlert("连接已断开，正在尝试立即重连...");

                // 立即触发重连逻辑，而不是等待
                // this.handleDisconnectOrReconnect();

                // 由于连接已断，本次发送失败，直接返回
                return;
            }

            // 连接正常，直接发送
            State.socket.send(JSON.stringify({ type, ...data }));
        },

        // [优化] resetState 需要停止心跳
   resetState: function() {
    this.stopHeartbeat(); // 停止所有心跳活动
    if (State.socket) {
        State.socket.onclose = null; // 避免在主动重置时触发不必要的重连
        State.socket.close();
    }
    State.socket = null;
    State.roomId = null;
    State.currentRole = null;
    State.players = [];
    State.isConnected = false;
    State.lastConnectionInfo = { role: null, roomId: null };

    // [关键修复] 重置所有重连相关状态
    State.reconnectAttempts = 0;
    State.isReconnecting = false; // 解锁！

    this.renderFloatingBalls();
    if (document.querySelector('.mp-modal')) {
        this.renderLobby();
    }
},
         showPlayerShout: function(playerName, message, isChat = false) {
            const ball = document.querySelector(`.mp-ball[data-player-name="${playerName}"]`);
            const container = document.getElementById('mp-floating-container');
            if (!ball || !container) return;

            const oldBubble = document.getElementById(`shout-bubble-for-${playerName}`);
            if (oldBubble) oldBubble.remove();

            const bubble = document.createElement('div');
            // [修改] 根据类型选择样式类
            bubble.className = isChat ? 'mp-chat-bubble' : 'mp-shout-bubble';
            bubble.id = `shout-bubble-for-${playerName}`;
            bubble.textContent = message;
 container.appendChild(bubble);

            // 5. 动态计算并设置气泡的位置
            //    使其与目标悬浮球对齐
            const ballRect = ball.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // 计算气泡的 top 值，使其相对于父容器垂直居中于目标球
            bubble.style.top = `${ballRect.top - containerRect.top + (ball.offsetHeight / 2)}px`;
            // left 值保持不变，因为它已经是相对于父容器的 .mp-ball 的右侧
            bubble.style.left = `${ball.offsetLeft + ball.offsetWidth + 10}px`; // 稍微调整间距

            // 6. 设置自动消失的定时器 (逻辑不变)
            const baseDuration = 2000 + Math.floor(message.length / 10) * 1000;
const maxDuration = 5000; // 最大停留时间
const duration = Math.min(baseDuration, maxDuration);

setTimeout(() => {
    if (bubble) {
        bubble.style.transition = 'opacity 0.5s ease';
        bubble.style.opacity = '0';
        setTimeout(() => bubble.remove(), 500);
    }
}, duration);

        },

     async handleSocketMessage(data) {
                switch (data.type) {
                    case 'room_created':
                        State.currentRole = 'host';
                        State.roomId = data.roomId;

                       
                        State.lastConnectionInfo.roomId = data.roomId;

                        showNovaAlert(`房间 ${data.roomId} 已创建`);
                        this.renderLobby();
                        this.setupInputInterface();
                         this.startHeartbeat(); 
                        break;
               case 'public_rooms_list':
                        State.publicRooms = data.rooms;
                        // 如果大厅是打开的，就刷新列表
                        if (document.querySelector('.mp-modal') && !State.roomId) {
                            this.renderPublicRoomsList();
                        }
                        break;
                    case 'joined_success':
                        State.currentRole = 'client';
                        State.roomId = data.roomId;
                        State.lastConnectionInfo.roomId = data.roomId;

                        showNovaAlert(`成功加入房间 ${data.roomId}`);
                        this.renderLobby();
                        this.setupInputInterface();
                        this.startHeartbeat();

                        // 新增：自动发送系统指令
                        if (typeof triggerassa === 'function') {
                            const joinMessage = `<系统指令：有新的玩家 ${State.myInfo.name} 加入，你需要将该玩家加入的过程合理融入剧情>`;
                            // 注意：这个指令是客户端发给主机的，所以使用 client_msg
                            this.sendAction('client_msg', { content: joinMessage });
                        }
                        break;

                    case 'player_shout':
                        this.showPlayerShout(data.senderName, data.content);
                        break;

                    case 'room_update':
                        if (State.currentRole === 'host' && typeof TavernHelper !== 'undefined') {
                            const oldPlayers = new Set(State.players.map(p => p.name));
                            const newPlayers = new Set(data.players.map(p => p.name));

                            data.players.forEach(player => {
                                if (player.name !== State.myInfo.name) {
                                    const varName = `player_${player.name}`;
                                    const content = `${player.desc}\nStatus: Online`;
                                    TavernHelper.insertOrAssignVariables({ [varName]: content }, { type: 'chat' });
                                }
                            });

                            oldPlayers.forEach(oldName => {
                                if (!newPlayers.has(oldName) && oldName !== State.myInfo.name) {
                                    const varName = `player_${oldName}`;
                                    TavernHelper.insertOrAssignVariables({ [varName]: 'Status: Offline。' }, { type: 'chat' });
                                }
                            });
                        }

                        State.players = data.players;
                        if (data.isCommandPanelEnabled !== undefined) {
                            State.isCommandPanelEnabled = data.isCommandPanelEnabled;
                        }
                        if (data.commandPanelContent !== undefined) {
                            State.commandPanelContent = data.commandPanelContent;
                        }

                        if (document.querySelector('.mp-modal')) {
                            this.renderLobby();
                        }

                        this.updateLobbyPlayerList();
                        this.renderFloatingBalls();
                        break;

                    case 'room_dissolved':
                        // [修改] 增加主动断开标志，让 onclose 处理后续
                        State.isGracefulDisconnect = true;
                        showNovaAlert('房间已解散');
                        if (State.socket) State.socket.close();
                        break;

                    case 'client_msg':
                        if (State.currentRole === 'host') this.handleHostReceiveMsg(data);
                        break;

                    case 'host_stream':
                        if (State.currentRole === 'client') this.handleClientReceiveStream(data);
                        break;

                    case 'client_input_sync':
                        if (State.currentRole === 'client') {
                            console.log("接收到了主机传来的user消息");
                            const userMessage = { role: 'user', content: data.content };
                            if (typeof conversationHistory !== 'undefined' && Array.isArray(conversationHistory)) {
                                conversationHistory.push(userMessage);
                                await window.saveHistory();
                                await window.processUpdateMemoryCommands(data.content);
                                await new Promise(resolve => setTimeout(resolve, 500));
                                worldHelper.renderHistory();
                            }
                        }
                        break;

                    case 'host_history_sync':
                        if (State.currentRole === 'client') {
                            const tempBubble = document.getElementById('mp-ai-bubble');
                            if (tempBubble) tempBubble.remove();

                            if (typeof conversationHistory !== 'undefined' && Array.isArray(conversationHistory)) {
                                conversationHistory.push(data.message);
                                await window.saveHistory();
                                await window.processUpdateMemoryCommands(data.message.content);
                                await new Promise(resolve => setTimeout(resolve, 500));
                                worldHelper.renderHistory(false,true);
                            }
                        }
                        break;

                    case 'error':
                        showNovaAlert(`错误: ${data.message}`);
                        if (document.getElementById('mp-status-text')) {
                            document.getElementById('mp-status-text').innerText = data.message;
                        }
                        break;

                    case 'chat_broadcast':
                        State.chatHistory.push(data);
                        if (State.chatHistory.length > 50) State.chatHistory.shift();
                        this.showPlayerShout(data.senderName, data.content, true);
                        this.updateChatHistoryDOM();
                        break;

                    case 'host_status_update':
                        State.hostIsEditing = data.isEditing;
                        this.renderFloatingBalls();
                        break;

                    case 'panel_data_sync':
                        this.updatePanelContentDOM(data.content);
                        break;

                    case 'request_panel_sync':
                        if (State.currentRole === 'host') {
                            const commandArea = document.getElementById('command-edit-area');
                            const content = commandArea ? commandArea.value : "";
                            this.sendAction('return_command_panel', {
                                requesterId: data.requesterId,
                                content: content
                            });
                        }
                        break;

                    case 'request_storage_sync':
                        if (State.currentRole === 'host') {
                            const content = localStorage.getItem('assaCommandQueue') || '';
                            this.sendAction('return_storage_content', {
                                requesterId: data.requesterId,
                                content: content
                            });
                        }
                        break;

                    case 'storage_data_sync':
                        this.updatePanelContentDOM(data.content);
                        break;

                    // [新增] 房主：收到同步请求，打包并返回数据
                    case 'request_full_sync_forward':
                        if (State.currentRole === 'host') {
                            showNovaAlert('收到玩家的数据同步请求，正在打包数据...');
                            try {
                                const combinedData = {};
                                // 从全局变量或 localStorage 中安全地获取数据
                                if (typeof currentGameData !== 'undefined' && currentGameData) combinedData.stat_data = currentGameData;
                                if (typeof assaSettingsData !== 'undefined' && assaSettingsData) combinedData.assa_data = assaSettingsData;
                                if (typeof playCharacterData !== 'undefined' && playCharacterData) combinedData.play_character_data = playCharacterData;
                                if (typeof conversationHistory !== 'undefined' && conversationHistory) combinedData.zeroLevelHistory = conversationHistory;

                                if (Object.keys(combinedData).length === 0) {
                                    showNovaAlert('错误：没有可供同步的数据。');
                                    return;
                                }

                                // 将打包好的数据通过服务器转发给请求者
                                this.sendAction('return_full_sync', {
                                    requesterId: data.requesterId,
                                    data: combinedData
                                });
                                showNovaAlert('数据已打包并发送给玩家。');

                            } catch (e) {
                                console.error("打包同步数据时出错:", e);
                                showNovaAlert('打包数据失败，请查看控制台日志。');
                            }
                        }
                        break;

                    // [新增] 玩家：接收到完整数据，进行导入并刷新
  case 'full_sync_data':
                        if (State.currentRole === 'client') {
                            showNovaAlert('接收到主机数据，开始应用...');
                            try {
                                const importedData = data.data;
                                if (!importedData || Object.keys(importedData).length === 0) {
                                    throw new Error("接收到的同步数据为空或无效。");
                                }

                                // 1. 直接更新内存中的全局变量
                                let dataApplied = false;
                                if (importedData.stat_data) {
                                    currentGameData = importedData.stat_data;
                             
                                    dataApplied = true;
                                }
                                if (importedData.assa_data) {
                                    assaSettingsData = importedData.assa_data;
                                  
                                    dataApplied = true;
                                }
                                if (importedData.play_character_data) {
                                playCharacterData = importedData.play_character_data;
                             
                                    dataApplied = true;
                                }
await insertOrAssignVariables(importedData, { type: 'chat' });
                                // 2. 使用您提供的逻辑来处理历史记录
                                if (importedData.zeroLevelHistory) {
                                    // 直接覆盖当前会话的历史记录
                                    conversationHistory = importedData.zeroLevelHistory;

                                    // 调用全局的保存函数来持久化历史记录
                                    if (typeof window.saveHistory === 'function') {
                                        await window.saveHistory();
                                        // addNovaLog("已更新并保存：核心历史记录 (conversationHistory)");
                                    } else {
                                        // addNovaLog("警告：全局 saveHistory 函数未找到，历史记录可能未持久化。", 'warning');
                                    }
                                    dataApplied = true;
                                }

                                if (!dataApplied) {
                                    throw new Error("同步数据中不包含任何可应用的内容。");
                                }

                                showNovaAlert('✓ 数据同步完成！正在刷新界面以应用所有变更...', 'success');

                                // 最终通过刷新页面来确保所有UI组件（角色卡、世界信息等）都从更新后的变量中加载数据
                                setTimeout(() => {
                                      worldHelper.renderHistory();
                                }, 2000);

                            } catch (err) {
                                showNovaAlert(`✗ 数据同步失败: ${err.message}`, 'error');
                                console.error("处理同步数据时出错:", err);
                            }
                        }
                        break;
                }
            },

 handleClientReceiveStream: function(data) {
            // 确保客户端有一个用于显示AI回复的气泡
            let aiResponseBubble = document.getElementById('mp-ai-bubble');
            if (!aiResponseBubble) {
                const chatHistoryDiv = document.getElementById('chat-display-area'); // 确认你的聊天显示区域ID
                if (!chatHistoryDiv) return;

                aiResponseBubble = document.createElement('div');
                aiResponseBubble.id = 'mp-ai-bubble';
                aiResponseBubble.classList.add('message-bubble', 'assistant-message');
                aiResponseBubble.innerHTML = '<em>正在接收主机信号...</em>';
                chatHistoryDiv.appendChild(aiResponseBubble);
                // chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
            }

            const text = data.text;

            // 使用节流阀避免过于频繁的DOM操作
            if (this.renderThrottler) return;
            this.renderThrottler = setTimeout(() => {
                this.renderThrottler = null;
                if (typeof is_simple_stream !== 'undefined' && is_simple_stream === 'true') {
                    aiResponseBubble.innerHTML = text;
                } else {
                    let formattedText = text.replace(/“/g, '<span class="dialogue-quote">“')
                        .replace(/”/g, '”</span>')
                        .replace(/「/g, '<span class="dialogue-quote">「')
                        .replace(/」/g, '」</span>')
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.+?)\*/g, '<em>$1</em>');

                    if (typeof formatAsTavernRegexedString === 'function') {
                        aiResponseBubble.innerHTML = formatAsTavernRegexedString(
                            formattedText, 'ai_output', 'display', { depth: -1 }
                        );
                    } else {
                        aiResponseBubble.innerHTML = formattedText; // 降级处理
                    }
                }
                // aiResponseBubble.parentElement.scrollTop = aiResponseBubble.parentElement.scrollHeight;
            }, 100);
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

 setupInputInterface: function() {
            const sendBtn = document.getElementById('send-button');
            const userInput = document.getElementById('user-input');
            if (!sendBtn || !userInput) return;

            if (document.body.getAttribute('data-mp-interface-setup') === 'true') {
                return;
            }
            document.body.setAttribute('data-mp-interface-setup', 'true');

            const originalBtnClone = sendBtn.cloneNode(true);
            originalBtnClone.id = 'send-button-original-clone';

            // [核心修复] 将发送逻辑定义为一个绑定了正确'this'的函数
            const performMultiplayerSend = function() {
                const userInputElem = document.getElementById('user-input');
                let userText = userInputElem ? userInputElem.value.trim() : "";
                if (!userText) return;

                // 'this' 在这里由 .bind(this) 保证是 Multiplayer 对象
                if (State.isChatMode) {
                    this.sendAction('client_chat', { content: userText });
                } else {
                    if (State.currentRole === 'client') {
                        const commandArea = document.getElementById('command-edit-area');
                        let combinedText = userText;
                        if (commandArea && commandArea.value.trim()) {
                            combinedText = commandArea.value.trim() + '\n' + userText;
                        }
                        this.sendAction('client_msg', { content: combinedText });
                        showNovaAlert("指令已上传至主机");
                    }
                }
                if (userInputElem) userInputElem.value = '';
            }.bind(this); // <--- 在函数定义时就绑定'this'

            const multiplayerBtn = sendBtn.cloneNode(true);
            multiplayerBtn.id = 'send-button-multiplayer';
            multiplayerBtn.addEventListener('click', performMultiplayerSend); // 直接使用已绑定的函数

            const switchBtn = document.createElement('div');
            switchBtn.id = 'mp-mode-switch';
            switchBtn.innerText = '行';
            switchBtn.title = "点击切换：行动 / 对话";
            userInput.parentNode.insertBefore(switchBtn, userInput);

            switchBtn.onclick = () => {
                State.isChatMode = !State.isChatMode;
                switchBtn.innerText = State.isChatMode ? '话' : '行';
                switchBtn.className = State.isChatMode ? 'chat-mode' : '';
                userInput.placeholder = State.isChatMode ? '输入对话内容...' : '在这里输入你的行动...';

                const currentSendBtn = document.getElementById('send-button');
                if (State.currentRole === 'host' && !State.isChatMode) {
                    if (currentSendBtn) {
                        const freshOriginalClone = originalBtnClone.cloneNode(true);
                        freshOriginalClone.id = 'send-button';
                        currentSendBtn.parentNode.replaceChild(freshOriginalClone, currentSendBtn);
                    }
                } else {
                    if (currentSendBtn) {
                        const freshMpClone = multiplayerBtn.cloneNode(true);
                        freshMpClone.id = 'send-button';
                        // [核心修复] 重新克隆的按钮也需要绑定正确的事件
                        freshMpClone.addEventListener('click', performMultiplayerSend);
                        currentSendBtn.parentNode.replaceChild(freshMpClone, currentSendBtn);
                    }
                }
            };

            userInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    document.getElementById('send-button').click();
                }
            }, true);

            if (State.currentRole === 'client') {
                 const currentSendBtn = document.getElementById('send-button');
                 const freshMpClone = multiplayerBtn.cloneNode(true);
                 freshMpClone.id = 'send-button';
                 freshMpClone.addEventListener('click', performMultiplayerSend);
                 currentSendBtn.parentNode.replaceChild(freshMpClone, currentSendBtn);
            }
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
 window.Multiplayer = Multiplayer;
    Multiplayer.init();
    
//正则导入
     

    try {
        const ruleName = '主神空间_骰子美化_01';

        const existing = TavernHelper.getTavernRegexes({ scope: 'character' })
            .some(r => r.script_name === ruleName);

        if (existing) {
            
            return; // 直接退出，不调用更新函数
        }

          TavernHelper.updateTavernRegexesWith((regexes) => {

            const newRule = {
                id: crypto.randomUUID(),
                script_name: ruleName,
                enabled: true,
                scope: 'character',

                find_regex: "/<roll>([\\s\\S]*?)<\\/roll>/gs",
                replace_string: `<div style="
  max-width:600px;
  max-height:400px;
  overflow:auto;
  padding:12px;
  border:1px solid #ccc;
  border-radius:8px;
  background:#f7f7f7;
  color:black;
  font-family:Consolas, monospace;
  font-size:14px;
  line-height:1.5;
  white-space:pre-wrap;
  word-break:break-word;
">
  <pre style="margin:0;">$1</pre>
</div>`,

                trim_strings: "",

                source: {
                    user_input: false,
                    ai_output: true,
                    slash_command: false,
                    world_info: false,
                },

                destination: {
                    display: true,
                    prompt: false,
                },

                run_on_edit: false,
                min_depth: null,
                max_depth: null,
            };

            regexes.unshift(newRule);
            return regexes;

        }, { scope: 'character' });

        toastr.success('主神空间_骰子美化_01 正则导入完成。');

    } catch (error) {
        console.error(error);
        // toastr.error('导入失败：' + error.message);
        throw error;
    }
 
 function createConfirmModal(title, message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: var(--container-bg-color);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483647;
        backdrop-filter: blur(6px);
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: var(--modal-content-bg);
        background-color: var(--background-color);
        color: var(--text-color);
        border: 1px solid var(--border-color);
    
        padding: 24px;
        border-radius: 12px;
        min-width: 320px;
        font-family: var(--base-font-family);
        font-size: var(--base-font-size);
        line-height: var(--base-line-height);
    `;

    modal.innerHTML = `
        <h3 style="margin:0 0 10px 0; color: var(--primary-color);">
            ${title}
        </h3>
        <div style="margin:15px 0; color: var(--text-secondary-color);">
            ${message}
        </div>
        <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button id="confirmBtn" style="
                background: var(--primary-color);
                color: #000;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
            ">确认</button>

            <button id="cancelBtn" style="
                background: var(--danger-color);
                color: #fff;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
            ">取消</button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    modal.querySelector('#confirmBtn').onclick = () => {
        document.body.removeChild(overlay);
        onConfirm && onConfirm();
    };

    modal.querySelector('#cancelBtn').onclick = () => {
        document.body.removeChild(overlay);
        onCancel && onCancel();
    };
}

  
})();