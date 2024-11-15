import {
  CompletionItemKind,
  CompletionItemTag,
} from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import { testData } from '../testData';
import { testCompletions } from './completionAssertionHelpers';

describe('Procedures auto-completion', () => {
  const procedures = testData.mockSchema.procedures;

  const dbSchema: DbSchema = {
    procedures: {
      'tx.getMetaData': procedures['tx.getMetaData'],
      'db.index.fulltext.awaitEventuallyConsistentIndexRefresh':
        procedures['db.index.fulltext.awaitEventuallyConsistentIndexRefresh'],
      'db.ping': procedures['db.ping'],
      'db.stats.retrieve': procedures['db.stats.retrieve'],
      'db.stats.collect': procedures['db.stats.collect'],
      'db.stats.clear': procedures['db.stats.clear'],
      'dbms.components': procedures['dbms.components'],
      'cdc.current': procedures['cdc.current'],
      'jwt.security.requestAccess': {
        ...testData.emptyProcedure,
        name: 'jwt.security.requestAccess',
      },
    },
  };

  test('Correctly completes CALL in standalone', () => {
    const query = 'C';

    testCompletions({
      query,
      expected: [{ label: 'CALL', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes CALL in subquery', () => {
    const query = 'MATCH (n) C';

    testCompletions({
      query,
      expected: [{ label: 'CALL', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes YIELD', () => {
    const query = 'CALL proc() Y';

    testCompletions({
      query,
      expected: [{ label: 'YIELD', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes procedure name in CALL', () => {
    const query = 'CALL db';

    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'tx.getMetaData',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
          signature: procedures['tx.getMetaData'].signature,
          documentation: procedures['tx.getMetaData'].description,
        },
        {
          label: 'cdc.current',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
          signature: procedures['cdc.current'].signature,
          documentation: procedures['cdc.current'].description,
          tags: [CompletionItemTag.Deprecated],
        },
        {
          label: 'jwt.security.requestAccess',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
          documentation: '',
          signature: '',
        },
      ],
    });
  });

  test('Correctly limits procedure completions by one namespace', () => {
    const query = 'CALL db.';
    testCompletions({
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
          signature: procedures['db.ping'].signature,
          documentation: procedures['db.ping'].description,
        },
      ],
      excluded: [
        { label: 'jwt.security.requestAccess' },
        { label: 'jwt' },
        { label: 'security' },
      ],
    });
  });

  test('Correctly limits procedure completions by double namespace', () => {
    const query = 'CALL db.stats.';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'retrieve',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
          signature: procedures['db.stats.retrieve'].signature,
          documentation: procedures['db.stats.retrieve'].description,
        },
        {
          label: 'collect',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
          signature: procedures['db.stats.collect'].signature,
          documentation: procedures['db.stats.collect'].description,
        },
        {
          label: 'clear',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
          signature: procedures['db.stats.clear'].signature,
          documentation: procedures['db.stats.clear'].description,
        },
      ],
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
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'retrieve',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
          signature: procedures['db.stats.retrieve'].signature,
          documentation: procedures['db.stats.retrieve'].description,
        },
        {
          label: 'collect',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
          signature: procedures['db.stats.collect'].signature,
          documentation: procedures['db.stats.collect'].description,
        },
        {
          label: 'clear',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
          signature: procedures['db.stats.clear'].signature,
          documentation: procedures['db.stats.clear'].description,
        },
      ],
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

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Method }],
    });
  });

  test('Correctly filters out all procedures when procedure name is treated as namespace', () => {
    const query = 'CALL db.ping.';

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Method }],
    });
  });

  test('Does not suggest procedures when only valid character is dot', () => {
    const query = 'CALL apoc    ';

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Method }],
    });
  });

  test('Does not suggest procedures when only valid character is dot - namespaced edition', () => {
    const query = 'CALL apoc . coll ';

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Method }],
    });
  });

  test('Allows space after dot in procedure', () => {
    const query = 'CALL db  .  ';

    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'ping',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
          signature: procedures['db.ping'].signature,
          documentation: procedures['db.ping'].description,
        },
        {
          label: 'stats',
          kind: CompletionItemKind.Method,
          detail: '(namespace)',
        },
      ],
      excluded: [{ label: 'db' }, { label: 'db.ping' }],
    });
  });

  test('Correctly completes deprecated procedures when namespace started', () => {
    const query = 'CALL cdc.';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: 'current',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
          signature: procedures['cdc.current'].signature,
          documentation: procedures['cdc.current'].description,
          tags: [CompletionItemTag.Deprecated],
        },
      ],
    });
  });

  test('Correctly completes YIELD', () => {
    const query = 'CALL dbms.components() YIELD ';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Variable },
        { label: 'versions', kind: CompletionItemKind.Variable },
        { label: 'edition', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Correctly completes YIELD when we have extra spaces in the procedure name', () => {
    const query = 'CALL dbms    .    components  () YIELD ';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Variable },
        { label: 'versions', kind: CompletionItemKind.Variable },
        { label: 'edition', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Correctly completes YIELD when we have started the return value name', () => {
    const query1 = 'CALL dbms.components() YIELD n';
    const query2 = 'CALL dbms.components() YIELD name, ed';
    const query3 = 'CALL dbms.components() YIELD name, edition,';
    testCompletions({
      query: query1,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Variable },
        { label: 'versions', kind: CompletionItemKind.Variable },
        { label: 'edition', kind: CompletionItemKind.Variable },
      ],
    });
    testCompletions({
      query: query2,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Variable },
        { label: 'versions', kind: CompletionItemKind.Variable },
        { label: 'edition', kind: CompletionItemKind.Variable },
      ],
    });
    testCompletions({
      query: query3,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Variable },
        { label: 'versions', kind: CompletionItemKind.Variable },
        { label: 'versions', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Correctly completes YIELD when we have backticks in the procedure name', () => {
    const query1 = 'CALL `dbms`.`components`() YIELD ';
    const query2 = 'CALL db.`stats`.`collect`   () YIELD ';

    testCompletions({
      query: query1,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Variable },
        { label: 'versions', kind: CompletionItemKind.Variable },
        { label: 'edition', kind: CompletionItemKind.Variable },
      ],
    });
    testCompletions({
      query: query2,
      dbSchema,
      expected: [
        { label: 'section', kind: CompletionItemKind.Variable },
        { label: 'success', kind: CompletionItemKind.Variable },
        { label: 'message', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Returns empty YIELD elements when procedure does not exist', () => {
    const query = 'CALL does.not.exist() YIELD ';

    testCompletions({
      query,
      dbSchema,
      expected: [],
    });
  });
});
