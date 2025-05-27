/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    "^.+\\.svg": "<rootDir>/tests/mocks/svgMock.tsx",
    "^react-markdown$": "<rootDir>/tests/mocks/react-markdown",
    // Add path aliases from tsconfig.paths.json
    "@/(.*)": "<rootDir>/src/$1",
    "@components/(.*)": "<rootDir>/src/presentation/components/$1",
    "@domain/(.*)": "<rootDir>/src/domain/$1",
    "@application/(.*)": "<rootDir>/src/application/$1",
    "@infrastructure/(.*)": "<rootDir>/src/infrastructure/$1",
    "@main/(.*)": "<rootDir>/src/main/$1",
    "@presentation/(.*)": "<rootDir>/src/presentation/$1",
    "@shared/(.*)": "<rootDir>/src/shared/$1",
    "@utils/(.*)": "<rootDir>/src/utils/$1",
    "@api/(.*)": "<rootDir>/src/api/$1",
    "@tests/(.*)": "<rootDir>/src/tests/$1"
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: ['<rootDir>'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // Use main tsconfig instead of test-specific one
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown)/)',
  ],
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)']
};

module.exports = config;
