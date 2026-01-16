// updater.js
(function() {
    'use strict';

    // 确保不会重复执行
    if (window.isTavernOnlineUpdaterLoaded) {
        return;
    }
    window.isTavernOnlineUpdaterLoaded = true;

    console.log('Tavern Online Updater: 核心模块开始执行...');

    // =========================================================================
    // 1. 注入CSS样式 (黑金主题)
    // =========================================================================
    const styles = `
        /* 模态框基础样式 */
        .online-updater-modal {
            display: none;
            position: fixed;
            z-index: 1050;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.7);
            -webkit-backdrop-filter: blur(5px);
            backdrop-filter: blur(5px);
        }
        .online-updater-modal-content {
            background-color: #1a1a1a;
            color: #e0e0e0;
            margin: 10% auto;
            padding: 25px 30px;
            border: 1px solid #c0a060; /* 金色边框 */
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
            position: relative;
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
            color: #c0a060; /* 金色悬浮 */
            text-decoration: none;
        }
        .online-updater-modal-title {
            font-size: 1.5em;
            color: #e0c080; /* 淡金色标题 */
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
        /* 按钮样式 */
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
            background-color: #c0a060; /* 金色主按钮 */
            color: #1a1a1a;
            border-color: #c0a060;
        }
        .online-updater-primary-btn:hover {
            background-color: #d4b070;
            border-color: #d4b070;
        }
        /* 更新日志条目 */
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
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // =========================================================================
    // 2. 辅助函数 (模态框控制等)
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
        modal.style.display = 'block';
    }

    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    }

    // 简化的远程加载函数，需要根据实际情况调整
 async function loadRemoteJson(url, fallbackData = {}) {
    try {
        console.log('开始加载映射...',url);
           const cacheBustingUrl = `${url}?v=${new Date().getTime()}`;
        // const cacheBustingUrl = `${url}`;
        console.log(`NOVA V9.5: 正在使用“破除缓存”模式请求 -> ${cacheBustingUrl}`);
    


               const response = await fetch(cacheBustingUrl);
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
        }
        
        let jsonText = await response.text();
        console.log(`获取到JSON文本，长度: ${jsonText.length}字符`);
        
        // 首次尝试直接解析
        try {
            const data = JSON.parse(jsonText);
            console.log('JSON解析成功！');
            return data;
        } catch (parseError) {
            console.warn('直接解析失败，尝试清理JSON...', parseError.message);
            
            // 诊断错误
            diagnoseJSONError(jsonText, parseError);
            
            // 尝试清理和修复
            const sanitizedJSON = sanitizeJSON(jsonText);
            
            if (validateJSON(sanitizedJSON)) {
                console.log('JSON清理成功，重新解析...');
                const data = JSON.parse(sanitizedJSON);
                console.log('清理后的JSON解析成功！');
                return data;
            } else {
                throw new Error('JSON清理后仍然无效');
            }
        }
        
    } catch (error) {
        console.error('加载映射失败:', error.message);
        
        console.log('使用fallback数据');
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

    // 版本比较函数
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
        // 这是一个模拟函数，实际可能需要更复杂的逻辑来确认Tavern已完成内部处理
        console.log(`Waiting for world book "${worldbookName}" to settle...`);
        return new Promise(resolve => setTimeout(resolve, 500));
    }


    // =========================================================================
    // 3. 核心业务逻辑函数 (您提供的代码)
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
                // checkWorldbookBinding(worldbookName); // 假设此函数存在
            }

        } catch (error) {
            toastr.error(`出错了，请查看控制台。`);
            console.error(`执行更新时发生错误:`, error);
            localStorage.removeItem('worldbookBackup');
        }
    }

    async function checkForFutureEchoes(isManualTrigger = false) {
        if (isManualTrigger) {
            toastr.info('正在向github发出问询，请稍候...');
        }

        try {
            const updateLogs = await loadRemoteJson(
                'https://longlivecanc.github.io/god_space/update_log.json',
                []
            );

            if (!Array.isArray(updateLogs) || updateLogs.length === 0) {
                if (isManualTrigger) toastr.warning('未找到有效的更新日志。');
                return;
            }

            const latestVersionInfo = updateLogs[updateLogs.length - 1];
            const latestVersion = latestVersionInfo.version;
            const current_game_version = window.current_game_version; // 从window获取

            if (compareVersions(latestVersion, current_game_version) > 0) {
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
                    document.body.insertAdjacentHTML('beforeend', modalHTML);

                    const updateModalElement = document.getElementById('update-modal');
                    updateModalElement.addEventListener('click', (event) => {
                        if (event.target === updateModalElement) hideModal('update-modal');
                    });
                    document.querySelector('#update-modal .online-updater-modal-close').addEventListener('click', () => hideModal('update-modal'));
                    document.getElementById('cancel-update-btn').addEventListener('click', () => hideModal('update-modal'));
                    document.getElementById('perform-update-btn').addEventListener('click', () => {
                        hideModal('update-modal');
                        showBackupConfirmation();
                    });
                }

                const modalTitle = `发现新版本！ (当前 v${current_game_version} → 最新 v${latestVersion})`;
                document.querySelector('#perform-update-btn').textContent = `立即更新至 v${latestVersion}`;
                showModal('update-modal', modalTitle, changelogHTML);

            } else {
                if (isManualTrigger) {
                    toastr.success(`太棒了！你的世界已是最新版本(${current_game_version})，无需更新。`);
                }
            }

        } catch (error) {
            console.error('检查更新时出错:', error);
            if (isManualTrigger) {
                toastr.error('网络有问题？检查更新出错了。');
            }
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
                toastr.error('错误！在“角色”法则中未找到名为“统一”的基石，无法执行重塑。');
                return;
            }
            if (purgeRuleIndex === -1) {
                toastr.error('错误！在“角色”法则中未找到名为“去除1”的基石，无法执行重塑。');
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
                find_regex: "/<(statusAnalyze|loreAnalyze|attributeAnalyze|variableAnalyze|memoryAnalyze|mapAnalyze|status_analyze|lore_analyze|attribute_analyze|variable_analyze|memory_analyze|map_analyze|dynamicAnalyze|realityCheck|moduleAnalyze|updateStatus|build|世界书条目|danmu|options|roll)>([\\s\\S]*?)<\\/\\1>|<updateMemory>([\\s\\S]*?)<\\/updateMemory>|<updateMemory>[\\s\\S]*|<variableAnalyze>[\\s\\S]*|<statusAnalyze>[\\s\\S]*|<mapAnalyze>[\\s\\S]*|<loreAnalyze>[\\s\\S]*|<attributeAnalyze>[\\s\\S]*|<memoryAnalyze>[\\s\\S]*|<moduleAnalyze>([\\s\\S]*?)<\/realityCheck>|(【✓检索执行完成】)|(【✓思考执行完成】)|()/gs",
            };

            const otherCharacterRules = allCharacterRules.filter(
                rule => rule.script_name !== '统一' && rule.script_name !== '去除1'
            );

            const newTopRules = [updatedPurgeRule, updatedUnifiedRule];
            const finalCharacterRules = [...newTopRules, ...otherCharacterRules];

            await TavernHelper.replaceTavernRegexes(finalCharacterRules, { scope: 'character' });

            toastr.success(`正则已更新“统一”与“去除1”并置于最前，其他正则已保留！`);

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
            document.body.insertAdjacentHTML('beforeend', confirmationModalHTML);

            const modal = document.getElementById('backup-confirmation-modal');
            modal.querySelector('.online-updater-modal-close').onclick = () => hideModal('backup-confirmation-modal');
            modal.querySelector('#cancel-final-update-btn').onclick = () => hideModal('backup-confirmation-modal');
            modal.addEventListener('click', (event) => {
                if (event.target === modal) hideModal('backup-confirmation-modal');
            });

            document.getElementById('confirm-final-update-btn').addEventListener('click', async () => {
                hideModal('backup-confirmation-modal');

                localStorage.setItem('pendingDualUpdate', 'step1_worldbook');

                toastr.info('启动第一阶段：世界书重塑中...');
                await performWorldbookUpdate();

                await new Promise(resolve => setTimeout(resolve, 1000));

                localStorage.setItem('pendingDualUpdate', 'step2_regex');
                toastr.info('世界书完全重塑完成！启动正则更新...');
                await new Promise(resolve => setTimeout(resolve, 1000));
                await performRegexUpdate();

                localStorage.removeItem('worldbookBackup');
                localStorage.removeItem('pendingDualUpdate');
            });
        }
        showModal('backup-confirmation-modal');
    }

    // =========================================================================
    // 4. 事件绑定与初始化
    // =========================================================================

 
    // =========================================================================
    // 5. 自动执行初始检查
    // =========================================================================
   console.log('[Tavern Updater] 核心模块已加载，正在将更新检查函数暴露到全局...');
    // 将检查函数附加到顶级窗口的 window 对象上，使其可以被其他脚本调用
    // 我们把它放在一个命名空间下，避免污染全局作用域
    if (!window.top.TavernUpdaterAPI) {
        window.top.TavernUpdaterAPI = {};
    }
    window.top.TavernUpdaterAPI.checkForUpdates = checkForFutureEchoes;

    // =========================================================================
    // 5. 自动执行初始检查 (这部分保持不变)
    // =========================================================================
    setTimeout(() => {
        console.log("[Tavern Updater] 延时2秒后，执行首次自动更新检查。");
        checkForFutureEchoes(false);
    }, 2000);

})();
