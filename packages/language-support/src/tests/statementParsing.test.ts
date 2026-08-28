import {
  createParsingResult,
  parseStatementsStrs,
} from '../cypherLanguageService.js';

function parseCypherStatements(query: string): string[] {
  const result = createParsingResult(query, { consoleCommandsEnabled: true });
  expect(
    result.statementsParsing.flatMap((statement) => statement.syntaxErrors),
  ).toEqual([]);

  return result.statementsParsing.map(({ command }) => {
    expect(command.type).toBe('cypher');
    if (command.type !== 'cypher') {
      throw new Error(`Expected a Cypher statement, got ${command.type}`);
    }
    return command.statement;
  });
}

describe('statement parsing', () => {
  test('excludes trailing hidden-channel tokens from a statement', () => {
    expect(parseCypherStatements('RETURN 1 // trailing comment')).toEqual([
      'RETURN 1',
    ]);
  });

  test('can split cypher into statements', () => {
    expect(
      parseCypherStatements('CALL db.info(); RETURN 123; SHOW DATABASES'),
    ).toEqual(['CALL db.info()', 'RETURN 123', 'SHOW DATABASES']);
  });

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
