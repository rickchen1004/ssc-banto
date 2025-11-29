import './App.css';
import { useOrderState } from './hooks/useOrderState';
import MenuDisplay from './components/MenuDisplay';
import MealSelector from './components/MealSelector';
import OptionsSelector from './components/OptionsSelector';
import AddonsSelector from './components/AddonsSelector';
import StudentNameInput from './components/StudentNameInput';
import TotalAmount from './components/TotalAmount';
import SubmitButton from './components/SubmitButton';
import Notification from './components/Notification';

function App() {
  const {
    state,
    totalAmount,
    canSubmit,
    loadConfiguration,
    selectMeal,
    toggleOption,
    toggleAddon,
    setStudentName,
    handleSubmitOrder,
    clearNotification,
  } = useOrderState();

  // 載入中狀態
  if (state.isLoadingConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <MenuDisplay
          menuImageUrl=""
          restaurantName=""
          isLoading={true}
        />
      </div>
    );
  }

  // 錯誤狀態
  if (state.configError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-red-600">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">載入失敗</h2>
            <p className="text-gray-600 text-center text-sm">{state.configError}</p>
            <button
              onClick={loadConfiguration}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
            >
              重試
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 正常顯示
  if (!state.configuration) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 菜單顯示 */}
        <MenuDisplay
          menuImageUrl={state.configuration.menuImageUrl}
          restaurantName={state.configuration.restaurantName}
          onRetry={loadConfiguration}
        />

        {/* 餐點選擇 */}
        <MealSelector
          meals={state.configuration.meals}
          selectedMeal={state.selectedMeal}
          onSelectMeal={selectMeal}
        />

        {/* 備註選項 */}
        {state.selectedMeal && (
          <OptionsSelector
            options={state.selectedMeal.options}
            selectedOptions={state.selectedOptions}
            isDisabled={!state.selectedMeal}
            onToggleOption={toggleOption}
          />
        )}

        {/* 加購項目 */}
        {state.selectedMeal && (
          <AddonsSelector
            addons={state.selectedMeal.addons}
            selectedAddons={state.selectedAddons}
            isDisabled={!state.selectedMeal}
            onToggleAddon={toggleAddon}
          />
        )}

        {/* 學生姓名輸入 */}
        <StudentNameInput
          value={state.studentName}
          onChange={setStudentName}
        />

        {/* 總金額顯示 */}
        <TotalAmount amount={totalAmount} />

        {/* 提交按鈕 */}
        <SubmitButton
          isDisabled={!canSubmit}
          isSubmitting={state.isSubmitting}
          onClick={handleSubmitOrder}
        />

        {/* 通知訊息 */}
        <Notification
          type={state.notification.type}
          message={state.notification.message}
          onClose={clearNotification}
        />
      </div>
    </div>
  );
}

export default App;
