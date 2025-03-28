import { testData } from '@neo4j-cypher/language-support';
import assert from 'assert';
import { validateParamInput } from '../../../src/commandHandlers/params';

suite('Parameter validation spec', () => {
  test('Parameter validation works as expected', () => {
    const dbSchema = {
      labels: [],
      relationshipTypes: [],
      databaseNames: [],
      aliasNames: [],
      userNames: [],
      roleNames: [],
      parameters: {},
      propertyKeys: [],
      procedures: {},
      functions: {
        'CYPHER 5': {
          datetime: {
            ...testData.emptyFunction,
            name: 'datetime',
          },
        },
      },
      defaultLanguage: 'CYPHER 5',
    };
    assert.strictEqual(validateParamInput('datetime()', dbSchema), null);
    assert.strictEqual(validateParamInput('datetime()', dbSchema), null);
    assert.strictEqual(validateParamInput('500', dbSchema), null);
    assert.strictEqual(
      validateParamInput('datetime(', dbSchema),
      "Value can not be evaluated: Invalid input 'datetime(': expected an expression, ')' or ','",
    );
    assert.strictEqual(
      validateParamInput('500q', dbSchema),
      "Value can not be evaluated: Invalid input '500q': expected an expression, ')' or ','",
    );
  });
});
