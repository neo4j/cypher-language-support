import { CypherEditor } from '@neo4j-cypher/react-codemirror-experimental';
import { getDebugTree } from 'language-support';
import { useMemo, useState } from 'react';
import { Tree } from 'react-d3-tree';
import { TokenTable } from './TokenTable';

export function App() {
  const [value, setValue] = useState(
    `MATCH (n:Person)
WHERE n.name = "Steve" 
RETURN n 
LIMIT 12;`,
  );
  const [showCodemirrorParse, setShowCodemirrorParse] = useState(false);

  const treeData = useMemo(() => {
    return getDebugTree(value);
  }, [value]);

  return (
    <div>
      <div className="flex justify-center mt-5">
        <div className="flex flex-col">
          <div className="auto min-w-[500px] w-3/6 max-w-6xl flex flex-col gap-5 bg-white p-10 rounded-lg shadow-lg">
            <h1 className="text-4xl">Cypher Codemirror Demo </h1>
            <CypherEditor
              className="border-2 border-gray-100"
              value={value}
              onChange={setValue}
            />
            <label className="flex gap-1">
              <input
                type="checkbox"
                checked={showCodemirrorParse}
                onChange={() => setShowCodemirrorParse((s) => !s)}
              />
              Show codemirror parse
            </label>
            {!!showCodemirrorParse && <TokenTable document={value} />}
          </div>
        </div>
      </div>
      <div id="treeWrapper" className="w-full h-screen">
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: document.body.clientWidth / 2, y: 50 }}
        />
      </div>
    </div>
  );
}
