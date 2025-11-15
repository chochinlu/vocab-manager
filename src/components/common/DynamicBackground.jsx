import React, { useState, useEffect, useRef } from 'react';
import { getBackgroundPhoto, getBackgroundSettings, preloadImage } from '../../services/background.service';

/**
 * Dynamic Background Image Component
 * Uses Unsplash API to provide random high-quality background images
 */
export const DynamicBackground = ({ children }) => {
  const [backgroundUrl, setBackgroundUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent React Strict Mode from double loading
    if (hasLoadedRef.current) return;

    const loadBackground = async () => {
      try {
        hasLoadedRef.current = true;
        const settings = getBackgroundSettings();

        // If background is disabled, use the original gradient
        if (!settings.enabled) {
          setIsLoading(false);
          return;
        }

        // Get background photo data
        const photo = await getBackgroundPhoto();

        if (!photo) {
          setIsLoading(false);
          return;
        }

        // Preload image
        await preloadImage(photo.url);

        setBackgroundUrl(photo.url);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load background image:', err);
        setError(true);
        setIsLoading(false);
      }
    };

    loadBackground();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background layer */}
      <div className="fixed inset-0 -z-10">
        {/* Original gradient background (as fallback) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />

        {/* Dynamic background image */}
        {backgroundUrl && !error && (
          <>
            <div
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ backgroundImage: `url(${backgroundUrl})` }}
            />
            {/* Light overlay layer (ensures content readability) */}
            <div className="absolute inset-0 bg-white/30" />
          </>
        )}
      </div>

      {/* Content layer */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};
