import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';

import { ParserRuleContext, ParseTree, Token } from 'antlr4';
import { DbSchema } from '../../dbSchema';
import {
  EnrichedParsingResult,
  LabelOrRelType,
  LabelType,
  ParsedCypherCmd,
  parserWrapper,
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
  parsingResult: EnrichedParsingResult,
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
  cmd: ParsedCypherCmd;
  parseResult: EnrichedParsingResult;
};

function fixSemanticAnalysisPositions({
  semanticElements,
  cmd,
  parseResult,
}: FixSemanticPositionsArgs): SyntaxDiagnostic[] {
  return semanticElements.map((e) => {
    let token: Token | undefined = undefined;

    const start = Position.create(
      e.position.line - 1 + cmd.start.line - 1,
      e.position.column - 1 + (e.position.line === 1 ? cmd.start.column : 0),
    );

    const startOffset = e.position.offset + cmd.start.start;

    const line = start.line + 1;
    const column = start.character;
    const toExplore: ParseTree[] = [parseResult.result];

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

export function lintCypherQuery(
  wholeFileText: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  const syntaxErrors = validateSyntax(wholeFileText, dbSchema);

  if (syntaxErrors.length > 0) {
    return syntaxErrors;
  }

  return validateSemantics(wholeFileText);
}

export function validateSyntax(
  query: string,
  dbSchema: DbSchema,
): SyntaxDiagnostic[] {
  if (query.length > 0) {
    const parsingResult = parserWrapper.parse(query);
    const diagnostics = parsingResult.diagnostics;

    const labelWarnings = warnOnUndeclaredLabels(parsingResult, dbSchema);
    return diagnostics.concat(labelWarnings).sort(sortByPosition);
  }

  return [];
}

export function validateSemantics(wholeFileText: string): SyntaxDiagnostic[] {
  const reparse = parserWrapper.parse(wholeFileText);
  if (reparse.diagnostics.length > 0) {
    return [];
  }

  /*  
    Semantic analysis can only handle one cypher statement at a time and naturally only supports cypher.
    We work around these limitations by breaking the file into statements, then run semantic analysis 
    on each individual cypher statement and map the positions back to the original query.
    */
  return reparse.collectedCommands
    .flatMap((cmd) => {
      if (cmd.type === 'cypher' && cmd.query.length > 0) {
        const { notifications, errors } = wrappedSemanticAnalysis(cmd.query);

        return fixSemanticAnalysisPositions({
          cmd,
          semanticElements: notifications.concat(errors),
          parseResult: reparse,
        });
      }

      return [];
    })
    .sort(sortByPosition);
}
