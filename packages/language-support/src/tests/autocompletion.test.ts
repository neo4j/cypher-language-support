import {
  CompletionItem,
  CompletionItemKind,
  SignatureInformation,
} from 'vscode-languageserver-types';
import { autocomplete } from '../autocompletion/autocompletion';
import { DbSchema } from '../dbSchema';

type InclusionTestArgs = {
  query: string;
  dbSchema?: DbSchema;
  expected: CompletionItem[];
};
export function testCompletionContains({
  query,
  dbSchema = {},
  expected,
}: InclusionTestArgs) {
  const actualCompletionList = autocomplete(query, dbSchema);

  expect(actualCompletionList).not.toContain(null);
  expect(actualCompletionList).not.toContain(undefined);

  const actual = expected.map((expectedItem) =>
    actualCompletionList.find(
      (value) =>
        value.kind === expectedItem.kind && value.label === expectedItem.label,
    ),
  );

  expect(expected).toEqual(actual);
}

type ExclusionTestArgs = {
  query: string;
  dbSchema?: DbSchema;
  excluded: Partial<CompletionItem>[];
};
export function testCompletionDoesNotContain({
  query,
  dbSchema = {},
  excluded,
}: ExclusionTestArgs) {
  const actualCompletionList = autocomplete(query, dbSchema);

  expect(actualCompletionList).not.toContain(null);
  expect(actualCompletionList).not.toContain(undefined);

  const actual = excluded.map((notExpectedItem) =>
    actualCompletionList.find((value) => {
      // if label is left out -> only check kind and vice versa
      const matchingKind =
        notExpectedItem.kind === undefined ||
        notExpectedItem.kind === value.kind;

      const matchingLabel =
        notExpectedItem.label === undefined ||
        notExpectedItem.label === value.label;

      return matchingKind && matchingLabel;
    }),
  );

  expect(actual).toEqual([]);
}

