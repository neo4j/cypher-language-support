import { useState } from 'react';
import { Editor } from './Editor';
import { TokenTable } from './language/TokenTable';

export function App() {
  const [value, setValue] = useState(
    'MATCH (n:Person) WHERE n.name = "Steve" RETURN n;',
  );

  return (
    <div className="App">
      <h1>Editor</h1>
      <div style={{ display: 'flex' }}>
        <Editor value={value} setValue={setValue} />
        <TokenTable document={value} />
      </div>
    </div>
  );
}
