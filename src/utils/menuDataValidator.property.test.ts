import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateMenuData } from './menuDataValidator';

/**
 * Feature: json-to-sheets-importer, Property 4: 無效 JSON 的驗證失敗
 * 對於任意無效的 JSON 字串，驗證函數應該返回失敗結果
 * Validates: Requirements 2.1
 */
describe('Property 4: 無效 JSON 的驗證失敗', () => {
  it('should fail validation for any invalid JSON string', () => {
    fc.assert(
      fc.property(
        // Generate invalid JSON strings
        fc.oneof(
          // Unclosed braces
          fc.string().map(s => '{' + s),
          // Unclosed brackets
          fc.string().map(s => '[' + s),
          // Invalid syntax with trailing comma
          fc.constant('{"key": "value",}'),
          // Single quotes instead of double quotes
          fc.constant("{'key': 'value'}"),
          // Unquoted keys
          fc.constant('{key: "value"}'),
          // Random non-JSON strings
          fc.string().filter(s => {
            try {
              JSON.parse(s);
              return false; // Valid JSON, skip
            } catch {
              return true; // Invalid JSON, use it
            }
          })
        ),
        (invalidJson) => {
          const result = validateMenuData(invalidJson);
          
          // Should fail validation
          expect(result.isValid).toBe(false);
          // Should have at least one error
          expect(result.errors.length).toBeGreaterThan(0);
          // Error should mention JSON format
          expect(result.errors[0].message).toContain('JSON 格式錯誤');
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: json-to-sheets-importer, Property 5: 缺少必要欄位的錯誤訊息
 * 對於任意缺少必要欄位的 JSON 物件，驗證函數應該返回包含該欄位名稱的錯誤訊息
 * Validates: Requirements 2.2
 */
describe('Property 5: 缺少必要欄位的錯誤訊息', () => {
  it('should return error message with field name for missing required fields', () => {
    fc.assert(
      fc.property(
        // Generate menu data with randomly missing required fields
        fc.record({
          meals: fc.array(
            fc.record({
              name: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
              price: fc.option(fc.integer({ min: 0 }), { nil: undefined }),
              optionGroups: fc.option(
                fc.array(fc.array(fc.string())),
                { nil: undefined }
              ),
              addons: fc.option(
                fc.array(
                  fc.record({
                    name: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
                    price: fc.option(fc.integer({ min: 0 }), { nil: undefined })
                  })
                ),
                { nil: undefined }
              )
            })
          )
        }),
        (menuData) => {
          const jsonString = JSON.stringify(menuData);
          const result = validateMenuData(jsonString);
          
          // Check if any required fields are missing
          let hasMissingFields = false;
          
          if (menuData.meals) {
            menuData.meals.forEach((meal, index) => {
              if (!meal.name) {
                hasMissingFields = true;
                // Should have error mentioning the missing field
                const hasError = result.errors.some(
                  e => e.path === `meals[${index}].name` && e.message.includes('缺少必要欄位')
                );
                expect(hasError).toBe(true);
              }
              
              if (meal.price === undefined || meal.price === null) {
                hasMissingFields = true;
                const hasError = result.errors.some(
                  e => e.path === `meals[${index}].price` && e.message.includes('缺少必要欄位')
                );
                expect(hasError).toBe(true);
              }
              
              if (!meal.optionGroups) {
                hasMissingFields = true;
                const hasError = result.errors.some(
                  e => e.path === `meals[${index}].optionGroups` && e.message.includes('缺少必要欄位')
                );
                expect(hasError).toBe(true);
              }
              
              if (!meal.addons) {
                hasMissingFields = true;
                const hasError = result.errors.some(
                  e => e.path === `meals[${index}].addons` && e.message.includes('缺少必要欄位')
                );
                expect(hasError).toBe(true);
              }
              
              if (meal.addons && Array.isArray(meal.addons)) {
                meal.addons.forEach((addon, addonIndex) => {
                  if (!addon.name) {
                    hasMissingFields = true;
                    const hasError = result.errors.some(
                      e => e.path === `meals[${index}].addons[${addonIndex}].name` && 
                           e.message.includes('缺少必要欄位')
                    );
                    expect(hasError).toBe(true);
                  }
                  
                  if (addon.price === undefined || addon.price === null) {
                    hasMissingFields = true;
                    const hasError = result.errors.some(
                      e => e.path === `meals[${index}].addons[${addonIndex}].price` && 
                           e.message.includes('缺少必要欄位')
                    );
                    expect(hasError).toBe(true);
                  }
                });
              }
            });
          }
          
          // If there are missing fields, validation should fail
          if (hasMissingFields) {
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: json-to-sheets-importer, Property 6: 無效資料類型的錯誤訊息
 * 對於任意包含錯誤資料類型的欄位，驗證函數應該返回包含預期類型的錯誤訊息
 * Validates: Requirements 2.3
 */
describe('Property 6: 無效資料類型的錯誤訊息', () => {
  it('should return error message with expected type for invalid data types', () => {
    fc.assert(
      fc.property(
        // Generate menu data with wrong types
        fc.record({
          meals: fc.array(
            fc.record({
              name: fc.oneof(
                fc.string({ minLength: 1 }),
                fc.integer(), // Wrong type
                fc.boolean(), // Wrong type
                fc.constant(null) // Wrong type
              ),
              price: fc.oneof(
                fc.integer({ min: 0 }),
                fc.string(), // Wrong type
                fc.boolean(), // Wrong type
                fc.constant(null) // Wrong type
              ),
              optionGroups: fc.oneof(
                fc.array(fc.array(fc.string())),
                fc.string(), // Wrong type
                fc.integer(), // Wrong type
                fc.constant(null) // Wrong type
              ),
              addons: fc.oneof(
                fc.array(
                  fc.record({
                    name: fc.oneof(
                      fc.string({ minLength: 1 }),
                      fc.integer(), // Wrong type
                      fc.constant(null) // Wrong type
                    ),
                    price: fc.oneof(
                      fc.integer({ min: 0 }),
                      fc.string(), // Wrong type
                      fc.constant(null) // Wrong type
                    )
                  })
                ),
                fc.string(), // Wrong type
                fc.integer(), // Wrong type
                fc.constant(null) // Wrong type
              )
            })
          )
        }),
        (menuData) => {
          const jsonString = JSON.stringify(menuData);
          const result = validateMenuData(jsonString);
          
          // Check for type errors
          menuData.meals.forEach((meal, index) => {
            // Check name type
            if (typeof meal.name !== 'string' || !meal.name) {
              const hasError = result.errors.some(
                e => e.path === `meals[${index}].name` && 
                     (e.message.includes('類型錯誤') || e.message.includes('缺少必要欄位'))
              );
              expect(hasError).toBe(true);
            }
            
            // Check price type
            if (typeof meal.price !== 'number') {
              const hasError = result.errors.some(
                e => e.path === `meals[${index}].price` && 
                     (e.message.includes('類型錯誤') || e.message.includes('缺少必要欄位'))
              );
              expect(hasError).toBe(true);
            }
            
            // Check optionGroups type
            if (!Array.isArray(meal.optionGroups)) {
              const hasError = result.errors.some(
                e => e.path === `meals[${index}].optionGroups` && 
                     (e.message.includes('類型錯誤') || e.message.includes('缺少必要欄位'))
              );
              expect(hasError).toBe(true);
            }
            
            // Check addons type
            if (!Array.isArray(meal.addons)) {
              const hasError = result.errors.some(
                e => e.path === `meals[${index}].addons` && 
                     (e.message.includes('類型錯誤') || e.message.includes('缺少必要欄位'))
              );
              expect(hasError).toBe(true);
            }
            
            // Check addon field types
            if (Array.isArray(meal.addons)) {
              meal.addons.forEach((addon, addonIndex) => {
                if (typeof addon.name !== 'string' || !addon.name) {
                  const hasError = result.errors.some(
                    e => e.path === `meals[${index}].addons[${addonIndex}].name` && 
                         (e.message.includes('類型錯誤') || e.message.includes('缺少必要欄位'))
                  );
                  expect(hasError).toBe(true);
                }
                
                if (typeof addon.price !== 'number') {
                  const hasError = result.errors.some(
                    e => e.path === `meals[${index}].addons[${addonIndex}].price` && 
                         (e.message.includes('類型錯誤') || e.message.includes('缺少必要欄位'))
                  );
                  expect(hasError).toBe(true);
                }
              });
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: json-to-sheets-importer, Property 14: optionGroups 類型驗證
 * 對於任意非字串陣列的陣列的 optionGroups 值，驗證應該失敗並返回類型錯誤
 * Validates: Requirements 6.1
 */
describe('Property 14: optionGroups 類型驗證', () => {
  it('should fail validation for optionGroups that are not array of string arrays', () => {
    fc.assert(
      fc.property(
        fc.record({
          meals: fc.array(
            fc.record({
              name: fc.string({ minLength: 1 }),
              price: fc.integer({ min: 0 }),
              optionGroups: fc.oneof(
                // Invalid: array of non-arrays
                fc.array(fc.oneof(fc.string(), fc.integer(), fc.boolean())),
                // Invalid: array of arrays with non-strings
                fc.array(
                  fc.array(
                    fc.oneof(fc.integer(), fc.boolean(), fc.constant(null))
                  )
                ),
                // Invalid: mixed array
                fc.array(
                  fc.oneof(
                    fc.array(fc.string()),
                    fc.string(),
                    fc.integer()
                  )
                )
              ),
              addons: fc.array(
                fc.record({
                  name: fc.string({ minLength: 1 }),
                  price: fc.integer({ min: 0 })
                })
              )
            })
          )
        }),
        (menuData) => {
          const jsonString = JSON.stringify(menuData);
          const result = validateMenuData(jsonString);
          
          // Check if optionGroups have invalid structure
          let hasInvalidOptionGroups = false;
          
          menuData.meals.forEach((meal, index) => {
            if (Array.isArray(meal.optionGroups)) {
              (meal.optionGroups as any[]).forEach((group: any, groupIndex: number) => {
                // Check if group is not an array
                if (!Array.isArray(group)) {
                  hasInvalidOptionGroups = true;
                  const hasError = result.errors.some(
                    e => e.path === `meals[${index}].optionGroups[${groupIndex}]` && 
                         e.message.includes('類型錯誤')
                  );
                  expect(hasError).toBe(true);
                } else {
                  // Check if group contains non-strings
                  group.forEach((option: any, optionIndex: number) => {
                    if (typeof option !== 'string') {
                      hasInvalidOptionGroups = true;
                      const hasError = result.errors.some(
                        e => e.path === `meals[${index}].optionGroups[${groupIndex}][${optionIndex}]` && 
                             e.message.includes('類型錯誤')
                      );
                      expect(hasError).toBe(true);
                    }
                  });
                }
              });
            }
          });
          
          // If there are invalid optionGroups, validation should fail
          if (hasInvalidOptionGroups) {
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: json-to-sheets-importer, Property 15: addons 必要欄位驗證
 * 對於任意缺少 name 或 price 欄位的 addon 物件，驗證應該失敗並返回缺少欄位的錯誤
 * Validates: Requirements 7.1
 */
describe('Property 15: addons 必要欄位驗證', () => {
  it('should fail validation for addons missing name or price fields', () => {
    fc.assert(
      fc.property(
        fc.record({
          meals: fc.array(
            fc.record({
              name: fc.string({ minLength: 1 }),
              price: fc.integer({ min: 0 }),
              optionGroups: fc.array(fc.array(fc.string())),
              addons: fc.array(
                fc.record({
                  name: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
                  price: fc.option(fc.integer({ min: 0 }), { nil: undefined })
                })
              )
            })
          )
        }),
        (menuData) => {
          const jsonString = JSON.stringify(menuData);
          const result = validateMenuData(jsonString);
          
          // Check for missing addon fields
          let hasMissingAddonFields = false;
          
          menuData.meals.forEach((meal, index) => {
            if (Array.isArray(meal.addons)) {
              meal.addons.forEach((addon, addonIndex) => {
                // Check for missing name
                if (!addon.name) {
                  hasMissingAddonFields = true;
                  const hasError = result.errors.some(
                    e => e.path === `meals[${index}].addons[${addonIndex}].name` && 
                         e.message.includes('缺少必要欄位')
                  );
                  expect(hasError).toBe(true);
                }
                
                // Check for missing price
                if (addon.price === undefined || addon.price === null) {
                  hasMissingAddonFields = true;
                  const hasError = result.errors.some(
                    e => e.path === `meals[${index}].addons[${addonIndex}].price` && 
                         e.message.includes('缺少必要欄位')
                  );
                  expect(hasError).toBe(true);
                }
              });
            }
          });
          
          // If there are missing addon fields, validation should fail
          if (hasMissingAddonFields) {
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
