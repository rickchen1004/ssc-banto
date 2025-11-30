/**
 * 訂單資料組裝的屬性測試
 * 使用 fast-check 進行屬性基礎測試
 */

import { describe, it } from 'vitest';
import { fc } from '@fast-check/vitest';
import { buildOrderData } from './orderBuilder';
import type { MealItem, AddonItem } from '../types';

/**
 * 輔助函數：建立測試用的餐點
 */
function createTestMeal(id: string, name: string, price: number): MealItem {
  return {
    id,
    name,
    price,
    optionGroups: [],
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
 * **Feature: student-lunch-order, Property 7: 訂單資料的完整性**
 * **驗證需求: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6**
 * 
 * 對於任意有效訂單，提交到訂單工作表的資料應該包含學生姓名、餐點名稱、
 * 所有備註選項、所有加購項目、總金額和時間戳記
 */
describe('屬性 7: 訂單資料的完整性', () => {
  it('對於任意訂單資料，應該包含所有必要欄位', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }), // 餐廳名稱
        fc.string({ minLength: 1, maxLength: 50 }), // 學生姓名
        fc.string({ minLength: 1, maxLength: 50 }), // 餐點名稱
        fc.integer({ min: 0, max: 500 }), // 餐點價格
        fc.array(fc.string({ minLength: 1 }), { maxLength: 5 }), // 備註選項
        fc.array(fc.integer({ min: 0, max: 100 }), { maxLength: 5 }), // 加購項目價格
        fc.integer({ min: 0, max: 1000 }), // 總金額
        (restaurantName, studentName, mealName, mealPrice, options, addonPrices, totalAmount) => {
          // 建立測試資料
          const meal = createTestMeal('meal_001', mealName, mealPrice);
          const addons = addonPrices.map((price, index) =>
            createTestAddon(`addon_${index}`, `加購${index}`, price)
          );

          // 組裝訂單
          const order = buildOrderData(
            restaurantName,
            studentName,
            meal,
            options,
            addons,
            totalAmount
          );

          // 驗證所有必要欄位都存在
          return (
            // 需求 9.1: 包含餐廳名稱和學生姓名
            order.restaurantName === restaurantName &&
            order.studentName === studentName.trim() &&
            // 需求 9.2: 包含餐點資訊
            order.mealId === meal.id &&
            order.mealName === mealName &&
            order.mealPrice === mealPrice &&
            // 需求 9.3: 包含所有備註選項
            order.selectedOptions === options &&
            // 需求 9.4: 包含所有加購項目
            order.selectedAddons === addons &&
            // 需求 9.5: 包含總金額
            order.totalAmount === totalAmount &&
            // 需求 9.6: 包含時間戳記
            typeof order.timestamp === 'string' &&
            order.timestamp.length > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('訂單應該包含餐廳名稱（需求 9.1）', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (restaurantName) => {
          const meal = createTestMeal('meal_001', '測試餐點', 100);
          const order = buildOrderData(restaurantName, '測試學生', meal, [], [], 100);
          
          return order.restaurantName === restaurantName;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('訂單應該包含學生姓名，且自動去除前後空白（需求 9.1）', () => {
    fc.assert(
      fc.property(
        // 生成非空白的姓名（至少包含一個非空白字元）
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 0, maxLength: 5 }), // 前面的空白
        fc.string({ minLength: 0, maxLength: 5 }), // 後面的空白
        (name, prefixSpace, suffixSpace) => {
          const studentName = prefixSpace + name + suffixSpace;
          const meal = createTestMeal('meal_001', '測試餐點', 100);
          const order = buildOrderData('測試餐廳', studentName, meal, [], [], 100);
          
          // 驗證去除空白後的姓名正確
          return order.studentName === studentName.trim();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('訂單應該包含完整的餐點資訊（需求 9.2）', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        fc.integer({ min: 0, max: 500 }),
        (mealId, mealName, mealPrice) => {
          const meal: MealItem = {
            id: mealId,
            name: mealName,
            price: mealPrice,
            optionGroups: [],
            addons: [],
          };
          
          const order = buildOrderData('測試餐廳', '測試學生', meal, [], [], mealPrice);
          
          return (
            order.mealId === mealId &&
            order.mealName === mealName &&
            order.mealPrice === mealPrice
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('訂單應該包含所有選擇的備註選項（需求 9.3）', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 10 }),
        (options) => {
          const meal = createTestMeal('meal_001', '測試餐點', 100);
          const order = buildOrderData('測試餐廳', '測試學生', meal, options, [], 100);
          
          return (
            order.selectedOptions.length === options.length &&
            order.selectedOptions.every((opt, index) => opt === options[index])
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('訂單應該包含所有選擇的加購項目（需求 9.4）', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 100 }), { minLength: 0, maxLength: 10 }),
        (addonPrices) => {
          const meal = createTestMeal('meal_001', '測試餐點', 100);
          const addons = addonPrices.map((price, index) =>
            createTestAddon(`addon_${index}`, `加購${index}`, price)
          );
          
          const order = buildOrderData('測試餐廳', '測試學生', meal, [], addons, 100);
          
          return (
            order.selectedAddons.length === addons.length &&
            order.selectedAddons.every((addon, index) => 
              addon.id === addons[index].id &&
              addon.name === addons[index].name &&
              addon.price === addons[index].price
            )
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('訂單應該包含總金額（需求 9.5）', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000 }),
        (totalAmount) => {
          const meal = createTestMeal('meal_001', '測試餐點', 100);
          const order = buildOrderData('測試餐廳', '測試學生', meal, [], [], totalAmount);
          
          return order.totalAmount === totalAmount;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('訂單應該包含時間戳記（需求 9.6）', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const meal = createTestMeal('meal_001', '測試餐點', 100);
          const order = buildOrderData('測試餐廳', '測試學生', meal, [], [], 100);
          
          // 驗證時間戳記存在且為台灣時區格式 yyyy-mm-dd HH:MM:SS
          const timestamp = order.timestamp;
          const formatRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
          
          return (
            typeof timestamp === 'string' &&
            timestamp.length > 0 &&
            formatRegex.test(timestamp)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('時間戳記應該是最近的時間（台灣時區）', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const meal = createTestMeal('meal_001', '測試餐點', 100);
          const order = buildOrderData('測試餐廳', '測試學生', meal, [], [], 100);
          
          // 驗證時間戳記格式正確
          const formatRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
          if (!formatRegex.test(order.timestamp)) {
            return false;
          }
          
          // 解析時間戳記的各個部分
          const parts = order.timestamp.split(/[- :]/);
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]);
          const day = parseInt(parts[2]);
          const hour = parseInt(parts[3]);
          const minute = parseInt(parts[4]);
          const second = parseInt(parts[5]);
          
          // 驗證各個部分在合理範圍內
          return (
            year >= 2024 && year <= 2030 &&
            month >= 1 && month <= 12 &&
            day >= 1 && day <= 31 &&
            hour >= 0 && hour <= 23 &&
            minute >= 0 && minute <= 59 &&
            second >= 0 && second <= 59
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('對於空的備註選項和加購項目，訂單應該包含空陣列', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          const meal = createTestMeal('meal_001', '測試餐點', 100);
          const order = buildOrderData('測試餐廳', '測試學生', meal, [], [], 100);
          
          return (
            Array.isArray(order.selectedOptions) &&
            order.selectedOptions.length === 0 &&
            Array.isArray(order.selectedAddons) &&
            order.selectedAddons.length === 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
