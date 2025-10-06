require('@testing-library/jest-dom');
const { jest } = require('@jest/globals');

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(''),
  },
});

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
  },
});

// Mock environment variables
import.meta.env = {
  DEV: false,
  PROD: true,
  VITE_API_BASE_URL: 'http://localhost:5000/api',
};

// Global test utilities
global.createMockResponse = (data, options = {}) => ({
  data,
  status: options.status || 200,
  statusText: options.statusText || 'OK',
  headers: options.headers || {},
  config: {},
});

global.createMockError = (message, status = 500) => {
  const error = new Error(message);
  error.response = {
    status,
    data: { error: message },
  };
  return error;
};
