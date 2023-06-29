import { createCypherTheme } from './lang-cypher/create-cypher-theme';

export const neo4jLightTheme = () =>
  createCypherTheme({
    dark: false,
    editorSettings: {
      background: '#ffffff',
      foreground: '#444444',
      gutterForeground: '#6c6c6c',
      cursor: '#000',
      selection: '#d7d4f0',
      textMatchingSelection: '#72a1ff59',
    },
    highlightStyles: {
      comment: '#93a1a1',
      keyword: '#859900',
      label: '#cb4b16',
      predicateFunction: '#6c71c4',
      function: '#6c71c4',
      procedure: '#6c71c4',
      namespace: '#6c71c4',
      variable: '#0080ff',
      paramDollar: '#dc322f',
      paramValue: '#dc322f',
      symbolicName: '#0080ff',
      operator: '#555555',
      stringLiteral: '#b58900',
      numberLiteral: '#2aa198',
      booleanLiteral: '#2aa198',
      keywordLiteral: '#859900',
      property: '#586e75',
      bracket: '#333333',
    },
  });

export const neo4jDarkTheme = () =>
  createCypherTheme({
    dark: false,
    editorSettings: {
      background: '#ffffff',
      foreground: '#444444',
      gutterForeground: '#6c6c6c',
      cursor: '#000',
      selection: '#d7d4f0',
      textMatchingSelection: '#72a1ff59',
    },
    highlightStyles: {
      comment: '#93a1a1',
      keyword: '#859900',
      label: '#cb4b16',
      predicateFunction: '#6c71c4',
      function: '#6c71c4',
      procedure: '#6c71c4',
      namespace: '#6c71c4',
      variable: '#0080ff',
      paramDollar: '#dc322f',
      paramValue: '#dc322f',
      symbolicName: '#0080ff',
      operator: '#555555',
      stringLiteral: '#b58900',
      numberLiteral: '#2aa198',
      booleanLiteral: '#2aa198',
      keywordLiteral: '#859900',
      property: '#586e75',
      bracket: '#333333',
    },
  });
