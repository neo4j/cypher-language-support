import { browser } from '@wdio/globals';
import { before } from 'mocha';
import * as os from 'os';
import { ViewSection, Workbench } from 'wdio-vscode-service';
import {
  checkResultsContent,
  clickOnContextMenuItem,
  executeFile,
  getConnectionSection,
  waitUntilNotification,
} from '../../webviewUtils';

suite.skip('Query results testing', () => {
  let workbench: Workbench;
  let connectionSection: ViewSection;

  before(async () => {
    workbench = await browser.getWorkbench();
    connectionSection = await getConnectionSection(workbench);
  });

  test('should correctly execute a valid Cypher', async function () {
    await executeFile(workbench, 'valid.cypher');
    await checkResultsContent(workbench, async () => {
      const querySummary = await (await $('#query-summary')).getText();
      await expect(querySummary).toContain('1 nodes created, 1 labels added.');
    });
  });

  test('should correctly execute a valid Cypher when highlighting several statements', async function () {
    await executeFile(workbench, 'multiline.cypher');
    await checkResultsContent(workbench, async () => {
      // Take the first line query result summary
      const firstCreateSummary = await (await $('#query-summary')).getText();
      // Select the second tab to get the query result for the second line
      await (
        await $(
          '#resultDiv > div > div.ndl-tabs.ndl-large.ndl-underline-tab.label > button:nth-child(2)',
        )
      ).click();
      const secondCreateSummary = await (await $('#query-summary')).getText();

      await expect(firstCreateSummary).toContain(
        '1 nodes created, 1 labels added.',
      );
      await expect(secondCreateSummary).toContain(
        '2 nodes created, 2 labels added.',
      );
    });
  });

  test('should error on invalid cypher', async function () {
    await executeFile(workbench, 'invalid.cypher');
    await checkResultsContent(workbench, async () => {
      const text = await (await $('#query-error')).getText();
      await expect(text).toContain(
        'Error executing query WITH (n:Person) RETURN n',
      );
      await expect(text).toContain('Variable `n` not defined');
    });
  });

  test('results should depend on the instance we are connected to', async function () {
    if (os.platform() === 'darwin') {
      this.skip();
    }
    await clickOnContextMenuItem(connectionSection, 'Disconnect', 0);

    await clickOnContextMenuItem(connectionSection, 'Connect', 1);

    await executeFile(workbench, 'create-for-match.cypher');
    await checkResultsContent(workbench, async () => {
      const querySummary = await (await $('#query-summary')).getText();
      await expect(querySummary).toContain('1 nodes created, 1 labels added.');
    });
    await executeFile(workbench, 'match-for-create.cypher');
    await checkResultsContent(workbench, async () => {
      const querySummary = await (await $('#query-summary')).getText();
      await expect(querySummary).toContain('Started streaming 1 record');
    });

    // Disconnect from the current instance
    // Connect to an empty one, the results should be empty
    await clickOnContextMenuItem(connectionSection, 'Connect', 0);
    await waitUntilNotification(browser, 'Connected to Neo4j.');

    await executeFile(workbench, 'match-for-create.cypher');
    await checkResultsContent(workbench, async () => {
      const queryResult = await (await $('#query-empty-result')).getText();
      await expect(queryResult).toContain('No records returned');
    });
    await clickOnContextMenuItem(connectionSection, 'Disconnect', 0);

    // Reconnect to the original instance
    await clickOnContextMenuItem(connectionSection, 'Connect', 1);
    await waitUntilNotification(browser, 'Connected to Neo4j.');
  });
});
