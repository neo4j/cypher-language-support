/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isDate,
  isDateTime,
  isDuration,
  isInt,
  isLocalDateTime,
  isLocalTime,
  isNode,
  isPath,
  isRelationship,
  isTime,
  Node,
  Path,
  QueryResult,
  Record as Neo4jRecord,
  Relationship,
} from 'neo4j-driver';
import path from 'path';
import {
  ExtensionContext,
  Uri,
  ViewColumn,
  WebviewPanel,
  window,
} from 'vscode';
import { Connection } from '../connectionService';
import { getSchemaPoller } from '../contextService';

export function querySummary(result: QueryResult): string[] {
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
export function toNativeTypes(properties: Record<string, any>) {
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

export function getErrorContent(err: Error): string {
  return `
    <details class="error">
      <summary style="color:red">Error: ${err.message}</summary>
      <pre>${err.stack}</pre>
    </details>
  `;
}

export function setAllTabsToLoading(script: string): string {
  return `
    <html>
      <head>
      <script>
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

      .error {
        color: var(--border);
        border-color: var(--border);
      }
      </style>
      </head>
      <body>
          <div id="resultDiv"></div> 
          <script src="${script}"></script>
      </body>
      </html>
    `;
}

export type ResultRows = Record<string, unknown>[];

export type Result = {
  rows: ResultRows;
  nodes: any[];
  relationships: any[];
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
  // TODO Nacho rename this, shouldn't be called a schema poller anymore
  schemaPoller = getSchemaPoller();

  constructor(
    public readonly context: ExtensionContext,
    public readonly connection: Connection,
    public readonly shortFileName: string,
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

    const resultTabsJsPath = Uri.file(
      path.join(
        this.context.extensionPath,
        'dist',
        'webviews',
        'resultTabs.js',
      ),
    );

    const resultTabsJs = webview.asWebviewUri(resultTabsJsPath).toString();

    // Set all the tabs to loading

    webview.html = setAllTabsToLoading(resultTabsJs);

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
      this.context.subscriptions,
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

  private async executeStatement(statement: string, index: number) {
    const webview = this.panel.webview;
    const result: QueryResult | Error = await this.schemaPoller.runQuery(
      statement,
    );
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

      const { nodes, relationships } = this.extractUniqueNodesAndRels(
        result.records,
      );

      message = {
        type: 'success',
        index: index,
        result: {
          rows: resultRecords,
          nodes: nodes,
          relationships: relationships,
          querySummary: querySummary(result),
        },
      };
    }
    await webview.postMessage(message);
  }

  private extractUniqueNodesAndRels(
    records: Neo4jRecord[],
    {
      nodeLimit,
      keepDanglingRels = false,
    }: { nodeLimit?: number; keepDanglingRels?: boolean } = {},
  ): { nodes: any[]; relationships: any[]; limitHit: boolean } {
    let limitHit = false;
    if (records.length === 0) {
      return { nodes: [], relationships: [], limitHit };
    }

    const items = new Set<unknown>();

    for (const record of records) {
      for (const key of record.keys) {
        items.add(record.get(key));
      }
    }

    const paths: Path[] = [];

    const nodeMap = new Map<string, Node>();
    function addNode(n: Node) {
      if (!limitHit) {
        const id = n.identity.toString();
        if (!nodeMap.has(id)) {
          nodeMap.set(id, n);
        }
        if (typeof nodeLimit === 'number' && nodeMap.size === nodeLimit) {
          limitHit = true;
        }
      }
    }

    const relMap = new Map<string, Relationship>();
    function addRel(r: Relationship) {
      const id = r.identity.toString();
      if (!relMap.has(id)) {
        relMap.set(id, r);
      }
    }

    const findAllEntities = (item: unknown) => {
      if (typeof item !== 'object' || !item) {
        return;
      }

      if (isRelationship(item)) {
        addRel(item);
      } else if (isNode(item)) {
        addNode(item);
      } else if (isPath(item)) {
        paths.push(item);
      } else if (Array.isArray(item)) {
        item.forEach(findAllEntities);
      } else {
        Object.values(item).forEach(findAllEntities);
      }
    };

    findAllEntities(Array.from(items));

    for (const path of paths) {
      addNode(path.start);
      addNode(path.end);
      for (const segment of path.segments) {
        addNode(segment.start);
        addNode(segment.end);
        addRel(segment.relationship);
      }
    }

    const nodes = Array.from(nodeMap.values()).map((item) => {
      return {
        id: item.identity.toString(),
        elementId: item.elementId,
        labels: item.labels,
        properties: this.mapValues(item.properties, (p) => {
          p.toString();
        }),
        propertyTypes: this.mapValues(item.properties, () => {
          return 'Unknown';
        }),
      };
    });

    const relationships = Array.from(relMap.values())
      .filter((item) => {
        if (keepDanglingRels) {
          return true;
        }

        // We'd get dangling relationships from
        // match ()-[a:ACTED_IN]->() return a;
        // or from hitting the node limit
        const start = item.start.toString();
        const end = item.end.toString();
        return nodeMap.has(start) && nodeMap.has(end);
      })
      .map((item) => {
        return {
          id: item.identity.toString(),
          elementId: item.elementId,
          startNodeId: item.start.toString(),
          from: item.start.toString(),
          endNodeId: item.end.toString(),
          to: item.end.toString(),
          type: item.type,
          properties: this.mapValues(item.properties, (p) => {
            p.toString();
          }),
          propertyTypes: this.mapValues(item.properties, () => {
            return 'Unknown';
          }),
        };
      });

    return { nodes, relationships, limitHit };
  }

  private mapValues<A, B>(
    object: Record<string, A>,
    mapper: (val: A) => B,
  ): Record<string, B> {
    return Object.entries(object).reduce(
      (res: Record<string, B>, [currKey, currVal]) => {
        res[currKey] = mapper(currVal);
        return res;
      },
      {},
    );
  }

  // private mapNode(node) {
  //   return {
  //     id:
  //       typeof node.identity === 'string'
  //         ? node.identity
  //         : node.identity.toString(),
  //     color: '',
  //     captions: node.labels[0],
  //     icon: '',
  //     size: '',
  //     disabled: !!node.disabled,
  //     activated: !!node.activated,
  //     selected: !!node.selected,
  //   };
  // }

  // private mapRel({ identity, start, end, ...rest }) {
  //   return {
  //     id: typeof identity === 'string' ? identity : identity.toString(),
  //     from: start,
  //     to: end,
  //     ...rest,
  //   };
  // }
}