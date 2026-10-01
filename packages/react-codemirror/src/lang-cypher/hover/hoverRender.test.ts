// @vitest-environment jsdom

import type { HoverInfo } from '@neo4j-cypher/language-support';
import {
  CypherLanguageService,
  testData,
} from '@neo4j-cypher/language-support';
import { describe, expect, test } from 'vitest';
import type { CypherFragmentKind } from './hoverRender';
import { renderHoverInfo } from './hoverRender';

function methodHover(query: string): HoverInfo {
  const languageService = new CypherLanguageService();
  return languageService.hoverInfo(query, {
    caretPosition: query.indexOf('(') - 1,
    dbSchema: testData.mockSchema,
  });
}

function renderMethodHover(query: string): HTMLElement {
  return renderHoverInfo(methodHover(query));
}

describe('hover info html rendering', () => {
  function highlightedFragments(
    info: HoverInfo,
  ): [string, CypherFragmentKind][] {
    const seen: [string, CypherFragmentKind][] = [];
    renderHoverInfo(info, (code, kind, target) => {
      seen.push([code, kind]);
      target.textContent = code;
    });
    return seen;
  }

  test('passes the fragment kind of each cypher block to the highlighter', () => {
    expect(
      highlightedFragments({
        kind: 'variable',
        variable: 'n',
        types: ['Node'],
        labelExpression: '(Person | Pet)',
      }),
    ).toEqual([['(Person | Pet)', 'labelExpression']]);

    expect(highlightedFragments(methodHover('RETURN abs(1)'))).toEqual([
      ['abs(input :: INTEGER | FLOAT) :: INTEGER | FLOAT', 'function'],
    ]);

    expect(highlightedFragments(methodHover('CALL db.labels()'))).toEqual([
      ['db.labels() :: (label :: STRING)', 'procedure'],
    ]);
  });

  test('renders a variable hover', () => {
    expect(
      renderHoverInfo({
        kind: 'variable',
        variable: 'n',
        types: ['Node'],
        labelExpression: '(Person | Pet)',
      }).innerHTML,
    ).toBe('<p><code>n: Node</code></p><pre><code>(Person | Pet)</code></pre>');

    expect(
      renderHoverInfo({ kind: 'variable', variable: 'x', types: ['Integer'] })
        .innerHTML,
    ).toBe('<p><code>x: Integer</code></p>');
  });

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

  // The wildcards of dbms.queryJmx' descriptions are shown as written, both
  // in prose and inside a code span
  test('renders the wildcards of a procedure description', () => {
    const html = renderMethodHover('CALL dbms.queryJmx()').innerHTML;

    expect(html).toContain(
      '<p>Query JMX management data by domain and name. For instance, use <code>*:*</code> to find all JMX beans.</p>',
    );
    expect(html).toContain(
      "<li><code>query</code> - A query for MBeans on this MBeanServer (e.g. '*:*,name=*neo4j*' for all metrics in neo4j database).</li>",
    );
  });

  test('renders the paragraphs, bullet list and italics of a procedure description', () => {
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
        '<p>The <code>options</code> map and any of the keys are optional.',
      ].join(''),
    );
  });

  test('renders a parameter that carries its own layout as a code block', () => {
    expect(renderMethodHover('CALL apoc.export.csv.all()').innerHTML).toContain(
      [
        '<ul><li><code>file</code> - The name of the file to which the data will be exported.</li>',
        '<li><code>config</code> -<pre><code>{\n',
        '        stream = false :: BOOLEAN,\n',
      ].join(''),
    );
  });

  // Schema descriptions list values such as 'AS_PATH_LIST', which must not
  // turn into emphasis
  test('leaves the underscores inside words alone', () => {
    const description =
      "JSON path options: ('ALWAYS_RETURN_LIST', 'AS_PATH_LIST', 'DEFAULT_PATH_LEAF_TO_NULL').";

    const dom = renderHoverInfo({
      kind: 'function',
      signature: 'f(pathOptions :: LIST<STRING>) :: ANY',
      description: '',
      isDeprecated: false,
      parameters: [{ name: 'pathOptions', description }],
      returnType: 'ANY',
    });

    expect(dom.querySelector('em')).toBeNull();
    expect(dom.querySelector('li').textContent).toBe(
      `pathOptions - ${description}`,
    );
  });

  test('never renders descriptions as html', () => {
    const dom = renderHoverInfo({
      kind: 'procedure',
      signature: 'p()',
      description: '<img src=x onerror=alert(1)>',
      isDeprecated: false,
      parameters: [],
      returnValues: [{ name: 'r', description: '<b>bold</b>' }],
    });

    expect(dom.querySelector('img')).toBeNull();
    expect(dom.querySelector('b')).toBeNull();
    expect(dom.textContent).toContain('<img src=x onerror=alert(1)>');
  });
});
