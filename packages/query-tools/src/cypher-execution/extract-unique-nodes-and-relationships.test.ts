import type { Record } from 'neo4j-driver';
import { Node, Path, PathSegment, Relationship } from 'neo4j-driver';

import { describe, expect, test } from 'vitest';
import { extractUniqueNodesAndRels } from './extract-unique-nodes-and-relationships';

describe('extractNodesAndRels', () => {
  test('should map bolt records with a path to nodes and relationships', () => {
    const startNode = new Node(
      1,
      ['Person'],
      {
        prop1: 'prop1',
      },
      'node1',
    );
    const endNode = new Node(
      2,
      ['Movie'],
      {
        prop2: 'prop2',
      },
      'node2',
    );

    const relationship = new Relationship(
      3,
      1,
      2,
      'ACTED_IN',
      {},
      'rel1',
      'node1',
      'node2',
    );
    const pathSegment = new PathSegment(startNode, relationship, endNode);
    const path = new Path(startNode, endNode, [pathSegment]);

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const boltRecord = {
      keys: ['p'],
      get: () => path,
    } as unknown as Record;

    const { nodes, relationships } = extractUniqueNodesAndRels([boltRecord]);

    const [graphNodeStart] = nodes.filter(
      (node) => node.elementId.toString() === 'node1',
    );
    const [graphNodeEnd] = nodes.filter(
      (node) => node.elementId.toString() === 'node2',
    );
    const [firstRel] = relationships;

    if (
      graphNodeStart === undefined ||
      graphNodeEnd === undefined ||
      firstRel === undefined
    ) {
      throw new Error('Error in test data, got undefined');
    }

    expect(nodes.length).toBe(2);

    expect(graphNodeStart.labels).toEqual(['Person']);
    expect(graphNodeStart.properties).toEqual({ prop1: 'prop1' });

    expect(graphNodeEnd.labels).toEqual(['Movie']);
    expect(graphNodeEnd.properties).toEqual({ prop2: 'prop2' });
    expect(relationships.length).toBe(1);

    expect(firstRel.elementId.toString()).toEqual('rel1');
    expect(firstRel.startNodeElementId.toString()).toEqual('node1');
    expect(firstRel.endNodeElementId.toString()).toEqual('node2');
    expect(firstRel.type).toEqual('ACTED_IN');
    expect(firstRel.properties).toEqual({});
  });

  test('should deduplicate bolt records based on node id and filter out dangling relationships', () => {
    const node1 = new Node(
      1,
      ['Person'],
      {
        prop1: 'prop1',
      },
      'node1',
    );
    const node2 = new Node(
      1,
      ['Person'],
      {
        prop1: 'prop1',
      },
      'node1',
    );
    const relationship = new Relationship(
      2,
      1,
      34,
      'ACTED_IN',
      {},
      'rel1',
      'node1',
      'node34',
    );

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const boltRecord = {
      keys: ['n'],
      get: () => [node1, node2, relationship],
    } as unknown as Record;

    const { nodes, relationships, limitHit } = extractUniqueNodesAndRels([
      boltRecord,
    ]);
    expect(limitHit).toBe(false);
    expect(nodes.length).toBe(1);
    expect(relationships.length).toBe(0);
  });

  test('should respect the max nodes limit and filter out dangling relations', () => {
    const startNode = new Node(
      1,
      ['Person'],
      {
        prop1: 'prop1',
      },
      'node1',
    );
    const endNode = new Node(
      2,
      ['Movie'],
      {
        prop2: 'prop2',
      },
      'node2',
    );
    const relationship = new Relationship(
      3,
      1,
      2,
      'ACTED_IN',
      {},
      'rel1',
      'node1',
      'node2',
    );
    const pathSegment = new PathSegment(startNode, relationship, endNode);
    const path = new Path(startNode, endNode, [pathSegment]);

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const boltRecord = {
      keys: ['p'],
      get: () => path,
    } as unknown as Record;

    const { nodes, relationships, limitHit } = extractUniqueNodesAndRels(
      [boltRecord],
      { nodeLimit: 1 },
    );
    expect(limitHit).toBe(true);
    expect(nodes.length).toBe(1);
    const [graphNodeStart] = nodes;
    expect(graphNodeStart).toBeDefined();
    if (graphNodeStart === undefined) {
      throw new Error('Error in test data, got undefined');
    }
    expect(graphNodeStart.labels).toEqual(['Person']);
    expect(graphNodeStart.properties).toEqual({ prop1: 'prop1' });
    expect(relationships.length).toBe(0);
  });

  test('should respect the max nodes limit and not filter out dangling relations when asked to keep them', () => {
    const startNode = new Node(
      1,
      ['Person'],
      {
        prop1: 'prop1',
      },
      'node1',
    );
    const endNode = new Node(
      2,
      ['Movie'],
      {
        prop2: 'prop2',
      },
      'node2',
    );
    const relationship = new Relationship(
      3,
      1,
      2,
      'ACTED_IN',
      {},
      'rel1',
      'node1',
      'node2',
    );
    const pathSegment = new PathSegment(startNode, relationship, endNode);
    const path = new Path(startNode, endNode, [pathSegment]);

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const boltRecord = {
      keys: ['p'],
      get: () => path,
    } as unknown as Record;

    const { nodes, relationships, limitHit } = extractUniqueNodesAndRels(
      [boltRecord],
      {
        nodeLimit: 1,
        keepDanglingRels: true,
      },
    );
    expect(limitHit).toBe(true);
    expect(nodes.length).toBe(1);
    const [graphNodeStart] = nodes;
    expect(graphNodeStart).toBeDefined();
    if (graphNodeStart === undefined) {
      throw new Error('Error in test data, got undefined');
    }

    expect(graphNodeStart.labels).toEqual(['Person']);
    expect(graphNodeStart.properties).toEqual({ prop1: 'prop1' });
    expect(relationships.length).toBe(1);
  });

  test('should handle empty results', () => {
    const { nodes, relationships, limitHit } = extractUniqueNodesAndRels([]);
    expect(limitHit).toBe(false);
    expect(nodes.length).toBe(0);
    expect(relationships.length).toBe(0);
  });
});
