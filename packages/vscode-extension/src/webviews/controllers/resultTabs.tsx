import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ResultMessage } from '../resultPanel';

interface vscode {
  postMessage(message: ResultsTabMessage): void;
}

declare const vscode: vscode;

type ResultRows = Record<string, unknown>[];

type ResultState = {
  statement: string;
  state: 'executing' | 'error' | ResultRows;
}[];

export type ResultsTabMessage = {
  type: 'resultsWindowLoaded';
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderRow(keys: any[], row: Record<string, unknown>) {
  return (
    <tr>
      {keys.map((key) => {
        return (
          <td>
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
    return <p>No records returned</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          {Object.keys(rows[0]).map((key) => (
            <th>{key.toString()}</th>
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

export function getResultContent(res: ResultRows) {
  return renderTable(res);

  //   <div class="summary">${querySummary(res)
  //     .map((str) => `<p>${str}</p>`)
  //     .join('\n')}</div>
  // ;
}

function renderStatementResult(value: number, result: ResultState) {
  return result.map((r, i) => {
    if (r.state === 'executing') {
      return (
        <CustomTabPanel value={value} index={i}>
          <p>Executing query {r.statement}</p>
        </CustomTabPanel>
      );
    } else if (r.state === 'error') {
      return (
        <CustomTabPanel value={value} index={i}>
          <p>Error executing query {r.statement}</p>
        </CustomTabPanel>
      );
    } else {
      const queryResult: ResultRows = r.state;
      return (
        <div>
          <details>
            <summary>Query Details</summary>
            <pre>{r.statement}</pre>
          </details>
          {getResultContent(queryResult)}
        </div>
      );
    }
  });
}

export function ResultTabs() {
  const [statementResults, setStatementResults] = useState<ResultState>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const message = event.data as ResultMessage;

      if (message.type === 'beginStatementsExecution') {
        const resultState: ResultState = message.statements.map((statement) => {
          return {
            statement: statement,
            state: 'executing',
          };
        });
        setStatementResults(resultState);
      } else if (message.type === 'successfulExecution') {
        setStatementResults((prev) => {
          const i = message.index;
          const newState = [...prev];
          newState[i].state = message.result;
          return newState;
        });
      }
    };

    window.addEventListener('message', handleMessage);
    vscode.postMessage({ type: 'resultsWindowLoaded' });

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {statementResults.map((result, i) => {
            return <Tab label={result.statement} {...a11yProps(i)} />;
          })}
        </Tabs>
      </Box>
      {renderStatementResult(value, statementResults)}
    </Box>
  );
}

createRoot(document.getElementById('resultDiv')).render(<ResultTabs />);
