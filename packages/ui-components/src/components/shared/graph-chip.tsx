import { GraphLabel } from '@neo4j-ndl/react';
// import { calculateDefaultNodeColors } from '@nx/word-color';
import React from 'react';
import { GraphStyling } from '../../utils/styling-types';

const getChipBackgroundColor = (
  type: string,
  chipType: 'node' | 'relationship' | 'propertyKey',
  graphStyling?: GraphStyling,
) => {
  if (chipType === 'propertyKey') {
    return undefined;
  }

  const relStyle = graphStyling?.relationship[type];

  if (chipType === 'relationship') {
    return relStyle?.color ?? graphStyling?.relationship['*']?.color;
  }

  const nodeStyle = graphStyling?.node[type];
  if (nodeStyle?.color !== undefined) {
    const { color } = nodeStyle;
    return color;
  }

  return undefined;

  // return calculateDefaultNodeColors(type).backgroundColor;
};

type GraphChipProps = {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  count?: number;
  type: 'node' | 'relationship' | 'propertyKey';
  className?: string;
  tabIndex?: number;
  graphStyling: GraphStyling;
};
export function GraphChip({
  label,
  onClick,
  count,
  type,
  className,
  tabIndex,
  graphStyling,
  ...props
}: GraphChipProps) {
  const backgroundColor = getChipBackgroundColor(label, type, graphStyling);
  return (
    <GraphLabel
      {...props}
      type={type}
      color={backgroundColor}
      onClick={onClick}
      // temporary solution for https://trello.com/c/RXDGyUer
      className={`${className ?? ''} ${onClick ? '' : 'pointer-events-none'}`}
      htmlAttributes={{
        tabIndex: tabIndex ?? 0,
      }}
    >
      {label} {count !== undefined && `(${count})`}
    </GraphLabel>
  );
}
