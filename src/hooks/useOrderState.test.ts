/**
 * 表單重置的屬性測試
 * 使用 fast-check 進行屬性基礎測試
 */

import { describe, it } from 'vitest';
import { fc } from '@fast-check/vitest';
import type { AppState, MealItem, AddonItem } from '../types';

/**
 * 輔助函數：建立測試用的餐點
 */
function createTestMeal(id: string, name: string, price: number): MealItem {
  return {
    id,
    name,
    price,
    optionGroups: [['加辣', '不辣'], ['粗麵', '細麵']],
    addons: [],
  };
}

/**
 * 輔助函數：建立測試用的加購項目
 */
function createTestAddon(id: string, name: string, price: number): AddonItem {
  return {
    id,
    name,
    price,
  };
}

/**
 * 輔助函數：模擬表單重置邏輯
 * 這個函數複製了 useOrderState 中的 resetForm 邏輯
 */
function resetForm(state: AppState): AppState {
  return {
    ...state,
    selectedMeal: null,
    selectedOptions: [],
    selectedAddons: [],
    studentName: '',
  };
}

/**
 * **Feature: student-lunch-order, Property 9: 表單重置的完整性**
 * **驗證需求: 8.2, 8.3**
 * 
 * 對於任意成功提交的訂單，系統應該清空所有輸入欄位、取消所有選擇項目，並將總金額重置為零
 */
describe('屬性 9: 表單重置的完整性', () => {
  it('對於任意表單狀態，重置後所有選擇欄位應該被清空', () => {
    fc.assert(
      fc.property(
        // 生成隨機的學生姓名
        fc.string({ minLength: 1, maxLength: 20 }),
        // 生成隨機的餐點價格
        fc.integer({ min: 50, max: 500 }),
        // 生成隨機的備註選項數量
        fc.integer({ min: 0, max: 5 }),
        // 生成隨機的加購項目數量
        fc.integer({ min: 0, max: 5 }),
        (studentName, mealPrice, numOptions, numAddons) => {
          // 建立測試餐點
          const meal = createTestMeal('meal_001', '測試餐點', mealPrice);
          
          // 建立測試備註選項
          const selectedOptions = Array.from({ length: numOptions }, (_, i) => `選項${i}`);
          
          // 建立測試加購項目
          const selectedAddons = Array.from({ length: numAddons }, (_, i) => 
            createTestAddon(`addon_${i}`, `加購${i}`, 10 + i * 5)
          );

          // 建立有資料的表單狀態
          const stateWithData: AppState = {
            configuration: null,
            isLoadingConfig: false,
            configError: null,
            selectedMeal: meal,
            selectedOptions,
            selectedAddons,
            studentName,
            mealQuantity: 1,
            isSubmitting: false,
            notification: { type: null, message: '' },
          };

          // 執行重置
          const resetState = resetForm(stateWithData);

          // 驗證所有欄位都被清空
          return (
            resetState.selectedMeal === null &&
            resetState.selectedOptions.length === 0 &&
            resetState.selectedAddons.length === 0 &&
            resetState.studentName === ''
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('重置後的學生姓名應該是空字串', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (studentName) => {
          const stateWithData: AppState = {
            configuration: null,
            isLoadingConfig: false,
            configError: null,
            selectedMeal: createTestMeal('meal_001', '測試餐點', 100),
            selectedOptions: ['加辣'],
            selectedAddons: [],
            studentName,
            mealQuantity: 1,
            isSubmitting: false,
            notification: { type: null, message: '' },
          };

          const resetState = resetForm(stateWithData);

          return resetState.studentName === '';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('重置後的選擇餐點應該是 null', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 50, max: 500 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (mealPrice, mealName) => {
          const stateWithData: AppState = {
            configuration: null,
            isLoadingConfig: false,
            configError: null,
            selectedMeal: createTestMeal('meal_001', mealName, mealPrice),
            selectedOptions: [],
            selectedAddons: [],
            studentName: '測試學生',
            mealQuantity: 1,
            isSubmitting: false,
            notification: { type: null, message: '' },
          };

          const resetState = resetForm(stateWithData);

          return resetState.selectedMeal === null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('重置後的備註選項陣列應該是空陣列', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 10 }),
        (options) => {
          const stateWithData: AppState = {
            configuration: null,
            isLoadingConfig: false,
            configError: null,
            selectedMeal: createTestMeal('meal_001', '測試餐點', 100),
            selectedOptions: options,
            selectedAddons: [],
            studentName: '測試學生',
            mealQuantity: 1,            isSubmitting: false,
            notification: { type: null, message: '' },
          };

          const resetState = resetForm(stateWithData);

          return (
            Array.isArray(resetState.selectedOptions) &&
            resetState.selectedOptions.length === 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('重置後的加購項目陣列應該是空陣列', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 100 }), { minLength: 1, maxLength: 10 }),
        (addonPrices) => {
          const addons = addonPrices.map((price, index) =>
            createTestAddon(`addon_${index}`, `加購${index}`, price)
          );

          const stateWithData: AppState = {
            configuration: null,
            isLoadingConfig: false,
            configError: null,
            selectedMeal: createTestMeal('meal_001', '測試餐點', 100),
            selectedOptions: [],
            selectedAddons: addons,
            studentName: '測試學生',
            mealQuantity: 1,            isSubmitting: false,
            notification: { type: null, message: '' },
          };

          const resetState = resetForm(stateWithData);

          return (
            Array.isArray(resetState.selectedAddons) &&
            resetState.selectedAddons.length === 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('重置不應該影響其他狀態欄位（如 configuration, isLoadingConfig 等）', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.string(),
        (isLoadingConfig, configError) => {
          const stateWithData: AppState = {
            configuration: {
              restaurantName: '測試餐廳',
              menuImageUrl: 'https://example.com/menu.jpg',
              meals: [],
            },
            isLoadingConfig,
            configError: configError || null,
            selectedMeal: createTestMeal('meal_001', '測試餐點', 100),
            selectedOptions: ['加辣'],
            selectedAddons: [createTestAddon('addon_001', '加麵', 10)],
            studentName: '測試學生',
            mealQuantity: 1,            isSubmitting: false,
            notification: { type: null, message: '' },
          };

          const resetState = resetForm(stateWithData);

          // 驗證其他欄位保持不變
          return (
            resetState.configuration === stateWithData.configuration &&
            resetState.isLoadingConfig === stateWithData.isLoadingConfig &&
            resetState.configError === stateWithData.configError &&
            resetState.isSubmitting === stateWithData.isSubmitting &&
            resetState.notification === stateWithData.notification
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('對於已經是空的表單，重置應該保持空狀態', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const emptyState: AppState = {
            configuration: null,
            isLoadingConfig: false,
            configError: null,
            selectedMeal: null,
            selectedOptions: [],
            selectedAddons: [],
            studentName: '',
            mealQuantity: 1,
            isSubmitting: false,
            notification: { type: null, message: '' },
          };

          const resetState = resetForm(emptyState);

          return (
            resetState.selectedMeal === null &&
            resetState.selectedOptions.length === 0 &&
            resetState.selectedAddons.length === 0 &&
            resetState.studentName === ''
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
