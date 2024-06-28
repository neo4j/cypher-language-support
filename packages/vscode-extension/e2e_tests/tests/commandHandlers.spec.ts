import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { commands, ConfigurationChangeEvent, window } from 'vscode';
import {
  disconnectDatabaseConnectionOnExtensionDeactivation,
  handleNeo4jConfigurationChangedEvent,
  reconnectDatabaseConnectionOnExtensionActivation,
  saveConnectionStateAsConnectedAndShowInfoMessage,
  saveConnectionStateAsDisconnectedAndShowErrorMessage,
  saveConnectionStateAsErroredAndShowWarningMessage,
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

  let getActiveConnectionStub: sinon.SinonStub;
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

    getActiveConnectionStub = sandbox
      .stub(connection, 'getActiveConnection')
      .returns(getMockConnection(true));

    await handleNeo4jConfigurationChangedEvent({
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

    getActiveConnectionStub = sandbox
      .stub(connection, 'getActiveConnection')
      .returns(null);

    await handleNeo4jConfigurationChangedEvent({
      affectsConfiguration: () => false,
    } as ConfigurationChangeEvent);

    sandbox.assert.notCalled(sendNotificationSpy);
    sandbox.assert.notCalled(getActiveConnectionStub);
  });

  test('Should not notify language server on configuration change event if there is no active Connection', async () => {
    const sendNotificationSpy = sandbox.spy(
      mockLanguageClient,
      'sendNotification',
    );

    getActiveConnectionStub = sandbox
      .stub(connection, 'getActiveConnection')
      .returns(null);

    await handleNeo4jConfigurationChangedEvent({
      affectsConfiguration: () => true,
    } as ConfigurationChangeEvent);

    sandbox.assert.notCalled(sendNotificationSpy);
  });

  test('Should update a Connection state to active when saveConnectionStateAsConnectedAndShowInfoMessage is called', async () => {
    const mockConnection = getMockConnection(true);
    await connection.saveConnection({
      ...mockConnection,
      state: 'error',
    });

    await saveConnectionStateAsConnectedAndShowInfoMessage();
    const updatedConnection = connection.getConnectionByKey(mockConnection.key);

    assert.strictEqual(updatedConnection.state, 'active');
    sandbox.assert.calledOnceWithExactly(
      showInformationMessageStub,
      constants.MESSAGES.RECONNECTED_MESSAGE,
    );
    sandbox.assert.calledWithExactly(
      executeCommandStub,
      constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
  });

  test('Should update a Connection state to error and display a warning message when saveConnectionStateAsErroredAndShowWarningMessage is called', async () => {
    const mockConnection = getMockConnection(true);
    await connection.saveConnection(mockConnection);

    await saveConnectionStateAsErroredAndShowWarningMessage('error message');
    const updatedConnection = connection.getConnectionByKey(mockConnection.key);

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

  test('Should update a Connection state to inactive and display an error message when saveConnectionStateAsDisconnectedAndShowErrorMessage is called', async () => {
    const mockConnection = getMockConnection(true);
    await connection.saveConnection(mockConnection);

    await saveConnectionStateAsDisconnectedAndShowErrorMessage('error message');
    const updatedConnection = connection.getConnectionByKey(mockConnection.key);

    assert.strictEqual(updatedConnection.state, 'inactive');
    sandbox.assert.calledOnceWithExactly(showErrorMessageStub, 'error message');
    sandbox.assert.calledWithExactly(
      executeCommandStub,
      constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
  });

  test('Should handle no active Connection when reconnectDatabaseConnectionOnExtensionActivation is called', () => {
    sandbox.stub(connection, 'getActiveConnection').returns(null);
    const saveConnectionAndUpdateDatabaseConnectionSpy = sandbox.spy(
      connection,
      'saveConnectionAndUpdateDatabaseConnection',
    );
    const getPasswordForConnectionSpy = sandbox.spy(
      connection,
      'getPasswordForConnection',
    );

    const promise = reconnectDatabaseConnectionOnExtensionActivation();

    assert.doesNotThrow(async () => await promise);
    sandbox.assert.notCalled(saveConnectionAndUpdateDatabaseConnectionSpy);
    sandbox.assert.notCalled(getPasswordForConnectionSpy);
  });

  test('Should activate a previously active Connection when reconnectDatabaseConnectionOnExtensionActivation is called', async () => {
    const mockConnection = getMockConnection(true);
    sandbox
      .stub(connection, 'getActiveConnection')
      .returns({ ...mockConnection, state: 'active' });
    const getPasswordForConnection = sandbox
      .stub(connection, 'getPasswordForConnection')
      .resolves('password');
    const saveConnectionAndUpdateDatabaseConnectionSpy = sandbox.spy(
      connection,
      'saveConnectionAndUpdateDatabaseConnection',
    );
    const sendNotificationSpy = sandbox.spy(
      mockLanguageClient,
      'sendNotification',
    );

    await reconnectDatabaseConnectionOnExtensionActivation();

    sandbox.assert.calledOnceWithExactly(
      saveConnectionAndUpdateDatabaseConnectionSpy,
      { ...mockConnection, state: 'activating' },
      'password',
    );
    sandbox.assert.calledOnce(getPasswordForConnection);
    sandbox.assert.calledOnceWithExactly(
      showInformationMessageStub,
      constants.MESSAGES.CONNECTED_MESSAGE,
    );
    sandbox.assert.calledOnceWithExactly(
      sendNotificationSpy,
      'connectionUpdated',
      {
        trace: { server: 'off' },
        connect: true,
        connectURL: 'neo4j://localhost:7687',
        database: 'neo4j',
        user: 'neo4j',
        password: 'password',
      },
    );
  });

  test('Should deactivate a currently active Connection when disconnectDatabaseConnectionOnExtensionDeactivation is called', async () => {
    const mockConnection = getMockConnection(true);
    sandbox.stub(connection, 'getActiveConnection').returns(mockConnection);
    sandbox.stub(connection, 'getPasswordForConnection').resolves('password');
    const sendNotificationSpy = sandbox.spy(
      mockLanguageClient,
      'sendNotification',
    );

    await disconnectDatabaseConnectionOnExtensionDeactivation();

    sandbox.assert.calledOnceWithExactly(
      sendNotificationSpy,
      'connectionDisconnected',
    );
  });
});
