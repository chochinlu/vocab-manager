import { useState } from 'react';

const initialFormData = {
  word: '',
  partOfSpeech: 'verb',
  definitionChinese: '',
  definitionEnglish: '',
  examplesOriginal: [''],
  myExample: '',
  aiCorrected: '',
  phonetic: '',
  audioUrl: '',
  audioUrlUK: '',
  audioUrlUS: '',
  context: { source: '', scenario: '', url: '' },
  tags: []
};

/**
 * 單字表單管理 Hook
 * 處理表單資料、驗證、重設
 */
export const useVocabForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [editingVocab, setEditingVocab] = useState(null);
  const [newTag, setNewTag] = useState('');

  // 更新表單欄位
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 更新巢狀欄位（如 context.source）
  const updateNestedField = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // 更新例句陣列
  const updateExample = (index, value) => {
    setFormData(prev => {
      const newExamples = [...prev.examplesOriginal];
      newExamples[index] = value;
      return { ...prev, examplesOriginal: newExamples };
    });
  };

  // 新增例句欄位
  const addExampleField = () => {
    setFormData(prev => ({
      ...prev,
      examplesOriginal: [...prev.examplesOriginal, '']
    }));
  };

  // 移除例句欄位
  const removeExampleField = (index) => {
    setFormData(prev => ({
      ...prev,
      examplesOriginal: prev.examplesOriginal.filter((_, i) => i !== index)
    }));
  };

  // 新增標籤
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // 移除標籤
  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // 載入單字資料到表單（編輯模式）
  const loadVocabToForm = (vocab) => {
    setEditingVocab(vocab);
    setFormData({
      word: vocab.word,
      partOfSpeech: vocab.partOfSpeech,
      definitionChinese: vocab.definitions.chinese,
      definitionEnglish: vocab.definitions.english,
      examplesOriginal: vocab.examples.original.length > 0 ? vocab.examples.original : [''],
      myExample: vocab.examples.myOwn,
      aiCorrected: vocab.examples.aiCorrected,
      phonetic: vocab.pronunciation.phonetic,
      audioUrl: vocab.pronunciation.audioUrl,
      audioUrlUK: vocab.pronunciation.audioUrlUK,
      audioUrlUS: vocab.pronunciation.audioUrlUS,
      context: vocab.context,
      tags: vocab.tags
    });
  };

  // 重設表單
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingVocab(null);
    setNewTag('');
  };

  // 驗證表單
  const validateForm = () => {
    if (!formData.word.trim()) {
      throw new Error('請輸入單字');
    }
    return true;
  };

  return {
    formData,
    setFormData,
    editingVocab,
    setEditingVocab,
    newTag,
    setNewTag,
    updateField,
    updateNestedField,
    updateExample,
    addExampleField,
    removeExampleField,
    addTag,
    removeTag,
    loadVocabToForm,
    resetForm,
    validateForm
  };
};
