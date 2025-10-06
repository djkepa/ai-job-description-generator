import { Router, type Request, type Response } from 'express';
import OpenAI from 'openai';
import { ZodError } from 'zod';

import { ENV } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { OpenAIService } from '../services/openai/index.js';
import { cacheService } from '../services/cacheService.js';
import { generateRequestId, createCacheKey } from '../utils/requestId.js';
import { handleValidationError, createErrorResponse } from '../utils/validation.js';
import { API_CONSTANTS, HTTP_STATUS } from '../constants/index.js';
import { generateRequestSchema, type GenerateResponse, type ErrorResponse } from '../types/api.js';

const router = Router();
const openaiService = new OpenAIService();

router.post('/generate', (req: Request, res: Response<GenerateResponse | ErrorResponse>): void => {
  const handleRequest = async (): Promise<void> => {
    const requestId = generateRequestId();

    try {
      const validatedRequest = generateRequestSchema.parse(req.body);
      const { title, seniority, company_type } = validatedRequest;

      logger.info('Processing job description request', {
        requestId,
        title,
        seniority,
        company_type,
      });

      // Check cache first
      const cacheKey = createCacheKey(title, seniority, company_type);
      const cachedResult = cacheService.get<GenerateResponse>(cacheKey);

      if (cachedResult) {
        logger.info('Returning cached result', { requestId, title });
        res.json(cachedResult);
        return;
      }

      // Generate new description
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONSTANTS.REQUEST_TIMEOUT_MS);

      try {
        const { description, model } = await openaiService.generateJobDescription(
          validatedRequest,
          controller.signal,
        );

        clearTimeout(timeoutId);

        const response: GenerateResponse = {
          description,
          metadata: {
            title,
            generated_at: new Date().toISOString(),
            model_used: model,
            cache_hit: false,
          },
        };

        // Cache the result
        cacheService.set(cacheKey, {
          ...response,
          metadata: { ...response.metadata, cache_hit: true },
        });

        logger.info('Job description generated successfully', {
          requestId,
          title,
          length: description.length,
          model,
        });

        res.status(HTTP_STATUS.OK).json(response);
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === 'AbortError') {
          logger.error('Request timeout', error, { requestId, title });
          res
            .status(HTTP_STATUS.TIMEOUT)
            .json(
              createErrorResponse(
                'Request timeout',
                'The request took too long to complete',
                requestId,
              ),
            );
          return;
        }

        throw error;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Validation error', { requestId, errors: error.errors });
        res.status(HTTP_STATUS.BAD_REQUEST).json(handleValidationError(error, requestId));
        return;
      }

      if (error instanceof OpenAI.APIError) {
        logger.error('OpenAI API error', error, { requestId, status: error.status });
        const statusCode =
          typeof error.status === 'number' ? error.status : HTTP_STATUS.INTERNAL_SERVER_ERROR;
        res
          .status(statusCode)
          .json(
            createErrorResponse(
              'AI service error',
              ENV.NODE_ENV === 'development' ? error.message : 'Failed to generate description',
              requestId,
            ),
          );
        return;
      }

      logger.error('Unexpected error', error instanceof Error ? error : undefined, { requestId });
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(
          createErrorResponse(
            'Internal server error',
            ENV.NODE_ENV === 'development' ? String(error) : 'Something went wrong',
            requestId,
          ),
        );
    }
  };

  handleRequest().catch((err: Error) => {
    logger.error('Unhandled async error', err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: 'Internal server error',
      details: 'Something went wrong',
      timestamp: new Date().toISOString(),
      request_id: 'unknown',
    });
  });
});

export default router;
