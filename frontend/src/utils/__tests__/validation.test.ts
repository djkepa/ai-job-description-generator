import { describe, it, expect } from '@jest/globals';
import { validateJobTitle, isValidSeniority, sanitizeInput } from '../validation.js';
import { JobSeniority } from '../../constants/index.js';

describe('Validation Utils', () => {
  describe('validateJobTitle', () => {
    it('should validate correct job titles', () => {
      const result = validateJobTitle('Senior React Developer');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty titles', () => {
      const result = validateJobTitle('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Job title is required');
    });

    it('should reject whitespace-only titles', () => {
      const result = validateJobTitle('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Job title is required');
    });

    it('should reject too short titles', () => {
      const result = validateJobTitle('A');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Job title must be at least 2 characters');
    });

    it('should reject too long titles', () => {
      const longTitle = 'A'.repeat(201);
      const result = validateJobTitle(longTitle);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('200 characters or less');
    });

    it('should handle titles at length limits', () => {
      const maxLengthTitle = 'A'.repeat(200);
      const result = validateJobTitle(maxLengthTitle);
      expect(result.isValid).toBe(true);

      const minLengthTitle = 'AB';
      const minResult = validateJobTitle(minLengthTitle);
      expect(minResult.isValid).toBe(true);
    });
  });

  describe('isValidSeniority', () => {
    it('should validate correct seniority levels', () => {
      expect(isValidSeniority('junior')).toBe(true);
      expect(isValidSeniority('mid')).toBe(true);
      expect(isValidSeniority('senior')).toBe(true);
    });

    it('should reject invalid seniority levels', () => {
      expect(isValidSeniority('expert')).toBe(false);
      expect(isValidSeniority('beginner')).toBe(false);
      expect(isValidSeniority('')).toBe(false);
      expect(isValidSeniority('SENIOR')).toBe(false);
    });

    it('should work with enum values', () => {
      expect(isValidSeniority(JobSeniority.JUNIOR)).toBe(true);
      expect(isValidSeniority(JobSeniority.MID)).toBe(true);
      expect(isValidSeniority(JobSeniority.SENIOR)).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });

    it('should replace multiple spaces with single space', () => {
      expect(sanitizeInput('hello    world')).toBe('hello world');
      expect(sanitizeInput('hello\t\tworld')).toBe('hello world');
      expect(sanitizeInput('hello\n\nworld')).toBe('hello world');
    });

    it('should handle mixed whitespace', () => {
      expect(sanitizeInput('  hello  \t  world  \n  ')).toBe('hello world');
    });

    it('should handle empty string', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
    });
  });
});
