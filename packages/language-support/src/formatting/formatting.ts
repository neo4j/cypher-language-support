import { CommonTokenStream, ParserRuleContext, TerminalNode } from 'antlr4';
import { default as CypherCmdLexer } from '../generated-parser/CypherCmdLexer';
import {
  BooleanLiteralContext,
  CaseExpressionContext,
  ClauseContext,
  CountStarContext,
  ExistsExpressionContext,
  ExtendedCaseExpressionContext,
  FunctionInvocationContext,
  KeywordLiteralContext,
  LabelExpressionContext,
  MapContext,
  MergeActionContext,
  MergeClauseContext,
  NamespaceContext,
  NodePatternContext,
  NumberLiteralContext,
  ParameterContext,
  PropertyContext,
  RegularQueryContext,
  RelationshipPatternContext,
  StatementsOrCommandsContext,
  SubqueryClauseContext,
  WhereClauseContext,
} from '../generated-parser/CypherCmdParser';
import CypherCmdParserVisitor from '../generated-parser/CypherCmdParserVisitor';
import {
  doesNotWantSpace,
  findTargetToken,
  getParseTreeAndTokens,
  handleMergeClause,
  isComment,
  wantsToBeConcatenated,
  wantsToBeUpperCase,
} from './formattingHelpers';

interface RawTerminalOptions {
  lowerCase?: boolean;
  upperCase?: boolean;
  space?: boolean;
}

interface Chunk {
  text: string;
  node?: TerminalNode;
  start: number;
  end: number;
  splitObligationAfter?: Split;
  noSpace?: boolean;
  isComment?: boolean;
  indentation?: Indentation;
}

interface Split {
  splitType: ' ' | '\n' | '';
  cost: number;
  newIndentation?: Indentation;
}

interface Choice {
  left: Chunk;
  right: Chunk;
  // The possible splits that the linewrapper can choose
  possibleSplitChoices: Split[];
  // Possible policies that we could add at this step
  //policies: Policy[];
}

interface Decision {
  indentation: number;
  left: Chunk;
  right: Chunk;
  split: Split; // The split that was chosen
}

// Should be applied to future decisions up until the expire token.
// TODO: can be used for e.g. making sure that all function arguments stay on the same line
// or that they all break
//
//interface Policy {
//  f: (s: Split[]) => Split[];
//  expire: Chunk;
//}

interface Indentation {
  spaces: number;
  expire: Chunk;
}

// O(n*MAX_COL)
interface State {
  column: number;
  choiceIndex: number;
  //policies: Policy[];
  indentation: number;
  indentations: Indentation[];
}

interface Result {
  cost: number;
  decisions: Decision[];
  indentations: Indentation[];
}

const MAX_COLUMN = 80;

