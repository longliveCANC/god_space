(function() {
  const container = document.getElementById('orb-container');
  
  if (!container) {
    console.error('未找到 orb-container 元素');
    return;
  }

  // 添加必要的样式
  const style = document.createElement('style');
  style.textContent = `
    #orb-container .orb,
    #orb-container .orb-divider {
      opacity: 0;
      transform: translateX(20px);
      transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                  transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }
    
    #orb-container.show .orb,
    #orb-container.show .orb-divider {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }
    
    /* 为每个小球添加延迟动画效果 */
    #orb-container.show .orb:nth-child(1),
    #orb-container.show .orb-divider:nth-child(1) { transition-delay: 0.05s; }
    #orb-container.show .orb:nth-child(2),
    #orb-container.show .orb-divider:nth-child(2) { transition-delay: 0.1s; }
    #orb-container.show .orb:nth-child(3),
    #orb-container.show .orb-divider:nth-child(3) { transition-delay: 0.15s; }
    #orb-container.show .orb:nth-child(4),
    #orb-container.show .orb-divider:nth-child(4) { transition-delay: 0.2s; }
    #orb-container.show .orb:nth-child(5),
    #orb-container.show .orb-divider:nth-child(5) { transition-delay: 0.25s; }
    #orb-container.show .orb:nth-child(6),
    #orb-container.show .orb-divider:nth-child(6) { transition-delay: 0.3s; }
    #orb-container.show .orb:nth-child(7),
    #orb-container.show .orb-divider:nth-child(7) { transition-delay: 0.35s; }
    #orb-container.show .orb:nth-child(8),
    #orb-container.show .orb-divider:nth-child(8) { transition-delay: 0.4s; }
    #orb-container.show .orb:nth-child(9),
    #orb-container.show .orb-divider:nth-child(9) { transition-delay: 0.45s; }
  `;
  document.head.appendChild(style);

  // 检测是否为触摸设备
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    // 移动端:点击容器区域显示/隐藏
    let isVisible = false;

    container.addEventListener('click', function(e) {
      // 如果点击的是小球本身,不切换状态(让小球的功能正常工作)
      if (e.target.classList.contains('orb')) {
        return;
      }
      e.stopPropagation();
      isVisible = !isVisible;
      container.classList.toggle('show', isVisible);
    });

    // 点击其他地方隐藏
    document.addEventListener('click', function(e) {
      if (isVisible && !container.contains(e.target)) {
        isVisible = false;
        container.classList.remove('show');
      }
    });
  } else {
    // 桌面端:鼠标悬停显示/隐藏
    container.addEventListener('mouseenter', function() {
      container.classList.add('show');
    });

    container.addEventListener('mouseleave', function() {
      container.classList.remove('show');
    });
  }
})();