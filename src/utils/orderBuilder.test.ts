/**
 * Unit tests for orderBuilder
 */

import { describe, it, expect } from 'vitest';
import { buildOrderData } from './orderBuilder';
import type { MealItem, AddonItem } from '../types';

describe('buildOrderData', () => {
  const mockMeal: MealItem = {
    id: 'meal_001',
    name: '雞腿便當',
    price: 80,
    optionGroups: [],
    addons: [],
  };

  const mockAddons: AddonItem[] = [
    { id: 'addon_001', name: '加蛋', price: 10 },
    { id: 'addon_002', name: '加飲料', price: 15 },
  ];

  it('should build order data with quantity 1', () => {
    const order = buildOrderData(
      '美味便當',
      '王小明',
      mockMeal,
      [],
      [],
      1,
      80
    );

    expect(order.mealQuantity).toBe(1);
    expect(order.mealSubtotal).toBe(80);
    expect(order.addonsTotal).toBe(0);
    expect(order.totalAmount).toBe(80);
  });

  it('should build order data with quantity greater than 1', () => {
    const order = buildOrderData(
      '美味便當',
      '王小明',
      mockMeal,
      [],
      [],
      3,
      240
    );

    expect(order.mealQuantity).toBe(3);
    expect(order.mealSubtotal).toBe(240);  // 80 × 3
    expect(order.addonsTotal).toBe(0);
    expect(order.totalAmount).toBe(240);
  });

  it('should calculate meal subtotal correctly', () => {
    const order = buildOrderData(
      '美味便當',
      '王小明',
      mockMeal,
      [],
      [],
      5,
      400
    );

    expect(order.mealSubtotal).toBe(400);  // 80 × 5
  });

  it('should calculate addons total independently of meal quantity', () => {
    const order = buildOrderData(
      '美味便當',
      '王小明',
      mockMeal,
      [],
      mockAddons,
      3,
      265
    );

    expect(order.mealQuantity).toBe(3);
    expect(order.mealSubtotal).toBe(240);  // 80 × 3
    expect(order.addonsTotal).toBe(25);    // 10 + 15 (不受數量影響)
    expect(order.totalAmount).toBe(265);   // 240 + 25
  });

  it('should include all order fields', () => {
    const order = buildOrderData(
      '美味便當',
      '王小明',
      mockMeal,
      ['加辣', '粗麵'],
      mockAddons,
      2,
      185
    );

    expect(order.restaurantName).toBe('美味便當');
    expect(order.studentName).toBe('王小明');
    expect(order.mealId).toBe('meal_001');
    expect(order.mealName).toBe('雞腿便當');
    expect(order.mealPrice).toBe(80);
    expect(order.mealQuantity).toBe(2);
    expect(order.mealSubtotal).toBe(160);
    expect(order.selectedOptions).toEqual(['加辣', '粗麵']);
    expect(order.selectedAddons).toEqual(mockAddons);
    expect(order.addonsTotal).toBe(25);
    expect(order.totalAmount).toBe(185);
    expect(order.timestamp).toBeDefined();
  });

  it('should trim student name', () => {
    const order = buildOrderData(
      '美味便當',
      '  王小明  ',
      mockMeal,
      [],
      [],
      1,
      80
    );

    expect(order.studentName).toBe('王小明');
  });

  it('should handle empty addons', () => {
    const order = buildOrderData(
      '美味便當',
      '王小明',
      mockMeal,
      [],
      [],
      2,
      160
    );

    expect(order.addonsTotal).toBe(0);
    expect(order.selectedAddons).toEqual([]);
  });

  it('should handle empty options', () => {
    const order = buildOrderData(
      '美味便當',
      '王小明',
      mockMeal,
      [],
      mockAddons,
      1,
      105
    );

    expect(order.selectedOptions).toEqual([]);
  });
});
