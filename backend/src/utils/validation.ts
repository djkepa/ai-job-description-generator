import type { ZodError } from 'zod';

import type { ErrorResponse } from '../types/api.js';

export const handleValidationError = (error: ZodError, requestId: string): ErrorResponse => {
  const firstError = error.errors[0];
  const details = firstError?.message || 'Validation failed';

  return {
    error: 'Invalid request',
    details,
    timestamp: new Date().toISOString(),
    request_id: requestId,
  };
};

export const createErrorResponse = (
  error: string,
  details: string,
  requestId: string,
): ErrorResponse => {
  return {
    error,
    details,
    timestamp: new Date().toISOString(),
    request_id: requestId,
  };
};
