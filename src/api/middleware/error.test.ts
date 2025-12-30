import { describe, it, expect } from 'bun:test';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError, z } from 'zod';
import { errorHandler } from './error';

// Create a test app with error handler
const createTestApp = () => {
  const app = new Hono();

  // Route that throws HTTPException
  app.get('/http-error', () => {
    throw new HTTPException(400, { message: 'Bad Request' });
  });

  // Route that throws 404
  app.get('/not-found', () => {
    throw new HTTPException(404, { message: 'Resource not found' });
  });

  // Route that throws 401
  app.get('/unauthorized', () => {
    throw new HTTPException(401, { message: 'Unauthorized' });
  });

  // Route that throws ZodError
  app.get('/validation-error', () => {
    const schema = z.object({
      email: z.string().email(),
      age: z.number().min(18),
    });
    schema.parse({ email: 'invalid', age: 10 });
  });

  // Route that throws generic error
  app.get('/generic-error', () => {
    throw new Error('Something went wrong');
  });

  // Route that throws database duplicate key error
  app.get('/duplicate-error', () => {
    throw new Error('duplicate key value violates unique constraint');
  });

  // Route that throws foreign key error
  app.get('/foreign-key-error', () => {
    throw new Error('foreign key constraint failed');
  });

  app.onError(errorHandler);

  return app;
};

describe('Error Handler Middleware', () => {
  describe('HTTP Exceptions', () => {
    it('should handle 400 Bad Request', async () => {
      const app = createTestApp();
      const res = await app.request('/http-error');

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Bad Request');
    });

    it('should handle 404 Not Found', async () => {
      const app = createTestApp();
      const res = await app.request('/not-found');

      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.error).toBe('Resource not found');
    });

    it('should handle 401 Unauthorized', async () => {
      const app = createTestApp();
      const res = await app.request('/unauthorized');

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe('Unauthorized');
    });
  });

  describe('Zod Validation Errors', () => {
    it('should handle validation errors', async () => {
      const app = createTestApp();
      const res = await app.request('/validation-error');

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Validation failed');
      expect(json.details).toBeDefined();
      expect(Array.isArray(json.details)).toBe(true);
    });
  });

  describe('Database Errors', () => {
    it('should handle duplicate key errors', async () => {
      const app = createTestApp();
      const res = await app.request('/duplicate-error');

      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.error).toBe('Resource already exists');
    });

    it('should handle foreign key errors', async () => {
      const app = createTestApp();
      const res = await app.request('/foreign-key-error');

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Referenced resource not found');
    });
  });

  describe('Generic Errors', () => {
    it('should handle unknown errors with 500', async () => {
      const app = createTestApp();
      const res = await app.request('/generic-error');

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBe('Internal server error');
    });
  });
});

describe('Error Response Format', () => {
  it('should have consistent error structure', () => {
    const errorResponse = {
      error: 'Some error message',
      status: 400,
    };

    expect(errorResponse).toHaveProperty('error');
    expect(typeof errorResponse.error).toBe('string');
  });

  it('should include details for validation errors', () => {
    const validationErrorResponse = {
      error: 'Validation failed',
      details: [
        { path: 'email', message: 'Invalid email' },
        { path: 'age', message: 'Must be at least 18' },
      ],
    };

    expect(validationErrorResponse.details.length).toBe(2);
    expect(validationErrorResponse.details[0].path).toBe('email');
  });
});
