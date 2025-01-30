import {
  CharStreams,
  CommonTokenStream,
  ParserRuleContext,
  TerminalNode,
} from 'antlr4';
import {
  default as CypherCmdLexer,
  default as CypherLexer,
} from '../generated-parser/CypherCmdLexer';
import CypherCmdParser, {
  ArrowLineContext,
  BooleanLiteralContext,
  ClauseContext,
  CountStarContext,
  ExistsExpressionContext,
  KeywordLiteralContext,
  LabelExpressionContext,
  LeftArrowContext,
  MapContext,
  MergeActionContext,
  MergeClauseContext,
  NodePatternContext,
  NumberLiteralContext,
  PropertyContext,
  RelationshipPatternContext,
  RightArrowContext,
  StatementsOrCommandsContext,
  WhereClauseContext,
} from '../generated-parser/CypherCmdParser';
import CypherCmdParserVisitor from '../generated-parser/CypherCmdParserVisitor';
import {
  findTargetToken,
  isComment,
  wantsSpaceAfter,
  wantsSpaceBefore,
  wantsToBeUpperCase,
} from './formattingHelpers';

interface RawTerminalOptions {
  lowerCase?: boolean;
  upperCase?: boolean;
}

export class TreePrintVisitor extends CypherCmdParserVisitor<void> {
  buffer: string[] = [];
  indentation = 0;
  indentationSpaces = 2;
  targetToken?: number;
  cursorPos?: number;

  constructor(private tokenStream: CommonTokenStream) {
    super();
  }

  format = (root: StatementsOrCommandsContext) => {
    this.visit(root);
    return this.buffer.join('').trim();
  };

  breakLine = () => {
    if (
      this.buffer.length > 0 &&
      this.buffer[this.buffer.length - 1] !== '\n'
    ) {
      this.buffer.push('\n');
    }
  };

  addSpace = () => {
    if (this.buffer.at(-1) !== ' ') {
      this.buffer.push(' ');
    }
  };

  addIndentation = () => this.indentation++;

  removeIndentation = () => this.indentation--;

