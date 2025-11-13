import React from 'react';
import { Tag, X, Plus } from 'lucide-react';

/**
 * 標籤管理組件
 */
export const TagManager = ({ tags, newTag, onNewTagChange, onAddTag, onRemoveTag }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddTag();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">標籤</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => onNewTagChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="輸入標籤後按 Enter"
        />
        <button
          onClick={onAddTag}
          type="button"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          新增
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm"
            >
              <Tag className="w-3 h-3" />
              {tag}
              <button
                onClick={() => onRemoveTag(tag)}
                type="button"
                className="hover:text-indigo-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
