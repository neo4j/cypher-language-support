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

//** Checks that the query result for each statement containts the expected summaries in query details.
// If we pass an expected summary that is undefined we expect an empty result from query execution */
export async function expectSummaries(
  expectedSummaries: (string | undefined)[],
) {
  const queryDetails = await $$('#queryDetails .collapsible');
  await expect(queryDetails.length).toBe(expectedSummaries.length);

  for (let i = 0; i < expectedSummaries.length; i++) {
    const queryDetail = (await $$('#queryDetails .collapsible'))[i];
    //This matches the expand/collapse button, but we only want to click when collapsed
    const expandButton = await queryDetail.$('button[aria-label*="statement"]');
    const isCollapsed =
      (await expandButton.getAttribute('aria-expanded')) === 'false';
    if (isCollapsed) {
      await expandButton.click();
    }
    const queryResult = await queryDetail.$('.collapsible-content');
    await queryResult.waitForDisplayed();
    const summary = await queryResult.getText();
    if (expectedSummaries[i] !== undefined) {
      await expect(summary).toContain(expectedSummaries[i]);
    } else {
      await expect(summary).toBe('');
    }
  }
}

suite('Query results testing', () => {
  let workbench: Workbench;
  let connectionSection: ViewSection;

  before(async () => {
    workbench = await browser.getWorkbench();
    connectionSection = await getConnectionSection(workbench);
  });

  test('should correctly execute valid Cypher', async function () {
    await executeFile(workbench, 'valid.cypher');
    await checkResultsContent(workbench, async () => {
      await expectSummaries(['1 nodes created, 1 labels added.']);
    });
  });

  test('should correctly execute valid Cypher when highlighting several statements', async function () {
    await executeFile(workbench, 'multiline.cypher');
    await checkResultsContent(workbench, async () => {
      await expectSummaries([
        '1 nodes created, 1 labels added.',
        '2 nodes created, 2 labels added.',
        '',
      ]);
    });
  });

  test('should error on invalid cypher', async function () {
    await executeFile(workbench, 'invalid.cypher');
    await checkResultsContent(workbench, async () => {
      await expectSummaries(['Variable `n` not defined']);
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
      await expectSummaries(['1 nodes created, 1 labels added.']);
    });
    await executeFile(workbench, 'match-for-create.cypher');
    await checkResultsContent(workbench, async () => {
      await expectSummaries(['Started streaming 1 record']);
    });

    // Disconnect from the current instance
    // Connect to an empty one, the results should be empty
    await clickOnContextMenuItem(connectionSection, 'Connect', 0);
    await waitUntilNotification(browser, 'Connected to Neo4j.');

    await executeFile(workbench, 'match-for-create.cypher');
    await checkResultsContent(workbench, async () => {
      await expectSummaries([undefined]);
    });
    await clickOnContextMenuItem(connectionSection, 'Disconnect', 0);

    // Reconnect to the original instance
    await clickOnContextMenuItem(connectionSection, 'Connect', 1);
    await waitUntilNotification(browser, 'Connected to Neo4j.');
  });
});
