import { integer } from 'vscode-languageclient';
import {
  TreeItem,
  ViewSection,
  WebView,
  Workbench,
  Notification,
} from 'wdio-vscode-service';
import { createAndStartTestContainer } from './setupTestContainer';

export async function waitUntilNotification(
  browser: WebdriverIO.Browser,
  notification: string,
) {
  let notificationsAndMsgs: {
    msg: string;
    notification: Notification;
  }[];
  await browser.waitUntil(
    async function () {
      const wb = await browser.getWorkbench();
      const notifications = await wb.getNotifications();

      notificationsAndMsgs = await Promise.all(
        notifications.map(async (n) => {
          const msg = await n.getMessage();
          return { msg, notification: n };
        }),
      );

      const found = notificationsAndMsgs.find(
        (value) => value.msg === notification,
      );
      if (found) {
        await found.notification.dismiss();
        return true;
      }
    },
    {
      timeout: 20000,
      timeoutMsg: `Notification '${notification}' not found.`,
    },
  );
}

type OpenFileOptions = {
  selectLines?: number;
};

export async function openFixtureFile(
  browser: WebdriverIO.Browser,
  fileName: string,
  options: OpenFileOptions = {},
) {
  await browser.executeWorkbench(
    async (vscode, __dirname, fileName, options: OpenFileOptions) => {
      const textDocumentUri = `${__dirname}/../../tests/fixtures/${fileName}`;
      // eslint-disable-next-line
      const document = await vscode.workspace.openTextDocument(textDocumentUri);
      // eslint-disable-next-line
      const editor = await vscode.window.showTextDocument(document);

      if (options.selectLines && options.selectLines > 0) {
        const lastLine = options.selectLines - 1;
        // eslint-disable-next-line
        editor.selection = new vscode.Selection(
          // eslint-disable-next-line
          new vscode.Position(0, 0), // Start at the beginning of the first line
          // eslint-disable-next-line
          new vscode.Position(lastLine, document.lineAt(lastLine).text.length),
        );
      }
    },
    __dirname,
    fileName,
    options,
  );
}

export async function createNewConnection(containerName: string) {
  const container = await createAndStartTestContainer({
    containerName: containerName,
    neo4jVersion: 'neo4j:2025.05.1-enterprise',
  });
  const port = container.getMappedPort(7687);
  const workbench = await browser.getWorkbench();
  const activityBar = workbench.getActivityBar();
  const neo4jTile = await activityBar.getViewControl('Neo4j');
  const connectionPannel = await neo4jTile.openView();
  const content = connectionPannel.getContent();
  const sections = await content.getSections();

  try {
    const section = sections.at(0);
    const newConnectionButton = await section.button$;
    await newConnectionButton.click();
  } catch {
    await workbench.executeCommand('neo4j.createConnection');
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
}

export async function getConnectionSection(
  workbench: Workbench,
): Promise<ViewSection | undefined> {
  const activityBar = workbench.getActivityBar();
  const neo4jTile = await activityBar.getViewControl('Neo4j');
  const connectionPannel = await neo4jTile.openView();
  const content = connectionPannel.getContent();
  const sections = await content.getSections();
  const connectionSection = sections.at(0);
  return connectionSection;
}

export async function selectConnectionItem(
  connectionSection: ViewSection,
  connectionIndex: integer,
): Promise<void> {
  const items = await connectionSection.getVisibleItems();
  await expect(items.length).toBeGreaterThan(connectionIndex);
  const connectionItem = items.at(connectionIndex) as TreeItem;
  await connectionItem.select();
}

export async function clickOnContextMenuItem(
  connectionSection: ViewSection,
  item: string,
  connectionIndex: number,
): Promise<void> {
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

export async function selectValue(
  webview: WebView,
  elem: string,
  value: string,
) {
  await webview.open();
  const element = await $(elem);
  await element.selectByVisibleText(value);
  await webview.close();
}

export async function setText(webview: WebView, elem: string, value: string) {
  await webview.open();
  await (await $(elem)).clearValue();
  await webview.close();
  await webview.open();
  await (await $(elem)).addValue(value);
  await webview.close();
}

export async function closeActiveTab(browser: WebdriverIO.Browser) {
  await browser.executeWorkbench(async (vscode) => {
    // eslint-disable-next-line
    await vscode.window.tabGroups.close(
      // eslint-disable-next-line
      vscode.window.tabGroups.activeTabGroup.activeTab,
    );
  });
}

export async function checkResultsContent(
  workbench: Workbench,
  check: () => Promise<void>,
) {
  const webviews = await workbench.getAllWebviews();
  await expect(webviews.length).toBe(1);
  const resultsWebview = (await workbench.getAllWebviews()).at(0);
  await resultsWebview.open();
  await check();
  await resultsWebview.close();
  await workbench.getEditorView().closeAllEditors();
}

export async function executeFile(
  workbench: Workbench,
  fileName: string,
  opts?: { selectLines?: number },
) {
  await openFixtureFile(browser, fileName, opts);
  await workbench.executeCommand('neo4j.runCypher');
}

export async function ensureNotificationsAreDismissed(
  browser: WebdriverIO.Browser,
): Promise<void> {
  const wb = await browser.getWorkbench();
  const notifications = await wb.getNotifications();
  for (const notification of notifications) {
    await notification.dismiss();
  }

  const remainingNotifications = await wb.getNotifications();
  if (remainingNotifications.length > 0) {
    return ensureNotificationsAreDismissed(browser);
  }
}
