import { CypherLanguageService } from '../../../cypherLanguageService/cypherLanguageService.js';

const languageService = new CypherLanguageService();

describe('go to variable definition', () => {
  function goToDefinitionExpect(
    query: string,
    caret: number,
    expectation: { startOffset: number; endOffset: number } | undefined,
  ): void {
    const { symbolTables } = languageService.lint(query, {});
    languageService.setSymbolsInfo({
      query,
      symbolTables: symbolTables,
    });

    const offset = languageService.goToDefinition(query, caret);

    expect(offset).toEqual(expectation);
  }

  test('Can find definition-location when requesting from the middle of a reference', () => {
    const query = 'MATCH (person) RETURN person';
    const caret = 'MATCH (person) RETURN per'.length;

    goToDefinitionExpect(query, caret, {
      startOffset: 'MATCH ('.length,
      endOffset: 'MATCH (person'.length,
    });
  });

  test('Can find definition-location when requesting from the end of a reference also with query continuing after', () => {
    const query = 'MATCH (person) RETURN person, 50';
    const caret = 'MATCH (person) RETURN person'.length;

    goToDefinitionExpect(query, caret, {
      startOffset: 'MATCH ('.length,
      endOffset: 'MATCH (person'.length,
    });
  });

  test('Can find definition-location when requesting from the end of a reference', () => {
    const query = 'MATCH (person) RETURN person';
    goToDefinitionExpect(query, query.length, {
      startOffset: 'MATCH ('.length,
      endOffset: 'MATCH (person'.length,
    });
  });

  test('Can find definition-location when requesting from the start of a reference', () => {
    const query = 'MATCH (person) RETURN person';
    const caret = 'MATCH (person) RETURN '.length;

    goToDefinitionExpect(query, caret, {
      startOffset: 'MATCH ('.length,
      endOffset: 'MATCH (person'.length,
    });
  });

  test('Handles scope (inner)', () => {
    const query = `MATCH (person)
CALL () {
  MATCH (person)
  RETURN person as x
} 
RETURN person`;
    const caret = `MATCH (person)
CALL () {
  MATCH (person)
  RETURN per`.length;

    goToDefinitionExpect(query, caret, {
      startOffset: `MATCH (person)
CALL () {
  MATCH (`.length,
      endOffset: `MATCH (person)
CALL () {
  MATCH (person`.length,
    });
  });

  test('Handles scope (outer)', () => {
    const query = `MATCH (person)
CALL () {
  MATCH (person)
  RETURN person as x
} 
RETURN person`;
    const caret = `MATCH (person)
CALL () {
  MATCH (person)
  RETURN person as x
} 
RETURN per`.length;

    goToDefinitionExpect(query, caret, {
      startOffset: `MATCH (`.length,
      endOffset: `MATCH (person`.length,
    });
  });

  test('Handles variables with properties', () => {
    const query = `MATCH (p:Person {age: 50}) RETURN p, p.age`;
    const caret = `MATCH (p:Person {age: 50}) RETURN p, p`.length;

    goToDefinitionExpect(query, caret, {
      startOffset: `MATCH (`.length,
      endOffset: `MATCH (p`.length,
    });
  });

  test('Handles rel variables', () => {
    const query = `MATCH ()-[knows]-() RETURN knows`;
    const caret = `MATCH ()-[knows]-() RETURN kn`.length;

    goToDefinitionExpect(query, caret, {
      startOffset: `MATCH ()-[`.length,
      endOffset: `MATCH ()-[knows`.length,
    });
  });

  test('Handles integer variables', () => {
    const query = `CYPHER 25 LET nbr = 50 RETURN nbr`;
    const caret = `CYPHER 25 LET nbr = 50 RETURN n`.length;

    goToDefinitionExpect(query, caret, {
      startOffset: `CYPHER 25 LET `.length,
      endOffset: `CYPHER 25 LET nbr`.length,
    });
  });

  test('Handles string variables', () => {
    const query = `CYPHER 25 LET name = "Pikachu" RETURN name`;
    const caret = `CYPHER 25 LET name = "Pikachu" RETURN na`.length;

    goToDefinitionExpect(query, caret, {
      startOffset: `CYPHER 25 LET `.length,
      endOffset: `CYPHER 25 LET name`.length,
    });
  });

  test('Does not break on anonymous variables', () => {
    const query = `MATCH (n)-[:KNOWS]-() RETURN n`;
    const caret = `MATCH (n)-[`.length;

    goToDefinitionExpect(query, caret, undefined);
  });

  test('Does nothing at definition position', () => {
    const query = `MATCH (person) RETURN person`;
    const caret = `MATCH (pe`.length;

    goToDefinitionExpect(query, caret, undefined);
  });

  test('Does not crash on missing symbol table', () => {
    const query = `MATCH (person) RETURN person`;

    const result = languageService.goToDefinition(query, `MATCH (pe`.length);
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

    const result = languageService.goToDefinition(
      formattedQuery,
      `MATCH (person)
RETURN pe`.length,
    );
    expect(result).toEqual(undefined);
  });

  test('Does nothing on comment', () => {
    const query = `//All nodes are persons
    MATCH (person) RETURN person`;
    const caret = `//All node`.length;

    goToDefinitionExpect(query, caret, undefined);
  });

  test('Does nothing on empty statement', () => {
    const query = `MATCH (n) RETURN n;
      ;
MATCH (m) RETURN m`;
    const caret = `MATCH (n) RETURN n;
   `.length;

    goToDefinitionExpect(query, caret, undefined);
  });
});