  applyIndentation = () => {
    for (let i = 0; i < this.indentation * this.indentationSpaces; i++) {
      this.buffer.push(' ');
    }
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
      this.buffer.push(commentToken.text.trim());
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
      if (
        this.buffer.length > 0 &&
        this.buffer[this.buffer.length - 1] !== ' ' &&
        this.buffer[this.buffer.length - 1] !== '\n'
      ) {
        this.addSpace();
      }
      this.buffer.push(commentToken.text.trim());
      this.breakLine();
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

  // Visit these separately because operators want spaces around them,
  // and these are not operators (despite being minuses).
  visitArrowLine = (ctx: ArrowLineContext) => {
    this.visitTerminalRaw(ctx.ARROW_LINE());
  };

  visitRightArrow = (ctx: RightArrowContext) => {
    this.visitTerminalRaw(ctx.GT());
  };

  visitLeftArrow = (ctx: LeftArrowContext) => {
    this.visitTerminalRaw(ctx.LT());
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
  };

  visitTerminal = (node: TerminalNode) => {
    if (this.buffer.length === 0) {
      this.addCommentsBefore(node);
    }
    if (
      this.buffer.length > 0 &&
      this.buffer[this.buffer.length - 1] === '\n'
    ) {
      this.applyIndentation();
    }

    if (
      this.buffer.length > 0 &&
      this.buffer[this.buffer.length - 1] !== '\n' &&
      this.buffer[this.buffer.length - 1] !== ' '
    ) {
      if (wantsSpaceBefore(node)) {
        this.addSpace();
      }
    }

    if (node.symbol.type === CypherCmdLexer.EOF) {
      return;
    }
    if (node.symbol.tokenIndex === this.targetToken) {
      this.cursorPos = this.buffer.join('').length;
    }
    if (wantsToBeUpperCase(node)) {
      this.buffer.push(node.getText().toUpperCase());
    } else {
      this.buffer.push(node.getText());
    }

    if (wantsSpaceAfter(node)) {
      this.addSpace();
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
    if (this.buffer.length === 0) {
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
      this.cursorPos = this.buffer.join('').length;
    }
    this.buffer.push(result);
    this.addCommentsAfter(node);
  };

  // Literals have casing rules, see
  // https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-casing
  visitBooleanLiteral = (ctx: BooleanLiteralContext) => {
    this.visitRawIfNotNull(ctx.TRUE(), { lowerCase: true });
    this.visitRawIfNotNull(ctx.FALSE(), { lowerCase: true });
  };

  visitKeywordLiteral = (ctx: KeywordLiteralContext) => {
    if (ctx.NULL()) {
      this.visitTerminalRaw(ctx.NULL(), { lowerCase: true });
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
    if (ctx.labelExpression() && ctx.properties()) {
      this.addSpace();
    }
    this.visitIfNotNull(ctx.properties());
    if (ctx.WHERE()) {
      this.visit(ctx.WHERE());
      this.visit(ctx.expression());
    }
  };

  visitNodePattern = (ctx: NodePatternContext) => {
    this.visit(ctx.LPAREN());
    this.handleInnerPatternContext(ctx);
    this.visit(ctx.RPAREN());
  };

  visitRelationshipPattern = (ctx: RelationshipPatternContext) => {
    this.visitIfNotNull(ctx.leftArrow());
    const arrowLineList = ctx.arrowLine_list();
    this.visitTerminalRaw(arrowLineList[0].MINUS());
    if (ctx.LBRACKET()) {
      this.visit(ctx.LBRACKET());
      this.handleInnerPatternContext(ctx);
      this.visit(ctx.RBRACKET());
    }
    this.visitTerminalRaw(arrowLineList[1].MINUS());
    this.visitIfNotNull(ctx.rightArrow());
  };

  // Handled separately because the dot is not an operator
  visitProperty = (ctx: PropertyContext) => {
    this.visitTerminalRaw(ctx.DOT());
    this.visit(ctx.propertyKeyName());
  };

  // Handled separately because where is not a clause (it is a subclause)
  visitWhereClause = (ctx: WhereClauseContext) => {
    this.breakLine();
    this.visitChildren(ctx);
  };

  // Handled separately because it contains subclauses (and thus indentation rules)
  visitExistsExpression = (ctx: ExistsExpressionContext) => {
    this.visit(ctx.EXISTS());
    this.visit(ctx.LCURLY());
    if (ctx.regularQuery()) {
      this.addIndentation();
      this.visit(ctx.regularQuery());
      this.breakLine();
      this.removeIndentation();
    } else {
      this.addSpace();
      this.visitIfNotNull(ctx.matchMode());
      this.visit(ctx.patternList());
      this.visitIfNotNull(ctx.whereClause());
      this.addSpace();
    }
    this.visit(ctx.RCURLY());
  };

  // Handled separately because we want ON CREATE before ON MATCH
  visitMergeClause = (ctx: MergeClauseContext) => {
    this.visit(ctx.MERGE());
    this.visit(ctx.pattern());
    const mergeActions = ctx
      .mergeAction_list()
      .map((action, index) => ({ action, index }))
      .sort((a, b) => {
        if (a.action.CREATE() && b.action.MATCH()) {
          return -1;
        } else if (a.action.MATCH() && b.action.CREATE()) {
          return 1;
        }
        return a.index - b.index;
      })
      .map(({ action }) => action);
    mergeActions.forEach((action) => {
      this.visit(action);
    });
  };

  // Handled separately because it wants indentation
  // https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-indentation-and-line-breaks
  visitMergeAction = (ctx: MergeActionContext) => {
    if (this.buffer.length > 0) {
      this.breakLine();
      this.addIndentation();
      this.applyIndentation();
    }
    this.visitChildren(ctx);
    this.removeIndentation();
  };

  // Map has its own formatting rules, see:
  // https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-spacing
  visitMap = (ctx: MapContext) => {
    this.visit(ctx.LCURLY());

    const propertyKeyNames = ctx.propertyKeyName_list();
    const expressions = ctx.expression_list();
    const commaList = ctx.COMMA_list();
    const colonList = ctx.COLON_list();
    for (let i = 0; i < expressions.length; i++) {
      this.visit(propertyKeyNames[i]);
      this.visitTerminalRaw(colonList[i]);
      this.addSpace();
      this.visit(expressions[i]);
      if (i < expressions.length - 1) {
        this.visit(commaList[i]);
      }
    }
    this.visit(ctx.RCURLY());
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
  const inputStream = CharStreams.fromString(query);
  const lexer = new CypherLexer(inputStream);
  const tokens = new CommonTokenStream(lexer);
  tokens.fill();
  const parser = new CypherCmdParser(tokens);
  parser.buildParseTrees = true;
  const tree = parser.statementsOrCommands();
  const visitor = new TreePrintVisitor(tokens);

  if (cursorPosition === undefined) return visitor.format(tree);

  if (cursorPosition >= query.length || cursorPosition === 0) {
    const result = visitor.format(tree);
    return {
      formattedString: result,
      newCursorPos: cursorPosition === 0 ? 0 : result.length,
    };
  }

  const targetToken = findTargetToken(tokens.tokens, cursorPosition);
  const relativePosition = cursorPosition - targetToken.start;
  visitor.targetToken = targetToken.tokenIndex;

  return {
    formattedString: visitor.format(tree),
    newCursorPos: visitor.cursorPos + relativePosition,
  };
}
