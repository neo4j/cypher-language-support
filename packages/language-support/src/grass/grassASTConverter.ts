import type { ParserRuleContext } from 'antlr4';
import type {
  StyleRuleContext,
  StyleSheetContext,
  GrassNodePatternContext,
  GrassRelationshipPatternContext,
  GrassPathPatternContext,
  GrassMultiLabelPatternContext,
  GrassWhereClauseContext,
  GrassOrExpressionContext,
  GrassAndExpressionContext,
  GrassNotExpressionContext,
  GrassValueExpressionContext,
  GrassPropertyAccessContext,
  GrassStyleMapContext,
  GrassStylePropertyContext,
  GrassCaptionExpressionContext,
  GrassCaptionTermContext,
  GrassColorValueContext,
  GrassCaptionAlignValueContext,
  GrassLiteralContext,
  NumberLiteralContext,
  StringLiteralContext,
} from '../generated-parser/CypherCmdParser';

import {
  EqualComparisonContext,
  NotEqualComparisonContext,
  LessThanComparisonContext,
  GreaterThanComparisonContext,
  LessThanOrEqualComparisonContext,
  GreaterThanOrEqualComparisonContext,
  ContainsComparisonContext,
  StartsWithComparisonContext,
  EndsWithComparisonContext,
  IsNullCheckContext,
  IsNotNullCheckContext,
  ParenthesizedBooleanContext,
  LabelCheckContext,
  NummericLiteralContext,
  StringsLiteralContext,
  BooleanLiteralContext,
  KeywordLiteralContext,
  OtherLiteralContext,
  BoldCaptionContext,
  ItalicCaptionContext,
  UnderlineCaptionContext,
  GrassPlainCaptionContext,
} from '../generated-parser/CypherCmdParser';

import type {
  GrassAST,
  GrassRuleAST,
  GrassMatchAST,
  GrassWhereAST,
  GrassValueAST,
  GrassStyleAST,
  GrassCaptionAST,
  GrassSyntaxError,
  ComparisonOperator,
  StyleRule,
  Where,
  Value,
  Caption,
  Style,
  CaptionVariation,
} from './grassTypes';

/**
 * Converter to transform parse tree to AST.
 * Not extending CypherCmdParserVisitor to avoid naming conflicts with Cypher's visitor methods.
 */
export class GrassASTConverter {
  errors: GrassSyntaxError[] = [];
  private input: string;

  constructor(input: string) {
    this.input = input;
  }

  private addError(ctx: ParserRuleContext, message: string): void {
    const start = ctx.start?.start ?? 0;
    const stop = ctx.stop?.stop ?? start;
    const line = ctx.start?.line ?? 1;
    const column = ctx.start?.column ?? 0;

    this.errors.push({
      message,
      line,
      column,
      offsets: { start, end: stop + 1 },
    });
  }

  convertStyleSheet(ctx: StyleSheetContext): GrassAST {
    const rules: GrassRuleAST[] = [];
    for (const ruleCtx of ctx.styleRule_list()) {
      const rule = this.convertStyleRule(ruleCtx);
      if (rule) {
        rules.push(rule);
      }
    }
    return { rules };
  }

  convertStyleRule(ctx: StyleRuleContext): GrassRuleAST | null {
    const patternCtx = ctx.grassPattern();
    const match = this.convertPattern(patternCtx);
    if (!match) return null;

    const whereCtx = ctx.grassWhereClause();
    const where = whereCtx ? this.convertWhereClause(whereCtx) : undefined;

    const styleMapCtx = ctx.grassStyleMap();
    const apply = this.convertStyleMap(styleMapCtx);

    return { match, where, apply };
  }

  convertPattern(
    ctx: ReturnType<StyleRuleContext['grassPattern']>,
  ): GrassMatchAST | null {
    const nodePattern = ctx.grassNodePattern();
    if (nodePattern) {
      return this.convertNodePattern(nodePattern);
    }

    const relPattern = ctx.grassRelationshipPattern();
    if (relPattern) {
      return this.convertRelationshipPattern(relPattern);
    }

    const pathPattern = ctx.grassPathPattern();
    if (pathPattern) {
      return this.convertPathPattern(pathPattern);
    }

    const multiLabelPattern = ctx.grassMultiLabelPattern();
    if (multiLabelPattern) {
      return this.convertMultiLabelPattern(multiLabelPattern);
    }

    return null;
  }

