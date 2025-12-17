import {
  CharStreams,
  CommonTokenStream,
  ErrorListener,
  ParserRuleContext,
  Recognizer,
  Token,
} from 'antlr4';
import type {
  StyleRule,
  Where,
  Value,
  Caption,
  CaptionVariation,
  Style,
} from './grass-definition';

import CypherCmdLexer from '../generated-parser/CypherCmdLexer.js';
import CypherCmdParser, {
  StyleSheetContext,
  StyleRuleContext,
  GrassNodePatternContext,
  GrassRelationshipPatternContext,
  GrassPathPatternContext,
  GrassMultiLabelPatternContext,
  GrassWhereClauseContext,
  GrassOrExpressionContext,
  GrassAndExpressionContext,
  GrassNotExpressionContext,
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
  GrassValueExpressionContext,
  GrassPropertyAccessContext,
  GrassStyleMapContext,
  GrassStylePropertyContext,
  GrassCaptionExpressionContext,
  GrassCaptionTermContext,
  BoldCaptionContext,
  ItalicCaptionContext,
  UnderlineCaptionContext,
  GrassPlainCaptionContext,
  GrassColorValueContext,
  GrassCaptionAlignValueContext,
  GrassLiteralContext,
  // Reused from Cypher - literal subclasses
  NummericLiteralContext,
  StringsLiteralContext,
  BooleanLiteralContext,
  KeywordLiteralContext,
  OtherLiteralContext,
  StringLiteralContext,
  NumberLiteralContext,
} from '../generated-parser/CypherCmdParser.js';

/**
 * Result of parsing a grass stylesheet
 */
export interface GrassParseResult {
  /** The original input text */
  input: string;
  /** Successfully parsed style rules */
  rules: StyleRule[];
  /** Any syntax errors encountered */
  errors: GrassSyntaxError[];
}

/**
 * A syntax error in the grass DSL
 */
export interface GrassSyntaxError {
  message: string;
  line: number;
  column: number;
  offsets: {
    start: number;
    end: number;
  };
}

/**
 * Intermediate AST representation before conversion to StyleRule
 */
export interface GrassAST {
  rules: GrassRuleAST[];
}

export interface GrassRuleAST {
  match: GrassMatchAST;
  where?: GrassWhereAST;
  apply: GrassStyleAST;
}

export interface GrassMatchAST {
  type: 'node' | 'relationship' | 'path' | 'multiLabel';
  variable?: string; // optional - not needed if no WHERE clause
  label?: string; // for nodes
  labels?: string[]; // for multiLabel patterns (error case)
  reltype?: string; // for relationships and paths
}

export type GrassWhereAST =
  | { type: 'and'; operands: GrassWhereAST[] }
  | { type: 'or'; operands: GrassWhereAST[] }
  | { type: 'not'; operand: GrassWhereAST }
  | {
      type: 'comparison';
      operator: ComparisonOperator;
      left: GrassValueAST;
      right: GrassValueAST;
    }
  | { type: 'isNull'; value: GrassValueAST }
  | { type: 'isNotNull'; value: GrassValueAST }
  | { type: 'labelCheck'; variable: string; label: string }
  | { type: 'propertyExistence'; property: string };

export type ComparisonOperator =
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'greaterThan'
  | 'lessThanOrEqual'
  | 'greaterThanOrEqual'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

export type GrassValueAST =
  | { type: 'property'; name: string }
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean }
  | { type: 'null' };

export interface GrassStyleAST {
  color?: string;
  size?: number;
  width?: number;
  captions?: GrassCaptionAST[];
  captionSize?: number;
  captionAlign?: 'top' | 'bottom' | 'center';
}

export interface GrassCaptionAST {
  value: string | { property: string } | { useType: true };
  styles: CaptionVariation[];
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

/**
 * Custom error listener to collect syntax errors
 */
class GrassSyntaxErrorListener extends ErrorListener<Token> {
  errors: GrassSyntaxError[] = [];
  private input: string;

  constructor(input: string) {
    super();
    this.input = input;
  }

  syntaxError(
    _recognizer: Recognizer<Token>,
    offendingSymbol: Token | null,
    line: number,
    column: number,
    msg: string,
  ): void {
    // Calculate character offsets from line/column
    const lines = this.input.split('\n');
    let start = 0;
    for (let i = 0; i < line - 1; i++) {
      start += lines[i].length + 1; // +1 for newline
    }
    start += column;

    const tokenLength = offendingSymbol?.text?.length ?? 1;
    const end = start + tokenLength;

    this.errors.push({
      message: msg,
      line,
      column,
      offsets: { start, end },
    });
  }
}

/**
 * Converter to transform parse tree to AST.
 * Not extending CypherCmdParserVisitor to avoid naming conflicts with Cypher's visitor methods.
 */
class GrassASTConverter {
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
      style.color = this.convertColorValue(colorProp.grassColorValue());
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
    const hexColor = ctx.HEX_COLOR();
    if (hexColor) {
      return hexColor.getText();
    }

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
    if (ctx.TOP()) return 'top';
    if (ctx.BOTTOM()) return 'bottom';
    if (ctx.CENTER()) return 'center';

