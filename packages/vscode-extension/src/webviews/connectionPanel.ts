import path from 'path';
import {
  commands,
  Disposable,
  Uri,
  ViewColumn,
  Webview,
  WebviewPanel,
  window,
} from 'vscode';
import { Connection, getAllConnections } from '../connectionService';
import { constants } from '../constants';
import { getNonce } from '../getNonce';

export type ConnectionPanelMessage = {
  command: ConnectionPanelMessageCommand;
  connection?: Connection;
  password?: string;
};

type ConnectionPanelMessageCommand = 'onSaveConnection' | 'onValidationError';

export class ConnectionPanel {
  private static _currentPanel: ConnectionPanel | undefined;

  private static readonly _viewType = 'connection';

  private readonly _panel: WebviewPanel;
  private readonly _extensionPath: string;

  private _connection: Connection | undefined;
  private _password: string | undefined;
  private _disposables: Disposable[] = [];

  private constructor(
    panel: WebviewPanel,
    extensionPath: string,
    connection?: Connection,
  ) {
    this._panel = panel;
    this._extensionPath = extensionPath;

    // Ordinarily, if the connection was undefined, we would create a new one
    // We want to limit this to a single connection for now
    this._connection = connection ?? getAllConnections()[0];

    this.update();
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public static createOrShow(
    extensionPath: string,
    connection?: Connection,
    password?: string,
  ) {
    const column = window.activeTextEditor
      ? window.activeTextEditor.viewColumn
      : undefined;

    if (ConnectionPanel._currentPanel) {
      ConnectionPanel._currentPanel._connection = connection;
      ConnectionPanel._currentPanel._password = password;
      ConnectionPanel._currentPanel._panel.reveal(column);
      ConnectionPanel._currentPanel.update();
      return;
    }

    const panel = window.createWebviewPanel(
      ConnectionPanel._viewType,
      'Neo4j',
      column || window.activeTextEditor?.viewColumn || ViewColumn.One,
      {
        localResourceRoots: [
          Uri.file(path.join(extensionPath, 'dist', 'webviews')),
          Uri.file(path.join(extensionPath, 'resources')),
        ],
        enableScripts: true,
      },
    );

    ConnectionPanel._currentPanel = new ConnectionPanel(
      panel,
      extensionPath,
      connection,
    );
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
      async (message: ConnectionPanelMessage) => {
        switch (message.command) {
          case 'onSaveConnection': {
            await commands.executeCommand(
              constants.COMMANDS.SAVE_CONNECTION_COMMAND,
              message.connection,
              message.password,
            );
            this.dispose();
            break;
          }
          case 'onValidationError': {
            void window.showErrorMessage(
              constants.MESSAGES.CONNECTION_VALIDATION_MESSAGE,
            );
            break;
          }
        }
      },
      null,
      this._disposables,
    );
  }

  private getHtmlForWebview(webview: Webview): string {
    const resetCssPath = Uri.file(
      path.join(this._extensionPath, 'resources', 'styles', 'reset.css'),
    );
    const vscodeCssPath = Uri.file(
      path.join(this._extensionPath, 'resources', 'styles', 'vscode.css'),
    );
    const connectionPanelCssPath = Uri.file(
      path.join(
        this._extensionPath,
        'resources',
        'styles',
        'connectionPanel.css',
      ),
    );

    const connectionPanelJsPath = Uri.file(
      path.join(
        this._extensionPath,
        'dist',
        'webviews',
        'connectionPanelController.js',
      ),
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
            <link href="${resetCssUri.toString()}" rel="stylesheet">
            <link href="${vscodeCssUri.toString()}" rel="stylesheet">
            <link href="${connectionPanelCssUri.toString()}" rel="stylesheet">
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
                <form class="form" action="" novalidate method="post">
                  <input type="hidden" id="key" value="${
                    this._connection?.key ?? getNonce(16)
                  }" />
                  <div class="form--input-wrapper">
                    <label for="scheme">Scheme *</label>
                    <select id="scheme">
                        <option value="bolt" ${
                          this._connection?.scheme === 'bolt' ? 'selected' : ''
                        }>bolt://</option>
                        <option value="bolt+s" ${
                          this._connection?.scheme === 'bolt+s'
                            ? 'selected'
                            : ''
                        }>bolt+s://</option>
                        <option value="neo4j" ${
                          this._connection?.scheme === 'neo4j' ||
                          !this._connection
                            ? 'selected'
                            : ''
                        }>neo4j://</option>
                        <option value="neo4j+s" ${
                          this._connection?.scheme === 'neo4j+s'
                            ? 'selected'
                            : ''
                        }>neo4j+s://</option>
                    </select>
                  </div>
                  <div class="form--input-wrapper">
                    <label for="host">Host *</label>
                    <input type="text" id="host" required placeholder="localhost" value="${
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
                      this._connection?.database ?? ''
                    }"/>
                  </div>
                  <div class="form--input-wrapper">
                    <label for="user">User *</label>
                    <input type="text" id="user" required placeholder="neo4j" value="${
                      this._connection?.user ?? 'neo4j'
                    }"/>
                  </div>
                  <div class="form--input-wrapper">
                    <label for="password">Password *</label>
                    <input type="password" id="password" required value="${
                      this._password ?? ''
                    }" />
                  </div>
                  <div class="form--actions">
                    <input type="submit" value="Save Connection" />
                  </div>
                </form>
              </div>
              <script nonce="${nonce}" src="${connectionPanelJsUri.toString()}"></script>
            </div>
          </body>
        </html>`;
  }
}
