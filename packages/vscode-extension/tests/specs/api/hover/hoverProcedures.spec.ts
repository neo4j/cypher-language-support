import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, newUntitledFileWithContent } from '../../../helpers';

suite('Hover spec procedures', () => {
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

      const markdown = (hovers[0].contents[0] as vscode.MarkdownString).value;
      // Only checking markfown structure, as the content comes from the database and may be different across versions
      assert.ok(markdown.startsWith('```cypher\ndb.labels('));
      assert.ok(markdown.includes('**Returns**'));
    });
  });
});
