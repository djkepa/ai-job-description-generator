import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 100;

const store: RateLimitStore = {};

const cleanupStore = (): void => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    const entry = store[key];
    if (entry && entry.resetTime < now) {
      delete store[key];
    }
  });
};

setInterval(cleanupStore, 60 * 1000);

export const rateLimit = (req: Request, res: Response, next: NextFunction): void => {
  const clientId = req.ip ?? 'unknown';
  const now = Date.now();

  const existingEntry = store[clientId];
  if (!existingEntry || existingEntry.resetTime < now) {
    store[clientId] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    next();
    return;
  }

  const currentEntry = store[clientId];
  if (!currentEntry) {
    store[clientId] = { count: 1, resetTime: now + WINDOW_MS };
    next();
    return;
  }

  currentEntry.count += 1;

  if (currentEntry.count > MAX_REQUESTS) {
    logger.warn('Rate limit exceeded', { ip: clientId });
    res.status(429).json({
      error: 'Too many requests',
      details: 'Please try again later',
    });
    return;
  }

  next();
};
