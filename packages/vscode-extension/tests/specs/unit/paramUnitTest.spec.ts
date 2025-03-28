import assert from 'assert';
import { validateParamInput } from '../../../src/commandHandlers/params';

suite('Execute commands spec', () => {
  //   let sandbox: sinon.SinonSandbox;
  //   let showInformationMessageStub: sinon.SinonStub;
  //   let showErrorMessageStub: sinon.SinonStub;

  suite.only('Parameter validation spec', () => {
    test('Parameter validation works as expected', () => {
      const emptyFunction = {
        name: '',
        category: '',
        description: '',
        isBuiltIn: false,
        argumentDescription: [],
        returnDescription: '',
        signature: '',
        aggregating: false,
        isDeprecated: false,
      };
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
              ...emptyFunction,
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
        'Invalid parameter value',
      );
      assert.strictEqual(
        validateParamInput('500q', dbSchema),
        'Invalid parameter value',
      );
    });
  });
});
