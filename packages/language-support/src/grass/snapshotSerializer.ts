import type { SnapshotSerializer } from 'vitest';

/**
 * Custom snapshot serializer that produces valid JSON without trailing commas.
 * Used for .json file snapshots to ensure they're valid, readable JSON.
 */
export const jsonSerializer: SnapshotSerializer = {
  test(val: unknown): boolean {
    return Array.isArray(val) || (typeof val === 'object' && val !== null);
  },
  serialize(val: unknown): string {
    return JSON.stringify(val, null, 2);
  },
};

