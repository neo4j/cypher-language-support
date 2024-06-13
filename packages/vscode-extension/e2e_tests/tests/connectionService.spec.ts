import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as connection from '../../src/connectionService';
import * as contextService from '../../src/contextService';
import { MethodName } from '../../src/languageClientService';
import { getMockConnection } from '../helpers';
import { MockExtensionContext } from '../mocks/mockExtensionContext';
import { MockLanguageClient } from '../mocks/mockLanguageClient';

suite('Connection service', () => {
  let sandbox: sinon.SinonSandbox;
  let mockContext: MockExtensionContext;
  let mockLanguageClient: MockLanguageClient;

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

  suite('getCurrentConnection', () => {
    test('should return null if there are no current connections', async () => {
      const mockConnection = getMockConnection();

      await connection.saveConnection(mockConnection, 'mock-password', false);

      const currentConnection = connection.getCurrentConnection();

      assert.strictEqual(currentConnection, null);
    });

    test('should return current connection', async () => {
      const mockConnection = getMockConnection('mock-key', true);

      await connection.saveConnection(mockConnection, 'mock-password', false);
      const currentConnection = connection.getCurrentConnection();

      assert.deepStrictEqual(currentConnection, mockConnection);
    });
  });

  suite('getAllConnections', () => {
    test('should return empty array when there are no connections', () => {
      const connections = connection.getAllConnections();

      assert.notStrictEqual(connections, []);
    });

    test('should return an array of connections when connections exist', async () => {
      const mockConnection = getMockConnection();

      await connection.saveConnection(mockConnection, 'mock-password', false);
      const connections = connection.getAllConnections();

      assert.deepStrictEqual(connections, [mockConnection]);
    });
  });

  suite('getConnection', () => {
    test('should return connection by key', async () => {
      const mockConnection = getMockConnection();
      const mockConnection2 = getMockConnection('mock-key-2');
      await connection.saveConnection(mockConnection, 'mock-password', false);
      await connection.saveConnection(mockConnection2, 'mock-password', false);

      const returnedConnection = connection.getConnection('mock-key');

      assert.deepStrictEqual(mockConnection, returnedConnection);
    });

    test('should return null when connection does not exist', async () => {
      const mockConnection = getMockConnection();

      await connection.saveConnection(mockConnection, 'mock-password', false);
      const returnedConnection = connection.getConnection('mock-key-two');

      assert.strictEqual(returnedConnection, null);
    });
  });

  suite('deleteConnection', () => {
    test('should handle non-existent connection', () => {
      const updateGlobalStateSpy = sinon.spy(mockContext.globalState, 'update');
      const storeSecretsSpy = sinon.spy(mockContext.secrets, 'store');
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );

      const promise = connection.deleteConnection('does-not-exist');

      assert.doesNotThrow(async () => await promise);
      sinon.assert.notCalled(updateGlobalStateSpy);
      sinon.assert.notCalled(storeSecretsSpy);
      sinon.assert.notCalled(sendNotificationSpy);
    });

    test('should delete connection', async () => {
      const mockConnection = getMockConnection();
      await connection.saveConnection(mockConnection, 'password', true);

      await connection.deleteConnection(mockConnection.key);
      const returnedConnection = connection.getConnection(mockConnection.key);

      assert.strictEqual(returnedConnection, null);
    });

    test('should delete password when deleting a connection', async () => {
      const deleteSecretsSpy = sinon.spy(mockContext.secrets, 'delete');
      const mockConnection = getMockConnection();
      await connection.saveConnection(mockConnection, 'password', true);

      await connection.deleteConnection(mockConnection.key);

      sinon.assert.calledOnceWithExactly(deleteSecretsSpy, 'mock-key');
    });

    test('should send notification when deleting a connection', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection();
      await connection.saveConnection(mockConnection, 'password', true);

      await connection.deleteConnection(mockConnection.key);

      sinon.assert.calledWith(
        sendNotificationSpy,
        MethodName.ConnectionDeleted,
        {
          trace: { server: 'off' },
          connect: false,
          connectURL: 'neo4j://localhost:7687',
          database: 'neo4j',
          user: 'neo4j',
          password: null,
        },
      );
    });
  });

  suite('saveConnection', () => {
    test('should save connection', async () => {
      const updateGlobalStateSpy = sinon.spy(mockContext.globalState, 'update');
      const storeSecretsSpy = sinon.spy(mockContext.secrets, 'store');
      const mockConnection = getMockConnection();

      await connection.saveConnection(mockConnection, 'mock-password', false);
      const storedConnection = connection.getConnection('mock-key');

      sinon.assert.calledOnceWithExactly(updateGlobalStateSpy, 'connections', {
        'mock-key': mockConnection,
      });

      sinon.assert.calledOnceWithExactly(
        storeSecretsSpy,
        'mock-key',
        'mock-password',
      );

      assert.deepStrictEqual(storedConnection, mockConnection);
    });

    test('should notify language server when adding a new connection', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection();

      await connection.saveConnection(mockConnection, 'mock-password', true);

      sinon.assert.calledOnceWithExactly(
        sendNotificationSpy,
        MethodName.ConnectionUpdated,
        {
          trace: { server: 'off' },
          connect: true,
          connectURL: 'neo4j://localhost:7687',
          database: 'neo4j',
          user: 'neo4j',
          password: 'mock-password',
        },
      );
    });

    test('should not notify language server if connection.connect is false', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection();

      await connection.saveConnection(mockConnection, 'mock-password', false);

      sinon.assert.notCalled(sendNotificationSpy);
    });

    test('should only notify language server only if connection.connect is true', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection('mock-key', true);

      await connection.saveConnection(mockConnection, 'mock-password', false);

      sinon.assert.calledOnceWithExactly(
        sendNotificationSpy,
        MethodName.ConnectionUpdated,
        {
          trace: { server: 'off' },
          connect: true,
          connectURL: 'neo4j://localhost:7687',
          database: 'neo4j',
          user: 'neo4j',
          password: 'mock-password',
        },
      );
    });
  });

  suite('toggleConnection', () => {
    test('should handle non-existent connection', () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const updateGlobalStateSpy = sinon.spy(mockContext.globalState, 'update');
      const promise = connection.toggleConnection('does-not-exist');

      assert.doesNotThrow(async () => await promise);

      sinon.assert.notCalled(updateGlobalStateSpy);
      sinon.assert.notCalled(sendNotificationSpy);
    });

    test('should toggle disconnected connection to connected', async () => {
      const updateGlobalStateSpy = sinon.spy(mockContext.globalState, 'update');
      const mockConnection = getMockConnection();
      await connection.saveConnection(mockConnection, 'mock-password', false);

      await connection.toggleConnection(mockConnection.key);

      sinon.assert.calledWith(updateGlobalStateSpy, 'connections', {
        'mock-key': { ...mockConnection, connect: true },
      });
    });

    test('should toggle connected connection to disconnected', async () => {
      const updateGlobalStateSpy = sinon.spy(mockContext.globalState, 'update');
      const mockConnection = getMockConnection('mock-key', true);
      await connection.saveConnection(mockConnection, 'mock-password', false);

      await connection.toggleConnection(mockConnection.key);

      sinon.assert.calledWith(updateGlobalStateSpy, 'connections', {
        'mock-key': { ...mockConnection, connect: false },
      });
    });

    test('should notify language server when toggling connection to connected', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection();
      await connection.saveConnection(mockConnection, 'mock-password', false);

      await connection.toggleConnection(mockConnection.key);

      sinon.assert.calledWith(
        sendNotificationSpy,
        MethodName.ConnectionUpdated,
        {
          trace: { server: 'off' },
          connect: true,
          connectURL: 'neo4j://localhost:7687',
          database: 'neo4j',
          user: 'neo4j',
          password: 'mock-password',
        },
      );
    });

    test('should notify language server when toggling connection to disconnected', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection('mock-key', true);
      await connection.saveConnection(mockConnection, 'mock-password', false);

      await connection.toggleConnection(mockConnection.key);

      sinon.assert.calledWith(
        sendNotificationSpy,
        MethodName.ConnectionUpdated,
        {
          trace: { server: 'off' },
          connect: false,
          connectURL: 'neo4j://localhost:7687',
          database: 'neo4j',
          user: 'neo4j',
          password: 'mock-password',
        },
      );
    });
  });

  suite('getPasswordForConnection', () => {
    test('should return null for non-existent secret', async () => {
      const result = await connection.getPasswordForConnection('non-existent');
      assert.strictEqual(result, null);
    });

    test('should return password for existing connection', async () => {
      const mockConnection = getMockConnection();
      await connection.saveConnection(mockConnection, 'super-secret', false);

      const password = await connection.getPasswordForConnection('mock-key');

      assert.strictEqual(password, 'super-secret');
    });
  });

  suite('getConnectionString', () => {
    test('should handle null connection', () => {
      const result = connection.getConnectionString(null);

      assert.strictEqual(result, null);
    });

    test('should handle connection with undefined property', () => {
      const result = connection.getConnectionString({
        scheme: 'neo4j',
        connect: false,
        database: 'neo4j',
        host: undefined,
        port: '7687',
        key: 'mock-key',
        name: 'mock-connection',
        user: 'neo4j',
      });

      assert.strictEqual(result, 'neo4j://undefined:7687');
    });
  });
});
