import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, getDocumentUri, openDocument } from '../../../helpers.js';

type InclusionTestArgs = {
  textFile: string | vscode.Uri;
  position: vscode.Position;
  expectedOffset: number;
  variableLength: number;
};
// Note position should be zero-based lines/cols
export async function testGoToArrives({
  textFile,
  position,
  expectedOffset,
  variableLength,
}: InclusionTestArgs): Promise<void> {
  let docUri: vscode.Uri;
  if (typeof textFile === 'string') {
    docUri = getDocumentUri(textFile);
    await openDocument(docUri);
  } else {
    docUri = textFile;
  }

  const activeDoc = vscode.window.activeTextEditor.document;
  const expectedStop = activeDoc.positionAt(expectedOffset + variableLength);
  const expectedStart = activeDoc.positionAt(expectedOffset);

  const range = new vscode.Range(expectedStart, expectedStop);

  await eventually(async () => {
    const actualLocation: vscode.Location[] =
      await vscode.commands.executeCommand(
        'vscode.executeDefinitionProvider',
        docUri,
        position,
      );
    assert.equal(actualLocation.length, 1);
    assert.deepEqual(actualLocation[0].range, range);
  });
}

suite('Go to definition spec', () => {
  test('Handles variable', async () => {
    const position = new vscode.Position(0, 26);

    const expectedOffset = 8;
    const variableLength = 1;
    await testGoToArrives({
      textFile: 'valid.cypher',
      position,
      expectedOffset,
      variableLength,
    });
  });

  test('Handles multi-statement variable', async () => {
    const position = new vscode.Position(2, 17);

    const expectedOffset = 65;
    const variableLength = 1;
    await testGoToArrives({
      textFile: 'multiline.cypher',
      position,
      expectedOffset,
      variableLength,
    });
  });

  test('Handles scope v1', async () => {
    const position = new vscode.Position(3, 10);

    const expectedOffset = 31;
    const variableLength = 1;
    await testGoToArrives({
      textFile: 'subquery-call.cypher',
      position,
      expectedOffset,
      variableLength,
    });
  });

  test('Handles scope v2', async () => {
    const position = new vscode.Position(3, 19);

    const expectedOffset = 22;
    const variableLength = 1;
    await testGoToArrives({
      textFile: 'call-in-transactions.cypher',
      position,
      expectedOffset,
      variableLength,
    });
  });
});
