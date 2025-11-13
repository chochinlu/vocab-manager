import React from 'react';
import { Book, Plus } from 'lucide-react';

/**
 * 應用程式頁首組件
 * 包含標題、統計和新增按鈕
 */
export const Header = ({ stats, onToggleForm }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Book className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">技術英文詞彙庫</h1>
        </div>
        <button
          onClick={onToggleForm}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          新增單字
        </button>
      </div>

      {/* 統計資訊 */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
          <p className="text-sm text-blue-600 font-medium">總單字數</p>
          <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
          <p className="text-sm text-green-600 font-medium">今天新增</p>
          <p className="text-2xl font-bold text-green-700">{stats.today}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
          <p className="text-sm text-purple-600 font-medium">本週新增</p>
          <p className="text-2xl font-bold text-purple-700">{stats.week}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3">
          <p className="text-sm text-orange-600 font-medium">目前顯示</p>
          <p className="text-2xl font-bold text-orange-700">{stats.filtered}</p>
        </div>
      </div>
    </div>
  );
};
