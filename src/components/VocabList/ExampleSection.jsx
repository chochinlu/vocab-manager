import React from 'react';
import { PronunciationGroup } from '../common/PronunciationButton';
import { renderExample } from '../../utils/renderExample.jsx';

/**
 * 例句顯示區塊組件
 */
export const ExampleSection = ({ examples }) => {
  if (!examples) return null;

  return (
    <div className="space-y-3">
      {/* 原始例句 */}
      {examples.original && examples.original.length > 0 && (
        <div>
          <p className="font-medium text-gray-700 mb-2">原始例句:</p>
          <ul className="space-y-2">
            {examples.original.map((ex, i) => (
              <li key={i} className="flex items-start gap-2 group">
                <div className="flex gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PronunciationGroup text={ex.replace(/\*\*/g, '')} isSentence />
                </div>
                <span className="text-gray-600 text-sm flex-1">{renderExample(ex)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 我的例句 */}
      {examples.myOwn && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="font-medium text-blue-800 text-sm mb-1">我的例句:</p>
          <div className="flex items-start gap-2 group">
            <div className="flex gap-1 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <PronunciationGroup text={examples.myOwn} isSentence />
            </div>
            <p className="text-blue-900 text-sm flex-1">{examples.myOwn}</p>
          </div>

          {/* AI 修正 */}
          {examples.aiCorrected && (
            <div className="mt-2 pt-2 border-t border-blue-200">
              <p className="font-medium text-green-800 text-sm mb-1">AI 修正:</p>
              <div className="flex items-start gap-2 group">
                <div className="flex gap-1 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PronunciationGroup text={examples.aiCorrected} isSentence />
                </div>
                <p className="text-green-900 text-sm flex-1">{examples.aiCorrected}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
