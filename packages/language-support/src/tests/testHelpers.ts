import { SignatureInformation } from 'vscode-languageserver-types';
import { DbInfo } from '../dbInfo';

export class MockDbInfo implements DbInfo {
  public procedureSignatures: Map<string, SignatureInformation>;
  public functionSignatures: Map<string, SignatureInformation>;
  public labels: string[];
  public relationshipTypes: string[];

  constructor(
    labels: string[] = [],
    relationshipTypes: string[] = [],
    procedureSignatures: Map<string, SignatureInformation> = new Map(),
    functionSignatures: Map<string, SignatureInformation> = new Map(),
  ) {
    this.labels = labels;
    this.relationshipTypes = relationshipTypes;
    this.procedureSignatures = procedureSignatures;
    this.functionSignatures = functionSignatures;
  }
}

import { model } from '@neo4j/graph-schema-utils';

const { GraphSchemaRepresentation } = model;

export const mockGraphSchema: {
  graphSchemaRepresentation: model.GraphSchemaRepresentationJsonStruct;
} = {
  graphSchemaRepresentation: {
    version: '1.0.0',
    graphSchema: {
      nodeLabels: [
        { $id: 'nl:Movie', token: 'Movie' },
        { $id: 'nl:Person', token: 'Person' },
      ],
      relationshipTypes: [
        { $id: 'rt:ACTED_IN', token: 'ACTED_IN' },
        { $id: 'rt:REVIEWED', token: 'REVIEWED' },
        { $id: 'rt:PRODUCED', token: 'PRODUCED' },
        { $id: 'rt:WROTE', token: 'WROTE' },
        { $id: 'rt:FOLLOWS', token: 'FOLLOWS' },
        { $id: 'rt:DIRECTED', token: 'DIRECTED' },
      ],
      nodeObjectTypes: [
        {
          $id: 'n:Movie',
          labels: [{ $ref: '#nl:Movie' }],
          properties: [
            { token: 'tagline', type: { type: 'string' }, nullable: true },
            { token: 'title', type: { type: 'string' }, nullable: false },
            { token: 'released', type: { type: 'integer' }, nullable: false },
          ],
        },
        {
          $id: 'n:Person',
          labels: [{ $ref: '#nl:Person' }],
          properties: [
            { token: 'name', type: { type: 'string' }, nullable: false },
            { token: 'born', type: { type: 'integer' }, nullable: true },
          ],
        },
      ],
      relationshipObjectTypes: [
        {
          $id: 'r:ACTED_IN',
          type: { $ref: '#rt:ACTED_IN' },
          from: { $ref: '#n:Person' },
          to: { $ref: '#n:Movie' },
          properties: [
            {
              token: 'roles',
              type: { type: 'array', items: { type: 'string' } },
              nullable: false,
            },
          ],
        },
        {
          $id: 'r:DIRECTED',
          type: { $ref: '#rt:DIRECTED' },
          from: { $ref: '#n:Person' },
          to: { $ref: '#n:Movie' },
          properties: [],
        },
        {
          $id: 'r:FOLLOWS',
          type: { $ref: '#rt:FOLLOWS' },
          from: { $ref: '#n:Person' },
          to: { $ref: '#n:Person' },
          properties: [],
        },
        {
          $id: 'r:PRODUCED',
          type: { $ref: '#rt:PRODUCED' },
          from: { $ref: '#n:Person' },
          to: { $ref: '#n:Movie' },
          properties: [],
        },
        {
          $id: 'r:REVIEWED',
          type: { $ref: '#rt:REVIEWED' },
          from: { $ref: '#n:Person' },
          to: { $ref: '#n:Movie' },
          properties: [
            { token: 'summary', type: { type: 'string' }, nullable: false },
            { token: 'rating', type: { type: 'integer' }, nullable: false },
          ],
        },
        {
          $id: 'r:WROTE',
          type: { $ref: '#rt:WROTE' },
          from: { $ref: '#n:Person' },
          to: { $ref: '#n:Movie' },
          properties: [],
        },
      ],
    },
  },
};

export const graphSchemaModel =
  GraphSchemaRepresentation.parseJsonStruct(mockGraphSchema);

console.log(graphSchemaModel.graphSchema.nodeLabels);
