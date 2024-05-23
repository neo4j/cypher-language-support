/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['out', 'e2e_tests', 'dist'],
};
