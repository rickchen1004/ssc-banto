# Vercel 部署指南

## 🚀 快速部署到 Vercel

### 前置準備

1. ✅ GitHub 帳號
2. ✅ 專案已推送到 GitHub
3. ✅ Google Apps Script 已部署並取得 URL

---

## 步驟 1：註冊 Vercel

1. 前往 https://vercel.com
2. 點擊「Sign Up」
3. 選擇「Continue with GitHub」
4. 授權 Vercel 存取你的 GitHub

---

## 步驟 2：匯入專案

1. 登入後，點擊「Add New...」→「Project」
2. 選擇你的 GitHub repository（`ssc-banto`）
3. 點擊「Import」

---

## 步驟 3：設定專案

### 3.1 Framework Preset
- Vercel 會自動偵測到 **Vite**
- 保持預設設定即可

### 3.2 Root Directory
- 保持預設（根目錄）

### 3.3 Build and Output Settings
- **Build Command**: `npm run build`（預設）
- **Output Directory**: `dist`（預設）
- **Install Command**: `npm install`（預設）

### 3.4 Environment Variables（重要！）

點擊「Environment Variables」，新增：

| Name | Value |
|------|-------|
| `VITE_GOOGLE_SCRIPT_URL` | 你的 Google Apps Script Web App URL |

**範例：**
```
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycby.../exec
```

⚠️ **注意：** 
- 變數名稱必須是 `VITE_GOOGLE_SCRIPT_URL`（完全一樣）
- URL 要包含完整的 `https://` 開頭
- URL 結尾是 `/exec`

---

## 步驟 4：部署

1. 確認所有設定正確
2. 點擊「Deploy」
3. 等待 1-2 分鐘（第一次會比較久）
4. 部署完成！🎉

---

## 步驟 5：取得網址

部署完成後，你會看到：

```
🎉 Your project has been deployed!

https://ssc-banto.vercel.app
```

點擊網址就可以看到你的應用程式了！

---

## 🔄 自動部署

設定完成後，每次你推送程式碼到 GitHub：

```bash
git add .
git commit -m "更新功能"
git push
```

Vercel 會自動：
1. 偵測到新的 commit
2. 自動建置
3. 自動部署
4. 更新網站

完全不用手動操作！

---

## 🌐 自訂網域（選用）

如果你有自己的網域：

1. 在 Vercel 專案頁面，點擊「Settings」
2. 點擊「Domains」
3. 輸入你的網域名稱
4. 按照指示設定 DNS

---

## 📊 監控和分析

Vercel 提供免費的：
- 📈 流量分析
- ⚡ 效能監控
- 🐛 錯誤追蹤
- 📝 部署歷史

在專案頁面的「Analytics」可以查看。

---

## 🔧 常見問題

### Q1: 部署後顯示「找不到環境變數」

**解決方法：**
1. 檢查環境變數名稱是否正確：`VITE_GOOGLE_SCRIPT_URL`
2. 重新部署：在 Vercel 專案頁面點擊「Deployments」→ 最新的部署 → 「Redeploy」

### Q2: 部署後無法連接 Google Apps Script

**解決方法：**
1. 檢查 Google Apps Script 是否已部署為「Web App」
2. 檢查權限設定：「任何人」都可以存取
3. 檢查環境變數的 URL 是否正確（包含 `/exec`）

### Q3: 如何查看部署日誌？

1. 在 Vercel 專案頁面，點擊「Deployments」
2. 點擊任一部署
3. 點擊「Building」查看建置日誌

### Q4: 如何回滾到之前的版本？

1. 在「Deployments」找到之前的部署
2. 點擊「...」→「Promote to Production」

---

## 💡 進階設定

### 預覽部署（Preview Deployments）

每次推送到非主分支（例如 `dev`），Vercel 會建立預覽部署：
- 獨立的 URL
- 不影響正式環境
- 適合測試新功能

### 環境變數分類

可以為不同環境設定不同的變數：
- **Production**：正式環境
- **Preview**：預覽環境
- **Development**：開發環境

---

## 📱 分享給學生

部署完成後，你可以：

1. **直接分享網址**
   ```
   https://ssc-banto.vercel.app
   ```

2. **產生 QR Code**
   - 使用 https://www.qr-code-generator.com/
   - 輸入你的 Vercel 網址
   - 下載 QR Code
   - 列印給學生掃描

3. **加入書籤**
   - 學生可以將網址加入手機書籤
   - 下次直接點擊就能訂餐

---

## 🎯 效能優化建議

### 1. 啟用 Vercel Analytics（免費）

```bash
npm install @vercel/analytics
```

在 `src/main.tsx` 加入：

```typescript
import { inject } from '@vercel/analytics';

inject();
```

### 2. 圖片優化

如果菜單圖片很大，可以使用 Vercel 的圖片優化：
- 自動壓縮
- 自動轉換格式（WebP）
- 自動調整大小

---

## ✅ 部署檢查清單

部署前確認：

- [ ] 程式碼已推送到 GitHub
- [ ] Google Apps Script 已部署
- [ ] 已取得 Google Apps Script URL
- [ ] 已在 Vercel 設定環境變數
- [ ] 本地測試通過（`npm run build` 成功）

部署後確認：

- [ ] 網站可以正常開啟
- [ ] 可以載入菜單和餐點
- [ ] 可以選擇餐點和加購
- [ ] 可以提交訂單
- [ ] 訂單有寫入 Google Sheet

---

## 🎉 完成！

現在你的學生午餐訂購系統已經上線了！

**你的網址：** `https://your-project.vercel.app`

學生可以隨時隨地用手機訂餐，訂單會自動記錄到你的 Google Sheet！
