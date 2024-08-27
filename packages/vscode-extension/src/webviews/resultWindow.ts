import type { QueryResultWithLimit } from '@neo4j-cypher/schema-poller';
import path from 'path';
import { Uri, ViewColumn, Webview, WebviewPanel, window } from 'vscode';
import { Connection } from '../connectionService';
import { getExtensionContext, getSchemaPoller } from '../contextService';
import { getNonce } from '../getNonce';
import { toNativeTypes } from '../typeUtils';

export function querySummary(result: QueryResultWithLimit): string[] {
  const rows = result.records.length;
  const counters = result.summary.counters;
  const output: string[] = [];

  // Streamed
  if (rows > 0) {
    // Started streaming 1 records after 5 ms and completed after 10  ms.
    output.push(
      `${
        result.recordLimitHit
          ? `Fetch limit hit at ${result.records.length} records. `
          : ''
      }Started streaming ${rows} record${
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

export function setAllTabsToLoading(
  webview: Webview,
  script: string,
  ndlCssUri: string,
): string {
  const nonce = getNonce();

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <!--
        Use a content security policy to only allow loading images from https or from our extension directory,
        and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
          webview.cspSource
        }; script-src 'nonce-${nonce}';">
      <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
      </script>
      <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
      <style>
      :root {
        --background: #f2f2f2;
        --border: #ccc;
        --text: #000;
        --error: #ff0000;
      }

      @media (prefers-color-scheme: dark) {
        --background: transparent;
        --border: #ddd;
        --text: #ccc;
        --error: #bbb;
      }

      table{border-collapse:collapse; width: 100%}
      table,td,th{border:1px solid var(--border); padding:5px; vertical-align: top}
      th {font-weight: bold}
      details {margin-bottom: 24px; padding: 12px; border: 1px solid var(--border)}
      details summary {border-bottom: 1px solid var(--border); padding: 6px}
      pre {
        max-height: 280px;
        overflow: auto;
      }
      </style>
      <link href="${ndlCssUri.toString()}" rel="stylesheet">
      </head>
      <body>
          <div id="resultDiv"></div> 
          <script nonce="${nonce}" src="${script}"></script>
      </body>
      </html>
    `;
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
    this.panel = window.createWebviewPanel(
      'neo4j.result',
      shortFileName,
      ViewColumn.Two,
      { retainContextWhenHidden: true, enableScripts: true },
    );

    window.registerWebviewPanelSerializer;
  }

  run() {
    const webview = this.panel.webview;
    const extensionContext = getExtensionContext();
    const resultTabsJsPath = Uri.file(
      path.join(
        extensionContext.extensionPath,
        'dist',
        'webviews',
        'resultTabs.js',
      ),
    );

    const ndlCssPath = Uri.file(
      path.join(
        extensionContext.extensionPath,
        'resources',
        'styles',
        'ndl.css',
      ),
    );

    const resultTabsJs = webview.asWebviewUri(resultTabsJsPath).toString();
    const ndlCssUri = webview.asWebviewUri(ndlCssPath).toString();

    // Set all the tabs to loading

    webview.html = setAllTabsToLoading(webview, resultTabsJs, ndlCssUri);

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

  private async runQuery(query: string): Promise<QueryResultWithLimit | Error> {
    const connection = this.schemaPoller.connection;

    if (connection) {
      try {
        return await connection.runCypherQuery({ query });
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
    const result = await this.runQuery(statement);
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
