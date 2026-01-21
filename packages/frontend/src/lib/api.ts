// API Client for Resource Manager
// Wraps axios with authentication and error handling

import axios, { type AxiosError } from 'axios';

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
  options: { data?: unknown; token?: string } = {},
): Promise<T> {
  try {
    const { data, token } = options;
    const config = { headers: getHeaders(token) };

    const response = await client.request<T>({
      method,
      url: endpoint,
      data,
      ...config,
    });

    if (response.status === 204) {
      return {} as T;
    }

    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status ?? 500;
    const message = axiosError.response?.data?.message ?? axiosError.message ?? 'An error occurred';
    throw new ApiError(status, message);
  }
}

export const api = {
  get: <T>(endpoint: string, token?: string) => request<T>('get', endpoint, { token }),

  post: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>('post', endpoint, { data, token }),

  put: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>('put', endpoint, { data, token }),

  delete: <T>(endpoint: string, token?: string) => request<T>('delete', endpoint, { token }),
};

export { ApiError };
