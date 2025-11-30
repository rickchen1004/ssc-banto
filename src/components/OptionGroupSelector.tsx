/**
 * 選項組選擇器元件
 * 支援多組選項，每組內單選（radio button）
 */

import OptionCheckbox from './OptionCheckbox';

interface OptionGroupSelectorProps {
  optionGroups: string[][];  // 二維陣列
  selectedOptions: string[];
  isDisabled: boolean;
  onToggleOption: (option: string, groupIndex: number) => void;
}

export default function OptionGroupSelector({
  optionGroups,
  selectedOptions,
  isDisabled,
  onToggleOption,
}: OptionGroupSelectorProps) {
  // 如果沒有任何選項組，不顯示此元件
  if (!optionGroups || optionGroups.length === 0) {
    return null;
  }

  // 渲染單一選項組（單選）
  const renderOptionGroup = (options: string[], groupIndex: number) => {
    if (!options || options.length === 0) {
      return null;
    }

    return (
      <div key={groupIndex} className="mb-6 last:mb-0">
        <div className="flex flex-wrap gap-3">
          {options.map((option) => (
            <OptionCheckbox
              key={option}
              option={option}
              isSelected={selectedOptions.includes(option)}
              isDisabled={isDisabled}
              onToggle={() => onToggleOption(option, groupIndex)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* 標題 */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8B9D8A] to-[#6B7C6E] rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-[#E8DCC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">客製化選項</h2>
        </div>
        <p className="text-gray-600">
          {isDisabled
            ? '請先選擇餐點'
            : '每組選擇一個選項（選填）'}
        </p>
      </div>

      {/* 選項組列表 */}
      <div className="space-y-6">
        {optionGroups.map((options, index) => renderOptionGroup(options, index))}
      </div>
    </div>
  );
}
