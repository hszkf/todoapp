import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { categoryService } from '../services/category.service';
import {
  createCategorySchema,
  updateCategorySchema,
} from '@/features/categories/types';
import { idParamSchema } from '@/features/todos/types';

export const categoriesRoute = new Hono();

// GET /categories - List all categories
categoriesRoute.get('/', async (c) => {
  const categories = await categoryService.findAll();
  return c.json({ data: categories });
});

// GET /categories/:id - Get single category
categoriesRoute.get('/:id', zValidator('param', idParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const category = await categoryService.findById(id);

  if (!category) {
    return c.json({ error: 'Category not found' }, 404);
  }

  return c.json({ data: category });
});

// POST /categories - Create new category
categoriesRoute.post(
  '/',
  zValidator('json', createCategorySchema),
  async (c) => {
    const body = c.req.valid('json');
    const category = await categoryService.create(body);
    return c.json({ data: category }, 201);
  }
);

// PATCH /categories/:id - Update category
categoriesRoute.patch(
  '/:id',
  zValidator('param', idParamSchema),
  zValidator('json', updateCategorySchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    const category = await categoryService.update(id, body);

    if (!category) {
      return c.json({ error: 'Category not found' }, 404);
    }

    return c.json({ data: category });
  }
);

// DELETE /categories/:id - Delete category
categoriesRoute.delete(
  '/:id',
  zValidator('param', idParamSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const deleted = await categoryService.delete(id);

    if (!deleted) {
      return c.json({ error: 'Category not found' }, 404);
    }

    return c.json({ success: true });
  }
);
