import React, { useState } from 'react';
import { Check, X, RefreshCw, Plus, Edit2, Volume2, AlertTriangle, Languages, Loader2 } from 'lucide-react';
import { POS_OPTIONS } from '../../utils/constants';
import { AITools } from './AITools';
import { TagManager } from './TagManager';
import { PronunciationGroup } from '../common/PronunciationButton';
import { translateToTraditionalChinese } from '../../services/openrouter.service';

/**
 * 單字表單組件
 * 用於新增和編輯單字
 */
export const VocabForm = ({
  formData,
  editingVocab,
  newTag,
  spellingSuggestions,
  warningMessage,
  isCheckingSpelling,
  isCorrectingExample,
  isFetchingFreeDictionary,
  isFetchingCambridge,
  onFormDataChange,
  onNewTagChange,
  onCheckSpelling,
  onUseSuggestion,
  onClearSuggestions,
  onClearWarning,
  onCorrectExample,
  onFetchFreeDictionary,
  onFetchCambridge,
  onAddTag,
  onRemoveTag,
  onAddExampleField,
  onSave,
  onCancel
}) => {
  // 英文定義翻譯狀態
  const [definitionTranslation, setDefinitionTranslation] = useState(null);
  const [isTranslatingDefinition, setIsTranslatingDefinition] = useState(false);
  const [definitionTranslationError, setDefinitionTranslationError] = useState(null);

  const updateField = (field, value) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  const updateNestedField = (parent, field, value) => {
    onFormDataChange({
      ...formData,
      [parent]: { ...formData[parent], [field]: value }
    });
  };

  const updateExample = (index, value) => {
    const newExamples = [...formData.examplesOriginal];
    newExamples[index] = value;
    onFormDataChange({ ...formData, examplesOriginal: newExamples });
  };

  // 處理英文定義翻譯
  const handleTranslateDefinition = async () => {
    if (definitionTranslation) {
      setDefinitionTranslation(null);
      return;
    }

    if (!formData.definitionEnglish?.trim()) {
      return;
    }

    setIsTranslatingDefinition(true);
    setDefinitionTranslationError(null);

    try {
      const result = await translateToTraditionalChinese(formData.definitionEnglish);
      setDefinitionTranslation(result);
    } catch (err) {
      setDefinitionTranslationError(err.message);
      console.error('翻譯錯誤:', err);
    } finally {
      setIsTranslatingDefinition(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {editingVocab ? '✏️ 編輯單字' : '➕ 新增單字'}
      </h2>

      <div className="space-y-4">
        {/* 單字與詞性 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">單字或片語 *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.word}
                onChange={(e) => {
                  updateField('word', e.target.value);
                  onClearSuggestions();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="例如: implement 或 look after"
              />
              <button
                onClick={onCheckSpelling}
                disabled={isCheckingSpelling || !formData.word.trim()}
                type="button"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 flex items-center gap-2"
                title="檢查拼字"
              >
                {isCheckingSpelling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>✓</span>}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">💡 可以輸入單字或片語</p>

            {/* 拼字建議 */}
            {spellingSuggestions.length > 0 && (
              <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm font-medium text-yellow-800 mb-2">💡 建議:</p>
                <div className="flex flex-wrap gap-2">
                  {spellingSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onUseSuggestion(suggestion)}
                      type="button"
                      className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded text-sm transition"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <button
                  onClick={onClearSuggestions}
                  type="button"
                  className="mt-2 text-xs text-yellow-700 hover:text-yellow-900 underline"
                >
                  忽略建議
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">詞性 *</label>
            <select
              value={formData.partOfSpeech}
              onChange={(e) => updateField('partOfSpeech', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {POS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* AI 工具 */}
        <AITools
          word={formData.word}
          onFetchFreeDictionary={onFetchFreeDictionary}
          onFetchCambridge={onFetchCambridge}
          isFetchingFree={isFetchingFreeDictionary}
          isFetchingCambridge={isFetchingCambridge}
        />

        {/* 定義 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">中文解釋</label>
            <input
              type="text"
              value={formData.definitionChinese}
              onChange={(e) => updateField('definitionChinese', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="例如: 實作、執行"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">英文解釋</label>
            <div className="space-y-2">
              <div className="flex gap-2 group">
                <input
                  type="text"
                  value={formData.definitionEnglish}
                  onChange={(e) => {
                    updateField('definitionEnglish', e.target.value);
                    setDefinitionTranslation(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="例如: to put into operation"
                />
                {formData.definitionEnglish && (
                  <div className="flex gap-1">
                    <PronunciationGroup text={formData.definitionEnglish} isSentence />
                    <button
                      onClick={handleTranslateDefinition}
                      disabled={isTranslatingDefinition}
                      type="button"
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                        definitionTranslation
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={definitionTranslation ? '隱藏翻譯' : '翻譯成中文'}
                    >
                      {isTranslatingDefinition ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Languages className="w-3 h-3" />
                      )}
                      <span>{definitionTranslation ? '隱藏' : '翻譯'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 顯示翻譯結果 */}
              {definitionTranslation && (
                <div className="ml-2 pl-3 border-l-2 border-blue-300 bg-blue-50 rounded-r px-3 py-2">
                  <p className="text-sm text-blue-900">{definitionTranslation}</p>
                </div>
              )}

              {/* 顯示錯誤訊息 */}
              {definitionTranslationError && (
                <div className="ml-2 pl-3 border-l-2 border-red-300 bg-red-50 rounded-r px-3 py-2">
                  <p className="text-xs text-red-700">{definitionTranslationError}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 發音 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">音標</label>
          <input
            type="text"
            value={formData.phonetic}
            onChange={(e) => updateField('phonetic', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="例如: /ˈɪm.plɪ.ment/"
          />
        </div>

        {/* 語音播放 */}
        {formData.word && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-800 mb-3">🔊 試聽發音</p>
            <div className="flex gap-3">
              <PronunciationGroup text={formData.word} />
            </div>
          </div>
        )}

        {/* 原始例句 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">原始例句</label>
          <p className="text-xs text-gray-500 mb-2">💡 可以用 **粗體** 標記重點</p>
          {formData.examplesOriginal.map((example, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={example}
                onChange={(e) => updateExample(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="例如: This method is **deprecated**"
              />
              {index === formData.examplesOriginal.length - 1 && (
                <button
                  onClick={onAddExampleField}
                  type="button"
                  className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 我的例句 + AI 修正 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">我的例句</label>
          <div className="space-y-2">
            <textarea
              value={formData.myExample}
              onChange={(e) => updateField('myExample', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows="2"
              placeholder="寫你自己的例句..."
            />
            <button
              onClick={onCorrectExample}
              disabled={isCorrectingExample}
              type="button"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {isCorrectingExample ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  AI 修正中...
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  AI 修正
                </>
              )}
            </button>

            {/* 警告訊息：修正後不包含目標單字 */}
            {warningMessage && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 relative">
                <button
                  onClick={onClearWarning}
                  className="absolute top-2 right-2 text-amber-600 hover:text-amber-800 transition"
                  title="關閉警告"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-amber-900 mb-2">
                      注意：修正後的句子沒有包含單字 <span className="font-bold">"{warningMessage.word}"</span>
                    </p>
                    <div className="bg-white rounded-lg p-3 border border-amber-200">
                      <p className="text-sm font-medium text-amber-800 mb-1">💡 如果要使用 "{warningMessage.word}"，可以這樣寫：</p>
                      <p className="text-amber-900 text-sm italic">"{warningMessage.suggestion}"</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.aiCorrected && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm font-medium text-green-800 mb-1">AI 修正結果:</p>
                <p className="text-green-900">{formData.aiCorrected}</p>
              </div>
            )}
          </div>
        </div>

        {/* 情境 */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">來源</label>
            <input
              type="text"
              value={formData.context.source}
              onChange={(e) => updateNestedField('context', 'source', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="例如: React官方文件"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">情境</label>
            <input
              type="text"
              value={formData.context.scenario}
              onChange={(e) => updateNestedField('context', 'scenario', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="例如: 讀API文件時遇到"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
            <input
              type="text"
              value={formData.context.url}
              onChange={(e) => updateNestedField('context', 'url', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* 標籤 */}
        <TagManager
          tags={formData.tags}
          newTag={newTag}
          onNewTagChange={onNewTagChange}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />

        {/* 按鈕 */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onSave}
            type="button"
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Check className="w-5 h-5" />
            {editingVocab ? '更新' : '儲存'}
          </button>
          <button
            onClick={onCancel}
            type="button"
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <X className="w-5 h-5" />
            取消
          </button>
        </div>
      </div>
    </div>
  );
};
