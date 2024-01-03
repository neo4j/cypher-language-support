import { expect, test } from '@playwright/experimental-ct-react';
import { Locator } from 'playwright/test';
import { CypherEditor } from '../CypherEditor';
import { mockSchema } from './mock-data';

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

test('Prop signatureHelp set to false disables signature help for functions', async ({
  page,
  mount,
}) => {
  const query = 'RETURN abs(';

  await mount(
    <CypherEditor
      value={query}
      signatureHelp={false}
      schema={mockSchema}
      autofocus={true}
    />,
  );

  await expect(
    page.locator('.cm-tooltip-signature-help').last(),
  ).not.toBeVisible({
    timeout: 2000,
  });
});

test('Prop signatureHelp set to true disables signature help for procedures', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(';

  await mount(
    <CypherEditor
      value={query}
      signatureHelp={false}
      schema={mockSchema}
      autofocus={true}
    />,
  );

  await expect(
    page.locator('.cm-tooltip-signature-help').last(),
  ).not.toBeVisible({
    timeout: 2000,
  });
});

test('Prop signatureHelp set to true enables signature help', async ({
  page,
  mount,
}) => {
  const query = 'RETURN abs(';

  await mount(
    <CypherEditor
      value={query}
      signatureHelp={true}
      schema={mockSchema}
      autofocus={true}
    />,
  );

  await expect(page.locator('.cm-tooltip-signature-help').last()).toBeVisible({
    timeout: 2000,
  });
});

test('Prop signatureHelp enables signature help by default', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(';

  await mount(
    <CypherEditor value={query} schema={mockSchema} autofocus={true} />,
  );

  await expect(page.locator('.cm-tooltip-signature-help').last()).toBeVisible({
    timeout: 2000,
  });
});

test('Signature help set shows the description for the first argument', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(';

  await mount(
    <CypherEditor
      value={query}
      signatureHelp={true}
      schema={mockSchema}
      autofocus={true}
    />,
  );

  const tooltip = page.locator('.cm-tooltip-signature-help').last();

  await testTooltip(tooltip, {
    includes: [
      'nodes :: LIST<MAP>',
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file',
    ],
  });
});

test('Signature help set shows the description for the second argument', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(nodes,';

  await mount(
    <CypherEditor
      value={query}
      signatureHelp={true}
      schema={mockSchema}
      autofocus={true}
    />,
  );

  const tooltip = page.locator('.cm-tooltip-signature-help').last();

  await testTooltip(tooltip, {
    includes: [
      'rels :: LIST<MAP>',
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file',
    ],
  });
});

test('Signature help set shows description for arguments with a space following a separator', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(nodes, ';

  await mount(
    <CypherEditor
      value={query}
      signatureHelp={true}
      schema={mockSchema}
      autofocus={true}
    />,
  );

  const tooltip = page.locator('.cm-tooltip-signature-help').last();

  await testTooltip(tooltip, {
    includes: [
      'rels :: LIST<MAP>',
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file',
    ],
  });
});

test('Signature help set shows the description for the third argument', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(nodes, rels,';

  await mount(
    <CypherEditor
      value={query}
      signatureHelp={true}
      schema={mockSchema}
      autofocus={true}
    />,
  );

  const tooltip = page.locator('.cm-tooltip-signature-help').last();

  await testTooltip(tooltip, {
    includes: [
      'config :: MAP',
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file',
    ],
  });
});

test('Signature help only shows the description pass the last argument', async ({
  page,
  mount,
}) => {
  const query = 'CALL apoc.import.csv(nodes, rels, config,';

  await mount(
    <CypherEditor
      value={query}
      signatureHelp={true}
      schema={mockSchema}
      autofocus={true}
    />,
  );

  const tooltip = page.locator('.cm-tooltip-signature-help').last();

  await testTooltip(tooltip, {
    includes: [
      'Imports `NODE` and `RELATIONSHIP` values with the given labels and types from the provided CSV file',
    ],
    excludes: ['config :: MAP'],
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
      signatureHelp={true}
      schema={mockSchema}
      autofocus={true}
    />,
  );

  await expect(
    page.locator('.cm-tooltip-signature-help').last(),
  ).not.toBeVisible({
    timeout: 2000,
  });
});
