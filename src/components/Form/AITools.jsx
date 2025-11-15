import React from 'react';
import { RefreshCw, Book } from 'lucide-react';
import { openCambridgeDictionary } from '../../services/dictionary.service';

/**
 * AI Tools Button Group
 */
export const AITools = ({ word, onFetchFreeDictionary, onFetchCambridge, isFetchingFree, isFetchingCambridge }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm font-medium text-gray-800 mb-3">🤖 AI Dictionary Assistant</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onFetchFreeDictionary}
          disabled={isFetchingFree || !word.trim()}
          type="button"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 text-sm"
        >
          {isFetchingFree ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <Book className="w-4 h-4" />
              Free Dictionary
            </>
          )}
        </button>
        <button
          onClick={onFetchCambridge}
          disabled={isFetchingCambridge || !word.trim()}
          type="button"
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 text-sm"
        >
          {isFetchingCambridge ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <Book className="w-4 h-4" />
              Cambridge Dictionary
            </>
          )}
        </button>
        <button
          onClick={() => word.trim() && openCambridgeDictionary(word)}
          disabled={!word.trim()}
          type="button"
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:bg-gray-400 text-sm"
        >
          <Book className="w-4 h-4" />
          Open Website
        </button>
      </div>
      <p className="text-xs text-gray-600 mt-2">💡 Auto-fill phonetic, definitions and examples</p>
    </div>
  );
};
