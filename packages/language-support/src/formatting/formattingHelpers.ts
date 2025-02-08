import {
  CharStreams,
  CommonToken,
  CommonTokenStream,
  ErrorListener as ANTLRErrorListener,
  ParseTree,
  Recognizer,
  TerminalNode,
  Token,
} from 'antlr4';
import { default as CypherCmdLexer } from '../generated-parser/CypherCmdLexer';
import CypherCmdParser, {
  EscapedSymbolicNameStringContext,
  MergeClauseContext,
  UnescapedSymbolicNameString_Context,
} from '../generated-parser/CypherCmdParser';
import { lexerKeywords } from '../lexerSymbols';
import { Heap } from 'heap-js';

const MAX_COL = 80;

export interface Chunk {
  text: string;
  node?: TerminalNode;
  start: number;
  end: number;
  noSpace?: boolean;
  isComment?: boolean;
  indentation?: Indentation;
}

export interface Split {
  splitType: ' ' | '\n' | '';
  cost: number;
  newIndentation?: Indentation;
}

export interface Choice {
  left: Chunk;
  right: Chunk;
  // The possible splits that the linewrapper can choose
  possibleSplitChoices: Split[];
}

export interface Decision {
  indentation: number;
  left: Chunk;
  right: Chunk;
  split: Split; // The split that was chosen
}

export interface Indentation {
  spaces: number;
  expire: Chunk;
}

export interface State {
  column: number;
  choiceIndex: number;
  indentation: number;
  indentations: Indentation[];
  cost: number;
  edge: StateEdge;
}

interface StateEdge {
  prevState: State;
  decision: Decision;
}

export interface Result {
  cost: number;
  decisions: Decision[];
  indentations: Indentation[];
}


const openingCharacters = [
  CypherCmdLexer.LPAREN,
  CypherCmdLexer.LBRACKET,
  CypherCmdLexer.LCURLY,
  CypherCmdLexer.LT,
  CypherCmdLexer.DOT,
  CypherCmdLexer.GT,
];

const traillingCharacters = [
  CypherCmdLexer.SEMICOLON,
  CypherCmdLexer.COMMA,
  CypherCmdLexer.COLON,
  CypherCmdLexer.RPAREN,
  CypherCmdLexer.RBRACKET,
  CypherCmdLexer.RCURLY,
];

class FormatterErrorsListener implements ANTLRErrorListener<CommonToken> {
  syntaxError<T extends Token>(
    _r: Recognizer<CommonToken>,
    offendingSymbol: T,
    line: number,
    column: number,
  ) {
    throw new Error(
      `Could not format due to syntax error at line ${line}:${column} near "${offendingSymbol?.text}"`,
    );
  }
  public reportAmbiguity() {}
  public reportAttemptingFullContext() {}
  public reportContextSensitivity() {}
}

export function handleMergeClause(
  ctx: MergeClauseContext,
  visit: (node: ParseTree) => void,
) {
  visit(ctx.MERGE());
  visit(ctx.pattern());
  const mergeActions = ctx
    .mergeAction_list()
    .map((action, index) => ({ action, index }));
  mergeActions.sort((a, b) => {
    if (a.action.CREATE() && b.action.MATCH()) {
      return -1;
    } else if (a.action.MATCH() && b.action.CREATE()) {
      return 1;
    }
    return a.index - b.index;
  });
  mergeActions.forEach(({ action }) => {
    visit(action);
  });
}

export function wantsToBeUpperCase(node: TerminalNode): boolean {
  return isKeywordTerminal(node);
}

export function wantsToBeConcatenated(node: TerminalNode): boolean {
  return traillingCharacters.includes(node.symbol.type);
}

export function doesNotWantSpace(node: TerminalNode): boolean {
  if (!node) {
    return false;
  }
  return openingCharacters.includes(node.symbol.type);
}

function isKeywordTerminal(node: TerminalNode): boolean {
  return lexerKeywords.includes(node.symbol.type) && !isSymbolicName(node);
}

export function isComment(token: Token) {
  return (
    token.type === CypherCmdLexer.MULTI_LINE_COMMENT ||
    token.type === CypherCmdLexer.SINGLE_LINE_COMMENT
  );
}

// Variables or property names that have the same name as a keyword should not be
// treated as keywords
function isSymbolicName(node: TerminalNode): boolean {
  return (
    node.parentCtx instanceof UnescapedSymbolicNameString_Context ||
    node.parentCtx instanceof EscapedSymbolicNameStringContext
  );
}
export function getParseTreeAndTokens(query: string) {
  const inputStream = CharStreams.fromString(query);
  const lexer = new CypherCmdLexer(inputStream);
  const tokens = new CommonTokenStream(lexer);
  const parser = new CypherCmdParser(tokens);
  parser.removeErrorListeners();
  parser.addErrorListener(new FormatterErrorsListener());
  parser.buildParseTrees = true;
  const tree = parser.statementsOrCommands();
  return { tree, tokens };
}

