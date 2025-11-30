# Design Document

## Overview

本設計為現有訂餐系統新增餐點數量選擇功能。學生可以使用 +/- 按鈕選擇餐點數量（預設為 1），系統自動計算小計和總價。加購項目維持現有的單選機制，不受數量影響。

## Architecture

### 現有架構
- **Frontend**: React 19 + TypeScript + Vite
- **State Management**: Custom hook `useOrderState`
- **Backend**: Google Apps Script
- **Database**: Google Sheets

### 變更範圍
- **Frontend**: 
  - 新增數量選擇器 UI 元件
  - 修改狀態管理以支援數量
  - 更新價格計算邏輯
- **Backend**: 
  - 修改訂單資料結構以包含數量
  - 更新 Google Sheets 訂單記錄格式

## Components and Interfaces

### 1. 新增元件：QuantitySelector

數量選擇器元件，顯示 - 按鈕、數量、+ 按鈕。

```typescript
interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  isDisabled?: boolean;
}
```

**UI 設計：**
```
[ - ]  [ 2 ]  [ + ]
```

**行為：**
- 點擊 + 按鈕：數量 +1（最大 99）
- 點擊 - 按鈕：數量 -1（最小 1）
- 數量為 1 時，- 按鈕保持可點擊但不減少
- 未選擇餐點時，按鈕為禁用狀態

### 2. 修改元件：MealItem

在餐點卡片中整合數量選擇器。

**新增 props：**
```typescript
interface MealItemProps {
  // ... 現有 props
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}
```

**UI 佈局：**
```
┌─────────────────────────────┐
│ 餐點名稱                     │
│ NT$ 80                       │
│                              │
│ [ - ]  [ 2 ]  [ + ]         │
│                              │
│ 小計：NT$ 160                │
└─────────────────────────────┘
```

### 3. 修改元件：TotalAmount

更新總價顯示邏輯，分別顯示餐點小計和加購價格。

**UI 佈局：**
```
┌─────────────────────────────┐
│ 餐點小計：NT$ 160            │
│ 加購項目：NT$ 15             │
│ ─────────────────────────   │
│ 總計：NT$ 175                │
└─────────────────────────────┘
```

## Data Models

### 前端狀態變更

#### AppState 介面修改

```typescript
interface AppState {
  // ... 現有欄位
  selectedMeal: MealItem | null;
  selectedOptions: string[];
  selectedAddons: AddonItem[];
  studentName: string;
  
  // 新增欄位
  mealQuantity: number;  // 餐點數量，預設為 1
  
  // ... 其他欄位
}
```

### 訂單資料結構變更

#### OrderData 介面修改

```typescript
interface OrderData {
  restaurantName: string;
  studentName: string;
  mealId: string;
  mealName: string;
  mealPrice: number;
  
  // 新增欄位
  mealQuantity: number;      // 餐點數量
  mealSubtotal: number;      // 餐點小計 = mealPrice × mealQuantity
  
  selectedOptions: string[];
  selectedAddons: AddonItem[];
  addonsTotal: number;       // 加購總價（不受數量影響）
  totalAmount: number;       // 總計 = mealSubtotal + addonsTotal
  timestamp: string;
}
```

### Google Sheets 訂單工作表變更

新增欄位到訂單工作表：

| 欄位 | 說明 | 範例 |
|------|------|------|
| A: 時間 | 訂單時間 | 2024/01/15 12:30 |
| B: 餐廳名稱 | 餐廳名稱 | 美味便當 |
| C: 學生姓名 | 學生姓名 | 王小明 |
| D: 餐點名稱 | 餐點名稱 | 雞腿便當 |
| E: 餐點單價 | 餐點單價 | 80 |
| **F: 餐點數量** | **餐點數量（新增）** | **2** |
| **G: 餐點小計** | **餐點小計（新增）** | **160** |
| H: 選項 | 選擇的選項 | 加辣, 粗麵 |
| I: 加購項目 | 加購項目名稱 | 加蛋 |
| J: 加購金額 | 加購項目價格 | 10 |
| K: 總金額 | 訂單總金額 | 170 |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Quantity bounds preservation
*For any* meal quantity, after increment or decrement operations, the quantity should remain within bounds of 1 to 99 inclusive
**Validates: Requirements 1.2, 1.3, 1.4, 5.4**

### Property 2: Meal subtotal calculation correctness
*For any* meal with price P and quantity Q, the meal subtotal should equal P × Q
**Validates: Requirements 1.5, 2.1, 2.3**

### Property 3: Total calculation correctness
*For any* order with meal subtotal M and addon total A, the order total should equal M + A
**Validates: Requirements 2.4, 3.4**

### Property 4: Quantity persistence in order data
*For any* submitted order, the recorded meal quantity should match the quantity selected by the user
**Validates: Requirements 4.1, 4.3**

### Property 5: Addon independence from meal quantity
*For any* order with selected addons, the addon total should not change when meal quantity changes
**Validates: Requirements 3.2, 3.3, 3.4**

### Property 6: Quantity initialization
*For any* newly selected meal, the initial quantity should be 1
**Validates: Requirements 1.1**

### Property 7: Quantity validation
*For any* quantity value, it should be a positive integer between 1 and 99
**Validates: Requirements 5.1, 5.3, 5.4**

## Error Handling

### 前端驗證
1. **數量範圍檢查**：確保數量在 1-99 之間
2. **數值類型檢查**：確保數量為正整數
3. **計算溢位檢查**：確保價格計算不會溢位

### 錯誤訊息
- 數量超出範圍：「數量必須在 1 到 99 之間」
- 計算錯誤：「價格計算錯誤，請重新選擇」

## Testing Strategy

### Unit Tests
- 測試 QuantitySelector 元件的增減按鈕行為
- 測試數量邊界條件（1 和 99）
- 測試價格計算函數的正確性
- 測試訂單資料建構函數

### Property-Based Tests
使用 **fast-check** 進行屬性測試：

1. **Property 1 Test**: 生成隨機數量和操作序列，驗證數量始終在 1-99 範圍內
2. **Property 2 Test**: 生成隨機價格和數量，驗證小計計算正確
3. **Property 3 Test**: 生成隨機餐點小計和加購總價，驗證總計計算正確
4. **Property 4 Test**: 生成隨機訂單資料，驗證數量正確記錄
5. **Property 5 Test**: 生成隨機餐點數量變化，驗證加購總價不變
6. **Property 6 Test**: 生成隨機餐點選擇，驗證初始數量為 1
7. **Property 7 Test**: 生成隨機數量值，驗證驗證邏輯正確

### Integration Tests
- 測試完整的訂餐流程（選擇餐點 → 調整數量 → 選擇加購 → 提交訂單）
- 測試數量變化時 UI 的即時更新
- 測試訂單提交後 Google Sheets 的資料正確性

## Implementation Notes

### 向後相容性
- Google Sheets 現有訂單資料不受影響
- 新欄位（餐點數量、餐點小計）對舊資料為空值
- 前端讀取設定資料時不需要變更（餐點資料結構不變）

### 效能考量
- 數量變化時使用 debounce 避免過度渲染
- 價格計算使用純函數，易於測試和優化

### UI/UX 考量
- 數量選擇器使用大按鈕，方便手機操作
- 即時顯示小計，讓學生清楚知道價格
- 保持現有的色彩風格和視覺設計
