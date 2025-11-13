/**
 * AI 服務 - 使用 Anthropic Claude API 提供智慧功能
 */

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

/**
 * 呼叫 Claude API
 * @param {string} prompt - 使用者提示
 * @param {Array} tools - 工具陣列（可選）
 * @param {number} maxTokens - 最大 token 數
 * @returns {Promise<Object>}
 */
const callClaudeAPI = async (prompt, tools = null, maxTokens = 1000) => {
  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    messages: [{
      role: 'user',
      content: prompt
    }]
  };

  if (tools) {
    body.tools = tools;
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`API 請求失敗: ${response.status}`);
  }

  return await response.json();
};

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

  const prompt = `你是英文教學專家,專門幫華人改進中式英文。

單字: ${word} (${partOfSpeech})
學生寫的例句: "${example}"

請直接回傳修正後的例句,不要其他說明。如果句子完全正確,就回傳原句。`;

  const data = await callClaudeAPI(prompt);
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

  const prompt = `分析這個英文單字: "${word}"

請判斷:
1. 這是否是正確的英文單字?
2. 如果是複數形式,單數是什麼?
3. 如果拼字可能有錯,提供正確的拼法建議
4. 如果是常見錯誤(如打錯、多字母、少字母),提供建議

回傳 JSON 格式(不要 markdown):
{
  "isCorrect": true/false,
  "isCorrectable": true/false,
  "message": "簡短說明",
  "suggestions": ["建議1", "建議2", "建議3"]
}

如果單字完全正確且不是複數,suggestions 為空陣列。
如果是複數形式,suggestions 應包含單數形式。`;

  const data = await callClaudeAPI(prompt);
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
