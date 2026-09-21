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
