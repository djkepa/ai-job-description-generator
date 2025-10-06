import { ENV } from '../config/env.js';
import type { LogLevel, LogContext } from '../types/common.js';

const formatLog = (level: LogLevel, message: string, context?: LogContext): string => {
  const timestamp = new Date().toISOString();
  const baseLog = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  if (context && Object.keys(context).length > 0) {
    return `${baseLog} ${JSON.stringify(context)}`;
  }

  return baseLog;
};

export const logger = {
  info: (message: string, context?: LogContext): void => {
    if (ENV.NODE_ENV !== 'test') {
      process.stdout.write(formatLog('INFO', message, context) + '\n');
    }
  },

  warn: (message: string, context?: LogContext): void => {
    if (ENV.NODE_ENV !== 'test') {
      process.stdout.write(formatLog('WARN', message, context) + '\n');
    }
  },

  error: (message: string, error?: Error, context?: LogContext): void => {
    const errorContext = error ? { ...context, error: error.message, stack: error.stack } : context;

    process.stderr.write(formatLog('ERROR', message, errorContext) + '\n');
  },
};
