/**
 * Unit tests for QuantitySelector component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import QuantitySelector from './QuantitySelector';

describe('QuantitySelector', () => {
  it('should render quantity value', () => {
    const mockIncrement = vi.fn();
    const mockDecrement = vi.fn();
    
    render(
      <QuantitySelector
        quantity={5}
        onIncrement={mockIncrement}
        onDecrement={mockDecrement}
      />
    );
    
    expect(screen.getByText('5')).toBeDefined();
  });

  it('should call onIncrement when plus button is clicked', async () => {
    const user = userEvent.setup();
    const mockIncrement = vi.fn();
    const mockDecrement = vi.fn();
    
    render(
      <QuantitySelector
        quantity={1}
        onIncrement={mockIncrement}
        onDecrement={mockDecrement}
      />
    );
    
    const incrementButton = screen.getByLabelText('增加數量');
    await user.click(incrementButton);
    
    expect(mockIncrement).toHaveBeenCalledTimes(1);
  });

  it('should call onDecrement when minus button is clicked', async () => {
    const user = userEvent.setup();
    const mockIncrement = vi.fn();
    const mockDecrement = vi.fn();
    
    render(
      <QuantitySelector
        quantity={5}
        onIncrement={mockIncrement}
        onDecrement={mockDecrement}
      />
    );
    
    const decrementButton = screen.getByLabelText('減少數量');
    await user.click(decrementButton);
    
    expect(mockDecrement).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when isDisabled is true', () => {
    const mockIncrement = vi.fn();
    const mockDecrement = vi.fn();
    
    render(
      <QuantitySelector
        quantity={5}
        onIncrement={mockIncrement}
        onDecrement={mockDecrement}
        isDisabled={true}
      />
    );
    
    const incrementButton = screen.getByLabelText('增加數量');
    const decrementButton = screen.getByLabelText('減少數量');
    
    expect(incrementButton.hasAttribute('disabled')).toBe(true);
    expect(decrementButton.hasAttribute('disabled')).toBe(true);
  });

  it('should not call handlers when disabled', async () => {
    const user = userEvent.setup();
    const mockIncrement = vi.fn();
    const mockDecrement = vi.fn();
    
    render(
      <QuantitySelector
        quantity={5}
        onIncrement={mockIncrement}
        onDecrement={mockDecrement}
        isDisabled={true}
      />
    );
    
    const incrementButton = screen.getByLabelText('增加數量');
    const decrementButton = screen.getByLabelText('減少數量');
    
    await user.click(incrementButton);
    await user.click(decrementButton);
    
    expect(mockIncrement).not.toHaveBeenCalled();
    expect(mockDecrement).not.toHaveBeenCalled();
  });

  it('should handle boundary condition at quantity 1', () => {
    const mockIncrement = vi.fn();
    const mockDecrement = vi.fn();
    
    render(
      <QuantitySelector
        quantity={1}
        onIncrement={mockIncrement}
        onDecrement={mockDecrement}
      />
    );
    
    expect(screen.getByText('1')).toBeDefined();
  });

  it('should handle boundary condition at quantity 99', () => {
    const mockIncrement = vi.fn();
    const mockDecrement = vi.fn();
    
    render(
      <QuantitySelector
        quantity={99}
        onIncrement={mockIncrement}
        onDecrement={mockDecrement}
      />
    );
    
    expect(screen.getByText('99')).toBeDefined();
  });
});
