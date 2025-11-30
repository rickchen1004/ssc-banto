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
  selectedOptions: string[];
  selectedAddons: AddonItem[];
  totalAmount: number;
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
  
  // UI 狀態
  isSubmitting: boolean;
  notification: {
    type: 'success' | 'error' | null;
    message: string;
  };
}
