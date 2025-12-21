(function() {
  const locationSpan = document.getElementById('header-location');
  
  if (!locationSpan) {
    console.error('未找到 header-location 元素');
    return;
  }
  
  function updateLocationDisplay() {
    const currentValue = locationSpan.textContent.trim();
    const hasDaily = currentValue.startsWith('[日常]');
    
    // 更新鼠标悬浮提示
    locationSpan.title = hasDaily ? '点击去除日常标签' : '点击加上日常标签';
    
    // 添加视觉提示（可选）
    locationSpan.style.cursor = 'pointer';
  }
  
  // 点击事件处理
  locationSpan.addEventListener('click', async function() {
    const currentValue = locationSpan.textContent.trim();
    const hasDaily = currentValue.startsWith('[日常]');
    
    let newValue;
    let command;
    
    if (hasDaily) {
      // 去除"[日常]"前缀
      newValue = currentValue.replace(/^\[日常\]/, '').trim();
      command = `set_status('user.current_location','${newValue}');`;
    } else {
      // 添加"[日常]"前缀
      newValue = '[日常]' + currentValue;
      command = `set_status('user.current_location','${newValue}');`;
    }
    
    try {
      // 执行指令
      await worldHelper.processUpdateMemoryCommands(command);
      
      // 更新显示值
      locationSpan.textContent = newValue;
      
      // 更新悬浮提示
      updateLocationDisplay();
      
      console.log('位置标签更新成功:', newValue);
    } catch (error) {
      console.error('更新位置标签失败:', error);
    }
  });
  
  // 初始化显示
  updateLocationDisplay();
})();