/*
 * This file is a WIP of the second iteration of the Cypher formatter.
 * It's being kept as a separate file to enable having two separate version at once
 * since it would be difficult to consolidate the new and the old version
 */

import {
  CharStreams,
  CommonTokenStream,
  ParseTree,
  TerminalNode,
  Token,
} from 'antlr4';
import { Heap } from 'heap-js';
import { default as CypherCmdLexer } from '../generated-parser/CypherCmdLexer';
import CypherCmdParser, {
  EscapedSymbolicNameStringContext,
  MergeClauseContext,
  UnescapedSymbolicNameString_Context,
} from '../generated-parser/CypherCmdParser';
import { lexerKeywords } from '../lexerSymbols';

const INDENTATION = 2;
export const MAX_COL = 80;

export interface Chunk {
  text: string;
  node?: TerminalNode;
  start: number;
  end: number;
  noSpace?: boolean;
  isComment?: boolean;
  specialBehavior?: SpecialChunkBehavior;
}

interface SpecialChunkBehavior {
  type: 'INDENT' | 'DEDENT';
  indentation: number;
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

interface Group {
  id: number;
  align: number;
  policies: Policy[];
  breakCost: number;
}

interface Policy {
  group: Group;
  split: Split;
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

// [Choice1, Choice2, Choice3]
//     ^
        //     ^

export interface State {
  column: number;
  choiceIndex: number;
  indentationRules: Indentation[];
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
  indentationRules: Indentation[];
}

const openingCharacters = [CypherCmdLexer.LPAREN, CypherCmdLexer.LBRACKET];

const traillingCharacters = [
  CypherCmdLexer.SEMICOLON,
  CypherCmdLexer.COMMA,
  CypherCmdLexer.COLON,
  CypherCmdLexer.RPAREN,
  CypherCmdLexer.RBRACKET,
];

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

function getIndentation(
  curr: State,
  choice: Choice,
  split: Split,
): [number, Indentation[]] {
  let currIndent = 0;
  const indentRules: Indentation[] = [];
  let dedentSkipped = false;
  for (const indentRule of curr.indentationRules) {
    if (
      !indentRule.expire.specialBehavior &&
      indentRule.expire === choice.left
    ) {
      continue;
    }
    if (
      indentRule.expire.specialBehavior?.type === 'DEDENT' &&
      choice.left.specialBehavior?.type === 'DEDENT' &&
      !dedentSkipped
    ) {
      dedentSkipped = true;
      continue;
    }
    currIndent += indentRule.spaces;
    indentRules.push(indentRule);
  }
  if (choice.left.specialBehavior) {
    if (choice.left.specialBehavior.type === 'INDENT') {
      currIndent += choice.left.specialBehavior.indentation;
      indentRules.push({
        spaces: choice.left.specialBehavior.indentation,
        expire: dedentChunk,
      });
    }
  }
  if (split.newIndentation && split.newIndentation.expire !== choice.left) {
    currIndent += split.newIndentation.spaces;
    indentRules.push(split.newIndentation);
  }
  return [currIndent, indentRules];
}

function getNeighbourState(curr: State, choice: Choice, split: Split): State {
  const isBreak = split.splitType === '\n';
  const [currIndent, indentRules] = getIndentation(curr, choice, split);
  const finalIndent = curr.column === 0 ? currIndent : 0;
  const actualColumn = curr.column === 0 ? currIndent : curr.column;
  const thisWordEnd =
    actualColumn + choice.left.text.length + split.splitType.length;
  const OOBCost = Math.max(0, thisWordEnd - MAX_COL) * 10000;

  return {
    column: isBreak ? 0 : thisWordEnd,
    choiceIndex: curr.choiceIndex + 1,
    indentationRules: indentRules,
    cost: curr.cost + split.cost + OOBCost,
    edge: {
      prevState: curr,
      decision: {
        indentation: finalIndent,
        left: choice.left,
        right: choice.right,
        split,
      },
    },
  };
}

function reconstructBestPath(state: State): Result {
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
    indentationRules: state.indentationRules,
  };
}

function bestFirstSolnSearch(
  startingState: State,
  choiceList: Choice[],
): Result {
  const heap = new Heap<State>((a, b) => a.cost - b.cost);
  heap.push(startingState);
  while (heap.size() > 0) {
    const state = heap.pop();
    // We found a solution. Since we do best first, it has to be the best
    // solution, so reconstruct that path of decisions
    if (state.choiceIndex === choiceList.length) {
      return reconstructBestPath(state);
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
  return buffer.join('').trimEnd();
}

function chunkListToChoices(chunkList: Chunk[]): Choice[] {
  return chunkList.map((chunk, index) => {
    const currIsComment = chunk.isComment;
    const nextIsComment = chunkList[index + 1]?.isComment;
    const noSpace = doesNotWantSpace(chunk.node) || chunk.noSpace;
    let splits = noSpace && !nextIsComment ? basicNoSpaceSplits : basicSplits;
    if (currIsComment) {
      splits = [{ splitType: '\n', cost: 0 }];
    }
    if (chunk.specialBehavior) {
      splits = [{ splitType: '', cost: 0 }];
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
  let indentationRules: Indentation[] = [];
  for (const chunkList of buffers) {
    const choices: Choice[] = chunkListToChoices(chunkList);
    // Indentation should carry over
    const initialState: State = {
      column: 0,
      choiceIndex: 0,
      indentationRules,
      cost: 0,
      edge: null,
    };
    const result = bestFirstSolnSearch(initialState, choices);
    indentationRules = result.indentationRules;
    formatted += decisionsToFormatted(result.decisions) + '\n';
  }
  if (indentationRules.length > 0) {
    throw new Error('indentations left');
  }
  return formatted.trimEnd();
}

const basicSplits = [
  { splitType: ' ', cost: 0 },
  { splitType: '\n', cost: 1 },
];
const basicNoSpaceSplits = [
  { splitType: '', cost: 0 },
  { splitType: '\n', cost: 1 },
];

const emptyChunk: Chunk = {
  text: '',
  start: 0,
  end: 0,
};

export const indentChunk: Chunk = {
  text: '',
  start: -1,
  end: -1,
  specialBehavior: {
    type: 'INDENT',
    indentation: INDENTATION,
  },
};

export const dedentChunk: Chunk = {
  text: '',
  start: -1,
  end: -1,
  specialBehavior: {
    type: 'DEDENT',
    indentation: INDENTATION,
  },
};

const chunkList: Chunk[] = [
  {
    text: '',
    start: -1,
    end: -1,
    specialBehavior: { type: 'INDENT', indentation: 2 }
  },
  {
    text: 'ON',
    start: 10,
    end: 12
  },
  {
    text: 'CREATE',
    start: 13,
    end: 19
  },
  {
    text: 'SET',
    start: 20,
    end: 23
  },
  { text: 'n.prop', start: 24, end: 30 },
  {
    text: '=',
    start: 31,
    end: 32
  },
  { text: '0,', start: 33, end: 35 },
  { text: 'b.prop', start: 36, end: 42 },
  {
    text: '=',
    start: 44,
    end: 45
  },
  { text: '7,', start: 46, end: 48 },
  { text: 'c.prop', start: 49, end: 55 },
  {
    text: '=',
    start: 56,
    end: 57
  },
  {
    text: '10',
    start: 58,
    end: 60
  },
  {
    text: '',
    start: -1,
    end: -1,
    specialBehavior: { type: 'DEDENT', indentation: 2 }
  }
]

const result = buffersToFormattedString([chunkList]);
console.log(result);
