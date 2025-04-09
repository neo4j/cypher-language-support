import {
  Chunk,
  doesNotWantSpace,
  IndentationModifier,
  INTERNAL_FORMAT_ERROR_MESSAGE,
  MAX_COL,
} from './formattingHelpers';

const INDENTATION_SPACES = 2;

interface FinalResultWithPos {
  formattedString: string;
  cursorPos: number;
}

interface State {
  formatted: string;
  cursorPos: number;
  indentation: number;
  column: number;
  activeGroups: Group[];
  activeIndentations: IndentationModifier[];
  pendingComments: string[];
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

function shouldBreak(chunk: Chunk, state: State): boolean {
  if (chunk.type === 'COMMENT') return true;

  if (chunk.type !== 'SYNTAX_ERROR' && chunk.noBreak) {
    return false;
  }

  return (
    chunk.mustBreak || chunk.doubleBreak || state.activeGroups.at(-1)?.breaksAll
  );
}

function updateActiveGroups(state: State, chunk: Chunk): void {
  for (const group of chunk.groupsStarting) {
    const breaksAll = state.column + group.size > MAX_COL || group.breaksAll;
    state.activeGroups.push({ ...group, breaksAll });
  }
  for (const group of chunk.groupsEnding) {
    const indexToRemove = state.activeGroups.findIndex(
      (item) => item.id === group.id,
    );

    if (indexToRemove !== -1) {
      state.activeGroups.splice(indexToRemove, 1);
    } else {
      throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
    }
  }
}

function updateIndentationState(state: State, chunk: Chunk) {
  for (const indent of chunk.indentation) {
    if (indent.change === 1) {
      state.activeIndentations.push(indent);
      state.indentation += INDENTATION_SPACES;
    }
    if (indent.change === -1) {
      const indexToRemove = state.activeIndentations.findIndex(
        (item) => item.id === indent.id,
      );
      // Remove the item if found
      if (indexToRemove !== -1) {
        state.activeIndentations.splice(indexToRemove, 1);
        state.indentation -= INDENTATION_SPACES;
      } else {
        throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
      }
    }
  }
}
export function buffersToFormattedString(
  chunkList: Chunk[],
): FinalResultWithPos {
  const state = createInitialState();

  for (let i = 0; i < chunkList.length; i++) {
    const chunk = chunkList[i];
    const nextChunk = chunkList[i + 1];

    applyIndentationIfNeeded(state);
    checkAndSetCursorPosition(state, chunk);
    updateActiveGroups(state, chunk);
    appendChunkText(state, chunk);
    updateIndentationState(state, chunk);

    handleComments(state, chunk);

    if (shouldBreak(chunk, state)) {
      processLineBreak(state, chunk, nextChunk);
      continue;
    }

    if (!doesNotWantSpace(chunk, nextChunk)) {
      state.formatted += ' ';
      state.column++;
    }
  }

  appendRemainingComments(state);
  validateFinalState(state);

  return {
    formattedString: state.formatted.trimEnd(),
    cursorPos: state.cursorPos,
  };
}

/**
 * Creates the initial state object for formatting process
 */
function createInitialState(): State {
  return {
    formatted: '',
    cursorPos: 0,
    indentation: 0,
    column: 0,
    activeGroups: [] as Group[],
    activeIndentations: [] as IndentationModifier[],
    pendingComments: [] as string[],
  };
}

/**
 * Applies appropriate indentation after a newline
 */
function applyIndentationIfNeeded(state: State) {
  if (state.formatted.endsWith('\n')) {
    state.formatted += ' '.repeat(state.indentation);
    state.column = state.indentation;
  }
}

/**
 * Sets the cursor position if this chunk is a cursor
 */
function checkAndSetCursorPosition(state: State, chunk: Chunk) {
  if (chunk.isCursor) {
    state.cursorPos = state.formatted.length;
  }
}

/**
 * Appends the chunk text to the formatted string
 */
function appendChunkText(state: State, chunk: Chunk) {
  state.formatted += chunk.text;
  state.column += chunk.text.length;
}

/**
 * Handles comments in the current chunk
 */
function handleComments(state: State, chunk: Chunk) {
  if (chunk.comment) {
    state.pendingComments.push(chunk.comment);
  }
}

/**
 * Processes line breaks and handles pending comments
 */
function processLineBreak(state: State, chunk: Chunk, nextChunk?: Chunk) {
  appendPendingComments(state);

  if (!nextChunk?.text.startsWith('\n')) {
    state.formatted += '\n';
  }

  if (chunk.doubleBreak) {
    state.formatted += '\n';
  }
}

/**
 * Appends all pending comments and clears the list
 */
function appendPendingComments(state: State) {
  for (const comment of state.pendingComments) {
    state.formatted += ' ';
    state.formatted += comment;
  }
  state.pendingComments.length = 0;
}

/**
 * Appends State remaining comments at the end of processing
 */
function appendRemainingComments(state: State) {
  for (const comment of state.pendingComments) {
    state.formatted += comment;
  }
}

/**
 * Validates the final state to ensure no errors
 */
function validateFinalState(state: State) {
  if (state.indentation !== 0 || state.activeIndentations.length > 0) {
    throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
  }
  if (state.activeGroups.length > 0) {
    throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
  }
}
