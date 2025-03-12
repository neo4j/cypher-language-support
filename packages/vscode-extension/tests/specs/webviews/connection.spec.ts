import { browser } from '@wdio/globals';
import { before } from 'mocha';
import * as os from 'os';
import { ViewSection, Workbench } from 'wdio-vscode-service';
import { CONSTANTS } from '../../../src/constants';
import {
  clickOnContextMenuItem,
  closeActiveTab,
  getConnectionSection,
  openFixtureFile,
  setText,
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

  // test('should connect when selecting new connection', async function () {
  //   await selectConnectionItem(connectionSection, 1);
  //   await waitUntilNotification(browser, 'Connected to Neo4j.');
  // });

  // test('should expand connectionItems when selecting connected connection', async function () {
  //   await selectConnectionItem(connectionSection, 1);
  //   await waitUntilNotification(browser, 'Connected to Neo4j.');
  //   await expect((await connectionSection.getVisibleItems()).length).toBe(2);
  //   await selectConnectionItem(connectionSection, 1);
  //   await expect((await connectionSection.getVisibleItems()).length).toBe(4);
  // });

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

  test('should not lose connection form details when going into another tab', async function () {
    await workbench.executeCommand(CONSTANTS.COMMANDS.EDIT_CONNECTION_COMMAND);
    const connectionWebview = (await workbench.getAllWebviews()).at(0);
    await setText(connectionWebview, '#host', 'Badabadum');

    // Opens a new tab, then closes it
    await openFixtureFile(browser, 'valid.cypher');
    await closeActiveTab(browser);

    await connectionWebview.open();
    const hostInputAfter = await $('#host');
    const hostText = await hostInputAfter.getValue();

    await expect(hostText).toBe('Badabadum');
    await connectionWebview.close();
    await closeActiveTab(browser);
  });
});
