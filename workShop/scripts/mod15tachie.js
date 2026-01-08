(function() {
    // ================= 配置与常量 =================
    const EventType = {
        GENERATE_IMAGE_REQUEST: 'generate-image-request',
        GENERATE_IMAGE_RESPONSE: 'generate-image-response',
    };

    // 检查必要环境
    if (typeof window.NovaHooks === 'undefined') {
        console.error('[Tachie Plugin] NovaHooks not found.');
        return;
    }

    // ================= 工具函数 =================

    // 生成唯一请求ID
    const generateUniqueId = () => {
        return 'tachie-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    };

    // Base64 转 Blob (用于存入 ImageDB)
    const base64ToBlob = (base64Data) => {
        const arr = base64Data.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    // ================= 核心逻辑：处理生成与存储 =================

    /**
     * 处理单次图片生成请求
     * @param {string} charName 角色名称
     * @param {string|null} variation 差分名称 (可选)
     * @param {string} prompt 提示词
     */
    async function handleImageGeneration(charName, variation, prompt) {
        // 1. 准备数据
        const requestId = generateUniqueId();
        const isVariation = !!variation; // 是否为差分
        // 命名规则：有差分则 "Name-Var"，无差分则 "Name"
        const saveKey = isVariation ? `${charName}-${variation}` : charName;

        console.log(`[Tachie Plugin] 准备生成: ${saveKey}, ID: ${requestId}`);

        // 2. 定义响应监听器
        const responseHandler = async (responseData) => {
            // ID 不匹配则忽略
            if (!responseData || responseData.id !== requestId) return;

            // 移除监听
            if (typeof eventRemoveListener === 'function') {
                eventRemoveListener(EventType.GENERATE_IMAGE_RESPONSE, responseHandler);
            }

            const { success, imageData, error } = responseData;

            if (!success) {
                console.error(`[Tachie Plugin] 生成失败 (${saveKey}):`, error);
                return;
            }

            try {
                // 3. 存入 ImageDB (CustomNpcs 保险箱)
                if (window.imageDB) {
                    const imageBlob = base64ToBlob(imageData);
                    await window.imageDB.set('CustomNpcs', saveKey, imageBlob);
                    console.log(`[Tachie Plugin] 图片已存入数据库: ${saveKey}`);
                } else {
                    console.error('[Tachie Plugin] imageDB 未定义，无法存储图片。');
                }

                // 4. 触发指令 (仅当不是差分时)
                if (!isVariation) {
                    const commandString = `/setinput <updateMemory>\nmemory('img_map.${charName}','${charName}')\n</updateMemory>`;
                    console.log(`[Tachie Plugin] 触发指令: ${commandString}`);

                    if (window.GameAPI && window.GameAPI.triggerassa) {
                        // -1 通常表示当前上下文或不特定指代
                        await window.GameAPI.triggerassa(commandString);
                      await  window.worldHelper.processUpdateMemoryCommands(commandString,-1);
                    }
                }

            } catch (e) {
                console.error(`[Tachie Plugin] 处理响应数据出错:`, e);
            }
        };

        // 3. 开启监听
        if (typeof eventOn === 'function') {
            eventOn(EventType.GENERATE_IMAGE_RESPONSE, responseHandler);
        } else {
            console.error('[Tachie Plugin] eventOn 未定义');
            return;
        }

        // 4. 发送请求
        const requestData = {
            id: requestId,
            prompt: prompt,
            width: null, // 使用后端默认
            height: null // 使用后端默认
        };

        if (typeof eventEmit === 'function') {
            await eventEmit(EventType.GENERATE_IMAGE_REQUEST, requestData);
        } else {
            console.error('[Tachie Plugin] eventEmit 未定义');
        }
    }

    // ================= 钩子函数：解析文本 =================

    async function processTachieTags(hookData) {
        if (!hookData || !hookData.response) return hookData;

        // 正则说明：
        // <tachie\s+char="([^"]+)"   -> 匹配 <tachie char="角色名"
        // (?:\s+variations="([^"]+)")? -> 可选匹配 variations="差分名"
        // >([\s\S]*?)<\/tachie>      -> 匹配中间的所有内容作为 prompt
        const regex = /<tachie\s+char="([^"]+)"(?:\s+variations="([^"]+)")?>([\s\S]*?)<\/tachie>/gi;

        // 获取所有匹配项
        const matches = [...hookData.response.matchAll(regex)];

        if (matches.length > 0) {
            console.log(`[Tachie Plugin] 检测到 ${matches.length} 个生成请求。`);

            // 【倒序检索】处理
            // 虽然 matchAll 是按顺序的，我们这里反转数组来模拟倒序处理逻辑
            // 或者如果你的意思是“以最后出现的为准”，倒序处理通常更方便
            const reversedMatches = matches.reverse();

            for (const match of reversedMatches) {
                const fullTag = match[0];
                const charName = match[1];
                const variation = match[2]; // 如果没有 variations 属性，这里是 undefined
                const prompt = match[3];

                // 调用后台生成逻辑
                // 注意：这里不使用 await 阻塞循环，让它们并行在后台跑
                handleImageGeneration(charName, variation, prompt);
            }

            // 【可选】从回复中移除标签，避免在聊天界面显示 XML 代码
            // 如果你想保留标签，请注释掉下面这行
            hookData.response = hookData.response.replace(regex, '');
        }

        return hookData;
    }

    // ================= 注册插件 =================
    window.NovaHooks.add('before_ai_response_save', processTachieTags);
    console.log('[Tachie Plugin] 立绘生成插件已加载 (倒序检索模式)。');

})();