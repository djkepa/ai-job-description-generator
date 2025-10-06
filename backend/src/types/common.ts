import type { LOG_LEVELS, HTTP_STATUS } from '../constants/index.js';

export type LogLevel = keyof typeof LOG_LEVELS;
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export interface LogContext {
  [key: string]: unknown;
}

export interface CacheEntry<T = unknown> {
  data: T;
  expiresAt: number;
  createdAt: number;
}

export interface RequestContext {
  requestId: string;
  startTime: number;
  ip: string;
  userAgent?: string;
}
