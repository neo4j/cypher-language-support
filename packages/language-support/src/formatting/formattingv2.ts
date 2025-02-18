/*
 * This file is a WIP of the second iteration of the Cypher formatter.
 * It's being kept as a separate file to enable having two separate version at once
 * since it would be difficult to consolidate the new and the old version
 */

import { CommonTokenStream, ParserRuleContext, TerminalNode } from 'antlr4';
import { default as CypherCmdLexer } from '../generated-parser/CypherCmdLexer';
import {
  BooleanLiteralContext,
  CaseExpressionContext,
  ClauseContext,
  CountStarContext,
  ExistsExpressionContext,
  Expression10Context,
  Expression2Context,
  ExpressionContext,
  ExtendedCaseExpressionContext,
  ForeachClauseContext,
  FunctionInvocationContext,
  KeywordLiteralContext,
  LabelExpressionContext,
  ListLiteralContext,
  MapContext,
  MatchClauseContext,
  MergeActionContext,
  MergeClauseContext,
  NamespaceContext,
  NodePatternContext,
  NumberLiteralContext,
  ParameterContext,
  ParenthesizedExpressionContext,
  PatternContext,
  PatternListContext,
  PropertyContext,
  RegularQueryContext,
  RelationshipPatternContext,
  ReturnBodyContext,
  ReturnClauseContext,
  ReturnItemsContext,
  SetClauseContext,
  StatementsOrCommandsContext,
  SubqueryClauseContext,
  WhereClauseContext,
  WithClauseContext,
} from '../generated-parser/CypherCmdParser';
import CypherCmdParserVisitor from '../generated-parser/CypherCmdParserVisitor';
import {
  buffersToFormattedString,
  Chunk,
  dedentChunk,
  findTargetToken,
  getParseTreeAndTokens,
  groupEndChunk,
  groupStartChunk,
  handleMergeClause,
  indentChunk,
  isComment,
  wantsToBeConcatenated,
  wantsToBeUpperCase,
} from './formattingHelpersv2';

interface RawTerminalOptions {
  lowerCase?: boolean;
  upperCase?: boolean;
  space?: boolean;
}

export class TreePrintVisitor extends CypherCmdParserVisitor<void> {
  buffers: Chunk[][] = [];
  indentation = 0;
  indentationSpaces = 2;
  targetToken?: number;
  cursorPos?: number;

  constructor(private tokenStream: CommonTokenStream) {
    super();
    this.buffers.push([]);
  }

  format = (root: StatementsOrCommandsContext) => {
    this.visit(root);
    return buffersToFormattedString(this.buffers);
  };

  currentBuffer = () => this.buffers.at(-1);

  breakLine = () => {
    if (this.currentBuffer().length > 0) {
      this.buffers.push([]);
    }
  };

