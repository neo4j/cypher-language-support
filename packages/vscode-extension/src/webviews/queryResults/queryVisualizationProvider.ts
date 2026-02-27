import {
  WebviewViewProvider,
  WebviewView,
  Uri,
  window,
  ColorThemeKind,
} from 'vscode';
import { getExtensionContext } from '../../contextService';
import path from 'path';
import { getNonce } from '../../getNonce';
import { QueryResultsMessage, views } from './queryResultsTypes';

export class Neo4jQueryVisualizationProvider implements WebviewViewProvider {
  private view: WebviewView | undefined;
  private viewReadyResolver!: (view: WebviewView) => void;
  public viewReadyPromise: Promise<WebviewView>;

  constructor() {
    this.viewReadyPromise = new Promise((resolve) => {
      this.viewReadyResolver = resolve;
    });
  }

  resolveWebviewView(webviewView: WebviewView) {
    this.view = webviewView;
    views.visualizationView = webviewView;
    this.viewReadyResolver(webviewView);

    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this.renderQueryVisualization();

    webviewView.webview.onDidReceiveMessage((msg: QueryResultsMessage) => {
      if (msg.type === 'visualizationUpdate') {
        webviewView.title = msg.result.statement
          ? `Visualization: ${msg.result.statement}`
          : `Visualization`;
      }
    });

    window.onDidChangeActiveColorTheme(async (e) => {
      await this.view.webview.postMessage({
        type: 'themeUpdate',
        isDarkTheme:
          e.kind === ColorThemeKind.Dark ||
          e.kind === ColorThemeKind.HighContrast,
        to: 'visualizationView',
      });
    });
  }

  renderQueryVisualization() {
    const extensionContext = getExtensionContext();
    const queryVizContainerJsPath = Uri.file(
      path.join(
        extensionContext.extensionPath,
        'dist',
        'webviews',
        'queryVisualization.js',
      ),
    );
    const queryVisualizationCssPath = Uri.file(
      path.join(
        extensionContext.extensionPath,
        'resources',
        'styles',
        'queryVisualization.css',
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
    const queryVizCssUri = this.view.webview
      .asWebviewUri(queryVisualizationCssPath)
      .toString();
    const ndlCssUri = this.view.webview.asWebviewUri(ndlCssPath).toString();
    const queryVizContainerJs = this.view.webview
      .asWebviewUri(queryVizContainerJsPath)
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
          <link href="${queryVizCssUri.toString()}" rel="stylesheet">
          </head>
          <body style="margin: 0; padding: 0;">
          <div id="queryVisualization"></div> 
          <script nonce="${nonce}" src="${queryVizContainerJs}"></script>
          </body>
          </html>
        `;
  }
}
