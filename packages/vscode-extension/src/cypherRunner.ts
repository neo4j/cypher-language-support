import {
  parseParameters,
  parseStatementsStrs,
} from '@neo4j-cypher/language-support';
import { Uri, workspace } from 'vscode';
import { addParameter } from './commandHandlers/params';
import { Connection } from './connectionService';
import { getDeserializedParams } from './parameterService';
import ResultWindow from './webviews/resultWindow';

export default class CypherRunner {
  private results: Map<string, ResultWindow> = new Map();

  constructor() {}

  async run(
    connection: Connection,
    uri: Uri,
    input: string,
    callback: (statements: string[]) => Promise<void>,
  ) {
    const statements = parseStatementsStrs(input);
    const statementParams = parseParameters(input, false);
    const filePath = uri.toString();
    const parameters = getDeserializedParams();
    const config = workspace.getConfiguration('neo4j.features');
    const bottomPanelEnabled = config.get('showBottomPanel', false);

    for (const param of statementParams) {
      if (parameters[param] === undefined) {
        await addParameter(param);
      }
    }

    if (bottomPanelEnabled) {
      await callback(statements);
      return;
    }

    if (this.results.has(filePath)) {
      const resultWindow = this.results.get(filePath);
      /* We have to update the connection and the statements
         to be able to reuse the window, as any of those
         could have changed 
      */
      resultWindow.statements = statements;
      resultWindow.connection = connection;
      await resultWindow.executeStatements();
    } else {
      // This path is platfom independent according to VSCode documentation
      const shortFileName = uri.path.split('/').pop();

      const resultWindow = new ResultWindow(
        shortFileName,
        connection,
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
