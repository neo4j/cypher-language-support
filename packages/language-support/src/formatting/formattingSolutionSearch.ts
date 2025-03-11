import { Heap } from 'heap-js';
import CypherCmdLexer from '../generated-parser/CypherCmdLexer';
import {
  AlignIndentationOptions,
  Chunk,
  ChunkIndentation,
  isCommentBreak,
  MAX_COL,
  RegularChunk,
} from './formattingHelpers';

const errorMessage = `
Internal formatting error: An unexpected issue occurred while formatting.
This is likely a bug in the formatter itself. If possible, please report the issue
along with your input on GitHub:
https://github.com/neo4j/cypher-language-support.`.trim();

const INDENTATION = 2;
const showGroups = false;

export interface Split {
  splitType: ' ' | '' | '\n' | '\n\n';
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
  indentationState: IndentationState;
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
  indentation: IndentationState;
}

interface FinalResultWithPos {
  formattedString: string;
  cursorPos: number;
}

interface IndentationResult {
  finalIndentation: number;
  indentationState: IndentationState;
}

interface IndentationState {
  base: number;
  special: number;
  align: number[];
}

type FinalResult = string | FinalResultWithPos;

const openingCharacters = [CypherCmdLexer.LPAREN, CypherCmdLexer.LBRACKET];

const standardSplits: Split[] = [
  { splitType: ' ', cost: 0 },
  { splitType: '\n', cost: 1 },
];
const doubleBreakStandardSplits: Split[] = [
  { splitType: ' ', cost: 0 },
  { splitType: '\n\n', cost: 1 },
];
const noSpaceSplits: Split[] = [
  { splitType: '', cost: 0 },
  { splitType: '\n', cost: 1 },
];
const noSpaceDoubleBreakSplits: Split[] = [
  { splitType: '', cost: 0 },
  { splitType: '\n\n', cost: 1 },
];
const noBreakSplit: Split[] = [{ splitType: ' ', cost: 0 }];
const noSpaceNoBreakSplit: Split[] = [{ splitType: '', cost: 0 }];
const onlyBreakSplit: Split[] = [{ splitType: '\n', cost: 0 }];
const onlyDoubleBreakSplit: Split[] = [{ splitType: '\n\n', cost: 0 }];

const emptyChunk: RegularChunk = {
  type: 'REGULAR',
  text: '',
  groupsStarting: 0,
  groupsEnding: 0,
  indentation: {
    base: 0,
    special: 0,
    align: 0,
  },
};

export function doesNotWantSpace(chunk: Chunk, nextChunk: Chunk): boolean {
  return (
    nextChunk?.type !== 'COMMENT' &&
    chunk.type === 'REGULAR' &&
    (chunk.noSpace ||
      (chunk.node && openingCharacters.includes(chunk.node.symbol.type)))
  );
}

function getNextIndentationLevel(
  chunkIndentation: ChunkIndentation,
  indentationState: IndentationState,
): IndentationState {
  const nextBaseIndent =
    indentationState.base + chunkIndentation.base * INDENTATION;
  const nextSpecialIndent =
    indentationState.special + chunkIndentation.special * INDENTATION;
  const align = [...indentationState.align];
  return {
    base: nextBaseIndent,
    special: nextSpecialIndent,
    align: align,
  };
}

function getIndentations(curr: State, choice: Choice): IndentationResult {
  const { base, special, align } = getNextIndentationLevel(
    choice.left.indentation,
    curr.indentationState,
  );

  if (choice.left.indentation.align === AlignIndentationOptions.Add) {
    align.push(curr.activeGroups.at(0).align);
  }

  let finalIndent = curr.indentationState.base;

  // Only apply indentation at the start of a line (column === 0)
  if (curr.column === 0) {
    // Case 1: Hard-break comments align with base group or base indentation
    if (choice.left.type === 'COMMENT' && choice.left.breakBefore) {
      const baseGroup = curr.activeGroups[0];
      finalIndent = baseGroup ? baseGroup.align : base;
    }
    // Case 2: Special indentation, used with CASE
    // Aligns as usual if more than one group exists
    // else indents as specified in state
    else if (curr.indentationState.special !== 0) {
      finalIndent =
        curr.activeGroups.length > 1
          ? curr.activeGroups.at(-1).align
          : curr.indentationState.special;
      // Case 3: Currently for for EXISTS, COLLECT and COUNT,
      // Aligning with base group plus indentation plus possible baseIndentation.
      // baseIndentation can happen with UNION
    } else if (curr.indentationState.align.length > 0) {
      finalIndent =
        curr.activeGroups.length > 0
          ? curr.activeGroups.at(-1).align
          : align.at(-1) + INDENTATION + curr.indentationState.base;
    }
    // Case 4: No special indentation rules applied,
    // Align with latest added active group
    else if (curr.activeGroups.length > 0) {
      finalIndent = curr.activeGroups.at(-1).align;
    }
    // Default case is already set to currBaseIndent
  } else {
    // When not at the start of a line, no indentation
    finalIndent = 0;
  }
  if (choice.left.indentation.align === AlignIndentationOptions.Remove) {
    finalIndent = align.pop();
  }

  return {
    finalIndentation: finalIndent,
    indentationState: {
      base: base,
      special: special,
      align: align,
    },
  };
}

