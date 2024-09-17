module.exports = {
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Half Price Test Report',
        includeFailureMsg: true,
      },
    ],
  ],
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js'],
  testMatch: ['**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000,
};
