import {
  Chunk,
  doesNotWantSpace,
  IndentationModifier,
  INTERNAL_FORMAT_ERROR_MESSAGE,
  MAX_COL,
  shouldBreak,
} from './formattingHelpers';

const INDENTATION_SPACES = 2;

interface FinalResultWithPos {
  formattedString: string;
  cursorPos: number;
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

function calculateColumn(text: string): number {
  // Handle empty string case
  if (!text) {
    return 0;
  }

  // If the last character is a newline, return 0
  if (text.charAt(text.length - 1) === '\n') {
    return 0;
  }

  // Find the last newline character
  const lastNewlineIndex = text.lastIndexOf('\n');

  // If no newline found, column is the length of the entire string
  if (lastNewlineIndex === -1) {
    return text.length;
  }

  // Return the length of the text after the last newline
  return text.length - lastNewlineIndex - 1;
}

function handleGroups(
  activeGroups: Group[],
  chunk: Chunk,
  column: number,
): void {
  if (chunk.type === 'REGULAR') {
    for (const group of chunk.groupsStarting) {
      const breaksAll = column + group.size > MAX_COL || group.breaksAll;
      activeGroups.push({ ...group, breaksAll });
    }
    for (const group of chunk.groupsEnding) {
      const indexToRemove = activeGroups.findIndex(
        (item) => item.id === group.id,
      );

      // Remove the item if found
      if (indexToRemove !== -1) {
        activeGroups.splice(indexToRemove, 1);
      }
    }
  }
}

function handleIndentations(
  activeIndentations: IndentationModifier[],
  chunk: Chunk,
  indentation: number,
): number {
  for (const indent of chunk.indentation) {
    if (indent.change === 1) {
      activeIndentations.push(indent);
      indentation += INDENTATION_SPACES;
    }
    if (indent.change === -1) {
      const indexToRemove = activeIndentations.findIndex(
        (item) => item.id === indent.id,
      );
      // Remove the item if found
      if (indexToRemove !== -1) {
        activeIndentations.splice(indexToRemove, 1);
        indentation -= INDENTATION_SPACES;
      }
    }
  }
  return indentation;
}
export function buffersToFormattedString(
  chunkList: Chunk[],
): FinalResultWithPos {
  let formatted = '';
  let cursorPos = 0;
  let indentation = 0;
  const activeGroups: Group[] = [];
  const activeIndentations: IndentationModifier[] = [];
  const pendingComments: string[] = [];

  for (let i = 0; i < chunkList.length; i++) {
    const chunk = chunkList[i];
    if (formatted.endsWith('\n')) {
      formatted += ' '.repeat(indentation);
    }
    if (chunk.isCursor) {
      cursorPos = formatted.length;
    }
    handleGroups(activeGroups, chunkList[i], calculateColumn(formatted));
    formatted += chunk.text;
    indentation = handleIndentations(activeIndentations, chunk, indentation);
    if (chunk.comment) {
      pendingComments.push(chunk.comment);
    }
    if (shouldBreak(chunk, activeGroups)) {
      for (const comment of pendingComments) {
        formatted += ' ';
        formatted += comment;
      }
      pendingComments.length = 0;
      if (!chunkList[i + 1]?.text.startsWith('\n')) {
        formatted += '\n';
      }
      if (chunk.doubleBreak) {
        formatted += '\n';
      }
      continue;
    }

    if (chunk.noSpace || doesNotWantSpace(chunk, chunkList[i + 1])) {
      formatted += '';
      continue;
    }
    formatted += ' ';
  }
  for (const comment of pendingComments) {
    formatted += comment;
  }

  if (indentation !== 0 || activeIndentations.length > 0) {
    throw new Error(INTERNAL_FORMAT_ERROR_MESSAGE);
  }
  return { formattedString: formatted.trimEnd(), cursorPos: cursorPos };
}
