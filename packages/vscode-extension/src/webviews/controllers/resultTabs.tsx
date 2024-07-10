import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

interface vscode {
  postMessage(message: ResultsTabMessage): void;
}

declare const vscode: vscode;

interface StatementResult {
  statement: string;
  status: 'executing';
}

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

function renderStatementResult(result: StatementResult) {
  if (result.status === 'executing') {
    return <p>Executing query {result.statement}</p>;
  } else {
    return <p>Error executing query {result.statement}</p>;
  }
}

export function ResultTabs() {
  const [statementResults, setStatementResults] = useState<StatementResult[]>(
    [],
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log(`handling message ${Date.now()}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const message = event.data;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (message.type === 'beginStatementsExecution') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setStatementResults(message.statementResults);
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
      {statementResults.map((result, index) => (
        <CustomTabPanel value={value} index={index}>
          {renderStatementResult(result)}
        </CustomTabPanel>
      ))}
    </Box>
  );
}

createRoot(document.getElementById('resultDiv')).render(<ResultTabs />);
