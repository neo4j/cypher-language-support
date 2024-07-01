import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { ConfigurationChangeEvent } from 'vscode';
import { handleNeo4jConfigurationChangedEvent } from '../../src/commandHandlers';
import * as connection from '../../src/connectionService';
import * as contextService from '../../src/contextService';
import { getMockConnection } from '../helpers';
import { MockExtensionContext } from '../mocks/mockExtensionContext';
import { MockLanguageClient } from '../mocks/mockLanguageClient';
import { MockSchemaPoller } from '../mocks/mockSchemaPoller';

suite('Command handlers spec', () => {
  let sandbox: sinon.SinonSandbox;

  let mockContext: MockExtensionContext;
  let mockLanguageClient: MockLanguageClient;
  let mockSchemaPoller: MockSchemaPoller;

  let getActiveConnectionStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    mockContext = new MockExtensionContext();
    mockLanguageClient = new MockLanguageClient();
    mockSchemaPoller = new MockSchemaPoller();

    sandbox.stub(contextService, 'getExtensionContext').returns(mockContext);
    sandbox
      .stub(contextService, 'getLanguageClient')
      .returns(mockLanguageClient);
    sandbox.stub(contextService, 'getSchemaPoller').returns(mockSchemaPoller);

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
});
