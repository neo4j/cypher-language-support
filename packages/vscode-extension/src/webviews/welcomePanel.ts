import {
  Disposable,
  Uri,
  ViewColumn,
  Webview,
  WebviewPanel,
  window,
} from 'vscode';
import { CONSTANTS } from '../constants';
import { getExtensionContext } from '../contextService';
import { getNonce } from '../getNonce';

export class WelcomePanel {
  private static _currentPanel: WelcomePanel | undefined;

  private static readonly _viewType = 'neo4jWelcome';

  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];

  private constructor(panel: WebviewPanel) {
    this._panel = panel;
    this.update();
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public static createOrShow() {
    const column = window.activeTextEditor
      ? window.activeTextEditor.viewColumn
      : ViewColumn.One;

    if (WelcomePanel._currentPanel) {
      WelcomePanel._currentPanel._panel.reveal(column);
      return;
    }

    const panel = window.createWebviewPanel(
      WelcomePanel._viewType,
      'Welcome to Neo4j for VS Code',
      column ?? ViewColumn.One,
      {
        enableScripts: false,
        // Allow welcome page links to invoke these specific VS Code commands
        enableCommandUris: [
          'workbench.action.openWalkthrough',
          CONSTANTS.COMMANDS.ADD_GRAPHACADEMY_MCP,
          CONSTANTS.COMMANDS.SHOW_CONNECTIONS_AND_CREATE,
        ],
        retainContextWhenHidden: true,
        localResourceRoots: [
          Uri.joinPath(getExtensionContext().extensionUri, 'resources'),
        ],
      },
    );

    panel.iconPath = Uri.joinPath(
      getExtensionContext().extensionUri,
      'resources',
      'images',
      'logo.png',
    );

    WelcomePanel._currentPanel = new WelcomePanel(panel);
  }

  private dispose() {
    WelcomePanel._currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private update(): void {
    this._panel.webview.html = this.getHtmlForWebview(this._panel.webview);
  }

  private getHtmlForWebview(webview: Webview): string {
    const context = getExtensionContext();
    const nonce = getNonce();
    const logoUri = webview.asWebviewUri(
      Uri.joinPath(context.extensionUri, 'resources', 'images', 'logo.png'),
    );

    // Command URI that opens the "Learn Neo4j" walkthrough contributed in package.json
    const walkthroughCategory = `${context.extension.id}#${CONSTANTS.WALKTHROUGHS.LEARN_NEO4J}`;
    const openWalkthroughUri = `command:workbench.action.openWalkthrough?${encodeURIComponent(
      JSON.stringify(walkthroughCategory),
    )}`;

    return `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${
              webview.cspSource
            }; style-src 'nonce-${nonce}';">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style nonce="${nonce}">
              /* Neo4j brand palette (Needle design system) */
              :root {
                --neo4j-blue: #0a6190;
                --neo4j-blue-dark: #02507b;
                --neo4j-cyan: #8fe3e8;
                /* Brand accent for headings/links, deep blue on light themes */
                --neo4j-accent: var(--neo4j-blue);
              }
              body.vscode-dark,
              body.vscode-high-contrast {
                /* Cyan reads better against dark backgrounds */
                --neo4j-accent: var(--neo4j-cyan);
              }

              body {
                font-family: var(--vscode-font-family);
                line-height: 1.5;
                margin: 0;
                padding: 0 0 3rem;
              }
              .content {
                max-width: 980px;
                padding: 0 2rem;
                margin: 0 auto;
              }
              .columns {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                align-items: start;
              }
              .columns h2 {
                margin-top: 1.5rem;
              }
              .footer {
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid var(--vscode-widget-border, rgba(128, 128, 128, 0.35));
              }

              .hero {
                display: flex;
                align-items: center;
                gap: 1.25rem;
                padding: 2rem;
                background: linear-gradient(135deg, var(--neo4j-blue), var(--neo4j-blue-dark));
                color: #ffffff;
              }
              .hero img {
                width: 64px;
                height: 64px;
                flex: 0 0 auto;
              }
              .hero h1 {
                font-size: 1.8rem;
                margin: 0;
                color: #ffffff;
              }
              .hero .lead {
                margin: 0.25rem 0 0;
                color: rgba(255, 255, 255, 0.85);
              }

              h2 {
                font-size: 1.25rem;
                margin-top: 2rem;
                color: var(--neo4j-accent);
                border-bottom: 2px solid var(--neo4j-accent);
                padding-bottom: 0.3rem;
              }
              ul {
                padding-left: 1.2rem;
              }
              li {
                margin: 0.3rem 0;
              }
              a {
                color: var(--neo4j-accent);
                font-weight: 600;
              }
              a:hover {
                text-decoration: underline;
              }

              .button {
                display: inline-block;
                margin-top: 0.5rem;
                padding: 0.6rem 1.1rem;
                border-radius: 4px;
                background: var(--neo4j-blue);
                color: #ffffff;
                font-weight: 600;
                text-decoration: none;
              }
              .button:hover {
                background: var(--neo4j-blue-dark);
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <header class="hero">
              <img src="${logoUri.toString()}" alt="Neo4j logo" />
              <div>
                <h1>Welcome to Neo4j for VS Code</h1>
                <p class="lead">
                  Write, lint, and run Cypher against your Neo4j databases,
                  right inside your editor.
                </p>
              </div>
            </header>

            <div class="content">
              <div class="columns">
                <section>
                  <h2>What you can do</h2>
                  <ul>
                    <li><strong>Syntax highlighting</strong> for Cypher, including Cypher embedded in Markdown, Java, Python, JavaScript, .NET and Go.</li>
                    <li><strong>Linting</strong> for both syntax and semantic errors (type errors, unknown labels, and more), tailored to your database version.</li>
                    <li><strong>Autocompletion</strong> for keywords, functions, labels, properties, database names and more.</li>
                    <li><strong>Signature help</strong> that shows function signatures as you type.</li>
                    <li><strong>Formatting</strong> to tidy up your queries according to the Cypher style guide.</li>
                    <li><strong>Connection management</strong> for one or more Neo4j instances.</li>
                    <li><strong>Query parameters</strong> you can define, edit and reuse.</li>
                    <li><strong>Query execution</strong> with results and graph visualization.</li>
                  </ul>
                  <p>
                    <a href="${CONSTANTS.LINKS.README}">Find more information</a>
                    about these features.
                  </p>
                  <p>
                    <a class="button" href="command:${CONSTANTS.COMMANDS.SHOW_CONNECTIONS_AND_CREATE}">Add connection</a>
                  </p>
                </section>

                <section>
                  <h2>Get Started with Neo4j</h2>
                  <p>
                    New to Neo4j? Get started for free with the fundamentals
                    courses from Neo4j GraphAcademy, covering graph databases,
                    Cypher, data modeling and importing data.
                  </p>
                  <p>
                    <a class="button" href="${openWalkthroughUri}">Open the Learn Neo4j walkthrough</a>
                  </p>
                </section>
              </div>

              <section>
                <h2>Supercharge your AI coding agent</h2>
                <p>
                  Add the GraphAcademy MCP server to give your AI coding agent
                  tools to learn Neo4j, design graph data models, generate
                  Cypher, and scaffold projects.
                </p>
                <p>
                  <a class="button" href="command:${CONSTANTS.COMMANDS.ADD_GRAPHACADEMY_MCP}">Add the GraphAcademy MCP server</a>
                </p>
              </section>

              <p class="footer">
                Visit the
                <a href="${CONSTANTS.LINKS.REPOSITORY}">project on GitHub</a>
                to learn more, report issues, or contribute.
              </p>
            </div>
          </body>
        </html>`;
  }
}
