/*
 * This file is a WIP of the second iteration of the Cypher formatter.
 */

import { Heap } from 'heap-js';
import CypherCmdLexer from '../generated-parser/CypherCmdLexer';
import {
  Chunk,
  isCommentBreak,
  MAX_COL,
  RegularChunk,
} from './formattingHelpersv2';

const errorMessage = `
Internal formatting error: An unexpected issue occurred while formatting.
This is likely a bug in the formatter itself. If possible, please report the issue
along with your input on GitHub:
https://github.com/neo4j/cypher-language-support.`.trim();

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
  chosenSplit: Split;
}

export interface State {
  activeGroups: Group[];
  column: number;
  choiceIndex: number;
  baseIndentation: number;
  cost: number;
  overflowingCount: number;
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
  cursorPos: number;
}

type FinalResult = string | FinalResultWithPos;

const openingCharacters = [CypherCmdLexer.LPAREN, CypherCmdLexer.LBRACKET];

export function doesNotWantSpace(chunk: Chunk, nextChunk: Chunk): boolean {
  return (
    nextChunk?.type !== 'COMMENT' &&
    chunk.type === 'REGULAR' &&
    (chunk.noSpace ||
      (chunk.node && openingCharacters.includes(chunk.node.symbol.type)))
  );
}

function getIndentations(curr: State, choice: Choice): [number, number] {
  const currBaseIndent = curr.baseIndentation;
  const nextBaseIndent =
    currBaseIndent + choice.left.modifyIndentation * INDENTATION;
  let finalIndent = curr.column === 0 ? currBaseIndent : 0;
  if (curr.activeGroups.length > 0 && curr.column === 0) {
    finalIndent = curr.activeGroups.at(-1).align;
  }

  // Align hard-break comments with the outermost group (usually the one that
  // aligns things with a clause)
  if (choice.left.type === 'COMMENT' && choice.left.breakBefore) {
    const lastGroup = curr.activeGroups.at(0);
    finalIndent = lastGroup ? lastGroup.align : nextBaseIndent;
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
  const nextGroups = [...curr.activeGroups];

  const [nextBaseIndent, finalIndent] = getIndentations(curr, choice);

  const actualColumn = curr.column === 0 ? finalIndent : curr.column;
  const splitLength = !isBreak ? split.splitType.length : 0;
  const leftLength =
    choice.left.type === 'COMMENT' || choice.left.type === 'REGULAR'
      ? choice.left.text.length
      : 0;
  const thisWordEnd = actualColumn + leftLength + splitLength;
  // We don't consider comments nor an empty space as overflowing
  const endWithoutCommentAndSplit =
    choice.left.type === 'COMMENT'
      ? actualColumn - 1
      : thisWordEnd - splitLength;
  const overflowingCount = Math.max(0, endWithoutCommentAndSplit - MAX_COL);

  for (let i = 0; i < choice.left.groupsStarting; i++) {
    nextGroups.push({
      align: actualColumn,
      breakCost: Math.pow(10, nextGroups.length + 1),
    });
  }
  for (let i = 0; i < choice.left.groupsEnding; i++) {
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

  return {
    activeGroups: nextGroups,
    column: isBreak ? 0 : thisWordEnd,
    choiceIndex: curr.choiceIndex + 1,
    baseIndentation: nextBaseIndent,
    cost: curr.cost + extraCost,
    overflowingCount: curr.overflowingCount + overflowingCount,
    edge: {
      prevState: curr,
      decision: {
        indentation: finalIndent,
        left: choice.left,
        right: choice.right,
        chosenSplit: split,
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
    /**
     * Best-first sorting logic:
     *
     * We want to find the solution with the lowest cost that overflows
     * as little as possible.
     *
     * - We always prefer a solution that doesn't overflow to one that does,
     *   regardless of its cost. Given these two states:
     *
     *   - A: cost 1000000000000, overflowingCount 0
     *   - B: cost 0, overflowingCount 1
     *
     *   we would always pick A over B, despite B being significantly cheaper.
     *
     *  - Breaking lines increases the cost of a state, while not breaking
     *    decreases it by one (see variable extraCost in getNeighbourState).
     *     - If we choose to not break too many times, we might go out of
     *       bounds however, which is always worse.
     */
    if (a.overflowingCount !== b.overflowingCount) {
      return a.overflowingCount - b.overflowingCount;
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
  throw new Error(errorMessage);
}

// Used for debugging only; it's very convenient to know where groups start and end
function addGroupStart(buffer: string[], decision: Decision) {
  for (let i = 0; i < decision.left.groupsStarting; i++) {
    buffer.push('[');
  }
}

function addGroupEnd(buffer: string[], decision: Decision) {
  for (let i = 0; i < decision.left.groupsEnding; i++) {
    buffer.push(']');
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
    if (showGroups) addGroupStart(buffer, decision);
    pushIfNotEmpty(
      leftType === 'REGULAR' || leftType === 'COMMENT'
        ? decision.left.text
        : '',
    );
    if (showGroups) addGroupEnd(buffer, decision);
    if (decision.chosenSplit.splitType === '\n') {
      if (buffer.at(-1) === ' ') {
        buffer.pop();
      }
    }
    // TODO:  hack because of same thing as above
    if (decision.chosenSplit.splitType === ' ' && buffer.at(-1) === ' ') {
      return;
    }
    pushIfNotEmpty(decision.chosenSplit.splitType);
  });
  const result = buffer.join('').trimEnd();
  if (cursorPos === -1) {
    return result;
  }
  return { formattedString: result, cursorPos: cursorPos };
}

function determineSplits(chunk: Chunk, nextChunk: Chunk): Split[] {
  if (isCommentBreak(chunk, nextChunk)) {
    return onlyBreakSplit;
  }

  if (chunk.type === 'REGULAR') {
    if (doesNotWantSpace(chunk, nextChunk) && chunk.noBreak)
      return noSpaceNoBreakSplit;
    if (doesNotWantSpace(chunk, nextChunk)) return noSpaceSplits;
    if (chunk.noBreak) return noBreakSplit;
  }
  return standardSplits;
}

function chunkListToChoices(chunkList: Chunk[]): Choice[] {
  return chunkList.map((chunk, index) => {
    return {
      left: chunk,
      right: index === chunkList.length - 1 ? emptyChunk : chunkList[index + 1],
      possibleSplitChoices: determineSplits(chunk, chunkList[index + 1]),
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
      overflowingCount: 0,
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
    throw new Error(errorMessage);
  }
  return { formattedString: formatted.trimEnd(), cursorPos: cursorPos };
}

const standardSplits: Split[] = [
  { splitType: ' ', cost: 0 },
  { splitType: '\n', cost: 1 },
];
const noSpaceSplits: Split[] = [
  { splitType: '', cost: 0 },
  { splitType: '\n', cost: 1 },
];
const noBreakSplit: Split[] = [{ splitType: ' ', cost: 0 }];
const noSpaceNoBreakSplit: Split[] = [{ splitType: '', cost: 0 }];
const onlyBreakSplit: Split[] = [{ splitType: '\n', cost: 0 }];

const emptyChunk: RegularChunk = {
  type: 'REGULAR',
  text: '',
  groupsStarting: 0,
  groupsEnding: 0,
  modifyIndentation: 0,
};
