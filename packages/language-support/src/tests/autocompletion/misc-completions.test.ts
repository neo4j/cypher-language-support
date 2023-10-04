import { CompletionItemKind } from 'vscode-languageserver-types';
import {
  testCompletionContains,
  testCompletionDoesNotContain,
} from './completion-assertion-helpers';

describe('Misc auto-completion', () => {
  test('Correctly completes empty statement', () => {
    const query = '';

    testCompletionContains({
      query,
      expected: [
        { label: 'MATCH', kind: CompletionItemKind.Keyword },
        { label: 'CREATE', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly completes RETURN', () => {
    const query = 'RET';

    testCompletionContains({
      query,
      expected: [{ label: 'RETURN', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes DISTINCT', () => {
    const query = 'MATCH (n:Person)-[r:KNOWS]-(m:Person) RETURN ';

    testCompletionContains({
      query,
      expected: [{ label: 'DISTINCT', kind: CompletionItemKind.Keyword }],
    });

    testCompletionDoesNotContain({
      query,
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

    testCompletionContains({
      query,
      expected: [{ label: 'MATCH', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes statement when the first one has some syntactic error', () => {
    const query = `MATCH (n: Person W);
                   C`;

    testCompletionContains({
      query,
      expected: [{ label: 'CREATE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes longer statement when the first one has some syntactic error', () => {
    const query = `MATCH (n) REUTRN n;
                   MATCH (n) W`;

    testCompletionContains({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes last statement when having three broken statements', () => {
    const query = `MATCH (n) REUTRN n;
                   MATCH (n) REUTRN n;
                   MATCH (n) W`;

    testCompletionContains({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes next statement when there is no initiating keyword', () => {
    const query = `MATCH (n) RETURN n;`;

    testCompletionContains({
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

    testCompletionContains({
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

    testCompletionContains({
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

    testCompletionContains({
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

    testCompletionContains({
      query,
      expected: [{ label: 'LIMIT', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Inserts correct text for SKIP', () => {
    const query = 'RETURN 1 S';

    testCompletionContains({
      query,
      expected: [{ label: 'SKIP', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Inserts correct text for shortestPath', () => {
    const query = 'MATCH s';

    testCompletionContains({
      query,
      expected: [{ label: 'shortestPath', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Inserts correct text for allShortestPath', () => {
    const query = 'MATCH a';

    testCompletionContains({
      query,
      expected: [
        { label: 'allShortestPaths', kind: CompletionItemKind.Keyword },
      ],
    });
  });
});
