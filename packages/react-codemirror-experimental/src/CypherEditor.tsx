import CodeEditor from '@uiw/react-codemirror';
import React from 'react';
import { cypher } from './lang-cypher/lang-cypher';
import { basicNeo4jSetup } from './neo4j-setup';
import { neo4jLightTheme } from './neo4j-theme';

export const CypherEditor: typeof CodeEditor = React.forwardRef(
  (props, ref) => (
    <CodeEditor
      ref={ref}
      extensions={[basicNeo4jSetup(), neo4jLightTheme(), cypher()]}
      basicSetup={false}
      {...props}
    />
  ),
);