  convertNodePattern(ctx: GrassNodePatternContext): GrassMatchAST {
    const variableCtx = ctx.grassVariable();
    const variable = variableCtx ? variableCtx.getText() : undefined;
    const labelCtx = ctx.grassLabelName();
    const label = labelCtx
      ? this.getSymbolicName(labelCtx.getText())
      : undefined;

    return { type: 'node', variable, label };
  }

  convertRelationshipPattern(
    ctx: GrassRelationshipPatternContext,
  ): GrassMatchAST {
    const variableCtx = ctx.grassVariable();
    const variable = variableCtx ? variableCtx.getText() : undefined;
    const relTypeCtx = ctx.grassRelTypeName();
    const reltype = relTypeCtx
      ? this.getSymbolicName(relTypeCtx.getText())
      : undefined;

    return { type: 'relationship', variable, reltype };
  }

  convertPathPattern(ctx: GrassPathPatternContext): GrassMatchAST {
    // GrassPathPatternContext subclasses have grassVariable() and grassRelTypeName() methods
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const variableCtx = (ctx as any).grassVariable?.() as
      | ParserRuleContext
      | undefined;
    const variable = variableCtx?.getText();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const relTypeCtx = (ctx as any).grassRelTypeName?.() as
      | ParserRuleContext
      | undefined;
    const reltype = relTypeCtx
      ? this.getSymbolicName(relTypeCtx.getText())
      : undefined;

    return { type: 'path', variable, reltype };
  }

  convertMultiLabelPattern(ctx: GrassMultiLabelPatternContext): GrassMatchAST {
    const variableCtx = ctx.grassVariable();
    const variable = variableCtx ? variableCtx.getText() : undefined;
    const labelContexts = ctx.grassLabelName_list();
    const labels = labelContexts.map((l) => this.getSymbolicName(l.getText()));

    return { type: 'multiLabel', variable, labels };
  }

  convertWhereClause(ctx: GrassWhereClauseContext): GrassWhereAST | undefined {
    const boolExpr = ctx.grassBooleanExpression();
    return this.convertBooleanExpression(boolExpr);
  }

  convertBooleanExpression(
    ctx: ReturnType<GrassWhereClauseContext['grassBooleanExpression']>,
  ): GrassWhereAST | undefined {
    const orExpr = ctx.grassOrExpression();
    return this.convertOrExpression(orExpr);
  }

  convertOrExpression(
    ctx: GrassOrExpressionContext,
  ): GrassWhereAST | undefined {
    const andExprs = ctx.grassAndExpression_list();
    if (andExprs.length === 1) {
      return this.convertAndExpression(andExprs[0]);
    }

    const operands = andExprs
      .map((e) => this.convertAndExpression(e))
      .filter((o): o is GrassWhereAST => o !== undefined);

    return { type: 'or', operands };
  }

  convertAndExpression(
    ctx: GrassAndExpressionContext,
  ): GrassWhereAST | undefined {
    const notExprs = ctx.grassNotExpression_list();
    if (notExprs.length === 1) {
      return this.convertNotExpression(notExprs[0]);
    }

    const operands = notExprs
      .map((e) => this.convertNotExpression(e))
      .filter((o): o is GrassWhereAST => o !== undefined);

    return { type: 'and', operands };
  }

  convertNotExpression(
    ctx: GrassNotExpressionContext,
  ): GrassWhereAST | undefined {
    // Check if this is a NOT expression
    if (ctx.NOT()) {
      const inner = ctx.grassNotExpression();
      if (inner) {
        const operand = this.convertNotExpression(inner);
        if (operand) {
          return { type: 'not', operand };
        }
      }
    }

    // Otherwise it's a comparison expression
    const compExpr = ctx.grassComparisonExpression();
    if (compExpr) {
      return this.convertComparisonExpression(compExpr);
    }

    return undefined;
  }

