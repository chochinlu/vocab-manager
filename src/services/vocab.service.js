/**
 * 單字服務 - 處理單字資料的 CRUD 操作
 */

/**
 * 載入所有單字
 * @returns {Promise<Array>}
 */
export const loadVocabs = async () => {
  try {
    const result = await window.storage.list('vocab:');
    if (result && result.keys) {
      const vocabPromises = result.keys.map(async (key) => {
        const data = await window.storage.get(key);
        return data ? JSON.parse(data.value) : null;
      });
      const loadedVocabs = (await Promise.all(vocabPromises)).filter(Boolean);
      return loadedVocabs.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
    }
    return [];
  } catch {
    console.log('首次使用,尚無資料');
    return [];
  }
};

/**
 * 儲存單字（新增或更新）
 * @param {Object} vocabData - 單字資料
 * @param {Object|null} editingVocab - 正在編輯的單字（null 表示新增）
 * @returns {Promise<Object>} 儲存後的單字物件
 */
export const saveVocab = async (vocabData, editingVocab = null) => {
  const vocab = {
    id: editingVocab ? editingVocab.id : `vocab:${vocabData.word}-${vocabData.partOfSpeech}-${Date.now()}`,
    word: vocabData.word.trim(),
    partOfSpeech: vocabData.partOfSpeech,
    addedDate: editingVocab ? editingVocab.addedDate : new Date().toISOString(),
    definitions: {
      chinese: vocabData.definitionChinese || '',
      english: vocabData.definitionEnglish || ''
    },
    examples: {
      original: vocabData.examplesOriginal?.filter(e => e.trim()) || [],
      myOwn: vocabData.myExample || '',
      aiCorrected: vocabData.aiCorrected || ''
    },
    pronunciation: {
      phonetic: vocabData.phonetic || '',
      audioUrl: vocabData.audioUrl || '',
      audioUrlUK: vocabData.audioUrlUK || '',
      audioUrlUS: vocabData.audioUrlUS || ''
    },
    context: vocabData.context || { source: '', scenario: '', url: '' },
    tags: vocabData.tags || [],
    reviewHistory: editingVocab ? editingVocab.reviewHistory : []
  };

  await window.storage.set(vocab.id, JSON.stringify(vocab));
  return vocab;
};

/**
 * 刪除單字
 * @param {string} id - 單字 ID
 * @returns {Promise<void>}
 */
export const deleteVocab = async (id) => {
  await window.storage.delete(id);
};

/**
 * 取得指定日期範圍的單字數量統計
 * @param {Array} vocabs - 所有單字陣列
 * @param {string} dateFilter - 日期篩選條件 ('today' | 'week' | 'month' | 'all')
 * @returns {number}
 */
export const getVocabCountByDateFilter = (vocabs, dateFilter) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  return vocabs.filter(v => {
    const vocabDate = new Date(v.addedDate);
    if (dateFilter === 'today') return vocabDate >= today;
    if (dateFilter === 'week') return vocabDate >= weekAgo;
    if (dateFilter === 'month') return vocabDate >= monthAgo;
    return true;
  }).length;
};
