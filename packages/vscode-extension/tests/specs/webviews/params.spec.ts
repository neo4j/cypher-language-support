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

  async function addParam() {
    await browser.executeWorkbench((vscode) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      void vscode.commands.executeCommand('neo4j.addParameter');
    });
  }

  async function forceSetParam(key: string, value: string) {
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

  async function clearParams() {
    await browser.executeWorkbench((vscode) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      void vscode.commands.executeCommand('neo4j.clearParameters');
    });
  }

  async function forceDisconnect() {
    await browser.executeWorkbench((vscode) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      void vscode.commands.executeCommand('neo4j.internal.forceDisconnect');
    });
  }

  async function forceConnect(i: number) {
    await browser.executeWorkbench((vscode, i) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      void vscode.commands.executeCommand('neo4j.internal.forceConnect', i);
    }, i);
  }

  test('Should correctly set and clear cypher parameters', async function () {
    await forceSetParam('a', '"charmander"');
    await forceSetParam('b', '"caterpie"');
    await forceSetParam('some param', '"pikachu"');
    await forceSetParam('some-param', '"bulbasur"');

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

  test('Cannot set parameters when disconnected from the database', async function () {
    await forceDisconnect();
    // This tries to add the params with the window prompts we cannot manipulate in the tests
    // but it will fail before showing those prompts because we are not connected to the database
    await addParam();
    await waitUntilNotification(
      browser,
      'You need to be connected to neo4j to set parameters.',
    );
    await forceConnect(1);
  });
});