  convertComparisonExpression(
    ctx: ReturnType<GrassNotExpressionContext['grassComparisonExpression']>,
  ): GrassWhereAST | undefined {
    if (!ctx) return undefined;

    if (ctx instanceof EqualComparisonContext) {
      return this.convertEqualComparison(ctx);
    } else if (ctx instanceof NotEqualComparisonContext) {
      return this.convertNotEqualComparison(ctx);
    } else if (ctx instanceof LessThanComparisonContext) {
      return this.convertLessThanComparison(ctx);
    } else if (ctx instanceof GreaterThanComparisonContext) {
      return this.convertGreaterThanComparison(ctx);
    } else if (ctx instanceof LessThanOrEqualComparisonContext) {
      return this.convertLessThanOrEqualComparison(ctx);
    } else if (ctx instanceof GreaterThanOrEqualComparisonContext) {
      return this.convertGreaterThanOrEqualComparison(ctx);
    } else if (ctx instanceof ContainsComparisonContext) {
      return this.convertContainsComparison(ctx);
    } else if (ctx instanceof StartsWithComparisonContext) {
      return this.convertStartsWithComparison(ctx);
    } else if (ctx instanceof EndsWithComparisonContext) {
      return this.convertEndsWithComparison(ctx);
    } else if (ctx instanceof IsNullCheckContext) {
      return this.convertIsNullCheck(ctx);
    } else if (ctx instanceof IsNotNullCheckContext) {
      return this.convertIsNotNullCheck(ctx);
    } else if (ctx instanceof LabelCheckContext) {
      return this.convertLabelCheck(ctx);
    } else if (ctx instanceof ParenthesizedBooleanContext) {
      return this.convertParenthesizedBoolean(ctx);
    } else if (
      'grassPropertyAccess' in ctx &&
      typeof ctx.grassPropertyAccess === 'function'
    ) {
      // PropertyExistenceCheckContext - duck-typed since the export isn't recognized by TS
      return this.convertPropertyExistenceCheck(
        ctx as ParserRuleContext & {
          grassPropertyAccess(): GrassPropertyAccessContext;
        },
      );
    }

    return undefined;
  }

  private makeComparison(
    ctx: { grassValueExpression_list(): GrassValueExpressionContext[] },
    operator: ComparisonOperator,
  ): GrassWhereAST {
    const values = ctx.grassValueExpression_list();
    const left = this.convertValueExpression(values[0]);
    const right = this.convertValueExpression(values[1]);
    return { type: 'comparison', operator, left, right };
  }

  convertEqualComparison(ctx: EqualComparisonContext): GrassWhereAST {
    return this.makeComparison(ctx, 'equal');
  }

  convertNotEqualComparison(ctx: NotEqualComparisonContext): GrassWhereAST {
    return this.makeComparison(ctx, 'notEqual');
  }

  convertLessThanComparison(ctx: LessThanComparisonContext): GrassWhereAST {
    return this.makeComparison(ctx, 'lessThan');
  }

  convertGreaterThanComparison(
    ctx: GreaterThanComparisonContext,
  ): GrassWhereAST {
    return this.makeComparison(ctx, 'greaterThan');
  }

  convertLessThanOrEqualComparison(
    ctx: LessThanOrEqualComparisonContext,
  ): GrassWhereAST {
    return this.makeComparison(ctx, 'lessThanOrEqual');
  }

  convertGreaterThanOrEqualComparison(
    ctx: GreaterThanOrEqualComparisonContext,
  ): GrassWhereAST {
    return this.makeComparison(ctx, 'greaterThanOrEqual');
  }

  convertContainsComparison(ctx: ContainsComparisonContext): GrassWhereAST {
    return this.makeComparison(ctx, 'contains');
  }

  convertStartsWithComparison(ctx: StartsWithComparisonContext): GrassWhereAST {
    return this.makeComparison(ctx, 'startsWith');
  }

  convertEndsWithComparison(ctx: EndsWithComparisonContext): GrassWhereAST {
    return this.makeComparison(ctx, 'endsWith');
  }

  convertIsNullCheck(ctx: IsNullCheckContext): GrassWhereAST {
    const value = this.convertValueExpression(ctx.grassValueExpression());
    return { type: 'isNull', value };
  }

  convertIsNotNullCheck(ctx: IsNotNullCheckContext): GrassWhereAST {
    const value = this.convertValueExpression(ctx.grassValueExpression());
    return { type: 'isNotNull', value };
  }

  convertLabelCheck(ctx: LabelCheckContext): GrassWhereAST {
    const variable = ctx.grassVariable().getText();
    const label = this.getSymbolicName(ctx.grassLabelName().getText());
    return { type: 'labelCheck', variable, label };
  }