export function findTargetToken(
  tokens: Token[],
  cursorPosition: number,
): Token | false {
  let targetToken: Token;
  for (const token of tokens) {
    if (token.channel === 0) {
      targetToken = token;
    }
    if (cursorPosition >= token.start && cursorPosition <= token.stop) {
      return targetToken;
    }
  }
  return false;
}

function constructResult(state: State): Result {
  const decisions: Decision[] = [];
  let currentState: State = state;
  while (currentState.edge != null) {
    decisions.push(currentState.edge.decision);
    currentState = currentState.edge.prevState;
  }
  decisions.reverse();
  return {
    cost: state.cost,
    decisions,
    indentations: state.indentations,
  };
}

function getNeighbourState(curr: State, choice: Choice, split: Split): State {
  const isBreak = split.splitType === '\n';
  const endColumn = isBreak ?
    choice.right.text.length :
    curr.column + choice.right.text.length;
  const OOBCost = Math.max(0, endColumn - MAX_COL) * 10;
  return {
    column: split.splitType === '\n' ? 0 : endColumn + 1,
    choiceIndex: curr.choiceIndex + 1,
    // TODO: indentation doesn't work atm
    indentation: curr.indentation,
    indentations: curr.indentations,
    cost: curr.cost + split.cost + OOBCost,
    edge: {
      prevState: curr,
      decision: {
        indentation: curr.indentation,
        left: choice.left,
        right: choice.right,
        split,
      },
    },
  }
}

export function bfs(startingState: State, choiceList: Choice[]): Result {
  const heap = new Heap<State>((a, b) => a.cost - b.cost);
  heap.push(startingState);
  while (heap.size() > 0) {
    const state = heap.pop();
    if (state.choiceIndex === choiceList.length) {
      return constructResult(state);
    }
    const choice = choiceList[state.choiceIndex];
    for (const split of choice.possibleSplitChoices) {
      const neighbourState = getNeighbourState(state, choice, split);
      heap.push(neighbourState);
    }
  }
  throw new Error('No solution found');
}

function decisionsToFormatted(decisions: Decision[]): string {
  const buffer = [];
  decisions.forEach((decision) => {
    buffer.push(' '.repeat(decision.indentation));
    buffer.push(decision.left.text);
    buffer.push(decision.split.splitType);
  });
  return buffer.join('').trim();
}

function chunkListToChoices(chunkList: Chunk[]): Choice[] {
  return chunkList
    .map((chunk, index) => {
      const currIsComment = chunk.isComment;
      const nextIsComment = chunkList[index + 1]?.isComment;
      const noSpace = doesNotWantSpace(chunk.node) || chunk.noSpace;
      let splits = noSpace && !nextIsComment ? basicNoSpaceSplits : basicSplits;
      if (currIsComment) {
        splits = [{ splitType: '\n', cost: 0 }];
      }
      return {
        left: chunk,
        right: index === chunkList.length - 1 ? emptyChunk : chunkList[index + 1],
        possibleSplitChoices: splits,
      };
    }) as Choice[];
}

export function buffersToFormattedString(buffers: Chunk[][]) {
  let formatted = '';
  let indentations: Indentation[] = [];
  for (const chunkList of buffers) {
    if (chunkList.length === 0) {
      continue;
    }
    if (chunkList.length === 1) {
      formatted += chunkList[0].text + '\n';
      continue;
    }
    const choices: Choice[] = chunkListToChoices(chunkList);
    // Indentation should carry over
    const indentation = indentations.reduce((acc, indentation) => acc + indentation.spaces, 0);
    const initialState: State = {
      column: indentation,
      choiceIndex: 0,
      indentation,
      indentations,
      cost: 0,
      edge: null,
    };
    const result = bfs(initialState, choices);
    indentations = result.indentations;
    formatted += decisionsToFormatted(result.decisions) + '\n';
  }
  if (indentations.length > 0) {
    throw new Error('indentations left');
  }
  return formatted.trim();
}

export const basicSplits = [
  { splitType: ' ', cost: 0 },
  { splitType: '\n', cost: 1 },
];
export const basicNoSpaceSplits = [
  { splitType: '', cost: 0 },
  { splitType: '\n', cost: 1 },
];

export const emptyChunk: Chunk = {
  text: '',
  start: 0,
  end: 0,
};
