import { CompletionItemKind } from 'vscode-languageserver-types';
import { DbSchema } from '../../dbSchema';
import { testCompletions } from './completionAssertionHelpers';

describe('Can complete user names', () => {
  const dbSchema: DbSchema = {
    userNames: ['foo', 'bar'],
    parameters: {
      stringParam: 'something',
      intParam: 1337,
      mapParam: {
        property: 'value',
      },
    },
  };

  test('Correctly completes parameters, avoids existing user names in CREATE USER', () => {
    const query = 'CREATE USER ';

    testCompletions({
      query,
      dbSchema,
      expected: [{ label: '$stringParam', kind: CompletionItemKind.Variable }],
      // do not suggest non-string parameters or existing user names
      excluded: [
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
        { label: 'foo', kind: CompletionItemKind.Value },
        { label: 'bar', kind: CompletionItemKind.Value },
      ],
    });
  });

  test('Correctly completes parameters and existing user names in DROP USER', () => {
    const query = 'DROP USER ';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: 'foo', kind: CompletionItemKind.Value },
        { label: 'bar', kind: CompletionItemKind.Value },
      ],
      // do not suggest non-string parameters or existing user names
      excluded: [
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Correctly completes parameters and existing user names in ALTER USER', () => {
    const query = 'ALTER USER ';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: 'foo', kind: CompletionItemKind.Value },
        { label: 'bar', kind: CompletionItemKind.Value },
      ],
      // do not suggest non-string parameters or existing user names
      excluded: [
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Correctly completes parameters and existing user names in RENAME USER source', () => {
    const query = 'RENAME USER ';

    testCompletions({
      query,
      dbSchema,
      expected: [
        { label: '$stringParam', kind: CompletionItemKind.Variable },
        { label: 'foo', kind: CompletionItemKind.Value },
        { label: 'bar', kind: CompletionItemKind.Value },
      ],
      // do not suggest non-string parameters or existing user names
      excluded: [
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('Correctly completes parameters but not existing user names in RENAME USER target', () => {
    const query = 'RENAME USER user TO ';

    testCompletions({
      query,
      dbSchema,
      expected: [{ label: '$stringParam', kind: CompletionItemKind.Variable }],
      // do not suggest non-string parameters or existing user names
      excluded: [
        { label: '$intParam', kind: CompletionItemKind.Variable },
        { label: '$mapParam', kind: CompletionItemKind.Variable },
        { label: 'foo', kind: CompletionItemKind.Value },
        { label: 'bar', kind: CompletionItemKind.Value },
      ],
    });
  });

  test('Correctly completes parameters and existing user names in SHOW USER PRIVILEGES', () => {
    const cases = ['SHOW USER ', 'SHOW USER user, '];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing user names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
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

  test('Correctly completes parameters and existing user names in GRANT ROLE TO USER', () => {
    const cases = ['GRANT ROLE abc TO ', 'GRANT ROLE abc TO user, '];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing user names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing user names in REVOKE ROLE FROM USER', () => {
    const cases = ['REVOKE ROLE abc FROM ', 'REVOKE ROLE abc FROM user, '];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing user names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing user names in GRANT SHOW', () => {
    const cases = [
      'GRANT SHOW TRANSACTION ( ',
      'GRANT SHOW TRANSACTION (user, ',
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
        // do not suggest non-string parameters or existing user names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing user names in GRANT dbms privilege', () => {
    const cases = ['GRANT IMPERSONATE (', 'GRANT IMPERSONATE (user, '];

    cases.forEach((query) =>
      testCompletions({
        query,
        dbSchema,
        expected: [
          { label: '$stringParam', kind: CompletionItemKind.Variable },
          { label: 'foo', kind: CompletionItemKind.Value },
          { label: 'bar', kind: CompletionItemKind.Value },
        ],
        // do not suggest non-string parameters or existing user names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });

  test('Correctly completes parameters and existing user names in GRANT database privilege', () => {
    const cases = [
      'GRANT TERMINATE TRANSACTION (',
      'GRANT TERMINATE TRANSACTION (user, ',
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
        // do not suggest non-string parameters or existing user names
        excluded: [
          { label: '$intParam', kind: CompletionItemKind.Variable },
          { label: '$mapParam', kind: CompletionItemKind.Variable },
        ],
      }),
    );
  });
});
