/**
 * 字典服務 - 整合 Free Dictionary API 和劍橋字典
 */

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

/**
 * 詞性選項對照表
 */
const POS_OPTIONS = [
  { value: 'verb', label: '動詞 (v.)' },
  { value: 'noun', label: '名詞 (n.)' },
  { value: 'adjective', label: '形容詞 (adj.)' },
  { value: 'adverb', label: '副詞 (adv.)' },
  { value: 'phrasal-verb', label: '片語動詞 (phr. v.)' },
  { value: 'phrase', label: '片語/慣用語' },
  { value: 'other', label: '其他' }
];

/**
 * 從 Free Dictionary API 抓取單字資料
 * @param {string} word - 單字
 * @param {string} partOfSpeech - 詞性
 * @returns {Promise<Object>} { phonetic, definition, audioUrlUK, audioUrlUS, examples }
 */
export const fetchFreeDictionaryData = async (word, partOfSpeech) => {
  if (!word.trim()) {
    throw new Error('請先輸入單字或片語');
  }

  const cleanWord = word.trim().toLowerCase();

  // 檢查是否為片語
  if (cleanWord.includes(' ')) {
    throw new Error('FREE_DICT_PHRASE_NOT_SUPPORTED');
  }

  // 步驟1: 抓取 Free Dictionary API 資料
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 3000,
      tools: [{
        type: "web_fetch_20250305",
        name: "web_fetch"
      }],
      messages: [{
        role: 'user',
        content: `Fetch https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord} and extract data for ${partOfSpeech}. Include phonetic, definition, audioUrlUK, audioUrlUS (from phonetics array), and examples.`
      }]
    })
  });

  const data = await response.json();
  const rawText = data.content
    .filter(item => item.type === 'text')
    .map(item => item.text)
    .join('\n')
    .trim();

  console.log('Free Dictionary raw data:', rawText);

  // 步驟2: 用 AI 整理成純 JSON
  const extractResponse = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Extract JSON from this Free Dictionary data for "${cleanWord}" (${partOfSpeech}):

${rawText}

Return ONLY this JSON structure:
{"phonetic":"...","definition":"...","audioUrlUK":"...","audioUrlUS":"...","examples":["..."]}

Audio URLs should be from phonetics array containing '-uk' or '-us'. Return ONLY JSON or null.`
      }]
    })
  });

  const extractData = await extractResponse.json();
  let cleanText = extractData.content
    .filter(item => item.type === 'text')
    .map(item => item.text)
    .join('')
    .trim();

  cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

  // 提取 JSON
  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
    const jsonStr = cleanText.substring(firstBrace, lastBrace + 1);
    const result = JSON.parse(jsonStr);

    if (result && typeof result === 'object') {
      return {
        phonetic: result.phonetic || '',
        definition: result.definition || '',
        audioUrlUK: result.audioUrlUK || '',
        audioUrlUS: result.audioUrlUS || '',
        examples: result.examples || []
      };
    }
  }

  if (cleanText.includes('null')) {
    throw new Error('NOT_FOUND');
  }

  throw new Error('無法提取資料');
};

/**
 * 從劍橋字典抓取單字資料
 * @param {string} word - 單字
 * @param {string} partOfSpeech - 詞性
 * @returns {Promise<Object>} { phonetic, definition, examples }
 */
export const fetchCambridgeData = async (word, partOfSpeech) => {
  if (!word.trim()) {
    throw new Error('請先輸入單字');
  }

  const cleanWord = word.trim().toLowerCase();
  const posLabel = POS_OPTIONS.find(p => p.value === partOfSpeech)?.label || partOfSpeech;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 3000,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search"
        },
        {
          type: "web_fetch_20250305",
          name: "web_fetch"
        }
      ],
      messages: [{
        role: 'user',
        content: `請幫我從劍橋字典查詢單字 "${cleanWord}" 作為 ${partOfSpeech} (${posLabel}) 的資料。

步驟:
1. 先用 web_search 搜尋: cambridge dictionary ${cleanWord}
2. 找到劍橋字典的 URL 後,用 web_fetch 抓取完整內容
3. 從網頁中找出對應詞性 (${partOfSpeech}) 的資料

然後回傳 JSON 格式(不要 markdown):
{
  "phonetic": "音標 (如 /ˈɪm.plɪ.ment/)",
  "definition": "該詞性的英文定義",
  "examples": ["例句1 (用 **粗體** 標記片語動詞或固定搭配)", "例句2"]
}

重要:
- 只抓取 ${partOfSpeech} 詞性的資料,不要其他詞性
- examples 中的片語動詞或固定搭配用 **粗體** 標記
- 如果找不到該詞性,回傳 null
- 不需要音檔 URL,我們用 Web Speech API`
      }]
    })
  });

  const data = await response.json();
  const textContent = data.content
    .filter(item => item.type === 'text')
    .map(item => item.text)
    .join('\n');

  let cleanJson = textContent.trim()
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '');

  const result = JSON.parse(cleanJson);

  if (result) {
    return {
      phonetic: result.phonetic || '',
      definition: result.definition || '',
      examples: result.examples || []
    };
  }

  throw new Error('NOT_FOUND');
};

/**
 * 開啟劍橋字典網頁
 * @param {string} word - 單字
 */
export const openCambridgeDictionary = (word) => {
  if (!word.trim()) {
    throw new Error('請先輸入單字');
  }
  const cleanWord = word.trim().toLowerCase().replace(/\s+/g, '-');
  const url = `https://dictionary.cambridge.org/dictionary/english/${cleanWord}`;
  window.open(url, '_blank');
};
