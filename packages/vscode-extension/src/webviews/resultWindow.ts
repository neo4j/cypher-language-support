import type { QueryResultWithLimit } from '@neo4j-cypher/query-tools';
import { BasicNode, BasicRelationship } from '@neo4j-cypher/ui-components';
import { isNode, Node, QueryResult } from 'neo4j-driver';
import path from 'path';
import {
  Uri,
  ViewColumn,
  Webview,
  WebviewPanel,
  window,
  workspace,
} from 'vscode';
import { Connection } from '../connectionService';
import { getExtensionContext, getSchemaPoller } from '../contextService';
import { getNonce } from '../getNonce';
import { getDeserializedParams } from '../parameterService';
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
  nvlStylesCssUri: string,
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
      <link href="${nvlStylesCssUri.toString()}" rel="stylesheet">
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
  nodes: BasicNode[];
  relationships: BasicRelationship[];
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
      config: Record<string, unknown>;
      type: 'configInit';
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

    // Get the visualization setting
    const config = workspace.getConfiguration('neo4j.features');
    const enableVisualization = config.get('enableVisualization', false);
    const message = {
      type: 'configInit',
      config: { enableVisualization },
    };
    void this.panel.webview.postMessage(message);

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

    const nvlStylesCssPath = Uri.file(
      path.join(
        extensionContext.extensionPath,
        'resources',
        'styles',
        'nvl-styles.css',
      ),
    );

    const resultTabsJs = webview.asWebviewUri(resultTabsJsPath).toString();
    const ndlCssUri = webview.asWebviewUri(ndlCssPath).toString();
    const nvlStylesCssUri = webview.asWebviewUri(nvlStylesCssPath).toString();

    // Set all the tabs to loading

    webview.html = setAllTabsToLoading(
      webview,
      resultTabsJs,
      ndlCssUri,
      nvlStylesCssUri,
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

  private async runQuery(query: string): Promise<QueryResultWithLimit | Error> {
    const connection = this.schemaPoller.connection;

    if (connection) {
      const parameters = getDeserializedParams();
      try {
        return await connection.runCypherQuery({
          query,
          parameters: parameters,
        });
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
      const resultNodes: BasicNode[] = this.extractBasicNodes(result.records);

      // const resultRelations: BasicRelationship[] = result.records.map(
      //   (record) => {
      //     const result: Record<string, unknown> = {};
      //     const relationship: Record<string, unknown> = (
      //       record.get('segments') as Record<string, unknown>
      //     ).relationship as Record<string, unknown>;
      //     result['id'] = relationship.elementId ?? '';
      //     result['from'] = relationship.startNodeElementId ?? '';
      //     result['to'] = relationship.endNodeElementId ?? '';
      //     result['type'] = relationship.type ?? '';
      //     result['properties'] = relationship.properties ?? {};
      //     result['propertyTypes'] = relationship.propertyTypes ?? {};

      //     return result as BasicRelationship;
      //   },
      // );
      message = {
        type: 'success',
        index: index,
        result: {
          rows: resultRecords,
          nodes: resultNodes,
          relationships: [], // resultRelations,
          querySummary: querySummary(result),
        },
      };
    }
    await webview.postMessage(message);
  }

  private extractBasicNodes(records: QueryResult['records']): BasicNode[] {
    if (records.length === 0) {
      return [];
    }

    const items = new Set<unknown>();

    for (const record of records) {
      for (const key of record.keys) {
        items.add(record.get(key));
      }
    }

    const nodeMap = new Map<string, Node>();

    function addNode(n: Node) {
      const id = n.identity.toString();
      if (!nodeMap.has(id)) {
        nodeMap.set(id, n);
      }
    }

    const findAllEntities = (item: unknown) => {
      if (typeof item !== 'object' || !item) {
        return;
      }

      if (isNode(item)) {
        addNode(item);
      } else {
        Object.values(item).forEach(findAllEntities);
      }
    };

    findAllEntities(Array.from(items));

    const nodes = Array.from(nodeMap.values()).map((item) => {
      return {
        id: item.identity.toString(),
        elementId: item.elementId,
        labels: item.labels,
        properties: Object.entries(item.properties).reduce(
          (res: Record<string, unknown>, [currKey, currVal]) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            res[currKey] = currVal.toString();
            return res;
          },
          {},
        ),
        propertyTypes: {},
      } as BasicNode;
    });

    return nodes;
  }
}
