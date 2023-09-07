import {
  HighlightStyle,
  syntaxHighlighting,
  TagStyle,
} from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { StyleSpec } from 'style-mod';
import { HighlightedCypherTokenTypes, tokenTypeToStyleTag } from './constants';

export interface ThemeOptions {
  dark: boolean;
  editorSettings: {
    background: string;
    foreground: string;
    gutterForeground: string;
    cursor: string;
    selection: string;
    textMatchingSelection: string;
    searchPanel: {
      background: string;
      text: string;
      buttonBackground: string;
      buttonHoverBackground: string;
      checkboxBackground: string;
      checkboxBorder: string;
      checkboxCheckedBackground: string;
      checkboxCheckMark: string;
    };
  };
  highlightStyles: Partial<Record<HighlightedCypherTokenTypes, string>>;
  inheritBgColor?: boolean;
}

export const createCypherTheme = ({
  dark,
  editorSettings: settings,
  highlightStyles,
  inheritBgColor,
}: ThemeOptions): Extension => {
  const themeOptions: Record<string, StyleSpec> = {
    '&': {
      backgroundColor: inheritBgColor ? 'inherit' : settings.background,
      color: settings.foreground,
      fontVariantLigatures: 'none',
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '.cm-gutters': {
      backgroundColor: inheritBgColor ? 'inherit' : settings.background,
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
    '& .cm-panels': {
      backgroundColor: settings.searchPanel.background,
      fontFamily: 'Fira Code, Menlo, Monaco, Lucida Console, monospace',
    },
    '& .cm-search.cm-panel': {
      backgroundColor: settings.searchPanel.background,
      color: settings.searchPanel.text,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 0fr',
      gridTemplateRows: '1.5em 1.5em',
      maxWidth: '45rem',
      position: 'revert',
      gap: '0.5rem',

      '& .cm-button': {
        backgroundImage: 'none',
        backgroundColor: settings.searchPanel.buttonBackground,
        color: settings.searchPanel.text,
        border: 'none',
        fontSize: '0.75rem',
        borderRadius: '0.25rem',
        margin: 0,

        '&:hover': {
          backgroundColor: settings.searchPanel.buttonHoverBackground,
        },
      },

      '& label': {
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '0.25rem',
        "& input[type='checkbox']": {
          appearance: 'none',
          margin: 0,
          padding: 0,
          display: 'inline-flex',
          alignItems: 'center',
          position: 'relative',

          '&::before': {
            content: '""',
            display: 'inline-block',
            height: '1rem',
            width: '1rem',
            border: `1px solid ${settings.searchPanel.checkboxBorder}`,
            backgroundColor: settings.searchPanel.checkboxBackground,
            borderRadius: '0.25rem',
          },

          '&::after': {
            content: '""',
            transform: 'scale(0) rotate(-45deg)',
            background: 'none',
            borderBottom: `2px solid ${settings.searchPanel.checkboxCheckMark}`,
            borderLeft: `2px solid ${settings.searchPanel.checkboxCheckMark}`,
            marginTop: '-0.1875rem',
            position: 'absolute',
            top: '0.46875rem',
            width: '0.6rem',
            left: '3px',
            height: '0.4rem',
          },

          '&:checked::before': {
            backgroundColor: settings.searchPanel.checkboxCheckedBackground,
            borderColor: settings.searchPanel.checkboxCheckedBackground,
          },

          '&:checked::after': {
            transform: 'scale(1) rotate(-45deg)',
          },
        },
      },
    },

    // there are more things to style (autocomplete panel etc)
    // inspriation here: https://github.com/codemirror/theme-one-dark/blob/main/src/one-dark.ts
  };

  const themeExtension = EditorView.theme(themeOptions, { dark });

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
