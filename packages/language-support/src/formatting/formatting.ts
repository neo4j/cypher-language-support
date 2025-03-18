import { CommonTokenStream, ParserRuleContext, TerminalNode } from 'antlr4';
import { default as CypherCmdLexer } from '../generated-parser/CypherCmdLexer';
import {
  ArrowLineContext,
  BooleanLiteralContext,
  CallClauseContext,
  CaseAlternativeContext,
  CaseExpressionContext,
  ClauseContext,
  CollectExpressionContext,
  CommandContext,
  CommandNodePatternContext,
  CommandOptionsContext,
  CommandRelPatternContext,
  ConstraintIsNotNullContext,
  ConstraintIsUniqueContext,
  ConstraintKeyContext,
  ConstraintTypedContext,
  CountExpressionContext,
  CountStarContext,
  CreateClauseContext,
  CreateCommandContext,
  CreateConstraintContext,
  CreateFulltextIndexContext,
  CreateIndex_Context,
  DeleteClauseContext,
  ExistsExpressionContext,
  Expression10Context,
  Expression2Context,
  ExpressionContext,
  ExtendedCaseAlternativeContext,
  ExtendedCaseExpressionContext,
  ForeachClauseContext,
  FulltextNodePatternContext,
  FunctionInvocationContext,
  InsertClauseContext,
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
  NormalizeFunctionContext,
  NumberLiteralContext,
  ParameterContext,
  ParenthesizedExpressionContext,
  ParenthesizedPathContext,
  PathLengthContext,
  PatternContext,
  PatternListContext,
  ProcedureNameContext,
  PropertyContext,
  QuantifierContext,
  ReduceExpressionContext,
  RegularQueryContext,
  RelationshipPatternContext,
  RelTypeContext,
  ReturnBodyContext,
  ReturnClauseContext,
  ReturnItemContext,
  ReturnItemsContext,
  SetClauseContext,
  ShowCommandYieldContext,
  StatementsOrCommandsContext,
  SubqueryClauseContext,
  TrimFunctionContext,
  UnwindClauseContext,
  UseClauseContext,
  WhereClauseContext,
  WithClauseContext,
} from '../generated-parser/CypherCmdParser';
import CypherCmdParserVisitor from '../generated-parser/CypherCmdParserVisitor';
import {
  AlignIndentationOptions,
  Chunk,
  CommentChunk,
  findTargetToken,
  getParseTreeAndTokens,
  initialIndentation,
  isComment,
  RegularChunk,
  wantsToBeConcatenated,
  wantsToBeUpperCase,
} from './formattingHelpers';
import { buffersToFormattedString } from './formattingSolutionSearch';

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
  groupID = 0;
  groupStack: number[] = [];
  startGroupCounter = 0;
  groupsToEndOnBreak: number[] = [];

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

  lastInCurrentBuffer = () => this.currentBuffer().at(-1);

  breakLine = () => {
    // This is a workaround because group does not translate between chunk lists
    if (this.groupsToEndOnBreak.length > 0) {
      this.endGroup(this.groupsToEndOnBreak.pop());
    }
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
      doubleBreak: suffix.doubleBreak,
      groupsStarting: prefix.groupsStarting + suffix.groupsStarting,
      groupsEnding: prefix.groupsEnding + suffix.groupsEnding,
      indentation: {
        base: prefix.indentation.base + suffix.indentation.base,
        special: prefix.indentation.special + suffix.indentation.special,
        align: prefix.indentation.align,
      },
      ...(hasCursor && { isCursor: true }),
    };
    this.currentBuffer()[indices[1]] = chunk;
  };

  /**
   * Sets a property on a chunk to control e.g. splitting behavior.
   * Skips any preceding comments or special chunks we did not expect.
   */
  setChunkProperty = (
    propertyName: 'noSpace' | 'noBreak' | 'mustBreak',
  ): void => {
    let idx = this.currentBuffer().length - 1;

    while (idx >= 0 && this.currentBuffer()[idx].type === 'COMMENT') {
      idx--;
    }
    // After a comment we always hardBreak, so if the loop finds a comment
    // we should not also set mustBreak, it will cause breaking twice
    if (
      propertyName === 'mustBreak' &&
      this.currentBuffer().length - 1 !== idx
    ) {
      return;
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
    this.setChunkProperty('noSpace');
  };

  avoidBreakBetween = (): void => {
    this.setChunkProperty('noBreak');
  };

  mustBreakBetween = () => {
    this.setChunkProperty('mustBreak');
  };

  doubleBreakBetween = (): void => {
    if (this.currentBuffer().length > 0) {
      this.lastInCurrentBuffer().doubleBreak = true;
    }
  };

  doubleBreakBetweenNonComment = (): void => {
    if (
      this.currentBuffer().length > 0 &&
      this.lastInCurrentBuffer().type !== 'COMMENT'
    ) {
      this.lastInCurrentBuffer().doubleBreak = true;
    }
  };

  getFirstNonCommentIdx = (): number => {
    let idx = this.currentBuffer().length - 1;
    while (idx >= 0 && this.currentBuffer()[idx].type === 'COMMENT') {
      idx--;
    }
    return idx;
  };

  endGroup = (id: number) => {
    if (this.groupStack.at(-1) !== id) {
      return;
    }
    const idx = this.getFirstNonCommentIdx();
    this.currentBuffer().at(idx).groupsEnding += 1;
    this.groupStack.pop();
  };

  removeAllGroups = () => {
    for (let i = 0; i < this.lastInCurrentBuffer().groupsStarting; i++) {
      this.groupStack.pop();
    }
  };

  endAllExceptBaseGroup = () => {
    while (this.groupStack.length > 1) {
      this.endGroup(this.groupStack.at(-1));
    }
  };

  startGroup = (): number => {
    this.startGroupCounter += 1;
    this.groupStack.push(this.groupID);
    this.groupID++;
    return this.groupID - 1;
  };

  startGroupAlsoOnComment = (): number => {
    if (this.lastInCurrentBuffer().type === 'COMMENT') {
      const idx = this.getFirstNonCommentIdx();
      this.currentBuffer().at(idx + 1).groupsStarting = 1;
      this.groupStack.push(this.groupID);
      this.groupID++;
      return this.groupID - 1;
    }
    return this.startGroup();
  };

  setIndentationProperty = (
    modifier: 'add' | 'remove',
    type: 'base' | 'special' | 'align',
  ) => {
    const chunk = this.lastInCurrentBuffer();
    if (
      type === 'align' &&
      chunk.indentation[type] !== AlignIndentationOptions.Maintain
    ) {
      throw new Error(
        'Internal formatting error: Chunk should not get its alignIndentation set twice',
      );
    }
    if (modifier === 'add') {
      chunk.indentation[type] += 1;
    } else if (modifier === 'remove') {
      chunk.indentation[type] -= 1;
    }
  };

  addBaseIndentation = () => {
    this.setIndentationProperty('add', 'base');
  };

  removeBaseIndentation = () => {
    this.setIndentationProperty('remove', 'base');
  };

  addSpecialIndentation = () => {
    this.setIndentationProperty('add', 'special');
  };

  removeSpecialIndentation = () => {
    this.setIndentationProperty('remove', 'special');
  };

  addAlignIndentation = () => {
    this.setIndentationProperty('add', 'align');
  };

  removeAlignIndentation = () => {
    this.setIndentationProperty('remove', 'align');
  };

  getBottomChild = (
    ctx: ParserRuleContext | TerminalNode,
    side: 'before' | 'after',
  ): TerminalNode => {
    if (ctx instanceof TerminalNode) {
      return ctx;
    }
    const idx = side === 'before' ? 0 : ctx.getChildCount() - 1;
    const child = ctx.getChild(idx);
    if (child instanceof TerminalNode) {
      return child;
    } else if (child instanceof ParserRuleContext) {
      return this.getBottomChild(child, side);
    }
    throw new Error('Internal formatting error in findBottomChild');
  };

  preserveExplicitNewlineAfter = (ctx: ParserRuleContext | TerminalNode) => {
    this.preserveExplicitNewline(ctx, 'after');
  };

  preserveExplicitNewlineBefore = (ctx: ParserRuleContext | TerminalNode) => {
    this.preserveExplicitNewline(ctx, 'before');
  };

  preserveExplicitNewline = (
    ctx: ParserRuleContext | TerminalNode,
    side: 'before' | 'after',
  ) => {
    const bottomChild = this.getBottomChild(ctx, side);
    const token = bottomChild.symbol;
    const hiddenTokens =
      side === 'before'
        ? this.tokenStream.getHiddenTokensToLeft(token.tokenIndex)
        : this.tokenStream.getHiddenTokensToRight(token.tokenIndex);
    const hiddenNewlines = hiddenTokens?.filter(
      (token) => token.text === '\n',
    ).length;
    const commentCount = hiddenTokens?.filter((token) =>
      isComment(token),
    ).length;
    // If there are comments, they take responsibility of the explicit newlines.
    if (hiddenNewlines > 1 && commentCount === 0) {
      this.doubleBreakBetweenNonComment();
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
      const text = commentToken.text.trim();
      const chunk: CommentChunk = {
        type: 'COMMENT',
        breakBefore: false,
        text,
        groupsStarting: this.startGroupCounter,
        groupsEnding: 0,
        indentation: { ...initialIndentation },
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
    const nodeLine = node.symbol.line;
    let breakCount = 0;
    let includesComment = false;
    for (const hiddenToken of hiddenTokens || []) {
      if (hiddenToken.text === '\n') {
        breakCount++;
      }
      if (!isComment(hiddenToken)) {
        continue;
      }
      if (breakCount > 1) {
        this.doubleBreakBetween();
      }
      breakCount = 0;
      const commentToken = hiddenToken;
      includesComment = true;
      const text = commentToken.text.trim();
      const commentLine = commentToken.line;
      const chunk: CommentChunk = {
        type: 'COMMENT',
        breakBefore: nodeLine !== commentLine,
        text,
        groupsStarting: 0,
        groupsEnding: 0,
        indentation: { ...initialIndentation },
      };
      // If we have a "hard-break" comment, i.e. one that has a newline before it,
      // we end all currently active groups. Otherwise, that comment becomes part of the group,
      // which makes it very hard for the search to find a good solution.
      if (nodeLine !== commentLine) {
        this.endAllExceptBaseGroup();
      }
      this.currentBuffer().push(chunk);
    }
    // Account for the last comment having multiple newline after it, to remember explicit
    // newlines when we have e.g. [C, \n, \n]
    if (breakCount > 1 && includesComment) {
      this.doubleBreakBetween();
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

  visitStatementsOrCommands = (ctx: StatementsOrCommandsContext) => {
    const n = ctx.statementOrCommand_list().length;
    for (let i = 0; i < n; i++) {
      this.visit(ctx.statementOrCommand(i));
      if (i < n - 1 || ctx.SEMICOLON(i)) {
        if (this.lastInCurrentBuffer().text === '\n') {
          this.currentBuffer().pop();
        }
        this.visit(ctx.SEMICOLON(i));
        this.preserveExplicitNewlineAfter(ctx.SEMICOLON(i));
      }
    }
  };

  visitCommand = (ctx: CommandContext) => {
    this.breakLine();
    this.visitChildren(ctx);
    this.preserveExplicitNewlineAfter(ctx);
  };

  _visitCommandIfNotExists = (
    ctx:
      | CreateConstraintContext
      | CreateIndex_Context
      | CreateFulltextIndexContext,
  ) => {
    if (ctx.IF()) {
      this.avoidBreakBetween();
      this.visit(ctx.IF());
      this.avoidBreakBetween();
      this.visit(ctx.NOT());
      this.avoidBreakBetween();
      this.visit(ctx.EXISTS());
    }
  };

  visitShowCommandYield = (ctx: ShowCommandYieldContext) => {
    if (ctx.yieldClause()) {
      this.breakLine();
      this.visit(ctx.yieldClause());
      if (ctx.returnClause()) {
        this.breakLine();
        this.visit(ctx.returnClause());
      }
    } else {
      this.visit(ctx.whereClause());
    }
  };

  visitCreateCommand = (ctx: CreateCommandContext) => {
    this.visit(ctx.CREATE());
    this.avoidBreakBetween();
    if (ctx.OR()) {
      this.visit(ctx.OR());
      this.avoidBreakBetween();
      this.visit(ctx.REPLACE());
      this.avoidBreakBetween();
    }
    this.visitIfNotNull(ctx.createCompositeDatabase());
    this.visitIfNotNull(ctx.createConstraint());
    this.visitIfNotNull(ctx.createDatabase());
    this.visitIfNotNull(ctx.createIndex());
    this.visitIfNotNull(ctx.createRole());
    this.visitIfNotNull(ctx.createUser());
  };

  visitCreateConstraint = (ctx: CreateConstraintContext) => {
    this.visit(ctx.CONSTRAINT());
    this.avoidBreakBetween();
    this.visitIfNotNull(ctx.symbolicNameOrStringParameter());
    this._visitCommandIfNotExists(ctx);
    this.breakLine();
    this.visit(ctx.FOR());
    this.avoidBreakBetween();
    this.visitIfNotNull(ctx.commandNodePattern());
    this.visitIfNotNull(ctx.commandRelPattern());
    this.visit(ctx.constraintType());
    this.visitIfNotNull(ctx.commandOptions());
  };

  visitConstraintTyped = (ctx: ConstraintTypedContext) => {
    this.breakLine();
    this.visitChildren(ctx);
  };

  visitConstraintIsUnique = (ctx: ConstraintIsUniqueContext) => {
    this.breakLine();
    this.visitChildren(ctx);
  };

  visitConstraintKey = (ctx: ConstraintKeyContext) => {
    this.breakLine();
    this.visitChildren(ctx);
  };
  visitConstraintIsNotNull = (ctx: ConstraintIsNotNullContext) => {
    this.breakLine();
    this.visitChildren(ctx);
  };

  visitCreateIndex_ = (ctx: CreateIndex_Context) => {
    this.visitIfNotNull(ctx.symbolicNameOrStringParameter());
    this._visitCommandIfNotExists(ctx);
    this.breakLine();
    this.visit(ctx.FOR());
    this.visitIfNotNull(ctx.commandNodePattern());
    this.visitIfNotNull(ctx.commandRelPattern());
    this.breakLine();
    this.visit(ctx.ON());
    this.visit(ctx.propertyList());
    this.visitIfNotNull(ctx.commandOptions());
  };

  visitCreateFulltextIndex = (ctx: CreateFulltextIndexContext) => {
    this.visitIfNotNull(ctx.symbolicNameOrStringParameter());
    this._visitCommandIfNotExists(ctx);
    this.breakLine();
    this.visit(ctx.FOR());
    this.visitIfNotNull(ctx.fulltextNodePattern());
    this.visitIfNotNull(ctx.fulltextRelPattern());
    this.breakLine();
    this.visit(ctx.ON());
    this.visit(ctx.EACH());
    this.avoidBreakBetween();
    this.visit(ctx.LBRACKET());
    this.visit(ctx.enclosedPropertyList());
    this.visit(ctx.RBRACKET());
    this.visitIfNotNull(ctx.commandOptions());
  };

  visitCommandOptions = (ctx: CommandOptionsContext) => {
    this.breakLine();
    this.visit(ctx.OPTIONS());
    this.avoidBreakBetween();
    this.visit(ctx.mapOrParameter());
  };

  visitFulltextNodePattern = (ctx: FulltextNodePatternContext) => {
    this.visit(ctx.LPAREN());
    this.visit(ctx.variable());
    this.avoidSpaceBetween();
    this.visit(ctx.COLON());
    this.avoidSpaceBetween();
    const n = ctx.symbolicNameString_list().length;
    for (let i = 0; i < n; i++) {
      this.visit(ctx.symbolicNameString(i));
      if (i < n - 1) {
        this.avoidSpaceBetween();
        this.visit(ctx.BAR(i));
        this.avoidSpaceBetween();
      }
    }
    this.visit(ctx.RPAREN());
  };

  visitCommandNodePattern = (ctx: CommandNodePatternContext) => {
    this.visit(ctx.LPAREN());
    this.visit(ctx.variable());
    this.concatenate();
    this.visit(ctx.labelType());
    this.concatenate();
    this.visit(ctx.RPAREN());
  };

  visitCommandRelPattern = (ctx: CommandRelPatternContext) => {
    this.visit(ctx.LPAREN(0));
    this.visit(ctx.RPAREN(0));
    if (ctx.leftArrow()) {
      this.visit(ctx.leftArrow());
      this.concatenate();
    }
    this.visit(ctx.arrowLine(0));
    this.concatenate();
    this.avoidSpaceBetween();
    this.visit(ctx.LBRACKET());
    this.avoidSpaceBetween();
    this.avoidBreakBetween();
    this.visit(ctx.variable());
    this.avoidSpaceBetween();
    this.visit(ctx.relType());
    this.visit(ctx.RBRACKET());
    this.visit(ctx.arrowLine(1));
    this.concatenate();
    if (ctx.rightArrow()) {
      this.visit(ctx.rightArrow());
      this.concatenate();
    }
    this.avoidSpaceBetween();
    this.visit(ctx.LPAREN(1));
    this.visit(ctx.RPAREN(1));
  };

  visitRelType = (ctx: RelTypeContext) => {
    this.visit(ctx.COLON());
    this.avoidSpaceBetween();
    this.visit(ctx.symbolicNameString());
  };

  // Handled separately because clauses should start on new lines, see
  // https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-indentation-and-line-breaks
  visitClause = (ctx: ClauseContext) => {
    this.breakLine();
    this.visitChildren(ctx);
    this.preserveExplicitNewlineAfter(ctx);
  };

  visitUseClause = (ctx: UseClauseContext) => {
    this.visit(ctx.USE());
    const useGrp = this.startGroupAlsoOnComment();
    this.visitIfNotNull(ctx.GRAPH());
    this.visit(ctx.graphReference());
    this.endGroup(useGrp);
  };

  visitWithClause = (ctx: WithClauseContext) => {
    this.visit(ctx.WITH());
    this.avoidBreakBetween();
    const withClauseGrp = this.startGroupAlsoOnComment();
    this.visit(ctx.returnBody());
    this.visitIfNotNull(ctx.whereClause());
    this.endGroup(withClauseGrp);
  };

  visitMatchClause = (ctx: MatchClauseContext) => {
    this.visitIfNotNull(ctx.OPTIONAL());
    this.visit(ctx.MATCH());
    this.avoidBreakBetween();
    const matchClauseGrp = this.startGroupAlsoOnComment();
    this.visitIfNotNull(ctx.matchMode());
    this.visit(ctx.patternList());
    this.endGroup(matchClauseGrp);
    const n = ctx.hint_list().length;
    for (let i = 0; i < n; i++) {
      this.visit(ctx.hint(i));
    }
    this.visitIfNotNull(ctx.whereClause());
  };

  visitCreateClause = (ctx: CreateClauseContext) => {
    this.visit(ctx.CREATE());
    this.avoidBreakBetween();
    const createClauseGrp = this.startGroupAlsoOnComment();
    this.visit(ctx.patternList());
    this.endGroup(createClauseGrp);
  };

  visitInsertClause = (ctx: InsertClauseContext) => {
    this.visit(ctx.INSERT());
    this.avoidBreakBetween();
    const insertClauseGrp = this.startGroupAlsoOnComment();
    this.visit(ctx.insertPatternList());
    this.endGroup(insertClauseGrp);
  };

  visitDeleteClause = (ctx: DeleteClauseContext) => {
    if (ctx.DETACH() || ctx.NODETACH()) {
      this.visitIfNotNull(ctx.DETACH());
      this.visitIfNotNull(ctx.NODETACH());
      this.avoidBreakBetween();
    }
    this.visit(ctx.DELETE());
    const deleteClauseGrp = this.startGroupAlsoOnComment();
    const n = ctx.expression_list().length;
    for (let i = 0; i < n; i++) {
      this.visit(ctx.expression(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
    }
    this.endGroup(deleteClauseGrp);
  };

  visitReturnClause = (ctx: ReturnClauseContext) => {
    this.visit(ctx.RETURN());
    this.avoidBreakBetween();
    this.visit(ctx.returnBody());
  };

  visitReturnBody = (ctx: ReturnBodyContext) => {
    this.visitIfNotNull(ctx.DISTINCT());
    this.avoidBreakBetween();
    const returnItemsGrp = this.startGroup();
    this.visit(ctx.returnItems());
    if (ctx.orderBy() || ctx.skip()) {
      const orderSkipGrp = this.startGroup();
      this.visitIfNotNull(ctx.orderBy());
      this.visitIfNotNull(ctx.skip());
      this.endGroup(orderSkipGrp);
    }
    this.endGroup(returnItemsGrp);
    this.visitIfNotNull(ctx.limit());
  };

  visitUnwindClause = (ctx: UnwindClauseContext) => {
    this.visit(ctx.UNWIND());
    this.avoidBreakBetween();
    const unwindClauseGrp = this.startGroupAlsoOnComment();
    this.visit(ctx.expression());
    const asGrp = this.startGroup();
    this.visit(ctx.AS());
    this.visit(ctx.variable());
    this.endGroup(asGrp);
    this.endGroup(unwindClauseGrp);
  };

  visitLimit = (ctx: LimitContext) => {
    this.preserveExplicitNewlineBefore(ctx);
    this.breakLine();
    this.visitChildren(ctx);
  };

  visitReturnItem = (ctx: ReturnItemContext) => {
    this.visit(ctx.expression());
    if (ctx.AS() || ctx.variable()) {
      const asGrp = this.startGroup();
      this.visitIfNotNull(ctx.AS());
      this.visitIfNotNull(ctx.variable());
      this.endGroup(asGrp);
    }
  };

  visitReturnItems = (ctx: ReturnItemsContext) => {
    if (ctx.TIMES()) {
      this.visit(ctx.TIMES());
    }
    const n = ctx.returnItem_list().length;
    let commaIdx = 0;
    if (ctx.TIMES() && n > 0) {
      this.visit(ctx.COMMA(commaIdx));
      commaIdx++;
    }
    for (let i = 0; i < n; i++) {
      const returnItemGrp = this.startGroup();
      this.visit(ctx.returnItem(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(commaIdx));
        commaIdx++;
      }
      this.endGroup(returnItemGrp);
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
    this.visitTerminalRaw(ctx.REDUCE());
    this.visit(ctx.LPAREN());
    const reduceExprGrp = this.startGroup();
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
    this.endGroup(reduceExprGrp);
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
      this.visit(ctx.IS());
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
      indentation: { ...initialIndentation },
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
      indentation: { ...initialIndentation },
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
    if (ctx instanceof RelationshipPatternContext && ctx.pathLength()) {
      this.visit(ctx.pathLength());
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

  visitParenthesizedPath = (ctx: ParenthesizedPathContext) => {
    this.visit(ctx.LPAREN());
    this.avoidBreakBetween();
    const parenthesizedPathGrp = this.startGroup();
    this.visit(ctx.pattern());
    if (ctx.WHERE()) {
      this.visit(ctx.WHERE());
      this.visit(ctx.expression());
    }
    this.endGroup(parenthesizedPathGrp);
    this.visit(ctx.RPAREN());
    this.visitIfNotNull(ctx.quantifier());
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
    // Concatenations are to ensure the (left) arrow remains
    // on the previous line (styleguide rule) if we need to break within the pattern
    this.visit(arrowLineList[0]);
    this.concatenate();
    this.avoidSpaceBetween();
    if (ctx.leftArrow()) {
      this.concatenate();
      this.avoidSpaceBetween();
    }
    if (ctx.LBRACKET()) {
      const bracketPatternGrp = this.startGroup();
      this.visit(ctx.LBRACKET());
      this.handleInnerPatternContext(ctx);
      this.visit(ctx.RBRACKET());
      this.endGroup(bracketPatternGrp);
    }
    // Same idea with concatenation as above
    this.avoidSpaceBetween();
    this.visit(arrowLineList[1]);
    this.concatenate();
    if (ctx.rightArrow()) {
      this.visit(ctx.rightArrow());
      this.concatenate();
    }
    this.avoidSpaceBetween();
  };

  visitNodePattern = (ctx: NodePatternContext) => {
    this.visit(ctx.LPAREN());
    this.avoidBreakBetween();
    const nodePatternGrp = this.startGroup();
    if (ctx.variable() || ctx.labelExpression() || ctx.properties()) {
      this.visitIfNotNull(ctx.variable());
      this.visitIfNotNull(ctx.labelExpression());
      this.visitIfNotNull(ctx.properties());
      if (ctx.WHERE()) {
        this.visit(ctx.WHERE());
        this.visit(ctx.expression());
      }
    } else {
      this.visitIfNotNull(ctx.WHERE());
      this.visitIfNotNull(ctx.expression());
    }
    this.endGroup(nodePatternGrp);
    this.visit(ctx.RPAREN());
  };

  visitPattern = (ctx: PatternContext) => {
    // Don't create an unnecessary group if we don't also have a path
    if (!ctx.variable() && !ctx.selector()) {
      this.visitChildren(ctx);
      return;
    }
    if (ctx.variable()) {
      this.visit(ctx.variable());
      this.avoidBreakBetween();
      this.visit(ctx.EQ());
      this.avoidBreakBetween();
    }
    const selectorAnonymousPatternGrp = this.startGroup();
    if (ctx.selector()) {
      const selectorGroup = this.startGroup();
      this.visitIfNotNull(ctx.selector());
      this.endGroup(selectorGroup);
    }
    const anonymousPatternGrp = this.startGroup();
    this.visit(ctx.anonymousPattern());
    this.endGroup(anonymousPatternGrp);
    this.endGroup(selectorAnonymousPatternGrp);
  };

  visitPatternList = (ctx: PatternListContext) => {
    const n = ctx.pattern_list().length;
    if (n === 1) {
      this.visitChildren(ctx);
      return;
    }
    for (let i = 0; i < n; i++) {
      const patternListItemGrp = this.startGroup();
      this.visit(ctx.pattern(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
      this.endGroup(patternListItemGrp);
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
    if (!ctx._from_ && !ctx._to) {
      this.visitChildren(ctx);
      this.concatenate();
      this.concatenate();
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
    this.preserveExplicitNewlineBefore(ctx);
    this.breakLine();
    this.visit(ctx.WHERE());
    this.avoidBreakBetween();
    const whereClauseGrp = this.startGroup();
    this.visit(ctx.expression());
    this.endGroup(whereClauseGrp);
  };

  visitParenthesizedExpression = (ctx: ParenthesizedExpressionContext) => {
    this.visit(ctx.LPAREN());
    this.avoidBreakBetween();
    const parenthesizedExprGrp = this.startGroup();
    this.visit(ctx.expression());
    this.endGroup(parenthesizedExprGrp);
    this.visit(ctx.RPAREN());
  };

  visitExpression = (ctx: ExpressionContext) => {
    const n = ctx.expression11_list().length;
    if (n === 1) {
      this.visit(ctx.expression11(0));
      return;
    }
    for (let i = 0; i < n; i++) {
      const orExprGrp = this.startGroup();
      this.visit(ctx.expression11(i));
      if (i < n - 1) {
        this.visit(ctx.OR(i));
      }
      this.endGroup(orExprGrp);
    }
  };

  visitExpression10 = (ctx: Expression10Context) => {
    const n = ctx.expression9_list().length;
    if (n === 1) {
      this.visit(ctx.expression9(0));
      return;
    }
    for (let i = 0; i < n; i++) {
      const andExprGrp = this.startGroup();
      this.visit(ctx.expression9(i));
      if (i < n - 1) {
        this.visit(ctx.AND(i));
      }
      this.endGroup(andExprGrp);
    }
  };

  // Handled separately because it contains subclauses (and thus indentation rules)
  visitExistsExpression = (ctx: ExistsExpressionContext) => {
    this.visit(ctx.EXISTS());
    this.avoidBreakBetween();
    this.visit(ctx.LCURLY());

    if (ctx.regularQuery()) {
      this.addAlignIndentation();
      this.visit(ctx.regularQuery());
      this.breakLine();
      this.mustBreakBetween();
      // This is a workaround because group does not translate between chunk lists
      const endOfExistGroup = this.startGroup();
      this.visit(ctx.RCURLY());
      this.removeAlignIndentation();
      this.groupsToEndOnBreak.push(endOfExistGroup);
    } else {
      this.visitIfNotNull(ctx.matchMode());
      this.visit(ctx.patternList());
      this.visitIfNotNull(ctx.whereClause());
      this.visit(ctx.RCURLY());
    }
  };

  visitCollectExpression = (ctx: CollectExpressionContext) => {
    this.visit(ctx.COLLECT());
    this.avoidBreakBetween();
    this.visit(ctx.LCURLY());
    this.addAlignIndentation();
    this.visit(ctx.regularQuery());
    this.breakLine();
    // This is a workaround because group does not translate between chunk lists
    const endOfCollectGroup = this.startGroup();
    this.visit(ctx.RCURLY());
    this.removeAlignIndentation();
    this.groupsToEndOnBreak.push(endOfCollectGroup);
  };

  visitCountExpression = (ctx: CountExpressionContext) => {
    this.visit(ctx.COUNT());
    this.avoidBreakBetween();
    this.visit(ctx.LCURLY());

    if (ctx.regularQuery()) {
      this.addAlignIndentation();
      this.visit(ctx.regularQuery());
      this.breakLine();
      this.mustBreakBetween();
      // This is a workaround because group does not translate between chunk lists
      const endOfCountGroup = this.startGroup();
      this.visit(ctx.RCURLY());
      this.removeAlignIndentation();
      this.groupsToEndOnBreak.push(endOfCountGroup);
    } else {
      this.visitIfNotNull(ctx.matchMode());
      this.visit(ctx.patternList());
      this.visitIfNotNull(ctx.whereClause());
      this.visit(ctx.RCURLY());
    }
  };

  visitCaseAlternative = (ctx: CaseAlternativeContext) => {
    this.visit(ctx.WHEN());
    this.avoidBreakBetween();
    const caseAlternativeGrp = this.startGroup();
    this.visit(ctx.expression(0));
    this.visit(ctx.THEN());
    this.visit(ctx.expression(1));
    this.endGroup(caseAlternativeGrp);
  };

  // Handled separately since cases want newlines
  visitCaseExpression = (ctx: CaseExpressionContext) => {
    this.endAllExceptBaseGroup();
    this.addSpecialIndentation();
    this.mustBreakBetween();
    this.visit(ctx.CASE());
    this.removeAllGroups();
    this.lastInCurrentBuffer().groupsStarting = 0;
    const caseGroup = this.startGroup();
    const n = ctx.caseAlternative_list().length;
    this.addSpecialIndentation();
    for (let i = 0; i < n; i++) {
      this.mustBreakBetween();
      this.visit(ctx.caseAlternative(i));
    }
    if (ctx.ELSE()) {
      this.mustBreakBetween();
      this.visit(ctx.ELSE());
      this.visit(ctx.expression());
    }
    this.endGroup(caseGroup);
    this.removeSpecialIndentation();
    this.mustBreakBetween();
    this.visit(ctx.END());
    this.removeSpecialIndentation();
  };

  visitExtendedCaseAlternative = (ctx: ExtendedCaseAlternativeContext) => {
    this.visit(ctx.WHEN());
    this.avoidBreakBetween();
    const extendedCaseAlterniveGroup = this.startGroup();
    const n = ctx.extendedWhen_list().length;
    for (let i = 0; i < n; i++) {
      this.visit(ctx.extendedWhen(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
    }
    this.visit(ctx.THEN());
    this.visit(ctx.expression());
    this.endGroup(extendedCaseAlterniveGroup);
  };

  visitExtendedCaseExpression = (ctx: ExtendedCaseExpressionContext) => {
    this.endAllExceptBaseGroup();
    this.addSpecialIndentation();
    this.mustBreakBetween();
    this.visit(ctx.CASE());
    this.removeAllGroups();
    this.avoidBreakBetween();
    this.lastInCurrentBuffer().groupsStarting = 0;
    this.visit(ctx.expression(0));
    const extendedCaseGrp = this.startGroup();
    this.mustBreakBetween();
    const n = ctx.extendedCaseAlternative_list().length;
    this.addSpecialIndentation();
    for (let i = 0; i < n; i++) {
      this.mustBreakBetween();
      this.visit(ctx.extendedCaseAlternative(i));
    }
    if (ctx.ELSE()) {
      this.mustBreakBetween();
      this.visit(ctx.ELSE());
      this.visit(ctx.expression(1));
    }
    this.endGroup(extendedCaseGrp);
    this.removeSpecialIndentation();
    this.mustBreakBetween();
    this.visit(ctx.END());
    this.removeSpecialIndentation();
  };

  // Handled separately because it wants indentation and line breaks
  visitSubqueryClause = (ctx: SubqueryClauseContext) => {
    this.visitIfNotNull(ctx.OPTIONAL());
    this.visit(ctx.CALL());
    this.visitIfNotNull(ctx.subqueryScope());
    this.visit(ctx.LCURLY());
    this.addBaseIndentation();
    this.breakLine();
    this.visit(ctx.regularQuery());
    this.removeBaseIndentation();
    this.breakLine();
    this.visit(ctx.RCURLY());
    this.visitIfNotNull(ctx.subqueryInTransactionsParameters());
  };

  // Handled separately because UNION wants to look a certain way
  visitRegularQuery = (ctx: RegularQueryContext) => {
    this.visit(ctx.singleQuery(0));
    const n = ctx.singleQuery_list().length - 1;
    for (let i = 0; i < n; i++) {
      this.addBaseIndentation();
      this.breakLine();
      this.visit(ctx.UNION(i));
      this.removeBaseIndentation();
      if (ctx.ALL(i)) {
        this.visit(ctx.ALL(i));
      } else if (ctx.DISTINCT(i)) {
        this.visit(ctx.DISTINCT(i));
      }
      this.breakLine();
      this.visit(ctx.singleQuery(i + 1));
    }
  };

  visitNormalizeFunction = (ctx: NormalizeFunctionContext) => {
    this.visitTerminalRaw(ctx.NORMALIZE());
    this.avoidSpaceBetween();
    this.avoidBreakBetween();
    this.visit(ctx.LPAREN());
    const normalizeGrp = this.startGroup();
    this.avoidBreakBetween();
    this.avoidSpaceBetween();
    this.visit(ctx.expression());
    if (ctx.COMMA()) {
      this.visit(ctx.COMMA());
      this.visit(ctx.normalForm());
    }
    this.visit(ctx.RPAREN());
    this.endGroup(normalizeGrp);
  };

  visitTrimFunction = (ctx: TrimFunctionContext) => {
    this.visitTerminalRaw(ctx.TRIM());
    this.avoidSpaceBetween();
    this.avoidBreakBetween();
    this.visit(ctx.LPAREN());
    this.avoidBreakBetween();
    const trimGrp = this.startGroup();
    this.visitIfNotNull(ctx.BOTH());
    this.visitIfNotNull(ctx.LEADING());
    this.visitIfNotNull(ctx.TRAILING());
    this.visitIfNotNull(ctx._trimCharacterString);
    this.visitIfNotNull(ctx.FROM());
    this.visit(ctx._trimSource);
    this.visit(ctx.RPAREN());
    this.endGroup(trimGrp);
  };

  visitFunctionInvocation = (ctx: FunctionInvocationContext) => {
    const functionNameGrp = this.startGroup();
    this.visit(ctx.functionName());
    this.endGroup(functionNameGrp);
    this.avoidSpaceBetween();
    this.avoidBreakBetween();
    this.visit(ctx.LPAREN());
    this.avoidBreakBetween();
    const invocationGrp = this.startGroup();
    if (ctx.DISTINCT() || ctx.ALL()) {
      this.avoidSpaceBetween();
    }
    this.visitIfNotNull(ctx.ALL());
    this.visitIfNotNull(ctx.DISTINCT());
    const allFunctionArgsGrp = this.startGroup();
    const n = ctx.functionArgument_list().length;
    for (let i = 0; i < n; i++) {
      // Don't put a space between the ( and the first argument
      if (i == 0 && !ctx.DISTINCT() && !ctx.ALL()) {
        this.avoidSpaceBetween();
      }
      const functionArgGrp = this.startGroup();
      this.visit(ctx.functionArgument(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
      this.endGroup(functionArgGrp);
    }
    this.visit(ctx.RPAREN());
    this.endGroup(allFunctionArgsGrp);
    this.endGroup(invocationGrp);
  };

  visitMergeClause = (ctx: MergeClauseContext) => {
    this.visit(ctx.MERGE());
    this.avoidBreakBetween();
    const patternGrp = this.startGroupAlsoOnComment();
    this.visit(ctx.pattern());
    this.endGroup(patternGrp);
    const n = ctx.mergeAction_list().length;
    for (let i = 0; i < n; i++) {
      this.visit(ctx.mergeAction(i));
    }
  };

  // Handled separately because it wants indentation
  // https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-indentation-and-line-breaks
  visitMergeAction = (ctx: MergeActionContext) => {
    this.addBaseIndentation();
    this.breakLine();
    this.visitChildren(ctx);
    this.removeBaseIndentation();
  };

  visitSetClause = (ctx: SetClauseContext) => {
    this.visit(ctx.SET());
    this.avoidBreakBetween();
    const n = ctx.setItem_list().length;
    const setClauseGrp = this.startGroup();
    for (let i = 0; i < n; i++) {
      const setItemGrp = this.startGroup();
      this.visit(ctx.setItem(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
      this.endGroup(setItemGrp);
    }
    this.endGroup(setClauseGrp);
  };

  // Map has its own formatting rules, see:
  // https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-spacing
  visitMap = (ctx: MapContext) => {
    this.visit(ctx.LCURLY());
    this.avoidSpaceBetween();
    this.avoidBreakBetween();
    const mapGrp = this.startGroup();
    const propertyKeyNames = ctx.propertyKeyName_list();
    const expressions = ctx.expression_list();
    const commaList = ctx.COMMA_list();
    const colonList = ctx.COLON_list();
    for (let i = 0; i < expressions.length; i++) {
      const keyValueGrp = this.startGroup();
      this.visit(propertyKeyNames[i]);
      this.visitTerminalRaw(colonList[i]);
      this.visit(expressions[i]);
      if (i < expressions.length - 1) {
        this.visit(commaList[i]);
      }
      this.endGroup(keyValueGrp);
    }
    this.endGroup(mapGrp);
    this.visit(ctx.RCURLY());
    this.concatenate();
  };

  visitMapProjection = (ctx: MapProjectionContext) => {
    this.visit(ctx.variable());
    this.visit(ctx.LCURLY());
    this.avoidSpaceBetween();
    this.avoidBreakBetween();
    const mapProjectionGrp = this.startGroup();
    const n = ctx.mapProjectionElement_list().length;
    for (let i = 0; i < n; i++) {
      this.visit(ctx.mapProjectionElement(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
    }
    this.endGroup(mapProjectionGrp);
    this.visit(ctx.RCURLY());
    this.concatenate();
  };

  visitListItemsPredicate = (ctx: ListItemsPredicateContext) => {
    const wholeListItemGrp = this.startGroup();
    this.visitRawIfNotNull(ctx.ALL());
    this.visitRawIfNotNull(ctx.ANY());
    this.visitRawIfNotNull(ctx.NONE());
    this.visitRawIfNotNull(ctx.SINGLE());
    this.visit(ctx.LPAREN());
    this.concatenate();
    this.avoidSpaceBetween();
    const listGrp = this.startGroup();
    this.visit(ctx.variable());
    this.visit(ctx.IN());
    this.visit(ctx._inExp);
    if (ctx.WHERE()) {
      this.visit(ctx.WHERE());
      this.visit(ctx._whereExp);
    }
    this.endGroup(listGrp);
    this.visit(ctx.RPAREN());
    this.endGroup(wholeListItemGrp);
  };

  visitListLiteral = (ctx: ListLiteralContext) => {
    this.visit(ctx.LBRACKET());
    this.avoidBreakBetween();
    const listGrp = this.startGroup();
    const n = ctx.expression_list().length;
    for (let i = 0; i < n; i++) {
      const listElemGrp = this.startGroup();
      this.visit(ctx.expression(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
      if (i === n - 1) {
        this.avoidSpaceBetween();
      }
      this.endGroup(listElemGrp);
    }
    this.visit(ctx.RBRACKET());
    this.endGroup(listGrp);
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
      this.addBaseIndentation();
      this.visit(ctx.clause(i));
      this.removeBaseIndentation();
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
    const procedureNameGrp = this.startGroup();
    this.visit(ctx.namespace());
    this.visit(ctx.symbolicNameString());
    this.endGroup(procedureNameGrp);
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
    let argGrp: number;
    if (n > 0) {
      argGrp = this.startGroup();
    }
    let commaIdx = 0;
    for (let i = 0; i < n; i++) {
      if (i === 0) {
        this.avoidSpaceBetween();
      }
      this.visit(ctx.procedureArgument(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(commaIdx));
        commaIdx++;
      }
    }
    this.visitRawIfNotNull(ctx.RPAREN());
    if (n > 0) {
      this.endGroup(argGrp);
    }
    if (ctx.YIELD()) {
      const yieldGrp = this.startGroup();
      const m = ctx.procedureResultItem_list().length;
      this.visit(ctx.YIELD());
      if (ctx.TIMES()) {
        this.visit(ctx.TIMES());
        if (m > 1) {
          this.visit(ctx.COMMA(commaIdx));
          commaIdx++;
        }
      }
      const procedureListGrp = this.startGroup();
      for (let i = 0; i < m; i++) {
        this.visit(ctx.procedureResultItem(i));
        if (i < m - 1) {
          this.visit(ctx.COMMA(commaIdx));
          commaIdx++;
        }
      }
      this.endGroup(procedureListGrp);
      this.visitIfNotNull(ctx.whereClause());
      this.endGroup(yieldGrp);
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
