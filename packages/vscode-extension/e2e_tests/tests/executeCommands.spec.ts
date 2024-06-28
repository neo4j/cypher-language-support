import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { commands, MessageOptions, window } from 'vscode';
import { constants } from '../../src/constants';
import { getNeo4jConfiguration } from '../helpers';

suite('Execute commands', () => {
  let sandbox: sinon.SinonSandbox;
  let showInformationMessageStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    showInformationMessageStub = sandbox.stub(window, 'showInformationMessage');
  });

  afterEach(() => {
    sandbox.restore();
  });

  suite('saveConnectionCommand', () => {
    test('Creating a valid connection should show a success message', async () => {
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
        process.env.NEO4J_PASSWORD || 'password',
        true,
      );

      sandbox.assert.calledOnceWithExactly(
        showInformationMessageStub,
        constants.MESSAGES.CONNECTION_SAVED_SUCCESSFULLY_MESSAGE,
      );
    });

    test('Updating a valid connection should show a success message', async () => {
      const { scheme, host, port, user, database } = getNeo4jConfiguration();
      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2-update',
          key: 'mock-key-2',
          scheme: scheme,
          host: host,
          port: port,
          user: user,
          database: database,
          connect: true,
        },
        process.env.NEO4J_PASSWORD || 'password',
        false,
      );

      sandbox.assert.calledOnceWithExactly(
        showInformationMessageStub,
        constants.MESSAGES.CONNECTION_SAVED_SUCCESSFULLY_MESSAGE,
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

      sandbox.assert.calledOnceWithExactly(
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
    test('Connecting to a connection should show a success message', async () => {
      await commands.executeCommand(constants.COMMANDS.CONNECT_COMMAND, {
        key: 'mock-key',
        connect: true,
      });

      sandbox.assert.calledOnceWithExactly(
        showInformationMessageStub,
        constants.MESSAGES.CONNECTED_MESSAGE,
      );
    });
  });

  suite('disconnectCommand', () => {
    test('Disconnecting from a connection should show a success message', async () => {
      await commands.executeCommand(constants.COMMANDS.DISCONNECT_COMMAND, {
        key: 'mock-key',
        connect: false,
      });

      sandbox.assert.calledOnceWithExactly(
        showInformationMessageStub,
        constants.MESSAGES.DISCONNECTED_MESSAGE,
      );
    });
  });
});
