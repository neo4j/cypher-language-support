import { StateEffect, StateField, type Extension } from '@codemirror/state';
import {
  Decoration,
  type DecorationSet,
  EditorView,
  WidgetType,
} from '@codemirror/view';

/**
 * Lifecycle callbacks for an inline panel. The host renders into the
 * provided DOM container (e.g. via React `createPortal`) and is expected
 * to clean up on unmount.
 */
export type InlinePanelCallbacks = {
  onMount: (container: HTMLElement) => void;
  onUnmount: () => void;
};

export type InlinePanelShowOptions = {
  /** Document position the panel anchors to. */
  pos: number;
  /**
   * Where to render the panel relative to the line at `pos`. `'above'`
   * places it before the line, `'below'` after it.
   *
   * @default 'above'
   */
  placement?: 'above' | 'below';
} & InlinePanelCallbacks;

type ShowPayload = InlinePanelShowOptions | null;

export type InlinePanelController = {
  /** CodeMirror extension to register on the editor. */
  extension: Extension;
  /** Build an effect that mounts the panel with the given options. */
  show: (options: InlinePanelShowOptions) => StateEffect<ShowPayload>;
  /** Build an effect that unmounts the panel. */
  hide: () => StateEffect<ShowPayload>;
  updateCallbacks: (callbacks: InlinePanelCallbacks) => void;
};

export function createInlinePanelController(): InlinePanelController {
  const showEffect = StateEffect.define<ShowPayload>();

  let callbacksRef: InlinePanelCallbacks | null = null;

  class InlinePanelWidget extends WidgetType {
    private resizeObserver: ResizeObserver | null = null;

    constructor(readonly options: InlinePanelShowOptions) {
      super();
    }

    toDOM(view: EditorView): HTMLElement {
      const container = document.createElement('div');
      container.className = 'cm-inline-panel';
      this.resizeObserver = new ResizeObserver(() => view.requestMeasure());
      this.resizeObserver.observe(container);
      callbacksRef?.onMount(container);
      return container;
    }

    destroy(): void {
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
      callbacksRef?.onUnmount();
    }

    eq(other: InlinePanelWidget): boolean {
      return (
        other.options.pos === this.options.pos &&
        other.options.placement === this.options.placement
      );
    }

    ignoreEvent(): boolean {
      return true;
    }
  }

  const buildDecoration = (options: InlinePanelShowOptions): DecorationSet =>
    Decoration.set([
      Decoration.widget({
        widget: new InlinePanelWidget(options),
        block: true,
        side: options.placement === 'below' ? 1 : -1,
      }).range(options.pos),
    ]);

  const readOptions = (
    decorations: DecorationSet,
  ): InlinePanelShowOptions | null => {
    const widget = decorations.iter().value?.spec?.widget;
    return widget instanceof InlinePanelWidget ? widget.options : null;
  };

  const field = StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update(decorations, transaction) {
      for (const effect of transaction.effects) {
        if (effect.is(showEffect)) {
          return effect.value === null
            ? Decoration.none
            : buildDecoration(effect.value);
        }
      }

      // Nothing to do when the panel is closed, or when the document is unchanged
      if (decorations.size === 0 || !transaction.docChanged) {
        return decorations.map(transaction.changes);
      }

      // Re-anchor manually because CodeMirror's default mapping silently drops block-widget decorations when their anchor line is deleted.
      const options = readOptions(decorations);
      if (options === null) {
        return decorations.map(transaction.changes);
      }
      const side = options.placement === 'below' ? 1 : -1;
      const mappedPos = transaction.changes.mapPos(options.pos, side);
      const line = transaction.newDoc.lineAt(mappedPos);
      return buildDecoration({
        ...options,
        pos: side === 1 ? line.to : line.from,
      });
    },
    provide: (f) => EditorView.decorations.from(f),
  });

  return {
    extension: field,
    show: (options) => showEffect.of(options),
    hide: () => showEffect.of(null),
    updateCallbacks: (callbacks) => {
      callbacksRef = callbacks;
    },
  };
}
