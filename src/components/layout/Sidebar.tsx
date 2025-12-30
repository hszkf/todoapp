import { Inbox, CheckCircle2, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const filterItems = [
  { id: 'all', label: 'All Todos', icon: Inbox },
  { id: 'active', label: 'Active', icon: Clock },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
];

export function Sidebar({ currentFilter, onFilterChange }: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-muted/10 p-4">
      <nav className="space-y-2">
        <h2 className="mb-4 px-2 text-lg font-semibold tracking-tight">
          Filters
        </h2>
        {filterItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                currentFilter === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 px-2 text-lg font-semibold tracking-tight">
          <Tag className="h-4 w-4" />
          Categories
        </h2>
        <p className="px-3 text-sm text-muted-foreground">
          Categories will appear here
        </p>
      </div>
    </aside>
  );
}
