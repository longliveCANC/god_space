(function() {
    console.log('%c[ImageSync] 脚本已加载 (防循环版)', 'color: orange; font-weight: bold;');

    if (typeof NovaHooks === 'undefined') {
        console.error('[ImageSync] 错误: NovaHooks 未定义！');
        return;
    }

    let syncImageTimeout = null;

    // 1. 注册钩子
    NovaHooks.add('before_message_render', async (hookData) => {
        // 防抖：清除旧计时器
        if (syncImageTimeout) clearTimeout(syncImageTimeout);

        // 设置新计时器 (1700ms)
        syncImageTimeout = setTimeout(async () => {
            try {
                await syncImagesFromDomToHistory();
            } catch (e) {
                console.error('[ImageSync] 异常:', e);
            }
        }, 1700);

        return hookData;
    });

    // 核心同步函数
    async function syncImagesFromDomToHistory() {
        // 2. 基础检查
        if (typeof conversationHistory === 'undefined' || conversationHistory.length === 0) return;

        const latestHistoryEntry = conversationHistory[conversationHistory.length - 1];

        // 只处理 AI 消息
        if (latestHistoryEntry.role === 'user') return;

        // --- [关键步骤] 防循环记录检查 ---
        // 获取当前内容的长度作为“指纹”
        const currentContentLength = (latestHistoryEntry.content || "").length;

        // 读取我们自定义的标记属性 _lastSyncedLength
        // 如果当前长度 等于 上次处理后的长度，说明内容没变，直接停止
        if (latestHistoryEntry._lastSyncedLength === currentContentLength) {
            console.log(`[ImageSync] 指纹匹配 (长度 ${currentContentLength})，跳过执行以防止循环。`);
            return;
        }

        console.log('[ImageSync] --- 开始新一轮检查 (内容发生变更或未处理) ---');

        // 3. 获取 DOM
        const bubbles = document.querySelectorAll('.message-bubble.assistant-message');
        if (bubbles.length === 0) {
            console.warn('[ImageSync] 未找到气泡 DOM。');
            return;
        }
        const lastBubble = bubbles[bubbles.length - 1];
        const domText = lastBubble.innerText;

        // 4. 正则匹配
        const imgRegex = /image###[\s\S]*?###/g;
        const matches = [...domText.matchAll(imgRegex)];

        let rawContent = latestHistoryEntry.content || "";
        let hasChanges = false;

        if (matches.length > 0) {
            console.log(`[ImageSync] DOM 中发现 ${matches.length} 个图片标签。`);

            for (const match of matches) {
                const imgTag = match[0];
                const matchIndex = match.index;

                // 如果内容里已经有了，跳过
                if (rawContent.includes(imgTag)) continue;

                // --- 定位逻辑 ---
                const prevContext = domText.substring(Math.max(0, matchIndex - 10), matchIndex).trim();
                const nextContext = domText.substring(matchIndex + imgTag.length, Math.min(domText.length, matchIndex + imgTag.length + 10)).trim();

                let inserted = false;

                // 策略 A: 前置定位
                if (prevContext.length > 2 && rawContent.includes(prevContext)) {
                    const escaped = prevContext.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    if (!rawContent.includes(prevContext + imgTag)) {
                        rawContent = rawContent.replace(new RegExp(escaped), prevContext + imgTag);
                        inserted = true;
                        console.log('[ImageSync] 已插入 (前置定位)');
                    }
                }
                // 策略 B: 后置定位
                else if (nextContext.length > 2 && rawContent.includes(nextContext)) {
                    const escaped = nextContext.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    if (!rawContent.includes(imgTag + nextContext)) {
                        rawContent = rawContent.replace(new RegExp(escaped), imgTag + nextContext);
                        inserted = true;
                        console.log('[ImageSync] 已插入 (后置定位)');
                    }
                }

                // 策略 C: 追加
                if (!inserted) {
                    rawContent += '\n' + imgTag;
                    console.log('[ImageSync] 已追加 (末尾)');
                }
                hasChanges = true;
            }
        } else {
            console.log('[ImageSync] DOM 中未发现图片标签。');
        }

        // --- [关键步骤] 更新指纹 ---
        // 无论是否有修改，我们都认为这次检查完成了。
        // 如果有修改，rawContent 变了，我们记录新的长度。
        // 如果没修改，rawContent 没变，我们记录当前长度。
        // 这样下次 render 触发时，长度一致，就会在上面的检查中被拦截。

        if (hasChanges) {
            console.log('[ImageSync] 保存更改并刷新...');
            latestHistoryEntry.content = rawContent;

            // 更新指纹为修改后的长度
            latestHistoryEntry._lastSyncedLength = rawContent.length;

            if (typeof worldHelper !== 'undefined') await worldHelper.renderHistory(false, true);
            if (typeof saveHistory === 'function') await saveHistory();
        } else {
            // 即使没有变化，也更新指纹，表示“这个状态我已经检查过了，别再烦我”
            latestHistoryEntry._lastSyncedLength = rawContent.length;
            console.log('[ImageSync] 无需修改，已更新指纹标记。');
        }
    }
})();
