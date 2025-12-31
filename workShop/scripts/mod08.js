(function() {
  const container = document.getElementById('orb-container');
  const topLeftContainer = document.getElementById('top-left-orbs');
  
  if (!container && !topLeftContainer) {
    console.error('未找到 orb-container 或 top-left-orbs 元素');
    return;
  }

  // 添加必要的样式
  const style = document.createElement('style');
  style.textContent = `
    /* orb-container 样式(右侧竖向容器) */
    #orb-container {
      /* 使用伪元素扩大触发区域 */
    }
    
    #orb-container::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
     /*  left: -45px;  向左扩展45px */
      right: -45px; /* 向右扩展45px */
      pointer-events: auto;
    }
    
    #orb-container .orb,
    #orb-container .orb-divider {
      opacity: 0;
      transform: translateX(20px);
      transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                  transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
      position: relative;
      z-index: 1;
    }
    
    #orb-container.show .orb,
    #orb-container.show .orb-divider {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }
    
    /* top-left-orbs 样式(顶部横向容器) */
    #top-left-orbs::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: -45px;    /* 向上扩展45px */
      bottom: -45px; /* 向下扩展45px */
      pointer-events: auto;
    }
    
    #top-left-orbs .orb,
    #top-left-orbs .orb-divider {
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                  transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
      position: relative;
      z-index: 1;
    }
    
    #top-left-orbs.show .orb,
    #top-left-orbs.show .orb-divider {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

      .message-bubble {
      max-width: 100% !important;
      padding: 0 !important;
    }
  `;
  document.head.appendChild(style);

  // 动态为每个子元素添加延迟动画
  const applyDelayAnimation = (container) => {
    const children = container.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].classList.contains('orb') || children[i].classList.contains('orb-divider')) {
        children[i].style.transitionDelay = `${i * 0.05}s`;
      }
    }
  };

  if (container) applyDelayAnimation(container);
  if (topLeftContainer) applyDelayAnimation(topLeftContainer);

  // 检测是否为触摸设备
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // 为容器添加交互功能
  const setupInteraction = (targetContainer) => {
    if (isTouchDevice) {
      // 移动端:点击容器区域显示/隐藏
      let isVisible = false;

      targetContainer.addEventListener('click', function(e) {
        // 如果点击的是小球本身,不切换状态(让小球的功能正常工作)
        if (e.target.classList.contains('orb')) {
          return;
        }
        e.stopPropagation();
        isVisible = !isVisible;
        targetContainer.classList.toggle('show', isVisible);
      });

      // 点击其他地方隐藏
      document.addEventListener('click', function(e) {
        if (isVisible && !targetContainer.contains(e.target)) {
          isVisible = false;
          targetContainer.classList.remove('show');
        }
      });
    } else {
      // 桌面端:鼠标悬停显示/隐藏
      targetContainer.addEventListener('mouseenter', function() {
        targetContainer.classList.add('show');
      });

      targetContainer.addEventListener('mouseleave', function() {
        targetContainer.classList.remove('show');
      });
    }
  };

  if (container) setupInteraction(container);
  if (topLeftContainer) setupInteraction(topLeftContainer);

  // 监听容器内容变化,自动为新增的小球添加延迟动画
  const setupObserver = (targetContainer) => {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && (node.classList.contains('orb') || node.classList.contains('orb-divider'))) {
            const allChildren = Array.from(targetContainer.children);
            const index = allChildren.indexOf(node);
            node.style.transitionDelay = `${index * 0.05}s`;
          }
        });
      });
    });

    observer.observe(targetContainer, { childList: true });
  };

  if (container) setupObserver(container);
  if (topLeftContainer) setupObserver(topLeftContainer);
})();