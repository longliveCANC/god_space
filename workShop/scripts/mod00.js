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
                text: '点击左右箭头或卡片本身来切换你想体验的世界背景。'
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
            onStart: () => {
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
            text: '点击这里，可以开启无世界观模式。我们想玩自定义世界的时候再来研究吧。'
          
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

title: '如何开启一个脚本',
text:'1、选择你心仪的脚本，点击脚本右下角的启用。', 
        },{
            selector: '#workshop-reload-runtime-btn',

title: '如何开启一个脚本',
text:'2、点击右上角的重载。当然你先别点重载，点了引导程序就看不着了。', 

        },{
            selector: '#workshop-mod-list',

title: '如何挂载一个世界书',
text:'那么如何挂载世界书呢？就是直接点击下载世界书，导入酒馆，然后外挂在全局或者角色都生效了。', 

        },{
            selector: '#ws-manage-btn',

title: '世界书管理',
text:'<br>我们有专门的世界书管理界面，这个只是为了在世界书挂的太多的情况下方便的切换组合的，没有别的用途。<br>就是我指的这个按钮。<br>就先不打开了，属于进阶教程，后续再更。', 

        },{
            selector: '.mod-card',

title: '查看详情',
text:'点进去可以查看详情页，有图片显示，也可以在里面订阅作品和作者哦！<br>订阅作品的话，你会收到作品更新的推送。订阅作者的话，你会收到作者新作品的推送。',
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
text:'这里的存档命名这是方便你分辨不同存档的，没有其他功能。<br>我们这个游戏的主体存档是和酒馆聊天文件变量绑定的，纯文字卡怎么新开档，这张卡就怎么新开档。导入导出存档的本质是修改酒馆聊天文件的变量。', 
    onStart: () => {
     const btn = document.querySelector('.settings-tab[data-page="data"]');
    if (btn) {
            btn.click();
    }
     }
        },
      {
            selector: '#snapshot-management-container',
title: '其他的基础功能-摘要设置',

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
    }
    // 你可以在这里继续添加 'workshop', 'data' 等模块
};
 

})();