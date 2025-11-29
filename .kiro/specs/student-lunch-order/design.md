# 設計文件

## 概述

安親班學生訂便當系統是一個基於網頁的前端應用程式，使用 Google Sheets API 作為資料來源和儲存後端。系統採用簡潔的單頁應用程式 (SPA) 架構，讓學生能夠快速瀏覽菜單、選擇餐點、客製化選項，並提交訂單。老師可以直接在 Google Sheet 中管理所有設定，無需額外的後台管理系統。

### 技術選型

- **前端框架**: React 18+ with TypeScript
- **狀態管理**: React Hooks (useState, useEffect)
- **UI 框架**: Tailwind CSS（響應式設計）
- **API 整合**: Google Apps Script Web App（作為代理層，無需直接使用 Google Sheets API）
- **開發環境**: Vite（本地開發和測試）

### 設計原則

1. **簡單易用**: 介面直觀，適合小學生操作
2. **無需後台**: 所有設定透過 Google Sheet 管理
3. **即時回饋**: 選擇和金額計算即時更新
4. **錯誤處理**: 清楚的錯誤訊息和重試機制
5. **響應式設計**: 支援手機、平板和桌面裝置

## React 基礎教學

### 什麼是 React？

React 是 Facebook 開發的 JavaScript 函式庫，用來建立使用者介面。想像它是一個幫你組裝網頁的工具箱。

**為什麼使用 React？**
- ✅ 元件化：把網頁拆成小積木，每個積木獨立管理
- ✅ 狀態管理：當資料改變時，畫面自動更新
- ✅ 生態系統：有很多現成的工具和套件可以用
- ✅ 就業市場：React 是目前最熱門的前端框架之一

### React 核心概念（用這個專案學習）

#### 1. 元件 (Component)

元件就像樂高積木，每個元件負責一小塊功能。

```typescript
// 這是一個簡單的元件
function MealItem({ meal, onSelect }) {
  return (
    <div onClick={() => onSelect(meal)}>
      <h3>{meal.name}</h3>
      <p>NT$ {meal.price}</p>
    </div>
  );
}
```

**在我們的專案中：**
- `MealItem` = 一個餐點項目
- `MenuDisplay` = 菜單圖片顯示
- `TotalAmount` = 總金額顯示

#### 2. 狀態 (State)

狀態是元件記住的資料。當狀態改變，畫面會自動更新。

```typescript
// useState 是 React 提供的工具
const [selectedMeal, setSelectedMeal] = useState(null);

// 當學生選擇餐點時
function handleSelectMeal(meal) {
  setSelectedMeal(meal); // 更新狀態
  // React 會自動重新渲染畫面
}
```

**在我們的專案中：**
- `selectedMeal` = 目前選擇的餐點
- `selectedAddons` = 目前選擇的加購項目
- `totalAmount` = 目前的總金額

#### 3. Props（屬性）

Props 是父元件傳給子元件的資料，就像函數的參數。

```typescript
// 父元件傳遞資料給子元件
<MealItem 
  meal={mealData}           // 傳遞餐點資料
  onSelect={handleSelect}   // 傳遞選擇函數
/>

// 子元件接收 props
function MealItem({ meal, onSelect }) {
  // 使用 meal 和 onSelect
}
```

#### 4. 副作用 (useEffect)

當元件載入或資料改變時，執行某些動作（例如：從 API 讀取資料）。

```typescript
useEffect(() => {
  // 元件載入時，從 Google Apps Script 讀取設定
  fetchConfiguration();
}, []); // [] 表示只在元件載入時執行一次
```

### 開發環境設定

#### 需要安裝的工具

1. **Node.js**（JavaScript 執行環境）
   - 下載：https://nodejs.org/
   - 選擇 LTS 版本（長期支援版）
   - 安裝後，在終端機輸入 `node -v` 確認安裝成功

2. **程式碼編輯器**
   - 推薦：Visual Studio Code (VS Code)
   - 下載：https://code.visualstudio.com/

#### 建立 React 專案

```bash
# 使用 Vite 建立 React + TypeScript 專案
npm create vite@latest lunch-order-system -- --template react-ts

# 進入專案資料夾
cd lunch-order-system

# 安裝依賴套件
npm install

# 安裝 Tailwind CSS（美化樣式用）
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 啟動開發伺服器
npm run dev
```

