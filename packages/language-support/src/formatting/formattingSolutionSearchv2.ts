/*
 * This file is a WIP of the second iteration of the Cypher formatter.
 */

import { Heap } from 'heap-js';
import CypherCmdLexer from '../generated-parser/CypherCmdLexer';
import { Chunk, MAX_COL, RegularChunk } from './formattingHelpersv2';

const INDENTATION = 2;
const showGroups = false;

export interface Split {
  splitType: ' ' | '\n' | '';
  cost: number;
}

export interface Choice {
  left: Chunk;
  right: Chunk;
  // The possible splits that the best first search can choose
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

export interface State {
  activeGroups: Group[];
  column: number;
  choiceIndex: number;
  baseIndentation: number;
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

interface FinalResultWithPos {
  formattedString: string;
  cursorPos?: number;
}

type FinalResult = string | FinalResultWithPos;

const openingCharacters = [CypherCmdLexer.LPAREN, CypherCmdLexer.LBRACKET];

export function doesNotWantSpace(chunk: Chunk): boolean {
  return (
    chunk.type === 'REGULAR' &&
    (chunk.noSpace ||
      (chunk.node && openingCharacters.includes(chunk.node.symbol.type)))
  );
}

function getNextIndent(currIndent: number, choice: Choice): number {
  if (choice.left.type === 'INDENT') {
    return currIndent + INDENTATION;
  }
  if (choice.left.type === 'DEDENT') {
    return currIndent - INDENTATION;
  }
  return currIndent;
}

function getIndentations(curr: State, choice: Choice): [number, number] {
  const currBaseIndent = curr.baseIndentation;
  const nextBaseIndent = getNextIndent(currBaseIndent, choice);
  let finalIndent = curr.column === 0 ? currBaseIndent : 0;
  if (curr.activeGroups.length > 0 && curr.column === 0) {
    finalIndent = curr.activeGroups.at(-1).align;
  }

  if (choice.left.type === 'COMMENT') {
    finalIndent = curr.column === 0 ? nextBaseIndent : 0;
  }
  return [nextBaseIndent, finalIndent];
}

// Very useful for debugging but not actually used in the code
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function stateToString(state: State) {
  const result = reconstructBestPath(state);
  const resultString = decisionsToFormatted(result.decisions);
  return resultString;
}

function getNeighbourState(curr: State, choice: Choice, split: Split): State {
  const isBreak = split.splitType === '\n';
  // A state has indentation, which is applied after a hard line break. However, if it has an
  // active group and we decided to split within a line, the alignment of that group takes precedence
  // over the base indentation.
  const [nextBaseIndent, finalIndent] = getIndentations(curr, choice);

  const actualColumn = curr.column === 0 ? finalIndent : curr.column;
  const splitLength = !isBreak ? split.splitType.length : 0;
  const leftLength =
    choice.left.type === 'COMMENT' || choice.left.type === 'REGULAR'
      ? choice.left.text.length
      : 0;
  const thisWordEnd = actualColumn + leftLength + splitLength;
  const OOBChars = Math.max(0, thisWordEnd - MAX_COL);

  const nextGroups = [...curr.activeGroups];
  if (choice.left.type === 'GROUP_END') {
    nextGroups.pop();
  }

  let extraCost = 0;
  if (isBreak && nextGroups.length > 0) {
    extraCost = nextGroups.at(-1).breakCost;
  } else if (isBreak) {
    extraCost = 1;
  } else {
    // Incentivize not breaking to avoid cases where we have longer lines after short
    // ones.
    extraCost = -1;
  }

  if (choice.left.type === 'GROUP_START') {
    const extraIndent = choice.left.extraIndent || 0;
    nextGroups.push({
      align: actualColumn + extraIndent,
      breakCost: Math.pow(10, nextGroups.length + 1),
    });
  }

  return {
    activeGroups: nextGroups,
    column: isBreak ? 0 : thisWordEnd,
    choiceIndex: curr.choiceIndex + 1,
    baseIndentation: nextBaseIndent,
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
    indentation: state.baseIndentation,
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
    // NOTE: This memoization is not perfect and can lead to suboptimal solutions.
    // It's crucial for performance however.
    const stateKey = getStateKey(state);
    if (seenStates.has(stateKey)) {
      continue;
    }
    seenStates.add(stateKey);

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
  throw new Error('Formatter could not find any solution. This is a bug.');
}

// Used for debugging only; it's very convenient to know where groups start and end
function addGroupsIfSet(buffer: string[], decision: Decision) {
  const leftType = decision.left.type;
  if (showGroups && (leftType === 'GROUP_START' || leftType === 'GROUP_END')) {
    const groupType = decision.left.type;
    buffer.push(groupType === 'GROUP_START' ? '[' : ']');
  }
}

function decisionsToFormatted(decisions: Decision[]): FinalResult {
  // TODO: This method strips out dangling whitespace at the end of lines.
  // It should not have to do this as that should not be possible
  // (related to the fact that special chunks should not be in the decision tree).
  const buffer: string[] = [];
  let cursorPos = -1;
  const pushIfNotEmpty = (s: string) => {
    if (s !== '') {
      buffer.push(s);
    }
  };
  decisions.forEach((decision) => {
    pushIfNotEmpty(' '.repeat(decision.indentation));
    const leftType = decision.left.type;
    if (
      (leftType === 'REGULAR' || leftType === 'COMMENT') &&
      decision.left.isCursor
    ) {
      cursorPos = buffer.join('').length;
    }
    pushIfNotEmpty(
      leftType === 'REGULAR' || leftType === 'COMMENT'
        ? decision.left.text
        : '',
    );
    addGroupsIfSet(buffer, decision);
    if (decision.split.splitType === '\n') {
      if (buffer.at(-1) === ' ') {
        buffer.pop();
      }
    }
    pushIfNotEmpty(decision.split.splitType);
  });
  const result = buffer.join('').trimEnd();
  if (cursorPos === -1) {
    return result;
  }
  return { formattedString: result, cursorPos: cursorPos };
}

function chunkListToChoices(chunkList: Chunk[]): Choice[] {
  return chunkList.map((chunk, index) => {
    const currIsComment = chunk.type === 'COMMENT';
    const nextIsComment = chunkList[index + 1]?.type === 'COMMENT';
    const noSpace = doesNotWantSpace(chunk);
    let splits = noSpace && !nextIsComment ? basicNoSpaceSplits : basicSplits;
    if (currIsComment) {
      splits = [{ splitType: '\n', cost: 0 }];
    }
    if (chunk.type !== 'REGULAR' && chunk.type !== 'COMMENT') {
      if (chunk.type === 'INDENT') {
        splits = [{ splitType: '\n', cost: 0 }];
      } else {
        splits = basicNoSpaceSplits;
      }
    }
    return {
      left: chunk,
      right: index === chunkList.length - 1 ? emptyChunk : chunkList[index + 1],
      possibleSplitChoices: splits,
    };
  });
}

export function buffersToFormattedString(
  buffers: Chunk[][],
): FinalResultWithPos {
  let formatted = '';
  let indentation: number = 0;
  let cursorPos = 0;
  for (const chunkList of buffers) {
    const choices: Choice[] = chunkListToChoices(chunkList);
    // Indentation should carry over
    const initialState: State = {
      activeGroups: [],
      column: 0,
      choiceIndex: 0,
      baseIndentation: indentation,
      cost: 0,
      oobCount: 0,
      edge: null,
    };
    const result = bestFirstSolnSearch(initialState, choices);
    indentation = result.indentation;
    const formattingResult = decisionsToFormatted(result.decisions);
    // Cursor is not in this chunkList
    if (typeof formattingResult === 'string') {
      formatted += formattingResult + '\n';
    } else {
      cursorPos = formatted.length + formattingResult.cursorPos;
      formatted += formattingResult.formattedString + '\n';
    }
  }
  if (indentation > 0) {
    throw new Error('Indentation remaining after formatting. This is a bug.');
  }
  return { formattedString: formatted.trimEnd(), cursorPos: cursorPos };
}

const basicSplits: Split[] = [
  { splitType: ' ', cost: 0 },
  { splitType: '\n', cost: 1 },
];
const basicNoSpaceSplits: Split[] = [
  { splitType: '', cost: 0 },
  { splitType: '\n', cost: 1 },
];

const emptyChunk: RegularChunk = {
  type: 'REGULAR',
  text: '',
};
