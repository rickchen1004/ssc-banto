/**
 * 數量選擇器元件
 * 顯示 - 按鈕、數量、+ 按鈕
 */

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  isDisabled?: boolean;
}

export default function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  isDisabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      {/* 減少按鈕 */}
      <button
        onClick={onDecrement}
        disabled={isDisabled}
        className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          transition-all duration-200 border-2
          ${
            isDisabled
              ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-40'
              : 'bg-[#E8DCC4]/40 border-[#E8DCC4]/60 hover:bg-[#E8DCC4]/60 hover:border-[#E8DCC4] active:scale-95 shadow-md hover:shadow-lg'
          }
        `}
        aria-label="減少數量"
      >
        <svg
          className={`w-6 h-6 ${isDisabled ? 'text-gray-400' : 'text-[#6B7C6E]'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M20 12H4"
          />
        </svg>
      </button>

      {/* 數量顯示 */}
      <div className="flex items-center justify-center min-w-[60px]">
        <span className="text-4xl font-bold text-[#E8DCC4]">
          {quantity}
        </span>
      </div>

      {/* 增加按鈕 */}
      <button
        onClick={onIncrement}
        disabled={isDisabled}
        className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          transition-all duration-200 border-2
          ${
            isDisabled
              ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-40'
              : 'bg-[#E8DCC4]/60 border-[#E8DCC4] hover:bg-[#E8DCC4]/80 hover:border-[#E8DCC4] active:scale-95 shadow-md hover:shadow-lg'
          }
        `}
        aria-label="增加數量"
      >
        <svg
          className={`w-6 h-6 ${isDisabled ? 'text-gray-400' : 'text-[#6B7C6E]'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}
