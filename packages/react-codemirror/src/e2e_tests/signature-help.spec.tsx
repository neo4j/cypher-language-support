import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';

test.use({ viewport: { width: 1000, height: 500 } });

const mockSchema = {
  functionSignatures: {
    abs: {
      label: 'abs',
      documentation: 'Returns the absolute value of a floating point number.',
      parameters: [
        {
          label: 'input',
          documentation: 'input :: FLOAT?',
        },
      ],
    },
  },
  procedureSignatures: {
    'apoc.import.csv': {
      label: 'apoc.import.csv',
      documentation:
        'Imports nodes and relationships with the given labels and types from the provided CSV file.',
      parameters: [
        {
          label: 'nodes',
          documentation: 'nodes :: LIST? OF MAP?',
        },
        {
          label: 'rels',
          documentation: 'rels :: LIST? OF MAP?',
        },
        {
          label: 'config',
          documentation: 'config :: MAP?',
        },
      ],
    },
  },
};

test('Prop signatureHelp set to false disables signature help for functions', async ({
  page,
  mount,
}) => {
  const query = 'RETURN abs()';

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
  const query = 'CALL apoc.import.csv()';

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
  const query = 'RETURN abs()';

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
  const query = 'CALL apoc.import.csv()';

  await mount(
    <CypherEditor value={query} schema={mockSchema} autofocus={true} />,
  );

  await expect(page.locator('.cm-tooltip-signature-help').last()).toBeVisible({
    timeout: 2000,
  });
});
