import { useState, type FormEvent } from 'react';

interface PasswordDialogProps {
  onAuthenticated: () => void;
}

/**
 * 密碼驗證對話框元件
 * 用於保護匯入工具不被未授權存取
 */
export default function PasswordDialog({ onAuthenticated }: PasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);

    // 從環境變數讀取管理員密碼
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!adminPassword) {
      setError('系統配置錯誤：未設定管理員密碼');
      setIsValidating(false);
      return;
    }

    // 驗證密碼
    if (password === adminPassword) {
      // 密碼正確，設置 sessionStorage
      sessionStorage.setItem('admin_authenticated', 'true');
      onAuthenticated();
    } else {
      // 密碼錯誤
      setError('密碼錯誤，請重試');
      setPassword('');
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            管理員驗證
          </h2>
          <p className="text-gray-600 text-sm">
            此頁面僅供管理員使用，請輸入管理員密碼以繼續
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              管理員密碼
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="請輸入密碼"
              disabled={isValidating}
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!password || isValidating}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isValidating ? '驗證中...' : '確認'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            如果您不是管理員，請關閉此頁面
          </p>
        </div>
      </div>
    </div>
  );
}