function dfs(state: State, choices: Choice[]): Result {
  if (state.choiceIndex === choices.length) {
    return { cost: 0, decisions: [], indentations: state.indentations };
  }
  const choice = choices[state.choiceIndex];
  if (choice.left.indentation) {
    state.indentations.push(choice.left.indentation);
    state.indentation += choice.left.indentation.spaces;
  }
  if (state.choiceIndex === choices.length - 1 && choice.right.indentation) {
    state.indentations.push(choice.right.indentation);
    state.indentation += choice.right.indentation.spaces;
  }
  state.indentations = state.indentations.filter((indentation) => {
    if (indentation.expire === choices[state.choiceIndex].left
      || (state.choiceIndex === choices.length - 1 && indentation.expire === choices[state.choiceIndex].right)) {
      state.indentation -= indentation.spaces;
    }
    return indentation.expire !== choices[state.choiceIndex].left
      && !(state.choiceIndex === choices.length - 1 && indentation.expire === choices[state.choiceIndex].right);
  });
  const startOfLine = state.column === 0;
  if (startOfLine) {
    state.column = state.indentation;
  }
  const endColumn = state.column + choice.left.text.length;
  const OOBCost = Math.max(0, endColumn - MAX_COLUMN) * 10;
  const currentCost = OOBCost;
  const possibleResults: Result[] = choice.possibleSplitChoices.map((split) => {
    const newIndentations = split.newIndentation
      ? [...state.indentations, split.newIndentation]
      : state.indentations;
    const newState = {
      column: split.splitType === '\n' ? 0 : endColumn + 1,
      choiceIndex: state.choiceIndex + 1,
      indentation:
        state.indentation +
        (split.newIndentation ? split.newIndentation.spaces : 0),
      indentations: newIndentations,
    };
    const result = dfs(newState, choices);
    return {
      cost: split.cost + result.cost,
      decisions: [
        {
          indentation: startOfLine ? state.indentation : 0,
          left: choice.left,
          right: choice.right,
          split,
        },
        ...result.decisions,
      ],
      indentations: result.indentations,
    };
  });
  const bestResult = possibleResults.reduce((best, current) => {
    if (current.cost < best.cost) {
      return current;
    }
    return best;
  });
  return {
    cost: currentCost + bestResult.cost,
    decisions: bestResult.decisions,
    indentations: bestResult.indentations,
  };
}

export class TreePrintVisitor extends CypherCmdParserVisitor<void> {
  buffers: Chunk[][] = [];
  currentBuffer: Chunk[] = [];
  // Keep track of which chunks start indentation, so we can fill out the correct
  // expiration token for that indentation.
  indentationStarters: number[][] = [];
  indentation = 0;
  indentationSpaces = 2;
  targetToken?: number;
  cursorPos?: number;

  constructor(private tokenStream: CommonTokenStream) {
    super();
  }

  format = (root: StatementsOrCommandsContext) => {
    this.visit(root);
    if (this.currentBuffer.length > 0) {
      this.buffers.push(this.currentBuffer);
    }
    let formatted = '';
    let indentations: Indentation[] = [];
    for (const chunkList of this.buffers) {
      if (chunkList.length === 1) {
        formatted += chunkList[0].text + '\n';
        continue;
      }
      // TODO: popping this :D
      while (chunkList.length > 21) {
        chunkList.pop();
      }
      const basicSplits = [
        { splitType: ' ', cost: 0 },
        { splitType: '\n', cost: 1 },
      ];
      const basicNoSpaceSplits = [
        { splitType: '', cost: 0 },
        { splitType: '\n', cost: 1 },
      ];
      const choices: Choice[] = chunkList
        .map((chunk, index) => {
          if (index === chunkList.length - 1) {
            return null;
          }
          return {
            left: chunk,
            right: chunkList[index + 1],
            possibleSplitChoices: chunk.splitObligationAfter
              ? [chunk.splitObligationAfter]
              : (doesNotWantSpace(chunk.node) || chunk.noSpace) && !chunkList[index + 1].isComment
                ? basicNoSpaceSplits
                : basicSplits,
          };
        })
        .filter((choice) => choice !== null) as Choice[];
      // Indentation should carry over
      const indentation = indentations.reduce((acc, indentation) => acc + indentation.spaces, 0);
      const initialState: State = {
        column: indentation,
        choiceIndex: 0,
        indentation,
        indentations,
      };

      const result = dfs(initialState, choices);
      indentations = result.indentations;
      const buffer = [];
      result.decisions.forEach((decision) => {
        buffer.push(' '.repeat(decision.indentation));
        buffer.push(decision.left.text);
        buffer.push(decision.split.splitType);
      });
      buffer.push(choices.at(-1).right.text);
      formatted += buffer.join('') + '\n';
    }
    if (indentations.length > 0) {
      throw new Error('indentations left');
    }
    return formatted.trim();
  };

  breakLine = () => {
    if (this.currentBuffer.length > 0)
      this.buffers.push(this.currentBuffer), (this.currentBuffer = []);
  };

