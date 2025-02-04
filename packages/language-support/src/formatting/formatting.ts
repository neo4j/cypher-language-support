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
  LimitContext,
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
}

interface Chunk {
  text: string;
  node?: TerminalNode;
  start: number;
  end: number;
  splitObligationAfter?: Split;
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
}

const MAX_COLUMN = 80;

function dfs(state: State, choices: Choice[]): Result {
  if (state.choiceIndex === choices.length) {
    return { cost: 0, decisions: [] };
  }
  state.indentations = state.indentations.filter((indentation) => {
    if (indentation.expire === choices[state.choiceIndex].left) {
      state.indentation -= indentation.spaces;
    }
    return indentation.expire !== choices[state.choiceIndex].left;
  });
  const choice = choices[state.choiceIndex];
  const startOfLine = state.column === 0;
  if (startOfLine) {
    state.column = state.indentation;
  }
  const endColumn = state.column + choice.left.text.length;
  const OOBCost = Math.max(0, endColumn - MAX_COLUMN) * 10;
  const currentCost = OOBCost;
  const possibleResults = choice.possibleSplitChoices.map((split) => {
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

export class TreePrintVisitor extends CypherCmdParserVisitor<void> {
  buffers: Chunk[][] = [];
  currentBuffer: Chunk[] = [];
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
    for (const chunkList of this.buffers) {
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
              : doesNotWantSpace(chunk.node)
                ? basicNoSpaceSplits
                : basicSplits,
          };
        })
        .filter((choice) => choice !== null) as Choice[];
      const initialState: State = {
        column: 0,
        choiceIndex: 0,
        indentation: 0,
        indentations: [],
      };

      const result = dfs(initialState, choices);
      const buffer = [];
      result.decisions.forEach((decision) => {
        buffer.push(' '.repeat(decision.indentation));
        buffer.push(decision.left.text);
        buffer.push(decision.split.splitType);
      });
      buffer.push(choices.at(-1).right.text);
      formatted += buffer.join('') + '\n';
    }
    return formatted.trim();
  };

  breakLine = () => {
    if (this.currentBuffer.length > 0)
      this.buffers.push(this.currentBuffer), (this.currentBuffer = []);
  };

  // If two tokens should never be split, concatenate them into one chunk
  concatenate = () => {
    if (this.currentBuffer.length < 2) {
      return;
    }
    const last = this.currentBuffer.pop();
    const secondLast = this.currentBuffer.pop();
    const chunk: Chunk = {
      text: secondLast.text + last.text,
      start: secondLast.start,
      end: last.end,
    };
    this.currentBuffer.push(chunk);
  };

  addIndentation = () => this.indentation++;

  removeIndentation = () => this.indentation--;

  applyIndentation = () => {
    throw new Error('Not implemented');
    //for (let i = 0; i < this.indentation * this.indentationSpaces; i++) {
    //  this.buffer.push(' ');
    //}
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
      sdfklj;
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
        splitType: '',
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
    this.concatenate();
    this.visit(ctx.propertyKeyName());
    this.concatenate();
  };

  visitLimit = (ctx: LimitContext) => {
    this.breakLine();
    this.visitChildren(ctx);
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
    if (this.buffers.length > 0) {
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
const q0 = `
match (n)
where n.age > 10 and n.born > 10 and n.prop > 15 and n.otherprop > 20 and n.thirdprop > 50
return n`;

const q1 = `MATCH (p:Person)
WHERE p.name STARTS WITH 'A' OR p.name STARTS WITH 'B' OR p.name STARTS WITH 'C' OR p.age > 30 OR p.salary > 50000 OR p.experience > 10 OR p.position = 'Manager'
RETURN p`;

const q2 = `MATCH (e:Employee)
RETURN 
  CASE 
    WHEN e.salary > 100000 THEN 'High'
    WHEN e.salary > 50000 THEN 'Medium'
    WHEN e.salary > 30000 THEN 
      CASE 
        WHEN e.experience > 5 THEN 'Mid-Level'
        ELSE 'Low'
      END
    ELSE 'Entry-Level'
  END AS SalaryCategory`;

const q3 = `MATCH (o:Order)-[:CONTAINS]->(p:Product)
WITH o, p, COUNT(p) AS productCount, SUM(p.price) AS totalValue, AVG(p.discount) AS avgDiscount, MIN(p.price) AS minPrice, MAX(p.price) AS maxPrice
WHERE totalValue > 1000 AND productCount > 5
RETURN o, totalValue, avgDiscount`;

const q4 = `MATCH (c:Customer)-[:PURCHASED]->(o:Order)-[:CONTAINS]->(p:Product)
RETURN c.name, COLLECT({orderId: o.id, items: COLLECT({product: p.name, price: p.price, discount: p.discount})}) AS orderSummary`;

const q5 = `MATCH (a:Author)-[:WROTE]->(b:Book)-[:TRANSLATED_TO]->(t:Translation)-[:PUBLISHED_BY]->(p:Publisher)-[:LOCATED_IN]->(c:Country)
WHERE b.genre = 'Sci-Fi' AND p.name STARTS WITH 'P' AND c.region = 'Europe'
RETURN a.name, b.title, t.language, p.name, c.name`;

const q6 = `MATCH (c:Customer)
CALL {
  WITH c
  MATCH (c)-[:PURCHASED]->(o:Order)-[:CONTAINS]->(p:Product)
  RETURN COUNT(o) AS totalOrders, SUM(p.price) AS totalSpent, AVG(p.price) AS avgPrice, MAX(p.price) AS mostExpensiveItem
}
RETURN c.name, totalOrders, totalSpent, avgPrice, mostExpensiveItem`;

const q7 = `MATCH (c:Company)-[:EMPLOYS]->(e:Employee)
UNWIND e.projects AS project
UNWIND project.tasks AS task
RETURN c.name, e.name, task.name, COUNT(task.subtasks) AS totalSubtasks, SUM(task.hoursSpent) AS totalHours, AVG(task.complexity) AS avgComplexity`;

const q8 = `MATCH (p:Product)
WHERE p.category IN ['Electronics', 'Furniture', 'Clothing', 'Toys', 'Books', 'Appliances', 'Jewelry', 'Automotive', 'Beauty', 'Garden']
RETURN p`;

const q9 = `MERGE (a:Author {name: 'J.K. Rowling'})
ON CREATE SET a.birthYear = 1965, a.nationality = 'British', a.booksWritten = 7, a.netWorth = 1000000000, a.genre = 'Fantasy'
MERGE (b:Book {title: 'Harry Potter and the Sorcerers Stone'})
ON CREATE SET b.publishedYear = 1997, b.sales = 120000000, b.rating = 4.8, b.genre = 'Fantasy'
MERGE (a)-[:WROTE]->(b)
RETURN a, b`;

const queries = [q1, q2, q3, q4, q5, q6, q7, q8, q9];
//console.log('X'.repeat(MAX_COLUMN));
//for (const query of queries) {
//  console.log(formatQuery(query) + '\n');
//  console.log('X'.repeat(MAX_COLUMN));
//}

console.log('X'.repeat(MAX_COLUMN));
console.log(formatQuery(q0));
console.log(formatQuery(q1));
