import {
  CompletionItem,
  CompletionItemKind,
  Position,
  SignatureInformation,
} from 'vscode-languageserver-types';
import { autocomplete } from '../autocompletion/autocompletion';
import { DbInfo } from '../dbInfo';
import { MockDbInfo } from './testHelpers';

export function testAutoCompletionContains(
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

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes OPTIONAL MATCH', () => {
    const query = 'OP';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'OPTIONAL MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes MATCH in OPTIONAL MATCH', () => {
    const query = 'OPTIONAL M';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes label in MATCH', () => {
    const query = 'MATCH (n:P';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(
      query,
      position,
      new MockDbInfo(['Cat', 'Person', 'Dog']),
      [{ label: 'Person', kind: CompletionItemKind.TypeParameter }],
    );
  });

  test('Correctly completes WHERE', () => {
    const query = 'MATCH (n:Person) W';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes RETURN', () => {
    const query = 'MATCH (n:Person) WHERE n.name = "foo" R';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes simple RETURN', () => {
    const query = 'MATCH (n) R';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(query, position, new MockDbInfo(), [
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

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'AS', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('CREATE auto-completion', () => {
  test('Correctly completes CREATE', () => {
    const query = 'CR';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'CREATE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes label in CREATE', () => {
    const query = 'CREATE (n:P';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(
      query,
      position,
      new MockDbInfo(['Cat', 'Person', 'Dog']),
      [{ label: 'Person', kind: CompletionItemKind.TypeParameter }],
    );
  });

  test('Correctly completes RETURN', () => {
    const query = 'CREATE (n:Person) RET';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Type relationship auto-completion', () => {
  test('Correctly completes relationship type', () => {
    const query = 'MATCH (n)-[r:R';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(
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

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'CALL', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes CALL in subquery', () => {
    const query = 'MATCH (n) C';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'CALL', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes procedure name in CALL', () => {
    const query = 'CALL db';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(
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

    testAutoCompletionContains(query, position, new MockDbInfo(), [
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

    testAutoCompletionContains(
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

    testAutoCompletionContains(
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

    testAutoCompletionContains(
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

    testAutoCompletionContains(
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

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes MATCH in multiline statement', () => {
    const query = `CALL dbms.info() YIELD *;
M`;
    const position = Position.create(1, 1);

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Inserts correct text when symbolic name is not display name', () => {
  test('Inserts correct text for LIMIT', () => {
    const query = 'RETURN 1 L';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'LIMIT', kind: CompletionItemKind.Keyword },
    ]);
  });
  test('Inserts correct text for SKIP', () => {
    const query = 'RETURN 1 S';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'SKIP', kind: CompletionItemKind.Keyword },
    ]);
  });
  test('Inserts correct text for shortestPath', () => {
    const query = 'MATCH s';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'shortestPath', kind: CompletionItemKind.Keyword },
    ]);
  });
  test('Inserts correct text for allShortestPath', () => {
    const query = 'MATCH a';
    const position = Position.create(0, query.length);

    testAutoCompletionContains(query, position, new MockDbInfo(), [
      { label: 'allShortestPaths', kind: CompletionItemKind.Keyword },
    ]);
  });
});
