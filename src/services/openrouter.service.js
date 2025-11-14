/**
 * OpenRouter AI 服務 - 透過本地 Express API 呼叫 OpenRouter
 * 使用免費模型: qwen/qwen-2.5-72b-instruct:free
 */

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * 翻譯英文例句成繁體中文
 * @param {string} text - 要翻譯的英文文字
 * @returns {Promise<string>} 繁體中文翻譯
 */
export const translateToTraditionalChinese = async (text) => {
  if (!text.trim()) {
    throw new Error('請提供要翻譯的文字');
  }

  const response = await fetch(`${API_BASE_URL}/openrouter/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '翻譯請求失敗');
  }

  const data = await response.json();
  return data.translation.trim();
};

/**
 * 檢查英文拼字並提供建議
 * @param {string} word - 要檢查的單字
 * @returns {Promise<Object>} { isCorrect, isCorrectable, message, suggestions }
 */
export const checkSpelling = async (word) => {
  if (!word.trim()) {
    throw new Error('請輸入單字');
  }

  const response = await fetch(`${API_BASE_URL}/openrouter/spell-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '拼字檢查請求失敗');
  }

  const data = await response.json();

  return {
    isCorrect: data.isCorrect,
    isCorrectable: data.isCorrectable,
    message: data.message,
    suggestions: data.suggestions || []
  };
};
