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
          key: 'n',
          references: [7, 17],
          startOffset: 7,
          types: ['Node'],
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
          key: 'm',
          references: [17],
          startOffset: 17,
          types: ['Any'],
        },
        {
          key: 'n',
          references: [7],
          startOffset: 7,
          types: ['Node'],
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
          key: 'm',
          references: [17],
          startOffset: 17,
          types: ['Any'],
        },
        {
          key: 'n',
          references: [7],
          startOffset: 7,
          types: ['Node'],
        },
      ],
      [
        {
          key: 'm',
          references: [27, 37],
          startOffset: 27,
          types: ['Node'],
        },
      ],
    ]);
  });
});
