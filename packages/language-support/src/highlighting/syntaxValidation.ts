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
  LabelNameContext,
  LabelNameIsContext,
  LabelOrRelTypeContext,
  MergeClauseContext,
} from '../generated-parser/CypherParser';
import CypherParserVisitor from '../generated-parser/CypherParserVisitor';
import {
  findParent,
  inLabelExpressionPredicate,
  inNodeLabel,
  inRelationshipType,
} from '../helpers';
import { parserWrapper, ParsingResult } from '../parserWrapper';

class SyntaxValidationVisitor extends CypherParserVisitor<void> {
  warnings: Diagnostic[];
  dbLabels: Set<string>;
  dbRelationshipTypes: Set<string>;

  constructor(labels: string[] | undefined, relTypes: string[] | undefined) {
    super();
    this.warnings = [];
    this.dbLabels = new Set<string>();
    this.dbRelationshipTypes = new Set<string>();
    labels.forEach((label) => this.dbLabels.add(label));
    relTypes.forEach((type) => this.dbRelationshipTypes.add(type));
  }

  private detectNonDeclaredLabel(ctx: ParserRuleContext, labelName: string) {
    const nodeLabel = inNodeLabel(ctx);
    const relType = inRelationshipType(ctx);
    const labelExpressionPred = inLabelExpressionPredicate(ctx);

    if (
      (nodeLabel && !this.dbLabels.has(labelName)) ||
      (relType && !this.dbRelationshipTypes.has(labelName)) ||
      (labelExpressionPred &&
        !this.dbLabels.has(labelName) &&
        !this.dbRelationshipTypes.has(labelName))
    ) {
      let typeStr: string;
      if (nodeLabel) typeStr = 'Label';
      else if (relType) typeStr = 'Relationship type';
      else typeStr = 'Label or relationship type';

      const parent = findParent(
        ctx,
        (ctx) =>
          ctx instanceof ClauseContext || ctx instanceof ExpressionContext,
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

        this.warnings.push(warning);
      }
    }
  }

  visitLabelName: (ctx: LabelNameContext) => void = (ctx) => {
    this.detectNonDeclaredLabel(ctx, ctx.getText());
  };

  visitLabelNameIs: (ctx: LabelNameIsContext) => void = (ctx) => {
    this.detectNonDeclaredLabel(ctx, ctx.getText());
  };

  visitLabelOrRelType: (ctx: LabelOrRelTypeContext) => void = (ctx) => {
    this.detectNonDeclaredLabel(ctx, ctx.symbolicNameString().start.text);
  };
}

function warnOnUndeclaredLabels(
  parsingResult: ParsingResult,
  dbInfo: DbInfo,
): Diagnostic[] {
  const tree = parsingResult.result;
  let result: Diagnostic[] = [];

  if (dbInfo.labels && dbInfo.relationshipTypes) {
    const visitor = new SyntaxValidationVisitor(
      dbInfo.labels,
      dbInfo.relationshipTypes,
    );

    tree.accept(visitor);

    result = visitor.warnings;
  }
  return result;
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
