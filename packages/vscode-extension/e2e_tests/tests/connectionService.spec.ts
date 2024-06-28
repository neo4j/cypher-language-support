import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as connection from '../../src/connectionService';
import * as contextService from '../../src/contextService';
import { getMockConnection } from '../helpers';
import { MockConnectionManager } from '../mocks/mockConnectionManager';
import { MockExtensionContext } from '../mocks/mockExtensionContext';
import { MockLanguageClient } from '../mocks/mockLanguageClient';

suite('Connection service spec', () => {
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
      .stub(contextService, 'getDatabaseConnectionManager')
      .returns(mockConnectionManager);

    const setContextStub = sandbox.stub(contextService, 'setContext');

    setContextStub(mockContext, mockLanguageClient);
  });

  afterEach(() => {
    sandbox.restore();
  });

  suite('getActiveConnection', () => {
    test('Should return null if there are no active Connection', async () => {
      const mockConnection = getMockConnection();

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      const currentConnection = connection.getActiveConnection();

      assert.strictEqual(currentConnection, null);
    });

    test('Should return a Connection when there is an active Connection', async () => {
      const mockConnection = getMockConnection(true);

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );
      const currentConnection = connection.getActiveConnection();

      assert.deepStrictEqual(currentConnection, {
        ...mockConnection,
        state: 'active',
      });
    });
  });

  suite('getAllConnections', () => {
    test('Should return an empty array when there are no Connections', () => {
      const connections = connection.getAllConnections();

      assert.notStrictEqual(connections, []);
    });

    test('Should return an array of Connections when Connections exist', async () => {
      const mockConnection = getMockConnection();

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );
      const connections = connection.getAllConnections();

      assert.deepStrictEqual(connections, [mockConnection]);
    });
  });

  suite('getConnectionByKey', () => {
    test('Should return the correct Connection for a given key', async () => {
      const mockConnection = getMockConnection();
      const mockConnection2 = getMockConnection();
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection2,
        'mock-password-2',
      );

      const returnedConnection = connection.getConnectionByKey(
        mockConnection.key,
      );

      assert.deepStrictEqual(mockConnection, returnedConnection);
    });

    test('Should return null when a Connection does not exist for a given key', async () => {
      const mockConnection = getMockConnection();

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );
      const returnedConnection = connection.getConnectionByKey('xyz');

      assert.strictEqual(returnedConnection, null);
    });
  });

  suite('deleteConnectionAndUpdateDatabaseConnection', () => {
    test('Should handle non-existent Connection key', () => {
      const updateGlobalStateSpy = sandbox.spy(
        mockContext.globalState,
        'update',
      );
      const storeSecretsSpy = sandbox.spy(mockContext.secrets, 'store');
      const sendNotificationSpy = sandbox.spy(
        mockLanguageClient,
        'sendNotification',
      );

      const promise =
        connection.deleteConnectionAndUpdateDatabaseConnection(
          'does-not-exist',
        );

      assert.doesNotThrow(async () => await promise);
      sandbox.assert.notCalled(updateGlobalStateSpy);
      sandbox.assert.notCalled(storeSecretsSpy);
      sandbox.assert.notCalled(sendNotificationSpy);
    });

    test('Should delete a Connection by a given key', async () => {
      const mockConnection = getMockConnection();
      const mockConnection2 = getMockConnection();
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection2,
        'mock-password-2',
      );

      await connection.deleteConnectionAndUpdateDatabaseConnection(
        mockConnection.key,
      );
      const returnedConnection = connection.getConnectionByKey(
        mockConnection.key,
      );
      const returnedConnection2 = connection.getConnectionByKey(
        mockConnection2.key,
      );

      assert.strictEqual(returnedConnection, null);
      assert.deepStrictEqual(returnedConnection2, mockConnection2);
    });

    test('Should delete a password by a given key when a Connection is deleted', async () => {
      const deleteSecretsSpy = sandbox.spy(mockContext.secrets, 'delete');
      const mockConnection = getMockConnection();
      const mockConnection2 = getMockConnection();
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection2,
        'mock-password-2',
      );

      await connection.deleteConnectionAndUpdateDatabaseConnection(
        mockConnection.key,
      );
      const returnedPassword2 = await connection.getPasswordForConnection(
        mockConnection2.key,
      );

      sandbox.assert.calledOnceWithExactly(
        deleteSecretsSpy,
        mockConnection.key,
      );
      assert.strictEqual(returnedPassword2, 'mock-password-2');
    });

    test('Should notify language server when a Connection is deleted', async () => {
      const sendNotificationSpy = sandbox.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection();
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      await connection.deleteConnectionAndUpdateDatabaseConnection(
        mockConnection.key,
      );

      sandbox.assert.calledWith(sendNotificationSpy, 'connectionDisconnected', {
        trace: { server: 'off' },
        connect: false,
        connectURL: 'neo4j://localhost:7687',
        database: 'neo4j',
        user: 'neo4j',
        password: null,
      });
    });
  });

  suite('saveConnectionAndUpdateDatabaseConnection', () => {
    test('Should handle non-existent Connection key', () => {
      const sendNotificationSpy = sandbox.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const updateGlobalStateSpy = sandbox.spy(
        mockContext.globalState,
        'update',
      );
      const promise = connection.saveConnectionAndUpdateDatabaseConnection(
        undefined,
        '',
      );

      assert.doesNotThrow(async () => await promise);

      sandbox.assert.notCalled(updateGlobalStateSpy);
      sandbox.assert.notCalled(sendNotificationSpy);
    });

    test('Should store Connection and password in global state and secret storage', async () => {
      const updateGlobalStateSpy = sandbox.spy(
        mockContext.globalState,
        'update',
      );
      const storeSecretsSpy = sandbox.spy(mockContext.secrets, 'store');
      const mockConnection = getMockConnection();

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );
      const storedConnection = connection.getConnectionByKey(
        mockConnection.key,
      );

      sandbox.assert.calledWithExactly(updateGlobalStateSpy, 'connections', {
        [mockConnection.key]: mockConnection,
      });

      sandbox.assert.calledOnceWithExactly(
        storeSecretsSpy,
        mockConnection.key,
        'mock-password',
      );

      assert.deepStrictEqual(storedConnection, mockConnection);
    });

    test('Should not store Connection and password in global state and secret storage when initializeDatabaseConnection returns a non success status', async () => {
      sandbox
        .stub(mockConnectionManager, 'connect')
        .resolves({ success: false, retriable: true });
      const updateGlobalStateSpy = sandbox.spy(
        mockContext.globalState,
        'update',
      );
      const storeSecretsSpy = sandbox.spy(mockContext.secrets, 'store');
      const mockConnection = getMockConnection();

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );
      const storedConnection = connection.getConnectionByKey(
        mockConnection.key,
      );

      sandbox.assert.calledOnceWithExactly(
        updateGlobalStateSpy,
        'connections',
        {},
      );
      sandbox.assert.notCalled(storeSecretsSpy);
      assert.deepStrictEqual(storedConnection, null);
    });

    test('Should notify language server with correct payload when connection.state is inactive', async () => {
      const sendNotificationSpy = sandbox.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection();

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      sandbox.assert.calledOnceWithExactly(
        sendNotificationSpy,
        'connectionUpdated',
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

    test('Should notify language server with correct payload when connection.state is activating', async () => {
      const sendNotificationSpy = sandbox.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection(true);

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
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
          password: 'mock-password',
        },
      );
    });

    test('Should not notify language server when initializeDatabaseConnection returns a non success status', async () => {
      const sendNotificationSpy = sandbox.spy(
        mockLanguageClient,
        'sendNotification',
      );
      sandbox
        .stub(mockConnectionManager, 'connect')
        .resolves({ success: false, retriable: true });
      const mockConnection = getMockConnection(true);

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      sandbox.assert.notCalled(sendNotificationSpy);
    });

    test('Should call connectionManager.connect when connection.state is activating', async () => {
      const connectSpy = sandbox.spy(mockConnectionManager, 'connect');
      const mockConnection = getMockConnection(true);

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      const settings: Neo4jSettings = {
        trace: { server: 'off' },
        connect: true,
        connectURL: 'neo4j://localhost:7687',
        database: 'neo4j',
        user: 'neo4j',
        password: 'mock-password',
      };

      sandbox.assert.calledWithExactly(connectSpy, settings);
    });

    test('Should call connectionManager.connect when connection.state is inactive', async () => {
      const connectSpy = sandbox.spy(mockConnectionManager, 'connect');
      const mockConnection = getMockConnection(false);

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      const settings: Neo4jSettings = {
        trace: { server: 'off' },
        connect: false,
        connectURL: 'neo4j://localhost:7687',
        database: 'neo4j',
        user: 'neo4j',
        password: 'mock-password',
      };

      sandbox.assert.calledWithExactly(connectSpy, settings);
    });

    test('Should call connectionManager.persistentConnect when connection.state is activating', async () => {
      const connectSpy = sandbox.spy(
        mockConnectionManager,
        'persistentConnect',
      );
      const mockConnection = getMockConnection(true);

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      const settings: Neo4jSettings = {
        trace: { server: 'off' },
        connect: true,
        connectURL: 'neo4j://localhost:7687',
        database: 'neo4j',
        user: 'neo4j',
        password: 'mock-password',
      };

      sandbox.assert.calledWithExactly(connectSpy, settings);
    });

    test('Should not call connectionManager.persistentConnect when connection.state is inactive', async () => {
      const connectSpy = sandbox.spy(
        mockConnectionManager,
        'persistentConnect',
      );
      const mockConnection = getMockConnection(false);

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      sandbox.assert.notCalled(connectSpy);
    });

    test('Should not call connectionManager.persistentConnect when initializeDatabaseConnection returns a non success status', async () => {
      sandbox
        .stub(mockConnectionManager, 'connect')
        .resolves({ success: false, retriable: true });
      const persistentConnectSpy = sandbox.spy(
        mockConnectionManager,
        'persistentConnect',
      );
      const mockConnection = getMockConnection(true);

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      sandbox.assert.notCalled(persistentConnectSpy);
    });

    test('Should call connectionManager.persistentConnect when forceSave is true for a non successful Connection', async () => {
      sandbox
        .stub(mockConnectionManager, 'connect')
        .resolves({ success: false, retriable: true });
      const persistentConnectSpy = sandbox.spy(
        mockConnectionManager,
        'persistentConnect',
      );
      const mockConnection = getMockConnection(true);

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
        true,
      );

      const settings: Neo4jSettings = {
        trace: { server: 'off' },
        connect: true,
        connectURL: 'neo4j://localhost:7687',
        database: 'neo4j',
        user: 'neo4j',
        password: 'mock-password',
      };
      sandbox.assert.calledWithExactly(persistentConnectSpy, settings);
    });

    test('Should not call connectionManager.persistentConnect when forceSave is true for a non successful Connection when the retriable flag is false', async () => {
      sandbox
        .stub(mockConnectionManager, 'connect')
        .resolves({ success: false, retriable: false });
      const persistentConnectSpy = sandbox.spy(
        mockConnectionManager,
        'persistentConnect',
      );
      const mockConnection = getMockConnection(true);

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
        true,
      );

      sandbox.assert.notCalled(persistentConnectSpy);
    });

    test('Should reset all connections when saving a Connection with state flag set to activating', async () => {
      const mockConnection = getMockConnection(true);
      const mockConnection2 = getMockConnection(true);
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection2,
        'mock-password-2',
      );
      const connectedConnection = connection.getActiveConnection();

      assert.deepStrictEqual(connectedConnection, {
        ...mockConnection2,
        state: 'active',
      });
    });
  });

  suite('toggleConnectionAndUpdateDatabaseConnection', () => {
    test('Should handle non-existent Connection key', () => {
      const sendNotificationSpy = sandbox.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const updateGlobalStateSpy = sandbox.spy(
        mockContext.globalState,
        'update',
      );
      const promise =
        connection.toggleConnectionAndUpdateDatabaseConnection(undefined);

      assert.doesNotThrow(async () => await promise);

      sandbox.assert.notCalled(updateGlobalStateSpy);
      sandbox.assert.notCalled(sendNotificationSpy);
    });

    test('Should toggle a disconnected Connection to active', async () => {
      const updateGlobalStateSpy = sandbox.spy(
        mockContext.globalState,
        'update',
      );
      const mockConnection = getMockConnection();
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      await connection.toggleConnectionAndUpdateDatabaseConnection(
        mockConnection,
      );

      sandbox.assert.calledWith(updateGlobalStateSpy, 'connections', {
        [mockConnection.key]: {
          ...mockConnection,
          state: 'active',
        },
      });
    });

    test('Should toggle a connected Connection to inactive', async () => {
      const updateGlobalStateSpy = sandbox.spy(
        mockContext.globalState,
        'update',
      );
      const mockConnection = getMockConnection(true);
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      await connection.toggleConnectionAndUpdateDatabaseConnection(
        mockConnection,
      );

      sandbox.assert.calledWith(updateGlobalStateSpy, 'connections', {
        [mockConnection.key]: {
          ...mockConnection,
          state: 'inactive',
        },
      });
    });

    test('Should notify language server when toggling a Connection to active', async () => {
      const sendNotificationSpy = sandbox.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection();
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      await connection.toggleConnectionAndUpdateDatabaseConnection(
        mockConnection,
      );

      sandbox.assert.calledWith(sendNotificationSpy, 'connectionUpdated', {
        trace: { server: 'off' },
        connect: true,
        connectURL: 'neo4j://localhost:7687',
        database: 'neo4j',
        user: 'neo4j',
        password: 'mock-password',
      });
    });

    test('Should notify language server when toggling a Connection to inactive', async () => {
      const sendNotificationSpy = sandbox.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection(true);
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      await connection.toggleConnectionAndUpdateDatabaseConnection(
        mockConnection,
      );

      sandbox.assert.calledWith(sendNotificationSpy, 'connectionDisconnected');
    });

    test('Should call connect on connection manager when toggling a Connection to active', async () => {
      const persistentConnectSpy = sandbox.spy(
        mockConnectionManager,
        'persistentConnect',
      );
      const mockConnection = getMockConnection();
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      await connection.toggleConnectionAndUpdateDatabaseConnection(
        mockConnection,
      );

      const settings: Neo4jSettings = {
        trace: { server: 'off' },
        connect: true,
        connectURL: 'neo4j://localhost:7687',
        database: 'neo4j',
        user: 'neo4j',
        password: 'mock-password',
      };

      sandbox.assert.calledWithExactly(persistentConnectSpy, settings);
    });

    test('Should call disconnect on connection manager when toggling a Connection to inactive', async () => {
      const disconnectSpy = sandbox.spy(mockConnectionManager, 'disconnect');
      const mockConnection = getMockConnection(true);
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      await connection.toggleConnectionAndUpdateDatabaseConnection(
        mockConnection,
      );

      sandbox.assert.called(disconnectSpy);
    });

    test('Should reset all connections when toggling a Connection to active', async () => {
      const mockConnection = getMockConnection(true);
      const mockConnection2 = getMockConnection(false);
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection2,
        'mock-password-2',
      );

      await connection.toggleConnectionAndUpdateDatabaseConnection(
        mockConnection2,
      );
      const connectionOne = connection.getConnectionByKey(mockConnection.key);
      const connectionTwo = connection.getConnectionByKey(mockConnection2.key);

      assert.deepStrictEqual(connectionOne, {
        ...mockConnection,
        state: 'inactive',
      });

      assert.deepStrictEqual(connectionTwo, {
        ...mockConnection2,
        state: 'active',
      });
    });
  });

  suite('getPasswordForConnection', () => {
    test('Should return a null value for a non-existent secret', async () => {
      const result = await connection.getPasswordForConnection('non-existent');
      assert.strictEqual(result, null);
    });

    test('Should return a password for the existing Connection', async () => {
      const mockConnection = getMockConnection();
      await connection.saveConnectionAndUpdateDatabaseConnection(
        mockConnection,
        'mock-password',
      );

      const password = await connection.getPasswordForConnection(
        mockConnection.key,
      );

      assert.strictEqual(password, 'mock-password');
    });
  });

  suite('getDatabaseConnectionString', () => {
    test('Should handle a null value', () => {
      const result = connection.getDatabaseConnectionString(null);

      assert.strictEqual(result, null);
    });

    test('Should handle a Connection with an undefined property', () => {
      const result = connection.getDatabaseConnectionString({
        scheme: 'neo4j',
        database: 'neo4j',
        host: undefined,
        port: '7687',
        key: 'mock-key',
        name: 'mock-connection',
        user: 'neo4j',
        state: 'inactive',
      });

      assert.strictEqual(result, 'neo4j://undefined:7687');
    });
  });
});
