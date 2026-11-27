import { CompletionItemKind } from 'vscode-languageserver-types';
import type { DbSchema } from '../../../dbSchema.js';
import { testCompletions } from './completionAssertionHelpers.js';
import { autocomplete } from '../../../autocompletion/autocompletion.js';

describe('Completes parameters outside of databases, roles, user names', () => {
  const dbSchema: DbSchema = {
    parameters: {
      stringParam: { type: 'String' },
      '@param': { type: 'String' },
      'param.1': { type: 'Integer' },
      '100param': { type: 'String' },
      intParam: { type: 'Integer' },
      mapParam: { type: 'Map' },
      'some param': { type: 'String' },
    },
  };

  test('Correctly completes started parameter in return body', () => {
    const query = 'RETURN $';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: '$stringParam',
          insertText: 'stringParam',
          kind: CompletionItemKind.Variable,
        },
        {
          label: '$intParam',
          insertText: 'intParam',
          kind: CompletionItemKind.Variable,
        },
        {
          label: '$mapParam',
          insertText: 'mapParam',
          kind: CompletionItemKind.Variable,
        },
        {
          label: '$some param',
          kind: CompletionItemKind.Variable,
          insertText: '`some param`',
        },
        {
          label: '$@param',
          kind: CompletionItemKind.Variable,
          insertText: '`@param`',
        },
        {
          label: '$100param',
          kind: CompletionItemKind.Variable,
          insertText: '100param',
        },
        {
          label: '$param.1',
          kind: CompletionItemKind.Variable,
          insertText: '`param.1`',
        },
      ],
    });
  });

  test('Correctly completes unstarted parameter in return body', () => {
    const query = 'RETURN ';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: '$stringParam',
          kind: CompletionItemKind.Variable,
        },
        {
          label: '$intParam',
          kind: CompletionItemKind.Variable,
        },
        {
          label: '$mapParam',
          kind: CompletionItemKind.Variable,
        },
        {
          label: '$some param',
          kind: CompletionItemKind.Variable,
          insertText: '$`some param`',
        },
        {
          label: '$@param',
          kind: CompletionItemKind.Variable,
          insertText: '$`@param`',
        },
        {
          label: '$100param',
          kind: CompletionItemKind.Variable,
        },
        {
          label: '$param.1',
          kind: CompletionItemKind.Variable,
          insertText: '$`param.1`',
        },
      ],
    });
  });

  test('Correctly completes unstarted parameter in where clause', () => {
    const query = 'MATCH (n) WHERE ';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
        {
          label: '$some param',
          kind: CompletionItemKind.Variable,
          insertText: '$`some param`',
        },
        {
          label: '$@param',
          kind: CompletionItemKind.Variable,
          insertText: '$`@param`',
        },
        {
          label: '$100param',
          kind: CompletionItemKind.Variable,
        },
        {
          label: '$param.1',
          kind: CompletionItemKind.Variable,
          insertText: '$`param.1`',
        },
      ],
    });
  });

  test('Correctly completes started parameter in where clause', () => {
    const query = 'MATCH (n) WHERE $';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: '$stringParam',
          kind: CompletionItemKind.Variable,
          insertText: 'stringParam',
        },
        {
          label: '$intParam',
          kind: CompletionItemKind.Variable,
          insertText: 'intParam',
        },
        {
          label: '$mapParam',
          kind: CompletionItemKind.Variable,
          insertText: 'mapParam',
        },
        {
          label: '$some param',
          kind: CompletionItemKind.Variable,
          insertText: '`some param`',
        },
        {
          label: '$@param',
          kind: CompletionItemKind.Variable,
          insertText: '`@param`',
        },
        {
          label: '$100param',
          kind: CompletionItemKind.Variable,
          insertText: '100param',
        },
        {
          label: '$param.1',
          kind: CompletionItemKind.Variable,
          insertText: '`param.1`',
        },
      ],
    });
  });

  test('Correctly completes unstarted parameter in expression', () => {
    const query = 'RETURN 1 + ';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
        {
          label: '$some param',
          kind: CompletionItemKind.Variable,
          insertText: '$`some param`',
        },
        {
          label: '$@param',
          kind: CompletionItemKind.Variable,
          insertText: '$`@param`',
        },
        {
          label: '$100param',
          kind: CompletionItemKind.Variable,
        },
        {
          label: '$param.1',
          kind: CompletionItemKind.Variable,
          insertText: '$`param.1`',
        },
      ],
    });
  });

  test('Correctly completes started parameter in expression', () => {
    const query = 'RETURN 1 + $int';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: '$intParam',
          kind: CompletionItemKind.Variable,
          insertText: 'intParam',
        },
        {
          label: '$stringParam',
          kind: CompletionItemKind.Variable,
          insertText: 'stringParam',
        },
        {
          label: '$mapParam',
          kind: CompletionItemKind.Variable,
          insertText: 'mapParam',
        },
        {
          label: '$some param',
          kind: CompletionItemKind.Variable,
          insertText: '`some param`',
        },
      ],
    });
  });

  test('Suggests parameter as map properties', () => {
    const query = 'match (v :Movie ';

    testCompletions({
      query,
      dbSchema,
      expected: [{ label: '$mapParam', kind: CompletionItemKind.Variable }],
      excluded: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: '$intParam', kind: CompletionItemKind.Variable },
        // ensure variables are not suggested in place of parameters (parameters reuse the variable rule)
        { label: 'v', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Suggests parameter in options field of create constraint', () => {
    const query =
      'CREATE CONSTRAINT abc FOR (n:person) REQUIRE n.name IS NOT NULL OPTIONS ';
    testCompletions({
      query,
      dbSchema,
      expected: [{ label: '$mapParam', kind: CompletionItemKind.Variable }],
      excluded: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: '$intParam', kind: CompletionItemKind.Variable },
        {
          label: '$some param',
          kind: CompletionItemKind.Variable,
          insertText: '$`some param`',
        },
      ],
    });
  });

  test('Suggests parameter in options field of create index', () => {
    const query = 'CREATE INDEX abc FOR (n:person) ON (n.name) OPTIONS ';
    testCompletions({
      query,
      dbSchema,
      expected: [{ label: '$mapParam', kind: CompletionItemKind.Variable }],
      excluded: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: '$intParam', kind: CompletionItemKind.Variable },
        {
          label: '$some param',
          kind: CompletionItemKind.Variable,
        },
      ],
    });
  });

  test('Suggest started parameter in SEARCH', () => {
    const query = `CYPHER 25 MATCH (m:Movie {title: 'Godfather, The'})
   MATCH (movie:Movie)
   SEARCH movie IN (
      VECTOR INDEX $string`;
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: '$stringParam',
          kind: CompletionItemKind.Variable,
          insertText: 'stringParam',
        },
      ],
      excluded: [
        { label: '$mapParam', kind: CompletionItemKind.Variable },
        { label: '$intParam', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Suggests started parameter in DDL commands', () => {
    const queries = [
      'CREATE INDEX $string',
      'CREATE USER $string',
      'CREATE USER user SET HOME DATABASE $string',
      'SHOW DATABASE $string',
      'CREATE CONSTRAINT $string',
      'DROP CONSTRAINT $string',
      'CREATE FULLTEXT INDEX $string',
      'CREATE VECTOR INDEX $string',
      'CREATE LOOKUP INDEX $string',
      'DROP INDEX $string',
    ];

    queries.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          {
            label: '$stringParam',
            kind: CompletionItemKind.Variable,
            insertText: 'stringParam',
          },
        ],
        excluded: [
          { label: '$mapParam', kind: CompletionItemKind.Variable },
          { label: '$intParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Suggests parameter in options field of create composite database', () => {
    const query = 'CREATE COMPOSITE DATABASE name IF NOT EXISTS OPTIONS ';
    testCompletions({
      query,
      dbSchema,
      expected: [{ label: '$mapParam', kind: CompletionItemKind.Variable }],
      excluded: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: '$intParam', kind: CompletionItemKind.Variable },
        {
          label: '$some param',
          kind: CompletionItemKind.Variable,
        },
      ],
    });
  });

  test('Suggests parameters for server management', () => {
    const nameCases = [
      'ENABLE SERVER ',
      'ALTER SERVER ',
      'RENAME SERVER ',
      'RENAME SERVER $adb TO ',
      'DROP SERVER ',
      'DEALLOCATE DATABASES FROM SERVERS ',
      'DEALLOCATE DATABASES FROM SERVERS "ab", ',
    ];
    const optionsCases = [
      'ENABLE SERVER "abc" OPTIONS ',
      'ALTER SERVER "abc" SET OPTIONS ',
    ];

    nameCases.forEach((query) => {
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          {
            label: '$some param',
            kind: CompletionItemKind.Variable,
            insertText: '$`some param`',
          },
        ],
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      });
    });

    optionsCases.forEach((query) => {
      testCompletions({
        query,
        dbSchema,
        expected: [{ label: '$mapParam', kind: CompletionItemKind.Variable }],
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          {
            label: '$some param',
            kind: CompletionItemKind.Variable,
          },
        ],
      });
    });
  });

  test('Suggests parameters for passwords', () => {
    const cases = [
      'ALTER CURRENT USER SET PASSWORD FROM ',
      'ALTER CURRENT USER SET PASSWORD FROM $pw to ',
      'ALTER USER foo IF EXISTS SET PASSWORD ',
    ];
    cases.forEach((query) => {
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          {
            label: '$some param',
            kind: CompletionItemKind.Variable,
            insertText: '$`some param`',
          },
        ],
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      });
    });
  });

  test('Does not suggest duplicated parameters', () => {
    const query = 'CREATE ALIAS alias FOR DATABASE ';
    const actualCompletionList = autocomplete(query, dbSchema).filter((v) =>
      v.label.startsWith('$stringParam'),
    );

    expect(actualCompletionList.length).toBe(1);
  });

  test('Suggests parameter in string interpolation', () => {
    const query = 'MATCH (n) RETURN s"My param: { $';
    testCompletions({
      query,
      dbSchema,
      expected: [
        {
          label: '$mapParam',
          kind: CompletionItemKind.Variable,
          insertText: 'mapParam',
        },
        {
          label: '$stringParam',
          kind: CompletionItemKind.Variable,
          insertText: 'stringParam',
        },
        {
          label: '$intParam',
          kind: CompletionItemKind.Variable,
          insertText: 'intParam',
        },
        {
          label: '$some param',
          kind: CompletionItemKind.Variable,
          insertText: '`some param`',
        },
      ],
      excluded: [],
    });
  });
});

