/**
 * Property-based tests for orderBuilder
 * Feature: quantity-based-pricing, Property 4: Quantity persistence in order data
 * 
 * 驗證需求: 4.1, 4.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { buildOrderData } from './orderBuilder';
import type { MealItem, AddonItem } from '../types';

describe('orderBuilder - Property 4: Quantity persistence in order data', () => {
  it('should persist meal quantity in order data for any quantity', () => {
    fc.assert(
      fc.property(
        fc.string(),  // restaurantName
        fc.string(),  // studentName
        fc.record({
          id: fc.string(),
          name: fc.string(),
          price: fc.integer({ min: 1, max: 500 }),
          optionGroups: fc.constant([]) as any,
          addons: fc.constant([]) as any,
        }) as fc.Arbitrary<MealItem>,
        fc.array(fc.string()),  // selectedOptions
        fc.array(
          fc.record({
            id: fc.string(),
            name: fc.string(),
            price: fc.integer({ min: 1, max: 100 }),
          }) as fc.Arbitrary<MealItem>,
          { maxLength: 5 }
        ),
        fc.integer({ min: 1, max: 99 }),  // mealQuantity
        (restaurantName, studentName, meal: MealItem, selectedOptions, selectedAddons: AddonItem[], mealQuantity) => {
          const totalAmount = (meal.price * mealQuantity) + selectedAddons.reduce((sum, a) => sum + a.price, 0);
          
          const order = buildOrderData(
            restaurantName,
            studentName,
            meal,
            selectedOptions,
            selectedAddons,
            mealQuantity,
            totalAmount
          );
          
          // 驗證：訂單中的數量應該與輸入的數量相同
          expect(order.mealQuantity).toBe(mealQuantity);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should calculate meal subtotal correctly in order data', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        fc.record({
          id: fc.string(),
          name: fc.string(),
          price: fc.integer({ min: 1, max: 500 }),
          optionGroups: fc.constant([]) as any,
          addons: fc.constant([]) as any,
        }) as fc.Arbitrary<MealItem>,
        fc.array(fc.string()),
        fc.array(
          fc.record({
            id: fc.string(),
            name: fc.string(),
            price: fc.integer({ min: 1, max: 100 }),
          }) as fc.Arbitrary<MealItem>,
          { maxLength: 5 }
        ),
        fc.integer({ min: 1, max: 99 }),
        (restaurantName, studentName, meal: MealItem, selectedOptions, selectedAddons: AddonItem[], mealQuantity) => {
          const totalAmount = (meal.price * mealQuantity) + selectedAddons.reduce((sum, a) => sum + a.price, 0);
          
          const order = buildOrderData(
            restaurantName,
            studentName,
            meal,
            selectedOptions,
            selectedAddons,
            mealQuantity,
            totalAmount
          );
          
          // 驗證：餐點小計 = 單價 × 數量
          expect(order.mealSubtotal).toBe(meal.price * mealQuantity);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should calculate addons total independently of meal quantity', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        fc.record({
          id: fc.string(),
          name: fc.string(),
          price: fc.integer({ min: 1, max: 500 }),
          optionGroups: fc.constant([]) as any,
          addons: fc.constant([]) as any,
        }) as fc.Arbitrary<MealItem>,
        fc.array(fc.string()),
        fc.array(
          fc.record({
            id: fc.string(),
            name: fc.string(),
            price: fc.integer({ min: 1, max: 100 }),
          }) as fc.Arbitrary<MealItem>,
          { maxLength: 5 }
        ),
        fc.integer({ min: 1, max: 99 }),
        (restaurantName, studentName, meal: MealItem, selectedOptions, selectedAddons: AddonItem[], mealQuantity) => {
          const totalAmount = (meal.price * mealQuantity) + selectedAddons.reduce((sum, a) => sum + a.price, 0);
          
          const order = buildOrderData(
            restaurantName,
            studentName,
            meal,
            selectedOptions,
            selectedAddons,
            mealQuantity,
            totalAmount
          );
          
          const expectedAddonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
          
          // 驗證：加購總價不受餐點數量影響
          expect(order.addonsTotal).toBe(expectedAddonsTotal);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain total amount as meal subtotal + addons total', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        fc.record({
          id: fc.string(),
          name: fc.string(),
          price: fc.integer({ min: 1, max: 500 }),
          optionGroups: fc.constant([]) as any,
          addons: fc.constant([]) as any,
        }) as fc.Arbitrary<MealItem>,
        fc.array(fc.string()),
        fc.array(
          fc.record({
            id: fc.string(),
            name: fc.string(),
            price: fc.integer({ min: 1, max: 100 }),
          }) as fc.Arbitrary<MealItem>,
          { maxLength: 5 }
        ),
        fc.integer({ min: 1, max: 99 }),
        (restaurantName, studentName, meal: MealItem, selectedOptions, selectedAddons: AddonItem[], mealQuantity) => {
          const totalAmount = (meal.price * mealQuantity) + selectedAddons.reduce((sum, a) => sum + a.price, 0);
          
          const order = buildOrderData(
            restaurantName,
            studentName,
            meal,
            selectedOptions,
            selectedAddons,
            mealQuantity,
            totalAmount
          );
          
          // 驗證：總金額 = 餐點小計 + 加購總價
          expect(order.totalAmount).toBe(order.mealSubtotal + order.addonsTotal);
        }
      ),
      { numRuns: 100 }
    );
  });
});
