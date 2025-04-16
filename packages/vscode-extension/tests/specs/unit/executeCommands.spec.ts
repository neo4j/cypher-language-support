import { FRIENDLY_ERROR_MESSAGES } from '@neo4j-cypher/query-tools';
import { after, afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { commands, MessageOptions, window } from 'vscode';
import { CONSTANTS } from '../../../src/constants';
import { getNeo4jConfiguration } from '../../helpers';
import {
  connectDefault,
  defaultConnectionKey,
  saveDefaultConnection,
} from '../../suiteSetup';

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
    await saveDefaultConnection();
  });

  suite('saveConnectionCommand', () => {
    test('Creating and activating a valid connection should show a success message', async () => {
      const { scheme, host, port, user, database, password } =
        getNeo4jConfiguration();
      await commands.executeCommand(
        CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: scheme,
          host: host,
          port: port,
          user: user,
          database: database,
          state: 'activating',
        },
        password,
      );

      sandbox.assert.calledWith(
        showInformationMessageStub,
        CONSTANTS.MESSAGES.CONNECTED_MESSAGE,
      );
    });

    test('Saving a connection with invalid credentials should show a warning message', async () => {
      const { scheme, host, port, user, database } = getNeo4jConfiguration();
      const stub = sandbox.stub(
        window,
        'showWarningMessage',
      ) as unknown as sinon.SinonStub<
        [string, MessageOptions, ...string[]],
        Thenable<string>
      >;
      await commands.executeCommand(
        CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: scheme,
          host: host,
          port: port,
          user: user,
          database: database,
          state: 'activating',
        },
        'bad',
      );

      sandbox.assert.calledWith(
        stub,
        'Unable to connect to Neo4j. Would you like to save the connection anyway?',
        {
          modal: true,
          detail: `${FRIENDLY_ERROR_MESSAGES['Neo.ClientError.Security.Unauthorized']}.`,
        },
        'Yes',
      );
    });

    test('Saving a connection with an invalid database should show a warning message', async () => {
      const { scheme, host, port, user, password } = getNeo4jConfiguration();
      const stub = sandbox.stub(
        window,
        'showWarningMessage',
      ) as unknown as sinon.SinonStub<
        [string, MessageOptions, ...string[]],
        Thenable<string>
      >;
      await commands.executeCommand(
        CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: scheme,
          host: host,
          port: port,
          user: user,
          database: 'bad',
          state: 'activating',
        },
        password,
      );

      sandbox.assert.calledWith(
        stub,
        'Unable to connect to Neo4j. Would you like to save the connection anyway?',
        {
          modal: true,
          detail: `${FRIENDLY_ERROR_MESSAGES['Neo.ClientError.Database.DatabaseNotFound']}.`,
        },
        'Yes',
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
        CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
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
        'Unable to connect to Neo4j. Would you like to save the connection anyway?',
        {
          modal: true,
          detail: `${FRIENDLY_ERROR_MESSAGES['ServiceUnavailable']}.`,
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
        CONSTANTS.COMMANDS.DELETE_CONNECTION_COMMAND,
        {
          key: 'mock-key-2',
          label: 'mock-connection-2-update',
        },
      );

      sandbox.assert.calledWith(
        showInformationMessageStub,
        CONSTANTS.MESSAGES.CONNECTION_DELETED,
      );
    });

    test('Deleting another connection should not disconnect the current one', async () => {
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

      const { scheme, host, port, user, database, password } =
        getNeo4jConfiguration();
      await commands.executeCommand(
        CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'about-to-be-deleted',
          key: 'about-to-be-deleted',
          scheme: scheme,
          host: host,
          port: port,
          user: user,
          database: database,
          state: 'activating',
        },
        password,
      );

      await connectDefault();
      sandbox.assert.calledWith(
        showInformationMessageStub,
        CONSTANTS.MESSAGES.CONNECTED_MESSAGE,
      );

      await commands.executeCommand(
        CONSTANTS.COMMANDS.DELETE_CONNECTION_COMMAND,
        {
          key: 'about-to-be-deleted',
          label: 'about-to-be-deleted',
        },
      );

      sandbox.assert.neverCalledWith(
        showInformationMessageStub,
        CONSTANTS.MESSAGES.DISCONNECTED_MESSAGE,
      );
    });

    test('Deleting the in-use connection should disconnect that connection', async () => {
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

      await connectDefault();
      showErrorMessageStub.resetHistory();

      await commands.executeCommand(
        CONSTANTS.COMMANDS.DELETE_CONNECTION_COMMAND,
        {
          key: defaultConnectionKey,
          label: defaultConnectionKey,
        },
      );

      sandbox.assert.calledWith(
        showInformationMessageStub,
        CONSTANTS.MESSAGES.DISCONNECTED_MESSAGE,
      );

      sandbox.assert.calledWith(
        showInformationMessageStub,
        CONSTANTS.MESSAGES.CONNECTION_DELETED,
      );
    });

    test('Dismissing delete connection prompt should not show any messages', async () => {
      sandbox.stub(window, 'showWarningMessage').resolves(undefined);

      await commands.executeCommand(
        CONSTANTS.COMMANDS.DELETE_CONNECTION_COMMAND,
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
        CONSTANTS.COMMANDS.DELETE_CONNECTION_COMMAND,
        {
          key: 'mock-key-2',
          label: 'mock-connection-2-update',
        },
      );

      sandbox.assert.notCalled(showInformationMessageStub);
    });
  });

  suite('connectCommand', () => {
    test('Activating an inactive connection should show a success message', async () => {
      const { scheme, host, port, user, database, password } =
        getNeo4jConfiguration();
      await commands.executeCommand(
        CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: scheme,
          host: host,
          port: port,
          user: user,
          database: database,
          state: 'inactive',
        },
        password,
      );

      await commands.executeCommand(CONSTANTS.COMMANDS.CONNECT_COMMAND, {
        key: 'mock-key-2',
      });

      sandbox.assert.calledWith(
        showInformationMessageStub,
        CONSTANTS.MESSAGES.CONNECTED_MESSAGE,
      );
    });

    test('Activating a previously saved bad connection should show a warning message', async () => {
      const warningMessagePromptStub = sandbox.stub(
        window,
        'showWarningMessage',
      ) as unknown as sinon.SinonStub<
        [string, MessageOptions, ...string[]],
        Thenable<string>
      >;

      warningMessagePromptStub.resolves('Yes');

      await commands.executeCommand(
        CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
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

      await commands.executeCommand(CONSTANTS.COMMANDS.CONNECT_COMMAND, {
        key: 'mock-key-4',
      });

      sandbox.assert.calledWithMatch(
        warningMessageStub,
        sinon.match((value: string) => {
          const regexp = new RegExp(
            `(Could not perform discovery\\. No routing servers available\\. Known routing table: RoutingTable\\[database=neo4j, expirationTime=0, currentTime=(\\d+), routers=\\[\\], readers=\\[\\], writers=\\[\\]\\]\\. ${FRIENDLY_ERROR_MESSAGES['ServiceUnavailable']}\\. Retrying in 30 seconds\\.)`,
          );
          return regexp.test(value);
        }),
      );
    });
  });

  suite('disconnectCommand', () => {
    test('Decativating a connection should show a success message', async () => {
      const { scheme, host, port, user, database, password } =
        getNeo4jConfiguration();
      await commands.executeCommand(
        CONSTANTS.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2',
          key: 'mock-key-2',
          scheme: scheme,
          host: host,
          port: port,
          user: user,
          database: database,
          state: 'active',
        },
        password,
      );

      await commands.executeCommand(CONSTANTS.COMMANDS.DISCONNECT_COMMAND, {
        key: 'mock-key-2',
      });

      sandbox.assert.calledWith(
        showInformationMessageStub,
        CONSTANTS.MESSAGES.DISCONNECTED_MESSAGE,
      );
    });
  });

  suite('switchDatabaseCommand', () => {
    beforeEach(async () => {
      await saveDefaultConnection();
      sandbox.resetHistory();
    });

    test('Switching a database should show a success message', async () => {
      await commands.executeCommand(
        CONSTANTS.COMMANDS.SWITCH_DATABASE_COMMAND,
        { type: 'database', key: 'movies' },
      );

      sandbox.assert.calledWith(
        showInformationMessageStub,
        `${CONSTANTS.MESSAGES.SUCCESSFULLY_SWITCHED_DATABASE_MESSAGE} 'movies'.`,
      );
    });

    test('Switching to a bad database should show a failure message', async () => {
      await commands.executeCommand(
        CONSTANTS.COMMANDS.SWITCH_DATABASE_COMMAND,
        { type: 'database', key: 'bad-database' },
      );

      sandbox.assert.calledWith(
        showErrorMessageStub,
        `${CONSTANTS.MESSAGES.ERROR_SWITCHING_DATABASE_MESSAGE} 'bad-database'. Unable to get a routing table for database 'bad-database' because this database does not exist. Double check that the database exists.`,
      );
    });

    test('Switching to a non-database should do nothing', async () => {
      await commands.executeCommand(
        CONSTANTS.COMMANDS.SWITCH_DATABASE_COMMAND,
        { type: 'activeDatabase', key: 'neo4j' },
      );

      sandbox.assert.notCalled(showInformationMessageStub);
      sandbox.assert.notCalled(showErrorMessageStub);
    });
  });
});
