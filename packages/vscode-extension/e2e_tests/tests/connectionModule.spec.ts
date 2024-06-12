import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as appContext from '../../src/appContext';
import * as connection from '../../src/connection';
import { MethodName } from '../../src/languageClientService';
import { MockExtensionContext } from '../mocks/mockExtensionContext';
import { MockLanguageClient } from '../mocks/mockLanguageClient';

suite('Connection', () => {
  let sandbox: sinon.SinonSandbox;
  let mockContext: MockExtensionContext;
  let mockLanguageClient: MockLanguageClient;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockContext = new MockExtensionContext();
    mockLanguageClient = new MockLanguageClient();

    sandbox.stub(appContext, 'getExtensionContext').returns(mockContext);
    sandbox.stub(appContext, 'getLanguageClient').returns(mockLanguageClient);

    const setAppContextStub = sandbox.stub(appContext, 'setAppContext');

    setAppContextStub(mockContext, mockLanguageClient);
  });

  afterEach(() => {
    sandbox.restore();
  });

  suite('testConnection', () => {});

  suite('getCurrentConnection', () => {
    test('should return null if there are no current connections', async () => {
      const newConnection: connection.Connection = {
        key: 'dummy-key',
        name: 'name',
        database: 'database',
        connect: false,
        user: 'user',
        host: 'host',
        scheme: 'scheme://',
        port: 'port',
      };

      await connection.saveConnection(newConnection, 'dummy-password', false);

      const currentConnection = connection.getCurrentConnection();

      assert.strictEqual(currentConnection, null);
    });

    test('should return current connection', async () => {
      const newConnection: connection.Connection = {
        key: 'dummy-key',
        name: 'name',
        database: 'database',
        connect: true,
        user: 'user',
        host: 'host',
        scheme: 'scheme://',
        port: 'port',
      };

      await connection.saveConnection(newConnection, 'dummy-password', false);

      const currentConnection = connection.getCurrentConnection();

      assert.deepStrictEqual(currentConnection, newConnection);
    });
  });

  suite('getAllConnections', () => {
    test('should return empty array when there are no connections', () => {
      const connections = connection.getAllConnections();
      assert.notStrictEqual(connections, []);
    });

    test('should return an array of connections when connections exist', async () => {
      const newConnection: connection.Connection = {
        key: 'dummy-key',
        name: 'name',
        database: 'database',
        connect: false,
        user: 'user',
        host: 'host',
        scheme: 'scheme://',
        port: 'port',
      };

      await connection.saveConnection(newConnection, 'dummy-password', false);

      const connections = connection.getAllConnections();

      assert.deepStrictEqual(connections, [newConnection]);
    });
  });

  suite('getConnection', () => {
    test('should return connection by key', async () => {
      const newConnection = getNewConnection();
      const newConnection2 = getNewConnection('dummy-key-2');
      await connection.saveConnection(newConnection, 'dummy-password', false);
      await connection.saveConnection(newConnection2, 'dummy-password', false);

      const returnedConnection = connection.getConnection('dummy-key');

      assert.deepStrictEqual(newConnection, returnedConnection);
    });

    test('should return null when connection does not exist', async () => {
      const newConnection = getNewConnection();

      await connection.saveConnection(newConnection, 'dummy-password', false);
      const returnedConnection = connection.getConnection('dummy-key-two');

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
      const newConnection = getNewConnection();
      await connection.saveConnection(newConnection, 'password', true);

      await connection.deleteConnection(newConnection.key);
      const returnedConnection = connection.getConnection(newConnection.key);

      assert.strictEqual(returnedConnection, null);
    });

    test('should delete password when deleting a connection', async () => {
      const deleteSecretsSpy = sinon.spy(mockContext.secrets, 'delete');
      const newConnection = getNewConnection();
      await connection.saveConnection(newConnection, 'password', true);

      await connection.deleteConnection(newConnection.key);

      sinon.assert.calledOnceWithExactly(deleteSecretsSpy, 'dummy-key');
    });

    test('should send notification when deleting a connection', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const newConnection = getNewConnection();
      await connection.saveConnection(newConnection, 'password', true);

      await connection.deleteConnection(newConnection.key);

      sinon.assert.calledWith(
        sendNotificationSpy,
        MethodName.ConnectionDeleted,
        {
          trace: { server: 'off' },
          connect: false,
          connectURL: 'scheme://host:port',
          database: 'database',
          user: 'user',
          password: null,
        },
      );
    });
  });

  suite('saveConnection', () => {
    test('should save connection', async () => {
      const updateGlobalStateSpy = sinon.spy(mockContext.globalState, 'update');
      const storeSecretsSpy = sinon.spy(mockContext.secrets, 'store');
      const newConnection = getNewConnection();

      await connection.saveConnection(newConnection, 'dummy-password', false);
      const storedConnection = connection.getConnection('dummy-key');

      sinon.assert.calledOnceWithExactly(updateGlobalStateSpy, 'connections', {
        'dummy-key': newConnection,
      });

      sinon.assert.calledOnceWithExactly(
        storeSecretsSpy,
        'dummy-key',
        'dummy-password',
      );

      assert.deepStrictEqual(storedConnection, newConnection);
    });

    test('should notify language server when adding a new connection', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const newConnection = getNewConnection();

      await connection.saveConnection(newConnection, 'dummy-password', true);

      sinon.assert.calledOnceWithExactly(
        sendNotificationSpy,
        MethodName.ConnectionUpdated,
        {
          trace: { server: 'off' },
          connect: true,
          connectURL: 'scheme://host:port',
          database: 'database',
          user: 'user',
          password: 'dummy-password',
        },
      );
    });

    test('should not notify language server if connection.connect is false', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const newConnection = getNewConnection();

      await connection.saveConnection(newConnection, 'dummy-password', false);

      sinon.assert.notCalled(sendNotificationSpy);
    });

    test('should only notify language server only if connection.connect is true', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const newConnection = getNewConnection('dummy-key', true);

      await connection.saveConnection(newConnection, 'dummy-password', false);

      sinon.assert.calledOnceWithExactly(
        sendNotificationSpy,
        MethodName.ConnectionUpdated,
        {
          trace: { server: 'off' },
          connect: true,
          connectURL: 'scheme://host:port',
          database: 'database',
          user: 'user',
          password: 'dummy-password',
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
      const newConnection = getNewConnection();
      await connection.saveConnection(newConnection, 'dummy-password', false);

      await connection.toggleConnection(newConnection.key);

      sinon.assert.calledWith(updateGlobalStateSpy, 'connections', {
        'dummy-key': { ...newConnection, connect: true },
      });
    });

    test('should toggle connected connection to disconnected', async () => {
      const updateGlobalStateSpy = sinon.spy(mockContext.globalState, 'update');
      const newConnection = getNewConnection('dummy-key', true);
      await connection.saveConnection(newConnection, 'dummy-password', false);

      await connection.toggleConnection(newConnection.key);

      sinon.assert.calledWith(updateGlobalStateSpy, 'connections', {
        'dummy-key': { ...newConnection, connect: false },
      });
    });

    test('should notify language server when toggling connection to connected', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const newConnection = getNewConnection();
      await connection.saveConnection(newConnection, 'dummy-password', false);

      await connection.toggleConnection(newConnection.key);

      sinon.assert.calledWith(
        sendNotificationSpy,
        MethodName.ConnectionUpdated,
        {
          trace: { server: 'off' },
          connect: true,
          connectURL: 'scheme://host:port',
          database: 'database',
          user: 'user',
          password: 'dummy-password',
        },
      );
    });

    test('should notify language server when toggling connection to disconnected', async () => {
      const sendNotificationSpy = sinon.spy(
        mockLanguageClient,
        'sendNotification',
      );
      const newConnection = getNewConnection('dummy-key', true);
      await connection.saveConnection(newConnection, 'dummy-password', false);

      await connection.toggleConnection(newConnection.key);

      sinon.assert.calledWith(
        sendNotificationSpy,
        MethodName.ConnectionUpdated,
        {
          trace: { server: 'off' },
          connect: false,
          connectURL: 'scheme://host:port',
          database: 'database',
          user: 'user',
          password: 'dummy-password',
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
      const newConnection = getNewConnection();
      await connection.saveConnection(newConnection, 'super-secret', false);

      const password = await connection.getPasswordForConnection('dummy-key');

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
        scheme: 'scheme://',
        connect: false,
        database: 'database',
        host: undefined,
        port: 'port',
        key: 'key',
        name: 'name',
        user: 'user',
      });

      assert.strictEqual(result, 'scheme://undefined:port');
    });
  });

  function getNewConnection(
    key: string = 'dummy-key',
    connect: boolean = false,
  ): connection.Connection {
    return {
      key: key,
      name: 'name',
      database: 'database',
      connect: connect,
      user: 'user',
      host: 'host',
      scheme: 'scheme://',
      port: 'port',
    };
  }
});
