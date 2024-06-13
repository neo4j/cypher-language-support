import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { configurationChangedHandler } from '../../src/commandHandlers';
import * as connectionService from '../../src/connectionService';
import * as contextService from '../../src/contextService';
import { MethodName } from '../../src/languageClientService';
import { getMockConnection } from '../helpers';
import { MockExtensionContext } from '../mocks/mockExtensionContext';
import { MockLanguageClient } from '../mocks/mockLanguageClient';

suite('Command handlers', () => {
  let sandbox: sinon.SinonSandbox;

  let mockContext: MockExtensionContext;
  let mockLanguageClient: MockLanguageClient;

  let getCurrentConnectionStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    mockContext = new MockExtensionContext();
    mockLanguageClient = new MockLanguageClient();

    sandbox.stub(contextService, 'getExtensionContext').returns(mockContext);
    sandbox
      .stub(contextService, 'getLanguageClient')
      .returns(mockLanguageClient);

    const setContextStub = sandbox.stub(contextService, 'setContext');

    setContextStub(mockContext, mockLanguageClient);
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('should send a notification if the configuration change affects neo4j settings', async () => {
    const sendNotificationSpy = sinon.spy(
      mockLanguageClient,
      'sendNotification',
    );

    getCurrentConnectionStub = sandbox
      .stub(connectionService, 'getCurrentConnection')
      .returns(getMockConnection('mock-key', true));

    await configurationChangedHandler({
      affectsConfiguration: () => true,
    } as vscode.ConfigurationChangeEvent);

    sinon.assert.calledOnceWithExactly(
      sendNotificationSpy,
      MethodName.ConnectionUpdated,
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

  test('should not send a notification if there is no current connection', async () => {
    const sendNotificationSpy = sinon.spy(
      mockLanguageClient,
      'sendNotification',
    );

    getCurrentConnectionStub = sandbox
      .stub(connectionService, 'getCurrentConnection')
      .returns(null);

    await configurationChangedHandler({
      affectsConfiguration: () => true,
    } as vscode.ConfigurationChangeEvent);

    sinon.assert.notCalled(sendNotificationSpy);
  });

  test('should not send a notification if the configuration change does not affect neo4j settings', async () => {
    const sendNotificationSpy = sinon.spy(
      mockLanguageClient,
      'sendNotification',
    );

    getCurrentConnectionStub = sandbox
      .stub(connectionService, 'getCurrentConnection')
      .returns(null);

    await configurationChangedHandler({
      affectsConfiguration: () => false,
    } as vscode.ConfigurationChangeEvent);

    sinon.assert.notCalled(sendNotificationSpy);
    sinon.assert.notCalled(getCurrentConnectionStub);
  });
});
