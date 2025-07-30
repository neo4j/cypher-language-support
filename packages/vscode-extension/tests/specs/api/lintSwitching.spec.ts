import { after, afterEach, beforeEach, before } from 'mocha';
import * as sinon from 'sinon';
import { commands, window } from 'vscode';
import * as vscode from 'vscode';
import { CONSTANTS } from '../../../src/constants';
import {
  getExtensionStoragePath,
  newUntitledFileWithContent,
} from '../../helpers';
import { saveDefaultConnection } from '../../suiteSetup';
import { rmSync } from 'fs';
import { testSyntaxValidation } from './syntaxValidation.spec';
import * as linterService from '../../../src/linterService';
import { setupMockContextStubs } from '../../mocks/setupMockContextStubs';
import { MockLanguageClient } from '../../mocks/mockLanguageClient';
import { switchToLinter } from '../../../src/linterSwitching';
import { manuallyAdjustLinter } from '../../../src/commandHandlers/linters';
import assert from 'assert';
import { LintWorkerSettings } from '@neo4j-cypher/language-server/src/types';

suite('Lint switching spec', () => {
  let sandbox: sinon.SinonSandbox;
  let switchToLocalLinterSpy: sinon.SinonSpy;
  let sendNotificationSpy: sinon.SinonSpy;
  let mockLanguageClient: MockLanguageClient;

  let showInformationMessageStub: sinon.SinonStub;
  let showErrorMessageStub: sinon.SinonStub;
  let textDocument: vscode.TextDocument;

  before(async () => {
    textDocument = await newUntitledFileWithContent(`
      UNWIND range(1, 100) AS i
      CALL (i) {
          MERGE (u:User {id: i})
          ON CREATE SET u.created = timestamp()
      } IN TRANSACTIONS ON ERROR RETRY 1 SECOND THEN FAIL
    `);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    showInformationMessageStub = sandbox.stub(window, 'showInformationMessage');
    showErrorMessageStub = sandbox.stub(window, 'showErrorMessage');

    const stubs = setupMockContextStubs(sandbox);
    mockLanguageClient = stubs.mockLanguageClient;
    switchToLocalLinterSpy = sandbox.spy(linterService, 'switchToLocalLinter');
    sendNotificationSpy = sandbox.spy(mockLanguageClient, 'sendNotification');
    await saveDefaultConnection();
    sandbox.resetHistory();
  });

  afterEach(() => {
    sandbox.restore();
  });

  after(async () => {
    // Ensure we reconnect back to the default connection when this suite is complete
    await saveDefaultConnection();
  });

  function checkLinterUpdatedInLanguageServer(version?: string) {
    assert(sendNotificationSpy.calledOnce === true);
    assert(sendNotificationSpy.args.length === 1);
    assert(sendNotificationSpy.args[0].length === 2);
    assert(sendNotificationSpy.args[0][0] === 'updateLintWorker');

    const { linterVersion, lintWorkerPath } = sendNotificationSpy
      .args[0][1] as LintWorkerSettings;
    assert(linterVersion === version);

    if (version) {
      const versionRegex = new RegExp(`.*${version}.*\\.cjs`);
      assert(lintWorkerPath.match(versionRegex) !== null);
    } else {
      assert(lintWorkerPath === undefined);
    }
  }

  test('Switching the linter to an old one should show different errors', async () => {
    const linterVersion = '5.26';
    const stub = sandbox.stub(
      window,
      'showQuickPick',
    ) as unknown as sinon.SinonStub<
      [string[], vscode.QuickPickOptions],
      Thenable<string>
    >;
    stub.resolves(linterVersion);

    await commands.executeCommand(CONSTANTS.COMMANDS.SWITCH_LINTER_COMMAND);

    await testSyntaxValidation({
      docUri: textDocument.uri,
      expected: [
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(5, 33),
            new vscode.Position(5, 38),
          ),
          'Expected any of BREAK, CONTINUE or FAIL',
          vscode.DiagnosticSeverity.Error,
        ),
      ],
    });
  });

  test('Switching the linter when it is not downloaded should trigger a download', async () => {
    const lintersFolder = getExtensionStoragePath();
    rmSync(lintersFolder, { force: true, recursive: true });
    const linterVersion = '2025.06';
    const stub = sandbox.stub(
      window,
      'showQuickPick',
    ) as unknown as sinon.SinonStub<
      [string[], vscode.QuickPickOptions],
      Thenable<string>
    >;

    stub.resolves(linterVersion);

    await manuallyAdjustLinter();

    sandbox.assert.calledWith(
      showInformationMessageStub,
      `Downloading linter ${linterVersion} for your server`,
    );
    checkLinterUpdatedInLanguageServer(linterVersion);
  });

  test('Switching the linter when it is downloaded should not trigger a download', async () => {
    const linterVersion = '2025.06';
    const stub = sandbox.stub(
      window,
      'showQuickPick',
    ) as unknown as sinon.SinonStub<
      [string[], vscode.QuickPickOptions],
      Thenable<string>
    >;

    stub.resolves(linterVersion);

    await manuallyAdjustLinter();

    sandbox.assert.neverCalledWith(
      showInformationMessageStub,
      `Downloading linter ${linterVersion} for your server`,
    );
    checkLinterUpdatedInLanguageServer(linterVersion);
  });

  test('Switching the linter back to a new one should show different errors', async () => {
    const linterVersion = '2025.06';
    const stub = sandbox.stub(
      window,
      'showQuickPick',
    ) as unknown as sinon.SinonStub<
      [string[], vscode.QuickPickOptions],
      Thenable<string>
    >;
    stub.resolves(linterVersion);

    await commands.executeCommand(CONSTANTS.COMMANDS.SWITCH_LINTER_COMMAND);

    await testSyntaxValidation({
      docUri: textDocument.uri,
      expected: [],
    });
  });

  test('If the linter is not available on npm we get an error message', async () => {
    const linterVersion = '5.28';
    const stub = sandbox.stub(
      window,
      'showQuickPick',
    ) as unknown as sinon.SinonStub<
      [string[], vscode.QuickPickOptions],
      Thenable<string>
    >;
    stub.resolves(linterVersion);

    await manuallyAdjustLinter();

    sandbox.assert.calledWith(
      showInformationMessageStub,
      `Downloading linter ${linterVersion} for your server`,
    );

    sandbox.assert.calledWith(
      showErrorMessageStub,
      CONSTANTS.MESSAGES.LINTER_VERSION_NOT_AVAILABLE,
    );
    checkLinterUpdatedInLanguageServer(undefined);
  });

  test('If no npm releases were retrieved we switch to the default linter', async () => {
    const linterVersion = '5.26';
    await switchToLinter(linterVersion, []);
    sandbox.assert.calledOnceWithExactly(switchToLocalLinterSpy, linterVersion);
  });
});
