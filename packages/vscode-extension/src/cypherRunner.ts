import { parseStatementsStrs } from '@neo4j-cypher/language-support';
import { ExtensionContext, Uri } from 'vscode';
import { Connection } from './connectionService';
import ResultWindow from './webviews/resultPanel';

export default class CypherRunner {
  private results: Map<string, ResultWindow> = new Map();

  // TODO Nacho: do we need the extension context here?
  constructor(public readonly context: ExtensionContext) {}

  async run(connection: Connection, uri: Uri, input: string) {
    const statements = parseStatementsStrs(input);

    const filePath = uri.toString();

    if (this.results.has(filePath)) {
      const resultWindow = this.results.get(filePath);
      // The statements could have changed at this point
      resultWindow.statements = statements;
      await resultWindow.executeStatements();
    } else {
      // This path is platfom independent according to VSCode documentation
      const fileName = uri.path.split('/').pop();

      const resultWindow = new ResultWindow(
        this.context,
        connection,
        fileName,
        statements,
      );
      // Add to map
      this.results.set(filePath, resultWindow);
      // Remove on close
      resultWindow.panel.onDidDispose(() => this.results.delete(filePath));

      return resultWindow.run();
    }
  }
}
