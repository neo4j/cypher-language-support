/*
 * This file is a WIP of the second iteration of the Cypher formatter.
 * It's being kept as a separate file to enable having two separate version at once
 * since it would be difficult to consolidate the new and the old version
 */

import { CommonTokenStream, ParserRuleContext, TerminalNode } from 'antlr4';
import { default as CypherCmdLexer } from '../generated-parser/CypherCmdLexer';
import {
  ArrowLineContext,
  BooleanLiteralContext,
  CallClauseContext,
  CaseAlternativeContext,
  CaseExpressionContext,
  ClauseContext,
  CountStarContext,
  CreateClauseContext,
  ExistsExpressionContext,
  Expression10Context,
  Expression2Context,
  ExpressionContext,
  ExtendedCaseExpressionContext,
  ForeachClauseContext,
  FunctionInvocationContext,
  KeywordLiteralContext,
  LabelExpression2Context,
  LabelExpression3Context,
  LabelExpression4Context,
  LabelExpressionContext,
  LimitContext,
  ListItemsPredicateContext,
  ListLiteralContext,
  MapContext,
  MapProjectionContext,
  MapProjectionElementContext,
  MatchClauseContext,
  MergeActionContext,
  MergeClauseContext,
  NamespaceContext,
  NodePatternContext,
  NumberLiteralContext,
  ParameterContext,
  ParenthesizedExpressionContext,
  PathLengthContext,
  PatternContext,
  PatternListContext,
  ProcedureNameContext,
  PropertyContext,
  QuantifierContext,
  ReduceExpressionContext,
  RegularQueryContext,
  RelationshipPatternContext,
  ReturnBodyContext,
  ReturnClauseContext,
  ReturnItemContext,
  ReturnItemsContext,
  SetClauseContext,
  StatementsOrCommandsContext,
  SubqueryClauseContext,
  UnwindClauseContext,
  WhereClauseContext,
  WithClauseContext,
} from '../generated-parser/CypherCmdParser';
import CypherCmdParserVisitor from '../generated-parser/CypherCmdParserVisitor';
import {
  Chunk,
  CommentChunk,
  findTargetToken,
  getParseTreeAndTokens,
  handleMergeClause,
  isComment,
  RegularChunk,
  wantsToBeConcatenated,
  wantsToBeUpperCase,
} from './formattingHelpersv2';
import { buffersToFormattedString } from './formattingSolutionSearchv2';

interface RawTerminalOptions {
  lowerCase?: boolean;
  upperCase?: boolean;
  spacingChoice?: SpacingChoice;
}

type SpacingChoice = 'SPACE_AFTER' | 'EXTRA_SPACE';

export class TreePrintVisitor extends CypherCmdParserVisitor<void> {
  buffers: Chunk[][] = [];
  indentation = 0;
  indentationSpaces = 2;
  targetToken?: number;
  cursorPos = 0;
  startGroupCounter = 0;

  constructor(private tokenStream: CommonTokenStream) {
    super();
    this.buffers.push([]);
  }

  format = (root: StatementsOrCommandsContext) => {
    this.visit(root);
    const result = buffersToFormattedString(this.buffers);
    this.cursorPos += result.cursorPos;
    return result.formattedString;
  };

  currentBuffer = () => this.buffers.at(-1);

  breakLine = () => {
    if (this.currentBuffer().length > 0) {
      this.buffers.push([]);
    }
  };

  // If two tokens should never be split, concatenate them into one chunk
  concatenate = () => {
    // Loop since we might have multiple comments or special chunks anywhere, e.g. [b, C, C, a, C]
    // but we should still be able to concatenate a, b to ba
    const indices: number[] = [];
    for (let i = this.currentBuffer().length - 1; i >= 0; i--) {
      if (!(this.currentBuffer()[i].type === 'COMMENT')) {
        indices.push(i);
        if (indices.length === 2) {
          break;
        }
      }
    }
    if (indices.length < 2) {
      return;
    }
    const suffix = this.currentBuffer().splice(indices[0], 1)[0];
    const prefix = this.currentBuffer()[indices[1]];
    if (prefix.type !== 'REGULAR' || suffix.type !== 'REGULAR') {
      throw new Error('Internal formatter bug in concatenate');
    }
    const hasCursor = prefix.isCursor || suffix.isCursor;
    if (suffix.isCursor) {
      this.cursorPos += prefix.text.length;
    }
    const chunk: RegularChunk = {
      type: 'REGULAR',
      text: prefix.text + suffix.text,
      groupsStarting: prefix.groupsStarting + suffix.groupsStarting,
      groupsEnding: prefix.groupsEnding + suffix.groupsEnding,
      modifyIndentation: prefix.modifyIndentation + suffix.modifyIndentation,
      ...(hasCursor && { isCursor: true }),
    };
    this.currentBuffer()[indices[1]] = chunk;
  };

