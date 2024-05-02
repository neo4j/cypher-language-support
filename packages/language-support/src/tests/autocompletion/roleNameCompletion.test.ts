import { CompletionItemKind } from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import { testCompletions } from './completionAssertionHelpers';

describe('Can complete role names', () => {
  const dbSchema: DbSchema = {
    roleNames: ['foo', 'bar'],
    parameters: {
      stringParam: 'something',
      intParam: 1337,
      mapParam: {
        property: 'value',
      },
    },
  };

  test('Correctly completes parameters, avoids existing role names in CREATE ROLE', () => {
    const query = 'CREATE ROLE ';

    testCompletions({
      query,
      dbSchema,
      expected: [{ label: '$stringParam', kind: CompletionItemKind.Variable }],
      // do not suggest non-string parameters or existing role names
      excluded: [
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
        { label: 'foo', kind: CompletionItemKind.Value },
        { label: 'bar', kind: CompletionItemKind.Value },
      ],
    });
  });

  test('Correctly completes parameters and existing role names in DROP ROLE', () => {
    const query = 'DROP ROLE ';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: 'foo', kind: CompletionItemKind.Value },
        { label: 'bar', kind: CompletionItemKind.Value },
      ],
      // do not suggest non-string parameters or existing role names
      excluded: [
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Correctly completes parameters and existing role names in RENAME USER', () => {
    const query = 'RENAME ROLE ';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: 'foo', kind: CompletionItemKind.Value },
        { label: 'bar', kind: CompletionItemKind.Value },
      ],
      // do not suggest non-string parameters or existing role names
      excluded: [
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Correctly completes parameters and existing role names in GRANT ROLE', () => {
    const cases = ['GRANT ROLE ', 'GRANT ROLE role, '];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing role names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing role names in REVOKE ROLE', () => {
    const cases = ['REVOKE ROLE ', 'REVOKE ROLE role, '];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing role names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing role names in SHOW ROLE PRIVILEGES', () => {
    const cases = ['SHOW ROLE ', 'SHOW ROLE role, '];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing role names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing role names in GRANT PRIVILEGE TO ROLE', () => {
    const cases = [
      'GRANT TRAVERSE ON GRAPH neo4j NODES Post TO ',
      'GRANT TRAVERSE ON GRAPH neo4j NODES Post TO role, ',
      'GRANT INDEX MANAGEMENT ON DATABASE * TO ',
      'GRANT INDEX MANAGEMENT ON DATABASE * TO role, ',
    ];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing role names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing role names in DENY PRIVILEGE TO ROLE', () => {
    const cases = [
      'DENY TRAVERSE ON GRAPH neo4j NODES Post TO ',
      'DENY TRAVERSE ON GRAPH neo4j NODES Post TO role, ',
      'DENY INDEX MANAGEMENT ON DATABASE * TO ',
      'DENY INDEX MANAGEMENT ON DATABASE * TO role, ',
    ];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing role names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing role names in REVOKE PRIVILEGE FROM ROLE', () => {
    const cases = [
      'REVOKE GRANT TRAVERSE ON GRAPH neo4j NODES Post FROM ',
      'REVOKE GRANT TRAVERSE ON GRAPH neo4j NODES Post FROM role, ',
      'REVOKE GRANT INDEX MANAGEMENT ON DATABASE * FROM ',
      'REVOKE GRANT INDEX MANAGEMENT ON DATABASE * FROM role, ',
    ];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing role names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing role names in GRANT ROLE MANAGEMENT', () => {
    const cases = [
      'GRANT ROLE MANAGEMENT ON DBMS TO ',
      'GRANT ROLE MANAGEMENT ON DBMS TO role, ',
    ];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing role names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing role names in REVOKE ROLE MANAGEMENT', () => {
    const cases = [
      'REVOKE ROLE MANAGEMENT ON DBMS FROM ',
      'REVOKE ROLE MANAGEMENT ON DBMS FROM role, ',
    ];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing role names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing role names in GRANT privilege', () => {
    const cases = [
      'GRANT SHOW TRANSACTION (user1, user2) ON DATABASE neo4j TO ',
      'GRANT SHOW TRANSACTION (user1, user2) ON DATABASE neo4j TO role, ',
    ];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing role names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing role names in GRANT dbms privilege', () => {
    const cases = [
      'GRANT IMPERSONATE (user) ON DBMS TO ',
      'GRANT IMPERSONATE (user) ON DBMS TO role, ',
    ];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing role names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing role names in GRANT database privilege', () => {
    const cases = [
      'GRANT TERMINATE TRANSACTION (user) ON DATABASE neo4j TO ',
      'GRANT TERMINATE TRANSACTION (user) ON DATABASE neo4j TO role, ',
    ];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing role names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });
});
