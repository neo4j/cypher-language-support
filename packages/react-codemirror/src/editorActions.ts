import { StateEffect, StateField, type Extension } from '@codemirror/state';
import {
  Decoration,
  EditorView,
  type Rect,
  ViewPlugin,
  type ViewUpdate,
  WidgetType,
} from '@codemirror/view';
import type { HostPortalCallbacks } from './hostCallbacks';

/** Lifecycle callbacks for the editor action buttons. See {@link HostPortalCallbacks}. */
export type EditorActionsCallbacks = HostPortalCallbacks;

export type EditorActionsController = {
  /** CodeMirror extension to register on the editor. */
  extension: Extension;
  /**
   * Drive the action buttons from the host's state: pass callbacks to mount
   * them, or `null` to unmount. Returns the effect for the host to dispatch.
   *
   * Visibility is purely a function of whether callbacks exist — there's no
   * separate show/hide toggle.
   */
  set: (callbacks: EditorActionsCallbacks | null) => StateEffect<boolean>;
};

/**
 * Renders a host-provided cluster of action buttons at the top-right corner
 * of the editor.
 *
 * The cluster is split into two cooperating pieces so it can both reserve
 * space *and* stay pinned — which a single element can't do (reserving needs
 * to be in flow, pinning needs to be out of it):
 *
 *  - A **spacer**: an empty, floated inline widget at the very start of the
 *    document. Being in flow, it makes the first line's text wrap around it —
 *    and because it's a float, the browser handles arbitrary cluster heights.
 *    It carries no content; it only reserves the footprint.
 *  - An **overlay**: the real, host-rendered buttons in a container pinned
 *    `absolute` on the editor element (which does not scroll). It never moves
 *    when the document grows, when an inline panel opens above the first line,
 *    or when the content scrolls — content simply scrolls behind it.
 *
 * The overlay is measured against the scroller's visible box rather than
 * against the spacer or the content: the spacer moves down the document
 * whenever something renders above the first line (an inline panel, the
 * deleted lines of a diff), and the content reaches past the right edge as
 * soon as it overflows.
 * Vertically the cluster is centred on the first line.
 */

const SPACER_BOTTOM_GAP = 2;
const SPACER_LEFT_GAP = 4;
/**
 * Floor for the overlay's inset from the visible right edge, so it stays off
 * the content's last pixel even if a theme zeroes `.cm-line`'s right padding
 * (the base theme's 2px, which is what normally provides the inset).
 */
const MIN_OVERLAY_RIGHT_INSET = 2;