執行後，瀏覽器開啟 `http://localhost:5173` 就能看到你的應用程式了！

### TypeScript 是什麼？

TypeScript 是 JavaScript 的超集合，加入了「型別」的概念。

**為什麼使用 TypeScript？**
- ✅ 寫程式時會提示錯誤
- ✅ 編輯器會自動補全程式碼
- ✅ 程式碼更容易理解和維護

**範例：**

```typescript
// JavaScript（沒有型別）
function calculateTotal(meal, addons) {
  return meal.price + addons.reduce((sum, a) => sum + a.price, 0);
}

// TypeScript（有型別）
function calculateTotal(meal: MealItem, addons: AddonItem[]): number {
  return meal.price + addons.reduce((sum, a) => sum + a.price, 0);
}
// 編輯器會檢查：meal 必須有 price 屬性，addons 必須是陣列
```

不用擔心，實作時我會提供完整的程式碼和註解！

## 架構

### 系統架構圖

```
┌─────────────────────────────────────────────────────────┐
│                     學生前端應用程式                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  菜單顯示     │  │  餐點選擇     │  │  訂單提交     │  │
│  │  元件        │  │  元件        │  │  元件        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│           │                │                │            │
│           └────────────────┴────────────────┘            │
│                          │                               │
│                  ┌───────▼────────┐                      │
│                  │  狀態管理層     │                      │
│                  │  (React Hooks) │                      │
│                  └───────┬────────┘                      │
│                          │                               │
│                  ┌───────▼────────┐                      │
│                  │  API 服務層    │                      │
│                  └───────┬────────┘                      │
└──────────────────────────┼──────────────────────────────┘
                           │
                           │ HTTPS
                           │
                  ┌────────▼─────────┐
                  │ Google Apps      │
                  │ Script Web App   │
                  │ (代理層)         │
                  └────────┬─────────┘
                           │
                           │ Google Sheets API
                           │
                  ┌────────▼─────────┐
                  │  Google Sheet    │
                  │                  │
                  │ ┌──────────────┐ │
                  │ │ 設定工作表    │ │
                  │ └──────────────┘ │
                  │ ┌──────────────┐ │
                  │ │ 訂單工作表    │ │
                  │ └──────────────┘ │
                  └──────────────────┘
```

### 資料流程

1. **載入階段**:
   - 前端應用程式啟動
   - 呼叫 Google Apps Script API 讀取設定工作表
   - 解析並顯示菜單圖片和餐點選項

2. **選擇階段**:
   - 學生選擇餐點、備註、加購項目
   - 前端即時計算總金額
   - 所有狀態保存在 React state 中

3. **提交階段**:
   - 驗證必填欄位
   - 呼叫 Google Apps Script API 寫入訂單工作表
   - 顯示成功/失敗訊息
   - 重置表單

## 元件和介面

### 前端元件結構

```
App
├── MenuDisplay (菜單顯示元件)
│   └── 顯示菜單圖片
├── MealSelector (餐點選擇元件)
│   └── MealItem (餐點項目)
├── OptionsSelector (備註選擇元件)
│   └── OptionCheckbox (備註選項)
├── AddonsSelector (加購選擇元件)
│   └── AddonCheckbox (加購項目)
├── StudentNameInput (姓名輸入元件)
├── TotalAmount (總金額顯示元件)
├── SubmitButton (提交按鈕元件)
└── Notification (通知訊息元件)
```

### 核心介面定義

#### 餐點介面
```typescript
interface MealItem {
  id: string;
  name: string;
  price: number;
  options: string[];      // 可用的備註選項
  addons: AddonItem[];    // 可用的加購項目
}
```

#### 加購項目介面
```typescript
interface AddonItem {
  id: string;
  name: string;
  price: number;
}
```

#### 訂單介面
```typescript
interface Order {
  restaurantName: string;
  studentName: string;
  mealId: string;
  mealName: string;
  mealPrice: number;
  selectedOptions: string[];
  selectedAddons: AddonItem[];
  totalAmount: number;
  timestamp: string;
}
```

#### 設定資料介面
```typescript
interface Configuration {
  restaurantName: string;
  menuImageUrl: string;
  meals: MealItem[];
}
```

### API 服務介面

