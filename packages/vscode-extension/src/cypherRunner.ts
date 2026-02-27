import {
  parseParameters,
  parseStatementsStrs,
} from '@neo4j-cypher/language-support';
import { addParameter } from './commandHandlers/params';
import { getDeserializedParams } from './parameterService';

export default class CypherRunner {
  constructor() {}

  async run(
    input: string,
    renderBottomPanel: (statements: string[]) => Promise<void>,
  ) {
    const statements = parseStatementsStrs(input);
    const statementParams = parseParameters(input, false);
    const parameters = getDeserializedParams();

    for (const param of statementParams) {
      if (parameters[param] === undefined) {
        await addParameter(param);
      }
    }

    await renderBottomPanel(statements);
    return;
  }
}
