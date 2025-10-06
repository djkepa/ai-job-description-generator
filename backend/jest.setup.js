const { jest } = require('@jest/globals');

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.PORT = '5000';
process.env.NODE_ENV = 'test';

// Global test utilities
global.mockConsoleError = () => {
  const originalError = console.error;
  const mockError = jest.fn();
  console.error = mockError;
  return () => {
    console.error = originalError;
  };
};

// Suppress console output during tests
if (process.env.NODE_ENV === 'test') {
  console.log = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
}