#### Google Apps Script API 端點

```typescript
// GET /api/config - 讀取設定
interface GetConfigResponse {
  success: boolean;
  data?: Configuration;
  error?: string;
}

// POST /api/order - 提交訂單
interface SubmitOrderRequest {
  order: Order;
}

interface SubmitOrderResponse {
  success: boolean;
  message: string;
  error?: string;
}
```

## 資料模型

### Google Sheet 結構

系統使用單一 Google Sheet，透過餐廳名稱欄位來區分不同餐廳。老師只需要在設定工作表中指定今日使用的餐廳名稱，系統會自動篩選對應的餐點和加購項目。

#### 設定工作表 (Sheet: "設定")

| 欄位名稱 | 說明 | 範例 |
|---------|------|------|
| 今日餐廳 | 當日使用的餐廳名稱 | 美味麵館 |
| 菜單圖片網址 | 當日菜單圖片的 URL | https://example.com/menu.jpg |

**操作說明：** 老師每天只需要更新這兩個欄位即可切換餐廳

#### 餐點工作表 (Sheet: "餐點")

| 餐廳名稱 | 餐點ID | 餐點名稱 | 餐點價格 | 備註選項 | 加購項目ID |
|---------|--------|---------|---------|---------|-----------|
| 美味麵館 | meal_001 | 紅燒牛肉麵 | 80 | 加辣,粗麵,細麵 | addon_001,addon_002 |
| 美味麵館 | meal_002 | 炸醬麵 | 70 | 加辣,粗麵,細麵 | addon_001,addon_002 |
| 便當王 | meal_003 | 炸雞便當 | 75 | 去骨,加辣 | addon_003,addon_004 |
| 便當王 | meal_004 | 排骨便當 | 80 | 加辣 | addon_003,addon_004 |

**說明：** 系統會根據「今日餐廳」欄位，只顯示對應餐廳的餐點

#### 加購項目工作表 (Sheet: "加購")

| 餐廳名稱 | 加購ID | 加購名稱 | 加購價格 |
|---------|--------|---------|---------|
| 美味麵館 | addon_001 | 加麵 | 10 |
| 美味麵館 | addon_002 | 焗烤 | 20 |
| 便當王 | addon_003 | 飲料 | 15 |
| 便當王 | addon_004 | 加飯 | 5 |

**說明：** 系統會根據餐點的加購項目ID，顯示對應的加購選項

#### 訂單工作表 (Sheet: "訂單")

| 時間戳記 | 餐廳名稱 | 學生姓名 | 餐點名稱 | 餐點價格 | 備註選項 | 加購項目 | 加購金額 | 總金額 |
|---------|---------|---------|---------|---------|---------|---------|---------|--------|
| 2024-01-15 12:30:00 | 美味麵館 | 王小明 | 紅燒牛肉麵 | 80 | 加辣,粗麵 | 加麵,焗烤 | 30 | 110 |
| 2024-01-15 12:35:00 | 便當王 | 李小華 | 炸雞便當 | 75 | 去骨 | 飲料 | 15 | 90 |

**說明：** 訂單會記錄餐廳名稱和加購金額，方便老師統計各餐廳的訂單和驗證總金額（餐點價格 + 加購金額 = 總金額）

### 狀態管理

前端應用程式維護以下狀態：

```typescript
interface AppState {
  // 設定資料
  configuration: Configuration | null;
  isLoadingConfig: boolean;
  configError: string | null;
  
  // 選擇狀態
  selectedMeal: MealItem | null;
  selectedOptions: string[];
  selectedAddons: AddonItem[];
  studentName: string;
  
  // UI 狀態
  isSubmitting: boolean;
  notification: {
    type: 'success' | 'error' | null;
    message: string;
  };
}
```


## 正確性屬性

*屬性是一個特徵或行為，應該在系統的所有有效執行中保持為真——本質上是關於系統應該做什麼的正式陳述。屬性作為人類可讀規格和機器可驗證正確性保證之間的橋樑。*

### 屬性 1: 餐點選擇的單一性

*對於任意* 兩個不同的餐點，當學生選擇第二個餐點時，第一個餐點應該被取消選擇，且只有第二個餐點保持選中狀態

**驗證需求: 2.4**

### 屬性 2: 總金額計算的正確性

