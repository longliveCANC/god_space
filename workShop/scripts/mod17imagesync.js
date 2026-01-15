(function() {
    console.log('%c[ImageSync] 智能监听模式已启动', 'color: #00bcd4; font-weight: bold;');

    // --- 全局状态管理 ---
    let currentObserver = null;      // 当前的监听器实例
    let currentTargetBubble = null;  // 当前正在监听的 DOM 元素
    let syncDebounceTimer = null;    // 防抖计时器

    // --- 1. 注册钩子：作为入口点 ---
    if (typeof NovaHooks !== 'undefined') {
        NovaHooks.add('before_message_render', async (hookData) => {
            // 每次渲染请求时，延迟一点点时间去检查 DOM，看是否需要切换监听目标
            // 延迟是为了等待 DOM 实际更新完毕
            setTimeout(checkAndAttachObserver, 500);
            return hookData;
        });
    }

    // --- 2. 检查并绑定监听器 (核心逻辑) ---
    function checkAndAttachObserver() {
        // 获取界面上最后一个 AI 气泡
        const bubbles = document.querySelectorAll('.message-bubble.assistant-message');
        if (bubbles.length === 0) return;

        const lastBubble = bubbles[bubbles.length - 1];

        // 判断是否需要“交接”
        // 如果当前没有监听，或者最新的气泡不是我们正在监听的那个
        if (currentTargetBubble !== lastBubble) {
            console.log('[ImageSync] ♻️ 检测到新消息气泡，正在切换监听目标...');

            // A. 停止监听旧的
            if (currentObserver) {
                currentObserver.disconnect();
                currentObserver = null;
                console.log('[ImageSync] ⏹️ 已断开旧气泡的监听');
            }

            // B. 准备新的监听器
            currentObserver = new MutationObserver((mutations) => {
                // 这里的代码会在 DOM 发生任何变化时触发（打字机效果时会疯狂触发）

                // 使用防抖：只有当变化停止 1000ms 后，才执行同步逻辑
                if (syncDebounceTimer) clearTimeout(syncDebounceTimer);

                syncDebounceTimer = setTimeout(() => {
                    console.log('[ImageSync] ⚡ DOM 变动稳定，执行同步检查...');
                    syncImagesFromDomToHistory();
                }, 2000);
            });

            // C. 开始监听新的气泡
            // config: 监听子节点变化(childList)和文本内容变化(characterData/subtree)
            currentObserver.observe(lastBubble, {
                childList: true,
                subtree: true,
                characterData: true
            });

            currentTargetBubble = lastBubble;
            console.log('[ImageSync] ▶️ 已绑定新气泡监听器');

            // 绑定后立即执行一次检查（防止已经是完成状态）
            syncImagesFromDomToHistory();
        }
    }

    // --- 3. 同步逻辑 (复用之前的逻辑，带指纹校验) ---
    async function syncImagesFromDomToHistory() {
        if (typeof conversationHistory === 'undefined' || conversationHistory.length === 0) return;

        const latestHistoryEntry = conversationHistory[conversationHistory.length - 1];

        // 安全检查：确保我们监听的 DOM 对应的确实是历史记录里的最后一条
        // 如果用户删除了消息，DOM 可能还没刷新，这里做个简单校验
        if (latestHistoryEntry.role === 'user') return;

        // --- 防循环指纹校验 ---
        const currentContentLength = (latestHistoryEntry.content || "").length;
        if (latestHistoryEntry._lastSyncedLength === currentContentLength) {
            // 内容长度没变，说明这次 DOM 变动可能是我们自己插入 HTML 造成的，或者是无关变动
            return;
        }

        // 获取当前监听气泡的文本
        if (!currentTargetBubble) return;
        const domText = currentTargetBubble.innerText;

        // 正则匹配
        const imgRegex = /image###[\s\S]*?###/g;
        const matches = [...domText.matchAll(imgRegex)];

        let rawContent = latestHistoryEntry.content || "";
        let hasChanges = false;

        if (matches.length > 0) {
            for (const match of matches) {
                const imgTag = match[0];
                const matchIndex = match.index;

                if (rawContent.includes(imgTag)) continue;

                // 定位逻辑
                const prevContext = domText.substring(Math.max(0, matchIndex - 10), matchIndex).trim();
                const nextContext = domText.substring(matchIndex + imgTag.length, Math.min(domText.length, matchIndex + imgTag.length + 10)).trim();

                let inserted = false;

                // 策略 A: 前置
                if (prevContext.length > 2 && rawContent.includes(prevContext)) {
                    const escaped = prevContext.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    if (!rawContent.includes(prevContext + imgTag)) {
                        rawContent = rawContent.replace(new RegExp(escaped), prevContext + imgTag);
                        inserted = true;
                        console.log(`[ImageSync] 捕获图片: ${imgTag.substring(0,15)}... (前置定位)`);
                    }
                }
                // 策略 B: 后置
                else if (nextContext.length > 2 && rawContent.includes(nextContext)) {
                    const escaped = nextContext.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    if (!rawContent.includes(imgTag + nextContext)) {
                        rawContent = rawContent.replace(new RegExp(escaped), imgTag + nextContext);
                        inserted = true;
                        console.log(`[ImageSync] 捕获图片: ${imgTag.substring(0,15)}... (后置定位)`);
                    }
                }
                // 策略 C: 追加
                if (!inserted) {
                    rawContent += '\n' + imgTag;
                    console.log(`[ImageSync] 捕获图片: ${imgTag.substring(0,15)}... (追加末尾)`);
                }
                hasChanges = true;
            }
        }

        // 更新指纹并保存
        if (hasChanges) {
            latestHistoryEntry.content = rawContent;
            latestHistoryEntry._lastSyncedLength = rawContent.length; // 更新指纹

            console.log('[ImageSync] 同步数据并刷新界面...');

            // 暂时断开监听器，防止 renderHistory 触发 DOM 变动再次回调 observer
            // 虽然有指纹校验，但断开更保险
            if (currentObserver) currentObserver.disconnect();

            if (typeof worldHelper !== 'undefined') await worldHelper.renderHistory(false, true);
            if (typeof saveHistory === 'function') await saveHistory();

            // 刷新完后，DOM 元素会被替换，需要重新绑定
            // 我们设置一个短延时，让 checkAndAttachObserver 重新运行
            currentTargetBubble = null; // 强制重置目标
            setTimeout(checkAndAttachObserver, 200);
        } else {
            // 即使没变，也更新指纹，避免重复计算
            latestHistoryEntry._lastSyncedLength = rawContent.length;
        }
    }
})();
