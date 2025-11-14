import React, { useState, useEffect, useRef } from 'react';
import { getBackgroundPhoto, getBackgroundSettings, preloadImage } from '../../services/background.service';

/**
 * 動態背景圖片組件
 * 使用 Unsplash API 提供隨機高品質背景圖片
 */
export const DynamicBackground = ({ children }) => {
  const [backgroundUrl, setBackgroundUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // 防止 React Strict Mode 重複載入
    if (hasLoadedRef.current) return;

    const loadBackground = async () => {
      try {
        hasLoadedRef.current = true;
        const settings = getBackgroundSettings();

        // 如果停用背景圖片，直接使用原本的漸層
        if (!settings.enabled) {
          setIsLoading(false);
          return;
        }

        // 獲取背景圖片資料
        const photo = await getBackgroundPhoto();

        if (!photo) {
          setIsLoading(false);
          return;
        }

        // 預載入圖片
        await preloadImage(photo.url);

        setBackgroundUrl(photo.url);
        setIsLoading(false);
      } catch (err) {
        console.error('載入背景圖片失敗:', err);
        setError(true);
        setIsLoading(false);
      }
    };

    loadBackground();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* 背景層 */}
      <div className="fixed inset-0 -z-10">
        {/* 原本的漸層背景（作為 fallback） */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />

        {/* 動態背景圖片 */}
        {backgroundUrl && !error && (
          <>
            <div
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ backgroundImage: `url(${backgroundUrl})` }}
            />
            {/* 輕微遮罩層（確保內容可讀性） */}
            <div className="absolute inset-0 bg-white/30" />
          </>
        )}
      </div>

      {/* 內容層 */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};
