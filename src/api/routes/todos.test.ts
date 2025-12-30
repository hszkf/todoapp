import { describe, it, expect, beforeAll } from 'bun:test';
import { Hono } from 'hono';

// Create a test app that mimics the structure
const createTestApp = () => {
  const app = new Hono();

  // Mock todos storage
  const todos: Array<{
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    categoryId?: string;
    createdAt: string;
    updatedAt: string;
  }> = [];

  // GET /api/todos
  app.get('/api/todos', (c) => {
    const filter = c.req.query('filter');
    const search = c.req.query('search');
    const categoryId = c.req.query('categoryId');
    const priority = c.req.query('priority');

    let result = [...todos];

    if (filter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (filter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    if (categoryId) {
      result = result.filter((t) => t.categoryId === categoryId);
    }

    if (priority) {
      result = result.filter((t) => t.priority === priority);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description?.toLowerCase().includes(searchLower)
      );
    }

    return c.json({ data: result });
  });

  // GET /api/todos/:id
  app.get('/api/todos/:id', (c) => {
    const id = c.req.param('id');
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      return c.json({ error: 'Todo not found' }, 404);
    }

    return c.json({ data: todo });
  });

  // POST /api/todos
  app.post('/api/todos', async (c) => {
    const body = await c.req.json();

    if (!body.title?.trim()) {
      return c.json({ error: 'Title is required' }, 400);
    }

    const todo = {
      id: `todo-${Date.now()}`,
      title: body.title,
      description: body.description,
      completed: false,
      priority: body.priority || 'medium',
      dueDate: body.dueDate,
      categoryId: body.categoryId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.push(todo);
    return c.json({ data: todo }, 201);
  });

  // PATCH /api/todos/:id
  app.patch('/api/todos/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const index = todos.findIndex((t) => t.id === id);

    if (index === -1) {
      return c.json({ error: 'Todo not found' }, 404);
    }

    todos[index] = {
      ...todos[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return c.json({ data: todos[index] });
  });

  // PATCH /api/todos/:id/toggle
  app.patch('/api/todos/:id/toggle', (c) => {
    const id = c.req.param('id');
    const index = todos.findIndex((t) => t.id === id);

    if (index === -1) {
      return c.json({ error: 'Todo not found' }, 404);
    }

    todos[index].completed = !todos[index].completed;
    todos[index].updatedAt = new Date().toISOString();

    return c.json({ data: todos[index] });
  });

  // DELETE /api/todos/:id
  app.delete('/api/todos/:id', (c) => {
    const id = c.req.param('id');
    const index = todos.findIndex((t) => t.id === id);

    if (index === -1) {
      return c.json({ error: 'Todo not found' }, 404);
    }

    const deleted = todos.splice(index, 1)[0];
    return c.json({ data: deleted });
  });

  return { app, todos };
};

describe('Todo Routes', () => {
  describe('GET /api/todos', () => {
    it('should return empty array initially', async () => {
      const { app } = createTestApp();
      const res = await app.request('/api/todos');

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data).toEqual([]);
    });

    it('should return todos after creation', async () => {
      const { app } = createTestApp();

      // Create a todo first
      await app.request('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test Todo' }),
      });

      const res = await app.request('/api/todos');
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.length).toBe(1);
    });

    it('should filter by status', async () => {
      const { app } = createTestApp();

      // Create todos
      await app.request('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Active Todo' }),
      });

      const activeRes = await app.request('/api/todos?filter=active');
      const activeJson = await activeRes.json();
      expect(activeJson.data.length).toBe(1);

      const completedRes = await app.request('/api/todos?filter=completed');
      const completedJson = await completedRes.json();
      expect(completedJson.data.length).toBe(0);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a todo with title', async () => {
      const { app } = createTestApp();
      const res = await app.request('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Todo' }),
      });

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.data.title).toBe('New Todo');
      expect(json.data.completed).toBe(false);
      expect(json.data.priority).toBe('medium');
    });

    it('should return 400 for empty title', async () => {
      const { app } = createTestApp();
      const res = await app.request('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '' }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/todos/:id', () => {
    it('should update a todo', async () => {
      const { app, todos } = createTestApp();

      // Create a todo
      const createRes = await app.request('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Original' }),
      });
      const created = await createRes.json();

      // Update it
      const updateRes = await app.request(`/api/todos/${created.data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated' }),
      });

      expect(updateRes.status).toBe(200);
      const updated = await updateRes.json();
      expect(updated.data.title).toBe('Updated');
    });

    it('should return 404 for non-existent todo', async () => {
      const { app } = createTestApp();
      const res = await app.request('/api/todos/non-existent', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated' }),
      });

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/todos/:id/toggle', () => {
    it('should toggle todo completion', async () => {
      const { app } = createTestApp();

      // Create a todo
      const createRes = await app.request('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Toggle Me' }),
      });
      const created = await createRes.json();
      expect(created.data.completed).toBe(false);

      // Toggle it
      const toggleRes = await app.request(`/api/todos/${created.data.id}/toggle`, {
        method: 'PATCH',
      });

      expect(toggleRes.status).toBe(200);
      const toggled = await toggleRes.json();
      expect(toggled.data.completed).toBe(true);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      const { app } = createTestApp();

      // Create a todo
      const createRes = await app.request('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Delete Me' }),
      });
      const created = await createRes.json();

      // Delete it
      const deleteRes = await app.request(`/api/todos/${created.data.id}`, {
        method: 'DELETE',
      });

      expect(deleteRes.status).toBe(200);

      // Verify it's deleted
      const getRes = await app.request(`/api/todos/${created.data.id}`);
      expect(getRes.status).toBe(404);
    });
  });
});
