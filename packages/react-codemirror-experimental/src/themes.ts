import { createCypherTheme } from './lang-cypher/create-cypher-theme';

import { light } from 'ayu';

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
      cursor: '#000',
    },
    highlightStyles: {
      comment: syntax.comment.hex(),
      keyword: syntax.keyword.hex(),
      keywordLiteral: syntax.keyword.hex(),
      label: syntax.markup.hex(),
      predicateFunction: syntax.func.hex(),
      function: syntax.func.hex(),
      procedure: syntax.func.hex(),
      variable: syntax.entity.hex(),
      symbolicName: syntax.entity.hex(),
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
