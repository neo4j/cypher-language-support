import { cypher25Supported } from '../version';

describe('version tests', () => {
  test('cypher 25 should not be supported in 5.27.0', () => {
    expect(cypher25Supported('5.27.0')).toBe(false);
  });

  test('cypher 25 should not be supported in 5.27.0-2025030', () => {
    expect(cypher25Supported('5.27.0-2025030')).toBe(false);
  });

  test('cypher 25 should be supported 5.27.0-2025040 onwards', () => {
    expect(cypher25Supported('5.27.0-2025040')).toBe(true);
    expect(cypher25Supported('5.27.0-2025050')).toBe(true);
    expect(cypher25Supported('5.27.0-2025060')).toBe(true);
    expect(cypher25Supported('5.28')).toBe(true);
    expect(cypher25Supported('5.28.0')).toBe(true);
    expect(cypher25Supported('6.1.0')).toBe(true);
  });
});
