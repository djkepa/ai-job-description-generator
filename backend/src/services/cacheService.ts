import { API_CONSTANTS } from '../constants/index.js';
import { logger } from '../utils/logger.js';
import type { CacheEntry } from '../types/common.js';

export class MemoryCacheService {
  private cache = new Map<string, CacheEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupInterval();
  }

  set<T>(key: string, data: T, ttlSeconds: number = API_CONSTANTS.CACHE_TTL_SECONDS): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      expiresAt: now + ttlSeconds * 1000,
      createdAt: now,
    };

    this.cache.set(key, entry);
    logger.info('Cache entry set', { key, ttl: ttlSeconds, size: this.cache.size });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      logger.info('Cache entry expired', { key });
      return null;
    }

    logger.info('Cache hit', { key, age: Date.now() - entry.createdAt });
    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.info('Cache entry deleted', { key });
    }
    return deleted;
  }

  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    logger.info('Cache cleared', { previousSize: size });
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000); // Cleanup every minute
  }

  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.info('Cache cleanup completed', { cleaned, remaining: this.cache.size });
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

export const cacheService = new MemoryCacheService();
