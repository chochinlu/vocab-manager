import { useState, useCallback } from 'react';
import {
  getPracticeFeedback,
  calculateProficiencyLevel,
  updateErrorPatterns
} from '../services/practice.service';

/**
 * Practice Session Hook
 * Manages practice flow, feedback, and statistics
 */
export const usePracticeSession = (vocab, onUpdateVocab) => {
  const [sentence, setSentence] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Get current practice stats
  const practiceStats = vocab?.practiceStats || {
    totalPractices: 0,
    lastPracticeDate: null,
    proficiencyLevel: 'beginner',
    commonErrors: [],
    averageScore: 0,
    recentScores: []
  };

  /**
   * Submit sentence for feedback
   */
  const submitForFeedback = useCallback(async () => {
    if (!sentence.trim()) {
      setError('請先輸入例句');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await getPracticeFeedback(
        vocab.word,
        vocab.partOfSpeech,
        sentence
      );

      setFeedback(result);

      // Update practice statistics
      const newRecentScores = [...practiceStats.recentScores, result.score].slice(-3);
      const newAverageScore = newRecentScores.reduce((sum, s) => sum + s, 0) / newRecentScores.length;
      const newTotalPractices = practiceStats.totalPractices + 1;

      const updatedErrorPatterns = updateErrorPatterns(
        practiceStats.commonErrors,
        result.errors,
        5
      );

      const newProficiencyLevel = calculateProficiencyLevel(
        newRecentScores,
        newTotalPractices
      );

      const updatedStats = {
        totalPractices: newTotalPractices,
        lastPracticeDate: new Date().toISOString(),
        proficiencyLevel: newProficiencyLevel,
        commonErrors: updatedErrorPatterns,
        averageScore: Math.round(newAverageScore),
        recentScores: newRecentScores
      };

      // Update vocab with new stats
      const updatedVocab = {
        ...vocab,
        practiceStats: updatedStats
      };

      onUpdateVocab(updatedVocab);

    } catch (err) {
      console.error('批改失敗:', err);
      setError(err.message || '批改失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  }, [sentence, vocab, practiceStats, onUpdateVocab]);

  /**
   * Clear current session
   */
  const clearSession = useCallback(() => {
    setSentence('');
    setFeedback(null);
    setError(null);
  }, []);

  /**
   * Continue practicing (keep stats but clear current attempt)
   */
  const continuePractice = useCallback(() => {
    setSentence('');
    setFeedback(null);
    setError(null);
  }, []);

  /**
   * Add current sentence to vocab examples
   */
  const addToExamples = useCallback(() => {
    if (!feedback || !feedback.improvedVersion) {
      return;
    }

    const updatedVocab = {
      ...vocab,
      examples: {
        ...vocab.examples,
        original: [...(vocab.examples?.original || []), feedback.improvedVersion]
      }
    };

    onUpdateVocab(updatedVocab);
  }, [feedback, vocab, onUpdateVocab]);

  return {
    // State
    sentence,
    setSentence,
    feedback,
    isSubmitting,
    error,
    practiceStats,

    // Actions
    submitForFeedback,
    clearSession,
    continuePractice,
    addToExamples
  };
};