describe('Filters parameter completions on the expected type', () => {
  const dbSchema: DbSchema = {
    parameters: {
      stringParam: { type: 'String', stringValue: '"something"' },
      intParam: { type: 'Integer', stringValue: '1337' },
      floatParam: { type: 'Float', stringValue: '13.37' },
      mapParam: { type: 'Map', stringValue: '{a: 1}' },
      vectorParam: { type: 'Vector', stringValue: 'vector([1, 2], 2, INT32)' },
      dateParam: { type: 'Date', stringValue: '2026-11-27' },
      untypedParam: {},
    },
  };

  const parameterLabels = (query: string) =>
    autocomplete(query, dbSchema)
      .map(({ label }) => label)
      .filter((label) => label.startsWith('$'))
      .sort();

  test('Suggests all parameters when any type is expected', () => {
    expect(parameterLabels('RETURN $')).toEqual([
      '$dateParam',
      '$floatParam',
      '$intParam',
      '$mapParam',
      '$stringParam',
      '$untypedParam',
      '$vectorParam',
    ]);
  });

  test('Suggests only string parameters for ENABLE SERVER', () => {
    expect(parameterLabels('ENABLE SERVER $')).toEqual([
      '$stringParam',
      '$untypedParam',
    ]);
  });

  test('Suggests only string parameters for DROP USER', () => {
    expect(parameterLabels('DROP USER $')).toEqual([
      '$stringParam',
      '$untypedParam',
    ]);
  });

  test('Suggests only string parameters for CREATE ROLE', () => {
    expect(parameterLabels('CREATE ROLE $')).toEqual([
      '$stringParam',
      '$untypedParam',
    ]);
  });

  test('Suggests only string parameters for passwords', () => {
    expect(parameterLabels('ALTER USER foo SET PASSWORD $')).toEqual([
      '$stringParam',
      '$untypedParam',
    ]);
  });

  test('Suggests only map parameters for node properties', () => {
    expect(parameterLabels('CREATE (n $')).toEqual([
      '$mapParam',
      '$untypedParam',
    ]);
  });

  test('Suggests only map parameters for index options', () => {
    expect(
      parameterLabels('CREATE INDEX abc FOR (n:Person) ON (n.name) OPTIONS $'),
    ).toEqual(['$mapParam', '$untypedParam']);
  });

  test('Suggests only integer parameters for SHORTEST', () => {
    expect(parameterLabels('MATCH SHORTEST $')).toEqual([
      '$intParam',
      '$untypedParam',
    ]);
  });

  test('Suggests only integer parameters for ANY', () => {
    expect(parameterLabels('MATCH ANY $')).toEqual([
      '$intParam',
      '$untypedParam',
    ]);
  });

  test('Suggests only vector parameters for the first argument of vector_distance', () => {
    expect(parameterLabels('RETURN vector_distance($')).toEqual([
      '$untypedParam',
      '$vectorParam',
    ]);
  });

  test('Suggests only vector parameters for the second argument of vector_distance', () => {
    expect(parameterLabels('RETURN vector_distance($vectorParam, $')).toEqual([
      '$untypedParam',
      '$vectorParam',
    ]);
  });

  test('Suggests only vector parameters for the first argument of vector_norm', () => {
    expect(parameterLabels('RETURN vector_norm($')).toEqual([
      '$untypedParam',
      '$vectorParam',
    ]);
  });

  test('Suggests all parameters inside a function call in a vector argument', () => {
    expect(parameterLabels('RETURN vector_distance(coalesce($')).toEqual([
      '$dateParam',
      '$floatParam',
      '$intParam',
      '$mapParam',
      '$stringParam',
      '$untypedParam',
      '$vectorParam',
    ]);
  });

  test('Suggests all parameters for later arguments of a function call in a vector argument', () => {
    expect(parameterLabels('RETURN vector_distance(coalesce($a, $')).toEqual([
      '$dateParam',
      '$floatParam',
      '$intParam',
      '$mapParam',
      '$stringParam',
      '$untypedParam',
      '$vectorParam',
    ]);
  });

  test('Suggests all parameters inside a list in a vector argument', () => {
    expect(parameterLabels('RETURN vector_distance([1, $')).toEqual([
      '$dateParam',
      '$floatParam',
      '$intParam',
      '$mapParam',
      '$stringParam',
      '$untypedParam',
      '$vectorParam',
    ]);
  });

  test('Suggests all parameters inside a map in a vector argument', () => {
    expect(parameterLabels('RETURN vector_distance({a: 1, b: $')).toEqual([
      '$dateParam',
      '$floatParam',
      '$intParam',
      '$mapParam',
      '$stringParam',
      '$untypedParam',
      '$vectorParam',
    ]);
  });

  test('Suggests all parameters for the second argument of vector_norm', () => {
    expect(parameterLabels('RETURN vector_norm($vectorParam, $')).toEqual([
      '$dateParam',
      '$floatParam',
      '$intParam',
      '$mapParam',
      '$stringParam',
      '$untypedParam',
      '$vectorParam',
    ]);
  });

  test('Suggests all parameters for the third argument of vector_distance', () => {
    expect(parameterLabels('RETURN vector_distance($a, $b, $')).toEqual([
      '$dateParam',
      '$floatParam',
      '$intParam',
      '$mapParam',
      '$stringParam',
      '$untypedParam',
      '$vectorParam',
    ]);
  });

  test('Suggests all parameters for the value of vector()', () => {
    expect(parameterLabels('RETURN vector($')).toEqual([
      '$dateParam',
      '$floatParam',
      '$intParam',
      '$mapParam',
      '$stringParam',
      '$untypedParam',
      '$vectorParam',
    ]);
  });
});
