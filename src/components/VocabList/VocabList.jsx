import React from 'react';
import { VocabCard } from './VocabCard';

/**
 * 單字列表組件
 */
export const VocabList = ({ vocabs, totalCount, onEdit, onDelete }) => {
  if (vocabs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        {totalCount === 0 ? '還沒有單字,點擊上方「新增單字」開始建立你的詞彙庫!' : '找不到符合條件的單字'}
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
