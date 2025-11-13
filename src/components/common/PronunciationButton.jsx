import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { playPronunciation } from '../../services/speech.service';

/**
 * 發音按鈕組件
 * @param {string} text - 要播放的文字
 * @param {string} accent - 口音 ('uk' | 'us')
 * @param {boolean} isSentence - 是否為句子
 * @param {string} label - 按鈕標籤
 */
export const PronunciationButton = ({ text, accent = 'us', isSentence = false, label }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (!text) return;

    setIsPlaying(true);
    try {
      await playPronunciation(text, accent, isSentence);
    } catch (error) {
      console.error('播放失敗:', error);
      alert(error.message);
    } finally {
      setIsPlaying(false);
    }
  };

  const colorClass = accent === 'uk' ? 'text-green-600 hover:text-green-800 hover:bg-green-50' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50';
  const title = label || (accent === 'uk' ? '英式發音' : '美式發音');

  return (
    <button
      onClick={handlePlay}
      disabled={isPlaying}
      className={`${colorClass} p-1 rounded transition-colors disabled:opacity-50`}
      title={title}
      type="button"
    >
      <Volume2 className={`w-3 h-3 ${isPlaying ? 'animate-pulse' : ''}`} />
    </button>
  );
};

/**
 * 發音按鈕組（英式 + 美式）
 */
export const PronunciationGroup = ({ text, isSentence = false, className = '' }) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      <PronunciationButton text={text} accent="uk" isSentence={isSentence} />
      <PronunciationButton text={text} accent="us" isSentence={isSentence} />
    </div>
  );
};
