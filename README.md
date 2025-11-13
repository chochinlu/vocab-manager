# 技術英文詞彙管理系統

一個現代化的技術英文詞彙管理應用程式，幫助開發者儲存、管理和學習技術相關的英文單字與片語。

## 功能特色

### 核心功能

- **詞彙管理**: 新增、編輯、刪除技術英文單字
- **多重篩選**: 支援單字搜尋、詞性、標籤、日期範圍篩選
- **智慧排序**: 依最新、最舊或字母順序排列
- **例句管理**: 收錄原文例句、自訂例句，支援粗體標記 (`**text**`)

### AI 輔助功能

- **拼字檢查**: 使用 OpenRouter 免費模型自動檢查單字拼寫並提供建議
- **例句即時翻譯**: 點擊按鈕即時將英文例句翻譯成繁體中文（不儲存，使用 OpenRouter 免費模型）
- **例句修正**: AI 協助修正中式英文，提升例句品質
- **字典整合**:
  - Free Dictionary API 查詢
  - 劍橋字典資料抓取
  - 自動取得音標、發音檔案、定義

### 發音功能

- 使用 Web Speech API 即時發音
- 支援英式 (en-GB) 與美式 (en-US) 發音
- 單字與例句皆可播放

## 技術棧

### 前端

- **React 19.2.0** - 使用函數組件與 Hooks
- **Vite 7.2.2** - 高效能開發與建置工具
- **Tailwind CSS 4.1.17** - 現代化 CSS 框架
- **Lucide React** - Icon 圖示庫

### 後端

- **Express 5.1.0** - Node.js Web 框架
- **CORS** - 跨域資源共享
- **Dotenv** - 環境變數管理
- **Anthropic Claude API** - AI 功能後端（例句修正、字典查詢）
- **OpenRouter API** - 免費 AI 模型（拼字檢查、例句翻譯）

### 開發工具

- **Concurrently** - 同時運行前後端
- **ESLint** - 程式碼檢查

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 並重新命名為 `.env`，然後填入您的 API Keys：

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx     # Anthropic API Key
OPENROUTER_API_KEY=sk-or-v1-xxxxx       # OpenRouter API Key（免費）
PORT=3001
```

> 💡 **取得 API Keys**:
> - **Anthropic**: 前往 [Anthropic Console](https://console.anthropic.com/) 註冊並取得
> - **OpenRouter**: 前往 [OpenRouter](https://openrouter.ai/) 註冊並取得（提供免費模型）

### 3. 啟動開發模式

```bash
npm run dev
```

這個指令會同時啟動：

- **前端** (Vite): `http://localhost:5173`
- **後端** (Express): `http://localhost:3001`

> 📝 **分別啟動**: 使用 `npm run dev:client` (前端) 或 `npm run dev:server` (後端)

### 程式碼檢查

```bash
npm run lint
```

### 建置正式版本

```bash
npm run build
```

### 預覽建置結果

```bash
npm run preview
```

## 專案結構

```
vocab-manager/
├── src/                        # 前端程式碼
│   ├── components/             # React 組件
│   │   ├── common/             # 共用組件 (LoadingSpinner, PronunciationButton)
│   │   ├── Layout/             # 版面組件 (Header)
│   │   ├── Search/             # 搜尋與篩選 (SearchBar, FilterBar)
│   │   ├── Form/               # 表單組件 (VocabForm, AITools, TagManager)
│   │   └── VocabList/          # 單字列表 (VocabList, VocabCard, ExampleSection)
│   ├── hooks/                  # 自訂 Hooks
│   │   ├── useVocabs.js        # 單字資料管理
│   │   ├── useVocabFilters.js  # 篩選與排序
│   │   ├── useVocabForm.js     # 表單狀態管理
│   │   └── useAIFeatures.js    # AI 功能整合
│   ├── services/               # API 服務層
│   │   ├── vocab.service.js    # 單字 CRUD
│   │   ├── ai.service.js       # AI 功能（Anthropic Claude）
│   │   ├── openrouter.service.js # OpenRouter AI 服務（翻譯、拼字檢查）
│   │   ├── dictionary.service.js # 字典查詢
│   │   └── speech.service.js   # 發音服務
│   ├── utils/                  # 工具函數
│   │   ├── constants.js        # 常數定義
│   │   ├── renderExample.jsx   # 例句渲染
│   │   └── storage.js          # localStorage 封裝
│   ├── App.jsx                 # 主應用程式 (261 行，已重構)
│   ├── main.jsx                # React 進入點
│   └── index.css               # Tailwind CSS 主檔案
├── server/                     # 後端程式碼
│   └── index.js                # Express API Server
├── public/                     # 靜態資源
├── .env                        # 環境變數 (不提交到 Git)
├── .env.example                # 環境變數範本
├── API_SETUP.md                # API 設定詳細說明
├── vite.config.js              # Vite 配置
├── eslint.config.js            # ESLint 配置
├── tailwind.config.js          # Tailwind CSS v4 配置
└── package.json
```

