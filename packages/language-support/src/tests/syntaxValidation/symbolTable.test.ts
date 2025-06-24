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
          endOffset: 8,
          key: 'n',
          references: [
            {
              endOffset: 8,
              startOffset: 7,
            },
            {
              endOffset: 18,
              startOffset: 17,
            },
          ],
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
          endOffset: 18,
          key: 'm',
          references: [
            {
              endOffset: 18,
              startOffset: 17,
            },
          ],
          startOffset: 17,
          types: ['Any'],
        },
        {
          endOffset: 8,
          key: 'n',
          references: [
            {
              endOffset: 8,
              startOffset: 7,
            },
          ],
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
          endOffset: 18,
          key: 'm',
          references: [
            {
              endOffset: 18,
              startOffset: 17,
            },
          ],
          startOffset: 17,
          types: ['Any'],
        },
        {
          endOffset: 8,
          key: 'n',
          references: [
            {
              endOffset: 8,
              startOffset: 7,
            },
          ],
          startOffset: 7,
          types: ['Node'],
        },
      ],
      [
        {
          endOffset: 28,
          key: 'm',
          references: [
            {
              endOffset: 28,
              startOffset: 27,
            },
            {
              endOffset: 38,
              startOffset: 37,
            },
          ],
          startOffset: 27,
          types: ['Node'],
        },
      ],
    ]);
  });
});
