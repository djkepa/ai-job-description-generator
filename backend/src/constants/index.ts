export const API_CONSTANTS = {
  REQUEST_TIMEOUT_MS: 30000,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  OPENAI_MAX_TOKENS: 500,
  OPENAI_TEMPERATURE: 0.7,
  CACHE_TTL_SECONDS: 300, // 5 minutes
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const LOG_LEVELS = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export const OPENAI_MODELS = {
  GPT_4O_MINI: 'gpt-4o-mini',
  GPT_4O: 'gpt-4o',
  GPT_35_TURBO: 'gpt-3.5-turbo',
} as const;
