# 設計文件

## 概述

JSON 匯入工具是一個 web 介面，讓餐廳管理員能夠將 Gemini AI 產生的 JSON 格式菜單資料快速匯入 Google Sheets 資料庫。系統包含前端輸入介面、資料驗證邏輯和 Google Apps Script 後端 API。

### 主要功能

1. **密碼驗證**：使用簡單的密碼保護匯入工具，防止未授權存取
2. **手動輸入餐廳資訊**：管理員在 web 介面輸入餐廳名稱和菜單圖片網址
3. **JSON 資料輸入**：管理員貼上 Gemini 產生的 JSON 菜單資料
4. **資料驗證**：系統驗證 JSON 格式和必要欄位
5. **資料預覽**：顯示解析後的資料供管理員確認
6. **匯入執行**：將資料寫入 Google Sheets 的設定、餐點和加購工作表
7. **錯誤處理**：提供清楚的錯誤訊息和回復機制

## 架構

### 系統架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                        前端 (React)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  JSON 匯入介面 (ImporterPage)                         │  │
│  │  - 餐廳名稱輸入                                        │  │
│  │  - 菜單圖片網址輸入                                    │  │
│  │  - JSON 文字輸入區域                                   │  │
│  │  - 資料預覽區域                                        │  │
│  │  - 匯入按鈕                                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  驗證邏輯 (validateMenuData)                          │  │
│  │  - JSON 語法驗證                                       │  │
│  │  - 必要欄位驗證                                        │  │
│  │  - 資料類型驗證                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API 服務 (importMenuData)                            │  │
│  │  - 序列化 optionGroups 和 addons                      │  │
│  │  - 發送 POST 請求到 Google Apps Script                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ HTTP POST
┌─────────────────────────────────────────────────────────────┐
│              Google Apps Script (後端 API)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  doPost() - 匯入端點                                   │  │
│  │  - 解析請求資料                                        │  │
│  │  - 驗證資料完整性                                      │  │
│  │  - 檢查餐廳是否已存在                                  │  │
│  │  - 寫入或更新 Google Sheets                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  writeRestaurantData()                                │  │
│  │  - 寫入設定工作表                                      │  │
│  │  - 設定啟用旗標                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  writeMealsData()                                     │  │
│  │  - 刪除舊餐點（如果替換）                              │  │
│  │  - 寫入餐點工作表                                      │  │
│  │  - 產生餐點 ID                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  writeAddonsData()                                    │  │
│  │  - 收集所有加購項目                                    │  │
│  │  - 去除重複項目                                        │  │
│  │  - 寫入加購工作表                                      │  │
│  │  - 產生加購 ID                                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    Google Sheets                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  設定工作表   │  │  餐點工作表   │  │  加購工作表   │     │
│  │  - 餐廳名稱   │  │  - 餐廳名稱   │  │  - 餐廳名稱   │     │
│  │  - 圖片網址   │  │  - 餐點ID    │  │  - 加購ID    │     │
│  │  - 啟用旗標   │  │  - 餐點名稱   │  │  - 加購名稱   │     │
│  └──────────────┘  │  - 價格       │  │  - 價格       │     │
│                     │  - 選項組JSON │  └──────────────┘     │
│                     │  - 加購ID列表 │                       │
│                     └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

### 技術棧

- **前端**：React 19 + TypeScript + Vite
- **樣式**：Tailwind CSS 4
- **後端**：Google Apps Script
- **資料庫**：Google Sheets
- **通訊**：REST API (HTTP POST)

## 元件與介面

### 前端元件

#### 1. PasswordDialog 元件

密碼驗證對話框元件，保護匯入工具不被未授權存取。

```typescript
interface PasswordDialogProps {
  onAuthenticated: () => void;
}

interface PasswordDialogState {
  password: string;
  error: string;
  isValidating: boolean;
}
```

**功能：**
- 顯示密碼輸入欄位
- 驗證輸入的密碼是否與環境變數中的管理員密碼匹配
- 顯示錯誤訊息（密碼錯誤）
- 驗證成功後將狀態儲存到 sessionStorage
- 通知父元件驗證成功

