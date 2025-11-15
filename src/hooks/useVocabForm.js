import { useState } from 'react';

const initialFormData = {
  word: '',
  partOfSpeech: 'verb',
  definitionChinese: '',
  definitionEnglish: '',
  examplesOriginal: [''],
  myExample: '',
  aiCorrected: '',
  aiSuggestion: '',
  phonetic: '',
  audioUrl: '',
  audioUrlUK: '',
  audioUrlUS: '',
  context: { source: '', scenario: '', url: '' },
  tags: []
};

/**
 * Vocabulary Form Management Hook
 * Handles form data, validation, reset
 */
export const useVocabForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [editingVocab, setEditingVocab] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [warningMessage, setWarningMessage] = useState(null);

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update nested field (e.g. context.source)
  const updateNestedField = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Update example array
  const updateExample = (index, value) => {
    setFormData(prev => {
      const newExamples = [...prev.examplesOriginal];
      newExamples[index] = value;
      return { ...prev, examplesOriginal: newExamples };
    });
  };

  // Add example field
  const addExampleField = () => {
    setFormData(prev => ({
      ...prev,
      examplesOriginal: [...prev.examplesOriginal, '']
    }));
  };

  // Remove example field
  const removeExampleField = (index) => {
    setFormData(prev => ({
      ...prev,
      examplesOriginal: prev.examplesOriginal.filter((_, i) => i !== index)
    }));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Load word data into form (edit mode)
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
      aiSuggestion: vocab.examples.aiSuggestion || '',
      phonetic: vocab.pronunciation.phonetic,
      audioUrl: vocab.pronunciation.audioUrl,
      audioUrlUK: vocab.pronunciation.audioUrlUK,
      audioUrlUS: vocab.pronunciation.audioUrlUS,
      context: vocab.context,
      tags: vocab.tags
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingVocab(null);
    setNewTag('');
    setWarningMessage(null);
  };

  // Clear warning message
  const clearWarning = () => {
    setWarningMessage(null);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.word.trim()) {
      throw new Error('Please enter a word');
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
    warningMessage,
    setWarningMessage,
    updateField,
    updateNestedField,
    updateExample,
    addExampleField,
    removeExampleField,
    addTag,
    removeTag,
    loadVocabToForm,
    resetForm,
    validateForm,
    clearWarning
  };
};
