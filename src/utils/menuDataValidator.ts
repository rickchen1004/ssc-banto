export interface ValidationError {
  field: string;
  message: string;
  path?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface AddonData {
  name: string;
  price: number;
}

export interface MealData {
  name: string;
  price: number;
  imageUrl?: string;
  optionGroups: string[][];
  addons: AddonData[];
}

export interface MenuData {
  meals: MealData[];
}

/**
 * 驗證 JSON 菜單資料
 * 驗證 JSON 語法、必要欄位和資料類型
 */
export function validateMenuData(jsonString: string): ValidationResult {
  // 1. 驗證 JSON 語法
  let data: any;
  try {
    data = JSON.parse(jsonString);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      isValid: false,
      errors: [{
        field: 'json',
        message: `JSON 格式錯誤：${errorMessage}`,
        path: 'json'
      }]
    };
  }
  
  // 2. 驗證必要欄位和資料類型
  const errors: ValidationError[] = [];
  
  // 檢查 meals 陣列
  if (!data.meals) {
    errors.push({
      field: 'meals',
      message: '缺少必要欄位：meals',
      path: 'meals'
    });
    return { isValid: false, errors };
  }
  
  if (!Array.isArray(data.meals)) {
    errors.push({
      field: 'meals',
      message: '欄位 meals 的類型錯誤，預期 array，實際 ' + typeof data.meals,
      path: 'meals'
    });
    return { isValid: false, errors };
  }
  
  // 檢查每個餐點
  data.meals.forEach((meal: any, index: number) => {
    const path = `meals[${index}]`;
    
    // 檢查 name
    if (!meal.name) {
      errors.push({
        field: `${path}.name`,
        message: `缺少必要欄位：${path}.name`,
        path: `${path}.name`
      });
    } else if (typeof meal.name !== 'string') {
      errors.push({
        field: `${path}.name`,
        message: `欄位 ${path}.name 的類型錯誤，預期 string，實際 ${typeof meal.name}`,
        path: `${path}.name`
      });
    }
    
    // 檢查 price
    if (meal.price === undefined || meal.price === null) {
      errors.push({
        field: `${path}.price`,
        message: `缺少必要欄位：${path}.price`,
        path: `${path}.price`
      });
    } else if (typeof meal.price !== 'number') {
      errors.push({
        field: `${path}.price`,
        message: `欄位 ${path}.price 的類型錯誤，預期 number，實際 ${typeof meal.price}`,
        path: `${path}.price`
      });
    }
    
    // 檢查 optionGroups
    if (!meal.optionGroups) {
      errors.push({
        field: `${path}.optionGroups`,
        message: `缺少必要欄位：${path}.optionGroups`,
        path: `${path}.optionGroups`
      });
    } else if (!Array.isArray(meal.optionGroups)) {
      errors.push({
        field: `${path}.optionGroups`,
        message: `欄位 ${path}.optionGroups 的類型錯誤，預期 array，實際 ${typeof meal.optionGroups}`,
        path: `${path}.optionGroups`
      });
    } else {
      // 檢查每個選項組是否為字串陣列
      meal.optionGroups.forEach((group: any, groupIndex: number) => {
        if (!Array.isArray(group)) {
          errors.push({
            field: `${path}.optionGroups[${groupIndex}]`,
            message: `欄位 ${path}.optionGroups[${groupIndex}] 的類型錯誤，預期 array，實際 ${typeof group}`,
            path: `${path}.optionGroups[${groupIndex}]`
          });
        } else {
          group.forEach((option: any, optionIndex: number) => {
            if (typeof option !== 'string') {
              errors.push({
                field: `${path}.optionGroups[${groupIndex}][${optionIndex}]`,
                message: `欄位 ${path}.optionGroups[${groupIndex}][${optionIndex}] 的類型錯誤，預期 string，實際 ${typeof option}`,
                path: `${path}.optionGroups[${groupIndex}][${optionIndex}]`
              });
            }
          });
        }
      });
    }
    
    // 檢查 addons
    if (!meal.addons) {
      errors.push({
        field: `${path}.addons`,
        message: `缺少必要欄位：${path}.addons`,
        path: `${path}.addons`
      });
    } else if (!Array.isArray(meal.addons)) {
      errors.push({
        field: `${path}.addons`,
        message: `欄位 ${path}.addons 的類型錯誤，預期 array，實際 ${typeof meal.addons}`,
        path: `${path}.addons`
      });
    } else {
      meal.addons.forEach((addon: any, addonIndex: number) => {
        const addonPath = `${path}.addons[${addonIndex}]`;
        
        if (!addon.name) {
          errors.push({
            field: `${addonPath}.name`,
            message: `缺少必要欄位：${addonPath}.name`,
            path: `${addonPath}.name`
          });
        } else if (typeof addon.name !== 'string') {
          errors.push({
            field: `${addonPath}.name`,
            message: `欄位 ${addonPath}.name 的類型錯誤，預期 string，實際 ${typeof addon.name}`,
            path: `${addonPath}.name`
          });
        }
        
        if (addon.price === undefined || addon.price === null) {
          errors.push({
            field: `${addonPath}.price`,
            message: `缺少必要欄位：${addonPath}.price`,
            path: `${addonPath}.price`
          });
        } else if (typeof addon.price !== 'number') {
          errors.push({
            field: `${addonPath}.price`,
            message: `欄位 ${addonPath}.price 的類型錯誤，預期 string，實際 ${typeof addon.price}`,
            path: `${addonPath}.price`
          });
        }
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
