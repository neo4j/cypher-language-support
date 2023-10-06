import { CompletionItemKind } from 'vscode-languageserver-types';
import {
  testCompletionContains,
  testCompletionDoesNotContain,
} from './completion-assertion-helpers';

describe('Preparser auto-completions', () => {
  test('Correctly completes EXPLAIN and PROFILE', () => {
    const query = 'E';

    testCompletionContains({
      query,
      expected: [
        { label: 'EXPLAIN', kind: CompletionItemKind.Keyword },
        { label: 'PROFILE', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly suggests normal completions after EXPLAIN', () => {
    const query = 'EXPLAIN M';

    testCompletionContains({
      query,
      expected: [{ label: 'MATCH', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly suggests normal completions after PROFILE', () => {
    const query = 'PROFILE M';

    testCompletionContains({
      query,
      expected: [{ label: 'MATCH', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly suggests EXPLAIN and PROFILE at the begining of a new statement', () => {
    const query = 'PROFILE MATCH (n) RETURN n; ';

    testCompletionContains({
      query,
      expected: [
        { label: 'EXPLAIN', kind: CompletionItemKind.Keyword },
        { label: 'PROFILE', kind: CompletionItemKind.Keyword },
      ],
    });
  });
});

describe('Auto completion of back to back keywords', () => {
  test('Correctly completes OPTIONAL MATCH', () => {
    const query = 'OP';

    testCompletionContains({
      query,
      expected: [{ label: 'OPTIONAL MATCH', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes DEFAULT DATABASE and HOME DATABASE', () => {
    const query = 'SHOW ';

    testCompletionContains({
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

    testCompletionContains({
      query,
      expected: [
        { label: 'UNION', kind: CompletionItemKind.Keyword },
        { label: 'UNION ALL', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly completes LOAD CSV', () => {
    const query = 'L';

    testCompletionContains({
      query,
      expected: [{ label: 'LOAD CSV', kind: CompletionItemKind.Keyword }],
    });

    testCompletionDoesNotContain({
      query,
      excluded: [
        { label: 'LOAD CSV WITH', kind: CompletionItemKind.Keyword },
        { label: 'LOAD CSV WITH HEADERS', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly completes WITH HEADERS in LOAD CSV', () => {
    const query = 'LOAD CSV ';

    testCompletionContains({
      query,
      expected: [{ label: 'WITH HEADERS', kind: CompletionItemKind.Keyword }],
    });

    testCompletionDoesNotContain({
      query,
      excluded: [
        { label: 'WITH HEADERS FROM', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly completes WITH HEADERS in LOAD CSV', () => {
    const query = 'LOAD CSV WITH ';

    testCompletionContains({
      query,
      expected: [{ label: 'HEADERS', kind: CompletionItemKind.Keyword }],
    });

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'HEADERS FROM', kind: CompletionItemKind.Keyword }],
    });
  });
});
