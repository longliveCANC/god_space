(function () {
  'use strict';

  console.log('[NovaIIFE] Nova Game API IIFE initialized');
  const apiToken = assaSettingsData && assaSettingsData.token;
  if (!apiToken) {
      console.error('[NovaIIFE] No token found in window.assaSettingsData.token. API service will not start.');
      return;
  }
  console.log(`[NovaIIFE] Token found: ${apiToken.substring(0, 4)}****`);

  const API_IP = 'localhost'; // 192.168.10.6
  const API_PORT = '3001';

  console.log(`[NovaIIFE] Attempting to connect to ws://${API_IP}:${API_PORT}`);
  const ws = new WebSocket(`ws://${API_IP}:${API_PORT}`);

  ws.onopen = () => {
    console.log(`[NovaIIFE] WebSocket connected to ws://${API_IP}:${API_PORT}`);
    ws.send(JSON.stringify({
      action: 'register',
      role: 'gameClient',
      token: apiToken 
    }));
    console.log('[NovaIIFE] Sent registration as gameClient with token');

    ws.send(JSON.stringify({ event: 'connected', token: apiToken }));
    try {
      window.novaStreamHook = (payload) => {
        if (!payload) return;

        if (ws.readyState !== WebSocket.OPEN) {
          console.warn('[NovaIIFE] WebSocket not open, skip novaStreamHook payload');
          return;
        }
        ws.send(JSON.stringify({
          action: 'handleSendStream',
          token: apiToken,
          data: payload,
        }));
      };
      console.log('[NovaIIFE] window.novaStreamHook registered for streaming data');
    } catch (e) {
      console.error('[NovaIIFE] Failed to register novaStreamHook:', e);
    }
  };
  function getNestedValue(obj, path) {
      if (!path) return undefined;
      return path.split('.').reduce((prev, curr) => {
          return (prev && prev[curr] !== undefined) ? prev[curr] : undefined;
      }, obj);
  }

  function toIntOrNull(value) {
      if (value === undefined || value === null || value === '') return null;
      const parsed = parseInt(String(value), 10);
      return Number.isInteger(parsed) ? parsed : null;
  }

  function clampInt(value, min, max) {
      return Math.min(max, Math.max(min, value));
  }

  function resolveConversationRange(total, range) {
      const safeTotal = Math.max(0, total | 0);
      const fallbackCount = 4;
      const count = clampInt(toIntOrNull(range && range.count) ?? fallbackCount, 1, 100);

      const startRaw = toIntOrNull(range && range.start);
      const beforeRaw = toIntOrNull(range && range.before);

      let startIndex = 0;
      let endIndex = safeTotal;

      if (startRaw !== null) {
          startIndex = clampInt(startRaw, 0, safeTotal);
          endIndex = clampInt(startIndex + count, 0, safeTotal);
      } else if (beforeRaw !== null) {
          endIndex = clampInt(beforeRaw, 0, safeTotal);
          startIndex = clampInt(endIndex - count, 0, safeTotal);
      } else {
          endIndex = safeTotal;
          startIndex = clampInt(endIndex - count, 0, safeTotal);
      }

      return { startIndex, endIndex, count };
  }

  function resolveFn(name) {
      try {
          if (typeof window !== 'undefined' && typeof window[name] === 'function') {
              return window[name];
          }
      } catch (e) {}
      try {
          // eslint-disable-next-line no-new-func
          const fn = Function(`return (typeof ${name} === 'function') ? ${name} : null;`)();
          return typeof fn === 'function' ? fn : null;
      } catch (e) {
          return null;
      }
  }

  async function updateWorldbookPromptEntries(payload) {
      const {
          worldbookPrefix = 'x-mod-dialog-mode',
          environmentEntryName = 'environment_details',
          selectedFilesEntryName = 'selected_code_files',
          environmentDetails = '',
          selectedCodeFiles = '',
      } = payload || {};

      const getGlobalWorldbookNamesFn = resolveFn('getGlobalWorldbookNames');
      const updateWorldbookWithFn = resolveFn('updateWorldbookWith');
      const getWorldbookFn = resolveFn('getWorldbook');
      const replaceWorldbookFn = resolveFn('replaceWorldbook');
      const createWorldbookEntriesFn = resolveFn('createWorldbookEntries');

      if (!getGlobalWorldbookNamesFn) {
          throw new Error('getGlobalWorldbookNames is not available in runtime');
      }

      const globalNames = getGlobalWorldbookNamesFn() || [];
      if (!Array.isArray(globalNames) || globalNames.length === 0) {
          throw new Error('No global worldbook is enabled');
      }

      const worldbookName =
          globalNames.find((n) => typeof n === 'string' && n.startsWith(worldbookPrefix)) || globalNames[0];

      const applyUpdate = (entries) => {
          let hitEnv = false;
          let hitFiles = false;
          const next = (entries || []).map((entry) => {
              if (!entry || typeof entry !== 'object') return entry;
              if (entry.name === environmentEntryName) {
                  hitEnv = true;
                  return { ...entry, content: String(environmentDetails ?? '') };
              }
              if (entry.name === selectedFilesEntryName) {
                  hitFiles = true;
                  return { ...entry, content: String(selectedCodeFiles ?? '') };
              }
              return entry;
          });
          return { next, hitEnv, hitFiles };
      };

      let updateResult = { hitEnv: false, hitFiles: false };

      const runUpdate = async () => {
          if (updateWorldbookWithFn) {
              await updateWorldbookWithFn(worldbookName, (entries) => {
                  const applied = applyUpdate(entries);
                  updateResult = { hitEnv: applied.hitEnv, hitFiles: applied.hitFiles };
                  return applied.next;
              }, { render: 'debounced' });
              return;
          }

          if (getWorldbookFn && replaceWorldbookFn) {
              const current = await getWorldbookFn(worldbookName);
              const applied = applyUpdate(current);
              updateResult = { hitEnv: applied.hitEnv, hitFiles: applied.hitFiles };
              await replaceWorldbookFn(worldbookName, applied.next, { render: 'debounced' });
              return;
          }

          throw new Error('No worldbook update API available');
      };

      await runUpdate();

      if ((!updateResult.hitEnv || !updateResult.hitFiles) && createWorldbookEntriesFn) {
          const missingEntries = [];
          if (!updateResult.hitEnv) {
              missingEntries.push({
                  name: environmentEntryName,
                  enabled: true,
                  content: String(environmentDetails ?? ''),
              });
          }
          if (!updateResult.hitFiles) {
              missingEntries.push({
                  name: selectedFilesEntryName,
                  enabled: true,
                  content: String(selectedCodeFiles ?? ''),
              });
          }

          if (missingEntries.length > 0) {
              await createWorldbookEntriesFn(worldbookName, missingEntries, { render: 'debounced' });
              console.log('[worldbook] created missing prompt entries:', missingEntries.map((x) => x.name));
              await runUpdate();
          }
      }

      if (!updateResult.hitEnv || !updateResult.hitFiles) {
          throw new Error(
              `Target entries not found in worldbook "${worldbookName}": env=${updateResult.hitEnv}, files=${updateResult.hitFiles}`
          );
      }

      return {
          worldbookName,
          updated: updateResult,
          environmentEntryName,
          selectedFilesEntryName,
      };
  }

  ws.onmessage = async (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.action === 'getGameState') {
        const { correlationId, key, range } = msg.data || {};

        try {
          const api = window.GameAPI || {};
          let payload;

          if (key) {
            if (key === 'all') {
                payload = {
                  userName: api.userName,
                  assaData: api.assaData,
                  statData: api.statData,
                  playCharacterData: api.playCharacterData,
                  conversationHistory: api.conversationHistory,
                };
            } else if (key === 'conversationHistory' && range) {
                const list = Array.isArray(api.conversationHistory) ? api.conversationHistory : [];
                const { startIndex, endIndex } = resolveConversationRange(list.length, range);
                payload = {
                  items: list.slice(startIndex, endIndex),
                  total: list.length,
                  startIndex,
                  endIndex,
                  hasMoreOld: startIndex > 0,
                  hasMoreNew: endIndex < list.length,
                };
            } else {
                payload = getNestedValue(api, key);
            }
            if (payload === undefined) payload = null;

          } else {
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
              token: apiToken, 
              correlationId,
              data: payload,
            }));
          }
        } catch (e) {
          console.error('[NovaIIFE] Failed to collect GameAPI state:', e);
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
      if (msg.action === 'handleSend') {
        const data = msg.data || {};
        const { userText, options = {} } = data;
        console.log('[bridge] received handleSend, textLength=', String(userText ?? '').length);

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
          console.error('[NovaIIFE] Error in IIFE handleSend bridge:', err);
        }
        return;
      }
      if (msg.action === 'triggerassa') {
        const data = msg.data || {};
        const { args = [] } = data;
        console.log('[bridge] received triggerassa, argsCount=', Array.isArray(args) ? args.length : 0);

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
          console.error('[NovaIIFE] Error while calling triggerassa:', e);
        }
        return;
      }
      if (msg.action === 'processUpdateMemoryCommands') {
          const data = msg.data || {};
          const { args = [] } = data;
           try {
              if (typeof processUpdateMemoryCommands === 'function') {
                    processUpdateMemoryCommands(...args);
                   initDisplay();
              }
           } catch(e) { console.error(e); }
          return;
      }
      if (msg.action === 'updateWorldbookPrompt') {
          const data = msg.data || {};
          try {
              const result = await updateWorldbookPromptEntries(data);
              console.log('[worldbook] prompt entries updated:', result);
              if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({
                      action: 'worldbookPromptUpdateResult',
                      token: apiToken,
                      data: { success: true, ...result },
                  }));
              }
          } catch (e) {
              console.error('[worldbook] prompt update failed:', e);
              if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({
                      action: 'worldbookPromptUpdateResult',
                      token: apiToken,
                      data: { success: false, error: String(e?.message || e) },
                  }));
              }
          }
          return;
      }

    } catch (error) {
      console.error('[NovaIIFE] Error parsing message:', error);
    }
  };

  ws.onerror = (error) => { console.error('[NovaIIFE] WebSocket error:', error); };
  ws.onclose = () => { console.log('[NovaIIFE] WebSocket closed'); };
})();