    // String literal fallback
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
 * Parse a grass DSL string into StyleRule objects.
 */
export function parseGrass(input: string): GrassParseResult {
  if (input.trim().length === 0) {
    return {
      input,
      rules: [],
      errors: [],
    };
  }

  const inputStream = CharStreams.fromString(input);
  const lexer = new CypherCmdLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new CypherCmdParser(tokenStream);

  const errorListener = new GrassSyntaxErrorListener(input);
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  const tree = parser.styleSheet();

  const converter = new GrassASTConverter(input);
  const ast = converter.convertStyleSheet(tree);

  // Check for invalid patterns (paths, multiple labels) and generate errors
  const errors = [...errorListener.errors, ...converter.errors];
  const validRules: GrassRuleAST[] = [];

  for (const rule of ast.rules) {
    if (rule.match.type === 'path') {
      // Path patterns like ()-[r:TYPE]->()
      const ruleText = `()-[${rule.match.variable || ''}`;
      const startIndex = input.indexOf(ruleText);
      const start = startIndex >= 0 ? startIndex : 0;
      const end = start + (ruleText.length + 10); // approximate end

      const lines = input.substring(0, start).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length;

      errors.push({
        message:
          'Grass does not support paths. Use [r:TYPE] for relationships.',
        line,
        column,
        offsets: { start, end },
      });
    } else if (rule.match.type === 'multiLabel') {
      // Multiple labels like (n:Person:Actor)
      const labels = rule.match.labels || [];
      const labelStr = labels.join(':');
      const searchStr = rule.match.variable
        ? `(${rule.match.variable}:${labelStr}`
        : `(:${labelStr}`;
      const startIndex = input.indexOf(searchStr);
      const start = startIndex >= 0 ? startIndex : 0;
      const end = start + searchStr.length + 1;

      const lines = input.substring(0, start).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length;

      errors.push({
        message: `Multiple labels in MATCH are not supported. Use WHERE ${
          rule.match.variable || 'variable'
        }:${labels[1]} for additional label conditions.`,
        line,
        column,
        offsets: { start, end },
      });
    } else {
      validRules.push(rule);
    }
  }

  // Check for semantic errors in WHERE clauses (null comparisons)
  for (const rule of validRules) {
    if (rule.where) {
      checkForNullComparisons(rule.where, input, errors);
    }
  }

  const rules = validRules.map(astToStyleRule);

  return {
    input,
    rules,
    errors,
  };
}

function checkForNullComparisons(
  where: GrassWhereAST,
  input: string,
  errors: GrassSyntaxError[],
): void {
  switch (where.type) {
    case 'and':
    case 'or':
      for (const operand of where.operands) {
        checkForNullComparisons(operand, input, errors);
      }
      break;
    case 'not':
      checkForNullComparisons(where.operand, input, errors);
      break;
    case 'comparison':
      if (where.operator === 'equal' || where.operator === 'notEqual') {
        const leftIsNull = where.left.type === 'null';
        const rightIsNull = where.right.type === 'null';

        if (leftIsNull || rightIsNull) {
          const nullRegex = /\bnull\b/gi;
          let match: RegExpExecArray | null;
          let start = 0;
          let end = 0;
          let line = 1;
          let column = 0;

          while ((match = nullRegex.exec(input)) !== null) {
            start = match.index;
            end = start + 4;
            const lines = input.substring(0, start).split('\n');
            line = lines.length;
            column = lines[lines.length - 1].length;
            break;
          }

          const operator = where.operator === 'equal' ? '=' : '<>';
          const suggestion =
            where.operator === 'equal' ? 'IS NULL' : 'IS NOT NULL';

          errors.push({
            message: `Comparing with null using '${operator}' is not recommended. Use '${suggestion}' instead. (In Cypher, null ${operator} null evaluates to null, not true/false)`,
            line,
            column,
            offsets: { start, end },
          });
        }
      }
      break;
  }
}

/**
 * Convert StyleRule objects back to grass DSL string.
 */
export function stringifyGrass(rules: StyleRule[]): string {
  return rules.map(stringifyRule).join(';\n\n');
}

function stringifyRule(rule: StyleRule): string {
  const parts: string[] = [];

  // MATCH clause
  parts.push(stringifyMatch(rule.match));

  // WHERE clause (optional)
  if (rule.where) {
    parts.push(`WHERE ${stringifyWhere(rule.where)}`);
  }

  // APPLY clause
  parts.push(`APPLY ${stringifyStyle(rule.apply)}`);

  return parts.join(' ');
}

function stringifyMatch(match: StyleRule['match']): string {
  if ('label' in match) {
    const label = match.label ? `:${match.label}` : '';
    return `MATCH (n${label})`;
  } else if ('reltype' in match) {
    const reltype = match.reltype ? `:${match.reltype}` : '';
    return `MATCH [r${reltype}]`;
  } else {
    // property selector - shouldn't happen in match context, but handle gracefully
    return `MATCH (n)`;
  }
}

function stringifyWhere(where: Where): string {
  if ('and' in where) {
    return where.and.map((w) => `(${stringifyWhere(w)})`).join(' AND ');
  }
  if ('or' in where) {
    return where.or.map((w) => `(${stringifyWhere(w)})`).join(' OR ');
  }
  if ('not' in where) {
    return `NOT (${stringifyWhere(where.not)})`;
  }
  if ('equal' in where) {
    return `${stringifyValue(where.equal[0])} = ${stringifyValue(
      where.equal[1],
    )}`;
  }
  if ('lessThan' in where) {
    return `${stringifyValue(where.lessThan[0])} < ${stringifyValue(
      where.lessThan[1],
    )}`;
  }
  if ('greaterThan' in where) {
    return `${stringifyValue(where.greaterThan[0])} > ${stringifyValue(
      where.greaterThan[1],
    )}`;
  }
  if ('lessThanOrEqual' in where) {
    return `${stringifyValue(where.lessThanOrEqual[0])} <= ${stringifyValue(
      where.lessThanOrEqual[1],
    )}`;
  }
  if ('greaterThanOrEqual' in where) {
    return `${stringifyValue(where.greaterThanOrEqual[0])} >= ${stringifyValue(
      where.greaterThanOrEqual[1],
    )}`;
  }
  if ('contains' in where) {
    return `${stringifyValue(where.contains[0])} CONTAINS ${stringifyValue(
      where.contains[1],
    )}`;
  }
  if ('startsWith' in where) {
    return `${stringifyValue(where.startsWith[0])} STARTS WITH ${stringifyValue(
      where.startsWith[1],
    )}`;
  }
  if ('endsWith' in where) {
    return `${stringifyValue(where.endsWith[0])} ENDS WITH ${stringifyValue(
      where.endsWith[1],
    )}`;
  }
  if ('isNull' in where) {
    return `${stringifyValue(where.isNull)} IS NULL`;
  }
  // Selector-based where (label/reltype/property check)
  if ('label' in where) {
    return where.label ? `n:${where.label}` : 'n';
  }
  if ('reltype' in where) {
    return where.reltype ? `r:${where.reltype}` : 'r';
  }
  if ('property' in where) {
    return `n.${where.property}`;
  }
  return '';
}

function stringifyValue(value: Value): string {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "\\'")}'`;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  // Property access: { property: string }
  return `n.${value.property}`;
}

