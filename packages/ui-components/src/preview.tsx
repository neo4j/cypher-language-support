import '@neo4j-ndl/base/lib/neo4j-ds-styles.css';
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { NvlGraphViz } from './components/nvl-graph-viz/nvl-graph-viz';
import { BasicNode, BasicRelationship } from './utils/graph-viz-utils';

const rootElement = document.getElementById('root');

const mockNodes: BasicNode[] = [
  {
    id: '123',
    labels: ['Person'],
    properties: {
      name: 'John Doe',
      age: '30',
    },
    propertyTypes: {
      name: 'string',
      age: 'number',
    },
  },
  {
    id: '456',
    labels: ['Person'],
    properties: {
      name: 'John Doe',
      age: '30',
    },
    propertyTypes: {
      name: 'string',
      age: 'number',
    },
  },
];

const mockRelationships: BasicRelationship[] = [
  {
    id: '789',
    from: '123',
    to: '456',
    type: 'FRIENDS_WITH',
    properties: {
      since: '2020-01-01',
    },
    propertyTypes: {
      since: 'date',
    },
  },
];

if (rootElement !== null) {
  const root = ReactDOMClient.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <NvlGraphViz nodes={mockNodes} relationships={mockRelationships} />
    </React.StrictMode>,
  );
}
