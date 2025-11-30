# 需求文件

## 簡介

此功能讓餐廳管理員能夠將 Gemini AI 產生的 JSON 格式菜單資料直接匯入 Google Sheets。系統會解析包含餐廳資訊、餐點項目、選項組和加購項目的 JSON 結構，然後填入 Google Sheets 資料庫的對應欄位。

## 術語表

- **JSON 匯入器**：解析 JSON 菜單資料並寫入 Google Sheets 的系統元件
- **菜單 JSON**：Gemini AI 產生的結構化 JSON 輸出，包含餐廳和餐點資訊
- **Google Sheets 資料庫**：儲存餐廳設定和餐點項目的後端試算表
- **餐廳設定**：餐廳的中繼資料，包括名稱、圖片網址和啟用狀態
- **餐點項目**：包含名稱、價格、圖片、選項組和加購項目的菜單條目
- **選項組**：餐點的互斥選項集合（例如：辣度、麵條類型）
- **加購項目**：可以額外加入餐點的選項，需額外付費

## JSON 格式規範

系統預期的 JSON 格式如下（僅包含餐點資料，餐廳名稱和菜單圖片網址將在 web 介面中手動輸入）：

```json
{
  "meals": [
    {
      "name": "餐點名稱",
      "price": 100,
      "imageUrl": "https://example.com/meal.jpg",
      "optionGroups": [
        ["選項1-1", "選項1-2", "選項1-3"],
        ["選項2-1", "選項2-2"]
      ],
      "addons": [
        {
          "name": "加購項目名稱",
          "price": 10
        }
      ]
    }
  ]
}
```

### 欄位說明

**手動輸入欄位（在 web 介面中填寫）：**
- 餐廳名稱 (必填, string): 餐廳名稱
- 菜單圖片網址 (選填, string): 菜單圖片網址

**JSON 資料欄位：**
- `meals` (必填, array): 餐點項目陣列
  - `name` (必填, string): 餐點名稱
  - `price` (必填, number): 餐點價格
  - `imageUrl` (選填, string): 餐點圖片網址
  - `optionGroups` (必填, array): 選項組陣列，每個選項組是一個字串陣列
  - `addons` (必填, array): 加購項目陣列
    - `name` (必填, string): 加購項目名稱
    - `price` (必填, number): 加購項目價格

### 範例

**手動輸入：**
- 餐廳名稱：`美味牛肉麵`
- 菜單圖片網址：`https://example.com/menu.jpg`

**JSON 資料：**
```json
{
  "meals": [
    {
      "name": "招牌牛肉麵（小）",
      "price": 145,
      "optionGroups": [
        ["不辣", "小辣", "中辣"],
        ["細麵", "粗麵"]
      ],
      "addons": [
        {
          "name": "加麵",
          "price": 10
        },
        {
          "name": "滷蛋",
          "price": 15
        }
      ]
    },
    {
      "name": "招牌牛肉麵（大）",
      "price": 195,
      "optionGroups": [
        ["不辣", "小辣", "中辣"],
        ["細麵", "粗麵"]
      ],
      "addons": [
        {
          "name": "加麵",
          "price": 10
        },
        {
          "name": "滷蛋",
          "price": 15
        }
      ]
    }
  ]
}
```

## 需求

### 需求 1

**使用者故事：** 身為餐廳管理員，我想要將 JSON 菜單資料貼入介面並手動輸入餐廳資訊，以便快速填入 Google Sheets 資料庫而無需手動輸入每個餐點。

#### 驗收標準

1. WHEN 管理員存取匯入介面 THEN 系統 SHALL 顯示餐廳名稱輸入欄位、菜單圖片網址輸入欄位和 JSON 資料文字輸入區域
2. WHEN 管理員貼上有效的 JSON 資料 THEN 系統 SHALL 解析餐點項目（包含名稱、價格、選項組和加購項目）
3. WHEN JSON 包含巢狀陣列形式的 optionGroups THEN 系統 SHALL 將其序列化為 JSON 字串以供儲存
4. WHEN JSON 包含陣列形式的 addons THEN 系統 SHALL 將其序列化為 JSON 字串以供儲存
5. WHEN 解析成功完成 THEN 系統 SHALL 在匯入前顯示已解析資料的預覽，包含手動輸入的餐廳資訊和解析的餐點項目

### 需求 2

**使用者故事：** 身為餐廳管理員，我想要系統驗證 JSON 結構，以便在匯入 Google Sheets 前識別並修正錯誤。

#### 驗收標準

1. WHEN 管理員提交 JSON 資料 THEN 系統 SHALL 驗證 JSON 語法是否正確
2. WHEN JSON 缺少必要欄位 THEN 系統 SHALL 顯示具體的錯誤訊息，指出缺少哪些欄位
3. WHEN JSON 包含無效的資料類型 THEN 系統 SHALL 顯示錯誤訊息，指出預期的類型
4. IF 驗證失敗 THEN 系統 SHALL 阻止匯入操作並維持目前的工作表狀態
5. WHEN 驗證成功 THEN 系統 SHALL 啟用匯入按鈕

