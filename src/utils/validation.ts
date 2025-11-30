/**
 * 訂單驗證工具函數
 * 驗證訂單資料的完整性和正確性
 */

import type { MealItem } from '../types';

/**
 * 驗證結果介面
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 驗證訂單資料
 * 
 * @param studentName - 學生姓名
 * @param selectedMeal - 選擇的餐點
 * @returns {ValidationResult} 驗證結果，包含是否有效和錯誤訊息
 * 
 * 驗證規則：
 * 1. 姓名欄位不為空
 * 2. 姓名不是純空白字元
 * 3. 已選擇餐點
 */
export function validateOrder(
  studentName: string,
  selectedMeal: MealItem | null
): ValidationResult {
  // 驗證姓名欄位不為空
  if (!studentName) {
    return {
      isValid: false,
      error: '請輸入學生姓名',
    };
  }

  // 驗證姓名不是純空白字元
  if (studentName.trim() === '') {
    return {
      isValid: false,
      error: '姓名不能只包含空白字元',
    };
  }

  // 驗證已選擇餐點
  if (!selectedMeal) {
    return {
      isValid: false,
      error: '請選擇餐點',
    };
  }

  // 所有驗證通過
  return {
    isValid: true,
  };
}

/**
 * 驗證餐點數量
 * 
 * @param quantity - 餐點數量
 * @returns {ValidationResult} 驗證結果
 * 
 * 驗證規則：
 * 1. 數量必須是正整數
 * 2. 數量必須在 1-99 範圍內
 */
export function validateQuantity(quantity: number): ValidationResult {
  // 驗證是否為數字
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    return {
      isValid: false,
      error: '數量必須是數字',
    };
  }

  // 驗證是否為整數
  if (!Number.isInteger(quantity)) {
    return {
      isValid: false,
      error: '數量必須是整數',
    };
  }

  // 驗證是否為正數
  if (quantity < 1) {
    return {
      isValid: false,
      error: '數量必須大於 0',
    };
  }

  // 驗證是否在合理範圍內
  if (quantity > 99) {
    return {
      isValid: false,
      error: '數量不能超過 99',
    };
  }

  // 所有驗證通過
  return {
    isValid: true,
  };
}

/**
 * 標準化數量值
 * 確保數量在有效範圍內（1-99）
 * 
 * @param quantity - 輸入的數量
 * @returns 標準化後的數量
 */
export function normalizeQuantity(quantity: number): number {
  // 如果不是有效數字，返回 1
  if (typeof quantity !== 'number' || isNaN(quantity) || !Number.isInteger(quantity)) {
    return 1;
  }

  // 確保在 1-99 範圍內
  return Math.max(1, Math.min(99, quantity));
}
