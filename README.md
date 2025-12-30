# Todo App

A full-stack Todo application built with modern technologies.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Bun |
| Backend | Hono.js |
| Frontend | TanStack Router + React Query |
| Database | Supabase (PostgreSQL) |
| ORM | Drizzle ORM |
| UI | shadcn/ui (Radix UI) + Tailwind CSS |
| Testing | Bun test, Vitest, Playwright |

## Features

- CRUD operations for todos
- Toggle complete/incomplete
- Filter by status (all, active, completed)
- Due dates with overdue highlighting
- Categories/tags for organization
- Priority levels (low, medium, high)
- Search todos
- Dark/light mode
- Responsive design

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/hszkf/todoapp.git
cd todoapp

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Generate and run database migrations
bun run db:generate
bun run db:push

# Start development server
bun run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run db:generate` | Generate migrations |
| `bun run db:migrate` | Apply migrations |
| `bun run db:push` | Push schema (dev) |
| `bun run db:studio` | Open Drizzle Studio |
| `bun test` | Run unit tests |
| `bun run test:frontend` | Run frontend tests |
| `bun run test:e2e` | Run E2E tests |
| `bun run lint` | Run ESLint |
| `bun run format` | Run Prettier |

## Development Workflow

1. Create feature branch from `develop`
2. Implement feature
3. Run tests (`bun test`)
4. Create PR to `develop`
5. Code review
6. Merge after approval

## License

MIT
