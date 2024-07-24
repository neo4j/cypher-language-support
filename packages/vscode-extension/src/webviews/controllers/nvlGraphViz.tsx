import { Node, Relationship } from '@neo4j-nvl/base';
import { BasicNvlWrapper } from '@neo4j-nvl/react';

export function NvlGraphViz({
  nodes,
  rels,
}: {
  nodes: Node[];
  rels: Relationship[];
}) {
  return (
    <div style={{ height: 500 }}>
      <BasicNvlWrapper
        nodes={nodes}
        rels={rels}
        layout="d3Force"
        nvlOptions={{
          useWebGL: false,
          disableWebGL: true,
          minZoom: 0.05,
          maxZoom: 3,
          relationshipThreshold: 0.55,
          instanceId: '1',
        }}
      />
    </div>
  );
}
