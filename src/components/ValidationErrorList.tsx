import type { ValidationError } from '../utils/menuDataValidator';

interface ValidationErrorListProps {
  errors: ValidationError[];
}

/**
 * 驗證錯誤列表元件
 * 顯示 JSON 驗證錯誤，包含欄位路徑和錯誤訊息
 */
export default function ValidationErrorList({ errors }: ValidationErrorListProps) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start mb-3">
        <svg
          className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-2">
            發現 {errors.length} 個驗證錯誤
          </h3>
          <ul className="space-y-2">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">
                <div className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    {error.path && (
                      <code className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-mono">
                        {error.path}
                      </code>
                    )}
                    <p className="text-red-700 mt-1">{error.message}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="text-xs text-red-600 mt-3 pt-3 border-t border-red-200">
        請修正上述錯誤後再嘗試匯入
      </div>
    </div>
  );
}
