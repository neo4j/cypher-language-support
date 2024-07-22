/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { browser } from '@wdio/globals';
import { before } from 'mocha';
import { Workbench } from 'wdio-vscode-service';
import { createAndStartTestContainer } from '../../e2e_tests/setupTestContainer';
import { CONSTANTS } from '../../src/constants';

before(async () => {
  const container = await createAndStartTestContainer('../webview_tests');
  const port = container.getMappedPort(7687);

  await browser.executeWorkbench(async (vscode, port: number) => {
    const defaultConnectionKey = 'default-connection-key';

    function getNeo4jConfiguration() {
      return {
        scheme: process.env.NEO4J_SCHEME || 'neo4j',
        host: process.env.NEO4J_HOST || 'localhost',
        port: process.env.NEO4J_PORT || port,
        user: process.env.NEO4J_USER || 'neo4j',
        database: process.env.NEO4J_DATABASE || 'neo4j',
        password: process.env.NEO4J_PASSWORD || 'password',
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function saveDefaultConnection(vscode: any): Promise<void> {
      const { scheme, host, port, user, database, password } =
        getNeo4jConfiguration();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await vscode.commands.executeCommand(
        'neo4j.saveConnection',
        {
          key: defaultConnectionKey,
          scheme: scheme,
          host: host,
          port: port,
          user: user,
          database: database,
          state: 'active',
        },
        password,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await saveDefaultConnection(vscode);
  }, port);
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
  });

  it('should error on invalid cypher', async () => {
    await openFixtureFile(browser, 'invalid.cypher');

    await runCommand(browser, CONSTANTS.COMMANDS.RUN_CYPHER_FILE);
    const webviews = await workbench.getAllWebviews();
    await expect(webviews.length).toBe(2);

    const resultsWebview = (await workbench.getAllWebviews()).at(1);
    await resultsWebview.open();

    const text = await (await $('#query-error')).getText();
    await expect(text).toContain(
      'Error executing query WITH (n:Person) RETURN n',
    );
    await expect(text).toContain('Variable `n` not defined');
    await resultsWebview.close();
  });
});