  convertPropertyExistenceCheck(
    ctx: ParserRuleContext & {
      grassPropertyAccess(): GrassPropertyAccessContext;
    },
  ): GrassWhereAST {
    const propAccess = this.convertPropertyAccess(ctx.grassPropertyAccess());
    if (propAccess.type === 'property') {
      return { type: 'propertyExistence', property: propAccess.name };
    }
    return { type: 'propertyExistence', property: '' };
  }

  convertParenthesizedBoolean(
    ctx: ParenthesizedBooleanContext,
  ): GrassWhereAST | undefined {
    return this.convertBooleanExpression(ctx.grassBooleanExpression());
  }

  convertValueExpression(ctx: GrassValueExpressionContext): GrassValueAST {
    const propAccess = ctx.grassPropertyAccess();
    if (propAccess) {
      return this.convertPropertyAccess(propAccess);
    }

    const literal = ctx.grassLiteral();
    if (literal) {
      return this.convertGrassLiteral(literal);
    }

    return { type: 'null' };
  }

  convertPropertyAccess(ctx: GrassPropertyAccessContext): GrassValueAST {
    const propName = ctx.propertyKeyName().getText();
    return { type: 'property', name: this.getSymbolicName(propName) };
  }

  convertGrassLiteral(ctx: GrassLiteralContext): GrassValueAST {
    const literal = ctx.literal();

    // Handle each literal subtype
    if (literal instanceof NummericLiteralContext) {
      const numLit = literal.numberLiteral();
      return this.convertNumberLiteral(numLit);
    }

    if (literal instanceof StringsLiteralContext) {
      const stringLit = literal.stringLiteral();
      return this.convertStringLiteral(stringLit);
    }

    if (literal instanceof BooleanLiteralContext) {
      const value = literal.TRUE() !== null;
      return { type: 'boolean', value };
    }

    if (literal instanceof KeywordLiteralContext) {
      // NULL is supported, but INF/INFINITY/NAN are not
      if (literal.NULL()) {
        return { type: 'null' };
      }
      // Unsupported: INF, INFINITY, NAN
      const text = literal.getText().toUpperCase();
      this.addError(
        literal,
        `Grass does not support '${text}' as a literal value. Use a number instead.`,
      );
      return { type: 'null' };
    }

    if (literal instanceof OtherLiteralContext) {
      // Map literals are not supported in Grass
      this.addError(
        literal,
        'Grass does not support map literals in WHERE clauses. Use simple values (strings, numbers, booleans).',
      );
      return { type: 'null' };
    }

    return { type: 'null' };
  }

  convertStringLiteral(ctx: StringLiteralContext): GrassValueAST {
    const text = ctx.getText();
    // Remove surrounding quotes and unescape
    const unquoted = text.slice(1, -1).replace(/\\(.)/g, '$1');
    return { type: 'string', value: unquoted };
  }

  convertNumberLiteral(ctx: NumberLiteralContext): GrassValueAST {
    const text = ctx.getText();
    const value = text.includes('.') ? parseFloat(text) : parseInt(text, 10);
    return { type: 'number', value };
  }

  convertStyleMap(ctx: GrassStyleMapContext | null): GrassStyleAST {
    const style: GrassStyleAST = {};

    if (!ctx) {
      return style;
    }

    for (const propCtx of ctx.grassStyleProperty_list()) {
      this.applyStyleProperty(propCtx, style);
    }

    return style;
  }

  applyStyleProperty(
    ctx: GrassStylePropertyContext,
    style: GrassStyleAST,
  ): void {
    const colorProp = ctx.grassColorProperty();
    if (colorProp) {
      const colorValue = colorProp.grassColorValue();
      if (colorValue) {
        style.color = this.convertColorValue(colorValue);
      }
      return;
    }

    const sizeProp = ctx.grassSizeProperty();
    if (sizeProp) {
      style.size = this.parseNumber(sizeProp.numberLiteral());
      return;
    }

    const widthProp = ctx.grassWidthProperty();
    if (widthProp) {
      style.width = this.parseNumber(widthProp.numberLiteral());
      return;
    }

    const captionsProp = ctx.grassCaptionsProperty();
    if (captionsProp) {
      style.captions = this.convertCaptionExpression(
        captionsProp.grassCaptionExpression(),
      );
      return;
    }

    const captionSizeProp = ctx.grassCaptionSizeProperty();
    if (captionSizeProp) {
      style.captionSize = this.parseNumber(captionSizeProp.numberLiteral());
      return;
    }

    const captionAlignProp = ctx.grassCaptionAlignProperty();
    if (captionAlignProp) {
      style.captionAlign = this.convertCaptionAlignValue(
        captionAlignProp.grassCaptionAlignValue(),
      );
      return;
    }
  }

