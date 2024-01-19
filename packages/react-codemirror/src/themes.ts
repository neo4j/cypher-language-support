import { Extension } from '@codemirror/state';
import { light, mirage } from 'ayu';
import {
  createCypherTheme,
  ThemeOptions,
} from './lang-cypher/create-cypher-theme';
import { tokens } from './ndl-tokens-copy';

/* ndl exports most tokens as hex colors but some tokens are exported as rgb colors, in the form of "10, 20, 30"
   This should be fixed in version 2 of ndl.
   Meanwhile we can use this function */
const convertToHex = (color: string) => {
  if (color.startsWith('#')) {
    return color;
  }

  const rgb = color.match(/\d+/g);
  if (!rgb) {
    return color;
  }
  const [r, g, b] = rgb;
  return `#${Number(r).toString(16)}${Number(g).toString(16)}${Number(
    b,
  ).toString(16)}`;
};

export const lightThemeConstants: ThemeOptions = {
  dark: false,
  editorSettings: {
    background: light.editor.bg.hex(),
    foreground: light.editor.fg.hex(),
    gutterForeground: light.editor.gutter.normal.hex(),
    selection: light.editor.selection.active.hex(),
    textMatchingSelection: light.editor.findMatch.active.hex(),
    cursor: '#000000',
    autoCompletionPanel: {
      selectedColor: '#cce2ff',
      matchingTextColor: '#0066bf',
      backgroundColor: '#F3F4F5',
    },
    searchPanel: {
      background: tokens.palette.light.neutral.bg.default,
      text: tokens.palette.light.neutral.text.default,
      buttonHoverBackground: tokens.palette.light.neutral.bg.strong,
    },
  },
  highlightStyles: {
    comment: light.syntax.comment.hex(),
    keyword: light.syntax.keyword.hex(),
    keywordLiteral: light.syntax.keyword.hex(),
    label: light.syntax.markup.hex(),
    predicateFunction: light.syntax.func.hex(),
    function: light.syntax.func.hex(),
    procedure: light.syntax.func.hex(),
    stringLiteral: light.syntax.string.hex(),
    numberLiteral: light.syntax.constant.hex(),
    booleanLiteral: light.syntax.constant.hex(),
    operator: light.syntax.operator.hex(),
    property: light.syntax.tag.hex(),
    paramDollar: light.syntax.regexp.hex(),
    paramValue: light.syntax.regexp.hex(),
    namespace: light.syntax.special.hex(),
    consoleCommand: light.editor.fg.hex(),
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
      background: convertToHex(tokens.palette.dark.neutral.bg.default),
      text: convertToHex(tokens.palette.dark.neutral.text.default),
      buttonHoverBackground: convertToHex(
        tokens.palette.dark.neutral.bg.strong,
      ),
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
