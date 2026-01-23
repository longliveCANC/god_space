(function () {
  'use strict';

  console.log('🎮 Nova Game API IIFE Initialized');

  // TODO: 如果后面要改成从 localStorage / 设置里读 IP，就再封装一层
  const API_IP = '192.168.10.6';
  const API_PORT = '3001';

  console.log(`🔗 Attempting to connect to ws://${API_IP}:${API_PORT}`);

  const ws = new WebSocket(`ws://${API_IP}:${API_PORT}`);

  ws.onopen = () => {
    console.log(`✅ WebSocket connected to ws://${API_IP}:${API_PORT}`);
    // 发送连接确认
    ws.send(JSON.stringify({ event: 'connected' }));

    // 在连接成功后，把一个“流式钩子”挂到全局，供 handleSend 内部调用
    // payload 结构见 游戏本体的核心代码.js 里对 window.novaStreamHook 的调用
    try {
      window.novaStreamHook = (payload) => {
        if (!payload) return;

        if (ws.readyState !== WebSocket.OPEN) {
          console.warn('⚠️ WebSocket not open, skip novaStreamHook payload');
          return;
        }

        ws.send(JSON.stringify({
          action: 'handleSendStream',
          data: payload,
        }));
      };
      console.log('✅ window.novaStreamHook registered for streaming data');
    } catch (e) {
      console.error('❌ Failed to register novaStreamHook:', e);
    }
  };

  ws.onmessage = async (event) => {
    console.log('📨 Raw message received:', event.data);
    try {
      const msg = JSON.parse(event.data);
      console.log('📨 Parsed data:', msg);

      // 1. 兼容原来的 novaalert
      if (msg.action === 'showAlert') {
        const { message, type } = msg.data || {};
        console.log(`🎨 Calling showNovaAlert('${message}', '${type}')`);
        if (typeof showNovaAlert === 'function') {
          showNovaAlert(message, type);
        } else {
          console.error('❌ showNovaAlert is not a function!');
        }
        return;
      }

      // 2. GET：从 GameAPI 读取一次性状态并回传给服务器
      if (msg.action === 'getGameState') {
        const { correlationId } = msg.data || {};

        try {
          const api = window.GameAPI || {};

          const payload = {
            userName: api.userName,
            npcImageMap: api.npcImageMap,
            assaData: api.assaData,
            statData: api.statData,
            playCharacterData: api.playCharacterData,
            checkMemoryData: api.checkMemoryData,
            worldAttitudeData: api.worldAttitudeData,
            characterStatusData: api.characterStatusData,
            conversationHistory: api.conversationHistory,
          };

          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              action: 'gameStateResponse',
              correlationId,
              data: payload,
            }));
          }
        } catch (e) {
          console.error('❌ Failed to collect GameAPI state:', e);
        }

        return;
      }

      // 3. 新增：来自 game-api-server 的 handleSend 调度
      if (msg.action === 'handleSend') {
        const data = msg.data || {};
        const {
          userText,
          assaCommandQueue: incomingAssaCommandQueue,
          options = {},
          extra = {},
          correlationId,
        } = data;

        console.log('🧩 handleSend payload from server:', data);

        // ⭐ 不再依赖全局 assaCommandQueue，直接模拟“玩家在输入框里打字然后点发送”
        try {
          console.log('🔎 typeof handleSend:', typeof handleSend);

          // 安全获取输入框（避免直接访问未声明变量导致 ReferenceError）
          let inputRef = null;
          try {
            if (typeof window !== 'undefined' && window.userInput) {
              inputRef = window.userInput;
            }
          } catch (e) {
            // 忽略这里的错误，仅用于探测
          }

          console.log('🔎 userInput exist:', !!inputRef, 'value:', inputRef && inputRef.value);

          // （1）把文本直接塞进输入框（如果存在）
          if (inputRef && 'value' in inputRef) {
            const finalText = userText != null
              ? String(userText)
              : (incomingAssaCommandQueue != null ? String(incomingAssaCommandQueue) : '');

            console.log('✏️ Injecting into userInput:', finalText);
            inputRef.value = finalText;
          } else {
            console.warn('⚠️ userInput not found; 只能裸调 handleSend');
          }

          // （2）真正调用游戏本体的 handleSend
          if (typeof handleSend === 'function') {
            console.log('🚀 Calling handleSend with options:', options);
            await handleSend(options);
          } else {
            console.error('❌ handleSend is not a function!');
          }
        } catch (err) {
          console.error('❌ Error in IIFE handleSend bridge:', err);
        }

        // （4）如果将来要“反向”把流式/最终结果推回 server，
        // 可以在 handleSend 里增加钩子，在这里监听特定事件再 ws.send(...)
        // 例如：ws.send(JSON.stringify({ action: 'handleSendDone', data: { correlationId, ... } }));

        return;
      }

      // 4. 触发游戏内 triggerassa（仅调用，不读返回值）
      if (msg.action === 'triggerassa') {
        const data = msg.data || {};
        const { args = [] } = data;

        try {
          const api = window.GameAPI || {};

          if (api && typeof api.triggerassa === 'function') {
            console.log('🎯 Calling GameAPI.triggerassa with args:', args);
            api.triggerassa(...args);
          } else if (typeof window.triggerassa === 'function') {
            console.log('🎯 Calling window.triggerassa with args:', args);
            window.triggerassa(...args);
          } else if (typeof triggerassa === 'function') {
            console.log('🎯 Calling global triggerassa with args:', args);
            triggerassa(...args);
          } else {
            console.error('❌ triggerassa 函数未定义（GameAPI / window / global 均未找到）');
          }
        } catch (e) {
          console.error('❌ Error while calling triggerassa:', e);
        }

        return;
      }

      // 5. 预留：后续如果要从浏览器把流式 token / 最终结果再推回给 server，
      // 可以约定 action: 'handleSendStream' / 'handleSendDone' 等，这里统一处理。
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('❌ WebSocket closed');
  };

  console.log('✅ WebSocket listener ready');
})();