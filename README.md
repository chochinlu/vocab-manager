# 技術英文詞彙管理系統

一個現代化的技術英文詞彙管理應用程式，幫助開發者儲存、管理和學習技術相關的英文單字與片語。

## 功能特色

### 核心功能
- **詞彙管理**: 新增、編輯、刪除技術英文單字
- **多重篩選**: 支援單字搜尋、詞性、標籤、日期範圍篩選
- **智慧排序**: 依最新、最舊或字母順序排列
- **例句管理**: 收錄原文例句、自訂例句，支援粗體標記 (`**text**`)

### AI 輔助功能
- **拼字檢查**: 自動檢查單字拼寫並提供建議
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

- **React 19.2.0** - 使用函數組件與 Hooks
- **Vite 7.2.2** - 高效能開發與建置工具
- **Tailwind CSS 4.1.17** - 現代化 CSS 框架
- **Lucide React** - Icon 圖示庫
- **Anthropic Claude API** - AI 功能後端

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

預設會在 `http://localhost:5173` 啟動開發伺服器

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
├── src/
│   ├── App.jsx           # 主應用程式組件 (1400+ 行)
│   ├── main.jsx          # React 進入點
│   ├── index.css         # Tailwind CSS 主檔案
│   └── utils/
│       └── storage.js    # localStorage 封裝工具
├── public/               # 靜態資源
├── index.html            # HTML 模板
├── vite.config.js        # Vite 配置
├── eslint.config.js      # ESLint 配置 (Flat Config)
├── tailwind.config.js    # Tailwind CSS v4 配置
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

## 開發注意事項

1. **單一組件架構**: 目前 `App.jsx` 為單一大型組件，未來可考慮模組化
2. **無路由設計**: 單頁應用程式，無需 React Router
3. **API Key 管理**: AI 功能需要 Anthropic API key，請妥善管理金鑰
4. **瀏覽器相容性**: Web Speech API 需現代瀏覽器支援
5. **Tailwind CSS v4**: 注意與 v3 版本的差異

## 未來規劃

- [ ] 組件模組化重構 (VocabList, VocabForm, SearchBar 等)
- [ ] API 服務層抽離
- [ ] 引入狀態管理方案 (Zustand/Redux)
- [ ] 單元測試 (Vitest + React Testing Library)
- [ ] 資料匯出/匯入功能
- [ ] 間隔重複學習 (Spaced Repetition) 演算法
- [ ] 多語言介面支援

## 授權

MIT License

## 作者

glow47
