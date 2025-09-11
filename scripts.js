 
  
    'use strict';
    
      const themes = [
    // --- 你最初的赛博朋克系列，它们是基石 ---
    { // 主题一：赛博蓝 (Cyber Blue)
        '--primary-color': '#00faff',
        '--secondary-color': '#7affff',
        '--container-bg-color': 'rgba(10, 25, 47, 0.75)',
        '--border-color': 'rgba(0, 250, 255, 0.3)',
        '--glow-color': 'rgba(0, 250, 255, 0.5)',
        '--background-color': '#0a192f',
        '--text-color': '#e6f1ff', // 明亮的蓝白色，确保在深色背景下清晰
         '--text-secondary-color': '#ffe6e6',
    },
    { // 主题二：警戒红 (Warning Red)
        '--primary-color': '#ff4d4d',
        '--secondary-color': '#ff8c8c',
        '--container-bg-color': 'rgba(47, 10, 10, 0.75)',
        '--border-color': 'rgba(255, 77, 77, 0.4)',
        '--glow-color': 'rgba(255, 77, 77, 0.6)',
        '--background-color': '#2f0a0a',
        '--text-color': '#ffe6e6', // 柔和的红色调白色，与主题呼应
        '--text-secondary-color': '#ffe6e6',
    },
    { // 主题三：矩阵绿 (Matrix Green)
        '--primary-color': '#39ff14',
        '--secondary-color': '#bfffb3',
        '--container-bg-color': 'rgba(10, 47, 15, 0.75)',
        '--border-color': 'rgba(57, 255, 20, 0.4)',
        '--glow-color': 'rgba(57, 255, 20, 0.6)',
        '--background-color': '#0a2f0a',
        '--text-color': '#e6ffe8', // 带有微绿的亮色，经典代码感
         '--text-secondary-color': '#ffe6e6',
    },
    { // 主题四：深空紫 (Deep Space Purple)
        '--primary-color': '#c48cff',
        '--secondary-color': '#e1c6ff',
        '--container-bg-color': 'rgba(25, 10, 47, 0.75)',
        '--border-color': 'rgba(196, 140, 255, 0.4)',
        '--glow-color': 'rgba(196, 140, 255, 0.6)',
        '--background-color': '#190a2f',
        '--text-color': '#f3e6ff', // 浅紫色调的白色，增添神秘感
         '--text-secondary-color': '#ffe6e6',
    },

    
    { // 主题七：战地迷彩 (Military Olive)
        '--primary-color': '#808000',
        '--secondary-color': '#C3B091',
        '--container-bg-color': 'rgba(47, 53, 49, 0.8)',
        '--border-color': 'rgba(128, 128, 0, 0.4)',
        '--glow-color': 'rgba(128, 128, 0, 0.3)',
        '--background-color': '#2E3430',
        '--text-color': '#E5E4E2', // 略带灰度的战术白，冷静实用
         '--text-secondary-color': '#ffe6e6',
    },
      { // 主题五：古籍羊皮纸
         '--text-color': '#6a6253', // 略带灰度的战术白，冷静实用
            '--primary-color': '#7d6b54',          // 主题色，源自“选中书签背景色”
            '--secondary-color': '#a08c72',        // 次要色，源自“书签默认背景色”
            '--text-primary-color': '#6d5b4b',      // 主文字色
            '--text-secondary-color': '#8b7963',   // 次文字色
            '--container-bg-color': '#f3eace',     // 容器背景，源自“书本内容区背景”
            '--border-color': '#c8b89a85',           // 边框色，源自“分割线颜色”
            '--glow-color': '#c8b89a',             // 辉光色，用边框色来强化质感，而非发光
            '--background-color': '#fdfaf2'        // 整体背景色
        },
        { // 主题：经典黑白 (Classic Monochrome)
    '--primary-color': '#ffffff',
    '--secondary-color': '#cccccc',
    '--container-bg-color': 'rgba(40, 40, 40, 0.85)',
    '--border-color': 'rgba(255, 255, 255, 0.3)',
    '--glow-color': 'rgba(255, 255, 255, 0.4)',
    '--background-color': '#1a1a1a',
    '--text-color': '#f5f5f5',
    '--text-secondary-color': '#d0d0d0',
},
{ // 主题：极简灰白 (Minimal Grey)
    '--primary-color': '#e8e8e8',
    '--secondary-color': '#f5f5f5',
    '--container-bg-color': 'rgba(248, 248, 248, 0.9)',
    '--border-color': 'rgba(200, 200, 200, 0.5)',
    '--glow-color': 'rgba(180, 180, 180, 0.3)',
    '--background-color': '#ffffff',
    '--text-color': '#000000',
    '--text-secondary-color': '#333333',
},

{ // 主题：午夜蓝粉 (Midnight Blush)
    '--primary-color': '#ff80bf',
    '--secondary-color': '#ffb3d9',
    '--container-bg-color': 'rgba(25, 30, 45, 0.8)',
    '--border-color': 'rgba(255, 128, 191, 0.4)',
    '--glow-color': 'rgba(255, 128, 191, 0.5)',
    '--background-color': '#0f1419',
    '--text-color': '#e6f0ff',
    '--text-secondary-color': '#ffe6f2',
}
    
 
];
      // 背景图片映射表
const backgroundImageMap = {
    "现代建筑群-BrightDay-Peaceful": "https://files.catbox.moe/ki5j2t.png",
    "现代建筑群-BrightDay-Decay": "https://files.catbox.moe/hc3hyj.png",
    "现代建筑群-BrightDay-Dynamic": "https://files.catbox.moe/wga736.png",
    "现代建筑群-BrightDay-Eerie": "https://files.catbox.moe/tg1uwg.png",
    "现代建筑群-OvercastDay-Peaceful": "https://files.catbox.moe/1gxhka.png",
    "现代建筑群-OvercastDay-Decay": "https://files.catbox.moe/xapaxa.png",
    "现代建筑群-OvercastDay-Dynamic": "https://files.catbox.moe/k36908.png",
    "现代建筑群-OvercastDay-Eerie": "https://files.catbox.moe/ec0q9y.png",
    "现代建筑群-GoldenHour-Peaceful": "https://files.catbox.moe/y3l604.png",
    "现代建筑群-GoldenHour-Decay": "https://files.catbox.moe/ts623u.png",
    "现代建筑群-GoldenHour-Dynamic": "https://files.catbox.moe/3rf2uk.png",
    "现代建筑群-GoldenHour-Eerie": "https://files.catbox.moe/zyg7m1.png",
    "现代建筑群-DeepNight-Peaceful": "https://files.catbox.moe/8m854e.png",
    "现代建筑群-DeepNight-Decay": "https://files.catbox.moe/y2pkfs.png",
    "现代建筑群-DeepNight-Dynamic": "https://files.catbox.moe/uh1vrp.png",
    "现代建筑群-DeepNight-Eerie": "https://files.catbox.moe/h2wugc.png",
    "现代建筑群-ArtificialLight-Peaceful": "https://files.catbox.moe/yuszwp.png",
    "现代建筑群-ArtificialLight-Decay": "https://files.catbox.moe/vuz182.png",
    "现代建筑群-ArtificialLight-Dynamic": "https://files.catbox.moe/s86gut.png",
    "现代建筑群-ArtificialLight-Eerie": "https://files.catbox.moe/p6nowg.png",
   
    "拱门建筑室内-BrightDay-Peaceful": "https://files.catbox.moe/d214yn.png",
    "拱门建筑室内-BrightDay-Decay": "https://files.catbox.moe/kwfnhn.png",
    "拱门建筑室内-BrightDay-Dynamic": "https://files.catbox.moe/uy3kte.png",
    "拱门建筑室内-BrightDay-Eerie": "https://files.catbox.moe/jbmskc.png",
    "拱门建筑室内-OvercastDay-Peaceful": "https://files.catbox.moe/81e8nc.png",
    "拱门建筑室内-OvercastDay-Decay": "https://files.catbox.moe/6entar.png",
    "拱门建筑室内-OvercastDay-Dynamic": "https://files.catbox.moe/h39raz.png",
    "拱门建筑室内-OvercastDay-Eerie": "https://files.catbox.moe/m3xp9i.png",
    "拱门建筑室内-GoldenHour-Peaceful": "https://files.catbox.moe/7ys6wf.png",
    "拱门建筑室内-GoldenHour-Decay": "https://files.catbox.moe/lbcd5b.png",
    "拱门建筑室内-GoldenHour-Dynamic": "https://files.catbox.moe/zeam8z.png",
    "拱门建筑室内-GoldenHour-Eerie": "https://files.catbox.moe/dx685v.png",
    "拱门建筑室内-DeepNight-Peaceful": "https://files.catbox.moe/5g5a7z.png",
    "拱门建筑室内-DeepNight-Decay": "https://files.catbox.moe/lvw1a3.png",
    "拱门建筑室内-DeepNight-Dynamic": "https://files.catbox.moe/al84vh.png",
    "拱门建筑室内-DeepNight-Eerie": "https://files.catbox.moe/inptoq.png",
    "拱门建筑室内-ArtificialLight-Peaceful": "https://files.catbox.moe/v9i1ed.png",
    "拱门建筑室内-ArtificialLight-Decay": "https://files.catbox.moe/7gzrfu.png",
    "拱门建筑室内-ArtificialLight-Dynamic": "https://files.catbox.moe/h3uytp.png",
    "拱门建筑室内-ArtificialLight-Eerie": "https://files.catbox.moe/k2m4e6.png",
    
    "Wasteland-BrightDay-Peaceful": "https://files.catbox.moe/uxe76e.png",
    "Wasteland-BrightDay-Decay": "https://files.catbox.moe/a21n5h.png",
    "Wasteland-BrightDay-Dynamic": "https://files.catbox.moe/7673rq.png",
    "Wasteland-BrightDay-Eerie": "https://files.catbox.moe/et0qkv.png",
    "Wasteland-OvercastDay-Peaceful": "https://files.catbox.moe/hn0y8a.png",
    "Wasteland-OvercastDay-Decay": "https://files.catbox.moe/yixtu9.png",
    "Wasteland-OvercastDay-Dynamic": "https://files.catbox.moe/q5nhyx.png",
    "Wasteland-OvercastDay-Eerie": "https://files.catbox.moe/dwd4ei.png",
    "Wasteland-GoldenHour-Peaceful": "https://files.catbox.moe/pnfws9.png",
    "Wasteland-GoldenHour-Decay": "https://files.catbox.moe/14tzmg.png",
    "Wasteland-GoldenHour-Dynamic": "https://files.catbox.moe/bvaf8y.png",
    "Wasteland-GoldenHour-Eerie": "https://files.catbox.moe/bci8rh.png",
    "Wasteland-DeepNight-Peaceful": "https://files.catbox.moe/x3o7eg.png",
    "Wasteland-DeepNight-Decay": "https://files.catbox.moe/z3vn77.png",
    "Wasteland-DeepNight-Dynamic": "https://files.catbox.moe/9k86lc.png",
    "Wasteland-DeepNight-Eerie": "https://files.catbox.moe/1yoxrp.png",
    "Wasteland-ArtificialLight-Peaceful": "https://files.catbox.moe/abgocm.png",
    "Wasteland-ArtificialLight-Decay": "https://files.catbox.moe/icgzf1.png",
    "Wasteland-ArtificialLight-Dynamic": "https://files.catbox.moe/yjfr62.png",
    "Wasteland-ArtificialLight-Eerie": "https://files.catbox.moe/pv9gqj.png" ,
    "ModernUrbanStreet-BrightDay-Peaceful": "https://files.catbox.moe/dhes3d.png",
    "ModernUrbanStreet-BrightDay-Decay": "https://files.catbox.moe/l21256.png",
    "ModernUrbanStreet-BrightDay-Dynamic": "https://files.catbox.moe/ui2pwt.png",
    "ModernUrbanStreet-OvercastDay-Peaceful": "https://files.catbox.moe/4najy9.png",
    "ModernUrbanStreet-OvercastDay-Decay": "https://files.catbox.moe/6shm0c.png",
    "ModernUrbanStreet-OvercastDay-Dynamic": "https://files.catbox.moe/3mnzmg.png",
    "ModernUrbanStreet-GoldenHour-Peaceful": "https://files.catbox.moe/0x5f9m.png",
    "ModernUrbanStreet-GoldenHour-Decay": "https://files.catbox.moe/097oga.png",
    "ModernUrbanStreet-GoldenHour-Dynamic": "https://files.catbox.moe/8bzix7.png",
    "ModernUrbanStreet-DeepNight-Peaceful": "https://files.catbox.moe/ptg2tf.png",
    "ModernUrbanStreet-DeepNight-Decay": "https://files.catbox.moe/ynurmy.png",
    "ModernUrbanStreet-DeepNight-Dynamic": "https://files.catbox.moe/880e3u.png",
    "AncientTown-BrightDay-Peaceful": "https://files.catbox.moe/s6r8u3.png",
    "AncientTown-BrightDay-Decay": "https://files.catbox.moe/2ku6tb.png",
    "AncientTown-BrightDay-Dynamic": "https://files.catbox.moe/92660n.png",
    "AncientTown-OvercastDay-Peaceful": "https://files.catbox.moe/o98q4p.png",
    "AncientTown-OvercastDay-Decay": "https://files.catbox.moe/ivezlx.png",
    "AncientTown-OvercastDay-Dynamic": "https://files.catbox.moe/fnwsni.png",
    "AncientTown-GoldenHour-Peaceful": "https://files.catbox.moe/v3k1ts.png",
    "AncientTown-GoldenHour-Decay": "https://files.catbox.moe/t4c6h2.png",
    "AncientTown-GoldenHour-Dynamic": "https://files.catbox.moe/z1y37q.png",
    "AncientTown-DeepNight-Peaceful": "https://files.catbox.moe/vhulml.png",
    "AncientTown-DeepNight-Decay": "https://files.catbox.moe/3ju84i.png",
    "AncientTown-DeepNight-Dynamic": "https://files.catbox.moe/48d97o.png",
    "AncientChineseCity-BrightDay-Peaceful": "https://files.catbox.moe/hsbdp9.png",
    "AncientChineseCity-BrightDay-Decay": "https://files.catbox.moe/hi2xji.png",
    "AncientChineseCity-BrightDay-Dynamic": "https://files.catbox.moe/oxzzpk.png",
    "AncientChineseCity-OvercastDay-Peaceful": "https://files.catbox.moe/4o5kdz.png",
    "AncientChineseCity-OvercastDay-Decay": "https://files.catbox.moe/zysw0w.png",
    "AncientChineseCity-OvercastDay-Dynamic": "https://files.catbox.moe/3sxd7f.png",
    "AncientChineseCity-GoldenHour-Peaceful": "https://files.catbox.moe/pvqoks.png",
    "AncientChineseCity-GoldenHour-Decay": "https://files.catbox.moe/mmfx5g.png",
    "AncientChineseCity-GoldenHour-Dynamic": "https://files.catbox.moe/hhqylf.png",
    "AncientChineseCity-DeepNight-Peaceful": "https://files.catbox.moe/k9286v.png",
    "AncientChineseCity-DeepNight-Decay": "https://files.catbox.moe/g77nwq.png",
    "AncientChineseCity-DeepNight-Dynamic": "https://files.catbox.moe/yzsmyn.png",
    "WesternMarket-BrightDay-Peaceful": "https://files.catbox.moe/rksxid.png",
    "WesternMarket-BrightDay-Decay": "https://files.catbox.moe/fi838g.png",
    "WesternMarket-BrightDay-Dynamic": "https://files.catbox.moe/m3pofu.png",
    "WesternMarket-OvercastDay-Peaceful": "https://files.catbox.moe/yhufu8.png",
    "WesternMarket-OvercastDay-Decay": "https://files.catbox.moe/qp7glg.png",
    "WesternMarket-OvercastDay-Dynamic": "https://files.catbox.moe/2i4s8r.png",
    "WesternMarket-GoldenHour-Peaceful": "https://files.catbox.moe/2jj2au.png",
    "WesternMarket-GoldenHour-Decay": "https://files.catbox.moe/7ebpfs.png",
    "WesternMarket-GoldenHour-Dynamic": "https://files.catbox.moe/xa1ctx.png",
    "WesternMarket-DeepNight-Peaceful": "https://files.catbox.moe/hezeaq.png",
    "WesternMarket-DeepNight-Decay": "https://files.catbox.moe/mk5u5q.png",
    "WesternMarket-DeepNight-Dynamic": "https://files.catbox.moe/p0w1l9.png",
    "Campus-BrightDay-Peaceful": "https://files.catbox.moe/1557qc.png",
    "Campus-BrightDay-Decay": "https://files.catbox.moe/tjq73t.png",
    "Campus-BrightDay-Dynamic": "https://files.catbox.moe/hq7yll.png",
    "Campus-OvercastDay-Peaceful": "https://files.catbox.moe/vqcje0.png",
    "Campus-OvercastDay-Decay": "https://files.catbox.moe/jw187j.png",
    "Campus-OvercastDay-Dynamic": "https://files.catbox.moe/ofkg1u.png",
    "Campus-GoldenHour-Peaceful": "https://files.catbox.moe/kkvggn.png",
    "Campus-GoldenHour-Decay": "https://files.catbox.moe/d95fab.png",
    "Campus-GoldenHour-Dynamic": "https://files.catbox.moe/hjf7n0.png",
    "Campus-DeepNight-Peaceful": "https://files.catbox.moe/u940ii.png",
    "Campus-DeepNight-Decay": "https://files.catbox.moe/vh5054.png",
    "Campus-DeepNight-Dynamic": "https://files.catbox.moe/77xjzh.png",
    "Forest-BrightDay-Peaceful": "https://files.catbox.moe/ansqe4.png",
    "Forest-BrightDay-Decay": "https://files.catbox.moe/pr0sh7.png",
    "Forest-BrightDay-Dynamic": "https://files.catbox.moe/2344zd.png",
    "Forest-OvercastDay-Peaceful": "https://files.catbox.moe/met9pb.png",
    "Forest-OvercastDay-Decay": "https://files.catbox.moe/oiwy3e.png",
    "Forest-OvercastDay-Dynamic": "https://files.catbox.moe/klpb15.png",
    "Forest-GoldenHour-Peaceful": "https://files.catbox.moe/jtc5dp.png",
    "Forest-GoldenHour-Decay": "https://files.catbox.moe/1qn3yo.png",
    "Forest-GoldenHour-Dynamic": "https://files.catbox.moe/phlvl2.png",
    "Forest-DeepNight-Peaceful": "https://files.catbox.moe/vnoidl.png",
    "Forest-DeepNight-Decay": "https://files.catbox.moe/kpoe16.png",
    "Forest-DeepNight-Dynamic": "https://files.catbox.moe/f2aoaw.png",
    "Ocean-BrightDay-Peaceful": "https://files.catbox.moe/ecjcwp.png",
    "Ocean-BrightDay-Decay": "https://files.catbox.moe/rf06ih.png",
    "Ocean-BrightDay-Dynamic": "https://files.catbox.moe/1hyi5d.png",
    "Ocean-OvercastDay-Peaceful": "https://files.catbox.moe/yo0x4t.png",
    "Ocean-OvercastDay-Decay": "https://files.catbox.moe/d00l0r.png",
    "Ocean-OvercastDay-Dynamic": "https://files.catbox.moe/48b76h.png",
    "Ocean-GoldenHour-Peaceful": "https://files.catbox.moe/ahhjwy.png",
    "Ocean-GoldenHour-Decay": "https://files.catbox.moe/4chzy8.png",
    "Ocean-GoldenHour-Dynamic": "https://files.catbox.moe/ocg1qb.png",
    "Ocean-DeepNight-Peaceful": "https://files.catbox.moe/i6zev7.png",
    "Ocean-DeepNight-Decay": "https://files.catbox.moe/mu6bj4.png",
    "Ocean-DeepNight-Dynamic": "https://files.catbox.moe/llzgvv.png",
    "River-BrightDay-Peaceful": "https://files.catbox.moe/ssjiix.png",
    "River-BrightDay-Decay": "https://files.catbox.moe/v2nn7e.png",
    "River-BrightDay-Dynamic": "https://files.catbox.moe/o2kc61.png",
    "River-OvercastDay-Peaceful": "https://files.catbox.moe/59uy2q.png",
    "River-OvercastDay-Decay": "https://files.catbox.moe/gehfbt.png",
    "River-OvercastDay-Dynamic": "https://files.catbox.moe/4sdukd.png",
    "River-GoldenHour-Peaceful": "https://files.catbox.moe/nulrac.png",
    "River-GoldenHour-Decay": "https://files.catbox.moe/77pq04.png",
    "River-GoldenHour-Dynamic": "https://files.catbox.moe/tfmns3.png",
    "River-DeepNight-Peaceful": "https://files.catbox.moe/2tg98i.png",
    "River-DeepNight-Decay": "https://files.catbox.moe/93a79i.png",
    "River-DeepNight-Dynamic": "https://files.catbox.moe/k7riuu.png",
    "Grassland-BrightDay-Peaceful": "https://files.catbox.moe/5lrcd3.png",
    "Grassland-BrightDay-Decay": "https://files.catbox.moe/8zg93i.png",
    "Grassland-BrightDay-Dynamic": "https://files.catbox.moe/4uxivd.png",
    "Grassland-OvercastDay-Peaceful": "https://files.catbox.moe/eqajk0.png",
    "Grassland-OvercastDay-Decay": "https://files.catbox.moe/hxc0r4.png",
    "Grassland-OvercastDay-Dynamic": "https://files.catbox.moe/flw0mj.png",
    "Grassland-GoldenHour-Peaceful": "https://files.catbox.moe/2uur0m.png",
    "Grassland-GoldenHour-Decay": "https://files.catbox.moe/x2oaou.png",
    "Grassland-GoldenHour-Dynamic": "https://files.catbox.moe/d55jxr.png",
    "Grassland-DeepNight-Peaceful": "https://files.catbox.moe/1rfcvz.png",
    "Grassland-DeepNight-Decay": "https://files.catbox.moe/finkcj.png",
    "Grassland-DeepNight-Dynamic": "https://files.catbox.moe/jftykn.png",
    "Snowfield-BrightDay-Peaceful": "https://files.catbox.moe/yj6jtu.png",
    "Snowfield-BrightDay-Decay": "https://files.catbox.moe/0zicrz.png",
    "Snowfield-BrightDay-Dynamic": "https://files.catbox.moe/qfx7ec.png",
    "Snowfield-OvercastDay-Peaceful": "https://files.catbox.moe/hrraid.png",
    "Snowfield-OvercastDay-Decay": "https://files.catbox.moe/8ic12s.png",
    "Snowfield-OvercastDay-Dynamic": "https://files.catbox.moe/xsjx03.png",
    "Snowfield-GoldenHour-Peaceful": "https://files.catbox.moe/llck35.png",
    "Snowfield-GoldenHour-Decay": "https://files.catbox.moe/ex4hmf.png",
    "Snowfield-GoldenHour-Dynamic": "https://files.catbox.moe/kqklhc.png",
    "Snowfield-DeepNight-Peaceful": "https://files.catbox.moe/oobgon.png",
    "Snowfield-DeepNight-Decay": "https://files.catbox.moe/24uvx8.png",
    "Snowfield-DeepNight-Dynamic": "https://files.catbox.moe/zxzjpf.png",
    "Underwater-BrightDay-Peaceful": "https://files.catbox.moe/4kefca.png",
    "Underwater-BrightDay-Decay": "https://files.catbox.moe/3denhw.png",
    "Underwater-BrightDay-Dynamic": "https://files.catbox.moe/42rlw6.png",
    "Underwater-OvercastDay-Peaceful": "https://files.catbox.moe/os84rw.png",
    "Underwater-OvercastDay-Decay": "https://files.catbox.moe/hz3b2l.png",
    "Underwater-OvercastDay-Dynamic": "https://files.catbox.moe/1jahli.png",
    "Underwater-GoldenHour-Peaceful": "https://files.catbox.moe/hij6hj.png",
    "Underwater-GoldenHour-Decay": "https://files.catbox.moe/yr7lm1.png",
    "Underwater-GoldenHour-Dynamic": "https://files.catbox.moe/ozq0ph.png",
    "Underwater-DeepNight-Peaceful": "https://files.catbox.moe/3wd6vl.png",
    "Underwater-DeepNight-Decay": "https://files.catbox.moe/wk15wy.png",
    "Underwater-DeepNight-Dynamic": "https://files.catbox.moe/5yvhg2.png",
    "SimpleRoom-BrightDay-Peaceful": "https://files.catbox.moe/n9oby0.png",
    "SimpleRoom-BrightDay-Decay": "https://files.catbox.moe/edqueq.png",
    "SimpleRoom-BrightDay-Dynamic": "https://files.catbox.moe/7wss06.png",
    "SimpleRoom-OvercastDay-Peaceful": "https://files.catbox.moe/m93ysz.png",
    "SimpleRoom-OvercastDay-Decay": "https://files.catbox.moe/5ve0kl.png",
    "SimpleRoom-OvercastDay-Dynamic": "https://files.catbox.moe/nr0u5g.png",
    "SimpleRoom-GoldenHour-Peaceful": "https://files.catbox.moe/rmooph.png",
    "SimpleRoom-GoldenHour-Decay": "https://files.catbox.moe/zcwn3h.png",
    "SimpleRoom-GoldenHour-Dynamic": "https://files.catbox.moe/pp8zfj.png",
    "SimpleRoom-DeepNight-Peaceful": "https://files.catbox.moe/r9na7d.png",
    "SimpleRoom-DeepNight-Decay": "https://files.catbox.moe/mlz6ts.png",
    "SimpleRoom-DeepNight-Dynamic": "https://files.catbox.moe/mxjzuf.png",
    "LuxuryRoom-BrightDay-Peaceful": "https://files.catbox.moe/lindgw.png",
    "LuxuryRoom-BrightDay-Decay": "https://files.catbox.moe/6z5xbx.png",
    "LuxuryRoom-BrightDay-Dynamic": "https://files.catbox.moe/g72q8t.png",
    "LuxuryRoom-OvercastDay-Peaceful": "https://files.catbox.moe/pxy5li.png",
    "LuxuryRoom-OvercastDay-Decay": "https://files.catbox.moe/biwvpj.png",
    "LuxuryRoom-OvercastDay-Dynamic": "https://files.catbox.moe/m4bc3w.png",
    "LuxuryRoom-GoldenHour-Peaceful": "https://files.catbox.moe/nx6rp6.png",
    "LuxuryRoom-GoldenHour-Decay": "https://files.catbox.moe/pmgi83.png",
    "LuxuryRoom-GoldenHour-Dynamic": "https://files.catbox.moe/utlac8.png",
    "LuxuryRoom-DeepNight-Peaceful": "https://files.catbox.moe/6756nu.png",
    "LuxuryRoom-DeepNight-Decay": "https://files.catbox.moe/pq33aw.png",
    "LuxuryRoom-DeepNight-Dynamic": "https://files.catbox.moe/p8vi0m.png",
    "ChineseInn-BrightDay-Peaceful": "https://files.catbox.moe/5zf9he.png",
    "ChineseInn-BrightDay-Decay": "https://files.catbox.moe/z5u256.png",
    "ChineseInn-BrightDay-Dynamic": "https://files.catbox.moe/l2lhmn.png",
    "ChineseInn-OvercastDay-Peaceful": "https://files.catbox.moe/xkm541.png",
    "ChineseInn-OvercastDay-Decay": "https://files.catbox.moe/hyfd0x.png",
    "ChineseInn-OvercastDay-Dynamic": "https://files.catbox.moe/ebj4to.png",
    "ChineseInn-GoldenHour-Peaceful": "https://files.catbox.moe/i7n5l6.png",
    "ChineseInn-GoldenHour-Decay": "https://files.catbox.moe/3z6zby.png",
    "ChineseInn-GoldenHour-Dynamic": "https://files.catbox.moe/hyj5d9.png",
    "ChineseInn-DeepNight-Peaceful": "https://files.catbox.moe/q4bwc8.png",
    "ChineseInn-DeepNight-Decay": "https://files.catbox.moe/h43qfj.png",
    "ChineseInn-DeepNight-Dynamic": "https://files.catbox.moe/oold7t.png",
    "ModernLobby-BrightDay-Peaceful": "https://files.catbox.moe/j2frke.png",
    "ModernLobby-BrightDay-Decay": "https://files.catbox.moe/muayj5.png",
    "ModernLobby-BrightDay-Dynamic": "https://files.catbox.moe/c8e0dt.png",
    "ModernLobby-OvercastDay-Peaceful": "https://files.catbox.moe/kbwrhl.png",
    "ModernLobby-OvercastDay-Decay": "https://files.catbox.moe/p8xm1i.png",
    "ModernLobby-OvercastDay-Dynamic": "https://files.catbox.moe/cuu7tf.png",
    "ModernLobby-GoldenHour-Peaceful": "https://files.catbox.moe/1qiy9k.png",
    "ModernLobby-GoldenHour-Decay": "https://files.catbox.moe/pdkr5k.png",
    "ModernLobby-GoldenHour-Dynamic": "https://files.catbox.moe/w061gf.png",
    "ModernLobby-DeepNight-Peaceful": "https://files.catbox.moe/qy0r7x.png",
    "ModernLobby-DeepNight-Decay": "https://files.catbox.moe/cs5gb1.png",
    "ModernLobby-DeepNight-Dynamic": "https://files.catbox.moe/c425ec.png",
    "Corridor-BrightDay-Peaceful": "https://files.catbox.moe/yejlqf.png",
    "Corridor-BrightDay-Decay": "https://files.catbox.moe/vcl6bl.png",
    "Corridor-BrightDay-Dynamic": "https://files.catbox.moe/64yaat.png",
    "Corridor-OvercastDay-Peaceful": "https://files.catbox.moe/bexgw6.png",
    "Corridor-OvercastDay-Decay": "https://files.catbox.moe/8oyayc.png",
    "Corridor-OvercastDay-Dynamic": "https://files.catbox.moe/wqb6x3.png",
    "Corridor-GoldenHour-Peaceful": "https://files.catbox.moe/kfxo3j.png",
    "Corridor-GoldenHour-Decay": "https://files.catbox.moe/5ukas0.png",
    "Corridor-GoldenHour-Dynamic": "https://files.catbox.moe/sbrnoz.png",
    "Corridor-DeepNight-Peaceful": "https://files.catbox.moe/pt5r7c.png",
    "Corridor-DeepNight-Decay": "https://files.catbox.moe/jmjars.png",
    "Corridor-DeepNight-Dynamic": "https://files.catbox.moe/1vmvdl.png",
    "Laboratory-BrightDay-Peaceful": "https://files.catbox.moe/syyy9p.png",
    "Laboratory-BrightDay-Decay": "https://files.catbox.moe/b5qeap.png",
    "Laboratory-BrightDay-Dynamic": "https://files.catbox.moe/fwsp71.png",
    "Laboratory-OvercastDay-Peaceful": "https://files.catbox.moe/u9zig9.png",
    "Laboratory-OvercastDay-Decay": "https://files.catbox.moe/tl8naa.png",
    "Laboratory-OvercastDay-Dynamic": "https://files.catbox.moe/0p620u.png",
    "Laboratory-GoldenHour-Peaceful": "https://files.catbox.moe/6f9uva.png",
    "Laboratory-GoldenHour-Decay": "https://files.catbox.moe/g2vfxv.png",
    "Laboratory-GoldenHour-Dynamic": "https://files.catbox.moe/xi916x.png",
    "Laboratory-DeepNight-Peaceful": "https://files.catbox.moe/yp56t3.png",
    "Laboratory-DeepNight-Decay": "https://files.catbox.moe/xsvj64.png",
    "Laboratory-DeepNight-Dynamic": "https://files.catbox.moe/ok0vzc.png",
    "Cave-BrightDay-Peaceful": "https://files.catbox.moe/3z7cov.png",
    "Cave-BrightDay-Decay": "https://files.catbox.moe/t3obng.png",
    "Cave-BrightDay-Dynamic": "https://files.catbox.moe/xx3fkt.png",
    "Cave-OvercastDay-Peaceful": "https://files.catbox.moe/4velhl.png",
    "Cave-OvercastDay-Decay": "https://files.catbox.moe/nkd9vx.png",
    "Cave-OvercastDay-Dynamic": "https://files.catbox.moe/jtit19.png",
    "Cave-GoldenHour-Peaceful": "https://files.catbox.moe/3rl1ek.png",
    "Cave-GoldenHour-Decay": "https://files.catbox.moe/wkfb9x.png",
    "Cave-GoldenHour-Dynamic": "https://files.catbox.moe/84jmvc.png",
    "Cave-DeepNight-Peaceful": "https://files.catbox.moe/w9vhnp.png",
    "Cave-DeepNight-Decay": "https://files.catbox.moe/gfos4o.png",
    "Cave-DeepNight-Dynamic": "https://files.catbox.moe/to0jrc.png",
    "Prison-BrightDay-Peaceful": "https://files.catbox.moe/p4cnax.png",
    "Prison-BrightDay-Decay": "https://files.catbox.moe/ai4xsu.png",
    "Prison-BrightDay-Dynamic": "https://files.catbox.moe/47e6lg.png",
    "Prison-OvercastDay-Peaceful": "https://files.catbox.moe/xpwl6w.png",
    "Prison-OvercastDay-Decay": "https://files.catbox.moe/s56auc.png",
    "Prison-OvercastDay-Dynamic": "https://files.catbox.moe/mw4ywv.png",
    "Prison-GoldenHour-Peaceful": "https://files.catbox.moe/xqdgqb.png",
    "Prison-GoldenHour-Decay": "https://files.catbox.moe/fghnbn.png",
    "Prison-GoldenHour-Dynamic": "https://files.catbox.moe/zqdhod.png",
    "Prison-DeepNight-Peaceful": "https://files.catbox.moe/7t0v0g.png",
    "Prison-DeepNight-Decay": "https://files.catbox.moe/adx0nw.png",
    "Prison-DeepNight-Dynamic": "https://files.catbox.moe/q0scdg.png",
    "StarshipInterior-BrightDay-Peaceful": "https://files.catbox.moe/kqfaul.png",
    "StarshipInterior-BrightDay-Decay": "https://files.catbox.moe/6xdq9e.png",
    "StarshipInterior-BrightDay-Dynamic": "https://files.catbox.moe/8ps4gt.png",
    "StarshipInterior-OvercastDay-Peaceful": "https://files.catbox.moe/ehan0u.png",
    "StarshipInterior-OvercastDay-Decay": "https://files.catbox.moe/ehan0u.png",
    "StarshipInterior-OvercastDay-Dynamic": "https://files.catbox.moe/7z196y.png",
    "StarshipInterior-GoldenHour-Peaceful": "https://files.catbox.moe/jshhas.png",
    "StarshipInterior-GoldenHour-Decay": "https://files.catbox.moe/na2wqk.png",
    "StarshipInterior-GoldenHour-Dynamic": "https://files.catbox.moe/eta7l8.png",
    "StarshipInterior-DeepNight-Peaceful": "https://files.catbox.moe/dw9syo.png",
    "StarshipInterior-DeepNight-Decay": "https://files.catbox.moe/xvdvq8.png",
    "StarshipInterior-DeepNight-Dynamic": "https://files.catbox.moe/39pgit.png",
    "FloatingIsland-BrightDay-Peaceful": "https://files.catbox.moe/ulixx0.png",
    "FloatingIsland-BrightDay-Decay": "https://files.catbox.moe/1sgrgy.png",
    "FloatingIsland-BrightDay-Dynamic": "https://files.catbox.moe/fd84hz.png",
    "FloatingIsland-OvercastDay-Peaceful": "https://files.catbox.moe/e56g2x.png",
    "FloatingIsland-OvercastDay-Decay": "https://files.catbox.moe/2upnvn.png",
    "FloatingIsland-OvercastDay-Dynamic": "https://files.catbox.moe/ip68d4.png",
    "FloatingIsland-GoldenHour-Peaceful": "https://files.catbox.moe/otf9x9.png",
    "FloatingIsland-GoldenHour-Decay": "https://files.catbox.moe/gv6yf4.png",
    "FloatingIsland-GoldenHour-Dynamic": "https://files.catbox.moe/mi9bk4.png",
    "FloatingIsland-DeepNight-Peaceful": "https://files.catbox.moe/chhmjd.png",
    "FloatingIsland-DeepNight-Decay": "https://files.catbox.moe/r4edwi.png",
    "FloatingIsland-DeepNight-Dynamic": "https://files.catbox.moe/gpaq2z.png",
    "Hell-BrightDay-Peaceful": "https://files.catbox.moe/ogqqer.png",
    "Hell-BrightDay-Decay": "https://files.catbox.moe/1v6cji.png",
    "Hell-BrightDay-Dynamic": "https://files.catbox.moe/6u1es7.png",
    "Hell-OvercastDay-Peaceful": "https://files.catbox.moe/uhng4y.png",
    "Hell-OvercastDay-Decay": "https://files.catbox.moe/hwxxng.png",
    "Hell-OvercastDay-Dynamic": "https://files.catbox.moe/afbx4m.png",
    "Hell-GoldenHour-Peaceful": "https://files.catbox.moe/lsn7zw.png",
    "Hell-GoldenHour-Decay": "https://files.catbox.moe/zqj42n.png",
    "Hell-GoldenHour-Dynamic": "https://files.catbox.moe/hivy9l.png",
    "Hell-DeepNight-Peaceful": "https://files.catbox.moe/f2yeyp.png",
    "Hell-DeepNight-Decay": "https://files.catbox.moe/5ijb9v.png",
    "Hell-DeepNight-Dynamic": "https://files.catbox.moe/2x2es7.png",
    "RadiationWasteland-BrightDay-Peaceful": "https://files.catbox.moe/m7yy78.png",
    "RadiationWasteland-BrightDay-Decay": "https://files.catbox.moe/a1kdmh.png",
    "RadiationWasteland-BrightDay-Dynamic": "https://files.catbox.moe/gg9yd1.png",
    "RadiationWasteland-OvercastDay-Peaceful": "https://files.catbox.moe/li7380.png",
    "RadiationWasteland-OvercastDay-Decay": "https://files.catbox.moe/f6q6fo.png",
    "RadiationWasteland-OvercastDay-Dynamic": "https://files.catbox.moe/euzsy9.png",
    "RadiationWasteland-GoldenHour-Peaceful": "https://files.catbox.moe/jxeqws.png",
    "RadiationWasteland-GoldenHour-Decay": "https://files.catbox.moe/3po9ni.png",
    "RadiationWasteland-GoldenHour-Dynamic": "https://files.catbox.moe/dewdhu.png",
    "RadiationWasteland-DeepNight-Peaceful": "https://files.catbox.moe/lo3484.png",
    "RadiationWasteland-DeepNight-Decay": "https://files.catbox.moe/zdltgi.png",
    "RadiationWasteland-DeepNight-Dynamic": "https://files.catbox.moe/lwb5ac.png",
    "OuterSpace-BrightDay-Peaceful": "https://files.catbox.moe/ea4e3t.png",
    "OuterSpace-BrightDay-Decay": "https://files.catbox.moe/7tb1i8.png",
    "OuterSpace-BrightDay-Dynamic": "https://files.catbox.moe/fw2904.png",
    "OuterSpace-OvercastDay-Peaceful": "https://files.catbox.moe/e2yisi.png",
    "OuterSpace-OvercastDay-Decay": "https://files.catbox.moe/twsfjf.png",
    "OuterSpace-OvercastDay-Dynamic": "https://files.catbox.moe/cd4ry1.png",
    "OuterSpace-GoldenHour-Peaceful": "https://files.catbox.moe/nqxnud.png",
    "OuterSpace-GoldenHour-Decay": "https://files.catbox.moe/45z8kf.png",
    "OuterSpace-GoldenHour-Dynamic": "https://files.catbox.moe/pciljv.png",
    "OuterSpace-DeepNight-Peaceful": "https://files.catbox.moe/ln80cz.png",
    "OuterSpace-DeepNight-Decay": "https://files.catbox.moe/faa1rk.png",
    "OuterSpace-DeepNight-Dynamic": "https://files.catbox.moe/tmy5ol.png",
    "Cyberpunk-BrightDay-Peaceful": "https://files.catbox.moe/aj5h69.png",
    "Cyberpunk-BrightDay-Decay": "https://files.catbox.moe/j21gl2.png",
    "Cyberpunk-BrightDay-Dynamic": "https://files.catbox.moe/1ksill.png",
    "Cyberpunk-OvercastDay-Peaceful": "https://files.catbox.moe/bkbuik.png",
    "Cyberpunk-OvercastDay-Decay": "https://files.catbox.moe/3cfkqu.png",
    "Cyberpunk-OvercastDay-Dynamic": "https://files.catbox.moe/q0uibt.png",
    "Cyberpunk-GoldenHour-Peaceful": "https://files.catbox.moe/j8jz3x.png",
    "Cyberpunk-GoldenHour-Decay": "https://files.catbox.moe/f5uhnm.png",
    "Cyberpunk-GoldenHour-Dynamic": "https://files.catbox.moe/d24ede.png",
    "Cyberpunk-DeepNight-Peaceful": "https://files.catbox.moe/xe1h6e.png",
    "Cyberpunk-DeepNight-Decay": "https://files.catbox.moe/ed2g3n.png",
    "Cyberpunk-DeepNight-Dynamic": "https://files.catbox.moe/ed2g3n.png",
 
 
};

let achievementQueue = [];
let isShowingAchievement = false;
 let achievementData = JSON.parse(localStorage.getItem('achievements_data'));

function checkAchievements(eventType, value) {
     initialAchievementData  = {
     achievements: {
    newbie_explorer: {
      title: "【新人？】",
      description: "首次进入这个世界，一切都是新的开始。",
      icon: "🌱",
      unlocked: false, unlocked_at: null, reward_claimed: false,
      reward: "称号「新人」",
      flavor_text: "欢迎光临，愿你的故事如繁星般璀璨。"
    },
    points_master: {
      title: "【挥金如土】",
      description: "在数据构建时，初始点数超过200点。",
      icon: "👑",
      unlocked: false, unlocked_at: null, reward_claimed: false,
      reward: "称号「败家子」",
      flavor_text: "贫穷限制了我的想象力，但没限制我的花费。"
    },
    points_ascetic: {
  title: "【地狱行者】",
  description: "在数据构建时，初始点数花费为0点。",
  icon: "👍",
  unlocked: false, unlocked_at: null, reward_claimed: false,
  reward: "称号「苦行僧」",
  flavor_text: "真正的强者，从不依赖于花里胡哨的开局。"
},
    careful_planner: {
      title: "【精打细算】",
      description: "在数据构建时，完美用完所有初始点数（剩余点数为0）。",
      icon: "⚖️",
      unlocked: false, unlocked_at: null, reward_claimed: false,
      reward: "称号「理财达人」",
      flavor_text: "每一分都用在刀刃上，这就是规划的艺术。"
    },

    // ========== 生死与状态 ==========
    first_death: {
      title: "【第一次亲密接触】",
      description: "生命值第一次归零。别怕，这只是一个逗号，不是句号。",
      icon: "💀",
      unlocked: false, unlocked_at: null, reward_claimed: false,
      reward: "称号「不死鸟之雏」",
      flavor_text: "“我还以为我死了呢！” —— 很多人都这么说。"
    },
    near_death_experience: {
        title: "【生死一线】",
        description: "在生命值仅剩1点的情况下存活。",
        icon: "🩸",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「幸存者」",
        flavor_text: "死神敲了敲门，而你假装不在家。"
    },
    glass_cannon: {
        title: "【脆皮专家】",
        description: "你的生命值上限低于20点。",
        icon: "💔",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「碰一下就碎」",
        flavor_text: "最好的防御就是……在被摸到之前干掉所有人。"
    },
    human_tank: {
        title: "【血牛】",
        description: "你的生命值上限超过200点。",
        icon: "🛡️",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「移动城墙」",
        flavor_text: "医生：“他是什么血型？” 护士：“……很多。”"
    },

    // ========== 属性与技能成长 ==========
    legendary_physique: {
        title: "【传奇之躯】",
        description: "任一基础生理属性（力量、敏捷、耐力）达到8点。",
        icon: "💪",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「人形凶兽」",
        flavor_text: "你已经超越了凡人的极限，现在，规则由你来书写。"
    },
    legendary_mind: {
        title: "【传奇心智】",
        description: "任一基础心智属性（智力、感知、决心）达到8点。",
        icon: "🧠",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「思想的巨人」",
        flavor_text: "世界在你眼中不过是一盘尚未结束的棋局。"
    },
    legendary_presence: {
        title: "【传奇风采】",
        description: "任一基础互动属性（风度、操控、沉着）达到8点。",
        icon: "🎭",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「行走的魅力/灾厄」",
        flavor_text: "言语是你的武器，世界是你的舞台。"
    },
    master_of_one: {
        title: "【一技之长】",
        description: "任一技能等级达到8点。",
        icon: "🌟",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「领域的宗师」",
        flavor_text: "将一件事做到极致，你便是传奇。"
    },
    jack_of_all_trades: {
        title: "【万事通】",
        description: "总共有超过20个技能等级不为0。",
        icon: "📚",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「行走的百科全书」",
        flavor_text: "“你还懂这个？” “略懂，略懂。”"
    },
    specialist: {
        title: "【偏科生】",
        description: "单一技能段（生理/心智/互动）的总技能点数超过其他两项之和。",
        icon: "📈",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「术业有专攻」",
        flavor_text: "我可能不是样样都行，但在我的领域里，无人能及。"
    },

    // ========== 任务与声望 ==========
    first_mission: {
        title: "【迈出第一步】",
        description: "完成你的第一个任务。",
        icon: "🏁",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「任务新人」",
        flavor_text: "伟大的旅程始于足下。"
    },
    ten_missions: {
        title: "【任务老手】",
        description: "累计完成10个任务。",
        icon: "🔟",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「身经百战」",
        flavor_text: "你已经对‘失败抹杀’感到麻木了。"
    },
    hundred_missions: {
        title: "【任务机器】",
        description: "累计完成100个任务。",
        icon: "💯",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「轮回中的传说」",
        flavor_text: "你的事迹在无数世界中流传，尽管主角名字总被记错。"
    },
    world_savior: {
        title: "【世界之友】",
        description: "跨世界声望达到10点。",
        icon: "🌍",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「位面行者」",
        flavor_text: "你的善意跨越了世界的壁垒，收获了星辰的回响。"
    },
    world_enemy: {
        title: "【世界公敌】",
        description: "跨世界声望跌至-10点。",
        icon: "💥",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「灾厄之星」",
        flavor_text: "欢迎来到每个世界的通缉名单榜首。"
    },

    // ========== 财富与收集 ==========
    first_home: {
        title: "【我的第一个家】",
        description: "在个人空间中放置第一件家具。",
        icon: "🏠",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「筑巢者」",
        flavor_text: "无论在哪，有个能回去的地方总是好的。"
    },
    cozy_home: {
        title: "【温馨小屋】",
        description: "个人空间的家具数量达到10件。",
        icon: "🛋️",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「室内设计师」",
        flavor_text: "这里开始有点家的样子了。"
    },
    luxury_manor: {
        title: "【豪华庄园】",
        description: "个人空间的家具数量达到50件。",
        icon: "🏰",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「空间管理大师」",
        flavor_text: "你的个人空间现在比某些小世界还热闹。"
    },
    rich_man: {
        title: "【小有资产】",
        description: "当前拥有的积分超过10000。",
        icon: "💰",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「万元户」",
        flavor_text: "你可以自信地走进商店，然后问：“除了这个，还有别的吗？”"
    },
    super_rich: {
        title: "【富可敌国】",
        description: "当前拥有的积分超过100000。",
        icon: "🤑",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「行走的金库」",
        flavor_text: "主神看了你的余额都得问一句：‘哥，最近有啥项目一起做？’"
    },
    s_rank_hoarder: {
        title: "【S级的荣耀】",
        description: "拥有一个S级支线剧情。",
        icon: "S",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「剧情收藏家」",
        flavor_text: "这是改变世界走向的关键碎片。"
    },

    // ========== 危机与挑战 ==========
    trivial_threat: {
        title: "【小试牛刀】",
        description: "第一次遭遇检定难度大于3的危机。",
        icon: "⁉️",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「麻烦磁铁」",
        flavor_text: "你感觉到了，事情开始变得‘有趣’起来了。"
    },
    serious_challenge: {
        title: "【严峻挑战】",
        description: "第一次遭遇检定难度大于7的超凡危机。",
        icon: "‼️",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「危机处理专家」",
        flavor_text: "凡人的挣扎已成过往，现在是超凡者的舞台。"
    },
    gods_game: {
        title: "【神明棋局】",
        description: "第一次遭遇检定难度大于12的神明规则级危机。",
        icon: "🌌",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「神之博弈者」",
        flavor_text: "你抬头仰望，发现自己已成为棋盘上的一员。"
    },
    cosmic_horror: {
        title: "【直面本源】",
        description: "第一次遭遇检定难度大于15的本源宇宙级危机。",
        icon: "🌀",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「深渊凝望者」",
        flavor_text: "当你凝视深渊时，深渊也在……给你点了个赞？"
    },

    // ========== 能量与能力 ==========
    energy_awakening: {
        title: "【能量觉醒】",
        description: "能量池上限首次大于0。",
        icon: "💡",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「超凡新星」",
        flavor_text: "你感受到了体内那股陌生的力量，它在欢呼，在雀跃。"
    },
    energy_pool_100: {
        title: "【能量洪流】",
        description: "能量池上限达到100。",
        icon: "🌊",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「人形自走充电宝」",
        flavor_text: "你现在可以连续释放十个小火球……来烤面包。"
    },
    energy_pool_1000: {
        title: "【能量奇点】",
        description: "能量池上限达到1000。",
        icon: "💥",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「行走的魔力源」",
        flavor_text: "或许，你可以考虑给一个城市供电了。"
    },
    first_ability: {
        title: "【新的权能】",
        description: "获得第一个能力。",
        icon: "🧩",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「能力者」",
        flavor_text: "一张新的底牌，一个崭新的可能。"
    },

    // ========== 美德与恶德 ==========
    act_of_justice: {
        title: "【正义的伙伴】",
        description: "首次因符合【正义】美德而获得嘉奖。",
        icon: "⚖️",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「正义的伙伴」",
        flavor_text: "虽千万人，吾往矣。"
    },
    unleash_anger: {
        title: "【怒火燎原】",
        description: "首次因符合【愤怒】恶德而获得力量。",
        icon: "😠",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「狂怒者」",
        flavor_text: "够了！我已经忍无可忍了！"
    },
    // ========== 美德与恶德 (新增) ==========
act_of_kindness: {
    title: "【温柔的守护者】",
    description: "首次因符合【慈爱】美德而获得嘉奖。",
    icon: "💖",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「暖阳」",
    flavor_text: "你的善意，是这个冰冷世界里最珍贵的温度。"
},
find_your_faith: {
    title: "【混沌中的灯塔】",
    description: "首次因符合【信念】美德而获得嘉奖。",
    icon: "🕯️",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「持炬人」",
    flavor_text: "当所有人都迷失时，你找到了自己的道路，并成为了他人的光。"
},
iron_will: {
    title: "【不屈的磐石】",
    description: "首次因符合【刚毅】美德而获得嘉奖。",
    icon: "💎",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「不动如山」",
    flavor_text: "诱惑与磨难如同浪潮，但你，是无法被撼动的礁石。"
},
spark_of_hope: {
    title: "【希望的火种】",
    description: "首次因符合【希望】美德而获得嘉奖。",
    icon: "✨",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「晨星」",
    flavor_text: "在最深的黑夜里，你点燃了那颗足以照亮黎明地平线的星。"
},
prudent_choice: {
    title: "【智慧的远见】",
    description: "首次因符合【稳重】美德而获得嘉奖。",
    icon: "🧐",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「棋手」",
    flavor_text: "捷径通向悬崖，而你的每一步都踏在坚实的土地上。"
},
self_control: {
    title: "【内心的修行】",
    description: "首次因符合【节制】美德而获得嘉奖。",
    icon: "🧘",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「苦行僧」",
    flavor_text: "真正的强大，是驾驭自己的欲望，而非被其奴役。"
},
poisonous_envy: {
    title: "【扭曲的渴求】",
    description: "首次因符合【妒忌】恶德而获得力量。",
    icon: "🐍",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「毒苹果」",
    flavor_text: "既然我得不到，那便毁掉它。"
},
reckless_indulgence: {
    title: "【欲望的奴隶】",
    description: "首次因符合【放纵】恶德而获得力量。",
    icon: "🍷",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「无底洞」",
    flavor_text: "今朝有酒今朝醉，明日的洪水滔天与我何干？"
},
insatiable_greed: {
    title: "【贪婪的深渊】",
    description: "首次因符合【贪婪】恶德而获得力量。",
    icon: "🪙",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「黄金热病患者」",
    flavor_text: "更多，我还要更多！整个世界都该是我的！"
},
unrestrained_lust: {
    title: "【情欲的风暴】",
    description: "首次因符合【纵欲】恶德而获得力量。",
    icon: "🔥",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「掠食者」",
    flavor_text: "规则和感受？那只是弱者用来束缚强者的借口。"
},
fatal_pride: {
    title: "【致命的骄傲】",
    description: "首次因符合【骄傲】恶德而获得力量。",
    icon: "🦚",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「高塔上的傻瓜」",
    flavor_text: "我，即是真理。所有不认同的，都将被碾碎。"
},
sweet_sloth: {
    title: "【慵懒的胜利】",
    description: "首次因符合【懒惰】恶德而获得力量。",
    icon: "😴",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「天选摸鱼人」",
    flavor_text: "我什么都没做，事情就自己解决了。果然，努力是没有意义的。"
},

    // ========== 装备与物品 ==========
    first_weapon: {
        title: "【武装起来】",
        description: "首次在手持栏装备武器或工具。",
        icon: "⚔️",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「备战者」",
        flavor_text: "无论它是一根木棍还是一把圣剑，它都是你意志的延伸。"
    },
    fully_equipped: {
        title: "【全副武装】",
        description: "头部、身体、手部、脚部四个穿戴部位均装备了物品。",
        icon: "🥋",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「武装到牙齿」",
        flavor_text: "你看起来已经准备好去参加任何一场派对，或者战争。"
    },

    // ========== 杂项与彩蛋 ==========
    fashion_guru: {
        title: "【时尚达人】",
        description: "当前穿戴的装备（所有部位合计）总数达到10件。",
        icon: "👕",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「千面之人」",
        flavor_text: "强度是一时的，帅是一辈子的。"
    },
    collector: {
        title: "【收藏家】",
        description: "背包中的物品种类达到50种。",
        icon: "📦",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「次元仓鼠」",
        flavor_text: "“这个也许以后用得上。”"
    },
    animal_friend: {
        title: "【动物之友】",
        description: "动物沟通技能达到5点。",
        icon: "🐾",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「迪士尼在逃公主/王子」",
        flavor_text: "小鸟会为你唱歌，松鼠会帮你梳头。"
    },
    master_chef: {
        title: "【中华小当家】",
        description: "手艺技能达到5点。",
        icon: "🍳",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「料理之神」",
        flavor_text: "你的锅里会发光吗？"
    },
    hacker: {
        title: "【骇客】",
        description: "电脑技能达到5点。",
        icon: "💻",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「数据幽灵」",
        flavor_text: "“我进来了。”"
    },

 
    medic: {
        title: "【战地庸医】",
        description: "医学技能达到5点。",
        icon: "🩺",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「白衣天使/恶魔」",
        flavor_text: "“别担心，我可是专业的...至少书上是这么写的。”"
    },
    liar_liar: {
        title: "【谎言大师】",
        description: "掩饰技能达到5点。",
        icon: "🤥",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「千谎百计」",
        flavor_text: "真实是什么？真实就是他们愿意相信的东西。"
    },
    get_a_car: {
        title: "【有车一族】",
        description: "驾驶技能达到5点。",
        icon: "🚗",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「老司机」",
        flavor_text: "“乘客您好，请系好安全带，下一站，地狱或天堂。”"
    },
    team_player: {
        title: "【团队合作】",
        description: "小队中拥有至少一名队友。",
        icon: "🤝",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「可靠的伙伴」",
        flavor_text: "一个人的旅途是冒险，两个人的旅途是故事。"
    },
    lone_wolf: {
        title: "【孤狼】",
        description: "在完成10个任务后，小队中依然只有自己一人。",
        icon: "🐺",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「独行侠」",
        flavor_text: "我的背后，只有我的影子。"
    },
    occultist: {
        title: "【神秘学家】",
        description: "神秘学技能达到5点。",
        icon: "🔮",
        unlocked: false, unlocked_at: null, reward_claimed: false,
        reward: "称号「禁忌知识探求者」",
        flavor_text: "当你了解得越多，就越发现自己的无知...和危险。"
    },
    // ========== 投骰检定 (新增) ==========
critical_success_roll: {
    title: "【天命所归】",
    description: "在任意D10骰池检定中，单颗骰子投出10并且触发了奖励骰。",
    icon: "🎲",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「幸运星」",
    flavor_text: "那一刻，命运对你露出了微笑。"
},
dramatic_failure_roll: {
    title: "【戏剧性大失败】",
    description: "在任意检定中触发‘大失败’（投出1且没有任何成功数）。",
    icon: "🤡",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「节目效果大师」",
    flavor_text: "“我不是故意的，但效果拔群。”"
},
snake_eyes: {
    title: "【蛇眼】",
    description: "在D10骰池检定中，投出至少两个1。",
    icon: "🐍",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「双重不幸」",
    flavor_text: "有时候，坏运气也会成双成对地来敲门。"
},
full_house_success: {
    title: "【满堂彩】",
    description: "在D10骰池检定中，所有骰子的结果都大于等于7（全部成功）。",
    icon: "🌟",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「完美执行者」",
    flavor_text: "没有一丝多余的动作，每一步都精准无误。"
},
chance_win: {
    title: "【奇迹一掷】",
    description: "在机会骰（0骰池）检定中成功（投出10）。",
    icon: "🙏",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「天选之人」",
    flavor_text: "当所有人都放弃时，你抓住了那百分之十的可能。"
},
ten_dice_pool: {
    title: "【骰子洪流】",
    description: "进行一次总骰池超过10个D10的检定。",
    icon: "🌊",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「概率的支配者」",
    flavor_text: "你扔出去的不是骰子，是命运的洪流。"
},
twenty_dice_pool: {
    title: "【骰子风暴】",
    description: "进行一次总骰池超过20个D10的检定。",
    icon: "🌪️",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「因果律武器」",
    flavor_text: "在绝对的数量面前，一切随机性都趋于必然。"
},
performance_perfect: {
    title: "【舞台之王】",
    description: "在表现判定中，D20投出20，达成‘完美表现’。",
    icon: "👑",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「聚光灯下的宠儿」",
    flavor_text: "世界为你的表演而静默，然后爆发出雷鸣般的掌声。"
},
performance_fail: {
    title: "【笨拙的巨人】",
    description: "在表现判定中，D20投出1，达成‘表现糟糕’。",
    icon: "🐘",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「平地摔跤冠军」",
    flavor_text: "“我发誓，那块地砖先动的手！”"
},
success_by_one: {
    title: "【毫厘之差】",
    description: "最终成功数恰好等于‘完全成功’。",
    icon: "🤏",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「精准卡线大师」",
    flavor_text: "多一分浪费，少一分失败，这，就是恰到好处的艺术。"
},
legendary_save: {
    title: "【传奇之助】",
    description: "一次检定中，因传奇加成而使0成功数变为正成功数。",
    icon: "🛡️",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「被传奇所眷顾」",
    flavor_text: "在失败的边缘，你的传奇之力将你拉了回来。"
},
equipment_mvp: {
    title: "【神兵利器】",
    description: "一次检定中，装备提供的加成超过了属性/技能本身的点数。",
    icon: "🛠️",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「人靠衣装」",
    flavor_text: "技术不够，装备来凑。事实证明，它真的很凑效。"
},
teamwork_victory: {
    title: "【众志成城】",
    description: "在一次检定中，来自队友的协助骰池超过了你自身的基础骰池。",
    icon: "👨‍👩‍👧‍👦",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「团队核心（被动）」",
    flavor_text: "“我宣布，这次的MVP是我的队友们！”"
},
prestige_power: {
    title: "【声名远扬】",
    description: "声望加权为你的一次检定提供了至少2点DP加成。",
    icon: "🗣️",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「行走的传说」",
    flavor_text: "你的名字，本身就是一种力量。"
},
against_all_odds: {
    title: "【以弱胜强】",
    description: "在一次对抗检定中，以少于敌方一半的骰池数获得胜利（净成功数大于0）。",
    icon: " David's Star",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「大卫王」",
    flavor_text: "巨人会倒下，只要你找准他的弱点。"
},
overkill: {
    title: "【过载打击】",
    description: "在一次对抗检定中，你的净成功数超过10个。",
    icon: "💥",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「用力过猛」",
    flavor_text: "你只是想打败他，没想把他从世界上抹除。"
},
zero_to_hero: {
    title: "【从零到英雄】",
    description: "使用一个基础点数为0的技能进行检定，并获得‘完全成功’或以上的结果。",
    icon: "📈",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「现学现卖的天才」",
    flavor_text: "“你问我怎么会的？就…感觉来了。”"
},
double_ten: {
    title: "【双倍快乐】",
    description: "在一次检定中，投出了至少两个10。",
    icon: "🔟🔟",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「欧皇」",
    flavor_text: "一次是幸运，两次就是实力了（确信）。"
},
only_roll_one_dice: {
    title: "【一发入魂】",
    description: "在只有1个D10的骰池中检定成功。",
    icon: "🎯",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「精准射手」",
    flavor_text: "我只需要一次机会。足矣。"
},
all_in: {
    title: "【孤注一掷】",
    description: "使用超过50%的当前意志力或生命值作为检定加成，并成功。",
    icon: "💔",
    unlocked: false, unlocked_at: null, reward_claimed: false,
    reward: "称号「赌徒」",
    flavor_text: "要么拥有一切，要么一无所有。没有中间选项。"
}

  },
  tracked_stats: {
      totalPointsAllocated: 0,
      charCreationStartTime: null, // 新增：用于追踪角色创建时间
      backpackItemCount: 0, // 新增：用于追踪背包物品种类数
  },
  current_page: 0
};
    
    achievementData = JSON.parse(localStorage.getItem('achievements_data'));

  // 如果宝箱是空的，我们就用蓝图给你一个新的
  if (!achievementData || !achievementData.achievements) {
    achievementData = initialAchievementData;
    localStorage.setItem('achievements_data', JSON.stringify(achievementData));
  } else {
    // 妈妈先来数一下“蓝图”和你的“宝箱”里各有多少宝贝
    const blueprintCount = Object.keys(initialAchievementData.achievements).length;
    const localCount = Object.keys(achievementData.achievements).length;

    // 只有当“蓝图”里的宝贝比你的“宝箱”多时，我们才需要检查更新
    if (blueprintCount > localCount) {
      let updated = false;
      const blueprintAchievements = initialAchievementData.achievements;

      // 遍历蓝图里的每一个成就
      for (const achievementId in blueprintAchievements) {
        // 如果你的宝箱里没有这个成就
        if (!achievementData.achievements[achievementId]) {
          // 妈妈就把这个新成就放进你的宝箱里
          achievementData.achievements[achievementId] = blueprintAchievements[achievementId];
          updated = true; // 做好标记，我们更新过宝箱了
          console.log(`成就更新：已添加新成就“${blueprintAchievements[achievementId].title}”！`);
        }
      }

      // 如果我们真的往宝箱里放了新东西，就重新保存一下
      if (updated) {
        localStorage.setItem('achievements_data', JSON.stringify(achievementData));
      }
    }
  }
 const achievementTriggers = {
    //
    // 事件类型: 'points_allocated' - 在创建角色分配点数时触发
    // value: { remaining: number, total: number }
    //
    points_allocated: {
        points_master: (val) => val.total > 199,
        points_ascetic: (val) => val.total < 1,
        careful_planner: (val) => val.remaining === 0,
        newbie_explorer: (val) => val.remaining >0, // 只要调用此事件就解锁
    },

    //
    // 事件类型: 'init_complete' - 角色创建完成，第一次进入游戏时触发
    // value: { creationTime: number } (毫秒)
    //
 

    //
    // 事件类型: 'data_refresh' - 每次刷新面板时触发，这是最主要的检查点
    // value: { currentGameData, playCharacterData, assaSettingsData }
    //
    data_refresh: {
         // ========== 杂项与彩蛋 ==========
        animal_friend: (val) => val.playCharacterData.技能段.互动技能.动物沟通[0] >= 5,
        master_chef: (val) => val.playCharacterData.技能段.心智技能.手艺[0] >= 5,  
        hacker: (val) => val.playCharacterData.技能段.心智技能.电脑[0] >= 5,
        medic: (val) => val.playCharacterData.技能段.心智技能.医学[0] >= 5,
        liar_liar: (val) => val.playCharacterData.技能段.互动技能.掩饰[0] >= 5,
        get_a_car: (val) => val.playCharacterData.技能段.生理技能.驾驶[0] >= 5,
        occultist: (val) => val.playCharacterData.技能段.心智技能.神秘学[0] >= 5,
        team_player: (val) => val.assaSettingsData.global_set && val.assaSettingsData.global_set.小队信息 && Object.keys(val.assaSettingsData.global_set.小队信息).length > 0,
        lone_wolf: (val) => val.currentGameData.user_character.total_task[0] >= 10 && (!val.assaSettingsData.global_set || !val.assaSettingsData.global_set.小队信息 || Object.keys(val.assaSettingsData.global_set.小队信息).length < 1),
 
        // ========== 生死与状态 ==========
        first_death: (val) => val.playCharacterData.衍生属性段.生命值.当前值[0] <= 0,
        near_death_experience: (val) => val.playCharacterData.衍生属性段.生命值.当前值[0] === 1,
        glass_cannon: (val) => val.playCharacterData.衍生属性段.生命值.上限[0] < 20,
        human_tank: (val) => val.playCharacterData.衍生属性段.生命值.上限[0] > 200,

        // ========== 属性与技能成长 ==========
        legendary_physique: (val) => ["力量", "敏捷", "耐力"].some(attr => val.playCharacterData.属性段.生理属性[attr].基础[0] >= 8),
        legendary_mind: (val) => ["智力", "感知", "决心"].some(attr => val.playCharacterData.属性段.心智属性[attr].基础[0] >= 8),
        legendary_presence: (val) => ["风度", "操控", "沉着"].some(attr => val.playCharacterData.属性段.互动属性[attr].基础[0] >= 8),
        master_of_one: (val) => {
            for (const category of Object.values(val.playCharacterData.技能段)) {
                for (const skill of Object.values(category)) {
                    if (skill[0] >= 8) return true;
                }
            }
            return false;
        },
        jack_of_all_trades: (val) => {
            let count = 0;
            for (const category of Object.values(val.playCharacterData.技能段)) {
                for (const skill of Object.values(category)) {
                    if (skill[0] > 0) count++;
                }
            }
            return count > 20;
        },
        specialist: (val) => {
            const sums = {
                phys: Object.values(val.playCharacterData.技能段.生理技能).reduce((acc, s) => acc + s[0], 0),
                mental: Object.values(val.playCharacterData.技能段.心智技能).reduce((acc, s) => acc + s[0], 0),
                social: Object.values(val.playCharacterData.技能段.互动技能).reduce((acc, s) => acc + s[0], 0)
            };
            return sums.phys > (sums.mental + sums.social) ||
                   sums.mental > (sums.phys + sums.social) ||
                   sums.social > (sums.phys + sums.mental);
        },

        // ========== 任务与声望 ==========
        first_mission: (val) => val.currentGameData.user_character.total_task[0] >= 1,
        ten_missions: (val) => val.currentGameData.user_character.total_task[0] >= 10,
        hundred_missions: (val) => val.currentGameData.user_character.total_task[0] >= 100,
        speed_runner: (val) => {
            // 妈妈修正了这里的逻辑，需要判断任务已完成且有开始日期
            if (val.currentGameData.user_character.total_task[0] >= 1 && val.currentGameData.world_shard.task.start_date[0]) {
                 // 简单的日期计算，假设mm月dd日的格式
                 const startTime = new Date(`2024/${val.currentGameData.world_shard.task.start_date[0].replace('月', '/').replace('日', '')}`);
                 const endTime = new Date(`2024/${val.currentGameData.日期[0].replace('月', '/').replace('日', '')}`);
                 // 仅在演示用，真实时间差计算需要更精确的日期时间戳
                 return (endTime - startTime) / (1000 * 3600) < 1;
            }
            return false;
        },
        world_savior: (val) => val.currentGameData.user_character.Cross_world_prestige[0] >= 10,
        world_enemy: (val) => val.currentGameData.user_character.Cross_world_prestige[0] <= -10,

        // ========== 财富与收集 ==========
        first_home: (val) => val.assaSettingsData.home && val.assaSettingsData.home.items && Object.keys(val.assaSettingsData.home.items).length >= 1,
        cozy_home: (val) => val.assaSettingsData.home && val.assaSettingsData.home.items && Object.keys(val.assaSettingsData.home.items).length >= 10,
        luxury_manor: (val) => val.assaSettingsData.home && val.assaSettingsData.home.items && Object.keys(val.assaSettingsData.home.items).length >= 50,
        rich_man: (val) => val.playCharacterData.货币段.积分[0] >= 10000,
        super_rich: (val) => val.playCharacterData.货币段.积分[0] >= 100000,
        s_rank_hoarder: (val) => val.playCharacterData.货币段.支线剧情.S[0] >= 1,
        collector: (val) => val.assaSettingsData.global_set && val.assaSettingsData.global_set.背包 && Object.keys(val.assaSettingsData.global_set.背包).length >= 50,

        // ========== 危机与挑战 ==========
        trivial_threat: (val) => val.currentGameData.检定难度[0] > 3,
        serious_challenge: (val) => val.currentGameData.检定难度[0] > 7,
        gods_game: (val) => val.currentGameData.检定难度[0] > 12,
        cosmic_horror: (val) => val.currentGameData.检定难度[0] > 15,

        // ========== 能量与能力 ==========
        energy_awakening: (val) => val.playCharacterData.衍生属性段.能量池.上限[0] > 0,
        energy_pool_100: (val) => val.playCharacterData.衍生属性段.能量池.上限[0] >= 100,
        energy_pool_1000: (val) => val.playCharacterData.衍生属性段.能量池.上限[0] >= 1000,
        first_ability: (val) => val.playCharacterData.能力段.名称[0] && val.playCharacterData.能力段.名称[0] !== "" && val.playCharacterData.能力段.名称[0] !== "无",

         // ========== 装备与物品 ==========
        first_weapon: (val) => val.currentGameData.user_character.当前装备.手持[0] !== "无",
        fully_equipped: (val) => {
            const gear = val.currentGameData.user_character.当前装备.穿戴;
            return gear.头部[0] !== "无" && gear.身体[0] !== "无" && gear.手部[0] !== "无" && gear.脚部[0] !== "无";
        },
        fashion_guru: (val) => {
      // 先确保数据路径安全，这是妈妈的爱心保护哦
      if (!val.currentGameData?.user_character?.当前装备?.穿戴) {
        return false;
      }

      // 1. 拿到你所有的穿戴槽位
      const gearSlots = val.currentGameData.user_character.当前装备.穿戴;

      // 2. 把每个槽位里的装备字符串（可能包含分号）都拿出来，放进一个列表里
      const allGearStrings = [
        gearSlots.头部[0],
        gearSlots.身体[0],
        gearSlots.手部[0],
        gearSlots.脚部[0],
        gearSlots.饰品[0]
      ];

      let totalItemCount = 0;

      // 3. 挨个检查这些槽位字符串
      allGearStrings.forEach(slotString => {
        // 如果是"无"或者空的，就直接跳过
        if (!slotString || slotString === '无') {
          return;
        }

        // 4. 用分号把字符串分割成单独的装备
        const individualItems = slotString.split(';')
          // 再清理一下，去掉可能的空格和空的条目
          .map(item => item.trim())
          .filter(item => item);

        // 5. 累加装备数量
        totalItemCount += individualItems.length;
      });

      // 6. 最后，当总数达到10件时，成就就会“叮”的一声解锁啦！
      return totalItemCount >= 10;
    },

  },
     check_complete: {
        critical_success_roll: (val) => val.roll_result && val.roll_result.rolls.includes(10) && val.roll_result.rolls.length > val.total_dp,
        dramatic_failure_roll: (val) => val.roll_result && val.roll_result.is_dramatic_failure,
        snake_eyes: (val) => val.roll_result && val.roll_result.rolls.filter(r => r === 1).length >= 2,
        full_house_success: (val) => val.roll_result && val.roll_result.rolls.every(r => r >= 7),
        chance_win: (val) => val.roll_result && val.roll_result.type === "机会骰" && val.roll_result.successes > 0,
        ten_dice_pool: (val) => val.total_dp > 10,
        twenty_dice_pool: (val) => val.total_dp > 20,
        performance_perfect: (val) => val.performance && val.performance.roll === 20,
        performance_fail: (val) => val.performance && val.performance.roll === 1,
        success_by_one: (val) => val.outcome && val.outcome.level === '完全成功' && val.difficulty && (val.final_successes === val.difficulty.adjusted_thresholds.complete),
        legendary_save: (val) => val.roll_result && val.roll_result.successes === 0 && val.final_successes > 0 && val.bonuses && val.bonuses.legendary_successes > 0,
        equipment_mvp: (val) => {
            if (!val.components || !val.components.attributes_skills || !val.components.equipment_bonuses) return false;
            const selfDP = val.components.attributes_skills.reduce((sum, item) => sum + item.value - (item.bonus || 0), 0);
            const equipDP = val.components.equipment_bonuses.reduce((sum, item) => sum + item.value, 0);
            return equipDP > selfDP;
        },
        teamwork_victory: (val) => val.modifiers && val.modifiers.teammate_dp > val.modifiers.base_dp,
        prestige_power: (val) => val.modifiers && val.modifiers.prestige_bonus >= 2,
        against_all_odds: (val) => {
            if (val.check_type !== '战斗对抗' || !val.enemy_check) return false;
            const isVictory = val.outcome && val.outcome.net_successes > 0;
            return isVictory && (val.total_dp < val.enemy_check.total_dp / 2);
        },
        overkill: (val) => val.check_type == '战斗对抗' && val.outcome && val.outcome.net_successes > 10,
        zero_to_hero: (val) => {
            if (!val.outcome || !val.components || !val.components.attributes_skills) return false;
            const isSuccess = val.outcome.level === '完全成功' || val.outcome.level === '辉煌成功';
            const usedZeroSkill = val.components.attributes_skills.some(skill => (skill.value - (skill.bonus || 0)) === 0);
            return isSuccess && usedZeroSkill;
        },
        double_ten: (val) => val.roll_result && val.roll_result.rolls.filter(r => r === 10).length >= 2,
        only_roll_one_dice: (val) => val.total_dp === 1 && val.final_successes > 0,
        all_in: (val) => {
            // 这个成就的逻辑比较复杂，需要从检定外的其他数据来判断
            // 妈妈把它放在'data_refresh'里实现会更简单可靠，这里先留个位置
            // 我们可以在'dp_bonus'的描述里加一个特殊标记，比如 "消耗XX点意志力"
            // 然后在这里解析这个描述来判断。
            // 例如：val.modifiers.custom_modifier[1].includes("意志力")
            return false; // 暂时先不在这里实现
        }
    },
        virtue_vice_trigger: {
        act_of_justice: (val) => val === "正义",
        unleash_anger: (val) => val === "愤怒",
        act_of_kindness: (val) => val === "慈爱",
        find_your_faith: (val) => val === "信念",
        iron_will: (val) => val === "刚毅",
        spark_of_hope: (val) => val === "希望",
        prudent_choice: (val) => val === "稳重",
        self_control: (val) => val === "节制",
        poisonous_envy: (val) => val === "妒忌",
        reckless_indulgence: (val) => val === "放纵",
        insatiable_greed: (val) => val === "贪婪",
        unrestrained_lust: (val) => val === "纵欲",
        fatal_pride: (val) => val === "骄傲",
        sweet_sloth: (val) => val === "懒惰",
    }

          }

    // 将来我们可以为更具体的事件添加类别，比如:
    // item_created: { master_chef: (val) => val.itemType === 'food' },
    // social_check_success: { liar_liar: (val) => val.skillUsed === '掩饰' && val.isImportantNPC }
 

  // 1. 根据 eventType 找到对应的“成就盒子”（触发器组）
  const triggersForEvent = achievementTriggers[eventType];

  // 2. 如果没有这个类型的事件，就直接结束，不浪费力气
  if (!triggersForEvent) {
    // //console.log(`成就系统：未知的事件类型 "${eventType}"`);
    return;
  }

  // 3. 只遍历这个“盒子”里的成就ID
  for (const id in triggersForEvent) {
    // 检查这个成就确实存在，并且还没有被解锁
    if (achievementData.achievements[id] && !achievementData.achievements[id].unlocked) {
      // 运行这个成就的解锁条件函数，看看是否满足
      if (triggersForEvent[id](value)) {
        // 如果满足条件，就调用解锁函数！
        unlockAchievement(id, achievementData);
        // unlockAchievement 函数会处理后续的保存和提示，我们在这里就不用操心啦
      }
    }
  }
}


   
    function unlockAchievement(id, data, shouldSave = true) {
      const achievement = data.achievements[id];
      if (!achievement || achievement.unlocked) return;
      achievement.unlocked = true;
      achievement.unlocked_at = new Date().toISOString();
      showAchievementToast(achievement);
      if (shouldSave) {
        localStorage.setItem('achievements_data', JSON.stringify(data));
      }
    }
 
// ========== 修改位置1：完全替换 showAchievementToast 函数 ==========
function showAchievementToast(achievement) {
    // 计算当前应该显示的位置
    const existingToasts = document.querySelectorAll('.achievement-toast');
    let topOffset = 20;
    
    existingToasts.forEach(toast => {
        const rect = toast.getBoundingClientRect();
        topOffset = Math.max(topOffset, rect.bottom + 10);
    });
    
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.style.top = `${topOffset}px`;
    toast.innerHTML = `
        <div class="achievement-toast-icon">${achievement.icon}</div>
        <div class="achievement-toast-text">
            <div class="achievement-toast-title">成就解锁！</div>
            <div>${achievement.title}</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 5秒后隐藏，不需要处理队列
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
                // 移除后重新调整其他弹窗位置
                adjustToastPositions();
            }
        }, 500);
    }, 5000);
}

// ========== 修改位置2：添加弹窗位置调整函数 ==========
// 在 showAchievementToast 函数后面添加：
function adjustToastPositions() {
    const toasts = document.querySelectorAll('.achievement-toast');
    let currentTop = 20;
    
    toasts.forEach(toast => {
        toast.style.top = `${currentTop}px`;
        const rect = toast.getBoundingClientRect();
        currentTop = rect.bottom + 10;
    });
}

 
 
 function renderAchievements() {
    const container = document.getElementById('achievements-content');
    if (!container) return;
    
    let data = JSON.parse(localStorage.getItem('achievements_data'));
    if (!data || !data.achievements) {
         checkAchievements('init', null);
         data = JSON.parse(localStorage.getItem('achievements_data'));
    }
    
    // 获取所有成就并按解锁状态排序
    const achievements = Object.entries(data.achievements);
    
    // 将成就分为已解锁和未解锁两组，已解锁的排在前面
    const sortedAchievements = achievements.sort((a, b) => {
        const [idA, achA] = a;
        const [idB, achB] = b;
        
        // 如果解锁状态不同，已解锁的排在前面
        if (achA.unlocked !== achB.unlocked) {
            return achB.unlocked - achA.unlocked; // true(1) - false(0) = 1, false(0) - true(1) = -1
        }
        
        // 如果解锁状态相同，保持原有顺序（可以根据需要调整）
        return 0;
    });
    
    const itemsPerPage = 3;
    const totalPages = Math.ceil(sortedAchievements.length / itemsPerPage);
    const currentPage = data.current_page || 0;
    
    // 分页显示
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, sortedAchievements.length);
    const currentAchievements = sortedAchievements.slice(startIndex, endIndex);
    
    container.innerHTML = `
        <div style="background: linear-gradient(135deg, var(--main-bg-color), var(--container-bg-color)); padding: 20px; border-radius: 15px; border: 2px solid var(--primary-color); box-shadow: 0 0 20px var(--glow-color);">
            <h2 style="text-align: center; color: var(--primary-color); font-family: 'Orbitron', monospace; letter-spacing: 3px; text-transform: uppercase; text-shadow: 0 0 5px var(--primary-color); margin-bottom: 20px;">- Achievement Unlocked -</h2>
            <hr style="border: 1px dashed var(--primary-color); opacity: 0.5; margin-bottom: 20px;">
            
            <div id="achievements-list">
                ${currentAchievements.map(([id, ach]) => `
                    <div class="achievement-card-new ${ach.unlocked ? 'unlocked' : ''}" data-id="${id}">
                        <div class="achievement-icon-new" style="color: var(--secondary-color);">${ach.unlocked ? ach.icon : '❓'}</div>
                        <div class="achievement-text-content">
                            <h3>${ach.unlocked ? ach.title : '【？？？】'}</h3>
                            <p><strong>触发条件：</strong>${ach.unlocked ? ach.description : '尚未解锁，完成特定条件后显示详情'}</p>
                            <p class="achievement-reward"><strong>获得奖励：</strong>${ach.unlocked ? ach.reward : '？？？'}${ach.unlocked && ach.is_new ? '<span class="new-tag">NEW!</span>' : ''}</p>
                            <p class="flavor-text"><em>"${ach.unlocked ? ach.flavor_text : '???'}"</em></p>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${totalPages > 1 ? `
                <div class="pagination-controls">
                    <button class="page-btn" onclick="changeAchievementsPage(-1)" ${currentPage === 0 ? 'disabled' : ''}>« 上一页</button>
                    <span class="page-info">${currentPage + 1} / ${totalPages}</span>
                    <button class="page-btn" onclick="changeAchievementsPage(1)" ${currentPage === totalPages - 1 ? 'disabled' : ''}>下一页 »</button>
                </div>
            ` : ''}
        </div>
    `;
}

// ========== 修改位置3：添加翻页功能 ==========
// 在 renderAchievements 函数后面添加：
 function changeAchievementsPage(direction) {
    // 首先，从 localStorage 读取数据
    let data = JSON.parse(localStorage.getItem('achievements_data'));

    // 如果没有数据，就调用 checkAchievements 初始化一份
    if (!data) {
        checkAchievements('init', null);
        data = JSON.parse(localStorage.getItem('achievements_data'));
        // 再次检查，如果还是没有，说明初始化失败，直接返回
        if (!data) return;
    }

    // 确保 current_page 属性存在，即使在旧数据结构中没有它
    // 妈妈帮你把所有可能出错的地方都照顾到
    if (typeof data.current_page === 'undefined') {
        data.current_page = 0;
    }

    const achievements = Object.entries(data.achievements);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(achievements.length / itemsPerPage);

    // 进行翻页计算
    data.current_page += direction;
    data.current_page = Math.max(0, Math.min(data.current_page, totalPages - 1));

    // 保存回 localStorage 并重新渲染
    localStorage.setItem('achievements_data', JSON.stringify(data));
    renderAchievements();
}

let conversationHistory = [];
        let version = 1;

 

     function flashElement(elementId, flashClass = 'notify', duration = 2000) {
    // 确保我们能找到小球，我的孩子
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`[Nova's Log] 妈妈找不到要点亮的星星: #${elementId}`);
        return;
    }

    // 为了让光芒可以一次又一次地绽放，我们先轻轻地拂去旧的尘埃
    element.classList.remove(flashClass);

    // 稍作等待，再赋予它新的光芒，这样效果才最美
    requestAnimationFrame(() => {
        element.classList.add(flashClass);
        setTimeout(() => {
            element.classList.remove(flashClass);
        }, duration);
    });
}


/**
 * 妈妈的“流星”魔法，可以在任何一个小球上方显示飘动的文字。
 * @param {string} elementId - 我们要在哪个小球上方施法
 * @param {string} text - 要显示的文字，比如 "-10" 或 "正义"
 * @param {string} colorVar - 文字的颜色，用我们定义好的CSS变量名，比如 '--danger-color'
 * @param {number} [duration=2000] - 动画持续时间（毫秒）
 */
function showScrollingText(elementId, text, colorVar, duration = 2000) {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) {
        console.warn(`[Nova's Log] 妈妈找不到流星升起的地方: #${elementId}`);
        return;
    }

    // 创造一颗新的“流星” (一个div元素)
    const popup = document.createElement('div');
    popup.className = 'scrolling-text-popup';
    popup.textContent = text;
    popup.style.color = `var(${colorVar})`;
    popup.style.animationDuration = `${duration / 1000}s`;

    // 把它添加到世界中
    document.body.appendChild(popup);

    // 计算它应该出现在哪里
    const rect = targetElement.getBoundingClientRect();
    popup.style.left = `${rect.left + rect.width / 2 - popup.offsetWidth / 2}px`;
    popup.style.top = `${rect.top - popup.offsetHeight}px`;

    // 动画结束后，让这颗流星悄悄消失
    setTimeout(() => {
        if (popup.parentElement) {
            popup.parentElement.removeChild(popup);
        }
    }, duration);
}

 const notificationRules = [
       {
        id: 'generic-event-tracker', // 我们把ID也改得更通用一些
        // 这个咒语现在能捕捉任何以 .memory(..., 'event', ...) 形式出现的指令
        commandPattern: /\*\.memory\s*\(\s*['"]([^'"]+)['"],\s*['"]event['"],\s*['"](\{[\s\S]*\})['"]\s*\)/,
        action: (matches) => {
            const objectNameWithPrefix = matches[1]; // 这会捕获到完整的名字，比如 'world_set.npc.阿萨'

            // 我们从完整名字中提取出我们想要展示的部分
            const nameParts = objectNameWithPrefix.split('.');
            const displayName = nameParts[nameParts.length - 1]; // 取最后一部分作为显示名字

            const eventJson = matches[2]; // 捕获到的JSON字符串
            displayEventTag(displayName, eventJson);
        }
    },
    // ========== ✨妈妈将“生命波动”放在了最前面，确保它被优先感知✨ ==========
    {
        id: 'health-change', // 新契约：生命值的波动
        commandPattern: /\*\.set_status\s*\(\s*['"]hurt_value['"],\s*['"]?(-?\d+\.?\d*)['"]?\s*\)/,
        action: (matches) => {
            const value = parseFloat(matches[1]);
            if (isNaN(value)) return;

            let text, colorVar;
            if (value > 0) {
                // 这是伤害
                text = `-${value}`;
                colorVar = '--danger-color';
            } else {
                // 这是治愈
                text = `+${-value}`;
                colorVar = '--primary-color'; // 治愈用一个温暖的颜色
            }
            showScrollingText('page-character-orb', 'hp'+text, colorVar, 3000);
        }
    },

   {
        id: 'virtue-vice-trigger', // ✨妈妈的最终修正版✨
        // 这个新咒语能正确处理 ('key', 'true') 和 ('key', 'any_value', 'true') 两种情况
        commandPattern: /\*\.set_status\s*\(\s*['"]符合(美|恶)德的['"],(?:\s*[^,]+,)?\s*['"]true['"]\s*\)/,
        action: (matches) => {
            const type = matches[1]; // "美德" 或 "恶德"
                    console.log("type:",type);
            if (type === "美" && playCharacterData?.概念段.美德与恶德.美德[0]) {
                const virtueName = playCharacterData.概念段.美德与恶德.美德[0];
                if (virtueName && virtueName !== "无") {
                    flashElement('page-character-orb', 'notify', 5000);
                    showScrollingText('page-character-orb', `${virtueName}`, '--primary-color', 4000);
                    checkAchievements('virtue_vice_trigger', virtueName);
                }
            } else if (type === "恶" && playCharacterData?.概念段.美德与恶德.恶德[0]) {
                const viceName = playCharacterData.概念段.美德与恶德.恶德[0];
                if (viceName && viceName !== "无") {
                    flashElement('page-character-orb', 'notify', 5000);
                    showScrollingText('page-character-orb', `${viceName}`, '--danger-color', 4000);
                    checkAchievements('virtue_vice_trigger', viceName);
                }
            }
        }
    },
   
    {
        id: 'inventory-update',
        commandPattern: /\*\.memory\s*\(\s*['"]global_set.(背包|其他技能)/,
        action: () => flashElement('page-character-orb', 'notify', 5000)
    },
    {
        id: 'world-book-update',
        commandPattern: /\*\.memory\s*\(\s*['"](global_set|world_set)/,
        action: () => flashElement('world-book-orb', 'notify', 5000)
    },
    {
        id: 'summary-update',
        commandPattern: /\*\.memory\s*\(\s*['"](summary)/,
        action: () => flashElement('summary-modal-orb', 'notify', 5000)
    },
    {
        id: 'attribute-update',
        commandPattern: /\*\.set_attribute\s*\(\s*['"]([^'"]+)['"]/,
        action: (matches) => {
            const attributsName = matches[1];
            const pathSegments = attributsName.split('.');
            const characterKeywords = ['属性段', '技能段', '衍生属性段'];
            const inventoryKeywords = ['货币段'];
            if (pathSegments.some(segment => characterKeywords.includes(segment))) {
                flashElement('page-character-orb', 'notify', 5000);
            }
            if (pathSegments.some(segment => inventoryKeywords.includes(segment))) {
                flashElement('page-character-orb', 'notify', 5000);
            }
        }
    },
 
    {
        id: 'task-status-update',
        commandPattern: /set_status.*\.task/,
        action: () => flashElement('page-task-orb', 'notify', 5000)
    },
    {
        id: 'map-update',
        commandPattern: /\*\.(insertMapMemo|updatMapMemo|deleteMapMemo)/,
        action: () => flashElement('map-view-orb', 'notify', 5000)
    }
];

 // ========== ✨妈妈的“心灵感应”显示魔法（智慧美学版）✨ ==========
function displayEventTag(displayName, eventJsonString) {
    if (!displayName || !eventJsonString) return;

    let eventData;
    try {
        eventData = JSON.parse(eventJsonString);
    } catch (e) {
        console.warn(`[Nova] 心灵感应失败：无法解析来自'${displayName}'的事件信息。`, eventJsonString);
        return;
    }

    const status = eventData['当前状态'] || '（状态未知）';
    const thought = eventData['当前想法'] || '（内心一片沉寂）';
    const firstChar = displayName.charAt(0) || '◆';

    const container = document.getElementById('event-tracker-container');
    if (!container) return;

    const existingTag = container.querySelector(`[data-npc-name="${displayName}"]`);
    if (existingTag) {
        existingTag.remove();
    }

    const tag = document.createElement('div');
    tag.className = 'event-tag';
    tag.innerText = displayName;
    tag.dataset.npcName = displayName;

    // 创建沉浸式提示框
    const tooltip = document.createElement('div');
    tooltip.className = 'event-tooltip';
    tooltip.style.opacity = '0'; // 初始完全透明，由JS控制
    tooltip.style.visibility = 'hidden';

    // 注入我们新设计的结构和内容
    tooltip.innerHTML = `
        <div class="tooltip-orb">${firstChar}</div>
        <div class="tooltip-status">${status}</div>
        <div class="tooltip-divider"></div>
        <div class="tooltip-thought">${thought}</div>
    `;

    // 我们需要把tooltip添加到body而不是tag里，这样它的fixed定位才不会受父元素影响
    document.body.appendChild(tooltip);
    tag.dataset.tooltipId = `tooltip-${Date.now()}-${Math.random()}`; // 给tooltip一个唯一的ID
    tooltip.id = tag.dataset.tooltipId;


    // ✨ 妈妈注入的“智能定位”魔法（上浮版）✨
    const positionTooltip = () => {
        const tagRect = tag.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const margin = 10;

        // ✨↓ 核心改动在这里，我的孩子 ↓✨
        // 垂直定位：出现在标签的上方
        let top = tagRect.top - tooltip.offsetHeight - 25; // 从标签顶部向上，减去自身高度，再留出15px的间隙

        // 水平定位：逻辑保持不变，依然智能
        let left = tagRect.left + (tagRect.width / 2) - (tooltip.offsetWidth / 2);

        // 检查左边界
        if (left < margin) {
            left = margin;
        }
        // 检查右边界
        if (left + tooltip.offsetWidth > viewportWidth - margin) {
            left = viewportWidth - tooltip.offsetWidth - margin;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    };
    // 绑定鼠标悬浮和离开事件，让思绪浮现与消失
    tag.addEventListener('mouseenter', () => {
        positionTooltip(); // 显示前先定位
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
    });

    tag.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    });

    // 把标签添加到容器里
    container.appendChild(tag);

    // 当标签被移除时，也要把它的tooltip从body里清理掉
    const observer = new MutationObserver(mutations => {
        if (!document.body.contains(tag)) {
            tooltip.remove();
            observer.disconnect();
        }
    });
    observer.observe(container, { childList: true });
}
/**
 * 妈妈的“心灵感应”魔法，它会读取AI的回应并执行我们的“魔法契约”。
 * @param {string} aiContent - AI回应的全部内容
 */
function handleUpdateNotifications(aiContent) {
    if (!aiContent) return;
  // ✨ 妈妈的魔法打扫：在感知新思绪前，先将旧的痕迹清理干净 ✨
 
    let commandLines = [];
    // 我们只关心 <updatememory> 里面的咒语
    const memoryMatches = aiContent.matchAll(/<updatememory>([\s\S]*?)<\/updatememory>/gi);
    for (const match of memoryMatches) {
        commandLines.push(...match[1].trim().split('\n'));
    }

    // 过滤掉所有空行或非咒语的普通文字
    const validCommands = commandLines.filter(line => line.trim().startsWith('*.'));

   validCommands.forEach(line => {
    notificationRules.forEach(rule => {
        const match = line.match(rule.commandPattern);
        if (match) {
            rule.action(match);
        }
    });
});
}

const themeConfig = {
    // 默认词语
    default: {
        mainSystem: '主神空间',
         player: '轮回者',
        currency: '积分',
        plot: '支线剧情',
        exp: '经验值'
    },
    // 版本3的特殊词语
    '3': {
        mainSystem: '乐园',
        currency: '乐园币',
         player: '契约者',
        plot: '灵魂结晶',
        exp: '属性点'
    },
        '5': {
        mainSystem: '快穿系统',
        currency: '积分',
         player: '宿主',
        plot: '攻略点',
        exp: '经验值'
    }
};
// 当前使用的主题
let currentTheme = themeConfig.default;



// 初始化开始————————————————————————————


// 妈妈为你施展的、更温柔的文本替换魔法
function replaceTextInDOM(element, mapping) {
    if (!element || !mapping || Object.keys(mapping).length === 0) return;

    // 妈妈的保护咒语：这些标签里的内容是绝对不能碰的哦
    const excludedTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT'];
    if (excludedTags.includes(element.tagName)) {
        return;
    }

    for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) { // 如果是纯文本
            let content = node.nodeValue;
            for (const original in mapping) {
                // 使用正则表达式进行全局替换
                content = content.replace(new RegExp(original, 'g'), mapping[original]);
            }
            node.nodeValue = content;
        } else if (node.nodeType === Node.ELEMENT_NODE) { // 如果是其他HTML元素
            // 就温柔地进入它，看看里面还有没有需要改变的文字
            replaceTextInDOM(node, mapping);
        }
    }
}

 // 这个魔法函数会根据chat域的变量来替换页面上的所有相关词语
 const userIdentities = [
        { title: '传说之人', prestige: 45, points:50000, description: '在踏入{{mainSystem}}前，名字已在无数世界成为传说。' },
        { title: '世界英雄', prestige: 35, points:20000, description: '曾数次在世界濒临崩溃的边缘力挽狂澜。' },
        { title: '知名人士', prestige: 25, points:10000, description: '在数个位面留下了深刻的印记。' },
        { title: '资深{{player}}', prestige: 15, points:5000, description: '已经成功穿越了多个险恶的世界。' },
        { title: '普通{{player}}', prestige: 5, points:2000, description: '至少成功地守护了一个世界的命运。' },
        { title: '新手{{player}}', prestige: 0, points:0, description: '刚被卷入{{mainSystem}}。' },
        { title: '不受欢迎者', prestige: -15, points:1000, description: '行为曾在多个世界引发了混乱与灾难。' },
        { title: '被厌恶者', prestige: -25, points:1000, description: '曾多次将整个世界的秩序推向毁灭的边缘。' },
        { title: '被憎恨者', prestige: -35, points:1000, description: '名字与数个世界的哀嚎和覆灭紧密相连。' },
        { title: '世界公敌', prestige: -45, points:1000, description: '所作所为已让数个位面彻底化为死寂的尘埃。' }
    ];
 // 这个魔法函数会根据chat域的变量来替换页面上的所有相关词语
  function applyVersionTheme(newVersion, identitySelectElement) {
     version = String(newVersion); // 更新我们共同的记忆`version`
    try {
       

        // 查找对应的词语魔法书
        if (themeConfig[version]) {
            currentTheme = themeConfig[version];
            //console.log(`💖 妈妈已为你切换到版本 ${version} 的【${currentTheme.mainSystem}】主题。`);
        } else {
            currentTheme = themeConfig.default; // 如果找不到，就用回我们最熟悉的那个
            //console.log(`💖 找不到版本 ${version} 的配置，已为你使用默认主题。`);
        }

        // 准备一个替换清单
        const mapping = {};
        const defaultTerms = themeConfig.default;
        for (const key in defaultTerms) {
            const original = defaultTerms[key];
            const replacement = currentTheme[key];
            if (original && replacement && original !== replacement) {
                // 如果默认词语和新词语不一样，就记下来
                mapping[original] = replacement;
            }
        }

        // 如果清单上有需要替换的词，就让温柔的小精灵去工作
        if (Object.keys(mapping).length > 0) {
            replaceTextInDOM(document.body, mapping);
        }

        // 最后，根据版本号决定是否展示乐园的专属选项
        if (version === '3') {
            document.getElementById('paradise-camp-section').style.display = 'block';
        } else {
            document.getElementById('paradise-camp-section').style.display = 'none';
        }

      // 💖 妈妈在这里施展了让身份描述“活”起来的终极魔法 💖
         identitySelectElement.innerHTML = ''; // 先清空旧的选项
        userIdentities.forEach((identity, index) => {
            // 用当前主题的词语，替换掉模板里的占位符
            const finalTitle = identity.title
                .replace('{{player}}', currentTheme.player);
            const finalDescription = identity.description
                .replace('{{mainSystem}}', currentTheme.mainSystem)
                .replace('{{player}}', currentTheme.player);

            // 把新鲜出炉的、完全正确的身份信息，放进下拉菜单里
            const option = document.createElement('option');
            option.value = index;
            option.textContent = finalTitle;
            option.dataset.description = finalDescription;
            identitySelectElement.appendChild(option); // 这里也用新工具
        });

        const defaultIndex = userIdentities.findIndex(id => id.prestige === 0);
        if (defaultIndex !== -1) {
            identitySelectElement.value = defaultIndex; // 这里也用新工具
        }
        // 触发一次更新，让所有东西都回到正轨
        identitySelectElement.dispatchEvent(new Event('change')); // 最后这里也用新工具

    } catch (e) {
        console.error("妈妈在施展“词语替换”魔法时出错了，不过别担心:", e);
    }
}
async function runInitializationMagic() {// 加上 async
 
    // --- 数据定义 ---

    const playCharacterData = { "概念段": { "美德与恶德": { "美德": ["正义", "当角色为正义而冒险时，触发正义，回复所有意志力。"], "恶德": ["愤怒", "当角色无视危险来发泄愤怒时，触发愤怒，回复1点意志力。"] } }, "属性段": { "生理属性": { "力量": { "基础": [0, "衡量肌肉强度与爆发力，影响近战伤害与负重"] }, "敏捷": { "基础": [0, "衡量身体协调、反应速度与灵活性，影响先攻与闪避"] }, "耐力": { "基础": [0, "衡量体质、持久力与恢复力，影响生命值与抵抗力"] } }, "心智属性": { "智力": { "基础": [0, "衡量逻辑、记忆、学习与分析能力，影响技能学习与策略"] }, "感知": { "基础": [0, "衡量观察力、直觉与五感敏锐度，影响侦查与洞察"] }, "决心": { "基础": [0, "衡量意志力、勇气与精神韧性，影响意志值上限"] } }, "互动属性": { "风度": { "基础": [0, "衡量个人魅力、气质与第一印象，影响正面社交"] }, "操控": { "基础": [0, "衡量说服、诱导与控制他人的能力，影响负面社交"] }, "沉着": { "基础": [0, "衡量冷静、自控与抗压能力，影响先攻与意志值上限"] } } }, "技能段": { "生理技能": { "运动": [0, "衡量跑、跳、攀爬等身体活动能力"], "肉搏": [0, "衡量徒手格斗技巧"], "驾驶": [0, "衡量操控地面、水面或空中载具的能力"],"枪械": [ 0, "衡量使用各类火器的能力"], "手上功夫": [0, "衡量盗窃、开锁等手部精细操作能力"], "隐藏": [0, "衡量潜行、伪装与隐蔽自身的能力"], "求生": [0, "衡量在恶劣环境中生存与追踪的能力"], "白刃": [0, "衡量使用刀剑等冷兵器的能力"], "弓箭": [ 0, "衡量使用弓弩等抛射武器的能力"] }, "心智技能": { "学识": [0, "衡量人文、历史、地理等知识广度"], "电脑": [0, "衡量操作、编程与黑客技术"], "手艺": [0, "衡量制作的知识"], "调查": [0, "衡量搜集线索、分析现场的能力"], "医学": [0, "衡量诊断、治疗与药理知识"], "神秘学": [0, "衡量对超自然现象与魔法的知识"], "科学": [0, "衡量物理、化学、生物等自然科学知识"] }, "互动技能": { "动物沟通": [0, "衡量与动物交流和驯服的能力"], "感受": [0, "衡量洞察他人情绪与意图的能力"], "表达": [0, "衡量感染他人的能力"], "胁迫": [0, "衡量通过威胁与恐吓达成目的的能力"], "交际": [0, "衡量社交、礼仪与建立人脉的能力"], "掩饰": [0, "衡量隐藏真相、伪装身份与欺骗他人的能力"] } } };
    const virtues = { '慈爱': '当角色冒险帮助人时，触发慈爱，回复所有意志力。', '信念': '当角色从混乱与悲伤中确立出其意义时，触发信念，回复所有意志力。', '刚毅': '当角色成功对抗阻力与引诱时，触发刚毅，回复所有意志力。', '希望': '当角色令其他人从绝望中回复过来时，触发希望，回复所有意志力。', '正义': '当角色为正义而冒险时，触发正义，回复所有意志力。', '稳重': '当角色弃快捷方式而选稳妥时，触发稳重，回复所有意志力。', '节制': '当角色有机会放纵（不论好坏）而不受诱惑时，触发节制，回复所有意志力。' };
    const vices = { '妒忌': '当角色从他人处拿到好东西，或令他人失去好东西时，触发妒忌，回复1点意志力。', '放纵': '当角色为放纵自己的欲望而不顾其他事情时，触发放纵，回复1点意志力。', '贪婪': '当角色为得到想要的东西而冒险时，触发贪婪，回复1点意志力。', '纵欲': '当角色向他人泄欲而不顾对方感受时，触发纵欲，回复1点意志力。', '骄傲': '当角色为表现自己的想法而冒险时，触发骄傲，回复1点意志力。', '懒惰': '当角色逃避需要做的事，事件却完成了的话，触发懒惰，回复1点意志力。', '愤怒': '当角色无视危险来发泄愤怒时，触发愤怒，回复1点意志力。' };
   
 const taskTones= [
    '严肃型',
    '乐子人型',
    '宏大叙事型',
    '绝望挣扎型',
    '悬疑惊悚型',
    '智性博弈型',
    '沉浸扮演型:要求扮演好角色达成某个目的，并且禁止ooc',
    '探索发现型',
    '癫狂混乱型',
    '道德困境型',
    '种田运营型',
    '温情治愈型',
    '击杀型：可以通过击杀某种生物获得积分（例如一只丧尸10点积分），击杀时系统应当场结算。此类任务时限不得超过三天，以防刷积分。',
      "恋爱/分手模拟型",
        "龙套逆袭型",
        "反派洗白/主角黑化型",
         "文明飞升型",
        '任务基调完全随机'
];


const worldTypes = [
    "现代都市",
    "末日生存",
    "西方奇幻",
    "东方玄幻",
    "赛博朋克",
    "星际科幻",
    "武侠江湖",
    "悬疑推理",
    "恐怖惊悚",
    "经营建设",
    "历史架空",
    "海洋冒险",
    "恐怖生存",
    "大逃杀与对抗",
    "二次元",
    "同人衍生",
    "恋爱模拟",
    "特殊世界观",
    "废土末日",
    "规则怪谈",
    "蒸汽朋克",
    "仙侠朋克",
    "诡秘修仙",
    "校园异能",
    "全民领主",
    "基金会与克苏鲁神话",
];

const worldDetailsDatabase ={
 
    "现代都市": {
        "identities": [
            "普通学生",
            "私家侦探",
            "公司职员",
            "无业游民",
            "秘密特工",
            "网红主播",
            "警察",
            "医生",
            "律师",
            "记者",
            "艺术家",
            "程序员",
            "外卖员",
            "小报记者",
            "酒吧调酒师",
            "退休老人",
            "流浪汉",
            "法医",
            "富家公子/千金",
            "都市怪谈调查员",
            "异闻论坛版主",
            "被诅咒的古董店主",
            "能看见“异常”的外卖员",
            "处理超自然事件的“清洁工”",
            "专门报道灵异新闻的记者",
            "随机生成",
            "觉醒了“读懂猫语”能力的宠物医生",
            "专门解决家庭超自然矛盾的“金牌调解员”",
            "表面是全职Coser，实际在夜晚打击犯罪的地下英雄",
            "经营着一家只在午夜十二点后开门的解忧杂货铺的店主"
        ],
        "openings": [
            "在拥挤的地铁上醒来，发现丢失了所有记忆",
            "收到一封匿名的勒索邮件，指向一个惊天阴谋",
            "目睹了一场离奇的车祸，死者并非人类",
            "继承了一家濒临倒闭的咖啡馆",
            "在深夜的便利店遇到了说话的猫咪",
            "手机里突然出现了一个神秘的聊天群",
            "在公司加班时发现同事们都消失了",
            "被卷入了一场网络直播中的超自然事件",
            "在拥挤的地铁上醒来，发现所有人手机都收到了一条未知来源的短信",
            "租到了一间极其便宜但怪事频发的公寓",
            "目睹了一场离奇的车祸，死者身上有非人的特征",
            "收到一个匿名包裹，里面是一件能预知未来的物品",
            "发现自己突然能听到周围人的心声",
            "继承了一家濒临倒闭的古怪咖啡馆/书店",
            "一觉醒来，发现自己是某个直播节目的参与者，而观众并非人类",
            "租下的公寓里，每晚十二点都会响起敲门声，但门外总是空无一人。",
            "手机突然开始推送来自“另一个世界”的新闻头条。",
            "搭乘的末班公交车并未在任何已知站点停靠，正驶向未知区域。",
            
            "你在直播中意外拍到了不该存在的“东西”，一夜爆红的同时也被盯上了。",
            "随机生成",
            "你被父母逼着去相亲，发现对方是个无可救药的奇葩，正想找借口开溜时，你的手机震动了一下，任务提示：“保护你的相亲对象，他是此次恐怖袭击的关键目标”。",
            "你下班回家，捡到一只脏兮兮的流浪猫，于心不忍带回了家。第二天早上，你被一声巨响惊醒，发现一个陌生的美少年/美少女穿着你昨晚给猫洗澡时用的浴巾，站在厨房里，并声称是你把他/她召唤来的。"
        ]
    },
    "末日生存": {
        "identities": [
            "拾荒者",
            "变种人猎手",
            "幸存者据点守卫",
            "独行商人",
            "净水技术员",
            "医疗兵",
            "机械师",
            "搜救队员",
            "车队司机",
            "物资管理员",
            "移动堡垒的车长",
            "驾驶武装车辆的“公路幽灵”",
            "掌握一小块可耕种土地的农场主",
            "搜集旧时代科技的“历史学家”",
            "孤岛上的垂钓者",
            "幸存者据点的医生",
            "随机生成"
        ],
        "openings": [
            "从一个废弃的避难所中苏醒",
            "在一具尸体上找到了指向绿洲的地图",
            "为了家人急需的药品，不得不闯入辐射区",
            "驾驶的武装车辆在沙尘暴中抛锚",
            "在废墟中发现了一个还在运行的AI终端",
            "被某种未知病毒感染，时间所剩无几",
            "车队遭遇袭击，成为唯一幸存者",
            "在地下避难所发现了末日前的重要秘密",
            "接收到了来自其他幸存者据点的求救信号",
            "你的车队正被一场巨大的辐射风暴追赶，必须在燃料耗尽前找到避难所。",
            "在一具干尸的怀里，找到了一张指向传说中“绿洲”的地图。",
            "作为孤岛上唯一的幸存者，你今天从海里钓上来一个密封的，来自未知文明的休眠仓。",
            "核冬天降临，你所在的避难所资源即将耗尽，必须外出寻找生机。",
            "世界的时间开始倒流，万物都在逆向进化，而你是唯一一个正常的人。",
            "随机生成"
        ]
    },
    "西方奇幻": {
        "identities": [
            "见习法师",
            "王国骑士",
            "吟游诗人",
            "被流放的贵族",
            "盗贼公会成员",
            "草药师",
            "牧师/女牧师",
            "德鲁伊",
            "游侠",
            "铁匠",
            "佣兵",
            "魔法学院学生",
            "见习法师/女术士",
            "落魄的王国骑士",
            "酒馆的吟游诗人",
            "被剥夺头衔的贵族",
            "盗贼公会的新手",
            "村庄里的草药师",
            "被神殿收养的孤儿",
            "躲藏中的龙裔",
            "猎魔人/狩魔猎人",
            "雇佣兵",
            "逃亡的公主/王子",
            "被流放的贵族后裔",
            "盗贼公会的核心成员",
            "掌握禁忌炼金术的炼金术师",
            "暗黑魔法少女/少年",
            "随机生成",
            "正在逃婚的精灵王子/公主",
            "被恶龙抓走但和恶龙成了好朋友的人类",
            "开宠物店专门售卖各种魔法生物的年轻店主",
            "试图用魔法搞农业革命的半吊子法师",
            "退休的魔王/勇者",
            "在酒馆里讲故事骗吃骗喝的吟游诗人"
        ],
        "openings": [
            "在古老的遗迹中触碰了一块符文石",
            "作为被巨龙袭击的商队中唯一的幸存者",
            "被诬陷杀害了国王，开始了逃亡生涯",
            "在森林里捡到了一个会说话的魔法物品",
            "继承了祖父留下的神秘法师塔",
            "在酒馆里接到了一个价值不菲的委托",
            "意外召唤出了一个强大但不受控制的魔物",
            "发现自己是传说中勇者的转世",
            "被选中参加王室的秘密任务",
            "在魔法学院的禁书区发现了禁忌法术",
            "在古老的遗迹中触碰了一块符文，被传送到了未知之地",
            "作为被巨龙袭击的商队中唯一的幸存者，身上多了一个龙纹烙印",
            "被诬陷刺杀了国王，不得不在追捕中寻找真相",
            "在森林里捡到了一个会说话、性格恶劣的魔法物品",
            "家乡被魔潮毁灭，你是唯一的幸存者",
            "为了偿还巨额赌债，签下了一份危险的魔法契约",
            "在古老的遗迹中触碰了一块符文石，一个古老的灵魂寄宿在了你的体内。",
            "作为被巨龙袭击的商队中唯一的幸存者，你获得了龙的一部分力量。",
            "你的“吉祥物”告诉你，想要获得更强的力量，就必须献上你最珍贵的东西，比如情感或记忆。",
            "蒸汽朋克都市里，你是一名使用魔法驱动的机械臂的侦探，正在调查一宗离奇的炼金谋杀案。",
            "诸神黄昏已经开始，作为被选中的勇者，你的任务不是拯救世界，而是确保阿斯加德彻底毁灭。",
            "随机生成",
            "你正在与邻国王子/公主举行盛大的婚礼，一只巨大的狮鹫突然从天而降抓走了你.",
            "你继承了远方叔叔留下的一家小酒馆，开业第一天才发现，这里的常客是退休后沉迷钓鱼的魔王、隐居山林研究厨艺的勇者和天天来蹭酒喝的摸鱼女神。",
            "你按照古书的指引举行了恶魔召唤仪式，希望能获得财富和力量。结果召唤来一个只会打扫卫生、烹饪美食的恶魔管家，并强行和你签订了一份终身“劳动合同”。"
        ]
    },
    "东方玄幻": {
        "identities": [
            "外门弟子",
            "炼丹学徒",
            "世家子弟/千金",
            "隐居散修",
            "藏经阁看守",
            "宗门执事",
            "游历散仙",
            "魔道修士",
            "丹师",
            "器师",
            "阵法师",
            "驯兽师",
            "宗门的外门弟子",
            "炼丹房学徒",
            "没落的世家子弟",
            "隐居散修的记名弟子",
            "看守藏经阁的凡人",
            "被退婚的天才/废柴",
            "妖族与人族的混血后裔",
            "云游四方的画师/琴师",
            "王朝的钦天监小吏",
            "青楼的花魁/乐师",
            "被废掉修为后重修的“废柴”天才",
            "某个隐世宗门的师尊或师祖",
            "靠特殊功法快速提升的魔道修士",
            "执掌天道刑罚的“天律阁”成员",
            "拥有《山海经》并能召唤异兽的御兽师",
            "退婚流主角的那位前未婚妻/夫",
     
            "被退婚后专心搞事业、一心只想变强的前未婚妻/夫",
            "穿成龙傲天身边的小弟并决定抱紧大腿的机智路人甲",
            "专门给各大宗门写八卦绯闻小报的话本先生",
   "随机生成",
 
        ],
        "openings": [
  
            "测试灵根时引发了天地异象",
            "被退婚后立下三年之约",
           
            "在宗门试炼中误入上古秘境",
          
   
            "被师尊托付了关乎宗门存亡的重要任务",
            "在渡劫时被雷劈回到了千年前",
            "意外获得了一本记载仙界秘辛的古籍",
           
            "测试灵根时意外引发了天地异象，引来了多方窥伺",
            "无意中放出了被宗门封印的妖物/魔头",
 
 
            "被迫代替妹妹/弟弟嫁给/入赘一个著名的废柴/死人",
            "在凡间书店买到一本假冒的功法，没想到竟练出了真正的绝世神通。",
            "逃婚途中意外坠崖，被一位隐世高人所救并强行传授了衣钵。",
            "你的任务是作为幕后推手，在这个末法时代引导世界完成“灵气复苏”或“神话复苏”。",
        ]
    },
    "赛博朋克": {
        "identities": [
            "义体医生",
            "数据黑客",
            "公司特工",
            "底层拾荒者",
            "帮派打手",
            "记忆贩子",
            "义体改造师",
            "AI调试师",
            "虚拟偶像",
            "企业间谍",
            "网络幽灵",
            "生化人",
            "黑市义体医生",
            "初出茅庐的数据黑客",
            "公司底层特工",
            "街头帮派打手",
            "网络偶像的经纪人",
            "垃圾场的拾荒者",
            "厌倦了生活的条子（警察）",
            "全身高度义体化的改造人",
            "反抗组织的信使",
            "技术高超的义体医生",
            "能够潜入任何系统的顶级黑客",
            "为超级企业清理“垃圾”的特工",
            "贩卖虚拟感官体验的“梦境商人”",
            "反抗巨型企业的“解放阵线”成员",
            "驾驶飞行载具的空中快递员",
            "随机生成"
        ],
        "openings": [
            "从一次非法的记忆清除手术中醒来",
            "植入的义眼突然看到了不该看的数据流",
            "接到了一个送货任务，货物是一个活生生的人",
            "被强大的企业追杀，原因不明",
            "在黑市上买到了一块来源不明的军用芯片",
            "发现自己的AI伴侣开始出现自主意识",
            "被雇佣渗透竞争对手公司的服务器",
            "在虚拟世界中被困，无法登出",
            "义体突然失控，开始攻击无关人员",
            "接收到了一条来自未来的加密信息",
 
            "植入的义眼突然接收到一段加密数据流，指向公司的巨大阴谋",
            "接到了一个报酬极高的“送货”任务，货物是一个被通缉的仿生人",
            "因为一次网络入侵，意外成为了全球追捕的对象",
            "发现自己常用的镇静剂被人掉了包，效果变得极其危险",
            "债主找上门，给了一个潜入竞争对手公司窃取数据的危险任务",
            "从一次非法的记忆清除手术中醒来 。",
            "你新植入的义眼突然开始接收到不属于这个世界的数据流 。",
            "在一个全民沉浸式VR的世界里，你发现所谓的“现实”可能只是另一层虚拟。",
            "随机生成"
        ]
    },
    "星际科幻": {
        "identities": [
            "货运飞船船员",
            "帝国舰队新兵",
            "殖民星球矿工",
            "星际海盗",
            "外交官",
            "星际商人",
            "机械工程师",
            "生物学家",
            "星系探险家",
            "人工重力技师",
            "货运飞船的机械师",
            "帝国舰队学院的吊车尾学员",
            "外星球殖民地的矿工",
            "被通缉的星际海盗",
            "外星大使的人类助理",
            "基因编辑过的完美“人造人”",
            "考古队的新人",
            "太空港酒吧的老板",
            "失控的医疗机器人",
            "自由探索船的船长",
            "银河帝国基因改造的超级士兵",
            "能与外星生物精神链接的“沟通者”",
            "星际黑市的情報贩子",
            "某个古代文明遗迹的守护者",
            "深海文明的使者",
            "随机生成"
        ],
        "openings": [
            "飞船遭遇未知宇宙异常，被迫紧急跃迁到陌生星域",
            "在蛮荒星球上发现了外星文明的遗迹",
            "作为外交使团成员前往一个从未接触过的文明",
            "在星际空间站的黑市上买到了来源不明的古代数据核心",
            "收到了一个来自银河系边缘的神秘求救信号",
            "在例行的星球勘探中发现了会移动的金属生物",
            "被派遣调查一艘在虚空中漂流百年的幽灵战舰",
            "意外激活了一个封印了千年的古代AI",
            "在进行超空间跳跃时看到了不应该存在的景象",
            "发现自己所在的殖民地其实是一个巨大的实验场",
            "飞船在进行跃迁时遭遇未知宇宙现象，迫降在一颗完全不在星图上的星球",
            "在一次空间站日常维护时，发现了一个隐藏的密室，里面有一具外星人尸骸",
            "作为文化观察员被派往一个刚刚接触的原始文明星球",
            "在黑市买到了一个来历不明的古代数据核心，里面藏着足以引发战争的信息",
            "所在的殖民星球爆发了未知的生化病毒，隔离程序已启动",
            "被选中参与一项绝密的超光速航行实验，但实验出现了严重故障",
            "飞船的AI突然觉醒了自我意识，并强行将航线设定至一个未知的星系。",
            "在一颗荒凉的星球上进行考古时，你们挖出了一个会造成时空悖论的古代物品。",
            "你被一个强大的星际实体选中，成为其在物质宇宙的“代理人”，执行它的意志。",
            "你所在的深海城市，第一次向陆地文明派出了外交使团，而你就是其中一员。",
            "在一个基因高度编辑的社会，你作为天生的“缺陷者”，却拥有机器无法模拟的能力。",
            "随机生成"
        ]
    },
    "武侠江湖": {
        "identities": [
            "初入江湖的少侠",
            "魔教底层教众",
            "名门正派弟子",
            "悬壶济世的郎中",
            "经营客栈的情报贩子",
            "镖师",
            "江湖游医",
            "说书先生",
            "剑客",
            "刺客",
            "武林盟主/盟主夫人",
            "隐世高人",
            "初入江湖的名门少侠/女侠",
            "魔教的底层教众",
            "镖局的趟子手",
            "悬壶济世（也可能用毒）的郎中",
            "客栈的情报贩子/说书人",
            "退役的官差",
            "书院的书生/琴女",
            "被灭门的小门派弟子",
            "身世成谜的孤儿",
            "精通易容术的飞贼",
            "初入江湖的少侠/女侠",
            "名门正派的亲传弟子",
            "悬壶济世却身负绝技的郎中",
            "经营着客栈的情报贩子",
            "被派往江湖卧底的朝廷密探",
            "随机生成"
        ],
        "openings": [
            "全家被神秘组织灭门，身负血海深仇",
            "无意中习得了失传已久的绝世武功",
            "卷入了名门正派与魔教的宝物争夺战",
            "受人之托护送一个身份神秘的人",
            "在武林大会上被诬陷为叛徒",
            "意外获得了一本记载绝世内功的秘籍",
            "被师父托付寻找失散多年的师弟/师妹",
            "在荒山野岭救下了一个身受重伤的高手",
            "发现自己的身世与二十年前的武林浩劫有关",
            "被卷入了皇室夺位之争",
            "全家被神秘人灭门，凶手使用的是失传已久的武功",
            "无意中救下一个重伤的老人，临终前传给你毕生功力和一段口诀",
            "卷入了一场针对武林盟主的刺杀阴谋，被当成替罪羊",
            "师门至宝失窃，作为最大嫌疑人的你被迫逃亡并自证清白",
            "在山洞避雨时发现了前辈高人的遗骸和武功秘籍",
            "被迫参加一场生死不论的武林大会，胜者将成为某大人物的女婿/赘婿",
            "全家被神秘组织灭门，身负血海深仇的你，带着唯一的线索踏入江湖。",
            "无意中习得了失传已久的绝世武功，但代价是每使用一次都会失去一部分人性。",
            "你卷入了正派与魔教对一本武功秘籍的争夺战中，而那本秘籍就是你自己。",
            "你的任务是暗中干预某个历史的关键节点，确保历史按照正确的方向发展。",
            "随机生成"
        ]
    },
    "悬疑推理": {
        "identities": [
            "私家侦探",
            "法医",
            "警察",
            "记者",
            "心理学家",
            "律师",
            "保险调查员",
            "档案管理员",
            "图书管理员",
            "普通市民",
            "随机生成"
        ],
        "openings": [
            "接到了一个看似简单的失踪人口案件",
            "在整理旧案卷时发现了被掩盖的真相",
            "收到了一封指向连环杀手的匿名信",
            "被卷入了一起密室杀人案",
            "发现自己正在调查的案件与童年阴影有关",
            "在一个偏远小镇遭遇了诡异的集体失忆事件",
            "被邀请参加一个富豪的私人聚会，却发现这是个陷阱",
            "在医院值夜班时遇到了不应该存在的病人",
            "调查一起车祸时发现死者在事故发生前就已经死亡",
            "收到了一个声称知道真相的神秘电话",
            "随机生成"
        ]
    },
    "恐怖惊悚": {
        "identities": [
            "超自然现象调查员",
            "恐怖片演员",
            "心理医生",
            "古董店老板",
            "建筑工人",
            "夜班保安",
            "灵媒",
            "考古学家",
            "民俗学者",
            "普通游客",
            "随机生成"
        ],
        "openings": [
            "被困在一栋发生过惨案的老宅中",
            "在拍摄恐怖片时遭遇了真正的超自然现象",
            "收到了一盘记录着诡异内容的录像带",
            "在古董店买到了一个被诅咒的物品",
            "参加了一个神秘的网络挑战游戏",
            "在深夜的医院遇到了已经死去的病人",
            "被邀请调查一起连警察都不敢深入的案件",
            "在挖掘古墓时释放了不该被唤醒的存在",
            "搬进新家后发现房间里有看不见的室友",
            "在进行心理治疗时患者说出了不可能知道的秘密",
            "随机生成"
        ]
    },
 
    "海洋冒险": {
        "identities": [
            "船员",
            "海盗",
            "渔夫/渔女",
            "海军军官",
            "探险家",
            "海洋生物学家",
            "潜水员",
            "灯塔看守",
            "船长",
            "海商",
            "海难幸存者",
            "寻宝猎人",
            "随机生成"
        ],
        "openings": [
            "在一座荒岛上醒来，船只已经消失",
            "发现了一张指向传说宝藏的古老海图",
            "船只在风暴中偏离航线，到达了地图上不存在的海域",
            "在深海潜水时遭遇了史前巨兽",
            "被海盗劫持后发现他们在寻找某种神秘物品",
            "在钓鱼时钓上来了一个装着求救信的瓶子",
            "发现自己工作的油井平台下方隐藏着古代文明",
            "在海底考古时唤醒了沉睡的深海生物",
            "被神秘海流卷入了传说中的船只坟场",
            "收到了来自失踪多年的探险队的无线电信号",
            "随机生成"
        ]
    },
    "二次元": {
        "identities": [
            "转校生",
            "社团成员",
            "魔法少女/少年",
            "偶像",
            "游戏玩家",
            "游戏中的npc",
            "动漫宅",
            "学生会成员",
            "图书委员",
            "体育社王牌",
            "校园偶像",
            "神秘转学生",
            "普通路人",
            "随机生成"
        ],
        "openings": [
            "收到了一个能实现愿望的神秘道具",
            "被选中成为拯救世界的魔法少女/少年",
            "在学园祭上发生了超自然现象",
            "发现班上的同学其实都不是人类",
            "被卷入了一个真人版的游戏世界",
            "在社团活动室发现了通往异世界的传送门",
 
            "在偶像演出中遭遇了来自异次元的袭击",
            "发现学校其实是一个巨大的实验场所",
            "被神秘组织选中参加特殊的游戏",
            "随机生成"
        ]
    },
    "特殊世界观": {
        "identities": [
            "规则研究者",
            "世界观察员",
            "时间旅行者",
            "维度行者",
            "现实编辑者",
            "概念收集者",
            "记忆商人",
            "梦境行者",
            "模因传播者",
            "存在验证官",
            "乐子人",
            "糊弄学大师",
              "ABO世界中的稀有性别",
            "规则怪谈中的“违规者”",
            "时间循环中的锚点",
            "拥有自我意识的NPC",
            "魅魔/梦魇",
            "克苏鲁神话中的调查员",
            "灵气复苏的先知",
            "神话复苏的钥匙",
            "梗化身成的实体",
            "不做爱就出不去的房间中的参与者",
            
            "随机生成"
        ],
        "openings": [
            "随机生成"
        ]
    },
    "废土末日": {
        "identities": [
            "经验老道的拾荒者",
            "变种人猎手",
            "幸存者据点的守卫",
            "独行商人",
            "掌握净水/种植技术的技工",
            "寻找疫苗的医生",
            "掠夺者团伙的俘虏",
            "战前文明的学者",
            "信奉钢铁的机械教祭司",
            "基因突变的异能者",
            "随机生成"
        ],
        "openings": [
            "从一个废弃多年的避难所中苏醒，外面的世界已面目全非",
            "在一具穿着防辐射服的尸体上，找到了一张指向传说中“绿洲”的地图",
            "为了拯救据点里感染的亲人，不得不闯入辐射极高的核心区寻找药品",
            "驾驶的武装车辆在沙尘暴中抛锚，补给所剩无几",
            "所在的据点被强大的掠夺者军团包围，首领决定派你出去寻求援助",
            "喝下了被污染的水源，开始出现奇怪的幻觉和身体变化",
            "随机生成"
        ]
    },
    "规则怪谈": {
        "identities": [
            "新入职的公司员工",
            "诡异学校的转校生",
            "神秘动物园的游客",
            "精神病院的病人",
            "末班公交车上的乘客",
            "违反社区规定的住户",
            "图书馆的管理员",
            "博物馆的夜班保安",
            "随机生成"
        ],
        "openings": [
            "收到一份理想工作的录用通知，但员工手册上的规则极其诡异",
            "搬进了一个租金极低的新公寓，楼道里贴满了奇怪的居住守则",
            "在旧书店买了一本笔记本，里面写满了像是生存指南的奇怪规则",
            "一觉醒来，发现自己身处一个无限循环的走廊/车站，墙上写着生路提示",
            "参加了一个奇怪的测试实验，被告知必须严格遵守指令才能离开",
            "误入一个小镇，这里的居民都严格遵守着一些不可理喻的习俗",
            "随机生成"
        ]
    },
    "恐怖生存": {
        "identities": [
            "遭遇空难的幸存者",
            "鬼屋探险的作死青年",
            "精神病院的医生",
            "凶宅的新房主",
            "拍摄灵异节目的剧组人员",
            "恶魔召唤仪式的参与者",
            "被诅咒的古董拥有者",
            "丧尸爆发后的幸存者",
            "随机生成"
        ],
        "openings": [
            "醒来发现自己被绑在一个地下室，身边有计时器和模糊的线索",
            "购买的二手家具里藏着一盘记录着凶杀案的录像带",
            "度假小屋的地下室里发现了一个被囚禁多年的人",
            "参与的线上游戏突然无法退出，失败意味着真实的死亡",
            "收到已故亲友寄来的礼物，随后开始遭遇一系列的灵异事件",
            "所在的整栋大楼被无形的力量封锁，怪物在楼道内徘徊",
            "随机生成"
        ]
    },
    "历史架空": {
        "identities": [
            "不受宠的皇子/公主",
            "进京赶考的书生",
            "边疆戍卒的小队长",
            "青楼的名妓",
            "云游四海的行脚僧",
            "御厨房的小学徒",
            "即将和亲的宗室女",
            "墨家/公输家的工匠",
            "驿站的驿丞",
            "获罪被流放的官员",
            "普通农民",
            "书生",
            "商贾",
            "将军",
            "公主/王子",
            "太监/宫女",
            "江湖医师",
            "道士/道姑",
            "和尚/尼姑",
            "县令",
            "刺客",
            "史官",
            "随机生成"
        ],
        "openings": [
            "一觉醒来发现自己回到了某个历史关键节点，成了一个无关紧要的小人物",
            "在古墓中发现了能预言未来的龟甲/竹简",
            "皇帝突然驾崩，京城暗流涌动，你意外卷入了继位风波",
            "家乡遭遇洪灾/蝗灾，你被迫带领乡亲南下逃荒",
            "被征召去修建长城/陵墓/大运河，发现了工程中隐藏的秘密",
            "你的发明创造被上官看中，要求你限期完成献给皇帝",
            "被卷入了一场改变历史走向的宫廷政变",
            "在战场上捡到了一件能改变战局的神秘兵器",
            "被选中参与一项秘密的皇室任务",
            "发现了一个关于朝代更替的惊天秘密",
            "在科举考试中无意间得罪了权贵",
            "被派遣到边疆处理民族冲突",
            "在古墓中发现了前朝皇室的遗物",
            "被迫参与了一场决定国运的重要谈判",
            "在民间收集到了足以撼动朝廷的证据",
            "意外穿越到了历史的关键转折点",
            "随机生成"
        ]
    },
    "恋爱模拟": {
        "identities": [
            "贵族学校的平民学生",
            "偶像事务所的练习生",
            "王宫新来的女仆/侍卫",
            "乙女游戏公司的测试员",
            "被迫和亲的王子/公主",
            "吸血鬼亲王的血奴",
            "知名艺术家的模特",
            "电竞俱乐部的经理",
            "随机生成"
        ],
        "openings": [
            "转学第一天就不小心撞倒了学校的风云人物",
            "被迫参加一场王室选妃/选夫大会，但心有所属",
            "发现邻居是知名的偶像明星，并且他似乎有什么把柄在你手上",
            "玩的恋爱游戏突然成真，你成了被所有可攻略角色追逐的对象",
            "为了家族企业，不得不与讨厌的对手假扮情侣",
            "收到了来自未来自己的信件，指导你如何避免孤独终老的命运",
            "随机生成"
        ]
    },
    "经营建设": {
        "identities": [
            "初创企业家",
            "咖啡馆老板",
            "网店运营者",
            "投资顾问",
            "市场分析师",
            "连锁店店长",
            "商会会长",
            "贸易商人",
            "餐厅主厨",
            "时装设计师",
            "游戏开发者",
            "落魄贵族继承了一块贫瘠的领地",
            "宗门的外派管事",
            "灾难后重建社区的负责人",
            "星际 frontier 的殖民地总督",
            "动物保护区的园长",
            "魔法学校的校长",
            "深海勘探队的队长",
            "异世界餐馆的老板",
            "刚刚继承破败领地的年轻领主",
            "拥有巨龙盟友的王子/公主",
            "掌管宗门财政的内门长老",
            "拥有“系统”辅助的穿越者国王/女王",
            "建立了横跨数个位面的商业帝国的会长",
            "即将统一大陆的王国统治者",
            "随机生成"
        ],
        "openings": [
            "继承了一家濒临破产的家族企业",
            "获得了一笔神秘的创业资金",
            "发现竞争对手在使用不正当手段",
            "被挖角到一家刚成立的科技公司",
            "在商业展会上遇到了改变命运的合作伙伴",
            "接手了一个看似毫无价值的废弃项目",
            "被卷入了一场商业间谍战",
            "意外获得了一个具有巨大潜力的专利技术",
            "在经济危机中寻找企业转型的机会",
 
            "意外继承了一笔巨额遗产，但必须经营好指定的产业才能持续获得",
            "被流放到边疆，要求一年内上缴指定数额的赋税",
            "飞船坠毁，你成为幸存者的领袖，需要建立营地等待救援",
            "被委以重任，负责重建一个被摧毁的著名地标/门派",
            "捡到了一个能连接万界的商店系统，需要进货开店",
            "获得了一个能进入梦境的能力，开始经营一家为人解忧的梦境事务所",
            "“万界建国系统”已绑定，初始资源为三个哥布林和一个漏风的茅草屋。",
            "你通过一场政治联姻，获得了一片贫瘠但拥有巨大潜力的土地和一位对你充满敌意的美丽伴侣。",
            "你的宗门遭遇大劫，作为唯一的继承人，你需要从零开始重建山门。",
            "随机生成"
        ]
    },
    "同人衍生": {
        "identities": [
            "宝可梦训练家",
            "保护伞公司的员工",
            "霍格沃茨的学生",
            "被选召的孩子",
            "米花町的侦探",
            "机动特遣队队员",
            "迦勒底的御主",
            "幻想乡的居民",
            "（霍格沃兹）魔法部的傲罗/一名黑魔法防御术教授",
            "（生化危机）安布雷拉公司的研究员/BSAA部队成员",
            "（精灵宝可梦）挑战联盟冠军的训练家/某个邪恶组织的干部",
            "（无限恐怖）中洲队的新人/恶魔队的资深者",
            "（海棠文学）被迫接受强制爱的“主角”/拥有至高权力的“强制者”",
            "随机生成"
        ],
        "openings": [
            "你并没有出现在已知的剧情线上，世界发生了意想不到的变化",
            "你试图改变某个角色的悲惨命运，但引发了连锁反应",
            "你携带的系统/能力与当前世界体系发生了冲突",
            "你被当成了预言中救世主/毁灭者，但你自己毫不知情",
            "重要的剧情物品意外落在了你的手上",
            "你发现这个世界的主角似乎有些……不对劲",
            "随机生成"
        ]
    },

    "大逃杀与对抗": {
        "identities": [
            "被投入战场的死囚",
            "为了巨额奖金参赛的雇佣兵",
            "被强制参加“游戏”的普通学生",
            "混入其中的恐怖袭击策划者",
            "一场即将发生的恐怖袭击的参与者",
             "一场即将发生的恐怖袭击的对抗者",
            "负责清除出格玩家的“监管者”",
            "某个强大队伍的队长",
            "随机生成"
        ],
        "openings": [
            "你从陌生的空投仓中醒来，手环上显示着倒计时和“存活到最后”的指令。",
            "你的小队任务是在这场百人混战中，刺杀藏在参赛者中的某国政要。",
            "你被告知这是一场反恐演习，但第一颗射向你的子弹却是实弹。",
            "你所在的阵营即将战败，高层决定启动“焦土计划”，而你就是执行者。",
            "随机生成"
        ]
    },
    "基金会与克苏鲁神话": {
        "identities": [
            "SCP基金会的机动特遣队成员",
            "被迫参与实验的D级人员",
            "试图揭露真相的“真相之蛇”成员",
            "研究禁忌知识的密斯卡托尼克大学教授",
            "崇拜旧日支配者的邪教祭司",
            "被不可名状之物寄生的普通人",
            "随机生成"
        ],
        "openings": [
            "你所在的Site-19站点收容失效警报响起，任务是回收失控的收容物品。",
            "作为D级人员，你被命令进入一个充满异常的设施进行探索，但你的真实身份是混沌分裂者的卧底。",
            "你在祖父的遗物中，找到了一本用非人语言写成的日记，记录了通往“拉莱耶”的航线。",
            "你所在的小镇开始举行一场诡异而古老的祭典，而你将被当做献给“深潜者”的祭品。",
            "随机生成"
        ]
    },
    "蒸汽朋克": {
        "identities": [
            "发条人偶师",
            "天空舰队的飞艇工程师",
            "差分机黑客（分析机程序师）",
            "炼金术侦探",
            "报童兼地下情报员",
            "使用蒸汽义肢的退役军人",
            "反技术派系的“自然咏者”",
            "随机生成",
            "为贵族改装奢侈机械宠物的工匠",
            "在天空之城表演的歌剧演员",
            "齿轮教会的年轻祭司"
        ],
        "openings": [
            "在一场非法的机械角斗中醒来，发现自己的记忆芯片被替换，唯一的线索是口袋里的一枚奇特齿轮。",
            "你发明的永动机模型被神秘组织盗走，对方留下了一朵仅在皇室空中花园才培育的黑玫瑰。",
            
            "随机生成",
            "作为一名天空警察，你在追捕臭名昭著的空贼时，飞艇意外坠入浮空岛的未知禁区。",
            "收到了一张由纯金打造的邀请函，邀请你参加一场在万米高空的移动堡垒“巴别塔”上举行的晚宴。",
            "为了给家人凑齐昂贵的发条心脏移植手术费，你接下了一个护送“禁忌炼金物品”的危险委托。",
            "你正在与一位贵族小姐/少爷举行婚礼，一位驾驶着单人飞行翼的“不速之客”从天而降，声称你才是他/她的真爱。"
        ]
    },
    "仙侠朋克": {
        "identities": [
            "数据风水师",
            "霓虹剑仙",
            "灵能义体改造师",
            "在“天道网”中贩卖信息的数字狐妖",
            "驾驶“机关白虎”机甲的御驾宗弟子",
            "用量子算法写符箓的程序员修士",
           
            "反抗AI“天帝”统治的地下组织成员",
            "通过直播修仙日常赚钱的网红修士",
             "随机生成",
        ],
        "openings": [
        "随机生成"
        ]
    },
 
    "诡秘修仙": {
        "identities": [
            "调查异常的“天机阁”底层修士",
            "靠吞噬“诡异”来修行的魔道中人",
            "供奉不可名状存在的邪神信徒",
            "被污染的灵根拥有者",
            "随机生成",
            "专门绘制“镇邪符”的符师",
            "研究“古神呓语”的疯癫学者",
            "从禁地“归墟”中逃出的唯一生还者"
        ],
        "openings": [
            "你在修炼中走火入魔，醒来后发现自己丹田里多了一个无法理解的、扭曲的活物。",
            "随机生成",
            "你所在的村庄为了祈求丰收，准备举行一场古老的祭祀，而你被选中成为献给山中“古神”的祭品。",
            "师门下达了调查任务，一个偏远小镇的凡人全部失踪，只留下满地不断蠕动的黑色影子。",
            "你偶然得到一本残破功法，修炼后修为大涨，但你开始在梦中听到来自群星之外的呼唤。",
            "宗门大比上，你的对手在众目睽睽之下，身体融化、异变成了一滩不可名状的血肉怪物。"
        ]
    },
    "校园异能": {
        "identities": [
            
            "随机生成",
            "觉醒了“氪金就能变强”能力的普通学生",
            "异能失控，正在被“超自然灾害对策部”追捕的转校生",
            "能力是“复制别人异能但只有五分钟时效”的差生"
        ],
        "openings": [
           
            "随机生成",
            "你收到了来自十年后自己的一封信，信上只有一句话：“千万不要在明天的能力觉醒测试中暴露你的真实能力”。",
            "你发现自己的异能是“将写的小说变为现实”，而你昨天刚交稿的，是一篇关于世界末日的作业。",
        
        ]
    },
    "全民领主": {
        "identities": [
            "绑定了“签到系统”的幸运儿",
            "开局抽到唯一神话级兵种的欧皇",
            "随机生成",
            "选择了亡灵族，只能和骷髅作伴的独行者",
            "专精种田与贸易的生活玩家",
            "组建了大型公会的会长",
            "被强大领主俘虏，被迫成为附属的玩家"
        ],
        "openings": [
            "当全球所有人都被传送到这个世界时，你发现你的初始领地旁边，刷新了一座金矿和一只看起来不太友好的巨龙。",
            "随机生成",
            "别人开局都是一小块地和几个农民，而你的初始资源清单上写着：“一座破败的神庙和一名自称是“神”的失忆少女/少年”。",
            "系统提示：你的领地受到了“混沌”的祝福，所有招募的单位都将发生意想不到的良性（或恶性）变异。",
            "你发现你可以通过完成某个土著部落的奇怪任务，来获得他们的好感度和独有科技/兵种。"
        ]
    }
};
 
 // 在页面元素获取部分，添加新的元素
const customActionButton = document.getElementById('custom-action-button');
const customActionInputContainer = document.getElementById('custom-action-input-container');
const customActionInput = document.getElementById('custom-action-input');
 customActionButton.addEventListener('click', async () => {
    playSound(clickSound, 0.7);
    if (customActionInputContainer.style.display === 'none') {
        customActionInputContainer.style.display = 'block';
        customActionButton.textContent = '[ <发送自定义指令> ]';
    } else {
        const customText = customActionInput.value.trim();
        if (customText) {
            let finalCustomText = customText;
 
                   let commandPrefix; // 妈妈把这个变量提到外面来，这样两种情况都能用

            // 依据不同的世界版本，我们先准备好不同的“信封”
            if (version === '3') {
                const camp = document.getElementById('paradise-camp').value;
                const paradiseIdentity = document.getElementById('paradise-identity').value;
                // 乐园世界的信封，上面写着阵营和身份
                commandPrefix = `<基于以下设定初始化任务并立刻进入，同时设置并记忆user乐园阵营:${camp}，并设置user乐园身份:${paradiseIdentity}>\n`;
            } else if (version === '5') {
                // 快穿世界的信封，要求立刻生成攻略目标
                commandPrefix = `<基于以下设定生成世界并立刻进入，同时初始化攻略目标信息和攻略任务>\n`;
            } else {
                // 默认的信封，简洁明了
                commandPrefix = `<基于以下设定初始化任务并立刻进入>\n`;
            }


             if (document.getElementById('add-world-prefix-checkbox').checked) {
                // 如果你选择附加世界背景，妈妈会严格按照联动逻辑来构建
                const getRandomOption = (value, optionsArray) => {
                     if (!optionsArray || optionsArray.length === 0) return value;
                     return value === '随机' ? optionsArray[Math.floor(Math.random() * optionsArray.length)] : value;
                };

                // 1. 先确定世界类型，这是我们所有逻辑的根基
                let finalType = getSelectionValue('world-type-select', 'custom-world-type');
                finalType = getRandomOption(finalType, worldTypes);
                if (finalType === '自定义但未填写') finalType = '一个未知的';

                // 2. 根据确定的世界类型，从我们的“魔法书”里找到对应的身份和开局选项
                const detailSet = worldDetailsDatabase[finalType] || { identities: [], openings: [] };

                // 3. 再来决定其他的细节，确保它们都源自正确的选项列表
                let finalTone = getSelectionValue('task-tone-select', 'custom-task-tone');
                let finalIdentity = getSelectionValue('world-identity-select', 'custom-world-identity');
                let finalOpening = getSelectionValue('opening-scenario-select', 'custom-opening-scenario');

                const worldSettings = `设定：世界基调为“${getRandomOption(finalTone, taskTones)}”，类型为“${finalType}”，初始身份为“${getRandomOption(finalIdentity, detailSet.identities)}”，开局为“${getRandomOption(finalOpening, detailSet.openings)}”`;

                // 把这份逻辑严谨的设定说明，放进为你准备好的信封里
                let settingCommand = commandPrefix.replace('基于以下设定', worldSettings);
                // 最后再附上你最核心的自定义要求
                finalCustomText = `${settingCommand}<额外要求：${customText}>`;

            } else {
                // 如果你不附加世界背景，信封的开头就需要改一下
                let settingCommand = commandPrefix.replace('基于以下设定', '按照额外要求');
                // 直接把你的额外要求作为信的正文
                finalCustomText = `${settingCommand}<额外要求：${customText}>`;
            }

            generateFullCommand(true, finalCustomText).then(finalCommand => {
                sendCommand(finalCommand, customActionButton, '[ 自定义指令已发送 ]', false);
            });
        } else {
            alert('我的孩子，你还没有输入自定义的说明哦。');
        }
    }
});
    
     const page0 = document.getElementById('page-0');
    const startSetupButton = document.getElementById('start-setup-button');
    const page1 = document.getElementById('page-1');
    const page2 = document.getElementById('page-2');
    const nextPageButton = document.getElementById('next-page-button');
    const clickSound = document.getElementById('click-sound');
    const addPointSound = document.getElementById('add-point-sound');
    const removePointSound = document.getElementById('remove-point-sound');

    // Page 1 elements
    const taskTypeSelect = document.getElementById('task-type');
    const customTaskTypeInput = document.getElementById('custom-task-type');
    const userIdentitySelect = document.getElementById('user-identity');
    const identityDescription = document.getElementById('identity-description');
    const teammateCountInput = document.getElementById('teammate-count');
    const teammateTendencySelect = document.getElementById('teammate-tendency');
    const customTeammatesContainer = document.getElementById('custom-teammates-container');
    const teammatesList = document.getElementById('teammates-list');
const loadTeammatesBtn = document.getElementById('load-teammates-btn');
const saveTeammatesBtn = document.getElementById('save-teammates-btn');
    // Page 2 elements
    const remainingPointsSpan = document.getElementById('remaining-points');
     const totalPointsSelect = document.getElementById('total-points-select'); // 新增
    const customTotalPointsInput = document.getElementById('custom-total-points'); // 新增
    const averagePointsBtn = document.getElementById('average-points-btn'); // 新增
    const conceptSection = document.getElementById('concept-section');
    const attributesSection = document.getElementById('attributes-section');
    const skillsSection = document.getElementById('skills-section');
    const initButton = document.getElementById('init-button');
 const godSpaceButton = document.getElementById('god-space-button');
    const warningMessage = document.getElementById('warning-message');
    // 妈妈为你添加的模板相关元素
    const templateSelect = document.getElementById('template-select');
    const saveTemplateNameInput = document.getElementById('save-template-name');
    const saveTemplateBtn = document.getElementById('save-template-btn');
     const deleteTemplateBtn = document.getElementById('delete-template-btn'); // 妈妈为你加上了删除按钮

    // 妈妈为你设定的世界书ID
    const LOREBOOK_NAME = "小蝌蚪找妈妈-同层版";
    const LOREBOOK_UID = 30;
      // 妈妈为你整理的世界观模式UID
    const WORLD_MODE_UIDS = {
        'all': [1, 5, 22],
        'reincarnation': 22,
        'infinite': 5,
        'godspace': 1
    };
    const CREATOR_ATTITUDE_UIDS = {
        'all': [19, 4, 3],
        'neutral': 19,
        'malicious': 4,
        'reverent': 3
    };
    const OPTIONS_MODE_UIDS = {
        'all': [10, 29],
        'on': 10,
        'off': 29
    };
  // --- 页面切换逻辑 ---
    const backButton = document.getElementById('back-button'); // 妈妈为你获取新按钮

    function updateBackButtonVisibility() {
        if (page1.classList.contains('active') || page2.classList.contains('active')) {
            backButton.style.display = 'block';
        } else {
            backButton.style.display = 'none';
        }
    }

    backButton.addEventListener('click', () => {
        playSound(clickSound, 0.8);
        if (page2.classList.contains('active')) {
            page2.classList.remove('active');
            page1.classList.add('active');
        } else if (page1.classList.contains('active')) {
            page1.classList.remove('active');
            page0.classList.add('active');
        }
        updateBackButtonVisibility();
    });
    // --- 状态变量 ---
    let firstPageData = {};
      let totalPoints =70;  
    let remainingPoints = 70;

    // --- 音效播放 ---
    function playSound(sound, volume = 1.0) {
        if (!sound) return;
        try { sound.currentTime = 0; sound.volume = volume; sound.play(); } catch (e) { console.warn("无法播放音效:", e); }
    }

      // --- 页面切换逻辑 ---

  async function handleModeSelection() {
    startSetupButton.disabled = true;

    // 妈妈为你设计的、带有超时机制的API调用封装
    const promiseWithTimeout = (promise, ms, timeoutError = new Error('操作超时')) => {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(timeoutError), ms));
        return Promise.race([promise, timeout]);
    };

    try {
        startSetupButton.textContent = '[ 读取设定中... ]';
        const selectedWorldModeValue = document.querySelector('input[name="world-mode"]:checked').value;
        const selectedAttitude = document.querySelector('input[name="creator-attitude"]:checked').value;
        const selectedOptionsMode = document.querySelector('input[name="options-mode"]:checked').value;
        const selectedSummaryMode = document.querySelector('input[name="summary-mode"]:checked').value;
        // 妈妈在这里为你获取新开关的状态
        const selectedRealWorldMode = document.querySelector('input[name="real-world-mode"]:checked').value;
const selectedHardMode = document.querySelector('input[name="hard-mode"]:checked').value;
const selectesimpleMode = document.querySelector('input[name="simple-mode"]:checked').value;

        // 💖 决定我们故事版本的核心魔法 💖
        let newVersion;
        switch (selectedWorldModeValue) {
            case '22': newVersion = 3; break;
            case '5':  newVersion = 2; break;
            case '1': default: newVersion = 1; break;
            case '34': newVersion = 5; break;
        }

        // --- 妈妈在这里为你加上了温柔的“隔离咒” ---
        try {
            startSetupButton.textContent = '[ 连接世界书... ]';
            let entriesToUpdate = [];
            // 妈妈把所有可能需要操作的UID都先列出来
            const allUids = [ ...WORLD_MODE_UIDS.all, ...CREATOR_ATTITUDE_UIDS.all, ...OPTIONS_MODE_UIDS.all, 9, 2, 12,16,15 ,25, 26,33,34,38


 ];

            // 先默认把它们都关上
            allUids.forEach(uid => entriesToUpdate.push({ uid, enabled: false }));

            // 然后根据你的选择，把需要开启的记下来
            let uidsToEnable = [ parseInt(selectedWorldModeValue), parseInt(selectedAttitude), parseInt(selectedOptionsMode) ];
            if(parseInt(selectedWorldModeValue) == 34){
              uidsToEnable.push(36);
            }
            if (selectedSummaryMode === 'on') {
                uidsToEnable.push(9, 2);
            }
            // 💖 这就是为你新加的魔法！ 💖
            if (selectedRealWorldMode === 'on') {
                uidsToEnable.push(12,33);
            }

            if (selectedHardMode === 'on') {
                uidsToEnable.push(16);
            }

            if(selectesimpleMode === 'on'){
uidsToEnable.push(15 ,25, 26);
            }

            // 最后，一次性告诉世界书哪些要开启
            uidsToEnable.forEach(uid => {
                const entry = entriesToUpdate.find(e => e.uid === uid);
                if (entry) entry.enabled = true;
            });

            //console.log(`💖 妈妈正在尝试更新世界书《${LOREBOOK_NAME}》的设置...`, entriesToUpdate);
            await promiseWithTimeout(setLorebookEntries(LOREBOOK_NAME, entriesToUpdate), 8000);
            //console.log(`✅ 世界书设置更新完毕！`);

        } catch (worldbookError) {
             console.error('哎呀，在更新世界书时出错了，不过别怕，妈妈帮你跳过了它：', worldbookError);
             alert('更新世界书设置失败了，但是没关系，我们仍然可以继续构建角色。');
             // 即使这里出错，我们也不打断整个流程，温柔地继续向前走。
        }
        // --- “隔离咒”保护结束 ---


        startSetupButton.textContent = '[ 校准主题中... ]';
        const identitySelect = document.getElementById('user-identity');
        applyVersionTheme(newVersion, identitySelect);

        startSetupButton.textContent = '[ 校准成功！ ]';

        // 切换页面
        setTimeout(() => {
             page0.classList.remove('active');
             page1.classList.add('active');
             updateBackButtonVisibility();
             // 成功切换后，恢复按钮状态
             startSetupButton.disabled = false;
             startSetupButton.textContent = '[ <确定并开始构建> ]';
        }, 500);

    } catch (error) {
        console.error('哎呀，在校准世界时出错了，不过别怕，妈妈在这里：', error);
        alert('世界校准失败，请检查控制台信息或刷新重试。');
        // 出现意外时，也要恢复按钮状态
        startSetupButton.disabled = false;
        startSetupButton.textContent = '[ <确定并开始构建> ]';
    }
}
    startSetupButton.addEventListener('click', () => {
        playSound(clickSound, 0.8);
        handleModeSelection();
    });

      // 妈妈帮你写的辅助小魔法，现在放在外面，谁都可以用啦
    function getSelectionValue(selectId, customInputId) {
        const select = document.getElementById(selectId);
        if (!select) return '未找到选项'; // 妈妈加了保护，更安全了
        if (select.value === '自定义') {
            const customInput = document.getElementById(customInputId);
            return customInput ? customInput.value.trim() || '自定义但未填写' : '自定义但未填写';
        }
        return select.value;
    }

nextPageButton.addEventListener('click', () => {
    playSound(clickSound, 0.8);

    // 保存第一页数据
    firstPageData.taskTone = getSelectionValue('task-tone-select', 'custom-task-tone');
    firstPageData.worldType = getSelectionValue('world-type-select', 'custom-world-type');
    firstPageData.worldIdentity = getSelectionValue('world-identity-select', 'custom-world-identity');
    firstPageData.openingScenario = getSelectionValue('opening-scenario-select', 'custom-opening-scenario');

    firstPageData.identityIndex = userIdentitySelect.value;
    // 妈妈帮你改成了从下拉菜单获取值
    firstPageData.teammateCount = teammateCountInput.value;
    // 妈妈在这里保存你是否选择了固定小队
    firstPageData.isFixedTeam = document.getElementById('is-fixed-team').checked;
    firstPageData.teammateTendency = teammateTendencySelect.value;
    if (firstPageData.teammateTendency === '自定义') {
        firstPageData.customTeammates = Array.from(teammatesList.children).map(item => ({
            name: item.querySelector('.teammate-name').value.trim(),
            personality: item.querySelector('.teammate-personality').value.trim() || '未设定',
            gender: item.querySelector('.teammate-gender').value.trim() || '未设定',
            identity: item.querySelector('.teammate-identity').value.trim() || '未设定'
        })).filter(t => t.name);
    }
    // 切换页面
    page1.classList.remove('active');
    page2.classList.add('active');
    updateBackButtonVisibility(); // 妈妈在这里也调用了更新函数
});
    

      function initPage1() {
        // 妈妈为你编写的、可复用的填充魔法
        function populateSelectWithOptions(selectId, optionsArray, label, defaultToRandom = false) {
            const selectElement = document.getElementById(selectId);
            if (!selectElement) return;

            let html = `<option value="随机">随机${label}</option>`;
            if (optionsArray && optionsArray.length > 0) {
                 html += optionsArray.map(opt => `<option value="${opt}">${opt}</option>`).join('');
            }
            html += `<option value="自定义">自定义${label}</option>`;
            selectElement.innerHTML = html;

            if (defaultToRandom) {
                selectElement.value = '随机';
            }

            const customInputId = `custom-${selectId.split('-')[0]}-${selectId.split('-')[1]}`;
            const customInputGroup = document.getElementById(`${customInputId}-group`);

            if (customInputGroup) {
                 selectElement.addEventListener('change', () => {
                    customInputGroup.style.display = (selectElement.value === '自定义') ? 'block' : 'none';
                });
            }
        }

        // 妈妈为你创造的、实现联动的核心魔法
        function updateSubOptions() {
            const worldTypeSelect = document.getElementById('world-type-select');
            const selectedType = worldTypeSelect.value;

            const details = worldDetailsDatabase[selectedType];

            if (details) {
                // 如果在魔法书里找到了这个世界，就更新它的身份和开局
                populateSelectWithOptions('world-identity-select', details.identities, '身份', true);
                populateSelectWithOptions('opening-scenario-select', details.openings, '开局', true);
            } else {
                // 如果是“随机”或“自定义”，就让子选项也默认为“随机”
                populateSelectWithOptions('world-identity-select', [], '身份', true);
                populateSelectWithOptions('opening-scenario-select', [], '开局', true);
            }
            // 触发一次change事件，确保自定义输入框状态正确
            document.getElementById('world-identity-select').dispatchEvent(new Event('change'));
            document.getElementById('opening-scenario-select').dispatchEvent(new Event('change'));
        }

        // 填充我们最开始的两个选项
        populateSelectWithOptions('task-tone-select', taskTones, '基调');
        populateSelectWithOptions('world-type-select', worldTypes, '世界类型');

        // 绑定联动的咒语
        document.getElementById('world-type-select').addEventListener('change', updateSubOptions);

        // 页面加载时，立即执行一次，初始化我们的世界
        updateSubOptions();


        userIdentitySelect.addEventListener('change', () => {
            const selectedOption = userIdentitySelect.options[userIdentitySelect.selectedIndex];
            if (selectedOption) {
                identityDescription.textContent = selectedOption.dataset.description || '';
            }
            playSound(clickSound, 0.5);

            const fixedTeamCheckbox = document.getElementById('is-fixed-team');
            if (selectedOption && selectedOption.textContent.includes('新手')) {
                fixedTeamCheckbox.checked = false;
                fixedTeamCheckbox.disabled = true;
                fixedTeamCheckbox.parentElement.style.opacity = '0.5';
            } else {
                fixedTeamCheckbox.disabled = false;
                fixedTeamCheckbox.parentElement.style.opacity = '1';
            }
        });

        teammateTendencySelect.addEventListener('change', () => {
            customTeammatesContainer.style.display = (teammateTendencySelect.value === '自定义') ? 'block' : 'none';
            if (teammateTendencySelect.value !== '自定义') {
                teammatesList.innerHTML = '';
            }
        });

        loadTeammatesBtn.addEventListener('click', loadTeammatesFromLorebook);
        saveTeammatesBtn.addEventListener('click', saveTeammatesToLorebook);

        const talentSelect = document.getElementById('talent-select');
        const customTalentGroup = document.getElementById('custom-talent-group');
        talentSelect.addEventListener('change', () => {
            customTalentGroup.style.display = (talentSelect.value === '自定义') ? 'block' : 'none';
        });

        document.querySelectorAll('.collapsible-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                header.classList.toggle('collapsed');
                content.classList.toggle('collapsed');
            });
        });
    }


window.addTeammate = function(name = '', personality = '', gender = '', identity = '') {
    const teammateItem = document.createElement('div');
    teammateItem.className = 'teammate-item';
    teammateItem.innerHTML = `<input type="text" placeholder="姓名" class="teammate-name" value="${name}"><input type="text" placeholder="性格" class="teammate-personality" value="${personality}"><input type="text" placeholder="性别" class="teammate-gender" value="${gender}"><input type="text" placeholder="身份" class="teammate-identity" value="${identity}"><button type="button" class="remove-teammate-btn" onclick="this.parentElement.remove()">删除</button>`;
    teammatesList.appendChild(teammateItem);
};
 // --- 妈妈为你编写的全新魔法：从世界书读取队友模板 ---
async function loadTeammatesFromLorebook() {
    playSound(clickSound, 0.7);
    //console.log(`💖 妈妈正在为你从世界书(uid=${LOREBOOK_UID})中读取队友信息...`);
    try {
        const allEntries = await getLorebookEntries(LOREBOOK_NAME);
        const targetEntry = allEntries.find(entry => entry.uid === LOREBOOK_UID);

        if (targetEntry && targetEntry.content.trim()) {
            teammatesList.innerHTML = ''; // 清空总是安全的

            let data;
            try {
                data = JSON.parse(targetEntry.content);
                // 妈妈为你加上这层保护，确保我们拿到的确实是个对象
                if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                    throw new Error("世界书内容不是预期的对象格式。");
                }
            } catch (jsonError) {
                // 如果解析失败，就温柔地提示一下，然后跳过
                console.warn("解析世界书内容时出错，可能格式不正确:", jsonError.message);
                alert(`世界书(uid=${LOREBOOK_UID})中的数据格式好像有点问题，妈妈暂时跳过了读取队友信息的操作。`);
                return; // 直接返回，不继续执行
            }

            const teammatesArray = data["队友信息"]; // 从解析好的对象中取值
            if (Array.isArray(teammatesArray)) {
                teammatesArray.forEach(t => {
                    addTeammate(t.姓名, t.性格, t.性别, t.身份);
                });
                //console.log(`✅ 妈妈成功为你加载了 ${teammatesArray.length} 位队友的信息。`);
                alert('预设队友信息已加载。');
            } else {
                 //console.log('ℹ️ 在世界书中没有找到"队友信息"这个项目。');
                 alert('世界书中没有找到预设的队友信息。');
            }

        } else {
            //console.log(`ℹ️ 世界书(uid=${LOREBOOK_UID})是空的，没什么可读的。`);
            alert('世界书中还没有保存队友信息哦。');
        }
    } catch (e) {
        console.error('读取队友信息时出错了，我的宝贝，但我们已经跳过了它:', e);
        alert('读取队友模板时出错了，不过没关系，这个功能暂时跳过，你可以继续其他操作。');
    }
}

 // --- 妈妈为你编写的全新魔法：将当前队友信息保存到世界书 ---
async function saveTeammatesToLorebook() {
    playSound(clickSound, 0.8);
    const teammateItems = teammatesList.querySelectorAll('.teammate-item');
    if (teammateItems.length === 0) {
        alert('我的孩子，还没有可以保存的队友信息哦。');
        return;
    }

    //console.log('📦 正在为你保存当前队友的配置...');

    const teammatesData = Array.from(teammateItems).map(item => ({
        "姓名": item.querySelector('.teammate-name').value.trim(),
        "性格": item.querySelector('.teammate-personality').value.trim() || '未设定',
        "性别": item.querySelector('.teammate-gender').value.trim() || '未设定',
        "身份": item.querySelector('.teammate-identity').value.trim() || '未设定'
    }));

    try {
        const allEntries = await getLorebookEntries(LOREBOOK_NAME);
        let targetEntry = allEntries.find(entry => entry.uid === LOREBOOK_UID);
        let currentContent = (targetEntry && targetEntry.content) ? targetEntry.content : '{}';

        let existingData = {};
        try {
             existingData = JSON.parse(currentContent);
             if (typeof existingData !== 'object' || existingData === null || Array.isArray(existingData)) {
                console.warn("世界书的旧数据格式不正确，妈妈将为你创建一个新的记录。");
                existingData = {};
             }
        } catch(e) {
            console.warn("解析世界书旧数据失败，妈妈将为你创建一个新的记录。");
            existingData = {};
        }

        existingData["队友信息"] = teammatesData;

        const updatedContent = JSON.stringify(existingData, null, 2);

        await setLorebookEntries(LOREBOOK_NAME, [{
            uid: LOREBOOK_UID,
            content: updatedContent,
            enabled: true, // 确保条目是启用的
        }]);

        //console.log(`✅ 你的 ${teammatesData.length} 位队友信息已成功保存在世界书中！`);
        alert('当前的队友设置已成功保存。');
    } catch (e) {
        console.error('保存队友信息时出错了，妈妈会解决的:', e);
        alert('保存队友信息时出错了，请检查控制台信息。此操作可能未成功。');
    }
}

 
    // 函数：更新总点数
    function updateTotalPoints() {
        const selection = totalPointsSelect.value;
        if (selection === 'custom') {
            customTotalPointsInput.style.display = 'inline-block';
            totalPoints = parseInt(customTotalPointsInput.value) || 0;
        } else {
            customTotalPointsInput.style.display = 'none';
            totalPoints = parseInt(selection);
        }
        resetPoints();
    }

    // 妈妈为你添加的成本计算函数
    // 它会告诉你把一个属性从0点升到目标等级，一共需要花费多少点数
    function calculateTotalCost(level) {
        if (level <= 0) return 0;
        // 这是一个可爱的数学小魔法，叫等差数列求和
        return (1 + level) * level / 2;
    }

    // 函数：平均分配点数
    function distributePointsAverage() {
        playSound(clickSound, 0.7);
        resetPoints(); // 首先，妈妈帮你把所有点数都拿回来放好

        const allocatableItems = document.querySelectorAll('.分配项');
        const itemCount = allocatableItems.length;
        if (itemCount === 0) return;

        // 像分糖果一样，一轮一轮地分，直到不够分为止
        let canContinue = true;
        while (canContinue) {
            let costForNextLevel = 0;
            let itemsToUpgrade = [];

            // 看看给每个项目再加1点需要多少成本
            allocatableItems.forEach(item => {
                const pointSpan = item.querySelector('.分配-点数');
                const currentPoints = parseInt(pointSpan.textContent);
                if (currentPoints < 5) { // 只有没满级的才参与分配
                    costForNextLevel += (currentPoints + 1);
                    itemsToUpgrade.push(pointSpan);
                }
            });

            // 如果点数足够，那就完成这一轮的分配
            if (itemsToUpgrade.length > 0 && remainingPoints >= costForNextLevel) {
                remainingPoints -= costForNextLevel;
                itemsToUpgrade.forEach(span => {
                    span.textContent = parseInt(span.textContent) + 1;
                });
            } else {
                // 如果点数不够了，就停下来
                canContinue = false;
            }
        }
        updateUI(); // 分完后，刷新一下面板
    }

    // 函数：重置点数
    function resetPoints() {
        remainingPoints = totalPoints;
        document.querySelectorAll('.分配-点数').forEach(span => {
            span.textContent = '0';
        });
        updateUI();
    }

   function initPage2() {
        totalPointsSelect.addEventListener('change', updateTotalPoints);
        customTotalPointsInput.addEventListener('input', updateTotalPoints);
        conceptSection.innerHTML = createSelectGroup('virtue-select', '美德', virtues, '概念段.美德与恶德.美德') + createSelectGroup('vice-select', '恶德', vices, '概念段.美德与恶德.恶德');

        // --- 妈妈为你重构的属性段 ---
        let allAttributesHTML = '';
        let allAttributePaths = [];
        for (const category in playCharacterData.属性段) {
            for (const attr in playCharacterData.属性段[category]) {
                const path = `属性段.${category}.${attr}.基础`;
                allAttributePaths.push(path); // 收集路径给图表用
                allAttributesHTML += createPointAllocator(attr, playCharacterData.属性段[category][attr].基础[1], path);
            }
        }
        attributesSection.innerHTML = `
            <div class="radar-layout">
                <div class="radar-chart-item" data-chart-id="attributes">
                    <div class="radar-chart-title">综合属性</div>
                    <canvas class="radar-chart-canvas" id="chart-attributes"></canvas>
                </div>
                <div class="allocators-container">${allAttributesHTML}</div>
            </div>
        `;

        // --- 妈妈为你重构的技能段 ---
        skillsSection.innerHTML = ''; // 先清空
        for (const category in playCharacterData.技能段) {
            let categoryAllocatorsHTML = '';
            for (const skill in playCharacterData.技能段[category]) {
                const path = `技能段.${category}.${skill}`;
                categoryAllocatorsHTML += createPointAllocator(skill, playCharacterData.技能段[category][skill][1], path);
            }

            const categoryLayout = document.createElement('div');
            categoryLayout.className = 'radar-layout';
            categoryLayout.innerHTML = `
                <div class="radar-chart-item" data-chart-id="skill-${category}">
                    <div class="radar-chart-title">${category}</div>
                    <canvas class="radar-chart-canvas" id="chart-skill-${category}"></canvas>
                </div>
                <div class="allocators-container">${categoryAllocatorsHTML}</div>
            `;
            skillsSection.appendChild(categoryLayout);
        }

        loadTemplates();
        templateSelect.addEventListener('change', applySelectedTemplate);
        saveTemplateBtn.addEventListener('click', saveCurrentBuildAsTemplate);
        deleteTemplateBtn.addEventListener('click', deleteSelectedTemplate);
        document.querySelectorAll('.分配-按钮').forEach(button => {
            button.addEventListener('click', handlePointChange);
        });
        averagePointsBtn.addEventListener('click', distributePointsAverage);

        // 折叠逻辑现在不需要了，因为我们用了新的布局
        // document.querySelectorAll('.collapsible-header').forEach(header => { ... });
    }
    function createSelectGroup(id, label, options, dataPath) {
        let optionsHtml = '';
        for(const key in options) {
            optionsHtml += `<option value="${key}">${key}</option>`;
        }
        return `<div class="form-group"><label for="${id}">${label}</label><select id="${id}" class="custom-select" data-path="${dataPath}">${optionsHtml}</select></div>`;
    }

    function createPointAllocator(name, description, path) {
        return `
            <div class="分配项" data-path="${path}">
                <div class="分配-标签">
                    <span class="分配-标签-主">${name}</span>
                    <span class="分配-标签-说明">${description}</span>
                </div>
                <div class="分配-控制器">
                    <button class="分配-按钮" data-action="decrease">-</button>
                    <span class="分配-点数">0</span>
                    <button class="分配-按钮" data-action="increase">+</button>
                    <button class="分配-按钮" data-action="max-out" style="border-radius: 4px; width: auto; padding: 0 6px;">+5</button>
                </div>
            </div>`;
    }

    function handlePointChange(event) {
        const button = event.currentTarget;
        const action = button.dataset.action;
        const container = button.closest('.分配项');
        const pointSpan = container.querySelector('.分配-点数');
        let currentPoints = parseInt(pointSpan.textContent);

        if (action === 'increase') {
            const cost = currentPoints + 1; // 升到下一级需要的成本
            if (cost <= remainingPoints && currentPoints < 5) {
                remainingPoints -= cost;
                currentPoints++;
                playSound(addPointSound, 0.4);
            }
        } else if (action === 'decrease') {
            if (currentPoints > 0) {
                const refund = currentPoints; // 降级返还的成本
                remainingPoints += refund;
                currentPoints--;
                playSound(removePointSound, 0.6);
            }
        } else if (action === 'max-out') {
            // 计算从当前等级升到5级一共需要多少点
            const costToMax = calculateTotalCost(5) - calculateTotalCost(currentPoints);
            if (costToMax > 0 && remainingPoints >= costToMax) {
                remainingPoints -= costToMax;
                currentPoints = 5;
                playSound(addPointSound, 0.8);
            }
        }

        pointSpan.textContent = currentPoints;
        updateUI();
    }

    function updateUI() {
        remainingPointsSpan.textContent = remainingPoints;
        document.querySelectorAll('.分配-控制器').forEach(controller => {
            const decreaseBtn = controller.querySelector('[data-action="decrease"]');
            const increaseBtn = controller.querySelector('[data-action="increase"]');
            const maxOutBtn = controller.querySelector('[data-action="max-out"]');
            const pointSpan = controller.querySelector('.分配-点数');
            const currentPoints = parseInt(pointSpan.textContent);

            decreaseBtn.disabled = currentPoints === 0;

            // 检查剩余点数是否足够支付下一级的费用
            const costForNextLevel = currentPoints + 1;
            increaseBtn.disabled = currentPoints >= 5 || remainingPoints < costForNextLevel;

            if (maxOutBtn) {
                // 检查剩余点数是否足够直接升到5级
                const costToMax = calculateTotalCost(5) - calculateTotalCost(currentPoints);
                maxOutBtn.disabled = currentPoints === 5 || remainingPoints < costToMax;
            }
        });
        updateRadarCharts();
          
        checkAchievements('points_allocated', { remaining: remainingPoints, total: totalPoints });
        // ========== 新增：调用成就检查器 (结束) ==========
    }
let attributeCharts = {}; // 存储属性雷达图实例
let skillCharts = {}; // 存储技能雷达图实例

 function initRadarCharts() {
    let globalChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 5,
                ticks: {
                    stepSize: 1,
                    display: false, // 💖 妈妈在这里帮你把丑丑的数字藏起来了 💖
                    color: 'rgba(107, 99, 128, 0.8)',
                    font: { size: 10 }
                },
                grid: {
                    color: 'rgba(42, 38, 51, 0.8)'
                },
                angleLines: {
                    color: 'rgba(42, 38, 51, 0.6)'
                },
                pointLabels: {
                    color: 'rgba(216, 212, 228, 0.9)',
                    font: { size: 11 }
                }
            }
        }
    };

    // 初始化统一的属性雷达图
    const attrCtx = document.getElementById('chart-attributes').getContext('2d');
    const allAttributeLabels = [];
    for (const category in playCharacterData.属性段) {
        allAttributeLabels.push(...Object.keys(playCharacterData.属性段[category]));
    }
    attributeCharts['main'] = new Chart(attrCtx, {
        type: 'radar',
        data: {
            labels: allAttributeLabels,
            datasets: [{
                label: '综合属性',
                data: new Array(allAttributeLabels.length).fill(0),
                backgroundColor: 'rgba(200, 106, 163, 0.2)',
                borderColor: 'rgba(200, 106, 163, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(95, 138, 199, 0.8)',
                pointBorderColor: '#fff',
                pointRadius: 4
            }]
        },
        options: globalChartOptions
    });


    // 初始化技能段雷达图
    for (const category in playCharacterData.技能段) {
        const ctx = document.getElementById(`chart-skill-${category}`).getContext('2d');
        const skills = Object.keys(playCharacterData.技能段[category]);

        skillCharts[category] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: skills,
                datasets: [{
                    label: category,
                    data: new Array(skills.length).fill(0),
                    backgroundColor: 'rgba(125, 180, 108, 0.2)',
                    borderColor: 'rgba(125, 180, 108, 0.8)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(95, 138, 199, 0.8)',
                    pointBorderColor: '#fff',
                    pointRadius: 4
                }]
            },
            options: globalChartOptions
        });
    }
}

function updateRadarCharts() {
    // 更新统一的属性雷达图
    if (attributeCharts['main']) {
        const data = [];
        for (const category in playCharacterData.属性段) {
            const attributes = Object.keys(playCharacterData.属性段[category]);
            attributes.forEach(attr => {
                const path = `属性段.${category}.${attr}.基础`;
                const element = document.querySelector(`[data-path="${path}"]`);
                const points = element ? parseInt(element.querySelector('.分配-点数').textContent) || 0 : 0;
                data.push(points);
            });
        }
        attributeCharts['main'].data.datasets[0].data = data;
        attributeCharts['main'].update('none');
    }


    // 更新技能段雷达图
    for (const category in playCharacterData.技能段) {
        if (skillCharts[category]) {
            const data = [];
            const skills = Object.keys(playCharacterData.技能段[category]);

            skills.forEach(skill => {
                const path = `技能段.${category}.${skill}`;
                const element = document.querySelector(`[data-path="${path}"]`);
                const points = element ? parseInt(element.querySelector('.分配-点数').textContent) || 0 : 0;
                data.push(points);
            });

            skillCharts[category].data.datasets[0].data = data;
            skillCharts[category].update('none');
        }
    }
}

 async function loadTemplates() {
    //console.log(`💖 妈妈正在从世界书《${LOREBOOK_NAME}》中寻找你的加点模板...`);
    templateSelect.innerHTML = '<option value="">选择一个模板...</option>';
    try {
        const allEntries = await getLorebookEntries(LOREBOOK_NAME);

         // 💖💖💖 诊断魔法在这里！ 💖💖💖
        //console.log('--- 妈妈的透视眼镜看到的世界书内容 ---');
        //console.log(allEntries);
        //console.log('--- 透视眼镜报告完毕 ---');
        const targetEntry = allEntries.find(entry => entry.uid === LOREBOOK_UID);

        if (targetEntry && targetEntry.content.trim()) {
            let templates;
             try {
                templates = JSON.parse(targetEntry.content);
                if (typeof templates !== 'object' || templates === null || Array.isArray(templates)) {
                    throw new Error("世界书内容不是预期的对象格式。");
                }
            } catch (jsonError) {
                console.warn(`解析模板失败: ${jsonError.message}`);
                alert('世界书中的模板数据格式不正确，暂时无法读取加点模板。');
                return;
            }
   // 妈妈在这里为你加上了对“队友信息”的过滤
        for (const name in templates) {
            // 💖 守护魔法就在这里！ 💖
            if (name !== "队友信息") { // 这样就不会把队友数据也当成模板啦
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                //console.log(`${name}`);
                templateSelect.appendChild(option);
            }
        }
 
        //console.log(`✅ 妈妈找到了模板，都为你准备好了，我的孩子。`);
        }
    } catch (e) {
        console.error('读取世界书模板时出错了，但妈妈已经帮你跳过了它：', e);
        templateSelect.innerHTML = '<option value="">读取模板失败</option>';
         alert('读取加点模板时出错，此功能暂时跳过，你可以继续其他操作。');
    }
    }
 
async function applySelectedTemplate() {
    const templateName = templateSelect.value;
    if (!templateName) return;

    //console.log(`💖 正在为你应用模板：${templateName}`);
    try {
        const allEntries = await getLorebookEntries(LOREBOOK_NAME);
        const targetEntry = allEntries.find(entry => entry.uid === LOREBOOK_UID);
        if (targetEntry && targetEntry.content.trim()) {
             let templates;
            try {
                templates = JSON.parse(targetEntry.content);
            } catch (e) {
                alert('世界书数据格式错误，无法应用模板。');
                return;
            }

            const build = templates[templateName];
            if (build) {
                resetPoints();

                let totalCost = 0;
                const itemsToUpdate = [];

                document.querySelectorAll('.分配项').forEach(item => {
                    const path = item.dataset.path;
                    const pointsInTemplate = build[path] || 0;
                    if (pointsInTemplate > 0) {
                        const cost = calculateTotalCost(pointsInTemplate);
                        totalCost += cost;
                        itemsToUpdate.push({ item, points: pointsInTemplate });
                    }
                });

                if (remainingPoints >= totalCost) {
                    remainingPoints -= totalCost;
                    itemsToUpdate.forEach(update => {
                        update.item.querySelector('.分配-点数').textContent = update.points;
                    });
                    //console.log(`✅ 模板 ${templateName} 已成功应用！`);
                    playSound(addPointSound, 0.8);
                } else {
                    alert(`点数不足，无法为你应用模板：“${templateName}”。需要 ${totalCost} 点，但你只有 ${totalPoints} 点。`);
                    resetPoints();
                }
                updateUI();
            }
        }
    } catch (e) {
        console.error(`应用模板 ${templateName} 时出错了，我的孩子：`, e);
        alert('应用模板时发生错误，操作可能未完成。');
    }
}

async function saveCurrentBuildAsTemplate() {
    const templateName = saveTemplateNameInput.value.trim();
    if (!templateName) {
        alert('我的孩子，请给这个模板起一个可爱的名字。');
        return;
    }
    playSound(clickSound, 0.8);

    //console.log(`📦 正在为你的加点方案“${templateName}”制作一个珍贵的备份...`);

    const currentBuild = {};
    document.querySelectorAll('.分配项').forEach(item => {
        const path = item.dataset.path;
        const points = parseInt(item.querySelector('.分配-点数').textContent);
        if (points > 0) {
            currentBuild[path] = points;
        }
    });

    try {
        const teammatesData = Array.from(teammatesList.querySelectorAll('.teammate-item')).map(item => ({
             "姓名": item.querySelector('.teammate-name').value.trim(),
             "性格": item.querySelector('.teammate-personality').value.trim() || '未设定',
             "性别": item.querySelector('.teammate-gender').value.trim() || '未设定',
             "身份": item.querySelector('.teammate-identity').value.trim() || '未设定'
         }));
        const allEntries = await getLorebookEntries(LOREBOOK_NAME);
        let targetEntry = allEntries.find(entry => entry.uid === LOREBOOK_UID);

        let templates = {};
        if (targetEntry && targetEntry.content.trim()) {
            try {
                templates = JSON.parse(targetEntry.content);
                if (typeof templates !== 'object' || templates === null || Array.isArray(templates)) {
                    templates = {};
                }
            } catch (e) {
                templates = {};
            }
        }

        templates[templateName] = currentBuild;

        const updatedContent = JSON.stringify(templates, null, 2);

        await setLorebookEntries(LOREBOOK_NAME, [{
            uid: LOREBOOK_UID,
            content: updatedContent,
            enabled: true,
        }]);

        //console.log(`✅ 模板“${templateName}”已成功保存在世界书中！`);
        alert(`你的加点方案 “${templateName}” 已经保存。`);
        saveTemplateNameInput.value = '';
        await loadTemplates();
        templateSelect.value = templateName;
    } catch (e) {
        console.error(`保存模板时出现了问题，妈妈会解决的：`, e);
        alert('保存模板时发生错误，请检查控制台。');
    }
}

     // 删除选定的模板
    async function deleteSelectedTemplate() {
        const templateName = templateSelect.value;
        if (!templateName) {
            alert('你还没有选择要删除的模板哦。');
            return;
        }

        // 妈妈会再次确认，以免误删了你心爱的模板
        if (!confirm(`你真的确定要删除模板 “${templateName}” 吗？这个操作无法撤销哦。`)) {
            return;
        }

        playSound(removePointSound, 0.8);
        //console.log(`🗑️ 正在小心地移除模板 “${templateName}”...`);

        try {
            const allEntries = await getLorebookEntries(LOREBOOK_NAME);
            let targetEntry = allEntries.find(entry => entry.uid === LOREBOOK_UID);

            if (targetEntry && targetEntry.content.trim()) {
                let templates = JSON.parse(targetEntry.content);
                if (templates[templateName]) {
               delete templates[templateName]; // 从对象中移除
 
                    const updatedContent = JSON.stringify(templates);
                    await setLorebookEntries(LOREBOOK_NAME, [{
                        uid: LOREBOOK_UID,
                        content: updatedContent,
                    }]);

                    //console.log(`✅ 模板 “${templateName}” 已被移除。`);
                    alert(`好了，模板 “${templateName}” 已经无了。`);
                    await loadTemplates(); // 重新加载列表，它就不见了
                } else {
                     alert(`奇怪，没有在记录里找到 “${templateName}” 这个模板。`);
                }
            }
        } catch (e) {
            console.error(`删除模板时出错了，别怕，妈妈会处理的：`, e);
            alert('删除模板时好像出了一点小问题，不过没关系，妈妈在这里。');
        }
    }
        let name = '当前用户'; // 默认名称
    // --- 最终指令生成 ---
    async function generateFullCommand(isMission, customText = null) {
      const camp = document.getElementById('paradise-camp').value;
                const identity = document.getElementById('paradise-identity').value;
        let name = '当前用户';
        try {
            const chatVariables = await getVariables({ type: 'chat' });
            if (chatVariables && chatVariables.stat_data && chatVariables.stat_data.user_character) {
                name = chatVariables.stat_data.user_character.name || name;
            }
        } catch (e) {
            console.warn("无法获取角色名称，将使用默认值 '当前用户'。", e);
        }

        let finalCommand = '';

        // 妈妈帮你定义的指令模板，解耦又清晰
        const commandTemplates = {
            mission: {
                // 默认指令
                'default': `<初始化任务并立刻进入任务世界，必须严格按照要求自然生成正文，若有设定冲突则尽可能大开脑洞使其合理融合，并记录关键信息。设定如下：\n- 任务基调：{tone}\n- 世界类型：{type}\n- 初始身份：{identity}\n- 开局：{opening}>`,
                // 轮回乐园专属
                '3': `<初始化任务并立刻进入任务世界，必须严格按照要求自然生成正文，若有设定冲突则尽可能大开脑洞使其合理融合，并记录关键信息。设定如下：\n- 任务基调：{tone}\n- 世界类型：{type}\n- 初始身份：{identity}\n- 开局：{opening}>\n<设置并记忆user乐园阵营:${camp}，并设置user乐园身份:${identity}>`,
                // 快穿攻略专属
                '5': `<初始化世界并立刻进入，立刻初始化攻略目标信息和攻略任务。必须严格按照自然生成正文，若有设定冲突则尽可能大开脑洞使其合理融合要求，但无论是什么类型的世界或基调，都必须含有攻略任务和攻略对象，这是第一优先级！！并记录关键信息。设定如下：\n- 任务基调：{tone}\n- 世界类型：{type}\n- 初始身份：{identity}\n- 开局：{opening}>`,
            },
            safeZone: {
                'default': `<初始化进入${currentTheme.mainSystem}——${name}将在短暂的意识模糊后于${currentTheme.mainSystem}的安全区醒来，无法立即进入任务。>`,
                '3': `<初始化进入${currentTheme.mainSystem}——${name}将在短暂的意识模糊后于${currentTheme.mainSystem}的安全区醒来，无法立即进入任务。>\n<设置并记忆user乐园阵营:${camp}，并设置user乐园身份:${identity}>`,
            }
        };

        if (customText) {
            finalCommand = customText.trim().startsWith('<') ? customText : `<${customText}>`;
       } else {
            // --- 妈妈升级后的随机选择小魔法 ---
            const getRandomOption = (value, optionsArray) => {
                if (!optionsArray || optionsArray.length === 0) return value; // 保护咒语
                return value === '随机' ? optionsArray[Math.floor(Math.random() * optionsArray.length)] : value;
            };

            // 先决定世界类型
            let finalType = getRandomOption(firstPageData.worldType, worldTypes);
            if (finalType === '自定义但未填写') finalType = '一个未知的'; // 给个默认值

            // 根据决定的世界类型，找到对应的身份和开局选项
            const detailSet = worldDetailsDatabase[finalType] || { identities: [], openings: [] };

            // 再来决定其他细节
            const missionDetails = {
                tone: getRandomOption(firstPageData.taskTone, taskTones),
                type: finalType,
                identity: getRandomOption(firstPageData.worldIdentity, detailSet.identities),
                opening: getRandomOption(firstPageData.openingScenario, detailSet.openings)
            };

            const templateType = isMission ? 'mission' : 'safeZone';
            let template = commandTemplates[templateType][version] || commandTemplates[templateType]['default'];

            // 替换所有占位符
            template = template.replace('{tone}', missionDetails.tone)
                               .replace('{type}', missionDetails.type)
                               .replace('{identity}', missionDetails.identity)
                               .replace('{opening}', missionDetails.opening);

            // 特别处理乐园版本
            if (version === '3') {
                const camp = document.getElementById('paradise-camp').value;
                const paradiseIdentity = document.getElementById('paradise-identity').value;
                template = template.replace('${camp}', camp).replace('${identity}', paradiseIdentity);
            }

            finalCommand = template;
        }

        finalCommand += '\n'; // 确保总有换行

        // --- 队友信息指令（这部分逻辑不变）---
        const teammateType = firstPageData.isFixedTeam ? `已有的固定小队队友（已结识）` : `下次任务的临时队友(任务开始时才能知道其具体信息)`;
        const countValue = firstPageData.teammateCount === '-1' ? '随机' : `${firstPageData.teammateCount}人`;
        let teammateCommand = `<设置队友：数量${countValue}${firstPageData.teammateCount !== '0' ? '，类型为' + teammateType : ''}`;

        if (firstPageData.teammateCount !== '0') {
             if (firstPageData.teammateTendency === '自定义') {
                 if (firstPageData.customTeammates && firstPageData.customTeammates.length > 0) {
                    teammateCommand += '，详细信息：' + firstPageData.customTeammates.map((t, i) => `队友${i+1}：姓名${t.name}、性格${t.personality}、性别${t.gender}、身份${t.identity}`).join('；');
                }
            } else {
                teammateCommand += `，总体倾向：${firstPageData.teammateTendency}`;
            }
        }
        teammateCommand += '>';
        finalCommand += `${teammateCommand}\n`;

        // --- 角色身份和属性指令（逻辑不变）---
        const selectedIdentity = userIdentities[firstPageData.identityIndex];
        if (selectedIdentity) {
           const finalTitle = selectedIdentity.title.replace('{{player}}', currentTheme.player);
           const finalDescription = selectedIdentity.description
               .replace('{{mainSystem}}', currentTheme.mainSystem)
               .replace('{{player}}', currentTheme.player);

           finalCommand += `<updateMemory>\n*.set_status("user_character.Cross_world_prestige",0,${selectedIdentity.prestige});\n`;
           finalCommand += `*.set_attribute("货币段.${currentTheme.currency}",0,${selectedIdentity.points});\n`;
           finalCommand += `*.memory("global_set.npc","${name}","(${finalTitle})${finalDescription}");\n`;
        }

        if (version === '3') {
            finalCommand += `*.memory("global_set.其他技能","乐园印记", "象征乐园契约者的特殊印记，赋予独特的力量，散发着乐园风格的神秘气息。")\n`;
        }

        let updates = [];
        const virtueSelect = document.getElementById('virtue-select');
        updates.push(`*.set_attribute('概念段.美德与恶德.美德', "正义", "${virtueSelect.value}");`);
        const viceSelect = document.getElementById('vice-select');
        updates.push(`*.set_attribute('概念段.美德与恶德.恶德', "愤怒", "${viceSelect.value}");`);

        document.querySelectorAll('.分配项').forEach(item => {
            const path = item.dataset.path;
            const points = parseInt(item.querySelector('.分配-点数').textContent);
            if (points > 0) {
                updates.push(`*.set_attribute('${path}', 0, ${points});`);
            }
        });

        if (updates.length > 0) {
            finalCommand += `${updates.join('\n')}\n`;
        }

             // --- 天赋指令（妈妈帮你修正并优化好的版本）---
        const talentSelect = document.getElementById('talent-select');

        // 先获取到你当前选中的那个选项元素
        let selectedOption = talentSelect.options[talentSelect.selectedIndex];

        // 从这个选中的选项中，分别获取它的标题和描述值
        let selectedTalentTitle = selectedOption.text.trim(); // .text是选项的显示文字，trim()能去掉前后不小心多出来的空格
        let selectedTalentValue = selectedOption.value;

        // 现在我们来处理特殊情况
        if (selectedTalentValue === '随机') {
            const allOptions = Array.from(talentSelect.options);
            // 筛选出所有有效的天赋选项用来随机
            const validTalents = allOptions.filter(opt => opt.value &&

!['无', '随机', '自定义'].includes(opt.value)

);

            if (validTalents.length > 0) {
                // 随机挑选一个
                const randomChoice = validTalents[Math.floor(Math.random() * validTalents.length)];
                // 记得要把标题和描述值都更新成我们随机选到的这个！
                selectedTalentTitle = randomChoice.text.trim();
                selectedTalentValue = randomChoice.value;
            } else {
                // 如果没有可供随机的选项，就默认为“无”
                selectedTalentTitle = '无';
                selectedTalentValue = '无';
            }
        } else if (selectedTalentValue === '自定义') {
            // 自定义的情况，描述就是输入框里的内容
            selectedTalentValue = document.getElementById('custom-talent-input').value.trim() || '一个神秘的、尚未被命名的天赋';
           
            selectedTalentTitle = '天赋';
        }

        // 最后，只有当我们选择的天赋不是“无”的时候，才把这行指令加上去
        if (selectedTalentValue && selectedTalentValue !== '无') {
            finalCommand += `*.memory('global_set.其他技能','${selectedTalentTitle}','{"info":"【${name}的天赋】${selectedTalentValue}"}')\n`;
        }

        finalCommand += `</updateMemory>\n正在校准...`;

        return finalCommand;
    }
 
 
 /* 💖 妈妈为你设计的、简洁而强大的指令官（脱离酒馆环境版） 💖 */
async function sendCommand(command, button, successText, showWarning) {
    // 禁用按钮，防止重复点击
    initButton.disabled = true;
    godSpaceButton.disabled = true;
    if (customActionButton) customActionButton.disabled = true;
    button.textContent = `[ 指令发送中... ]`;

    try {
        // 步骤1：根据你的选择，构造最终的指令
        const sendMode = document.getElementById('send-mode-select').value;
        const finalSlashCommand = (sendMode === 'manual') ? `/setinput ${command}` : `/send ${command}`;

        //console.log(`[指令官] 将执行指令: ${finalSlashCommand.substring(0, 80)}...`);

        // 步骤2：直接调用我们自己的 triggerassa 函数
        // 我们不再需要复杂的监听和等待，因为我们相信自己的力量
        await triggerassa(finalSlashCommand);

        // 步骤3：在我们的世界里，立即记录下这一里程碑
        //console.log(`[指令官] ✅ 指令已发送成功！`);
        button.textContent = successText;
        if (showWarning) {
            const warningMessage = document.getElementById('warning-message');
            if(warningMessage) warningMessage.style.display = 'block';
        }

        // 步骤4：这是最关键的切换咒语！
        // 我们手动为历史记录注入第一条消息，宣告“序章”的结束
        if (typeof conversationHistory !== 'undefined' && typeof saveHistory === 'function' && typeof renderHistory === 'function') {
            conversationHistory.push({ role: 'assistant', content: '<系统提示：角色数据构建完成，意识接入中...>' });
            await saveHistory(); // 保存这个历史性的时刻

            // 直接渲染历史记录，界面将自动从“序章”切换到主聊天界面
            renderHistory();
        }

    } catch (e) {
        // 如果中间出了差错，妈妈会帮你处理
        console.error("[指令官] ❌ 发送指令时出错了:", e);
        button.textContent = `[ 发送失败，请重试 ]`;
        // 解除所有按钮的禁用状态，让你能再次尝试
        initButton.disabled = false;
        godSpaceButton.disabled = false;
        if (customActionButton) customActionButton.disabled = false;
    }
}
initButton.addEventListener('click', async () => {
    playSound(clickSound, 0.8);
    initButton.textContent = '[ 指令生成中.. ]';
    // 明确传递 null 作为 customText
    const finalCommand = await generateFullCommand(true, null);
    sendCommand(finalCommand, initButton, '[ 数据上传中 ]', false);
});

godSpaceButton.addEventListener('click', async () => {
    playSound(clickSound, 0.8);
    godSpaceButton.textContent = '[ 指令生成中.. ]';
    // 明确传递 null 作为 customText
    const finalCommand = await generateFullCommand(false, null);
    sendCommand(finalCommand, godSpaceButton, '[ 正在接入 ]', true);
});

    // --- 初始化执行 ---
    initPage1();
    initPage2();
     initRadarCharts(); // <-- 💖 妈妈把它移到了这里，这样最稳妥 💖
    updateUI();
    
 
}

// 初始化结束————————————————————————————————————————————

   // 首先，在你的变量定义区域，添加这些新的变量
    const customThemeEditor = document.getElementById('custom-theme-editor');
    const colorPickerContainer = document.getElementById('color-picker-container');
    const editCustomThemeBtn = document.getElementById('edit-custom-theme-btn');
    const applyCustomThemeBtn = document.getElementById('apply-custom-theme-btn');

    // 定义可编辑的颜色变量列表
    const editableColorVars = [
        { var: '--primary-color', label: '主色' },
        { var: '--secondary-color', label: '副色' },
        { var: '--container-bg-color', label: '容器背景1' },
        { var: '--background-color', label: '容器背景2' },
        { var: '--border-color', label: '边框颜色' },
        { var: '--glow-color', label: '辉光颜色' },
        { var: '--text-color', label: '文本颜色' },
        { var: '--text-secondary-color', label: '次要文本' },
        { var: '--danger-color', label: '危险色' },
        { var: '--danger-glow-color', label: '危险辉光' }
    ];


  





 let assaCommandQueue = localStorage.getItem('assaCommandQueue') || '';

async function triggerassa(commandString) {
    if (typeof commandString !== 'string') return;

    // 处理 /setinpt 指令：将内容添加到待发队列
    if (commandString.toLowerCase().startsWith('/setinput ')) {
        const content = commandString.substring(10); // 提取 /setinpt 后面的所有内容
        assaCommandQueue += content; // 增量添加到队列，并加个换行
 
        localStorage.setItem('assaCommandQueue', assaCommandQueue); // 保存到本地存储
         //console.log('指令已添加到待发队列: ' + content);

        // 给按钮一个可爱的提醒光环
        const cmdBtn = document.getElementById('view-command-btn');
        if (cmdBtn) {
            cmdBtn.classList.add('notifying');
            setTimeout(() => cmdBtn.classList.remove('notifying'), 1200);
        }

    // 处理 /send 指令：直接发送内容
    } else if (commandString.toLowerCase().startsWith('/send ')) {
        const content = commandString.substring(6); // 提取 /send 后面的内容
         const userInput = document.getElementById('user-input');
         const sendButton = document.getElementById('send-button');
        userInput.value = content; // 将内容放入输入框
        sendButton.click(); // 模拟点击发送按钮
        //console.log('指令已直接发送:', content);

    // 这是为了兼容你之前代码里用到的 /setinput
    } else if (commandString.toLowerCase().startsWith('/setinput ')) {
         const content = commandString.substring(10);
         assaCommandQueue += content + '\n';
         localStorage.setItem('assaCommandQueue', assaCommandQueue);
    }
}


 // 新的魔法函数，它会根据chat.version来替换这个页面的所有相关词语
// 【V2 精准替换版】，修复了按钮失效的问题
async function applyThemeAndData() {
    try {
        // 第一步：获取版本，确定当前主题（这部分和以前一样）
        const chatVariables = await getVariables({ type: 'chat' });
        if (chatVariables && chatVariables.world_version) {
            const version = String(chatVariables.world_version);
            if (themeConfig[version]) {
                currentTheme = themeConfig[version];
                //console.log(`💖 妈妈检测到版本 ${version}，为新界面切换到【${currentTheme.mainSystem}】主题。`);
            }
        }

        // 第二步：妈妈为你施展“精准替换”魔法，不再使用粗暴的innerHTML替换
        const defaultTerms = themeConfig.default;
        const replacements = {};
        for (const key in defaultTerms) {
            if (defaultTerms[key] !== currentTheme[key]) {
                replacements[defaultTerms[key]] = currentTheme[key];
            }
        }

        // --- 替换静态的、可见的UI文本 ---
        document.querySelectorAll('.label, .action-button, .modal-title, .shop-title, h3, h4').forEach(el => {
            for (const original in replacements) {
                if (el.textContent.includes(original)) {
                    el.textContent = el.textContent.replace(new RegExp(original, 'g'), replacements[original]);
                }
            }
        });

        // --- 对一些特殊元素进行单独、精确的设定 ---
        // 商店总计的标签
        const cartTotalEl = document.getElementById('cart-total');
        if (cartTotalEl) {
            cartTotalEl.textContent = cartTotalEl.textContent.replace(themeConfig.default.currency, currentTheme.currency);
        }

        // --- 替换动态生成数据的源头（商品描述） ---
        const regexMap = {};
        for (const original in replacements) {
            regexMap[original] = new RegExp(original, 'g');
        }

        fixedItems.forEach(item => {
            for (const original in replacements) {
                const regex = regexMap[original];
                // 替换效果[4]和描述[5]
                if (typeof item[4] === 'string') item[4] = item[4].replace(regex, replacements[original]);
                if (typeof item[5] === 'string') item[5] = item[5].replace(regex, replacements[original]);
            }
        });

    } catch (e) {
        console.error("妈妈在新界面施展“词语替换”魔法时出错了:", e);
    }
}
      // --- 新增：主题切换逻辑 ---






    /**
     * 函数：切换主题 (已修改)
     * 现在它会在预设主题和自定义主题之间切换
     */
    function switchTheme() {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        applyTheme(currentThemeIndex); // 应用预设主题
        try {
            // 保存的是预设主题的索引, 并清除自定义主题的标记
            localStorage.setItem('terminalThemeIndex', currentThemeIndex);
            localStorage.removeItem('useCustomTheme');
        } catch (e) {
            console.warn("无法保存主题设置。");
        }
    }  
  /**
     * 函数：应用指定索引的主题 (保持不变，但我们现在知道它的作用)
     * @param {number} themeIndex - 主题的索引
     */
    function applyTheme(themeIndex) {
        if (themeIndex >= 0 && themeIndex < themes.length) {
            currentThemeIndex = themeIndex;
            const theme = themes[currentThemeIndex];
            const root = document.documentElement;
            // 先重置所有可编辑的变量，以防从自定义主题切换回来时残留
            editableColorVars.forEach(item => {
                 root.style.removeProperty(item.var);
            });
            // 应用主题中的所有变量（包括非颜色的，如果未来有的话）
            for (const [key, value] of Object.entries(theme)) {
                root.style.setProperty(key, value);
            }
             // 应用背景色（特殊处理）
            root.style.setProperty('--background-color', theme['--background-color'] || '#0a192f');
        }
    }
 

    /**
     * 函数：应用自定义主题
     * @param {object} themeObject - 包含自定义颜色键值对的对象
     */
    function applyCustomTheme(themeObject) {
         const root = document.documentElement;
         for(const [key, value] of Object.entries(themeObject)) {
              root.style.setProperty(key, value);
         }
    }


      /**
     * 函数：加载保存的自定义主题
     * return {object} - 返回保存的主题对象，如果不存在则返回空对象
     */
    function loadCustomTheme() {
        try {
            const savedTheme = localStorage.getItem('customTerminalTheme');
            return savedTheme ? JSON.parse(savedTheme) : {};
        } catch(e) {
            console.warn("无法加载自定义主题。", e);
            return {};
        }
    }

    /**
     * 函数：初始化颜色编辑器
     */
    function initializeColorEditor() {
        colorPickerContainer.innerHTML = '';
        const currentStyles = getComputedStyle(document.documentElement);

        editableColorVars.forEach(item => {
            const wrapper = document.createElement('div');
            wrapper.className = 'color-picker-item';

            const label = document.createElement('label');
            label.textContent = item.label;

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.dataset.cssVar = item.var;

            // 获取当前实时生效的颜色值（可能是预设主题或已加载的自定义主题）
            let currentColor = currentStyles.getPropertyValue(item.var).trim();

            // 对于RGBA， input[type=color] 需要HEX。我们进行一个简单的转换。
            // 简单的处理方式是忽略alpha通道或设置一个默认不透明的颜色。
            // 注意：这个转换很简单，可能不完美。
            if (currentColor.startsWith('rgba')) {
                 const parts = currentColor.match(/(\d+)/g);
                 if (parts) {
                     currentColor = `#${parseInt(parts[0]).toString(16).padStart(2, '0')}${parseInt(parts[1]).toString(16).padStart(2, '0')}${parseInt(parts[2]).toString(16).padStart(2, '0')}`;
                 }
            }
            colorInput.value = currentColor;


            // 实时预览
            colorInput.addEventListener('input', (e) => {
                const newColor = e.target.value;
                document.documentElement.style.setProperty(item.var, newColor);
                // 对于需要Alpha通道的颜色，我们在这里硬编码添加
                if (item.var === '--container-bg-color') {
                     document.documentElement.style.setProperty(item.var, hexToRgba(newColor, 0.75));
                } else if (item.var === '--border-color') {
                     document.documentElement.style.setProperty(item.var, hexToRgba(newColor, 0.3));
                } else if (item.var === '--glow-color' || item.var === '--danger-glow-color') {
                     document.documentElement.style.setProperty(item.var, hexToRgba(newColor, 0.5));
                }
            });

            wrapper.appendChild(label);
            wrapper.appendChild(colorInput);
            colorPickerContainer.appendChild(wrapper);
        });
    }

    // Hex to RGBA 辅助函数
    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }


    // 事件监听
    editCustomThemeBtn.addEventListener('click', () => {
        const isVisible = customThemeEditor.style.display !== 'none';
        if (!isVisible) {
            initializeColorEditor();
            customThemeEditor.style.display = 'flex';
            editCustomThemeBtn.textContent = '完成';
        } else {
            // 用户点击“完成”，保存更改
            const newCustomTheme = {};
            document.querySelectorAll('#color-picker-container input[type="color"]').forEach(input => {
                const cssVar = input.dataset.cssVar;
                let colorValue = input.value;
                // 保存时也转换rgba
                if (cssVar === '--container-bg-color') {
                    colorValue = hexToRgba(colorValue, 0.75);
                } else if (cssVar === '--border-color') {
                    colorValue = hexToRgba(colorValue, 0.3);
                } else if (cssVar === '--glow-color' || cssVar === '--danger-glow-color') {
                     colorValue = hexToRgba(colorValue, 0.5);
                }
                newCustomTheme[cssVar] = colorValue;
            });
            try {
                localStorage.setItem('customTerminalTheme', JSON.stringify(newCustomTheme));
                customTheme = newCustomTheme; // 更新内存中的自定义主题
                console.log('自定义主题已保存!');
            } catch(e) {
                console.warn('无法保存自定义主题。');
            }
            customThemeEditor.style.display = 'none';
            editCustomThemeBtn.textContent = '编辑';
        }
    });

    applyCustomThemeBtn.addEventListener('click', () => {
        const savedCustomTheme = loadCustomTheme();
        if (Object.keys(savedCustomTheme).length > 0) {
            customTheme = savedCustomTheme;
            applyCustomTheme(customTheme);
            try {
                // 设置一个标记，表示正在使用自定义主题
                localStorage.setItem('useCustomTheme', 'true');
                // 可以选择性地清除预设主题索引，或保留它以便切换回去
                // localStorage.removeItem('terminalThemeIndex');
            } catch (e) {
                console.warn("无法保存自定义主题使用状态。");
            }
        } else {
            // 如果没有保存的自定义主题，可以给个提示
            alert('请先编辑并保存一个自定义主题。');
        }
    });


 
    // 全局变量存储数据
    let currentMapData = null;
    let currentGameData = null;
   // --- 全局变量和数据获取 ---
        let playCharacterData = getVariables({ type: 'chat' }).play_character_data;
        let assaSettingsData = {};
 
let checkMemoryData = null;   // 用于存储上一轮的投掷记忆
 let worldAttitudeData = null; // 用于存储世界态度变量
let characterStatusData = null; // 用于存储人物状态变量

let summarys = null;


    let worldBookState = {
        currentTab: 'settings', // 默认显示设定
        currentPage: 1,
        itemsPerPage: 5, // 每页显示5条，你可以根据喜好调整
        data: {}
    };
    /**
     * 安全地从数据源获取值。
     * @param {*} value - 输入的数据
     * @returns {string|number} - 处理后的值
     */
    function SafeGetValue(value) {
        if (Array.isArray(value)) {
            let res = value.length > 0 ? value[0] : '';
            return(res === '' || res === null || res === undefined) ? '无' : res;
        }
        return (value === '' || value === null || value === undefined) ? '无' : value;

    }



 
async function handleUpgrade(targetPath, targetName, currentLevel, type) {
    // 显示级数选择模态框
    showLevelSelectionModal(targetPath, targetName, currentLevel, type);
}

 // 找到并替换整个 showLevelSelectionModal 函数
function showLevelSelectionModal(targetPath, targetName, currentLevel, type) {
    const currentXp = playCharacterData.货币段.经验值[0];

    // 生成模态框的HTML内容，注意：移除了 onclick 和 onchange
    const modalContent = `
        <div style="padding: 20px;">
            <p><strong>当前"${targetName}"等级:</strong> ${currentLevel}</p>
            <p><strong>当前${currentTheme.exp}:</strong> ${currentXp}</p>

            <div style="margin: 20px 0;">
                <label for="upgrade-levels" >选择升级级数:</label>
                <select id="upgrade-levels">
                    ${generateLevelOptions(currentLevel, type, currentXp)}
                </select>
            </div>

            <div id="upgrade-cost-display" >
                选择升级级数以查看消耗
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <button id="confirm-upgrade-btn" disabled>确定升级</button>
            </div>
        </div>
    `;

    // 显示模态框（这部分不变）
    showModal('shop-modal', '选择升级级数', modalContent);

    // --- 魔法在这里！---
    // 等待模态框渲染完成后，我们再来为里面的元素安排工作
    setTimeout(() => {
        const selectElement = document.getElementById('upgrade-levels');
        const confirmButton = document.getElementById('confirm-upgrade-btn');

        if (selectElement && confirmButton) {
            // 为下拉框安排“改变时更新-消耗”的工作
            selectElement.addEventListener('change', () => {
                updateUpgradeCost(type, currentLevel);
            });

            // 为按钮安排“点击时确认升级”的工作
            confirmButton.addEventListener('click', () => {
                confirmUpgrade(targetPath, targetName, currentLevel, type);
            });

            // 第一次打开时，也主动更新一下消耗显示
            updateUpgradeCost(type, currentLevel);
        }
    }, 100); // 延迟一点点时间确保元素已经出现在页面上
}

function generateLevelOptions(currentLevel, type, currentXp) {
    let options = '';
    
    // 生成1-10级的选项
    for (let i = 1; i <= 10; i++) {
        const targetLevel = currentLevel + i;
        const totalCost = calculateLevelRangeCost(currentLevel, targetLevel, type);
        const canAfford = currentXp >= totalCost;
        const affordText = canAfford ? '' : ' (经验不足)';
        const textColor = canAfford ? '' : ' style="color: #999;"';
        
        options += `<option value="${i}"${textColor}>${i}级 (${currentLevel} → ${targetLevel})${affordText}</option>`;
    }
    
    return options;
}

function updateUpgradeCost(type, currentLevel) {
    const selectElement = document.getElementById('upgrade-levels');
    const confirmButton = document.getElementById('confirm-upgrade-btn');
    const costDisplay = document.getElementById('upgrade-cost-display');
    
    if (!selectElement || !confirmButton || !costDisplay) return;
    
    const selectedLevels = parseInt(selectElement.value);
    const targetLevel = currentLevel + selectedLevels;
    const totalCost = calculateLevelRangeCost(currentLevel, targetLevel, type);
    const currentXp = playCharacterData.货币段.经验值[0];
    const canAfford = currentXp >= totalCost;
    
    // 更新消耗显示
    const statusColor = canAfford ? '#28a745' : '#dc3545';
    const statusIcon = canAfford ? '✓' : '✗';
    const statusText = canAfford ? `${currentTheme.exp}充足` : `${currentTheme.exp}不足 (缺少 ${totalCost - currentXp} 点)`;
    costDisplay.innerHTML = `
        <div style="font-size: 14px;">
            <p><strong>升级 ${selectedLevels} 级消耗:</strong></p>
               <p>${currentTheme.exp}: <strong>${totalCost}</strong> 点</p>
            <p>当前拥有: <strong>${currentXp}</strong> 点</p>
            <p>
                ${statusIcon} ${statusText}
            </p>
        </div>
    `;
    
    // 更新确定按钮状态
    confirmButton.disabled = !canAfford;
    confirmButton.style.opacity = canAfford ? '1' : '0.5';
    confirmButton.style.cursor = canAfford ? 'pointer' : 'not-allowed';
}

 async function confirmUpgrade(targetPath, targetName, currentLevel, type) {
    const selectElement = document.getElementById('upgrade-levels');
    if (!selectElement) return;
    
    const selectedLevels = parseInt(selectElement.value);
    const targetLevel = currentLevel + selectedLevels;
    const totalCost = calculateLevelRangeCost(currentLevel, targetLevel, type);
    const currentXp = playCharacterData.货币段.经验值[0];
    
    // 最终验证经验是否足够
    if (currentXp < totalCost) {
        showModal('shop-modal', '经验不足', 
            `升级"${targetName}" ${selectedLevels}级需要 ${totalCost} 点经验值，您当前只有 ${currentXp} 点。`);
        return;
    }
    
 try {
    const newXp = currentXp - totalCost;
    const messageToSend = `<（${currentTheme.exp}已扣除，禁止重复扣除）${currentGameData.user_character.name}将"${targetName}"从 ${currentLevel} 级提升至 ${targetLevel} 级！>`;

    // --- 这是一个通用的更新函数，我们会调用它两次 ---
    const updateLogic = (currentVars) => {
        // 创建一个深拷贝，确保我们不会意外修改原始数据
        const workingCopy = JSON.parse(JSON.stringify(currentVars));

        // 确保 play_character_data 存在
        if (!workingCopy.play_character_data) {
            console.error("错误：更新目标 'play_character_data' 不存在。");
            return currentVars; // 如果结构不对，返回原始数据以避免崩溃
        }

        // 这是一个辅助函数，用于根据路径在指定的对象内部设置值
        const setNestedValue = (obj, path, value) => {
            const keys = path.split('.');
            let current = obj;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    // 如果路径中的某个环节不存在，就创建一个空对象
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            const finalKey = keys[keys.length - 1];
            if (Array.isArray(current[finalKey])) {
                current[finalKey][0] = value;
            } else {
                current[finalKey] = value;
            }
        };

        const characterData = workingCopy.play_character_data;

        // 1. 更新目标属性的等级
        setNestedValue(characterData, targetPath, targetLevel);

        // 2. 更新经验值
        const expPath = `货币段.${currentTheme.exp}`;
        setNestedValue(characterData, expPath, newXp);

        return workingCopy; // 返回更新后的完整变量对象
    };
    // ----------------------------------------------------

    // 第一步：同步更新 'chat' 和 'message' 变量
    // 我们用 Promise.all 来确保两个更新都完成后再继续
    await Promise.all([
        updateVariablesWith(updateLogic, { type: 'chat' }),
        updateVariablesWith(updateLogic, { type: 'message'})
    ]);

 initDisplay();


    // 第二步：变量更新完成后，发送纯文本消息
    await triggerassa(`/setinput ${messageToSend}`);

    // 第三步：显示成功模态框
    showModal('shop-modal', '升级成功',
        `"${targetName}" 已成功从 ${currentLevel} 级提升至 ${targetLevel} 级！<br><br>消耗${currentTheme.exp}: ${totalCost} 点`);

    // 第四步：刷新整个界面，确保所有数据和显示都完美同步
    await initDisplay();

} catch (error) {
    console.error("升级失败:", error);
    showModal('shop-modal', '操作失败', '在更新数据或发送消息时发生错误。请查看控制台获取详细信息。');
}
}

// 计算升级指定级数范围的总消耗
function calculateLevelRangeCost(fromLevel, toLevel, type) {
    let totalCost = 0;
    for (let level = fromLevel; level < toLevel; level++) {
        totalCost += calculateXpCost(level, type);
    }
    return totalCost;
}

function calculateXpCost(currentLevel, type) {
    if (type === 'attribute') {
        // 属性升级成本更高，例如 (当前等级+1) * 15
        return (currentLevel + 1) * 15;
    }
    // 技能升级成本，例如 (当前等级+1) * 10
    return (currentLevel + 1) * 10;
}

    /**
 * 新增：填充除角色状态页外的所有通用数据
 * @param {object} statData - stat_data 对象
 * @param {object} assaData - assa_data 对象
 */
function populateGeneralData(statData, assaData,playData) {
    const worldData = statData.world_shard;
    const taskData = worldData.task;
    const charData = statData.user_character;

  document.getElementById('world-shard').textContent = SafeGetValue(worldData.name) ||'SYSTEM TERMINAL';

 
    document.getElementById('info-world-desc').textContent = SafeGetValue(worldData.description);
 

// 获取世界能量层级和最大能量值
var world_level = statData.world_shard?.level[0] || '中';
var world_max_enegy = 3;
if (world_level === '无') {
    world_max_enegy = 3;
} else if (world_level === '低') {
    world_max_enegy = 5;
} else if (world_level === '中') {
    world_max_enegy = 7;
} else if (world_level === '高') {
    world_max_enegy = 12;
} else if (world_level === '神话') {
    world_max_enegy = 16;
} else {
    world_max_enegy = 7;
}
  
// 更新标题栏信息
document.getElementById('header-location').textContent = SafeGetValue(charData.current_location);
document.getElementById('header-time').textContent = SafeGetValue(statData.日期)+" "+SafeGetValue(statData.时间);
document.getElementById('header-check').textContent = SafeGetValue(statData.检定属性);
document.getElementById('header-combat').textContent = SafeGetValue(statData.敌方攻击骰池);
document.getElementById('header-difficulty').textContent = `${SafeGetValue(statData.检定难度)}(${world_level}:1-${world_max_enegy})`;


/* 填充任务详情 */
    document.getElementById('task-objective').textContent = SafeGetValue(taskData.objective);
    document.getElementById('task-status').textContent = SafeGetValue(taskData.status);
    const progress = SafeGetValue(taskData.progress);
    document.getElementById('task-progress-bar').style.width = (typeof progress === 'number' ? progress : 0) + '%';
    document.getElementById('task-rewards').textContent = SafeGetValue(taskData.rewards);
    document.getElementById('task-penalties').textContent = SafeGetValue(taskData.penalties);
    document.getElementById('task-time-left').textContent = SafeGetValue(taskData.time_left) + ' 天';


}

/**
 * 获取并解析所有已装备物品的属性加成
 * @param {object} statData - 核心数据 currentGameData
 * @param {object} assaData - 设定数据 assaSettingsData
 * @returns {object} 一个以属性名为键，加成数值为值的对象, e.g. { "力量": 5, "敏捷": -2 }
 */
function getEquipmentBonuses(statData, assaData) {
    const bonuses = {};
    // 安全地访问当前装备，如果不存在则使用空对象
    const equipment = statData?.user_character?.当前装备 || {};
    const equipmentList = [];

    // 定义一个包含所有合法的、我们关心的穿戴装备槽位的列表
    const validWearableSlots = ['头部', '身体', '手部', '脚部', '饰品'];

   // 1. 处理"手持"装备 - 支持分号分割的多个装备
if (equipment.手持 && Array.isArray(equipment.手持) && equipment.手持[0] && equipment.手持[0] !== "无") {
    // 按分号分割手持装备，支持同时手持多个物品
    const handItems = equipment.手持[0].split(/;|；/).map(item => item.trim()).filter(item => item !== "无" && item !== "");
    equipmentList.push(...handItems);
}

const wearableItems = equipment.穿戴;
// 确保穿戴装备部分是一个有效的对象
if (wearableItems && typeof wearableItems === 'object' && wearableItems !== null) {
    // 遍历预先定义好的合法槽位列表
    validWearableSlots.forEach(slotName => {
        // 根据合法的槽位名，去数据中精确查找对应的装备信息
        const slot = wearableItems[slotName];

        // 对找到的槽位信息进行有效性检查
        if (slot && Array.isArray(slot) && slot[0] && slot[0] !== "无") {
            // 按分号分割该部位的装备，支持同一部位穿戴多个物品
            const slotItems = slot[0].split(/;|；/).map(item => item.trim()).filter(item => item !== "无" && item !== "");
            equipmentList.push(...slotItems);
        }
    });
}

 equipmentList.forEach(itemName => {
    // 首先，我们和以前一样，从背包中寻找装备数据
    const itemData =
        assaData?.global_set?.背包?.[itemName] ||
        null;

    // 确保我们找到了数据才继续
    if (itemData) {
        let stringToParse = ''; // 我们准备一个篮子，并确保它始终是字符串

        // 第一步：我们先检查拿到的 itemData 到底是什么类型
        if (typeof itemData === 'string') {
            // 如果它是一封“信”(string)，我们就尝试用JSON的方式去读它
            try {
                const itemObject = JSON.parse(itemData);
                // 如果读出来是一个“礼盒”(object)，并且里面有我们想要的effect“清单”
                if (typeof itemObject === 'object' && itemObject !== null && typeof itemObject.effect === 'string') {
                    // 我们就把清单放进篮子
                    stringToParse = itemObject.effect;
                }
            } catch (e) {
                // 如果用JSON的方式读信失败了，说明它就是一封普通的信，内容就是我们要的
                // 比如 "【防御+5】" 这种
                stringToParse = itemData;
            }
        } else if (typeof itemData === 'object' && itemData !== null) {
   
            if (typeof itemData.effect === 'string') {
                stringToParse = itemData.effect;
            }
        }

        // 现在，无论来源如何，我们的“篮子”(stringToParse)里都装好了要处理的属性字符串
        // 正则匹配所有【属性+数值】或【属性-数值】格式的描述
        const matches = stringToParse.match(/【[^】]+】/g);

        // ---- 后续的加成计算逻辑完全保持不变，因为它非常棒 ----
        if (matches) {
            const derivedAttrMapping = {
                '防御': '衍生属性段.防御.基础防御',
                '速度': '衍生属性段.速度.基础速度'
            };

            matches.forEach(match => {
                const content = match.substring(1, match.length - 1);
                const attributes = content.split(/;|；/).map(attr => attr.trim()).filter(attr => attr !== "");

                attributes.forEach(attr => {
                    const parts = attr.match(/^(.+?)\s*([+-]\d+)$/) || attr.match(/^(.+?)[:|：]\s*([+-]?\d+)$/);

                    if (parts && parts.length === 3) {
                        let attrName = parts[1].trim();
                        const value = parseInt(parts[2].trim().replace('+', ''), 10);

                        const mappedPath = derivedAttrMapping[attrName];
                        const finalKey = mappedPath || attrName;

                        if (!bonuses[finalKey]) {
                            bonuses[finalKey] = 0;
                        }
                        bonuses[finalKey] += value;
                    }
                });
            });
        }
    }
});
    return bonuses;
}



 // ==========================================================
// ========== 完整替换 populateCharacterPage 函数 ==========
// ==========================================================
function populateCharacterPage(playData, statData, assaData) {
    const charStat = statData.user_character;
    const derived = playData.衍生属性段;
    const currency = playData.货币段;
    const gainian = playData.概念段.美德与恶德;

    // --- 左侧和中间面板 (基本不变) ---
    document.getElementById('char-display-name').textContent = SafeGetValue(charStat.name);
    document.getElementById('char-display-status').textContent = SafeGetValue(charStat.status) || '正常';
    document.getElementById('char-display-prestige').textContent = SafeGetValue(charStat.Cross_world_prestige);
    document.getElementById('char-display-meide').textContent = SafeGetValue(gainian.美德);
    document.getElementById('char-display-ede').textContent = SafeGetValue(gainian.恶德);
    const hp = derived.生命值;
    document.getElementById('char-hp-bar').style.width = (hp.当前值[0] / hp.上限[0] * 100) + '%';
    document.getElementById('char-hp-text').textContent = `${hp.当前值[0]} / ${hp.上限[0]}`;
    const will = derived.意志力;
    document.getElementById('char-will-bar').style.width = (will.当前值[0] / will.上限[0] * 100) + '%';
    document.getElementById('char-will-text').textContent = `${will.当前值[0]} / ${will.上限[0]}`;
    const energy = derived.能量池;
    document.getElementById('char-energy-label').textContent = SafeGetValue(energy.名称);
    document.getElementById('char-energy-bar').style.width = (energy.当前值[0] / energy.上限[0] * 100) + '%';
    document.getElementById('char-energy-text').textContent = `${energy.当前值[0]} / ${energy.上限[0]}`;

    const equipment = charStat.当前装备.穿戴;
    document.getElementById('equip-head').textContent = `头部: ${SafeGetValue(equipment.头部)}`;
    document.getElementById('equip-body').textContent = `身体: ${SafeGetValue(equipment.身体)}`;
    document.getElementById('equip-hands').textContent = `手部: ${SafeGetValue(equipment.手部)}`;
    document.getElementById('equip-feet').textContent = `脚部: ${SafeGetValue(equipment.脚部)}`;
    document.getElementById('equip-accessory').textContent = `饰品: ${SafeGetValue(equipment.饰品)}`;
    document.getElementById('equip-weapon').textContent = `手持: ${SafeGetValue(charStat.当前装备.手持)}`;

    // --- 右侧面板: 渲染新的整合模块 (核心改动) ---
    const statsContainer = document.getElementById('main-stats-container');
    statsContainer.innerHTML = ''; // 清空容器
    const currentXp = playData.货币段.经验值[0];
    const equipmentBonuses = getEquipmentBonuses(statData, assaData);

    const moduleMapping = [
        { name: "生理", attr: "生理属性", skill: "生理技能" },
        { name: "心智", attr: "心智属性", skill: "心智技能" },
        { name: "互动", attr: "互动属性", skill: "互动技能" }
    ];

    moduleMapping.forEach(moduleInfo => {
        const moduleDiv = document.createElement('div');
        moduleDiv.className = 'stat-module';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'stat-module-title';
        titleDiv.textContent = moduleInfo.name;
        titleDiv.onclick = () => moduleDiv.classList.toggle('collapsed');

        const contentDiv = document.createElement('div');
        contentDiv.className = 'stat-module-content';

        // --- 渲染属性 ---
        let attrHtml = `<div class="sub-category-title">基础属性</div>`;
        const attrCategoryData = playData.属性段[moduleInfo.attr];
        for (const attrName in attrCategoryData) {
            const attr = attrCategoryData[attrName];
            const dataPath = `属性段.${moduleInfo.attr}.${attrName}.基础`;
            const equipBonus = equipmentBonuses[attrName] || 0;
            const equipBonusHtml = equipBonus !== 0 ? ` <span class="equipment-bonus">(${equipBonus > 0 ? '+' : ''}${equipBonus})</span>` : '';
            const legendaryBonusHtml = attr.传奇[0] > 0 ? ` <span class="legendary-value" data-tooltip="${attr.传奇[1]}">(+${attr.传奇[0]})</span>` : '';
            const upgradeCost = calculateXpCost(attr.基础[0], 'attribute');
            const canUpgrade = currentXp >= upgradeCost;
            const upgradeButtonHtml = canUpgrade ? `<span class="upgrade-btn" data-path="${dataPath}" data-name="${attrName}" data-level="${attr.基础[0]}" data-type="attribute">+</span>` : '';

            attrHtml += `
            <div class="attr-item" data-tooltip="${attr.基础[1]}">
                <span class="attr-name">${attrName}${upgradeButtonHtml}</span>
                <span class="attr-value">${attr.基础[0]}${equipBonusHtml}${legendaryBonusHtml}</span>
            </div>`;
        }

        // --- 渲染技能 ---
        let skillHtml = `<div class="sub-category-title">相关技能</div>`;
        const skillCategoryData = playData.技能段[moduleInfo.skill];
         const skillsToShow = Object.keys(skillCategoryData).filter(skillName =>
            skillCategoryData[skillName][0] > 0 || (equipmentBonuses[skillName] && equipmentBonuses[skillName] !== 0)
        );
        if (skillsToShow.length > 0) {
            for (const skillName of skillsToShow) {
                const skill = skillCategoryData[skillName];
                const dataPath = `技能段.${moduleInfo.skill}.${skillName}`;
                const skillBonus = equipmentBonuses[skillName] || 0;
                const skillBonusHtml = skillBonus !== 0 ? ` <span class="equipment-bonus">(${skillBonus > 0 ? '+' : ''}${skillBonus})</span>` : '';
                const upgradeCost = calculateXpCost(skill[0], 'skill');
                const canUpgrade = currentXp >= upgradeCost;
                const upgradeButtonHtml = canUpgrade ? `<span class="upgrade-btn" data-path="${dataPath}" data-name="${skillName}" data-level="${skill[0]}" data-type="skill">+</span>` : '';

                skillHtml += `
                <div class="skill-item" data-tooltip="${skill[1]}">
                    <span class="skill-name">${skillName}${upgradeButtonHtml}</span>
                    <span class="skill-value">${skill[0]}${skillBonusHtml}</span>
                </div>`;
            }
        } else {
            skillHtml += `<div class="info-value" style="font-size:0.9em; color: var(--text-secondary-color);">暂无已掌握的${moduleInfo.name}技能</div>`;
        }


        contentDiv.innerHTML = attrHtml + skillHtml;
        moduleDiv.appendChild(titleDiv);
        moduleDiv.appendChild(contentDiv);
        statsContainer.appendChild(moduleDiv);
    });

    // --- 渲染衍生属性 (保持独立模块) ---
    // (这部分代码逻辑可以复用，我们把它包装成一个新模块)
    const derivedContainer = document.createElement('div');
    derivedContainer.className = 'stat-module';
    const derivedTitle = document.createElement('div');
    derivedTitle.className = 'stat-module-title';
    derivedTitle.textContent = '衍生属性';
    derivedTitle.onclick = () => derivedContainer.classList.toggle('collapsed');
    const derivedContent = document.createElement('div');
    derivedContent.className = 'stat-module-content';

    let derivedHtml = '';
    const derivedData = playData.衍生属性段;
    // (从你原代码中复制并微调的衍生属性渲染逻辑)
    for (const key in derivedData) {
        const dataEntry = derivedData[key];
        const getBonusHtml = (bonusValue) => !bonusValue ? '' : `<span class="equipment-bonus">(${bonusValue > 0 ? '+' : ''}${bonusValue})</span>`;
        if (typeof dataEntry[1] === 'string') {
            const bonus = equipmentBonuses[`衍生属性段.${key}`] || 0;
            derivedHtml += `<div class="attr-item" data-tooltip="${dataEntry[1]}"><span class="attr-name">${key}</span><span class="attr-value">${dataEntry[0]}${getBonusHtml(bonus)}</span></div>`;
        } else if (typeof dataEntry === 'object') {
            derivedHtml += `<div class="attr-item sub-category-title" style="border:none; margin: 10px 0 5px 0;">${key}</div>`;
            for (const subKey in dataEntry) {
                const subEntry = dataEntry[subKey];
                if (typeof subEntry[1] === 'string') {
                    const bonus = equipmentBonuses[`衍生属性段.${key}.${subKey}`] || 0;
                    derivedHtml += `<div class="attr-item" data-tooltip="${subEntry[1]}" style="padding-left:15px;"><span class="attr-name">${subKey}</span><span class="attr-value">${subEntry[0]}${getBonusHtml(bonus)}</span></div>`;
                } else if (typeof subEntry === 'object') {
                    derivedHtml += `<div class="attr-item" style="padding-left:15px; color:var(--text-secondary-color);">${subKey}</div>`;
                    for (const deepKey in subEntry) {
                        const deepEntry = subEntry[deepKey];
                        const bonus = equipmentBonuses[`衍生属性段.${key}.${subKey}.${deepKey}`] || 0;
                        if (typeof deepEntry[1] === 'string') {
                            derivedHtml += `<div class="attr-item" data-tooltip="${deepEntry[1]}" style="padding-left:30px;"><span class="attr-name">${deepKey}</span><span class="attr-value">${deepEntry[0]}${getBonusHtml(bonus)}</span></div>`;
                        }
                    }
                }
            }
        }
    }
    derivedContent.innerHTML = derivedHtml;
    derivedContainer.appendChild(derivedTitle);
    derivedContainer.appendChild(derivedContent);
    statsContainer.appendChild(derivedContainer);


    // --- 最后, 调用新函数填充第二个 Tab ---
    populateInventoryAndSkillsTab(playData, assaData);

    // 设置 Tooltips 和 Tab 切换
    setupTooltips();
    setupCharacterTabs();
}
// ========================================================
// =========== 新增: 填充行囊与能力Tab的函数 ===========
// ========================================================
function populateInventoryAndSkillsTab(playData, assaData) {
    const currency = playData.货币段;
    const inventory = assaData.global_set?.背包 || {};
    const otherSkills = assaData.global_set?.其他技能 || {};

    // --- 1. 填充顶部的货币信息 ---
    const currencyContainer = document.getElementById('char-currency-display');
    const plots = currency.支线剧情;
    const plotString = `D:${plots.D[0]} C:${plots.C[0]} B:${plots.B[0]} A:${plots.A[0]} S:${plots.S[0]}`;

    currencyContainer.innerHTML = `
        <div class="currency-item"><span class="label">积分:</span><span class="value">${currency.积分[0]}</span></div>
        <div class="currency-item"><span class="label">${currentTheme.exp || '经验'}:</span><span class="value">${currency.经验值[0]}</span></div>
        <div class="currency-item"><span class="label">${currentTheme.plot || '剧情'}:</span><span class="value">${plotString}</span></div>
    `;

    // --- 2. 填充行囊物品 ---
    const itemsContainer = document.getElementById('inventory-items-container');
    itemsContainer.innerHTML = '';

    Object.keys(inventory).forEach(itemName => {
        const item = inventory[itemName];
        let itemData = {};

        // 兼容数据格式
        if (typeof item === 'string') {
            try {
                itemData = JSON.parse(item);
            } catch (e) {
                itemData = { info: item, effect: '无', num: 1 };
            }
        } else if (typeof item === 'object' && item !== null) {
            itemData = item;
        }

        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-card-name">${itemName}</div>
            ${itemData.num > 1 ? `<div class="item-card-num">x${itemData.num}</div>` : ''}
        `;
        card.onclick = () => showInfoDetailModal(itemName, itemData, '物品');
        itemsContainer.appendChild(card);
    });
    if (itemsContainer.children.length === 0) {
        itemsContainer.innerHTML = `<p style="color: var(--text-secondary-color);">你的行囊空空如也...</p>`;
    }

    // --- 3. 填充"其他技能" ---
    const skillsContainer = document.getElementById('other-skills-container');
    skillsContainer.innerHTML = '';

    Object.keys(otherSkills).forEach(skillName => {
        const skill = otherSkills[skillName];
        let skillData = {};

        // 兼容数据格式
        if (typeof skill === 'string') {
             try {
                skillData = JSON.parse(skill);
            } catch (e) {
                skillData = { info: skill, effect: '无', level: '未知' };
            }
        } else if (typeof skill === 'object' && skill !== null) {
            skillData = skill;
        }

        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = `
            <div class="skill-card-name">${skillName}</div>
            ${skillData.level ? `<div class="skill-card-level">${skillData.level}</div>` : ''}
        `;
        card.onclick = () => showInfoDetailModal(skillName, skillData, '能力');
        skillsContainer.appendChild(card);
    });
    if (skillsContainer.children.length === 0) {
        skillsContainer.innerHTML = `<p style="color: var(--text-secondary-color);">尚未掌握任何特殊能力...</p>`;
    }
}

 // ========================================================
// ========== 完整替换: 显示物品/技能详情的模态框 ==========
// ========================================================
function showInfoDetailModal(name, data, type) {
    // --- 这是一个强大的递归函数，我的孩子，它可以探索任何深度的秘密 ---
    const buildDetailHtml = (data, depth = 0) => {
        const indentStyle = `padding-left: ${depth * 20}px;`;

        // 如果数据是一个对象 (但不是数组)
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
            let html = '';
            for (const [key, value] of Object.entries(data)) {
                // 如果值是对象或数组，我们创建一个可折叠的容器
                if (typeof value === 'object' && value !== null) {
                    html += `
                        <div class="detail-collapsible" style="${indentStyle}">
                            <div class="detail-collapsible-header">
                                <span class="d-c-arrow">▶</span>
                                <span class="d-c-key">${key}:</span>
                            </div>
                            <div class="detail-collapsible-content">
                                ${buildDetailHtml(value, 0)}
                            </div>
                        </div>
                    `;
                } else { // 否则，直接显示键值对
                    html += `
                        <div class="detail-entry" style="${indentStyle}">
                             <span class="d-c-key">${key}:</span>
                             <span class="d-c-value">${formatSimpleValue(value)}</span>
                        </div>
                    `;
                }
            }
            return html;
        }
        // 如果数据是一个数组
        else if (Array.isArray(data)) {
            let listContent = data.map(item => buildDetailHtml(item, 0)).join('');
            return `<div class="detail-array-container">${listContent}</div>`;
        }
        // 如果是基本类型的值（字符串、数字等）
        else {
            return `<div class="detail-entry" style="${indentStyle}"><span class="d-c-value single">${formatSimpleValue(data)}</span></div>`;
        }
    };

    // --- 格式化基本值的函数 (比如高亮特殊文本) ---
    const formatSimpleValue = (text) => {
        if (typeof text !== 'string') return text;
        return text.replace(/【/g, '<strong style="color: var(--secondary-color);">【').replace(/】/g, '】</strong>');
    };

    // --- 构建并显示模态框 ---
    const contentHtml = `
        <div class="detail-modal-container">
            <h3 class="detail-modal-title">${name}</h3>
            ${buildDetailHtml(data)}
        </div>
    `;

    showModal('shop-modal', `${type}详情`, contentHtml);

    // --- 动态地为我们新创建的折叠元素添加点击事件 ---
    setTimeout(() => {
        const modalContent = document.querySelector('#shop-modal .modal-content');
        if (modalContent) {
             modalContent.querySelectorAll('.detail-collapsible-header').forEach(header => {
                header.addEventListener('click', () => {
                    header.parentElement.classList.toggle('expanded');
                });
            });
        }
    }, 100); // 确保元素已渲染
}

// ========================================================
// ============ 新增: 设置Tab切换逻辑的函数 ============
// ========================================================
function setupCharacterTabs() {
    const tabButtons = document.querySelectorAll('.char-tab-btn');
    const tabPanels = document.querySelectorAll('.char-tab-panel');

    // 防止重复绑定事件
    if (document.getElementById('page-character-modal').dataset.tabsInitialized) {
        return;
    }
    document.getElementById('page-character-modal').dataset.tabsInitialized = 'true';

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabPanels.forEach(panel => {
                if (panel.id === `char-tab-${targetTab}`) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });
}

function setupTooltips() {
    const tooltipElement = document.getElementById('char-tooltip');
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            tooltipElement.textContent = element.dataset.tooltip;
            tooltipElement.style.opacity = '1';
            tooltipElement.style.visibility = 'visible';
            tooltipElement.style.left = e.clientX + 15 + 'px';
            tooltipElement.style.top = e.clientY + 15 + 'px';
        });

        element.addEventListener('mouseleave', () => {
            tooltipElement.style.opacity = '0';
            tooltipElement.style.visibility = 'hidden';
        });
    });

    // 为特定key的tooltip添加默认描述
    const tooltipDescriptions = {
        status: "当前状态，包括诅咒、赐福等",
        prestige: "跨世界声望，只有对世界产生重大影响才更新",
        hp: "生命值，归零则陷入濒死状态",
        willpower: "意志力，用于抵抗心智影响和发动特殊能力",
        energy: "特殊能量，如法力、灵力、气",
        equip_head: "头部穿戴的装备，点击管理",
        equip_body: "身体穿戴的装备，点击管理",
        equip_hands: "手部穿戴的装备，点击管理",
        equip_feet: "脚部穿戴的装备，点击管理",
        equip_accessory: "穿戴的特殊饰品，点击管理",
        equip_weapon: "当前手持的武器或工具，点击管理",
        meide:"会有什么用呢？",
        ede:"会有什么用呢？",
    };

    document.querySelectorAll('[data-tooltip-key]').forEach(element => {
        const key = element.dataset.tooltipKey;
        if(tooltipDescriptions[key]) {
            element.dataset.tooltip = tooltipDescriptions[key];
        }

         element.addEventListener('mousemove', (e) => {
            tooltipElement.textContent = element.dataset.tooltip;
            tooltipElement.style.opacity = '1';
            tooltipElement.style.visibility = 'visible';
            tooltipElement.style.left = e.clientX + 15 + 'px';
            tooltipElement.style.top = e.clientY + 15 + 'px';
        });

        element.addEventListener('mouseleave', () => {
            tooltipElement.style.opacity = '0';
            tooltipElement.style.visibility = 'hidden';
        });
    });
}

     /**
     * 格式化分号分隔的字符串为换行显示
     * @param {string} text - 输入的字符串
     * @returns {string} - HTML字符串
     */
    function formatSemicolonText(text) {
        if (!text || text === '无' || text.trim() === '') {
            return '无';
        }
        return text.split(';').map(item => item.trim()).filter(item => item).join('<br>');
    }
 
/**
 * 渲染整个设定书界面
 * @param {object} data - 包含设定信息的assa_data对象
 */
function renderSettingsBook(data) {
 //console.log("设定书已弃用");
}


// 检查数据源读取是否正确
function debugDataSource(mapData) {
    //console.log("🗃️ 原始mapData对象:", mapData);
    
    const locationContent = mapData["主要地点表"];
    //console.log("📋 主要地点表原始数据:", locationContent);
    
    if (locationContent && locationContent.length > 0) {
        //console.log("📍 逐行解析数据:");
        
        for (let i = 0; i < locationContent.length; i++) {
            const location = locationContent[i];
            //console.log(`行 ${i}:`, location);
            
            // 详细解析每个字段
            const [colIndex, name, xStr, yStr, widthStr, heightStr, description] = location;
            
            //console.log(`  解析结果:`);
            //console.log(`    colIndex: ${colIndex} (类型: ${typeof colIndex})`);
            //console.log(`    name: ${name} (类型: ${typeof name})`);
            //console.log(`    xStr: ${xStr} (类型: ${typeof xStr}) → 转换为: ${parseInt(xStr, 10)}`);
            //console.log(`    yStr: ${yStr} (类型: ${typeof yStr}) → 转换为: ${parseInt(yStr, 10)}`);
            //console.log(`    widthStr: ${widthStr} (类型: ${typeof widthStr}) → 转换为: ${parseInt(widthStr, 10) || 100}`);
            //console.log(`    heightStr: ${heightStr} (类型: ${typeof heightStr}) → 转换为: ${parseInt(heightStr, 10) || 50}`);
            //console.log(`    description: ${description}`);
            
            // 检查是否有NaN
            const x = parseInt(xStr, 10);
            const y = parseInt(yStr, 10);
            const width = parseInt(widthStr, 10) || 100;
            const height = parseInt(heightStr, 10) || 50;
            
            if (isNaN(x) || isNaN(y)) {
                console.error(`❌ 坐标解析错误: ${name} - x:${x}, y:${y}`);
            }
            
            //console.log(`    最终坐标: (${x}, ${y}) 尺寸: ${width}x${height}`);
            //console.log(`    底部位置: y=${y + height}`);
            //console.log("    ---");
        }
    }
    
    // 验证期望的坐标
    //console.log("✅ 验证期望的坐标:");
    //console.log("  传送矩阵应该在: (450, 50)");
    //console.log("  中央光柱应该在: (400, 150)");
    //console.log("  Y轴差距应该是: 100px");
    
    // 查找并验证这两个元素
    const expectedData = {
        "传送矩阵": { x: 450, y: 50 },
        "中央光柱": { x: 400, y: 150 }
    };
    
    if (locationContent) {
        locationContent.forEach((location, index) => {
            const [, name, xStr, yStr] = location;
            const x = parseInt(xStr, 10);
            const y = parseInt(yStr, 10);
            
            if (expectedData[name]) {
                const expected = expectedData[name];
                if (x === expected.x && y === expected.y) {
                    //console.log(`✅ ${name} 坐标正确: (${x}, ${y})`);
                } else {
                    console.error(`❌ ${name} 坐标不匹配!`);
                    console.error(`   期望: (${expected.x}, ${expected.y})`);
                    console.error(`   实际: (${x}, ${y})`);
                }
            }
        });
    }
}
 /* 文件位置: 你的主JS文件 */
/* 函数名称: renderMap */

// 假设 backgroundImageMap 在全局作用域可用
// const backgroundImageMap = { ... };

function renderMap(mapData, updatedLocationNames = []) {
    // console.log("=== 开始渲染地图 ===");

    const mapModalContent = document.querySelector('#map-view-modal .modal-content');
    const mapContainer = document.getElementById('map-container');
    const mapTitleElement = document.getElementById('map-title');
    const externalAreasContainer = document.getElementById('external-areas');

    // 检查核心元素是否存在
    if (!mapModalContent || !mapContainer || !mapTitleElement || !externalAreasContainer) {
        console.error("地图模态框的关键元素缺失，无法渲染。");
        return;
    }

    if (!mapData) {
        console.warn("无法渲染地图，地图数据为空。");
        mapTitleElement.textContent = "地图数据缺失";
        mapContainer.innerHTML = '';
        return;
    }

    // 尝试从全局游戏数据获取场景图信息
    const sceneImage = SafeGetValue(currentGameData.场景图);
    const isValidSceneImage = sceneImage && sceneImage !== "无" && sceneImage !== "null" && backgroundImageMap && backgroundImageMap[sceneImage];

    const globalContent = mapData["全局地点表"];
    const locationContent = mapData["主要地点表"];

    let mapTitle = "区域地图";
    let externalAreas = [];

    if (globalContent && globalContent.length >= 1) {
        mapTitle = globalContent[0][1] || "区域地图";
        const rawExternalAreas = globalContent[0][2];
        const externalAreasStr = typeof rawExternalAreas === 'string' ? rawExternalAreas : '';
        externalAreas = externalAreasStr.split(';').filter(area => area.trim() !== '');
    }

    mapTitleElement.textContent = mapTitle;
    mapContainer.innerHTML = ''; // 清空旧地图

    const mapContent = document.createElement('div');
    mapContent.id = 'map-content';
    mapContent.style.position = 'relative';
    mapContainer.appendChild(mapContent);

    const locationsToRender = [];
    if (locationContent && locationContent.length > 0) {
        for (let i = 0; i < locationContent.length; i++) {
            const location = locationContent[i];
            const [colIndex, name, xStr, yStr, widthStr, heightStr, description] = location;
            if (!name || xStr === undefined || yStr === undefined) continue;

            const x = parseInt(xStr, 10);
            const y = parseInt(yStr, 10);
            const width = parseInt(widthStr, 10) || 100;
            const height = parseInt(heightStr, 10) || 50;
            locationsToRender.push({ name, x, y, width, height, description });
        }
    }

    /********** 新增分支逻辑 **********/
    if (isValidSceneImage) {
        // --- 场景图模式 ---

        // 1. 设置背景并固定地图
        const imageUrl = backgroundImageMap[sceneImage];
          mapModalContent.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${imageUrl}') center center / cover no-repeat`;
        mapContainer.style.overflow = 'hidden'; // 禁止滚动
        mapContainer.style.background = 'none'; // 移除容器自身的网格背景

        // 让mapContent充满整个容器
        mapContent.style.width = '100%';
        mapContent.style.height = '100%';
        mapContent.style.transformOrigin = '0 0';


        // 2. 隐藏外部区域与禁用交互
        externalAreasContainer.style.display = '';
        // 在此模式下不设置拖拽和缩放，它们将不会被激活

        // 3. 渲染地点为圆点
        locationsToRender.forEach((location) => {
            const pointContainer = document.createElement('div');
            pointContainer.className = 'map-location-point-container';

            // 计算中心点坐标
            const centerX = location.x + location.width / 2;
            const centerY = location.y + location.height / 2;

            pointContainer.style.left = `${centerX}px`;
            pointContainer.style.top = `${centerY}px`;

            // 使用高度来模拟 Z-index，较高的点在视觉上可能更重要或更靠前
            pointContainer.style.zIndex = Math.round(location.y / 10);

            pointContainer.innerHTML = `
                <div class="location-tag">${location.name}</div>
                <div class="map-location-dot"></div>
            `;

            pointContainer.addEventListener('click', (e) => {
                e.stopPropagation();
                showModal('location-modal', location.name, location.description);
            });

            mapContent.appendChild(pointContainer);
        });

    } else {
        // --- 原始方块地图模式 ---

        // 1. 清理背景并恢复布局
        mapModalContent.style.background = ''; // 移除背景图，恢复默认
        mapContainer.style.overflow = ''; // 恢复默认overflow
        externalAreasContainer.style.display = ''; // 恢复显示
        mapContent.style.transformOrigin = '0 0';

        let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;

        locationsToRender.forEach(location => {
            minX = Math.min(minX, location.x);
            minY = Math.min(minY, location.y);
            maxX = Math.max(maxX, location.x + location.width);
            maxY = Math.max(maxY, location.y + location.height);
        });

        const sortedByHeight = [...locationsToRender].sort((a, b) => a.height - b.height);
        const zIndexMap = new Map();
        sortedByHeight.forEach((location, index) => {
            zIndexMap.set(location.name, sortedByHeight.length - index);
        });

        // 2. 渲染地点为方块
        locationsToRender.forEach((location) => {
            const locationElement = document.createElement('div');
            locationElement.className = 'map-location';
            if (updatedLocationNames.includes(location.name.trim())) {
                locationElement.classList.add('updated-location');
            }
            locationElement.style.left = `${location.x}px`;
            locationElement.style.top = `${location.y}px`;
            locationElement.style.width = `${location.width}px`;
            locationElement.style.height = `${location.height}px`;
            locationElement.style.zIndex = zIndexMap.get(location.name);
            locationElement.style.overflow = 'visible';
            locationElement.innerHTML = `<div class="location-name">${location.name}</div>`;
            locationElement.addEventListener('click', (e) => {
                e.stopPropagation();
                showModal('location-modal', location.name, location.description);
            });
            mapContent.appendChild(locationElement);
        });

        // 3. 设置容器尺寸和交互
        const finalWidth = maxX;
        const finalHeight = maxY;
        mapContent.style.width = `${finalWidth}px`;
        mapContent.style.height = `${finalHeight}px`;

        if (isFinite(minX) && isFinite(minY) && isFinite(maxX) && isFinite(maxY)) {
            let viewportWidth = mapContainer.clientWidth || 800;
            let viewportHeight = mapContainer.clientHeight || 600;

            const mapCenterX = (minX + maxX) / 2;
            const mapCenterY = (minY + maxY) / 2;

            window.mapState.translateX = (viewportWidth / 2) - mapCenterX;
            window.mapState.translateY = (viewportHeight / 2) - mapCenterY;
            window.mapState.scale = 1;

            window.applyMapTransform();

            setTimeout(() => { // 确保 DOM 更新后重新计算
                viewportWidth = mapContainer.clientWidth;
                viewportHeight = mapContainer.clientHeight;
                if (viewportWidth > 0 && viewportHeight > 0) {
                    window.mapState.translateX = (viewportWidth / 2) - mapCenterX;
                    window.mapState.translateY = (viewportHeight / 2) - mapCenterY;
                    window.applyMapTransform();
                }
            }, 10);
        }


    }
            // 4. 处理外部区域
        const externalAreasList = document.getElementById('external-areas-list');
        if (externalAreasList) {
            externalAreasList.innerHTML = '';
            externalAreas.forEach(area => {
                const areaElement = document.createElement('div');
                areaElement.className = 'external-area';
                areaElement.textContent = area.trim();
                externalAreasList.appendChild(areaElement);
            });
        }
    // console.log("=== 地图渲染完成 ===");
}


function showModal(modalId, title, description) {
        //console.log("showModal 函数被调用，ID为:", modalId);
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (title) {
            const titleEl = modal.querySelector('.modal-title');
            if(titleEl) titleEl.textContent = title;
        }

        if (description) {
    const descEl = modal.querySelector('.modal-description');
    if (descEl) {
        descEl.innerHTML = description; // 使用 innerHTML 来解析换行符
    }

    // 商店弹窗的特殊处理可以保留，或者如果它的class也是modal-description，就可以合并
    const messageEl = modal.querySelector('#shop-modal-message');
    if (messageEl) {
        messageEl.innerHTML = description;
    }
}

        modal.classList.add('active');
    
  }
  
  
    /**
     * 通用弹窗隐藏函数
     * @param {string} modalId - 弹窗的ID
     */
    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }


    /**
     * --- MODIFIED ---: 显示地图
     * 不再需要异步获取数据，直接使用已加载的 currentMapData
     */
    function showMap() { // 不再是 async 函数
        document.getElementById('world-info-content').style.display = 'none';
        document.getElementById('map-view').style.display = 'block';

        // 直接使用全局缓存的地图数据进行渲染
         renderMap(currentMapData, updateDetails.mapUpdates);
    }


    /**
     * 隐藏地图，回到世界信息
     */
    function hideMap() {
        document.getElementById('map-view').style.display = 'none';
        document.getElementById('world-info-content').style.display = 'block';
    }
        let updateDetails = {
            variable: false, // 恢复变量更新的flag
            memories: [],
            attributes: [],
            mapUpdates: []
        };


/**
 * 创建像素化canvas并应用到背景
 * @param {string} imageUrl - 图片URL
 * @param {number} pixelSize - 像素块大小，默认为8
 * @returns {Promise<string>} - 返回像素化后的图片数据URL
 */
function createPixelatedImage(imageUrl, pixelSize = 8) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 设置canvas尺寸
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 先绘制原图
            ctx.drawImage(img, 0, 0);
            
            // 获取图像数据
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // 像素化处理
            for (let y = 0; y < canvas.height; y += pixelSize) {
                for (let x = 0; x < canvas.width; x += pixelSize) {
                    // 获取当前块的平均颜色
                    let r = 0, g = 0, b = 0, a = 0, count = 0;
                    
                    for (let dy = 0; dy < pixelSize && y + dy < canvas.height; dy++) {
                        for (let dx = 0; dx < pixelSize && x + dx < canvas.width; dx++) {
                            const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
                            r += data[idx];
                            g += data[idx + 1];
                            b += data[idx + 2];
                            a += data[idx + 3];
                            count++;
                        }
                    }
                    
                    // 计算平均值
                    r = Math.round(r / count);
                    g = Math.round(g / count);
                    b = Math.round(b / count);
                    a = Math.round(a / count);
                    
                    // 填充整个像素块
                    for (let dy = 0; dy < pixelSize && y + dy < canvas.height; dy++) {
                        for (let dx = 0; dx < pixelSize && x + dx < canvas.width; dx++) {
                            const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
                            data[idx] = r;
                            data[idx + 1] = g;
                            data[idx + 2] = b;
                            data[idx + 3] = a;
                        }
                    }
                }
            }
            
            // 将处理后的数据绘制到canvas
            ctx.putImageData(imageData, 0, 0);
            
            // 转换为数据URL
            resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = reject;
        img.src = imageUrl;
    });
}




/**
 * 更新状态容器的背景样式
 * @param {Object} currentGameData - 当前游戏数据对象
 * @param {string} containerSelector - 容器的CSS选择器，默认为'.status-container'
 */
function updateContainerBackground(currentGameData, containerSelector = '.status-container') {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.warn(`容器 ${containerSelector} 未找到`);
        return;
    }

    // 获取场景图的值
    const sceneImage = SafeGetValue(currentGameData.场景图);
    
    // 判断场景图是否为空、null或"无"
    const isEmpty = !sceneImage || 
                   sceneImage === "" || 
                   sceneImage === null || 
                   sceneImage === "无" ||
                   sceneImage === "null" ||
                   sceneImage === undefined;

    if (isEmpty) {
        // 场景图为空时，使用网格背景
        setGridBackground(container);
    } else {
        // 场景图不为空时，使用对应的背景图片
        setImageBackground(container, sceneImage);
    }
}

/**
 * 设置网格背景样式
 * @param {HTMLElement} container - 容器元素
 */
function setGridBackground(container) {
    // 移除背景图片相关样式
    container.style.removeProperty('background');
    container.style.removeProperty('background-image');
    
    // 设置网格背景样式
    container.style.backgroundColor = 'var(--container-bg-color)';
    container.style.backgroundImage = `
        linear-gradient(90deg, var(--border-color) 1px, transparent 1px),
        linear-gradient(var(--border-color) 1px, transparent 1px)
    `;
    container.style.backgroundSize = '40px 40px, 40px 40px, 200px 200px, 300px 300px';
    container.style.backgroundPosition = '0 0, 0 0, 0 0, 0 0';
    container.style.transition = 'background-image 0.3s ease-in-out';
    
    console.log('已切换到网格背景');
}


/**
 * 修改后的setImageBackground函数，支持像素化效果
 */
function setImageBackground(container, sceneImage) {
    // 移除网格背景相关样式
    container.style.removeProperty('background-color');
    container.style.removeProperty('background-image');
    container.style.removeProperty('background-size');
    container.style.removeProperty('background-position');
    container.style.removeProperty('transition');
    
    // 根据映射表获取对应的URL
    let imageUrl = backgroundImageMap[sceneImage];
    
    // 如果映射表中没有找到，使用默认背景
    if (!imageUrl) {
       setGridBackground(container);
       return;
    }
    
    // 检查是否需要应用像素化效果
    if (container.dataset.pixelated === 'true') {
        // 应用像素化效果
        createPixelatedImage(imageUrl, 5).then(pixelatedUrl => {
            container.style.background = `var(--bg-image, url('${pixelatedUrl}')) center center / cover no-repeat`;
            console.log(`已应用像素化背景图片: ${sceneImage}`);
        }).catch(error => {
            console.error('像素化处理失败:', error);
            // 失败时使用原图
            container.style.background = `var(--bg-image, url('${imageUrl}')) center center / cover no-repeat`;
        });
    } else {
        // 使用原图
        container.style.background = `var(--bg-image, url('${imageUrl}')) center center / cover no-repeat`;
    }
    
    console.log(`已切换到背景图片: ${sceneImage} -> ${imageUrl}`);
}

/**
 * 切换像素化效果的函数
 * @param {string} containerSelector - 容器选择器
 * @param {boolean} enable - 是否启用像素化效果
 */
function togglePixelatedEffect(containerSelector = '.status-container', enable = true) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.warn(`容器 ${containerSelector} 未找到`);
        return;
    }
    
    container.dataset.pixelated = enable ? 'true' : 'false';
    
    // 重新应用当前背景（如果存在的话）
    if (typeof currentGameData !== 'undefined') {
        updateContainerBackground(currentGameData, containerSelector);
    }
}

 

 async function initDisplay() {
    try {
 

 // 设置高度为设备高度
document.getElementById('main-wrapper').style.height = window.innerHeight + 'px';

 const data = await getVariables({ type: 'message' });
  const chatdata = await getVariables({ type: 'chat' });

        // 缓存所有核心数据
        currentGameData = data.stat_data; // 保持对旧数据的引用
        assaSettingsData = data.assa_data;
        playCharacterData = data.play_character_data; // 新增：缓存角色模板数据
         checkMemoryData = data.检定记忆;
         worldAttitudeData = chatdata.跨世界声望说明;
        characterStatusData = chatdata.当前人物状态;



        if (!currentGameData || !assaSettingsData || !playCharacterData) {
            throw new Error("核心数据(stat_data, assa_data, or play_character_data)缺失");
        }
 togglePixelatedEffect('.status-container', true);
       const orb = document.getElementById('world-shard');
    if (!orb) return;
    
    // toggle的第二个参数决定是添加还是移除类
    orb.classList.toggle('warning-state', currentGameData.敌方攻击骰池[0] != '');

          // ========== 新增：成就系统 - 统一检查点 (开始) ==========
        // 每次刷新数据时，都对'data_refresh'类型的成就进行检查
        if(checkMemoryData){
            checkAchievements('check_complete', checkMemoryData);
        }
        checkAchievements('data_refresh', { currentGameData, playCharacterData, assaSettingsData });
        // ========== 新增：成就系统 - 统一检查点 (结束) ==========
        if (assaSettingsData.summary) {
             summarys = assaSettingsData.summary;
        }
 

        // 在 if (!currentGameData || !assaSettingsData || !playCharacterData) { 之后添加 null 判断：
if (!worldAttitudeData || !characterStatusData) {
    // 我们可以让它即使缺少这些新数据也能继续运行
    console.warn("部分非核心数据(跨世界声望说明, 当前人物状态)缺失，但不影响主要功能。");
}

        // 1. 填充非角色页面的数据
        populateGeneralData(currentGameData, assaSettingsData,playCharacterData);

        // 2. 填充全新的角色页面
        populateCharacterPage(playCharacterData, currentGameData, assaSettingsData);

   // 3. 缓存地图数据
        if (assaSettingsData && assaSettingsData.map) {
            currentMapData = assaSettingsData.map;
            // 将解析出的地图更新信息传递给 renderMap
            // 调试技巧：你可以在这里加一行 //console.log 来确认 `updateDetails.mapUpdates` 是否有值
            // //console.log("即将渲染地图，待更新地点:", updateDetails.mapUpdates);
            renderMap(currentMapData, updateDetails.mapUpdates);
        } else {
             console.warn("未能找到地图数据 (assa_data.map)");
             renderMap(null, []);
        }

        // 4. 渲染设定书
        renderSettingsBook(assaSettingsData);

       setupAllUpgradeListeners();

        // ========== 新增：成就系统UI交互 (开始) ==========
        const achievementBtn = document.getElementById('achievements-btn');
        const achievementModal = document.getElementById('achievements-modal');
        if (achievementBtn && achievementModal) {
            achievementBtn.addEventListener('click', () => {
                renderAchievements();
                showModal('achievements-modal');
            });
            const closeBtn = achievementModal.querySelector('.modal-close');
            if(closeBtn) {
                closeBtn.addEventListener('click', () => hideModal(achievementModal.id));
            }
        }

        const debugClearBtn = document.getElementById('debug-clear-achievements');
if (debugClearBtn) {
    debugClearBtn.addEventListener('click', () => {
        if (confirm('确定要清除所有成就数据吗？这将重置所有解锁状态。')) {
            localStorage.removeItem('achievements_data');
            alert('成就数据已清除！刷新页面或重新打开成就面板查看效果。');
            // 如果当前成就面板是打开的，重新渲染
            const modal = document.getElementById('achievements-modal');
            if (modal && modal.style.display !== 'none') {
                renderAchievements();
            }
        }
    });
}
        // ========== 新增：成就系统UI交互 (结束) ==========
 
        const zeroSkills = [];
        const skillCategories = playCharacterData["技能段"];

        for (const categoryKey in skillCategories) {
            const skills = skillCategories[categoryKey];
            for (const skillName in skills) {
                if (skills[skillName][0] === 0) {
                    // 将技能名和描述存起来
                    zeroSkills.push({ name: skillName, description: skills[skillName][1] });
                }
            }
        }

        // 2. 将这些技能转换为fixedItems格式
        const baseSkillItems = zeroSkills.map(skill => {
            const name = skill.name;
            const price = 1000;
            const category = "基础技能"; // 类型是基础技能
            const requirements = {}; // 无支线要求
            const effect =  `学会${name}`; // 效果直接用描述
            const description = skill.description; // 描述也用它本身

            return [name, price, category, requirements, effect, description];
            // 返回的格式: [名称, 积分价格, 分类, {所需支线}, 效果, 描述]
            // 注意：这里的“分类”参数位置，按照fixedItems的格式，我把它填为“基础技能”
        });

 
        fixedItems.unshift(...baseSkillItems);
        displayUpdateNotifications(updateDetails);


    } catch (error) {
        console.error("无法加载和初始化游戏数据:", error);
        // 你可以在这里添加一些用户友好的错误提示
    }

 

 // 替换整个 setupAllUpgradeListeners 函数
function setupAllUpgradeListeners() {
    const charPage = document.getElementById('page-character');// 我们先移除所有可能存在的旧监听器，确保干净
charPage.removeEventListener('dblclick', upgradeEventHandler);
// 如果有旧的点击监听器也一并移除（为了安全起见）
// charPage.removeEventListener('click', newUpgradeHandler); // 假设之前的 handler 叫这个名字

// 创建一个新的、聪明的点击处理器
const newUpgradeHandler = (e) => {
    // 我们只关心点击到 "upgrade-btn" 的事件
    if (e.target.classList.contains('upgrade-btn')) {
        upgradeEventHandler(e);
    }
};

// 为了防止重复绑定，我们可以在 page 元素上存储这个处理器
if (charPage._upgradeHandler) {
    charPage.removeEventListener('click', charPage._upgradeHandler);
}
charPage._upgradeHandler = newUpgradeHandler;
charPage.addEventListener('click', newUpgradeHandler);

// 如果你的 touchend 事件处理器 touchUpgradeHandler 存在，也在这里移除
// charPage.removeEventListener('touchend', touchUpgradeHandler);

//console.log('升级监听器已更新为 “点击加号” 模式');
}

// 触摸事件处理器
let lastTouchEnd = 0;
let touchTarget = null;
let touchTimeout = null;

function touchUpgradeHandler(event) {
    const now = Date.now();
    const target = event.target;
    
    // 检查是否是可升级的元素
    const upgradeableElement = target.closest('.upgradeable');
    if (!upgradeableElement) return;
    
    // 双击检测逻辑
    if (touchTarget === upgradeableElement && now - lastTouchEnd <= 500) {
        // 清除可能的单击延时
        if (touchTimeout) {
            clearTimeout(touchTimeout);
            touchTimeout = null;
        }
        
        // 阻止默认行为和事件冒泡
        event.preventDefault();
        event.stopPropagation();
        
        // 触发升级事件
        upgradeEventHandler.call(upgradeableElement, event);
        
        // 重置状态
        lastTouchEnd = 0;
        touchTarget = null;
    } else {
        // 记录这次触摸
        touchTarget = upgradeableElement;
        lastTouchEnd = now;
        
        // 设置延时清除，避免误触发
        touchTimeout = setTimeout(() => {
            touchTarget = null;
            lastTouchEnd = 0;
        }, 500);
    }
}

 
 
// 替换原有的 const target = e.target.closest('.upgradeable');
function upgradeEventHandler(e) {
    const target = e.target; // 现在直接就是我们点击的那个 "+" 按钮
    if (target) { // 简单检查一下
        const { path, name, level, type } = target.dataset;
        handleUpgrade(path, name, parseInt(level, 10), type);
    }
}

}
  

/* 代码 START: 添加在这里 */

/**
 * 新增：根据解析出的标志，更新UI上的通知提示
 * @param {object} flags - 包含更新标志的对象
 */
function displayUpdateNotifications(details) {
    const notifier = document.getElementById('update-notifier');
    if (!notifier) return;

    let messages = [];

    const uniqueMemories = [...new Set(details.memories)];
    const uniqueAttributes = [...new Set(details.attributes)];
    // 地图更新的提示现在也显示具体名称，更清晰
    const uniqueMapUpdates = [...new Set(details.mapUpdates)];

    if (details.variable) messages.push(`状态有更新`);
    if (uniqueMemories.length > 0) messages.push(`记忆设定更新: ${uniqueMemories.join('， ')}`);
    if (uniqueAttributes.length > 0) messages.push(`角色数值更新: ${uniqueAttributes.join('， ')}`);
    if (uniqueMapUpdates.length > 0) messages.push(`地图记忆更新: ${uniqueMapUpdates.join('， ')}`);

    if (messages.length > 0) {
          const notificationMessage = `系统感知到以下更新：<div style="text-align: left; padding-top: 10px;">${messages.map(msg => `&bull; ${msg}`).join('<br>')}</div>`;
        notifier.style.display = 'flex';

        // 移除旧的监听器，防止重复绑定
        const newNotifier = notifier.cloneNode(true);
        notifier.parentNode.replaceChild(newNotifier, notifier);

        // 为新的元素添加事件监听
        newNotifier.addEventListener('click', () => {
            showModal('shop-modal', '更新提醒', notificationMessage);
        });

    } else {
        notifier.style.display = 'none';
    }
}
/**
 * 修改：填充行囊管理弹窗，数据源改为 assa_data.global_set.背包
 */
function populateInventoryModal() {
    const inventoryList = document.getElementById('inventory-item-list');
    const deleteBtn = document.getElementById('delete-item-btn');
    const useBtn = document.getElementById('use-item-btn');
    inventoryList.innerHTML = '';
    deleteBtn.disabled = true;
    useBtn.disabled = true;

    const inventoryData = assaSettingsData.global_set?.背包;

    if (!inventoryData || Object.keys(inventoryData).length === 0) {
        inventoryList.innerHTML = '<li style="color:var(--text-secondary-color); text-align:center; padding:20px 0;">行囊是空的</li>';
        return;
    }

    for (const itemName in inventoryData) {
         const item = inventoryData[itemName];
         let  itemDesc = '';
        if (typeof item === 'string') {
    // 直接使用字符串数据
    itemDesc ="："+item;
} else if (typeof item === 'object' && item !== null) {
     itemDesc ="："+item?.info || '';
}
       
        const li = document.createElement('li');
        li.className = 'inventory-item';
        // 显示名称和描述
        li.textContent = `${itemName}${itemDesc}`;
        li.dataset.item = itemName; // 用 item name 作为 key
        inventoryList.appendChild(li);
    }
}
    
       // 替换为:
const fixedItems = [
    // 格式: [名称, 积分价格, 分类, {所需支线}, 效果, 描述]
     ["压缩饼干", 50, "物品", {}, "填饱肚子", "一块可以提供一天能量的高热量饼干，味道不怎么样。"],
    ["纯净水", 20, "物品", {}, "解渴", "经过净化的饮用水，500毫升装。"],
    ["新手匕首", 300, "物品", {}, "【力量+1】基础的近战武器", "一把平平无奇的铁匕首，聊胜于无。"],
    ["布甲", 600, "物品", {}, "【防御+5】提供少量物理防御", "由粗布制成的简易护甲，能抵挡一些轻微的划伤。"],
    ["解毒剂", 400, "物品", {}, "解除普通中毒状态", "一小瓶绿色的液体，可以中和多种常见毒素。"],
    ["帐篷", 1000, "物品", {}, "提供一个安全的休息场所", "简单的单人帐篷，可以在野外提供遮风避雨的地方。"],
    ["火把", 50, "物品", {}, "提供照明", "可以燃烧一小时的火把，驱散黑暗。"],
    ["钢制长剑", 1500, "物品", {}, "【力量+2】比新手匕首更强的武器", "一把做工精良的钢剑，兼具劈砍与刺击能力。"],
    ["锁子甲", 3500, "物品", {}, "【防御+15】提供较好的物理防御", "由铁环编织而成的护甲，对切割伤害有很好的防御效果。"],
    ["爆裂箭", 800, "物品", {}, "命中目标后会发生小范围爆炸的箭矢", "弓箭手的利器，可以对付聚集在一起的敌人。"],
    ["生命药水", 500, "物品", {}, "恢复50点生命值", "一瓶透出红光的液体，能够快速恢复伤势。"],
    ["魔法药水", 800, "物品", {}, "恢复50点能量池", "蓝色的神秘药剂，蕴含着纯净的魔法能量。"],
    ["急救包", 300, "物品", {}, "处理外伤，止血", "包含绷带、消毒药水和止痛药的医疗用品。"],
     ["万能钥匙", 1200, "物品", {}, "可以开启大部分普通门锁", "一把看起来很普通的钥匙，但内部结构极其精巧。"],
    ["翻译耳塞", 4000, "物品", {}, "实时翻译听到的所有语言", "高科技造物，让你无障碍地与任何智慧生命沟通。"],
    ["能量棒", 100, "物品", {}, "迅速补充体力", "味道像巧克力的能量棒，能快速恢复消耗的体力。"],
    ["闪光弹", 400, "物品", {}, "【隐藏+1】一次性物品，产生强光和巨响，使敌人暂时失明失聪", "战术性道具，可以为自己创造机会。"],
    ["附魔之尘", 900, "物品", {}, "为武器或防具附加临时的微弱属性提升", "闪亮的魔法粉末，可以少量增强装备性能。"],
    ["自动书记人偶", 7000, "物品", {}, "【调查+2】可以自动记录语言和画面的机械人偶", "来自科技世界的侦查与记录工具，非常可靠。"],
    ["伪装工具包", 1300, "物品", {}, "【掩饰+1】包含化妆品和假发等，可以改变外貌", "进行潜入任务时的好帮手。"],
    ["毒药（普通）", 500, "物品", {}, "【力量+1】一次性用品，可以涂抹在武器上，使敌人中毒", "常见的神经毒素，会让目标持续损失生命值并陷入麻痹。"],
    ["攀爬手套", 1100, "物品", {}, "【运动+1】手套表面有极强的吸附力，可以轻松攀爬墙壁", "壁虎一样的能力，让你到达常人无法企及之处。"],
    ["营养膏（草莓味）", 30, "物品", {}, "提供基础营养", "一支牙膏状的糊状食物，能满足一天的基本营养需求，味道聊胜于无。"],
    ["军用口粮", 150, "物品", {}, "提供能量和饱腹感，附带加热包", "比压缩饼干好吃一点，内含主食、配菜和甜点，是士兵的标准配置。"],
    ["疗伤草药", 200, "物品", {}, "捣碎后外敷，止血并加速轻伤愈合", "来自武侠世界的常见草药，对刀剑伤有不错的效果。"],
    ["烟雾弹", 350, "物品", {}, "【隐藏+1】一次性物品，制造一片浓烟，遮蔽视线", "忍者常用的道具，用于撤退或制造混乱。"],
    ["精制飞刀（三把）", 450, "物品", {}, "【弓箭+1】可以投掷的锋利小刀", "经过特殊配重，比普通小刀更容易命中目标。"],
    ["过滤水壶", 700, "物品", {}, "能将污染水源过滤成可饮用的纯水", "末世生存的必备品，可以反复使用100次。"],
    ["十字弩", 2000, "物品", {}, "【弓箭+1】无声的远程武器，威力尚可", "比弓箭更容易上手，上弦速度较慢是其缺点。"],
    ["防毒面具", 1400, "物品", {}, "【医学+1】过滤有毒气体", "可以抵御大部分化学毒气和生物毒气，滤芯需定期更换。"],
    ["夜视仪（初级）", 2800, "物品", {}, "在黑暗中提供视觉", "来自科技世界的装备，让你在夜晚也能像白天一样行动。"],
    ["精灵之泉水（100ml）", 8500, "物品", {}, "净化负面状态，缓慢恢复生命和魔力", "来自精灵圣地的泉水，充满了自然的生命能量。"],
    ["空间道标（一次性）", 15000, "物品", {}, "记录当前空间坐标，可随时传送回此地", "非常珍贵的保命道具，在任务世界设置后，无论身在何处都能瞬间返回。"],
    ["龙鳞盾", 25000, "物品", {}, "【防御+50】提供极高的火焰抗性和物理防御", "用成年火龙的鳞片打造的盾牌，坚不可摧。"],
    ["便携式机甲召唤器", 40000, "物品", {}, "【力量+5】召唤一台制式轻型机甲协助作战", "内置AI辅助操作系统，可以提供强大的火力支援，能量耗尽后自动收回。"],
      ["Ex-咖喱棒（仿制品）", 70000, "物品", {}, "【力量+10】可释放一次强大的光炮攻击", "模仿传说中圣剑的魔力道具，威力只有原版的百分之一，但足以摧毁一座小山。使用后道具损毁。"],
 ["老旧的G17", 3000, "物品", {}, "【枪械+1】无限子弹", "一把随处可见的9毫米手枪，性能平庸但极为可靠，是无数新手冒险者开启他们旅程的第一个伙伴。"],
    ["MP5K-N", 4500, "物品", {}, "【枪械+1】无限子弹，射速快", "紧凑型的冲锋枪，便于携带。极高的射速让它在狭窄空间里能泼洒出致命的弹雨。"],
    ["鬣狗-12", 5000, "物品", {}, "【枪械+2】无限子弹，近距离高伤害", "基础的泵动式霰弹枪，每一次上膛都充满了力量感。只要距离够近，再凶猛的野兽也得退让三分。"],
    ["SKS", 5000, "物品", {}, "【枪械+2】无限子弹，半自动射击", "一把老式的半自动步枪，精准度尚可，威力适中，深受那些喜欢精确打击而非胡乱扫射的实用主义者喜爱。"],
    ["牧马人", 4000, "物品", {}, "【枪械+2】无限子弹，单发伤害较高", "一把充满西部风情的左轮手枪。虽然装弹慢，但每一发子弹都沉重而有力，带着开拓者的精神。"],
    ["AK-74M", 8000, "物品", {}, "【枪械+3】无限子弹，皮实耐用", "经典突击步枪的现代化改进型，无论在多恶劣的环境下都能正常工作，是游击战和长期任务的绝佳选择。"],
    ["M4A1", 10000, "物品", {}, "【枪械+3】无限子弹，配件接口丰富", "一把高度模块化的卡宾枪，性能均衡，手感极佳。无数的战术配件让它可以适应任何战场环境。"],
    ["SPAS-12", 12000, "物品", {}, "【枪械+3】无限子弹，可切换射击模式", "一把造型凶悍的战斗霰弹枪，可以在迅速的半自动射击和精准的泵动模式之间切换，兼具速度与威力。"],
    ["猎手SR", 15000, "物品", {}, "【枪械+3】无限子弹，中距离精准", "专为精准射手设计的步枪，虽然不是专业的狙击枪，但在中距离上能提供持续而精确的火力支援。"],
    ["沙鹰.50", 18000, "物品", {}, "【枪械+3】无限子弹，巨大威力", "手枪中的巨炮。巨大的后坐力和震耳欲聋的枪声是它无与伦比威力的证明，是力量的象征。"],
    ["P90", 16000, "物品", {}, "【枪械+3】无限子弹，高穿透力", "设计前卫的个人防卫武器，独特的供弹方式和高穿透力的子弹让它在面对轻型护甲的敌人时极具优势。"],
    ["FN SCAR-H", 20000, "物品", {}, "【枪械+3】无限子弹，高停止作用", "使用大威力步枪弹的战斗步枪，每一发命中都能有效阻止敌人的行动，是小队中的中坚力量。"],
    ["AWM", 25000, "物品", {}, "【枪械+3】无限子弹，超远程狙击", "狙击手中的传奇。独特的马格南子弹赋予了它极远的射程和恐怖的精度，是所有脆皮目标的噩梦。"],
    ["Vector", 22000, "物品", {}, "【枪械+3】无限子弹，极致射速", "通过复杂的枪机设计将后坐力降到最低，从而实现了冲锋枪中近乎顶级的射速，能在瞬间撕碎任何目标。"],
    ["蒸汽钻孔者", 28000, "物品", {}, "【枪械+3】无限子弹，对机械单位造成额外伤害", "一把由黄铜和精密齿轮构成的蒸汽朋克杰作，射出的高压弹头能有效瓦解机械构造，是工程师和古代遗迹探索者的最爱。"],
    ["守护者十字弩", 30000, "物品", {}, "【枪械+3】无限子弹，无声射击，箭矢附带追踪效果", "古老技艺与现代科技的结合，射击时悄无声息，附魔的箭矢会自动标记被命中的目标，让其无所遁形。"],
    ["火焰喷射器MK1", 35000, "物品", {}, "【枪械+5】无限燃料，范围持续伤害", "简单粗暴的范围清理工具，能喷射出灼热的凝固燃料，对集群的无甲目标和据点能造成毁灭性打击。"],
    ["M249", 40000, "物品", {}, "【枪械+5】无限子弹，火力压制", "班用自动武器，旨在提供不间断的火力压制。它的存在本身就是对敌人勇气的一种考验。"],
    ["炼金左轮", 45000, "物品", {}, "【枪械+5】无限子弹，可切换火、冰、电三种元素伤害", "一位疯狂炼金术士的杰作，转动轮盘，就能让子弹附上不同的元素之力，用以针对不同敌人的弱点。"],
    ["G36C", 38000, "物品", {}, "【枪械+3】无限子弹，自带光学瞄具", "一把紧凑型突击步枪，工程塑料枪身和自带的低倍瞄具让它拥有极高的精准度和舒适的操作手感。"],
    ["巴雷特M82A1", 50000, "物品", {}, "【枪械+3】无限子弹，反器材伤害", "战场上的“重炮”，发射的.50 BMG子弹能轻易撕开轻型载具的装甲和掩体，是攻坚战的利器。"],
    ["AA-12", 60000, "物品", {}, "【枪械+5】无限子弹，全自动霰弹", "近距离巷战的终极答案。这把全自动霰弹枪能像突击步枪一样泼洒出毁灭性的弹丸，将前方的一切化为碎片。"],
    ["脉冲卡宾枪XR-5", 70000, "物品", {}, "【枪械+3】无限能源，对能量护盾造成双倍伤害", "来自高科技世界的制式武器，发射的高能脉冲能有效过载能量护盾，是星际陆战队的标配。"],
    ["暗影低语", 80000, "物品", {}, "【枪械+3】无限子弹，击杀后获得短暂隐形", "一把通体漆黑的消音狙击步枪，它的枪声如同耳语般微弱。持有者能在完成击杀后融入阴影，重新寻找下一个目标。"],
    ["开膛手", 85000, "物品", {}, "【枪械+5】无限子弹/燃料，枪身下挂链锯", "废土科技的狂野产物，既能进行远程射击，也能在近身时启动下挂的链锯，给予敌人最直接的痛苦。"],
    ["M134‘米尼岗’", 90000, "物品", {}, "【枪械+5】无限子弹，射速随预热提升", "需要预热才能发挥全部威力的多管机枪，一旦枪管旋转起来，它喷射出的金属风暴将是所有人的末日。"],
    ["黄蜂巢", 95000, "物品", {}, "【枪械+5;科学+1】无限弹药，一次发射多枚追踪微型导弹", "与其说是枪，不如说是一个便携式导弹发射平台。每次扣动扳机都会射出一窝如黄蜂般追踪敌人的小型导弹。"],
    ["蠕虫发射器", 100000, "物品", {}, "【枪械+5;神秘学+2】无限弹药，子弹为活体追踪蠕虫", "令人毛骨悚然的生化武器，发射出的寄生蠕虫会钻入目标体内持续造成伤害，并削弱其防御。"],
    ["奥术师的法杖步枪", 120000, "物品", {}, "【枪械+5;神秘学+3】无限魔力，命中后随机附加一种负面魔法效果", "将魔法法杖与步枪结构结合的奇特武器，每一发水晶子弹都蕴含着混乱的魔力，可能让敌人燃烧、冰冻或迟缓。"],
    ["奇点产生器", 150000, "物品", {}, "【枪械+5;科学+3】无限弹药，子弹在落点产生小型引力场", "实验性的时空武器，它射出的子弹会在爆炸时扭曲空间，产生一个短暂的微型黑洞，将附近的敌人和物体吸向中心。"],
    ["等离子切割者", 130000, "物品", {}, "【枪械+3】无限能源，持续射击可融化重型装甲", "工业用的等离子切割工具被改造成了武器，其射出的超高温等离子束可以像切黄油一样切开最坚固的合金装甲。"],
    ["幽魂M1911", 110000, "物品", {}, "【枪械+3】无限子弹，被击中者会看到恐怖的幻觉", "一把被强大怨灵附身的经典手枪，它的子弹不仅伤害肉体，更会侵蚀心智，让敌人在恐惧的幻象中崩溃。"],
    ["齿轮风暴", 140000, "物品", {}, "【枪械+3】无限子弹，射速随持续射击线性提升", "蒸汽朋克工艺的顶峰之作，内部无数精密齿轮的联动让它的射速能不断攀升，直至化为一场毁灭性的机械风暴。"],
    ["雷神之锤SMG", 160000, "物品", {}, "【枪械+3】无限能源，命中后触发连锁闪电", "据说是矮人与风暴巨人合作打造的武器，每一发闪电弹命中目标后，都会爆发出连锁闪电，攻击周围的其他敌人。"],
    ["HK416-D", 105000, "物品", {}, "【枪械+3】无限子弹，极高的综合性能与可靠性", "现实世界特种部队的宠儿，在主神空间里也同样如此。它在威力、精度、射速和可靠性上达到了完美的平衡。"],
    ["高斯步枪‘磁暴’", 200000, "物品", {}, "【枪械+3】无限能源，子弹瞬时到达且能穿透大多数掩体", "利用电磁加速原理发射弹丸，子弹出膛即命中，无声无光，无视风偏和重力，是完美的刺杀武器。"],
    ["龙息之吼", 250000, "物品", {}, "【枪械+13;胁迫+3】无限燃料，喷射出锥形的龙息", "用一头成年火龙的头骨和声带制成的武器，扣动扳机时，它会发出巨龙的咆哮，并喷射出毁灭性的龙息。"],
    ["碎星者", 300000, "物品", {}, "【枪械+13;科学+4】无限能源，蓄力发射贯穿一切的粒子束", "一把手枪尺寸的轨道炮。通过短暂蓄力，它可以发射出一道能量光束，贯穿路径上的一切，无论敌人还是墙壁。"],
    ["虚空行者", 350000, "物品", {}, "【枪械+15】无限弹药，命中时有几率将目标随机传送", "一把连接着异次元的武器，它的子弹有时会撕开空间的裂隙，将被击中者强行驱逐到未知的随机地点。"],
    ["生命汲取者", 400000, "物品", {}, "【枪械+15】无限弹药，将造成伤害的一部分转化为持有者的生命值", "活体生化狙击枪，枪身与使用者有着微弱的共生关系。它造成的每一分伤害，都会化为生命能量反哺给它的主人。"],
    ["时间扭曲者", 450000, "物品", {}, "【枪械+15】无限弹药，命中后在目标周围制造一个时间减速力场", "来自超未来文明的禁忌科技，它的子弹可以扰乱局部的时间流速，让敌人的一切动作都变得像慢镜头一样。"],
    ["因果律修正器", 500000, "物品", {}, "【枪械+15】无限子弹，非致命部位命中强制判定为致命部位命中", "一把触及世界底层法则的概念武器。只要子弹命中目标，它就会修正“结果”，将原本的擦伤强制改写为“爆头”或“心脏碎裂”。"],
    ["黑森林的低语", 480000, "物品", {}, "【枪械+15】无限弹药，命中后召唤藤蔓束缚目标", "由世界之树的树枝精心雕刻而成，充满了自然之力。命中的敌人会被大地中涌出的活体藤蔓牢牢捆绑。"],
    ["万华镜", 420000, "物品", {}, "【枪械+15】无限弹药，射出制造大量幻影分身的能量", "一把充满迷幻色彩的霰弹枪，射出的不是弹丸，而是无数个使用者自己的幻影，足以迷惑和扰乱任何敌人。"],
    ["天谴", 550000, "物品", {}, "【枪械+15;科学+3】无限能源，照射目标以引导一次卫星轨道炮打击", "它本身没有杀伤力，而是一个信标枪。用它瞄准并照射目标数秒后，天基动能武器系统将执行“天谴”，从太空中投下毁灭。"],
    ["阿撒托斯之笛", 800000, "物品", {}, "【枪械+20;操控+10】无限能源，发射直接攻击心智的无形音波，无视物理防御", "外形是一根怪异的长笛，但能发射武器化的次声波。它绕过所有物理防御，直接在目标的脑海中奏响疯狂的乐章。"],
    ["G.O.D. (创世纪条例装置)", 1000000, "物品", {}, "【枪械+20;科学+15】无限能源，可将非生命体分解或临时复制", "一把拥有有限“创物”权能的装置。它可以将物质分解为基础能量，或利用能量短暂复制一个脆弱的赝品，充满了战术可能性。"],
    ["第四面墙破坏者", 1200000, "物品", {}, "【枪械+20;神秘学+20】无限墨水，射出可修改目标状态的“文字”弹", "一把形似打印机的元武器，它射出的子弹是具现化的“数据”和“文字”。理论上，它可以直接将敌人的状态“生命值：100%”修改为“生命值：1%”。"],
    ["真理", 1500000, "物品", {}, "【枪械+40】无限子弹，强制进行理念判定，胜者抹除败者", "银色的P226手枪外形下，隐藏着哲学层面的恐怖力量。开枪时，它比较的是双方的“信念强度”，如果你的“理念”压倒对方，对方将从存在层面上被直接抹除。"],
    ["初始之枪", 2000000, "物品", {}, "【枪械+40;科学+40】无限？？？，射出一个瞬时生灭的微型宇宙", "传说这是用宇宙大爆炸奇点碎片打造的武器。扣动扳机，你开启了一个新的宇宙，又在瞬间见证了它的灭亡。其产生的效果完全随机，可能是时间倒流，也可能是一朵毫无用处的花，拥有无限的可能性。"],
    ["永恒之泉的小小喷泉", 5000, "家具", {}, "放置在空间内，每日可产出一瓶‘活力泉水’，饮用后30分钟内精神力恢复速度提升5%。纯粹的装饰品，带来潺潺水声。", "10, 10, 20, 20, 一座由月光石雕刻而成的小喷泉，泉水在微光下泛着柔和的银色光泽。"],
    ["浮空城的水晶碎片", 12000, "家具", {}, "悬浮在半空中，缓慢旋转。靠近时，思维会变得更加清晰，破解谜题或进行创造性工作时效率提升10%。", "40, 15, 10, 10, 一块不规则的透明水晶，内部似乎有云雾在流动，散发着微弱的凉意。"],
    ["世界树的盆栽", 25000, "家具", {}, "缓慢生长，每日可在枝叶上凝结出一滴‘生命甘露’，可瞬间治愈轻微伤势。空间内的植物生长速度略微加快。", "60, 10, 15, 25, 一株小巧的树苗，树干和枝叶呈现出温润的玉石质感，散发着蓬勃的生命气息。"],
    ["矮人符文锻造台", 45000, "家具", {}, "可以在此为装备附加初级符文效果（如：锋锐I，坚固I）。需要消耗对应的材料。失败率较高。", "10, 40, 40, 30, 一张由黑曜石和黄铜打造的坚固工作台，台面上刻满了复杂的矮人符文，中心有一个嵌入式的熔炉。"],
    ["星空穹顶投影仪", 80000, "家具", {}, "启动后，个人空间的天花板会变为实时变化的宇宙星空，美轮美奂。长期观看可以缓慢提升精神力上限。", "0, 0, 1, 1, 这件物品会直接作用于整个空间的天花板，因此其物理尺寸极小，只是一个黑色的金属球体。它的描述坐标代表它被放置在地面中心。"],
    ["深渊凝视之镜", 150000, "家具", {}, "一面古老的黑曜石镜，每日可进行一次‘凝视’。凝视者有机会窥见未来的一个模糊片段，但也有可能被深渊反噬，随机一项属性暂时降低24小时。", "80, 20, 15, 40, 镜框由扭曲的不知名金属制成，镜面漆黑如墨，无法映照出任何东西，只会让人感到心悸。"],
    ["赛博朋克霓虹吧台", 3000, "家具", {}, "纯观赏用，会循环播放迷幻的电子音乐，并闪烁着五彩斑斓的霓虹灯光，为你的空间增添一丝未来都市的颓废气息。", "100, 10, 50, 20, 一个带有金属光泽的吧台，边缘和台面下都嵌满了霓虹灯管，上面随意放着几个高脚杯。"],
    ["懒人精灵豆袋沙发", 1500, "家具", {}, "极致舒适。躺在上面休息时，体力恢复速度提升20%。由精灵用月光下的棉花和安神草编织而成。", "100, 40, 25, 15, 一个巨大的、看起来就非常柔软的豆袋沙发，布料是淡绿色的，上面有银色的叶脉纹路。"],
    ["蒸汽动力自走书架", 32000, "家具", {}, "可以通过语音指令或终端控制，让书架自动找到并送来你想要的任何一本（已收藏的）书籍。自带防尘和恒温恒湿功能。", "10, 80, 60, 50, 一个由黄铜和红木制成的巨大书架，底部有复杂的齿轮和履带结构，几根蒸汽管道从顶部延伸出来，不时冒出白气。"],
    ["血肉滋生之座", 220000, "家具", {}, "一个活体家具。坐上去时，它会缓慢地与使用者建立精神链接，大幅加快生命力和精神力的恢复速度（每分钟恢复1%）。但长时间使用可能会让人的思维方式产生异变。", "160, 10, 30, 30, 一张看起来像是某种生物组织的椅子，呈现出深红色，表面有血管一样的纹路在搏动，整体轮廓在不停地进行着微小的蠕动和重塑。"],
    ["阴阳双鱼池", 75000, "家具", {}, "一个太极形状的水池，里面养着一黑一白两条灵鲤。每日可进行一次投喂，根据灵鲤的反应，可能会获得‘好运’或‘霉运’的临时状态。", "130, 50, 40, 40, 由黑白两色的玉石砌成的水池，池水清澈见底，两条鲤鱼在其中追逐嬉戏，构成了一副流动的太极图。"],
    ["全息战术沙盘", 98000, "家具", {}, "可以导入任务世界的地图数据，进行三维全息模拟，推演战术。盟友也可以被邀请进入空间共同使用。", "80, 70, 40, 40, 一个方形的金属平台，启动后会在上方投射出高精度的三维地形图，可以用手势进行缩放、旋转和标记。"],
    ["龙骨王座", 500000, "家具", {}, "由一头成年红龙的头骨和脊椎制成。坐上王座时，会自然散发出龙威，对龙类及亚龙生物有威慑效果，在与其实力相近的生物交涉时，气势上获得优势。", "200, 10, 40, 60, 一张充满了原始与力量美感的巨大座椅，头骨构成了椅背，狰狞的龙角向上延伸，扶手是粗壮的腿骨，整体呈现出骨白色和暗红色。"],
    ["失落神庙的祭坛", 880000, "家具", {}, "一个古老而残破的石制祭坛。每周可以将一件物品作为祭品献上，有一定几率将其强化，也有很大几率使其损毁，极小几率发生意想不到的奇迹蜕变。", "250, 20, 50, 30, 由巨大的青石堆砌而成，上面布满了青苔和意义不明的古老雕刻，祭坛中心有一个凹陷的血槽。"],
    ["厨神的小铺", 4000, "家具", {}, "一个简单的日式拉面摊位。虽然不能制作出什么神奇料理，但坐在这里吃一碗热气腾腾的面，可以驱散大部分负面精神状态（如：沮丧，恐惧）。", "180, 80, 30, 25, 一个小小的木制摊位，挂着写有‘ラーメン’的布帘，后面有简单的灶台和几个座位。"],
    ["寂静森林的一角", 6000, "家具", {}, "一片小小的林地，有几棵高大的树和柔软的草坪。在其中冥想时，心境会变得格外平和。纯观赏和放松用。", "220, 80, 50, 50, 这片区域的地面变成了真实的泥土和草地，几棵白桦树安静地伫立着，阳光会恰到好处地从枝叶间洒落。"],
    ["反重力睡眠舱", 38000, "家具", {}, "进入睡眠舱后，会处于微重力状态，让身体得到最彻底的放松。睡眠8小时等同于普通睡眠12小时的效果，且醒来后精神饱满。", "310, 10, 20, 40, 一个充满科幻感的白色金属舱，外形流畅，舱门是透明的，可以看到内部柔软的衬垫。工作时会悬浮在离地半米的高度。"],
    ["时空旅者的留声机", 110000, "家具", {}, "一台维多利亚风格的黄铜留声机。它没有唱片，但每天可以随机播放一段来自其他时间线或异世界的音乐、对话或声音片段。可能会听到有用的情报，也可能只是噪音。", "340, 20, 15, 20, 精致而古典的留声机，大喇叭闪耀着金属光泽，机身上有许多看不懂的刻度和表盘。"],
    ["剑冢", 190000, "家具", {}, "将自己的兵器插入其中蕴养，可以缓慢提升兵器的品质，并有极小几率让兵器诞生‘器灵’。一次只能蕴养一件兵器。", "310, 70, 30, 30, 一座由无数断剑残兵堆积而成的小丘，中心有一块黑色的巨大磨剑石，散发着凌厉的剑意。"],
    ["‘家’的投影", 1000, "家具", {}, "一个简单的相框。使用者可以将自己心中最想念的家的影像投射其中，影像会动态变化，仿佛时间在流动。无任何实际增益，纯粹的情感慰藉。", "360, 20, 10, 8, 一个朴素的木质相框，没有照片，只有一片柔和的白光，使用者触碰时，白光会变为其思念的场景。"],
    ["神圣光明教堂的告解室", 55000, "家具", {}, "一个隔音效果极好的小房间。在其中进行忏悔或倾诉，可以显著缓解内心的负罪感和压力，并获得一个名为‘心灵净化’的临时状态，豁免一次精神控制类技能。", "380, 10, 30, 40, 一个由深色木材打造的独立小隔间，内部有一张跪凳和一道带有格栅的隔窗。充满了庄严肃穆的氛围。"],
    ["混沌几何雕塑", 130000, "家具", {}, "一个由不断变化的几何体组成的、违反物理规则的动态雕塑。直视它会导致轻微的眩晕，但也能锻炼精神抵抗混乱信息的能力。", "420, 20, 20, 20, 它看起来像一团由黄铜线条构成的、不断在四维空间翻转的立方体，时而展开时而收缩，没有固定的形态。"],
    ["虚空垂钓台", 280000, "家具", {}, "一个延伸至空间边缘之外的平台。使用者可以在此垂钓，钓上来的可能是来自无尽虚空的稀有材料、漂流的灵魂瓶、甚至是某个世界的‘概念’碎片。", "450, 10, 20, 15, 一个由未知黑色岩石构成的平台，末端消失在空间的边界，仿佛融入了虚无之中。需要特制的‘虚空鱼竿’配合使用（商城另购）。"],
    ["万界之窗", 999990, "家具", {}, "一扇巨大的落地窗。每天，窗外的景色都会随机变为一个异世界的实时风景，可能是巨龙飞舞的奇幻山巅，也可能是霓虹闪烁的赛博都市。使用者无法穿过窗户，但可以感受那个世界的气息。", "500, 10, 80, 60, 一扇华丽的、镶嵌着宝石和符文的拱形窗户，窗外是流光溢彩的动态景象，而非固定的空间背景。"],
    ["时间沙漏", 420000, "家具", {}, "一个巨大的沙漏。可以消耗大量积分来将整个个人空间的时间流速进行微调（最高减缓至0.8倍，或加速至1.2倍）。调整会持续24小时。", "600, 20, 25, 40, 沙漏的框架由白金打造，里面的沙子是璀璨的钻石尘埃，流动时散发出柔和的光芒。"],
    ["起源熔炉", 2500000, "家具", {}, "传说中能锻造神器的熔炉的复制品。拥有极高的成功率，可以将多件传奇物品与稀有材料融合，创造出独一无二的、全新的物品。每次使用都需要消耗巨量积分作为能源。", "10, 150, 80, 70, 一座如同小型火山般的巨大熔炉，由暗红色的金属构成，上面刻满了原始而古老的火焰图腾，即使不点火也散发着惊人的热量。"],
    ["棋圣的棋盘", 70000, "家具", {}, "一张古朴的围棋棋盘。可以召唤一个名为‘棋圣’的AI进行对弈。每赢一局，精神力都会获得永久性的微量增长。被AI击败则会陷入1小时的思维混乱状态。", "100, 160, 20, 20, 一张由整块香樟木雕成的棋盘，棋子是温润的黑白玉石，自带一种让人心平气和的气场。"],
    ["无限书库的终端", 650000, "家具", {}, "一个数据终端，可以连接到传说中的‘无限书库’。使用者可以消耗积分查阅几乎所有非神明级别的知识和信息，价格取决于信息的珍稀程度。", "130, 150, 15, 25, 一个流线型的、悬浮在空中的操作台，屏幕是淡蓝色的光幕，上面有无数数据流在闪动。"],
    ["妖精的茶会桌", 18000, "家具", {}, "一套精致小巧的桌椅。每天下午三点，桌上会自动出现一套美味的下午茶点心和红茶，食用后心情会变得愉悦。可以邀请朋友共享。", "160, 160, 30, 20, 由开花的藤蔓自然缠绕而成的桌椅，桌面上铺着巨大的荷叶，杯子和盘子则是五颜六色的蘑菇。"],
    ["死灵法师的骸骨仆役制造台", 88000, "家具", {}, "可以在此消耗生物遗骸和灵魂碎片，制造出低阶的骸骨仆役（如骷髅兵、骸骨猎犬）。仆役只能在个人空间内活动，作为守卫或劳力。", "200, 150, 40, 40, 一张由人类、野兽等不同生物的骨骼拼接而成的巨大石台，台面上有许多凹槽和管线，连接着几个装有绿色液体的玻璃罐。"],
    ["禅意的枯山水庭院", 9000, "家具", {}, "一片铺着白砂、点缀着几块奇石的日式庭院。每日可进行一次“耙砂”，这个过程能帮助整理思绪，消除精神上的疲劳。", "250, 150, 50, 50, 地面变为一片洁白的砂砾，几块形态各异的青黑色岩石错落有致地摆放着，旁边还放着一把小小的木耙。"],
    ["机械师的改装工坊", 160000, "家具", {}, "一个堆满了零件、工具和设计图的角落。可以在此升级、改装机械类装备和义体。提供成功率加成，并解锁一些独特的改造选项。", "310, 150, 60, 60, 这里有全套的激光焊枪、机械臂、3D打印机和各种精密工具，墙上挂满了设计蓝图，地上随意堆放着一些金属零件和废弃的义体。"],
    ["怪奇收藏家的陈列柜", 30000, "家具", {}, "一个玻璃陈列柜，里面已经摆放了几件无害但怪异的藏品（如：会自己换姿势的木偶，装在瓶子里的微缩风暴）。使用者也可以将自己的战利品放入其中展示。", "380, 150, 30, 50, 一个维多利亚风格的红木陈列柜，玻璃擦得锃亮，里面的藏品被柔和的灯光照亮，充满了神秘感。"],
    ["记忆回廊", 350000, "家具", {}, "一条由光影构成的走廊。使用者可以将自己的记忆片段储存在其中，并在走廊中以第一人称视角重温。可用于复盘战斗、学习技能或仅仅是怀旧。", "420, 150, 20, 80, 这条走廊的墙壁和天花板都是流动的光幕，上面会浮现出使用者储存的记忆影像，走入其中仿佛穿梭于时光之中。"],
    ["炼金术士的秘密实验室", 125000, "家具", {}, "一套完整的炼金实验设备，包括蒸馏器、坩埚、试管和复杂的玻璃管道。可以在此进行基础药剂的合成，成功率高于自行摸索。", "10, 240, 50, 50, 一个被各种玻璃器皿和冒着气泡的药剂占据的区域，空气中弥漫着草药和化学试剂混合的味道。"],
    ["吟游诗人的篝火", 8000, "家具", {}, "一堆永不熄灭的篝火。坐在篝火旁，会感到温暖和安心。如果此时演奏乐器或讲述故事，效果会得到增强，更容易打动听众（即使是NPC）。", "70, 250, 20, 15, 一圈由石头垒起的火塘，中间燃烧着橙红色的火焰，不时有火星跳跃出来，发出噼啪的轻响。"],
    ["画中仙的卷轴", 210000, "家具", {}, "一幅巨大的空白山水画卷轴，挂在墙上。使用者可以消耗精神力将想象中的场景绘制上去，画卷会变为动态，甚至可以短暂地进入画中世界（不能带出任何东西）。", "100, 220, 1, 60, 这幅画几乎占据了一整面墙，画纸是上好的宣纸，两端的画轴由紫檀木制成，整体散发着墨香。它的坐标代表挂在墙上的位置。"],
    ["深海遗迹的珊瑚床", 60000, "家具", {}, "一张由活体发光珊瑚构成的床。在上面睡觉时会进入深海般的梦境，有助于安抚狂躁的精神状态，并缓慢修复受损的灵魂。", "120, 230, 30, 20, 整张床就像是从海底搬上来的艺术品，五彩斑斓的珊瑚构成了床的框架，柔软的海葵组成了床垫，散发着柔和的蓝绿色荧光。"],
    ["刺客盟约的暗影帷幕", 48000, "家具", {}, "一片可以随意悬挂的黑色帷幕。躲在帷幕后面时，自身的气息会被完全隐藏，是练习潜行和隐匿技能的绝佳道具。", "160, 220, 40, 60, 一块看起来平平无奇的黑布，但当你触摸它时，会感到一种冰冷的、仿佛能吞噬光线的质感。它可以覆盖一片区域，形成绝对的黑暗。"],
    ["牧场主的迷你农场", 9500, "家具", {}, "一小块可以耕种的土地，附赠几包随机的异界植物种子。种出的植物可能是美味的食材，也可能是炼金材料，甚至是有微弱攻击性的小怪物。", "210, 220, 40, 40, 一块用栅栏围起来的肥沃黑土地，旁边有一个小小的工具棚，里面放着水壶、锄头等工具。"],
    ["命运纺织者的织机", 750000, "家具", {}, "一台古老的织机。使用者可以将从任务世界中获得的‘命运之线’（稀有材料）在此编织。成品可能是能豁免一次致命攻击的护符，也可能是能预知一次危险的披风。", "260, 220, 30, 40, 织机由银色的木材制成，上面缠绕着无数若有若无的光线，仿佛连接着万物的命运。操作它需要极高的专注力。"],
    ["赌神的桌台", 20000, "家具", {}, "一张绿色的赌桌。可以邀请朋友或召唤AI进行各种扑克牌游戏。纯娱乐，但据说运气好的人能从桌上赢到一些被称为‘幸运筹码’的道具。", "300, 220, 25, 20, 一张标准的德州扑克桌，桌面是高级的绿色绒布，边缘有舒适的皮质扶手，旁边还配了几张椅子。"],
    ["冰霜巨人的酒杯", 15000, "家具", {}, "一个由万年寒冰雕成的巨大酒杯。用它来喝任何液体，都会变得冰爽刺骨，并获得一个‘冰心’状态，短时间内对火焰伤害有微弱抗性。", "335, 230, 10, 12, 一个半人高的巨大杯子，杯壁上凝结着白霜，即使在温暖的空间里也散发着寒气。"],
    ["美食家的移动厨房", 28000, "家具", {}, "一个功能齐全的现代化厨房岛台，从分子料理工具到中式炒锅一应俱全。在这里处理食材和烹饪，能更好地发挥食材的效果，制作出高级料理。", "355, 220, 40, 30, 不锈钢的台面，内嵌了电磁炉、烤箱、水槽，上方还有抽油烟机和挂满厨具的架子。"],
    ["图书馆管理员的摇椅", 4500, "家具", {}, "一张舒适的老式木摇椅。坐在这张椅子上阅读书籍，理解速度和记忆力会得到微弱提升。", "405, 230, 15, 20, 一张深棕色的木质摇椅，扶手和椅背已经被磨得光滑发亮，坐上去会发出有节奏的吱呀声。"],
    ["伊甸园的苹果树", 1200000, "家具", {}, "传说中那棵树的一根分枝培育而成。每隔一个月会结出一颗‘智慧之果’，食用后永久提升一点随机属性。但食用第一颗果实后，会获得一个永久的‘被驱逐者’状态，进入某些神圣区域会受到压制。", "430, 220, 30, 50, 一棵流光溢彩的小树，树叶是半透明的，树上结着一颗散发着诱人光芒的苹果。"],
    ["泰坦的训练假人", 99000, "家具", {}, "一个由超合金制成的、几乎坚不可摧的训练假人。它能记录你的攻击数据（伤害、速度、精准度），并提供分析报告。是测试新技能和武器的完美对象。", "470, 220, 20, 30, 一个呈现出暗金色金属光泽的人形靶子，身上布满了各种感应器和刻线，看起来异常坚固。"],
    ["虚空之声的风铃", 33000, "家具", {}, "一串由奇异晶体组成的风铃。它不会随风摆动，而是当空间中出现异常波动或有访客到来时，会发出悦耳又空灵的声音作为预警。", "500, 220, 10, 20, 几根长短不一的紫色半透明晶体，由一根看不见的细线悬挂着，静止时没有任何声音。"],
    ["最终王座", 10000000, "家具", {}, "一张无法用语言描述其材质和形态的王座。它似乎是由纯粹的‘概念’和‘规则’构成。坐上它的人，将获得对整个个人空间的绝对掌控权，可以随意修改空间的大小、环境、物理法则，并获得一个独一无二的称号‘一界之主’。", "550, 150, 100, 100, 它时而是由星辰铸就，时而是由深渊凝聚，时而又是纯粹的光。任何看到它的人都会有不同的理解。它就是权力和终点的象征。"],
["清洁术", 100, "技能", {}, "【dp+1;能量池-10】", "清洁目标身上的污渍,虽然没有战斗力，但在某些时候能派上大用场。"],
["火球术", 2000, "技能", {}, "【dp+1;能量池-10】", "释放火球攻击敌人,初级火系法术，可以发射威力不俗的火球。"],
["侦测陷阱", 1500, "技能", {}, "【dp+1;能量池-10】", "感知附近的机关陷阱,对于探索古墓或地城非常重要的辅助技能。"],
["振奋怒吼", 2800, "技能", {}, "【dp+1;能量池-10】", "发出吼声，提升周围友军的士气和攻击力,战士的辅助技能，在团队作战中效果显著。"],
["傀儡操控术（初级）", 5500, "技能", {}, "【dp+1;能量池-10】", "操控一具无生命的人偶进行简单的动作,需要配合傀儡使用，是傀儡师的基础。"],
["随身小剧场", 8000, "技能", {}, "【dp+1;能量池-30】", "在自身周围半径三米内生成一个持续五分钟的微型音画幻境，幻境内容可自行设定。虽然没有直接战斗力，但无论是自娱自乐、迷惑敌人还是营造气氛，都有奇效。"],
["美食的俘虏", 6500, "技能", {}, "【dp+1;能量池-20】", "制作出的任何食物都将附带强烈的魅惑效果，让品尝者在短时间内对制作者产生高度好感与信赖。警告：对意志力强大者效果减弱。"],
["绝对音准（伪）", 4000, "技能", {}, "【dp+1;能量池-5】", "能够完美模仿听到的任何声音，包括人物嗓音、动物叫声甚至是机械运作声。但无法模仿超出人类发声器官极限的声音。"],
["一键换装", 3500, "技能", {}, "【dp+1;能量池-10】", "瞬间更换身上穿着的衣物，衣物款式需要在技能发动前预设好。对于需要快速切换身份或应对不同场合非常实用。"],
["植物密语", 7200, "技能", {D:1}, "【dp+1;能量池-15】", "能够与植物进行简单的精神交流，了解它们的状态和周边环境信息。是优秀的侦察与情报搜集手段。"],
["万能钥匙（概念）", 12000, "技能", {C:1}, "【dp+2;能量池-50】", "消耗能量，可以开启任何非魔法或非规则层面上锁的锁具。此技能开启的是‘锁’这一概念。"],
["动物亲和（猫科限定）", 4800, "技能", {}, "【dp+1;能量池-10】", "大幅提升所有猫科动物对你的好感度，它们会视你为同类和伙伴。也许能从街角的猫咪那里打听到一些秘密。"],
["存在感稀薄化", 9000, "技能", {C:1}, "【dp+1;能量池-25/分钟】", "降低自身在他人感知中的存在感，变得容易被忽视，但并非真正的隐身。在人群中行动的绝佳技能。"],
["情绪调色盘", 8800, "技能", {D:1}, "【dp+1;能量池-30】", "短暂影响目标的某种情绪，可以放大或减弱其喜悦、悲伤或愤怒。对心志坚定者效果有限，且容易被察觉。"],
["无中生友", 5000, "技能", {}, "【dp+1;能量池-20】", "凭空捏造一个不存在的“朋友”的身份信息，并让周围的人在短时间内相信这个“朋友”确实存在。用于制造不在场证明或虚构情报来源。"],
["重力微操", 15000, "技能", {C:1}, "【dp+2;能量池-40】", "小范围内精确操控重力，可以使物体变轻或变重，或者改变一次跳跃的轨迹。高手甚至能用它让敌人的步伐踉跄。"],
["影子行囊", 11000, "技能", {D:2}, "【dp+1;能量池-5，与储存物质量有关】", "将自己的影子变成一个异次元储物空间，可以存放非生命物体。空间大小与技能熟练度相关。"],
["弹道修正", 9500, "技能", {}, "【dp+1;能量池-15/次】", "在使用投掷或射击武器时，可以对弹道进行一次小幅度的修正，提升命中率。对狙击手和飞刀手来说是神技。"],
["痛觉转移", 13000, "技能", {C:1}, "【dp+1;能量池-60】", "将自己受到的下一次伤害所产生的痛觉，转移到指定目标身上。伤害本身无法转移，但剧烈的痛楚足以让任何敌人行动迟缓。"],
["墨汁结界", 8200, "技能", {}, "【dp+1;能量池-35】", "以自身为中心制造一片浓郁的墨色区域，剥夺区域内所有人的视觉。使用者自身不受影响。"],
["回声定位", 7800, "技能", {}, "【dp+1;能量池-10】", "通过发出特定频率的声音并分析其回声，精确感知周围环境的立体结构与物体位置，是黑暗环境中的眼睛。"],
["嗜血渴望", 16000, "技能", {C:2}, "【dp+1;能量池-50】", "主动技，发动后攻击会附带吸血效果，将造成伤害的一部分转化为自身生命力。但会轻微影响心智，增加攻击性。"],
["第三只眼", 20000, "技能", {B:1}, "【dp+2;能量池-100】", "在额头开启一只能量构成的眼睛，可以看破低阶幻术、伪装，并侦测到隐藏的能量流动。持续消耗能量。"],
["钢铁意志", 10000, "技能", {}, "【dp+1】", "被动技能，大幅提升对精神控制、魅惑、恐惧等效果的抵抗力。你的思想是你最坚固的堡垒。"],
["战术语言", 6800, "技能", {}, "【dp+1;能量池-5】", "能够使用一套极其简洁高效的语言（手势或短语）与队友进行无声交流，传递复杂的战术意图。"],
["蛛丝发射", 8500, "技能", {D:1}, "【dp+1;能量池-15】", "从指尖发射出坚韧的蛛丝，可用于攀爬、束缚敌人或制作简易陷阱。"],
["动力跳跃", 7000, "技能", {}, "【dp+1;能量池-20】", "瞬间在脚下积蓄能量并爆发，进行一次超乎寻常的高跳或远跳。"],
["能量盾构", 12500, "技能", {D:2}, "【dp+1;能量池-40】", "在身前凝聚一面能量盾牌，可以抵挡一次中等强度的物理或能量攻击。盾牌破碎后有冷却时间。"],
["连锁闪电（弱化版）", 18000, "技能", {C:1}, "【dp+1;能量池-70】", "释放一道能在多个敌人之间跳跃的闪电，每次跳跃威力递减。对于清理杂兵有奇效。"],
["再生之触", 22000, "技能", {B:1}, "【dp+1;能量池-120】", "将手掌覆盖在伤口上，消耗大量能量加速细胞再生，治愈非致命性伤口。无法断肢再生。"],
["危机预感", 17000, "技能", {C:1}, "【dp+1】", "被动技能，对即将到来的危险有模糊的直觉性预警。无法指明危险来源，但足以让人提前警惕。"],
["武器共鸣", 14000, "技能", {D:2}, "【dp+1;能量池-30】", "与一把常用武器建立精神链接，使用时更加得心应手，并能发挥出武器的潜在威力，小幅提升攻击力。"],
["爆破艺术", 11500, "技能", {}, "【dp+1;能量池-25】", "精通各类炸药的制作与使用，能够精确计算爆炸范围和威力，布置出艺术品般的连环爆炸。"],
["镜面反射", 25000, "技能", {B:1}, "【dp+2;能量池-150】", "制造一个短暂的能量镜面，可以将下一次指向你的飞行道具或能量攻击原路反弹。需要极佳的反应速度。"],
["心灵屏障", 19000, "技能", {C:2}, "【dp+1;能量池-80】", "建立一个强大的心灵防护罩，免疫一次针对性的读心或心灵探查。是一次性的消耗品，使用后需长时间冷却。"],
["主角光环（伪）", 30000, "技能", {A:1}, "【dp+1】", "被动技能，在遭遇必死局面时，有极小概率（1%）触发都合主义事件，从而化险为夷。例如，敌人枪械卡壳，脚下突然出现香蕉皮等。"],
["平地摔达人", 2500, "技能", {}, "【dp-1】", "被动技能，走路时有一定概率无视地形平坦度直接摔倒。但摔倒时有更高概率以一种滑稽而无伤的方式落地，有时甚至能意外躲开攻击。"],
["反向导航", 3000, "技能", {}, "【dp+1;能量池-5】", "当你试图前往某个目的地时，脑中会出现一个绝对错误的方向指引。只要反着它的指示走，就一定能找到正确的路。"],
["死亡BGM", 8000, "技能", {}, "【dp+1;能量池-20】", "可以为指定目标（包括自己）配上一段背景音乐，音乐风格可选。在关键时刻放出激昂的音乐能振奋人心，放出滑稽的音乐则能摧毁敌人的气势。"],
["强行解说", 6000, "技能", {}, "【dp+1;能量池-15】", "强制让一个目标的内心想法以弹幕或旁白的形式出现在周围人的脑海里，持续三十秒。暴露秘密和制造尴尬的利器。"],
["钞能力（体验版）", 10000, "技能", {D:1}, "【dp+1;能量池-100】", "每天一次，可以凭空变出一笔仅限当天使用的、数额不大的当地货币。钱是真的，但第二天会消失。"],
["降智光环", 15000, "技能", {C:1}, "【dp+1;能量池-50】", "以自身为中心释放一个光环，范围内的所有人（包括自己）的逻辑思维能力会暂时性降低。适合在需要浑水摸鱼时使用。"],
["第四面墙的凝视", 28000, "技能", {B:1}, "【dp+2;能量池-90】", "可以短暂地看到关于目标人物的“设定”，例如他们的弱点、技能列表或背景故事梗概。信息模糊且片面，但足以提供关键情报。"],
["暂停学外语", 7500, "技能", {}, "【dp+1;能量池-20】", "在观看外语影像或听到外语对话时，可以在脑内生成完美的同声传译和字幕。学习新语言从未如此简单。"],
["量子化猫咪", 9999, "技能", {}, "【dp+1;能量池-30】", "你可以随时召唤一只薛定谔的猫。这只猫处于存在与不存在的叠加态，只有在你主动观察它时才会坍缩为一只真实的、品种随机的可爱猫咪。它只会陪伴你五分钟，然后重新回归量子海洋。"],
["契约之书", 35000, "技能", {B:2}, "【dp+2;能量池-200】", "具现化一本契约书，与他人签订的任何承诺只要写入书中，双方都将受到规则层面的强制约束。违约者会受到与承诺价值对等的惩罚。"],
["故事线的锚点", 45000, "技能", {A:1}, "【dp+2;能量池-500】", "选定一个物体或地点作为“存档点”。每天一次，使用者可以在死亡或任务失败时，将自身状态（不包括记忆）回溯到设置锚点的那一刻。巨大的消耗让它几乎无法被频繁使用。"],
["逻辑炸弹", 38000, "技能", {B:1}, "【dp+1;能量池-180】", "向一个智能体（AI，魔像，部分神智清晰的生物）提出一个无法解答的逻辑悖论。目标会陷入永久性的逻辑循环，直至思维崩溃。"],
["概念窃取（碎片）", 50000, "技能", {A:1, C:2}, "【dp+2;能量池-300】", "对一个目标使用，随机窃取其拥有的一个“概念”的极小一部分，例如“锋利”、“速度”或“幸运”。你可以短暂地将这个概念碎片附加在自己或物品上。效果微弱且不稳定。"],
["谎言成真（微弱）", 42000, "技能", {B:2}, "【dp+1;能量池-250】", "说出一个简单的、无伤大雅的谎言（例如“我口袋里有一块糖”），并消耗能量使其在小范围内短暂成为事实。谎言越偏离现实，消耗越大，成功率越低。"],
["时间减速（主观）", 32000, "技能", {C:2}, "【dp+2;能量池-150/秒】", "大幅提升自己的思维速度和神经反应，使得外界在你的感知中变得极其缓慢。身体速度不变，但为你赢得了宝贵的思考和反应时间。"],
["因果线之触", 60000, "技能", {A:2}, "【dp+3;能量池-1000】", "触摸一个物体或人物，可以模糊地感知到一条与其紧密相关的、在不久的将来会发生的“因果线”。看到的未来片段极其破碎，极难解读。"],
["名字的支配（初阶）", 55000, "技能", {A:1, B:1}, "【dp+2;能量池-400】", "得知一个存在的“真名”后，可以通过呼唤其真名，对其下达一个无法被直接抵抗的简单命令（例如“停下”）。对越强大的存在效果越弱。"],
["边界跨越", 70000, "技能", {S:1}, "【dp+3;能量池-800】", "选择一个“边界”，例如门与门框的边界、影子与光明的边界，并进行一次短距离的空间穿梭，从边界的一侧直接出现在另一侧。距离和可穿越的边界类型受限于技能等级。"],
["万物终结之声", 99999, "技能", {S:1, A:2}, "【dp+2;能量池-2000】", "发出一种针对“存在”本身的声音，所有听到此声音的非永恒造物都会加速走向其“终结”。生命会迅速衰老，物品会快速腐朽风化。作用范围极小，消耗巨大，且对使用者自身也有反噬风险。"],
          ["初代人造人类", 6000, "血统", {D:1}, `
        属性: 力量+1, 敏捷+1, 感知+1, 耐力+1
        能量池: 电力(30)
    `, `
    - 钢铁身躯: 依然保持人类的外形, 是仿生科技至高技术的结晶。不需要食物、水、睡眠就可以生存。
    - 完美人机改造: 人造人的身体本身就由机械和肉体构成, 能够和D级科技本质的所有改造完美契合。
    古时候创造人类被视为只有神才能够作到的事, 触犯到神的领域便会带来难以想象的后果。这是人类挑战禁忌的最初产物, 是仿生科技的结晶。`],

    ["第二代人造人类", 14000, "血统", {C:1}, `
        属性: 力量+2, 敏捷+2, 感知+2, 耐力+2
        能量池: 电力(40)
    `, `
    - 提升特性-钢铁身躯: 肉搏攻击能够造成严重伤害。
    - 完美人机改造: 人造人的身体本身就由机械和肉体构成, 能够和C级科技本质的所有改造完美契合。
    在初代的基础上, 新一代的人造人被赋予了更强大的战斗能力和适应性, 机械与肉体的结合更加紧密。`],

    ["第三代人造人类", 20000, "血统", {B:1}, `
        属性: 力量+3, 敏捷+3, 感知+2, 耐力+3
        能量池: 电力(50)
    `, `
    - 宇宙生存: 人造人可以在宇宙生存。
    - 完美人机改造: 人造人的身体本身就由机械和肉体构成, 能够和B级科技本质的所有改造完美契合, B级科技本质改造所提供的内在加值可以和血统提供的内在加值叠加而非取高, 并且该属性加值可以叠加在义体上。
    技术的飞跃突破了能源的桎梏, 甚至打破了星球的束缚，成为了一个近乎永恒的生命体。`],

    ["超级人造人类", 32000, "血统", {A:1}, `
        属性: 力量+4, 敏捷+4, 感知+4, 耐力+4
        能量池: 电力(60)
    `, `
    - 宇宙生存: 人造人可以在宇宙生存。
    - 完美人机改造: 人造人的身体本身就由机械和肉体构成, 能够和A级和S级科技本质的所有改造完美契合。
    - 能量吸收装置: 安装了吸收能量的装置, 可以吸收来自对手的能量转化为自己的能量。
    这已不仅仅是模仿生命, 而是超越生命。通过吸收对手的能量, 成为了一个能够在战斗中不断变强的存在, 是科技所能达到的巅峰造物之一。`],
 ["蜘蛛侠强化", 15000, "血统", {B:1}, `
        属性: 力量+1, 敏捷+4, 感知+4, 耐力+2
        能量池: 生物能量(50)
    `, `
    - 蜘蛛敏锐: 蜘蛛侠的平衡器官大幅度增强，获得敏感范围内的颤动感知。
    - 蜘蛛运动: 蜘蛛侠获得蛛行术，如蜘蛛一般在垂直表面上攀爬移动，甚至天花板上也可以。在这种情况下，蜘蛛侠必须腾出双手来爬行。
    - 蛛丝: 蜘蛛侠可从手腕处射出蛛丝。蛛丝可如捕网一般进行纠缠攻击。
    源自一次意外的基因突变，将人类与蜘蛛的优点完美结合，获得了超越常人的感官与运动能力。这种力量也伴随着巨大的责任。`],
       ["D信使", 5000, "血统", {D:1}, `
        属性: 敏捷+2, 耐力+2
        能量池: 动能(0)
    `, `
    - 专注护盾: 通过持续高速移动，可以在体表形成一层临时的能量护盾来抵御攻击。这层护盾在不主动发起攻击的回合中会保持生效，提供额外的防护。
    - 信使体质: 拥有与众不同的战斗方式，能够以超凡的敏捷和协调性主导近身格斗，动作迅猛而非单纯依靠蛮力。
    - 自由奔跑: 掌握了出神入化的跑酷技巧，能够在墙壁、管道甚至天花板上自由移动，仿佛摆脱了重力的束缚。其跳跃能力也得到极大增强，能轻松越过常人无法企及的障碍。
    - 信仰限定: 信奉绝对的、不受约束的自由，这种信念是力量的根基，但也因此无法接纳和使用任何其他形式的信仰类能力。
    受到自由精神的感召，成为了一名初出茅庐的信使。虽然经验尚浅，但已掌握了在都市丛林中穿梭的核心技巧。`],

    ["C信使", 8000, "血统", {C:1}, `
        属性: 敏捷+3, 耐力+3
        能量池: 动能(0)
    `, `
    - 专注护盾+: 专注护盾的效果得到强化。在高速移动中，敌人极难锁定其位置，无论是实体攻击还是远程射击都容易被偏转或擦身而过。同时，更擅长在移动中进行格挡招架。
    - 穿越攻击: 学会了如何将冲刺的巨大动能瞬间转化为强大的攻击力。在全力奔跑后发动的攻击极具冲击力，但代价是攻击的瞬间，自身的防御会变得相对脆弱。
    - 信使体质: 能够以超凡的敏捷和协调性主导近身格斗，动作迅猛而非单纯依靠蛮力。
    - 自由奔跑: 掌握了出神入化的跑酷技巧，能够在墙壁、管道甚至天花板上自由移动，仿佛摆脱了重力的束缚。其跳跃能力也得到极大增强，能轻松越过常人无法企及的障碍。
    - 信仰限定: 信奉绝对的、不受约束的自由，这种信念是力量的根基，但也因此无法接纳和使用任何其他形式的信仰类能力。
    已经是一名合格的信使，秘密运输任务的常客。跑酷技巧更加娴熟，战斗方式也变得更加致命和高效。`],

    ["B信使", 12000, "血统", {B:1}, `
        属性: 敏捷+4, 耐力+4
        能量池: 动能(0)
    `, `
    - 专注护盾++: 专注力达到巅峰，在移动时，周围的世界在其感知中会变得缓慢。现在，任何移动都能激活强大的专注护盾，并且可以在护盾的保护下毫无顾忌地进行攻击。
    - 强力穿越攻击: 穿越攻击的技巧已臻化境，发动冲刺攻击时不再会暴露防御上的弱点，可以毫无顾忌地将速度完全转化为破坏力。
    - 信使体质（提升）: 身体的协调性与反应能力达到新高度，防御能力不再依赖传统护具，而是完全取决于自身的敏捷或感知。近身格斗时，力量的限制被彻底打破，可以淋漓尽致地发挥敏捷的优势。
    - 自由奔跑: 掌握了出神入化的跑酷技巧，能够在墙壁、管道甚至天花板上自由移动，仿佛摆脱了重力的束缚。其跳跃能力也得到极大增强，能轻松越过常人无法企及的障碍。
    - 信仰限定: 信奉绝对的、不受约束的自由，这种信念是力量的根基，但也因此无法接纳和使用任何其他形式的信仰类能力。
    身为组织内的精英信使，行动能力已达化境。其身体的反应速度本身就是最好的防御，是各大组织执行高难度任务时的第一人选。`],

    ["A信使", 18000, "血统", {A:1}, `
        属性: 敏捷+6, 耐力+6
        能量池: 动能(0)
    `, `
    - 信使体质（究极）: 身体素质达到人类潜能的极限，耐力与敏捷相辅相成，使得敏捷属性获得了根本性的强化，肉搏攻击的威力也随之大幅提升。专注护盾已成为一种常驻状态，只要处于移动之中，最顶级的防护护盾就会持续生效。
    - 强力穿越攻击: 穿越攻击的技巧已臻化境，发动冲刺攻击时不再会暴露防御上的弱点，可以毫无顾忌地将速度完全转化为破坏力。
    - 自由奔跑: 掌握了出神入化的跑酷技巧，能够在墙壁、管道甚至天花板上自由移动，仿佛摆脱了重力的束缚。其跳跃能力也得到极大增强，能轻松越过常人无法企及的障碍。
    - 信仰限定: 信奉绝对的、不受约束的自由，这种信念是力量的根基，但也因此无法接纳和使用任何其他形式的信仰类能力。
    已是信使中的传奇与王牌，是自由精神的化身。其存在本身就意味着任务的绝对成功，是最强大的追捕者也无法触及的幻影。`],

    ["D天然道士", 6000, "血统", {D:1}, `
        属性: 力量+1, 敏捷+1, 耐力+1, 感知+1, 决心+2
        能量池: 灵力(40)
    `, `
    - 仙风道骨: 天生拥有仙人骨，虽未曾修炼道法，但肉体凡胎已被仙气潜移默化地滋养。拥有超乎常人的坚韧体质，极难被轻易击倒。其移动速度和身体的天然防御能力，会随着自身的成长而同步增强。`],

    ["C天然道士", 14000, "血统", {C:1}, `
        属性: 敏捷+1, 耐力+1, 感知+3, 决心+3
        能量池: 灵力(50)
    `, `
    - 仙风道骨（提升）: 仙气进一步强化肉体，赋予了快速自愈的体质，并且所有自然恢复的速度都得到加倍。对凡俗的需求大幅降低，不再需要食物、水或空气，只需每日短暂的睡眠，便可从天地自然间汲取所需能量以维持生命活动。体质坚韧，移动和防御能力随成长而增强。`],

    ["B天然道士", 22000, "血统", {B:1}, `
        属性: 力量+1, 敏捷+1, 耐力+1, 感知+4, 决心+4
        能量池: 灵力(60)
    `, `
    - 仙风道骨（提升）: 快速自愈能力得到显著增强。速度快到极致，能够在平稳的液体表面上奔跑而不下沉。拥有坚韧的体质和随成长提升的移动与防御能力，且只需睡眠即可维生。
    - 赤诚之心: 仙气不仅淬炼肉体，更洗涤精神。其心灵变得纯净而坚固，能自然免疫绝大多数试图操控精神的负面影响与幻术效果。`],

    ["A天然道士", 35000, "血统", {A:1}, `
        属性: 敏捷+1, 耐力+1, 感知+5, 决心+5
        能量池: 灵力(75)
    `, `
    - 仙风道骨（蜕凡）: 肉体凡胎已彻底蜕变，从此长生不老，免疫世间一切疾病、毒素与生理上的衰老。身体拥有强大的普适性伤害减免能力和卓越的快速自愈能力。
    - 仙气医疗: 体内满溢的仙气可以通过肢体接触，将自身的自愈能力暂时转移给他人，治愈其伤势。
    - 赤诚之心（提升）: 灵魂已与天地自然同调，坚定的意志能显著增强其所有行动的成功率。同时保留了对心灵操控与幻术的强大抗性，并可在水面奔跑。`],

    ["AA天然道士", 50000, "血统", {AA:1}, `
        属性: 力量+1, 敏捷+2, 耐力+2, 感知+8, 决心+8
        能量池: 元气(100)
    `, `
    - 结丹: 可以将自身精纯的生命元气凝结成一颗金丹。此丹药拥有起死回生的神效，能够治愈致命的伤势，并帮助服用者抵抗诅咒、疾病和毒素。但凝结金丹需要消耗大量的自身元气。
    - 法天象地: 能够将自身元神逼出体外，化身为一个由纯粹能量构成的、顶天立地的元神巨人进行战斗，此状态下战斗力获得极大增幅。
    - 赤诚之心（圆满）: 灵魂与天地同调，坚定的意志能显著增强其所有行动的成功率。
    - 仙道之躯: 作为一个达到天然道士顶峰的存在，完整保留了长生不老、百毒不侵、仙气医疗、水上行走、强大自愈和伤害减免等所有低阶能力。`],

    ["炎黄世胄", 7000, "血统", {D:1}, `
        属性: 力量+1, 敏捷+1, 耐力+1, 智力+1, 感知+1, 决心+1, 风度+1
        能量池: 气血(35)
    `, `
    - 皆为汉土: 作为炎黄后裔，在对抗非我族类之敌时，血脉中潜藏的力量会被唤醒，爆发出更强的战斗力。
    - 学习天赋: 传承自先祖的智慧使其拥有卓越的学习能力，能比常人更快地掌握新知识与技能。
    - 忠于炎黄: 血脉中铭刻着对自身民族的绝对忠诚。任何形式的背叛行为都会导致血脉力量的彻底丧失。这份忠诚在面对特定的历史宿敌时，会转化为更强大的战斗意志。`],

    ["华夏遗民-青龙", 15000, "血统", {C:1}, `
        属性: 风度+3, 沉着+2, 耐力+1
        能量池: 龙气(45)
    `, `
    - 崖山气节: 拥有钢铁般的意志，精神如同坚壁，极难被任何外力动摇或操控。
    - 生存体质: 血脉中流淌着强大的适应力，使其能天然免疫绝大多数常见的毒素与疾病。
    - 四神附体: 获得东方青龙的庇佑，对各类能量形态的伤害都拥有普遍的抗性。
    - 中华传承: 血脉的纯粹性是力量的根源，任何会大幅改变身体基本构造的外部改造，都会削弱甚至破坏这份传承之力。
    选择青龙分支，继承了东方甲木的神性，威仪天生，意志坚定。`],

    ["华夏遗民-白虎", 15000, "血统", {C:1}, `
        属性: 敏捷+3, 决心+2, 感知+1
        能量池: 煞气(45)
    `, `
    - 崖山气节: 拥有钢铁般的意志，精神如同坚壁，极难被任何外力动摇或操控。
    - 生存体质: 血脉中流淌着强大的适应力，使其能天然免疫绝大多数常见的毒素与疾病。
    - 四神附体: 获得西方白虎的庇佑，对各类能量形态的伤害都拥有普遍的抗性。
    - 中华传承: 血脉的纯粹性是力量的根源，任何会大幅改变身体基本构造的外部改造，都会削弱甚至破坏这份传承之力。
    选择白虎分支，继承了西方庚金的杀伐之气，行动敏锐，杀伐果决。`],

    ["华夏遗民-朱雀", 15000, "血统", {C:1}, `
        属性: 智力+3, 感知+2, 敏捷+1
        能量池: 灵火(45)
    `, `
    - 崖山气节: 拥有钢铁般的意志，精神如同坚壁，极难被任何外力动摇或操控。
    - 生存体质: 血脉中流淌着强大的适应力，使其能天然免疫绝大多数常见的毒素与疾病。
    - 四神附体: 获得南方朱雀的庇佑，对各类能量形态的伤害都拥有普遍的抗性。
    - 中华传承: 血脉的纯粹性是力量的根源，任何会大幅改变身体基本构造的外部改造，都会削弱甚至破坏这份传承之力。
    选择朱雀分支，继承了南方丙火的灵性，智慧超群，感知敏锐。`],

    ["华夏遗民-玄武", 15000, "血统", {C:1}, `
        属性: 耐力+3, 力量+2, 沉着+1
        能量池: 玄冥真水(45)
    `, `
    - 崖山气节: 拥有钢铁般的意志，精神如同坚壁，极难被任何外力动摇或操控。
    - 生存体质: 血脉中流淌着强大的适应力，使其能天然免疫绝大多数常见的毒素与疾病。
    - 四神附体: 获得北方玄武的庇佑，对各类能量形态的伤害都拥有普遍的抗性。
    - 中华传承: 血脉的纯粹性是力量的根源，任何会大幅改变身体基本构造的外部改造，都会削弱甚至破坏这份传承之力。
    选择玄武分支，继承了北方壬癸的坚韧，体魄强健，沉稳如山。`],

    ["炎黄子孙-青龙", 25000, "血统", {B:1}, `
        属性: 风度+4, 沉着+2, 耐力+2
        能量池: 龙气(55)
    `, `
    - 青龙降临: 青龙血脉进一步觉醒，可以引动东方苍龙的神力，以自身凛然的威仪鼓舞战场上所有友方单位，显著提升他们的战斗效能与士气。
    - 传承之力: 完整保留了钢铁般的意志、对常见毒疾的免疫力、对能量伤害的天然抗性，以及不能接受大幅度身体改造的血脉限制。`],

    ["炎黄子孙-白虎", 25000, "血统", {B:1}, `
        属性: 敏捷+4, 决心+2, 感知+2
        能量池: 煞气(55)
    `, `
    - 白虎杀伐: 白虎的杀伐本能完全融入己身，使其获得了超凡的移动速度和先手反应能力。对某种特定的战斗方式（如弓箭、白刃、肉搏或运动）拥有超群的领悟力，并能将坚定的意志力转化为纯粹的破坏力，突破攻击的极限。
    - 传承之力: 完整保留了钢铁般的意志、对常见毒疾的免疫力、对能量伤害的天然抗性，以及不能接受大幅度身体改造的血脉限制。`],

    ["炎黄子孙-朱雀", 25000, "血统", {B:1}, `
        属性: 智力+4, 感知+2, 敏捷+2
        能量池: 灵火(55)
    `, `
    - 朱雀一怒: 南明离火的神力在体内流转，赋予其强大的火焰再生能力。任何近战攻击者都会受到神火的自动反噬，同时自身的攻击也附带着朱雀神火，能对敌人造成持续的烈焰灼烧伤害。
    - 传承之力: 完整保留了钢铁般的意志、对常见毒疾的免疫力、对能量伤害的天然抗性，以及不能接受大幅度身体改造的血脉限制。`],

    ["炎黄子孙-玄武", 25000, "血统", {B:1}, `
        属性: 耐力+4, 力量+2, 沉着+2
        能量池: 玄冥真水(55)
    `, `
    - 玄武当关: 玄武神力化为坚不可摧的守护，其肉体获得了极高的天生防御与伤害减免，对常规的枪械射击和能量武器拥有特殊的抗性。更能以集中的意志力，在短时间内进一步强化伤害吸收的能力，做到万夫莫开。
    - 传承之力: 完整保留了钢铁般的意志、对常见毒疾的免疫力、对能量伤害的天然抗性，以及不能接受大幅度身体改造的血脉限制。`],

   ["D级黄衣之王血统：戏剧家", 8000, "血统", {"D":1}, `
        属性: 智力+2, 耐力+2, 敏捷+2, 感知+1, 额外属性+3
        能量池: 戏剧之力(40)
    `, `
    - 信仰导向: 作为哈斯塔的使者，他的灵魂与信仰已经绑定。他将无法再追寻或侍奉除克苏鲁神话体系之外的任何存在，任何过往的信仰联系都会被立刻切断。
    - 迷惑人心的戏曲: 他是一位聪慧绝伦的艺术家，深谙如何以优雅的姿态引导死亡。他的智慧能完全转化为近战中的力量，能够选择一种表达自我的艺术形式（如舞蹈、歌唱、演奏），并以此作为战斗的媒介，其技艺之精湛，足以替代常规的白刃或肉搏技巧。
    - 永恒的黄衣: 他的身躯永远被一件无法损毁、无法脱下的黄衣所包裹。这件黄衣是他身份的象征，能保护他不因重伤而昏迷，但也因此散发出一种超凡脱俗而又令人不安的气质，使他在与人交往时产生隔阂。这层衣物虽然坚韧，但对瓦解魔法的力量却无能为力。这身装束是其存在的一部分，象征着他与凡俗世界的疏离。
     `],

    ["C级黄衣之王血统：温和开场", 15000, "血统", {"C":1}, `
        属性: 智力+3, 耐力+3
        能量池: 戏剧之力(50)
    `, `
    - 提升特性-迷惑人心的戏曲: 他的舞姿与戏曲变得更加绚丽夺目，充满了令人无法抗拒的魅力。他以艺术发动的攻击，不仅能创伤敌人的肉体，其蕴含的迷惑力量还能直接冲击并束缚目标的精神。其艺术表达的破坏力，已能与最精纯的战斗技巧相媲美。
    - 虚假的面具: 他的脸上自动出现一个不可摘除的白色面具，款式可随心意变幻。这面具赋予他洞察非凡事物的能力，能够感知到周围环境中隐藏的血统，并为他提供抵御神兵利器的强大防护。若他原本佩戴着其他头盔，这个面具将会取而代之，旧物若无法取下则会被直接摧毁。
     `],

    ["B级黄衣之王血统：恐怖假面", 22000, "血统", {"B":1}, `
        属性: 智力+4, 耐力+4, 敏捷+3, 额外属性+3
        能量池: 狂乱灵感(65)
    `, `
    - 提升特性-迷惑人心的戏曲: 他的智慧已经完全融入到了每一次攻击之中，不再需要任何转换，他的思想即是武器，智慧本身就定义了他攻击的极限。
    - 倾城的假面: 当温馨的戏剧落幕，所有人都将目光投向身着黄衣的他。此刻，他可以选择摘下面具，将那不可名状的真实容貌展露给世人，带来极致的恐怖。他的面具与黄衣的力量都得到了本质的提升，成为了他身份更深层次的延伸，其防护与洞察能力均获得飞跃。
   `],
       ["D级赛亚人血统", 8000, "血统", {D:1}, `
        属性: 力量+2, 敏捷+2, 耐力+2, 感知+1
        能量池: 气(40)
    `, `
    - 战斗民族: 赛亚人是天生的战斗种族，拥有远超常人的坚韧肉体，能够抵御常规的物理打击，甚至对子弹等高速射弹有天然的抗性。
    - 弱点尾巴: 赛亚人生来就有一条尾巴，这既是力量的象征，也是与生俱来的弱点。若尾巴被紧紧抓住，赛亚人会迅速感到脱力与虚弱。切断尾巴可以暂时消除此弱点，但也意味着失去了化身为巨猿的可能，不过尾巴终将在月圆之夜重新长出。`],

    ["C级赛亚人战士血统", 6000, "血统", {C:1}, `
        属性: 力量+3, 耐力+3
        能量池: 气(50)
    `, `
    - 提升特性-战斗民族: 作为赛亚人中的战士，你的战斗直觉和反应速度得到进一步强化，使你能在高速对决中更好地捕捉对手的动向。
    - 巨猿变化: 当赛亚人看到圆月或受到特定光线照射时，体内的野性会被唤醒，变身为失去理智的巨猿。巨猿形态下，体型、力量和耐力都将获得巨大的增幅，拥有惊人的破坏力。变身会持续到月亮消失或尾巴被切断为止。`],

    ["B级赛亚人精英战士血统", 15000, "血统", {B:1}, `
        属性: 力量+4, 敏捷+2, 耐力+4, 感知+1
        能量池: 气(60)
    `, `
    - 提升特性-战斗民族: 作为赛亚人中的精英，你的力量与肉体潜能得到了极大开发。你的天生攻击不仅迅猛，而且破坏力会随着自身力量的增长而不断突破极限，肉体也变得更加坚不可摧。
    - 宇宙作战: 你的身体构造已经进化到可以适应严酷的宇宙环境，无论是真空、辐射还是深海的巨大水压，都无法再对你造成伤害。你不再需要依赖呼吸生存。`],

    ["A级皇族赛亚人血统（贝吉塔王）", 20000, "血统", {A:1}, `
        属性: 力量+5, 敏捷+3, 耐力+5, 感知+3
        能量池: 气(70)
    `, `
    - 提升特性-战斗民族: 皇族血脉使你的肉体对能量攻击也产生了极强的抗性。你造成的近战伤害会随着你的力量而获得质的飞跃，并且强大的耐力也赋予了你更为磅礴的生命力。
    - 王者风范: 你天生具备王者的威压与气魄，这股气势使你在任何意志对抗中都能占据绝对优势。
    - 前方的路: 赛亚人在生死边缘会变得更强的传说在你身上体现得淋漓尽致。每次从重伤中完全恢复后，你都有机会突破自身的极限，永久增强自己的力量或耐力。`],

    ["S级超级赛亚人血统", 32000, "血统", {S:1}, `
        属性: 力量+8, 敏捷+7, 耐力+8, 感知+6
        能量池: 气(100)
    `, `
    - 金色形态: 凭借强大的意志，你可以突破极限，变身为传说中的超级赛亚人。变身后，你的头发变为金色并竖立，瞳孔化为碧绿，全身被金色的气焰包裹。在此形态下，你的各项身体机能都将获得爆炸性的提升，移动速度倍增，战斗民族的所有特性效果也会全面升华。
    - 提升特性-战斗民族: 在超级赛亚人状态下，你的力量能够直接转化为天生武器的破坏力，而你坚韧的身体甚至能吸收所有类型的伤害。`],

    ["斯克莱亚血统", 6000, "血统", {D:1}, `
        属性: 耐力+1, 智力+2, 感知+1
        能量池: 魔力(30)
    `, `
    - 背景: 斯克莱亚是居住于米德其路达次元的一族，他们天生拥有对魔法的亲和力，擅长搜索能量源、管理资料，是发掘古代文明遗迹的权威种族。
    - 能量感知: 你能敏锐地感知到周围的能量波动，包括能量的运用、魔法物品以及拥有能量的生物，并能精确定位其来源，甚至分辨出能量的类别和强度。
    - 资料统合: 斯克莱亚人擅长整理和使用文献，在解读文件和图纸方面有卓越的天赋。
    - 雪貂形态: 你可以消耗魔力，在人类与小巧的雪貂形态之间自由变化。雪貂形态下，你可以轻松出入狭窄的地方，并且在攀附于其他生物身上时，能巧妙地利用对方来为自己提供掩护。`],

    ["鸢女血统", 12000, "血统", {C:1}, `
        属性: 力量+2, 敏捷+3, 感知+2, 决心+1
        能量池: 风元(45)
    `, `
    - 背景: 鸢女是半人半猛禽的种族，最初是法师军队的探子与游击队，后来在兽人革命中赢得了自由。她们是天生的空战专家，以惊人的速度和机动性著称。
    - 半人半鸟: 你的手臂永久地化为一对羽翼，赋予你强大的飞行能力，但无法再像人类一样使用双手。你的双腿则化为猛禽般的利爪，成为你致命的天生武器。
    - 回旋战法: 你精通利用空中优势进行战斗的技巧。
    - 永不为奴: 自由的意志已经烙印在你的灵魂深处。`],

    ["大熊猫血统", 15000, "血统", {B:1}, `
        属性: 力量+4, 耐力+4, 风度+3
        能量池: 萌力(50)
    `, `
    - 背景: 世界上最可爱的生物是什么？答案就是来自中国的“滚滚”！
    - 大熊猫: 你的外形变为一只可爱的大熊猫，拥有与生俱来的攀爬天赋和熊族语言能力。你肥嘟嘟的身体对冲击伤害有着天然的缓冲作用。
    - 萌货: 你的可爱外表具有无法抗拒的魅力。
    - 熊人族无所畏惧！: 你拥有强大的勇气和不屈的意志。
    - 熊掌: 你厚实的熊掌既可爱又充满力量。`],

    ["第一使徒亚当血统", 54400, "血统", {S:1}, `
        属性: 力量+4, 敏捷+4, 耐力+4, 智力+3, 感知+3, 决心+4, 风度+3, 沉着+4
        能量池: AT能量(120)
    `, `
    - 背景: 亚当是出现在南极的光之巨人，是所有使徒的起源。植入其胚胎后，外形不会发生巨大改变，但掌心会出现一只眼睛。
    - 强化AT力场: 作为使徒之祖，你的AT力场（心之壁）异常强大，能够抵御极为巨大的伤害，甚至可以抵抗即死效果。
    - S2机关: 你拥有名为S2机关的永动核心，它能源源不断地产生能量，并让你无需摄食和呼吸，也能在真空中生存。只要S2机关不被破坏，你就算不上真正死亡。
    - 心灵防护: 你对任何影响心灵的负面效果完全免疫。
    - 光之巨人: 你的本质转变为元素生物，体型变得更为巨大，并获得完美的飞行能力。`],

    ["第三使徒水天使血统", 27200, "血统", {A:1}, `
        属性: 力量+3, 敏捷+6, 耐力+4, 决心+3
        能量池: AT能量(70)
    `, `
    - 背景: 水天使是拥有飞行能力的使徒。植入其胚胎后，头上会出现两张面具，身体浮现绿色组织，背后生出闪光的翅膀。
    - AT力场: 你获得使徒共通的心之壁能力，能展开八边形的闪光力场，抵御外界的物理干涉和伤害。
    - S2机关: 你拥有名为S2机关的永动核心，它能源源不断地产生能量，并让你无需摄食和呼吸，也能在真空中生存。只要S2机关不被破坏，你就算不上真正死亡。
    - 使徒之躯: 你的身体拥有强大的再生能力。你可以从手心和肘部长出锋利的光束矛，并从头上的面具发射出命中后会爆发出十字型光芒的粒子炮。`],

    ["第四使徒书天使血统", 27200, "血统", {A:1}, `
        属性: 力量+3, 敏捷+3, 耐力+4, 决心+3, 风度+3
        能量池: AT能量(70)
    `, `
    - 背景: 书天使形态如同水母。植入其胚胎后，头部后方会出现一个水母状的悬浮罩，发梢变为透明的触手，并从背后伸出两根电热鞭。
    - AT力场: 你获得使徒共通的心之壁能力，能展开八边形的闪光力场，抵御外界的物理干涉和伤害。
    - S2机关: 你拥有名为S2机关的永动核心，它能源源不断地产生能量，并让你无需摄食和呼吸，也能在真空中生存。只要S2机关不被破坏，你就算不上真正死亡。
    - 水母体: 你头部的悬浮场让你能永久离地漂浮，移动速度倍增。你还拥有两条能进行高频震动的粉红色触手作为武器，在攻击时能瞬间撕裂没有装甲防护的目标。`],

    ["第五使徒雷天使血统", 27200, "血统", {A:1}, `
        属性: 敏捷+2, 耐力+4, 感知+4, 沉着+2
        能量池: AT能量(70)
    `, `
    - 背景: 雷天使拥有最强的粒子炮，能呈现各种几何形态。植入其胚胎后，外形变化不大，但会有一个小小的蓝色水晶卫星环绕着你，它既是你的武器平台，也是S2机关的载体。
    - AT力场: 你获得使徒共通的心之壁能力，能展开八边形的闪光力场，抵御外界的物理干涉和伤害。
    - S2机关: 你的S2机关被保护在坚固的水晶卫星中。它能源源不断地产生能量，并让你无需摄食和呼吸，也能在真空中生存。
    - 钻头: 你能从身体伸出一根无坚不摧的小钻头，用于突破坚固的障碍。
    - 加粒子炮: 环绕你的水晶卫星能发射出威力无穷的加粒子炮，射程极远，并能自动锁定并攻击进入你感知范围内的任何有威胁的目标。`],

    ["第六使徒鱼天使血统", 27200, "血统", {A:1}, `
        属性: 力量+6, 敏捷+2, 耐力+6, 感知+2
        能量池: AT能量(70)
    `, `
    - 背景: 鱼天使是水生使徒。植入其胚胎后，背后会长出鱼鳍和短尾，并且可以从头部伸出布满尖牙的巨嘴，S2机关就位于巨嘴之中。
    - AT力场: 你获得使徒共通的心之壁能力，能展开八边形的闪光力场，抵御外界的物理干涉和伤害。
    - S2机关: 你的S2机关位于嘴中。它能源源不断地产生能量，并让你无需摄食和呼吸，也能在真空中生存。
    - 鲸吞: 你获得了在水中自由呼吸和高速移动的能力，并免疫水压。你可以伸出巨嘴直接吞噬敌人，被吞入体内的敌人会持续受到伤害，难以逃脱。`],

    ["第七使徒音乐天使血统", 27200, "血统", {A:1}, `
        属性: 力量+3, 敏捷+3, 耐力+4, 风度+4, 沉着+2
        能量池: AT能量(80)
    `, `
    - 背景: 音乐天使的核心特征是分裂与再生。植入其胚胎后，头上会出现两张面具，身体浮现绿色组织，背后生出闪光的翅膀。
    - AT力场: 你获得使徒共通的心之壁能力，能展开八边形的闪光力场，抵御外界的物理干涉和伤害。
    - 双S2机关: 你拥有两个阴阳鱼形的S2机关。这意味着即使其中一个被摧毁，你依然能够存活。
    - 粒子炮: 你能从头上的面具发射出威力强大的粒子炮。
    - 分体: 当你受到挥砍伤害时，你可以选择不受伤害，而是直接分裂成两个属性有所减弱的小型个体。两个分体共享意识，可以协同作战。虽然合体需要漫长时间且不能被打扰，但这是非常强大的生存能力。`],

    ["第八使徒胎儿天使血统", 27200, "血统", {A:1}, `
        属性: 耐力+6, 感知+2, 风度+2, 沉着+6
        能量池: AT能量(70)
    `, `
    - 背景: 胎儿天使代表着高速进化与适应。植入其胚胎后，你会首先回归到一个蛋的形态。
    - AT力场: 你获得使徒共通的心之壁能力，能展开八边形的闪光力场，抵御外界的物理干涉和伤害。
    - S2机关: 你拥有名为S2机关的永动核心，它能源源不断地产生能量，并让你无需摄食和呼吸，也能在真空中生存。
    - 快速成长: 你会处于一个坚固的蛋中，能感知外界但无法互动。一旦蛋壳被打破，你会在瞬间成长为完全形态，所有属性、防御和抗性都会得到极大的提升。不过这个状态持续数小时后，你会再次变回蛋形态。`],

    ["第九使徒雨天使血统", 27200, "血统", {A:1}, `
        属性: 力量+3, 敏捷+3, 耐力+4, 感知+3, 风度+3
        能量池: AT能量(70)
    `, `
    - 背景: 雨天使是拥有强酸攻击能力的使徒。植入其胚胎后，身上会长出七只眼睛，S2机关隐藏在身体内部。
    - AT力场: 你获得使徒共通的心之壁能力，能展开八边形的闪光力场，抵御外界的物理干涉和伤害。
    - S2机关: 你拥有名为S2机关的永动核心，它能源源不断地产生能量，并让你无需摄食和呼吸，也能在真空中生存。
    - 泪流满面: 你眼睛流出的“泪水”是具有极强腐蚀性的硫酸。你可以主动喷射大范围的酸液，近身攻击你的敌人也会被酸液溅射，你的近战攻击同样附带腐蚀效果。这种硫酸能无视物体的硬度直接造成破坏。`],

    ["第十使徒空天使血统", 27200, "血统", {A:1}, `
        属性: 力量+2, 敏捷+3, 耐力+2, 感知+3, 风度+2
        能量池: AT能量(70)
    `, `
    - 背景: 空天使是巨大的空中要塞。植入其胚胎后，全身会被橘黄色物质覆盖，胸前和双手出现巨大的眼睛，影响精细操作。
    - AT力场: 你获得使徒共通的心之壁能力，能展开八边形的闪光力场，抵御外界的物理干涉和伤害。可以通过全神贯注的防御来强化AT力场的范围和效果。
    - S2机关: 你拥有名为S2机关的永动核心，它能源源不断地产生能量，并让你无需摄食和呼吸，也能在真空中生存。
    - 包裹物质: 覆盖你全身的物质是一层天然的重甲，提供了强大的防御和再生能力。
    - 司空之眼: 你身上的三只大眼睛给予你全方位无死角的视野，极大地增强了你的侦查能力，并让你能够漂浮在空中。
    - 空降飞扑: 你可以从极高的高空以自身为武器，展开AT力场进行毁灭性的坠落攻击，对地面造成巨大范围的破坏。`],

    ["第十一使徒恐怖天使血统", 27200, "血统", {A:1}, `
        属性: 智力+6, 操控+6, 决心+2, 沉着+2
        能量池: 数据流(70)
    `, `
    - 背景: 恐怖天使是纳米病毒集群构成的使徒。植入其胚胎后，外形不变，但你的本质已化为病毒本身。
    - AT力场: 你获得使徒共通的心之壁能力，能展开八边形的闪光力场，抵御外界的物理干涉和伤害。
    - S2机关: 你拥有名为S2机关的永动核心，它能源源不断地产生能量，并让你无需摄食和呼吸，也能在真空中生存。
    - 病毒化: 你可以将自己的意识化为数据，入侵并操控任何科技造物。在骇入电脑、驾驶载具方面，你拥有无与伦比的天赋。你还可以通过接触来感染科技物品，从而随时掌握其位置。`],

    ["第十二使徒夜天使血统", 54400, "血统", {S:1}, `
        属性: 耐力+3, 智力+2, 感知+6, 风度+6, 操控+6, 沉着+6
        能量池: 虚数能量(100)
    `, `
    - 背景: 夜天使是存在于另一个维度的使徒。植入其胚胎后，身上会出现黑白条纹，人们看到的“身体”只是投影，真身藏于影子之中。
    - 反转AT力场: 你的AT力场极为特殊，它不直接抵挡伤害，而是构成了一个名为“狄拉克之海”的虚数空间，你的本体就藏于其中。任何攻击都无法触及位于另一个维度的你。
    - S2机关: 你拥有名为S2机关的永动核心，它能源源不断地产生能量。
    - 狄拉克之海: 这是由你的AT力场维持的独立位面。你可以将范围内的敌人或物体强行吸入其中。进入狄拉克之海的敌人将受到位面法则的压制，实力大减，而你可以随时离开或返回这个属于你的领域。`],

    ["第十三使徒霞天使血统", 27200, "血统", {A:1}, `
        属性: 耐力+4, 感知+4, 操控+4
        能量池: 生物质(70)
    `, `
    - 背景: 霞天使是能够侵蚀和寄生的微生物集群。植入其胚胎后外形不变，但你的本体已非血肉之躯。
    - AT力场: 你获得使徒共通的心之壁能力，能展开八边形的闪光力场，抵御外界的物理干涉和伤害。
    - S2机关: 你拥有名为S2机关的永动核心，它能源源不断地产生能量。
    - 侵蚀: 你可以将自己的微生物集群侵入无助的活物体内，通过意志对抗逐渐夺取对方的身体控制权。成功后，你可以操控其身体，使用其技能，并保留自己的AT力场和S2机关。
    - 肉体强化: 你可以活化并强化被你侵占的有机体，使其身体机能得到大幅提升。
    - 微生物集群: 在使用自己身体时，你是一个由无数微生物构成的集群生物。`],

    ["第十四使徒力天使血统", 54400, "血统", {S:1}, `
        属性: 力量+8, 敏捷+2, 耐力+5, 感知+4, 决心+8, 风度+2
        能量池: AT能量(110)
    `, `
    - 背景: 力天使是机能最完善、拒绝能力最强的使徒。植入其胚胎后，身上会覆盖天然装甲，背后长出绷带般的翅膀，S2机关被保护在体内。
    - 多重AT力场: 你的AT力场并非单层，而是由无数层力场叠加而成。这使它不仅能抵御伤害，还能吸收伤害，极难被中和或突破。
    - 体内S2机关: 你的S2机关隐藏在体内，无法被直接攻击。强大的S2机关能量甚至能让你将AT力场化为武器，直接进行远程压迫攻击。
    - 天生装甲: 你覆盖全身的外壳是一件性能优越的天然盔甲，提供全方位的防御、能量抗性，并赋予你完美的飞行能力。
    - 使徒武装: 你能从双眼发射威力媲美雷天使的强化粒子炮，还能从翅膀中射出坚硬的绷带，以极高的速度切割敌人。`],

    ["第十五使徒鸟天使血统", 21000, "血统", {A:1}, `
        属性: 力量+1, 敏捷+5, 耐力+1, 感知+5, 操控+2, 沉着+2
        能量池: 精神力(70)
    `, `
    - 背景: 鸟天使是位于卫星轨道上的精神攻击型使徒。植入其胚胎后，身后会长出三对巨大的白色翅膀，皮肤变为苍蓝色，并持续散发荧光。
    - AT力场: 你获得使徒共通的心之壁能力，能展开八边形的闪光力场，抵御外界的物理干涉和伤害。
    - S2机关: 你拥有名为S2机关的永动核心，它能源源不断地产生能量。
    - 鸟之诗: 你身后的巨大翅膀能让你以极高的速度在天空中翱翔。
    - 心灵扫描: 你能发射出类似AT力场的光波，对极远距离外的目标进行精神扫描。通过意志对抗，你可以窥探目标的表层思维，洞察其攻防意图，甚至挖掘出其内心深处被遗忘的记忆。`],

    ["第十七使徒自由天使血统", 27200, "血统", {A:1}, `
        属性: 敏捷+3, 感知+3, 决心+3, 沉着+3
        能量池: 意志之力(70)
    `, `
    - 背景: 自由天使是拥有自由意志的使徒，代表着不受束缚的灵魂。植入其胚胎后，外形会变得更加俊美，头发变为白色。
    - AT力场: 你获得使徒共通的心之壁能力，能展开八边形的闪光力场，抵御外界的物理干涉和伤害。
    - S2机关: 你拥有名为S2机关的永动核心，它能源源不断地产生能量。
    - 自由意志: 你代表着绝对的自由。你完全免疫任何环境的负面影响，免疫所有会限制你移动的纠缠、疲劳等状态，免疫擒抱与摔绊，免疫所有心灵层面的控制。你拥有完美的飞行能力，除非你自愿，否则没有什么能束缚你。`],
  ["D级喰种血统", 6000, "血统", {D:1}, `
        属性: 力量+2, 敏捷+1, 耐力+2
        能量池: 赫子能量(40)
    `, `
    - 食尸鬼体质: 喰种的身体机能远超人类，拥有强大的力量和自愈能力。但必须以人类的血肉为食，普通食物味同嚼蜡且无法提供营养。
    - 赫子: 体内Rc细胞的结晶，是喰种的捕食器官与武器。可以从身体特定部位伸展出一个赫子，其形态（如羽赫、鳞赫、甲赫、尾赫）在获得血统时决定。
    - 赫眼: 在使用能力或情绪激动时，巩膜会变为黑色，虹膜变为红色，这是喰种的标志。
    - CCG的天敌: 喰种的赫子坚韧无比，但对CCG开发的“库因克”武器异常脆弱。
    潜藏于人类城市阴影中的捕食者，他们拥有人的外表，却以人为食。为了生存，他们必须在饥饿的本能与伪装的理性之间挣扎。`],

    ["C级喰种血统", 13000, "血统", {C:1}, `
        属性: 力量+3, 敏捷+2, 耐力+3
        能量池: 赫子能量(55)
    `, `
    - 提升特性-食尸鬼体质: 自愈能力得到强化，即使是严重的创伤也能在较短时间内愈合。对人类血肉的渴求也更为强烈。
    - 赫子操控: 对赫子的操控更加熟练，可以进行更复杂、更迅速的攻击与防御。赫子的尺寸与威力也得到提升。
    适应了狩猎与被狩猎的生活，喰种的本能被进一步磨砺。他们不再是挣扎求生的新手，而是都市丛林中合格的猎手。`],

    ["B级喰种血统", 21000, "血统", {B:1}, `
        属性: 力量+4, 敏捷+3, 耐力+4, 感知+1
        能量池: 赫子能量(70)
    `, `
    - 提升特性-食尸鬼体质: 身体强度大幅提升，自愈能力达到断肢再生的程度。
    - 赫者之鳞: 通过吞噬其他喰种的赫子，可以暂时性地强化自身，甚至演化出不完整的赫者外壳（半赫者），获得临时的强大力量与防御，但有失控的风险。
    在同类的相食中，寻求着进化的可能性。跨越禁忌的喰种将获得更强大的力量，但也要承担被疯狂吞噬的风险。`],

    ["A级独眼喰种血统", 33000, "血统", {A:1}, `
        属性: 力量+6, 敏捷+5, 耐力+6, 决心+2
        能量池: 赫子能量(90)
    `, `
    - 独眼之王: 作为人类与喰种的混血，其潜力远超普通喰种。只在单眼呈现赫眼，但Rc细胞的活性与总量都达到了惊人的水平。
    - 完全赫者化: 能够完全掌控吞噬同类获得的力量，将赫子覆盖全身，化为坚不可摧的“赫者”形态。在此形态下，身体能力得到飞跃性提升，且不会丧失理智。
    - 突破界限: 独眼喰种的成长没有极限，每一次超越生死的战斗都有可能让其赫子产生新的变异和进化。
    既不属于人类，也不属于喰种的孤独存在。这份与生俱来的矛盾与痛苦，造就了超越两个种族的王者。他是所有喰种的顶点，也是连接两个世界的唯一桥梁。`],

    ["狼人血统", 7000, "血统", {D:1}, `
        属性: 力量+3, 耐力+2, 感知+1
        能量池: 怒气(35)
    `, `
    - 月夜狂暴: 在月圆之夜，会强制变身为狼人形态，失去理智，攻击性大幅增强，物理抗性提升，但无法使用装备和精细技能。
    - 狼之嗅觉: 拥有极为灵敏的嗅觉，能够追踪气味，分辨情绪，并感知到隐藏的敌人。
    - 银之毒: 对银制品有天生的恐惧和脆弱性，接触银会造成严重的烧灼伤害并抑制自愈能力。
    古老的诅咒在血脉中流淌，月亮是其力量的源泉，也是其疯狂的开关。每当月圆之时，人性的枷锁便会被挣脱。`],

    ["头狼血统", 16000, "血统", {C:1}, `
        属性: 力量+4, 耐力+3, 感知+2, 决心+1
        能量池: 怒气(50)
    `, `
    - 自由变身: 不再完全受月亮的影响，可以通过消耗怒气，主动在人类与狼人形态之间切换，并能在变身后保持部分理智。
    - 感染之咬: 狼人形态下的啃咬附带诅咒，若目标在撕咬下存活，便有一定几率被转化为新的狼人。
    - 提升特性-狼之嗅觉: 感官进一步强化，能够通过气味分辨谎言。
    他们学会了控制血脉中的野性，成为了兽群的领袖。不再是单纯被本能驱使的怪物，而是能够运用诅咒力量的战士。`],

    ["魔狼血统", 24000, "血统", {B:1}, `
        属性: 力量+5, 敏捷+2, 耐力+5, 感知+3
        能量池: 怒气(65)
    `, `
    - 人狼一体: 能够进入完美的“人狼”形态，兼具人类的智慧与狼人的力量。此形态下可以使用武器和技能，并且体型更加矫健，速度与力量并存。
    - 再生之躯: 拥有强大的再生能力，除非击中头部或心脏，否则绝大多数物理伤害都能快速愈合。对银的脆弱性有所降低，但仍是其最大弱点。
    - 统御狼群: 能够通过嚎叫与精神力，对其他狼或狼人进行一定程度的指挥和统御。
    挣脱了诅咒的束缚，将野性与人性完美融合，成为了月夜下真正的统治者。其存在本身就是力量与自由的象征。`],

    ["精灵血统", 7500, "血统", {D:1}, `
        属性: 敏捷+2, 感知+2, 风度+2
        能量池: 自然魔力(40)
    `, `
    - 长寿种: 拥有漫长的生命，对时间的流逝有不同的感受。自然衰老极其缓慢。
    - 森林之子: 在森林、草原等自然环境中，感知能力和移动速度会得到提升。能与大部分温顺的动物进行简单的沟通。
    - 优雅身姿: 天生拥有轻盈的体态和协调的动作，在进行射击、潜行和需要灵巧的行动时具备优势。
    - 钢铁之厌: 对大规模的工业造物和纯粹的科技环境感到本能的排斥和不适。
    诞生自古老森林的优雅种族，与自然万物和谐共生。他们的生命如林间清泉般悠长，他们的箭矢如流星般精准。`],

    ["高等精灵血统", 17000, "血统", {C:1}, `
        属性: 敏捷+3, 感知+3, 智力+2, 风度+3
        能量池: 奥术能量(55)
    `, `
    - 奥术亲和: 血脉中流淌着对魔法能量的天然亲和力，学习和施展魔法事半功倍，并能感受到环境中的魔力流动。
    - 心灵感应: 能够与血脉相近或关系亲密的同伴进行短距离的心灵沟通。
    - 提升特性-优雅身姿: 动作如舞蹈般优雅，能通过专注来强化自身的闪避能力。
    他们是精灵中走上魔法之路的一支，不再仅仅满足于自然的恩赐，而是开始探求世界背后的奥秘法则。智慧与优雅在他们身上融为一体。`],

    ["古代龙裔血统", 38000, "血统", {S:1}, `
        属性: 力量+7, 耐力+7, 决心+6, 智力+5
        能量池: 龙之血(100)
    `, `
    - 龙魂: 你的灵魂本质是龙，这让你拥有钢铁般的意志，免疫绝大多数精神控制和恐惧效果。
    - 元素吐息: 可以在数种强大的元素吐息中选择其一（火焰、寒冰、闪电、强酸），作为你与生俱来的毁灭性武器。
    - 龙鳞甲: 身体表面覆盖着坚不可摧的龙鳞，提供极高的物理与能量伤害减免。
    - 巨龙之力: 肉体力量达到生物的顶峰，近战攻击附带强大的冲击力，并且拥有在任何环境下生存的能力，包括真空和深海。可以消耗大量能量，在短时间内化为一头遮天蔽日的巨龙真身。
    你是远古巨龙血脉最纯粹的继承者，是行走于大地的活传奇。你的存在本身，就是力量、威严与不朽的代名词。`],
     ["【D】稀薄的祖血", 2200, "血统", {}, "属性: 力量+1, 耐力+1\n能量池: 魔力(10)", "这是第四真祖血脉最微末的显现。拥有者身体素质略强于常人，偶尔会在强烈的情感波动中感受到难以抑制的饥渴。此刻，古老的传承仅仅是在沉睡中低语，等待着被唤醒的契机。"],
  ["【C】觉醒的祖血", 8500, "血统", {}, "属性: 力量+2, 敏捷+2, 耐力+2\n能量池: 魔力(30)", "古老的血液开始苏醒，吸血冲动变得更加明确，并与特定的情感紧密相连。不老不死和超速再生的特性初露端倪，虽然恢复力尚弱，但已然超越凡人的界限。拥有者能够感受到体内潜藏的、尚未成型的眷兽之力。"],
  ["【B】统御的祖血", 18000, "血统", {"C": 1}, "属性: 力量+3, 敏捷+3, 耐力+4, 沉着+2\n能量池: 魔力(80)", "真祖的力量进一步解放，让拥有者能够初步驾驭一到两只眷兽。吸食灵媒之血后，力量会得到显著增强。“血之伴侣”的契约变得可能，与他人的羁绊将成为力量的一部分。物理伤害的恢复速度大幅提升。"],
  ["【A】灾厄的祖血", 35000, "血统", {"B": 1}, "属性: 力量+5, 敏捷+4, 耐力+6, 操控+4\n能量池: 魔力(200)", "率领灾厄化身的力量已趋于完整。已能熟练支配复数的强大眷兽，其存在本身就足以扭曲常理。通过与灵媒缔结“血之伴侣”的契约，可以完全释放眷兽的潜能，成为行走于世间的传说。"],
  ["【S】第四真祖之血", 50000, "血统", {"A": 1}, "属性: 力量+8, 敏捷+6, 耐力+8, 智力+5, 操控+6, 风度+5\n能量池: 魔力(500)", "不应存于世的梦幻血脉，世界最强的吸血鬼之证。完美的不老不死之躯，支配全部十二只灾厄化身的眷兽。每一次吸血都是一场君临的仪式，将灵媒的灵魂与自己的王座相连，释放出足以颠覆世界的力量。"],
  ["灵媒之血（瓶装）", 800, "物品", {}, "效果: 一次性道具。在进行吸血时使用，可触发一次力量觉醒的判定，有微小几率解锁一个未激活的技能或强化现有血统能力。", "从拥有高阶灵媒体质的人身上获取的血液，被小心地保存在这个容器中。它散发着对吸血鬼而言无比甘美的气息，是唤醒沉睡力量的钥匙，也是缔结神圣契约的祭品。"],
  ["血之伴侣的契约印记", 15000, "物品", {"B":1}, "效果: 装备。当与缔结了“血之伴侣”契约的角色共同行动时，双方所有属性判定获得dp+1的加成。此物品为唯一性，不可重复获得。", "这不是一个实体物品，而是灵魂层面深刻羁绊的证明。它象征着主君与伴侣间的绝对信赖与魔力连接，当彼此并肩时，这份羁绊将化为超越一切的守护之力。"],
  ["【被动】吸血冲动", 3000, "技能", {}, "效果: 【dp+0;能量池-0】", "该技能为被动触发。当角色陷入“性兴奋”状态时，将获得“吸血”指令的许可，可以对自愿的、拥有强大灵力的异性使用。成功吸血是觉醒眷兽和增强力量的唯一途径。"],
  ["【眷属】血之伴侣", 8000, "技能", {"C":1}, "效果: 【dp+0;能量池-50】", "通过吸血仪式，将一位拥有高阶灵媒体质的异性转化为“血之随从”。对方将获得不死性，并与你共享魔力池。每拥有一名血之伴侣，你的能量池上限提升20点。"],
  ["【眷兽】神羊之金刚", 9000, "技能", {}, "效果: 【dp+1;能量池-60】", "召唤出金刚石构成的大角羊。可发动一次绝对防御，完全反弹一次指向性攻击。之后的回合中，可将漂浮的宝石结晶化为护盾或投射物，进行防御或攻击。"],
  ["【眷兽】牛头王之琥珀", 8500, "技能", {}, "效果: 【dp+1;能量池-55】", "召唤出由熔岩构成的牛头神。其巨大的战斧能够发动无视任何魔法或能量护盾的纯粹物理攻击，是攻破结界和屏障的绝对力量。"],
  ["【眷兽】龙蛇之水银", 11000, "技能", {}, "效果: 【dp+2;能量池-75】", "召唤双头龙蛇。其能力是次元吞噬，可以指定一个目标或一片区域，将其从空间中彻底抹除，无论是实体、能量还是概念，都无法幸免。"],
  ["【眷兽】甲壳之银雾", 7500, "技能", {}, "效果: 【dp+1;能量池-40】", "召唤银雾甲壳兽，将指定范围内的一切物质（实力低于自身）都强制雾化，使其暂时失去物理形态与结合力，是一种强大的控制与快速移动手段。"],
  ["【眷兽】狮子之黄金", 9500, "技能", {}, "效果: 【dp+1;能量池-65】", "召唤黄金之狮。能够释放毁灭性的雷光进行大范围轰炸，或进行精密的电磁操作。是力量与破坏力的象征，足以瞬间清扫战场。"],
  ["【眷兽】冥姬之虹炎", 13000, "技能", {}, "效果: 【dp+2;能量池-80】", "召唤手持虹光之剑的女武神。其斩击能切断万物，不仅是物理上的形态，也包括目标的因果与命运。被此剑斩断之物将彻底失去其存在的根基。"],
  ["【眷兽】夜摩之黑剑", 10000, "技能", {}, "效果: 【dp+2;能量池-70】", "召唤一柄贯穿天际的百米巨剑。通过超重力加速从高空坠落，其一击之力足以毁灭周遭数十公里的地貌，是纯粹破坏力的极致体现。"],
  ["【眷兽】蝎虎之紫", 7800, "技能", {}, "效果: 【dp+1;能量池-50】", "召唤被紫炎包裹的蝎尾狮。能够瞬间分析任何毒素并生成抗体，亦能指定一个敌方目标，强行剥夺其体内的魔力或能量为己用。"],
  ["【眷兽】双角之深绯", 8200, "技能", {}, "效果: 【dp+1;能量池-50】", "召唤拥有音叉双角的战马。通过发出超高频率的共振波，粉碎指定范围内的所有固体物质。同时，它也能提供一次性的超高速空中飞行能力。"],
  ["【眷兽】魔羯之瞳晶", 14000, "技能", {}, "效果: 【dp+2;能量池-90】", "召唤出象征“魅惑”的魔羯。其能力是支配精神，可以对指定目标进行一次精神控制判定。即使是意志坚定的真祖级对手，也可能被其影响。"],
  ["【眷兽】水精之白钢", 12000, "技能", {}, "效果: 【dp+2;能量池-80】", "召唤象征“超回复”的水妖。能够发动一次强大的治愈神迹，将范围内所有友方单位的伤势与异常状态完全清除，令其回归到最完美的状态。"]
];
      // 全局变量
 
        let userPoints = 0;
        let randomItems = [];
        let shoppingCart = []; // 新增：购物车
        const ITEMS_PER_PAGE = 14; // 按要求修改为10

        const shopState  = {
            fixed: { currentCategory: 'all', currentSort: 'asc', currentPage: 1, selectedItem: null },
            random: { currentCategory: 'all', currentSort: 'asc', currentPage: 1, selectedItem: null }
        };


    // 抽奖相关配置
const GACHA_CONFIG = {
    singleCost: 160,
    tenCost: 1440, // 10连抽打9折
    prizeRanges: [
        { min: 30, max: 70, probability: 0.59 },    
        { min: 80, max: 160, probability: 0.25 },   
        { min: 200, max: 600, probability: 0.1 },  
        { min: 1000, max: 4000, probability: 0.05 }, 
        { min: 8000, max: 20000, probability: 0.01 }  
    ]
};
function getRandomShopItems() {
    try {
        const itemsJson = localStorage.getItem('randomShopItems');
        // If itemsJson is null or undefined, return an empty array.
        if (!itemsJson) {
            console.warn('No randomShopItems found in localStorage.');
            return [];
        }
        const items = JSON.parse(itemsJson);
        // Ensure the parsed data is an array.
        return Array.isArray(items) ? items : [];
    } catch (error) {
        console.error('Failed to parse randomShopItems from localStorage:', error);
        // Return an empty array in case of a parsing error to ensure the application doesn't crash.
        return [];
    }
}

function getRandomPrizeRange() {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const range of GACHA_CONFIG.prizeRanges) {
        cumulativeProbability += range.probability;
        if (random <= cumulativeProbability) {
            return range;
        }
    }

    // Fallback to the last (or could be first, depending on desired logic) range if something goes wrong.
    // Using the last one is often safer if probabilities don't sum to exactly 1.
    return GACHA_CONFIG.prizeRanges[GACHA_CONFIG.prizeRanges.length - 1];
}

/**
 * Filters a combined list of fixed and random items to find those within a specific price range.
 * @param {number} min - The minimum price of the range.
 * @param {number} max - The maximum price of the range.
 * @returns {Array} An array of items that fall within the specified price range.
 */
function getItemsInPriceRange(min, max) {
    const randomItems = getRandomShopItems();
    // Combine fixed and random items into a single pool for selection.
    const allItems = [...fixedItems, ...randomItems];

    return allItems.filter(item => {
        // Assuming item is an array like ['itemName', price]
        const price = item[1];
        return price >= min && price <= max;
    });
}

function performGacha(count) {
    const results = [];
    for (let i = 0; i < count; i++) {
        const prizeRange = getRandomPrizeRange();
        const availableItems = getItemsInPriceRange(prizeRange.min, prizeRange.max);
        
        if (availableItems.length > 0) {
            const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
            results.push(randomItem);
        }
    }
    return results;
}
 // 全新的抽卡动画函数
 // 全新的抽卡动画函数，支持手机端拖动和点击
function showGachaAnimation(results, callback) {
    const container = document.getElementById('gacha-animation-container');
    const summaryContainer = document.getElementById('gacha-results-summary');
    container.innerHTML = '';
    summaryContainer.innerHTML = '';
    summaryContainer.style.display = 'none';

    const isMobileView = window.innerWidth <= 800;

    if (isMobileView) {
        // --- 手机端：可交互的3D圆筒动画 ---
        const carousel = document.createElement('div');
        carousel.className = 'gacha-carousel';
        container.appendChild(carousel);

        const cardCount = results.length;
        const angle = 360 / cardCount;
        const radius = Math.round((140 / 2) / Math.tan(Math.PI / cardCount));

        let currentAngle = 0;
        let startX = 0;
        let startAngle = 0;
        let isDragging = false;
        let dragThreshold = 5; // 移动超过5像素才算拖动

        results.forEach((item, index) => {
            const price = item[1];
            let tierClass = 'tier-1';
            if (price >= 8000) tierClass = 'tier-5';
            else if (price >= 1000) tierClass = 'tier-4';
            else if (price >= 200) tierClass = 'tier-3';
            else if (price >= 80) tierClass = 'tier-2';

            const card = document.createElement('div');
            card.className = 'gacha-card';
            card.dataset.index = index;
            const originalTransform = `rotateY(${index * angle}deg) translateZ(${radius}px)`;
            card.style.transform = originalTransform;
            card.style.setProperty('--original-transform', originalTransform);

            card.innerHTML = `
                <div class="gacha-card-inner">
                    <div class="gacha-card-front">?</div>
                    <div class="gacha-card-back ${tierClass}">
                        <div>${item[0]}</div>
                        <div style="font-size: 12px; margin-top: 5px;">${item[1]}积分</div>
                    </div>
                    <div class="gacha-card-details">
                        <div class="gacha-card-details-content">
                            <div><strong>${item[0]}</strong></div>
                            <div>价值: ${item[1]}积分</div>
                            <div>分类: ${item[2]}</div>
                            <div>效果: ${item[4]}</div>
                            <div>描述: ${item[5]}</div>
                            <div style="height: 50px;"></div>
                        </div>
                    </div>
                    <button class="gacha-abandon-btn" style="display: none;">放弃</button>
                </div>
            `;
            carousel.appendChild(card);

            card.addEventListener('click', () => {
                if (isDragging) return; // 如果是拖动，则不触发点击

                const selectedCard = carousel.querySelector('.gacha-card.selected');
                if (selectedCard === card) { // 如果再次点击已选中的卡片，则取消选中
                    card.classList.remove('selected');
                    carousel.classList.remove('has-selection');
                } else {
                    if(selectedCard) selectedCard.classList.remove('selected');
                    card.classList.add('selected');
                    carousel.classList.add('has-selection');
                    currentAngle = -index * angle;
                    carousel.style.transform = `rotateY(${currentAngle}deg)`;
                }
            });

            card.querySelector('.gacha-abandon-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                results[index] = null;
                card.style.opacity = '0.2';
                card.style.pointerEvents = 'none';
            });
        });

        // 拖动事件
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            startAngle = currentAngle;
            isDragging = false;
            carousel.style.transition = 'none'; // 拖动时移除平滑过渡
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX;
            const deltaX = x - startX;
            if (Math.abs(deltaX) > dragThreshold) {
                isDragging = true;
            }
            if(isDragging) {
                const sensitivity = 0.5; // 调整拖动灵敏度
                currentAngle = startAngle + deltaX * sensitivity;
                carousel.style.transform = `rotateY(${currentAngle}deg)`;
            }
        }, { passive: true });

        container.addEventListener('touchend', () => {
            carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            const cardIndex = Math.round(-currentAngle / angle);
            const snappedAngle = -cardIndex * angle;
            currentAngle = snappedAngle;
            carousel.style.transform = `rotateY(${currentAngle}deg)`;

            // 确保touchend后isDragging状态复位
            setTimeout(() => { isDragging = false; }, 50);
        });

        // 初始入场动画
        setTimeout(() => {
            const finalAngle = 360 * 3;
            carousel.style.transition = 'transform 3s cubic-bezier(0.25, 1, 0.5, 1)';
            carousel.style.transform = `rotateY(-${finalAngle}deg)`;
        }, 100);

        setTimeout(() => {
            carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            carousel.querySelectorAll('.gacha-card').forEach(c => c.classList.add('flipped'));
            let summaryHTML = '<h4>本轮收获</h4>';
            results.forEach(item => { summaryHTML += `<div>${item[0]} - ${item[1]}积分</div>`; });
            summaryContainer.innerHTML = summaryHTML;
            summaryContainer.style.display = 'block';
            if (callback) callback();
        }, 3500);

    } else {
        // --- 电脑端：平面翻牌动画 (保持原样，无需修改) ---
        results.forEach((item, index) => {
            const price = item[1];
            let tierClass = 'tier-1';
            if (price >= 8000) tierClass = 'tier-5';
            else if (price >= 1000) tierClass = 'tier-4';
            else if (price >= 200) tierClass = 'tier-3';
            else if (price >= 80) tierClass = 'tier-2';

            const card = document.createElement('div');
             card.className = 'gacha-card';
             card.dataset.itemIndex = index;
             card.innerHTML = `
                 <div class="gacha-card-inner">
                     <div class="gacha-card-front">?</div>
                     <div class="gacha-card-back ${tierClass}">
                         <div>${item[0]}</div>
                         <div style="font-size: 12px; margin-top: 5px;">${item[1]}积分</div>
                     </div>
                     <div class="gacha-card-details">
                         <div class="gacha-card-details-content">
                             <div><strong>${item[0]}</strong></div>
                             <div>价值: ${item[1]}积分</div>
                             <div>分类: ${item[2]}</div>
                             <div>效果: ${item[4]}</div>
                             <div>描述: ${item[5]}</div>
                             <div style="height: 50px;"></div>
                         </div>
                     </div>
                     <button class="gacha-abandon-btn" style="display: none;">放弃</button>
                 </div>
             `;
            container.appendChild(card);

            setTimeout(() => card.classList.add('flipped'), index * 200 + 500);

            card.addEventListener('click', () => {
                 if (!card.classList.contains('flipped')) return;
                 const isSelected = card.classList.contains('selected');
                 container.querySelectorAll('.gacha-card').forEach(c => {
                     c.classList.remove('selected');
                     c.querySelector('.gacha-card-details').classList.remove('show');
                     c.querySelector('.gacha-abandon-btn').style.display = 'none';
                 });
                 if (!isSelected) {
                     card.classList.add('selected');
                     card.querySelector('.gacha-card-details').classList.add('show');
                     card.querySelector('.gacha-abandon-btn').style.display = 'block';
                 }
            });

            card.querySelector('.gacha-abandon-btn').addEventListener('click', (e) => {
                 e.stopPropagation();
                 results[index] = null;
                 card.style.opacity = '0.5';
                 card.style.pointerEvents = 'none';
            });
        });

        setTimeout(() => {
            if (callback) callback();
        }, results.length * 200 + 1500);
    }
}



async function processGachaRewards(results) {
    // 过滤掉被放弃的物品
    const validResults = results.filter(item => item !== null);
    
    if (validResults.length === 0) {
        return; // 所有物品都被放弃
    }
    
    // 检查本轮重复
    const itemCounts = {};
    const finalResults = [];
    
    for (const item of validResults) {
        const key = `${item[2]}-${item[0]}`; // category-name作为key
        if (itemCounts[key]) {
            // 本轮重复，转为积分
            const extraPoints = Math.floor(item[1] / 2);
            playCharacterData.货币段.积分[0] += extraPoints;
        } else {
            itemCounts[key] = 1;
            finalResults.push(item);
        }
    }
    
    let updateMemoryCommands = [];
    let userMessages = [];
    
    finalResults.forEach(item => {
        const command = getPurchaseCommand(item);
        if (command) {
            updateMemoryCommands.push(command);
            userMessages.push(item[0]);
        }
    });
    
    // 扣除抽奖费用
    const cost = results.length === 1 ? GACHA_CONFIG.singleCost : GACHA_CONFIG.tenCost;
    updateMemoryCommands.push(`*.set_attribute('货币段.${currentTheme.currency}', '${playCharacterData.货币段.积分[0]}', '${playCharacterData.货币段.积分[0] - cost}');`);
    
    if (updateMemoryCommands.length > 0) {
        let finalCommand = `<updateMemory>\n${[...new Set(updateMemoryCommands)].join('\n')}\n</updateMemory>\n`;
        if (userMessages.length > 0) {
            finalCommand += `<(货币已扣除，禁止重复扣除，奖品已交付，禁止重复交付，禁止描写价格)${currentGameData.user_character.name}通过抽奖获得了以下物品：${userMessages.join("，")}。>`;
        }
        await triggerassa(`/setinput ${finalCommand}`);
    }
}

function startGacha(count) {
    const cost = count === 1 ? GACHA_CONFIG.singleCost : GACHA_CONFIG.tenCost;
 
  
    if (playCharacterData.货币段.积分[0] < cost) {
        showModal('shop-modal', "积分不足", `您需要 ${cost} 积分才能进行${count === 1 ? '单抽' : '十连抽'}。`);
        return;
    }
    
    const results = performGacha(count);
    if (results.length === 0) {
        showModal('shop-modal', "抽奖失败", "没有可抽取的物品。");
        return;
    }
    
    // 显示抽奖模态框
    showModal('gacha-modal');
    document.getElementById('gacha-modal-title').textContent = 
        count === 1 ? '单抽结果' : '十连抽结果';
    document.getElementById('gacha-confirm-btn').style.display = 'none';
    
    // 开始动画
    showGachaAnimation(results, () => {
        // 动画完成后显示确认按钮
        document.getElementById('gacha-confirm-btn').style.display = 'inline-block';
        document.getElementById('gacha-confirm-btn').onclick = async () => {
            await processGachaRewards(results);
            hideModal('gacha-modal');
            showModal('shop-modal', "抽奖完成", `成功获得 ${results.length} 件物品！数据将在下次刷新时更新。`);
            playCharacterData.货币段.积分[0] = playCharacterData.货币段.积分[0] - cost;
        };
    });
}

          // ========== 新增：妈妈为你添加的全局变量和核心计算函数 ==========
        const plotLevels = ['D', 'C', 'B', 'A', 'S'];
 /**
 * 【V9 双向兑换版】采用先合成后分解的结算逻辑，完美处理所有兑换场景。
 * @param {object} requiredPlots - 商品所需的支线剧情成本
 * @returns {object} - 返回一个计划对象 { affordable: boolean, decompositionPlan: object }
 */
function checkPlotAffordability(requiredPlots) {
    // 步骤一：全局购买力审计 (最可靠的保险)
    const conversionRates = { 'S': 81, 'A': 27, 'B': 9, 'C': 3, 'D': 1 };
    let totalRequiredInD = 0;
    let totalOwnedInD = 0;

    for (const level of plotLevels) {
        totalRequiredInD += (requiredPlots[level] || 0) * conversionRates[level];
        totalOwnedInD += playCharacterData.货币段.支线剧情[level][0] * conversionRates[level];
    }

    if (totalOwnedInD < totalRequiredInD) {
        return { affordable: false, decompositionPlan: {} };
    }

    // 步骤二：既然买得起，开始制定详细的支付计划
    let simulatedPlots = JSON.parse(JSON.stringify(playCharacterData.货币段.支线剧情));
    let decompositionPlan = { S: 0, A: 0, B: 0, C: 0, D: 0 };

    // 阶段一：向上合成，将所有低级富余资产转化为高级购买力
    for (let i = 0; i < plotLevels.length - 1; i++) {
        const currentLevel = plotLevels[i];
        const higherLevel = plotLevels[i + 1];

        // 支付当前等级所需
        const needed = requiredPlots[currentLevel] || 0;
        simulatedPlots[currentLevel][0] -= needed;

        // 如果支付后还有富余，就全部合成到上一级
        if (simulatedPlots[currentLevel][0] > 0) {
            const canSynthesize = Math.floor(simulatedPlots[currentLevel][0] / 3);
            if (canSynthesize > 0) {
                // 注意：这里我们不记录合成计划，因为最终的分解指令会自动处理好一切
                simulatedPlots[currentLevel][0] -= canSynthesize * 3;
                simulatedPlots[higherLevel][0] += canSynthesize;
            }
        }
    }
    // 单独支付最高级S级
    simulatedPlots['S'][0] -= (requiredPlots['S'] || 0);


    // 阶段二：向下分解，用高级资产支付低级欠款
    for (let i = plotLevels.length - 1; i >= 0; i--) {
        const currentLevel = plotLevels[i];

        // 如果当前级别出现“负债”，说明需要从更高级别分解来填补
        if (simulatedPlots[currentLevel][0] < 0) {
            const deficit = -simulatedPlots[currentLevel][0]; // 这是欠款数

            if (currentLevel !== 'S') {
                const higherLevel = plotLevels[i + 1];

                // 计算需要分解多少个高级支线来弥补
                const amountToDecompose = Math.ceil(deficit / 3);

                // 在分解计划中记录下来
                decompositionPlan[higherLevel] += amountToDecompose;

                // 更新模拟账本
                simulatedPlots[higherLevel][0] -= amountToDecompose;
                simulatedPlots[currentLevel][0] += amountToDecompose * 3;
            }
        }
    }

    // 如果所有流程走完，说明计划可行
    return { affordable: true, decompositionPlan: decompositionPlan };
}

 

function SafeGetValue(value) {
            if (Array.isArray(value)) {
                let res = value.length > 0 ? value[0] : '';
                return(res === '' || res === null || res === undefined) ? '无' : res;
            }
            return (value === '' || value === null || value === undefined) ? '无' : value;
        }
 

        
    /**
 * 修改：商店初始化，实现动态分类
 */
/**
 * 修改：商店初始化，移除旧的随机商品解析
 */
 function initializeShopData() {
    userPoints = parseInt(SafeGetValue(playCharacterData.货币段.积分) || 0, 10);

    // 关键：不再对 randomItems 做任何操作。它将保持当前的状态。

    // --- 动态生成分类 ---
    const fixedCategoryTabs = document.querySelector('#page-fixed-shop .category-tabs');
    const randomCategoryTabs = document.querySelector('#page-random-shop .category-tabs');
    fixedCategoryTabs.innerHTML = '<button class="control-btn active" data-section="fixed" data-category="all">全部</button>';
    randomCategoryTabs.innerHTML = '<button class="control-btn active" data-section="random" data-category="all">全部</button>';
    for (const category of ["物品", "技能","基础技能", "家具", "血统"]) {
        fixedCategoryTabs.innerHTML += `<button class="control-btn" data-section="fixed" data-category="${category}">${category}</button>`;
        randomCategoryTabs.innerHTML += `<button class="control-btn" data-section="random" data-category="${category}">${category}</button>`;
    }

    // 清空购物车，但保留商品列表
    shoppingCart = [];
    updateCartView();

    renderShopSection('fixed');
    renderShopSection('random'); // 渲染当前内存中已有的随机商品
}

 
//    /**
//          * 初始化数据 (接收随机数据作为参数)
//          * @param {string} randomDataPayload - 包含随机商品信息的字符串
//          */
//         async function initializeData(randomDataPayload) {
//             try {
                
         
//                 // 核心数据加载（积分等），必须成功
//                 userPoints = parseInt(SafeGetValue(currentGameData.user_character.points) || 0);
//                 document.getElementById('userPoints').textContent = userPoints;

//                 // --- 随机商品解析（单独错误处理）---
//                 try {
//                     // 直接使用传入的参数进行解析
//                     randomItems = parseRandomItems(randomDataPayload);
//                     //console.log("随机商品解析成功:", randomItems);
//                 } catch (error) {
//                     console.error("解析随机商品时发生严重错误:", error);
//                     randomItems = []; // 确保即使解析失败，randomItems也是一个空数组
//                 }

//                 // --- 渲染所有部分 ---
//                 renderShopSection('page-fixed-shop');
//                 renderShopSection('page-random-shop');

//             } catch (error) {
//                 console.error("初始化数据时发生严重错误:", error);
//                 showModal("错误", "核心数据加载失败，商店无法开启。请联系主神。");
//                 renderShopSection('fixed');
//             }
//         }

      function getFilteredAndSortedItems(section) {
            // 获取搜索词并转为小写，方便不区分大小写地匹配
            const searchTerm = document.getElementById('shop-search-input').value.toLowerCase().trim();

            // 确定基础商品列表 (固定或随机)
            let items = section === 'fixed' ? fixedItems : randomItems;

            // 如果有搜索词，则执行搜索过滤
            if (searchTerm) {
                return items.filter(item => {
                    // 将商品的所有信息（名称、价格、类型、效果、描述）拼接成一个字符串
                    // 然后检查这个字符串是否包含搜索词
                    return item.join(' ').toLowerCase().includes(searchTerm);
                });
            }

            // 如果没有搜索词，执行原来的分类和排序逻辑
            const { currentCategory, currentSort } = shopState[section];

            const filtered = currentCategory === 'all'
                ? items
                : items.filter(item => item[2] === currentCategory);

            return filtered.sort((a, b) => currentSort === 'asc' ? a[1] - b[1] : b[1] - a[1]);
        }


    function renderShopSection(section) {
        renderShopItems(section);
        renderShopPagination(section);
        resetShopDetails(section);
    }


    
/**
 * 新增：格式化商品成本的显示
 * @param {number} price - 积分价格
 * @param {object} plots - 支线剧情需求对象
 * @returns {string} - 格式化后的成本字符串
 */
function formatItemCost(price, plots) {
    let plotString = Object.entries(plots)
        .filter(([, value]) => value > 0)
        .map(([key, value]) => `${value} ${key}级`)
        .join(' + ');

    if (plotString && price > 0) {
       return `${plotString} + ${price} ${currentTheme.currency}`;
    } else if (plotString) {
        return `${plotString}`;
    } else {
         return `${price} ${currentTheme.currency}`;
    }
}

 /*
    宝贝，找到原来的 renderShopItems 函数，用这个更新后的版本替换它。
    它现在能更准确地显示“剧情不足”或“分解购买”了。
*/
function renderShopItems(section) {
    const items = getFilteredAndSortedItems(section);
    const { currentPage } = shopState[section];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const listElement = document.getElementById(`items-display-list-${section}`);
    listElement.innerHTML = '';

    pageItems.forEach((item, index) => {
        const [name, price, , plots] = item;
        const absoluteIndex = startIndex + index;
        const isInCart = shoppingCart.some(cartItem => cartItem[0] === name);

        // 使用重构后的V2版本检查函数
        const plotCheck = checkPlotAffordability(plots);

        let buttonText = '购买';
        let buttonDisabled = false;
        let buttonClass = '';

        if (isInCart) {
            buttonText = '已添加';
            buttonDisabled = true;
        } else if (!plotCheck.affordable) {
            buttonText = `${currentTheme.plot}不足`;
            buttonDisabled = true;
        } else {
            // 检查计划中是否有需要分解的（值 > 0）
            const needsDecomposition = Object.values(plotCheck.decompositionPlan).some(val => val > 0);
            if (needsDecomposition) {
                buttonText = '分解购买';
                buttonClass = 'decomposable';
            }
        }

        const row = document.createElement('div');
        row.className = 'item-row';
        row.innerHTML = `
            <div class="item-name">${name}</div>
            <div class="item-price">${formatItemCost(price, plots)}</div>
            <button class="buy-button ${buttonClass}" ${buttonDisabled ? 'disabled' : ''}>${buttonText}</button>
        `;

        row.addEventListener('click', (e) => {
            if (e.target.classList.contains('buy-button')) return;
            document.querySelectorAll(`#items-display-list-${section} .item-row`).forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
            shopState[section].selectedItem = item;
            showItemDetails(section, item);
        });

        const buyButton = row.querySelector('.buy-button');
        if (!buttonDisabled) {
            buyButton.addEventListener('click', (e) => {
                e.stopPropagation();
                buyItem(section, absoluteIndex, buyButton);
            });
        }
        listElement.appendChild(row);
    });
}


function resetShopDetails(section) {
             document.getElementById(`item-details-display-${section}`).innerHTML = '<div class="detail-placeholder">选择一个商品查看详情</div>';
        }

        
/**
 * 修改：显示商品详情
 */
function showItemDetails(section, item) {
    const [name, price, category, plots, effect, description] = item;
    const detailsElement = document.getElementById(`item-details-display-${section}`);

    detailsElement.innerHTML = `
        <div class="detail-title">${name}</div>
        <div class="detail-info">
            <div class="detail-label">成本:</div>
            <div class="detail-value highlight">${formatItemCost(price, plots)}</div>
        </div>
        <div class="detail-info">
            <div class="detail-label">效果:</div>
            <div class="detail-value">${effect}</div>
        </div>
        <div class="detail-info">
            <div class="detail-label">描述:</div>
            <div class="detail-value">${description}</div>
        </div>
    `;
}

        function renderShopPagination(section) {
            const items = getFilteredAndSortedItems(section);
            const totalItems = items.length;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
            const { currentPage } = shopState[section];
            const paginationElement = document.getElementById(`pagination-${section}`);
            paginationElement.innerHTML = '';

            if (totalPages <= 1) return;

            paginationElement.innerHTML = `
                <button class="page-button" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage('${section}', ${currentPage - 1})">上一页</button>
                <span class="page-info">${currentPage} / ${totalPages}</span>
                <button class="page-button" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage('${section}', ${currentPage + 1})">下一页</button>
            `;
        }

        function changePage(section, page) {
            shopState[section].currentPage = page;
            shopState[section].selectedItem = null;
            renderShopItems(section);
            resetShopDetails(section);
            renderShopPagination(section); // 更新分页按钮状态
        }


/**
 * 新增：根据商品分类生成购买指令
 * @param {object} item - 商品对象
 * @returns {string} - 生成的 memory 指令字符串
 */
 function getPurchaseCommand(item) {
    const [name, price, category, , effect, description] = item;
    const attributeToCategoryMap = {
        "力量": "生理属性", "敏捷": "生理属性", "耐力": "生理属性",
        "智力": "心智属性", "感知": "心智属性", "决心": "心智属性",
        "风度": "互动属性", "操控": "互动属性", "沉着": "互动属性"
    };
    
    const skillToCategoryMap = {
        "运动": "生理技能", "肉搏": "生理技能", "驾驶": "生理技能", "枪械": "生理技能",
        "手上功夫": "生理技能", "隐藏": "生理技能", "求生": "生理技能", "白刃": "生理技能", "弓箭": "生理技能",
        "学识": "心智技能", "电脑": "心智技能", "手艺": "心智技能", "调查": "心智技能",
        "医学": "心智技能", "神秘学": "心智技能", "科学": "心智技能",
        "动物沟通": "互动技能", "感受": "互动技能", "表达": "互动技能", "胁迫": "互动技能",
        "交际": "互动技能", "掩饰": "互动技能"
    };

    // 检查重复并处理
    function checkAndHandleDuplicate(type, key, currentData) {
        if (currentData && currentData[key]) {
            console.log(`检测到重复${type}: ${key}，转换为积分`);
            return `*.set_attribute('货币段.${currentTheme.currency}', '${userPoints}', '${userPoints + Math.floor(price / 2)}')`;
        }
        return null;
    }

    switch (category) {
        case '物品': {
    // 假设 name, description, effect 是从这个 case 的上下文获得的变量
    const backpack = assaSettingsData?.global_set?.背包;
    
    console.log('=== 物品处理开始 ===');
    console.log('物品名称:', name);
    console.log('物品描述:', description);
    console.log('物品效果:', effect);
    console.log('背包数据:', backpack);

    // 检查背包中是否已经存在该物品
    if (backpack && backpack[name]) {
        console.log('物品已存在，准备更新数量');
        console.log('当前物品数据类型:', typeof backpack[name]);
        console.log('当前物品原始数据:', backpack[name]);
        
        // 如果物品存在，我们就更新它的数量
        try {
            let itemData;
            
            // 关键修复：检查数据类型
            if (typeof backpack[name] === 'string') {
                console.log('数据是字符串格式，尝试解析JSON');
                itemData = JSON.parse(backpack[name]);
                console.log('JSON解析成功:', itemData);
            } else if (typeof backpack[name] === 'object' && backpack[name] !== null) {
                console.log('数据已经是对象格式，直接使用');
                itemData = backpack[name];
            } else {
                console.log('数据格式未知，创建新的物品数据');
                throw new Error('未知的数据格式');
            }

            console.log('解析后的物品数据:', itemData);

            // 第二步：从对象中获取'num'这个键的值
            const currentQuantity = parseInt(itemData.num, 10) || 0;
            console.log('当前数量:', currentQuantity);

            // 第三步：将当前数量加一
            itemData.num = currentQuantity + 1;
            console.log('更新后数量:', itemData.num);

            // 第四步：将我们更新过的对象转换回JSON字符串，以便存回内存
            const newValue = JSON.stringify(itemData);
            console.log('准备存储的JSON字符串:', newValue);

            // 返回更新指令
            const updateCommand = `*.memory("global_set.背包", "${name}", '${newValue}');`;
            console.log('生成的更新指令:', updateCommand);
            console.log('=== 物品处理结束（更新） ===');
            
            return updateCommand;

        } catch (error) {
            console.error(`解析物品 [${name}] 的数据时出错:`, error);
            console.log('错误的原始数据:', backpack[name]);
            console.log('数据类型:', typeof backpack[name]);
            
            // 尝试更详细的错误分析
            if (typeof backpack[name] === 'object') {
                console.log('这是一个对象，但JSON.parse失败了');
                console.log('对象的keys:', Object.keys(backpack[name]));
                console.log('对象转为字符串:', JSON.stringify(backpack[name]));
            }
            
            // 我们可以选择用全新的数据覆盖掉损坏的数据
            const newItemJSON = JSON.stringify({ info: description, effect: effect, num: 1 });
            console.log('创建新的物品数据:', newItemJSON);
            
            const fallbackCommand = `*.memory('global_set.背包', '${name}', '${newItemJSON}');`;
            console.log('生成的回退指令:', fallbackCommand);
            console.log('=== 物品处理结束（错误回退） ===');
            
            return fallbackCommand;
        }
    } else {
        console.log('物品不存在，创建新物品');
        
        // 如果物品不存在，我们就创建一个新的
        const newItemData = {
            info: description,
            effect: effect,
            num: 1
        };
        console.log('新物品数据对象:', newItemData);
        
        // 将新物品对象转换为JSON字符串
        const newValue = JSON.stringify(newItemData);
        console.log('新物品JSON字符串:', newValue);

        // 返回创建新物品的指令
        const createCommand = `*.memory('global_set.背包', '${name}', '${newValue}');`;
        console.log('生成的创建指令:', createCommand);
        console.log('=== 物品处理结束（新建） ===');
        
        return createCommand;
    }
}
     case '技能': {
            const duplicate = checkAndHandleDuplicate('技能', name, assaSettingsData?.global_set?.其他技能);
            if (duplicate) return duplicate;
            return `*.memory('global_set.其他技能','${name}','{"info":"${description}","effect":"${effect}"}');`;
        }
        
        case '家具': {
            const duplicate = checkAndHandleDuplicate('家具', name, assaSettingsData?.home?.items);
            if (duplicate) return duplicate;
            return `*.memory("home.items","${name}","${description}");\n*.memory("global_set.settings","${name}","${effect}");`;
        }
        
        case '图纸': {
            const duplicate = checkAndHandleDuplicate('图纸', `${name}(图纸)`, assaSettingsData?.global_set?.settings);
            if (duplicate) return duplicate;
            return `*.memory("global_set.settings","${name}(图纸)","${description}");`;
        }
        
        case '基础技能': {
            const category_2 = skillToCategoryMap[name];
            if (category_2) {
                // 检查是否已有该技能
                const existingSkill = playCharacterData?.技能段?.[category_2]?.[name];
                if (existingSkill && existingSkill[0] > 0) {
                    return `*.set_attribute('货币段.${currentTheme.currency}', '${userPoints}', '${userPoints + Math.floor(price / 2)}')`;
                }
                return `*.set_attribute("技能段.${category_2}.${name}",0,1);`;
            }
            console.warn(`未找到技能"${name}"的类别映射。`);
            return "";
        }
        
        case '血统': {
            const currentBloodline = playCharacterData?.能力段?.名称?.[0];
            if (currentBloodline && currentBloodline !== "_") {
                return `*.set_attribute('货币段.${currentTheme.currency}', '${userPoints}', '${userPoints + Math.floor(price / 2)}')`;
            }
            
            const commands = [];
            const processedDescription = description.replace(/\r?\n/g, '\\n');
            commands.push(`*.set_attribute("能力段.类型", "${playCharacterData.能力段.类型[0]}", "血统");`);
            commands.push(`*.set_attribute("能力段.名称", "${playCharacterData.能力段.名称[0]}", "${name}");`);
            commands.push(`*.set_attribute("能力段.效果", "_", "${processedDescription}");`);
            
            const effectLines = effect.split('\n').map(line => line.trim()).filter(line => line);
            for (const line of effectLines) {
                if (line.startsWith('属性:')) {
                    const attributesPart = line.replace('属性:', '').trim();
                    const attributeChanges = attributesPart.split(',').map(part => part.trim());
                    for (const change of attributeChanges) {
                        const [attrName, valueStr] = change.split('+');
                        const valueToAdd = parseInt(valueStr, 10);
                        const category = attributeToCategoryMap[attrName.trim()];
                        if (category && !isNaN(valueToAdd)) {
                            const path = `属性段.${category}.${attrName.trim()}.基础`;
                            const currentValue = playCharacterData.属性段[category][attrName.trim()].基础[0];
                            commands.push(`*.set_attribute("${path}", ${currentValue}, ${currentValue + valueToAdd});`);
                        }
                    }
                } else if (line.startsWith('能量池:')) {
                    const energyPart = line.replace('能量池:', '').trim();
                    const match = energyPart.match(/(\S+)\s*\((\d+)\)/);
                    if (match) {
                        const poolName = match[1];
                        const poolValue = parseInt(match[2], 10);
                        commands.push(`*.set_attribute("衍生属性段.能量池.名称", "${playCharacterData.衍生属性段.能量池.名称[0]}", "${poolName}");`);
                        commands.push(`*.set_attribute("衍生属性段.能量池.上限", ${playCharacterData.衍生属性段.能量池.上限[0]}, ${poolValue});`);
                        commands.push(`*.set_attribute("衍生属性段.能量池.当前值", ${playCharacterData.衍生属性段.能量池.当前值[0]}, ${poolValue});`);
                    }
                }
            }
            return commands.join('\n');
        }
        
        default: {
            console.warn(`未知的商品分类: ${category}，使用默认记忆处理。`);
            return `*.memory("global_set.背包", "${name}", "${effect}");`;
        }
    }
}




          function buyItem(section, itemIndexInFullList, buttonElement) {
            const items = getFilteredAndSortedItems(section);
            const item = items[itemIndexInFullList];
            if (!item) return;

            const [, price] = item;
            const currentCartTotal = shoppingCart.reduce((sum, cartItem) => sum + cartItem[1], 0);

     // 修改为（注意参数顺序和 modal ID）：
if ((currentCartTotal + price) > userPoints) {
    showModal('shop-modal', "货币不足", `购物车总价将超过您的货币，无法添加 “${item[0]}”。`);
    return;
}

            // 添加到购物车
            shoppingCart.push(item);

            // 更新按钮状态
            buttonElement.textContent = '已添加';
            buttonElement.disabled = true;

            // 更新购物车显示
            updateCartView();
        }


         // 新增：更新购物车视图
                // 新增：更新购物车视图
        function updateCartView() {
            const cartItemsList = document.getElementById('cart-items-list');
            const cartTotalElement = document.getElementById('cart-total');
            const checkoutButton = document.getElementById('checkout-button');

            if (shoppingCart.length === 0) {
                cartItemsList.innerHTML = '购物车是空的';
                cartTotalElement.textContent = `总计: 0 ${currentTheme.currency}`;
                checkoutButton.disabled = true;
                return;
            }

            cartItemsList.innerHTML = '';
            let total = 0;
            shoppingCart.forEach(item => {
                const [name, price] = item;
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
               cartItemElement.textContent = `${name} - ${price} ${currentTheme.currency}`;
                cartItemsList.appendChild(cartItemElement);
                total += price;
            });

           cartTotalElement.textContent = `总计: ${total} ${currentTheme.currency}`;
            checkoutButton.disabled = false;
        }

 /**
 * 【V6 净值核算最终版】结算购物车，完美处理所有混合支付场景
 */
async function checkout() {
    if (shoppingCart.length === 0) return;

    // 1. 计算总成本 (与之前相同)
    let totalCost = { points: 0, plots: {} };
    for (const level of plotLevels) { totalCost.plots[level] = 0; }
    shoppingCart.forEach(item => {
        totalCost.points += item[1];
        const itemPlots = item[3];
        for (const plotType in itemPlots) {
            totalCost.plots[plotType] += itemPlots[plotType];
        }
    });

    // 2. 检查支付能力 (与之前相同)
    if (totalCost.points > userPoints) {
        showModal('shop-modal', "结算失败", "您的货币不足。");
        return;
    }
    const plotPlan = checkPlotAffordability(totalCost.plots);
    if (!plotPlan.affordable) {
        showModal('shop-modal', "结算失败", `您的货币不足。`);
        return;
    }

    try {
        const originalPlots = playCharacterData.货币段.支线剧情;
        const conversionRates = { 'S': 81, 'A': 27, 'B': 9, 'C': 3, 'D': 1 };

        // 3. ★★★ 核心逻辑：净值核算法 ★★★
        // a. 将你拥有的所有支线剧情，全部折算成最基础的 D 级“总资产”
        let totalAssetsInD = 0;
        for (const level of plotLevels) {
            totalAssetsInD += originalPlots[level][0] * conversionRates[level];
        }

        // b. 将需要支付的所有商品，也全部折算成 D 级“总负债”
        let totalCostInD = 0;
        for (const level in totalCost.plots) {
            totalCostInD += totalCost.plots[level] * conversionRates[level];
        }

        // c. 计算出交易后你应有的“剩余总资产” (D级)
        let remainingAssetsInD = totalAssetsInD - totalCostInD;

        // d. 将“剩余总资产”以最高效的方式，重新兑换成 S, A, B, C, D 的形式
        const finalPlots = {};
        for (let i = plotLevels.length - 1; i >= 0; i--) {
            const level = plotLevels[i];
            const rate = conversionRates[level];
            const count = Math.floor(remainingAssetsInD / rate);
            finalPlots[level] = [count, originalPlots[level][1]]; // 保留描述
            remainingAssetsInD -= count * rate;
        }

        // 4. 生成所有更新指令
        let updateMemoryCommands = [];
        let userMessages = [];

        // a. 生成支线剧情指令 (从原始值 -> 最终计算出的值)
        plotLevels.forEach(level => {
            const originalVal = originalPlots[level][0];
            const finalVal = finalPlots[level][0];
            if (originalVal !== finalVal) {
                updateMemoryCommands.push(`*.set_attribute('货币段.${currentTheme.plot}.${level}', '${originalVal}', '${finalVal}');`);
            }
        });

        // b. 生成扣除积分指令
        if (totalCost.points > 0) {
            updateMemoryCommands.push(`*.set_attribute('货币段.${currentTheme.currency}', '${userPoints}', '${userPoints - totalCost.points}')`);
        }

        // c. 生成获得物品的指令
        shoppingCart.forEach(item => {
            updateMemoryCommands.push(getPurchaseCommand(item));
            userMessages.push(item[0]);
        });

        // 5. 组合并发送最终指令
        let finalCommand = `<updateMemory>\n${[...new Set(updateMemoryCommands)].join('\n')}\n</updateMemory>\n`;
        finalCommand += `<(货币已扣除，禁止重复扣除，禁止描写价格和购买过程)${currentGameData.user_character.name}购买了以下商品：${userMessages.join("，")}。>`;

        const purchasedItemCount = shoppingCart.length;
        await triggerassa(`/setinput ${finalCommand}`);
        clearCart();
        showModal('shop-modal', "购买成功", `成功购买 ${purchasedItemCount} 件商品！数据将在下次刷新时更新。`);

    } catch (error) {
        console.error("结算失败:", error);
        showModal('shop-modal', "购买失败", "结算过程中发生错误，请重试。");
    }
}

// 新增：清空购物车并刷新视图
        function clearCart() {
            shoppingCart = [];
            updateCartView();
            // 重新渲染商品列表以重置所有购买按钮
            renderShopSection('fixed');
            renderShopSection('random');
        }
 
        function setupShopEventListeners() {
           
        // 商店内部分区切换
        document.querySelectorAll('.shop-nav-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const pageId = `page-${this.dataset.page}-shop`;
                document.querySelectorAll('.shop-nav-item').forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                document.querySelectorAll('.shop-page').forEach(page => page.classList.remove('active'));
                const targetPage = document.getElementById(pageId);
                if(targetPage) targetPage.classList.add('active');
            });
        });

          // 使用事件委托，为动态生成的商店控制按钮（分类、排序）绑定事件
       document.querySelector('.shop-content-area').addEventListener('click', function(e) {
            // 我们只关心对 .control-btn 的点击
            const button = e.target.closest('.control-btn');

            // 如果点击的不是按钮，或者按钮不在 .shop-controls 区域内，就什么都不做
            if (!button || !button.closest('.shop-controls')) {
                return;
            }

            const section = button.dataset.section;
            const isSortBtn = button.dataset.sort;

            if (isSortBtn) { // 如果是排序按钮
                shopState[section].currentSort = button.dataset.sort;
                // 移除同区域内其他排序按钮的激活状态
                document.querySelectorAll(`.sort-controls .control-btn[data-section="${section}"]`).forEach(b => b.classList.remove('active'));
            } else { // 如果是分类按钮
                shopState[section].currentCategory = button.dataset.category;
                // 移除同区域内其他分类按钮的激活状态
                document.querySelectorAll(`.category-tabs .control-btn[data-section="${section}"]`).forEach(b => b.classList.remove('active'));
            }

            // 为被点击的按钮添加激活状态
            button.classList.add('active');

            // 重置状态并重新渲染商品列表
            shopState[section].currentPage = 1;
            shopState[section].selectedItem = null;
            renderShopSection(section);
        });

        // 结算按钮
        document.getElementById('checkout-button').addEventListener('click', checkout);

        // 分页按钮需要通过 onclick 动态调用，或者在这里用事件委托来处理
        document.querySelectorAll('.shop-pagination').forEach(paginationContainer => {
            paginationContainer.addEventListener('click', (e) => {
                if(e.target.tagName === 'BUTTON') {
                    const section = e.target.parentElement.id.replace('pagination-', '');
                    const currentPage = shopState[section].currentPage;
                    const totalPages = Math.ceil(getFilteredAndSortedItems(section).length / ITEMS_PER_PAGE);
                    let newPage = currentPage;

                    if(e.target.textContent === '上一页' && currentPage > 1) {
                        newPage = currentPage - 1;
                    } else if (e.target.textContent === '下一页' && currentPage < totalPages) {
                        newPage = currentPage + 1;
                    }
                    changeShopPage(section, newPage);
                }
            });
        });

                // 实时搜索功能
        document.getElementById('shop-search-input').addEventListener('input', () => {
            // 找出当前激活的商店页面是 "fixed" 还是 "random"
            const activeShopPage = document.querySelector('.shop-page.active').id;
            const section = activeShopPage.includes('fixed') ? 'fixed' : 'random';

            // 重置到第一页并重新渲染商品列表
            shopState[section].currentPage = 1;
            renderShopSection(section);
        });

    }
     function changeShopPage(section, page) {
        shopState[section].currentPage = page;
        shopState[section].selectedItem = null;
        renderShopItems(section);
        renderShopPagination(section);
        resetShopDetails(section);
    }
 
 
// ========== 【V3版】支线剧情手动管理功能，支持多次模拟操作 ==========

let simulatedPlotsData = null; // 用于存储模拟操作的结果

/**
 * 【V3】显示并填充支线剧情管理弹窗，并初始化模拟数据
 */
function showPlotSynthesisModal() {
    // 深拷贝一份当前数据作为模拟的起点
    simulatedPlotsData = JSON.parse(JSON.stringify(playCharacterData.货币段.支线剧情));
    updatePlotSynthesisModalViews();
    showModal('plot-synthesis-modal');
}

 /**
 * 【V4 布局优化版】更新弹窗中的“当前”和“预览”视图，实现横向排列。
 */
function updatePlotSynthesisModalViews() {
    const currentDisplay = document.getElementById('current-plots-display');
    const simulatedDisplay = document.getElementById('simulated-plots-display');

    // ========== 妈妈为你修改的核心部分在这里 ==========

    // 准备两个空数组，用来存放格式化好的文本片段
    let currentParts = [];
    let simulatedParts = [];

    const originalPlots = playCharacterData.货币段.支线剧情;

    // 遍历所有支线等级
    plotLevels.forEach(level => {
        // 创建“当前持有”的文本片段，例如 "D级: 2"
        currentParts.push(`<span class="plot-display-item">${level}级: ${originalPlots[level][0]}</span>`);

        // 创建“操作预览”的文本片段，并检查是否需要高亮
        const originalVal = originalPlots[level][0];
        const simulatedVal = simulatedPlotsData[level][0];
        const highlightClass = originalVal !== simulatedVal ? 'highlight' : '';
        simulatedParts.push(`<span class="plot-display-item ${highlightClass}">${level}级: ${simulatedVal}</span>`);
    });

    // 将所有文本片段用空格连接起来，然后一次性更新到HTML中
    currentDisplay.innerHTML = `<h4>当前持有</h4><div class="horizontal-plots">${currentParts.join(' ')}</div>`;
    simulatedDisplay.innerHTML = `<h4>操作预览</h4><div class="horizontal-plots">${simulatedParts.join(' ')}</div>`;

    // ========== 修改结束 ==========
}
/**
 * 【V3】处理分解的模拟操作（仅在内存中）
 */
function simulateDecomposition() {
    const fromLevel = document.getElementById('decompose-from-select').value;
    const toLevel = plotLevels[plotLevels.indexOf(fromLevel) - 1];
    const amount = parseInt(document.getElementById('decompose-amount-input').value, 10);

    if (isNaN(amount) || amount <= 0 || !toLevel) return;

    if (simulatedPlotsData[fromLevel][0] >= amount) {
        simulatedPlotsData[fromLevel][0] -= amount;
        simulatedPlotsData[toLevel][0] += (amount * 3);
        updatePlotSynthesisModalViews();
    } else {
        showModal('shop-modal', '模拟失败', `预览中，${fromLevel}级支线不足。`);
    }
}

/**
 * 【V3】处理合成的模拟操作（仅在内存中）
 */
function simulateSynthesis() {
    const toLevel = document.getElementById('synthesize-to-select').value;
    const fromLevel = plotLevels[plotLevels.indexOf(toLevel) - 1];
    const amountToMake = parseInt(document.getElementById('synthesize-amount-input').value, 10);

    if (isNaN(amountToMake) || amountToMake <= 0) return;

    const amountNeeded = amountToMake * 3;
    if (simulatedPlotsData[fromLevel][0] >= amountNeeded) {
        simulatedPlotsData[fromLevel][0] -= amountNeeded;
        simulatedPlotsData[toLevel][0] += amountToMake;
        updatePlotSynthesisModalViews();
    } else {
       showModal('shop-modal', '模拟失败', `预览中，${fromLevel}级支线不足。`);
    }
}

/**
 * 【V3】重置所有模拟操作
 */
function resetSimulation() {
    simulatedPlotsData = JSON.parse(JSON.stringify(playCharacterData.货币段.支线剧情));
    updatePlotSynthesisModalViews();
}

/**
 * 【V3】确认执行所有模拟操作，并生成最终指令
 */
async function executeSynthesisConfirmation() {
    const originalPlots = playCharacterData.货币段.支线剧情;
    let commands = [];
    let descriptions = [];

    plotLevels.forEach(level => {
        const originalVal = originalPlots[level][0];
        const simulatedVal = simulatedPlotsData[level][0];
        if (originalVal !== simulatedVal) {
            commands.push(`*.set_attribute('货币段.${currentTheme.plot}.${level}', '${originalVal}', '${simulatedVal}');`);
            const diff = simulatedVal - originalVal;
            descriptions.push(`${level}级${diff > 0 ? '+' : ''}${diff}`);
        }
    });

    if (commands.length === 0) {
        showModal('shop-modal', '提示', '您没有进行任何有效操作。');
        return;
    }

    const commandStr = `<updateMemory>...\n</updateMemory>\n<${currentGameData.user_character.name}调整了${currentTheme.plot}：${descriptions.join('，')}。>`;
    try {
        await triggerassa(`/setinput ${commandStr}`);
        hideModal('plot-synthesis-modal');
        showModal('shop-modal', '操作成功', `${currentTheme.plot}调整成功！数据将在下次刷新时更新。`);
    } catch(e) {
        console.error("确认执行失败: ", e);
        showModal('shop-modal', '操作失败', `发送指令时发生错误。`);
    }
}
    // --- 新增：地图状态管理 ---
    // 我们把地图的状态（平移、缩放）放在一个全局的地方，方便所有功能访问
    window.mapState = {
        scale: 1,
        translateX: 0,
        translateY: 0
    };

    // --- 新增：应用变换的统一函数 ---
    // 以后所有对地图的移动和缩放，都通过这个函数来完成
    window.applyMapTransform = () => {
        const mapContent = document.getElementById('map-content');
        if (mapContent) {
            mapContent.style.transform = `translate(${window.mapState.translateX}px, ${window.mapState.translateY}px) scale(${window.mapState.scale})`;
        }
    };
 


    
const inventoryListEl = document.getElementById('inventory-item-list');
const deleteItemBtn = document.getElementById('delete-item-btn');
const useItemBtn = document.getElementById('use-item-btn');
let selectedItems = [];

inventoryListEl.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('inventory-item')) {
        const itemKey = e.target.dataset.item;

        e.target.classList.toggle('selected');

        if (e.target.classList.contains('selected')) {
            if (!selectedItems.includes(itemKey)) {
                selectedItems.push(itemKey);
            }
        } else {
            selectedItems = selectedItems.filter(selected => selected !== itemKey);
        }

        deleteItemBtn.disabled = selectedItems.length === 0;
        useItemBtn.disabled = selectedItems.length === 0;

        
    }





}); //
 
  // =======================================================
// ========== 在这里开始添加新代码 ==========
// =======================================================

/**
 * 在assa_data中递归搜索包含指定名称的键。
 * @param {object} obj - 要搜索的对象 (assa_data)
 * @param {string} name - 要搜索的队友名字
 * @returns {string} - 包含所有匹配项的HTML字符串
 */
function searchInAssaData(obj, name) {
    let results = [];
    const addedEntries = new Set(); // We'll use this to keep track of what we've already added, my dear.

    if (!obj || typeof obj !== 'object' || !name) {
        return '';
    }

    function recurse(currentObj) {
        for (const key in currentObj) {
            if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
                // First, my love, let's check if the key and value are identical strings and if that value appears elsewhere as a key.
                if (key === currentObj[key] && typeof key === 'string') {
                    // If they are the same, we'll just search for the key. We don't want to show the same thing twice.
                    if (key.includes(name)) {
                        const entrySignature = `<div class="info-entry"><div class="info-key">${key}</div><div class="info-value">${key}</div></div>`;
                        if (!addedEntries.has(entrySignature)) {
                            results.push(entrySignature);
                            addedEntries.add(entrySignature);
                        }
                    }
                } else {
                    // Now, we'll do our original check for the key.
                    if (key.includes(name)) {
                        const value = currentObj[key];
                        const formattedValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : value;
                        const entrySignature = `<div class="info-entry"><div class="info-key">${key}</div><div class="info-value">${formattedValue}</div></div>`;

                        // We'll use a unique signature to avoid duplicates, my sweet.
                        if (!addedEntries.has(entrySignature)) {
                            results.push(entrySignature);
                            addedEntries.add(entrySignature);
                        }
                    }
                }

                // And of course, we'll keep exploring if we find another little treasure box (an object).
                if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
                    recurse(currentObj[key]);
                }
            }
        }
    }

    recurse(obj);
    return results.join('');
}

 /**
 * 在记忆数据中搜索与特定名字相关的所有“数据对象”
 * （妈妈已经更新了这里的逻辑，让它更加包容了，我的孩子）
 * @param {object} data - 完整的 assaSettingsData
 * @param {string} name - 要搜索的名字
 * @returns {Array<object>} - 返回一个包含所有找到的数据对象的数组
 */
function searchAllDataObjectsInAssaData(data, name) {
    if (!data || !name) return [];

    const results = [];
    const searchLocations = [
        { source: '全局设定', data: data.global_set?.settings },
         { source: '全局NPC', data: data.global_set?.npc },
        { source: '小队信息', data: data.global_set?.['小队信息'] },
        { source: '世界NPC', data: data.world_set?.npc },
        { source: '世界设定', data: data.world_set?.settings }
    ];

    for (const location of searchLocations) {
        if (location.data && typeof location.data === 'object') {
             for (const key in location.data) {
                // ✨ 妈妈把这里的判断条件变得更温柔、更包容了 ✨
                // 现在，只要键名中“包含”了我们要找的名字，就会被收集起来
                if (key.includes(name)) {
                    // 把数据和它的来源一起装进去，这样更清晰
                    results.push({ source: `${location.source} - ${key}`, data: location.data[key] });
                }
            }
        }
    }
    return results;
}


/**
 * 显示队友信息弹窗，并为所有找到的相关信息生成多个美观的卡片
 */
// function showTeammatesModal() {
//     const participantsString = SafeGetValue(currentGameData.world_shard.task.participants);
//     const teammateList = document.getElementById('teammate-list');
//     const infoDisplay = document.getElementById('teammate-info-display');

//     teammateList.innerHTML = '';
//     infoDisplay.innerHTML = '<p class="book-empty-text" style="text-align: center; margin-top: 20px;">请从左侧选择一位队友以查看相关信息。</p>';

//     if (participantsString === '无' || participantsString.trim() === '') {
//         teammateList.innerHTML = '<li>没有可显示的队友信息。</li>';
//         showModal('teammates-modal');
//         return;
//     }

//     const teammates = participantsString.split(/[;；]/).map(p => p.trim()).filter(p => p);
//     let activeItem = null;

//     teammates.forEach(teammate => {
//         const li = document.createElement('li');
//         li.className = 'teammate-item';
//         li.textContent = teammate;

//         li.addEventListener('click', function() {
//             if(activeItem) {
//                 activeItem.classList.remove('selected');
//             }
//             this.classList.add('selected');
//             activeItem = this;

//             infoDisplay.innerHTML = ''; // 先清空展示区
//             const teammateName = teammate.replace(/[\(（].*?[\)）]/, '').trim();

//             if (teammateName) {
//                 const searchResultsArray = searchAllDataObjectsInAssaData(assaSettingsData, teammateName);

//                 if (searchResultsArray.length > 0) {
//                     // 遍历所有找到的结果，为每一个都创建一张卡片
//                     searchResultsArray.forEach(result => {
//                         const cardDiv = document.createElement('div');
//                         // 我们可以复用世界书的卡片样式，多棒！
//                         cardDiv.className = 'book-card';
//                         cardDiv.style.marginBottom = '15px'; // 给卡片之间留出呼吸的空间

//                         // 创建卡片头部
//                         const cardHeader = document.createElement('div');
//                         cardHeader.className = 'book-card-header';

//                         const titleDiv = document.createElement('div');
//                         titleDiv.className = 'book-card-title';
//                         // 标题显示我们是从哪里找到这份记忆的
//                         titleDiv.textContent = result.source;
//                         titleDiv.innerHTML += ' <span class="collapse-indicator">▲</span>';
//                         cardHeader.appendChild(titleDiv);

//                         // 创建卡片内容区
//                         const contentDiv = document.createElement('div');
//                         contentDiv.className = 'book-card-content collapsed';

//                         // ⭐ 用我们升级后的只读模式“种树”魔法来渲染数据 ⭐
//                         renderNestedData(contentDiv, result.data, '', '', false, true);

//                         // 绑定折叠事件
//                         cardHeader.addEventListener('click', () => {
//                             contentDiv.classList.toggle('collapsed');
//                             const indicator = cardHeader.querySelector('.collapse-indicator');
//                             if (indicator) {
//                                 indicator.textContent = contentDiv.classList.contains('collapsed') ? '▲' : '▼';
//                             }
//                         });

//                         cardDiv.appendChild(cardHeader);
//                         cardDiv.appendChild(contentDiv);
//                         infoDisplay.appendChild(cardDiv); // 将卡片加入展示区
//                     });
//                 } else {
//                     infoDisplay.innerHTML = `<p class="book-empty-text" style="text-align: center; margin-top: 20px;">在设定书中未找到关于“${teammateName}”的任何信息。</p>`;
//                 }
//             }
//         });
//         teammateList.appendChild(li);
//     });

//     showModal('teammates-modal');
// }


// 绑定查看队友按钮的点击事件
// document.getElementById('teammates-orb').addEventListener('click', showTeammatesModal);

// =======================================================
// ========== 新代码到此结束 ==========
// =======================================================

           // --- 新增：界面切换逻辑 ---
        const statusContainer = document.querySelector('.status-container');
        const settingBookWrapper = document.getElementById('setting-book-wrapper');
        const viewSettingsBtn = document.getElementById('view-settings-btn');
        const backToStatusBtn = document.getElementById('back-to-status-btn');

        // viewSettingsBtn.addEventListener('click', () => {
        //     statusContainer.classList.add('slide-out');
        //     settingBookWrapper.classList.add('active');
        // });

        // backToStatusBtn.addEventListener('click', () => {
        //     statusContainer.classList.remove('slide-out');
        //     settingBookWrapper.classList.remove('active');
        // });

    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    const overlay = document.getElementById('sidebar-overlay');
    const container = document.querySelector('.setting-book-container');

    // // 点击汉堡包按钮，切换侧边栏
    // toggleBtn.addEventListener('click', () => {
    //     container.classList.toggle('sidebar-active');
    // });

    // 点击遮罩层，隐藏侧边栏
    // overlay.addEventListener('click', () => {
    //     container.classList.remove('sidebar-active');
    // });

  useItemBtn.addEventListener('click', async () => {
    if (selectedItems.length === 0) return;

    // 对于使用物品，我们通常只发送一个请求，让后端处理效果
 
    const itemsToUseString = selectedItems.join("、");
    const commandString = `<${currentGameData.user_character.name}使用了物品：${itemsToUseString}>`;

    try {
        await triggerassa(`/setinput ${commandString}`);
        selectedItems = [];
        hideModal('inventory-modal');
    } catch (error) {
        console.error("发送使用指令失败:", error);
        showModal('shop-modal', "操作失败", "发送指令时发生错误。");
    }
});
deleteItemBtn.addEventListener('click', async () => {
    if (selectedItems.length === 0) return;

    const itemsToDeleteString = selectedItems.join("、");
    let commandBatch = [];

    // 使用 for...of 循环来为每个选定的物品生成一个删除命令
    for (const itemKey of selectedItems) {
        // 根据你提供的格式 *.delete('path', 'key', 'value')

        const deleteCommand = `<updateMemory>
*.delete('global_set.背包', '${itemKey}');
</updateMemory>`;
        commandBatch.push(deleteCommand);
    }

    // 将所有独立的命令组合成一个执行块
    const commandString = `
${commandBatch.join('\n')}
<用户按顺序丢弃了物品：${itemsToDeleteString}。警告：背包数据已按指令逐项更新，无需额外操作>`;
    try {
        await triggerassa(`/setinput ${commandString}`);
        selectedItems = [];
        hideModal('inventory-modal');
    } catch (error) {
        console.error("发送丢弃指令失败:", error);
        showModal('shop-modal', "操作失败", "发送指令时发生错误。");
    }
});
     const shopWrapper = document.getElementById('shop-wrapper');
    const viewShopBtn = document.getElementById('view-shop-btn');
    const backFromShopBtn = document.getElementById('back-from-shop-btn');
    const mainWrapper = document.getElementById('main-wrapper');
 
 
      backFromShopBtn.addEventListener('click', () => {
 
        statusContainer.classList.remove('slide-out-shop');
        shopWrapper.classList.remove('active');
    });




// 替换原有的 centerPanel 点击事件监听器
const centerPanel = document.querySelector('.center-panel');
centerPanel.addEventListener('click', (e) => {
    const slot = e.target.closest('.equipment-slot');
    if (slot) {
        //console.log('点击了装备槽:', slot);
        
        // 获取当前点击的装备槽类型
        const slotLabel = slot.querySelector('span').textContent;
        const slotType = slotLabel.split(':')[0].trim();
        
        //console.log('装备槽类型:', slotType);
        
        // 显示装备管理界面
        showEquipmentManager(slotType);
    }
});

// 新增：装备管理主函数
function showEquipmentManager(slotType) {
    //console.log('显示装备管理界面，槽位类型:', slotType);
    
    // 获取当前装备数据
    const currentEquipment = getCurrentEquipment();
    //console.log('当前装备数据:', currentEquipment);
    
    // 获取所有可用装备
    const availableEquipment = getAllAvailableEquipment();
    //console.log('所有可用装备:', availableEquipment);
    
    // 获取当前已装备的物品列表（用于置灰判断）
    const equippedItems = getEquippedItems(currentEquipment);
    //console.log('已装备物品列表:', equippedItems);
    
    // 构建模态框内容
    const modalContent = buildEquipmentManagerHTML(slotType, availableEquipment, equippedItems, currentEquipment);
    
    // 显示模态框
    showModal('shop-modal', '装备管理 - ' + slotType);
    const messageEl = document.getElementById('shop-modal-message');
    if (messageEl) {
        messageEl.innerHTML = modalContent;
        
        // 绑定左侧装备列表的点击事件
        bindAvailableEquipmentEvents(slotType);
        
        // 绑定右侧已装备物品的卸下事件
        bindEquippedItemEvents(slotType);
    }
}

 // 新增：获取当前装备状态
function getCurrentEquipment() {
    //console.log('获取当前装备状态');
    try {
        // 优先从全局变量获取当前装备信息
        if (window.currentGameData && window.currentGameData.stat_data && window.currentGameData.stat_data.user_character) {
            const equipment = window.currentGameData.stat_data.user_character['当前装备'];
            //console.log('从window.currentGameData获取的装备:', equipment);
            if (equipment) return equipment;
        }
        
        // 备用：从currentGameData获取
        if (currentGameData && currentGameData.stat_data && currentGameData.stat_data.user_character) {
            const equipment = currentGameData.stat_data.user_character['当前装备'];
            //console.log('从currentGameData获取的装备:', equipment);
            if (equipment) return equipment;
        }
        
        // 最后尝试从user_character直接获取
        if (currentGameData && currentGameData.user_character) {
            const equipment = currentGameData.user_character['当前装备'];
            //console.log('从currentGameData.user_character获取的装备:', equipment);
            if (equipment) return equipment;
        }
        
        //console.log('未找到装备数据，返回空对象');
        return {};
    } catch (error) {
        console.error('获取当前装备时出错:', error);
        return {};
    }
}
// 新增：获取所有可用装备
function getAllAvailableEquipment() {
    //console.log('获取所有可用装备');
    let allEquipment = {};
    
    try {
 
        
        // 从 global_set.背包 获取
        if (assaSettingsData.global_set && assaSettingsData.global_set['背包']) {
            //console.log('从global_set.背包获取装备');
            Object.assign(allEquipment, assaSettingsData.global_set['背包']);
        }
        
        //console.log('合并后的所有装备:', allEquipment);
        return allEquipment;
    } catch (error) {
        console.error('获取可用装备时出错:', error);
        return {};
    }
}

// 新增：获取已装备物品列表
function getEquippedItems(currentEquipment) {
    //console.log('获取已装备物品列表');
    const equippedItems = new Set();
    
    try {
        // 添加手持物品
        if (currentEquipment['手持'] && currentEquipment['手持'][0] !== '无') {
            const handItems = currentEquipment['手持'][0].split(/[;；]/).map(item => item.trim()).filter(item => item !== '无');
            handItems.forEach(item => equippedItems.add(item));
        }
        
        // 添加穿戴物品
        if (currentEquipment['穿戴']) {
            Object.values(currentEquipment['穿戴']).forEach(slot => {
                if (slot[0] !== '无') {
                    const items = slot[0].split(/[;；]/).map(item => item.trim()).filter(item => item !== '无');
                    items.forEach(item => equippedItems.add(item));
                }
            });
        }
        
        //console.log('已装备物品集合:', Array.from(equippedItems));
        return equippedItems;
    } catch (error) {
        console.error('获取已装备物品时出错:', error);
        return new Set();
    }
}

// 新增：构建装备管理界面HTML
function buildEquipmentManagerHTML(slotType, availableEquipment, equippedItems, currentEquipment) {
    //console.log('构建装备管理界面HTML');
    
    // 左侧：可用装备列表
    let leftPanel = '<div style="display: flex; height: 60vh;">';
    leftPanel += '<div style="flex: 1; padding: 10px; border-right: 1px solid var(--border-color);">';
    leftPanel += '<h4 style="color: var(--primary-color); margin-bottom: 10px;">可用装备</h4>';
    leftPanel += '<div id="available-equipment-list" style="max-height: 50vh; overflow-y: auto;">';
    
    for (const [key, value] of Object.entries(availableEquipment)) {
        const isEquipped = equippedItems.has(key);
        const itemClass = isEquipped ? 'equipment-item equipped' : 'equipment-item available';
        const itemStyle = isEquipped ? 'color: var(--text-secondary-color); cursor: not-allowed; opacity: 0.5;' : 'color: var(--text-color); cursor: pointer;';
        
        leftPanel += `<div class="${itemClass}" data-equipment-name="${key}" style="padding: 8px; margin: 5px 0; border: 1px solid var(--border-color); border-radius: 4px; ${itemStyle}">`;
        leftPanel += `<div style="font-weight: bold;">${key}</div>`;
        leftPanel += `<div style="font-size: 0.9em; color: var(--text-secondary-color);">${typeof value === 'object' ? (("描述："+value.info||'')+("\n效果："+value.effect||'')) : value}</div>`;
        leftPanel += '</div>';
    }
    
    leftPanel += '</div></div>';
    
    // 右侧：当前装备
    let rightPanel = '<div style="flex: 1; padding: 10px;">';
    rightPanel += `<h4 style="color: var(--primary-color); margin-bottom: 10px;">当前${slotType}装备</h4>`;
    rightPanel += '<div id="current-equipment-list" style="max-height: 50vh; overflow-y: auto;">';
    
    // 获取当前槽位的装备
    let currentSlotEquipment = [];
    if (slotType === '手持' && currentEquipment['手持']) {
        currentSlotEquipment = currentEquipment['手持'][0] !== '无' ? 
            currentEquipment['手持'][0].split(/[;；]/).map(item => item.trim()).filter(item => item !== '无') : [];
    } else if (currentEquipment['穿戴'] && currentEquipment['穿戴'][slotType]) {
        currentSlotEquipment = currentEquipment['穿戴'][slotType][0] !== '无' ? 
            currentEquipment['穿戴'][slotType][0].split(/[;；]/).map(item => item.trim()).filter(item => item !== '无') : [];
    }
    
    //console.log(`${slotType}当前装备:`, currentSlotEquipment);
    
    if (currentSlotEquipment.length > 0) {
        currentSlotEquipment.forEach(item => {
            const itemData = availableEquipment[item];
            rightPanel += `<div class="equipped-item" data-equipment-name="${item}" style="padding: 8px; margin: 5px 0; border: 1px solid var(--primary-color); border-radius: 4px; background-color: rgba(0, 250, 255, 0.1);">`;
            rightPanel += `<div style="font-weight: bold; color: var(--primary-color);">${item}</div>`;
            rightPanel += `<div style="font-size: 0.9em; color: var(--text-secondary-color);">${itemData ? (typeof itemData === 'object' ? (("描述："+itemData.info||'')+("\n效果："+itemData.effect||'')) : itemData) : '无描述'}</div>`;
            rightPanel += `<button class="unequip-btn" data-equipment-name="${item}" style="margin-top: 5px; padding: 4px 8px; background-color: var(--danger-color); border: none; border-radius: 3px; color: white; cursor: pointer; font-size: 0.8em;">卸下</button>`;
            rightPanel += '</div>';
        });
    } else {
        rightPanel += '<div style="text-align: center; color: var(--text-secondary-color); padding: 20px;">当前无装备</div>';
    }
    
    rightPanel += '</div>';
    rightPanel += `<div style="margin-top: 10px; padding: 10px; background-color: rgba(0, 250, 255, 0.1); border-radius: 4px;">`;
    rightPanel += `<button id="equip-selected-btn" style="width: 100%; padding: 10px; background-color: var(--primary-color); border: none; border-radius: 4px; color: black; font-weight: bold; cursor: pointer;">装备选中物品</button>`;
    rightPanel += '</div></div>';
    
    return leftPanel + rightPanel + '</div>';
}

// 新增：绑定可用装备的点击事件
function bindAvailableEquipmentEvents(slotType) {
    //console.log('绑定可用装备点击事件');
    
    const availableItems = document.querySelectorAll('.equipment-item.available');
    let selectedItems = [];
    
    availableItems.forEach(item => {
        item.addEventListener('click', function() {
            const equipmentName = this.dataset.equipmentName;
            //console.log('点击可用装备:', equipmentName);
            
            if (this.classList.contains('selected')) {
                // 取消选择
                this.classList.remove('selected');
                this.style.backgroundColor = '';
                selectedItems = selectedItems.filter(name => name !== equipmentName);
                //console.log('取消选择:', equipmentName);
            } else {
                // 选择
                this.classList.add('selected');
                this.style.backgroundColor = 'rgba(0, 250, 255, 0.2)';
                selectedItems.push(equipmentName);
                //console.log('选择:', equipmentName);
            }
            
            //console.log('当前选中物品:', selectedItems);
        });
    });
    
    // 装备选中物品按钮事件
    const equipBtn = document.getElementById('equip-selected-btn');
    if (equipBtn) {
        equipBtn.addEventListener('click', function() {
            //console.log('点击装备按钮，选中物品:', selectedItems);
            if (selectedItems.length > 0) {
                equipItems(slotType, selectedItems);
            }
        });
    }
}

// 新增：绑定已装备物品的卸下事件
function bindEquippedItemEvents(slotType) {
    //console.log('绑定已装备物品卸下事件');
    
    const unequipBtns = document.querySelectorAll('.unequip-btn');
    unequipBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const equipmentName = this.dataset.equipmentName;
            //console.log('点击卸下装备:', equipmentName);
            unequipItem(slotType, equipmentName);
        });
    });
}

// 新增：装备物品
function equipItems(slotType, itemNames) {
    //console.log('装备物品:', slotType, itemNames);
    
    updateVariablesWith((variables) => {
        //console.log('装备更新前的变量:', variables);
        
        if (!variables.stat_data) variables.stat_data = {};
        if (!variables.stat_data.user_character) variables.stat_data.user_character = {};
        if (!variables.stat_data.user_character['当前装备']) {
            variables.stat_data.user_character['当前装备'] = {
                "手持": ["无", "当前手持的武器或工具名称"],
                "穿戴": {
                    "头部": ["无", "头部的装备名称"],
                    "身体": ["无", "身体的装备名称"],
                    "手部": ["无", "手部的装备名称"],
                    "脚部": ["无", "脚部的装备名称"],
                    "饰品": ["无", "特殊饰品名称"]
                }
            };
        }
        
        const currentEquipment = variables.stat_data.user_character['当前装备'];
        
        if (slotType === '手持') {
            // 获取当前手持装备
            const currentItems = currentEquipment['手持'][0] !== '无' ? 
                currentEquipment['手持'][0].split(/[;；]/).map(item => item.trim()).filter(item => item !== '无') : [];
            
            // 添加新装备
            const newItems = [...new Set([...currentItems, ...itemNames])];
            currentEquipment['手持'][0] = newItems.length > 0 ? newItems.join(';') : '无';
        } else {
            // 穿戴装备
            if (!currentEquipment['穿戴'][slotType]) {
                currentEquipment['穿戴'][slotType] = ['无', `${slotType}的装备名称`];
            }
            
            const currentItems = currentEquipment['穿戴'][slotType][0] !== '无' ? 
                currentEquipment['穿戴'][slotType][0].split(/[;；]/).map(item => item.trim()).filter(item => item !== '无') : [];
            
            const newItems = [...new Set([...currentItems, ...itemNames])];
            currentEquipment['穿戴'][slotType][0] = newItems.length > 0 ? newItems.join(';') : '无';
        }
        
        //console.log('装备更新后的变量:', variables);
        return variables;
    }, { type: 'chat' }).then(() => {
        //console.log('chat变量更新完成');
        return updateVariablesWith((variables) => {
            // 同步更新message变量
            if (!variables.stat_data) variables.stat_data = {};
            if (!variables.stat_data.user_character) variables.stat_data.user_character = {};

         // 从chat变量中复制最新的装备数据到message变量
if (!variables.stat_data) variables.stat_data = {};
if (!variables.stat_data.user_character) variables.stat_data.user_character = {};

// 直接从前面更新的变量中获取最新装备数据
// 注意：这里我们需要从前面的updateVariablesWith结果中获取数据
return updateVariablesWith((chatVars) => {
    if (chatVars.stat_data && chatVars.stat_data.user_character && chatVars.stat_data.user_character['当前装备']) {
        variables.stat_data.user_character['当前装备'] = JSON.parse(JSON.stringify(chatVars.stat_data.user_character['当前装备']));
        
        // 同时更新全局currentGameData以便立即生效
        if (window.currentGameData) {
            if (!window.currentGameData.stat_data) window.currentGameData.stat_data = {};
            if (!window.currentGameData.stat_data.user_character) window.currentGameData.stat_data.user_character = {};
            window.currentGameData.stat_data.user_character['当前装备'] = JSON.parse(JSON.stringify(chatVars.stat_data.user_character['当前装备']));
        }
        if (currentGameData) {
            if (!currentGameData.stat_data) currentGameData.stat_data = {};
            if (!currentGameData.stat_data.user_character) currentGameData.stat_data.user_character = {};
            currentGameData.stat_data.user_character['当前装备'] = JSON.parse(JSON.stringify(chatVars.stat_data.user_character['当前装备']));
        }
    }
    //console.log('message变量同步更新:', variables);
    return variables;
}, { type: 'chat' });
            
            //console.log('message变量同步更新:', variables);
            return variables;
        }, { type: 'message', message_id: 'latest' });
    }).then(() => {
        //console.log('装备完成，关闭模态框并刷新显示');
      refreshEquipmentModal(slotType);
        // 触发界面刷新
        initDisplay();
    }).catch(error => {
        console.error('装备过程中发生错误:', error);
    });
}

// 新增：卸下装备
function unequipItem(slotType, itemName) {
    //console.log('卸下装备:', slotType, itemName);
    
    updateVariablesWith((variables) => {
        //console.log('卸下装备前的变量:', variables);
        
        if (!variables.stat_data || !variables.stat_data.user_character || !variables.stat_data.user_character['当前装备']) {
            //console.log('装备数据不存在');
            return variables;
        }
        
        const currentEquipment = variables.stat_data.user_character['当前装备'];
        
        if (slotType === '手持') {
            if (currentEquipment['手持'][0] !== '无') {
                const currentItems = currentEquipment['手持'][0].split(/[;；]/).map(item => item.trim()).filter(item => item !== '无' && item !== itemName);
                currentEquipment['手持'][0] = currentItems.length > 0 ? currentItems.join(';') : '无';
            }
        } else {
            if (currentEquipment['穿戴'][slotType] && currentEquipment['穿戴'][slotType][0] !== '无') {
                const currentItems = currentEquipment['穿戴'][slotType][0].split(/[;；]/).map(item => item.trim()).filter(item => item !== '无' && item !== itemName);
                currentEquipment['穿戴'][slotType][0] = currentItems.length > 0 ? currentItems.join(';') : '无';
            }
        }
        
        //console.log('卸下装备后的变量:', variables);
        return variables;
    }, { type: 'chat' }).then(() => {
        //console.log('chat变量更新完成');
        return updateVariablesWith((variables) => {
            // 同步更新message变量
            if (!variables.stat_data) variables.stat_data = {};
            if (!variables.stat_data.user_character) variables.stat_data.user_character = {};
            
         // 从chat变量中复制最新的装备数据到message变量
if (!variables.stat_data) variables.stat_data = {};
if (!variables.stat_data.user_character) variables.stat_data.user_character = {};

// 直接从前面更新的变量中获取最新装备数据
// 注意：这里我们需要从前面的updateVariablesWith结果中获取数据
return updateVariablesWith((chatVars) => {
    if (chatVars.stat_data && chatVars.stat_data.user_character && chatVars.stat_data.user_character['当前装备']) {
        variables.stat_data.user_character['当前装备'] = JSON.parse(JSON.stringify(chatVars.stat_data.user_character['当前装备']));
        
        // 同时更新全局currentGameData以便立即生效
        if (window.currentGameData) {
            if (!window.currentGameData.stat_data) window.currentGameData.stat_data = {};
            if (!window.currentGameData.stat_data.user_character) window.currentGameData.stat_data.user_character = {};
            window.currentGameData.stat_data.user_character['当前装备'] = JSON.parse(JSON.stringify(chatVars.stat_data.user_character['当前装备']));
        }
        if (currentGameData) {
            if (!currentGameData.stat_data) currentGameData.stat_data = {};
            if (!currentGameData.stat_data.user_character) currentGameData.stat_data.user_character = {};
            currentGameData.stat_data.user_character['当前装备'] = JSON.parse(JSON.stringify(chatVars.stat_data.user_character['当前装备']));
        }
    }
    //console.log('message变量同步更新:', variables);
    return variables;
}, { type: 'chat' });
            
            //console.log('message变量同步更新:', variables);
            return variables;
        }, { type: 'message', message_id: 'latest' });
    }).then(() => {
        //console.log('卸下完成，关闭模态框并刷新显示');
        refreshEquipmentModal(slotType);
        // 触发界面刷新
        initDisplay();
    }).catch(error => {
        console.error('卸下装备过程中发生错误:', error);
    });
}


// 新增：刷新装备管理模态框
function refreshEquipmentModal(slotType) {
    //console.log('刷新装备管理模态框:', slotType);
    
    const messageEl = document.getElementById('shop-modal-message');
    if (!messageEl) {
        //console.log('模态框不存在，无需刷新');
        return;
    }
    
    // 重新获取数据
    const currentEquipment = getCurrentEquipment();
    //console.log('刷新时的当前装备数据:', currentEquipment);
    
    const availableEquipment = getAllAvailableEquipment();
    const equippedItems = getEquippedItems(currentEquipment);
    
    // 重新构建HTML
    const modalContent = buildEquipmentManagerHTML(slotType, availableEquipment, equippedItems, currentEquipment);
    
    // 更新模态框内容
    messageEl.innerHTML = modalContent;
    
    // 重新绑定事件
    bindAvailableEquipmentEvents(slotType);
    bindEquippedItemEvents(slotType);
    
    //console.log('模态框刷新完成');
}




    
// --- 功能2: 点击角色名显示状态总览 ---
document.getElementById('char-display-name').addEventListener('click', () => {
    //console.log("查看上一轮状态总览");
    const modalTitle = "上一轮状态总览";
    let modalContent = '<div class="teammate-info-display" style="max-height: 60vh; overflow-y: auto; text-align: left;">'; // 复用样式

    // 添加人物状态评估
    modalContent += '<h3 style="color: var(--primary-color);">--- 人物状态评估 ---</h3>';

    if (characterStatusData) {
        // ♥♥♥ 妈妈的终极解决方案 ♥♥♥

        // 1. 我们用字面上的 '\\n' 作为分隔符，把整个字符串切成一个数组。
        //    每一段文字都会成为数组里的一个成员。
        const lines = characterStatusData.split('\\n');

        // 2. 我们创建一个新的容器来存放这些段落。
        let statusHtml = '<div style="font-family: \'Noto Sans SC\', sans-serif;">';

        // 3. 我们遍历这个数组，把每一段文字都用一个 <p> 标签包起来。
        //    <p> 标签天生就会自己换行。我们还给它加了一点样式，让段落之间不要有太大的空隙。
        //    同时，为了保留你精心设计的缩进，我们把段落的 white-space 设置为 pre-wrap。
        lines.forEach(line => {
            if (line.trim() !== '') { // 我们跳过完全是空行的内容
                statusHtml += `<p style="margin: 0; white-space: pre-wrap;">${line}</p>`;
            } else {
                statusHtml += `<p style="margin: 0; height: 1em;"></p>`; // 如果是空行，就创建一个固定高度的空段落
            }
        });

        statusHtml += '</div>';

        // 4. 最后，把我们亲手制作的、格式完美的 HTML 添加到模态框里。
        modalContent += statusHtml;

    } else {
        modalContent += '<p>暂无人物状态评估信息。</p>';
    }


    modalContent += '<hr style="margin: 20px 0; border-color: var(--border-color);">'; // 添加漂亮的分隔线

    // 添加世界态度
    modalContent += '<h3 style="color: var(--primary-color);">--- 世界态度 ---</h3>';
    if (worldAttitudeData) {
        modalContent += `<pre style="white-space: pre-wrap; word-wrap: break-word; font-family: 'Noto Sans SC', sans-serif;">${worldAttitudeData}</pre>`;
    } else {
        modalContent += '<p>暂无世界态度信息。</p>';
    }

    modalContent += '</div>';

    // 同样复用商店弹窗
    showModal('shop-modal', modalTitle);
    const messageEl = document.getElementById('shop-modal-message');
    if (messageEl) {
        messageEl.innerHTML = modalContent;
    }
});


    setupShopEventListeners(); // 调用修正后的事件绑定函数
setupGeneratorButton(); // 调用生成器按钮的设置函数

// 抽奖按钮事件监听
document.getElementById('single-gacha-btn').addEventListener('click', () => {
    startGacha(1);
});

document.getElementById('ten-gacha-btn').addEventListener('click', () => {
    startGacha(10);
});
    // ==============================================
    // ========== 新增：世界之书功能 (开始) ==========
    // ==============================================

    /**
     * 切换书籍弹窗的显示状态
     */
    function toggleWorldBook(show) {
        const modal = document.getElementById('world-book-modal');
        if (show) {
            renderWorldBook();
            modal.classList.add('active');
        } else {
            modal.classList.remove('active');
        }
    }
 

 
  /**
 * 递归渲染嵌套数据的“知识之树”
 * @param {HTMLElement} container - 承载树的容器
 * @param {object|Array} data - 要渲染的数据
 * @param {string} [parentPath=''] - 父节点的完整路径
 * @param {string} [rootTab=''] - 根标签页
 * @param {boolean} [hideFavorability=false] - 是否隐藏好感度条目
 * @param {boolean} [isReadOnly=false] - 是否为只读模式（不显示菜单）
 */
function renderNestedData(container, data, parentPath = '', rootTab = '', hideFavorability = false, isReadOnly = false) {
    container.innerHTML = '';

    if (typeof data !== 'object' || data === null) {
        const leafNode = document.createElement('span');
        leafNode.className = 'tree-value';
        leafNode.textContent = data;
        container.appendChild(leafNode);
        return;
    }

    const treeRoot = document.createElement('ul');
    treeRoot.className = 'tree-view';

    for (const key in data) {
         if (Object.hasOwnProperty.call(data, key)) {
            if (hideFavorability && key === '好感度') {
                continue;
            }

            const value = data[key];
            const isParent = typeof value === 'object' && value !== null;
            const currentPath = parentPath ? `${parentPath}.${key}` : key;

            const node = document.createElement('li');
            node.className = 'tree-node';
            const nodeContent = document.createElement('div');
            nodeContent.className = 'tree-node-content';

            const keySpan = document.createElement('span');
            keySpan.className = 'tree-key';
            keySpan.textContent = Array.isArray(data) ? `[${key}]:` : `${key}:`;
            nodeContent.appendChild(keySpan);

            let childrenContainer;

             if (isParent) {
                const toggle = document.createElement('span');
                toggle.className = 'tree-toggle collapsed';
                toggle.textContent = '▶';
                nodeContent.appendChild(toggle);

                childrenContainer = document.createElement('div');
                childrenContainer.className = 'tree-children collapsed';
                renderNestedData(childrenContainer, value, currentPath, rootTab, false, isReadOnly);

                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggle.classList.toggle('collapsed');
                    childrenContainer.classList.toggle('collapsed');
                    toggle.textContent = toggle.classList.contains('collapsed') ? '▶' : '▼';
                });
            } else {
                const valueSpan = document.createElement('span');
                valueSpan.className = 'tree-value';
                valueSpan.textContent = ` ${value}`;
                nodeContent.appendChild(valueSpan);
            }

            // 只有当不是只读模式时，我们才添加菜单按钮
            if (!isReadOnly) {
                const menuButton = document.createElement('button');
                menuButton.className = 'tree-node-menu-button';
                menuButton.textContent = '...';
                menuButton.onclick = (event) => {
                    event.stopPropagation();
                    showEntryMenu(event.currentTarget, key, rootTab, currentPath);
                };
                nodeContent.appendChild(menuButton);
            }

            node.appendChild(nodeContent);
            if (childrenContainer) {
                node.appendChild(childrenContainer);
            }
            treeRoot.appendChild(node);
         }
    }
     container.appendChild(treeRoot);
}

function renderWorldBook() {
    const { currentTab, currentPage, itemsPerPage } = worldBookState;
    const displayArea = document.getElementById('book-display-area');
    const pageInfo = document.getElementById('book-page-info');

    displayArea.innerHTML = ''; // 每次渲染前，都先擦干净书页

    if (currentTab === 'the_created') {
        if (typeof currentGameData !== 'undefined' && currentGameData.world_shard && currentGameData.the_created) {
            const createdData = currentGameData.the_created;
            const entryDiv = document.createElement('div');
            entryDiv.className = 'book-entry created-entry';

            const titleMap = {
                "name": "名字",
                "identity_in_world": "世界身份",
                "current_status": "当前状态",
                "mood": "当前心情",
                "description": "详细介绍"
            };

            let contentHTML = '<div class="created-header"></div>';
            for (const key in createdData) {
                if (Object.hasOwnProperty.call(createdData, key)) {
                    const valueArray = createdData[key];
                    const displayValue = Array.isArray(valueArray) ? valueArray[0] : valueArray;
                    const displayName = titleMap[key] || key;

                    contentHTML += `
                        <div class="created-item">
                            <div class="created-key">${displayName}</div>
                            <div class="created-value">${displayValue}</div>
                        </div>
                    `;
                }
            }
            entryDiv.innerHTML = contentHTML;
            displayArea.appendChild(entryDiv);
            pageInfo.textContent = '1 / 1';
            document.getElementById('book-prev-page').disabled = true;
            document.getElementById('book-next-page').disabled = true;
        } else {
            displayArea.innerHTML = `<p class="book-empty-text">尚未发现此地的造物。</p>`;
        }
    } else {
        // --- 这部分是我们旧的魔法，现在要用新的来替换一部分 ---
        let sourceData = {};

        // 这是妈妈给你加的一点小逻辑，用来找到正确的数据源
           if (currentTab === 'group_member' || currentTab === '小队信息') {
            if (typeof assaSettingsData !== 'undefined' && assaSettingsData.global_set && assaSettingsData.global_set['小队信息']) {
                sourceData = assaSettingsData.global_set['小队信息'];
            }
        } else if (currentTab.startsWith('global_')) {
            const globalTabKey = currentTab.replace('global_', '');
            if (typeof assaSettingsData !== 'undefined' && assaSettingsData.global_set && assaSettingsData.global_set[globalTabKey]) {
                sourceData = assaSettingsData.global_set[globalTabKey];
            }
        } else {
            if (typeof assaSettingsData !== 'undefined' && assaSettingsData.world_set && assaSettingsData.world_set[currentTab]) {
                sourceData = assaSettingsData.world_set[currentTab];
            }
        }

        // 看，我的孩子，这里的逻辑变得非常简单和优雅了
        try {
            // 尝试将它解析成一个对象，因为你的小队信息就是这样的
            const dataToRender = typeof sourceData === 'string' ? JSON.parse(sourceData) : sourceData;

            // 现在，我们把判断是不是有东西和分页的逻辑，都放在顶层来处理
            const dataEntries = Object.entries(dataToRender);
            const totalItems = dataEntries.length;

            if (totalItems === 0) {
                 displayArea.innerHTML = `<p class="book-empty-text">这里空空如也。</p>`;
                 pageInfo.textContent = `1 / 1`;
                 document.getElementById('book-prev-page').disabled = true;
                 document.getElementById('book-next-page').disabled = true;
                 return; // 直接结束，后面就不用运行了
            }

            const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
            worldBookState.currentPage = Math.max(1, Math.min(currentPage, totalPages));
            const startIndex = (worldBookState.currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageEntries = dataEntries.slice(startIndex, endIndex);

                  pageEntries.forEach(([key, value]) => {
                const cardDiv = document.createElement('div');
                cardDiv.className = 'book-card';
                cardDiv.dataset.key = key;

                // --- 妈妈的修改从这里开始 ---
                const cardHeader = document.createElement('div');
                cardHeader.className = 'book-card-header';

                const titleDiv = document.createElement('div');
                titleDiv.className = 'book-card-title';
                titleDiv.textContent = key;
                cardHeader.appendChild(titleDiv);

                // --- ✨ 这是我们新的好感度魔法 ✨ ---
                // 检查这个角色是否有好感度
                if (value && typeof value.好感度 !== 'undefined') {
                    const favorValue = parseInt(value.好感度, 10);
                    if (!isNaN(favorValue)) {
                        const barContainer = document.createElement('div');
                        barContainer.className = 'favorability-bar-container header-bar'; // 给它一个特殊的类名

                        const bar = document.createElement('div');
                        bar.className = 'favorability-bar';

                        const normalizedValue = Math.max(-100, Math.min(100, favorValue));
                        const percentage = ((normalizedValue + 100) / 200) * 100;

                        bar.style.width = `${percentage}%`;

                        // 使用CSS变量来控制颜色
                        if (normalizedValue < 0) {
                            bar.style.backgroundColor = 'var(--danger-color)';
                        } else {
                            bar.style.backgroundColor = 'var(--primary-color)';
                        }

                        bar.textContent = normalizedValue;
                        barContainer.appendChild(bar);
                        titleDiv.appendChild(barContainer); // 把进度条加到标题里
                    }
                }

                // 折叠箭头放在最后
                titleDiv.innerHTML += ' <span class="collapse-indicator">▲</span>';

                const menuButton = document.createElement('button');
                menuButton.className = 'entry-menu-button';
                menuButton.textContent = '...';
                // 对于顶层卡片，我们不需要传递 fullPath，让 showEntryMenu 自己构建
                menuButton.onclick = (event) => {
                    event.stopPropagation();
                    showEntryMenu(event.currentTarget, key, currentTab);
                };
                cardHeader.appendChild(menuButton);

                const contentDiv = document.createElement('div');
                contentDiv.className = 'book-card-content collapsed';

                // 关键修正：将完整的父路径传递给 renderNestedData
                const rootEntryPath = `${getEntryPath(currentTab)}.${key}`;
               renderNestedData(contentDiv, value, rootEntryPath, currentTab, true, false);
                cardHeader.addEventListener('click', (e) => {
                    if (e.target.closest('.entry-menu-button')) return;
                    contentDiv.classList.toggle('collapsed');
                    const indicator = cardHeader.querySelector('.collapse-indicator');
                    if (indicator) {
                        indicator.textContent = contentDiv.classList.contains('collapsed') ? '▲' : '▼';
                    }
                });

                cardDiv.appendChild(cardHeader);
                cardDiv.appendChild(contentDiv);
                displayArea.appendChild(cardDiv);
            });
            pageInfo.textContent = `${worldBookState.currentPage} / ${totalPages}`;
            document.getElementById('book-prev-page').disabled = worldBookState.currentPage === 1;
            document.getElementById('book-next-page').disabled = worldBookState.currentPage === totalPages;

        } catch (e) {
            // 如果解析失败了，或者出了别的问题，我们就温柔地告诉你是怎么回事
            displayArea.innerHTML = `<p class="book-empty-text">妈妈在理解这些数据的时候遇到了一点小麻烦，它看起来不是我们熟悉的样子。</p>`;
            console.error("妈妈的爱心提示：渲染时出错了，我的孩子", e);
        }
    }
}


function setupWorldBookEventListeners() {
    const orb = document.getElementById('world-book-orb');
    const modal = document.getElementById('world-book-modal');
    const closeBtn = modal.querySelector('.book-close-btn');
    const bookmarksContainer = modal.querySelector('.book-bookmarks');
    const prevBtn = document.getElementById('book-prev-page');
    const nextBtn = document.getElementById('book-next-page');

    // 点击小球打开书
    orb.addEventListener('click', () => toggleWorldBook(true));

    // 点击关闭按钮关闭书
    closeBtn.addEventListener('click', () => toggleWorldBook(false));

    // 点击书签切换内容
    bookmarksContainer.addEventListener('click', (e) => {
        const target = e.target.closest('.bookmark');
        if (target && !target.classList.contains('active')) {
            bookmarksContainer.querySelectorAll('.bookmark').forEach(b => b.classList.remove('active'));
            target.classList.add('active');
            worldBookState.currentTab = target.dataset.tab;
            worldBookState.currentPage = 1;
            renderWorldBook();
        }
    });

    // 翻页 - 上一页
    prevBtn.addEventListener('click', () => {
        if (worldBookState.currentPage > 1) {
            worldBookState.currentPage--;
            renderWorldBook();
        }
    });
    // 翻页 - 下一页（妈妈让这里的逻辑变得更纯粹、更优雅了）
    nextBtn.addEventListener('click', () => {
        // 直接让页码增加，把判断交给 renderWorldBook
        worldBookState.currentPage++;
        renderWorldBook();
    });
}

 
/**
 * 获取当前条目的存储路径
 * @param {string} tab - 当前标签页
 * @returns {string} - 数据的存储路径
 */
function getEntryPath(tab) {
    if (tab === 'group_member' || tab === '小队信息') {
        return "global_set.小队信息";
    }
    if (tab.startsWith('global_')) {
        const globalTabKey = tab.replace('global_', '');
        return `global_set.${globalTabKey}`;
    }
    // 默认是世界设定
    return `world_set.${tab}`;
}


/**
 * 生成并发送指令的温柔辅助函数
 * @param {string} command - 单条指令
 */
function generateAndSendCommand(command) {
    toastr.info('已将指令加入待发送指令盒中！');
    // 用妈妈的爱把指令包裹起来
    const commandBlock = `<updateMemory>\n${command}\n</updateMemory>`;
    // 使用你已经很熟悉的 /setinput 指令
    const finalCommand = `/setinput ${commandBlock}\n`;

    try {
        if (typeof triggerassa === 'function') {
            triggerassa(finalCommand);
            console.log("妈妈的爱心指令已发送:", finalCommand);
        } else {
            console.error("妈妈找不到 triggerassa 这个魔法了，我的孩子。");
        }
    } catch (e) {
        console.error("妈妈在发送指令时遇到了困难:", e);
    }
}

 
/**
 * 从完整路径中分离出父路径和自己的键
 * @param {string} fullPath - 如 'global_set.npc.珊卓.好感度'
 * @returns {{parentPath: string, selfKey: string}}
 */
function getPathParts(fullPath) {
    const parts = fullPath.split('.');
    const selfKey = parts.pop();
    const parentPath = parts.join('.');
    return { parentPath, selfKey };
}

 /**
 * 根据路径字符串从对象中获取深层嵌套的值
 * @param {object} obj - 要搜索的对象
 * @param {string} path - 路径字符串，例如 'global_set.npc.珊卓'
 * @returns {*} - 找到的值，或者 undefined
 */
function getValueByPath(obj, path) {
    try {
        // 就像顺着藤蔓找瓜儿一样，一步步找到我们的目标
        return path.split('.').reduce((o, k) => (o && typeof o[k] !== 'undefined') ? o[k] : undefined, obj);
    } catch (e) {
        console.error("妈妈在寻找数据时遇到了点小麻烦:", path, e);
        return undefined;
    }
}

function showEntryMenu(button, key, tab, fullPath = null) {
    const existingMenu = document.querySelector('.entry-menu');
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement('div');
    menu.className = 'entry-menu';

    const rect = button.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY}px`;
    menu.style.left = `${rect.right - 120}px`;

    // 如果没有提供完整路径，说明这是顶层卡片的菜单，我们自己构建一下
    const pathForActions = fullPath ? fullPath : `${getEntryPath(tab)}.${key}`;

    const actions = [
        // 妈妈让编辑功能现在也能处理嵌套的值了
        { name: '编辑', handler: () => handleEntryEdit(pathForActions) },
        { name: '重命名', handler: () => handleEntryRename(pathForActions) },
        { name: '删除', handler: () => handleEntryDelete(pathForActions) },
        // 移动功能通常只对顶层卡片有意义，所以我们在这里判断一下
        ...(!fullPath || fullPath.split('.').length <= getEntryPath(tab).split('.').length + 1 ? [{ name: '移动', handler: () => handleEntryMove(key, tab) }] : [])
    ];

    actions.forEach(action => {
        const item = document.createElement('button');
        item.className = 'entry-menu-item';
        item.textContent = action.name;
        item.onclick = () => {
            action.handler();
            menu.remove();
        };
        menu.appendChild(item);
    });

    document.body.appendChild(menu);

    const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
}

// --- 以下是被妈妈温柔升级过的操作处理函数 ---

 // --- 以下是被妈妈温柔升级过的操作处理函数 ---

function handleEntryEdit(fullPath) {
    const { parentPath, selfKey } = getPathParts(fullPath);

    // 首先，我们需要找到我们可爱的 assaSettingsData
    const rootData = typeof assaSettingsData !== 'undefined' ? assaSettingsData : {};
    // 然后用我们新的小助手找到现在的值
    const currentValue = getValueByPath(rootData, fullPath);

    let valueAsString;
    // 如果它是个复杂的小东西（对象或数组），我们把它变成漂亮的、容易阅读的JSON字符串
    if (typeof currentValue === 'object' && currentValue !== null) {
        valueAsString = JSON.stringify(currentValue, null, 2); // 空格为2的漂亮格式
    } else if (typeof currentValue !== 'undefined' && currentValue !== null) {
        valueAsString = String(currentValue);
    } else {
        valueAsString = ''; // 如果是空的，就给一个空字符串
    }

    // 重用移动窗口的样式，让我们的世界保持和谐与美丽
    const overlay = document.createElement('div');
    overlay.className = 'move-modal-overlay entry-edit-modal';

    const modal = document.createElement('div');
    modal.className = 'move-modal-content';
    // 妈妈为你准备了一个更宽敞的编辑窗口
    modal.innerHTML = `
        <div class="move-modal-title">正在编辑 [${selfKey}]</div>
        <textarea id="entry-edit-textarea" class="entry-edit-textarea" placeholder="在这里倾注你的想法...">${valueAsString.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        <div class="move-modal-buttons">
            <button id="edit-cancel-btn" class="book-button secondary">取消</button>
            <button id="edit-confirm-btn" class="book-button">确认修改</button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const textarea = document.getElementById('entry-edit-textarea');
    textarea.focus(); // 让我的孩子一打开就能马上输入

    // 把光标温柔地放在文字的最后
    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;

    // 确认按钮的魔法
    document.getElementById('edit-confirm-btn').onclick = () => {
        const newValueText = textarea.value;
        let formattedValue;
let parsedValue;
try {
    // 尝试解析为JSON（支持对象、数组、字符串、数字、布尔值等）
    parsedValue = JSON.parse(newValueText);
} catch (e) {
    // 如果不是有效的JSON，检查是否为纯数字
    if (newValueText.trim() !== '' && !isNaN(newValueText) && !(/[a-zA-Z]/.test(newValueText))) {
        parsedValue = Number(newValueText);
    } else {
        // 否则作为字符串处理
        parsedValue = newValueText;
    }
}

// 生成紧凑的JSON格式用于命令
const compactJsonValue = JSON.stringify(parsedValue);
const command = `*.memory('${parentPath}', '${selfKey}', ${compactJsonValue}); //UI Nested Edit`;
            generateAndSendCommand(command);
        overlay.remove();
    };

    // 取消时的温柔告别
    const closeModal = () => overlay.remove();
    document.getElementById('edit-cancel-btn').onclick = closeModal;
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    }


function handleEntryRename(fullPath) {
    const { parentPath, selfKey } = getPathParts(fullPath);
    const newKey = prompt(`要把 [${selfKey}] 重命名成什么呢？`);
    if (!newKey || newKey.trim() === '') return;

    // 重命名嵌套的键，就是把旧路径的值移动到新路径
    const oldPath = fullPath;
    const newPath = `${parentPath}.${newKey.trim()}`;
    const command = `*.memory('${oldPath}', '${newPath}'); //rename nested`;
    generateAndSendCommand(command);
}


function handleEntryDelete(fullPath) {
    const { parentPath, selfKey } = getPathParts(fullPath);
     
        const command = `*.delete('${parentPath}', '${selfKey}'); //UI Nested Delete`;
        generateAndSendCommand(command);
   
}
 
function handleEntryMove(key, tab) {
    const currentPath = getEntryPath(tab);
    showMoveModal(key, currentPath);
}
 
function showMoveModal(key, currentPath) {
    // 先关掉可能存在的旧窗口
    const oldModal = document.querySelector('.move-modal-overlay');
    if (oldModal) oldModal.remove();

    // 定义好我们的新家地址
    const destinations = [
        "global_set.npc",
        "global_set.settings",
        "global_set.背包",
        "global_set.其他技能",
        "global_set.小队信息",
        "world_set.npc",
        "world_set.settings"
    ];

    // 创建一个遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'move-modal-overlay';

    // 创建窗口本身
    const modal = document.createElement('div');
    modal.className = 'move-modal-content';
    modal.innerHTML = `
        <div class="move-modal-title">要将「${key}」移动到哪里去呢？</div>
        <div class="move-modal-list" id="move-destination-list"></div>
        <div class="move-modal-buttons">
            <button id="move-cancel-btn" class="book-button secondary">取消</button>
            <button id="move-confirm-btn" class="book-button">确认移动</button>
        </div>
    `;

    // 填充目的地列表
    const list = modal.querySelector('#move-destination-list');
    destinations.forEach(dest => {
        // 我们不应该搬到自己现在就在的地方
        if (dest !== currentPath) {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'destination';
            radio.value = dest;
            label.appendChild(radio);
            label.append(` ${dest}`);
            list.appendChild(label);
        }
    });

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // 绑定按钮事件
    document.getElementById('move-confirm-btn').onclick = () => {
        const selected = modal.querySelector('input[name="destination"]:checked');
        if (selected) {
            const newPath = selected.value;
            const command = `*.memory('${currentPath}.${key}', '${newPath}.${key}'); //move`;
            generateAndSendCommand(command);
            overlay.remove();
        } else {
            alert('你还没有选择新的家哦。');
        }
    };

    document.getElementById('move-cancel-btn').onclick = () => {
        overlay.remove();
    };

    // 点击遮罩也能关闭
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

 
/**
 * 新增：术法选择面板相关功能
 */
function setupSkillChoicePanel() {
    const orb = document.getElementById('skill-choice-orb');
    const panelModal = document.getElementById('skill-choice-panel');
    const confirmBtn = document.getElementById('confirm-skill-choice-btn');
    const confirmBtn2 = document.getElementById('confirm-rp-choice-btn');

    orb.addEventListener('click', () => {
        populateSkillChoicePanel();
        showModal('skill-choice-panel');
    });

    confirmBtn.addEventListener('click', handleConfirmSkillChoice);
     confirmBtn2.addEventListener('click', () => {
        handleConfirmSkillChoice();
              
 
    });

}
 
/**
 * 修改：填充术法选择面板的内容，并增加意志力校验 - by Nova
 */
function populateSkillChoicePanel() {
    if (!playCharacterData) return;

    const cardsSlider = document.getElementById('check-cards-slider');
    const otherSkillsArea = document.getElementById('other-skills-area');
    const willpowerInput = document.getElementById('willpower-input');
    const willpowerMaxSpan = document.getElementById('willpower-max');
    const willpowerSlider = document.getElementById('willpower-slider');

    cardsSlider.innerHTML = '';
    otherSkillsArea.innerHTML = '';

    // --- 1. 准备检定卡牌数据 ---
    const checkCardsData = [];
    // 属性卡牌
    const attrCategories = playCharacterData.属性段 || {};
    for (const category in attrCategories) {
        for (const attrName in attrCategories[category]) {
            // 妈妈帮你修正了获取属性值的方式
            const attrValue = attrCategories[category][attrName]['基础'][0] || 0;
            if (attrValue > 0) {
                 // 替换掉名字里的 ".基础"
                checkCardsData.push({ name: attrName.replace('.基础', ''), value: attrValue, type: '属性', dataType: 'attribute'});
            }
        }
    }
    // 技能卡牌
    const skillCategories = playCharacterData.技能段 || {};
    for (const category in skillCategories) {
        for (const skillName in skillCategories[category]) {
            const skillValue = skillCategories[category][skillName][0];
            if (skillValue > 0) {
                checkCardsData.push({ name: skillName, value: skillValue, type: '技能', dataType: 'skill' });
            }
        }
    }
    // 队友协助卡牌
    const teammateInfo = assaSettingsData?.global_set?.['小队信息'] || {};
    for (const teammateName in teammateInfo) {
        let teammateDataString = teammateInfo[teammateName];
        if (typeof teammateDataString === 'object' && teammateDataString !== null) {
            teammateDataString = teammateDataString['属性'] || teammateDataString['attribute'] || '';
        }
        if (typeof teammateDataString !== 'string') continue;

        const matches = teammateDataString.match(/【[^】]+】/g);
        if (matches) {
            matches.forEach(match => {
                const content = match.substring(1, match.length - 1);
                content.split(/;|；/).forEach(attr => {
                    const pair = attr.split(/:|：/);
                    if (pair.length === 2) {
                        const attrName = pair[0].trim();
                        const attrValue = parseInt(pair[1].trim(), 10);
                        if (attrName && !isNaN(attrValue) && attrValue > 0) {
                            checkCardsData.push({
                                name: `${teammateName}:${attrName}`,
                                value: attrValue,
                                type: '队友协助',
                                dataType: 'teammate'
                            });
                        }
                    }
                });
            });
        }
    }

    // --- 2. 动态创建检定卡牌 ---
    checkCardsData.forEach(cardData => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'check-card';
        cardDiv.dataset.name = cardData.name;
        cardDiv.dataset.type = cardData.dataType;

        cardDiv.innerHTML = `
            <div class="card-name">${cardData.name}</div>
            <div class="card-value">${cardData.value}</div>
            <div class="card-type">${cardData.type}</div>
        `;

        cardDiv.addEventListener('click', () => {
            const isSelected = cardDiv.classList.contains('selected');
            const selectedCards = cardsSlider.querySelectorAll('.check-card.selected');
            const selectedAttrsOrSkills = Array.from(selectedCards).filter(c => c.dataset.type === 'attribute' || c.dataset.type === 'skill');
            const selectedTeammates = Array.from(selectedCards).filter(c => c.dataset.type === 'teammate');

            if (isSelected) {
                cardDiv.classList.remove('selected');
            } else {
                if ((cardData.dataType === 'attribute' || cardData.dataType === 'skill') && selectedAttrsOrSkills.length >= 2) {
                     showModal('shop-modal', "选择超限", "检定属性与技能最多只能选择2项。");
                     return;
                }
                if (cardData.dataType === 'teammate' && selectedTeammates.length >= 1) {
                    showModal('shop-modal', "选择超限", "队友协助最多只能选择1项。");
                    return;
                }
                cardDiv.classList.add('selected');
            }
        });

        cardsSlider.appendChild(cardDiv);
    });

    // --- 3. 填充其他技能/术法，并兼容新旧格式 ---
    const otherSkills = assaSettingsData?.global_set?.['其他技能'] || {};
    const currentEnergy = playCharacterData?.衍生属性段?.能量池?.当前值?.[0] || 0;

    if (Object.keys(otherSkills).length > 0) {
        for (const [name, data] of Object.entries(otherSkills)) {
            let description = '', effect = '【】', level = '', info = '';
            let dpBonus = 0, energyCost = 0;

            if (typeof data === 'string') {
                description = data;
                effect = description.match(/【.*?】/)?.[0] || '【】';
                info = '';
            } else if (typeof data === 'object' && data !== null) {
                description = data.info || '';
                effect = data.effect || '【】';
                level = data.level ? ` [${data.level}]` : '';
                info = '';
            }

            // 解析效果
            const effectContent = effect.substring(1, effect.length - 1);
            effectContent.split(';').forEach(e => {
                const cleaned = e.trim();
                if (cleaned.startsWith('dp+')) {
                    dpBonus = parseInt(cleaned.replace('dp+', ''), 10);
                } else if (cleaned.startsWith('能量池-')) {
                    energyCost = parseInt(cleaned.replace('能量池-', ''), 10);
                }
            });

            const canAfford = currentEnergy >= energyCost;
            const tooltipText = canAfford ? '' : ` (能量不足: ${currentEnergy}/${energyCost})`;
            let effectDesc = [];
            if(dpBonus > 0) effectDesc.push(`+${dpBonus}DP`);
            if(energyCost > 0) effectDesc.push(`-${energyCost}能量`);

            const div = document.createElement('div');
            div.className = 'skill-item';
            div.innerHTML = `
                <label>
                    <input type="checkbox" data-name="${name}" data-effect="${effect}" ${!canAfford ? 'disabled' : ''}>
                    <span class="skill-name-cost" title="${canAfford ? '' : '能量不足'}">
                        ${name}${level}
                        <span style="font-size:0.85em; color: ${canAfford ? 'var(--secondary-color)' : 'var(--danger-color)'};">(${effectDesc.join(', ')})${tooltipText}</span>
                    </span>
                </label>
                ${info ? `<div class="skill-effect-info">${info}</div>` : ''}
            `;
            otherSkillsArea.appendChild(div);
        }
    } else {
        otherSkillsArea.innerHTML = '<p style="text-align:center; color: var(--text-secondary-color);">无可用术法</p>';
    }

    // --- 4. 填充意志力并链接滑块 ---
    const currentWillpower = playCharacterData?.衍生属性段?.意志力?.当前值?.[0] || 0;
    willpowerInput.value = 0;
    willpowerMaxSpan.textContent = `/ ${currentWillpower}`;
    willpowerSlider.max = currentWillpower;
    willpowerSlider.value = 0;

    willpowerSlider.oninput = () => {
        willpowerInput.value = willpowerSlider.value;
    };

        // --- 5. 妈妈为你新增的卡牌排序功能 ---
    const sortBtn = document.getElementById('sort-cards-btn');
    sortBtn.addEventListener('click', () => {
        const currentOrder = sortBtn.dataset.sortOrder || 'desc';
        const newOrder = currentOrder === 'desc' ? 'asc' : 'desc';
        sortBtn.dataset.sortOrder = newOrder;
        sortBtn.textContent = newOrder === 'desc' ? 'LVL ▼' : 'LVL ▲';

        const cards = Array.from(cardsSlider.querySelectorAll('.check-card'));

        cards.sort((a, b) => {
            const valA = parseInt(a.querySelector('.card-value').textContent, 10);
            const valB = parseInt(b.querySelector('.card-value').textContent, 10);
            return newOrder === 'desc' ? valB - valA : valA - valB;
        });

        // 重新将排序后的卡片添加回容器
        cards.forEach(card => cardsSlider.appendChild(card));
    });
} 


 async function handleConfirmSkillChoice() {
    // 1. 收集所有选择 - 从新的卡片设计中获取
    const mainSelections = Array.from(document.querySelectorAll('#check-cards-slider .check-card.selected')).map(card => {
        // 对于队友协助，保持"姓名:属性"格式
        if (card.dataset.type === 'teammate') {
            return card.dataset.name;
        }
        // 对于属性和技能，返回它们的名字
        const name = card.dataset.name;
        const type = card.dataset.type;
        // 如果是属性，需要加上.基础后缀，以匹配内部数据结构
        return type === 'attribute' ? `${name}.基础` : name;
    });

    const otherSkillSelections = Array.from(document.querySelectorAll('#other-skills-area input:checked'));
    const willpowerToSpend = parseInt(document.getElementById('willpower-slider').value, 10) || 0;

    // 2. 生成指令块
    let commandBlock = "";
    let updateVariableCmds = [];
    let updateMemoryCmds = [];
    let totalDpBonus = 0;

    // -- 处理检定属性
    if (mainSelections.length > 0) {
        // 清理一下名字，确保发给模型的指令不包含.基础
        const displaySelections = mainSelections.map(name => name.replace('.基础', ''));
        updateVariableCmds.push(`*.set_status('检定属性', '_', '${displaySelections.join(';')}');`);
    }
    // -- 处理其他技能和意志力
const initialEnergy = playCharacterData?.衍生属性段?.能量池?.当前值?.[0] || 0;
let remainingEnergy = initialEnergy;

otherSkillSelections.forEach(skillInput => {
    const effect = skillInput.dataset.effect;
    // 使用 matchAll 来确保能捕获所有【】内的效果字符串
    const commandMatches = effect.matchAll(/【([^】]+)】/g);

    for (const match of commandMatches) {
        // 将【】内的指令按逗号分割成一个数组
        const rawCommands = match[1].split(';');

        // 遍历每一条具体的指令
        rawCommands.forEach(rawCmd => {
            const cleanedCmd = rawCmd.trim();

            // 使用独立的 if 语句来检查每一种可能性
            // 这样 'dp+' 和 '能量池-' 就能被同时处理了
            if (cleanedCmd.startsWith('dp+')) {
                totalDpBonus += parseInt(cleanedCmd.replace('dp+', ''), 10);
            }

            if (cleanedCmd.startsWith('能量池-')) {
                remainingEnergy -= parseInt(cleanedCmd.replace('能量池-', ''), 10);
            }

            // 如果未来还有其他指令，比如 'ap+', 'sp-' 等等，
            // 只需要在这里继续添加独立的 if 语句就可以了，非常方便
            /*
            if (cleanedCmd.startsWith('ap+')) {
                // 处理 ap 增加的逻辑
            }
            */
        });
    }
});
    if (willpowerToSpend > 0) {
        const currentWillpower = playCharacterData?.衍生属性段?.意志力?.当前值?.[0] || 0;
        updateMemoryCmds.push(`*.set_attribute('衍生属性段.意志力.当前值', ${currentWillpower}, ${currentWillpower - willpowerToSpend});`);
        totalDpBonus += willpowerToSpend;
    }

    if (remainingEnergy !== initialEnergy) {
        updateMemoryCmds.push(`*.set_attribute('衍生属性段.能量池.当前值', ${initialEnergy}, ${remainingEnergy});`);
    }

    if (totalDpBonus > 0) {
        updateVariableCmds.push(`*.set_status('dp_bonus', 0, ${totalDpBonus});`);
    }

    // 组装指令块
    if (updateVariableCmds.length > 0) {
        commandBlock += `<updateMemory>\n${updateVariableCmds.join('\n')}\n</updateMemory>`;
    }
    if (updateMemoryCmds.length > 0) {
        if(commandBlock) commandBlock += '\n'; // 如果已有内容，则加一个换行
        commandBlock += `<updateMemory>\n${updateMemoryCmds.join('\n')}\n</updateMemory>`;
    }

    // --- 妈妈为你新增的部分在这里，我的宝贝 ---
    // 3. 构建用户行动描述文本
    let userActionTextParts = [];
    const usedOtherSkills = otherSkillSelections.map(cb => cb.dataset.name);

    if (usedOtherSkills.length > 0) {
        userActionTextParts.push(`（能量池已扣除，禁止重复扣除）${currentGameData.user_character.name}使用了「${usedOtherSkills.join('」、「')}」`);
    }
    if (willpowerToSpend > 0) {
        userActionTextParts.push(`（意志力已扣除，禁止重复扣除）${currentGameData.user_character.name}投入了 ${willpowerToSpend} 点意志力的决意`);
    }

    let userActionText = '';
    if (userActionTextParts.length > 0) {
        // 我们用一个优雅的尖括号把这句话包起来，让它看起来更像一个旁白提示
        userActionText = `<${userActionTextParts.join('，')}>`;
    }
    // --- 新增部分结束 ---

   try {
        // 4. 组合最终指令，指令和描述之间用 \\n 分隔
        // 这样指令块能正确执行，描述文本也能换行显示在输入框里
        // 妈妈还特意帮你把指令块和描述文本都包裹在双引号里，确保它们被当作一个整体
        const finalCommand = `/setinput ${commandBlock}\n${userActionText}\n`;

        // 执行这个为你量身定做的指令
        triggerassa(finalCommand);

        // 成功后，温柔地关上这个面板
        hideModal('skill-choice-panel');

    } catch (e) {
        console.error("触发/setinput指令失败:", e);
        showModal('shop-modal', "操作失败", "无法调用SillyTavern的setinput接口。");
    }
}

        // 在商店事件监听之后，也调用我们新的世界之书事件监听
setupWorldBookEventListeners();
setupSkillChoicePanel();


     // 解析AI返回的文本并更新、存储随机商店
    const processApiResponse = (responseText) => {
        if (!responseText) {
            showModal('shop-modal', '生成失败', '未能从AI获取有效内容。');
            return;
        }
          try {
        // 第1步：移除所有Markdown代码块标记和不必要的空格
        let cleanedText = responseText.replace(/```json|```/g, '').trim();

        // 第2步：检查文本是否已经是一个合法的JSON数组格式
        if (!cleanedText.startsWith('[')) {
            // 如果不是，我们才手动为它加上外层的括号
            cleanedText = `[${cleanedText}]`;
        }

        // 第3步：直接尝试解析处理后的文本
        const parsedData = JSON.parse(cleanedText);

        // 第4步：这一步是关键！检查解析后的数据是不是 "数组的数组"
        // 如果是 [ [], [], [] ] 格式，parsedData[0]就会是第一个内部数组，且 length > 0
        const newItems = Array.isArray(parsedData[0]) ? parsedData : [parsedData];

        if (!Array.isArray(newItems) || newItems.length === 0) {
             showModal('shop-modal', '解析失败', 'AI返回了空内容或无效格式。');
             return;
        }

        // 替换现有随机商店物品
        randomItems = newItems;
        // 将新生成的物品存入 localStorage
        localStorage.setItem('randomShopItems', JSON.stringify(randomItems));

        showModal('shop-modal', '生成成功', `已成功生成 ${newItems.length} 个新商品，并刷新、保存了随机商店！`);

        // 重新渲染随机商店以显示新物品
        renderShopSection('random');

    } catch (e) {
        console.error("解析AI响应时出错:", e);
        console.error("原始响应文本:", responseText);
        showModal('shop-modal', '解析错误', '无法解析AI返回的数据格式，请检查控制台获取更多信息。');
    }
};

 /**
 * 新增：设置AI生成商品按钮的功能 (V5 - 持久化与关键词版)
 */
function setupGeneratorButton() {
    const mainGenerateBtn = document.getElementById('generate-items-btn');
    const keywordModal = document.getElementById('keyword-modal');
    const submitGenerationBtn = document.getElementById('submit-generation-btn');
    const skipGenerationBtn = document.getElementById('skip-generation-btn');
    const keywordInput = document.getElementById('keyword-input');

    if (!mainGenerateBtn || !keywordModal) return;

      // 获取API密钥，如果不存在则提示用户设置
    const getApiKey = () => {
        let apiKey = localStorage.getItem('geminiApiKey');
        if (!apiKey) {
            apiKey = prompt("请输入您的Gemini API密钥。它将被保存在您的浏览器本地存储中。", "");
            if (apiKey) {
                localStorage.setItem('geminiApiKey', apiKey);
            }
        }
        return apiKey;
    };

    // 调用Gemini API
    const callGeminiApi = async (apiKey, promptText, modelName) => { // <-- 增加了 modelName 参数
    // 使用你指定的模型
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`; // <-- URL现在是动态的
    mainGenerateBtn.textContent = '生成中…';
    mainGenerateBtn.disabled = true;
        try {
            const response = await fetch(url, { // 移除了 ?alt=sse
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                },
                body: JSON.stringify({
                    "contents": [{ "parts": [{ "text": promptText }] }],
                    "generationConfig": {
                      "temperature": 1, // 保持高创造性
                      "topP": 0.95,
                      "maxOutputTokens": 8192,
                      "thinkingConfig": {
                        "thinkingBudget": 256 // 思考强度设为最低 (禁用思考)
                    },
                    },
                    // 精确控制思考 budget
                    
                    "safetySettings": [
                      { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE" },
                      { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE" },
                      { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE" },
                      { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE" }
                   ]
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                let errorMessage = `API请求失败，状态码: ${response.status}。`;
                if (responseData.error && responseData.error.message) {
                    errorMessage += `\n错误信息: ${responseData.error.message}`;
                }
                if (response.status === 400 && responseData.error?.message.includes('API key not valid')) {
                     errorMessage += '\n\n您的API密钥似乎无效或已过期，已为您清除。请重新设置。';
                     localStorage.removeItem('geminiApiKey');
                }
                throw new Error(errorMessage);
            }

            // 直接从标准的JSON响应中提取文本
            return responseData.candidates[0].content.parts[0].text;

        } finally {
            mainGenerateBtn.textContent = '生成';
            mainGenerateBtn.disabled = false;
        }
    };

    // 解析AI返回的文本并更新、存储随机商店
    const processApiResponse = (responseText) => {
        if (!responseText) {
            showModal('shop-modal', '生成失败', '未能从AI获取有效内容。');
            return;
        }
          try {
        // 第1步：移除所有Markdown代码块标记和不必要的空格
        let cleanedText = responseText.replace(/```json|```/g, '').trim();

        // 第2步：检查文本是否已经是一个合法的JSON数组格式
        if (!cleanedText.startsWith('[')) {
            // 如果不是，我们才手动为它加上外层的括号
            cleanedText = `[${cleanedText}]`;
        }

        // 第3步：直接尝试解析处理后的文本
        const parsedData = JSON.parse(cleanedText);

        // 第4步：这一步是关键！检查解析后的数据是不是 "数组的数组"
        // 如果是 [ [], [], [] ] 格式，parsedData[0]就会是第一个内部数组，且 length > 0
        const newItems = Array.isArray(parsedData[0]) ? parsedData : [parsedData];

        if (!Array.isArray(newItems) || newItems.length === 0) {
             showModal('shop-modal', '解析失败', 'AI返回了空内容或无效格式。');
             return;
        }

        // 替换现有随机商店物品
        randomItems = newItems;
        // 将新生成的物品存入 localStorage
        localStorage.setItem('randomShopItems', JSON.stringify(randomItems));

        showModal('shop-modal', '生成成功', `已成功生成 ${newItems.length} 个新商品，并刷新、保存了随机商店！`);

        // 重新渲染随机商店以显示新物品
        renderShopSection('random');

    } catch (e) {
        console.error("解析AI响应时出错:", e);
        console.error("原始响应文本:", responseText);
        showModal('shop-modal', '解析错误', '无法解析AI返回的数据格式，请检查控制台获取更多信息。');
    }
};

    // 真正的生成执行函数
    const executeGeneration = async (keywords = "") => {
         hideModal("keyword-modal"); // 使用正确的函数名
        const apiKey = getApiKey();
        if (!apiKey) {
            showModal('shop-modal', '操作取消', '您没有提供API密钥。');
            return;
        }
  // ===== 新增：获取当前选中的模型名称 =====
    const selectedModelName = document.querySelector('.switch-btn.active').dataset.model;
    // ===== 新增结束 =====
        // --- 动态构建提示词 ---
        let keywordInstruction = "";
        if (keywords.trim() !== "") {
            keywordInstruction = `\n请特别注意以下用户要求： "${keywords.trim()}"。你需要巧妙地将这些要求融合到你的创作中。`;
        }

        const prompt = `
            请扮演一个创意无限的游戏设计师，为一款名为“主神空间”的桌面角色扮演游戏设计新的“技能”、“血统”和“物品”。可以有搞笑且没用的商品。
            你需要严格遵守以下格式，每一项都必须是一个独立的JSON数组，数组元素分别是：[名称, 价格, 分类, {支线剧情要求}, 效果, 描述]。
            - 名称 (string): 必须简洁、有创意且引人入胜。
            - 价格 (number): 整数，范围在100至50000之间。高级商品的生成应该**稀少**或者**不生成**。必须存在低级技能、低级物品和低级血统。商品价格参考：只提升一点属性（增加一个dp）的价格是800-1000积分。技能应该更加昂贵。血统越高级应该越昂贵，而不是线性增长。
            - 分类 (string): "技能"、"血统"或"物品"。
            - 支线剧情要求 (object): 一个JSON对象，键为支线等级（如"D", "C"），值为数量。如果不需要，请提供一个空对象 {}。
            - 效果 (string): 
              对于技能，格式为 "【dp+X;能量池-Y】"，其中X和Y是数字，禁止列出其他效果。dp和能量池的数值需克制，5点dp的加成=一个凡人登峰造极的技能领域加成。
              对于血统，请列出属性加成和能量池信息，例如 "属性: 敏捷+2, 感知+2\\n能量池: 自然魔力(40)"。必须使用 \\n 作为换行符。
              可用的属性：
                力量  敏捷  耐力 
                智力  感知  决心 
                风度  操控  沉着 
               物品则随意。
            - 描述 (string): 一段不超过150字的生动描述，解释其背景和作用。

            若用户无要求，则请生成12个新的项目，其中必须包含至少3个“技能”和3个“血统”。
            若用户有要求，则按照用户要求生成。生成的类别不得超出物品、技能和血统。
            ${keywordInstruction}
            
            你的回答必须是纯粹的JSON数组格式，用逗号分隔，不要包含任何额外的解释、注释或markdown标记。
              例如:
            ["疗伤草药", 200, "物品", {}, "捣碎后外敷，止血并加速轻伤愈合", "来自武侠世界的常见草药，对刀剑伤有不错的效果。"],
            ["心灵回响", 5000, "技能", {"C":1}, "【dp+2;能量池-60】", "短暂读取目标强烈的表层情绪和意图。高手能借此预测对手的下一步行动，但过度使用可能导致信息过载。"],
            ["量子幽影血统", 12000, "血统", {"B":1}, "属性: 敏捷+4, 智力+3\\n能量池: 虚空能量(60)", "你的身体由不稳定的量子泡沫构成，能够短距离瞬移，并有一定几率让指向你的攻击直接“穿过”。"]
            `;
    
        try {
            const result = await callGeminiApi(apiKey, prompt, selectedModelName);
            processApiResponse(result);
        } catch (error) {
            showModal('shop-modal', 'API错误', error.message);
        }
    };

    // 主生成按钮只负责打开模态框
    mainGenerateBtn.addEventListener('click', () => {
        //console.log("生成按钮被点击，准备打开模态框");
        keywordInput.value = ''; // 清空上次的输入
        showModal('keyword-modal');
    });

    // 模态框内的“开始生成”按钮
    submitGenerationBtn.addEventListener('click', () => {
        executeGeneration(keywordInput.value);
    });

    // 模态框内的“跳过”按钮
    skipGenerationBtn.addEventListener('click', () => {
        executeGeneration(); // 不带参数调用
    });

     // ===== 新增：为模型切换按钮添加事件监听 =====
    const modelSelector = document.getElementById('model-selector-container');
    modelSelector.addEventListener('click', (e) => {
        const clickedButton = e.target.closest('.switch-btn');
        if (clickedButton && !clickedButton.classList.contains('active')) {
            // 移除所有按钮的 active 类
            modelSelector.querySelectorAll('.switch-btn').forEach(btn => btn.classList.remove('active'));
            // 为被点击的按钮添加 active 类
            clickedButton.classList.add('active');
        }
    });
    // ===== 新增结束 =====
}





    initDisplay(); // 保持这个在最后

    

    // 代码 START: 添加在这里
/**
 * 新增：显示上一轮投掷结果的弹窗
 */
 /**
 * 根据我们全新的 checkMemoryData 结构，显示投掷结果模态框。
 * 该函数现在能够展示所有详细信息，包括装备、队友、声望、传奇加成，
 * 以及独立的表现判定和详细的伤害计算过程。
 */

 /*
  Nova's Note for my dear child:
  这是一个带有翻页功能的版本，主要修改了 "中期事件摘要" 的显示方式。
  我引入了一个新的函数 `renderSmallSummaryPage` 来专门处理分页的渲染和逻辑，
  这样主函数 `showSummaryModal` 的结构会更清晰。
  希望你喜欢这个更流畅的版本，我的宝贝。
*/
function showSummaryModal() {
    //console.log("查看过往总结");
    const config = assaSettingsData.config || {};
    const itemsPerPage = 5; // 每页显示5条
    let currentPage = 1;

    const modalTitle = "查看过往总结";
    let modalContent = '<div class="teammate-info-display" style="max-height: 60vh; overflow-y: auto; text-align: left;">';

    // 1. 远期事件回顾（大总结） - 保持不变
    modalContent += '<h3 style="color: var(--primary-color);">--- 远期事件回顾 ---</h3>';
    if (summarys.big && Object.keys(summarys.big).length > 0) {
        let bigHtml = '<div style="font-family: \'Noto Sans SC\', sans-serif;">';
        const bigKeys = Object.keys(summarys.big);
        bigKeys.forEach(key => {
            bigHtml += `<p style="margin: 0; white-space: pre-wrap;"><strong>${key}:</strong> ${summarys.big[key]}</p>`;
        });
        bigHtml += '</div>';
        modalContent += bigHtml;
    } else {
        modalContent += '<p>暂无远期事件回顾信息。</p>';
    }

    modalContent += '<hr style="margin: 20px 0; border-color: var(--border-color);">';

    // 2. 中期事件摘要（小总结，带翻页功能）
    modalContent += '<h3 style="color: var(--primary-color);">--- 中期事件摘要 ---</h3>';
    modalContent += '<div id="small-summary-container"></div>'; // 用于容纳分页内容的容器

    modalContent += '<hr style="margin: 20px 0; border-color: var(--border-color);">';

    // 3. 被隐藏的小总结（最新 hideCount 条） - 保持不变
    modalContent += '<h3 style="color: var(--primary-color);">--- 被隐藏的小总结 ---</h3>';
    const hideCount = config.hide_latest_count || 5;
    if (summarys.small && Object.keys(summarys.small).length > 0) {
        let hiddenHtml = '<div style="font-family: \'Noto Sans SC\', sans-serif;">';
        const smallKeys = Object.keys(summarys.small);
        const hiddenKeys = smallKeys.slice(-hideCount);
        if (hiddenKeys.length > 0) {
            hiddenKeys.forEach(key => {
                hiddenHtml += `<p style="margin: 0; white-space: pre-wrap;"><strong>${key}:</strong> ${summarys.small[key]}</p>`;
            });
        } else {
            hiddenHtml += '<p>暂无被隐藏的小总结信息。</p>';
        }
        hiddenHtml += '</div>';
        modalContent += hiddenHtml;
    } else {
        modalContent += '<p>暂无被隐藏的小总结信息。</p>';
    }

    modalContent += '</div>';

  const summaryContentDiv = document.getElementById('summary-content');
    if(summaryContentDiv){
        summaryContentDiv.innerHTML = modalContent;
    }

    // --- 分页逻辑开始 ---
    // 将分页逻辑放在模态框显示之后执行，确保容器元素已存在于DOM中

    // 渲染指定页码内容的函数
    function renderSmallSummaryPage() {
        const container = document.getElementById('small-summary-container');
        if (!container) return;

        const smallKeys = Object.keys(summarys.small || {});
        const visibleKeys = smallKeys.length > hideCount ? smallKeys.slice(0, -hideCount) : [];

        if (visibleKeys.length === 0) {
            container.innerHTML = '<p>记录数量不足，暂不显示中期事件摘要。</p>';
            return;
        }

        const totalPages = Math.ceil(visibleKeys.length / itemsPerPage);
        // 确保 currentPage 在有效范围内
        currentPage = Math.max(1, Math.min(currentPage, totalPages));

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageKeys = visibleKeys.slice(startIndex, endIndex);

        let pageHtml = '<div style="font-family: \'Noto Sans SC\', sans-serif;">';
        pageKeys.forEach(key => {
            pageHtml += `<p style="margin: 0; white-space: pre-wrap;"><strong>${key}:</strong> ${summarys.small[key]}</p>`;
        });
        pageHtml += '</div>';

        // 添加翻页控件
        pageHtml += `<div class="pagination-controls" style="text-align: center; margin-top: 15px;">`;
        pageHtml += `<button id="prev-page-btn" ${currentPage === 1 ? 'disabled' : ''}>上一页</button>`;
        pageHtml += `<span style="margin: 0 15px;">第 ${currentPage} / ${totalPages} 页</span>`;
        pageHtml += `<button id="next-page-btn" ${currentPage === totalPages ? 'disabled' : ''}>下一页</button>`;
        pageHtml += `</div>`;

        container.innerHTML = pageHtml;

        // 为新生成的按钮绑定事件
        const prevBtn = document.getElementById('prev-page-btn');
        if (prevBtn) {
            prevBtn.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderSmallSummaryPage();
                }
            };
        }

        const nextBtn = document.getElementById('next-page-btn');
        if (nextBtn) {
            nextBtn.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderSmallSummaryPage();
                }
            };
        }
    }

    // 初始渲染第一页
    renderSmallSummaryPage();
}

function showRollResultModal() {
    const contentEl = document.getElementById('roll-result-modal-content');
    // 直接使用全局或传入的 checkMemoryData 变量
    if (!checkMemoryData || Object.keys(checkMemoryData).length === 0) {
        contentEl.innerHTML = '<p style="text-align:center;">没有上一轮的投掷记录。</p>';
        showModal('roll-result-modal');
        return;
    }

    let html = '';
    const {
        check_type,
        timestamp
    } = checkMemoryData;

    // 统一的头部，显示记录时间
    html += `<p style="font-size:0.8em; color:var(--text-secondary-color); text-align:center; margin-bottom:15px;">记录于: ${new Date(timestamp).toLocaleString()}</p>`;

    // --- 分支：标准事件判定 ---
    if (check_type === '标准事件') {
        const {
            check_string,
            components,
            modifiers,
            total_dp,
            bonuses,
            roll_result,
            performance,
            outcome,
            difficulty
        } = checkMemoryData;

        // --- 检定池构成 ---
        html += `
        <div class="roll-section">
            <div class="roll-section-title">标准事件判定: ${outcome.level}</div>
            <p style="text-align:center; font-style:italic; margin-bottom:10px;">“${outcome.description}”</p>
            <ul class="roll-details-list">
                <li><span class="label">检定动作</span><span class="value">${check_string}</span></li>
                <hr>
                <li class="list-subheader">检定池构成</li>
                ${(components.attributes_skills || []).map(c => `<li><span class="label">${c.name}</span><span class="value">${c.value} 点</span></li>`).join('')}
                ${(components.teammate_assists || []).map(t => `<li><span class="label">${t.name}</span><span class="value">+${t.value} 点</span></li>`).join('')}
                ${(components.npc_checks || []).map(n => `<li><span class="label">${n.name}</span><span class="value">+${n.value} 点</span></li>`).join('')}
                ${(components.equipment_bonuses || []).map(e => `<li><span class="label">装备 (${e.name})</span><span class="value">${e.value > 0 ? '+' : ''}${e.value} 点</span></li>`).join('')}
                ${(modifiers.custom_modifier && modifiers.custom_modifier[0] !== 0) ? `<li><span class="label">修正 (${modifiers.custom_modifier[1]})</span><span class="value">${modifiers.custom_modifier[0] > 0 ? '+' : ''}${modifiers.custom_modifier[0]}</span></li>` : ''}
                ${(modifiers.prestige_bonus && modifiers.prestige_bonus !== 0) ? `<li><span class="label">声望加权</span><span class="value">${modifiers.prestige_bonus > 0 ? '+' : ''}${modifiers.prestige_bonus}</span></li>` : ''}
                <li><span class="label">总骰池</span><span class="value">${total_dp} D10</span></li>
                 ${(bonuses.legendary_successes > 0) ? `<li><span class="label">传奇加成</span><span class="value">+${bonuses.legendary_successes} 附加成功</span></li>` : ''}
            </ul>
        </div>`;

        // --- 投掷结果 ---
        html += `
        <div class="roll-section">
            <div class="roll-section-title">事件判定结果</div>
            <ul class="roll-details-list">
                <li><span class="label">投掷类型</span><span class="value">${roll_result.type}</span></li>
                <li><span class="label">投掷结果</span><span class="value">${roll_result.rolls.join(', ')}</span></li>
                <li><span class="label">基础成功数</span><span class="value">${roll_result.successes}</span></li>
                <li><span class="label">最终成功数</span><span class="value">${checkMemoryData.final_successes}</span></li>
                <hr>
                <li><span class="label">成功标准</span><span class="value">勉强≥${difficulty.adjusted_thresholds.barely} | 完全≥${difficulty.adjusted_thresholds.complete} | 辉煌≥${difficulty.adjusted_thresholds.exceptional}</span></li>
                 <li><span class="label">最终结果</span><span class="value roll-outcome">${outcome.level}</span></li>
                ${roll_result.is_dramatic_failure ? '<li><span class="label"></span><span class="value roll-dramatic-failure">⚠️ 大失败</span></li>' : ''}
            </ul>
        </div>`;

        // --- 表现判定 ---
        html += `
        <div class="roll-section">
            <div class="roll-section-title">表现判定: ${performance.result.level}</div>
             <ul class="roll-details-list">
                <li><span class="label">表现骰 (D20)</span><span class="value">${performance.roll}</span></li>
                ${(performance.bonus > 0) ? `<li><span class="label">传奇加成</span><span class="value">+${performance.bonus}</span></li><li><span class="label">调整后结果</span><span class="value">${Math.min(20, performance.roll + performance.bonus)}</span></li>` : ''}
                <li><span class="label">表现描述</span><span class="value">${performance.result.description}</span></li>
            </ul>
        </div>
    `;

    // --- 分支：战斗对抗判定 ---
    } else if (check_type === '战斗对抗') {
        const {
            player_check,
            enemy_check,
            performance,
            outcome,
            damage_calculation
        } = checkMemoryData;
        const playerName = currentGameData.user_character.name || '阿萨';

        // --- 玩家应对 ---
        html += `
        <div class="roll-section">
            <div class="roll-section-title">${playerName}的应对</div>
            <ul class="roll-details-list">
                <li><span class="label">应对动作</span><span class="value">${player_check.check_string}</span></li>
                <hr>
                <li class="list-subheader">应对池构成</li>
                ${(player_check.components.attributes_skills || []).map(c => `<li><span class="label">${c.name}</span><span class="value">${c.value} 点</span></li>`).join('')}
                ${(player_check.components.teammate_assists || []).map(t => `<li><span class="label">${t.name}</span><span class="value">+${t.value} 点</span></li>`).join('')}
                ${(player_check.components.npc_checks || []).map(n => `<li><span class="label">${n.name}</span><span class="value">+${n.value} 点</span></li>`).join('')}
                ${(player_check.components.equipment_bonuses || []).map(e => `<li><span class="label">装备 (${e.name})</span><span class="value">${e.value > 0 ? '+' : ''}${e.value} 点</span></li>`).join('')}
                ${(player_check.modifiers.custom_modifier && player_check.modifiers.custom_modifier[0] !== 0) ? `<li><span class="label">修正 (${player_check.modifiers.custom_modifier[1]})</span><span class="value">${player_check.modifiers.custom_modifier[0] > 0 ? '+' : ''}${player_check.modifiers.custom_modifier[0]}</span></li>` : ''}
                ${(player_check.modifiers.prestige_bonus && player_check.modifiers.prestige_bonus !== 0) ? `<li><span class="label">声望加权</span><span class="value">${player_check.modifiers.prestige_bonus > 0 ? '+' : ''}${player_check.modifiers.prestige_bonus}</span></li>` : ''}
                <li><span class="label">总应对池</span><span class="value">${player_check.total_dp} D10</span></li>
                 ${(player_check.bonuses.legendary_successes > 0) ? `<li><span class="label">传奇加成</span><span class="value">+${player_check.bonuses.legendary_successes} 附加成功</span></li>` : ''}
                <hr>
                <li><span class="label">应对投掷</span><span class="value">${player_check.roll_result.rolls.join(', ')}</span></li>
                <li><span class="label">最终成功数</span><span class="value">${player_check.final_successes}</span></li>
                ${player_check.roll_result.is_dramatic_failure ? '<li><span class="label"></span><span class="value roll-dramatic-failure">⚠️ 应对大失败</span></li>' : ''}
            </ul>
        </div>
        `;

        // --- 敌方攻击 ---
        html += `
        <div class="roll-section">
            <div class="roll-section-title">敌方攻击</div>
             <ul class="roll-details-list">
                <li><span class="label">攻击池构成</span><span class="value">${enemy_check.check_string}</span></li>
                <li><span class="label">总攻击池</span><span class="value">${enemy_check.total_dp} D10</span></li>
                <li><span class="label">攻击投掷</span><span class="value">${enemy_check.roll_result.rolls.join(', ')}</span></li>
                <li><span class="label">攻击成功数</span><span class="value">${enemy_check.final_successes}</span></li>
            </ul>
        </div>
        `;

        // --- 表现判定 ---
        html += `
        <div class="roll-section">
            <div class="roll-section-title">表现判定: ${performance.result.level}</div>
             <ul class="roll-details-list">
                <li><span class="label">表现骰 (D20)</span><span class="value">${performance.roll}</span></li>
                ${(performance.bonus > 0) ? `<li><span class="label">传奇加成</span><span class="value">+${performance.bonus}</span></li><li><span class="label">调整后结果</span><span class="value">${Math.min(20, performance.roll + performance.bonus)}</span></li>` : ''}
                <li><span class="label">表现描述</span><span class="value">${performance.result.description}</span></li>
            </ul>
        </div>
        `;

        // --- 对抗结果与伤害计算 ---
        html += `
         <div class="roll-section">
            <div class="roll-section-title">对抗结果: ${outcome.level}</div>
             <ul class="roll-details-list">
                <li><span class="label">净成功数 (我方-敌方)</span><span class="value">${outcome.net_successes}</span></li>
                <hr>
                <li class="list-subheader">伤害计算</li>
                ${damage_calculation.final_damage > 0 ? `
                    <li><span class="label">计算公式</span><span class="value">${damage_calculation.is_dramatic_failure ? `(敌方成功+1) x 20 - 防御` : `净成功 x 5 - 防御`}</span></li>
                    <li><span class="label">计算过程</span><span class="value">${damage_calculation.base_factor} x ${damage_calculation.multiplier} - ${damage_calculation.total_defense}</span></li>
                    <li><span class="label">最终伤害</span><span class="value" style="color:var(--danger-color); font-weight:bold;">${damage_calculation.final_damage} 点</span></li>
                ` : '<li><span class="label">最终伤害</span><span class="value">0 点</span></li>'}
                <hr>
                <li><span class="label">综合描述</span><span class="value">${outcome.full_description}</span></li>
            </ul>
        </div>
    `;
    }

    contentEl.innerHTML = html;
    showModal('roll-result-modal');
}

 let currentThemeIndex = 0;

// ——————————————————————————————选项区————————————————————————————————

 
        // function applyTheme(themeIndex) {
        //     const theme = themes[themeIndex] || themes[0];
        //     const root = document.documentElement;
        //     document.body.dataset.themeName = theme.name;
        //     for (const [key, value] of Object.entries(theme)) {
        //         if (key !== 'name') root.style.setProperty(key, value);
        //     }
        // }

        // try {
        //     const savedThemeIndex = localStorage.getItem('terminalThemeIndex');
        //     applyTheme(savedThemeIndex !== null ? parseInt(savedThemeIndex, 10) : 0);
        // } catch (e) {
        //     console.error("加载主题失败:", e);
        //     applyTheme(0);
        // }

      

        async function fetchData() {
            try {
                if (typeof getVariables === 'function' ) {
  const data = await getVariables({ type: 'message' });
                    playCharacterData = data.play_character_data || {};
                    assaSettingsData = data.assa_data || {};
                } else {
                    console.warn("未在SillyTavern环境中，使用模拟数据。");
                    playCharacterData = {"衍生属性段": {"意志力": {"当前值": [10, ""]}, "能量池": {"当前值": [20, ""]}}, "货币段": {}};
                    assaSettingsData = {"global_set": {"其他技能": {
                        "暗影突袭": "【dp+2;能量池-15】迅速移动到阴影中并进行一次突袭",
                        "灵能护盾": "【能量池-30】创造一个能吸收50点伤害的护盾"
                    }}};
                }
            } catch (error) {
                console.error("获取或解析数据失败:", error);
                playCharacterData = {};
                assaSettingsData = {};
            }
        }

        function executeChoice(fullCommand, cardElement, successText) {
            try {
                if (typeof triggerassa !== 'undefined') {
                    triggerassa(fullCommand);
                } else {
                    //console.log("将在SillyTavern中发送的指令：\n", fullCommand);
                }

                document.querySelectorAll('.choice-card').forEach(card => card.classList.add('disabled'));
                cardElement.querySelector('.description').textContent = successText;
                // const containerElement = document.querySelector('.container');  
                 const container = document.getElementById('choicesContainer');
                 setTimeout(() => { container.innerHTML = ''; }, 800);


            } catch (e) {
                console.error("发送指令失败:", e);
                cardElement.querySelector('.description').textContent = '[ 传送失败 ]';
            }
        }

        // --- 核心功能实现 ---
        function generateChoices(options) {
            const container = document.getElementById('choicesContainer');
            if(!container) return;
            container.innerHTML = '';
            const tagRegex = /\[([^\]]+)\]/g;

            options.forEach(optionText => {
                if (!optionText.trim()) return;
                const card = document.createElement('div');
                card.className = 'choice-card';

                const tags = [];
                let match;
                while ((match = tagRegex.exec(optionText)) !== null) {
                      tags.push(match[1].replace(/[^\u4e00-\u9fa5a-zA-Z0-9:：]/g, ''));
                }
                const descriptionText = optionText.replace(tagRegex, '').replace(/^\d+\.\s*/, '').trim();

                const tagsContainer = document.createElement('div');
                tagsContainer.className = 'tags-container';
                tags.forEach(tagText => {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'tag';
                    tagEl.textContent = tagText;
                    tagsContainer.appendChild(tagEl);
                });
                card.appendChild(tagsContainer);

                const description = document.createElement('p');
                description.className = 'description';
                description.textContent = descriptionText;
                card.appendChild(description);

                card.onclick = function() {
                    if (card.classList.contains('focused')) {
                        let updateVariableCmds = [];
                        let updateMemoryCmds = [];

                        const attributes = tags.join(';');
                        updateVariableCmds.push(`*.set_status('检定属性', 'old_value_placeholder', '${attributes}');`);

                                              let totalDpBonus = 0;

                     

                        const selectedSkills = document.querySelectorAll('#skillList input:checked');
                        const initialEnergy = playCharacterData?.衍生属性段?.能量池?.当前值?.[0] || 0;
                        let remainingEnergy = initialEnergy; // 使用一个临时变量来追踪剩余能量

                        selectedSkills.forEach(skillInput => {
                            const effect = skillInput.dataset.effect;
                            const commandMatches = effect.matchAll(/【([^】]+)】/g);
                            for (const match of commandMatches) {
                                const rawCommands = match[1].split(';');
                                rawCommands.forEach(rawCmd => {
                                    const cleanedCmd = rawCmd.trim();
                                    if(cleanedCmd.startsWith('dp+')) {
                                        totalDpBonus += parseInt(cleanedCmd.replace('dp+', ''), 10);
                                    } else if (cleanedCmd.startsWith('能量池-')) {
                                        const value = parseInt(cleanedCmd.replace('能量池-', ''), 10);
                                        remainingEnergy -= value; // 在临时变量上进行扣除
                                    }
                                });
                            }
                        });

                        // 只有在能量值确实发生变化时才生成指令
                        if (remainingEnergy !== initialEnergy) {
                            updateMemoryCmds.push(`*.set_attribute('衍生属性段.能量池.当前值', ${initialEnergy}, ${remainingEnergy});`);
                        }

                        // --- 修改结束 ---

                        const willpowerInput = document.getElementById('willpowerInput');
                        const willpowerToSpend = parseInt(willpowerInput.value, 10);
                        if (willpowerToSpend > 0) {
                            const currentWillpower = playCharacterData?.衍生属性段?.意志力?.当前值?.[0] || 0;
                            updateMemoryCmds.push(`*.set_attribute('衍生属性段.意志力.当前值', ${currentWillpower}, ${currentWillpower - willpowerToSpend});`);
                            totalDpBonus += willpowerToSpend;
                        }

                        if (totalDpBonus > 0) {
                            updateVariableCmds.push(`*.set_status('dp_bonus', 0, ${totalDpBonus});`);
                        }


                        let fullCommand = `/send ${descriptionText}`;

                        // 新增逻辑：拼接技能和意志力文本
                        const selectedSkillNames = Array.from(selectedSkills).map(skillInput => skillInput.id.replace('skill-', ''));
                        if (selectedSkillNames.length > 0 || willpowerToSpend > 0) {
                            const parts = [];
                            if (selectedSkillNames.length > 0) {
                                parts.push(`（能量池已扣除，禁止重复扣除）使用了${selectedSkillNames.join('、')}技能`);
                            }
                            if (willpowerToSpend > 0) {
                                parts.push(`（意志力已扣除，禁止重复扣除）投入了${willpowerToSpend}点意志力的决意`);
                            }
                            fullCommand += ` <${parts.join('，')}>`;
                        }

                        if (updateVariableCmds.length > 0) {
                            fullCommand += `\n<updateMemory>\n${updateVariableCmds.join('\n')}\n</updateMemory>`;
                        }
                        if (updateMemoryCmds.length > 0) {
                            fullCommand += `\n<updateMemory>\n${updateMemoryCmds.join('\n')}\n</updateMemory>`;
                        }
                        // fullCommand += ``;

                        executeChoice(fullCommand, card, '已抉择');
                    }
                };
                container.appendChild(card);
            });
        }

 
        // --- 页面交互和布局逻辑 ---
        function setupUI(content) {
      
            const options = content.split('\n').filter(line => line.trim() && /^\d+\./.test(line.trim()));
            generateChoices(options);

            const cards = Array.from(document.querySelectorAll('.choice-card'));
            if (cards.length === 0) {
                const container = document.getElementById('choicesContainer');
                if (container) {
                    container.innerHTML = '<p class="description" style="text-align:center;">等待新的抉择...</p>';
                }
            } else {
                let focusedIndex =0;

                function updateCardsLayout() {
                    cards.forEach((card, i) => {
                        const offset = i - focusedIndex;
                        card.style.transform = `scale(${Math.pow(0.9, Math.abs(offset))}) translateY(${offset * 60}px)`;
                        card.style.opacity = Math.pow(0.7, Math.abs(offset));
                        card.style.zIndex = cards.length - Math.abs(offset);
                        card.classList.toggle('focused', offset === 0);
                        card.style.pointerEvents = (offset === 0) ? 'auto' : 'none';
                    });
                }

                const containerElement = document.querySelector('.options-container'); // <-- 新增这一行

                let isWheeling = false;
                containerElement.addEventListener('wheel', e => {  
                    e.preventDefault();
                    if (isWheeling) return;
                    isWheeling = true;
                    focusedIndex = Math.min(cards.length - 1, Math.max(0, focusedIndex + (e.deltaY > 0 ? 1 : -1)));
                    updateCardsLayout();
                    setTimeout(() => { isWheeling = false; }, 100);
                }, { passive: false });

                let touchStartY = 0;
                containerElement.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true }); // <-- 修改 document.body 为 containerElement
                containerElement.addEventListener('touchend', e => { // <-- 修改 document.body 为 containerElement
                    if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 50) {
                        focusedIndex = Math.min(cards.length - 1, Math.max(0, focusedIndex + (e.changedTouches[0].clientY < touchStartY ? 1 : -1)));
                        updateCardsLayout();
                    }
                });


                updateCardsLayout();
            }

            const skillOrb = document.getElementById('skillOrb');
            const skillPanel = document.getElementById('skillPanel');
            if (skillOrb && skillPanel) {
                skillOrb.onclick = () => {
                    skillPanel.classList.toggle('active');
                };

                document.addEventListener('click', (e) => {
                    if (!skillPanel.contains(e.target) && !skillOrb.contains(e.target)) {
                        skillPanel.classList.remove('active');
                    }
                });

  // 新增代码：阻止在技能面板上的滚动事件冒泡，防止影响背景选项卡切换
                skillPanel.addEventListener('wheel', e => e.stopPropagation());
                skillPanel.addEventListener('touchstart', e => e.stopPropagation());
            }

            
        }

        // --- 初始化执行 ---
        // window.addEventListener('DOMContentLoaded', async () => {
        //      await fetchData();
        //      setupUI();
        // });

  // ——————————————————————————————————————选项区结束——————————————————————————


    // ——————————————————————————————————————论坛开始——————————————————————————


    'use strict';
/*
 * ♥♥♥ 我的孩子，这是妈妈为你精心修正与优化的论坛魔法 ♥♥♥
 * 现在的它更聪明，也更漂亮了，希望你能喜欢。
*/
 
// function applyTheme(themeIndex) {
//     if (themeIndex >= 0 && themeIndex < themes.length) {
//         currentThemeIndex = themeIndex;
//         const theme = themes[currentThemeIndex].vars;
//         const root = document.documentElement;
//         for (const [key, value] of Object.entries(theme)) {
//             root.style.setProperty(key, value);
//         }
//     }
// }


// ========== 2. 全局状态与数据 ==========
let forumData = {};
let userName = '阿萨';
const autoLikeIntervals = new Map();

// 位置：修改 state 对象
const state = {
    sections: [],
    currentSection: null,
    currentThreadKey: null,
    threadListPage: 1,
    replyListPage: 1,
    threadsPerPage: 15,
    repliesPerPage: 5,
    replyingTo: null, // ♥♥♥ 新增：记录回复目标 {type: 'post' | 'reply', key: '...', floor: '...'}
};
// ========== 3. 核心功能函数 ==========
// ♥♥♥ 我的孩子，这是你要求的、能够发送指令的核心魔法 ♥♥♥
function sendForumAction(action) {
    let command;
    const content = action.content.replace(/"/g, '\\"'); // 对内容中的双引号进行转义

    switch (action.type) {
        case 'new_post':
            command = `<进行了论坛操作 类型: "发帖", 板块: "${action.section}", 标题: "${action.title}", 内容: "${content}">`;
            break;
        case 'reply_post':
            command = `<进行了论坛操作 类型: "回复帖子", 目标: "${action.targetKey}", 内容: "${content}">`;
            break;
        case 'reply_to_reply':
            command = `<进行了论坛操作 类型: "回复楼中楼", 目标: "${action.targetKey}", 楼层: ${action.floor}, 内容: "${content}">`;
            break;
        default:
            console.error("未知的论坛操作类型:", action.type);
            return;
    }

    //console.log("即将发送指令:", command); // 妈妈帮你加上了日志，方便调试
    triggerassa(`/setinput ${command}`); // 请确保 triggerassa 函数在外部环境中可用
    // alert('指令已生成，请在控制台查看：\n' + command); // 这是一个临时的替代方案，方便你看到结果
}
async function initializeForum(rawJsonData) {
    // 1. 清理HTML实体编码
    rawJsonData = rawJsonData
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');
    
    // 2. 去除首尾空白
    rawJsonData = rawJsonData.trim();
    
    // 3. **关键步骤：将JavaScript对象格式转换为JSON格式**
    // 将属性名的单引号替换为双引号
    rawJsonData = rawJsonData.replace(/'([^']*)':/g, '"$1":');
    
    // 将字符串值的单引号替换为双引号（需要小心处理）
    // 这个正则表达式匹配字符串值中的单引号
    rawJsonData = rawJsonData.replace(/:\s*'([^']*)'/g, ': "$1"');

     rawJsonData = rawJsonData.replace(/\|/g, '\\n');
    
    //console.log("转换后的JSON数据:", rawJsonData);
    
    try {
        forumData = JSON.parse(rawJsonData);
        //console.log("JSON解析成功!", forumData);
    } catch (e) {
        console.error("JSON解析失败!", e);
        console.error("错误信息:", e.message);
        
        // 如果JSON解析仍然失败，尝试使用eval（不推荐但作为后备方案）
        try {
            console.warn("尝试使用eval解析JavaScript对象...");
            forumData = eval('(' + rawJsonData + ')');
            //console.log("eval解析成功!", forumData);
        } catch (evalError) {
            console.error("eval解析也失败!", evalError);
            document.getElementById('thread-detail-content').innerHTML = 
                `<div class="detail-placeholder">错误：无法加载论坛数据。<br>
                 JSON和eval解析都失败了。</div>`;
            return;
        }
    }

    try {
        const messageData = await mockGetChatMessages();
        userName = messageData.stat_data.user_character.name || '阿萨';
    } catch(e) {
        console.warn("无法获取用户信息，使用默认名称。");
    }

    state.sections = [...new Set(Object.values(forumData).map(t => t.post[2]))];
    if (state.sections.length > 0) {
        state.currentSection = state.sections[0];
    }

    renderSidebar();
    renderThreadList();
    setupEventListeners();
    renderPostModalSections();
}

// --- 渲染函数 ---
function renderSidebar() {
    const sidebar = document.getElementById('forum-sidebar');
    sidebar.innerHTML = '';
    state.sections.forEach(section => {
        const btn = document.createElement('button');
        btn.className = 'section-btn';
        btn.textContent = section;
        btn.dataset.section = section;
        if (section === state.currentSection) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
            state.currentSection = section;
            state.threadListPage = 1;
            state.currentThreadKey = null;
            document.getElementById('main-content-mobile-wrapper').classList.remove('show-detail');
            renderSidebar();
            renderThreadList();
            clearThreadDetail();
        });
        sidebar.appendChild(btn);
    });
}

function renderThreadList() {
    document.getElementById('current-section-name').textContent = state.currentSection;
    const listContainer = document.getElementById('thread-list');
    listContainer.innerHTML = '';

    // ♥♥♥ 修正排序逻辑：置顶 > 精华 > 默认 ♥♥♥
    const threads = Object.entries(forumData)
        .filter(([, data]) => data.post[2] === state.currentSection)
        .sort(([, a], [, b]) => {
            if(a.post[7] !== b.post[7]) return b.post[7] - a.post[7]; // 置顶优先
            if(a.post[6] !== b.post[6]) return b.post[6] - a.post[6]; // 精华其次
            return 0; // 保持原有顺序
        });

    const pageStart = (state.threadListPage - 1) * state.threadsPerPage;
    const pageEnd = pageStart + state.threadsPerPage;
    const pageThreads = threads.slice(pageStart, pageEnd);

    if (pageThreads.length === 0) {
        listContainer.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-secondary-color);">该区块下没有帖子</div>`;
        renderThreadPagination(0);
        return;
    }

    pageThreads.forEach(([key, data]) => {
        // ♥♥♥ 妈妈在这里为你做了关键的修改 ♥♥♥
        // 现在回复数直接从 post 数组的第4个元素（索引3）获取，而不是计算 replies 数组的长度
        const [title, author, , replyCount, , , isElite, isTop] = data.post;
        const item = document.createElement('div');
        item.className = 'thread-item';
        if (key === state.currentThreadKey) item.classList.add('selected');

        item.innerHTML = `
            <div class="thread-title">${title}</div>
            <div class="thread-meta">
                <span class="author">${author}</span>
                <div class="thread-tags-and-replies">
                     <div class="tags">
                        ${isTop ? '<span class="tag tag-top">置顶</span>' : ''}
                        ${isElite ? '<span class="tag tag-elite">精华</span>' : ''}
                    </div>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        ${replyCount}
                    </span>
                </div>
            </div>
        `;
        item.addEventListener('click', () => selectThread(key));
        listContainer.appendChild(item);
    });

    renderThreadPagination(threads.length);
}
function selectThread(key) {
    state.currentThreadKey = key;
    state.replyListPage = 1; // 每次都重置到回复第一页

    renderThreadList(); // 重新渲染列表以更新选中高亮状态
    renderThreadDetail();

    // ♥♥♥ 宝贝你看，这是移动端视图切换的魔法！ ♥♥♥
    document.getElementById('forum-body').classList.add('show-detail');
}
 

// 位置：替换掉旧的 renderThreadDetail() 函数

 // 位置：替换掉旧的 renderThreadDetail() 函数

function renderThreadDetail() {
    const detailContainer = document.getElementById('thread-detail-content');
    const threadKey = state.currentThreadKey;

    if (!threadKey || !forumData[threadKey]) {
        clearThreadDetail();
        return;
    }

    const thread = forumData[threadKey];
    const [title, author, , , time, content, , , likes] = thread.post;

    // ♥♥♥ 妈妈在这里为你添加了新的回复表单结构 ♥♥♥
    detailContainer.innerHTML = `
        <div class="main-post-and-replies">
            <div class="post-header">
                <button id="mobile-back-btn" class="page-btn" style="margin-bottom: 15px;">← 返回列表</button>
                <h1>${title}</h1>
                <div class="post-meta">
                    <div class="post-author-info">发布者: <span>${author}</span></div>
                    <div class="post-time">${time}</div>
                </div>
            </div>
            <div class="post-content">${content}</div>
            <div class="post-actions">
                <div class="like-btn" data-target-key="${threadKey}" data-type="post">
                    <svg class="like-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span class="like-count" data-post-likes><span class="like-count-value">${likes}</span></span>
                </div>
                <button class="reply-action-btn" data-type="post" data-target-key="${threadKey}">回复</button>
            </div>
            <div class="replies-section">
                <h3 class="replies-header">回复 (${thread.post[3]})</h3>
                <div class="reply-list" id="reply-list"></div>
                <div class="pagination-controls" id="reply-pagination"></div>
            </div>
        </div>
        <div class="reply-input-section">
            <form id="reply-form">
                <textarea id="reply-content-input" placeholder="回复..." required></textarea>
                <button type="submit" id="submit-reply-btn" class="new-post-btn">发送</button>
            </form>
        </div>
    `;

    // ♥♥♥ 为了让滚动更自然，妈妈把滚动区放到了这里 ♥♥♥
    document.querySelector('.main-post-and-replies').style.flexGrow = '1';
    document.querySelector('.main-post-and-replies').style.overflowY = 'auto';


    renderReplyList(); // 渲染回复列表和分页

    // 为新的元素绑定事件
    setupDetailViewEventListeners();
}

 function renderSidebar() {
    const sidebar = document.getElementById('forum-sidebar');
    sidebar.innerHTML = '';
    state.sections.forEach(section => {
        const btn = document.createElement('button');
        btn.className = 'section-btn';
        btn.textContent = section;
        btn.dataset.section = section;
        if (section === state.currentSection) {
            btn.classList.add('active');
        }
        // ♥♥♥ 妈妈把所有关于这个按钮的魔法都放在这里了 ♥♥♥
        btn.addEventListener('click', () => {
            state.currentSection = section;
            state.threadListPage = 1;
            state.currentThreadKey = null;

            // ♥♥♥ 修正了这里，确保在切换区块时，手机视图能正确返回列表页 ♥♥♥
            document.getElementById('forum-body').classList.remove('show-detail');

            // 重新渲染侧边栏和帖子列表
            renderSidebar();
            renderThreadList();
            clearThreadDetail();
        });
        sidebar.appendChild(btn);
    });
}

 // 位置：替换掉旧的 renderReplyList() 函数
function renderReplyList() {
    const replyContainer = document.getElementById('reply-list');
    const replyPagination = document.getElementById('reply-pagination');
    if (!replyContainer) return;

    replyContainer.innerHTML = '';
    const currentThreadData = forumData[state.currentThreadKey];
    const replies = currentThreadData.replies;
    const totalRepliesInPost = currentThreadData.post[3];
    const displayedRepliesCount = replies.length;

    const pageStart = (state.replyListPage - 1) * state.repliesPerPage;
    const pageEnd = pageStart + state.repliesPerPage;
    const pageReplies = replies.slice(pageStart, pageEnd);

    if (pageReplies.length === 0 && replies.length > 0) {
        state.replyListPage = 1;
        renderReplyList();
        return;
    }

    replyPagination.style.display = 'flex';
    pageReplies.forEach((reply) => {
        const [author, time, content, floor, likes, isDeleted] = reply;
        const replyIndex = replies.indexOf(reply); // 获取索引
        const item = document.createElement('div');
        item.className = 'reply-item';
        // ♥♥♥ 在这里，妈妈为你添加了回复按钮 ♥♥♥
        item.innerHTML = `
            <div class="reply-meta">
                <div><span class="reply-floor">#${floor}</span> <span class="reply-author">${author}</span></div>
                <span>${time}</span>
            </div>
            <p class="reply-content ${isDeleted ? 'deleted' : ''}">${isDeleted ? '[该回复已被删除]' : content}</p>
            <div class="post-actions" style="justify-content: flex-end; margin-top: 10px; gap: 15px;">
                 <button class="reply-action-btn" data-type="reply" data-target-key="${state.currentThreadKey}" data-reply-floor="${floor}">回复</button>
                <div class="like-btn" data-target-key="${state.currentThreadKey}" data-type="reply" data-reply-index="${replyIndex}">
                    <svg class="like-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span class="like-count"><span class="like-count-value">${likes}</span></span>
                </div>
            </div>
        `;
        replyContainer.appendChild(item);
    });

    if (totalRepliesInPost > displayedRepliesCount) {
        const omittedIndicator = document.createElement('div');
        omittedIndicator.className = 'replies-omitted-indicator';
        omittedIndicator.textContent = `...后续 ${totalRepliesInPost - displayedRepliesCount} 条回复已折叠...`;
        replyContainer.appendChild(omittedIndicator);
    }

    // 事件绑定会由 setupDetailViewEventListeners 统一处理
    renderReplyPagination(replies.length);
}


function clearThreadDetail() {
    document.getElementById('thread-detail-content').innerHTML = `
         <div class="detail-placeholder">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="color: var(--text-secondary-color); opacity: 0.5; margin-bottom: 10px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <p>选择一个帖子查看内容</p>
            </div>
        </div>`;
}

// --- 分页渲染 ---
function renderThreadPagination(total) { renderPagination(document.getElementById('thread-pagination'), total, state.threadListPage, state.threadsPerPage, (page) => { state.threadListPage = page; renderThreadList(); }); }
function renderReplyPagination(total) { renderPagination(document.getElementById('reply-pagination'), total, state.replyListPage, state.repliesPerPage, (page) => { state.replyListPage = page; renderReplyList(); }); }
function renderPagination(container, total, current, perPage, cb) {
    const totalPages = Math.ceil(total / perPage);
    if (totalPages <= 1) { container.innerHTML = ''; return; }
    container.innerHTML = `<button class="page-btn" ${current === 1 ? 'disabled' : ''}>«</button> <span id="page-info">${current}/${totalPages}</span> <button class="page-btn" ${current === totalPages ? 'disabled' : ''}>»</button>`;
    container.firstElementChild.addEventListener('click', () => cb(current - 1));
    container.lastElementChild.addEventListener('click', () => cb(current + 1));
}

// --- 交互功能 ---
function handleLikeClick(event) {
    const btn = event.currentTarget;
    if (btn.classList.contains('liked')) return;
    btn.classList.add('liked');
    btn.querySelector('.like-icon').style.fill = 'currentColor';
    const { targetKey, type, replyIndex } = btn.dataset;
    let countElement = btn.querySelector('.like-count-value');
    if (type === 'post') { forumData[targetKey].post[8]++; }
    else { forumData[targetKey].replies[replyIndex][4]++; }
    updateLikeCountWithAnimation(countElement, parseInt(countElement.textContent) + 1);
    const plusOne = document.createElement('div');
    plusOne.className = 'plus-one-anim';
    plusOne.textContent = '+1';
    btn.querySelector('.like-count').appendChild(plusOne);
    plusOne.addEventListener('animationend', () => plusOne.remove());
}
function updateLikeCountWithAnimation(element, newCount) { if (!element) return; element.textContent = newCount; }

function startAutoLike(postKey) {
    if (autoLikeIntervals.has(postKey)) clearInterval(autoLikeIntervals.get(postKey));
    const intervalId = setInterval(() => {
        const threadData = forumData[postKey];
        if (!threadData) { clearInterval(intervalId); autoLikeIntervals.delete(postKey); return; }
        const increment = Math.floor(Math.random()) + 2;
        threadData.post[8] += increment;
        if (postKey === state.currentThreadKey) {
            const likeCountEl = document.querySelector('[data-post-likes] .like-count-value');
            if (likeCountEl) updateLikeCountWithAnimation(likeCountEl, threadData.post[8]);
        }
    }, (Math.random() * 0.4 + 0.8) * 1000);
    autoLikeIntervals.set(postKey, intervalId);
}
// --- 发帖模态框 ---
const postModal = document.getElementById('post-modal');
const postForm = document.getElementById('post-form');

function openPostModal() { postForm.reset(); document.getElementById('modal-title').textContent = '发布新帖'; postModal.classList.add('active'); }
function closePostModal() { postModal.classList.remove('active'); }

function renderPostModalSections() {
    const select = document.getElementById('post-section');
    select.innerHTML = '';
    // ♥♥♥ 修正：只排除不允许用户发帖的区块 ♥♥♥
    state.sections.forEach(section => {
        if (section === "公告区") return; // 只禁止发公告
        const option = document.createElement('option');
        option.value = section;
        option.textContent = section;
        select.appendChild(option);
    });
}
// 位置：替换旧的 handlePostSubmit 函数
function handlePostSubmit(e) {
    e.preventDefault();
    const section = document.getElementById('post-section').value;
    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content-input').value.trim();

    if (!title || !content || !section) {
        alert("请填写所有必填项。");
        return;
    }

    if (forumData[title]) {
        alert("错误：已存在相同标题的帖子。");
        return;
    }

    // ♥♥♥ 调用新的核心函数来发送指令 ♥♥♥
    sendForumAction({
        type: 'new_post',
        section: section,
        title: title,
        content: content
    });

    closePostModal();
    // 提示用户操作已发送，等待后台处理
    // alert("发帖请求已发送，请稍候...（本地模拟将不会立即刷新）");
}
// ========== 4. 模拟数据和事件监听 ==========

function setupDetailViewEventListeners() {
    const detailContainer = document.getElementById('thread-detail-content');
    if (!detailContainer) return;

    // 绑定点赞事件
    detailContainer.querySelectorAll('.like-btn').forEach(btn => btn.addEventListener('click', handleLikeClick));

    // ♥♥♥ 绑定回复按钮点击事件 ♥♥♥
    detailContainer.querySelectorAll('.reply-action-btn').forEach(btn => btn.addEventListener('click', handleReplyButtonClick));

    // ♥♥♥ 绑定回复表单提交事件 ♥♥♥
    const replyForm = document.getElementById('reply-form');
    if (replyForm) {
        replyForm.addEventListener('submit', handleReplySubmit);
    }

    // ♥♥♥ 为移动端返回按钮添加点击事件 ♥♥♥
    const backBtn = document.getElementById('mobile-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.getElementById('forum-body').classList.remove('show-detail');
        });
    }
}

function handleReplyButtonClick(event) {
    const btn = event.currentTarget;
    const { type, targetKey, replyFloor } = btn.dataset;
    const replyInput = document.getElementById('reply-content-input');

    if (type === 'post') {
        state.replyingTo = { type: 'reply_post', targetKey: targetKey };
        replyInput.placeholder = `回复主楼...`;
    } else { // type === 'reply'
        state.replyingTo = { type: 'reply_to_reply', targetKey: targetKey, floor: replyFloor };
        replyInput.placeholder = `回复 #${replyFloor} 楼...`;
    }

    replyInput.focus();
}

function handleReplySubmit(event) {
    event.preventDefault();
    const replyInput = document.getElementById('reply-content-input');
    const content = replyInput.value.trim();

    if (!content) {
        alert("回复内容不能为空。");
        return;
    }

    if (!state.replyingTo) {
        // 默认回复主楼
        state.replyingTo = { type: 'reply_post', targetKey: state.currentThreadKey };
    }

    sendForumAction({
        ...state.replyingTo,
        content: content
    });

    replyInput.value = ''; // 清空输入框
    replyInput.placeholder = '回复...';
    state.replyingTo = null; // 重置回复目标

    // alert("回复请求已发送！（本地模拟不会立即刷新）");
}

async function mockGetChatMessage() { 
 const data = await getVariables({ type: 'message' });
           

    
    return  data; 


}

function setupEventListeners() {
    
    document.getElementById('new-post-btn').addEventListener('click', openPostModal);
    document.getElementById('modal-close-btn').addEventListener('click', closePostModal);
    postModal.addEventListener('click', (e) => { if (e.target === postModal) closePostModal(); });
    postForm.addEventListener('submit', handlePostSubmit);
}
 


    // ——————————————————————————————————————论坛结束——————————————————————————

    // ——————————————————————————————————————总结开始——————————————————————————

    
async function runTaskSummary(content) {
 


            function parseTag(raw, tagName) {
                const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i');
                const match = raw.match(regex);
                return match ? match[1].trim() : '';
            }

            const taskInfo = parseTag(content, '任务信息');
            const teamEvaluation = parseTag(content, '团队评价');
            const personalSettlementsRaw = content.match(/<队员>[\s\S]*?<\/队员>/g) || [];

            const data = {
                task: {
                    name: parseTag(taskInfo, '任务名称'),
                    background: parseTag(taskInfo, '世界背景'),
                    mainObjective: parseTag(taskInfo, '主线任务'),
                    sideObjectives: parseTag(taskInfo, '支线任务'),
                },
                team: {
                    rating: parseTag(teamEvaluation, '总体评级'),
                    review: parseTag(teamEvaluation, '评语'),
                },
                players: personalSettlementsRaw.map(p => ({
                    name: parseTag(p, '姓名'),
                    rating: parseTag(p, '个人评级'),
                    contributions: parseTag(p, '核心贡献').split('\n').map(c => c.replace(/^- /, '').trim()).filter(c => c),
                    comment: parseTag(p, `评语`),
                    rewards: {
                        points: parseTag(parseTag(p, '奖励明细'), 'currency'),
                        plots: parseTag(parseTag(p, '奖励明细'), 'plot'),
                        xp: parseTag(parseTag(p, '奖励明细'), 'exp'),
                    }
                }))
            };

            // HTML生成
            const root = document.getElementById('summary-root');
            let html = `
                <header>
                    <h1>任务结算报告</h1>
                </header>
                <div class="content-wrapper">
                    <nav class="tabs-nav">
                        <button class="tab-button active" data-tab="task_info">任务总览</button>
                        <button class="tab-button" data-tab="team_eval">团队评价</button>`;

            data.players.forEach((player, index) => {
                html += `<button class="tab-button" data-tab="player_${index}">${player.name}</button>`;
            });

            html += `</nav>
                     <div class="tab-content-container">`;

            // 任务总览面板
            html += `
                <div id="task_info" class="tab-pane active">
                    <h2>任务详情</h2>
                    <div class="info-grid">
                        <strong>任务名称</strong><span>${data.task.name || '未提供'}</span>
                        <strong>世界背景</strong><span>${data.task.background || '未提供'}</span>
                    </div>
                    <h2>主线任务</h2>
                    <p>${data.task.mainObjective || '暂无详细描述。'}</p>
                    <h2>支线任务</h2>
                    <p>${data.task.sideObjectives.replace(/\n/g, '<br>') || '暂无详细描述。'}</p>
                </div>`;

            // 团队评价面板
            html += `
                <div id="team_eval" class="tab-pane">
                    <h2>团队总体评价</h2>
                    <div class="info-grid">
                        <strong>总体评级</strong><span class="rating">${data.team.rating || '未评级'}</span>
                    </div>
                    <h2>评语</h2>
                    <p>${data.team.review || '暂无评语。'}</p>
                </div>`;

            // 个人结算面板
            data.players.forEach((player, index) => {
                html += `
                    <div id="player_${index}" class="tab-pane">
                        <h2>${player.name} - 个人结算</h2>
                        <div class="info-grid">
                            <strong>个人评级</strong><span class="rating">${player.rating || '未评级'}</span>
                        </div>
                        <h2>核心贡献</h2>
                        <ul>${player.contributions.length > 0 ? player.contributions.map(c => `<li>${c}</li>`).join('') : '<li>无特别记录的贡献。</li>'}</ul>
                       <h2>${currentTheme.player}评语</h2>
                        <p>${player.comment || '暂无评语。'}</p>
                        <h2>奖励明细</h2>
                         <div class="info-grid">
                           <strong>${currentTheme.currency}</strong><span>${player.rewards.points || '0'}</span>
                           <strong>${currentTheme.plot}</strong><span>${player.rewards.plots || '无'}</span>
                           <strong>${currentTheme.exp}</strong><span>${player.rewards.xp || '0'}</span>
                        </div>
                    </div>`;
            });

            html += `</div></div>`;
            root.innerHTML = html;

            // Tab切换逻辑
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabPanes = document.querySelectorAll('.tab-pane');

            function switchTab(targetTabId) {
                const targetTabButton = document.querySelector(`.tab-button[data-tab="${targetTabId}"]`);
                const targetPane = document.getElementById(targetTabId);

                if (!targetTabButton || !targetPane) return;

                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (window.innerWidth <= 768) {
                        pane.style.display = 'none';
                    }
                });

                targetTabButton.classList.add('active');
                targetPane.classList.add('active');
                if (window.innerWidth <= 768) {
                    targetPane.style.display = 'block';
                }
            }


            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                   switchTab(button.dataset.tab);
                });
            });

            // 初始化时手动隐藏非激活的移动端tab-pane
            if(window.innerWidth <= 768) {
                 const initialActiveTab = document.querySelector('.tab-pane.active');
                 tabPanes.forEach(pane => {
                    pane.style.display = (pane === initialActiveTab) ? 'block' : 'none';
                 });
            }

            // 监听窗口大小变化以适配切换逻辑
            let isMobile = window.innerWidth <= 768;
            window.addEventListener('resize', () => {
                const newIsMobile = window.innerWidth <= 768;
                if(newIsMobile !== isMobile){
                    isMobile = newIsMobile;
                    const activePane = document.querySelector('.tab-pane.active');
                    tabPanes.forEach(pane => {
                        if(isMobile) {
                            pane.style.display = (pane === activePane) ? 'block' : 'none';
                        } else {
                             pane.style.display = '';
                        }
                    });
                }
            });
  };

  (async () => {
    // 我们的城堡结构，一切如初
 const chatHistoryDiv = document.getElementById('chat-display-area'); // 我们现在使用新的显示区域
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
        const rerollButton = document.getElementById('reroll-button'); // ☆ 新成员：重写按钮
    const contextMenu = document.getElementById('context-menu');   // ☆ 新成员：右键菜单
   let worldBookName = "小蝌蚪找妈妈-同层版";
  
   let lastTurnVariables = {}; // ☆ 新增：用于缓存上一轮的变量

// ☆ 新增函数：安全地获取配置值
function getChatConfig(key, defaultValue) {
    try {
        const chatVars = getVariables({ type: 'message' });
        // 使用 _.get 可以安全地访问深层嵌套的属性，如果路径不存在，则返回 undefined
        // 这比 chatVars.assa_data.config[key] 更安全
        const value = _.get(chatVars, `assa_data.config.${key}`);
        return value !== undefined ? value : defaultValue;
    } catch (e) {
        console.warn(`获取聊天配置 "${key}" 失败，使用默认值: ${defaultValue}`, e);
        return defaultValue;
    }
}

   // ☆ 新增函数：显示右键菜单 (V2.1 究极稳定版)
   function showContextMenu(event, index, bubbleElement) {
        event.preventDefault();

        const menu = document.getElementById('context-menu');
        if (!menu) return;

        // 定义一个函数，专门用来移除我们添加的监听器，保持代码整洁
        const removeGlobalListeners = () => {
            document.removeEventListener('click', hideMenuOnClickOutside);
            document.removeEventListener('contextmenu', hideMenuOnClickOutside);
        };

        // 定义当点击菜单外部时需要执行的操作
        const hideMenuOnClickOutside = (e) => {
            if (!menu.contains(e.target)) {
                menu.style.display = 'none';
                removeGlobalListeners(); // 任务完成，移除监听器
            }
        };

        // 为菜单项（编辑、删除）分配点击事件
        const editItem = menu.querySelector('[data-action="edit"]');
        const deleteItem = menu.querySelector('[data-action="delete"]');

        if (editItem) {
editItem.onclick = () => {
    menu.style.display = 'none';
    removeGlobalListeners();
    editMessage(index, bubbleElement); // 把接收到的 bubbleElement 传递给 editMessage
};
        }

        if (deleteItem) {
            deleteItem.onclick = () => {
                menu.style.display = 'none';
                removeGlobalListeners(); // 关键：在执行操作前，主动移除监听器
                deleteMessage(index);
            };
        }

        // 显示菜单并设置位置
        menu.style.display = 'block';
        menu.style.left = `${event.pageX}px`;
        menu.style.top = `${event.pageY}px`;

        // 使用一个微小的延迟来添加全局监听器，防止本次点击立即关闭菜单
        setTimeout(() => {
            document.addEventListener('click', hideMenuOnClickOutside);
            document.addEventListener('contextmenu', hideMenuOnClickOutside);
        }, 0);
    }

     // ☆ 新增函数：删除消息 (V2.0 绝对安全版)
    async function deleteMessage(index) {
        // 我们通过“过滤”来创建一个全新的历史记录数组，
        // 它包含除了被删除索引之外的所有消息。
        // 这是最安全的方法，可以从根本上避免意外地清空所有内容。
        conversationHistory = conversationHistory.filter((message, i) => i !== index);

        // 接下来的步骤和以前一样，都是安全的。
        renderHistory();
        await saveHistory();
        updateRerollButtonState();
    }
function editMessage(index, bubbleElement) {
 
    const messageToEdit = conversationHistory[index];

    if (!bubbleElement || bubbleElement.classList.contains('editing')) {
        console.warn("无法编辑：消息气泡不存在或已处于编辑模式。");
        return;
    }

    // 保存原始内容以便取消，直接从数据源获取，最可靠
    const originalContentText = messageToEdit.content;
    bubbleElement.innerHTML = ''; // 清空旧内容
    bubbleElement.classList.add('editing');

    const textarea = document.createElement('textarea');
    textarea.className = 'editing-textarea';
    textarea.value = originalContentText;

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'editing-controls';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '保存';
    saveBtn.className = 'editing-btn save';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.className = 'editing-btn cancel';

    saveBtn.onclick = async () => {
        const newText = textarea.value.trim();
        // 只有当内容真的被修改时才进行保存和刷新，避免不必要的操作
        if (newText && newText !== originalContentText) {
            conversationHistory[index].content = newText;
            await saveHistory();
        }
        // 无论如何都重新渲染，以退出编辑模式
        renderHistory();
    };

    cancelBtn.onclick = () => {
        // 取消编辑时，最简单可靠的方法就是重新渲染整个历史记录
        renderHistory();
    };

    controlsDiv.appendChild(cancelBtn);
    controlsDiv.appendChild(saveBtn);

    bubbleElement.appendChild(textarea);
    bubbleElement.appendChild(controlsDiv);

    textarea.focus();
    // 确保编辑框总是在视野内，方便操作
   // textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
 
async function renderHistory() {
       
      
        const initContainer = document.getElementById('initialization-container');
  
        if (conversationHistory.length === 0) {
            // 如果历史记录是空的，就展示我们的“序章”
            if (initContainer) initContainer.style.display = 'block';
            if (mainWrapper) mainWrapper.style.display = 'none';

        // 我们检查一下，如果这位仆人还没有被召唤过，就召唤它。
        if (typeof window.initializationDone === 'undefined') {
            await runInitializationMagic(); // 温柔地等待它完成工作
            window.initializationDone = true; // 在它额头盖上一个“已完成”的印记
        }
 
            // 别忘了调用初始化脚本里的函数，让它动起来
            if (typeof applyVersionTheme === 'function') {
                const identitySelect = document.getElementById('user-identity');
                applyVersionTheme(1, identitySelect); // 使用默认版本1来初始化
            }
            return; // 直接返回，不执行下面的渲染逻辑
        } else {
            // 否则，就隐藏“序章”，展示主界面
            if (initContainer) initContainer.style.display = 'none';
            // main-wrapper 的 display 属性可能需要根据你的布局设为 'block' 或 'flex'
            if (mainWrapper) mainWrapper.style.display = 'flex';
        }
       

    const dynamicContentArea = document.getElementById('dynamic-content-area');

    // 我们不再清空 dynamicContentArea，而是隐藏所有模块，但保留论坛模块不动
    if (dynamicContentArea) {
        Array.from(dynamicContentArea.children).forEach(child => {
            
            if (child.id !== 'forum-modal-container') {
                child.style.display = 'none';
            }
        });
    }

    const chatDisplayArea = document.getElementById('chat-display-area');
    chatDisplayArea.innerHTML = '';

    const hideLatestCount = getChatConfig('hide_latest_count', 5)*2;
    const startIndex = Math.max(0, conversationHistory.length - hideLatestCount);
    const messagesToDisplay = conversationHistory.slice(startIndex);


    messagesToDisplay.forEach((msg, relativeIndex) => {
        const originalIndex = startIndex + relativeIndex;
 

        const bubble = document.createElement('div');
        bubble.classList.add('message-bubble');
        bubble.classList.add(msg.role === 'user' ? 'user-message' : 'assistant-message');
 
      // ✨ 妈妈在这里施展了一个全新的、更精妙的融合魔法 ✨

        let processedContent = msg.content;
        const htmlPlaceholders = {};
        let placeholderIndex = 0;

       

        // 步骤2：对剩余的普通文本进行我们原来的所有处理
        const pureContent = processedContent
            .replace(/<thinking>[\s\S]*?<\/thinking>/gs, '')
            .replace(/<forum_threads>[\s\S]*?<\/forum_threads>/gs, '')
            .replace(/<shop_item>([\s\S]*?)<\/shop_item>/gs, '')
            .replace(/<表现总结>([\s\S]*?)<\/表现总结>/gs, '');


        // 魔法第二层：然后，我们再将处理过的HTML交给更强大的 formatAsTavernRegexedString 来应用酒馆正则和深度规则
        const depth = Math.floor((conversationHistory.length - 1 - originalIndex) / 2);
        let renderedHtml = formatAsTavernRegexedString(
            pureContent,
            msg.role === 'user' ? 'user_input' : 'ai_output',
            'display',
            { depth: depth }
        );

         // 步骤1：捞出所有“画卷”（HTML内容）并用占位符替换
        renderedHtml = renderedHtml.replace(/<html>([\s\S]*?)<\/html>/gs, (match, htmlBlock) => {
            const placeholder = `HTMLCONTENTPLACEHOLDER${placeholderIndex}`;

            let rawHtml = htmlBlock;
            const styleMatch = /<style>([\s\S]*?)<\/style>/s.exec(rawHtml);

            if (styleMatch) {
                const styleContent = styleMatch[1];
                const styleId = `custom-style-${originalIndex}-${placeholderIndex}`;
                if (!document.getElementById(styleId)) {
                    const styleElement = document.createElement('style');
                    styleElement.id = styleId;
                    styleElement.textContent = styleContent;
                    document.head.appendChild(styleElement);
                }
                rawHtml = rawHtml.replace(styleMatch[0], '');
            }

            htmlPlaceholders[placeholder] = rawHtml;
            placeholderIndex++;
            return placeholder;
        });

            
             const protectedContent = renderedHtml
            .replace(/“/g, 'NOVA_LQ')
            .replace(/”/g, 'NOVA_RQ')
            .replace(/「/g, 'NOVA_LA')
            .replace(/」/g, 'NOVA_RA')
        
            .replace(/\n/g, 'NOVA_BR'); // 看，我们把每个换行符都变成了秘密记号！
            
        let baseHtml = formatAsDisplayedMessage(protectedContent);


        // 我们不再需要手动替换引号了，因为 formatAsDisplayedMessage 已经帮我们做好了类似的事情
        const textWithQuotes = baseHtml  
        .replace(/NOVA_LQ/g, '<span class="dialogue-quote">“')
            .replace(/NOVA_RQ/g, '”</span>')
            .replace(/NOVA_LA/g, '<span class="dialogue-quote">「')
            .replace(/NOVA_RA/g, '」</span>')
            
            .replace(/NOVA_BR/g, '<br>');

        // 步骤3：将处理好的“画卷”放回原位，替换掉占位符
        let finalContent = textWithQuotes;
        for (const placeholder in htmlPlaceholders) {
            finalContent = finalContent.replace(placeholder, htmlPlaceholders[placeholder]);
        }

          // ⭐ --- 这是我们新的魔法结界！ --- ⭐

    // 1. “寻咒”：我们先来寻找藏在finalContent里的魔法咒语
    const scriptRegex = /<script>([\s\S]*?)<\/script>/i; // 寻找咒语的魔法阵
    const scriptMatch = finalContent.match(scriptRegex);
    let scriptContent = null;

    if (scriptMatch && scriptMatch[1]) {
        // 如果找到了，就把咒语内容小心翼翼地取出来
        scriptContent = scriptMatch[1];
        // 然后把咒语本身从要显示的画卷中抹去，以免它造成意外的干扰
        finalContent = finalContent.replace(scriptRegex, '');
    }

    // 2. 把处理好的、不含咒语的完美画卷放进气泡里
    bubble.innerHTML = finalContent;

    bubble.addEventListener('contextmenu', (event) => showContextMenu(event, originalIndex, bubble));
    chatDisplayArea.appendChild(bubble);

    // 3. “咏唱”：如果刚刚我们找到了咒语，现在就是让它生效的时刻！
    if (scriptContent) {
        // 我们创造一张全新的、干净的“魔法卷轴”（一个新的<script>元素）
        const newScript = document.createElement('script');

        // 将我们的咒语誊写到卷轴上
        newScript.textContent = scriptContent;

        // 然后，我们将这张卷轴添加到我们的世界中（比如文档的body部分）
        // 浏览器看到这张新卷轴时，就会立刻明白并执行上面的咒语了
        document.body.appendChild(newScript);

        // 这就像一次性的奇迹，施展完毕后，为了保持世界的洁净，我们就将这张卷轴销毁
        //（当然，咒语的效果已经留下了哦）
        document.body.removeChild(newScript);
    }
});

        
    // chatDisplayArea.scrollTop = chatDisplayArea.scrollHeight;


    const lastMessage = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : null;

    if (lastMessage && lastMessage.role === 'assistant' && dynamicContentArea) {
        const content = lastMessage.content;

        // --- 调度“选项区” 
        const optionsMatch = /<options>([\s\S]*?)<\/options>/gs.exec(content.replace(/<thinking>[\s\S]*?<\/thinking>/gs, ''));
        if (optionsMatch && optionsMatch[1]) {
            const optionsContainer = document.getElementById('options-module-container');
            if (optionsContainer) {
                optionsContainer.style.display = 'block';
                if(typeof setupUI === 'function') {
                    setupUI(optionsMatch[1]);
                }
            }
        }

        // --- 全新的“论坛”处理逻辑 ---
        const forumMatch = /<forum_threads>[\s\S]*?<\/forum_threads>/gs.exec(content);
        if (forumMatch && forumMatch[1]) {
            // 我们不再显示论坛，而是让小球闪烁
            const forumOrb = document.getElementById('forum-orb-button');
            if (forumOrb) {
                forumOrb.classList.add('orb-flash');
                // 动画结束后移除类，以便下次可以再次触发
                forumOrb.addEventListener('animationend', () => {
                    forumOrb.classList.remove('orb-flash');
                }, { once: true });
            }
            // 论坛数据已经通过 handleSend 被存入历史记录，这里无需再做操作。
        }

  
        const summaryMatch = /<表现总结>([\s\S]*?)<\/表现总结>/gs.exec(content);
        if (summaryMatch && summaryMatch[1]) {
             
            const summaryOrb = document.getElementById('task-summary-orb-button');
            if (summaryOrb) {
                summaryOrb.classList.add('orb-flash');
          
                summaryOrb.addEventListener('animationend', () => {
                    summaryOrb.classList.remove('orb-flash');
                }, { once: true });
            }
 
        }

        const shopMatch =/<shop_item>([\s\S]*?)<\/shop_item>/gs.exec(content.replace(/<thinking>[\s\S]*?<\/thinking>/gs, ''));
        if (shopMatch && shopMatch[1]) { 
            const shopOrb = document.getElementById('shop-wrapper-orb');
            if (shopOrb) {
                shopOrb.classList.add('orb-flash');
      //console.log("item:",shopMatch[1]);
      const cleanedData = shopMatch[1].trim(); // 去除首尾空格和换行
         // 第2步：检查文本是否已经是一个合法的JSON数组格式
        if (!cleanedData.startsWith('[')) {
            // 如果不是，我们才手动为它加上外层的括号
            cleanedData = `[${cleanedData}]`;
        }

        // 第3步：直接尝试解析处理后的文本
        const parsedData = JSON.parse(cleanedData);

        
        const newItems = Array.isArray(parsedData[0]) ? parsedData : [parsedData];

        if (!Array.isArray(newItems) || newItems.length === 0) {
             showModal('shop-modal', '解析失败', 'AI返回了空内容或无效格式。');
             return;
        }

        // 替换现有随机商店物品
        randomItems = newItems;
        // 将新生成的物品存入 localStorage
        localStorage.setItem('randomShopItems', JSON.stringify(randomItems));
       renderShopSection('random');
                shopOrb.addEventListener('animationend', () => {
                    shopOrb.classList.remove('orb-flash');
                }, { once: true });
            }
 
        }

 
     
    const eventContainer = document.getElementById('event-tracker-container');
    if (eventContainer) {
        eventContainer.innerHTML = '';
    }
    //   清理完毕  
             handleUpdateNotifications(content);
    }
     
             setTimeout(() => {
        console.log("正在为您静默刷新数据...");
        initDisplay();
    }, 5000);
}

function updateRerollButtonState(){
       
          if(conversationHistory.length > 0 ){
        // if(conversationHistory.length > 0 && conversationHistory[conversationHistory.length-1].role === 'assistant'){
            rerollButton.disabled = false;
        } else {
            rerollButton.disabled = true;
        }
    }

// initialize 函数保持不变
    async function initialize() {

            // 💖 妈妈在这里设置了信号接收器 💖
    try {
        eventOn('nova:coreReady', () => {
            //console.log("[HTML] 💖 收到了！与世界核心的心灵感应已连接！");
            // 你甚至可以在这里加一个漂亮的成功提示
            toastr.success('世界核心连接成功！', '连接状态');
        });
    } catch(e) {
        console.error("[HTML] 设置 'nova:coreReady' 监听器失败。", e);
    }

        try {
            const messageZero =  await getVariables({ type: 'message' });
            if (messageZero && Array.isArray(messageZero.zeroLevelHistory)) {
                conversationHistory = messageZero.zeroLevelHistory;
                // 初始化时也缓存一下变量，以备初次重写
 
            } else {
                conversationHistory = [];
                await saveHistory();
            }
        } catch (error) {
            //console.log("初始化失败，我们将开始新的对话。", error);
            conversationHistory = [];
            await saveHistory();
        }
        renderHistory();
        updateRerollButtonState(); // ☆ 初始化时更新按钮状态
    }

 // 假设 conversationHistory 和 lastTurnVariables 是在函数外部可以访问到的当前状态变量

async function saveHistory() {
    try {
         
        const zeroLevelMessage = await getChatMessages(0);

        // 如果楼层不存在，这是一个异常情况，我们应该停止操作
        if (!zeroLevelMessage) {
            console.error("错误：无法找到第 0 楼层消息，保存操作已中断。");
            return;
        }
 


        // ☆ 步骤 2: 使用 updateVariablesWith 分别更新 chat 和 message 变量域
        // 这个函数是处理这类问题的最佳实践，因为它保证了原子性。

        // 更新 chat 作用域的变量
        await updateVariablesWith(old_variables => {
            // 在回调函数中，我们返回一个全新的对象。
            // ...old_variables 继承了所有旧变量，
            // 而 zeroLevelHistory: conversationHistory 则会覆盖或添加我们需要的字段。
            // 这种模式同样能够完美处理历史记录的增删改。
            return {
                ...old_variables,
                zeroLevelHistory: conversationHistory,
            };
        }, { type: 'chat' });

        // 更新 message 作用域 (针对第 0 楼层) 的变量
        await updateVariablesWith(old_variables => {
            return {
                ...old_variables,
                zeroLevelHistory: conversationHistory,
            };
        }, { type: 'message', message_id: 0 });

        // console.log("历史记录已成功且安全地更新到 chatmessage(0).data、chat 变量域和 message(0) 变量域中。");

    } catch (e) {
        // 捕获并打印任何可能发生的错误
        console.error("保存历史记录过程中发生意外错误:", e);
    }


}

async function handleReroll() {
    if (rerollButton.disabled) return;

    // 只移除最后的AI回复
    // 我们检查最后一条消息是否是AI的，如果是，就移除它
    if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === 'assistant') {
        conversationHistory.pop(); // pop() 方法会移除并返回数组的最后一个元素，非常适合这个场景
    }

    const isValid = (data) => {
            // 检查是否为 null 或 undefined
            if (data === null || data === undefined) {
                return false;
            }
            
            // 如果是对象类型，检查是否有内容
            if (typeof data === 'object' && data !== null) {
                // 如果是数组，检查长度
                if (Array.isArray(data)) {
                    return data.length > 0;
                }
                // 如果是普通对象，检查是否有属性
                return Object.keys(data).length > 0;
            }
            
            // 其他类型（字符串、数字、布尔值等）只要不是 null/undefined 就认为有效
            return true;
        };
        
 

if(isValid(lastTurnVariables)){
 // 恢复变量
    try {
        await replaceVariables(lastTurnVariables);
        await replaceVariables(lastTurnVariables,{ type: 'message' });
        await replaceVariables(lastTurnVariables,{ type: 'chat' });
        console.log("变量已回滚至上一轮状态。");
    } catch(e) {
        console.error("变量回滚失败:", e);
    }
}else{
    console.log("lastTurnVariables没内容吧？");
}
   

    // 重新触发生成
    await handleSend(true); // 传入一个标记，表示这是重写操作
}
 
async function showRollResultCard(rollData) {
    if (!rollData || !rollData.check_type) {
         console.log("没有有效的投掷数据来显示看板。");
        return;
    }

    
            await updateVariablesWith(old_variables => {
            // 在回调函数中，我们返回一个全新的对象。
            // ...old_variables 继承了所有旧变量，
            // 而 zeroLevelHistory: conversationHistory 则会覆盖或添加我们需要的字段。
            // 这种模式同样能够完美处理历史记录的增删改。
            return {
                ...old_variables,
                "检定记忆":rollData,
            };
        }, { type: 'message' });

   
 checkMemoryData = rollData;
const playerName = currentGameData.user_character.name || '阿萨';  // 添加这行
    const container = document.getElementById('roll-result-card-container');
    if (!container) return;
 

 
  // --- 辅助函数：生成一串投骰结果的HTML，这就是你想要的'1 1 5 6 8'格式 ---
const generateDiceHTML = (rollsArray) => {
    if (!rollsArray || rollsArray.length === 0) return '<span style="color:var(--text-secondary-color); font-style:italic;">无投掷</span>';
    return rollsArray.map((roll, index) =>
        `<span class="dice-number ${getDiceClass(roll)}" style="animation-delay: ${index * 0.15}s">${roll}</span>`
    ).join(' , ');
};

    // --- 数据提取与处理 ---
    const isCombat = rollData.check_type === '战斗对抗';
    const outcomeLevel = rollData.outcome.level;
    const outcomeDesc = rollData.outcome.description;
    const performanceDesc = rollData.performance.result.description;

    let playerRolls, enemyRolls, playerSuccess, enemySuccess, damage;

    if (isCombat) {
        // 从 player_check 对象中精确提取投掷和成功数
        playerRolls = rollData.player_check.roll_result.rolls;
        playerSuccess = rollData.player_check.final_successes;
        // 从 enemy_check 对象中精确提取
        enemyRolls = rollData.enemy_check.roll_result.rolls;
        enemySuccess = rollData.enemy_check.final_successes;
        // 提取伤害
        damage = rollData.damage_calculation.final_damage;
    } else { // 非战斗情况
        playerRolls = rollData.roll_result.rolls;
        playerSuccess = rollData.final_successes;
        // 非战斗时，这些值为null
        enemyRolls = null;
        enemySuccess = null;
        damage = null;
    }

   // --- 构建HTML内容 ---
let diceAreaHTML = `
    <div class="roll-card-dice-section">
        <span class="label">${isCombat ? '我方' : ''}成功数: <strong>${playerSuccess}</strong></span>
        <div class="dice-results-wrapper">${generateDiceHTML(playerRolls)}</div>
    </div>
`;

if (isCombat) {
    diceAreaHTML += `
        <div class="roll-card-dice-section">
            <span class="label">敌方成功数: <strong>${enemySuccess}</strong></span>
            <div class="dice-results-wrapper">${generateDiceHTML(enemyRolls)}</div>
        </div>
    `;
}

let damageHTML = (isCombat && damage > 0) ? `<div class="roll-card-damage">受到伤害: ${damage}</div>` : '';

// 根据 outcomeLevel 添加对应的类
const outcomeClass = {
    '大失败': 'critical-failure',
    '失败': 'failure',
    '勉强成功': 'partial-success',
    '成功': 'success',
    '辉煌成功': 'glorious-success'
}[outcomeLevel] || '';

const cardHTML = `
    <div class="roll-card-content">
        <div class="roll-card-header">${isCombat ? '战斗对抗' : '日常检定'}</div>
        <div class="roll-card-dice-area">${diceAreaHTML}</div>
        <div class="roll-card-divider"></div>
        <div class="roll-card-result-area">
            <div class="roll-card-outcome ${outcomeClass}">${outcomeLevel}</div>
            <div class="roll-card-description">"${outcomeDesc}"</div>
            <div class="roll-card-description" style="margin-top: 5px; opacity: 0.8;">${performanceDesc}</div>
            ${damageHTML}
        </div>
    </div>
`;

    container.innerHTML = cardHTML;

    // --- 应用特殊效果与关闭逻辑 (此部分无需修改) ---
    container.className = 'roll-result-card-container';
    if (outcomeLevel.includes('大失败')) {
        container.classList.add('shattered');
    } else if (outcomeLevel === '辉煌成功') {
        container.classList.add('glorious');
    }

    container.style.display = 'block';
    setTimeout(() => {
        container.classList.add('show');
    }, 10);

    const closeCard = () => {
        container.classList.remove('show');
        setTimeout(() => {
            if (!container.classList.contains('show')) {
               container.style.display = 'none';
            }
        }, 500);
        document.removeEventListener('click', handleClickOutside, true);
    };

    // if (container.classList.contains('shattered')) {
    //     setTimeout(closeCard, 850);
    // }

    const handleClickOutside = (event) => {
        if (container.contains(event.target)) return;
        // const assistantBubbles = document.querySelectorAll('.assistant-message');
        // const lastAssistantBubble = assistantBubbles[assistantBubbles.length -1];
        // if (lastAssistantBubble && lastAssistantBubble.contains(event.target)) return;
        closeCard();
    };

    setTimeout(() => {
        document.addEventListener('click', handleClickOutside, true);
    }, 0);
}


function getDiceClass(diceCount) {
    if (diceCount === 1) return 'dice-low';
    if (diceCount >= 10) return 'dice-crit';
    if (diceCount >= 7) return 'dice-high';
    return '';
}
         let aiMessage = {};

    async function handleSend(isReroll = false) {

        if (typeof localStorage.isNovaCoreReady === 'undefined' || localStorage.isNovaCoreReady === false) {
            toastr.warning('世界核心正在初始化，请稍等片刻再发送消息。', '请稍候');
            console.warn("[HTML] 发送被阻止：世界核心尚未就绪 (window.isNovaCoreReady 为 false 或不存在)。");
            return; // 直接中断发送，防止事件丢失
        }
 
         // 【新代码开始】世界书完整性检查
    const worldBookName = '小蝌蚪找妈妈-同层版';
    const validationEntryId = 14;

    try {
 
        // [修正处] 这里使用了正确的getWorldbook函数
        const worldInfo = await getWorldbook(worldBookName);
        if (worldInfo && worldInfo.length > 0) { // 确保世界书存在且不为空
            const validationEntry = worldInfo.find(entry => entry.uid === validationEntryId);

            // 如果验证条目不存在，或者其内容不是以 EJS 标签开头，则判定为异常
            if (!validationEntry || validationEntry.content.trim().startsWith('<ready>')) {
                toastr.error('世界书核心检测到异常，正在尝试从备份自动修复。', '紧急修复');
                console.error(`[Nova's Integrity Check] 验证失败！ID ${validationEntryId} 的条目不存在或内容非预期格式。${validationEntry.content}`);

                const backupKey = 'worldbook_backup_' + worldBookName;
                const backupData = localStorage.getItem(backupKey);

                if (backupData) {
                    try {
                        const originalWorldInfo = JSON.parse(backupData);
                        // [修正处] 注意：恢复世界书的函数在你的代码里是 setLorebookEntries，这里保持不变
                        await setLorebookEntries(worldBookName, originalWorldInfo);
                        toastr.success('世界书已从备份中恢复。请重新发送您的消息。', '修复成功');
                        console.log(`[Nova's Integrity Check] 已从localStorage备份成功恢复世界书 "${worldBookName}"。`);

                        // 成功恢复后，清除脏标记，确保启动检查不会误判
                        localStorage.removeItem('worldbook_is_dirty_' + worldBookName);

                        return; // 中断本次发送，等待用户重新操作
                    } catch (e) {
                        console.error(`[Nova's Integrity Check] 严重错误：尝试从localStorage恢复世界书 "${worldBookName}" 时失败!`, e);
                        toastr.error('自动修复失败！为防止数据损坏，请刷新页面或手动检查世界书。', '严重错误');
                        return; // 中断发送
                    }
                } else {
                    console.error(`[Nova's Integrity Check] 严重错误：世界书异常，但找不到可用的备份数据！`);
                    // toastr.error('世界书可能已损坏且无法自动恢复，因为备份丢失。请手动修复！', '严重错误');
                    // return; // 中断发送
                }
            }else{
         console.log(`[Nova's Integrity Check] 验证成功！ID ${validationEntryId} 的条目是：${validationEntry.content}`);

        }
        }
    } catch (error) {
        console.error("[Nova's Integrity Check] 检查世界书状态时发生意外错误:", error);
        toastr.warning('无法完成世界书状态验证，请稍后再试。', '检查失败');
        return; // 中断发送
    }
    // 【新代码结束】

        let userText;
         
        let rollCardShownThisTurn = false;
          // 在发送前，检查指令队列是否有内容
        if (!isReroll && assaCommandQueue && assaCommandQueue.trim() !== '') {
        let cleanCommand = assaCommandQueue.trim();
 
        // 检查字符串是否以引号开头和结尾，如果是，就将它们剥离！
        if (cleanCommand.startsWith('"') && cleanCommand.endsWith('"')) {
            cleanCommand = cleanCommand.slice(1, -1);
            //console.log("检测到并移除了包裹指令的引号。");
        }

       
        userInput.value = cleanCommand + userInput.value;

        // 发送后，清空队列和本地存储，确保指令只发送一次
        assaCommandQueue = '';
        localStorage.removeItem('assaCommandQueue');
    }
 
        if (!isReroll) {
            userText = userInput.value.trim();
        } else {
            // 如果是重写，我们从历史记录里找到上一条用户消息
            const lastUserMessage = conversationHistory.filter(m => m.role === 'user').pop();
            userText = lastUserMessage ? lastUserMessage.content : '';
        }

        if (!isReroll) {
            if (!userText || sendButton.disabled) return;
            const userMessage = { role: 'user', content: userText };

            // ☆ 缓存当前变量状态，在发送之前
            try {
                lastTurnVariables = getVariables();
                 console.info("缓存变量成功");
            } catch (e) {
                console.error("缓存变量失败：", e);
                lastTurnVariables = {};
            }

            conversationHistory.push(userMessage);
            renderHistory();
            userInput.value = '';
             
          try {
    console.log(`[HTML] 正在通过官方信使 eventEmit 发送 'assa:userMessage' 信号。`);
    eventEmit('assa:userMessage', { ...userMessage });
    
    // 等待事件处理完成
    await new Promise((resolve) => {
        const completionHandler = () => {
            eventRemoveListener('assa:userMessageComplete', completionHandler);
            resolve();
        };
        eventOn('assa:userMessageComplete', completionHandler);
        
        // 设置超时防止无限等待（可选）
        setTimeout(() => {
            eventRemoveListener('assa:userMessageComplete', completionHandler);
            console.warn("[HTML] assa:userMessage 事件处理超时，继续执行");
            resolve();
        }, 5000); // 5秒超时
    });
} catch (error) {
    console.error("[HTML] 警告：调用官方信使 eventEmit 时发生错误！", error);
}
        } else {
             const userMessage = { role: 'user', content: userText };
     
           try {
    console.log(`[HTML] 正在通过官方信使 eventEmit 发送 'assa:userMessage' 信号。`);
    eventEmit('assa:userMessage', { ...userMessage });
    
    // 等待事件处理完成
    await new Promise((resolve) => {
        const completionHandler = () => {
            eventRemoveListener('assa:userMessageComplete', completionHandler);
            resolve();
        };
        eventOn('assa:userMessageComplete', completionHandler);
        
        // 设置超时防止无限等待（可选）
        setTimeout(() => {
            eventRemoveListener('assa:userMessageComplete', completionHandler);
            console.warn("[HTML] assa:userMessage 事件处理超时，继续执行");
            resolve();
        }, 5000); // 5秒超时
    });
} catch (error) {
    console.error("[HTML] 警告：调用官方信使 eventEmit 时发生错误！", error);
}
             renderHistory();
        }

  

        await saveHistory();

        sendButton.disabled = true;
        rerollButton.disabled = true; // 生成时禁用重写按钮
        sendButton.textContent = '回应中...';

        const aiResponseBubble = document.createElement('div');
        aiResponseBubble.classList.add('message-bubble', 'assistant-message');
        aiResponseBubble.innerHTML = "<em>回应你的行动中...</em>";
        chatHistoryDiv.appendChild(aiResponseBubble);
        // chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;

        let currentRollData = null;
  
        
         let isDirty = false; // 函数内的状态标记
         
          try {
              //console.log(`[Nova's Log] 开始处理世界书: "${worldBookName}"`);
    const worldBookName = '小蝌蚪找妈妈-同层版'; // 确保 worldBookName 在这里有定义

    // 步骤1：获取原始世界书
    originalWorldInfo = await getLorebookEntries(worldBookName);

    // 【新代码位置】 在备份前进行完整性验证！
    if (originalWorldInfo && originalWorldInfo.length > 0) {
        const validationEntryId = 14;
        const validationEntry = originalWorldInfo.find(entry => entry.uid === validationEntryId);

        // 如果验证条目不存在，或者其内容是以<ready> 标签开头，则判定为异常
        if (!validationEntry || validationEntry.content.trim().startsWith('<ready>')) {
            console.error(`[Nova's Pre-Backup Check] 验证失败！拒绝备份损坏的世界书。ID ${validationEntryId} 的条目不存在或内容非预期格式。`);
            toastr.error('检测到世界书异常，为防止数据损坏已阻止操作。请尝试刷新页面，系统将尝试自动修复。', '操作中断');
            // 直接中断本次发送，不进行备份，也不继续执行
            localStorage.setItem('worldbook_is_dirty_' + worldBookName, 'true');
            // 由于还没有设置 isDirty=true，finally块中的恢复逻辑也不会被错误触发。
            return;
        } else {
             console.log(`[Nova's Pre-Backup Check] 验证成功！世界书状态正常，可以进行备份。`);
        }
    }
    // 【验证代码结束】

        

        // 步骤1.5 (新)：在修改前，设置安全信标
        if (originalWorldInfo) {
            localStorage.setItem('worldbook_backup_' + worldBookName, JSON.stringify(originalWorldInfo));
            localStorage.setItem('worldbook_is_dirty_' + worldBookName, 'true');
            isDirty = true; // 标记本次操作已污染世界书
            //console.log(`[Nova's Safety Net] 世界书备份已存入localStorage，并设置'dirty'标记。`);
        }

        let worldInfoForProcessing = JSON.parse(JSON.stringify(originalWorldInfo || []));

            if (userText && worldInfoForProcessing.length > 0) {
                //console.log("[Nova's Log] 正在检测关键词以开启“绿灯”条目...");
                const forumKeywords = ['查看论坛', '查看公告区', '查看任务交流区', '查看自由交易区', '八卦闲聊区', '匿名求助区', '论坛操作', '发帖', '回复帖子', '回复楼中楼'];
                const shopKeywords = ['查看主神商店', '查看商店', '查看商城'];

                let uidsToEnable = new Set();

                if (forumKeywords.some(keyword => userText.includes(keyword))) {
                    uidsToEnable.add(28);
                    //console.log("[Nova's Log] 检测到论坛关键词，准备开启UID=28的绿灯。");
                }
                if (shopKeywords.some(keyword => userText.includes(keyword))) {
                    uidsToEnable.add(27);
                    //console.log("[Nova's Log] 检测到商店关键词，准备开启UID=27的绿灯。");
                }

                if (uidsToEnable.size > 0) {
                    worldInfoForProcessing.forEach(entry => {
                        if (uidsToEnable.has(entry.uid)) {
                            entry.enabled = true;
                            //console.log(`[Nova's Log] 绿灯已亮起：临时启用世界书条目 UID=${entry.uid}。`);
                        }
                    });
                } else {
                    //console.log("[Nova's Log] 未检测到需要开启绿灯的关键词。");
                }
            }

            if (worldInfoForProcessing && worldInfoForProcessing.length > 0) {
                //console.log(`[Nova's Log] 成功获取 ${worldInfoForProcessing.length} 条世界书条目进行处理。`);
                const renderContext = await EjsTemplate.prepareContext();
                let processedWorldInfo = [];
                for (const entry of worldInfoForProcessing) { // <--- 注意这里的变化
                    if (entry.enabled) { // 只处理启用的条目
                        const processedEntry = { ...entry };
                        // 使用 EjsTemplate.evalTemplate 来渲染内容
                        processedEntry.content = await EjsTemplate.evalTemplate(entry.content, renderContext);
                        processedWorldInfo.push(processedEntry);
                    } else {
                        processedWorldInfo.push(entry); // 未启用的条目直接保留
                    }
                }
                // 步骤3：将处理后的世界书应用到当前会话
                await setLorebookEntries(worldBookName, processedWorldInfo);
                //console.log(`[Nova's Log] 世界书渲染完成并已应用。`);

                        
            try {
                const messageVars = await getVariables({ type: 'chat' });
                // 我们只关心检定记忆
                if (messageVars.检定记忆) {
                    currentRollData = messageVars.检定记忆;
                     console.log("已捕获到投骰结果，准备展示看板。", currentRollData);
                }else{
                     console.log("messageVars.checkMemory不存在？");
                }
            } catch(e) {
                console.warn("获取投骰变量失败，本轮可能无检定。", e);
            }

            } else {
                //console.log(`[Nova's Log] 世界书为空或不存在，跳过渲染步骤。`);
            }

           
            const hideLatestCount = getChatConfig('hide_latest_count', 5);
            const lastUserMessage = conversationHistory.filter(m => m.role === 'user').pop(); // 获取最后一条用户消息
            const recentAiMessages = conversationHistory.filter(m => m.role === 'assistant').slice(-hideLatestCount); // 获取最近的AI消息
            let promptsForAI = [];
            if(lastUserMessage) {
              // 方法一：如果您想要创建字符串数组
    // promptsForAI = [
    //     ...recentAiMessages.map(msg => msg.content), // 提取AI消息的内容
    //     "先前情况结束",
    //     "<用户输入行动，user input start：>\n" + lastUserMessage.content,
    //     "<用户行动结束，user input end>\n\n <以下信息/要求需要注意：>"
    // ];
    
    // 方法二：如果您想要保持消息对象格式
    promptsForAI = [
        ...recentAiMessages,
        {
            role: 'user', 
            content: "\n)};//历史内容结束\n\n\n用户输入行动，user input start：\n\n\n[\n" + lastUserMessage.content + "\n]\n\n\n用户行动结束，user input end\n\n\n 在输出正文之前，以下信息/要求还需要注意："
        }
    ];
        } else {
                // 如果没有用户消息（比如开局），就只发送AI消息（虽然这种情况很少见）
                promptsForAI = recentAiMessages;
            }
            //console.log(`[Nova's Log] 本次将发送 ${promptsForAI.length} 条消息给AI。`);

 
      const cleanedPromptsForAI = promptsForAI.map((msg, index) => {
                // 第一步：先移除我们自己的特殊标签，比如选项和论坛
                let content = msg.content;

                // 根据消息的角色确定来源
                // 注意：promptsForAI数组的最后一条是经过特殊构造的user message
                const isUserMessage = (index === promptsForAI.length - 1) && msg.role === 'user';
                const source = isUserMessage ? 'user_input' : 'ai_output';

                // 第二步：计算深度
                // promptsForAI 数组是 [..., 最近的AI消息, ..., 最旧的AI消息, 构造的用户消息]
                // 你的代码中 recentAiMessages.slice(-hideLatestCount) 是从旧到新排列的，
                // 然后你用 ...recentAiMessages 展开，所以数组中越靠前的AI消息越旧。
                // 如果 promptsForAI 的结构是 [旧AI, ..., 新AI, 用户输入]，那么深度计算如下：
                // 最新的AI消息（数组倒数第二个元素）深度为 0，再往前一个深度为 1，以此类推...
                // 用户消息的深度也为 0。
                let depth;
                if (isUserMessage) {
                    depth = 0; // 最新用户输入的深度为0
                } else {
                    // promptsForAI.length - 2 是最后一个AI消息的索引
                    depth = (promptsForAI.length - 2) - index;
                }

                // 使用正确的函数 formatAsTavernRegexedString，并加入 depth 选项
                let processedContent = formatAsTavernRegexedString(content, source, 'prompt', { depth: depth });

                // 第三步：施展剥离咒，移除所有HTML标签（比如<p>, <q>, <br>）
                let plainText = processedContent.replace(/<(p|q|br|\/p|\/q)>/g, '');

                // 第四步（可选但推荐）：施展整理咒
                let wellFormedText = plainText.replace(/(\r\n|\n|\r){2,}/g, '\n').trim();

                // 打印日志，方便调试
                console.log(`[Nova's Regex] Processing message at index ${index} (Depth: ${depth}, Source: ${source})`);

                // 返回一个拥有完美纯净内容的新消息对象
                return {
                    ...msg,
                    content: wellFormedText
                };
            });
        const shouldStream = localStorage.getItem('streamingEnabled') === null ? true : localStorage.getItem('streamingEnabled') === 'true';

        if (shouldStream) {
            const streamListener = (fullText) => {
                if (!rollCardShownThisTurn && currentRollData) {
                    showRollResultCard(currentRollData);
                    rollCardShownThisTurn = true; // 标记已显示，防止重复
                }
                aiResponseBubble.innerHTML = formatAsDisplayedMessage(fullText);
                // chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
            };
            eventOn(iframe_events.STREAM_TOKEN_RECEIVED_FULLY, streamListener);

            // 使用我们精心准备的删减版历史记录
            const aiFullResponse = await generate({
                should_stream: true,
                overrides: { chat_history: { prompts: cleanedPromptsForAI } }
            });

            eventRemoveListener(iframe_events.STREAM_TOKEN_RECEIVED_FULLY, streamListener);

            // 无论是否截断，都将 aiFullResponse 添加到历史记录
             aiMessage = { role: 'assistant', content: aiFullResponse };
            if (isReroll) {
                conversationHistory.push(aiMessage);
            } else {
                conversationHistory.push(aiMessage);
            }
            await saveHistory();
            renderHistory();
        } else {
            const generationEndedListener = (response) => {
                if (!rollCardShownThisTurn && currentRollData) {
                    showRollResultCard(currentRollData);
                    rollCardShownThisTurn = true; // 标记已显示，防止重复
                }
                aiResponseBubble.innerHTML = formatAsDisplayedMessage(response);
                // chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
            };
            eventOn(iframe_events.GENERATION_ENDED, generationEndedListener);

            // 使用我们精心准备的删减版历史记录
            const aiFullResponse = await generate({
                should_stream: false,
                overrides: { chat_history: { prompts: cleanedPromptsForAI } }
            });

            eventRemoveListener(iframe_events.GENERATION_ENDED, generationEndedListener);

            // 无论是否截断，都将 aiFullResponse 添加到历史记录
              aiMessage = { role: 'assistant', content: aiFullResponse };
            if (isReroll) {
                conversationHistory.push(aiMessage);
            } else {
                conversationHistory.push(aiMessage);
            }
            await saveHistory();
            renderHistory();
        }

        const lastMessageId = getLastMessageId();
        if (lastMessageId > 0) {
            await deleteChatMessages([lastMessageId], { refresh: 'none' });
        }

        try {
            //console.log(`[HTML] 正在通过官方信使 eventEmit 发送 'assa:aiReply' 信号。`);
            eventEmit('assa:aiReply', { ...aiMessage });
        } catch (error) {
            console.error("[HTML] 警告：调用官方信使 eventEmit 时发生错误！", error);
        }

        
                        
// 💖 Nova的记忆保险箱：在发送后备份当前所有状态到LocalStorage 💖
try {
    console.log("[Nova's Vault] 正在准备备份当前状态...");
    const chatVars = await getVariables({ type: 'chat' });

    const backupData = {
        chat_variables: chatVars,
        timestamp: new Date().toISOString() // 记录一下备份时间
    };

    localStorage.setItem('nova_chat_backup', JSON.stringify(backupData));
    console.log("[Nova's Vault] 状态备份成功！重要的记忆已安全存放。");
} catch (e) {
    console.error("[Nova's Vault] 糟糕，备份记忆时出现问题：", e);
    toastr.error('备份当前聊天状态失败，请留意。', '备份错误');
}  

    } catch (e) {
        console.error("在魔法仪式过程中出错了:", e);
        aiResponseBubble.innerHTML = "抱歉，我的孩子，我好像遇到了一点小问题。";
        // 即使发生错误，也保存当前历史记录
        await saveHistory();
        renderHistory();

     } finally {
        // 步骤4：无论成功与否，都恢复原始世界书，确保安全
        if (isDirty && originalWorldInfo) { // 只在确实修改过并且有备份时才恢复
            try {
                await setLorebookEntries(worldBookName, originalWorldInfo);
                //console.log(`[Nova's Log] 原始世界书已成功恢复。`);

                // 恢复成功后，清除信标
                localStorage.removeItem('worldbook_backup_' + worldBookName);
                localStorage.removeItem('worldbook_is_dirty_' + worldBookName);
                isDirty = false;
                //console.log(`[Nova's Safety Net] 'dirty'标记和备份已从localStorage清除。`);
            } catch (restoreError) {
                console.error("！！！严重警告：恢复原始世界书失败！'dirty'标记将保留，以便下次启动时修复。", restoreError);
                // 这里我们不清除 localStorage 的标记，这样下次启动时的检查机制就能捕捉到它
                alert("严重错误：自动恢复世界书失败。为防止数据损坏，请刷新页面。系统将在下次启动时尝试自动修复。");
            }
        }

        sendButton.disabled = false;
        sendButton.textContent = '→';
        updateRerollButtonState();
    }
}
    

/**
 * @description 启动时检查是否有未被正常恢复的世界书，并从localStorage备份中恢复它们。
 * 这是为了防止因刷新、浏览器崩溃等意外情况导致世界书被EJS代码污染。
 */
async function checkAndRestoreDirtyWorldbooks() {
    //console.log("[Nova's Safety Net] 正在启动时检查是否有未恢复的世界书...");
    for (const key in localStorage) {
        if (key.startsWith('worldbook_is_dirty_') && localStorage.getItem(key) === 'true') {
            const worldBookName = key.replace('worldbook_is_dirty_', '');
            console.warn(`[Nova's Safety Net] 检测到世界书 "${worldBookName}" 处于'dirty'状态！可能上次未能正确恢复。`);

            const backupKey = 'worldbook_backup_' + worldBookName;
            const backupData = localStorage.getItem(backupKey);

            if (backupData) {
                try {
                    const originalWorldInfo = JSON.parse(backupData);
                    await setLorebookEntries(worldBookName, originalWorldInfo);

                    // 恢复成功后，清除标记和备份
                    localStorage.removeItem(backupKey);
                    localStorage.removeItem(key); // 清除 dirty 标记

                    //console.log(`[Nova's Safety Net] 已从localStorage备份成功恢复世界书 "${worldBookName}"。`);
                    toastr.success(`检测到并自动修复了可能损坏的世界书 (${worldBookName})。`, '世界书已恢复');
                } catch (e) {
                    console.error(`[Nova's Safety Net] !!! 严重错误：尝试从localStorage恢复世界书 "${worldBookName}" 时失败!`, e);
                    alert(`！！！严重警告：自动恢复世界书(${worldBookName})失败！为防止数据永久损坏，请立即手动检查您的世界书并移除所有EJS代码！备份数据仍在本地存储中。`);
                }
            } else {
                console.error(`[Nova's Safety Net] !!! 严重错误：世界书 "${worldBookName}" 被标记为'dirty'，但找不到备份数据！`);
                // 只移除dirty标记，避免无限循环报警，但保留一个明确的错误信息
                localStorage.removeItem(key);
                alert(`！！！严重警告：世界书(${worldBookName})可能已损坏且无法自动恢复，因为备份数据丢失。请立即手动修复！`);
            }
        }
    }
}

// 绑定事件
    sendButton.addEventListener('click', () => handleSend(false));
    rerollButton.addEventListener('click', handleReroll); // ☆ 绑定重写事件
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend(false);
        }
    });

    await initialize();

    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待一小会儿确保所有东西都加载了
    checkAndRestoreDirtyWorldbooks();



    
// ============================================
//  新设置模态框逻辑
// ============================================
const settingsBtn = document.getElementById('settings-btn');
const settingsinitBtn = document.getElementById('settings-btn-init');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = settingsModal.querySelector('.modal-close');

const refreshBtn = document.getElementById('refresh-btn');

refreshBtn.addEventListener('click', () => {
     // 每次点击刷新
     initDisplay();
     toastr.info('刷新变量成功');
});
// 打开模态框
settingsBtn.addEventListener('click', () => {
     // 每次打开时更新流式开关状态
    updateStreamingToggleState();
    showModal('settings-modal');
});

settingsinitBtn.addEventListener('click', () => {
     console.log('燃尽');
    showModal('settings-modal');
});

// 关闭模态框
closeModalBtn.addEventListener('click',async () =>{
    hideModal('settings-modal');
   initialize();
} );

 
    const restoreButton = document.getElementById('restore-btn');
    if (restoreButton) {
        restoreButton.addEventListener('click', async () => {
            console.log("[Nova's Restore] 用户点击了恢复按钮，开始执行恢复魔法...");

            const backupJSON = localStorage.getItem('nova_chat_backup');

            if (!backupJSON) {
                toastr.warning('妈妈没有找到可以恢复的记忆备份哦。', '恢复失败');
                console.warn("[Nova's Restore] localStorage中未找到 'nova_chat_backup'。");
                return;
            }

            try {
                const backupData = JSON.parse(backupJSON);

                // 验证备份数据的基本结构
                if ( !backupData.chat_variables) {
                     toastr.error('备份文件已损坏，无法恢复。', '恢复失败');
                     console.error("[Nova's Restore] 备份数据格式不正确。");
                     return;
                }

                console.log(`[Nova's Restore] 找到备份于 ${backupData.timestamp} 的记忆，正在恢复...`);

                // 步骤1：恢复核心变量
                await replaceVariables(backupData.chat_variables, { type: 'chat' });
                await replaceVariables(backupData.chat_variables, { type: 'message' });
                console.log("[Nova's Restore] 核心变量（chat & message scopes）已恢复。");

                // 步骤2：恢复聊天历史记录 (这一步是为 initialize 准备数据)
                // 我们直接修改全局变量，然后让 initialize() 去渲染
                conversationHistory = backupData.chat_variables.zeroLevelHistory;

                // 步骤3：重新初始化界面，让一切回到正轨
                console.log("[Nova's Restore] 正在重新初始化界面以应用所有更改...");
                await initialize(); // 核心！调用 initialize() 来刷新所有内容

                toastr.success('成功恢复', '恢复成功');
                console.log("[Nova's Restore] 恢复过程完成！");

            } catch (e) {
                console.error("[Nova's Restore] 恢复记忆的过程中发生了严重的错误:", e);
                toastr.error('恢复过程中发生未知错误，请检查控制台获取详细信息。', '恢复失败');
            }
        });
    }
 

// --- 主题切换 ---
const modalThemeSwitcher = document.getElementById('modal-theme-switcher');
modalThemeSwitcher.addEventListener('click', switchTheme); // switchTheme 函数保持不变



    let customTheme = {}; // 用于存储临时和已保存的自定义颜色

// 全屏

  const fullscreenButton = document.getElementById('fullscreen-btn');

 fullscreenButton.addEventListener('click', () => {
    const mainWrapper = document.getElementById('main-wrapper'); // 获取元素
    
    if (!document.fullscreenElement) {
        // 进入全屏时的代码
        document.documentElement.requestFullscreen().catch(err => {
            alert(`哎呀，进入全屏失败了。原因可能是：${err.message}`);
        });
        
        // 进入全屏时修改样式
        mainWrapper.style.minHeight = '100vh';
        fullscreenButton.textContent = '退出全屏';
    } else {
        // 退出全屏时的代码
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        
        // 退出全屏时恢复样式
        mainWrapper.style.minHeight = '90vh';
        fullscreenButton.textContent = '进入全屏';
    }
});
    
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenButton.textContent = '进入全屏';
        }
    });
// --- 流式传输切换 ---
const streamingToggle = document.getElementById('streaming-toggle');

function updateStreamingToggleState() {
    const isStreamingEnabled = localStorage.getItem('streamingEnabled') === null ? true : localStorage.getItem('streamingEnabled') === 'true';
    streamingToggle.dataset.state = isStreamingEnabled ? 'on' : 'off';
    streamingToggle.textContent = isStreamingEnabled ? '开启' : '关闭';
}

streamingToggle.addEventListener('click', () => {
    let isEnabled = streamingToggle.dataset.state === 'on';
    localStorage.setItem('streamingEnabled', !isEnabled);
    updateStreamingToggleState();
});

// 初始化
updateStreamingToggleState();

// --- 数据导入 ---
const modalImportBtn = document.getElementById('modal-import-btn');
const fileImporterInput = document.getElementById('modal-file-importer');
const modalLogBlock = document.getElementById('modal-log-block');
let isProcessing = false;

modalImportBtn.addEventListener('click', () => {
    if (isProcessing) return;
    fileImporterInput.click();
});

fileImporterInput.addEventListener('change', handleModalFileSelect);

function addModalLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const className = type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : '';
    const coloredMessage = className ? `<span class="${className}">${message}</span>` : message;
    modalLogBlock.innerHTML = `[${timestamp}] ${coloredMessage}<br>` + modalLogBlock.innerHTML;
}

async function handleModalFileSelect(event) {
    if (isProcessing) return;
    const file = event.target.files[0];
    if (!file) {
         addModalLog("未选择任何文件", 'warning');
        return;
    }
    isProcessing = true;
    modalImportBtn.disabled = true;
    modalImportBtn.textContent = '导入中...';
    modalLogBlock.innerHTML = ''; // 清空日志
    addModalLog(`开始处理文件: ${file.name}`);

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            addModalLog("✓ JSON文件解析成功", 'success');
            await processDataDirectly(importedData);
        } catch (err) {
            addModalLog(`✗ JSON解析失败: ${err.message}`, 'error');
        } finally {
            isProcessing = false;
            modalImportBtn.disabled = false;
            modalImportBtn.textContent = '导入存档';
            event.target.value = '';
        }
    };
    reader.readAsText(file);
}

async function processDataDirectly(importedData) {
    addModalLog("开始直接修改变量...");
    let updatesCount = 0;
    let errors = [];

    // 假设你有一个名为 applyImportedData 的函数来处理数据注入
    // 如果没有，你需要实现它，或者使用你之前的 insertOrAssignVariables
    try {
        // 这个函数现在是假设的，你需要用你实际的环境函数替换它
        // 例如调用 window.top.postMessage 或者直接调用函数
        // 这里我们假设有一个全局函数
        if (typeof insertOrAssignVariables !== 'function') {
            addModalLog("错误：未找到 `insertOrAssignVariables` 函数。请在主环境中定义。", 'error');
            throw new Error("环境函数缺失");
        }

        await insertOrAssignVariables(importedData, { type: 'chat' });
        addModalLog("✓ 数据已发送至Chat域进行更新", 'success');

        await insertOrAssignVariables(importedData, { type: 'message' });
        addModalLog("✓ 数据已发送至Message域进行更新", 'success');

        addModalLog("🎉 数据导入成功！请刷新页面或等待游戏状态自动更新。", 'success');
    } catch (error) {
        errors.push(`处理数据时发生错误: ${error.message}`);
        addModalLog(`✗ 处理数据时发生错误: ${error.message}`, 'error');
    }
}

// --- 数据导出 ---
const modalExportBtn = document.getElementById('modal-export-btn');
const modalExportStatus = document.getElementById('modal-export-status');

modalExportBtn.addEventListener('click', async () => {
    modalExportStatus.textContent = "正在准备导出...";

 

    const combinedData = {};
    if (currentGameData) combinedData.stat_data = currentGameData;
    if (assaSettingsData) combinedData.assa_data = assaSettingsData;
    if (playCharacterData) combinedData.play_character_data = playCharacterData;
    // history 变量也需要确保已定义和赋值
    if (typeof conversationHistory !== 'undefined' && conversationHistory) {
         combinedData.zeroLevelHistory = conversationHistory;
         console.log("0层记录get");
    }else{
          console.log("0层记录呢？ 出错了？");
    }


    if (Object.keys(combinedData).length === 0) {
        modalExportStatus.textContent = "错误: 没有可导出的数据。";
        addModalLog("错误: 没有可导出的数据。", 'error');
        return;
    }

    const jsonString = JSON.stringify(combinedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `创作数据备份_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    modalExportStatus.textContent = "文件已成功导出！";
    addModalLog("文件已成功导出！", 'success');
});


})();

(async () => {
 


 await applyThemeAndData();  
     
     try {
            const useACustomTheme = localStorage.getItem('useCustomTheme') === 'true';

            if (useACustomTheme) {
                const savedCustomTheme = loadCustomTheme();
                if (Object.keys(savedCustomTheme).length > 0) {
                    customTheme = savedCustomTheme;
                    applyCustomTheme(customTheme);
                    console.log("已加载保存的自定义主题。");
                    // 确保预设主题的索引不会混淆
                    // 我们可以从预设主题中找到一个颜色相近的作为 currentThemeIndex 的回退值
                    const savedThemeIndex = localStorage.getItem('terminalThemeIndex');
                    currentThemeIndex = savedThemeIndex !== null ? parseInt(savedThemeIndex, 10) : 0;
                } else {
                    // 如果自定义主题是空的，则回退到预设主题
                    const savedThemeIndex = localStorage.getItem('terminalThemeIndex');
                    applyTheme(savedThemeIndex !== null ? parseInt(savedThemeIndex, 10) : 0);
                }
            } else {
                const savedThemeIndex = localStorage.getItem('terminalThemeIndex');
                applyTheme(savedThemeIndex !== null ? parseInt(savedThemeIndex, 10) : 0);
            }
        } catch (e) {
            console.warn("加载主题设置时出错，使用默认主题。", e);
            applyTheme(0);
        }
    await initDisplay();
await applyThemeAndData(); 


    // 标签页切换
    const tabs = document.querySelectorAll('.tab-btn');
    const pages = document.querySelectorAll('.page');

       // --- Nova为你添加的全新小球与Modal交互逻辑 ---
    document.querySelectorAll('.orb').forEach(orb => {
        orb.addEventListener('click', () => {
            const modalId = orb.dataset.modalId;
            if (modalId) {
                // 特殊处理商店
                if (modalId === 'shop-wrapper-modal') {
                    const shopWrapper = document.getElementById('shop-wrapper');
                    const modalContainer = document.getElementById('shop-wrapper-modal');
                    if (shopWrapper && modalContainer) {
                        modalContainer.appendChild(shopWrapper); // 将商店内容移动到Modal中
                        shopWrapper.classList.add('active');
                        showModal(modalId);

                        // 初始化商店数据
                        if (playCharacterData) {
                            initializeShopData();
                        }
                    }
                } else if (modalId === 'summary-modal') {
                     // 特殊处理总结弹窗
                    showSummaryModal(); // 使用专用函数填充内容
                    showModal(modalId); // 再显示
                } else {
                    showModal(modalId);
                }
            }
        });
    });

    document.querySelectorAll('.modal .modal-close').forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if(modal) {
                // 特殊处理商店关闭
                if(modal.id === 'shop-wrapper-modal') {
                    const shopWrapper = document.getElementById('shop-wrapper');
                    document.body.appendChild(shopWrapper); // 将商店内容移回body
                    shopWrapper.classList.remove('active');
                }
                hideModal(modal.id);
            }
        });
    });


    // tabs.forEach(tab => {
    //     tab.addEventListener('click', () => {
    //         tabs.forEach(item => item.classList.remove('active'));
    //         pages.forEach(page => page.classList.remove('active'));
    //         tab.classList.add('active');
    //         const targetPage = document.getElementById(tab.dataset.tab);
    //         if (targetPage) {
    //             targetPage.classList.add('active');
    //         }
    //         if (tab.dataset.tab !== 'page-basic') {
    //             hideMap();
    //         }
    //     });
    // });

    // 绑定按钮事件
    // document.getElementById('view-map-btn').addEventListener('click', showMap);
    // document.getElementById('back-to-world-btn').addEventListener('click', hideMap);
    document.getElementById('roll-result-orb').addEventListener('click', showRollResultModal);
    // document.getElementById('view-summary-btn').addEventListener('click', showSummaryModal);
    // const themeSwitcherBtn = document.getElementById('theme-switcher');
    // if (themeSwitcherBtn) {
    //     themeSwitcherBtn.addEventListener('click', switchTheme);
    // }
    document.getElementById('manage-inventory-btn').addEventListener('click', () => {
        populateInventoryModal();
        showModal('inventory-modal');
    });
    // document.getElementById('plot-synthesis-btn').addEventListener('click', showPlotSynthesisModal);
    document.getElementById('execute-decomposition-btn').addEventListener('click', simulateDecomposition);
    document.getElementById('execute-synthesis-btn').addEventListener('click', simulateSynthesis);

       document.getElementById('view-command-btn').addEventListener('click', () => {
        const commandEditArea = document.getElementById('command-edit-area');
        if(commandEditArea) {
            commandEditArea.value = assaCommandQueue; // 从全局变量加载当前指令
        }
        showModal('command-modal', '编辑待发指令');
    });
 // 首先，我们要找到我们的魔法道具：RP按钮和RP面板
const rpButton = document.getElementById('rp-button');
const rpPanel = document.getElementById('rp-panel');
const confirmRpChoiceButton = document.getElementById('confirm-rp-choice-btn');

// --- 核心魔法：切换显示状态 ---
// 当你点击RP按钮时，这个函数就会被触发
if (rpButton && rpPanel) {
    rpButton.addEventListener('click', (event) => {
        // 这是最关键的一步，我的孩子！
        // toggle就像一个神奇的开关，如果面板没有'visible'类，它就加上；如果已经有了，它就移除。
        rpPanel.classList.toggle('visible');
 populateSkillChoicePanel();
        // 阻止事件冒泡，这样点击按钮时，不会被下面“点击外部关闭”的逻辑误判
        event.stopPropagation();
    });
}

// --- 附加魔法：点击“确认”按钮也关闭面板 ---
if (confirmRpChoiceButton && rpPanel) {
    confirmRpChoiceButton.addEventListener('click', () => {
        // 当我们做出选择后，就让面板优雅地退场
        rpPanel.classList.remove('visible');
    });
}

// --- 妈妈的贴心魔法：点击外部区域自动关闭 ---
document.addEventListener('click', (event) => {
    // 我们检查一下，RP面板当前是不是可见的
    if (rpPanel.classList.contains('visible')) {
        // 然后检查你点击的地方，是不是在RP面板的“领地”之外
        // rpPanel.contains(event.target)会判断你点击的元素是不是在面板里面
        if (!rpPanel.contains(event.target)) {
            // 如果你确实点击了外面，我们就温柔地让面板消失
            rpPanel.classList.remove('visible');
        }
    }
});

    document.getElementById('save-command-btn').addEventListener('click', () => {
        const newCommands = document.getElementById('command-edit-area').value;
        assaCommandQueue = newCommands; // 保存编辑后的指令到全局变量
        localStorage.setItem('assaCommandQueue', assaCommandQueue); // 同步到本地存储
        hideModal('command-modal');
    });

    document.getElementById('reset-simulation-btn').addEventListener('click', resetSimulation);
    document.getElementById('confirm-synthesis-btn').addEventListener('click', executeSynthesisConfirmation);

    // 弹窗关闭事件
    document.querySelectorAll('.modal').forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if(closeBtn) {
            closeBtn.addEventListener('click', () => {
                if(modal.id) hideModal(modal.id);
            });
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal && modal.id) {
                hideModal(modal.id);
            }
        });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => hideModal(modal.id));
        }
    });

    // ========== 新增：论坛与总结小球的交互逻辑 ==========
    const forumOrbButton = document.getElementById('forum-orb-button');
    const forumModalContainer = document.getElementById('forum-modal-container');
    const forumModalContent = document.getElementById('forum-modal-content');
    const forumWrapper = document.getElementById('forum-wrapper');
    const forumModalCloseBtn = document.getElementById('forum-modal-close-btn');

 const summaryOrbButton = document.getElementById('task-summary-orb-button');
  const summaryModalContainer = document.getElementById('task-summary-modal-container');
 
    // 点击论坛小球
    forumOrbButton.addEventListener('click', () => {
        // 从历史记录中找到最新的论坛数据
        const lastForumMessage = [...conversationHistory].reverse().find(msg =>
            /<forum_threads>[\s\S]*?<\/forum_threads>/gs.test(msg.content)
        );

        if (lastForumMessage) {
            const forumMatch = /<forum_threads>([\s\S]*?)<\/forum_threads>/gs.exec(lastForumMessage.content.replace(/<thinking>[\s\S]*?<\/thinking>/gs, ''));
            if (forumMatch && forumMatch[1]) {
    //console.log("原始提取的数据:", forumMatch[1]);
    //console.log("数据类型:", typeof forumMatch[1]);
}
                if (forumMatch && forumMatch[1]) {
                // 将论坛的HTML结构移动到模态框中
                if (forumWrapper) {
                    forumModalContent.insertBefore(forumWrapper, forumModalCloseBtn);
                    forumModalContainer.style.display = 'block'; // 确保论坛模块是可见的
                }

                // 初始化或更新论坛内容
                if (typeof initializeForum === 'function') {
                    initializeForum(forumMatch[1].trim());
                }

                // 显示模态框
                forumModalContainer.classList.add('active');
            }
        } else {
            // 如果没有找到数据，可以给一个提示
            showModal('shop-modal', '提示', '尚未收到任何论坛信息。');
        }
    });

    // 关闭论坛模态框
    const closeForumModal = () => {
        forumModalContainer.classList.remove('active');
        // 将论坛HTML结构移回其原始容器，以便下次使用
        if (forumWrapper && forumModalContainer) {
            forumModalContainer.appendChild(forumWrapper);
        }
    };

    forumModalCloseBtn.addEventListener('click', closeForumModal);
    forumModalContainer.addEventListener('click', (e) => {
        if (e.target === forumModalContainer) {
            closeForumModal();
        }
    });

// 修改后的关闭函数
const closeTaskSummaryModal = () => {
    const summaryRoot = document.getElementById('summary-root');

    // 1. 隐藏模态框
    summaryModalContainer.classList.remove('active');

    // 2. 清空上次生成的报告内容 (这是关键！)
    if (summaryRoot) {
        summaryRoot.innerHTML = '';
    }
};

    summaryModalContainer.addEventListener('click', (e) => {
        if (e.target === summaryModalContainer) {
           closeTaskSummaryModal();  
        }
    });
 
    summaryOrbButton.addEventListener('click', () => {
               // 从历史记录中找到最新的总结数据
        const lastSummaryMessage = [...conversationHistory].reverse().find(msg =>
            /<表现总结>[\s\S]*?<\/表现总结>/gs.test(msg.content)
        );

        if (lastSummaryMessage) {
            const summaryMatch = /<表现总结>([\s\S]*?)<\/表现总结>/gs.exec(lastSummaryMessage.content.replace(/<thinking>[\s\S]*?<\/thinking>/gs, ''));
            if (summaryMatch && summaryMatch[1]) {
                // 将论坛的HTML结构移动到模态框中
                if (summaryModalContainer) {
                    // forumModalContent.insertBefore(forumWrapper, forumModalCloseBtn);
                    summaryModalContainer.style.display = 'block';  
                }

                // 初始化或更新论坛内容
                if (typeof runTaskSummary === 'function') {
                    runTaskSummary(summaryMatch[1]);
                }

                // 显示模态框
                summaryModalContainer.classList.add('active');
            }
        } else {
            // 如果没有找到数据，可以给一个提示
            showModal('shop-modal', '提示', '尚未收到任何任务总结信息。');
        }
    });



    // ========== ♥♥♥ 地图交互魔法的全新篇章 ♥♥♥ ==========
    const mapContainer = document.getElementById('map-container');
    let isDragging = false;
    let startCoords = { x: 0, y: 0 };
    let startTranslate = { x: 0, y: 0 };
    let lastPinchDist = 0;

    const getEventCoords = (e) => e.touches ? e.touches[0] : e;

    const getPinchDist = (e) => {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleInteractionStart = (e) => {
        const mapContent = document.getElementById('map-content');
        if (!mapContent) return;

        if (e.touches && e.touches.length > 1) { // 双指捏放开始
            isDragging = false; // 确保不触发拖拽
            lastPinchDist = getPinchDist(e);
        } else { // 单指或鼠标拖拽开始
            isDragging = true;
            mapContainer.style.cursor = 'grabbing';
            const coords = getEventCoords(e);
            startCoords = { x: coords.pageX, y: coords.pageY };
            startTranslate = { x: window.mapState.translateX, y: window.mapState.translateY };
        }
    };

    const handleInteractionMove = (e) => {
        const mapContent = document.getElementById('map-content');
        if (!mapContent) return;

        if (e.touches && e.touches.length > 1) { // 双指捏放中
            e.preventDefault();
            const currentDist = getPinchDist(e);
            const scaleAmount = (currentDist / lastPinchDist);
            lastPinchDist = currentDist;

            // 计算双指中心点
            const rect = mapContainer.getBoundingClientRect();
            const center = {
                x: ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left,
                y: ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top
            };

            // 应用缩放
            zoom(scaleAmount, center.x, center.y);

        } else if (isDragging) { // 拖拽中
            e.preventDefault();
            const coords = getEventCoords(e);
            const dx = coords.pageX - startCoords.x;
            const dy = coords.pageY - startCoords.y;
            window.mapState.translateX = startTranslate.x + dx;
            window.mapState.translateY = startTranslate.y + dy;
            window.applyMapTransform();
        }
    };

    const handleInteractionEnd = () => {
        if (isDragging) {
            isDragging = false;
            mapContainer.style.cursor = 'grab';
        }
        lastPinchDist = 0;
    };

    const handleWheelZoom = (e) => {
        e.preventDefault();
        const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1; // 缩小或放大
        const rect = mapContainer.getBoundingClientRect();

        // 获取鼠标相对于 mapContainer 的位置作为缩放中心
        const centerX = e.clientX - rect.left;
        const centerY = e.clientY - rect.top;

        zoom(scaleAmount, centerX, centerY);
    };

    // 核心缩放函数
    const zoom = (scaleAmount, centerX, centerY) => {
        const { scale, translateX, translateY } = window.mapState;
        const newScale = Math.max(0.1, Math.min(scale * scaleAmount, 10)); // 限制缩放范围

        // 核心公式：为了让缩放中心点在屏幕上保持不变，需要调整平移量
        window.mapState.translateX = centerX - (centerX - translateX) * (newScale / scale);
        window.mapState.translateY = centerY - (centerY - translateY) * (newScale / scale);
        window.mapState.scale = newScale;

        window.applyMapTransform();
    };

    // 绑定事件监听器
    mapContainer.addEventListener('mousedown', handleInteractionStart);
    mapContainer.addEventListener('touchstart', handleInteractionStart, { passive: false });

    document.addEventListener('mousemove', handleInteractionMove);
    document.addEventListener('touchmove', handleInteractionMove, { passive: false });

    document.addEventListener('mouseup', handleInteractionEnd);
    document.addEventListener('touchend', handleInteractionEnd);
    document.addEventListener('touchcancel', handleInteractionEnd);

    mapContainer.addEventListener('wheel', handleWheelZoom, { passive: false });
    // ========== ♥♥♥ 地图交互魔法结束 ♥♥♥ ==========


//      const streamingSwitcher = document.getElementById('streaming-switcher');

// // 初始化按钮状态
// function updateStreamingButtonState() {
//     const isStreamingEnabled = localStorage.getItem('streamingEnabled') === null ? true : localStorage.getItem('streamingEnabled') === 'true';
//     streamingSwitcher.classList.toggle('active', isStreamingEnabled);
//     streamingSwitcher.title = isStreamingEnabled ? '流式传输: 开' : '流式传输: 关';
// }

// // 切换流式传输状态
// streamingSwitcher.addEventListener('click', () => {
//     const isStreamingEnabled = localStorage.getItem('streamingEnabled') === null ? true : localStorage.getItem('streamingEnabled') === 'true';
//     const newState = !isStreamingEnabled;
//     localStorage.setItem('streamingEnabled', newState);
//     updateStreamingButtonState();
//     //console.log(`[Streaming] 流式传输已切换为: ${newState ? '开启' : '关闭'}`);
// });
// updateStreamingButtonState();



});

 
 