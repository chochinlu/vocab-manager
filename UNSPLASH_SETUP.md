# Unsplash API 設定指南

本專案使用 Unsplash API 提供動態背景圖片功能。

## 📝 快速設定步驟

### 1. 註冊 Unsplash 開發者帳號

1. 前往 [Unsplash Developers](https://unsplash.com/developers)
2. 點擊 **Register as a developer**
3. 接受開發者條款

### 2. 建立應用程式

1. 登入後點擊 **Your apps**
2. 點擊 **New Application**
3. 填寫應用程式資訊：
   - **Application name**: Vocab Manager（或任意名稱）
   - **Description**: Personal vocabulary learning app with dynamic backgrounds
4. 勾選同意條款
5. 點擊 **Create application**

### 3. 取得 Access Key

1. 在應用程式頁面中找到 **Keys** 區塊
2. 複製 **Access Key**（不是 Secret key）

### 4. 設定環境變數

1. 複製 `.env.example` 為 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 編輯 `.env` 檔案，填入你的 Access Key：
   ```
   UNSPLASH_ACCESS_KEY=your_actual_access_key_here
   ```

3. 儲存檔案

### 5. 啟動應用程式

```bash
npm run dev
```

## ⚙️ API 限制

### 免費版限制
- **每小時**: 50 次請求
- **每月**: 無限制

### 如何避免超過限制
本專案已內建快取機制：
- **每日模式**（預設）：24 小時內使用同一張背景
- **固定模式**：永遠使用同一張背景
- **每次模式**：每次進入都換新圖（會消耗較多 API 請求）

推薦使用「每日模式」，一天只會請求一次 API。

## 🎨 可用主題

Unsplash Collections ID 已預設好：

| 主題 | Collection ID | 說明 |
|------|--------------|------|
| technology | 1065396 | 科技、程式碼相關 |
| nature | 3330445 | 自然風景 |
| workspace | 1391584 | 辦公空間、桌面 |
| minimal | 1163637 | 極簡風格 |
| architecture | 3330452 | 建築設計 |

## 🛠️ 開發者工具

打開瀏覽器控制台（F12），可使用以下指令：

```javascript
// 切換主題
setBackgroundTheme('nature')

// 切換模式
setBackgroundMode('always')   // 每次都換
setBackgroundMode('daily')    // 每日更換
setBackgroundMode('fixed')    // 固定背景

// 重新載入背景
refreshBackground()

// 查看當前設定
showBackgroundSettings()
```

## ❓ 常見問題

### Q: 看不到背景圖片？
A: 請確認：
1. `.env` 檔案中的 `UNSPLASH_ACCESS_KEY` 已正確設定
2. 後端伺服器正在運行（`npm run dev` 會同時啟動前後端）
3. 打開瀏覽器控制台查看是否有錯誤訊息

### Q: 顯示「API 請求次數已達上限」？
A: 免費版每小時只能請求 50 次，請：
1. 等待一小時後再試
2. 改用「每日模式」減少請求次數
3. 或暫時停用背景圖片：`disableBackground()`

### Q: 想使用自己的圖片分類？
A: 可以：
1. 在 Unsplash 網站建立自己的 Collection
2. 修改 `src/services/background.service.js` 中的 `UNSPLASH_COLLECTIONS` 常數
3. 加入你的 Collection ID

### Q: 如何停用背景圖片？
A: 打開控制台輸入：
```javascript
disableBackground()
```

## 📚 相關文件

- [Unsplash API 文件](https://unsplash.com/documentation)
- [Unsplash API Guidelines](https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines)
