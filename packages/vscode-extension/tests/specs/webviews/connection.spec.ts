import { browser } from '@wdio/globals';
import { before } from 'mocha';
import * as os from 'os';
import { ViewSection, Workbench } from 'wdio-vscode-service';
import {
  clickOnContextMenuItem,
  getConnectionSection,
  waitUntilNotification,
} from '../../webviewUtils';

suite('Connection testing', () => {
  let workbench: Workbench;
  let connectionSection: ViewSection;

  before(async () => {
    workbench = await browser.getWorkbench();
    connectionSection = await getConnectionSection(workbench);
  });

  test('should disconnect from neo4j gracefully', async function () {
    if (os.platform() === 'darwin') {
      this.skip();
    }
    await clickOnContextMenuItem(connectionSection, 'Disconnect', 1);
    await waitUntilNotification(browser, 'Disconnected from Neo4j.');
  });

  test('should connect to neo4j gracefully', async function () {
    if (os.platform() === 'darwin') {
      this.skip();
    }
    await clickOnContextMenuItem(connectionSection, 'Connect', 1);
    await waitUntilNotification(browser, 'Connected to Neo4j.');
  });

  test('should be able to connect to another instance', async function () {
    if (os.platform() === 'darwin') {
      this.skip();
    }
    await clickOnContextMenuItem(connectionSection, 'Connect', 0);
    await waitUntilNotification(browser, 'Connected to Neo4j.');

    // Reconnect to the original instance
    await clickOnContextMenuItem(connectionSection, 'Connect', 1);
    await waitUntilNotification(browser, 'Connected to Neo4j.');
  });
});
