import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  PORT: z.string().transform(Number).pipe(z.number().positive()),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    if (process.env.NODE_ENV === 'test') {
      // Return default values for tests
      return {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'test-api-key',
        PORT: process.env.PORT || '5000',
        NODE_ENV: 'test',
      };
    }
    throw new Error(`Environment validation failed: ${result.error.message}`);
  }

  return result.data;
};

export const ENV = parseEnv();
