/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { TransientConnection } from '@neo4j-cypher/schema-poller';
import {
  commands,
  Disposable,
  Uri,
  ViewColumn,
  Webview,
  WebviewPanel,
  window,
} from 'vscode';
import { getNonce } from './getNonce';
import { GlobalStateManager } from './globalStateManager';
import { SecretStorageManager } from './secretStorageManager';
import { getConnectionString, getCredentials } from './settingsHelpers';
import { Settings } from './types/settings';

type Data = {
  command: string;
  settings: Settings;
};

export class ConnectionPanel {
  private static _currentPanel: ConnectionPanel | undefined;

  private static readonly _viewType = 'connection';

  private readonly _panel: WebviewPanel;
  private readonly _extensionUri: Uri;
  private readonly _connection: Settings | undefined;

  private _disposables: Disposable[] = [];

  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Aritificially limit the number of connections to 1 for now
    // If we already have a connection, edit it.. otherwise create a new one
    const connectionName = GlobalStateManager.instance.getConnectionNames()[0];
    if (connectionName) {
      this._connection =
        GlobalStateManager.instance.getConnection(connectionName);
    }

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
      'Manage Connection',
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
            await this.testConnection(data.settings);
            break;
          }
          case 'onAddConnection': {
            const success = await this.testConnection(data.settings);
            if (success) {
              await this.addConnection(data.settings);
              this.dispose();
            }
            break;
          }
        }
      },
      null,
      this._disposables,
    );
  }

  private async testConnection(settings: Settings): Promise<boolean> {
    const url = getConnectionString(settings);
    const credentials = getCredentials(settings);
    const transientConnection = new TransientConnection();
    const success = await transientConnection.testConnection(url, credentials, {
      appName: 'vscode-extension',
    });

    success
      ? void window.showInformationMessage('Connection successful')
      : void window.showErrorMessage('Connection failed');

    return success;
  }

  private async addConnection(settings: Settings): Promise<void> {
    const { password } = getCredentials(settings);
    await this.updateState(settings, password);
    await commands.executeCommand(
      'neo4j.connect-to-database',
      settings.connectionName,
    );
    await commands.executeCommand('neo4j.refresh-connections');
  }

  private async updateState(settings: Settings, password: string) {
    await GlobalStateManager.instance.setConnection(settings);
    await SecretStorageManager.instance.setPasswordForConnection(
      settings.connectionName,
      password,
    );
  }

  private getHtmlForWebview(webview: Webview): string {
    const resetCssPath = Uri.joinPath(this._extensionUri, 'media', 'reset.css');
    const vscodeCssPath = Uri.joinPath(
      this._extensionUri,
      'media',
      'vscode.css',
    );

    const connectionPanelJsPath = Uri.joinPath(
      this._extensionUri,
      'media',
      'connectionPanel.js',
    );

    const resetCssUri = webview.asWebviewUri(resetCssPath);
    const vscodeCssUri = webview.asWebviewUri(vscodeCssPath);
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
          <script nonce="${nonce}">
            const vscode = acquireVsCodeApi();
          </script>
        </head>
        <body>
          <h1>${
            this._connection ? 'Edit Connection' : 'Add New Connection'
          }</h1>
          <form>
            <label for="connection-name">Connection name</label>
            <input type="text" id="connection-name" placeholder="Default connection" value="${
              this._connection?.connectionName
            }" />
            <label for="scheme">Scheme</label>
            <select id="scheme">
              <option value="bolt://" ${
                this._connection?.scheme === 'bolt://' ? 'selected' : ''
              }>bolt://</option>
              <option value="neo4j://" ${
                this._connection?.scheme === 'neo4j://' ? 'selected' : ''
              }>neo4j://</option>
            </select>
            <label for="host">Host</label>
            <input type="text" id="host" placeholder="localhost" value="${
              this._connection?.host
            }"/>
            <label for="port">Port</label>
            <input type="text" id="port" placeholder="7687" value="${
              this._connection?.port
            }"/>
            <label for="database">Database</label>
            <input type="text" id="database" placeholder="neo4j" value="${
              this._connection?.database
            }"/>
            <label for="user">User</label>
            <input type="text" id="user" placeholder="neo4j" value="${
              this._connection?.user
            }"/>
            <label for="password">password</label>
            <input type="password" id="password" />
            <button type="button" id="test-connection">Test connection</button>
            <button type="button" id="add-connection">${
              this._connection ? 'Edit Connection' : 'Add Connection'
            }</button>
          </form>
          <script nonce="${nonce}" src="${connectionPanelJsUri}"></script>
        </body>
      </html>`;
  }
}
