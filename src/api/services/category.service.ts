import { eq, asc } from 'drizzle-orm';
import { db, categories, type Category, type NewCategory } from '@/db';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/features/categories/types';

export const categoryService = {
  async findAll(): Promise<Category[]> {
    return db.select().from(categories).orderBy(asc(categories.name));
  },

  async findById(id: string): Promise<Category | undefined> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    return result[0];
  },

  async create(data: CreateCategoryInput): Promise<Category> {
    const newCategory: NewCategory = {
      name: data.name,
      color: data.color,
    };

    const result = await db.insert(categories).values(newCategory).returning();
    return result[0]!;
  },

  async update(
    id: string,
    data: UpdateCategoryInput
  ): Promise<Category | undefined> {
    const result = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  },

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    return result.length > 0;
  },
};
