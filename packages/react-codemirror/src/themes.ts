import { Extension } from '@codemirror/state';
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
    gutterForeground: '#a3a7ae',
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
    comment: tokens.palette.code.light.comment,
    keyword: tokens.palette.code.light.keyword,
    keywordLiteral: tokens.palette.code.light.keywordLiteral,
    label: tokens.palette.code.light.label,
    predicateFunction: tokens.palette.code.light.predicateFunction,
    function: tokens.palette.code.light.function,
    procedure: tokens.palette.code.light.procedure,
    stringLiteral: tokens.palette.code.light.stringLiteral,
    numberLiteral: tokens.palette.code.light.numberLiteral,
    booleanLiteral: tokens.palette.code.light.booleanLiteral,
    operator: tokens.palette.code.light.operator,
    property: tokens.palette.code.light.property,
    paramValue: tokens.palette.code.light.paramValue,
  },
};

export const darkThemeConstants: ThemeOptions = {
  dark: true,
  editorSettings: {
    background: '#242936',
    foreground: '#cccac2',
    gutterForeground: '#8a919966',
    selection: '#409fff40',
    textMatchingSelection: '#695380',
    cursor: tokens.colors.neutral['10'],
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
    comment: tokens.palette.code.dark.comment,
    keyword: tokens.palette.code.dark.keyword,
    keywordLiteral: tokens.palette.code.dark.keywordLiteral,
    label: tokens.palette.code.dark.label,
    predicateFunction: tokens.palette.code.dark.predicateFunction,
    function: tokens.palette.code.dark.function,
    procedure: tokens.palette.code.dark.procedure,
    stringLiteral: tokens.palette.code.dark.stringLiteral,
    numberLiteral: tokens.palette.code.dark.numberLiteral,
    booleanLiteral: tokens.palette.code.dark.booleanLiteral,
    operator: tokens.palette.code.dark.operator,
    property: tokens.palette.code.dark.property,
    paramValue: tokens.palette.code.dark.paramValue,
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
