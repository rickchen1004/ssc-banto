/**
 * TotalAmount 元件
 * 顯示當前訂單的總金額，包含餐點小計和加購項目明細
 * 
 * 需求: 2.1, 2.3, 2.4, 6.1, 6.2, 6.4, 6.5
 */

import { formatCurrency } from '../utils/calculations';

interface TotalAmountProps {
  amount: number;
  mealSubtotal: number;
  addonsTotal: number;
}

/**
 * 總金額顯示元件
 * 
 * @param amount - 當前總金額
 * @param mealSubtotal - 餐點小計
 * @param addonsTotal - 加購總價
 */
export default function TotalAmount({ amount, mealSubtotal, addonsTotal }: TotalAmountProps) {
  return (
    <div className="relative bg-gradient-to-r from-[#6B7C6E] via-[#5a6b5d] to-[#6B7C6E] rounded-3xl shadow-2xl p-7 overflow-hidden border border-[#6B7C6E]">
      <div className="relative space-y-4">
        {/* 明細區域 */}
        <div className="space-y-2">
          {/* 餐點小計 */}
          {mealSubtotal > 0 && (
            <div className="flex items-center justify-between text-[#E8DCC4]/90">
              <span className="text-sm font-medium">餐點小計</span>
              <span className="text-base font-semibold">{formatCurrency(mealSubtotal)}</span>
            </div>
          )}
          
          {/* 加購項目 */}
          {addonsTotal > 0 && (
            <div className="flex items-center justify-between text-[#E8DCC4]/90">
              <span className="text-sm font-medium">加購項目</span>
              <span className="text-base font-semibold">{formatCurrency(addonsTotal)}</span>
            </div>
          )}
          
          {/* 分隔線 */}
          {(mealSubtotal > 0 || addonsTotal > 0) && (
            <div className="border-t border-[#E8DCC4]/30 pt-3 mt-3"></div>
          )}
        </div>

        {/* 總計區域 */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-[#E8DCC4] rounded-full animate-pulse"></div>
              <p className="text-[#E8DCC4]/80 text-sm font-medium">訂單總計</p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#E8DCC4] tracking-tight">
              {formatCurrency(amount)}
            </h2>
          </div>
          <div className="w-16 h-16 bg-[#E8DCC4]/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-[#E8DCC4]/50">
            <svg className="w-9 h-9 text-[#E8DCC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
