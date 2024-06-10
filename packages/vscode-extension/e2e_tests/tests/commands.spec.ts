import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import {
  CONNECTION_CREATED_SUCCESSFULLY_MESSAGE,
  CONNECTION_FAILED_MESSAGE,
  CONNECTION_UPDATED_SUCCESSFULLY_MESSAGE,
  SAVE_CONNECTION_COMMAND,
  TEST_CONNECTION_COMMAND,
  TEST_CONNECTION_SUCCESFUL_MESSAGE,
} from '../../src/util/constants';

suite('Extension spec', () => {
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
    const result = await vscode.commands.executeCommand<boolean>(
      SAVE_CONNECTION_COMMAND,
      {},
      '',
      false,
    );

    assert.equal(result, false);
    sinon.assert.calledOnceWithExactly(
      showErrorMessageStub,
      CONNECTION_FAILED_MESSAGE,
    );
  });

  test('Creating a valid connection should show a success message', async () => {
    const result = await vscode.commands.executeCommand<boolean>(
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

    assert.equal(result, true);
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
});
