import { apiClient } from '@/lib/api-client';
import type { Todo } from '@/db/schema';
import type {
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilter,
} from './types';

interface TodoResponse {
  data: Todo;
}

interface TodosResponse {
  data: Todo[];
}

interface DeleteResponse {
  success: boolean;
}

export const todosApi = {
  getAll: (filter: Partial<TodoFilter> = {}) => {
    const params = new URLSearchParams();
    if (filter.filter) params.set('filter', filter.filter);
    if (filter.priority) params.set('priority', filter.priority);
    if (filter.categoryId) params.set('categoryId', filter.categoryId);
    if (filter.search) params.set('search', filter.search);
    const queryString = params.toString();
    return apiClient.get<TodosResponse>(
      `/todos${queryString ? `?${queryString}` : ''}`
    );
  },

  getById: (id: string) => apiClient.get<TodoResponse>(`/todos/${id}`),

  create: (data: CreateTodoInput) =>
    apiClient.post<TodoResponse>('/todos', data),

  update: (id: string, data: UpdateTodoInput) =>
    apiClient.patch<TodoResponse>(`/todos/${id}`, data),

  toggle: (id: string) => apiClient.patch<TodoResponse>(`/todos/${id}/toggle`),

  delete: (id: string) => apiClient.delete<DeleteResponse>(`/todos/${id}`),
};
