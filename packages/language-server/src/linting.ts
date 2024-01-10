import {
  findEndPosition,
  parserWrapper,
  validateSyntax,
} from '@neo4j-cypher/language-support';
import debounce from 'lodash.debounce';
import { join } from 'path';
import { Diagnostic, TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import workerpool from 'workerpool';
import { LinterTask, LintWorker } from './lint-worker';

const pool = workerpool.pool(join(__dirname, 'lint-worker.js'), {
  minWorkers: 2,
});

let lastSemanticJob: LinterTask | undefined;

async function rawLintDocument(
  change: TextDocumentChangeEvent<TextDocument>,
  sendDiagnostics: (diagnostics: Diagnostic[]) => void,
) {
  const { document } = change;

  const query = document.getText();
  if (query.length === 0) {
    return;
  }

  const syntaxErrors = validateSyntax(query, {});

  sendDiagnostics(syntaxErrors);

  if (syntaxErrors.length === 0) {
    try {
      if (lastSemanticJob !== undefined && !lastSemanticJob.resolved) {
        void lastSemanticJob.cancel();
      }

      const proxyWorker = (await pool.proxy()) as unknown as LintWorker;
      lastSemanticJob = proxyWorker.validateSemantics(query);
      const result = await lastSemanticJob;

      sendDiagnostics(
        result.map((el) => findEndPosition(el, parserWrapper.parsingResult)),
      );
    } catch (err) {
      console.error(err);
    }
  }
}

export const lintDocument = debounce(rawLintDocument, 600, {
  leading: false,
  trailing: true,
});

export const cleanupWorkers = () => {
  void pool.terminate();
};
