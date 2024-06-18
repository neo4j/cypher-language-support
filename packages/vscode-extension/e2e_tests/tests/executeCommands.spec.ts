import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { commands, MessageOptions, window } from 'vscode';
import { constants } from '../../src/constants';
import { testDatabaseKey } from '../suiteSetup';

suite('Execute commands', () => {
  let sandbox: sinon.SinonSandbox;
  let showInformationMessageStub: sinon.SinonStub;
  let showErrorMessageStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    showInformationMessageStub = sandbox.stub(window, 'showInformationMessage');
    showErrorMessageStub = sandbox.stub(window, 'showErrorMessage');
  });

  afterEach(async () => {
    // Ensure we reconnect back to the default connection
    await commands.executeCommand(constants.COMMANDS.CONNECT_COMMAND, {
      key: testDatabaseKey,
      connect: true,
    });

    sandbox.restore();
  });

  suite('saveConnectionCommand', () => {
    test('Creating and connecting to a valid connection should show a success message', async () => {
      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: process.env.NEO4J_SCHEME || 'neo4j',
          host: process.env.NEO4J_HOST || 'localhost',
          port: process.env.NEO4J_PORT || '7687',
          user: process.env.NEO4J_USER || 'neo4j',
          database: process.env.NEO4J_DATABASE || 'neo4j',
          connect: true,
        },
        process.env.NEO4J_PASSWORD || 'password',
      );

      sandbox.assert.calledWith(
        showInformationMessageStub,
        constants.MESSAGES.CONNECTED_MESSAGE,
      );
    });

    test('Saving a connection with invalid credentials should show an error message', async () => {
      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: process.env.NEO4J_SCHEME || 'neo4j',
          host: process.env.NEO4J_HOST || 'localhost',
          port: process.env.NEO4J_PORT || '7687',
          user: process.env.NEO4J_USER || 'neo4j',
          database: process.env.NEO4J_DATABASE || 'neo4j',
          connect: true,
        },
        'bad',
      );

      sandbox.assert.calledWith(
        showErrorMessageStub,
        'Neo4jError: The client is unauthorized due to authentication failure.',
      );
    });
  });

  suite('deleteConnectionCommand', () => {
    test('Deleting a connection should show a success message', async () => {
      const stub = sandbox.stub(
        window,
        'showWarningMessage',
      ) as unknown as sinon.SinonStub<
        [string, MessageOptions, ...string[]],
        Thenable<string>
      >;

      stub
        .withArgs(sinon.match.string, sinon.match.object, sinon.match.string)
        .resolves('Yes');

      await commands.executeCommand(
        constants.COMMANDS.DELETE_CONNECTION_COMMAND,
        {
          key: 'mock-key-2',
          label: 'mock-connection-2-update',
        },
      );

      sandbox.assert.calledWith(
        showInformationMessageStub,
        constants.MESSAGES.CONNECTION_DELETED_SUCCESSFULLY_MESSAGE,
      );
    });

    test('Dismissing delete connection prompt should not show any messages', async () => {
      sandbox.stub(window, 'showWarningMessage').resolves(undefined);

      await commands.executeCommand(
        constants.COMMANDS.DELETE_CONNECTION_COMMAND,
        {
          key: 'mock-key-2',
          label: 'mock-connection-2-update',
        },
      );

      sandbox.assert.notCalled(showInformationMessageStub);
    });

    test('Any other response from delete connection prompt should not show any messages', async () => {
      const stub = sandbox.stub(
        window,
        'showWarningMessage',
      ) as unknown as sinon.SinonStub<
        [string, MessageOptions, ...string[]],
        Thenable<string>
      >;

      stub
        .withArgs(sinon.match.string, sinon.match.object, sinon.match.string)
        .resolves('No');

      await commands.executeCommand(
        constants.COMMANDS.DELETE_CONNECTION_COMMAND,
        {
          key: 'mock-key-2',
          label: 'mock-connection-2-update',
        },
      );

      sandbox.assert.notCalled(showInformationMessageStub);
    });
  });

  suite('connectCommand', () => {
    test('Connecting to a disconnected connection should show a success message', async () => {
      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: process.env.NEO4J_SCHEME || 'neo4j',
          host: process.env.NEO4J_HOST || 'localhost',
          port: process.env.NEO4J_PORT || '7687',
          user: process.env.NEO4J_USER || 'neo4j',
          database: process.env.NEO4J_DATABASE || 'neo4j',
          connect: false,
        },
        process.env.NEO4J_PASSWORD || 'password',
      );

      await commands.executeCommand(constants.COMMANDS.CONNECT_COMMAND, {
        key: 'mock-key-2',
      });

      sandbox.assert.calledWith(
        showInformationMessageStub,
        constants.MESSAGES.CONNECTED_MESSAGE,
      );
    });
  });

  suite('disconnectCommand', () => {
    test('Disconnecting from a connection should show a success message', async () => {
      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: process.env.NEO4J_SCHEME || 'neo4j',
          host: process.env.NEO4J_HOST || 'localhost',
          port: process.env.NEO4J_PORT || '7687',
          user: process.env.NEO4J_USER || 'neo4j',
          database: process.env.NEO4J_DATABASE || 'neo4j',
          connect: true,
        },
        process.env.NEO4J_PASSWORD || 'password',
      );

      await commands.executeCommand(constants.COMMANDS.DISCONNECT_COMMAND, {
        key: 'mock-key-2',
      });

      sandbox.assert.calledWith(
        showInformationMessageStub,
        constants.MESSAGES.DISCONNECTED_MESSAGE,
      );
    });
  });
});
