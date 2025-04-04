import {
  CommonTokenStream,
  ErrorNode,
  ParserRuleContext,
  TerminalNode,
  Token,
} from 'antlr4';
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
  Expression6Context,
  Expression7Context,
  Expression8Context,
  ExpressionContext,
  ExtendedCaseAlternativeContext,
  ExtendedCaseExpressionContext,
  ForeachClauseContext,
  FulltextNodePatternContext,
  FunctionInvocationContext,
  IndexPostfixContext,
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
  PatternElementContext,
  PatternListContext,
  ProcedureNameContext,
  PropertyContext,
  QuantifierContext,
  RangePostfixContext,
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
  Chunk,
  CommentChunk,
  findTargetToken,
  getParseTreeAndTokens,
  IndentationModifier,
  isComment,
  RegularChunk,
  SyntaxErrorChunk,
  wantsToBeConcatenated,
  wantsToBeUpperCase,
} from './formattingHelpers';
import {
  buffersToFormattedString,
  doesNotWantSpace,
  Group,
} from './formattingSolutionSearch';

const MISSING = '<missing';

interface RawTerminalOptions {
  lowerCase?: boolean;
  upperCase?: boolean;
  spacingChoice?: SpacingChoice;
  dontConcatenate?: boolean;
}

type SpacingChoice = 'SPACE_AFTER' | 'EXTRA_SPACE';

export class TreePrintVisitor extends CypherCmdParserVisitor<void> {
  root: StatementsOrCommandsContext;
  query: string;
  buffers: Chunk[][] = [];
  indentation = 0;
  indentationSpaces = 2;
  targetToken?: number;
  cursorPos = 0;
  indentId = 0;
  indentStack: IndentationModifier[] = [];
  groupID = 0;
  groupStack: Group[] = [];
  previousTokenIndex: number = -1;
  unParseable: string = '';
  unParseableStart: number | undefined;
  firstUnParseableToken: Token | undefined;

  constructor(
    private tokenStream: CommonTokenStream,
    root: StatementsOrCommandsContext,
    query: string,
    unParseable: string | undefined,
    firstUnParseableToken: Token | undefined,
  ) {
    super();
    this.root = root;
    this.query = query;
    this.buffers.push([]);
    if (unParseable) {
      this.unParseable = unParseable;
    }
    if (firstUnParseableToken) {
      this.firstUnParseableToken = firstUnParseableToken;
      this.unParseableStart = firstUnParseableToken.tokenIndex;
    }
  }

  format = () => {
    this._visit(this.root);
    // There may be some trailling groups that are left to achieve indentation
    this.removeAllPendingGroups();
    this.fillInGroupSizes();
    const result = buffersToFormattedString(this.buffers);
    this.cursorPos += result.cursorPos;
    const resultString = result.formattedString + this.unParseable;
    const originalNonWhitespaceCount = this.query.replace(/\s/g, '').length;
    const formattedNonWhitespaceCount = resultString.replace(/\s/g, '').length;

    // Do not return the formatting result if we have accidentally modified it beyond
    // whitespace changes. If we did so even when there wasn't a syntax error,
    // it should raise an internal error. If there is a syntax error, we do not guarantee
    // we can format the query.
    if (originalNonWhitespaceCount !== formattedNonWhitespaceCount) {
      if (this.unParseable && this.firstUnParseableToken) {
        throw new Error(
          `Unable to format query due to syntax error near ${this.firstUnParseableToken?.text} at line ${this.firstUnParseableToken?.line}`,
        );
      }
      // TODO: reenable this
      //throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
    }
    return resultString;
  };

  fillInGroupSizes = () => {
    for (const chunkList of this.buffers) {
      let activeGroups: Group[] = [];
      for (let i = 0; i < chunkList.length; i++) {
        const chunk = chunkList[i];
        const gettingRemoved = new Set<number>(
          chunk.groupsEnding.map((g) => g.id),
        );
        if (chunk.type === 'REGULAR') {
          for (const group of activeGroups) {
            if (!chunk.text) {
              throw new Error('Expected text, got' + chunk.text);
            }
            group.size += chunk.text.length;
            group.dbgText += chunk.text;
            if (!chunk.noSpace && !doesNotWantSpace(chunk, chunk)) {
              group.size++;
              group.dbgText += ' ';
            }
            // TODO: If it is the last one in the group then it does not need to break
            if (chunk.comment && !gettingRemoved.has(group.id)) {
              group.breaksAll = true;
            }
          }
        } else if (chunk.type === 'COMMENT') {
          // TODO: Is this reasonable ?????????
          if (activeGroups.length > 0) {
            activeGroups[0].breaksAll = true;
          }
        }
        for (const group of chunk.groupsStarting) {
          activeGroups.push(group);
        }
        const newActiveGroups: Group[] = [];
        for (const group of activeGroups) {
          if (!gettingRemoved.has(group.id)) {
            newActiveGroups.push(group);
          } else {
            if (group.dbgText.at(-1) === ' ') {
              group.size--;
              group.dbgText = group.dbgText.slice(0, -1);
            }
          }
        }
        activeGroups = newActiveGroups;
      }
    }

    // Verify the sizes of all the groups
    for (const chunkList of this.buffers) {
      for (const chunk of chunkList) {
        for (const group of chunk.groupsStarting) {
          if (group.size !== group.dbgText.length) {
            throw new Error(
              `Group size mismatch: ${group.size} !== ${group.dbgText.length}`,
            );
          }
        }
      }
    }
  };

  currentBuffer = () => this.buffers.at(-1);

  lastInCurrentBuffer = () => this.currentBuffer().at(-1);

  removeAllPendingGroups = () => {
    while (this.groupStack.length > 0) {
      this.endGroup(this.groupStack.at(-1).id);
    }
  };