// Very useful for debugging but not actually used in the code
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function stateToString(state: State) {
  const result = reconstructBestPath(state);
  const resultString = decisionsToFormatted(result.decisions);
  return resultString;
}

function getNeighbourState(curr: State, choice: Choice, split: Split): State {
  const isBreak = split.splitType === '\n' || split.splitType === '\n\n';
  // A state has indentation, which is applied after a hard line break. However, if it has an
  // active group and we decided to split within a line, the alignment of that group takes precedence
  // over the base indentation.
  const nextGroups = [...curr.activeGroups];

  const { finalIndentation, indentationState } = getIndentations(curr, choice);

  const actualColumn = curr.column === 0 ? finalIndentation : curr.column;
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
    cost: curr.cost + extraCost,
    overflowingCount: curr.overflowingCount + overflowingCount,
    indentationState: indentationState,
    edge: {
      prevState: curr,
      decision: {
        indentation: finalIndentation,
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
    indentation: state.indentationState,
  };
}

function getStateKey(state: State): string {
  return `${state.column}-${state.choiceIndex}-${
    state.activeGroups.at(-1)?.align
  }`;
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
  const buffer: string[] = [];
  let cursorPos = -1;
  decisions.forEach((decision) => {
    buffer.push(' '.repeat(decision.indentation));
    const leftType = decision.left.type;
    if (
      (leftType === 'REGULAR' || leftType === 'COMMENT') &&
      decision.left.isCursor
    ) {
      cursorPos = buffer.join('').length;
    }
    if (showGroups) addGroupStart(buffer, decision);
    buffer.push(
      leftType === 'REGULAR' || leftType === 'COMMENT'
        ? decision.left.text
        : '',
    );
    if (showGroups) addGroupEnd(buffer, decision);
    buffer.push(decision.chosenSplit.splitType);
  });
  let result = buffer.join('').trimEnd();
  if (decisions.at(-1).left.doubleBreak) {
    result += '\n';
  }
  if (cursorPos === -1) {
    return result;
  }
  return { formattedString: result, cursorPos: cursorPos };
}

function determineSplits(chunk: Chunk, nextChunk: Chunk): Split[] {
  if (isCommentBreak(chunk, nextChunk)) {
    return chunk.doubleBreak ? onlyDoubleBreakSplit : onlyBreakSplit;
  }

  if (chunk.type === 'REGULAR') {
    if (chunk.mustBreak) {
      return onlyBreakSplit;
    }
    const noSpace = doesNotWantSpace(chunk, nextChunk);

    if (noSpace) {
      if (chunk.noBreak) {
        return noSpaceNoBreakSplit;
      }
      return chunk.doubleBreak ? noSpaceDoubleBreakSplits : noSpaceSplits;
    }
    if (chunk.noBreak) {
      return noBreakSplit;
    }
  }

  return chunk.doubleBreak ? doubleBreakStandardSplits : standardSplits;
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
  let indentationState: IndentationState = {
    align: [],
    base: 0,
    special: 0,
  };
  let cursorPos = 0;
  for (const chunkList of buffers) {
    const choices: Choice[] = chunkListToChoices(chunkList);
    // Indentation should carry over
    const initialState: State = {
      activeGroups: [],
      column: 0,
      choiceIndex: 0,
      cost: 0,
      indentationState: indentationState,
      overflowingCount: 0,
      edge: null,
    };
    const result = bestFirstSolnSearch(initialState, choices);
    indentationState = result.indentation;
    const formattingResult = decisionsToFormatted(result.decisions);
    // Cursor is not in this chunkList
    if (typeof formattingResult === 'string') {
      formatted += formattingResult + '\n';
    } else {
      cursorPos = formatted.length + formattingResult.cursorPos;
      formatted += formattingResult.formattedString + '\n';
    }
  }
  if (
    indentationState.base !== 0 ||
    indentationState.special !== 0 ||
    indentationState.align.length !== 0
  ) {
    throw new Error(errorMessage);
  }
  return { formattedString: formatted.trimEnd(), cursorPos: cursorPos };
}
