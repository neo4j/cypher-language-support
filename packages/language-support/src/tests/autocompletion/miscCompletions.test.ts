import { CompletionItemKind } from 'vscode-languageserver-types';
import {
  testCompletions,
  testCompletionsExactly,
} from './completionAssertionHelpers';

describe('Misc auto-completion', () => {
  test('Correctly completes cypher version number', () => {
    const query = 'CYPHER ';

    testCompletions({
      query,
      expected: [{ label: '5', kind: CompletionItemKind.EnumMember }],
    });
  });

  test('Correctly completes CYPHER when keyword is not finished, optionally with version', () => {
    const query = 'CYP';

    testCompletions({
      query,
      expected: [
        { label: 'CYPHER 5', kind: CompletionItemKind.Keyword },
        { label: 'CYPHER', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly completes empty statement', () => {
    const query = '';

    testCompletions({
      query,
      expected: [
        { label: 'MATCH', kind: CompletionItemKind.Keyword },
        { label: 'CREATE', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly completes RETURN', () => {
    const query = 'RET';

    testCompletions({
      query,
      expected: [{ label: 'RETURN', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Requires space to complete next keyword', () => {
    const query = 'SHOW';

    testCompletions({
      query,
      expected: [{ label: 'SHOW', kind: CompletionItemKind.Keyword }],
      excluded: [{ label: 'DATABASE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Completes keyword, even when current word is also valid keyword', () => {
    const query = 'SHOW DATA';

    testCompletions({
      query,
      expected: [{ label: 'DATABASE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes DISTINCT', () => {
    const query = 'MATCH (n:Person)-[r:KNOWS]-(m:Person) RETURN ';

    testCompletions({
      query,
      expected: [{ label: 'DISTINCT', kind: CompletionItemKind.Keyword }],
      excluded: [
        { label: 'STRING_LITERAL1', kind: CompletionItemKind.Keyword },
        { label: 'STRING_LITERAL2', kind: CompletionItemKind.Keyword },
        { label: 'INF SET', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly completes MATCH in multiline statement', () => {
    const query = `CALL dbms.info() YIELD *;
                   M`;

    testCompletions({
      query,
      expected: [{ label: 'MATCH', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes statement when the first one has some syntactic error', () => {
    const query = `MATCH (n: Person W);
                   C`;

    testCompletions({
      query,
      expected: [{ label: 'CREATE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes longer statement when the first one has some syntactic error', () => {
    const query = `MATCH (n) REUTRN n;
                   MATCH (n) W`;

    testCompletions({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes last statement when having three broken statements', () => {
    const query = `MATCH (n) REUTRN n;
                   MATCH (n) REUTRN n;
                   MATCH (n) W`;

    testCompletions({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes next statement when there is no initiating keyword', () => {
    const query = `MATCH (n) RETURN n;`;

    testCompletions({
      query,
      expected: [
        { label: 'MATCH', kind: CompletionItemKind.Keyword },
        { label: 'CREATE', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly completes label in a second statement after a broken one', () => {
    const query = `MATCH (n) REUTRN n;
                   MATCH (n:P`;

    testCompletions({
      query,
      dbSchema: { labels: ['Person', 'Dog'] },
      expected: [
        { label: 'Person', kind: CompletionItemKind.TypeParameter },
        { label: 'Dog', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Correctly completes label with empty prompt in a second statement after a broken one', () => {
    const query = `MATCH (n) REUTRN n;
                   MATCH (n:`;

    testCompletions({
      query,
      dbSchema: { labels: ['A', 'B'] },
      expected: [
        { label: 'A', kind: CompletionItemKind.TypeParameter },
        { label: 'B', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Correctly completes barred label in a second statement after a broken one', () => {
    const query = `MATCH (n) REUTRN n;
                   MATCH (n:A|`;

    testCompletions({
      query,
      dbSchema: { labels: ['A', 'B'] },
      expected: [
        { label: 'A', kind: CompletionItemKind.TypeParameter },
        { label: 'B', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });
});

describe('Inserts correct text when symbolic name is not display name', () => {
  test('Inserts correct text for LIMIT', () => {
    const query = 'RETURN 1 L';

    testCompletions({
      query,
      expected: [{ label: 'LIMIT', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Inserts correct text for SKIP', () => {
    const query = 'RETURN 1 S';

    testCompletions({
      query,
      expected: [{ label: 'SKIP', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Inserts correct text for shortestPath', () => {
    const query = 'MATCH s';

    testCompletions({
      query,
      expected: [{ label: 'shortestPath', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Inserts correct text for allShortestPath', () => {
    const query = 'MATCH a';

    testCompletions({
      query,
      expected: [
        { label: 'allShortestPaths', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test("doesn't give invalid/undefined completion after CREATE INDEX", () => {
    // CREATE INDEX uses symbolic name but has no valid completions
    // there was a bug that allowed this situation to lead to an invalid completion
    // hence this test
    testCompletionsExactly({
      query: 'CREATE INDEX ',
      expected: [
        { kind: 14, label: 'IF NOT EXISTS' },
        { kind: 14, label: 'FOR' },
        { kind: 14, label: 'ON' },
      ],
    });
  });
});
