import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, getDocumentUri, openDocument } from '../../helpers';

type InclusionTestArgs = {
  textFile: string;
  expected: number[];
};

export async function testSyntaxHighlighting({
  textFile,
  expected,
}: InclusionTestArgs) {
  await eventually(async () => {
    const semanticTokens = await getSemanticTokens(textFile);
    assert.deepEqual(semanticTokens.data, Uint32Array.from(expected));
  });
}

export async function getSemanticTokens(textFile: string) {
  const docUri = getDocumentUri(textFile);

  await openDocument(docUri);

  const semanticTokens: vscode.SemanticTokens =
    await vscode.commands.executeCommand(
      'vscode.provideDocumentSemanticTokens',
      docUri,
    );

  return semanticTokens;
}

suite('Syntax highlighting spec', () => {
  test('Correctly highlights cypher statement', async () => {
    await testSyntaxHighlighting({
      textFile: 'syntax-highlighting.cypher',
      expected: [
        0, 0, 5, 15, 0, 0, 7, 2, 8, 0, 0, 2, 1, 21, 0, 0, 1, 12, 1, 0, 0, 13, 7,
        9, 0, 0, 7, 1, 21, 0, 0, 1, 1, 0, 0, 0, 1, 9, 7, 0, 0, 11, 1, 21, 0, 1,
        7, 2, 8, 0, 0, 2, 1, 21, 0, 0, 1, 12, 1, 0, 0, 13, 7, 9, 0, 0, 7, 1, 21,
        0, 0, 1, 1, 0, 0, 0, 1, 11, 7, 0, 0, 13, 1, 21, 0, 1, 4, 1, 8, 0, 0, 2,
        1, 21, 0, 0, 2, 16, 15, 0, 0, 18, 2, 8, 0, 0, 3, 1, 21, 0, 0, 2, 1, 21,
        0, 0, 1, 8, 1, 0, 0, 8, 1, 21, 0, 0, 1, 2, 21, 0, 0, 4, 5, 9, 0, 0, 8,
        1, 21, 0, 0, 1, 1, 21, 0, 0, 2, 2, 8, 0, 1, 0, 5, 15, 0, 0, 6, 2, 8, 0,
        0, 3, 2, 21, 0, 0, 3, 2, 8, 0, 1, 0, 4, 15, 0, 1, 4, 6, 12, 0, 0, 7, 6,
        8, 0, 0, 7, 1, 21, 0, 0, 4, 1, 21, 0, 0, 2, 1, 8, 0, 0, 2, 2, 15, 0, 0,
        17, 1, 8, 0, 0, 3, 1, 21, 0, 0, 2, 6, 8, 0, 0, 7, 1, 21, 0, 0, 2, 1, 8,
        0, 0, 1, 1, 21, 0, 0, 1, 11, 9, 0, 0, 11, 1, 21, 0, 0, 1, 11, 9, 0, 0,
        14, 2, 15, 0, 0, 3, 8, 8, 0, 0, 8, 1, 21, 0, 1, 4, 6, 12, 0, 0, 7, 6, 8,
        0, 0, 7, 1, 21, 0, 0, 4, 1, 21, 0, 0, 2, 1, 8, 0, 0, 2, 2, 15, 0, 0, 9,
        1, 8, 0, 0, 3, 1, 21, 0, 0, 2, 6, 8, 0, 0, 7, 1, 21, 0, 0, 2, 1, 8, 0,
        0, 4, 2, 15, 0, 0, 3, 5, 8, 0, 2, 0, 6, 15, 0, 0, 7, 8, 8, 0, 0, 8, 1,
        21, 0, 0, 2, 5, 8, 0, 1, 0, 5, 15, 0, 0, 6, 1, 0, 0, 0, 1, 5, 7, 0,
      ],
    });
  });
});
