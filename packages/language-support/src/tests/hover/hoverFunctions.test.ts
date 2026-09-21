import { CypherLanguageService } from '../../cypherLanguageService.js';
import { testData } from '../testData.js';

const dbSchema = testData.mockSchema;
const languageService = new CypherLanguageService();

describe('Function hover', () => {
  test('provides hover info for functions', () => {
    const query = 'CYPHER 25 RETURN abs(1,2)';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('abs') + 1,
      dbSchema,
    });

    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`\`\`cypher function
abs(input :: INTEGER | FLOAT) :: INTEGER | FLOAT
\`\`\`
Returns the absolute value of an \`INTEGER\` or \`FLOAT\`.

**Parameters**
- \`input\` - A numeric value from which the absolute number will be returned.

**Returns:** \`INTEGER | FLOAT\``,
      },
    });
  });

  test('provides hover info on the first and last character of the function name', () => {
    const query = 'CYPHER 25 RETURN abs(1,2)';
    const expected = {
      contents: {
        kind: 'markdown',
        value: `\`\`\`cypher function
abs(input :: INTEGER | FLOAT) :: INTEGER | FLOAT
\`\`\`
Returns the absolute value of an \`INTEGER\` or \`FLOAT\`.

**Parameters**
- \`input\` - A numeric value from which the absolute number will be returned.

**Returns:** \`INTEGER | FLOAT\``,
      },
    };

    expect(
      languageService.hoverInfo(query, {
        caretPosition: query.indexOf('abs'),
        dbSchema,
      }),
    ).toEqual(expected);

    expect(
      languageService.hoverInfo(query, {
        caretPosition: query.indexOf('abs') + 'abs'.length - 1,
        dbSchema,
      }),
    ).toEqual(expected);
  });

  test('provides hover info on the whole name of a namespaced function', () => {
    const query = 'CYPHER 5 RETURN apoc.create.uuid()';
    const expected = {
      contents: {
        kind: 'markdown',
        value: `\`\`\`cypher function
apoc.create.uuid() :: STRING
\`\`\`
(_deprecated_) Returns a UUID.


**Returns:** \`STRING\``,
      },
    };

    const name = 'apoc.create.uuid';
    [
      query.indexOf(name),
      query.indexOf(name) + name.length - 1,
      query.indexOf('create'),
    ].forEach((caretPosition) => {
      expect(
        languageService.hoverInfo(query, { caretPosition, dbSchema }),
      ).toEqual(expected);
    });
  });

  test('provides hover info for incomplete function parameters', () => {
    const query = 'RETURN abs(';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('abs') + 1,
      dbSchema,
    });

    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`\`\`cypher function
abs(input :: INTEGER | FLOAT) :: INTEGER | FLOAT
\`\`\`
Returns the absolute value of an \`INTEGER\` or \`FLOAT\`.

**Parameters**
- \`input\` - A numeric value from which the absolute number will be returned.

**Returns:** \`INTEGER | FLOAT\``,
      },
    });
  });

  test('provides hover info for functions wrapping functions', () => {
    const query = 'MATCH (n) RETURN abs(count(n))';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('abs') + 1,
      dbSchema,
    });

    const innerHoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('count') + 1,
      dbSchema,
    });

    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`\`\`cypher function
abs(input :: INTEGER | FLOAT) :: INTEGER | FLOAT
\`\`\`
Returns the absolute value of an \`INTEGER\` or \`FLOAT\`.

**Parameters**
- \`input\` - A numeric value from which the absolute number will be returned.

**Returns:** \`INTEGER | FLOAT\``,
      },
    });

    expect(innerHoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`\`\`cypher function
count(input :: ANY) :: INTEGER
\`\`\`
Returns the number of values or rows.

**Parameters**
- \`input\` - A value to be aggregated.

**Returns:** \`INTEGER\``,
      },
    });
  });

  test('provides hover info for grammar-defined function "normalize"', () => {
    const query = 'CYPHER 25 RETURN normalize(" my string", NFC), abs(-1)';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('normalize') + 1,
      dbSchema,
    });

    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`\`\`cypher function
normalize(input :: STRING, normalForm = NFC :: [NFC, NFD, NFKC, NFKD]) :: STRING
\`\`\`
Normalize a \`STRING\`. The \`STRING\` will be normalized according to the specified normalization form.

**Parameters**
- \`input\` - A value to be normalized.
- \`normalForm\` - A keyword specifying any of the normal forms; NFC, NFD, NFKC or NFKD.

**Returns:** \`STRING\``,
      },
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
      contents: {
        kind: 'markdown',
        value: `\`\`\`cypher function
trim([[LEADING | TRAILING | BOTH] [trimCharacterString :: STRING] FROM] input :: STRING) :: STRING
\`\`\`
Returns the given \`STRING\` with leading and/or trailing \`trimCharacterString\` removed.

**Parameters**
- \`trimSpecification\` - The parts of the string to trim; LEADING, TRAILING, BOTH
- \`trimCharacterString\` - The characters to be removed from the start and/or end of the given string.
- \`input\` - A value from which all leading and/or trailing trim characters will be removed.

**Returns:** \`STRING\``,
      },
    });
  });

  test('marks deprecated functions as deprecated', () => {
    const query = 'CYPHER 5 RETURN apoc.create.uuid()';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('apoc.create.uuid') + 1,
      dbSchema,
    });

    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`\`\`cypher function
apoc.create.uuid() :: STRING
\`\`\`
(_deprecated_) Returns a UUID.


**Returns:** \`STRING\``,
      },
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
