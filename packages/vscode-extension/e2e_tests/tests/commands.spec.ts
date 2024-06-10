import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import {
  CONNECTED_MESSAGE,
  CONNECTION_CREATED_SUCCESSFULLY_MESSAGE,
  CONNECTION_DELETED_SUCCESSFULLY_MESSAGE,
  CONNECTION_FAILED_MESSAGE,
  CONNECTION_UPDATED_SUCCESSFULLY_MESSAGE,
  CONNECT_COMMAND,
  DELETE_CONNECTION_COMMAND,
  DISCONNECTED_MESSAGE,
  DISCONNECT_COMMAND,
  SAVE_CONNECTION_COMMAND,
  TEST_CONNECTION_COMMAND,
  TEST_CONNECTION_SUCCESFUL_MESSAGE,
} from '../../src/constants';

suite('Commands spec', () => {
  let showErrorMessageStub: sinon.SinonStub;
  let showInformationMessageStub: sinon.SinonStub;

  beforeEach(() => {
    showErrorMessageStub = sinon.stub(vscode.window, 'showErrorMessage');
    showInformationMessageStub = sinon.stub(
      vscode.window,
      'showInformationMessage',
    );
  });

  afterEach(() => {
    showErrorMessageStub.restore();
    showInformationMessageStub.restore();
  });

  test('Testing a valid connection should show a success message', async () => {
    await vscode.commands.executeCommand(
      TEST_CONNECTION_COMMAND,
      {
        name: 'test',
        key: 'test',
        scheme: process.env.NEO4J_SCHEME || 'neo4j',
        host: process.env.NEO4J_HOST || 'localhost',
        port: process.env.NEO4J_PORT || '7687',
        user: process.env.NEO4J_USER || 'neo4j',
        database: process.env.NEO4J_DATABASE || 'neo4j',
        connect: true,
      },
      process.env.NEO4J_PASSWORD || 'password',
    );

    sinon.assert.calledOnceWithExactly(
      showInformationMessageStub,
      TEST_CONNECTION_SUCCESFUL_MESSAGE,
    );
  });

  test('Testing an invalid connection should show a failure message', async () => {
    await vscode.commands.executeCommand(TEST_CONNECTION_COMMAND, {}, '');

    sinon.assert.calledOnceWithExactly(
      showErrorMessageStub,
      CONNECTION_FAILED_MESSAGE,
    );
  });

  test('Creating an invalid connection should show a failure message', async () => {
    await vscode.commands.executeCommand(
      SAVE_CONNECTION_COMMAND,
      {},
      '',
      false,
    );

    sinon.assert.calledOnceWithExactly(
      showErrorMessageStub,
      CONNECTION_FAILED_MESSAGE,
    );
  });

  test('Creating a valid connection should show a success message', async () => {
    await vscode.commands.executeCommand(
      SAVE_CONNECTION_COMMAND,
      {
        name: 'test-2',
        key: 'test-2',
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
    await vscode.commands.executeCommand(
      SAVE_CONNECTION_COMMAND,
      {
        name: 'test-2-update',
        key: 'test-2',
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

  test('Dismissing the connection deletion modal should not show a message', async () => {
    const stub = sinon.stub(vscode.window, 'showWarningMessage');
    stub.resolves(undefined);

    await vscode.commands.executeCommand(DELETE_CONNECTION_COMMAND, {
      key: 'test-2',
      label: 'test',
    });

    sinon.assert.notCalled(showInformationMessageStub);

    stub.restore();
  });

  test('Deleting a connection should show a success message', async () => {
    // The following line is necessary because the showWarningMessage method
    // used in commands.ts is using one of the overloads with the <T extends string>
    // generic argument, but the stubbed type resolves to the non-generic version of the method
    // which uses the MessageItem type.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stub = sinon.stub(vscode.window, 'showWarningMessage' as any);
    stub.resolves('Yes');

    await vscode.commands.executeCommand(DELETE_CONNECTION_COMMAND, {
      key: 'test-2',
      label: 'test',
    });

    sinon.assert.calledOnceWithExactly(
      showInformationMessageStub,
      CONNECTION_DELETED_SUCCESSFULLY_MESSAGE,
    );

    stub.restore();
  });

  test('Connecting to a valid connection should show a success message', async () => {
    await vscode.commands.executeCommand(CONNECT_COMMAND, {
      key: 'test',
      connect: true,
    });

    sinon.assert.calledOnceWithExactly(
      showInformationMessageStub,
      CONNECTED_MESSAGE,
    );
  });

  test('Disconnecting from a valid connection should show a success message', async () => {
    await vscode.commands.executeCommand(DISCONNECT_COMMAND, {
      key: 'test',
      connect: false,
    });

    sinon.assert.calledOnceWithExactly(
      showInformationMessageStub,
      DISCONNECTED_MESSAGE,
    );
  });
});
