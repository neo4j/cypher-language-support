import { BasicNode, BasicRelationship } from './graph-viz-utils';

type GraphStatsLabels = Record<
  string,
  {
    count: number;
    properties: Record<string, string>;
  }
>;

type GraphStatsRelationshipTypes = Record<
  string,
  {
    count: number;
    properties: Record<string, string>;
  }
>;

export function getLabelStats(nodes: BasicNode[]): GraphStatsLabels {
  const labelStats: GraphStatsLabels = {};
  labelStats['*'] = { count: nodes.length, properties: {} };

  nodes.forEach((node) => {
    node.labels.forEach((label) => {
      if (label !== '*') {
        if (!labelStats[label]) {
          labelStats[label] = { count: 0, properties: {} };
        }

        labelStats[label].count += 1;
        labelStats[label].properties = {
          ...labelStats[label].properties,
          ...node.propertyTypes,
        };
      }
    });
  });

  return labelStats;
}

export function getRelTypeStats(
  relationships: BasicRelationship[],
): GraphStatsRelationshipTypes {
  const relTypeStats: GraphStatsRelationshipTypes = {};

  relationships.forEach((rel) => {
    if (relTypeStats['*']) {
      relTypeStats['*'].count += 1;
    } else {
      relTypeStats['*'] = {
        count: 1,
        properties: {},
      };
    }
    const currentRelTypeStats = relTypeStats[rel.type];
    if (currentRelTypeStats) {
      currentRelTypeStats.count += 1;
      currentRelTypeStats.properties = {
        ...currentRelTypeStats.properties,
        ...rel.propertyTypes,
      };
    } else {
      relTypeStats[rel.type] = {
        count: 1,
        properties: rel.propertyTypes,
      };
    }
  });

  return relTypeStats;
}

export const sortAlphabetically = (a: string, b: string) =>
  a.toLowerCase().localeCompare(b.toLowerCase());
