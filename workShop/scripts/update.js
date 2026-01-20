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
           display: none !important; /* 默认隐藏，但用 important 提升优先级 */
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
        if (title) {
            const titleEl = modal.querySelector('.online-updater-modal-title');
            if (titleEl) titleEl.textContent = title;
        }
        if (descriptionHTML) {
            const descEl = modal.querySelector('.online-updater-modal-description');
            if (descEl) descEl.innerHTML = descriptionHTML;
        }
        /* 修改这里：使用 setProperty 来覆盖 !important */
        modal.style.setProperty('display', 'block', 'important');
    }

     function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        /* 修改这里 */
        if (modal) modal.style.setProperty('display', 'none', 'important');
    }

    async function loadRemoteJson(url, fallbackData = null) {
        const cacheBustingUrl = new URL(url);
        cacheBustingUrl.searchParams.set('t', new Date().getTime());
        console.log(`[Updater] 准备请求: ${cacheBustingUrl.toString()}`);
        try {
            const response = await fetch(cacheBustingUrl.toString());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            console.log(`[Updater] JSON请求成功，获取到数据。`);
            return data;
        } catch (error) {
            console.error(`[Updater] loadRemoteJson 失败! URL: ${url}`, error);
            return fallbackData;
        }
    }

    async function loadRemoteContent(url, type = 'text', defaultValue = null) {
        try {
            const response = await fetch(createCacheBustedUrl(url));
            if (!response.ok) return defaultValue;
            return await response[type]();
        } catch (error) {
            return defaultValue;
        }
    }

    function createCacheBustedUrl(url) {
        const newUrl = new URL(url);
        newUrl.searchParams.set('t', new Date().getTime());
        return newUrl.toString();
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

    async function waitForWorldToSettle(worldbookName) {
        console.log(`Waiting for world book "${worldbookName}" to settle...`);
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    // =========================================================================
    // 3. 版本刷新函数 (关键！)
    // =========================================================================
    /**
     * 更新完成后，立即重新获取版本号
     */
    async function refreshVersionAfterUpdate() {
        console.log('[Updater] 更新完成，正在刷新版本号...');
        
        const STABLE_VERSION_VAR = '__TAVERN_UPDATER_STABLE_VERSION__';
        
        // 尝试从 loader.js 定义的地方找到当前版本
        const targetWindow = findVarInFrames(window.top, 'current_game_version');
        
        if (targetWindow && targetWindow.current_game_version) {
            const newVersion = targetWindow.current_game_version;
            window.top[STABLE_VERSION_VAR] = newVersion;
            console.log(`[Updater] 版本已刷新: ${newVersion}`);
            toastr.success(`版本已刷新至 ${newVersion}`);
            return newVersion;
        } else {
            console.warn('[Updater] 无法找到新的版本号，可能需要页面刷新');
            return null;
        }
    }

    /**
     * 递归遍历所有 iFrame，寻找目标变量（从 loader.js 复制）
     */
    function findVarInFrames(currentWindow, targetVar) {
        try {
            if (typeof currentWindow[targetVar] !== 'undefined') {
                console.log(`[Updater] 在窗口 ${currentWindow.location.href} 中找到变量 '${targetVar}'`);
                return currentWindow;
            }
        } catch (e) {
            return null;
        }
        for (let i = 0; i < currentWindow.frames.length; i++) {
            const frameWindow = currentWindow.frames[i];
            const foundWindow = findVarInFrames(frameWindow, targetVar);
            if (foundWindow) {
                return foundWindow;
            }
        }
        return null;
    }

    // =========================================================================
    // 4. 核心业务逻辑函数
    // =========================================================================

    async function performWorldbookUpdate() {
        const worldbookName = '小蝌蚪找妈妈-同层版';
        const uidsToBackup = [30, 32];
        const bookJsonUrl = createCacheBustedUrl('https://longlivecanc.github.io/god_space/book.json');

        try {
            const allBooks = TavernHelper.getWorldbookNames();

            if (allBooks.includes(worldbookName)) {
                toastr.info(`正在备份「${worldbookName}」中的特定词条...`);
                const currentWorldbook = await TavernHelper.getWorldbook(worldbookName);
                const backedUpEntries = currentWorldbook.filter(entry => uidsToBackup.includes(entry.uid));

                localStorage.setItem('worldbookBackup', JSON.stringify(backedUpEntries));
                toastr.success(`已成功备份 ${backedUpEntries.length} 个词条`);

                await TavernHelper.deleteWorldbook(worldbookName);
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            const rawWorldbookContent = await fetch(bookJsonUrl).then(res => res.text());
            await TavernHelper.importRawWorldbook(`${worldbookName}.json`, rawWorldbookContent);

            await new Promise(resolve => setTimeout(resolve, 800));
            await waitForWorldToSettle(worldbookName);
            await new Promise(resolve => setTimeout(resolve, 500));

            const savedBackup = localStorage.getItem('worldbookBackup');
            if (savedBackup) {
                const backedUpEntries = JSON.parse(savedBackup);
                toastr.info('正在恢复已备份的词条...');

                await TavernHelper.updateWorldbookWith(worldbookName, (newWorldbook) => {
                    const cleanedNewWorldbook = newWorldbook.filter(entry => !uidsToBackup.includes(entry.uid));
                    return [...cleanedNewWorldbook, ...backedUpEntries];
                });

                await new Promise(resolve => setTimeout(resolve, 800));
                await waitForWorldToSettle(worldbookName);

                localStorage.removeItem('worldbookBackup');
                toastr.success(`已成功恢复 ${backedUpEntries.length} 个词条!`);
            }

            toastr.success(`世界书「${worldbookName}」已更新并稳定!`);
            TavernHelper.builtin.reloadEditor(worldbookName, true);
            await new Promise(resolve => setTimeout(resolve, 400));

            const currentBindings = await TavernHelper.getCharWorldbookNames('current') || { primary: null, additional: [] };
            currentBindings.primary = worldbookName;
            await TavernHelper.rebindCharWorldbooks('current', currentBindings);
            await new Promise(resolve => setTimeout(resolve, 300));

            const newBindings = await TavernHelper.getCharWorldbookNames('current');
            if (newBindings && newBindings.primary === worldbookName) {
                toastr.success(`当前角色已和「${worldbookName}」绑定！`);
            }

            // ✨ 更新完成后立即刷新版本号
            await refreshVersionAfterUpdate();

        } catch (error) {
            toastr.error(`出错了，请查看控制台。`);
            console.error(`执行更新时发生错误:`, error);
            localStorage.removeItem('worldbookBackup');
        }
    }

    async function checkForFutureEchoes(isManualTrigger = false) {
        // debugToast('函数开始执行', 1);

        if (isManualTrigger) {
            toastr.info('正在向github发出问询，请稍候...');
        }

        try {
            // debugToast('进入 try 块', 2);
            // debugToast('准备调用 loadRemoteJson', 3);
            const updateLogs = await loadRemoteJson(
                'https://longlivecanc.github.io/god_space/update_log.json',
                []
            );
            // debugToast('loadRemoteJson 执行完毕', 4, 'success');

            if (!Array.isArray(updateLogs) || updateLogs.length === 0) {
                // debugToast('日志为空，准备退出', 5);
                if (isManualTrigger) toastr.warning('未找到有效的更新日志。');
                return;
            }
            // debugToast('日志不为空，继续执行', 6);

            const latestVersionInfo = updateLogs[updateLogs.length - 1];
            const latestVersion = latestVersionInfo.version;
            // debugToast(`获取到最新版本号: ${latestVersion}`, 7);

            const STABLE_VERSION_VAR = '__TAVERN_UPDATER_STABLE_VERSION__';
            const current_game_version = window.top[STABLE_VERSION_VAR];
            // debugToast(`获取到当前版本号: ${current_game_version}`, 8);

            if (!latestVersion || !current_game_version) {
                debugToast('版本号缺失，无法比较', 9, 'error');
                toastr.error(`版本号缺失，无法比较。最新: ${latestVersion}, 当前: ${current_game_version}`);
                return;
            }
            // debugToast('版本号齐全，准备比较', 10);

            if (compareVersions(latestVersion, current_game_version) > 0) {
                // debugToast('发现新版本！准备构建UI', 11, 'success');

                const relevantLogs = updateLogs.filter(log => compareVersions(log.version, current_game_version) > 0);

                let changelogHTML = relevantLogs.reverse().map(log => `
                    <div class="update-log-entry">
                        <h3>v${log.version} <span>(${log.date})</span></h3>
                        <ul>
                            ${log.changes.map(change => `<li>${change}</li>`).join('')}
                        </ul>
                    </div>
                `).join('');

    if (!document.getElementById('update-modal')) {
    // debugToast('未找到模态框DOM，正在创建...', 11.1);
    const modalHTML = `
    <div id="update-modal" class="online-updater-modal">
        <div class="online-updater-modal-content">
            <button class="online-updater-modal-close">×</button>
            <div class="online-updater-modal-title">发现来自未来的讯息！</div>
            <div class="online-updater-modal-description"></div>
            <div class="online-updater-modal-actions">
                <button id="cancel-update-btn" class="online-updater-control-btn">稍后</button>
                <button id="perform-update-btn" class="online-updater-control-btn online-updater-primary-btn"></button>
            </div>
        </div>
    </div>`;
    
    // ✅ 改为这样：
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML;
        const modalElement = tempDiv.firstElementChild;  // 使用 firstElementChild 而不是 firstChild
    
    
    if (modalElement) {
        document.body.appendChild(modalElement);
        
        // 现在绑定事件
        modalElement.addEventListener('click', (event) => {
            if (event.target === modalElement) hideModal('update-modal');
        });
        
        const closeBtn = modalElement.querySelector('.online-updater-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => hideModal('update-modal'));
        }
        
        const cancelBtn = modalElement.querySelector('#cancel-update-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => hideModal('update-modal'));
        }
        
        const performBtn = modalElement.querySelector('#perform-update-btn');
        if (performBtn) {
            performBtn.addEventListener('click', () => {
                hideModal('update-modal');
                showBackupConfirmation();
            });
        }
        
        // debugToast('模态框DOM创建并绑定事件成功', 11.2, 'success');
    } else {
        // debugToast('模态框创建失败：firstChild 为 null', 11.1, 'error');
        toastr.error('无法创建更新对话框');
        return;
    }
}

                const modalTitle = `发现新版本！ (当前 v${current_game_version} → 最新 v${latestVersion})`;
                document.querySelector('#perform-update-btn').textContent = `立即更新至 v${latestVersion}`;

                // debugToast('准备显示模态框', 11.3);
                showModal('update-modal', modalTitle, changelogHTML);

            } else {
                // debugToast('当前已是最新版本', 12);
                if (isManualTrigger) {
                    toastr.success(`太棒了！你的世界已是最新版本(${current_game_version})，无需更新。`);
                }
            }
            // debugToast('函数正常执行完毕', 13, 'success');

        } catch (error) {
            debugToast('进入了 catch 块！', 99, 'error');
            toastr.error(`发生严重错误: ${error.message}`);
        }
    }

    async function performRegexUpdate() {
        toastr.info('拉取远程同层代码...');

        try {
            const newContentString = await loadRemoteContent(
                'https://longlivecanc.github.io/god_space/regex_one.json',
                'text',
                null,
            );

            if (!newContentString) {
                toastr.error('未能获取到远方的法则核心，更新中止。');
                return;
            }

            const allCharacterRules = TavernHelper.getTavernRegexes({ scope: 'character' });
            const unifiedRuleIndex = allCharacterRules.findIndex(rule => rule.script_name === '统一');
            const purgeRuleIndex = allCharacterRules.findIndex(rule => rule.script_name === '去除1');

            if (unifiedRuleIndex === -1) {
                toastr.error('错误！在"角色"法则中未找到名为"统一"的基石，无法执行重塑。');
                return;
            }
            if (purgeRuleIndex === -1) {
                toastr.error('错误！在"角色"法则中未找到名为"去除1"的基石，无法执行重塑。');
                return;
            }

            const oldUnifiedRule = allCharacterRules[unifiedRuleIndex];
            const updatedUnifiedRule = {
                ...oldUnifiedRule,
                replace_string: newContentString,
            };

            const oldPurgeRuleTemplate = allCharacterRules[purgeRuleIndex];
            const updatedPurgeRule = {
                ...oldPurgeRuleTemplate,
                      find_regex: "/<(statusAnalyze|loreAnalyze|attributeAnalyze|variableAnalyze|memoryAnalyze|mapAnalyze|status_analyze|lore_analyze|attribute_analyze|variable_analyze|memory_analyze|map_analyze|dynamicAnalyze|realityCheck|moduleAnalyze|updateStatus|build|世界书条目|danmu|options|roll)>([\\s\\S]*?)<\\/\\1>|<updateMemory>([\\s\\S]*?)<\\/updateMemory>|<updateMemory>[\\s\\S]*|<variableAnalyze>[\\s\\S]*|<statusAnalyze>[\\s\\S]*|<mapAnalyze>[\\s\\S]*|<loreAnalyze>[\\s\\S]*|<attributeAnalyze>[\\s\\S]*|<memoryAnalyze>[\\s\\S]*|<moduleAnalyze>([\\s\\S]*?)<\/realityCheck>|(【✓检索执行完成】)|(【✓思考执行完成】)|(<!--[\\s\\S]*?-->)/gs", // 赋予其全新的侦测法则
     
                };

            const otherCharacterRules = allCharacterRules.filter(
                rule => rule.script_name !== '统一' && rule.script_name !== '去除1'
            );

            const newTopRules = [updatedPurgeRule, updatedUnifiedRule];
            const finalCharacterRules = [...newTopRules, ...otherCharacterRules];

            await TavernHelper.replaceTavernRegexes(finalCharacterRules, { scope: 'character' });

            toastr.success(`正则已更新"统一"与"去除1"并置于最前，其他正则已保留！`);

            // ✨ 更新完成后立即刷新版本号
            await refreshVersionAfterUpdate();

        } catch (error) {
            console.error('在重塑角色法则的过程中发生了意料之外的次元风暴:', error);
            toastr.error('更新失败了。请查看控制台中的详细记录。');
        }
    }

    function showBackupConfirmation() {
        if (!document.getElementById('backup-confirmation-modal')) {
            const confirmationModalHTML = `
            <div id="backup-confirmation-modal" class="online-updater-modal">
                <div class="online-updater-modal-content" style="max-width: 450px;">
                    <button class="online-updater-modal-close">×</button>
                    <div class="online-updater-modal-title">最后一步确认</div>
                    <div class="online-updater-modal-description">
                        <p style="color: #e0c080; font-weight: bold;">此次更新将会覆盖核心正则和世界书文件。</p>
                        <p style="color: #e0c080; font-weight: bold;">若无法正常更新，请分别使用强制更新按钮来更新。</p>
                        <p>为了保护你的心血，请确认你已经备份好了所有重要的【对原世界书的更改】。准备好了吗？</p>
                    </div>
                    <div class="online-updater-modal-actions">
                        <button id="cancel-final-update-btn" class="online-updater-control-btn">我先去备份</button>
                        <button id="confirm-final-update-btn" class="online-updater-control-btn online-updater-primary-btn">我已备份，开始更新</button>
                    </div>
                </div>
            </div>`;
          const tempDiv = document.createElement('div');
tempDiv.innerHTML = confirmationModalHTML;
 const confirmModal = tempDiv.firstElementChild;  // ✅ 改这里
if (confirmModal) {
    document.body.appendChild(confirmModal);
            const modal = document.getElementById('backup-confirmation-modal');
            modal.querySelector('.online-updater-modal-close').onclick = () => hideModal('backup-confirmation-modal');
            modal.querySelector('#cancel-final-update-btn').onclick = () => hideModal('backup-confirmation-modal');
            modal.addEventListener('click', (event) => {
                if (event.target === modal) hideModal('backup-confirmation-modal');
            });

            document.getElementById('confirm-final-update-btn').addEventListener('click', async () => {
                hideModal('backup-confirmation-modal');

                localStorage.setItem('pendingDualUpdate', 'step1_worldbook');

                toastr.info('启动第一阶段：正则更新中...');
                await performRegexUpdate();
                await new Promise(resolve => setTimeout(resolve, 1000));

                localStorage.setItem('pendingDualUpdate', 'step2_regex');
                toastr.info('启动第二阶段，世界书更新中...');
                await new Promise(resolve => setTimeout(resolve, 1000));
                await performWorldbookUpdate();

                localStorage.removeItem('worldbookBackup');
                localStorage.removeItem('pendingDualUpdate');
            });
        }
        showModal('backup-confirmation-modal');
    }
}
    // =========================================================================
    // 5. 全局API暴露与初始化
    // =========================================================================
    console.log('[Tavern Updater] 核心模块已加载，正在将更新检查函数暴露到全局...');
    if (!window.top.TavernUpdaterAPI) {
        window.top.TavernUpdaterAPI = {};
    }
    window.top.TavernUpdaterAPI.checkForUpdates = checkForFutureEchoes;

    // =========================================================================
    // 6. 自动执行初始检查
    // =========================================================================
    setTimeout(() => {
        console.log("[Tavern Updater] 延时2秒后，执行首次自动更新检查。");
        checkForFutureEchoes(false);
    }, 2000);

})();