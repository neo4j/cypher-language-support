import { Extension } from '@codemirror/state';
import {
  createCypherTheme,
  type DiffColors,
  ThemeOptions,
} from './lang-cypher/createCypherTheme';
import { tokens } from '@neo4j-ndl/base';

const lightDiffColors: DiffColors = {
  insertedLine: tokens.palette.forest['10'],
  insertedText: tokens.palette.forest['15'],
  deletedLine: tokens.palette.hibiscus['10'],
  deletedText: tokens.palette.hibiscus['15'],
};

const darkDiffColors: DiffColors = {
  insertedLine: tokens.palette.forest['65'],
  insertedText: tokens.palette.forest['55'],
  deletedLine: tokens.palette.hibiscus['65'],
  deletedText: tokens.palette.hibiscus['55'],
};

export const lightThemeConstants: ThemeOptions = {
  dark: false,
  diffColors: lightDiffColors,
  editorSettings: {
    background: '#FEFEFE',
    foreground: '#545454',
    gutterForeground: '#a3a7ae',
    selection: tokens.palette.neutral['20'],
    textMatchingSelection: tokens.palette.lavender['15'],
    cursor: '#000000',
    autoCompletionPanel: {
      selectedColor: '#cce2ff',
      matchingTextColor: '#0066bf',
      backgroundColor: '#F3F4F5',
    },
    searchPanel: {
      background: '#FEFEFE',
      text: '#545454',
      buttonHoverBackground: tokens.theme.light.color.neutral.bg.strong,
    },
  },
  highlightStyles: {
    comment: tokens.code.light.comment,
    keyword: tokens.code.light.keyword,
    keywordLiteral: tokens.code.light.keywordLiteral,
    label: tokens.code.light.label,
    predicateFunction: tokens.code.light.predicateFunction,
    function: tokens.code.light.function,
    procedure: tokens.code.light.procedure,
    stringLiteral: tokens.code.light.stringLiteral,
    numberLiteral: tokens.code.light.numberLiteral,
    booleanLiteral: tokens.code.light.booleanLiteral,
    operator: tokens.code.light.operator,
    property: tokens.code.light.property,
    paramValue: tokens.code.light.paramValue,
  },
};

export const darkThemeConstants: ThemeOptions = {
  dark: true,
  diffColors: darkDiffColors,
  editorSettings: {
    background: '#242936',
    foreground: '#cccac2',
    gutterForeground: '#8a919966',
    selection: '#409fff40',
    textMatchingSelection: '#695380',
    cursor: tokens.palette.neutral['10'],
    autoCompletionPanel: {
      selectedColor: '#062f4a',
      matchingTextColor: '#0097fb',
      backgroundColor: '#1C212B',
    },
    searchPanel: {
      background: tokens.theme.dark.color.neutral.bg.default,
      text: tokens.theme.dark.color.neutral.text.default,
      buttonHoverBackground: tokens.theme.dark.color.neutral.bg.strong,
    },
  },
  highlightStyles: {
    comment: tokens.code.dark.comment,
    keyword: tokens.code.dark.keyword,
    keywordLiteral: tokens.code.dark.keywordLiteral,
    label: tokens.code.dark.label,
    predicateFunction: tokens.code.dark.predicateFunction,
    function: tokens.code.dark.function,
    procedure: tokens.code.dark.procedure,
    stringLiteral: tokens.code.dark.stringLiteral,
    numberLiteral: tokens.code.dark.numberLiteral,
    booleanLiteral: tokens.code.dark.booleanLiteral,
    operator: tokens.code.dark.operator,
    property: tokens.code.dark.property,
    paramValue: tokens.code.dark.paramValue,
  },
};

type ExtraThemeOptions = { inheritBgColor?: boolean };
const ayuLightTheme = ({ inheritBgColor }: ExtraThemeOptions) => {
  return createCypherTheme({ ...lightThemeConstants, inheritBgColor });
};

const ayuDarkTheme = ({ inheritBgColor }: ExtraThemeOptions) => {
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
