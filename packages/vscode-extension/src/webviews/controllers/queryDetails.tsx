import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Collapsible } from '../../components/collapsible';
import {
  QueryResult,
  QueryResults,
  QueryResultsMessage,
} from '../queryResults/queryResultsTypes';
import { ColorThemeKind } from 'vscode';

interface vscode {
  postMessage(message: QueryResultsMessage): void;
  window: {
    activeColorTheme: {
      kind: ColorThemeKind;
    };
  };
}

declare const vscode: vscode;

const renderCollapsibleContent = (result: QueryResult) => {
  if (result.type === 'executing') {
    return 'Executing...';
  }
  if (result.type === 'error') {
    return result.errorMessage;
  }
  if (result.type === 'success') {
    return result.querySummary;
  }
  return null;
};

export function QueryDetails() {
  const [statementResults, setStatementResults] = useState<QueryResults>([]);
  const [openStatement, setOpenStatement] = useState<string>(null);

  const handleCollapsibleToggle = (statement: string) => {
    setOpenStatement(statement);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data as QueryResultsMessage;

      if (message.to !== 'detailsView') {
        return;
      }

      if (message.type === 'executionStart') {
        setStatementResults(message.result);
      } else if (message.type === 'executionUpdate') {
        setStatementResults((prev) => {
          const newState = [...prev];
          const index = newState.findIndex(
            (s) => s.statement === message.result.statement,
          );
          if (index !== -1) {
            newState[index] = message.result;
          }
          return newState;
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (statementResults.length > 0) {
      const lastStatement = statementResults[statementResults.length - 1];
      setOpenStatement(lastStatement.statement);
    }
  }, [statementResults]);

  useEffect(() => {
    if (openStatement !== null) {
      const selectedResult: QueryResult = statementResults.find(
        (result) => result.statement === openStatement,
      );
      if (selectedResult) {
        vscode.postMessage({
          type: 'visualizationUpdate',
          result: selectedResult,
          to: 'visualizationView',
        });
      }
    }
  }, [openStatement, statementResults]);

  return (
    <div>
      {statementResults.length > 0 ? (
        statementResults.map((result, i) => (
          <Collapsible
            key={i}
            title={result.statement}
            active={openStatement === result.statement}
            onToggle={() => handleCollapsibleToggle(result.statement)}
          >
            {renderCollapsibleContent(result)}
          </Collapsible>
        ))
      ) : (
        <div className="n-px-token-5 n-py-token-4">
          Run a Cypher query to see the details
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('queryDetails')).render(<QueryDetails />);
