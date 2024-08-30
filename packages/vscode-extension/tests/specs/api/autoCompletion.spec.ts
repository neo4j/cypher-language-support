import { testData } from '@neo4j-cypher/language-support';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { CompletionItemTag } from 'vscode-languageclient';
import { eventually, getDocumentUri, openDocument } from '../../helpers';

type InclusionTestArgs = {
  textFile: string;
  position: vscode.Position;
  expected: vscode.CompletionItem[];
};

const { functions, procedures } = testData.mockSchema;

export async function testCompletionContains({
  textFile,
  position,
  expected,
}: InclusionTestArgs) {
  const docUri = getDocumentUri(textFile);

  await openDocument(docUri);

  await eventually(async () => {
    const actualCompletionList: vscode.CompletionList =
      await vscode.commands.executeCommand(
        'vscode.executeCompletionItemProvider',
        docUri,
        position,
      );

    expected.forEach((expectedItem) => {
      const found = actualCompletionList.items.find(
        (value) =>
          value.kind === expectedItem.kind &&
          value.label === expectedItem.label,
      );

      assert.equal(found !== undefined, true);
      assert.equal(found.detail, expectedItem.detail);
      assert.equal(found.documentation, expectedItem.documentation);
      assert.deepStrictEqual(found.tags, expectedItem.tags);
    });
  });
}

suite('Auto completion spec', () => {
  test('Completes allShortestPaths ', async () => {
    const position = new vscode.Position(2, 28);

    const expected: vscode.CompletionItem[] = [
      { label: 'allShortestPaths', kind: vscode.CompletionItemKind.Keyword },
    ];
    await testCompletionContains({
      textFile: 'allShortestPaths-completion.cypher',
      position: position,
      expected: expected,
    });
  });

  test('Completes MATCH clause with WHERE, CREATE, etc', async () => {
    const position = new vscode.Position(0, 10);

    const expected: vscode.CompletionItem[] = [
      { label: 'WHERE', kind: vscode.CompletionItemKind.Keyword },
      { label: 'CREATE', kind: vscode.CompletionItemKind.Keyword },
    ];
    await testCompletionContains({
      textFile: 'auto-completion.cypher',
      position: position,
      expected: expected,
    });
  });

  test('Shows signature help information on auto-completion for procedures', async () => {
    const position = new vscode.Position(0, 18);
    const expected: vscode.CompletionItem[] = [
      {
        label: 'resume',
        kind: vscode.CompletionItemKind.Method,
        detail: '(procedure) ' + procedures['apoc.trigger.resume'].signature,
        documentation: procedures['apoc.trigger.resume'].description,
        tags: [CompletionItemTag.Deprecated],
      },
      {
        label: 'start',
        kind: vscode.CompletionItemKind.Method,
        detail: '(procedure) ' + procedures['apoc.trigger.start'].signature,
        documentation: procedures['apoc.trigger.start'].description,
      },
    ];
    await testCompletionContains({
      textFile: 'procedure-completion.cypher',
      position: position,
      expected: expected,
    });
  });

  test('Shows signature help information on auto-completion for functions', async () => {
    const position = new vscode.Position(0, 19);
    const expected: vscode.CompletionItem[] = [
      {
        label: 'uuid',
        kind: vscode.CompletionItemKind.Function,
        detail: '(function) ' + functions['apoc.create.uuid'].signature,
        documentation: functions['apoc.create.uuid'].description,
        tags: [CompletionItemTag.Deprecated],
      },
      {
        label: 'uuidBase64',
        kind: vscode.CompletionItemKind.Function,
        detail: '(function) ' + functions['apoc.create.uuidBase64'].signature,
        documentation: functions['apoc.create.uuidBase64'].description,
      },
    ];
    await testCompletionContains({
      textFile: 'function-completion.cypher',
      position: position,
      expected: expected,
    });
  });
});