**驗證邏輯：**
- 密碼從環境變數 `VITE_ADMIN_PASSWORD` 讀取
- 驗證成功後在 sessionStorage 中設置 `admin_authenticated` 標記
- 關閉瀏覽器後 sessionStorage 自動清除，需重新驗證

#### 2. ImporterPage 元件

主要的匯入介面元件，包含所有輸入欄位和控制邏輯。

```typescript
interface ImporterPageProps {
  // 無 props，獨立頁面
}

interface ImporterPageState {
  isAuthenticated: boolean;
  restaurantName: string;
  menuImageUrl: string;
  jsonInput: string;
  parsedData: ParsedMenuData | null;
  validationErrors: ValidationError[];
  isImporting: boolean;
  importResult: ImportResult | null;
}
```

**功能：**
- 檢查 sessionStorage 中的驗證狀態
- 未驗證時顯示 PasswordDialog
- 驗證通過後顯示匯入介面
- 提供餐廳名稱和菜單圖片網址的輸入欄位
- 提供 JSON 資料的文字輸入區域
- 即時驗證 JSON 格式
- 顯示解析後的資料預覽
- 執行匯入操作
- 顯示成功或錯誤訊息

#### 3. MenuDataPreview 元件

顯示解析後的菜單資料預覽。

```typescript
interface MenuDataPreviewProps {
  restaurantName: string;
  menuImageUrl: string;
  meals: ParsedMeal[];
}
```

**功能：**
- 以表格或卡片形式顯示餐點資料
- 顯示每個餐點的選項組和加購項目
- 提供視覺化的資料確認

#### 4. ValidationErrorList 元件

顯示驗證錯誤列表。

```typescript
interface ValidationErrorListProps {
  errors: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  path?: string;  // JSON 路徑，例如 "meals[0].name"
}
```

### 環境變數配置

系統需要以下環境變數：

```bash
# Google Apps Script Web App URL
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# 管理員密碼（用於訪問匯入工具）
VITE_ADMIN_PASSWORD=your_secure_password_here
```

**安全考量：**
- 密碼應該設置為強密碼（建議至少 12 個字元，包含大小寫字母、數字和特殊符號）
- 密碼不應該提交到版本控制系統（已在 .gitignore 中排除 .env 檔案）
- 生產環境應該在 Vercel 的環境變數設置中配置密碼
- 這是前端驗證，主要目的是防止學生誤入，不是高安全性的後端驗證

### 後端 API

#### 擴充現有端點：doPost() - 支援匯入菜單資料

現有的 `doPost()` 端點用於處理訂單提交。我們將擴充它以支援菜單匯入操作，透過 `action` 欄位來區分不同的操作類型。

**請求格式（匯入菜單）：**

```typescript
interface ImportMenuRequest {
  action: 'import';  // 新增：區分匯入操作
  data: {
    restaurantName: string;
    menuImageUrl: string;
    meals: MealData[];
  };
}

// 現有的訂單提交請求格式保持不變
interface SubmitOrderRequest {
  order: Order;  // 沒有 action 欄位，向後相容
}

interface MealData {
  name: string;
  price: number;
  imageUrl?: string;
  optionGroups: string[][];  // 將被序列化為 JSON 字串
  addons: AddonData[];       // 將被序列化為 JSON 字串
}

interface AddonData {
  name: string;
  price: number;
}
```

**回應格式：**

```typescript
interface ImportMenuResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    restaurantName: string;
    mealsImported: number;
    addonsImported: number;
  };
}
```

**處理流程：**

1. 檢查請求中是否有 `action` 欄位
2. 如果 `action === 'import'`，執行匯入流程：
   - 解析匯入資料
   - 驗證必要欄位
   - 檢查餐廳是否已存在
   - 如果存在，提示確認替換（前端處理）
   - 寫入設定工作表
   - 寫入餐點工作表
   - 寫入加購工作表
   - 回傳成功訊息
3. 如果沒有 `action` 欄位但有 `order` 欄位，執行現有的訂單提交流程（向後相容）
4. 否則回傳錯誤

## 資料模型

### 前端資料模型

#### ParsedMenuData

