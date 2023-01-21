import {
  CompletionItem,
  CompletionItemKind,
  Position,
  SignatureInformation,
} from 'vscode-languageserver/node';
import { autoCompleteQuery } from '../autocompletion';
import { DbInfo } from '../dbInfo';

class TestDbInfo implements DbInfo {
  procedureSignatures: Map<string, SignatureInformation> = new Map();
  functionSignatures: Map<string, SignatureInformation> = new Map();
  labels: string[] = [];
}

export async function testCompletion(
  fileText: string,
  position: Position,
  dbInfo: DbInfo,
  expected: CompletionItem[],
) {
  // Executing the command `vscode.executeCompletionItemProvider` to simulate triggering completion
  const actualCompletionList = autoCompleteQuery(fileText, position, dbInfo);

  expect(actualCompletionList.length >= 2);

  expected.forEach((expectedItem, i) => {
    const actualItem = actualCompletionList[i];
    expect(actualItem.kind).toEqual(expectedItem.kind);
    expect(actualItem.label).toEqual(expectedItem.label);
  });
}

describe('Auto-completion', () => {
  test('Correctly completes MATCH', async () => {
    const query = 'M';

    await testCompletion(query, Position.create(0, 1), new TestDbInfo(), [
      { label: 'OPTIONAL', kind: CompletionItemKind.Keyword },
      { label: 'MATCH', kind: CompletionItemKind.Keyword },
      { label: 'UNWIND', kind: CompletionItemKind.Keyword },
      { label: 'CALL', kind: CompletionItemKind.Keyword },
      { label: 'RETURN', kind: CompletionItemKind.Keyword },
    ]);
  });
});
