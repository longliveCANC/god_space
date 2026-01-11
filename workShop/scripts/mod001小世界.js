(function() {
    'use strict';

    // ====================================================================
    // ** 核心配置与常量 **
    // ====================================================================
    const PREFIX = 'mod001';

    const PATHS = {
        SHOP: 'global_lore.youxijishangcheng',
        ARCHIVE: 'global_lore.youxidangan',
        WAREHOUSE: 'global_lore.youxiijicangku'
    };

    const DOM_IDS = {
        STYLE: `${PREFIX}_full_style`,
        MENU_BALL: `${PREFIX}_menu_ball`,
        MENU_MODAL: `${PREFIX}_menu_modal`,
        CONTAINER_SHOP: `${PREFIX}_shop_container`,
        CONTAINER_ARCHIVE: `${PREFIX}_archive_container`,
        CONTAINER_WAREHOUSE: `${PREFIX}_warehouse_container`,
        ORB_CONTAINER: 'orb-container',
        BTN_UPGRADE: `${PREFIX}_upgrade_btn`,
        BTN_ARCHIVE: `${PREFIX}_menu_archive_btn`,
        BTN_WAREHOUSE: `${PREFIX}_menu_warehouse_btn`
    };

    const CLASSES = {
        BTN_ADD_CART: `${PREFIX}_add_to_cart_btn`,
        BTN_REMOVE_CART: `${PREFIX}_remove_btn`,
        BTN_CHECKOUT: `${PREFIX}_checkout_btn`,
        BTN_TAB: `${PREFIX}_tab_btn`,
        BTN_GAME_TAB: `${PREFIX}_char_tab_btn`,
        BTN_SUB_TAB: `${PREFIX}_sub_tab_btn`,
        BTN_CLOSE: `${PREFIX}_close_btn`,
        BTN_WH_ACTION: `${PREFIX}_wh_action_btn`
    };

    let CART_ITEMS = [];

    const SHOP_CATEGORIES = [
        { key: '付费游戏', title: '付费游戏' },
        { key: '免费游戏', title: '免费游戏' },
        { key: '商城道具', title: '🔮 商城道具' },
        { key: '购物车', title: '🛒 购物车' }
    ];

    // ====================================================================
    // ** 1. 工具函数 **
    // ====================================================================

    function removeOldDataOrb() {
        const idsToRemove = ['assa-data-orb', `${PREFIX}_shop_ball`, `${PREFIX}_menu_ball`];
        idsToRemove.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const prev = el.previousElementSibling;
                if (prev && prev.classList.contains('orb-divider')) prev.remove();
                el.remove();
            }
        });
    }

    function getNestedData(path) {
        const data = window.GameAPI ? window.GameAPI.assaData : null;
        if (!data) return null;
        let result = path.split('.').reduce((acc, part) => (acc && acc[part]) ? acc[part] : null, data);
        if (result && typeof result === 'string') {
            try { result = JSON.parse(result); } catch (e) { console.warn(`[${PREFIX}] JSON解析警告`, e); }
        }
        return result;
    }

    function formatBigNumber(num) {
        if (isNaN(num)) return num;
        const n = parseFloat(num);
        if (n >= 100000000) return (n / 100000000).toFixed(1).replace(/\.0$/, '') + '亿';
        if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '万';
        return n;
    }

    function safeAlert(msg) {
        if (window.worldHelper && typeof window.worldHelper.showNovaAlert === 'function') {
            window.worldHelper.showNovaAlert(msg);
        } else {
            alert(msg);
        }
    }

    function safeTrigger(command) {
        if (window.GameAPI && typeof window.GameAPI.triggerassa === 'function') {
            window.GameAPI.triggerassa(command);
            return true;
        } else {
            console.error(`[${PREFIX}] triggerassa Missing`);
            alert('无法发送指令');
            return false;
        }
    }

    const EscManager = {
        handler: null,
        bind: function(callback) {
            this.unbind();
            this.handler = (e) => {
                if (e.key === 'Escape') {
                    callback();
                    this.unbind();
                }
            };
            document.addEventListener('keydown', this.handler);
        },
        unbind: function() {
            if (this.handler) {
                document.removeEventListener('keydown', this.handler);
                this.handler = null;
            }
        }
    };

    function hideAllContainers() {
        [DOM_IDS.CONTAINER_SHOP, DOM_IDS.CONTAINER_ARCHIVE, DOM_IDS.CONTAINER_WAREHOUSE, DOM_IDS.MENU_MODAL].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        EscManager.unbind();
    }

    // ====================================================================
    // ** 2. 业务逻辑 **
    // ====================================================================

    function handleUpgradeShop() {
        if (safeTrigger(`/setinput 李境点击升级按钮，升级游戏商城`)) {
            safeAlert("已发送升级请求！请等待AI响应。");
        }
    }

    function addToCart(name, type, baseCost, target) {
        let finalCost = parseInt(baseCost);
        let targetName = "";
        if (type === '商城道具') {
            if (target === 'real') { finalCost = finalCost * 2; targetName = " (至现实仓库)"; }
            else { targetName = " (至游戏仓库)"; }
        }
        CART_ITEMS.push({ name: name, type: type, target: target, cost: finalCost });
        const cartTab = document.getElementById(`${PREFIX}_tab_btn_购物车`);
        if (cartTab && cartTab.classList.contains('active')) renderCartSection();
        safeAlert(`已将 《${name}》${targetName} 加入购物车，花费 ${finalCost} 功勋。`);
    }

    function removeFromCart(index) {
        if (index >= 0 && index < CART_ITEMS.length) {
            const item = CART_ITEMS.splice(index, 1)[0];
            safeAlert(`已将 《${item.name}》 移出购物车。`);
            renderCartSection();
        }
    }

    function handleCheckout() {
        if (CART_ITEMS.length === 0) { safeAlert("购物车是空的！"); return; }
        const itemList = CART_ITEMS.map(i => {
            let targetDesc = i.target === 'game' ? "[存入游戏仓库]" : (i.target === 'real' ? "[存入现实仓库]" : "");
            return `《${i.name}》${targetDesc}(${i.cost})`;
        }).join('; ');
        const totalCost = CART_ITEMS.reduce((sum, i) => sum + i.cost, 0);
        if (safeTrigger(`/setinput 李境结算了商城购物车。总计花费 ${totalCost} 功勋。购买详细清单：${itemList}。请根据清单将物品分别写入[游戏仓库]或[现实仓库]，并扣除功勋。`)) {
            CART_ITEMS = []; renderCartSection(); safeAlert(`结算指令已发送！总计消费 ${totalCost} 功勋。`);
        }
    }

    function handleWarehouseAction(name, actionKey, quantity) {
        if (!quantity || parseInt(quantity) <= 0) { safeAlert("库存不足，无法操作！"); return; }
        let command = actionKey === 'real'
            ? `/setinput 李境在游戏机仓库中选择了【现实物品：${name}】，并点击了“具现”按钮。`
            : `/setinput 李境在游戏机仓库中选择了【游戏道具：${name}】，并点击了“携带”按钮，准备将其带入游戏。`;
        if (safeTrigger(command)) safeAlert(`指令已发送: 请求${actionKey === 'real' ? '具现' : '携带'} ${name}`);
    }

    // ====================================================================
    // ** 3. 渲染逻辑 **
    // ====================================================================

    const htmlStars = (count) => {
        const num = Math.min(5, Math.max(0, parseInt(count) || 0));
        return `<span class="${PREFIX}_star_rating">${'★'.repeat(num)}</span>`;
    };

    const safe = (obj) => obj || {};

    const htmlProgress = (label, value, colorClass = '') => {
        const safeValue = String(value != null ? value : '0');
        const pct = safeValue.match(/\d+(\.\d+)?/) ? parseFloat(safeValue.match(/\d+(\.\d+)?/)[0]) : 0;
        let color = '#418d2d';
        if (colorClass === 'energy') color = '#00bfff';
        else if (colorClass === 'exp') color = '#ffd700';
        else if (colorClass === 'special') color = '#be2ed6';
        else if (colorClass === 'danger') color = '#cc3131';
        else if (colorClass === 'science') color = '#00ced1';

        let width = 0;
        if (safeValue.includes('%')) width = pct;
        else if (pct <= 100 && pct > 0) width = pct;
        else if (pct > 100) width = 100;

        return `
            <div class="${PREFIX}_stat_widget">
                <div class="${PREFIX}_stat_top"><span class="${PREFIX}_stat_label">${label}</span><span class="${PREFIX}_stat_val_text">${safeValue}</span></div>
                <div class="${PREFIX}_progress_track"><div class="${PREFIX}_progress_fill" style="width: ${width}%; background-color: ${color}; box-shadow: 0 0 10px ${color}80;"></div></div>
            </div>`;
    };

    const renderStatusBar = (statusMap) => {
        if (!statusMap || Object.keys(statusMap).length === 0) return '';
        const items = Object.entries(statusMap).map(([key, data]) => {
            const name = data.状态名称 || data.name || key;
            const desc = data.状态描述 || data.desc || '无描述';
            const effect = data.状态效果 || data.影响 || '无效果';
            const type = data.状态类型 || '正面';
            let pillClass = type === '负面' ? 'debuff' : (type === '中性' ? 'neutral' : 'buff');
            let icon = type === '负面' ? '▼' : (type === '中性' ? '●' : '▲');
            return `
            <div class="${PREFIX}_status_pill ${pillClass}">
                <span class="status-icon" style="font-size: 1.2em; line-height: 1;">${icon}</span>
                <span class="status-text">${name}</span>
                <div class="${PREFIX}_status_tooltip">
                    <div class="st-head">${name} <span style="opacity:0.6;font-size:0.8em;font-weight:normal">(${type})</span></div>
                    <div class="st-row">📝 ${desc}</div>
                    <div class="st-row">⚡ ${effect}</div>
                </div>
            </div>`;
        }).join('');
        return `<div class="${PREFIX}_status_container"><div class="${PREFIX}_section_label_sm">状态</div><div class="${PREFIX}_status_grid">${items}</div></div>`;
    };

    // ====================================================================
    // ** 核心渲染：二级模块化游戏档案 (修复版) **
    // ====================================================================
    function renderArchiveContent(archiveData) {
        if (!archiveData || typeof archiveData !== 'object') return { tabs: '', panels: '<div class="empty-tip">档案数据为空</div>' };

        if (archiveData['架构模式'] || archiveData['游戏角色'] || archiveData['游戏世界观简介']) {
            const fallbackName = archiveData['实体名称'] || (archiveData.游戏角色 && archiveData.游戏角色.实体名称) || '当前游戏(自动修复)';
            archiveData = { [fallbackName]: archiveData };
        }

        const gameNames = Object.keys(archiveData);
        const tabs = gameNames.map((name, i) => `<button class="${CLASSES.BTN_GAME_TAB} ${i===0?'active':''}" data-target="${name}">${name}</button>`).join('');

        const panels = Object.entries(archiveData).map(([gameName, gameData], i) => {
            const meta = safe(gameData);
            const isStrategyMode = meta.架构模式 === '经营实体';
            const charData = safe(meta.游戏角色);
            const taskData = safe(meta.游戏任务);
            const npcData = safe(meta.游戏NPC);
            const worldDesc = meta.游戏世界观简介 || meta.游戏背景 || '暂无简介';
            const statusStr = meta.档案状态 || '进行中';

            // --- 模块 1: 世界概览 ---
            const htmlWorld = `
                <div class="${PREFIX}_world_hero_banner ${statusStr==='已通关'?'completed':'ongoing'}">
                    <div class="banner_content">
                        <h1>${gameName} <span style="font-size:0.6em; vertical-align: middle; margin-left: 8px;">${htmlStars(meta.游戏星级)}</span></h1>
                        <span class="status_badge">${statusStr}</span>
                    </div>
                    <div class="banner_meta">
                        <div class="meta_item"><span class="label">架构</span><span class="value">${meta.架构模式||'N/A'}</span></div>
                        <div class="meta_item"><span class="label">位置</span><span class="value">${charData.总部位置||charData.当前位置||'未知'}</span></div>
                    </div>
                </div>
                <div class="${PREFIX}_detail_block full-width" style="margin-top:20px;">
                    <h4>🌍 世界背景</h4>
                    <div class="${PREFIX}_text_desc" style="white-space: pre-wrap;">${worldDesc}</div>
                </div>
            `;

            // --- 模块 2: 角色/实体 ---
            let htmlChar = '';
            if (isStrategyMode) {
                 const wh = safe(meta.游戏仓库);
                 // [NEW] 提取并渲染属性 (适配 经营模式下的 指挥官/代理人 属性)
                 const coreAttrs = safe(charData.核心属性);
                 const attrHtml = ['生理','心智','互动'].map(k => {
                    const group = safe(coreAttrs[`${k}属性`]);
                    if(Object.keys(group).length === 0) return '';
                    const inner = Object.entries(group).map(([p,v]) =>
                        `<div class="${PREFIX}_grid_stat_item"><span class="stat_k">${p}</span><span class="stat_v">${v}</span></div>`
                    ).join('');
                    return `<div class="${PREFIX}_detail_block"><h4>${k} (代理人)</h4><div class="${PREFIX}_grid_stats_container">${inner}</div></div>`;
                 }).join('');

                 const resHtml = Object.entries(safe(wh.核心资源)).map(([k,v])=>{
                     let qty = (typeof v==='object')?v.数量:v; let unit = (typeof v==='object')?(v.单位||''):'';
                     return `<div class="${PREFIX}_resource_chip"><div class="res-icon">💠</div><div class="res-main"><div class="res-name">${k}</div><div class="res-val">${formatBigNumber(qty)} <span style="font-size:0.8em">${unit}</span></div></div></div>`;
                 }).join('');
                 const metricsHtml = Object.entries(safe(wh.宏观指标)).map(([k,v])=>`<div class="${PREFIX}_metric_card"><div class="metric-head">${k}</div><div class="metric-val">${v}</div></div>`).join('');
                 const techs = (charData.已解锁科技||[]).map(t=>`<span class="${PREFIX}_tech_tag">🧬 ${t}</span>`).join('');
                 const policies = (charData.当前政策||[]).map(p=>`<span class="${PREFIX}_policy_tag">📜 ${p}</span>`).join('');

                 htmlChar = `
                 <div class="${PREFIX}_char_dashboard_layout strategy-mode">
                    <div class="${PREFIX}_char_sidebar_profile">
                        <div class="${PREFIX}_profile_header"><div class="${PREFIX}_profile_avatar_placeholder empire">${gameName[0]}</div><h2 class="${PREFIX}_profile_name">${charData.实体名称||gameName}</h2><span class="${PREFIX}_profile_lvl">${charData.经营等级||'实体'}</span></div>
                        <div class="${PREFIX}_section_divider small"><span>核心资源</span></div><div class="${PREFIX}_resource_chip_grid">${resHtml||'<div class="empty-tip">无资源</div>'}</div>
                        ${renderStatusBar(safe(charData.状态栏))}
                    </div>
                    <div class="${PREFIX}_char_main_content">
                        <!-- [NEW] Insert Attributes Grid Here -->
                        ${attrHtml ? `<div class="${PREFIX}_three_col_grid">${attrHtml}</div>` : ''}

                        <div class="${PREFIX}_detail_block full-width"><h4>📊 指标</h4><div class="${PREFIX}_metrics_grid">${metricsHtml}</div></div>
                        <div class="${PREFIX}_content_grid_2col" style="margin-top:15px;">
                             <div class="${PREFIX}_detail_block"><h4>🧬 科技</h4><div class="tags-wrapper">${techs||'无'}</div></div>
                             <div class="${PREFIX}_detail_block"><h4>📜 政策</h4><div class="tags-wrapper">${policies||'无'}</div></div>
                        </div>
                    </div>
                 </div>`;
            } else {
                // (RPG模式逻辑保持不变)
                const st = safe(charData.当前状态);
                const stats = `${htmlProgress('HP', st.HP)}${htmlProgress('MP', st.MP||st.EN, 'energy')}${htmlProgress('EXP', st.经验值, 'exp')}`;
                const coreAttrs = safe(charData.核心属性);
                const gridHtml = ['生理','心智','互动'].map(k => {
                    const inner = Object.entries(safe(coreAttrs[`${k}属性`])).map(([p,v]) => `<div class="${PREFIX}_grid_stat_item"><span class="stat_k">${p}</span><span class="stat_v">${v}</span></div>`).join('');
                    return `<div class="${PREFIX}_detail_block"><h4>${k}</h4><div class="${PREFIX}_grid_stats_container">${inner}</div></div>`;
                }).join('');
                const skills = ['主动','被动'].map(k=>Object.entries(safe(safe(charData.技能列表)[`${k}技能`])).map(([n,v])=>`<div class="${PREFIX}_mini_skill_card"><div class="msk_head"><span>${n}</span>${htmlStars(v.星级)}</div><div class="msk_desc">${v.简介||'无'}</div></div>`).join('')).join('');

                htmlChar = `
                <div class="${PREFIX}_char_dashboard_layout">
                    <div class="${PREFIX}_char_sidebar_profile">
                        <div class="${PREFIX}_profile_header"><div class="${PREFIX}_profile_avatar_placeholder">${charData.姓名?charData.姓名[0]:'?'}</div><h2 class="${PREFIX}_profile_name">${charData.姓名||'???'}</h2><span class="${PREFIX}_profile_lvl">${charData.游戏等级||'Lv.?'}</span></div>
                        <div class="${PREFIX}_profile_base_stats">${stats}</div>
                        ${renderStatusBar(safe(st.状态栏))}
                        <div class="${PREFIX}_profile_tags"><div class="tags-wrapper">${Object.entries({...safe(charData.性格属性.表性格),...safe(charData.性格属性.里性格)}).map(([k,v])=>`<span class="${PREFIX}_tag_pill" title="${v}">${k}</span>`).join('')}</div></div>
                    </div>
                    <div class="${PREFIX}_char_main_content">
                        <div class="${PREFIX}_three_col_grid">${gridHtml}</div>
                        <div class="${PREFIX}_section_divider small"><span>技能</span></div>
                        <div class="${PREFIX}_skill_flex_container">${skills}</div>
                    </div>
                </div>`;
            }

            // --- 模块 2.5/3/4/5 (保持不变) ---
            const npcHtmlInner = Object.entries(npcData).map(([n, d]) => {
                let attitudeColor = '#8a96a3';
                const rel = d.好感度 ? String(d.好感度) : '中立';
                if(rel.includes('友善') || rel.includes('贸易') || rel.includes('盟友')) attitudeColor = '#5aa63b';
                if(rel.includes('敌对') || rel.includes('宣战') || rel.includes('仇恨')) attitudeColor = '#cc3131';
                if(rel.includes('崇拜') || rel.includes('附庸')) attitudeColor = '#be2ed6';

                return `
                <div class="${PREFIX}_npc_card">
                    <div class="npc_head">
                        <span class="npc_name">${n}</span>
                        <span class="npc_role">${d.身份 || '未知'}</span>
                    </div>
                    <div class="npc_desc">${d.简介 || '暂无描述...'}</div>
                    <div class="npc_foot">
                         <span class="npc_tag" style="border-color:${attitudeColor};color:${attitudeColor}">${rel}</span>
                         <span class="npc_tag status" style="${(d.状态||'').includes('死') || (d.状态||'').includes('灭')?'color:#cc3131;border-color:#cc3131':''}">${d.状态 || '未知'}</span>
                    </div>
                </div>`;
            }).join('');
            const htmlNPC = `
            <div class="${PREFIX}_detail_block full-height">
                <h4>👥 关键人物/势力档案</h4>
                <div class="${PREFIX}_npc_grid">${npcHtmlInner || '<div class="empty-tip">暂无记录</div>'}</div>
            </div>`;

            const clues = (meta.游戏线索||[]).map(c=>`<div class="${PREFIX}_clue_item"><span class="clue-icon">🔍</span><span class="clue-text">${c}</span></div>`).join('');
            const tasks = `<div class="${PREFIX}_task_item main"><strong>【主线】</strong> ${taskData.主线任务||taskData.经营目标||'无'}</div>` +
                          (taskData.支线任务||taskData.突发事件||[]).map(t=>`<div class="${PREFIX}_task_item side"><strong>【支线】</strong> ${t}</div>`).join('');
            const htmlQuest = `
            <div class="${PREFIX}_content_grid_2col">
                <div class="${PREFIX}_detail_block"><h4>📜 任务面板</h4><div class="${PREFIX}_task_panel">${tasks}</div></div>
                <div class="${PREFIX}_detail_block"><h4>🧩 线索板</h4><div class="${PREFIX}_clue_list">${clues||'<div class="empty-tip">无线索</div>'}</div></div>
            </div>`;

            const mobsHtml = Object.entries(safe(meta.敌怪图鉴)).map(([n,d])=>`<div class="${PREFIX}_monster_card"><div class="m_header"><span class="m_name">${n}</span><span class="m_weak">弱: ${d.弱点}</span></div><div class="m_desc">${d.描述}</div></div>`).join('');
            const htmlBestiary = `
            <div class="${PREFIX}_detail_block full-height">
                <h4>💀 敌怪图鉴</h4>
                <div class="${PREFIX}_monster_grid">${mobsHtml||'<div class="empty-tip">暂无记录</div>'}</div>
            </div>`;

            let htmlAssets = '';
            if(isStrategyMode) {
                 const assetsHtml = Object.entries(safe(safe(meta.游戏仓库).实体资产)).map(([k, v]) => {
                     const type = v.类型 || '资产';
                     const status = v.状态 || '运营中';
                     const level = v['规模/等级'] || v.等级 || 1;
                     const isSpecial = /遗珍|神器|关键|物品|道具/.test(type);
                     const icon = isSpecial ? '🧩' : '🏭';
                     return `
                     <div class="${PREFIX}_inv_slot">
                        <div class="inv_icon">${icon}</div>
                        <div class="inv_info">
                            <div class="inv_name" style="${isSpecial?'color:#ffd700':''}">${k}</div>
                            <div class="inv_qty">Lv.${level}</div>
                        </div>
                        <div class="${PREFIX}_status_tooltip">
                            <div class="st-head">${k}</div>
                            <div class="st-row">📋 类型: ${type}</div>
                            <div class="st-row">📡 状态: ${status}</div>
                        </div>
                     </div>`;
                }).join('');
                htmlAssets = `
                <div class="${PREFIX}_detail_block">
                    <h4>🏭 实体资产库</h4>
                    <div class="${PREFIX}_inventory_grid">${assetsHtml || '<div class="empty-tip">无实体资产</div>'}</div>
                </div>`;
            } else {
                const bp = safe(meta.游戏背包);
                const inv = Object.entries(safe(bp.物品清单)).map(([n,v])=>`<div class="${PREFIX}_inv_slot"><div class="inv_icon">📦</div><div class="inv_info"><div class="inv_name">${n}</div><div class="inv_qty">x${v.数量||1}</div></div><div class="${PREFIX}_status_tooltip"><div class="st-head">${n}</div><div class="st-row">📝 ${v.简介||'无'}</div></div></div>`).join('');
                htmlAssets = `
                <div class="${PREFIX}_detail_block"><h4>🎒 随身背包 (金币: ${bp.游戏内货币||0})</h4>
                    ${bp.游戏载具?`<div style="padding:10px;border:1px solid #f2c94c;color:#f2c94c;margin-bottom:10px;border-radius:4px;">🚀 载具: ${bp.游戏载具}</div>`:''}
                    <div class="${PREFIX}_inventory_grid">${inv||'<div class="empty-tip">背包为空</div>'}</div>
                </div>`;
            }

            return `
            <div id="${PREFIX}_panel_${gameName}" class="${PREFIX}_char_panel_wrapper" style="display:${i===0?'block':'none'}">
                <div class="${PREFIX}_sub_nav">
                    <button class="${CLASSES.BTN_SUB_TAB} active" data-parent="${gameName}" data-section="world">🌍 世界背景</button>
                    <button class="${CLASSES.BTN_SUB_TAB}" data-parent="${gameName}" data-section="char">👤 ${isStrategyMode?'经营实体':'角色状态'}</button>
                    <button class="${CLASSES.BTN_SUB_TAB}" data-parent="${gameName}" data-section="npc">👥 NPC</button>
                    <button class="${CLASSES.BTN_SUB_TAB}" data-parent="${gameName}" data-section="quest">📜 任务线索</button>
                    <button class="${CLASSES.BTN_SUB_TAB}" data-parent="${gameName}" data-section="bestiary">💀 敌怪图鉴</button>
                    <button class="${CLASSES.BTN_SUB_TAB}" data-parent="${gameName}" data-section="assets">🎒 ${isStrategyMode?'资产':'背包'}</button>
                </div>
                <div id="content_${gameName}_world" class="${PREFIX}_sub_section">${htmlWorld}</div>
                <div id="content_${gameName}_char" class="${PREFIX}_sub_section" style="display:none;">${htmlChar}</div>
                <div id="content_${gameName}_npc" class="${PREFIX}_sub_section" style="display:none;">${htmlNPC}</div>
                <div id="content_${gameName}_quest" class="${PREFIX}_sub_section" style="display:none;">${htmlQuest}</div>
                <div id="content_${gameName}_bestiary" class="${PREFIX}_sub_section" style="display:none;">${htmlBestiary}</div>
                <div id="content_${gameName}_assets" class="${PREFIX}_sub_section" style="display:none;">${htmlAssets}</div>
            </div>`;
        }).join('');

        return { tabs, panels };
    }

    // ====================================================================
    // ** 4. 容器与交互 **
    // ====================================================================

    function getOrCreateContainer(id, flexMode = false) {
        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement('div');
            el.id = id;
            if (flexMode) el.className = `${PREFIX}_full_screen_container`;
            document.body.appendChild(el);
            // Tooltip handler (Position Logic)
            el.addEventListener('mouseover', (e) => {
                const target = e.target.closest(`.${PREFIX}_status_pill, .${PREFIX}_inv_slot, .${PREFIX}_resource_chip`);
                if (target) {
                    const tooltip = target.querySelector(`.${PREFIX}_status_tooltip`);
                    if (tooltip) {
                        const rect = target.getBoundingClientRect();
                        if (rect.left + 220 + 20 > window.innerWidth) { tooltip.style.left = 'auto'; tooltip.style.right = '0'; }
                        else { tooltip.style.left = '0'; tooltip.style.right = 'auto'; }
                    }
                }
            });
            el.addEventListener('click', (e) => {
                const target = e.target;
                if (target.closest(`.${CLASSES.BTN_CLOSE}`)) { hideAllContainers(); return; }

                if (target.classList.contains(CLASSES.BTN_GAME_TAB)) {
                    el.querySelectorAll(`.${CLASSES.BTN_GAME_TAB}`).forEach(b => b.classList.remove('active'));
                    target.classList.add('active');
                    const tName = target.getAttribute('data-target');
                    el.querySelectorAll(`.${PREFIX}_char_panel_wrapper`).forEach(p => p.style.display = 'none');
                    const panel = document.getElementById(`${PREFIX}_panel_${tName}`);
                    if (panel) panel.style.display = 'block';
                }

                if (target.classList.contains(CLASSES.BTN_SUB_TAB)) {
                    const parent = target.getAttribute('data-parent');
                    const section = target.getAttribute('data-section');
                    const wrapper = document.getElementById(`${PREFIX}_panel_${parent}`);
                    if (wrapper) {
                        wrapper.querySelectorAll(`.${CLASSES.BTN_SUB_TAB}`).forEach(b => b.classList.remove('active'));
                        target.classList.add('active');
                        wrapper.querySelectorAll(`.${PREFIX}_sub_section`).forEach(d => d.style.display = 'none');
                        const content = document.getElementById(`content_${parent}_${section}`);
                        if(content) content.style.display = 'block';
                    }
                }

                if (target.classList.contains(CLASSES.BTN_TAB)) {
                    el.querySelectorAll(`.${CLASSES.BTN_TAB}`).forEach(b => b.classList.remove('active'));
                    target.classList.add('active');
                    const key = target.getAttribute('data-tab-key');
                    el.querySelectorAll(`.${PREFIX}_section`).forEach(s => s.style.display = 'none');
                    const sec = document.getElementById(`${PREFIX}_section_${key}`);
                    if (sec) sec.style.display = 'block';
                    if (key === '购物车') renderCartSection();
                }
                if (target.classList.contains(CLASSES.BTN_ADD_CART)) addToCart(target.dataset.name, target.dataset.type, target.dataset.cost, target.dataset.target);
                if (target.classList.contains(CLASSES.BTN_REMOVE_CART)) removeFromCart(parseInt(target.dataset.idx));
                if (target.id === CLASSES.BTN_CHECKOUT) handleCheckout();
                if (target.id === DOM_IDS.BTN_UPGRADE) handleUpgradeShop();
                if (target.classList.contains(CLASSES.BTN_WH_ACTION)) { const {name,action,qty} = target.dataset; handleWarehouseAction(name, action, qty); }
            });
        }
        return el;
    }

    // (Generics)
    function renderWarehouseContent(data) {
        if (!data) return { tabs: '', panels: '<div class="empty-tip">空</div>' };
        const cats = [{ k: '现实仓库', t: '📦 现实', a: 'real', b: '✨' }, { k: '游戏仓库', t: '🎒 游戏', a: 'game', b: '🎒' }];
        const tabs = cats.map((c, i) => `<button class="${CLASSES.BTN_GAME_TAB} ${i===0?'active':''}" data-target="${c.k}">${c.t}</button>`).join('');
        const panels = cats.map((c, i) => {
            const l = Object.entries(data[c.k]||{}).map(([n, d]) => `<div class="${PREFIX}_wh_card"><div class="wh_header"><span class="wh_name">${n.split('_')[0]}</span><div class="wh_stars">${htmlStars(d.星级)}</div></div><div class="wh_body"><div class="wh_desc">${d.描述||'无'}</div></div><div class="wh_footer"><span class="wh_qty">x${d.数量}</span><button class="${CLASSES.BTN_WH_ACTION}" ${d.数量<=0?'disabled':''} data-name="${n.split('_')[0]}" data-action="${c.a}" data-qty="${d.数量}">${c.b}</button></div></div>`).join('');
            return `<div id="${PREFIX}_panel_${c.k}" class="${PREFIX}_char_panel_wrapper" style="display:${i===0?'block':'none'}"><div class="${PREFIX}_wh_dashboard"><div class="${PREFIX}_wh_grid">${l||'<div class="empty-tip">空</div>'}</div></div></div>`;
        }).join('');
        return { tabs, panels };
    }
    function generateShopSection(d,t){if(!d||Object.keys(d).length===0)return`<div class="${PREFIX}_section" id="${PREFIX}_section_${t}"><h3>${t}</h3><div class="empty-tip">无商品</div></div>`;const c=Object.entries(d).map(([n,i])=>{const v=parseInt(String(i.所需功勋||i.基础功勋).match(/\d+/))||0;let a='';if(t==='商城道具')a=`<div style="display:flex;flex-direction:column;gap:5px;margin-top:10px;"><button class="${CLASSES.BTN_ADD_CART}" style="background-color:#2a475e;" data-name="${n}" data-type="${t}" data-cost="${v}" data-target="game">🎒 游戏仓(${v})</button><button class="${CLASSES.BTN_ADD_CART}" style="background-color:#2a475e;color:#ffd700;" data-name="${n}" data-type="${t}" data-cost="${v}" data-target="real">📦 现实仓(${v*2})</button></div>`;else a=`<div class="${PREFIX}_card_actions"><button class="${CLASSES.BTN_ADD_CART}" data-name="${n}" data-type="${t}" data-cost="${v}" data-target="game_media">加入购物车</button></div>`;return`<div class="${PREFIX}_card"><div class="${PREFIX}_card_body"><div class="${PREFIX}_card_title">${n}</div><div class="${PREFIX}_card_meta">${htmlStars(i.星级)}</div><p style="font-size:13px;color:#c6d4df;">${i.简介||'无'}</p></div>${a}</div>`}).join('');return`<div class="${PREFIX}_section" id="${PREFIX}_section_${t}"><h3>${t}</h3><div class="${PREFIX}_list">${c}</div></div>`;}
    function renderCartSection(){const c=document.getElementById(`${PREFIX}_section_购物车`);if(!c)return;if(CART_ITEMS.length===0){c.innerHTML='<div class="empty-tip">空</div>';return;}let t=0;const l=CART_ITEMS.map((i,x)=>{t+=i.cost;return`<div class="${PREFIX}_cart_item"><span>${i.name}</span><span class="${PREFIX}_cart_cost">${i.cost}</span><button class="${CLASSES.BTN_REMOVE_CART}" data-idx="${x}">移除</button></div>`}).join('');c.innerHTML=`<h3>购物车</h3><div class="${PREFIX}_cart_list">${l}</div><div class="${PREFIX}_cart_summary">总计: ${t}</div><div class="${PREFIX}_cart_checkout"><button id="${CLASSES.BTN_CHECKOUT}">🛒 结算</button></div>`;}

    // Open Helpers
    function openShop() { const d=getNestedData(PATHS.SHOP)||{}; const c=getOrCreateContainer(DOM_IDS.CONTAINER_SHOP,false); hideAllContainers(); const tabs=SHOP_CATEGORIES.map(e=>`<button id="${PREFIX}_tab_btn_${e.key}" class="${CLASSES.BTN_TAB}" data-tab-key="${e.key}">${e.title}</button>`).join(''); let content = SHOP_CATEGORIES.slice(0,3).map(e=>generateShopSection(d[e.key]||{},e.title)).join('')+`<div class="${PREFIX}_section" id="${PREFIX}_section_购物车"></div>`; c.innerHTML=`<div class="${PREFIX}_shop_header"><div><h2>${d.商店星级||'1'}星商城</h2><div style="font-size:0.9em;color:#ffd700">💰 ${d.当前功勋||0}</div></div><div class="${PREFIX}_header_controls"><button id="${DOM_IDS.BTN_UPGRADE}" class="${PREFIX}_upgrade_btn">✨ 升级</button><button class="${CLASSES.BTN_CLOSE}">X</button></div></div><div class="${PREFIX}_tabs_nav">${tabs}</div><div class="${PREFIX}_shop_content">${content}</div>`; c.style.display='block'; const dt=c.querySelector(`#${PREFIX}_tab_btn_${SHOP_CATEGORIES[0].key}`); if(dt)dt.click(); EscManager.bind(()=>c.style.display='none'); }
    function openWarehousePage() { const d=getNestedData(PATHS.WAREHOUSE)||{}; const c=getOrCreateContainer(DOM_IDS.CONTAINER_WAREHOUSE,true); hideAllContainers(); const {tabs,panels}=renderWarehouseContent(d); c.innerHTML=`<div class="${PREFIX}_fixed_top_area"><div class="${PREFIX}_shop_header no-margin"><h2>📦 仓库</h2><div class="${PREFIX}_header_controls"><button class="${CLASSES.BTN_CLOSE}">X</button></div></div><div class="${PREFIX}_browser_tabs_bar">${tabs}</div></div><div class="${PREFIX}_scrollable_content_area">${panels}</div>`; c.style.display='flex'; EscManager.bind(()=>c.style.display='none'); }

    // [New] Archive Open
    function openArchivePage() {
        const d = getNestedData(PATHS.ARCHIVE);
        const c = getOrCreateContainer(DOM_IDS.CONTAINER_ARCHIVE, true);
        hideAllContainers();
        if(!d) { safeAlert("未找到游戏档案"); return; }
        const {tabs, panels} = renderArchiveContent(d);
        c.innerHTML = `<div class="${PREFIX}_fixed_top_area"><div class="${PREFIX}_shop_header no-margin"><h2>📂 游戏档案库</h2><div class="${PREFIX}_header_controls"><button class="${CLASSES.BTN_CLOSE}">X</button></div></div><div class="${PREFIX}_browser_tabs_bar">${tabs}</div></div><div class="${PREFIX}_scrollable_content_area">${panels}</div>`;
        c.style.display = 'flex';
        EscManager.bind(()=>c.style.display='none');
    }

    function openMenuModal() {
        let m = document.getElementById(DOM_IDS.MENU_MODAL);
        if(!m) {
            m=document.createElement('div'); m.id=DOM_IDS.MENU_MODAL;
            m.innerHTML = `<div class="${PREFIX}_menu_modal_content"><div class="${PREFIX}_menu_header"><h3>游戏机</h3><button class="${CLASSES.BTN_CLOSE}">X</button></div><div class="${PREFIX}_menu_buttons">
            <button id="${PREFIX}_menu_shop_btn" class="${PREFIX}_menu_btn"><span class="${PREFIX}_menu_icon">🛍️</span>商城</button>
            <button id="${DOM_IDS.BTN_WAREHOUSE}" class="${PREFIX}_menu_btn"><span class="${PREFIX}_menu_icon">📦</span>仓库</button>
            <button id="${DOM_IDS.BTN_ARCHIVE}" class="${PREFIX}_menu_btn"><span class="${PREFIX}_menu_icon">📂</span>档案</button>
            </div></div>`;
            document.body.appendChild(m);
            m.addEventListener('click',e=>{
                const t=e.target; if(t.closest(`.${CLASSES.BTN_CLOSE}`)){m.style.display='none';EscManager.unbind();}
                if(t.closest(`#${PREFIX}_menu_shop_btn`)) openShop();
                if(t.closest(`#${DOM_IDS.BTN_WAREHOUSE}`)) openWarehousePage();
                if(t.closest(`#${DOM_IDS.BTN_ARCHIVE}`)) openArchivePage();
            });
        }
        hideAllContainers(); m.style.display='flex'; EscManager.bind(()=>m.style.display='none');
    }

    // ====================================================================
    // ** 5. 样式注入 **
    // ====================================================================

    function injectCSS() {
        const oldStyle = document.getElementById(DOM_IDS.STYLE); if (oldStyle) oldStyle.remove();
        const style = document.createElement('style'); style.id = DOM_IDS.STYLE;
        style.innerHTML = `
            #${DOM_IDS.CONTAINER_SHOP} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(27, 40, 56, 0.95); backdrop-filter: blur(5px); z-index: 10000; overflow-y: auto; padding: 20px; color: #c6d4df; display: none; box-sizing: border-box; }
            #${DOM_IDS.CONTAINER_ARCHIVE}, #${DOM_IDS.CONTAINER_WAREHOUSE} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(21, 25, 33, 0.98); backdrop-filter: blur(8px); z-index: 10000; color: #e0e0e0; display: none; flex-direction: column; box-sizing: border-box; padding: 0; }

            .${PREFIX}_shop_header { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; margin-bottom: 20px; border-bottom: 2px solid #2a475e; position: sticky; top: 0; background-color: rgba(27, 40, 56, 0.95); z-index: 10001; }
            .${PREFIX}_shop_header.no-margin { background: transparent; margin-bottom: 10px; padding: 0 0 10px 0; border: none; position: static; }
            .${PREFIX}_shop_header h2 { color: #ffffff; font-size: 2em; margin: 0; }
            .${PREFIX}_header_controls { display: flex; gap: 10px; align-items: center; }
            .${PREFIX}_fixed_top_area { flex-shrink: 0; background: #171a21; border-bottom: 2px solid #2a475e; padding: 15px 20px 0 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.5); z-index: 10; }
            .${PREFIX}_scrollable_content_area { flex: 1; overflow-y: auto; padding: 20px; background: #1b2838; }

            .${PREFIX}_upgrade_btn, .${PREFIX}_close_btn, .${CLASSES.BTN_ADD_CART}, .${CLASSES.BTN_REMOVE_CART}, #${CLASSES.BTN_CHECKOUT}, .${CLASSES.BTN_WH_ACTION} { border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background 0.2s; color: white; }
            .${PREFIX}_upgrade_btn { background-color: #418d2d; padding: 8px 15px; } .${PREFIX}_upgrade_btn:hover { background-color: #5aa63b; }
            .${PREFIX}_close_btn { background-color: #c6d4df; color: #1b2838; padding: 8px 15px; } .${PREFIX}_close_btn:hover { background-color: #ffffff; }
            .${CLASSES.BTN_ADD_CART} { width: 100%; background-color: #5aa63b; padding: 10px; } .${CLASSES.BTN_ADD_CART}:hover { background-color: #418d2d; }
            .${CLASSES.BTN_REMOVE_CART} { background-color: #cc3131; padding: 5px 10px; font-size: 0.9em; } .${CLASSES.BTN_REMOVE_CART}:hover { background-color: #a32222; }
            #${CLASSES.BTN_CHECKOUT} { background-color: #418d2d; padding: 12px 30px; font-size: 1.2em; } #${CLASSES.BTN_CHECKOUT}:hover { background-color: #5aa63b; }

            .${PREFIX}_tabs_nav { display: flex; gap: 1px; border-bottom: 2px solid #2a475e; margin-bottom: 20px; }
            .${CLASSES.BTN_TAB} { background: #171a21; color: #c6d4df; border: 1px solid transparent; border-bottom: none; padding: 10px 20px; cursor: pointer; font-size: 1.1em; transition: 0.2s; }
            .${CLASSES.BTN_TAB}:hover { background: #2a475e; color: #fff; }
            .${CLASSES.BTN_TAB}.active { background: #1b2838; color: #fff; border-color: #2a475e; border-bottom-color: #1b2838; }

            .${PREFIX}_browser_tabs_bar { display: flex; gap: 5px; margin-bottom: -2px; overflow-x: auto; }
            .${CLASSES.BTN_GAME_TAB} { background: #21252d; color: #8a96a3; border: 1px solid transparent; border-bottom: none; padding: 10px 25px; cursor: pointer; font-size: 1.1em; border-radius: 8px 8px 0 0; transition: 0.2s; min-width: 120px; position: relative; }
            .${CLASSES.BTN_GAME_TAB}:hover { background: #2e3440; color: #fff; }
            .${CLASSES.BTN_GAME_TAB}.active { background: #1b2838; color: #66c0f4; font-weight: bold; border: 2px solid #2a475e; border-bottom: 2px solid #1b2838; z-index: 5; }

            .${PREFIX}_sub_nav { display: flex; gap: 15px; border-bottom: 1px solid #3c4450; margin-bottom: 20px; padding-bottom: 5px; }
            .${CLASSES.BTN_SUB_TAB} { background: transparent; color: #8a96a3; border: none; padding: 8px 5px; cursor: pointer; font-size: 1em; }
            .${CLASSES.BTN_SUB_TAB}:hover { color: #fff; }
            .${CLASSES.BTN_SUB_TAB}.active { color: #fff; font-weight: bold; border-bottom: 2px solid #66c0f4; }

            .${PREFIX}_list, .${PREFIX}_wh_grid, .${PREFIX}_inventory_grid, .${PREFIX}_resource_chip_grid, .${PREFIX}_npc_grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
            .${PREFIX}_card, .${PREFIX}_wh_card, .${PREFIX}_inv_slot, .${PREFIX}_monster_card, .${PREFIX}_resource_chip, .${PREFIX}_npc_card { background: #171a21; border: 1px solid #2a475e; border-radius: 4px; padding: 12px; transition: 0.2s; display: flex; flex-direction: column; gap: 5px; }
            .${PREFIX}_card:hover, .${PREFIX}_wh_card:hover, .${PREFIX}_inv_slot:hover, .${PREFIX}_npc_card:hover { transform: translateY(-3px); border-color: #66c0f4; }

            /* [NEW] 3-Column Grid for Attributes */
            .${PREFIX}_three_col_grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px; }

            .${PREFIX}_char_panel_wrapper { max-width: 1200px; margin: 0 auto; animation: fadeIn 0.3s ease; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .${PREFIX}_char_dashboard_layout { display: grid; grid-template-columns: 320px 1fr; gap: 25px; }
            @media (max-width: 900px) { .${PREFIX}_char_dashboard_layout { grid-template-columns: 1fr; } }
            .${PREFIX}_char_sidebar_profile { background: #101217; border-radius: 6px; padding: 20px; border: 1px solid #2a475e; height: fit-content; }
            .${PREFIX}_profile_avatar_placeholder { width: 80px; height: 80px; background: linear-gradient(135deg, #2a475e, #1b2838); color: white; font-size: 40px; line-height: 80px; border-radius: 50%; margin: 0 auto 15px auto; box-shadow: 0 0 15px rgba(102,192,244,0.3); text-align: center;}
            .${PREFIX}_profile_avatar_placeholder.empire { background: linear-gradient(135deg, #ff4500, #550000); box-shadow: 0 0 15px rgba(255,69,0,0.3); border: 2px solid #ffcc00; }

            .${PREFIX}_star_rating { color: #ffd700; letter-spacing: 2px; }
            .${PREFIX}_stat_widget { margin-bottom: 12px; }
            .${PREFIX}_stat_top { display: flex; justify-content: space-between; font-size: 0.85em; margin-bottom: 3px; color: #c6d4df; }
            .${PREFIX}_progress_track { background: #232833; height: 8px; border-radius: 4px; overflow: hidden; }
            .${PREFIX}_progress_fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }

            .${PREFIX}_section_divider { border-bottom: 1px solid #2a475e; margin: 30px 0 20px 0; text-align: center; height: 12px; }
            .${PREFIX}_section_divider.small { margin: 15px 0 10px 0; height: 8px; } .${PREFIX}_section_divider.small span { font-size: 0.8em; padding: 0 10px; color: #8a96a3; }
            .${PREFIX}_section_divider span { background: #1b2838; padding: 0 15px; color: #66c0f4; font-size: 1.2em; font-weight: bold; }

            .${PREFIX}_detail_block { background: rgba(23, 26, 33, 0.6); border: 1px solid #2a475e; border-radius: 4px; padding: 15px; height: fit-content; margin-bottom: 15px; }
            .full-width { grid-column: 1 / -1; }
            .${PREFIX}_detail_block h4 { color: #66c0f4; margin: 0 0 15px 0; font-size: 1.1em; border-bottom: 1px dotted #2a475e; padding-bottom: 8px; }

            /* Tooltip */
            .${PREFIX}_status_pill { position: relative; display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 15px; font-size: 0.85em; margin: 2px; cursor: help; border: 1px solid #666; z-index:1; }
            .${PREFIX}_status_tooltip { visibility: hidden; opacity: 0; position: absolute; bottom: 100%; left: 0; width: 220px; background: #171a21; border: 1px solid #66c0f4; padding: 12px; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.8); z-index: 9999; pointer-events: none; transition: opacity 0.2s; text-align: left; }
            .${PREFIX}_status_pill:hover .${PREFIX}_status_tooltip, .${PREFIX}_inv_slot:hover .${PREFIX}_status_tooltip, .${PREFIX}_resource_chip:hover .${PREFIX}_status_tooltip { visibility: visible; opacity: 1; }

            .${PREFIX}_content_grid_2col { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .${PREFIX}_world_hero_banner { background: linear-gradient(135deg, #101217 0%, #1e252f 100%); padding: 25px; border-radius: 8px; border: 1px solid #2a475e; border-left: 5px solid #66c0f4; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
            .${PREFIX}_world_hero_banner.completed { border-left-color: #4dff88; }
            .status_badge { background: #000; padding: 5px 12px; border-radius: 20px; font-size: 0.9em; font-weight: bold; color: #ffcc00; }
            .banner_meta { display: flex; gap: 30px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px; }

            .res-val { color: #ffd700; font-family: 'Consolas', monospace; margin-left: auto; }
            .${PREFIX}_asset_card { display: flex; align-items: center; background: #191d26; border-left: 4px solid #66c0f4; }
            .special-item { border-left-color: #ffd700; background: rgba(255, 215, 0, 0.05); }
            .${PREFIX}_tech_tag, .${PREFIX}_policy_tag { display: inline-block; font-size: 0.9em; padding: 4px 8px; margin: 3px; border-radius: 15px; border: 1px solid #3c4450; background: #1b2838; }

            .${PREFIX}_task_panel { display: flex; flex-direction: column; gap: 8px; }
            .${PREFIX}_task_item { padding: 10px; background: #151921; border-left: 3px solid #555; }
            .${PREFIX}_task_item.main { border-left-color: #f2c94c; background: rgba(242, 201, 76, 0.05); }
            .${PREFIX}_task_item.side { border-left-color: #66c0f4; }
            .${PREFIX}_clue_item { display: flex; gap: 10px; background: #101217; padding: 8px; border: 1px solid #2a475e; margin-bottom: 5px; }

            .${PREFIX}_grid_stats_container { display:grid; grid-template-columns:1fr 1fr; gap:5px; font-size:0.9em; }
            .${PREFIX}_grid_stat_item { display:flex; justify-content:space-between; border-bottom:1px solid #333; }
            .stat_k { color:#888; } .stat_v { color:#eee; }
            .${PREFIX}_mini_skill_card { background:#1e212b; padding:8px; border-radius:4px; margin-bottom:5px; border:1px solid #333; }
            .msk_head { display:flex; justify-content:space-between; color:#ddd; font-weight:bold; font-size:0.9em; }
            .msk_desc { font-size:0.8em; color:#888; margin-top:3px; }
            .${PREFIX}_skill_flex_container { display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:10px; }
            .${PREFIX}_monster_grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap:10px; }
            .${PREFIX}_monster_card { background:#000; border:1px solid #333; padding:8px; border-radius:4px; }
            .m_header { display:flex; justify-content:space-between; font-size:0.9em; margin-bottom:5px; color:#fff; }
            .m_weak { color:#ff5e5e; font-size:0.8em; } .m_desc { color:#888; font-size:0.8em; }
            .st-head { border-bottom:1px dashed #666; padding-bottom:5px; margin-bottom:5px; font-weight:bold; color:#fff; }
            .st-row { color:#ccc; font-size:0.9em; }

            /* NPC Specific */
            .${PREFIX}_npc_card { border-top: 3px solid #66c0f4; min-height: 100px; }
            .npc_head { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:5px; }
            .npc_name { font-weight:bold; color:#fff; font-size:1.05em; }
            .npc_role { font-size:0.85em; color:#888; background:#111; padding:2px 6px; border-radius:4px; border: 1px solid #333; }
            .npc_desc { font-size:0.85em; color:#bbb; line-height:1.4; flex-grow:1; margin: 8px 0; }
            .npc_foot { display:flex; gap:8px; margin-top:auto; padding-top:5px; border-top: 1px dashed #2a475e; }
            .npc_tag { font-size:0.8em; padding:2px 8px; border:1px solid #555; border-radius:12px; font-weight: bold; }
            .npc_tag.status { background:#111; border-color:#555; color:#ccc; margin-left:auto; }

            #${DOM_IDS.MENU_MODAL} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: none; justify-content: center; align-items: center; }
            .${PREFIX}_menu_modal_content { background: #171a21; border-radius: 8px; width: 400px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); border: 1px solid #2a475e; }
            .${PREFIX}_menu_header { display: flex; justify-content: center; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #2a475e; padding-bottom: 10px; position: relative; }
            .${PREFIX}_menu_header h3 { color: #fff; margin: 0; font-size: 1.5em; flex-grow: 1; text-align: center; }
            .${PREFIX}_menu_header .${CLASSES.BTN_CLOSE} { position: absolute; right: 0; }
            .${PREFIX}_menu_buttons { display: flex; flex-direction: column; gap: 15px; }
            .${PREFIX}_menu_btn { background: #2a475e; color: #fff; border: none; padding: 18px; cursor: pointer; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; font-size: 1.2em; font-weight: bold; letter-spacing: 1px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); text-transform: uppercase; }
            .${PREFIX}_menu_btn:hover { background: #3f607c; transform: scale(1.02); box-shadow: 0 6px 12px rgba(0,0,0,0.4); }

            .empty-tip { text-align: center; color: #555; padding: 20px; font-style: italic; }
        `;
        document.head.appendChild(style);
    }

    function addMenuOrb() {
        removeOldDataOrb();
        const container = document.getElementById(DOM_IDS.ORB_CONTAINER);
        if (!container || document.getElementById(DOM_IDS.MENU_BALL)) return;
        const orb = document.createElement('div');
        orb.id = DOM_IDS.MENU_BALL;
        orb.className = 'orb';
        orb.innerHTML = '<span class="orb-icon" style="font-size: 20px;">🕹️</span>';
        orb.title = '游戏菜单 (商城/档案/仓库)';
        orb.addEventListener('click', openMenuModal);
        const divider = document.createElement('div');
        divider.className = 'orb-divider';
        container.insertBefore(orb, container.firstChild);
        container.insertBefore(divider, orb.nextSibling);
    }

    function init() {
        injectCSS();
        const checkContainer = () => { if (document.getElementById(DOM_IDS.ORB_CONTAINER)) { addMenuOrb(); } else { requestAnimationFrame(checkContainer); } }
        checkContainer();
    }

    if (document.readyState === 'loading') { window.addEventListener('DOMContentLoaded', init); } else { init(); }

})();