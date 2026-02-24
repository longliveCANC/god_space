(function() {
    'use strict';

    // --- 模块一：动态添加新的世界模式 ---

    function addCustomWorldOption() {
        const carousel = document.getElementById('world-mode-carousel');
        if (!carousel) {
            console.error('错误：未找到轮播图容器 "world-mode-carousel"。');
            return;
        }

        // 检查是否已添加，防止重复执行
        if (carousel.querySelector('[data-value="62"]')) {
            console.log('信息：自定义世界选项已存在，无需重复添加。');
            return;
        }

        const newWorldCard = document.createElement('div');
        newWorldCard.className = 'choice-world-card';
        newWorldCard.setAttribute('data-value', '62');
        newWorldCard.innerHTML = `
            <label for="mode-62">dlc:自定义</label>
            <div class="world-description">
                选择此模式将跳过繁琐的细节设定，直接进入一个由你主导的、规则高度自定义的冒险世界。
            </div>
            <input type="radio" id="mode-62" name="world-mode" value="62">
        `;
        carousel.appendChild(newWorldCard);

        if (typeof worldCardData !== 'undefined') {
            worldCardData['mode-62'] = 'https://longlivecanc.github.io/god_space/backImages/%E6%9C%AB%E6%97%A5.png';
        } else {
            console.warn('警告："worldCardData" 未定义，背景图片可能不会更新。');
        }

        console.log('成功：动态添加了 "dlc:自定义" 选项。');
    }

    // --- 模块二：页面劫持与流程简化功能 ---

    function hijackPageFlow() {
        console.log('开始执行页面劫持...');

        const page1 = document.getElementById('page-1');
        const page2 = document.getElementById('page-2');
        const nextPageButton = document.getElementById('next-page-button');

        if (!page1 || !page2 || !nextPageButton) {
            console.error('劫持失败：缺少核心页面元素 (page-1, page-2, 或 next-page-button)。');
            return;
        }

        // 1. 清空页面，只留下“下一页”按钮
        page1.innerHTML = '';
        page1.appendChild(nextPageButton);
        console.log('劫持步骤1/3: 已清空 page-1 并仅保留了 next-page-button。');

        // 2. 为 applyVersionTheme 函数打上“安全补丁”，防止因元素被删除而报错
        const originalApplyVersionTheme = window.applyVersionTheme;
        window.applyVersionTheme = function(newVersion, identitySelectElement) {
            console.log('补丁：applyVersionTheme 被调用，将跳过对已删除元素的DOM操作。');
            const originalGetElementById = document.getElementById;
            document.getElementById = function(id) {
                const removedIds = [
                    'paradise-camp-section', 'clover-leaf-tone', 'teammate-section-label',
                    'teammate-count', 'fixed-team-toggle', 'teammate-count-label',
                    'planet-title-identity', 'planet-teammates', 'id-card-wrapper',
                    'world-details-default', 'world-details-v7'
                ];
                if (removedIds.includes(id)) {
                    return { style: {} }; // 返回一个带style属性的空对象
                }
                return originalGetElementById.apply(document, arguments);
            };
            try {
                originalApplyVersionTheme(newVersion, identitySelectElement);
            } catch (e) {
                console.error('即使有补丁，applyVersionTheme 仍然出错:', e);
            } finally {
                document.getElementById = originalGetElementById; // 恢复原始函数
            }
        };
        console.log('劫持步骤2/3: 已为 applyVersionTheme 函数安装安全补丁。');

        // 3. 替换“下一页”按钮的点击事件，跳过数据保存，直接翻页
        const newNextButton = nextPageButton.cloneNode(true);
        nextPageButton.parentNode.replaceChild(newNextButton, nextPageButton);

        newNextButton.addEventListener('click', () => {
            console.log('补丁：next-page-button 被点击，跳过数据保存，直接进入下一页。');
            page1.classList.remove('active');
            page2.classList.add('active');
            if (typeof window.updatePageControlsVisibility === 'function') {
                window.updatePageControlsVisibility();
            }
        });
        console.log('劫持步骤3/3: 已为 next-page-button 替换为安全的点击事件。');
        console.log('页面劫持流程执行完毕！');
    }

    // --- 模块三：核心逻辑 - 监听世界模式选择 ---

    function initialize() {
        // 首先，添加我们的自定义选项
        addCustomWorldOption();

        const carousel = document.getElementById('world-mode-carousel');
        if (!carousel) return;

        // 使用事件委托来监听所有卡片的点击事件
        carousel.addEventListener('click', function(event) {
            // 找到被点击的卡片元素
            const card = event.target.closest('.choice-world-card');
            if (!card) return;

            const selectedValue = card.getAttribute('data-value');

            // 检查是否是我们自定义的模式
            if (selectedValue === '62') {
                console.log('检测到玩家选择了 "dlc:自定义" (mode 62)，触发页面劫持流程。');

                // 确保在执行劫持前，选项已经被视觉上选中
                const radio = card.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;

                // 执行劫持！
                hijackPageFlow();
            }
        });

        console.log('初始化完成：自定义模式已添加，并已设置监听器。');
    }

    // --- 执行 ---
    // 确保在DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();