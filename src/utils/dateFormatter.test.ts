/**
 * 日期時間格式化工具的測試
 */

import { describe, it, expect } from 'vitest';
import { formatTaiwanDateTime } from './dateFormatter';

describe('formatTaiwanDateTime', () => {
  it('應該返回正確格式的字串 yyyy-mm-dd HH:MM:SS', () => {
    const result = formatTaiwanDateTime();
    
    // 驗證格式：yyyy-mm-dd HH:MM:SS
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    expect(result).toMatch(regex);
  });

  it('應該包含正確的分隔符號', () => {
    const result = formatTaiwanDateTime();
    
    // 驗證包含 - 和 : 和空格
    expect(result).toContain('-');
    expect(result).toContain(':');
    expect(result).toContain(' ');
  });

  it('應該返回當前時間（台灣時區）', () => {
    const result = formatTaiwanDateTime();
    const parts = result.split(/[- :]/);
    
    // 驗證年份在合理範圍內（2024-2030）
    const year = parseInt(parts[0]);
    expect(year).toBeGreaterThanOrEqual(2024);
    expect(year).toBeLessThanOrEqual(2030);
    
    // 驗證月份在 1-12 之間
    const month = parseInt(parts[1]);
    expect(month).toBeGreaterThanOrEqual(1);
    expect(month).toBeLessThanOrEqual(12);
    
    // 驗證日期在 1-31 之間
    const day = parseInt(parts[2]);
    expect(day).toBeGreaterThanOrEqual(1);
    expect(day).toBeLessThanOrEqual(31);
    
    // 驗證小時在 0-23 之間
    const hour = parseInt(parts[3]);
    expect(hour).toBeGreaterThanOrEqual(0);
    expect(hour).toBeLessThanOrEqual(23);
    
    // 驗證分鐘在 0-59 之間
    const minute = parseInt(parts[4]);
    expect(minute).toBeGreaterThanOrEqual(0);
    expect(minute).toBeLessThanOrEqual(59);
    
    // 驗證秒數在 0-59 之間
    const second = parseInt(parts[5]);
    expect(second).toBeGreaterThanOrEqual(0);
    expect(second).toBeLessThanOrEqual(59);
  });

  it('應該能格式化指定的日期', () => {
    // 建立一個特定的日期（UTC 時間）
    const testDate = new Date('2024-01-15T06:30:45Z'); // UTC 時間
    const result = formatTaiwanDateTime(testDate);
    
    // 台灣時區是 UTC+8，所以應該是 14:30:45
    expect(result).toBe('2024-01-15 14:30:45');
  });

  it('應該正確處理跨日的情況', () => {
    // UTC 時間 2024-01-15 16:30:45 -> 台灣時間 2024-01-16 00:30:45
    const testDate = new Date('2024-01-15T16:30:45Z');
    const result = formatTaiwanDateTime(testDate);
    
    expect(result).toBe('2024-01-16 00:30:45');
  });

  it('應該使用兩位數格式化月、日、時、分、秒', () => {
    // UTC 時間 2024-01-05 01:05:09 -> 台灣時間 2024-01-05 09:05:09
    const testDate = new Date('2024-01-05T01:05:09Z');
    const result = formatTaiwanDateTime(testDate);
    
    expect(result).toBe('2024-01-05 09:05:09');
    
    // 驗證所有數字都是兩位數
    const parts = result.split(/[- :]/);
    expect(parts[1]).toHaveLength(2); // 月份
    expect(parts[2]).toHaveLength(2); // 日期
    expect(parts[3]).toHaveLength(2); // 小時
    expect(parts[4]).toHaveLength(2); // 分鐘
    expect(parts[5]).toHaveLength(2); // 秒數
  });
});
