import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { todosRoute } from './routes/todos';
import { categoriesRoute } from './routes/categories';
import { errorHandler } from './middleware/error';

const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', cors());
app.use('*', secureHeaders());

// Health check
app.get('/health', (c) =>
  c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
);

// API routes
app.route('/api/todos', todosRoute);
app.route('/api/categories', categoriesRoute);

// Error handler
app.onError(errorHandler);

// 404 handler
app.notFound((c) =>
  c.json(
    {
      error: 'Not Found',
      path: c.req.path,
    },
    404
  )
);

export default app;
export { app };
