// Use globalThis to safely access import.meta in both browser and test environments
const getApiBaseUrl = (): string => {
  // In test environment, return default URL
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') {
    return 'http://localhost:5000/api';
  }

  return 'http://localhost:5000/api';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT_MS: 35000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const;

export const UI_CONFIG = {
  DEBOUNCE_MS: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000,
  MAX_TITLE_LENGTH: 200,
} as const;

export const QUERY_KEYS = {
  GENERATE_JOB: 'generateJob',
  HEALTH_CHECK: 'healthCheck',
} as const;

export enum JobSeniority {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
}

export enum CompanyType {
  STARTUP = 'startup',
  CORPORATE = 'corporate',
  AGENCY = 'agency',
}

export enum RequestStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}
