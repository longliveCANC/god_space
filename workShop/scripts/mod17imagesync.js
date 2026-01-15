(function() {
    // 0. 脚本启动立即日志
    console.log('%c[ImageSync DEBUG] 脚本已注入，等待 NovaHooks...', 'background: #222; color: #bada55; font-size: 12px;');

    // --- 全局变量 ---
    let currentObserver = null;       // 当前的监控器实例
    let currentTargetNode = null;     // 当前监控的 DOM 节点
    let syncDebounceTimer = null;     // 防抖计时器

    // 1. 检查依赖
    if (typeof NovaHooks === 'undefined') {
        console.error('[ImageSync DEBUG] ❌ 致命错误: NovaHooks 未定义！脚本无法工作。');
        return;
    }

    // 2. 注册钩子
    try {
        NovaHooks.add('before_message_render', async (hookData) => {
            console.log('[ImageSync DEBUG] 🪝 钩子 before_message_render 被触发');

            // 延迟 500ms 等待 DOM 渲染完成，然后去挂载监控
            setTimeout(() => {
                console.log('[ImageSync DEBUG] ⏰ 钩子延迟结束，尝试挂载监控...');
                monitorLastMessage();
            }, 500);

            return hookData;
        });
        console.log('[ImageSync DEBUG] ✅ 钩子注册成功。');
    } catch (e) {
        console.error('[ImageSync DEBUG] ❌ 钩子注册失败:', e);
    }

    // 3. 监控管理器：负责绑定和解绑
    function monitorLastMessage() {
        console.log('[ImageSync DEBUG] 🔍 开始寻找最后一条 AI 消息气泡...');

        const bubbles = document.querySelectorAll('.message-bubble.assistant-message');
        console.log(`[ImageSync DEBUG] -> 当前页面共有 ${bubbles.length} 个 AI 气泡。`);

        if (bubbles.length === 0) {
            console.warn('[ImageSync DEBUG] ⚠️ 未找到任何 AI 气泡，停止挂载。');
            return;
        }

        const lastBubble = bubbles[bubbles.length - 1];

        // 检查是否需要切换目标
        if (currentTargetNode !== lastBubble) {
            console.log('[ImageSync DEBUG] ♻️ 发现新气泡 (或首次运行)，准备切换监控目标。');

            // A. 停止监控旧的
            if (currentObserver) {
                currentObserver.disconnect();
                console.log('[ImageSync DEBUG] ⏹️ 已断开旧气泡的监控。');
            }

            // B. 创建新监控器
            currentObserver = new MutationObserver((mutations) => {
                // 注意：这里日志会非常多，因为打字机效果每次变动都会触发
                // console.log('[ImageSync DEBUG] ⚡ DOM 发生变动...');

                const currentText = lastBubble.textContent || "";

                // 只有包含关键词才进入下一步
                if (currentText.includes('image###')) {
                    // console.log('[ImageSync DEBUG] -> 文本中包含 image###，准备防抖...');

                    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);

                    syncDebounceTimer = setTimeout(() => {
                        console.log('[ImageSync DEBUG] 🎯 防抖结束 (500ms)，关键词存在，执行同步逻辑！');
                        syncImagesFromDomToHistory();
                    }, 500);
                } else {
                    // console.log('[ImageSync DEBUG] -> 文本中未发现 image###，忽略。');
                }
            });

            // C. 开始监控
            try {
                currentObserver.observe(lastBubble, {
                    childList: true,
                    characterData: true,
                    subtree: true
                });
                currentTargetNode = lastBubble;
                console.log('[ImageSync DEBUG] 👁️ 监控器已挂载到新气泡，正在持续监视...');

                // 挂载时立即检查一次，防止图片已经生成好了
                if (lastBubble.textContent.includes('image###')) {
                    console.log('[ImageSync DEBUG] -> 挂载时发现已有关键词，立即触发同步。');
                    syncImagesFromDomToHistory();
                }
            } catch (e) {
                console.error('[ImageSync DEBUG] ❌ 挂载监控器失败:', e);
            }

        } else {
            console.log('[ImageSync DEBUG] 💤 目标未改变，保持当前监控状态。');
        }
    }

    // 4. 核心同步逻辑
    async function syncImagesFromDomToHistory() {
        console.log('[ImageSync DEBUG] 🚀 进入 syncImagesFromDomToHistory 函数');

        // 检查历史记录
        if (typeof conversationHistory === 'undefined' || conversationHistory.length === 0) {
            console.error('[ImageSync DEBUG] ❌ conversationHistory 为空或未定义！');
            return;
        }

        const latestHistoryEntry = conversationHistory[conversationHistory.length - 1];
        console.log(`[ImageSync DEBUG] -> 历史记录最后一条角色: ${latestHistoryEntry.role}`);

        if (latestHistoryEntry.role === 'user') {
            console.log('[ImageSync DEBUG] -> 最后一条是用户消息，跳过。');
            return;
        }

        // 指纹校验
        const currentContentLength = (latestHistoryEntry.content || "").length;
        console.log(`[ImageSync DEBUG] -> 指纹校验: 历史记录长度=${currentContentLength}, 上次同步长度=${latestHistoryEntry._lastSyncedLength}`);

        if (latestHistoryEntry._lastSyncedLength === currentContentLength) {
            console.log('[ImageSync DEBUG] 🛑 指纹匹配 (内容未变)，为防止死循环，终止操作。');
            return;
        }

        // 获取 DOM 文本
        if (!currentTargetNode) {
            console.error('[ImageSync DEBUG] ❌ currentTargetNode 丢失！');
            return;
        }

        const domText = currentTargetNode.innerText;
        console.log(`[ImageSync DEBUG] -> 获取到 DOM 文本 (长度: ${domText.length})`);

        // 正则匹配
        const imgRegex = /image###[\s\S]*?###/g;
        const matches = [...domText.matchAll(imgRegex)];
        console.log(`[ImageSync DEBUG] -> 正则匹配结果: 找到 ${matches.length} 个标签`);

        if (matches.length === 0) {
            console.log('[ImageSync DEBUG] -> 虽然触发了同步，但正则未匹配到完整标签，结束。');
            return;
        }

        let rawContent = latestHistoryEntry.content || "";
        let hasChanges = false;

        // 遍历匹配项
        for (const match of matches) {
            const imgTag = match[0];
            const matchIndex = match.index;
            console.log(`[ImageSync DEBUG] ---> 处理标签: ${imgTag.substring(0, 30)}...`);

            if (rawContent.includes(imgTag)) {
                console.log('[ImageSync DEBUG] -----> 历史记录中已存在该标签，跳过。');
                continue;
            }

            // 定位逻辑
            const prevContext = domText.substring(Math.max(0, matchIndex - 10), matchIndex).trim();
            const nextContext = domText.substring(matchIndex + imgTag.length, Math.min(domText.length, matchIndex + imgTag.length + 10)).trim();

            console.log(`[ImageSync DEBUG] -----> 定位锚点: 前="${prevContext}", 后="${nextContext}"`);

            let inserted = false;

            // 策略 A
            if (prevContext.length > 2 && rawContent.includes(prevContext)) {
                const escaped = prevContext.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                if (!rawContent.includes(prevContext + imgTag)) {
                    rawContent = rawContent.replace(new RegExp(escaped), prevContext + imgTag);
                    inserted = true;
                    console.log('[ImageSync DEBUG] -----> ✅ 成功: 前置定位插入');
                }
            }

            // 策略 B
            if (!inserted && nextContext.length > 2 && rawContent.includes(nextContext)) {
                const escaped = nextContext.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                if (!rawContent.includes(imgTag + nextContext)) {
                    rawContent = rawContent.replace(new RegExp(escaped), imgTag + nextContext);
                    inserted = true;
                    console.log('[ImageSync DEBUG] -----> ✅ 成功: 后置定位插入');
                }
            }

            // 策略 C
            if (!inserted) {
                rawContent += '\n' + imgTag;
                console.log('[ImageSync DEBUG] -----> ⚠️ 警告: 定位失败，追加到末尾');
            }

            hasChanges = true;
        }

        // 保存逻辑
        if (hasChanges) {
            console.log('[ImageSync DEBUG] 💾 检测到变更，开始保存流程...');

            latestHistoryEntry.content = rawContent;
            latestHistoryEntry._lastSyncedLength = rawContent.length;
            console.log(`[ImageSync DEBUG] -> 更新指纹长度为: ${rawContent.length}`);

            // 断开监控
            if (currentObserver) {
                currentObserver.disconnect();
                currentObserver = null;
                currentTargetNode = null;
                console.log('[ImageSync DEBUG] -> 已断开监控 (等待刷新后重连)');
            }

            // 刷新界面
            if (typeof worldHelper !== 'undefined') {
                console.log('[ImageSync DEBUG] -> 调用 worldHelper.renderHistory...');
                await worldHelper.renderHistory(false, true);
            } else {
                console.error('[ImageSync DEBUG] ❌ worldHelper 未定义！');
            }

            // 保存历史
            if (typeof saveHistory === 'function') {
                console.log('[ImageSync DEBUG] -> 调用 saveHistory...');
                await saveHistory();
                console.log('[ImageSync DEBUG] ✨ 全部完成！');
            } else {
                console.error('[ImageSync DEBUG] ❌ saveHistory 未定义！');
            }
        } else {
            // 更新指纹防止重复检查
            latestHistoryEntry._lastSyncedLength = rawContent.length;
            console.log('[ImageSync DEBUG] 💤 内容无实质变化，仅更新指纹。');
        }
    }
})();