  // If two tokens should never be split, concatenate them into one chunk
  concatenate = () => {
    // Loop since we might have (multiple) comments anywhere, e.g. [b, C, C, a, C]
    // but we should still be able to concatenate a, b to ba
    const indices: number[] = [];
    for (let i = this.currentBuffer().length - 1; i >= 0; i--) {
      if (
        !this.currentBuffer()[i].isComment &&
        !this.currentBuffer()[i].specialBehavior
      ) {
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
    const chunk: Chunk = {
      text: prefix.text + suffix.text,
      start: prefix.start,
      end: prefix.end + suffix.text.length,
    };
    this.currentBuffer()[indices[1]] = chunk;
  };

  // If the previous token should choose between a newline or no space, rather than
  // a newline and a space
  avoidSpaceBetween = () => {
    let idx = this.currentBuffer().length - 1;
    while (
      idx >= 0 &&
      (this.currentBuffer()[idx].isComment ||
        this.currentBuffer()[idx].specialBehavior)
    ) {
      idx--;
    }
    if (idx < 0) {
      return;
    }
    this.currentBuffer()[idx].noSpace = true;
  };

  startGroup = () => {
    this.currentBuffer().push(groupStartChunk);
  };

  endGroup = () => {
    this.currentBuffer().push(groupEndChunk);
  };

  addIndentation = () => {
    this.currentBuffer().push(indentChunk);
  };

  removeIndentation = () => {
    this.currentBuffer().push(dedentChunk);
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
      const chunk: Chunk = {
        text,
        start: commentToken.start,
        end: commentToken.stop + 1,
        isComment: true,
      };
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
    for (const commentToken of commentTokens) {
      const text = commentToken.text.trim();
      const chunk: Chunk = {
        text,
        start: commentToken.start,
        end: commentToken.stop + 1,
        isComment: true,
      };
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
    this.startGroup();
    this.visit(ctx.returnBody());
    this.visitIfNotNull(ctx.whereClause());
    this.endGroup();
  };

  visitMatchClause = (ctx: MatchClauseContext) => {
    this.visitIfNotNull(ctx.OPTIONAL());
    this.visit(ctx.MATCH());
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

  visitReturnClause = (ctx: ReturnClauseContext) => {
    this.visit(ctx.RETURN());
    this.startGroup();
    this.visit(ctx.returnBody());
    this.endGroup();
  };

  visitReturnItems = (ctx: ReturnItemsContext) => {
    if (ctx.TIMES()) {
      this.visit(ctx.TIMES());
    }
    const n = ctx.returnItem_list().length;
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

  // Handled separately to avoid spaces between a minus and a number
  visitNumberLiteral = (ctx: NumberLiteralContext) => {
    this.visitRawIfNotNull(ctx.MINUS());
    this.visitIfNotNull(ctx.DECIMAL_DOUBLE());
    this.visitIfNotNull(ctx.UNSIGNED_DECIMAL_INTEGER());
    this.visitIfNotNull(ctx.UNSIGNED_HEX_INTEGER());
    this.visitIfNotNull(ctx.UNSIGNED_OCTAL_INTEGER());
  };

  // Handled separately since otherwise they will get weird spacing
  // TODO: doesn't handle the special label expressions yet
  // (labelExpression3 etc)
  visitLabelExpression = (ctx: LabelExpressionContext) => {
    this.visitRawIfNotNull(ctx.COLON());
    this.visitRawIfNotNull(ctx.IS());
    this.visit(ctx.labelExpression4());
    this.concatenate();
  };

  visitTerminal = (node: TerminalNode) => {
    if (this.buffers.length === 1 && this.currentBuffer().length === 0) {
      this.addCommentsBefore(node);
    }
    if (node.symbol.type === CypherCmdLexer.EOF) {
      return;
    }
    if (node.symbol.tokenIndex === this.targetToken) {
      this.cursorPos = this.buffers.reduce(
        (acc, buffer) =>
          acc +
          buffer.reduce((acc, chunk) => {
            return acc + chunk.text.length + (chunk.noSpace ? 0 : 1);
          }, 0),
        0,
      );
    }
    let text = node.getText();
    if (wantsToBeUpperCase(node)) {
      text = text.toUpperCase();
    }
    const chunk: Chunk = {
      text,
      node,
      start: node.symbol.start,
      end: node.symbol.stop + 1,
    };
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
    let result = node.getText();
    if (options?.lowerCase) {
      result = result.toLowerCase();
    }
    if (options?.upperCase) {
      result = result.toUpperCase();
    }
    if (node.symbol.tokenIndex === this.targetToken) {
      this.cursorPos = this.buffers.reduce(
        (acc, buffer) =>
          acc +
          buffer.reduce((acc, chunk) => {
            return acc + chunk.text.length + (chunk.noSpace ? 0 : 1);
          }, 0),
        0,
      );
    }
    const chunk: Chunk = {
      text: result,
      node,
      start: node.symbol.start,
      end: node.symbol.stop + 1,
    };
    this.currentBuffer().push(chunk);
    if (!options?.space) {
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
    this.visitRawIfNotNull(ctx.TRUE(), { lowerCase: true, space: true });
    this.visitRawIfNotNull(ctx.FALSE(), { lowerCase: true, space: true });
  };

  visitKeywordLiteral = (ctx: KeywordLiteralContext) => {
    if (ctx.NULL()) {
      this.visitTerminalRaw(ctx.NULL(), { lowerCase: true, space: true });
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
    this.visitIfNotNull(ctx.properties());
    if (ctx.WHERE()) {
      this.visit(ctx.WHERE());
      this.visit(ctx.expression());
    }
  };

  visitRelationshipPattern = (ctx: RelationshipPatternContext) => {
    if (ctx.leftArrow()) {
      this.avoidSpaceBetween();
      this.visitIfNotNull(ctx.leftArrow());
    }
    const arrowLineList = ctx.arrowLine_list();
    this.avoidSpaceBetween();
    this.visitTerminalRaw(arrowLineList[0].MINUS());
    if (ctx.LBRACKET()) {
      this.startGroup();
      this.visit(ctx.LBRACKET());
      this.handleInnerPatternContext(ctx);
      this.visit(ctx.RBRACKET());
      this.endGroup();
    }
    this.avoidSpaceBetween();
    this.visitTerminalRaw(arrowLineList[1].MINUS());
    this.visitIfNotNull(ctx.rightArrow());
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
    // Avoid wrapping the whole pattern in a group if there is a path so that
    // indentation happens around it
    this.endGroup();
    if (ctx.variable()) {
      this.visit(ctx.variable());
      this.visit(ctx.EQ());
    }
    this.visitIfNotNull(ctx.selector());
    this.startGroup();
    this.visit(ctx.anonymousPattern());
    this.endGroup();
    // Provide an opening for the surrounding group we closed before
    this.startGroup();
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
    this.concatenate();
    this.visit(ctx.propertyKeyName());
    this.concatenate();
  };

  // Handled separately because where is not a clause (it is a subclause)
  visitWhereClause = (ctx: WhereClauseContext) => {
    this.breakLine();
    this.visit(ctx.WHERE());
    this.startGroup();
    this.visit(ctx.expression());
    this.endGroup();
  };

  visitParenthesizedExpression = (ctx: ParenthesizedExpressionContext) => {
    this.visit(ctx.LPAREN());
    this.startGroup();
    this.visit(ctx.expression());
    this.endGroup();
    this.visit(ctx.RPAREN());
  }

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

  // Handled separately since cases want newlines
  visitCaseExpression = (ctx: CaseExpressionContext) => {
    this.breakLine();
    this.visit(ctx.CASE());
    this.addIndentation();
    const n = ctx.caseAlternative_list().length;
    for (let i = 0; i < n; i++) {
      this.breakLine();
      this.visit(ctx.caseAlternative(i));
    }
    if (ctx.ELSE()) {
      this.breakLine();
      this.visit(ctx.ELSE());
      this.visit(ctx.expression());
    }
    this.removeIndentation();
    this.breakLine();
    this.visit(ctx.END());
  };

  visitExtendedCaseExpression = (ctx: ExtendedCaseExpressionContext) => {
    this.breakLine();
    this.visit(ctx.CASE());
    this.visit(ctx.expression(0));
    this.addIndentation();
    const n = ctx.extendedCaseAlternative_list().length;
    for (let i = 0; i < n; i++) {
      this.breakLine();
      this.visit(ctx.extendedCaseAlternative(i));
    }
    if (ctx.ELSE()) {
      this.breakLine();
      this.visit(ctx.ELSE());
      this.visit(ctx.expression(1));
    }
    this.removeIndentation();
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
    this.breakLine();
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
    const n = ctx.functionArgument_list().length;
    for (let i = 0; i < n; i++) {
      // Don't put a space between the ( and the first argument
      if (i == 0 && !ctx.DISTINCT() && !ctx.ALL()) {
        this.avoidSpaceBetween();
      }
      this.visit(ctx.functionArgument(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
    }
    this.visit(ctx.RPAREN());
  };

  // Handled separately because we want ON CREATE before ON MATCH
  visitMergeClause = (ctx: MergeClauseContext) => {
    handleMergeClause(ctx, (node) => this.visit(node));
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
    this.startGroup();
    this.visit(ctx.LCURLY());
    this.avoidSpaceBetween();

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
    this.visit(ctx.RCURLY());
  };

  visitListLiteral = (ctx: ListLiteralContext) => {
    this.startGroup();
    this.visit(ctx.LBRACKET());
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
    this.visit(ctx.FOREACH())
    this.visit(ctx.LPAREN())
    this.visit(ctx.variable())
    this.visit(ctx.IN())
    this.visit(ctx.expression())
    if (ctx.BAR()) {
      this.visit(ctx.BAR())
      this.addIndentation()
      this.visit(ctx.clause(0))
      this.removeIndentation()
      this.breakLine()
      this.visit(ctx.RPAREN())
    } else {
      this.visit(ctx.RPAREN())
    }
  };

  visitExpression2 = (ctx: Expression2Context) => {
    this.visit(ctx.expression1())
    const n = ctx.postFix_list().length
    for (let i = 0; i < n; i++) {
      this.avoidSpaceBetween()
      this.visit(ctx.postFix(i))
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

const q = `MATCH (u:User)
MATCH (u)-[:USER_EVENT]->(e:Event)
WITH u, e ORDER BY e ASC
WITH u, collect(e) AS eventChain
FOREACH (i IN range(0, size(eventChain) - 2) |
FOREACH (node1 IN [eventChain [i]] |
FOREACH (node2 IN [eventChain [i + 1]] |
MERGE (node1)-[:NEXT_EVENT]->(node2))))`

console.log(formatQuery(q))