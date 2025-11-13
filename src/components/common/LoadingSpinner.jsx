import React from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * 載入中畫面組件
 */
export const LoadingSpinner = ({ message = '載入中...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};
