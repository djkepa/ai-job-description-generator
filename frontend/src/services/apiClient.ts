import axios, { type AxiosInstance, type AxiosError, type AxiosResponse } from 'axios';

import { API_CONFIG } from '../constants/index.js';
import type { ApiErrorResponse } from '../types/api.js';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add metadata for timing (using any temporarily for axios config extension)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (config as any).metadata = { startTime: Date.now() };
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const duration = Date.now() - ((response.config as any).metadata?.startTime || 0);

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.info(
            `API Request: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`,
          );
        }

        return response;
      },
      (error: AxiosError<ApiErrorResponse>) => {
        const enhancedError = this.enhanceError(error);
        return Promise.reject(enhancedError);
      },
    );
  }

  private enhanceError(error: AxiosError<ApiErrorResponse>): Error {
    if (error.response?.data?.error) {
      const apiError = error.response.data;
      const message = apiError.details || apiError.error;
      const enhancedError = new Error(message);
      enhancedError.name = 'ApiError';
      return enhancedError;
    }

    if (error.code === 'ECONNABORTED') {
      const timeoutError = new Error('Request timeout. Please try again.');
      timeoutError.name = 'TimeoutError';
      return timeoutError;
    }

    if (!error.response) {
      const networkError = new Error('Network error. Please check your connection.');
      networkError.name = 'NetworkError';
      return networkError;
    }

    return new Error('An unexpected error occurred.');
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();

// Add to global window for debugging in development
if (import.meta.env.DEV) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).apiClient = apiClient;
}
