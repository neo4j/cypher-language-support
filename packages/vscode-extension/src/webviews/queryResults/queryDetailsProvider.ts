import {
  cypherDataToString,
  CypherDataType,
  CypherProperty,
  QueryResultWithLimit,
  getPropertyTypeDisplayName,
} from '@neo4j-cypher/query-tools';
import { NeoNode, NeoRel } from '@neo4j-ndl/react';
import {
  isNode,
  isPath,
  isRelationship,
  Neo4jError,
  Node as Neo4jNode,
  Record as Neo4jRecord,
  Relationship as Neo4jRelationship,
  Path,
} from 'neo4j-driver';
import path from 'path';
import {
  ColorThemeKind,
  Uri,
  WebviewView,
  WebviewViewProvider,
  window,
} from 'vscode';
import { getExtensionContext, getSchemaPoller } from '../../contextService';
import { getNonce } from '../../getNonce';
import { getDeserializedParams } from '../../parameterService';
import { toNativeTypes } from '../../typeUtils';
import { querySummary } from './querySummary';
import { QueryResultsMessage, views } from './queryResultsTypes';

export class Neo4jQueryDetailsProvider implements WebviewViewProvider {
  private view: WebviewView | undefined;
  private viewReadyResolver!: (view: WebviewView) => void;
  private viewReadyPromise: Promise<WebviewView>;
  schemaPoller = getSchemaPoller();

  constructor() {
    this.viewReadyPromise = new Promise((resolve) => {
      this.viewReadyResolver = resolve;
    });
  }

  resolveWebviewView(webviewView: WebviewView) {
    this.view = webviewView;
    views.detailsView = webviewView;

    this.viewReadyResolver(webviewView);

    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this.renderQueryDetails();

    webviewView.webview.onDidReceiveMessage((msg: QueryResultsMessage) => {
      if (msg.to === 'visualizationView') {
        void views.visualizationView.webview.postMessage(msg);
      }
    });

    window.onDidChangeActiveColorTheme(async (e) => {
      await this.view.webview.postMessage({
        type: 'themeUpdate',
        isDarkTheme:
          e.kind === ColorThemeKind.Dark ||
          e.kind === ColorThemeKind.HighContrast,
        to: 'detailsView',
      });
    });
  }

  async executeStatements(statements: string[]) {
    this.view ?? (await this.viewReadyPromise);
    const webview = this.view.webview;

    const message: QueryResultsMessage = {
      type: 'executionStart',
      result: [...statements].map((s) => ({
        statement: s,
        type: 'executing',
      })),
      to: 'detailsView',
    };

    await webview.postMessage(message);
    for (const statement of statements) {
      await this.executeStatement(statement);
    }
  }

  private async executeStatement(statement: string) {
    const webview = this.view.webview;
    const result = await this.runQuery(statement);
    const message: QueryResultsMessage = {
      type: 'executionUpdate',
      to: 'detailsView',
      result: {
        statement: statement,
        type: 'executing',
      },
    };

    if (result instanceof Error) {
      message.result = {
        ...message.result,
        type: 'error',
        errorMessage: result.message,
      };
    } else {
      const resultRecords = result.records.map((record) =>
        toNativeTypes(record.toObject()),
      );
      const { nodes, relationships } = this.extractUniqueNodesAndRels(
        result.records,
      );
      message.result = {
        ...message.result,
        type: 'success',
        rows: resultRecords,
        nodes: nodes,
        relationships: relationships,
        querySummary: querySummary(result),
      };
    }
    await webview.postMessage(message);
    await views.visualizationView.webview.postMessage({
      ...message,
      to: 'visualizationView',
    });
  }

