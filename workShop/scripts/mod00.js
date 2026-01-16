(function() {
 TUTORIAL_MODULES = {
    'intro': {
        name: '开局：世界构建',
        steps: [
            {
                title: '欢迎新人。',
                text: '这是一个高自由度的文字冒险游戏。接下来我会引导你进行开局。<br>若取消教程，可随时在设置界面重新查看。',
                delay: 500
            },
            {
                selector: '#page-0',
                title: '选择世界',
                text: '点击左右箭头或卡片本身来切换你想体验的世界背景。',
           onStart: (context) => { // 接收包含 config 的上下文对象
            // 动态插入更新提示步骤
            const updateBtn = document.querySelector('#cancel-update-btn');
            // 增加一个判断，防止重复插入
            const alreadyExists = context.config.some(step => step.title === '更新提示');

            if (updateBtn && !alreadyExists) {
                const newStep = {
                    selector: '#cancel-update-btn',
                    title: '更新提示', // 给一个唯一的标题用于检测
                    text: '这里有一个更新框？我们先不管它，之后可以随时在设置-检查更新中查看。',
                    onEnd: () => {
                        if (updateBtn) updateBtn.click();
                    }
                };
                // 在当前步骤 (索引为1) 之后插入新步骤
                // 使用传递进来的 context.config，而不是非法的 _currentConfig
                context.config.splice(2, 0, newStep);
            }
        }
            },
            {
                selector: '.creator-attitude-group',
                title: '左侧设置',
                text: '鼠标移动到左右两侧（或手机点击箭头），可以展开<b>可选模组</b>设置。',
                onStart: () => {
                    const sidebar = document.querySelector('.creator-attitude-group');
                    if(sidebar) sidebar.classList.add('is-visible');
                },
                onEnd: () => {
                    const sidebar = document.querySelector('.creator-attitude-group');
                    if(sidebar) sidebar.classList.remove('is-visible');
                }
            },
 {
            selector: '.mod-tab[data-name="title-mode"]', // 选中其中一个具体的MOD
            title: '称号系统',
            text: '点击这些标签可以开启或关闭特定功能。例如开启“称号系统”会在正文有可能获得称号。',
            onStart: () => {
                // 再次确保展开，防止动画延迟
                document.querySelector('.creator-attitude-group').classList.add('is-visible');
            }
        },
        {
            selector: '.mod-sidebar.right',
            title: '右侧设置',
            text: '右侧同样隐藏着其他设置，基本都是必须项。',
            onStart: (context) => {
    const updateBtn = document.querySelector('#cancel-update-btn');
            // 增加一个判断，防止重复插入
            const alreadyExists = context.config.some(step => step.title === '更新提示');

            if (updateBtn && !alreadyExists) {
                const newStep = {
                    selector: '#cancel-update-btn',
                    title: '更新提示', // 给一个唯一的标题用于检测
                    text: '这里有一个更新框？我们先不管它，之后可以随时在设置-检查更新中查看。',
                    onEnd: () => {
                        if (updateBtn) updateBtn.click();
                    }
                };
                // 在当前步骤 (索引为1) 之后插入新步骤
                // 使用传递进来的 context.config，而不是非法的 _currentConfig
                context.config.splice(5, 0, newStep);
            }
                // 收起左边，展开右边
                document.querySelector('.creator-attitude-group').classList.remove('is-visible');
                document.querySelector('.mod-sidebar.right').classList.add('is-visible');
            },
            onEnd: () => {
                document.querySelector('.mod-sidebar.right').classList.remove('is-visible');
            }
        }, {
            selector: '.bookmark-button',
            title: '无世界观',
              delay: 900,
            text: '点击这里，可以开启无世界观模式。我们想玩自定义世界的时候再来研究吧。',
                        onStart: (context) => {
     const btn = document.querySelector('.bookmark-button');
    //  const btn2 = document.querySelector('#update-modal');
     
    if (btn) {
       
            btn.click();
      
    }
  
           const updateBtn = document.querySelector('#cancel-update-btn');
            // 增加一个判断，防止重复插入
            const alreadyExists = context.config.some(step => step.title === '更新提示');

            if (updateBtn && !alreadyExists) {
                const newStep = {
                    selector: '#cancel-update-btn',
                    title: '更新提示', // 给一个唯一的标题用于检测
                    text: '这里有一个更新框？我们先不管它，之后可以随时在设置-检查更新中查看。',
                    onEnd: () => {
                        if (updateBtn) updateBtn.click();
                    }
                };
                // 在当前步骤 (索引为1) 之后插入新步骤
                // 使用传递进来的 context.config，而不是非法的 _currentConfig
                context.config.splice(6, 0, newStep);
            }
  
     },
                 onEnd: () => {
     const btn = document.querySelector('#next-btn');
    if (btn) {
       
            btn.click();
      
    }
     }
          
        },
        {
selector:'#restore-btn',
title: '恢复备份按钮',
text: '额外的，当你发现你的聊天记录突然没了（一般是刷新界面的时候酒馆给你吞了啥的）的时候，可以尝试回到开局界面，点击此按钮。',
        },
        {
            selector: '#start-setup-button',
            title: '开始构建',
            text: '配置完成后，点击这里进入第二页，世界信息和角色构建页面。',
            onEnd: () => {
     const btn = document.querySelector('#start-setup-button');
    if (btn) {
       
            btn.click();
      
    }
     }
        },
        {

title: '第二页',
text: '这里进行你的天赋、队友、世界信息配置。<br>什么都不配置的话就是全随机，不过你是新人，就先听我跟你解释一番。'
        },
        {
 selector: '#planet-identity',
title: '身份',
text: '这里可以选择你的身份，这个身份其实就是资历，是新人还是资深者？不同的选择决定你的声望和初始资金。<br>额外的，只有你不是新人，你才可以在接下来的队友那里开启固定队友选项。',
 onEnd: () => {
     const btn = document.querySelector('#planet-identity');
    if (btn) {
        
            btn.click();
       
    }
     }
        },
        {
 selector: '.talent-wrapper.collapsible-content-placeholder',
   delay: 500,
title: '天赋',
text: '这里可以选择你的自带天赋，就是带个挂进游戏。默认随机抽选，你可以选择无或者AI生成。',
 onEnd: () => {
     const btn = document.querySelector('.close-planet-btn');
    if (btn) {
            btn.click();
    }
     }

        },
         {
 selector: '#planet-teammates',
title: '队友',

text: '这里可以设置你的队友。',
 onEnd: () => {
     const btn = document.querySelector('#planet-teammates');
    if (btn) {
        
            btn.click();
       
    }}
        },{
 selector: '.teammate-gear-controls',
    delay: 500,
title: '队友',
text: '左边设置人数，右边设置态度倾向。<br>右边拉到底可以自定义队友，但是这个功能不好用，要自带队友的话，建议去自己写一个人设世界书外挂。',
 onEnd: () => {
     const btn = document.querySelector('.close-planet-btn');
    if (btn) {
            btn.click();
    }
     }
        }, {
 selector: '#planet-task',
title: '世界',

text: '这里可以设置你进去的第一个任务世界的基础信息。',
 onEnd: () => {
     const btn = document.querySelector('#planet-task');
    if (btn) {
            btn.click();
    }}
        },{
 selector: '#clover-leaf-tone',
    delay: 500,
title: '世界基调池',
text: '这是世界基调池，默认随机，下拉框拉到底可以自定义和让AI随机生成，是世界信息的独立组成部分之一。',

        },{
 selector: '#clover-leaf-type',

title: '世界类型池',
text: '这是世界类型池，和世界基调一样默认随机，拉到底可以自定义等。<br>此选项决定了你之后可选的身份和开局。',

        },{
 selector: '#clover-leaf-identity',

title: '世界身份池',
text: '决定你开局后，在任务世界的伪装身份是什么，比如伪装身份是浣熊市的社畜。',

        },{
 selector: '#clover-leaf-opening',

title: '世界开局池',
text: '决定你开局后，面临的情景是什么，比如正在被丧尸追杀。',
 onEnd: () => {
     const btn = document.querySelector('.close-planet-btn');
    if (btn) {
            btn.click();
    }
     }
        }, {
            selector: '#next-page-button',
            title: '下一步',
            text: '配置完成后，点击这里进入第三页，角色属性页面。',
            onEnd: () => {
     const btn = document.querySelector('#next-page-button');
    if (btn) {
            btn.click();
    }
     }
        },{
 selector: '.star.分配项',
 delay: 500,
title: '属性加点',
text: '正中间是数据加点界面，鼠标悬浮(或手机点击)则可以在下方加点。<br>比较需要注意的是，1点耐力会额外给你20血。这个比较重要，其他联动属性之后有空再说。<br>最后，单项属性的开局加点上限是5，防止999数值爆炸。',

        },
        {
 selector: '.galaxy-nav',
title: '属性加点',
text: '左右两侧的按钮可以切换属性页。',
        }, {
 selector: '#template-select-init',
  delay: 500,
title: '属性加点',
text: '当然了，一个一个加点太麻烦了，我们可以点击顶层的hud栏的这里，选择加点模板一键加点。',
       onStart: () => {
     const btn = document.querySelector('.hud-toggle[data-target="top-hud"]');
    if (btn) {
            btn.click();
    }
     }
        }, {
 selector: '#total-points-select',
title: '属性加点',
text: '这里可以选择你的总点数。',
        }, {
 selector: '#arrange-stars-btn',
title: '属性加点',
text: '属性有时候可能会挤在一起，这个时候你可以点击这个，让他们整齐排列。',
      onEnd: () => {
     const btn = document.querySelector('.hud-toggle[data-target="top-hud"]');
    if (btn) {
            btn.click();
    }
     }
        },{
 selector: '#concept-section',
  delay: 500,
title: '开局',
text: '属性设置完成后，就可以点击下面的栏，进行最后的设置了。<br>这里是设置你的美德恶德的地方。这个有啥用呢？<br>当你的正文表现符合美德的时候，你的意志力会回满。符合恶德的时候，意志力会加1。<br>意志力可以用于加骰，骰子机制之后再说。',
       onStart: () => {
     const btn = document.querySelector('.hud-toggle[data-target="bottom-hud"]');
    if (btn) {
            btn.click();
    }
     }
        },{
selector: '#send-mode-select',

title: '开局',
text: '点这里可以选择自动开局还是手动开局。意思就是，是否要立刻将前面所有的设置和开局信息发送给AI。<br>选手动开局的好处是有反悔和编辑的余地。',
 
        },{
selector: '#init-button',
title: '开局',
text: '然后下面的三个按钮分别对应着直接进入任务、还是进入个人空间缓冲、还是自己自由自定义一些其他信息的意思。<br>不同的按钮组装的提示词不同，仅此而已。',
 
        },{

title: '开局引导结束',
text: '那么，开局的引导信息就是这些啦！<br>不过这里还有一些额外的指引，主要是关于设置界面的。<br>我们点击右上角的小齿轮看看吧。',
        onEnd: () => {
     const btn = document.querySelector('#settings-btn-init');
    if (btn) {
            btn.click();
    }
     }
        },{
            selector: '#settings-modal',

title: '设置界面',
text: '可以看到有很多的配置项，不过你只是一个新人，所以我只跟你讲最重要的就行。'
        },{
            selector: '#open-tutorial-selector-btn',

title: '重新查看教程',
text: '想必映入你眼帘的就是这个重看教程按钮，是的，在这里可以重新查看教程。<br>但是为了性能考虑(毕竟现在的代码已经太多了)，你如果想查看进阶的其他界面的教程，得先前往创意工坊界面的公告分类，去开启【更多的教程】脚本。',
 
        },{
            selector: '#settings-modal',

title: '创意工坊-脚本',
text:'这个卡最重要的就是创意工坊，创意工坊内的内容大体分两类，世界书和脚本。先说脚本。<br>要开启一个脚本分两步。', 
    onStart: () => {
     const btn = document.querySelector('.settings-tab[data-page="workshop"]');
    if (btn) {
            btn.click();
    }
     }
        },{
            selector: '#workshop-mod-list',
  delay: 500,
title: '如何开启一个脚本',
text:'1、选择你心仪的脚本，点击脚本右下角的启用。', 
    onStart: () => {
        const targetElement = document.querySelector('#workshop-mod-list');
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
        },{
            selector: '#workshop-reload-runtime-btn',
  delay: 500,
title: '如何开启一个脚本',
text:'2、点击右上角的重载。当然你先别点重载，点了引导程序就看不着了。', 
    onStart: () => {
        const targetElement = document.querySelector('#workshop-reload-runtime-btn');
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
        },{
            selector: '#workshop-mod-list',
  delay: 500,
title: '如何挂载一个世界书',
text:'那么如何挂载世界书呢？就是直接点击下载世界书，导入酒馆，然后外挂在全局或者角色都生效了。', 
    onStart: () => {
        const targetElement = document.querySelector('#workshop-mod-list');
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
        },{
            selector: '#ws-manage-btn',
  delay: 500,
title: '世界书管理',
text:'<br>我们有专门的世界书管理界面，这个只是为了在世界书挂的太多的情况下方便的切换组合的，没有别的用途。<br>就是我指的这个按钮。<br>就先不打开了，属于进阶教程，后续再更。', 
    onStart: () => {
        const targetElement = document.querySelector('#ws-manage-btn');
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
        },{
            selector: '.mod-card',
  delay: 500,
title: '查看详情',
text:'点进去可以查看详情页，有图片显示，也可以在里面订阅作品和作者哦！<br>订阅作品的话，你会收到作品更新的推送。订阅作者的话，你会收到作者新作品的推送。',
    onStart: () => {
        const targetElement = document.querySelector('.mod-card');
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }  
},{
          

title: '推荐的创意工坊模组',
text:'如果你想有更鲜活的Npc：【Npc档案-超复杂npc档案】需配合【美化脚本-npc美化01】使用。优点：npc信息丰富，有离线事件、关键记忆自动浓缩等，同时也能方便的自定义。缺点：npc多了token会爆炸，因此建议配合使用设置界面-游戏设置的自动npc绿灯使用。', 
 
        },{
          

title: '推荐的创意工坊模组',
text:'如果你是无限恐怖爱好者：【无限恐怖-无限恐怖世界观优化】。优点：设定贴合原著。缺点：token有1w。<br><br>如果你是手机端：【美化脚本-隐藏侧边栏和顶部小球】。可以腾出更多的空间。<br><br>如果你希望有更动态鲜活的世界：【其他-世界事件】。优点：世界不再是围着玩家一个人转了。缺点：几乎必须开启异步，不然哈基米脑子不够用。', 
 
        },{
          

title: '其他的基础功能',
text:'还没有结束！还有一些比较重要的配置项希望你能了解。', 
    onEnd: () => {
     const btn = document.querySelector('.settings-tab[data-page="game"]');
    if (btn) {
            btn.click();
    }
     }
        },{
            selector: '#check-for-updates-btn',
title: '其他的基础功能-在线更新',
  delay: 500,
text:'这一页的其他设置都能顾名思义，但是这一行格外重要，需要你注意。这里是检查游戏版本、在线更新的地方，以及如果在线更新不灵，单独强制更新的地方。', 
    onStart: () => {
        const targetElement = document.querySelector('#check-for-updates-btn');
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
        },{
          
  selector: '#settings-page-data',
title: '其他的基础功能-存档设置',
  delay: 500,
text:'这里的存档命名只是方便你分辨不同存档的，没有其他功能。<br>我们这个游戏的主体存档是和酒馆聊天文件变量绑定的，纯文字卡怎么新开档，这张卡就怎么新开档。导入导出存档的本质是修改酒馆聊天文件的变量。', 
    onStart: () => {
     const btn = document.querySelector('.settings-tab[data-page="data"]');
    if (btn) {
            btn.click();
    }
            const targetElement = document.querySelector('#archive-name-input');
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    
     }
        },
      {
            selector: '#snapshot-management-container',
title: '其他的基础功能-摘要设置',
delay: 500,
text:'这里的摘要配置的4个参数是啥意思呢？',
onStart: () => {
        const targetElement = document.querySelector('#snapshot-management-container');
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
        },  {
            selector: '#setting-show-latest',
title: '其他的基础功能-摘要设置',
text:'含义：同层界面上显示的楼层数，数字越小，设备渲染压力越小，最小为1',

        },{
            selector: '#setting-hide-latest',
title: '其他的基础功能-摘要设置',
text:'含义：发送给AI的提示词中，包含多少楼的最新完整正文。默认设置是4，意思就是4楼以上的AI消息就都变成了冰冷的大小总结。',
        },{
            selector: '#setting-small-cycle',
title: '其他的基础功能-摘要设置',
text:'含义：多少个小总结触发大总结。默认是30，意思是你跑了60楼（30层AI消息）就给你浓缩一次全部小总结。',
        },
        {
            selector: '#setting-big-cycle',
title: '其他的基础功能-摘要设置',
text:'含义：多少个大总结触发超级大总结。默认是20，意思是你跑了1200楼（600层AI消息）就给你浓缩一次全部大总结。',
        },
         {
            selector: '#setting-rebuild-btn',
title: '其他的基础功能-整合重构',
text:'好了，现在是最后一个功能，也是最好评如潮的功能，那就是整合重构。<br>数据如果出问题，点整合重构能解决90%的问题。它的原理是整合全部聊天信息的变量更新内容并重新执行。',
        },  {
            selector: '#setting-reprocess-btn',
title: '其他的基础功能-重修本楼',
text:'重新执行一次最近的AI消息的变量指令。',
        },
         {
            
title: '好了！',
text:'我说完了。你可以继续游戏啦。<br>游玩愉快。',
        },
        ]
    },
// 在 TUTORIAL_MODULES 配置文件中，添加或替换 'main_interface' 模块
'main_interface': {
    name: '基础：主体界面',
    steps: [
        {
            title: '欢迎来到主神空间',
            text: '你已成功进入游戏！现在让我为你讲解主界面的各个功能区域。',
           
            onStart: async () => {
                // 检测玩家是否处于开局界面
                const isNewGame = (typeof conversationHistory === 'undefined' || conversationHistory.length === 0);
                
                if (isNewGame) {
                    // 如果是新游戏，推入测试对话
                    conversationHistory.push({
                        role: 'assistant',
                        content: '【系统提示】引导模式已启动。正在进入主神空间...\n你发现自己站在一个巨大的光球下方，四周是无尽的星空。<options>1.你决定四处观察。[力量][敏捷][感知]\n2.你决定睡觉。[心智][神秘学][隐藏]</options>'
                    });
                    
                    // 渲染历史消息
                    if (window.worldHelper && window.worldHelper.renderHistory) {
                        await window.worldHelper.renderHistory(false, true);
                    }
                }
            }
        },
        {
            selector: 'header',
            title: '头部信息栏',
            text: '这是你的<b>系统终端头部</b>。显示当前位置、时间、默认检定属性、敌方状态和难度等重要信息。<br>右上角有<b>全屏</b>、<b>设置</b>和<b>刷新</b>按钮。',
           
        },
        {
            selector: '#chat-display-area',
            title: '对话显示区',
            text: '这是<b>主要内容区域</b>，所有的剧情描述、NPC对话和故事推进都会在这里显示。<br>你可以在这里了解世界的背景、你的处境和发生的事件。<br>电脑端右键，手机长按可以对该楼层进行操作，如编辑、删除、收藏、命名章节等。\nios无法长按唤出菜单，不过可以去阅小球进行编辑。',
           
        },
               {
            selector: '#orb-container',
            title: '功能球系统',
            text: '右侧的<b>功能球</b>是快速访问各个系统的入口。每个球代表不同的功能：<br>• 骰子、商店、地图<br>• 术法、角色、任务<br>熟悉这些球可以让你更快地切换功能。',
           
        },
        {
            selector: '#choicesContainer',
            title: '选项区 - 基础操作',
            text: '这是<b>选项区</b>。AI会根据剧情为你提供不同的行动选择。<br>点击选项即可执行该行动。每个选项下方显示该行动涉及的<b>属性检定</b>（例如[力量][敏捷][感知]）。',
           

        },
        {
            selector: '#choicesContainer',
            title: '选项区 - 高级操作',
            text: '<b>【长按选项】</b>可以将其放入"令"小盒中，作为自定义指令发送。<br><b>【手机端操作】</b>：左滑可隐藏选项区（节省屏幕空间），右滑可让选项区重新显示。',
           
        },
                {
            selector: '#view-command-btn',
            title: '令小盒',
            text: '这是<b>待发指令编辑器</b>。长按选项放入的自定义指令会显示在这里。这里可以是文本，也可以是变量指令。你可以<b>查看、编辑或立刻执行变量指令</b>。<br>这让你能细致地控制每一步的行动描述。',
           
        },
        {
            selector: '#user-input',
            title: '输入框',
            text: '在这里输入你的<b>自定义行动描述</b>。如果选项不满足你的需求，可以写出自己想要做的事情。<br>',
           
        },
        {
            selector: '#send-button',
            title: '发送按钮',
            text: '点击这里发送你的行动。系统会将你的行动和可能加载的"令"小盒中的指令一起提交给AI进行处理。按enter一样可以发送。',
           
        },
        {
            selector: '#rp-button',
            title: '检定系统 - RP 按钮',
            text: '点击它可以<b>自选检定属性</b>。<br>系统会根据你选择的属性进行骰子检定，判定你的行动是否成功。这类似于<b>COC克苏鲁式骰子检定</b>。你最多只能选择两个你的属性',
           
   
        },
        {
            selector: '#rp-button',
            title: '检定系统 - 队友检定',
            text: '如果你拥有<b>固定队友</b>（即你的全局世界书中"小队信息"有NPC成员），点击 RP 按钮时你也可以<b>选择队友的属性进行检定</b>。<br>这让你可以利用队友的能力来完成任务。',
           
        },
        {
            selector: '#rp-button',
            title: '检定系统 - 可选的骰子',
            text: '注意：骰子系统是<b>完全可选的</b>。如果你不喜欢骰子检定机制，可以在<b>设置 → 游戏设置</b>中调整骰子难度为"关骰子"，改为纯叙事模式。',
           
        },
        {
            selector: '#roll-result-orb',
            title: '骰子看板',
            text: '这个<b>骰子球</b>用于显示你最近的检定结果。点击它可以查看详细的骰子投掷记录和成功/失败情况。',
           
        },
        {
            selector: '#skill-choice-orb',
            title: '术法系统',
            text: '点击这个<b>术球</b>可以发动你掌握的特殊能力或术法。这些能力通常需要消耗<b>能量池</b>，或者单纯消耗意志力，但可以提升你的行动成功率或产生特殊效果。',
           
        },
        {
            selector: '#page-character-orb',
            title: '角色面板',
            text: '这个<b>能力球</b>打开你的<b>角色面板</b>。在这里可以查看：<br>• 个人属性和状态<br>• 生命值、意志力、能量值等资源<br>• 装备信息和行囊物品<br>• 掌握的技能和能力',
           
        },
        {
            selector: '#map-view-orb',
            title: '地图系统',
            text: '点击这个<b>地图球</b>可以查看当前区域的<b>地图</b>。了解你所在地点的布局、外部区域和可能的探索路线。',
           
        },
        {
            selector: '#shop-wrapper-orb',
            title: '商店系统',
            text: '这是<b>兑换中心</b>。在这里你可以<b>购买或兑换物品、技能、家具</b>等。使用你获得的货币或资源进行交易，强化你的能力。',
           
        },
        {
            selector: '#page-task-orb',
            title: '任务面板',
            text: '点击这个<b>任务球</b>可以查看当前的<b>任务目标、进度和奖惩</b>。了解你需要完成什么，以及完成或失败会产生什么后果。',
           
        },
        {
            selector: '#world-book-orb',
            title: '识小球',
            text: '这是你的<b>知识库</b>，不过这里更多是作为编辑器而存在。\n\n在这里可以查看和编辑几乎所有主要变量信息，如：<br>• 全局和世界的NPC信息<br>• 你的小队成员详情<br>• 世界设定和背景<br>• 任务记录、背包、技能等个人信息<br>• 根基体系（特殊力量体系）',
           
        },
        {
            selector: '#read-orb-button',
            title: '阅读模式',
            text: '点击这个<b>阅小球</b>进入<b>阅读模式</b>。在此处可以快速回顾之前的剧情。界面内部的右上角三个点也可以快捷进行编辑/删除/收藏等操作哦。',
           
        },

        {
            selector: '#action-menu-btn',
            title: '快速操作菜单',
            text: '点击这个<b>菜单按钮</b>可以快速访问：<br>• 自定义QR指令<br>• 查看论坛（让AI输出标准论坛格式）<br>• 生成随机商品（让AI输出标准商品格式。你也可以在商店处直接生成）<br>• 重roll就是重新生成消息，继续就是酒馆的继续，继续[变量]是让AI只继续生成变量内容',
           
        },

        {
            title: '游戏流程总结',
            text: '游戏流程很简单：<br>1. <b>阅读</b>AI生成的剧情描述<br>2. <b>选择或输入</b>你的行动<br>3. <b>进行检定</b>（可选）代码后台进行判定成功率<br>4. <b>AI查看结果</b>和生成新的剧情发展<br>循环往复，体验你的冒险故事！',
           
        },
        {
            title: '引导结束',
            text: '祝你游玩愉快！如有疑问，可随时重新查看教程。',
           
        }
    ]
}

    // 你可以在这里继续添加 'workshop', 'data' 等模块
};

 

})();