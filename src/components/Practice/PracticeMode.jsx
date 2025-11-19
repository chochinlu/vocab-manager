import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Eraser, BookOpen, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { usePracticeSession } from '../../hooks/usePracticeSession';
import { PracticeStats } from './PracticeStats';
import { PracticeFeedback } from './PracticeFeedback';
import { ErrorPatterns } from './ErrorPatterns';
import { ModelSelector } from './ModelSelector';
import { ScenarioPrompt } from './ScenarioPrompt';
import { renderExample } from '../../utils/renderExample';
import { getPOSLabel } from '../../utils/constants';
import { getRandomScenario } from '../../utils/scenarioPrompts';
import { LoadingSpinner } from '../common/LoadingSpinner';

/**
 * Practice Mode Component
 * Full-screen practice interface for vocabulary
 */
export const PracticeMode = ({ vocab, onClose, onUpdateVocab }) => {
  const [showExamples, setShowExamples] = useState(false);
  const [showScenario, setShowScenario] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(
    () => getRandomScenario(vocab.partOfSpeech)
  );

  // 監聽 ESC 鍵退出練習模式
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const {
    sentence,
    setSentence,
    feedback,
    isSubmitting,
    error,
    practiceStats,
    submitForFeedback,
    continuePractice,
    addToExamples
  } = usePracticeSession(vocab, onUpdateVocab);

  // Switch to a new random scenario
  const handleRefreshScenario = () => {
    const newScenario = getRandomScenario(vocab.partOfSpeech, currentScenario.id);
    setCurrentScenario(newScenario);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回列表</span>
          </button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">
              練習：{vocab.word}
            </h2>
            <p className="text-sm text-gray-600">{getPOSLabel(vocab.partOfSpeech)}</p>
          </div>
          <ModelSelector />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Practice Stats */}
        <PracticeStats practiceStats={practiceStats} />

        {/* Vocabulary Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            單字資訊
          </h3>
          <div className="space-y-2 text-sm">
            {vocab.definitions?.chinese && (
              <div>
                <span className="font-medium text-gray-600">中文定義：</span>
                <span className="text-gray-800 ml-2">{vocab.definitions.chinese}</span>
              </div>
            )}
            {vocab.definitions?.english && (
              <div>
                <span className="font-medium text-gray-600">英文定義：</span>
                <span className="text-gray-800 ml-2">{vocab.definitions.english}</span>
              </div>
            )}
            {vocab.pronunciation?.phonetic && (
              <div>
                <span className="font-medium text-gray-600">音標：</span>
                <span className="text-gray-800 ml-2">{vocab.pronunciation.phonetic}</span>
              </div>
            )}

            {/* Collapsible Examples */}
            {vocab.examples?.original && vocab.examples.original.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
                >
                  {showExamples ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      隱藏例句
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      參考例句 ({vocab.examples.original.length})
                    </>
                  )}
                </button>
                {showExamples && (
                  <ul className="mt-2 space-y-1 pl-4">
                    {vocab.examples.original.map((example, index) => (
                      <li key={index} className="text-gray-700 text-sm">
                        {renderExample(example)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scenario Prompt Toggle Button */}
        {!showScenario && (
          <button
            onClick={() => setShowScenario(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            顯示練習情境提示
          </button>
        )}

        {/* Scenario Prompt */}
        <ScenarioPrompt
          scenario={currentScenario}
          onRefresh={handleRefreshScenario}
          onClose={() => setShowScenario(false)}
          isVisible={showScenario}
        />

        {/* Practice Input */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-700 mb-3">✍️ 寫下你的例句</h3>
          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder={`請使用 "${vocab.word}" 造一個句子...`}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isSubmitting}
          />

          {/* Error Message */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={submitForFeedback}
              disabled={isSubmitting || !sentence.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  批改中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  送出批改
                </>
              )}
            </button>
            <button
              onClick={() => setSentence('')}
              disabled={isSubmitting || !sentence.trim()}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Eraser className="w-5 h-5" />
              清除
            </button>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <>
            <PracticeFeedback feedback={feedback} />

            {/* Action Buttons after Feedback */}
            <div className="flex gap-3">
              <button
                onClick={continuePractice}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                繼續練習
              </button>
              {feedback.improvedVersion && feedback.score >= 70 && (
                <button
                  onClick={() => {
                    addToExamples();
                    continuePractice();
                  }}
                  className="flex items-center gap-2 px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  加入例句庫
                </button>
              )}
            </div>
          </>
        )}

        {/* Common Errors */}
        {practiceStats.commonErrors && practiceStats.commonErrors.length > 0 && (
          <ErrorPatterns commonErrors={practiceStats.commonErrors} />
        )}
      </div>
    </div>
  );
};
