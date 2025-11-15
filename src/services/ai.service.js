/**
 * AI Service - Call Claude through local Express API
 */

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Correct Chinglish example sentence
 * @param {string} word - Word
 * @param {string} partOfSpeech - Part of speech
 * @param {string} example - Student-written example
 * @returns {Promise<Object>} { corrected, containsTarget, suggestion }
 */
export const correctExample = async (word, partOfSpeech, example) => {
  if (!example.trim()) {
    throw new Error('Please enter your example sentence first');
  }

  const response = await fetch(`${API_BASE_URL}/ai/correct-example`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, partOfSpeech, example })
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();
  const textContent = data.content[0].text.trim();

  // 嘗試解析 JSON 回應
  try {
    // 清除可能的 markdown 標記
    const cleanJson = textContent
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const result = JSON.parse(cleanJson);

    return {
      corrected: result.corrected || textContent,
      containsTarget: result.containsTarget !== false, // Default to true
      suggestion: result.suggestion || null
    };
  } catch (parseError) {
    // If unable to parse, return legacy format (backward compatible)
    console.warn('Failed to parse AI response as JSON, using legacy format:', parseError);
    return {
      corrected: textContent,
      containsTarget: true,
      suggestion: null
    };
  }
};

/**
 * Check spelling and provide suggestions
 * @param {string} word - Word to check
 * @returns {Promise<Object>} { isCorrect, message, suggestions }
 */
export const checkSpelling = async (word) => {
  if (!word.trim()) {
    throw new Error('Please enter a word');
  }

  const response = await fetch(`${API_BASE_URL}/ai/spell-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word })
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();
  const textContent = data.content
    .filter(item => item.type === 'text')
    .map(item => item.text)
    .join('\n');

  let cleanJson = textContent.trim()
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '');

  try {
    const result = JSON.parse(cleanJson);
    return {
      isCorrect: result.isCorrect,
      message: result.message,
      suggestions: result.suggestions || []
    };
  } catch (parseError) {
    console.error('Parse error:', parseError);
    throw new Error('Spell check failed, please try again later');
  }
};

/**
 * Extract JSON (helper function)
 * @param {string} text - Text containing JSON
 * @returns {Object|null}
 */
const extractJSON = (text) => {
  const cleanText = text.trim()
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '');

  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
    const jsonStr = cleanText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonStr);
  }

  if (cleanText.includes('null')) {
    return null;
  }

  throw new Error('Unable to extract JSON');
};

export { extractJSON };
