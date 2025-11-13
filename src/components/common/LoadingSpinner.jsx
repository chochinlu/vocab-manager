import React from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * 載入中畫面組件
 */
export const LoadingSpinner = ({ message = '載入中...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-8">
        <RefreshCw className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};
