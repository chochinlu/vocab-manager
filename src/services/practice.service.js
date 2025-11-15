/**
 * Practice Service - Handle sentence practice and feedback
 */

import { settings } from '../utils/storage';

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Submit sentence for AI feedback
 * @param {string} word - Target word
 * @param {string} partOfSpeech - Part of speech
 * @param {string} sentence - Student-written sentence
 * @param {string} model - AI model to use (optional, defaults to user setting)
 * @returns {Promise<Object>} Feedback object
 */
export const getPracticeFeedback = async (word, partOfSpeech, sentence, model = null) => {
  if (!sentence.trim()) {
    throw new Error('請先輸入例句');
  }

  // Get model from parameter or user settings
  const selectedModel = model || await settings.getAIModel();

  const response = await fetch(`${API_BASE_URL}/ai/practice-feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, partOfSpeech, sentence, model: selectedModel })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API 請求失敗');
  }

  const data = await response.json();
  const textContent = data.content[0].text.trim();

  try {
    // Remove possible markdown markers
    const cleanJson = textContent
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const result = JSON.parse(cleanJson);

    return {
      score: result.score || 0,
      isCorrect: result.isCorrect || false,
      errors: result.errors || [],
      suggestions: result.suggestions || [],
      improvedVersion: result.improvedVersion || '',
      overallComment: result.overallComment || '',
      proficiencyAssessment: result.proficiencyAssessment || 'beginner'
    };
  } catch (parseError) {
    console.error('JSON 解析錯誤:', parseError);
    throw new Error('批改結果解析失敗，請稍後再試');
  }
};

/**
 * Calculate proficiency level based on practice history
 * @param {Array} recentScores - Array of recent scores
 * @param {number} totalPractices - Total number of practices
 * @returns {string} Proficiency level
 */
export const calculateProficiencyLevel = (recentScores = [], totalPractices = 0) => {
  if (totalPractices === 0 || recentScores.length === 0) {
    return 'beginner';
  }

  const averageScore = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;

  if (averageScore >= 90 && totalPractices >= 5) {
    return 'mastered';
  } else if (averageScore >= 80 && totalPractices >= 3) {
    return 'advanced';
  } else if (averageScore >= 60 && totalPractices >= 2) {
    return 'intermediate';
  } else {
    return 'beginner';
  }
};

/**
 * Update error patterns based on new feedback
 * @param {Array} existingErrors - Existing error patterns
 * @param {Array} newErrors - New errors from feedback
 * @param {number} maxPatterns - Maximum number of patterns to keep
 * @returns {Array} Updated error patterns
 */
export const updateErrorPatterns = (existingErrors = [], newErrors = [], maxPatterns = 5) => {
  const errorMap = new Map();

  // Load existing errors
  existingErrors.forEach(error => {
    errorMap.set(error.pattern, {
      type: error.type,
      pattern: error.pattern,
      count: error.count
    });
  });

  // Add new errors
  newErrors.forEach(error => {
    if (error.pattern) {
      const existing = errorMap.get(error.pattern);
      if (existing) {
        existing.count += 1;
      } else {
        errorMap.set(error.pattern, {
          type: error.type,
          pattern: error.pattern,
          count: 1
        });
      }
    }
  });

  // Convert to array and sort by count (descending)
  const patterns = Array.from(errorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, maxPatterns);

  return patterns;
};

/**
 * Get proficiency level display info
 * @param {string} level - Proficiency level
 * @returns {Object} Display info (stars, label, color)
 */
export const getProficiencyDisplay = (level) => {
  const displays = {
    beginner: {
      stars: 1,
      label: '初學',
      color: 'text-gray-500',
      bgColor: 'bg-gray-100'
    },
    intermediate: {
      stars: 2,
      label: '進步中',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    advanced: {
      stars: 3,
      label: '熟練',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    mastered: {
      stars: 4,
      label: '精通',
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    }
  };

  return displays[level] || displays.beginner;
};

/**
 * AI 模型選項
 */
export const AI_MODELS = [
  {
    value: 'haiku',
    label: 'Claude Haiku',
    description: '快速、經濟',
    speed: '快',
    cost: '低',
    quality: '中'
  },
  {
    value: 'sonnet',
    label: 'Claude Sonnet 4',
    description: '高品質批改',
    speed: '中',
    cost: '中',
    quality: '高'
  },
  {
    value: 'qwen',
    label: 'Qwen 2.5 72B',
    description: '免費模型',
    speed: '快',
    cost: '免費',
    quality: '基本'
  }
];

/**
 * Get AI model display info
 * @param {string} modelValue - Model value
 * @returns {Object} Model info
 */
export const getModelInfo = (modelValue) => {
  return AI_MODELS.find(m => m.value === modelValue) || AI_MODELS[0];
};
