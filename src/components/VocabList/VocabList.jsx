import React from 'react';
import { VocabCard } from './VocabCard';

/**
 * 單字列表組件
 */
export const VocabList = ({ vocabs, totalCount, onEdit, onDelete }) => {
  if (vocabs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        {totalCount === 0 ? 'No words yet. Click "Add Word" above to start building your vocabulary!' : 'No words matching the criteria'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vocabs.map(vocab => (
        <VocabCard
          key={vocab.id}
          vocab={vocab}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
