# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

這是一個技術英文詞彙管理應用程式，採用**前後端分離架構**：
- **前端**: React + Vite + Tailwind CSS v4
- **後端**: Express API Server

應用程式允許使用者儲存、管理和學習技術英文單字，具備 AI 輔助功能（拼字檢查、例句翻譯、定義翻譯、例句修正、字典查詢）、完整的練習系統（情境提示、AI 批改、統計追蹤）和動態背景圖片功能。

## 架構特色

✅ **模組化組件設計** - 33 個精簡組件，清晰的職責分離
✅ **前後端分離** - Express 代理 AI API 和 Unsplash API，解決 CORS 問題
✅ **API Key 安全** - 後端管理，不暴露在前端
✅ **自訂 Hooks** - 可重用的狀態邏輯
✅ **React Context** - Toast 通知系統使用 Context 管理全域狀態
✅ **服務層抽離** - API 邏輯獨立管理
✅ **動態背景圖片** - Unsplash API 提供高品質背景，支援多種主題與快取機制
✅ **完整練習系統** - 情境提示、AI 批改、統計追蹤、錯誤分析
✅ **例句管理功能** - 編輯模式下可刪除和調整例句順序，瀏覽模式保持簡潔

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
  - `DynamicBackground.jsx` - 動態背景圖片組件（Unsplash API）
  - `Toast.jsx` - 單一 Toast 通知訊息
  - `ToastContainer.jsx` - Toast 通知容器
  - `FloatingActionButtons.jsx` - 浮動動作按鈕（新增單字 + 回到頂部）

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
  - `VocabCard.jsx` - 單字卡片（瀏覽模式，無例句編輯功能）
  - `ExampleSection.jsx` - 例句顯示區塊（支援瀏覽/編輯模式切換）

