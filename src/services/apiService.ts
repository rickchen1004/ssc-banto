// API service for communicating with Google Apps Script
import type { Configuration, Order } from '../types';

export interface GetConfigResponse {
  success: boolean;
  data?: Configuration;
  error?: string;
}

export interface SubmitOrderResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * 從 Google Apps Script 讀取設定資料
 * 包含菜單圖片、餐點列表、加購項目等
 * 
 * @returns {Promise<Configuration>} 設定資料
 * @throws {Error} 當 API 呼叫失敗時拋出錯誤
 */
export async function fetchConfiguration(): Promise<Configuration> {
  const apiUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  
  if (!apiUrl) {
    throw new Error('未設定 VITE_GOOGLE_SCRIPT_URL 環境變數');
  }

  try {
    // 發送 GET 請求到 Google Apps Script
    // 注意：不要加 headers，避免觸發 CORS preflight
    const response = await fetch(apiUrl, {
      method: 'GET',
    });

    // 檢查 HTTP 狀態碼
    if (!response.ok) {
      throw new Error(`HTTP 錯誤！狀態碼: ${response.status}`);
    }

    // 解析 JSON 回應
    const result: GetConfigResponse = await response.json();

    // 檢查 API 回應是否成功
    if (!result.success || !result.data) {
      throw new Error(result.error || '讀取設定失敗');
    }

    return result.data;
  } catch (error) {
    // 處理網路錯誤或其他錯誤
    if (error instanceof Error) {
      throw new Error(`讀取設定失敗: ${error.message}`);
    }
    throw new Error('讀取設定時發生未知錯誤');
  }
}

/**
 * 提交訂單到 Google Apps Script
 * 
 * @param {Order} order - 訂單資料
 * @returns {Promise<SubmitOrderResponse>} 提交結果
 * @throws {Error} 當 API 呼叫失敗時拋出錯誤
 */
export async function submitOrder(order: Order): Promise<SubmitOrderResponse> {
  const apiUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  
  if (!apiUrl) {
    throw new Error('未設定 VITE_GOOGLE_SCRIPT_URL 環境變數');
  }

  try {
    // 發送 POST 請求到 Google Apps Script
    // 注意：使用 text/plain 避免觸發 CORS preflight
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ order }),
    });

    // 檢查 HTTP 狀態碼
    if (!response.ok) {
      throw new Error(`HTTP 錯誤！狀態碼: ${response.status}`);
    }

    // 解析 JSON 回應
    const result: SubmitOrderResponse = await response.json();

    // 檢查 API 回應是否成功
    if (!result.success) {
      throw new Error(result.error || '提交訂單失敗');
    }

    return result;
  } catch (error) {
    // 處理網路錯誤或其他錯誤
    if (error instanceof Error) {
      throw new Error(`提交訂單失敗: ${error.message}`);
    }
    throw new Error('提交訂單時發生未知錯誤');
  }
}
