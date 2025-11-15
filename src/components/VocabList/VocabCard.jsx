import React, { useState } from 'react';
import { Edit2, Trash2, Tag, Calendar, Languages, Loader2 } from 'lucide-react';
import { POS_OPTIONS } from '../../utils/constants';
import { PronunciationGroup, PronunciationButton } from '../common/PronunciationButton';
import { ExampleSection } from './ExampleSection';
import { translateToTraditionalChinese } from '../../services/openrouter.service';

/**
 * English Definition Item Component (with translation)
 */
const DefinitionItem = ({ definition }) => {
  const [translation, setTranslation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    if (translation) {
      setTranslation(null);
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const result = await translateToTraditionalChinese(definition);
      setTranslation(result);
    } catch (err) {
      setError(err.message);
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-start gap-2 group">
        <div className="flex-1">
          <span className="font-medium text-gray-700">English: </span>
          <span className="text-gray-600">{definition}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <PronunciationGroup text={definition} isSentence />
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
              translation
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={translation ? 'Hide translation' : 'Translate to Chinese'}
          >
            {isTranslating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Languages className="w-3 h-3" />
            )}
            <span>{translation ? 'Hide' : 'Translate'}</span>
          </button>
        </div>
      </div>

      {/* 顯示翻譯結果 */}
      {translation && (
        <div className="ml-20 pl-3 border-l-2 border-blue-300 bg-blue-50 rounded-r px-3 py-2">
          <p className="text-sm text-blue-900">{translation}</p>
        </div>
      )}

      {/* 顯示錯誤訊息 */}
      {error && (
        <div className="ml-20 pl-3 border-l-2 border-red-300 bg-red-50 rounded-r px-3 py-2">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Vocab Card Component
 */
export const VocabCard = ({ vocab, onEdit, onDelete }) => {
  const posLabel = POS_OPTIONS.find(p => p.value === vocab.partOfSpeech)?.label || vocab.partOfSpeech;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6 hover:shadow-2xl transition">
      {/* 標題列 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold text-gray-800">{vocab.word}</h3>
            <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
              {posLabel}
            </span>
            <div className="flex gap-2">
              <PronunciationButton text={vocab.word} accent="uk" label="播放英式發音" />
              <span className="text-xs mt-1">🇬🇧</span>
              <PronunciationButton text={vocab.word} accent="us" label="播放美式發音" />
              <span className="text-xs mt-1">🇺🇸</span>
            </div>
          </div>
          {vocab.pronunciation.phonetic && (
            <p className="text-gray-600 text-sm mb-2">{vocab.pronunciation.phonetic}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(vocab)}
            className="text-indigo-600 hover:text-indigo-800 p-2 rounded hover:bg-indigo-50"
            title="Edit"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(vocab.id)}
            className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 內容 */}
      <div className="space-y-3">
        {/* 定義 */}
        {vocab.definitions.chinese && (
          <div>
            <span className="font-medium text-gray-700">中文: </span>
            <span className="text-gray-600">{vocab.definitions.chinese}</span>
          </div>
        )}
        {vocab.definitions.english && (
          <DefinitionItem definition={vocab.definitions.english} />
        )}

        {/* 例句 */}
        <ExampleSection examples={vocab.examples} />

        {/* 上下文 */}
        {(vocab.context.source || vocab.context.scenario) && (
          <div className="text-sm text-gray-500">
            {vocab.context.source && <span>📚 {vocab.context.source}</span>}
            {vocab.context.source && vocab.context.scenario && <span> | </span>}
            {vocab.context.scenario && <span>💡 {vocab.context.scenario}</span>}
          </div>
        )}

        {/* 標籤 */}
        {vocab.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {vocab.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 日期 */}
        <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
          <Calendar className="w-3 h-3" />
          {new Date(vocab.addedDate).toLocaleDateString('zh-TW')}
        </div>
      </div>
    </div>
  );
};
