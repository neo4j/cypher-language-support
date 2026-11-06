import type { StartedNeo4jContainer } from '@testcontainers/neo4j';
import { after, before } from 'mocha';
import { closeActiveTab, createNewConnection } from '../../webviewUtils';
import { browser } from '@wdio/globals';

const containers: StartedNeo4jContainer[] = [];

before(async () => {
  containers.push(await createNewConnection('vscode-webview-tests-1'));
  containers.push(await createNewConnection('vscode-webview-tests-2'));
  await closeActiveTab(browser);
});

after(async () => {
  await Promise.all(containers.map((container) => container.stop()));
});
