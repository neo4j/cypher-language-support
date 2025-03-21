import { Heap } from 'heap-js';
import CypherCmdLexer from '../generated-parser/CypherCmdLexer';
import {
  AlignIndentationOptions,
  Chunk,
  ChunkIndentation,
  emptyChunk,
  INTERNAL_FORMAT_ERROR_MESSAGE,
  isCommentBreak,
  MAX_COL,
} from './formattingHelpers';

const INDENTATION_SPACES = 2;
const showGroups = false;

interface Split {
  splitType: ' ' | '' | '\n' | '\n\n';
  cost: number;
}

interface Choice {
  left: Chunk;
  right: Chunk;
  // The possible splits that the best first search can choose
  possibleSplitChoices: Split[];
}

interface Group {
  align: number;
  breakCost: number;
  shouldBreak: boolean;
}

interface Decision {
  indentation: number;
  left: Chunk;
  right: Chunk;
  chosenSplit: Split;
}

interface State {
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

interface Result {
  cost: number;
  decisions: Decision[];
  indentation: IndentationState;
}

interface FinalResultWithPos {
  formattedString: string;
  cursorPos: number;
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

function doesNotWantSpace(chunk: Chunk, nextChunk: Chunk): boolean {
  return (
    nextChunk?.type !== 'COMMENT' &&
    chunk.type === 'REGULAR' &&
    (chunk.noSpace ||
      (chunk.node && openingCharacters.includes(chunk.node.symbol.type)))
  );
}

function deriveNextIndentationState(
  chunkIndentation: ChunkIndentation,
  indentationState: IndentationState,
  activeGroups: Group[],
): IndentationState {
  const align = [...indentationState.align];
  // Align indentation, used for EXISTS, COUNT, COLLECT
  // Pushes base groups alignment to list to be used later
  // for closing bracket
  if (chunkIndentation.align === AlignIndentationOptions.Add) {
    align.push(activeGroups.at(0).align);
  }
  if (chunkIndentation.align === AlignIndentationOptions.Remove) {
    align.pop();
  }

  return {
    base: indentationState.base + chunkIndentation.base * INDENTATION_SPACES,
    special:
      indentationState.special + chunkIndentation.special * INDENTATION_SPACES,
    align: align,
  };
}

function getFinalIndentation(
  state: State,
  chunk: Chunk,
  nextIndentationState: IndentationState,
): number {
  // Case 0:  When not at the start of a line, no indentation
  if (state.column !== 0) {
    return 0;
  }

  // Case 1: Active groups, prioritize lining up on these
  if (state.activeGroups.length > 0) {
    return state.activeGroups.at(-1).align;
  }

  // Case 2: This happens if align.pop() was done in deriveNextIndentationState
  // Also means we are on a closing brackets and should align
  // on what was the last element in align, however because we popped it before
  // we need to fetch it from the state where it still exists
  if (state.indentationState.align.length > nextIndentationState.align.length) {
    return state.indentationState.align.at(-1);
  }

  // Case 3: Hard-break comments align on base indentation if
  // no active groups. Uses nextIndentationState because remove indentation
  // is attached on same chunk as the comment, Therefore we need to use
  // the next calculated indentation state directly
  if (chunk.type === 'COMMENT' && chunk.breakBefore) {
    return nextIndentationState.base;
  }

  // Case 4: Special indentation, used with CASE
  // If align indentation is present
  // Meaning inside EXIST, COUNT or COLLECT, add one
  // more indentation per nesting to better differentiate
  if (state.indentationState.special !== 0) {
    return (
      state.indentationState.special +
      INDENTATION_SPACES * state.indentationState.align.length +
      state.indentationState.base
    );
  }

  // Case 5: If there are active alignment groups
  // (typically for EXISTS, COLLECT, COUNT),
  // calculate the final indentation by combining:
  //   - the last alignment value,
  //   - an extra unit of spacing, and
  //   - the base indentation.
  if (state.indentationState.align.length > 0) {
    return (
      nextIndentationState.align.at(-1) +
      INDENTATION_SPACES +
      state.indentationState.base
    );
  }

  // Default case
  return state.indentationState.base;
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
  const nextIndentationState = deriveNextIndentationState(
    choice.left.indentation,
    curr.indentationState,
    nextGroups,
  );
  const finalIndentation = getFinalIndentation(
    curr,
    choice.left,
    nextIndentationState,
  );

  const actualColumn = curr.column === 0 ? finalIndentation : curr.column;
  const splitLength = !isBreak ? split.splitType.length : 0;
  const thisWordEnd = actualColumn + choice.left.text.length + splitLength;
  // We don't consider comments nor an empty space as overflowing
  const endWithoutCommentAndSplit =
    choice.left.type === 'COMMENT'
      ? actualColumn - 1
      : thisWordEnd - splitLength;
  const overflowingCount = Math.max(0, endWithoutCommentAndSplit - MAX_COL);

  for (let i = 0; i < choice.left.groupsStarting.length; i++) {
    nextGroups.push({
      align: actualColumn,
      breakCost: Math.pow(10, nextGroups.length + 1),
      shouldBreak: actualColumn + choice.left.groupsStarting[i].size > 80,
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
    indentationState: nextIndentationState,
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
      if (
        neighbourState.activeGroups.length > 0 &&
        neighbourState.activeGroups.at(-1).shouldBreak &&
        choice.possibleSplitChoices.length > 1 &&
        split.splitType === ' '
      ) {
        continue;
      }
      heap.push(neighbourState);
    }
  }
  throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
}

// Used for debugging only; it's very convenient to know where groups start and end
function addGroupStart(buffer: string[], decision: Decision) {
  for (let i = 0; i < decision.left.groupsStarting.length; i++) {
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
    if (decision.left.isCursor) {
      cursorPos = buffer.join('').length;
    }
    if (showGroups) addGroupStart(buffer, decision);
    buffer.push(decision.left.text);
    if (showGroups) addGroupEnd(buffer, decision);
    buffer.push(decision.chosenSplit.splitType);
  });
  let result = buffer.join('').trimEnd();
  // Syntax error tokens might include more whitespace than we want before them
  if (decisions.at(0).left.type === 'SYNTAX_ERROR') {
    result = result.trimStart();
  }
  if (decisions.at(-1).left.doubleBreak) {
    result += '\n';
  }
  // Return appropriate result type based on cursor presence
  return cursorPos === -1 ? result : { formattedString: result, cursorPos };
}

function determineSplits(chunk: Chunk, nextChunk: Chunk): Split[] {
  if (chunk.type === 'SYNTAX_ERROR' || nextChunk?.type === 'SYNTAX_ERROR') {
    return noSpaceNoBreakSplit;
  }
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
    throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
  }
  return { formattedString: formatted.trimEnd(), cursorPos: cursorPos };
}
