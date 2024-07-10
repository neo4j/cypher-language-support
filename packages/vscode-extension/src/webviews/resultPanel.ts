import { ExtensionContext, ViewColumn, WebviewPanel, window } from 'vscode';
import { Connection } from '../connectionService';
import { getSchemaPoller } from '../contextService';
import OutputChannel from '../output';
import {
  getErrorContent,
  getLoadingContent,
  getResultContent,
} from './resultUtils';

export default class ResultWindow {
  public panel: WebviewPanel;

  constructor(
    public readonly context: ExtensionContext,
    public readonly connection: Connection,
    public readonly cypher: string,
  ) {
    this.panel = window.createWebviewPanel(
      'neo4j.result',
      cypher,
      ViewColumn.Two,
      { retainContextWhenHidden: true, enableScripts: true },
    );

    window.registerWebviewPanelSerializer;
  }

  async run() {
    // TODO Nacho rename this, shouldn't be called a schema poller anymore
    const schemaPoller = getSchemaPoller();

    // Start output
    OutputChannel.append('--');

    OutputChannel.append(
      `Executing query on database ${this.connection.database || 'neo4j'}`,
    );
    OutputChannel.append(this.cypher);

    try {
      // Loading
      this.panel.webview.html = getLoadingContent(this.cypher);

      // Run it
      const res = await schemaPoller.runQuery(this.cypher);

      // Show results in webframe
      this.panel.webview.html = getResultContent(
        this.cypher,
        res,
        this.panel.webview,
      );
    } catch (e: unknown) {
      // Output error in neo4j channel
      OutputChannel.append('Error Running Query');
      if (e instanceof Error) {
        OutputChannel.append(e.message);
        // Update Webview
        this.panel.webview.html = getErrorContent(this.cypher, e);
      }
      OutputChannel.show();
    }
  }
}
