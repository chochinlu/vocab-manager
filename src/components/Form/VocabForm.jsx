import React, { useState, useEffect, useRef } from 'react';
import { Check, X, RefreshCw, Plus, Edit2, Volume2, AlertTriangle, Languages, Loader2, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { POS_OPTIONS } from '../../utils/constants';
import { AITools } from './AITools';
import { TagManager } from './TagManager';
import { PronunciationGroup } from '../common/PronunciationButton';
import { translateToTraditionalChinese } from '../../services/openrouter.service';

/**
 * Vocabulary Form Component
 * Used for adding and editing vocabulary words
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
  // English Definition Translation State
  const [definitionTranslation, setDefinitionTranslation] = useState(null);
  const [isTranslatingDefinition, setIsTranslatingDefinition] = useState(false);
  const [definitionTranslationError, setDefinitionTranslationError] = useState(null);

  // Word input ref for auto-scroll and focus
  const wordInputRef = useRef(null);

  // Auto-scroll to word input and focus when form is mounted
  useEffect(() => {
    // Delay to ensure DOM is fully rendered and layout is stable
    const timer = setTimeout(() => {
      if (wordInputRef.current) {
        // Get input position
        const rect = wordInputRef.current.getBoundingClientRect();

        // Set offset from top (responsive: smaller on mobile)
        const offset = window.innerWidth < 768 ? 20 : 80;

        // Calculate target scroll position
        const targetScrollY = window.scrollY + rect.top - offset;

        // Smooth scroll to position (ensure not below 0)
        window.scrollTo({
          top: Math.max(0, targetScrollY),
          behavior: 'smooth'
        });

        // Auto-focus the input field
        wordInputRef.current.focus();
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []); // Run once when component mounts

  // Listen to ESC key to cancel form
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleEscapeKey);

    // Clean up event listener
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onCancel]);

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

  // 刪除例句
  const handleDeleteExample = (index) => {
    if (!confirm('Are you sure you want to delete this example?')) {
      return;
    }
    const newExamples = formData.examplesOriginal.filter((_, i) => i !== index);
    onFormDataChange({ ...formData, examplesOriginal: newExamples });
  };

  // 調整例句順序
  const handleReorderExample = (index, direction) => {
    const examples = [...formData.examplesOriginal];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // 交換位置
    [examples[index], examples[targetIndex]] = [examples[targetIndex], examples[index]];

    onFormDataChange({ ...formData, examplesOriginal: examples });
  };

  // Handle English definition translation
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
      console.error('Translation error:', err);
    } finally {
      setIsTranslatingDefinition(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {editingVocab ? '✏️ Edit Word' : '➕ Add Word'}
      </h2>

      <div className="space-y-4">
        {/* Word and Part of Speech */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Word or Phrase *</label>
            <div className="flex gap-2">
              <input
                ref={wordInputRef}
                type="text"
                value={formData.word}
                onChange={(e) => {
                  updateField('word', e.target.value);
                  onClearSuggestions();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. implement or look after"
              />
              <button
                onClick={onCheckSpelling}
                disabled={isCheckingSpelling || !formData.word.trim()}
                type="button"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 flex items-center gap-2"
                title="Check Spelling"
              >
                {isCheckingSpelling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>✓</span>}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">💡 You can enter a word or phrase</p>

            {/* Spelling suggestions */}
            {spellingSuggestions.length > 0 && (
              <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm font-medium text-yellow-800 mb-2">💡 Suggestions:</p>
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
                  Ignore Suggestions
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Part of Speech *</label>
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

        {/* AI Tools */}
        <AITools
          word={formData.word}
          onFetchFreeDictionary={onFetchFreeDictionary}
          onFetchCambridge={onFetchCambridge}
          isFetchingFree={isFetchingFreeDictionary}
          isFetchingCambridge={isFetchingCambridge}
        />

        {/* Definitions */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chinese Definition</label>
            <input
              type="text"
              value={formData.definitionChinese}
              onChange={(e) => updateField('definitionChinese', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. implementation, execution"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">English Definition</label>
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
                  placeholder="e.g. to put into operation"
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
                      title={definitionTranslation ? 'Hide translation' : 'Translate to Chinese'}
                    >
                      {isTranslatingDefinition ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Languages className="w-3 h-3" />
                      )}
                      <span>{definitionTranslation ? 'Hide' : 'Translate'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Show translation result */}
              {definitionTranslation && (
                <div className="ml-2 pl-3 border-l-2 border-blue-300 bg-blue-50 rounded-r px-3 py-2">
                  <p className="text-sm text-blue-900">{definitionTranslation}</p>
                </div>
              )}

              {/* Show error message */}
              {definitionTranslationError && (
                <div className="ml-2 pl-3 border-l-2 border-red-300 bg-red-50 rounded-r px-3 py-2">
                  <p className="text-xs text-red-700">{definitionTranslationError}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pronunciation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phonetic</label>
          <input
            type="text"
            value={formData.phonetic}
            onChange={(e) => updateField('phonetic', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. /ˈɪm.plɪ.ment/"
          />
        </div>

        {/* Voice Playback */}
        {formData.word && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-800 mb-3">🔊 Pronunciation Preview</p>
            <div className="flex gap-3">
              <PronunciationGroup text={formData.word} />
            </div>
          </div>
        )}

        {/* Original Examples */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Original Examples</label>
          <p className="text-xs text-gray-500 mb-2">💡 You can use **bold** to highlight key terms</p>
          {formData.examplesOriginal.map((example, index) => (
            <div key={index} className="flex gap-2 mb-2">
              {/* 上移按鈕 */}
              {index > 0 && (
                <button
                  onClick={() => handleReorderExample(index, 'up')}
                  type="button"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Move up"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
              )}

              {/* 下移按鈕 */}
              {index < formData.examplesOriginal.length - 1 && (
                <button
                  onClick={() => handleReorderExample(index, 'down')}
                  type="button"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Move down"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              )}

              {/* 輸入欄位 */}
              <input
                type="text"
                value={example}
                onChange={(e) => updateExample(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. This method is **deprecated**"
              />

              {/* 刪除按鈕 */}
              <button
                onClick={() => handleDeleteExample(index)}
                type="button"
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete example"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              {/* 新增按鈕（只在最後一個顯示） */}
              {index === formData.examplesOriginal.length - 1 && (
                <button
                  onClick={onAddExampleField}
                  type="button"
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  title="Add new example"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* My Example + AI Correction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">My Example</label>
          <div className="space-y-2">
            <textarea
              value={formData.myExample}
              onChange={(e) => updateField('myExample', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows="2"
              placeholder="Write your own example..."
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
                  Correcting with AI...
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  AI Correction
                </>
              )}
            </button>

            {/* Warning message: Corrected sentence does not contain target word */}
            {warningMessage && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 relative">
                <button
                  onClick={onClearWarning}
                  className="absolute top-2 right-2 text-amber-600 hover:text-amber-800 transition"
                  title="Close warning"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-amber-900 mb-2">
                      Note: The corrected sentence does not contain the word <span className="font-bold">"{warningMessage.word}"</span>
                    </p>
                    <div className="bg-white rounded-lg p-3 border border-amber-200">
                      <p className="text-sm font-medium text-amber-800 mb-1">💡 If you want to use "{warningMessage.word}", you can write it like this:</p>
                      <p className="text-amber-900 text-sm italic">"{warningMessage.suggestion}"</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.aiCorrected && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm font-medium text-green-800 mb-1">AI Correction Result:</p>
                <p className="text-green-900">{formData.aiCorrected}</p>
              </div>
            )}
          </div>
        </div>

        {/* Scenario */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
            <input
              type="text"
              value={formData.context.source}
              onChange={(e) => updateNestedField('context', 'source', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. React official docs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scenario</label>
            <input
              type="text"
              value={formData.context.scenario}
              onChange={(e) => updateNestedField('context', 'scenario', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. encountered when reading API docs"
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

        {/* Tags */}
        <TagManager
          tags={formData.tags}
          newTag={newTag}
          onNewTagChange={onNewTagChange}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onSave}
            type="button"
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Check className="w-5 h-5" />
            {editingVocab ? 'Update' : 'Save'}
          </button>
          <button
            onClick={onCancel}
            type="button"
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
