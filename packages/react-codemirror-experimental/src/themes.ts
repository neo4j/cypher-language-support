import { Extension } from '@codemirror/state';
import { createCypherTheme } from './lang-cypher/create-cypher-theme';

import { light, mirage } from 'ayu';

export const ayuLightTheme = () => {
  const { syntax } = light;
  return createCypherTheme({
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
      comment: syntax.comment.hex(),
      keyword: syntax.keyword.hex(),
      keywordLiteral: syntax.keyword.hex(),
      label: syntax.entity.hex(),
      predicateFunction: syntax.func.hex(),
      function: syntax.func.hex(),
      procedure: syntax.func.hex(),
      stringLiteral: syntax.string.hex(),
      numberLiteral: syntax.constant.hex(),
      booleanLiteral: syntax.constant.hex(),
      operator: syntax.operator.hex(),
      property: syntax.tag.hex(),
      paramDollar: syntax.regexp.hex(),
      paramValue: syntax.regexp.hex(),
      namespace: syntax.special.hex(),
    },
  });
};

export const ayuDarkTheme = () => {
  const { syntax } = mirage;
  return createCypherTheme({
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
      comment: syntax.comment.hex(),
      keyword: syntax.keyword.hex(),
      keywordLiteral: syntax.keyword.hex(),
      label: syntax.entity.hex(),
      predicateFunction: syntax.func.hex(),
      function: syntax.func.hex(),
      procedure: syntax.func.hex(),
      stringLiteral: syntax.string.hex(),
      numberLiteral: syntax.constant.hex(),
      booleanLiteral: syntax.constant.hex(),
      operator: syntax.operator.hex(),
      property: syntax.tag.hex(),
      paramDollar: syntax.regexp.hex(),
      paramValue: syntax.regexp.hex(),
      namespace: syntax.special.hex(),
    },
  });
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
