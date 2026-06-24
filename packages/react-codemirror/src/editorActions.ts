import { StateEffect, StateField, type Extension } from '@codemirror/state';
import {
  Decoration,
  EditorView,
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
 */

const SPACER_BOTTOM_GAP = 2;
const SPACER_LEFT_GAP = 4;

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

    ignoreEvent(): boolean {
      return true;
    }
  }

  const spacer = EditorView.decorations.compute(
    ['doc', activeField],
    (state) => {
      if (!state.field(activeField) || state.doc.length === 0) {
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
            '--cm-editor-actions-height',
            `${container.offsetHeight}px`,
          );
          view.dom.style.setProperty(
            '--cm-editor-actions-content-min-height',
            `${container.offsetHeight + SPACER_BOTTOM_GAP}px`,
          );
          this.align(view);
        });
        this.resizeObserver.observe(container);
        this.dom = container;
        this.mounted = callbacksRef;
        callbacksRef?.onMount(container);
        this.align(view);
      }

      private align(view: EditorView): void {
        view.requestMeasure<{ top: number; right: number } | null>({
          read: () => {
            if (!this.dom) {
              return null;
            }
            const editorRect = view.dom.getBoundingClientRect();
            const spacer = view.dom.querySelector('.cm-editor-actions-spacer');
            let topClient: number;
            let rightClient: number;
            if (spacer) {
              const rect = spacer.getBoundingClientRect();
              topClient = rect.top;
              rightClient = rect.right;
            } else {
              const rect = view.contentDOM.getBoundingClientRect();
              const style = window.getComputedStyle(view.contentDOM);
              topClient = rect.top + (parseFloat(style.paddingTop) || 0);
              rightClient = rect.right - (parseFloat(style.paddingRight) || 0);
            }
            return {
              top: topClient - editorRect.top + view.scrollDOM.scrollTop,
              right: editorRect.right - rightClient - view.scrollDOM.scrollLeft,
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
