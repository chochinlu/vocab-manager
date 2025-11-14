import React, { useState } from 'react';
import { Book, Plus, RefreshCw } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import { clearBackgroundCache } from '../../services/background.service';

/**
 * 應用程式頁首組件
 * 包含標題、統計、換背景按鈕和新增按鈕
 */
export const Header = ({ stats, onToggleForm }) => {
  const { showSuccess } = useToastContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 處理換背景
  const handleRefreshBackground = () => {
    setIsRefreshing(true);
    showSuccess('正在載入新背景...', 1000);

    // 延遲清除快取並重新整理，避免重複載入
    setTimeout(() => {
      clearBackgroundCache();
      window.location.reload();
    }, 500);
  };
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Book className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">技術英文詞彙庫</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* 換背景按鈕 */}
          <button
            onClick={handleRefreshBackground}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg
                     text-gray-600 hover:text-blue-600 hover:bg-blue-50
                     transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
            title="隨機切換背景圖片"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium hidden sm:inline">換背景</span>
          </button>

          {/* 新增單字按鈕 */}
          <button
            onClick={onToggleForm}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5" />
            新增單字
          </button>
        </div>
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
