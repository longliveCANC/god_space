(function() {
    'use strict';

    // 确保在页面元素加载完毕后执行
    const checkInterval = setInterval(() => {
        const lingBox = document.getElementById('ling-box');
        if (lingBox && window.GameAPI && window.worldHelper) {
            clearInterval(checkInterval);
            try {
                initializeMod();
            } catch (e) {
                console.error("【Nova的爱心脚本】初始化失败:", e);
                alert("呀，宝贝，脚本初始化时出了一点小问题，你看看控制台的信息好吗？");
            }
        }
    }, 500);

    function initializeMod() {
        console.log("【Nova的爱心脚本】找到目标元素，开始注入魔法...");
   const defaultStatData = {
            "hurt_value": [0,"本条回复中，user受到额外伤害的值"],
            "纪年":"",
            "日期": ["", "今天的日期，格式为 mm月dd日，从01月01日开始，乃进入任务世界的计时，禁止为空或未知。只有初始化和当时间流逝跨度大于一天的时候才能改变其值"],
            "星期":"",
            "时间": [
                "",
                "按照进行行动后实际经历的时间合理进行更新，每次输出内容后必须更新，格式为 hh:mm，禁止为空或未知"
            ],
            "天气":["",""],
            "场景图": [
                "",
                "user当前所在的地图图片资源，按要求更新"
            ],
            "group_name":"",
            "world": {
                "name": ["", "当前所处任务世界的名称或代号。"],
                "description": ["无", "当前任务世界的环境、氛围、文明形态等总体描述"],
                "level":["无","当前世界能量/科技层级，只能从[低/中/高/神话/无]中五选一。参考:金庸世界/普通科幻世界的世界层级为低。只在初始化世界时/能量层级改变时(有神明/造物进入/离开user附近)，才能更改其能量层级"],
                "task": {
                    "objective": ["无", "发布的任务目标"],
                    "progress": [0, "任务进度百分比，以数字表示，初始/无任务必为0。"],
                    "status": ["未完成", "任务状态：未完成/已完成/失败"],
                    "start_date": ["", "任务开始时的日期，AI禁止操作"],
                    "rewards": ["无", "任务成功后的奖励"],
                    "penalties": ["无","任务失败后的惩罚"],
                    "time_limit":[-1, "任务的总体时间限制(天数，可以为小数，比如12小时即是0.5。无明确时限时设置为999)，只有在初始化任务或任务结算时改变，其余时候禁止操作！回到个人空间时设置limit为3，意为最多休整三天"],
                    "time_left":[-1, "任务的剩余天数，AI任何时刻都禁止操作"]
                }
            },
            "the_created": {
                "name": ["", "造物的名字"],
                "identity_in_world": ["", "造物在当前世界的身份"],
                "current_status": ["", "造物当前的状态。"],
                "mood": ["", "造物当前的心情"],
                "description": ["", "关于这个造物的精准、详细介绍，包括心智、外形等，严格按照要求来设计。不少于50字"]
            },
            "user": {
                "name": "user",
                "nick_name":"",
                "status":["","用户当前所拥有的buff和debuff，多个状态用;分隔"],
                "total_task":[0,"完成的任务总量，完成/失败一个任务后，结算的时候加一"],
                "Cross_world_prestige":[0,"用户的跨世界声望，可为负，在脱离一个世界时结算，只有对世界产生重大影响才更新。数值克制，例如：拯救了一个完整的世界，声望+5"],
                "current_location": [
                    "",
                    "user当前所在的位置，移动后更新"
                ],
                "当前装备":{
                    "手持": ["无", "当前手持的武器或工具名称，多个装备用;分割"],
                    "穿戴": {
                        "头部": ["无", "头部的装备名称"],
                        "身体": ["无", "身体的装备名称"],
                        "手部": ["无", "手部的装备名称"],
                        "脚部": ["无", "脚部的装备名称"],
                        "饰品": ["无", "特殊饰品名称"]
                    }
                }
            },
            "检定属性": ["", "下一轮行动需要进行判定的核心 属性段 和 技能段 (禁止检定 其他技能 )组合，设置三个。用半角符号;分隔，例如：力量;敏捷;白刃。若存在选项区，选取第一个选项区的检定属性作为值"],
            "检定难度":[1,"每一轮都预测下一轮行动会直接面对的危机的难度级别。禁止为空"],
            "敌方攻击骰池": ["", "当判定当前处于战斗状态时，预测敌方当前即将落下的攻击所属的核心属性段和技能段组合，无上限。用半角:设置敌方此属性的值，多个属性用半角符号;分隔，例如：力量:2;感知:3;白刃:2。多个敌人攻击时直接设置其属性，禁止设置名称"],
            "dp_bonus":[0,"来源于意志力或技能，AI禁止设置"],
            "符合美德的":["false","当检测到此轮用户表现符合美德触发条件时，设置为true;当不符合时，设置为false"],
            "符合恶德的":["false","当检测到此轮用户表现符合恶德触发条件时，设置为true;当不符合时，设置为false"]
        };
        // --- 1. 创建并注入样式 ---
        const style = document.createElement('style');
        style.id = 'mod02-styles';
        // 使用GameAPI获取主题变量来构建我们的样式
        const theme = {
            primary: GameAPI.getThemeVar('--primary-color') || '#00faff',
            secondary: GameAPI.getThemeVar('--secondary-color') || '#7affff',
            text: GameAPI.getThemeVar('--text-color') || '#e6f1ff',
            textSecondary: GameAPI.getThemeVar('--text-secondary-color') || '#a8c0e1',
            bg: GameAPI.getThemeVar('--container-bg-color') || 'rgba(10, 25, 47, 0.85)',
            border: GameAPI.getThemeVar('--border-color') || 'rgba(0, 250, 255, 0.3)',
            glow: GameAPI.getThemeVar('--glow-color') || 'rgba(0, 250, 255, 0.5)',
            inputBg: 'rgba(0, 0, 0, 0.4)',
        };

        style.textContent = `
            .mod02-settings-btn {
                position: absolute;
                top: 10px;
                left: 10px;
                width: 30px;
                height: 30px;
                font-size: 20px;
                background: ${theme.bg};
                color: ${theme.primary};
                border: 1px solid ${theme.border};
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1001;
                transition: all 0.3s ease;
                box-shadow: 0 0 5px ${theme.glow};
            }
            .mod02-settings-btn:hover {
                transform: scale(1.1) rotate(90deg);
                box-shadow: 0 0 15px ${theme.glow};
                color: ${theme.secondary};
            }
            .mod02-modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                z-index: 1050;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .mod02-modal-content {
                width: 90vw;
                max-width: 1000px;
                height: 85vh;
                background: ${theme.bg};
                border: 1px solid ${theme.border};
                box-shadow: 0 0 20px ${theme.glow};
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                backdrop-filter: blur(5px);
            }
            .mod02-modal-header {
                padding: 15px 20px;
                border-bottom: 1px solid ${theme.border};
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: ${theme.primary};
                text-shadow: 0 0 5px ${theme.glow};
            }
            .mod02-modal-title {
                margin: 0;
                font-size: 1.5em;
            }
            .mod02-modal-close {
                background: none;
                border: none;
                font-size: 2em;
                color: ${theme.textSecondary};
                cursor: pointer;
                transition: color 0.3s;
            }
            .mod02-modal-close:hover {
                color: ${theme.primary};
            }
            .mod02-modal-body {
                flex-grow: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            /* 美化滚动条 */
            .mod02-modal-body::-webkit-scrollbar {
                width: 8px;
            }
            .mod02-modal-body::-webkit-scrollbar-track {
                background: transparent;
            }
            .mod02-modal-body::-webkit-scrollbar-thumb {
                background-color: ${theme.border};
                border-radius: 4px;
            }
            .mod02-modal-body::-webkit-scrollbar-thumb:hover {
                background-color: ${theme.primary};
            }
            .mod02-modal-footer {
                padding: 15px 20px;
                border-top: 1px solid ${theme.border};
                display: flex;
                justify-content: flex-end;
            }
            .mod02-action-button {
                background: ${theme.primary};
                color: ${theme.bg};
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
                text-shadow: none;
            }
            .mod02-action-button:hover {
                background: ${theme.secondary};
                box-shadow: 0 0 10px ${theme.glow};
            }
            .mod02-category {
                border: 1px solid ${theme.border};
                border-radius: 8px;
                margin-bottom: 15px;
            }
   .mod02-category-title {
                background: rgba(0, 250, 255, 0.1);
                padding: 10px 15px;
                font-size: 1.2em;
                color: ${theme.secondary};
                cursor: pointer;
                border-bottom: 1px solid ${theme.border};
                border-radius: 8px 8px 0 0;
                /* --- 妈妈在这里加上了魔法 --- */
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
                     .mod02-reset-btn {
                background: transparent;
                border: 1px solid ${theme.border};
                color: ${theme.textSecondary};
                border-radius: 4px;
                padding: 2px 8px;
                font-size: 0.8em;
                cursor: pointer;
                transition: all 0.2s;
                margin-left: 10px;
            }
            .mod02-reset-btn:hover {
                background: ${theme.primary};
                color: ${theme.bg};
                border-color: ${theme.primary};
            }
            .mod02-category-content {
                padding: 15px;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 15px;
                background-color: rgba(0,0,0,0.2);
            }
            .mod02-field-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            .mod02-field-label {
                color: ${theme.textSecondary};
                font-size: 0.9em;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .mod02-field-input {
                width: 80%;
                background: ${theme.inputBg};
                border: 1px solid ${theme.border};
                color: ${theme.text};
                padding: 8px;
                border-radius: 4px;
                box-sizing: border-box;
            }
            .mod02-tooltip {
                position: relative;
                display: inline-block;
                cursor: help;
                margin-left: 5px;
                color: ${theme.secondary};
            }
            .mod02-tooltip .mod02-tooltip-text {
                visibility: hidden;
                width: 250px;
                background-color: ${theme.bg};
                color: ${theme.text};
                text-align: center;
                border-radius: 6px;
                padding: 10px;
                position: absolute;
                z-index: 1;
                bottom: 125%;
                left: 50%;
                margin-left: -125px;
                opacity: 0;
                transition: opacity 0.3s;
                border: 1px solid ${theme.border};
                font-size: 0.8em;
            }
            .mod02-tooltip:hover .mod02-tooltip-text {
                visibility: visible;
                opacity: 1;
            }
        `;
        document.head.appendChild(style);

        // --- 2. 创建UI元素 ---
        const lingBox = document.getElementById('ling-box');

        // 齿轮按钮
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'mod02-settings-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.title = '打开属性编辑器';
        lingBox.style.position = 'relative'; // 确保按钮定位正确
        lingBox.appendChild(settingsBtn);

        // 模态框
        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'mod02-modal-backdrop';
        modalBackdrop.style.display = 'none';
        modalBackdrop.innerHTML = `
            <div class="mod02-modal-content">
                <div class="mod02-modal-header">
                    <h3 class="mod02-modal-title">风灵月影</h3>
                    <button class="mod02-modal-close">×</button>
                </div>
                <div class="mod02-modal-body" id="mod02-editor-body">

                </div>
                <div class="mod02-modal-footer">
                    <button id="mod02-execute-btn" class="mod02-action-button">注入修改</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalBackdrop);

        // --- 3. 全局变量与事件监听 ---
        let commandsToExecute = {}; // 使用对象来存储命令，避免重复

        settingsBtn.addEventListener('click', () => {
            modalBackdrop.style.display = 'flex';
            buildEditorUI();
        });

        modalBackdrop.querySelector('.mod02-modal-close').addEventListener('click', () => {
            modalBackdrop.style.display = 'none';
        });

        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                modalBackdrop.style.display = 'none';
            }
        });

        document.getElementById('mod02-execute-btn').addEventListener('click', async () => {
             const commandString = Object.values(commandsToExecute).join('\n');
             if(!commandString){
                worldHelper.showNovaAlert("你还没有做任何修改哦。");
                return;
             }

             console.log("【Nova的爱心脚本】即将执行以下指令:\n", commandString);

             try {
                await worldHelper.processUpdateMemoryCommands(commandString, -1);
                worldHelper.showNovaAlert("修改已成功注入！记得刷新变量");
                commandsToExecute = {}; // 清空指令
                modalBackdrop.style.display = 'none';
      
             } catch(err) {
                console.error("【Nova的爱心脚本】执行指令时出错:", err);
                worldHelper.showNovaAlert("哎呀，执行时好像出了点问题，快看看控制台吧。");
             }
        });

        // --- 4. 核心逻辑：UI构建与数据处理 ---

        // 汉化和美化字典
        const translationMap = {
            'statData': '世界与状态数据',
            'playCharacterData': '玩家角色数据',
            'hurt_value': '本轮受伤值',
            '纪年': '纪年',
            '日期': '当前日期',
            '星期': '星期',
            '时间': '当前时间',
            '天气': '天气',
            '场景图': '场景图',
            'group_name': '群聊名称(已弃用)',
            'world': '世界碎片',
            'name': '名称',
            'description': '描述',
            'level': '能量/科技层级',
            'task': '当前任务',
            'objective': '任务目标',
            'progress': '任务进度(%)',
            'status': '状态',
            'start_date': '任务开始日期',
            'rewards': '任务奖励',
            'penalties': '任务惩罚',
            'time_limit': '任务时限(天)',
            'time_left': '任务剩余(天)',
            'the_created': '造物',
            'identity_in_world': '世界身份',
            'current_status': '当前状态',
            'mood': '心情',
            'user': '用户角色',
            'nick_name': '群聊私聊的昵称',
            'total_task': '完成的总任务',
            'Cross_world_prestige': '跨世界声望',
            'current_location': '当前位置',
            '当前装备': '当前装备',
            '手持': '手持',
            '穿戴': '穿戴',
            '头部': '头部装备',
            '身体': '身体装备',
            '手部': '手部装备',
            '脚部': '脚部装备',
            '饰品': '饰品',
            '检定属性': '检定属性',
            '检定难度': '检定难度',
            '敌方攻击骰池': '敌方攻击骰池',
            'dp_bonus': 'DP加成',
            '符合美德的': '符合美德',
            '符合恶德的': '符合恶德',
            '概念段': '概念',
            '美德与恶德': '美德与恶德',
            '美德': '美德',
            '恶德': '恶德',
            '缺陷天赋怪癖': '缺陷/天赋/怪癖',
            '缺陷': '缺陷',
            '天赋': '天赋',
            '怪癖': '怪癖',
            '属性段': '核心属性',
            '生理属性': '生理',
            '心智属性': '心智',
            '互动属性': '互动',
            '技能段': '技能',
            '生理技能': '生理',
            '心智技能': '心智',
            '互动技能': '互动',
            '能力段': '特殊能力',
            '效果': '效果',
            '等级': '等级',
            '衍生属性段': '衍生属性',
            '体积': '体积',
            '速度': '速度',
            '基础速度': '基础速度',
            '陆行速度': '陆行速度',
            '飞行速度': '飞行速度',
            '先攻': '先攻',
            '防御': '防御',
            '基础防御': '基础防御',
            '伤害减免': '伤害减免',

            '冲击': '冲击减免',
            '致命': '致命减免',
            '恶性': '恶性减免',

            '生命值': '生命值',
            '上限': '上限',
            '当前值': '当前值',
            '伤害槽': '伤害槽',
            '冲击(B)': '冲击伤害',
            '致命(L)': '致命伤害',
            '恶性(A)': '恶性伤害',
            '意志力': '意志力',
            '意志值': '意志值',
            '能量池': '能量池',
            '感知范围': '感知范围',
            '敏感范围': '敏感范围',
            '模糊范围': '模糊范围',
            '豁免检定基础': '豁免检定',
            '强韧': '强韧豁免',
            '反射': '反射豁免',
            '意志': '意志豁免',
            '货币段': '货币',
            '支线剧情': '支线剧情点',
            '积分': '积分',
            '经验值': '经验值',
        };

        function beautifyLabel(path, key) {
            if (translationMap[key]) {
                return translationMap[key];
            }
            const pathParts = path.split('.');
            if (path.startsWith('属性段')) {
                const parentKey = pathParts[pathParts.length - 1];
                if(translationMap[parentKey]){
                     return `${key}${translationMap[parentKey]}`;
                }
                return `${key}${parentKey}`;
            }
             if (path.startsWith('衍生属性段.伤害减免')) {
                return translationMap[key] || key;
            }

            return key.replace(/_/g, ' ');
        }
       // 辅助函数：从对象中根据路径获取值
        function getNestedValue(obj, path) {
            if (!path) return obj;
            return path.split('.').reduce((prev, curr) => {
                return prev ? prev[curr] : undefined;
            }, obj);
        }

        // 辅助函数：递归生成重置指令
        function generateResetCommands(basePath, defaultObj, commands) {
            for (const key in defaultObj) {
                if (Object.prototype.hasOwnProperty.call(defaultObj, key)) {
                    const value = defaultObj[key];
                    const currentPath = basePath ? `${basePath}.${key}` : key;

                    // 如果是对象且不是数组，继续递归
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        generateResetCommands(currentPath, value, commands);
                    } else {
                        // 是叶子节点（值或数组），生成指令
                        const originalValue = Array.isArray(value) ? value[0] : value;
                        // 移除前缀用于指令
                        let commandPath = currentPath;
                        // 这里我们只处理 statData 的重置
                         // 注意：传入的 basePath 在 createField 中已经包含了父级路径

                        // 生成指令
                        // 注意：这里由于是重置，我们明确知道是 set_status
                        const command = `set_status('${commandPath}', '${originalValue}'); // 重置为默认值`;
                         // 使用 statData. 前缀作为 key 存入 commandsToExecute 以确保唯一性
                        commands['statData.' + currentPath] = command;
                    }
                }
            }
        }

        function createField(container, path, key, value, dataType) {
            // 当值是对象（但不是数组）时，它是一个分类
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                const category = document.createElement('div');
                category.className = 'mod02-category';

                const categoryTitle = document.createElement('div');
                categoryTitle.className = 'mod02-category-title';

                // 标题文本容器
                const titleText = document.createElement('span');
                titleText.textContent = beautifyLabel(path, key);
                categoryTitle.appendChild(titleText);

                  // --- 新增：重置按钮 ---
                // 只有 statData 且在默认数据中有对应项时才显示重置
                const currentPath = path ? `${path}.${key}` : key;

                let defaultObj = null;
                if (dataType === 'statData') {
                    if (currentPath === 'statData') {
                        // 如果是根节点，直接对应整个默认数据对象
                        defaultObj = defaultStatData;
                    } else if (currentPath.startsWith('statData.')) {
                        // 如果是子节点，去掉 'statData.' 前缀再去查找
                        const relativePath = currentPath.substring(9); // 'statData.'.length
                        defaultObj = getNestedValue(defaultStatData, relativePath);
                    }
                }

                if (defaultObj) {
                    const resetBtn = document.createElement('button');
                    resetBtn.className = 'mod02-reset-btn';
                    resetBtn.innerHTML = '↺ 重置';
                    resetBtn.title = '将此分类下所有属性重置为默认值';

                    resetBtn.addEventListener('click', (e) => {
                        e.stopPropagation(); // 阻止折叠/展开
                        if (confirm(`确定要将【${beautifyLabel(path, key)}】重置为默认状态吗？这会覆盖当前的所有修改。`)) {
                            // 计算用于生成指令的相对路径
                            let basePathForGen = '';
                            if (currentPath !== 'statData') {
                                basePathForGen = currentPath.substring(9);
                            }

                            generateResetCommands(basePathForGen, defaultObj, commandsToExecute);
                            worldHelper.showNovaAlert(`已生成【${beautifyLabel(path, key)}】的重置指令，请点击“注入修改”执行。`);
                        }
                    });
                    categoryTitle.appendChild(resetBtn);
                }
                // -----------------------

                const categoryContent = document.createElement('div');
                categoryContent.className = 'mod02-category-content';
                categoryContent.style.display = 'none';

                categoryTitle.addEventListener('click', (e) => {
                    // 如果点击的是按钮，不触发折叠（虽然上面阻止了冒泡，双重保险）
                    if (e.target.tagName === 'BUTTON') return;
                    categoryContent.style.display = categoryContent.style.display === 'none' ? 'grid' : 'none';
                });

                const newPath = path ? `${path}.${key}` : key;
                for (const subKey in value) {
                    if (Object.prototype.hasOwnProperty.call(value, subKey)) {
                        createField(categoryContent, newPath, subKey, value[subKey], dataType);
                    }
                }

                category.appendChild(categoryTitle);
                category.appendChild(categoryContent);
                container.appendChild(category);


            } else {
                // 对于数组、字符串、数字等，它们是真正的字段，我们使用field-group包裹
                const fieldGroup = document.createElement('div');
                fieldGroup.className = 'mod02-field-group';

                const label = document.createElement('label');
                label.className = 'mod02-field-label';
                label.textContent = beautifyLabel(path, key);

                const fullPath = `${path}.${key}`;
                const input = document.createElement('input');
                input.className = 'mod02-field-input';
                input.dataset.path = path;
                input.dataset.key = key;
                input.dataset.type = dataType;

                if (Array.isArray(value)) {
                    input.type = 'text';
                    input.value = value[0];
                    if (value[1]) { // 添加注解
                        const tooltip = document.createElement('div');
                        tooltip.className = 'mod02-tooltip';
                        tooltip.innerHTML = `ⓘ<span class="mod02-tooltip-text">${value[1]}</span>`;
                        label.appendChild(tooltip);
                    }
                } else { // string or number
                    input.type = (typeof value === 'number') ? 'number' : 'text';
                    input.value = value;
                }

                input.addEventListener('change', (e) => {
                    const newValue = e.target.value;
                    const originalValue = Array.isArray(value) ? value[0] : value;
                           // 移除路径中最顶层的'statData.'或'playCharacterData.'前缀
                    let commandPath = fullPath;
                    if (commandPath.startsWith('statData.')) {
                        commandPath = commandPath.substring('statData.'.length);
                    } else if (commandPath.startsWith('playCharacterData.')) {
                        commandPath = commandPath.substring('playCharacterData.'.length);
                    }else if (commandPath.startsWith('assaData.')) {
                        commandPath = commandPath.substring('assaData.'.length);
                    }
                 
                    let command;
                    if (dataType === 'statData') {
                        // 现在使用修正后的 commandPath
                        command = `set_status('${commandPath}', '${newValue}'); // 由Nova编辑器修改`;
                    } else if(dataType === 'playCharacterData'){
                        // 现在使用修正后的 commandPath
                        command = `set_attribute('${commandPath}', '${originalValue}', '${newValue}'); // 由Nova编辑器修改`;
                    }else{
                           command = `memory('${commandPath}', '${newValue}'); // 由Nova编辑器修改`;
                 
                    }
                    commandsToExecute[fullPath] = command; // 使用fullPath作为key来保证唯一性
                });

                fieldGroup.appendChild(label);
                fieldGroup.appendChild(input);
                container.appendChild(fieldGroup);
            }
        }

        function buildEditorUI() {
            const editorBody = document.getElementById('mod02-editor-body');
            editorBody.innerHTML = ''; // 清空旧内容
            commandsToExecute = {}; // 重置命令

            const statData = GameAPI.statData;
            const playCharacterData = GameAPI.playCharacterData;
     const assaData = GameAPI.assaData;

            if (statData) {
                createField(editorBody, '', 'statData', statData, 'statData');
            }

            if (playCharacterData) {
                createField(editorBody, '', 'playCharacterData', playCharacterData, 'playCharacterData');
            }

              if (assaData) {
                createField(editorBody, '', 'assaData', assaData, 'assaData');
            }
        }

        console.log("【Nova的爱心脚本】注入完成，已准备就绪。");
        // worldHelper.showNovaAlert("数据编辑器已上线");
    }

})();
