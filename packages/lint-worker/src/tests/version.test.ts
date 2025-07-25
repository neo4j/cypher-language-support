import { compareMajorMinorVersions } from '../version';

describe('Version comparison', () => {
  test('Comparing versions for major/minor version', () => {
    expect(compareMajorMinorVersions('5.24.0', '2025.01')).toBe(-1);
    expect(compareMajorMinorVersions('5.22.0', '5.23')).toBe(-1);
    expect(compareMajorMinorVersions('5.24', '2025.01')).toBe(-1);
    expect(compareMajorMinorVersions('2025.01', '5.24.0')).toBe(1);
    expect(compareMajorMinorVersions('2025.01', '5.24')).toBe(1);
    expect(compareMajorMinorVersions('2025.01', '2025.02')).toBe(-1);
    expect(compareMajorMinorVersions('2025.01', '2025.01')).toBe(0);

    expect(compareMajorMinorVersions('5.24.0', '5.25.0')).toBe(-1);
    expect(compareMajorMinorVersions('5.24.0', '5.25.1')).toBe(-1);
    expect(compareMajorMinorVersions('5.24.5', '5.25.3')).toBe(-1);
    expect(compareMajorMinorVersions('5.24.0', '26.25.0')).toBe(-1);
    expect(compareMajorMinorVersions('5.2000.2', '25.0.0')).toBe(-1);
    expect(compareMajorMinorVersions('5.2000.2-phi', '25.0.0-epsilon')).toBe(
      -1,
    );
    expect(compareMajorMinorVersions('5.2000.2-12', '25.0.0-20250503')).toBe(
      -1,
    );

    expect(compareMajorMinorVersions('2025.5.0', '2025.5.0')).toBe(0);
    expect(compareMajorMinorVersions('2025.5.2', '2025.5.5')).toBe(0);
    expect(compareMajorMinorVersions('2025.5.70', '2025.5.0')).toBe(0);
    expect(compareMajorMinorVersions('2025.5.0-a', '2025.5.0-a')).toBe(0);
    expect(compareMajorMinorVersions('2025.0.0-gamma', '2025.0.0-iota')).toBe(
      0,
    );
    expect(compareMajorMinorVersions('2025.0.0-1', '2025.0.0-2')).toBe(0);
    expect(compareMajorMinorVersions('2025.3.5-2025', '2025.3.0-2022')).toBe(0);

    expect(compareMajorMinorVersions('4.5.0', '3.5.0')).toBe(1);
    expect(compareMajorMinorVersions('5.25.0', '3.5.0')).toBe(1);
    expect(compareMajorMinorVersions('4.4.1', '3.5.2000')).toBe(1);
    expect(compareMajorMinorVersions('2024.5.0', '2023.500.30')).toBe(1);
    expect(compareMajorMinorVersions('4.5.0-alpha', '3.5.0-beta')).toBe(1);
  });
});
