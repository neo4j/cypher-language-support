import { browser } from '@wdio/globals';
import { before } from 'mocha';
import { Workbench } from 'wdio-vscode-service';
import {
  checkResultsContent,
  executeFile,
  waitUntilNotification,
} from '../../webviewUtils';

suite('Params panel testing', () => {
  let workbench: Workbench;

  before(async () => {
    workbench = await browser.getWorkbench();
  });

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
    await browser.executeWorkbench(async (vscode) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await vscode.commands.executeCommand('neo4j.internal.forceDisconnect');
    });
  }

  async function forceSwitchDatabase(database: string) {
    await browser.executeWorkbench(async (vscode, database: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await vscode.commands.executeCommand(
        'neo4j.internal.forceSwitchDatabase',
        database,
      );
    }, database);
  }

  async function forceConnect(i: number) {
    await browser.executeWorkbench(async (vscode, i) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await vscode.commands.executeCommand('neo4j.internal.forceConnect', i);
    }, i);
  }

  test('Should correctly set and clear cypher parameters', async function () {
    await forceAddParam('a', '"charmander"');
    await forceAddParam('b', '"caterpie"');
    await forceAddParam('some param', '"pikachu"');
    await forceAddParam('some-param', '"bulbasur"');

    await executeFile(workbench, 'params.cypher');
    await checkResultsContent(workbench, async () => {
      const queryResult = await (await $('#query-result')).getText();
      await expect(queryResult).toContain('charmander');
      await expect(queryResult).toContain('caterpie');
      await expect(queryResult).toContain('pikachu');
      await expect(queryResult).toContain('bulbasur');
    });

    await clearParams();

    await executeFile(workbench, 'params.cypher');
    await checkResultsContent(workbench, async () => {
      const text = await (await $('#query-error')).getText();
      await expect(text).toContain(
        'Error executing query RETURN $a, $b, $`some param`, $`some-param`:\nExpected parameter(s): a, b, some param, some-param',
      );
    });
  });

  test('Should correctly modify cypher parameters', async function () {
    await forceAddParam('a', '"charmander"');
    await forceAddParam('b', '"caterpie"');
    await forceAddParam('some param', '"pikachu"');
    await forceAddParam('some-param', '"bulbasur"');

    await executeFile(workbench, 'params.cypher');
    await checkResultsContent(workbench, async () => {
      const queryResult = await (await $('#query-result')).getText();
      await expect(queryResult).toContain('charmander');
      await expect(queryResult).toContain('caterpie');
      await expect(queryResult).toContain('pikachu');
      await expect(queryResult).toContain('bulbasur');
    });

    await forceModifyParam('a', '"abra"');

    await executeFile(workbench, 'params.cypher');
    await checkResultsContent(workbench, async () => {
      const queryResult = await (await $('#query-result')).getText();
      await expect(queryResult).toContain('abra');
      await expect(queryResult).toContain('caterpie');
      await expect(queryResult).toContain('pikachu');
      await expect(queryResult).toContain('bulbasur');
      await expect(queryResult).not.toContain('charmander');
    });
  });

  test('Should correctly delete parameters', async function () {
    await forceAddParam('a', '"charmander"');
    await forceAddParam('b', '"caterpie"');
    await forceAddParam('some param', '"pikachu"');
    await forceAddParam('some-param', '"bulbasur"');

    await executeFile(workbench, 'params.cypher');
    await checkResultsContent(workbench, async () => {
      const queryResult = await (await $('#query-result')).getText();
      await expect(queryResult).toContain('charmander');
      await expect(queryResult).toContain('caterpie');
      await expect(queryResult).toContain('pikachu');
      await expect(queryResult).toContain('bulbasur');
    });

    await forceDeleteParam('a');
    await forceDeleteParam('b');

    await executeFile(workbench, 'params.cypher');
    await checkResultsContent(workbench, async () => {
      const text = await (await $('#query-error')).getText();
      await expect(text).toContain(
        'Error executing query RETURN $a, $b, $`some param`, $`some-param`:\nExpected parameter(s): a, b',
      );
    });
  });

  test('Cannot set parameters when disconnected from the database', async function () {
    await forceDisconnect();
    // This tries to add the params with the window prompts we cannot manipulate in the tests
    // but it will fail before showing those prompts because we are not connected to the database
    void addParamWithInputBox();
    await waitUntilNotification(
      browser,
      'You need to be connected to neo4j to set parameters.',
    );
    await forceConnect(1);
  });

  test('Parameters cannot be set when connected to system', async function () {
    await forceSwitchDatabase('system');
    await clearParams();

    void forceAddParam('a', '"charmander"');
    void forceAddParam('b', '"caterpie"');
    void forceAddParam('some param', '"pikachu"');
    void forceAddParam('some-param', '"bulbasur"');

    // to execute the file we need to be on the user database
    await forceSwitchDatabase('neo4j');
    await executeFile(workbench, 'params.cypher');
    await checkResultsContent(workbench, async () => {
      const text = await (await $('#query-error')).getText();
      await expect(text).toContain(
        'Error executing query RETURN $a, $b, $`some param`, $`some-param`:\nExpected parameter(s): a, b, some param, some-param',
      );
    });
  });
});
