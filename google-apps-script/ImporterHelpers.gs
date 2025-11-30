/**
 * 菜單匯入輔助函數
 * 這些函數用於支援菜單資料匯入功能
 */

/**
 * 尋找餐廳
 * 
 * @param {Sheet} configSheet - 設定工作表
 * @param {string} restaurantName - 餐廳名稱
 * @return {number|null} 餐廳所在的行號，如果不存在則返回 null
 */
function findRestaurant(configSheet, restaurantName) {
  const data = configSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === restaurantName) {
      return i + 1; // Sheets 的行號從 1 開始
    }
  }
  
  return null;
}

/**
 * 備份餐廳資料
 * 
 * @param {Spreadsheet} ss - 試算表物件
 * @param {string} restaurantName - 餐廳名稱
 * @return {Object} 備份資料
 */
function backupRestaurantData(ss, restaurantName) {
  const backup = {
    restaurantName: restaurantName,
    config: null,
    meals: [],
    addons: []
  };
  
  // 備份設定
  const configSheet = ss.getSheetByName('設定');
  const configData = configSheet.getDataRange().getValues();
  for (let i = 1; i < configData.length; i++) {
    if (configData[i][0] === restaurantName) {
      backup.config = configData[i];
      break;
    }
  }
  
  // 備份餐點
  const mealsSheet = ss.getSheetByName('餐點');
  const mealsData = mealsSheet.getDataRange().getValues();
  for (let i = 1; i < mealsData.length; i++) {
    if (mealsData[i][0] === restaurantName) {
      backup.meals.push(mealsData[i]);
    }
  }
  
  // 備份加購
  const addonsSheet = ss.getSheetByName('加購');
  const addonsData = addonsSheet.getDataRange().getValues();
  for (let i = 1; i < addonsData.length; i++) {
    if (addonsData[i][0] === restaurantName) {
      backup.addons.push(addonsData[i]);
    }
  }
  
  return backup;
}

/**
 * 刪除餐廳資料
 * 
 * @param {Spreadsheet} ss - 試算表物件
 * @param {string} restaurantName - 餐廳名稱
 */
function deleteRestaurantData(ss, restaurantName) {
  // 刪除餐點
  const mealsSheet = ss.getSheetByName('餐點');
  deleteRowsByRestaurant(mealsSheet, restaurantName);
  
  // 刪除加購
  const addonsSheet = ss.getSheetByName('加購');
  deleteRowsByRestaurant(addonsSheet, restaurantName);
}

/**
 * 刪除指定餐廳的所有行
 * 
 * @param {Sheet} sheet - 工作表
 * @param {string} restaurantName - 餐廳名稱
 */
function deleteRowsByRestaurant(sheet, restaurantName) {
  const data = sheet.getDataRange().getValues();
  const rowsToDelete = [];
  
  // 從後往前找，避免刪除時索引變化
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === restaurantName) {
      rowsToDelete.push(i + 1); // Sheets 的行號從 1 開始
    }
  }
  
  // 刪除行
  rowsToDelete.forEach(rowIndex => {
    sheet.deleteRow(rowIndex);
  });
}

/**
 * 還原備份資料
 * 
 * @param {Spreadsheet} ss - 試算表物件
 * @param {Object} backup - 備份資料
 */
function restoreFromBackup(ss, backup) {
  if (!backup) return;
  
  // 還原設定
  if (backup.config) {
    const configSheet = ss.getSheetByName('設定');
    configSheet.appendRow(backup.config);
  }
  
  // 還原餐點
  if (backup.meals && backup.meals.length > 0) {
    const mealsSheet = ss.getSheetByName('餐點');
    backup.meals.forEach(row => {
      mealsSheet.appendRow(row);
    });
  }
  
  // 還原加購
  if (backup.addons && backup.addons.length > 0) {
    const addonsSheet = ss.getSheetByName('加購');
    backup.addons.forEach(row => {
      addonsSheet.appendRow(row);
    });
  }
}

/**
 * 寫入餐廳設定
 * 
 * @param {Sheet} configSheet - 設定工作表
 * @param {string} restaurantName - 餐廳名稱
 * @param {string} menuImageUrl - 菜單圖片網址
 */
