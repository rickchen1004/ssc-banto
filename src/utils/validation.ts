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
