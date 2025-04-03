import { API_BASE_URL, TOKEN_KEY } from '@/utils/constants';

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  isAuthenticated?: boolean;
}

interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Fetch wrapper for making API requests with authentication handling
 */
export async function fetchApi<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    isAuthenticated = true,
  } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authentication token if required
  if (isAuthenticated && typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle different response types
    let data: T | null = null;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text/')) {
      data = await response.text() as unknown as T;
    }

    if (!response.ok) {
      return {
        data: null,
        error: data && typeof data === 'object' ? (data as any).message || 'An error occurred' : 'An error occurred',
        status: response.status,
      };
    }

    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Network error',
      status: 0, // 0 indicates a network error
    };
  }
}

/**
 * Helper methods for common API operations
 */
export const api = {
  get: <T>(endpoint: string, options: Omit<ApiOptions, 'method' | 'body'> = {}) => 
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, data: any, options: Omit<ApiOptions, 'method'> = {}) => 
    fetchApi<T>(endpoint, { ...options, method: 'POST', body: data }),
    
  put: <T>(endpoint: string, data: any, options: Omit<ApiOptions, 'method'> = {}) => 
    fetchApi<T>(endpoint, { ...options, method: 'PUT', body: data }),
    
  delete: <T>(endpoint: string, options: Omit<ApiOptions, 'method'> = {}) => 
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};