// ==UserScript==
// @name         SillyTavern Scroll Buttons & Keybindings
// @namespace    http://tampermonkey.net/
// @version      3.8_AllMessages
// @description  为SillyTavern添加回顶、回底、上一条/下一条消息导航按钮，支持自定义键盘快捷键（含组合键）、隐藏UI及可拖拽设置按钮。
// @author       YourName
// @match        *://*:8000/*
// @match        *://127.0.0.1:*/*
// @match        *://localhost:*/*
// @grant        GM_registerMenuCommand
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_VERSION = "V3.8_AllMessages";
    // 更新存储Key
    const STORAGE_KEY = "ST_Scroll_Config_v3_8"; 
    console.log(`[ScrollBtn] ${SCRIPT_VERSION}: Starting...`);

    // --- 默认配置 ---
    const defaultConfig = {
        keyTop: "",
        keyPrev: "",
        keyNext: "",
        keyBottom: "",
        showButtons: true,
        // 设置按钮的位置
        settingBtnLeft: "90%",
        settingBtnTop: "80%",
        // 滚动面板的位置 (默认居中偏下)
        panelLeft: "calc(50% - 110px)",
        panelTop: "90%" 
    };

    let currentConfig = loadConfig();

    function loadConfig() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return { ...defaultConfig, ...JSON.parse(saved) };
        } catch (e) { console.error("Config load error:", e); }
        return { ...defaultConfig };
    }

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
        renderInterface();
    }

    // --- 辅助函数：生成按键组合字符串 ---
    function getEventKeyCombo(e) {
        if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return null;
        const parts = [];
        if (e.ctrlKey) parts.push('Ctrl');
        if (e.altKey) parts.push('Alt');
        if (e.shiftKey) parts.push('Shift');
        if (e.metaKey) parts.push('Meta');
        parts.push(e.code);
        return parts.join('+');
    }

    // --- 样式定义 ---
    const SCRIPT_STYLE_ID = 'sillytavern-scrollbuttons-styles-v3-8';
    const customCSS = `
        /* 1. 滚动功能面板 (容器) */
        #st-scroll-panel-container {
            position: fixed !important;
            display: flex !important;
            align-items: center;
            gap: 5px;
            padding: 5px 8px;
            background: rgba(15, 15, 20, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            z-index: 2000 !important;
            user-select: none;
            backdrop-filter: blur(5px);
        }

        /* 拖拽手柄 */
        .st-panel-drag-handle {
            cursor: grab;
            color: #666;
            font-size: 18px;
            padding: 0 5px;
            line-height: 1;
            display: flex;
            align-items: center;
        }
        .st-panel-drag-handle:hover { color: #fff; }
        .st-panel-drag-handle:active { cursor: grabbing; color: #00ffaa; }

        /* 功能按钮 */
        .st-floating-scroll-btn {
            width: 40px;
            height: 32px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            color: #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s;
        }
        .st-floating-scroll-btn:hover { background: rgba(255, 255, 255, 0.25); color: #fff; transform: scale(1.05); }
        .st-floating-scroll-btn:active { transform: scale(0.95); }

        /* 面板上的关闭按钮 (X) */
        .st-panel-close-btn {
            margin-left: 5px;
            width: 20px;
            height: 20px;
            font-size: 14px;
            color: #888;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
        }
        .st-panel-close-btn:hover { background: #d32f2f; color: white; }

        /* 2. 独立的设置按钮 (回) */
        #st-settings-trigger-btn {
            position: fixed !important;
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
            font-size: 14px;
            font-weight: bold;
            z-index: 2001 !important;
            user-select: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            transition: background 0.2s, transform 0.1s;
        }
        #st-settings-trigger-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: #fff;
        }
        #st-settings-trigger-btn:active {
            cursor: grabbing;
            transform: scale(0.95);
        }

        /* 3. 设置面板 (Modal) */
        #st-scroll-settings-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 99999;
            display: flex; align-items: center; justify-content: center;
        }
        #st-scroll-settings-panel {
            background: #1f212e;
            border: 2px solid #555;
            border-radius: 12px;
            padding: 20px;
            width: 400px;
            color: #eee;
            font-family: sans-serif;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        }
        .st-setting-row { margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
        .st-setting-label { font-size: 14px; color: #ccc; }
        
        .st-input-wrapper { display: flex; align-items: center; gap: 5px; }
        
        .st-key-input {
            width: 140px; padding: 6px; text-align: center;
            background: #0b0c10; border: 1px solid #444; color: #00ffaa;
            border-radius: 4px; cursor: pointer; font-size: 13px;
        }
        .st-key-input:focus { border-color: #00ffaa; outline: none; background: #1a1c25; }
        .st-key-input::placeholder { color: #555; font-size: 12px; }

        .st-clear-btn {
            width: 25px; height: 25px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid #444; border-radius: 4px;
            color: #aaa; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            font-size: 16px; line-height: 1;
            transition: all 0.2s;
        }
        .st-clear-btn:hover { background: #d32f2f; color: white; border-color: #d32f2f; }
        
        .st-btn-group { margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px; }
        .st-panel-btn {
            padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold;
        }
        .st-btn-save { background: #4caf50; color: white; }
        .st-btn-close { background: #f44336; color: white; }
        .st-checkbox-wrapper { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .st-checkbox { width: 18px; height: 18px; cursor: pointer; }
    `;

    function addStyleManually(cssContent) {
        let oldStyle = document.getElementById(SCRIPT_STYLE_ID);
        if (oldStyle) oldStyle.remove();
        let styleElement = document.createElement('style');
        styleElement.id = SCRIPT_STYLE_ID;
        styleElement.textContent = cssContent;
        (document.head || document.documentElement).appendChild(styleElement);
    }

    // --- 核心滚动逻辑 ---
    function findTrueScrollContainer() {
        return document.getElementById("chat-display-area");
    }

    function doScroll(direction) {
        const container = findTrueScrollContainer();
        if (!container) return;
        const behavior = 'smooth';
        if (direction === 'top') container.scrollTo({ top: 0, behavior: behavior });
        else if (direction === 'bottom') container.scrollTo({ top: container.scrollHeight, behavior: behavior });
    }

    // --- 消息导航逻辑 (修改版：支持所有消息) ---
    function navigateMessages(direction) {
        const container = findTrueScrollContainer();
        if (!container) return;
        
        // 修改选择器：.mes 是SillyTavern中包含 User 和 AI 消息的通用容器类
        const messages = Array.from(container.querySelectorAll('.mes'));
        if (messages.length === 0) return;

        const currentScrollTop = container.scrollTop;
        const threshold = 10; 
        let targetMessage = null;

        if (direction === 'prev') {
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].offsetTop < currentScrollTop - threshold) {
                    targetMessage = messages[i];
                    break; 
                }
            }
        } else {
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].offsetTop > currentScrollTop + threshold) {
                    targetMessage = messages[i];
                    break;
                }
            }
        }

        if (targetMessage) {
            container.scrollTo({ top: targetMessage.offsetTop, behavior: 'smooth' });
        } else if (direction === 'next') {
            doScroll('bottom');
        }
    }

    // --- 设置面板逻辑 ---
    function openSettingsPanel() {
        if (document.getElementById('st-scroll-settings-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'st-scroll-settings-overlay';

        const panel = document.createElement('div');
        panel.id = 'st-scroll-settings-panel';
        panel.innerHTML = `<h3 style="margin-top:0; border-bottom:1px solid #444; padding-bottom:10px;">滚动功能设置</h3>`;

        const createKeyRow = (label, configKey) => {
            const row = document.createElement('div');
            row.className = 'st-setting-row';
            
            const lbl = document.createElement('div');
            lbl.className = 'st-setting-label';
            lbl.innerText = label;

            const inputWrapper = document.createElement('div');
            inputWrapper.className = 'st-input-wrapper';

            const input = document.createElement('input');
            input.className = 'st-key-input';
            input.readOnly = true;
            input.value = currentConfig[configKey];
            input.placeholder = "未设置 (点击录入)";
            
            input.addEventListener('keydown', (e) => {
                e.preventDefault(); e.stopPropagation();
                if (e.code === 'Backspace' || e.code === 'Delete') {
                    input.value = '';
                    return;
                }
                const combo = getEventKeyCombo(e);
                if (combo) input.value = combo;
            });

            const clearBtn = document.createElement('div');
            clearBtn.className = 'st-clear-btn';
            clearBtn.innerHTML = '×';
            clearBtn.title = '清空此热键';
            clearBtn.onclick = () => { input.value = ''; };

            inputWrapper.appendChild(input);
            inputWrapper.appendChild(clearBtn);
            row.appendChild(lbl);
            row.appendChild(inputWrapper);
            return { row, input, configKey };
        };

        const inputs = [];
        inputs.push(createKeyRow("回到底部", "keyBottom"));
        inputs.push(createKeyRow("回到顶部", "keyTop"));
        inputs.push(createKeyRow("上一条消息", "keyPrev")); // 修改了标签文本
        inputs.push(createKeyRow("下一条消息", "keyNext")); // 修改了标签文本
        inputs.forEach(item => panel.appendChild(item.row));

        const toggleRow = document.createElement('div');
        toggleRow.className = 'st-setting-row';
        toggleRow.innerHTML = `
            <label class="st-checkbox-wrapper">
                <input type="checkbox" id="st-show-buttons-check" class="st-checkbox" ${currentConfig.showButtons ? 'checked' : ''}>
                <span>显示底部四个功能按钮面板</span>
            </label>
        `;
        panel.appendChild(toggleRow);

        const btnGroup = document.createElement('div');
        btnGroup.className = 'st-btn-group';
        const saveBtn = document.createElement('button');
        saveBtn.className = 'st-panel-btn st-btn-save';
        saveBtn.innerText = "保存";
        saveBtn.onclick = () => {
            inputs.forEach(item => { currentConfig[item.configKey] = item.input.value; });
            currentConfig.showButtons = document.getElementById('st-show-buttons-check').checked;
            saveConfig(); 
            overlay.remove();
        };
        const closeBtn = document.createElement('button');
        closeBtn.className = 'st-panel-btn st-btn-close';
        closeBtn.innerText = "取消";
        closeBtn.onclick = () => overlay.remove();

        btnGroup.appendChild(closeBtn);
        btnGroup.appendChild(saveBtn);
        panel.appendChild(btnGroup);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    // --- 全局键盘监听 ---
    function handleGlobalKeyDown(e) {
        const tag = document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;
        
        const currentCombo = getEventKeyCombo(e);
        if (!currentCombo) return; 

        if (currentConfig.keyTop && currentCombo === currentConfig.keyTop) { e.preventDefault(); doScroll('top'); }
        else if (currentConfig.keyBottom && currentCombo === currentConfig.keyBottom) { e.preventDefault(); doScroll('bottom'); }
        else if (currentConfig.keyPrev && currentCombo === currentConfig.keyPrev) { e.preventDefault(); navigateMessages('prev'); }
        else if (currentConfig.keyNext && currentCombo === currentConfig.keyNext) { e.preventDefault(); navigateMessages('next'); }
    }

    // --- 拖拽逻辑 (通用) ---
    function makeDraggable(element, targetKeyPrefix) {
        let isDragging = false;
        let startX, startY;
        let hasMoved = false; 

        const dragHandler = (e) => {
            if (e.target.classList.contains('st-floating-scroll-btn') || 
                e.target.classList.contains('st-panel-close-btn')) {
                return;
            }

            isDragging = true;
            hasMoved = false;
            startX = e.clientX - element.offsetLeft;
            startY = e.clientY - element.offsetTop;
            
            if(element.querySelector('.st-panel-drag-handle')) {
                element.querySelector('.st-panel-drag-handle').style.cursor = 'grabbing';
            } else {
                element.style.cursor = 'grabbing';
            }
        };

        element.addEventListener('mousedown', dragHandler);

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            hasMoved = true;
            
            let left = e.clientX - startX;
            let top = e.clientY - startY;

            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            
            if (left < 0) left = 0;
            if (top < 0) top = 0;
            if (left > maxX) left = maxX;
            if (top > maxY) top = maxY;

            element.style.left = `${left}px`;
            element.style.top = `${top}px`;
            element.style.transform = 'none'; 
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                if(element.querySelector('.st-panel-drag-handle')) {
                    element.querySelector('.st-panel-drag-handle').style.cursor = 'grab';
                } else {
                    element.style.cursor = 'grab';
                }
                
                currentConfig[`${targetKeyPrefix}Left`] = element.style.left;
                currentConfig[`${targetKeyPrefix}Top`] = element.style.top;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
            }
        });

        element.addEventListener('click', (e) => {
            if (hasMoved) {
                e.stopImmediatePropagation(); 
                e.preventDefault();
            }
        });
    }

    // --- 界面渲染主函数 ---
    function renderInterface() {
        const panelId = 'st-scroll-panel-container';
        let panel = document.getElementById(panelId);
        if (panel) panel.remove();

        if (currentConfig.showButtons) {
            panel = document.createElement('div');
            panel.id = panelId;
            panel.style.left = currentConfig.panelLeft;
            panel.style.top = currentConfig.panelTop;

            const handle = document.createElement('div');
            handle.className = 'st-panel-drag-handle';
            handle.innerHTML = '⋮'; 
            handle.title = '按住拖动面板';

            const fmtKey = (k) => k ? k.replace('Key', '').replace('Digit', '') : '';

            const makeBtn = (text, title, action) => {
                const btn = document.createElement('div');
                btn.className = 'st-floating-scroll-btn';
                btn.innerHTML = text;
                btn.title = title;
                btn.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); action(); };
                return btn;
            };

            const closeBtn = document.createElement('div');
            closeBtn.className = 'st-panel-close-btn';
            closeBtn.innerHTML = '×';
            closeBtn.title = '隐藏面板 (可在回字设置中重新开启)';
            closeBtn.onmousedown = (e) => {
                e.preventDefault(); e.stopPropagation();
                currentConfig.showButtons = false;
                saveConfig(); 
            };

            // 组装面板 (文本已更新为 上条/下条)
            panel.appendChild(handle);
            panel.appendChild(makeBtn('▲', `回顶 ${fmtKey(currentConfig.keyTop)}`, () => doScroll('top')));
            panel.appendChild(makeBtn('↑', `上条 ${fmtKey(currentConfig.keyPrev)}`, () => navigateMessages('prev')));
            panel.appendChild(makeBtn('↓', `下条 ${fmtKey(currentConfig.keyNext)}`, () => navigateMessages('next')));
            panel.appendChild(makeBtn('▼', `回底 ${fmtKey(currentConfig.keyBottom)}`, () => doScroll('bottom')));
            panel.appendChild(closeBtn);

            document.body.appendChild(panel);
            makeDraggable(panel, 'panel');
        }

        const settingsBtnId = 'st-settings-trigger-btn';
        let settingsBtn = document.getElementById(settingsBtnId);
        if (!settingsBtn) {
            settingsBtn = document.createElement('div');
            settingsBtn.id = settingsBtnId;
            settingsBtn.innerHTML = "回"; 
            settingsBtn.title = "拖动我移动位置 / 点击打开设置";
            document.body.appendChild(settingsBtn);
            
            settingsBtn.addEventListener('click', openSettingsPanel);
            makeDraggable(settingsBtn, 'settingBtn');
        }
        settingsBtn.style.left = currentConfig.settingBtnLeft;
        settingsBtn.style.top = currentConfig.settingBtnTop;
    }

    // --- 初始化 ---
    function init() {
        if (findTrueScrollContainer()) {
            addStyleManually(customCSS);
            renderInterface();
            
            document.removeEventListener('keydown', handleGlobalKeyDown);
            document.addEventListener('keydown', handleGlobalKeyDown);

            if (typeof GM_registerMenuCommand !== 'undefined') {
                GM_registerMenuCommand("打开滚动设置面板", openSettingsPanel);
            }
            console.log(`[ScrollBtn] Initialized.`);
        } else {
            setTimeout(init, 1000);
        }
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();