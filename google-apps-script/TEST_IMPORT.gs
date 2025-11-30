/**
 * 測試菜單匯入功能
 * 
 * 使用方法：
 * 1. 在 Google Apps Script 編輯器中選擇此函數
 * 2. 點擊「執行」按鈕
 * 3. 查看執行記錄
 */
function testImportMenu() {
  Logger.log('========================================');
  Logger.log('測試菜單匯入功能');
  Logger.log('========================================');
  Logger.log('');
  
  // 建立測試匯入資料
  const testImportData = {
    action: 'import',
    data: {
      restaurantName: '測試便當店',
      menuImageUrl: 'https://example.com/menu.jpg',
      meals: [
        {
          name: '雞腿便當',
          price: 100,
          optionGroups: [],
          addons: []
        },
        {
          name: '豬排便當',
          price: 90,
          optionGroups: [],
          addons: []
        },
        {
          name: '鯖魚便當',
          price: 90,
          optionGroups: [
            ['不辣', '小辣', '中辣']
          ],
          addons: [
            { name: '加飯', price: 5 },
            { name: '滷蛋', price: 10 }
          ]
        }
      ]
    }
  };
  
  Logger.log('📝 測試匯入資料：');
  Logger.log(JSON.stringify(testImportData, null, 2));
  Logger.log('');
  
  // 模擬 POST 請求
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testImportData)
    }
  };
  
  try {
    // 執行 doPost
    Logger.log('🚀 執行 doPost...');
    const result = doPost(mockEvent);
    const response = JSON.parse(result.getContent());
    
    Logger.log('');
    Logger.log('📋 回應結果：');
    Logger.log(JSON.stringify(response, null, 2));
    Logger.log('');
    
    if (response.success) {
      Logger.log('✅ 測試成功！');
      Logger.log('');
      Logger.log('📊 匯入統計：');
      Logger.log('  餐廳名稱: ' + response.data.restaurantName);
      Logger.log('  餐點數量: ' + response.data.mealsImported);
      Logger.log('  加購數量: ' + response.data.addonsImported);
      Logger.log('');
      Logger.log('請到 Google Sheet 查看匯入的資料：');
      Logger.log('  - 設定工作表：查看餐廳設定');
      Logger.log('  - 餐點工作表：查看餐點資料');
      Logger.log('  - 加購工作表：查看加購資料');
    } else {
      Logger.log('❌ 測試失敗');
      Logger.log('錯誤訊息: ' + response.error);
    }
    
  } catch (error) {
    Logger.log('❌ 發生錯誤: ' + error.toString());
    Logger.log('錯誤堆疊: ' + error.stack);
  }
  
  Logger.log('');
  Logger.log('========================================');
}

/**
 * 測試請求路由邏輯
 * 驗證 doPost 是否正確識別匯入請求
 */
function testRequestRouting() {
  Logger.log('========================================');
  Logger.log('測試請求路由邏輯');
  Logger.log('========================================');
  Logger.log('');
  
  // 測試 1: 匯入請求
  Logger.log('📝 測試 1: 匯入請求（有 action: "import"）');
  const importRequest = {
    action: 'import',
    data: {
      restaurantName: '測試餐廳',
      menuImageUrl: '',
      meals: []
    }
  };
  
  const mockEvent1 = {
    postData: {
      contents: JSON.stringify(importRequest)
    }
  };
  
  try {
    const result1 = doPost(mockEvent1);
    const response1 = JSON.parse(result1.getContent());
    Logger.log('結果: ' + (response1.success ? '✅ 成功' : '❌ 失敗 - ' + response1.error));
  } catch (error) {
    Logger.log('結果: ❌ 錯誤 - ' + error.toString());
  }
  
  Logger.log('');
  
  // 測試 2: 訂單請求
  Logger.log('📝 測試 2: 訂單請求（有 order 欄位）');
  const orderRequest = {
    order: {
      restaurantName: '測試餐廳',
      studentName: '測試學生',
      mealName: '測試餐點',
      mealPrice: 100,
      selectedOptions: [],
      selectedAddons: [],
      totalAmount: 100,
      timestamp: new Date().toLocaleString('zh-TW')
    }
  };
  
  const mockEvent2 = {
    postData: {
      contents: JSON.stringify(orderRequest)
    }
  };
  
  try {
    const result2 = doPost(mockEvent2);
    const response2 = JSON.parse(result2.getContent());
    Logger.log('結果: ' + (response2.success ? '✅ 成功' : '❌ 失敗 - ' + response2.error));
  } catch (error) {
    Logger.log('結果: ❌ 錯誤 - ' + error.toString());
  }
  
  Logger.log('');
  
  // 測試 3: 無效請求
  Logger.log('📝 測試 3: 無效請求（沒有 action 也沒有 order）');
  const invalidRequest = {
    someData: 'test'
  };
  
  const mockEvent3 = {
    postData: {
      contents: JSON.stringify(invalidRequest)
    }
  };
  
  try {
    const result3 = doPost(mockEvent3);
    const response3 = JSON.parse(result3.getContent());
    Logger.log('結果: ' + (response3.success ? '✅ 成功' : '❌ 失敗 - ' + response3.error));
  } catch (error) {
    Logger.log('結果: ❌ 錯誤 - ' + error.toString());
  }
  
  Logger.log('');
  Logger.log('========================================');
}
