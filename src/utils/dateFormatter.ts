/**
 * 日期時間格式化工具
 * 用於將日期轉換為台灣時區的特定格式
 */

/**
 * 格式化日期時間為台灣時區的字串
 * 格式：yyyy-mm-dd HH:MM:SS
 * 
 * @param date - 要格式化的日期物件（預設為當前時間）
 * @returns 格式化後的日期時間字串，例如：2024-01-15 14:30:45
 */
export function formatTaiwanDateTime(date: Date = new Date()): string {
  // 使用 toLocaleString 轉換為台灣時區
  // 'zh-TW' 是繁體中文（台灣）
  // 'Asia/Taipei' 是台北時區（UTC+8）
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 使用 24 小時制
  };

  // 取得台灣時區的日期時間字串
  const formatter = new Intl.DateTimeFormat('zh-TW', options);
  const parts = formatter.formatToParts(date);

  // 從 parts 中提取各個部分
  const year = parts.find(p => p.type === 'year')?.value || '';
  const month = parts.find(p => p.type === 'month')?.value || '';
  const day = parts.find(p => p.type === 'day')?.value || '';
  const hour = parts.find(p => p.type === 'hour')?.value || '';
  const minute = parts.find(p => p.type === 'minute')?.value || '';
  const second = parts.find(p => p.type === 'second')?.value || '';

  // 組合成 yyyy-mm-dd HH:MM:SS 格式
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