- **Practice/** - 練習系統
  - `PracticeMode.jsx` - 全螢幕練習介面
  - `PracticeStats.jsx` - 練習統計顯示
  - `PracticeFeedback.jsx` - AI 批改結果顯示
  - `ErrorPatterns.jsx` - 常見錯誤模式顯示
  - `ModelSelector.jsx` - AI 模型選擇器
  - `ScenarioPrompt.jsx` - 情境提示組件

#### Context 層 (contexts/)
- `ToastContext.jsx` - Toast 通知系統全域狀態管理

#### Hooks 層 (hooks/)
- `useVocabs.js` - 單字資料管理 (CRUD)
- `useVocabFilters.js` - 篩選與排序邏輯
- `useVocabForm.js` - 表單狀態管理
- `useAIFeatures.js` - AI 功能整合
- `usePracticeSession.js` - 練習會話管理（造句、批改、統計）
- `useToast.js` - Toast 通知狀態管理

#### 服務層 (services/)
- `vocab.service.js` - 單字 CRUD 操作
- `ai.service.js` - Anthropic AI 功能（例句修正，呼叫本地 Express API）
- `openrouter.service.js` - OpenRouter AI 服務（拼字檢查、例句翻譯，呼叫本地 Express API）
- `dictionary.service.js` - 字典查詢（呼叫本地 Express API）
- `speech.service.js` - 發音服務（Web Speech API）
- `practice.service.js` - 練習批改服務（AI 批改、統計計算，呼叫本地 Express API）
- `background.service.js` - 動態背景圖片服務（Unsplash API，呼叫本地 Express API）

#### 工具層 (utils/)
- `storage.js` - localStorage 封裝（包含 AI 模型設定管理）
- `constants.js` - 常數定義（詞性、排序選項等）
- `renderExample.jsx` - 例句渲染（支援 **粗體** 標記）
- `scenarioPrompts.js` - 情境提示資料庫（43 種情境，按詞性分類）
- `backgroundHelper.js` - 背景圖片管理輔助工具（開發用控制台指令）

#### 主應用程式 (App.jsx)
重構後的精簡版本（330 行，原 1423 行）：
- 整合所有 Hooks 管理狀態
- 協調各組件互動
- 處理事件邏輯
- 包含練習模式整合

### 後端架構 (server/)

#### Express API Server (server/index.js)
提供 7 個 API 端點：

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

**OpenRouter API 端點（使用免費模型 `qwen/qwen-2.5-72b-instruct:free`）:**

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

**Unsplash API 端點:**

7. **GET /api/unsplash/random**
   - 取得 Unsplash 隨機圖片
   - 查詢參數: `{ query?, collections?, orientation }`
   - 輸出: `{ id, url, description, author, ... }`
   - 支援主題 Collections 和關鍵字搜尋

**練習系統 API 端點:**

8. **POST /api/ai/practice-feedback**
   - AI 批改學生造句
   - 輸入: `{ word, partOfSpeech, sentence, model }`
   - 輸出: `{ score, isCorrect, errors, suggestions, improvedVersion, overallComment, proficiencyAssessment }`
   - 支援 3 種 AI 模型選擇（haiku, sonnet, qwen）

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
  reviewHistory: array,
  practiceStats: {
    totalPractices: number,
    lastPracticeDate: ISO string,
    proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'mastered',
    commonErrors: [
      {
        type: 'grammar' | 'usage' | 'word-choice' | 'spelling',
        pattern: string,
        count: number
      }
    ],
    averageScore: number,
    recentScores: number[]  // 最近 3 次分數
  }
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
- **OpenRouter API**: 拼字檢查、例句翻譯（使用免費模型 `qwen/qwen-2.5-72b-instruct:free`）
- 使用環境變數管理 API Keys (`.env`)
- 解決 CORS 跨域問題
- 保護 API Keys 不暴露在前端

### 例句翻譯功能（OpenRouter）
- **不儲存翻譯結果**: 翻譯結果僅在前端暫時顯示，不寫入 localStorage
- **即時產生**: 每次點擊「翻譯」按鈕時呼叫 OpenRouter API
- **支援顯示/隱藏**: 點擊按鈕可切換顯示或隱藏翻譯
- **適用範圍**: 原始例句、我的例句、AI 修正例句

### 動態背景圖片功能（Unsplash API）
- **高品質圖片**: 使用 Unsplash API 提供的專業攝影作品
- **主題 Collections**: 5 種精選主題（科技、自然、辦公空間、極簡、建築）
- **智慧快取機制**:
  - **每日模式**（預設）: 24 小時內使用同一張背景，每天僅請求 1 次 API
  - **固定模式**: 永遠使用同一張背景，僅請求 1 次 API
  - **每次模式**: 每次進入都換新圖（測試用，消耗較多 API 配額）
- **API 配額管理**: 免費版每小時 50 次請求，透過快取有效控制使用量
- **開發者工具**: 提供控制台指令（`refreshBackground()`, `setBackgroundTheme()`, `setBackgroundMode()` 等）
- **圖片預載入**: 防止背景切換時閃爍
- **fallback 機制**: API 失敗時自動使用漸層背景
- **UI 適配**: 所有卡片使用半透明白底（`bg-white/95 backdrop-blur-sm`）確保內容可讀性

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

### 例句管理與渲染
- `renderExample()`: 將 `**text**` 轉換成粗體 HTML (用於標記片語動詞)
- **例句編輯功能**:
  - **瀏覽模式**（VocabCard）: 僅顯示例句內容，支援翻譯和發音，無編輯按鈕
  - **編輯模式**（VocabForm）: 提供完整的例句管理功能
    - 刪除例句（帶確認對話框）
    - 調整例句順序（上移/下移按鈕）
    - 新增例句
    - 邊界處理：第一個例句無上移按鈕，最後一個例句無下移按鈕
  - **ExampleSection 組件**: 根據是否傳遞 `onDelete` 和 `onReorder` handlers 自動判斷模式

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
- **Unsplash API** - 高品質隨機背景圖片（免費，每小時 50 次請求）

### 開發工具
- **Concurrently** - 同時運行前後端
- **ESLint** - 使用 flat config (eslint.config.js)

## 開發注意事項

1. **環境變數設定**: 首次使用請複製 `.env.example` 為 `.env`，並填入 Anthropic、OpenRouter 和 Unsplash API Keys
2. **前後端同時運行**: 使用 `npm run dev` 會同時啟動前端 (5173) 和後端 (3001)
3. **API Keys 安全**: 所有 API Keys 儲存在後端 `.env`，不暴露在前端程式碼
4. **OpenRouter 免費模型**: 使用 `qwen/qwen-2.5-72b-instruct:free` 免費模型進行翻譯和拼字檢查
5. **翻譯結果不儲存**: 例句翻譯結果僅在前端暫時顯示，不寫入資料庫
6. **Unsplash API**:
   - 免費版每小時 50 次請求（使用每日模式一天僅請求一次）
   - 首次使用需註冊並取得 Access Key（詳見 `UNSPLASH_SETUP.md`）
   - 背景圖片可透過控制台指令管理（`refreshBackground()` 等）
7. **無路由設計**: 單頁應用程式，無需 React Router
8. **瀏覽器相容性**: Web Speech API 需要現代瀏覽器支援
9. **Tailwind 版本**: 使用 Tailwind CSS v4 (需注意與 v3 的差異)
10. **模組化架構**: 每個組件平均 50-150 行，職責清晰

## 已完成的改進

✅ **App.jsx 拆分成多個組件** - 從 1423 行減少到 261 行
✅ **API 呼叫邏輯移至 service 檔案** - 清晰的服務層
✅ **使用自訂 Hooks 管理狀態** - 可重用的邏輯
✅ **Express 後端整合** - 解決 CORS 和 API Key 安全問題
✅ **OpenRouter API 整合** - 免費 AI 模型支援翻譯和拼字檢查
✅ **例句即時翻譯功能** - 不儲存翻譯，節省空間
✅ **英文定義翻譯功能** - 在瀏覽和編輯介面翻譯英文定義
✅ **Unsplash API 動態背景圖片** - 高品質背景圖片，支援多種主題與快取機制
✅ **Toast 通知系統** - 取代 alert，使用 React Context 提供優雅的通知體驗
✅ **浮動動作按鈕** - 右下角快速新增單字 + 回到頂部按鈕
✅ **完整練習系統** - 造句練習、AI 批改、統計追蹤、錯誤分析
✅ **情境提示功能** - 43 種多樣化情境提示，幫助從不同角度造句
✅ **例句管理功能** - 編輯模式下可刪除和調整例句順序

## 未來改進方向

1. AI 動態生成個性化情境（根據 tags 和 context）
2. 背景圖片設定介面（主題切換、模式選擇的 UI 介面）
3. 加入單元測試 (Vitest + React Testing Library)
4. 實作資料匯出/匯入功能
5. 加入間隔重複學習 (Spaced Repetition) 演算法
6. 多語言介面支援
7. 引入狀態管理庫 (Zustand/Redux)（若應用規模持續擴大）
8. 遷移到 Next.js（長期目標，獲得更好的 SSR 和 API Routes 支援）

## 參考文件

- `README.md` - 專案說明文件
- `API_SETUP.md` - API 設定詳細指南
- `UNSPLASH_SETUP.md` - Unsplash API 設定指南
- `.env.example` - 環境變數範本
