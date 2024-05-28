import * as assert from 'assert';
import * as vscode from 'vscode';
import type { TextmateToken } from 'vscode-textmate-languageservice';
import TextmateLanguageService from 'vscode-textmate-languageservice';
import { eventually, getDocumentUri, openDocument } from '../helpers';

type InclusionTestArgs = {
  textFile: string;
  expected: TextmateToken[];
};

export async function testSyntaxHighlighting({
  textFile,
  expected,
}: InclusionTestArgs) {
  await eventually(async () => {
    const tokens = await getTokens(textFile);
    process.stdout.write(JSON.stringify(tokens) + '\n');
    console.log(tokens.length.toString());
    assert.deepEqual(tokens, expected);
  });
}

export async function getTokens(textFile: string): Promise<TextmateToken[]> {
  const docUri = getDocumentUri(textFile);

  await openDocument(docUri);

  // const extension = vscode.extensions.getExtension(
  //   'neo4j-extensions.neo4j-for-vscode',
  // );
  // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // const context = await extension.activate();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const lsp = new TextmateLanguageService('markdown');
  const tokenService = await lsp.initTokenService();
  const activeTextDocument = vscode.window.activeTextEditor.document;
  const tokens = tokenService.fetch(activeTextDocument);

  return tokens;
}

suite('Syntax highlighting spec', () => {
  // Note this is wrong, not detecting cypher :(
  test('Correctly highlights cypher statement within Markdown', async () => {
    await testSyntaxHighlighting({
      textFile: 'syntax-highlighting.md',
      expected: [
        {
          startIndex: 0,
          endIndex: 1,
          scopes: [
            'text.html.markdown',
            'markup.heading.markdown',
            'heading.1.markdown',
            'punctuation.definition.heading.markdown',
          ],
          type: 'punctuation.definition.heading.markdown',
          text: '#',
          line: 0,
          level: 0,
        },
        {
          startIndex: 1,
          endIndex: 2,
          scopes: [
            'text.html.markdown',
            'markup.heading.markdown',
            'heading.1.markdown',
          ],
          type: 'heading.1.markdown',
          text: ' ',
          line: 0,
          level: 0,
        },
        {
          startIndex: 2,
          endIndex: 9,
          scopes: [
            'text.html.markdown',
            'markup.heading.markdown',
            'heading.1.markdown',
            'entity.name.section.markdown',
          ],
          type: 'entity.name.section.markdown',
          text: 'Example',
          line: 0,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 1,
          scopes: ['text.html.markdown'],
          type: 'text.html.markdown',
          text: '',
          line: 1,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 3,
          scopes: [
            'text.html.markdown',
            'markup.fenced_code.block.markdown',
            'punctuation.definition.markdown',
          ],
          type: 'punctuation.definition.markdown',
          text: '```',
          line: 2,
          level: 0,
        },
        {
          startIndex: 3,
          endIndex: 10,
          scopes: [
            'text.html.markdown',
            'markup.fenced_code.block.markdown',
            'fenced_code.block.language',
          ],
          type: 'fenced_code.block.language',
          text: 'cypher',
          line: 2,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 45,
          scopes: ['text.html.markdown', 'markup.fenced_code.block.markdown'],
          type: 'markup.fenced_code.block.markdown',
          text: 'MATCH (u1:CommerceUser{user_id:$seller_id}),',
          line: 3,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 47,
          scopes: ['text.html.markdown', 'markup.fenced_code.block.markdown'],
          type: 'markup.fenced_code.block.markdown',
          text: '      (u2:CommerceUser{user_id:$customer_id}),',
          line: 4,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 61,
          scopes: ['text.html.markdown', 'markup.fenced_code.block.markdown'],
          type: 'markup.fenced_code.block.markdown',
          text: '    p = allShortestPaths((u1)-[:PURCHASE*..{{depth}}]->(u2))',
          line: 5,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 15,
          scopes: ['text.html.markdown', 'markup.fenced_code.block.markdown'],
          type: 'markup.fenced_code.block.markdown',
          text: 'WHERE u1 <> u2',
          line: 6,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 5,
          scopes: ['text.html.markdown', 'markup.fenced_code.block.markdown'],
          type: 'markup.fenced_code.block.markdown',
          text: 'WITH',
          line: 7,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 98,
          scopes: ['text.html.markdown', 'markup.fenced_code.block.markdown'],
          type: 'markup.fenced_code.block.markdown',
          text: '    reduce(output = [], n IN relationships(p) | output + n.create_time.epochMillis ) as relsDate,',
          line: 8,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 62,
          scopes: ['text.html.markdown', 'markup.fenced_code.block.markdown'],
          type: 'markup.fenced_code.block.markdown',
          text: '    reduce(output = [], n IN nodes(p) | output + n ) as nodes',
          line: 9,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 1,
          scopes: ['text.html.markdown', 'markup.fenced_code.block.markdown'],
          type: 'markup.fenced_code.block.markdown',
          text: '',
          line: 10,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 23,
          scopes: ['text.html.markdown', 'markup.fenced_code.block.markdown'],
          type: 'markup.fenced_code.block.markdown',
          text: 'RETURN relsDate, nodes',
          line: 11,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 13,
          scopes: ['text.html.markdown', 'markup.fenced_code.block.markdown'],
          type: 'markup.fenced_code.block.markdown',
          text: 'LIMIT $limit',
          line: 12,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 3,
          scopes: [
            'text.html.markdown',
            'markup.fenced_code.block.markdown',
            'punctuation.definition.markdown',
          ],
          type: 'punctuation.definition.markdown',
          text: '```',
          line: 13,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 1,
          scopes: ['text.html.markdown'],
          type: 'text.html.markdown',
          text: '',
          line: 14,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 3,
          scopes: [
            'text.html.markdown',
            'markup.fenced_code.block.markdown',
            'punctuation.definition.markdown',
          ],
          type: 'punctuation.definition.markdown',
          text: '```',
          line: 15,
          level: 0,
        },
        {
          startIndex: 3,
          endIndex: 6,
          scopes: [
            'text.html.markdown',
            'markup.fenced_code.block.markdown',
            'fenced_code.block.language',
          ],
          type: 'fenced_code.block.language',
          text: 'sc',
          line: 15,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 10,
          scopes: ['text.html.markdown', 'markup.fenced_code.block.markdown'],
          type: 'markup.fenced_code.block.markdown',
          text: 'val a = 5',
          line: 16,
          level: 0,
        },
        {
          startIndex: 0,
          endIndex: 3,
          scopes: [
            'text.html.markdown',
            'markup.fenced_code.block.markdown',
            'punctuation.definition.markdown',
          ],
          type: 'punctuation.definition.markdown',
          text: '```',
          line: 17,
          level: 0,
        },
      ],
    });
  });
});
