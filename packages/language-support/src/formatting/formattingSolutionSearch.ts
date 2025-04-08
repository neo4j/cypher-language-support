import {
  Chunk,
  doesNotWantSpace,
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
}

interface Decision {
  indentation: number;
  left: Chunk;
  right: Chunk;
  chosenSplit: Split;
}

interface IndentationState {
  indentation: number;
  activeIndents: IndentationModifier[];
}

interface State {
  activeGroups: Group[];
  indentationState: IndentationState;
  column: number;
  choiceIndex: number;
}

interface Result {
  decisions: Decision[];
  indentationState: IndentationState;
}

interface FinalResultWithPos {
  formattedString: string;
  cursorPos: number;
}

type FinalResult = string | FinalResultWithPos;

const standardSplits: Split[] = [{ splitType: ' ' }, { splitType: '\n' }];
const doubleBreakStandardSplits: Split[] = [
  { splitType: ' ' },
  { splitType: '\n\n' },
];
const noSpaceSplits: Split[] = [{ splitType: '' }, { splitType: '\n' }];
const noSpaceDoubleBreakSplits: Split[] = [
  { splitType: '' },
  { splitType: '\n\n' },
];
const noBreakSplit: Split[] = [{ splitType: ' ' }];
const noSpaceNoBreakSplit: Split[] = [{ splitType: '' }];
const onlyBreakSplit: Split[] = [{ splitType: '\n' }];
const onlyDoubleBreakSplit: Split[] = [{ splitType: '\n\n' }];

function getNextIndentationState(
  state: State,
  chunk: Chunk,
  isBreak: boolean,
): IndentationState {
  let newActiveIndents = [...state.indentationState.activeIndents];
  // The "indentation" number is the actual amount of indentation at the current state,
  // but it should not be confused with the entire indentation state. The entire indentation state
  // also includes the indentation modifiers, that keep track of when this number should change
  let nextIndentation = state.indentationState.indentation;
  for (const indent of chunk.indentation) {
    if (indent.change === 1 && isBreak) {
      newActiveIndents.push(indent);
      nextIndentation += INDENTATION_SPACES;
    }
    if (indent.change === -1) {
      // PERF: This is O(n) twice and doesn't neccesarily have to be. Might be worth optimizing if profiling
      // shows that it is actually a perf sink.
      const index = newActiveIndents.findIndex(
        (activeIndent) => activeIndent.id === indent.id,
      );
      if (index !== -1) {
        newActiveIndents = newActiveIndents.filter(
          (activeIndent) => activeIndent.id !== indent.id,
        );
        nextIndentation -= INDENTATION_SPACES;
      }
    }
  }
  return { indentation: nextIndentation, activeIndents: newActiveIndents };
}

// Very useful for debugging but not actually used in the code
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* function stateToString(state: State) {
  const result = reconstructBestPath(state);
  const resultString = decisionsToFormatted(result.decisions);
  return resultString;
} */

function createStateTransition(
  state: State,
  choice: Choice,
  split: Split,
): { nextState: State; decision: Decision } {
  const isBreak = split.splitType === '\n' || split.splitType === '\n\n';
  let nextGroups = [...state.activeGroups];
  const indentationDecision =
    state.column === 0 ? state.indentationState.indentation : 0;
  const { indentation: nextIndentation, activeIndents: nextActiveIndents } =
    getNextIndentationState(
      state,
      choice.left,
      // We should apply the indentation also if it was a group that would want to split, but wasn't
      // allowed to (because of avoidBreakBetween() in the visitor).
      isBreak || split.wantedToSplit,
    );

  const actualColumn = state.column === 0 ? indentationDecision : state.column;
  const splitLength = !isBreak ? split.splitType.length : 0;
  const thisWordEnd = actualColumn + choice.left.text.length + splitLength;

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

  return {
    nextState: {
      activeGroups: nextGroups,
      indentationState: {
        indentation: nextIndentation,
        activeIndents: nextActiveIndents,
      },
      column: isBreak ? 0 : thisWordEnd,
      choiceIndex: state.choiceIndex + 1,
    },
    decision: {
      indentation: indentationDecision,
      left: choice.left,
      right: choice.right,
      chosenSplit: split,
    },
  };
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

function determineSplit(state: State, choice: Choice, splits: Split[]): Split {
  if (choice.right === emptyChunk) {
    return onlyBreakSplit[0];
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
    ? state.indentationState.indentation
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
    return {
      ...splits[0],
      wantedToSplit: breakBeforeGrp !== undefined || lastGrpBreaks,
    };
  }

  if (breakBeforeGrp) {
    return { splitType: '\n', breakBeforeGrp };
  }

  if (lastGrpBreaks) {
    return splits.find(
      (split) => split.splitType === '\n' || split.splitType === '\n\n',
    );
  }
  if (!lastGrpBreaks) {
    return splits.find(
      (split) => split.splitType === ' ' || split.splitType === '',
    );
  }
  throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
}

function computeFormattingDecisions(
  startingState: State,
  choiceList: Choice[],
): Result {
  let state = startingState;
  const decisions: Decision[] = [];
  for (const choice of choiceList) {
    const split = determineSplit(state, choice, choice.possibleSplitChoices);
    const { nextState, decision } = createStateTransition(state, choice, split);
    state = nextState;
    decisions.push(decision);
  }
  return {
    decisions,
    // TODO: IndentationState will not be needed after moving to one chunkList
    indentationState: state.indentationState,
  };
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
    indentation: 0,
    activeIndents: [],
  };
  let cursorPos = 0;
  for (const chunkList of buffers) {
    const choices: Choice[] = chunkListToChoices(chunkList);
    // Indentation should carry over
    const initialState: State = {
      activeGroups: [],
      indentationState,
      column: 0,
      choiceIndex: 0,
    };
    const result = computeFormattingDecisions(initialState, choices);
    indentationState = result.indentationState;
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
    indentationState.indentation !== 0 ||
    indentationState.activeIndents.length > 0
  ) {
    throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
  }
  return { formattedString: formatted.trimEnd(), cursorPos: cursorPos };
}
