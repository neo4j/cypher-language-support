import {
  HighlightStyle,
  syntaxHighlighting,
  TagStyle,
} from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { StyleSpec } from 'style-mod';
import {
  HighlightedCypherTokenTypes,
  tokenTypeToStyleTag,
} from './lang-cypher/constants';

export interface ThemeOptions {
  theme: 'light' | 'dark';
  editorSettings: {
    background: string;
    foreground: string;
    gutterForeground: string;
    cursor: string;
    selection: string;
    textMatchingSelection: string;
  };
  highlightStyles: Record<HighlightedCypherTokenTypes, string>;
}

export const createTheme = ({
  theme,
  editorSettings: settings,
  highlightStyles,
}: ThemeOptions): Extension => {
  const themeOptions: Record<string, StyleSpec> = {
    '&': {
      backgroundColor: settings.background,
      color: settings.foreground,
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '.cm-gutters': {
      backgroundColor: settings.background,
      color: settings.gutterForeground,
      border: 'none',
    },
    '&.cm-editor .cm-scroller': {
      fontFamily: 'Fira Code, Menlo, Monaco, Lucida Console, monospace',
    },
    '.cm-content': {
      caretColor: settings.cursor,
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: settings.cursor,
    },
    '.cm-activeLine ::not(::selection)': {
      backgroundColor: settings.background,
    },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection ':
      {
        backgroundColor: settings.selection,
      },
    '& .cm-selectionMatch': {
      backgroundColor: settings.textMatchingSelection,
    },
    // there are more things to style (autocomplete panel etc)
    // inspriation here: https://github.com/codemirror/theme-one-dark/blob/main/src/one-dark.ts
  };

  const themeExtension = EditorView.theme(themeOptions, {
    dark: theme === 'dark',
  });

  const styles = Object.entries(highlightStyles).map(
    ([token, color]: [HighlightedCypherTokenTypes, string]): TagStyle => ({
      tag: tokenTypeToStyleTag[token],
      color,
    }),
  );
  const highlightStyle = HighlightStyle.define(styles);
  const extension = [themeExtension, syntaxHighlighting(highlightStyle)];

  return extension;
};

export const neo4jLightTheme = () =>
  createTheme({
    theme: 'light',
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
