import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { parseGrass, stringifyGrass } from './index';
import { jsonSerializer } from './snapshotSerializer';

// Use JSON serializer for clean snapshots without trailing commas
expect.addSnapshotSerializer(jsonSerializer);

const FIXTURES_DIR = join(__dirname, '__fixtures__');

// Get all .grass fixture files and create test cases
const fixtures = readdirSync(FIXTURES_DIR)
  .filter((f) => f.endsWith('.grass'))
  .map((file) => ({
    name: basename(file, '.grass'),
    input: readFileSync(join(FIXTURES_DIR, file), 'utf-8').trim(),
  }));

describe('Grass DSL Parser', () => {
  describe.each(fixtures)('$name', ({ name, input }) => {
    it('parses without errors', () => {
      const result = parseGrass(input);
      expect(result.errors).toHaveLength(0);
    });

    it('matches expected output', async () => {
      const result = parseGrass(input);
      await expect(result.rules).toMatchFileSnapshot(
        join(FIXTURES_DIR, `${name}.json`),
      );
    });

    it('round-trips correctly', () => {
      const parsed = parseGrass(input);
      const stringified = stringifyGrass(parsed.rules);
      const reparsed = parseGrass(stringified);

      expect(reparsed.errors).toHaveLength(0);
      expect(reparsed.rules).toEqual(parsed.rules);
    });
  });
});
