/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import {
  Disposable,
  Uri,
  ViewColumn,
  Webview,
  WebviewPanel,
  window,
  workspace,
} from 'vscode';
import { ConnectionManager } from './ConnectionManager';
import { getNonce } from './getNonce';
import { LangugageClientManager } from './LanguageClientManager';
import { SecretsManager } from './SecretsManager';

export class ConnectionPanel {
  public static currentPanel: ConnectionPanel | undefined;

  public static readonly viewType = 'connection';

  private readonly _panel: WebviewPanel;
  private readonly _extensionUri: Uri;
  private _disposables: Disposable[] = [];

  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this.update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public static createOrShow(extensionUri: Uri) {
    const column = window.activeTextEditor
      ? window.activeTextEditor.viewColumn
      : undefined;

    if (ConnectionPanel.currentPanel) {
      ConnectionPanel.currentPanel._panel.reveal(column);
      ConnectionPanel.currentPanel.update();
      return;
    }

    // TODO - this panel could be used to create OR edit a connection
    const panel = window.createWebviewPanel(
      ConnectionPanel.viewType,
      'Create New Connection',
      column || window.activeTextEditor?.viewColumn || ViewColumn.One,
      {
        enableScripts: true,
      },
    );

    ConnectionPanel.currentPanel = new ConnectionPanel(panel, extensionUri);
  }

  public dispose() {
    ConnectionPanel.currentPanel = undefined;

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
    // TODO - add a type for connection
    webview.onDidReceiveMessage(
      async (data: {
        command: string;
        settings: {
          connectionName: string;
          scheme: string;
          host: string;
          port: string;
          user: string;
          password: string;
          database: string;
        };
      }) => {
        switch (data.command) {
          case 'onTestConnection': {
            await this.testConnection(data.settings);
            break;
          }
          case 'onAddConnection': {
            // TODO - make this a function
            const success = await this.testConnection(data.settings);
            if (success) {
              await ConnectionManager.setConnection(
                data.settings.connectionName,
                data.settings,
              );
              await SecretsManager.setPasswordForConnection(
                data.settings.connectionName,
                data.settings.password,
              );

              const connect =
                workspace.getConfiguration('neo4j').get<boolean>('connect') ??
                false;
              const trace = workspace
                .getConfiguration('neo4j')
                .get<{ server: 'off' | 'messages' | 'verbose' }>('trace') ?? {
                server: 'off',
              };
              const credentials = this.getCredentials(data.settings);
              await LangugageClientManager.globalClient.sendNotification(
                'connectionChanged',
                {
                  trace: trace,
                  connect: connect,
                  connectUrl: this.getConnectionString(data.settings),
                  user: credentials.username,
                  password: credentials.password,
                },
              );
            }
            break;
          }
        }
      },
    );
  }

  // TODO - add a type for settings
  private async testConnection(settings: {
    connectionName: string;
    scheme: string;
    host: string;
    port: string;
    user: string;
    password: string;
    database: string;
  }): Promise<boolean> {
    const url = this.getConnectionString(settings);
    const credentials = this.getCredentials(settings);
    // TODO - Change this to use a transient connection manager
    const neo4jSchemaPoller = new Neo4jSchemaPoller();
    const success = await neo4jSchemaPoller.testConnection(url, credentials, {
      appName: 'vscode-extension',
    });
    if (success) {
      await window.showInformationMessage('Connection successful');
    } else {
      await window.showErrorMessage('Connection failed');
    }

    return success;
  }

  // TODO - add a type for settings
  private getConnectionString(settings: {
    scheme: string;
    host: string;
    port: string;
  }): string {
    return `${settings.scheme}${settings.host}:${settings.port}`;
  }

  // TODO - add a type for settings
  private getCredentials(settings: { user: string; password: string }): {
    username: string;
    password: string;
  } {
    return {
      username: settings.user,
      password: settings.password,
    };
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
          <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="${resetCssUri}" rel="stylesheet">
          <link href="${vscodeCssUri}" rel="stylesheet">
          <script nonce="${nonce}">
            const vscode = acquireVsCodeApi();
          </script>
        </head>
        <body>
          <h1>Create New Connection</h1>
          <form>
            <label for="connection-name">Connection name</label>
            <input type="text" id="connection-name" placeholder="Default connection" />
            <label for="scheme">Scheme</label>
            <select id="scheme">
              <option value="bolt://">bolt://</option>
              <option value="neo4j://">neo4j://</option>
            </select>
            <label for="host">Host</label>
            <input type="text" id="host" placeholder="localhost" />
            <label for="port">Port</label>
            <input type="text" id="port" placeholder="7687" />
            <label for="database">Database</label>
            <input type="text" id="database" placeholder="neo4j" />
            <label for="user">User</label>
            <input type="text" id="user" placeholder="neo4j" />
            <label for="password">password</label>
            <input type="password" id="password" />
            <button type="button" id="test-connection">Test connection</button>
            <button type="button" id="add-connection">Add connection</button>
          </form>
          <script nonce="${nonce}" src="${connectionPanelJsUri}"></script>
        </body>
      </html>`;
  }
}
