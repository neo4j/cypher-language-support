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

  async function evalParam(param: string) {
    await browser.executeWorkbench((vscode, param: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      void vscode.commands.executeCommand('neo4j.internal.evalParam', param);
    }, param);
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
    await evalParam('a => "charmander"');
    await evalParam('b => "caterpie"');

    await executeFile(workbench, 'params.cypher');
    await checkResultsContent(workbench, async () => {
      const queryResult = await (await $('#query-result')).getText();
      await expect(queryResult).toContain('charmander');
      await expect(queryResult).toContain('caterpie');
    });

    await clearParams();

    await executeFile(workbench, 'params.cypher');
    await checkResultsContent(workbench, async () => {
      const text = await (await $('#query-error')).getText();
      await expect(text).toContain(
        'Error executing query RETURN $a, $b:\nExpected parameter(s): a, b',
      );
    });
  });

  test('Cannot set parameters when disconnected from the database', async function () {
    await forceDisconnect();
    await evalParam('c => "charmander"');
    await waitUntilNotification(
      browser,
      'You need to be connected to neo4j to set parameters.',
    );
    await forceConnect(1);
  });
});