```typescript
interface ParsedMenuData {
  restaurantName: string;
  menuImageUrl: string;
  meals: ParsedMeal[];
  totalAddons: number;  // 去重後的加購項目總數
}

interface ParsedMeal {
  name: string;
  price: number;
  imageUrl?: string;
  optionGroups: string[][];
  addons: ParsedAddon[];
}

interface ParsedAddon {
  name: string;
  price: number;
}
```

### Google Sheets 資料模型

#### 設定工作表

| 欄位 | 說明 | 範例 |
|------|------|------|
| A: 餐廳名稱 | 餐廳的名稱 | "美味牛肉麵" |
| B: 菜單圖片網址 | 菜單圖片的 URL | "https://..." |
| C: 啟用 | 是否啟用此餐廳 | TRUE |

#### 餐點工作表

| 欄位 | 說明 | 範例 |
|------|------|------|
| A: 餐廳名稱 | 所屬餐廳 | "美味牛肉麵" |
| B: 餐點ID | 唯一識別碼 | "meal_001" |
| C: 餐點名稱 | 餐點名稱 | "招牌牛肉麵（小）" |
| D: 餐點價格 | 價格（數字） | 145 |
| E: 選項組 | JSON 字串 | `[["不辣","小辣"],["細麵","粗麵"]]` |
| F: 加購項目ID | 逗號分隔的ID列表 | "addon_001,addon_002" |

#### 加購工作表

| 欄位 | 說明 | 範例 |
|------|------|------|
| A: 餐廳名稱 | 所屬餐廳 | "美味牛肉麵" |
| B: 加購ID | 唯一識別碼 | "addon_001" |
| C: 加購名稱 | 加購項目名稱 | "加麵" |
| D: 加購價格 | 價格（數字） | 10 |

### ID 生成規則

- **餐點 ID**：`meal_` + 餐廳名稱前3字 + `_` + 流水號（3位數）
  - 範例：`meal_美味牛_001`
- **加購 ID**：`addon_` + 餐廳名稱前3字 + `_` + 流水號（3位數）
  - 範例：`addon_美味牛_001`

## 正確性屬性

*屬性是一個特徵或行為，應該在系統的所有有效執行中保持為真——本質上是關於系統應該做什麼的正式陳述。屬性作為人類可讀規範和機器可驗證正確性保證之間的橋樑。*

### 屬性 1：JSON 解析的正確性
*對於任意*有效的 JSON 菜單資料，解析函數應該正確提取所有餐點的名稱、價格、選項組和加購項目
**驗證需求：1.2**

### 屬性 2：optionGroups 序列化的 round-trip 一致性
*對於任意*optionGroups 巢狀陣列，序列化為 JSON 字串後再反序列化，應該得到與原始值相等的結構
**驗證需求：1.3, 6.2, 6.4**

### 屬性 3：addons 序列化的 round-trip 一致性
*對於任意*addons 物件陣列，序列化為 JSON 字串後再反序列化，應該得到與原始值相等的結構
**驗證需求：1.4, 7.2, 7.4**

### 屬性 4：無效 JSON 的驗證失敗
*對於任意*無效的 JSON 字串，驗證函數應該返回失敗結果
**驗證需求：2.1**

### 屬性 5：缺少必要欄位的錯誤訊息
*對於任意*缺少必要欄位的 JSON 物件，驗證函數應該返回包含該欄位名稱的錯誤訊息
**驗證需求：2.2**

### 屬性 6：無效資料類型的錯誤訊息
*對於任意*包含錯誤資料類型的欄位，驗證函數應該返回包含預期類型的錯誤訊息
**驗證需求：2.3**

### 屬性 7：餐廳資料寫入的完整性
*對於任意*有效的匯入請求，設定工作表應該包含餐廳名稱、圖片網址，且啟用旗標為 true
**驗證需求：3.1, 3.2, 3.3**

### 屬性 8：餐點資料寫入的完整性
*對於任意*餐點陣列，每個餐點都應該在餐點工作表中有對應的列，且包含名稱、價格、optionGroups JSON 和 addons ID 列表
**驗證需求：3.4**

