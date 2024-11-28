import { testData } from '@neo4j-cypher/language-support';
import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';
import { CypherEditorPage } from './e2eUtils';

test.use({ viewport: { width: 1000, height: 500 } });
declare global {
  interface Window {
    longtasks: number[];
  }
}

test('benchmarking & performance test session', async ({
  browserName,
  mount,
  page,
}) => {
  test.skip(browserName !== 'chromium');
  const client = await page.context().newCDPSession(page);
  if (process.env.BENCHMARKING === 'true') {
    test.setTimeout(1000000);
    await client.send('Performance.enable');
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await client.send('Overlay.setShowFPSCounter', { show: true });

    await page.evaluate(() => {
      window.longtasks = [];
      const observer = new PerformanceObserver((list) => {
        window.longtasks.push(...list.getEntries().map((e) => e.duration));
      });

      observer.observe({ entryTypes: ['longtask'] });
    });
  } else {
    test.setTimeout(30 * 1000);
  }
  const editorPage = new CypherEditorPage(page);
  const component = await mount(
    <CypherEditor
      prompt="neo4j>"
      theme="dark"
      lint
      schema={testData.mockSchema}
    />,
  );

  // pressSequentially is less efficient -> we want to test the performance of the editor
  await editorPage.getEditor().pressSequentially(`
   MATCH (n:Person) RETURN m;`);

  await editorPage.checkErrorMessage('m', 'Variable `m` not defined');

  // set and unset large query a few times
  await component.update(
    <CypherEditor value={testData.largeQuery} schema={testData.mockSchema} />,
  );
  await component.update(
    <CypherEditor value="" schema={testData.mockSchema} />,
  );

  await component.update(
    <CypherEditor value={testData.largeQuery} schema={testData.mockSchema} />,
  );
  await component.update(<CypherEditor value="" />);

  await component.update(
    <CypherEditor value={testData.largeQuery} schema={testData.mockSchema} />,
  );
  await component.update(
    <CypherEditor value="" schema={testData.mockSchema} />,
  );

  await component.update(
    <CypherEditor value={testData.largeQuery} schema={testData.mockSchema} />,
  );
  await component.update(
    <CypherEditor value="" schema={testData.mockSchema} />,
  );

  await component.update(
    <CypherEditor value={testData.largeQuery} schema={testData.mockSchema} />,
  );

  await editorPage.getEditor().pressSequentially(`
 MATCH (n:P`);

  await expect(
    page.locator('.cm-tooltip-autocomplete').getByText('Person'),
  ).toBeVisible();

  await page.locator('.cm-tooltip-autocomplete').getByText('Person').click();

  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  await expect(component).toContainText('MATCH (n:Person');

  await editorPage.getEditor().pressSequentially(') RETRN my');

  await expect(component).toContainText('MATCH (n:Person) RETRN m');

  await editorPage.checkErrorMessage(
    'RETRN',
    'Unexpected token. Did you mean RETURN?',
  );

  await editorPage
    .getEditor()
    .pressSequentially('veryveryveryverylongvariable');

  if (process.env.BENCHMARKING === 'true') {
    const longtasks = await page.evaluate(() => window.longtasks);
    const sortedLongTasks = longtasks.sort((a, b) => a - b);
    const medianLongTask =
      sortedLongTasks[Math.floor(sortedLongTasks.length / 2)];
    const averageLongTask =
      sortedLongTasks.reduce((a, b) => a + b, 0) / sortedLongTasks.length;
    const over500 = sortedLongTasks.filter((t) => t > 500).length;
    const nintyninethPercentile =
      sortedLongTasks[Math.floor(sortedLongTasks.length * 0.99)];
    const longTaskCount = longtasks.length;
    const totalLongTaskTime = longtasks.reduce((a, b) => a + b, 0);

    const USER_ID = 1226722;
    const API_KEY = process.env.GRAFANA_API_KEY;
    if (!API_KEY) {
      throw new Error('Missing grafana api key');
    }

    const metrics = {
      medianLongTask,
      averageLongTask,
      over500,
      nintyninethPercentile,
      longTaskCount,
      totalLongTaskTime,
    };
    const body = Object.entries(metrics)
      .map(
        ([key, value]) =>
          `benchmark,bar_label=${key},source=playwright metric=${value}`,
      )
      .join('\n');

    await fetch(
      'https://influx-prod-39-prod-eu-north-0.grafana.net/api/v1/push/influx/write',
      {
        method: 'post',
        body,
        headers: {
          Authorization: `Bearer ${USER_ID}:${API_KEY}`,
          'Content-Type': 'text/plain',
        },
      },
    ).then((res) => {
      if (res.ok) {
        // eslint-disable-next-line no-console
        console.log('Metrics pushed to grafana successfully');
      } else {
        throw new Error(`Failed to push metrics to grafana: ${res.statusText}`);
      }
    });
  }
});
