import { unifiedMergeView } from '@codemirror/merge';
import type { Extension } from '@codemirror/state';

/**
 * Props for rendering an inline diff in the editor.
 *
 * The diff is computed between {@link DiffProps.original} and the *current*
 * editor document, so streaming/external updates to the document re-diff
 * automatically against the same original.
 */
export type DiffProps = {
  /** The baseline document the current editor content is compared against. */
  original: string;
};

export function createDiffExtension({ original }: DiffProps): Extension {
  return unifiedMergeView({
    original,
    highlightChanges: true,
    syntaxHighlightDeletions: true,
    mergeControls: false,
    gutter: true,
  });
}
