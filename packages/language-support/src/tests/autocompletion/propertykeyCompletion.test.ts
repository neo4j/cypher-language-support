import { CompletionItemKind } from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import { testData } from '../testData';
import { testCompletions } from './completionAssertionHelpers';
import { lintCypherQuery } from '../../syntaxValidation/syntaxValidation';
import { parserWrapper } from '../../parserWrapper';

describe('property key completions', () => {
  const dbSchema: DbSchema = {
    propertyKeys: ['name', 'type', 'level'],
    functions: {
      'CYPHER 5': {
        'apoc.util.sleep': {
          ...testData.emptyFunction,
          name: 'apoc.util.sleep',
        },
      },
    },
  };

  test('correctly completes property keys in WHERE', () => {
    const query = 'MATCH (n) WHERE n.';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('correctly completes property keys in match clauses', () => {
    const cases = [
      'MATCH ({',
      'MATCH (n {',
      'MATCH (n:Person {',
      'MATCH (n:Person {p: 1, ',
    ];
    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: 'name', kind: CompletionItemKind.Property },
          { label: 'type', kind: CompletionItemKind.Property },
          { label: 'level', kind: CompletionItemKind.Property },
        ],
      }),
    );
  });

  test('correctly completes property keys in simple map projection', () => {
    const query = `
RETURN movie {
 .
`;

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('correctly completes property keys in complex map projection', () => {
    const query = `
RETURN movie {
 actors: [(movie)<-[rel:ACTED_IN]-(person:Person) 
                 | person { .
`;

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('does not complete property keys in map literals', () => {
    const query = `RETURN {`;

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Property }],
    });
  });

  test('does not complete property keys for undefined variables', () => {
    const query = `RETURN abc.`;

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Property }],
    });
  });

  test('does not try to complete property keys for non-variable expressions', () => {
    const expressions = ["'abc'", '1', 'true', 'null', '[]', '{}', '$para'];

    expressions.forEach((expression) => {
      testCompletions({
        query: `RETURN ${expression}.`,
        dbSchema,
        excluded: [{ kind: CompletionItemKind.Property }],
      });
    });
  });

  test('does not yet support completing property keys for variables in parentesis', () => {
    const query = `WITH 1 as node RETURN (node).`;

    testCompletions({
      query,
      dbSchema,
      excluded: [{ kind: CompletionItemKind.Property }],
    });
  });

  test('completes property keys for non-node variables when semantic analysis is not available', () => {
    const query = `WITH 1 as node RETURN node.`;

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'type', kind: CompletionItemKind.Property },
        { label: 'level', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('completes both namespace and properties when variable name is equal to namespace', () => {
    const query = `MATCH (apoc) RETURN apoc.`;

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'type', kind: CompletionItemKind.Property },
        {
          label: 'util',
          kind: CompletionItemKind.Function,
          detail: '(namespace)',
        },
      ],
    });
  });

  test('Completes node property keys with numbers, underscores and non-english letters without backticks in MATCH', () => {
    const query = 'MATCH (n) WHERE n.';

    testCompletions({
      query,
      dbSchema: {
        propertyKeys: [
          'Cat12',
          'Foo_Bar',
          'Glögg',
          'Glühwein',
          '_GingerBread_',
        ],
      },
      expected: [
        {
          label: 'Cat12',
          kind: CompletionItemKind.Property,
        },
        {
          label: 'Foo_Bar',
          kind: CompletionItemKind.Property,
        },
        {
          label: 'Glögg',
          kind: CompletionItemKind.Property,
        },
        {
          label: 'Glühwein',
          kind: CompletionItemKind.Property,
        },
        {
          label: '_GingerBread_',
          kind: CompletionItemKind.Property,
        },
      ],
    });
  });

  test('correctly completes property keys with backticks', () => {
    const dbSchema = { propertyKeys: ['foo bar', 'prop'] };
    const query = 'MATCH (n) WHERE n.';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'prop', kind: CompletionItemKind.Property },
        {
          label: 'foo bar',
          insertText: '`foo bar`',
          kind: CompletionItemKind.Property,
        },
      ],
    });
  });

  test('correctly completes started property keys with backticks', () => {
    const dbSchema = { propertyKeys: ['foo bar', 'prop'] };
    const query = 'MATCH (n) WHERE n.foo';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'prop', kind: CompletionItemKind.Property },
        {
          label: 'foo bar',
          insertText: '`foo bar`',
          kind: CompletionItemKind.Property,
        },
      ],
    });
  });

  test('completes properties for any variable if symbol table is not available', () => {
    const dbSchema = { propertyKeys: ['name', 'surname'] };
    const query = 'WITH 1 AS x RETURN x.';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'surname', kind: CompletionItemKind.Property },
      ],
    });
  });

  test('does not complete properties for non node / relationship variables when symbol table is available', () => {
    const dbSchema = { propertyKeys: ['name', 'surname'] };
    const query = 'WITH [1,2,3] AS x RETURN x.';
    const symbolsInfo = {
      query,
      symbolTables: lintCypherQuery(query, dbSchema).symbolTables,
    };
    parserWrapper.setSymbolsInfo(symbolsInfo);

    testCompletions({
      query,
      dbSchema,
      excluded: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'surname', kind: CompletionItemKind.Property },
      ],
    });

    // Clean the symbol tables
    parserWrapper.clearCache();
  });

  test('completes properties for node variables when symbol table is available', () => {
    const dbSchema = { propertyKeys: ['name', 'surname'] };
    const query = 'MATCH (n) RETURN n.';
    const symbolsInfo = {
      query,
      symbolTables: lintCypherQuery(query, dbSchema).symbolTables,
    };
    parserWrapper.setSymbolsInfo(symbolsInfo);

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'surname', kind: CompletionItemKind.Property },
      ],
    });

    // Clean the symbol tables
    parserWrapper.clearCache();
  });

  test('completes properties for relationship variables when symbol table is available', () => {
    const dbSchema = { propertyKeys: ['name', 'surname'] };
    const query = 'MATCH (n)-[r]-(m) RETURN r.';
    const symbolsInfo = {
      query,
      symbolTables: lintCypherQuery(query, dbSchema).symbolTables,
    };
    parserWrapper.setSymbolsInfo(symbolsInfo);

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'name', kind: CompletionItemKind.Property },
        { label: 'surname', kind: CompletionItemKind.Property },
      ],
    });

    // Clean the symbol tables
    parserWrapper.clearCache();
  });
});
