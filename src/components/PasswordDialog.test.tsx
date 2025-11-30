import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordDialog from './PasswordDialog';

// 簡化的 matchers，不使用 jest-dom
const toBeInTheDocument = (element: any) => {
  return element !== null;
};

const toBeDisabled = (element: any) => {
  return element.disabled === true;
};

describe('PasswordDialog', () => {
  const mockOnAuthenticated = vi.fn();
  const originalEnv = import.meta.env.VITE_ADMIN_PASSWORD;

  beforeEach(() => {
    mockOnAuthenticated.mockClear();
    sessionStorage.clear();
  });

  afterEach(() => {
    import.meta.env.VITE_ADMIN_PASSWORD = originalEnv;
  });

  it('should render password input field', () => {
    import.meta.env.VITE_ADMIN_PASSWORD = 'test123';
    render(<PasswordDialog onAuthenticated={mockOnAuthenticated} />);

    expect(toBeInTheDocument(screen.getByLabelText(/管理員密碼/i))).toBe(true);
    expect(toBeInTheDocument(screen.getByPlaceholderText(/請輸入密碼/i))).toBe(true);
  });

  it('should render submit button', () => {
    import.meta.env.VITE_ADMIN_PASSWORD = 'test123';
    render(<PasswordDialog onAuthenticated={mockOnAuthenticated} />);

    expect(toBeInTheDocument(screen.getByRole('button', { name: /確認/i }))).toBe(true);
  });

  it('should disable submit button when password is empty', () => {
    import.meta.env.VITE_ADMIN_PASSWORD = 'test123';
    render(<PasswordDialog onAuthenticated={mockOnAuthenticated} />);

    const submitButton = screen.getByRole('button', { name: /確認/i });
    expect(toBeDisabled(submitButton)).toBe(true);
  });

  it('should enable submit button when password is entered', () => {
    import.meta.env.VITE_ADMIN_PASSWORD = 'test123';
    render(<PasswordDialog onAuthenticated={mockOnAuthenticated} />);

    const passwordInput = screen.getByLabelText(/管理員密碼/i);
    fireEvent.change(passwordInput, { target: { value: 'test123' } });

    const submitButton = screen.getByRole('button', { name: /確認/i });
    expect(toBeDisabled(submitButton)).toBe(false);
  });

  it('should call onAuthenticated and set sessionStorage when correct password is entered', () => {
    import.meta.env.VITE_ADMIN_PASSWORD = 'correct_password';
    render(<PasswordDialog onAuthenticated={mockOnAuthenticated} />);

    const passwordInput = screen.getByLabelText(/管理員密碼/i);
    const submitButton = screen.getByRole('button', { name: /確認/i });

    fireEvent.change(passwordInput, { target: { value: 'correct_password' } });
    fireEvent.click(submitButton);

    expect(sessionStorage.getItem('admin_authenticated')).toBe('true');
    expect(mockOnAuthenticated).toHaveBeenCalledTimes(1);
  });

  it('should show error message when incorrect password is entered', () => {
    import.meta.env.VITE_ADMIN_PASSWORD = 'correct_password';
    render(<PasswordDialog onAuthenticated={mockOnAuthenticated} />);

    const passwordInput = screen.getByLabelText(/管理員密碼/i);
    const submitButton = screen.getByRole('button', { name: /確認/i });

    fireEvent.change(passwordInput, { target: { value: 'wrong_password' } });
    fireEvent.click(submitButton);

    expect(toBeInTheDocument(screen.getByText(/密碼錯誤，請重試/i))).toBe(true);
    expect(sessionStorage.getItem('admin_authenticated')).toBeNull();
    expect(mockOnAuthenticated).not.toHaveBeenCalled();
  });

  it('should clear password input after incorrect password', () => {
    import.meta.env.VITE_ADMIN_PASSWORD = 'correct_password';
    render(<PasswordDialog onAuthenticated={mockOnAuthenticated} />);

    const passwordInput = screen.getByLabelText(/管理員密碼/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /確認/i });

    fireEvent.change(passwordInput, { target: { value: 'wrong_password' } });
    fireEvent.click(submitButton);

    expect(passwordInput.value).toBe('');
  });

  it('should show error when VITE_ADMIN_PASSWORD is not set', () => {
    import.meta.env.VITE_ADMIN_PASSWORD = '';
    render(<PasswordDialog onAuthenticated={mockOnAuthenticated} />);

    const passwordInput = screen.getByLabelText(/管理員密碼/i);
    const submitButton = screen.getByRole('button', { name: /確認/i });

    fireEvent.change(passwordInput, { target: { value: 'any_password' } });
    fireEvent.click(submitButton);

    expect(toBeInTheDocument(screen.getByText(/系統配置錯誤：未設定管理員密碼/i))).toBe(true);
    expect(mockOnAuthenticated).not.toHaveBeenCalled();
  });

  it('should handle form submission via Enter key', () => {
    import.meta.env.VITE_ADMIN_PASSWORD = 'test123';
    render(<PasswordDialog onAuthenticated={mockOnAuthenticated} />);

    const passwordInput = screen.getByLabelText(/管理員密碼/i);
    
    fireEvent.change(passwordInput, { target: { value: 'test123' } });
    fireEvent.submit(passwordInput.closest('form')!);

    expect(sessionStorage.getItem('admin_authenticated')).toBe('true');
    expect(mockOnAuthenticated).toHaveBeenCalledTimes(1);
  });
});
