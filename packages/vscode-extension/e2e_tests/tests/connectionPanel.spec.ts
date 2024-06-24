import { afterEach, beforeEach } from 'mocha';
import * as sinon from 'sinon';
import { commands, WebviewPanel, window } from 'vscode';
import * as connectionService from '../../src/connectionService';
import { constants } from '../../src/constants';
import * as contextService from '../../src/contextService';
import {
  ConnectionPanel,
  ConnectionPanelMessage,
} from '../../src/webviews/connectionPanel';
import { getMockConnection } from '../helpers';
import { MockExtensionContext } from '../mocks/mockExtensionContext';
import { MockLanguageClient } from '../mocks/mockLanguageClient';

suite('Connection panel spec', () => {
  let sandbox: sinon.SinonSandbox;
  let mockContext: MockExtensionContext;
  let mockLanguageClient: MockLanguageClient;
  let saveConnectionStub: sinon.SinonStub;
  let executeCommandStub: sinon.SinonStub;
  let showErrorMessageStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockContext = new MockExtensionContext();
    mockLanguageClient = new MockLanguageClient();

    saveConnectionStub = sandbox.stub(connectionService, 'saveConnection');
    executeCommandStub = sandbox.stub(commands, 'executeCommand');
    showErrorMessageStub = sandbox.stub(window, 'showErrorMessage');
    sandbox.stub(contextService, 'getExtensionContext').returns(mockContext);
    sandbox
      .stub(contextService, 'getLanguageClient')
      .returns(mockLanguageClient);

    const setContextStub = sandbox.stub(contextService, 'setContext');

    setContextStub(mockContext, mockLanguageClient);
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('Should execute neo4j.saveConnection and call through to saveConnection when receiving an onSaveConnection command', (done) => {
    let messageReceived: (message: ConnectionPanelMessage) => void;

    sandbox.stub(window, 'createWebviewPanel').returns({
      webview: {
        onDidReceiveMessage: (
          callback: (message: ConnectionPanelMessage) => void,
        ): void => {
          messageReceived = callback;
          done();
        },
        asWebviewUri: () => '',
      },
      dispose: () => '',
    } as unknown as WebviewPanel);

    ConnectionPanel.createOrShow('');

    const mockConnection = getMockConnection();

    messageReceived({
      command: 'onSaveConnection',
      connection: mockConnection,
      password: 'mock-password',
    });

    sandbox.assert.calledOnceWithExactly(
      executeCommandStub,
      constants.COMMANDS.SAVE_CONNECTION_COMMAND,
      mockConnection,
      'mock-password',
    );

    sandbox.assert.calledOnceWithExactly(
      saveConnectionStub,
      mockConnection,
      'mock-password',
    );
  });

  test('Should display an error message and not call through to saveConnection when receiving an onValidationError command', (done) => {
    let messageReceived: (message: ConnectionPanelMessage) => void;

    sandbox.stub(window, 'createWebviewPanel').returns({
      webview: {
        onDidReceiveMessage: (
          callback: (message: ConnectionPanelMessage) => void,
        ): void => {
          messageReceived = callback;
          done();
        },
        asWebviewUri: () => '',
      },
      dispose: () => '',
    } as unknown as WebviewPanel);

    ConnectionPanel.createOrShow('');

    messageReceived({
      command: 'onValidationError',
    });

    sandbox.assert.calledOnceWithExactly(
      showErrorMessageStub,
      constants.MESSAGES.CONNECTION_VALIDATION_MESSAGE,
    );
    sandbox.assert.notCalled(executeCommandStub);
    sandbox.assert.notCalled(saveConnectionStub);
  });

  test('Should dispose the panel when receiving an onSaveConnection command', (done) => {
    let messageReceived: (message: ConnectionPanelMessage) => void;
    const disposeSpy = sandbox.spy(() => '');

    sandbox.stub(window, 'createWebviewPanel').returns({
      webview: {
        onDidReceiveMessage: (
          callback: (message: ConnectionPanelMessage) => void,
        ): void => {
          messageReceived = callback;
          done();
        },
        asWebviewUri: () => '',
      },
      dispose: disposeSpy,
    } as unknown as WebviewPanel);

    ConnectionPanel.createOrShow('');

    messageReceived({
      command: 'onSaveConnection',
      connection: getMockConnection(),
      password: 'mock-password',
    });

    sandbox.assert.calledOnce(disposeSpy);
  });

  test('Should not dispose the panel when receiving an onValidationError command', (done) => {
    let messageReceived: (message: ConnectionPanelMessage) => void;
    const disposeSpy = sandbox.spy(() => '');

    sandbox.stub(window, 'createWebviewPanel').returns({
      webview: {
        onDidReceiveMessage: (
          callback: (message: ConnectionPanelMessage) => void,
        ): void => {
          messageReceived = callback;
          done();
        },
        asWebviewUri: () => '',
      },
      dispose: disposeSpy,
    } as unknown as WebviewPanel);

    ConnectionPanel.createOrShow('');

    messageReceived({
      command: 'onValidationError',
    });

    sandbox.assert.notCalled(disposeSpy);
  });

  test('Should not dispose the panel when saveConnection returns a non success status', (done) => {
    executeCommandStub.resolves({ success: false });
    let messageReceived: (message: ConnectionPanelMessage) => void;
    const disposeSpy = sandbox.spy(() => '');

    sandbox.stub(window, 'createWebviewPanel').returns({
      webview: {
        onDidReceiveMessage: (
          callback: (message: ConnectionPanelMessage) => void,
        ): void => {
          messageReceived = callback;
          done();
        },
        asWebviewUri: () => '',
      },
      dispose: disposeSpy,
    } as unknown as WebviewPanel);

    ConnectionPanel.createOrShow('');

    messageReceived({
      command: 'onSaveConnection',
      connection: getMockConnection(),
      password: 'mock-password',
    });

    sandbox.assert.notCalled(disposeSpy);
  });
});
