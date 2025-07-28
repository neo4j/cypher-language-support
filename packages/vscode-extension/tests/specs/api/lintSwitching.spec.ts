import { after, afterEach, beforeEach, before } from 'mocha';
import * as sinon from 'sinon';
import { commands, window } from 'vscode';
import * as vscode from 'vscode';
import { CONSTANTS } from '../../../src/constants';
import { getExtensionStoragePath, newUntitledFileWithContent } from '../../helpers';
import {
  saveDefaultConnection,
} from '../../suiteSetup';
import { rmSync } from 'fs';
import { testSyntaxValidation } from './syntaxValidation.spec';

suite('Lint switching spec', () => {
  let sandbox: sinon.SinonSandbox;
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
  })

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    showInformationMessageStub = sandbox.stub(window, 'showInformationMessage');
    showErrorMessageStub = sandbox.stub(window, 'showErrorMessage');
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

  test('Switching the linter to an old one should show different errors', async () => {
    const linterVersion = '5.26'
    const stub = sandbox.stub(
      window,
      'showQuickPick',
    ) as unknown as sinon.SinonStub<
      [string[], vscode.QuickPickOptions],
      Thenable<string>
    >;
    stub
      .resolves(linterVersion);
    
    await commands.executeCommand(
      CONSTANTS.COMMANDS.SWITCH_LINTER_COMMAND
    );
    
    // We need to wait here because diagnostics are eventually
    // consistent i.e. they don't show up immediately
    await testSyntaxValidation({
      docUri: textDocument.uri,
      expected: [
        new vscode.Diagnostic(
          new vscode.Range(
            new vscode.Position(5, 33),
            new vscode.Position(5, 38),
          ),
          "Expected any of BREAK, CONTINUE or FAIL",
          vscode.DiagnosticSeverity.Error
        )
      ]
    });
  });

  test('Switching the linter when it is not downloaded should trigger a download', async () => {
    const lintersFolder = getExtensionStoragePath();
    rmSync(lintersFolder, { force: true, recursive: true });
    const linterVersion = '2025.06'
    const stub = sandbox.stub(
      window,
      'showQuickPick',
    ) as unknown as sinon.SinonStub<
      [string[], vscode.QuickPickOptions],
      Thenable<string>
    >;

    stub
      .resolves(linterVersion);
    
    await commands.executeCommand(
      CONSTANTS.COMMANDS.SWITCH_LINTER_COMMAND
    );

    sandbox.assert.calledWith(
      showInformationMessageStub,
      `Downloading linter ${linterVersion} for your server`,
    );
  });

  test('Switching the linter when it is downloaded should not trigger a download', async () => {
    const linterVersion = '2025.06'
    const stub = sandbox.stub(
      window,
      'showQuickPick',
    ) as unknown as sinon.SinonStub<
      [string[], vscode.QuickPickOptions],
      Thenable<string>
    >;

    stub
      .resolves(linterVersion);
    
    await commands.executeCommand(
      CONSTANTS.COMMANDS.SWITCH_LINTER_COMMAND
    );

    sandbox.assert.neverCalledWith(
      showInformationMessageStub,
      `Downloading linter ${linterVersion} for your server`,
    );
  });

  test('Switching the linter back to a new one should show different errors', async () => {
    const linterVersion = '2025.06'
    const stub = sandbox.stub(
      window,
      'showQuickPick',
    ) as unknown as sinon.SinonStub<
      [string[], vscode.QuickPickOptions],
      Thenable<string>
    >;
    stub
      .resolves(linterVersion);
    
    await commands.executeCommand(
      CONSTANTS.COMMANDS.SWITCH_LINTER_COMMAND
    );
    
    // We need to wait here because diagnostics are eventually
    // consistent i.e. they don't show up immediately
    await testSyntaxValidation({
      docUri: textDocument.uri,
      expected: []
    });
  });

});
