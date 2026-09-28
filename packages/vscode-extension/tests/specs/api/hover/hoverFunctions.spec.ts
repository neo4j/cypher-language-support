import { testData } from '@neo4j-cypher/language-support';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, newUntitledFileWithContent } from '../../../helpers';

suite('Hover spec functions', () => {
  const absFunction = testData.mockSchema.functions['CYPHER 5']['abs'];
  const expectedHoverInfo = [
    '```cypher',
    absFunction.signature,
    '```',
    absFunction.description,
    '',
    '**Parameters**',
    `- \`${absFunction.argumentDescription[0].name}\` - ${absFunction.argumentDescription[0].name} :: ${absFunction.argumentDescription[0].type}`,
    '',
    `**Returns:** \`${absFunction.returnDescription}\``,
  ].join('\n');

  test('Hover works for functions', async () => {
    const document = await newUntitledFileWithContent('RETURN abs(5)');
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

  test('Hover works for functions without parameters', async () => {
    const document = await newUntitledFileWithContent('RETURN abs()');
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

  test('Hover works for incomplete functions parameters along with signature help', async () => {
    const document = await newUntitledFileWithContent('RETURN abs(');
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
