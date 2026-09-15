import { CypherLanguageService } from '../../cypherLanguageService.js';
import { testData } from '../testData.js';

const dbSchema = testData.mockSchema;
const languageService = new CypherLanguageService();

describe('Variable hover', () => {
  test('Hover info on blank space passes without error', () => {
    const query = 'CYPHER 25 LET    x = 50 RETURN x';
    const { symbolTables } = languageService.lint(query, dbSchema);
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'CYPHER 25 LET '.length,
      dbSchema,
    });
    expect(hoverInfo).toEqual(undefined);
  });

  test('Hover info on blank space passes without error - no symbolsInfo', () => {
    const query = 'CYPHER 25 LET    x = 50 RETURN x';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'CYPHER 25 LET '.length,
      dbSchema,
    });
    expect(hoverInfo).toEqual(undefined);
  });

  test('Hover info on blank space passes without error - blank dbSchema', () => {
    const query = 'CYPHER 25 LET    x = 50 RETURN x';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'CYPHER 25 LET '.length,
      dbSchema: {},
    });
    expect(hoverInfo).toEqual(undefined);
  });

  test('Hover info on blank space passes without error - undefined dbSchema', () => {
    const query = 'CYPHER 25 LET    x = 50 RETURN x';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'CYPHER 25 LET '.length,
      dbSchema: undefined,
    });
    expect(hoverInfo).toEqual(undefined);
  });

  test('Hover info on blank space passes without error - undefined dbSchema', () => {
    const query = 'CYPHER 25 LET    x = 50 RETURN x';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'CYPHER 25 LET '.length,
      dbSchema: undefined,
    });
    expect(hoverInfo).toEqual(undefined);
  });

  test('Does not provide hover info on blank space inside a function', () => {
    const query = 'CYPHER 25 RETURN abs(    1,2)';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'CYPHER 25 RETURN abs( '.length,
      dbSchema,
    });

    expect(hoverInfo).toEqual(undefined);
  });

  test('Does not provide hover info on the parentheses of a function', () => {
    const query = 'CYPHER 25 RETURN abs   (1, 2)';
    const { symbolTables } = languageService.lint(query, dbSchema);
    languageService.setSymbolsInfo({ query, symbolTables });

    const positions = [
      query.indexOf('abs') + 3, // the blank space right after the name
      query.indexOf('('),
      query.indexOf('1'),
      query.indexOf(','),
      query.indexOf(')'),
    ];

    positions.forEach((caretPosition) => {
      expect(
        languageService.hoverInfo(query, { caretPosition, dbSchema }),
      ).toEqual(undefined);
    });
  });

  test('Does not provide hover info inside the arguments of a procedure', () => {
    const query = 'CALL db.awaitIndex("MyIndex", 300)';
    const { symbolTables } = languageService.lint(query, dbSchema);
    languageService.setSymbolsInfo({ query, symbolTables });

    const positions = [query.indexOf('"MyIndex"'), query.indexOf('300')];

    positions.forEach((caretPosition) => {
      expect(
        languageService.hoverInfo(query, { caretPosition, dbSchema }),
      ).toEqual(undefined);
    });
  });
});
