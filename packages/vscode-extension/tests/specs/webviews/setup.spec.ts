import { before } from 'mocha';
import { createNewConnection } from '../../webviewUtils';

before(async () => {
  await createNewConnection('vscode-webview-tests-1');
  await createNewConnection('vscode-webview-tests-2');
});
