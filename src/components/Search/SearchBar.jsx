import React from 'react';
import { Search } from 'lucide-react';

/**
 * 搜尋列組件
 */
export const SearchBar = ({ value, onChange, placeholder = '搜尋單字、中英文定義...' }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  );
};
