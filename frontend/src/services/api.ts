import axios, { AxiosError } from 'axios';
import {
  ContactFormData,
  ContactResponse,
  HealthResponse,
  PortfolioApiResponse,
} from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:8000/api');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for standard error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<{
      detail?: string | unknown;
      message?: string;
      errors?: Array<{ msg: string; loc?: string[] }>;
    }>
  ) => {
    let errorMsg = 'An unexpected network error occurred';
    const data = error.response?.data;
    if (typeof data?.detail === 'string') {
      errorMsg = data.detail;
    } else if (typeof data?.message === 'string') {
      errorMsg = data.message;
    } else if (Array.isArray(data?.errors) && data.errors.length > 0) {
      errorMsg = data.errors.map((e) => e.msg).join(', ');
    } else if (error.message) {
      errorMsg = error.message;
    }
    return Promise.reject(new Error(errorMsg));
  }
);

export const api = {
  async getHealth(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },

  async getPortfolio(): Promise<PortfolioApiResponse> {
    const response = await apiClient.get<PortfolioApiResponse>('/portfolio');
    return response.data;
  },

  async submitContact(data: ContactFormData): Promise<ContactResponse> {
    const response = await apiClient.post<ContactResponse>('/contact', data);
    return response.data;
  },
};

export default api;
