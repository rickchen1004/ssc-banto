/**
 * 提交按鈕元件
 * 根據必填欄位狀態啟用/禁用提交按鈕
 * 提交中顯示載入指示器
 */

interface SubmitButtonProps {
  isDisabled: boolean;
  isSubmitting: boolean;
  onClick: () => void;
}

export default function SubmitButton({
  isDisabled,
  isSubmitting,
  onClick,
}: SubmitButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled || isSubmitting}
      className={`
        relative w-full py-6 px-6 rounded-3xl font-bold text-lg overflow-hidden
        transition-all duration-300 transform
        ${
          isDisabled || isSubmitting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#8B9D8A] via-[#6B7C6E] to-[#8B9D8A] text-[#E8DCC4] shadow-2xl hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98] border-2 border-[#6B7C6E]'
        }
      `}
    >
      <div className="relative">
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-3">
            <svg
              className="animate-spin h-6 w-6 text-[#E8DCC4]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>處理中...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>確認送出訂單</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
