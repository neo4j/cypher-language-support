import { parseStatementsStrs } from '../cypherLanguageService.js';

describe('statement parsing', () => {
  test('can split statement strings without parsing them', () => {
    expect(parseStatementsStrs("RETURN ';'; // comment\n RETURN 2;  ")).toEqual(
      ["RETURN ';';", ' // comment\n RETURN 2;'],
    );
    expect(parseStatementsStrs('MATCH (n; RETURN 1')).toEqual([
      'MATCH (n;',
      ' RETURN 1',
    ]);
  });
});