*對於任意* 餐點和加購項目組合，總金額應該等於餐點基本價格加上所有已選擇加購項目的價格總和

**驗證需求: 6.3, 11.5**

### 屬性 3: 加購項目的多選性

*對於任意* 加購項目集合，學生應該能夠同時選擇多個加購項目，且所有選擇的加購項目都應該反映在總金額中

**驗證需求: 4.2, 11.2**

### 屬性 4: 加購項目切換的正確性

*對於任意* 已選擇的加購項目，再次點擊該項目應該取消選擇，且該項目的價格應該從總金額中扣除

**驗證需求: 4.3, 11.4**

### 屬性 5: 備註選項的多選性

*對於任意* 備註選項集合，學生應該能夠同時選擇多個備註選項，且所有選擇都應該被記錄

**驗證需求: 3.2**

### 屬性 6: 備註選項切換的正確性

*對於任意* 已選擇的備註選項，再次點擊該選項應該取消選擇

**驗證需求: 3.3**

### 屬性 7: 訂單資料的完整性

*對於任意* 有效訂單，提交到訂單工作表的資料應該包含學生姓名、餐點名稱、所有備註選項、所有加購項目、總金額和時間戳記

**驗證需求: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6**

### 屬性 8: 訂單附加的非破壞性

*對於任意* 新訂單，提交到訂單工作表時應該附加到現有記錄之後，而不應該覆蓋或刪除任何既有資料

**驗證需求: 9.7**

### 屬性 9: 表單重置的完整性

*對於任意* 成功提交的訂單，系統應該清空所有輸入欄位、取消所有選擇項目，並將總金額重置為零

**驗證需求: 8.2, 8.3**

### 屬性 10: 餐點選擇前的功能禁用

*對於任意* 未選擇餐點的狀態，備註選項和加購項目的選擇功能應該被禁用

**驗證需求: 3.5, 4.5**

### 屬性 11: 貨幣格式的一致性

*對於任意* 金額值，顯示時應該使用一致的貨幣格式（NT$ 加上數字）

**驗證需求: 6.4**

### 屬性 12: 姓名輸入的即時反映

*對於任意* 文字輸入，在姓名欄位中輸入的內容應該即時顯示在介面上

**驗證需求: 5.2**

### 屬性 13: 設定資料的關聯性

*對於任意* 餐點，系統應該能夠正確關聯並顯示該餐點的多個備註選項和多個加購項目

**驗證需求: 10.3, 10.4**

### 屬性 14: 設定更新的反映性

*對於任意* 設定工作表的更新，系統在下次載入時應該反映最新的設定資料

**驗證需求: 10.5**

## 錯誤處理

### 網路錯誤處理

1. **設定載入失敗**
   - 顯示友善的錯誤訊息
   - 提供「重試」按鈕
   - 保持應用程式可用狀態

2. **訂單提交失敗**
   - 顯示具體的錯誤訊息
   - 保留使用者輸入的資料
   - 提供重新提交選項
   - 記錄錯誤日誌供除錯

### 資料驗證錯誤

1. **姓名欄位驗證**
   - 檢查空值
   - 檢查純空白字元
   - 顯示具體的驗證錯誤訊息

2. **餐點選擇驗證**
   - 確保至少選擇一個餐點
   - 在提交前進行驗證

### 圖片載入錯誤

1. **菜單圖片載入失敗**
   - 顯示佔位圖或錯誤訊息
   - 提供重新載入選項
   - 不阻擋其他功能的使用

### 錯誤訊息設計原則

- 使用簡單易懂的繁體中文
- 提供具體的錯誤原因
- 給予明確的解決建議
- 避免技術術語

## 測試策略

### 單元測試

系統將使用 **Vitest** 作為測試框架，配合 **React Testing Library** 進行元件測試。

#### 測試範圍

1. **金額計算邏輯**
   - 測試餐點價格顯示
   - 測試加購項目價格累加
   - 測試加購項目取消後的價格扣除
   - 測試邊界情況（零價格、大數值）

2. **表單驗證邏輯**
   - 測試空姓名驗證
   - 測試純空白字元驗證
   - 測試未選擇餐點的驗證

3. **資料轉換邏輯**
   - 測試 Google Sheet 資料解析
   - 測試訂單資料格式化
   - 測試日期時間格式化

