import NVL, { Relationship } from '@neo4j-nvl/base';
import { InteractiveNvlWrapper } from '@neo4j-nvl/react';
import cx from 'classnames';
import React, { useMemo, useRef, useState } from 'react';
import {
  BasicNode,
  basicNodesToNvlNodes,
  BasicRelationship,
  basicRelationshipToNvlRelationship,
} from '../../utils/graph-viz-utils';
import { NvlDetailsPanel } from './nvl-details-pane';
import { NvlOverviewPane } from './nvl-overview-pane';
import { NvlSidePanel } from './nvl-side-panel';
import './nvl-styles.css';

const graphStyling = { node: {}, relationship: {}, stylingPrecedence: [] };

export const NvlGraphViz = (currentGraph: {
  nodes: BasicNode[];
  relationships: BasicRelationship[];
  fullscreen?: boolean;
  limitHit?: boolean;
}) => {
  const nvlRef = useRef<NVL>(null);
  const [selected, setSelected] = useState<
    { type: 'node' | 'relationship'; id: string } | undefined
  >(undefined);

  const handleNodeClick = (nodeIds: string | string[]) => {
    const id = Array.isArray(nodeIds) ? nodeIds[0] : nodeIds;
    if (id !== undefined) {
      setSelected({ type: 'node', id });
    }
  };

  const handleRelationshipClick = (relationshipIds: string | string[]) => {
    const id = Array.isArray(relationshipIds)
      ? relationshipIds[0]
      : relationshipIds;

    if (id !== undefined) {
      setSelected({ type: 'relationship', id });
    }
  };

  const resetSelection = () => {
    setSelected(undefined);
  };

  const currentNvlGraph = useMemo(() => {
    return {
      nodes: basicNodesToNvlNodes(currentGraph.nodes, graphStyling),
      relationships: basicRelationshipToNvlRelationship(
        currentGraph.relationships,
        graphStyling,
      ),
    };
  }, [currentGraph]);

  const currentNvlGraphNodesWithSelected = useMemo(() => {
    return currentNvlGraph.nodes.map((node: BasicNode) => {
      if (!selected || selected.type === 'relationship') {
        return node;
      }
      if (selected?.id === node.id) {
        return {
          ...node,
          selected: true,
        };
      }
      return node;
    });
  }, [currentNvlGraph.nodes, selected]);

  const currentNvlGraphRelationshipsWithSelected: Relationship[] =
    useMemo(() => {
      return currentNvlGraph.relationships.map(
        (relationship: BasicRelationship) => {
          if (!selected || selected.type === 'node') {
            return relationship;
          }

          if (selected.id === relationship.id) {
            return {
              ...relationship,
              selected: true,
            } as BasicRelationship & { selected: boolean };
          }
          return relationship;
        },
      );
    }, [currentNvlGraph.relationships, selected]);

  const selectedItem = useMemo(() => {
    if (selected === undefined) {
      return undefined;
    }
    if (selected.type === 'node') {
      return currentGraph.nodes.find((node) => node.id === selected.id);
    }
    return currentGraph.relationships.find(
      (relationship) => relationship.id === selected.id,
    );
  }, [selected, currentGraph]);

  return (
    <div
      className={cx(
        'border-palette-neutral-border-weak flex w-full flex-row overflow-hidden rounded-lg border bg-palette-neutral-bg-weak text-palette-neutral-text-default',
        currentGraph.fullscreen === true ? '' : 'h-[500px]',
      )}
    >
      <div className="cursor relative w-full min-w-[325px] bg-palette-neutral-bg-default">
        <InteractiveNvlWrapper
          nodes={currentNvlGraphNodesWithSelected}
          rels={currentNvlGraphRelationshipsWithSelected}
          layout={'d3Force'}
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
            onNodeClick: (clickedNode) => {
              handleNodeClick(clickedNode.id);
            },
            onRelationshipClick: (clickedRelationship) => {
              handleRelationshipClick(clickedRelationship.id);
            },
            // TODO: add onNodeDoubleClick, onRelationshipRightClick, onNodeRightClick, and onCanvasRightClick
            onCanvasClick: () => {
              resetSelection();
            },
            onPan: true,
            onZoom: true,
            onDrag: true,
          }}
          // TODO: add nvlCallbacks
          ref={nvlRef}
        />
      </div>
      {/* TODO: add UI controls and controlling the sidebar resize */}
      <NvlSidePanel open={true} defaultWidth={150}>
        {selectedItem !== undefined ? (
          <NvlDetailsPanel
            inspectedItem={selectedItem}
            paneWidth={400}
            enableStylePicker={true}
            graphStyling={graphStyling}
          />
        ) : (
          <NvlOverviewPane
            nodes={currentGraph.nodes}
            limitHit={currentGraph.limitHit}
            relationships={currentGraph.relationships}
            graphStyling={graphStyling}
            enableStylePicker={true}
          />
        )}
      </NvlSidePanel>
    </div>
  );
};
