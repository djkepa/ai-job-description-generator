import OpenAI from 'openai';

import { ENV } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { API_CONSTANTS, OPENAI_MODELS } from '../../constants/index.js';
import type { GenerateRequest } from '../../types/api.js';
import { PromptBuilder } from './promptBuilder.js';
import { MockDataService } from './mockDataService.js';
import { OpenAIErrorHandler } from './errorHandler.js';
import type { OpenAIGenerationResponse, OpenAIErrorContext } from './types.js';

export class OpenAIService {
  private client: OpenAI;
  private readonly model: string;

  constructor() {
    this.client = new OpenAI({
      apiKey: ENV.OPENAI_API_KEY,
    });
    this.model = OPENAI_MODELS.GPT_4O_MINI;
  }

  async generateJobDescription(
    request: GenerateRequest,
    abortSignal: AbortSignal,
  ): Promise<OpenAIGenerationResponse> {
    const { title, seniority, company_type } = request;

    logger.info('Generating job description', { title, seniority, company_type });

    // Only use demo mode for development without API key
    if (!ENV.OPENAI_API_KEY || ENV.OPENAI_API_KEY === 'your_openai_api_key_here') {
      logger.warn('No valid OpenAI API key configured, using mock data', { title });
      return MockDataService.generateMockDescription(request);
    }

    const errorContext: OpenAIErrorContext = {
      title,
      model: this.model,
    };

    try {
      return await this.callOpenAI(request, abortSignal);
    } catch (error) {
      OpenAIErrorHandler.logError(error, errorContext);

      // Use fallback for specific errors (like quota exceeded)
      if (OpenAIErrorHandler.shouldUseFallback(error)) {
        return MockDataService.generateMockDescription(request);
      }

      // For other errors, throw user-friendly error
      throw OpenAIErrorHandler.createUserFriendlyError(error, errorContext);
    }
  }

  private async callOpenAI(
    request: GenerateRequest,
    abortSignal: AbortSignal,
  ): Promise<OpenAIGenerationResponse> {
    const { title } = request;
    const messages = PromptBuilder.buildMessages(request);

    const completion = await this.client.chat.completions.create(
      {
        model: this.model,
        messages,
        temperature: API_CONSTANTS.OPENAI_TEMPERATURE,
        max_tokens: API_CONSTANTS.OPENAI_MAX_TOKENS,
      },
      { signal: abortSignal },
    );

    const description = completion.choices[0]?.message?.content;

    if (!description) {
      throw new Error('No description generated from OpenAI');
    }

    logger.info('Successfully generated job description', {
      title,
      length: description.length,
      model: this.model,
    });

    return { description, model: this.model };
  }
}
