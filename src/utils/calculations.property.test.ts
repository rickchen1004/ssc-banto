/**
 * Property-based tests for calculation utilities
 * Feature: quantity-based-pricing
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateMealSubtotal, calculateAddonsTotal, calculateTotal } from './calculations';
import type { MealItem, AddonItem } from '../types';

describe('calculations - Property 2: Meal subtotal calculation correctness', () => {
  it('should calculate meal subtotal as price × quantity for any meal and quantity', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string(),
          name: fc.string(),
          price: fc.integer({ min: 1, max: 500 }),
          optionGroups: fc.constant([]) as any,
          addons: fc.constant([]) as any,
        }) as fc.Arbitrary<MealItem>,
        fc.integer({ min: 1, max: 99 }),
        (meal: MealItem, quantity: number) => {
          const subtotal = calculateMealSubtotal(meal, quantity);
          
          // 驗證：小計 = 單價 × 數量
          expect(subtotal).toBe(meal.price * quantity);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return 0 when meal is null', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 99 }),
        (quantity: number) => {
          const subtotal = calculateMealSubtotal(null, quantity);
          
          // 驗證：沒有餐點時小計為 0
          expect(subtotal).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return meal price when quantity is 1', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string(),
          name: fc.string(),
          price: fc.integer({ min: 1, max: 500 }),
          optionGroups: fc.constant([]) as any,
          addons: fc.constant([]) as any,
        }) as fc.Arbitrary<MealItem>,
        (meal: MealItem) => {
          const subtotal = calculateMealSubtotal(meal, 1);
          
          // 驗證：數量為 1 時，小計等於單價
          expect(subtotal).toBe(meal.price);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('calculations - Property 3: Total calculation correctness', () => {
  it('should calculate total as meal subtotal + addon total for any inputs', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string(),
          name: fc.string(),
          price: fc.integer({ min: 1, max: 500 }),
          optionGroups: fc.constant([]) as any,
          addons: fc.constant([]) as any,
        }) as fc.Arbitrary<MealItem>,
        fc.array(
          fc.record({
            id: fc.string(),
            name: fc.string(),
            price: fc.integer({ min: 1, max: 100 }),
          }) as fc.Arbitrary<MealItem>,
          { maxLength: 5 }
        ),
        fc.integer({ min: 1, max: 99 }),
        (meal: MealItem, addons: AddonItem[], quantity: number) => {
          const total = calculateTotal(meal, addons, quantity);
          const mealSubtotal = meal.price * quantity;
          const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
          
          // 驗證：總計 = 餐點小計 + 加購總價
          expect(total).toBe(mealSubtotal + addonsTotal);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return 0 when meal is null regardless of addons', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string(),
            name: fc.string(),
            price: fc.integer({ min: 1, max: 100 }),
          }) as fc.Arbitrary<MealItem>,
          { maxLength: 5 }
        ),
        fc.integer({ min: 1, max: 99 }),
        (addons: AddonItem[], quantity: number) => {
          const total = calculateTotal(null, addons, quantity);
          
          // 驗證：沒有餐點時總計為 0
          expect(total).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('calculations - Property 5: Addon independence from meal quantity', () => {
  it('should keep addon total unchanged when meal quantity changes', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string(),
          name: fc.string(),
          price: fc.integer({ min: 1, max: 500 }),
          optionGroups: fc.constant([]) as any,
          addons: fc.constant([]) as any,
        }) as fc.Arbitrary<MealItem>,
        fc.array(
          fc.record({
            id: fc.string(),
            name: fc.string(),
            price: fc.integer({ min: 1, max: 100 }),
          }) as fc.Arbitrary<MealItem>,
          { maxLength: 5 }
        ),
        fc.integer({ min: 1, max: 99 }),
        fc.integer({ min: 1, max: 99 }),
        (meal: MealItem, addons: AddonItem[], quantity1: number, quantity2: number) => {
          const total1 = calculateTotal(meal, addons, quantity1);
          const total2 = calculateTotal(meal, addons, quantity2);
          
          const addonsTotal = calculateAddonsTotal(addons);
          
          // 驗證：兩次計算的加購總價應該相同
          const addonsPart1 = total1 - (meal.price * quantity1);
          const addonsPart2 = total2 - (meal.price * quantity2);
          
          expect(addonsPart1).toBe(addonsTotal);
          expect(addonsPart2).toBe(addonsTotal);
          expect(addonsPart1).toBe(addonsPart2);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should calculate addon total independently of meal', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string(),
            name: fc.string(),
            price: fc.integer({ min: 1, max: 100 }),
          }) as fc.Arbitrary<MealItem>,
          { maxLength: 5 }
        ),
        (addons: AddonItem[]) => {
          const addonsTotal = calculateAddonsTotal(addons);
          const expectedTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
          
          // 驗證：加購總價只與加購項目有關
          expect(addonsTotal).toBe(expectedTotal);
        }
      ),
      { numRuns: 100 }
    );
  });
});
