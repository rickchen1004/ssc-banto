import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import OrderPage from './pages/OrderPage';
import ImporterPage from './pages/ImporterPage';
import AdminPage from './pages/AdminPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 主頁面：學生訂餐 */}
        <Route path="/" element={<OrderPage />} />

        {/* 管理員儀表板 */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 管理員頁面：餐廳管理 */}
        <Route path="/admin/restaurants" element={<AdminPage />} />

        {/* 管理員頁面：菜單匯入工具 */}
        <Route path="/admin/importer" element={<ImporterPage />} />
      </Routes>

      {/* 管理員連結（隱藏在頁面底部） */}
      <AdminLink />
    </BrowserRouter>
  );
}

/**
 * 管理員連結元件
 * 顯示在頁面底部，僅供管理員使用
 */
function AdminLink() {
  return (
    <div className="fixed bottom-4 right-4 z-10">
      <Link
        to="/admin"
        className="inline-flex items-center px-3 py-2 text-xs text-gray-500 hover:text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all"
        title="管理員專用"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        管理
      </Link>
    </div>
  );
}

export default App;
