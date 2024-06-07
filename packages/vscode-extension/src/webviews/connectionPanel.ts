/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  commands,
  Disposable,
  Uri,
  ViewColumn,
  Webview,
  WebviewPanel,
  window,
} from 'vscode';
import { ConnectionRepository } from '../repositories/connectionRepository';
import {
  addOrUpdateConnection,
  testConnection,
} from '../services/connectionService';
import { Connection } from '../types/connection';
import {
  CONNECTION_FAILED_MESSAGE,
  REFRESH_CONNECTIONS_COMMAND,
} from '../util/constants';
import { getNonce } from '../util/getNonce';

type Data = {
  command: string;
  connection: Connection;
  password: string;
};

export class ConnectionPanel {
  private static _currentPanel: ConnectionPanel | undefined;

  private static readonly _viewType = 'connection';

  private readonly _panel: WebviewPanel;
  private readonly _extensionUri: Uri;
  private readonly _connection: Connection | undefined;

  private _disposables: Disposable[] = [];

  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Aritificially limit the number of connections to 1 for now
    // If we already have a connection, edit it.. otherwise create a new one
    this._connection = ConnectionRepository.instance.getConnections()[0];

    this.update();
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public static createOrShow(extensionUri: Uri) {
    const column = window.activeTextEditor
      ? window.activeTextEditor.viewColumn
      : undefined;

    if (ConnectionPanel._currentPanel) {
      ConnectionPanel._currentPanel._panel.reveal(column);
      ConnectionPanel._currentPanel.update();
      return;
    }

    const panel = window.createWebviewPanel(
      ConnectionPanel._viewType,
      'Neo4j',
      column || window.activeTextEditor?.viewColumn || ViewColumn.One,
      {
        enableScripts: true,
      },
    );

    ConnectionPanel._currentPanel = new ConnectionPanel(panel, extensionUri);
  }

  private dispose() {
    ConnectionPanel._currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private update(): void {
    const webview = this._panel.webview;
    this._panel.webview.html = this.getHtmlForWebview(webview);

    webview.onDidReceiveMessage(
      async (data: Data) => {
        switch (data.command) {
          case 'onTestConnection': {
            if (await testConnection(data.connection, data.password)) {
              void window.showInformationMessage('Connection successful');
            } else {
              void window.showErrorMessage(CONNECTION_FAILED_MESSAGE);
            }
            break;
          }
          case 'onAddConnection': {
            if (await addOrUpdateConnection(data.connection, data.password)) {
              this.dispose();
              await commands.executeCommand(REFRESH_CONNECTIONS_COMMAND);
            } else {
              void window.showErrorMessage(CONNECTION_FAILED_MESSAGE);
            }
            break;
          }
        }
      },
      null,
      this._disposables,
    );
  }

  private getHtmlForWebview(webview: Webview): string {
    const resetCssPath = Uri.joinPath(
      this._extensionUri,
      'resources',
      'styles',
      'reset.css',
    );
    const vscodeCssPath = Uri.joinPath(
      this._extensionUri,
      'resources',
      'styles',
      'vscode.css',
    );
    const connectionPanelCssPath = Uri.joinPath(
      this._extensionUri,
      'resources',
      'styles',
      'connectionPanel.css',
    );

    const connectionPanelJsPath = Uri.joinPath(
      this._extensionUri,
      'resources',
      'scripts',
      'connectionPanel.js',
    );

    const resetCssUri = webview.asWebviewUri(resetCssPath);
    const vscodeCssUri = webview.asWebviewUri(vscodeCssPath);
    const connectionPanelCssUri = webview.asWebviewUri(connectionPanelCssPath);
    const connectionPanelJsUri = webview.asWebviewUri(connectionPanelJsPath);

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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="${resetCssUri}" rel="stylesheet">
          <link href="${vscodeCssUri}" rel="stylesheet">
          <link href="${connectionPanelCssUri}" rel="stylesheet">
          <script nonce="${nonce}">
            const vscode = acquireVsCodeApi();
          </script>
        </head>
        <body>
          <div class="container">
            <div>
              <h1>${
                this._connection ? 'Edit Connection' : 'Add New Connection'
              }</h1>
              <form class="form">
                <input type="hidden" id="key" value="${
                  this._connection?.key ?? getNonce(16)
                }" />
                <input type="hidden" id="connected" value="${
                  this._connection?.connect ?? 'false'
                }" />
                <div class="form--input-wrapper">
                  <label for="name">Connection name</label>
                  <input type="text" id="name" placeholder="Default connection" value="${
                    this._connection?.name ?? 'Default connection'
                  }" />
                </div>
                <div class="form--input-wrapper">
                  <label for="scheme">Scheme</label>
                  <select id="scheme">
                    <option value="bolt://" ${
                      this._connection?.scheme === 'bolt://' ? 'selected' : ''
                    }>bolt://</option>
                    <option value="neo4j://" ${
                      this._connection?.scheme === 'neo4j://' ||
                      !this._connection
                        ? 'selected'
                        : ''
                    }>neo4j://</option>
                  </select>
                </div>
                <div class="form--input-wrapper">
                  <label for="host">Host</label>
                  <input type="text" id="host" placeholder="localhost" value="${
                    this._connection?.host ?? 'localhost'
                  }"/>
                </div>
                <div class="form--input-wrapper">
                  <label for="port">Port</label>
                  <input type="text" id="port" placeholder="7687" value="${
                    this._connection?.port ?? '7687'
                  }"/>
                </div>
                <div class="form--input-wrapper">
                  <label for="database">Database</label>
                  <input type="text" id="database" placeholder="neo4j" value="${
                    this._connection?.database ?? 'neo4j'
                  }"/>
                </div>
                <div class="form--input-wrapper">
                  <label for="user">User</label>
                  <input type="text" id="user" placeholder="neo4j" value="${
                    this._connection?.user ?? 'neo4j'
                  }"/>
                </div>
                <div class="form--input-wrapper">
                  <label for="password">Password</label>
                  <input type="password" id="password" />
                </div>
                <div class="form--actions">
                  <button type="button" id="test-connection">Test connection</button>
                  <button type="button" id="add-connection">${
                    this._connection ? 'Edit Connection' : 'Add Connection'
                  }</button>
                </div>
              </form>
            </div>
            <script nonce="${nonce}" src="${connectionPanelJsUri}"></script>
          </div>
        </body>
      </html>`;
  }
}
