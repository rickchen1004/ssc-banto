/**
 * 測試函數集
 * 這些函數可以幫助你測試 Apps Script 是否正常運作
 * 
 * 使用方法：
 * 1. 將這個檔案的內容貼到 Apps Script 編輯器中（在 Code.gs 下方）
 * 2. 選擇要測試的函數
 * 3. 點擊「執行」按鈕
 * 4. 查看執行記錄
 */

/**
 * 測試函數 1: 測試讀取設定工作表
 * 這個函數會讀取設定工作表並顯示內容
 */
function testReadConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('設定');
  
  if (!configSheet) {
    Logger.log('❌ 錯誤：找不到「設定」工作表');
    return;
  }
  
  const todayRestaurant = configSheet.getRange('A2').getValue();
  const menuImageUrl = configSheet.getRange('B2').getValue();
  
  Logger.log('✅ 成功讀取設定工作表');
  Logger.log('今日餐廳: ' + todayRestaurant);
  Logger.log('菜單圖片網址: ' + menuImageUrl);
}

/**
 * 測試函數 2: 測試讀取餐點工作表
 * 這個函數會讀取餐點工作表並顯示今日餐廳的餐點
 */
function testReadMeals() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('設定');
  const mealsSheet = ss.getSheetByName('餐點');
  
  if (!configSheet || !mealsSheet) {
    Logger.log('❌ 錯誤：找不到工作表');
    return;
  }
  
  const todayRestaurant = configSheet.getRange('A2').getValue();
  const mealsData = mealsSheet.getDataRange().getValues();
  const meals = parseMealsData(mealsData, todayRestaurant);
  
  Logger.log('✅ 成功讀取餐點工作表');
  Logger.log('今日餐廳: ' + todayRestaurant);
  Logger.log('餐點數量: ' + meals.length);
  
  meals.forEach((meal, index) => {
    Logger.log('');
    Logger.log('餐點 ' + (index + 1) + ':');
    Logger.log('  ID: ' + meal.id);
    Logger.log('  名稱: ' + meal.name);
    Logger.log('  價格: ' + meal.price);
    Logger.log('  備註選項: ' + meal.options.join(', '));
    Logger.log('  加購項目ID: ' + meal.addonIds.join(', '));
  });
}

/**
 * 測試函數 3: 測試讀取加購工作表
 * 這個函數會讀取加購工作表並顯示今日餐廳的加購項目
 */
function testReadAddons() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('設定');
  const addonsSheet = ss.getSheetByName('加購');
  
  if (!configSheet || !addonsSheet) {
    Logger.log('❌ 錯誤：找不到工作表');
    return;
  }
  
  const todayRestaurant = configSheet.getRange('A2').getValue();
  const addonsData = addonsSheet.getDataRange().getValues();
  const addons = parseAddonsData(addonsData, todayRestaurant);
  
  Logger.log('✅ 成功讀取加購工作表');
  Logger.log('今日餐廳: ' + todayRestaurant);
  Logger.log('加購項目數量: ' + addons.length);
  
  addons.forEach((addon, index) => {
    Logger.log('');
    Logger.log('加購項目 ' + (index + 1) + ':');
    Logger.log('  ID: ' + addon.id);
    Logger.log('  名稱: ' + addon.name);
    Logger.log('  價格: ' + addon.price);
  });
}

/**
 * 測試函數 4: 測試完整的 doGet 流程
 * 這個函數會模擬前端呼叫 doGet 並顯示回應
 */
function testDoGetComplete() {
  Logger.log('開始測試 doGet 函數...');
  Logger.log('');
  
  const result = doGet();
  const response = JSON.parse(result.getContent());
  
  if (response.success) {
    Logger.log('✅ doGet 執行成功！');
    Logger.log('');
    Logger.log('回應資料：');
    Logger.log('餐廳名稱: ' + response.data.restaurantName);
    Logger.log('菜單圖片: ' + response.data.menuImageUrl);
    Logger.log('餐點數量: ' + response.data.meals.length);
    Logger.log('');
    
    response.data.meals.forEach((meal, index) => {
      Logger.log('餐點 ' + (index + 1) + ': ' + meal.name + ' (NT$ ' + meal.price + ')');
      Logger.log('  備註選項: ' + meal.options.join(', '));
      Logger.log('  加購項目: ' + meal.addons.map(a => a.name + ' (NT$ ' + a.price + ')').join(', '));
      Logger.log('');
    });
  } else {
    Logger.log('❌ doGet 執行失敗');
    Logger.log('錯誤訊息: ' + response.error);
  }
}

