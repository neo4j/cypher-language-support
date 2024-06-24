import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { commands, ConfigurationChangeEvent, window } from 'vscode';
import {
  configurationChangedHandler,
  onConnectionErroredHandler,
  onConnectionFailedHandler,
  onConnectionReconnectedHandler,
} from '../../src/commandHandlers';
import * as connection from '../../src/connectionService';
import { constants } from '../../src/constants';
import * as contextService from '../../src/contextService';
import { getMockConnection } from '../helpers';
import { MockConnectionManager } from '../mocks/mockConnectionManager';
import { MockExtensionContext } from '../mocks/mockExtensionContext';
import { MockLanguageClient } from '../mocks/mockLanguageClient';

suite('Command handlers spec', () => {
  let sandbox: sinon.SinonSandbox;

  let mockContext: MockExtensionContext;
  let mockLanguageClient: MockLanguageClient;
  let mockConnectionManager: MockConnectionManager;

  let getCurrentConnectionStub: sinon.SinonStub;
  let executeCommandStub: sinon.SinonStub;
  let showErrorMessageStub: sinon.SinonStub;
  let showWarningMessageStub: sinon.SinonStub;
  let showInformationMessageStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    mockContext = new MockExtensionContext();
    mockLanguageClient = new MockLanguageClient();
    mockConnectionManager = new MockConnectionManager();

    executeCommandStub = sandbox.stub(commands, 'executeCommand');
    showErrorMessageStub = sandbox.stub(window, 'showErrorMessage');
    showWarningMessageStub = sandbox.stub(window, 'showWarningMessage');
    showInformationMessageStub = sandbox.stub(window, 'showInformationMessage');

    sandbox.stub(contextService, 'getExtensionContext').returns(mockContext);
    sandbox
      .stub(contextService, 'getLanguageClient')
      .returns(mockLanguageClient);
    sandbox
      .stub(contextService, 'getDatabaseConnectionManager')
      .returns(mockConnectionManager);

    const setContextStub = sandbox.stub(contextService, 'setContext');

    setContextStub(mockContext, mockLanguageClient);
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('Should notify language server on configuration change event affecting neo4j settings', async () => {
    const sendNotificationSpy = sandbox.spy(
      mockLanguageClient,
      'sendNotification',
    );

    getCurrentConnectionStub = sandbox
      .stub(connection, 'getCurrentConnection')
      .returns(getMockConnection(true));

    await configurationChangedHandler({
      affectsConfiguration: () => true,
    } as ConfigurationChangeEvent);

    sandbox.assert.calledOnceWithExactly(
      sendNotificationSpy,
      'connectionUpdated',
      {
        trace: { server: 'off' },
        connect: true,
        connectURL: 'neo4j://localhost:7687',
        database: 'neo4j',
        user: 'neo4j',
        password: null,
      },
    );
  });

  test('Should not notify language server on configuration change event not affecting neo4j settings', async () => {
    const sendNotificationSpy = sandbox.spy(
      mockLanguageClient,
      'sendNotification',
    );

    getCurrentConnectionStub = sandbox
      .stub(connection, 'getCurrentConnection')
      .returns(null);

    await configurationChangedHandler({
      affectsConfiguration: () => false,
    } as ConfigurationChangeEvent);

    sandbox.assert.notCalled(sendNotificationSpy);
    sandbox.assert.notCalled(getCurrentConnectionStub);
  });

  test('Should not notify language server on configuration change event if there is no current connection', async () => {
    const sendNotificationSpy = sandbox.spy(
      mockLanguageClient,
      'sendNotification',
    );

    getCurrentConnectionStub = sandbox
      .stub(connection, 'getCurrentConnection')
      .returns(null);

    await configurationChangedHandler({
      affectsConfiguration: () => true,
    } as ConfigurationChangeEvent);

    sandbox.assert.notCalled(sendNotificationSpy);
  });

  test('onConnectionReconnectedHandler should update a connection state to connected', async () => {
    const mockConnection = getMockConnection(true);
    await connection.saveConnection({
      ...mockConnection,
      state: 'error',
    });

    await onConnectionReconnectedHandler();
    const updatedConnection = connection.getConnection(mockConnection.key);

    assert.strictEqual(updatedConnection.state, 'connected');
    sandbox.assert.calledOnceWithExactly(
      showInformationMessageStub,
      constants.MESSAGES.RECONNECTED_MESSAGE,
    );
    sandbox.assert.calledWithExactly(
      executeCommandStub,
      constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
  });

  test('onConnectionErroredHandler should update a connection state to error and display a warning message', async () => {
    const mockConnection = getMockConnection(true);
    await connection.saveConnection(mockConnection);

    await onConnectionErroredHandler('error message');
    const updatedConnection = connection.getConnection(mockConnection.key);

    assert.strictEqual(updatedConnection.state, 'error');
    sandbox.assert.calledOnceWithExactly(
      showWarningMessageStub,
      'error message',
    );
    sandbox.assert.calledWithExactly(
      executeCommandStub,
      constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
  });

  test('onConnectionFailedHandler should update a connection state to disconnected and display an error message', async () => {
    const mockConnection = getMockConnection(true);
    await connection.saveConnection(mockConnection);

    await onConnectionFailedHandler('error message');
    const updatedConnection = connection.getConnection(mockConnection.key);

    assert.strictEqual(updatedConnection.state, 'disconnected');
    sandbox.assert.calledOnceWithExactly(showErrorMessageStub, 'error message');
    sandbox.assert.calledWithExactly(
      executeCommandStub,
      constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
  });
});
