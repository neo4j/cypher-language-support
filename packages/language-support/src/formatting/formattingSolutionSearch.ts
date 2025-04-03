import { Heap } from 'heap-js';
import CypherCmdLexer from '../generated-parser/CypherCmdLexer';
import {
  Chunk,
  emptyChunk,
  IndentationModifier,
  INTERNAL_FORMAT_ERROR_MESSAGE,
  isCommentBreak,
  MAX_COL,
} from './formattingHelpers';

const INDENTATION_SPACES = 2;
const showGroups = false;

interface Split {
  splitType: ' ' | '' | '\n' | '\n\n';
  breakBeforeGrp?: Group;
  cost: number;
}

interface Choice {
  left: Chunk;
  right: Chunk;
  // The possible splits that the best first search can choose
  possibleSplitChoices: Split[];
}

export interface Group {
  id: number;
  breaksAll?: boolean;
  nonPrettierStyle: boolean;
  size: number;
  dbgText: string;
  align: number; // USE ONLY FOR STATE KEY
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
  activeIndents: IndentationModifier[];
  previousIndent: number;
  column: number;
  choiceIndex: number;
  indentation: number;
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
  indentation: number;
}

interface FinalResultWithPos {
  formattedString: string;
  cursorPos: number;
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

export function doesNotWantSpace(chunk: Chunk, nextChunk: Chunk): boolean {
  return (
    nextChunk?.type !== 'COMMENT' &&
    chunk.type === 'REGULAR' &&
    (chunk.noSpace ||
      (chunk.node && openingCharacters.includes(chunk.node.symbol.type)))
  );
}

function getFinalIndentation(state: State): number {
  if (state.column !== 0) {
    return 0;
  }
  return state.indentation;
}

function getNextIndentationState(state: State, chunk: Chunk): [number, IndentationModifier[]] {
  let newActive = [...state.activeIndents];
  let nextIndentation: number = state.indentation;
  for (const indent of chunk.indentation) {
    if (indent.change === 1 && nextIndentation - state.previousIndent < 2) {
      newActive.push(indent);
      nextIndentation += INDENTATION_SPACES;
    }
    if (indent.change === -1) {
      const index = newActive.findIndex((i) => i.id === indent.id);
      if (index !== -1) {
        newActive = newActive.filter((i) => i.id !== indent.id);
        nextIndentation -= INDENTATION_SPACES;
      }
    }
  }
  return [nextIndentation, newActive];
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
  let nextGroups = [...curr.activeGroups];
  const finalIndentation = getFinalIndentation(curr);
  const [nextIndentation, newActive] = getNextIndentationState(curr, choice.left);

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
    const grp = choice.left.groupsStarting[i];
    // TODO this miiiight be slightly off because of indentation rules
    const nextGrpStart = isBreak ? curr.indentation : thisWordEnd;
    const breaksAll =
      nextGrpStart + grp.size > MAX_COL || grp.id === split.breakBeforeGrp?.id;
    const newGroup = {
      ...grp,
      align: actualColumn,
      breakCost: Math.pow(10, nextGroups.length + 1),
      breaksAll,
    };
    nextGroups.push(newGroup);
  }

  for (let i = 0; i < choice.left.groupsEnding.length; i++) {
    if (nextGroups.length === 0) {
      throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
    }
    if (
      !nextGroups.some((group) => group.id === choice.left.groupsEnding[i].id)
    ) {
      throw new Error('Unexpected group ending');
    }
    nextGroups = nextGroups.filter(
      (group) => group.id !== choice.left.groupsEnding[i].id,
    );
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

  const indentationDecision = curr.column === 0 ? finalIndentation : 0;
  const previousIndent = indentationDecision !== 0 ? indentationDecision : curr.previousIndent;

  return {
    activeGroups: nextGroups,
    activeIndents: newActive,
    previousIndent,
    column: isBreak ? 0 : thisWordEnd,
    choiceIndex: curr.choiceIndex + 1,
    cost: curr.cost + extraCost,
    overflowingCount: curr.overflowingCount + overflowingCount,
    indentation: nextIndentation,
    edge: {
      prevState: curr,
      decision: {
        indentation: curr.column === 0 ? finalIndentation : 0,
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
    indentation: state.indentation,
  };
}

function getStateKey(state: State): string {
  return `${state.column}-${state.choiceIndex}-${
    state.activeGroups.at(-1)?.align
  }`;
}

function filterSplits(state: State, choice: Choice, splits: Split[]): Split[] {
  const nonSpace =
    (choice.left.type === 'REGULAR' && choice.left.noSpace) ||
    doesNotWantSpace(choice.left, choice.right);

  const endingIds = choice.left.groupsEnding.map((g) => g.id);
  const activeGrps = state.activeGroups.filter(
    (g) => !endingIds.includes(g.id),
  );
  const lastGrpBreaks = activeGrps.length > 0 && activeGrps.at(-1).breaksAll;
  const lastGrpNonPrettier =
    activeGrps.length > 0 && activeGrps.at(-1).nonPrettierStyle;
  const newGroups = choice.left.groupsStarting;
  const nextStart = lastGrpBreaks
    ? state.indentation
    : state.column + choice.left.text.length + (nonSpace ? 0 : 1);
  const lastSpecialBreak = choice.left.specialBreak;

  // TODO: There might be a better way to do this?
  let breakBeforeGrp: Group = undefined;
  for (const group of newGroups) {
    if (!lastSpecialBreak && group.size + nextStart > MAX_COL) {
      breakBeforeGrp = group;
      break;
    }
  }

  if (splits.length === 1) {
    return splits;
  }

  if (breakBeforeGrp) {
    return [{ splitType: '\n', cost: 0, breakBeforeGrp }];
  }

  if (lastGrpBreaks && !lastGrpNonPrettier && !lastSpecialBreak) {
    return splits.filter(
      (split) => split.splitType === '\n' || split.splitType === '\n\n',
    );
  }
  if (!lastGrpBreaks) {
    return splits.filter(
      (split) => split.splitType === ' ' || split.splitType === '',
    );
  }
  return splits;
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
      if (state.activeGroups.length > 0) {
        throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
      }
      return reconstructBestPath(state);
    }
    // TODO: REMOVE THIS
    const stateString = state.choiceIndex > 0 ? stateToString(state) : '';
    if (stateString === 'hej hopp') {
      throw new Error(
        'error to make sure the above does not have eslint errors',
      );
    }
    const choice = choiceList[state.choiceIndex];
    const filteredSplits = filterSplits(
      state,
      choice,
      choice.possibleSplitChoices,
    );
    for (const split of filteredSplits) {
      const neighbourState = getNeighbourState(state, choice, split);
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
  for (let i = 0; i < decision.left.groupsEnding.length; i++) {
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
    buffer.push(decision.left.text);
    if (showGroups) addGroupEnd(buffer, decision);
    if (showGroups) addGroupStart(buffer, decision);
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
  let indentation = 0;
  let previousIndentation = 0;
  let cursorPos = 0;
  for (const chunkList of buffers) {
    const choices: Choice[] = chunkListToChoices(chunkList);
    // Indentation should carry over
    const initialState: State = {
      activeGroups: [],
      activeIndents: [],
      previousIndent: previousIndentation,
      column: 0,
      choiceIndex: 0,
      cost: 0,
      indentation,
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
  if (indentation !== 0) {
    throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
  }
  return { formattedString: formatted.trimEnd(), cursorPos: cursorPos };
}
