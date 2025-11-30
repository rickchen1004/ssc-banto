import { useState, useEffect, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import PasswordDialog from '../components/PasswordDialog';
import ValidationErrorList from '../components/ValidationErrorList';
import MenuDataPreview from '../components/MenuDataPreview';
import { validateMenuData, type ValidationError } from '../utils/menuDataValidator';
import { importMenuData, type ImportMenuData, type MealData } from '../services/apiService';

/**
 * 匯入工具主頁面
 * 提供 JSON 菜單資料匯入功能，包含密碼驗證、資料驗證和預覽
 */
export default function ImporterPage() {
  // 驗證狀態
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 表單狀態
  const [restaurantName, setRestaurantName] = useState('');
  const [menuImageUrl, setMenuImageUrl] = useState('');
  const [jsonInput, setJsonInput] = useState('');

  // 驗證和預覽狀態
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [parsedData, setParsedData] = useState<{ meals: MealData[] } | null>(null);

  // UI 狀態
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // 檢查 sessionStorage 中的驗證狀態
  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 處理驗證成功
  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  // 處理 JSON 輸入變更
  const handleJsonInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);
    setImportResult(null);

    // 即時驗證
    if (value.trim()) {
      const result = validateMenuData(value);
      setValidationErrors(result.errors);

      if (result.isValid) {
        try {
          const data = JSON.parse(value);
          setParsedData(data);
        } catch {
          setParsedData(null);
        }
      } else {
        setParsedData(null);
      }
    } else {
      setValidationErrors([]);
      setParsedData(null);
    }
  };

  // 處理匯入
  const handleImport = async () => {
    // 最終驗證
    if (!restaurantName.trim()) {
      setImportResult({
        type: 'error',
        message: '請輸入餐廳名稱',
      });
      return;
    }

    if (!jsonInput.trim()) {
      setImportResult({
        type: 'error',
        message: '請輸入 JSON 資料',
      });
      return;
    }

    const validationResult = validateMenuData(jsonInput);
    if (!validationResult.isValid) {
      setImportResult({
        type: 'error',
        message: '請先修正驗證錯誤',
      });
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const data = JSON.parse(jsonInput);
      const menuData: ImportMenuData = {
        restaurantName: restaurantName.trim(),
        menuImageUrl: menuImageUrl.trim(),
        meals: data.meals,
      };

      // 調試：記錄發送的資料
      console.log('準備匯入菜單資料：', {
        restaurantName: menuData.restaurantName,
        menuImageUrl: menuData.menuImageUrl,
        mealsCount: menuData.meals.length,
      });

      const result = await importMenuData(menuData);

      setImportResult({
        type: 'success',
        message: `匯入成功！已匯入 ${result.data?.mealsImported} 個餐點和 ${result.data?.addonsImported} 個加購項目`,
      });

      // 清空表單
      setRestaurantName('');
      setMenuImageUrl('');
      setJsonInput('');
      setParsedData(null);
      setValidationErrors([]);
    } catch (error) {
      console.error('匯入失敗：', error);
      setImportResult({
        type: 'error',
        message: error instanceof Error ? error.message : '匯入失敗',
      });
    } finally {
      setIsImporting(false);
    }
  };

  // 未驗證時顯示密碼對話框
  if (!isAuthenticated) {
    return <PasswordDialog onAuthenticated={handleAuthenticated} />;
  }

  // 計算是否可以匯入
  const canImport =
    restaurantName.trim() &&
    jsonInput.trim() &&
    validationErrors.length === 0 &&
    parsedData !== null &&
    !isImporting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* 標題 */}
        <div className="mb-6 text-center relative">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            菜單資料匯入工具
          </h1>
          <p className="text-gray-600">
            將 Gemini AI 產生的 JSON 格式菜單資料匯入 Google Sheets
          </p>
          <Link
            to="/admin"
            className="absolute right-0 top-0 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:shadow-sm transition-all"
          >
            返回管理台
          </Link>
        </div>

        {/* 結果通知 */}
        {importResult && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              importResult.type === 'success'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <p
              className={`text-sm ${
                importResult.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {importResult.message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：輸入區域 */}
          <div className="space-y-6">
            {/* 餐廳資訊 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                餐廳資訊
              </h2>

              <div className="space-y-4 text-left">
                <div>
                  <label
                    htmlFor="restaurantName"
                    className="block text-sm font-medium text-gray-700 mb-1 text-left"
                  >
                    餐廳名稱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="restaurantName"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
                    placeholder="例如：美味牛肉麵"
                    disabled={isImporting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="menuImageUrl"
                    className="block text-sm font-medium text-gray-700 mb-1 text-left"
                  >
                    菜單圖片網址（選填）
                  </label>
                  <input
                    type="text"
                    id="menuImageUrl"
                    value={menuImageUrl}
                    onChange={(e) => setMenuImageUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
                    placeholder="https://example.com/menu.jpg"
                    disabled={isImporting}
                  />
                </div>
              </div>
            </div>

            {/* JSON 資料輸入 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                JSON 菜單資料 <span className="text-red-500">*</span>
              </h2>

              <textarea
                value={jsonInput}
                onChange={handleJsonInputChange}
                className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder='貼上 JSON 資料，例如：&#10;{&#10;  "meals": [&#10;    {&#10;      "name": "餐點名稱",&#10;      "price": 100,&#10;      "optionGroups": [["選項1", "選項2"]],&#10;      "addons": [{"name": "加購", "price": 10}]&#10;    }&#10;  ]&#10;}'
                disabled={isImporting}
              />

              {/* 驗證錯誤 */}
              {validationErrors.length > 0 && (
                <div className="mt-4">
                  <ValidationErrorList errors={validationErrors} />
                </div>
              )}
            </div>

            {/* 匯入按鈕 */}
            <button
              onClick={handleImport}
              disabled={!canImport}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-sm"
            >
              {isImporting ? '匯入中...' : '匯入到 Google Sheets'}
            </button>
          </div>

          {/* 右側：預覽區域 */}
          <div>
            {parsedData && parsedData.meals.length > 0 ? (
              <MenuDataPreview
                restaurantName={restaurantName || '（未填寫）'}
                menuImageUrl={menuImageUrl}
                meals={parsedData.meals}
              />
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6 h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">輸入有效的 JSON 資料後將顯示預覽</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
