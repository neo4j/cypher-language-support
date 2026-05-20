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
};

export function createInlinePanelController(): InlinePanelController {
  const showEffect = StateEffect.define<ShowPayload>();

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
      this.options.onMount(container);
      return container;
    }

    destroy(): void {
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
      this.options.onUnmount();
    }

    eq(other: InlinePanelWidget): boolean {
      return other.options === this.options;
    }

    ignoreEvent(): boolean {
      return true;
    }
  }

  const field = StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update(decorations, transaction) {
      let next: DecorationSet | null = null;
      for (const effect of transaction.effects) {
        if (effect.is(showEffect)) {
          if (effect.value === null) {
            next = Decoration.none;
          } else {
            const side = effect.value.placement === 'below' ? 1 : -1;
            next = Decoration.set([
              Decoration.widget({
                widget: new InlinePanelWidget(effect.value),
                block: true,
                side,
              }).range(effect.value.pos),
            ]);
          }
        }
      }
      if (next !== null) {
        return next;
      }
      return decorations.map(transaction.changes);
    },
    provide: (f) => EditorView.decorations.from(f),
  });

  return {
    extension: field,
    show: (options) => showEffect.of(options),
    hide: () => showEffect.of(null),
  };
}