  breakLine = () => {
    // NOTE: Groups do not translate between line breaks. In some cases (primarily CASE and EXISTS)
    // groups might be active when breakLine() is called, but it does not make sense to keeep them active
    // so clear all groups when this happens.
    this.removeAllPendingGroups();

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
    if (
      this.currentBuffer()[indices[0]].type !== 'REGULAR' ||
      this.currentBuffer()[indices[1]].type !== 'REGULAR'
    ) {
      return;
    }
    const suffix = this.currentBuffer().splice(indices[0], 1)[0];
    const prefix = this.currentBuffer()[indices[1]];
    const hasCursor = prefix.isCursor || suffix.isCursor;
    if (suffix.isCursor) {
      this.cursorPos += prefix.text.length;
    }
    const chunk: RegularChunk = {
      type: 'REGULAR',
      text: prefix.text + suffix.text,
      doubleBreak: suffix.doubleBreak,
      groupsStarting: prefix.groupsStarting.concat(suffix.groupsStarting),
      groupsEnding: prefix.groupsEnding.concat(suffix.groupsEnding),
      indentation: prefix.indentation.concat(suffix.indentation),
      // TODO: Maybe make the field an empty string instead
      comment: (prefix.comment || '') + (suffix.comment || '') || undefined,
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
    if (this.groupStack.length === 0 || this.groupStack.at(-1).id !== id) {
      return;
    }
    const idx = this.getFirstNonCommentIdx();
    const group = this.groupStack.pop();
    this.currentBuffer().at(idx).groupsEnding.push(group);
  };

  endAllExceptBaseGroup = () => {
    while (this.groupStack.length > 1) {
      this.endGroup(this.groupStack.at(-1).id);
    }
  };

  startGroup = (): number => {
    const last = this.lastInCurrentBuffer();
    const newGroup: Group = {
      id: this.groupID,
      dbgText: '',
      size: 0,
      align: 0, // Irrelevant here
      breakCost: 0,
    };
    last.groupsStarting.push(newGroup);
    this.groupStack.push(newGroup);
    this.groupID++;
    return this.groupID - 1;
  };

  startGroupAlsoOnComment = (): number => {
    if (this.lastInCurrentBuffer().type === 'COMMENT') {
      const idx = this.getFirstNonCommentIdx();
      const target = this.currentBuffer().at(idx + 1);
      const newGroup: Group = {
        id: this.groupID,
        dbgText: '',
        size: 0,
        align: 0, // Irrelevant here
        breakCost: 0,
      };
      target.groupsStarting.push(newGroup);
      this.groupStack.push(newGroup);
      this.groupID++;
      return this.groupID - 1;
    }
    return this.startGroup();
  };

  setIndentationProperty = (modifier: 'add' | 'remove') => {
    const idx = this.getFirstNonCommentIdx();
    const chunk = this.currentBuffer().at(idx);
    const indentId = this.indentId;
    this.indentId++;
    const indent: IndentationModifier = {
      id: indentId,
      change: modifier === 'add' ? 1 : -1,
    };
    this.indentStack.push(indent);
    chunk.indentation.push(indent);
    return indentId;
  };

  addIndentation = () => {
    return this.setIndentationProperty('add');
  };

  removeIndentation = (id: number) => {
    if (this.indentStack.length === 0 || this.indentStack.at(-1).id !== id) {
      throw new Error('wrong indent id on top of stack');
    }
    const idx = this.getFirstNonCommentIdx();
    const chunk = this.currentBuffer().at(idx);
    const indent = this.indentStack.pop();
    chunk.indentation.push({
      id: indent.id,
      change: -1,
    });
  };

  getBottomChild = (
    ctx: ParserRuleContext | TerminalNode,
    side: 'before' | 'after',
  ): TerminalNode => {
    if (ctx instanceof TerminalNode) {
      return ctx;
    }
    // In case there were syntax errors (missing tokens) there might not be any children.
    if (ctx.getChildCount() === 0) {
      return null;
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
    // If the bottom child does not exist (missing due to syntax error) or is a MISSING token,
    // disregard preserving explicit newlines
    if (!bottomChild) {
      return;
    }
    const token = bottomChild.symbol;
    if (token.text.startsWith(MISSING)) {
      return;
    }
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
        groupsStarting: [],
        groupsEnding: [],
        indentation: [],
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
      if (nodeLine === commentLine) {
        // This does not necessarily have to be a regular? TODO: check this
        const previousChunk = this.lastInCurrentBuffer();
        previousChunk.comment = text;
      } else {
        const chunk: CommentChunk = {
          type: 'COMMENT',
          breakBefore: true,
          text,
          groupsStarting: [],
          groupsEnding: [],
          indentation: [],
        };
        this.currentBuffer().push(chunk);
      }
    }
    // Account for the last comment having multiple newline after it, to remember explicit
    // newlines when we have e.g. [C, \n, \n]
    if (breakCount > 1 && includesComment) {
      this.doubleBreakBetween();
    }
  };

  _visit = (ctx: ParserRuleContext | TerminalNode) => {
    if (ctx) {
      this.visit(ctx);
    }
  };

  _visitTerminalRaw = (ctx: TerminalNode, options?: RawTerminalOptions) => {
    if (!ctx) {
      return;
    }
    // @ts-expect-error ctx can be ErrorNode but can't really check it.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (ctx.isErrorNode && ctx.isErrorNode()) {
      this.visit(ctx);
      return;
    }
    this.visitTerminalRaw(ctx, options);
  };

  // Error nodes are attached to the first token that the parser recognizes again.
  // So to restore all the syntactically incorrect parts, we keep track of the last valid
  // token, and grab everything between it and the error node
  visitErrorNode = (node: ErrorNode) => {
    if (
      this.unParseableStart &&
      node.symbol.tokenIndex >= this.unParseableStart
    ) {
      return;
    }
    const token = node.symbol;
    const errorTokenIndex = token.tokenIndex;

    let gapText = '';
    if (this.previousTokenIndex < errorTokenIndex - 1) {
      const skippedTokens = this.tokenStream.tokens.slice(
        this.previousTokenIndex + 1,
        errorTokenIndex,
      );
      gapText = skippedTokens.map((t) => t.text).join('');
    }

    const errorText = token.text.startsWith(MISSING) ? '' : token.text;
    const combinedText = gapText + errorText;

    this.previousTokenIndex = errorTokenIndex;

    const chunk: SyntaxErrorChunk = {
      type: 'SYNTAX_ERROR',
      text: combinedText,
      groupsStarting: [],
      groupsEnding: [],
      indentation: [],
    };

    this.currentBuffer().push(chunk);
  };

  breakAndVisitChildren = (ctx: ParserRuleContext) => {
    this.breakLine();
    this.visitChildren(ctx);
  };

  visitStatementsOrCommands = (ctx: StatementsOrCommandsContext) => {
    const n = ctx.statementOrCommand_list().length;
    for (let i = 0; i < n; i++) {
      this._visit(ctx.statementOrCommand(i));
      if (i < n - 1 || ctx.SEMICOLON(i)) {
        if (this.lastInCurrentBuffer().text === '\n') {
          this.currentBuffer().pop();
        }
        this._visit(ctx.SEMICOLON(i));
        this.preserveExplicitNewlineAfter(ctx.SEMICOLON(i));
      }
    }
  };

  visitCommand = (ctx: CommandContext) => {
    this.breakAndVisitChildren(ctx);
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
    this._visit(ctx.createCompositeDatabase());
    this._visit(ctx.createConstraint());
    this._visit(ctx.createDatabase());
    this._visit(ctx.createIndex());
    this._visit(ctx.createRole());
    this._visit(ctx.createUser());
  };

  visitCreateConstraint = (ctx: CreateConstraintContext) => {
    this.visit(ctx.CONSTRAINT());
    this.avoidBreakBetween();
    this._visit(ctx.symbolicNameOrStringParameter());
    this._visitCommandIfNotExists(ctx);
    this.breakLine();
    this.visit(ctx.FOR());
    this.avoidBreakBetween();
    this._visit(ctx.commandNodePattern());
    this._visit(ctx.commandRelPattern());
    this.visit(ctx.constraintType());
    this._visit(ctx.commandOptions());
  };

  visitConstraintTyped = (ctx: ConstraintTypedContext) => {
    this.breakAndVisitChildren(ctx);
  };

  visitConstraintIsUnique = (ctx: ConstraintIsUniqueContext) => {
    this.breakAndVisitChildren(ctx);
  };

  visitConstraintKey = (ctx: ConstraintKeyContext) => {
    this.breakAndVisitChildren(ctx);
  };
  visitConstraintIsNotNull = (ctx: ConstraintIsNotNullContext) => {
    this.breakAndVisitChildren(ctx);
  };

