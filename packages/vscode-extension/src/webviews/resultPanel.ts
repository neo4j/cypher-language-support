import { QueryResult } from 'neo4j-driver';
import path from 'path';
import {
  ExtensionContext,
  Uri,
  ViewColumn,
  WebviewPanel,
  window,
} from 'vscode';
import { Connection } from '../connectionService';
import { getSchemaPoller } from '../contextService';
import {
  querySummary,
  setAllTabsToLoading,
  toNativeTypes,
} from './resultUtils';

export type ResultRows = Record<string, unknown>[];

export type Result = {
  rows: ResultRows;
  querySummary: string[];
};

export type ResultMessage =
  | {
      statements: string[];
      type: 'executing';
    }
  | {
      index: number;
      result: Result;
      type: 'success';
    }
  | {
      index: number;
      type: 'error';
    };

export default class ResultWindow {
  public panel: WebviewPanel;
  // TODO Nacho rename this, shouldn't be called a schema poller anymore
  schemaPoller = getSchemaPoller();

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

  run() {
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

    webview.html = setAllTabsToLoading(resultTabsJs);

    // Listener para recibir mensajes desde la webview
    webview.onDidReceiveMessage(
      async (message) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        switch (message.type) {
          case 'resultsWindowLoaded': {
            const message: ResultMessage = {
              type: 'executing',
              statements: this.statements,
            };
            await webview.postMessage(message);
            for (const [index, statement] of this.statements.entries()) {
              await this.executeStatement(statement, index);
            }
            return;
          }
          case 'alert':
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            await window.showErrorMessage(message.text);
        }
      },
      undefined,
      this.context.subscriptions,
    );
  }

  async executeStatement(statement: string, index: number) {
    const webview = this.panel.webview;
    const result: QueryResult | 'error' = await this.schemaPoller.runQuery(
      statement,
    );
    let message: ResultMessage;

    if (result === 'error') {
      message = {
        type: 'error',
        index: index,
      };
    } else {
      const resultRecords = result.records.map((record) =>
        toNativeTypes(record.toObject()),
      );
      message = {
        type: 'success',
        index: index,
        result: {
          rows: resultRecords,
          querySummary: querySummary(result),
        },
      };
    }
    await webview.postMessage(message);
  }
}
