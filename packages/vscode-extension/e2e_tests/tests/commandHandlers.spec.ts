import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';

import { commands, ConfigurationChangeEvent, window } from 'vscode';
import {
  configurationChangedHandler,
  connectionConnectedHandler,
  connectionReconnectingHandler,
} from '../../src/commandHandlers';
import * as connectionService from '../../src/connectionService';
import { constants } from '../../src/constants';
import * as contextService from '../../src/contextService';
import { getMockConnection } from '../helpers';
import { MockConnectionManager } from '../mocks/mockConnectionManager';
import { MockExtensionContext } from '../mocks/mockExtensionContext';
import { MockLanguageClient } from '../mocks/mockLanguageClient';

suite('Command handlers', () => {
  let sandbox: sinon.SinonSandbox;

  let mockContext: MockExtensionContext;
  let mockLanguageClient: MockLanguageClient;
  let mockConnectionManager: MockConnectionManager;

  let getCurrentConnectionStub: sinon.SinonStub;
  let showInformationMessageStub: sinon.SinonStub;
  let showErrorMessageStub: sinon.SinonStub;
  let executeCommandStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    mockContext = new MockExtensionContext();
    mockLanguageClient = new MockLanguageClient();
    mockConnectionManager = new MockConnectionManager();

    sandbox.stub(contextService, 'getExtensionContext').returns(mockContext);
    sandbox
      .stub(contextService, 'getLanguageClient')
      .returns(mockLanguageClient);
    sandbox
      .stub(contextService, 'getConnectionManager')
      .returns(mockConnectionManager);

    const setContextStub = sandbox.stub(contextService, 'setContext');

    setContextStub(mockContext, mockLanguageClient);
    showInformationMessageStub = sandbox.stub(window, 'showInformationMessage');
    showErrorMessageStub = sandbox.stub(window, 'showErrorMessage');
    executeCommandStub = sandbox.stub(commands, 'executeCommand');
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
      .stub(connectionService, 'getCurrentConnection')
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
      .stub(connectionService, 'getCurrentConnection')
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
      .stub(connectionService, 'getCurrentConnection')
      .returns(null);

    await configurationChangedHandler({
      affectsConfiguration: () => true,
    } as ConfigurationChangeEvent);

    sandbox.assert.notCalled(sendNotificationSpy);
  });

  test('Should call updateConnectionState with connected state when handling a connected event', async () => {
    const updateConnectionStateSpy = sandbox.spy(
      connectionService,
      'updateConnectionState',
    );
    const mockConnection = getMockConnection(true);
    await connectionService.saveConnection(mockConnection, 'password');

    await connectionConnectedHandler();

    sandbox.assert.calledOnceWithExactly(updateConnectionStateSpy, {
      ...mockConnection,
      state: 'connected',
    });

    sandbox.assert.calledOnceWithExactly(
      showInformationMessageStub,
      constants.MESSAGES.CONNECTED_MESSAGE,
    );

    sandbox.assert.calledOnceWithExactly(
      executeCommandStub,
      constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
  });

  test('Should call updateConnectionState with reconnecting state when handling a reconnecting event', async () => {
    const updateConnectionStateSpy = sandbox.spy(
      connectionService,
      'updateConnectionState',
    );
    const mockConnection = getMockConnection(true);
    await connectionService.saveConnection(mockConnection, 'password');

    await connectionReconnectingHandler('error');

    sandbox.assert.calledOnceWithExactly(updateConnectionStateSpy, {
      ...mockConnection,
      state: 'reconnecting',
    });

    sandbox.assert.calledOnceWithExactly(showErrorMessageStub, 'error');

    sandbox.assert.calledOnceWithExactly(
      executeCommandStub,
      constants.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
  });
});
