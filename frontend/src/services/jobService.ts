import { apiClient } from './apiClient.js';
import type { GenerateJobRequest, GenerateJobResponse, HealthResponse } from '../types/api.js';

export const jobService = {
  generateDescription: async (request: GenerateJobRequest): Promise<GenerateJobResponse> => {
    return apiClient.post<GenerateJobResponse>('/generate', request);
  },

  checkHealth: async (): Promise<HealthResponse> => {
    return apiClient.get<HealthResponse>('/health');
  },
};
