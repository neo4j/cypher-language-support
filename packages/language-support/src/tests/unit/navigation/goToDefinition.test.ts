import { CypherLanguageService } from '../../../cypherLanguageService.js';

const languageService = new CypherLanguageService();

describe('go to variable definition', () => {
  test('Can find definition-location when requesting from the middle of a reference', () => {
    const query = 'MATCH (person) RETURN person';
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const { startOffset, endOffset } = languageService.findDefinitionPosition(
      query,
      'MATCH (person) RETURN per'.length,
    );
    expect(startOffset).toEqual('MATCH ('.length);
    expect(endOffset).toEqual('MATCH (person'.length);
  });

  test('Can find definition-location when requesting from the end of a reference - not end of query example', () => {
    const query = 'MATCH (person) RETURN person, 50';
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const { startOffset, endOffset } = languageService.findDefinitionPosition(
      query,
      'MATCH (person) RETURN person'.length,
    );
    expect(startOffset).toEqual('MATCH ('.length);
    expect(endOffset).toEqual('MATCH (person'.length);
  });

  test('Can find definition-location when requesting from the end of a reference', () => {
    const query = 'MATCH (person) RETURN person';
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const { startOffset, endOffset } = languageService.findDefinitionPosition(
      query,
      query.length,
    );
    expect(startOffset).toEqual('MATCH ('.length);
    expect(endOffset).toEqual('MATCH (person'.length);
  });

  test('Can find definition-location when requesting from the start of a reference', () => {
    const query = 'MATCH (person) RETURN person';
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const { startOffset, endOffset } = languageService.findDefinitionPosition(
      query,
      'MATCH (person) RETURN '.length,
    );
    expect(startOffset).toEqual('MATCH ('.length);
    expect(endOffset).toEqual('MATCH (person'.length);
  });

  test('Handles scope (inner)', () => {
    const query = `MATCH (person)
CALL () {
  MATCH (person)
  RETURN person as x
} 
RETURN person`;
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const { startOffset, endOffset } = languageService.findDefinitionPosition(
      query,
      `MATCH (person)
CALL () {
  MATCH (person)
  RETURN per`.length,
    );
    expect(startOffset).toEqual(
      `MATCH (person)
CALL () {
  MATCH (`.length,
    );
    expect(endOffset).toEqual(
      `MATCH (person)
CALL () {
  MATCH (person`.length,
    );
  });

  test('Handles scope (outer)', () => {
    const query = `MATCH (person)
CALL () {
  MATCH (person)
  RETURN person as x
} 
RETURN person`;
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const { startOffset, endOffset } = languageService.findDefinitionPosition(
      query,
      `MATCH (person)
CALL () {
  MATCH (person)
  RETURN person as x
} 
RETURN per`.length,
    );
    expect(startOffset).toEqual(`MATCH (`.length);
    expect(endOffset).toEqual(`MATCH (person`.length);
  });

  test('Handles variables with properties', () => {
    const query = `MATCH (p:Person {age: 50}) RETURN p, p.age`;
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const { startOffset, endOffset } = languageService.findDefinitionPosition(
      query,
      `MATCH (p:Person {age: 50}) RETURN p, p`.length,
    );
    expect(startOffset).toEqual(`MATCH (`.length);
    expect(endOffset).toEqual(`MATCH (p`.length);
  });

  test('Handles rel variables', () => {
    const query = `MATCH ()-[knows]-() RETURN knows`;
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const { startOffset, endOffset } = languageService.findDefinitionPosition(
      query,
      `MATCH ()-[knows]-() RETURN kn`.length,
    );
    expect(startOffset).toEqual(`MATCH ()-[`.length);
    expect(endOffset).toEqual(`MATCH ()-[knows`.length);
  });

  test('Handles integer variables', () => {
    const query = `CYPHER 25 LET nbr = 50 RETURN nbr`;
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const { startOffset, endOffset } = languageService.findDefinitionPosition(
      query,
      `CYPHER 25 LET nbr = 50 RETURN n`.length,
    );
    expect(startOffset).toEqual(`CYPHER 25 LET `.length);
    expect(endOffset).toEqual(`CYPHER 25 LET nbr`.length);
  });

  test('Handles string variables', () => {
    const query = `CYPHER 25 LET name = "Pikachu" RETURN name`;
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const { startOffset, endOffset } = languageService.findDefinitionPosition(
      query,
      `CYPHER 25 LET name = "Pikachu" RETURN na`.length,
    );
    expect(startOffset).toEqual(`CYPHER 25 LET `.length);
    expect(endOffset).toEqual(`CYPHER 25 LET name`.length);
  });

  test('Does not break on anonymous variables', () => {
    const query = `MATCH (n)-[:KNOWS]-() RETURN n`;
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const result = languageService.findDefinitionPosition(
      query,
      `MATCH (n)-[`.length,
    );
    expect(result).toEqual(undefined);
  });

  test('Does nothing at definition position', () => {
    const query = `MATCH (person) RETURN person`;
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const result = languageService.findDefinitionPosition(
      query,
      `MATCH (pe`.length,
    );
    expect(result).toEqual(undefined);
  });

  test('Does not crash on missing symbol table', () => {
    const query = `MATCH (person) RETURN person`;

    const result = languageService.findDefinitionPosition(
      query,
      `MATCH (pe`.length,
    );
    expect(result).toEqual(undefined);
  });

  test('Does not provide go to definition if symbol table is out of sync', () => {
    const query = `MATCH (person) RETURN person`;
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const formattedQuery = `MATCH (person)
RETURN person`;

    const result = languageService.findDefinitionPosition(
      formattedQuery,
      `MATCH (person)
RETURN pe`.length,
    );
    expect(result).toEqual(undefined);
  });

  test('Does not throw on comment', () => {
    const query = `//All nodes are persons
    MATCH (person) RETURN person`;
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const result = languageService.findDefinitionPosition(
      query,
      `//All node`.length,
    );
    expect(result).toEqual(undefined);
  });

  test('Does not throw on empty statement', () => {
    const query = `MATCH (n) RETURN n;
      ;
MATCH (m) RETURN m`;
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const result = languageService.findDefinitionPosition(
      query,
      `MATCH (n) RETURN n;
   `.length,
    );
    expect(result).toEqual(undefined);
  });
});
