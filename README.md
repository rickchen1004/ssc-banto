# 安親班學生訂便當系統

一個簡單易用的學生午餐訂購系統，讓學生能夠透過網頁介面選擇餐點、填寫訂單，並將訂單自動記錄到 Google Sheets。

## 📋 專案特色

- 🍱 **多餐廳支援** - 在 Google Sheets 中管理多家餐廳，輕鬆切換每日供應商
- 🔢 **數量選擇** - 學生可以選擇每個餐點的數量（1-99 份），系統自動計算小計
- 📱 **響應式設計** - 支援手機、平板、桌面等各種裝置
- 🎨 **友善介面** - 清晰易懂的操作流程，適合小學生使用
- 📊 **Google Sheets 整合** - 無需資料庫，直接使用 Google Sheets 管理資料
- ✅ **即時驗證** - 自動計算金額，防止錯誤提交
- 🔐 **菜單匯入工具** - 管理員可透過密碼保護的介面快速匯入 JSON 格式菜單
- 🧪 **完整測試** - 包含單元測試和屬性基礎測試 (Property-Based Testing)

## 🛠️ 技術架構

### 前端
- **React 19** + **TypeScript** - 現代化的前端框架
- **Vite** - 快速的開發和建置工具
- **Tailwind CSS 4** - 實用優先的 CSS 框架
- **Vitest** + **fast-check** - 單元測試和屬性測試

### 後端
- **Google Apps Script** - 作為 API 層
- **Google Sheets** - 作為資料庫

## 📦 安裝與設定

### 1. 克隆專案

```bash
git clone https://github.com/rickchen1004/ssc-banto.git
cd ssc-banto
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 設定 Google Sheets

請參考 [Google Sheet 設定指南](./GOOGLE_SHEET_SETUP_GUIDE.md) 完成以下步驟：

1. 建立 Google Sheet 並設定工作表結構
2. 填入餐廳、餐點、加購項目資料
3. 部署 Google Apps Script 為 Web App
4. 取得 Web App URL

詳細的餐廳設定說明請參考 [餐廳設定指南](./RESTAURANT_SETUP_GUIDE.md)

### 4. 設定環境變數

複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入你的 Google Apps Script URL 和管理員密碼：

```env
# Google Apps Script Web App URL
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# 管理員密碼（用於訪問菜單匯入工具）
VITE_ADMIN_PASSWORD=your_secure_password_here
```

**重要提示：**
- `VITE_ADMIN_PASSWORD` 用於保護菜單匯入工具，防止學生誤入
- 請設置一個強密碼（建議至少 12 個字元）
- 不要將 `.env` 檔案提交到版本控制系統

### 5. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 `http://localhost:5173`

## 🚀 部署

### 部署到 Vercel（推薦）

1. 前往 [Vercel](https://vercel.com)
2. 匯入 GitHub repository
3. 設定環境變數 `VITE_GOOGLE_SCRIPT_URL`
4. 點擊部署

詳細步驟請參考 [Vercel 部署指南](./DEPLOYMENT_VERCEL.md)

### 建置靜態檔案

```bash
npm run build
```

建置完成的檔案會在 `dist/` 資料夾中，可以部署到任何靜態網站託管服務。

## 📖 使用方式

### 學生端操作流程

1. **查看菜單** - 開啟應用程式，查看今日餐廳菜單圖片
2. **選擇餐點** - 點擊想要的餐點（只能選一個）
3. **選擇備註** - 選擇餐點的客製化選項（例如：加辣、粗麵）
4. **選擇加購** - 選擇額外的加購項目（例如：加麵、飲料）
5. **填寫姓名** - 輸入學生姓名
6. **確認金額** - 查看自動計算的總金額
7. **提交訂單** - 點擊提交按鈕，完成訂購

### 管理員端管理

#### 方式一：使用菜單匯入工具（推薦）

1. **訪問匯入頁面** - 開啟 `/importer` 路徑（例如：`https://your-app.vercel.app/importer`）
2. **輸入管理員密碼** - 使用設定的 `VITE_ADMIN_PASSWORD` 進行驗證
3. **填寫餐廳資訊** - 輸入餐廳名稱和菜單圖片網址
4. **貼上 JSON 資料** - 將 Gemini AI 產生的 JSON 格式菜單資料貼入
5. **預覽資料** - 系統會即時驗證並顯示預覽
6. **匯入** - 點擊匯入按鈕，資料會自動寫入 Google Sheets

#### 方式二：直接編輯 Google Sheets

1. **切換餐廳** - 在「設定」工作表中，將想要的餐廳「啟用」欄位設為 `TRUE`
2. **更新菜單** - 更新「菜單圖片網址」欄位
3. **管理餐點** - 在「餐點」工作表中新增、修改、刪除餐點
4. **管理加購** - 在「加購」工作表中新增、修改、刪除加購項目
5. **查看訂單** - 在「訂單」工作表中查看所有學生的訂單記錄

## 🧪 測試

### 執行所有測試

```bash
npm test
```

### 執行測試（單次）

```bash
npm run test -- --run
```

### 測試涵蓋範圍

- ✅ 單元測試 - 測試個別函數和元件
- ✅ 屬性測試 - 使用 fast-check 進行屬性基礎測試
- ✅ 整合測試 - 測試元件間的互動

## 📁 專案結構

```
ssc-banto/
├── src/
│   ├── components/      # React 元件
│   ├── hooks/          # 自訂 Hooks（狀態管理）
│   ├── services/       # API 服務層
│   ├── types/          # TypeScript 型別定義
│   └── utils/          # 工具函數
├── google-apps-script/ # Google Apps Script 程式碼
├── .kiro/specs/        # 需求和設計文件
└── public/             # 靜態資源
```

## 📚 相關文件

- [需求文件](./.kiro/specs/student-lunch-order/requirements.md) - 完整的功能需求
- [設計文件](./.kiro/specs/student-lunch-order/design.md) - 系統架構和設計
- [Google Sheet 設定指南](./GOOGLE_SHEET_SETUP_GUIDE.md) - 設定 Google Sheets 的詳細步驟
- [餐廳設定指南](./RESTAURANT_SETUP_GUIDE.md) - 如何管理多家餐廳
- [Vercel 部署指南](./DEPLOYMENT_VERCEL.md) - 部署到 Vercel 的步驟

## 🔧 開發指令

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview

# 執行測試
npm test

# 執行 ESLint
npm run lint
```

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

## 📄 授權

MIT License

## 👨‍💻 作者

Rick Chen - [GitHub](https://github.com/rickchen1004)

---

如有任何問題，請開啟 [Issue](https://github.com/rickchen1004/ssc-banto/issues) 或聯繫作者。
