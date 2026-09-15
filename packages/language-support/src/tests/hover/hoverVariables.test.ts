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
\``,
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
\``,
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
\``,
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

\`\`\`cypher
KNOWS
\`\`\``,
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

\`\`\`cypher
KNOWS
\`\`\``,
      },
    });
  });

  test('provides hover info for variables inside a function call', () => {
    const query = 'MATCH (n) RETURN abs(n.age)';
    const { symbolTables } = languageService.lint(query, dbSchema);
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'MATCH (n) RETURN abs('.length,
      dbSchema,
    });
    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`
n: Node
\``,
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

\`\`\`cypher
((Person | Pet) & Neighbour)
\`\`\``,
      },
    });
  });

  test('Handles scope for shadowing variables', () => {
    const query =
      'MATCH (n:Person) CALL() {MATCH (n:Cat) RETURN n as x} RETURN x';
    const { symbolTables } = languageService.lint(query, dbSchema);
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });
    const outerHover = languageService.hoverInfo(query, {
      caretPosition: 'MATCH ('.length,
      dbSchema,
    });
    expect(outerHover).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`
n: Node
\`

\`\`\`cypher
Person
\`\`\``,
      },
    });
    const innerHover = languageService.hoverInfo(query, {
      caretPosition: 'MATCH (n:Person) CALL() {MATCH (n:Cat) RETURN '.length,
      dbSchema,
    });
    expect(innerHover).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`
n: Node
\`

\`\`\`cypher
Cat
\`\`\``,
      },
    });
  });

  test('Does not provide hover info for properties', () => {
    const query = 'MATCH (n:Person) RETURN n.age';
    const { symbolTables } = languageService.lint(query, dbSchema);
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });
    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'MATCH (n:Person) RETURN n'.length,
      dbSchema,
    });
    expect(hoverInfo).toEqual(undefined);
  });

  test('Does not provide hover info for anonymous variable', () => {
    const query = 'MATCH (n:Person & Neighbour) RETURN n';
    const { symbolTables } = languageService.lint(query, dbSchema);
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });
    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: 'MATCH ('.length,
      dbSchema,
    });
    expect(hoverInfo).toEqual(undefined);
  });
});
