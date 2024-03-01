import { CompletionItemKind } from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import { testData } from '../testData';
import { testCompletions } from './completionAssertionHelpers';

describe('function invocations', () => {
  const dbSchema: DbSchema = testData.mockSchema;

  test('Correctly completes unstarted function name in left hand side of WHERE', () => {
    const query = 'MATCH (n) WHERE ';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'acos',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
        {
          label: 'apoc',
          kind: CompletionItemKind.Function,
          detail: '(namespace)',
        },
        {
          label: 'apoc.agg.graph',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
        {
          label: 'apoc.coll.pairs',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
      ],
    });
  });

  test('Correctly completes started function name with unfinished namespace', () => {
    const query = 'RETURN gra';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'acos',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
        {
          label: 'apoc.agg.graph',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
        {
          label: 'apoc.coll.pairs',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
      ],
    });
  });

  test('Correctly limits function completions by one namespace', () => {
    const query = 'RETURN apoc.';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'agg',
          kind: CompletionItemKind.Function,
          detail: '(namespace)',
        },
        {
          label: 'coll',
          kind: CompletionItemKind.Function,
          detail: '(namespace)',
        },
      ],
      excluded: [{ label: 'acos', kind: CompletionItemKind.Function }],
    });
  });

  test('Correctly limits function completions by double namespace', () => {
    const query = 'RETURN apoc.agg.';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'first',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
        {
          label: 'last',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
        {
          label: 'slice',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
      ],
      excluded: [
        { label: 'apoc.agg.slice', kind: CompletionItemKind.Function },
        { label: 'apoc.agg.last', kind: CompletionItemKind.Function },
        { label: 'apoc.agg.first', kind: CompletionItemKind.Function },
        { label: 'acos', kind: CompletionItemKind.Function },
        { label: 'apoc.coll.min', kind: CompletionItemKind.Function },
        { label: 'coll.min', kind: CompletionItemKind.Function },
        { label: 'min', kind: CompletionItemKind.Function },
        { label: 'apoc.coll.occurences', kind: CompletionItemKind.Function },
        { label: 'coll.occurences', kind: CompletionItemKind.Function },
        { label: 'occurences', kind: CompletionItemKind.Function },
        { label: 'apoc.bitwise.op', kind: CompletionItemKind.Function },
        { label: 'bitwise.op', kind: CompletionItemKind.Function },
        { label: 'op', kind: CompletionItemKind.Function },
      ],
    });
  });

  test('Correctly completes multiline functions completion', () => {
    const query = `RETURN apoc
                            .agg
                            .`;
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'first',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
        {
          label: 'first',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
        {
          label: 'first',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
      ],
      excluded: [
        { label: 'apoc.agg.slice', kind: CompletionItemKind.Function },
        { label: 'apoc.agg.last', kind: CompletionItemKind.Function },
        { label: 'apoc.agg.first', kind: CompletionItemKind.Function },
        { label: 'acos', kind: CompletionItemKind.Function },
        { label: 'apoc.coll.min', kind: CompletionItemKind.Function },
        { label: 'coll.min', kind: CompletionItemKind.Function },
        { label: 'min', kind: CompletionItemKind.Function },
        { label: 'apoc.coll.occurences', kind: CompletionItemKind.Function },
        { label: 'coll.occurences', kind: CompletionItemKind.Function },
        { label: 'occurences', kind: CompletionItemKind.Function },
        { label: 'apoc.bitwise.op', kind: CompletionItemKind.Function },
        { label: 'bitwise.op', kind: CompletionItemKind.Function },
        { label: 'op', kind: CompletionItemKind.Function },
      ],
    });
  });

  test('Correctly filters out all functions when namespace is incorrect', () => {
    const query = 'RETURN badnamespace.';

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Function }],
    });
  });

  test('Correctly filters out all functions when function name is treated as namespace', () => {
    const query = 'RETURN apoc.agg.last.';

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Function }],
    });
  });

  test('Does not suggest functions when only valid character is dot', () => {
    const query = 'RETURN apoc    ';

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Function }],
    });
  });

  test('Does not suggest functions when only valid character is dot - namespaced edition', () => {
    const query = 'RETURN apoc . coll ';

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Function }],
    });
  });

  test('Allows space after dot in function functions', () => {
    const query = 'RETURN apoc  .  ';

    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'agg',
          kind: CompletionItemKind.Function,
          detail: '(namespace)',
        },
        {
          label: 'coll',
          kind: CompletionItemKind.Function,
          detail: '(namespace)',
        },
      ],
      excluded: [{ label: 'acos', kind: CompletionItemKind.Function }],
    });
  });

  test('Correctly completes function name by namespace in left hand side of WHERE ', () => {
    const query = 'MATCH (n) WHERE apoc.';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'agg',
          kind: CompletionItemKind.Function,
          detail: '(namespace)',
        },
        {
          label: 'coll',
          kind: CompletionItemKind.Function,
          detail: '(namespace)',
        },
      ],
    });
  });

  test('Correctly completes function name in right hand side of WHERE', () => {
    const query = 'MATCH (n) WHERE n.name = fun';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'apoc.agg.percentiles',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
        {
          label: 'acos',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
      ],
    });
  });

  test('Correctly completes function name in an AND', () => {
    const query = 'RETURN true AND f';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'apoc.agg.percentiles',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
        {
          label: 'apoc',
          kind: CompletionItemKind.Function,
          detail: '(namespace)',
        },
        {
          label: 'acos',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
      ],
    });
  });

  test('Handles function with same name as namespace', () => {
    const query = 'RETURN ';
    testCompletions({
      query,
      dbSchema: {
        functions: {
          math: { ...testData.emptyFunction, name: 'math' },
          'math.max': { ...testData.emptyFunction, name: 'math.max' },
        },
      },
      expected: [
        {
          label: 'math',
          kind: CompletionItemKind.Function,
          detail: '(namespace)',
        },
        {
          label: 'math',
          kind: CompletionItemKind.Function,
          detail: '(function)',
        },
      ],
    });
  });
});
