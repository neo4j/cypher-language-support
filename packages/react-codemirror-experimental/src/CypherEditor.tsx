import CodeEditor, { basicSetup } from '@uiw/react-codemirror';
import React from 'react';
import { cypher } from './lang-cypher/lang-cypher';

export const CypherEditor: typeof CodeEditor = React.forwardRef((props) => (
  <CodeEditor
    extensions={[basicSetup(), cypher()]}
    indentWithTab={true}
    {...props}
  />
));