  // If two tokens should never be split, concatenate them into one chunk
  concatenate = () => {
    // Loop since we might have (multiple) comments anywhere, e.g. [b, C, C, a, C]
    // but we should still be able to concatenate a, b to ba
    const indices = [];
    for (let i = this.currentBuffer.length - 1; i >= 0; i--) {
      if (!this.currentBuffer[i].isComment) {
        indices.push(i);
        if (indices.length === 2) {
          break;
        }
      }
    }
    if (indices.length < 2) {
      return;
    }
    const suffix = this.currentBuffer.splice(indices[0], 1)[0];
    const prefix = this.currentBuffer[indices[1]];
    const chunk: Chunk = {
      text: prefix.text + suffix.text,
      start: prefix.start,
      end: prefix.end + suffix.text.length,
    };
    this.currentBuffer[indices[1]] = chunk;
  };

  // If the previous token should choose between a newline or no space, rather than
  // a newline and a space
  avoidSpaceBetween = () => {
    let idx = this.currentBuffer.length - 1;
    while (idx >= 0 && this.currentBuffer[idx].isComment) {
      idx--;
    }
    if (idx < 0) {
      return;
    }
    this.currentBuffer[idx].noSpace = true;
  }

  addIndentation = () => {
    if (this.currentBuffer.length === 0) {
      throw new Error('Trying to add indentation to empty buffer');
    }
    this.indentationStarters.push([this.buffers.length, this.currentBuffer.length - 1]);
  }

  removeIndentation = () => {
    const [bufferIdx, idxInBuffer] = this.indentationStarters.pop();
    const buffer = bufferIdx === this.buffers.length ? this.currentBuffer : this.buffers[bufferIdx];
    const chunk = buffer[idxInBuffer];
    chunk.indentation = {
      spaces: this.indentationSpaces,
      expire: this.currentBuffer[this.currentBuffer.length - 1],
    }
  }

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
      this.currentBuffer.push(chunk);
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
        splitObligationAfter: {
          splitType: '\n',
          cost: 0,
        },
        isComment: true,
      };
      this.currentBuffer.push(chunk);
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
    if (this.buffers.length === 0) {
      this.addCommentsBefore(node);
    }
    if (node.symbol.type === CypherCmdLexer.EOF) {
      return;
    }
    if (node.symbol.tokenIndex === this.targetToken) {
      this.cursorPos = this.buffers.join('').length;
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
    this.currentBuffer.push(chunk);
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
    if (this.buffers.length === 0) {
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
      // TODO: broken
    }
    const chunk: Chunk = {
      text: result,
      node,
      start: node.symbol.start,
      end: node.symbol.stop + 1,
      splitObligationAfter: {
        splitType: options?.space ? ' ' : '',
        cost: 0,
      },
    };
    this.currentBuffer.push(chunk);
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
      this.visit(ctx.LBRACKET());
      this.handleInnerPatternContext(ctx);
      this.visit(ctx.RBRACKET());
    }
    this.avoidSpaceBetween();
    this.visitTerminalRaw(arrowLineList[1].MINUS());
    this.visitIfNotNull(ctx.rightArrow());
  };

  // Handled separately because the dots aren't operators
  visitNamespace = (ctx: NamespaceContext) => {
    const n = ctx.DOT_list().length;
    for (let i = 0; i < n; i++) {
      this.visit(ctx.symbolicNameString(i));
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
    this.breakLine();
    this.removeIndentation();
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
    this.visitIfNotNull(ctx.DISTINCT());
    this.visitIfNotNull(ctx.ALL());
    const n = ctx.functionArgument_list().length;
    for (let i = 0; i < n; i++) {
      // Don't put a space between the ( and the first argument
      if (i == 0) {
        this.avoidSpaceBetween();
      }
      this.visit(ctx.functionArgument(i));
      if (i < n - 1) {
        this.visit(ctx.COMMA(i));
      }
    }
    this.visit(ctx.RPAREN());
  }

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
