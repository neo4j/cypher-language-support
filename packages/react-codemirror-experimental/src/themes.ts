import { Extension } from '@codemirror/state';
import { createCypherTheme } from './lang-cypher/create-cypher-theme';

import { light, mirage } from 'ayu';

export const lightThemeConstants = {
  dark: false,
  editorSettings: {
    background: light.editor.bg.hex(),
    foreground: light.editor.fg.hex(),
    gutterForeground: light.editor.gutter.normal.hex(),
    selection: light.editor.selection.active.hex(),
    textMatchingSelection: light.editor.findMatch.active.hex(),
    cursor: light.common.accent.hex(),
  },
  highlightStyles: {
    comment: light.syntax.comment.hex(),
    keyword: light.syntax.keyword.hex(),
    keywordLiteral: light.syntax.keyword.hex(),
    label: light.syntax.entity.hex(),
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
  },
};

export const ayuLightTheme = () => createCypherTheme(lightThemeConstants);
export const darkThemeConstants = {
  dark: true,
  editorSettings: {
    background: mirage.editor.bg.hex(),
    foreground: mirage.editor.fg.hex(),
    gutterForeground: mirage.editor.gutter.normal.hex(),
    selection: mirage.editor.selection.active.hex(),
    textMatchingSelection: mirage.editor.findMatch.active.hex(),
    cursor: mirage.common.accent.hex(),
  },
  highlightStyles: {
    comment: mirage.syntax.comment.hex(),
    keyword: mirage.syntax.keyword.hex(),
    keywordLiteral: mirage.syntax.keyword.hex(),
    label: mirage.syntax.entity.hex(),
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
  },
};

export const ayuDarkTheme = () => {
  return createCypherTheme(darkThemeConstants);
};

export function getThemeExtension(
  theme: 'light' | 'dark' | 'none' | Extension,
): Extension | Extension[] {
  switch (theme) {
    case 'light':
      return ayuLightTheme();
    case 'dark':
      return ayuDarkTheme();
    case 'none':
      return [];
    default:
      return theme;
  }
}
