//—————— 游戏本体那边的IIFE代码——————
(function () {
  'use strict';

  console.log('🎮 Nova Game API IIFE Initialized');

  // 1. 获取 Token，如果没有则直接退出
  const apiToken = assaSettingsData && assaSettingsData.token;
  if (!apiToken) {
      console.error('❌ [NovaIIFE] No token found in window.assaSettingsData.token! API service will not start.');
      return;
  }
  console.log(`🔑 Token found: ${apiToken.substring(0, 4)}****`);

  const API_IP = 'localhost'; // 192.168.10.6
  const API_PORT = '3001';

  console.log(`🔗 Attempting to connect to ws://${API_IP}:${API_PORT}`);
  const ws = new WebSocket(`ws://${API_IP}:${API_PORT}`);

  ws.onopen = () => {
    console.log(`✅ WebSocket connected to ws://${API_IP}:${API_PORT}`);
    // 发送连接确认，带上 Token
    ws.send(JSON.stringify({
      action: 'register',
      role: 'gameClient',
      token: apiToken // 🔑 身份标识
    }));
    console.log('📢 Sent registration as gameClient with token');

    ws.send(JSON.stringify({ event: 'connected', token: apiToken }));

    // 注册流式钩子
    try {
      window.novaStreamHook = (payload) => {
        if (!payload) return;

        if (ws.readyState !== WebSocket.OPEN) {
          console.warn('⚠️ WebSocket not open, skip novaStreamHook payload');
          return;
        }

        // 发送流数据时带上 Token，以便服务器知道转发给谁
        ws.send(JSON.stringify({
          action: 'handleSendStream',
          token: apiToken,
          data: payload,
        }));
      };
      console.log('✅ window.novaStreamHook registered for streaming data');
    } catch (e) {
      console.error('❌ Failed to register novaStreamHook:', e);
    }
  };

 // —————— 游戏本体 IIFE 代码片段 (替换原有的 ws.onmessage) ——————

  // 辅助函数：用于解析深层对象路径 (例如 "assaData.global_lore.task")
  function getNestedValue(obj, path) {
      if (!path) return undefined;
      return path.split('.').reduce((prev, curr) => {
          return (prev && prev[curr] !== undefined) ? prev[curr] : undefined;
      }, obj);
  }

  ws.onmessage = async (event) => {
    try {
      const msg = JSON.parse(event.data);

      // 1. GET：从 GameAPI 读取状态并回传
      if (msg.action === 'getGameState') {
        const { correlationId, key } = msg.data || {};

        try {
          const api = window.GameAPI || {};
          let payload;

          if (key) {
            // 【修改点】支持深层路径解析
            if (key === 'all') {
                // 如果请求 'all'，返回完整的默认数据集
                payload = {
                  userName: api.userName,
                  assaData: api.assaData,
                  statData: api.statData,
                  playCharacterData: api.playCharacterData,
                  conversationHistory: api.conversationHistory,
                };
            } else {
                // 尝试解析点号路径 (按需获取)
                // 例如 key="assaData.global_lore.proactive_queue"
                payload = getNestedValue(api, key);
            }

            // 如果找不到数据，payload 设为 null
            if (payload === undefined) payload = null;

          } else {
            // 兼容旧逻辑，默认返回主要数据
            payload = {
              userName: api.userName,
              assaData: api.assaData,
              statData: api.statData,
              playCharacterData: api.playCharacterData,
              conversationHistory: api.conversationHistory,
            };
          }

          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              action: 'gameStateResponse',
              token: apiToken, // 🔑 回传时带 Token
              correlationId,
              data: payload,
            }));
          }
        } catch (e) {
          console.error('❌ Failed to collect GameAPI state:', e);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              action: 'gameStateResponse',
              token: apiToken,
              correlationId,
              data: null,
            }));
          }
        }
        return;
      }

      // 2. handleSend 调度 (保持不变)
      if (msg.action === 'handleSend') {
        const data = msg.data || {};
        const { userText, options = {} } = data;

        try {
          let inputRef = null;
          try {
            if (typeof window !== 'undefined' && window.userInput) {
              inputRef = window.userInput;
            }
          } catch (e) {}

          if (inputRef && 'value' in inputRef) {
            const finalText = userText != null ? String(userText) : '';
            inputRef.value = finalText;
          }

          if (typeof handleSend === 'function') {
            await handleSend(options);
          }
        } catch (err) {
          console.error('❌ Error in IIFE handleSend bridge:', err);
        }
        return;
      }

      // 3. 触发 triggerassa (保持不变)
      if (msg.action === 'triggerassa') {
        const data = msg.data || {};
        const { args = [] } = data;

        try {
          const api = window.GameAPI || {};
          if (api && typeof api.triggerassa === 'function') {
            api.triggerassa(...args);
          } else if (typeof window.triggerassa === 'function') {
            window.triggerassa(...args);
          } else if (typeof triggerassa === 'function') {
            triggerassa(...args);
          }
        } catch (e) {
          console.error('❌ Error while calling triggerassa:', e);
        }
        return;
      }

      // 4. 处理内存更新指令 (保持不变)
      if (msg.action === 'processUpdateMemoryCommands') {
          const data = msg.data || {};
          const { args = [] } = data;
           try {
              if (typeof processUpdateMemoryCommands === 'function') {
                    processUpdateMemoryCommands(...args);
                   initDisplay();
              }
           } catch(e) { console.error(e); }
      }

    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  };

  ws.onerror = (error) => { console.error('❌ WebSocket error:', error); };
  ws.onclose = () => { console.log('❌ WebSocket closed'); };
})();