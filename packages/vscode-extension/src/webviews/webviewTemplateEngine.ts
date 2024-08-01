import path from 'path';
import { Uri, Webview } from 'vscode';
import { getExtensionContext } from '../contextService';
import { getNonce } from '../getNonce';

export function getWebviewHtml(
  webview: Webview,
  body: string,
  stylesheets?: string[],
  scripts?: string[],
): string {
  const context = getExtensionContext();

  const resetCssPath = Uri.file(
    path.join(context.extensionPath, 'resources', 'styles', 'reset.css'),
  );
  const resetCssUri = webview.asWebviewUri(resetCssPath);

  const vscodeCssPath = Uri.file(
    path.join(context.extensionPath, 'resources', 'styles', 'vscode.css'),
  );
  const vscodeCssUri = webview.asWebviewUri(vscodeCssPath);

  let webviewCssUris: Uri[] | undefined;
  if (stylesheets && stylesheets.length) {
    webviewCssUris = stylesheets.map((stylesheet) => {
      const cssPath = Uri.file(
        path.join(context.extensionPath, 'resources', 'styles', stylesheet),
      );
      return webview.asWebviewUri(cssPath);
    });
  }

  let webviewScriptUris: Uri[] | undefined;
  if (scripts && scripts.length) {
    webviewScriptUris = scripts.map((script) => {
      const scriptPath = Uri.file(
        path.join(context.extensionPath, 'dist', 'webviews', script),
      );
      return webview.asWebviewUri(scriptPath);
    });
  }

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
        ${webviewCssUris
          .map((uri) => `<link href="${uri.toString()}" rel="stylesheet">`)
          .join('\n')}
        <script nonce="${nonce}">
            const vscode = acquireVsCodeApi();
        </script>
        </head>
        <body>
            ${body}
            ${webviewScriptUris
              .map(
                (uri) =>
                  `<script src="${uri.toString()}" nonce="${nonce}"></script>`,
              )
              .join('\n')}
        </body>
    </html>
  `;
}
