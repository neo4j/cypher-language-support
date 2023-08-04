import {
  CompletionItem,
  CompletionItemKind,
  SignatureInformation,
} from 'vscode-languageserver-types';
import { autocomplete } from '../autocompletion/autocompletion';
import { DbInfo } from '../dbInfo';
import { MockDbInfo } from './testHelpers';

export function testCompletionContains(
  fileText: string,
  dbInfo: DbInfo,
  expected: CompletionItem[],
) {
  const actualCompletionList = autocomplete(fileText, dbInfo);

  expected.forEach((expectedItem) => {
    const elementFound = actualCompletionList.find(
      (value) =>
        value.kind === expectedItem.kind && value.label === expectedItem.label,
    );
    expect(elementFound).toBeDefined();
  });
}

export function testCompletionDoesNotContain(
  fileText: string,
  dbInfo: DbInfo,
  excluded: CompletionItem[],
) {
  const actualCompletionList = autocomplete(fileText, dbInfo);

  excluded.forEach((notExpectedItem) => {
    const elementFound = actualCompletionList.find(
      (value) =>
        value.kind === notExpectedItem.kind &&
        value.label === notExpectedItem.label,
    );
    expect(elementFound).toBeUndefined();
  });
}

describe('MATCH auto-completion', () => {
  test('Correctly completes MATCH', () => {
    const query = 'M';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes MATCH in OPTIONAL MATCH', () => {
    const query = 'OPTIONAL M';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes label in MATCH', () => {
    const query = 'MATCH (n:P';

    testCompletionContains(query, new MockDbInfo(['Cat', 'Person', 'Dog']), [
      { label: 'Person', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes barred label inside a node pattern', () => {
    const query = 'MATCH (n:A|';
    const db = new MockDbInfo(['B', 'C'], ['D', 'E']);

    testCompletionContains(query, db, [
      { label: 'B', kind: CompletionItemKind.TypeParameter },
      { label: 'C', kind: CompletionItemKind.TypeParameter },
    ]);

    testCompletionDoesNotContain(query, db, [
      { label: 'D', kind: CompletionItemKind.TypeParameter },
      { label: 'E', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes doubly barred label inside a node pattern', () => {
    const query = 'MATCH (n:A|B|:';
    const db = new MockDbInfo(['B', 'C'], ['D', 'E']);

    testCompletionContains(query, db, [
      { label: 'B', kind: CompletionItemKind.TypeParameter },
      { label: 'C', kind: CompletionItemKind.TypeParameter },
    ]);

    testCompletionDoesNotContain(query, db, [
      { label: 'D', kind: CompletionItemKind.TypeParameter },
      { label: 'E', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes barred label inside a relationship pattern', () => {
    const query = 'MATCH (n)-[r:A|';
    const db = new MockDbInfo(['B', 'C'], ['D', 'E']);

    testCompletionContains(query, db, [
      { label: 'D', kind: CompletionItemKind.TypeParameter },
      { label: 'E', kind: CompletionItemKind.TypeParameter },
    ]);

    testCompletionDoesNotContain(query, db, [
      { label: 'B', kind: CompletionItemKind.TypeParameter },
      { label: 'C', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes doubly barred label inside a relationship pattern', () => {
    const query = 'MATCH (n)-[r:A|B|:';
    const db = new MockDbInfo(['B', 'C'], ['D', 'E']);

    testCompletionContains(query, db, [
      { label: 'D', kind: CompletionItemKind.TypeParameter },
      { label: 'E', kind: CompletionItemKind.TypeParameter },
    ]);

    testCompletionDoesNotContain(query, db, [
      { label: 'B', kind: CompletionItemKind.TypeParameter },
      { label: 'C', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes barred label in WHERE inside node', () => {
    const query = 'MATCH (n WHERE n:A|';
    const db = new MockDbInfo(['B', 'C'], ['D', 'E']);

    testCompletionContains(query, db, [
      { label: 'B', kind: CompletionItemKind.TypeParameter },
      { label: 'C', kind: CompletionItemKind.TypeParameter },
    ]);

    testCompletionDoesNotContain(query, db, [
      { label: 'D', kind: CompletionItemKind.TypeParameter },
      { label: 'E', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes barred label for a node in WHERE', () => {
    const query = 'MATCH (n) WHERE n:A|';

    testCompletionContains(query, new MockDbInfo(['B', 'C'], ['D', 'E']), [
      { label: 'B', kind: CompletionItemKind.TypeParameter },
      { label: 'C', kind: CompletionItemKind.TypeParameter },
      // FIXME D and E should not appear here but we cannot fix this without a type table
      { label: 'D', kind: CompletionItemKind.TypeParameter },
      { label: 'E', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes barred label for a relationship in WHERE', () => {
    const query = 'MATCH (n)-[r]-(m) WHERE r:A|';

    testCompletionContains(query, new MockDbInfo(['B', 'C'], ['D', 'E']), [
      { label: 'D', kind: CompletionItemKind.TypeParameter },
      { label: 'E', kind: CompletionItemKind.TypeParameter },
      // FIXME B and C should not appear here but we cannot fix this without a type table
      { label: 'B', kind: CompletionItemKind.TypeParameter },
      { label: 'C', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes WHERE', () => {
    const query = 'MATCH (n:Person) W';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes RETURN', () => {
    const query = 'MATCH (n:Person) WHERE n.name = "foo" R';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes simple RETURN', () => {
    const query = 'MATCH (n) R';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Does not offer keywords for expression auto-completion', () => {
    const query = 'MATCH (n:Person) WHERE n.name = "N';

    testCompletionDoesNotContain(query, new MockDbInfo(), [
      { label: 'NONE', kind: CompletionItemKind.Keyword },
      { label: 'NULL', kind: CompletionItemKind.Keyword },
      { label: 'UnescapedSymbolicName', kind: CompletionItemKind.Keyword },
      { label: 'EscapedSymbolicName', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Does not offer left paren for pattern expression auto-completion', () => {
    const query = 'MATCH ';

    testCompletionDoesNotContain(query, new MockDbInfo(), [
      { label: 'LPAREN', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Does not offer keywords/symbols for variable autocompletion', () => {
    const query = 'MATCH (n';

    testCompletionDoesNotContain(query, new MockDbInfo(), [
      { label: 'NONE', kind: CompletionItemKind.Keyword },
      { label: 'UnescapedSymbolicName', kind: CompletionItemKind.Keyword },
      { label: 'EscapedSymbolicName', kind: CompletionItemKind.Keyword },
      { label: 'LPAREN', kind: CompletionItemKind.Keyword },
      { label: 'LCURLY', kind: CompletionItemKind.Keyword },
      { label: 'COLON', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes AS', () => {
    const query = 'MATCH (n) RETURN n A';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'AS', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('CREATE auto-completion', () => {
  test('Correctly completes CREATE', () => {
    const query = 'CR';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'CREATE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes label in CREATE', () => {
    const query = 'CREATE (n:P';

    testCompletionContains(query, new MockDbInfo(['Cat', 'Person', 'Dog']), [
      { label: 'Person', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes RETURN', () => {
    const query = 'CREATE (n:Person) RET';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Type relationship auto-completion', () => {
  test('Correctly completes relationship type', () => {
    const query = 'MATCH (n)-[r:R';

    testCompletionContains(query, new MockDbInfo([], ['RelationshipType']), [
      { label: 'RelationshipType', kind: CompletionItemKind.TypeParameter },
    ]);
  });
});

describe('Procedures auto-completion', () => {
  test('Correctly completes CALL in standalone', () => {
    const query = 'C';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'CALL', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes CALL in subquery', () => {
    const query = 'MATCH (n) C';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'CALL', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes procedure name in CALL', () => {
    const query = 'CALL db';

    testCompletionContains(
      query,
      new MockDbInfo(
        [],
        [],
        new Map([
          ['foo.bar', SignatureInformation.create('')],
          ['dbms.info', SignatureInformation.create('')],
          ['somethingElse', SignatureInformation.create('')],
          ['xx.yy', SignatureInformation.create('')],
          ['db.info', SignatureInformation.create('')],
        ]),
      ),
      [
        { label: 'dbms.info', kind: CompletionItemKind.Function },
        { label: 'db.info', kind: CompletionItemKind.Function },
      ],
    );
  });

  test('Correctly completes YIELD', () => {
    const query = 'CALL proc() Y';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'YIELD', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Functions auto-completion', () => {
  const functionSignatures: [string, SignatureInformation][] = [
    ['a.b', SignatureInformation.create('')],
    ['xx.yy.proc', SignatureInformation.create('')],
    ['xx.yy.procedure', SignatureInformation.create('')],
    ['db.info', SignatureInformation.create('')],
  ];

  test('Correctly completes function name in left hand side of WHERE', () => {
    const query = 'MATCH (n) WHERE xx.yy';

    testCompletionContains(
      query,
      new MockDbInfo([], [], new Map(), new Map(functionSignatures)),
      [
        { label: 'xx.yy.proc', kind: CompletionItemKind.Function },
        { label: 'xx.yy.procedure', kind: CompletionItemKind.Function },
      ],
    );
  });

  test('Correctly completes function name in right hand side of WHERE', () => {
    const query = 'MATCH (n) WHERE n.name = xx.yy';

    testCompletionContains(
      query,
      new MockDbInfo([], [], new Map(), new Map(functionSignatures)),
      [
        { label: 'xx.yy.proc', kind: CompletionItemKind.Function },
        { label: 'xx.yy.procedure', kind: CompletionItemKind.Function },
      ],
    );
  });

  test('Correctly completes function name in RETURN', () => {
    const query = 'RETURN xx.yy';

    testCompletionContains(
      query,
      new MockDbInfo([], [], new Map(), new Map(functionSignatures)),
      [
        { label: 'xx.yy.proc', kind: CompletionItemKind.Function },
        { label: 'xx.yy.procedure', kind: CompletionItemKind.Function },
      ],
    );
  });

  test('Correctly completes function name in an AND', () => {
    const query = 'RETURN true AND xx.yy';

    testCompletionContains(
      query,
      new MockDbInfo([], [], new Map(), new Map(functionSignatures)),
      [
        { label: 'xx.yy.proc', kind: CompletionItemKind.Function },
        { label: 'xx.yy.procedure', kind: CompletionItemKind.Function },
      ],
    );
  });
});

describe('Misc auto-completion', () => {
  test('Correctly completes empty statement', () => {
    const query = '';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
      { label: 'CREATE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes RETURN', () => {
    const query = 'RET';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes DISTINCT', () => {
    const query = 'MATCH (n:Person)-[r:KNOWS]-(m:Person) RETURN ';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'DISTINCT', kind: CompletionItemKind.Keyword },
    ]);

    testCompletionDoesNotContain(query, new MockDbInfo(), [
      { label: 'STRING_LITERAL1', kind: CompletionItemKind.Keyword },
      { label: 'STRING_LITERAL2', kind: CompletionItemKind.Keyword },
      { label: 'INF SET', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes MATCH in multiline statement', () => {
    const query = `CALL dbms.info() YIELD *;
M`;

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes statement when the first one has some syntactic error', () => {
    const query = `MATCH (n: Person W);
C`;

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'CREATE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes longer statement when the first one has some syntactic error', () => {
    const query = `MATCH (n) REUTRN n;
MATCH (n) W`;

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes last statement when having three broken statements', () => {
    const query = `MATCH (n) REUTRN n;
MATCH (n) REUTRN n;
MATCH (n) W`;

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes next statement when there is no initiating keyword', () => {
    const query = `MATCH (n) RETURN n;`;

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
      { label: 'CREATE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes label in a second statement after a broken one', () => {
    const query = `MATCH (n) REUTRN n;
MATCH (n:P`;

    testCompletionContains(query, new MockDbInfo(['Person', 'Dog']), [
      { label: 'Person', kind: CompletionItemKind.TypeParameter },
      { label: 'Dog', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes label with empty prompt in a second statement after a broken one', () => {
    const query = `MATCH (n) REUTRN n;
MATCH (n:`;

    testCompletionContains(query, new MockDbInfo(['A', 'B']), [
      { label: 'A', kind: CompletionItemKind.TypeParameter },
      { label: 'B', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes barred label in a second statement after a broken one', () => {
    const query = `MATCH (n) REUTRN n;
MATCH (n:A|`;

    testCompletionContains(query, new MockDbInfo(['A', 'B']), [
      { label: 'A', kind: CompletionItemKind.TypeParameter },
      { label: 'B', kind: CompletionItemKind.TypeParameter },
    ]);
  });
});

describe('Inserts correct text when symbolic name is not display name', () => {
  test('Inserts correct text for LIMIT', () => {
    const query = 'RETURN 1 L';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'LIMIT', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Inserts correct text for SKIP', () => {
    const query = 'RETURN 1 S';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'SKIP', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Inserts correct text for shortestPath', () => {
    const query = 'MATCH s';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'shortestPath', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Inserts correct text for allShortestPath', () => {
    const query = 'MATCH a';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'allShortestPaths', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Auto-completion works correctly inside pattern comprehensions', () => {
  test.skip('Correctly completes keywords inside pattern comprehensions', () => {
    const query = "MATCH (a:Person {name: 'Andy'}) RETURN [(a)-->(b W";

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Auto-completion works correctly inside nodes and relationship patterns', () => {
  test('Correctly completes keywords inside relationship pattern', () => {
    const query = 'WITH 2000 AS minYear MATCH (a:Person)-[r:KNOWS ';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes keywords inside relationship pattern with starting hint', () => {
    const query = 'WITH 2000 AS minYear MATCH (a:Person)-[r:KNOWS W';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes keywords inside a node pattern', () => {
    const query = 'WITH 2000 AS minYear MATCH (a ';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Auto completion of back to back keywords', () => {
  test('Correctly completes OPTIONAL MATCH', () => {
    const query = 'OP';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'OPTIONAL MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes DEFAULT DATABASE and HOME DATABASE', () => {
    const query = 'SHOW ';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'DATABASE', kind: CompletionItemKind.Keyword },
      { label: 'DEFAULT DATABASE', kind: CompletionItemKind.Keyword },
      { label: 'HOME DATABASE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes UNION and UNION ALL', () => {
    const query =
      'MATCH (a:Person)-[:KNOWS]->(b:Person) RETURN b.name AS name ';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'UNION', kind: CompletionItemKind.Keyword },
      { label: 'UNION ALL', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes LOAD CSV', () => {
    const query = 'L';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'LOAD CSV', kind: CompletionItemKind.Keyword },
    ]);

    testCompletionDoesNotContain(query, new MockDbInfo(), [
      { label: 'LOAD CSV WITH', kind: CompletionItemKind.Keyword },
      { label: 'LOAD CSV WITH HEADERS', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes WITH HEADERS in LOAD CSV', () => {
    const query = 'LOAD CSV ';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'WITH HEADERS', kind: CompletionItemKind.Keyword },
    ]);

    testCompletionDoesNotContain(query, new MockDbInfo(), [
      { label: 'WITH HEADERS FROM', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes WITH HEADERS in LOAD CSV', () => {
    const query = 'LOAD CSV WITH ';

    testCompletionContains(query, new MockDbInfo(), [
      { label: 'HEADERS', kind: CompletionItemKind.Keyword },
    ]);

    testCompletionDoesNotContain(query, new MockDbInfo(), [
      { label: 'HEADERS FROM', kind: CompletionItemKind.Keyword },
    ]);
  });
});
