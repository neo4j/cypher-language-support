import { useState } from 'react';
import { CypherEditor } from 'react-codemirror-experimental';
import { TokenTable } from './TokenTable';

export function App() {
  const [value, setValue] = useState(
    `MATCH (n:Person)
WHERE n.name = "Steve" 
RETURN n 
LIMIT 12;`,
  );

  return (
    <div className="flex justify-center mt-5">
      <div className="auto min-w-[500px] w-3/6 max-w-3xl flex flex-col gap-5 bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl">Cypher Codemirror Demo</h1>
        <CypherEditor value={value} setValue={setValue} />
        <TokenTable document={value} />
      </div>
    </div>
  );
}
