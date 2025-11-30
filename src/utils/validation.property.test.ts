/**
 * Property-based tests for validation utilities
 * Feature: quantity-based-pricing, Property 7: Quantity validation
 * 
 * 驗證需求: 5.1, 5.3, 5.4
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateQuantity, normalizeQuantity } from './validation';

describe('validation - Property 7: Quantity validation', () => {
  it('should accept all valid quantities (1-99)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 99 }),
        (quantity) => {
          const result = validateQuantity(quantity);
          
          // 驗證：1-99 範圍內的整數都應該通過驗證
          expect(result.isValid).toBe(true);
          expect(result.error).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject quantities less than 1', () => {
    fc.assert(
      fc.property(
        fc.integer({ max: 0 }),
        (quantity) => {
          const result = validateQuantity(quantity);
          
          // 驗證：小於 1 的數字應該被拒絕
          expect(result.isValid).toBe(false);
          expect(result.error).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject quantities greater than 99', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 1000 }),
        (quantity) => {
          const result = validateQuantity(quantity);
          
          // 驗證：大於 99 的數字應該被拒絕
          expect(result.isValid).toBe(false);
          expect(result.error).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject non-integer values', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1.1, max: 98.9, noNaN: true }),
        (quantity) => {
          const result = validateQuantity(quantity);
          
          // 驗證：非整數應該被拒絕
          expect(result.isValid).toBe(false);
          expect(result.error).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should normalize any quantity to valid range (1-99)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 1000 }),
        (quantity) => {
          const normalized = normalizeQuantity(quantity);
          
          // 驗證：標準化後的數量必須在 1-99 範圍內
          expect(normalized).toBeGreaterThanOrEqual(1);
          expect(normalized).toBeLessThanOrEqual(99);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should normalize quantities below 1 to 1', () => {
    fc.assert(
      fc.property(
        fc.integer({ max: 0 }),
        (quantity) => {
          const normalized = normalizeQuantity(quantity);
          
          // 驗證：小於 1 的數字應該被標準化為 1
          expect(normalized).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should normalize quantities above 99 to 99', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 1000 }),
        (quantity) => {
          const normalized = normalizeQuantity(quantity);
          
          // 驗證：大於 99 的數字應該被標準化為 99
          expect(normalized).toBe(99);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should keep valid quantities unchanged when normalizing', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 99 }),
        (quantity) => {
          const normalized = normalizeQuantity(quantity);
          
          // 驗證：有效範圍內的數字應該保持不變
          expect(normalized).toBe(quantity);
        }
      ),
      { numRuns: 100 }
    );
  });
});
