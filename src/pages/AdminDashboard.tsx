import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PasswordDialog from '../components/PasswordDialog';

/**
 * 管理員儀表板 - 統一的管理入口
 */
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 檢查 sessionStorage 中的驗證狀態
  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <PasswordDialog onAuthenticated={handlePasswordSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* 標題 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">管理員控制台</h1>
          <p className="text-gray-600">選擇要執行的管理功能</p>
        </div>

        {/* 功能卡片 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 餐廳管理 */}
          <Link
            to="/admin/restaurants"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-8 border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">餐廳管理</h2>
                <p className="text-sm text-gray-600">
                  控制今日開放點餐的餐廳
                  <br />
                  開啟或關閉餐廳供應
                </p>
              </div>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                進入管理
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* 菜單匯入 */}
          <Link
            to="/admin/importer"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-8 border-2 border-transparent hover:border-purple-500"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">菜單匯入</h2>
                <p className="text-sm text-gray-600">
                  從 JSON 檔案匯入菜單資料
                  <br />
                  新增或更新餐廳菜單
                </p>
              </div>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                進入匯入
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* 返回首頁 */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:shadow-sm transition-all"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
