import { CheckCircle, XCircle, Star, Lightbulb, Sparkles } from 'lucide-react';

/**
 * Practice Feedback Display Component
 * Shows AI feedback including score, errors, suggestions, and improved version
 */
export const PracticeFeedback = ({ feedback }) => {
  if (!feedback) {
    return null;
  }

  const { score, isCorrect, errors, suggestions, improvedVersion, overallComment } = feedback;

  // Score color based on value
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Star rating based on score
  const getStarCount = (score) => {
    if (score >= 90) return 5;
    if (score >= 75) return 4;
    if (score >= 60) return 3;
    if (score >= 40) return 2;
    return 1;
  };

  const starCount = getStarCount(score);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with Score */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            💡 AI 批改結果
          </h3>
          <div className="flex items-center gap-2">
            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="flex">
              {Array.from({ length: starCount }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${getScoreColor(score)} fill-current`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Correct Status */}
        {isCorrect ? (
          <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-green-800">語法正確！</div>
              <div className="text-sm text-green-700 mt-1">{overallComment}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">發現一些需要改進的地方</div>
          </div>
        )}

        {/* Errors */}
        {errors && errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 text-sm">⚠️ 需要修正的錯誤</h4>
            {errors.map((error, index) => (
              <div
                key={index}
                className="p-3 bg-red-50 rounded-lg border border-red-200 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">
                    {error.type === 'grammar' && '文法錯誤'}
                    {error.type === 'usage' && '用法錯誤'}
                    {error.type === 'word-choice' && '用字不當'}
                    {error.type === 'spelling' && '拼字錯誤'}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-gray-600">原句：</span>
                    <span className="text-red-600 line-through ml-2">{error.original}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">建議：</span>
                    <span className="text-green-600 font-medium ml-2">{error.correction}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 pl-4 border-l-2 border-gray-300">
                    {error.explanation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              建議
            </h4>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700 p-2 bg-yellow-50 rounded border border-yellow-200"
                >
                  <span className="text-yellow-600 flex-shrink-0">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improved Version */}
        {improvedVersion && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              改進版本
            </h4>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-gray-800 italic">"{improvedVersion}"</p>
            </div>
          </div>
        )}

        {/* Overall Comment */}
        {overallComment && !isCorrect && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">整體評語：</span>
              {overallComment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
