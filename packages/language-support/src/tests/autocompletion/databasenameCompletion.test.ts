import { CompletionItemKind } from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import { testCompletions } from './completionAssertionHelpers';

describe('Can complete database names', () => {
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

  test('Correctly completes database name even in a create alias statement', () => {
    testCompletions({
      query: 'CREATE ALIAS fo for DATABASE ',
      dbSchema,
      expected: [
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

  test('Correctly completes database name even in a create alias statement including extra of spaces', () => {
    testCompletions({
      query: 'CREATE ALIAS foo          FOR     DATABASE ',
      dbSchema,
      expected: [
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

  test('Suggests only aliases when dropping alias', () => {
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

  test('Suggests only aliases when showing alias', () => {
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

  test('Suggests only aliases when altering alias', () => {
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

  test('Can complete when typing scoped alias', () => {
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

  test('Handles that the parser allows spaces in symbolicAliasName', () => {
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

  test('Correctly completes parameters, database names and alias in DENY PRIVILEGE TO ROLE', () => {
    const cases = [
      'DENY TRAVERSE ON GRAPH ',
      'DENY TRAVERSE ON GRAPH neo4j, ',
      'DENY INDEX MANAGEMENT ON DATABASE ',
      'DENY INDEX MANAGEMENT ON DATABASE neo4j, ',
    ];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
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
      }),
    );
  });

  test('Correctly completes parameters, database names and alias in GRANT PRIVILEGE TO ROLE', () => {
    const cases = [
      'GRANT TRAVERSE ON GRAPH ',
      'GRANT TRAVERSE ON GRAPH neo4j, ',
      'GRANT INDEX MANAGEMENT ON DATABASE ',
      'GRANT INDEX MANAGEMENT ON DATABASE neo4j, ',
    ];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
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
      }),
    );
  });

  test('Correctly completes parameters, database names and alias in REVOKE PRIVILEGE FROM ROLE', () => {
    const cases = [
      'REVOKE GRANT TRAVERSE ON GRAPH ',
      'REVOKE GRANT TRAVERSE ON GRAPH neo4j, ',
      'REVOKE GRANT INDEX MANAGEMENT ON DATABASE ',
      'REVOKE GRANT INDEX MANAGEMENT ON DATABASE neo4j, ',
    ];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
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
      }),
    );
  });

  test('Correctly completes parameters and existing database names in GRANT privilege', () => {
    const cases = [
      'GRANT SHOW TRANSACTION (user1, user2) ON DATABASE ',
      'GRANT SHOW TRANSACTION (user1, user2) ON DATABASE neo4j, ',
    ];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
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
      }),
    );
  });

  test('Correctly completes parameters and existing database names in GRANT database privilege', () => {
    const cases = [
      'GRANT TERMINATE TRANSACTION (user) ON DATABASE ',
      'GRANT TERMINATE TRANSACTION (user) ON DATABASE neo4j, ',
    ];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
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
      }),
    );
  });
});
