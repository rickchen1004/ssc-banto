import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PasswordDialog from '../components/PasswordDialog';

interface Restaurant {
  name: string;
  menuImageUrl: string;
  enabled: boolean;
}

/**
 * 管理員頁面 - 控制餐廳開關
 */
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // 檢查驗證狀態
  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 載入餐廳列表
  useEffect(() => {
    if (isAuthenticated) {
      loadRestaurants();
    }
  }, [isAuthenticated]);

  const loadRestaurants = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      if (!apiUrl) {
        throw new Error('未設定 API URL');
      }

      const response = await fetch(`${apiUrl}?action=getRestaurants`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '載入餐廳列表失敗');
      }

      setRestaurants(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRestaurant = async (restaurantName: string) => {
    setIsSaving(true);
    setNotification({ type: null, message: '' });

    try {
      const apiUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      if (!apiUrl) {
        throw new Error('未設定 API URL');
      }

      // 使用 GET 請求避免 CORS 問題
      const url = `${apiUrl}?action=toggleRestaurant&restaurantName=${encodeURIComponent(restaurantName)}`;
      const response = await fetch(url);

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '更新失敗');
      }

      // 更新本地狀態
      setRestaurants((prev) =>
        prev.map((r) =>
          r.name === restaurantName ? { ...r, enabled: !r.enabled } : { ...r, enabled: false }
        )
      );

      setNotification({
        type: 'success',
        message: '更新成功',
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : '更新失敗',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  // 如果未驗證，顯示密碼對話框
  if (!isAuthenticated) {
    return <PasswordDialog onAuthenticated={handleAuthenticated} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">載入失敗</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadRestaurants}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              重試
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* 標題列 */}
        <div className="mb-6 text-center relative">
          <h1 className="text-2xl font-bold text-gray-900">餐廳管理</h1>
          <p className="text-sm text-gray-600 mt-1">控制今日開放點餐的餐廳</p>
          <Link
            to="/admin"
            className="absolute right-0 top-0 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:shadow-sm transition-all"
          >
            返回管理台
          </Link>
        </div>

        {/* 通知訊息 */}
        {notification.type && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              notification.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {notification.type === 'success' ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                )}
              </svg>
              {notification.message}
            </div>
          </div>
        )}

        {/* 餐廳列表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-left">餐廳列表</h2>
            
            {restaurants.length === 0 ? (
              <p className="text-gray-500 text-center py-8">目前沒有餐廳資料</p>
            ) : (
              <div className="space-y-3">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.name}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-h-[100px]"
                  >
                    {/* 餐廳縮圖 */}
                    {restaurant.menuImageUrl && (
                      <div className="flex-shrink-0 flex items-center">
                        <img
                          src={restaurant.menuImageUrl}
                          alt={restaurant.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            // 圖片載入失敗時顯示預設圖示
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    {/* 餐廳資訊 */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center py-2 text-left">
                      <h3 className="font-semibold text-lg text-gray-900 leading-tight text-left">{restaurant.name}</h3>
                      {restaurant.menuImageUrl && (
                        <p className="text-xs text-gray-500 truncate mt-1.5 leading-tight text-left">
                          {restaurant.menuImageUrl}
                        </p>
                      )}
                    </div>
                    
                    {/* 開關按鈕 */}
                    <div className="flex-shrink-0 flex items-center">
                      <button
                        onClick={() => toggleRestaurant(restaurant.name)}
                        disabled={isSaving}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          restaurant.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={restaurant.enabled ? '點擊關閉' : '點擊啟用'}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                            restaurant.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 說明 */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-2">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-medium text-sm text-blue-800">使用說明</p>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>同一時間只能啟用一家餐廳</li>
              <li>啟用新餐廳會自動關閉其他餐廳</li>
              <li>關閉所有餐廳時，學生端會顯示「尚未開放點餐」</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
