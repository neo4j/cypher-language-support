import React from 'react';
import { ResultRows } from '../webviews/queryResults/queryResultsTypes';
import { InteractiveNvlWrapper } from '@neo4j-nvl/react';
import {
  Node as NvlNode,
  Relationship as NvlRelationship,
} from '@neo4j-nvl/base';
import { SegmentedControl } from '@neo4j-ndl/react';

type VizWrapperProps = {
  rows: ResultRows;
  nodes: NvlNode[];
  relationships: NvlRelationship[];
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
            <InteractiveNvlWrapper
              nodes={nodes}
              rels={relationships}
              layout="d3Force"
              style={{
                height: 'calc(100vh - 20px)',
              }}
              nvlOptions={{
                useWebGL: false,
                disableWebGL: true,
                minZoom: 0.05,
                maxZoom: 3,
                relationshipThreshold: 0.55,
                disableTelemetry: true,
              }}
              interactionOptions={{
                selectOnClick: true,
              }}
              mouseEventCallbacks={{
                onPan: true,
                onZoom: true,
                onDrag: true,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
