# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

這是一個技術英文詞彙管理應用程式,使用 React + Vite 構建,採用 Tailwind CSS v4 進行樣式設計。應用程式允許使用者儲存、管理和學習技術英文單字,具備 AI 輔助功能(拼字檢查、例句修正、字典查詢)。

## 開發指令

```bash
# 安裝依賴
npm install

# 啟動開發伺服器 (http://localhost:5173)
npm run dev

# 執行 ESLint 檢查
npm run lint

# 建置正式版本
npm run build

# 預覽建置結果
npm run preview
```

## 核心架構

### 資料儲存 (src/utils/storage.js)
- 使用 `localStorage` 模擬 `window.storage` API
- 提供 `set()`, `get()`, `delete()`, `list()`, `clear()` 方法
- 所有單字資料以 `vocab:` 為 key prefix 儲存
- 資料格式為 JSON 字串

### 主應用程式 (src/App.jsx)
單一組件應用程式 (1400+ 行),包含以下核心功能:

#### 狀態管理
- `vocabs`: 所有單字資料陣列
- `formData`: 新增/編輯表單的狀態物件
- `searchTerm`, `filterPos`, `filterTag`, `filterDate`: 篩選條件
- `editingVocab`: 追蹤正在編輯的單字

#### 單字資料結構
```javascript
{
  id: "vocab:{word}-{partOfSpeech}-{timestamp}",
  word: string,
  partOfSpeech: 'verb' | 'noun' | 'adjective' | 'adverb' | 'phrasal-verb' | 'phrase' | 'other',
  addedDate: ISO string,
  definitions: {
    chinese: string,
    english: string
  },
  examples: {
    original: string[],  // 支援 **粗體** markdown
    myOwn: string,
    aiCorrected: string
  },
  pronunciation: {
    phonetic: string,
    audioUrl: string,
    audioUrlUK: string,
    audioUrlUS: string
  },
  context: {
    source: string,
    scenario: string,
    url: string
  },
  tags: string[],
  reviewHistory: array
}
```

#### AI 功能整合
所有 AI 功能直接呼叫 Anthropic API (`https://api.anthropic.com/v1/messages`):
- `checkSpelling()`: 拼字檢查與建議 (使用 JSON 回應)
- `correctExample()`: 修正中式英文例句
- `fetchFreeDictionaryData()`: 使用 `web_fetch` tool 抓取 Free Dictionary API
- `fetchCambridgeData()`: 使用 `web_search` + `web_fetch` tools 查詢劍橋字典

#### 發音功能
- 使用 Web Speech API (`window.speechSynthesis`)
- `playPronunciation(text, accent, isSentence)`:
  - `accent`: 'uk' (en-GB) 或 'us' (en-US)
  - `isSentence`: 控制語速 (單字 0.8, 句子 0.9)
- 每個單字和例句都可即時播放發音

#### 篩選與排序
- 搜尋: 單字、中英文定義
- 詞性篩選: 7 種詞性
- 標籤篩選: 動態從現有單字提取
- 日期篩選: 今天/本週/本月/全部
- 排序: 最新/最舊/字母順序

#### 例句渲染
- `renderExample()`: 將 `**text**` 轉換成粗體 HTML (用於標記片語動詞)

## 技術棧

- **React 19.2.0**: 使用函數組件 + Hooks
- **Vite 7.2.2**: 開發與建置工具
- **Tailwind CSS 4.1.17**: 使用 `@tailwindcss/vite` plugin
- **ESLint**: 使用 flat config (eslint.config.js)
- **lucide-react**: Icon 庫

## 開發注意事項

1. **單一檔案組件**: 目前 App.jsx 是單一大型組件,未來可重構為多個子組件
2. **無路由**: 單頁應用,無需 React Router
3. **API Keys**: AI 功能需要 Anthropic API key (目前直接寫在程式碼中,production 應移至環境變數)
4. **瀏覽器相容性**: Web Speech API 需要現代瀏覽器支援
5. **Tailwind 版本**: 使用 Tailwind CSS v4 (需注意與 v3 的差異)

## 可能的改進方向

1. 將 App.jsx 拆分成多個組件 (VocabList, VocabForm, SearchBar 等)
2. 將 API 呼叫邏輯移至獨立的 service 檔案
3. 使用 React Context 或狀態管理庫 (Zustand/Redux)
4. 加入單元測試 (Vitest + React Testing Library)
5. 實作資料匯出/匯入功能
6. 加入間隔重複學習 (Spaced Repetition) 演算法
