import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategories, useDeleteCategory } from '../hooks';

interface CategoryListProps {
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string | undefined) => void;
  onAddCategory: () => void;
}

export function CategoryList({
  selectedCategoryId,
  onCategorySelect,
  onAddCategory,
}: CategoryListProps) {
  const { data, isLoading } = useCategories();
  const deleteMutation = useDeleteCategory();

  const categories = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse h-8 rounded bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* All categories option */}
      <button
        onClick={() => onCategorySelect(undefined)}
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
          !selectedCategoryId
            ? 'bg-accent text-accent-foreground'
            : 'hover:bg-accent/50'
        )}
      >
        <div className="h-3 w-3 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
        All Categories
      </button>

      {/* Category items */}
      {categories.map((category) => (
        <div key={category.id} className="group flex items-center">
          <button
            onClick={() => onCategorySelect(category.id)}
            className={cn(
              'flex flex-1 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
              selectedCategoryId === category.id
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent/50'
            )}
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="truncate">{category.name}</span>
          </button>
          <button
            onClick={() => deleteMutation.mutate(category.id)}
            disabled={deleteMutation.isPending}
            className="mr-1 rounded p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
            title="Delete category"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      ))}

      {/* Add category button */}
      <button
        onClick={onAddCategory}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Plus className="h-4 w-4" />
        Add Category
      </button>
    </div>
  );
}
