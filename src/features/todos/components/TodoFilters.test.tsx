import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests/test-utils';
import { TodoFilters } from './TodoFilters';

describe('TodoFilters', () => {
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all status buttons', () => {
    render(
      <TodoFilters filter={{ filter: 'all' }} onFilterChange={mockOnFilterChange} />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should highlight the active filter button', () => {
    render(
      <TodoFilters filter={{ filter: 'all' }} onFilterChange={mockOnFilterChange} />
    );

    const allButton = screen.getByText('All');
    expect(allButton).toHaveClass('bg-primary');
  });

  it('should call onFilterChange when clicking status buttons', () => {
    render(
      <TodoFilters filter={{ filter: 'all' }} onFilterChange={mockOnFilterChange} />
    );

    fireEvent.click(screen.getByText('Active'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ filter: 'active' }));
  });

  it('should render priority dropdown', () => {
    render(
      <TodoFilters filter={{ filter: 'all' }} onFilterChange={mockOnFilterChange} />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('All Priorities')).toBeInTheDocument();
  });

  it('should call onFilterChange when changing priority', () => {
    render(
      <TodoFilters filter={{ filter: 'all' }} onFilterChange={mockOnFilterChange} />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'high' } });

    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it('should show clear filters button when filters are applied', () => {
    render(
      <TodoFilters
        filter={{ filter: 'active', priority: 'high' }}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByText('Clear filters')).toBeInTheDocument();
  });

  it('should not show clear filters when no filters applied', () => {
    render(
      <TodoFilters filter={{ filter: 'all' }} onFilterChange={mockOnFilterChange} />
    );

    expect(screen.queryByText('Clear filters')).not.toBeInTheDocument();
  });

  it('should reset filters when clicking clear', () => {
    render(
      <TodoFilters
        filter={{ filter: 'active', priority: 'high' }}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByText('Clear filters'));
    expect(mockOnFilterChange).toHaveBeenCalledWith({ filter: 'all' });
  });
});
