import { z } from 'zod';

// Priority values
export const priorities = ['low', 'medium', 'high'] as const;
export type Priority = (typeof priorities)[number];

// Create todo schema
export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  priority: z.enum(priorities).default('medium'),
  dueDate: z.string().datetime().optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
});

// Update todo schema
export const updateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  completed: z.boolean().optional(),
  priority: z.enum(priorities).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
});

// Query params for filtering
export const todoFilterSchema = z.object({
  filter: z.enum(['all', 'active', 'completed']).default('all'),
  priority: z.enum(priorities).optional(),
  categoryId: z.string().uuid().optional(),
  search: z.string().optional(),
});

// UUID param validation
export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID'),
});

// Type exports
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoFilter = z.infer<typeof todoFilterSchema>;
