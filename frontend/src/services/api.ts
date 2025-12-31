import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types/api';
import { redirectToLogin, isAuthError } from '@/utils/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
// Note: Authentication is handled by Fence gateway via CowboyHat cookie
// No need to add Authorization header - cookies are sent automatically
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    // Handle 401 Unauthorized - session expired or not logged in
    if (error.response?.status && isAuthError(error.response.status)) {
      console.warn('Session expired or unauthorized. Redirecting to login...');
      redirectToLogin();
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || '网络请求失败，请稍后重试';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export default api;
