/**
 * 語音服務 - 使用 Web Speech API 提供發音功能
 */

/**
 * 播放文字發音
 * @param {string} text - 要播放的文字
 * @param {string} accent - 口音 ('uk' | 'us')
 * @param {boolean} isSentence - 是否為句子（影響語速）
 * @returns {Promise<void>}
 */
export const playPronunciation = (text, accent = 'us', isSentence = false) => {
  return new Promise((resolve, reject) => {
    if (!text) {
      reject(new Error('沒有文字可以播放'));
      return;
    }

    // 檢查瀏覽器支援
    if (!('speechSynthesis' in window)) {
      reject(new Error('您的瀏覽器不支援語音合成功能'));
      return;
    }

    // 停止當前播放
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // 句子用正常速度,單字稍微慢一點
    utterance.rate = isSentence ? 0.9 : 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    // 設定語言
    if (accent === 'uk') {
      utterance.lang = 'en-GB'; // 英式英文
    } else {
      utterance.lang = 'en-US'; // 美式英文
    }

    // 播放結束後
    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = () => {
      reject(new Error('播放失敗,請確認瀏覽器支援該語言'));
    };

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * 停止當前播放
 */
export const stopPronunciation = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * 檢查瀏覽器是否支援語音合成
 * @returns {boolean}
 */
export const isSpeechSynthesisSupported = () => {
  return 'speechSynthesis' in window;
};
