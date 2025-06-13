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
function renderRow(keys: any[], row: Record<string, unknown>) {
  return (
    <tr>
      {keys.map((key, i) => (
        <td key={i}>
          <pre>
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              JSON.stringify(row[key], null, 2)
            }
          </pre>
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
          {Object.keys(rows[0]).map((key) => (
            <th key={key}>{key.toString()}</th>
          ))}
        </tr>
      </thead>
      <tbody>{rows.map((row) => renderRow(Object.keys(row), row))}</tbody>
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
          renderTable(rows)
        ) : (
          <div className="vizWrapper-graph">
            <div
              style={{
                height: '700px',
                width: '700px',
              }}
            >
              <GraphVisualization nodes={nodes} rels={relationships} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
