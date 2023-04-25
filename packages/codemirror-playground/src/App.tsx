import { useState } from 'react';
import { Editor } from './Editor';
import { TokenTable } from './TokenTable';

export function App() {
  const [value, setValue] = useState(
    'MATCH (n:Person) WHERE n.name = "Steve" RETURN n;',
  );

  return (
    <div>
      <h1>Editor</h1>
      <div className="flex">
        <Editor value={value} setValue={setValue} />
        <TokenTable document={value} />
      </div>
    </div>
  );
}
