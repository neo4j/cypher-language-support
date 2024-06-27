import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { commands, ConfigurationChangeEvent, window } from 'vscode';
import {
  connectOrDisconnectCurrentConnectionOnLifecycleChange,
  handleNeo4jConfigurationChangedEvent,
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

    getCurrentConnectionStub = sandbox
      .stub(connection, 'getCurrentConnection')
      .returns(null);

    await handleNeo4jConfigurationChangedEvent({
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

    await handleNeo4jConfigurationChangedEvent({
      affectsConfiguration: () => true,
    } as ConfigurationChangeEvent);

    sandbox.assert.notCalled(sendNotificationSpy);
  });

  test('Should update a connection state to connected when saveConnectionStateAsConnectedAndShowInfoMessage is called', async () => {
    const mockConnection = getMockConnection(true);
    await connection.saveConnection({
      ...mockConnection,
      state: 'error',
    });

    await saveConnectionStateAsConnectedAndShowInfoMessage();
    const updatedConnection = connection.getConnectionByKey(mockConnection.key);

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

  test('Should update a connection state to error and display a warning message when saveConnectionStateAsErroredAndShowWarningMessage is called', async () => {
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

  test('Should update a connection state to disconnected and display an error message when saveConnectionStateAsDisconnectedAndShowErrorMessage is called', async () => {
    const mockConnection = getMockConnection(true);
    await connection.saveConnection(mockConnection);

    await saveConnectionStateAsDisconnectedAndShowErrorMessage('error message');
    const updatedConnection = connection.getConnectionByKey(mockConnection.key);

    assert.strictEqual(updatedConnection.state, 'disconnected');
    sandbox.assert.calledOnceWithExactly(showErrorMessageStub, 'error message');
    sandbox.assert.calledWithExactly(
      executeCommandStub,
      constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
  });

  test('Should handle no existing connections when connectOrDisconnectCurrentConnectionOnLifecycleChange is called', () => {
    sandbox.stub(connection, 'getCurrentConnection').returns(null);
    const saveConnectionAndUpdateDatabaseConnectionSpy = sandbox.spy(
      connection,
      'saveConnectionAndUpdateDatabaseConnection',
    );
    const getPasswordForConnectionSpy = sandbox.spy(
      connection,
      'getPasswordForConnection',
    );

    const promise = connectOrDisconnectCurrentConnectionOnLifecycleChange(true);

    assert.doesNotThrow(async () => await promise);
    sandbox.assert.notCalled(saveConnectionAndUpdateDatabaseConnectionSpy);
    sandbox.assert.notCalled(getPasswordForConnectionSpy);
  });

  test('Should reconnect a previously connected Connection when connectOrDisconnectCurrentConnectionOnLifecycleChange is called', async () => {
    const mockConnection = getMockConnection(true);
    sandbox
      .stub(connection, 'getCurrentConnection')
      .returns({ ...mockConnection, state: 'disconnected' });
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

    await connectOrDisconnectCurrentConnectionOnLifecycleChange(true);

    sinon.assert.calledOnceWithExactly(
      saveConnectionAndUpdateDatabaseConnectionSpy,
      { ...mockConnection, state: 'connecting' },
      'password',
    );
    sinon.assert.calledOnce(getPasswordForConnection);
    sinon.assert.calledOnceWithExactly(
      showInformationMessageStub,
      constants.MESSAGES.CONNECTED_MESSAGE,
    );
    sinon.assert.calledOnceWithExactly(
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

  test('should disconnect a currently connected Connection when connectOrDisconnectCurrentConnectionOnLifecycleChange is called', async () => {
    const mockConnection = getMockConnection(true);
    sandbox.stub(connection, 'getCurrentConnection').returns(mockConnection);
    sandbox.stub(connection, 'getPasswordForConnection').resolves('password');
    const sendNotificationSpy = sandbox.spy(
      mockLanguageClient,
      'sendNotification',
    );

    await connectOrDisconnectCurrentConnectionOnLifecycleChange(false);

    sinon.assert.calledOnceWithExactly(
      sendNotificationSpy,
      'connectionUpdated',
      {
        trace: { server: 'off' },
        connect: false,
        connectURL: 'neo4j://localhost:7687',
        database: 'neo4j',
        user: 'neo4j',
        password: 'password',
      },
    );
  });
});
