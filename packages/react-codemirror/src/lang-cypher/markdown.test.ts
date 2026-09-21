// @vitest-environment jsdom

import { expect, test } from 'vitest';
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

// The markdown language-support writes for a function or procedure hover
test('renders a method hover', () => {
  const markdown = [
    '```cypher function',
    'abs(input :: INTEGER) :: INTEGER',
    '```',
    '(_deprecated_) Returns the absolute value of an `INTEGER`.',
    '',
    '**Parameters**',
    '- `input` - A numeric value.',
    '',
    '**Returns:** `INTEGER`',
  ].join('\n');

  expect(renderMarkdown(markdown).innerHTML).toBe(
    [
      '<pre><code>abs(input :: INTEGER) :: INTEGER</code></pre>',
      '<p>(<em>deprecated</em>) Returns the absolute value of an <code>INTEGER</code>.</p>',
      '<p><strong>Parameters</strong></p>',
      '<ul><li><code>input</code> - A numeric value.</li></ul>',
      '<p><strong>Returns:</strong> <code>INTEGER</code></p>',
    ].join(''),
  );
});
