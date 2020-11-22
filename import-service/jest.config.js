module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  resetMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ['**/src/**/*.ts'],
  coveragePathIgnorePatterns: ['/mocks/'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/.serverless/',
    '/.webpack/',
    '/node_modules/',
    '/build/',
    '/test/mock/',
    '/test/fixtures/',
    '/mocks/',
  ],
  testMatch: ['**/__tests__/**/*.test.ts'],
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '@zendesk-apps-management-service/(.*)': '<rootDir>/src/zendesk-apps-management-service/$1',
    '@zendesk-escalation-ticket-app/(.*)': '<rootDir>/src/zendesk-escalation-ticket-app/$1',
    '@common/(.*)': '<rootDir>/src/common/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '@models/(.*)': '<rootDir>/src/models/$1',
    '@mocks/(.*)': '<rootDir>/src/mocks/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
  },
};
