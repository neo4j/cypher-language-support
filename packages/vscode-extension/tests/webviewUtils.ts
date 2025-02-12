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
        return false;
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

export async function createNewConnection(containerName: string) {
  const container = await createAndStartTestContainer({
    writeEnvFile: false,
    containerName: containerName,
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