function writeRestaurantConfig(configSheet, restaurantName, menuImageUrl) {
  const rowIndex = findRestaurant(configSheet, restaurantName);
  const rowData = [restaurantName, menuImageUrl || '', false]; // 預設為 FALSE
  
  if (rowIndex) {
    // 更新現有列（保留原有的啟用狀態）
    configSheet.getRange(rowIndex, 1, 1, 2).setValues([[restaurantName, menuImageUrl || '']]);
  } else {
    // 新增列
    configSheet.appendRow(rowData);
    
    // 取得剛新增的行號
    const lastRow = configSheet.getLastRow();
    
    // 將「啟用」欄位（C 欄）設定為核取方塊
    const checkboxRange = configSheet.getRange(lastRow, 3);
    checkboxRange.insertCheckboxes();
  }
}

/**
 * 寫入餐點資料
 * 
 * @param {Spreadsheet} ss - 試算表物件
 * @param {string} restaurantName - 餐廳名稱
 * @param {Array} meals - 餐點陣列
 * @return {Array} 餐點 ID 陣列
 */
function writeMealsData(ss, restaurantName, meals) {
  const mealsSheet = ss.getSheetByName('餐點');
  if (!mealsSheet) {
    throw new Error('找不到「餐點」工作表');
  }
  
  const mealIds = [];
  const prefix = restaurantName.substring(0, 3);
  
  meals.forEach((meal, index) => {
    const mealId = 'meal_' + prefix + '_' + String(index + 1).padStart(3, '0');
    mealIds.push(mealId);
    
    // 序列化 optionGroups
    const optionGroupsJson = JSON.stringify(meal.optionGroups || []);
    
    const rowData = [
      restaurantName,
      mealId,
      meal.name,
      meal.price,
      optionGroupsJson,
      '' // 加購 ID 列表，稍後更新
    ];
    
    mealsSheet.appendRow(rowData);
  });
  
  return mealIds;
}

/**
 * 寫入加購資料
 * 
 * @param {Spreadsheet} ss - 試算表物件
 * @param {string} restaurantName - 餐廳名稱
 * @param {Array} meals - 餐點陣列
 * @return {Object} 加購 ID 對應表 {name_price: id}
 */
function writeAddonsData(ss, restaurantName, meals) {
  const addonsSheet = ss.getSheetByName('加購');
  if (!addonsSheet) {
    throw new Error('找不到「加購」工作表');
  }
  
  // 收集所有加購項目並去重
  const addonMap = {};
  meals.forEach(meal => {
    if (meal.addons && Array.isArray(meal.addons)) {
      meal.addons.forEach(addon => {
        const key = addon.name + '_' + addon.price;
        if (!addonMap[key]) {
          addonMap[key] = addon;
        }
      });
    }
  });
  
  // 產生加購 ID 並寫入
  const addonIdMap = {};
  const prefix = restaurantName.substring(0, 3);
  let index = 1;
  
  for (const key in addonMap) {
    const addon = addonMap[key];
    const addonId = 'addon_' + prefix + '_' + String(index).padStart(3, '0');
    addonIdMap[key] = addonId;
    
    const rowData = [
      restaurantName,
      addonId,
      addon.name,
      addon.price
    ];
    
    addonsSheet.appendRow(rowData);
    index++;
  }
  
  return addonIdMap;
}

/**
 * 更新餐點的加購 ID 列表
 * 
 * @param {Spreadsheet} ss - 試算表物件
 * @param {string} restaurantName - 餐廳名稱
 * @param {Array} meals - 餐點陣列
 * @param {Object} addonIdMap - 加購 ID 對應表
 */
function updateMealAddonIds(ss, restaurantName, meals, addonIdMap) {
  const mealsSheet = ss.getSheetByName('餐點');
  const data = mealsSheet.getDataRange().getValues();
  
  // 找到餐廳的餐點行
  let mealIndex = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === restaurantName && mealIndex < meals.length) {
      const meal = meals[mealIndex];
      const addonIds = [];
      
      if (meal.addons && Array.isArray(meal.addons)) {
        meal.addons.forEach(addon => {
          const key = addon.name + '_' + addon.price;
          if (addonIdMap[key]) {
            addonIds.push(addonIdMap[key]);
          }
        });
      }
      
      // 更新加購 ID 列表（F 欄，索引 5）
      mealsSheet.getRange(i + 1, 6).setValue(addonIds.join(','));
      mealIndex++;
    }
  }
}
