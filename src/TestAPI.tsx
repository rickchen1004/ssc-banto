/**
 * API 測試頁面
 * 這個元件用於測試 API 服務是否正常運作
 */

import { useState } from 'react';
import { fetchConfiguration, submitOrder } from './services/apiService';
import type { Order } from './types';

export default function TestAPI() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleTestFetch = async () => {
    setLoading(true);
    setResult('測試中...');
    
    try {
      const config = await fetchConfiguration();
      setResult(`✅ 讀取設定成功！\n餐廳: ${config.restaurantName}\n餐點數量: ${config.meals.length}`);
    } catch (error) {
      setResult(`❌ 測試失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSubmit = async () => {
    setLoading(true);
    setResult('測試中...');
    
    try {
      // 建立測試訂單
      const testOrder: Order = {
        restaurantName: '測試餐廳',
        studentName: '測試學生',
        mealId: 'test_001',
        mealName: '測試餐點',
        mealPrice: 100,
        selectedOptions: ['測試選項'],
        selectedAddons: [{ id: 'addon_001', name: '測試加購', price: 20 }],
        totalAmount: 120,
        timestamp: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
      };
      
      const response = await submitOrder(testOrder);
      setResult(`✅ 提交訂單成功！\n${response.message}\n\n請到 Google Sheet 查看訂單記錄`);
    } catch (error) {
      setResult(`❌ 測試失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">API 服務測試</h1>
        
        <div className="space-y-4">
          <div>
            <button
              onClick={handleTestFetch}
              disabled={loading}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '測試中...' : '測試讀取設定 (GET)'}
            </button>
          </div>
          
          <div>
            <button
              onClick={handleTestSubmit}
              disabled={loading}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '測試中...' : '測試提交訂單 (POST)'}
            </button>
          </div>
        </div>
        
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold mb-2">測試結果：</h2>
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold mb-2">💡 說明：</h2>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>點擊「測試讀取設定」會從 Google Apps Script 讀取菜單資料</li>
            <li>點擊「測試提交訂單」會提交一筆測試訂單到 Google Sheet</li>
            <li>測試結果會顯示在下方</li>
            <li>也可以打開瀏覽器的開發者工具查看詳細的 console.log 輸出</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
