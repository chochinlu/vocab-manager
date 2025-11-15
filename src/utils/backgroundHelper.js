/**
 * 背景圖片輔助工具
 * 提供測試和管理背景圖片的便利函數
 */

import { clearBackgroundCache, saveBackgroundSettings } from '../services/background.service';

/**
 * 全域輔助函數（僅供開發測試使用）
 * 在瀏覽器控制台中可直接呼叫
 */
if (typeof window !== 'undefined') {
  // 清除背景快取並重新載入
  window.refreshBackground = () => {
    clearBackgroundCache();
    console.log('✅ Background cache cleared! Refresh the page to load new background.');
    window.location.reload();
  };

  // 切換背景模式
  window.setBackgroundMode = (mode) => {
    const validModes = ['always', 'daily', 'fixed'];
    if (!validModes.includes(mode)) {
      console.error('❌ Invalid mode! Use: always, daily, fixed');
      return;
    }
    const settings = JSON.parse(localStorage.getItem('vocab_background_settings') || '{}');
    saveBackgroundSettings({ ...settings, mode, enabled: true });
    clearBackgroundCache();
    console.log(`✅ Background mode set to: ${mode}`);
    window.location.reload();
  };

  // 切換背景主題
  window.setBackgroundTheme = (theme) => {
    const validThemes = ['technology', 'nature', 'workspace', 'minimal', 'architecture'];
    if (!validThemes.includes(theme)) {
      console.error('❌ Invalid theme! Use: technology, nature, workspace, minimal, architecture');
      return;
    }
    const settings = JSON.parse(localStorage.getItem('vocab_background_settings') || '{}');
    saveBackgroundSettings({ ...settings, theme, enabled: true });
    clearBackgroundCache();
    console.log(`✅ Background theme set to: ${theme}`);
    window.location.reload();
  };

  // 停用背景圖片（使用原本的漸層背景）
  window.disableBackground = () => {
    const settings = JSON.parse(localStorage.getItem('vocab_background_settings') || '{}');
    saveBackgroundSettings({ ...settings, enabled: false });
    console.log('✅ Background images disabled! Refresh the page for changes.');
    window.location.reload();
  };

  // 啟用背景圖片
  window.enableBackground = () => {
    const settings = JSON.parse(localStorage.getItem('vocab_background_settings') || '{}');
    saveBackgroundSettings({ ...settings, enabled: true });
    clearBackgroundCache();
    console.log('✅ Background images enabled! Refresh the page for changes.');
    window.location.reload();
  };

  // 顯示當前設定
  window.showBackgroundSettings = () => {
    const settings = JSON.parse(localStorage.getItem('vocab_background_settings') || '{}');
    const cache = localStorage.getItem('vocab_background');
    console.log('📋 當前背景設定:');
    console.log('  - 啟用:', settings.enabled ?? true);
    console.log('  - 模式:', settings.mode || 'daily');
    console.log('  - 主題:', settings.theme || 'general');
    console.log('  - 快取:', cache ? '有' : '無');
  };

  // 顯示幫助訊息
  console.log(`
🎨 背景圖片管理工具
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
可在控制台使用以下指令：

📷 背景控制
  refreshBackground()              - 清除快取並載入新背景
  enableBackground()               - 啟用背景圖片
  disableBackground()              - 停用背景圖片（使用漸層）

🎨 模式切換
  setBackgroundMode('always')      - 每次都換新圖
  setBackgroundMode('daily')       - 每日更換（預設）
  setBackgroundMode('fixed')       - 固定背景

🌄 主題切換 (Unsplash Collections)
  setBackgroundTheme('technology')    - 科技程式碼（預設）
  setBackgroundTheme('nature')        - 自然風景
  setBackgroundTheme('workspace')     - 辦公空間
  setBackgroundTheme('minimal')       - 極簡風格
  setBackgroundTheme('architecture')  - 建築設計

📋 查看設定
  showBackgroundSettings()         - 顯示當前設定

提示：修改設定後會自動重新整理頁面
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}