### 屬性 9：餐廳替換的資料清理
*對於任意*已存在的餐廳，執行替換操作後，該餐廳的舊餐點資料應該被完全移除
**驗證需求：4.2**

### 屬性 10：餐廳替換的資料隔離
*對於任意*餐廳的替換操作，其他餐廳的資料應該保持不變
**驗證需求：4.3**

### 屬性 11：替換後的資料完整性
*對於任意*替換操作，新的餐廳和餐點資料應該正確寫入，且數量與輸入一致
**驗證需求：4.4**

### 屬性 12：JSON 語法錯誤的位置資訊
*對於任意*無效的 JSON 字串，錯誤訊息應該包含語法錯誤的位置資訊（行號或字元位置）
**驗證需求：5.3**

### 屬性 13：欄位驗證錯誤的路徑資訊
*對於任意*欄位驗證錯誤，錯誤訊息應該包含該欄位的 JSON 路徑（例如 "meals[0].name"）
**驗證需求：5.4**

### 屬性 14：optionGroups 類型驗證
*對於任意*非字串陣列的陣列的 optionGroups 值，驗證應該失敗並返回類型錯誤
**驗證需求：6.1**

### 屬性 15：addons 必要欄位驗證
*對於任意*缺少 name 或 price 欄位的 addon 物件，驗證應該失敗並返回缺少欄位的錯誤
**驗證需求：7.1**

### 屬性 16：密碼驗證的正確性
*對於任意*輸入的密碼，當密碼與環境變數中的管理員密碼匹配時應該允許存取，不匹配時應該拒絕存取
**驗證需求：8.2, 8.3**

### 屬性 17：驗證狀態的會話持久性
*對於任意*已驗證的會話，在瀏覽器未關閉的情況下，驗證狀態應該保持有效
**驗證需求：8.4**

## 錯誤處理

### 錯誤類型

#### 1. 驗證錯誤（Validation Errors）

**JSON 語法錯誤：**
- 錯誤訊息：「JSON 格式錯誤：{具體錯誤}」
- 顯示位置：輸入區域下方
- 處理方式：阻止解析和匯入

**缺少必要欄位：**
- 錯誤訊息：「缺少必要欄位：{欄位路徑}」
- 範例：「缺少必要欄位：meals[0].name」
- 處理方式：列出所有缺少的欄位，阻止匯入

**資料類型錯誤：**
- 錯誤訊息：「欄位 {欄位路徑} 的類型錯誤，預期 {預期類型}，實際 {實際類型}」
- 範例：「欄位 meals[0].price 的類型錯誤，預期 number，實際 string」
- 處理方式：列出所有類型錯誤，阻止匯入

#### 2. API 錯誤（API Errors）

**網路錯誤：**
- 錯誤訊息：「網路連線失敗，請檢查網路連線後重試」
- 處理方式：顯示重試按鈕

**Google Sheets API 錯誤：**
- 錯誤訊息：「Google Sheets 錯誤：{API 錯誤訊息}」
- 處理方式：顯示具體錯誤，提供聯絡管理員的建議

**權限錯誤：**
- 錯誤訊息：「權限不足，請聯絡系統管理員」
- 處理方式：阻止操作，顯示聯絡資訊

#### 3. 資料衝突錯誤（Conflict Errors）

**餐廳已存在：**
- 錯誤訊息：「餐廳「{餐廳名稱}」已存在，是否要替換現有資料？」
- 處理方式：顯示確認對話框，提供「取消」和「替換」選項

#### 4. 驗證錯誤（Authentication Errors）

**密碼錯誤：**
- 錯誤訊息：「密碼錯誤，請重試」
- 處理方式：清空密碼輸入欄位，允許重新輸入

**未驗證存取：**
- 處理方式：顯示密碼對話框，阻止存取匯入介面
- 處理方式：顯示確認對話框，提供「取消」和「替換」選項

### 錯誤回復機制

#### 交易式操作

匯入操作應該是交易式的，確保資料一致性：

1. **開始交易**：記錄當前狀態
2. **執行操作**：
   - 寫入設定工作表
   - 寫入餐點工作表
   - 寫入加購工作表
