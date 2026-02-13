import { CompletionItemKind } from 'vscode-languageserver-types';
import { testCompletions } from './completionAssertionHelpers';

describe('snippet completions', () => {
  test('does not suggest paths when trigger character used in other contexts', () => {
    testCompletions({
      query: 'RETURN (1)',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });

    testCompletions({
      query: 'RETURN abs(1)',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });

    testCompletions({
      query: 'CALL dbms.clientConfig()',
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
  });

  test('typing snippet trigger character should not open completions automatically in non-snippet context', () => {
    testCompletions({
      query: 'MATCH (p:Person) RETURN p.name, [p.age, p.height, p.weight]',
      assertEmpty: true,
    });

    testCompletions({
      query:
        'MATCH (p:Person)-[:FRIEND_OF]->(f) RETURN p.name, [x IN collect(f.name) WHERE x STARTS WITH "A"]',
      assertEmpty: true,
    });

    testCompletions({
      query: 'CREATE FULLTEXT INDEX bla FOR ()-[n:KNOWS]',
      assertEmpty: true,
    });
  });

  test('typing snippet trigger character should not open completions automatically in expression...', () => {
    testCompletions({
      query: 'RETURN (1)',
      assertEmpty: true,
    });

    testCompletions({
      query: 'RETURN abs(1)',
      assertEmpty: true,
    });

    testCompletions({
      query: 'RETURN ["A", "B"]',
      assertEmpty: true,
    });
  });

  test('...but manually triggering completions after -/< should still work', () => {
    testCompletions({
      query: 'RETURN (1)',
      manualTrigger: true,
      expected: [
        { kind: CompletionItemKind.Keyword, label: 'AND' },
        { kind: CompletionItemKind.Keyword, label: 'OR' },
      ],
    });

    testCompletions({
      query: 'RETURN abs(1)',
      manualTrigger: true,
      expected: [
        { kind: CompletionItemKind.Keyword, label: 'AND' },
        { kind: CompletionItemKind.Keyword, label: 'OR' },
      ],
    });
  });
});
