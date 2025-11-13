# API 設定指南

## 🔧 設定步驟

### 1. 取得 Anthropic API Key

1. 前往 [Anthropic Console](https://console.anthropic.com/)
2. 註冊/登入帳號
3. 前往 API Keys 頁面
4. 建立新的 API Key
5. 複製 API Key

### 2. 設定環境變數

編輯專案根目錄的 `.env` 檔案：

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx  # 貼上您的 API Key
PORT=3001
```

**⚠️ 重要：請勿將 `.env` 檔案提交到 Git！**

### 3. 啟動應用程式

```bash
# 同時啟動前端 (Vite) 和後端 (Express)
npm run dev
```

這個指令會同時運行：
- **前端** (Vite): `http://localhost:5173`
- **後端** (Express): `http://localhost:3001`

### 4. 驗證設定

開啟瀏覽器訪問：
- 前端應用：http://localhost:5173
- 後端健康檢查：http://localhost:3001/health

---

## 📁 架構說明

```
vocab-manager/
├── src/                    # 前端程式碼
│   ├── components/         # React 組件
│   ├── hooks/              # 自訂 Hooks
│   └── services/           # API 服務層 (呼叫本地後端)
├── server/                 # 後端程式碼
│   └── index.js            # Express API Server
├── .env                    # 環境變數 (不提交到 Git)
└── .env.example            # 環境變數範本
```

---

## 🔌 API 端點

### AI 服務
- `POST /api/ai/spell-check` - 拼字檢查
- `POST /api/ai/correct-example` - 修正例句

### 字典服務
- `POST /api/dictionary/free` - Free Dictionary API
- `POST /api/dictionary/cambridge` - Cambridge Dictionary API

---

## 🐛 疑難排解

### 問題：CORS 錯誤
**解決方案：** 確認後端伺服器正在運行 (http://localhost:3001)

### 問題：API Key 無效
**解決方案：** 檢查 `.env` 檔案中的 `ANTHROPIC_API_KEY` 是否正確

### 問題：前端無法連接後端
**解決方案：** 確認後端運行在 port 3001，或修改 `src/services/*.service.js` 中的 `API_BASE_URL`

---

## 📦 分別運行前後端

如果需要分別啟動：

```bash
# 終端 1: 啟動前端
npm run dev:client

# 終端 2: 啟動後端
npm run dev:server
```

---

## 🚀 部署建議

生產環境建議：
1. 使用環境變數管理 API Key
2. 設定適當的 CORS 政策
3. 考慮使用 Vercel/Netlify Serverless Functions
4. 或遷移到 Next.js (內建 API Routes)