  visitCreateIndex_ = (ctx: CreateIndex_Context) => {
    this._visit(ctx.symbolicNameOrStringParameter());
    this._visitCommandIfNotExists(ctx);
    this.breakLine();
    this.visit(ctx.FOR());
    this._visit(ctx.commandNodePattern());
    this._visit(ctx.commandRelPattern());
    this.breakLine();
    this.visit(ctx.ON());
    this.visit(ctx.propertyList());
    this._visit(ctx.commandOptions());
  };

  visitCreateFulltextIndex = (ctx: CreateFulltextIndexContext) => {
    this._visit(ctx.symbolicNameOrStringParameter());
    this._visitCommandIfNotExists(ctx);
    this.breakLine();
    this.visit(ctx.FOR());
    this._visit(ctx.fulltextNodePattern());
    this._visit(ctx.fulltextRelPattern());
    this.breakLine();
    this.visit(ctx.ON());
    this.visit(ctx.EACH());
    this.avoidBreakBetween();
    this.visit(ctx.LBRACKET());
    this.visit(ctx.enclosedPropertyList());
    this.visit(ctx.RBRACKET());
    this._visit(ctx.commandOptions());
  };

  visitCommandOptions = (ctx: CommandOptionsContext) => {
    this.breakLine();
    this.visit(ctx.OPTIONS());
    const indentId = this.addIndentation();
    const optionsGrp = this.startGroup();
    this.visit(ctx.mapOrParameter());
    this.removeIndentation(indentId);
    this.endGroup(optionsGrp);
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
    this.breakAndVisitChildren(ctx);
    this.preserveExplicitNewlineAfter(ctx);
  };

  visitUseClause = (ctx: UseClauseContext) => {
    this._visit(ctx.USE());
    const useGrp = this.startGroup();
    this._visit(ctx.GRAPH());
    this._visit(ctx.graphReference());
    this.endGroup(useGrp);
  };

  visitWithClause = (ctx: WithClauseContext) => {
    this._visit(ctx.WITH());
    const withClauseGrp = this.startGroupAlsoOnComment();
    this._visit(ctx.returnBody());
    this.endGroup(withClauseGrp);
    this._visit(ctx.whereClause());
  };

  visitMatchClause = (ctx: MatchClauseContext) => {
    this._visit(ctx.OPTIONAL());
    this._visit(ctx.MATCH());
    const id = this.addIndentation();
    const matchClauseGrp = this.startGroup();
    this._visit(ctx.matchMode());
    this._visit(ctx.patternList());
    this.endGroup(matchClauseGrp);
    const n = ctx.hint_list().length;
    for (let i = 0; i < n; i++) {
      this._visit(ctx.hint(i));
    }
    this.removeIndentation(id);
    this._visit(ctx.whereClause());
  };

  visitCreateClause = (ctx: CreateClauseContext) => {
    this._visit(ctx.CREATE());
    const indentId = this.addIndentation();
    const createClauseGrp = this.startGroup();
    this._visit(ctx.patternList());
    this.endGroup(createClauseGrp);
    this.removeIndentation(indentId);
  };

  visitInsertClause = (ctx: InsertClauseContext) => {
    this._visit(ctx.INSERT());
    const insertClauseGrp = this.startGroup();
    this._visit(ctx.insertPatternList());
    this.endGroup(insertClauseGrp);
  };

  visitDeleteClause = (ctx: DeleteClauseContext) => {
    if (ctx.DETACH() || ctx.NODETACH()) {
      this._visit(ctx.DETACH());
      this._visit(ctx.NODETACH());
      this.avoidBreakBetween();
    }
    this._visit(ctx.DELETE());
    const deleteClauseGrp = this.startGroup();
    const n = ctx.expression_list().length;
    for (let i = 0; i < n; i++) {
      this._visit(ctx.expression(i));
      if (i < n - 1) {
        this._visit(ctx.COMMA(i));
      }
    }
    this.endGroup(deleteClauseGrp);
  };

  visitReturnClause = (ctx: ReturnClauseContext) => {
    this._visit(ctx.RETURN());
    this._visit(ctx.returnBody());
  };

  visitReturnBody = (ctx: ReturnBodyContext) => {
    this._visit(ctx.DISTINCT());
    const indentId = this.addIndentation();
    const returnItemsGrp = this.startGroup();
    this._visit(ctx.returnItems());
    this.removeIndentation(indentId);
    if (ctx.orderBy() || ctx.skip()) {
      const orderSkipGrp = this.startGroup();
      this.breakLine();
      this._visit(ctx.orderBy());
      this._visit(ctx.skip());
      this.endGroup(orderSkipGrp);
    }
    this.endGroup(returnItemsGrp);
    this._visit(ctx.limit());
  };

  visitUnwindClause = (ctx: UnwindClauseContext) => {
    this._visit(ctx.UNWIND());
    const unwindClauseGrp = this.startGroup();
    const indentId = this.addIndentation();
    this._visit(ctx.expression());
    const asGrp = this.startGroup();
    this._visit(ctx.AS());
    this._visit(ctx.variable());
    this.removeIndentation(indentId);
    this.endGroup(asGrp);
    this.endGroup(unwindClauseGrp);
  };

  visitLimit = (ctx: LimitContext) => {
    this.preserveExplicitNewlineBefore(ctx);
    this.breakAndVisitChildren(ctx);
  };

  visitReturnItem = (ctx: ReturnItemContext) => {
    this._visit(ctx.expression());
    if (ctx.AS() || ctx.variable()) {
      const asGrp = this.startGroup();
      this.avoidBreakBetween();
      const indentId = this.addIndentation();
      this._visit(ctx.AS());
      this._visit(ctx.variable());
      this.endGroup(asGrp);
      this.removeIndentation(indentId);
    }
  };

  visitReturnItems = (ctx: ReturnItemsContext) => {
    if (ctx.TIMES()) {
      this._visit(ctx.TIMES());
    }
    const n = ctx.returnItem_list().length;
    let commaIdx = 0;
    if (ctx.TIMES() && n > 0) {
      this._visit(ctx.COMMA(commaIdx));
      commaIdx++;
    }
    for (let i = 0; i < n; i++) {
      const returnItemGrp = this.startGroup();
      this._visit(ctx.returnItem(i));
      if (i < n - 1) {
        this._visit(ctx.COMMA(commaIdx));
        commaIdx++;
      }
      this.endGroup(returnItemGrp);
    }
  };

  // Handled separately because count star is its own thing
  visitCountStar = (ctx: CountStarContext) => {
    this._visitTerminalRaw(ctx.COUNT());
    this._visit(ctx.LPAREN());
    this._visitTerminalRaw(ctx.TIMES());
    this._visit(ctx.RPAREN());
  };

  visitReduceExpression = (ctx: ReduceExpressionContext) => {
    this._visitTerminalRaw(ctx.REDUCE());
    this._visit(ctx.LPAREN());
    const reduceExprGrp = this.startGroup();
    this._visit(ctx.variable(0));
    this._visit(ctx.EQ());
    this._visit(ctx.expression(0));
    this._visitTerminalRaw(ctx.COMMA());
    this._visit(ctx.variable(1));
    this._visit(ctx.IN());
    this._visit(ctx.expression(1));
    this._visit(ctx.BAR());
    this._visit(ctx.expression(2));
    this._visit(ctx.RPAREN());
    this.endGroup(reduceExprGrp);
  };