  /**
   * Sets that if the previous token should not choose between the argument ('noSpace' or 'noBreak')
   * Skips any preceding comments or special chunks we did not expect.
   */
  setAvoidProperty = (propertyName: 'noSpace' | 'noBreak'): void => {
    let idx = this.currentBuffer().length - 1;

    while (idx >= 0 && this.currentBuffer()[idx].type === 'COMMENT') {
      idx--;
    }

    if (idx < 0) {
      return;
    }

    const chunk = this.currentBuffer()[idx];
    if (chunk.type !== 'REGULAR') {
      throw new Error(`Internal formatter bug in setting ${propertyName}`);
    }

    chunk[propertyName] = true;
  };

  avoidSpaceBetween = (): void => {
    this.setAvoidProperty('noSpace');
  };

  avoidBreakBetween = (): void => {
    this.setAvoidProperty('noBreak');
  };

  startGroup = () => {
    this.startGroupCounter += 1;
  };

  endGroup = () => {
    this.currentBuffer().at(-1).groupsEnding += 1;
  };

  addIndentation = () => {
    this.currentBuffer().at(-1).modifyIndentation += 1;
  };

  removeIndentation = () => {
    this.currentBuffer().at(-1).modifyIndentation -= 1;
  };

  // Comments are in the hidden channel, so grab them manually
  addCommentsBefore = (node: TerminalNode) => {
    const token = node.symbol;
    const hiddenTokens = this.tokenStream.getHiddenTokensToLeft(
      token.tokenIndex,
    );
    const commentTokens = (hiddenTokens || []).filter((token) =>
      isComment(token),
    );
    for (const commentToken of commentTokens) {
      const text = commentToken.text.trim();
      const chunk: CommentChunk = {
        type: 'COMMENT',
        breakBefore: false,
        text,
        groupsStarting: this.startGroupCounter,
        groupsEnding: 0,
        modifyIndentation: 0,
      };
      this.startGroupCounter = 0;
      this.currentBuffer().push(chunk);
      this.breakLine();
    }
  };

  addCommentsAfter = (node: TerminalNode) => {
    const token = node.symbol;
    const hiddenTokens = this.tokenStream.getHiddenTokensToRight(
      token.tokenIndex,
    );
    const commentTokens = (hiddenTokens || []).filter((token) =>
      isComment(token),
    );
    const nodeLine = node.symbol.line;
    for (const commentToken of commentTokens) {
      const text = commentToken.text.trim();
      const commentLine = commentToken.line;
      const chunk: CommentChunk = {
        type: 'COMMENT',
        breakBefore: nodeLine !== commentLine,
        text,
        groupsStarting: this.startGroupCounter,
        groupsEnding: 0,
        modifyIndentation: 0,
      };
      this.startGroupCounter = 0;
      this.currentBuffer().push(chunk);
    }
  };

  visitIfNotNull = (ctx: ParserRuleContext | TerminalNode) => {
    if (ctx) {
      this.visit(ctx);
    }
  };

  visitRawIfNotNull = (ctx: TerminalNode, options?: RawTerminalOptions) => {
    if (ctx) {
      this.visitTerminalRaw(ctx, options);
    }
  };

  // Handled separately because clauses should start on new lines, see
  // https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-indentation-and-line-breaks
  visitClause = (ctx: ClauseContext) => {
    this.breakLine();
    this.visitChildren(ctx);
  };

  visitWithClause = (ctx: WithClauseContext) => {
    this.visit(ctx.WITH());
    this.avoidBreakBetween();
    this.startGroup();
    this.visit(ctx.returnBody());
    this.visitIfNotNull(ctx.whereClause());
    this.endGroup();
  };

  visitMatchClause = (ctx: MatchClauseContext) => {
    this.visitIfNotNull(ctx.OPTIONAL());
    this.visit(ctx.MATCH());
    this.avoidBreakBetween();
    this.startGroup();
    this.visitIfNotNull(ctx.matchMode());
    this.visit(ctx.patternList());
    this.endGroup();
    const n = ctx.hint_list().length;
    for (let i = 0; i < n; i++) {
      this.visit(ctx.hint(i));
    }
    this.visitIfNotNull(ctx.whereClause());
  };

