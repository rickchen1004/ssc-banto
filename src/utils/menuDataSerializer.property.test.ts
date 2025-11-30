import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  serializeOptionGroups,
  deserializeOptionGroups,
  serializeAddons,
  deserializeAddons
} from './menuDataSerializer';

/**
 * Feature: json-to-sheets-importer, Property 2: optionGroups 序列化的 round-trip 一致性
 * 對於任意 optionGroups 巢狀陣列，序列化為 JSON 字串後再反序列化，應該得到與原始值相等的結構
 * Validates: Requirements 1.3, 6.2, 6.4
 */
describe('Property 2: optionGroups 序列化的 round-trip 一致性', () => {
  it('should maintain consistency after serialize and deserialize round-trip', () => {
    fc.assert(
      fc.property(
        // Generate random optionGroups
        fc.array(
          fc.array(
            fc.string({ minLength: 1, maxLength: 50 }),
            { minLength: 1, maxLength: 10 }
          ),
          { maxLength: 10 }
        ),
        (optionGroups) => {
          // Serialize then deserialize
          const serialized = serializeOptionGroups(optionGroups);
          const deserialized = deserializeOptionGroups(serialized);
          
          // Should be equal to original
          expect(deserialized).toEqual(optionGroups);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('should handle empty optionGroups', () => {
    const empty: string[][] = [];
    const serialized = serializeOptionGroups(empty);
    const deserialized = deserializeOptionGroups(serialized);
    
    expect(deserialized).toEqual(empty);
    expect(serialized).toBe('[]');
  });
  
  it('should handle optionGroups with special characters', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.array(
            fc.string({ minLength: 1, maxLength: 50 }),
            { minLength: 1, maxLength: 5 }
          ),
          { maxLength: 5 }
        ),
        (optionGroups) => {
          const serialized = serializeOptionGroups(optionGroups);
          const deserialized = deserializeOptionGroups(serialized);
          
          expect(deserialized).toEqual(optionGroups);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: json-to-sheets-importer, Property 3: addons 序列化的 round-trip 一致性
 * 對於任意 addons 物件陣列，序列化為 JSON 字串後再反序列化，應該得到與原始值相等的結構
 * Validates: Requirements 1.4, 7.2, 7.4
 */
describe('Property 3: addons 序列化的 round-trip 一致性', () => {
  it('should maintain consistency after serialize and deserialize round-trip', () => {
    fc.assert(
      fc.property(
        // Generate random addons
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            price: fc.integer({ min: 0, max: 1000 })
          }),
          { maxLength: 20 }
        ),
        (addons) => {
          // Serialize then deserialize
          const serialized = serializeAddons(addons);
          const deserialized = deserializeAddons(serialized);
          
          // Should be equal to original
          expect(deserialized).toEqual(addons);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('should handle empty addons', () => {
    const empty: any[] = [];
    const serialized = serializeAddons(empty);
    const deserialized = deserializeAddons(serialized);
    
    expect(deserialized).toEqual(empty);
    expect(serialized).toBe('[]');
  });
  
  it('should handle addons with special characters in names', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            price: fc.integer({ min: 0, max: 1000 })
          }),
          { maxLength: 10 }
        ),
        (addons) => {
          const serialized = serializeAddons(addons);
          const deserialized = deserializeAddons(serialized);
          
          expect(deserialized).toEqual(addons);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('should preserve price precision', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 30 }),
            price: fc.integer({ min: 0, max: 10000 })
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (addons) => {
          const serialized = serializeAddons(addons);
          const deserialized = deserializeAddons(serialized);
          
          // Check each addon's price is preserved
          deserialized.forEach((addon, index) => {
            expect(addon.price).toBe(addons[index].price);
            expect(typeof addon.price).toBe('number');
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
