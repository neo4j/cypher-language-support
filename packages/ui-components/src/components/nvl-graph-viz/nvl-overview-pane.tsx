import React, { useMemo } from 'react';
import {
  getLabelStats,
  getRelTypeStats,
  sortAlphabetically,
} from '../../utils/graph-stats-utils';
import { BasicNode, BasicRelationship } from '../../utils/graph-viz-utils';
import { GraphStyling } from '../../utils/styling-types';
import { GraphChip } from '../shared/graph-chip';
import { ShowAll } from '../shared/show-all';
import { NvlSidePanel } from './nvl-side-panel';

export const OVERVIEW_STEP_SIZE = 25;

type OverviewPaneNvlProps = {
  nodes: BasicNode[];
  relationships: BasicRelationship[];
  limitHit: boolean;
  enableStylePicker: boolean;
  graphStyling: GraphStyling;
};

export function NvlOverviewPane({
  nodes,
  relationships,
  graphStyling,
}: OverviewPaneNvlProps): JSX.Element {
  const labelsSorted = useMemo(() => {
    const labelStats = getLabelStats(nodes);
    return Object.entries(labelStats).sort((a, b) =>
      sortAlphabetically(a[0], b[0]),
    );
  }, [nodes]);

  const relationshipsSorted = useMemo(() => {
    const relTypeStats = getRelTypeStats(relationships);
    return Object.entries(relTypeStats).sort((a, b) =>
      sortAlphabetically(a[0], b[0]),
    );
  }, [relationships]);

  return (
    <>
      <NvlSidePanel.Title>
        <h6>Results overview</h6>
      </NvlSidePanel.Title>
      <NvlSidePanel.Content>
        <div className="mx-4 flex flex-col gap-2">
          {labelsSorted.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>Nodes{` (${nodes.length.toLocaleString()})`}</span>
              </div>
              {
                // TODO: Add limit hit message
              }
              <div className="flex flex-row flex-wrap gap-x-1.5 gap-y-1 leading-tight">
                <ShowAll initiallyShown={OVERVIEW_STEP_SIZE} isButtonGroup>
                  {labelsSorted.map(
                    ([label, { count }]) =>
                      function GraphChipWrapper() {
                        return (
                          <GraphChip
                            type="node"
                            key={label}
                            label={label}
                            count={count}
                            tabIndex={-1}
                            graphStyling={graphStyling}
                          />
                        );
                      },
                  )}
                </ShowAll>
              </div>
            </div>
          )}

          {relationshipsSorted.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm">
                Relationships{` (${relationships.length.toLocaleString()})`}
              </span>
              <div className="flex flex-row flex-wrap gap-x-1.5 gap-y-1 leading-tight">
                <ShowAll initiallyShown={OVERVIEW_STEP_SIZE} isButtonGroup>
                  {relationshipsSorted.map(([relType, { count }]) => (
                    <GraphChip
                      type="relationship"
                      key={relType}
                      label={relType}
                      count={count}
                      tabIndex={-1}
                      graphStyling={graphStyling}
                    />
                  ))}
                </ShowAll>
              </div>
            </div>
          )}
        </div>
      </NvlSidePanel.Content>
    </>
  );
}
