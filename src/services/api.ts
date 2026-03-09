import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/lib/errors';
import { storage, STORAGE_KEYS } from '@/lib/storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getString(STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle API response format and errors
api.interceptors.response.use(
  (response) => {
    // Backend returns { success, message, data } format
    // Extract data field if present
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    // Don't process cancelled requests
    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Token expired or invalid
      storage.remove(STORAGE_KEYS.TOKEN);
      storage.remove(STORAGE_KEYS.USER);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Transform to ApiError for consistent error handling
    const apiError = ApiError.fromAxiosError(error);
    return Promise.reject(apiError);
  }
);

export default api;
