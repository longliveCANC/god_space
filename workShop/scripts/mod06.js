(function() {
    'use strict';

    // ==========================================================================
    // 1. 常量与配置
    // ==========================================================================
    const DB_NAME = 'Mod06ThemeDB';
    const DB_VERSION = 1;
    const STORE_NAME = 'themes';

    // 需要编辑的变量列表
    const EDITABLE_VARS = [
        { var: '--primary-color', label: '主色调 (Primary)' },
        { var: '--secondary-color', label: '副色调 (Secondary)' },
        { var: '--text-color', label: '主要文本' },
        { var: '--text-secondary-color', label: '次要文本' },
        { var: '--container-bg-color', label: '容器背景' },
        { var: '--background-color', label: '次要背景' },
        { var: '--border-color', label: '边框颜色' },
        { var: '--glow-color', label: '光晕颜色' },
 
    ];

    // 预设主题
    const PRESETS = [
        
        {
            id: 'preset_parchment',
            name: '古老羊皮纸 (Parchment)',
            isPreset: true,
            colors: {
                '--primary-color': '#8b4513',       // 鞍褐色
                '--secondary-color': '#cd853f',     // 秘鲁色
                '--text-color': '#3e2723',          // 深棕色文本
                '--text-secondary-color': '#5d4037',// 浅棕色文本
                '--container-bg-color': 'rgba(245, 222, 179, 0.9)', // 小麦色背景
                '--background-color': '#d2b48c',    // 棕褐色全局背景
                '--border-color': 'rgba(139, 69, 19, 0.4)',
                '--glow-color': 'rgba(205, 133, 63, 0.3)',
                '--danger-color': '#8b0000',
                '--danger-glow-color': 'rgba(139, 0, 0, 0.3)'
            }
        },
        
        {
            id: 'preset_forest',
            name: '茂密森林 (Dense Forest)',
            isPreset: true,
            colors: {
                '--primary-color': '#50c878',       // 翡翠绿
                '--secondary-color': '#228b22',     // 森林绿
                '--text-color': '#e0f2f1',          // 极淡的青色
                '--text-secondary-color': '#a5d6a7',// 浅绿色
                '--container-bg-color': 'rgba(27, 58, 37, 0.85)', // 深绿背景
                '--background-color': '#0f2415',    // 极深绿/黑背景
                '--border-color': 'rgba(80, 200, 120, 0.3)',
                '--glow-color': 'rgba(34, 139, 34, 0.5)',
                '--danger-color': '#ff6b6b',
                '--danger-glow-color': 'rgba(255, 107, 107, 0.4)'
            }
        }
    ];

    // ==========================================================================
    // 2. CSS 样式注入 (Mod06)
    // ==========================================================================
 const style = document.createElement('style');
    style.textContent = `
        #apply-custom-theme-btn { display: none !important; }

        .mod06-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px);
            z-index: 10000; display: flex; justify-content: center; align-items: center;
            font-family: var(--base-font-family, sans-serif);
            color: var(--text-color);
        }
        .mod06-modal {
            width: 900px; height: 80vh;
            max-width: 95vw; max-height: 90vh;
            background: var(--container-bg-color);
            border: 1px solid var(--border-color);
            box-shadow: 0 0 20px var(--glow-color);
            border-radius: 8px; display: flex; flex-direction: column;
            overflow: hidden; transition: all 0.3s ease;
        }
        .mod06-header {
            padding: 15px 20px; border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
            background: rgba(0,0,0,0.2); flex-shrink: 0;
        }
        .mod06-title { font-size: 1.2em; font-weight: bold; color: var(--primary-color); text-shadow: 0 0 5px var(--glow-color); }
        .mod06-close-btn {
            background: none; border: none; color: var(--text-secondary-color);
            font-size: 1.5em; cursor: pointer; transition: color 0.2s; padding: 0 10px;
        }

        .mod06-body { display: flex; flex: 1; overflow: hidden; }

        /* 左侧列表 */
        .mod06-sidebar {
            width: 280px; border-right: 1px solid var(--border-color);
            display: flex; flex-direction: column; background: rgba(0,0,0,0.1);
            flex-shrink: 0;
        }
        .mod06-list-container { overflow-y: auto; padding: 10px; }

        /* 新增：为桌面端恢复布局 */
        #mod06-preset-list {
            flex: 0 0 auto; /* 预设列表高度由内容决定 */
            max-height: 45%; /* 防止预设过多时挤占下方空间 */
        }
        #mod06-saved-list {
            flex: 1; /* 我的主题列表占据剩余空间 */
        }

        .mod06-list-header { padding: 10px; font-size: 0.9em; color: var(--text-secondary-color); text-transform: uppercase; letter-spacing: 1px; }

        .mod06-theme-card {
            padding: 10px; margin-bottom: 8px; border: 1px solid transparent;
            background: rgba(255,255,255,0.05); border-radius: 4px; cursor: pointer;
            transition: all 0.2s; display: flex; align-items: center; justify-content: space-between;
        }
        .mod06-theme-card.active { border-color: var(--primary-color); background: rgba(0, 250, 255, 0.1); }
        .mod06-card-preview { width: 20px; height: 20px; border-radius: 50%; border: 1px solid #fff; margin-right: 10px; flex-shrink: 0; }
        .mod06-card-info { flex: 1; overflow: hidden; }
        .mod06-card-name { font-size: 0.9em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mod06-card-actions { display: flex; gap: 5px; }
        .mod06-icon-btn { background: none; border: none; color: var(--text-secondary-color); cursor: pointer; }

        /* 右侧编辑区 */
        .mod06-editor { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; }
        .mod06-editor-header { display: flex; justify-content: space-between; margin-bottom: 20px; align-items: center; flex-wrap: wrap; gap: 10px; }
        .mod06-theme-name-input {
            background: rgba(0,0,0,0.3); border: 1px solid var(--border-color);
            color: var(--primary-color); padding: 8px; font-size: 1.1em; width: 200px;
        }

        .mod06-toolbar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color); }
        .mod06-btn {
            padding: 8px 12px; border: 1px solid var(--border-color);
            background: rgba(0, 250, 255, 0.1); color: var(--text-color);
            cursor: pointer; font-size: 0.9em; display: flex; align-items: center; gap: 5px;
        }
        .mod06-btn:hover { background: var(--primary-color); color: #000; }

        .mod06-color-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;
        }
        .mod06-color-item {
            background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px;
            border: 1px solid transparent;
        }
        .mod06-label-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.9em; }
        .mod06-controls-row { display: flex; align-items: center; gap: 10px; }

        input[type="color"] { -webkit-appearance: none; border: none; width: 40px; height: 40px; padding: 0; background: none; }
        .mod06-alpha-slider { flex: 1; height: 20px; }

        .mod06-toast {
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: var(--container-bg-color); border: 1px solid var(--primary-color);
            color: var(--primary-color); padding: 10px 20px; border-radius: 20px;
            z-index: 10001; opacity: 0; transition: opacity 0.3s; pointer-events: none;
        }
        .mod06-toast.show { opacity: 1; }

        /* 手机端适配 (断点 768px) */
        @media (max-width: 768px) {
            .mod06-body { flex-direction: column; }
            .mod06-sidebar {
                width: 100%;
                height: 200px; /* 稍微增加一点高度 */
                border-right: none;
                border-bottom: 1px solid var(--border-color);
                overflow-y: auto; /* 关键修复：让侧边栏本身滚动 */
            }
            /* 关键修复：移除内部元素的滚动和flex-grow */
            .mod06-list-container {
                flex: none;
                overflow-y: visible;
            }
            .mod06-editor { padding: 10px; }
            .mod06-color-grid { grid-template-columns: 1fr; }
            .mod06-toolbar { gap: 5px; }
            .mod06-btn { flex: 1; justify-content: center; font-size: 0.8em; }
            .mod06-theme-name-input { width: 100%; }
        }

              .mod06-bg-toolbar {
            display: flex;
            gap: 10px;
            align-items: center;
            padding-top: 15px;
            margin-top: 15px;
            border-top: 1px solid var(--border-color);
            width: 100%;
            flex-wrap: wrap;
        }
        .mod06-bg-toolbar label {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.9em;
            cursor: pointer;
            color: var(--text-secondary-color);
        }
    `;
    document.head.appendChild(style);
 
    document.head.appendChild(style);

    // ==========================================================================
    // 3. 工具函数 (颜色处理)
    // ==========================================================================

    // 解析颜色字符串为 {hex, alpha}
    function parseColor(colorStr) {
        if (!colorStr) return { hex: '#000000', alpha: 1 };
        colorStr = colorStr.trim();

        if (colorStr.startsWith('#')) {
            return { hex: colorStr.substring(0, 7), alpha: 1 };
        } else if (colorStr.startsWith('rgba')) {
            const parts = colorStr.match(/[\d.]+/g);
            if (parts && parts.length >= 4) {
                const r = parseInt(parts[0]).toString(16).padStart(2, '0');
                const g = parseInt(parts[1]).toString(16).padStart(2, '0');
                const b = parseInt(parts[2]).toString(16).padStart(2, '0');
                return { hex: `#${r}${g}${b}`, alpha: parseFloat(parts[3]) };
            }
        } else if (colorStr.startsWith('rgb')) {
            const parts = colorStr.match(/[\d.]+/g);
            if (parts && parts.length >= 3) {
                const r = parseInt(parts[0]).toString(16).padStart(2, '0');
                const g = parseInt(parts[1]).toString(16).padStart(2, '0');
                const b = parseInt(parts[2]).toString(16).padStart(2, '0');
                return { hex: `#${r}${g}${b}`, alpha: 1 };
            }
        }
        return { hex: '#000000', alpha: 1 };
    }

    // 将 hex 和 alpha 组合回 rgba 字符串
    function toRgbaString(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // 反色计算
    function invertHex(hex) {
        const r = 255 - parseInt(hex.slice(1, 3), 16);
        const g = 255 - parseInt(hex.slice(3, 5), 16);
        const b = 255 - parseInt(hex.slice(5, 7), 16);
        return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
    }

    // Toast 提示
    function showToast(msg) {
        let toast = document.querySelector('.mod06-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'mod06-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
   const BG_STORAGE_KEY = 'mod06_customBackground';
    const BG_TARGET_SELECTOR = '.status-container, body'; // 优先选择 .status-container，若不存在则作用于 body

 
     function applyCustomBackground(imageUrl, showNotification = true) {
        const target = document.querySelector(BG_TARGET_SELECTOR);
        if (!target) {
            console.error('MOD06: 未找到背景目标容器。');
            return;
        }
        target.style.backgroundImage = `url('${imageUrl}')`;
        target.style.backgroundSize = 'cover';
        target.style.backgroundPosition = 'center';
        target.style.backgroundRepeat = 'no-repeat';
        target.style.setProperty('--after-opacity', '0');

        // ============================================================
        // [新增/修改] 伪造场景图效果：强制容器背景透明
        // ============================================================
        // 将容器背景设置为低透明度 (例如 0.2)，以便看清背景图
        // 你可以根据喜好调整这个 rgba 值的透明度
        document.documentElement.style.setProperty('--container-bg-color', 'rgba(0, 0, 0, 0.2)');
      document.documentElement.style.setProperty('--background-color', 'rgba(0, 0, 0, 0.2)');

        localStorage.setItem(BG_STORAGE_KEY, imageUrl);
        if (showNotification) {
            showToast('背景已设置 (容器已透明化)');
        }
    }

    /**
     * 清除自定义背景图
     */
    function clearCustomBackground() {
        const target = document.querySelector(BG_TARGET_SELECTOR);
        if (!target) return;
        target.style.backgroundImage = '';
        target.style.backgroundSize = '';
        target.style.backgroundPosition = '';
        target.style.backgroundRepeat = '';

        // ============================================================
        // [新增/修改] 恢复容器背景颜色
        // ============================================================
        try {
            // 从 localStorage 获取当前正在使用的主题颜色配置
            const savedThemeStr = localStorage.getItem('customTerminalTheme');
            if (savedThemeStr) {
                const colors = JSON.parse(savedThemeStr);
                if (colors['--container-bg-color']) {
                    // 恢复为用户设定的主题色
                    document.documentElement.style.setProperty('--container-bg-color', colors['--container-bg-color']);
                }
            } else {
                // 如果没有保存的主题，恢复到一个默认的安全值
                document.documentElement.style.setProperty('--container-bg-color', 'rgba(0, 0, 0, 0.85)');
            }
        } catch (e) {
            console.error('MOD06: 恢复背景色失败', e);
        }

        localStorage.removeItem(BG_STORAGE_KEY);
        showToast('背景已清除');
    }
    // ==========================================================================
    // 4. IndexedDB 管理
    // ==========================================================================
    const dbHelper = {
        db: null,
        init() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    }
                };
                request.onsuccess = (e) => {
                    this.db = e.target.result;
                    resolve(this.db);
                };
                request.onerror = (e) => reject(e);
            });
        },
        getAllThemes() {
            return new Promise((resolve) => {
                const tx = this.db.transaction(STORE_NAME, 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result);
            });
        },
        saveTheme(theme) {
            return new Promise((resolve) => {
                const tx = this.db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                store.put(theme);
                tx.oncomplete = () => resolve();
            });
        },
        deleteTheme(id) {
            return new Promise((resolve) => {
                const tx = this.db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                store.delete(id);
                tx.oncomplete = () => resolve();
            });
        }
    };

    // ==========================================================================
    // 5. UI 逻辑与渲染
    // ==========================================================================

    let currentEditingTheme = null; // 当前正在编辑的主题对象
    let savedThemes = []; // 从DB加载的主题

    function createModal() {
        const overlay = document.createElement('div');
        overlay.className = 'mod06-overlay';
        overlay.style.display = 'none'; // 默认隐藏

        overlay.innerHTML = `
            <div class="mod06-modal">
                <div class="mod06-header">
                    <div class="mod06-title">自定义主题</div>
                    <button class="mod06-close-btn">×</button>
                </div>
                <div class="mod06-body">
                    <div class="mod06-sidebar">
                        <div class="mod06-list-header">预设主题</div>
                       <div id="mod06-preset-list" class="mod06-list-container"></div>
                        <div class="mod06-list-header" style="border-top:1px solid var(--border-color);">我的主题</div>
                        <div id="mod06-saved-list" class="mod06-list-container"></div>
                    </div>
                    <div class="mod06-editor">
                        <div class="mod06-editor-header">
                            <input type="text" class="mod06-theme-name-input" id="mod06-theme-name" placeholder="主题名称">
                            <div style="font-size:0.8em; color:var(--text-secondary-color);">ID: <span id="mod06-theme-id"></span></div>
                        </div>
                        <div class="mod06-toolbar">
                            <button class="mod06-btn" id="mod06-btn-save">💾 保存</button>
                            <button class="mod06-btn" id="mod06-btn-new">➕ 新建</button>
                            <button class="mod06-btn" id="mod06-btn-copy">📋 复制数据</button>
                            <button class="mod06-btn" id="mod06-btn-invert">🌗 一键反色</button>
                            <button class="mod06-btn" id="mod06-btn-export">📤 导出JSON</button>
                            <button class="mod06-btn" id="mod06-btn-import">📥 导入JSON</button>
                            <input type="file" id="mod06-file-input" style="display:none" accept=".json">
                        </div>

                         <div class="mod06-bg-toolbar">
                            <button class="mod06-btn" id="mod06-btn-set-bg">🖼️ 设置背景</button>
                            <button class="mod06-btn" id="mod06-btn-clear-bg">🗑️ 清除背景</button>
                            <label>
                                <input type="checkbox" id="mod06-pixelate-bg">
                                像素化 (大图较慢)
                            </label>
                            <input type="file" id="mod06-bg-input" style="display:none" accept="image/*">
                        </div>




                        <div id="mod06-color-grid" class="mod06-color-grid"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 绑定关闭事件
        overlay.querySelector('.mod06-close-btn').onclick = () => {
            overlay.style.display = 'none';
        };

        // 点击遮罩层关闭
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.style.display = 'none';
        };

        bindToolbarEvents();
    }

    function renderThemeList() {
        const presetContainer = document.getElementById('mod06-preset-list');
        const savedContainer = document.getElementById('mod06-saved-list');
        presetContainer.innerHTML = '';
        savedContainer.innerHTML = '';

        // 渲染预设
        PRESETS.forEach(theme => {
            const card = createThemeCard(theme, true);
            presetContainer.appendChild(card);
        });

        // 渲染保存的主题
        savedThemes.forEach(theme => {
            const card = createThemeCard(theme, false);
            savedContainer.appendChild(card);
        });
    }

    function createThemeCard(theme, isPreset) {
        const div = document.createElement('div');
        div.className = 'mod06-theme-card';
        if (currentEditingTheme && currentEditingTheme.id === theme.id) {
            div.classList.add('active');
        }

        // 预览圆圈颜色
        const previewColor = theme.colors['--primary-color'] || '#fff';
        const previewBg = theme.colors['--background-color'] || '#000';

        div.innerHTML = `
            <div style="display:flex; align-items:center; width:100%">
                <div class="mod06-card-preview" style="background:${previewBg}; border-color:${previewColor}"></div>
                <div class="mod06-card-info">
                    <div class="mod06-card-name">${theme.name}</div>
                </div>
                <div class="mod06-card-actions">
                    ${!isPreset ? `<button class="mod06-icon-btn delete" title="删除">🗑️</button>` : ''}
                </div>
            </div>
        `;

        // 点击加载主题
        div.onclick = (e) => {
            // 如果点击的是删除按钮，不触发加载
            if (e.target.closest('.delete')) return;
            loadThemeToEditor(theme);
            applyTheme(theme.colors); // 立即应用
            renderThemeList(); // 更新高亮
        };

        // 删除逻辑
        if (!isPreset) {
            const delBtn = div.querySelector('.delete');
            delBtn.onclick = async () => {
                if (confirm(`确定删除主题 "${theme.name}" 吗?`)) {
                    await dbHelper.deleteTheme(theme.id);
                    savedThemes = await dbHelper.getAllThemes();
                    // 如果删除的是当前主题，重置为默认
                    if (currentEditingTheme && currentEditingTheme.id === theme.id) {
                        loadThemeToEditor(PRESETS[0]);
                    }
                    renderThemeList();
                    showToast('主题已删除');
                }
            };
        }

        return div;
    }

    function loadThemeToEditor(theme) {
        // 深拷贝以防修改原对象
        currentEditingTheme = JSON.parse(JSON.stringify(theme));

        // 如果是预设，生成一个新的ID以便保存为新主题，除非只是浏览
        // 这里逻辑：如果是预设，我们在保存时会将其视为新主题

        document.getElementById('mod06-theme-name').value = currentEditingTheme.name;
        document.getElementById('mod06-theme-id').textContent = currentEditingTheme.isPreset ? 'Preset (保存将新建)' : currentEditingTheme.id;

        const grid = document.getElementById('mod06-color-grid');
        grid.innerHTML = '';

        EDITABLE_VARS.forEach(item => {
            const colorVal = currentEditingTheme.colors[item.var] || '#000000';
            const { hex, alpha } = parseColor(colorVal);

            const el = document.createElement('div');
            el.className = 'mod06-color-item';
            el.innerHTML = `
                <div class="mod06-label-row">
                    <span>${item.label}</span>
                    <span class="mod06-alpha-val">${Math.round(alpha * 100)}%</span>
                </div>
                <div class="mod06-controls-row">
                    <input type="color" value="${hex}" data-var="${item.var}">
                    <input type="range" class="mod06-alpha-slider" min="0" max="1" step="0.01" value="${alpha}" data-var="${item.var}">
                </div>
            `;

            const colorInput = el.querySelector('input[type="color"]');
            const alphaInput = el.querySelector('input[type="range"]');
            const alphaText = el.querySelector('.mod06-alpha-val');

            const updateHandler = () => {
                const newHex = colorInput.value;
                const newAlpha = alphaInput.value;
                alphaText.textContent = Math.round(newAlpha * 100) + '%';

                const rgba = toRgbaString(newHex, newAlpha);

                // 更新内存对象
                currentEditingTheme.colors[item.var] = rgba;

                // 实时应用到页面
                document.documentElement.style.setProperty(item.var, rgba);
            };

            colorInput.addEventListener('input', updateHandler);
            alphaInput.addEventListener('input', updateHandler);

            grid.appendChild(el);
        });
    }

    function applyTheme(colors) {
        const root = document.documentElement;
        for (const [key, value] of Object.entries(colors)) {
            root.style.setProperty(key, value);
        }
        // 保存当前使用状态到 localStorage (兼容原游戏逻辑)
        localStorage.setItem('useCustomTheme', 'true');
        localStorage.setItem('customTerminalTheme', JSON.stringify(colors));
    }

    function bindToolbarEvents() {
        // 保存
        document.getElementById('mod06-btn-save').onclick = async () => {
            const name = document.getElementById('mod06-theme-name').value || '未命名主题';

            // 如果是预设或者没有ID，生成新ID
            if (currentEditingTheme.isPreset || !currentEditingTheme.id) {
                currentEditingTheme.id = 'theme_' + Date.now();
                currentEditingTheme.isPreset = false;
            }

            currentEditingTheme.name = name;

            await dbHelper.saveTheme(currentEditingTheme);
            savedThemes = await dbHelper.getAllThemes();
            renderThemeList();
            loadThemeToEditor(currentEditingTheme); // 刷新ID显示
            showToast('主题已保存!');
        };

        // 新建
        document.getElementById('mod06-btn-new').onclick = () => {
            const newTheme = JSON.parse(JSON.stringify(PRESETS[0]));
            newTheme.id = '';
            newTheme.isPreset = false;
            newTheme.name = '新主题';
            loadThemeToEditor(newTheme);
            applyTheme(newTheme.colors);
            showToast('已创建新模板');
        };

        // 复制数据
        document.getElementById('mod06-btn-copy').onclick = () => {
            const data = JSON.stringify(currentEditingTheme.colors, null, 2);
            navigator.clipboard.writeText(data).then(() => {
                showToast('颜色数据已复制到剪贴板');
            });
        };

        // 反色
        document.getElementById('mod06-btn-invert').onclick = () => {
            for (const key in currentEditingTheme.colors) {
                const { hex, alpha } = parseColor(currentEditingTheme.colors[key]);
                const invertedHex = invertHex(hex);
                currentEditingTheme.colors[key] = toRgbaString(invertedHex, alpha);
            }
            loadThemeToEditor(currentEditingTheme); // 重新渲染编辑器控件
            applyTheme(currentEditingTheme.colors); // 应用效果
            showToast('颜色已反转');
        };

        // 导出
        document.getElementById('mod06-btn-export').onclick = () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentEditingTheme));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", (currentEditingTheme.name || "theme") + ".json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        };

        // 导入
        const fileInput = document.getElementById('mod06-file-input');
        document.getElementById('mod06-btn-import').onclick = () => fileInput.click();

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const importedTheme = JSON.parse(event.target.result);
                    // 简单的格式校验
                    if (!importedTheme.colors) throw new Error('格式错误');

                    // 重置ID以作为新主题导入
                    importedTheme.id = 'theme_' + Date.now();
                    importedTheme.isPreset = false;
                    importedTheme.name = (importedTheme.name || '导入主题') + ' (Imported)';

                    await dbHelper.saveTheme(importedTheme);
                    savedThemes = await dbHelper.getAllThemes();
                    renderThemeList();
                    loadThemeToEditor(importedTheme);
                    applyTheme(importedTheme.colors);
                    showToast('导入成功!');
                } catch (err) {
                    alert('导入失败: 文件格式不正确');
                    console.error(err);
                }
                fileInput.value = ''; // 重置input
            };
            reader.readAsText(file);
        };

         // START: 添加的代码
        // --- 背景设置 ---
        const bgFileInput = document.getElementById('mod06-bg-input');
        const setBgBtn = document.getElementById('mod06-btn-set-bg');
        const clearBgBtn = document.getElementById('mod06-btn-clear-bg');
        const pixelateCheckbox = document.getElementById('mod06-pixelate-bg');

        setBgBtn.onclick = () => bgFileInput.click();
        clearBgBtn.onclick = clearCustomBackground;

        bgFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                const originalUrl = event.target.result;
                try {
                    if (pixelateCheckbox.checked) {
                        showToast('正在像素化背景...');
                        // 调用您提供的 createPixelatedImage 函数
                        const pixelatedUrl = await createPixelatedImage(originalUrl, 8); // 像素大小设为8，可调整
                        applyCustomBackground(pixelatedUrl);
                    } else {
                        applyCustomBackground(originalUrl);
                    }
                } catch (err) {
                    alert('背景处理失败: ' + err);
                    console.error(err);
                }
                bgFileInput.value = ''; // 重置input以便再次选择相同文件
            };
            reader.readAsDataURL(file);
        };
        // END: 添加的代码
    }

    // ==========================================================================
    // 6. 初始化与劫持
    // ==========================================================================

     async function init() {
        // 1. 初始化DB
        await dbHelper.init();
        savedThemes = await dbHelper.getAllThemes();

        // 2. 创建UI结构
        createModal();

        // START: 添加的代码
        // 2.5. 应用持久化的背景
        const savedBg = localStorage.getItem(BG_STORAGE_KEY);
        if (savedBg) {
            applyCustomBackground(savedBg, false); // false 表示不在加载时显示提示
        }
        // END: 添加的代码

        // 3. 劫持按钮
        const oldBtn = document.getElementById('edit-custom-theme-btn');
        if (oldBtn) {
            // 克隆节点以移除原有事件监听器
            const newBtn = oldBtn.cloneNode(true);
            oldBtn.parentNode.replaceChild(newBtn, oldBtn);

            newBtn.addEventListener('click', () => {
                const overlay = document.querySelector('.mod06-overlay');
                overlay.style.display = 'flex';

                // 打开时，尝试加载当前正在使用的主题
                // 优先从 localStorage 读取当前生效的自定义颜色
                try {
                    const currentUsed = JSON.parse(localStorage.getItem('customTerminalTheme'));
                    if (currentUsed) {
                        // 构造一个临时对象用于编辑
                        const tempTheme = {
                            id: '',
                            name: '当前应用的主题',
                            isPreset: false,
                            colors: currentUsed
                        };
                        loadThemeToEditor(tempTheme);
                    } else {
                        loadThemeToEditor(PRESETS[0]);
                    }
                } catch (e) {
                    loadThemeToEditor(PRESETS[0]);
                }

                renderThemeList();
            });

            console.log('MOD06: 主题编辑器已注入。');
                      const applyBtn = document.getElementById('apply-custom-theme-btn');
            if (applyBtn) applyBtn.style.display = 'none';
        } else {
            console.error('MOD06: 未找到 #edit-custom-theme-btn 按钮。');
        }
    }

    // 执行初始化
    init();

})();
