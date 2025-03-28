import { testData } from '../../../../language-support/src/tests/testData';
import { validateParamInput } from '../../../src/commandHandlers/params';

suite('Execute commands spec', () => {
  //   let sandbox: sinon.SinonSandbox;
  //   let showInformationMessageStub: sinon.SinonStub;
  //   let showErrorMessageStub: sinon.SinonStub;

  beforeEach(() => {
    // sandbox = sinon.createSandbox();
    // showInformationMessageStub = sandbox.stub(window, 'showInformationMessage');
    // showErrorMessageStub = sandbox.stub(window, 'showErrorMessage');
  });

  afterEach(() => {
    // sandbox.restore();
  });

  suite.only('Parameter validation spec', () => {
    test('Parameter validation works as expected', async () => {
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
