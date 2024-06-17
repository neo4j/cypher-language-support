import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as commandHandlers from '../../src/commandHandlers';
import * as contextService from '../../src/contextService';
import { SchemaPollerConnectionManager } from '../../src/schemaPollerConnectionManager';
import { MockConnectionManager } from '../mocks/mockConnectionManager';
import { MockExtensionContext } from '../mocks/mockExtensionContext';
import { MockLanguageClient } from '../mocks/mockLanguageClient';

suite('SchemaPoller Connection Manager spec', () => {
  let sandbox: sinon.SinonSandbox;

  let mockContext: MockExtensionContext;
  let mockLanguageClient: MockLanguageClient;
  let mockConnectionManager: MockConnectionManager;

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
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('Reconnecting event should call through to connectionReconnectingHandler', () => {
    const spy = sandbox.spy(commandHandlers, 'connectionReconnectingHandler');
    const manager = new SchemaPollerConnectionManager();

    manager._schemaPoller.events.emit(
      'schemaPoller.persistentConnect.reconnecting',
      'error',
    );

    sinon.assert.calledOnceWithExactly(spy, 'error');
  });

  test('Connected event should call through to connectionConnectedHandler', () => {
    const spy = sandbox.spy(commandHandlers, 'connectionConnectedHandler');
    const manager = new SchemaPollerConnectionManager();

    manager._schemaPoller.events.emit(
      'schemaPoller.persistentConnect.connected',
    );

    sinon.assert.calledOnce(spy);
  });
});
