import {
  CompletionItem,
  CompletionItemKind,
  Position,
  SignatureInformation,
} from 'vscode-languageserver/node';
import { autoCompleteQuery } from '../autocompletion';
import { DbInfo } from '../dbInfo';

class MockDbInfo implements DbInfo {
  procedureSignatures: Map<string, SignatureInformation>;
  functionSignatures: Map<string, SignatureInformation>;
  labels: string[];

  constructor(
    labels: string[] = [],
    procedureSignatures: Map<string, SignatureInformation> = new Map(),
    functionSignatures: Map<string, SignatureInformation> = new Map(),
  ) {
    this.labels = labels;
    this.procedureSignatures = procedureSignatures;
    this.functionSignatures = functionSignatures;
  }
}

export async function testCompletion(
  fileText: string,
  position: Position,
  dbInfo: DbInfo,
  expected: CompletionItem[],
) {
  const actualCompletionList = autoCompleteQuery(fileText, position, dbInfo);

  expected.forEach((expectedItem, i) => {
    const elementFound = actualCompletionList.find(
      (value, j, _) =>
        value.kind == expectedItem.kind && value.label == expectedItem.label,
    );
    expect(elementFound).toBeDefined();
  });
}

describe('MATCH auto-completion', () => {
  test('Correctly completes MATCH', async () => {
    const query = 'M';
    const position = Position.create(0, query.length);

    await testCompletion(query, position, new MockDbInfo(), [
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes OPTIONAL', async () => {
    const query = 'OP';
    const position = Position.create(0, query.length);

    await testCompletion(query, position, new MockDbInfo(), [
      { label: 'OPTIONAL', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes OPTIONAL MATCH', async () => {
    const query = 'OPTIONAL M';
    const position = Position.create(0, query.length);

    await testCompletion(query, position, new MockDbInfo(), [
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes label in MATCH', async () => {
    const query = 'MATCH (n:P';
    const position = Position.create(0, query.length);

    await testCompletion(
      query,
      position,
      new MockDbInfo(['Cat', 'Person', 'Dog']),
      [{ label: 'Person', kind: CompletionItemKind.TypeParameter }],
    );
  });

  test('Correctly completes WHERE', async () => {
    const query = 'MATCH (n:Person) W';
    const position = Position.create(0, query.length);

    await testCompletion(query, position, new MockDbInfo(), [
      { label: 'WHERE', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes RETURN', async () => {
    const query = 'MATCH (n:Person) WHERE n.name = "foo" R';
    const position = Position.create(0, query.length);

    await testCompletion(query, position, new MockDbInfo(), [
      { label: 'OPTIONAL', kind: CompletionItemKind.Keyword },
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
      { label: 'UNWIND', kind: CompletionItemKind.Keyword },
      { label: 'CALL', kind: CompletionItemKind.Keyword },
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Procedures auto-completion', () => {
  test('Correctly completes CALL', async () => {
    const query = 'C';
    const position = Position.create(0, query.length);

    await testCompletion(query, position, new MockDbInfo(), [
      { label: 'CALL', kind: CompletionItemKind.Keyword },
    ]);
  });

  test('Correctly completes procedure name in CALL', async () => {
    const query = 'CALL db';
    const position = Position.create(0, query.length);

    await testCompletion(
      query,
      position,
      new MockDbInfo(
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

  test('Correctly completes YIELD', async () => {
    const query = 'CALL proc() Y';
    const position = Position.create(0, query.length);

    await testCompletion(query, position, new MockDbInfo(), [
      { label: 'YIELD', kind: CompletionItemKind.Keyword },
    ]);
  });
});

describe('Misc auto-completion', () => {
  test('Correctly completes RETURN', async () => {
    const query = 'RET';
    const position = Position.create(0, query.length);

    await testCompletion(query, position, new MockDbInfo(), [
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });
});
