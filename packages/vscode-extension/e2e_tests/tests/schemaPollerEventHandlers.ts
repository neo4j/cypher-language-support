import assert from 'assert';
import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { commands, window } from 'vscode';
import * as connection from '../../src/connectionService';
import { CONSTANTS } from '../../src/constants';
import {
  handleConnectionErrored,
  handleConnectionFailed,
  handleConnectionReconnected,
} from '../../src/schemaPollerEventHandlers';
import { getMockConnection } from '../helpers';

suite('Schema poller event handlers spec', () => {
  let sandbox: sinon.SinonSandbox;

  let executeCommandStub: sinon.SinonStub;
  let showErrorMessageStub: sinon.SinonStub;
  let showWarningMessageStub: sinon.SinonStub;
  let showInformationMessageStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    executeCommandStub = sandbox.stub(commands, 'executeCommand');
    showErrorMessageStub = sandbox.stub(window, 'showErrorMessage');
    showWarningMessageStub = sandbox.stub(window, 'showWarningMessage');
    showInformationMessageStub = sandbox.stub(window, 'showInformationMessage');
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('Should update a Connection state to active when saveConnectionStateAsConnectedAndShowInfoMessage is called', async () => {
    const mockConnection = getMockConnection(true);
    await connection.saveConnection({
      ...mockConnection,
      state: 'error',
    });

    handleConnectionReconnected();
    const updatedConnection = connection.getConnectionByKey(mockConnection.key);

    assert.strictEqual(updatedConnection.state, 'active');
    sandbox.assert.calledOnceWithExactly(
      showInformationMessageStub,
      CONSTANTS.MESSAGES.RECONNECTED_MESSAGE,
    );
    sandbox.assert.calledWithExactly(
      executeCommandStub,
      CONSTANTS.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
  });

  test('Should update a Connection state to error and display a warning message when saveConnectionStateAsErroredAndShowWarningMessage is called', async () => {
    const mockConnection = getMockConnection(true);
    await connection.saveConnection(mockConnection);

    handleConnectionErrored('error message');
    const updatedConnection = connection.getConnectionByKey(mockConnection.key);

    assert.strictEqual(updatedConnection.state, 'error');
    sandbox.assert.calledOnceWithExactly(
      showWarningMessageStub,
      'error message',
    );
    sandbox.assert.calledWithExactly(
      executeCommandStub,
      CONSTANTS.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
  });

  test('Should update a Connection state to inactive and display an error message when saveConnectionStateAsDisconnectedAndShowErrorMessage is called', async () => {
    const mockConnection = getMockConnection(true);
    await connection.saveConnection(mockConnection);

    handleConnectionFailed('error message');
    const updatedConnection = connection.getConnectionByKey(mockConnection.key);

    assert.strictEqual(updatedConnection.state, 'inactive');
    sandbox.assert.calledOnceWithExactly(showErrorMessageStub, 'error message');
    sandbox.assert.calledWithExactly(
      executeCommandStub,
      CONSTANTS.COMMANDS.REFRESH_CONNECTIONS_COMMAND,
    );
  });
});
