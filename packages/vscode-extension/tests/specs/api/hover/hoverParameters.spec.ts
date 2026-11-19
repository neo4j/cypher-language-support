import * as assert from 'assert';
import * as vscode from 'vscode';
import { CONSTANTS } from '../../../../src/constants';
import { eventually, newUntitledFileWithContent } from '../../../helpers';

suite('Hover spec parameters', () => {
  async function getHovers(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): Promise<vscode.Hover[]> {
    return await vscode.commands.executeCommand(
      'vscode.executeHoverProvider',
      document.uri,
      position,
    );
  }

  test('Hover shows the value of a parameter', async () => {
    await vscode.commands.executeCommand(
      CONSTANTS.COMMANDS.INTERNAL.EVAL_PARAMETER,
      'pokemon',
      '"charmander"',
    );
    const document = await newUntitledFileWithContent('RETURN $pokemon');

    // Both on the $ and inside the parameter name
    for (const character of [7, 10]) {
      await eventually(async () => {
        const hovers = await getHovers(
          document,
          new vscode.Position(0, character),
        );

        assert.equal(hovers.length, 1);
        const markdown = (hovers[0].contents[0] as vscode.MarkdownString).value;
        assert.equal(markdown, 'pokemon: \n```cypher\n"charmander"\n```');
      });
    }
  });

  test('Hover shows nothing for an undefined parameter', async () => {
    const document = await newUntitledFileWithContent('RETURN $notDefined');

    await eventually(async () => {
      const hovers = await getHovers(document, new vscode.Position(0, 10));
      assert.equal(hovers.length, 0);
    });
  });
});
