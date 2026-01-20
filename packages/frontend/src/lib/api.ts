// API Client for Resource Manager
// Wraps fetch with authentication and error handling

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
    token?: string;
}

class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request<T>(
    endpoint: string,
    options: RequestOptions = {},
): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(response.status, error.message || 'An error occurred');
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string, token?: string) =>
        request<T>(endpoint, { method: 'GET', token }),

    post: <T>(endpoint: string, data: unknown, token?: string) =>
        request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        }),

    put: <T>(endpoint: string, data: unknown, token?: string) =>
        request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            token,
        }),

    delete: <T>(endpoint: string, token?: string) =>
        request<T>(endpoint, { method: 'DELETE', token }),
};

export { ApiError };
