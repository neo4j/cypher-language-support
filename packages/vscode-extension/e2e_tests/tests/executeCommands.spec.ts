import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { commands, window } from 'vscode';
import {
  CONNECTED_MESSAGE,
  CONNECTION_CREATED_SUCCESSFULLY_MESSAGE,
  CONNECTION_DELETED_SUCCESSFULLY_MESSAGE,
  CONNECTION_UPDATED_SUCCESSFULLY_MESSAGE,
  CONNECT_COMMAND,
  DELETE_CONNECTION_COMMAND,
  DISCONNECTED_MESSAGE,
  DISCONNECT_COMMAND,
  SAVE_CONNECTION_COMMAND,
} from '../../src/constants';

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
        SAVE_CONNECTION_COMMAND,
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
        CONNECTION_CREATED_SUCCESSFULLY_MESSAGE,
      );
    });

    test('Updating a valid connection should show a success message', async () => {
      await commands.executeCommand(
        SAVE_CONNECTION_COMMAND,
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
        CONNECTION_UPDATED_SUCCESSFULLY_MESSAGE,
      );
    });
  });

  suite('deleteConnectionCommand', () => {
    test('should not show a message when dismissing prompt', async () => {
      const stub = sinon.stub(window, 'showWarningMessage');
      stub.resolves(undefined);

      await commands.executeCommand(DELETE_CONNECTION_COMMAND, {
        key: 'mock-key-2',
        label: 'mock-connection-2-update',
      });

      sinon.assert.notCalled(showInformationMessageStub);

      stub.restore();
    });

    test('should show a success message when deleting a connection', async () => {
      // The following line is necessary because the showWarningMessage method
      // used in commands.ts is using one of the overloads with the <T extends string>
      // generic argument, but the stubbed type resolves to the non-generic version of the method
      // which uses the MessageItem type.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stub = sinon.stub(window, 'showWarningMessage' as any);
      stub.resolves('Yes');

      await commands.executeCommand(DELETE_CONNECTION_COMMAND, {
        key: 'mock-key-2',
        label: 'mock-connection-2-update',
      });

      sinon.assert.calledOnceWithExactly(
        showInformationMessageStub,
        CONNECTION_DELETED_SUCCESSFULLY_MESSAGE,
      );

      stub.restore();
    });

    test('should not show a success message when prompt resolves with anything other than Yes', async () => {
      // The following line is necessary because the showWarningMessage method
      // used in commands.ts is using one of the overloads with the <T extends string>
      // generic argument, but the stubbed type resolves to the non-generic version of the method
      // which uses the MessageItem type.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stub = sinon.stub(window, 'showWarningMessage' as any);
      stub.resolves('No');

      await commands.executeCommand(DELETE_CONNECTION_COMMAND, {
        key: 'mock-key-2',
        label: 'mock-connection-2-update',
      });

      sinon.assert.notCalled(showInformationMessageStub);

      stub.restore();
    });
  });

  suite('connectCommand', () => {
    test('should show a success message connecting to a connection', async () => {
      await commands.executeCommand(CONNECT_COMMAND, {
        key: 'mock-key',
        connect: true,
      });

      sinon.assert.calledOnceWithExactly(
        showInformationMessageStub,
        CONNECTED_MESSAGE,
      );
    });
  });

  suite('disconnectCommand', () => {
    test('should show a success message disconnecting from a connection', async () => {
      await commands.executeCommand(DISCONNECT_COMMAND, {
        key: 'mock-key',
        connect: false,
      });

      sinon.assert.calledOnceWithExactly(
        showInformationMessageStub,
        DISCONNECTED_MESSAGE,
      );
    });
  });
});
