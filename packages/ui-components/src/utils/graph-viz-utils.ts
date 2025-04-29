import type { Node, Relationship } from '@neo4j-nvl/base';
import { CaptionOption, GraphStyling } from './styling-types';

export type BasicNode = {
  id: string;
  labels: string[];
  properties: Record<string, string>;
  propertyTypes: Record<string, string>;
};

export type BasicRelationship = {
  id: string;
  from: string;
  to: string;
  type: string;
  properties: Record<string, string>;
  propertyTypes: Record<string, string>;
};

export const basicNodesToNvlNodes = (
  basicNodes: BasicNode[],
  styling: GraphStyling,
): Node[] => {
  return basicNodes.map((node): Node => {
    const [firstLabel] = [...node.labels];
    const defaultCaption = {
      value: getDefaultNodeCaption(node).defaultCaption,
    };

    const nvlNode: Node = {
      id: node.id,
      selected: false,
      captions: [defaultCaption],
      captionSize: 2,
      captionAlign: 'center',
    };

    if (firstLabel === undefined) {
      const noLabelGraphStyling = styling.node['*']?.color;
      nvlNode.color =
        noLabelGraphStyling ?? calculateDefaultNodeColors('*').backgroundColor;

      const noLabelSizeStyling = styling.node['*']?.size;
      nvlNode.size = noLabelSizeStyling ?? 28;
      return nvlNode;
    }

    const nodeStyles = {
      color: calculateDefaultNodeColors(firstLabel).backgroundColor,
      size: 28,
    };

    const { highestPriorityLabel } = node.labels.reduce<{
      highestPriority: number;
      highestPriorityLabel?: string;
    }>(
      (acc, label) => {
        const labelStyling = styling.node[label];
        if (
          labelStyling?.priority !== undefined &&
          labelStyling.priority > acc.highestPriority
        ) {
          return {
            highestPriority: labelStyling.priority,
            highestPriorityLabel: label,
          };
        }
        return acc;
      },
      { highestPriority: -1, highestPriorityLabel: node.labels[0] },
    );

    if (highestPriorityLabel !== undefined) {
      const labelStyling = styling.node[highestPriorityLabel];
      if (labelStyling) {
        nodeStyles.color =
          labelStyling.color ??
          calculateDefaultNodeColors(highestPriorityLabel).backgroundColor;
        nodeStyles.size = labelStyling.size ?? 28;

        const labelCaptions = labelStyling.captions;
        if (labelCaptions !== undefined) {
          nvlNode.captions = labelCaptions.map((caption) => {
            let captionValue: string;

            if (caption.type === 'id') {
              captionValue = node.id;
            } else if (caption.type === 'type') {
              captionValue = highestPriorityLabel;
            } else {
              const captionType = node.propertyTypes[caption.captionKey];
              captionValue = node.properties[caption.captionKey];
              if (captionValue === undefined) {
                return { value: '' };
              }
              if (captionType === 'String') {
                captionValue = captionValue.slice(1, -1);
              }
            }
            return { value: captionValue };
          });
        }
      }
    }
    nvlNode.color = nodeStyles.color;
    nvlNode.size = nodeStyles.size;
    return nvlNode;
  });
};

export const basicRelationshipToNvlRelationship = (
  relationships: BasicRelationship[],
  styling: GraphStyling,
): Relationship[] => {
  return relationships.map((relationship): Relationship => {
    const nvlRelation: Relationship = {
      id: relationship.id,
      to: relationship.to,
      from: relationship.from,
      selected: false,
      captions: [{ value: relationship.type }],
    };

    const relationshipStyling = {
      color: styling.relationship['*']?.color ?? '#A5ABB6',
      width: styling.relationship['*']?.width ?? 1,
    };

    const relationshipColor: string | undefined =
      styling.relationship[relationship.type]?.color;
    if (relationshipColor !== undefined) {
      relationshipStyling.color = relationshipColor;
    }

    const relationshipWidth = styling.relationship[relationship.type]?.width;
    if (relationshipWidth !== undefined) {
      relationshipStyling.width = relationshipWidth;
    }

    const typeCaptions = styling.relationship[relationship.type]?.captions;

    if (typeCaptions !== undefined) {
      nvlRelation.captions = typeCaptions.map((caption) => {
        let captionValue: string;

        if (caption.type === 'id') {
          captionValue = relationship.id;
        } else if (caption.type === 'type') {
          captionValue = relationship.type;
        } else {
          const captionType = relationship.propertyTypes[caption.captionKey];
          captionValue = relationship.properties[caption.captionKey];
          if (captionValue === undefined) {
            return { value: '' };
          }
          if (captionType === 'String') {
            captionValue = captionValue.slice(1, -1);
          }
        }
        return { value: captionValue };
      });
    }

    nvlRelation.color = relationshipStyling.color;
    nvlRelation.width = relationshipStyling.width;
    return nvlRelation;
  });
};

export const captionPriorityOrder = [
  /^name$/i,
  /^title$/i,
  /^label$/i,
  /name$/i,
  /description$/i,
  /^.+/,
];

type CalcOptions = {
  lightMax?: number;
  lightMin?: number;
  chromaMax?: number;
  chromaMin?: number;
};

// TODO: Implement this function to calculate the colors
export function calculateDefaultNodeColors(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  nodeLabel: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config?: CalcOptions,
): {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
} {
  return {
    backgroundColor: '#cd32a0',
    borderColor: '#8a226c',
    textColor: '#2A2C34',
  };
}

export const getAllAvailableNodeCaptions = (
  properties: Record<string, string>,
): CaptionOption[] => {
  const captions: CaptionOption[] = Object.keys(properties).map((property) => ({
    type: 'property',
    captionKey: property,
  }));

  return [...captions, { type: 'id' }, { type: 'type' }];
};

export function getDefaultCaptionKey(
  options: CaptionOption[],
): CaptionOption | undefined {
  const captionKeys = options
    .filter((option) => option.type === 'property')
    .map((option) => ('captionKey' in option ? option.captionKey : undefined));

  for (const regex of captionPriorityOrder) {
    const matchingKey = captionKeys.find((key) => regex.test(key));
    if (matchingKey !== undefined) {
      return {
        type: 'property',
        captionKey: matchingKey,
      };
    }
  }

  const typeOption = options.find((option) => option.type === 'type');
  if (typeOption) {
    return typeOption;
  }

  return options.find((option) => option.type === 'id');
}

export const getDefaultNodeCaption = (
  item: BasicNode,
): { defaultCaption: string } => {
  const defaultCaptionKey = getDefaultCaptionKey(
    getAllAvailableNodeCaptions(item.properties),
  );

  if (defaultCaptionKey?.type === 'property') {
    const caption = item.properties[defaultCaptionKey.captionKey];
    const captionType = item.propertyTypes[defaultCaptionKey.captionKey];

    if (captionType === 'String' && caption !== undefined) {
      return {
        // Remove quotes from string
        defaultCaption: caption.slice(1, -1),
      };
    }

    if (caption !== undefined) {
      return {
        defaultCaption: caption,
      };
    }
  }

  const [firstLabel] = item.labels;
  if (defaultCaptionKey?.type === 'type' && firstLabel !== undefined) {
    return {
      defaultCaption: firstLabel,
    };
  }

  return {
    defaultCaption: item.id,
  };
};
