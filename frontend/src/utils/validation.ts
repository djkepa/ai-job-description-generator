import { UI_CONFIG, JobSeniority, CompanyType } from '../constants/index.js';

export const validateJobTitle = (title: string): { isValid: boolean; error?: string } => {
  const trimmed = title.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Job title is required' };
  }

  if (trimmed.length > UI_CONFIG.MAX_TITLE_LENGTH) {
    return {
      isValid: false,
      error: `Job title must be ${UI_CONFIG.MAX_TITLE_LENGTH} characters or less`,
    };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Job title must be at least 2 characters' };
  }

  return { isValid: true };
};

export const isValidSeniority = (value: string): value is JobSeniority => {
  return Object.values(JobSeniority).includes(value as JobSeniority);
};

export const isValidCompanyType = (value: string): value is CompanyType => {
  return Object.values(CompanyType).includes(value as CompanyType);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};
