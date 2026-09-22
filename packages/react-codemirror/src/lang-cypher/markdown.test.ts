// @vitest-environment jsdom

import {
  CypherLanguageService,
  testData,
} from '@neo4j-cypher/language-support';
import { expect, test } from 'vitest';
import { MarkupContent } from 'vscode-languageserver-types';
import { CodeBlockInfo, renderMarkdown } from './markdown';

function codeBlockInfos(markdown: string): [string, CodeBlockInfo][] {
  const seen: [string, CodeBlockInfo][] = [];
  renderMarkdown(markdown, (code, info, target) => {
    seen.push([code, info]);
    target.textContent = code;
  });
  return seen;
}

test('passes the fence language and fragment kind to the highlighter', () => {
  expect(
    codeBlockInfos(
      ['```cypher labelExpression', '(Person | Pet)', '```'].join('\n'),
    ),
  ).toEqual([
    ['(Person | Pet)', { language: 'cypher', extra: 'labelExpression' }],
  ]);
});

test('handles fences without a language or a fragment kind', () => {
  expect(codeBlockInfos(['```cypher', 'RETURN 1', '```'].join('\n'))).toEqual([
    ['RETURN 1', { language: 'cypher', extra: '' }],
  ]);

  expect(codeBlockInfos(['```', 'RETURN 1', '```'].join('\n'))).toEqual([
    ['RETURN 1', { language: '', extra: '' }],
  ]);
});

// The markdown language-support writes for a variable hover
test('renders a variable hover', () => {
  const markdown = [
    '`',
    'n: Node',
    '`',
    '',
    '```cypher labelExpression',
    '(Person | Pet)',
    '```',
  ].join('\n');

  expect(renderMarkdown(markdown).innerHTML).toBe(
    '<p><code>n: Node</code></p><pre><code>(Person | Pet)</code></pre>',
  );
});

// Schema descriptions bring their own bullet lists, written with *
test('renders the bullet lists in a schema description', () => {
  const dom = renderMarkdown(
    [
      "* 'skip' -- to skip the top N results.",
      "* 'limit' -- to limit the number of results returned.",
    ].join('\n'),
  );

  expect(dom.innerHTML).toBe(
    [
      '<ul>',
      "<li>'skip' -- to skip the top N results.</li>",
      "<li>'limit' -- to limit the number of results returned.</li>",
      '</ul>',
    ].join(''),
  );
});

// Schema descriptions are interpolated into the markdown as they are, and
// list values such as 'AS_PATH_LIST', which must not turn into emphasis
test('leaves the underscores inside words alone', () => {
  const description =
    "JSON path options: ('ALWAYS_RETURN_LIST', 'AS_PATH_LIST', 'DEFAULT_PATH_LEAF_TO_NULL').";

  const dom = renderMarkdown(
    ['**Parameters**', `- \`pathOptions\` - ${description}`].join('\n'),
  );

  expect(dom.querySelector('em')).toBeNull();
  expect(dom.querySelector('li').textContent).toBe(
    `pathOptions - ${description}`,
  );
});

function renderMethodHover(query: string): HTMLElement {
  const languageService = new CypherLanguageService();
  const hover = languageService.hoverInfo(query, {
    caretPosition: query.indexOf('(') - 1,
    dbSchema: testData.mockSchema,
  });

  return renderMarkdown((hover.contents as MarkupContent).value);
}

test('renders a function hover', () => {
  expect(renderMethodHover('RETURN toFloat(1)').innerHTML).toBe(
    [
      '<pre><code>toFloat(input :: STRING | INTEGER | FLOAT) :: FLOAT</code></pre>',
      '<p>Converts a <code>STRING</code>, <code>INTEGER</code> or <code>FLOAT</code> value to a <code>FLOAT</code> value.</p>',
      '<p><strong>Parameters</strong></p>',
      '<ul><li><code>input</code> - A value to be converted into a float.</li></ul>',
      '<p><strong>Returns:</strong> <code>FLOAT</code></p>',
    ].join(''),
  );
});

test('renders a procedure hover', () => {
  expect(renderMethodHover('CALL db.labels()').innerHTML).toBe(
    [
      '<pre><code>db.labels() :: (label :: STRING)</code></pre>',
      "<p>List all labels attached to nodes within a database according to the user's access rights. The procedure returns empty results if the user is not authorized to view those labels.</p>",
      '<p><strong>Returns</strong></p>',
      '<ul><li><code>label</code> - A label within the database.</li></ul>',
    ].join(''),
  );
});

test('italicises the deprecation marker of a deprecated method', () => {
  expect(
    renderMethodHover('CYPHER 5 RETURN apoc.create.uuid()').innerHTML,
  ).toContain('<p>(<em>deprecated</em>) Returns a UUID.</p>');
});

// language-support escapes the markdown characters of the schema descriptions
// it interpolates, so that the renderers CommonMark shows them as written
test('renders the characters language-support escapes as text', () => {
  expect(renderMarkdown("(e.g. '\\*:\\*,name=\\*neo4j\\*')").innerHTML).toBe(
    "<p>(e.g. '*:*,name=*neo4j*')</p>",
  );

  expect(renderMarkdown('a \\\\ b').innerHTML).toBe('<p>a \\ b</p>');
});

// An escaped character cannot open markup of its own
test('does not let an escaped backtick open a code span', () => {
  expect(renderMarkdown('a \\` b `c` d').innerHTML).toBe(
    '<p>a ` b <code>c</code> d</p>',
  );
});

test('does not start a list from an escaped asterisk', () => {
  const dom = renderMarkdown('\\* not a bullet');

  expect(dom.querySelector('ul')).toBeNull();
  expect(dom.innerHTML).toBe('<p>* not a bullet</p>');
});

// The end to end proof: the wildcards dbms.queryJmx' descriptions write are
// rendered, both the escaped ones and the ones inside a code span
test('renders the wildcards of a procedure description', () => {
  const html = renderMethodHover('CALL dbms.queryJmx()').innerHTML;

  expect(html).toContain(
    '<p>Query JMX management data by domain and name. For instance, use <code>*:*</code> to find all JMX beans.</p>',
  );
  expect(html).toContain(
    "<li><code>query</code> - A query for MBeans on this MBeanServer (e.g. '*:*,name=*neo4j*' for all metrics in neo4j database).</li>",
  );
  // A backslash of our own would mean the escaping was not undone
  expect(html).not.toContain('\\');
});

// The markup a description does write is not escaped, so it still renders
test('renders the bullet list and the italics of a procedure description', () => {
  const html = renderMethodHover(
    'CALL db.index.fulltext.queryNodes()',
  ).innerHTML;

  expect(html).toContain('Valid <em>key: value</em> pairs');
  expect(html).toContain(
    [
      '<ul>',
      "<li>'skip' -- to skip the top N results.</li>",
      "<li>'limit' -- to limit the number of results returned.</li>",
      "<li>'analyzer' -- to use the specified analyzer as a search analyzer for this query.</li>",
      '</ul>',
    ].join(''),
  );
});

test('renders a parameter that carries its own layout as a code block', () => {
  expect(renderMethodHover('CALL apoc.export.csv.all()').innerHTML).toContain(
    [
      '<ul><li><code>file</code> - The name of the file to which the data will be exported.</li>',
      '<li><code>config</code> -</li></ul>',
      '<pre><code>{\n',
      '        stream = false :: BOOLEAN,\n',
    ].join(''),
  );
});