  convertColorValue(ctx: GrassColorValueContext): string {
    const stringLit = ctx.stringLiteral();
    if (stringLit) {
      const text = stringLit.getText();
      return text.slice(1, -1);
    }

    return '';
  }

  convertCaptionAlignValue(
    ctx: GrassCaptionAlignValueContext,
  ): 'top' | 'bottom' | 'center' {
    const stringLit = ctx.stringLiteral();
    if (stringLit) {
      const text = stringLit.getText().slice(1, -1).toLowerCase();
      if (text === 'top' || text === 'bottom' || text === 'center') {
        return text;
      }
    }

    return 'center';
  }

  convertCaptionExpression(
    ctx: GrassCaptionExpressionContext,
  ): GrassCaptionAST[] {
    const captions: GrassCaptionAST[] = [];

    for (const termCtx of ctx.grassCaptionTerm_list()) {
      const caption = this.processCaptionTerm(termCtx, []);
      captions.push(...caption);
    }

    return captions;
  }

  processCaptionTerm(
    ctx: GrassCaptionTermContext,
    inheritedStyles: CaptionVariation[],
  ): GrassCaptionAST[] {
    const styledCaption = ctx.grassStyledCaption();
    if (styledCaption) {
      if (styledCaption instanceof BoldCaptionContext) {
        return this.processBoldCaption(styledCaption, inheritedStyles);
      } else if (styledCaption instanceof ItalicCaptionContext) {
        return this.processItalicCaption(styledCaption, inheritedStyles);
      } else if (styledCaption instanceof UnderlineCaptionContext) {
        return this.processUnderlineCaption(styledCaption, inheritedStyles);
      }
    }

    const plainCaption = ctx.grassPlainCaption();
    if (plainCaption) {
      return this.processPlainCaption(plainCaption, inheritedStyles);
    }

    return [];
  }

  processBoldCaption(
    ctx: BoldCaptionContext,
    inheritedStyles: CaptionVariation[],
  ): GrassCaptionAST[] {
    const newStyles: CaptionVariation[] = [...inheritedStyles, 'bold'];
    return this.processNestedCaptionExpression(
      ctx.grassCaptionExpression(),
      newStyles,
    );
  }

  processItalicCaption(
    ctx: ItalicCaptionContext,
    inheritedStyles: CaptionVariation[],
  ): GrassCaptionAST[] {
    const newStyles: CaptionVariation[] = [...inheritedStyles, 'italic'];
    return this.processNestedCaptionExpression(
      ctx.grassCaptionExpression(),
      newStyles,
    );
  }

  processUnderlineCaption(
    ctx: UnderlineCaptionContext,
    inheritedStyles: CaptionVariation[],
  ): GrassCaptionAST[] {
    const newStyles: CaptionVariation[] = [...inheritedStyles, 'underline'];
    return this.processNestedCaptionExpression(
      ctx.grassCaptionExpression(),
      newStyles,
    );
  }

  processNestedCaptionExpression(
    ctx: GrassCaptionExpressionContext,
    styles: CaptionVariation[],
  ): GrassCaptionAST[] {
    const captions: GrassCaptionAST[] = [];

    for (const termCtx of ctx.grassCaptionTerm_list()) {
      const nested = this.processCaptionTerm(termCtx, styles);
      captions.push(...nested);
    }

    return captions;
  }

