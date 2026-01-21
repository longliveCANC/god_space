(function() {
    'use strict';

    if (window.isTavernOnlineUpdaterLoaded) {
        return;
    }
    window.isTavernOnlineUpdaterLoaded = true;

    // =========================================================================
    // ✨ 1. 样式注入
    // =========================================================================
    const styles = `
        body { transform: none !important; filter: none !important; }
        .online-updater-modal { display: none !important; position: fixed; z-index: 1050; left: 0; top: 0; width: 100vw; height: 100vh; overflow: auto; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); }
        .online-updater-modal-content { background-color: #1a1a1a; color: #e0e0e0; margin: 5% auto; padding: 25px 30px; border: 1px solid #c0a060; border-radius: 8px; width: 90%; max-width: 600px; box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5); position: relative; }
        .online-updater-modal-close { color: #aaa; position: absolute; top: 10px; right: 20px; font-size: 28px; font-weight: bold; cursor: pointer; }
        .online-updater-modal-title { font-size: 1.5em; color: #e0c080; margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px; }
        .online-updater-modal-description { font-size: 1em; line-height: 1.6; max-height: 400px; overflow-y: auto; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 5px; margin-top: 10px; border: 1px solid #333; }
        .online-updater-modal-actions { text-align: right; margin-top: 25px; }
        .online-updater-control-btn { background-color: #333; color: #e0e0e0; border: 1px solid #555; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; margin-left: 10px; }
        .online-updater-primary-btn { background-color: #c0a060; color: #1a1a1a; border-color: #c0a060; }
        .update-log-entry { margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 15px; }
        .update-log-entry h3 { color: #e0c080; margin-bottom: 8px; }
        .update-log-entry ul { list-style-type: disc; padding-left: 20px; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // =========================================================================
    // 2. 辅助函数
    // =========================================================================
    function showModal(modalId, title = null, descriptionHTML = null) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        if (title) modal.querySelector('.online-updater-modal-title').textContent = title;
        if (descriptionHTML) modal.querySelector('.online-updater-modal-description').innerHTML = descriptionHTML;
        modal.style.setProperty('display', 'block', 'important');
    }

    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.setProperty('display', 'none', 'important');
    }

    function createCacheBustedUrl(url) {
        const newUrl = new URL(url);
        newUrl.searchParams.set('t', new Date().getTime());
        return newUrl.toString();
    }

    async function loadRemoteJson(url) {
        try {
            const response = await fetch(createCacheBustedUrl(url));
            if (!response.ok) throw new Error(response.statusText);
            return await response.json();
        } catch (error) {
            console.error(`[Updater] JSON加载失败: ${url}`, error);
            return null;
        }
    }

    async function loadRemoteContent(url) {
        try {
            const response = await fetch(createCacheBustedUrl(url));
            if (!response.ok) return null;
            return await response.text();
        } catch (error) {
            return null;
        }
    }

    function compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        const len = Math.max(parts1.length, parts2.length);
        for (let i = 0; i < len; i++) {
            const p1 = parts1[i] || 0;
            const p2 = parts2[i] || 0;
            if (p1 > p2) return 1;
            if (p1 < p2) return -1;
        }
        return 0;
    }

    async function refreshVersionAfterUpdate() {
        const STABLE_VERSION_VAR = '__TAVERN_UPDATER_STABLE_VERSION__';
        const findVersion = (win) => {
            try { return win.current_game_version; } catch(e) { return null; }
        };
        let ver = findVersion(window.top);
        if (!ver && window.top.frames) {
            for (let i = 0; i < window.top.frames.length; i++) {
                ver = findVersion(window.top.frames[i]);
                if (ver) break;
            }
        }
        if (ver) {
            window.top[STABLE_VERSION_VAR] = ver;
            console.log(`[Updater] 版本已刷新: ${ver}`);
        }
    }

    // =========================================================================
    // 🛠️ 关键修复：数据格式转换器 (Storage Format -> Runtime Format)
     // =========================================================================
    // 🛠️ 修复版：数据格式转换器
    // =========================================================================
    function normalizeWorldbookEntry(raw) {
        // 如果已经是运行时格式，直接返回
        if (raw.strategy && typeof raw.strategy === 'object') return raw;

        // 1. 基础字段
        const entry = {
            uid: raw.uid,
            name: raw.comment || raw.name || '未命名条目',
            content: raw.content || '',
            enabled: raw.disable === false,
            order: typeof raw.order === 'number' ? raw.order : 100,
            probability: typeof raw.probability === 'number' ? raw.probability : 100,
            displayIndex: raw.displayIndex || 0,

            // ✨ 修复分组丢失问题
            group: raw.group || '',
            groupOverride: raw.groupOverride || false,
            groupWeight: typeof raw.groupWeight === 'number' ? raw.groupWeight : 100,
        };

        // 2. 策略 (Strategy)
        let type = 'selective';
        if (raw.constant) type = 'constant';
        else if (raw.vectorized) type = 'vectorized';

        const logicMap = { 0: 'and_any', 1: 'and_all', 2: 'not_any', 3: 'not_all' };

        entry.strategy = {
            type: type,
            keys: raw.key || [],
            keys_secondary: {
                logic: logicMap[raw.selectiveLogic] || 'and_any',
                keys: raw.keysecondary || []
            },
            scan_depth: raw.scanDepth || null
        };

        // 3. 位置 (Position)
        const posTypeMap = {
            0: 'before_character_definition',
            1: 'after_character_definition',
            2: 'before_example_messages',
            3: 'after_example_messages',
            4: 'before_author_note',
            5: 'after_author_note',
            6: 'at_depth'
        };
        const roleMap = { 0: 'system', 1: 'user', 2: 'assistant' };

        // ✨ 智能位置修正
        // 如果原始数据包含 role 且不为 null，优先视为 at_depth (深度插入)
        // 你的数据中 position: 4 但 role: 0，这在某些版本中是深度插入的特征
        let posType = posTypeMap[raw.position];
        if (raw.position === 4 && typeof raw.role === 'number') {
             posType = 'at_depth';
        }
        // 如果映射失败，默认回退到 'at_depth' (通常比回退到角色定义更安全)
        if (!posType) posType = 'at_depth';

        entry.position = {
            type: posType,
            role: roleMap[raw.role] || 'system',
            // ✨ 修复 depth 为 0 时被错误变成 4 的问题
            depth: (typeof raw.depth === 'number') ? raw.depth : 4,
            order: raw.order || 0
        };

        // 4. 递归与效果
        entry.recursion = {
            prevent_incoming: !!raw.preventRecursion,
            prevent_outgoing: !!raw.excludeRecursion,
            delay_until: raw.delayUntilRecursion ? 1 : null
        };

        entry.effect = {
            sticky: raw.sticky || null,
            cooldown: raw.cooldown || null,
            delay: raw.delay || null
        };

        if (raw.id) entry.id = raw.id;

        return entry;
    }


    // =========================================================================
    // 3. 核心业务逻辑
    // =========================================================================

    async function performWorldbookUpdate() {
        const worldbookName = '小蝌蚪找妈妈-同层版';
        const protectedIDs = [30, 32];
        const bookJsonUrl = 'https://longlivecanc.github.io/god_space/book.json';

        try {
            toastr.info('正在下载最新世界书数据...');
            const remoteData = await loadRemoteJson(bookJsonUrl);

            if (!remoteData) throw new Error("无法获取远程世界书数据");

            // 1. 解析 JSON 为数组
            let newEntriesRaw = [];
            if (Array.isArray(remoteData)) {
                newEntriesRaw = remoteData;
            } else if (remoteData && remoteData.entries) {
                if (Array.isArray(remoteData.entries)) {
                    newEntriesRaw = remoteData.entries;
                } else if (typeof remoteData.entries === 'object') {
                    newEntriesRaw = Object.values(remoteData.entries);
                }
            }

            if (!Array.isArray(newEntriesRaw) || newEntriesRaw.length === 0) {
                throw new Error("远程数据格式无法解析");
            }

            // ✨ 2. 关键步骤：将 Raw 数据转换为 Runtime 数据
            const newEntriesRuntime = newEntriesRaw.map(normalizeWorldbookEntry);
            console.log('[Updater] 已转换远程数据格式:', newEntriesRuntime.length, '条');

            const allBooks = TavernHelper.getWorldbookNames();
            const exists = allBooks.includes(worldbookName);

            if (exists) {
                toastr.info(`正在合并更新「${worldbookName}」...`);

                await TavernHelper.updateWorldbookWith(worldbookName, (currentEntries) => {
                    // currentEntries 已经是 Runtime 格式，不需要转换
                    const safeCurrentEntries = Array.isArray(currentEntries) ? currentEntries : Object.values(currentEntries);

                    // 提取本地保留条目
                    const keptEntries = safeCurrentEntries.filter(entry => protectedIDs.includes(entry.uid));

                    // 提取远程新条目 (排除冲突ID)
                    const incomingEntries = newEntriesRuntime.filter(entry => !protectedIDs.includes(entry.uid));

                    // 合并
                    return [...incomingEntries, ...keptEntries];
                });

                toastr.success(`世界书已平滑更新！(保留了本地修改)`);
            } else {
                toastr.info(`未检测到世界书，正在创建...`);
                // 创建时也建议使用转换后的数据，以防 createWorldbook 内部处理不一致
                await TavernHelper.createWorldbook(worldbookName, newEntriesRuntime);
                toastr.success(`世界书创建成功！`);
            }

            // 检查绑定
            const currentBindings = await TavernHelper.getCharWorldbookNames('current');
            if (currentBindings.primary !== worldbookName) {
                toastr.info('正在修正绑定...');
                currentBindings.primary = worldbookName;
                await TavernHelper.rebindCharWorldbooks('current', currentBindings);
                toastr.success('绑定已修正');
            }

        } catch (error) {
            toastr.error(`世界书更新失败: ${error.message}`);
            console.error(error);
        }
    }

    async function performRegexUpdate() {
        toastr.info('正在更新正则脚本...');
        try {
            const newContentString = await loadRemoteContent('https://longlivecanc.github.io/god_space/regex_one.json');
            if (!newContentString) throw new Error("无法获取正则内容");

            const allCharacterRules = TavernHelper.getTavernRegexes({ scope: 'character' });

            const unifiedRuleIndex = allCharacterRules.findIndex(rule => rule.script_name === '统一');
            const purgeRuleIndex = allCharacterRules.findIndex(rule => rule.script_name === '去除1');

            if (unifiedRuleIndex === -1 || purgeRuleIndex === -1) {
                throw new Error('未找到名为"统一"或"去除1"的正则脚本。');
            }

            const updatedUnifiedRule = {
                ...allCharacterRules[unifiedRuleIndex],
                replace_string: newContentString
            };

            const updatedPurgeRule = {
                ...allCharacterRules[purgeRuleIndex],
                find_regex: "/<(statusAnalyze|loreAnalyze|attributeAnalyze|variableAnalyze|memoryAnalyze|mapAnalyze|status_analyze|lore_analyze|attribute_analyze|variable_analyze|memory_analyze|map_analyze|dynamicAnalyze|realityCheck|moduleAnalyze|updateStatus|build|世界书条目|danmu|options|roll)>([\\s\\S]*?)<\\/\\1>|<updateMemory>([\\s\\S]*?)<\\/updateMemory>|<updateMemory>[\\s\\S]*|<variableAnalyze>[\\s\\S]*|<statusAnalyze>[\\s\\S]*|<mapAnalyze>[\\s\\S]*|<loreAnalyze>[\\s\\S]*|<attributeAnalyze>[\\s\\S]*|<memoryAnalyze>[\\s\\S]*|<moduleAnalyze>([\\s\\S]*?)<\/realityCheck>|(【✓检索执行完成】)|(【✓思考执行完成】)|(<!--[\\s\\S]*?-->)/gs"
            };

            const otherRules = allCharacterRules.filter(r => r.script_name !== '统一' && r.script_name !== '去除1');
            const finalRules = [updatedPurgeRule, updatedUnifiedRule, ...otherRules];

            await TavernHelper.replaceTavernRegexes(finalRules, { scope: 'character' });
            toastr.success(`正则脚本更新完成！`);

        } catch (error) {
            console.error(error);
            toastr.error(`正则更新失败: ${error.message}`);
            throw error;
        }
    }

    async function checkForFutureEchoes(isManualTrigger = false) {
        if (isManualTrigger) toastr.info('正在检查更新...');

        try {
            const updateLogs = await loadRemoteJson('https://longlivecanc.github.io/god_space/update_log.json');
            if (!Array.isArray(updateLogs) || updateLogs.length === 0) {
                if (isManualTrigger) toastr.warning('未找到更新日志');
                return;
            }

            const latestVersion = updateLogs[updateLogs.length - 1].version;
            const STABLE_VERSION_VAR = '__TAVERN_UPDATER_STABLE_VERSION__';
            const currentVersion = window.top[STABLE_VERSION_VAR];

            if (!latestVersion || !currentVersion) {
                if (isManualTrigger) toastr.error('无法获取版本号进行比对');
                return;
            }

            if (compareVersions(latestVersion, currentVersion) > 0) {
                const relevantLogs = updateLogs.filter(log => compareVersions(log.version, currentVersion) > 0);
                const changelogHTML = relevantLogs.reverse().map(log => `
                    <div class="update-log-entry">
                        <h3>v${log.version} <span>(${log.date})</span></h3>
                        <ul>${log.changes.map(c => `<li>${c}</li>`).join('')}</ul>
                    </div>
                `).join('');

                if (!document.getElementById('update-modal')) {
                    const modalHTML = `
                    <div id="update-modal" class="online-updater-modal">
                        <div class="online-updater-modal-content">
                            <button class="online-updater-modal-close">×</button>
                            <div class="online-updater-modal-title"></div>
                            <div class="online-updater-modal-description"></div>
                            <div class="online-updater-modal-actions">
                                <button id="cancel-update-btn" class="online-updater-control-btn">稍后</button>
                                <button id="perform-update-btn" class="online-updater-control-btn online-updater-primary-btn">立即更新</button>
                            </div>
                        </div>
                    </div>`;
                    const div = document.createElement('div');
                    div.innerHTML = modalHTML;
                    document.body.appendChild(div.firstElementChild);

                    const modal = document.getElementById('update-modal');
                    modal.addEventListener('click', e => { if(e.target === modal) hideModal('update-modal'); });
                    modal.querySelector('.online-updater-modal-close').onclick = () => hideModal('update-modal');
                    modal.querySelector('#cancel-update-btn').onclick = () => hideModal('update-modal');
                    modal.querySelector('#perform-update-btn').onclick = () => {
                        hideModal('update-modal');
                        showBackupConfirmation();
                    };
                }
                showModal('update-modal', `发现新版本 v${latestVersion}`, changelogHTML);
            } else {
                if (isManualTrigger) toastr.success(`当前已是最新版本 (${currentVersion})`);
            }
        } catch (e) {
            toastr.error(`检查更新出错: ${e.message}`);
        }
    }

    function showBackupConfirmation() {
        if (!document.getElementById('backup-confirmation-modal')) {
            const html = `
            <div id="backup-confirmation-modal" class="online-updater-modal">
                <div class="online-updater-modal-content" style="max-width: 450px;">
                    <button class="online-updater-modal-close">×</button>
                    <div class="online-updater-modal-title">更新确认</div>
                    <div class="online-updater-modal-description">
                        <p style="color: #e0c080;">即将执行无感更新：</p>
                        <ul style="margin-bottom: 10px;">
                            <li>1. 更新正则脚本</li>
                            <li>2. 等待 5 秒缓冲</li>
                            <li>3. 合并更新世界书 (保留本地 ID: 30, 32)</li>
                        </ul>
                        <p>请确认你已备份其他重要的个人修改。</p>
                    </div>
                    <div class="online-updater-modal-actions">
                        <button id="cancel-final-btn" class="online-updater-control-btn">取消</button>
                        <button id="confirm-final-btn" class="online-updater-control-btn online-updater-primary-btn">开始更新</button>
                    </div>
                </div>
            </div>`;
            const div = document.createElement('div');
            div.innerHTML = html;
            document.body.appendChild(div.firstElementChild);

            const modal = document.getElementById('backup-confirmation-modal');
            modal.addEventListener('click', e => { if(e.target === modal) hideModal('backup-confirmation-modal'); });
            modal.querySelector('.online-updater-modal-close').onclick = () => hideModal('backup-confirmation-modal');
            modal.querySelector('#cancel-final-btn').onclick = () => hideModal('backup-confirmation-modal');

            modal.querySelector('#confirm-final-btn').onclick = async () => {
                hideModal('backup-confirmation-modal');
                localStorage.setItem('pendingDualUpdate', 'processing');

                try {
                    await performRegexUpdate();
                    toastr.info('正则更新完毕，等待 5 秒...');
                    await new Promise(r => setTimeout(r, 5000));
                    await performWorldbookUpdate();
                    await refreshVersionAfterUpdate();
                    toastr.success('所有更新已完成！');
                } catch (e) {
                    // Error handled in sub-functions
                } finally {
                    localStorage.removeItem('pendingDualUpdate');
                }
            };
        }
        showModal('backup-confirmation-modal');
    }

    if (!window.top.TavernUpdaterAPI) window.top.TavernUpdaterAPI = {};
    window.top.TavernUpdaterAPI.checkForUpdates = checkForFutureEchoes;

    setTimeout(() => {
        console.log("[Tavern Updater] 自动检查更新...");
        checkForFutureEchoes(false);
    }, 2000);

})();
