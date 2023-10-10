import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, getDocumentUri, openDocument } from '../helpers';

type InclusionTestArgs = {
  textFile: string;
  position: vscode.Position;
  expected: vscode.CompletionItem[];
};

export async function testCompletionContains({
  textFile,
  position,
  expected,
}: InclusionTestArgs) {
  const docUri = getDocumentUri(textFile);

  await openDocument(docUri);

  await eventually(async () => {
    const actualCompletionList: vscode.CompletionList =
      await vscode.commands.executeCommand(
        'vscode.executeCompletionItemProvider',
        docUri,
        position,
      );

    expected.forEach((expectedItem) => {
      const found = actualCompletionList.items.find(
        (value) =>
          value.kind === expectedItem.kind &&
          value.label === expectedItem.label,
      );

      assert.equal(found !== undefined, true);
    });
  });
}

suite('Auto completion spec', () => {
  test('Completes MATCH clause with WHERE, CREATE, etc', async () => {
    const position = new vscode.Position(0, 10);

    const expected: vscode.CompletionItem[] = [
      { label: 'WHERE', kind: vscode.CompletionItemKind.Keyword },
      { label: 'CREATE', kind: vscode.CompletionItemKind.Keyword },
    ];
    await testCompletionContains({
      textFile: 'auto-completion.cypher',
      position: position,
      expected: expected,
    });
  });
});
