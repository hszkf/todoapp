# Project Configuration

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Bun |
| Backend | Hono.js |
| Frontend Router | TanStack Router |
| Database | Supabase (PostgreSQL) |
| ORM | Drizzle ORM |
| Build Tool | TSDX (libraries) |
| Language | TypeScript (strict) |
| Testing | Bun test, Playwright, MSW |

## Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Start dev server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run db:generate` | Generate migrations |
| `bun run db:migrate` | Apply migrations |
| `bun run db:push` | Push schema (dev only) |
| `bun run db:studio` | Open Drizzle Studio |
| `bun test` | Run unit/API tests |
| `bun run test:e2e` | Run Playwright E2E tests |
| `bun run lint` | Run ESLint |
| `bun run format` | Run Prettier |

## Project Structure

```
src/
├── api/              # Hono.js API routes
│   ├── routes/
│   ├── middleware/
│   └── index.ts
├── db/
│   ├── schema.ts
│   ├── migrations/
│   └── index.ts
├── features/
│   └── [feature]/
│       ├── api.ts
│       ├── hooks.ts
│       └── types.ts
├── routes/           # TanStack Router pages
├── components/
├── lib/
├── types/
└── tests/
    ├── e2e/
    └── mocks/
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server only) |

---

## Available Agents

Use these specialized agents for complex tasks:

| Agent | Use For |
|-------|---------|
| `api-designer` | REST/GraphQL API design, OpenAPI specs, endpoint patterns |
| `backend-developer` | Hono.js routes, services, Node.js/Bun backend logic |
| `frontend-developer` | React components, TanStack Router pages, UI implementation |
| `typescript-pro` | Advanced types, generics, type-safe patterns, Zod schemas |
| `database-architect` | Drizzle schema design, migrations, query optimization, indexes |
| `security-auditor` | Security review, OWASP checks, auth patterns, vulnerability fixes |
| `devops-engineer` | Docker, CI/CD, GitHub Actions, deployment |

---

## Available Skills

Reference these skills for patterns and guidelines:

### Stack-Specific (Primary)
| Skill | Purpose |
|-------|---------|
| `hono-patterns` | Routes, middleware, validation, error handling, auth |
| `supabase-patterns` | Auth, storage, realtime, RLS policies |
| `tanstack-router-patterns` | File routing, loaders, search params, navigation |
| `database-migrations` | Drizzle migrations, schema changes, safe deployments |

### Development Guidelines
| Skill | Purpose |
|-------|---------|
| `frontend-dev-guidelines` | React/TypeScript patterns, Suspense, data fetching |
| `backend-dev-guidelines` | API architecture, services, middleware patterns |
| `frontend-design` | UI/UX design principles, creative interfaces |

### Testing
| Skill | Purpose |
|-------|---------|
| `testing-patterns` | Unit/integration tests, mocking, Jest/Vitest patterns |
| `testing-e2e-playwright` | Playwright E2E tests, page objects, MSW mocking |
| `running-e2e-tests` | E2E test execution and reporting |

### DevOps & CI/CD
| Skill | Purpose |
|-------|---------|
| `docker-patterns` | Dockerfile, docker-compose, multi-stage builds |
| `github-actions-templates` | CI/CD workflows, deployment pipelines |

### Code Quality
| Skill | Purpose |
|-------|---------|
| `git-workflow` | Branch naming, conventional commits, rebasing |
| `code-review-checklist` | PR review process, review comments |
| `pr-templates` | Pull request descriptions, templates |
| `security-checklist` | Security hardening, XSS/SQLi prevention |
| `performance-optimization` | Frontend/backend performance, caching |
| `debugging-guide` | Debugging techniques, common errors |

---

## Conventions

### Code Style
- Package manager: `bun` only
- Prefer `const` over `let`
- TypeScript strict mode, no `any`
- Zod for runtime validation
- Named exports preferred
- Absolute imports with `@/` prefix

### API (Hono.js)
- Use `zValidator` for input validation
- Proper HTTP status codes
- Thin handlers, delegate to services

### Database (Drizzle + Supabase)
- Drizzle for all queries
- Supabase client for auth/storage/realtime only
- UUID primary keys
- Include `createdAt`/`updatedAt` timestamps

### Testing
- Unit tests: colocate as `*.test.ts`
- E2E tests: `src/tests/e2e/`
- MSW for API mocking

### Git
- Branches: `feature/`, `fix/`, `chore/`
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- Squash merge to main
- Run `bun test` before push
