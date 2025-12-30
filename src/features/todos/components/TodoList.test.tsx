import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/tests/test-utils';
import { TodoList } from './TodoList';

// Mock the hooks
const mockTodos = [
  {
    id: 'todo-1',
    title: 'First Todo',
    description: null,
    completed: false,
    priority: 'medium' as const,
    dueDate: null,
    categoryId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'todo-2',
    title: 'Second Todo',
    description: 'With description',
    completed: true,
    priority: 'high' as const,
    dueDate: null,
    categoryId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockCategories = [
  { id: 'cat-1', name: 'Work', color: '#3b82f6', createdAt: new Date() },
];

vi.mock('../hooks', () => ({
  useTodos: vi.fn(() => ({
    data: { data: mockTodos },
    isLoading: false,
    error: null,
  })),
  useToggleTodo: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useDeleteTodo: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('@/features/categories/hooks', () => ({
  useCategories: () => ({
    data: { data: mockCategories },
  }),
}));

describe('TodoList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render todos', () => {
    render(<TodoList filter={{ filter: 'all' }} />);
    expect(screen.getByText('First Todo')).toBeInTheDocument();
    expect(screen.getByText('Second Todo')).toBeInTheDocument();
  });

  it('should render todo descriptions', () => {
    render(<TodoList filter={{ filter: 'all' }} />);
    expect(screen.getByText('With description')).toBeInTheDocument();
  });
});

describe('TodoList Loading State', () => {
  it('should render loading skeletons', async () => {
    const { useTodos } = await import('../hooks');
    (useTodos as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<TodoList filter={{ filter: 'all' }} />);

    // Should have skeleton elements
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe('TodoList Error State', () => {
  it('should render error message', async () => {
    const { useTodos } = await import('../hooks');
    (useTodos as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch'),
    });

    render(<TodoList filter={{ filter: 'all' }} />);
    expect(screen.getByText(/Failed to load todos/)).toBeInTheDocument();
  });
});

describe('TodoList Empty State', () => {
  it('should render empty state for all filter', async () => {
    const { useTodos } = await import('../hooks');
    (useTodos as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    });

    render(<TodoList filter={{ filter: 'all' }} />);
    expect(screen.getByText('No todos found')).toBeInTheDocument();
    expect(screen.getByText(/Get started by adding a new todo/)).toBeInTheDocument();
  });

  it('should render empty state for active filter', async () => {
    const { useTodos } = await import('../hooks');
    (useTodos as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    });

    render(<TodoList filter={{ filter: 'active' }} />);
    expect(screen.getByText('No todos found')).toBeInTheDocument();
    expect(screen.getByText(/All caught up/)).toBeInTheDocument();
  });

  it('should render empty state for completed filter', async () => {
    const { useTodos } = await import('../hooks');
    (useTodos as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    });

    render(<TodoList filter={{ filter: 'completed' }} />);
    expect(screen.getByText('No todos found')).toBeInTheDocument();
    expect(screen.getByText(/haven't completed any todos/)).toBeInTheDocument();
  });
});
