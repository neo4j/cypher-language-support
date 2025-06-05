import { DbSchema, testData } from '@neo4j-cypher/language-support';
import assert from 'assert';
import { validateParamInput } from '../../../src/commandHandlers/params';

suite('Parameter validation spec', () => {
  const dbSchema: DbSchema = {
    functions: {
      'CYPHER 5': {
        datetime: {
          ...testData.emptyFunction,
          name: 'datetime',
        },
        deprecatedFunction: {
          ...testData.emptyFunction,
          isDeprecated: true,
          name: 'deprecatedFunction',
        },
      },
    },
  };

  test('Parameter validation succeeds for correct inputs', () => {
    assert.strictEqual(validateParamInput('datetime()', dbSchema), undefined);
    assert.strictEqual(validateParamInput('500', dbSchema), undefined);
  });

  test('Parameter validation fails for incorrect inputs', () => {
    assert.strictEqual(
      validateParamInput('datetime(', dbSchema),
      "Value cannot be evaluated: Variable `datetime` not defined. Invalid input '(': expected an expression, ',', 'AS', 'ORDER BY', 'CALL', 'CREATE', 'LOAD CSV', 'DELETE', 'DETACH', 'FINISH', 'FOREACH', 'INSERT', 'LIMIT', 'MATCH', 'MERGE', 'NODETACH', 'OFFSET', 'OPTIONAL', 'REMOVE', 'RETURN', 'SET', 'SKIP', 'UNION', 'UNWIND', 'USE', 'WITH' or <EOF>",
    );
    assert.strictEqual(
      validateParamInput('500q', dbSchema),
      'Value cannot be evaluated: invalid literal number',
    );
    assert.strictEqual(
      validateParamInput('1 + ', dbSchema),
      `Value cannot be evaluated: Invalid input '': expected an expression`,
    );
  });

  test('Parameter validation succeeds on warnings', () => {
    assert.strictEqual(
      validateParamInput('deprecatedFunction()', dbSchema),
      undefined,
    );
  });
});
