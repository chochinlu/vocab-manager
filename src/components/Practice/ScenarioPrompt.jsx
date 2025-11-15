import { Lightbulb, RefreshCw, X } from 'lucide-react';

/**
 * ScenarioPrompt Component
 * Displays a contextual scenario prompt to help users write sentences
 *
 * @param {Object} scenario - Current scenario object
 * @param {Function} onRefresh - Callback to switch to a new scenario
 * @param {Function} onClose - Callback to close the scenario prompt
 * @param {boolean} isVisible - Whether to display the prompt
 */
export const ScenarioPrompt = ({
  scenario,
  onRefresh,
  onClose,
  isVisible
}) => {
  if (!isVisible || !scenario) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-purple-600" />
          練習情境
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-purple-100"
            title="換一個情境"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">換一個</span>
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
            title="關閉情境提示"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Content */}
      <div className="bg-white rounded-lg p-3 border border-purple-200 shadow-sm">
        <div className="text-xs text-purple-600 font-medium mb-2">
          {scenario.category}
        </div>
        <p className="text-sm text-gray-800 leading-relaxed">
          {scenario.prompt}
        </p>
      </div>

      {/* Difficulty Badge */}
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
        <span>難度：</span>
        <span className={`px-2 py-0.5 rounded font-medium ${
          scenario.difficulty === 'basic'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {scenario.difficulty === 'basic' ? '基礎 ⭐' : '進階 ⭐⭐'}
        </span>
      </div>
    </div>
  );
};
