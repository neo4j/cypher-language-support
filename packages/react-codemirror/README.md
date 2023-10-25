# React Codemirror

This package can be built with `npm run build` and then published to npm with `npm publish`.

## Usage

`npm install @neo4j-cypher/reactcodemirror`

```tsx
import { useState } from 'react';

import { CypherEditor } from '@neo4j-cypher/react-codemirror@next';

export function CodeEditor() {
  const [value, setValue] = useState('');
  // can be used to access underlying codemirror state or call for example `focus`
  const editorRef = useRef<CypherEditor>(null);

  return <CypherEditor value={value} onChange={setValue} ref={editorRef} />;
}
```

For a full example, see the [react-codemirror-playground](../react-codemirror-playground).

## Usage without react

Currently we only support using the codemirror editor via the react wrapper, but we plan to release the codemirror extensions separately as well.

### Completion Icons

We use unmodified copies of Visual Studio Code Icons from microsofts repository [here](https://github.com/microsoft/vscode-icons) licensed under creative commons.
