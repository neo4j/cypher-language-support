import { browser } from '@wdio/globals';
import { before } from 'mocha';
import { Workbench } from 'wdio-vscode-service';
import { Key } from 'webdriverio';
import {
  checkResultsContent,
  clickOnContextMenuItem,
  ensureNotificationsAreDismissed,
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

/** Checks that the visualization view contains a table with all the expected items in it's body */
export async function expectTableContent(expectedItems: string[]) {
  const tableItems = await $$('.vizWrapper-table-cell.n-code');
  await expect(tableItems.length).toBe(expectedItems.length);
  for (let i = 0; i < expectedItems.length; i++) {
    const tableItem = await tableItems[i].getText();
    await expect(tableItem).toContain(expectedItems[i]);
  }
}

suite('Params panel testing', () => {
  let workbench: Workbench;

  before(async () => {
    workbench = await browser.getWorkbench();
  });

  async function escapeModal(count: number) {
    for (let i = 0; i < count; i++) {
      await browser.pause(500);
      await browser.keys([Key.Escape]);
      await waitUntilNotification(browser, 'Parameter value cannot be empty.');
    }
  }

  async function addParamWithInputBox() {
    await browser.executeWorkbench(async (vscode) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await vscode.commands.executeCommand('neo4j.addParameter');
    });
  }

  async function forceDeleteParam(key: string) {
    await browser.executeWorkbench(async (vscode, key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await vscode.commands.executeCommand(
        'neo4j.internal.forceDeleteParam',
        key,
      );
    }, key);
  }

  async function forceAddParam(key: string, value: string) {
    await browser.executeWorkbench(
      async (vscode, key: string, value: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await vscode.commands.executeCommand(
          'neo4j.internal.evalParam',
          key,
          value,
        );
      },
      key,
      value,
    );
  }

  async function forceModifyParam(key: string, value: string) {
    // Add param calls the evalParam command, which replaces existing parameter with the same key if it exists
    await forceAddParam(key, value);
  }

  async function clearParams() {
    await browser.executeWorkbench(async (vscode) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await vscode.commands.executeCommand('neo4j.clearParameters');
    });
  }

  async function forceDisconnect() {
    void browser.executeWorkbench((vscode) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      void vscode.commands.executeCommand('neo4j.internal.forceDisconnect');
    });
    await waitUntilNotification(browser, 'Disconnected from Neo4j.');
  }

  async function forceSwitchDatabase(database: string) {
    await browser.executeWorkbench(async (vscode, database: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await vscode.commands.executeCommand(
        'neo4j.internal.forceSwitchDatabase',
        database,
      );
    }, database);
    await waitUntilNotification(browser, `Switched to database '${database}'.`);
  }

  test('Should correctly set and clear cypher parameters', async function () {
    await forceAddParam('a', '"charmander"');
    await forceAddParam('b', '"caterpie"');
    await forceAddParam('some param', '"pikachu"');
    await forceAddParam('some-param', '"bulbasaur"');

    await executeFile(workbench, 'params.cypher');
    await executeFile(workbench, 'params.cypher');

    await checkResultsContent(workbench, false, async () => {
      await expectTableContent([
        'charmander',
        'caterpie',
        'pikachu',
        'bulbasaur',
        'charmandercaterpie',
      ]);
    });

    await clearParams();

    await executeFile(workbench, 'params.cypher');

    await escapeModal(4);

    await checkResultsContent(workbench, true, async () => {
      await expectSummaries([
        'Expected parameter(s): a, b, some param, some-param',
      ]);
    });
  });

  test('Cannot set parameters when disconnected from the database', async function () {
    await ensureNotificationsAreDismissed(browser);
    await forceDisconnect();
    // This tries to add the params with the window prompts we cannot manipulate in the tests
    // but it will fail before showing those prompts because we are not connected to the database
    void addParamWithInputBox();
    await waitUntilNotification(
      browser,
      'You need to be connected to neo4j to set parameters.',
    );

    await ensureNotificationsAreDismissed(browser);
    const connectionSection = await getConnectionSection(workbench);
    await clickOnContextMenuItem(connectionSection, 'Connect', 1);
    await waitUntilNotification(browser, 'Connected to Neo4j.');
  });

  test('Parameters cannot be set when connected to system', async function () {
    await forceSwitchDatabase('system');
    void addParamWithInputBox();
    await waitUntilNotification(
      browser,
      'Parameters cannot be added when on the system database. Please connect to a user database.',
    );
    await forceSwitchDatabase('neo4j');
  });

  test('Should correctly modify cypher parameters', async function () {
    await forceAddParam('a', '"charmander"');
    await forceAddParam('b', '"caterpie"');
    await forceAddParam('some param', '"pikachu"');
    await forceAddParam('some-param', '"bulbasaur"');

    await executeFile(workbench, 'params.cypher');
    await executeFile(workbench, 'params.cypher');
    await checkResultsContent(workbench, false, async () => {
      await expectTableContent([
        'charmander',
        'caterpie',
        'pikachu',
        'bulbasaur',
        'charmandercaterpie',
      ]);
    });

    await forceModifyParam('a', '"abra"');

    await executeFile(workbench, 'params.cypher');
    await checkResultsContent(workbench, false, async () => {
      await expectTableContent([
        'abra',
        'caterpie',
        'pikachu',
        'bulbasaur',
        'abracaterpie',
      ]);
    });
  });

  test('Should correctly delete parameters', async function () {
    await forceAddParam('a', '"charmander"');
    await forceAddParam('b', '"caterpie"');
    await forceAddParam('some param', '"pikachu"');
    await forceAddParam('some-param', '"bulbasaur"');

    await executeFile(workbench, 'params.cypher');
    await executeFile(workbench, 'params.cypher');

    await checkResultsContent(workbench, false, async () => {
      await expectTableContent([
        'charmander',
        'caterpie',
        'pikachu',
        'bulbasaur',
        'charmandercaterpie',
      ]);
    });

    await forceDeleteParam('a');
    await forceDeleteParam('b');

    //forceDeleteParam triggers vscode api to remove item from param tree, but refresh of tree can't be awaited
    await browser.pause(1000);

    await executeFile(workbench, 'params.cypher');

    await escapeModal(2);

    await checkResultsContent(workbench, true, async () => {
      await expectSummaries(['Expected parameter(s): a, b']);
    });
  });

  test('Should trigger parameter add pop-up when running a query with an unknown parameter', async () => {
    await clearParams();
    await forceAddParam('a', '1998');
    await executeFile(workbench, 'params.cypher');

    // initial pop-up for param b
    await browser.pause(1000);
    await browser.keys(['1', '2', Key.Enter]);

    // initial pop-up for param `some param`
    await browser.pause(1000);
    await browser.keys(['f', 'a', 'l', 's', 'e', Key.Enter]);

    // initial pop-up for param `some-param`
    await browser.pause(1000);
    await browser.keys(['5', Key.Enter]);

    await checkResultsContent(workbench, false, async () => {
      await expectTableContent(['1998', '12', 'false', '5', '2010']);
    });
  });
});
