import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
              <div className="animate-pulse text-muted-foreground">
                Loading...
              </div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
