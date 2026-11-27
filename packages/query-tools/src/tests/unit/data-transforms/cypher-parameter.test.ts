import { Date, int, vector } from 'neo4j-driver';
import { describe, expect, test } from 'vitest';
import { toCypherParameter } from '../../../data-transforms/cypher-type-names.js';

describe('toCypherParameter', () => {
  test('creates a parameter from a string', () => {
    expect(toCypherParameter('charmander')).toEqual({
      type: 'String',
      stringValue: '"charmander"',
    });
  });

  test('creates a parameter from a float', () => {
    expect(toCypherParameter(13.5)).toEqual({
      type: 'Float',
      stringValue: '13.5',
    });
  });

  test('creates a parameter from an integer', () => {
    expect(toCypherParameter(int(1337))).toEqual({
      type: 'Integer',
      stringValue: '1337',
    });
  });

  test('creates a parameter from a boolean', () => {
    expect(toCypherParameter(true)).toEqual({
      type: 'Boolean',
      stringValue: 'true',
    });
  });

  test('creates a parameter from null', () => {
    expect(toCypherParameter(null)).toEqual({
      type: 'null',
      stringValue: 'null',
    });
  });

  test('creates a parameter from a date', () => {
    expect(toCypherParameter(new Date(2026, 11, 27))).toEqual({
      type: 'Date',
      stringValue: '2026-11-27',
    });
  });

  test('creates a parameter from a vector', () => {
    expect(toCypherParameter(vector(new Int32Array([1, 2])))).toEqual({
      type: 'Vector',
      stringValue: 'vector([1, 2], 2, INTEGER32 NOT NULL)',
    });
  });

  test('creates a parameter from a list', () => {
    expect(toCypherParameter(['a', 'b'])).toEqual({
      type: 'List',
      stringValue: '["a", "b"]',
    });
  });

  test('creates a parameter from a map', () => {
    expect(toCypherParameter({ a: int(1) })).toEqual({
      type: 'Map',
      stringValue: '{\n  a: 1\n}',
    });
  });
});
