import { CypherLanguageService } from '../../cypherLanguageService.js';
import { testData } from '../testData.js';

describe('Functions hover', () => {
  test('provides hover info for functions', () => {
    const query = 'CYPHER 25 RETURN abs(1,2)';

    const hoverInfo = new CypherLanguageService().hoverInfo(query, {
      caretPosition: query.indexOf('abs') + 1,
      dbSchema: testData.mockSchema,
    });

    expect(hoverInfo).toStrictEqual({
      signature: 'abs(input :: INTEGER | FLOAT) :: INTEGER | FLOAT',
      description: 'Returns the absolute value of an `INTEGER` or `FLOAT`.',
      returnDescription: 'INTEGER | FLOAT',
      isDeprecated: false,
      params: [
        {
          name: 'input',
          description:
            'A numeric value from which the absolute number will be returned.',
          isDeprecated: false,
          type: 'INTEGER | FLOAT',
        },
      ],
    });
  });

  test('provides hover info for incomplete function parameters', () => {
    const query = 'RETURN abs(';

    const hoverInfo = new CypherLanguageService().hoverInfo(query, {
      caretPosition: query.indexOf('abs') + 1,
      dbSchema: testData.mockSchema,
    });

    expect(hoverInfo).toStrictEqual({
      signature: 'abs(input :: INTEGER | FLOAT) :: INTEGER | FLOAT',
      description: 'Returns the absolute value of an `INTEGER` or `FLOAT`.',
      returnDescription: 'INTEGER | FLOAT',
      isDeprecated: false,
      params: [
        {
          name: 'input',
          description:
            'A numeric value from which the absolute number will be returned.',
          isDeprecated: false,
          type: 'INTEGER | FLOAT',
        },
      ],
    });
  });

  test('provides hover info for functions wrapping functions', () => {
    const query = 'MATCH (n) RETURN abs(count(n))';

    const hoverInfo = new CypherLanguageService().hoverInfo(query, {
      caretPosition: query.indexOf('abs') + 1,
      dbSchema: testData.mockSchema,
    });

    const innerHoverInfo = new CypherLanguageService().hoverInfo(query, {
      caretPosition: query.indexOf('count') + 1,
      dbSchema: testData.mockSchema,
    });

    expect(hoverInfo).toStrictEqual({
      signature: 'abs(input :: INTEGER | FLOAT) :: INTEGER | FLOAT',
      description: 'Returns the absolute value of an `INTEGER` or `FLOAT`.',
      returnDescription: 'INTEGER | FLOAT',
      isDeprecated: false,
      params: [
        {
          name: 'input',
          description:
            'A numeric value from which the absolute number will be returned.',
          isDeprecated: false,
          type: 'INTEGER | FLOAT',
        },
      ],
    });

    expect(innerHoverInfo).toStrictEqual({
      signature: 'count(input :: ANY) :: INTEGER',
      description: 'Returns the number of values or rows.',
      returnDescription: 'INTEGER',
      isDeprecated: false,
      params: [
        {
          name: 'input',
          description: 'A value to be aggregated.',
          isDeprecated: false,
          type: 'ANY',
        },
      ],
    });
  });
});
