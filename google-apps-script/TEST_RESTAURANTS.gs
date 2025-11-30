/**
 * 測試函數 - 測試 getRestaurants API
 * 
 * 使用方法：
 * 1. 在 Google Apps Script 編輯器中
 * 2. 選擇函數：testGetRestaurants
 * 3. 點擊「執行」
 * 4. 查看「執行記錄」
 */
function testGetRestaurants() {
  Logger.log('========================================');
  Logger.log('測試 getRestaurants API');
  Logger.log('========================================');
  Logger.log('');
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const result = getRestaurantsList(ss);
    
    const jsonString = result.getContent();
    const jsonObject = JSON.parse(jsonString);
    
    Logger.log('📋 API 回應：');
    Logger.log(JSON.stringify(jsonObject, null, 2));
    Logger.log('');
    
    if (jsonObject.success) {
      Logger.log('✅ 測試成功！');
      Logger.log('');
      Logger.log('📊 餐廳列表：');
      
      jsonObject.data.forEach((restaurant, index) => {
        Logger.log('  餐廳 ' + (index + 1) + ': ' + restaurant.name);
        Logger.log('    圖片: ' + restaurant.menuImageUrl);
        Logger.log('    啟用: ' + (restaurant.enabled ? '是' : '否'));
        Logger.log('');
      });
    } else {
      Logger.log('❌ 測試失敗');
      Logger.log('錯誤訊息: ' + jsonObject.error);
    }
    
  } catch (error) {
    Logger.log('❌ 發生錯誤: ' + error.toString());
  }
  
  Logger.log('========================================');
}

/**
 * 測試函數 - 測試切換餐廳狀態
 * 
 * 使用方法：
 * 1. 修改下面的 restaurantName 為你要測試的餐廳名稱
 * 2. 選擇函數：testToggleRestaurant
 * 3. 點擊「執行」
 * 4. 查看「執行記錄」和「設定」工作表
 */
function testToggleRestaurant() {
  Logger.log('========================================');
  Logger.log('測試切換餐廳狀態');
  Logger.log('========================================');
  Logger.log('');
  
  // 修改這裡的餐廳名稱
  const restaurantName = '黃加雞腿';
  
  try {
    Logger.log('切換餐廳：' + restaurantName);
    Logger.log('');
    
    const result = toggleRestaurantStatus(restaurantName);
    
    const jsonString = result.getContent();
    const jsonObject = JSON.parse(jsonString);
    
    Logger.log('📋 API 回應：');
    Logger.log(JSON.stringify(jsonObject, null, 2));
    Logger.log('');
    
    if (jsonObject.success) {
      Logger.log('✅ 測試成功！');
      Logger.log('餐廳 ' + jsonObject.data.restaurantName + ' 已' + (jsonObject.data.enabled ? '啟用' : '關閉'));
      Logger.log('');
      Logger.log('請到「設定」工作表查看變更');
    } else {
      Logger.log('❌ 測試失敗');
      Logger.log('錯誤訊息: ' + jsonObject.error);
    }
    
  } catch (error) {
    Logger.log('❌ 發生錯誤: ' + error.toString());
  }
  
  Logger.log('========================================');
}