  visitCreateClause = (ctx: CreateClauseContext) => {
    this.visit(ctx.CREATE());
    this.avoidBreakBetween();
    this.startGroup();
    this.visit(ctx.patternList());
    this.endGroup();
  };

  visitReturnClause = (ctx: ReturnClauseContext) => {
    this.visit(ctx.RETURN());
    this.avoidBreakBetween();
    this.startGroup();
    this.visit(ctx.returnBody());
    this.endGroup();
  };

  visitUnwindClause = (ctx: UnwindClauseContext) => {
    this.visit(ctx.UNWIND());
    this.avoidBreakBetween();
    this.startGroup();
    this.visit(ctx.expression());
    this.startGroup();
    this.visit(ctx.AS());
    this.visit(ctx.variable());
    this.endGroup();
    this.endGroup();
  };

  visitLimit = (ctx: LimitContext) => {
    this.breakLine();
    this.visitChildren(ctx);
  };

  visitReturnItem = (ctx: ReturnItemContext) => {
    this.visit(ctx.expression());
    this.startGroup();
    this.visitIfNotNull(ctx.AS());
    this.visitIfNotNull(ctx.variable());
    this.endGroup();
  };

  visitReturnItems = (ctx: ReturnItemsContext) => {
    if (ctx.TIMES()) {
      this.visit(ctx.TIMES());
    }
    const n = ctx.returnItem_list().length;
    if (ctx.TIMES() && n > 0) {
      this.visit(ctx.COMMA(0));
    }
    for (let i = 0; i < n; i++) {
      this.startGroup();
      this.visit(ctx.returnItem(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
      this.endGroup();
    }
  };

  visitReturnBody = (ctx: ReturnBodyContext) => {
    this.visitIfNotNull(ctx.DISTINCT());
    this.visit(ctx.returnItems());
    if (ctx.orderBy() || ctx.skip() || ctx.limit()) {
      this.startGroup();
      this.visitIfNotNull(ctx.orderBy());
      this.visitIfNotNull(ctx.skip());
      this.visitIfNotNull(ctx.limit());
      this.endGroup();
    }
  };

  // Handled separately because count star is its own thing
  visitCountStar = (ctx: CountStarContext) => {
    this.visitTerminalRaw(ctx.COUNT());
    this.visit(ctx.LPAREN());
    this.visitTerminalRaw(ctx.TIMES());
    this.visit(ctx.RPAREN());
  };

  visitReduceExpression = (ctx: ReduceExpressionContext) => {
    this.startGroup();
    this.visitTerminalRaw(ctx.REDUCE());
    this.visit(ctx.LPAREN());
    this.visit(ctx.variable(0));
    this.visit(ctx.EQ());
    this.visit(ctx.expression(0));
    this.visitTerminalRaw(ctx.COMMA());
    this.visit(ctx.variable(1));
    this.visit(ctx.IN());
    this.visit(ctx.expression(1));
    this.visit(ctx.BAR());
    this.visit(ctx.expression(2));
    this.visit(ctx.RPAREN());
    this.endGroup();
  };

  // Handled separately to avoid spaces between a minus and a number
  visitNumberLiteral = (ctx: NumberLiteralContext) => {
    this.visitRawIfNotNull(ctx.MINUS());
    this.visitIfNotNull(ctx.DECIMAL_DOUBLE());
    this.visitIfNotNull(ctx.UNSIGNED_DECIMAL_INTEGER());
    this.visitIfNotNull(ctx.UNSIGNED_HEX_INTEGER());
    this.visitIfNotNull(ctx.UNSIGNED_OCTAL_INTEGER());
  };

  // Handled separately since otherwise they will get weird spacing
  visitLabelExpression = (ctx: LabelExpressionContext) => {
    this.visitRawIfNotNull(ctx.COLON());
    if (ctx.IS()) {
      this.visitIfNotNull(ctx.IS());
    } else {
      this.avoidSpaceBetween();
    }
    this.visit(ctx.labelExpression4());
  };

  visitLabelExpression4 = (ctx: LabelExpression4Context) => {
    // There is no great way to know which labels have colons before them,
    // so we have to resort to manually checking the types of the children.
    const n = ctx.getChildCount();
    for (let i = 0; i < n; i++) {
      const child = ctx.getChild(i);
      if (child instanceof LabelExpression3Context) {
        this.visit(child);
        if (i > 0) {
          this.concatenate();
        }
      } else if (child instanceof TerminalNode) {
        this.avoidSpaceBetween();
        this.visitTerminal(child);
      }
    }
  };

  visitLabelExpression3 = (ctx: LabelExpression3Context) => {
    const n = ctx.getChildCount();
    for (let i = 0; i < n; i++) {
      const child = ctx.getChild(i);
      if (child instanceof LabelExpression2Context) {
        this.visit(child);
        if (i > 0) {
          this.concatenate();
        }
      } else if (child instanceof TerminalNode) {
        this.avoidSpaceBetween();
        this.visitTerminal(child);
      }
    }
  };

  visitLabelExpression2 = (ctx: LabelExpression2Context) => {
    const n = ctx.EXCLAMATION_MARK_list().length;
    for (let i = 0; i < n; i++) {
      this.visitTerminalRaw(ctx.EXCLAMATION_MARK(i));
      this.concatenate();
      if (i == n - 1) {
        this.avoidSpaceBetween();
      }
    }
    this.visit(ctx.labelExpression1());
  };

  visitTerminal = (node: TerminalNode) => {
    if (this.buffers.length === 1 && this.currentBuffer().length === 0) {
      this.addCommentsBefore(node);
    }
    if (node.symbol.type === CypherCmdLexer.EOF) {
      return;
    }
    let text = node.getText();
    if (wantsToBeUpperCase(node)) {
      text = text.toUpperCase();
    }
    const chunk: RegularChunk = {
      type: 'REGULAR',
      text,
      node,
      groupsStarting: this.startGroupCounter,
      groupsEnding: 0,
      modifyIndentation: 0,
    };
    this.startGroupCounter = 0;
    if (node.symbol.tokenIndex === this.targetToken) {
      chunk.isCursor = true;
    }
    this.currentBuffer().push(chunk);
    if (wantsToBeConcatenated(node)) {
      this.concatenate();
    }
    this.addCommentsAfter(node);
  };

  // Some terminals don't want to have the regular rules applied to them,
  // for instance the . in properties should be handled in a "raw" manner to
  // avoid getting spaces around it (since it is an operator and operators want spaces)
  // But we still need to get the comments, to ensure that in e.g. the query
  // node. // comment
  // prop
  // the comment doesn't disappear
  visitTerminalRaw = (node: TerminalNode, options?: RawTerminalOptions) => {
    if (this.buffers.length === 1 && this.currentBuffer().length === 0) {
      this.addCommentsBefore(node);
    }
    let text = node.getText();
    if (options?.lowerCase) {
      text = text.toLowerCase();
    }
    if (options?.upperCase) {
      text = text.toUpperCase();
    }
    if (options?.spacingChoice === 'EXTRA_SPACE') {
      text += ' ';
    }

    const chunk: RegularChunk = {
      type: 'REGULAR',
      text,
      node,
      groupsStarting: this.startGroupCounter,
      groupsEnding: 0,
      modifyIndentation: 0,
    };
    this.startGroupCounter = 0;
    if (node.symbol.tokenIndex === this.targetToken) {
      chunk.isCursor = true;
    }

    this.currentBuffer().push(chunk);
    if (!options?.spacingChoice) {
      this.avoidSpaceBetween();
    }
    if (wantsToBeConcatenated(node)) {
      this.concatenate();
    }
    this.addCommentsAfter(node);
  };

  // Handled separately because the dollar should not be treated
  // as an operator
  visitParameter = (ctx: ParameterContext) => {
    this.visitTerminalRaw(ctx.DOLLAR());
    this.visit(ctx.parameterName());
    this.concatenate();
  };

  // Literals have casing rules, see
  // https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-casing
  visitBooleanLiteral = (ctx: BooleanLiteralContext) => {
    this.visitRawIfNotNull(ctx.TRUE(), {
      lowerCase: true,
      spacingChoice: 'SPACE_AFTER',
    });
    this.visitRawIfNotNull(ctx.FALSE(), {
      lowerCase: true,
      spacingChoice: 'SPACE_AFTER',
    });
  };

  visitKeywordLiteral = (ctx: KeywordLiteralContext) => {
    if (ctx.NULL()) {
      this.visitTerminalRaw(ctx.NULL(), {
        lowerCase: true,
        spacingChoice: 'SPACE_AFTER',
      });
    } else {
      this.visitChildren(ctx);
    }
  };

  // The patterns are handled separately because we need spaces
  // between labels and property predicates in patterns
  handleInnerPatternContext = (
    ctx: NodePatternContext | RelationshipPatternContext,
  ) => {
    this.visitIfNotNull(ctx.variable());
    this.visitIfNotNull(ctx.labelExpression());
    if (ctx instanceof RelationshipPatternContext) {
      this.visitIfNotNull(ctx.pathLength());
      this.concatenate();
    }
    this.visitIfNotNull(ctx.properties());
    if (ctx.WHERE()) {
      this.visit(ctx.WHERE());
      this.visit(ctx.expression());
    }
  };

  visitPathLength = (ctx: PathLengthContext) => {
    this.visitTerminalRaw(ctx.TIMES());
    if (ctx._single) {
      this.visitTerminalRaw(ctx.UNSIGNED_DECIMAL_INTEGER(0));
      this.concatenate();
    } else if (ctx.DOTDOT()) {
      let idx = 0;
      if (ctx._from_) {
        this.visitTerminalRaw(ctx.UNSIGNED_DECIMAL_INTEGER(idx));
        this.concatenate();
        idx++;
      }
      this.visitTerminalRaw(ctx.DOTDOT());
      this.concatenate();
      if (ctx._to) {
        this.visitTerminalRaw(ctx.UNSIGNED_DECIMAL_INTEGER(idx));
        this.concatenate();
      }
    }
  };

  visitArrowLine = (ctx: ArrowLineContext) => {
    this.visitRawIfNotNull(ctx.MINUS());
    this.visitRawIfNotNull(ctx.ARROW_LINE());
  };

  visitRelationshipPattern = (ctx: RelationshipPatternContext) => {
    if (ctx.leftArrow()) {
      this.avoidSpaceBetween();
      this.visitIfNotNull(ctx.leftArrow());
    }
    const arrowLineList = ctx.arrowLine_list();
    this.avoidSpaceBetween();
    this.visit(arrowLineList[0]);
    if (ctx.LBRACKET()) {
      this.startGroup();
      this.visit(ctx.LBRACKET());
      this.handleInnerPatternContext(ctx);
      this.visit(ctx.RBRACKET());
      this.endGroup();
    }
    this.avoidSpaceBetween();
    this.visit(arrowLineList[1]);
    if (ctx.rightArrow()) {
      this.visit(ctx.rightArrow());
      this.concatenate();
    }
    // Put the relationship [] and the arrow in the same chunk
    if (ctx.LBRACKET()) {
      this.concatenate();
    }
    this.avoidSpaceBetween();
  };

  visitNodePattern = (ctx: NodePatternContext) => {
    this.startGroup();
    this.visitChildren(ctx);
    this.endGroup();
  };

  visitPattern = (ctx: PatternContext) => {
    // Don't create an unnecessary group if we don't also have a path
    if (!ctx.variable() && !ctx.selector()) {
      this.visitChildren(ctx);
      return;
    }
    if (ctx.variable()) {
      this.visit(ctx.variable());
      this.visit(ctx.EQ());
      this.avoidBreakBetween();
    }
    this.startGroup();
    this.visitIfNotNull(ctx.selector());
    this.visit(ctx.anonymousPattern());
    this.endGroup();
  };

  visitPatternList = (ctx: PatternListContext) => {
    const n = ctx.pattern_list().length;
    if (n === 1) {
      this.visitChildren(ctx);
      return;
    }
    for (let i = 0; i < n; i++) {
      this.startGroup();
      this.visit(ctx.pattern(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
      this.endGroup();
    }
  };

  // Handled separately because we never want to split within the quantifier.
  // So we fully concatenate it to ensure it's part of the same chunk.
  visitQuantifier = (ctx: QuantifierContext) => {
    if (ctx.PLUS() || ctx.TIMES()) {
      this.visitChildren(ctx);
      this.concatenate();
      this.avoidSpaceBetween();
      return;
    }
    if (!ctx._from_) {
      this.visitTerminalRaw(ctx.LCURLY(), { spacingChoice: 'EXTRA_SPACE' });
    } else {
      this.visit(ctx.LCURLY());
    }
    this.concatenate();
    let idx = 0;
    if (ctx._from_) {
      this.visit(ctx.UNSIGNED_DECIMAL_INTEGER(idx));
      this.concatenate();
      idx++;
    }
    if (ctx._to) {
      this.visit(ctx.COMMA());
      this.concatenate();
      this.visit(ctx.UNSIGNED_DECIMAL_INTEGER(idx));
      this.concatenate();
    } else {
      this.visitTerminalRaw(ctx.COMMA(), { spacingChoice: 'EXTRA_SPACE' });
      this.concatenate();
    }
    this.visit(ctx.RCURLY());
    this.concatenate();
    this.avoidSpaceBetween();
  };

  // Handled separately because the dots aren't operators
  visitNamespace = (ctx: NamespaceContext) => {
    const n = ctx.DOT_list().length;
    for (let i = 0; i < n; i++) {
      this.visit(ctx.symbolicNameString(i));
      this.avoidSpaceBetween();
      this.visitTerminalRaw(ctx.DOT(i));
    }
  };

  // Handled separately because the dot is not an operator
  visitProperty = (ctx: PropertyContext) => {
    this.visitTerminalRaw(ctx.DOT());
    if (!(ctx.parentCtx instanceof MapProjectionElementContext)) {
      this.concatenate();
    }
    this.visit(ctx.propertyKeyName());
    this.concatenate();
  };

  // Handled separately because where is not a clause (it is a subclause)
  visitWhereClause = (ctx: WhereClauseContext) => {
    this.breakLine();
    this.visit(ctx.WHERE());
    this.avoidBreakBetween();
    this.startGroup();
    this.visit(ctx.expression());
    this.endGroup();
  };

  visitParenthesizedExpression = (ctx: ParenthesizedExpressionContext) => {
    this.visit(ctx.LPAREN());
    this.avoidBreakBetween();
    this.startGroup();
    this.visit(ctx.expression());
    this.endGroup();
    this.visit(ctx.RPAREN());
  };

  visitExpression = (ctx: ExpressionContext) => {
    const n = ctx.expression11_list().length;
    if (n === 1) {
      this.visit(ctx.expression11(0));
      return;
    }
    for (let i = 0; i < n; i++) {
      this.startGroup();
      this.visit(ctx.expression11(i));
      if (i < n - 1) {
        this.visit(ctx.OR(i));
      }
      this.endGroup();
    }
  };

  visitExpression10 = (ctx: Expression10Context) => {
    const n = ctx.expression9_list().length;
    if (n === 1) {
      this.visit(ctx.expression9(0));
      return;
    }
    for (let i = 0; i < n; i++) {
      this.startGroup();
      this.visit(ctx.expression9(i));
      if (i < n - 1) {
        this.visit(ctx.AND(i));
      }
      this.endGroup();
    }
  };

  // Handled separately because it contains subclauses (and thus indentation rules)
  visitExistsExpression = (ctx: ExistsExpressionContext) => {
    this.visit(ctx.EXISTS());
    this.avoidBreakBetween();
    this.visit(ctx.LCURLY());
    if (ctx.regularQuery()) {
      this.addIndentation();
      this.visit(ctx.regularQuery());
      this.removeIndentation();
      this.breakLine();
    } else {
      this.visitIfNotNull(ctx.matchMode());
      this.visit(ctx.patternList());
      this.visitIfNotNull(ctx.whereClause());
    }
    this.visit(ctx.RCURLY());
  };

  visitCaseAlternative = (ctx: CaseAlternativeContext) => {
    this.startGroup();
    this.visit(ctx.WHEN());
    this.visit(ctx.expression(0));
    this.visit(ctx.THEN());
    this.visit(ctx.expression(1));
    this.endGroup();
  };

  // Handled separately since cases want newlines
  visitCaseExpression = (ctx: CaseExpressionContext) => {
    this.breakLine();
    this.visit(ctx.CASE());
    this.startGroup();
    const n = ctx.caseAlternative_list().length;
    for (let i = 0; i < n; i++) {
      this.addIndentation();
      this.breakLine();
      this.visit(ctx.caseAlternative(i));
      this.removeIndentation();
    }
    if (ctx.ELSE()) {
      this.addIndentation();
      this.breakLine();
      this.visit(ctx.ELSE());
      this.visit(ctx.expression());
      this.removeIndentation();
    }
    this.endGroup();
    this.breakLine();
    this.visit(ctx.END());
  };

  visitExtendedCaseExpression = (ctx: ExtendedCaseExpressionContext) => {
    this.breakLine();
    this.visit(ctx.CASE());
    this.visit(ctx.expression(0));
    this.startGroup();
    const n = ctx.extendedCaseAlternative_list().length;
    for (let i = 0; i < n; i++) {
      this.addIndentation();
      this.breakLine();
      this.visit(ctx.extendedCaseAlternative(i));
      this.removeIndentation();
    }
    if (ctx.ELSE()) {
      this.addIndentation();
      this.breakLine();
      this.visit(ctx.ELSE());
      this.visit(ctx.expression(1));
      this.removeIndentation();
    }
    this.endGroup();
    this.breakLine();
    this.visit(ctx.END());
  };

  // Handled separately because it wants indentation and line breaks
  visitSubqueryClause = (ctx: SubqueryClauseContext) => {
    this.visitIfNotNull(ctx.OPTIONAL());
    this.visit(ctx.CALL());
    this.visitIfNotNull(ctx.subqueryScope());
    this.visit(ctx.LCURLY());
    this.addIndentation();
    this.breakLine();
    this.visit(ctx.regularQuery());
    this.removeIndentation();
    this.breakLine();
    this.visit(ctx.RCURLY());
    this.visitIfNotNull(ctx.subqueryInTransactionsParameters());
  };

  // Handled separately because UNION wants to look a certain way
  visitRegularQuery = (ctx: RegularQueryContext) => {
    this.visit(ctx.singleQuery(0));
    const n = ctx.singleQuery_list().length - 1;
    for (let i = 0; i < n; i++) {
      this.addIndentation();
      this.breakLine();
      this.visit(ctx.UNION(i));
      this.removeIndentation();
      if (ctx.ALL(i)) {
        this.visit(ctx.ALL(i));
      } else if (ctx.DISTINCT(i)) {
        this.visit(ctx.DISTINCT(i));
      }
      this.breakLine();
      this.visit(ctx.singleQuery(i + 1));
    }
  };

  visitFunctionInvocation = (ctx: FunctionInvocationContext) => {
    this.visit(ctx.functionName());
    this.visit(ctx.LPAREN());
    this.concatenate(); // Don't separate the function name and the (
    if (ctx.DISTINCT() || ctx.ALL()) {
      this.avoidSpaceBetween();
    }
    this.visitIfNotNull(ctx.ALL());
    this.visitIfNotNull(ctx.DISTINCT());
    this.startGroup();
    const n = ctx.functionArgument_list().length;
    for (let i = 0; i < n; i++) {
      // Don't put a space between the ( and the first argument
      if (i == 0 && !ctx.DISTINCT() && !ctx.ALL()) {
        this.avoidSpaceBetween();
      }
      this.startGroup();
      this.visit(ctx.functionArgument(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
      this.endGroup();
    }
    this.visit(ctx.RPAREN());
    this.endGroup();
  };

  // Handled separately because we want ON CREATE before ON MATCH
  visitMergeClause = (ctx: MergeClauseContext) => {
    handleMergeClause(
      ctx,
      (node) => this.visit(node),
      this.startGroup,
      this.endGroup,
    );
  };

  // Handled separately because it wants indentation
  // https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-indentation-and-line-breaks
  visitMergeAction = (ctx: MergeActionContext) => {
    this.addIndentation();
    this.breakLine();
    this.visitChildren(ctx);
    this.removeIndentation();
  };

  visitSetClause = (ctx: SetClauseContext) => {
    this.visit(ctx.SET());
    this.avoidBreakBetween();
    this.startGroup();
    const n = ctx.setItem_list().length;
    for (let i = 0; i < n; i++) {
      this.startGroup();
      this.visit(ctx.setItem(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
      this.endGroup();
    }
    this.endGroup();
  };

  // Map has its own formatting rules, see:
  // https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-spacing
  visitMap = (ctx: MapContext) => {
    this.visit(ctx.LCURLY());
    this.avoidSpaceBetween();
    this.avoidBreakBetween();
    this.startGroup();
    const propertyKeyNames = ctx.propertyKeyName_list();
    const expressions = ctx.expression_list();
    const commaList = ctx.COMMA_list();
    const colonList = ctx.COLON_list();
    for (let i = 0; i < expressions.length; i++) {
      this.startGroup();
      this.visit(propertyKeyNames[i]);
      this.visitTerminalRaw(colonList[i]);
      this.visit(expressions[i]);
      if (i < expressions.length - 1) {
        this.visit(commaList[i]);
      }
      this.endGroup();
    }
    this.avoidSpaceBetween();
    this.endGroup();
    this.avoidBreakBetween();
    this.visit(ctx.RCURLY());
  };

  visitMapProjection = (ctx: MapProjectionContext) => {
    this.visit(ctx.variable());
    this.visit(ctx.LCURLY());
    this.avoidSpaceBetween();
    const n = ctx.mapProjectionElement_list().length;
    // Not sure if these should have groups around them?
    // Haven't been able to find a case where it matters so far.
    for (let i = 0; i < n; i++) {
      this.visit(ctx.mapProjectionElement(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
    }
    this.avoidSpaceBetween();
    this.visit(ctx.RCURLY());
  };

  visitListItemsPredicate = (ctx: ListItemsPredicateContext) => {
    this.visitRawIfNotNull(ctx.ALL());
    this.visitRawIfNotNull(ctx.ANY());
    this.visitRawIfNotNull(ctx.NONE());
    this.visitRawIfNotNull(ctx.SINGLE());
    this.visit(ctx.LPAREN());
    this.concatenate();
    this.avoidSpaceBetween();
    this.startGroup();
    this.visit(ctx.variable());
    this.visit(ctx.IN());
    this.visit(ctx._inExp);
    if (ctx.WHERE()) {
      this.visit(ctx.WHERE());
      this.visit(ctx._whereExp);
    }
    this.endGroup();
    this.visit(ctx.RPAREN());
  };

  visitListLiteral = (ctx: ListLiteralContext) => {
    this.visit(ctx.LBRACKET());
    this.avoidBreakBetween();
    this.startGroup();
    const n = ctx.expression_list().length;
    for (let i = 0; i < n; i++) {
      this.startGroup();
      this.visit(ctx.expression(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
      if (i === n - 1) {
        this.avoidSpaceBetween();
      }
      this.endGroup();
    }
    this.visit(ctx.RBRACKET());
    this.endGroup();
  };

  visitForeachClause = (ctx: ForeachClauseContext) => {
    this.visit(ctx.FOREACH());
    this.visit(ctx.LPAREN());
    this.visit(ctx.variable());
    this.visit(ctx.IN());
    this.visit(ctx.expression());
    this.visit(ctx.BAR());

    const n = ctx.clause_list().length;
    for (let i = 0; i < n; i++) {
      this.addIndentation();
      this.visit(ctx.clause(i));
      this.removeIndentation();
    }
    this.breakLine();
    this.visit(ctx.RPAREN());
  };

  visitExpression2 = (ctx: Expression2Context) => {
    this.visit(ctx.expression1());
    const n = ctx.postFix_list().length;
    for (let i = 0; i < n; i++) {
      this.avoidSpaceBetween();
      this.visit(ctx.postFix(i));
    }
  };

  visitProcedureName = (ctx: ProcedureNameContext) => {
    this.startGroup();
    this.visit(ctx.namespace());
    this.visit(ctx.symbolicNameString());
    this.endGroup();
  };

  visitCallClause = (ctx: CallClauseContext) => {
    this.visitIfNotNull(ctx.OPTIONAL());
    this.visit(ctx.CALL());
    this.avoidBreakBetween();
    this.visit(ctx.procedureName());
    const n = ctx.procedureArgument_list().length;
    if (ctx.LPAREN()) {
      this.visitTerminalRaw(ctx.LPAREN());
      this.concatenate();
      this.avoidBreakBetween();
    }
    if (n > 0) {
      this.startGroup();
    }
    for (let i = 0; i < n; i++) {
      if (i === 0) {
        this.avoidSpaceBetween();
      }
      this.visit(ctx.procedureArgument(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
    }
    this.visitRawIfNotNull(ctx.RPAREN());
    if (n > 0) {
      this.endGroup();
    }
    if (ctx.YIELD()) {
      this.startGroup();
      this.visit(ctx.YIELD());
      if (ctx.TIMES()) {
        this.visit(ctx.TIMES());
        if (n > 1) {
          this.visit(ctx.COMMA(n - 1));
        }
      }
      this.startGroup();
      const m = ctx.procedureResultItem_list().length;
      for (let i = 0; i < m; i++) {
        this.visit(ctx.procedureResultItem(i));
        if (i < m - 1) {
          this.visit(ctx.COMMA(i));
        }
      }
      this.endGroup();
      this.visitIfNotNull(ctx.whereClause());
      this.endGroup();
    }
  };
}

interface FormattingResultWithCursor {
  formattedString: string;
  newCursorPos: number;
}

export function formatQuery(query: string): string;
export function formatQuery(
  query: string,
  cursorPosition: number,
): FormattingResultWithCursor;
export function formatQuery(
  query: string,
  cursorPosition?: number,
): string | FormattingResultWithCursor {
  const { tree, tokens } = getParseTreeAndTokens(query);
  const visitor = new TreePrintVisitor(tokens);

  tokens.fill();

  if (cursorPosition === undefined) return visitor.format(tree);

  if (cursorPosition >= query.length || cursorPosition <= 0) {
    const result = visitor.format(tree);
    return {
      formattedString: result,
      newCursorPos: cursorPosition === 0 ? 0 : result.length,
    };
  }

  const targetToken = findTargetToken(tokens.tokens, cursorPosition);
  if (!targetToken) {
    return {
      formattedString: visitor.format(tree),
      newCursorPos: 0,
    };
  }
  const relativePosition = cursorPosition - targetToken.start;
  visitor.targetToken = targetToken.tokenIndex;

  return {
    formattedString: visitor.format(tree),
    newCursorPos: visitor.cursorPos + relativePosition,
  };
}
