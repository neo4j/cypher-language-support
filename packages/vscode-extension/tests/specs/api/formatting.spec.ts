import * as assert from 'assert';
import * as vscode from 'vscode';
import { newUntitledFileWithContent } from '../../helpers';

const normalizeLineEndings = (str: string) => str.replace(/\r\n/g, '\n');

suite('Formatting', () => {
  test('tests that formatting document works', async () => {
    const query = `match (p:   Person)  where  p.name = "John Doe" reTUrn p lIMIt 25`;
    const document = await newUntitledFileWithContent(query);
    await vscode.commands.executeCommand('editor.action.formatDocument');
    const formattedText = document.getText();
    const expected = `MATCH (p:Person)
WHERE p.name = "John Doe"
RETURN p
LIMIT 25`;
    assert.equal(
      normalizeLineEndings(formattedText),
      normalizeLineEndings(expected),
    );
  });
});
