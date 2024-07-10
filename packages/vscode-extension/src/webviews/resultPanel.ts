import path from 'path';
import {
  ExtensionContext,
  Uri,
  ViewColumn,
  WebviewPanel,
  window,
} from 'vscode';
import { Connection } from '../connectionService';
import { setAllTabsToLoading } from './resultUtils';

export default class ResultWindow {
  public panel: WebviewPanel;

  constructor(
    public readonly context: ExtensionContext,
    public readonly connection: Connection,
    public readonly fileName: string,
    public readonly statements: string[],
  ) {
    this.panel = window.createWebviewPanel(
      'neo4j.result',
      fileName,
      ViewColumn.Two,
      { retainContextWhenHidden: true, enableScripts: true },
    );

    window.registerWebviewPanelSerializer;
  }

  async run() {
    // TODO Nacho rename this, shouldn't be called a schema poller anymore
    //const schemaPoller = getSchemaPoller();
    //const results: Promise<EagerResult<RecordShape> | undefined>[] = [];
    const webview = this.panel.webview;

    const resultTabsJsPath = Uri.file(
      path.join(
        this.context.extensionPath,
        'dist',
        'webviews',
        'resultTabs.js',
      ),
    );

    const resultTabsJs = webview.asWebviewUri(resultTabsJsPath).toString();

    // Set all the tabs to loading

    // Listener para recibir mensajes desde la webview
    webview.onDidReceiveMessage(
      async (message) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        switch (message.type) {
          case 'resultsWindowLoaded':
            await webview.postMessage({
              type: 'beginStatementsExecution',
              statementResults: this.statements.map((statement) => {
                return {
                  statement: statement,
                  status: 'executing',
                };
              }),
            });
            return;
          case 'alert':
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            await window.showErrorMessage(message.text);
        }
      },
      undefined,
      this.context.subscriptions,
    );

    webview.html = setAllTabsToLoading(resultTabsJs);

    // for (const statement of this.statements) {
    //   // Start output
    //   OutputChannel.append('--');

    //   OutputChannel.append(
    //     `Executing query ${statement} on database ${
    //       this.connection.database || 'neo4j'
    //     }`,
    //   );
    //   OutputChannel.append(statement);

    //   try {
    //     // Loading
    //     this.panel.webview.html = getLoadingContent(this.cypher, resultTabs);

    //     // Run it
    //     const res = await schemaPoller.runQuery(statement);
    //     results.push(res);
    //     // Show results in webframe
    //     this.panel.webview.html = getResultContent(
    //       this.cypher,
    //       res,
    //       this.panel.webview,
    //     );
    //   } catch (e: unknown) {
    //     // Output error in neo4j channel
    //     OutputChannel.append('Error Running Query');
    //     if (e instanceof Error) {
    //       OutputChannel.append(e.message);
    //       // Update Webview
    //       this.panel.webview.html = getErrorContent(this.cypher, e);
    //     }
    //     OutputChannel.show();
    //   }
    // }
  }
}
