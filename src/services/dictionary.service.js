/**
 * 字典服務 - 透過本地 Express API 整合字典功能
 */

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Part of Speech Options
 */
const POS_OPTIONS = [
  { value: 'verb', label: 'Verb (v.)' },
  { value: 'noun', label: 'Noun (n.)' },
  { value: 'adjective', label: 'Adjective (adj.)' },
  { value: 'adverb', label: 'Adverb (adv.)' },
  { value: 'phrasal-verb', label: 'Phrasal Verb (phr. v.)' },
  { value: 'phrase', label: 'Phrase/Idiom' },
  { value: 'other', label: 'Other' }
];

/**
 * 從 Free Dictionary API 抓取單字資料
 * @param {string} word - 單字
 * @param {string} partOfSpeech - 詞性
 * @returns {Promise<Object>} { phonetic, definition, audioUrlUK, audioUrlUS, examples }
 */
export const fetchFreeDictionaryData = async (word, partOfSpeech) => {
  if (!word.trim()) {
    throw new Error('Please enter a word or phrase');
  }

  const cleanWord = word.trim().toLowerCase();

  // 檢查是否為片語
  if (cleanWord.includes(' ')) {
    throw new Error('FREE_DICT_PHRASE_NOT_SUPPORTED');
  }

  // Step 1: Call local API
  const response = await fetch(`${API_BASE_URL}/dictionary/free`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: cleanWord, partOfSpeech })
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();
  const rawText = data.content
    .filter(item => item.type === 'text')
    .map(item => item.text)
    .join('\n')
    .trim();

  console.log('Free Dictionary raw data:', rawText);

  // Step 2: Use AI to organize into pure JSON
  const extractResponse = await fetch(`${API_BASE_URL}/dictionary/free`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: cleanWord, partOfSpeech })
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

  throw new Error('Failed to extract data');
};

/**
 * 從劍橋字典抓取單字資料
 * @param {string} word - 單字
 * @param {string} partOfSpeech - 詞性
 * @returns {Promise<Object>} { phonetic, definition, examples }
 */
export const fetchCambridgeData = async (word, partOfSpeech) => {
  if (!word.trim()) {
    throw new Error('Please enter a word');
  }

  const cleanWord = word.trim().toLowerCase();
  const posLabel = POS_OPTIONS.find(p => p.value === partOfSpeech)?.label || partOfSpeech;

  const response = await fetch(`${API_BASE_URL}/dictionary/cambridge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: cleanWord, partOfSpeech, posLabel })
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
    throw new Error('Please enter a word');
  }
  const cleanWord = word.trim().toLowerCase().replace(/\s+/g, '-');
  const url = `https://dictionary.cambridge.org/dictionary/english/${cleanWord}`;
  window.open(url, '_blank');
};
