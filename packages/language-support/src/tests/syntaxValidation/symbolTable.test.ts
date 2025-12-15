import { testData } from '../testData';
import { getSymbolTablesForQuery } from './helpers';

describe('Symbol table spec', () => {
  test('Symbol table works for the happy path', () => {
    const query = 'MATCH (n) RETURN n';

    expect(
      getSymbolTablesForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([
      [
        {
          definitionPosition: 7,
          labels: {
            andOr: 'and',
            children: [],
          },
          references: [7, 17],
          types: ['Node'],
          variable: 'n',
        },
      ],
    ]);
  });

  test('Symbol table is exposed correctly for a query with semantic errors', () => {
    const query = 'MATCH (n) RETURN m';

    expect(
      getSymbolTablesForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([
      [
        {
          definitionPosition: 17,
          labels: {
            andOr: 'and',
            children: [],
          },
          references: [17],
          types: ['Any'],
          variable: 'm',
        },
        {
          definitionPosition: 7,
          labels: {
            andOr: 'and',
            children: [],
          },
          references: [7],
          types: ['Node'],
          variable: 'n',
        },
      ],
    ]);
  });

  test('Symbol table is exposed independently for different statements', () => {
    const query = 'MATCH (n) RETURN m; MATCH (m) RETURN m';

    expect(
      getSymbolTablesForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([
      [
        {
          definitionPosition: 17,
          labels: {
            andOr: 'and',
            children: [],
          },
          references: [17],
          types: ['Any'],
          variable: 'm',
        },
        {
          definitionPosition: 7,
          labels: {
            andOr: 'and',
            children: [],
          },
          references: [7],
          types: ['Node'],
          variable: 'n',
        },
      ],
      [
        {
          definitionPosition: 27,
          labels: {
            andOr: 'and',
            children: [],
          },
          references: [27, 37],
          types: ['Node'],
          variable: 'm',
        },
      ],
    ]);
  });

  test('Symbol table contains labels and rels from MATCH with WHERE using OR', () => {
    const query = 'MATCH (n:Person) WHERE n:Parsnip OR n:Parish RETURN n';
    expect(
      getSymbolTablesForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([
      [
        {
          definitionPosition: 7,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 15,
                value: 'Person',
              },
              {
                andOr: 'or',
                children: [
                  {
                    validFrom: 32,
                    value: 'Parsnip',
                  },
                  {
                    validFrom: 44,
                    value: 'Parish',
                  },
                ],
              },
            ],
          },
          references: [23, 36, 7, 52],
          types: ['Node'],
          variable: 'n',
        },
      ],
    ]);
  });

  test('Symbol table contains labels and rels from MATCH with WHERE using OR', () => {
    const query =
      'MATCH (n) WHERE n:Person AND n:Parsnip OR n:Parish AND n:Party  RETURN n';
    expect(
      getSymbolTablesForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([
      [
        {
          definitionPosition: 7,
          labels: {
            andOr: 'and',
            children: [
              {
                andOr: 'or',
                children: [
                  {
                    andOr: 'and',
                    children: [
                      {
                        validFrom: 24,
                        value: 'Person',
                      },
                      {
                        validFrom: 38,
                        value: 'Parsnip',
                      },
                    ],
                  },
                  {
                    andOr: 'and',
                    children: [
                      {
                        validFrom: 50,
                        value: 'Parish',
                      },
                      {
                        validFrom: 62,
                        value: 'Party',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          references: [42, 29, 71, 7, 16, 55],
          types: ['Node'],
          variable: 'n',
        },
      ],
    ]);
  });

  test('Symbol table contains labels and rels from simple MATCH and WHERE', () => {
    const query = 'MATCH (n:Person) MATCH (n:Parish) WHERE n:Parsnip RETURN n';
    expect(
      getSymbolTablesForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([
      [
        {
          definitionPosition: 7,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 15,
                value: 'Person',
              },
              {
                validFrom: 32,
                value: 'Parish',
              },
              {
                validFrom: 49,
                value: 'Parsnip',
              },
            ],
          },
          references: [7, 24, 40, 57],
          types: ['Node'],
          variable: 'n',
        },
      ],
    ]);
  });

  test('Symbol table contains labels and rels from simple WHERE inside node/rel pattern', () => {
    const query = 'MATCH (n WHERE n:Person)-[r WHERE r:KNOWS] RETURN n';
    expect(
      getSymbolTablesForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([
      [
        {
          definitionPosition: 26,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 41,
                value: 'KNOWS',
              },
            ],
          },
          references: [26, 34],
          types: ['Relationship'],
          variable: 'r',
        },
        {
          definitionPosition: 7,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 23,
                value: 'Person',
              },
            ],
          },
          references: [7, 15],
          types: ['Node'],
          variable: 'n',
        },
      ],
    ]);
  });

  test('Symbol table contains labels and rels from mixed MATCH and WHERE', () => {
    const query =
      'MATCH (n:Person)-[r:KNOWS]->(p:Person) WHERE n:Driver RETURN n';
    expect(
      getSymbolTablesForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([
      [
        {
          definitionPosition: 18,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 25,
                value: 'KNOWS',
              },
            ],
          },
          references: [18],
          types: ['Relationship'],
          variable: 'r',
        },
        {
          definitionPosition: 7,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 15,
                value: 'Person',
              },
              {
                validFrom: 53,
                value: 'Driver',
              },
            ],
          },
          references: [45, 7, 61],
          types: ['Node'],
          variable: 'n',
        },
        {
          definitionPosition: 29,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 37,
                value: 'Person',
              },
            ],
          },
          references: [29],
          types: ['Node'],
          variable: 'p',
        },
      ],
    ]);
  });

  test('Symbol table contains labels and rels for unfinished rel chain', () => {
    const query = 'MATCH (t:Trainer)-[r:';
    expect(
      getSymbolTablesForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([
      [
        {
          definitionPosition: 7,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 16,
                value: 'Trainer',
              },
            ],
          },
          references: [7],
          types: ['Node'],
          variable: 't',
        },
        {
          definitionPosition: 19,
          labels: {
            andOr: 'and',
            children: [],
          },
          references: [19],
          types: ['Relationship'],
          variable: 'r',
        },
      ],
    ]);
  });

  test('Symbol table contains labels and rels for unfinished long rel chain', () => {
    const query = 'MATCH (n:Person)-[r:KNOWS]->()-[:MET]-';
    expect(
      getSymbolTablesForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([
      [
        {
          definitionPosition: 30,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 36,
                value: 'MET',
              },
            ],
          },
          references: [30],
          types: ['Relationship'],
          variable: '  UNNAMED0',
        },
        {
          definitionPosition: 18,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 25,
                value: 'KNOWS',
              },
            ],
          },
          references: [18],
          types: ['Relationship'],
          variable: 'r',
        },
        {
          definitionPosition: 7,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 15,
                value: 'Person',
              },
            ],
          },
          references: [7],
          types: ['Node'],
          variable: 'n',
        },
      ],
    ]);
  });

  test('Symbol table contains anonymous variables', () => {
    const query = 'MATCH (:Trainer)-[';
    expect(
      getSymbolTablesForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([
      [
        {
          definitionPosition: 6,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 15,
                value: 'Trainer',
              },
            ],
          },
          references: [6],
          types: ['Node'],
          variable: '  UNNAMED0',
        },
      ],
    ]);
  });

  test('Symbol table works with &-syntax', () => {
    const query = 'MATCH (:Trainer & Person)-[';
    expect(
      getSymbolTablesForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([
      [
        {
          definitionPosition: 6,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 15,
                value: 'Trainer',
              },
              {
                validFrom: 24,
                value: 'Person',
              },
            ],
          },
          references: [6],
          types: ['Node'],
          variable: '  UNNAMED0',
        },
      ],
    ]);
  });

  test('Symbol table works with |-syntax', () => {
    const query = 'MATCH (t:Trainer & Person)-[]-(t:Parsnip)';
    expect(
      getSymbolTablesForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([
      [
        {
          definitionPosition: 7,
          labels: {
            andOr: 'and',
            children: [
              {
                validFrom: 16,
                value: 'Trainer',
              },
              {
                validFrom: 25,
                value: 'Person',
              },
              {
                validFrom: 40,
                value: 'Parsnip',
              },
            ],
          },
          references: [31, 7],
          types: ['Node'],
          variable: 't',
        },
      ],
    ]);
  });
});
