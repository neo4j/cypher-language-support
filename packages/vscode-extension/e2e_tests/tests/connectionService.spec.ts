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
    test('Should return null if there are no current connections', async () => {
      const mockConnection = getMockConnection();

      await connection.saveConnection(mockConnection, 'mock-password');

      const currentConnection = connection.getCurrentConnection();

      assert.strictEqual(currentConnection, null);
    });

    test('Should return a connection when there is a connected connection', async () => {
      const mockConnection = getMockConnection(true);

      await connection.saveConnection(mockConnection, 'mock-password');
      const currentConnection = connection.getCurrentConnection();

      assert.deepStrictEqual(currentConnection, mockConnection);
    });
  });

  suite('getAllConnections', () => {
    test('Should return an empty array when there are no connections', () => {
      const connections = connection.getAllConnections();

      assert.notStrictEqual(connections, []);
    });

    test('Should return an array of connections when connections exist', async () => {
      const mockConnection = getMockConnection();

      await connection.saveConnection(mockConnection, 'mock-password');
      const connections = connection.getAllConnections();

      assert.deepStrictEqual(connections, [mockConnection]);
    });
  });

  suite('getConnection', () => {
    test('Should return the correct connection for a given key', async () => {
      const mockConnection = getMockConnection();
      const mockConnection2 = getMockConnection();
      await connection.saveConnection(mockConnection, 'mock-password');
      await connection.saveConnection(mockConnection2, 'mock-password-2');

      const returnedConnection = connection.getConnection(mockConnection.key);

      assert.deepStrictEqual(mockConnection, returnedConnection);
    });

    test('Should return null when a connection does not exist for a given key', async () => {
      const mockConnection = getMockConnection();

      await connection.saveConnection(mockConnection, 'mock-password');
      const returnedConnection = connection.getConnection('xyz');

      assert.strictEqual(returnedConnection, null);
    });
  });

  suite('deleteConnection', () => {
    test('Should handle non-existent connection key', () => {
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

    test('Should delete a connection by a given key', async () => {
      const mockConnection = getMockConnection();
      const mockConnection2 = getMockConnection();
      await connection.saveConnection(mockConnection, 'mock-password');
      await connection.saveConnection(mockConnection2, 'mock-password-2');

      await connection.deleteConnection(mockConnection.key);
      const returnedConnection = connection.getConnection(mockConnection.key);
      const returnedConnection2 = connection.getConnection(mockConnection2.key);

      assert.strictEqual(returnedConnection, null);
      assert.deepStrictEqual(returnedConnection2, mockConnection2);
    });

    test('Should delete a password by a given key when a connection is deleted', async () => {
      const deleteSecretsSpy = sinon.spy(mockContext.secrets, 'delete');
      const mockConnection = getMockConnection();
      const mockConnection2 = getMockConnection();
      await connection.saveConnection(mockConnection, 'mock-password');
      await connection.saveConnection(mockConnection2, 'mock-password-2');

      await connection.deleteConnection(mockConnection.key);
      const returnedPassword2 = await connection.getPasswordForConnection(
        mockConnection2.key,
      );

      sinon.assert.calledOnceWithExactly(deleteSecretsSpy, mockConnection.key);
      assert.strictEqual(returnedPassword2, 'mock-password-2');
    });

    test('Should notify language server when a connection is deleted', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection();
      await connection.saveConnection(mockConnection, 'mock-password');

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
    test('Should store connection and password in global state and secret storage', async () => {
      const updateGlobalStateSpy = sinon.spy(mockContext.globalState, 'update');
      const storeSecretsSpy = sinon.spy(mockContext.secrets, 'store');
      const mockConnection = getMockConnection();

      await connection.saveConnection(mockConnection, 'mock-password');
      const storedConnection = connection.getConnection(mockConnection.key);

      sinon.assert.calledOnceWithExactly(updateGlobalStateSpy, 'connections', {
        [mockConnection.key]: mockConnection,
      });

      sinon.assert.calledOnceWithExactly(
        storeSecretsSpy,
        mockConnection.key,
        'mock-password',
      );

      assert.deepStrictEqual(storedConnection, mockConnection);
    });

    test('Should not notify language server if connection.connect is false', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection();

      await connection.saveConnection(mockConnection, 'mock-password');

      sinon.assert.notCalled(sendNotificationSpy);
    });

    test('Should only notify language server only if connection.connect is true', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection(true);

      await connection.saveConnection(mockConnection, 'mock-password');

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

    test('Should reset all connections when saving a connection with connected flag set to true', async () => {
      const mockConnection = getMockConnection(true);
      const mockConnection2 = getMockConnection(true);
      await connection.saveConnection(mockConnection, 'mock-password');

      await connection.saveConnection(mockConnection2, 'mock-password-2');
      const connectedConnection = connection.getCurrentConnection();

      assert.deepStrictEqual(connectedConnection, mockConnection2);
    });
  });

  suite('toggleConnection', () => {
    test('Should handle non-existent connection key', () => {
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

    test('Should toggle a disconnected connection to connected', async () => {
      const updateGlobalStateSpy = sinon.spy(mockContext.globalState, 'update');
      const mockConnection = getMockConnection();
      await connection.saveConnection(mockConnection, 'mock-password');

      await connection.toggleConnection(mockConnection.key);

      sinon.assert.calledWith(updateGlobalStateSpy, 'connections', {
        [mockConnection.key]: { ...mockConnection, connect: true },
      });
    });

    test('Should toggle a connected connection to disconnected', async () => {
      const updateGlobalStateSpy = sinon.spy(mockContext.globalState, 'update');
      const mockConnection = getMockConnection(true);
      await connection.saveConnection(mockConnection, 'mock-password');

      await connection.toggleConnection(mockConnection.key);

      sinon.assert.calledWith(updateGlobalStateSpy, 'connections', {
        [mockConnection.key]: { ...mockConnection, connect: false },
      });
    });

    test('Should notify language server when toggling a connection to connected', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection();
      await connection.saveConnection(mockConnection, 'mock-password');

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

    test('Should notify language server when toggling a connection to disconnected', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const mockConnection = getMockConnection(true);
      await connection.saveConnection(mockConnection, 'mock-password');

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

    test('Should reset all connections when toggling a connection to connected', async () => {
      const mockConnection = getMockConnection(true);
      const mockConnection2 = getMockConnection(false);
      await connection.saveConnection(mockConnection, 'mock-password');
      await connection.saveConnection(mockConnection2, 'mock-password-2');

      await connection.toggleConnection(mockConnection2.key);
      const connectedConnection = connection.getCurrentConnection();

      assert.deepStrictEqual(connectedConnection, {
        ...mockConnection2,
        connect: true,
      });
    });
  });

  suite('getPasswordForConnection', () => {
    test('Should return a null value for a non-existent secret', async () => {
      const result = await connection.getPasswordForConnection('non-existent');
      assert.strictEqual(result, null);
    });

    test('Should return a password for the existing connection', async () => {
      const mockConnection = getMockConnection();
      await connection.saveConnection(mockConnection, 'mock-password');

      const password = await connection.getPasswordForConnection(
        mockConnection.key,
      );

      assert.strictEqual(password, 'mock-password');
    });
  });

  suite('getConnectionString', () => {
    test('Should handle a null value', () => {
      const result = connection.getConnectionString(null);

      assert.strictEqual(result, null);
    });

    test('Should handle a connection with an undefined property', () => {
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
