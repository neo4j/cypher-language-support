import {
  CharStreams,
  CommonTokenStream,
  ErrorListener,
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

import GrassLexer from './generated-parser/GrassLexer.js';
import GrassParser, {
  StyleSheetContext,
  StyleRuleContext,
  NodePatternContext,
  RelationshipPatternContext,
  PathPatternContext,
  MultiLabelPatternContext,
  WhereClauseContext,
  OrExpressionContext,
  AndExpressionContext,
  NotExpressionContext,
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
  PropertyExistenceCheckContext,
  ValueExpressionContext,
  TypeFunctionContext,
  PropertyAccessContext,
  StyleMapContext,
  StylePropertyContext,
  CaptionExpressionContext,
  CaptionTermContext,
  BoldCaptionContext,
  ItalicCaptionContext,
  UnderlineCaptionContext,
  PlainCaptionContext,
  ColorValueContext,
  CaptionAlignValueContext,
  GrassNumberLiteralContext,
  GrassLiteralContext,
  GrassStringLiteralContext,
  GrassBooleanLiteralContext,
} from './generated-parser/GrassParser.js';
import GrassParserVisitor from './generated-parser/GrassParserVisitor.js';

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
 * Visitor to convert parse tree to AST
 */
class GrassASTVisitor extends GrassParserVisitor<unknown> {
  visitStyleSheet = (ctx: StyleSheetContext): GrassAST => {
    const rules: GrassRuleAST[] = [];
    for (const ruleCtx of ctx.styleRule_list()) {
      const rule = this.visitStyleRule(ruleCtx);
      if (rule) {
        rules.push(rule);
      }
    }
    return { rules };
  };

  visitStyleRule = (ctx: StyleRuleContext): GrassRuleAST | null => {
    const patternCtx = ctx.pattern();
    const match = this.visitPattern(patternCtx);
    if (!match) return null;

    const whereCtx = ctx.whereClause();
    const where = whereCtx ? this.visitWhereClause(whereCtx) : undefined;

    const styleMapCtx = ctx.styleMap();
    const apply = this.visitStyleMap(styleMapCtx);

    return { match, where, apply };
  };

  visitPattern = (
    ctx: ReturnType<StyleRuleContext['pattern']>,
  ): GrassMatchAST | null => {
    const nodePattern = ctx.nodePattern();
    if (nodePattern) {
      return this.visitNodePattern(nodePattern);
    }

    const relPattern = ctx.relationshipPattern();
    if (relPattern) {
      return this.visitRelationshipPattern(relPattern);
    }

    const pathPattern = ctx.pathPattern();
    if (pathPattern) {
      return this.visitPathPattern(pathPattern);
    }

    const multiLabelPattern = ctx.multiLabelPattern();
    if (multiLabelPattern) {
      return this.visitMultiLabelPattern(multiLabelPattern);
    }

    return null;
  };

  visitNodePattern = (ctx: NodePatternContext): GrassMatchAST => {
    const variableCtx = ctx.variable();
    const variable = variableCtx ? variableCtx.getText() : undefined;
    const labelCtx = ctx.grassLabelName();
    const label = labelCtx
      ? this.getSymbolicName(labelCtx.getText())
      : undefined;

    return { type: 'node', variable, label };
  };

  visitRelationshipPattern = (
    ctx: RelationshipPatternContext,
  ): GrassMatchAST => {
    const variableCtx = ctx.variable();
    const variable = variableCtx ? variableCtx.getText() : undefined;
    const relTypeCtx = ctx.grassRelTypeName();
    const reltype = relTypeCtx
      ? this.getSymbolicName(relTypeCtx.getText())
      : undefined;

    return { type: 'relationship', variable, reltype };
  };

  visitPathPattern = (ctx: PathPatternContext): GrassMatchAST => {
    // Path patterns are parsed but marked as errors
    // PathPatternContext is a base class with specific subclasses (RightArrowPath, LeftArrowPath, UndirectedPath)
    // All have variable() and grassRelTypeName() methods via the grammar rules
    const variableCtx = (ctx as any).variable?.();
    const variable = variableCtx ? variableCtx.getText() : undefined;
    const relTypeCtx = (ctx as any).grassRelTypeName?.();
    const reltype = relTypeCtx
      ? this.getSymbolicName(relTypeCtx.getText())
      : undefined;

    return { type: 'path', variable, reltype };
  };

  visitMultiLabelPattern = (ctx: MultiLabelPatternContext): GrassMatchAST => {
    // Multiple label patterns are parsed but marked as errors
    const variableCtx = ctx.variable();
    const variable = variableCtx ? variableCtx.getText() : undefined;
    const labelContexts = ctx.grassLabelName_list();
    const labels = labelContexts.map((l) => this.getSymbolicName(l.getText()));

    return { type: 'multiLabel', variable, labels };
  };

  visitWhereClause = (ctx: WhereClauseContext): GrassWhereAST | undefined => {
    const boolExpr = ctx.booleanExpression();
    return this.visitBooleanExpression(boolExpr);
  };

  visitBooleanExpression = (
    ctx: ReturnType<WhereClauseContext['booleanExpression']>,
  ): GrassWhereAST | undefined => {
    const orExpr = ctx.orExpression();
    return this.visitOrExpression(orExpr);
  };

  visitOrExpression = (ctx: OrExpressionContext): GrassWhereAST | undefined => {
    const andExprs = ctx.andExpression_list();
    if (andExprs.length === 1) {
      return this.visitAndExpression(andExprs[0]);
    }

    const operands = andExprs
      .map((e) => this.visitAndExpression(e))
      .filter((o): o is GrassWhereAST => o !== undefined);

    return { type: 'or', operands };
  };

  visitAndExpression = (
    ctx: AndExpressionContext,
  ): GrassWhereAST | undefined => {
    const notExprs = ctx.notExpression_list();
    if (notExprs.length === 1) {
      return this.visitNotExpression(notExprs[0]);
    }

    const operands = notExprs
      .map((e) => this.visitNotExpression(e))
      .filter((o): o is GrassWhereAST => o !== undefined);

    return { type: 'and', operands };
  };

  visitNotExpression = (
    ctx: NotExpressionContext,
  ): GrassWhereAST | undefined => {
    // Check if this is a NOT expression
    if (ctx.NOT()) {
      const inner = ctx.notExpression();
      if (inner) {
        const operand = this.visitNotExpression(inner);
        if (operand) {
          return { type: 'not', operand };
        }
      }
    }

    // Otherwise it's a comparison expression
    const compExpr = ctx.comparisonExpression();
    if (compExpr) {
      return this.visitComparisonExpression(compExpr);
    }

    return undefined;
  };

  visitComparisonExpression = (
    ctx: ReturnType<NotExpressionContext['comparisonExpression']>,
  ): GrassWhereAST | undefined => {
    if (!ctx) return undefined;

    if (ctx instanceof EqualComparisonContext) {
      return this.visitEqualComparison(ctx);
    } else if (ctx instanceof NotEqualComparisonContext) {
      return this.visitNotEqualComparison(ctx);
    } else if (ctx instanceof LessThanComparisonContext) {
      return this.visitLessThanComparison(ctx);
    } else if (ctx instanceof GreaterThanComparisonContext) {
      return this.visitGreaterThanComparison(ctx);
    } else if (ctx instanceof LessThanOrEqualComparisonContext) {
      return this.visitLessThanOrEqualComparison(ctx);
    } else if (ctx instanceof GreaterThanOrEqualComparisonContext) {
      return this.visitGreaterThanOrEqualComparison(ctx);
    } else if (ctx instanceof ContainsComparisonContext) {
      return this.visitContainsComparison(ctx);
    } else if (ctx instanceof StartsWithComparisonContext) {
      return this.visitStartsWithComparison(ctx);
    } else if (ctx instanceof EndsWithComparisonContext) {
      return this.visitEndsWithComparison(ctx);
    } else if (ctx instanceof IsNullCheckContext) {
      return this.visitIsNullCheck(ctx);
    } else if (ctx instanceof IsNotNullCheckContext) {
      return this.visitIsNotNullCheck(ctx);
    } else if (ctx instanceof LabelCheckContext) {
      return this.visitLabelCheck(ctx);
    } else if (ctx instanceof PropertyExistenceCheckContext) {
      return this.visitPropertyExistenceCheck(ctx);
    } else if (ctx instanceof ParenthesizedBooleanContext) {
      return this.visitParenthesizedBoolean(ctx);
    }

    return undefined;
  };

  private makeComparison(
    ctx: { valueExpression_list(): ValueExpressionContext[] },
    operator: ComparisonOperator,
  ): GrassWhereAST {
    const values = ctx.valueExpression_list();
    const left = this.visitValueExpression(values[0]);
    const right = this.visitValueExpression(values[1]);
    return { type: 'comparison', operator, left, right };
  }

  visitEqualComparison = (ctx: EqualComparisonContext): GrassWhereAST => {
    return this.makeComparison(ctx, 'equal');
  };

  visitNotEqualComparison = (ctx: NotEqualComparisonContext): GrassWhereAST => {
    return this.makeComparison(ctx, 'notEqual');
  };

  visitLessThanComparison = (ctx: LessThanComparisonContext): GrassWhereAST => {
    return this.makeComparison(ctx, 'lessThan');
  };

  visitGreaterThanComparison = (
    ctx: GreaterThanComparisonContext,
  ): GrassWhereAST => {
    return this.makeComparison(ctx, 'greaterThan');
  };

  visitLessThanOrEqualComparison = (
    ctx: LessThanOrEqualComparisonContext,
  ): GrassWhereAST => {
    return this.makeComparison(ctx, 'lessThanOrEqual');
  };

  visitGreaterThanOrEqualComparison = (
    ctx: GreaterThanOrEqualComparisonContext,
  ): GrassWhereAST => {
    return this.makeComparison(ctx, 'greaterThanOrEqual');
  };

  visitContainsComparison = (ctx: ContainsComparisonContext): GrassWhereAST => {
    return this.makeComparison(ctx, 'contains');
  };

  visitStartsWithComparison = (
    ctx: StartsWithComparisonContext,
  ): GrassWhereAST => {
    return this.makeComparison(ctx, 'startsWith');
  };

  visitEndsWithComparison = (ctx: EndsWithComparisonContext): GrassWhereAST => {
    return this.makeComparison(ctx, 'endsWith');
  };

  visitIsNullCheck = (ctx: IsNullCheckContext): GrassWhereAST => {
    const value = this.visitValueExpression(ctx.valueExpression());
    return { type: 'isNull', value };
  };

  visitIsNotNullCheck = (ctx: IsNotNullCheckContext): GrassWhereAST => {
    const value = this.visitValueExpression(ctx.valueExpression());
    return { type: 'isNotNull', value };
  };

  visitLabelCheck = (ctx: LabelCheckContext): GrassWhereAST => {
    const variable = ctx.variable().getText();
    const label = this.getSymbolicName(ctx.grassLabelName().getText());
    return { type: 'labelCheck', variable, label };
  };

  visitPropertyExistenceCheck = (
    ctx: PropertyExistenceCheckContext,
  ): GrassWhereAST => {
    const propAccess = this.visitPropertyAccess(ctx.propertyAccess());
    if (propAccess.type === 'property') {
      return { type: 'propertyExistence', property: propAccess.name };
    }
    // Fallback - shouldn't happen since grammar only allows propertyAccess
    return { type: 'propertyExistence', property: '' };
  };

  visitParenthesizedBoolean = (
    ctx: ParenthesizedBooleanContext,
  ): GrassWhereAST | undefined => {
    return this.visitBooleanExpression(ctx.booleanExpression());
  };

  visitValueExpression = (ctx: ValueExpressionContext): GrassValueAST => {
    const propAccess = ctx.propertyAccess();
    if (propAccess) {
      return this.visitPropertyAccess(propAccess);
    }

    const literal = ctx.grassLiteral();
    if (literal) {
      return this.visitGrassLiteral(literal);
    }

    return { type: 'null' };
  };

  visitPropertyAccess = (ctx: PropertyAccessContext): GrassValueAST => {
    const propName = ctx.propertyName().getText();
    return { type: 'property', name: this.getSymbolicName(propName) };
  };

  visitGrassLiteral = (ctx: GrassLiteralContext): GrassValueAST => {
    const stringLit = ctx.grassStringLiteral();
    if (stringLit) {
      return this.visitGrassStringLiteral(stringLit);
    }

    const numLit = ctx.grassNumberLiteral();
    if (numLit) {
      return this.visitGrassNumberLiteral(numLit);
    }

    const boolLit = ctx.grassBooleanLiteral();
    if (boolLit) {
      return this.visitGrassBooleanLiteral(boolLit);
    }

    return { type: 'null' };
  };

  visitGrassStringLiteral = (ctx: GrassStringLiteralContext): GrassValueAST => {
    const text = ctx.getText();
    // Remove surrounding quotes and unescape
    const unquoted = text.slice(1, -1).replace(/\\(.)/g, '$1');
    return { type: 'string', value: unquoted };
  };

  visitGrassNumberLiteral = (ctx: GrassNumberLiteralContext): GrassValueAST => {
    const text = ctx.getText();
    const value = text.includes('.') ? parseFloat(text) : parseInt(text, 10);
    return { type: 'number', value };
  };

  visitGrassBooleanLiteral = (
    ctx: GrassBooleanLiteralContext,
  ): GrassValueAST => {
    const value = ctx.TRUE() !== null;
    return { type: 'boolean', value };
  };

  visitStyleMap = (ctx: StyleMapContext | null): GrassStyleAST => {
    const style: GrassStyleAST = {};

    // Handle case where styleMap context is null (missing APPLY clause)
    if (!ctx) {
      return style;
    }

    for (const propCtx of ctx.styleProperty_list()) {
      this.applyStyleProperty(propCtx, style);
    }

    return style;
  };

  applyStyleProperty = (
    ctx: StylePropertyContext,
    style: GrassStyleAST,
  ): void => {
    const colorProp = ctx.colorProperty();
    if (colorProp) {
      style.color = this.visitColorValue(colorProp.colorValue());
      return;
    }

    const sizeProp = ctx.sizeProperty();
    if (sizeProp) {
      style.size = this.parseNumber(sizeProp.grassNumberLiteral());
      return;
    }

    const widthProp = ctx.widthProperty();
    if (widthProp) {
      style.width = this.parseNumber(widthProp.grassNumberLiteral());
      return;
    }

    const captionsProp = ctx.captionsProperty();
    if (captionsProp) {
      style.captions = this.visitCaptionExpression(
        captionsProp.captionExpression(),
      );
      return;
    }

    const captionSizeProp = ctx.captionSizeProperty();
    if (captionSizeProp) {
      style.captionSize = this.parseNumber(
        captionSizeProp.grassNumberLiteral(),
      );
      return;
    }

    const captionAlignProp = ctx.captionAlignProperty();
    if (captionAlignProp) {
      style.captionAlign = this.visitCaptionAlignValue(
        captionAlignProp.captionAlignValue(),
      );
      return;
    }
  };

  visitColorValue = (ctx: ColorValueContext): string => {
    const hexColor = ctx.HEX_COLOR();
    if (hexColor) {
      return hexColor.getText();
    }

    const stringLit = ctx.grassStringLiteral();
    if (stringLit) {
      const text = stringLit.getText();
      return text.slice(1, -1);
    }

    return '';
  };

  visitCaptionAlignValue = (
    ctx: CaptionAlignValueContext,
  ): 'top' | 'bottom' | 'center' => {
    if (ctx.TOP()) return 'top';
    if (ctx.BOTTOM()) return 'bottom';
    if (ctx.CENTER()) return 'center';

    // String literal fallback
    const stringLit = ctx.grassStringLiteral();
    if (stringLit) {
      const text = stringLit.getText().slice(1, -1).toLowerCase();
      if (text === 'top' || text === 'bottom' || text === 'center') {
        return text;
      }
    }

    return 'center';
  };

  visitCaptionExpression = (
    ctx: CaptionExpressionContext,
  ): GrassCaptionAST[] => {
    const captions: GrassCaptionAST[] = [];

    for (const termCtx of ctx.captionTerm_list()) {
      const caption = this.processCaptionTerm(termCtx, []);
      captions.push(...caption);
    }

    return captions;
  };

  processCaptionTerm(
    ctx: CaptionTermContext,
    inheritedStyles: CaptionVariation[],
  ): GrassCaptionAST[] {
    const styledCaption = ctx.styledCaption();
    if (styledCaption) {
      if (styledCaption instanceof BoldCaptionContext) {
        return this.processBoldCaption(styledCaption, inheritedStyles);
      } else if (styledCaption instanceof ItalicCaptionContext) {
        return this.processItalicCaption(styledCaption, inheritedStyles);
      } else if (styledCaption instanceof UnderlineCaptionContext) {
        return this.processUnderlineCaption(styledCaption, inheritedStyles);
      }
    }

    const plainCaption = ctx.plainCaption();
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
      ctx.captionExpression(),
      newStyles,
    );
  }

  processItalicCaption(
    ctx: ItalicCaptionContext,
    inheritedStyles: CaptionVariation[],
  ): GrassCaptionAST[] {
    const newStyles: CaptionVariation[] = [...inheritedStyles, 'italic'];
    return this.processNestedCaptionExpression(
      ctx.captionExpression(),
      newStyles,
    );
  }

  processUnderlineCaption(
    ctx: UnderlineCaptionContext,
    inheritedStyles: CaptionVariation[],
  ): GrassCaptionAST[] {
    const newStyles: CaptionVariation[] = [...inheritedStyles, 'underline'];
    return this.processNestedCaptionExpression(
      ctx.captionExpression(),
      newStyles,
    );
  }

  processNestedCaptionExpression(
    ctx: CaptionExpressionContext,
    styles: CaptionVariation[],
  ): GrassCaptionAST[] {
    const captions: GrassCaptionAST[] = [];

    for (const termCtx of ctx.captionTerm_list()) {
      const nested = this.processCaptionTerm(termCtx, styles);
      captions.push(...nested);
    }

    return captions;
  }

  processPlainCaption(
    ctx: PlainCaptionContext,
    styles: CaptionVariation[],
  ): GrassCaptionAST[] {
    const stringLit = ctx.grassStringLiteral();
    if (stringLit) {
      const text = stringLit.getText();
      const unquoted = text.slice(1, -1).replace(/\\(.)/g, '$1');
      return [{ value: unquoted, styles }];
    }

    const propAccess = ctx.propertyAccess();
    if (propAccess) {
      const propName = propAccess.propertyName().getText();
      return [{ value: { property: this.getSymbolicName(propName) }, styles }];
    }

    const typeFunc = ctx.typeFunction();
    if (typeFunc) {
      return [{ value: { useType: true }, styles }];
    }

    return [];
  }

  parseNumber = (ctx: GrassNumberLiteralContext): number => {
    const text = ctx.getText();
    return text.includes('.') ? parseFloat(text) : parseInt(text, 10);
  };

  getSymbolicName = (text: string): string => {
    // Handle escaped identifiers (backtick-quoted)
    if (text.startsWith('`') && text.endsWith('`')) {
      return text.slice(1, -1).replace(/``/g, '`');
    }
    return text;
  };
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
  const lexer = new GrassLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new GrassParser(tokenStream);

  const errorListener = new GrassSyntaxErrorListener(input);
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  const tree = parser.styleSheet();

  const visitor = new GrassASTVisitor();
  const ast = visitor.visitStyleSheet(tree);

  // Check for invalid patterns (paths, multiple labels) and generate errors
  const errors = [...errorListener.errors];
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
          // Try to find the location of the null keyword
          const nullRegex = /\bnull\b/gi;
          let match;
          let start = 0;
          let end = 0;
          let line = 1;
          let column = 0;

          // Find all occurrences of 'null' and use the first one
          // (this is approximate but good enough for error reporting)
          while ((match = nullRegex.exec(input)) !== null) {
            start = match.index;
            end = start + 4; // 'null'.length
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
  return rules.map(stringifyRule).join('\n\n');
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
