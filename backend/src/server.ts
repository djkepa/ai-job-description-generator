import express, { type Express } from 'express';
import cors from 'cors';

import { ENV } from './config/env.js';
import { logger } from './utils/logger.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimit } from './middleware/rateLimit.js';
import { cacheService } from './services/cacheService.js';
import generateRouter from './routes/generate.js';

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);
app.use(rateLimit);

app.use('/api', generateRouter);

app.get('/health', (_, res) => {
  const cacheStats = cacheService.getStats();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    cache: {
      entries: cacheStats.size,
      memory_usage: process.memoryUsage(),
    },
  });
});

app.use(errorHandler);

const server = app.listen(ENV.PORT, () => {
  logger.info(`Server running on port ${ENV.PORT}`, {
    env: ENV.NODE_ENV,
    port: ENV.PORT,
  });
});

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);

  cacheService.destroy();

  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