3. **提交或回復**：
   - 如果所有操作成功：提交變更
   - 如果任何操作失敗：回復到原始狀態

#### 回復策略

由於 Google Sheets API 不支援原生交易，我們採用以下策略：

1. **備份現有資料**：在修改前讀取並儲存現有資料
2. **執行操作**：嘗試寫入新資料
3. **驗證結果**：檢查寫入是否成功
4. **失敗回復**：如果失敗，使用備份資料還原

**實作方式：**
```javascript
function importMenuDataWithRollback(data) {
  // 1. 備份現有資料
  const backup = backupRestaurantData(data.restaurantName);
  
  try {
    // 2. 執行匯入操作
    writeRestaurantData(data);
    writeMealsData(data);
    writeAddonsData(data);
    
    // 3. 驗證結果
    if (!verifyImportSuccess(data)) {
      throw new Error('資料驗證失敗');
    }
    
    return { success: true };
  } catch (error) {
    // 4. 回復資料
    if (backup) {
      restoreFromBackup(backup);
    }
    throw error;
  }
}
```

## 測試策略

### 單元測試

#### 前端驗證邏輯

**測試檔案：** `src/utils/menuDataValidator.test.ts`

測試項目：
- JSON 語法驗證
- 必要欄位驗證
- 資料類型驗證
- 錯誤訊息格式
- 邊界情況（空陣列、null 值等）

#### 序列化/反序列化邏輯

**測試檔案：** `src/utils/menuDataSerializer.test.ts`

測試項目：
- optionGroups 序列化
- addons 序列化
- round-trip 一致性
- 特殊字元處理
- 空值處理

### 屬性基礎測試

使用 fast-check 進行屬性基礎測試，驗證通用規則。

**測試檔案：** `src/utils/menuDataValidator.property.test.ts`

測試屬性：
- 屬性 2：optionGroups round-trip 一致性
- 屬性 3：addons round-trip 一致性
- 屬性 4：無效 JSON 驗證失敗
- 屬性 5：缺少欄位的錯誤訊息
- 屬性 6：類型錯誤的錯誤訊息

**測試配置：**
- 每個屬性執行 100 次隨機測試
- 使用 fast-check 的 arbitrary 生成器產生測試資料

### 整合測試

#### Google Apps Script 測試

**測試檔案：** `google-apps-script/ImporterTests.gs`

測試項目：
- 完整的匯入流程
- 餐廳替換流程
- 錯誤處理
- 資料回復機制

**測試方式：**
- 使用測試用的 Google Sheets
- 模擬各種輸入情況
- 驗證工作表內容

#### 端對端測試

**測試工具：** Vitest + jsdom

測試項目：
- 完整的使用者流程
- UI 互動
- API 呼叫
- 錯誤顯示

### 測試資料生成器

使用 fast-check 建立測試資料生成器：

```typescript
// 生成隨機餐點資料
const mealArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  price: fc.integer({ min: 0, max: 500 }),
  imageUrl: fc.option(fc.webUrl()),
  optionGroups: fc.array(
    fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
    { maxLength: 5 }
  ),
  addons: fc.array(
    fc.record({
      name: fc.string({ minLength: 1, maxLength: 30 }),
      price: fc.integer({ min: 0, max: 100 })
    }),
    { maxLength: 10 }
  )
});

// 生成隨機菜單資料
const menuDataArbitrary = fc.record({
  restaurantName: fc.string({ minLength: 1, maxLength: 50 }),
  menuImageUrl: fc.option(fc.webUrl()),
  meals: fc.array(mealArbitrary, { minLength: 1, maxLength: 20 })
});
```

## 實作細節

### 前端實作

#### 驗證流程

