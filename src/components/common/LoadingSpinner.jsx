import React from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * Loading Spinner Component
 */
export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-8">
        <RefreshCw className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};
