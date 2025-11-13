import { useState, useMemo } from 'react';

/**
 * 單字篩選與排序 Hook
 * 處理搜尋、詞性、標籤、日期篩選和排序
 */
export const useVocabFilters = (vocabs) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPos, setFilterPos] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [filterDate, setFilterDate] = useState('week');
  const [sortBy, setSortBy] = useState('newest');

  // 取得所有標籤
  const allTags = useMemo(() => {
    return [...new Set(vocabs.flatMap(v => v.tags))];
  }, [vocabs]);

  // 篩選單字
  const filteredVocabs = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return vocabs.filter(v => {
      // 搜尋過濾
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchWord = v.word.toLowerCase().includes(term);
        const matchChinese = v.definitions.chinese.toLowerCase().includes(term);
        const matchEnglish = v.definitions.english.toLowerCase().includes(term);
        if (!matchWord && !matchChinese && !matchEnglish) return false;
      }

      // 詞性過濾
      if (filterPos !== 'all' && v.partOfSpeech !== filterPos) return false;

      // 標籤過濾
      if (filterTag !== 'all' && !v.tags.includes(filterTag)) return false;

      // 日期過濾
      const vocabDate = new Date(v.addedDate);
      if (filterDate === 'today' && vocabDate < today) return false;
      if (filterDate === 'week' && vocabDate < weekAgo) return false;
      if (filterDate === 'month' && vocabDate < monthAgo) return false;

      return true;
    });
  }, [vocabs, searchTerm, filterPos, filterTag, filterDate]);

  // 排序單字
  const sortedVocabs = useMemo(() => {
    return [...filteredVocabs].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.addedDate) - new Date(a.addedDate);
      } else if (sortBy === 'oldest') {
        return new Date(a.addedDate) - new Date(b.addedDate);
      } else if (sortBy === 'alphabetical') {
        return a.word.localeCompare(b.word);
      }
      return 0;
    });
  }, [filteredVocabs, sortBy]);

  // 統計資料
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: vocabs.length,
      today: vocabs.filter(v => new Date(v.addedDate) >= today).length,
      week: vocabs.filter(v => new Date(v.addedDate) >= weekAgo).length,
      filtered: sortedVocabs.length
    };
  }, [vocabs, sortedVocabs]);

  return {
    searchTerm,
    setSearchTerm,
    filterPos,
    setFilterPos,
    filterTag,
    setFilterTag,
    filterDate,
    setFilterDate,
    sortBy,
    setSortBy,
    allTags,
    filteredVocabs: sortedVocabs,
    stats
  };
};
