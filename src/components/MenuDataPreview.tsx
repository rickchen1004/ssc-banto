import type { MealData } from '../services/apiService';

interface MenuDataPreviewProps {
  restaurantName: string;
  menuImageUrl: string;
  meals: MealData[];
}

/**
 * 菜單資料預覽元件
 * 以卡片形式顯示解析後的菜單資料
 */
export default function MenuDataPreview({
  restaurantName,
  menuImageUrl,
  meals,
}: MenuDataPreviewProps) {
  // 計算總加購項目數（去重）
  const uniqueAddons = new Set<string>();
  meals.forEach((meal) => {
    meal.addons.forEach((addon) => {
      uniqueAddons.add(`${addon.name}_${addon.price}`);
    });
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg
          className="w-5 h-5 text-blue-600 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        資料預覽
      </h3>

      {/* 餐廳資訊 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">餐廳資訊</h4>
        <div className="space-y-1 text-sm">
          <div className="flex">
            <span className="text-gray-600 w-24">餐廳名稱：</span>
            <span className="text-gray-900 font-medium">{restaurantName}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-24">菜單圖片：</span>
            <span className="text-gray-900">
              {menuImageUrl || '（未提供）'}
            </span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-24">餐點數量：</span>
            <span className="text-gray-900 font-medium">{meals.length} 個</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-24">加購項目：</span>
            <span className="text-gray-900 font-medium">
              {uniqueAddons.size} 個（去重後）
            </span>
          </div>
        </div>
      </div>

      {/* 餐點列表 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">餐點列表</h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {meals.map((meal, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-gray-900">{meal.name}</h5>
                <span className="text-blue-600 font-semibold">
                  ${meal.price}
                </span>
              </div>

              {meal.imageUrl && (
                <div className="text-xs text-gray-500 mb-2">
                  圖片：{meal.imageUrl}
                </div>
              )}

              {/* 選項組 */}
              {meal.optionGroups.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-600">
                    選項組：
                  </span>
                  <div className="mt-1 space-y-1">
                    {meal.optionGroups.map((group, groupIndex) => (
                      <div key={groupIndex} className="text-xs text-gray-700">
                        <span className="text-gray-500">組 {groupIndex + 1}：</span>
                        {group.join(', ')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 加購項目 */}
              {meal.addons.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-600">
                    加購項目：
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {meal.addons.map((addon, addonIndex) => (
                      <span
                        key={addonIndex}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-50 text-green-700 border border-green-200"
                      >
                        {addon.name} (+${addon.price})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
