import { useTodos } from '../hooks';
import { useCategories } from '@/features/categories/hooks';
import { TodoItem } from './TodoItem';
import type { TodoFilter } from '../types';
import { Inbox } from 'lucide-react';

interface TodoListProps {
  filter: Partial<TodoFilter>;
}

export function TodoList({ filter }: TodoListProps) {
  const { data: todosData, isLoading, error } = useTodos(filter);
  const { data: categoriesData } = useCategories();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border bg-card p-4"
          >
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
        Failed to load todos. Please try again.
      </div>
    );
  }

  const todos = todosData?.data ?? [];
  const categories = categoriesData?.data ?? [];

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-12 text-center">
        <Inbox className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No todos found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {filter.filter === 'completed'
            ? "You haven't completed any todos yet."
            : filter.filter === 'active'
              ? 'All caught up! No active todos.'
              : 'Get started by adding a new todo.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} categories={categories} />
      ))}
    </div>
  );
}
