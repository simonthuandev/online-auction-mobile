import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, isAxiosError } from 'axios';
import { tokenStorage } from '../storage/tokenStorage';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface ApiErrorEnvelope {
  code: string;
  message: string;
  requestId?: string;
  details?: Record<string, unknown>;
}

export class AppApiError extends Error {
  public code: string;
  public requestId?: string;
  public status?: number;
  public details?: Record<string, unknown>;

  constructor(message: string, code = 'UNKNOWN_ERROR', status?: number, requestId?: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'AppApiError';
    this.code = code;
    this.status = status;
    this.requestId = requestId;
    this.details = details;
  }
}

// Auth callbacks for external subscribers (e.g. Redux store, sockets)
type UnauthorizedListener = () => void;
type TokenRefreshedListener = (newToken: string) => void;

const unauthorizedListeners = new Set<UnauthorizedListener>();
const tokenRefreshedListeners = new Set<TokenRefreshedListener>();

export const onUnauthorized = (listener: UnauthorizedListener): (() => void) => {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
};

export const onTokenRefreshed = (listener: TokenRefreshedListener): (() => void) => {
  tokenRefreshedListeners.add(listener);
  return () => tokenRefreshedListeners.delete(listener);
};

const notifyUnauthorized = () => {
  for (const listener of unauthorizedListeners) {
    try {
      listener();
    } catch (err) {
      console.error('[client] Error in unauthorized listener:', err);
    }
  }
};

const notifyTokenRefreshed = (newToken: string) => {
  for (const listener of tokenRefreshedListeners) {
    try {
      listener(newToken);
    } catch (err) {
      console.error('[client] Error in tokenRefreshed listener:', err);
    }
  }
};

// Create the main Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Single-flight refresh token mutex
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) {
        await tokenStorage.clearTokens();
        notifyUnauthorized();
        return null;
      }

      // Dedicated bare Axios call without interceptors to prevent infinite loops
      const response = await axios.post<{ accessToken: string; refreshToken: string }>(
        `${API_BASE_URL}/api/auth/refresh`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      const tokens = response.data;
      if (!tokens?.accessToken || !tokens?.refreshToken) {
        throw new Error('Invalid token payload received from refresh endpoint');
      }

      await tokenStorage.setTokens(tokens);
      notifyTokenRefreshed(tokens.accessToken);
      return tokens.accessToken;
    } catch (error) {
      await tokenStorage.clearTokens();
      notifyUnauthorized();
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Request interceptor: attach Bearer token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: single-flight refresh token on 401 & standard error envelope
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorEnvelope>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    const status = error.response?.status;
    const requestUrl = originalRequest?.url || '';

    // Ignore 401s from login/register/refresh/logout to prevent loop
    const isAuthEndpoint =
      requestUrl.includes('/api/auth/login') ||
      requestUrl.includes('/api/auth/register') ||
      requestUrl.includes('/api/auth/refresh') ||
      requestUrl.includes('/api/auth/logout');

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        return Promise.reject(normalizeApiError(refreshErr as AxiosError<ApiErrorEnvelope>));
      }
    }

    return Promise.reject(normalizeApiError(error));
  }
);

export function normalizeApiError(error: AxiosError<ApiErrorEnvelope> | Error): AppApiError {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (data && typeof data === 'object') {
      const code = data.code || `HTTP_${status || 'ERROR'}`;
      const message = data.message || error.message || 'An unexpected error occurred';
      const requestId = data.requestId;
      const details = data.details;
      return new AppApiError(message, code, status, requestId, details);
    }

    // Gateway rejection with empty body or non-JSON body
    let fallbackMessage = error.message || 'Network error';
    if (status === 401) fallbackMessage = 'Unauthenticated session';
    else if (status === 403) fallbackMessage = 'Access forbidden';
    else if (status === 404) fallbackMessage = 'Resource not found';
    else if (status === 409) fallbackMessage = 'Data conflict occurred';

    return new AppApiError(fallbackMessage, `HTTP_${status || 'NETWORK_ERROR'}`, status);
  }

  return new AppApiError(error.message || 'Unknown error occurred');
}

export default apiClient;
