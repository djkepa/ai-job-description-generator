export interface OpenAIGenerationRequest {
  title: string;
  seniority?: string;
  company_type?: string;
}

export interface OpenAIGenerationResponse {
  description: string;
  model: string;
}

export interface OpenAIErrorContext {
  title: string;
  model: string;
  status?: number;
  requestId?: string;
}

export const ErrorType = {
  QUOTA_EXCEEDED: 'quota_exceeded',
  INVALID_API_KEY: 'invalid_api_key',
  SERVER_ERROR: 'server_error',
  RATE_LIMIT: 'rate_limit',
  UNKNOWN: 'unknown',
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];
