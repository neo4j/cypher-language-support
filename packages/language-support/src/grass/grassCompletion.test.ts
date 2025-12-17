// Imports for when tests are enabled:
// import { CompletionItemKind } from 'vscode-languageserver-types';
// import { testCompletions } from '../tests/autocompletion/completionAssertionHelpers';

/**
 * Tests for grass DSL autocompletion.
 *
 * These tests verify that the completion infrastructure works correctly
 * for the grass DSL now that it's merged into the main CypherCmdParser.
 *
 * TODO: Once completions are fully wired up, remove .todo markers and
 * ensure all tests pass.
 */

const dbSchema = {
  labels: ['Person', 'Movie', 'Actor', 'Director'],
  relationshipTypes: ['ACTED_IN', 'DIRECTED', 'KNOWS', 'FOLLOWS'],
  propertyKeys: ['name', 'age', 'title', 'year', 'born'],
};

describe('Grass DSL Completions', () => {
  describe(':style command completions', () => {
    test.todo('completes :style command from colon');

    test.todo('completes RESET after :style');

    test.todo('completes MATCH after :style');
  });

  describe('label completions in grass patterns', () => {
    test.todo('completes labels inside node pattern');
    // Example: MATCH (n:| -> suggests Person, Movie, Actor, Director

    test.todo('completes labels with partial text');
    // Example: MATCH (n:Per| -> suggests Person
  });

  describe('relationship type completions in grass patterns', () => {
    test.todo('completes relationship types inside relationship pattern');
    // Example: MATCH [r:| -> suggests ACTED_IN, DIRECTED, KNOWS, FOLLOWS

    test.todo('completes relationship types with partial text');
    // Example: MATCH [r:ACT| -> suggests ACTED_IN
  });

  describe('keyword completions in grass', () => {
    test.todo('completes WHERE after pattern');
    // Example: MATCH (n:Person) | -> suggests WHERE, APPLY

    test.todo('completes APPLY after pattern');
    // Example: MATCH (n:Person) | -> suggests APPLY

    test.todo('completes APPLY after WHERE clause');
    // Example: MATCH (n:Person) WHERE n.age > 18 | -> suggests APPLY

    test.todo('completes boolean operators in WHERE');
    // Example: MATCH (n:Person) WHERE n.age > 18 | -> suggests AND, OR
  });

  describe('property completions in grass WHERE clause', () => {
    test.todo('completes property keys after variable dot');
    // Example: MATCH (n:Person) WHERE n.| -> suggests name, age, etc.

    test.todo('completes comparison operators after property');
    // Example: MATCH (n:Person) WHERE n.age | -> suggests =, <>, <, >, etc.
  });

  describe('style property completions', () => {
    test.todo('completes style properties inside APPLY block');
    // Example: MATCH (n:Person) APPLY {| -> suggests color, size, width, etc.

    test.todo('completes color after color:');
    // Example: APPLY {color: | -> suggests hex colors or string input

    test.todo('completes captionAlign values');
    // Example: APPLY {captionAlign: | -> suggests top, bottom, center

    test.todo('completes caption style functions');
    // Example: APPLY {captions: | -> suggests bold(), italic(), underline()
  });

  describe('standalone grass parsing completions', () => {
    // These test the styleSheet entry point used by parseGrass()

    test.todo('completes MATCH at start of grass file');
    // Example: | -> suggests MATCH

    test.todo('completes multiple rules');
    // Example: MATCH (n:Person) APPLY {color: '#ff0000'} | -> suggests MATCH
  });
});

/**
 * Placeholder tests that can be enabled once completion infrastructure is ready.
 * Uncomment and adjust as needed.
 */
/*
describe('Grass DSL Completions - Active Tests', () => {
  test('suggests labels in node pattern', () => {
    const query = ':style MATCH (n:';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'Person', kind: CompletionItemKind.TypeParameter },
        { label: 'Movie', kind: CompletionItemKind.TypeParameter },
        { label: 'Actor', kind: CompletionItemKind.TypeParameter },
        { label: 'Director', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('suggests relationship types in relationship pattern', () => {
    const query = ':style MATCH [r:';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'ACTED_IN', kind: CompletionItemKind.TypeParameter },
        { label: 'DIRECTED', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'FOLLOWS', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('suggests APPLY keyword after pattern', () => {
    const query = ':style MATCH (n:Person) ';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'APPLY', kind: CompletionItemKind.Keyword },
        { label: 'WHERE', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('suggests property keys in WHERE clause', () => {
    const query = ':style MATCH (n:Person) WHERE n.';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'age', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('suggests style properties inside APPLY', () => {
    const query = ':style MATCH (n:Person) APPLY {';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'color', kind: CompletionItemKind.Property },
        { label: 'size', kind: CompletionItemKind.Property },
        { label: 'width', kind: CompletionItemKind.Property },
        { label: 'captions', kind: CompletionItemKind.Property },
        { label: 'captionSize', kind: CompletionItemKind.Property },
        { label: 'captionAlign', kind: CompletionItemKind.Property },
      ],
    });
  });
});
*/

