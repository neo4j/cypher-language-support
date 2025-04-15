import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import { Integer, Record } from 'neo4j-driver';
import * as sinon from 'sinon';
import { window } from 'vscode';
import {
  addParameter,
  clearAllParameters,
  editParameter,
  removeParameterByKey,
} from '../../../src/commandHandlers/params';
import { CONSTANTS } from '../../../src/constants';
import { parametersTreeDataProvider } from '../../../src/treeviews/parametersTreeDataProvider';
import { MockLanguageClient } from '../../mocks/mockLanguageClient';
import { MockSchemaPoller } from '../../mocks/mockSchemaPoller';
import { setupMockContextStubs } from '../../mocks/setupMockContextStubs';

suite('Parameters command handlers spec', () => {
  let sandbox: sinon.SinonSandbox;

  let mockLanguageClient: MockLanguageClient;
  let mockSchemaPoller: MockSchemaPoller;

  let showErrorMessageStub: sinon.SinonStub;
  let runCypherQueryStub: sinon.SinonStub;
  let sendNotificationSpy: sinon.SinonSpy;
  let refreshParameterTreeSpy: sinon.SinonSpy;

  function getParametersTreeItems() {
    const parameters = parametersTreeDataProvider.getChildren().map((value) => {
      return {
        label: value.label,
        id: value.id,
        contextValue: value.contextValue,
      };
    });

    return parameters;
  }

  async function setParameters(args: { spiesCleanUp: boolean }) {
    sandbox
      .stub(window, 'showInputBox')
      .onCall(0)
      .resolves('a')
      .onCall(1)
      .resolves('"charmander"')
      .onCall(2)
      .resolves('b')
      .onCall(3)
      .resolves('"pikachu"')
      .onCall(4)
      .resolves('1234');

    await addParameter();
    await addParameter();

    if (args.spiesCleanUp) {
      refreshParameterTreeSpy.resetHistory();
      sendNotificationSpy.resetHistory();
    }
  }

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    const stubs = setupMockContextStubs(sandbox);

    mockLanguageClient = stubs.mockLanguageClient;
    mockSchemaPoller = stubs.mockSchemaPoller;

    runCypherQueryStub = sandbox.stub();
    runCypherQueryStub
      .withArgs({ query: 'RETURN "charmander" AS param', parameters: {} })
      .resolves({
        records: [new Record(['param'], ['charmander'])],
        summary: undefined,
        recordLimitHit: false,
      });

    runCypherQueryStub
      .withArgs({ query: 'RETURN "pikachu" AS param', parameters: {} })
      .resolves({
        records: [new Record(['param'], ['pikachu'])],
        summary: undefined,
        recordLimitHit: false,
      });

    runCypherQueryStub
      .withArgs({ query: 'RETURN 1234 AS param', parameters: {} })
      .resolves({
        records: [new Record(['param'], [Integer.fromInt(1234)])],
        summary: undefined,
        recordLimitHit: false,
      });

    sandbox.stub(mockSchemaPoller, 'connection').value({
      databases: [{ name: 'neo4j', type: 'standard' }],
      currentDb: 'neo4j',
      runCypherQuery: runCypherQueryStub,
      healthcheck: sandbox.stub().resolves(true),
    });

    showErrorMessageStub = sandbox.stub(window, 'showErrorMessage');
    sendNotificationSpy = sandbox.spy(mockLanguageClient, 'sendNotification');
    refreshParameterTreeSpy = sandbox.spy(
      parametersTreeDataProvider,
      'refresh',
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('Adding parameters should fail if not connected to the database', async () => {
    sandbox.stub(mockSchemaPoller, 'connection').value({
      healthcheck: sandbox.stub().resolves(false),
    });

    await addParameter();
    sandbox.assert.calledOnceWithExactly(
      showErrorMessageStub,
      CONSTANTS.MESSAGES.ERROR_DISCONNECTED_SET_PARAMS,
    );
  });

  test('Adding parameters should fail if the name of the parameter is undefined (Esc key pressed)', async () => {
    sandbox.stub(window, 'showInputBox').resolves(undefined);

    await addParameter();
    sandbox.assert.calledOnceWithExactly(
      showErrorMessageStub,
      CONSTANTS.MESSAGES.ERROR_EMPTY_PARAM_NAME,
    );
  });

  test('Adding parameters should fail if the name of the parameter is empty', async () => {
    sandbox.stub(window, 'showInputBox').resolves('');

    await addParameter();
    sandbox.assert.calledOnceWithExactly(
      showErrorMessageStub,
      CONSTANTS.MESSAGES.ERROR_EMPTY_PARAM_NAME,
    );
  });

  test('Adding parameters should fail if the value of the parameter is undefined (Esc key pressed)', async () => {
    sandbox
      .stub(window, 'showInputBox')
      .onFirstCall()
      .resolves('a')
      .onSecondCall()
      .resolves(undefined);

    await addParameter();
    sandbox.assert.calledOnceWithExactly(
      showErrorMessageStub,
      CONSTANTS.MESSAGES.ERROR_EMPTY_PARAM_VALUE,
    );
  });

  test('Adding parameters should fail if the value of the parameter is empty', async () => {
    sandbox
      .stub(window, 'showInputBox')
      .onFirstCall()
      .resolves('a')
      .onSecondCall()
      .resolves('');

    await addParameter();
    sandbox.assert.calledOnceWithExactly(
      showErrorMessageStub,
      CONSTANTS.MESSAGES.ERROR_EMPTY_PARAM_VALUE,
    );
  });

  test('Adding parameters should refresh the VSCode parameters panel', async () => {
    await setParameters({ spiesCleanUp: false });
    const parameters = getParametersTreeItems();
    sandbox.assert.calledTwice(refreshParameterTreeSpy);
    assert.deepStrictEqual(parameters, [
      {
        label: 'a: "charmander" (String)',
        id: 'a',
        contextValue: 'parameter',
      },
      {
        label: 'b: "pikachu" (String)',
        id: 'b',
        contextValue: 'parameter',
      },
    ]);
  });

  test('Adding parameters should notify the language server', async () => {
    sandbox
      .stub(window, 'showInputBox')
      .onFirstCall()
      .resolves('a')
      .onSecondCall()
      .resolves('"charmander"');

    await addParameter();
    sandbox.assert.calledOnceWithExactly(
      sendNotificationSpy,
      'updateParameters',
      {
        a: 'charmander',
      },
    );
  });

  test('Editing parameters should fail if not connected to the database', async () => {
    sandbox.stub(mockSchemaPoller, 'connection').value({
      healthcheck: sandbox.stub().resolves(false),
    });
    await editParameter({ label: 'a' });
    sandbox.assert.calledOnceWithExactly(
      showErrorMessageStub,
      CONSTANTS.MESSAGES.ERROR_DISCONNECTED_EDIT_PARAMS,
    );
  });

  test('Editing parameters should fail if the new value is empty', async () => {
    sandbox
      .stub(window, 'showInputBox')
      .onFirstCall()
      .resolves('a')
      .onSecondCall()
      .resolves('"charmander"')
      .onThirdCall()
      .resolves('');

    await addParameter();

    const param = parametersTreeDataProvider
      .getChildren()
      .find((param) => param.id === 'a');
    await editParameter(param);
    sandbox.assert.calledOnceWithExactly(
      showErrorMessageStub,
      CONSTANTS.MESSAGES.ERROR_EMPTY_PARAM_VALUE,
    );
  });

  test('Editing parameters should fail if the new value is undefined (Esc key pressed)', async () => {
    sandbox
      .stub(window, 'showInputBox')
      .onFirstCall()
      .resolves('a')
      .onSecondCall()
      .resolves('"charmander"')
      .onThirdCall()
      .resolves(undefined);

    await addParameter();

    const param = parametersTreeDataProvider
      .getChildren()
      .find((param) => param.id === 'a');
    await editParameter(param);
    sandbox.assert.calledOnceWithExactly(
      showErrorMessageStub,
      CONSTANTS.MESSAGES.ERROR_EMPTY_PARAM_VALUE,
    );
  });

  test('Editing parameters should refresh the VSCode parameters panel', async () => {
    await setParameters({ spiesCleanUp: true });

    const param = parametersTreeDataProvider
      .getChildren()
      .find((param) => param.id === 'a');
    await editParameter(param);

    const parameters = getParametersTreeItems();
    sandbox.assert.calledOnce(refreshParameterTreeSpy);
    assert.deepStrictEqual(parameters, [
      {
        label: 'a: 1234 (Integer)',
        id: 'a',
        contextValue: 'parameter',
      },
      {
        label: 'b: "pikachu" (String)',
        id: 'b',
        contextValue: 'parameter',
      },
    ]);
  });

  test('Editing parameters should notify the language server', async () => {
    await setParameters({ spiesCleanUp: true });

    const param = parametersTreeDataProvider
      .getChildren()
      .find((param) => param.id === 'a');
    await editParameter(param);

    sandbox.assert.calledOnceWithExactly(
      sendNotificationSpy,
      'updateParameters',
      { a: Integer.fromInt(1234), b: 'pikachu' },
    );
  });

  test('Removing a single parameter should notify the language server', async () => {
    await setParameters({ spiesCleanUp: true });
    await removeParameterByKey('a');

    sandbox.assert.calledOnceWithExactly(
      sendNotificationSpy,
      'updateParameters',
      { b: 'pikachu' },
    );
  });

  test('Removing a single parameter should refresh the VSCode parameters panel', async () => {
    await setParameters({ spiesCleanUp: true });
    await removeParameterByKey('a');

    const parameters = getParametersTreeItems();
    sandbox.assert.calledOnce(refreshParameterTreeSpy);
    assert.deepStrictEqual(parameters, [
      {
        label: 'b: "pikachu" (String)',
        id: 'b',
        contextValue: 'parameter',
      },
    ]);
  });

  test('Clearing all parameters should notify the language server', async () => {
    await setParameters({ spiesCleanUp: true });
    await clearAllParameters();
    sandbox.assert.calledOnceWithExactly(
      sendNotificationSpy,
      'updateParameters',
      {},
    );
  });

  test('Clearing all parameters should refresh the VSCode parameters panel', async () => {
    await setParameters({ spiesCleanUp: true });
    await clearAllParameters();
    sandbox.assert.calledOnce(refreshParameterTreeSpy);

    const parameters = getParametersTreeItems();
    sandbox.assert.calledOnce(refreshParameterTreeSpy);
    assert.deepStrictEqual(parameters, []);
  });
});
