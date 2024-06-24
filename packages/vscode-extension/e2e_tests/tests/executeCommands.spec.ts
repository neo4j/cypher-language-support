import { after, afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { commands, MessageOptions, window } from 'vscode';
import { constants } from '../../src/constants';
import { getNeo4jConfiguration } from '../helpers';
import { testDatabaseKey } from '../suiteSetup';

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
    // Ensure we reconnect back to the default connection when this suite is complete
    await commands.executeCommand(constants.COMMANDS.CONNECT_COMMAND, {
      key: testDatabaseKey,
      connect: true,
    });
  });

  suite('saveConnectionCommand', () => {
    test('Creating and connecting to a valid connection should show a success message', async () => {
      const { scheme, host, port, user, database, password } =
        getNeo4jConfiguration();
      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: scheme,
          host: host,
          port: port,
          user: user,
          database: database,
          connect: true,
        },
        password,
      );

      sandbox.assert.calledWith(
        showInformationMessageStub,
        constants.MESSAGES.CONNECTED_MESSAGE,
      );
    });

    test('Saving a connection with invalid credentials should show an error message', async () => {
      const { scheme, host, port, user, database } = getNeo4jConfiguration();
      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: scheme,
          host: host,
          port: port,
          user: user,
          database: database,
          connect: true,
        },
        'bad',
      );

      sandbox.assert.calledWith(
        showErrorMessageStub,
        'Unable to connect to Neo4j: Please check that your user and password are correct.',
      );
    });

    test('Saving a connection with an invalid database should show an error message', async () => {
      const { scheme, host, port, user, password } = getNeo4jConfiguration();
      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: scheme,
          host: host,
          port: port,
          user: user,
          database: 'bad',
          connect: true,
        },
        password,
      );

      sandbox.assert.calledWith(
        showErrorMessageStub,
        'Unable to connect to Neo4j: Please check that your database is correct.',
      );
    });

    test('Saving a connection with a bad URL should show a warning message', async () => {
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
          connect: true,
        },
        'password',
      );

      sandbox.assert.calledWith(
        stub,
        'Unable to connect to Neo4j. Would you like to save the connection anyway?',
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
        constants.MESSAGES.CONNECTION_DELETED,
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
      const { scheme, host, port, user, database, password } =
        getNeo4jConfiguration();
      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: scheme,
          host: host,
          port: port,
          user: user,
          database: database,
          connect: false,
        },
        password,
      );

      await commands.executeCommand(constants.COMMANDS.CONNECT_COMMAND, {
        key: 'mock-key-2',
      });

      sandbox.assert.calledWith(
        showInformationMessageStub,
        constants.MESSAGES.CONNECTED_MESSAGE,
      );
    });

    test('Connecting to a previously saved bad connection should show a warning message', async () => {
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
          connect: false,
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
    test('Disconnecting from a connection should show a success message', async () => {
      const { scheme, host, port, user, database, password } =
        getNeo4jConfiguration();
      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: scheme,
          host: host,
          port: port,
          user: user,
          database: database,
          connect: true,
        },
        password,
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
