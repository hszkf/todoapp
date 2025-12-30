import { describe, it, expect } from 'bun:test';
import { Hono } from 'hono';

// Create a test app for categories
const createTestApp = () => {
  const app = new Hono();

  // Mock categories storage
  const categories: Array<{
    id: string;
    name: string;
    color: string;
    createdAt: string;
  }> = [];

  // GET /api/categories
  app.get('/api/categories', (c) => {
    return c.json({ data: categories });
  });

  // GET /api/categories/:id
  app.get('/api/categories/:id', (c) => {
    const id = c.req.param('id');
    const category = categories.find((cat) => cat.id === id);

    if (!category) {
      return c.json({ error: 'Category not found' }, 404);
    }

    return c.json({ data: category });
  });

  // POST /api/categories
  app.post('/api/categories', async (c) => {
    const body = await c.req.json();

    if (!body.name?.trim()) {
      return c.json({ error: 'Name is required' }, 400);
    }

    if (body.name.length > 50) {
      return c.json({ error: 'Name too long' }, 400);
    }

    if (body.color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(body.color)) {
      return c.json({ error: 'Invalid hex color format' }, 400);
    }

    const category = {
      id: `cat-${Date.now()}`,
      name: body.name,
      color: body.color || '#6366f1',
      createdAt: new Date().toISOString(),
    };

    categories.push(category);
    return c.json({ data: category }, 201);
  });

  // PATCH /api/categories/:id
  app.patch('/api/categories/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const index = categories.findIndex((cat) => cat.id === id);

    if (index === -1) {
      return c.json({ error: 'Category not found' }, 404);
    }

    if (body.name !== undefined && !body.name.trim()) {
      return c.json({ error: 'Name cannot be empty' }, 400);
    }

    if (body.color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(body.color)) {
      return c.json({ error: 'Invalid hex color format' }, 400);
    }

    categories[index] = {
      ...categories[index],
      ...body,
    };

    return c.json({ data: categories[index] });
  });

  // DELETE /api/categories/:id
  app.delete('/api/categories/:id', (c) => {
    const id = c.req.param('id');
    const index = categories.findIndex((cat) => cat.id === id);

    if (index === -1) {
      return c.json({ error: 'Category not found' }, 404);
    }

    const deleted = categories.splice(index, 1)[0];
    return c.json({ data: deleted });
  });

  return { app, categories };
};

describe('Category Routes', () => {
  describe('GET /api/categories', () => {
    it('should return empty array initially', async () => {
      const { app } = createTestApp();
      const res = await app.request('/api/categories');

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data).toEqual([]);
    });

    it('should return categories after creation', async () => {
      const { app } = createTestApp();

      // Create categories
      await app.request('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Work' }),
      });

      await app.request('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Personal', color: '#22c55e' }),
      });

      const res = await app.request('/api/categories');
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.length).toBe(2);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return category by id', async () => {
      const { app } = createTestApp();

      // Create a category
      const createRes = await app.request('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Work' }),
      });
      const created = await createRes.json();

      // Get it
      const getRes = await app.request(`/api/categories/${created.data.id}`);
      expect(getRes.status).toBe(200);
      const json = await getRes.json();
      expect(json.data.name).toBe('Work');
    });

    it('should return 404 for non-existent category', async () => {
      const { app } = createTestApp();
      const res = await app.request('/api/categories/non-existent');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/categories', () => {
    it('should create a category with name only', async () => {
      const { app } = createTestApp();
      const res = await app.request('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Work' }),
      });

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.data.name).toBe('Work');
      expect(json.data.color).toBe('#6366f1'); // default color
    });

    it('should create a category with custom color', async () => {
      const { app } = createTestApp();
      const res = await app.request('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Personal', color: '#ef4444' }),
      });

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.data.name).toBe('Personal');
      expect(json.data.color).toBe('#ef4444');
    });

    it('should return 400 for empty name', async () => {
      const { app } = createTestApp();
      const res = await app.request('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '' }),
      });

      expect(res.status).toBe(400);
    });

    it('should return 400 for name too long', async () => {
      const { app } = createTestApp();
      const res = await app.request('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'A'.repeat(51) }),
      });

      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid color format', async () => {
      const { app } = createTestApp();
      const res = await app.request('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', color: 'invalid' }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/categories/:id', () => {
    it('should update category name', async () => {
      const { app } = createTestApp();

      // Create a category
      const createRes = await app.request('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Original' }),
      });
      const created = await createRes.json();

      // Update it
      const updateRes = await app.request(`/api/categories/${created.data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated' }),
      });

      expect(updateRes.status).toBe(200);
      const updated = await updateRes.json();
      expect(updated.data.name).toBe('Updated');
    });

    it('should update category color', async () => {
      const { app } = createTestApp();

      // Create a category
      const createRes = await app.request('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test' }),
      });
      const created = await createRes.json();

      // Update color
      const updateRes = await app.request(`/api/categories/${created.data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color: '#8b5cf6' }),
      });

      expect(updateRes.status).toBe(200);
      const updated = await updateRes.json();
      expect(updated.data.color).toBe('#8b5cf6');
    });

    it('should return 404 for non-existent category', async () => {
      const { app } = createTestApp();
      const res = await app.request('/api/categories/non-existent', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated' }),
      });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      const { app } = createTestApp();

      // Create a category
      const createRes = await app.request('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Delete Me' }),
      });
      const created = await createRes.json();

      // Delete it
      const deleteRes = await app.request(`/api/categories/${created.data.id}`, {
        method: 'DELETE',
      });

      expect(deleteRes.status).toBe(200);

      // Verify it's deleted
      const getRes = await app.request(`/api/categories/${created.data.id}`);
      expect(getRes.status).toBe(404);
    });

    it('should return 404 for non-existent category', async () => {
      const { app } = createTestApp();
      const res = await app.request('/api/categories/non-existent', {
        method: 'DELETE',
      });

      expect(res.status).toBe(404);
    });
  });
});
