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
export const MAX_COL = 30;

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
  type: 'INDENT' | 'DEDENT' | 'GROUP_START' | 'GROUP_END';
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
  align: number;
  policy: Policy;
  breakCost: number;
}

interface Policy {
  split: ' ' | '\n';
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
  activeGroups: Group[];
  column: number;
  choiceIndex: number;
  indentation: number;
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
  indentation: number;
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

function getNeighbourState(curr: State, choice: Choice, split: Split): State {
  const isBreak = split.splitType === '\n';
  const currIndent = curr.indentation;
  let nextIndent = currIndent;
  if(choice.left.specialBehavior?.type === 'INDENT') {
    nextIndent += 2;
  }
  if(choice.left.specialBehavior?.type === 'DEDENT') {
    nextIndent -= 2;
  }
  let finalIndent = curr.column === 0 ? currIndent : 0;
  if(curr.activeGroups.length > 0 && curr.column === 0) {
    finalIndent = curr.activeGroups.at(-1).align;
  }

  const actualColumn = curr.column === 0 ? finalIndent : curr.column; // Broken
  const thisWordEnd =
    actualColumn + choice.left.text.length + split.splitType.length;
  const OOBCost = Math.max(0, thisWordEnd - MAX_COL) * 10000;

  const nextGroups = [...curr.activeGroups];
  if (choice.left.specialBehavior?.type === 'GROUP_START') {
    nextGroups.push({
      align: actualColumn,
      policy: { split: ' ' },
      breakCost: OOBCost,
    });
  }

  if (choice.left.specialBehavior?.type === 'GROUP_END') {
    nextGroups.pop();
  }

  return {
    activeGroups: nextGroups,
    column: isBreak ? 0 : thisWordEnd,
    choiceIndex: curr.choiceIndex + 1,
    indentation: nextIndent,
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
    indentation: state.indentation,
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
  let indentation: number = 0;
  for (const chunkList of buffers) {
    const choices: Choice[] = chunkListToChoices(chunkList);
    // Indentation should carry over
    const initialState: State = {
      activeGroups: [],
      column: 0,
      choiceIndex: 0,
      indentation,
      cost: 0,
      edge: null,
    };
    const result = bestFirstSolnSearch(initialState, choices);
    indentation = result.indentation;
    formatted += decisionsToFormatted(result.decisions) + '\n';
  }
  if (indentation > 0) {
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
  },
};

export const dedentChunk: Chunk = {
  text: '',
  start: -1,
  end: -1,
  specialBehavior: {
    type: 'DEDENT',
  },
};

const groupStartChunk: Chunk = {
  text: '',
  start: -1,
  end: -1,
  specialBehavior: {
    type: 'GROUP_START',
  },
}

const groupEndChunk: Chunk = {
  text: '',
  start: -1,
  end: -1,
  specialBehavior: {
    type: 'GROUP_END',
  },
}

const chunkList: Chunk[] = [
  {
    text: '',
    start: -1,
    end: -1,
    specialBehavior: { type: 'INDENT'}
  },
  {
    text: 'ON CREATE SET',
    start: 10,
    end: 12
  },
  groupStartChunk,
  groupStartChunk,
  groupStartChunk,
  { text: 'a.', start: 24, end: 30 },
  { text: 'prop', start: 24, end: 30 },
  groupEndChunk,
  {
    text: '=',
    start: 31,
    end: 32
  },
  { text: '0,', start: 33, end: 35 },
  groupEndChunk,
  groupStartChunk,
  groupStartChunk,
  { text: 'b.', start: 36, end: 42 },
  { text: 'prop', start: 36, end: 42 },
  groupEndChunk,
  {
    text: '=',
    start: 44,
    end: 45
  }, // 6
  { text: '7,', start: 46, end: 48 },
  groupEndChunk,
  groupStartChunk,
  groupStartChunk,
  { text: 'c.', start: 49, end: 55 },
  { text: 'prop', start: 49, end: 55 },
  groupEndChunk,
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
  groupEndChunk,
  {
    text: '',
    start: -1,
    end: -1,
    specialBehavior: { type: 'DEDENT'}
  },
  groupEndChunk
]

const result = buffersToFormattedString([chunkList]);
console.log('#'.repeat(MAX_COL));
console.log(result);
