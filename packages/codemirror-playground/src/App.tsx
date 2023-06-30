import { CypherEditor } from '@neo4j-cypher/react-codemirror-experimental';
import { useMemo, useState } from 'react';
import { Tree } from 'react-d3-tree';
import { TokenTable } from './TokenTable';
import { getDebugTree } from './tree-util';

const demos = {
  allTokenTypes: `MATCH (variable: Label)-[:REL_TYPE]->() 
WHERE variable.property = "String" 
    OR namespaced.function() = false
    // comment
    OR $parameter > 2 
RETURN variable`,
  basic: `MATCH (n:Person)
WHERE n.name = "Steve" 
RETURN n 
LIMIT 12;`,
  subqueries: `UNWIND range(1,100) as _
CALL {
  MATCH (source:object) WHERE source.id= $id1
  MATCH (target:object) WHERE target.id= $id2
  MATCH path = (source)-[*1..10]->(target)
  WITH path, reduce(weight = 0, r IN relationships(path) | weight + r.weight) as Weight
  ORDER BY Weight LIMIT 3
  RETURN length(path) as l, Weight 
} 
RETURN count(*)`,
  createDatabase: `CREATE DATABASE testdb OPTIONS {existingData: 'use', seedURI:'s3://bucketpath', seedConfig: 'region=eu-west-1', seedCredentials: 'foo;bar'};`,
} as const;

type DemoName = keyof typeof demos;
export function App() {
  const [selectedDemoName, setSelectedDemoName] = useState<DemoName>('basic');
  const [value, setValue] = useState<string>(demos[selectedDemoName]);
  const [showCodemirrorParse, setShowCodemirrorParse] = useState(false);

  const treeData = useMemo(() => {
    return getDebugTree(value);
  }, [value]);

  return (
    <div>
      <div className="flex justify-center mt-5">
        <div className="flex flex-col">
          <div className="auto min-w-[500px] w-3/6 flex flex-col gap-5 bg-white p-10 rounded-lg shadow-lg">
            <h1 className="text-4xl">Cypher Codemirror Demo </h1>
            <div className="flex">
              <span> cypher snippets</span>
              <select
                value={selectedDemoName}
                onChange={(e) => {
                  const demoName = e.target.value as DemoName;
                  setSelectedDemoName(demoName);
                  setValue(demos[demoName]);
                }}
              >
                {Object.keys(demos).map((demoName) => (
                  <option key={demoName} value={demoName}>
                    {demoName}
                  </option>
                ))}
              </select>
            </div>
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
