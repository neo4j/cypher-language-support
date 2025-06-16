import { NeoNode, NeoRel } from '@neo4j-ndl/react';
import * as vscode from 'vscode';

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
      nodes: NeoNode[];
      relationships: NeoRel[];
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
    }
  | {
      type: 'themeUpdate';
      isDarkTheme: boolean;
      to: QueryResultViews;
    };
