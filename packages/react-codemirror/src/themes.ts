import { Extension } from '@codemirror/state';
import { mirage } from 'ayu';
import {
  createCypherTheme,
  ThemeOptions,
} from './lang-cypher/createCypherTheme';
import { tokens } from './ndlTokensCopy';

export const lightThemeConstants: ThemeOptions = {
  dark: false,
  editorSettings: {
    background: '#FEFEFE',
    foreground: '#545454',
    gutterForeground: '#6c6c6c',
    selection: tokens.colors.neutral['20'],
    textMatchingSelection: tokens.colors.lavender['15'],
    cursor: '#000000',
    autoCompletionPanel: {
      selectedColor: '#cce2ff',
      matchingTextColor: '#0066bf',
      backgroundColor: '#F3F4F5',
    },
    searchPanel: {
      background: '#FEFEFE',
      text: '#545454',
      buttonHoverBackground: tokens.theme.light.palette.neutral.bg.strong,
    },
  },
  highlightStyles: {
    comment: '#a3a7ae',
    keyword: '#008561',
    keywordLiteral: '#008561',
    label: '#de064e',
    predicateFunction: '#0177b8',
    function: '#0177b8',
    procedure: '#0177b8',
    stringLiteral: '#8c6b41',
    numberLiteral: '#9a4fcb',
    booleanLiteral: '#9a4fcb',
    operator: '#008561',
    property: '#0055ae',
    paramValue: '#9a4fcb',
  },
};

export const darkThemeConstants: ThemeOptions = {
  dark: true,
  editorSettings: {
    background: mirage.editor.bg.hex(),
    foreground: mirage.editor.fg.hex(),
    gutterForeground: mirage.editor.gutter.normal.hex(),
    selection: mirage.editor.selection.active.hex(),
    textMatchingSelection: mirage.editor.findMatch.active.hex(),
    cursor: '#ffffff',
    autoCompletionPanel: {
      selectedColor: '#062f4a',
      matchingTextColor: '#0097fb',
      backgroundColor: '#1C212B',
    },
    searchPanel: {
      background: tokens.theme.dark.palette.neutral.bg.default,
      text: tokens.theme.dark.palette.neutral.text.default,
      buttonHoverBackground: tokens.theme.dark.palette.neutral.bg.strong,
    },
  },
  highlightStyles: {
    comment: mirage.syntax.comment.hex(),
    keyword: mirage.syntax.keyword.hex(),
    keywordLiteral: mirage.syntax.keyword.hex(),
    label: mirage.syntax.markup.hex(),
    predicateFunction: mirage.syntax.func.hex(),
    function: mirage.syntax.func.hex(),
    procedure: mirage.syntax.func.hex(),
    stringLiteral: mirage.syntax.string.hex(),
    numberLiteral: mirage.syntax.constant.hex(),
    booleanLiteral: mirage.syntax.constant.hex(),
    operator: mirage.syntax.operator.hex(),
    property: mirage.syntax.tag.hex(),
    paramDollar: mirage.syntax.regexp.hex(),
    paramValue: mirage.syntax.regexp.hex(),
    namespace: mirage.syntax.special.hex(),
    consoleCommand: mirage.editor.fg.hex(),
  },
};

type ExtraThemeOptions = { inheritBgColor?: boolean };
export const ayuLightTheme = ({ inheritBgColor }: ExtraThemeOptions) => {
  return createCypherTheme({ ...lightThemeConstants, inheritBgColor });
};

export const ayuDarkTheme = ({ inheritBgColor }: ExtraThemeOptions) => {
  return createCypherTheme({ ...darkThemeConstants, inheritBgColor });
};

export function getThemeExtension(
  theme: 'light' | 'dark' | 'none' | Extension,
  inheritBgColor?: boolean,
): Extension | Extension[] {
  switch (theme) {
    case 'light':
      return ayuLightTheme({ inheritBgColor });
    case 'dark':
      return ayuDarkTheme({ inheritBgColor });
    case 'none':
      return [];
    default:
      return theme;
  }
}
