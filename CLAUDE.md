# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

這是一個技術英文詞彙管理應用程式，採用**前後端分離架構**：
- **前端**: React + Vite + Tailwind CSS v4
- **後端**: Express API Server

應用程式允許使用者儲存、管理和學習技術英文單字，具備 AI 輔助功能（拼字檢查、例句翻譯、例句修正、字典查詢）。

## 架構特色

✅ **模組化組件設計** - 24 個精簡組件，清晰的職責分離
✅ **前後端分離** - Express 代理 AI API，解決 CORS 問題
✅ **API Key 安全** - 後端管理，不暴露在前端
✅ **自訂 Hooks** - 可重用的狀態邏輯
✅ **服務層抽離** - API 邏輯獨立管理

## 開發指令

```bash
# 安裝依賴
npm install

# 設定環境變數（首次使用）
# 複製 .env.example 為 .env，填入 Anthropic 和 OpenRouter API Keys
cp .env.example .env

# 同時啟動前後端開發伺服器
npm run dev
# 前端: http://localhost:5173
# 後端: http://localhost:3001

# 分別啟動前端或後端
npm run dev:client    # 只啟動前端 (Vite)
npm run dev:server    # 只啟動後端 (Express)

# 執行 ESLint 檢查
npm run lint

# 建置正式版本
npm run build

# 預覽建置結果
npm run preview
```

## 核心架構

### 前端架構 (src/)

