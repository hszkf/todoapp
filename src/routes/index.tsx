import { createFileRoute } from '@tanstack/react-router';
import { useState, useCallback } from 'react';
import { Plus, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TodoList, TodoForm, TodoFilters, TodoSearch } from '@/features/todos/components';
import { CategoryList, CategoryForm } from '@/features/categories/components';
import { StatsCard } from '@/features/stats/components/StatsCard';
import type { TodoFilter } from '@/features/todos/types';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const [filter, setFilter] = useState<Partial<TodoFilter>>({ filter: 'all' });
  const [isTodoFormOpen, setIsTodoFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFilterChange = useCallback((newFilter: Partial<TodoFilter>) => {
    setFilter(newFilter);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string | undefined) => {
    setFilter((prev) => ({ ...prev, categoryId }));
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setFilter((prev) => ({ ...prev, search: search || undefined }));
  }, []);

  const getTitle = () => {
    if (filter.categoryId) {
      return 'Category Todos';
    }
    switch (filter.filter) {
      case 'active':
        return 'Active Todos';
      case 'completed':
        return 'Completed Todos';
      default:
        return 'All Todos';
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-background border-r pt-14 transition-transform duration-200 lg:relative lg:pt-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col p-4">
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h2 className="font-semibold">Categories</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded p-1 hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <CategoryList
            selectedCategoryId={filter.categoryId}
            onCategorySelect={handleCategorySelect}
            onAddCategory={() => setIsCategoryFormOpen(true)}
          />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="rounded p-2 hover:bg-accent lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold flex-1">{getTitle()}</h1>
              <button
                onClick={() => setIsTodoFormOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Todo</span>
              </button>
            </div>

            {/* Statistics */}
            <StatsCard />

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <TodoSearch
                value={filter.search ?? ''}
                onChange={handleSearchChange}
              />
              <TodoFilters filter={filter} onFilterChange={handleFilterChange} />
            </div>

            {/* Todo List */}
            <TodoList filter={filter} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <TodoForm isOpen={isTodoFormOpen} onClose={() => setIsTodoFormOpen(false)} />
      <CategoryForm isOpen={isCategoryFormOpen} onClose={() => setIsCategoryFormOpen(false)} />
    </div>
  );
}
