import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import * as assert from 'assert';
import { EventEmitter } from 'events';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as commandHandlers from '../../src/commandHandlers';
import { SchemaPollerConnectionManager } from '../../src/schemaPollerConnectionManager';

suite('Schema poller connection manager spec', () => {
  let sandbox: sinon.SinonSandbox;
  let schemaPollerMock: Neo4jSchemaPoller;
  let schemaPollerConnectionManager: SchemaPollerConnectionManager;

  const events = new EventEmitter();

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(commandHandlers, 'onConnectionErroredHandler').resolves();
    sandbox.stub(commandHandlers, 'onConnectionReconnectedHandler').resolves();
    sandbox.stub(commandHandlers, 'onConnectionFailedHandler').resolves();
  });

  afterEach(() => {
    sandbox.restore();
    schemaPollerConnectionManager.disconnect();
  });

  suite('Unsuccessful connections', () => {
    beforeEach(() => {
      const connectFake = sandbox.fake.resolves({ success: true });
      const persistentConnectFake = sandbox.fake.resolves({
        success: false,
      });

      schemaPollerMock = {
        events: events,
        connect: connectFake,
        persistentConnect: persistentConnectFake,
        disconnect: () => void 0,
      } as unknown as Neo4jSchemaPoller;

      schemaPollerConnectionManager = new SchemaPollerConnectionManager(
        schemaPollerMock,
      );
    });

    test('Unsuccessful connection attempts to the schema poller should cause a connectionConnected listener to be attached', async () => {
      await schemaPollerConnectionManager.persistentConnect({
        trace: { server: 'off' },
      });

      assert.equal(events.listenerCount('connectionConnected'), 1);
      assert.equal(events.listenerCount('connectionErrored'), 0);
    });

    test('An unsuccessful connection should not handle connectionErrored events', async () => {
      const handleConnectionErrorSpy = sandbox.spy(
        schemaPollerConnectionManager,
        '_handleConnectionError',
      );
      await schemaPollerConnectionManager.persistentConnect({
        trace: { server: 'off' },
      });

      events.emit('connectionErrored');

      sinon.assert.notCalled(handleConnectionErrorSpy);
      assert.equal(events.listenerCount('connectionConnected'), 1);
      assert.equal(events.listenerCount('connectionErrored'), 0);
    });

    test('Connection connected events should be handled and cause a connectionErrored listener to be attached', async () => {
      const handleConnectionConnectedSpy = sandbox.spy(
        schemaPollerConnectionManager,
        '_handleConnectionReconnected',
      );
      const attachErrorEventListenerSpy = sandbox.spy(
        schemaPollerConnectionManager,
        '_attachErrorEventListener',
      );
      await schemaPollerConnectionManager.persistentConnect({
        trace: { server: 'off' },
      });

      events.emit('connectionConnected');

      sinon.assert.calledOnce(handleConnectionConnectedSpy);
      sinon.assert.calledOnce(attachErrorEventListenerSpy);
      assert.equal(events.listenerCount('connectionConnected'), 0);
      assert.equal(events.listenerCount('connectionErrored'), 1);
    });

    test('Connection connected events should only be handled once', async () => {
      const handleConnectionConnectedSpy = sandbox.spy(
        schemaPollerConnectionManager,
        '_handleConnectionReconnected',
      );
      const attachErrorEventListenerSpy = sandbox.spy(
        schemaPollerConnectionManager,
        '_attachErrorEventListener',
      );
      await schemaPollerConnectionManager.persistentConnect({
        trace: { server: 'off' },
      });

      events.emit('connectionConnected');
      events.emit('connectionConnected');
      events.emit('connectionConnected');

      sinon.assert.calledOnce(handleConnectionConnectedSpy);
      sinon.assert.calledOnce(attachErrorEventListenerSpy);
    });
  });

  suite('Successful connections', () => {
    beforeEach(() => {
      const connectFake = sandbox.fake.resolves({ success: true });
      const persistentConnectFake = sandbox.fake.resolves({ success: true });

      schemaPollerMock = {
        events: events,
        connect: connectFake,
        persistentConnect: persistentConnectFake,
        disconnect: () => void 0,
      } as unknown as Neo4jSchemaPoller;

      schemaPollerConnectionManager = new SchemaPollerConnectionManager(
        schemaPollerMock,
      );
    });

    test('Successful connection attempts to the schema poller should cause a connectionErrored listener to be attached', async () => {
      await schemaPollerConnectionManager.persistentConnect({
        trace: { server: 'off' },
      });

      assert.equal(events.listenerCount('connectionErrored'), 1);
      assert.equal(events.listenerCount('connectionConnected'), 0);
    });

    test('A successful connection should not handle connectionConnected events', async () => {
      const handleConnectionReconnectedSpy = sandbox.spy(
        schemaPollerConnectionManager,
        '_handleConnectionReconnected',
      );
      await schemaPollerConnectionManager.persistentConnect({
        trace: { server: 'off' },
      });

      events.emit('connectionConnected');

      sinon.assert.notCalled(handleConnectionReconnectedSpy);
      assert.equal(events.listenerCount('connectionErrored'), 1);
      assert.equal(events.listenerCount('connectionConnected'), 0);
    });

    test('Connection error events should be handled and cause a connectionConnected listener to be attached', async () => {
      const handleConnectionErrorSpy = sandbox.spy(
        schemaPollerConnectionManager,
        '_handleConnectionError',
      );
      const attachedReconnectionListenerSpy = sandbox.spy(
        schemaPollerConnectionManager,
        '_attachReconnectionOrFailedEventListeners',
      );
      await schemaPollerConnectionManager.persistentConnect({
        trace: { server: 'off' },
      });

      events.emit('connectionErrored', 'error message');

      sinon.assert.calledOnceWithExactly(
        handleConnectionErrorSpy,
        'error message',
      );
      sinon.assert.calledOnce(attachedReconnectionListenerSpy);
      assert.equal(events.listenerCount('connectionErrored'), 0);
      assert.equal(events.listenerCount('connectionConnected'), 1);
    });

    test('Connection error events should only be handled once', async () => {
      const handleConnectionErrorSpy = sandbox.spy(
        schemaPollerConnectionManager,
        '_handleConnectionError',
      );
      const attachReconnectionOrFailedEventListenersSpy = sandbox.spy(
        schemaPollerConnectionManager,
        '_attachReconnectionOrFailedEventListeners',
      );
      await schemaPollerConnectionManager.persistentConnect({
        trace: { server: 'off' },
      });

      events.emit('connectionErrored', 'error message');
      events.emit('connectionErrored', 'error message');
      events.emit('connectionErrored', 'error message');

      sinon.assert.calledOnceWithExactly(
        handleConnectionErrorSpy,
        'error message',
      );
      sinon.assert.calledOnce(attachReconnectionOrFailedEventListenersSpy);
    });

    test('A failed connection event should only be handled once and removes all listeners', async () => {
      const handleConnectionFailedSpy = sandbox.spy(
        schemaPollerConnectionManager,
        '_handleConnectionFailed',
      );
      await schemaPollerConnectionManager.persistentConnect({
        trace: { server: 'off' },
      });

      events.emit('connectionFailed');
      events.emit('connectionFailed');
      events.emit('connectionFailed');

      sinon.assert.calledOnce(handleConnectionFailedSpy);
      assert.equal(events.listenerCount('connectionConnected'), 0);
      assert.equal(events.listenerCount('connectionErrored'), 0);
      assert.equal(events.listenerCount('connectionFailed'), 0);
    });
  });
});
