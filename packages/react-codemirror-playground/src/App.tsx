import { DbSchema, testData } from '@neo4j-cypher/language-support';
import { CypherEditor } from '@neo4j-cypher/react-codemirror';
import { useMemo, useState } from 'react';
import { Tree } from 'react-d3-tree';
import { TokenTable } from './TokenTable';
import { getDebugTree } from './tree-util';

const demos = {
  allTokenTypes: `:clear;
MATCH (variable :Label)-[:REL_TYPE]->() 
WHERE variable.property = "String" 
    OR namespaced.function() = false
    // comment
    OR $parameter > 2 
RETURN variable;`,
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
  const [selectedDemoName, setSelectedDemoName] =
    useState<DemoName>('allTokenTypes');
  const [value, setValue] = useState<string>(demos[selectedDemoName]);
  const [showCodemirrorParse, setShowCodemirrorParse] = useState(false);
  const [showAntlrParse, setShowAntlrParse] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [commandRanCount, setCommandRanCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const [schema, setSchema] = useState<DbSchema>(testData.mockSchema);
  const [schemaText, setSchemaText] = useState<string>(
    JSON.stringify(testData.mockSchema, undefined, 2),
  );
  const [schemaError, setSchemaError] = useState<string | null>(null);

  const treeData = useMemo(() => {
    return getDebugTree(value);
  }, [value]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-blue-300 dark:bg-gray-700 dark:text-white">
        <div className="flex justify-center gap-10 pt-5 ">
          <div className="auto min-w-[500px] w-3/6 flex flex-col gap-5 bg-white dark:bg-gray-600 p-10 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl ">Cypher Codemirror Demo</h1>
              <button
                className="w-10 h-10"
                onClick={() => setShowConfigPanel((s) => !s)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="self-center w-full h-full text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex gap-1">
              {Object.keys(demos).map((demoName: DemoName) => (
                <button
                  key={demoName}
                  className={`hover:bg-blue-600 text-white font-bold py-1 px-3 rounded 
                ${
                  selectedDemoName === demoName ? 'bg-blue-600' : 'bg-blue-400'
                }`}
                  onClick={() => {
                    setSelectedDemoName(demoName);
                    setValue(demos[demoName]);
                  }}
                >
                  {demoName}
                </button>
              ))}
            </div>
            <CypherEditor
              className="text-sm border-2 border-gray-100 dark:border-gray-400"
              value={value}
              onChange={setValue}
              prompt="neo4j$"
              onExecute={() => setCommandRanCount((c) => c + 1)}
              theme={darkMode ? 'dark' : 'light'}
              history={Object.values(demos)}
              schema={schema}
            />

            {commandRanCount > 0 && (
              <span className="text-gray-400">
                "commands" ran so far: {commandRanCount}
              </span>
            )}
            {!!showCodemirrorParse && <TokenTable document={value} />}
          </div>
          {showConfigPanel && (
            <div className="auto min-w-[500px] w-2/6 flex flex-col gap-5 bg-white dark:bg-gray-600 p-10 rounded-lg shadow-lg">
              <h1 className="text-4xl">Options </h1>
              <label className="flex gap-1">
                <input
                  type="checkbox"
                  checked={showCodemirrorParse}
                  onChange={() => setShowCodemirrorParse((s) => !s)}
                />
                Show codemirror parsed tokens
              </label>
              <label className="flex gap-1">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode((l) => !l)}
                />
                Dark Mode
              </label>
              <label className="flex gap-1">
                <input
                  type="checkbox"
                  checked={showAntlrParse}
                  onChange={() => setShowAntlrParse((s) => !s)}
                />
                Show antlr parse tree
              </label>
              {schemaError && <div className="text-red-500">{schemaError}</div>}
              <textarea
                value={schemaText}
                className="min-h-[200px] dark:text-black"
                onChange={(v) => {
                  const value = v.target.value;
                  setSchemaText(value);
                  try {
                    const schema = JSON.parse(value) as DbSchema;
                    setSchema(schema);
                    setSchemaError(null);
                  } catch (e) {
                    setSchemaError(String(e));
                  }
                }}
              />
            </div>
          )}
        </div>
        {showAntlrParse && (
          <div id="treeWrapper" className="w-full h-screen">
            <Tree
              data={treeData}
              orientation="vertical"
              translate={{ x: document.body.clientWidth / 2, y: 50 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
