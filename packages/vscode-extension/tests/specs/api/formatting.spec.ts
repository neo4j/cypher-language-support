import * as assert from 'assert';
import * as vscode from 'vscode';
import { getDocumentUri, openDocument } from '../../helpers';

suite('Formatting', () => {
  test('tests that formatting document works', async () => {
    const textFile = 'unformatted.cypher';
    const docUri = getDocumentUri(textFile);
    const document = await vscode.workspace.openTextDocument(docUri);
    await openDocument(docUri);
    await vscode.commands.executeCommand('editor.action.formatDocument');
    const formattedText = document.getText();
    const expected = `MATCH (p:Person)
WHERE p.name = "John Doe"
RETURN p
LIMIT 25`;
    assert.equal(formattedText, expected);
  });
});
