/**
 * 金額計算和格式化工具函數
 */

import type { MealItem, AddonItem } from '../types';

/**
 * 計算總金額
 * 總金額 = 餐點價格 + 所有已選擇加購項目的價格總和
 * 
 * @param meal - 選擇的餐點（可能為 null）
 * @param selectedAddons - 已選擇的加購項目陣列
 * @returns 總金額
 */
export function calculateTotal(
  meal: MealItem | null,
  selectedAddons: AddonItem[]
): number {
  // 如果沒有選擇餐點，總金額為 0
  if (!meal) {
    return 0;
  }

  // 餐點基本價格
  const mealPrice = meal.price;

  // 計算所有加購項目的價格總和
  const addonsTotal = selectedAddons.reduce((sum, addon) => {
    return sum + addon.price;
  }, 0);

  // 回傳總金額
  return mealPrice + addonsTotal;
}

/**
 * 格式化金額為貨幣字串
 * 格式：NT$ {金額}
 * 
 * @param amount - 金額數字
 * @returns 格式化後的貨幣字串
 */
export function formatCurrency(amount: number): string {
  return `NT$ ${amount}`;
}

/**
 * 檢查加購項目是否已被選擇
 * 
 * @param addon - 要檢查的加購項目
 * @param selectedAddons - 已選擇的加購項目陣列
 * @returns 是否已選擇
 */
export function isAddonSelected(
  addon: AddonItem,
  selectedAddons: AddonItem[]
): boolean {
  return selectedAddons.some(selected => selected.id === addon.id);
}

/**
 * 切換加購項目的選擇狀態
 * 如果已選擇則移除，如果未選擇則加入
 * 
 * @param addon - 要切換的加購項目
 * @param selectedAddons - 目前已選擇的加購項目陣列
 * @returns 更新後的加購項目陣列
 */
export function toggleAddon(
  addon: AddonItem,
  selectedAddons: AddonItem[]
): AddonItem[] {
  const isSelected = isAddonSelected(addon, selectedAddons);

  if (isSelected) {
    // 如果已選擇，則移除
    return selectedAddons.filter(selected => selected.id !== addon.id);
  } else {
    // 如果未選擇，則加入
    return [...selectedAddons, addon];
  }
}

/**
 * 檢查備註選項是否已被選擇
 * 
 * @param option - 要檢查的備註選項
 * @param selectedOptions - 已選擇的備註選項陣列
 * @returns 是否已選擇
 */
export function isOptionSelected(
  option: string,
  selectedOptions: string[]
): boolean {
  return selectedOptions.includes(option);
}

/**
 * 切換備註選項的選擇狀態
 * 如果已選擇則移除，如果未選擇則加入
 * 
 * @param option - 要切換的備註選項
 * @param selectedOptions - 目前已選擇的備註選項陣列
 * @returns 更新後的備註選項陣列
 */
export function toggleOption(
  option: string,
  selectedOptions: string[]
): string[] {
  const isSelected = isOptionSelected(option, selectedOptions);

  if (isSelected) {
    // 如果已選擇，則移除
    return selectedOptions.filter(selected => selected !== option);
  } else {
    // 如果未選擇，則加入
    return [...selectedOptions, option];
  }
}
