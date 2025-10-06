import OpenAI from 'openai';

import { logger } from '../../utils/logger.js';
import { ErrorType, type OpenAIErrorContext } from './types.js';

export class OpenAIErrorHandler {
  static getErrorType(error: unknown): ErrorType {
    if (error instanceof OpenAI.APIError) {
      switch (error.status) {
        case 429:
          return ErrorType.QUOTA_EXCEEDED;
        case 401:
          return ErrorType.INVALID_API_KEY;
        case 500:
        case 502:
        case 503:
          return ErrorType.SERVER_ERROR;
        default:
          return ErrorType.UNKNOWN;
      }
    }
    return ErrorType.UNKNOWN;
  }

  static logError(error: unknown, context: OpenAIErrorContext): void {
    if (error instanceof OpenAI.APIError) {
      const errorType = this.getErrorType(error);

      if (errorType === ErrorType.QUOTA_EXCEEDED) {
        logger.warn('OpenAI API quota exceeded, using mock data for demo', {
          ...context,
          error: error.message,
          errorType,
        });
        return;
      }

      logger.error('OpenAI API error', error, {
        ...context,
        status: error.status,
        errorType,
      });
    } else {
      logger.error('OpenAI generation failed', error instanceof Error ? error : undefined, {
        ...context,
        errorType: ErrorType.UNKNOWN,
      });
    }
  }

  static shouldUseFallback(error: unknown): boolean {
    const errorType = this.getErrorType(error);
    return errorType === ErrorType.QUOTA_EXCEEDED;
  }

  static getErrorMessage(error: unknown): string {
    if (error instanceof OpenAI.APIError) {
      const errorType = this.getErrorType(error);

      switch (errorType) {
        case ErrorType.QUOTA_EXCEEDED:
          return 'API quota exceeded. Please check your billing details.';
        case ErrorType.INVALID_API_KEY:
          return 'Invalid API key. Please check your configuration.';
        case ErrorType.SERVER_ERROR:
          return 'OpenAI servers are experiencing issues. Please try again later.';
        default:
          return error.message || 'An unexpected error occurred.';
      }
    }

    return error instanceof Error ? error.message : 'An unexpected error occurred.';
  }

  static createUserFriendlyError(error: unknown, _context: OpenAIErrorContext): Error {
    const message = this.getErrorMessage(error);
    const userError = new Error(message);

    // Preserve original error for debugging
    if (error instanceof Error) {
      userError.stack = error.stack;
      userError.cause = error;
    }

    return userError;
  }
}
