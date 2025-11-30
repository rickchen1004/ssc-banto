// Type definitions for the lunch order system

export interface MealItem {
  id: string;
  name: string;
  price: number;
  optionGroups: string[][];  // 選項組（二維陣列）
  addons: AddonItem[];       // 可用的加購項目
}

export interface AddonItem {
  id: string;
  name: string;
  price: number;
}

export interface Order {
  restaurantName: string;
  studentName: string;
  mealId: string;
  mealName: string;
  mealPrice: number;
  mealQuantity: number;      // 餐點數量
  mealSubtotal: number;      // 餐點小計 = mealPrice × mealQuantity
  selectedOptions: string[];
  selectedAddons: AddonItem[];
  addonsTotal: number;       // 加購總價（不受數量影響）
  totalAmount: number;       // 總計 = mealSubtotal + addonsTotal
  timestamp: string;
}

export interface Configuration {
  restaurantName: string;
  menuImageUrl: string;
  meals: MealItem[];
}

export interface AppState {
  // 設定資料
  configuration: Configuration | null;
  isLoadingConfig: boolean;
  configError: string | null;
  
  // 選擇狀態
  selectedMeal: MealItem | null;
  selectedOptions: string[];
  selectedAddons: AddonItem[];
  studentName: string;
  mealQuantity: number;  // 餐點數量，預設為 1
  
  // UI 狀態
  isSubmitting: boolean;
  notification: {
    type: 'success' | 'error' | null;
    message: string;
  };
}
