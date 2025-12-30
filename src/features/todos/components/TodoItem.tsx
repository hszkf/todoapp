import { useCallback } from 'react';
import { Trash2, Calendar, Flag } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToggleTodo, useDeleteTodo } from '../hooks';
import type { Todo } from '@/db/schema';
import type { Category } from '@/db/schema';

interface TodoItemProps {
  todo: Todo;
  categories?: Category[];
}

const priorityColors = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
};

export function TodoItem({ todo, categories = [] }: TodoItemProps) {
  const toggleMutation = useToggleTodo();
  const deleteMutation = useDeleteTodo();

  const handleToggle = useCallback(() => {
    toggleMutation.mutate(todo.id);
  }, [toggleMutation, todo.id]);

  const handleDelete = useCallback(() => {
    deleteMutation.mutate(todo.id);
  }, [deleteMutation, todo.id]);

  const category = categories.find((c) => c.id === todo.categoryId);
  const isOverdue =
    todo.dueDate && isPast(new Date(todo.dueDate)) && !todo.completed;
  const isDueToday = todo.dueDate && isToday(new Date(todo.dueDate));

  return (
    <div
      className={cn(
        'group flex items-start gap-3 rounded-lg border bg-card p-4 transition-all hover:shadow-sm',
        todo.completed && 'opacity-60'
      )}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={toggleMutation.isPending}
        className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-medium',
              todo.completed && 'line-through text-muted-foreground'
            )}
          >
            {todo.title}
          </span>

          {/* Priority flag */}
          <span title={`Priority: ${todo.priority}`}>
            <Flag className={cn('h-4 w-4', priorityColors[todo.priority])} />
          </span>
        </div>

        {/* Description */}
        {todo.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {todo.description}
          </p>
        )}

        {/* Meta info */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {/* Category badge */}
          {category && (
            <span
              className="rounded-full px-2 py-0.5 text-white"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          )}

          {/* Due date */}
          {todo.dueDate && (
            <span
              className={cn(
                'flex items-center gap-1',
                isOverdue && 'text-red-500 font-medium',
                isDueToday && !isOverdue && 'text-yellow-500'
              )}
            >
              <Calendar className="h-3 w-3" />
              {format(new Date(todo.dueDate), 'MMM d, yyyy')}
              {isOverdue && ' (Overdue)'}
              {isDueToday && !isOverdue && ' (Today)'}
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
        className="opacity-0 group-hover:opacity-100 rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        title="Delete todo"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
