import { useMutation } from '@tanstack/react-query';

import { jobService } from '../services/jobService.js';
import { QUERY_KEYS } from '../constants/index.js';
import type { GenerateJobRequest, GenerateJobResponse } from '../types/api.js';

export const useJobGenerator = () => {
  return useMutation<GenerateJobResponse, Error, GenerateJobRequest>({
    mutationKey: [QUERY_KEYS.GENERATE_JOB],
    mutationFn: jobService.generateDescription,
    retry: 1,
    retryDelay: 2000,
  });
};