  private extractUniqueNodesAndRels(records: Neo4jRecord[]): {
    nodes: NeoNode[];
    relationships: NeoRel[];
  } {
    if (records.length === 0) {
      return { nodes: [], relationships: [] };
    }

    const items = new Set<unknown>();

    for (const record of records) {
      for (const key of record.keys) {
        items.add(record.get(key));
      }
    }

    const paths: Path[] = [];

    const nodeMap = new Map<string, Neo4jNode>();
    function addNode(n: Neo4jNode) {
      const id = n.identity.toString();
      if (!nodeMap.has(id)) {
        nodeMap.set(id, n);
      }
    }

    const relMap = new Map<string, Neo4jRelationship>();
    function addRel(r: Neo4jRelationship) {
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

    const nodes = Array.from(nodeMap.values()).map((item): NeoNode => {
      return {
        id: item.identity.toString(),
        labels: item.labels,
        properties: Object.entries(item.properties).reduce(
          (
            res: Record<string, { stringified: string; type: string }>,
            [currKey, currVal],
          ) => {
            res[currKey] = {
              stringified: cypherDataToString(currVal as CypherDataType),
              type: getPropertyTypeDisplayName(currVal as CypherProperty),
            };
            return res;
          },
          {},
        ),
      };
    });

    const relationships = Array.from(relMap.values())
      .filter((item) => {
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
          properties: Object.entries(item.properties).reduce(
            (
              res: Record<string, { stringified: string; type: string }>,
              [currKey, currVal],
            ) => {
              res[currKey] = {
                stringified: cypherDataToString(currVal as CypherDataType),
                type: getPropertyTypeDisplayName(currVal as CypherProperty),
              };
              return res;
            },
            {},
          ),
        };
      });

    return { nodes, relationships };
  }

  private async runQuery(query: string): Promise<QueryResultWithLimit | Error> {
    const isCallInTransactionError = ({ code, message }: Neo4jError) =>
      (code === 'Neo.DatabaseError.Statement.ExecutionFailed' ||
        code === 'Neo.DatabaseError.Transaction.TransactionStartFailed') &&
      /in an implicit transaction/i.test(message);
    const isPeriodicCommitError = ({ code, message }: Neo4jError) =>
      code === 'Neo.ClientError.Statement.SemanticError' &&
      [
        /in an open transaction is not possible/i,
        /tried to execute in an explicit transaction/i,
      ].some((reg) => reg.test(message));

    const isImplicitTransactionError = (error: Neo4jError): boolean =>
      isPeriodicCommitError(error) || isCallInTransactionError(error);

    const connection = this.schemaPoller.connection;
    if (connection) {
      const parameters = getDeserializedParams();
      try {
        return await connection.runCypherQuery({
          query,
          parameters: parameters,
        });
      } catch (e) {
        if (e instanceof Neo4jError && isImplicitTransactionError(e)) {
          return await connection.runCypherQuery({
            query,
            parameters: parameters,
            implicitTransaction: true,
          });
        }
        const error = e as Error;
        return error;
      }
    } else {
      const errorMessage =
        'Could not execute query, the connection to Neo4j was not set';
      return Error(errorMessage);
    }
  }

  private renderQueryDetails() {
    const extensionContext = getExtensionContext();
    const queryDetailsContainerJsPath = Uri.file(
      path.join(
        extensionContext.extensionPath,
        'dist',
        'webviews',
        'queryDetails.js',
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
    const queryDetailsCssPath = Uri.file(
      path.join(
        extensionContext.extensionPath,
        'resources',
        'styles',
        'queryDetails.css',
      ),
    );

    const queryDetailsContainerJs = this.view.webview
      .asWebviewUri(queryDetailsContainerJsPath)
      .toString();
    const ndlCssUri = this.view.webview.asWebviewUri(ndlCssPath).toString();
    const queryDetailsCssUri = this.view.webview
      .asWebviewUri(queryDetailsCssPath)
      .toString();

    const nonce = getNonce();

    const isDarkTheme =
      window.activeColorTheme.kind === ColorThemeKind.Dark ||
      window.activeColorTheme.kind === ColorThemeKind.HighContrast;

    return `
        <!DOCTYPE html>
        <html lang="en"${isDarkTheme ? ' class="ndl-theme-dark"' : ''}>
          <head>
            <meta charset="UTF-8">
            <!--
            Use a content security policy to only allow loading images from https or from our extension directory,
            and only allow scripts that have a specific nonce.
            -->
            <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
              this.view.webview.cspSource
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
          </style>
          <link href="${ndlCssUri.toString()}" rel="stylesheet">
          <link href="${queryDetailsCssUri.toString()}" rel="stylesheet">
          </head>
          <body style="margin: 0; padding: 0;">
          <div id="queryDetails"></div> 
          <script nonce="${nonce}" src="${queryDetailsContainerJs}"></script>
          </body>
          </html>
        `;
  }
}