```typescript
// 驗證函數
function validateMenuData(jsonString: string): ValidationResult {
  // 1. 驗證 JSON 語法
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (error) {
    return {
      isValid: false,
      errors: [{
        field: 'json',
        message: `JSON 格式錯誤：${error.message}`
      }]
    };
  }
  
  // 2. 驗證必要欄位和資料類型
  const errors: ValidationError[] = [];
  
  // 檢查 meals 陣列
  if (!Array.isArray(data.meals)) {
    errors.push({
      field: 'meals',
      message: '缺少必要欄位：meals（應為陣列）'
    });
    return { isValid: false, errors };
  }
  
  // 檢查每個餐點
  data.meals.forEach((meal, index) => {
    const path = `meals[${index}]`;
    
    // 檢查 name
    if (!meal.name || typeof meal.name !== 'string') {
      errors.push({
        field: `${path}.name`,
        message: `${path}.name 缺少或類型錯誤（應為字串）`
      });
    }
    
    // 檢查 price
    if (typeof meal.price !== 'number') {
      errors.push({
        field: `${path}.price`,
        message: `${path}.price 缺少或類型錯誤（應為數字）`
      });
    }
    
    // 檢查 optionGroups
    if (!Array.isArray(meal.optionGroups)) {
      errors.push({
        field: `${path}.optionGroups`,
        message: `${path}.optionGroups 應為陣列`
      });
    } else {
      // 檢查每個選項組是否為字串陣列
      meal.optionGroups.forEach((group, groupIndex) => {
        if (!Array.isArray(group)) {
          errors.push({
            field: `${path}.optionGroups[${groupIndex}]`,
            message: `${path}.optionGroups[${groupIndex}] 應為字串陣列`
          });
        } else {
          group.forEach((option, optionIndex) => {
            if (typeof option !== 'string') {
              errors.push({
                field: `${path}.optionGroups[${groupIndex}][${optionIndex}]`,
                message: `${path}.optionGroups[${groupIndex}][${optionIndex}] 應為字串`
              });
            }
          });
        }
      });
    }
    
    // 檢查 addons
    if (!Array.isArray(meal.addons)) {
      errors.push({
        field: `${path}.addons`,
        message: `${path}.addons 應為陣列`
      });
    } else {
      meal.addons.forEach((addon, addonIndex) => {
        const addonPath = `${path}.addons[${addonIndex}]`;
        
        if (!addon.name || typeof addon.name !== 'string') {
          errors.push({
            field: `${addonPath}.name`,
            message: `${addonPath}.name 缺少或類型錯誤（應為字串）`
          });
        }
        
        if (typeof addon.price !== 'number') {
          errors.push({
            field: `${addonPath}.price`,
            message: `${addonPath}.price 缺少或類型錯誤（應為數字）`
          });
        }
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

#### 序列化函數

```typescript
// 序列化 optionGroups
function serializeOptionGroups(optionGroups: string[][]): string {
  return JSON.stringify(optionGroups);
}

// 反序列化 optionGroups
function deserializeOptionGroups(jsonString: string): string[][] {
  return JSON.parse(jsonString);
}

// 序列化 addons（用於 Google Sheets 儲存）
function serializeAddons(addons: AddonData[]): string {
  return JSON.stringify(addons);
}

