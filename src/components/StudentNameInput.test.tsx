/**
 * 學生姓名輸入元件的屬性測試
 * 使用 fast-check 進行屬性基礎測試
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { fc } from '@fast-check/vitest';
import userEvent from '@testing-library/user-event';
import StudentNameInput from './StudentNameInput';

/**
 * **Feature: student-lunch-order, Property 12: 姓名輸入的即時反映**
 * **驗證需求: 5.2**
 * 
 * 對於任意文字輸入，在姓名欄位中輸入的內容應該即時顯示在介面上
 */
describe('屬性 12: 姓名輸入的即時反映', () => {
  it('對於任意文字輸入，輸入的內容應該即時顯示在輸入欄位中', () => {
    fc.assert(
      fc.asyncProperty(
        // 生成任意字串（包含中文、英文、數字、空格等）
        fc.string({ minLength: 0, maxLength: 50 }),
        async (inputText) => {
          // 建立狀態追蹤
          let currentValue = '';
          const handleChange = (value: string) => {
            currentValue = value;
          };

          // 渲染元件
          const { rerender } = render(
            <StudentNameInput value={currentValue} onChange={handleChange} />
          );

          // 取得輸入欄位
          const input = screen.getByPlaceholderText('請輸入姓名') as HTMLInputElement;

          // 模擬使用者輸入
          const user = userEvent.setup();
          await user.clear(input);
          await user.type(input, inputText);

          // 重新渲染以反映狀態變化
          rerender(
            <StudentNameInput value={currentValue} onChange={handleChange} />
          );

          // 驗證輸入欄位的值與輸入的文字相同
          expect(input.value).toBe(inputText);
          
          // 驗證 onChange 被正確呼叫，且最終值正確
          expect(currentValue).toBe(inputText);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('當 value prop 改變時，輸入欄位應該即時更新顯示', () => {
    fc.assert(
      fc.property(
        // 生成兩個不同的字串
        fc.string({ minLength: 0, maxLength: 50 }),
        fc.string({ minLength: 0, maxLength: 50 }),
        (value1, value2) => {
          const handleChange = () => {};

          // 渲染元件並設定初始值
          const { rerender, container } = render(
            <StudentNameInput value={value1} onChange={handleChange} />
          );

          const input = container.querySelector('input') as HTMLInputElement;

          // 驗證初始值
          expect(input.value).toBe(value1);

          // 更新 value prop
          rerender(
            <StudentNameInput value={value2} onChange={handleChange} />
          );

          // 驗證值已更新
          expect(input.value).toBe(value2);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('當輸入非空字串時，應該顯示確認訊息', () => {
    fc.assert(
      fc.property(
        // 生成非空且非純空白的字串
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (inputText) => {
          const handleChange = () => {};

          // 渲染元件
          const { container } = render(
            <StudentNameInput value={inputText} onChange={handleChange} />
          );

          // 驗證確認訊息存在（查找包含 "姓名：" 的段落）
          const confirmationText = container.querySelector('p.text-sm');
          
          // 返回 boolean 而不是使用 expect
          return (
            confirmationText !== null &&
            confirmationText.textContent !== null &&
            confirmationText.textContent.includes('姓名：') &&
            confirmationText.textContent.includes(inputText)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('當輸入為空字串時，不應該顯示確認訊息', () => {
    const handleChange = () => {};

    // 渲染元件
    render(
      <StudentNameInput value="" onChange={handleChange} />
    );

    // 驗證確認訊息不存在
    const confirmationText = screen.queryByText(/^姓名：/);
    expect(confirmationText).toBeNull();
  });
});
