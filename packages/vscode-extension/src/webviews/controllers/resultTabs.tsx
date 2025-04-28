import { NvlGraphViz } from '@neo4j-cypher/ui-components';
import { Tabs } from '@neo4j-ndl/react';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Result, ResultMessage, ResultRows } from '../resultWindow';

const maxTabHeaderSize = 25;
interface vscode {
  postMessage(message: ResultsTabMessage): void;
}

declare const vscode: vscode;

type ResultState = {
  statement: string;
  state:
    | 'executing'
    | { type: 'error'; errorMessage: string }
    | { type: 'success'; result: Result };
}[];

export type ResultsTabMessage = {
  type: 'resultsWindowLoaded';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderRow(keys: any[], row: Record<string, unknown>) {
  return (
    <tr>
      {keys.map((key, i) => {
        return (
          <td key={i}>
            <pre>
              {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                JSON.stringify(row[key], null, 2)
              }
            </pre>
          </td>
        );
      })}
    </tr>
  );
}

function renderTable(rows: ResultRows) {
  if (rows.length === 0) {
    return <p id="query-empty-result">No records returned</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          {Object.keys(rows[0]).map((key, i) => (
            <th key={i}>{key.toString()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
          return renderRow(Object.keys(row), row);
        })}
      </tbody>
    </table>
  );
}

export function getResultContent(
  statement: string,
  result: Result,
  visualizationEnabled: boolean,
) {
  return (
    <div id="query-result">
      <details>
        <summary>Query Details</summary>
        <pre>{statement}</pre>
      </details>
      {visualizationEnabled ? (
        <NvlGraphViz
          nodes={result.nodes}
          relationships={result.relationships}
        />
      ) : (
        <>
          {renderTable(result.rows)}
          <div id="query-summary">
            {result.querySummary.map((str, i) => (
              <p key={i}>{str}</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function renderStatementResult(
  value: number,
  result: ResultState,
  visualizationEnabled: boolean,
) {
  return result.map((r, i) => {
    if (r.state === 'executing') {
      return (
        <Tabs.TabPanel
          className="n-flex n-flex-col n-gap-token-4 n-p-token-6"
          value={value}
          tabId={i}
          key={i}
        >
          <div id="query-executing">
            <p>Executing query {r.statement}</p>
          </div>
        </Tabs.TabPanel>
      );
    } else if (r.state.type === 'error') {
      return (
        <Tabs.TabPanel
          className="n-flex n-flex-col n-gap-token-4 n-p-token-6"
          value={value}
          tabId={i}
          key={i}
        >
          <div id="query-error">
            <p>Error executing query {r.statement}: </p>
            <p>{r.state.errorMessage}</p>
          </div>
        </Tabs.TabPanel>
      );
    } else {
      return (
        <Tabs.TabPanel
          className="n-flex n-flex-col n-gap-token-4 n-p-token-6"
          value={value}
          tabId={i}
          key={i}
        >
          {getResultContent(r.statement, r.state.result, visualizationEnabled)}
        </Tabs.TabPanel>
      );
    }
  });
}

function truncateTabName(statement: string) {
  if (statement.length > maxTabHeaderSize) {
    return statement.substring(0, maxTabHeaderSize) + '...';
  }
  return statement;
}

export function ResultTabs() {
  const [statementResults, setStatementResults] = useState<ResultState>([]);
  const [visualizationEnabled, setVisualizationEnabled] =
    useState<boolean>(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const message = event.data as ResultMessage;

      if (message.type === 'executing') {
        const resultState: ResultState = message.statements.map((statement) => {
          return {
            statement: statement,
            state: 'executing',
          };
        });
        setStatementResults(resultState);
      } else if (message.type === 'success') {
        setStatementResults((prev) => {
          const i = message.index;
          const newState = [...prev];
          newState[i].state = { type: 'success', result: message.result };
          return newState;
        });
      } else if (message.type === 'error') {
        setStatementResults((prev) => {
          const i = message.index;
          const newState = [...prev];
          newState[i].state = {
            type: 'error',
            errorMessage: message.errorMessage,
          };
          return newState;
        });
      } else if (message.type === 'configInit') {
        setVisualizationEnabled(Boolean(message.config.enableVisualization));
      }
    };

    window.addEventListener('message', handleMessage);
    vscode.postMessage({ type: 'resultsWindowLoaded' });

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  const [value, setValue] = React.useState(0);

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Tabs value={value} onChange={handleChange} className="label">
        {statementResults.map((result, i) => {
          return (
            <Tabs.Tab key={i} tabId={i}>
              {truncateTabName(result.statement)}
            </Tabs.Tab>
          );
        })}
      </Tabs>
      {renderStatementResult(value, statementResults, visualizationEnabled)}
    </div>
  );
}

createRoot(document.getElementById('resultDiv')).render(<ResultTabs />);
