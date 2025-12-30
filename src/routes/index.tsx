import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <Sidebar currentFilter={filter} onFilterChange={setFilter} />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {filter === 'all' && 'All Todos'}
              {filter === 'active' && 'Active Todos'}
              {filter === 'completed' && 'Completed Todos'}
            </h1>
            <button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add Todo
            </button>
          </div>

          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              Todo list will appear here. Components coming in next phase!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
