( function () {
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
        players: [], // [{name, isReady, isHost}]
            isCommandPanelEnabled: false,  
        commandPanelContent: ""  ,    
         chatHistory: [],  
        isChatMode: false,  
        hostIsEditing: false, 
         isCommandModalActive: false,  
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
             this.observeCommandModal(); // [新增] 监控令小盒
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
                        : `<button id="mp-leave-btn" class="mp-btn danger">🚪 退出房间</button>`
                    }
                `;
            } else {
                // 未加入房间
                contentHtml = `
                    <h3>SYSTEM LINK</h3>
                    <div id="mp-controls">
                        <button id="mp-create-btn" class="mp-btn">我要建房</button>
                        <div class="mp-divider"></div>
                        <input type="text" id="mp-room-id" class="mp-input" placeholder="输入房间号">
                        <button id="mp-join-btn" class="mp-btn">我要进房</button>
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
                this.updateLobbyPlayerList();
                if (State.currentRole === 'host') {
                    document.getElementById('mp-dissolve-btn').onclick = () => this.sendAction('dissolve_room');
                     
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

                } else {
              document.getElementById('mp-leave-btn').onclick = () => {
                // 1. 先向服务器发送离开请求
                this.sendAction('leave_room');

                // 2. 立即重置本地状态
                this.resetState();

                // 3. 显示提示信息
                showNovaAlert('您已退出房间');

                // 4. （可选，但推荐）如果WebSocket连接还存在，主动关闭它
                if (State.socket) {
                    State.socket.close();
                }
            };
     
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

          async connect(role, roomId = null) {
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
                else playerDesc = await EjsTemplate.evalTemplate('<%= persona_description.value %>');
            } catch (e) { console.warn("简介获取失败", e); }


            State.myInfo = { name: playerName, desc: playerDesc };

            // 客户端警告
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

            // 初始化 WebSocket
            try {
                State.socket = new WebSocket(SERVER_URL);
            } catch (e) {
                showNovaAlert("WebSocket 初始化失败");
                return;
            }

            State.socket.onopen = () => {
                State.isConnected = true;
                if (statusDiv) statusDiv.innerText = '握手成功...';
                const payload = { playerInfo: State.myInfo };
                if (role === 'host') {
                    State.socket.send(JSON.stringify({ type: 'create_room', ...payload }));
                } else {
                    State.socket.send(JSON.stringify({ type: 'join_room', roomId: roomId, ...payload }));
                }
            };

           State.socket.onmessage = async (event) => {
                const data = JSON.parse(event.data);
               await this.handleSocketMessage(data);
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
 State.isConnected = false;
            // 如果大厅开着，刷新它
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
                        showNovaAlert(`房间 ${data.roomId} 已创建`);
                        this.renderLobby();
                        this.setupInputInterface(); // [修改] 房主也设置输入界面
                        break;

                    case 'joined_success':
                        State.currentRole = 'client';
                        State.roomId = data.roomId;
                        showNovaAlert(`成功加入房间 ${data.roomId}`);
                        this.renderLobby();
                        this.setupInputInterface(); // [修改] 调用新函数
                        break;
          case 'player_shout':
                     
                    this.showPlayerShout(data.senderName, data.content);
                    break;
          

                     case 'room_update':
                   
                    if (State.currentRole === 'host' && typeof TavernHelper !== 'undefined') {
                        const oldPlayers = new Set(State.players.map(p => p.name));
                        const newPlayers = new Set(data.players.map(p => p.name));

                        // 遍历新列表，更新或添加玩家信息
                        data.players.forEach(player => {
                            if (player.name !== State.myInfo.name) { // 不处理自己
                                const varName = `player_${player.name}`;
                                const content = `${player.desc}\nStatus: Online`;
                                TavernHelper.insertOrAssignVariables({ [varName]: content }, { type: 'chat' });
                            }
                        });

                        // 找出离开的玩家并删除其变量
                        oldPlayers.forEach(oldName => {
                            if (!newPlayers.has(oldName) && oldName !== State.myInfo.name) {
                                const varName = `player_${oldName}`;
                                // 删除变量（通过设置为空字符串或特定标记）
                                TavernHelper.insertOrAssignVariables({ [varName]: 'Status: Offline。' }, { type: 'chat' });
                            }
                        });
                    }

                    // 核心：更新玩家列表和状态
                   State.players = data.players;
                       
                       // 🔴 修改: 直接从服务端接收权威状态，不再猜测
                    if (data.isCommandPanelEnabled !== undefined) {
                        State.isCommandPanelEnabled = data.isCommandPanelEnabled;
                    }
                    if (data.commandPanelContent !== undefined) {
                        State.commandPanelContent = data.commandPanelContent;
                    }

                    // 如果大厅是打开的，重新渲染它以更新按钮文本
                    if (document.querySelector('.mp-modal')) {
                        this.renderLobby();
                    }

                    this.updateLobbyPlayerList(); // 更新玩家列表DOM
                    this.renderFloatingBalls();   // 根据新状态重新渲染悬浮球
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
                        // 移除临时的流式气泡
                        const tempBubble = document.getElementById('mp-ai-bubble');
                        if (tempBubble) tempBubble.remove();
                              
                        // 将最终消息添加到历史并渲染
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
                    // 1. 存入历史 (保留最近50条)
                    State.chatHistory.push(data);
                    if (State.chatHistory.length > 50) State.chatHistory.shift();

                    // 2. 显示气泡 (使用不同的样式)
                    this.showPlayerShout(data.senderName, data.content, true);

                    // 3. 如果看板弹窗正开着，实时更新列表
                    this.updateChatHistoryDOM();
                    break;

                // [新增] 接收房主编辑状态
                case 'host_status_update':
                    State.hostIsEditing = data.isEditing;
                    this.renderFloatingBalls(); // 刷新球体显示状态
                    break;

                // [新增] 接收房主返回的实时看板数据
                case 'panel_data_sync':
                    this.updatePanelContentDOM(data.content);
                    break;

                // [新增] 房主收到请求，发送数据
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

                    // [新增] 客户端接收到最终的 localStorage 内容
                    case 'storage_data_sync':
                        this.updatePanelContentDOM(data.content);
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

            // 注入切换按钮 (如果不存在)
            if (!document.getElementById('mp-mode-switch')) {
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
                };
            }

            // 劫持发送按钮 (如果尚未劫持)
            if (sendBtn.getAttribute('data-hijacked')) return;

            const newBtn = sendBtn.cloneNode(true);
            sendBtn.parentNode.replaceChild(newBtn, sendBtn);
            newBtn.id = 'send-button';
            newBtn.setAttribute('data-hijacked', 'true');

            const performSend = () => {
                const userInputElem = document.getElementById('user-input');
                let userText = userInputElem ? userInputElem.value.trim() : "";
                if (!userText) return;

                if (State.socket && State.socket.readyState === WebSocket.OPEN) {
                    if (State.isChatMode) {
                        // 发送对话消息 (房主和客户端都一样)
                        this.sendAction('client_chat', { content: userText });
                    } else {
                        // 发送行动消息
                        if (State.currentRole === 'host') {
                     
                            if(typeof handleSend === 'function') {
                                handleSend(); // 触发酒馆自身的发送流程
                            } else {
                                console.error("handleSend function not found!");
                            }
                        } else {
                            // 客户端：上传给主机
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
                } else {
                    showNovaAlert("未连接到联机服务");
                }
            };

            newBtn.addEventListener('click', performSend);

            // 劫持回车键
            userInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    performSend();
                }
            }, true);
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
        toastr.error('导入失败：' + error.message);
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