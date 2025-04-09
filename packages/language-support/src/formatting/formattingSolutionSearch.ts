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

function createStateTransition(
  state: State,
  choice: Choice,
  split: Split,
): { nextState: State; decision: Decision } {
  const isBreak = split.splitType === '\n' || split.splitType === '\n\n';
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

  return {
    nextState: {
      activeGroups: state.activeGroups,
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
  if (chunk.type === 'SYNTAX_ERROR') {
    return chunk.mustBreak ? onlyBreakSplit : noSpaceNoBreakSplit;
  }
  if (nextChunk?.type === 'SYNTAX_ERROR') {
    return noSpaceNoBreakSplit;
  }
  if (isCommentBreak(chunk, nextChunk)) {
    return chunk.doubleBreak ? onlyDoubleBreakSplit : onlyBreakSplit;
  }

  if (chunk.type === 'REGULAR') {
    if (chunk.mustBreak) {
      return chunk.doubleBreak ? onlyDoubleBreakSplit : onlyBreakSplit;
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
  const addedIndent =
    state.column === 0 ? state.indentationState.indentation : 0;

  for (const group of choice.left.groupsStarting) {
    if (group.size + state.column + addedIndent > MAX_COL) {
      group.breaksAll = true;
    }
    state.activeGroups.push(group);
  }
  endGroups(state, choice);
  const shouldBreak =
    state.activeGroups.length > 0 && state.activeGroups.at(-1).breaksAll;

  if (splits.length === 1) {
    return {
      ...splits[0],
      wantedToSplit: shouldBreak,
    };
  }

  if (shouldBreak) {
    return splits.find(
      (split) => split.splitType === '\n' || split.splitType === '\n\n',
    );
  } else {
    return splits.find(
      (split) => split.splitType === ' ' || split.splitType === '',
    );
  }
}

function endGroups(state: State, choice: Choice) {
  for (let i = 0; i < choice.left.groupsEnding.length; i++) {
    if (state.activeGroups.length === 0) {
      throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
    }
    if (
      !state.activeGroups.some(
        (group) => group.id === choice.left.groupsEnding[i].id,
      )
    ) {
      throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
    }
    // PERF: This is O(n), might be worth optimizing if profiling says so.
    state.activeGroups = state.activeGroups.filter(
      (group) => group.id !== choice.left.groupsEnding[i].id,
    );
  }
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
  chunkList: Chunk[],
): FinalResultWithPos {
  let formatted = '';
  let indentationState: IndentationState = {
    indentation: 0,
    activeIndents: [],
  };
  let cursorPos = 0;
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
  if (
    indentationState.indentation !== 0 ||
    indentationState.activeIndents.length > 0
  ) {
    throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
  }
  return { formattedString: formatted.trimEnd(), cursorPos: cursorPos };
}
