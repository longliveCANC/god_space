(function() {
    'use strict';

    // ==========================================================================
    // 1. 数据常量与预设库
    // ==========================================================================

   const LOREBOOK_NAME = "小蝌蚪找妈妈-同层版";
    const ENTRY_NAME = "[memoryinit]";
    const DIY_ATTRIBUTE_ENTRY = "[diyattribute]";
    const LOCAL_STORAGE_KEY = "mod07_custom_templates_v1";
    // --- 新增：联动规则的本地存储Key ---
    const RULES_STORAGE_KEY = "mod07_linkage_rules_live_v1";
    // 默认完整数据结构（防崩底包）
    const DEFAULT_FULL_DATA = {
        "stat_data": {}, // (省略其他字段，保持原有逻辑，只关注 play_character_data)
        "play_character_data": {
            "基础属性": {},
            "基础技能": {}
        },
        "assa_data": {}
    };

    // --- 预设：整套模板 ---
    const FULL_SETS = {
        "默认模板": {
            desc: "标准的DND/COC混合风格，适合无限流开局。",
            attr:  {
"生理属性": {
"力量": {
"基础": [
0,
"衡量肌肉强度与爆发力，影响近战伤害与负重"
],
"传奇": [
0,
"超越凡人极限的力量，提供伤害附加成功"
]
},
"敏捷": {
"基础": [
0,
"衡量身体协调、反应速度与灵活性，影响先攻与闪避"
],
"传奇": [
0,
"超越凡人极限的敏捷，提供防御附加成功"
]
},
"耐力": {
"基础": [
0,
"衡量体质、持久力与恢复力，影响生命值与抵抗力"
],
"传奇": [
0,
"超越凡人极限的耐力，提供伤害减免"
]
}
},
"心智属性": {
"智力": {
"基础": [
0,
"衡量逻辑、记忆、学习与分析能力，影响技能学习与策略"
],
"传奇": [
0,
"超越凡人极限的智力，提供技能附加成功"
]
},
"感知": {
"基础": [
0,
"衡量观察力、直觉与五感敏锐度，影响侦查与洞察"
],
"传奇": [
0,
"超越凡人极限的感知，提供洞察防御与侦查附加成功"
]
},
"决心": {
"基础": [
0,
"衡量意志力、勇气与精神韧性，影响意志值上限"
],
"传奇": [
0,
"超越凡人极限的决心，提供意志检定附加成功"
]
}
},
"互动属性": {
"风度": {
"基础": [
0,
"衡量个人魅力、气质与第一印象，影响正面社交"
],
"传奇": [
0,
"超越凡人极限的风度，提供社交检定附加成功"
]
},
"操控": {
"基础": [
0,
"衡量说服、诱导与控制他人的能力，影响负面社交"
],
"传奇": [
0,
"超越凡人极限的操控，提供操控检定附加成功"
]
},
"沉着": {
"基础": [
0,
"衡量冷静、自控与抗压能力，影响先攻与意志值上限"
],
"传奇": [
0,
"超越凡人极限的沉着，提供意志检定附加成功"
]
},
"幸运": {
"基础": [
0,
"衡量运气"
]
}
}
},
            skill:  {
"生理技能": {
"运动": [
0,
"衡量跑、跳、攀爬等身体活动能力"
],
"肉搏": [
0,
"衡量徒手格斗技巧"
],
"驾驶": [
0,
"衡量操控地面、水面或空中载具的能力"
],
"枪械": [
0,
"衡量使用各类火器的能力"
],
"手上功夫": [
0,
"衡量盗窃、开锁等手部精细操作能力"
],
"隐藏": [
0,
"衡量潜行、伪装与隐蔽自身的能力"
],
"求生": [
0,
"衡量在恶劣环境中生存与追踪的能力"
],
"白刃": [
0,
"衡量使用刀剑等冷兵器的能力"
],
"弓箭": [
0,
"衡量使用弓弩等抛射武器的能力"
]
},
"心智技能": {
"学识": [
0,
"衡量人文、历史、地理等知识广度"
],
"电脑": [
0,
"衡量操作、编程与黑客技术"
],
"手艺": [
0,
"衡量制作的知识"
],
"调查": [
0,
"衡量搜集线索、分析现场的能力"
],
"医学": [
0,
"衡量诊断、治疗与药理知识"
],
"神秘学": [
0,
"衡量对超自然现象与魔法的知识"
],
"科学": [
0,
"衡量物理、化学、生物等自然科学知识"
]
},
"互动技能": {
"动物沟通": [
0,
"衡量与动物交流和驯服的能力"
],
"感受": [
0,
"衡量洞察他人情绪与意图的能力"
],
"表达": [
0,
"衡量感染他人的能力"
],
"胁迫": [
0,
"衡量通过威胁与恐吓达成目的的能力"
],
"交际": [
0,
"衡量社交、礼仪与建立人脉的能力"
],
"掩饰": [
0,
"衡量隐藏真相、伪装身份与欺骗他人的能力"
]
}
}
     }     ,
 
        "修仙侧模板": {
            desc: "以灵根、神识为主的修真体系。",
            attr: {
                "根骨": {
                    "灵根": { "基础": [0, "五行灵根纯净度"], "传奇": [0, "天道筑基加成"] },
                    "体魄": { "基础": [0, "肉身强度"], "传奇": [0, "不灭金身加成"] }
                },
                "神魂": {
                    "神识": { "基础": [0, "神念覆盖范围"], "传奇": [0, "神魂攻击加成"] },
                    "悟性": { "基础": [0, "参悟功法速度"] }
                },
                "气运": {
                    "福源": { "基础": [0, "奇遇概率"] }
                }
            },
            skill: {
                "修艺": { "炼丹": [0, "草木造诣"], "炼器": [0, "金石造诣"], "阵法": [0, "天地纹理"] },
                "斗法": { "御剑": [0, "飞剑操控"], "术法": [0, "五行法术"], "符箓": [0, "制符施符"] }
            }
        },
     "现实侧模板": {
        "desc": "基于现代社会的成人向现实设定，强调社会属性与隐秘欲望。",
        "attr": {
            "社会资本": {
                "阶层": { "基础": [0, "财富与社会地位综合评分"], "特权": [0, "动用规则外力量的能力"] },
                "人脉": { "基础": [0, "社交圈层覆盖率"], "黑幕": [0, "接触灰色产业的能力"] }
            },
            "肉体资本": {
                "颜值": { "基础": [0, "五官与身材的综合吸引力"], "性张力": [0, "引发他人原始欲望的气场"] },
                "耐力": { "基础": [0, "体能与抗疲劳度"], "恢复": [0, "事后恢复速度"] }
            },
            "内在特质": {
                "支配欲": { "基础": [0, "掌控他人的心理需求"] },
                "服从性": { "基础": [0, "接受命令的心理倾向"] }
            }
        },
        "skill": {
            "社交": { "话术": [0, "PUA与心理诱导"], "伪装": [0, "表情管理与人设维持"], "调情": [0, "暧昧氛围营造"] },
            "实务": { "搏击": [0, "防身与制敌"], "驾驶": [0, "各类载具操控"], "黑客": [0, "信息获取与网络入侵"] }
        }
    },
 
    };

    // --- 预设：单个条目 ---
    const INDIVIDUAL_PRESETS = [
    { type: 'skill', name: '厨艺', val: [0, "烹饪食物的色香味及处理食材的能力"] },
 
    // 通用属性
 
    { type: 'attr', name: '灵感', val: { "基础": [0, "SAN值检定基础"] } },
    { type: 'attr', name: '幸运', val: { "基础": [0, "不可名状的运气"] } },
    { type: 'attr', name: '杀气', val: { "基础": [0, "震慑敌人的气场"] } },
    { type: 'attr', name: '财力', val: { "基础": [0, "可调动的资金流"] } },

    // NSFW 通用技巧/属性 (你要求的)
    { type: 'skill', name: '性爱技巧', val: [0, "取悦伴侣与掌控节奏的综合能力"] },
    { type: 'skill', name: '口交技巧', val: [0, "口腔吞吐与舌头灵活度"] },
    ];

    // ==========================================================================
    // 2. 样式注入 (CSS)
    // ==========================================================================
    const styleId = 'mod07-full-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            :root {
                --m7-bg: var(--container-bg-color, #0a192f);
                --m7-panel: rgba(20, 30, 50, 0.95);
                --m7-border: var(--border-color, rgba(0, 250, 255, 0.2));
                --m7-primary: var(--primary-color, #00faff);
                --m7-text: var(--text-color, #e6f1ff);
                --m7-text-dim: rgba(230, 241, 255, 0.6);
                --m7-danger: #ff5f5f;
                --m7-success: #4caf50;
                --m7-warn: #ffb74d;
            }

            /* 入口按钮 */
            #mod07-entry-btn {
            top:4%;
            left:10%;
            position:absolute;
                background: transparent; border: 1px solid var(--m7-border);
                color: var(--m7-text); cursor: pointer; padding: 4px 8px;
                border-radius: 4px; margin-right: 8px; font-size: 1.2em;
                transition: 0.3s;
            }
              @media (max-width: 768px) {
             #mod07-entry-btn {
               left:20%;
            }   }
            #mod07-entry-btn:hover { background: var(--m7-primary); color: #000; }

            /* 全屏容器 */
            .m7-fullscreen {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: var(--m7-bg); z-index: 10000;
                display: flex; flex-direction: column;
                font-family: 'Segoe UI', Roboto, sans-serif;
                color: var(--m7-text);
                backdrop-filter: blur(10px);
            }

            /* 顶部导航 */
            .m7-header {
                height: 60px; border-bottom: 1px solid var(--m7-border);
                display: flex; justify-content: space-between; align-items: center;
                padding: 0 30px; background: rgba(0,0,0,0.3);
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }
            .m7-title { font-size: 1.5rem; font-weight: 600; color: var(--m7-primary); letter-spacing: 1px; }
            .m7-actions { display: flex; gap: 15px; }

            /* 按钮通用 */
            .m7-btn {
                padding: 8px 20px; border-radius: 4px; border: 1px solid var(--m7-border);
                background: transparent; color: var(--m7-text); cursor: pointer;
                font-weight: 500; transition: all 0.2s; display: flex; align-items: center; gap: 5px;
            }
            .m7-btn:hover { background: rgba(255,255,255,0.1); border-color: var(--m7-primary); }
            .m7-btn.primary { background: var(--m7-primary); color: #000; border: none; }
            .m7-btn.primary:hover { box-shadow: 0 0 15px var(--m7-primary); }
            .m7-btn.danger { border-color: var(--m7-danger); color: var(--m7-danger); }
            .m7-btn.danger:hover { background: var(--m7-danger); color: #fff; }
            .m7-btn-sm { padding: 4px 8px; font-size: 0.85em; }

            /* 主体布局 */
            .m7-body { flex: 1; display: flex; overflow: hidden; }

            /* 左侧编辑区 */
            .m7-editor { flex: 3; padding: 30px; overflow-y: auto; border-right: 1px solid var(--m7-border); }
            .m7-section { margin-bottom: 40px; }
            .m7-section-header {
                display: flex; justify-content: space-between; align-items: center;
                border-bottom: 2px solid var(--m7-border); padding-bottom: 10px; margin-bottom: 20px;
            }
            .m7-h2 { font-size: 1.2rem; color: var(--m7-text); font-weight: bold; }

            /* 分类块 */
            .m7-category {
                background: rgba(255,255,255,0.02); border: 1px solid var(--m7-border);
                border-radius: 8px; margin-bottom: 20px; padding: 15px;
                transition: border-color 0.3s;
            }
            .m7-category.active { border-color: var(--m7-primary); box-shadow: 0 0 10px rgba(0, 250, 255, 0.1); }

            .m7-cat-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .m7-input-clean {
                background: transparent; border: none; border-bottom: 1px dashed var(--m7-text-dim);
                color: var(--m7-primary); font-size: 1.1em; font-weight: bold; width: 200px;
                padding: 2px; transition: 0.3s;
            }
            .m7-input-clean:focus { outline: none; border-bottom-color: var(--m7-primary); width: 300px; }

            /* 条目行 */
            .m7-item {
                display: grid; gap: 10px; align-items: start;
                background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; margin-bottom: 8px;
            }
           .m7-item-base { display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center; }
            .m7-item-legend {
                display: grid; grid-template-columns: 80px 1fr; gap: 10px; align-items: center;
                margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);
                animation: fadeIn 0.3s;
            }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

            .m7-input-box {
                background: rgba(0,0,0,0.3); border: 1px solid var(--m7-border);
                color: var(--m7-text); padding: 6px 10px; border-radius: 4px; width: 100%;
            }
            .m7-input-box:focus { border-color: var(--m7-primary); outline: none; }

            /* 右侧商店 */
            .m7-sidebar { flex: 1; background: rgba(0,0,0,0.2); display: flex; flex-direction: column; min-width: 300px; }
            .m7-sidebar-header { padding: 15px; font-weight: bold; background: rgba(255,255,255,0.05); }
            .m7-sidebar-content { flex: 1; overflow-y: auto; padding: 15px; }

            .m7-card {
                background: rgba(255,255,255,0.05); border: 1px solid transparent;
                padding: 12px; border-radius: 6px; margin-bottom: 10px; cursor: pointer;
                transition: 0.2s;
            }
            .m7-card:hover { border-color: var(--m7-primary); background: rgba(0, 250, 255, 0.05); transform: translateX(-2px); }
            .m7-card-title { font-weight: bold; color: var(--m7-primary); margin-bottom: 4px; }
            .m7-card-desc { font-size: 0.85em; color: var(--m7-text-dim); }

            .m7-tag {
                display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 0.75em; margin-left: 5px;
                border: 1px solid currentColor;
            }
            .tag-attr { color: var(--m7-warn); }
            .tag-skill { color: var(--m7-success); }

            /* 滚动条美化 */
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
            ::-webkit-scrollbar-thumb { background: var(--m7-border); border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: var(--m7-primary); }
        
        .m7-confirm-overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    display: flex; justify-content: center; align-items: center;
    z-index: 10001; /* 比主界面高一层 */
    animation: fadeInConfirm 0.2s ease-out;
}
@keyframes fadeInConfirm { from { opacity: 0; } to { opacity: 1; } }

.m7-confirm-box {
    background: var(--m7-panel);
    border: 1px solid var(--m7-border);
    box-shadow: 0 5px 25px rgba(0,0,0,0.5);
    border-radius: 8px;
    padding: 25px 30px;
    width: 90%;
    max-width: 400px;
    text-align: center;
    animation: slideInConfirm 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
@keyframes slideInConfirm { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.m7-confirm-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--m7-warn);
    margin-bottom: 10px;
}
.m7-confirm-text {
    color: var(--m7-text-dim);
    margin-bottom: 25px;
    line-height: 1.6;
}
.m7-confirm-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
}

/* 新增：抽屉按钮和响应式布局 */
.m7-drawer-toggle {
    display: none; /* 默认在PC端隐藏 */
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: var(--m7-primary);
    color: #000;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 250, 255, 0.4);
    z-index: 10002; /* 比确认框高一层 */
    cursor: pointer;
}

/* 媒体查询：当屏幕宽度小于等于768px时应用 */
@media (max-width: 768px) {
    .m7-body {
        flex-direction: column; /* 垂直布局 */
    }
    .m7-editor {
        border-right: none; /* 移除PC端的竖线 */
    }
    .m7-sidebar {
        position: fixed;
        top: 60px; /* 避开顶部导航栏 */
        right: 0;
        width: 80%;
        max-width: 320px;
        height: calc(100% - 60px);
        transform: translateX(100%); /* 默认移出屏幕 */
        transition: transform 0.3s ease-in-out;
        z-index: 10001;
        border-left: 1px solid var(--m7-border);
        box-shadow: -5px 0 20px rgba(0,0,0,0.3);
        background:var(--m7-panel);
    }
    .m7-sidebar.open {
        transform: translateX(0); /* 移入屏幕 */
    }
    .m7-drawer-toggle {
        display: flex; /* 在手机端显示 */
        justify-content: center;
        align-items: center;
    }
}
    .m7-input-box.item-name {
    min-width: 120px; /* 设置一个合理的最小宽度 */
}
        /* --- 新增：联动编辑器样式 (积木版) --- */
            /* --- 新增：联动编辑器样式 (悬浮窗版) --- */
            .m7-linkage-container {
                display: flex; height: 100%; position: relative; background: #0b1015;
                overflow: hidden; font-family: 'Segoe UI', monospace;
            }
            .m7-col {
                width: 260px; display: flex; flex-direction: column;
                padding: 10px; overflow-y: auto; z-index: 1;
                background: rgba(20, 30, 40, 0.9); border-right: 1px solid var(--m7-border);
            }
            .m7-col.right { border-left: 1px solid var(--m7-border); border-right: none; margin-left: auto; }

            .m7-col-header {
                font-weight: bold; color: var(--m7-primary); margin-bottom: 10px;
                padding-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .m7-node {
                padding: 6px 10px; margin-bottom: 6px; background: rgba(255,255,255,0.05);
                border: 1px solid transparent; border-radius: 4px; cursor: pointer;
                font-size: 0.85em; user-select: none; display: flex; justify-content: space-between;
                transition: 0.2s; color: var(--m7-text-dim);
            }
            .m7-node:hover { border-color: var(--m7-primary); color: var(--m7-text); background: rgba(0, 250, 255, 0.05); }
            .m7-node.active { background: rgba(0, 250, 255, 0.2); color: #fff; border-color: var(--m7-primary); }
            .m7-node.has-rule { border-left: 3px solid var(--m7-success); }
            .m7-node-val { font-family: monospace; opacity: 0.5; }

            .m7-workspace {
                flex: 1; position: relative;
                background: radial-gradient(circle at center, #1a253a 0%, #0b1015 100%);
                overflow: hidden;
            }

            .m7-canvas-layer {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                pointer-events: none; z-index: 0;
            }
            .link-line { fill: none; stroke: var(--m7-primary); stroke-width: 2; opacity: 0.6; filter: drop-shadow(0 0 2px var(--m7-primary)); }

             /* 悬浮编辑器面板 (优化版) */
            .m7-editor-panel {
                position: fixed; /* 改为 fixed 防止滚动影响 */
                top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 700px; /* 足够宽，覆盖左右也没关系 */
                height: 500px; /* 固定高度，内部滚动 */
                background: rgba(15, 23, 35, 0.98);
                border: 1px solid var(--m7-primary); border-radius: 8px;
                display: flex; flex-direction: column; gap: 0;
                z-index: 2000; /* 确保在最上层 */
                box-shadow: 0 20px 50px rgba(0,0,0,0.9);
                display: none;
            }
            .m7-editor-panel.active { display: flex; }

            /* 拖拽时移除居中变换，防止闪烁 */
            .m7-editor-panel.dragging { transform: none; transition: none; }

            .m7-panel-header {
                padding: 12px 20px; background: rgba(0, 250, 255, 0.1);
                border-bottom: 1px solid var(--m7-border);
                cursor: move; font-weight: bold; color: var(--m7-primary);
                display: flex; justify-content: space-between; align-items: center;
                user-select: none;
            }

            .m7-panel-body {
                padding: 20px; display: flex; flex-direction: column; gap: 15px;
                flex: 1; overflow-y: auto;
            }
            .m7-token-box {
                min-height: 80px; max-height: 150px; overflow-y: auto;
                padding: 10px; background: rgba(0,0,0,0.3);
                border: 1px solid var(--m7-text-dim); border-radius: 4px;
                display: flex; flex-wrap: wrap; gap: 5px; align-items: center; align-content: flex-start;
                cursor: text; transition: 0.2s;
            }
            .m7-token-box.error { border-color: var(--m7-danger); }

            .m7-token {
                padding: 4px 8px; border-radius: 4px; font-size: 0.9em; cursor: pointer;
                user-select: none; display: inline-block; transition: 0.2s; margin: 2px;
            }
            .m7-token:hover { transform: scale(1.05); }
            .tok-var { background: rgba(0, 250, 255, 0.15); color: var(--m7-primary); border: 1px solid rgba(0, 250, 255, 0.3); }
            .tok-self { background: rgba(255, 95, 95, 0.15); color: var(--m7-danger); border: 1px solid rgba(255, 95, 95, 0.3); }
            .tok-op { background: rgba(255, 255, 255, 0.1); color: #fff; font-weight: bold; }
            .tok-num { background: rgba(255, 183, 77, 0.15); color: var(--m7-warn); border: 1px solid rgba(255, 183, 77, 0.3); }

            .m7-calc-pad { display: flex; gap: 8px; flex-wrap: wrap; }
            .m7-calc-btn {
                padding: 8px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                color: var(--m7-text); border-radius: 4px; cursor: pointer; font-family: monospace; flex: 1;
                min-width: 40px; text-align: center;
            }
            .m7-calc-btn:hover { background: rgba(255,255,255,0.15); border-color: var(--m7-text); }

            /* 数字输入层 */
            .m7-num-modal {
                position: absolute; bottom: 70px; right: 20px;
                background: var(--m7-panel); border: 1px solid var(--m7-border);
                padding: 10px; border-radius: 6px; display: none;
                box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 101;
            }
            .m7-num-modal.show { display: flex; gap: 5px; }
            `;
        document.head.appendChild(style);
    }

    // ==========================================================================
    // 3. 核心逻辑
    // ==========================================================================

    let currentFullData = null;
    let selectedCategory = null; // { obj: ref, type: 'attr'|'skill', name: string }
     let currentLinkageRules = {};
    // 新增：自定义确认对话框函数
    function showCustomConfirm(title, text) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'm7-confirm-overlay';
            overlay.innerHTML = `
                <div class="m7-confirm-box">
                    <div class="m7-confirm-title">${title}</div>
                    <div class="m7-confirm-text">${text}</div>
                    <div class="m7-confirm-actions">
                        <button class="m7-btn" id="m7-confirm-cancel">取消</button>
                        <button class="m7-btn danger" id="m7-confirm-ok">确认</button>
                    </div>
                </div>
            `;

            const fullscreenUI = document.querySelector('.m7-fullscreen');
            if (fullscreenUI) {
                fullscreenUI.appendChild(overlay);
            } else {
                // 备用方案，虽然不太可能发生
                document.body.appendChild(overlay);
            }

            const close = (result) => {
                overlay.remove();
                resolve(result);
            };

            overlay.querySelector('#m7-confirm-ok').onclick = () => close(true);
            overlay.querySelector('#m7-confirm-cancel').onclick = () => close(false);
        });
    }
    // 初始化入口
     // --- 新增：本地存储管理函数 ---
    function getLocalTemplates() {
        try {
            return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
        } catch (e) {
            console.error("读取本地模板失败", e);
            return {};
        }
    }

  function saveLocalTemplate(name, data) {
        const current = getLocalTemplates();
        current[name] = {
            desc: `于 ${new Date().toLocaleString()} 保存的自定义模板`,
            attr: JSON.parse(JSON.stringify(data.基础属性)),
            skill: JSON.parse(JSON.stringify(data.基础技能)),
            rules: JSON.parse(JSON.stringify(currentLinkageRules || {})) // 新增：保存联动规则
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
    }

    function deleteLocalTemplate(name) {
        const current = getLocalTemplates();
        delete current[name];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
    }
    async function autoImportDiyAttributes() {
    try {
        // 获取所有绑定的世界书
        const charWorldbooks = getCharWorldbookNames('current');
        const allBoundWorldbooks = [
            ...new Set([
                ...getGlobalWorldbookNames(),
                ...charWorldbooks.additional,
                getChatWorldbookName('current')
            ].filter(Boolean))
        ];

        if (allBoundWorldbooks.length === 0) {
            console.log('[MOD07] 没有找到绑定的世界书');
            return;
        }

        let importCount = 0;
        const existingTemplates = getLocalTemplates();

        // 遍历所有世界书
        for (const worldbookName of allBoundWorldbooks) {
            try {
                const allEntries = await getLorebookEntries(worldbookName);
                const diyEntries = allEntries.filter(entry => 
                    entry.comment === DIY_ATTRIBUTE_ENTRY && entry.content
                );

                for (const entry of diyEntries) {
                    try {
                        const templateData = JSON.parse(entry.content);
                        
                        // 验证数据结构
                        if (!templateData.attr || !templateData.skill) {
                            console.warn(`[MOD07] 世界书 "${worldbookName}" 中的 ${DIY_ATTRIBUTE_ENTRY} 数据格式不正确`);
                            continue;
                        }

                        // 生成模板名称（带世界书来源标识）
                        const templateName = templateData.name || `${worldbookName}_导入_${Date.now().toString().slice(-6)}`;
                        
                        // 如果模板已存在，跳过（避免覆盖用户修改）
                        if (existingTemplates[templateName]) {
                            console.log(`[MOD07] 模板 "${templateName}" 已存在，跳过导入`);
                            continue;
                        }

                        // 保存到本地存储
                        const current = getLocalTemplates();
                        current[templateName] = {
                            desc: templateData.desc || `从世界书"${worldbookName}"自动导入 (${new Date().toLocaleString()})`,
                            attr: templateData.attr,
                            skill: templateData.skill,
                            source: worldbookName // 标记来源
                        };
                        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
                        
                        importCount++;
                        console.log(`[MOD07] 已导入模板: ${templateName}`);

                    } catch (parseError) {
                        console.warn(`[MOD07] 解析世界书 "${worldbookName}" 中的 ${DIY_ATTRIBUTE_ENTRY} 失败:`, parseError);
                    }
                }
            } catch (e) {
                console.warn(`[MOD07] 读取世界书 "${worldbookName}" 时出错:`, e);
            }
        }

        if (importCount > 0) {
            console.log(`[MOD07] ✅ 成功自动导入 ${importCount} 个自定义模板`);
        } else {
            console.log(`[MOD07] 未找到新的 ${DIY_ATTRIBUTE_ENTRY} 模板需要导入`);
        }

    } catch (error) {
        console.error('[MOD07] 自动导入模板时出错:', error);
    }
}
  function init() {
        const observer = new MutationObserver(() => {
            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal && !document.getElementById('mod07-entry-btn')) {
                injectButton(settingsModal);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // 尝试立即注入按钮
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) injectButton(settingsModal);

        // --- 新增：启动时自动读取本地规则并生效 ---
        try {
            const savedRules = localStorage.getItem(RULES_STORAGE_KEY);
            if (savedRules) {
                currentLinkageRules = JSON.parse(savedRules);

                // =========== 修改开始 ===========
                // 原代码: setTimeout(() => injectCustomLogic(), 1000);
                // 修改后: 使用定时器轮询，直到 worldHelper 出现才注入
                const waitTimer = setInterval(() => {
                    if (window.worldHelper) {
                        clearInterval(waitTimer);
                        injectCustomLogic();
                        console.log('[MOD07] 自动加载联动规则成功');
                    }
                }, 500); // 每0.5秒检查一次
                // =========== 修改结束 ===========
            }
        } catch (e) { console.error('[MOD07] 自动加载规则失败', e); }
    }

    function injectButton(modal) {
        const achieveBtn = modal.querySelector('#achievements-btn');
        if (achieveBtn) {
            const btn = document.createElement('button');
            btn.id = 'mod07-entry-btn';
            btn.innerHTML = '🛠️';
            btn.title = '自定义基础属性/技能';
            btn.onclick = openEditor;
            achieveBtn.parentNode.insertBefore(btn, achieveBtn);
        }
    }

     async function openEditor(e) {
        e.preventDefault();

        // 提示用户
        worldHelper.showNovaAlert('正在连接世界本源...', 'info');
        await autoImportDiyAttributes();

        // --- 新增/修改：读取本地联动规则 ---
        try {
            const savedRules = localStorage.getItem(RULES_STORAGE_KEY);
            if (savedRules) {
                currentLinkageRules = JSON.parse(savedRules);
               
            } else {
                currentLinkageRules = {};
            }
            // 提示用户规则存储位置
 
        } catch (e) {
            console.error("读取本地规则失败", e);
            currentLinkageRules = {};
        }
        try {
            const allEntries = await getLorebookEntries(LOREBOOK_NAME);
            const initEntry = allEntries.find(entry => entry.comment === ENTRY_NAME);

            if (!initEntry || !initEntry.content) {
                worldHelper.showNovaAlert('未找到初始化数据，已加载默认模板', 'warning');
                currentFullData = JSON.parse(JSON.stringify(DEFAULT_FULL_DATA));
            } else {
                try {
                    currentFullData = JSON.parse(initEntry.content);
                } catch (err) {
                    console.error(err);
                    worldHelper.showNovaAlert('数据解析失败，已重置为安全模式', 'danger');
                    currentFullData = JSON.parse(JSON.stringify(DEFAULT_FULL_DATA));
                }
            }

            // 确保路径存在
            if (!currentFullData.play_character_data) currentFullData.play_character_data = {};
            if (!currentFullData.play_character_data.基础属性) currentFullData.play_character_data.基础属性 = {};
            if (!currentFullData.play_character_data.基础技能) currentFullData.play_character_data.基础技能 = {};

            renderFullScreenUI();

        } catch (err) {
            console.error(err);
            worldHelper.showNovaAlert('读取世界书失败: ' + err.message, 'danger');
        }
    }

    // 渲染全屏UI框架
    function renderFullScreenUI() {
        // 移除旧的（如果有）
        const old = document.querySelector('.m7-fullscreen');
        if (old) old.remove();

        const container = document.createElement('div');
        container.className = 'm7-fullscreen';
   container.innerHTML = `
    <div class="m7-header">

        <div class="m7-actions">
            <button class="m7-btn danger" id="m7-close">关闭</button>
            <button class="m7-btn primary" id="m7-save">应用(记得点击！点击后重构或重开生效)</button>
              <button class="m7-btn" id="m7-view-toggle">🔗 衍生属性配置</button>
        </div>
    </div>
    <div class="m7-body">
        <div class="m7-editor" id="m7-editor-area"></div>
         <div class="m7-linkage-container" id="m7-linkage-area" style="display:none; flex:3;"></div> 
          <div class="m7-sidebar" id="m7-sidebar-panel">
        <div class="m7-sidebar-header" style="display:flex; justify-content:space-between; align-items:center;">
            <span>📦 模板商店</span>
            <button class="m7-btn m7-btn-sm" id="m7-export-btn" title="导出当前模板">📤 导出</button>
        </div>
        <div class="m7-sidebar-content" id="m7-store-area"></div>
    </div>
    </div>
    <button class="m7-drawer-toggle" id="m7-drawer-btn">📦</button>
`;

        document.body.appendChild(container);

        // 绑定事件
        container.querySelector('#m7-close').onclick = () => container.remove();
        container.querySelector('#m7-save').onclick = async () => {
            // --- 新增：保存规则到本地 ---
            localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(currentLinkageRules));
            // --------------------------
            await saveData();
            container.remove();
        };
// 新增：抽屉按钮事件绑定
const sidebar = container.querySelector('#m7-sidebar-panel');
const drawerBtn = container.querySelector('#m7-drawer-btn');
drawerBtn.onclick = () => {
    sidebar.classList.toggle('open');
};

// 新增：点击编辑器区域时，如果抽屉是打开的，则关闭它
container.querySelector('#m7-editor-area').onclick = () => {
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
};
        renderEditorContent();
        renderStoreContent();


            let isLinkageView = false;
        container.querySelector('#m7-view-toggle').onclick = () => {
            isLinkageView = !isLinkageView;
            const editor = container.querySelector('#m7-editor-area');
            const linkage = container.querySelector('#m7-linkage-area');
            const btn = container.querySelector('#m7-view-toggle');

            if (isLinkageView) {
                editor.style.display = 'none';
                linkage.style.display = 'flex';
                btn.classList.add('primary');
                renderLinkageEditor(); // 渲染联动界面
            } else {
                editor.style.display = 'block';
                linkage.style.display = 'none';
                btn.classList.remove('primary');
            }
        };

          container.querySelector('#m7-export-btn').onclick = () => {
            const exportData = {
                name: "自定义模板_" + new Date().toLocaleDateString(),
                desc: "玩家导出的自定义属性模板",
                attr: currentFullData.play_character_data.基础属性,
                skill: currentFullData.play_character_data.基础技能,
                rules: currentLinkageRules
            };
            const jsonStr = JSON.stringify(exportData, null, 2);

            // 创建导出弹窗
            const overlay = document.createElement('div');
            overlay.className = 'm7-confirm-overlay';
            overlay.innerHTML = `
                <div class="m7-confirm-box" style="max-width:600px; text-align:left;">
                    <div class="m7-confirm-title">📤 导出模板数据</div>
                    <div class="m7-confirm-text" style="font-size:0.9em;">
                        请复制下方代码，在世界书中新建词条。<br>
                        <strong>词条名：</strong><span style="color:var(--m7-warn); user-select:all;">[diyattribute]</span><br>
                        <strong>这个词条一直关着就行，位置随意</strong>
                    </div>
                    <textarea class="m7-input-box" style="height:200px; font-family:monospace; font-size:0.8em; margin-bottom:15px;" readonly>${jsonStr}</textarea>
                    <div class="m7-confirm-actions">
                        <button class="m7-btn" id="m7-export-close">关闭</button>
                        <button class="m7-btn primary" id="m7-export-copy">📋 复制并关闭</button>
                    </div>
                </div>
            `;
            container.appendChild(overlay);

            overlay.querySelector('#m7-export-close').onclick = () => overlay.remove();
            overlay.querySelector('#m7-export-copy').onclick = () => {
                const textarea = overlay.querySelector('textarea');
                textarea.select();
                document.execCommand('copy');
                worldHelper.showNovaAlert('已复制到剪贴板！', 'success');
                overlay.remove();
            };
        };
    }
     function renderLinkageEditor() {
        const container = document.getElementById('m7-linkage-area');
        if (!container) return;
        container.innerHTML = '';

        // --- 1. 数据准备 (修改：增强取值逻辑) ---

        // 新增：优先获取游戏内实时数据，匹配不到则回退到模板数据
        const getLiveValue = (path) => {
            let val = null;

            // A. 尝试从 GameAPI 获取 (实时)
            if (window.GameAPI && window.GameAPI.playCharacterData) {
                try {
                    const liveNode = path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, window.GameAPI.playCharacterData);
                    if (Array.isArray(liveNode)) val = liveNode[0];
                    else if (typeof liveNode === 'number') val = liveNode;
                } catch (e) { /* 忽略路径匹配错误 */ }
            }

            // B. 回退到当前模板数据 (预览/新建时)
            if (val === null || val === undefined) {
                try {
                    val = path.split('.').reduce((o, k) => o && o[k], currentFullData.play_character_data)?.[0];
                } catch { }
            }

            return Number(val) || 0; // 确保返回数字
        };

        const sources = [];
        const targets = [];

        const extractNodes = (obj, prefix, list, rootName) => {
            for (const key in obj) {
                // --- 修改：过滤掉“传奇”属性 ---
                if (key === '传奇') continue;
                // ---------------------------

                const val = obj[key];
                const currentPath = prefix ? `${prefix}.${key}` : key;

                if (Array.isArray(val) && typeof val[0] === 'number') {
                    let displayName = key;
                    if (['基础', '上限', '当前值'].includes(key)) {
                        const parent = prefix.split('.').pop();
                        displayName = `${parent} (${key})`;
                    } else if (rootName === '技能') {
                        displayName = `${key} (技能)`;
                    }
                    // 使用 getLiveValue 获取实时值
                    list.push({ name: displayName, path: currentPath, val: getLiveValue(currentPath) });
                } else if (typeof val === 'object' && val !== null) {
                    extractNodes(val, currentPath, list, rootName);
                }
            }
        };

        extractNodes(currentFullData.play_character_data.基础属性, '基础属性', sources, '属性');
        extractNodes(currentFullData.play_character_data.基础技能, '基础技能', sources, '技能');
        extractNodes(currentFullData.play_character_data.衍生属性, '衍生属性', targets, '衍生');
        extractNodes(currentFullData.play_character_data.货币, '货币', targets, '货币');

        // --- 2. 构建 UI (保持原有结构，仅微调) ---
        const leftCol = document.createElement('div'); leftCol.className = 'm7-col';
        leftCol.innerHTML = `
            <div class="m7-col-header">📥 来源 (实时值)</div>
            <div class="m7-node" id="m7-src-self" style="border-left:3px solid var(--m7-danger);">
                <span>🔴 当前目标旧值</span><span class="m7-node-val">Self</span>
            </div>
            <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:5px 0;">
        `;

        const workspace = document.createElement('div'); workspace.className = 'm7-workspace';
        const rightCol = document.createElement('div'); rightCol.className = 'm7-col right';
        rightCol.innerHTML = `<div class="m7-col-header">📤 目标 (实时值)</div>`;

        const svgLayer = document.createElement('svg'); svgLayer.className = 'm7-canvas-layer';
        workspace.appendChild(svgLayer);

        // ... (中间的 editorPanel 创建代码保持不变，省略以节省篇幅) ...
        // 务必保留 editorPanel 的创建代码
        const editorPanel = document.createElement('div');
        editorPanel.className = 'm7-editor-panel';
        // ... editorPanel.innerHTML 内容保持不变 ...
        editorPanel.innerHTML = `
            <div class="m7-panel-header" id="m7-drag-handle">
                <span id="m7-edit-title">编辑规则</span>
                <button class="m7-btn m7-btn-sm danger" id="m7-btn-close-panel">×</button>
            </div>
            <div class="m7-panel-body">
                <div class="m7-token-box" id="m7-token-area" tabindex="0"></div>
                <div style="display:flex; justify-content:space-between; font-size:0.9em; color:var(--m7-text-dim);">
                    <span>预览: <span id="m7-formula-text" style="color:var(--m7-primary)"></span></span>
                    <span>结果: <span id="m7-result-val" style="font-weight:bold; color:var(--m7-success)">0</span></span>
                </div>
                <!-- 计算器按钮区域保持不变 -->
                <div class="m7-calc-pad">
                    <button class="m7-calc-btn" data-op="+">+</button>
                    <button class="m7-calc-btn" data-op="-">-</button>
                    <button class="m7-calc-btn" data-op="*">×</button>
                    <button class="m7-calc-btn" data-op="/">÷</button>
                    <button class="m7-calc-btn" data-op="(">(</button>
                    <button class="m7-calc-btn" data-op=")">)</button>
                    <button class="m7-calc-btn" data-op="Math.max(">Max</button>
                    <button class="m7-calc-btn" data-op="Math.min(">Min</button>
                    <button class="m7-calc-btn" data-op="Math.floor(">取整</button>
                </div>
                <div class="m7-calc-pad">
                    <button class="m7-calc-btn" id="m7-btn-num" style="flex:2; color:var(--m7-warn);">🔢 输入数字</button>
                    <button class="m7-calc-btn danger" id="m7-btn-backspace">⌫ 退格</button>
                    <button class="m7-calc-btn danger" id="m7-btn-clear">🗑️ 清空</button>
                    <button class="m7-calc-btn primary" id="m7-btn-save" style="flex:2;">💾 保存</button>
                </div>
            </div>
            <div class="m7-num-modal" id="m7-num-input-box">
                <input type="number" class="m7-input-box" style="width:80px;" placeholder="0">
                <button class="m7-btn primary m7-btn-sm">OK</button>
            </div>
        `;
        workspace.appendChild(editorPanel);

        container.appendChild(leftCol);
        container.appendChild(workspace);
        container.appendChild(rightCol);

        // ... (拖拽逻辑 makeDraggable 保持不变) ...
        const makeDraggable = (el, handle) => { /* ...原代码... */
             let isDragging = false;
            let startX, startY, startLeft, startTop;
            handle.onmousedown = (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = el.getBoundingClientRect();
                el.classList.add('dragging');
                el.style.transform = 'none';
                el.style.left = rect.left + 'px';
                el.style.top = rect.top + 'px';
                startLeft = rect.left;
                startTop = rect.top;
                document.body.style.userSelect = 'none';
            };
            document.onmousemove = (e) => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                el.style.left = (startLeft + dx) + 'px';
                el.style.top = (startTop + dy) + 'px';
            };
            document.onmouseup = () => {
                if (isDragging) {
                    isDragging = false;
                    el.classList.remove('dragging');
                    document.body.style.userSelect = '';
                }
            };
        };
        makeDraggable(editorPanel, editorPanel.querySelector('#m7-drag-handle'));

        // --- 4. 状态与渲染 ---
        let activeTarget = null;
        let tokens = [];

        // 渲染左侧 (Sources)
        sources.forEach(src => {
            const el = document.createElement('div');
            el.className = 'm7-node source-node';
            el.dataset.path = src.path;
            el.innerHTML = `<span>${src.name}</span><span class="m7-node-val">${src.val}</span>`;
            el.onclick = () => addToken('var', src.path, src.name);
            leftCol.appendChild(el);
        });

        // 绑定“旧值”按钮
        leftCol.querySelector('#m7-src-self').onclick = () => {
            if (activeTarget) addToken('self', 'this', activeTarget.name + '(旧)');
        };

        // 渲染右侧 (Targets)
        targets.forEach(tgt => {
            const el = document.createElement('div');
            el.className = 'm7-node target-node';
            el.dataset.path = tgt.path;
            if (currentLinkageRules[tgt.path]) el.classList.add('has-rule');
            el.innerHTML = `<span>${tgt.name}</span><span class="m7-node-val">${tgt.val}</span>`;
            el.onclick = () => selectTarget(tgt, el);
            rightCol.appendChild(el);
        });

        // ... (selectTarget, parseRuleToTokens, addToken 保持不变) ...
        function selectTarget(tgt, el) {
            activeTarget = tgt;
            document.querySelectorAll('.target-node').forEach(n => n.classList.remove('active'));
            el.classList.add('active');
            editorPanel.classList.add('active');
            if (!editorPanel.style.left || editorPanel.style.left === '50%') {
                editorPanel.style.top = '50%';
                editorPanel.style.left = '50%';
                editorPanel.style.transform = '';
                editorPanel.classList.remove('dragging');
            }
            document.getElementById('m7-edit-title').innerText = `编辑: ${tgt.name} = `;
            const rule = currentLinkageRules[tgt.path] || '';
            parseRuleToTokens(rule);
            renderTokens();
        }
        function parseRuleToTokens(rule) {  
             tokens = [];
            if (!rule) return;
            const regex = /\{this\}|\{([^}]+)\}|([0-9]+(\.[0-9]+)?)|(Math\.[a-z]+\()|([+\-*/(),])/g;
            let match;
            while ((match = regex.exec(rule)) !== null) {
                if (match[0] === '{this}') {
                       tokens.push({
                        type: 'self',
                        val: 'this',
                        label: activeTarget ? (activeTarget.name + '(旧)') : '旧值'
                    });
                } else if (match[1]) {
                    const path = match[1];
                    const src = sources.find(s => s.path === path);
                    tokens.push({ type: 'var', val: path, label: src ? src.name : path });
                } else if (match[2]) {
                    tokens.push({ type: 'num', val: match[2], label: match[2] });
                } else if (match[4]) {
                    tokens.push({ type: 'op', val: match[4], label: match[4].replace('Math.', '') });
                } else {
                    tokens.push({ type: 'op', val: match[0], label: match[0] });
                }
            }
        }
        function addToken(type, val, label) {
            if (!activeTarget) return;
            tokens.push({ type, val, label });
            renderTokens();
        }

        // --- 修改：updatePreview 使用 getLiveValue ---
        function updatePreview() {
            const formulaText = document.getElementById('m7-formula-text');
            const resultVal = document.getElementById('m7-result-val');
            const box = document.getElementById('m7-token-area');

            let evalStr = '';
            let displayStr = '';

            tokens.forEach(tok => {
                if (tok.type === 'var') {
                    // 修改：使用 getLiveValue 获取实时值进行预览计算
                    evalStr += getLiveValue(tok.val);
                    displayStr += `{${tok.label}}`;
                } else if (tok.type === 'self') {
                    evalStr += getLiveValue(activeTarget.path);
                    displayStr += `{旧值}`;
                } else {
                    evalStr += tok.val;
                    displayStr += tok.label;
                }
                evalStr += ' ';
            });

            formulaText.innerText = displayStr;

            try {
                if (!evalStr.trim()) {
                    resultVal.innerText = getLiveValue(activeTarget.path);
                    box.classList.remove('error');
                    return;
                }
                const res = new Function(`return ${evalStr}`)();
                if (isNaN(res)) throw new Error("NaN");
                resultVal.innerText = Math.floor(res * 100) / 100;
                box.classList.remove('error');
            } catch (e) {
                resultVal.innerText = "Err";
                box.classList.add('error');
            }
        }

        function renderTokens() {
            const box = document.getElementById('m7-token-area');
            box.innerHTML = '';
            tokens.forEach((tok, idx) => {
                const span = document.createElement('span');
                span.className = `m7-token tok-${tok.type}`;
                span.innerText = tok.label;
                span.onclick = () => { tokens.splice(idx, 1); renderTokens(); };
                box.appendChild(span);
            });
            updatePreview();
            drawLines();
        }


        function drawLines() {
            svgLayer.innerHTML = '';
            if (!activeTarget) return;
            const targetEl = document.querySelector(`.target-node[data-path="${activeTarget.path}"]`);
            if (!targetEl) return;

            const cRect = container.getBoundingClientRect();
            const tRect = targetEl.getBoundingClientRect();
            const tX = tRect.left - cRect.left;
            const tY = tRect.top - cRect.top + tRect.height / 2;

            const usedPaths = new Set(tokens.filter(t => t.type === 'var').map(t => t.val));
            usedPaths.forEach(path => {
                const srcEl = document.querySelector(`.source-node[data-path="${path}"]`);
                if (srcEl) {
                    const sRect = srcEl.getBoundingClientRect();
                    const sX = sRect.right - cRect.left;
                    const sY = sRect.top - cRect.top + sRect.height / 2;
                    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    const d = `M ${sX} ${sY} C ${sX + 80} ${sY}, ${tX - 80} ${tY}, ${tX} ${tY}`;
                    pathEl.setAttribute("d", d);
                    pathEl.setAttribute("class", "link-line");
                    svgLayer.appendChild(pathEl);
                }
            });
        }

        // --- 5. 事件绑定 ---
        document.querySelectorAll('.m7-calc-btn[data-op]').forEach(btn => {
            btn.onclick = () => addToken('op', btn.dataset.op, btn.innerText);
        });

        document.getElementById('m7-btn-backspace').onclick = () => {
            if (tokens.length > 0) { tokens.pop(); renderTokens(); }
        };
        document.getElementById('m7-btn-clear').onclick = () => {
            tokens = []; renderTokens();
        };
        document.getElementById('m7-btn-close-panel').onclick = () => {
            editorPanel.classList.remove('active');
            document.querySelectorAll('.target-node').forEach(n => n.classList.remove('active'));
            activeTarget = null;
            svgLayer.innerHTML = '';
        };

        // 数字输入逻辑
        const numModal = document.getElementById('m7-num-input-box');
        const numInput = numModal.querySelector('input');
        const numBtn = document.getElementById('m7-btn-num');

        numBtn.onclick = (e) => {
            e.stopPropagation();
            numModal.classList.add('show');
            numInput.value = '';
            numInput.focus();
        };

        const confirmNum = () => {
            const val = numInput.value;
            if (val !== '') addToken('num', val, val);
            numModal.classList.remove('show');
        };

        numModal.querySelector('button').onclick = confirmNum;
        numInput.onkeydown = (e) => { if (e.key === 'Enter') confirmNum(); };

        // 点击外部关闭数字框
        document.addEventListener('click', (e) => {
            if (!numModal.contains(e.target) && e.target !== numBtn) {
                numModal.classList.remove('show');
            }
        });

        document.getElementById('m7-btn-save').onclick = () => {
            if (!activeTarget) return;
            if (tokens.length === 0) {
                delete currentLinkageRules[activeTarget.path];
                document.querySelector(`.target-node[data-path="${activeTarget.path}"]`).classList.remove('has-rule');
            } else {
                let ruleStr = '';
                tokens.forEach(tok => {
                    if (tok.type === 'var') ruleStr += `{${tok.val}}`;
                    else if (tok.type === 'self') ruleStr += `{this}`;
                    else ruleStr += tok.val;
                });
                currentLinkageRules[activeTarget.path] = ruleStr;
                document.querySelector(`.target-node[data-path="${activeTarget.path}"]`).classList.add('has-rule');
            }
             localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(currentLinkageRules));
            injectCustomLogic();
            worldHelper.showNovaAlert('规则已更新', 'success');
        };
    }
    // 渲染左侧编辑区
    function renderEditorContent() {
        const container = document.getElementById('m7-editor-area');
        if (!container) return;
        container.innerHTML = '';

        const data = currentFullData.play_character_data;

        // 1. 属性部分
        const attrSection = createSection('基础属性 (Attributes)', data.基础属性, 'attr');
        container.appendChild(attrSection);

        // 2. 技能部分
        const skillSection = createSection('基础技能 (Skills)', data.基础技能, 'skill');
        container.appendChild(skillSection);
    }

    // 创建大区块（属性/技能）
    function createSection(title, dataObj, type) {
        const section = document.createElement('div');
        section.className = 'm7-section';

        const header = document.createElement('div');
        header.className = 'm7-section-header';
        header.innerHTML = `
            <div class="m7-h2">${title}</div>
            <button class="m7-btn m7-btn-sm">➕ 新增分类</button>
        `;

        // 新增分类逻辑
        header.querySelector('button').onclick = () => {
            const newKey = "新分类_" + Date.now().toString().slice(-4);
            dataObj[newKey] = {};
            renderEditorContent(); // 刷新
        };

        section.appendChild(header);

        // 渲染分类
        Object.keys(dataObj).forEach(catName => {
            const catDiv = document.createElement('div');
            catDiv.className = 'm7-category';
            if (selectedCategory && selectedCategory.name === catName && selectedCategory.type === type) {
                catDiv.classList.add('active');
            }

            // 分类头
            const catHeader = document.createElement('div');
            catHeader.className = 'm7-cat-header';
            catHeader.innerHTML = `
                <input class="m7-input-clean" value="${catName}">
                <div style="display:flex; gap:5px">
                    <button class="m7-btn m7-btn-sm add-item">➕ 条目</button>
                    <button class="m7-btn m7-btn-sm danger del-cat">🗑️</button>
                </div>
            `;

            // 修改分类名
            const nameInput = catHeader.querySelector('input');
            nameInput.onchange = (e) => {
                const newName = e.target.value.trim();
                if (newName && newName !== catName) {
                    if (dataObj[newName]) {
                        worldHelper.showNovaAlert('分类名已存在', 'warning');
                        e.target.value = catName;
                        return;
                    }
                    dataObj[newName] = dataObj[catName];
                    delete dataObj[catName];
                    // 更新选中状态引用
                    if (selectedCategory && selectedCategory.name === catName) selectedCategory.name = newName;
                    renderEditorContent();
                }
            };

           // 删除分类
            catHeader.querySelector('.del-cat').onclick = async (e) => {
                e.stopPropagation();
                const confirmed = await showCustomConfirm('删除确认', `确定要永久删除分类【${catName}】及其所有内容吗？此操作无法撤销。`);
                if (confirmed) {
                    delete dataObj[catName];
                    if (selectedCategory && selectedCategory.name === catName) selectedCategory = null;
                    renderEditorContent();
                }
            };

            // 新增条目
            catHeader.querySelector('.add-item').onclick = (e) => {
                e.stopPropagation();
                const newItemName = "新项目";
                if (type === 'attr') {
                    dataObj[catName][newItemName] = { "基础": [0, "描述"] };
                } else {
                    dataObj[catName][newItemName] = [0, "描述"];
                }
                renderEditorContent();
            };

            catDiv.appendChild(catHeader);

            // 渲染具体条目列表
            const itemsDiv = document.createElement('div');
            const items = dataObj[catName];

            Object.keys(items).forEach(itemName => {
                const itemData = items[itemName];
                const itemRow = document.createElement('div');
                itemRow.className = 'm7-item';

                if (type === 'attr') {
                    // 属性渲染
                    const hasLegendary = !!itemData['传奇'];
 itemRow.innerHTML = `
    <div class="m7-item-base" style="grid-template-columns: 150px 1fr auto;">
        <input class="m7-input-box item-name" value="${itemName}" placeholder="名称">
        <input class="m7-input-box" value="${itemData['基础'][1]}" data-key="baseDesc" placeholder="描述">
        <div style="display:flex; gap:5px">
            <button class="m7-btn m7-btn-sm ${hasLegendary ? 'primary' : ''} toggle-legend" title="切换传奇属性">
                ${hasLegendary ? '★ 传奇' : '☆ 凡人'}
            </button>
            <button class="m7-btn m7-btn-sm danger del-item">×</button>
        </div>
    </div>
`;

                    // 绑定属性事件
   itemRow.querySelector('.toggle-legend').onclick = () => {
    if (hasLegendary) delete itemData['传奇'];
    else itemData['传奇'] = [0, "提供加成"]; // <-- 修改点
    renderEditorContent();
};

                    // 值绑定
  itemRow.querySelectorAll('input[data-key]').forEach(inp => {
    inp.onchange = (e) => {
        const k = e.target.dataset.key;
        const v = e.target.value;
        if (k === 'baseDesc') itemData['基础'][1] = v;
 
    };
});

                } else {
                    // 技能渲染
       itemRow.innerHTML = `
    <div class="m7-item-base">
        <input class="m7-input-box item-name" value="${itemName}" placeholder="名称">
        <input class="m7-input-box" value="${itemData[1]}" data-key="desc" placeholder="描述">
        <button class="m7-btn m7-btn-sm danger del-item">×</button>
    </div>
`;
                    // 技能值绑定
                    itemRow.querySelector('input[data-key="desc"]').onchange = (e) => {
                        itemData[1] = e.target.value;
                    };
                }

                // 通用：改名
                itemRow.querySelector('.item-name').onchange = (e) => {
                    const newN = e.target.value.trim();
                    if (newN && newN !== itemName) {
                        items[newN] = items[itemName];
                        delete items[itemName];
                        renderEditorContent();
                    }
                };

                // 通用：删除
                itemRow.querySelector('.del-item').onclick = () => {
                    delete items[itemName];
                    itemRow.remove();
                };

                itemsDiv.appendChild(itemRow);
            });

            catDiv.appendChild(itemsDiv);
            section.appendChild(catDiv);

            // 点击选中分类（用于商店添加）
            catDiv.onclick = (e) => {
                // 阻止冒泡防止点输入框也触发
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

                document.querySelectorAll('.m7-category').forEach(c => c.classList.remove('active'));
                catDiv.classList.add('active');
                selectedCategory = { obj: items, type: type, name: catName };
            };
        });

        return section;
    }

  // 渲染右侧商店 (已修改：支持本地存储)
    function renderStoreContent() {
        const container = document.getElementById('m7-store-area');
        if (!container) return;
        container.innerHTML = '';

        // ============================
        // A. 本地模板区 (新增)
        // ============================
        const localHeader = document.createElement('div');
        localHeader.innerHTML = `<div style="color:var(--m7-text-dim); margin-bottom:10px; font-size:0.9em; margin-top:10px;">💾 本地/自定义模板</div>`;
        container.appendChild(localHeader);

        // A-1. 保存当前为新模板的面板
        const savePanel = document.createElement('div');
        savePanel.style.cssText = "display:flex; gap:5px; margin-bottom:15px;";
        savePanel.innerHTML = `
            <input id="m7-local-name" class="m7-input-box" placeholder="输入新模板名称..." style="flex:1;">
            <button class="m7-btn primary m7-btn-sm" id="m7-local-save-btn">保存</button>
        `;
        container.appendChild(savePanel);

        // 绑定保存事件
        savePanel.querySelector('#m7-local-save-btn').onclick = () => {
            const nameInput = savePanel.querySelector('#m7-local-name');
            const name = nameInput.value.trim();
            if (!name) {
                worldHelper.showNovaAlert('给你的模板起个名字吧，我的孩子！', 'warning');
                return;
            }
            // 检查重名
            const existing = getLocalTemplates();
            if (existing[name] && !confirm(`模板【${name}】已存在，要覆盖它吗？`)) {
                return;
            }

            saveLocalTemplate(name, currentFullData.play_character_data);
            worldHelper.showNovaAlert(`模板【${name}】已保存到本地！`, 'success');
            nameInput.value = ''; // 清空输入框
            renderStoreContent(); // 刷新列表
        };

        // A-2. 渲染已保存的本地模板列表
        const localTemplates = getLocalTemplates();
        const localKeys = Object.keys(localTemplates);

        if (localKeys.length === 0) {
            const emptyTip = document.createElement('div');
            emptyTip.style.cssText = "font-size:0.8em; color:var(--m7-text-dim); font-style:italic; margin-bottom:15px; text-align:center;";
            emptyTip.innerText = "暂无本地模板，快去保存一个吧~";
            container.appendChild(emptyTip);
        } else {
            localKeys.forEach(tmplName => {
                const tmpl = localTemplates[tmplName];
                const card = document.createElement('div');
                card.className = 'm7-card';
                // 使用grid布局方便放删除按钮
                card.style.cssText = "display:grid; grid-template-columns: 1fr auto; gap:10px; align-items:center;";

                // 左侧点击应用
                const infoDiv = document.createElement('div');
                    const sourceTag = tmpl.source ? `<span style="font-size:0.7em; color:var(--m7-warn); margin-left:5px;">[${tmpl.source}]</span>` : '';
    infoDiv.innerHTML = `
        <div class="m7-card-title">📄 ${tmplName}${sourceTag}</div>
        <div class="m7-card-desc" style="font-size:0.75em">${tmpl.desc}</div>
    `;
   
                infoDiv.onclick = async () => {
                    const confirmed = await showCustomConfirm('📂 读取本地模板', `确定要读取本地模板 <strong>"${tmplName}"</strong> 吗？<br>当前未保存的修改将被覆盖。`);
                    if (confirmed) {
                        currentFullData.play_character_data.基础属性 = JSON.parse(JSON.stringify(tmpl.attr));
                        currentFullData.play_character_data.基础技能 = JSON.parse(JSON.stringify(tmpl.skill));
                         // 读取联动规则
                        currentLinkageRules = tmpl.rules ? JSON.parse(JSON.stringify(tmpl.rules)) : {};
                        // 尝试立即应用逻辑覆盖
                        injectCustomLogic();
                        selectedCategory = null;
                        renderEditorContent();
                        worldHelper.showNovaAlert(`已加载本地模板：${tmplName}`, 'success');
                    }
                };

                // 右侧删除按钮
                const delBtn = document.createElement('button');
                delBtn.className = 'm7-btn m7-btn-sm danger';
                delBtn.innerHTML = '🗑️';
                delBtn.onclick = async (e) => {
                    e.stopPropagation(); // 防止触发读取
                    const confirmed = await showCustomConfirm('删除确认', `确定要从本地删除模板 <strong>"${tmplName}"</strong> 吗？`);
                    if (confirmed) {
                        deleteLocalTemplate(tmplName);
                        renderStoreContent(); // 刷新
                        worldHelper.showNovaAlert(`已删除模板：${tmplName}`, 'info');
                    }
                };

                card.appendChild(infoDiv);
                card.appendChild(delBtn);
                container.appendChild(card);
            });
        }

        // 分隔线
        const hr1 = document.createElement('hr');
        hr1.style.cssText = "border:0; border-top:1px solid var(--m7-border); margin: 20px 0;";
        container.appendChild(hr1);

        // ============================
        // B. 预设库区 (原有逻辑)
        // ============================
        const setHeader = document.createElement('div');
        setHeader.innerHTML = `<div style="color:var(--m7-text-dim); margin-bottom:10px; font-size:0.9em">🌍 系统预设 (点击替换全部)</div>`;
        container.appendChild(setHeader);

        Object.keys(FULL_SETS).forEach(setName => {
            const set = FULL_SETS[setName];
            const card = document.createElement('div');
            card.className = 'm7-card';
            card.innerHTML = `
                <div class="m7-card-title">⚡ ${setName}</div>
                <div class="m7-card-desc">${set.desc}</div>
            `;
            card.onclick = async () => {
                const confirmed = await showCustomConfirm('⚠️ 应用模板确认', `这将完全覆盖当前的【基础属性】和【基础技能】！<br>确定要应用 <strong>"${setName}"</strong> 吗？`);
                if (confirmed) {
                    currentFullData.play_character_data.基础属性 = JSON.parse(JSON.stringify(set.attr));
                    currentFullData.play_character_data.基础技能 = JSON.parse(JSON.stringify(set.skill));
                    selectedCategory = null;
                    renderEditorContent();
                    worldHelper.showNovaAlert(`已应用模板：${setName}`, 'success');
                }
            };
            container.appendChild(card);
        });

        // 分隔线
        const hr2 = document.createElement('hr');
        hr2.style.cssText = "border:0; border-top:1px solid var(--m7-border); margin: 20px 0;";
        container.appendChild(hr2);

        // ============================
        // C. 单项组件区 (原有逻辑)
        // ============================
        const itemHeader = document.createElement('div');
        itemHeader.innerHTML = `<div style="color:var(--m7-text-dim); margin-bottom:10px; font-size:0.9em">🧩 单项组件 (需先选中左侧分类)</div>`;
        container.appendChild(itemHeader);

        INDIVIDUAL_PRESETS.forEach(p => {
            const card = document.createElement('div');
            card.className = 'm7-card';
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between">
                    <span>${p.name}</span>
                    <span class="m7-tag ${p.type === 'attr' ? 'tag-attr' : 'tag-skill'}">${p.type === 'attr' ? '属性' : '技能'}</span>
                </div>
            `;
            card.onclick = () => {
                if (!selectedCategory) {
                    worldHelper.showNovaAlert('请先在左侧点击选择一个分类框！', 'warning');
                    return;
                }
                if (selectedCategory.type !== p.type) {
                    worldHelper.showNovaAlert(`类型不匹配：不能将${p.type==='attr'?'属性':'技能'}放入${selectedCategory.type==='attr'?'属性':'技能'}分类`, 'danger');
                    return;
                }
                selectedCategory.obj[p.name] = JSON.parse(JSON.stringify(p.val));
                renderEditorContent();
                worldHelper.showNovaAlert(`已添加 ${p.name}`, 'success');
            };
            container.appendChild(card);
        });
    }
     // --- 修改：动态生成并注入逻辑 (修复路径解析) ---
    function injectCustomLogic() {
        if (!window.worldHelper) return;

        console.log('[MOD07] 正在注入联动逻辑...', currentLinkageRules);

        const generateCode = () => {
            let code = `
    if (!data || !data.基础属性) return;
    if (!window._m7_rule_cache) window._m7_rule_cache = {};

    const safeGet = (path) => {
        try {
            return path.split('.').reduce((o, k) => o && o[k], data)?.[0] ?? 0;
        } catch(e) { return 0; }
    };
            `;

            Object.keys(currentLinkageRules).forEach(targetPath => {
                let formula = currentLinkageRules[targetPath];
                if (!formula) return;

                // 解析路径：货币.积分 -> parentPath="货币", lastKey="积分"
                const pathParts = targetPath.split('.');
                const lastKey = pathParts.pop();
                const parentPath = pathParts.join('.');

                const isDeltaMode = formula.includes('{this}');

                if (isDeltaMode) {
                    // === 增量模式 ===
                    const parsedFormula = formula
                        .replace(/\{this\}/g, '0')
                        .replace(/\{([^}]+)\}/g, "safeGet('$1')");

                    code += `
    try {
        const currentContrib = ${parsedFormula};
        const lastContrib = window._m7_rule_cache['${targetPath}'] ?? currentContrib;
        const delta = currentContrib - lastContrib;
        window._m7_rule_cache['${targetPath}'] = currentContrib;

        if (delta !== 0) {
            // --- 修复：更安全的父级查找 ---
            const parent = '${parentPath}'.split('.').reduce((o, k) => (o && o[k]) ? o[k] : {}, data);

            if (parent && parent['${lastKey}']) {
                const oldVal = parent['${lastKey}'][0] || 0;

                if ('${lastKey}' === '上限') {
                    parent['上限'][0] = Math.floor(oldVal + delta);
                    // 只有当存在当前值结构时才更新
                    if (parent['当前值'] && Array.isArray(parent['当前值'])) {
                        parent['当前值'][0] = Math.floor((parent['当前值'][0] || 0) + delta);
                    }
                } else {
                    parent['${lastKey}'][0] = Math.floor(oldVal + delta);
                }
            }
        }
    } catch (e) { console.warn('增量联动错误 [${targetPath}]:', e); }
                    `;
                } else {
                    // === 绝对模式 ===
                    const parsedFormula = formula.replace(/\{([^}]+)\}/g, "safeGet('$1')");

                    code += `
    try {
        const val = ${parsedFormula};
        // --- 修复：更安全的父级查找 ---
        const parent = '${parentPath}'.split('.').reduce((o, k) => (o && o[k]) ? o[k] : {}, data);

        if (parent && parent['${lastKey}']) {
            if ('${lastKey}' === '上限') {
                const newVal = Math.floor(val);
                parent['上限'][0] = newVal;
                // 绝对模式下，如果当前值超过上限，则削减
                if (parent['当前值'] && Array.isArray(parent['当前值']) && parent['当前值'][0] > newVal) {
                    parent['当前值'][0] = newVal;
                }
            } else {
                parent['${lastKey}'][0] = Math.floor(val);
            }
        }
    } catch (e) { console.warn('绝对联动错误 [${targetPath}]:', e); }
                    `;
                }
            });

            
            code += `
    try {
        if (data.基础属性) {
            Object.values(data.基础属性).forEach(category => {
                Object.values(category).forEach(attr => {
                    if (attr['基础'] && attr['传奇']) {
                        attr['传奇'][0] = Math.max(0, (attr['基础'][0] || 0) - 8);
                    }
                });
            });
        }
    } catch (e) {}
            `;

            return code;
        };

        try {
            window.worldHelper._updateDerivedAttributes = new Function('data', generateCode());
        } catch (e) {
            console.error("生成代码错误:", e);
            worldHelper.showNovaAlert('联动规则语法错误！', 'danger');
        }
    }
    // 保存数据
    async function saveData() {
        injectCustomLogic(); // 保存时应用逻辑
        try {
            const updatedContent = JSON.stringify(currentFullData, null, 2);

            // 写入世界书
            await setLorebookEntries(LOREBOOK_NAME, [{ uid: 0, content: updatedContent }]);

            worldHelper.showNovaAlert('世界线变动成功！数据已保存。', 'success');
        } catch (e) {
            console.error(e);
            worldHelper.showNovaAlert('保存失败: ' + e.message, 'danger');
        }
    }

    // 启动
    init();
 
  
})();

 