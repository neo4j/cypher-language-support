import { browser } from '@wdio/globals';
import { before } from 'mocha';
import * as os from 'os';
import {
  TreeItem,
  ViewControl,
  ViewSection,
  Workbench,
} from 'wdio-vscode-service';
import { waitUntilNotification } from '../../webviewUtils';

suite('Connection testing', () => {
  let workbench: Workbench;
  let connectionSection: ViewSection;
  let neo4jTile: ViewControl;

  before(async () => {
    workbench = await browser.getWorkbench();
    const activityBar = workbench.getActivityBar();
    const maybeNeo4jTile = await activityBar.getViewControl('Neo4j');
    if (maybeNeo4jTile) {
      neo4jTile = maybeNeo4jTile;
      const connectionPannel = await neo4jTile.openView();
      const content = connectionPannel.getContent();
      const sections = await content.getSections();
      connectionSection = sections.at(0);
    }
  });

  async function clickOnContextMenuItem(item: string, connectionIndex: number) {
    const items = await connectionSection.getVisibleItems();
    await expect(items.length).toBeGreaterThan(connectionIndex);
    const connectionItem = items.at(connectionIndex) as TreeItem;

    // This context menu does not work in OSX because it's a native element rather
    // than a browser, so we get errors of the sort of
    //    element (".monaco-menu-container") still not displayed after 5000ms
    //
    // https://github.com/webdriverio-community/wdio-vscode-service/issues/57
    const contextMenu = await connectionItem.openContextMenu();
    const menuItems = await contextMenu.getItems();
    const connect = menuItems.find(async (menuItem) => {
      const menuText = await menuItem.elem.getText();
      return menuText === item;
    });

    if (connect) {
      const connectOption = await connect.elem;
      await connectOption.click();
    }
  }

  test('should disconnect from neo4j gracefully', async function () {
    if (os.platform() === 'darwin') {
      this.skip();
    }
    await clickOnContextMenuItem('Disconnect', 1);
    await waitUntilNotification(browser, 'Disconnected from Neo4j.');
  });

  test('should connect to neo4j gracefully', async function () {
    if (os.platform() === 'darwin') {
      this.skip();
    }
    await clickOnContextMenuItem('Connect', 1);
    await waitUntilNotification(browser, 'Connected to Neo4j.');
  });

  test('should be able to connect to another instance', async function () {
    if (os.platform() === 'darwin') {
      this.skip();
    }
    await clickOnContextMenuItem('Connect', 0);
    await waitUntilNotification(browser, 'Connected to Neo4j.');
  });
});
