import { browser } from '@wdio/globals';
import { before } from 'mocha';
import { Workbench } from 'wdio-vscode-service';
import { CONSTANTS } from '../../src/constants';
import { openFixtureFile } from '../utils';

describe('Query results testing', () => {
  let workbench: Workbench;
  before(async () => {
    workbench = await browser.getWorkbench();
  });

  it('should correctly execute a valid Cypher', async () => {
    await openFixtureFile(browser, 'valid.cypher');
    await workbench.executeCommand(CONSTANTS.COMMANDS.RUN_CYPHER_FILE);
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
    await workbench.executeCommand(CONSTANTS.COMMANDS.RUN_CYPHER_FILE);
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
