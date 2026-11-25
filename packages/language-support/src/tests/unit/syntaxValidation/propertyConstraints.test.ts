import type { DbSchema } from '../../../dbSchema.js';
import { getDiagnosticsForQuery } from './helpers.js';

function schema(propertyType = 'STRING'): DbSchema {
  return {
    labels: ['Person'],
    propertyKeys: ['name'],
    constraintInfo: {
      fieldNames: [],
      constraints: [
        {
          type: 'NODE_PROPERTY_TYPE',
          labelsOrTypes: ['Person'],
          properties: ['name'],
          enforcedLabel: '',
          propertyType,
        },
      ],
    },
  };
}

describe('Property constraint types', () => {
  test('warns when Movie.title is assigned an integer against a STRING constraint', () => {
    const query = 'MATCH (c:Movie)\nSET c.title = 5\nRETURN c.title;';
    const diagnostics = getDiagnosticsForQuery({
      query,
      dbSchema: {
        labels: ['Movie'],
        propertyKeys: ['title'],
        constraintInfo: {
          fieldNames: [],
          constraints: [
            {
              type: 'NODE_PROPERTY_TYPE',
              labelsOrTypes: ['Movie'],
              properties: ['title'],
              enforcedLabel: '',
              propertyType: 'STRING',
            },
          ],
        },
      },
    });

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]).toMatchObject({
      message:
        'Type mismatch for property title: expected STRING but was INTEGER',
      severity: 2,
      offsets: {
        start: query.indexOf('title'),
        end: query.indexOf('title') + 5,
      },
    });
  });

  test.each([
    ['42', 'STRING', 'INTEGER'],
    ['-42', 'STRING', 'INTEGER'],
    ['1.5', 'STRING', 'FLOAT'],
    ['true', 'STRING', 'BOOLEAN'],
    ["'Alice'", 'INTEGER', 'STRING'],
  ])('warns for %s assigned to %s', (rhs, expected, actual) => {
    const query = `MATCH (n:Person) SET n.name = ${rhs}`;
    const diagnostics = getDiagnosticsForQuery({
      query,
      dbSchema: schema(expected),
    });

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]).toMatchObject({
      message: `Type mismatch for property name: expected ${expected} but was ${actual}`,
      severity: 2,
      offsets: { start: query.indexOf('name'), end: query.indexOf('name') + 4 },
    });
  });

  test.each(["'Alice'", 'null', '$value', '1 + 2', 'toString(42)'])(
    'does not warn for a matching or unsupported RHS: %s',
    (rhs) => {
      const diagnostics = getDiagnosticsForQuery({
        query: `MATCH (n:Person) SET n.name = ${rhs}`,
        dbSchema: { ...schema(), parameters: { value: 'Alice' } },
      });
      expect(diagnostics).toEqual([]);
    },
  );

  test('uses variable references across statements', () => {
    const diagnostics = getDiagnosticsForQuery({
      query:
        'RETURN 1; MATCH (n:Person) WITH n, 42 AS value SET n.name = value',
      dbSchema: schema(),
    });
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.message).toBe(
      'Type mismatch for property name: expected STRING but was INTEGER',
    );
  });

  test('accepts matching inferred variable types', () => {
    expect(
      getDiagnosticsForQuery({
        query: "MATCH (n:Person) WITH n, 'Alice' AS value SET n.name = value",
        dbSchema: schema(),
      }),
    ).toEqual([]);
  });

  test('skips unknown inferred variable types', () => {
    expect(
      getDiagnosticsForQuery({
        query:
          'MATCH (n:Person)-->(m) WITH n, m.name AS value SET n.name = value',
        dbSchema: schema(),
      }),
    ).toEqual([]);
  });

  test('resolves shadowed RHS variables by reference', () => {
    const diagnostics = getDiagnosticsForQuery({
      query: `MATCH (n:Person) WITH n, 42 AS value
        CALL (n) { WITH n, 'Alice' AS value SET n.name = value }
        SET n.name = value`,
      dbSchema: schema(),
    }).filter((diagnostic) =>
      diagnostic.message.startsWith('Type mismatch for property'),
    );
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.message).toBe(
      'Type mismatch for property name: expected STRING but was INTEGER',
    );
  });

  test('does not check property reads against assignment constraints', () => {
    expect(
      getDiagnosticsForQuery({
        query: 'MATCH (n:Person) WHERE n.name = 42 RETURN n.name',
        dbSchema: schema(),
      }),
    ).toEqual([]);
  });

  test('does not warn without a matching constraint', () => {
    expect(
      getDiagnosticsForQuery({
        query: 'MATCH (n:Person) SET n.name = 42',
        dbSchema: {},
      }),
    ).toEqual([]);
  });
});
