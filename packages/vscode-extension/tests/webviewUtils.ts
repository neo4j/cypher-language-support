import { integer } from 'vscode-languageclient';
import { TreeItem, ViewSection, WebView, Workbench } from 'wdio-vscode-service';
import { createAndStartTestContainer } from './setupTestContainer';

export async function waitUntilNotification(
  browser: WebdriverIO.Browser,
  notification: string,
) {
  await browser.waitUntil(
    async function () {
      const wb = await browser.getWorkbench();
      const notifications = await wb.getNotifications();

      const notificationsAndMsgs = await Promise.all(
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
      } else {
        throw new Error(
          `Notification ${notification} not found. Found: \n${notificationsAndMsgs
            .map((n) => n.msg)
            .join('\n')}`,
        );
      }
    },
    { timeout: 20000 },
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

/**
 * Identifying elements for each of our webviews. We look these selectors up
 * inside a webview's DOM instead of relying on the (unstable) ordering of
 * workbench.getAllWebviews() — that order shifts whenever another webview
 * (e.g. the welcome page) is open.
 */
export const WEBVIEW_SELECTORS = {
  connection: '#save-connection',
  querySummary: '#queryDetails',
  queryResults: '#queryVisualization',
} as const;

/**
 * Finds the webview whose content contains `selector`. Opening a webview
 * switches the WebDriver context into its iframe, so we probe each one in turn
 * and always switch back out before moving on. Retries until a match appears,
 * since a webview's content may not be rendered the instant it's created.
 */
export async function findWebview(
  workbench: Workbench,
  selector: string,
): Promise<WebView> {
  let match: WebView | undefined;

  await browser.waitUntil(
    async () => {
      const webviews = await workbench.getAllWebviews();
      for (const webview of webviews) {
        try {
          await webview.open();
          const found = await $(selector).isExisting();
          await webview.close();
          if (found) {
            match = webview;
            return true;
          }
        } catch {
          // The webview wasn't ready to be opened (e.g. a hidden editor tab);
          // make sure we're back in the main context before trying the next.
          await webview.close();
        }
      }
      return false;
    },
    {
      timeout: 15000,
      timeoutMsg: `No webview found containing "${selector}"`,
    },
  );
  // waitUntil throws on timeout, so match is guaranteed to be set here.
  return match as WebView;
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
  const connectionPanel = await neo4jTile.openView();
  const content = connectionPanel.getContent();
  const sections = await content.getSections();

  try {
    const section = sections.at(0);
    const newConnectionButton = await section.button$;
    await newConnectionButton.click();
  } catch {
    await browser.executeWorkbench(async (vscode) => {
      await vscode.commands.executeCommand('neo4j.createConnection');
    });
  }
  const connectionWebview = await findWebview(
    workbench,
    WEBVIEW_SELECTORS.connection,
  );

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

export async function checkSummary(
  workbench: Workbench,
  check: () => Promise<void>,
) {
  await browser.pause(1000);
  await browser.executeWorkbench(async (vscode) => {
    await vscode.commands.executeCommand('neo4jQueryDetails.focus');
  });
  const selector = WEBVIEW_SELECTORS.querySummary;
  const resultsWebview = await findWebview(workbench, selector);
  await resultsWebview.open();
  await check();
  await resultsWebview.close();
  await workbench.getEditorView().closeAllEditors();
}

export async function checkResult(
  workbench: Workbench,
  check: () => Promise<void>,
) {
  await browser.pause(1000);
  await browser.executeWorkbench(async (vscode) => {
    await vscode.commands.executeCommand('neo4jQueryVisualization.focus');
  });
  const selector = WEBVIEW_SELECTORS.queryResults;
  const resultsWebview = await findWebview(workbench, selector);
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
  await workbench.executeCommand('Neo4j: Run Cypher statements');
}

export async function ensureNotificationsAreDismissed(
  browser: WebdriverIO.Browser,
): Promise<void> {
  const wb = await browser.getWorkbench();
  return await browser.waitUntil(async () => {
    const notifications = await wb.getNotifications();
    for (const notification of notifications) {
      await notification.dismiss();
    }

    const remainingNotifications = await wb.getNotifications();
    if (remainingNotifications.length > 0) {
      await ensureNotificationsAreDismissed(browser);
    }
    return true;
  });
}
