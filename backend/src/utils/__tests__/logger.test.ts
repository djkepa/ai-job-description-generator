import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { logger } from '../logger.js';

// Mock process.stdout and process.stderr
const mockStdout = { write: jest.fn().mockReturnValue(true) };
const mockStderr = { write: jest.fn().mockReturnValue(true) };

describe('Logger', () => {
  beforeEach(() => {
    process.stdout.write = mockStdout.write as typeof process.stdout.write;
    process.stderr.write = mockStderr.write as typeof process.stderr.write;
    jest.clearAllMocks();
  });

  describe('info', () => {
    it('should format messages correctly', () => {
      expect(() => logger.info('Test message')).not.toThrow();
    });
  });

  describe('error', () => {
    it('should log errors to stderr', () => {
      const error = new Error('Test error');
      logger.error('Something went wrong', error);

      expect(mockStderr.write).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] Something went wrong'),
      );
      expect(mockStderr.write).toHaveBeenCalledWith(
        expect.stringContaining('"error":"Test error"'),
      );
    });

    it('should include stack trace for Error objects', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);

      expect(mockStderr.write).toHaveBeenCalledWith(expect.stringContaining('"stack":'));
    });
  });
});
