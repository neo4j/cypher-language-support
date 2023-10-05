import { CompletionItemKind } from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import {
  testCompletionContains,
  testCompletionDoesNotContain,
} from './completion-assertion-helpers';

describe('Procedures auto-completion', () => {
  const dbSchema: DbSchema = {
    procedureSignatures: {
      'tx.getMetaData': { label: 'tx.getMetaData' },
      'jwt.security.requestAccess': { label: 'jwt.security.requestAccess' },
      'db.index.fulltext.awaitEventuallyConsistentIndexRefresh': {
        label: 'db.index.fulltext.awaitEventuallyConsistentIndexRefresh',
      },
      'db.ping': { label: 'db.ping' },
      'db.stats.retrieve': { label: 'db.stats.retrieve' },
      'db.stats.collect': { label: 'db.stats.collect' },
      'db.stats.clear': { label: 'db.stats.clear' },
    },
  };

  test('Correctly completes CALL in standalone', () => {
    const query = 'C';

    testCompletionContains({
      query,
      expected: [{ label: 'CALL', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes CALL in subquery', () => {
    const query = 'MATCH (n) C';

    testCompletionContains({
      query,
      expected: [{ label: 'CALL', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes YIELD', () => {
    const query = 'CALL proc() Y';

    testCompletionContains({
      query,
      expected: [{ label: 'YIELD', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes procedure name in CALL', () => {
    const query = 'CALL db';

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        {
          label: 'tx.getMetaData',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
        },
        {
          label: 'jwt.security.requestAccess',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
        },
      ],
    });
  });

  test('Correctly limits procedure completions by one namespace', () => {
    const query = 'CALL db.';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        {
          label: 'stats',
          kind: CompletionItemKind.Method,
          detail: '(namespace)',
        },
        {
          label: 'ping',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
        },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: 'jwt.security.requestAccess' },
        { label: 'jwt' },
        { label: 'security' },
      ],
    });
  });

  test('Correctly limits procedure completions by double namespace', () => {
    const query = 'CALL db.stats.';
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        {
          label: 'retrieve',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
        },
        {
          label: 'collect',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
        },
        {
          label: 'clear',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
        },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: 'tx.getMetaData' },
        { label: 'getMetaData' },
        { label: 'jwt.security.requestAccess' },
        { label: 'jwt' },
        { label: 'security' },
        { label: 'requestAccess' },
        { label: 'db.index.fulltext.awaitEventuallyConsistentIndexRefresh' },
        { label: 'index' },
        { label: 'db.index' },
        { label: 'db.ping' },
        { label: 'db.stats.retrieve' },
        { label: 'db.stats.collect' },
        { label: 'db.stats.clear' },
      ],
    });
  });

  test('Correctly completes multiline procedure completion', () => {
    const query = `CALL db
                            .stats
                            .`;
    testCompletionContains({
      query,
      dbSchema,
      expected: [
        {
          label: 'retrieve',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
        },
        {
          label: 'collect',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
        },
        {
          label: 'clear',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
        },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [
        { label: 'tx.getMetaData' },
        { label: 'getMetaData' },
        { label: 'jwt.security.requestAccess' },
        { label: 'jwt' },
        { label: 'security' },
        { label: 'requestAccess' },
        { label: 'db.index.fulltext.awaitEventuallyConsistentIndexRefresh' },
        { label: 'index' },
        { label: 'db.index' },
        { label: 'db.ping' },
        { label: 'db.stats.retrieve' },
        { label: 'db.stats.collect' },
        { label: 'db.stats.clear' },
      ],
    });
  });

  test('Correctly filters out all procedures when namespace is incorrect', () => {
    const query = 'CALL badnamespace.';

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Method }],
    });
  });

  test('Correctly filters out all procedures when procedure name is treated as namespace', () => {
    const query = 'CALL db.ping.';

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Method }],
    });
  });

  test('Does not suggest procedures when only valid character is dot', () => {
    const query = 'CALL apoc    ';

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Method }],
    });
  });

  test('Does not suggest procedures when only valid character is dot - namespaced edition', () => {
    const query = 'CALL apoc . coll ';

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Method }],
    });
  });

  test('Allows space after dot in procedure', () => {
    const query = 'CALL db  .  ';

    testCompletionContains({
      query,
      dbSchema,
      expected: [
        {
          label: 'ping',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
        },
        {
          label: 'stats',
          kind: CompletionItemKind.Method,
          detail: '(namespace)',
        },
      ],
    });

    testCompletionDoesNotContain({
      query,
      dbSchema,
      excluded: [{ label: 'db' }, { label: 'db.ping' }],
    });
  });
});
