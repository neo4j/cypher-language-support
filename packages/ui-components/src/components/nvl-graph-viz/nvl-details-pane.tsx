import { Typography } from '@neo4j-ndl/react';
import React, { useMemo } from 'react';
import { BasicNode, BasicRelationship } from '../../utils/graph-viz-utils';
import { GraphStyling } from '../../utils/styling-types';
import { ClipboardCopier } from '../shared/clipboard-copier';
import { GraphChip } from '../shared/graph-chip';
import { PropertiesTableNvl } from './nvl-properties-table';
import { NvlSidePanel } from './nvl-side-panel';

type NvlDetailsPanelProps = {
  inspectedItem: BasicNode | BasicRelationship;
  paneWidth: number;
  enableStylePicker: boolean;
  graphStyling: GraphStyling;
};
const sortAlphabetically = (a: string, b: string) =>
  a.toLowerCase().localeCompare(b.toLowerCase());

const isNode = (item: BasicNode | BasicRelationship): item is BasicNode => {
  return !('from' in item) && !('to' in item);
};

export function NvlDetailsPanel({
  inspectedItem,
  paneWidth,
  graphStyling,
}: NvlDetailsPanelProps) {
  const inspectedItemType = isNode(inspectedItem) ? 'node' : 'relationship';
  const properties = [
    {
      key: '<id>',
      value: `${inspectedItem.id}`,
      type: 'String',
    },
    ...Object.keys(inspectedItem.properties).map((key) => {
      const value = inspectedItem.properties[key];
      const type = inspectedItem.propertyTypes[key];
      return { key: key, value: value ?? '', type: type ?? '' };
    }),
  ];

  const labelsSorted = useMemo(() => {
    if (isNode(inspectedItem)) {
      return [...inspectedItem.labels].sort(sortAlphabetically);
    }
    return [];
  }, [inspectedItem]);

  return (
    <>
      <NvlSidePanel.Title>
        <Typography className="mr-auto" variant="h6">
          {inspectedItemType === 'node'
            ? 'Node details'
            : 'Relationship details'}
        </Typography>
        <ClipboardCopier
          textToCopy={properties
            .map((prop) => `${prop.key}: ${prop.value}`)
            .join('\n')}
          title="Copy all properties to clipboard"
          ariaLabel="Copy all properties to clipboard"
          iconButtonSize="small"
        />
      </NvlSidePanel.Title>
      <NvlSidePanel.Content>
        <div className="mx-4 flex flex-row flex-wrap gap-2">
          {isNode(inspectedItem) ? (
            labelsSorted.map((label) => (
              <GraphChip
                type="node"
                label={label}
                key={`node ${label}`}
                graphStyling={graphStyling}
              />
            ))
          ) : (
            <GraphChip
              type="relationship"
              label={inspectedItem.type}
              key={`relationship ${inspectedItem.type}`}
              graphStyling={graphStyling}
            />
          )}
        </div>
        {/* Divider */}
        <div className="bg-palette-neutral-border-weak my-3 h-px w-full" />
        <PropertiesTableNvl
          propertiesWithTypes={properties}
          paneWidth={paneWidth}
        />
      </NvlSidePanel.Content>
    </>
  );
}
