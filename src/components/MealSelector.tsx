/**
 * 餐點選擇器元件
 * 顯示所有可選擇的餐點列表
 */

import type { MealItem as MealItemType } from '../types';
import MealItem from './MealItem';

interface MealSelectorProps {
  meals: MealItemType[];
  selectedMeal: MealItemType | null;
  mealQuantity: number;
  onSelectMeal: (meal: MealItemType) => void;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
}

export default function MealSelector({
  meals,
  selectedMeal,
  mealQuantity,
  onSelectMeal,
  onIncrementQuantity,
  onDecrementQuantity,
}: MealSelectorProps) {
  return (
    <div className="w-full">
      {/* 標題 */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#6B7C6E] to-[#5a6b5d] rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-[#E8DCC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">選擇主餐</h2>
        </div>
        <p className="text-gray-600">請選擇一個您想要的餐點</p>
      </div>

      {/* 餐點列表 */}
      {meals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <p className="text-gray-500">目前沒有可選擇的餐點</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meals.map((meal) => (
            <MealItem
              key={meal.id}
              meal={meal}
              isSelected={selectedMeal?.id === meal.id}
              quantity={mealQuantity}
              onSelect={onSelectMeal}
              onIncrementQuantity={onIncrementQuantity}
              onDecrementQuantity={onDecrementQuantity}
            />
          ))}
        </div>
      )}
    </div>
  );
}
