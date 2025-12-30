import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

export const errorHandler = (err: Error, c: Context) => {
  console.error('[Error]:', err);

  // Handle HTTP exceptions
  if (err instanceof HTTPException) {
    return c.json(
      {
        error: err.message,
        status: err.status,
      },
      err.status
    );
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return c.json(
      {
        error: 'Validation failed',
        details: err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
      400
    );
  }

  // Handle database errors
  if (err.message.includes('duplicate key')) {
    return c.json(
      {
        error: 'Resource already exists',
      },
      409
    );
  }

  if (err.message.includes('foreign key')) {
    return c.json(
      {
        error: 'Referenced resource not found',
      },
      400
    );
  }

  // Default error response
  return c.json(
    {
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    },
    500
  );
};
