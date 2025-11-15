import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import { playPronunciation } from '../../services/speech.service';

/**
 * Pronunciation Button Component
 * @param {string} text - Text to play
 * @param {string} accent - Accent ('uk' | 'us')
 * @param {boolean} isSentence - Is it a sentence
 * @param {string} label - Button label
 */
export const PronunciationButton = ({ text, accent = 'us', isSentence = false, label }) => {
  const { showError } = useToastContext();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (!text) return;

    setIsPlaying(true);
    try {
      await playPronunciation(text, accent, isSentence);
    } catch (error) {
      console.error('Playback failed:', error);
      showError(error.message);
    } finally {
      setIsPlaying(false);
    }
  };

  const colorClass = accent === 'uk' ? 'text-green-600 hover:text-green-800 hover:bg-green-50' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50';
  const title = label || (accent === 'uk' ? 'British Pronunciation' : 'American Pronunciation');

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
 * Pronunciation Button Group (British + American)
 */
export const PronunciationGroup = ({ text, isSentence = false, className = '' }) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      <PronunciationButton text={text} accent="uk" isSentence={isSentence} />
      <PronunciationButton text={text} accent="us" isSentence={isSentence} />
    </div>
  );
};