  // Handled separately to avoid spaces between a minus and a number
  visitNumberLiteral = (ctx: NumberLiteralContext) => {
    this._visitTerminalRaw(ctx.MINUS());
    this._visit(ctx.DECIMAL_DOUBLE());
    this._visit(ctx.UNSIGNED_DECIMAL_INTEGER());
    this._visit(ctx.UNSIGNED_HEX_INTEGER());
    this._visit(ctx.UNSIGNED_OCTAL_INTEGER());
  };

  // Handled separately since otherwise they will get weird spacing
  visitLabelExpression = (ctx: LabelExpressionContext) => {
    this._visitTerminalRaw(ctx.COLON());
    this.avoidBreakBetween();
    if (ctx.IS()) {
      this._visit(ctx.IS());
    } else {
      this.avoidSpaceBetween();
    }
    this._visit(ctx.labelExpression4());
  };

  visitLabelExpression4 = (ctx: LabelExpression4Context) => {
    // There is no great way to know which labels have colons before them,
    // so we have to resort to manually checking the types of the children.
    const n = ctx.getChildCount();
    for (let i = 0; i < n; i++) {
      const child = ctx.getChild(i);
      if (child instanceof LabelExpression3Context) {
        this._visit(child);
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
        this._visit(child);
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
      this._visitTerminalRaw(ctx.EXCLAMATION_MARK(i));
      this.concatenate();
      if (i == n - 1) {
        this.avoidSpaceBetween();
      }
    }
    this._visit(ctx.labelExpression1());
  };

  visitTerminal = (node: TerminalNode) => {
    if (node.getText().startsWith(MISSING)) {
      return;
    }
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
      groupsStarting: [],
      groupsEnding: [],
      indentation: [],
    };
    if (node.symbol.tokenIndex === this.targetToken) {
      chunk.isCursor = true;
    }
    this.currentBuffer().push(chunk);
    if (wantsToBeConcatenated(node)) {
      this.concatenate();
    }
    this.addCommentsAfter(node);
    this.previousTokenIndex = node.symbol.tokenIndex;
  };

  // Some terminals don't want to have the regular rules applied to them,
  // for instance the . in properties should be handled in a "raw" manner to
  // avoid getting spaces around it (since it is an operator and operators want spaces)
  // But we still need to get the comments, to ensure that in e.g. the query
  // node. // comment
  // prop
  // the comment doesn't disappear
  visitTerminalRaw = (node: TerminalNode, options?: RawTerminalOptions) => {
    if (node.getText().startsWith(MISSING)) {
      return;
    }
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
      groupsStarting: [],
      groupsEnding: [],
      indentation: [],
    };
    if (node.symbol.tokenIndex === this.targetToken) {
      chunk.isCursor = true;
    }