#### 組件層 (components/)
- **common/** - 共用組件
  - `LoadingSpinner.jsx` - 載入中畫面
  - `PronunciationButton.jsx` - 發音按鈕與按鈕組

- **Layout/** - 版面組件
  - `Header.jsx` - 頁首（標題、統計、新增按鈕）

- **Search/** - 搜尋與篩選
  - `SearchBar.jsx` - 搜尋輸入框
  - `FilterBar.jsx` - 篩選與排序控制

- **Form/** - 表單相關
  - `VocabForm.jsx` - 主表單組件（新增/編輯單字）
  - `AITools.jsx` - AI 工具按鈕群組
  - `TagManager.jsx` - 標籤管理

- **VocabList/** - 單字列表
  - `VocabList.jsx` - 列表容器
  - `VocabCard.jsx` - 單字卡片
  - `ExampleSection.jsx` - 例句顯示區塊

#### Hooks 層 (hooks/)
- `useVocabs.js` - 單字資料管理 (CRUD)
- `useVocabFilters.js` - 篩選與排序邏輯
- `useVocabForm.js` - 表單狀態管理
- `useAIFeatures.js` - AI 功能整合

#### 服務層 (services/)
- `vocab.service.js` - 單字 CRUD 操作
- `ai.service.js` - Anthropic AI 功能（例句修正，呼叫本地 Express API）
- `openrouter.service.js` - OpenRouter AI 服務（拼字檢查、例句翻譯，呼叫本地 Express API）
- `dictionary.service.js` - 字典查詢（呼叫本地 Express API）
- `speech.service.js` - 發音服務（Web Speech API）

#### 工具層 (utils/)
- `storage.js` - localStorage 封裝
- `constants.js` - 常數定義（詞性、排序選項等）
- `renderExample.jsx` - 例句渲染（支援 **粗體** 標記）

#### 主應用程式 (App.jsx)
重構後的精簡版本（261 行，原 1423 行）：
- 整合所有 Hooks 管理狀態
- 協調各組件互動
- 處理事件邏輯

### 後端架構 (server/)

#### Express API Server (server/index.js)
提供 6 個 API 端點：

**Anthropic Claude API 端點:**

1. **POST /api/ai/correct-example**
   - 修正中式英文例句
   - 輸入: `{ word, partOfSpeech, example }`
   - 輸出: 修正後的例句

2. **POST /api/dictionary/free**
   - Free Dictionary API 代理
   - 輸入: `{ word, partOfSpeech }`
   - 使用 Claude 的 `web_fetch` tool

3. **POST /api/dictionary/cambridge**
   - Cambridge Dictionary API 代理
   - 輸入: `{ word, partOfSpeech, posLabel }`
   - 使用 Claude 的 `web_search` + `web_fetch` tools

**OpenRouter API 端點（使用免費模型 `openrouter/polaris-alpha`）:**

4. **POST /api/openrouter/translate**
   - 翻譯英文例句成繁體中文
   - 輸入: `{ text }`
   - 輸出: `{ translation }`

5. **POST /api/openrouter/spell-check**
   - 拼字檢查與建議
   - 輸入: `{ word }`
   - 輸出: `{ isCorrect, isCorrectable, message, suggestions }`

6. **POST /api/ai/spell-check** (舊版，保留相容性)
   - 使用 Anthropic Claude 的拼字檢查
   - 輸入: `{ word }`
   - 輸出: Claude API 回應

### 資料儲存 (src/utils/storage.js)
- 使用 `localStorage` 模擬 `window.storage` API
- 提供 `set()`, `get()`, `delete()`, `list()`, `clear()` 方法
- 所有單字資料以 `vocab:` 為 key prefix 儲存
- 資料格式為 JSON 字串

### 單字資料結構

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

## AI 功能整合

### 前端 → 後端 → AI API

前端服務層 (`src/services/`) 呼叫本地 Express API：
- `ai.service.js` → `http://localhost:3001/api/ai/*` (Anthropic Claude)
- `openrouter.service.js` → `http://localhost:3001/api/openrouter/*` (OpenRouter 免費模型)
- `dictionary.service.js` → `http://localhost:3001/api/dictionary/*` (字典查詢)

後端 Express Server 代理請求到 AI API：
- **Anthropic Claude API**: 例句修正、字典查詢（使用 tools）
- **OpenRouter API**: 拼字檢查、例句翻譯（使用免費模型 `openrouter/polaris-alpha`）
- 使用環境變數管理 API Keys (`.env`)
- 解決 CORS 跨域問題
- 保護 API Keys 不暴露在前端

### 例句翻譯功能（OpenRouter）
- **不儲存翻譯結果**: 翻譯結果僅在前端暫時顯示，不寫入 localStorage
- **即時產生**: 每次點擊「翻譯」按鈕時呼叫 OpenRouter API
- **支援顯示/隱藏**: 點擊按鈕可切換顯示或隱藏翻譯
- **適用範圍**: 原始例句、我的例句、AI 修正例句

### 發音功能
- 使用 Web Speech API (`window.speechSynthesis`)
- `playPronunciation(text, accent, isSentence)`:
  - `accent`: 'uk' (en-GB) 或 'us' (en-US)
  - `isSentence`: 控制語速 (單字 0.8, 句子 0.9)
- 每個單字和例句都可即時播放發音

### 篩選與排序
- 搜尋: 單字、中英文定義
- 詞性篩選: 7 種詞性
- 標籤篩選: 動態從現有單字提取
- 日期篩選: 今天/本週/本月/全部
- 排序: 最新/最舊/字母順序

### 例句渲染
- `renderExample()`: 將 `**text**` 轉換成粗體 HTML (用於標記片語動詞)

## 技術棧

### 前端
- **React 19.2.0** - 函數組件 + Hooks
- **Vite 7.2.2** - 開發與建置工具
- **Tailwind CSS 4.1.17** - 使用 `@tailwindcss/vite` plugin
- **Lucide React** - Icon 庫

### 後端
- **Express 5.1.0** - Node.js Web 框架
- **CORS** - 跨域資源共享
- **Dotenv** - 環境變數管理
- **Anthropic Claude API** - AI 功能（例句修正、字典查詢）
- **OpenRouter API** - 免費 AI 模型（拼字檢查、例句翻譯）

### 開發工具
- **Concurrently** - 同時運行前後端
- **ESLint** - 使用 flat config (eslint.config.js)

## 開發注意事項

1. **環境變數設定**: 首次使用請複製 `.env.example` 為 `.env`，並填入 Anthropic 和 OpenRouter API Keys
2. **前後端同時運行**: 使用 `npm run dev` 會同時啟動前端 (5173) 和後端 (3001)
3. **API Keys 安全**: API Keys 儲存在後端 `.env`，不暴露在前端程式碼
4. **OpenRouter 免費模型**: 使用 `openrouter/polaris-alpha` 免費模型進行翻譯和拼字檢查
5. **翻譯結果不儲存**: 例句翻譯結果僅在前端暫時顯示，不寫入資料庫
6. **無路由設計**: 單頁應用程式，無需 React Router
7. **瀏覽器相容性**: Web Speech API 需要現代瀏覽器支援
8. **Tailwind 版本**: 使用 Tailwind CSS v4 (需注意與 v3 的差異)
9. **模組化架構**: 每個組件平均 50-150 行，職責清晰

## 已完成的改進

✅ **App.jsx 拆分成多個組件** - 從 1423 行減少到 261 行
✅ **API 呼叫邏輯移至 service 檔案** - 清晰的服務層
✅ **使用自訂 Hooks 管理狀態** - 可重用的邏輯
✅ **Express 後端整合** - 解決 CORS 和 API Key 安全問題
✅ **OpenRouter API 整合** - 免費 AI 模型支援翻譯和拼字檢查
✅ **例句即時翻譯功能** - 不儲存翻譯，節省空間

## 未來改進方向

1. 使用 React Context 或狀態管理庫 (Zustand/Redux)
2. 加入單元測試 (Vitest + React Testing Library)
3. 實作資料匯出/匯入功能
4. 加入間隔重複學習 (Spaced Repetition) 演算法
5. 多語言介面支援
6. 遷移到 Next.js（長期目標，獲得更好的 SSR 和 API Routes 支援）

## 參考文件

- `README.md` - 專案說明文件
- `API_SETUP.md` - API 設定詳細指南
- `.env.example` - 環境變數範本
