export async function waitUntilNotification(
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
          new vscode.Position(lastLine, document.lineAt(lastLine).text.length), // End of the first line
        );
      }
    },
    __dirname,
    fileName,
    options,
  );
}
