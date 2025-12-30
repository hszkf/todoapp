import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/tests/test-utils';
import { TodoItem } from './TodoItem';
import type { Todo } from '@/db/schema';

// Mock the hooks
vi.mock('../hooks', () => ({
  useToggleTodo: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useDeleteTodo: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

const mockTodo: Todo = {
  id: 'todo-1',
  title: 'Test Todo',
  description: 'Test description',
  completed: false,
  priority: 'medium',
  dueDate: null,
  categoryId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCategories = [
  { id: 'cat-1', name: 'Work', color: '#3b82f6', createdAt: new Date() },
  { id: 'cat-2', name: 'Personal', color: '#22c55e', createdAt: new Date() },
];

describe('TodoItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render todo title', () => {
    render(<TodoItem todo={mockTodo} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('should render todo description', () => {
    render(<TodoItem todo={mockTodo} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should render checkbox unchecked for incomplete todo', () => {
    render(<TodoItem todo={mockTodo} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checkbox checked for completed todo', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should apply strikethrough style for completed todo', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} />);
    const title = screen.getByText('Test Todo');
    expect(title).toHaveClass('line-through');
  });

  it('should render delete button', () => {
    render(<TodoItem todo={mockTodo} />);
    expect(screen.getByTitle('Delete todo')).toBeInTheDocument();
  });

  it('should render priority indicator', () => {
    render(<TodoItem todo={mockTodo} />);
    expect(screen.getByTitle('Priority: medium')).toBeInTheDocument();
  });

  it('should render high priority with red color', () => {
    const highPriorityTodo = { ...mockTodo, priority: 'high' as const };
    render(<TodoItem todo={highPriorityTodo} />);
    expect(screen.getByTitle('Priority: high')).toBeInTheDocument();
  });

  it('should render low priority with green color', () => {
    const lowPriorityTodo = { ...mockTodo, priority: 'low' as const };
    render(<TodoItem todo={lowPriorityTodo} />);
    expect(screen.getByTitle('Priority: low')).toBeInTheDocument();
  });

  it('should render category badge when category exists', () => {
    const todoWithCategory = { ...mockTodo, categoryId: 'cat-1' };
    render(<TodoItem todo={todoWithCategory} categories={mockCategories} />);
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('should not render category badge when no category', () => {
    render(<TodoItem todo={mockTodo} categories={mockCategories} />);
    expect(screen.queryByText('Work')).not.toBeInTheDocument();
  });

  it('should render due date when provided', () => {
    const todoWithDueDate = {
      ...mockTodo,
      dueDate: new Date('2024-12-31'),
    };
    render(<TodoItem todo={todoWithDueDate} />);
    expect(screen.getByText(/Dec 31, 2024/)).toBeInTheDocument();
  });

  it('should not render due date section when not provided', () => {
    render(<TodoItem todo={mockTodo} />);
    expect(screen.queryByText(/\d{4}/)).not.toBeInTheDocument();
  });
});
