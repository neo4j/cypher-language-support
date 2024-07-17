import { CompletionItemKind } from 'vscode-languageserver-types';
import { testCompletions } from './completionAssertionHelpers';

describe('MATCH auto-completion', () => {
  test('Correctly completes MATCH', () => {
    const query = 'M';

    testCompletions({
      query,
      expected: [{ label: 'MATCH', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes OPTIONAL MATCH', () => {
    const query = 'OP';

    testCompletions({
      query,
      expected: [{ label: 'OPTIONAL MATCH', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes MATCH in OPTIONAL MATCH', () => {
    const query = 'OPTIONAL M';

    testCompletions({
      query,
      expected: [{ label: 'MATCH', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes label in MATCH', () => {
    const query = 'MATCH (n:P';

    testCompletions({
      query,
      dbSchema: { labels: ['Cat', 'Person', 'Dog'] },
      expected: [{ label: 'Person', kind: CompletionItemKind.TypeParameter }],
    });
  });

  test("Doesn't complete label before : is entered", () => {
    const query = 'MATCH (n';

    testCompletions({
      query,
      dbSchema: { labels: ['Cat', 'Person', 'Dog'] },
      excluded: [
        { label: 'Person', kind: CompletionItemKind.TypeParameter },
        { label: 'Cat', kind: CompletionItemKind.TypeParameter },
        { label: 'Dog', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Correctly completes unstarted label in MATCH', () => {
    const query = 'MATCH (n:';

    testCompletions({
      query,
      dbSchema: { labels: ['Cat', 'Person', 'Dog'] },
      expected: [{ label: 'Person', kind: CompletionItemKind.TypeParameter }],
    });
  });

  test('Correctly completes unstarted label when caret is passed', () => {
    const query = 'MATCH (n:)';

    testCompletions({
      query,
      offset: query.length - 1,
      dbSchema: { labels: ['Cat', 'Person', 'Dog'] },
      expected: [{ label: 'Person', kind: CompletionItemKind.TypeParameter }],
    });
  });

  test('Correctly completes unstarted label for a first statement when caret is passed', () => {
    const query = 'MATCH (n:); MATCH (m:)';

    testCompletions({
      query,
      offset: 'MATCH (n:)'.length - 1,
      dbSchema: { labels: ['Cat', 'Person', 'Dog'] },
      expected: [{ label: 'Person', kind: CompletionItemKind.TypeParameter }],
    });
  });

  test('Correctly completes started barred label inside a node pattern', () => {
    const query = 'MATCH (n:A|B';
    const dbSchema = {
      labels: ['B', 'C'],
      relationshipTypes: ['D', 'E'],
    };

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Correctly completes unstarted barred label inside a node pattern', () => {
    const query = 'MATCH (n:A|';
    const dbSchema = {
      labels: ['B', 'C'],
      relationshipTypes: ['D', 'E'],
    };

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Correctly completes doubly barred label inside a node pattern', () => {
    const query = 'MATCH (n:A|B|:';
    const dbSchema = {
      labels: ['B', 'C'],
      relationshipTypes: ['D', 'E'],
    };

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Correctly completes started barred label inside a relationship pattern', () => {
    const query = 'MATCH (n)-[r:A|a';
    const dbSchema = {
      labels: ['B', 'C'],
      relationshipTypes: ['D', 'E'],
    };

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Correctly completes barred label inside a relationship pattern', () => {
    const query = 'MATCH (n)-[r:A|';
    const dbSchema = {
      labels: ['B', 'C'],
      relationshipTypes: ['D', 'E'],
    };

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Does not complete relationship type before : is entered', () => {
    const query = 'MATCH (n)-[r';
    const dbSchema = {
      labels: ['B', 'C'],
      relationshipTypes: ['D', 'E'],
    };

    testCompletions({
      query,
      dbSchema,
      excluded: [
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Correctly completes doubly barred label inside a relationship pattern', () => {
    const query = 'MATCH (n)-[r:A|B|:';
    const dbSchema = {
      labels: ['B', 'C'],
      relationshipTypes: ['D', 'E'],
    };

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Correctly completes barred label in WHERE inside node', () => {
    const query = 'MATCH (n WHERE n:A|';
    const dbSchema = {
      labels: ['B', 'C'],
      relationshipTypes: ['D', 'E'],
    };

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
        // TODO don't think we can fix this without a type table
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Correctly completes barred label for a node in WHERE', () => {
    const query = 'MATCH (n) WHERE n:A|';

    testCompletions({
      query,
      dbSchema: {
        labels: ['B', 'C'],
        relationshipTypes: ['D', 'E'],
      },
      expected: [
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
        // FIXME D and E should not appear here but we cannot fix this without a type table
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Correctly completes barred label for a relationship in WHERE', () => {
    const query = 'MATCH (n)-[r]-(m) WHERE r:A|';

    testCompletions({
      query,
      dbSchema: {
        labels: ['B', 'C'],
        relationshipTypes: ['D', 'E'],
      },
      expected: [
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
        // FIXME B and C should not appear here but we cannot fix this without a type table
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Correctly completes WHERE', () => {
    const query = 'MATCH (n:Person) W';

    testCompletions({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes RETURN', () => {
    const query = 'MATCH (n:Person) WHERE n.name = "foo" R';

    testCompletions({
      query,
      expected: [{ label: 'RETURN', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes simple RETURN', () => {
    const query = 'MATCH (n) R';

    testCompletions({
      query,
      expected: [{ label: 'RETURN', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Does not offer left paren for pattern expression auto-completion', () => {
    const query = 'MATCH ';

    testCompletions({
      query,
      excluded: [{ label: 'LPAREN', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Does not offer keywords/symbols for variable autocompletion', () => {
    const query = 'MATCH (n';

    testCompletions({
      query,
      excluded: [
        { label: 'NONE', kind: CompletionItemKind.Keyword },
        { label: 'UnescapedSymbolicName', kind: CompletionItemKind.Keyword },
        { label: 'EscapedSymbolicName', kind: CompletionItemKind.Keyword },
        { label: 'LPAREN', kind: CompletionItemKind.Keyword },
        { label: 'LCURLY', kind: CompletionItemKind.Keyword },
        { label: 'COLON', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  test('Correctly completes AS', () => {
    const query = 'MATCH (n) RETURN n A';

    testCompletions({
      query,
      expected: [{ label: 'AS', kind: CompletionItemKind.Keyword }],
    });
  });
});

describe('CREATE auto-completion', () => {
  test('Correctly completes CREATE', () => {
    const query = 'CR';

    testCompletions({
      query,
      expected: [{ label: 'CREATE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes label in CREATE', () => {
    const query = 'CREATE (n:P';

    testCompletions({
      query,
      dbSchema: { labels: ['Cat', 'Person', 'Dog'] },
      expected: [{ label: 'Person', kind: CompletionItemKind.TypeParameter }],
    });
  });

  test('Correctly completes RETURN', () => {
    const query = 'CREATE (n:Person) RET';

    testCompletions({
      query,
      expected: [{ label: 'RETURN', kind: CompletionItemKind.Keyword }],
    });
  });
});

describe('Type relationship auto-completion', () => {
  test('Correctly completes relationship type', () => {
    const query = 'MATCH (n)-[r:R';

    testCompletions({
      query,
      dbSchema: { relationshipTypes: ['RelationshipType'] },
      expected: [
        { label: 'RelationshipType', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });
});

describe('Auto-completion works correctly inside pattern comprehensions', () => {
  test('Correctly completes keywords inside pattern comprehensions', () => {
    const query = "MATCH (a:Person {name: 'Andy'}) RETURN [(a)-->(b W";

    testCompletions({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
    });
  });
});

describe('Auto-completion works correctly inside nodes and relationship patterns', () => {
  test('Correctly completes keywords inside relationship pattern', () => {
    const query = 'WITH 2000 AS minYear MATCH (a:Person)-[r:KNOWS ';

    testCompletions({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes keywords inside relationship pattern with starting hint', () => {
    const query = 'WITH 2000 AS minYear MATCH (a:Person)-[r:KNOWS W';

    testCompletions({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes keywords inside a node pattern', () => {
    const query = 'WITH 2000 AS minYear MATCH (a ';

    testCompletions({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
    });
  });
});
