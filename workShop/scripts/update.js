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
         #updater-settings-trigger {
            position: fixed;
            top: 10px;
            left: -35px; /* 隐藏大部分 */
            width: 50px;
            height: 40px;
            background-color: rgba(26, 26, 26, 0.8);
            border: 1px solid #c0a060;
            border-left: none;
            border-radius: 0 8px 8px 0;
            z-index: 2000;
            cursor: pointer;
            transition: left 0.3s ease, background-color 0.3s;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 8px;
            color: #c0a060;
            font-size: 20px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
        }
        #updater-settings-trigger:hover {
            left: 0; /* 悬浮显示 */
            background-color: rgba(26, 26, 26, 1);
        }

        /* 设置面板内部布局 */
        .updater-panel-section { margin-bottom: 20px; border: 1px solid #333; padding: 15px; border-radius: 5px; background: rgba(0,0,0,0.2); }
        .updater-panel-title { font-weight: bold; color: #e0c080; margin-bottom: 10px; display: block; }
        .updater-btn-group { display: flex; gap: 10px; flex-wrap: wrap; }
        .updater-small-btn { padding: 5px 10px; font-size: 0.9em; }
        .updater-danger-btn { border-color: #a33; color: #faa; background: rgba(50,0,0,0.3); }
        .updater-danger-btn:hover { background: rgba(80,0,0,0.5); }

        /* 历史记录列表 */
        .history-list-container { max-height: 300px; overflow-y: auto; margin-top: 10px; }
        .history-download-btn {
            font-size: 0.7em;
            padding: 2px 8px;
            border: 1px solid #555;
            border-radius: 4px;
            background: #222;
            color: #aaa;
            text-decoration: none;
            margin-left: 10px;
            cursor: pointer;
        }
        .history-download-btn:hover { background: #444; color: #fff; }
        .pagination-controls { margin-top: 10px; text-align: center; display: flex; justify-content: center; gap: 10px; align-items: center; }
        .page-btn { background: #333; border: 1px solid #555; color: #ddd; padding: 2px 8px; cursor: pointer; border-radius: 3px; }
        .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
   
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // =========================================================================
    // 2. 辅助函数
    // =========================================================================
    async function downloadFile(url, filename) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                // 如果是404，说明该版本没有对应的历史文件
                if (response.status === 404) {
                    throw new Error("该版本未归档或文件不存在");
                }
                throw new Error(`网络响应错误: ${response.statusText}`);
            }

            const blob = await response.blob(); // 将文件内容转成二进制数据
            const blobUrl = window.URL.createObjectURL(blob); // 创建一个临时的本地链接

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;

            document.body.appendChild(a);
            a.click(); // 模拟点击这个隐藏的链接

            document.body.removeChild(a); // 清理
            window.URL.revokeObjectURL(blobUrl); // 释放内存

            toastr.success(`已开始下载: ${filename}`);
        } catch (error) {
            console.error('Download failed:', error);
            toastr.error(`下载失败: ${error.message}`);
        }
    }
    
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
    // 2.5 UI 组件与面板逻辑
    // =========================================================================

  function createFloatingButton() {
        if (document.getElementById('updater-settings-trigger')) return;
        const btn = document.createElement('div');
        btn.id = 'updater-settings-trigger';
        btn.innerHTML = '⚙️';
        btn.title = "更新设置与历史";
        btn.onclick = openSettingsPanel;
        document.body.appendChild(btn);
    }

    // 辅助：刷新面板上的版本显示
    function updatePanelVersionUI() {
        const el = document.getElementById('updater-current-ver');
        if (!el) return;

        const STABLE_VERSION_VAR = '__TAVERN_UPDATER_STABLE_VERSION__';
        const currentVer = window.top[STABLE_VERSION_VAR];

        if (currentVer) {
            el.textContent = currentVer;
            el.style.color = '#fff';
        } else {
            el.textContent = '未知 (或需刷新页面)';
            el.style.color = '#888';
        }
    }

    // 打开设置面板
    async function openSettingsPanel() {
        if (!document.getElementById('updater-settings-modal')) {
            createSettingsModal();
        }

        // 1. 打开时先刷新一次版本显示
        updatePanelVersionUI();

        // 2. 默认加载第一页历史记录
        await loadAndRenderHistory(1);

        showModal('updater-settings-modal');
    }

    // 创建设置面板 HTML
    function createSettingsModal() {
        const html = `
        <div id="updater-settings-modal" class="online-updater-modal">
            <div class="online-updater-modal-content">
                <button class="online-updater-modal-close">×</button>
                <div class="online-updater-modal-title">更新管理器</div>

                <!-- 状态与操作区 -->
                <div class="updater-panel-section">
                    <span class="updater-panel-title">当前状态</span>
                    <p>当前版本: <span id="updater-current-ver" style="color: #fff;">检测中...</span></p>
                    <div class="updater-btn-group" style="margin-top: 10px;">
                        <button id="btn-check-update" class="online-updater-control-btn updater-small-btn">检查更新</button>
                        <button id="btn-force-wb" class="online-updater-control-btn updater-small-btn updater-danger-btn">强制更新世界书</button>
                        <button id="btn-force-regex" class="online-updater-control-btn updater-small-btn updater-danger-btn">强制更新正则</button>
                    </div>
                </div>

                <!-- 历史记录区 -->
                <div class="updater-panel-section">
                    <span class="updater-panel-title">更新历史与下载</span>
                    <div id="history-list-container" class="history-list-container">
                        <div style="text-align:center; padding: 20px;">加载中...</div>
                    </div>
                    <div class="pagination-controls">
                        <button id="hist-prev-btn" class="page-btn"><</button>
                        <span id="hist-page-info">1 / 1</span>
                        <button id="hist-next-btn" class="page-btn">></button>
                    </div>
                </div>
            </div>
        </div>`;

        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div.firstElementChild);

        const modal = document.getElementById('updater-settings-modal');

        // 绑定关闭事件
        modal.addEventListener('click', e => { if(e.target === modal) hideModal('updater-settings-modal'); });
        modal.querySelector('.online-updater-modal-close').onclick = () => hideModal('updater-settings-modal');

        // 绑定操作按钮

        // 1. 检查更新
        modal.querySelector('#btn-check-update').onclick = () => {
            hideModal('updater-settings-modal');
            checkForFutureEchoes(true);
        };

        // 2. 强制更新世界书
        modal.querySelector('#btn-force-wb').onclick = async (e) => {
            if(confirm('确定要强制覆盖世界书吗？请确保已备份重要修改。')) {
                const btn = e.target;
                const originalText = btn.textContent;
                btn.textContent = "更新中...";
                btn.disabled = true;
                btn.style.opacity = "0.5";

                try {
                    await performWorldbookUpdate();

                    // ✨ 关键：更新后重新抓取版本号并刷新UI
                    await refreshVersionAfterUpdate();
                    updatePanelVersionUI();

                    toastr.success('世界书强制更新完成，版本已刷新');
                } catch (err) {
                    toastr.error('更新失败: ' + err.message);
                } finally {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.opacity = "1";
                }
            }
        };

        // 3. 强制更新正则
        modal.querySelector('#btn-force-regex').onclick = async (e) => {
            if(confirm('确定要强制覆盖正则脚本吗？')) {
                const btn = e.target;
                const originalText = btn.textContent;
                btn.textContent = "更新中...";
                btn.disabled = true;
                btn.style.opacity = "0.5";

                try {
                    await performRegexUpdate();

                    // ✨ 关键：更新后重新抓取版本号并刷新UI
                    await refreshVersionAfterUpdate();
                    updatePanelVersionUI();

                    toastr.success('正则强制更新完成，版本已刷新');
                } catch (err) {
                    toastr.error('更新失败: ' + err.message);
                } finally {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.opacity = "1";
                }
            }
        };
    }

    // 历史记录缓存
    let cachedHistory = null;
    const ITEMS_PER_PAGE = 10;

    // 加载并渲染历史记录
  async function loadAndRenderHistory(page = 1) {
        const container = document.getElementById('history-list-container');
        const prevBtn = document.getElementById('hist-prev-btn');
        const nextBtn = document.getElementById('hist-next-btn');
        const pageInfo = document.getElementById('hist-page-info');

        // 1. 如果没有缓存，先加载数据
        if (!cachedHistory) {
            container.innerHTML = '<div style="text-align:center; padding: 20px;">正在获取版本列表...</div>';
            try {
                // 并行加载新旧日志
                const [recentLogs, oldLogs] = await Promise.all([
                    loadRemoteJson('https://longlivecanc.github.io/god_space/update_log.json'),
                    loadRemoteJson('https://longlivecanc.github.io/god_space/draft/历史更新.json')
                ]);

                let allLogs = [];
                if (Array.isArray(recentLogs)) allLogs = allLogs.concat(recentLogs);
                if (Array.isArray(oldLogs)) allLogs = allLogs.concat(oldLogs);

                // 去重 (根据版本号) 并排序 (新版本在前)
                const seenVersions = new Set();
                cachedHistory = allLogs.filter(item => {
                    if (seenVersions.has(item.version)) return false;
                    seenVersions.add(item.version);
                    return true;
                }).sort((a, b) => compareVersions(b.version, a.version)); // 降序

            } catch (e) {
                container.innerHTML = `<div style="color: #faa; text-align:center;">加载历史记录失败: ${e.message}</div>`;
                return;
            }
        }

        // 2. 分页计算
        const totalPages = Math.ceil(cachedHistory.length / ITEMS_PER_PAGE);
        if (page < 1) page = 1;
        if (page > totalPages && totalPages > 0) page = totalPages;

        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageItems = cachedHistory.slice(start, end);

        // 3. 渲染列表 HTML
        let html = '';
        if (pageItems.length === 0) {
            html = '<div style="text-align:center; padding:20px; color:#888;">暂无历史记录</div>';
        } else {
            for (const log of pageItems) {
                // 构建下载链接和文件名
                const downloadUrl = `https://longlivecanc.github.io/god_space/draft/历史版本/${log.version}.json`;
                const fileName = `GodSpace_v${log.version}.json`;

                html += `
                    <div class="update-log-entry" style="margin-bottom: 10px; padding-bottom: 10px;">
                        <h3 style="font-size: 1.1em;">
                            <span>v${log.version} <span style="font-size:0.8em; color:#888;">(${log.date})</span></span>
                            <button class="history-download-btn"
                                    data-url="${downloadUrl}"
                                    data-filename="${fileName}">
                                下载该版本的JSON卡
                            </button>
                        </h3>
                        <ul style="margin-top: 5px; font-size: 0.9em; color: #ccc;">
                            ${log.changes.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
        }
        container.innerHTML = html;

        // 4. 绑定下载按钮事件 (使用新的 downloadFile)
        container.querySelectorAll('.history-download-btn').forEach(btn => {
            btn.onclick = async (e) => {
                const targetBtn = e.target;
                const url = targetBtn.dataset.url;
                const filename = targetBtn.dataset.filename;

                // 防止重复点击
                if (targetBtn.disabled) return;

                const originalText = targetBtn.textContent;
                targetBtn.textContent = '下载中...';
                targetBtn.disabled = true;
                targetBtn.style.opacity = '0.7';
                targetBtn.style.cursor = 'wait';

                await downloadFile(url, filename);

                // 恢复按钮状态
                targetBtn.textContent = originalText;
                targetBtn.disabled = false;
                targetBtn.style.opacity = '1';
                targetBtn.style.cursor = 'pointer';
            };
        });

        // 5. 更新分页控件状态
        pageInfo.textContent = `${page} / ${totalPages || 1}`;

        // 解绑旧事件防止内存泄漏 (虽然 innerHTML 重写会清除，但保持好习惯)
        prevBtn.onclick = null;
        nextBtn.onclick = null;

        prevBtn.onclick = () => loadAndRenderHistory(page - 1);
        nextBtn.onclick = () => loadAndRenderHistory(page + 1);

        prevBtn.disabled = page <= 1;
        nextBtn.disabled = page >= totalPages;
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
                           
                            <li>1. 合并更新世界书 (保留本地 ID: 30, 32)</li>
                              <li>2. 等待 2 秒缓冲</li>
                     <li>3. 更新正则脚本</li>
                          
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
                    await performWorldbookUpdate();
                    
                    toastr.info('世界书更新完毕，等待 2 秒...');
                    await new Promise(r => setTimeout(r, 2000));
                    await performRegexUpdate();
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
        // ✨ 初始化悬浮按钮
        createFloatingButton();

        console.log("[Tavern Updater] 自动检查更新...");
        checkForFutureEchoes(false);
    }, 2000);

})();
