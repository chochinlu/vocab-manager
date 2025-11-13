import React from 'react';
import { SearchBar } from './SearchBar';
import { POS_OPTIONS, SORT_OPTIONS, DATE_FILTER_OPTIONS } from '../../utils/constants';

/**
 * 篩選列組件
 * 包含搜尋、詞性、標籤、排序篩選器
 */
export const FilterBar = ({
  searchTerm,
  onSearchChange,
  filterPos,
  onFilterPosChange,
  filterTag,
  onFilterTagChange,
  sortBy,
  onSortByChange,
  filterDate,
  onFilterDateChange,
  allTags,
  stats
}) => {
  return (
    <div className="space-y-4">
      {/* 搜尋與下拉選單 */}
      <div className="grid md:grid-cols-4 gap-4">
        <SearchBar value={searchTerm} onChange={onSearchChange} />

        {/* 詞性篩選 */}
        <select
          value={filterPos}
          onChange={(e) => onFilterPosChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">所有詞性</option>
          {POS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* 標籤篩選 */}
        <select
          value={filterTag}
          onChange={(e) => onFilterTagChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">所有標籤</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        {/* 排序 */}
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* 日期快速篩選 */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">顯示:</span>
        <div className="flex gap-2">
          {DATE_FILTER_OPTIONS.map(opt => {
            // 根據不同的 value 顯示對應的統計數字
            const count = opt.value === 'today' ? stats.today :
                         opt.value === 'week' ? stats.week :
                         opt.value === 'month' ? stats.filtered :
                         stats.total;

            return (
              <button
                key={opt.value}
                onClick={() => onFilterDateChange(opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterDate === opt.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