describe('MATCH auto-completion', () => {
  test('Correctly completes MATCH', () => {
    const query = 'M';

    testCompletionContains({
      query,
      expected: [{ label: 'MATCH', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes OPTIONAL MATCH', () => {
    const query = 'OP';

    testCompletionContains({
      query,
      expected: [{ label: 'OPTIONAL MATCH', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes MATCH in OPTIONAL MATCH', () => {
    const query = 'OPTIONAL M';

    testCompletionContains({
      query,
      expected: [{ label: 'MATCH', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes label in MATCH', () => {
    const query = 'MATCH (n:P';

    testCompletionContains({
      query,
      dbSchema: { labels: ['Cat', 'Person', 'Dog'] },
      expected: [{ label: 'Person', kind: CompletionItemKind.TypeParameter }],
    });
  });

  test("Doesn't complete label before : is entered", () => {
    const query = 'MATCH (n';

    testCompletionDoesNotContain({
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

    testCompletionContains({
      query,
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

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
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

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
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

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
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

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
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

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
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

    testCompletionDoesNotContain({
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

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
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

    testCompletionContains({
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

    testCompletionContains({
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

    testCompletionContains({
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

    testCompletionContains({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes RETURN', () => {
    const query = 'MATCH (n:Person) WHERE n.name = "foo" R';

    testCompletionContains({
      query,
      expected: [{ label: 'RETURN', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes simple RETURN', () => {
    const query = 'MATCH (n) R';

    testCompletionContains({
      query,
      expected: [{ label: 'RETURN', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Does not offer left paren for pattern expression auto-completion', () => {
    const query = 'MATCH ';

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'LPAREN', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Does not offer keywords/symbols for variable autocompletion', () => {
    const query = 'MATCH (n';

    testCompletionDoesNotContain({
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

    testCompletionContains({
      query,
      expected: [{ label: 'AS', kind: CompletionItemKind.Keyword }],
    });
  });
});

describe('CREATE auto-completion', () => {
  test('Correctly completes CREATE', () => {
    const query = 'CR';

    testCompletionContains({
      query,
      expected: [{ label: 'CREATE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes label in CREATE', () => {
    const query = 'CREATE (n:P';

    testCompletionContains({
      query,
      dbSchema: { labels: ['Cat', 'Person', 'Dog'] },
      expected: [{ label: 'Person', kind: CompletionItemKind.TypeParameter }],
    });
  });

  test('Correctly completes RETURN', () => {
    const query = 'CREATE (n:Person) RET';

    testCompletionContains({
      query,
      expected: [{ label: 'RETURN', kind: CompletionItemKind.Keyword }],
    });
  });
});

describe('Type relationship auto-completion', () => {
  test('Correctly completes relationship type', () => {
    const query = 'MATCH (n)-[r:R';

    testCompletionContains({
      query,
      dbSchema: { relationshipTypes: ['RelationshipType'] },
      expected: [
        { label: 'RelationshipType', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });
});

describe('Procedures auto-completion', () => {
  test('Correctly completes CALL in standalone', () => {
    const query = 'C';

    testCompletionContains({
      query,
      expected: [{ label: 'CALL', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes CALL in subquery', () => {
    const query = 'MATCH (n) C';

    testCompletionContains({
      query,
      expected: [{ label: 'CALL', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes procedure name in CALL', () => {
    const query = 'CALL db';

    testCompletionContains({
      query,
      dbSchema: {
        procedureSignatures: {
          'foo.bar': SignatureInformation.create(''),
          'dbms.info': SignatureInformation.create(''),
          somethingElse: SignatureInformation.create(''),
          'xx.yy': SignatureInformation.create(''),
          'db.info': SignatureInformation.create(''),
        },
      },
      expected: [
        { label: 'dbms.info', kind: CompletionItemKind.Method },
        { label: 'db.info', kind: CompletionItemKind.Method },
      ],
    });
  });

  test('Correctly completes YIELD', () => {
    const query = 'CALL proc() Y';

    testCompletionContains({
      query,
      expected: [{ label: 'YIELD', kind: CompletionItemKind.Keyword }],
    });
  });
});

describe('expression completions', () => {
  describe('misc expression tests', () => {
    test('Can offer keyword literals in expressions when appropriate', () => {
      const query = 'MATCH (n:Person) WHERE n.name = N';

      testCompletionContains({
        query,
        expected: [
          { label: 'NAN', kind: CompletionItemKind.Keyword },
          { label: 'NULL', kind: CompletionItemKind.Keyword },
        ],
      });
    });

    test('Does not incorrectly offer keywords when building string', () => {
      const query = 'MATCH (n:Person) WHERE n.name = "N';

      testCompletionDoesNotContain({
        query,
        excluded: [
          { label: 'NONE', kind: CompletionItemKind.Keyword },
          { label: 'NULL', kind: CompletionItemKind.Keyword },
          { label: 'UnescapedSymbolicName', kind: CompletionItemKind.Keyword },
          { label: 'EscapedSymbolicName', kind: CompletionItemKind.Keyword },
        ],
      });
    });
  });

  describe('function invocations', () => {
    const dbSchema: DbSchema = {
      functionSignatures: {
        'a.b': SignatureInformation.create(''),
        'xx.yy.proc': SignatureInformation.create(''),
        'xx.yy.procedure': SignatureInformation.create(''),
        'db.info': SignatureInformation.create(''),
      },
    };

    test('Correctly completes unstarted function name in left hand side of WHERE', () => {
      const query = 'MATCH (n) WHERE ';

      testCompletionContains({
        query,
        dbSchema,
        expected: [
          { label: 'xx.yy.proc', kind: CompletionItemKind.Function },
          { label: 'xx.yy.procedure', kind: CompletionItemKind.Function },
        ],
      });
    });

    test('Correctly completes function name in left hand side of WHERE', () => {
      const query = 'MATCH (n) WHERE xx.yy';

      testCompletionContains({
        query,
        dbSchema,
        expected: [
          { label: 'xx.yy.proc', kind: CompletionItemKind.Function },
          { label: 'xx.yy.procedure', kind: CompletionItemKind.Function },
        ],
      });
    });

    test('Correctly completes function name in right hand side of WHERE', () => {
      const query = 'MATCH (n) WHERE n.name = xx.yy';

      testCompletionContains({
        query,
        dbSchema,
        expected: [
          { label: 'xx.yy.proc', kind: CompletionItemKind.Function },
          { label: 'xx.yy.procedure', kind: CompletionItemKind.Function },
        ],
      });
    });

    test('Correctly completes function name in RETURN', () => {
      const query = 'RETURN xx.yy';

      testCompletionContains({
        query,
        dbSchema,
        expected: [
          { label: 'xx.yy.proc', kind: CompletionItemKind.Function },
          { label: 'xx.yy.procedure', kind: CompletionItemKind.Function },
        ],
      });
    });

    test('Correctly completes function name in an AND', () => {
      const query = 'RETURN true AND xx.yy';

      testCompletionContains({
        query,
        dbSchema,
        expected: [
          { label: 'xx.yy.proc', kind: CompletionItemKind.Function },
          { label: 'xx.yy.procedure', kind: CompletionItemKind.Function },
        ],
      });
    });
  });
});

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

describe('Auto-completion works correctly inside pattern comprehensions', () => {
  test('Correctly completes keywords inside pattern comprehensions', () => {
    const query = "MATCH (a:Person {name: 'Andy'}) RETURN [(a)-->(b W";

    testCompletionContains({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
    });
  });
});

describe('Auto-completion works correctly inside nodes and relationship patterns', () => {
  test('Correctly completes keywords inside relationship pattern', () => {
    const query = 'WITH 2000 AS minYear MATCH (a:Person)-[r:KNOWS ';

    testCompletionContains({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes keywords inside relationship pattern with starting hint', () => {
    const query = 'WITH 2000 AS minYear MATCH (a:Person)-[r:KNOWS W';

    testCompletionContains({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes keywords inside a node pattern', () => {
    const query = 'WITH 2000 AS minYear MATCH (a ';

    testCompletionContains({
      query,
      expected: [{ label: 'WHERE', kind: CompletionItemKind.Keyword }],
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

describe('can complete database names', () => {
  const dbSchema: DbSchema = {
    databaseNames: ['db1', 'db2', 'movies'],
    aliasNames: ['myMovies', 'scoped.alias', 'a.b.c.d'],
    parameters: {
      param1: 'something',
      param2: 1337,
      param3: {
        property: 'value',
      },
    },
  };

  test('Correctly completes database names and aliases in SHOW DATABASE', () => {
    const query = 'SHOW DATABASE ';

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'WHERE', kind: CompletionItemKind.Keyword },
        { label: 'YIELD', kind: CompletionItemKind.Keyword },
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        { label: '$param1', kind: CompletionItemKind.Variable },
      ],
    });

    // do not suggest non-string parameters
    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Correctly completes database names and aliases in SHOW DATABASE with started db name', () => {
    const query = 'SHOW DATABASE m';

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'WHERE', kind: CompletionItemKind.Keyword },
        { label: 'YIELD', kind: CompletionItemKind.Keyword },
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        { label: '$param1', kind: CompletionItemKind.Variable },
      ],
    });

    // validate invalid keyword bug isn't present
    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [{ label: '', kind: CompletionItemKind.Keyword }],
    });

    // do not suggest non-string parameters
    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test("Doesn't suggest existing database names or aliases when createing database", () => {
    const query = 'CREATE DATABASE ';

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
      ],
    });

    // can create new database name using parameter
    testCompletionContains({
      query,
      dbSchema,
      expected: [{ label: '$param1', kind: CompletionItemKind.Variable }],
    });

    // do not suggest non-string parameters
    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test("Doesn't suggest existing database names or aliases when createing alias", () => {
    const query = 'CREATE ALIAS ';

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
      ],
    });

    // can create new alias name using parameter
    testCompletionContains({
      query,
      dbSchema,
      expected: [{ label: '$param1', kind: CompletionItemKind.Variable }],
    });

    // do not suggest non-string parameters
    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('suggest only aliases when dropping alias', () => {
    const query = 'DROP ALIAS ';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        { label: '$param1', kind: CompletionItemKind.Variable },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
      ],
    });

    // do not suggest non-string parameters
    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('suggest only aliases when showing alias', () => {
    const query = 'SHOW ALIAS ';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: '$param1', kind: CompletionItemKind.Variable },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
      ],
    });

    // do not suggest non-string parameters
    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('suggest only aliases when altering alias', () => {
    const query = 'ALTER ALIAS a';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        { label: '$param1', kind: CompletionItemKind.Variable },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
      ],
    });

    // do not suggest non-string parameters
    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('can complete when typing scoped alias', () => {
    const query = 'ALTER ALIAS a.b.c.';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        { label: '$param1', kind: CompletionItemKind.Variable },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
      ],
    });

    // do not suggest non-string parameters
    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('handle that the parser allows spaces in symbolicAliasName', () => {
    // Since the parser allows for spaces in the symbolicAliasName rule but not in created alias (unless quoted)
    // I've added a test to verify we don't suggest aliases after the space (false positives)
    const query = 'drop alias myMovies ';

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'FOR DATABASE', kind: CompletionItemKind.Keyword },
        { label: 'IF EXISTS', kind: CompletionItemKind.Keyword },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        // EOF checks
        { label: '', kind: CompletionItemKind.Value },
        { label: '', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  describe('can complete parameters outside of database names', () => {
    const dbSchema: DbSchema = {
      parameters: {
        stringParam: 'something',
        intParam: 1337,
        mapParam: {
          property: 'value',
        },
      },
    };

    test('correctly completes started parameter in return body', () => {
      const query = 'RETURN $';
      testCompletionContains({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      });
    });

    test('correctly completes unstarted parameter in return body', () => {
      const query = 'RETURN ';
      testCompletionContains({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      });
    });

    test('correctly completes started parameter in where clause', () => {
      const query = 'MATCH (n) WHERE ';
      testCompletionContains({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      });
    });

    test('correctly completes started parameter in expression', () => {
      const query = 'RETURN 1 + ';
      testCompletionContains({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      });
    });

    test('correctly suggests parameter in ENABLE SERVER', () => {
      const query = 'ENABLE SERVER ';
      testCompletionContains({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
        ],
      });
      testCompletionDoesNotContain({
        query,
        dbSchema,
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      });
    });

    test('suggests parameter as map properties', () => {
      const query = 'match (v :Movie ';

      testCompletionContains({
        query,
        dbSchema,
        expected: [{ label: '$mapParam', kind: CompletionItemKind.Variable }],
      });

      testCompletionDoesNotContain({
        query,
        dbSchema,
        excluded: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: '$intParam', kind: CompletionItemKind.Variable },
        ],
      });

      // ensure variables are not suggested in place of parameters (parameters reuse the variable rule)
      testCompletionDoesNotContain({
        query,
        dbSchema,
        excluded: [{ label: 'v', kind: CompletionItemKind.Variable }],
      });
    });

    test('suggests parameter in options field of create constraint', () => {
      const query =
        'CREATE CONSTRAINT abc ON (n:person) ASSERT EXISTS n.name OPTIONS';
      testCompletionContains({
        query,
        dbSchema,
        expected: [{ label: '$mapParam', kind: CompletionItemKind.Variable }],
      });
      testCompletionDoesNotContain({
        query,
        dbSchema,
        excluded: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: '$intParam', kind: CompletionItemKind.Variable },
        ],
      });
    });

    test('suggests parameter in options field of create index', () => {
      const query = 'CREATE INDEX abc FOR (n:person) ON (n.name) OPTIONS ';
      testCompletionContains({
        query,
        dbSchema,
        expected: [{ label: '$mapParam', kind: CompletionItemKind.Variable }],
      });
      testCompletionDoesNotContain({
        query,
        dbSchema,
        excluded: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: '$intParam', kind: CompletionItemKind.Variable },
        ],
      });
    });

    test('suggests parameter in options field of create composite database', () => {
      const query = 'CREATE COMPOSITE DATABASE name IF NOT EXISTS OPTIONS ';
      testCompletionContains({
        query,
        dbSchema,
        expected: [{ label: '$mapParam', kind: CompletionItemKind.Variable }],
      });
      testCompletionDoesNotContain({
        query,
        dbSchema,
        excluded: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: '$intParam', kind: CompletionItemKind.Variable },
        ],
      });
    });

    test('suggests parameters for user management', () => {
      const cases = [
        'CREATE USER',
        'DROP USER',
        'ALTER USER',
        'RENAME USER',
        'SHOW USER',
        'ALTER CURRENT USER SET PASSWORD FROM',
        'ALTER CURRENT USER SET PASSWORD FROM $pw to ',
        'ALTER USER',
        'ALTER USER foo IF EXISTS SET PASSWORD ',
      ];
      cases.forEach((query) => {
        testCompletionContains({
          query,
          dbSchema,
          expected: [
            { label: '$stringParam', kind: CompletionItemKind.Variable },
          ],
        });
        testCompletionDoesNotContain({
          query,
          dbSchema,
          excluded: [
            { label: '$intParam', kind: CompletionItemKind.Variable },
            { label: '$mapParam', kind: CompletionItemKind.Variable },
          ],
        });
      });
    });

    test('suggests parameters for role management', () => {
      const cases = [
        'CREATE ROLE',
        'DROP ROLE',
        'RENAME ROLE',
        'GRANT ROLE',
        'GRANT ROLE abc TO',
      ];
      cases.forEach((query) => {
        testCompletionContains({
          query,
          dbSchema,
          expected: [
            { label: '$stringParam', kind: CompletionItemKind.Variable },
          ],
        });
        testCompletionDoesNotContain({
          query,
          dbSchema,
          excluded: [
            { label: '$intParam', kind: CompletionItemKind.Variable },
            { label: '$mapParam', kind: CompletionItemKind.Variable },
          ],
        });
      });
    });

    test('suggests parameters for server management', () => {
      const nameCases = [
        'ENABLE SERVER ',
        'ALTER SERVER ',
        'RENAME SERVER ',
        'RENAME SERVER $adb TO ',
        'DROP SERVER ',
        'DEALLOCATE DATABASES FROM SERVERS ',
        'DEALLOCATE DATABASES FROM SERVERS "ab", ',
      ];
      const optionsCases = [
        'ENABLE SERVER "abc" OPTIONS',
        'ALTER SERVER "abc" SET OPTIONS',
      ];

      nameCases.forEach((query) => {
        testCompletionContains({
          query,
          dbSchema,
          expected: [
            { label: '$stringParam', kind: CompletionItemKind.Variable },
          ],
        });
        testCompletionDoesNotContain({
          query,
          dbSchema,
          excluded: [
            { label: '$intParam', kind: CompletionItemKind.Variable },
            { label: '$mapParam', kind: CompletionItemKind.Variable },
          ],
        });
      });

      optionsCases.forEach((query) => {
        testCompletionContains({
          query,
          dbSchema,
          expected: [{ label: '$mapParam', kind: CompletionItemKind.Variable }],
        });
        testCompletionDoesNotContain({
          query,
          dbSchema,
          excluded: [
            { label: '$intParam', kind: CompletionItemKind.Variable },
            { label: '$stringParam', kind: CompletionItemKind.Variable },
          ],
        });
      });
    });
  });
});

describe('property key completions', () => {
  const dbSchema: DbSchema = { propertyKeys: ['name', 'type', 'level'] };

  test('correctly completes property keys in WHERE', () => {
    const query = 'MATCH (n) WHERE n.';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('correctly completes property keys in match clauses', () => {
    const cases = [
      'MATCH ({',
      'MATCH (n {',
      'MATCH (n:Person {',
      'MATCH (n:Person {p: 1, ',
    ];
    cases.forEach((query) =>
      testCompletionContains({
        query,
        dbSchema,
        expected: [
          { label: 'name', kind: CompletionItemKind.Property },
          { label: 'type', kind: CompletionItemKind.Property },
          { label: 'level', kind: CompletionItemKind.Property },
        ],
      }),
    );
  });

  test('correctly completes property keys in simple map projection', () => {
    const query = `
RETURN movie {
 .
`;

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('correctly completes property keys in complex map projection', () => {
    const query = `
RETURN movie {
 actors: [(movie)<-[rel:ACTED_IN]-(person:Person) 
                 | person { .
`;

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('does not complete property keys in literals', () => {
    const query = `RETURN {`;

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });
});

describe('unscoped variable completions', () => {
  test('correctly completes variables in WHERE clause that have been defined in a simple match', () => {
    const basequery = (varName: string) => `MATCH (${varName}) WHERE `;
    const varNames = ['n', 'person', 'MATCH'];

    varNames.forEach((varName) => {
      testCompletionContains({
        query: basequery(varName),
        expected: [{ label: varName, kind: CompletionItemKind.Variable }],
      });
    });
  });

  test('correctly completes variables from pattern in match', () => {
    const query =
      'MATCH p=(n:Person {n: 23})-[r:KNOWS {since: 213, g: rand()}]->(m:Person) WHERE ';

    testCompletionContains({
      query,
      expected: [
        { label: 'p', kind: CompletionItemKind.Variable },
        { label: 'n', kind: CompletionItemKind.Variable },
        { label: 'r', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('suggests variable in WITH', () => {
    const query = 'MATCH (n:Person) WITH ';

    testCompletionContains({
      query,
      expected: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('suggests both variables after renaming variable', () => {
    const query = 'MATCH (n:Person) WITH n as m RETURN';
    testCompletionContains({
      query,
      expected: [
        { label: 'n', kind: CompletionItemKind.Variable },
        { label: 'm', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('does not suggest variable when renaming variable', () => {
    const query = 'MATCH (n:Person) WITH n as';

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('does not suggest variables when unwinding ', () => {
    const query = 'MATCH (n:Person) UNWIND [] as';

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('suggests variable in expression', () => {
    const query = 'WITH 1 as n RETURN db.function(';

    testCompletionContains({
      query,
      expected: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('completes unstarted variables that used but not defined when semantic analysis is not available', () => {
    const query = 'MATCH (:Person) WHERE n.name = "foo" RETURN n.name, n.age, ';

    testCompletionContains({
      query,
      expected: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('completes variables that used but not defined when semantic analysis is not available', () => {
    const query =
      'MATCH (:Person) WHERE movie.name = "foo" RETURN movie.name, movie.age, m';

    testCompletionContains({
      query,
      expected: [{ label: 'movie', kind: CompletionItemKind.Variable }],
    });
  });

  test('suggests variable for set', () => {
    const query = 'MATCH (n:Person) SET ';

    testCompletionContains({
      query,
      expected: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('suggests variable for remove', () => {
    const query = 'MATCH (n:Person) REMOVE ';

    testCompletionContains({
      query,
      expected: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('suggests variables for index hint rule', () => {
    const query = 'match (n) USING BTREE INDEX ';

    testCompletionContains({
      query,
      expected: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('does not suggest existing variables in clauses that create variables', () => {
    const cases = ['FOREACH (', 'LOAD CSV WITH HEADERS FROM 2 AS '];
    const base = 'WITH 1 as a ';

    cases.forEach((c) => {
      testCompletionDoesNotContain({
        query: base + c,
        excluded: [{ label: 'a', kind: CompletionItemKind.Variable }],
      });
    });
  });

  test('does not suggest existing variables in expressions that create variables', () => {
    const cases = ['reduce(', 'all(', 'any(', 'none(', 'single('];
    const base = 'WITH 1 as a RETURN ';

    cases.forEach((c) => {
      testCompletionDoesNotContain({
        query: base + c,
        excluded: [{ label: 'a', kind: CompletionItemKind.Variable }],
      });
    });
  });

  test('should not suggest variable when creating on in procedureResultItem', () => {
    const query = 'WITH 1 as n CALL apoc.super.thing() YIELD header as ';

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('should not take self into account for suggestions', () => {
    const query = 'RETURN variable';

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'variable', kind: CompletionItemKind.Variable }],
    });
  });

  test("variables don't get suggested when working on constraints", () => {
    // dropping/ creating constraints is a top level command/statement so
    // we can't declare any variables to test against
    // this test is just for sanity checking that we don't suggest any variables
    const nodeConstraint = 'DROP CONSTRAINT ON (';
    const relConstraint = 'DROP CONSTRAINT ON ()-[';
    const propertyList = 'DROP CONSTRAINT ON (:Person) ASSERT EXISTS ';

    [nodeConstraint, relConstraint, propertyList].forEach((query) => {
      testCompletionDoesNotContain({
        query,
        excluded: [{ kind: CompletionItemKind.Variable }],
      });
    });
  });

  test('variables in map projections', () => {
    const query = `MATCH (movie:Movie)
    RETURN movie { .
    `;

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'movie', kind: CompletionItemKind.Variable }],
    });
  });

  test('handle binding variables in subqueryInTransactionsReportParameters properly', () => {
    const query = `CALL { WITH 1 as a } IN TRANSACTIONS REPORT STATUS AS `;

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'a', kind: CompletionItemKind.Variable }],
    });
  });
});
