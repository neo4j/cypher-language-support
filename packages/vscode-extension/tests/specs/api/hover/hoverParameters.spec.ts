import * as assert from 'assert';
import * as vscode from 'vscode';
import { CONSTANTS } from '../../../../src/constants';
import { eventually, newUntitledFileWithContent } from '../../../helpers';
import { before } from 'mocha';

suite('Hover spec parameters', () => {
  before(async () => {
    await vscode.commands.executeCommand(
      CONSTANTS.COMMANDS.INTERNAL.EVAL_PARAMETER,
      'pokemon',
      '"charmander"',
    );
  });

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

  test('Hover shows the value of a parameter on $-sign', async () => {
    const document = await newUntitledFileWithContent('RETURN $pokemon');

    const character = 7;
    await eventually(async () => {
      const hovers = await getHovers(
        document,
        new vscode.Position(0, character),
      );

      assert.equal(hovers.length, 1);
      const markdown = (hovers[0].contents[0] as vscode.MarkdownString).value;
      assert.equal(
        markdown,
        '`\n$pokemon: String\n`\n\n```cypher\n"charmander"\n```',
      );
    });
  });

  test('Hover shows the value of a parameter on param name', async () => {
    const document = await newUntitledFileWithContent('RETURN $pokemon');

    const character = 10;
    await eventually(async () => {
      const hovers = await getHovers(
        document,
        new vscode.Position(0, character),
      );

      assert.equal(hovers.length, 1);
      const markdown = (hovers[0].contents[0] as vscode.MarkdownString).value;
      assert.equal(
        markdown,
        '`\n$pokemon: String\n`\n\n```cypher\n"charmander"\n```',
      );
    });
  });

  test('Hover shows nothing for an undefined parameter', async () => {
    const document = await newUntitledFileWithContent('RETURN $notDefined');

    await eventually(async () => {
      const hovers = await getHovers(document, new vscode.Position(0, 10));
      assert.equal(hovers.length, 0);
    });
  });
});
