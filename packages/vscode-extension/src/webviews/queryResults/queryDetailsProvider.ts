import {
  WebviewViewProvider,
  ExtensionContext,
  WebviewView,
  Uri,
  commands,
} from 'vscode';
import { getExtensionContext, getSchemaPoller } from '../../contextService';
import path from 'path';
import { getNonce } from '../../getNonce';
import { QueryResultWithLimit } from '@neo4j-cypher/query-tools';
import { getDeserializedParams } from '../../parameterService';
import { toNativeTypes } from '../../typeUtils';
import { ResultMessage, querySummary } from '../resultWindow';

export class Neo4jQueryDetailsProvider implements WebviewViewProvider {
  private view: WebviewView | undefined;
  schemaPoller = getSchemaPoller();
  constructor(private readonly context: ExtensionContext) {}

  resolveWebviewView(webviewView: WebviewView) {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
    };
    webviewView.webview.html = this.renderQueryDetails(webviewView.webview); // `<html><body><h1>Hello from the panel!</h1></body></html>`;
  }

  async executeStatements(statements: string[]) {
    await commands.executeCommand('neo4jQueryDetails.focus');
    const webview = this.view.webview;

    const message: ResultMessage = {
      type: 'executing',
      statements: statements,
    };
    await webview.postMessage(message);
    for (const [index, statement] of statements.entries()) {
      await this.executeStatement(statement, index);
    }
  }

  private async executeStatement(statement: string, index: number) {
    const webview = this.view.webview;
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

  private renderQueryDetails(webview: WebviewView['webview']) {
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

    const queryDetailsContainerJs = webview
      .asWebviewUri(queryDetailsContainerJsPath)
      .toString();
    const ndlCssUri = webview.asWebviewUri(ndlCssPath).toString();

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
          <div id="queryDetails"></div> 
          <script nonce="${nonce}" src="${queryDetailsContainerJs}"></script>
          </body>
          </html>
        `;
  }
}
