import { apiClient } from '@/lib/api-client';
import type { Category } from '@/db/schema';
import type { CreateCategoryInput, UpdateCategoryInput } from './types';

interface CategoryResponse {
  data: Category;
}

interface CategoriesResponse {
  data: Category[];
}

interface DeleteResponse {
  success: boolean;
}

export const categoriesApi = {
  getAll: () => apiClient.get<CategoriesResponse>('/categories'),

  getById: (id: string) =>
    apiClient.get<CategoryResponse>(`/categories/${id}`),

  create: (data: CreateCategoryInput) =>
    apiClient.post<CategoryResponse>('/categories', data),

  update: (id: string, data: UpdateCategoryInput) =>
    apiClient.patch<CategoryResponse>(`/categories/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<DeleteResponse>(`/categories/${id}`),
};
