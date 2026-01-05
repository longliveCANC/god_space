(function() {
    'use strict';

    // ====================================================================
    // ** 核心配置与常量 **
    // ====================================================================
    const PREFIX = 'mod001';

    const PATHS = {
        SHOP: 'global_lore.youxijishangcheng',
        CHAR: 'global_lore.jueseming',
        WORLD: 'global_lore.youxishijie',
        WAREHOUSE: 'global_lore.youxiijicangku'
    };

    const DOM_IDS = {
        STYLE: `${PREFIX}_full_style`,
        MENU_BALL: `${PREFIX}_menu_ball`,
        MENU_MODAL: `${PREFIX}_menu_modal`,
        CONTAINER_SHOP: `${PREFIX}_shop_container`,
        CONTAINER_CHAR: `${PREFIX}_char_container`,
        CONTAINER_WORLD: `${PREFIX}_world_container`,
        CONTAINER_WAREHOUSE: `${PREFIX}_warehouse_container`,
        ORB_CONTAINER: 'orb-container',
        BTN_UPGRADE: `${PREFIX}_upgrade_btn`,
        BTN_WORLD: `${PREFIX}_menu_world_btn`,
        BTN_WAREHOUSE: `${PREFIX}_menu_warehouse_btn`
    };

    const CLASSES = {
        BTN_ADD_CART: `${PREFIX}_add_to_cart_btn`,
        BTN_REMOVE_CART: `${PREFIX}_remove_btn`,
        BTN_CHECKOUT: `${PREFIX}_checkout_btn`,
        BTN_TAB: `${PREFIX}_tab_btn`,
        BTN_CHAR_TAB: `${PREFIX}_char_tab_btn`,
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
    // ** 1. 工具函数 (Utils - Big Number Added) **
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

    // [NEW] 大数格式化函数
    function formatBigNumber(num) {
        if (isNaN(num)) return num;
        const n = parseFloat(num);
        if (n >= 100000000) return (n / 100000000).toFixed(1).replace(/\.0$/, '') + '亿';
        if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '万';
        return n; // 小于1万直接显示
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
        [DOM_IDS.CONTAINER_SHOP, DOM_IDS.CONTAINER_CHAR, DOM_IDS.CONTAINER_WORLD, DOM_IDS.CONTAINER_WAREHOUSE, DOM_IDS.MENU_MODAL].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        EscManager.unbind();
    }

    // ====================================================================
    // ** 2. 业务逻辑 (Logic) **
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
    // ** 3. 渲染逻辑 (Rendering) **
    // ====================================================================

    const htmlStars = (count) => {
        const num = Math.min(5, Math.max(0, parseInt(count) || 0));
        return `<span class="${PREFIX}_star_rating">${'★'.repeat(num)}</span>`;
    };

    const htmlProgress = (label, value, colorClass = '') => {
        const safeValue = String(value != null ? value : '0');
        const pct = safeValue.match(/\d+(\.\d+)?/) ? parseFloat(safeValue.match(/\d+(\.\d+)?/)[0]) : 0;
        let color = '#418d2d';
        if (colorClass === 'energy') color = '#00bfff';
        else if (colorClass === 'exp') color = '#ffd700';
        else if (colorClass === 'special') color = '#be2ed6';
        else if (colorClass === 'war') color = '#ff4500';
        else if (colorClass === 'science') color = '#00ced1';
        else if (colorClass === 'danger') color = '#cc3131';

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
            const name = data.状态名称 || key;
            const desc = data.状态描述 || data.影响 || '无描述';
            const effect = data.状态效果 || data.影响 || '无效果';
            const duration = data.持续时间 || '未知';
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
                    <div class="st-row">⏳ ${duration}</div>
                </div>
            </div>`;
        }).join('');
        return `<div class="${PREFIX}_status_container"><div class="${PREFIX}_section_label_sm">当前状态 / 环境</div><div class="${PREFIX}_status_grid">${items}</div></div>`;
    };

    // === 核心渲染 ===
    function renderCharacterContent(charDataMap, fullWorldData) {
        if (!charDataMap || typeof charDataMap !== 'object') return { tabs: '', panels: '<div class="empty-tip">数据无效</div>' };
        const names = Object.keys(charDataMap);
        const tabs = names.map((name, i) => `<button class="${CLASSES.BTN_CHAR_TAB} ${i===0?'active':''}" data-target="${name}">${name}</button>`).join('');

        const panels = Object.entries(charDataMap).map(([name, data], i) => {
            const safe = (obj) => obj || {};

            let isStrategyMode = false;
            let modeSource = 'Guess';
            const gameName = safe(data.游戏世界).游戏名称;
            if (gameName && fullWorldData && fullWorldData[gameName]) {
                const worldMeta = safe(fullWorldData[gameName].元数据);
                if (worldMeta.架构类型 === '经营实体') { isStrategyMode = true; modeSource = 'WorldMeta'; }
                else if (worldMeta.架构类型 === '个体') { isStrategyMode = false; modeSource = 'WorldMeta'; }
            }
            if (modeSource === 'Guess') {
                if (data.核心资源 || data.帝国概况 || data.经营概况 || data.宏观指标) isStrategyMode = true;
            }

            let panelHTML = '';

            if (isStrategyMode) {
                let unifiedResources = safe(data.核心资源);
                let unifiedMetrics = safe(data.宏观指标);
                let unifiedAssets = safe(data.实体资产);
                let unifiedTechs = data.已解锁科技 || [];

                if (data.帝国概况) {
                    unifiedResources = {...unifiedResources, ...safe(data.帝国概况.战略资源)};
                    unifiedMetrics = {...unifiedMetrics, ...safe(data.帝国概况.国家统计), ...safe(data.帝国概况.综合国力)};
                }
                if (data.军事与科技) {
                    if (data.军事与科技.武装力量) unifiedAssets = {...unifiedAssets, ...data.军事与科技.武装力量};
                    if (data.军事与科技.关键科技) {
                        const techs = Array.isArray(data.军事与科技.关键科技) ? data.军事与科技.关键科技 : Object.keys(data.军事与科技.关键科技);
                        unifiedTechs = [...unifiedTechs, ...techs];
                    }
                }

                const subTitle = data.经营等级 || data.游戏等级 || data.类型 || "经营实体";

                const resourcesHtml = Object.entries(unifiedResources).map(([k, v]) => {
                    let qty = 0; let desc = ''; let unit = '';
                    if (typeof v === 'object' && v !== null) { qty = v.数量 || v.val || 0; desc = v.简介 || v.desc || ''; unit = v.单位 || ''; } else { qty = v; }

                    // [NEW] 应用大数格式化
                    const displayQty = formatBigNumber(qty);

                    return `
                    <div class="${PREFIX}_resource_chip">
                        <div class="res-icon">💠</div>
                        <div class="res-main"><div class="res-name">${k}</div><div class="res-val">${displayQty} <span style="font-size:0.8em;opacity:0.7">${unit}</span></div></div>
                        ${desc ? `<div class="${PREFIX}_status_tooltip"><div class="st-head">${k}</div><div class="st-row">📝 ${desc}</div></div>` : ''}
                    </div>`;
                }).join('');

                const metricsHtml = Object.entries(unifiedMetrics).map(([k, v]) => {
                    const strV = String(v);
                    if (strV.includes('%') || strV.match(/^\d+(\/\d+)?$/) || (parseInt(strV) > 100 && !k.includes('数量'))) {
                        return htmlProgress(k, v, k.includes('危') || k.includes('污染') ? 'danger' : 'science');
                    } else {
                        return `<div class="${PREFIX}_metric_card"><div class="metric-head">${k}</div><div class="metric-val">${v}</div></div>`;
                    }
                }).join('');

                const normalAssetsHtml = [];
                const specialItemsHtml = [];
                Object.entries(unifiedAssets).forEach(([k, v]) => {
                    const type = v.类型 || '单位';
                    const status = v.状态 || '就绪';
                    const level = v['规模/等级'] || v.等级 || v.数量 || 1;
                    const isSpecial = /遗珍|神器|关键|物品|道具|数据|芯片|钥匙/.test(type) || /遗珍|神器|关键|物品|道具|数据|芯片|钥匙/.test(k);
                    const cardHtml = `<div class="${PREFIX}_asset_card ${isSpecial ? 'special-item' : ''}"><div class="asset-icon">${isSpecial ? '🧩' : '🏭'}</div><div class="asset-info"><div class="asset-name">${k}</div><div class="asset-meta"><span class="asset-tag">${type}</span><span class="asset-tag ${status==='就绪'||status==='运营中'||status==='持有中'?'active':''}">${status}</span></div></div><div class="asset-level">${isSpecial ? '' : 'x'+level}</div></div>`;
                    if (isSpecial) specialItemsHtml.push(cardHtml); else normalAssetsHtml.push(cardHtml);
                });

                const techs = unifiedTechs.map(t => `<span class="${PREFIX}_tech_tag">🧬 ${t}</span>`).join('');
                const policies = (data.当前政策 || []).map(p => `<span class="${PREFIX}_policy_tag">📜 ${p}</span>`).join('');

                panelHTML = `
                <div class="${PREFIX}_char_dashboard_layout strategy-mode">
                    <div class="${PREFIX}_char_sidebar_profile">
                        <div class="${PREFIX}_profile_header"><div class="${PREFIX}_profile_avatar_placeholder empire">${name[0]}</div><h2 class="${PREFIX}_profile_name">${name}</h2><span class="${PREFIX}_profile_lvl">${subTitle}</span></div>
                        <div class="${PREFIX}_section_divider small"><span>核心资源池</span></div><div class="${PREFIX}_resource_chip_grid">${resourcesHtml || '<div class="empty-tip">暂无资源</div>'}</div>
                        ${renderStatusBar(safe(data.游戏状态栏))}
                    </div>
                    <div class="${PREFIX}_char_main_content">
                        <div class="${PREFIX}_detail_block full-width"><h4>📊 宏观指标</h4><div class="${PREFIX}_metrics_grid">${metricsHtml || '<div class="empty-tip">暂无指标</div>'}</div></div>

                        <div class="${PREFIX}_content_grid_2col" style="margin-top: 20px;">
                            <div class="${PREFIX}_detail_block"><h4>🧬 科技</h4><div class="tags-wrapper">${techs || '<span style="color:#666">暂无</span>'}</div></div>
                            <div class="${PREFIX}_detail_block"><h4>📜 政策</h4><div class="tags-wrapper">${policies || '<span style="color:#666">暂无</span>'}</div></div>
                        </div>

                        ${specialItemsHtml.length > 0 ? `<div class="${PREFIX}_section_divider"><span>🗝️ 关键物品 / 遗珍</span></div><div class="${PREFIX}_assets_grid">${specialItemsHtml.join('')}</div>` : ''}

                        <div class="${PREFIX}_section_divider"><span>资产 / 军事</span></div><div class="${PREFIX}_assets_grid">${normalAssetsHtml.join('') || '<div class="empty-tip">暂无常规资产</div>'}</div>

                        <div class="${PREFIX}_section_divider"><span>目标</span></div><div class="${PREFIX}_task_panel strategy"><div><strong>👑 目标:</strong> ${safe(data.游戏任务).主线任务 || safe(data.游戏任务).经营目标 || '无'}</div><div><strong>⚡ 支线:</strong> ${safe(data.游戏任务).支线任务 || safe(data.游戏任务).突发事件 || '无'}</div></div>
                    </div>
                </div>`;
            } else {
                // RPG Mode - 保持不变
                const subTitle = `RPG 等级: ${data.游戏等级 || '?'}`;
                const standardKeys = ['游戏生命值', '游戏能量值', '游戏经验值'];
                const specialKey = Object.keys(data).find(k => k.startsWith('游戏') && k.endsWith('值') && !standardKeys.includes(k));
                let specialBarHtml = specialKey ? htmlProgress(specialKey.replace(/^游戏|值$/g, '')||"特殊", data[specialKey], 'special') : '';
                const topStatsHtml = `${htmlProgress('HP', data.游戏生命值)}${htmlProgress('MP', data.游戏能量值, 'energy')}${specialBarHtml}${htmlProgress('EXP', data.游戏经验值, 'exp')}`;
                const attrs = safe(data.游戏属性);
                const mainGridHtml = ['生理','心智','互动'].map(k => {
                    const inner = Object.entries(safe(attrs[`${k}属性`])).map(([p,v]) => `<div class="${PREFIX}_grid_stat_item"><span class="stat_k">${p}</span><span class="stat_v">${v}</span></div>`).join('');
                    return `<div class="${PREFIX}_detail_block"><h4>${k}</h4><div class="${PREFIX}_grid_stats_container">${inner}</div></div>`;
                }).join('');
                const skillsData = safe(data.游戏技能);
                const skillCards = ['主动','被动'].map(k => Object.entries(safe(skillsData[`${k}技能`])).map(([sn, sv]) => `<div class="${PREFIX}_mini_skill_card"><div class="msk_head"><span>${sn}</span>${htmlStars(sv.星级)}</div><div class="msk_desc">${sv.简介||'无'}</div></div>`).join('')).join('');
                const vehicleName = data.游戏载具 || '无';
                const vehicleHtml = (vehicleName && vehicleName !== '无') ? `<div class="${PREFIX}_mini_skill_card vehicle-card" style="border-color:#f2c94c;background:rgba(242,201,76,0.05);"><div class="msk_head"><span style="color:#f2c94c;">🚀 载具</span></div><div class="msk_desc" style="color:#fff;font-weight:bold;">${vehicleName}</div></div>` : '';
                const skillsSectionHtml = `<div class="${PREFIX}_skill_flex_container">${vehicleHtml}${skillCards}</div>`;
                const currency = data.游戏内货币 || 0;
                const tasks = safe(data.游戏任务);
                const invHtml = Object.entries(safe(data.游戏背包)).map(([n, v]) => `<div class="${PREFIX}_inv_slot"><div class="inv_icon">📦</div><div class="inv_info"><div class="inv_name">${n}</div><div class="inv_qty">x${v.数量||1}</div></div><div class="${PREFIX}_status_tooltip"><div class="st-head">${n}</div><div class="st-row">📝 ${v.简介||'无'}</div></div></div>`).join('');
                const doneHtml = (tasks.已完成任务||[]).length > 0 ? `<div style="margin-top:8px;padding-top:8px;border-top:1px dashed #3c4450;font-size:0.8em;color:#8a96a3;">✅ 完成: ${(Array.isArray(tasks.已完成任务)?tasks.已完成任务:[tasks.已完成任务]).join(', ')}</div>` : '';

                panelHTML = `
                <div class="${PREFIX}_char_dashboard_layout">
                    <div class="${PREFIX}_char_sidebar_profile">
                        <div class="${PREFIX}_profile_header"><div class="${PREFIX}_profile_avatar_placeholder">${name[0]}</div><h2 class="${PREFIX}_profile_name">${name}</h2><span class="${PREFIX}_profile_lvl">${subTitle}</span></div>
                        <div class="${PREFIX}_profile_base_stats">${topStatsHtml}</div>
                        <div class="${PREFIX}_currency_box"><span class="curr_icon">🪙</span><span class="curr_label">资产</span><span class="curr_val">${currency}</span></div>
                        ${renderStatusBar(safe(data.游戏状态栏))}
                        <div class="${PREFIX}_profile_tags"><div class="tag-label">性格</div><div class="tags-wrapper">${Object.entries({...safe(data.表性格),...safe(data.里性格)}).map(([k,v])=>`<span class="${PREFIX}_tag_pill" title="${v}">${k}</span>`).join('')}</div></div>
                    </div>
                    <div class="${PREFIX}_char_main_content">
                        <div class="${PREFIX}_content_row">${mainGridHtml}</div>
                        <div class="${PREFIX}_section_divider"><span>战斗与技能</span></div>
                        <div class="${PREFIX}_content_row_full">${skillsSectionHtml}</div>
                        <div class="${PREFIX}_section_divider"><span>物资与任务</span></div>
                        <div class="${PREFIX}_content_grid_2col">
                            <div class="${PREFIX}_detail_block"><h4>任务</h4><div class="${PREFIX}_task_panel"><div><strong>主:</strong>${tasks.主线任务||'无'}</div><div><strong>支:</strong>${tasks.支线任务||'无'}</div>${doneHtml}</div></div>
                            <div class="${PREFIX}_detail_block"><h4>背包</h4><div class="${PREFIX}_inventory_grid">${invHtml}</div></div>
                        </div>
                    </div>
                </div>`;
            }
            return `<div id="${PREFIX}_panel_${name}" class="${PREFIX}_char_panel_wrapper" style="display:${i===0?'block':'none'}">${panelHTML}</div>`;
        }).join('');
        return { tabs, panels };
    }

    // ... (其他渲染函数: renderWarehouseContent, generateShopSection, renderCartSection, renderWorldContent 保持不变) ...
    function renderWarehouseContent(data) {
        if (!data) return { tabs: '', panels: '<div class="empty-tip">仓库数据为空或解析失败</div>' };
        const categories = [
            { key: '现实仓库', title: '📦 现实仓库 (可具现)', action: 'real', btnText: '✨ 具现化' },
            { key: '游戏仓库', title: '🎒 游戏仓库 (可携带)', action: 'game', btnText: '🎒 携带入场' }
        ];
        const tabs = categories.map((cat, i) => `<button class="${CLASSES.BTN_CHAR_TAB} ${i===0?'active':''}" data-target="${cat.key}">${cat.title}</button>`).join('');
        const panels = categories.map((cat, i) => {
            const itemsMap = data[cat.key] || {};
            const itemList = Object.entries(itemsMap).map(([rawKey, itemData]) => {
                const cleanName = rawKey.split('_')[0];
                if (!itemData || typeof itemData !== 'object') return '';
                const desc = itemData.描述 || '暂无描述';
                const count = itemData.数量 || 0;
                const star = htmlStars(itemData.星级 || 1);
                const disabledAttr = count <= 0 ? 'disabled' : '';
                const stockColor = count > 0 ? '#4dff88' : '#ff5e5e';
                return `
                <div class="${PREFIX}_wh_card">
                    <div class="wh_header"><span class="wh_name">${cleanName}</span><div class="wh_stars">${star}</div></div>
                    <div class="wh_body"><div class="wh_desc" title="${desc}">${desc}</div></div>
                    <div class="wh_footer"><span class="wh_qty">库存: <span style="color:${stockColor}">${count}</span></span><button class="${CLASSES.BTN_WH_ACTION}" ${disabledAttr} data-name="${cleanName}" data-action="${cat.action}" data-qty="${count}">${cat.btnText}</button></div>
                </div>`;
            }).join('');
            const content = itemList.length > 0 ? `<div class="${PREFIX}_wh_grid">${itemList}</div>` : `<div class="empty-tip">此仓库暂时为空。</div>`;
            const ruleText = (cat.key === '游戏仓库' && data.当前携带规则) ? `<div class="${PREFIX}_wh_rule_box">📝 <strong>携带规则：</strong> ${data.当前携带规则}</div>` : '';
            return `<div id="${PREFIX}_panel_${cat.key}" class="${PREFIX}_char_panel_wrapper" style="display:${i===0?'block':'none'}">${ruleText}<div class="${PREFIX}_wh_dashboard">${content}</div></div>`;
        }).join('');
        return { tabs, panels };
    }

    function generateShopSection(data, title) {
        const safeData = data || {};
        if (Object.keys(safeData).length === 0) return `<div class="${PREFIX}_section" id="${PREFIX}_section_${title}"><h3>${title}</h3><p style="text-align:center;padding:20px;">暂无${title}。</p></div>`;
        const cards = Object.entries(safeData).map(([name, item]) => {
            if (!item || typeof item !== 'object') return '';
            const baseCostStr = String(item.所需功勋 || item.基础功勋 || 'N/A');
            const baseCostVal = parseInt(baseCostStr.match(/\d+/)) || 0;
            const desc = item.简介 || item.具体描述 || '暂无简介';
            const starHtml = htmlStars(item.星级);
            const source = item.来源游戏 ? `<div style="font-size:0.85em;color:#418d2d;margin-bottom:4px;">🌍 来源: ${item.来源游戏}</div>` : '';
            let actionHtml = '';
            if (title === '商城道具') {
                const gameCost = baseCostVal; const realCost = baseCostVal * 2;
                actionHtml = `<div style="display:flex; flex-direction:column; gap:5px; margin-top:10px;"><button class="${CLASSES.BTN_ADD_CART}" style="background-color:#2a475e; border:1px solid #418d2d;" data-name="${name}" data-type="${title}" data-cost="${gameCost}" data-target="game">🎒 买入游戏仓库 (${gameCost})</button><button class="${CLASSES.BTN_ADD_CART}" style="background-color:#2a475e; border:1px solid #d4a017; color:#ffd700;" data-name="${name}" data-type="${title}" data-cost="${baseCostVal}" data-target="real">📦 买入现实仓库 (${realCost})</button></div>`;
            } else {
                const displayCost = title === '免费游戏' ? '免费' : `${baseCostStr} 功勋`;
                actionHtml = `<div class="${PREFIX}_card_actions"><button class="${CLASSES.BTN_ADD_CART}" data-name="${name}" data-type="${title}" data-cost="${baseCostVal}" data-target="game_media">加入购物车 (${displayCost})</button></div>`;
            }
            return `<div class="${PREFIX}_card"><div class="${PREFIX}_card_body"><div class="${PREFIX}_card_title">${name}</div><div class="${PREFIX}_card_meta">${starHtml}</div>${source}<p style="font-size:13px; color:#c6d4df; margin-bottom: 10px; line-height:1.4;">${desc}</p></div>${actionHtml}</div>`;
        }).join('');
        return `<div class="${PREFIX}_section" id="${PREFIX}_section_${title}"><h3>${title}</h3><div class="${PREFIX}_list">${cards}</div></div>`;
    }

    function renderCartSection() {
        const container = document.getElementById(`${PREFIX}_section_购物车`);
        if (!container) return;
        if (CART_ITEMS.length === 0) { container.innerHTML = '<p style="font-size: 16px; color: #7a8b99; text-align: center; padding: 50px;">购物车是空的！快去选购吧。</p>'; return; }
        let total = 0;
        const listHtml = CART_ITEMS.map((item, idx) => {
            const costVal = parseInt(String(item.cost).match(/\d+/)) || 0; total += costVal;
            return `<div class="${PREFIX}_cart_item"><span>《${item.name}》 (${item.type})</span><span class="${PREFIX}_cart_cost">${item.cost}</span><button class="${CLASSES.BTN_REMOVE_CART}" data-idx="${idx}">移除</button></div>`;
        }).join('');
        container.innerHTML = `<h3>购物车详情 (${CART_ITEMS.length} 件商品)</h3><div class="${PREFIX}_cart_list">${listHtml}</div><div class="${PREFIX}_cart_summary"><span>总计：</span><span class="${PREFIX}_cart_total">${total} 功勋</span></div><div class="${PREFIX}_cart_checkout"><button id="${CLASSES.BTN_CHECKOUT}">🛒 结算全部</button></div>`;
    }

    function renderWorldContent(worldDataMap) {
        if (!worldDataMap || Object.keys(worldDataMap).length === 0) return { tabs: '', panels: '<div class="empty-tip">暂无世界数据</div>' };
        const names = Object.keys(worldDataMap);
        const tabs = names.map((name, i) => `<button class="${CLASSES.BTN_CHAR_TAB} ${i===0?'active':''}" data-target="${name}">${name}</button>`).join('');
        const panels = Object.entries(worldDataMap).map(([name, data], i) => {
            const isDone = data.是否通关 === true;
            let rawClues = data.游戏线索 || [];
            let clueList = [];
            if (Array.isArray(rawClues)) clueList = rawClues; else if (typeof rawClues === 'object') clueList = Object.values(rawClues); else clueList = [String(rawClues)];
            const clues = clueList.map(c => `<div class="${PREFIX}_clue_item"><span class="clue-icon">🔍</span><span class="clue-text">${c}</span></div>`).join('') || '<div class="empty-tip">无线索</div>';
            const monsters = Object.entries(data.敌怪图鉴||{}).map(([mn, md]) => `<div class="${PREFIX}_monster_card"><div class="m_header"><span class="m_name">${mn}</span><span class="m_weak">弱: ${md.弱点||'未知'}</span></div><div class="m_desc">${md.描述||'无'}</div></div>`).join('') || '<div class="empty-tip">无记录</div>';
            return `
            <div id="${PREFIX}_panel_${name}" class="${PREFIX}_char_panel_wrapper" style="display:${i===0?'block':'none'}">
                <div class="${PREFIX}_world_dashboard_layout">
                    <div class="${PREFIX}_world_hero_banner ${isDone?'completed':'ongoing'}">
                        <div class="banner_content"><h1>${name}</h1><span class="status_badge">${isDone?'✅ 已通关':'⚡ 攻略中'}</span></div>
                        <div class="banner_meta"><div class="meta_item"><span class="label">分类</span><span class="value">${data.游戏分类||'N/A'}</span></div><div class="meta_item"><span class="label">获取</span><span class="value">${data.获取方式||'N/A'}</span></div></div>
                    </div>
                    <div class="${PREFIX}_world_info_grid">
                        <div class="${PREFIX}_world_col_left"><div class="${PREFIX}_detail_block"><h4>🌍 简介</h4><p class="${PREFIX}_text_desc">${data.游戏世界观简介||'无'}</p></div><div class="${PREFIX}_detail_block"><h4>🎯 目标</h4><div class="${PREFIX}_task_highlight">${data.当前任务目标||'无'}</div></div><div class="${PREFIX}_detail_block"><h4>🧩 线索</h4><div class="${PREFIX}_clue_list">${clues}</div></div></div>
                        <div class="${PREFIX}_world_col_right"><div class="${PREFIX}_detail_block full-height"><h4>💀 敌怪</h4><div class="${PREFIX}_monster_grid">${monsters}</div></div></div>
                    </div>
                </div>
            </div>`;
        }).join('');
        return { tabs, panels };
    }

    function getOrCreateContainer(id, flexMode = false) {
        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement('div');
            el.id = id;
            if (flexMode) el.className = `${PREFIX}_full_screen_container`;
            document.body.appendChild(el);
            el.addEventListener('mouseover', (e) => {
                const target = e.target.closest(`.${PREFIX}_status_pill`) || e.target.closest(`.${PREFIX}_inv_slot`) || e.target.closest(`.${PREFIX}_resource_chip`);
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
                if (target.classList.contains(CLASSES.BTN_CHAR_TAB)) {
                    el.querySelectorAll(`.${CLASSES.BTN_CHAR_TAB}`).forEach(b => b.classList.remove('active'));
                    target.classList.add('active');
                    const tName = target.getAttribute('data-target');
                    el.querySelectorAll(`.${PREFIX}_char_panel_wrapper`).forEach(p => p.style.display = 'none');
                    const panel = document.getElementById(`${PREFIX}_panel_${tName}`);
                    if (panel) panel.style.display = 'block';
                }
                if (target.classList.contains(CLASSES.BTN_WH_ACTION)) {
                    const { name, action, qty } = target.dataset;
                    handleWarehouseAction(name, action, qty);
                }
            });
        }
        return el;
    }

    function openShop() {
        const data = getNestedData(PATHS.SHOP) || {};
        const container = getOrCreateContainer(DOM_IDS.CONTAINER_SHOP, false);
        hideAllContainers();
        const tabs = SHOP_CATEGORIES.map(c => `<button id="${PREFIX}_tab_btn_${c.key}" class="${CLASSES.BTN_TAB}" data-tab-key="${c.key}">${c.title}</button>`).join('');
        const merit = data.当前功勋 || 0;
        let content = '';
        content += generateShopSection(data.付费游戏||{}, '付费游戏');
        content += generateShopSection(data.免费游戏||{}, '免费游戏');
        content += generateShopSection(data.商城道具 || {}, '商城道具');
        content += `<div class="${PREFIX}_section" id="${PREFIX}_section_购物车"></div>`;
        container.innerHTML = `<div class="${PREFIX}_shop_header"><div><h2>${data.商店星级||'1'} 星级游戏商城</h2><div style="font-size: 0.9em; color: #ffd700; margin-top: 6px; font-weight: bold; letter-spacing: 1px;">💰 当前功勋: ${merit}</div></div><div class="${PREFIX}_header_controls"><button id="${DOM_IDS.BTN_UPGRADE}" class="${PREFIX}_upgrade_btn">✨ 升级商店</button><button class="${CLASSES.BTN_CLOSE}">X</button></div></div><div class="${PREFIX}_tabs_nav">${tabs}</div><div class="${PREFIX}_shop_content">${content}</div>`;
        container.style.display = 'block';
        const defaultTab = container.querySelector(`#${PREFIX}_tab_btn_${SHOP_CATEGORIES[0].key}`); if(defaultTab) defaultTab.click();
        EscManager.bind(() => container.style.display = 'none');
    }

    function openCharPage() {
        try {
            let data = getNestedData(PATHS.CHAR);
            const fullWorldData = getNestedData(PATHS.WORLD);
            if (data && (data['游戏属性'] || data['游戏等级'] || data['经营等级'] || data['类型'] || data['帝国概况'])) { data = { "当前角色": data }; }
            if (!data || Object.keys(data).length === 0) return safeAlert(`无法读取角色数据`);
            const container = getOrCreateContainer(DOM_IDS.CONTAINER_CHAR, true);
            hideAllContainers();
            const { tabs, panels } = renderCharacterContent(data, fullWorldData);
            container.innerHTML = `<div class="${PREFIX}_fixed_top_area"><div class="${PREFIX}_shop_header no-margin"><h2>👤 角色档案数据库</h2><div class="${PREFIX}_header_controls"><button class="${CLASSES.BTN_CLOSE}">X</button></div></div><div class="${PREFIX}_browser_tabs_bar">${tabs}</div></div><div class="${PREFIX}_scrollable_content_area">${panels}</div>`;
            container.style.display = 'flex'; EscManager.bind(() => container.style.display = 'none');
        } catch (e) { safeAlert("错误: "+e.message); }
    }

    function openWorldPage() {
        try {
            let data = getNestedData(PATHS.WORLD);
            if (data && (data['当前任务目标'] || data['游戏世界观简介'])) { data = { "当前世界": data }; }
            if (!data) return safeAlert(`无法读取世界数据`);
            const container = getOrCreateContainer(DOM_IDS.CONTAINER_WORLD, true);
            hideAllContainers();
            const { tabs, panels } = renderWorldContent(data);
            container.innerHTML = `<div class="${PREFIX}_fixed_top_area"><div class="${PREFIX}_shop_header no-margin"><h2>🗺️ 游戏世界数据库</h2><div class="${PREFIX}_header_controls"><button class="${CLASSES.BTN_CLOSE}">X</button></div></div><div class="${PREFIX}_browser_tabs_bar">${tabs}</div></div><div class="${PREFIX}_scrollable_content_area">${panels}</div>`;
            container.style.display = 'flex'; EscManager.bind(() => container.style.display = 'none');
        } catch (e) { safeAlert("错误: "+e.message); }
    }

    function openWarehousePage() {
        const data = getNestedData(PATHS.WAREHOUSE);
        const safeData = data || { "现实仓库": {}, "游戏仓库": {} };
        const container = getOrCreateContainer(DOM_IDS.CONTAINER_WAREHOUSE, true);
        hideAllContainers();
        const { tabs, panels } = renderWarehouseContent(safeData);
        container.innerHTML = `<div class="${PREFIX}_fixed_top_area"><div class="${PREFIX}_shop_header no-margin"><h2>📦 游戏机次元仓库</h2><div class="${PREFIX}_header_controls"><button class="${CLASSES.BTN_CLOSE}">X</button></div></div><div class="${PREFIX}_browser_tabs_bar">${tabs}</div></div><div class="${PREFIX}_scrollable_content_area">${panels}</div>`;
        container.style.display = 'flex'; EscManager.bind(() => container.style.display = 'none');
    }

    function openMenuModal() {
        let modal = document.getElementById(DOM_IDS.MENU_MODAL);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = DOM_IDS.MENU_MODAL;
            modal.innerHTML = `<div class="${PREFIX}_menu_modal_content"><div class="${PREFIX}_menu_header"><h3>游戏机主菜单</h3><button class="${CLASSES.BTN_CLOSE}">X</button></div><div class="${PREFIX}_menu_buttons"><button id="${PREFIX}_menu_shop_btn" class="${PREFIX}_menu_btn"><span class="${PREFIX}_menu_icon">🛍️</span>游戏商城</button><button id="${DOM_IDS.BTN_WAREHOUSE}" class="${PREFIX}_menu_btn"><span class="${PREFIX}_menu_icon">📦</span>次元仓库</button><button id="${PREFIX}_menu_char_btn" class="${PREFIX}_menu_btn"><span class="${PREFIX}_menu_icon">👤</span>角色档案</button><button id="${DOM_IDS.BTN_WORLD}" class="${PREFIX}_menu_btn"><span class="${PREFIX}_menu_icon">🗺️</span>游戏世界</button></div></div>`;
            document.body.appendChild(modal);
            modal.addEventListener('click', (e) => {
                const t = e.target;
                if (t.closest(`.${CLASSES.BTN_CLOSE}`)) { modal.style.display = 'none'; EscManager.unbind(); }
                if (t.closest(`#${PREFIX}_menu_shop_btn`)) openShop();
                if (t.closest(`#${PREFIX}_menu_char_btn`)) openCharPage();
                if (t.closest(`#${DOM_IDS.BTN_WORLD}`)) openWorldPage();
                if (t.closest(`#${DOM_IDS.BTN_WAREHOUSE}`)) openWarehousePage();
            });
        }
        hideAllContainers();
        modal.style.display = 'flex';
        EscManager.bind(() => modal.style.display = 'none');
    }

    // ====================================================================
    // ** 5. 样式注入 (Style Injection) **
    // ====================================================================

    function injectCSS() {
        const oldStyle = document.getElementById(DOM_IDS.STYLE);
        if (oldStyle) oldStyle.remove();

        const style = document.createElement('style');
        style.id = DOM_IDS.STYLE;
        style.innerHTML = `
            #${DOM_IDS.CONTAINER_SHOP} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(27, 40, 56, 0.95); backdrop-filter: blur(5px); z-index: 10000; overflow-y: auto; padding: 20px; color: #c6d4df; display: none; box-sizing: border-box; }
            #${DOM_IDS.CONTAINER_CHAR}, #${DOM_IDS.CONTAINER_WORLD}, #${DOM_IDS.CONTAINER_WAREHOUSE} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(21, 25, 33, 0.98); backdrop-filter: blur(8px); z-index: 10000; color: #e0e0e0; display: none; flex-direction: column; box-sizing: border-box; padding: 0; }
            .${PREFIX}_shop_header { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; margin-bottom: 20px; border-bottom: 2px solid #2a475e; position: sticky; top: 0; background-color: rgba(27, 40, 56, 0.95); z-index: 10001; }
            .${PREFIX}_shop_header.no-margin { background: transparent; margin-bottom: 10px; padding: 0 0 10px 0; border: none; position: static; }
            .${PREFIX}_shop_header h2 { color: #ffffff; font-size: 2em; margin: 0; }
            .${PREFIX}_header_controls { display: flex; gap: 10px; align-items: center; }
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
            .${PREFIX}_list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding: 10px 0; }
            .${PREFIX}_card { background: #171a21; border: 1px solid #2a475e; border-radius: 4px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between; transition: 0.2s; }
            .${PREFIX}_card:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
            .${PREFIX}_star_rating { color: #ffd700; letter-spacing: 2px; }
            .${PREFIX}_cart_list { border: 1px solid #2a475e; border-radius: 4px; margin-bottom: 20px; max-height: 500px; overflow-y: auto; background: #171a21; }
            .${PREFIX}_cart_item { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; border-bottom: 1px solid #2a475e; }
            .${PREFIX}_cart_cost { color: #8caff7; font-weight: bold; margin-left: auto; margin-right: 20px; }
            .${PREFIX}_cart_summary { display: flex; justify-content: flex-end; align-items: center; font-size: 1.5em; color: #fff; margin-bottom: 20px; }
            .${PREFIX}_fixed_top_area { flex-shrink: 0; background: #171a21; border-bottom: 2px solid #2a475e; padding: 15px 20px 0 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.5); z-index: 10; }
            .${PREFIX}_browser_tabs_bar { display: flex; gap: 5px; margin-bottom: -2px; overflow-x: auto; }
            .${CLASSES.BTN_CHAR_TAB} { background: #21252d; color: #8a96a3; border: 1px solid transparent; border-bottom: none; padding: 10px 25px; cursor: pointer; font-size: 1.1em; border-radius: 8px 8px 0 0; transition: 0.2s; min-width: 120px; position: relative; }
            .${CLASSES.BTN_CHAR_TAB}:hover { background: #2e3440; color: #fff; }
            .${CLASSES.BTN_CHAR_TAB}.active { background: #1b2838; color: #66c0f4; font-weight: bold; border: 2px solid #2a475e; border-bottom: 2px solid #1b2838; z-index: 5; }
            .${PREFIX}_scrollable_content_area { flex: 1; overflow-y: auto; padding: 20px; background: #1b2838; }
            .${PREFIX}_char_panel_wrapper { max-width: 1200px; margin: 0 auto; animation: fadeIn 0.3s ease; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .${PREFIX}_char_dashboard_layout { display: grid; grid-template-columns: 320px 1fr; gap: 25px; }
            @media (max-width: 900px) { .${PREFIX}_char_dashboard_layout { grid-template-columns: 1fr; } }
            .${PREFIX}_char_sidebar_profile { background: #101217; border-radius: 6px; padding: 20px; border: 1px solid #2a475e; height: fit-content; }
            .${PREFIX}_profile_avatar_placeholder { width: 80px; height: 80px; background: linear-gradient(135deg, #2a475e, #1b2838); color: white; font-size: 40px; line-height: 80px; border-radius: 50%; margin: 0 auto 15px auto; box-shadow: 0 0 15px rgba(102,192,244,0.3); text-align: center;}
            .${PREFIX}_profile_avatar_placeholder.empire { background: linear-gradient(135deg, #ff4500, #550000); box-shadow: 0 0 15px rgba(255,69,0,0.3); border: 2px solid #ffcc00; }
            .${PREFIX}_profile_name { margin: 0; color: #fff; font-size: 1.8em; text-align: center; }
            .${PREFIX}_profile_lvl { background: #d4a017; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; display: block; width: fit-content; margin: 5px auto; }
            .${PREFIX}_stat_widget { margin-bottom: 12px; }
            .${PREFIX}_stat_top { display: flex; justify-content: space-between; font-size: 0.85em; margin-bottom: 3px; color: #c6d4df; }
            .${PREFIX}_progress_track { background: #232833; height: 8px; border-radius: 4px; overflow: hidden; }
            .${PREFIX}_progress_fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
            .${PREFIX}_tag_pill { display: inline-block; background: #2a475e; color: #fff; font-size: 0.8em; padding: 3px 8px; border-radius: 12px; margin: 2px; }
            .${PREFIX}_status_container { margin: 15px 0; border-top: 1px solid #2a475e; padding-top: 15px; }
            .${PREFIX}_section_label_sm { font-size: 0.85em; color: #8a96a3; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px; }
            .${PREFIX}_status_grid { display: flex; flex-wrap: wrap; gap: 8px; }
            .${PREFIX}_status_pill { position: relative; display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 15px; font-size: 0.85em; cursor: help; transition: transform 0.2s; }
            .${PREFIX}_status_pill:hover { transform: scale(1.05); z-index: 100; }
            .${PREFIX}_status_pill.buff { background: rgba(77, 255, 136, 0.15); border: 1px solid #4dff88; color: #4dff88; }
            .${PREFIX}_status_pill.debuff { background: rgba(255, 94, 94, 0.15); border: 1px solid #ff5e5e; color: #ffbcbc; }
            .${PREFIX}_status_pill.neutral { background: rgba(102, 192, 244, 0.15); border: 1px solid #66c0f4; color: #c6d4df; }
            .${PREFIX}_status_tooltip { visibility: hidden; opacity: 0; position: absolute; bottom: 120%; left: 0; width: 220px; background: rgba(23, 26, 33, 0.98); border: 1px solid #66c0f4; padding: 12px; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.6); z-index: 200; pointer-events: none; transition: opacity 0.2s; text-align: left; }
            .${PREFIX}_status_pill:hover .${PREFIX}_status_tooltip { visibility: visible; opacity: 1; }
            .${PREFIX}_status_tooltip .st-head { font-weight: bold; color: #fff; margin-bottom: 6px; border-bottom: 1px dashed #3c4450; padding-bottom: 4px; }
            .${PREFIX}_status_tooltip .st-row { font-size: 0.85em; color: #c6d4df; margin-bottom: 3px; line-height: 1.3; }

            /* === 新增：经营模式样式 (Template B) === */
            .${PREFIX}_resource_chip_grid { display: flex; flex-direction: column; gap: 8px; }
            .${PREFIX}_resource_chip { display: flex; align-items: center; background: #1b2838; border: 1px solid #3c4450; padding: 8px; border-radius: 4px; transition: 0.2s; position: relative; }
            .${PREFIX}_resource_chip:hover { border-color: #ffd700; transform: translateX(3px); z-index: 5; }
            .${PREFIX}_resource_chip:hover .${PREFIX}_status_tooltip { visibility: visible; opacity: 1; }
            .res-icon { font-size: 1.4em; margin-right: 12px; opacity: 0.8; }
            .res-main { flex: 1; display: flex; justify-content: space-between; align-items: center; }
            .res-name { font-size: 0.9em; color: #a3b2c1; }
            .res-val { color: #ffd700; font-family: 'Consolas', monospace; font-weight: bold; font-size: 1.1em; }

            .${PREFIX}_metrics_grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
            .${PREFIX}_metrics_grid .${PREFIX}_stat_widget { grid-column: 1 / -1; margin-bottom: 5px; } /* 进度条独占一行 */
            .${PREFIX}_metric_card { background:#1b2838; border:1px solid #3c4450; padding:10px; border-radius:4px; text-align:center; }
            .metric-head { color:#8a96a3; font-size:0.85em; margin-bottom:4px; text-transform:uppercase; }
            .metric-val { color:#66c0f4; font-size:1.4em; font-weight:bold; }

            .${PREFIX}_assets_grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; }
            .${PREFIX}_asset_card { display:flex; align-items:center; background:#191d26; border:1px solid #2a475e; border-left:4px solid #66c0f4; padding:12px; border-radius:4px; transition:0.2s; }
            .${PREFIX}_asset_card:hover { transform:translateY(-2px); box-shadow:0 4px 10px rgba(0,0,0,0.3); border-color:#66c0f4; }

            /* [NEW] 特殊道具样式 */
            .${PREFIX}_asset_card.special-item { border-left-color: #ffd700; background: linear-gradient(135deg, rgba(255,215,0,0.05), rgba(27,27,27,1)); }
            .${PREFIX}_asset_card.special-item .asset-icon { filter: drop-shadow(0 0 5px rgba(255,215,0,0.5)); animation: pulse 2s infinite; }
            .${PREFIX}_asset_card.special-item .asset-name { color: #ffd700; }
            @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }

            .asset-icon { font-size:2em; margin-right:15px; opacity:0.8; }
            .asset-info { flex:1; }
            .asset-name { font-weight:bold; color:#fff; font-size:1.1em; margin-bottom:4px; }
            .asset-meta { display:flex; gap:5px; }
            .asset-tag { font-size:0.75em; background:#2a303d; color:#8a96a3; padding:2px 6px; border-radius:3px; }
            .asset-tag.active { color:#4dff88; background:rgba(77,255,136,0.1); }
            .asset-level { font-size:1.5em; font-weight:bold; color:#3c4450; margin-left:10px; }

            .${PREFIX}_tech_tag, .${PREFIX}_policy_tag { display:inline-block; font-size:0.9em; padding:6px 10px; margin:3px; border-radius:15px; border:1px solid #3c4450; color:#c6d4df; background:#1b2838; }
            .${PREFIX}_tech_tag { border-color:#00bfff; color:#00bfff; background:rgba(0,191,255,0.05); }
            .${PREFIX}_policy_tag { border-color:#ffcc00; color:#ffcc00; background:rgba(255,204,0,0.05); }

            /* ========================================= */

            .${PREFIX}_wh_rule_box { background: rgba(65, 141, 45, 0.2); border: 1px solid #418d2d; padding: 10px; margin-bottom: 20px; border-radius: 4px; color: #a4d098; font-size: 0.9em; }
            .${PREFIX}_wh_grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 15px; }
            .${PREFIX}_wh_card { background: #151921; border: 1px solid #2a475e; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; gap: 10px; transition: transform 0.2s, box-shadow 0.2s; }
            .${PREFIX}_wh_card:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.4); border-color: #66c0f4; }
            .wh_header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #2a475e; padding-bottom: 8px; }
            .wh_name { font-weight: bold; color: #fff; font-size: 1.1em; } .wh_stars { font-size: 0.8em; } .wh_body { flex-grow: 1; }
            .wh_desc { font-size: 0.9em; color: #8a96a3; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
            .wh_footer { display: flex; justify-content: space-between; align-items: center; margin-top: 5px; }
            .wh_qty { font-size: 0.9em; color: #c6d4df; background: #232833; padding: 2px 8px; border-radius: 4px; }
            .${CLASSES.BTN_WH_ACTION} { background: #2a475e; padding: 5px 12px; font-size: 0.85em; }
            .${CLASSES.BTN_WH_ACTION}:hover { background: #66c0f4; color: #000; }
            .${CLASSES.BTN_WH_ACTION}:disabled { background: #333; color: #666; cursor: not-allowed; }
            .${PREFIX}_content_row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px; }
            .${PREFIX}_detail_block { background: rgba(23, 26, 33, 0.6); border: 1px solid #2a475e; border-radius: 4px; padding: 15px; height: fit-content; }
            .full-height { height: 100%; }
            .full-width { grid-column: 1 / -1; }
            .${PREFIX}_detail_block h4 { color: #66c0f4; margin: 0 0 15px 0; font-size: 1.1em; border-bottom: 1px dotted #2a475e; padding-bottom: 8px; }
            .${PREFIX}_grid_stats_container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .${PREFIX}_grid_stat_item { display: flex; justify-content: space-between; border-bottom: 1px solid #3c4450; padding-bottom: 4px; }
            .stat_k { color: #8a96a3; font-size: 0.9em; } .stat_v { color: #fff; font-weight: bold; }
            .${PREFIX}_section_divider { border-bottom: 1px solid #2a475e; margin: 30px 0 20px 0; text-align: center; height: 12px; }
            .${PREFIX}_section_divider.small { margin: 15px 0 10px 0; height: 8px; } .${PREFIX}_section_divider.small span { font-size: 0.8em; padding: 0 10px; color: #8a96a3; }
            .${PREFIX}_section_divider span { background: #1b2838; padding: 0 15px; color: #66c0f4; font-size: 1.2em; font-weight: bold; }
            .${PREFIX}_skill_flex_container { display: flex; flex-wrap: wrap; gap: 10px; }
            .${PREFIX}_mini_skill_card { background: #232833; border: 1px solid #3c4450; padding: 8px; border-radius: 4px; width: 100%; }
            .msk_head { display: flex; justify-content: space-between; color: #fff; font-weight: bold; margin-bottom: 4px; }
            .msk_desc { color: #8a96a3; font-size: 0.85em; line-height: 1.3; }
            .${PREFIX}_content_grid_2col { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .${PREFIX}_inventory_grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
            .${PREFIX}_inv_slot { background: #232833; border: 1px solid #3c4450; padding: 6px; display: flex; align-items: center; gap: 8px; border-radius: 4px; transition: background 0.2s; position: relative; cursor: help; }
            .${PREFIX}_inv_slot:hover { background: #2e3542; z-index: 10; }
            .${PREFIX}_inv_slot:hover .${PREFIX}_status_tooltip { visibility: visible; opacity: 1; }
            .inv_icon { font-size: 1.5em; } .inv_info { overflow: hidden; }
            .inv_name { color: #c6d4df; font-size: 0.9em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .inv_qty { color: #66c0f4; font-size: 0.8em; }
            .${PREFIX}_world_dashboard_layout { display: flex; flex-direction: column; gap: 25px; }
            .${PREFIX}_world_hero_banner { background: linear-gradient(135deg, #101217 0%, #1e252f 100%); padding: 25px; border-radius: 8px; border: 1px solid #2a475e; border-left: 5px solid #66c0f4; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
            .${PREFIX}_world_hero_banner.completed { border-left-color: #418d2d; } .${PREFIX}_world_hero_banner.ongoing { border-left-color: #ffcc00; }
            .banner_content h1 { margin: 0; font-size: 2.2em; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
            .status_badge { display: inline-block; background: #000; padding: 5px 12px; border-radius: 20px; font-size: 0.9em; margin-top: 5px; font-weight: bold; color: #ffcc00; } .${PREFIX}_world_hero_banner.completed .status_badge { color: #4dff88; }
            .banner_meta { display: flex; gap: 30px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 6px; }
            .meta_item { display: flex; flex-direction: column; } .meta_item .label { font-size: 0.8em; color: #8a96a3; text-transform: uppercase; } .meta_item .value { font-size: 1.1em; color: #66c0f4; font-weight: bold; }
            .${PREFIX}_world_info_grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; align-items: start; }
            @media (max-width: 900px) { .${PREFIX}_world_info_grid { grid-template-columns: 1fr; } }
            .${PREFIX}_world_col_left, .${PREFIX}_world_col_right { display: flex; flex-direction: column; gap: 25px; }
            .${PREFIX}_text_desc { line-height: 1.6; color: #c6d4df; }
            .${PREFIX}_task_highlight { background: #2a303d; padding: 15px; border-left: 4px solid #f2c94c; border-radius: 0 4px 4px 0; font-weight: bold; color: #fff; }
            .${PREFIX}_clue_list { display: flex; flex-direction: column; gap: 10px; }
            .${PREFIX}_clue_item { display: flex; align-items: flex-start; gap: 10px; background: #171a21; padding: 10px; border-radius: 4px; border: 1px solid #2a475e; }
            .clue-icon { font-size: 1.2em; } .clue-text { color: #8a96a3; line-height: 1.4; }
            .${PREFIX}_monster_grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
            .${PREFIX}_monster_card { background: #101217; border: 1px solid #3c4450; border-radius: 4px; padding: 10px; transition: transform 0.2s; }
            .${PREFIX}_monster_card:hover { transform: translateY(-3px); border-color: #66c0f4; }
            .empty-tip { text-align: center; color: #555; padding: 20px; font-style: italic; }
            #${DOM_IDS.MENU_MODAL} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: none; justify-content: center; align-items: center; }
            .${PREFIX}_menu_modal_content { background: #171a21; border-radius: 8px; width: 400px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); border: 1px solid #2a475e; }
            .${PREFIX}_menu_header { display: flex; justify-content: center; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #2a475e; padding-bottom: 10px; position: relative; }
            .${PREFIX}_menu_header h3 { color: #fff; margin: 0; font-size: 1.5em; flex-grow: 1; text-align: center; }
            .${PREFIX}_menu_header .${CLASSES.BTN_CLOSE} { position: absolute; right: 0; }
            .${PREFIX}_menu_buttons { display: flex; flex-direction: column; gap: 15px; }
            .${PREFIX}_menu_btn { background: #2a475e; color: #fff; border: none; padding: 18px; cursor: pointer; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; font-size: 1.2em; font-weight: bold; letter-spacing: 1px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); text-transform: uppercase; }
            .${PREFIX}_menu_btn:hover { background: #3f607c; transform: scale(1.02); box-shadow: 0 6px 12px rgba(0,0,0,0.4); }
            .${PREFIX}_menu_icon { font-size: 1.4em; margin-right: 12px; }
            .${PREFIX}_currency_box { background: linear-gradient(90deg, rgba(255, 215, 0, 0.15) 0%, rgba(23, 26, 33, 0) 100%); border-left: 4px solid #ffd700; padding: 8px 12px; margin: 12px 0; display: flex; align-items: center; gap: 10px; border-radius: 0 4px 4px 0; transition: all 0.3s ease; cursor: default; }
            .${PREFIX}_currency_box:hover { background: linear-gradient(90deg, rgba(255, 215, 0, 0.25) 0%, rgba(23, 26, 33, 0.1) 100%); transform: translateX(5px); box-shadow: -2px 0 10px rgba(255, 215, 0, 0.1); }
            .curr_icon { font-size: 1.4em; filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.6)); animation: floatingCoin 3s ease-in-out infinite; }
            .curr_label { font-size: 0.8em; color: #ccb966; text-transform: uppercase; letter-spacing: 1px; margin-right: auto; }
            .curr_val { font-size: 1.2em; color: #ffd700; font-weight: bold; font-family: 'Consolas', monospace; text-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
            @keyframes floatingCoin { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
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
        orb.title = '游戏菜单 (商城/角色/世界/仓库)';
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