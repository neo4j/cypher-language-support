import type { CypherFragmentKind } from '@neo4j-cypher/language-support';
import {
  cypherFragmentKinds,
  CypherLanguageService,
} from '@neo4j-cypher/language-support';
import { expect, test } from 'vitest';
import { tokenizeFragment } from './hover';
import type { CypherConfig } from '../langCypher';

const cfg: CypherConfig = {
  languageService: new CypherLanguageService(),
  useLightVersion: false,
};

function getTokenTypes(code: string, kind: CypherFragmentKind) {
  return tokenizeFragment(cfg, code, kind).map(({ start, end, tokenType }) => ({
    token: code.slice(start, end),
    tokenType,
  }));
}

test('colours a label expression fragment like the editor does', () => {
  expect(getTokenTypes('(Person | !Pet)', 'labelExpression')).toEqual([
    { token: '(', tokenType: 'bracket' },
    { token: 'Person', tokenType: 'label' },
    { token: '|', tokenType: 'operator' },
    { token: '!', tokenType: 'operator' },
    { token: 'Pet', tokenType: 'label' },
    { token: ')', tokenType: 'bracket' },
  ]);

  expect(getTokenTypes('KNOWS', 'labelExpression')).toEqual([
    { token: 'KNOWS', tokenType: 'label' },
  ]);
});

test('colours a function signature fragment like the editor does', () => {
  expect(
    getTokenTypes('abs(input :: INTEGER | FLOAT) :: INTEGER', 'function'),
  ).toEqual([
    { token: 'abs', tokenType: 'function' },
    { token: '(', tokenType: 'bracket' },
    { token: 'input', tokenType: 'variable' },
    { token: '::', tokenType: 'operator' },
    { token: 'INTEGER', tokenType: 'keyword' },
    { token: '|', tokenType: 'operator' },
    { token: 'FLOAT', tokenType: 'keyword' },
    { token: ')', tokenType: 'bracket' },
    { token: '::', tokenType: 'operator' },
    { token: 'INTEGER', tokenType: 'keyword' },
  ]);
});

test('colours a procedure signature fragment like the editor does', () => {
  expect(getTokenTypes('db.labels()', 'procedure')).toEqual([
    { token: 'db', tokenType: 'procedure' },
    { token: '.', tokenType: 'operator' },
    { token: 'labels', tokenType: 'procedure' },
    { token: '(', tokenType: 'bracket' },
    { token: ')', tokenType: 'bracket' },
  ]);
});

test('drops the tokens of the surrounding context', () => {
  cypherFragmentKinds.forEach((kind) => {
    const code = 'Person';
    const ranges = tokenizeFragment(cfg, code, kind);
    expect(
      ranges.every(({ start, end }) => start >= 0 && end <= code.length),
    ).toBe(true);
    expect(
      ranges.map(({ start, end }) => code.slice(start, end)).join(''),
    ).toBe(code);
  });
});
