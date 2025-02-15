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
const debug = false;
const showGroups = false;

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
  breakCost: number;
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
  oobCount: number;
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

function getNextIndent(currIndent: number, choice: Choice): number {
  if (choice.left.specialBehavior?.type === 'INDENT') {
    return currIndent + INDENTATION;
  }
  if (choice.left.specialBehavior?.type === 'DEDENT') {
    return currIndent - INDENTATION;
  }
  return currIndent;
}

function stateToString(state: State) {
  const result = reconstructBestPath(state);
  const resultString = decisionsToFormatted(result.decisions);
  return resultString;
}

function getNeighbourState(curr: State, choice: Choice, split: Split): State {
  const isBreak = split.splitType === '\n';
  const currIndent = curr.indentation;
  let nextIndent = getNextIndent(currIndent, choice);
  let finalIndent = curr.column === 0 ? currIndent : 0;
  if(curr.activeGroups.length > 0 && curr.column === 0) {
    finalIndent = curr.activeGroups.at(-1).align;
  }

  if(choice.left.isComment) {
    finalIndent = curr.column === 0 ? nextIndent: 0;
  }

  const actualColumn = curr.column === 0 ? finalIndent : curr.column;
  const thisWordEnd =
    actualColumn + choice.left.text.length + split.splitType.length;
  const OOBChars = Math.max(0, thisWordEnd - MAX_COL);

  const nextGroups = [...curr.activeGroups];
  if (choice.left.specialBehavior?.type === 'GROUP_END') {
    nextGroups.pop();
  }

  let extraCost = 0;
  if (isBreak && nextGroups.length > 0) {
    extraCost = nextGroups.at(-1).breakCost;
  } else if (isBreak && choice.right.specialBehavior?.type === 'GROUP_START') {
    extraCost = 20;
  } else if (isBreak) {
    extraCost = 1;
  } else {
    // Incentivize not breaking to avoid cases where we have longer lines after short
    // ones.
    extraCost = -1;
  }

  if (choice.left.specialBehavior?.type === 'GROUP_START') {
    nextGroups.push({
      align: actualColumn,
      breakCost: Math.pow(10, nextGroups.length + 1),
    });
  }



  return {
    activeGroups: nextGroups,
    column: isBreak ? 0 : thisWordEnd,
    choiceIndex: curr.choiceIndex + 1,
    indentation: nextIndent,
    cost: curr.cost + extraCost,
    oobCount: curr.oobCount + OOBChars,
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

function getStateKey(state: State): string {
  return `${state.column}-${state.choiceIndex}`;
}

function bestFirstSolnSearch(
  startingState: State,
  choiceList: Choice[],
): Result {
  const heap = new Heap<State>((a, b) => {
    if (a.oobCount !== b.oobCount) {
      return a.oobCount - b.oobCount;
    }
    return a.cost - b.cost;
  });
  heap.push(startingState);
  const seenStates = new Set<string>();
  while (heap.size() > 0) {
    const state = heap.pop();
    const stateKey = getStateKey(state);
    if (seenStates.has(stateKey)) {
      continue;
    }
    seenStates.add(stateKey);

    if (debug) {
      console.log('#'.repeat(MAX_COL));
      console.log(stateToString(state));
      console.log("Cost: ", state.cost);
      const specialText = choiceList[state.choiceIndex]?.left.specialBehavior?.type;
      const regularText = choiceList[state.choiceIndex]?.left.text;
      console.log("Next:", specialText || regularText);
      console.log(state.activeGroups);
    }
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

function addGroupsIfSet(buffer: String[], decision: Decision) {
  const specialType = decision.left.specialBehavior?.type;
  if (showGroups && (specialType === 'GROUP_START' || specialType === 'GROUP_END')) {
    const groupType = decision.left.specialBehavior?.type;
    buffer.push(groupType === 'GROUP_START' ? '[' : ']');
  }
}

function decisionsToFormatted(decisions: Decision[]): string {
  const buffer = [];
  decisions.forEach((decision) => {
    buffer.push(' '.repeat(decision.indentation));
    addGroupsIfSet(buffer, decision);
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
      splits = basicNoSpaceSplits;
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
      oobCount: 0,
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

export const groupStartChunk: Chunk = {
  text: '',
  start: -1,
  end: -1,
  specialBehavior: {
    type: 'GROUP_START',
  },
}

export const groupEndChunk: Chunk = {
  text: '',
  start: -1,
  end: -1,
  specialBehavior: {
    type: 'GROUP_END',
  },
}
