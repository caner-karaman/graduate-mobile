import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:9000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // For future use: e.g. retrieve token from Zustand and append to headers
    // const token = useAuthStore.getState().token;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific global status codes here (e.g. 401 Unauthorized)
    return Promise.reject(error);
  }
);

/**
 * Custom Mutator for Orval.
 * Orval will use this function to perform API requests instead of the default axios client,
 * enabling integration with our configured apiClient instance.
 */
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  return apiClient({
    ...config,
    ...options,
  }).then((response) => response.data);
};
