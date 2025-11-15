/**
 * 應用程式常數定義
 */

// Part of Speech Options
export const POS_OPTIONS = [
  { value: 'verb', label: 'Verb (v.)' },
  { value: 'noun', label: 'Noun (n.)' },
  { value: 'adjective', label: 'Adjective (adj.)' },
  { value: 'adverb', label: 'Adverb (adv.)' },
  { value: 'phrasal-verb', label: 'Phrasal Verb (phr. v.)' },
  { value: 'phrase', label: 'Phrase/Idiom' },
  { value: 'other', label: 'Other' }
];

// Sort Options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'alphabetical', label: 'Alphabetical' }
];

// Date Filter Options
export const DATE_FILTER_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All' }
];
