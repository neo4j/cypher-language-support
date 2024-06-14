import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { commands, window } from 'vscode';
import { constants } from '../../src/constants';

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
        true,
      );

      sinon.assert.calledOnceWithExactly(
        showInformationMessageStub,
        constants.MESSAGES.CONNECTION_SAVED_SUCCESSFULLY_MESSAGE,
      );
    });

    test('Updating a valid connection should show a success message', async () => {
      await commands.executeCommand(
        constants.COMMANDS.SAVE_CONNECTION_COMMAND,
        {
          name: 'mock-connection-2-update',
          key: 'mock-key-2',
          scheme: process.env.NEO4J_SCHEME || 'neo4j',
          host: process.env.NEO4J_HOST || 'localhost',
          port: process.env.NEO4J_PORT || '7687',
          user: process.env.NEO4J_USER || 'neo4j',
          database: process.env.NEO4J_DATABASE || 'neo4j',
          connect: true,
        },
        process.env.NEO4J_PASSWORD || 'password',
        false,
      );

      sinon.assert.calledOnceWithExactly(
        showInformationMessageStub,
        constants.MESSAGES.CONNECTION_SAVED_SUCCESSFULLY_MESSAGE,
      );
    });
  });

  suite('deleteConnectionCommand', () => {
    test('Deleting a connection should show a success message', async () => {
      // The following line is necessary because the showWarningMessage method
      // used in commands.ts is using one of the overloads with the <T extends string>
      // generic argument, but the stubbed type resolves to the non-generic version of the method
      // which uses the MessageItem type.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stub = sinon.stub(window, 'showWarningMessage' as any);
      stub.resolves('Yes');

      await commands.executeCommand(
        constants.COMMANDS.DELETE_CONNECTION_COMMAND,
        {
          key: 'mock-key-2',
          label: 'mock-connection-2-update',
        },
      );

      sinon.assert.calledOnceWithExactly(
        showInformationMessageStub,
        constants.MESSAGES.CONNECTION_DELETED_SUCCESSFULLY_MESSAGE,
      );

      stub.restore();
    });

    test('Dismissing delete connection prompt should not show any messages', async () => {
      const stub = sinon.stub(window, 'showWarningMessage');
      stub.resolves(undefined);

      await commands.executeCommand(
        constants.COMMANDS.DELETE_CONNECTION_COMMAND,
        {
          key: 'mock-key-2',
          label: 'mock-connection-2-update',
        },
      );

      sinon.assert.notCalled(showInformationMessageStub);

      stub.restore();
    });

    test('Any other response from delete connection prompt should not show any messages', async () => {
      // The following line is necessary because the showWarningMessage method
      // used in commands.ts is using one of the overloads with the <T extends string>
      // generic argument, but the stubbed type resolves to the non-generic version of the method
      // which uses the MessageItem type.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stub = sinon.stub(window, 'showWarningMessage' as any);
      stub.resolves('No');

      await commands.executeCommand(
        constants.COMMANDS.DELETE_CONNECTION_COMMAND,
        {
          key: 'mock-key-2',
          label: 'mock-connection-2-update',
        },
      );

      sinon.assert.notCalled(showInformationMessageStub);

      stub.restore();
    });
  });

  suite('connectCommand', () => {
    test('Connecting to a connection should show a success message', async () => {
      await commands.executeCommand(constants.COMMANDS.CONNECT_COMMAND, {
        key: 'mock-key',
        connect: true,
      });

      sinon.assert.calledOnceWithExactly(
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

      sinon.assert.calledOnceWithExactly(
        showInformationMessageStub,
        constants.MESSAGES.DISCONNECTED_MESSAGE,
      );
    });
  });
});