function stringifyStyle(style: Style): string {
  const props: string[] = [];

  if (style.color !== undefined) {
    props.push(`color: '${style.color}'`);
  }
  if (style.size !== undefined) {
    props.push(`size: ${style.size}`);
  }
  if (style.width !== undefined) {
    props.push(`width: ${style.width}`);
  }
  if (style.captionSize !== undefined) {
    props.push(`captionSize: ${style.captionSize}`);
  }
  if (style.captionAlign !== undefined) {
    props.push(`captionAlign: '${style.captionAlign}'`);
  }
  if (style.captions !== undefined) {
    props.push(`captions: ${stringifyCaptions(style.captions)}`);
  }

  return `{${props.join(', ')}}`;
}

function stringifyCaptions(captions: Caption[]): string {
  return captions.map(stringifyCaption).join(' + ');
}

function stringifyCaption(caption: Caption): string {
  let value: string;

  if (typeof caption.value === 'string') {
    value = `'${caption.value.replace(/'/g, "\\'")}'`;
  } else if ('property' in caption.value) {
    value = `n.${caption.value.property}`;
  } else {
    // useType
    value = 'type(r)';
  }

  const styles = caption.styles ?? [];
  let result = value;

  // Apply styles from innermost to outermost
  for (const style of styles.slice().reverse()) {
    result = `${style}(${result})`;
  }

  return result;
}
