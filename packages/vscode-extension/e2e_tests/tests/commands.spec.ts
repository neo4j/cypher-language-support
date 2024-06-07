import * as assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import {
  CONNECTION_FAILED_MESSAGE,
  CONNECTION_SUCCESFUL_MESSAGE,
  CREATE_CONNECTION_COMMAND,
  TEST_CONNECTION_COMMAND,
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
      CONNECTION_SUCCESFUL_MESSAGE,
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
    const result = await vscode.commands.executeCommand(
      CREATE_CONNECTION_COMMAND,
      {},
      '',
    );

    assert.equal(result, false);
    sinon.assert.calledOnceWithExactly(
      showErrorMessageStub,
      CONNECTION_FAILED_MESSAGE,
    );
  });
});
