import {
  GraphVisualization,
  NeoNode,
  NeoRel,
  SegmentedControl,
} from '@neo4j-ndl/react';
import React from 'react';
import { ResultRows } from '../webviews/queryResults/queryResultsTypes';

type VizWrapperProps = {
  rows: ResultRows;
  nodes: NeoNode[];
  relationships: NeoRel[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderRow(keys: any[], row: Record<string, unknown>, index: number) {
  return (
    <tr>
      <td>{index}</td>
      {keys.map((key, i) => (
        <td key={i}>
          <div className="vizWrapper-table-cell n-code">
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              JSON.stringify(row[key], null, 2)
            }
          </div>
        </td>
      ))}
    </tr>
  );
}

function renderTable(rows: ResultRows) {
  if (rows.length === 0) {
    return 'No records returned';
  }

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {Object.keys(rows[0]).map((key) => (
            <th key={key}>{key.toString()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => renderRow(Object.keys(row), row, i + 1))}
      </tbody>
    </table>
  );
}

export const VizWrapper: React.FC<VizWrapperProps> = ({
  rows,
  nodes,
  relationships,
}) => {
  const isTableOnly = nodes.length === 0 && relationships.length === 0;
  const [selectedView, setSelectedView] = React.useState(
    isTableOnly ? 'table' : 'graph',
  );

  return (
    <div className="vizWrapper">
      <div className="vizWrapper-content">
        {!isTableOnly && (
          <div
            className={`vizWrapper-controls ${
              selectedView === 'table' ? 'block' : ''
            }`}
          >
            <SegmentedControl
              onChange={(e) => {
                setSelectedView(e);
              }}
              size="small"
              selected={selectedView}
            >
              <SegmentedControl.Item value="graph">Graph</SegmentedControl.Item>
              <SegmentedControl.Item value="table">Table</SegmentedControl.Item>
            </SegmentedControl>
          </div>
        )}
        {selectedView === 'table' ? (
          <div className="vizWrapper-table">{renderTable(rows)}</div>
        ) : (
          <div className="vizWrapper-graph">
            <GraphVisualization nodes={nodes} rels={relationships} />
          </div>
        )}
      </div>
    </div>
  );
};
