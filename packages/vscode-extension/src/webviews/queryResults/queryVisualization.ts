import { WebviewViewProvider, ExtensionContext, WebviewView } from 'vscode';

export class Neo4jQueryVisualizationProvider implements WebviewViewProvider {
  constructor(private readonly context: ExtensionContext) {}

  resolveWebviewView(
    webviewView: WebviewView,
    // context: WebviewViewResolveContext,
    // _token: CancellationToken,
  ) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = `<html><body><h1>Hello from the viz!</h1></body></html>`;
  }
}
