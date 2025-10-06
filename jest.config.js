/** @type {import('jest').Config} */
export default {
  projects: [
    {
      displayName: 'backend',
      testMatch: ['<rootDir>/backend/src/**/*.{test,spec}.{js,ts}'],
      testEnvironment: 'node',
      preset: 'ts-jest/presets/default-esm',
      extensionsToTreatAsEsm: ['.ts'],
      globals: {
        'ts-jest': {
          useESM: true,
        },
      },
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      transform: {
        '^.+\\.ts$': ['ts-jest', { useESM: true }],
      },
      collectCoverageFrom: [
        'backend/src/**/*.ts',
        '!backend/src/**/*.d.ts',
        '!backend/src/**/__tests__/**',
        '!backend/src/**/__mocks__/**',
      ],
      coverageDirectory: '<rootDir>/coverage/backend',
      coverageThreshold: {
        global: {
          branches: 75,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    {
      displayName: 'frontend',
      testMatch: ['<rootDir>/frontend/src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
      testEnvironment: 'jsdom',
      preset: 'ts-jest/presets/default-esm',
      extensionsToTreatAsEsm: ['.ts', '.tsx'],
      globals: {
        'ts-jest': {
          useESM: true,
        },
      },
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
      },
      collectCoverageFrom: [
        'frontend/src/**/*.{ts,tsx}',
        '!frontend/src/**/*.d.ts',
        '!frontend/src/**/__tests__/**',
        '!frontend/src/**/__mocks__/**',
        '!frontend/src/main.tsx',
        '!frontend/src/vite-env.d.ts',
      ],
      coverageDirectory: '<rootDir>/coverage/frontend',
      coverageThreshold: {
        global: {
          branches: 75,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  ],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'html'],
};
