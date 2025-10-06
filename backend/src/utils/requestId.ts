import { randomBytes } from 'crypto';

export const generateRequestId = (): string => {
  return randomBytes(8).toString('hex');
};

export const createCacheKey = (title: string, seniority?: string, companyType?: string): string => {
  const normalized = title.toLowerCase().trim();
  const key = [normalized, seniority || 'mid', companyType || 'default'].join(':');
  return `job_description:${key}`;
};
