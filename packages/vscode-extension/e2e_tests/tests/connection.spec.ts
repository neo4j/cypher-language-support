/* eslint-disable @typescript-eslint/unbound-method */
import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { LanguageClient } from 'vscode-languageclient/node';
import * as appContext from '../../src/appContext';
import * as connection from '../../src/connection';
import { MethodName } from '../../src/languageClientService';
import { MockExtensionContext } from '../mocks/mockExtensionContext';

suite('Connection', () => {
  let mockContext: MockExtensionContext;
  let getContextStub: sinon.SinonStub;
  const mockLanguageClient = sinon.createStubInstance(LanguageClient);
  const setAppContextStub = sinon.stub(appContext, 'setAppContext');

  sinon.stub(appContext, 'getLanguageClient').returns(mockLanguageClient);

  beforeEach(() => {
    mockContext = new MockExtensionContext();
    getContextStub = sinon.stub(appContext, 'getContext').returns(mockContext);
    setAppContextStub(mockContext, mockLanguageClient);
  });

  afterEach(() => {
    getContextStub.restore();
    getContextStub.reset();
    mockLanguageClient.sendNotification.reset();
  });

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

      assert.equal(currentConnection, null);
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
    test('should return all connections', () => {
      const connections = connection.getAllConnections();
      assert.notStrictEqual(connections, []);
    });
  });

  suite('saveConnection', () => {
    test('should save connection', async () => {
      const updateGlobalStateSpy = sinon.spy(mockContext.globalState, 'update');
      const storeSecretsSpy = sinon.spy(mockContext.secrets, 'store');

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

      await connection.saveConnection(newConnection, 'dummy-password', true);

      sinon.assert.calledOnceWithExactly(
        mockLanguageClient.sendNotification,
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

      sinon.assert.notCalled(mockLanguageClient.sendNotification);
    });

    test('should only notify language server only if connection.connect is true', async () => {
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

      sinon.assert.calledOnceWithExactly(
        mockLanguageClient.sendNotification,
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

  suite('deleteConnection', () => {});
});
