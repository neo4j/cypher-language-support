import * as vscode from 'vscode';
import {
  Node as NvlNode,
  Relationship as NvlRelationship,
} from '@neo4j-nvl/base';

export const views = {
  detailsView: undefined as vscode.WebviewView | undefined,
  visualizationView: undefined as vscode.WebviewView | undefined,
};

export type QueryResultViews = keyof typeof views;

export type ResultRows = Record<string, unknown>[];

export type QueryResult =
  | { statement: string; type: 'executing' }
  | { statement: string; type: 'error'; errorMessage: string }
  | {
      statement: string;
      type: 'success';
      rows: ResultRows;
      nodes: NvlNode[];
      relationships: NvlRelationship[];
      querySummary: string[];
    };

export type QueryResults = QueryResult[];

export type QueryResultsMessage =
  | {
      type: 'visualizationUpdate';
      result: QueryResult;
      to: QueryResultViews;
    }
  | {
      type: 'executionStart';
      result: QueryResult[];
      to: QueryResultViews;
    }
  | {
      type: 'executionUpdate';
      result: QueryResult;
      to: QueryResultViews;
    };