// 反序列化 addons
function deserializeAddons(jsonString: string): AddonData[] {
  return JSON.parse(jsonString);
}
```

### 後端實作（Google Apps Script）

#### 匯入端點

```javascript
function doPost(e) {
  try {
    // 解析請求
    const requestData = JSON.parse(e.postData.contents);
    
    // 檢查是否為匯入操作（新功能）
    if (requestData.action === 'import') {
      return handleImportMenu(requestData.data);
    }
    
    // 檢查是否為訂單提交（現有功能，向後相容）
    if (requestData.order) {
      return handleSubmitOrder(requestData.order);
    }
    
    throw new Error('未知的操作類型');
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 現有的訂單提交處理函數（保持不變）
function handleSubmitOrder(order) {
  // ... 現有的訂單提交邏輯 ...
}

function handleImportMenu(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 驗證資料
  if (!data.restaurantName || !data.meals || !Array.isArray(data.meals)) {
    throw new Error('資料格式錯誤');
  }
  
  // 檢查餐廳是否已存在
  const configSheet = ss.getSheetByName('設定');
  const existingRestaurant = findRestaurant(configSheet, data.restaurantName);
  
  // 備份現有資料（如果存在）
  let backup = null;
  if (existingRestaurant) {
    backup = backupRestaurantData(ss, data.restaurantName);
  }
  
  try {
    // 如果餐廳已存在，先刪除舊資料
    if (existingRestaurant) {
      deleteRestaurantData(ss, data.restaurantName);
    }
    
    // 寫入新資料
    writeRestaurantConfig(configSheet, data.restaurantName, data.menuImageUrl);
    const mealIds = writeMealsData(ss, data.restaurantName, data.meals);
    const addonIds = writeAddonsData(ss, data.restaurantName, data.meals);
    
    // 更新餐點的加購 ID 列表
    updateMealAddonIds(ss, data.restaurantName, mealIds, addonIds);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: '匯入成功',
        data: {
          restaurantName: data.restaurantName,
          mealsImported: mealIds.length,
          addonsImported: addonIds.length
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // 回復資料
    if (backup) {
      restoreFromBackup(ss, backup);
    }
    throw error;
  }
}
```

#### 資料寫入函數

```javascript
function writeRestaurantConfig(configSheet, restaurantName, menuImageUrl) {
  // 檢查是否已存在
  const data = configSheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === restaurantName) {
      rowIndex = i + 1;  // Sheets 的行號從 1 開始
      break;
    }
  }
  
  // 準備資料
  const rowData = [restaurantName, menuImageUrl || '', true];
  
  if (rowIndex > 0) {
    // 更新現有列
    configSheet.getRange(rowIndex, 1, 1, 3).setValues([rowData]);
  } else {
    // 新增列
    configSheet.appendRow(rowData);
  }
}

function writeMealsData(ss, restaurantName, meals) {
  const mealsSheet = ss.getSheetByName('餐點');
  const mealIds = [];
  
  // 產生餐點 ID
  const prefix = restaurantName.substring(0, 3);
  
  meals.forEach((meal, index) => {
    const mealId = `meal_${prefix}_${String(index + 1).padStart(3, '0')}`;
    mealIds.push(mealId);
    
    // 序列化 optionGroups
    const optionGroupsJson = JSON.stringify(meal.optionGroups);
    
    // 暫時留空加購 ID，稍後更新
    const rowData = [
      restaurantName,
      mealId,
      meal.name,
      meal.price,
      optionGroupsJson,
      ''  // 加購 ID 列表，稍後更新
    ];
    
    mealsSheet.appendRow(rowData);
  });
  
  return mealIds;
}

function writeAddonsData(ss, restaurantName, meals) {
  const addonsSheet = ss.getSheetByName('加購');
  const addonMap = new Map();  // 用於去重
  const addonIds = [];
  
  // 收集所有加購項目並去重
  meals.forEach(meal => {
    meal.addons.forEach(addon => {
      const key = `${addon.name}_${addon.price}`;
      if (!addonMap.has(key)) {
        addonMap.set(key, addon);
      }
    });
  });
  
  // 產生加購 ID 並寫入
  const prefix = restaurantName.substring(0, 3);
  let index = 1;
  
  addonMap.forEach(addon => {
    const addonId = `addon_${prefix}_${String(index).padStart(3, '0')}`;
    addonIds.push(addonId);
    
    const rowData = [
      restaurantName,
      addonId,
      addon.name,
      addon.price
    ];
    
    addonsSheet.appendRow(rowData);
    index++;
  });
  
  return addonIds;
}

function updateMealAddonIds(ss, restaurantName, mealIds, addonIds) {
  // 這個函數需要根據餐點的 addons 來更新餐點工作表的加購 ID 列表
  // 實作細節取決於如何對應餐點和加購項目
}
```

## 部署與維護

### 部署步驟

1. **前端部署**：
   - 建立新的 React 元件和路由
   - 整合到現有應用程式
   - 部署到 Vercel

2. **後端部署**：
   - 更新 Google Apps Script 程式碼
   - 測試新的 API 端點
   - 發布新版本

3. **測試**：
   - 在測試環境執行完整測試
   - 驗證資料完整性
   - 測試錯誤處理

### 維護考量

- **版本控制**：使用 Git 管理程式碼版本
- **備份**：定期備份 Google Sheets 資料
- **監控**：記錄匯入操作和錯誤
- **文件**：維護使用者手冊和 API 文件
