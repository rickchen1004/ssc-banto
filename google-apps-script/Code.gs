/**
 * 安親班學生訂便當系統 - Google Apps Script API
 * 
 * 這個腳本提供兩個主要功能：
 * 1. doGet() - 讀取設定資料（菜單、餐點、加購項目）
 * 2. doPost() - 寫入訂單資料到訂單工作表
 */

/**
 * 處理 GET 請求 - 讀取設定資料
 * 當前端應用程式需要載入菜單和餐點資料時會呼叫這個函數
 * 
 * @param {Object} e - 事件參數（本函數不使用）
 * @return {TextOutput} JSON 格式的回應
 */
function doGet(e) {
  try {
    // 取得目前的試算表
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // === 步驟 1: 讀取設定工作表 ===
    const configSheet = ss.getSheetByName('設定');
    if (!configSheet) {
      throw new Error('找不到「設定」工作表');
    }
    
    // 讀取所有設定資料（包含標題行）
    const configData = configSheet.getDataRange().getValues();
    
    // 尋找啟用的餐廳（從第 2 行開始，跳過標題行）
    let todayRestaurant = null;
    let menuImageUrl = null;
    
    for (let i = 1; i < configData.length; i++) {
      const row = configData[i];
      // row[0] = 餐廳名稱, row[1] = 菜單圖片網址, row[2] = 啟用
      
      // 檢查是否啟用（TRUE 或 true 或 1）
      const isEnabled = row[2] === true || row[2] === 'TRUE' || row[2] === 1;
      
      if (isEnabled && row[0]) {
        todayRestaurant = row[0];
        menuImageUrl = row[1];
        break;  // 找到第一個啟用的餐廳就停止
      }
    }
    
    // 檢查是否找到啟用的餐廳
    if (!todayRestaurant) {
      throw new Error('請在設定工作表中將至少一家餐廳的「啟用」欄位設為 TRUE');
    }
    
    if (!menuImageUrl) {
      throw new Error('啟用的餐廳缺少菜單圖片網址');
    }
    
    // === 步驟 2: 讀取餐點工作表 ===
    const mealsSheet = ss.getSheetByName('餐點');
    if (!mealsSheet) {
      throw new Error('找不到「餐點」工作表');
    }
    
    // 取得所有餐點資料（包含標題行）
    const mealsData = mealsSheet.getDataRange().getValues();
    
    // 解析餐點資料，只保留今日餐廳的餐點
    const meals = parseMealsData(mealsData, todayRestaurant);
    
    // === 步驟 3: 讀取加購工作表 ===
    const addonsSheet = ss.getSheetByName('加購');
    if (!addonsSheet) {
      throw new Error('找不到「加購」工作表');
    }
    
    // 取得所有加購項目資料（包含標題行）
    const addonsData = addonsSheet.getDataRange().getValues();
    
    // 解析加購項目資料，只保留今日餐廳的加購項目
    const addons = parseAddonsData(addonsData, todayRestaurant);
    
    // === 步驟 4: 組合設定資料 ===
    // 為每個餐點關聯對應的加購項目
    const mealsWithAddons = meals.map(meal => {
      // 根據餐點的 addonIds 篩選出對應的加購項目
      const mealAddons = addons.filter(addon => 
        meal.addonIds.includes(addon.id)
      );
      
      return {
        id: meal.id,
        name: meal.name,
        price: meal.price,
        optionGroups: meal.optionGroups,
        addons: mealAddons
      };
    });
    
    // 組合完整的設定物件
    const config = {
      restaurantName: todayRestaurant,
      menuImageUrl: menuImageUrl,
      meals: mealsWithAddons
    };
    
    // === 步驟 5: 回傳 JSON 格式的成功回應 ===
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        data: config 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // 發生錯誤時，回傳錯誤訊息
    Logger.log('doGet 錯誤: ' + error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 解析餐點資料
 * 從餐點工作表的原始資料中，篩選出指定餐廳的餐點
 * 
 * @param {Array} data - 餐點工作表的所有資料（二維陣列）
 * @param {string} restaurantName - 要篩選的餐廳名稱
 * @return {Array} 解析後的餐點陣列
 */
function parseMealsData(data, restaurantName) {
  const meals = [];
  
  // 從第 2 行開始（索引 1），跳過標題行
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // 檢查是否為今日餐廳的餐點
    // row[0] = 餐廳名稱, row[1] = 餐點ID
    if (row[0] === restaurantName && row[1]) {
      // 解析選項組（JSON 字串）
      let optionGroups = [];
      if (row[4]) {
        try {
          // 嘗試解析 JSON 字串
          optionGroups = JSON.parse(row[4]);
          
          // 確保是陣列格式
          if (!Array.isArray(optionGroups)) {
            optionGroups = [];
          }
        } catch (e) {
          // 如果解析失敗，記錄錯誤並使用空陣列
          Logger.log('解析選項組 JSON 失敗: ' + row[2] + ' - ' + e.toString());
          optionGroups = [];
        }
      }
      
      // 解析加購項目ID（用逗號分隔的字串）
      const addonIds = row[5] ? 
        row[5].toString().split(',').map(s => s.trim()).filter(s => s) : 
        [];
      
      meals.push({
        id: row[1],              // B欄：餐點ID
        name: row[2],            // C欄：餐點名稱
        price: row[3],           // D欄：餐點價格
        optionGroups: optionGroups,  // E欄：選項組（JSON 陣列）
        addonIds: addonIds       // F欄：加購項目ID（陣列）
      });
    }
  }
  
  return meals;
}

/**
 * 解析加購項目資料
 * 從加購工作表的原始資料中，篩選出指定餐廳的加購項目
 * 
 * @param {Array} data - 加購工作表的所有資料（二維陣列）
 * @param {string} restaurantName - 要篩選的餐廳名稱
 * @return {Array} 解析後的加購項目陣列
 */
function parseAddonsData(data, restaurantName) {
  const addons = [];
  
  // 從第 2 行開始（索引 1），跳過標題行
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // 檢查是否為今日餐廳的加購項目
    // row[0] = 餐廳名稱, row[1] = 加購ID
    if (row[0] === restaurantName && row[1]) {
      addons.push({
        id: row[1],      // B欄：加購ID
        name: row[2],    // C欄：加購名稱
        price: row[3]    // D欄：加購價格
      });
    }
  }
  
  return addons;
}

/**
 * 測試函數 - 顯示 doGet 的 JSON 回應
 * 這個函數會執行 doGet 並在執行記錄中顯示 JSON 結果
 * 
 * 使用方法：
 * 1. 在函數選擇下拉選單中選擇 testDoGetJSON
 * 2. 點擊「執行」按鈕
 * 3. 查看下方的「執行記錄」
 */
function testDoGetJSON() {
  Logger.log('========================================');
  Logger.log('測試 doGet 函數');
  Logger.log('========================================');
  Logger.log('');
  
  try {
    // 執行 doGet 函數
    const result = doGet();
    
    // 取得 JSON 字串
    const jsonString = result.getContent();
    
    // 解析 JSON
    const jsonObject = JSON.parse(jsonString);
    
    // 美化顯示 JSON
    Logger.log('📋 JSON 回應：');
    Logger.log(JSON.stringify(jsonObject, null, 2));
    
    Logger.log('');
    Logger.log('========================================');
    
    // 如果成功，顯示摘要資訊
    if (jsonObject.success) {
      Logger.log('✅ 執行成功！');
      Logger.log('');
      Logger.log('📊 資料摘要：');
      Logger.log('  餐廳名稱: ' + jsonObject.data.restaurantName);
      Logger.log('  菜單圖片: ' + jsonObject.data.menuImageUrl);
      Logger.log('  餐點數量: ' + jsonObject.data.meals.length);
      Logger.log('');
      
      // 顯示每個餐點的詳細資訊
      jsonObject.data.meals.forEach((meal, index) => {
        Logger.log('  餐點 ' + (index + 1) + ': ' + meal.name);
        Logger.log('    價格: NT$ ' + meal.price);
        
        // 顯示選項組
        if (meal.optionGroups && meal.optionGroups.length > 0) {
          Logger.log('    選項組:');
          meal.optionGroups.forEach((group, groupIndex) => {
            Logger.log('      組 ' + (groupIndex + 1) + ': ' + group.join(', '));
          });
        } else {
          Logger.log('    選項組: 無');
        }
        
        // 顯示加購項目
        if (meal.addons && meal.addons.length > 0) {
          Logger.log('    加購項目: ' + meal.addons.map(a => a.name + ' (NT$ ' + a.price + ')').join(', '));
        } else {
          Logger.log('    加購項目: 無');
        }
        
        Logger.log('');
      });
    } else {
      Logger.log('❌ 執行失敗');
      Logger.log('錯誤訊息: ' + jsonObject.error);
    }
    
  } catch (error) {
    Logger.log('❌ 發生錯誤: ' + error.toString());
  }
  
  Logger.log('========================================');
}

/**
 * 處理 POST 請求 - 寫入訂單資料或匯入菜單資料
 * 根據 action 欄位決定執行哪個操作：
 * - 沒有 action 欄位：處理訂單提交（向後相容）
 * - action === 'import'：處理菜單匯入
 * 
 * @param {Object} e - 事件參數，包含 POST 的資料
 * @return {TextOutput} JSON 格式的回應
 */
function doPost(e) {
  try {
    // === 步驟 1: 解析前端傳來的資料 ===
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('沒有收到資料');
    }
    
    // 解析 JSON 字串
    const requestData = JSON.parse(e.postData.contents);
    
    // 記錄請求資料以便調試
    Logger.log('收到 POST 請求');
    Logger.log('requestData.action: ' + requestData.action);
    Logger.log('requestData.order: ' + (requestData.order ? '存在' : '不存在'));
    Logger.log('requestData.data: ' + (requestData.data ? '存在' : '不存在'));
    
    // === 步驟 2: 根據 action 欄位決定操作類型 ===
    if (requestData.action === 'import') {
      // 處理菜單匯入
      Logger.log('執行菜單匯入');
      return handleImportMenu(requestData.data);
    } else if (requestData.order) {
      // 處理訂單提交（向後相容）
      Logger.log('執行訂單提交');
      return handleSubmitOrder(requestData.order);
    } else {
      throw new Error('未知的操作類型');
    }
    
  } catch (error) {
    // 發生錯誤時，記錄並回傳錯誤訊息
    Logger.log('doPost 錯誤: ' + error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 處理訂單提交（原有功能）
 * 
 * @param {Object} order - 訂單資料
 * @return {TextOutput} JSON 格式的回應
 */
function handleSubmitOrder(order) {
  try {
    
    // 驗證訂單資料
    if (!order.studentName || order.studentName.trim() === '') {
      throw new Error('學生姓名不能為空');
    }
    
    if (!order.mealName) {
      throw new Error('請選擇餐點');
    }
    
    if (!order.restaurantName) {
      throw new Error('餐廳名稱不能為空');
    }
    
    // 取得訂單工作表
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ordersSheet = ss.getSheetByName('訂單');
    
    if (!ordersSheet) {
      throw new Error('找不到「訂單」工作表');
    }
    
    // 準備要寫入的資料
    const optionsString = order.selectedOptions && order.selectedOptions.length > 0
      ? order.selectedOptions.join(', ')
      : '';
    
    const addonsString = order.selectedAddons && order.selectedAddons.length > 0
      ? order.selectedAddons.map(addon => addon.name).join(', ')
      : '';
    
    // 從訂單資料中取得數量和小計（向後相容）
    const mealQuantity = order.mealQuantity || 1;
    const mealSubtotal = order.mealSubtotal || order.mealPrice;
    const addonsTotal = order.addonsTotal || (order.selectedAddons && order.selectedAddons.length > 0
      ? order.selectedAddons.reduce((sum, addon) => sum + addon.price, 0)
      : 0);
    
    const rowData = [
      order.timestamp,           // A: 時間
      order.restaurantName,      // B: 餐廳名稱
      order.studentName,         // C: 學生姓名
      order.mealName,            // D: 餐點名稱
      order.mealPrice,           // E: 餐點單價
      mealQuantity,              // F: 餐點數量（新增）
      mealSubtotal,              // G: 餐點小計（新增）
      optionsString,             // H: 選項
      addonsString,              // I: 加購項目
      addonsTotal,               // J: 加購金額
      order.totalAmount          // K: 總金額
    ];
    
    // 附加訂單到工作表
    ordersSheet.appendRow(rowData);
    
    Logger.log('訂單已成功寫入：' + order.studentName + ' - ' + order.mealName);
    
    // 回傳成功回應
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: '訂單已成功提交！' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('handleSubmitOrder 錯誤: ' + error.toString());
    throw error;
  }
}

/**
 * 處理菜單匯入（新功能）
 * 
 * @param {Object} data - 匯入資料，包含餐廳資訊和餐點列表
 * @return {TextOutput} JSON 格式的回應
 */
function handleImportMenu(data) {
  try {
    // 驗證資料
    if (!data || !data.restaurantName || !data.meals || !Array.isArray(data.meals)) {
      throw new Error('資料格式錯誤');
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const restaurantName = data.restaurantName;
    
    // 檢查餐廳是否已存在
    const configSheet = ss.getSheetByName('設定');
    if (!configSheet) {
      throw new Error('找不到「設定」工作表');
    }
    
    const existingRestaurant = findRestaurant(configSheet, restaurantName);
    
    // 備份現有資料（如果存在）
    let backup = null;
    if (existingRestaurant) {
      backup = backupRestaurantData(ss, restaurantName);
    }
    
    try {
      // 如果餐廳已存在，先刪除舊資料
      if (existingRestaurant) {
        deleteRestaurantData(ss, restaurantName);
      }
      
      // 寫入新資料
      writeRestaurantConfig(configSheet, restaurantName, data.menuImageUrl || '');
      const mealIds = writeMealsData(ss, restaurantName, data.meals);
      const addonIds = writeAddonsData(ss, restaurantName, data.meals);
      
      // 更新餐點的加購 ID 列表
      updateMealAddonIds(ss, restaurantName, data.meals, addonIds);
      
      Logger.log('菜單匯入成功：' + restaurantName);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: '匯入成功',
          data: {
            restaurantName: restaurantName,
            mealsImported: mealIds.length,
            addonsImported: addonIds.length
          }
        }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } catch (error) {
      // 回復資料
      if (backup) {
        restoreFromBackup(ss, backup);
      }
      throw error;
    }
    
  } catch (error) {
    Logger.log('handleImportMenu 錯誤: ' + error.toString());
    throw error;
  }
}

/**
 * 測試函數 - 測試 doPost 函數
 * 這個函數會模擬前端提交訂單，測試 doPost 是否正常運作
 * 
 * 使用方法：
 * 1. 在函數選擇下拉選單中選擇 testDoPost
 * 2. 點擊「執行」按鈕
 * 3. 查看「執行記錄」和「訂單」工作表
 */
function testDoPost() {
  Logger.log('========================================');
  Logger.log('測試 doPost 函數');
  Logger.log('========================================');
  Logger.log('');
  
  // 建立測試訂單資料
  const testOrder = {
    order: {
      restaurantName: '美味麵館',
      studentName: '測試學生',
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
    }
  };
  
  Logger.log('📝 測試訂單資料：');
  Logger.log(JSON.stringify(testOrder, null, 2));
  Logger.log('');
  
  // 模擬 POST 請求
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testOrder)
    }
  };
  
  try {
    // 執行 doPost
    const result = doPost(mockEvent);
    const response = JSON.parse(result.getContent());
    
    Logger.log('📋 回應結果：');
    Logger.log(JSON.stringify(response, null, 2));
    Logger.log('');
    
    if (response.success) {
      Logger.log('✅ 測試成功！訂單已寫入「訂單」工作表');
      Logger.log('');
      Logger.log('請到 Google Sheet 的「訂單」工作表查看新增的訂單記錄');
    } else {
      Logger.log('❌ 測試失敗');
      Logger.log('錯誤訊息: ' + response.error);
    }
    
  } catch (error) {
    Logger.log('❌ 發生錯誤: ' + error.toString());
  }
  
  Logger.log('');
  Logger.log('========================================');
}
