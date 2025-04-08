import { afterEach, beforeEach } from 'mocha';
import { Integer, Record } from 'neo4j-driver';
import * as sinon from 'sinon';
import { window } from 'vscode';
import {
  addParameter,
  removeParameterWithKey,
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
      CONSTANTS.MESSAGES.ERROR_DISCONNECTED_PARAMS,
    );
  });

  test('Adding parameters should fail if the name of the parameter is empty', async () => {
    sandbox.stub(window, 'showInputBox').resolves(undefined);
    await addParameter();
    sandbox.assert.calledOnceWithExactly(
      showErrorMessageStub,
      CONSTANTS.MESSAGES.ERROR_EMPTY_PARAMETER,
    );
  });

  test('Adding parameters should refresh the VSCode panel', async () => {
    const refreshParameterTreeSpy = sandbox.spy(
      parametersTreeDataProvider,
      'refresh',
    );

    sandbox
      .stub(window, 'showInputBox')
      .onFirstCall()
      .resolves('a')
      .onSecondCall()
      .resolves('"charmander"');

    await addParameter();
    sandbox.assert.calledOnce(refreshParameterTreeSpy);
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

  test('Clearing parameters should notify the language server', async () => {
    sandbox
      .stub(window, 'showInputBox')
      .onFirstCall()
      .resolves('a')
      .onSecondCall()
      .resolves('"charmander"');

    await addParameter();

    sendNotificationSpy.resetHistory();
    await removeParameterWithKey('a');

    sandbox.assert.calledOnceWithExactly(
      sendNotificationSpy,
      'updateParameters',
      {},
    );
  });
});
