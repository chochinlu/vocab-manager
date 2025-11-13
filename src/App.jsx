import React, { useState } from 'react';
import './utils/storage';

// Hooks
import { useVocabs } from './hooks/useVocabs';
import { useVocabFilters } from './hooks/useVocabFilters';
import { useVocabForm } from './hooks/useVocabForm';
import { useAIFeatures } from './hooks/useAIFeatures';

// Components
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { Header } from './components/Layout/Header';
import { FilterBar } from './components/Search/FilterBar';
import { VocabForm } from './components/Form/VocabForm';
import { VocabList } from './components/VocabList/VocabList';

/**
 * 主應用程式組件
 * 整合所有功能模組
 */
const VocabManager = () => {
  // UI 狀態
  const [showAddForm, setShowAddForm] = useState(false);

  // 單字資料管理
  const { vocabs, loading, saveVocab, deleteVocab } = useVocabs();

  // 篩選與排序
  const {
    searchTerm,
    setSearchTerm,
    filterPos,
    setFilterPos,
    filterTag,
    setFilterTag,
    sortBy,
    setSortBy,
    filterDate,
    setFilterDate,
    allTags,
    filteredVocabs,
    stats
  } = useVocabFilters(vocabs);

  // 表單管理
  const {
    formData,
    setFormData,
    editingVocab,
    newTag,
    setNewTag,
    loadVocabToForm,
    resetForm,
    validateForm,
    addTag,
    removeTag
  } = useVocabForm();

  // AI 功能
  const {
    isCheckingSpelling,
    spellingSuggestions,
    isCorrectingExample,
    isFetchingFreeDictionary,
    isFetchingCambridge,
    checkSpelling,
    correctExample,
    fetchFreeDictionary,
    fetchCambridge,
    clearSpellingSuggestions
  } = useAIFeatures();

  // 處理表單切換
  const handleToggleForm = () => {
    if (showAddForm) {
      setShowAddForm(false);
      resetForm();
    } else {
      setShowAddForm(true);
    }
  };

  // 處理儲存單字
  const handleSaveVocab = async () => {
    try {
      validateForm();
      await saveVocab(formData, editingVocab);
      resetForm();
      setShowAddForm(false);
      alert(editingVocab ? '✅ 單字已更新!' : '✅ 單字已新增!');
    } catch (error) {
      alert(error.message);
    }
  };

  // 處理刪除單字
  const handleDeleteVocab = async (id) => {
    if (!confirm('確定要刪除這個單字嗎?')) return;

    try {
      await deleteVocab(id);
      alert('✅ 單字已刪除!');
    } catch (error) {
      alert('刪除失敗: ' + error.message);
    }
  };

  // 處理編輯單字
  const handleEditVocab = (vocab) => {
    loadVocabToForm(vocab);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 處理拼字檢查
  const handleCheckSpelling = async () => {
    await checkSpelling(formData.word);
  };

  // 使用拼字建議
  const handleUseSuggestion = (suggestion) => {
    setFormData({ ...formData, word: suggestion });
    clearSpellingSuggestions();
  };

  // 處理例句修正
  const handleCorrectExample = async () => {
    try {
      const corrected = await correctExample(
        formData.word,
        formData.partOfSpeech,
        formData.myExample
      );
      setFormData({ ...formData, aiCorrected: corrected });
    } catch {
      // 錯誤已在 hook 中處理
    }
  };

  // 處理字典查詢
  const handleFetchFreeDictionary = async () => {
    try {
      const data = await fetchFreeDictionary(formData.word, formData.partOfSpeech);
      setFormData({
        ...formData,
        phonetic: data.phonetic || formData.phonetic,
        definitionEnglish: data.definition || formData.definitionEnglish,
        audioUrlUK: data.audioUrlUK || formData.audioUrlUK,
        audioUrlUS: data.audioUrlUS || formData.audioUrlUS,
        examplesOriginal: data.examples && data.examples.length > 0
          ? data.examples
          : formData.examplesOriginal
      });
    } catch {
      // 錯誤已在 hook 中處理
    }
  };

  const handleFetchCambridge = async () => {
    try {
      const data = await fetchCambridge(formData.word, formData.partOfSpeech);
      setFormData({
        ...formData,
        phonetic: data.phonetic || formData.phonetic,
        definitionEnglish: data.definition || formData.definitionEnglish,
        examplesOriginal: data.examples && data.examples.length > 0
          ? data.examples
          : formData.examplesOriginal
      });
    } catch {
      // 錯誤已在 hook 中處理
    }
  };

  // 新增例句欄位
  const handleAddExampleField = () => {
    setFormData({
      ...formData,
      examplesOriginal: [...formData.examplesOriginal, '']
    });
  };

  // 載入中畫面
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* 頁首 */}
        <Header
          stats={stats}
          onToggleForm={handleToggleForm}
        />

        {/* 篩選列 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterPos={filterPos}
            onFilterPosChange={setFilterPos}
            filterTag={filterTag}
            onFilterTagChange={setFilterTag}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            filterDate={filterDate}
            onFilterDateChange={setFilterDate}
            allTags={allTags}
            stats={stats}
          />

          <div className="text-sm text-gray-600 mt-4">
            顯示 {filteredVocabs.length} 個單字
          </div>
        </div>

        {/* 新增/編輯表單 */}
        {showAddForm && (
          <VocabForm
            formData={formData}
            editingVocab={editingVocab}
            newTag={newTag}
            spellingSuggestions={spellingSuggestions}
            isCheckingSpelling={isCheckingSpelling}
            isCorrectingExample={isCorrectingExample}
            isFetchingFreeDictionary={isFetchingFreeDictionary}
            isFetchingCambridge={isFetchingCambridge}
            onFormDataChange={setFormData}
            onNewTagChange={setNewTag}
            onCheckSpelling={handleCheckSpelling}
            onUseSuggestion={handleUseSuggestion}
            onClearSuggestions={clearSpellingSuggestions}
            onCorrectExample={handleCorrectExample}
            onFetchFreeDictionary={handleFetchFreeDictionary}
            onFetchCambridge={handleFetchCambridge}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            onAddExampleField={handleAddExampleField}
            onSave={handleSaveVocab}
            onCancel={() => {
              resetForm();
              setShowAddForm(false);
            }}
          />
        )}

        {/* 單字列表 */}
        <VocabList
          vocabs={filteredVocabs}
          totalCount={vocabs.length}
          onEdit={handleEditVocab}
          onDelete={handleDeleteVocab}
        />
      </div>
    </div>
  );
};

export default VocabManager;
