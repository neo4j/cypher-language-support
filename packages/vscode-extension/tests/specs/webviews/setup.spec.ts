import { before } from 'mocha';
import { closeActiveTab, createNewConnection } from '../../webviewUtils';
import { browser } from '@wdio/globals';

before(async () => {
  await createNewConnection('vscode-webview-tests-1');
  await createNewConnection('vscode-webview-tests-2');
  await closeActiveTab(browser);
});
