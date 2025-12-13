function filterString(rawString, trimStrings, { characterOverride } = {}) {
    // 🔍 添加调试代码
    console.log('[assa] === filterString Debug ===');
    console.log('[assa] rawString:', rawString);
    console.log('[assa] rawString type:', typeof rawString);
    console.log('[assa] trimStrings:', trimStrings);
    
    let finalString = rawString;
    
    // 🔍 添加类型检查和保护
    if (typeof finalString !== 'string') {
        console.error('❌ [assa] finalString is not a string!', {
            value: finalString,
            type: typeof finalString,
            trimStrings: trimStrings
        });
        // 尝试转换为字符串
        finalString = String(finalString || '');
    }
    
    trimStrings.forEach((trimString) => {
        console.log('[assa] Processing trimString:', trimString); // 🔍 调试每个 trimString
        
        const subTrimString = substituteParams(trimString, undefined, characterOverride);
        console.log('[assa] After substituteParams:', subTrimString); // 🔍 查看替换后的值
        
        finalString = finalString.replaceAll(subTrimString, '');
    });

    console.log('[assa] Final result:', finalString);
    return finalString;
}
