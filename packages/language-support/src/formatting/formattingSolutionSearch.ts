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
  // TODO: v3 tech debt; the split keeps track of whether the group wants a break before itself.
  // Ideally this should be handled in a more sound way, such as including the clause word in the
  // group itself.
  breakBeforeGrp?: Group;
  cost: number;
  wantedToSplit?: boolean;
}

interface Choice {
  left: Chunk;
  right: Chunk;
  // The possible splits that the best first search can choose
  possibleSplitChoices: Split[];
}

export interface Group {
  id: number;
  // Should this group break in the "Prettier" fashion, breaking between
  // all of its children?
  breaksAll?: boolean;
  size: number;
  // The full text of the group (used for debugging only)
  dbgText: string;
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
  activeIndents: IndentationModifier[];
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
  activeIndents: IndentationModifier[];
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

function getNextIndentationState(
  state: State,
  chunk: Chunk,
  isBreak: boolean,
): [number, IndentationModifier[]] {
  let newActive = [...state.activeIndents];
  // The "indentation" number is the actual amount of indentation at the current state,
  // but it should not be confused with the entire indentation state. The entire indentation state
  // also includes the indentation modifiers, that keep track of when this number should change
  let nextIndentation: number = state.indentation;
  for (const indent of chunk.indentation) {
    if (indent.change === 1 && isBreak) {
      newActive.push(indent);
      nextIndentation += INDENTATION_SPACES;
    }
    if (indent.change === -1) {
      // PERF: This is O(n) twice and doesn't neccesarily have to be. Might be worth optimizing if profiling
      // shows that it is actually a perf sink.
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

function getNeighbourState(state: State, choice: Choice, split: Split): State {
  const isBreak = split.splitType === '\n' || split.splitType === '\n\n';
  let nextGroups = [...state.activeGroups];
  const indentationDecision = state.column === 0 ? state.indentation : 0;
  const [nextIndentation, newActive] = getNextIndentationState(
    state,
    choice.left,
    // We should apply the indentation also if it was a group that would want to split, but wasn't
    // allowed to (because of avoidBreakBetween() in the visitor).
    isBreak || split.wantedToSplit,
  );

  const actualColumn = state.column === 0 ? indentationDecision : state.column;
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
    const nextGrpStart = isBreak ? nextIndentation : thisWordEnd;
    const breaksAll =
      grp.breaksAll ||
      nextGrpStart + grp.size > MAX_COL ||
      // TODO: v3 tech debt; breaking before should be handled differently
      grp.id === split.breakBeforeGrp?.id;
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
      throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
    }
    // PERF: This is O(n), might be worth optimizing if profiling says so.
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

  return {
    activeGroups: nextGroups,
    activeIndents: newActive,
    column: isBreak ? 0 : thisWordEnd,
    choiceIndex: state.choiceIndex + 1,
    cost: state.cost + extraCost,
    overflowingCount: state.overflowingCount + overflowingCount,
    indentation: nextIndentation,
    edge: {
      prevState: state,
      decision: {
        indentation: indentationDecision,
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
    activeIndents: state.activeIndents,
  };
}

function getStateKey(state: State): string {
  return `${state.column}-${state.choiceIndex}-${
    state.activeGroups.at(-1)?.align
  }`;
}

function filterSplits(state: State, choice: Choice, splits: Split[]): Split[] {
  if (choice.right === emptyChunk) {
    return onlyBreakSplit;
  }
  const nonSpace =
    (choice.left.type === 'REGULAR' && choice.left.noSpace) ||
    doesNotWantSpace(choice.left, choice.right);

  const endingIds = choice.left.groupsEnding.map((g) => g.id);
  const activeGrps = state.activeGroups.filter(
    (g) => !endingIds.includes(g.id),
  );
  const lastGrpBreaks = activeGrps.length > 0 && activeGrps.at(-1).breaksAll;
  const newGroups = choice.left.groupsStarting;
  const nextStart = lastGrpBreaks
    ? state.indentation
    : state.column + choice.left.text.length + (nonSpace ? 0 : 1);

  // TODO: v3 tech debt; groups should include the clause keywords which would allow us to
  // skip this logic
  let breakBeforeGrp: Group = undefined;
  for (const group of newGroups) {
    if (group.breaksAll || group.size + nextStart > MAX_COL) {
      breakBeforeGrp = group;
      break;
    }
  }

  if (splits.length === 1) {
    return [
      {
        ...splits[0],
        wantedToSplit: breakBeforeGrp !== undefined || lastGrpBreaks,
      },
    ];
  }

  if (breakBeforeGrp) {
    return [{ splitType: '\n', cost: 0, breakBeforeGrp }];
  }

  if (lastGrpBreaks) {
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
    const choice = choiceList[state.choiceIndex];
    // TODO: v3 tech debt; rather than "filtering out splits", we should ever only have one
    // possible split type at any moment. This is true right now; if you throw an error if
    // filteredSplits.length > 1, nothing happens.
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
  const pendingComments: string[] = [];
  decisions.forEach((decision) => {
    buffer.push(' '.repeat(decision.indentation));
    if (decision.left.isCursor) {
      cursorPos = buffer.join('').length;
    }
    buffer.push(decision.left.text);
    // NOTE: Arguably this method should not have the responsibility of handling
    // inline comments at all, since now it has too many responsibilities.
    // But there is currently no better place for it.
    if (decision.left.type === 'REGULAR' && decision.left.comment) {
      pendingComments.push(decision.left.comment);
    }
    if (showGroups) addGroupEnd(buffer, decision);
    if (showGroups) addGroupStart(buffer, decision);
    if (
      decision.chosenSplit.splitType === '\n' ||
      decision.chosenSplit.splitType === '\n\n'
    ) {
      for (const comment of pendingComments) {
        buffer.push(' ');
        buffer.push(comment);
      }
      pendingComments.length = 0;
    }
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
  let activeIndents: IndentationModifier[] = [];
  let cursorPos = 0;
  for (const chunkList of buffers) {
    const choices: Choice[] = chunkListToChoices(chunkList);
    // Indentation should carry over
    const initialState: State = {
      activeGroups: [],
      activeIndents: activeIndents,
      column: 0,
      choiceIndex: 0,
      cost: 0,
      indentation,
      overflowingCount: 0,
      edge: null,
    };
    const result = bestFirstSolnSearch(initialState, choices);
    indentation = result.indentation;
    activeIndents = result.activeIndents;
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
