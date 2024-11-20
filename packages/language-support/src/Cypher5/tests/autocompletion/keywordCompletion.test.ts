import { CompletionItemKind } from 'vscode-languageserver-types';
import { testCompletions } from './completionAssertionHelpers';

describe('Preparser auto-completions', () => {
  test('Correctly completes EXPLAIN and PROFILE', () => {
    const query = 'E';

    testCompletions({
      query,
      expected: [
        { label: 'EXPLAIN', kind: CompletionItemKind.Keyword },
        { label: 'PROFILE', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly suggests normal completions after EXPLAIN', () => {
    const query = 'EXPLAIN M';

    testCompletions({
      query,
      expected: [{ label: 'MATCH', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly suggests normal completions after PROFILE', () => {
    const query = 'PROFILE M';

    testCompletions({
      query,
      expected: [{ label: 'MATCH', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly suggests EXPLAIN and PROFILE at the begining of a new statement', () => {
    const query = 'PROFILE MATCH (n) RETURN n; ';

    testCompletions({
      query,
      expected: [
        { label: 'EXPLAIN', kind: CompletionItemKind.Keyword },
        { label: 'PROFILE', kind: CompletionItemKind.Keyword },
      ],
    });
  });
});

describe('Auto completion of back to back keywords', () => {
  test('Correctly completes DEFAULT DATABASE and HOME DATABASE', () => {
    const query = 'SHOW ';

    testCompletions({
      query,
      expected: [
        { label: 'DATABASE', kind: CompletionItemKind.Keyword },
        { label: 'DEFAULT DATABASE', kind: CompletionItemKind.Keyword },
        { label: 'HOME DATABASE', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly completes UNION and UNION ALL', () => {
    const query =
      'MATCH (a:Person)-[:KNOWS]->(b:Person) RETURN b.name AS name ';

    testCompletions({
      query,
      expected: [{ label: 'UNION', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes LOAD CSV', () => {
    const query = 'L';

    testCompletions({
      query,
      expected: [{ label: 'LOAD CSV', kind: CompletionItemKind.Keyword }],
      excluded: [
        { label: 'LOAD CSV WITH', kind: CompletionItemKind.Keyword },
        { label: 'LOAD CSV WITH HEADERS', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly completes WITH HEADERS in LOAD CSV', () => {
    const query = 'LOAD CSV ';

    testCompletions({
      query,
      expected: [{ label: 'WITH HEADERS', kind: CompletionItemKind.Keyword }],
      excluded: [
        { label: 'WITH HEADERS FROM', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly completes WITH HEADERS in LOAD CSV', () => {
    const query = 'LOAD CSV WITH ';

    testCompletions({
      query,
      expected: [{ label: 'HEADERS', kind: CompletionItemKind.Keyword }],
      excluded: [{ label: 'HEADERS FROM', kind: CompletionItemKind.Keyword }],
    });
  });
});
