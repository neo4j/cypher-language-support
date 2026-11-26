import type { DbSchema } from '../../../dbSchema.js';
import { getDiagnosticsForQuery } from './helpers.js';

describe('Property constraint types', () => {
  const testSchema: DbSchema = {
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
          propertyType: 'STRING',
        },
      ],
    },
  };

  test.each([
    ['42', 'STRING', 'INTEGER'],
    ['-42', 'STRING', 'INTEGER'],
    ['1.5', 'STRING', 'FLOAT'],
    ['true', 'STRING', 'BOOLEAN'],
    ["'Alice'", 'INTEGER', 'STRING'],
  ])('warns for %s assigned to %s', (rhs, expectedPropertyType, actual) => {
    const query = `MATCH (n:Person) SET n.name = ${rhs}`;
    const diagnostics = getDiagnosticsForQuery({
      query,
      dbSchema: {
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
              propertyType: expectedPropertyType,
            },
          ],
        },
      },
    });

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]).toMatchObject({
      message: `Type mismatch for property name: expected ${expectedPropertyType} but was ${actual}`,
      severity: 2,
      offsets: { start: query.indexOf('name'), end: query.indexOf('name') + 4 },
    });
  });

  test.each(["'Alice'", 'null', '$value', 'toString(42)'])(
    'does not warn for setting a STRING property to %s',
    (rhs) => {
      const diagnostics = getDiagnosticsForQuery({
        query: `MATCH (n:Person) SET n.name = ${rhs}`,
        dbSchema: { ...testSchema, parameters: { value: 'Alice' } },
      });
      expect(diagnostics).toEqual([]);
    },
  );

  test('warns on incorrect variable references', () => {
    const diagnostics = getDiagnosticsForQuery({
      query:
        'RETURN 1; MATCH (n:Person) WITH n, 42 AS value SET n.name = value',
      dbSchema: testSchema,
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
        dbSchema: testSchema,
      }),
    ).toEqual([]);
  });

  test('does not warn on unknown inferred variable types', () => {
    expect(
      getDiagnosticsForQuery({
        query:
          'MATCH (n:Person)-->(m) WITH n, m.name AS value SET n.name = value',
        dbSchema: testSchema,
      }),
    ).toEqual([]);
  });

  test('resolves shadowed variables type by reference', () => {
    expect(
      getDiagnosticsForQuery({
        query: `MATCH (n:Person) WITH n, 42 AS value
        CALL (n) { WITH n, 'Alice' AS value SET n.name = value }
        RETURN n`,
        dbSchema: testSchema,
      }).filter(
        (diagnostic) =>
          diagnostic.message.startsWith('Type mismatch for property'), // Filter out shadowed warning
      ),
    ).toEqual([]);
  });

  test('resolves shadowed variables by reference in warning', () => {
    const diagnostics = getDiagnosticsForQuery({
      query: `MATCH (n:Person) WITH n, 42 AS value
        CALL (n) { WITH n, 'Alice' AS value SET n.name = value }
        SET n.name = value`,
      dbSchema: testSchema,
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
        dbSchema: testSchema,
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
