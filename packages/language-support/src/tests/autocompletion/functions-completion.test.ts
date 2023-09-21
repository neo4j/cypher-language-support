import { CompletionItemKind } from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import {
  testCompletionContains,
  testCompletionDoesNotContain,
} from './completion-assertion-utils';

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
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'acos', kind: CompletionItemKind.Function },
        { label: 'apoc.agg.graph', kind: CompletionItemKind.Function },
        { label: 'apoc.coll.pairs', kind: CompletionItemKind.Function },
      ],
    });
  });

  test('Correctly completes started function name with unfinished namespace', () => {
    const query = 'RETURN gra';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'acos', kind: CompletionItemKind.Function },
        { label: 'apoc.agg.graph', kind: CompletionItemKind.Function },
        { label: 'apoc.coll.pairs', kind: CompletionItemKind.Function },
      ],
    });
  });

  test('Correctly limits function completions by one namespace', () => {
    const query = 'RETURN apoc.';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'agg', kind: CompletionItemKind.Function },
        { label: 'coll', kind: CompletionItemKind.Function },
      ],
    });

    testCompletionDoesNotContain({
      query,

      dbSchema,
      excluded: [{ label: 'acos', kind: CompletionItemKind.Function }],
    });
  });

  test('Correctly limits function completions by double namespace', () => {
    const query = 'RETURN apoc.agg.';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'first', kind: CompletionItemKind.Function },
        { label: 'last', kind: CompletionItemKind.Function },
        { label: 'slice', kind: CompletionItemKind.Function },
      ],
    });

    testCompletionDoesNotContain({
      query,

      dbSchema,
      excluded: [
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
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'first', kind: CompletionItemKind.Function },
        { label: 'last', kind: CompletionItemKind.Function },
        { label: 'slice', kind: CompletionItemKind.Function },
      ],
    });

    testCompletionDoesNotContain({
      query,

      dbSchema,
      excluded: [
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

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Function }],
    });
  });

  test('Correctly filters out all functions when function name is treated as namespace', () => {
    const query = 'RETURN apoc.agg.last.';

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Function }],
    });
  });

  test('Does not suggest functions when only valid character is dot', () => {
    // `apoc util` is invalid but `apoc . util` is valid so if we see a space, the only thing that can follow is a dot
    const query = 'RETURN apoc    ';

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Function }],
    });
  });

  test('Does not suggest functions when only valid character is dot - namespaced edition', () => {
    // `apoc util` is invalid but `apoc . util` is valid so if we see a space, the only thing that can follow is a dot
    const query = 'RETURN apoc . coll ';

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Function }],
    });
  });

  test('Correctly completes function name by namespace in left hand side of WHERE ', () => {
    const query = 'MATCH (n) WHERE apoc.';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'agg', kind: CompletionItemKind.Function },
        { label: 'coll', kind: CompletionItemKind.Function },
      ],
    });
  });

  test('Correctly completes function name in right hand side of WHERE', () => {
    const query = 'MATCH (n) WHERE n.name = fun';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'apoc.agg.percentiles', kind: CompletionItemKind.Function },
        { label: 'acos', kind: CompletionItemKind.Function },
      ],
    });
  });

  test('Correctly completes function name in an AND', () => {
    const query = 'RETURN true AND f';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        { label: 'apoc.agg.percentiles', kind: CompletionItemKind.Function },
        { label: 'acos', kind: CompletionItemKind.Function },
      ],
    });
  });
});
