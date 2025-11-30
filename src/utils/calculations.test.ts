/**
 * 金額計算函數的屬性測試
 * 使用 fast-check 進行屬性基礎測試
 */

import { describe, it } from 'vitest';
import { fc } from '@fast-check/vitest';
import { calculateTotal, formatCurrency, toggleAddon, toggleOption } from './calculations';
import type { MealItem, AddonItem } from '../types';

/**
 * **Feature: student-lunch-order, Property 2: 總金額計算的正確性**
 * **驗證需求: 6.3, 11.5**
 * 
 * 對於任意餐點和加購項目組合，總金額應該等於餐點基本價格加上所有已選擇加購項目的價格總和
 */
describe('屬性 2: 總金額計算的正確性', () => {
  it('對於任意餐點和加購項目組合，總金額應該等於各項價格總和', () => {
    fc.assert(
      fc.property(
        // 生成餐點價格（0-500 元）
        fc.integer({ min: 0, max: 500 }),
        // 生成加購項目價格陣列（最多 10 個，每個 0-100 元）
        fc.array(fc.integer({ min: 0, max: 100 }), { maxLength: 10 }),
        (mealPrice, addonPrices) => {
          // 建立測試餐點
          const meal: MealItem = {
            id: 'test_meal',
            name: '測試餐點',
            price: mealPrice,
            optionGroups: [],
            addons: [],
          };

          // 建立測試加購項目
          const addons: AddonItem[] = addonPrices.map((price, index) => ({
            id: `addon_${index}`,
            name: `加購${index}`,
            price,
          }));

          // 計算預期總金額
          const expectedTotal = mealPrice + addonPrices.reduce((sum, p) => sum + p, 0);

          // 計算實際總金額
          const actualTotal = calculateTotal(meal, addons);

          // 驗證總金額正確
          return actualTotal === expectedTotal;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('當沒有選擇餐點時，總金額應該為 0', () => {
    fc.assert(
      fc.property(
        // 生成加購項目價格陣列
        fc.array(fc.integer({ min: 0, max: 100 }), { maxLength: 10 }),
        (addonPrices) => {
          // 建立測試加購項目
          const addons: AddonItem[] = addonPrices.map((price, index) => ({
            id: `addon_${index}`,
            name: `加購${index}`,
            price,
          }));

          // 計算總金額（沒有餐點）
          const total = calculateTotal(null, addons);

          // 驗證總金額為 0
          return total === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('當沒有加購項目時，總金額應該等於餐點價格', () => {
    fc.assert(
      fc.property(
        // 生成餐點價格
        fc.integer({ min: 0, max: 500 }),
        (mealPrice) => {
          // 建立測試餐點
          const meal: MealItem = {
            id: 'test_meal',
            name: '測試餐點',
            price: mealPrice,
            optionGroups: [],
            addons: [],
          };

          // 計算總金額（沒有加購項目）
          const total = calculateTotal(meal, []);

          // 驗證總金額等於餐點價格
          return total === mealPrice;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: student-lunch-order, Property 11: 貨幣格式的一致性**
 * **驗證需求: 6.4**
 * 
 * 對於任意金額值，顯示時應該使用一致的貨幣格式（NT$ 加上數字）
 */
describe('屬性 11: 貨幣格式的一致性', () => {
  it('對於任意金額值，格式化後應該符合 "NT$ {數字}" 格式', () => {
    fc.assert(
      fc.property(
        // 生成金額（0-10000 元）
        fc.integer({ min: 0, max: 10000 }),
        (amount) => {
          // 格式化金額
          const formatted = formatCurrency(amount);

          // 驗證格式
          const expectedFormat = `NT$ ${amount}`;
          return formatted === expectedFormat;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('格式化後的字串應該以 "NT$ " 開頭', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10000 }),
        (amount) => {
          const formatted = formatCurrency(amount);
          return formatted.startsWith('NT$ ');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('格式化後的字串應該包含正確的數字', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10000 }),
        (amount) => {
          const formatted = formatCurrency(amount);
          const numberPart = formatted.replace('NT$ ', '');
          return numberPart === amount.toString();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * 額外的屬性測試：加購項目切換的正確性
 */
describe('加購項目切換的正確性', () => {
  it('切換未選擇的加購項目應該加入到陣列中', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 100 }), { minLength: 1, maxLength: 5 }),
        (prices) => {
          const addons: AddonItem[] = prices.map((price, index) => ({
            id: `addon_${index}`,
            name: `加購${index}`,
            price,
          }));

          const newAddon: AddonItem = {
            id: 'new_addon',
            name: '新加購',
            price: 50,
          };

          const result = toggleAddon(newAddon, addons);

          // 驗證新加購項目已加入
          return result.length === addons.length + 1 &&
                 result.some(a => a.id === 'new_addon');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('切換已選擇的加購項目應該從陣列中移除', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 100 }), { minLength: 2, maxLength: 5 }),
        (prices) => {
          const addons: AddonItem[] = prices.map((price, index) => ({
            id: `addon_${index}`,
            name: `加購${index}`,
            price,
          }));

          // 選擇第一個加購項目來移除
          const toRemove = addons[0];
          const result = toggleAddon(toRemove, addons);

          // 驗證加購項目已移除
          return result.length === addons.length - 1 &&
                 !result.some(a => a.id === toRemove.id);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * 額外的屬性測試：備註選項切換的正確性
 */
describe('備註選項切換的正確性', () => {
  it('切換未選擇的備註選項應該加入到陣列中', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 0, maxLength: 5 }),
        (options) => {
          const newOption = '新選項';
          
          // 確保新選項不在現有選項中
          if (options.includes(newOption)) {
            return true; // 跳過這個測試案例
          }

          const result = toggleOption(newOption, options);

          // 驗證新選項已加入
          return result.length === options.length + 1 &&
                 result.includes(newOption);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('切換已選擇的備註選項應該從陣列中移除', () => {
    fc.assert(
      fc.property(
        // 生成唯一的字串陣列（避免重複）
        fc.uniqueArray(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
        (options) => {
          // 選擇第一個選項來移除
          const toRemove = options[0];
          const result = toggleOption(toRemove, options);

          // 驗證選項已移除
          return result.length === options.length - 1 &&
                 !result.includes(toRemove);
        }
      ),
      { numRuns: 100 }
    );
  });
});
