import React from 'react';
import { SearchBar } from './SearchBar';
import { POS_OPTIONS, SORT_OPTIONS, DATE_FILTER_OPTIONS, PRACTICE_FILTER_OPTIONS } from '../../utils/constants';

/**
 * Filter Bar Component
 * Contains search, POS, tags, and sort filters
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
  filterPractice,
  onFilterPracticeChange,
  allTags,
  stats
}) => {
  return (
    <div className="space-y-4">
      {/* Search and select dropdowns */}
      <div className="grid md:grid-cols-4 gap-4">
        <SearchBar value={searchTerm} onChange={onSearchChange} />

        {/* POS filter */}
        <select
          value={filterPos}
          onChange={(e) => onFilterPosChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Parts of Speech</option>
          {POS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Tags filter */}
        <select
          value={filterTag}
          onChange={(e) => onFilterTagChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        {/* Sort */}
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

      {/* Date quick filter */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Display:</span>
        <div className="flex gap-2">
          {DATE_FILTER_OPTIONS.map(opt => {
            // Display corresponding stats based on different values
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

      {/* Practice status filter */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Practice:</span>
        <div className="flex gap-2">
          {PRACTICE_FILTER_OPTIONS.map(opt => {
            // Display corresponding stats based on different values
            const count = opt.value === 'all' ? stats.total :
                         opt.value === 'practiced' ? stats.practiced :
                         stats.unpracticed;

            // Different colors for different options
            const getButtonStyle = () => {
              const isActive = filterPractice === opt.value;

              if (opt.value === 'all') {
                return isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
              }

              if (opt.value === 'practiced') {
                return isActive
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100';
              }

              // unpracticed
              return isActive
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100';
            };

            return (
              <button
                key={opt.value}
                onClick={() => onFilterPracticeChange(opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${getButtonStyle()}`}
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
