/**
 * 訂單資料組裝工具
 * 負責將應用程式狀態轉換為訂單資料格式
 */

import type { Order, MealItem, AddonItem } from '../types';
import { formatTaiwanDateTime } from './dateFormatter';

/**
 * 建立訂單資料
 * 
 * 根據需求 9.1-9.6 和數量功能需求 4.1-4.4，訂單資料必須包含：
 * - 餐廳名稱 (9.1)
 * - 學生姓名 (9.1)
 * - 餐點資訊 (9.2)
 * - 餐點數量 (4.1)
 * - 餐點小計 (4.3)
 * - 備註選項 (9.3)
 * - 加購項目 (9.4, 4.2)
 * - 加購總價 (4.4)
 * - 總金額 (9.5)
 * - 時間戳記 (9.6)
 * 
 * @param restaurantName - 餐廳名稱
 * @param studentName - 學生姓名（會自動去除前後空白）
 * @param meal - 選擇的餐點
 * @param selectedOptions - 選擇的備註選項陣列
 * @param selectedAddons - 選擇的加購項目陣列
 * @param mealQuantity - 餐點數量
 * @param totalAmount - 總金額
 * @returns 完整的訂單資料物件
 */
export function buildOrderData(
  restaurantName: string,
  studentName: string,
  meal: MealItem,
  selectedOptions: string[],
  selectedAddons: AddonItem[],
  mealQuantity: number,
  totalAmount: number
): Order {
  // 計算餐點小計
  const mealSubtotal = meal.price * mealQuantity;
  
  // 計算加購總價
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  
  return {
    // 需求 9.1: 包含餐廳名稱
    restaurantName,
    
    // 需求 9.1: 包含學生姓名（去除前後空白）
    studentName: studentName.trim(),
    
    // 需求 9.2: 包含餐點資訊
    mealId: meal.id,
    mealName: meal.name,
    mealPrice: meal.price,
    
    // 需求 4.1: 包含餐點數量
    mealQuantity,
    
    // 需求 4.3: 包含餐點小計
    mealSubtotal,
    
    // 需求 9.3: 包含所有選擇的備註選項
    selectedOptions,
    
    // 需求 9.4, 4.2: 包含所有選擇的加購項目
    selectedAddons,
    
    // 需求 4.4: 包含加購總價
    addonsTotal,
    
    // 需求 9.5: 包含總金額
    totalAmount,
    
    // 需求 9.6: 包含時間戳記（台灣時區，格式：yyyy-mm-dd HH:MM:SS）
    timestamp: formatTaiwanDateTime(),
  };
}