export function createEditorActionsController(): EditorActionsController {
  const setActiveEffect = StateEffect.define<boolean>();

  let callbacksRef: EditorActionsCallbacks | null = null;

  const activeField = StateField.define<boolean>({
    create: () => false,
    update(active, transaction) {
      for (const effect of transaction.effects) {
        if (effect.is(setActiveEffect)) {
          active = effect.value;
        }
      }
      return active;
    },
  });

  class SpacerWidget extends WidgetType {
    toDOM(): HTMLElement {
      const spacer = document.createElement('div');
      spacer.className = 'cm-editor-actions-spacer';
      spacer.setAttribute('aria-hidden', 'true');
      return spacer;
    }

    eq(): boolean {
      return true;
    }

    /**
     * The spacer floats right, so CodeMirror's default — the widget's own box —
     * puts the caret at the right edge of the cluster whenever the spacer is
     * the only thing it can measure on the first line (an empty document).
     * Report the start of the line's inline content instead: the node after
     * the spacer (text, a placeholder, or CodeMirror's trailing `<br>`).
     */
    coordsAt(dom: HTMLElement): Rect | null {
      const next = dom.nextSibling;
      if (!next) {
        return null;
      }
      let rects: DOMRectList;
      if (next instanceof Element) {
        rects = next.getClientRects();
      } else {
        const range = document.createRange();
        range.selectNodeContents(next);
        rects = range.getClientRects();
      }
      const rect = rects[0];
      if (!rect) {
        return null;
      }
      return {
        left: rect.left,
        right: rect.left,
        top: rect.top,
        bottom: rect.bottom,
      };
    }

    ignoreEvent(): boolean {
      return true;
    }
  }

  const spacer = EditorView.decorations.compute(
    ['doc', activeField],
    (state) => {
      if (!state.field(activeField)) {
        return Decoration.none;
      }
      return Decoration.set([
        Decoration.widget({
          widget: new SpacerWidget(),
          side: -1,
        }).range(0),
      ]);
    },
  );

  const overlay = ViewPlugin.fromClass(
    class {
      private dom: HTMLElement | null = null;
      private resizeObserver: ResizeObserver | null = null;
      private mounted: EditorActionsCallbacks | null = null;

      constructor(view: EditorView) {
        if (view.state.field(activeField)) {
          this.mount(view);
        }
      }

      update(update: ViewUpdate): void {
        const isActive = update.state.field(activeField);
        if (isActive && !this.dom) {
          this.mount(update.view);
        } else if (!isActive && this.dom) {
          this.unmount();
        } else if (
          this.dom &&
          (update.geometryChanged ||
            update.docChanged ||
            update.viewportChanged)
        ) {
          this.align(update.view);
        }
      }

      destroy(): void {
        this.unmount();
      }

      private mount(view: EditorView): void {
        const container = document.createElement('div');
        container.className = 'cm-editor-actions';
        view.dom.appendChild(container);
        this.resizeObserver = new ResizeObserver(() => {
          view.dom.style.setProperty(
            '--cm-editor-actions-width',
            `${container.offsetWidth}px`,
          );
          view.dom.style.setProperty(
            '--cm-editor-actions-reserved-width',
            `${container.offsetWidth + SPACER_LEFT_GAP}px`,
          );
          // The spacer's height follows the overlay's position, so `align`
          // owns it.
          this.align(view);
        });
        this.resizeObserver.observe(container);
        this.dom = container;
        this.mounted = callbacksRef;
        callbacksRef?.onMount(container);
        this.align(view);
      }

      private align(view: EditorView): void {
        view.requestMeasure<{
          top: number;
          right: number;
          spacerHeight: number;
          contentMinHeight: number;
        } | null>({
          read: () => {
            if (!this.dom) {
              return null;
            }
            const editorRect = view.dom.getBoundingClientRect();
            const scrollerRect = view.scrollDOM.getBoundingClientRect();
            const style = window.getComputedStyle(view.contentDOM);
            const visibleRight = scrollerRect.left + view.scrollDOM.clientWidth;
            // Match the inset `.cm-line`'s right padding gives the spacer, so
            // the overlay lands on the space the spacer reserves and stays off
            // `contentRect.right - 1`, the pixel CodeMirror hit-tests to
            // measure a wrapped line's selection. Cover it and the first
            // line's highlight collapses to zero width — hence the floor.
            const line = view.contentDOM.querySelector('.cm-line');
            const lineRightPadding = line
              ? parseFloat(window.getComputedStyle(line).paddingRight) || 0
              : 0;

            const contentPaddingTop = parseFloat(style.paddingTop) || 0;
            const height = this.dom.offsetHeight;
            // How far the cluster has to rise above the first line's top to
            // sit centred on it, limited to the padding it can rise into.
            const lift = Math.min(
              Math.max((height - view.defaultLineHeight) / 2, 0),
              contentPaddingTop,
            );

            return {
              top: scrollerRect.top - editorRect.top + contentPaddingTop - lift,
              right:
                editorRect.right -
                visibleRight +
                (parseFloat(style.paddingRight) || 0) +
                Math.max(lineRightPadding, MIN_OVERLAY_RIGHT_INSET),
              // The spacer starts at the first line's top, so it only needs to
              // clear the part of the cluster that hangs below it.
              spacerHeight: height - lift,
              // A floor under the content, so an empty document is still tall
              // enough to hold the overlay.
              contentMinHeight: contentPaddingTop - lift + height,
            };
          },
          write: (pos) => {
            if (!pos || !this.dom) {
              return;
            }
            view.dom.style.setProperty(
              '--cm-editor-actions-top',
              `${pos.top}px`,
            );
            view.dom.style.setProperty(
              '--cm-editor-actions-right',
              `${pos.right}px`,
            );
            view.dom.style.setProperty(
              '--cm-editor-actions-height',
              `${pos.spacerHeight}px`,
            );
            view.dom.style.setProperty(
              '--cm-editor-actions-content-min-height',
              `${pos.contentMinHeight}px`,
            );
          },
        });
      }

      private unmount(): void {
        if (!this.dom) {
          return;
        }
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
        this.mounted?.onUnmount();
        this.mounted = null;
        const root = this.dom?.parentElement;
        if (root) {
          root.style.removeProperty('--cm-editor-actions-width');
          root.style.removeProperty('--cm-editor-actions-height');
          root.style.removeProperty('--cm-editor-actions-content-min-height');
          root.style.removeProperty('--cm-editor-actions-reserved-width');
          root.style.removeProperty('--cm-editor-actions-top');
          root.style.removeProperty('--cm-editor-actions-right');
        }
        this.dom?.remove();
        this.dom = null;
      }
    },
  );

  const theme = EditorView.theme({
    '.cm-content': {
      minHeight: 'var(--cm-editor-actions-content-min-height, 0px)',
    },
    '.cm-editor-actions-spacer': {
      float: 'right',
      boxSizing: 'content-box',
      width: 'var(--cm-editor-actions-width, 0px)',
      height: 'var(--cm-editor-actions-height, 0px)',
      paddingLeft: `${SPACER_LEFT_GAP}px`,
      paddingBottom: `${SPACER_BOTTOM_GAP}px`,
      userSelect: 'none',
      WebkitUserSelect: 'none',
      pointerEvents: 'none',
    },
    // The spacer only clears the first line, so a panel above it makes its own room.
    '.cm-inline-panel': {
      paddingRight: 'var(--cm-editor-actions-reserved-width, 0px)',
    },
    '.cm-placeholder': {
      display: 'inline',
    },
    '.cm-editor-actions': {
      position: 'absolute',
      top: 'var(--cm-editor-actions-top, 0px)',
      right: 'var(--cm-editor-actions-right, 0px)',
      zIndex: '2',
      userSelect: 'none',
      WebkitUserSelect: 'none',
    },
  });

  return {
    extension: [activeField, spacer, overlay, theme],
    set: (callbacks) => {
      callbacksRef = callbacks;
      return setActiveEffect.of(callbacks !== null);
    },
  };
}
