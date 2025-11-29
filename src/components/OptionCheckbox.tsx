/**
 * 備註選項複選框元件
 * 顯示單個備註選項的複選框
 */

interface OptionCheckboxProps {
  option: string;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (option: string) => void;
}

export default function OptionCheckbox({
  option,
  isSelected,
  isDisabled,
  onToggle,
}: OptionCheckboxProps) {
  return (
    <button
      onClick={() => !isDisabled && onToggle(option)}
      disabled={isDisabled}
      className={`
        px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 border-2
        ${isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
        ${
          isSelected
            ? 'bg-gradient-to-r from-[#8B9D8A] to-[#6B7C6E] text-[#E8DCC4] shadow-lg scale-105 border-[#6B7C6E]'
            : 'bg-white text-gray-700 hover:shadow-md shadow-sm border-gray-200 hover:border-[#6B7C6E]/50 hover:bg-[#E8DCC4]/20'
        }
      `}
    >
      <div className="flex items-center space-x-2.5">
        {/* 複選框 */}
        <div
          className={`
            w-5 h-5 rounded-lg flex items-center justify-center transition-all
            ${
              isSelected
                ? 'bg-[#E8DCC4]/30 ring-1 ring-[#E8DCC4]/50'
                : 'bg-gray-100 border border-gray-300'
            }
          `}
        >
          {isSelected && (
            <svg
              className="w-3.5 h-3.5 text-[#E8DCC4]"
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

        {/* 選項文字 */}
        <span>{option}</span>
      </div>
    </button>
  );
}
