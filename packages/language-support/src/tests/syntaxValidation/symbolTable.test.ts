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
          references: [17],
          types: ['Any'],
          variable: 'm',
        },
        {
          definitionPosition: 7,
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
          references: [17],
          types: ['Any'],
          variable: 'm',
        },
        {
          definitionPosition: 7,
          references: [7],
          types: ['Node'],
          variable: 'n',
        },
      ],
      [
        {
          definitionPosition: 27,
          references: [27, 37],
          types: ['Node'],
          variable: 'm',
        },
      ],
    ]);
  });
});
