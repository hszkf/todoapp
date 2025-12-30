import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { todoService } from '../services/todo.service';
import {
  createTodoSchema,
  updateTodoSchema,
  todoFilterSchema,
  idParamSchema,
} from '@/features/todos/types';

export const todosRoute = new Hono();

// GET /todos - List all todos with optional filters
todosRoute.get('/', zValidator('query', todoFilterSchema), async (c) => {
  const filter = c.req.valid('query');
  const todos = await todoService.findAll(filter);
  return c.json({ data: todos });
});

// GET /todos/:id - Get single todo
todosRoute.get('/:id', zValidator('param', idParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const todo = await todoService.findById(id);

  if (!todo) {
    return c.json({ error: 'Todo not found' }, 404);
  }

  return c.json({ data: todo });
});

// POST /todos - Create new todo
todosRoute.post('/', zValidator('json', createTodoSchema), async (c) => {
  const body = c.req.valid('json');
  const todo = await todoService.create(body);
  return c.json({ data: todo }, 201);
});

// PATCH /todos/:id - Update todo
todosRoute.patch(
  '/:id',
  zValidator('param', idParamSchema),
  zValidator('json', updateTodoSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    const todo = await todoService.update(id, body);

    if (!todo) {
      return c.json({ error: 'Todo not found' }, 404);
    }

    return c.json({ data: todo });
  }
);

// PATCH /todos/:id/toggle - Toggle completion status
todosRoute.patch(
  '/:id/toggle',
  zValidator('param', idParamSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const todo = await todoService.toggleComplete(id);

    if (!todo) {
      return c.json({ error: 'Todo not found' }, 404);
    }

    return c.json({ data: todo });
  }
);

// DELETE /todos/:id - Delete todo
todosRoute.delete('/:id', zValidator('param', idParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const deleted = await todoService.delete(id);

  if (!deleted) {
    return c.json({ error: 'Todo not found' }, 404);
  }

  return c.json({ success: true });
});
