import { z } from 'zod';

// Hex color regex pattern
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

// Create category schema
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  color: z
    .string()
    .regex(hexColorRegex, 'Invalid hex color format')
    .default('#6366f1'),
});

// Update category schema
export const updateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z.string().regex(hexColorRegex).optional(),
});

// Type exports
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
