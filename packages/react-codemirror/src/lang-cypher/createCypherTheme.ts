import {
  HighlightStyle,
  syntaxHighlighting,
  TagStyle,
} from '@codemirror/language';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { StyleSpec } from 'style-mod';
import { HighlightedCypherTokenTypes, tokenTypeToStyleTag } from './constants';
import {
  byWordSvg,
  caseSensitiveSvg,
  downArrowSvg,
  regexSvg,
  replaceAllSvg,
  replaceSvg,
  upArrowSvg,
} from './themeIcons';

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
      buttonHoverBackground: string;
    };
    autoCompletionPanel: {
      selectedColor: string;
      backgroundColor: string;
      matchingTextColor: string;
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
    '& .cm-bold': {
      fontWeight: 'bold',
    },
    '& .cm-panels': {
      backgroundColor: settings.searchPanel.background,
      fontFamily: 'Fira Code, Menlo, Monaco, Lucida Console, monospace',
    },
    '& .cm-completionLabel': {
      fontFamily: 'Fira Code, Menlo, Monaco, Lucida Console, monospace',
      verticalAlign: 'middle',
    },
    '& .cm-completionMatchedText': {
      fontWeight: 'bold',
      color: settings.autoCompletionPanel.matchingTextColor,
      textDecoration: 'none',
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: settings.autoCompletionPanel.selectedColor,
        color: settings.foreground,
      },
      '& > ul': {
        backgroundColor: settings.autoCompletionPanel.backgroundColor,
        color: settings.foreground,
      },
    },
    '& .cm-search.cm-panel': {
      '& input': {
        fontFamily: 'Fira Code, Menlo, Monaco, Lucida Console, monospace',
      },
      backgroundColor: settings.searchPanel.background,
      color: settings.searchPanel.text,

      '& .cm-button[name=select]': { display: 'none' },
      '& .cm-button': {
        backgroundImage: 'none',
        color: settings.searchPanel.text,
        fontSize: 0,
        border: 'none',
        verticalAlign: 'middle',
        '&[name=next]::before': {
          content: `url("data:image/svg+xml;base64,${window.btoa(
            downArrowSvg,
          )}")`,
        },
        '&[name=prev]::before': {
          content: `url("data:image/svg+xml;base64,${window.btoa(
            upArrowSvg,
          )}")`,
        },
        '&[name=replace]::before': {
          content: `url("data:image/svg+xml;base64,${window.btoa(
            replaceSvg,
          )}")`,
        },
        '&[name=replaceAll]::before': {
          content: `url("data:image/svg+xml;base64,${window.btoa(
            replaceAllSvg,
          )}")`,
        },
        width: '20px',
        height: '20px',

        marginRight: '1px',
        marginLeft: '1px',
        borderRadius: '4px',
        padding: '2px',
        '&:hover': {
          backgroundColor: settings.searchPanel.buttonHoverBackground,
        },
      },

      '& label': {
        fontSize: '0',
        height: '20px',
        width: '20px',
        verticalAlign: 'middle',
        "& input[type='checkbox']": {
          cursor: 'pointer',
          appearance: 'none',
          marginRight: '1px',
          marginLeft: '1px',
          padding: '2px',
          height: '20px',
          width: '20px',
          verticalAlign: 'middle',
          display: 'inline-flex',
          borderRadius: '4px',

          '&[name=case]::before': {
            content: `url("data:image/svg+xml;base64,${window.btoa(
              caseSensitiveSvg,
            )}")`,
          },
          '&[name=re]::before': {
            content: `url("data:image/svg+xml;base64,${window.btoa(
              regexSvg,
            )}")`,
          },
          '&[name=word]::before': {
            content: `url("data:image/svg+xml;base64,${window.btoa(
              byWordSvg,
            )}")`,
          },
          '&:hover': {
            backgroundColor: settings.searchPanel.buttonHoverBackground,
          },
          '&:checked': {
            backgroundColor: settings.searchPanel.buttonHoverBackground,
          },
        },
      },
    },
  };

  const themeExtension = EditorView.theme(themeOptions, { dark });

  const styles = Object.entries(highlightStyles).map(
    ([token, color]: [HighlightedCypherTokenTypes, string]): TagStyle => ({
      tag: tokenTypeToStyleTag[token],
      color,
      class: token === 'consoleCommand' ? 'cm-bold' : undefined,
    }),
  );
  const highlightStyle = HighlightStyle.define(styles);
  const extension = [themeExtension, syntaxHighlighting(highlightStyle)];

  return extension;
};
