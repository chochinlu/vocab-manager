import { useState } from 'react';
import * as aiService from '../services/ai.service';
import * as dictionaryService from '../services/dictionary.service';

/**
 * AI 功能整合 Hook
 * 整合拼字檢查、例句修正、字典查詢等 AI 功能
 */
export const useAIFeatures = () => {
  const [isCheckingSpelling, setIsCheckingSpelling] = useState(false);
  const [spellingSuggestions, setSpellingSuggestions] = useState([]);
  const [isCorrectingExample, setIsCorrectingExample] = useState(false);
  const [isFetchingFreeDictionary, setIsFetchingFreeDictionary] = useState(false);
  const [isFetchingCambridge, setIsFetchingCambridge] = useState(false);

  /**
   * 檢查拼字
   */
  const checkSpelling = async (word) => {
    if (!word.trim()) {
      alert('請先輸入單字');
      return;
    }

    setIsCheckingSpelling(true);
    setSpellingSuggestions([]);

    try {
      const result = await aiService.checkSpelling(word);

      if (result.suggestions && result.suggestions.length > 0) {
        setSpellingSuggestions(result.suggestions);
      }

      if (result.isCorrect && result.suggestions.length === 0) {
        alert('✅ 拼字正確!');
      }

      return result;
    } catch (error) {
      alert('拼字檢查失敗: ' + error.message);
      throw error;
    } finally {
      setIsCheckingSpelling(false);
    }
  };

  /**
   * 修正例句
   */
  const correctExample = async (word, partOfSpeech, example) => {
    if (!example.trim()) {
      alert('請先輸入你的例句');
      return;
    }

    setIsCorrectingExample(true);

    try {
      const corrected = await aiService.correctExample(word, partOfSpeech, example);
      return corrected;
    } catch (error) {
      alert('AI 修正失敗: ' + error.message);
      throw error;
    } finally {
      setIsCorrectingExample(false);
    }
  };

  /**
   * 從 Free Dictionary API 抓取資料
   */
  const fetchFreeDictionary = async (word, partOfSpeech) => {
    setIsFetchingFreeDictionary(true);

    try {
      const data = await dictionaryService.fetchFreeDictionaryData(word, partOfSpeech);
      alert('✅ 已從 Free Dictionary API 取得資料!');
      return data;
    } catch (error) {
      if (error.message === 'FREE_DICT_PHRASE_NOT_SUPPORTED') {
        alert('💡 Free Dictionary API 主要支援單字查詢\n\n片語建議使用「劍橋字典」按鈕,效果更好!');
      } else if (error.message === 'NOT_FOUND') {
        alert(`❌ 找不到 "${word}" 的資料`);
      } else {
        alert('⚠️ 抓取失敗,請改用「劍橋字典」或手動輸入');
      }
      throw error;
    } finally {
      setIsFetchingFreeDictionary(false);
    }
  };

  /**
   * 從劍橋字典抓取資料
   */
  const fetchCambridge = async (word, partOfSpeech) => {
    setIsFetchingCambridge(true);

    try {
      const data = await dictionaryService.fetchCambridgeData(word, partOfSpeech);
      alert('✅ 已從劍橋字典取得資料!');
      return data;
    } catch (error) {
      if (error.message === 'NOT_FOUND') {
        alert(`❌ 在劍橋字典找不到 "${word}" 的資料\n\n建議:\n1. 檢查單字拼寫\n2. 嘗試其他詞性\n3. 手動輸入資料`);
      } else {
        alert('⚠️ 資料解析失敗。可能原因:\n1. 劍橋字典沒有這個單字\n2. 網路連線問題\n\n請手動輸入或稍後再試');
      }
      throw error;
    } finally {
      setIsFetchingCambridge(false);
    }
  };

  /**
   * 清除拼字建議
   */
  const clearSpellingSuggestions = () => {
    setSpellingSuggestions([]);
  };

  return {
    // 狀態
    isCheckingSpelling,
    spellingSuggestions,
    isCorrectingExample,
    isFetchingFreeDictionary,
    isFetchingCambridge,

    // 方法
    checkSpelling,
    correctExample,
    fetchFreeDictionary,
    fetchCambridge,
    clearSpellingSuggestions
  };
};
