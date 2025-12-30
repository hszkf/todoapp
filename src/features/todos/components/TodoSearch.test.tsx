import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/tests/test-utils';
import { TodoSearch } from './TodoSearch';

describe('TodoSearch', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render search input', () => {
    render(<TodoSearch value="" onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText('Search todos...')).toBeInTheDocument();
  });

  it('should display the current value', () => {
    render(<TodoSearch value="test query" onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('Search todos...') as HTMLInputElement;
    expect(input.value).toBe('test query');
  });

  it('should debounce the onChange call', async () => {
    render(<TodoSearch value="" onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('Search todos...');

    fireEvent.change(input, { target: { value: 'test' } });

    // Should not call immediately
    expect(mockOnChange).not.toHaveBeenCalled();

    // Fast-forward timers
    vi.advanceTimersByTime(300);

    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  it('should show clear button when there is input', () => {
    render(<TodoSearch value="test" onChange={mockOnChange} />);
    // The clear button is rendered when localValue is not empty
    const input = screen.getByPlaceholderText('Search todos...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });

    // There should be an X button to clear
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should clear input when clicking clear button', async () => {
    render(<TodoSearch value="test" onChange={mockOnChange} />);

    // Find and click the clear button
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('should not show clear button when input is empty', () => {
    render(<TodoSearch value="" onChange={mockOnChange} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('TodoSearch Debounce Behavior', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should only call onChange once after rapid typing', async () => {
    render(<TodoSearch value="" onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('Search todos...');

    // Type multiple characters quickly
    fireEvent.change(input, { target: { value: 't' } });
    vi.advanceTimersByTime(100);
    fireEvent.change(input, { target: { value: 'te' } });
    vi.advanceTimersByTime(100);
    fireEvent.change(input, { target: { value: 'tes' } });
    vi.advanceTimersByTime(100);
    fireEvent.change(input, { target: { value: 'test' } });

    // After final timeout
    vi.advanceTimersByTime(300);

    // Should only have been called once with the final value
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  it('should wait for full debounce time before calling onChange', async () => {
    render(<TodoSearch value="" onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('Search todos...');

    fireEvent.change(input, { target: { value: 'search' } });

    // Advance less than debounce time
    vi.advanceTimersByTime(200);
    expect(mockOnChange).not.toHaveBeenCalled();

    // Advance remaining time
    vi.advanceTimersByTime(100);
    expect(mockOnChange).toHaveBeenCalledWith('search');
  });
});
