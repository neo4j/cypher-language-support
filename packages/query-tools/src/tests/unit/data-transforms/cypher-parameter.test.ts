import { Date, int, vector } from 'neo4j-driver';
import { describe, expect, test } from 'vitest';
import { toCypherParameter } from '../../../data-transforms/cypher-type-names.js';

describe('toCypherParameter', () => {
  test.each([
    ['a string', 'charmander', { type: 'String', stringValue: '"charmander"' }],
    ['a float', 13.5, { type: 'Float', stringValue: '13.5' }],
    ['an integer', int(1337), { type: 'Integer', stringValue: '1337' }],
    ['a boolean', true, { type: 'Boolean', stringValue: 'true' }],
    ['null', null, { type: 'null', stringValue: 'null' }],
    [
      'a date',
      new Date(2026, 11, 27),
      { type: 'Date', stringValue: '2026-11-27' },
    ],
    [
      'a vector',
      vector(new Int32Array([1, 2])),
      { type: 'Vector', stringValue: 'vector([1, 2], 2, INTEGER32 NOT NULL)' },
    ],
    ['a list', ['a', 'b'], { type: 'List', stringValue: '["a", "b"]' }],
    ['a map', { a: int(1) }, { type: 'Map', stringValue: '{\n  a: 1\n}' }],
  ])('creates a parameter from %s', (_, value, expected) => {
    expect(toCypherParameter(value)).toEqual(expected);
  });
});
