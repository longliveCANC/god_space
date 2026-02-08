(async function() {
    try {
        // ==================== 样式注入 ====================
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .mod05-bookmark-config-gear {
                position: absolute;
                top: 10px;
                left: 10px;
                width: 30px;
                height: 30px;
                cursor: pointer;
                opacity: 0.7;
                transition: all 0.3s ease;
                z-index: 10;
            }
            
            .mod05-bookmark-config-gear:hover {
                opacity: 1;
                transform: rotate(90deg);
            }
            
            .mod05-bookmark-config-gear svg {
                width: 100%;
                height: 100%;
                fill: var(--primary-color);
                filter: drop-shadow(0 0 5px var(--glow-color));
            }
            
            .mod05-bookmark-config-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            
            .mod05-bookmark-config-modal.mod05-active {
                display: flex;
            }
            
            .mod05-bookmark-config-container {
                background: var(--container-bg-color);
                border: 2px solid var(--border-color);
                border-radius: 15px;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                padding: 30px;
                box-shadow: 0 0 30px var(--glow-color);
                color: var(--text-color);
            }
            
            .mod05-bookmark-config-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid var(--border-color);
            }
            
            .mod05-bookmark-config-title {
                font-size: 24px;
                font-weight: bold;
                color: var(--primary-color);
                text-shadow: 0 0 10px var(--glow-color);
            }
            
            .mod05-bookmark-config-close {
                background: none;
                border: none;
                font-size: 30px;
                color: var(--text-color);
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            
            .mod05-bookmark-config-close:hover {
                opacity: 1;
            }
            
            .mod05-bookmark-config-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .mod05-config-form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .mod05-config-form-label {
                font-size: 14px;
                color: var(--primary-color);
                font-weight: bold;
            }
            
            .mod05-config-form-input,
            .mod05-config-form-select,
            .mod05-config-form-textarea {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 10px 15px;
                color: var(--text-color);
                font-size: 14px;
                transition: all 0.3s;
            }
            
            .mod05-config-form-input:focus,
            .mod05-config-form-select:focus,
            .mod05-config-form-textarea:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 10px var(--glow-color);
            }
            
            .mod05-config-form-textarea {
                min-height: 100px;
                resize: vertical;
                font-family: 'Courier New', monospace;
            }
            
            .mod05-config-type-selector {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .mod05-config-type-btn {
                padding: 8px 16px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                color: var(--text-secondary-color);
                cursor: pointer;
                transition: all 0.3s;
                font-size: 14px;
            }
            
            .mod05-config-type-btn:hover {
                border-color: var(--primary-color);
                color: var(--primary-color);
            }
            
            .mod05-config-type-btn.mod05-active {
                background: var(--primary-color);
                color: var(--background-color);
                border-color: var(--primary-color);
                box-shadow: 0 0 10px var(--glow-color);
            }
            
            .mod05-config-custom-input-group {
                display: none;
                margin-top: 10px;
            }
            
            .mod05-config-custom-input-group.mod05-active {
                display: block;
            }
            
            .mod05-config-sub-category-group {
                transition: all 0.3s ease;
            }
            
            .mod05-config-sub-category-group.mod05-hidden {
                display: none;
            }
            
            .mod05-config-generate-btn {
                padding: 12px 24px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                border: none;
                border-radius: 10px;
                color: var(--background-color);
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                margin-top: 10px;
            }
            
            .mod05-config-generate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px var(--glow-color);
            }
            
            .mod05-config-generate-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
            
            .mod05-config-worldbook-btn {
                padding: 12px 24px;
                background: linear-gradient(135deg, #10b981, #059669);
                border: none;
                border-radius: 10px;
                color: white;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                margin-top: 10px;
            }
            
            .mod05-config-worldbook-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(16, 185, 129, 0.5);
            }
            
            .mod05-config-worldbook-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
            
            .mod05-config-output-section {
                display: none;
                margin-top: 25px;
                padding-top: 25px;
                border-top: 2px solid var(--border-color);
            }
            
            .mod05-config-output-section.mod05-active {
                display: block;
            }
            
            .mod05-config-output-group {
                margin-bottom: 20px;
            }
            
            .mod05-config-output-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .mod05-config-output-title {
                font-size: 16px;
                color: var(--secondary-color);
                font-weight: bold;
            }
            
            .mod05-config-copy-btn {
                padding: 6px 12px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                color: var(--primary-color);
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .mod05-config-copy-btn:hover {
                background: var(--primary-color);
                color: var(--background-color);
            }
            
            .mod05-config-copy-btn.mod05-copied {
                background: #4ade80;
                color: white;
                border-color: #4ade80;
            }
            
            .mod05-config-output-content {
                background: rgba(0, 0, 0, 0.5);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 15px;
                color: var(--text-color);
                font-family: 'Courier New', monospace;
                font-size: 12px;
                white-space: pre-wrap;
                word-break: break-all;
                max-height: 300px;
                overflow-y: auto;
            }
            
            .mod05-config-hint {
                font-size: 12px;
                color: var(--text-secondary-color);
                margin-top: 5px;
                font-style: italic;
            }
            
            .mod05-config-buttons-row {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
            
            .mod05-config-buttons-row button {
                flex: 1;
            }
        `;
        document.head.appendChild(styleElement);

        // ==================== 添加齿轮图标 ====================
        const bookLeftPage = document.querySelector('.book-left-page');
        if (!bookLeftPage) {
            console.error('找不到 .book-left-page 元素');
            return;
        }

        const gearIcon = document.createElement('div');
        gearIcon.className = 'mod05-bookmark-config-gear';
        gearIcon.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
            </svg>
        `;
        bookLeftPage.style.position = 'relative';
        bookLeftPage.appendChild(gearIcon);

        // ==================== 创建配置界面 ====================
        const configModal = document.createElement('div');
        configModal.className = 'mod05-bookmark-config-modal';
        configModal.innerHTML = `
            <div class="mod05-bookmark-config-container">
                <div class="mod05-bookmark-config-header">
                    <div class="mod05-bookmark-config-title">书签配置生成器</div>
                    <button class="mod05-bookmark-config-close">×</button>
                </div>
                
                <div class="mod05-bookmark-config-form">
                    <div class="mod05-config-form-group">
                        <label class="mod05-config-form-label">标签显示文字 *</label>
                        <input type="text" class="mod05-config-form-input" id="mod05-bookmark-text" placeholder="例如：魔法系统">
                        <div class="mod05-config-hint">这是用户在界面上看到的标签名称</div>
                    </div>
                    
                    <div class="mod05-config-form-group">
                        <label class="mod05-config-form-label">类别选择 *</label>
                        <div class="mod05-config-type-selector">
                            <button class="mod05-config-type-btn" data-type="global">全局 (global_)</button>
                            <button class="mod05-config-type-btn" data-type="world">世界 (world_)</button>
                            <button class="mod05-config-type-btn" data-type="custom">自定义</button>
                        </div>
                        <div class="mod05-config-custom-input-group">
                            <input type="text" class="mod05-config-form-input" id="mod05-custom-category" placeholder="输入自定义类别名称（英文）">
                        </div>
                        <div class="mod05-config-hint">全局数据所有世界共享，世界数据仅当前世界可见</div>
                    </div>
                    
                    <div class="mod05-config-form-group mod05-config-sub-category-group">
                        <label class="mod05-config-form-label">子类别名称</label>
                        <input type="text" class="mod05-config-form-input" id="mod05-sub-category" placeholder="例如：magic_system">
                        <div class="mod05-config-hint">留空则使用标签文字的拼音，建议使用英文或拼音</div>
                    </div>
                    
                    <div class="mod05-config-form-group">
                        <label class="mod05-config-form-label">插入位置（数字）</label>
                        <input type="number" class="mod05-config-form-input" id="mod05-bookmark-position" placeholder="留空默认为0（最前面）" min="0">
                        <div class="mod05-config-hint">数字越小越靠前，相同位置按A-Z排序</div>
                    </div>
                    
                    <div class="mod05-config-form-group">
                        <label class="mod05-config-form-label">描述 (desc)若异步，则正文层和变量层都发送</label>
                        <textarea class="mod05-config-form-textarea" id="mod05-bookmark-desc" placeholder="描述这个数据的用途，例如：出现过的全部设定信息/世界观信息/势力信息等+出现的陌生名词+敌怪信息+剧情伏笔"></textarea>
                    </div>
                    
                    <div class="mod05-config-form-group">
                        <label class="mod05-config-form-label">更新规则 (update_rule)若异步，则只在异步层发送</label>
                        <textarea class="mod05-config-form-textarea" id="mod05-bookmark-update-rule" placeholder="描述其更新规则/更新格式,可为空,空则按照默认规则更新"></textarea>
                    </div>
                    
                    <div class="mod05-config-buttons-row">
                        <button class="mod05-config-generate-btn">生成配置</button>
                        <button class="mod05-config-worldbook-btn">一键生成世界书并绑定全局</button>
                    </div>
                </div>
                
                <div class="mod05-config-output-section">
                    <div class="mod05-config-output-group">
                        <div class="mod05-config-output-header">
                            <div class="mod05-config-output-title">配置文本 (需要条目名称是[bookmarkconfig])</div>
                            <button class="mod05-config-copy-btn" data-target="config-json">复制</button>
                        </div>
                        <div class="mod05-config-output-content" id="mod05-output-config-json"></div>
                    </div>
                    
                    <div class="mod05-config-output-group">
                        <div class="mod05-config-output-header">
                            <div class="mod05-config-output-title">提示词文本 (EJS)</div>
                            <button class="mod05-config-copy-btn" data-target="prompt-ejs">复制</button>
                        </div>
                        <div class="mod05-config-output-content" id="mod05-output-prompt-ejs"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(configModal);

        // ==================== 获取当前主题 ====================
        const currentTheme = {
            '--primary-color': window.GameAPI?.getThemeVar('--primary-color') || '#00faff',
            '--secondary-color': window.GameAPI?.getThemeVar('--secondary-color') || '#7affff',
            '--text-color': window.GameAPI?.getThemeVar('--text-color') || '#e6f1ff',
            '--text-secondary-color': window.GameAPI?.getThemeVar('--text-secondary-color') || '#a8c0e1',
            '--container-bg-color': window.GameAPI?.getThemeVar('--container-bg-color') || 'rgba(10, 25, 47, 0.85)',
            '--border-color': window.GameAPI?.getThemeVar('--border-color') || 'rgba(0, 250, 255, 0.3)',
            '--glow-color': window.GameAPI?.getThemeVar('--glow-color') || 'rgba(0, 250, 255, 0.5)',
            '--background-color': window.GameAPI?.getThemeVar('--background-color') || '#0a192f'
        };

        // 应用主题
        Object.entries(currentTheme).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });

        // ==================== 事件处理 ====================
        let selectedType = '';
        
        // 齿轮点击
        gearIcon.addEventListener('click', () => {
            configModal.classList.add('mod05-active');
        });

        // 关闭按钮
        configModal.querySelector('.mod05-bookmark-config-close').addEventListener('click', () => {
            configModal.classList.remove('mod05-active');
        });

        // 点击遮罩关闭
        configModal.addEventListener('click', (e) => {
            if (e.target === configModal) {
                configModal.classList.remove('mod05-active');
            }
        });

        // 类别选择
        const typeButtons = configModal.querySelectorAll('.mod05-config-type-btn');
        const customInputGroup = configModal.querySelector('.mod05-config-custom-input-group');
        const subCategoryGroup = configModal.querySelector('.mod05-config-sub-category-group');
        
        typeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                typeButtons.forEach(b => b.classList.remove('mod05-active'));
                btn.classList.add('mod05-active');
                selectedType = btn.dataset.type;
                
                if (selectedType === 'custom') {
                    customInputGroup.classList.add('mod05-active');
                    subCategoryGroup.classList.add('mod05-hidden');
                } else {
                    customInputGroup.classList.remove('mod05-active');
                    subCategoryGroup.classList.remove('mod05-hidden');
                }
            });
        });

        // 生成配置按钮
        const generateBtn = configModal.querySelector('.mod05-config-generate-btn');
        const worldbookBtn = configModal.querySelector('.mod05-config-worldbook-btn');
        const outputSection = configModal.querySelector('.mod05-config-output-section');
        
        generateBtn.addEventListener('click', () => {
            const text = document.getElementById('mod05-bookmark-text').value.trim();
            const subCategory = document.getElementById('mod05-sub-category').value.trim();
            const position = document.getElementById('mod05-bookmark-position').value;
            const desc = document.getElementById('mod05-bookmark-desc').value.trim();
            const updateRule = document.getElementById('mod05-bookmark-update-rule').value.trim();
            const customCategory = document.getElementById('mod05-custom-category').value.trim();

            if (!text) {
                worldHelper.showNovaAlert('请输入标签显示文字');
                return;
            }

            if (!selectedType) {
                worldHelper.showNovaAlert('请选择类别');
                return;
            }

            if (selectedType === 'custom' && !customCategory) {
                worldHelper.showNovaAlert('请输入自定义类别名称');
                return;
            }

            // 生成数据
            const result = generateConfig(text, selectedType, subCategory, position, desc, updateRule, customCategory);
            
            // 显示结果
            document.getElementById('mod05-output-config-json').textContent = result.config;
            document.getElementById('mod05-output-prompt-ejs').textContent = result.prompt;
            outputSection.classList.add('mod05-active');
        });

        // 一键生成世界书按钮
        worldbookBtn.addEventListener('click', async () => {
            const text = document.getElementById('mod05-bookmark-text').value.trim();
            const subCategory = document.getElementById('mod05-sub-category').value.trim();
            const position = document.getElementById('mod05-bookmark-position').value;
            const desc = document.getElementById('mod05-bookmark-desc').value.trim();
            const updateRule = document.getElementById('mod05-bookmark-update-rule').value.trim();
            const customCategory = document.getElementById('mod05-custom-category').value.trim();

            if (!text) {
                worldHelper.showNovaAlert('请输入标签显示文字');
                return;
            }

            if (!selectedType) {
                worldHelper.showNovaAlert('请选择类别');
                return;
            }

            if (selectedType === 'custom' && !customCategory) {
                worldHelper.showNovaAlert('请输入自定义类别名称');
                return;
            }

            const confirmed = confirm(`将创建世界书 "x-mod-${text}" 并绑定到全局。是否继续？`);
            if (!confirmed) return;

            try {
                worldbookBtn.disabled = true;
                worldbookBtn.textContent = '生成中...';

                // 生成配置
                const result = generateConfig(text, selectedType, subCategory, position, desc, updateRule, customCategory);

                // 世界书名称
                const worldbookName = `x-mod-${text}`;

                // 创建世界书条目
                const entries = [
                    {
                        name: '[bookmarkconfig]',
                        enabled: false,
                        strategy: {
                            type: 'constant',
                            keys: [],
                            keys_secondary: { logic: 'and_any', keys: [] },
                            scan_depth: 'same_as_global'
                        },
                        position: {
                            type: 'before_character_definition',
                            role: 'system',
                            depth: 0,
                            order: 1000
                        },
                        content: result.configJson,
                        probability: 100,
                        recursion: {
                            prevent_incoming: false,
                            prevent_outgoing: false,
                            delay_until: null
                        },
                        effect: {
                            sticky: null,
                            cooldown: null,
                            delay: null
                        }
                    },
                    {
                        name: text,
                        enabled: true,
                        strategy: {
                            type: 'constant',
                            keys: [],
                            keys_secondary: { logic: 'and_any', keys: [] },
                            scan_depth: 'same_as_global'
                        },
                        position: {
                            type: 'before_character_definition',
                            role: 'system',
                            depth: 0,
                            order: 1000
                        },
                        content: result.promptTemplate,
                        probability: 100,
                        recursion: {
                            prevent_incoming: false,
                            prevent_outgoing: false,
                            delay_until: null
                        },
                        effect: {
                            sticky: null,
                            cooldown: null,
                            delay: null
                        }
                    }
                ];

                // 创建或替换世界书
                await createOrReplaceWorldbook(worldbookName, entries, { render: 'immediate' });

                // 绑定到全局
                const currentGlobalWorldbooks = getGlobalWorldbookNames();
                if (!currentGlobalWorldbooks.includes(worldbookName)) {
                    await rebindGlobalWorldbooks([...currentGlobalWorldbooks, worldbookName]);
                }

                worldHelper.showNovaAlert(`世界书 "${worldbookName}" 创建成功并已绑定到全局！`);
                worldbookBtn.textContent = '一键生成世界书并绑定全局';
            } catch (error) {
                console.error('创建世界书失败:', error);
                worldHelper.showNovaAlert('创建世界书失败: ' + error.message);
                worldbookBtn.textContent = '一键生成世界书并绑定全局';
            } finally {
                worldbookBtn.disabled = false;
            }
        });

        // 复制按钮
        const copyButtons = configModal.querySelectorAll('.mod05-config-copy-btn');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const target = btn.dataset.target;
                const content = document.getElementById(`mod05-output-${target}`).textContent;
                
                try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(content);
                    } else {
                        const textarea = document.createElement('textarea');
                        textarea.value = content;
                        textarea.style.position = 'fixed';
                        textarea.style.opacity = '0';
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textarea);
                    }
                    
                    btn.textContent = '已复制!';
                    btn.classList.add('mod05-copied');
                    setTimeout(() => {
                        btn.textContent = '复制';
                        btn.classList.remove('mod05-copied');
                    }, 2000);
                } catch (err) {
                    console.error('复制失败:', err);
                    worldHelper.showNovaAlert('复制失败，请手动复制');
                }
            });
        });

 function generateConfig(text, type, subCategory, position, desc, updateRule, customCategory) {
    const uniqueId = Math.random().toString(36).substring(2, 8);

    let fullCategory, dataTab, pathPrefix;

    if (type === 'global') {
        const sub = subCategory || toPinyin(text);
        fullCategory = `global_${sub}`;
        dataTab = fullCategory;
        pathPrefix = `global_lore.${sub}`;
    } else if (type === 'world') {
        const sub = subCategory || toPinyin(text);
        fullCategory = `world_${sub}`;
        dataTab = fullCategory;
        pathPrefix = `global_lore.${sub}`;
    } else {
        fullCategory = customCategory;
        dataTab = customCategory;
        pathPrefix = customCategory;
    }

    const varName = `${fullCategory.replace(/-/g, '_')}_${uniqueId}`;

    const configObj = {
        "data-tab": dataTab,
        "text": text,
        "position": position ? parseInt(position) : 0
    };
    const configJson = JSON.stringify(configObj, null, 2);

    // 修正了 EJS 模板字符串中的语法错误
    const promptTemplate = `<%_
//工具函数
function getDataWithFallback(varName) {
    let data = getLocalVar(varName);
    const isValid = (data) => {
        if (data === null || data === undefined) {
            return false;
        }
        if (typeof data === 'object' && data !== null) {
            if (Array.isArray(data)) {
                return data.length > 0;
            }
            return Object.keys(data).length > 0;
        }
        return true;
    };
    if (!isValid(data)) {
        data = getLocalVar(varName);
    }
    return data;
}

/**
 * 格式化对象为带缩进和换行的字符串，支持递归换行。
 * @param {object} data - 需要格式化的对象。
 * @param {number} [indent=0] - 初始缩进级别。
 * @param {boolean} [is_huanhang=true] - 是否对所有层级的子键都进行换行和缩进。
 */
function formatObjectGraceSimple(data, indent = 0, is_huanhang = true) {
    // 如果不是对象，直接返回JSON字符串
    if (typeof data !== 'object' || data === null) {
        return JSON.stringify(data);
    }

    // 定义缩进字符串
    const indentString = ' '.repeat(indent);
    const nextIndentString = ' '.repeat(indent);
    // --- 处理数组 ---
    if (Array.isArray(data)) {
        if (data.length === 0) return '[]';

        // 如果不需要递归换行，则将数组元素在一行内显示
        if (!is_huanhang) {
            const items = data.map(item => formatObjectGraceSimple(item, 0, false));
            return '[' + items.join(', ') + ']';
        }

        // 递归格式化数组的每一项
        const items = data.map(item =>
            nextIndentString + formatObjectGraceSimple(item, indent + 1, is_huanhang)
        );
        
        return '[\\n' + items.join(',\\n') + '\\n' + indentString + ']';
    }

    // --- 处理对象 ---
    // 根据_filter和_showInEJS属性判断是否隐藏
    const shouldFilter = data._filter === true || data._filter === 'true';
    const showInEJS = data._showInEJS === false || data._showInEJS === 'false';
    if (shouldFilter && showInEJS) {
        return '"[已隐藏]"';
    }

    // 过滤掉以下划线开头的键
    const keys = Object.keys(data).filter(key => !key.startsWith('_'));
    if (keys.length === 0) return '{}';

    // 格式化对象的每个键值对
    const formattedLines = keys.map(key => {
        let value = data[key];
        let valueString;

        // 特殊处理需要隐藏的子对象
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            if (value._showInEJS === false || value._showInEJS === 'false') {
                if (value._filter === true || value._filter === 'true') {
                    const isProtected = value._is_protected === true || value._is_protected === 'true';
                    const protectionMark = isProtected ? ' //此字段禁止删除！' : '';
                    valueString = '"[已隐藏]"' + protectionMark;
                } else {
                    valueString = formatObjectGraceSimple(value, indent + 1, is_huanhang);
                }
            } else {
                valueString = formatObjectGraceSimple(value, indent + 1, is_huanhang);
            }
        } else {
            valueString = formatObjectGraceSimple(value, indent + 1, is_huanhang);
        }

        // 如果不需要递归换行，则键和值在一行
        if (!is_huanhang) {
            return \`"\${key}": \${valueString}\`;
        }

        // 否则，键和值在新行并带缩进
        return \`\${nextIndentString}"\${key}": \${valueString}\`;
    });

    // 获取当前对象的保护标记
    const isCurrentProtected = data._is_protected === true || data._is_protected === 'true';
    const protectionMark = isCurrentProtected ? ' //此字段禁止删除！' : '';

    // 如果不需要递归换行，则将所有键值对拼接在一行
    if (!is_huanhang) {
        // 对于顶层调用，还是需要换行
        if (indent === 0) {
              
             return '{\\n' + formattedLines.map(line => nextIndentString + line).join(',\\n') + '\\n}' + protectionMark;
        }
        return '{' + formattedLines.join(', ') + '}' + protectionMark;
    }
 
    return '{\\n' + formattedLines.join(',\\n') + '\\n' + indentString + '}' + protectionMark;
}

function cleanObjectRecursively(obj) {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        return obj;
    }
    const cleaned = {};
    const allKeys = Object.keys(obj);

    for (let key of allKeys) {
        if (key.startsWith('_')) {
            continue;
        }
        const value = obj[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            let rawShowValue = value._showInEJS;
            if (rawShowValue === false || rawShowValue === 'false') {
                const shouldFilter = value._filter === true || value._filter === 'true';
                if (!shouldFilter) {
                    cleaned[key] = cleanObjectRecursively(value);
                } else {
                    cleaned[key] = "[已隐藏]";
                }
                continue;
            }
            cleaned[key] = cleanObjectRecursively(value);
        } else {
            cleaned[key] = value;
        }
    }
    return cleaned;
}

if (typeof assaData === 'undefined') {
    var assaData = getDataWithFallback("assa_data");
}

// 获取数据
var ${varName} = formatObjectGraceSimple(_.get(assaData, '${pathPrefix}', {}), 0, false);
_%>

memory.load('${pathPrefix}', {
    desc: "${desc || '数据描述'}",
    <%_
    var double_api = String(getLocalVar("double_api") || "false");
    var batch = Number(getLocalVar("batch") || 1);
    //更新规则
    if (double_api === "false" || (double_api === "true" && batch === 2)) {
    _%> update_rule: '${updateRule || '实时追踪更新'}'<%_
    }
    _%>
    path: '${pathPrefix} <%=${varName}%>'
});`;

    return {
        config: configJson,
        prompt: promptTemplate,
        configJson: configJson,
        promptTemplate: promptTemplate,
        dataTab: dataTab
    };
}


        function toPinyin(text) {
            return text.toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[^\w]/g, '')
                .substring(0, 20);
        }

      

    } catch (error) {
        console.error('初始化书签配置系统时出错:', error);
    }



})();