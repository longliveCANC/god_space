(function() {
    'use strict';

    if (window.isTavernOnlineUpdaterLoaded) {
        return;
    }
    window.isTavernOnlineUpdaterLoaded = true;

    // =========================================================================
    // ✨ 1. 引入 Toastr 调试器
    // =========================================================================
    function debugToast(message, step, type = 'info') {
        toastr[type](`[步骤 ${step}] ${message}`, '', { timeOut: 2000, extendedTimeOut: 1000 });
    }

    // =========================================================================
    // 1. 注入CSS样式 (黑金主题)
    // =========================================================================
    const styles = `
        body {
            transform: none !important;
            filter: none !important;
        }
        /* 模态框基础样式 */
        .online-updater-modal {
           display: none !important;
            position: fixed;
            z-index: 1050;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.7);
            -webkit-backdrop-filter: blur(5px);
            backdrop-filter: blur(5px);
        }
        .online-updater-modal-content {
            background-color: #1a1a1a;
            color: #e0e0e0;
            margin: 5% auto;
            padding: 25px 30px;
            border: 1px solid #c0a060;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
            position: relative;
            box-sizing: border-box;
        }
        .online-updater-modal-close {
            color: #aaa;
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s;
        }
        .online-updater-modal-close:hover,
        .online-updater-modal-close:focus {
            color: #c0a060;
            text-decoration: none;
        }
        .online-updater-modal-title {
            font-size: 1.5em;
            color: #e0c080;
            margin-bottom: 15px;
            border-bottom: 1px solid #444;
            padding-bottom: 10px;
        }
        .online-updater-modal-description {
            font-size: 1em;
            line-height: 1.6;
            max-height: 400px;
            overflow-y: auto;
            background: rgba(0,0,0,0.2);
            padding: 15px;
            border-radius: 5px;
            margin-top: 10px;
            border: 1px solid #333;
        }
        .online-updater-modal-actions {
            text-align: right;
            margin-top: 25px;
        }
        .online-updater-control-btn {
            background-color: #333;
            color: #e0e0e0;
            border: 1px solid #555;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: bold;
        }
        .online-updater-control-btn:hover {
            background-color: #444;
            border-color: #c0a060;
        }
        .online-updater-primary-btn {
            background-color: #c0a060;
            color: #1a1a1a;
            border-color: #c0a060;
        }
        .online-updater-primary-btn:hover {
            background-color: #d4b070;
            border-color: #d4b070;
        }
        .update-log-entry {
            margin-bottom: 20px;
            border-bottom: 1px solid #444;
            padding-bottom: 15px;
        }
        .update-log-entry:last-child {
            border-bottom: none;
        }
        .update-log-entry h3 {
            color: #e0c080;
            margin-bottom: 8px;
        }
        .update-log-entry h3 span {
            font-size: 0.8em;
            color: #999;
        }
        .update-log-entry ul {
            list-style-type: disc;
            padding-left: 20px;
            margin: 0;
            font-size: 0.95em;
        }
        .update-log-entry li {
            margin-bottom: 5px;
        }
        @media (max-width: 768px) {
            .online-updater-modal-content {
                margin: 20px auto;
                width: 100vw;
                padding: 20px 15px;
            }
            .online-updater-modal-title {
                font-size: 1.3em;
            }
            .online-updater-modal-description {
                max-height: 60vh;
            }
            .online-updater-modal-actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }
            .online-updater-control-btn {
                width: 100%;
                margin: 0;
            }
        }
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
        // 简化的查找逻辑
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
    // 3. 核心业务逻辑 (使用新API优化)
    // =========================================================================

    /**
     * 优化的世界书更新逻辑
     * 使用 updateWorldbookWith 实现无感更新
     */
    async function performWorldbookUpdate() {
        const worldbookName = '小蝌蚪找妈妈-同层版';
        const protectedIDs = [30, 32]; // 需要保留的本地ID
        const bookJsonUrl = 'https://longlivecanc.github.io/god_space/book.json';

        try {
            // 1. 先下载远程数据
            toastr.info('正在下载最新世界书数据...');
            const remoteData = await loadRemoteJson(bookJsonUrl);

            if (!remoteData) {
                throw new Error("无法获取远程世界书数据");
            }

            // 处理酒馆导出格式：可能是 { entries: [...] } 也可能是直接的 [...]
            const newEntriesRaw = Array.isArray(remoteData) ? remoteData : (remoteData.entries || []);
            if (newEntriesRaw.length === 0) {
                throw new Error("远程世界书数据为空");
            }

            const allBooks = TavernHelper.getWorldbookNames();
            const exists = allBooks.includes(worldbookName);

            if (exists) {
                toastr.info(`正在合并更新「${worldbookName}」...`);

                // ✨ 核心魔法：使用 updateWorldbookWith 进行原子更新
                // 不需要删除，不需要解绑，不需要备份到 localStorage
                await TavernHelper.updateWorldbookWith(worldbookName, (currentEntries) => {

                    // A. 从当前本地书里找到我们要“保护”的条目
                    const keptEntries = currentEntries.filter(entry => protectedIDs.includes(entry.uid));
                    console.log(`[Updater] 保留了 ${keptEntries.length} 个本地条目 (IDs: ${protectedIDs.join(',')})`);

                    // B. 准备新条目，但要剔除掉那些 ID 和我们保护的 ID 冲突的远程条目
                    // (即：如果远程也有 ID 30，我们不要远程的，要本地的)
                    const incomingEntries = newEntriesRaw.filter(entry => !protectedIDs.includes(entry.uid));

                    // C. 合并：新条目 + 保留的旧条目
                    return [...incomingEntries, ...keptEntries];
                });

                toastr.success(`世界书已平滑更新！(保留了本地修改)`);
            } else {
                // 如果书不存在，直接创建
                toastr.info(`未检测到世界书，正在创建...`);
                await TavernHelper.createWorldbook(worldbookName, newEntriesRaw);
                toastr.success(`世界书创建成功！`);
            }

            // 检查绑定状态 (通常 updateWorldbookWith 不会掉绑定，但为了保险检查一下)
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

            // 查找目标正则
            const unifiedRuleIndex = allCharacterRules.findIndex(rule => rule.script_name === '统一');
            const purgeRuleIndex = allCharacterRules.findIndex(rule => rule.script_name === '去除1');

            if (unifiedRuleIndex === -1 || purgeRuleIndex === -1) {
                throw new Error('未找到名为"统一"或"去除1"的正则脚本，请检查名称。');
            }

            // 构建新规则对象
            const updatedUnifiedRule = {
                ...allCharacterRules[unifiedRuleIndex],
                replace_string: newContentString
            };

            const updatedPurgeRule = {
                ...allCharacterRules[purgeRuleIndex],
                find_regex: "/<(statusAnalyze|loreAnalyze|attributeAnalyze|variableAnalyze|memoryAnalyze|mapAnalyze|status_analyze|lore_analyze|attribute_analyze|variable_analyze|memory_analyze|map_analyze|dynamicAnalyze|realityCheck|moduleAnalyze|updateStatus|build|世界书条目|danmu|options|roll)>([\\s\\S]*?)<\\/\\1>|<updateMemory>([\\s\\S]*?)<\\/updateMemory>|<updateMemory>[\\s\\S]*|<variableAnalyze>[\\s\\S]*|<statusAnalyze>[\\s\\S]*|<mapAnalyze>[\\s\\S]*|<loreAnalyze>[\\s\\S]*|<attributeAnalyze>[\\s\\S]*|<memoryAnalyze>[\\s\\S]*|<moduleAnalyze>([\\s\\S]*?)<\/realityCheck>|(【✓检索执行完成】)|(【✓思考执行完成】)|(<!--[\\s\\S]*?-->)/gs"
            };

            // 过滤掉旧的，保留其他的
            const otherRules = allCharacterRules.filter(r => r.script_name !== '统一' && r.script_name !== '去除1');

            // 重新组合：更新后的放在最前面 + 其他的
            const finalRules = [updatedPurgeRule, updatedUnifiedRule, ...otherRules];

            await TavernHelper.replaceTavernRegexes(finalRules, { scope: 'character' });
            toastr.success(`正则脚本更新完成！`);

        } catch (error) {
            console.error(error);
            toastr.error(`正则更新失败: ${error.message}`);
            throw error; // 抛出异常以中断后续流程
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
                // 构建更新日志 HTML
                const relevantLogs = updateLogs.filter(log => compareVersions(log.version, currentVersion) > 0);
                const changelogHTML = relevantLogs.reverse().map(log => `
                    <div class="update-log-entry">
                        <h3>v${log.version} <span>(${log.date})</span></h3>
                        <ul>${log.changes.map(c => `<li>${c}</li>`).join('')}</ul>
                    </div>
                `).join('');

                // 创建或显示模态框
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

                    // 绑定基础事件
                    const modal = document.getElementById('update-modal');
                    modal.addEventListener('click', e => { if(e.target === modal) hideModal('update-modal'); });
                    modal.querySelector('.online-updater-modal-close').onclick = () => hideModal('update-modal');
                    modal.querySelector('#cancel-update-btn').onclick = () => hideModal('update-modal');

                    // 绑定更新按钮事件 -> 跳转到确认页
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

            // 绑定最终执行逻辑
            modal.querySelector('#confirm-final-btn').onclick = async () => {
                hideModal('backup-confirmation-modal');
                localStorage.setItem('pendingDualUpdate', 'processing'); // 仅作标记，不依赖它跳转

                try {
                    // 1. 正则
                    await performRegexUpdate();

                    // 2. 等待
                    toastr.info('正则更新完毕，等待 5 秒...');
                    await new Promise(r => setTimeout(r, 5000));

                    // 3. 世界书
                    await performWorldbookUpdate();

                    // 4. 刷新版本
                    await refreshVersionAfterUpdate();

                    toastr.success('所有更新已完成！');
                } catch (e) {
                    // 错误已在各个函数内处理，这里只做最终清理
                } finally {
                    localStorage.removeItem('pendingDualUpdate');
                }
            };
        }
        showModal('backup-confirmation-modal');
    }

    // =========================================================================
    // 4. 初始化
    // =========================================================================
    if (!window.top.TavernUpdaterAPI) window.top.TavernUpdaterAPI = {};
    window.top.TavernUpdaterAPI.checkForUpdates = checkForFutureEchoes;

    setTimeout(() => {
        console.log("[Tavern Updater] 自动检查更新...");
        checkForFutureEchoes(false);
    }, 2000);

})();