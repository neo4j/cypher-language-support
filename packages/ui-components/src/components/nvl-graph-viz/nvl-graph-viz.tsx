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
import { IconButtonArray, Tooltip, IconButton } from '@neo4j-ndl/react';
import {
  FitToScreenIcon,
  MagnifyingGlassMinusIconOutline,
  MagnifyingGlassPlusIconOutline,
  SidebarLineRightIcon,
} from '@neo4j-ndl/react/icons';
import { DownloadButton } from '../shared/download-button';

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
  // TODO: store the last setting
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const handleZoomIn = () => {
    nvlRef.current?.setZoom(nvlRef.current.getScale() * 1.3);
  };

  const handleZoomOut = () => {
    nvlRef.current?.setZoom(nvlRef.current.getScale() * 0.7);
  };

  const handleZoomToFit = () => {
    nvlRef.current?.fit(
      currentNvlGraph.nodes.map((node) => node.id),
      {},
    );
  };

  const handleSidePanelToggle = () => {
    const newIsSidePanelOpen = !isSidePanelOpen;
    setIsSidePanelOpen(newIsSidePanelOpen);
  };

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

  const downloadables = [
    {
      title: 'Download as PNG',
      download: () => nvlRef.current?.saveToFile({}),
    },
  ];

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

        <div className="absolute right-2 top-[10px] z-10 flex flex-row gap-2">
          <DownloadButton
            downloadables={downloadables}
            floating
            buttonClassName="bg-palette-neutral-bg-weak"
          />
          <Tooltip placement="bottom" type="simple">
            <Tooltip.Trigger hasButtonWrapper>
              <IconButton
                size="small"
                onClick={handleSidePanelToggle}
                isFloating
                ariaLabel="Toggle node properties panel"
                className="bg-palette-neutral-bg-weak"
                htmlAttributes={{
                  'aria-pressed': isSidePanelOpen,
                }}
              >
                <SidebarLineRightIcon className="text-palette-neutral-text-weak" />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Content className="n-body-small">
              {isSidePanelOpen ? 'Close panel' : 'Open panel'}
            </Tooltip.Content>
          </Tooltip>
        </div>

        <IconButtonArray
          orientation="vertical"
          isFloating
          className="absolute bottom-2 right-2"
        >
          <Tooltip placement="left" type="simple">
            <Tooltip.Trigger hasButtonWrapper>
              <IconButton
                ariaLabel="Zoom in"
                size="small"
                isClean
                isGrouped
                onClick={handleZoomIn}
              >
                <MagnifyingGlassPlusIconOutline />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Content className="n-body-small">Zoom in</Tooltip.Content>
          </Tooltip>
          <Tooltip placement="left" type="simple">
            <Tooltip.Trigger hasButtonWrapper>
              <IconButton
                ariaLabel="Zoom out"
                size="small"
                isClean
                isGrouped
                onClick={handleZoomOut}
              >
                <MagnifyingGlassMinusIconOutline />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Content className="n-body-small">Zoom out</Tooltip.Content>
          </Tooltip>
          <Tooltip placement="left" type="simple">
            <Tooltip.Trigger hasButtonWrapper>
              <IconButton
                ariaLabel="Zoom to fit"
                size="small"
                isClean
                isGrouped
                onClick={handleZoomToFit}
              >
                <FitToScreenIcon />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Content className="n-body-small">
              Zoom to fit
            </Tooltip.Content>
          </Tooltip>
        </IconButtonArray>
      </div>
      {/* TODO: store the sidebar resize value */}
      <NvlSidePanel open={isSidePanelOpen} defaultWidth={150}>
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
