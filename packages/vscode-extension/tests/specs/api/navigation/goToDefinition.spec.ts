import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, getDocumentUri, openDocument } from '../../../helpers.js';

type InclusionTestArgs = {
  textFile: string;
  position: vscode.Position;
  expectedOffset: number;
  variableLength: number;
};
// Note that position should be zero-based lines/cols
export async function testGoToDefinition({
  textFile,
  position,
  expectedOffset,
  variableLength,
}: InclusionTestArgs): Promise<void> {
  const docUri = getDocumentUri(textFile);
  await openDocument(docUri);

  const activeDoc = vscode.window.activeTextEditor.document;
  const expectedStop = activeDoc.positionAt(expectedOffset + variableLength);
  const expectedStart = activeDoc.positionAt(expectedOffset);

  const expectedRange = new vscode.Range(expectedStart, expectedStop);

  await eventually(async () => {
    const actualLocation: vscode.Location[] =
      await vscode.commands.executeCommand(
        'vscode.executeDefinitionProvider',
        docUri,
        position,
      );
    assert.equal(actualLocation.length, 1);
    assert.deepEqual(actualLocation[0].range, expectedRange);
  });
}

suite('Go to definition spec', () => {
  test('Handles variable', async () => {
    const position = new vscode.Position(0, 26);

    const expectedOffset = 8;
    const variableLength = 1;
    await testGoToDefinition({
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
    await testGoToDefinition({
      textFile: 'multiline.cypher',
      position,
      expectedOffset,
      variableLength,
    });
  });

  test('Handles scope v1', async () => {
    const position = new vscode.Position(3, 10);

    const expectedOffset = 29;
    const variableLength = 1;
    await testGoToDefinition({
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
    await testGoToDefinition({
      textFile: 'call-in-transactions.cypher',
      position,
      expectedOffset,
      variableLength,
    });
  });
});
