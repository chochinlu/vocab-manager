import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Search Bar Component
 */
export const SearchBar = ({ value, onChange, placeholder = 'Search words, definitions...' }) => {
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange('');
    // 清除後將焦點設回輸入框
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // 只在有內容時才處理 ESC 鍵
    if (e.key === 'Escape' && value) {
      e.stopPropagation(); // 阻止事件冒泡，避免觸發其他全域 ESC 監聽器（如 VocabForm）
      handleClear();
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      {value && (
        <button
          onClick={handleClear}
          type="button"
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
