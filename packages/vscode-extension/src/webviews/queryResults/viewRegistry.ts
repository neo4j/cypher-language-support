import * as vscode from 'vscode';
import { ResultMessage } from '../resultWindow';

export const views = {
  detailsView: undefined as vscode.WebviewView | undefined,
  visualizationView: undefined as vscode.WebviewView | undefined,
};

export type QueryResultViews = keyof typeof views;

export type QueryResultsMessage =
  | {
      type: 'statementSelect';
      statement: string;
      to: QueryResultViews;
    }
  | {
      type: 'executionUpdate';
      result: ResultMessage;
      to: QueryResultViews;
    };