## 資料結構

### 單字資料格式

```javascript
{
  id: "vocab:{word}-{partOfSpeech}-{timestamp}",
  word: string,
  partOfSpeech: 'verb' | 'noun' | 'adjective' | 'adverb' |
                'phrasal-verb' | 'phrase' | 'other',
  addedDate: ISO string,
  definitions: {
    chinese: string,
    english: string
  },
  examples: {
    original: string[],    // 支援 **粗體** markdown
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

### 資料儲存

- 使用瀏覽器 `localStorage` 儲存所有單字資料
- Key 格式: `vocab:{word}-{partOfSpeech}-{timestamp}`
- 透過 `src/utils/storage.js` 封裝存取介面

## 架構說明

### 前後端分離架構

本專案採用前後端分離架構：

- **前端**: React + Vite (Port 5173)

  - 使用模組化組件設計
  - 透過 Hooks 管理狀態邏輯
  - 呼叫本地 Express API

- **後端**: Express (Port 3001)
  - 代理 Anthropic Claude API 請求（例句修正、字典查詢）
  - 代理 OpenRouter API 請求（拼字檢查、例句翻譯）
  - 保護 API Keys 不暴露在前端
  - 解決 CORS 跨域問題

### AI 功能架構

- **Anthropic Claude**: 例句修正、字典查詢（利用 tools 功能）
- **OpenRouter 免費模型**: 拼字檢查、例句翻譯（使用 `openrouter/polaris-alpha`）
- **翻譯功能**: 不儲存翻譯結果，即時產生並暫時顯示

## 開發注意事項

1. **環境變數**: 請確保 `.env` 檔案已正確設定 Anthropic 和 OpenRouter API Keys
2. **OpenRouter 免費模型**: 翻譯和拼字檢查使用免費模型，無需付費
3. **翻譯結果**: 例句翻譯不儲存至 localStorage，僅前端暫時顯示
4. **無路由設計**: 單頁應用程式，無需 React Router
5. **API Keys 安全**: API Keys 儲存在後端，不暴露在前端程式碼
6. **瀏覽器相容性**: Web Speech API 需現代瀏覽器支援
7. **Tailwind CSS v4**: 注意與 v3 版本的差異
8. **前後端同時運行**: 使用 `npm run dev` 即可同時啟動

## 未來規劃

- [x] ~~組件模組化重構 (VocabList, VocabForm, SearchBar 等)~~
- [x] ~~API 服務層抽離~~
- [x] ~~Express 後端 API 整合~~
- [x] ~~OpenRouter API 整合（免費模型）~~
- [x] ~~例句即時翻譯功能~~
- [ ] 引入狀態管理方案 (Zustand/Redux)
- [ ] 單元測試 (Vitest + React Testing Library)
- [ ] 資料匯出/匯入功能
- [ ] 間隔重複學習 (Spaced Repetition) 演算法
- [ ] 多語言介面支援
- [ ] 遷移到 Next.js (長期目標)

## 授權

MIT License

## 作者

glow47
