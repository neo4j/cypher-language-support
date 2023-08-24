import {
  Diagnostic,
  DiagnosticSeverity,
  Position,
} from 'vscode-languageserver-types';

import { ParserRuleContext } from 'antlr4';
import { DbInfo } from '../dbInfo';
import {
  ClauseContext,
  CreateClauseContext,
  ExpressionContext,
  MergeClauseContext,
} from '../generated-parser/CypherParser';
import {
  findParent,
  inLabelExpressionPredicate,
  inNodeLabel,
  inRelationshipType,
} from '../helpers';
import { EnrichedParsingResult, parserWrapper } from '../parserWrapper';

function detectNonDeclaredLabel(
  ctx: ParserRuleContext,
  labelName: string,
  dbLabels: Set<string>,
  dbRelationshipTypes: Set<string>,
): Diagnostic | undefined {
  const nodeLabel = inNodeLabel(ctx);
  const relType = inRelationshipType(ctx);
  const labelExpressionPred = inLabelExpressionPredicate(ctx);

  if (
    (nodeLabel && !dbLabels.has(labelName)) ||
    (relType && !dbRelationshipTypes.has(labelName)) ||
    (labelExpressionPred &&
      !dbLabels.has(labelName) &&
      !dbRelationshipTypes.has(labelName))
  ) {
    let typeStr: string;
    if (nodeLabel) typeStr = 'Label';
    else if (relType) typeStr = 'Relationship type';
    else typeStr = 'Label or relationship type';

    const parent = findParent(
      ctx,
      (ctx) => ctx instanceof ClauseContext || ctx instanceof ExpressionContext,
    );

    if (
      !(
        parent instanceof CreateClauseContext ||
        parent instanceof MergeClauseContext
      )
    ) {
      const start = ctx.start;
      const labelChunks = labelName.split('\n');
      const linesOffset = labelChunks.length - 1;
      const lineIndex = start.line - 1;
      const startColumn = start.column;
      const endColumn =
        linesOffset == 0
          ? startColumn + labelName.length
          : labelChunks.at(-1).length;

      const warning: Diagnostic = {
        severity: DiagnosticSeverity.Warning,
        range: {
          start: Position.create(lineIndex, startColumn),
          end: Position.create(lineIndex + linesOffset, endColumn),
        },
        message:
          typeStr +
          ' ' +
          labelName +
          " is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
      };

      return warning;
    }
  }

  return undefined;
}

function warnOnUndeclaredLabels(
  parsingResult: EnrichedParsingResult,
  dbInfo: DbInfo,
): Diagnostic[] {
  const warnings: Diagnostic[] = [];

  if (dbInfo.labels && dbInfo.relationshipTypes) {
    const dbLabels = new Set<string>();
    const dbRelationshipTypes = new Set<string>();

    dbInfo.labels.forEach((label) => dbLabels.add(label));
    dbInfo.relationshipTypes.forEach((type) => dbRelationshipTypes.add(type));

    if (dbInfo.labels && dbInfo.relationshipTypes) {
      parsingResult.collectedLabelOrRelTypes.forEach((labelOrRelType) => {
        const warning = detectNonDeclaredLabel(
          labelOrRelType.ctx,
          labelOrRelType.text,
          dbLabels,
          dbRelationshipTypes,
        );

        if (warning) warnings.push(warning);
      });
    }
  }

  return warnings;
}

export function validateSyntax(
  wholeFileText: string,
  dbInfo: DbInfo,
): Diagnostic[] {
  const parsingResult = parserWrapper.parse(wholeFileText);
  const errors = parsingResult.errors;
  const warnings = warnOnUndeclaredLabels(parsingResult, dbInfo);
  const diagnostics = errors.concat(warnings);

  return diagnostics;
}