4. **狀態管理邏輯**
   - 測試餐點選擇狀態更新
   - 測試備註選項切換
   - 測試加購項目切換
   - 測試表單重置

#### 測試範例

```typescript
describe('總金額計算', () => {
  test('應該正確計算餐點價格加上單個加購項目', () => {
    const meal = { price: 80 };
    const addons = [{ price: 10 }];
    expect(calculateTotal(meal, addons)).toBe(90);
  });

  test('應該正確計算餐點價格加上多個加購項目', () => {
    const meal = { price: 80 };
    const addons = [{ price: 10 }, { price: 20 }];
    expect(calculateTotal(meal, addons)).toBe(110);
  });
});
```

### 屬性基礎測試

系統將使用 **fast-check** 作為屬性基礎測試庫。每個屬性測試應該執行至少 100 次迭代。

#### 測試標註格式

每個屬性測試必須使用以下格式標註：

```typescript
// **Feature: student-lunch-order, Property 2: 總金額計算的正確性**
```

#### 屬性測試範圍

1. **屬性 2: 總金額計算的正確性**
   - 生成隨機餐點價格和加購項目價格組合
   - 驗證總金額等於餐點價格加上所有加購項目價格

2. **屬性 3: 加購項目的多選性**
   - 生成隨機數量的加購項目
   - 驗證所有選擇的加購項目都反映在總金額中

3. **屬性 4: 加購項目切換的正確性**
   - 生成隨機加購項目集合
   - 驗證取消選擇後價格正確扣除

4. **屬性 7: 訂單資料的完整性**
   - 生成隨機訂單資料
   - 驗證所有必要欄位都存在於輸出中

5. **屬性 11: 貨幣格式的一致性**
   - 生成隨機金額值
   - 驗證格式化後的字串符合 "NT$ {數字}" 格式

#### 屬性測試範例

