/**
 * 學生姓名輸入元件
 * 提供姓名輸入欄位，即時顯示輸入內容，並提供焦點視覺回饋
 */

interface StudentNameInputProps {
  value: string;
  onChange: (name: string) => void;
  disabled?: boolean;
}

export default function StudentNameInput({ 
  value, 
  onChange, 
  disabled = false 
}: StudentNameInputProps) {
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#A8B5A7] to-[#8B9D8A] rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-[#E8DCC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">訂購人資訊</h2>
        </div>
        <p className="text-gray-600">請輸入您的姓名</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <input
            id="student-name"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="請輸入姓名"
            className={`
              w-full pl-14 pr-5 py-4 rounded-xl text-base text-gray-900 placeholder-gray-400 font-medium
              transition-all duration-200 border-2
              ${
                disabled
                  ? 'bg-gray-50 cursor-not-allowed border-gray-200'
                  : 'bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#E8DCC4]/50 focus:border-[#6B7C6E] focus:outline-none border-gray-200 hover:border-[#8B9D8A]'
              }
            `}
          />
        </div>
        
        {value && (
          <div className="mt-4 p-3 bg-[#E8DCC4]/30 rounded-lg border border-[#6B7C6E]/30">
            <p className="text-sm text-[#6B7C6E] font-medium flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>姓名：{value}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
