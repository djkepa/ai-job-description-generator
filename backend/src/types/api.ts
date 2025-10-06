import { z } from 'zod';

export const generateRequestSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(200, 'Job title too long'),
  seniority: z.enum(['junior', 'mid', 'senior']).optional(),
  company_type: z.enum(['startup', 'corporate', 'agency']).optional(),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export interface GenerateResponse {
  description: string;
  metadata: {
    title: string;
    generated_at: string;
    model_used: string;
    cache_hit: boolean;
  };
}

export interface ErrorResponse {
  error: string;
  details?: string;
  timestamp: string;
  request_id: string;
}
