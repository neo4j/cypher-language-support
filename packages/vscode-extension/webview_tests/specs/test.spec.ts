/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { browser } from '@wdio/globals';
import { before } from 'mocha';
import * as os from 'os';
import { TreeItem, ViewSection, Workbench } from 'wdio-vscode-service';
import { createAndStartTestContainer } from '../../e2e_tests/setupTestContainer';
import { CONSTANTS } from '../../src/constants';

let port: number;

async function waitUntilNotification(
  browser: WebdriverIO.Browser,
  notification: string,
) {
  await browser.waitUntil(
    async function () {
      const wb = await browser.getWorkbench();
      const notifications = await wb.getNotifications();
      const messages = await Promise.all(
        notifications.map(async (n) => await n.getMessage()),
      );

      return messages.includes(notification);
    },
    { timeout: 10000 },
  );
}

before(async () => {
  const container = await createAndStartTestContainer('../webview_tests');
  port = container.getMappedPort(7687);

  const workbench = await browser.getWorkbench();
  const activityBar = workbench.getActivityBar();
  const neo4jTile = await activityBar.getViewControl('Neo4j');
  const connectionPannel = await neo4jTile.openView();
  const content = connectionPannel.getContent();
  const sections = await content.getSections();
  const section = sections.at(0);
  if (section) {
    const newConnectionButton = await section.button$;
    await newConnectionButton.click();
  }

  const connectionWebview = (await workbench.getAllWebviews()).at(0);

  if (connectionWebview) {
    await connectionWebview.open();

    const schemeInput = await $('#scheme');
    const hostInput = await $('#host');
    const portInput = await $('#port');
    const userInput = await $('#user');
    const passwordInput = await $('#password');
    await schemeInput.selectByVisibleText('neo4j://');
    await hostInput.setValue('localhost');
    await portInput.setValue(port);
    await userInput.setValue('neo4j');
    await passwordInput.setValue('password');

    const saveConnectionButton = await $('#save-connection');
    await saveConnectionButton.click();

    await connectionWebview.close();
  }

  await waitUntilNotification(browser, 'Connected to Neo4j.');
  await neo4jTile.closeView();
});

async function openFixtureFile(browser: WebdriverIO.Browser, fileName: string) {
  await browser.executeWorkbench(
    async (vscode, __dirname, fileName) => {
      const textDocumentUri = `${__dirname}/../fixtures/${fileName}`;
      const document = await vscode.workspace.openTextDocument(textDocumentUri);
      await vscode.window.showTextDocument(document);
    },
    __dirname,
    fileName,
  );
}

async function runCommand(browser: WebdriverIO.Browser, command: string) {
  await browser.executeWorkbench(async (vscode, command) => {
    await vscode.commands.executeCommand(command);
  }, command);
}

describe('Connections testing', () => {
  let workbench: Workbench;
  let connectionSection: ViewSection;

  before(async () => {
    workbench = await browser.getWorkbench();
    const activityBar = workbench.getActivityBar();
    const neo4jTile = await activityBar.getViewControl('Neo4j');
    const connectionPannel = await neo4jTile.openView();
    const content = connectionPannel.getContent();
    const sections = await content.getSections();
    connectionSection = sections.at(0);
  });

  it('should disconnect from neo4j gracefully', async function () {
    if (os.platform() === 'darwin') {
      this.skip();
    } else {
      const items = await connectionSection.getVisibleItems();
      await expect(items.length).toBeGreaterThan(0);
      const connectionItem = items.at(0) as TreeItem;

      const contextMenu = await connectionItem.openContextMenu();
      const menuItems = await contextMenu.getItems();
      const disconnect = menuItems.find(async (menuItem) => {
        const menuText = await menuItem.elem.getText();
        return menuText === 'Disconnect';
      });

      if (disconnect) {
        const disconnectOption = await disconnect.elem;
        await disconnectOption.click();
      }
    }
    await waitUntilNotification(browser, 'Disconnected from Neo4j.');
  });

  it('should connect to neo4j gracefully', async function () {
    if (os.platform() === 'darwin') {
      this.skip();
    } else {
      const items = await connectionSection.getVisibleItems();
      await expect(items.length).toBeGreaterThan(0);
      const connectionItem = items.at(0) as TreeItem;

      const contextMenu = await connectionItem.openContextMenu();
      const menuItems = await contextMenu.getItems();
      const connect = menuItems.find(async (menuItem) => {
        const menuText = await menuItem.elem.getText();
        return menuText === 'Connect';
      });

      if (connect) {
        const connectOption = await connect.elem;
        await connectOption.click();
      }
    }
    await waitUntilNotification(browser, 'Connected to Neo4j.');
  });
});

describe('Query results testing', () => {
  let workbench: Workbench;
  before(async () => {
    workbench = await browser.getWorkbench();
  });

  it('should correctly execute a valid Cypher', async () => {
    await openFixtureFile(browser, 'valid.cypher');

    await runCommand(browser, CONSTANTS.COMMANDS.RUN_CYPHER_FILE);
    const webviews = await workbench.getAllWebviews();
    await expect(webviews.length).toBe(1);

    const resultsWebview = (await workbench.getAllWebviews()).at(0);
    await resultsWebview.open();
    const querySummary = await (await $('#query-summary')).getText();
    await expect(querySummary).toContain('1 nodes created, 1 labels added.');

    await resultsWebview.close();
    await workbench.getEditorView().closeAllEditors();
  });

  it('should error on invalid cypher', async () => {
    await openFixtureFile(browser, 'invalid.cypher');

    await runCommand(browser, CONSTANTS.COMMANDS.RUN_CYPHER_FILE);
    const webviews = await workbench.getAllWebviews();
    await expect(webviews.length).toBe(1);

    const resultsWebview = (await workbench.getAllWebviews()).at(0);
    await resultsWebview.open();

    const text = await (await $('#query-error')).getText();
    await expect(text).toContain(
      'Error executing query WITH (n:Person) RETURN n',
    );
    await expect(text).toContain('Variable `n` not defined');

    await resultsWebview.close();
    await workbench.getEditorView().closeAllEditors();
  });
});
