import {
  Chunk,
  Group,
  IndentationModifier,
  INTERNAL_FORMAT_ERROR_MESSAGE,
  MAX_COL,
  shouldAddSpace,
} from './formattingHelpers';

const INDENTATION_SPACES = 2;

interface FinalResultWithPos {
  formatted: string;
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

function shouldBreak(chunk: Chunk, nextChunk: Chunk, state: State): boolean {
  if (chunk.type === 'COMMENT') return true;

  if (chunk.type !== 'SYNTAX_ERROR' && chunk.noBreak) {
    return false;
  }

  if (nextChunk?.specialSplit && chunk.oneItem) {
    return false;
  }

  return (
    chunk.mustBreak ||
    chunk.doubleBreak ||
    state.activeGroups.at(-1)?.shouldBreak
  );
}

function updateActiveGroups(state: State, chunk: Chunk): void {
  for (const group of chunk.groupsStarting) {
    const breaksAll = state.column + group.size > MAX_COL || group.shouldBreak;
    state.activeGroups.push({ ...group, shouldBreak: breaksAll });
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

      if (indexToRemove !== -1) {
        state.activeIndentations.splice(indexToRemove, 1);
        state.indentation -= INDENTATION_SPACES;
      } else {
        throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
      }
    }
  }
}

function createInitialState(): State {
  return {
    formatted: '',
    cursorPos: 0,
    indentation: 0,
    column: 0,
    activeGroups: [],
    activeIndentations: [],
    pendingComments: [],
  };
}

function applyIndentationIfNeeded(state: State) {
  if (state.formatted.endsWith('\n')) {
    state.formatted += ' '.repeat(state.indentation);
    state.column = state.indentation;
  }
}

function checkAndSetCursorPosition(state: State, chunk: Chunk) {
  if (chunk.isCursor) {
    state.cursorPos = state.formatted.length;
  }
}

function appendChunkText(state: State, chunk: Chunk) {
  state.formatted += chunk.text;
  state.column += chunk.text.length;
}

function handleComments(state: State, chunk: Chunk) {
  if (chunk.comment) {
    state.pendingComments.push(chunk.comment);
  }
}

function processLineBreak(state: State, chunk: Chunk, nextChunk?: Chunk) {
  appendPendingComments(state);

  if (!nextChunk?.text.startsWith('\n')) {
    state.formatted += '\n';
  }

  if (chunk.doubleBreak) {
    state.formatted += '\n';
  }
}

function appendPendingComments(state: State) {
  for (const comment of state.pendingComments) {
    state.formatted += ' ';
    state.formatted += comment;
  }
  state.pendingComments.length = 0;
}

function appendRemainingComments(state: State) {
  for (const comment of state.pendingComments) {
    state.formatted += comment;
  }
}

function validateFinalState(state: State) {
  if (state.indentation !== 0 || state.activeIndentations.length > 0) {
    throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
  }
  if (state.activeGroups.length > 0) {
    throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
  }
}

export function chunksToFormattedString(
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

    if (shouldBreak(chunk, nextChunk, state)) {
      processLineBreak(state, chunk, nextChunk);
      continue;
    }

    if (shouldAddSpace(chunk, nextChunk)) {
      state.formatted += ' ';
      state.column++;
    }
  }

  appendRemainingComments(state);
  validateFinalState(state);

  return {
    formatted: state.formatted.trimEnd(),
    cursorPos: state.cursorPos,
  };
}
