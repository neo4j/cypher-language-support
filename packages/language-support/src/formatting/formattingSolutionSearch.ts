import { Heap } from 'heap-js';
import CypherCmdLexer from '../generated-parser/CypherCmdLexer';
import {
  AlignIndentationOptions,
  Chunk,
  ChunkIndentation,
  emptyChunk,
  isCommentBreak,
  MAX_COL,
} from './formattingHelpers';

const errorMessage = `
Internal formatting error: An unexpected issue occurred while formatting.
This is likely a bug in the formatter itself. If possible, please report the issue
along with your input on GitHub:
https://github.com/neo4j/cypher-language-support.`.trim();

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
): IndentationState {
  return {
    base: indentationState.base + chunkIndentation.base * INDENTATION_SPACES,
    special:
      indentationState.special + chunkIndentation.special * INDENTATION_SPACES,
    align: [...indentationState.align],
  };
}

function getIndentations(state: State, chunk: Chunk): IndentationResult {
  const { base, special, align } = deriveNextIndentationState(
    chunk.indentation,
    state.indentationState,
  );

  // A closing bracket of EXISTS, COLLECT, COUNT
  // Should align with the first group, which alignment only exist
  // in align group
  if (chunk.indentation.align === AlignIndentationOptions.Remove) {
    return {
      finalIndentation: align.pop(),
      indentationState: { base, special, align },
    };
  }

  // AlignIndentation, used for EXISTS, COUNT, COLLECT
  // Pushes base groups alignment to list to be used later
  // for closing bracket
  if (chunk.indentation.align === AlignIndentationOptions.Add) {
    align.push(state.activeGroups.at(0).align);
  }

  // When not at the start of a line, no indentation
  if (state.column !== 0) {
    return {
      finalIndentation: 0,
      indentationState: { base, special, align },
    };
  }

  // Active groups, prioritize lining up on these if break
  // Works because after breakLine no groups are active
  if (state.activeGroups.length > 0) {
    return {
      finalIndentation: state.activeGroups.at(-1).align,
      indentationState: { base, special, align },
    };
  }

  // Hard-break comments or chunk must break before
  if (chunk.type === 'COMMENT' && chunk.breakBefore) {
    return {
      finalIndentation: base,
      indentationState: { base, special, align },
    };
  }

  // Special indentation, used with CASE
  if (state.indentationState.special !== 0) {
    let finalIndent = state.indentationState.special;

    // If align indentation is present
    // Meaning inside EXIST, COUNT or COLLECT, add one
    // more indentation to better differentiate
    finalIndent += INDENTATION_SPACES * state.indentationState.align.length;

    return {
      finalIndentation: finalIndent,
      indentationState: { base, special, align },
    };
  }

  // Currently for EXISTS, COLLECT and COUNT
  if (state.indentationState.align.length > 0) {
    const finalIndent =
      align.at(-1) + INDENTATION_SPACES + state.indentationState.base;

    return {
      finalIndentation: finalIndent,
      indentationState: { base, special, align },
    };
  }

  // Default case
  return {
    finalIndentation: state.indentationState.base,
    indentationState: { base, special, align },
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

  const { finalIndentation, indentationState } = getIndentations(
    curr,
    choice.left,
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
    if (decision.left.isCursor) {
      cursorPos = buffer.join('').length;
    }
    if (showGroups) addGroupStart(buffer, decision);
    buffer.push(decision.left.text);
    if (showGroups) addGroupEnd(buffer, decision);
    buffer.push(decision.chosenSplit.splitType);
  });
  let result = buffer.join('').trimEnd();
  if (decisions.at(-1).left.doubleBreak) {
    result += '\n';
  }
  // Return appropriate result type based on cursor presence
  return cursorPos === -1 ? result : { formattedString: result, cursorPos };
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
