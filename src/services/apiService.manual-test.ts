/**
 * API 服務測試
 * 這個檔案用於手動測試 API 服務是否正常運作
 */

import { fetchConfiguration, submitOrder } from './apiService';
import type { Order } from '../types';

/**
 * 測試讀取設定資料
 */
export async function testFetchConfiguration() {
  console.log('========================================');
  console.log('測試 fetchConfiguration');
  console.log('========================================');
  
  try {
    const config = await fetchConfiguration();
    
    console.log('✅ 讀取設定成功！');
    console.log('');
    console.log('餐廳名稱:', config.restaurantName);
    console.log('菜單圖片:', config.menuImageUrl);
    console.log('餐點數量:', config.meals.length);
    console.log('');
    
    config.meals.forEach((meal, index) => {
      console.log(`餐點 ${index + 1}: ${meal.name} (NT$ ${meal.price})`);
      console.log(`  備註選項: ${meal.options.join(', ')}`);
      console.log(`  加購項目: ${meal.addons.map(a => `${a.name} (NT$ ${a.price})`).join(', ')}`);
      console.log('');
    });
    
    return config;
  } catch (error) {
    console.error('❌ 讀取設定失敗:', error);
    throw error;
  }
}

/**
 * 測試提交訂單
 */
export async function testSubmitOrder() {
  console.log('========================================');
  console.log('測試 submitOrder');
  console.log('========================================');
  
  // 建立測試訂單
  const testOrder: Order = {
    restaurantName: '美味麵館',
    studentName: '前端測試學生',
    mealId: 'meal_001',
    mealName: '紅燒牛肉麵',
    mealPrice: 80,
    selectedOptions: ['加辣', '粗麵'],
    selectedAddons: [
      { id: 'addon_001', name: '加麵', price: 10 },
      { id: 'addon_002', name: '焗烤', price: 20 }
    ],
    totalAmount: 110,
    timestamp: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
  };
  
  console.log('測試訂單資料:');
  console.log(JSON.stringify(testOrder, null, 2));
  console.log('');
  
  try {
    const result = await submitOrder(testOrder);
    
    console.log('✅ 提交訂單成功！');
    console.log('回應訊息:', result.message);
    console.log('');
    console.log('請到 Google Sheet 的「訂單」工作表查看新增的訂單記錄');
    
    return result;
  } catch (error) {
    console.error('❌ 提交訂單失敗:', error);
    throw error;
  }
}

/**
 * 執行所有測試
 */
export async function runAllTests() {
  console.log('');
  console.log('🧪 開始執行 API 服務測試');
  console.log('');
  
  try {
    // 測試 1: 讀取設定
    await testFetchConfiguration();
    
    console.log('');
    console.log('⏳ 等待 2 秒後測試提交訂單...');
    console.log('');
    
    // 等待 2 秒
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 測試 2: 提交訂單
    await testSubmitOrder();
    
    console.log('');
    console.log('========================================');
    console.log('🎉 所有測試通過！');
    console.log('========================================');
    
  } catch (error) {
    console.log('');
    console.log('========================================');
    console.log('❌ 測試失敗');
    console.log('========================================');
    throw error;
  }
}
