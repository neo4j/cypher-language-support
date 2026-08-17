import { testData } from '@neo4j-cypher/language-support';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, newUntitledFileWithContent } from '../../helpers';

suite('Hover spec', () => {
  test('Hover works for functions', async () => {
    const document = await newUntitledFileWithContent('RETURN abs(5)');
    const position = new vscode.Position(0, 8);
    const absFunction = testData.mockSchema.functions['CYPHER 5']['abs'];

    await eventually(async () => {
      const hovers: vscode.Hover[] = await vscode.commands.executeCommand(
        'vscode.executeHoverProvider',
        document.uri,
        position,
      );

      assert.equal(hovers.length, 1);

      assert.equal(
        (hovers[0].contents[0] as vscode.MarkdownString).value,
        [
          '```cypher',
          absFunction.signature,
          '```',
          absFunction.description,
          '',
          '**Parameters**',
          `- \`${absFunction.argumentDescription[0].name}\` - ${absFunction.argumentDescription[0].description}`,
          '',
          `**Returns:** \`${absFunction.returnDescription}\``,
        ].join('\n'),
      );
    });
  });
});
