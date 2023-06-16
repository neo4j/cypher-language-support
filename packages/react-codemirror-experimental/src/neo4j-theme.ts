import {
  HighlightStyle,
  syntaxHighlighting,
  TagStyle,
} from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';
import { StyleSpec } from 'style-mod';

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
  highlightStyles: TagStyle[];
}

export const createTheme = ({
  theme,
  editorSettings: settings,
  highlightStyles: styles = [],
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
    // tehere are more things to style
    // inspriation here: https://github.com/codemirror/theme-one-dark/blob/main/src/one-dark.ts
  };

  const themeExtension = EditorView.theme(themeOptions, {
    dark: theme === 'dark',
  });

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
    highlightStyles: [
      { tag: tags.comment, color: '#93a1a1;' },
      { tag: tags.variableName, color: '#0080ff' },
      { tag: [tags.string, tags.special(tags.brace)], color: '#b58900' },
      { tag: tags.number, color: '#2aa198' },
      { tag: tags.bool, color: '#2aa198;' },
      { tag: tags.keyword, color: '#859900;' },
      { tag: tags.operatorKeyword, color: '#859900' },
      { tag: tags.className, color: '##c616' },
      { tag: tags.function(tags.variableName), color: '#6c71c4' },
      { tag: tags.typeName, color: '#cb4b16' },
      { tag: tags.atom, color: '#dc322f;' },
      { tag: tags.propertyName, color: '#586e75;' },
      { tag: tags.operator, color: '#555555;' },
    ],
  });
