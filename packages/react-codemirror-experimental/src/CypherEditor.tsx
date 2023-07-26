import CodeEditor from '@uiw/react-codemirror';
import React from 'react';
import { cypher } from './lang-cypher/lang-cypher';
import { basicNeo4jSetup } from './neo4j-setup';
import { ayuLightTheme } from './themes';

export const CypherEditor: typeof CodeEditor = React.forwardRef(
  (props, ref) => {
    const { extensions = [], ...rest } = props;
    return (
      <CodeEditor
        ref={ref}
        extensions={[
          basicNeo4jSetup(),
          ayuLightTheme(),
          cypher(),
          ...extensions,
        ]}
        basicSetup={false}
        {...rest}
      />
    );
  },
);
