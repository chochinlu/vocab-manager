import { useState } from 'react';
import { useToastContext } from '../contexts/ToastContext';
import * as aiService from '../services/ai.service';
import * as openrouterService from '../services/openrouter.service';
import * as dictionaryService from '../services/dictionary.service';

/**
 * AI 功能整合 Hook
 * 整合拼字檢查、例句修正、字典查詢等 AI 功能
 */
export const useAIFeatures = () => {
  const { showSuccess, showError, showInfo } = useToastContext();
  const [isCheckingSpelling, setIsCheckingSpelling] = useState(false);
  const [spellingSuggestions, setSpellingSuggestions] = useState([]);
  const [isCorrectingExample, setIsCorrectingExample] = useState(false);
  const [isFetchingFreeDictionary, setIsFetchingFreeDictionary] = useState(false);
  const [isFetchingCambridge, setIsFetchingCambridge] = useState(false);

  /**
   * 檢查拼字 (使用 OpenRouter 免費模型)
   */
  const checkSpelling = async (word) => {
    if (!word.trim()) {
      showError('請先輸入單字');
      return;
    }

    setIsCheckingSpelling(true);
    setSpellingSuggestions([]);

    try {
      // 使用 OpenRouter 免費模型進行拼字檢查
      const result = await openrouterService.checkSpelling(word);

      if (result.suggestions && result.suggestions.length > 0) {
        setSpellingSuggestions(result.suggestions);
      }

      if (result.isCorrect && result.suggestions.length === 0) {
        showSuccess('拼字正確!');
      } else if (!result.isCorrect && result.message) {
        showInfo(result.message);
      }

      return result;
    } catch (error) {
      showError('拼字檢查失敗: ' + error.message);
      throw error;
    } finally {
      setIsCheckingSpelling(false);
    }
  };

  /**
   * 修正例句
   * @returns {Promise<Object>} { corrected, containsTarget, suggestion, warning }
   */
  const correctExample = async (word, partOfSpeech, example) => {
    if (!example.trim()) {
      showError('請先輸入你的例句');
      return null;
    }

    setIsCorrectingExample(true);

    try {
      const result = await aiService.correctExample(word, partOfSpeech, example);

      // 如果修正後不包含目標單字，返回警告訊息（不使用 alert）
      if (!result.containsTarget && result.suggestion) {
        return {
          ...result,
          warning: {
            word: word,
            suggestion: result.suggestion
          }
        };
      }

      return result;
    } catch (error) {
      showError('AI 修正失敗: ' + error.message);
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
      showSuccess('已從 Free Dictionary API 取得資料!');
      return data;
    } catch (error) {
      if (error.message === 'FREE_DICT_PHRASE_NOT_SUPPORTED') {
        showInfo('Free Dictionary API 主要支援單字查詢，片語建議使用「劍橋字典」按鈕，效果更好!', 5000);
      } else if (error.message === 'NOT_FOUND') {
        showError(`找不到 "${word}" 的資料`);
      } else {
        showError('抓取失敗，請改用「劍橋字典」或手動輸入');
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
      showSuccess('已從劍橋字典取得資料!');
      return data;
    } catch (error) {
      if (error.message === 'NOT_FOUND') {
        showError(`在劍橋字典找不到 "${word}" 的資料。建議：檢查單字拼寫、嘗試其他詞性或手動輸入`, 5000);
      } else {
        showError('資料解析失敗。可能是劍橋字典沒有這個單字或網路連線問題，請手動輸入或稍後再試', 5000);
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
