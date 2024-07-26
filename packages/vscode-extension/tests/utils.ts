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

export async function openFixtureFile(
  browser: WebdriverIO.Browser,
  fileName: string,
) {
  await browser.executeWorkbench(
    async (vscode, __dirname, fileName) => {
      const textDocumentUri = `${__dirname}/fixtures/${fileName}`;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const document = await vscode.workspace.openTextDocument(textDocumentUri);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await vscode.window.showTextDocument(document);
    },
    __dirname,
    fileName,
  );
}
