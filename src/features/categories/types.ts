import { z } from 'zod';

// Hex color regex pattern
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

// Create category schema
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  color: z
    .string()
    .regex(hexColorRegex, 'Invalid hex color format')
    .optional(),
});

// Update category schema
export const updateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z.string().regex(hexColorRegex).optional(),
});

// Type exports - use input type for what API expects
export type CreateCategoryInput = z.input<typeof createCategorySchema>;
export type UpdateCategoryInput = z.input<typeof updateCategorySchema>;
