import { cn } from '@/lib/utils';
import type { Priority, TodoFilter } from '../types';

interface TodoFiltersProps {
  filter: Partial<TodoFilter>;
  onFilterChange: (filter: Partial<TodoFilter>) => void;
}

const statusOptions: { value: TodoFilter['filter']; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const priorityOptions: { value: Priority | 'all'; label: string; color?: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High', color: 'text-red-500' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
  { value: 'low', label: 'Low', color: 'text-green-500' },
];

export function TodoFilters({ filter, onFilterChange }: TodoFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Status Filter */}
      <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange({ ...filter, filter: option.value })}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              filter.filter === option.value
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Priority Filter */}
      <select
        value={filter.priority ?? 'all'}
        onChange={(e) => {
          const value = e.target.value;
          onFilterChange({
            ...filter,
            priority: value === 'all' ? undefined : (value as Priority),
          });
        }}
        className="rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {priorityOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      {(filter.filter !== 'all' || filter.priority || filter.search || filter.categoryId) && (
        <button
          onClick={() => onFilterChange({ filter: 'all' })}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
