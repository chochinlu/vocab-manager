import React, { useState } from 'react';
import { Languages, Loader2, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { PronunciationGroup } from '../common/PronunciationButton';
import { renderExample } from '../../utils/renderExample.jsx';
import { translateToTraditionalChinese } from '../../services/openrouter.service';

/**
 * 單個例句項目組件（帶翻譯功能 + 刪除/排序功能）
 */
const ExampleItem = ({
  example,
  index,
  totalCount,
  isSentence = true,
  onDelete,
  onReorder
}) => {
  const [translation, setTranslation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  // 判斷是否為編輯模式（有傳遞操作函數）
  const isEditMode = onDelete && onReorder;

  const handleTranslate = async () => {
    if (translation) {
      // If there's already a translation, clicking will hide it
      setTranslation(null);
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const cleanText = example.replace(/\*\*/g, ''); // 移除粗體標記
      const result = await translateToTraditionalChinese(cleanText);
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
        <div className="flex gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <PronunciationGroup text={example.replace(/\*\*/g, '')} isSentence={isSentence} />
        </div>
        <span className="text-gray-600 text-sm flex-1">{renderExample(example)}</span>

        {/* 操作按鈕區 (hover 顯示) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* 編輯模式才顯示刪除/排序按鈕 */}
          {isEditMode && (
            <>
              {/* 上移按鈕 */}
              {index > 0 && (
                <button
                  onClick={() => onReorder(index, 'up')}
                  className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Move up"
                >
                  <ChevronUp size={16} />
                </button>
              )}

              {/* 下移按鈕 */}
              {index < totalCount - 1 && (
                <button
                  onClick={() => onReorder(index, 'down')}
                  className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Move down"
                >
                  <ChevronDown size={16} />
                </button>
              )}

              {/* 刪除按鈕 */}
              <button
                onClick={() => onDelete(index)}
                className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete example"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}

          {/* 翻譯按鈕（始終顯示） */}
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
        <div className="ml-8 pl-3 border-l-2 border-blue-300 bg-blue-50 rounded-r px-3 py-2">
          <p className="text-sm text-blue-900">{translation}</p>
        </div>
      )}

      {/* 顯示錯誤訊息 */}
      {error && (
        <div className="ml-8 pl-3 border-l-2 border-red-300 bg-red-50 rounded-r px-3 py-2">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

/**
 * 例句顯示區塊組件
 */
export const ExampleSection = ({ examples, onDeleteExample, onReorderExample }) => {
  if (!examples) return null;

  return (
    <div className="space-y-3">
      {/* 原始例句 */}
      {examples.original && examples.original.length > 0 && (
        <div>
          <p className="font-medium text-gray-700 mb-2">Original Examples:</p>
          <ul className="space-y-3">
            {examples.original.map((ex, i) => (
              <li key={ex}>
                <ExampleItem
                  example={ex}
                  index={i}
                  totalCount={examples.original.length}
                  isSentence={true}
                  onDelete={onDeleteExample}
                  onReorder={onReorderExample}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 我的例句 */}
      {examples.myOwn && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="font-medium text-blue-800 text-sm mb-2">My Example:</p>
          <MyExampleItem example={examples.myOwn} />

          {/* AI 修正 */}
          {examples.aiCorrected && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="font-medium text-green-800 text-sm mb-2">AI Correction:</p>
              <AICorrectedExampleItem example={examples.aiCorrected} />
            </div>
          )}

          {/* AI 建議 */}
          {examples.aiSuggestion && (
            <div className="mt-3 pt-3 border-t border-amber-200">
              <p className="font-medium text-amber-800 text-sm mb-2">💡 AI Suggestion (with target word):</p>
              <AISuggestionItem example={examples.aiSuggestion} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * AI 建議例句項目組件（帶翻譯功能）
 */
const AISuggestionItem = ({ example }) => {
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
      const result = await translateToTraditionalChinese(example);
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
        <div className="flex gap-1 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <PronunciationGroup text={example} isSentence />
        </div>
        <p className="text-amber-900 text-sm flex-1">{example}</p>
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors opacity-0 group-hover:opacity-100 ${
            translation
              ? 'bg-amber-200 text-amber-800 hover:bg-amber-300'
              : 'bg-white text-amber-700 hover:bg-amber-100'
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

      {translation && (
        <div className="ml-8 pl-3 border-l-2 border-amber-400 bg-white rounded-r px-3 py-2">
          <p className="text-sm text-amber-900">{translation}</p>
        </div>
      )}

      {error && (
        <div className="ml-8 pl-3 border-l-2 border-red-300 bg-red-50 rounded-r px-3 py-2">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

/**
 * 我的例句項目組件（帶翻譯功能）
 */
const MyExampleItem = ({ example }) => {
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
      const result = await translateToTraditionalChinese(example);
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
        <div className="flex gap-1 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <PronunciationGroup text={example} isSentence />
        </div>
        <p className="text-blue-900 text-sm flex-1">{example}</p>
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors opacity-0 group-hover:opacity-100 ${
            translation
              ? 'bg-blue-200 text-blue-800 hover:bg-blue-300'
              : 'bg-white text-blue-700 hover:bg-blue-100'
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

      {translation && (
        <div className="ml-8 pl-3 border-l-2 border-blue-400 bg-white rounded-r px-3 py-2">
          <p className="text-sm text-blue-900">{translation}</p>
        </div>
      )}

      {error && (
        <div className="ml-8 pl-3 border-l-2 border-red-300 bg-red-50 rounded-r px-3 py-2">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

/**
 * AI 修正例句項目組件（帶翻譯功能）
 */
const AICorrectedExampleItem = ({ example }) => {
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
      const result = await translateToTraditionalChinese(example);
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
        <div className="flex gap-1 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <PronunciationGroup text={example} isSentence />
        </div>
        <p className="text-green-900 text-sm flex-1">{example}</p>
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors opacity-0 group-hover:opacity-100 ${
            translation
              ? 'bg-green-200 text-green-800 hover:bg-green-300'
              : 'bg-white text-green-700 hover:bg-green-100'
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

      {translation && (
        <div className="ml-8 pl-3 border-l-2 border-green-400 bg-white rounded-r px-3 py-2">
          <p className="text-sm text-green-900">{translation}</p>
        </div>
      )}

      {error && (
        <div className="ml-8 pl-3 border-l-2 border-red-300 bg-red-50 rounded-r px-3 py-2">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};
