import { useState, useEffect } from 'react';
import * as vocabService from '../services/vocab.service';

/**
 * 單字資料管理 Hook
 * 負責載入、新增、更新、刪除單字
 */
export const useVocabs = () => {
  const [vocabs, setVocabs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 載入所有單字
  useEffect(() => {
    loadVocabs();
  }, []);

  const loadVocabs = async () => {
    try {
      setLoading(true);
      const loadedVocabs = await vocabService.loadVocabs();
      setVocabs(loadedVocabs);
    } catch (error) {
      console.error('Failed to load words:', error);
      setVocabs([]);
    } finally {
      setLoading(false);
    }
  };

  // 儲存單字（新增或更新）
  const saveVocab = async (vocabData, editingVocab = null) => {
    try {
      const savedVocab = await vocabService.saveVocab(vocabData, editingVocab);

      if (editingVocab) {
        // 更新現有單字
        setVocabs(prev => prev.map(v => v.id === savedVocab.id ? savedVocab : v));
      } else {
        // 新增單字
        setVocabs(prev => [savedVocab, ...prev]);
      }

      return savedVocab;
    } catch (error) {
      console.error('Failed to save word:', error);
      throw error;
    }
  };

  // 刪除單字
  const deleteVocab = async (id) => {
    try {
      await vocabService.deleteVocab(id);
      setVocabs(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      console.error('Failed to delete word:', error);
      throw error;
    }
  };

  return {
    vocabs,
    loading,
    loadVocabs,
    saveVocab,
    deleteVocab
  };
};