    this.currentBuffer().push(chunk);
    if (!options?.spacingChoice) {
      this.avoidSpaceBetween();
    }
    if (!options?.dontConcatenate && wantsToBeConcatenated(node)) {
      this.concatenate();
    }
    this.addCommentsAfter(node);
    this.previousTokenIndex = node.symbol.tokenIndex;
  };

  // Handled separately because the dollar should not be treated
  // as an operator
  visitParameter = (ctx: ParameterContext) => {
    this._visitTerminalRaw(ctx.DOLLAR());
    this._visit(ctx.parameterName());
    this.concatenate();
  };

  // Literals have casing rules, see
  // https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-casing
  visitBooleanLiteral = (ctx: BooleanLiteralContext) => {
    this._visitTerminalRaw(ctx.TRUE(), {
      lowerCase: true,
      spacingChoice: 'SPACE_AFTER',
    });
    this._visitTerminalRaw(ctx.FALSE(), {
      lowerCase: true,
      spacingChoice: 'SPACE_AFTER',
    });
  };

  visitKeywordLiteral = (ctx: KeywordLiteralContext) => {
    if (ctx.NULL()) {
      this._visitTerminalRaw(ctx.NULL(), {
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
    this._visit(ctx.variable());
    this.avoidBreakBetween();
    this._visit(ctx.labelExpression());
    this.avoidBreakBetween();
    if (ctx instanceof RelationshipPatternContext && ctx.pathLength()) {
      this._visit(ctx.pathLength());
      this.concatenate();
    }
    this._visit(ctx.properties());
    if (ctx.WHERE()) {
      this._visit(ctx.WHERE());
      this._visit(ctx.expression());
    }
  };

  visitPathLength = (ctx: PathLengthContext) => {
    this._visitTerminalRaw(ctx.TIMES());
    if (ctx._single) {
      this._visitTerminalRaw(ctx.UNSIGNED_DECIMAL_INTEGER(0));
      this.concatenate();
    } else if (ctx.DOTDOT()) {
      let idx = 0;
      if (ctx._from_) {
        this._visitTerminalRaw(ctx.UNSIGNED_DECIMAL_INTEGER(idx));
        this.concatenate();
        idx++;
      }
      this._visitTerminalRaw(ctx.DOTDOT());
      this.concatenate();
      if (ctx._to) {
        this._visitTerminalRaw(ctx.UNSIGNED_DECIMAL_INTEGER(idx));
        this.concatenate();
      }
    }
  };

  visitParenthesizedPath = (ctx: ParenthesizedPathContext) => {
    this._visit(ctx.LPAREN());
    const indentId = this.addIndentation();
    this.avoidBreakBetween();
    const parenthesizedPathGrp = this.startGroup();
    this._visit(ctx.pattern());
    if (ctx.WHERE()) {
      const whereGrp = this.startGroup();
      this._visit(ctx.WHERE());
      const indentId2 = this.addIndentation();
      const whereExprGrp = this.startGroup();
      this._visit(ctx.expression());
      this.endGroup(whereExprGrp);
      this.endGroup(whereGrp);
      this.removeIndentation(indentId2);
    }
    this.endGroup(parenthesizedPathGrp);
    this.removeIndentation(indentId);
    this._visit(ctx.RPAREN());
    this._visit(ctx.quantifier());
  };

  visitArrowLine = (ctx: ArrowLineContext) => {
    this._visitTerminalRaw(ctx.MINUS());
    this._visitTerminalRaw(ctx.ARROW_LINE());
  };

  visitRelationshipPattern = (ctx: RelationshipPatternContext) => {
    if (ctx.leftArrow()) {
      this.avoidSpaceBetween();
      this._visit(ctx.leftArrow());
    }
    const arrowLineList = ctx.arrowLine_list();
    // Concatenations are to ensure the (left) arrow remains
    // on the previous line (styleguide rule) if we need to break within the pattern
    this._visit(arrowLineList[0]);
    this.concatenate();
    this.avoidSpaceBetween();
    if (ctx.leftArrow()) {
      this.concatenate();
      this.avoidSpaceBetween();
    }
    if (ctx.LBRACKET()) {
      const bracketPatternGrp = this.startGroup();
      this._visit(ctx.LBRACKET());
      this.avoidBreakBetween();
      this.handleInnerPatternContext(ctx);
      this._visit(ctx.RBRACKET());
      this.endGroup(bracketPatternGrp);
    }
    // Same idea with concatenation as above
    this.avoidSpaceBetween();
    this._visit(arrowLineList[1]);
    this.concatenate();
    if (ctx.rightArrow()) {
      this._visit(ctx.rightArrow());
      this.concatenate();
    }
    this.avoidSpaceBetween();
  };

  visitNodePattern = (ctx: NodePatternContext) => {
    this._visit(ctx.LPAREN());
    this.avoidBreakBetween();
    const nodePatternGrp = this.startGroup();
    const indentId = this.addIndentation();
    if (ctx.variable() || ctx.labelExpression() || ctx.properties()) {
      let variableLabelGrp: number;
      if (ctx.variable() && ctx.labelExpression()) {
        variableLabelGrp = this.startGroup();
      }
      this._visit(ctx.variable());
      this._visit(ctx.labelExpression());
      if (ctx.variable() && ctx.labelExpression()) {
        this.endGroup(variableLabelGrp);
      }
      this._visit(ctx.properties());
      if (ctx.WHERE()) {
        this._visit(ctx.WHERE());
        this._visit(ctx.expression());
      }
    } else {
      this._visit(ctx.WHERE());
      this._visit(ctx.expression());
    }
    this.removeIndentation(indentId);
    this._visit(ctx.RPAREN());
    this.endGroup(nodePatternGrp);
  };

  visitPattern = (ctx: PatternContext) => {
    // Don't create an unnecessary group if we don't also have a path
    if (!ctx.variable() && !ctx.selector()) {
      this.visitChildren(ctx);
      return;
    }
    let wholePatternGrp: number;
    let indentId: number;
    if (ctx.variable()) {
      wholePatternGrp = this.startGroup();
      this._visit(ctx.variable());
      this.avoidBreakBetween();
      this._visit(ctx.EQ());
      indentId = this.addIndentation();
    }
    const selectorAnonymousPatternGrp = this.startGroup();
    if (ctx.selector()) {
      const selectorGroup = this.startGroup();
      this._visit(ctx.selector());
      this.endGroup(selectorGroup);
    }
    const anonymousPatternGrp = this.startGroup();
    this._visit(ctx.anonymousPattern());
    if (ctx.variable()) {
      this.removeIndentation(indentId);
    }
    this.endGroup(anonymousPatternGrp);
    this.endGroup(selectorAnonymousPatternGrp);
    this.endGroup(wholePatternGrp);
  };

  visitPatternElement = (ctx: PatternElementContext) => {
    const n = ctx.getChildCount();
    let i = 0;

    while (i < n) {
      const child = ctx.getChild(i);

      if (
        child instanceof NodePatternContext &&
        i + 1 < n &&
        ctx.getChild(i + 1) instanceof RelationshipPatternContext
      ) {
        i = this._processNodeRelSequence(ctx, i, n);
      } else if (child instanceof ParenthesizedPathContext) {
        this.visitParenthesizedPath(child);
        i++;
      } else {
        this._visit(child as ParserRuleContext);
        i++;
      }
    }
  };

  // Very convoluted logic related to visitPatternElement, used becase we want to be able
  // to put groups around node patterns and relationships like this: START (node)-[rel](qpp?) END
  // and the grammar is very unhelpful...
  _processNodeRelSequence = (
    ctx: PatternElementContext,
    startIndex: number,
    n: number,
  ): number => {
    let i = startIndex;
    let nodeRelPatternGrp = this.startGroup();

    this.visitNodePattern(ctx.getChild(i) as NodePatternContext);
    i++;
    while (i < n && ctx.getChild(i) instanceof RelationshipPatternContext) {
      const indentId = this.addIndentation();
      this.visitRelationshipPattern(
        ctx.getChild(i) as RelationshipPatternContext,
      );
      i++;
      this.removeIndentation(indentId);

      if (i < n && ctx.getChild(i) instanceof QuantifierContext) {
        this.visitQuantifier(ctx.getChild(i) as QuantifierContext);
        i++;
      }
      this.endGroup(nodeRelPatternGrp);
      if (i < n && ctx.getChild(i) instanceof NodePatternContext) {
        if (
          i + 1 < n &&
          ctx.getChild(i + 1) instanceof RelationshipPatternContext
        ) {
          nodeRelPatternGrp = this.startGroup();
        }
        this.visitNodePattern(ctx.getChild(i) as NodePatternContext);
        i++;
      } else {
        break;
      }
    }
    return i;
  };

  visitPatternList = (ctx: PatternListContext) => {
    const n = ctx.pattern_list().length;
    if (n === 1) {
      this.visitChildren(ctx);
      return;
    }
    const wholePatternListGrp = this.startGroup();
    for (let i = 0; i < n; i++) {
      const patternListItemGrp = this.startGroup();
      this._visit(ctx.pattern(i));
      if (i < n - 1) {
        this._visit(ctx.COMMA(i));
      }
      this.endGroup(patternListItemGrp);
    }
    this.endGroup(wholePatternListGrp);
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
      this._visitTerminalRaw(ctx.LCURLY(), { spacingChoice: 'EXTRA_SPACE' });
    } else {
      this._visit(ctx.LCURLY());
    }
    this.concatenate();
    let idx = 0;
    if (ctx._from_) {
      this._visit(ctx.UNSIGNED_DECIMAL_INTEGER(idx));
      this.concatenate();
      idx++;
    }
    if (ctx._to) {
      this._visit(ctx.COMMA());
      this.concatenate();
      this._visit(ctx.UNSIGNED_DECIMAL_INTEGER(idx));
      this.concatenate();
    } else {
      this._visitTerminalRaw(ctx.COMMA(), { spacingChoice: 'EXTRA_SPACE' });
      this.concatenate();
    }
    this._visit(ctx.RCURLY());
    this.concatenate();
    this.avoidSpaceBetween();
  };

  // Handled separately because the dots aren't operators
  visitNamespace = (ctx: NamespaceContext) => {
    const n = ctx.DOT_list().length;
    for (let i = 0; i < n; i++) {
      this._visit(ctx.symbolicNameString(i));
      this.avoidSpaceBetween();
      this._visitTerminalRaw(ctx.DOT(i));
    }
  };

  // Handled separately because the dot is not an operator
  visitProperty = (ctx: PropertyContext) => {
    this._visitTerminalRaw(ctx.DOT());
    if (!(ctx.parentCtx instanceof MapProjectionElementContext)) {
      this.concatenate();
    }
    this._visit(ctx.propertyKeyName());
    this.concatenate();
  };

  // Handled separately because where is not a clause (it is a subclause)
  visitWhereClause = (ctx: WhereClauseContext) => {
    this.preserveExplicitNewlineBefore(ctx);
    this.breakLine();
    this._visit(ctx.WHERE());
    const indentId = this.addIndentation();
    const whereClauseGrp = this.startGroup();
    this._visit(ctx.expression());
    this.endGroup(whereClauseGrp);
    this.removeIndentation(indentId);
  };

  visitParenthesizedExpression = (ctx: ParenthesizedExpressionContext) => {
    this._visit(ctx.LPAREN());
    const indentId = this.addIndentation();
    this.avoidBreakBetween();
    const parenthesizedExprGrp = this.startGroup();
    this._visit(ctx.expression());
    this.endGroup(parenthesizedExprGrp);
    this.removeIndentation(indentId);
    this._visit(ctx.RPAREN());
  };

  visitBinaryExpression = (ctx: ParserRuleContext) => {
    const n = ctx.getChildCount();
    if (n === 1) {
      this.visitChildren(ctx);
      return;
    }
    const wrappingGrp = this.startGroup();

    let groupId: number;
    for (let i = 0; i < n; i++) {
      const child = ctx.getChild(i);
      if (child instanceof TerminalNode) {
        this.avoidBreakBetween();
        this.visitTerminal(child);
        this.endGroup(groupId);
      } else if (child instanceof ParserRuleContext) {
        if (i < n - 1) {
          groupId = this.startGroup();
        }
        this._visit(child);
      }
    }
    this.endGroup(wrappingGrp);
  };

  visitExpression = (ctx: ExpressionContext) => {
    this.visitBinaryExpression(ctx);
  };

  visitExpression10 = (ctx: Expression10Context) => {
    this.visitBinaryExpression(ctx);
  };

  visitExpression8 = (ctx: Expression8Context) => {
    this.visitBinaryExpression(ctx);
  };

  visitExpression7 = (ctx: Expression7Context) => {
    if (!ctx.comparisonExpression6()) {
      this.visitChildren(ctx);
      return;
    }
    this._visit(ctx.expression6());
    this.avoidBreakBetween();
    const comparisonExprGrp = this.startGroup();
    this.visit(ctx.comparisonExpression6());
    this.endGroup(comparisonExprGrp);
  };

  visitExpression6 = (ctx: Expression6Context) => {
    this.visitBinaryExpression(ctx);
  };

  visitExpression2 = (ctx: Expression2Context) => {
    this._visit(ctx.expression1());
    const n = ctx.postFix_list().length;
    for (let i = 0; i < n; i++) {
      this.avoidSpaceBetween();
      this._visit(ctx.postFix(i));
    }
  };

  visitIndexPostfix = (ctx: IndexPostfixContext) => {
    this._visit(ctx.LBRACKET());
    this._visit(ctx.expression());
    this.avoidSpaceBetween();
    this._visit(ctx.RBRACKET());
  };

  visitRangePostfix = (ctx: RangePostfixContext) => {
    this._visit(ctx.LBRACKET());
    if (ctx._fromExp) {
      this._visit(ctx.expression(0));
    }
    this._visit(ctx.DOTDOT());
    if (ctx._toExp) {
      if (ctx._fromExp) {
        this._visit(ctx.expression(1));
      } else {
        this._visit(ctx.expression(0));
      }
    }
    this.avoidSpaceBetween();
    this._visit(ctx.RBRACKET());
  };

  // Handled separately because it contains subclauses (and thus indentation rules)
  visitExistsExpression = (ctx: ExistsExpressionContext) => {
    this._visit(ctx.EXISTS());
    this.avoidBreakBetween();
    this._visit(ctx.LCURLY());

    if (ctx.regularQuery()) {
      const indentId = this.addIndentation();
      this._visit(ctx.regularQuery());
      this.removeIndentation(indentId);
      this.breakLine();
      this.mustBreakBetween();
      this._visit(ctx.RCURLY());
    } else {
      this._visit(ctx.matchMode());
      this._visit(ctx.patternList());
      this._visit(ctx.whereClause());
      this._visit(ctx.RCURLY());
    }
  };

  visitCollectExpression = (ctx: CollectExpressionContext) => {
    this._visit(ctx.COLLECT());
    this.avoidBreakBetween();
    this._visit(ctx.LCURLY());
    const indentId = this.addIndentation();
    this._visit(ctx.regularQuery());
    this.removeIndentation(indentId);
    this.breakLine();
    this._visit(ctx.RCURLY());
  };

  visitCountExpression = (ctx: CountExpressionContext) => {
    this._visit(ctx.COUNT());
    this.avoidBreakBetween();
    this._visit(ctx.LCURLY());

    if (ctx.regularQuery()) {
      const indentId = this.addIndentation();
      this._visit(ctx.regularQuery());
      this.removeIndentation(indentId);
      this.breakLine();
      this.mustBreakBetween();
      this._visit(ctx.RCURLY());
    } else {
      this._visit(ctx.matchMode());
      this._visit(ctx.patternList());
      this._visit(ctx.whereClause());
      this._visit(ctx.RCURLY());
    }
  };

  visitCaseAlternative = (ctx: CaseAlternativeContext) => {
    const wholeAlternativeGrp = this.startGroup();
    const indentId1 = this.addIndentation();
    this._visit(ctx.WHEN());
    const indentId2 = this.addIndentation();
    this._visit(ctx.expression(0));
    const thenGrp = this.startGroup();
    this._visit(ctx.THEN());
    const indentId3 = this.addIndentation();
    this._visit(ctx.expression(1));
    this.removeIndentation(indentId3);
    this.removeIndentation(indentId2);
    this.endGroup(thenGrp);
    this.removeIndentation(indentId1);
    this.endGroup(wholeAlternativeGrp);
  };

  // Handled separately since cases want newlines
  visitCaseExpression = (ctx: CaseExpressionContext) => {
    const wholeCaseGrp = this.startGroup();
    this.mustBreakBetween();
    this.visit(ctx.CASE());
    const n = ctx.caseAlternative_list().length;
    for (let i = 0; i < n; i++) {
      this.mustBreakBetween();
      this.visit(ctx.caseAlternative(i));
    }
    if (ctx.ELSE()) {
      const elseGrp = this.startGroup();
      const indent1 = this.addIndentation();
      this.mustBreakBetween();
      this._visit(ctx.ELSE());
      const indent2 = this.addIndentation();
      this.avoidBreakBetween();
      this.visit(ctx.expression());
      this.removeIndentation(indent2);
      this.removeIndentation(indent1);
      this.endGroup(elseGrp);
    }
    this.mustBreakBetween();
    this.visit(ctx.END());
    this.endGroup(wholeCaseGrp);
  };

  visitExtendedCaseAlternative = (ctx: ExtendedCaseAlternativeContext) => {
    const indentId = this.addIndentation();
    const wholeAlternativeGrp = this.startGroup();
    this._visit(ctx.WHEN());
    const indentId2 = this.addIndentation();
    const n = ctx.extendedWhen_list().length;
    for (let i = 0; i < n; i++) {
      this.visit(ctx.extendedWhen(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
    }
    const thenGrp = this.startGroup();
    this._visit(ctx.THEN());
    const indentId3 = this.addIndentation();
    this._visit(ctx.expression());
    this.removeIndentation(indentId3);
    this.removeIndentation(indentId2);
    this.endGroup(thenGrp);
    this.removeIndentation(indentId);
    this.endGroup(wholeAlternativeGrp);
  };

  visitExtendedCaseExpression = (ctx: ExtendedCaseExpressionContext) => {
    const wholeCaseGrp = this.startGroup();
    this.mustBreakBetween();
    this.visit(ctx.CASE());
    this.avoidBreakBetween();
    this._visit(ctx.expression(0));
    this.mustBreakBetween();
    const n = ctx.extendedCaseAlternative_list().length;
    for (let i = 0; i < n; i++) {
      this.mustBreakBetween();
      this.visit(ctx.extendedCaseAlternative(i));
    }
    if (ctx.ELSE()) {
      const elseGrp = this.startGroup();
      const indentId2 = this.addIndentation();
      this.mustBreakBetween();
      this._visit(ctx.ELSE());
      const indentId3 = this.addIndentation();
      this.visit(ctx.expression(1));
      this.removeIndentation(indentId3);
      this.removeIndentation(indentId2);
      this.endGroup(elseGrp);
    }
    this.mustBreakBetween();
    this._visit(ctx.END());
    this.endGroup(wholeCaseGrp);
  };

  // Handled separately because it wants indentation and line breaks
  visitSubqueryClause = (ctx: SubqueryClauseContext) => {
    this._visit(ctx.OPTIONAL());
    this._visit(ctx.CALL());
    this._visit(ctx.subqueryScope());
    this._visit(ctx.LCURLY());
    const indentId = this.addIndentation();
    this.breakLine();
    this._visit(ctx.regularQuery());
    this.removeIndentation(indentId);
    this.breakLine();
    this._visit(ctx.RCURLY());
    this._visit(ctx.subqueryInTransactionsParameters());
  };

  // Handled separately because UNION wants to look a certain way
  visitRegularQuery = (ctx: RegularQueryContext) => {
    this._visit(ctx.singleQuery(0));
    const n = ctx.singleQuery_list().length - 1;
    for (let i = 0; i < n; i++) {
      const indentId = this.addIndentation();
      this.breakLine();
      this._visit(ctx.UNION(i));
      this.removeIndentation(indentId);
      if (ctx.ALL(i)) {
        this._visit(ctx.ALL(i));
      } else if (ctx.DISTINCT(i)) {
        this._visit(ctx.DISTINCT(i));
      }
      this.breakLine();
      this._visit(ctx.singleQuery(i + 1));
    }
  };

  visitNormalizeFunction = (ctx: NormalizeFunctionContext) => {
    this._visitTerminalRaw(ctx.NORMALIZE());
    this.avoidSpaceBetween();
    this.avoidBreakBetween();
    this._visit(ctx.LPAREN());
    const normalizeGrp = this.startGroup();
    this.avoidBreakBetween();
    this.avoidSpaceBetween();
    this._visit(ctx.expression());
    if (ctx.COMMA()) {
      this._visit(ctx.COMMA());
      this._visit(ctx.normalForm());
    }
    this._visit(ctx.RPAREN());
    this.endGroup(normalizeGrp);
  };

  visitTrimFunction = (ctx: TrimFunctionContext) => {
    this._visitTerminalRaw(ctx.TRIM());
    this.avoidSpaceBetween();
    this.avoidBreakBetween();
    this._visit(ctx.LPAREN());
    this.avoidBreakBetween();
    const trimGrp = this.startGroup();
    this._visit(ctx.BOTH());
    this._visit(ctx.LEADING());
    this._visit(ctx.TRAILING());
    this._visit(ctx._trimCharacterString);
    this._visit(ctx.FROM());
    this._visit(ctx._trimSource);
    this._visit(ctx.RPAREN());
    this.endGroup(trimGrp);
  };

  visitFunctionInvocation = (ctx: FunctionInvocationContext) => {
    const functionNameGrp = this.startGroup();
    this._visit(ctx.functionName());
    this.endGroup(functionNameGrp);
    this.avoidSpaceBetween();
    this.avoidBreakBetween();
    this._visit(ctx.LPAREN());
    const indentId = this.addIndentation();
    const invocationGrp = this.startGroup();
    if (ctx.DISTINCT() || ctx.ALL()) {
      this.avoidSpaceBetween();
    }
    this._visit(ctx.ALL());
    this._visit(ctx.DISTINCT());
    const allFunctionArgsGrp = this.startGroup();
    const n = ctx.functionArgument_list().length;
    for (let i = 0; i < n; i++) {
      // Don't put a space between the ( and the first argument
      if (i == 0 && !ctx.DISTINCT() && !ctx.ALL()) {
        this.avoidSpaceBetween();
      }
      const functionArgGrp = this.startGroup();
      this._visit(ctx.functionArgument(i));
      if (i < n - 1) {
        this._visit(ctx.COMMA(i));
      }
      this.endGroup(functionArgGrp);
    }
    this.endGroup(allFunctionArgsGrp);
    this.endGroup(invocationGrp);
    this.avoidSpaceBetween();
    this.removeIndentation(indentId);
    this._visitTerminalRaw(ctx.RPAREN(), {
      dontConcatenate: true,
      spacingChoice: 'SPACE_AFTER',
    });
  };

  visitMergeClause = (ctx: MergeClauseContext) => {
    this._visit(ctx.MERGE());
    const indentId = this.addIndentation();
    const patternGrp = this.startGroup();
    this._visit(ctx.pattern());
    this.removeIndentation(indentId);
    this.endGroup(patternGrp);
    const n = ctx.mergeAction_list().length;
    for (let i = 0; i < n; i++) {
      this._visit(ctx.mergeAction(i));
    }
  };

  // Handled separately because it wants indentation
  // https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-indentation-and-line-breaks
  visitMergeAction = (ctx: MergeActionContext) => {
    const indentId = this.addIndentation();
    this.breakAndVisitChildren(ctx);
    this.removeIndentation(indentId);
  };

  visitSetClause = (ctx: SetClauseContext) => {
    this._visit(ctx.SET());
    this.avoidBreakBetween();
    const n = ctx.setItem_list().length;
    const setClauseGrp = this.startGroup();
    for (let i = 0; i < n; i++) {
      const setItemGrp = this.startGroup();
      this._visit(ctx.setItem(i));
      if (i < n - 1) {
        this._visit(ctx.COMMA(i));
      }
      this.endGroup(setItemGrp);
    }
    this.endGroup(setClauseGrp);
  };

  // Map has its own formatting rules, see:
  // https://neo4j.com/docs/cypher-manual/current/styleguide/#cypher-styleguide-spacing
  visitMap = (ctx: MapContext) => {
    const wholeMapGrp = this.startGroup();
    this._visit(ctx.LCURLY());
    const indentId = this.addIndentation();
    this.avoidSpaceBetween();
    const mapGrp = this.startGroup();
    const n = ctx.expression_list().length;
    for (let i = 0; i < n; i++) {
      const keyValueGrp = this.startGroup();
      this._visit(ctx.propertyKeyName(i));
      const indentId2 = this.addIndentation();
      this._visitTerminalRaw(ctx.COLON(i));
      this._visit(ctx.expression(i));
      if (i < n - 1) {
        this._visit(ctx.COMMA(i));
      }
      this.endGroup(keyValueGrp);
      this.removeIndentation(indentId2);
    }
    this.endGroup(mapGrp);
    this.avoidSpaceBetween();
    this.removeIndentation(indentId);
    this._visitTerminalRaw(ctx.RCURLY(), {
      dontConcatenate: true,
      spacingChoice: 'SPACE_AFTER',
    });
    this.endGroup(wholeMapGrp);
  };

  visitMapProjectionElement = (ctx: MapProjectionElementContext) => {
    if (ctx.propertyKeyName()) {
      const grp = this.startGroup();
      this.visit(ctx.propertyKeyName());
      this.visit(ctx.COLON());
      const indentId = this.addIndentation();
      this.visit(ctx.expression());
      this.endGroup(grp);
      this.removeIndentation(indentId);
    } else {
      this.visitChildren(ctx);
    }
  };

  visitMapProjection = (ctx: MapProjectionContext) => {
    const mapWrappingGrp = this.startGroup();
    this._visit(ctx.variable());
    this.avoidBreakBetween();
    this._visit(ctx.LCURLY());
    const indentId = this.addIndentation();
    this.avoidSpaceBetween();
    const mapProjectionGrp = this.startGroup();
    const n = ctx.mapProjectionElement_list().length;
    for (let i = 0; i < n; i++) {
      this._visit(ctx.mapProjectionElement(i));
      if (i < n - 1) {
        this._visit(ctx.COMMA(i));
      }
    }
    this.endGroup(mapProjectionGrp);
    this.removeIndentation(indentId);
    this.avoidSpaceBetween();
    this._visitTerminalRaw(ctx.RCURLY(), {
      dontConcatenate: true,
      spacingChoice: 'SPACE_AFTER',
    });
    this.endGroup(mapWrappingGrp);
  };

  visitListItemsPredicate = (ctx: ListItemsPredicateContext) => {
    const wholeListItemGrp = this.startGroup();
    this._visitTerminalRaw(ctx.ALL());
    this._visitTerminalRaw(ctx.ANY());
    this._visitTerminalRaw(ctx.NONE());
    this._visitTerminalRaw(ctx.SINGLE());
    this._visit(ctx.LPAREN());
    const indentId = this.addIndentation();
    this.concatenate();
    this.avoidSpaceBetween();
    const listGrp = this.startGroup();
    this._visit(ctx.variable());
    const inExprGrp = this.startGroup();
    this._visit(ctx.IN());
    this._visit(ctx._inExp);
    this.endGroup(inExprGrp);
    if (ctx.WHERE()) {
      const whereGrp = this.startGroup();
      this._visit(ctx.WHERE());
      const indentId = this.addIndentation();
      this._visit(ctx._whereExp);
      this.endGroup(whereGrp);
      this.removeIndentation(indentId);
    }
    this.endGroup(listGrp);
    this.removeIndentation(indentId);
    this.avoidSpaceBetween();
    this._visitTerminalRaw(ctx.RPAREN(), {
      dontConcatenate: true,
      spacingChoice: 'SPACE_AFTER',
    });
    this.endGroup(wholeListItemGrp);
  };

  visitListLiteral = (ctx: ListLiteralContext) => {
    this._visit(ctx.LBRACKET());
    const indentId = this.addIndentation();
    const listGrp = this.startGroup();
    const n = ctx.expression_list().length;
    for (let i = 0; i < n; i++) {
      const listElemGrp = this.startGroup();
      this._visit(ctx.expression(i));
      if (i < n - 1) {
        this._visit(ctx.COMMA(i));
      }
      if (i === n - 1) {
        this.avoidSpaceBetween();
      }
      this.endGroup(listElemGrp);
    }
    this.endGroup(listGrp);
    this.avoidSpaceBetween();
    this.removeIndentation(indentId);
    this._visitTerminalRaw(ctx.RBRACKET(), {
      dontConcatenate: true,
      spacingChoice: 'SPACE_AFTER',
    });
  };

  visitForeachClause = (ctx: ForeachClauseContext) => {
    this._visit(ctx.FOREACH());
    this._visit(ctx.LPAREN());
    this._visit(ctx.variable());
    this._visit(ctx.IN());
    this._visit(ctx.expression());
    this._visit(ctx.BAR());

    const n = ctx.clause_list().length;
    const indentId = this.addIndentation();
    for (let i = 0; i < n; i++) {
      this._visit(ctx.clause(i));
    }
    this.removeIndentation(indentId);
    this.breakLine();
    this._visit(ctx.RPAREN());
  };

  visitProcedureName = (ctx: ProcedureNameContext) => {
    const procedureNameGrp = this.startGroup();
    this._visit(ctx.namespace());
    this._visit(ctx.symbolicNameString());
    this.endGroup(procedureNameGrp);
  };

  visitCallClause = (ctx: CallClauseContext) => {
    this._visit(ctx.OPTIONAL());
    this._visit(ctx.CALL());
    const indentId = this.addIndentation();
    const callGrp = this.startGroup();
    const procedureNameGrp = this.startGroup();
    this._visit(ctx.procedureName());
    this.endGroup(procedureNameGrp);
    const functionGrp = this.startGroup();
    const n = ctx.procedureArgument_list().length;
    if (ctx.LPAREN()) {
      this.avoidSpaceBetween();
      this.avoidBreakBetween();
      this._visit(ctx.LPAREN());
      this.avoidSpaceBetween();
    }
    const indentId2 = this.addIndentation();
    let argGrp: number;
    if (n > 0) {
      argGrp = this.startGroup();
    }
    let commaIdx = 0;
    for (let i = 0; i < n; i++) {
      if (i === 0) {
        this.avoidSpaceBetween();
      }
      this._visit(ctx.procedureArgument(i));
      if (i < n - 1) {
        this._visit(ctx.COMMA(commaIdx));
        commaIdx++;
      }
    }
    if (n > 0) {
      this.endGroup(argGrp);
    }
    this.endGroup(functionGrp);
    this.removeIndentation(indentId2);
    if (ctx.RPAREN()) {
      this.avoidSpaceBetween();
      this._visitTerminalRaw(ctx.RPAREN(), {
        dontConcatenate: true,
        spacingChoice: 'SPACE_AFTER',
      });
    }
    if (ctx.YIELD()) {
      const yieldGrp = this.startGroup();
      const m = ctx.procedureResultItem_list().length;
      this._visit(ctx.YIELD());
      if (ctx.TIMES()) {
        this._visit(ctx.TIMES());
        if (m > 1) {
          this._visit(ctx.COMMA(commaIdx));
          commaIdx++;
        }
      }
      if (m > 0) {
        const procedureListGrp = this.startGroup();
        for (let i = 0; i < m; i++) {
          this._visit(ctx.procedureResultItem(i));
          if (i < m - 1) {
            this._visit(ctx.COMMA(commaIdx));
            commaIdx++;
          }
        }
        this.endGroup(procedureListGrp);
      }
      this.endGroup(yieldGrp);
      this._visit(ctx.whereClause());
    }
    this.endGroup(callGrp);
    this.removeIndentation(indentId);
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
  const { tree, tokens, unParseable, firstUnParseableToken } =
    getParseTreeAndTokens(query);

  tokens.fill();
  const visitor = new TreePrintVisitor(
    tokens,
    tree,
    query,
    unParseable,
    firstUnParseableToken,
  );

  if (cursorPosition === undefined) return visitor.format();

  if (cursorPosition >= query.length || cursorPosition <= 0) {
    const result = visitor.format();
    return {
      formattedString: result,
      newCursorPos: cursorPosition === 0 ? 0 : result.length,
    };
  }

  const targetToken = findTargetToken(tokens.tokens, cursorPosition);
  if (!targetToken) {
    return {
      formattedString: visitor.format(),
      newCursorPos: 0,
    };
  }
  const relativePosition = cursorPosition - targetToken.start;
  visitor.targetToken = targetToken.tokenIndex;

  return {
    formattedString: visitor.format(),
    newCursorPos: visitor.cursorPos + relativePosition,
  };
}
