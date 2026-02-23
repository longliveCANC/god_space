(function() {
    'use strict';

    // 防止重复注入
    if (document.querySelector('.mod21-phone-wrapper')) {
        return;
    }

    // --- 1. CSS 样式注入 ---
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --mod21-bg-color: #f2f2f2;
            --mod21-header-bg: #f8f8f8; /* QQ 顶部通常是浅灰或白色 */
            --mod21-primary-color: #0099ff;
            --mod21-text-main: #000000;
            --mod21-text-sub: #888888;
            --mod21-bubble-me: #0099ff;
            --mod21-bubble-other: #ffffff;
            --mod21-border: #dcdcdc;
            --mod21-danger: #ff3b30;
            --mod21-system-bg: #dcdcdc;
        }

        /* 隐藏类 */
        .mod21-hidden { display: none !important; }

        /* 遮罩层 - 点击关闭 */
        .mod21-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.5); z-index: 9998;
            display: flex; justify-content: center; align-items: center;
            backdrop-filter: blur(3px);
        }

        /* 手机容器 */
        .mod21-phone-wrapper {
            width: 375px; height: 80vh; max-height: 812px;
            background-color: var(--mod21-bg-color);
            border-radius: 30px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            overflow: hidden;
            position: relative;
            display: flex; flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            border: 8px solid #1a1a1a; /* 模拟手机边框 */
        }

        /* 顶部状态栏模拟 */
        .mod21-status-bar {
            height: 24px; background-color: var(--mod21-header-bg);
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 15px; font-size: 12px; color: var(--mod21-text-main);
            font-weight: bold; border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        /* 通用头部导航 */
        .mod21-nav-bar {
            height: 44px; background-color: var(--mod21-header-bg);
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 10px; border-bottom: 1px solid var(--mod21-border);
            flex-shrink: 0; z-index: 10;
        }
        .mod21-nav-title { font-size: 17px; font-weight: 600; color: var(--mod21-text-main); }
        .mod21-nav-btn {
            background: none; border: none; font-size: 16px; color: var(--mod21-primary-color);
            cursor: pointer; padding: 5px; display: flex; align-items: center;
        }
            .mod21-nav-icon { width: 24px; height: 24px; fill: currentColor; } 
        .mod21-nav-icon { width: 24px; height: 24px; fill: currentColor; }

        /* 页面容器 */
   .mod21-page {
    flex: 1; display: flex; flex-direction: column; overflow: hidden;
    /* 移除 position, top, bottom, left, right */
    background-color: var(--mod21-bg-color);
    transition: transform 0.3s ease;
    /* 新增 width 和 height 以在切换时保持尺寸 */
    width: 100%;
    height: 100%;
}
        .mod21-page-active { transform: translateX(0); z-index: 5; }
        .mod21-page-inactive-left { transform: translateX(-100%); z-index: 4; }
        .mod21-page-inactive-right { transform: translateX(100%); z-index: 6; }

        /* --- 列表页样式 --- */
        .mod21-list-item {
            display: flex; align-items: center; padding: 12px 15px;
            background: #fff; border-bottom: 1px solid var(--mod21-border);
            cursor: pointer; transition: background 0.2s;
        }
        .mod21-list-item:active { background: #f0f0f0; }
        .mod21-avatar {
            width: 48px; height: 48px; border-radius: 50%; background: #ddd;
            margin-right: 12px; display: flex; justify-content: center; align-items: center;
            color: #fff; font-weight: bold; font-size: 18px; flex-shrink: 0;
            overflow: hidden;
        }
        .mod21-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .mod21-list-content { flex: 1; overflow: hidden; }
        .mod21-list-name { font-size: 16px; color: var(--mod21-text-main); margin-bottom: 4px; }
        .mod21-list-preview { font-size: 13px; color: var(--mod21-text-sub); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mod21-list-time { font-size: 12px; color: var(--mod21-text-sub); margin-left: 10px; }

        /* --- 聊天页样式 --- */
        .mod21-chat-container {
            flex: 1; overflow-y: auto; padding: 15px;
            display: flex; flex-direction: column; gap: 15px;
            background-color: #f2f2f2;
        }

        /* 消息气泡 */
        .mod21-msg-row { display: flex; margin-bottom: 10px; width: 100%; }
        .mod21-msg-row.mod21-me { flex-direction: row-reverse; }

        .mod21-msg-avatar {
            width: 40px; height: 40px; border-radius: 50%; background: #ccc;
            flex-shrink: 0; display: flex; justify-content: center; align-items: center;
            color: #fff; font-size: 14px; cursor: pointer;
        }

    
        .mod21-me .mod21-msg-content-wrapper { align-items: flex-end; }

     
.mod21-msg-name {
    font-size: 12px; color: var(--mod21-text-sub); margin-bottom: 2px;
    display: flex; align-items: center; gap: 4px;
    flex-wrap: wrap; /* 允许头衔标签换行 */
}

.mod21-msg-content-wrapper {
    max-width: 70%; margin: 0 10px; display: flex; flex-direction: column;
    min-width: 0; /* 关键：允许内容包装器收缩，防止被子元素撑开 */
}
        /* 头衔标签 */
        .mod21-tag {
            font-size: 10px; padding: 1px 4px; border-radius: 4px;
            color: #fff; transform: scale(0.9); transform-origin: left center;
        }
        .mod21-tag-admin { background: #f0ad4e; }
        .mod21-tag-owner { background: #f0ad4e; }
        .mod21-tag-level { background: #5bc0de; }
        .mod21-tag-title { background: #d9534f; }

      .mod21-bubble {
    padding: 10px 12px; border-radius: 10px; position: relative;
    font-size: 15px; line-height: 1.5; word-wrap: break-word;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    align-self: flex-start; /* 关键：让气泡自身决定宽度，而不是拉伸 */
    max-width: 100%; /* 确保气泡在内容过多时不会超出容器 */
}
        .mod21-bubble-left {
            background-color: var(--mod21-bubble-other); color: var(--mod21-text-main);
            border-top-left-radius: 0;
        }
        .mod21-bubble-right {
            background-color: var(--mod21-bubble-me); color: #fff;
            border-top-right-radius: 0;
        }

        /* 引用消息 */
        .mod21-quote {
            margin-bottom: 5px; padding: 8px; background: rgba(0,0,0,0.05);
            border-radius: 4px; font-size: 12px; color: #666;
            border-left: 3px solid #ccc;
        }

        /* 系统消息 */
        .mod21-system-msg {
            align-self: center; background-color: rgba(0,0,0,0.1);
            color: #fff; font-size: 12px; padding: 4px 10px;
            border-radius: 4px; margin: 10px 0; max-width: 80%; text-align: center;
        }

        /* 图片占位 */
        .mod21-img-placeholder {
            display: inline-block; background: #e0e0e0; color: #555;
            padding: 20px; border-radius: 8px; text-align: center;
            border: 1px dashed #999; font-size: 12px; margin: 5px 0;
        }

        /* 底部输入栏 */
        .mod21-input-bar {
            min-height: 50px; background: #f8f8f8; border-top: 1px solid var(--mod21-border);
            display: flex; align-items: center; padding: 5px 10px; gap: 10px;
            flex-shrink: 0;
        }
        .mod21-icon-btn {
            width: 28px; height: 28px; border-radius: 50%; border: 1px solid #999;
            display: flex; justify-content: center; align-items: center; cursor: pointer;
            color: #555; font-size: 14px; background: none;
        }
        .mod21-input-field {
            flex: 1; height: 36px; border-radius: 18px; border: 1px solid #ddd;
            padding: 0 15px; font-size: 15px; outline: none; background: #fff;
        }
        .mod21-send-btn {
            background-color: var(--mod21-primary-color); color: #fff;
            border: none; padding: 6px 12px; border-radius: 15px;
            font-size: 13px; cursor: pointer;
        }
        .mod21-send-btn:disabled { background-color: #ccc; }

        /* 设置模态框 */
        .mod21-settings-modal {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 100;
            display: flex; justify-content: center; align-items: center;
        }
        .mod21-settings-content {
        color:black;
            width: 80%; background: #fff; border-radius: 10px; padding: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .mod21-settings-row { margin-bottom: 15px; }
        .mod21-settings-label {color:black; display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px; }
        .mod21-settings-select { color:black;width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
        .mod21-settings-btn {
            width: 100%; padding: 10px; background: var(--mod21-primary-color);
            color: #fff; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;
        }

        /* Toastr 模拟 */
        .mod21-toast {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.7); color: #fff; padding: 10px 20px;
            border-radius: 5px; font-size: 14px; z-index: 200; pointer-events: none;
            opacity: 0; transition: opacity 0.3s;
        }
        .mod21-toast.show { opacity: 1; }
 
    @keyframes mod21-fade-in-up {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 将动画应用到消息行 */
.mod21-msg-row, .mod21-system-msg {
    animation: mod21-fade-in-up 0.3s ease-out;
}

.mod21-member-modal {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.6); z-index: 101;
    display: flex; justify-content: center; align-items: center;
    padding: 20px; box-sizing: border-box;
}
.mod21-member-content {
    background: #fff; padding: 20px; border-radius: 12px;
    width: 100%; max-width: 300px; max-height: 70vh;
    overflow-y: auto; box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    color: #333;
}
.mod21-member-content h4 {
    margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
}
.mod21-member-content pre {
    background: #f5f5f5; padding: 10px; border-radius: 5px;
    white-space: pre-wrap; word-wrap: break-word; font-size: 13px;
    line-height: 1.6;
}
.mod21-member-close-btn {
    width: 100%; padding: 10px; background: var(--mod21-primary-color);
    color: #fff; border: none; border-radius: 5px; cursor: pointer;
    margin-top: 15px; font-size: 15px;
}

.mod21-member-details-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    line-height: 1.6;
}

.mod21-member-info-row {
    display: flex;
    flex-direction: column;
    padding: 8px;
    background: #f9f9f9;
    border-radius: 6px;
    border: 1px solid #eee;
}

.mod21-member-info-key {
    color: #555;
    font-weight: bold;
    margin-bottom: 4px;
}

.mod21-member-nested-block {
    background: #f0f0f0;
    padding: 10px;
    border-radius: 4px;
    margin-top: 5px;
}

.mod21-member-detail-item {
    margin-bottom: 5px;
}

.mod21-member-detail-item p {
    margin: 0;
    padding-left: 1em;
    color: #333;
}
    .mod21-badge {
            min-width: 16px; height: 16px; border-radius: 8px;
            background: var(--mod21-danger); color: #fff;
            font-size: 10px; line-height: 16px; text-align: center;
            padding: 0 4px; position: absolute; right: 10px; top: 10px;
        }

        /* 返回按钮上的红点 */
        .mod21-back-badge {
            width: 8px; height: 8px; border-radius: 50%;
            background: var(--mod21-danger);
            position: absolute; top: 5px; right: 5px;
            display: none;
        }
        .mod21-back-badge.show { display: block; }

        /* 底部Tab激活样式 */
        .mod21-tab-active { color: var(--mod21-primary-color) !important; font-weight: bold; }
    `;
    document.head.appendChild(style);

    // --- 2. HTML 结构 ---
    const orbsContainer = document.getElementById('top-left-orbs');
    if (!orbsContainer) return;

    const aiOrbButton = document.createElement('div');
    aiOrbButton.className = 'orb top-orb';
    aiOrbButton.id = 'mod21-ai-orb-button';
    aiOrbButton.textContent = '📱'; // 手机图标
    aiOrbButton.title = "打开聊天手机";
    orbsContainer.appendChild(aiOrbButton);

    const overlay = document.createElement('div');
    overlay.className = 'mod21-overlay mod21-hidden';

    // SVG 图标定义
    const icons = {
        back: '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>',
        menu: '<svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>',
        plus: '<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
        face: '<svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>',
        settings: '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
        group: '<svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>'
    };

    overlay.innerHTML = `
       <div class="mod21-phone-wrapper">
    <!-- 状态栏 -->
    <div class="mod21-status-bar">
        <span class="mod21-time">12:00</span>
        <span>5G <span style="margin-left:5px">🔋 100%</span></span>
    </div>

    <!-- 新增一个容器来处理页面切换 -->
    <div style="flex: 1; position: relative; overflow: hidden;">

        <!-- 列表页 (主页) -->
          <div class="mod21-page mod21-page-active" id="mod21-list-page" style="position: absolute; top: 0; left: 0;">
            <div class="mod21-nav-bar">
                <div class="mod21-avatar" style="width:32px;height:32px;font-size:12px;margin:0;">我</div>
                <span class="mod21-nav-title" id="mod21-main-title">消息</span>
                <button class="mod21-nav-btn" id="mod21-btn-settings" style="font-size: 22px;">⚙️</button>
            </div>

            <!-- 消息列表容器 -->
            <div id="mod21-msg-list-container" style="flex:1; overflow-y:auto;"></div>

            <!-- 联系人列表容器 (默认隐藏) -->
            <div id="mod21-contact-list-container" style="flex:1; overflow-y:auto; display:none;"></div>

            <!-- 底部 Tab -->
            <div style="height:50px; border-top:1px solid #ddd; display:flex; align-items:center; background:#f8f8f8;">
                <div class="mod21-tab-btn mod21-tab-active" data-target="msg" style="flex:1; text-align:center; font-size:12px; cursor:pointer; position:relative;">
                    消息 <div class="mod21-back-badge" id="mod21-tab-msg-badge"></div>
                </div>
                <div class="mod21-tab-btn" data-target="contact" style="flex:1; text-align:center; color:#999; font-size:12px; cursor:pointer;">
                    联系人
                </div>
                <div style="flex:1; text-align:center; color:#999; font-size:12px;" onclick="showToast('暂未开发')">动态</div>
            </div>
        </div>

        <!-- 群聊页 -->
          <div class="mod21-page mod21-page-inactive-right" id="mod21-chat-page" style="position: absolute; top: 0; left: 0;">
            <div class="mod21-nav-bar">
                <button class="mod21-nav-btn" id="mod21-btn-back" style="font-size: 24px; font-weight: bold;"><</button>
                <span class="mod21-nav-title">异世界交流群 </span>
                <div>
                    <button class="mod21-nav-btn" id="mod21-btn-raw-text" style="font-size: 22px;">📄</button>
                
                </div>
            </div>
            <div class="mod21-chat-container" id="mod21-chat-box">
                <!-- 消息将在这里渲染 -->
            </div>
            <div class="mod21-input-bar">
                <button class="mod21-icon-btn" onclick="showToast('暂未开发')">${icons.plus}</button>
                <button class="mod21-icon-btn" onclick="showToast('暂未开发')">${icons.face}</button>
                <input type="text" class="mod21-input-field" id="mod21-input" placeholder="发消息...">
                <button class="mod21-send-btn" id="mod21-send">发送</button>
            </div>
        </div>

    </div> <!-- 关闭新增的容器 -->
            <!-- 设置模态框 (隐藏) -->
            <div class="mod21-settings-modal mod21-hidden" id="mod21-settings-modal">
                <div class="mod21-settings-content">
                    <h3>系统设置</h3>
                    <div class="mod21-settings-row">
                        <label class="mod21-settings-label">选择 API</label>
                        <select class="mod21-settings-select" id="mod21-api-select"></select>
                    </div>
                    <div class="mod21-settings-row">
                        <button class="mod21-settings-btn" id="mod21-wb-config" style="background:#5bc0de;">配置世界书</button>
                    </div>
                    <button class="mod21-settings-btn" id="mod21-settings-close">关闭</button>
                </div>
            </div>

            <!-- Toast -->
            <div class="mod21-toast" id="mod21-toast">提示信息</div>
        </div>
    `;
    document.body.appendChild(overlay);

    // --- 3. 辅助函数 ---
let currentChatTarget = null; // 当前聊天的ID (群名 或 成员名)
    let currentChatType = null;   // 'group' 或 'private'
    let unreadCounts = {};        // { "群名": 5, "成员名": 1 }
    // Toast 显示
    window.showToast = function(msg) {
        const toast = document.getElementById('mod21-toast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    };

    // 获取颜色
    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    }

 
 window.showMemberInfo = function(memberName) {
    const members = getGroupMembers();
    const memberInfo = members[memberName];

    if (!memberInfo) {
        showToast(`未找到成员 "${memberName}" 的信息`);
        return;
    }

    // --- 开始修改 ---

    // 创建一个函数来美化信息展示
    function createInfoRow(key, value) {
        // 对“相关信息”进行特殊处理，使其更易读
        if (  typeof value === 'object' && value !== null) {
            let relatedInfoHtml = Object.entries(value).map(([subKey, subValue]) =>
                `<div class="mod21-member-detail-item"><strong>${subKey}:</strong> <p>${subValue}</p></div>`
            ).join('');
            return `<div class="mod21-member-info-row">
                        <strong class="mod21-member-info-key">${key}:</strong>
                        <div class="mod21-member-nested-block">${relatedInfoHtml}</div>
                    </div>`;
        }
        // 对普通键值对的处理
        return `<div class="mod21-member-info-row">
                    <strong class="mod21-member-info-key">${key}:</strong>
                    <span>${value}</span>
                </div>`;
    }

    const modal = document.createElement('div');
    modal.className = 'mod21-member-modal';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    const avatarColor = stringToColor(memberName);
    const avatarChar = memberName.charAt(0);

    // 生成所有信息的HTML
    const detailsHtml = Object.entries(memberInfo).map(([key, value]) => createInfoRow(key, value)).join('');

    modal.innerHTML = `
        <div class="mod21-member-content">
            <h4>
                <div class="mod21-msg-avatar" style="background:${avatarColor}; width:40px; height:40px;">${avatarChar}</div>
                ${memberName}
            </h4>
            <div class="mod21-member-details-container">
                ${detailsHtml}
            </div>
            <button class="mod21-member-close-btn" onclick="this.closest('.mod21-member-modal').remove()">关闭</button>
        </div>
    `;

    document.querySelector('.mod21-phone-wrapper').appendChild(modal);

    // --- 修改结束 ---
};
  function getGroupList() {
        try {
            let data = assaSettingsData || {};
            return Object.keys(data.group_info || {});
        } catch (e) { return []; }
    }

    // 获取指定群的成员信息
    function getGroupMembers(groupName) {
        try {
            let data = assaSettingsData || {};
            // 如果指定了群名，取该群；否则取第一个群（兼容旧逻辑）或是空
            const gName = groupName || Object.keys(data.group_info || {})[0];
            if (!gName) return {};

            const groupData = data.group_info[gName] || {};
            const members = groupData.members || {};

            // 解析
            const parsedMembers = {};
            for (let key in members) {
                try { parsedMembers[key] = typeof members[key] === 'string' ? JSON.parse(members[key]) : members[key]; }
                catch (e) { parsedMembers[key] = members[key]; }
            }
            return parsedMembers;
        } catch (e) { return {}; }
    }

    // 获取所有有过私聊记录的成员列表
    function getPrivateChatList() {
        try {
            let data = assaSettingsData || {};
            const privateChats = new Set();
            Object.keys(data).forEach(key => {
                if (key.startsWith('private_history.')) {
                    // key 格式: private_history.成员名.时间戳
                    const parts = key.split('.');
                    if (parts.length >= 2) {
                        privateChats.add(parts[1]);
                    }
                }
            });
            return Array.from(privateChats);
        } catch (e) { return []; }
    }

    // 通用历史记录获取 (支持群聊和私聊)
    function getChatHistory(targetId, type, startIndex = 0, count = -1) {
        try {
            let data = assaSettingsData || {};
            const prefix = type === 'group' ? `group_history.${targetId}.` : `private_history.${targetId}.`;

            // 筛选出符合前缀的键
            const allKeys = Object.keys(data).filter(k => k.startsWith(prefix)).sort(); // 时间戳通常是可排序的字符串

            if (allKeys.length === 0) return { messages: [], hasMore: false };

            const endIndex = allKeys.length - startIndex;
            const startSliceIndex = (count === -1) ? 0 : Math.max(0, endIndex - count);
            const keysToLoad = allKeys.slice(startSliceIndex, endIndex);

            let messages = [];
            keysToLoad.forEach(key => {
                const msgs = data[key];
                if (Array.isArray(msgs)) {
                    msgs.forEach(m => {
                        m._ts = key;
                        messages.push(m);
                    });
                }
            });

            return { messages, hasMore: startSliceIndex > 0 };
        } catch (e) {
            console.error("获取历史失败", e);
            return { messages: [], hasMore: false };
        }
    }

    // 获取最新一条消息用于预览
    function getLastMessage(targetId, type) {
        const history = getChatHistory(targetId, type, 0, 1); // 只取最后1个时间戳块
        if (history.messages.length > 0) {
            return history.messages[history.messages.length - 1];
        }
        return null;
    }

    // --- 4. 渲染逻辑 ---
    const chatBox = document.getElementById('mod21-chat-box');
    const membersCache = {}; // 缓存成员信息

    function renderMessage(msgData, isAppend = true) {
    const shouldScroll = (chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight) < 100;
    const type = msgData[0];

    
    let name, content;
    if (type === 2) {
        // 新的系统消息格式: [2, "通知人", "通告内容"]
        const notifier = msgData[1] || "系统"; // 通知人
        const notice = msgData[2] || ""; // 通告内容
        name = "系统"; // 内部统一处理为系统
        content = `${notifier} ${notice}`; // 拼接成 "管理员 xxx 将 yyy 禁言"
    } else {
        // 其他消息格式
        name = msgData[1];
        content = msgData[2];
    }
    
        // 刷新成员缓存
        const members = getGroupMembers();
        const memberInfo = members[name] || { "群头衔": "群员", "群等级": "LV1" };

        const div = document.createElement('div');

        // 处理图片 ID
         if (typeof content === 'string') {
         
        content = content.replace(/<图片id:([^>]+)>/g, '<span class="mod21-img-placeholder">[图片: $1]</span>');

      
        // content = content.replace(/<图片id:([^>]+)>/g, '<img src="https://files.catbox.moe/$1.jpg" alt="Image reply" style="max-width: 250px; display: block; border-radius: 12px;">');
    }

        if (type === 2) {
            // 系统消息
            div.className = 'mod21-system-msg';
            div.innerHTML = content; // content is "通告内容"
        } else {
            // 普通消息 / 回复 / 私聊
            const isMe = name === '我' || name === '阿萨'; // 假设玩家名字
            div.className = `mod21-msg-row ${isMe ? 'mod21-me' : ''}`;

            // 头像
            const avatarColor = stringToColor(name);
            const avatarChar = name.charAt(0);
           const avatarHtml = `<div class="mod21-msg-avatar" style="background:${avatarColor}" onclick="showMemberInfo('${name}')">${avatarChar}</div>`;
            // 头衔标签
            let tagsHtml = '';
            if (!isMe) {
                const level = memberInfo['群等级'] || 'LV1';
                const title = memberInfo['群头衔'] || '';
                const role = memberInfo['群身份'] || '群员';

                tagsHtml += `<span class="mod21-tag mod21-tag-level">${level}</span>`;
                if (role === '群主') tagsHtml += `<span class="mod21-tag mod21-tag-owner">群主</span>`;
                else if (role === '管理员') tagsHtml += `<span class="mod21-tag mod21-tag-admin">管理</span>`;
                if (title) tagsHtml += `<span class="mod21-tag mod21-tag-title">${title}</span>`;
            }

            // 引用内容 (Type 3)
            let quoteHtml = '';
            if (type === 3 && msgData[3]) {
                quoteHtml = `<div class="mod21-quote">${msgData[3]}</div>`;
            }

            // 私聊标识 (Type 4)
            let privateHtml = '';
            if (type === 4) {
                privateHtml = `<span style="color:red;font-size:12px;">[私聊 -> ${msgData[2]}] </span>`;
                content = msgData[3]; // 私聊内容在第4个
            }

          div.innerHTML = `
    ${avatarHtml}
    <div class="mod21-msg-content-wrapper">
        <div class="mod21-msg-name">
            ${isMe ? '' : name}
            ${tagsHtml}
        </div>
        <div class="mod21-bubble ${isMe ? 'mod21-bubble-right' : 'mod21-bubble-left'}">
            ${quoteHtml}
            ${privateHtml}${content}
        </div>
    </div>
`;

// --- 新增代码开始 ---
// 给气泡添加长按事件
const bubble = div.querySelector('.mod21-bubble');
if (bubble) {
    let pressTimer;
    bubble.addEventListener('mousedown', () => {
        pressTimer = window.setTimeout(() => {
            // 触发长按
            const replyToName = name;
            const replyToContent = content.substring(0, 20); // 截取部分内容作为预览
            showReplyBar(replyToName, replyToContent);
        }, 500); // 500ms 算作长按
    });
    bubble.addEventListener('mouseup', () => clearTimeout(pressTimer));
    bubble.addEventListener('mouseleave', () => clearTimeout(pressTimer));
    // 触摸事件支持
    bubble.addEventListener('touchstart', () => {
        pressTimer = window.setTimeout(() => {
            const replyToName = name;
            const replyToContent = content.substring(0, 20);
            showReplyBar(replyToName, replyToContent);
        }, 500);
    });
    bubble.addEventListener('touchend', () => clearTimeout(pressTimer));
    bubble.addEventListener('touchcancel', () => clearTimeout(pressTimer));
}
// --- 新增代码结束 ---
        }

        if (isAppend) {
            chatBox.appendChild(div);
            // --- 修改：根据条件滚动 ---
            if (shouldScroll) {
                chatBox.scrollTop = chatBox.scrollHeight;
            }
            // --- 修改结束 ---
        } else {
            // 插入到顶部
            chatBox.insertBefore(div, chatBox.firstChild);
        }
    }
 function renderMessageList() {
        const container = document.getElementById('mod21-msg-list-container');
        container.innerHTML = '';

        // 1. 渲染群组
        const groups = getGroupList();
        groups.forEach(groupName => {
            const lastMsg = getLastMessage(groupName, 'group');
            const unread = unreadCounts[groupName] || 0;
            createListItem(container, groupName, lastMsg, 'group', unread);
        });

        // 2. 渲染私聊
        const privateChats = getPrivateChatList();
        privateChats.forEach(memberName => {
            const lastMsg = getLastMessage(memberName, 'private');
            const unread = unreadCounts[memberName] || 0;
            createListItem(container, memberName, lastMsg, 'private', unread);
        });
    }

    // 创建列表项 DOM
    function createListItem(container, name, lastMsg, type, unreadCount) {
        const div = document.createElement('div');
        div.className = 'mod21-list-item';

        let preview = "暂无消息";
        let time = "";
        if (lastMsg) {
            const content = lastMsg[0] === 2 ? `[系统] ${lastMsg[2]}` : `${lastMsg[1]}: ${lastMsg[2]}`;
            preview = content.replace(/<[^>]+>/g, '[图片]').substring(0, 20);
            // 这里可以解析 lastMsg._ts 获取时间，简化处理
            time = "刚刚";
        }

        const avatarColor = type === 'group' ? '#0099ff' : stringToColor(name);
        const avatarText = type === 'group' ? '群' : name.charAt(0);

        div.innerHTML = `
            <div class="mod21-avatar" style="background:${avatarColor}; position:relative;">
                ${avatarText}
                ${unreadCount > 0 ? `<div class="mod21-badge">${unreadCount}</div>` : ''}
            </div>
            <div class="mod21-list-content">
                <div class="mod21-list-name">${name}</div>
                <div class="mod21-list-preview">${preview}</div>
            </div>
            <div class="mod21-list-time">${time}</div>
        `;

        div.onclick = () => openChat(name, type);
        container.appendChild(div);
    }

    // 渲染联系人列表
    function renderContactList() {
        const container = document.getElementById('mod21-contact-list-container');
        container.innerHTML = '';

        // 获取所有群的所有成员并去重
        const allMembers = new Set();
        getGroupList().forEach(g => {
            const members = getGroupMembers(g);
            Object.keys(members).forEach(m => allMembers.add(m));
        });

        allMembers.forEach(member => {
            if (member === '我' || member === '阿萨') return; // 排除自己

            const div = document.createElement('div');
            div.className = 'mod21-list-item';
            const color = stringToColor(member);

            div.innerHTML = `
                <div class="mod21-avatar" style="background:${color};">${member.charAt(0)}</div>
                <div class="mod21-list-content">
                    <div class="mod21-list-name">${member}</div>
                </div>
            `;
            div.onclick = () => openChat(member, 'private');
            container.appendChild(div);
        });
    }

    // 打开聊天窗口
    function openChat(targetId, type) {
        currentChatTarget = targetId;
        currentChatType = type;

        // 清除未读
        unreadCounts[targetId] = 0;
        updateUnreadUI();

        // 更新标题
        const chatTitle = document.querySelector('#mod21-chat-page .mod21-nav-title');
        if (type === 'group') {
            const count = Object.keys(getGroupMembers(targetId)).length;
            chatTitle.textContent = `${targetId}(${count})`;
        } else {
            chatTitle.textContent = targetId;
        }

        // 加载历史
        chatBox.innerHTML = '';
        isLoadingMore = false;
        hasMoreHistory = true;
        currentHistoryIndex = 0;
        loadMoreHistory();

        // 切换页面
        listPage.classList.remove('mod21-page-active');
        listPage.classList.add('mod21-page-inactive-left');
        chatPage.classList.remove('mod21-page-inactive-right');
        chatPage.classList.add('mod21-page-active');
    }
     document.querySelectorAll('.mod21-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mod21-tab-btn').forEach(b => {
                b.classList.remove('mod21-tab-active');
                b.style.color = '#999';
            });
            btn.classList.add('mod21-tab-active');
            btn.style.color = ''; // 恢复CSS定义的颜色

            const target = btn.getAttribute('data-target');
            if (target === 'msg') {
                document.getElementById('mod21-msg-list-container').style.display = 'block';
                document.getElementById('mod21-contact-list-container').style.display = 'none';
                document.getElementById('mod21-main-title').textContent = '消息';
                renderMessageList(); // 刷新列表
            } else if (target === 'contact') {
                document.getElementById('mod21-msg-list-container').style.display = 'none';
                document.getElementById('mod21-contact-list-container').style.display = 'block';
                document.getElementById('mod21-main-title').textContent = '联系人';
                renderContactList();
            }
        });
    });

    // 返回按钮逻辑更新
    btnBack.addEventListener('click', () => {
        currentChatTarget = null; // 退出聊天
        currentChatType = null;

        chatPage.classList.remove('mod21-page-active');
        chatPage.classList.add('mod21-page-inactive-right');
        listPage.classList.remove('mod21-page-inactive-left');
        listPage.classList.add('mod21-page-active');

        renderMessageList(); // 返回时刷新列表以更新预览
    });

    // 手机打开时
    aiOrbButton.addEventListener('click', () => {
        overlay.classList.remove('mod21-hidden');
        updateTime();
        renderMessageList(); // 初始渲染
    });
let currentReplyInfo = null; // 用于存储当前的回复对象

// 显示回复栏的函数
function showReplyBar(name, content) {
    let replyBar = document.getElementById('mod21-reply-bar');
    if (!replyBar) {
        replyBar = document.createElement('div');
        replyBar.id = 'mod21-reply-bar';
        replyBar.style.cssText = `
            padding: 5px 10px; background: #e8e8e8; font-size: 12px;
            color: #555; display: flex; justify-content: space-between;
            align-items: center; border-top: 1px solid var(--mod21-border);
        `;
        const inputBar = document.querySelector('.mod21-input-bar');
        inputBar.parentNode.insertBefore(replyBar, inputBar);
    }

      replyBar.innerHTML = `
        <span>回复 ${name}: ${content.replace(/<[^>]+>/g, '[图片]')}...</span>
        <button id="mod21-reply-cancel-btn" style="background:none; border:none; font-size:16px; cursor:pointer; color:#888;">×</button>
    `;
    replyBar.classList.remove('mod21-hidden');
    currentReplyInfo = { name, content };

    // 使用 addEventListener 绑定事件
    document.getElementById('mod21-reply-cancel-btn').addEventListener('click', hideReplyBar);
    
}

// 隐藏回复栏的函数
function hideReplyBar() {
    const replyBar = document.getElementById('mod21-reply-bar');
    if (replyBar) {
        replyBar.classList.add('mod21-hidden');
    }
    currentReplyInfo = null;
}
// --- 新增代码结束 ---
    // --- 5. 交互逻辑 ---
    const listPage = document.getElementById('mod21-list-page');
    const chatPage = document.getElementById('mod21-chat-page');
    const entryGroup = document.getElementById('mod21-entry-group');
    const btnBack = document.getElementById('mod21-btn-back');
    const btnSettings = document.getElementById('mod21-btn-settings');
    const settingsModal = document.getElementById('mod21-settings-modal');
    const btnSettingsClose = document.getElementById('mod21-settings-close');
    const inputField = document.getElementById('mod21-input');
    const sendBtn = document.getElementById('mod21-send');

    // 打开/关闭手机
 aiOrbButton.addEventListener('click', () => {
        overlay.classList.remove('mod21-hidden');
        updateTime();

        // --- 修改：重置并加载初始历史记录 ---
        chatBox.innerHTML = '';
        isLoadingMore = false;
        hasMoreHistory = true;
        currentHistoryIndex = 0;
        // 注意：这里我们只加载数据用于预览，而不渲染到聊天框
        const initialData = getGroupHistory(0, HISTORY_BATCH_SIZE);

        // --- 更新主界面最新消息预览 ---
        if (initialData.messages.length > 0) {
            const lastMsg = initialData.messages[initialData.messages.length - 1];
            const previewEl = document.querySelector('#mod21-entry-group .mod21-list-preview');
            if (previewEl) {
                let previewText = "";
                const type = lastMsg[0];
                const name = lastMsg[1];
                let content = lastMsg[2];
                if (type === 2) {
                    content = lastMsg[1] + ' ' + lastMsg[2];
                    previewText = `[系统消息] ${content.substring(0, 20)}...`;
                } else {
                    previewText = `${name}: ${content.substring(0, 20)}...`;
                }
                previewEl.textContent = previewText.replace(/<[^>]+>/g, '[图片]');
            }
        }
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.add('mod21-hidden');
        }
    });

    // 页面切换
  // --- 新增：用于跟踪加载状态的变量 ---
    let isLoadingMore = false;
    let hasMoreHistory = true;
    let currentHistoryIndex = 0;
    const HISTORY_BATCH_SIZE = 2; // 每次加载的时间戳数量

    entryGroup.addEventListener('click', () => {
        // --- 新增：动态获取成员数量并更新标题 ---
        const members = getGroupMembers();
        const memberCount = Object.keys(members).length;
        const chatTitle = document.querySelector('#mod21-chat-page .mod21-nav-title');
        if (chatTitle) {
            chatTitle.textContent = `异世界交流群(${memberCount})`;
        }
        // --- 修改结束 ---

        chatBox.innerHTML = ''; // 清空聊天框
        isLoadingMore = false;
        hasMoreHistory = true;
        currentHistoryIndex = 0;

        loadMoreHistory(); // 调用加载函数进行初始加载

        listPage.classList.remove('mod21-page-active');
        listPage.classList.add('mod21-page-inactive-left');
        chatPage.classList.remove('mod21-page-inactive-right');
        chatPage.classList.add('mod21-page-active');
    });
 // --- 新增：加载更多历史记录的函数 ---
    function loadMoreHistory() {
        if (isLoadingMore || !hasMoreHistory) return;

        isLoadingMore = true;

        // 在聊天框顶部显示加载提示
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'mod21-system-msg';
        loadingIndicator.textContent = '正在加载历史消息...';
        chatBox.insertBefore(loadingIndicator, chatBox.firstChild);

        // 异步加载，防止界面卡顿
       setTimeout(() => {
            const oldScrollHeight = chatBox.scrollHeight;
            // 使用新的 getChatHistory，传入 currentChatTarget 和 currentChatType
            const result = getChatHistory(currentChatTarget, currentChatType, currentHistoryIndex, HISTORY_BATCH_SIZE);
            // 移除加载提示
            loadingIndicator.remove();

            if (result.messages.length > 0) {
                // --- 核心修正：反向遍历数组 ---
                // 从旧到新的消息数组，我们需要从后往前（从新到旧）插入到顶部
                result.messages.reverse().forEach(msg => renderMessage(msg, false));

                // 保持滚动位置
                chatBox.scrollTop = chatBox.scrollHeight - oldScrollHeight;

                currentHistoryIndex += HISTORY_BATCH_SIZE;
            }

            hasMoreHistory = result.hasMore;
            if (!hasMoreHistory && chatBox.firstChild) {
                 // 如果没有更多消息了，显示提示
                const noMoreIndicator = document.createElement('div');
                noMoreIndicator.className = 'mod21-system-msg';
                noMoreIndicator.textContent = '没有更多历史消息了';
                chatBox.insertBefore(noMoreIndicator, chatBox.firstChild);
            }

            isLoadingMore = false;

            // 如果是初始加载，滚动到底部
            if (currentHistoryIndex === HISTORY_BATCH_SIZE) {
                 setTimeout(() => chatBox.scrollTop = chatBox.scrollHeight, 50);
            }

        }, 200); // 模拟网络延迟
    }

    // --- 新增：为聊天框添加滚动监听 ---
    chatBox.addEventListener('scroll', () => {
        // 当滚动到顶部时加载更多
        if (chatBox.scrollTop === 0 && !isLoadingMore && hasMoreHistory) {
            loadMoreHistory();
        }
    });
 btnBack.addEventListener('click', () => {
    chatPage.classList.remove('mod21-page-active');
    chatPage.classList.add('mod21-page-inactive-right');
    listPage.classList.remove('mod21-page-inactive-left');
    listPage.classList.add('mod21-page-active');

    // --- 新增代码开始 ---
    const history = getGroupHistory();
    if (history.length > 0) {
        const lastMsg = history[history.length - 1];
        const previewEl = document.querySelector('#mod21-entry-group .mod21-list-preview');
        if (previewEl) {
            let previewText = "";
            const type = lastMsg[0];
            const name = lastMsg[1];
            let content = lastMsg[2];

            if (type === 2) {
                // 系统消息的 content 就是通告内容
                previewText = `[系统消息] ${content.substring(0, 20)}...`;
            } else {
                // 普通消息
                previewText = `${name}: ${content.substring(0, 20)}...`;
            }
            // 替换图片占位符，避免显示原始标签
            previewEl.textContent = previewText.replace(/<图片id:[^>]+>/g, '[图片]');
        }
    }
    // --- 新增代码结束 ---
});

    // 设置
    btnSettings.addEventListener('click', () => {
        settingsModal.classList.remove('mod21-hidden');
        loadApiOptions();
    });
    btnSettingsClose.addEventListener('click', () => settingsModal.classList.add('mod21-hidden'));

    // 时间更新
    function updateTime() {
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        document.querySelector('.mod21-time').textContent = timeStr;
    }
    setInterval(updateTime, 60000);

    // --- 6. 发送与流式处理 ---
    let isGenerating = false;
    const generationId = 'mod21_qq_gen';

        async function handleSend() {
        // 1. 中止逻辑：如果正在生成，则调用 stopGenerationById
        if (isGenerating) {
            // 使用您提供的参考代码中的正确方法
            if (typeof stopGenerationById === 'function') {
                stopGenerationById(generationId); // generationId 是我们在下面定义的 'mod21_qq_gen'
            } else {
                showToast("中止功能当前不可用。");
                // 即使中止函数不可用，也尝试手动重置UI
                isGenerating = false;
                sendBtn.disabled = false;
                sendBtn.textContent = '发送';
                inputField.disabled = false;
            }
            // 注意：这里不立即重置UI，而是等待 GENERATION_ENDED 事件来处理，以确保流程统一
            return;
        }
        let text = inputField.value.trim();
        if (!text) return;

        // 渲染自己的消息
   let messageToSend;
    if (currentReplyInfo) {
        // 如果是回复状态
        const quoteText = `${currentReplyInfo.content.substring(0, 5)}...@${currentReplyInfo.name}`;
        messageToSend = [3, "我", text, quoteText];
        
        hideReplyBar(); // 发送后隐藏回复栏
    } else {
        // 普通消息
        messageToSend = [1, "我", text];
    }

    renderMessage(messageToSend);
        inputField.value = '';

        // --- 关键检查点 ---
        isGenerating = true;
        sendBtn.textContent = '中断';
        sendBtn.disabled = false; // <<<<<<< 确保按钮在变为“中断”后没有被禁用！
        inputField.disabled = true; // 只禁用输入框
         

        try {
            // --- 新增代码开始 ---
            // 1. 获取最近的时间戳
             const d = new Date();
            const newTimestamp = `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

        
            let messageArrayForMemory;
            if (currentReplyInfo) {
                 const quoteText = `${currentReplyInfo.content.substring(0, 5)}...@${currentReplyInfo.name}`;
                 messageArrayForMemory = `[3,"${SillyTavern.name1}","${text.replace(/"/g, '\\"')}","${quoteText.replace(/"/g, '\\"')}"]`;
            } else {
                 messageArrayForMemory = `[1,"${SillyTavern.name1}","${text.replace(/"/g, '\\"')}"]`;
            }
 let memoryKey = '';
        if (currentChatType === 'group') {
            memoryKey = `group_history.${currentChatTarget}.${newTimestamp}-user`;
        } else {
            memoryKey = `private_history.${currentChatTarget}.${newTimestamp}-user`;
        }
        const command = `memory('${memoryKey}', [${messageArrayForMemory}]);`;
            if (typeof processUpdateMemoryCommands === 'function') {
                await processUpdateMemoryCommands(command);
            } else {
                console.warn("processUpdateMemoryCommands function is not available.");
            }
             

             
            // 插入变量
            await TavernHelper.insertOrAssignVariables({ mod21玩家输入: text }, { type: 'chat' });

            // 组装 Prompt (这里简化，实际应调用 complex prompt)
            // 注意：这里需要根据你的实际环境调用 Tavern 的生成接口
            // 假设使用 generateRaw

            // 读取配置
            const specialBookNames = JSON.parse(localStorage.getItem('mod21_special_worldbooks') || '[]');
            const promptPrompts = await assembleComplexPrompt({
                specialBookNames: specialBookNames,
                targetBookNames: specialBookNames,
                continuationText: '',
                ignoreGlobalInjects: true
            });

            const generateConfig = {
                generation_id: generationId, should_stream: true, should_silence: true,
                overrides: {
                    world_info_before: '', persona_description: '', char_description: '',
                    char_personality: '', scenario: '', world_info_after: '',
                    dialogue_examples: '', chat_history: { prompts: [] }
                },
                max_chat_history: 0, ordered_prompts: promptPrompts
            };

            // API 配置 (略，复用之前的逻辑)
            const selectedApiId = document.getElementById('mod21-api-select').value;
             if (selectedApiId !== 'default' && selectedApiId !== 'custom_v2') {
                try {
                    const pool = JSON.parse(localStorage.getItem('nova_multi_api_pool') || '{}');
                    const apiData = pool[selectedApiId];
                    if (apiData) {
                        generateConfig.custom_api = {
                            apiurl: apiData.api_url, key: apiData.api_key, model: apiData.model,
                            source: apiData.source || 'openai', max_tokens: apiData.max_tokens,
                            temperature: apiData.temperature, top_p: apiData.top_p,
                            frequency_penalty: apiData.frequency_penalty, presence_penalty: apiData.presence_penalty
                        };
                    }
                } catch (e) { console.error("API Config Error", e); }
            }

            await generateRaw(generateConfig);

        } catch (e) {
            console.error(e);
            isGenerating = false;
            sendBtn.textContent = '发送';
            sendBtn.disabled = false;
            inputField.disabled = false;
            showToast("发送失败");
        }
    }

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // 流式监听
    let buffer = "";
    let isInsideChat = false;

    eventOn(iframe_events.GENERATION_STARTED, (id) => {
        if (id === generationId) {
            buffer = "";
            isInsideChat = false;
        }
    });

    eventOn(iframe_events.STREAM_TOKEN_RECEIVED_INCREMENTALLY, (text, id) => {
        if (id === generationId) {
            buffer += text;

            // 检测 <chat> 开始
            if (!isInsideChat && buffer.includes('<chat>')) {
                isInsideChat = true;
                buffer = buffer.split('<chat>')[1]; // 丢弃前面的思考过程
            }

            if (isInsideChat) {
                // 尝试解析 buffer 中的数组
                // 格式通常是 memory('...',[ [1...], [1...] ]);
                // 我们需要提取 [] 里面的内容
                // 这是一个简化的流式解析器，寻找完整的 [x,x,x] 模式

                 const regex = /\[\s*(\d+)\s*,\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*"((?:[^"\\]|\\.)*)")?(?:\s*,\s*"((?:[^"\\]|\\.)*)")?\s*\]/g;
                let match;

                while ((match = regex.exec(buffer)) !== null) {
                    const type = parseInt(match[1]);
                    const field1 = match[2].replace(/\\"/g, '"');
                    const field2 = match[3].replace(/\\"/g, '"');
                    const field3 = match[4] ? match[4].replace(/\\"/g, '"') : null;

                    let msgArray;
                    if (type === 2) {
                        // 系统消息: [2, "通知人", "通告内容"]
                        msgArray = [type, field1, field2];
                    } else {
                        // 其他消息: [type, "名字", "内容", "引用"]
                        msgArray = [type, field1, field2, field3];
                    }

                    renderMessage(msgArray);

                    // 截断 buffer，保留未匹配的部分
                    buffer = buffer.substring(match.index + match[0].length);
                    regex.lastIndex = 0; // 重置正则索引
                }
            }

            // 检测 </chat>
            if (buffer.includes('</chat>')) {
                isInsideChat = false;
                // 结束
            }
        }
    });
 let lastRawResponse = "还没有收到任何AI的响应。";

    // 为新按钮添加事件监听
    const btnRawText = document.getElementById('mod21-btn-raw-text');
    btnRawText.addEventListener('click', () => {
        // 创建一个简单的模态框来显示原始文本
        const rawTextModal = document.createElement('div');
        rawTextModal.style.cssText = `
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); z-index: 101;
            display: flex; justify-content: center; align-items: center; padding: 20px;
        `;
        rawTextModal.innerHTML = `
        <div style="background: #fff; padding: 15px; border-radius: 8px; width: 100%; max-height: 90%; overflow-y: auto; display: flex; flex-direction: column;">
            <h4 style="margin-top:0;">AI 原始响应</h4>
            <pre style="white-space: pre-wrap; word-wrap: break-word; font-size: 12px; background: #f0f0f0; color:black;padding: 10px; border-radius: 4px; flex-grow: 1;">${lastRawResponse}</pre>
            <button onclick="this.closest('.mod21-raw-text-modal').remove()" style="width: 100%; padding: 10px; background: var(--mod21-primary-color); color: #fff; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">关闭</button>
        </div>
    `;
    // 给父级添加一个唯一的类名，方便定位
    rawTextModal.classList.add('mod21-raw-text-modal');
    document.querySelector('.mod21-phone-wrapper').appendChild(rawTextModal);
});
 
 eventOn(iframe_events.GENERATION_ENDED, async (final_text, id) => {
        // 只有匹配 generationId 时才处理
        if (id === generationId) {
            // 检查 isGenerating 标志，防止多次触发
            if (isGenerating) {
                isGenerating = false;
                sendBtn.disabled = false;
                sendBtn.textContent = '发送';
                inputField.disabled = false;

                // 只有在不是手动中止（即final_text有内容）的情况下才处理后续
                if (final_text) {
                    if (typeof processUpdateMemoryCommands === 'function') {
                        isGenerating = false;
                        lastRawResponse = final_text;
                        await processUpdateMemoryCommands(final_text);
                    }
                    setTimeout(() => {
                        if (typeof initDisplay === 'function') {
                            initDisplay(false);
                        }
                    }, 1000);
                }
            }
        }
    });
    // --- 7. API 选择器逻辑 (复用) ---
    function loadApiOptions() {
        const selector = document.getElementById('mod21-api-select');
        const currentValue = localStorage.getItem('mod21_selected_api') || 'default';
        let html = `<option value="default" ${currentValue === 'default' ? 'selected' : ''}>Default</option>`;

        try {
            const pool = JSON.parse(localStorage.getItem('nova_multi_api_pool') || '{}');
            Object.keys(pool).forEach(id => {
                html += `<option value="${id}" ${currentValue === id ? 'selected' : ''}>${pool[id].name || id}</option>`;
            });
        } catch (e) {}
        selector.innerHTML = html;

        selector.onchange = () => localStorage.setItem('mod21_selected_api', selector.value);
    }

    // 世界书配置按钮逻辑 (复用之前的模态框，这里只绑定事件)
  if (!document.querySelector('.mod21-wb-modal')) {
        const wbModal = document.createElement('div');
        wbModal.className = 'mod21-wb-modal mod21-hidden'; // 使用新样式
        wbModal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 80%; max-width: 450px; max-height: 60vh;
            background-color: #fff; border: 1px solid #ccc;
            border-radius: 8px; z-index: 10001; display: flex; flex-direction: column;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
        `;
        wbModal.innerHTML = `
            <div style="padding: 10px 15px; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold;">选择世界书</span>
                <button class="mod21-wb-close" style="color:black;background:none;border:none;font-size:20px;cursor:pointer;">×</button>
            </div>
            <div class="mod21-wb-modal-content" style="padding: 15px; overflow-y: auto; flex-grow: 1;"></div>
            <div style="padding: 10px; border-top: 1px solid #ccc; text-align: right;">
                <button class="mod21-wb-save-button" style="padding: 8px 16px; background: #0099ff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">保存</button>
            </div>
        `;
        document.body.appendChild(wbModal);
    }

    const wbModal = document.querySelector('.mod21-wb-modal');
    const wbModalContent = wbModal.querySelector('.mod21-wb-modal-content');
    const wbModalCloseButton = wbModal.querySelector('.mod21-wb-close');
    const wbModalSaveButton = wbModal.querySelector('.mod21-wb-save-button');

    async function openWorldbookSelector() {
        wbModal.classList.remove('mod21-hidden');
        settingsModal.classList.add('mod21-hidden'); // 关闭设置弹窗
        wbModalContent.innerHTML = '<p>加载中...</p>';
        try {
            const allBookNames = await TavernHelper.getWorldbookNames();
            const savedBooks = JSON.parse(localStorage.getItem('mod21_special_worldbooks') || '[]');

            if (!allBookNames || allBookNames.length === 0) {
                wbModalContent.innerHTML = '<p>未找到世界书。</p>';
                return;
            }

            let contentHTML = allBookNames.map(bookName => {
                const isChecked = savedBooks.includes(bookName);
                return `<label style="display:block; margin-bottom:10px;color:black;"><input type="checkbox" value="${bookName}" ${isChecked ? 'checked' : ''}> ${bookName}</label>`;
            }).join('');
            wbModalContent.innerHTML = contentHTML;
        } catch (e) {
            wbModalContent.innerHTML = '<p style="color: red;">加载世界书列表失败。</p>';
        }
    }

    function saveWorldbookSelection() {
        const selectedBooks = Array.from(wbModalContent.querySelectorAll('input:checked')).map(cb => cb.value);
        localStorage.setItem('mod21_special_worldbooks', JSON.stringify(selectedBooks));
        wbModal.classList.add('mod21-hidden');
        showToast('世界书配置已保存');
    }

    wbModalCloseButton.addEventListener('click', () => wbModal.classList.add('mod21-hidden'));
    wbModalSaveButton.addEventListener('click', saveWorldbookSelection);

    // 绑定到设置弹窗里的按钮
    document.getElementById('mod21-wb-config').addEventListener('click', openWorldbookSelector);

    // API 加载逻辑
    function loadApiOptions() {
        const selector = document.getElementById('mod21-api-select');
        const currentValue = localStorage.getItem('mod21_selected_api') || 'default';
        let html = `<option value="default" ${currentValue === 'default' ? 'selected' : ''}>Default</option>`;
        html += `<option value="custom_v2" ${currentValue === 'custom_v2' ? 'selected' : ''}>API 2 (Legacy)</option>`;

        try {
            const pool = JSON.parse(localStorage.getItem('nova_multi_api_pool') || '{}');
            Object.keys(pool).forEach(id => {
                const name = pool[id].name || `Custom API (${id})`;
                html += `<option value="${id}" ${currentValue === id ? 'selected' : ''}>${name}</option>`;
            });
        } catch (e) {
            console.error("加载API池失败", e);
        }
        selector.innerHTML = html;

        selector.onchange = () => {
            localStorage.setItem('mod21_selected_api', selector.value);
            showToast('API已切换');
        };
    }

})();
