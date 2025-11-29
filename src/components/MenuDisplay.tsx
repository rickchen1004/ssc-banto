/**
 * 菜單顯示元件
 * 顯示餐廳的菜單圖片，包含載入狀態和錯誤處理
 */

import { useState } from 'react';

interface MenuDisplayProps {
  menuImageUrl: string;
  restaurantName: string;
  isLoading?: boolean;
  onRetry?: () => void;
}

export default function MenuDisplay({
  menuImageUrl,
  restaurantName,
  isLoading = false,
  onRetry,
}: MenuDisplayProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  /**
   * 處理圖片載入錯誤
   */
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  /**
   * 處理圖片載入成功
   */
  const handleImageLoad = () => {
    setImageError(false);
    setImageLoading(false);
  };

  /**
   * 重新載入圖片
   */
  const handleRetry = () => {
    setImageError(false);
    setImageLoading(true);
    if (onRetry) {
      onRetry();
    }
  };

  // 載入中狀態
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-sm font-medium">載入菜單中...</p>
        </div>
      </div>
    );
  }

  // 圖片載入錯誤狀態
  if (imageError) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-red-600">
            <svg
              className="w-16 h-16"
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
          </div>
          <p className="text-gray-900 font-semibold text-base">菜單圖片載入失敗</p>
          <p className="text-gray-600 text-sm">請檢查網路連線或圖片網址</p>
          <button
            onClick={handleRetry}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* 標題 */}
      <div className="relative px-6 py-6 bg-gradient-to-r from-[#6B7C6E] via-[#5a6b5d] to-[#6B7C6E] overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#E8DCC4]/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-[#E8DCC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#E8DCC4] tracking-tight">
              {restaurantName}
            </h2>
            <p className="text-[#E8DCC4]/80 text-sm font-medium mt-0.5">今日精選菜單</p>
          </div>
        </div>
      </div>

      {/* 菜單圖片 */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white p-6">
        {/* 圖片載入中的佔位符 */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-sm text-gray-600 font-medium">載入中...</p>
            </div>
          </div>
        )}

        {/* 實際圖片 - 可點擊放大 */}
        <div 
          className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
          onClick={() => setIsImageModalOpen(true)}
        >
          <img
            src={menuImageUrl}
            alt={`${restaurantName}菜單`}
            className={`w-full h-auto object-contain transition-all duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            } group-hover:scale-105`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ maxHeight: '65vh' }}
          />
          {/* 放大提示 */}
          {!imageLoading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 圖片放大 Modal */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          {/* 關閉按鈕 */}
          <button
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            onClick={() => setIsImageModalOpen(false)}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 放大的圖片 */}
          <div className="max-w-7xl max-h-[90vh] overflow-auto">
            <img
              src={menuImageUrl}
              alt={`${restaurantName}菜單 - 放大檢視`}
              className="w-full h-auto object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* 提示文字 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <p className="text-white text-sm font-medium">點擊任意處關閉</p>
          </div>
        </div>
      )}
    </div>
  );
}