/**
 * 測試函數 5: 測試切換餐廳
 * 這個函數會測試切換到不同餐廳時是否正確篩選資料
 */
function testSwitchRestaurant() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('設定');
  
  // 儲存原本的餐廳名稱
  const originalRestaurant = configSheet.getRange('A2').getValue();
  
  Logger.log('原本的餐廳: ' + originalRestaurant);
  Logger.log('');
  
  // 測試美味麵館
  configSheet.getRange('A2').setValue('美味麵館');
  let result = doGet();
  let response = JSON.parse(result.getContent());
  Logger.log('切換到「美味麵館」:');
  Logger.log('  餐點數量: ' + response.data.meals.length);
  Logger.log('  餐點: ' + response.data.meals.map(m => m.name).join(', '));
  Logger.log('');
  
  // 測試便當王
  configSheet.getRange('A2').setValue('便當王');
  result = doGet();
  response = JSON.parse(result.getContent());
  Logger.log('切換到「便當王」:');
  Logger.log('  餐點數量: ' + response.data.meals.length);
  Logger.log('  餐點: ' + response.data.meals.map(m => m.name).join(', '));
  Logger.log('');
  
  // 恢復原本的餐廳
  configSheet.getRange('A2').setValue(originalRestaurant);
  Logger.log('✅ 測試完成，已恢復原本的餐廳設定');
}

/**
 * 測試函數 6: 驗證資料完整性
 * 這個函數會檢查所有必要的資料是否都存在
 */
function testDataIntegrity() {
  Logger.log('開始驗證資料完整性...');
  Logger.log('');
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let allPassed = true;
  
  // 檢查工作表是否存在
  const sheets = ['設定', '餐點', '加購', '訂單'];
  sheets.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (sheet) {
      Logger.log('✅ 工作表「' + sheetName + '」存在');
    } else {
      Logger.log('❌ 工作表「' + sheetName + '」不存在');
      allPassed = false;
    }
  });
  
  Logger.log('');
  
  // 檢查設定工作表
  const configSheet = ss.getSheetByName('設定');
  if (configSheet) {
    const todayRestaurant = configSheet.getRange('A2').getValue();
    const menuImageUrl = configSheet.getRange('B2').getValue();
    
    if (todayRestaurant) {
      Logger.log('✅ 今日餐廳已設定: ' + todayRestaurant);
    } else {
      Logger.log('❌ 今日餐廳未設定（A2 儲存格為空）');
      allPassed = false;
    }
    
    if (menuImageUrl) {
      Logger.log('✅ 菜單圖片網址已設定');
    } else {
      Logger.log('❌ 菜單圖片網址未設定（B2 儲存格為空）');
      allPassed = false;
    }
  }
  
  Logger.log('');
  
  // 檢查餐點資料
  const mealsSheet = ss.getSheetByName('餐點');
  if (mealsSheet) {
    const mealsData = mealsSheet.getDataRange().getValues();
    const mealCount = mealsData.length - 1; // 扣除標題行
    Logger.log('✅ 餐點工作表有 ' + mealCount + ' 筆資料');
  }
  
  // 檢查加購資料
  const addonsSheet = ss.getSheetByName('加購');
  if (addonsSheet) {
    const addonsData = addonsSheet.getDataRange().getValues();
    const addonCount = addonsData.length - 1; // 扣除標題行
    Logger.log('✅ 加購工作表有 ' + addonCount + ' 筆資料');
  }
  
  Logger.log('');
  
  if (allPassed) {
    Logger.log('🎉 所有檢查都通過！');
  } else {
    Logger.log('⚠️ 有些檢查未通過，請修正後再試');
  }
}
