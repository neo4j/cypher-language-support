import { createCypherTheme } from './lang-cypher/create-cypher-theme';

import { light } from 'ayu';

export const ayuLightTheme = () => {
  const { syntax } = light;
  return createCypherTheme({
    dark: false,
    editorSettings: {
      background: '#ffffff',
      foreground: '#444444',
      gutterForeground: '#6c6c6c',
      cursor: '#000',
      selection: '#d7d4f0',
      textMatchingSelection: '#72a1ff59',
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
