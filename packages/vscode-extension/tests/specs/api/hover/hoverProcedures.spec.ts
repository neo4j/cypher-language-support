import { testData } from '@neo4j-cypher/language-support';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, newUntitledFileWithContent } from '../../../helpers';

suite('Hover spec procedures', () => {
  const labelsProcedure =
    testData.mockSchema.procedures['CYPHER 5']['db.labels'];
  const expectedHoverInfo = [
    '```cypher',
    labelsProcedure.signature,
    '```',
    labelsProcedure.description,
    '',
    '',
    '**Returns**',
    `- \`${labelsProcedure.returnDescription[0].name}\` - ${labelsProcedure.returnDescription[0].name} :: ${labelsProcedure.returnDescription[0].type}`,
  ].join('\n');

  test('Hover works for procedures', async () => {
    const document = await newUntitledFileWithContent('CALL db.labels()');
    const position = new vscode.Position(0, 8);

    await eventually(async () => {
      const hovers: vscode.Hover[] = await vscode.commands.executeCommand(
        'vscode.executeHoverProvider',
        document.uri,
        position,
      );
      assert.equal(hovers.length, 1);

      assert.equal(
        (hovers[0].contents[0] as vscode.MarkdownString).value,
        expectedHoverInfo,
      );
    });
  });
});
