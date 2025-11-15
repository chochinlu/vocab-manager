import { useState, useEffect } from 'react';
import { ChevronDown, Zap, Award, DollarSign } from 'lucide-react';
import { AI_MODELS, getModelInfo } from '../../services/practice.service';
import { settings } from '../../utils/storage';

/**
 * AI Model Selector Component
 */
export const ModelSelector = ({ onModelChange }) => {
  const [currentModel, setCurrentModel] = useState('haiku');
  const [isOpen, setIsOpen] = useState(false);

  // Load saved model on mount
  useEffect(() => {
    const loadModel = async () => {
      const savedModel = await settings.getAIModel();
      setCurrentModel(savedModel);
    };
    loadModel();
  }, []);

  const handleModelChange = async (modelValue) => {
    setCurrentModel(modelValue);
    await settings.setAIModel(modelValue);
    setIsOpen(false);
    if (onModelChange) {
      onModelChange(modelValue);
    }
  };

  const currentModelInfo = getModelInfo(currentModel);

  return (
    <div className="relative">
      {/* Selected Model Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          🤖 {currentModelInfo.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
            <div className="p-2">
              <div className="px-3 py-2 border-b border-gray-200 mb-2">
                <h3 className="font-semibold text-gray-800 text-sm">選擇 AI 模型</h3>
                <p className="text-xs text-gray-600 mt-1">選擇用於批改例句的 AI 模型</p>
              </div>

              <div className="space-y-1">
                {AI_MODELS.map((model) => (
                  <button
                    key={model.value}
                    onClick={() => handleModelChange(model.value)}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                      currentModel === model.value
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm flex items-center gap-2">
                          {model.label}
                          {currentModel === model.value && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              使用中
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {model.description}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs">
                            <Zap className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">速度：{model.speed}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <DollarSign className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">成本：{model.cost}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Award className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">品質：{model.quality}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-2 px-3 py-2 bg-gray-50 rounded text-xs text-gray-600">
                💡 提示：模型設定會自動儲存
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
