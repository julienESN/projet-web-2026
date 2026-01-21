// API Client for Resource Manager
// Wraps axios with authentication, error handling, and Zod schema validation.
//
// Usage Examples:
//
// 1. Basic usage with manual type definition:
//    interface User { id: number; name: string; }
//    const user = await api.get<User>('/users/1');
//
// 2. Usage with Zod schema (Automatic Type Inference):
//    import { z } from 'zod';
//    const UserSchema = z.object({ id: z.number(), name: z.string() });
//    // 'user' is automatically typed as { id: number; name: string; }
//    const user = await api.get('/users/1', { schema: UserSchema });
//
// 3. POST request with Zod schema:
//    const CreateUserSchema = z.object({ id: z.number(), name: z.string() });
//    const newUser = await api.post('/users', { name: 'John' }, { schema: CreateUserSchema });
//
// 4. Authenticated request:
//    const data = await api.get('/protected', { token: 'my-token' });

import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { z, type ZodType } from 'zod';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(
  method: 'get' | 'post' | 'put' | 'delete',
  endpoint: string,
  options: { data?: unknown; token?: string; schema?: ZodType<T> } = {},
): Promise<T> {
  try {
    const { data, token, schema } = options;
    const config = { headers: getHeaders(token) };

    const response: AxiosResponse<unknown> = await client.request({
      method,
      url: endpoint,
      data,
      ...config,
    });

    if (response.status === 204) {
      return {} as T;
    }

    if (schema) {
      return schema.parse(response.data);
    }

    return response.data as T;
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error('Validation error:', err.issues);
      throw new ApiError(500, 'Validation Error: Invalid API response format');
    }
    const axiosError = err as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status ?? 500;
    const message = axiosError.response?.data?.message ?? axiosError.message ?? 'An error occurred';
    throw new ApiError(status, message);
  }
}

export const api = {
  get: <T>(endpoint: string, options: { token?: string; schema?: ZodType<T> } = {}) =>
    request<T>('get', endpoint, options),

  post: <T>(
    endpoint: string,
    data: unknown,
    options: { token?: string; schema?: ZodType<T> } = {},
  ) => request<T>('post', endpoint, { data, ...options }),

  put: <T>(
    endpoint: string,
    data: unknown,
    options: { token?: string; schema?: ZodType<T> } = {},
  ) => request<T>('put', endpoint, { data, ...options }),

  delete: <T>(endpoint: string, options: { token?: string; schema?: ZodType<T> } = {}) =>
    request<T>('delete', endpoint, options),
};

export { ApiError };