  processPlainCaption(
    ctx: GrassPlainCaptionContext,
    styles: CaptionVariation[],
  ): GrassCaptionAST[] {
    const stringLit = ctx.stringLiteral();
    if (stringLit) {
      const text = stringLit.getText();
      const unquoted = text.slice(1, -1).replace(/\\(.)/g, '$1');
      return [{ value: unquoted, styles }];
    }

    const propAccess = ctx.grassPropertyAccess();
    if (propAccess) {
      const propName = propAccess.propertyKeyName().getText();
      return [{ value: { property: this.getSymbolicName(propName) }, styles }];
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (ctx.grassTypeFunction()) {
      return [{ value: { useType: true }, styles }];
    }

    return [];
  }

  parseNumber(ctx: NumberLiteralContext): number {
    const text = ctx.getText();
    return text.includes('.') ? parseFloat(text) : parseInt(text, 10);
  }

  getSymbolicName(text: string): string {
    // Handle escaped identifiers (backtick-quoted)
    if (text.startsWith('`') && text.endsWith('`')) {
      return text.slice(1, -1).replace(/``/g, '`');
    }
    return text;
  }
}

/**
 * Convert an intermediate AST to the StyleRule format
 */
export function astToStyleRule(ast: GrassRuleAST): StyleRule {
  const match = convertMatch(ast.match);
  // Pass match type to convertWhere so it knows whether to use label or reltype
  const isRelationship =
    ast.match.type === 'relationship' || ast.match.type === 'path';
  const where = ast.where ? convertWhere(ast.where, isRelationship) : undefined;
  const apply = convertStyle(ast.apply);

  return {
    match,
    ...(where && { where }),
    apply,
  };
}

function convertMatch(match: GrassMatchAST): StyleRule['match'] {
  if (match.type === 'node') {
    return { label: match.label ?? null };
  } else {
    return { reltype: match.reltype ?? null };
  }
}

function convertWhere(where: GrassWhereAST, isRelationship: boolean): Where {
  switch (where.type) {
    case 'and':
      return {
        and: where.operands.map((w) => convertWhere(w, isRelationship)),
      };
    case 'or':
      return { or: where.operands.map((w) => convertWhere(w, isRelationship)) };
    case 'not':
      return { not: convertWhere(where.operand, isRelationship) };
    case 'isNull':
      return { isNull: convertValue(where.value) };
    case 'isNotNull':
      return { not: { isNull: convertValue(where.value) } };
    case 'labelCheck':
      // Use match context to determine if this is a label or reltype check
      return isRelationship ? { reltype: where.label } : { label: where.label };
    case 'propertyExistence':
      // Property existence: `n.property` means "property exists"
      // The semantics (IS NOT NULL) are handled by the rule execution engine
      return { property: where.property };
    case 'comparison': {
      const left = convertValue(where.left);
      const right = convertValue(where.right);
      const tuple: [Value, Value] = [left, right];

      switch (where.operator) {
        case 'equal':
          return { equal: tuple };
        case 'notEqual':
          return { not: { equal: tuple } };
        case 'lessThan':
          return { lessThan: tuple };
        case 'greaterThan':
          return { greaterThan: tuple };
        case 'lessThanOrEqual':
          return { lessThanOrEqual: tuple };
        case 'greaterThanOrEqual':
          return { greaterThanOrEqual: tuple };
        case 'contains':
          return { contains: tuple };
        case 'startsWith':
          return { startsWith: tuple };
        case 'endsWith':
          return { endsWith: tuple };
      }
    }
  }
}

function convertValue(value: GrassValueAST): Value {
  switch (value.type) {
    case 'property':
      return { property: value.name };
    case 'string':
      return value.value;
    case 'number':
      return value.value;
    case 'boolean':
      return value.value;
    case 'null':
      return null;
  }
}

function convertStyle(style: GrassStyleAST): Style {
  const result: Style = {};

  if (style.color !== undefined) {
    result.color = style.color;
  }
  if (style.size !== undefined) {
    result.size = style.size;
  }
  if (style.width !== undefined) {
    result.width = style.width;
  }
  if (style.captions !== undefined) {
    result.captions = style.captions.map(convertCaption);
  }
  if (style.captionSize !== undefined) {
    result.captionSize = style.captionSize;
  }
  if (style.captionAlign !== undefined) {
    result.captionAlign = style.captionAlign;
  }

  return result;
}

function convertCaption(caption: GrassCaptionAST): Caption {
  let value: Caption['value'];
  if (typeof caption.value === 'string') {
    value = caption.value;
  } else if ('property' in caption.value) {
    value = { property: caption.value.property };
  } else {
    // useType case
    value = { useType: true };
  }

  return {
    value,
    styles: caption.styles.length > 0 ? caption.styles : undefined,
  };
}
