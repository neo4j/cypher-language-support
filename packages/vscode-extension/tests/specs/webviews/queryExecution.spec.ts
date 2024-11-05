import { browser } from '@wdio/globals';
import { before } from 'mocha';
import { Workbench } from 'wdio-vscode-service';
import { CONSTANTS } from '../../../src/constants';
import { openFixtureFile } from '../../webviewUtils';

suite('Query results testing', () => {
  let workbench: Workbench;
  before(async () => {
    workbench = await browser.getWorkbench();
  });

  test('should correctly execute a valid Cypher', async () => {
    await openFixtureFile(browser, 'valid.cypher');
    await workbench.executeCommand(CONSTANTS.COMMANDS.RUN_CYPHER);
    const webviews = await workbench.getAllWebviews();
    await expect(webviews.length).toBe(1);

    const resultsWebview = (await workbench.getAllWebviews()).at(0);
    await resultsWebview.open();
    const querySummary = await (await $('#query-summary')).getText();
    await expect(querySummary).toContain('1 nodes created, 1 labels added.');

    await resultsWebview.close();
    await workbench.getEditorView().closeAllEditors();
  });

  test('should correctly execute a valid Cypher when highlighting several statements', async () => {
    await openFixtureFile(browser, 'multiline.cypher', { selectLines: 2 });
    await workbench.executeCommand(CONSTANTS.COMMANDS.RUN_CYPHER);
    const webviews = await workbench.getAllWebviews();
    await expect(webviews.length).toBe(1);

    const resultsWebview = (await workbench.getAllWebviews()).at(0);
    await resultsWebview.open();

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

    await resultsWebview.close();
    await workbench.getEditorView().closeAllEditors();
  });

  test('should error on invalid cypher', async () => {
    await openFixtureFile(browser, 'invalid.cypher');
    await workbench.executeCommand(CONSTANTS.COMMANDS.RUN_CYPHER);
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