```typescript
// **Feature: student-lunch-order, Property 2: 總金額計算的正確性**
describe('屬性: 總金額計算的正確性', () => {
  test('對於任意餐點和加購項目組合，總金額應該等於各項價格總和', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 500 }), // 餐點價格
        fc.array(fc.integer({ min: 0, max: 100 }), { maxLength: 10 }), // 加購項目價格
        (mealPrice, addonPrices) => {
          const expectedTotal = mealPrice + addonPrices.reduce((sum, p) => sum + p, 0);
          const actualTotal = calculateTotal({ price: mealPrice }, 
            addonPrices.map(p => ({ price: p })));
          return actualTotal === expectedTotal;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### 整合測試

1. **Google Sheets API 整合**
   - 測試設定資料讀取
   - 測試訂單資料寫入
   - 使用測試用 Google Sheet

2. **端到端流程**
   - 測試完整的訂購流程
   - 從載入菜單到提交訂單
   - 驗證資料正確寫入 Google Sheet

### 測試資料管理

1. **測試用 Google Sheet**
   - 建立專門的測試 Sheet
   - 包含各種測試情境的資料
   - 定期重置測試資料

2. **Mock 資料**
   - 為單元測試準備 mock 資料
   - 涵蓋正常情況和邊界情況
   - 保持資料的真實性

## Google Sheets 和 Apps Script 教學

### 開始前準備

**你需要的東西：**
1. ✅ Google 帳號（Gmail 帳號）
2. ✅ 瀏覽器（Chrome、Firefox、Safari 都可以）
3. ✅ 就這樣！不需要其他設定

**不需要的東西：**
- ❌ 不需要申請 Google Cloud Platform
- ❌ 不需要啟用 Google Sheets API
- ❌ 不需要建立 API 金鑰
- ❌ 不需要設定 OAuth

**為什麼這麼簡單？**
因為我們使用 **Google Apps Script Web App**，它是 Google 提供的簡化方案，所有複雜的設定 Google 都幫你處理好了。

### 什麼是 Google Sheets API 和 Apps Script？

**Google Sheets** 就像 Excel，但是在雲端上，可以透過網址分享和協作。

**Google Apps Script** 是 Google 提供的程式語言（基於 JavaScript），可以讓你為 Google Sheets 寫程式，讓它變成一個簡單的後端 API。

**為什麼使用 Apps Script？**
- 不需要架設伺服器
- 不需要資料庫
- 老師可以直接在 Google Sheets 管理資料
- 免費且穩定

### 步驟 1: 建立 Google Sheet

1. 開啟 [Google Sheets](https://sheets.google.com)
2. 建立新試算表，命名為「安親班訂便當系統」
3. 建立以下工作表（Sheet）：
   - 設定
   - 餐點
   - 加購
   - 訂單

4. 在各工作表中建立標題行（第一行）：

**設定工作表：**
```
A1: 今日餐廳
B1: 菜單圖片網址
A2: 美味麵館
B2: https://example.com/menu.jpg
```

**餐點工作表：**
```
A1: 餐廳名稱 | B1: 餐點ID | C1: 餐點名稱 | D1: 餐點價格 | E1: 備註選項 | F1: 加購項目ID
A2: 美味麵館 | B2: meal_001 | C2: 紅燒牛肉麵 | D2: 80 | E2: 加辣,粗麵,細麵 | F2: addon_001,addon_002
```

**加購工作表：**
```
A1: 餐廳名稱 | B1: 加購ID | C1: 加購名稱 | D1: 加購價格
A2: 美味麵館 | B2: addon_001 | C2: 加麵 | D2: 10
```

**訂單工作表：**
```
A1: 時間戳記 | B1: 餐廳名稱 | C1: 學生姓名 | D1: 餐點名稱 | E1: 餐點價格 | F1: 備註選項 | G1: 加購項目 | H1: 加購金額 | I1: 總金額
```

### 步驟 2: 開啟 Apps Script 編輯器

1. 在 Google Sheet 中，點擊上方選單「擴充功能」→「Apps Script」
   - 如果找不到「擴充功能」，可能是「工具」→「指令碼編輯器」
2. 會開啟一個新視窗，這就是 Apps Script 編輯器
   - 看起來像一個程式碼編輯器
   - 左側有檔案列表
   - 中間是程式碼區域
3. 你會看到預設的程式碼：
   ```javascript
   function myFunction() {
     
   }
   ```
4. 全選並刪除這段預設程式碼（我們等等會貼上新的）

### 步驟 3: 了解 Apps Script 基本概念

Apps Script 可以建立「Web App」，讓你的前端應用程式透過網址呼叫它：

- **doGet()** 函數：處理 GET 請求（讀取資料）
- **doPost()** 函數：處理 POST 請求（寫入資料）

```javascript
// 當前端發送 GET 請求時，這個函數會被執行
function doGet(e) {
  // 讀取 Google Sheet 資料
  // 回傳 JSON 格式的資料
}

