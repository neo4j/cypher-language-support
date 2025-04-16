import { testData } from '@neo4j-cypher/language-support';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { CompletionItemTag } from 'vscode-languageclient';
import { CONSTANTS } from '../../../src/constants';
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
          procedures['CYPHER 5']['apoc.trigger.resume'].signature,
        documentation:
          procedures['CYPHER 5']['apoc.trigger.resume'].description,
        tags: [CompletionItemTag.Deprecated],
      },
      {
        label: 'start',
        kind: vscode.CompletionItemKind.Method,
        detail:
          '(procedure) ' +
          procedures['CYPHER 5']['apoc.trigger.start'].signature,
        documentation: procedures['CYPHER 5']['apoc.trigger.start'].description,
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
          '(function) ' + functions['CYPHER 5']['apoc.create.uuid'].signature,
        documentation: functions['CYPHER 5']['apoc.create.uuid'].description,
        tags: [CompletionItemTag.Deprecated],
      },
      {
        label: 'uuidBase64',
        kind: vscode.CompletionItemKind.Function,
        detail:
          '(function) ' +
          functions['CYPHER 5']['apoc.create.uuidBase64'].signature,
        documentation:
          functions['CYPHER 5']['apoc.create.uuidBase64'].description,
      },
    ];
    await testCompletionContains({
      textFile: 'function-completion.cypher',
      position: position,
      expected: expected,
    });
  });

  test('Completions depends on the Cypher version', async () => {
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
          '(function) ' + functions['CYPHER 5']['apoc.create.uuid'].signature,
        documentation: functions['CYPHER 5']['apoc.create.uuid'].description,
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

  test('Parameters are available in completions', async () => {
    await vscode.commands.executeCommand(
      CONSTANTS.COMMANDS.INTERNAL.EVAL_PARAMETER,
      'a',
      '"charmander"',
    );

    await vscode.commands.executeCommand(
      CONSTANTS.COMMANDS.INTERNAL.EVAL_PARAMETER,
      'b',
      '"pikachu"',
    );
    const textDocument = await newUntitledFileWithContent(`RETURN `);
    const position = new vscode.Position(0, 7);
    const expecations: vscode.CompletionItem[] = [
      {
        label: '$a',
        kind: vscode.CompletionItemKind.Variable,
      },
      {
        label: '$b',
        kind: vscode.CompletionItemKind.Variable,
      },
    ];
    await testCompletionContains({
      textFile: textDocument.uri,
      position: position,
      expected: expecations,
    });
  });

  test('Parameters are backticked correctly', async () => {
    await vscode.commands.executeCommand(
      CONSTANTS.COMMANDS.INTERNAL.EVAL_PARAMETER,
      'some-param',
      '"pikachu"',
    );
    await vscode.commands.executeCommand(
      CONSTANTS.COMMANDS.INTERNAL.EVAL_PARAMETER,
      'someParam',
      '"charmander"',
    );

    const firstDoc = await newUntitledFileWithContent(`RETURN $`);
    await testCompletionContains({
      textFile: firstDoc.uri,
      position: new vscode.Position(0, 8),
      expected: [
        {
          label: '$some-param',
          kind: vscode.CompletionItemKind.Variable,
          insertText: '`some-param`',
        },
        {
          label: '$someParam',
          kind: vscode.CompletionItemKind.Variable,
          insertText: 'someParam',
        },
      ],
    });

    const secondDoc = await newUntitledFileWithContent(`RETURN $some`);
    await testCompletionContains({
      textFile: secondDoc.uri,
      position: new vscode.Position(0, 12),
      expected: [
        {
          label: '$some-param',
          kind: vscode.CompletionItemKind.Variable,
          insertText: '`some-param`',
        },
        {
          label: '$someParam',
          kind: vscode.CompletionItemKind.Variable,
          insertText: 'someParam',
        },
      ],
    });
  });

  test('Parameters are available in completions even when disconnected from neo4j', async () => {
    await vscode.commands.executeCommand(
      CONSTANTS.COMMANDS.INTERNAL.EVAL_PARAMETER,
      'a',
      '"charmander"',
    );

    await vscode.commands.executeCommand(
      CONSTANTS.COMMANDS.INTERNAL.EVAL_PARAMETER,
      'b',
      '"pikachu"',
    );
    await vscode.commands.executeCommand(
      CONSTANTS.COMMANDS.INTERNAL.FORCE_DISCONNECT,
    );
    const textDocument = await newUntitledFileWithContent(`RETURN `);
    const position = new vscode.Position(0, 7);
    const expecations: vscode.CompletionItem[] = [
      {
        label: '$a',
        kind: vscode.CompletionItemKind.Variable,
      },
      {
        label: '$b',
        kind: vscode.CompletionItemKind.Variable,
      },
    ];
    await testCompletionContains({
      textFile: textDocument.uri,
      position: position,
      expected: expecations,
    });

    await vscode.commands.executeCommand(
      CONSTANTS.COMMANDS.INTERNAL.FORCE_CONNECT,
      0,
    );
  });
});
