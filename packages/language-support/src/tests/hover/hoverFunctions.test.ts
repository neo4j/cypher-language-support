import { DbSchema } from '../../dbSchema.js';
import { CypherLanguageService } from '../../cypherLanguageService.js';
import { testData } from '../testData.js';

describe('Functions hover', () => {
  test('provides hover info for functions', () => {
    const query = 'CYPHER 25 RETURN custom.subtract(1, 2), custom.add(1, 2)';
    const dbSchema: DbSchema = {
      functions: {
        'CYPHER 25': {
          'custom.add': {
            name: 'custom.add',
            category: '',
            description: 'Adds two numbers.',
            isBuiltIn: false,
            argumentDescription: [
              {
                name: 'left',
                description: 'The left number.',
                isDeprecated: false,
                type: 'INTEGER',
              },
            ],
            returnDescription: 'INTEGER',
            signature: 'custom.add(left :: INTEGER) :: INTEGER',
            aggregating: false,
            isDeprecated: false,
          },
          'custom.subtract': {
            name: 'custom.subtract',
            category: '',
            description: 'Subtracts two numbers.',
            isBuiltIn: false,
            argumentDescription: [],
            returnDescription: 'INTEGER',
            signature: 'custom.subtract(left :: INTEGER) :: INTEGER',
            aggregating: false,
            isDeprecated: false,
          },
        },
      },
    };

    const hoverInfo = new CypherLanguageService().hoverInfo(query, {
      caretPosition: query.indexOf('custom.add') + 1,
      dbSchema,
    });

    expect(hoverInfo).toStrictEqual({
      signature: 'custom.add(left :: INTEGER) :: INTEGER',
      description: 'Adds two numbers.',
      returnDescription: 'INTEGER',
      isDeprecated: false,
      params: [
        {
          name: 'left',
          description: 'The left number.',
          isDeprecated: false,
          type: 'INTEGER',
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
});
