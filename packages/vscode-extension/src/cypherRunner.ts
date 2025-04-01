import { parseStatementsStrs } from '@neo4j-cypher/language-support';
import { Uri } from 'vscode';
import { addParameter } from './commandHandlers/params';
import { Connection } from './connectionService';
import { getDeserializedParams } from './parameterService';
import ResultWindow from './webviews/resultWindow';

export function extractParameters(strings: string[]): string[] {
  const paramSet = new Set<string>();

  strings.forEach((str) => {
    const matches = str.match(/\$`([^`]+)`|\$(\w+)/g);
    if (matches) {
      matches.forEach((match) => {
        // Remove the '$'
        const param = match.slice(1);
        if (param.startsWith('`') && param.endsWith('`')) {
          // Remove the backticks
          paramSet.add(param.slice(1, -1));
        } else {
          paramSet.add(param);
        }
      });
    }
  });

  return Array.from(paramSet);
}

export default class CypherRunner {
  private results: Map<string, ResultWindow> = new Map();

  constructor() {}

  async run(connection: Connection, uri: Uri, input: string) {
    const statements = parseStatementsStrs(input);
    const filePath = uri.toString();
    const parameters = getDeserializedParams();
    const statementParams = extractParameters(statements);

    for (const param of statementParams) {
      if (parameters[param] === undefined) {
        await addParameter(param);
      }
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
