/**
 * 訂單狀態管理 Hook
 * 管理整個應用程式的狀態，包括設定資料、選擇狀態、UI 狀態
 */

import { useState, useEffect } from 'react';
import type { AppState, MealItem, AddonItem } from '../types';
import { fetchConfiguration, submitOrder } from '../services/apiService';
import { calculateTotal } from '../utils/calculations';
import { validateOrder } from '../utils/validation';
import { buildOrderData } from '../utils/orderBuilder';

/**
 * 初始狀態
 */
const initialState: AppState = {
  // 設定資料
  configuration: null,
  isLoadingConfig: true,
  configError: null,

  // 選擇狀態
  selectedMeal: null,
  selectedOptions: [],
  selectedAddons: [],
  studentName: '',

  // UI 狀態
  isSubmitting: false,
  notification: {
    type: null,
    message: '',
  },
};

/**
 * 訂單狀態管理 Hook
 */
export function useOrderState() {
  const [state, setState] = useState<AppState>(initialState);

  /**
   * 載入設定資料
   */
  useEffect(() => {
    loadConfiguration();
  }, []);

  /**
   * 從 API 載入設定資料
   */
  const loadConfiguration = async () => {
    setState(prev => ({
      ...prev,
      isLoadingConfig: true,
      configError: null,
    }));

    try {
      const config = await fetchConfiguration();
      setState(prev => ({
        ...prev,
        configuration: config,
        isLoadingConfig: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        configError: error instanceof Error ? error.message : '載入設定失敗',
        isLoadingConfig: false,
      }));
    }
  };

  /**
   * 選擇餐點
   * 選擇新餐點時會清空備註選項和加購項目
   */
  const selectMeal = (meal: MealItem) => {
    setState(prev => ({
      ...prev,
      selectedMeal: meal,
      selectedOptions: [],
      selectedAddons: [],
    }));
  };

  /**
   * 切換備註選項（每組單選）
   * @param option 選項名稱
   * @param groupIndex 選項組索引
   */
  const toggleOption = (option: string, groupIndex: number) => {
    setState(prev => {
      if (!prev.selectedMeal) return prev;

      // 取得當前選項組的所有選項
      const currentGroup = prev.selectedMeal.optionGroups[groupIndex];
      if (!currentGroup) return prev;

      // 移除同組中的其他選項
      const newOptions = prev.selectedOptions.filter(
        opt => !currentGroup.includes(opt)
      );

      // 如果點擊的選項已經被選中，則取消選擇（允許不選）
      // 否則，加入新選項
      const isAlreadySelected = prev.selectedOptions.includes(option);
      if (!isAlreadySelected) {
        newOptions.push(option);
      }

      return {
        ...prev,
        selectedOptions: newOptions,
      };
    });
  };

  /**
   * 切換加購項目（單選）
   */
  const toggleAddon = (addon: AddonItem) => {
    setState(prev => {
      const isSelected = prev.selectedAddons.some(a => a.id === addon.id);
      
      // 如果點擊的是已選中的加購，則取消選擇
      if (isSelected) {
        return {
          ...prev,
          selectedAddons: [],
        };
      }
      
      // 否則，替換為新的加購（單選）
      return {
        ...prev,
        selectedAddons: [addon],
      };
    });
  };

  /**
   * 更新學生姓名
   */
  const setStudentName = (name: string) => {
    setState(prev => ({
      ...prev,
      studentName: name,
    }));
  };

  /**
   * 設定提交狀態
   */
  const setSubmitting = (isSubmitting: boolean) => {
    setState(prev => ({
      ...prev,
      isSubmitting,
    }));
  };

  /**
   * 顯示通知訊息
   */
  const showNotification = (type: 'success' | 'error', message: string) => {
    setState(prev => ({
      ...prev,
      notification: { type, message },
    }));
  };

  /**
   * 清除通知訊息
   */
  const clearNotification = () => {
    setState(prev => ({
      ...prev,
      notification: { type: null, message: '' },
    }));
  };

  /**
   * 重置表單（提交成功後使用）
   */
  const resetForm = () => {
    setState(prev => ({
      ...prev,
      selectedMeal: null,
      selectedOptions: [],
      selectedAddons: [],
      studentName: '',
    }));
  };

  /**
   * 計算當前總金額
   */
  const totalAmount = calculateTotal(state.selectedMeal, state.selectedAddons);

  /**
   * 檢查是否可以提交訂單
   */
  const canSubmit = !!(
    state.selectedMeal &&
    state.studentName.trim() &&
    !state.isSubmitting
  );

  /**
   * 提交訂單
   * 執行驗證、呼叫 API、處理結果
   */
  const handleSubmitOrder = async () => {
    // 執行驗證
    const validation = validateOrder(state.studentName, state.selectedMeal);
    
    if (!validation.isValid) {
      showNotification('error', validation.error || '訂單驗證失敗');
      return;
    }

    // 驗證通過，準備提交
    if (!state.selectedMeal || !state.configuration) {
      return;
    }

    // 設定提交中狀態
    setSubmitting(true);
    clearNotification();

    try {
      // 組裝訂單資料
      const order = buildOrderData(
        state.configuration.restaurantName,
        state.studentName,
        state.selectedMeal,
        state.selectedOptions,
        state.selectedAddons,
        totalAmount
      );

      // 呼叫 API 提交訂單
      await submitOrder(order);

      // 提交成功
      showNotification('success', '訂單已成功提交！');
      
      // 重置表單
      resetForm();
    } catch (error) {
      // 提交失敗，保留輸入資料
      const errorMessage = error instanceof Error 
        ? error.message 
        : '提交訂單時發生未知錯誤';
      showNotification('error', errorMessage);
    } finally {
      // 取消提交中狀態
      setSubmitting(false);
    }
  };

  return {
    // 狀態
    state,
    totalAmount,
    canSubmit,

    // 動作
    loadConfiguration,
    selectMeal,
    toggleOption,
    toggleAddon,
    setStudentName,
    setSubmitting,
    showNotification,
    clearNotification,
    resetForm,
    handleSubmitOrder,
  };
}
