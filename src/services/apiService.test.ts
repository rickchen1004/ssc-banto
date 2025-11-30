import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { importMenuData, type ImportMenuData, type ImportMenuResponse } from './apiService';

describe('importMenuData', () => {
  const originalEnv = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  const mockApiUrl = 'https://script.google.com/macros/s/test/exec';

  beforeEach(() => {
    // 設置環境變數
    import.meta.env.VITE_GOOGLE_SCRIPT_URL = mockApiUrl;
    // 清除所有 mock
    vi.clearAllMocks();
  });

  afterEach(() => {
    // 恢復環境變數
    import.meta.env.VITE_GOOGLE_SCRIPT_URL = originalEnv;
  });

  it('should successfully import menu data', async () => {
    const mockMenuData: ImportMenuData = {
      restaurantName: '測試餐廳',
      menuImageUrl: 'https://example.com/menu.jpg',
      meals: [
        {
          name: '測試餐點',
          price: 100,
          optionGroups: [['選項1', '選項2']],
          addons: [{ name: '加購1', price: 10 }]
        }
      ]
    };

    const mockResponse: ImportMenuResponse = {
      success: true,
      message: '匯入成功',
      data: {
        restaurantName: '測試餐廳',
        mealsImported: 1,
        addonsImported: 1
      }
    };

    // Mock fetch
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    }) as any;

    const result = await importMenuData(mockMenuData);

    expect(result).toEqual(mockResponse);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      mockApiUrl,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          action: 'import',
          data: mockMenuData
        })
      })
    );
  });

  it('should throw error when VITE_GOOGLE_SCRIPT_URL is not set', async () => {
    import.meta.env.VITE_GOOGLE_SCRIPT_URL = '';

    const mockMenuData: ImportMenuData = {
      restaurantName: '測試餐廳',
      menuImageUrl: '',
      meals: []
    };

    await expect(importMenuData(mockMenuData)).rejects.toThrow(
      '未設定 VITE_GOOGLE_SCRIPT_URL 環境變數'
    );
  });

  it('should throw error when HTTP response is not ok', async () => {
    const mockMenuData: ImportMenuData = {
      restaurantName: '測試餐廳',
      menuImageUrl: '',
      meals: []
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    }) as any;

    await expect(importMenuData(mockMenuData)).rejects.toThrow(
      'HTTP 錯誤！狀態碼: 500'
    );
  });

  it('should throw error when API returns success: false', async () => {
    const mockMenuData: ImportMenuData = {
      restaurantName: '測試餐廳',
      menuImageUrl: '',
      meals: []
    };

    const mockResponse: ImportMenuResponse = {
      success: false,
      error: 'Google Sheets 錯誤'
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    }) as any;

    await expect(importMenuData(mockMenuData)).rejects.toThrow(
      '匯入菜單失敗: Google Sheets 錯誤'
    );
  });

  it('should handle network errors', async () => {
    const mockMenuData: ImportMenuData = {
      restaurantName: '測試餐廳',
      menuImageUrl: '',
      meals: []
    };

    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch')) as any;

    await expect(importMenuData(mockMenuData)).rejects.toThrow(
      '網路連線失敗，請檢查網路連線後重試'
    );
  });

  it('should send correct request format with action field', async () => {
    const mockMenuData: ImportMenuData = {
      restaurantName: '測試餐廳',
      menuImageUrl: 'https://example.com/menu.jpg',
      meals: [
        {
          name: '餐點1',
          price: 150,
          imageUrl: 'https://example.com/meal1.jpg',
          optionGroups: [['不辣', '小辣'], ['細麵', '粗麵']],
          addons: [
            { name: '加麵', price: 10 },
            { name: '滷蛋', price: 15 }
          ]
        }
      ]
    };

    const mockResponse: ImportMenuResponse = {
      success: true,
      message: '匯入成功',
      data: {
        restaurantName: '測試餐廳',
        mealsImported: 1,
        addonsImported: 2
      }
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    }) as any;

    await importMenuData(mockMenuData);

    // 驗證請求格式
    const fetchCall = (globalThis.fetch as any).mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);

    expect(requestBody).toHaveProperty('action', 'import');
    expect(requestBody).toHaveProperty('data');
    expect(requestBody.data).toEqual(mockMenuData);
  });

  it('should handle empty meals array', async () => {
    const mockMenuData: ImportMenuData = {
      restaurantName: '空餐廳',
      menuImageUrl: '',
      meals: []
    };

    const mockResponse: ImportMenuResponse = {
      success: true,
      message: '匯入成功',
      data: {
        restaurantName: '空餐廳',
        mealsImported: 0,
        addonsImported: 0
      }
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    }) as any;

    const result = await importMenuData(mockMenuData);

    expect(result.success).toBe(true);
    expect(result.data?.mealsImported).toBe(0);
  });

  it('should handle meals with optional imageUrl', async () => {
    const mockMenuData: ImportMenuData = {
      restaurantName: '測試餐廳',
      menuImageUrl: '',
      meals: [
        {
          name: '無圖片餐點',
          price: 100,
          // imageUrl 是選填的
          optionGroups: [],
          addons: []
        }
      ]
    };

    const mockResponse: ImportMenuResponse = {
      success: true,
      message: '匯入成功',
      data: {
        restaurantName: '測試餐廳',
        mealsImported: 1,
        addonsImported: 0
      }
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    }) as any;

    const result = await importMenuData(mockMenuData);

    expect(result.success).toBe(true);
  });
});
