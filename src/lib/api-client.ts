const API_BASE = '/api';

interface ApiError {
  error: string;
  details?: Array<{ path: string; message: string }>;
}

class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: ApiError['details']
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      error: 'Request failed',
    }));
    throw new ApiClientError(
      errorData.error,
      response.status,
      errorData.details
    );
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: 'DELETE',
    }),
};

export { ApiClientError };
