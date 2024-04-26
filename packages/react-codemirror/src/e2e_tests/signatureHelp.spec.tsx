import { testData } from '@neo4j-cypher/language-support';
import { expect, test } from '@playwright/experimental-ct-react';
import { Locator } from 'playwright/test';
import { CypherEditor } from '../CypherEditor';

test.use({ viewport: { width: 1000, height: 500 } });

type TooltipExpectations = {
  includes?: string[];
  excludes?: string[];
};

function testTooltip(tooltip: Locator, expectations: TooltipExpectations) {
  const includes = expectations.includes ?? [];
  const excludes = expectations.excludes ?? [];

  const included = Promise.all(
    includes.map((text) => {
      return expect(tooltip).toContainText(text, {
        timeout: 2000,
      });
    }),
  );

  const excluded = Promise.all(
    excludes.map((text) => {
      return expect(tooltip).not.toContainText(text, {
        timeout: 2000,
      });
    }),
  );

  return Promise.all([included, excluded]);
}

test('Signature help works for functions', async ({ page, mount }) => {
  const query = 'RETURN abs(';

  await mount(
    <CypherEditor
      value={query}
      schema={testData.mockSchema}
      autofocus={true}
    />,
  );

  await expect(page.locator('.cm-signature-help-panel')).toBeVisible({
    timeout: 2000,
  });
});

test('Signature help works for procedures', async ({ page, mount }) => {
  const query = 'CALL apoc.import.csv(';

  await mount(
    <CypherEditor
      value={query}
      schema={testData.mockSchema}
      autofocus={true}
    />,
  );

  await expect(page.locator('.cm-signature-help-panel')).toBeVisible({
    timeout: 2000,
  });
});

test('Signature help shows the description for the first argument', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(';

  await mount(
    <CypherEditor
      value={query}
      schema={testData.mockSchema}
      autofocus={true}
    />,
  );

  const tooltip = page.locator('.cm-signature-help-panel');

  await testTooltip(tooltip, {
    includes: [
      'nodes :: LIST<MAP>',
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file',
    ],
  });
});

test('Signature help shows the description for the first argument when the cursor is at that position', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv()';

  await mount(
    <CypherEditor value={query} schema={testData.mockSchema} offset={21} />,
  );

  const tooltip = page.locator('.cm-signature-help-panel');

  await testTooltip(tooltip, {
    includes: [
      'nodes :: LIST<MAP>',
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file',
    ],
  });
});

test('Signature help shows the description for the second argument', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(nodes,';

  await mount(
    <CypherEditor
      value={query}
      schema={testData.mockSchema}
      autofocus={true}
    />,
  );

  const tooltip = page.locator('.cm-signature-help-panel');

  await testTooltip(tooltip, {
    includes: [
      'rels :: LIST<MAP>',
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file',
    ],
  });
});

test('Signature help shows the description for the second argument when the cursor is at that position', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(nodes,)';

  await mount(
    <CypherEditor value={query} schema={testData.mockSchema} offset={27} />,
  );

  const tooltip = page.locator('.cm-signature-help-panel');

  await testTooltip(tooltip, {
    includes: [
      'rels :: LIST<MAP>',
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file',
    ],
  });
});

test('Signature help shows the description for the second argument when the cursor is at that position, even after whitespaces', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(nodes,  )';

  await mount(
    <CypherEditor value={query} schema={testData.mockSchema} offset={28} />,
  );

  const tooltip = page.locator('.cm-signature-help-panel');

  await testTooltip(tooltip, {
    includes: [
      'rels :: LIST<MAP>',
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file',
    ],
  });
});

test('Signature help shows description for arguments with a space following a separator', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(nodes, ';

  await mount(
    <CypherEditor
      value={query}
      schema={testData.mockSchema}
      autofocus={true}
    />,
  );

  const tooltip = page.locator('.cm-signature-help-panel');

  await testTooltip(tooltip, {
    includes: [
      'rels :: LIST<MAP>',
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file',
    ],
  });
});

test('Signature help shows the description for the third argument', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(nodes, rels,';

  await mount(
    <CypherEditor
      value={query}
      schema={testData.mockSchema}
      autofocus={true}
    />,
  );

  const tooltip = page.locator('.cm-signature-help-panel');

  await testTooltip(tooltip, {
    includes: [
      'config :: MAP',
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file',
    ],
  });
});

test('Signature help works on multiline queries', async ({ page, mount }) => {
  const query = `CALL apoc.import.csv(
    nodes, 
    rels,  
    `;

  await mount(
    <CypherEditor
      value={query}
      schema={testData.mockSchema}
      autofocus={true}
    />,
  );

  const tooltip = page.locator('.cm-signature-help-panel');

  await testTooltip(tooltip, {
    includes: [
      'config :: MAP',
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file',
    ],
  });
});

test('Signature help only shows the description past the last argument', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(nodes, rels, config,';

  await mount(
    <CypherEditor
      value={query}
      schema={testData.mockSchema}
      autofocus={true}
    />,
  );
  1;

  const tooltip = page.locator('.cm-signature-help-panel');

  await testTooltip(tooltip, {
    includes: [
      'apoc.import.csv(nodes :: LIST<MAP>, rels :: LIST<MAP>, config :: MAP)',
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file.',
    ],
  });
});

test('Signature help does not show any help when method finished', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(nodes, rels, config)';

  await mount(
    <CypherEditor
      value={query}
      schema={testData.mockSchema}
      autofocus={true}
    />,
  );

  await expect(page.locator('.cm-signature-help-panel')).not.toBeVisible({
    timeout: 2000,
  });
});

test('Signature help does not blow up on empty query', async ({
  page,
  mount,
}) => {
  const query = '';

  await mount(
    <CypherEditor
      value={query}
      schema={testData.mockSchema}
      autofocus={true}
    />,
  );

  await expect(page.locator('.cm-signature-help-panel')).not.toBeVisible({
    timeout: 2000,
  });
});
