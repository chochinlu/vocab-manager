import { Star } from 'lucide-react';
import { getProficiencyDisplay } from '../../services/practice.service';

/**
 * Practice Statistics Display Component
 */
export const PracticeStats = ({ practiceStats }) => {
  const { totalPractices, proficiencyLevel, averageScore } = practiceStats;
  const proficiencyInfo = getProficiencyDisplay(proficiencyLevel);

  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        📊 練習統計
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {/* Total Practices */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {totalPractices}
          </div>
          <div className="text-sm text-gray-600">已練習</div>
        </div>

        {/* Proficiency Level */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-1 mb-1">
            {Array.from({ length: proficiencyInfo.stars }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${proficiencyInfo.color} fill-current`}
              />
            ))}
          </div>
          <div className={`text-sm font-medium ${proficiencyInfo.color}`}>
            {proficiencyInfo.label}
          </div>
        </div>

        {/* Average Score */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {averageScore || '-'}
          </div>
          <div className="text-sm text-gray-600">平均分數</div>
        </div>
      </div>

      {/* Recent Scores Trend */}
      {practiceStats.recentScores && practiceStats.recentScores.length > 0 && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="text-xs text-gray-600 mb-1">近期表現</div>
          <div className="flex gap-1">
            {practiceStats.recentScores.map((score, index) => (
              <div
                key={index}
                className="flex-1 bg-white rounded h-2 overflow-hidden"
              >
                <div
                  className={`h-full ${
                    score >= 80
                      ? 'bg-green-500'
                      : score >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
