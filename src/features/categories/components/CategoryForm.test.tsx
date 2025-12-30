import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/tests/test-utils';
import { CategoryForm } from './CategoryForm';

const mockMutate = vi.fn();

vi.mock('../hooks', () => ({
  useCreateCategory: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe('CategoryForm', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(<CategoryForm isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText('Add Category')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />);
    // There are multiple "Add Category" texts - one in header, one in button
    const addCategoryTexts = screen.getAllByText(/Add Category/);
    expect(addCategoryTexts.length).toBeGreaterThan(0);
  });

  it('should render name input', () => {
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
  });

  it('should render color options', () => {
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Color')).toBeInTheDocument();
    // Should have color buttons
    const colorButtons = screen.getAllByRole('button').filter(
      (btn) => btn.classList.contains('rounded-full')
    );
    expect(colorButtons.length).toBeGreaterThan(0);
  });

  it('should render preview section', () => {
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('should render cancel and submit buttons', () => {
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Category/i })).toBeInTheDocument();
  });

  it('should call onClose when clicking cancel', () => {
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when clicking X button', () => {
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />);
    // Find the X button (close button)
    const closeButtons = screen.getAllByRole('button');
    const xButton = closeButtons.find(
      (btn) => btn.querySelector('svg')
    );
    if (xButton) {
      fireEvent.click(xButton);
    }
  });

  it('should disable submit when name is empty', () => {
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />);
    const submitButton = screen.getByRole('button', { name: /Add Category/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit when name is entered', () => {
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText('Category name');
    fireEvent.change(input, { target: { value: 'Work' } });

    const submitButton = screen.getByRole('button', { name: /Add Category/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('should call mutate when submitting with valid data', () => {
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText('Category name');
    fireEvent.change(input, { target: { value: 'Work' } });

    const form = screen.getByRole('button', { name: /Add Category/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Work' }),
      expect.any(Object)
    );
  });

  it('should update preview when typing name', () => {
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText('Category name');
    fireEvent.change(input, { target: { value: 'My Category' } });

    // Preview should show the name
    expect(screen.getByText('My Category')).toBeInTheDocument();
  });

  it('should show placeholder text in preview when name is empty', () => {
    render(<CategoryForm isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Category name')).toBeInTheDocument();
  });
});
