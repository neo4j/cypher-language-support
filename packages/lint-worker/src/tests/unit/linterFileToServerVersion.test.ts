import { linterFileToServerVersion } from '../../helpers.js';

describe('linterFileToServerVersion', () => {
  test.each([
    ['5.23-lintWorker-2.0.0.cjs', '5.23'],
    ['2025.01-lintWorker-2.0.0.cjs', '2025.01'],
    ['2025.01-lintWorker-2.0.0-next.13.cjs', '2025.01'],
  ])('Extracts the server version from %s', (fileName, expectedVersion) => {
    expect(linterFileToServerVersion(fileName)).toBe(expectedVersion);
  });

  test.each([
    '',
    'lintWorker.cjs',
    '5.23-lintWorker.cjs',
    '5.23-lintWorker-2.0.0.mjs',
    '5.23-lintWorker-2.0.0.cjs.bak',
  ])('Returns undefined for an invalid filename: "%s"', (fileName) => {
    expect(linterFileToServerVersion(fileName)).toBeUndefined();
  });
});