### 需求 3

**使用者故事：** 身為餐廳管理員，我想要系統將已解析的資料寫入 Google Sheets，以便菜單立即在訂餐系統中可用。

#### 驗收標準

1. WHEN 管理員確認匯入 THEN 系統 SHALL 將餐廳名稱寫入設定工作表
2. WHEN 寫入餐廳資料 THEN 系統 SHALL 將圖片網址寫入設定工作表
3. WHEN 寫入餐廳資料 THEN 系統 SHALL 在設定工作表中將啟用旗標設為 true
4. WHEN 寫入餐點項目 THEN 系統 SHALL 將每個餐點的名稱、價格、圖片、optionGroups JSON 和 addons JSON 寫入個別的列
5. WHEN 匯入完成 THEN 系統 SHALL 顯示成功訊息，包含已匯入項目的數量

### 需求 4

**使用者故事：** 身為餐廳管理員，我想要替換現有的餐廳資料，以便更新菜單而無需手動刪除舊條目。

#### 驗收標準

1. WHEN 匯入已存在的餐廳 THEN 系統 SHALL 提示管理員確認替換
2. WHEN 管理員確認替換 THEN 系統 SHALL 刪除該餐廳的所有現有餐點項目
3. WHEN 刪除現有資料 THEN 系統 SHALL 保留工作表中其他餐廳的資料
4. WHEN 替換完成 THEN 系統 SHALL 寫入新的餐廳和餐點資料
5. WHILE 替換資料 THEN 系統 SHALL 在整個操作過程中維持資料完整性

### 需求 5

**使用者故事：** 身為餐廳管理員，我想要在匯入失敗時看到清楚的錯誤訊息，以便快速排除問題並解決。

#### 驗收標準

1. WHEN 發生 Google Sheets API 錯誤 THEN 系統 SHALL 顯示來自 API 的具體錯誤訊息
2. WHEN 網路連線失敗 THEN 系統 SHALL 顯示網路錯誤訊息，包含重試指示
3. WHEN JSON 解析失敗 THEN 系統 SHALL 顯示語法錯誤的行號和字元位置
4. WHEN 欄位驗證失敗 THEN 系統 SHALL 標示出有驗證錯誤的特定欄位
5. IF 匯入過程中發生任何錯誤 THEN 系統 SHALL 回復部分變更以維持工作表一致性

### 需求 6

**使用者故事：** 身為開發者，我想要匯入器正確處理 optionGroups 資料結構，以便前端能夠動態渲染選項組。

#### 驗收標準

1. WHEN 解析 optionGroups THEN 系統 SHALL 驗證它是字串陣列的陣列
2. WHEN 序列化 optionGroups THEN 系統 SHALL 將巢狀陣列結構轉換為 JSON 字串
3. WHEN 寫入 Google Sheets THEN 系統 SHALL 將 optionGroups JSON 字串儲存在指定的欄位
4. WHEN 前端讀取資料 THEN 系統 SHALL 將 JSON 字串解析回巢狀陣列結構
5. WHERE optionGroups 為空 THEN 系統 SHALL 儲存空陣列 JSON 字串 "[]"

### 需求 7

**使用者故事：** 身為開發者，我想要匯入器正確處理 addons 資料結構，以便前端能夠顯示加購選項及價格。

#### 驗收標準

1. WHEN 解析 addons THEN 系統 SHALL 驗證每個 addon 都有 name 和 price 欄位
2. WHEN 序列化 addons THEN 系統 SHALL 將 addon 物件陣列轉換為 JSON 字串
3. WHEN 寫入 Google Sheets THEN 系統 SHALL 將 addons JSON 字串儲存在指定的欄位
4. WHEN 前端讀取資料 THEN 系統 SHALL 將 JSON 字串解析回 addon 物件陣列
5. WHERE addons 為空 THEN 系統 SHALL 儲存空陣列 JSON 字串 "[]"

### 需求 8

**使用者故事：** 身為系統管理員，我想要匯入工具受到密碼保護，以便防止未授權的使用者（如學生）存取管理功能。

#### 驗收標準

1. WHEN 使用者存取匯入頁面 THEN 系統 SHALL 顯示密碼驗證對話框
2. WHEN 使用者輸入正確的管理員密碼 THEN 系統 SHALL 允許存取匯入介面
3. WHEN 使用者輸入錯誤的密碼 THEN 系統 SHALL 顯示錯誤訊息並阻止存取
4. WHEN 使用者通過驗證 THEN 系統 SHALL 在當前瀏覽器會話中記住驗證狀態
5. WHEN 使用者關閉瀏覽器 THEN 系統 SHALL 清除驗證狀態，下次存取需重新驗證
