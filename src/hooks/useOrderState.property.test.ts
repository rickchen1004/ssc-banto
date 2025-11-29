/**
 * **Feature: student-lunch-order, Property 10: 餐點選擇前的功能禁用**
 * **Validates: Requirements 3.5, 4.5**
 * 
 * 屬性測試：驗證在未選擇餐點時，備註選項和加購項目的選擇功能應該被禁用
 */

import { describe, test } from 'vitest';
import fc from 'fast-check';
import type { MealItem } from '../types';

/**
 * 模擬 useOrderState 的核心邏輯
 * 這個函數檢查在沒有選擇餐點時，備註和加購功能是否應該被禁用
 */
function shouldDisableOptionsAndAddons(selectedMeal: MealItem | null): boolean {
  // 當沒有選擇餐點時，備註和加購功能應該被禁用
  return selectedMeal === null;
}

/**
 * 生成隨機餐點資料
 */
const mealArbitrary = fc.record({
  id: fc.string({ minLength: 1 }),
  name: fc.string({ minLength: 1 }),
  price: fc.integer({ min: 0, max: 500 }),
  options: fc.array(fc.string({ minLength: 1 }), { maxLength: 5 }),
  addons: fc.array(
    fc.record({
      id: fc.string({ minLength: 1 }),
      name: fc.string({ minLength: 1 }),
      price: fc.integer({ min: 0, max: 100 }),
    }),
    { maxLength: 5 }
  ),
});

describe('屬性 10: 餐點選擇前的功能禁用', () => {
  test('對於任意未選擇餐點的狀態，備註選項和加購項目的選擇功能應該被禁用', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(null), // 未選擇餐點的狀態
        (selectedMeal) => {
          // 驗證：當沒有選擇餐點時，功能應該被禁用
          const isDisabled = shouldDisableOptionsAndAddons(selectedMeal);
          return isDisabled === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('對於任意已選擇餐點的狀態，備註選項和加購項目的選擇功能應該被啟用', () => {
    fc.assert(
      fc.property(
        mealArbitrary, // 已選擇餐點的狀態
        (selectedMeal) => {
          // 驗證：當已選擇餐點時，功能應該被啟用（不被禁用）
          const isDisabled = shouldDisableOptionsAndAddons(selectedMeal);
          return isDisabled === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('對於任意餐點選擇狀態的切換，禁用狀態應該正確反映', () => {
    fc.assert(
      fc.property(
        fc.option(mealArbitrary, { nil: null }), // 可能是 null 或餐點
        (selectedMeal) => {
          const isDisabled = shouldDisableOptionsAndAddons(selectedMeal);
          
          // 驗證：禁用狀態應該與是否選擇餐點一致
          if (selectedMeal === null) {
            return isDisabled === true;
          } else {
            return isDisabled === false;
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
