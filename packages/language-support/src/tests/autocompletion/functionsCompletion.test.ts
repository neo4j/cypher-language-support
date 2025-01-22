import {
  CompletionItemKind,
  CompletionItemTag,
} from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import { testData } from '../testData';
import { testCompletions } from './completionAssertionHelpers';

describe('function invocations', () => {
  const dbSchema: DbSchema = testData.mockSchema;
  const functions = dbSchema.functions;

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
          signature: functions['cypher 5']['acos'].signature,
          documentation: functions['cypher 5']['acos'].description,
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
          signature: functions['cypher 5']['apoc.agg.graph'].signature,
          documentation: functions['cypher 5']['apoc.agg.graph'].description,
        },
        {
          label: 'apoc.coll.pairs',
          kind: CompletionItemKind.Function,
          detail: '(function)',
          signature: functions['cypher 5']['apoc.coll.pairs'].signature,
          documentation: functions['cypher 5']['apoc.coll.pairs'].description,
        },
        {
          label: 'apoc.create.uuid',
          kind: CompletionItemKind.Function,
          detail: '(function)',
          signature: functions['cypher 5']['apoc.create.uuid'].signature,
          documentation: functions['cypher 5']['apoc.create.uuid'].description,
          tags: [CompletionItemTag.Deprecated],
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
          signature: functions['cypher 5']['acos'].signature,
          documentation: functions['cypher 5']['acos'].description,
        },
        {
          label: 'apoc.agg.graph',
          kind: CompletionItemKind.Function,
          detail: '(function)',
          signature: functions['cypher 5']['apoc.agg.graph'].signature,
          documentation: functions['cypher 5']['apoc.agg.graph'].description,
        },
        {
          label: 'apoc.coll.pairs',
          kind: CompletionItemKind.Function,
          detail: '(function)',
          signature: functions['cypher 5']['apoc.coll.pairs'].signature,
          documentation: functions['cypher 5']['apoc.coll.pairs'].description,
        },
        {
          label: 'apoc.create.uuid',
          kind: CompletionItemKind.Function,
          detail: '(function)',
          signature: functions['cypher 5']['apoc.create.uuid'].signature,
          documentation: functions['cypher 5']['apoc.create.uuid'].description,
          tags: [CompletionItemTag.Deprecated],
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
      excluded: [
        { label: 'acos', kind: CompletionItemKind.Function },
        {
          label: 'agg.graph',
          kind: CompletionItemKind.Function,
        },
      ],
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
          signature: functions['cypher 5']['apoc.agg.first'].signature,
          documentation: functions['cypher 5']['apoc.agg.first'].description,
        },
        {
          label: 'last',
          kind: CompletionItemKind.Function,
          detail: '(function)',
          signature: functions['cypher 5']['apoc.agg.last'].signature,
          documentation: functions['cypher 5']['apoc.agg.last'].description,
        },
        {
          label: 'slice',
          kind: CompletionItemKind.Function,
          detail: '(function)',
          signature: functions['cypher 5']['apoc.agg.slice'].signature,
          documentation: functions['cypher 5']['apoc.agg.slice'].description,
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
          signature: functions['cypher 5']['apoc.agg.first'].signature,
          documentation: functions['cypher 5']['apoc.agg.first'].description,
        },
        {
          label: 'last',
          kind: CompletionItemKind.Function,
          detail: '(function)',
          signature: functions['cypher 5']['apoc.agg.last'].signature,
          documentation: functions['cypher 5']['apoc.agg.last'].description,
        },
        {
          label: 'slice',
          kind: CompletionItemKind.Function,
          detail: '(function)',
          signature: functions['cypher 5']['apoc.agg.slice'].signature,
          documentation: functions['cypher 5']['apoc.agg.slice'].description,
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
          signature: functions['cypher 5']['apoc.agg.percentiles'].signature,
          documentation:
            functions['cypher 5']['apoc.agg.percentiles'].description,
        },
        {
          label: 'acos',
          kind: CompletionItemKind.Function,
          detail: '(function)',
          signature: functions['cypher 5']['acos'].signature,
          documentation: functions['cypher 5']['acos'].description,
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
          signature: functions['cypher 5']['apoc.agg.percentiles'].signature,
          documentation:
            functions['cypher 5']['apoc.agg.percentiles'].description,
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
          signature: functions['cypher 5']['acos'].signature,
          documentation: functions['cypher 5']['acos'].description,
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
          'cypher 5': {
            math: { ...testData.emptyFunction, name: 'math' },
            'math.max': { ...testData.emptyFunction, name: 'math.max' },
          },
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
          documentation: '',
          signature: '',
        },
      ],
    });
  });

  test('Correctly completes deprecated functions when namespace started', () => {
    const query = 'RETURN apoc.create.';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'uuid',
          kind: CompletionItemKind.Function,
          detail: '(function)',
          signature: functions['cypher 5']['apoc.create.uuid'].signature,
          documentation: functions['cypher 5']['apoc.create.uuid'].description,
          tags: [CompletionItemTag.Deprecated],
        },
      ],
    });
  });

  test('Functions are completed based on cypher version', () => {
    // apoc.create.uuid was deprecated in Cypher 5 and removed in Cypher 25
    testCompletions({
      query: 'CYPHER 5 RETURN apoc.create.',
      dbSchema,
      expected: [
        {
          label: 'uuid',
          kind: CompletionItemKind.Function,
          detail: '(function)',
          signature: functions['cypher 5']['apoc.create.uuid'].signature,
          documentation: functions['cypher 5']['apoc.create.uuid'].description,
          tags: [CompletionItemTag.Deprecated],
        },
      ],
    });

    testCompletions({
      query: 'CYPHER 25 RETURN apoc.create.',
      dbSchema,
      excluded: [
        {
          label: 'uuid',
          kind: CompletionItemKind.Function,
          detail: '(function)',
          signature: functions['cypher 5']['apoc.create.uuid'].signature,
          documentation: functions['cypher 5']['apoc.create.uuid'].description,
          tags: [CompletionItemTag.Deprecated],
        },
      ],
    });
  });
});
