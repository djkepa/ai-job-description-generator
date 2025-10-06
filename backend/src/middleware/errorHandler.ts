import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { ENV } from '../config/env.js';

interface ErrorWithStatus extends Error {
  status?: number;
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error('Unhandled error', err, {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  const status = err.status || 500;
  const message = ENV.NODE_ENV === 'development' ? err.message : 'Internal server error';

  res.status(status).json({
    error: message,
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