// 當前端發送 POST 請求時，這個函數會被執行
function doPost(e) {
  // 接收前端傳來的資料
  // 寫入 Google Sheet
  // 回傳成功或失敗訊息
}
```

### 步驟 4: 貼上完整程式碼

將以下完整程式碼貼到 Apps Script 編輯器中（替換掉原本的內容）：

```javascript
// 完整的 Apps Script 程式碼會在實作階段提供
// 這裡先說明程式碼的結構
```

**程式碼包含：**
- `doGet()` 函數：讀取設定和餐點資料
- `doPost()` 函數：寫入訂單資料
- `parseMealsData()` 函數：解析餐點資料
- `parseAddonsData()` 函數：解析加購項目資料

### 步驟 5: 儲存專案

1. 點擊上方的「磁碟」圖示或按 `Ctrl+S` (Mac: `Cmd+S`)
2. 第一次儲存會要求輸入專案名稱
3. 輸入：「訂便當系統 API」
4. 點擊「確定」

### 步驟 6: 部署為 Web App

**重要：這是讓前端能夠呼叫你的程式碼的關鍵步驟**

1. 點擊右上角「部署」按鈕（藍色按鈕）
2. 選擇「新增部署」
3. 在「選取類型」旁邊，點擊齒輪圖示
4. 選擇「網頁應用程式」
5. 填寫設定：
   - **說明**：訂便當系統 API v1
   - **執行身分**：選擇「我」
   - **具有存取權的使用者**：選擇「任何人」
6. 點擊「部署」
7. **第一次部署會要求授權**：
   - 點擊「授權存取權」
   - 選擇你的 Google 帳號
   - 會出現警告「這個應用程式未經 Google 驗證」
   - 點擊「進階」→「前往『訂便當系統 API』(不安全)」
   - 點擊「允許」
8. 部署完成後，會顯示「網頁應用程式網址」
9. **複製這個網址**，格式類似：
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
10. 這個網址就是你的 API 端點，前端會用它來讀取和寫入資料

**每次修改程式碼後如何更新：**
1. 儲存程式碼
2. 點擊「部署」→「管理部署」
3. 點擊右側的「編輯」圖示（鉛筆）
4. 在「版本」下拉選單中選擇「新版本」
5. 點擊「部署」

### 步驟 7: 測試 API

部署完成後，你可以在瀏覽器中直接測試：

1. 複製你的「網頁應用程式網址」
2. 在瀏覽器的網址列貼上並按 Enter
3. 如果看到類似這樣的 JSON 資料，表示成功了：
   ```json
   {
     "success": true,
     "data": {
       "restaurantName": "美味麵館",
       "menuImageUrl": "https://...",
       "meals": [...]
     }
   }
   ```
4. 如果看到錯誤訊息，檢查：
   - Google Sheet 的工作表名稱是否正確（設定、餐點、加購、訂單）
   - 設定工作表的 A2 和 B2 是否有填入資料
   - 餐點和加購工作表是否有資料

**常見問題：**

**Q: 看到「Authorization required」**
A: 需要重新授權，回到 Apps Script 編輯器，重新部署一次

**Q: 看到空的資料**
A: 檢查 Google Sheet 的資料是否正確填入，特別是「今日餐廳」欄位

**Q: 看到「Cannot read property」錯誤**
A: 檢查儲存格位置是否正確（A2, B2）

### 步驟 8: 在前端使用 API

在 React 應用程式中，使用 fetch 呼叫 API：

```typescript
// 讀取設定
const response = await fetch('YOUR_WEB_APP_URL');
const data = await response.json();

// 提交訂單
const response = await fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  body: JSON.stringify({ order: orderData })
});
```

## Google Apps Script 實作

### 部署架構

Google Apps Script 作為中間層，提供以下功能：

1. **讀取設定資料** (doGet)
2. **寫入訂單資料** (doPost)
3. **CORS 處理**
4. **錯誤處理和日誌記錄**

### API 端點實作

#### GET /api/config

```javascript
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 讀取設定工作表
    const configSheet = ss.getSheetByName('設定');
    const todayRestaurant = configSheet.getRange('A2').getValue(); // 今日餐廳
    const menuImageUrl = configSheet.getRange('B2').getValue();    // 菜單圖片網址
    
    // 讀取餐點工作表
    const mealsSheet = ss.getSheetByName('餐點');
    const mealsData = mealsSheet.getDataRange().getValues();
    const meals = parseMealsData(mealsData, todayRestaurant);
    
    // 讀取加購工作表
    const addonsSheet = ss.getSheetByName('加購');
    const addonsData = addonsSheet.getDataRange().getValues();
    const addons = parseAddonsData(addonsData, todayRestaurant);
    
    // 組合資料
    const config = {
      restaurantName: todayRestaurant,
      menuImageUrl: menuImageUrl,
      meals: meals.map(meal => ({
        ...meal,
        addons: addons.filter(addon => meal.addonIds.includes(addon.id))
      }))
    };
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: config }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

