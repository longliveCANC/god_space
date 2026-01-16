(function() {
    // 1. 基础检查
    if (typeof window.NovaHooks === 'undefined') {
        console.error('[Sound Alert Plugin] NovaHooks system not found. Plugin will not be loaded.');
        return;
    }

    // 2. 音效管理
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // 根据 batches 值生成不同的音效
    function playSound(batches) {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const now = audioContext.currentTime;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // 根据 batches 值选择不同的音调和模式
        if (batches === 1) {
            // batches 1: 单个短音效，频率 800Hz
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
        } else if (batches === 2) {
            // batches 2: 双音效，频率 600Hz 和 800Hz，持续时间更长
            oscillator.frequency.setValueAtTime(600, now);
            oscillator.frequency.setValueAtTime(800, now + 0.1);
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            oscillator.start(now);
            oscillator.stop(now + 0.4);
        } else {
            // 默认音效
            oscillator.frequency.value = 700;
            oscillator.type = 'triangle';
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
        }
    }

    // 3. 钩子回调函数
    async function onBeforeSave(hookData) {
        try {
         
            if (typeof batches === 'number') {
                playSound(batches);
                console.log(`[Sound Alert Plugin] Sound played for batches: ${batches}`);
            } else {
                console.warn('[Sound Alert Plugin] batches variable not found or invalid.');
            }
        } catch (error) {
            console.error('[Sound Alert Plugin] Error playing sound:', error);
        }
        return hookData;
    }

    // 4. 注册钩子
    window.NovaHooks.add('before_ai_response_save', onBeforeSave);

    console.log('[Sound Alert Plugin] Loaded.');
})();