import type { JobSeniority, CompanyType } from '../constants/index.js';

export interface GenerateJobRequest {
  title: string;
  seniority?: JobSeniority;
  company_type?: CompanyType;
}

export interface JobMetadata {
  title: string;
  generated_at: string;
  model_used: string;
  cache_hit: boolean;
}

export interface GenerateJobResponse {
  description: string;
  metadata: JobMetadata;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
  timestamp: string;
  request_id: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  cache: {
    entries: number;
    memory_usage: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
      arrayBuffers: number;
    };
  };
}
