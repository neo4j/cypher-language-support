import { after, afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { commands, MessageOptions, window } from 'vscode';
import { constants } from '../../src/constants';
import { saveDefaultConnection } from '../suiteSetup';

suite('Execute commands spec', () => {
  let sandbox: sinon.SinonSandbox;
  let showInformationMessageStub: sinon.SinonStub;
  let showErrorMessageStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    showInformationMessageStub = sandbox.stub(window, 'showInformationMessage');
    showErrorMessageStub = sandbox.stub(window, 'showErrorMessage');
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(async () => {
    // Ensure we reconnect back to the default Connection when this suite is complete
    await saveDefaultConnection();
  });

  suite('saveConnectionCommand', () => {
    test('Creating and activating a valid Connection should show a success message', async () => {
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
          state: 'activating',
        },
        process.env.NEO4J_PASSWORD || 'password',
      );

      sandbox.assert.calledWith(
        showInformationMessageStub,
        constants.MESSAGES.CONNECTED_MESSAGE,
      );
    });

    test('Saving a Connection with invalid credentials should show an error message', async () => {
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
          state: 'activating',
        },
        'bad',
      );

      sandbox.assert.calledWith(
        showErrorMessageStub,
        'Unable to connect to Neo4j: Please check that your user and password are correct.',
      );
    });

    test('Saving a Connection with an invalid database should show an error message', async () => {
      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: process.env.NEO4J_SCHEME || 'neo4j',
          host: process.env.NEO4J_HOST || 'localhost',
          port: process.env.NEO4J_PORT || '7687',
          user: process.env.NEO4J_USER || 'neo4j',
          database: 'bad',
          state: 'activating',
        },
        process.env.NEO4J_PASSWORD || 'password',
      );

      sandbox.assert.calledWith(
        showErrorMessageStub,
        'Unable to connect to Neo4j: Please check that your database is correct.',
      );
    });

    test('Saving a Connection with a bad URL should show a warning message', async () => {
      const stub = sandbox.stub(
        window,
        'showWarningMessage',
      ) as unknown as sinon.SinonStub<
        [string, MessageOptions, ...string[]],
        Thenable<string>
      >;
      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-3',
          key: 'mock-key-3',
          scheme: 'neo4j',
          host: 'unknown-host',
          port: '7687',
          user: 'neo4j',
          database: 'neo4j',
          state: 'activating',
        },
        'password',
      );

      sandbox.assert.calledWith(
        stub,
        'Unable to connect to Neo4j. Would you like to save the Connection anyway?',
        {
          modal: true,
          detail:
            'Alternatively, please check that your scheme, host and port are correct.',
        },
        'Yes',
      );
    });
  });

  suite('deleteConnectionCommand', () => {
    test('Deleting a Connection should show a success message', async () => {
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
        constants.MESSAGES.CONNECTION_DELETED,
      );
    });

    test('Dismissing delete Connection prompt should not show any messages', async () => {
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

    test('Any other response from delete Connection prompt should not show any messages', async () => {
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
    test('Activating an inactive Connection should show a success message', async () => {
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
          state: 'inactive',
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

    test('Activating a previously saved bad Connection should show a warning message', async () => {
      const warningMessagePromptStub = sandbox.stub(
        window,
        'showWarningMessage',
      ) as unknown as sinon.SinonStub<
        [string, MessageOptions, ...string[]],
        Thenable<string>
      >;

      warningMessagePromptStub.resolves('Yes');

      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-4',
          key: 'mock-key-4',
          scheme: 'neo4j',
          host: 'unknown-host',
          port: '7687',
          user: 'neo4j',
          database: 'neo4j',
          state: 'inactive',
        },
        'password',
      );

      warningMessagePromptStub.restore();

      const warningMessageStub = sandbox.stub(window, 'showWarningMessage');

      await commands.executeCommand(constants.COMMANDS.CONNECT_COMMAND, {
        key: 'mock-key-4',
      });

      sandbox.assert.calledWith(
        warningMessageStub,
        'Unable to connect to Neo4j: Please check that your scheme, host and port are correct.. Retrying in 30 seconds.',
      );
    });
  });

  suite('disconnectCommand', () => {
    test('Decativating a Connection should show a success message', async () => {
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
          state: 'active',
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
