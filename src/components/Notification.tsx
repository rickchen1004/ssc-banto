/**
 * Notification 元件
 * 顯示成功或錯誤訊息，支援自動隱藏和手動關閉
 */

import { useEffect } from 'react';

export interface NotificationProps {
  type: 'success' | 'error' | null;
  message: string;
  onClose: () => void;
  autoHideDuration?: number; // 自動隱藏時間（毫秒），預設 5000ms
}

export default function Notification({
  type,
  message,
  onClose,
  autoHideDuration = 5000,
}: NotificationProps) {
  // 自動隱藏邏輯
  useEffect(() => {
    if (type && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      // 清理計時器
      return () => clearTimeout(timer);
    }
  }, [type, message, autoHideDuration, onClose]);

  // 如果沒有訊息，不顯示
  if (!type) {
    return null;
  }

  return (
    <div
      className={`
        fixed bottom-6 right-6 max-w-md w-[calc(100%-3rem)]
        rounded-2xl shadow-2xl p-5 backdrop-blur-sm
        transform transition-all duration-300
        ${
          type === 'success'
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
            : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
        }
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {/* 成功圖示 */}
          {type === 'success' ? (
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : (
            /* 錯誤圖示 */
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          <div>
            <p className="font-semibold text-base mb-1">
              {type === 'success' ? '訂單成功' : '發生錯誤'}
            </p>
            <p className="text-sm text-white/90">{message}</p>
          </div>
        </div>
        
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 text-white/80 hover:text-white transition-colors"
          aria-label="關閉通知"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
