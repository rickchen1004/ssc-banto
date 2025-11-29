# Google Apps Script 實作指南

## 📁 檔案說明

### Code.gs
主要的 API 程式碼，包含：
- `doGet()` - 處理 GET 請求，讀取設定資料
- `doPost()` - 處理 POST 請求，寫入訂單資料（任務 4.2 實作）
- `parseMealsData()` - 解析餐點資料
- `parseAddonsData()` - 解析加購項目資料

### TEST_FUNCTIONS.gs（可選）
測試函數集，幫助你驗證程式碼是否正常運作：
- `testReadConfig()` - 測試讀取設定工作表
- `testReadMeals()` - 測試讀取餐點工作表
- `testReadAddons()` - 測試讀取加購工作表
- `testDoGetComplete()` - 測試完整的 doGet 流程
- `testSwitchRestaurant()` - 測試切換餐廳功能
- `testDataIntegrity()` - 驗證資料完整性

### DEPLOYMENT_GUIDE.md
詳細的部署步驟說明

## 🚀 快速開始

### 步驟 1: 複製程式碼到 Apps Script

1. 開啟你的 Google Sheet「安親班訂便當系統」
2. 點擊：**擴充功能** → **Apps Script**
3. 刪除預設的程式碼
4. 複製 `Code.gs` 的內容並貼上
5. 儲存（Ctrl+S 或 Cmd+S）
6. 專案命名為：**訂便當系統 API**

### 步驟 2: 測試程式碼（可選但建議）

如果你想測試程式碼是否正常：

1. 在 Apps Script 編輯器中，點擊左側的「+」新增檔案
2. 命名為 `TEST_FUNCTIONS`
3. 複製 `TEST_FUNCTIONS.gs` 的內容並貼上
4. 儲存

然後你可以執行這些測試函數：
- 選擇 `testDataIntegrity` 函數
- 點擊「執行」
- 查看執行記錄

### 步驟 3: 授權

第一次執行時需要授權：
1. 點擊「檢查權限」
2. 選擇你的 Google 帳號
3. 點擊「進階」→「前往『訂便當系統 API』(不安全)」
4. 點擊「允許」

## 📊 資料流程

```
前端應用程式
    ↓ (GET 請求)
doGet() 函數
    ↓
讀取「設定」工作表 → 取得今日餐廳和菜單圖片
    ↓
讀取「餐點」工作表 → parseMealsData() → 篩選今日餐廳的餐點
    ↓
讀取「加購」工作表 → parseAddonsData() → 篩選今日餐廳的加購項目
    ↓
組合資料 → 關聯餐點和加購項目
    ↓
回傳 JSON 格式的設定資料
    ↓
前端應用程式接收並顯示
```

## 🧪 測試建議

建議按照以下順序測試：

1. **testDataIntegrity** - 先確認所有資料都正確設定
2. **testReadConfig** - 測試讀取設定工作表
3. **testReadMeals** - 測試讀取餐點資料
4. **testReadAddons** - 測試讀取加購資料
5. **testDoGetComplete** - 測試完整流程
6. **testSwitchRestaurant** - 測試切換餐廳功能

## 📝 任務進度

- [x] 任務 4.1: 實作 doGet 函數讀取設定資料
  - [x] 讀取設定工作表的今日餐廳和菜單圖片網址
  - [x] 實作 parseMealsData 函數篩選今日餐廳的餐點
  - [x] 實作 parseAddonsData 函數篩選今日餐廳的加購項目
  - [x] 組合並回傳 JSON 格式的設定資料

- [ ] 任務 4.2: 實作 doPost 函數寫入訂單資料（下一步）

- [ ] 任務 4.3: 部署為 Web App（最後一步）

## 🐛 常見問題

### Q: 執行時出現「找不到工作表」錯誤
A: 確認 Google Sheet 中的工作表名稱完全一致（包含中文字）

### Q: 執行時出現「A2 儲存格為空」錯誤
A: 在「設定」工作表的 A2 儲存格填入餐廳名稱

### Q: 測試函數沒有輸出
A: 點擊下方的「執行記錄」查看輸出

### Q: 需要重新授權
A: 重新執行任何函數，會再次要求授權

## 💡 提示

- 每次修改程式碼後記得儲存（Ctrl+S）
- 使用測試函數可以快速驗證程式碼
- 執行記錄會顯示詳細的輸出資訊
- 如果遇到問題，先執行 `testDataIntegrity` 檢查資料

## 下一步

完成任務 4.1 後，請告訴我結果，我們會繼續：
- 任務 4.2: 實作 doPost 函數寫入訂單資料
- 任務 4.3: 部署為 Web App 並取得 URL
