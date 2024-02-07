import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';

import { ParserRuleContext, ParseTree, Token } from 'antlr4';
import { DbSchema } from '../../dbSchema';
import {
  LabelOrRelType,
  LabelType,
  parserWrapper,
  StatementParsing,
} from '../../parserWrapper';
import {
  SemanticAnalysisElement,
  wrappedSemanticAnalysis,
} from './semanticAnalysisWrapper';
import { SyntaxDiagnostic } from './syntaxValidationHelpers';

function detectNonDeclaredLabel(
  labelOrRelType: LabelOrRelType,
  dbLabels: Set<string>,
  dbRelationshipTypes: Set<string>,
): SyntaxDiagnostic | undefined {
  const labelName = labelOrRelType.labelText;
  const notInDatabase =
    (labelOrRelType.labeltype === LabelType.nodeLabelType &&
      !dbLabels.has(labelName)) ||
    (labelOrRelType.labeltype === LabelType.relLabelType &&
      !dbRelationshipTypes.has(labelName)) ||
    (!dbLabels.has(labelName) && !dbRelationshipTypes.has(labelName));

  if (notInDatabase && !labelOrRelType.couldCreateNewLabel) {
    const labelChunks = labelName.split('\n');
    const linesOffset = labelChunks.length - 1;
    const lineIndex = labelOrRelType.line - 1;
    const startColumn = labelOrRelType.column;
    const endColumn =
      linesOffset == 0
        ? startColumn + labelName.length
        : labelChunks.at(-1)?.length ?? 0;

    const warning: SyntaxDiagnostic = {
      severity: DiagnosticSeverity.Warning,
      range: {
        start: Position.create(lineIndex, startColumn),
        end: Position.create(lineIndex + linesOffset, endColumn),
      },
      offsets: labelOrRelType.offsets,
      message:
        labelOrRelType.labeltype +
        ' ' +
        labelName +
        " is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
    };

    return warning;
  }

  return undefined;
}

function warnOnUndeclaredLabels(
  parsingResult: StatementParsing,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  const warnings: SyntaxDiagnostic[] = [];

  if (dbSchema.labels && dbSchema.relationshipTypes) {
    const dbLabels = new Set(dbSchema.labels);
    const dbRelationshipTypes = new Set(dbSchema.relationshipTypes);
    const labelsAndRelTypes = parsingResult.collectedLabelOrRelTypes;

    labelsAndRelTypes.forEach((labelOrRelType) => {
      const warning = detectNonDeclaredLabel(
        labelOrRelType,
        dbLabels,
        dbRelationshipTypes,
      );

      if (warning) warnings.push(warning);
    });
  }

  return warnings;
}

type FixSemanticPositionsArgs = {
  semanticElements: SemanticAnalysisElement[];
  parseResult: StatementParsing;
};

function fixSemanticAnalysisPositions({
  semanticElements,
  parseResult,
}: FixSemanticPositionsArgs): SyntaxDiagnostic[] {
  const cmd = parseResult.command;
  return semanticElements.map((e) => {
    let token: Token | undefined = undefined;

    const start = Position.create(
      e.position.line - 1 + cmd.start.line - 1,
      e.position.column - 1 + (e.position.line === 1 ? cmd.start.column : 0),
    );

    const startOffset = e.position.offset + cmd.start.start;

    const line = start.line + 1;
    const column = start.character;
    const toExplore: ParseTree[] = [parseResult.ctx];

    while (toExplore.length > 0 && !token) {
      const current: ParseTree = toExplore.pop();

      if (current instanceof ParserRuleContext) {
        const startToken = current.start;
        if (startToken.line === line && startToken.column === column) {
          token = current.stop;
        }
        if (current.children) {
          current.children.forEach((child) => toExplore.push(child));
        }
      }
    }

    if (token === undefined) {
      return {
        severity: e.severity,
        message: e.message,
        range: {
          start: start,
          end: start,
        },
        offsets: {
          start: startOffset,
          end: startOffset,
        },
      };
    } else {
      return {
        severity: e.severity,
        message: e.message,
        range: {
          start: start,
          end: Position.create(
            token.line - 1,
            token.column + token.text.length,
          ),
        },
        offsets: {
          start: startOffset,
          end: token.stop + 1,
        },
      };
    }
  });
}

export function sortByPosition(a: SyntaxDiagnostic, b: SyntaxDiagnostic) {
  const lineDiff = a.range.start.line - b.range.start.line;
  if (lineDiff !== 0) return lineDiff;

  return a.range.start.character - b.range.start.character;
}

// TODO Does this need to be exported
export function lintCypherQuery(
  query: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  const syntaxErrors = validateSyntax(query, dbSchema);
  if (syntaxErrors.length > 0) {
    return syntaxErrors;
  }

  const semanticErrors = validateSemantics(query);
  return semanticErrors;
}

// TODO Does this need to be exported
export function validateSyntax(
  query: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  if (query.length === 0) {
    return [];
  }
  const statements = parserWrapper.parse(query);
  const result = statements.statementsParsing.flatMap((statement) => {
    const diagnostics = statement.diagnostics;
    const labelWarnings = warnOnUndeclaredLabels(statement, dbSchema);
    return diagnostics.concat(labelWarnings).sort(sortByPosition);
  });

  return result;
}

/**
 * Assumes the provided query has no parse errors
 */
export function validateSemantics(query: string): SyntaxDiagnostic[] {
  if (query.length > 0) {
    const cachedParse = parserWrapper.parse(query);
    const statements = cachedParse.statementsParsing;
    const semanticErrors = statements.flatMap((current) => {
      const cmd = current.command;
      if (cmd.type === 'cypher' && cmd.statement.length > 0) {
        const { notifications, errors } = wrappedSemanticAnalysis(
          cmd.statement,
        );

        const elements = notifications.concat(errors);
        const result = fixSemanticAnalysisPositions({
          semanticElements: elements,
          parseResult: current,
        }).sort(sortByPosition);
        return result;
      }

      return [];
    });

    return semanticErrors;
  }

  return [];
}
