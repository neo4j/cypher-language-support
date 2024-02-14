import { CompletionItemKind } from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import { testCompletions } from './completionAssertionHelpers';

describe('function invocations', () => {
  const dbSchema: DbSchema = {
    functionSignatures: {
      abs: { label: 'abs' },
      acos: { label: 'acos' },
      all: { label: 'all' },
      any: { label: 'any' },
      'apoc.agg.first': { label: 'apoc.agg.first' },
      'apoc.agg.graph': { label: 'apoc.agg.graph' },
      'apoc.agg.last': { label: 'apoc.agg.last' },
      'apoc.agg.maxItems': { label: 'apoc.agg.maxItems' },
      'apoc.agg.median': { label: 'apoc.agg.median' },
      'apoc.agg.minItems': { label: 'apoc.agg.minItems' },
      'apoc.agg.nth': { label: 'apoc.agg.nth' },
      'apoc.agg.percentiles': { label: 'apoc.agg.percentiles' },
      'apoc.agg.product': { label: 'apoc.agg.product' },
      'apoc.agg.slice': { label: 'apoc.agg.slice' },
      'apoc.agg.statistics': { label: 'apoc.agg.statistics' },
      'apoc.any.isDeleted': { label: 'apoc.any.isDeleted' },
      'apoc.any.properties': { label: 'apoc.any.properties' },
      'apoc.any.property': { label: 'apoc.any.property' },
      'apoc.any.rebind': { label: 'apoc.any.rebind' },
      'apoc.bitwise.op': { label: 'apoc.bitwise.op' },
      'apoc.coll.avg': { label: 'apoc.coll.avg' },
      'apoc.coll.avgDuration': { label: 'apoc.coll.avgDuration' },
      'apoc.coll.combinations': { label: 'apoc.coll.combinations' },
      'apoc.coll.contains': { label: 'apoc.coll.contains' },
      'apoc.coll.containsAll': { label: 'apoc.coll.containsAll' },
      'apoc.coll.containsAllSorted': { label: 'apoc.coll.containsAllSorted' },
      'apoc.coll.containsDuplicates': { label: 'apoc.coll.containsDuplicates' },
      'apoc.coll.containsSorted': { label: 'apoc.coll.containsSorted' },
      'apoc.coll.duplicates': { label: 'apoc.coll.duplicates' },
      'apoc.coll.fill': { label: 'apoc.coll.fill' },
      'apoc.coll.flatten': { label: 'apoc.coll.flatten' },
      'apoc.coll.frequencies': { label: 'apoc.coll.frequencies' },
      'apoc.coll.frequenciesAsMap': { label: 'apoc.coll.frequenciesAsMap' },
      'apoc.coll.indexOf': { label: 'apoc.coll.indexOf' },
      'apoc.coll.insert': { label: 'apoc.coll.insert' },
      'apoc.coll.insertAll': { label: 'apoc.coll.insertAll' },
      'apoc.coll.intersection': { label: 'apoc.coll.intersection' },
      'apoc.coll.isEqualCollection': { label: 'apoc.coll.isEqualCollection' },
      'apoc.coll.max': { label: 'apoc.coll.max' },
      'apoc.coll.min': { label: 'apoc.coll.min' },
      'apoc.coll.occurrences': { label: 'apoc.coll.occurrences' },
      'apoc.coll.pairs': { label: 'apoc.coll.pairs' },
    },
  };

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
        functionSignatures: {
          math: { label: 'math' },
          'math.max': { label: 'math.max' },
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
