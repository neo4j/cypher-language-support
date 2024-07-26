/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['out', 'tests', 'dist'],
};
