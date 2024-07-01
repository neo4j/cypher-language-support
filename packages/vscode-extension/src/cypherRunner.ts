import { ExtensionContext } from 'vscode';
import { Connection } from './connectionService';
import OutputChannel from './output';
import ResultWindow from './webviews/resultPanel';

export default class CypherRunner {
  private results: Map<string, ResultWindow> = new Map();

  // TODO Nacho: do we need the extension context here?
  constructor(public readonly context: ExtensionContext) {}

  async run(connection: Connection, input: string): Promise<void> {
    // Split text on ; and a new line
    const queries = input.split(';\n');

    // Run individual queries
    for (const query of queries) {
      if (query && query !== '') {
        await this.runSingle(connection, query.trim());
      }
    }
  }

  async runSingle(connection: Connection, cypher: string): Promise<void> {
    try {
      // Check for existing query result window
      const key = Buffer.from(cypher).toString('base64');

      if (this.results.has(key)) {
        return this.results.get(key).run();
      }

      const resultWindow = new ResultWindow(this.context, connection, cypher);

      // Add to map
      this.results.set(key, resultWindow);

      // Remove on close
      resultWindow.panel.onDidDispose(() => this.results.delete(key));

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
