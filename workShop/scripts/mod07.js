(function() {
  // 保存原始函数
  const original_updateDerivedAttributes = window.worldHelper._updateDerivedAttributes;
  
  // 覆盖函数
  window.worldHelper._updateDerivedAttributes = function(data) {
    // 检查基础数据结构是否存在
    if (!data || !data.基础属性 || !data.衍生属性 || !data.基础技能) return;
    
    const attr = data.基础属性;
    const skills = data.基础技能;
    const derived = data.衍生属性;
    
    // 安全获取基础属性值
    const 力量 = attr.生理属性?.力量?.基础?.[0] ?? 0;
    const 敏捷 = attr.生理属性?.敏捷?.基础?.[0] ?? 0;
    const 耐力 = attr.生理属性?.耐力?.基础?.[0] ?? 0;
    const 智力 = attr.心智属性?.智力?.基础?.[0] ?? 0;
    const 感知 = attr.心智属性?.感知?.基础?.[0] ?? 0;
    const 决心 = attr.心智属性?.决心?.基础?.[0] ?? 0;
    const 风度 = attr.互动属性?.风度?.基础?.[0] ?? 0;
    const 操控 = attr.互动属性?.操控?.基础?.[0] ?? 0;
    const 沉着 = attr.互动属性?.沉着?.基础?.[0] ?? 0;
    
    // 安全获取技能值
    const 运动 = skills.生理技能?.运动?.[0] ?? 0;
    const 求生 = skills.生理技能?.求生?.[0] ?? 0;
    
    // 安全获取体积
    const 体积 = derived.体积?.[0] ?? 0;
    
    // 更新衍生属性
    if (derived.速度?.基础速度) {
        derived.速度.基础速度[0] = Math.floor((力量 + 敏捷 + 体积) / 3);
    }
    
    if (derived.先攻) {
        derived.先攻[0] = Math.floor((敏捷 + 沉着) / 2);
    }
    
    if (derived.防御?.基础防御) {
        derived.防御.基础防御[0] = Math.min(敏捷, 感知);
    }
    
     if (derived.生命值?.上限) {
        // 从 GameAPI 获取旧值
        const oldData = window.GameAPI?.playCharacterData;
        const oldMaxHP = oldData?.衍生属性?.生命值?.上限?.[0] ?? 0;
        const oldCurrentHP = oldData?.衍生属性?.生命值?.当前值?.[0] ?? 0;
        
        newMaxHP = derived.生命值.上限[0];
    
        
        if (derived.生命值.当前值) {
            // 如果新上限比旧上限高，当前值增加差值
            if (newMaxHP > oldMaxHP) {
                derived.生命值.当前值[0] = oldCurrentHP + (newMaxHP - oldMaxHP);
            }
            // 确保当前值不超过新上限
            if (derived.生命值.当前值[0] > newMaxHP) {
                derived.生命值.当前值[0] = newMaxHP;
            }
        }
    }
    
    // 意志力计算
    if (derived.意志力?.意志值 && derived.意志力?.上限) {
        const 意志值 = 决心 + 沉着;
        derived.意志力.意志值[0] = 意志值;
        derived.意志力.上限[0] = 意志值;
    }
    
    // 感知范围计算
    if (derived.感知范围?.敏感范围) {
        derived.感知范围.敏感范围[0] = 感知 * 10;
        if (derived.感知范围.模糊范围) {
            derived.感知范围.模糊范围[0] = derived.感知范围.敏感范围[0] * 10;
        }
    }
    
    // 豁免检定基础计算
    if (derived.豁免检定基础?.强韧) {
        derived.豁免检定基础.强韧[0] = Math.floor((耐力 + 求生) / 2);
    }
    if (derived.豁免检定基础?.反射) {
        derived.豁免检定基础.反射[0] = Math.floor((敏捷 + 运动) / 2);
    }
    if (derived.豁免检定基础?.意志) {
        derived.豁免检定基础.意志[0] = 决心 + 沉着;
    }
    
    // 传奇属性计算
    if (attr.生理属性?.力量?.传奇) {
        attr.生理属性.力量.传奇[0] = Math.max(0, 力量 - 8);
    }
    if (attr.生理属性?.敏捷?.传奇) {
        attr.生理属性.敏捷.传奇[0] = Math.max(0, 敏捷 - 8);
    }
    if (attr.生理属性?.耐力?.传奇) {
        attr.生理属性.耐力.传奇[0] = Math.max(0, 耐力 - 8);
    }
    if (attr.心智属性?.智力?.传奇) {
        attr.心智属性.智力.传奇[0] = Math.max(0, 智力 - 8);
    }
    if (attr.心智属性?.感知?.传奇) {
        attr.心智属性.感知.传奇[0] = Math.max(0, 感知 - 8);
    }
    if (attr.心智属性?.决心?.传奇) {
        attr.心智属性.决心.传奇[0] = Math.max(0, 决心 - 8);
    }
    if (attr.互动属性?.风度?.传奇) {
        attr.互动属性.风度.传奇[0] = Math.max(0, 风度 - 8);
    }
    if (attr.互动属性?.操控?.传奇) {
        attr.互动属性.操控.传奇[0] = Math.max(0, 操控 - 8);
    }
    if (attr.互动属性?.沉着?.传奇) {
        attr.互动属性.沉着.传奇[0] = Math.max(0, 沉着 - 8);
    }
  };

     worldHelper.showNovaAlert("血量上限已解锁");
})();