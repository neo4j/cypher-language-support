# React Codemirror

This package can be built with `pnpm build` and then published to npm with `pnpm publish`.

## Usage

`npm install @neo4j-cypher/react-codemirror@next`

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

For a full example, see the [react-codemirror-playground](https://github.com/neo4j/cypher-language-support/tree/main/packages/react-codemirror-playground).

## Usage without react

Currently we only support using the codemirror editor via the react wrapper, but we plan to release the codemirror extensions separately as well.

## Learning codemirror

It can take a little time to get into the CodeMirror6 ways of thinking, Trevor Harmon has a [great blog post](https://thetrevorharmon.com/blog/learning-codemirror/) explaining the cm6 "primitives". He also has a demo on how to integrate ANTLR4 with codemirror over [here](https://github.com/thetrevorharmon/zephyr-demo).

### Completion Icons

We use unmodified copies of Visual Studio Code Icons from microsofts repository [here](https://github.com/microsoft/vscode-icons) licensed under creative commons.
