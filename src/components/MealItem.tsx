/**
 * 餐點項目元件
 * 顯示單個餐點的資訊，包含名稱、價格、數量選擇器和選擇狀態
 */

import type { MealItem as MealItemType } from '../types';
import { formatCurrency, calculateMealSubtotal } from '../utils/calculations';
import QuantitySelector from './QuantitySelector';

interface MealItemProps {
  meal: MealItemType;
  isSelected: boolean;
  quantity: number;
  onSelect: (meal: MealItemType) => void;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
}

export default function MealItem({ 
  meal, 
  isSelected, 
  quantity,
  onSelect, 
  onIncrementQuantity,
  onDecrementQuantity 
}: MealItemProps) {
  const subtotal = calculateMealSubtotal(meal, quantity);

  return (
    <div
      className={`
        group relative w-full p-6 rounded-2xl transition-all duration-300 border-2
        ${
          isSelected
            ? 'bg-gradient-to-br from-[#6B7C6E] to-[#5a6b5d] shadow-2xl scale-[1.02] border-[#6B7C6E]'
            : 'bg-white hover:shadow-xl hover:scale-[1.01] shadow-lg border-gray-200 hover:border-[#6B7C6E]/50'
        }
      `}
    >
      {/* 選擇按鈕區域 */}
      <button
        onClick={() => onSelect(meal)}
        className="absolute inset-0 w-full h-full rounded-2xl"
        aria-label={`選擇 ${meal.name}`}
      />

      {/* 選擇指示器 - 右上角 */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        {isSelected ? (
          <div className="w-9 h-9 rounded-full bg-[#E8DCC4] flex items-center justify-center shadow-lg ring-2 ring-[#E8DCC4]/50">
            <svg
              className="w-5 h-5 text-[#6B7C6E]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full border-2 border-gray-300 group-hover:border-[#6B7C6E] group-hover:bg-[#E8DCC4]/20 transition-all"></div>
        )}
      </div>

      {/* 餐點資訊 */}
      <div className="relative text-left pr-12 pointer-events-none">
        <h3
         className={`
            text-lg sm:text-xl font-bold mb-3 leading-tight
            ${isSelected ? 'text-white' : 'text-gray-900'}
          `} 
        >
          {meal.name}
        </h3>
        <div className={`
          inline-flex items-center px-4 py-2.5 rounded-full font-bold text-base shadow-sm
          ${isSelected ? 'bg-[#E8DCC4]/30 backdrop-blur-sm text-[#E8DCC4] ring-1 ring-[#E8DCC4]/30' : 'bg-[#E8DCC4]/30 text-[#6B7C6E]'}
        `}>
          單價：{formatCurrency(meal.price)}
        </div>
      </div>

      {/* 數量選擇器 - 只在選中時顯示 */}
      {isSelected && (
        <div className="relative mt-6 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col items-center space-y-4">
            <QuantitySelector
              quantity={quantity}
              onIncrement={onIncrementQuantity}
              onDecrement={onDecrementQuantity}
              isDisabled={false}
            />
            
            {/* 小計顯示 */}
            <div className="w-full p-4 rounded-xl bg-[#E8DCC4]/30 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#E8DCC4]">
                  {formatCurrency(meal.price)} × {quantity}
                </span>
                <span className="text-lg font-bold text-[#E8DCC4]">
                  = {formatCurrency(subtotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
