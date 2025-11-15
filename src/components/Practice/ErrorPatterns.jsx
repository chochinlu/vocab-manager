import { AlertCircle } from 'lucide-react';

/**
 * Error Patterns Display Component
 * Shows common mistakes to help students improve
 */
export const ErrorPatterns = ({ commonErrors }) => {
  if (!commonErrors || commonErrors.length === 0) {
    return null;
  }

  const getErrorTypeLabel = (type) => {
    const labels = {
      grammar: '文法',
      usage: '用法',
      'word-choice': '用字',
      spelling: '拼字'
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
        您的常見錯誤
      </h3>
      <div className="space-y-2">
        {commonErrors.map((error, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white rounded px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                {getErrorTypeLabel(error.type)}
              </span>
              <span className="text-sm text-gray-700">{error.pattern}</span>
            </div>
            <span className="text-xs text-gray-500">
              出現 {error.count} 次
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-600">
        💡 多注意這些錯誤，持續練習就能改善！
      </p>
    </div>
  );
};
