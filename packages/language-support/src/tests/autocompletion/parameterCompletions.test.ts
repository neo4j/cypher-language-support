import { CompletionItemKind } from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import { testCompletions } from './completionAssertionHelpers';

describe('Completes parameters outside of databases, roles, user names', () => {
  const dbSchema: DbSchema = {
    parameters: {
      stringParam: 'something',
      intParam: 1337,
      mapParam: {
        property: 'value',
      },
    },
  };

  test('Correctly completes started parameter in return body', () => {
    const query = 'RETURN $';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Correctly completes unstarted parameter in return body', () => {
    const query = 'RETURN ';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Correctly completes started parameter in where clause', () => {
    const query = 'MATCH (n) WHERE ';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Correctly completes started parameter in expression', () => {
    const query = 'RETURN 1 + ';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
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
      'CREATE CONSTRAINT abc ON (n:person) ASSERT EXISTS n.name OPTIONS ';
    testCompletions({
      query,
      dbSchema,
      expected: [{ label: '$mapParam', kind: CompletionItemKind.Variable }],
      excluded: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: '$intParam', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('suggests parameter in options field of create index', () => {
    const query = 'CREATE INDEX abc FOR (n:person) ON (n.name) OPTIONS ';
    testCompletions({
      query,
      dbSchema,
      expected: [{ label: '$mapParam', kind: CompletionItemKind.Variable }],
      excluded: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: '$intParam', kind: CompletionItemKind.Variable },
      ],
    });
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
        ],
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      });
    });
  });
});
