import { testData } from '@neo4j-cypher/language-support';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { CompletionItemTag } from 'vscode-languageclient';
import {
  documentationToString,
  eventually,
  getDocumentUri,
  newUntitledFileWithContent,
  openDocument,
  tagsToString,
} from '../../helpers';

type InclusionTestArgs = {
  textFile: string | vscode.Uri;
  position: vscode.Position;
  expected: vscode.CompletionItem[];
};

const { functions, procedures } = testData.mockSchema;

export async function testCompletionContains({
  textFile,
  position,
  expected,
}: InclusionTestArgs): Promise<void> {
  let docUri: vscode.Uri;
  if (typeof textFile === 'string') {
    docUri = getDocumentUri(textFile);
    await openDocument(docUri);
  } else {
    docUri = textFile;
  }

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

      assert.equal(
        found !== undefined,
        true,
        `Expected item not found by kind and label`,
      );
      assert.equal(
        found.detail,
        expectedItem.detail,
        `Detail does not match. Actual: ${found.detail}, expected: ${expectedItem.detail}`,
      );
      assert.equal(
        found.documentation,
        expectedItem.documentation,
        `Documentation does not match. Actual: ${documentationToString(
          found.documentation,
        )}, expected: ${documentationToString(expectedItem.documentation)}`,
      );
      assert.deepStrictEqual(
        found.tags,
        expectedItem.tags,
        `Tags do not match. Actual: ${tagsToString(
          found.tags,
        )}, expected: ${tagsToString(expectedItem.tags)}`,
      );
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

  test('Completes started property with backticks', async () => {
    const position = new vscode.Position(1, 22);

    const expected: vscode.CompletionItem[] = [
      {
        label: 'foo bar',
        insertText: '`foo bar`',
        kind: vscode.CompletionItemKind.Property,
      },
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
        detail:
          '(procedure) ' +
          procedures['cypher 5']['apoc.trigger.resume'].signature,
        documentation:
          procedures['cypher 5']['apoc.trigger.resume'].description,
        tags: [CompletionItemTag.Deprecated],
      },
      {
        label: 'start',
        kind: vscode.CompletionItemKind.Method,
        detail:
          '(procedure) ' +
          procedures['cypher 5']['apoc.trigger.start'].signature,
        documentation: procedures['cypher 5']['apoc.trigger.start'].description,
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
        detail:
          '(function) ' + functions['cypher 5']['apoc.create.uuid'].signature,
        documentation: functions['cypher 5']['apoc.create.uuid'].description,
        tags: [CompletionItemTag.Deprecated],
      },
      {
        label: 'uuidBase64',
        kind: vscode.CompletionItemKind.Function,
        detail:
          '(function) ' +
          functions['cypher 5']['apoc.create.uuidBase64'].signature,
        documentation:
          functions['cypher 5']['apoc.create.uuidBase64'].description,
      },
    ];
    await testCompletionContains({
      textFile: 'function-completion.cypher',
      position: position,
      expected: expected,
    });
  });

  test('Completions are Cypher version dependant', async () => {
    const textDocument = await newUntitledFileWithContent(`
      CYPHER 5 RETURN ;
      CYPHER 25 RETURN 
    `);
    const cypher5Position = new vscode.Position(1, 22);
    const cypher5Expected: vscode.CompletionItem[] = [
      {
        label: 'apoc.create.uuid',
        kind: vscode.CompletionItemKind.Function,
        detail:
          '(function) ' + functions['cypher 5']['apoc.create.uuid'].signature,
        documentation: functions['cypher 5']['apoc.create.uuid'].description,
        tags: [CompletionItemTag.Deprecated],
      },
    ];
    await testCompletionContains({
      textFile: textDocument.uri,
      position: cypher5Position,
      expected: cypher5Expected,
    });

    const cypher25Position = new vscode.Position(2, 23);

    // TODO Using assert.rejects is not ideal but I couldn't find
    // a procedure that was specifically added in Cypher 25
    // In next apoc releases, apoc.refactor.deleteAndReconnect
    // will be deprecated in Cypher 25, so we could improve this test
    await assert.rejects(
      testCompletionContains({
        textFile: textDocument.uri,
        position: cypher25Position,
        expected: cypher5Expected,
      }),
    );
  });
});
