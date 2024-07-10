import { parseStatementsStrs } from '@neo4j-cypher/language-support';
import { ExtensionContext, Uri } from 'vscode';
import { Connection } from './connectionService';
import ResultWindow from './webviews/resultPanel';

export default class CypherRunner {
  private results: Map<string, ResultWindow> = new Map();

  // TODO Nacho: do we need the extension context here?
  constructor(public readonly context: ExtensionContext) {}

  async run(connection: Connection, uri: Uri, input: string): Promise<void> {
    const statements = parseStatementsStrs(input);

    const fileName = uri.toString();
    if (this.results.has(fileName)) {
      return this.results.get(fileName).run();
    }

    const resultWindow = new ResultWindow(
      this.context,
      connection,
      fileName,
      statements,
    );
    // Add to map
    this.results.set(fileName, resultWindow);
    // Remove on close
    resultWindow.panel.onDidDispose(() => this.results.delete(fileName));

    return resultWindow.run();
  }
}
