import { CompletionItemKind } from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import { testCompletions } from './completionAssertionHelpers';

describe('can complete database names', () => {
  const dbSchema: DbSchema = {
    databaseNames: ['db1', 'db2', 'movies'],
    aliasNames: ['myMovies', 'scoped.alias', 'a.b.c.d'],
    parameters: {
      param1: 'something',
      param2: 1337,
      param3: {
        property: 'value',
      },
    },
  };

  test('Correctly completes database names and aliases in SHOW DATABASE', () => {
    const query = 'SHOW DATABASE ';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'WHERE', kind: CompletionItemKind.Keyword },
        { label: 'YIELD', kind: CompletionItemKind.Keyword },
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        { label: '$param1', kind: CompletionItemKind.Variable },
      ],
      // do not suggest non-string parameters
      excluded: [
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Correctly completes database names and aliases in SHOW DATABASE with started db name', () => {
    const query = 'SHOW DATABASE m';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'WHERE', kind: CompletionItemKind.Keyword },
        { label: 'YIELD', kind: CompletionItemKind.Keyword },
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        { label: '$param1', kind: CompletionItemKind.Variable },
      ],
      excluded: [
        // validate invalid keyword bug isn't present
        { label: '', kind: CompletionItemKind.Keyword },
        // do not suggest non-string parameters
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test("Doesn't suggest existing database names or aliases when createing database", () => {
    const query = 'CREATE DATABASE ';

    testCompletions({
      query,
      dbSchema,
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        // do not suggest non-string parameters
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
      // can create new database name using parameter
      expected: [{ label: '$param1', kind: CompletionItemKind.Variable }],
    });
  });

  test("Doesn't suggest existing database names or aliases when createing alias", () => {
    const query = 'CREATE ALIAS ';

    testCompletions({
      query,
      dbSchema,
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        // do not suggest non-string parameters
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
      // can create new alias name using parameter
      expected: [{ label: '$param1', kind: CompletionItemKind.Variable }],
    });
  });

  test('suggest only aliases when dropping alias', () => {
    const query = 'DROP ALIAS ';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        { label: '$param1', kind: CompletionItemKind.Variable },
      ],
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        // do not suggest non-string parameters
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('suggest only aliases when showing alias', () => {
    const query = 'SHOW ALIAS ';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: '$param1', kind: CompletionItemKind.Variable },
      ],
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        // do not suggest non-string parameters
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('suggest only aliases when altering alias', () => {
    const query = 'ALTER ALIAS a';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        { label: '$param1', kind: CompletionItemKind.Variable },
      ],
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        // do not suggest non-string parameters
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('can complete when typing scoped alias', () => {
    const query = 'ALTER ALIAS a.b.c.';
    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        { label: '$param1', kind: CompletionItemKind.Variable },
      ],
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        // do not suggest non-string parameters
        { label: '$param2', kind: CompletionItemKind.Variable },
        { label: '$param3', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('handle that the parser allows spaces in symbolicAliasName', () => {
    // Since the parser allows for spaces in the symbolicAliasName rule but not in created alias (unless quoted)
    // I've added a test to verify we don't suggest aliases after the space (false positives)
    const query = 'drop alias myMovies ';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: 'FOR DATABASE', kind: CompletionItemKind.Keyword },
        { label: 'IF EXISTS', kind: CompletionItemKind.Keyword },
      ],
      excluded: [
        { label: 'db1', kind: CompletionItemKind.Value },
        { label: 'db2', kind: CompletionItemKind.Value },
        { label: 'movies', kind: CompletionItemKind.Value },
        { label: 'myMovies', kind: CompletionItemKind.Value },
        { label: 'scoped.alias', kind: CompletionItemKind.Value },
        { label: 'a.b.c.d', kind: CompletionItemKind.Value },
        // EOF checks
        { label: '', kind: CompletionItemKind.Value },
        { label: '', kind: CompletionItemKind.Keyword },
      ],
    });
  });

  describe('can complete parameters outside of database names', () => {
    const dbSchema: DbSchema = {
      parameters: {
        stringParam: 'something',
        intParam: 1337,
        mapParam: {
          property: 'value',
        },
      },
    };

    test('correctly completes started parameter in return body', () => {
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

    test('correctly completes unstarted parameter in return body', () => {
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

    test('correctly completes started parameter in where clause', () => {
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

    test('correctly completes started parameter in expression', () => {
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

    test('correctly suggests parameter in ENABLE SERVER', () => {
      const query = 'ENABLE SERVER ';
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

    test('suggests parameter as map properties', () => {
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

    test('suggests parameter in options field of create constraint', () => {
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

    test('suggests parameter in options field of create composite database', () => {
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

    test('suggests parameters for user management', () => {
      const cases = [
        'CREATE USER ',
        'DROP USER ',
        'ALTER USER ',
        'RENAME USER ',
        'SHOW USER ',
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

    test('suggests parameters for role management', () => {
      const cases = [
        'CREATE ROLE ',
        'DROP ROLE ',
        'RENAME ROLE ',
        'GRANT ROLE ',
        'GRANT ROLE abc TO ',
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

    test('suggests parameters for server management', () => {
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
  });
});
