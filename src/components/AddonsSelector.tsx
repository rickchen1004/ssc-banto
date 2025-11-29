/**
 * 加購項目選擇器元件
 * 顯示餐點的加購項目列表（多選）
 */

import type { AddonItem } from '../types';
import AddonCheckbox from './AddonCheckbox';
import { formatCurrency } from '../utils/calculations';

interface AddonsSelectorProps {
  addons: AddonItem[];
  selectedAddons: AddonItem[];
  isDisabled: boolean;
  onToggleAddon: (addon: AddonItem) => void;
}

export default function AddonsSelector({
  addons,
  selectedAddons,
  isDisabled,
  onToggleAddon,
}: AddonsSelectorProps) {
  // 如果沒有加購項目，不顯示此元件
  if (addons.length === 0) {
    return null;
  }

  // 計算加購項目總金額
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

  return (
    <div className="w-full">
      {/* 標題 */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#A8B5A7] to-[#8B9D8A] rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-[#E8DCC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">加購項目</h2>
        </div>
        <p className="text-gray-600">
          {isDisabled
            ? '請先選擇餐點'
            : '可選擇多個加購項目（選填）'}
        </p>
      </div>

      {/* 加購項目列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addons.map((addon) => (
          <AddonCheckbox
            key={addon.id}
            addon={addon}
            isSelected={selectedAddons.some((a) => a.id === addon.id)}
            isDisabled={isDisabled}
            onToggle={onToggleAddon}
          />
        ))}
      </div>

      {/* 已選擇提示 */}
      {!isDisabled && selectedAddons.length > 0 && (
        <div className="mt-5 p-5 bg-gradient-to-r from-[#E8DCC4]/30 to-[#E8DCC4]/50 rounded-2xl border-2 border-[#6B7C6E]/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#6B7C6E] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#E8DCC4]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-[#6B7C6E] font-semibold">
                已選 {selectedAddons.length} 項加購
              </p>
            </div>
            <p className="text-xl font-bold text-[#6B7C6E]">
              +{formatCurrency(addonsTotal)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
