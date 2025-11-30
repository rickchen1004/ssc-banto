/**
 * 訂單驗證函數的單元測試
 */

import { describe, test, expect } from 'vitest';
import { validateOrder } from './validation';
import type { MealItem } from '../types';

describe('validateOrder', () => {
  // 建立測試用的餐點資料
  const mockMeal: MealItem = {
    id: 'meal_001',
    name: '紅燒牛肉麵',
    price: 80,
    optionGroups: [['加辣', '不辣'], ['粗麵', '細麵']],
    addons: [],
  };

  describe('姓名驗證', () => {
    test('應該拒絕空姓名', () => {
      const result = validateOrder('', mockMeal);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('請輸入學生姓名');
    });

    test('應該拒絕純空白字元的姓名', () => {
      const result = validateOrder('   ', mockMeal);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('姓名不能只包含空白字元');
    });

    test('應該拒絕只有 tab 和空格的姓名', () => {
      const result = validateOrder(' \t \n ', mockMeal);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('姓名不能只包含空白字元');
    });

    test('應該接受有效的姓名', () => {
      const result = validateOrder('王小明', mockMeal);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('應該接受前後有空白的有效姓名', () => {
      const result = validateOrder('  王小明  ', mockMeal);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('餐點驗證', () => {
    test('應該拒絕未選擇餐點', () => {
      const result = validateOrder('王小明', null);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('請選擇餐點');
    });

    test('應該接受已選擇餐點', () => {
      const result = validateOrder('王小明', mockMeal);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('完整驗證', () => {
    test('應該在所有條件都滿足時通過驗證', () => {
      const result = validateOrder('李小華', mockMeal);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('應該優先檢查姓名為空', () => {
      const result = validateOrder('', null);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('請輸入學生姓名');
    });

    test('應該在姓名為空白時檢查空白字元', () => {
      const result = validateOrder('   ', null);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('姓名不能只包含空白字元');
    });
  });
});
