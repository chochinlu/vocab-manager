/**
 * AI 服務 - 透過本地 Express API 呼叫 Claude
 */

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * 修正中式英文例句
 * @param {string} word - 單字
 * @param {string} partOfSpeech - 詞性
 * @param {string} example - 學生寫的例句
 * @returns {Promise<string>} 修正後的例句
 */
export const correctExample = async (word, partOfSpeech, example) => {
  if (!example.trim()) {
    throw new Error('請先輸入你的例句');
  }

  const response = await fetch(`${API_BASE_URL}/ai/correct-example`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, partOfSpeech, example })
  });

  if (!response.ok) {
    throw new Error('API 請求失敗');
  }

  const data = await response.json();
  return data.content[0].text.trim();
};

/**
 * 檢查拼字並提供建議
 * @param {string} word - 要檢查的單字
 * @returns {Promise<Object>} { isCorrect, message, suggestions }
 */
export const checkSpelling = async (word) => {
  if (!word.trim()) {
    throw new Error('請輸入單字');
  }

  const response = await fetch(`${API_BASE_URL}/ai/spell-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word })
  });

  if (!response.ok) {
    throw new Error('API 請求失敗');
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
    throw new Error('拼字檢查失敗,請稍後再試');
  }
};

/**
 * 提取 JSON（輔助函數）
 * @param {string} text - 包含 JSON 的文字
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

  throw new Error('無法提取 JSON');
};

export { extractJSON };
