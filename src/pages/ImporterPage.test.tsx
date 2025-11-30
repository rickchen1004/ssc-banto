import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImporterPage from './ImporterPage';

// Mock PasswordDialog to simplify testing
vi.mock('../components/PasswordDialog', () => ({
  default: ({ onAuthenticated }: { onAuthenticated: () => void }) => (
    <div data-testid="password-dialog">
      <button onClick={onAuthenticated}>Mock Authenticate</button>
    </div>
  ),
}));

describe('ImporterPage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should show PasswordDialog when not authenticated', () => {
    render(<ImporterPage />);
    
    const passwordDialog = screen.getByTestId('password-dialog');
    expect(passwordDialog).toBeTruthy();
  });

  it('should show importer interface when authenticated', () => {
    // Set authenticated state
    sessionStorage.setItem('admin_authenticated', 'true');
    
    render(<ImporterPage />);
    
    // Check for main heading
    expect(screen.getByText(/菜單資料匯入工具/i)).toBeTruthy();
  });

  it('should render restaurant name input field', () => {
    sessionStorage.setItem('admin_authenticated', 'true');
    render(<ImporterPage />);
    
    expect(screen.getByLabelText(/餐廳名稱/i)).toBeTruthy();
  });

  it('should render menu image URL input field', () => {
    sessionStorage.setItem('admin_authenticated', 'true');
    render(<ImporterPage />);
    
    expect(screen.getByLabelText(/菜單圖片網址/i)).toBeTruthy();
  });

  it('should render JSON textarea', () => {
    sessionStorage.setItem('admin_authenticated', 'true');
    render(<ImporterPage />);
    
    // Find textarea by placeholder since it doesn't have an accessible name
    const textareas = screen.getAllByRole('textbox');
    const jsonTextarea = textareas.find(el => 
      (el as HTMLTextAreaElement).placeholder.includes('JSON')
    );
    expect(jsonTextarea).toBeTruthy();
  });

  it('should render import button', () => {
    sessionStorage.setItem('admin_authenticated', 'true');
    render(<ImporterPage />);
    
    expect(screen.getByRole('button', { name: /匯入到 Google Sheets/i })).toBeTruthy();
  });

  it('should disable import button initially', () => {
    sessionStorage.setItem('admin_authenticated', 'true');
    render(<ImporterPage />);
    
    const importButton = screen.getByRole('button', { name: /匯入到 Google Sheets/i }) as HTMLButtonElement;
    expect(importButton.disabled).toBe(true);
  });
});