#### POST /api/order

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const order = data.order;
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ordersSheet = ss.getSheetByName('訂單');
    
    // 計算加購金額總和
    const addonsTotal = order.selectedAddons && order.selectedAddons.length > 0
      ? order.selectedAddons.reduce((sum, addon) => sum + addon.price, 0)
      : 0;
    
    // 附加新訂單（包含餐廳名稱和加購金額）
    ordersSheet.appendRow([
      order.timestamp,
      order.restaurantName,
      order.studentName,
      order.mealName,
      order.mealPrice,
      order.selectedOptions.join(', '),
      order.selectedAddons.map(a => a.name).join(', '),
      addonsTotal,
      order.totalAmount
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: '訂單已成功提交' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 資料解析函數

```javascript
function parseMealsData(data, restaurantName) {
  const meals = [];
  // 跳過標題行
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // 只處理符合今日餐廳的餐點
    if (row[0] === restaurantName && row[1]) { // row[0] 是餐廳名稱，row[1] 是餐點ID
      meals.push({
        id: row[1],           // B欄：餐點ID
        name: row[2],         // C欄：餐點名稱
        price: row[3],        // D欄：餐點價格
        options: row[4] ? row[4].split(',').map(s => s.trim()) : [],  // E欄：備註選項
        addonIds: row[5] ? row[5].split(',').map(s => s.trim()) : []  // F欄：加購項目ID
      });
    }
  }
  return meals;
}

function parseAddonsData(data, restaurantName) {
  const addons = [];
  // 跳過標題行
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // 只處理符合今日餐廳的加購項目
    if (row[0] === restaurantName && row[1]) { // row[0] 是餐廳名稱，row[1] 是加購ID
      addons.push({
        id: row[1],      // B欄：加購ID
        name: row[2],    // C欄：加購名稱
        price: row[3]    // D欄：加購價格
      });
    }
  }
  return addons;
}
```

## 本地開發和設定

### 前端本地開發

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **設定環境變數**
   建立 `.env` 檔案：
   ```
   VITE_GOOGLE_SCRIPT_URL=你的_Google_Apps_Script_網址
   ```

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

4. **在瀏覽器中測試**
   開啟 `http://localhost:5173`

### Google Apps Script 設定

1. **建立 Apps Script 專案**
   - 在 Google Sheet 中開啟 Apps Script 編輯器
   - 貼上上述程式碼
   - 儲存專案

2. **部署為 Web App**
   - 點擊「部署」→「新增部署」
   - 選擇「網頁應用程式」
   - 執行身分：我
   - 存取權限：任何人
   - 複製 Web App URL

3. **設定 CORS**
   - Apps Script 自動處理 CORS
   - 確保前端使用正確的 URL

### Google Sheet 設定

1. **建立工作表結構**（參考前面的「Google Sheet 結構」章節）
   - 設定工作表：今日餐廳、菜單圖片網址
   - 餐點工作表：餐廳名稱、餐點資料
   - 加購工作表：餐廳名稱、加購項目資料
   - 訂單工作表：訂單記錄（含標題行）

2. **填入測試資料**
   - 至少建立 2 家餐廳的資料
   - 每家餐廳至少 3 個餐點
   - 每家餐廳至少 2 個加購項目

3. **設定權限**
   - 確保 Apps Script 有讀寫權限
   - 老師有編輯設定工作表的權限
   - 訂單工作表可設為僅附加模式

### 切換餐廳操作

老師每天只需要做兩件事：
1. 在「設定」工作表的 A2 儲存格，輸入今日餐廳名稱（例如：美味麵館）
2. 在「設定」工作表的 B2 儲存格，輸入該餐廳的菜單圖片網址

系統會自動：
- 只顯示該餐廳的餐點
- 只顯示該餐廳的加購項目
- 訂單記錄會包含餐廳名稱

## 效能考量

### 前端效能

1. **圖片最佳化**
   - 建議菜單圖片大小不超過 500KB
   - 使用適當的圖片格式（WebP/JPEG）
   - 實作圖片懶載入

2. **狀態更新最佳化**
   - 使用 React.memo 避免不必要的重新渲染
   - 合理使用 useCallback 和 useMemo

3. **API 呼叫最佳化**
   - 快取設定資料
   - 實作請求去抖動（debounce）

### Google Sheets 效能

1. **資料讀取最佳化**
   - 一次讀取所有需要的資料
   - 避免多次 API 呼叫

2. **資料寫入最佳化**
   - 使用 appendRow 而非 getRange + setValue
   - 批次寫入多筆訂單（如果需要）

## 安全性考量

### 資料驗證

1. **前端驗證**
   - 驗證所有使用者輸入
   - 檢查資料類型和格式

2. **後端驗證**
   - Apps Script 中再次驗證資料
   - 防止惡意資料寫入

### 存取控制

1. **Apps Script 權限**
   - 使用最小權限原則
   - 定期檢查存取日誌

2. **Google Sheet 權限**
   - 限制編輯權限給授權人員
   - 訂單工作表設為僅附加模式

### 資料保護

1. **個人資料**
   - 僅收集必要的學生姓名
   - 遵守資料保護規範

2. **錯誤處理**
   - 不在錯誤訊息中洩露敏感資訊
   - 記錄錯誤但不暴露內部實作細節
