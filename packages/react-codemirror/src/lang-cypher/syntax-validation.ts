import { linter } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import {
  runSemanticAnalysis,
  validateSyntax,
} from '@neo4j-cypher/language-support';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { CypherConfig } from './lang-cypher';

export const cypherLinter: (config: CypherConfig) => Extension = (config) =>
  linter((view) => {
    if (!config.lint) {
      return [];
    }

    return validateSyntax(view.state.doc.toString(), config.schema).map(
      (diagnostic) => ({
        from: diagnostic.offsets.start,
        to: diagnostic.offsets.end,
        severity:
          diagnostic.severity === DiagnosticSeverity.Error
            ? 'error'
            : 'warning',
        message: diagnostic.message,
      }),
    );
  });

export const semanticAnalysisLinter: (config: CypherConfig) => Extension = (
  config,
) =>
  linter(async (view) => {
    console.log('semanticAnalysisLinter started');
    if (!config.lint) {
      return [];
    }

    const diagnostics = await runSemanticAnalysis(view.state.doc.toString());
    return diagnostics.map((diagnostic) => ({
      from: diagnostic.offsets.start,
      to: diagnostic.offsets.end,
      severity:
        diagnostic.severity === DiagnosticSeverity.Error ? 'error' : 'warning',
      message: diagnostic.message,
    }));
  });
