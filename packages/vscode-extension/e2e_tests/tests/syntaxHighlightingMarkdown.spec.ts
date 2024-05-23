import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, getDocumentUri, openDocument } from '../helpers';

type InclusionTestArgs = {
  textFile: string;
  expected: { name: string; kind: vscode.SymbolKind }[];
};

export async function testSyntaxHighlighting({
  textFile,
  expected,
}: InclusionTestArgs) {
  await eventually(async () => {
    const tokens = await getTokens(textFile);
    assert.deepEqual(tokens, expected);
  });
}

export async function getTokens(textFile: string) {
  const docUri = getDocumentUri(textFile);

  await openDocument(docUri);

  console.log('antes');
  const tokens: vscode.DocumentSymbol[] = await vscode.commands.executeCommand(
    'vscode.executeDocumentSymbolProvider',
    docUri,
  );

  console.log(tokens);
  return tokens;
}

suite('Cypher in Markdown spec', () => {
  test.only('Correctly highlights cypher statement', async () => {
    await testSyntaxHighlighting({
      textFile: 'syntax-highlighting.md',
      expected: [],
    });
  });
});
