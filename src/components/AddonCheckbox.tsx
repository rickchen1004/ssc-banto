/**
 * 加購項目複選框元件
 * 顯示單個加購項目的複選框，包含名稱和價格
 */

import type { AddonItem } from '../types';
import { formatCurrency } from '../utils/calculations';

interface AddonCheckboxProps {
  addon: AddonItem;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (addon: AddonItem) => void;
}

export default function AddonCheckbox({
  addon,
  isSelected,
  isDisabled,
  onToggle,
}: AddonCheckboxProps) {
  return (
    <button
      onClick={() => !isDisabled && onToggle(addon)}
      disabled={isDisabled}
      className={`
        w-full p-5 rounded-2xl transition-all duration-300 border-2
        ${isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
        ${
          isSelected
            ? 'bg-gradient-to-br from-[#8B9D8A] to-[#6B7C6E] shadow-xl scale-[1.02] border-[#6B7C6E]'
            : 'bg-white hover:shadow-lg shadow-md border-gray-200 hover:border-[#8B9D8A]/50'
        }
      `}
    >
      <div className="relative flex items-center justify-between">
        {/* 左側：複選框和名稱 */}
        <div className="flex items-center space-x-3">
          {/* 複選框 */}
          <div
            className={`
              w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
              ${
                isSelected
                  ? 'bg-[#E8DCC4]/30 ring-1 ring-[#E8DCC4]/50'
                  : 'bg-gray-100 border border-gray-300'
              }
            `}
          >
            {isSelected && (
              <svg
                className="w-4 h-4 text-[#E8DCC4]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          {/* 加購名稱 */}
          <span
            className={`
              text-sm sm:text-base font-bold
              ${isSelected ? 'text-[#E8DCC4]' : 'text-gray-900'}
            `}
          >
            {addon.name}
          </span>
        </div>

        {/* 右側：價格 */}
        <span
          className={`
            text-base font-bold px-3 py-1.5 rounded-lg
            ${isSelected ? 'text-[#E8DCC4] bg-[#E8DCC4]/20' : 'text-[#6B7C6E] bg-[#E8DCC4]/40'}
          `}
        >
          +{formatCurrency(addon.price)}
        </span>
      </div>
    </button>
  );
}
