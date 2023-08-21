import { expect, test } from '@playwright/test';
import { darkThemeConstants, lightThemeConstants } from '../src/themes';
import { CypherEditorPage } from './cypher-editor';

test.beforeEach(async ({ page }) => {
  await page.goto('localhost:3000');
});

test('light theme highlighting', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);
  const query = `
  MATCH (variable :Label)-[:REL_TYPE]->() 
WHERE variable.property = "String" 
    OR namespaced.function() = false
    // comment
    OR $parameter > 1234 
RETURN variable;`;

  await editorPage.createEditor({ value: query, theme: 'light' });

  const keywordcolors = await Promise.all(
    ['MATCH', 'WHERE', 'RETURN'].map((kw) =>
      editorPage.getHexColorOfLocator(page.getByText(kw)),
    ),
  );
  keywordcolors.every((kw) =>
    expect(kw).toEqual(lightThemeConstants.highlightStyles.keyword),
  );

  const labelReltype = await Promise.all(
    ['Label', 'REL_TYPE'].map((kw) =>
      editorPage.getHexColorOfLocator(page.getByText(kw)),
    ),
  );
  labelReltype.every((kw) =>
    expect(kw).toEqual(lightThemeConstants.highlightStyles.label),
  );

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('parameter')),
  ).toEqual(lightThemeConstants.highlightStyles.paramValue);

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('property')),
  ).toEqual(lightThemeConstants.highlightStyles.property);

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('false')),
  ).toEqual(lightThemeConstants.highlightStyles.booleanLiteral);

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('String')),
  ).toEqual(lightThemeConstants.highlightStyles.stringLiteral);

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('comment')),
  ).toEqual(lightThemeConstants.highlightStyles.comment);

  expect(
    await editorPage.getHexColorOfLocator(
      page.getByText('1234', { exact: true }),
    ),
  ).toEqual(lightThemeConstants.highlightStyles.numberLiteral);

  expect(await editorPage.editorBackgroundIsUnset()).toEqual(false);
});

test('dark theme highlighting', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);
  const query = `
  MATCH (variable :Label)-[:REL_TYPE]->() 
WHERE variable.property = "String" 
    OR namespaced.function() = false
    // comment
    OR $parameter > 1234 
RETURN variable;`;

  await editorPage.createEditor({ value: query, theme: 'dark' });

  const keywordcolors = await Promise.all(
    ['MATCH', 'WHERE', 'RETURN'].map((kw) =>
      editorPage.getHexColorOfLocator(page.getByText(kw)),
    ),
  );
  keywordcolors.every((kw) =>
    expect(kw).toEqual(darkThemeConstants.highlightStyles.keyword),
  );

  const labelReltype = await Promise.all(
    ['Label', 'REL_TYPE'].map((kw) =>
      editorPage.getHexColorOfLocator(page.getByText(kw)),
    ),
  );
  labelReltype.every((kw) =>
    expect(kw).toEqual(darkThemeConstants.highlightStyles.label),
  );

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('parameter')),
  ).toEqual(darkThemeConstants.highlightStyles.paramValue);

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('property')),
  ).toEqual(darkThemeConstants.highlightStyles.property);

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('false')),
  ).toEqual(darkThemeConstants.highlightStyles.booleanLiteral);

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('String')),
  ).toEqual(darkThemeConstants.highlightStyles.stringLiteral);

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('comment')),
  ).toEqual(darkThemeConstants.highlightStyles.comment);

  expect(
    await editorPage.getHexColorOfLocator(
      page.getByText('1234', { exact: true }),
    ),
  ).toEqual(darkThemeConstants.highlightStyles.numberLiteral);

  expect(await editorPage.editorBackgroundIsUnset()).toEqual(false);
});

test('respects prop to allow overriding bkg color', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);
  await editorPage.createEditor({
    value: 'text',
    theme: 'light',
    overrideThemeBackgroundColor: true,
  });
  expect(await editorPage.editorBackgroundIsUnset()).toEqual(true);
});
