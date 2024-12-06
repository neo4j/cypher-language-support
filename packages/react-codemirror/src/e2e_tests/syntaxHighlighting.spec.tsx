import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';
import { darkThemeConstants, lightThemeConstants } from '../themes';
import { CypherEditorPage } from './e2eUtils';

test('light theme highlighting', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const query = `
  MATCH (variable :Label)-[:REL_TYPE]->() 
WHERE variable.property = "String" 
    OR namespaced.function() = false
    // comment
    OR $parameter > 1234 
RETURN variable;`;

  await mount(<CypherEditor value={query} theme="light" />);

  const keywordcolors = await Promise.all(
    ['MATCH', 'WHERE', 'RETURN'].map((kw) =>
      editorPage.getHexColorOfLocator(page.getByText(kw)),
    ),
  );
  keywordcolors.every((kw) =>
    expect(kw).toEqual(
      lightThemeConstants.highlightStyles.keyword.toLowerCase(),
    ),
  );

  const labelReltype = await Promise.all(
    ['Label', 'REL_TYPE'].map((kw) =>
      editorPage.getHexColorOfLocator(page.getByText(kw)),
    ),
  );
  labelReltype.every((kw) =>
    expect(kw).toEqual(lightThemeConstants.highlightStyles.label.toLowerCase()),
  );

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('parameter')),
  ).toEqual(lightThemeConstants.highlightStyles.paramValue.toLowerCase());

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('property')),
  ).toEqual(lightThemeConstants.highlightStyles.property.toLowerCase());

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('false')),
  ).toEqual(lightThemeConstants.highlightStyles.booleanLiteral.toLowerCase());

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('String')),
  ).toEqual(lightThemeConstants.highlightStyles.stringLiteral.toLowerCase());

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('comment')),
  ).toEqual(lightThemeConstants.highlightStyles.comment.toLowerCase());

  expect(
    await editorPage.getHexColorOfLocator(
      page.getByText('1234', { exact: true }),
    ),
  ).toEqual(lightThemeConstants.highlightStyles.numberLiteral.toLowerCase());

  expect(await editorPage.editorBackgroundIsUnset()).toEqual(false);
});

test('dark theme highlighting', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const query = `
  MATCH (variable :Label)-[:REL_TYPE]->() 
WHERE variable.property = "String" 
    OR namespaced.function() = false
    // comment
    OR $parameter > 1234 
RETURN variable;`;

  await mount(<CypherEditor value={query} theme="dark" />);

  const keywordcolors = await Promise.all(
    ['MATCH', 'WHERE', 'RETURN'].map((kw) =>
      editorPage.getHexColorOfLocator(page.getByText(kw)),
    ),
  );
  keywordcolors.every((kw) =>
    expect(kw).toEqual(
      darkThemeConstants.highlightStyles.keyword.toLowerCase(),
    ),
  );

  const labelReltype = await Promise.all(
    ['Label', 'REL_TYPE'].map((kw) =>
      editorPage.getHexColorOfLocator(page.getByText(kw)),
    ),
  );
  labelReltype.every((kw) =>
    expect(kw).toEqual(darkThemeConstants.highlightStyles.label.toLowerCase()),
  );

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('parameter')),
  ).toEqual(darkThemeConstants.highlightStyles.paramValue.toLowerCase());

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('property')),
  ).toEqual(darkThemeConstants.highlightStyles.property.toLowerCase());

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('false')),
  ).toEqual(darkThemeConstants.highlightStyles.booleanLiteral.toLowerCase());

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('String')),
  ).toEqual(darkThemeConstants.highlightStyles.stringLiteral.toLowerCase());

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('comment')),
  ).toEqual(darkThemeConstants.highlightStyles.comment.toLowerCase());

  expect(
    await editorPage.getHexColorOfLocator(
      page.getByText('1234', { exact: true }),
    ),
  ).toEqual(darkThemeConstants.highlightStyles.numberLiteral.toLowerCase());

  expect(await editorPage.editorBackgroundIsUnset()).toEqual(false);
});

test('can live switch theme ', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const component = await mount(<CypherEditor theme="light" value="RETURN" />);

  expect(
    await editorPage.getHexColorOfLocator(
      page.getByText('RETURN', { exact: true }),
    ),
  ).toEqual(lightThemeConstants.highlightStyles.keyword.toLowerCase());

  await component.update(<CypherEditor theme="dark" value="RETURN" />);

  expect(
    await editorPage.getHexColorOfLocator(
      page.getByText('RETURN', { exact: true }),
    ),
  ).toEqual(darkThemeConstants.highlightStyles.keyword.toLowerCase());
});

test('respects prop to allow overriding bkg color', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  await mount(
    <CypherEditor theme="light" value="text" overrideThemeBackgroundColor />,
  );

  expect(await editorPage.editorBackgroundIsUnset()).toEqual(true);
});

test('highlights multiline string literal correctly', async ({
  page,
  mount,
}) => {
  const editorPage = new CypherEditorPage(page);
  const query = `
RETURN "
multilinestring";`;

  await mount(<CypherEditor theme="light" value={query} />);

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('multilinestring')),
  ).toEqual(lightThemeConstants.highlightStyles.stringLiteral.toLowerCase());
});

test('highlights multiline label correctly', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const query = `
MATCH (v:\`

Label\`)
`;

  await mount(<CypherEditor theme="light" value={query} />);

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('Label')),
  ).toEqual(lightThemeConstants.highlightStyles.label.toLowerCase());
});

test('highlights multiline comment correctly', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const query = `
/*

comment
*/";`;

  await mount(<CypherEditor theme="light" value={query} />);

  expect(
    await editorPage.getHexColorOfLocator(page.getByText('comment')),
  ).toEqual(lightThemeConstants.highlightStyles.comment.toLowerCase());
});
