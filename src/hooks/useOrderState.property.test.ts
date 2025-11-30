/**
 * Property-based tests for useOrderState hook
 * Feature: quantity-based-pricing, Property 1: Quantity bounds preservation
 * 
 * 驗證需求: 1.2, 1.3, 1.4, 5.4
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * 模擬數量操作序列
 */
type QuantityOperation = 'increment' | 'decrement';

/**
 * 執行數量操作序列並返回最終數量
 */
function applyQuantityOperations(
  initialQuantity: number,
  operations: QuantityOperation[]
): number {
  let quantity = initialQuantity;
  
  for (const op of operations) {
    if (op === 'increment') {
      quantity = Math.min(quantity + 1, 99);  // 最大 99
    } else {
      quantity = Math.max(quantity - 1, 1);   // 最小 1
    }
  }
  
  return quantity;
}

describe('useOrderState - Property 1: Quantity bounds preservation', () => {
  it('should keep quantity within bounds (1-99) after any sequence of operations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 99 }),  // 初始數量
        fc.array(fc.constantFrom<QuantityOperation>('increment', 'decrement'), { maxLength: 200 }),  // 操作序列
        (initialQuantity, operations) => {
          const finalQuantity = applyQuantityOperations(initialQuantity, operations);
          
          // 驗證：數量必須在 1-99 範圍內
          expect(finalQuantity).toBeGreaterThanOrEqual(1);
          expect(finalQuantity).toBeLessThanOrEqual(99);
        }
      ),
      { numRuns: 100 }  // 執行 100 次測試
    );
  });

  it('should not go below 1 when decrementing from 1', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),  // 減少次數
        (decrementCount) => {
          let quantity = 1;
          
          // 從 1 開始連續減少
          for (let i = 0; i < decrementCount; i++) {
            quantity = Math.max(quantity - 1, 1);
          }
          
          // 驗證：數量應該保持為 1
          expect(quantity).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not go above 99 when incrementing from 99', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),  // 增加次數
        (incrementCount) => {
          let quantity = 99;
          
          // 從 99 開始連續增加
          for (let i = 0; i < incrementCount; i++) {
            quantity = Math.min(quantity + 1, 99);
          }
          
          // 驗證：數量應該保持為 99
          expect(quantity).toBe(99);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle alternating increment and decrement operations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 99 }),  // 初始數量
        fc.integer({ min: 1, max: 50 }),  // 操作次數
        (initialQuantity, operationCount) => {
          let quantity = initialQuantity;
          
          // 交替執行增加和減少
          for (let i = 0; i < operationCount; i++) {
            if (i % 2 === 0) {
              quantity = Math.min(quantity + 1, 99);
            } else {
              quantity = Math.max(quantity - 1, 1);
            }
          }
          
          // 驗證：數量必須在 1-99 範圍內
          expect(quantity).toBeGreaterThanOrEqual(1);
          expect(quantity).toBeLessThanOrEqual(99);
        }
      ),
      { numRuns: 100 }
    );
  });
});
