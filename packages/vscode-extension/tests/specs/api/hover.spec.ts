import { testData } from '@neo4j-cypher/language-support';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, newUntitledFileWithContent } from '../../helpers';

suite('Hover spec', () => {
  const absFunction = testData.mockSchema.functions['CYPHER 5']['abs'];
  const expectedHoverInfo = [
    '```cypher',
    absFunction.signature,
    '```',
    absFunction.description,
    '',
    '**Parameters**',
    `- \`${absFunction.argumentDescription[0].name}\` - ${absFunction.argumentDescription[0].description}`,
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
      const signatureHelp: vscode.SignatureHelp =
        await vscode.commands.executeCommand(
          'vscode.executeSignatureHelpProvider',
          document.uri,
          new vscode.Position(0, 11),
        );

      assert.equal(
        signatureHelp.signatures.some(
          (signature) => signature.label === 'abs(input :: INTEGER | FLOAT)',
        ),
        true,
      );
    });

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
