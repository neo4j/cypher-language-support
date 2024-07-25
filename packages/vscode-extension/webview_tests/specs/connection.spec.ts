import { browser } from '@wdio/globals';
import { before } from 'mocha';
import * as os from 'os';
import {
  TreeItem,
  ViewControl,
  ViewSection,
  Workbench,
} from 'wdio-vscode-service';
import { waitUntilNotification } from '../utils';

describe('Connection testing', () => {
  let workbench: Workbench;
  let connectionSection: ViewSection;
  let neo4jTile: ViewControl;

  before(async () => {
    workbench = await browser.getWorkbench();
    const activityBar = workbench.getActivityBar();
    neo4jTile = await activityBar.getViewControl('Neo4j');
    const connectionPannel = await neo4jTile.openView();
    const content = connectionPannel.getContent();
    const sections = await content.getSections();
    connectionSection = sections.at(0);
  });

  after(async () => {
    await neo4jTile.closeView();
  });

  async function clickOnContextMenuItem(item: string) {
    const items = await connectionSection.getVisibleItems();
    await expect(items.length).toBeGreaterThan(0);
    const connectionItem = items.at(0) as TreeItem;

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

  it('should disconnect from neo4j gracefully', async function () {
    if (os.platform() === 'darwin') {
      this.skip();
    }
    await clickOnContextMenuItem('Disconnect');
    await waitUntilNotification(browser, 'Disconnected from Neo4j.');
  });

  it('should connect to neo4j gracefully', async function () {
    if (os.platform() === 'darwin') {
      this.skip();
    }
    await clickOnContextMenuItem('Connect');
    await waitUntilNotification(browser, 'Connected to Neo4j.');
  });
});
