export * from '../data/portfolioData';

export interface HealthResponse {
  status: string;
  version: string;
  timestamp?: string;
  database: {
    connected: boolean;
    message: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  id?: string;
  created_at?: string;
}

export interface PortfolioApiResponse {
  profile: unknown;
  skills: unknown[];
  experience: unknown[];
  projects: unknown[];
  achievements: unknown[];
  education: unknown[];
}
