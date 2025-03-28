import { validateParamInput } from '../../../src/commandHandlers/params';

suite('Execute commands spec', () => {
  //   let sandbox: sinon.SinonSandbox;
  //   let showInformationMessageStub: sinon.SinonStub;
  //   let showErrorMessageStub: sinon.SinonStub;

  suite.only('Parameter validation spec', () => {
    test('Parameter validation works as expected', async () => {
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
      await expect(validateParamInput('datetime()', dbSchema)).toBe(null);
      await expect(validateParamInput('500', dbSchema)).toBe(null);
      await expect(validateParamInput('datetime(', dbSchema)).toBe(
        'Invalid parameter value',
      );
      await expect(validateParamInput('500q', dbSchema)).toBe(
        'Invalid parameter value',
      );
    });
  });
});
