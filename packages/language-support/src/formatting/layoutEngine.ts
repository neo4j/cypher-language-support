import {
  Chunk,
  Group,
  IndentationModifier,
  INTERNAL_FORMAT_ERROR_MESSAGE,
  isInlineComment,
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

function shouldBreak(state: State, chunk: Chunk, nextChunk: Chunk): boolean {
  if (chunk.type === 'COMMENT') return true;

  if (chunk.type !== 'SYNTAX_ERROR' && chunk.noBreak) {
    return false;
  }

  if (applySpecialBreak(state, chunk, nextChunk)) {
    return false;
  }

  return (
    chunk.mustBreak ||
    chunk.doubleBreak ||
    state.activeGroups.at(-1)?.shouldBreak
  );
}

function updateActiveGroups(
  state: State,
  chunk: Chunk,
  maxColumn: number,
): void {
  for (const group of chunk.groupsStarting) {
    const breaksAll =
      state.column + group.size > maxColumn || group.shouldBreak;
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

function updateIndentationState(state: State, chunk: Chunk, nextChunk: Chunk) {
  for (const indent of chunk.indentation) {
    if (applySpecialBreak(state, chunk, nextChunk)) {
      indent.removeReference.isApplied = false;
    } else if (indent.change === 1) {
      state.activeIndentations.push(indent);
      state.indentation += INDENTATION_SPACES;
    }
    if (indent.change === -1) {
      const indexToRemove = state.activeIndentations.findIndex(
        (item) => item.id === indent.id,
      );

      if (!state.activeIndentations[indexToRemove]?.isApplied) {
        continue;
      }

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
  if (isInlineComment(chunk)) {
    // Inline comment - append directly
    state.formatted += ' ';
    state.formatted += chunk.comment;
    state.column += chunk.comment.length;
    // Always include space after, even if the chunk has noSpace
    if (chunk.type === 'REGULAR' && chunk.noSpace) {
      state.formatted += ' ';
      state.column++;
    }
    return;
  }
  if (chunk.comment) {
    // For regular comments, we store them to append later
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

function applySpecialBreak(state: State, chunk: Chunk, nextChunk: Chunk) {
  // First, check if the next chunk is a special split
  // because that one includes the allowance of special split, opening bracket e.g.
  // Current chunk has oneItem set only if it has one child
  // Lastly we should not special split if the chunk contains comment
  // as it might cause the comment to refer to the wrong thing
  return nextChunk?.specialSplit && chunk.oneItem && !chunk.comment;
}

export function chunksToFormattedString(
  chunkList: Chunk[],
  maxColumn: number,
): FinalResultWithPos {
  const state = createInitialState();

  for (let i = 0; i < chunkList.length; i++) {
    const chunk = chunkList[i];
    const nextChunk: Chunk = chunkList[i + 1];

    applyIndentationIfNeeded(state);
    checkAndSetCursorPosition(state, chunk);
    updateActiveGroups(state, chunk, maxColumn);
    appendChunkText(state, chunk);
    updateIndentationState(state, chunk, nextChunk);
    handleComments(state, chunk);

    if (shouldBreak(state, chunk, nextChunk)) {
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
