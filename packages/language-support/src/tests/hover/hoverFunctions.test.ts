import { CypherLanguageService } from '../../cypherLanguageService.js';
import { testData } from '../testData.js';

const dbSchema = testData.mockSchema;
const languageService = new CypherLanguageService();

describe('Functions hover', () => {
  test('provides hover info for functions', () => {
    const query = 'CYPHER 25 RETURN abs(1,2)';

    const hoverInfo = new CypherLanguageService().hoverInfo(query, {
      caretPosition: query.indexOf('abs') + 1,
      dbSchema,
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
      dbSchema,
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
      dbSchema,
    });

    const innerHoverInfo = new CypherLanguageService().hoverInfo(query, {
      caretPosition: query.indexOf('count') + 1,
      dbSchema,
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

  test('provides hover info for grammar-defined function "normalize"', () => {
    const query = 'CYPHER 25 RETURN normalize(" my string", NFC), abs(-1)';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('normalize') + 1,
      dbSchema,
    });

    expect(hoverInfo).toEqual({
      description:
        'Normalize a `STRING`. The `STRING` will be normalized according to the specified normalization form.',
      isDeprecated: false,
      params: [
        {
          description: 'A value to be normalized.',
          isDeprecated: false,
          name: 'input',
          type: 'STRING',
        },
        {
          description:
            'A keyword specifying any of the normal forms; NFC, NFD, NFKC or NFKD.',
          isDeprecated: false,
          name: 'normalForm',
          type: '[NFC, NFD, NFKC, NFKD]',
        },
      ],
      returnDescription: 'STRING',
      signature:
        'normalize(input :: STRING, normalForm = NFC :: [NFC, NFD, NFKC, NFKD]) :: STRING',
    });
  });

  test('provides hover info for grammar-defined function "trim", with "no-comma" syntax', () => {
    const query =
      'CYPHER 5 RETURN "======", trim( LEADING "a" FROM "aaaaaaString with leading a"), "========="';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('trim') + 1,
      dbSchema,
    });

    expect(hoverInfo).toEqual({
      description:
        'Returns the given `STRING` with leading and/or trailing `trimCharacterString` removed.',
      isDeprecated: false,
      params: [
        {
          description:
            'The parts of the string to trim; LEADING, TRAILING, BOTH',
          isDeprecated: false,
          name: 'trimSpecification',
          type: '[LEADING, TRAILING, BOTH]',
        },
        {
          description:
            'The characters to be removed from the start and/or end of the given string.',
          isDeprecated: false,
          name: 'trimCharacterString',
          type: 'STRING',
        },
        {
          description:
            'A value from which all leading and/or trailing trim characters will be removed.',
          isDeprecated: false,
          name: 'input',
          type: 'STRING',
        },
      ],
      returnDescription: 'STRING',
      signature:
        'trim([[LEADING | TRAILING | BOTH] [trimCharacterString :: STRING] FROM] input :: STRING) :: STRING',
    });
  });

  test('marks deprecated functions as deprecated', () => {
    const query = 'CYPHER 5 RETURN apoc.create.uuid()';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('apoc.create.uuid') + 1,
      dbSchema,
    });

    expect(hoverInfo).toStrictEqual({
      signature: 'apoc.create.uuid() :: STRING',
      description: 'Returns a UUID.',
      returnDescription: 'STRING',
      isDeprecated: true,
      params: [],
    });
  });

  test('provides no hover info for a function missing in the Cypher version', () => {
    // apoc.create.uuid only exists in Cypher 5
    const query = 'CYPHER 25 RETURN apoc.create.uuid()';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('apoc.create.uuid') + 1,
      dbSchema,
    });

    expect(hoverInfo).toBeUndefined();
  });

  test('provides no hover info for unknown functions', () => {
    const query = 'RETURN notARealFunction(1)';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('notARealFunction') + 1,
      dbSchema,
    });

    expect(hoverInfo).toBeUndefined();
  });
});
