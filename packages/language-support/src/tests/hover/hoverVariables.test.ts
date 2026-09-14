import { CypherLanguageService } from '../../cypherLanguageService.js';
import { testData } from '../testData.js';

const dbSchema = testData.mockSchema;
const languageService = new CypherLanguageService();

describe('Variable hover', () => {
  test('provides hover info for LET variables', () => {
    const query = 'CYPHER 25 LET x = 50 RETURN x';
    const { symbolTables } = languageService.lint(query, dbSchema);
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'CYPHER 25 LET x = 50 RETURN '.length,
      dbSchema,
    });
    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`
x: Integer
\`

`,
      },
    });
  });

  test('provides hover info for MATCHed variables - definition-location', () => {
    const query = 'MATCH (n) RETURN n';
    const { symbolTables } = languageService.lint(query, dbSchema);
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'MATCH ('.length,
      dbSchema,
    });
    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`
n: Node
\`

`,
      },
    });
  });

  test('provides hover info for MATCHed variables - reference-location', () => {
    const query = 'MATCH (n) RETURN n';
    const { symbolTables } = languageService.lint(query, dbSchema);
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'MATCH (n) RETURN '.length,
      dbSchema,
    });
    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`
n: Node
\`

`,
      },
    });
  });

  test('provides hover info for labeled variables - definition-location', () => {
    const query = 'MATCH (n)-[r:KNOWS]->() RETURN n';
    const { symbolTables } = languageService.lint(query, dbSchema);
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'MATCH (n)-['.length,
      dbSchema,
    });
    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`
r: Relationship
\`

KNOWS`,
      },
    });
  });

  test('provides hover info for labeled variables - reference-location', () => {
    const query = 'MATCH (n)-[r:KNOWS]->() RETURN r';
    const { symbolTables } = languageService.lint(query, dbSchema);
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'MATCH (n)-[r:KNOWS]->() RETURN '.length,
      dbSchema,
    });
    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`
r: Relationship
\`

KNOWS`,
      },
    });
  });

  test('provides hover info for variables with more complex labels', () => {
    const query = 'MATCH (n:Person|Pet) WHERE n:Neighbour RETURN ';
    const { symbolTables } = languageService.lint(query, dbSchema);
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'MATCH (n:Person|Pet) WHERE '.length,
      dbSchema,
    });
    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`
n: Node
\`

((Person | Pet) & Neighbour)`,
      },
    });
  });
});
