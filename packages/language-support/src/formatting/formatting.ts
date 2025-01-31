import { CommonTokenStream, ParserRuleContext, TerminalNode } from 'antlr4';
import { default as CypherCmdLexer } from '../generated-parser/CypherCmdLexer';
import {
  ArrowLineContext,
  BooleanLiteralContext,
  CaseExpressionContext,
  ClauseContext,
  CountStarContext,
  ExistsExpressionContext,
  ExtendedCaseExpressionContext,
  KeywordLiteralContext,
  LabelExpressionContext,
  LeftArrowContext,
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
  RightArrowContext,
  StatementsOrCommandsContext,
  SubqueryClauseContext,
  WhereClauseContext,
} from '../generated-parser/CypherCmdParser';
import CypherCmdParserVisitor from '../generated-parser/CypherCmdParserVisitor';
import {
  findTargetToken,
  getParseTreeAndTokens,
  handleMergeClause,
  isComment,
  wantsSpaceAfter,
  wantsSpaceBefore,
  wantsToBeUpperCase,
} from './formattingHelpers';

// 40 characters                        |
const query = `
match (n)
where n.age > 10 and n.born > 10 and n.prop > 15 and n.otherprop > 20 and n.thirdprop > 50 and n.fourthprop > 100 and n.fifthprop > 200
return n`;
//
// 40 characters                        |

const twoands = `
MATCH (n)
WHERE n.age > 10 AND n.born > 10 AND 
      n.prop > 15 AND n.otherprop > 20 AND
      n.thirdprop > 50 AND n.fourthprop > 100 AND n.fifthprop > 200
return n`;

const threeands = `
MATCH (n)
WHERE n.age > 10 AND
      n.born > 10 AND 
      n.prop > 15 AND
      n.otherprop > 20 AND
      n.thirdprop > 50 AND
      n.fourthprop > 100 AND
      n.fifthprop > 200
return n`;

interface RawTerminalOptions {
  lowerCase?: boolean;
  upperCase?: boolean;
}

interface Chunk {
  text: string;
  start: number;
  end: number;
}

interface Split {
  splitType: ' ' | '\n';
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

interface State {
  column: number;
  choiceIndex: number;
  //policies: Policy[];
  indentation: number;
  indentations: Indentation[];
}

const queryex = `MATCHX(n)XWHEREXn.age > 10XANDXn.born > 10XANDXn.prop > 15XANDXn.otherprop > 20XANDXn.thirdprop > 50XANDXn.fourthprop > 100XANDXn.fifthprop > 200XRETURNXn`;
const split = queryex.split('X');
console.log(split)
const chunks: Chunk[] = split.map((text, index) => ({
  text,
  start: index,
  end: index + 1,
}));

const choices: Choice[] = chunks.map((chunk, index) => {
  if (index === split.length - 1) {
    return null;
  }
  return {
    left: chunk,
    right: chunks[index + 1],
    possibleSplitChoices: [
      { splitType: ' ', cost: 0, newIndentation: { spaces: 0, expire: chunk } },
      { splitType: '\n', cost: 1, newIndentation: { spaces: 0, expire: chunk } },
    ],
  };
}).filter((choice) => choice !== null) as Choice[];

const clausewords = ['MATCH', 'WHERE', 'RETURN'];

for (const choice of choices) {
  if (clausewords.includes(choice.right.text)) {
    choice.possibleSplitChoices = [{
      splitType: '\n',
      cost: 0,
    }]
  }
}

interface Result {
  cost: number;
  decisions: Decision[];
}

const MAX_COLUMN = 30;

function dfs(state: State): Result {
  if (state.choiceIndex === choices.length) {
    return { cost: 0, decisions: [] };
  }
  const choice = choices[state.choiceIndex];
  const endColumn = state.column + choice.left.text.length;
  const OOBCost = Math.max(0, endColumn - MAX_COLUMN) * 10;
  const currentCost = OOBCost;
  const possibleResults = choice.possibleSplitChoices.map((split) => {
    const newState = {
      column: split.splitType === '\n' ? 0 : endColumn + 1,
      choiceIndex: state.choiceIndex + 1,
      indentation: state.indentation,
      indentations: state.indentations
    };
    const result = dfs(newState);
    return {
      cost: split.cost + result.cost,
      decisions: [
        {
          left: choice.left,
          right: choice.right,
          split,
        },
        ...result.decisions,
      ],
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
  };
}

const initialState: State = {
  column: 0,
  choiceIndex: 0,
  indentation: 0,
  indentations: [],
};

const result = dfs(initialState);
console.log(result.cost);
const buffer = [];
result.decisions.forEach((decision) => {
  buffer.push(decision.left.text);
  buffer.push(decision.split.splitType);
});
console.log(buffer.join(''));


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
    // No trailing spaces.
    while (this.buffer.length > 0 && this.buffer.at(-1) === ' ') {
      this.buffer.pop();
    }
    if (this.buffer.length > 0 && this.buffer.at(-1) !== '\n') {
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
    if (
      this.buffer.length > 0 &&
      this.buffer[this.buffer.length - 1] === '\n'
    ) {
      this.applyIndentation();
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

  // Handled separately because the dollar should not be treated
  // as an operator
  visitParameter = (ctx: ParameterContext) => {
    this.visitTerminalRaw(ctx.DOLLAR());
    this.visit(ctx.parameterName());
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
    this.addSpace();
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
      this.breakLine();
      this.addIndentation();
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

  // Handled separately because we want ON CREATE before ON MATCH
  visitMergeClause = (ctx: MergeClauseContext) => {
    handleMergeClause(ctx, (node) => this.visit(node));
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
