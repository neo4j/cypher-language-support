import {
  CompletionItem,
  CompletionItemKind,
  Position,
  SignatureInformation,
} from 'vscode-languageserver-types';
import { autocomplete } from '../autocompletion/autocompletion';
import { DbInfo } from '../dbInfo';
import { MockDbInfo } from './testHelpers';

export function testCompletionContains(
  fileText: string,
  position: Position,
  dbInfo: DbInfo,
  expected: CompletionItem[],
) {
  const actualCompletionList = autocomplete(fileText, position, dbInfo);

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
  position: Position,
  dbInfo: DbInfo,
  excluded: CompletionItem[],
) {
  const actualCompletionList = autocomplete(fileText, position, dbInfo);

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
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes MATCH in OPTIONAL MATCH', () => {
    const query = 'OPTIONAL M';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes label in MATCH', () => {
    const query = 'MATCH (n:P';
    const position = Position.create(0, query.length);

    testCompletionContains(
      query,
      position,
      new MockDbInfo(['Cat', 'Person', 'Dog']),
      [{ label: 'Person', kind: CompletionItemKind.TypeParameter }],
    );
  });

  test('Correctly completes barred label inside a node pattern', () => {
    const query = 'MATCH (n:A|';
    const position = Position.create(0, query.length);
    const db = new MockDbInfo(['B', 'C'], ['D', 'E']);

    testCompletionContains(query, position, db, [
      { label: 'B', kind: CompletionItemKind.TypeParameter },
      { label: 'C', kind: CompletionItemKind.TypeParameter },
    ]);

    testCompletionDoesNotContain(query, position, db, [
      { label: 'D', kind: CompletionItemKind.TypeParameter },
      { label: 'E', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes doubly barred label inside a node pattern', () => {
    const query = 'MATCH (n:A|B|:';
    const position = Position.create(0, query.length);
    const db = new MockDbInfo(['B', 'C'], ['D', 'E']);

    testCompletionContains(query, position, db, [
      { label: 'B', kind: CompletionItemKind.TypeParameter },
      { label: 'C', kind: CompletionItemKind.TypeParameter },
    ]);

    testCompletionDoesNotContain(query, position, db, [
      { label: 'D', kind: CompletionItemKind.TypeParameter },
      { label: 'E', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes barred label inside a relationship pattern', () => {
    const query = 'MATCH (n)-[r:A|';
    const position = Position.create(0, query.length);
    const db = new MockDbInfo(['B', 'C'], ['D', 'E']);

    testCompletionContains(query, position, db, [
      { label: 'D', kind: CompletionItemKind.TypeParameter },
      { label: 'E', kind: CompletionItemKind.TypeParameter },
    ]);

    testCompletionDoesNotContain(query, position, db, [
      { label: 'B', kind: CompletionItemKind.TypeParameter },
      { label: 'C', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes doubly barred label inside a relationship pattern', () => {
    const query = 'MATCH (n)-[r:A|B|:';
    const position = Position.create(0, query.length);
    const db = new MockDbInfo(['B', 'C'], ['D', 'E']);

    testCompletionContains(query, position, db, [
      { label: 'D', kind: CompletionItemKind.TypeParameter },
      { label: 'E', kind: CompletionItemKind.TypeParameter },
    ]);

    testCompletionDoesNotContain(query, position, db, [
      { label: 'B', kind: CompletionItemKind.TypeParameter },
      { label: 'C', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes barred label in WHERE inside node', () => {
    const query = 'MATCH (n WHERE n:A|';
    const position = Position.create(0, query.length);
    const db = new MockDbInfo(['B', 'C'], ['D', 'E']);

    testCompletionContains(query, position, db, [
      { label: 'B', kind: CompletionItemKind.TypeParameter },
      { label: 'C', kind: CompletionItemKind.TypeParameter },
    ]);

    testCompletionDoesNotContain(query, position, db, [
      { label: 'D', kind: CompletionItemKind.TypeParameter },
      { label: 'E', kind: CompletionItemKind.TypeParameter },
    ]);
  });

  test('Correctly completes barred label for a node in WHERE', () => {
    const query = 'MATCH (n) WHERE n:A|';
    const position = Position.create(0, query.length);

    testCompletionContains(
      query,
      position,
      new MockDbInfo(['B', 'C'], ['D', 'E']),
      [
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
        // FIXME D and E should not appear here but we cannot fix this without a type table
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
      ],
    );
  });

  test('Correctly completes barred label for a relationship in WHERE', () => {
    const query = 'MATCH (n)-[r]-(m) WHERE r:A|';
    const position = Position.create(0, query.length);

    testCompletionContains(
      query,
      position,
      new MockDbInfo(['B', 'C'], ['D', 'E']),
      [
        { label: 'D', kind: CompletionItemKind.TypeParameter },
        { label: 'E', kind: CompletionItemKind.TypeParameter },
        // FIXME B and C should not appear here but we cannot fix this without a type table
        { label: 'B', kind: CompletionItemKind.TypeParameter },
        { label: 'C', kind: CompletionItemKind.TypeParameter },
      ],
    );
  });

  test('Correctly completes WHERE', () => {
    const query = 'MATCH (n:Person) W';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes RETURN', () => {
    const query = 'MATCH (n:Person) WHERE n.name = "foo" R';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes simple RETURN', () => {
    const query = 'MATCH (n) R';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Does not offer keywords for expression auto-completion', () => {
    const query = 'MATCH (n:Person) WHERE n.name = "N';
    const position = Position.create(0, query.length);

    testCompletionDoesNotContain(query, position, new MockDbInfo(), [
      { label: 'NONE', kind: CompletionItemKind.Keyword },
      { label: 'NULL', kind: CompletionItemKind.Keyword },
      { label: 'UnescapedSymbolicName', kind: CompletionItemKind.Keyword },
      { label: 'EscapedSymbolicName', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Does not offer left paren for pattern expression auto-completion', () => {
    const query = 'MATCH ';
    const position = Position.create(0, query.length);

    testCompletionDoesNotContain(query, position, new MockDbInfo(), [
      { label: 'LPAREN', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Does not offer keywords/symbols for variable autocompletion', () => {
    const query = 'MATCH (n';
    const position = Position.create(0, query.length);

    testCompletionDoesNotContain(query, position, new MockDbInfo(), [
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
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'AS', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('CREATE auto-completion', () => {
  test('Correctly completes CREATE', () => {
    const query = 'CR';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'CREATE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes label in CREATE', () => {
    const query = 'CREATE (n:P';
    const position = Position.create(0, query.length);

    testCompletionContains(
      query,
      position,
      new MockDbInfo(['Cat', 'Person', 'Dog']),
      [{ label: 'Person', kind: CompletionItemKind.TypeParameter }],
    );
  });

  test('Correctly completes RETURN', () => {
    const query = 'CREATE (n:Person) RET';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Type relationship auto-completion', () => {
  test('Correctly completes relationship type', () => {
    const query = 'MATCH (n)-[r:R';
    const position = Position.create(0, query.length);

    testCompletionContains(
      query,
      position,
      new MockDbInfo([], ['RelationshipType']),
      [{ label: 'RelationshipType', kind: CompletionItemKind.TypeParameter }],
    );
  });
});

describe('Procedures auto-completion', () => {
  test('Correctly completes CALL in standalone', () => {
    const query = 'C';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'CALL', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes CALL in subquery', () => {
    const query = 'MATCH (n) C';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'CALL', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes procedure name in CALL', () => {
    const query = 'CALL db';
    const position = Position.create(0, query.length);

    testCompletionContains(
      query,
      position,
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
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
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
    const position = Position.create(0, query.length);

    testCompletionContains(
      query,
      position,
      new MockDbInfo([], [], new Map(), new Map(functionSignatures)),
      [
        { label: 'xx.yy.proc', kind: CompletionItemKind.Function },
        { label: 'xx.yy.procedure', kind: CompletionItemKind.Function },
      ],
    );
  });

  test('Correctly completes function name in right hand side of WHERE', () => {
    const query = 'MATCH (n) WHERE n.name = xx.yy';
    const position = Position.create(0, query.length);

    testCompletionContains(
      query,
      position,
      new MockDbInfo([], [], new Map(), new Map(functionSignatures)),
      [
        { label: 'xx.yy.proc', kind: CompletionItemKind.Function },
        { label: 'xx.yy.procedure', kind: CompletionItemKind.Function },
      ],
    );
  });

  test('Correctly completes function name in RETURN', () => {
    const query = 'RETURN xx.yy';
    const position = Position.create(0, query.length);

    testCompletionContains(
      query,
      position,
      new MockDbInfo([], [], new Map(), new Map(functionSignatures)),
      [
        { label: 'xx.yy.proc', kind: CompletionItemKind.Function },
        { label: 'xx.yy.procedure', kind: CompletionItemKind.Function },
      ],
    );
  });

  test('Correctly completes function name in an AND', () => {
    const query = 'RETURN true AND xx.yy';
    const position = Position.create(0, query.length);

    testCompletionContains(
      query,
      position,
      new MockDbInfo([], [], new Map(), new Map(functionSignatures)),
      [
        { label: 'xx.yy.proc', kind: CompletionItemKind.Function },
        { label: 'xx.yy.procedure', kind: CompletionItemKind.Function },
      ],
    );
  });
});

describe('Misc auto-completion', () => {
  test('Correctly completes RETURN', () => {
    const query = 'RET';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes DISTINCT', () => {
    const query = 'MATCH (n:Person)-[r:KNOWS]-(m:Person) RETURN ';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'DISTINCT', kind: CompletionItemKind.Keyword },
    ]);

    testCompletionDoesNotContain(query, position, new MockDbInfo(), [
      { label: 'STRING_LITERAL1', kind: CompletionItemKind.Keyword },
      { label: 'STRING_LITERAL2', kind: CompletionItemKind.Keyword },
      { label: 'INF SET', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes MATCH in multiline statement', () => {
    const query = `CALL dbms.info() YIELD *;
M`;
    const position = Position.create(1, 1);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Inserts correct text when symbolic name is not display name', () => {
  test('Inserts correct text for LIMIT', () => {
    const query = 'RETURN 1 L';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'LIMIT', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Inserts correct text for SKIP', () => {
    const query = 'RETURN 1 S';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'SKIP', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Inserts correct text for shortestPath', () => {
    const query = 'MATCH s';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'shortestPath', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Inserts correct text for allShortestPath', () => {
    const query = 'MATCH a';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'allShortestPaths', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Auto-completion works correctly inside pattern comprehensions', () => {
  test.skip('Correctly completes keywords inside pattern comprehensions', () => {
    const query = "MATCH (a:Person {name: 'Andy'}) RETURN [(a)-->(b W";
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Auto-completion works correctly inside nodes and relationship patterns', () => {
  test('Correctly completes keywords inside relationship pattern', () => {
    const query = 'WITH 2000 AS minYear MATCH (a:Person)-[r:KNOWS ';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes keywords inside relationship pattern with starting hint', () => {
    const query = 'WITH 2000 AS minYear MATCH (a:Person)-[r:KNOWS W';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes keywords inside a node pattern', () => {
    const query = 'WITH 2000 AS minYear MATCH (a ';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Auto completion of back to back keywords', () => {
  test('Correctly completes OPTIONAL MATCH', () => {
    const query = 'OP';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'OPTIONAL MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes DEFAULT DATABASE and HOME DATABASE', () => {
    const query = 'SHOW ';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'DATABASE', kind: CompletionItemKind.Keyword },
      { label: 'DEFAULT DATABASE', kind: CompletionItemKind.Keyword },
      { label: 'HOME DATABASE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes UNION and UNION ALL', () => {
    const query =
      'MATCH (a:Person)-[:KNOWS]->(b:Person) RETURN b.name AS name ';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'UNION', kind: CompletionItemKind.Keyword },
      { label: 'UNION ALL', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes LOAD CSV', () => {
    const query = 'L';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'LOAD CSV', kind: CompletionItemKind.Keyword },
    ]);

    testCompletionDoesNotContain(query, position, new MockDbInfo(), [
      { label: 'LOAD CSV WITH', kind: CompletionItemKind.Keyword },
      { label: 'LOAD CSV WITH HEADERS', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes WITH HEADERS in LOAD CSV', () => {
    const query = 'LOAD CSV ';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'WITH HEADERS', kind: CompletionItemKind.Keyword },
    ]);

    testCompletionDoesNotContain(query, position, new MockDbInfo(), [
      { label: 'WITH HEADERS FROM', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes WITH HEADERS in LOAD CSV', () => {
    const query = 'LOAD CSV WITH ';
    const position = Position.create(0, query.length);

    testCompletionContains(query, position, new MockDbInfo(), [
      { label: 'HEADERS', kind: CompletionItemKind.Keyword },
    ]);

    testCompletionDoesNotContain(query, position, new MockDbInfo(), [
      { label: 'HEADERS FROM', kind: CompletionItemKind.Keyword },
    ]);
  });
});
