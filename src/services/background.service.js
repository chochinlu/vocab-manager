/**
 * 動態背景圖片服務
 * 使用 Unsplash API 獲取隨機高品質圖片
 * https://unsplash.com/documentation
 */

const API_BASE_URL = 'http://localhost:3001/api';

// Unsplash Collections (精選主題合集)
const UNSPLASH_COLLECTIONS = {
  technology: '1065396',  // Technology & Code
  nature: '3330445',      // Nature & Landscapes
  workspace: '1391584',   // Office & Workspace
  minimal: '1163637',     // Minimalism
  architecture: '3330452' // Architecture & Buildings
};

// 搜尋關鍵字（當不使用 collections 時）
const SEARCH_QUERIES = {
  technology: 'technology computer code',
  nature: 'nature landscape mountain',
  workspace: 'workspace office desk',
  minimal: 'minimal clean simple',
  architecture: 'architecture building modern'
};

const CACHE_KEY = 'vocab_background';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * 獲取快取的背景圖片資料
 */
export const getCachedBackground = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp, mode } = JSON.parse(cached);
    const now = Date.now();

    // 根據模式判斷是否需要更新
    if (mode === 'daily') {
      // 每日模式：檢查是否超過 24 小時
      if (now - timestamp < CACHE_DURATION) {
        return data;
      }
    } else if (mode === 'fixed') {
      // 固定模式：永遠使用同一張
      return data;
    }
    // 'always' 模式：每次都更新，返回 null

    return null;
  } catch (error) {
    console.error('Failed to read background cache:', error);
    return null;
  }
};

/**
 * 儲存背景圖片資料到快取
 */
export const cacheBackground = (data, mode = 'daily') => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now(),
      mode
    }));
  } catch (error) {
    console.error('Failed to save background cache:', error);
  }
};

/**
 * 獲取使用者背景設定
 */
export const getBackgroundSettings = () => {
  try {
    const settings = localStorage.getItem('vocab_background_settings');
    return settings ? JSON.parse(settings) : {
      enabled: true,
      mode: 'daily', // 'always' | 'daily' | 'fixed'
      theme: 'technology',
      useCollections: true // 使用 collections 或 query 搜尋
    };
  } catch {
    return {
      enabled: true,
      mode: 'daily',
      theme: 'technology',
      useCollections: true
    };
  }
};

/**
 * 儲存使用者背景設定
 */
export const saveBackgroundSettings = (settings) => {
  try {
    localStorage.setItem('vocab_background_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('儲存背景設定失敗:', error);
  }
};

/**
 * 從後端 API 獲取 Unsplash 隨機圖片
 * @param {string} theme - 主題類別
 * @returns {Promise<Object>} 圖片資料
 */
export const fetchUnsplashPhoto = async (theme = 'technology') => {
  const settings = getBackgroundSettings();

  try {
    // 建立查詢參數
    const params = new URLSearchParams({
      orientation: 'landscape'
    });

    // 使用 collections 或 query
    if (settings.useCollections) {
      const collectionId = UNSPLASH_COLLECTIONS[theme] || UNSPLASH_COLLECTIONS.technology;
      params.append('collections', collectionId);
    } else {
      const query = SEARCH_QUERIES[theme] || SEARCH_QUERIES.technology;
      params.append('query', query);
    }

    const response = await fetch(`${API_BASE_URL}/unsplash/random?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '獲取背景圖片失敗');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Unsplash API 錯誤:', error);
    throw error;
  }
};

/**
 * 獲取動態背景圖片
 * @returns {Promise<Object|null>} 圖片資料 { url, description, author }
 */
export const getBackgroundPhoto = async () => {
  const settings = getBackgroundSettings();

  // 如果停用背景圖片，返回 null
  if (!settings.enabled) {
    return null;
  }

  // 檢查快取
  const cached = getCachedBackground();
  if (cached && settings.mode !== 'always') {
    return cached;
  }

  try {
    // 從 API 獲取新圖片
    const photo = await fetchUnsplashPhoto(settings.theme);

    // 使用 regular 尺寸（1080p），適合大部分螢幕
    const photoData = {
      url: photo.url,
      description: photo.description || 'Beautiful background',
      author: photo.author
    };

    // 儲存到快取
    if (settings.mode !== 'always') {
      cacheBackground(photoData, settings.mode);
    }

    return photoData;
  } catch (error) {
    console.error('獲取背景圖片失敗:', error);
    throw error;
  }
};

/**
 * 預載入圖片
 * @param {string} url - 圖片 URL
 * @returns {Promise<string>} 載入完成的圖片 URL
 */
export const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('No URL provided'));
      return;
    }

    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};

/**
 * 清除背景快取
 */
export const clearBackgroundCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('清除背景快取失敗:', error);
  }
};

// 向後兼容的函數（保留給現有代碼使用）
export const getBackgroundUrl = async () => {
  try {
    const photo = await getBackgroundPhoto();
    return photo?.url || null;
  } catch {
    return null;
  }
};
