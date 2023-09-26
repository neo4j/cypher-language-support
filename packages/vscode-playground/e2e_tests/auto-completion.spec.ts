/* eslint-disable */
import * as vscode from 'vscode';
import { getDocumentUri, openDocument } from './helpers';
import assert = require('assert');

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

  const actualCompletionList: vscode.CompletionList =
    await vscode.commands.executeCommand(
      'vscode.executeCompletionItemProvider',
      docUri,
      position,
    );

  expected.forEach((expectedItem) => {
    const found = actualCompletionList.items.find(
      (value) =>
        value.kind === expectedItem.kind && value.label === expectedItem.label,
    );

    assert.equal(found !== undefined, true);
  });
}

suite('Auto completion spec', () => {
  test('Completes empty statement with MATCH, CREATE, etc', async () => {
    const position = new vscode.Position(0, 0);

    const expected: vscode.CompletionItem[] = [
      { label: 'MATCH', kind: vscode.CompletionItemKind.Keyword },
      { label: 'CREATE', kind: vscode.CompletionItemKind.Keyword },
    ];
    await testCompletionContains({
      textFile: 'auto-completion.cypher',
      position: position,
      expected: expected,
    });
  });
});
