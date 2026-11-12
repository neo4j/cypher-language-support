import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, newUntitledFileWithContent } from '../../../helpers';

suite('Hover spec functions', () => {
  function checkHover(hovers: vscode.Hover[]) {
    assert.equal(hovers.length, 1);
    const markdown = (hovers[0].contents[0] as vscode.MarkdownString).value;
    // Only checking markfown structure, as the content comes from the database and may be different across versions
    assert.ok(markdown.startsWith('```cypher\nabs('));
    assert.ok(markdown.includes('**Parameters**'));
    assert.ok(markdown.includes('**Returns:**'));
  }

  test('Hover works for functions', async () => {
    const document = await newUntitledFileWithContent('RETURN abs(5)');
    const position = new vscode.Position(0, 8);

    await eventually(async () => {
      const hovers: vscode.Hover[] = await vscode.commands.executeCommand(
        'vscode.executeHoverProvider',
        document.uri,
        position,
      );
      checkHover(hovers);
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

      checkHover(hovers);
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

      checkHover(hovers);
    });
  });
});
