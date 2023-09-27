const path = require('path');

module.exports = {
  moduleFileExtensions: ['js'],
  testEnvironment: './e2e_tests/setup/vscode-environment.js',
  testMatch: ['<rootDir>/out/**/*.spec.js'],
  moduleNameMapper: {
    vscode: path.join(__dirname, 'e2e_tests', 'setup', 'vscode.js'),
  },
  setupFilesAfterEnv: ['./e2e_tests/setup/jest.setup.js'],
};
