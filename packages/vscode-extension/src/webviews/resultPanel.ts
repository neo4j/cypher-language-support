import {
  isDate,
  isDateTime,
  isDuration,
  isInt,
  isLocalDateTime,
  isLocalTime,
  isTime,
  QueryResult,
} from 'neo4j-driver';
import path from 'path';
import { Uri, ViewColumn, WebviewPanel, window } from 'vscode';
import { Connection } from '../connectionService';
import { getExtensionContext, getSchemaPoller } from '../contextService';
import * as webviewTemplateEngine from './webviewTemplateEngine';

function querySummary(result: QueryResult): string[] {
  const rows = result.records.length;
  const counters = result.summary.counters;
  const output: string[] = [];

  // Streamed
  if (rows > 0) {
    // Started streaming 1 records after 5 ms and completed after 10  ms.
    output.push(
      `Started streaming ${rows} record${
        rows === 1 ? '' : 's'
      } after ${result.summary.resultConsumedAfter.toString()} ms and completed after ${result.summary.resultAvailableAfter.toString()}ms.`,
    );
  }

  if (counters.containsUpdates()) {
    const updates = [];

    const updateCounts = counters.updates();

    for (const key in updateCounts) {
      const count = updateCounts[key];
      if (count > 0) {
        const parts = key.split(/(?=[A-Z])/);
        updates.push(
          `${count} ${parts.map((value) => value.toLowerCase()).join(' ')}`,
        );
      }
    }

    if (updates.length > 0) {
      output.push(`${updates.join(', ')}.`);
    }
  }

  if (counters.containsSystemUpdates()) {
    output.push(`${counters.systemUpdates()} system updates.`);
  }

  return output;
}

/**
 * Convert Neo4j Properties back into JavaScript types
 *
 * @param {Record<string, any>} properties
 * @return {Record<string, any>}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toNativeTypes(properties: Record<string, any>) {
  return Object.fromEntries(
    Object.keys(properties).map((key) => {
      const value = valueToNativeType(properties[key]);

      return [key, value];
    }),
  );
}

/**
 * Convert an individual value to its JavaScript equivalent
 *
 * @param {any} value
 * @returns {any}
 */
function valueToNativeType(value: unknown) {
  if (Array.isArray(value)) {
    value = value.map((innerValue) => valueToNativeType(innerValue));
  } else if (isInt(value)) {
    value = value.toNumber();
  } else if (
    isDate(value) ||
    isDateTime(value) ||
    isTime(value) ||
    isLocalDateTime(value) ||
    isLocalTime(value) ||
    isDuration(value)
  ) {
    value = value.toString();
  } else if (
    typeof value === 'object' &&
    value !== undefined &&
    value !== null
  ) {
    value = toNativeTypes(value);
  }

  return value;
}

export type ResultRows = Record<string, unknown>[];

export type Result = {
  rows: ResultRows;
  querySummary: string[];
};

export type ResultMessage =
  | {
      statements: string[];
      type: 'executing';
    }
  | {
      index: number;
      result: Result;
      type: 'success';
    }
  | {
      index: number;
      type: 'error';
      errorMessage: string;
    };

export default class ResultWindow {
  public panel: WebviewPanel;
  schemaPoller = getSchemaPoller();

  constructor(
    public readonly shortFileName: string,
    public connection: Connection,
    public statements: string[],
  ) {
    const extensionContext = getExtensionContext();
    this.panel = window.createWebviewPanel(
      'neo4j.result',
      shortFileName,
      ViewColumn.Two,
      {
        retainContextWhenHidden: true,
        enableScripts: true,
        localResourceRoots: [
          Uri.file(
            path.join(extensionContext.extensionPath, 'dist', 'webviews'),
          ),
          Uri.file(path.join(extensionContext.extensionPath, 'resources')),
        ],
      },
    );

    window.registerWebviewPanelSerializer;
  }

  run() {
    const webview = this.panel.webview;
    const extensionContext = getExtensionContext();

    // Set all the tabs to loading
    webview.html = webviewTemplateEngine.getWebviewHtml(
      webview,
      '<div id="resultDiv"></div>',
      ['ndl.css', 'resultPanel.css'],
      ['resultTabs.js'],
    );

    // Listener para recibir mensajes desde la webview
    webview.onDidReceiveMessage(
      async (message) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        switch (message.type) {
          case 'resultsWindowLoaded': {
            await this.executeStatements();
            return;
          }
          case 'alert':
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            await window.showErrorMessage(message.text);
        }
      },
      undefined,
      extensionContext.subscriptions,
    );
  }

  async executeStatements() {
    const webview = this.panel.webview;

    const message: ResultMessage = {
      type: 'executing',
      statements: this.statements,
    };
    await webview.postMessage(message);
    for (const [index, statement] of this.statements.entries()) {
      await this.executeStatement(statement, index);
    }
  }

  private async runQuery(query: string): Promise<QueryResult | Error> {
    const connection = this.schemaPoller.connection;

    if (connection) {
      try {
        const result = await connection.runSdkQuery(
          {
            query: query,
            queryConfig: {
              resultTransformer: (result) => {
                return result;
              },
              routing: 'WRITE',
            },
          },
          { queryType: 'user-direct' },
        );

        return result;
      } catch (e) {
        const error = e as Error;
        return error;
      }
    } else {
      const errorMessage =
        'Could not execute query, the connection to Neo4j was not set';
      return Error(errorMessage);
    }
  }

  private async executeStatement(statement: string, index: number) {
    const webview = this.panel.webview;
    const result: QueryResult | Error = await this.runQuery(statement);
    let message: ResultMessage;

    if (result instanceof Error) {
      message = {
        type: 'error',
        errorMessage: result.message,
        index: index,
      };
    } else {
      const resultRecords = result.records.map((record) =>
        toNativeTypes(record.toObject()),
      );
      message = {
        type: 'success',
        index: index,
        result: {
          rows: resultRecords,
          querySummary: querySummary(result),
        },
      };
    }
    await webview.postMessage(message);
  }
}
