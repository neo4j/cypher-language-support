import { parseStatementsStrs } from '@neo4j-cypher/language-support';
import { ExtensionContext, Uri } from 'vscode';
import { Connection } from './connectionService';
import OutputChannel from './output';
import ResultWindow from './webviews/resultPanel';

export default class CypherRunner {
  private results: Map<string, ResultWindow> = new Map();

  // TODO Nacho: do we need the extension context here?
  constructor(public readonly context: ExtensionContext) {}

  async run(connection: Connection, uri: Uri, input: string): Promise<void> {
    const statements = parseStatementsStrs(input);

    // Run individual statements
    for (const statement of statements) {
      await this.runStatement(connection, uri, statement.trim());
    }
  }

  async runStatement(
    connection: Connection,
    uri: Uri,
    cypher: string,
  ): Promise<void> {
    try {
      // Check for existing query result window
      const subTabKey = Buffer.from(cypher).toString('base64');

      if (this.results.has(subTabKey)) {
        return this.results.get(subTabKey).run();
      }

      const resultWindow = new ResultWindow(this.context, connection, cypher);

      // Add to map
      this.results.set(subTabKey, resultWindow);

      // Remove on close
      resultWindow.panel.onDidDispose(() => this.results.delete(subTabKey));

      // Run the query
      return resultWindow.run();
    } catch (e: unknown) {
      OutputChannel.append('Error Running Query');
      if (e instanceof Error) {
        OutputChannel.append(e.message);
      }
      OutputChannel.show();
    }
  }
}
