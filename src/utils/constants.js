/**
 * 應用程式常數定義
 */

// 詞性選項
export const POS_OPTIONS = [
  { value: 'verb', label: '動詞 (v.)' },
  { value: 'noun', label: '名詞 (n.)' },
  { value: 'adjective', label: '形容詞 (adj.)' },
  { value: 'adverb', label: '副詞 (adv.)' },
  { value: 'phrasal-verb', label: '片語動詞 (phr. v.)' },
  { value: 'phrase', label: '片語/慣用語' },
  { value: 'other', label: '其他' }
];

// 排序選項
export const SORT_OPTIONS = [
  { value: 'newest', label: '最新優先' },
  { value: 'oldest', label: '最舊優先' },
  { value: 'alphabetical', label: '字母順序' }
];

// 日期篩選選項
export const DATE_FILTER_OPTIONS = [
  { value: 'today', label: '今天' },
  { value: 'week', label: '本週' },
  { value: 'month', label: '本月' },
  { value: 'all', label: '全部' }
];
